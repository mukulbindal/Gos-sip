export class ValidationError extends Error {
  constructor(msg, listOfErrors) {
    super(msg);
    this.errors = listOfErrors;
  }
}
