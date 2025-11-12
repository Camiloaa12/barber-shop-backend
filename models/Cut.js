import mongoose from "mongoose"

const cutSchema = new mongoose.Schema({
  barberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    sparse: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  clientLastName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["efectivo", "transferencia", "tarjeta", "otro"],
    required: true,
  },
  observations: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Cut", cutSchema)
