import fs from "node:fs/promises"
import path from "node:path"
import crypto from "node:crypto"

import { analyzeChartImage } from "../services/ai/index.js"
import { createAnalysisRecord } from "../models/Analysis.js"
import { createUploadRecord } from "../models/Upload.js"
import { buildFinalTradeDecision } from "../services/ensembleService.js"
import { getMistakePatterns, getUserPerformanceContext } from "../services/learningService.js"
import { enrichAnalysisWithScores } from "../services/scoringService.js"
import { errorResponse, successResponse } from "../utils/formatResponse.js"

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"])
const maxFileSize = 5 * 1024 * 1024
const uploadDirectory = path.resolve(process.cwd(), "src/uploads/charts")

export async function uploadFile(request, reply) {
  let filePart = null
  const fields = {}

  try {
    for await (const part of request.parts()) {
      if (part.type === "file") {
        if (filePart) {
          return reply.code(400).send(errorResponse("Only one chart image can be uploaded at a time"))
        }

        filePart = {
          fieldname: part.fieldname,
          filename: part.filename,
          mimetype: part.mimetype,
          buffer: await part.toBuffer(),
        }
      } else {
        fields[part.fieldname] = part.value
      }
    }
  } catch (error) {
    if (error.code === "FST_REQ_FILE_TOO_LARGE") {
      return reply.code(400).send(errorResponse("Image must be less than 5MB"))
    }

    throw error
  }

  if (!filePart) {
    return reply.code(400).send(errorResponse("A chart image is required in the chart field"))
  }

  if (filePart.fieldname !== "chart") {
    return reply.code(400).send(errorResponse("Invalid file field. Use chart as the field name"))
  }

  if (!allowedImageTypes.has(filePart.mimetype)) {
    return reply.code(400).send(errorResponse("Only PNG, JPEG, and WEBP images are allowed"))
  }

  const assetHint = String(fields.assetHint || fields.instrument || "").trim() || null
  const timeframeHint = String(fields.timeframeHint || fields.timeframe || "").trim() || null
  const buffer = filePart.buffer

  if (buffer.length > maxFileSize) {
    return reply.code(400).send(errorResponse("Image must be less than 5MB"))
  }

  await fs.mkdir(uploadDirectory, { recursive: true })

  const extension = filePart.mimetype === "image/png" ? "png" : filePart.mimetype === "image/webp" ? "webp" : "jpg"
  const filename = `${Date.now()}-${crypto.randomUUID()}.${extension}`
  const localPath = path.join(uploadDirectory, filename)

  await fs.writeFile(localPath, buffer)

  const userId = request.user.id
  try {
    const { analysis, rawAiResponse } = await analyzeChartImage({
      imagePath: localPath,
      userId,
      assetHint,
      timeframeHint,
    })
    const performanceContext = await getUserPerformanceContext(userId, analysis.asset || assetHint, analysis.timeframe || timeframeHint)
    const mistakeContext = await getMistakePatterns(userId)
    const scoredAnalysis = enrichAnalysisWithScores(analysis, performanceContext)
    const finalDecision = buildFinalTradeDecision({
      aiAnalysis: scoredAnalysis,
      performanceContext,
      mistakeContext,
    })
    const enrichedAnalysis = {
      ...scoredAnalysis,
      finalDecision: finalDecision.finalDecision,
      finalConfidence: finalDecision.finalConfidence,
      ensembleResult: finalDecision,
      learningAdjustments: finalDecision.learningAdjustments,
      riskWarnings: [...finalDecision.warnings, ...finalDecision.riskNotes],
      expectedValue: finalDecision.expectedValue,
      requiredWinRate: finalDecision.requiredWinRate,
      historicalWinRate: finalDecision.historicalWinRate,
      rrQuality: finalDecision.rrQuality,
    }

    const upload = await createUploadRecord({
      userId,
      filename,
      originalName: filePart.filename || filename,
      mimeType: filePart.mimetype,
      size: buffer.length,
      localPath,
      publicUrl: null,
      provider: "local",
    })

    const analysisRecord = await createAnalysisRecord({
      userId,
      uploadId: upload.id,
      ...enrichedAnalysis,
      rawAiResponse,
      status: "completed",
    })

    return reply.code(201).send(
      successResponse(
        {
          upload,
          analysis: analysisRecord,
        },
        "Chart analyzed successfully",
      ),
    )
  } catch (error) {
    console.error("AI chart analysis failed", error)

    const upload = await createUploadRecord({
      userId,
      filename,
      originalName: filePart.filename || filename,
      mimeType: filePart.mimetype,
      size: buffer.length,
      localPath,
      publicUrl: null,
      provider: "local",
    })

    const analysisRecord = await createAnalysisRecord({
      userId,
      uploadId: upload.id,
      asset: assetHint,
      timeframe: timeframeHint,
      bias: "Neutral",
      confidence: 0,
      explanation: "AI analysis failed. Please try again after checking provider configuration.",
      smcNotes: {},
      strategyTags: ["analysis_failed"],
      rawAiResponse: {
        provider: "gemini",
        error: error.message,
      },
      status: "failed",
      errorMessage: error.message,
    })

    return reply.code(error.statusCode || 502).send(
      errorResponse("AI analysis failed", {
        analysis: analysisRecord,
        upload,
        reason: error.message,
      }),
    )
  }
}
