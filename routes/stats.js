import express from "express"
import Cut from "../models/Cut.js"
import { verifyToken, requireRole } from "../middleware/auth.js"

const router = express.Router()

// Get stats (solo admin)
router.get("/", verifyToken, requireRole(["admin"]), async (req, res) => {
  try {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    // Total ingresos del día
    const cutsToday = await Cut.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$amount" },
          totalCuts: { $sum: 1 },
        },
      },
    ])

    // Ingresos por barbero
    const incomeByBarber = await Cut.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: "$barberId",
          totalIncome: { $sum: "$amount" },
          cuts: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "barber",
        },
      },
      {
        $unwind: "$barber",
      },
      {
        $project: {
          _id: 0,
          barberId: "$_id",
          barberName: { $concat: ["$barber.name", " ", "$barber.lastName"] },
          totalIncome: 1,
          cuts: 1,
        },
      },
    ])

    res.json({
      todayStats: cutsToday[0] || { totalIncome: 0, totalCuts: 0 },
      incomeByBarber,
    })
  } catch (err) {
    res.status(500).json({ message: "Error al obtener estadísticas", error: err.message })
  }
})

export default router
