
import express from 'express';
import User from '../models/User.js';
import Cut from '../models/Cut.js';
import Appointment from '../models/Appointment.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', verifyToken, verifyAdmin, async (req, res) => {
  const users = await User.countDocuments();
  const cuts = await Cut.countDocuments();
  const appointments = await Appointment.countDocuments();
  const barberosActivos = await User.countDocuments({ role: 'barbero', active: true });
  const barberosBloqueados = await User.countDocuments({ role: 'barbero', active: false });

  res.json({ users, cuts, appointments, barberosActivos, barberosBloqueados, status: "Sistema activo" });
});

router.get('/barberos', verifyToken, verifyAdmin, async (req, res) => {
  const barberos = await User.find({ role: 'barbero' }).select('username email active role');
  res.json(barberos);
});

router.put('/bloquear/:id', verifyToken, verifyAdmin, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { active: false });
  res.json({ msg: "Barbero bloqueado" });
});

router.put('/activar/:id', verifyToken, verifyAdmin, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { active: true });
  res.json({ msg: "Barbero activado" });
});

export default router;
