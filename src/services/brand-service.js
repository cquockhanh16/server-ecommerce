const Brand = require("../models/brand-model");
const { ValidatorError } = require("../models/error-model");
const { isValidString, isValidNumber } = require("../utils/validator");

class BrandService {
  static createBrand = (body) => {
    return new Promise(async (res, rej) => {
      try {
        const { brandName, foundedDate, founderName } = body;
        if (!isValidString(brandName)) {
          throw new ValidatorError(
            "Tên thương hiệu không được để trống",
            "brandName",
            brandName
          );
        }
        const objBrand = new Brand({
          brandName: brandName,
        });
        isValidNumber(foundedDate) ? (objBrand.foundedDate = foundedDate) : "";
        isValidString(founderName) ? (objBrand.founderName = founderName) : "";
        const newBrand = await objBrand.save();
        res(newBrand);
      } catch (error) {
        rej(error);
      }
    });
  };
}

module.exports = BrandService;
