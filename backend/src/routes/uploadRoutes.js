import { uploadFile } from "../controllers/uploadController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

export default async function uploadRoutes(app) {
  app.post("/", { preHandler: [authMiddleware] }, uploadFile)
}
