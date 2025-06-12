const Collection = require("../models/collection-model");
const { ValidatorError } = require("../models/error-model");
const { isValidString, isValidNumber } = require("../utils/validator");

class CollectionService {
  static createCollection = (body) => {
    return new Promise(async (res, rej) => {
      try {
        const { collectionName, releasedDate, creatorName } = body;
        if (!isValidString(collectionName)) {
          throw new ValidatorError(
            "Tên bộ sưu tập không được để trống",
            "collectionName",
            collectionName
          );
        }
        const objCollection = new Collection({
          collectionName: collectionName,
        });
        isValidNumber(releasedDate)
          ? (objCollection.releasedDate = releasedDate)
          : "";
        isValidString(creatorName)
          ? (objCollection.creatorName = creatorName)
          : "";
        const newCollection = await objCollection.save();
        res(newCollection);
      } catch (error) {
        rej(error);
      }
    });
  };
}

module.exports = CollectionService;
