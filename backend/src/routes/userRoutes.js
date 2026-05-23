import { getUsers } from "../controllers/userController.js"
import { adminMiddleware } from "../middleware/adminMiddleware.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

export default async function userRoutes(app) {
  app.get("/", { preHandler: [authMiddleware, adminMiddleware] }, getUsers)
}
