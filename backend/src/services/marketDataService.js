const binanceQuoteAssets = ["USDT", "BUSD", "FDUSD", "USDC", "BTC", "ETH"]

export function normalizeSymbol(symbol) {
  return String(symbol || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
}

function looksLikeCryptoSymbol(symbol) {
  return binanceQuoteAssets.some((quote) => symbol.endsWith(quote) && symbol.length > quote.length)
}

export async function getCurrentPrice(symbol) {
  const normalizedSymbol = normalizeSymbol(symbol)

  if (!normalizedSymbol) {
    const error = new Error("Missing market symbol")
    error.statusCode = 400
    throw error
  }

  if (!looksLikeCryptoSymbol(normalizedSymbol)) {
    const error = new Error(`Live price is currently supported for Binance crypto symbols only. Received ${normalizedSymbol}.`)
    error.statusCode = 400
    throw error
  }

  const url = `https://api.binance.com/api/v3/ticker/price?symbol=${encodeURIComponent(normalizedSymbol)}`
  const response = await fetch(url)

  if (!response.ok) {
    const error = new Error(`Unable to fetch Binance price for ${normalizedSymbol}`)
    error.statusCode = response.status
    throw error
  }

  const data = await response.json()
  const price = Number.parseFloat(data.price)

  if (!Number.isFinite(price)) {
    const error = new Error(`Binance returned an invalid price for ${normalizedSymbol}`)
    error.statusCode = 502
    throw error
  }

  return {
    symbol: normalizedSymbol,
    price,
    provider: "binance",
    fetchedAt: new Date().toISOString(),
  }
}
