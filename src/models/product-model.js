const mongoose = require("mongoose");
const moment = require("moment");

const productSchema = mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId, // Kiểu ObjectId (giống _id mặc định)
    default: () => new mongoose.Types.ObjectId(), // Tự động sinh giá trị mới
    required: true,
    alias: "_id", // Cho phép truy vấn bằng cả `productId` và `_id`
  },
  productQuantity: {
    type: Number,
    required: true,
    default: 0,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  soldAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  productSize: {
    type: [],
    default: ["S", "M", "L", "XL", "XXL"],
  },
  productMaterial: {
    type: String,
  },
  productColor: {
    type: [],
    default: ["#FFF", "#000"],
  },
  productImages: {
    type: [],
  },
  productDescription: {
    type: String,
  },
  createdAt: {
    type: Number,
    default: () => moment().valueOf(),
  },
  updatedAt: {
    type: Number,
  },
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collection",
  },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
});

module.exports = mongoose.model("Product", productSchema);
