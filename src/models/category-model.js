const mongoose = require("mongoose");
const moment = require("moment");

const categorySchema = mongoose.Schema({
  categoryName: {
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
  categoryRoot: {
    type: String,
  },
});

module.exports = mongoose.model("Category", categorySchema);
