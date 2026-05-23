import { runAnalysis } from "../controllers/analysisController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

export default async function analysisRoutes(app) {
  app.post("/", { preHandler: [authMiddleware] }, runAnalysis)
}
