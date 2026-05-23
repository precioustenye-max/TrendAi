import { successResponse } from "../utils/formatResponse.js"
import { createPaymentIntent } from "../services/paymentService.js"

export async function createPayment(request, reply) {
  return reply.send(successResponse({ payment: createPaymentIntent() }, "Payment endpoint is ready"))
}
