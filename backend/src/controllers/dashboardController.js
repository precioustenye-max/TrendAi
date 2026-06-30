import { getAnalysisCounts, getRecentAnalyses } from "../models/Analysis.js"
import { getTradeResultStats } from "../models/TradeResult.js"
import { successResponse } from "../utils/formatResponse.js"

export async function getDashboardStats(request, reply) {
  const counts = await getAnalysisCounts(request.user.id)
  const tradeStats = await getTradeResultStats(request.user.id)
  const recentAnalyses = await getRecentAnalyses(request.user.id, 5)

  return reply.send(
    successResponse(
      {
        data: {
          ...counts,
          winRate: tradeStats.winRate,
          recentAnalyses,
          subscription: {
            plan: "free",
            status: "active",
            analysesUsed: counts.totalAnalyses,
            limit: 10,
          },
        },
      },
      "Dashboard stats fetched successfully",
    ),
  )
}
