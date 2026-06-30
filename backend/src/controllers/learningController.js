import {
  calculateTagPerformance,
  getMistakePatterns,
  getUserPerformanceContext,
} from "../services/learningService.js"
import { successResponse } from "../utils/formatResponse.js"

export async function getLearningPerformance(request, reply) {
  const context = await getUserPerformanceContext(
    request.user.id,
    request.query?.asset || null,
    request.query?.timeframe || null,
  )

  return reply.send(successResponse({ data: context }, "Learning performance fetched successfully"))
}

export async function getLearningTagPerformance(request, reply) {
  const performance = await calculateTagPerformance(request.user.id)
  return reply.send(successResponse({ data: performance }, "Tag performance fetched successfully"))
}

export async function getLearningMistakes(request, reply) {
  const mistakes = await getMistakePatterns(request.user.id)
  return reply.send(successResponse({ data: mistakes }, "Mistake patterns fetched successfully"))
}
