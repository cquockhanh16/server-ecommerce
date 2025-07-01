const mongoose = require("mongoose");
const moment = require("moment");
const bcrypt = require("bcrypt");

const identitySchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  phoneNumber: String,
  address: [],
  avatar: {
    type: String
  },

  createdAt: {
    type: Number,
    default: () => moment().valueOf(),
  },
  updatedAt: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["off", "on", "lock"],
  },
  orderCount: {
    type: Number,
    default: 0,
  },
  lastPasswordChange: [],
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

identitySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10); // Số vòng lặp salt (10 là phổ biến)
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

identitySchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Identity", identitySchema);
