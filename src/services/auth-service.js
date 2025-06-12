const { ValidatorError, HttpError } = require("../models/error-model");
const Identity = require("../models/identity-model");
const { isValidString, isValidEmail } = require("../utils/validator");
require("dotenv").config();
const jwt = require("jsonwebtoken");

function generateTokens(
  payload,
  expiresInAccessToken = "1h",
  expiresInRefreshToken = "30d"
) {
  const secretKey = process.env.SECRET_KEY_JWT || "secretKey";
  const refreshSecretKey = process.env.REFRESH_SECRET_KEY_JWT || "resecretKey";
  const accessToken = jwt.sign(payload, secretKey, {
    expiresIn: expiresInAccessToken,
  });
  const refreshToken = jwt.sign(payload, refreshSecretKey, {
    expiresIn: expiresInRefreshToken,
  });
  return { accessToken, refreshToken };
}

class AuthService {
  static register = (body) => {
    return new Promise(async (res, rej) => {
      try {
        const { firstName, lastName, email, password, phoneNumber } = body;

        if (!isValidString(email)) {
          throw new ValidatorError("Email không được để trống");
        }
        if (!isValidEmail(email)) {
          throw new ValidatorError("Email không đúng định dạng");
        }
        const existIdentity = await Identity.findOne({ email });
        if (existIdentity) {
          throw new HttpError("Email đã được đăng ký", 400);
        }
        if (!isValidString(password)) {
          throw new ValidatorError(
            "Mật khẩu không được để trống",
            "password",
            password
          );
        }
        const objIdentity = new Identity({ email: email, password: password });
        isValidString(firstName) ? (objIdentity.firstName = firstName) : "";
        isValidString(lastName) ? (objIdentity.lastName = lastName) : "";
        isValidString(phoneNumber)
          ? (objIdentity.phoneNumber = phoneNumber)
          : "";
        const newIden = await objIdentity.save();
        res(newIden);
      } catch (error) {
        rej(error);
      }
    });
  };

  static login = (body) => {
    return new Promise(async (res, rej) => {
      try {
        const { email, password } = body;

        if (!isValidString(email)) {
          throw new ValidatorError("Email không được để trống");
        }
        if (!isValidEmail(email)) {
          throw new ValidatorError("Email không đúng định dạng");
        }
        const existIdentity = await Identity.findOne({ email });
        if (!existIdentity) {
          throw new HttpError("Tài khoản không tồn tại", 404);
        }
        if (!isValidString(password)) {
          throw new ValidatorError(
            "Mật khẩu không được để trống",
            "password",
            password
          );
        }
        const isMatch = await existIdentity.comparePassword(password);
        if (!isMatch) {
          throw new ValidatorError("Mật khẩu không đúng", "password", password);
        }
        const token = generateTokens(
          { id: existIdentity._id, role: existIdentity.role },
          "1h",
          "30d"
        );
        const result = await Identity.findOneAndUpdate(
          { _id: existIdentity._id },
          { $set: { status: "on" } },
          {
            new: true,
            runValidators: true,
          }
        );
        res({
          data: result,
          token: token,
        });
      } catch (error) {
        rej(error);
      }
    });
  };
}

module.exports = AuthService;
