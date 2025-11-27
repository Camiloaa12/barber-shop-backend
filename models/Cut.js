
import mongoose from 'mongoose';

const cutSchema = new mongoose.Schema({
  client: { type: String, required: true },
  price: { type: Number, required: true },
  payment: { type: String, enum: ['efectivo', 'transferencia'], required: true },
  description: { type: String },
  barber: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Cut', cutSchema);
