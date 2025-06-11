const mongoose = require("mongoose");
const moment = require("moment");

const brandSchema = mongoose.Schema({
  brandName: {
    type: String,
    required: true,
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId, // Kiểu ObjectId (giống _id mặc định)
    default: () => new mongoose.Types.ObjectId(), // Tự động sinh giá trị mới
    required: true,
    alias: "_id", // Cho phép truy vấn bằng cả `productId` và `_id`
  },
  brandCreatedAt: {
    type: Number,
    default: () => moment().valueOf(),
  },
  brandUpdatedAt: {
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
