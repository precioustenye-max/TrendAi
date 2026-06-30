function clamp(value, min = 0, max = 95) {
  return Math.min(Math.max(Number(value || 0), min), max)
}

export function parseRiskReward(riskReward) {
  if (!riskReward) {
    return null
  }

  const text = String(riskReward).toLowerCase().replace(/\s/g, "")
  const ratioMatch = text.match(/(?:1[:/])?([0-9]+(?:\.[0-9]+)?)/)

  if (!ratioMatch) {
    return null
  }

  return Number(ratioMatch[1])
}

export function getRrQuality(rr) {
  if (rr == null) {
    return "unknown"
  }

  if (rr < 2) {
    return "weak"
  }

  if (rr >= 3) {
    return "strong"
  }

  return "acceptable"
}

export function calculateQualityScore(analysis) {
  let score = 45
  const notes = analysis.smcNotes || {}

  if (analysis.asset) score += 5
  if (analysis.timeframe) score += 5
  if (notes.trend) score += 10
  if (notes.support) score += 5
  if (notes.resistance) score += 5
  if (notes.bosOrChoch) score += 10
  if (notes.liquidity) score += 8
  if (notes.orderBlock || notes.fairValueGap || notes.breakerBlock) score += 7
  if (!analysis.entry || !analysis.stopLoss) score -= 20
  if (!notes.invalidation) score -= 15
  if (String(analysis.explanation || "").toLowerCase().includes("unclear")) score -= 12

  return Math.round(clamp(score, 0, 95))
}

export function calculateRiskScore(analysis) {
  let score = 50
  const rr = parseRiskReward(analysis.riskReward)

  if (analysis.entry && analysis.stopLoss) score += 15
  if (Array.isArray(analysis.takeProfits) && analysis.takeProfits.length >= 2) score += 10
  if (rr >= 3) score += 15
  else if (rr >= 2) score += 8
  else if (rr != null) score -= 25
  if (!analysis.stopLoss) score -= 35
  if (!analysis.entry) score -= 25

  return Math.round(clamp(score, 0, 95))
}

export function calculateExpectancyScore(analysis, performanceContext = {}) {
  const rr = parseRiskReward(analysis.riskReward) || 1
  const winRate = performanceContext.overallWinRate == null ? null : performanceContext.overallWinRate / 100
  const estimatedWinRate = winRate ?? Math.min(Math.max(Number(analysis.confidence || 0) / 100, 0.35), 0.65)
  const averageWin = performanceContext.averageRrAchieved || rr
  const averageLoss = 1
  const expectancy = estimatedWinRate * averageWin - (1 - estimatedWinRate) * averageLoss

  return Number(expectancy.toFixed(2))
}

export function adjustConfidence(analysis, performanceContext = {}) {
  let confidence = Math.min(Number(analysis.confidence || 0), 95)
  const tags = Array.isArray(analysis.strategyTags) ? analysis.strategyTags : []
  const weakMatches = tags.filter((tag) => performanceContext.weakTags?.includes(tag))
  const bestMatches = tags.filter((tag) => performanceContext.bestTags?.includes(tag))
  const mistakeMatches = tags.filter((tag) => performanceContext.mistakeTags?.includes(tag))

  confidence -= weakMatches.length * 5
  confidence -= mistakeMatches.length * 6
  confidence += Math.min(bestMatches.length * 3, 6)

  if (performanceContext.assetWinRate != null && performanceContext.assetWinRate < 45) confidence -= 5
  if (performanceContext.timeframeWinRate != null && performanceContext.timeframeWinRate < 45) confidence -= 5
  if (!analysis.entry || !analysis.stopLoss) confidence -= 15

  return Math.round(clamp(confidence, 0, 95))
}

export function applyNoTradeRules(analysis, performanceContext = {}) {
  const reasons = []
  const rr = parseRiskReward(analysis.riskReward)
  const adjustedConfidence = analysis.confidenceAdjusted ?? adjustConfidence(analysis, performanceContext)
  const notes = analysis.smcNotes || {}

  if (!analysis.entry) reasons.push("Missing entry")
  if (!analysis.stopLoss) reasons.push("Missing stop loss")
  if (!notes.invalidation && !analysis.stopLoss) reasons.push("Missing invalidation")
  if (rr == null) reasons.push("Risk/reward is not clear")
  else if (rr < 2) reasons.push("Risk/reward is below 1:2")
  if (adjustedConfidence < 55) reasons.push("Adjusted confidence is below 55")
  if (!notes.support || !notes.resistance) reasons.push("Support/resistance is unclear")
  if (!notes.trend && !notes.bosOrChoch) reasons.push("Trend confirmation is unclear")

  return {
    decision: reasons.length ? "No Trade" : analysis.decision || (analysis.bias === "Bearish" ? "Sell" : analysis.bias === "Bullish" ? "Buy" : "No Trade"),
    noTradeReason: reasons.length ? reasons.join("; ") : null,
  }
}

export function enrichAnalysisWithScores(analysis, performanceContext = {}) {
  const qualityScore = calculateQualityScore(analysis)
  const riskScore = calculateRiskScore(analysis)
  const expectancyScore = calculateExpectancyScore(analysis, performanceContext)
  const confidenceAdjusted = adjustConfidence(analysis, performanceContext)
  const noTrade = applyNoTradeRules({ ...analysis, confidenceAdjusted }, performanceContext)

  return {
    ...analysis,
    decision: noTrade.decision,
    qualityScore,
    riskScore,
    expectancyScore,
    confidenceAdjusted,
    noTradeReason: noTrade.noTradeReason,
  }
}
