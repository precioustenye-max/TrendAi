import { getAllUsers } from "../models/User.js"
import { successResponse } from "../utils/formatResponse.js"
import { sanitizeUser } from "../services/authService.js"

export async function getUsers(request, reply) {
  const users = (await getAllUsers()).map(sanitizeUser)
  return reply.send(successResponse({ users }, "Users fetched successfully"))
}
