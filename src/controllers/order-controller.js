const OrderService = require("../services/order-service");

class OrderController {
  static createOrder = async (req, res, next) => {
    try {
      const { body } = req;
      const nOrder = await OrderService.createOrder(body);
      res.status(201).json({
        sts: true,
        data: nOrder,
        err: null,
        mes: "Đặt hàng thành công",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = OrderController;
