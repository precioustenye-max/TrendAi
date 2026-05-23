import { successResponse } from "../utils/formatResponse.js"
import { analyzeChart } from "../services/aiService.js"

export async function runAnalysis(request, reply) {
  return reply.send(successResponse({ analysis: analyzeChart() }, "Analysis endpoint is ready"))
}
