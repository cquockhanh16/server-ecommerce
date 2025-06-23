const express = require("express");
const { authenticateJWT } = require("../middlewares/authenticate");
const OrderController = require("../controllers/order-controller");
const router = express.Router();

router.post("/order/create", OrderController.createOrder);

router.get("/order/list-of-user", authenticateJWT, OrderController.getOrderOfUser);

router.get("/order/list", OrderController.getListOrder);

router.patch("/order/update/:id", OrderController.updateOrder);

module.exports = router;
