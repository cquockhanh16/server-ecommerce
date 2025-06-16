const crypto = require("crypto");
const Order = require("../models/order-model");
require("dotenv").config();

class PaymentController {
  static MomoIPNHandler = async (req, res, next) => {
    try {
      const {
        partnerCode,
        orderId,
        requestId,
        amount,
        orderInfo,
        orderType,
        transId,
        resultCode,
        message,
        payType,
        signature,
        // ... các tham số khác từ Momo
      } = req.body;

      // 1. Kiểm tra chữ ký (signature) để đảm bảo request hợp lệ từ Momo
      const rawSignature =
        `accessKey=${process.env.MOMO_ACCESSKEY}` +
        `&amount=${amount}` +
        `&extraData=` +
        (req.body.extraData || "") + // Đảm bảo extraData có giá trị hoặc chuỗi rỗng
        `&message=${message}` +
        `&orderId=${orderId}` +
        `&orderInfo=${orderInfo}` +
        `&orderType=${orderType}` +
        `&partnerCode=${partnerCode}` +
        `&payType=${payType}` +
        `&requestId=${requestId}` +
        `&responseTime=${req.body.responseTime}` + // Dùng responseTime từ Momo, không tự tạo
        `&resultCode=${resultCode}` +
        `&transId=${transId}`;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.MOMO_SERCETKEY)
        .update(rawSignature)
        .digest("hex");

      if (signature !== expectedSignature) {
        console.error("Invalid signature from Momo");
        return res
          .status(403)
          .json({ RspCode: 403, Message: "Invalid signature" });
      }
      const startIndex = orderId.indexOf("-") + 1; // Tìm vị trí của dấu "-" đầu tiên và lấy phần sau nó
      const orderIdd = orderId.substring(startIndex);
      const updatedOrder = await Order.findOne({ orderId: orderIdd });

      // 2. Xử lý theo resultCode
      if (resultCode === 0) {
        if (updatedOrder) {
          updatedOrder.paymentStatus = "paid";
          await updatedOrder.save();
        }
        return res.status(200).json({
          RspCode: 0,
          Message: "Confirm Success",
        });
      } else {
        if (updatedOrder) {
          updatedOrder.paymentStatus = "error";
          await updatedOrder.save();
        }
        return res.status(200).json({
          RspCode: 0,
          Message: "Confirm Success",
        });
      }
    } catch (error) {
      next(error);
    }
  };
}

module.exports = PaymentController;
