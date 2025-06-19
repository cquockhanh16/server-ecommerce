const Comment = require("../models/comment-model");
const { HttpError, ValidatorError } = require("../models/error-model");
const Identity = require("../models/identity-model");
const Order = require("../models/order-model");
const { isValidString } = require("../utils/validator");

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
                    if (element.products.some(p => p._id.toString() === productId)) {
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
                        "Mã sản phẩm không được để trống", "productId", productId)
                }
                const objComment = new Comment({
                  productId: productId,
                  commenterName: existUser.firstName + " " + existUser.lastName,
                  content: content,
                });
                const newComment = await objComment.save();
                res(newComment);
            } catch (error) {
                rej(error);
            }
        });
    }
}

module.exports = CommentService;