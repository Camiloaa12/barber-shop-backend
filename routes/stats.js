import express from "express"
import Cut from "../models/Cut.js"
import { verifyToken, requireRole } from "../middleware/auth.js"
import mongoose from "mongoose"

const router = express.Router()

// Helper to get start/end of day
const getDayRange = (dateStr) => {
  const start = new Date(dateStr || new Date())
  start.setHours(0, 0, 0, 0)
  const end = new Date(dateStr || new Date())
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

// ADMIN: Global Stats
router.get("/", verifyToken, requireRole(["admin"]), async (req, res) => {
  try {
    const { start, end } = getDayRange(req.query.date)

    // 1. Total Income & Cuts Today
    const todayStats = await Cut.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: null, totalIncome: { $sum: "$amount" }, totalCuts: { $sum: 1 }, uniqueClients: { $addToSet: "$clientName" } } }
    ])

    const stats = todayStats[0] || { totalIncome: 0, totalCuts: 0, uniqueClients: [] }

    // 2. Income by Barber (Ranking)
    const incomeByBarber = await Cut.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: "$barberId", totalIncome: { $sum: "$amount" }, cuts: { $sum: 1 } } },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "barber" } },
      { $unwind: "$barber" },
      { $project: { _id: 0, barberId: "$_id", barberName: { $concat: ["$barber.name", " ", "$barber.lastName"] }, totalIncome: 1, cuts: 1 } },
      { $sort: { totalIncome: -1 } }
    ])

    // 3. Payment Method Distribution
    const paymentMethods = await Cut.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: "$paymentMethod", count: { $sum: 1 } } }
    ])

    // 4. Weekly Trends (Last 7 days)
    const sevenDaysAgo = new Date(start)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)

    const weeklyTrend = await Cut.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo, $lte: end } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          income: { $sum: "$amount" },
          cuts: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    res.json({
      today: {
        totalIncome: stats.totalIncome,
        totalCuts: stats.totalCuts,
        clientsServed: stats.uniqueClients.length
      },
      ranking: incomeByBarber,
      paymentMethods,
      weeklyTrend
    })
  } catch (err) {
    res.status(500).json({ message: "Error al obtener estadísticas globales", error: err.message })
  }
})

// BARBER: Personal Stats
router.get("/me", verifyToken, async (req, res) => {
  try {
    const { start, end } = getDayRange(req.query.date)
    const barberId = new mongoose.Types.ObjectId(req.user.userId)

    // 1. Daily Stats
    const dailyStats = await Cut.aggregate([
      { $match: { barberId, createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$amount" },
          totalCuts: { $sum: 1 },
          avgTicket: { $avg: "$amount" },
          paymentMethods: { $push: "$paymentMethod" }
        }
      }
    ])

    const stats = dailyStats[0] || { totalIncome: 0, totalCuts: 0, avgTicket: 0, paymentMethods: [] }

    // Calculate most frequent payment method
    const pmCounts = stats.paymentMethods.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1
      return acc
    }, {})
    const mostFrequentPM = Object.keys(pmCounts).sort((a, b) => pmCounts[b] - pmCounts[a])[0] || "N/A"

    // 2. History (Last 30 days)
    const thirtyDaysAgo = new Date(start)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)

    const history = await Cut.aggregate([
      { $match: { barberId, createdAt: { $gte: thirtyDaysAgo, $lte: end } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          income: { $sum: "$amount" },
          cuts: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    res.json({
      today: {
        totalIncome: stats.totalIncome,
        totalCuts: stats.totalCuts,
        avgTicket: parseFloat(stats.avgTicket.toFixed(2)),
        mostFrequentPayment: mostFrequentPM
      },
      history
    })
  } catch (err) {
    res.status(500).json({ message: "Error al obtener estadísticas personales", error: err.message })
  }
})

export default router
