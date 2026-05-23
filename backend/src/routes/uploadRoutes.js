import { uploadFile } from "../controllers/uploadController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { uploadMiddleware } from "../middleware/uploadMiddleware.js"

export default async function uploadRoutes(app) {
  app.post("/", { preHandler: [authMiddleware, uploadMiddleware] }, uploadFile)
}
