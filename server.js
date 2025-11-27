import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import cutRoutes from './routes/cuts.js';
import appointmentRoutes from './routes/appointments.js';
import clientRoutes from './routes/clients.js';
import statsRoutes from './routes/stats.js';

dotenv.config();
const app = express();

// ✅ CORS TOTAL PARA PRODUCCIÓN (SIN BLOQUEOS)
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());

// ✅ JSON
app.use(express.json());

// ✅ CONEXIÓN A MONGO
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB conectado");

    // ✅ CREACIÓN AUTOMÁTICA DEL SUPERADMIN
    const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME } = process.env;
    if (ADMIN_EMAIL && ADMIN_PASSWORD) {
      const adminExists = await User.findOne({ role: 'admin' });
      if (!adminExists) {
        const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
        await new User({
          username: ADMIN_USERNAME || 'superadmin',
          email: ADMIN_EMAIL,
          password: hashed,
          role: 'admin',
          active: true,
        }).save();
        console.log('✅ Superadmin creado:', ADMIN_EMAIL);
      }
    } else {
      console.warn('⚠️ ADMIN_* no configurado.');
    }
  })
  .catch(err => console.error("❌ Error Mongo:", err));

// ✅ RUTAS
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cuts', cutRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/stats', statsRoutes);

// ✅ HEALTH CHECKS
app.get('/', (req, res) => res.send('SoftBarber API OK'));
app.get('/api/health', (req, res) => {
  res.json({ status: "OK", message: "Backend funcionando correctamente" });
});

// ✅ PUERTO CORRECTO PARA RENDER
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Servidor activo en puerto ${PORT}`));
