import { getDb } from "../config/db.js"

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

export async function getAllUsers() {
  const db = getDb()
  const [rows] = await db.query(
    `SELECT id, username, email, password_hash, role, account_type, is_verified, is_active, last_login, created_at, updated_at
     FROM users
     ORDER BY id DESC`,
  )

  return rows.map(mapUser)
}

export async function findUserByEmail(email) {
  const db = getDb()
  const normalizedEmail = email.trim().toLowerCase()
  const [rows] = await db.query(
    `SELECT id, username, email, password_hash, role, account_type, is_verified, is_active, last_login, created_at, updated_at
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [normalizedEmail],
  )

  return mapUser(rows[0])
}

export async function findUserById(id) {
  const db = getDb()
  const [rows] = await db.query(
    `SELECT id, username, email, password_hash, role, account_type, is_verified, is_active, last_login, created_at, updated_at
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [id],
  )

  return mapUser(rows[0])
}

export async function createUser({ name, email, passwordHash, role = "user" }) {
  const db = getDb()
  const normalizedName = name.trim()
  const normalizedEmail = email.trim().toLowerCase()

  const [result] = await db.query(
    `INSERT INTO users (username, email, password_hash, role, account_type, is_verified, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'free', 0, 1, NOW(), NOW())`,
    [normalizedName, normalizedEmail, passwordHash, role],
  )

  return findUserById(result.insertId)
}

export async function touchLastLogin(userId) {
  const db = getDb()
  await db.query(
    `UPDATE users
     SET last_login = NOW(), updated_at = NOW()
     WHERE id = ?`,
    [userId],
  )
}
