const mongoose = require("mongoose");
const moment = require("moment");

const productSchema = mongoose.Schema({
  productName: {
    type: String,
    required: true,
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
