const LIMIT_DATA_PAGE = 20;
const DATA_PAGE = 1;
const SALT_ROUNDS = 10;
const MAX_NUMBER_IMAGE_PRODUCT = 5;
const ORDER_STATUS = 
  ["pending", "confirmed", "shipping", "completed", "cancelled"]
;
const PAYMENT_METHOD = ["COD", "BANK"];
const PAYMENT_STATUS = ["unpaid", "paid", "error"];

module.exports = {
  LIMIT_DATA_PAGE,
  DATA_PAGE,
  SALT_ROUNDS,
  MAX_NUMBER_IMAGE_PRODUCT,
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
};
