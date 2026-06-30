import { env } from "../config/env.js"
import { findUserById } from "../models/User.js"
import { listTradeAlerts, updateTradeAlertCheck } from "../models/TradeAlert.js"
import { maybeSendTradeAlertEmail } from "../services/alertNotificationService.js"
import { evaluateAlertTrigger } from "../services/alertService.js"
import { getCurrentPrice } from "../services/marketDataService.js"

let intervalId = null

export function startAlertPollingJob() {
  if (!env.enableAlertPolling || intervalId) {
    return null
  }

  const intervalMs = Number.isFinite(env.alertPollIntervalMs) ? env.alertPollIntervalMs : 60000

  const tick = async () => {
    try {
      // userId is not needed for listing all active alerts in this job, so query directly here.
      const activeAlerts = await listAllActiveAlerts()

      for (const alert of activeAlerts) {
        try {
          const marketPrice = await getCurrentPrice(alert.asset)
          const evaluation = evaluateAlertTrigger(alert, marketPrice.price)
          const updatedAlert = await updateTradeAlertCheck(alert.id, alert.userId, evaluation)

          if (evaluation.trigger) {
            const user = await findUserById(alert.userId)
            await maybeSendTradeAlertEmail({
              user,
              alert: updatedAlert,
              trigger: evaluation.trigger,
              currentPrice: marketPrice.price,
              symbol: marketPrice.symbol,
            })

            console.log(
              `[alert] ${updatedAlert.asset || "Trade"} ${evaluation.trigger.type.toUpperCase()} hit at ${marketPrice.price}`,
            )
          }
        } catch (error) {
          console.error(`[alert] Failed to check alert ${alert.id}: ${error.message}`)
        }
      }
    } catch (error) {
      console.error(`[alert] Polling tick failed: ${error.message}`)
    }
  }

  intervalId = setInterval(tick, intervalMs)
  tick()
  console.log(`[alert] Polling enabled every ${intervalMs}ms`)
  return intervalId
}

export function stopAlertPollingJob() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

async function listAllActiveAlerts() {
  // Keep this local to avoid exposing all-user listing through the public model API.
  const { getDb } = await import("../config/db.js")
  const db = getDb()
  const [rows] = await db.query(
    `SELECT id, user_id, analysis_id, asset, direction, entry_price, stop_loss, take_profits, status,
      triggered_type, triggered_target, triggered_price, triggered_at, entry_notified_at, sl_notified_at, tp_notified_at,
      last_checked_price, last_checked_at,
      created_at, updated_at
     FROM trade_alerts
     WHERE status = 'active'
     ORDER BY created_at ASC`,
  )

  return rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    analysisId: row.analysis_id,
    asset: row.asset,
    direction: row.direction,
    entryPrice: row.entry_price == null ? null : Number(row.entry_price),
    stopLoss: row.stop_loss == null ? null : Number(row.stop_loss),
    takeProfits: typeof row.take_profits === "string" ? JSON.parse(row.take_profits || "[]") : row.take_profits || [],
    status: row.status,
    entryNotifiedAt: row.entry_notified_at,
    slNotifiedAt: row.sl_notified_at,
    tpNotifiedAt: row.tp_notified_at,
  }))
}
