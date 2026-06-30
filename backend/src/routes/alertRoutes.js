import {
  cancelAlert,
  checkAlertLivePrice,
  checkAlertPrice,
  checkAllLivePrices,
  createAlertFromAnalysis,
  getAlerts,
} from "../controllers/alertController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

export default async function alertRoutes(app) {
  app.get("/", { preHandler: [authMiddleware] }, getAlerts)
  app.post("/check-all-live", { preHandler: [authMiddleware] }, checkAllLivePrices)
  app.post("/analysis/:id", { preHandler: [authMiddleware] }, createAlertFromAnalysis)
  app.post("/:id/check-live-price", { preHandler: [authMiddleware] }, checkAlertLivePrice)
  app.post("/:id/check-price", { preHandler: [authMiddleware] }, checkAlertPrice)
  app.delete("/:id", { preHandler: [authMiddleware] }, cancelAlert)
}
