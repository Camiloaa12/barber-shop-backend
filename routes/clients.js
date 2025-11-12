import express from "express"
import Client from "../models/Client.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// Get all clients (búsqueda)
router.get("/", verifyToken, async (req, res) => {
  try {
    const { name, lastName } = req.query
    const query = {}

    if (name) query.name = { $regex: name, $options: "i" }
    if (lastName) query.lastName = { $regex: lastName, $options: "i" }

    const clients = await Client.find(query).limit(20)
    res.json(clients)
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

export default router
