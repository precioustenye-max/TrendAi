import { getDb } from "../config/db.js"

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

function mapTradeResult(row) {
  if (!row?.trade_result_id) {
    return null
  }

  return {
    id: row.trade_result_id,
    userId: row.trade_result_user_id,
    analysisId: row.trade_result_analysis_id,
    result: row.trade_result_result,
    profitLoss: row.trade_result_profit_loss == null ? null : Number(row.trade_result_profit_loss),
    rrAchieved: row.trade_result_rr_achieved == null ? null : Number(row.trade_result_rr_achieved),
    notes: row.trade_result_notes,
    closedAt: row.trade_result_closed_at,
    createdAt: row.trade_result_created_at,
    updatedAt: row.trade_result_updated_at,
  }
}

function mapUpload(row) {
  if (!row?.upload_id) {
    return null
  }

  return {
    id: row.upload_id,
    userId: row.upload_user_id,
    filename: row.upload_filename,
    originalName: row.upload_original_name,
    mimeType: row.upload_mime_type,
    size: row.upload_size == null ? null : Number(row.upload_size),
    localPath: row.upload_local_path,
    publicUrl: row.upload_public_url,
    provider: row.upload_provider,
    createdAt: row.upload_created_at,
    updatedAt: row.upload_updated_at,
  }
}

