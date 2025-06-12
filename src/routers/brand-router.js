const express = require("express");
const router = express.Router();

const BrandController = require("../controllers/brand-controller");

router.post("/brand/create", BrandController.createBrand);

// router.post("/Brand/list", BrandController.Brand);

module.exports = router;
