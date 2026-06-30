import fs from "node:fs"
import path from "node:path"

function loadEnvFile() {
  const envPath = path.resolve(process.cwd(), ".env")

  if (!fs.existsSync(envPath)) {
    return
  }

  const content = fs.readFileSync(envPath, "utf8")

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()

    if (!line || line.startsWith("#")) {
      continue
    }

    const separatorIndex = line.indexOf("=")

    if (separatorIndex === -1) {
      continue
    }

    const key = line.slice(0, separatorIndex).trim()
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "")

    if (!key || process.env[key] !== undefined) {
      continue
    }

    process.env[key] = value
  }
}

loadEnvFile()

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number.parseInt(process.env.PORT || "4000", 10),
  host: process.env.HOST || "127.0.0.1",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || "",
  dbHost: process.env.DB_HOST || "127.0.0.1",
  dbPort: Number.parseInt(process.env.DB_PORT || "3306", 10),
  dbUser: process.env.DB_USER || "root",
  dbPassword: process.env.DB_PASSWORD || "",
  dbName: process.env.DB_NAME || "trendai",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  aiProvider: process.env.AI_PROVIDER || "gemini",
  enableAlertPolling: process.env.ENABLE_ALERT_POLLING === "true",
  alertPollIntervalMs: Number.parseInt(process.env.ALERT_POLL_INTERVAL_MS || "60000", 10),
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number.parseInt(process.env.SMTP_PORT || "587", 10),
  smtpSecure: process.env.SMTP_SECURE === "true",
  smtpUser: process.env.SMTP_USER || "",
  smtpPassword: process.env.SMTP_PASSWORD || "",
  emailFrom: process.env.EMAIL_FROM || process.env.SMTP_USER || "",
  enableEmailAlerts: process.env.ENABLE_EMAIL_ALERTS === "true",
}
