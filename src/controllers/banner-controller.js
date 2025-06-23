const BannerService = require("../services/banner-service");

class BannerController{
    static async createBanner(req, res, next) {
        try {
            const { body, file } = req;
            const newBanner = await BannerService.createBanner(body, file);
            res.status(201).json({
                sts: true,
                data: newBanner,
                err: null,
                mes: "Tạo banner thành công",
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateBanner(req, res, next) {
        try {
            const { body, file } = req;
            const { id } = req.params;
            const updatedBanner = await BannerService.updateBanner(id, body, file);
            res.status(200).json({
                sts: true,
                data: updatedBanner,
                err: null,
                mes: "Cập nhật banner thành công",
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteBanner(req, res, next) {
        try {
            const { id } = req.params;
            const deletedBanner = await BannerService.deleteBanner(id);
            res.status(200).json({
                sts: true,
                data: deletedBanner,
                err: null,
                mes: "Xóa banner thành công",
            });
        } catch (error) {
            next(error);
        }
    }

    static async getListBanner(req, res, next) {
        try {
            const { query } = req;
            const banners = await BannerService.getListBanner(query);
            res.status(200).json({
                sts: true,
                data: banners,
                err: null,
                mes: "Lấy danh sách banner thành công",
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = BannerController;