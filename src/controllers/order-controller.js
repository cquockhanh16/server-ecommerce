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

  static getOrderOfUser = async (req, res, next) => {
    try {
      const {user} = req;
      const orders = await OrderService.getOrderOfUser(user);
      res.status(200).json({
        sts: true,
        data: orders,
        err: null,
        mes: "Lấy danh sách đơn hàng thành công",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = OrderController;
