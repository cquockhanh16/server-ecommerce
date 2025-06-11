const mongoose = require("mongoose");
const moment = require("moment");

const categorySchema = mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId, // Kiểu ObjectId (giống _id mặc định)
    default: () => new mongoose.Types.ObjectId(), // Tự động sinh giá trị mới
    required: true,
    alias: "_id", // Cho phép truy vấn bằng cả `productId` và `_id`
  },
  categoryCreatedAt: {
    type: Number,
    default: () => moment().valueOf(),
  },
  categoryUpdatedAt: {
    type: Number,
  },
  categoryRoot: {
    type: String,
  },
});

module.exports = mongoose.model("Category", categorySchema);
