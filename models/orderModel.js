import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  cartItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, default: 1 },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  userDetails: {
    name: { type: String, required: true },
    email: { type: String, required: false },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Completed", "Delivered"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", orderSchema);
