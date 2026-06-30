import { z } from "zod"

import { createContactMessage } from "../services/emailService.js"
import { createContactMessageRecord } from "../models/ContactMessage.js"
import { errorResponse, successResponse } from "../utils/formatResponse.js"

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long").max(80),
  email: z.string().email(),
  subject: z.string().trim().max(255).optional().nullable(),
  message: z.string().trim().min(10, "Message must be at least 10 characters long").max(2000),
})

export async function submitContactMessage(request, reply) {
  const parsedBody = contactSchema.safeParse(request.body)

  if (!parsedBody.success) {
    return reply.code(400).send(errorResponse("Invalid request body", parsedBody.error.flatten()))
  }

  let contactMessage

  try {
    contactMessage = await createContactMessageRecord(parsedBody.data)
  } catch (error) {
    console.error("Unable to persist contact message", error)
    contactMessage = createContactMessage(parsedBody.data)
  }

  return reply
    .code(201)
    .send(successResponse({ contactMessage }, "Message received successfully"))
}
