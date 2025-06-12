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
}

module.exports = CategoryController;
