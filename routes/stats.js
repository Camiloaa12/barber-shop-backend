import express from 'express';
import Cut from '../models/Cut.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Ganancias diarias: hoy
router.get('/daily', verifyToken, async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const agg = await Cut.aggregate([
    { $match: { date: { $gte: todayStart, $lte: todayEnd } } },
    { $group: { _id: null, total: { $sum: '$price' }, count: { $sum: 1 } } }
  ]);
  const result = agg[0] || { total: 0, count: 0 };
  res.json(result);
});

// Ganancias semanales: últimos 7 días
router.get('/weekly', verifyToken, async (req, res) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  const agg = await Cut.aggregate([
    { $match: { date: { $gte: start, $lte: end } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, total: { $sum: '$price' }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  res.json(agg);
});

// Ganancias mensuales: por mes corriente
router.get('/monthly', verifyToken, async (req, res) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const agg = await Cut.aggregate([
    { $match: { date: { $gte: start, $lte: end } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, total: { $sum: '$price' }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  res.json(agg);
});

// Cantidad de cortes por fecha (rango opcional)
router.get('/counts/by-date', verifyToken, async (req, res) => {
  const { from, to } = req.query;
  const match = {};
  if (from || to) {
    match.date = {};
    if (from) match.date.$gte = new Date(from);
    if (to) match.date.$lte = new Date(to);
  }
  const agg = await Cut.aggregate([
    { $match: match },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  res.json(agg);
});

export default router;