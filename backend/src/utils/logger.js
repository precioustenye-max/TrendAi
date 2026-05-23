export function logInfo(message, meta = {}) {
  console.log(`[info] ${message}`, meta)
}

export function logError(message, meta = {}) {
  console.error(`[error] ${message}`, meta)
}
