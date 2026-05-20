import Fastify from "fastify"
import cors from "@fastify/cors"

const fastify = Fastify({
  logger: true,
})

function createSmcAnalysis(symbol: string) {
  return {
    symbol: symbol.toUpperCase(),
    analystMode: "institutional-smc",
    bias: "BULLISH",
    summary:
      "Bullish continuation remains favored after a sell-side liquidity sweep, bullish CHOCH, and confirmation from a reclaimed bullish breaker block in discount.",
    marketStructure: {
      trendDirection: "Bullish continuation",
      bos: {
        status: "confirmed",
        timeframe: "4H",
        detail: "Bullish BOS confirmed above prior resistance after displacement.",
      },
      choch: {
        status: "confirmed",
        timeframe: "15m",
        detail: "Bullish CHOCH formed immediately after the sell-side sweep below support.",
      },
      continuationProbability: 76,
      reversalProbability: 24,
    },
    zoneAnalysis: {
      supports: [
        {
          label: "Major support",
          range: "63,820 - 64,020",
          strength: "high",
          reason: "Demand origin, liquidity sweep response, and strongest defended higher low.",
        },
      ],
      resistances: [
        {
          label: "Primary resistance",
          range: "64,940 - 65,120",
          strength: "high",
          reason: "Equal highs and nearest buy-side liquidity objective.",
        },
      ],
      supplyAreas: [
        {
          label: "Supply shelf",
          range: "64,940 - 65,180",
          reason: "Likely first reaction zone after continuation expands.",
        },
      ],
      demandAreas: [
        {
          label: "Institutional demand",
          range: "63,820 - 64,040",
          reason: "Origin of displacement after the stop hunt below support.",
        },
      ],
      orderBlocks: [
        {
          label: "Bullish order block",
          range: "63,900 - 64,040",
          reason: "Last down candle before the displacement candle that confirmed reversal intent.",
        },
      ],
      breakerBlocks: [
        {
          type: "demand-side breaker",
          classification: "bullish",
          range: "64,180 - 64,320",
          previousStructureInvalidated: "intraday bearish lower-high sequence",
          liquiditySweepBeforeFormation: "sell-side sweep below 63,980",
          entryStrength: "high",
          confirmationLevel: "15m CHOCH plus reclaim of breaker midpoint",
          probabilityScore: 81,
          aggressiveEntryOption: "64,220 on first retest after reclaim",
          conservativeEntryOption: "64,280 after candle close and mitigation hold",
        },
      ],
      mitigationBlocks: [
        {
          label: "Mitigation block",
          range: "64,180 - 64,280",
          reason: "Preferred continuation reload zone after displacement.",
        },
      ],
      fairValueGaps: [
        {
          label: "Bullish FVG",
          range: "64,260 - 64,340",
          reason: "Imbalance likely to act as support on a healthy retest.",
        },
      ],
      premiumDiscount: {
        state: "discount preferred",
        detail: "Longs are preferred from discount inside the reclaimed range, not from premium near resistance.",
      },
    },
    liquidityAnalysis: {
      equalHighs: "Equal highs remain above 65,000 and form the upside liquidity pool.",
      equalLows: "Equal lows under 63,980 were already swept.",
      liquidityPools: [
        "Buy-side liquidity above 65,000",
        "Residual sell-side liquidity below 63,820 if the bullish thesis fails",
      ],
      stopHunts: ["The wick below 63,980 reads as a stop hunt before reversal."],
      liquiditySweeps: ["Sell-side liquidity sweep completed before the bullish CHOCH."],
      trapZones: [
        "Breakout longs entering directly below resistance risk becoming exit liquidity.",
      ],
    },
    execution: {
      selectedEntry: {
        price: 64280,
        type: "conservative",
        tradeType: "intraday",
        smcConfirmations: [
          "4H bullish structure intact",
          "15m CHOCH confirmed",
          "Retest occurs in discount",
          "Bullish FVG remains respected",
        ],
        structureReasoning:
          "Entry is selected after price invalidated the short-term bearish sequence and proved acceptance back inside the bullish range.",
        zoneJustification:
          "The entry sits inside the bullish breaker block and mitigation zone, giving stronger confluence than chasing resistance.",
      },
      rejectedEntries: [
        {
          price: 64860,
          reasonRejected: "Too close to major resistance and equal highs.",
          missingConfirmations: "No clean breakout acceptance close yet.",
          weakLiquidity: "Entry would occur after most efficient upside delivery has already happened.",
          riskFactors: [
            "High fake-breakout risk",
            "Poor reward relative to invalidation distance",
          ],
          poorStructure: "No fresh support beneath the entry if breakout fails.",
        },
        {
          price: 64080,
          reasonRejected: "Attempted before CHOCH and breaker reclaim were fully confirmed.",
          missingConfirmations: "No validated bullish shift at that moment.",
          weakLiquidity: "The sweep had not yet clearly completed.",
          riskFactors: ["Higher chance of deeper stop hunt", "No confirmed continuation path"],
          poorStructure: "Entry was anticipatory rather than validated.",
        },
      ],
      stopLoss: 63780,
      takeProfit1: 64980,
      takeProfit2: 65420,
      takeProfit3: 66100,
      riskRewardRatio: "1:3.6",
    },
    explanation: {
      whyThisEntry: "The chosen entry is safer because it follows the sweep, CHOCH, and breaker reclaim instead of anticipating them.",
      whyThisSupportResistanceMatters:
        "The main support zone is where liquidity was harvested and demand produced the displacement that shifted structure.",
      whyNearbyEntryRejected:
        "The higher entry was rejected because it sits too close to resistance and lacks the same confluence.",
      confirmations:
        "Bullish BOS, bullish CHOCH, discount pricing, breaker block mitigation, and FVG support are all present.",
      earlyEntryRisk:
        "Entering before CHOCH or before the liquidity sweep completes exposes the trade to deeper stop hunts and false reversals.",
      institutionalReasoning:
        "Institutional logic favors taking continuation from discount after weak-hand liquidity has been removed and structure confirms the new delivery path.",
    },
    confidenceEngine: {
      probabilityScore: 81,
      riskLevel: "moderate",
      setupStrength: "high",
      smcAlignmentScore: 88,
      liquidityQuality: "high",
      structureQuality: "high",
    },
  }
}

