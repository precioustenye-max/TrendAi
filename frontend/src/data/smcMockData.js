export const chartUploadAnalysis = {
  asset: 'BTC/USDT',
  marketStructure: {
    bias: 'Bullish',
    bos: 'Bullish BOS remains intact above the last defended higher low.',
    choch: 'No confirmed bearish CHOCH has appeared on the visible chart structure.',
    internalStructure: 'Price is compressing under resistance with a sequence of supported higher lows.',
  },
  zoneAnalysis: {
    demandZones: [
      'Demand sits below the current price where prior aggressive buying stepped in.',
      'The last pullback respected this zone, which supports the bullish read.',
    ],
    supplyZones: [
      'Visible supply remains around the resistance shelf near the local highs.',
      'A clean close above that shelf would shift the setup from watchlist to active continuation.',
    ],
  },
  liquidityAnalysis: {
    buySideLiquidity: [
      'Equal highs and recent swing highs provide a clear upside liquidity pool.',
      'That pool can attract price if resistance breaks with acceptance.',
    ],
    sellSideLiquidity: [
      'Sell-side liquidity rests below the most recent defended higher low.',
      'If price takes that level, the bullish idea weakens fast.',
    ],
    liquidityNarrative:
      'Current structure suggests price is pressing upward into liquidity rather than fully rejecting from it.',
  },
  execution: {
    entryPrice: '64,280',
    stopLoss: '63,780',
    takeProfit1: '64,980',
    takeProfit2: '65,420',
    riskRewardRatio: '1:2.4',
  },
  explanation: {
    screenshotRead:
      'The uploaded chart shows repeated support underneath resistance, which usually signals compression before a directional move.',
    structureReasoning:
      'The AI favors the bullish path because the screenshot still shows defended lows and no clean bearish structure break.',
    executionReasoning:
      'The preferred execution is a confirmation long after resistance acceptance, not a blind entry into the ceiling.',
  },
  confidenceEngine: {
    structureScore: 'Strong',
    liquidityScore: 'Moderate to strong',
    confirmationNeed: 'Break and hold above the visible resistance shelf',
    overallConfidence: '82%',
  },
  rejectedEntries: [
    {
      label: 'Aggressive breakout wick',
      price: '64,610',
      reason: 'A wick through resistance without acceptance can trap breakout buyers.',
      condition: 'Rejected unless price closes and holds above the level.',
    },
    {
      label: 'Late chase entry',
      price: '65,050',
      reason: 'Entering after the first expansion reduces reward quality.',
      condition: 'Rejected unless a fresh base forms before continuation.',
    },
  ],
};
