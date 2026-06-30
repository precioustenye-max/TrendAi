import { getRrQuality, parseRiskReward } from "./scoringService.js"

function requiredWinRate(rr) {
  if (!rr || rr <= 0) {
    return null
  }

  return Number(((1 / (rr + 1)) * 100).toFixed(2))
}

export function buildFinalTradeDecision({ aiAnalysis, performanceContext = {}, mistakeContext = {} }) {
  const reasons = []
  const warnings = []
  const learningAdjustments = []
  const riskNotes = []
  const rr = parseRiskReward(aiAnalysis.riskReward)
  const required = requiredWinRate(rr)
  const historicalWinRate = performanceContext.assetWinRate ?? performanceContext.timeframeWinRate ?? performanceContext.overallWinRate ?? null
  let finalDecision = aiAnalysis.decision || "No Trade"
  let finalConfidence = aiAnalysis.confidenceAdjusted ?? aiAnalysis.confidence ?? 0

  if (aiAnalysis.noTradeReason) {
    finalDecision = "No Trade"
    reasons.push(aiAnalysis.noTradeReason)
  }

  if (rr != null && rr < 2) {
    finalDecision = "No Trade"
    riskNotes.push("Risk/reward is below the minimum 1:2 threshold.")
  }

  if (required != null && historicalWinRate != null && required > historicalWinRate) {
    warnings.push("Required win rate is higher than your historical win rate for this context.")
    finalConfidence -= 4
  }

  const tags = Array.isArray(aiAnalysis.strategyTags) ? aiAnalysis.strategyTags : []
  const weakMatches = tags.filter((tag) => performanceContext.weakTags?.includes(tag))
  const bestMatches = tags.filter((tag) => performanceContext.bestTags?.includes(tag))
  const mistakeMatches = tags.filter((tag) => mistakeContext.mistakeTags?.includes(tag) || performanceContext.mistakeTags?.includes(tag))

  if (weakMatches.length) {
    learningAdjustments.push(`Reduced confidence because weak tags matched: ${weakMatches.join(", ")}`)
    finalConfidence -= weakMatches.length * 4
  }

  if (mistakeMatches.length) {
    learningAdjustments.push(`Setup resembles repeated mistake tags: ${mistakeMatches.join(", ")}`)
    warnings.push("Past losses show similar patterns. Prefer waiting for stronger confirmation.")
    finalConfidence -= mistakeMatches.length * 5
  }

  if (bestMatches.length) {
    learningAdjustments.push(`Slight confidence support from historically stronger tags: ${bestMatches.join(", ")}`)
    finalConfidence += Math.min(bestMatches.length * 2, 4)
  }

  finalConfidence = Math.min(Math.max(Math.round(finalConfidence), 0), 95)

  if (finalConfidence < 55) {
    finalDecision = "No Trade"
    reasons.push("Final confidence is below execution threshold.")
  }

  if (!reasons.length && finalDecision !== "No Trade") {
    reasons.push("Bias, risk/reward, and scoring passed minimum filters.")
  }

  return {
    finalDecision,
    finalConfidence,
    reasons,
    warnings,
    learningAdjustments,
    riskNotes,
    expectedValue: aiAnalysis.expectancyScore ?? null,
    requiredWinRate: required,
    historicalWinRate,
    rrQuality: getRrQuality(rr),
  }
}
