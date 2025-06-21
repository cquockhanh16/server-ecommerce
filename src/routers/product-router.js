const express = require("express");
const multer = require("multer");
const router = express.Router();
const { storage } = require("../configs/upload-config");
const upload = multer({ storage: storage });
const ProductController = require("../controllers/product-controller");
const { MAX_NUMBER_IMAGE_PRODUCT } = require("../configs/const-config");

router.post(
  "/product/create",
  upload.array("images", MAX_NUMBER_IMAGE_PRODUCT),
  ProductController.createProduct
);

router.patch(
  "/product/update/:id",
  upload.array("images", MAX_NUMBER_IMAGE_PRODUCT),
  ProductController.updateProduct
);

router.delete("/product/delete/:id", ProductController.deleteProduct);

router.post("/product/list", ProductController.getListProduct);

router.post("/product/find", ProductController.findProductByName);

router.get("/product/detail/:id", ProductController.getDetailProduct);

router.get("/product/category/:id", ProductController.getProductsByCategory)

module.exports = router;
