
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ msg: 'Datos incompletos' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'Email ya registrado' });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashed, role: 'barbero' });
    await user.save();

    res.json({ msg: 'Barbero registrado' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Email ya registrado' });
    }
    console.error('Error en registro:', err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Usuario inexistente' });
    if (!user.active) return res.status(403).json({ msg: 'Usuario bloqueado' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ msg: 'Credenciales incorrectas' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, role: user.role });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

export default router;
