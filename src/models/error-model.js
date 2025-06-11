class HttpError extends Error {
  constructor(mes, code) {
    super(mes);
    this.code = code;
  }
  logErr() {
    console.error(`[Error Code: ${this.code} - Message: ${this.mes}]`);
  }
}

class ValidatorError extends Error {
  constructor(mes, field, value) {
    super(mes);
    this.name = "ValidationError";
    this.field = field;
    this.value = value;
    this.code = 400;
  }
  logErr() {
    console.error(
      `[${this.name}] Field "${this.field}" invalid: ${this.message}`
    );
  }
}
module.exports = { HttpError, ValidatorError };
