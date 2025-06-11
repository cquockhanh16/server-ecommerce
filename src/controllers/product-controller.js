const ProductService = require("../services/product-service");

class ProductController {
  static createProduct = async (req, res, next) => {
    try {
      const { body, files } = req;
      console.log(files, body);
      const newProduct = await ProductService.createProduct(body, files);
      return res.status(201).json({
        sts: true,
        data: newProduct,
        err: null,
        message: "Tạo sản phẩm thành công",
      });
    } catch (error) {
      next(error);
    }
  };
  static getListProduct = async (req, res, next) => {
    try {
      const { body, query } = req;
      const data = await ProductService.getListProduct(query, body);
      return res.status(200).json({
        sts: true,
        data,
        err: null,
        message: "Lấy danh sách sản phẩm thành công",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ProductController;
