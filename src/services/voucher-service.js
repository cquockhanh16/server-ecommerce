const moment = require("moment");
const { DATA_PAGE, LIMIT_DATA_PAGE } = require("../configs/const-config");
const { ValidatorError, HttpError } = require("../models/error-model");
const Voucher = require("../models/voucher-model");
const { isValidString, isValidNumber } = require("../utils/validator");
const ModelService = require("./model-service");
class VoucherService {
    static createVoucher(body) {
        return new Promise(async (resolve, reject) => {
            try {
                const {
                  voucherName,
                  voucherDiscount,
                  expiryDate,
                  usageLimit,
                  isActive,
                } = body;
                if(!isValidString(voucherName)) {
                    throw new ValidatorError(
                        "Tên voucher không được để trống", "voucherName", voucherName);
                }
                if (!isValidNumber(voucherDiscount)) {
                  throw new ValidatorError(
                    "Phần trăm giảm giá không được để trống",
                    "voucherDiscount",
                    voucherDiscount
                  );
                }
                const objVoucher = new Voucher();
                objVoucher.voucherName = voucherName;
                objVoucher.voucherDiscount = voucherDiscount;
                const defaultExpiryDate = moment().add(3, "months").valueOf(); // Default to 30 days from now
                isValidNumber(expiryDate)
                  ? (objVoucher.expiryDate = expiryDate)
                  : (objVoucher.expiryDate = defaultExpiryDate);
                isValidNumber(usageLimit) ? objVoucher.usageLimit = usageLimit : "";
                (isActive === "true" || isActive === true)
                  ? objVoucher.isActive === true
                  : "";
                const newVoucher = await objVoucher.save();
                resolve(newVoucher);
            } catch (error) {
                reject(error);
            }
        });
    }

    static updateVoucher(id, body) {
        return new Promise(async (resolve, reject) => {
          try {
            const {
              voucherName,
              voucherDiscount,
              expiryDate,
              usageLimit,
              isActive,
            } = body;
            const objVoucher = {};
            isValidString(voucherName) ? objVoucher.voucherName = voucherName : ""  ;
            isValidNumber(voucherDiscount) ? objVoucher.voucherDiscount = voucherDiscount : "";
            const defaultExpiryDate = moment().add(3, "months").valueOf(); // Default to 30 days from now
            isValidNumber(expiryDate)
              ? (objVoucher.expiryDate = expiryDate)
              : (objVoucher.expiryDate = defaultExpiryDate);
            isValidNumber(usageLimit)
              ? (objVoucher.usageLimit = usageLimit)
              : "";
            (isActive === "true" || isActive === true)
              ? objVoucher.isActive === true
              : (objVoucher.isActive = false);
            const existVoucher = await Voucher.findByIdAndUpdate(
              id,
              objVoucher,
              { new: true }
            );
            resolve(existVoucher);
          } catch (error) {
            reject(error);
          }
        });
    }

    static deleteVoucher(id) {
        return new Promise(async (resolve, reject) => {
          try {
            const deletedVoucher = await Voucher.findByIdAndDelete(id);
            if (!deletedVoucher) {
              throw new HttpError("Voucher không tồn tại", 404);
            }
            resolve(deletedVoucher);
          } catch (error) {
            reject(error);
          }
        });
    }

    static getListVoucher(query) {
        return new Promise(async (res, rej) => {
          try {
            const { page, limit } = query;
            const pageCurrent = +page || DATA_PAGE;
            const limitCurrent = +limit || LIMIT_DATA_PAGE;
            const [count, data] = await Promise.all([
              ModelService.countDocumentOfModel(Voucher),
              ModelService.getListOfModel(
                Voucher,
                {},
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

module.exports = VoucherService;