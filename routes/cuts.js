
import express from 'express';
import Cut from '../models/Cut.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Registrar corte
router.post('/', verifyToken, async (req, res) => {
  const cut = new Cut(req.body);
  await cut.save();
  res.json(cut);
});

// Historial de cortes (filtros opcionales)
router.get('/', verifyToken, async (req, res) => {
  const { barber, client, from, to } = req.query;
  const query = {};
  if (barber) query.barber = barber;
  if (client) query.client = client;
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }
  const cuts = await Cut.find(query).sort({ date: -1 });
  res.json(cuts);
});

export default router;
