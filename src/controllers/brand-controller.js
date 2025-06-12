const BrandService = require("../services/brand-service");

class BrandController {
  static createBrand = async (req, res, next) => {
    try {
      const body = req.body;
      const data = await BrandService.createBrand(body);
      return res.status(201).json({
        sts: true,
        data: data,
        err: null,
        message: "Tạo thương hiệu thành công",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = BrandController;
