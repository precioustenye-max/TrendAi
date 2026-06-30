import { getDb } from "../config/db.js"

export async function createContactMessageRecord({ name, email, subject = null, message }) {
  const db = getDb()
  const [result] = await db.query(
    `INSERT INTO contact_messages (name, email, subject, message, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'new', NOW(), NOW())`,
    [name, email, subject, message],
  )

  return {
    id: result.insertId,
    name,
    email,
    subject,
    message,
    status: "new",
  }
}
