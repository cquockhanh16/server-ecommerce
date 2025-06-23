const VoucherService = require("../services/voucher-service");

class VoucherController {
    static createVoucher = async (req, res, next) => {
        try {
            const { body } = req;
            // Assuming VoucherService.createVoucher is defined
            const newVoucher = await VoucherService.createVoucher(body);
            res.status(201).json({
                sts: true,
                data: newVoucher,
                err: null,
                mes: "Tạo voucher thành công",
            });
        } catch (error) {
            next(error);
        }
    }

    static updateVoucher = async (req, res, next) => {
        try {
            const { body, params } = req;
            // Assuming VoucherService.updateVoucher is defined
            const updatedVoucher = await VoucherService.updateVoucher(params.id, body);
            res.status(200).json({
                sts: true,
                data: updatedVoucher,
                err: null,
                mes: "Cập nhật voucher thành công",
            });
        } catch (error) {
            next(error);
        }
    }

    static deleteVoucher = async (req, res, next) => {
        try {
            const { id } = req.params;
            // Assuming VoucherService.deleteVoucher is defined
            const deletedVoucher = await VoucherService.deleteVoucher(id);
            res.status(200).json({
                sts: true,
                data: deletedVoucher,
                err: null,
                mes: "Xóa voucher thành công",
            });
        } catch (error) {
            next(error);
        }
    }

    static getListVoucher = async (req, res, next) => {
        try {
            const { query } = req;
            // Assuming VoucherService.getListVoucher is defined
            const vouchers = await VoucherService.getListVoucher(query);
            res.status(200).json({
                sts: true,
                data: vouchers,
                err: null,
                mes: "Lấy danh sách voucher thành công",
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = VoucherController;