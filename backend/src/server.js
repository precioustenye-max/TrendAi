import { connectDb } from "./config/db.js"
import { env } from "./config/env.js"
import { createApp } from "./app.js"
import { logInfo } from "./utils/logger.js"
import { startAlertPollingJob } from "./jobs/alertPollingJob.js"

async function startServer() {
  if (!env.jwtSecret) {
    throw new Error("JWT_SECRET is required")
  }

  try {
    await connectDb()
  } catch (error) {
    logInfo(`Database unavailable; using local JSON user store. Reason: ${error.code || error.message}`)
  }

  const app = createApp()
  await app.listen({ port: env.port, host: env.host })
  startAlertPollingJob()

  logInfo(`Server running at http://${env.host}:${env.port}`)
}

startServer().catch((error) => {
  console.error(error)
  process.exit(1)
})
