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
}

module.exports = CategoryController;
