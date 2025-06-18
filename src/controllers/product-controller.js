const ProductService = require("../services/product-service");

class ProductController {
  static createProduct = async (req, res, next) => {
    try {
      const { body, files } = req;
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

  static getDetailProduct = async (req, res, next) => {
    try {
      const { id } = req.params;
      const existP = await ProductService.getDetailProduct(id);
      res.status(200).json({
        sts: true,
        data: existP,
        err: null,
        message: "Lấy thông tin chi tiết thành công",
      });
    } catch (error) {
      next(error);
    }
  };

  static findProductByName = async (req, res, next) => {
    try {
      const { query } = req;
      const { productName } = req.body;
      const data = await ProductService.findProductByName(query, productName);
      res.status(200).json({
        sts: true,
        data: data,
        err: null,
        message: "Tìm sản phẩm thành công",
      });
    } catch (error) {
      next(error);
    }
  };

  static getProductsByCategory = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { query } = req;
      const data = await ProductService.getProductsByCategory(id, query);
      return res.status(200).json({
        sts: true,
        data,
        err: null,
        message: "Lấy danh sách sản phẩm theo danh mục thành công",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ProductController;
