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

    static getListComment = async (req, res, next) => {
        try {
            const {query} = req;
            const comments = await CommentService.getListComment(query);
            return res.status(200).json({
                sts: true,
                data: comments,
                err: null,
                message: "Lấy danh sách bình luận thành công"
            })
        } catch (error) {
            next(error)
        }
    }

    static deleteComment = async (req, res, next) => {
        try {
            const {id} = req.params;
            const deletedComment = await CommentService.deleteComment(id);
            return res.status(200).json({
                sts: true,
                data: deletedComment,
                err: null,
                message: "Xóa bình luận thành công"
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = CommentController