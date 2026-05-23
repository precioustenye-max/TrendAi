import { successResponse } from "../utils/formatResponse.js"

export async function uploadFile(request, reply) {
  return reply.send(
    successResponse(
      {
        upload: {
          status: "pending",
          message: "Upload handling is not implemented yet.",
        },
      },
      "Upload endpoint is ready",
    ),
  )
}
