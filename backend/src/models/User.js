import crypto from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"

import { getDb } from "../config/db.js"

const usersFilePath = path.resolve(process.cwd(), "data/users.json")

function mapUser(row) {
  if (!row) {
    return null
  }

  return {
    id: row.id,
    name: row.username,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    accountType: row.account_type,
    isVerified: Boolean(row.is_verified),
    isActive: Boolean(row.is_active),
    lastLogin: row.last_login,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

async function readJsonUsers() {
  try {
    const content = await fs.readFile(usersFilePath, "utf8")
    return JSON.parse(content)
  } catch (error) {
    if (error.code === "ENOENT") {
      return []
    }

    throw error
  }
}

async function writeJsonUsers(users) {
  await fs.mkdir(path.dirname(usersFilePath), { recursive: true })
  await fs.writeFile(usersFilePath, `${JSON.stringify(users, null, 2)}\n`)
}

function normalizeJsonUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    role: user.role || "user",
    accountType: user.accountType || "free",
    isVerified: Boolean(user.isVerified),
    isActive: user.isActive !== false,
    lastLogin: user.lastLogin || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt || user.createdAt,
  }
}

function shouldUseJsonStore(error) {
  return ["ECONNREFUSED", "EPERM", "ENOTFOUND", "ER_ACCESS_DENIED_ERROR", "ER_BAD_DB_ERROR"].includes(
    error?.code,
  )
}

export async function getAllUsers() {
  try {
    const db = getDb()
    const [rows] = await db.query(
      `SELECT id, username, email, password_hash, role, account_type, is_verified, is_active, last_login, created_at, updated_at
       FROM users
       ORDER BY id DESC`,
    )

    return rows.map(mapUser)
  } catch (error) {
    if (!shouldUseJsonStore(error)) {
      throw error
    }

    const users = await readJsonUsers()
    return users.map(normalizeJsonUser).reverse()
  }
}

export async function findUserByEmail(email) {
  const normalizedEmail = email.trim().toLowerCase()

  try {
    const db = getDb()
    const [rows] = await db.query(
      `SELECT id, username, email, password_hash, role, account_type, is_verified, is_active, last_login, created_at, updated_at
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [normalizedEmail],
    )

    return mapUser(rows[0])
  } catch (error) {
    if (!shouldUseJsonStore(error)) {
      throw error
    }

    const users = await readJsonUsers()
    const user = users.find((item) => item.email.toLowerCase() === normalizedEmail)
    return user ? normalizeJsonUser(user) : null
  }
}

export async function findUserById(id) {
  try {
    const db = getDb()
    const [rows] = await db.query(
      `SELECT id, username, email, password_hash, role, account_type, is_verified, is_active, last_login, created_at, updated_at
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [id],
    )

    return mapUser(rows[0])
  } catch (error) {
    if (!shouldUseJsonStore(error)) {
      throw error
    }

    const users = await readJsonUsers()
    const user = users.find((item) => String(item.id) === String(id))
    return user ? normalizeJsonUser(user) : null
  }
}

export async function createUser({ name, email, passwordHash, role = "user" }) {
  const normalizedName = name.trim()
  const normalizedEmail = email.trim().toLowerCase()

  try {
    const db = getDb()
    const [result] = await db.query(
      `INSERT INTO users (username, email, password_hash, role, account_type, is_verified, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'free', 0, 1, NOW(), NOW())`,
      [normalizedName, normalizedEmail, passwordHash, role],
    )

    return findUserById(result.insertId)
  } catch (error) {
    if (!shouldUseJsonStore(error)) {
      throw error
    }

    const users = await readJsonUsers()
    const now = new Date().toISOString()
    const user = {
      id: crypto.randomUUID(),
      name: normalizedName,
      email: normalizedEmail,
      passwordHash,
      role,
      accountType: "free",
      isVerified: false,
      isActive: true,
      lastLogin: null,
      createdAt: now,
      updatedAt: now,
    }

    users.push(user)
    await writeJsonUsers(users)
    return normalizeJsonUser(user)
  }
}

export async function touchLastLogin(userId) {
  try {
    const db = getDb()
    await db.query(
      `UPDATE users
       SET last_login = NOW(), updated_at = NOW()
       WHERE id = ?`,
      [userId],
    )
  } catch (error) {
    if (!shouldUseJsonStore(error)) {
      throw error
    }

    const users = await readJsonUsers()
    const now = new Date().toISOString()
    const updatedUsers = users.map((user) =>
      String(user.id) === String(userId) ? { ...user, lastLogin: now, updatedAt: now } : user,
    )
    await writeJsonUsers(updatedUsers)
  }
}
