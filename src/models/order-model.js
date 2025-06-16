const mongoose = require("mongoose");
const moment = require("moment");

const orderSchema = mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Identity",
  },
  products: [],
  discountValue: Number,
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipping", "completed", "cancelled"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "BANK"],
    default: "COD",
  },
  description: String,
  createdAt: {
    type: Number,
    default: () => moment().valueOf(),
  },
  updatedAt: {
    type: Number,
  },
});

module.exports = mongoose.model("Order", orderSchema);
