class ModelService {
  static countDocumentOfModel = (Model) => {
    return new Promise(async (res, rej) => {
      try {
        const count = await Model.countDocuments();
        res(count);
      } catch (error) {
        rej(error);
      }
    });
  };

  static getListOfModel = (Model, optionSort = {}, { page, limit }) => {
    return new Promise(async (res, rej) => {
      if (!Model || !Model.find) {
        throw new Error("Invalid Model provided");
      }
      if (page < 1) page = 1;
      if (limit < 1) limit = 10;
      try {
        const list = await Model.find()
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
