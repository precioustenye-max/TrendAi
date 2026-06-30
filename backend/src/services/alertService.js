function toNumber(value) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}

export function resolveDirection(analysis) {
  const decision = analysis.finalDecision || analysis.decision

  if (decision === "Buy") return "buy"
  if (decision === "Sell") return "sell"
  if (analysis.bias === "Bullish") return "buy"
  if (analysis.bias === "Bearish") return "sell"
  return null
}

export function buildAlertFromAnalysis(analysis) {
  const direction = resolveDirection(analysis)
  const stopLoss = toNumber(analysis.stopLoss)
  const entryPrice = toNumber(analysis.entry)
  const takeProfits = (Array.isArray(analysis.takeProfits) ? analysis.takeProfits : [])
    .map(toNumber)
    .filter((value) => value != null)

  if (!direction || stopLoss == null || !takeProfits.length) {
    const error = new Error("Analysis needs a Buy/Sell decision, stop loss, and at least one take profit before alerts can be enabled.")
    error.statusCode = 400
    throw error
  }

  return {
    asset: analysis.asset,
    direction,
    entryPrice,
    stopLoss,
    takeProfits,
  }
}

export function evaluateAlertTrigger(alert, currentPrice) {
  const price = toNumber(currentPrice)

  if (price == null) {
    const error = new Error("currentPrice must be a valid number")
    error.statusCode = 400
    throw error
  }

  if (alert.status !== "active") {
    return { currentPrice: price, trigger: null }
  }

  const entryPrice = toNumber(alert.entryPrice)

  if (alert.direction === "buy") {
    if (price <= alert.stopLoss) {
      return { currentPrice: price, trigger: { type: "sl", target: "SL" } }
    }

    const target = alert.takeProfits.find((takeProfit) => price >= Number(takeProfit))
    if (target) {
      return { currentPrice: price, trigger: { type: "tp", target: String(target) } }
    }

    if (entryPrice != null && !alert.entryNotifiedAt && price >= entryPrice) {
      return { currentPrice: price, trigger: { type: "entry", target: "ENTRY" } }
    }

    return { currentPrice: price, trigger: null }
  }

  if (price >= alert.stopLoss) {
    return { currentPrice: price, trigger: { type: "sl", target: "SL" } }
  }

  const target = alert.takeProfits.find((takeProfit) => price <= Number(takeProfit))
  if (target) {
    return { currentPrice: price, trigger: { type: "tp", target: String(target) } }
  }

  if (entryPrice != null && !alert.entryNotifiedAt && price <= entryPrice) {
    return { currentPrice: price, trigger: { type: "entry", target: "ENTRY" } }
  }

  return { currentPrice: price, trigger: null }
}
