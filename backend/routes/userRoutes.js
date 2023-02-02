const express = require("express");
const userController = require("../contoller/userController");
const authMiddleware = require("../middleware/authMiddleware");

const userRouter = express.Router();

userRouter.route("/register").post(userController.registerUser);
userRouter.route("/auth").post(userController.authUser);
userRouter.route("/").get(authMiddleware.authorize, userController.searchUser);
userRouter.route("/image/:userId").get(userController.getImage);

module.exports = userRouter;