export function mapAnalysis(row, { includeRelations = true } = {}) {
  if (!row) {
    return null
  }

  const analysis = {
    id: row.id,
    userId: row.user_id,
    uploadId: row.analysis_upload_id,
    asset: row.asset,
    timeframe: row.timeframe,
    bias: row.bias,
    confidence: Number(row.confidence || 0),
    entry: row.entry,
    stopLoss: row.stop_loss,
    takeProfits: parseJson(row.take_profits, []),
    riskReward: row.risk_reward,
    decision: row.decision,
    qualityScore: row.quality_score == null ? null : Number(row.quality_score),
    riskScore: row.risk_score == null ? null : Number(row.risk_score),
    expectancyScore: row.expectancy_score == null ? null : Number(row.expectancy_score),
    confidenceAdjusted: row.confidence_adjusted == null ? null : Number(row.confidence_adjusted),
    noTradeReason: row.no_trade_reason,
    finalDecision: row.final_decision,
    finalConfidence: row.final_confidence == null ? null : Number(row.final_confidence),
    ensembleResult: parseJson(row.ensemble_result, null),
    learningAdjustments: parseJson(row.learning_adjustments, []),
    riskWarnings: parseJson(row.risk_warnings, []),
    expectedValue: row.expected_value == null ? null : Number(row.expected_value),
    requiredWinRate: row.required_win_rate == null ? null : Number(row.required_win_rate),
    historicalWinRate: row.historical_win_rate == null ? null : Number(row.historical_win_rate),
    rrQuality: row.rr_quality,
    explanation: row.explanation,
    smcNotes: parseJson(row.smc_notes, {}),
    strategyTags: parseJson(row.strategy_tags, []),
    rawAiResponse: parseJson(row.raw_ai_response, null),
    status: row.status,
    errorMessage: row.error_message,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  if (includeRelations) {
    analysis.upload = mapUpload(row)
    analysis.tradeResult = mapTradeResult(row)
  }

  return analysis
}

function baseSelect() {
  return `SELECT
    a.id, a.user_id, a.upload_id AS analysis_upload_id, a.asset, a.timeframe, a.bias, a.confidence, a.entry, a.stop_loss,
    a.take_profits, a.risk_reward, a.decision, a.quality_score, a.risk_score, a.expectancy_score,
    a.confidence_adjusted, a.no_trade_reason, a.final_decision, a.final_confidence, a.ensemble_result,
    a.learning_adjustments, a.risk_warnings, a.expected_value, a.required_win_rate, a.historical_win_rate,
    a.rr_quality, a.explanation, a.smc_notes, a.strategy_tags, a.raw_ai_response,
    a.status, a.error_message, a.created_at, a.updated_at,
    u.id AS upload_id, u.user_id AS upload_user_id, u.filename AS upload_filename,
    u.original_name AS upload_original_name, u.mime_type AS upload_mime_type, u.size AS upload_size,
    u.local_path AS upload_local_path, u.public_url AS upload_public_url, u.provider AS upload_provider,
    u.created_at AS upload_created_at, u.updated_at AS upload_updated_at,
    tr.id AS trade_result_id, tr.user_id AS trade_result_user_id, tr.analysis_id AS trade_result_analysis_id,
    tr.result AS trade_result_result, tr.profit_loss AS trade_result_profit_loss,
    tr.rr_achieved AS trade_result_rr_achieved, tr.notes AS trade_result_notes,
    tr.closed_at AS trade_result_closed_at, tr.created_at AS trade_result_created_at,
    tr.updated_at AS trade_result_updated_at
   FROM analyses a
   LEFT JOIN uploads u ON u.id = a.upload_id
   LEFT JOIN trade_results tr ON tr.analysis_id = a.id`
}

export async function createAnalysisRecord({
  userId,
  uploadId = null,
  asset = null,
  timeframe = null,
  bias = "Neutral",
  confidence = 0,
  entry = null,
  stopLoss = null,
  takeProfits = [],
  riskReward = null,
  decision = null,
  qualityScore = null,
  riskScore = null,
  expectancyScore = null,
  confidenceAdjusted = null,
  noTradeReason = null,
  finalDecision = null,
  finalConfidence = null,
  ensembleResult = null,
  learningAdjustments = [],
  riskWarnings = [],
  expectedValue = null,
  requiredWinRate = null,
  historicalWinRate = null,
  rrQuality = null,
  explanation = null,
  smcNotes = {},
  strategyTags = [],
  rawAiResponse = null,
  status = "completed",
  errorMessage = null,
}) {
  const db = getDb()
  const [result] = await db.query(
    `INSERT INTO analyses
      (user_id, upload_id, asset, timeframe, bias, confidence, entry, stop_loss, take_profits, risk_reward,
       decision, quality_score, risk_score, expectancy_score, confidence_adjusted, no_trade_reason,
       final_decision, final_confidence, ensemble_result, learning_adjustments, risk_warnings,
       expected_value, required_win_rate, historical_win_rate, rr_quality,
       explanation, smc_notes, strategy_tags, raw_ai_response, status, error_message, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, CAST(? AS JSON), ?, ?, ?, ?, ?, ?, ?, ?, ?, CAST(? AS JSON), CAST(? AS JSON), CAST(? AS JSON), ?, ?, ?, ?, ?, CAST(? AS JSON), CAST(? AS JSON), CAST(? AS JSON), ?, ?, NOW(), NOW())`,
    [
      userId,
      uploadId,
      asset,
      timeframe,
      bias,
      confidence,
      entry,
      stopLoss,
      JSON.stringify(takeProfits || []),
      riskReward,
      decision,
      qualityScore,
      riskScore,
      expectancyScore,
      confidenceAdjusted,
      noTradeReason,
      finalDecision,
      finalConfidence,
      JSON.stringify(ensembleResult || null),
      JSON.stringify(learningAdjustments || []),
      JSON.stringify(riskWarnings || []),
      expectedValue,
      requiredWinRate,
      historicalWinRate,
      rrQuality,
      explanation,
      JSON.stringify(smcNotes || {}),
      JSON.stringify(strategyTags || []),
      JSON.stringify(rawAiResponse || null),
      status,
      errorMessage,
    ],
  )

  return findAnalysisById(result.insertId, userId)
}

export async function listAnalyses(userId, filters = {}) {
  const db = getDb()
  const page = Math.max(Number.parseInt(filters.page || "1", 10), 1)
  const limit = Math.min(Math.max(Number.parseInt(filters.limit || "20", 10), 1), 100)
  const offset = (page - 1) * limit
  const where = ["a.user_id = ?"]
  const params = [userId]

  if (filters.asset) {
    where.push("a.asset LIKE ?")
    params.push(`%${filters.asset}%`)
  }

  if (filters.bias && ["Bullish", "Bearish", "Neutral"].includes(filters.bias)) {
    where.push("a.bias = ?")
    params.push(filters.bias)
  }

  if (filters.timeframe) {
    where.push("a.timeframe = ?")
    params.push(filters.timeframe)
  }

  if (filters.from) {
    where.push("a.created_at >= ?")
    params.push(filters.from)
  }

  if (filters.to) {
    where.push("a.created_at <= ?")
    params.push(filters.to)
  }

  const whereSql = `WHERE ${where.join(" AND ")}`
  const [[countRow]] = await db.query(`SELECT COUNT(*) AS total FROM analyses a ${whereSql}`, params)
  const [rows] = await db.query(
    `${baseSelect()} ${whereSql} ORDER BY a.created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  )

  return {
    items: rows.map(mapAnalysis),
    pagination: {
      page,
      limit,
      total: Number(countRow.total || 0),
      totalPages: Math.ceil(Number(countRow.total || 0) / limit),
    },
  }
}

export async function findAnalysisById(id, userId) {
  const db = getDb()
  const [rows] = await db.query(`${baseSelect()} WHERE a.id = ? AND a.user_id = ? LIMIT 1`, [id, userId])
  return mapAnalysis(rows[0])
}

export async function deleteAnalysisById(id, userId) {
  const db = getDb()
  const [result] = await db.query("DELETE FROM analyses WHERE id = ? AND user_id = ?", [id, userId])
  return result.affectedRows > 0
}

export async function getRecentAnalyses(userId, limit = 5) {
  const db = getDb()
  const [rows] = await db.query(
    `${baseSelect()} WHERE a.user_id = ? ORDER BY a.created_at DESC LIMIT ?`,
    [userId, limit],
  )

  return rows.map(mapAnalysis)
}

export async function getAnalysisCounts(userId) {
  const db = getDb()
  const [[row]] = await db.query(
    `SELECT
      COUNT(*) AS total_analyses,
      SUM(CASE WHEN bias = 'Bullish' THEN 1 ELSE 0 END) AS bullish_count,
      SUM(CASE WHEN bias = 'Bearish' THEN 1 ELSE 0 END) AS bearish_count,
      SUM(CASE WHEN bias = 'Neutral' THEN 1 ELSE 0 END) AS neutral_count
     FROM analyses
     WHERE user_id = ?`,
    [userId],
  )

  return {
    totalAnalyses: Number(row.total_analyses || 0),
    bullishCount: Number(row.bullish_count || 0),
    bearishCount: Number(row.bearish_count || 0),
    neutralCount: Number(row.neutral_count || 0),
  }
}
