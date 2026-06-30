import { successResponse } from "../utils/formatResponse.js"
import { analyzeChart, getScreenshotReport, getSupportedMarkets } from "../services/aiService.js"

export async function runAnalysis(request, reply) {
  return reply.send(
    successResponse({ analysis: analyzeChart(request.body) }, "Analysis completed successfully"),
  )
}

export async function listMarkets(request, reply) {
  return reply.send(successResponse({ markets: getSupportedMarkets() }, "Markets fetched successfully"))
}

export async function getTradeReport(request, reply) {
  return reply.send(
    successResponse({ report: getScreenshotReport() }, "Screenshot report fetched successfully"),
  )
}
