const CommentService = require("../services/comment-service");

class CommentController {
    static commentProductAfterOrder = async (req, res, next) => {
        try {
            const {body, user} = req;
            const cmt = await CommentService.commentProductAfterOrder(body, user);
            return res.status(201).json({
                sts: true,
                data: cmt,
                err: null,
                message: "Bình luận sản phẩm thành công"
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = CommentController