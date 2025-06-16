const express = require("express");
const { MomoIPNHandler } = require("../controllers/payment-controller");
const router = express.Router();

router.post("/momo/ipn", MomoIPNHandler);

module.exports = router;
