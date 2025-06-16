const IdentityService = require("../services/identity-service");

class IdentityController {
  static updateIdentity = async (req, res, next) => {
    try {
      const { body, user } = req;
      const updatedIden = await IdentityService.updateIdentity(body, user);
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
}

module.exports = IdentityController;
