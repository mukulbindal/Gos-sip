const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const NoTokenException = require("../Exceptions/NoTokenException");

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
    throw new NoTokenException();
  } catch (error) {
    if (error instanceof NoTokenException) {
      res.status(error.statusCode);
      throw error;
    } else {
      res.status(401);
      throw new Error("Not Authorized, token failed");
    }
  }
});

const authMiddleware = { authorize };
module.exports = authMiddleware;
