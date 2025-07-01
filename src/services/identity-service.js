const { ValidatorError, HttpError } = require("../models/error-model");
const bcrypt = require("bcrypt");
const Identity = require("../models/identity-model");
const { isValidString, isValidEmail } = require("../utils/validator");
const { deleteFileImageCloudinary } = require("../utils/delete-image");

class IdentityService {
  static updateIdentity = (body, user, file = {}) => {
    return new Promise(async (res, rej) => {
      try {
        const {
          firstName,
          lastName,
          email,
          password,
          oldPassword,
          phoneNumber,
          address,
        } = body;
        const existUser = await Identity.findById(user?.id);
        if (!existUser) {
          throw new HttpError("Người dùng không tồn tại", 404);
        }
        if (existUser.avatar && file && file.path) {
          await deleteFileImageCloudinary(existUser.avatar);
        }
        const optionUpdate = {};
        if (file && isValidString(file.path)) {
          optionUpdate.avatar = file.path;
        }
        if (firstName && !isValidString(firstName)) {
          throw new ValidatorError(
            "Họ đệm không được để trống",
            "firstname",
            firstName
          );
        }
        if (lastName && !isValidString(lastName)) {
          throw new ValidatorError(
            "Tên không được để trống",
            "lastName",
            lastName
          );
        }
        if (email && !isValidEmail(email)) {
          throw new ValidatorError(
            "Email không đúng định dạng",
            "email",
            email
          );
        }
        if (password) {
          if (!isValidString(password)) {
            throw new ValidatorError(
              "Password không được để trống",
              "password",
              password
            );
          } else {
            const isMatch = await existUser.comparePassword(oldPassword);
            if (!isMatch) {
              throw new ValidatorError(
                "Mật khẩu không đúng",
                "password",
                password
              );
            }
            const salt = await bcrypt.genSalt(10);
            optionUpdate.password = await bcrypt.hash(password, salt);
          }
        }
        if (phoneNumber && !isValidString(phoneNumber)) {
          throw new ValidatorError(
            "Số điện thoại không được để trống",
            "phoneNumber",
            phoneNumber
          );
        }
        if (address && !isValidString(address)) {
          throw new ValidatorError(
            "Địa chỉ không được để trống",
            "address",
            address
          );
        }

        firstName ? (optionUpdate.firstName = firstName) : "";
        lastName ? (optionUpdate.lastName = lastName) : "";
        email ? (optionUpdate.email = email) : "";
        phoneNumber ? (optionUpdate.phoneNumber = phoneNumber) : "";
        address ? (optionUpdate.address = [...existUser.address, address]) : "";
        const updatedUser = await Identity.findOneAndUpdate(
          { _id: user?.id },
          optionUpdate,
          {
            new: true,
          }
        );
        res(updatedUser);
      } catch (error) {
        rej(error);
      }
    });
  };

  static getListIdentity = () => {
    return new Promise(async (res, rej) => {
      try {
        const identities = await Identity.find().select("-password");
        res(identities);
      } catch (error) {
        rej(error);
      }
    });
  };

  static lockIdentity = (id, body = {}) => {
    return new Promise((res, rej) => {
      try {
        let optionUpdate = {};
        if (body.status === "lock") {
          optionUpdate.status = body.status;
        } else {
          optionUpdate.status = "off";
        }
        const identity = Identity.findByIdAndUpdate(id, optionUpdate, {
          new: true,
        });
        res(identity);
      } catch (error) {
        rej(error);
      }
    });
  };
}

module.exports = IdentityService;
