class BadRequestError extends Error {
  constructor(message) {
    super(message);
    if (!message) {
      this.message = "Bad Data";
    }
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;
