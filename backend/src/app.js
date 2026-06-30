import Fastify from "fastify"
import cors from "@fastify/cors"
import multipart from "@fastify/multipart"

import { env } from "./config/env.js"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import analysisRoutes from "./routes/analysisRoutes.js"
import analyzeRoutes from "./routes/analyzeRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"
import historyRoutes from "./routes/historyRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import learningRoutes from "./routes/learningRoutes.js"
import alertRoutes from "./routes/alertRoutes.js"
import { setErrorHandler } from "./middleware/errorMiddleware.js"
import { successResponse } from "./utils/formatResponse.js"

export function createApp() {
  const app = Fastify({ logger: true, bodyLimit: 10 * 1024 * 1024 })
  const allowedOrigins = new Set([env.frontendUrl, "http://localhost:5173", "http://localhost:5174"])

  app.register(cors, {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true)
        return
      }

      callback(new Error("Origin is not allowed by CORS"), false)
    },
  })

  app.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024,
      files: 1,
    },
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
  app.register(analyzeRoutes, { prefix: "/api/analyze" })
  app.register(paymentRoutes, { prefix: "/api/payments" })
  app.register(uploadRoutes, { prefix: "/api/uploads" })
  app.register(historyRoutes, { prefix: "/api/history" })
  app.register(dashboardRoutes, { prefix: "/api/dashboard" })
  app.register(learningRoutes, { prefix: "/api/learning" })
  app.register(alertRoutes, { prefix: "/api/alerts" })
  app.register(contactRoutes, { prefix: "/api/contact" })

  setErrorHandler(app)

  return app
}
