
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  client: { type: String, required: true },
  barber: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['pendiente', 'confirmada', 'cancelada', 'completada'], default: 'pendiente' }
});

export default mongoose.model('Appointment', appointmentSchema);
