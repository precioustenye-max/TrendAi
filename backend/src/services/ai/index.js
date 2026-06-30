import { env } from "../../config/env.js"
import { analyzeChartImageWithGemini } from "./geminiService.js"

const providers = {
  gemini: analyzeChartImageWithGemini,
}

export async function analyzeChartImage(options = {}) {
  const providerName = String(env.aiProvider || "gemini").toLowerCase()
  const provider = providers[providerName]

  if (!provider) {
    const error = new Error(`Unsupported AI_PROVIDER "${providerName}"`)
    error.statusCode = 400
    throw error
  }

  return provider(options)
}
