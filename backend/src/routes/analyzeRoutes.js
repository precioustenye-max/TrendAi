import { uploadFile } from "../controllers/uploadController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

export default async function analyzeRoutes(app) {
  app.post("/upload", { preHandler: [authMiddleware] }, uploadFile)
}
