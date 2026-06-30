import { getDb } from "../config/db.js"

function mapUpload(row) {
  if (!row) {
    return null
  }

  return {
    id: row.id,
    userId: row.user_id,
    filename: row.filename,
    originalName: row.original_name,
    mimeType: row.mime_type,
    size: Number(row.size),
    localPath: row.local_path,
    publicUrl: row.public_url,
    provider: row.provider,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function createUploadRecord({
  userId,
  filename,
  originalName,
  mimeType,
  size,
  localPath,
  publicUrl = null,
  provider = "local",
}) {
  const db = getDb()
  const [result] = await db.query(
    `INSERT INTO uploads (user_id, filename, original_name, mime_type, size, local_path, public_url, provider, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [userId, filename, originalName, mimeType, size, localPath, publicUrl, provider],
  )

  return findUploadById(result.insertId, userId)
}

export async function findUploadById(id, userId) {
  const db = getDb()
  const [rows] = await db.query(
    `SELECT id, user_id, filename, original_name, mime_type, size, local_path, public_url, provider, created_at, updated_at
     FROM uploads
     WHERE id = ? AND user_id = ?
     LIMIT 1`,
    [id, userId],
  )

  return mapUpload(rows[0])
}
