import {
  deleteHistoryItem,
  getHistory,
  getHistoryItem,
  saveHistoryResult,
} from "../controllers/historyController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

export default async function historyRoutes(app) {
  app.get("/", { preHandler: [authMiddleware] }, getHistory)
  app.get("/:id", { preHandler: [authMiddleware] }, getHistoryItem)
  app.delete("/:id", { preHandler: [authMiddleware] }, deleteHistoryItem)
  app.post("/:id/result", { preHandler: [authMiddleware] }, saveHistoryResult)
}
