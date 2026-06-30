import { z } from "zod"

import { deleteAnalysisById, findAnalysisById, listAnalyses } from "../models/Analysis.js"
import { upsertTradeResult } from "../models/TradeResult.js"
import { replaceMistakesForAnalysis } from "../models/TradeMistake.js"
import { extractMistakesFromAnalysis } from "../services/mistakeService.js"
import { errorResponse, successResponse } from "../utils/formatResponse.js"

const resultSchema = z.object({
  result: z.enum(["win", "loss", "breakeven"]),
  profitLoss: z.number().optional().nullable(),
  rrAchieved: z.number().optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
})

function normalizeBias(value) {
  if (!value || value === "all") {
    return undefined
  }

  const lower = String(value).toLowerCase()
  return lower === "bullish" ? "Bullish" : lower === "bearish" ? "Bearish" : lower === "neutral" ? "Neutral" : undefined
}

export async function getHistory(request, reply) {
  const { items, pagination } = await listAnalyses(request.user.id, {
    ...request.query,
    bias: normalizeBias(request.query?.bias),
  })

  return reply.send(successResponse({ data: { analyses: items, pagination } }, "History fetched successfully"))
}

export async function getHistoryItem(request, reply) {
  const analysis = await findAnalysisById(request.params.id, request.user.id)

  if (!analysis) {
    return reply.code(404).send(errorResponse("Analysis not found"))
  }

  return reply.send(successResponse({ data: analysis }, "Analysis fetched successfully"))
}

export async function deleteHistoryItem(request, reply) {
  const deleted = await deleteAnalysisById(request.params.id, request.user.id)

  if (!deleted) {
    return reply.code(404).send(errorResponse("Analysis not found"))
  }

  return reply.send(successResponse({ data: { id: request.params.id } }, "Analysis deleted successfully"))
}

export async function saveHistoryResult(request, reply) {
  const analysis = await findAnalysisById(request.params.id, request.user.id)

  if (!analysis) {
    return reply.code(404).send(errorResponse("Analysis not found"))
  }

  const parsedBody = resultSchema.safeParse(request.body)

  if (!parsedBody.success) {
    return reply.code(400).send(errorResponse("Invalid result payload", parsedBody.error.flatten()))
  }

  const tradeResult = await upsertTradeResult({
    userId: request.user.id,
    analysisId: analysis.id,
    ...parsedBody.data,
  })

  if (parsedBody.data.result === "loss") {
    const mistakes = extractMistakesFromAnalysis(analysis)
    await replaceMistakesForAnalysis(request.user.id, analysis.id, mistakes)
  } else {
    await replaceMistakesForAnalysis(request.user.id, analysis.id, [])
  }

  return reply.send(
    successResponse(
      { data: tradeResult },
      "Outcome saved. TrendAi will use this feedback to adjust future analysis.",
    ),
  )
}
