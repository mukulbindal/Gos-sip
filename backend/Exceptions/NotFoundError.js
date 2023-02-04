class NotFoundError extends Error {
  constructor(message) {
    super(message);
    if (!message) {
      this.message = "No Data Found";
    }
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
