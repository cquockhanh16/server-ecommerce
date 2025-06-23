const mongoose = require("mongoose");
const moment = require("moment");

const commentSchema = mongoose.Schema({
  content: {
    type: String,
  },
  createdAt: {
    type: Number,
    default: () => moment().valueOf(),
  },
  productId: {
    type: String,
    required: true,
  },
  commenter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Identity",
  },
  updatedAt: {
    type: Number,
  },
});

module.exports = mongoose.model("Comment", commentSchema);