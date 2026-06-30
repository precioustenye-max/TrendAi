import { getDashboardStats } from "../controllers/dashboardController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

export default async function dashboardRoutes(app) {
  app.get("/stats", { preHandler: [authMiddleware] }, getDashboardStats)
}
