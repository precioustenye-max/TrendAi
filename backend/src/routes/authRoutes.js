import { getCurrentUser, login, register } from "../controllers/authController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

export default async function authRoutes(app) {
  app.post("/register", register)
  app.post("/login", login)
  app.get("/me", { preHandler: [authMiddleware] }, getCurrentUser)
}
