import { getDb } from "../config/db.js"
import { listCommonMistakes } from "../models/TradeMistake.js"

function parseJson(value, fallback) {
  if (value == null) {
    return fallback
  }

  if (typeof value !== "string") {
    return value
  }

  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function winRate(rows) {
  if (!rows.length) {
    return null
  }

  const wins = rows.filter((row) => row.result === "win").length
  return Number(((wins / rows.length) * 100).toFixed(2))
}

function average(values) {
  const cleanValues = values.filter((value) => Number.isFinite(Number(value))).map(Number)
  return cleanValues.length
    ? Number((cleanValues.reduce((sum, value) => sum + value, 0) / cleanValues.length).toFixed(2))
    : null
}

export async function getUserPerformanceContext(userId, asset = null, timeframe = null) {
  const db = getDb()
  const [rows] = await db.query(
    `SELECT a.asset, a.timeframe, a.strategy_tags, tr.result, tr.rr_achieved, tr.profit_loss
     FROM analyses a
     INNER JOIN trade_results tr ON tr.analysis_id = a.id
     WHERE a.user_id = ?
     ORDER BY tr.closed_at DESC
     LIMIT 200`,
    [userId],
  )

  const assetRows = asset ? rows.filter((row) => row.asset === asset) : []
  const timeframeRows = timeframe ? rows.filter((row) => row.timeframe === timeframe) : []
  const tagPerformance = await calculateTagPerformance(userId)
  const mistakes = await getMistakePatterns(userId)

  return {
    overallWinRate: winRate(rows),
    assetWinRate: winRate(assetRows),
    timeframeWinRate: winRate(timeframeRows),
    assetPerformance: asset ? await calculateAssetPerformance(userId, asset) : null,
    timeframePerformance: timeframe ? await calculateTimeframePerformance(userId, timeframe) : null,
    bestTags: tagPerformance.bestTags,
    weakTags: tagPerformance.weakTags,
    tagPerformance: tagPerformance.tags,
    commonMistakes: mistakes.commonMistakes,
    mistakeTags: mistakes.mistakeTags,
    averageRrAchieved: average(rows.map((row) => row.rr_achieved)),
    averageProfitLoss: average(rows.map((row) => row.profit_loss)),
    sampleSize: rows.length,
  }
}

export async function calculateTagPerformance(userId) {
  const db = getDb()
  const [rows] = await db.query(
    `SELECT a.strategy_tags, tr.result
     FROM analyses a
     INNER JOIN trade_results tr ON tr.analysis_id = a.id
     WHERE a.user_id = ?`,
    [userId],
  )

  const byTag = new Map()

  for (const row of rows) {
    for (const tag of parseJson(row.strategy_tags, [])) {
      const current = byTag.get(tag) || { total: 0, wins: 0 }
      current.total += 1
      current.wins += row.result === "win" ? 1 : 0
      byTag.set(tag, current)
    }
  }

  const scoredTags = [...byTag.entries()]
    .filter(([, value]) => value.total >= 2)
    .map(([tag, value]) => ({
      tag,
      total: value.total,
      winRate: value.total ? (value.wins / value.total) * 100 : 0,
    }))

  return {
    tags: scoredTags.map((item) => ({
      tag: item.tag,
      total: item.total,
      winRate: Number(item.winRate.toFixed(2)),
    })),
    bestTags: scoredTags
      .filter((item) => item.winRate >= 55)
      .sort((a, b) => b.winRate - a.winRate)
      .slice(0, 3)
      .map((item) => item.tag),
    weakTags: scoredTags
      .filter((item) => item.winRate < 45)
      .sort((a, b) => a.winRate - b.winRate)
      .slice(0, 3)
      .map((item) => item.tag),
  }
}

export async function calculateAssetPerformance(userId, asset) {
  const db = getDb()
  const [rows] = await db.query(
    `SELECT tr.result, tr.rr_achieved, tr.profit_loss
     FROM analyses a
     INNER JOIN trade_results tr ON tr.analysis_id = a.id
     WHERE a.user_id = ? AND a.asset = ?`,
    [userId, asset],
  )

  return {
    asset,
    total: rows.length,
    winRate: winRate(rows),
    averageRrAchieved: average(rows.map((row) => row.rr_achieved)),
    averageProfitLoss: average(rows.map((row) => row.profit_loss)),
  }
}

export async function calculateTimeframePerformance(userId, timeframe) {
  const db = getDb()
  const [rows] = await db.query(
    `SELECT tr.result, tr.rr_achieved, tr.profit_loss
     FROM analyses a
     INNER JOIN trade_results tr ON tr.analysis_id = a.id
     WHERE a.user_id = ? AND a.timeframe = ?`,
    [userId, timeframe],
  )

  return {
    timeframe,
    total: rows.length,
    winRate: winRate(rows),
    averageRrAchieved: average(rows.map((row) => row.rr_achieved)),
    averageProfitLoss: average(rows.map((row) => row.profit_loss)),
  }
}

export async function getMistakePatterns(userId) {
  const mistakes = await listCommonMistakes(userId, 10)

  return {
    mistakeTags: mistakes.map((mistake) => mistake.mistakeTag),
    commonMistakes: mistakes.map(
      (mistake) => `${mistake.mistakeTag}: ${mistake.description || "Repeated losing pattern"} (${mistake.count}x)`,
    ),
    mistakes,
  }
}

export async function buildPerformancePromptContext(userId, asset = null, timeframe = null) {
  const context = await getUserPerformanceContext(userId, asset, timeframe)

  if (!context.sampleSize || context.sampleSize < 5) {
    return "There is not enough historical feedback yet. Do not adjust confidence based on user performance."
  }

  return [
    `User historical feedback sample size: ${context.sampleSize}.`,
    `Overall win rate: ${context.overallWinRate ?? "unknown"}%.`,
    `Asset win rate: ${context.assetWinRate ?? "not enough matching asset data"}%.`,
    `Timeframe win rate: ${context.timeframeWinRate ?? "not enough matching timeframe data"}%.`,
    `Best tags: ${context.bestTags.length ? context.bestTags.join(", ") : "none yet"}.`,
    `Weak tags: ${context.weakTags.length ? context.weakTags.join(", ") : "none yet"}.`,
    `Common losing patterns: ${context.commonMistakes.length ? context.commonMistakes.join("; ") : "none yet"}.`,
    `Average RR achieved: ${context.averageRrAchieved ?? "unknown"}.`,
    `Average P/L: ${context.averageProfitLoss ?? "unknown"}.`,
    "Use this only to temper confidence and warnings. Do not imply guaranteed profitability.",
    "If the current setup resembles weak historical patterns, reduce confidence or return No Trade.",
  ].join("\n")
}
