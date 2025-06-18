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
class OrderService {
  static createOrder = (body) => {
    return new Promise(async (res, rej) => {
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
        rej(error);
      }
    });
  };

  static getOrderOfUser = (user) => {
    return new Promise(async (res, rej) => {
      try{
        const existUser = await Identity.findById(user?.id);
        if (!existUser) {
          throw new HttpError("Người dùng không tồn tại", 404);
        }
        const orderList = await Order.find({userId: user.id});
        res(orderList);
      }catch(error){
        rej(error)
      }
    })
  }
}

module.exports = OrderService;