function createChartAnalysis() {
  return {
    asset: "BTC/USDT",
    timeframe: "4H",
    analystMode: "institutional-smc-vision",
    sections: {
      marketStructure: {
        trendDirection: "Bullish continuation",
        bosStatus: "Bullish BOS confirmed after reclaim of resistance",
        chochStatus: "Bullish CHOCH after the sweep below support",
        bias: "Bullish",
        continuationProbability: 78,
        reversalProbability: 22,
      },
      zoneAnalysis: {
        supportZones: ["63,820 - 64,020", "64,180 - 64,280"],
        resistanceZones: ["64,940 - 65,120", "65,420 - 65,560"],
        orderBlocks: ["Bullish order block at 63,900 - 64,040"],
        breakerBlocks: ["Bullish breaker block at 64,180 - 64,320"],
        mitigationZones: ["64,180 - 64,280"],
        supplyZones: ["64,940 - 65,180"],
        demandZones: ["63,820 - 64,040"],
        fairValueGaps: ["64,260 - 64,340"],
      },
      liquidityAnalysis: {
        equalHighs: "Equal highs above 65,000",
        equalLows: "Equal lows below 63,980 already swept",
        liquidityPools: ["Buy-side liquidity above 65,000"],
        stopHuntAreas: ["Wick below 63,980"],
        liquiditySweeps: ["Sell-side sweep completed before continuation"],
        trapZones: ["Late longs near resistance risk getting trapped"],
      },
      tradeExecution: {
        entryPrice: 64280,
        stopLoss: 63780,
        takeProfit1: 64980,
        takeProfit2: 65420,
        takeProfit3: 66100,
        riskRewardRatio: "1:3.6",
        tradeType: "intraday",
        entryStyle: "conservative",
      },
      explanation: {
        whyEntryWasSelected:
          "Entry was selected from the bullish breaker block after the liquidity sweep because structure already validated continuation.",
        whyAlternativeEntriesRejected:
          "Alternative entries were rejected for either lacking confirmation or being too close to resistance.",
        institutionalReasoning:
          "Weak-hand liquidity was cleared first, then price reclaimed support and returned into discount.",
        smcConfirmations:
          "BOS, CHOCH, breaker block, support retention, and FVG support align.",
      },
      confidenceEngine: {
        probabilityScore: 81,
        riskLevel: "moderate",
        setupStrength: "high",
        smcAlignmentScore: 88,
        liquidityQuality: "high",
        structureQuality: "high",
      },
    },
  }
}

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

      return createSmcAnalysis(symbol)
    })

    fastify.post("/api/analyze-chart", async () => {
      return createChartAnalysis()
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
