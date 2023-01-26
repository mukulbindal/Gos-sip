class NoTokenException extends Error {
  constructor(message) {
    super(message);
    if (!message) {
      this.message = "No Auth Token Found.";
    }
    this.statusCode = 401;
  }
}

module.exports = NoTokenException;
