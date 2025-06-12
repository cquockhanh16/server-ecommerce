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
    { page, limit }
  ) => {
    return new Promise(async (res, rej) => {
      if (!Model || !Model.find) {
        throw new Error("Invalid Model provided");
      }
      if (page < 1) page = 1;
      if (limit < 1) limit = 10;
      try {
        const list = await Model.find(optionFind)
          .skip((page - 1) * limit)
          .limit(limit)
          .sort(optionSort)
          .lean();
        res(list);
      } catch (error) {
        rej(error);
      }
    });
  };
}

module.exports = ModelService;
