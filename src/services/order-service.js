const { randomUUID } = require("crypto");
const Order = require("../models/order-model");
const Product = require("../models/product-model");
const Identity = require("../models/identity-model");
const {
  isValidEmail,
  isValidString,
  isValidArray,
  isValidStringToArray,
  isValidNumber,
} = require("../utils/validator");
const { ValidatorError, HttpError } = require("../models/error-model");
const { createPaymentUrl } = require("./payment-service");
const ModelService = require("./model-service");
const { DATA_PAGE, LIMIT_DATA_PAGE, PAYMENT_STATUS, ORDER_STATUS } = require("../configs/const-config");
const { default: mongoose } = require("mongoose");
class OrderService {
  static createOrder = (body) => {
    return new Promise(async (res, rej) => {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const {
          fullname,
          email,
          phoneNumber,
          address,
          userId,
          products,
          discountValue,
          description,
          paymentMethod,
        } = body;
        const objOrder = new Order();
        const existUser = await Identity.findById(userId);
        if (existUser) {
          objOrder.userId = userId;
        }
        if (!isValidString(fullname)) {
          throw new ValidatorError(
            "Họ và tên không được để trống",
            "fullname",
            fullname
          );
        }
        if (!isValidEmail(email)) {
          throw new ValidatorError(
            "Email không đúng định dạng",
            "email",
            email
          );
        }
        if (!isValidString(phoneNumber)) {
          throw new ValidatorError(
            "Số điện thoại không được để trống",
            "phoneNumber",
            phoneNumber
          );
        }
        if (!isValidString(address)) {
          throw new ValidatorError(
            "Địa chỉ không được để trống",
            "address",
            address
          );
        }
        if (!isValidString(paymentMethod)) {
          throw new ValidatorError(
            "Phương thức thanh toán không được để trống",
            "paymentMethod",
            paymentMethod
          );
        }
        if (!products) {
          throw new ValidatorError(
            "Sản phẩm đặt hàng không hợp lệ",
            "products",
            products
          );
        }
        if (isValidArray(products)) {
          objOrder.products = products;
        } else if (isValidStringToArray(products)) {
          objOrder.products = JSON.parse(products);
        } else {
          throw new ValidatorError(
            "Sản phẩm đặt hàng không hợp lệ",
            "products",
            products
          );
        }
        let totalAmount = 0;
        for (let index = 0; index < products?.length; index++) {
          const existProduct = await Product.findById(products[index]?._id);
          if (
            products[index]?.productQuantity > existProduct?.productQuantity &&
            existProduct
          ) {
            throw new ValidatorError(
              `${existProduct?.productName} không đủ số lượng`,
              "productQuantity",
              existProduct?.productQuantity
            );
          }
          existProduct.productQuantity -= products[index]?.productQuantity;
          existProduct.soldAmount += products[index]?.productQuantity;
          totalAmount +=
            products[index]?.productQuantity * products[index]?.productPrice;
          await existProduct.save();
        }
        objOrder.fullname = fullname;
        objOrder.email = email;
        objOrder.phoneNumber = phoneNumber;
        objOrder.address = address;
        if (isValidNumber(discountValue)) {
          objOrder.discountValue = discountValue;
          totalAmount *= (100 - +discountValue) / 100;
        }
        description ? (objOrder.description = description) : "";
        objOrder.paymentMethod = paymentMethod;
        objOrder.orderId = `ORDER_${randomUUID()}`;
        const nOrder = await objOrder.save();
        await session.commitTransaction();
        if (objOrder.paymentMethod === "BANK") {
          const urlPayment = await createPaymentUrl({
            orderIdd: objOrder.orderId,
            amountt: totalAmount,
          });
          res({ ...objOrder._doc, urlPayment });
        } else {
          
          res(nOrder);
        }
      } catch (error) {
        await session.abortTransaction();
        rej(error);
      }finally {
        session.endSession();
      }
    });
  };

  static updateOrder = (id, body) => {
    return new Promise(async (res, rej) => {
      try {
        const { status, paymentStatus } = body;
        const objUpdate = {};
        if (status) {
          if (!ORDER_STATUS.includes(status)) {
            throw new ValidatorError(
              "Trạng thái đơn hàng không hợp lệ",
              "status",
              status
            );
          }
          objUpdate.status = status;
        }
        if (paymentStatus) {
          if (!PAYMENT_STATUS.includes(paymentStatus)) {
            throw new ValidatorError(
              "Trạng thái thành toán đơn hàng không hợp lệ",
              "paymentStatus",
              paymentStatus
            );
          }
          objUpdate.paymentStatus = paymentStatus;
        }
        const existOrder = Order.findByIdAndUpdate(
          id,
          { $set: objUpdate },
          { new: true }
        );
        res(existOrder);
      } catch (error) {
        rej(error);
      }
    });
  };

  static getOrderOfUser = (user) => {
    return new Promise(async (res, rej) => {
      try {
        const existUser = await Identity.findById(user?.id);
        if (!existUser) {
          throw new HttpError("Người dùng không tồn tại", 404);
        }
        const orderList = await Order.find({ userId: user.id });
        res(orderList);
      } catch (error) {
        rej(error);
      }
    });
  };

  static getListOrder = (query = {}) => {
    return new Promise(async (res, rej) => {
      try {
        const { page, limit } = query;
        const pageCurrent = +page || DATA_PAGE;
        const limitCurrent = +limit || LIMIT_DATA_PAGE;
        const [count, data] = await Promise.all([
          ModelService.countDocumentOfModel(Order),
          ModelService.getListOfModel(
            Order,
            {},
            {},
            {
              page: pageCurrent,
              limit: limitCurrent,
            }
          ),
        ]);
        count > 0
          ? res({
              data: data,
              current_page: pageCurrent,
              total_page: Math.ceil(count / limitCurrent),
              total_data: count,
              limit_per_page: limitCurrent,
            })
          : res({
              data: [],
              current_page: 1,
              total_page: 0,
              total_data: 0,
              limit_per_page: limitCurrent,
            });
      } catch (error) {
        rej(error);
      }
    });
  };

  static handleFailedOrders = () => {
    return new Promise(async (res, rej) => {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const failedOrders = await Order.find({
          status: { $in: ["cancelled"] },
          paymentStatus: { $in: ["error"] },
          isInventoryRestored: false,
        });
        for (const order of failedOrders) {
          // Hoàn lại số lượng sản phẩm
          for (const item of order.products) {
            const existProduct = await Product.findById(item._id);
            if (existProduct) {
              existProduct.productQuantity += item.productQuantity;
              existProduct.soldAmount -= item.soldAmount;
              await existProduct.save();
            }
          }

          // Đánh dấu đã xử lý
          order.isInventoryRestored = true;
          await order.save();
        }
        await session.commitTransaction();
        res("Đã xử lý các đơn hàng thất bại và hoàn lại sản phẩm");
      } catch (error) {
        await session.abortTransaction();
        rej(error);
      } finally {
        session.endSession();
      }
    });
  };
}

module.exports = OrderService;
