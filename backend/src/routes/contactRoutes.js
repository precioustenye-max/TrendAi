import { submitContactMessage } from "../controllers/contactController.js"

export default async function contactRoutes(app) {
  app.post("/", submitContactMessage)
}
