const CollectionService = require("../services/collection-service");

class CollectionController {
  static createCollection = async (req, res, next) => {
    try {
      const body = req.body;
      const data = await CollectionService.createCollection(body);
      return res.status(201).json({
        sts: true,
        data: data,
        err: null,
        message: "Tạo bộ sưu tập thành công",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = CollectionController;
