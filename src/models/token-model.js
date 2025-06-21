const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  refreshToken: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  revoked: { type: Boolean, default: false },
  ipAddress: { type: String },
  userAgent: { type: String },
});

module.exports = mongoose.model("RefreshToken", tokenSchema);
