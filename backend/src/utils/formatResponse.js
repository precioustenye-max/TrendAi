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
    details,
  }
}
