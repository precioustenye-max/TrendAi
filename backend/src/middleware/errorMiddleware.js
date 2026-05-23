import { errorResponse } from "../utils/formatResponse.js"

export function setErrorHandler(app) {
  app.setErrorHandler((error, request, reply) => {
    const statusCode = error.statusCode || 500
    const message = error.message || "Internal server error"

    request.log.error(error)
    reply.code(statusCode).send(errorResponse(message))
  })
}
