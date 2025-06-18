const { ObjectId } = require('mongoose').Types;
const { DATA_PAGE, LIMIT_DATA_PAGE } = require("../configs/const-config");
const { ValidatorError, HttpError } = require("../models/error-model");
const Product = require("../models/product-model");
const {
  isValidString,
  isValidNumber,
  isEmpty,
  isValidArray,
  isValidStringToArray,
} = require("../utils/validator");
const ModelService = require("./model-service");

class ProductService {
  static createProduct = (body, files) => {
    return new Promise(async (res, rej) => {
      try {
        const {
          productName,
          productQuantity,
          productPrice,
          productSize,
          productMaterial,
          productColor,
          productDescription,
          collectionId,
          categoryId,
          brandId,
        } = body;
        if (!isValidString(productName)) {
          throw new ValidatorError(
            "Tên sản phẩm không được để trống",
            "productName",
            productName
          );
        }
        if (!isValidNumber(productPrice)) {
          throw new ValidatorError(
            "Giá sản phẩm trống hoặc không phải số",
            "productPrice",
            productPrice
          );
        }
        if (!isValidNumber(productQuantity)) {
          throw new ValidatorError(
            "Số lượng sản phẩm trống hoặc không phải số",
            "productQuantity",
            productQuantity
          );
        }
        const objProduct = new Product({
          productName: productName,
          productQuantity: productQuantity,
          productPrice: productPrice,
        });
        if (isValidArray(productSize)) {
          objProduct.productSize = productSize;
        } else if (isValidStringToArray(productSize)) {
          objProduct.productSize = JSON.parse(productSize);
        } else if (isValidString(productSize)) {
          objProduct.productSize = [productSize];
        }
        !isEmpty(productMaterial)
          ? (objProduct.productMaterial = productMaterial)
          : "";
        if (isValidArray(productColor)) {
          objProduct.productColor = productColor;
        } else if (isValidStringToArray(productColor)) {
          objProduct.productColor = JSON.parse(productColor);
        } else if (isValidString(productColor)) {
          objProduct.productColor = [productColor];
        }
        !isEmpty(productDescription)
          ? (objProduct.productDescription = productDescription)
          : "";
        !isEmpty(collectionId) ? (objProduct.collectionId = collectionId) : "";
        !isEmpty(categoryId) ? (objProduct.categoryId = categoryId) : "";
        !isEmpty(brandId) ? (objProduct.brandId = brandId) : "";
        if (isValidArray(files)) {
          const arr = [];
          files.forEach((element) => {
            arr.push(element.path);
          });
          objProduct.productImages = [...arr];
        }
        const newProduct = await objProduct.save();
        return res(newProduct);
      } catch (error) {
        rej(error);
      }
    });
  };

  static getListProduct = (query, body) => {
    return new Promise(async (res, rej) => {
      try {
        const { page, limit } = query;
        const { productPrice, productName, createdAt, soldAmount } = body;
        const pageCurrent = +page || DATA_PAGE;
        const limitCurrent = +limit || LIMIT_DATA_PAGE;
        const optionSort = {};
        isValidNumber(productPrice)
          ? (optionSort.productPrice = productPrice)
          : "";
        isValidNumber(productName)
          ? (optionSort.productName = productName)
          : "";
        isValidNumber(createdAt)
          ? (optionSort.createdAt = createdAt)
          : (optionSort.createdAt = -1);
        isValidNumber(soldAmount) ? (optionSort.soldAmount = soldAmount) : "";
        const [count, data] = await Promise.all([
          ModelService.countDocumentOfModel(Product),
          ModelService.getListOfModel(
            Product,
            optionSort,
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

  static getProductsByCategory = (id, query) => {
    return new Promise(async (res, rej) => {
      try {
        const { page, limit } = query;
        const pageCurrent = +page || DATA_PAGE;
        const limitCurrent = +limit || LIMIT_DATA_PAGE;
        const option = { categoryId: new ObjectId(id) };
        const [count, data] = await Promise.all([
          ModelService.countDocumentOfModel(Product, option),
          ModelService.getListOfModel(
            Product,
            {},
            option,
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


  static getRelatedProduct = (id, optionRelated, limit) => {
    return new Promise(async (res, rej) => {
      try {
        isValidNumber(limit) ? "" : (limit = LIMIT_DATA_PAGE);
        const relatedProduct = await Product.find({
          $or: [...optionRelated],
          _id: { $ne: id },
        }).limit(limit);
        res(relatedProduct);
      } catch (error) {
        rej(error);
      }
    });
  };

  static getDetailProduct = (id) => {
    return new Promise(async (res, rej) => {
      try {
        const product = await Product.findById(id)
          .populate({
            path: "brandId",
            model: "Brand",
            select: "brandName _id",
          })
          .populate({
            path: "categoryId",
            model: "Category",
            select: "categoryName _id",
          })
          .populate({
            path: "collectionId",
            model: "Collection",
            select: "collectionname _id",
          });
        if (!product) {
          throw new HttpError("Sản phẩm không tồn tại", 404);
        }
        const optionRelated = [
          { categoryId: product.categoryId },
          { brandId: product.brandId },
          { collectionId: product.collectionId },
        ];
        const relatedProduct = await this.getRelatedProduct(id, optionRelated);
        res({
          detail: product,
          relatedProduct,
        });
      } catch (error) {
        rej(error);
      }
    });
  };

  static findProductByName = (query, name) => {
    return new Promise(async (res, rej) => {
      try {
        if (!isValidString(name)) {
          throw new ValidatorError(
            "Tên tìm kiếm không được để trống",
            "product name",
            name
          );
        }
        const { page, limit } = query;
        const pageCurrent = +page || DATA_PAGE;
        const limitCurrent = +limit || LIMIT_DATA_PAGE;
        const option = {
          productName: { $regex: name, $options: "i" }, // "i" = không phân biệt hoa thường
        };
        const [count, data] = await Promise.all([
          ModelService.countDocumentOfModel(Product, option),
          ModelService.getListOfModel(Product, {}, option, {
            page: pageCurrent,
            limit: limitCurrent,
          }),
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
}
module.exports = ProductService;
