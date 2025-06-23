const mongoose = require("mongoose");
const moment = require("moment");
const { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } = require("../configs/const-config");

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
    enum: ORDER_STATUS,
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: PAYMENT_METHOD,
    default: "COD",
  },
  description: String,
  paymentStatus: {
    type: String,
    enum: PAYMENT_STATUS,
    default: "unpaid",
  },
  isInventoryRestored: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Number,
    default: () => moment().valueOf(),
  },
  updatedAt: {
    type: Number,
  },
});

module.exports = mongoose.model("Order", orderSchema);
