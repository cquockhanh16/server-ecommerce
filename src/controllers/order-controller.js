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

  static updateOrder = async (req, res, next) => {
    try {
      const { body, params } = req;
      const updatedOrder = await OrderService.updateOrder(params.id, body);
      res.status(200).json({
        sts: true,
        data: updatedOrder,
        err: null,
        mes: "Cập nhật đơn hàng thành công",
      });
    } catch (error) {
      next(error);
    }
  };

  static getOrderOfUser = async (req, res, next) => {
    try {
      const { user } = req;
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

  static cancelOrderByUser = async (req, res, next) => {
    try {
      const { user } = req;
      const { id } = req.params;
      const order = await OrderService.cancelOrderByUser(id, user);
      res.status(200).json({
        sts: true,
        data: order,
        err: null,
        mes: "Hủy đơn hàng thành công",
      });
    } catch (error) {
      next(error);
    }
  };

  static getListOrder = async (req, res, next) => {
    try {
      const { query } = req;
      const orders = await OrderService.getListOrder(query);
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
