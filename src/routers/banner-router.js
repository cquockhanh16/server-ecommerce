const multer = require("multer");
const express = require("express");
const router = express.Router();
const { storage } = require("../configs/upload-config");
const upload = multer({ storage: storage });
const BannerController = require("../controllers/banner-controller");

router.post(
  "/banner/create",
  upload.single("banner"),
  BannerController.createBanner
);

router.patch(
  "/banner/update/:id",
  upload.single("banner"),
  BannerController.updateBanner
);

router.delete("/banner/delete/:id", BannerController.deleteBanner);

router.get("/banner/list", BannerController.getListBanner);

module.exports = router;
