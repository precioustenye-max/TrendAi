const marketProfiles = {
  "BTC/USDT": {
    bias: "Bullish",
    confidence: "84%",
    timeframe: "4H swing",
    currentPrice: "64,180",
    triggerPrice: "64,600",
    invalidationPrice: "63,420",
    targetPrice: "66,100",
  },
  "ETH/USDT": {
    bias: "Bullish",
    confidence: "79%",
    timeframe: "4H swing",
    currentPrice: "3,140",
    triggerPrice: "3,185",
    invalidationPrice: "3,060",
    targetPrice: "3,280",
  },
  "SOL/USDT": {
    bias: "Bearish",
    confidence: "76%",
    timeframe: "4H swing",
    currentPrice: "148.20",
    triggerPrice: "145.80",
    invalidationPrice: "151.40",
    targetPrice: "139.50",
  },
  "EUR/USD": {
    bias: "Bullish",
    confidence: "72%",
    timeframe: "1D swing",
    currentPrice: "1.0842",
    triggerPrice: "1.0860",
    invalidationPrice: "1.0798",
    targetPrice: "1.0915",
  },
  NASDAQ: {
    bias: "Bullish",
    confidence: "81%",
    timeframe: "1D swing",
    currentPrice: "18,420",
    triggerPrice: "18,560",
    invalidationPrice: "18,140",
    targetPrice: "18,980",
  },
  XAUUSD: {
    bias: "Bearish",
    confidence: "82%",
    timeframe: "15M scalp",
    currentPrice: "2,329.40",
    triggerPrice: "2,326.80",
    invalidationPrice: "2,336.20",
    targetPrice: "2,314.00",
  },
  EURUSD: {
    bias: "Bullish",
    confidence: "72%",
    timeframe: "15M scalp",
    currentPrice: "1.0842",
    triggerPrice: "1.0860",
    invalidationPrice: "1.0798",
    targetPrice: "1.0915",
  },
  GBPUSD: {
    bias: "Bullish",
    confidence: "74%",
    timeframe: "15M scalp",
    currentPrice: "1.2680",
    triggerPrice: "1.2705",
    invalidationPrice: "1.2620",
    targetPrice: "1.2760",
  },
  USDJPY: {
    bias: "Bearish",
    confidence: "70%",
    timeframe: "15M scalp",
    currentPrice: "157.80",
    triggerPrice: "157.35",
    invalidationPrice: "158.40",
    targetPrice: "156.20",
  },
  NAS100: {
    bias: "Bullish",
    confidence: "81%",
    timeframe: "15M scalp",
    currentPrice: "18,420",
    triggerPrice: "18,560",
    invalidationPrice: "18,140",
    targetPrice: "18,980",
  },
  US30: {
    bias: "Bullish",
    confidence: "77%",
    timeframe: "15M scalp",
    currentPrice: "39,120",
    triggerPrice: "39,260",
    invalidationPrice: "38,880",
    targetPrice: "39,640",
  },
  BTCUSD: {
    bias: "Bullish",
    confidence: "84%",
    timeframe: "15M scalp",
    currentPrice: "64,180",
    triggerPrice: "64,600",
    invalidationPrice: "63,420",
    targetPrice: "66,100",
  },
}

const screenshotReport = {
  asset: "BTC/USDT",
  marketStructure: {
    bias: "Bullish",
    bos: "Bullish BOS remains intact above the last defended higher low.",
    choch: "No confirmed bearish CHOCH has appeared on the visible chart structure.",
    internalStructure:
      "Price is compressing under resistance with a sequence of supported higher lows.",
  },
  zoneAnalysis: {
    demandZones: [
      "Demand sits below the current price where prior aggressive buying stepped in.",
      "The last pullback respected this zone, which supports the bullish read.",
    ],
    supplyZones: [
      "Visible supply remains around the resistance shelf near the local highs.",
      "A clean close above that shelf would shift the setup from watchlist to active continuation.",
    ],
  },
  liquidityAnalysis: {
    buySideLiquidity: [
      "Equal highs and recent swing highs provide a clear upside liquidity pool.",
      "That pool can attract price if resistance breaks with acceptance.",
    ],
    sellSideLiquidity: [
      "Sell-side liquidity rests below the most recent defended higher low.",
      "If price takes that level, the bullish idea weakens fast.",
    ],
    liquidityNarrative:
      "Current structure suggests price is pressing upward into liquidity rather than fully rejecting from it.",
  },
  execution: {
    entryPrice: "64,280",
    stopLoss: "63,780",
    takeProfit1: "64,980",
    takeProfit2: "65,420",
    riskRewardRatio: "1:2.4",
  },
  explanation: {
    screenshotRead:
      "The uploaded chart shows repeated support underneath resistance, which usually signals compression before a directional move.",
    structureReasoning:
      "The AI favors the bullish path because the screenshot still shows defended lows and no clean bearish structure break.",
    executionReasoning:
      "The preferred execution is a confirmation long after resistance acceptance, not a blind entry into the ceiling.",
  },
  confidenceEngine: {
    structureScore: "Strong",
    liquidityScore: "Moderate to strong",
    confirmationNeed: "Break and hold above the visible resistance shelf",
    overallConfidence: "82%",
  },
  rejectedEntries: [
    {
      label: "Aggressive breakout wick",
      price: "64,610",
      reason: "A wick through resistance without acceptance can trap breakout buyers.",
      condition: "Rejected unless price closes and holds above the level.",
    },
    {
      label: "Late chase entry",
      price: "65,050",
      reason: "Entering after the first expansion reduces reward quality.",
      condition: "Rejected unless a fresh base forms before continuation.",
    },
  ],
}

