const express = require("express");
const IdentityController = require("../controllers/identity-controller");
const { authenticateJWT } = require("../middlewares/authenticate");
const router = express.Router();

router.patch(
  "/user/update",
  authenticateJWT,
  IdentityController.updateIdentity
);

module.exports = router;
