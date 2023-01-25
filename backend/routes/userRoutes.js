const express = require("express");
const userController = require("../contoller/userController");

const userRouter = express.Router();

userRouter.route("/register").post(userController.registerUser);
userRouter.route("/auth").post(userController.authUser);
module.exports = userRouter;
