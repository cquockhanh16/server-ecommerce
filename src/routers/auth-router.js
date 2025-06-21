const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth-controller");
const { authenticateJWT } = require("../middlewares/authenticate");

router.post("/auth/register", AuthController.register);

router.post("/auth/login", AuthController.login);

router.post("/auth/logout", authenticateJWT, AuthController.logout);

module.exports = router;
