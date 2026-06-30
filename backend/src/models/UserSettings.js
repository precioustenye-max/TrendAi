import { getDb } from "../config/db.js"

export async function getOrCreateUserSettings(userId) {
  const db = getDb()
  await db.query(
    `INSERT IGNORE INTO user_settings
      (user_id, theme, notifications_enabled, created_at, updated_at)
     VALUES (?, 'dark', 1, NOW(), NOW())`,
    [userId],
  )

  const [rows] = await db.query(
    `SELECT id, user_id, theme, preferred_risk, default_timeframe, default_asset, notifications_enabled, created_at, updated_at
     FROM user_settings
     WHERE user_id = ?
     LIMIT 1`,
    [userId],
  )

  const row = rows[0]

  return row
    ? {
        id: row.id,
        userId: row.user_id,
        theme: row.theme,
        preferredRisk: row.preferred_risk,
        defaultTimeframe: row.default_timeframe,
        defaultAsset: row.default_asset,
        notificationsEnabled: Boolean(row.notifications_enabled),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }
    : null
}
