import express from "express"
import User from "../models/User.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// Get all barbers
router.get("/", verifyToken, async (req, res) => {
  try {
    const barbers = await User.find({ role: "barbero" }).select("_id name lastName email")
    res.json(barbers)
  } catch (err) {
    res.status(500).json({ message: "Error al obtener barberos", error: err.message })
  }
})

export default router
