
import express from 'express';
import Appointment from '../models/Appointment.js';
import { verifyToken } from '../middleware/auth.js';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  const appointment = new Appointment(req.body);
  await appointment.save();
  res.json(appointment);
});

router.get('/', verifyToken, async (req, res) => {
  const appointments = await Appointment.find();
  res.json(appointments);
});

// Actualizar estado de cita
router.put('/:id/status', verifyToken, async (req, res) => {
  const { status } = req.body;
  const appt = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  res.json(appt);
});

// Enviar recordatorio por email (opcional)
router.post('/:id/reminder', verifyToken, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ msg: 'Cita no encontrada' });

    if (!process.env.SMTP_HOST) {
      return res.status(400).json({ msg: 'SMTP no configurado' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const to = req.body.email || process.env.TEST_MAIL_TO;
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || 'softbarber@localhost',
      to,
      subject: `Recordatorio de cita - ${appt.client}`,
      text: `Hola ${appt.client}, recuerda tu cita con ${appt.barber} el ${appt.date} a las ${appt.time}.`,
    });

    res.json({ msg: 'Recordatorio enviado', messageId: info.messageId });
  } catch (err) {
    res.status(500).json({ msg: 'Error enviando correo', error: err.message });
  }
});

export default router;
