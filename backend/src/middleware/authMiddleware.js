import { errorResponse } from "../utils/formatResponse.js"
import { getUserFromToken } from "../services/authService.js"

export async function authMiddleware(request, reply) {
  const authorizationHeader = request.headers.authorization

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return reply.code(401).send(errorResponse("Missing bearer token"))
  }

  request.token = authorizationHeader.slice(7).trim()

  try {
    request.user = await getUserFromToken(request.token)
  } catch (error) {
    return reply.code(error.statusCode || 401).send(errorResponse(error.message || "Invalid token"))
  }
}
