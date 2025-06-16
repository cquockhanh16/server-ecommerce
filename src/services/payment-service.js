const crypto = require("crypto");
const axios = require("axios");

require("dotenv").config();

class PaymentService {
  static createPaymentUrl = async (body) => {
    return new Promise(async (res, rej) => {
      try {
        let { orderIdd, amountt } = body;
        var partnerCode = "MOMO";
        var accessKey = process.env.MOMO_ACCESSKEY;
        var secretkey = process.env.MOMO_SERCETKEY;
        var requestId = partnerCode + new Date().getTime() + "-" + orderIdd;
        var orderId = requestId;
        var orderInfo = "pay with MoMo";
        var redirectUrl = "http://localhost:5173/san-pham-cam-do";
        var ipnUrl = "https://server-ecommerce-20bb.onrender.com/api/momo/ipn";
        var amount = +amountt;
        var requestType = "captureWallet";
        var extraData = ""; //pass empty value if your merchant does not have stores

        //before sign HMAC SHA256 with format
        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        var rawSignature =
          "accessKey=" +
          accessKey +
          "&amount=" +
          amount +
          "&extraData=" +
          extraData +
          "&ipnUrl=" +
          ipnUrl +
          "&orderId=" +
          orderId +
          "&orderInfo=" +
          orderInfo +
          "&partnerCode=" +
          partnerCode +
          "&redirectUrl=" +
          redirectUrl +
          "&requestId=" +
          requestId +
          "&requestType=" +
          requestType;
        //puts raw signature
        // console.log("--------------------RAW SIGNATURE----------------");
        // console.log(rawSignature);
        //signature
        var signature = crypto
          .createHmac("sha256", secretkey)
          .update(rawSignature)
          .digest("hex");
        // console.log("--------------------SIGNATURE----------------");
        // console.log(signature);

        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
          partnerCode: partnerCode,
          accessKey: accessKey,
          requestId: requestId,
          amount: amount,
          orderId: orderId,
          orderInfo: orderInfo,
          redirectUrl: redirectUrl,
          ipnUrl: ipnUrl,
          extraData: extraData,
          requestType: requestType,
          signature: signature,
          lang: "vi",
        });
        let result;
        result = await axios({
          method: "POST",
          url: "https://test-payment.momo.vn/v2/gateway/api/create",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(requestBody),
          },
          data: requestBody,
        });
        res(result.data);
      } catch (error) {
        console.log(error);
        rej(error);
      }
    });
  };
}

module.exports = PaymentService;