function normalizeMarket(market) {
  return String(market || "BTC/USDT").trim().toUpperCase()
}

function buildNarrative(profile, market) {
  const isBullish = profile.bias === "Bullish"
  const direction = isBullish ? "bullish" : "bearish"
  const triggerAction = isBullish ? "accepts above" : "accepts below"
  const targetSide = isBullish ? "upside" : "downside"

  return {
    ...profile,
    market,
    biasTone: isBullish ? "var(--chart-green)" : "var(--chart-red)",
    intro: `TrendAi is ${direction} on ${market}, but the setup still needs confirmation at the trigger level before execution.`,
    headline: `If price ${triggerAction} ${profile.triggerPrice}, the ${direction} continuation setup becomes active.`,
    confirmationText: `A strong close through ${profile.triggerPrice} confirms that price has accepted beyond the decision zone and supports ${targetSide} delivery.`,
    invalidationText: `If price trades back through ${profile.invalidationPrice}, the current ${direction} structure is no longer clean and the setup should be reassessed.`,
    summary: `The active read is ${direction}: one main direction, one trigger, one invalidation level, and evidence that supports that call.`,
    biasFacts: [
      `SMC structure favors the ${direction} path while the invalidation level holds.`,
      `Liquidity positioning supports a move toward ${profile.targetPrice} after confirmation.`,
      "CRT context favors waiting for acceptance instead of chasing the first wick.",
      "Indicators support the bias, but the trigger level remains the execution decision point.",
    ],
    thesisSections: [
      {
        title: "SMC confirmation",
        icon: "Layers3",
        accent: "var(--chart-blue)",
        bullets: [
          isBullish
            ? "Demand remains defended below current price."
            : "Supply continues to cap recovery attempts.",
          isBullish
            ? "The latest pullback did not break bullish structure."
            : "The latest bounce did not recover bullish structure.",
          isBullish
            ? "Buy-side liquidity remains open above the highs."
            : "Sell-side liquidity remains exposed below support.",
        ],
      },
      {
        title: "CRT confirmation",
        icon: "CandlestickChart",
        accent: isBullish ? "var(--chart-green)" : "var(--chart-red)",
        bullets: [
          "The range still needs a clean acceptance candle.",
          "A wick alone is not enough confirmation for execution.",
          "Failure back into range weakens the current thesis quickly.",
        ],
      },
      {
        title: "Fundamental filter",
        icon: "Landmark",
        accent: "var(--chart-yellow)",
        bullets: [
          "No direct macro contradiction is currently priced into this read.",
          "Unexpected news risk should override a purely technical signal.",
          "Narrative strength is treated as a filter, not as the entry trigger.",
        ],
      },
      {
        title: "Indicator filter",
        icon: "LineChart",
        accent: "var(--chart-purple)",
        bullets: [
          "Momentum is aligned with the current bias.",
          "Volume expansion is still required for a higher-quality move.",
          "Indicators confirm context while price confirms execution.",
        ],
      },
    ],
  }
}

export function getSupportedMarkets() {
  return Object.keys(marketProfiles)
}

export function analyzeChart({ market, instrument, tradeFocus, charts } = {}) {
  const requestedMarket = normalizeMarket(market || instrument)
  const profile = marketProfiles[requestedMarket] || marketProfiles["BTC/USDT"]
  const resolvedMarket = marketProfiles[requestedMarket] ? requestedMarket : "BTC/USDT"
  const analysis = buildNarrative(
    {
      ...profile,
      timeframe: tradeFocus ? `${tradeFocus === "scalping" ? "15M scalp" : "4H swing"}` : profile.timeframe,
    },
    resolvedMarket,
  )
  const isBullish = analysis.bias === "Bullish"

  return {
    ...analysis,
    tradePlan: {
      trend: analysis.bias,
      tradeIdea: isBullish ? "Buy" : "Sell",
      entry: analysis.triggerPrice,
      stopLoss: analysis.invalidationPrice,
      takeProfit: analysis.targetPrice,
      riskReward: isBullish ? "1:2.4" : "1:2.1",
      strength: Number.parseInt(analysis.confidence, 10) >= 80 ? "Strong" : "Moderate",
      duration: tradeFocus === "swing" ? "1d 8h" : "3h 30m",
    },
    charts: Array.isArray(charts) ? charts : [],
    analyzedAt: new Date().toISOString(),
  }
}

export function getScreenshotReport() {
  return screenshotReport
}
