const { LIMIT_DATA_PAGE, DATA_PAGE } = require("../configs/const-config");
const Category = require("../models/category-model");
const { ValidatorError } = require("../models/error-model");
const { isValidString } = require("../utils/validator");
const ModelService = require("./model-service");

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

  static getListCategoryOfNavbar = () => {
    return new Promise(async (res, rej) => {
      try {
        const category = await Category.find();
        const rootCategory = [];
        for (let i = 0; i < category.length; i++) {
          const element = category[i];
          if (!element.categoryRoot) {
            rootCategory.push({
              _id: element._id,
              categoryName: element.categoryName,
              categoryChild: [],
            });
          }
        }
        for (let i = 0; i < category.length; i++) {
          const element = category[i];
          for (let j = 0; j < rootCategory.length; j++) {
            if (
              element.categoryRoot &&
              rootCategory[j]._id.toString() === element.categoryRoot
            ) {
              rootCategory[j].categoryChild.push({
                _id: element._id,
                categoryName: element.categoryName,
              });
            }
          }
        }
        res(rootCategory);
      } catch (error) {
        rej(error);
      }
    });
  };

  static getListCategory = (query = {}, body = {}) => {
    return new Promise(async (res, rej) => {
      try {
        const { page, limit } = query;
        const pageCurrent = +page || DATA_PAGE;
        const limitCurrent = +limit || LIMIT_DATA_PAGE;
        const [count, data] = await Promise.all([
          ModelService.countDocumentOfModel(Category),
          ModelService.getListOfModel(
            Category,
            {},
            {},
            {
              page: pageCurrent,
              limit: limitCurrent,
            }
          ),
        ]);
        count > 0
          ? res({
              data: data,
              current_page: pageCurrent,
              total_page: Math.ceil(count / limitCurrent),
              total_data: count,
              limit_per_page: limitCurrent,
            })
          : res({
              data: [],
              current_page: 1,
              total_page: 0,
              total_data: 0,
              limit_per_page: limitCurrent,
            });
      } catch (error) {
        rej(error);
      }
    });
  };

  static updateCategory = (id, body) => {
    return new Promise(async (res, rej) => {
      try {
        const { categoryName, categoryRoot } = body;
        const updateData = {};
        isValidString(categoryName)
          ? (updateData.categoryName = categoryName)
          : "";
        isValidString(categoryRoot)
          ? (updateData.categoryRoot = categoryRoot)
          : "";
        const data = await Category.findByIdAndUpdate(
          id,
          { $set: updateData },
          {
            new: true,
            runValidators: true,
          }
        );
        res(data);
      } catch (error) {
        rej(error);
      }
    });
  };

  static deleteCategory = (id) => {
    return new Promise(async (res, rej) => {
      try {
         await Category.findByIdAndDelete(id);
        res({});
      } catch (error) {
        rej(error);
      }
    });
  };
}

module.exports = CategoryService;
