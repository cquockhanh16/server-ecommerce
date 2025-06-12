const Category = require("../models/category-model");
const { ValidatorError } = require("../models/error-model");
const { isValidString } = require("../utils/validator");

class CategoryService {
  static createCategory = (body) => {
    return new Promise(async (res, rej) => {
      try {
        const { categoryName, categoryRoot } = body;
        if (!isValidString(categoryName)) {
          throw new ValidatorError(
            "Tên loại không được để trống",
            "categoryName",
            categoryName
          );
        }
        const objCategory = new Category({
          categoryName: categoryName,
        });
        isValidString(categoryRoot)
          ? (objCategory.categoryRoot = categoryRoot)
          : "";
        const newCategory = await objCategory.save();
        res(newCategory);
      } catch (error) {
        rej(error);
      }
    });
  };
}

module.exports = CategoryService;
