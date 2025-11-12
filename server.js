import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
import clientsRoutes from "./routes/clients.js"
import cutsRoutes from "./routes/cuts.js"
import statsRoutes from "./routes/stats.js"
import barbersRoutes from "./routes/barbers.js"
import User from "./models/User.js"

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Helper: ensure default admin
async function ensureDefaultAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@barber.com"
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!"
  const adminName = process.env.ADMIN_NAME || "Admin"
  const adminLastName = process.env.ADMIN_LASTNAME || "User"

  try {
    const existing = await User.findOne({ email: adminEmail })
    if (existing) {
      console.log(`Admin por defecto ya existe: ${adminEmail}`)
      return
    }

    const adminUser = new User({
      name: adminName,
      lastName: adminLastName,
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    })
    await adminUser.save()
    console.log(`Admin por defecto creado: ${adminEmail}`)
  } catch (err) {
    console.log("Error creando admin por defecto:", err.message)
  }
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB conectado")
    await ensureDefaultAdmin()
  })
  .catch((err) => console.log("Error en MongoDB:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/clients", clientsRoutes)
app.use("/api/cuts", cutsRoutes)
app.use("/api/stats", statsRoutes)
app.use("/api/barbers", barbersRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})
