class AppError extends Error {
  constructor() {
    super();
  }

  create(message, statusCode, statusMessage) {
    this.message = message;
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
    //* << return this >> this will return every things in this class
    return this;
  }
}

module.exports = new AppError();
