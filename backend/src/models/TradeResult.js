import { getDb } from "../config/db.js"

function mapTradeResult(row) {
  if (!row) {
    return null
  }

  return {
    id: row.id,
    userId: row.user_id,
    analysisId: row.analysis_id,
    result: row.result,
    profitLoss: row.profit_loss == null ? null : Number(row.profit_loss),
    rrAchieved: row.rr_achieved == null ? null : Number(row.rr_achieved),
    notes: row.notes,
    closedAt: row.closed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function upsertTradeResult({ userId, analysisId, result, profitLoss = null, rrAchieved = null, notes = null }) {
  const db = getDb()
  await db.query(
    `INSERT INTO trade_results
      (user_id, analysis_id, result, profit_loss, rr_achieved, notes, closed_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())
     ON DUPLICATE KEY UPDATE
      result = VALUES(result),
      profit_loss = VALUES(profit_loss),
      rr_achieved = VALUES(rr_achieved),
      notes = VALUES(notes),
      closed_at = NOW(),
      updated_at = NOW()`,
    [userId, analysisId, result, profitLoss, rrAchieved, notes],
  )

  return findTradeResultByAnalysisId(analysisId, userId)
}

export async function findTradeResultByAnalysisId(analysisId, userId) {
  const db = getDb()
  const [rows] = await db.query(
    `SELECT id, user_id, analysis_id, result, profit_loss, rr_achieved, notes, closed_at, created_at, updated_at
     FROM trade_results
     WHERE analysis_id = ? AND user_id = ?
     LIMIT 1`,
    [analysisId, userId],
  )

  return mapTradeResult(rows[0])
}

export async function getTradeResultStats(userId) {
  const db = getDb()
  const [[row]] = await db.query(
    `SELECT
      COUNT(*) AS total_results,
      SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) AS wins
     FROM trade_results
     WHERE user_id = ?`,
    [userId],
  )

  const totalResults = Number(row.total_results || 0)
  const wins = Number(row.wins || 0)

  return {
    totalResults,
    wins,
    winRate: totalResults ? Number(((wins / totalResults) * 100).toFixed(2)) : null,
  }
}
