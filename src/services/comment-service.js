
const { DATA_PAGE, LIMIT_DATA_PAGE } = require("../configs/const-config");
const Comment = require("../models/comment-model");
const { HttpError, ValidatorError } = require("../models/error-model");
const Identity = require("../models/identity-model");
const Order = require("../models/order-model");
const { isValidString } = require("../utils/validator");
const ModelService = require("./model-service");

class CommentService {
  static commentProductAfterOrder = (body, user) => {
    return new Promise(async (res, rej) => {
      try {
        const existUser = await Identity.findById(user.id);
        if (!existUser) {
          throw new HttpError("Người dùng không tồn tại", 404);
        }
        const orderSuccess = await Order.find({
          userId: existUser._id,
          status: "completed",
          paymentStatus: "paid",
        });
        let isProductPurchased = false;
        const { productId, content } = body;
        for (let i = 0; i < orderSuccess.length; i++) {
          const element = orderSuccess[i];
          if (element.products.some((p) => p._id.toString() === productId)) {
            isProductPurchased = true;
            break;
          }
        }
        if (!isProductPurchased) {
          throw new HttpError(
            "Bạn chưa mua sản phẩm này, không thể bình luận",
            403
          );
        }
        if (!isValidString(productId)) {
          throw new ValidatorError(
            "Mã sản phẩm không được để trống",
            "productId",
            productId
          );
        }
        const objComment = new Comment({
          productId: productId,
          commenter: user.id,
          content: content,
        });
        const newComment = await objComment.save();
        res(newComment);
      } catch (error) {
        rej(error);
      }
    });
  };

  static getListComment = (query) => {
    return new Promise(async (res, rej) => {
      try {
        const { page, limit } = query;
        const pageCurrent = +page || DATA_PAGE;
        const limitCurrent = +limit || LIMIT_DATA_PAGE;
        const [count, data] = await Promise.all([
          ModelService.countDocumentOfModel(Comment),
          ModelService.getListOfModel(
            Comment,
            {
              createdAt: -1, // Sắp xếp theo ngày tạo mới nhất
            },
            {},
            {
              page: pageCurrent,
              limit: limitCurrent,
            },
            [
              {
                path: "commenter",
                model: "Identity",
                select: "firstName lastName avatar",
              },
            ]
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

  static deleteComment = (id) => {
    return new Promise(async (res, rej) => {
      try {
        const deletedComment = await Comment.findByIdAndDelete(id);
        if (!deletedComment) {
          throw new HttpError("Bình luận không tồn tại", 404);
        }
        res(deletedComment);
      } catch (error) {
        rej(error);
      }
    });
  }
}

module.exports = CommentService;