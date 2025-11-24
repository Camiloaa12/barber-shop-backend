import express from "express"
import Client from "../models/Client.js"
import Cut from "../models/Cut.js"
import { verifyToken, requireRole } from "../middleware/auth.js"

const router = express.Router()

// Get all clients (with search and pagination)
router.get("/", verifyToken, async (req, res) => {
  try {
    const { name, lastName, page = 1, limit = 20 } = req.query
    const query = {}

    if (name) query.name = { $regex: name, $options: "i" }
    if (lastName) query.lastName = { $regex: lastName, $options: "i" }

    const clients = await Client.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const count = await Client.countDocuments(query)

    res.json({
      clients,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalClients: count
    })
  } catch (err) {
    res.status(500).json({ message: "Error al obtener clientes", error: err.message })
  }
})

// Create client
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, lastName, email, phone } = req.body

    if (!name || !lastName) {
      return res.status(400).json({ message: "Nombre y apellido requeridos" })
    }

    const newClient = new Client({ name, lastName, email, phone })
    await newClient.save()

    res.status(201).json(newClient)
  } catch (err) {
    res.status(500).json({ message: "Error al crear cliente", error: err.message })
  }
})

// Update client (Admin/Barber)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { name, lastName, email, phone } = req.body
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { name, lastName, email, phone },
      { new: true }
    )

    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" })
    }

    res.json(client)
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar cliente", error: err.message })
  }
})

// Get Client History (Cuts)
router.get("/:id/history", verifyToken, async (req, res) => {
  try {
    const cuts = await Cut.find({ clientId: req.params.id })
      .populate("barberId", "name lastName")
      .sort({ createdAt: -1 })

    res.json(cuts)
  } catch (err) {
    res.status(500).json({ message: "Error al obtener historial", error: err.message })
  }
})

export default router
