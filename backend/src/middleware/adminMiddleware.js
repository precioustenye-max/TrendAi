import { errorResponse } from "../utils/formatResponse.js"
import { getUserFromToken } from "../services/authService.js"

export async function adminMiddleware(request, reply) {
  const user = await getUserFromToken(request.token)

  if (user.role !== "admin") {
    return reply.code(403).send(errorResponse("Admin access required"))
  }

  request.user = user
}
