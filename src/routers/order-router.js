const express = require("express");
const OrderController = require("../controllers/order-controller");
const router = express.Router();

router.post("/order/create", OrderController.createOrder);

module.exports = router;
