const IdentityService = require("../services/identity-service");

class IdentityController {
  static updateIdentity = async (req, res, next) => {
    try {
      const { body, user, file } = req;
      const updatedIden = await IdentityService.updateIdentity(body, user, file);
      res.status(200).json({
        sts: true,
        data: updatedIden,
        err: null,
        mes: "Cập nhật thông tin thành công",
      });
    } catch (error) {
      next(error);
    }
  };

  static getListIdentity = async (req, res, next) => {
    try {
      // const { user } = req;
      const identity = await IdentityService.getListIdentity();
      res.status(200).json({
        sts: true,
        data: identity,
        err: null,
        mes: "Lấy danh sách người dùng thành công",
      });
    } catch (error) {
      next(error);
    }
  };

  static lockIdentity = async (req, res, next) => {
    try {
      const { id } = req.params;
      const {body} = req;
      const identity = await IdentityService.lockIdentity(id, body);
      res.status(200).json({
        sts: true,
        data: identity,
        err: null,
        mes: "Khóa người dùng thành công",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = IdentityController;
