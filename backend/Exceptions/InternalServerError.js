class InternalServerError extends Error {
  constructor(message) {
    super(message);
    if (!message) {
      this.message = "Something Unexpected Occurred";
    }
    this.statusCode = 500;
  }
}

module.exports = InternalServerError;
