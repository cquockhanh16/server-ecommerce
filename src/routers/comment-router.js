const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middlewares/authenticate");

const CommentController = require("../controllers/comment-controller");

router.post(
  "/comment/create",
  authenticateJWT,
  CommentController.commentProductAfterOrder
);

router.get(
  "/comment/list", CommentController.getListComment
);

router.delete(
  "/comment/delete/:id", CommentController.deleteComment
);

module.exports = router;
