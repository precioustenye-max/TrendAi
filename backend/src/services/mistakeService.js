import { parseRiskReward } from "./scoringService.js"

function add(mistakes, tag, description) {
  if (!mistakes.some((mistake) => mistake.tag === tag)) {
    mistakes.push({ tag, description })
  }
}

export function extractMistakesFromAnalysis(analysis) {
  const mistakes = []
  const notes = analysis.smcNotes || {}
  const rr = parseRiskReward(analysis.riskReward)
  const tags = Array.isArray(analysis.strategyTags) ? analysis.strategyTags : []

  if (!notes.trend && !notes.bosOrChoch) add(mistakes, "unclear_structure", "Loss had weak or unclear structure confirmation.")
  if (rr != null && rr < 2) add(mistakes, "poor_rr", "Loss had risk/reward below 1:2.")
  if (!analysis.stopLoss || !notes.invalidation) add(mistakes, "weak_invalidation", "Loss lacked a clean invalidation point.")
  if (!notes.liquidity) add(mistakes, "no_liquidity_confirmation", "Loss lacked clear liquidity confirmation.")
  if (!analysis.asset || !analysis.timeframe) add(mistakes, "screenshot_unclear", "Loss came from incomplete screenshot context.")
  if (analysis.bias === "Bullish" && notes.resistance && !notes.support) add(mistakes, "near_resistance_buy", "Bullish idea may have been too close to resistance.")
  if (analysis.bias === "Bearish" && notes.support && !notes.resistance) add(mistakes, "near_support_sell", "Bearish idea may have been too close to support.")

  for (const tag of tags) {
    if (["unclear_structure", "poor_rr", "late_entry", "weak_invalidation"].includes(tag)) {
      add(mistakes, tag, `Loss carried strategy tag ${tag}.`)
    }
  }

  if (!mistakes.length) add(mistakes, "loss_review_needed", "Loss needs manual review; no obvious rule-based mistake was detected.")

  return mistakes
}
