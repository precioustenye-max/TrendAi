import { getDb } from "../config/db.js"

function parseJson(value, fallback) {
  if (value == null) return fallback
  if (typeof value !== "string") return value

  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function mapAlert(row) {
  if (!row) return null

  return {
    id: row.id,
    userId: row.user_id,
    analysisId: row.analysis_id,
    asset: row.asset,
    direction: row.direction,
    entryPrice: row.entry_price == null ? null : Number(row.entry_price),
    stopLoss: row.stop_loss == null ? null : Number(row.stop_loss),
    takeProfits: parseJson(row.take_profits, []),
    status: row.status,
    triggeredType: row.triggered_type,
    triggeredTarget: row.triggered_target,
    triggeredPrice: row.triggered_price == null ? null : Number(row.triggered_price),
    triggeredAt: row.triggered_at,
    entryNotifiedAt: row.entry_notified_at,
    slNotifiedAt: row.sl_notified_at,
    tpNotifiedAt: row.tp_notified_at,
    lastCheckedPrice: row.last_checked_price == null ? null : Number(row.last_checked_price),
    lastCheckedAt: row.last_checked_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function createTradeAlert({
  userId,
  analysisId,
  asset = null,
  direction,
  entryPrice = null,
  stopLoss,
  takeProfits = [],
}) {
  const db = getDb()
  const [existing] = await db.query(
    "SELECT id FROM trade_alerts WHERE user_id = ? AND analysis_id = ? AND status = 'active' LIMIT 1",
    [userId, analysisId],
  )

  if (existing[0]) {
    return findTradeAlertById(existing[0].id, userId)
  }

  const [result] = await db.query(
    `INSERT INTO trade_alerts
      (user_id, analysis_id, asset, direction, entry_price, stop_loss, take_profits, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, CAST(? AS JSON), 'active', NOW(), NOW())`,
    [userId, analysisId, asset, direction, entryPrice, stopLoss, JSON.stringify(takeProfits || [])],
  )

  return findTradeAlertById(result.insertId, userId)
}

export async function findTradeAlertById(id, userId) {
  const db = getDb()
  const [rows] = await db.query(
    `SELECT id, user_id, analysis_id, asset, direction, entry_price, stop_loss, take_profits, status,
      triggered_type, triggered_target, triggered_price, triggered_at, entry_notified_at, sl_notified_at, tp_notified_at,
      last_checked_price, last_checked_at,
      created_at, updated_at
     FROM trade_alerts
     WHERE id = ? AND user_id = ?
     LIMIT 1`,
    [id, userId],
  )

  return mapAlert(rows[0])
}

export async function listTradeAlerts(userId, status = null) {
  const db = getDb()
  const params = [userId]
  let where = "WHERE user_id = ?"

  if (status) {
    where += " AND status = ?"
    params.push(status)
  }

  const [rows] = await db.query(
    `SELECT id, user_id, analysis_id, asset, direction, entry_price, stop_loss, take_profits, status,
      triggered_type, triggered_target, triggered_price, triggered_at, entry_notified_at, sl_notified_at, tp_notified_at,
      last_checked_price, last_checked_at,
      created_at, updated_at
     FROM trade_alerts
     ${where}
     ORDER BY created_at DESC`,
    params,
  )

  return rows.map(mapAlert)
}

export async function updateTradeAlertCheck(id, userId, { currentPrice, trigger = null }) {
  const db = getDb()

  if (trigger && trigger.type !== "entry") {
    await db.query(
      `UPDATE trade_alerts
       SET status = 'triggered',
        triggered_type = ?,
        triggered_target = ?,
        triggered_price = ?,
        triggered_at = NOW(),
        last_checked_price = ?,
        last_checked_at = NOW(),
        updated_at = NOW()
       WHERE id = ? AND user_id = ?`,
      [trigger.type, trigger.target, currentPrice, currentPrice, id, userId],
    )
  } else {
    await db.query(
      `UPDATE trade_alerts
       SET last_checked_price = ?, last_checked_at = NOW(), updated_at = NOW()
       WHERE id = ? AND user_id = ?`,
      [currentPrice, id, userId],
    )
  }

  return findTradeAlertById(id, userId)
}

export async function cancelTradeAlert(id, userId) {
  const db = getDb()
  const [result] = await db.query(
    "UPDATE trade_alerts SET status = 'cancelled', updated_at = NOW() WHERE id = ? AND user_id = ?",
    [id, userId],
  )

  return result.affectedRows > 0
}

export async function markAlertEmailSent(id, userId, type) {
  const db = getDb()
  const columnByType = {
    entry: "entry_notified_at",
    sl: "sl_notified_at",
    tp: "tp_notified_at",
  }
  const column = columnByType[type]

  if (!column) {
    return findTradeAlertById(id, userId)
  }

  await db.query(`UPDATE trade_alerts SET ${column} = NOW(), updated_at = NOW() WHERE id = ? AND user_id = ?`, [
    id,
    userId,
  ])

  return findTradeAlertById(id, userId)
}
