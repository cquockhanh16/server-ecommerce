const { DATA_PAGE, LIMIT_DATA_PAGE } = require("../configs/const-config");

class ModelService {
  static countDocumentOfModel = (Model, option = {}) => {
    return new Promise(async (res, rej) => {
      try {
        const count = await Model.countDocuments(option);
        res(count);
      } catch (error) {
        rej(error);
      }
    });
  };

  static getListOfModel = (
    Model,
    optionSort = {},
    optionFind = {},
    { page = DATA_PAGE, limit = LIMIT_DATA_PAGE },
    populate = [],
  ) => {
    return new Promise(async (res, rej) => {
      if (!Model || !Model.find) {
        throw new Error("Invalid Model provided");
      }
      try {
        let query = Model.find(optionFind)
          .skip((page - 1) * limit)
          .limit(limit)
          .sort(optionSort)
        if(populate && populate.length > 0) {
          populate.forEach((item) => {
            query = query.populate(item); // Mỗi item là một object { path, select, model }
          });
        }
        const list = await query.lean();
        res(list);
      } catch (error) {
        rej(error);
      }
    });
  };
}

module.exports = ModelService;
