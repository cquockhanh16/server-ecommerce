const CategoryService = require("../services/category-service");

class CategoryController {
  static createCategory = async (req, res, next) => {
    try {
      const body = req.body;
      const data = await CategoryService.createCategory(body);
      return res.status(201).json({
        sts: true,
        data: data,
        err: null,
        message: "Tạo loại thành công",
      });
    } catch (error) {
      next(error);
    }
  };

  static getListCategoryOfNavbar = async (req, res, next) => {
    try {
      const data = await CategoryService.getListCategoryOfNavbar();
      return res.status(200).json({
        sts: true,
        data: data,
        err: null,
        message: "Lấy danh sách danh mục của navbar",
      });
    } catch (error) {
      next(error);
    }
  };

  static getListCategory = async (req, res, next) => {
    try {
      const { query } = req;
      const data = await CategoryService.getListCategory(query);
      return res.status(200).json({
        sts: true,
        data: data,
        err: null,
        message: "Lấy danh sách loại thành công",
      });
    } catch (error) {
      next(error);
    }
  };

  static updateCategory = async (req, res, next) => {
    try {
      const { body } = req;
      const { id } = req.params;
      const data = await CategoryService.updateCategory(id, body);
      return res.status(200).json({
        sts: true,
        data: data,
        err: null,
        message: "Cập nhật loại thành công",
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteCategory = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await CategoryService.deleteCategory(id);
      return res.status(200).json({
        sts: true,
        data: data,
        err: null,
        message: "Xóa loại thành công",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = CategoryController;
