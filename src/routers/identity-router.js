const express = require("express");
const IdentityController = require("../controllers/identity-controller");
const { authenticateJWT } = require("../middlewares/authenticate");
const multer = require("multer");
const router = express.Router();
const { storage } = require("../configs/upload-config");
const upload = multer({ storage: storage });

router.patch(
  "/user/update",
  authenticateJWT,
  upload.single("avatar"),
  IdentityController.updateIdentity
);

// router.get(
//   "/user/detail",
//   authenticateJWT,
//   IdentityController.getDetailIdentity
// );

router.get(
  "/user/list",
  IdentityController.getListIdentity
);

router.post(
  "/user/lock/:id",
  IdentityController.lockIdentity
);

// router.post(
//   "/user/change-password",
//   authenticateJWT,
//   IdentityController.changePassword
// );

module.exports = router;
