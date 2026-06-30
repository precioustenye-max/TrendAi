import { getTradeReport, listMarkets, runAnalysis } from "../controllers/analysisController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

export default async function analysisRoutes(app) {
  app.get("/markets", { preHandler: [authMiddleware] }, listMarkets)
  app.get("/screenshot-report", { preHandler: [authMiddleware] }, getTradeReport)
  app.post("/", { preHandler: [authMiddleware] }, runAnalysis)
}
