const isValidString = (str) => {
  if (str && !isEmpty(str)) {
    return true;
  }
  return false;
};

const isValidNumber = (num) => {
  if (num && !isEmpty(num) && !isNaN(num)) {
    return true;
  }
  return false;
};

const isValidArray = (arr) => {
  if (arr && Array.isArray(arr)) return true;
  return false;
};

const isValidStringToArray = (str) => {
  if (!isEmpty(str) && typeof str === "string") {
    str.trim();
    try {
      let arrParse = JSON.parse(str);
      if (typeof arrParse === "object") return true;
    } catch (error) {
      return false;
    }
  }
  return false;
};

const isEmpty = (arg) => {
  if (!arg || arg.trim() === "") return true;
  return false;
};

module.exports = {
  isValidArray,
  isValidNumber,
  isValidString,
  isEmpty,
  isValidStringToArray,
};
