import { markAlertEmailSent } from "../models/TradeAlert.js"
import { sendTradeAlertEmail } from "./emailService.js"

function getNotificationField(type) {
  return {
    entry: "entryNotifiedAt",
    sl: "slNotifiedAt",
    tp: "tpNotifiedAt",
  }[type]
}

export async function maybeSendTradeAlertEmail({ user, alert, trigger, currentPrice, symbol }) {
  const notifiedField = getNotificationField(trigger?.type)

  if (!trigger || !notifiedField || alert?.[notifiedField]) {
    return {
      alert,
      email: { skipped: true, reason: "No new email notification needed." },
    }
  }

  try {
    const email = await sendTradeAlertEmail({
      user,
      alert,
      trigger,
      currentPrice,
      symbol,
    })

    if (email.skipped) {
      return { alert, email }
    }

    const markedAlert = await markAlertEmailSent(alert.id, alert.userId, trigger.type)
    return { alert: markedAlert, email }
  } catch (error) {
    console.error(`[email] Failed to send alert email ${alert.id}: ${error.message}`)
    return {
      alert,
      email: { skipped: true, reason: "Email failed to send." },
    }
  }
}
