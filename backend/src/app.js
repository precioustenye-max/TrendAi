import Fastify from "fastify"
import cors from "@fastify/cors"

import { env } from "./config/env.js"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import analysisRoutes from "./routes/analysisRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import { setErrorHandler } from "./middleware/errorMiddleware.js"
import { successResponse } from "./utils/formatResponse.js"

export function createApp() {
  const app = Fastify({ logger: true })

  app.register(cors, {
    origin: env.frontendUrl,
  })

  app.get("/", async () => {
    return successResponse(
      {
        app: "TrendAi backend",
      },
      "Backend is running",
    )
  })

  app.get("/health", async () => {
    return successResponse(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
      },
      "Health check passed",
    )
  })

  app.register(authRoutes, { prefix: "/api/auth" })
  app.register(userRoutes, { prefix: "/api/users" })
  app.register(analysisRoutes, { prefix: "/api/analysis" })
  app.register(paymentRoutes, { prefix: "/api/payments" })
  app.register(uploadRoutes, { prefix: "/api/uploads" })

  setErrorHandler(app)

  return app
}
