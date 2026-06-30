import { errorResponse, successResponse } from "../utils/formatResponse.js"
import { loginSchema, registerSchema } from "../utils/validators.js"
import { getUserFromToken, loginUser, registerUser } from "../services/authService.js"

export async function register(request, reply) {
  const parsedBody = registerSchema.safeParse(request.body)

  if (!parsedBody.success) {
    return reply.code(400).send(errorResponse("Invalid request body", parsedBody.error.flatten()))
  }

  const result = await registerUser(parsedBody.data)
  return reply.code(201).send(successResponse(result, "Account created successfully"))
}

export async function login(request, reply) {
  const parsedBody = loginSchema.safeParse(request.body)

  if (!parsedBody.success) {
    return reply.code(400).send(errorResponse("Invalid request body", parsedBody.error.flatten()))
  }

  const result = await loginUser(parsedBody.data)
  return reply.send(successResponse(result, "Login successful"))
}

export async function getCurrentUser(request, reply) {
  const user = request.user || (await getUserFromToken(request.token))
  return reply.send(successResponse({ user }, "User profile fetched successfully"))
}
