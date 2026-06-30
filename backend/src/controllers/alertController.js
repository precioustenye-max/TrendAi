import { z } from "zod"

import { findAnalysisById } from "../models/Analysis.js"
import {
  cancelTradeAlert,
  createTradeAlert,
  findTradeAlertById,
  listTradeAlerts,
  updateTradeAlertCheck,
} from "../models/TradeAlert.js"
import { maybeSendTradeAlertEmail } from "../services/alertNotificationService.js"
import { buildAlertFromAnalysis, evaluateAlertTrigger } from "../services/alertService.js"
import { getCurrentPrice } from "../services/marketDataService.js"
import { errorResponse, successResponse } from "../utils/formatResponse.js"

const priceCheckSchema = z.object({
  currentPrice: z.number(),
})

export async function createAlertFromAnalysis(request, reply) {
  const analysis = await findAnalysisById(request.params.id, request.user.id)

  if (!analysis) {
    return reply.code(404).send(errorResponse("Analysis not found"))
  }

  try {
    const alertInput = buildAlertFromAnalysis(analysis)
    const alert = await createTradeAlert({
      userId: request.user.id,
      analysisId: analysis.id,
      ...alertInput,
    })

    return reply.code(201).send(successResponse({ data: alert }, "Trade alert enabled"))
  } catch (error) {
    return reply.code(error.statusCode || 400).send(errorResponse(error.message))
  }
}

export async function getAlerts(request, reply) {
  const alerts = await listTradeAlerts(request.user.id, request.query?.status || null)
  return reply.send(successResponse({ data: alerts }, "Trade alerts fetched successfully"))
}

export async function checkAlertPrice(request, reply) {
  const parsedBody = priceCheckSchema.safeParse(request.body)

  if (!parsedBody.success) {
    return reply.code(400).send(errorResponse("Invalid price payload", parsedBody.error.flatten()))
  }

  const alert = await findTradeAlertById(request.params.id, request.user.id)

  if (!alert) {
    return reply.code(404).send(errorResponse("Trade alert not found"))
  }

  try {
    const evaluation = evaluateAlertTrigger(alert, parsedBody.data.currentPrice)
    const updatedAlert = await updateTradeAlertCheck(alert.id, request.user.id, evaluation)
    const notification = await maybeSendTradeAlertEmail({
      user: request.user,
      alert: updatedAlert,
      trigger: evaluation.trigger,
      currentPrice: evaluation.currentPrice,
      symbol: alert.asset,
    })

    return reply.send(
      successResponse(
        {
          data: {
            alert: notification.alert,
            triggered: Boolean(evaluation.trigger),
            trigger: evaluation.trigger,
            email: notification.email,
          },
        },
        evaluation.trigger ? "Trade alert triggered" : "Trade alert checked",
      ),
    )
  } catch (error) {
    return reply.code(error.statusCode || 400).send(errorResponse(error.message))
  }
}

export async function checkAlertLivePrice(request, reply) {
  const alert = await findTradeAlertById(request.params.id, request.user.id)

  if (!alert) {
    return reply.code(404).send(errorResponse("Trade alert not found"))
  }

  try {
    const marketPrice = await getCurrentPrice(alert.asset)
    const evaluation = evaluateAlertTrigger(alert, marketPrice.price)
    const updatedAlert = await updateTradeAlertCheck(alert.id, request.user.id, evaluation)
    const notification = await maybeSendTradeAlertEmail({
      user: request.user,
      alert: updatedAlert,
      trigger: evaluation.trigger,
      currentPrice: marketPrice.price,
      symbol: marketPrice.symbol,
    })

    return reply.send(
      successResponse(
        {
          data: {
            alert: notification.alert,
            currentPrice: marketPrice.price,
            symbol: marketPrice.symbol,
            provider: marketPrice.provider,
            fetchedAt: marketPrice.fetchedAt,
            triggered: Boolean(evaluation.trigger),
            trigger: evaluation.trigger,
            email: notification.email,
          },
        },
        evaluation.trigger ? "Trade alert triggered" : "Live price checked",
      ),
    )
  } catch (error) {
    return reply.code(error.statusCode || 502).send(errorResponse(error.message))
  }
}

export async function checkAllLivePrices(request, reply) {
  const alerts = await listTradeAlerts(request.user.id, "active")
  const triggered = []
  const active = []
  const failed = []

  for (const alert of alerts) {
    try {
      const marketPrice = await getCurrentPrice(alert.asset)
      const evaluation = evaluateAlertTrigger(alert, marketPrice.price)
      const updatedAlert = await updateTradeAlertCheck(alert.id, request.user.id, evaluation)
      const notification = await maybeSendTradeAlertEmail({
        user: request.user,
        alert: updatedAlert,
        trigger: evaluation.trigger,
        currentPrice: marketPrice.price,
        symbol: marketPrice.symbol,
      })
      const payload = {
        alert: notification.alert,
        currentPrice: marketPrice.price,
        symbol: marketPrice.symbol,
        provider: marketPrice.provider,
        fetchedAt: marketPrice.fetchedAt,
        triggered: Boolean(evaluation.trigger),
        trigger: evaluation.trigger,
        email: notification.email,
      }

      if (evaluation.trigger) {
        triggered.push(payload)
      } else {
        active.push(payload)
      }
    } catch (error) {
      failed.push({
        alert,
        message: error.message,
      })
    }
  }

  return reply.send(
    successResponse(
      {
        data: {
          triggered,
          active,
          failed,
        },
      },
      "Live alert checks completed",
    ),
  )
}

export async function cancelAlert(request, reply) {
  const cancelled = await cancelTradeAlert(request.params.id, request.user.id)

  if (!cancelled) {
    return reply.code(404).send(errorResponse("Trade alert not found"))
  }

  return reply.send(successResponse({ data: { id: request.params.id } }, "Trade alert cancelled"))
}
