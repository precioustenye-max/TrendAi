import Fastify from "fastify"
import cors from "@fastify/cors"

const fastify = Fastify({
  logger: true,
})

async function start() {
  try {
    await fastify.register(cors, {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
    })

    fastify.get("/health", async () => {
      return { status: "ok", timestamp: new Date().toISOString() }
    })

    fastify.get("/api/analyze", async (request) => {
      const { symbol } = request.query as { symbol?: string }
      
      if (!symbol) {
        return { error: "Symbol is required" }
      }

      // Mock analysis response for now
      return {
        symbol: symbol.toUpperCase(),
        direction: "BULLISH",
        confidence: 72,
        reasoning: {
          technical: ["BOS confirmed on 4H chart", "Liquidity sweep at highs"],
          indicators: ["RSI oversold at 28", "MACD bullish crossover"],
          fundamental: ["Institutional inflows increasing"],
        },
        timeframe: {
          htfBias: { tf: "Daily", label: "Bullish" },
          poi: { tf: "1H", label: "Zone 43,200-43,500" },
          entry: { tf: "15m", label: "43,450" },
          killzone: "London Session",
          recommended: "15m",
        },
        trade: {
          entry: 43450,
          stopLoss: 42800,
          takeProfit: 44200,
        },
      }
    })

    const port = parseInt(process.env.PORT || "4000")
    await fastify.listen({ port })
    console.log(`Server running at http://localhost:${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()