import { errorResponse } from "../utils/formatResponse.js"

export async function authMiddleware(request, reply) {
  const authorizationHeader = request.headers.authorization

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return reply.code(401).send(errorResponse("Missing bearer token"))
  }

  request.token = authorizationHeader.slice(7).trim()
}
