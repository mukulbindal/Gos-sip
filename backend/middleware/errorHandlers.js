const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  if (process.env.NODE_ENV !== "PROD") console.error(err);
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "PROD" ? null : err.stack,
  });
};

const errorHandlers = { notFound, errorHandler };
module.exports = errorHandlers;
