const mongoose = require("mongoose");
const moment = require("moment");

const bannerSchema = mongoose.Schema({
  bannerTitle: {
    type: String,
  },
  bannerImage: {
    type: String,
    required: true,
  },
  bannerDescription: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Number,
    default: () => moment().valueOf(),
  },
  updatedAt: {
    type: Number,
  },
});

module.exports = mongoose.model("Banner", bannerSchema);