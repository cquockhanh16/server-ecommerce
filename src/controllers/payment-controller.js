const crypto = require("crypto");

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
      console.log(req.body);

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

      // 2. Xử lý theo resultCode
      if (resultCode === 0) {
        // Thanh toán thành công
        // TODO: Cập nhật database, gửi email xác nhận,...
        console.log(
          `Payment successful for order ${orderId}, amount ${amount}`
        );
        // 3. Trả response cho Momo (bắt bộc)
        return res.status(200).json({
          RspCode: 0,
          Message: "Confirm Success",
        });
      } else {
        // Thanh toán thất bại
        console.log(`Payment failed for order ${orderId}: ${message}`);
        // TODO: Cập nhật trạng thái đơn hàng

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
