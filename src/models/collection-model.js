const mongoose = require("mongoose");
const moment = require("moment");

const collectionSchema = mongoose.Schema({
  collectionName: {
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
  releasedDate: {
    type: Number,
  },
  creatorName: {
    type: String,
  },
});

module.exports = mongoose.model("Collection", collectionSchema);
