const AuthService = require("../services/auth-service");

class AuthController {
  static register = async (req, res, next) => {
    try {
      const { body } = req;
      const nIden = await AuthService.register(body);
      res.status(201).json({
        sts: true,
        data: nIden,
        err: null,
        message: "Tạo tài khoản thành công",
      });
    } catch (error) {
      next(error);
    }
  };

  static login = async (req, res, next) => {
    try {
      const { body } = req;
      const iden = await AuthService.login(body);
      res.status(201).json({
        sts: true,
        data: iden,
        err: null,
        message: "Đăng nhập thành công",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AuthController;
