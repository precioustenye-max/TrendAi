import fs from "node:fs/promises"
import path from "node:path"

import { GoogleGenAI } from "@google/genai"

import { env } from "../../config/env.js"
import { buildPerformancePromptContext } from "../learningService.js"

const defaultSmcNotes = {
  trend: null,
  support: null,
  resistance: null,
  orderBlock: null,
  breakerBlock: null,
  fairValueGap: null,
  liquidity: null,
  bosOrChoch: null,
  invalidation: null,
}

function getMimeType(imagePath) {
  const extension = path.extname(imagePath).toLowerCase()

  if (extension === ".png") {
    return "image/png"
  }

  if (extension === ".webp") {
    return "image/webp"
  }

  return "image/jpeg"
}

function extractJson(text) {
  const trimmed = String(text || "").trim()

  if (!trimmed) {
    throw new Error("Gemini returned an empty response")
  }

  try {
    return JSON.parse(trimmed)
  } catch {
    const withoutFence = trimmed
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/i, "")
      .trim()

    try {
      return JSON.parse(withoutFence)
    } catch {
      const start = withoutFence.indexOf("{")
      const end = withoutFence.lastIndexOf("}")

      if (start >= 0 && end > start) {
        return JSON.parse(withoutFence.slice(start, end + 1))
      }

      throw new Error("Gemini response was not valid JSON")
    }
  }
}

function normalizeNullableString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function normalizeAnalysisJson(value) {
  const smcNotes = value.smcNotes && typeof value.smcNotes === "object" ? value.smcNotes : {}

  return {
    asset: normalizeNullableString(value.asset),
    timeframe: normalizeNullableString(value.timeframe),
    decision: ["Buy", "Sell", "No Trade"].includes(value.decision) ? value.decision : null,
    bias: ["Bullish", "Bearish", "Neutral"].includes(value.bias) ? value.bias : "Neutral",
    confidence: Math.min(Math.max(Number(value.confidence || 0), 0), 95),
    entry: value.entry == null ? null : String(value.entry),
    stopLoss: value.stopLoss == null ? null : String(value.stopLoss),
    takeProfits: Array.isArray(value.takeProfits) ? value.takeProfits.map(String) : [],
    riskReward: value.riskReward == null ? null : String(value.riskReward),
    explanation:
      typeof value.explanation === "string" && value.explanation.trim()
        ? value.explanation.trim()
        : "The chart could not be analyzed confidently. Use caution and do not treat this as financial advice.",
    smcNotes: {
      ...defaultSmcNotes,
      ...smcNotes,
    },
    strategyTags: Array.isArray(value.strategyTags) ? value.strategyTags.map(String) : [],
    disclaimer: "This is AI-generated analysis and not financial advice.",
  }
}

function readGeminiText(response) {
  if (typeof response?.text === "function") {
    return response.text()
  }

  if (typeof response?.text === "string") {
    return response.text
  }

  const parts = response?.candidates?.[0]?.content?.parts || []
  return parts.map((part) => part.text || "").join("")
}

function buildPrompt({ assetHint, timeframeHint, historicalMarketData, performanceContext }) {
  return `You are TrendAI, an institutional Smart Money Concept trading analyst.

Analyze the uploaded trading chart screenshot using visible evidence only.

Return ONLY valid JSON. Never output markdown. Never output code fences. Never add text before or after JSON.

Required JSON format:
{
  "asset": null,
  "timeframe": null,
  "decision": "Buy | Sell | No Trade",
  "bias": "Bullish | Bearish | Neutral",
  "confidence": 0,
  "entry": null,
  "stopLoss": null,
  "takeProfits": [],
  "riskReward": null,
  "explanation": "",
  "smcNotes": {
    "trend": "",
    "support": "",
    "resistance": "",
    "orderBlock": "",
    "breakerBlock": "",
    "fairValueGap": "",
    "liquidity": "",
    "bosOrChoch": "",
    "invalidation": ""
  },
  "strategyTags": [],
  "disclaimer": "This is AI-generated analysis and not financial advice."
}

Rules:
- Detect the trading pair only if visible. If not visible, return null.
- Detect the timeframe only if visible. If not visible, return null.
- User asset hint: ${assetHint || "none"}.
- User timeframe hint: ${timeframeHint || "none"}.
- Use hints only as supporting context. Do not override the screenshot if the image is unclear.
- Analyze market structure, BOS, CHOCH, liquidity sweeps, fair value gaps, order blocks, breaker blocks, support, and resistance.
- Determine Bullish, Bearish, or Neutral bias from visible structure.
- Decide Buy, Sell, or No Trade. Never force Buy or Sell.
- Return No Trade if chart is unclear, no clean invalidation exists, risk/reward is below 1:2, support/resistance is unclear, or structure confirmation is weak.
- Suggest high-probability entry, stop loss, and multiple take profits only when the screenshot supports them.
- Explain why every entry, stop loss, take profit, and bias decision was made.
- Never invent unavailable information. Return null for fields that cannot be determined.
- Never promise profit or certainty.
- Include a risk warning inside explanation.

Optional historical market data:
${historicalMarketData ? JSON.stringify(historicalMarketData) : "none"}

User performance context:
${performanceContext || "There is not enough historical feedback yet."}`
}

export async function analyzeChartImageWithGemini({
  imagePath,
  userId = null,
  assetHint = null,
  timeframeHint = null,
  historicalMarketData = null,
} = {}) {
  if (!env.geminiApiKey) {
    const error = new Error("GEMINI_API_KEY is missing. Add a Gemini API key to backend/.env to enable AI chart analysis.")
    error.statusCode = 503
    throw error
  }

  const imageBuffer = await fs.readFile(imagePath)
  const performanceContext = userId
    ? await buildPerformancePromptContext(userId, assetHint, timeframeHint).catch((error) => {
        console.error("Unable to build performance context", error)
        return "Performance context unavailable."
      })
    : "Performance context unavailable."

  const ai = new GoogleGenAI({ apiKey: env.geminiApiKey })
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: buildPrompt({
              assetHint,
              timeframeHint,
              historicalMarketData,
              performanceContext,
            }),
          },
          {
            inlineData: {
              mimeType: getMimeType(imagePath),
              data: imageBuffer.toString("base64"),
            },
          },
        ],
      },
    ],
    config: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  })

  const text = readGeminiText(response)
  const parsed = extractJson(text)

  return {
    analysis: normalizeAnalysisJson(parsed),
    rawAiResponse: {
      provider: "gemini",
      model: "gemini-2.5-flash",
      parsed,
    },
  }
}
