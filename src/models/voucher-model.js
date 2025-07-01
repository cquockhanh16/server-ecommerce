const mongoose = require("mongoose");
const moment = require("moment");

const voucherSchema = mongoose.Schema({
  voucherName: {
    type: String,
    required: true,
  },
  voucherDiscount: {
    type: Number,
    required: true,
    default: 0,
  },
  expiryDate: {
    type: Number, // Hoặc Date
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  usageLimit: {
    type: Number,
    default: null, // null = không giới hạn
  },
  createdAt: {
    type: Number,
    default: () => moment().valueOf(),
  },
  updatedAt: {
    type: Number,
  },
});

module.exports = mongoose.model("Voucher", voucherSchema);