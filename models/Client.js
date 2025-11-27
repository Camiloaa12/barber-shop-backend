import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  barber: { type: String }, // nombre del barbero o id si se decide más tarde
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Client', clientSchema);