const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const NoTokenError = require("../Exceptions/NoTokenError");

const authorize = asyncHandler(async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.currentUser = await userModel.findById(decoded.id, { password: 0 });

      return next();
    }
    throw new NoTokenError();
  } catch (error) {
    res.status(error.statusCode || 401);
    throw error;
  }
});

const authMiddleware = { authorize };
module.exports = authMiddleware;
