require("dotenv").config();
const jwt = require("jsonwebtoken");
const { HttpError } = require("../models/error-model");

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const secretKey = process.env.SECRET_KEY_JWT || "secretKey";
    if (authHeader) {
      const token = authHeader.split(" ")[1];

      jwt.verify(token, secretKey, (err, user) => {
        if (err) {
          throw new HttpError("Không đủ thẩm quyền", 403);
        }

        req.user = user;
        next();
      });
    } else {
      throw new HttpError("Phiên làm việc lỗi", 401);
    }
  } catch (error) {
    next(error);
  }
}
