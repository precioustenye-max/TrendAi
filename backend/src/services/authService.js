import crypto from "node:crypto"

import { env } from "../config/env.js"
import { signToken, verifyToken } from "../utils/generateToken.js"
import { createUser, findUserByEmail, findUserById, touchLastLogin } from "../models/User.js"

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex")
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${derivedKey}`
}

function verifyPassword(password, storedHash) {
  const [salt, expectedHash] = storedHash.split(":")

  if (!salt || !expectedHash) {
    return false
  }

  const derivedKey = crypto.scryptSync(password, salt, 64)
  const expectedBuffer = Buffer.from(expectedHash, "hex")

  if (derivedKey.length !== expectedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(derivedKey, expectedBuffer)
}

export function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }
}

export function buildAuthResponse(user) {
  const token = signToken(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    env.jwtSecret,
  )

  return {
    token,
    user: sanitizeUser(user),
  }
}

export async function registerUser({ name, email, password }) {
  const existingUser = await findUserByEmail(email)

  if (existingUser) {
    const error = new Error("An account with this email already exists")
    error.statusCode = 409
    throw error
  }

  const user = await createUser({
    name,
    email,
    passwordHash: hashPassword(password),
  })

  return buildAuthResponse(user)
}

export async function loginUser({ email, password }) {
  const user = await findUserByEmail(email)

  if (!user || !verifyPassword(password, user.passwordHash)) {
    const error = new Error("Invalid email or password")
    error.statusCode = 401
    throw error
  }

  await touchLastLogin(user.id)
  return buildAuthResponse(user)
}

export async function getUserFromToken(token) {
  const payload = verifyToken(token, env.jwtSecret)

  if (!payload) {
    const error = new Error("Invalid or expired token")
    error.statusCode = 401
    throw error
  }

  const user = await findUserById(payload.sub)

  if (!user) {
    const error = new Error("User not found")
    error.statusCode = 404
    throw error
  }

  return sanitizeUser(user)
}
