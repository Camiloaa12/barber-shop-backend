
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import cutRoutes from './routes/cuts.js';
import appointmentRoutes from './routes/appointments.js';
import clientRoutes from './routes/clients.js';
import statsRoutes from './routes/stats.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors({ origin: ['https://tu-frontend.vercel.app'] }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../softbarber-frontend')));

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB conectado");
    // Superadmin único
    const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME } = process.env;
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.warn('ADMIN_* no configurado; no se creará superadmin.');
    } else {
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
        console.log('Superadmin creado:', ADMIN_EMAIL);
      }
    }
  })
  .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cuts', cutRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/stats', statsRoutes);

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../softbarber-frontend/index.html')));

app.listen(process.env.PORT || 4000, () => console.log(`Servidor activo en puerto ${process.env.PORT || 4000}`));
