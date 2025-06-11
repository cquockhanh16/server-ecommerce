const mongoose = require("mongoose");
const moment = require("moment");

const collectionSchema = mongoose.Schema({
  collectionName: {
    type: String,
    required: true,
  },
  collectionId: {
    type: mongoose.Schema.Types.ObjectId, // Kiểu ObjectId (giống _id mặc định)
    default: () => new mongoose.Types.ObjectId(), // Tự động sinh giá trị mới
    required: true,
    alias: "_id", // Cho phép truy vấn bằng cả `productId` và `_id`
  },
  collectionCreatedAt: {
    type: Number,
    default: () => moment().valueOf(),
  },
  collectionUpdatedAt: {
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
