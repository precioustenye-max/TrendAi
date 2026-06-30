import { getDb } from "../config/db.js"

function mapMistake(row) {
  if (!row) {
    return null
  }

  return {
    id: row.id,
    userId: row.user_id,
    analysisId: row.analysis_id,
    mistakeTag: row.mistake_tag,
    description: row.description,
    createdAt: row.created_at,
    count: row.count == null ? undefined : Number(row.count),
  }
}

export async function replaceMistakesForAnalysis(userId, analysisId, mistakes = []) {
  const db = getDb()
  await db.query("DELETE FROM trade_mistakes WHERE user_id = ? AND analysis_id = ?", [userId, analysisId])

  if (!mistakes.length) {
    return []
  }

  await db.query(
    `INSERT INTO trade_mistakes (user_id, analysis_id, mistake_tag, description, created_at)
     VALUES ${mistakes.map(() => "(?, ?, ?, ?, NOW())").join(", ")}`,
    mistakes.flatMap((mistake) => [userId, analysisId, mistake.tag, mistake.description]),
  )

  return listMistakesForAnalysis(userId, analysisId)
}

export async function listMistakesForAnalysis(userId, analysisId) {
  const db = getDb()
  const [rows] = await db.query(
    `SELECT id, user_id, analysis_id, mistake_tag, description, created_at
     FROM trade_mistakes
     WHERE user_id = ? AND analysis_id = ?
     ORDER BY created_at DESC`,
    [userId, analysisId],
  )

  return rows.map(mapMistake)
}

export async function listCommonMistakes(userId, limit = 10) {
  const db = getDb()
  const [rows] = await db.query(
    `SELECT mistake_tag, COUNT(*) AS count, MAX(description) AS description
     FROM trade_mistakes
     WHERE user_id = ?
     GROUP BY mistake_tag
     ORDER BY count DESC, mistake_tag ASC
     LIMIT ?`,
    [userId, limit],
  )

  return rows.map((row) => ({
    mistakeTag: row.mistake_tag,
    description: row.description,
    count: Number(row.count || 0),
  }))
}
