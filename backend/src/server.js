import { connectDb } from "./config/db.js"
import { env } from "./config/env.js"
import { createApp } from "./app.js"
import { logInfo } from "./utils/logger.js"

async function startServer() {
  if (!env.jwtSecret) {
    throw new Error("JWT_SECRET is required")
  }

  await connectDb()

  const app = createApp()
  await app.listen({ port: env.port, host: "0.0.0.0" })

  logInfo(`Server running at http://localhost:${env.port}`)
}

startServer().catch((error) => {
  console.error(error)
  process.exit(1)
})
