const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middlewares/authenticate");

const CommentController = require("../controllers/comment-controller");

router.post(
  "/comment/create",
  authenticateJWT,
  CommentController.commentProductAfterOrder
);

module.exports = router;
