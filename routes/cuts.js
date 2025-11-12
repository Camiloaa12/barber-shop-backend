import express from "express"
import Cut from "../models/Cut.js"
import { verifyToken, requireRole } from "../middleware/auth.js"

const router = express.Router()

// Get cuts (para barbero: solo sus cortes; para admin: todos)
router.get("/", verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, barberId } = req.query
    const query = {}

    if (req.userRole === "barbero") {
      query.barberId = req.userId
    } else if (barberId) {
      query.barberId = barberId
    }

    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate)
      if (endDate) query.createdAt.$lte = new Date(endDate)
    }

    const cuts = await Cut.find(query).populate("barberId", "name lastName").sort({ createdAt: -1 })

    res.json(cuts)
  } catch (err) {
    res.status(500).json({ message: "Error al obtener cortes", error: err.message })
  }
})

// Create cut
router.post("/", verifyToken, requireRole(["barbero", "admin"]), async (req, res) => {
  try {
    const { clientId, clientName, clientLastName, amount, paymentMethod, observations } = req.body

    if (!clientName || !clientLastName || !amount || !paymentMethod) {
      return res.status(400).json({ message: "Campos requeridos incompletos" })
    }

    const newCut = new Cut({
      barberId: req.userId,
      clientId,
      clientName,
      clientLastName,
      amount,
      paymentMethod,
      observations,
    })

    await newCut.save()

    res.status(201).json(newCut)
  } catch (err) {
    res.status(500).json({ message: "Error al crear corte", error: err.message })
  }
})

export default router
