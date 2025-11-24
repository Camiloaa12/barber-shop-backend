import express from "express"
import User from "../models/User.js"
import { verifyToken, requireRole } from "../middleware/auth.js"
import bcrypt from "bcryptjs"

const router = express.Router()

// Get all barbers (Admin sees all, others might see active only if needed, but for now Admin manages them)
router.get("/", verifyToken, async (req, res) => {
  try {
    const { includeInactive } = req.query
    const query = { role: "barbero" }

    if (includeInactive !== "true") {
      query.isActive = true
    }

    const barbers = await User.find(query).select("-password")
    res.json(barbers)
  } catch (err) {
    res.status(500).json({ message: "Error al obtener barberos", error: err.message })
  }
})

// Create Barber (Admin only)
router.post("/", verifyToken, requireRole(["admin"]), async (req, res) => {
  try {
    const { name, lastName, email, password } = req.body

    if (!name || !lastName || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son requeridos" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "El email ya existe" })
    }

    const newBarber = new User({
      name,
      lastName,
      email,
      password,
      role: "barbero",
      isActive: true
    })

    await newBarber.save()

    res.status(201).json({
      message: "Barbero creado exitosamente",
      barber: {
        _id: newBarber._id,
        name: newBarber.name,
        lastName: newBarber.lastName,
        email: newBarber.email,
        isActive: newBarber.isActive
      }
    })
  } catch (err) {
    res.status(500).json({ message: "Error al crear barbero", error: err.message })
  }
})

// Update Barber (Admin only)
router.put("/:id", verifyToken, requireRole(["admin"]), async (req, res) => {
  try {
    const { name, lastName, email, password, isActive } = req.body
    const barberId = req.params.id

    const barber = await User.findById(barberId)
    if (!barber) {
      return res.status(404).json({ message: "Barbero no encontrado" })
    }

    if (name) barber.name = name
    if (lastName) barber.lastName = lastName
    if (email) barber.email = email
    if (typeof isActive === 'boolean') barber.isActive = isActive
    if (password) {
      // Password hashing is handled by pre-save hook in User model
      barber.password = password
    }

    await barber.save()

    res.json({
      message: "Barbero actualizado",
      barber: {
        _id: barber._id,
        name: barber.name,
        lastName: barber.lastName,
        email: barber.email,
        isActive: barber.isActive
      }
    })
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar barbero", error: err.message })
  }
})

// Soft Delete Barber (Admin only)
router.delete("/:id", verifyToken, requireRole(["admin"]), async (req, res) => {
  try {
    const barberId = req.params.id
    const barber = await User.findById(barberId)

    if (!barber) {
      return res.status(404).json({ message: "Barbero no encontrado" })
    }

    barber.isActive = false
    await barber.save()

    res.json({ message: "Barbero desactivado exitosamente" })
  } catch (err) {
    res.status(500).json({ message: "Error al desactivar barbero", error: err.message })
  }
})

export default router
