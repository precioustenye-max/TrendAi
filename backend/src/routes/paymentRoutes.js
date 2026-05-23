import { createPayment } from "../controllers/paymentController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

export default async function paymentRoutes(app) {
  app.post("/", { preHandler: [authMiddleware] }, createPayment)
}
