import {
  getLearningMistakes,
  getLearningPerformance,
  getLearningTagPerformance,
} from "../controllers/learningController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

export default async function learningRoutes(app) {
  app.get("/performance", { preHandler: [authMiddleware] }, getLearningPerformance)
  app.get("/performance/tags", { preHandler: [authMiddleware] }, getLearningTagPerformance)
  app.get("/mistakes", { preHandler: [authMiddleware] }, getLearningMistakes)
}
