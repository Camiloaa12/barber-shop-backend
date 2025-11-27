import express from 'express';
import Client from '../models/Client.js';
import Cut from '../models/Cut.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Registrar cliente
router.post('/', verifyToken, async (req, res) => {
  const client = new Client(req.body);
  await client.save();
  res.json(client);
});

// Listar clientes
router.get('/', verifyToken, async (req, res) => {
  const clients = await Client.find();
  res.json(clients);
});

// Clientes frecuentes (top por barber)
router.get('/frecuentes', verifyToken, async (req, res) => {
  const { barber } = req.query; // opcional filtrar por barbero
  const match = barber ? { barber } : {};
  const agg = await Cut.aggregate([
    { $match: match },
    { $group: { _id: '$client', totalCortes: { $sum: 1 }, totalGastado: { $sum: '$price' } } },
    { $sort: { totalCortes: -1 } },
    { $limit: 20 }
  ]);
  res.json(agg.map(c => ({ client: c._id, totalCortes: c.totalCortes, totalGastado: c.totalGastado })));
});

export default router;