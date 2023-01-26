class NotAuthorisedError extends Error {
  constructor(message) {
    super(message);
    if (!message) {
      this.message = "Not Authorised";
    }
    this.statusCode = 401;
  }
}

module.exports = NotAuthorisedError;
