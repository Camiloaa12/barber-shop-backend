import User from "../models/User.js"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
  try {
    const { name, lastName, email, password, role } = req.body

    if (!name || !lastName || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son requeridos" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "El email ya existe" })
    }

    const newUser = new User({
      name,
      lastName,
      email,
      password,
      role: role || "barbero",
    })

    await newUser.save()

    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
      },
    })
  } catch (err) {
    res.status(500).json({ message: "Error al registrar", error: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña requeridos" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales inválidas" })
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    res.status(500).json({ message: "Error al iniciar sesión", error: err.message })
  }
}
