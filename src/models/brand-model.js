const mongoose = require("mongoose");
const moment = require("moment");

const brandSchema = mongoose.Schema({
  brandName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    default: () => moment().valueOf(),
  },
  updatedAt: {
    type: Number,
  },
  foundedDate: {
    type: Number,
  },
  founderName: {
    type: String,
  },
});

module.exports = mongoose.model("Brand", brandSchema);
