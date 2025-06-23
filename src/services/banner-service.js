const { ValidatorError } = require("../models/error-model");
const { isValidString } = require("../utils/validator");
const Banner = require("../models/banner-model");
const { deleteFileImageCloudinary } = require("../utils/delete-image");
const { DATA_PAGE, LIMIT_DATA_PAGE } = require("../configs/const-config");
const ModelService = require("./model-service");
class BannerService{
    static async createBanner(body, file) {
        return new Promise(async (resolve, reject) => {
            try {
                const { bannerTitle, bannerDescription } = body;
                if(!isValidString(bannerTitle)) {
                    throw new ValidatorError("Tiêu đề banner không được để trống", "bannerTitle", bannerTitle);
                }
                if(!file){
                    throw new ValidatorError("Ảnh banner không được để trống", "bannerImage", file);
                }
                const objBanner = new Banner();
                isValidString(bannerDescription) && (objBanner.bannerDescription = bannerDescription);
                objBanner.bannerTitle = bannerTitle;
                objBanner.bannerImage = file.path;
                const newBanner = await objBanner.save();
                resolve(newBanner);
            } catch (error) {
                reject(error);
            }
        });
    }

    static async updateBanner(id, body, file) {
        return new Promise(async (resolve, reject) => {
          try {
            const { bannerTitle, bannerDescription, isActive } = body;
            const banner = await Banner.findById(id);
            if (!banner) {
              throw new ValidatorError("Banner không tồn tại", "id", id);
            }
            if (banner.bannerImage && file && file.path) {
                await deleteFileImageCloudinary(banner.bannerImage);
            }
            const objBanner = {};
            isValidString(bannerTitle) ?
              (objBanner.bannerTitle = bannerTitle) : "";
            isValidString(bannerDescription) ?
              (objBanner.bannerDescription = bannerDescription) : "";
            isActive === "true" || isActive === true
              ? (objBanner.isActive = true) : (objBanner.isActive = false);
            file && file.path ? (objBanner.bannerImage = file.path) : "";
            const existBanner = await Banner.findByIdAndUpdate(id, objBanner, {
              new: true,});
            resolve(existBanner);
          } catch (error) {
            reject(error);
          }
        });
    }

    static async deleteBanner(id) {
        return new Promise(async (resolve, reject) => {
          try {
            const banner = await Banner.findById(id);
            if (!banner) {
              throw new ValidatorError("Banner không tồn tại", "id", id);
            }
            if (banner.bannerImage) {
              await deleteFileImageCloudinary(banner.bannerImage);
            }
            await Banner.deleteOne({ _id: id });
            resolve({});
          } catch (error) {
            reject(error);
          }
        });
    }

    static async getListBanner(query) {
        return new Promise(async (res, rej) => {
          try {
            const { page, limit } = query;
            const pageCurrent = +page || DATA_PAGE;
            const limitCurrent = +limit || LIMIT_DATA_PAGE;
            const [count, data] = await Promise.all([
              ModelService.countDocumentOfModel(Banner),
              ModelService.getListOfModel(
                Banner,
                {
                  createdAt: -1, // Sắp xếp theo ngày tạo mới nhất
                },
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
    }
}

module.exports = BannerService;