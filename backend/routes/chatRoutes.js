const express = require("express");
const chatController = require("../contoller/chatController");
const authMiddleware = require("../middleware/authMiddleware");

const chatRoutes = express.Router();

//accesschat , fetchchat, createGroupchat, renamegroup
// remove from group , add to group

chatRoutes
  .route("/")
  .get(authMiddleware.authorize, chatController.fetchChats)
  .post(authMiddleware.authorize, chatController.accessChat);

chatRoutes
  .route("/createGroup")
  .post(authMiddleware.authorize, chatController.createGroup);

chatRoutes
  .route("/renameGroup")
  .put(authMiddleware.authorize, chatController.renameGroup);

chatRoutes
  .route("/addUserToGroup")
  .put(authMiddleware.authorize, chatController.addUserToGroup);

chatRoutes
  .route("/removeUserFromGroup")
  .put(authMiddleware.authorize, chatController.removeUserFromGroup);
module.exports = chatRoutes;
