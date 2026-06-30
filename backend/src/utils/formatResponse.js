export function successResponse(data = {}, message = "Request successful") {
  return {
    success: true,
    message,
    ...data,
  }
}

export function errorResponse(message = "Request failed", details = null) {
  return {
    success: false,
    message,
    error: typeof details === "string" ? details : details?.reason || null,
    details: typeof details === "string" ? null : details,
  }
}
