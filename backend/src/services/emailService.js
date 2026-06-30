import nodemailer from "nodemailer"

import { env } from "../config/env.js"

let transporter = null

function isEnabled() {
  return Boolean(env.enableEmailAlerts && env.smtpHost && env.smtpUser && env.smtpPassword && env.emailFrom)
}

function getTransporter() {
  if (!isEnabled()) {
    return null
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPassword,
      },
    })
  }

  return transporter
}

function formatPrice(value) {
  if (value == null || value === "") return "Not detected"
  return String(value)
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function getTradeAlertCopy(triggerType, triggerTarget) {
  if (triggerType === "entry") {
    return {
      subject: "TrendAi alert: Entry price reached",
      headline: "Entry price reached",
      body: "Price has reached your planned entry level. Review current market conditions before taking any trade.",
    }
  }

  if (triggerType === "sl") {
    return {
      subject: "TrendAi alert: Stop loss reached",
      headline: "Stop loss reached",
      body: "Price has reached the stop loss level for this setup.",
    }
  }

  return {
    subject: `TrendAi alert: Take profit reached${triggerTarget ? ` (${triggerTarget})` : ""}`,
    headline: "Take profit reached",
    body: "Price has reached a take profit level for this setup.",
  }
}

export function isEmailConfigured() {
  return isEnabled()
}

export async function sendEmail({ to, subject, text, html }) {
  const activeTransporter = getTransporter()

  if (!activeTransporter) {
    return {
      skipped: true,
      reason: "Email alerts are disabled or SMTP is not configured.",
    }
  }

  if (!to) {
    return {
      skipped: true,
      reason: "Recipient email is missing.",
    }
  }

  await activeTransporter.sendMail({
    from: env.emailFrom,
    to,
    subject,
    text,
    html,
  })

  return { skipped: false }
}

export async function sendTradeAlertEmail({ user, alert, trigger, currentPrice, symbol }) {
  if (!trigger?.type) {
    return { skipped: true, reason: "No alert trigger to email." }
  }

  const copy = getTradeAlertCopy(trigger.type, trigger.target)
  const asset = symbol || alert.asset || "Trade setup"
  const takeProfits = (alert.takeProfits || []).join(", ") || "Not detected"
  const text = [
    copy.headline,
    "",
    copy.body,
    "",
    `Asset: ${asset}`,
    `Direction: ${alert.direction || "Not detected"}`,
    `Current price: ${formatPrice(currentPrice)}`,
    `Entry: ${formatPrice(alert.entryPrice)}`,
    `Stop loss: ${formatPrice(alert.stopLoss)}`,
    `Take profits: ${takeProfits}`,
    "",
    "This is an automated TrendAi alert and not financial advice.",
  ].join("\n")

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
      <h2>${copy.headline}</h2>
      <p>${copy.body}</p>
      <table cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
        <tr><td><strong>Asset</strong></td><td>${escapeHtml(asset)}</td></tr>
        <tr><td><strong>Direction</strong></td><td>${escapeHtml(alert.direction || "Not detected")}</td></tr>
        <tr><td><strong>Current price</strong></td><td>${escapeHtml(formatPrice(currentPrice))}</td></tr>
        <tr><td><strong>Entry</strong></td><td>${escapeHtml(formatPrice(alert.entryPrice))}</td></tr>
        <tr><td><strong>Stop loss</strong></td><td>${escapeHtml(formatPrice(alert.stopLoss))}</td></tr>
        <tr><td><strong>Take profits</strong></td><td>${escapeHtml(takeProfits)}</td></tr>
      </table>
      <p style="color: #6b7280; font-size: 13px;">This is an automated TrendAi alert and not financial advice.</p>
    </div>
  `

  return sendEmail({
    to: user?.email,
    subject: copy.subject,
    text,
    html,
  })
}

export function sendWelcomeEmail() {
  return {
    status: "pending",
    message: isEnabled() ? "Email service is configured." : "Email service is not configured yet.",
  }
}

export function createContactMessage({ name, email, message }) {
  return {
    id: `msg_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    name,
    email,
    message,
    status: "received",
    createdAt: new Date().toISOString(),
  }
}
