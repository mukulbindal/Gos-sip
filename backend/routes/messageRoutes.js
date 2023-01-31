const express = require("express");
const messageController = require("../contoller/messageController");
const authMiddleware = require("../middleware/authMiddleware");

const messageRoutes = express.Router();

// send messageRoutes, fetch message

messageRoutes
  .route("/send")
  .post(authMiddleware.authorize, messageController.sendMessage);

messageRoutes
  .route("/:chatId")
  .get(authMiddleware.authorize, messageController.fetchMessages);
module.exports = messageRoutes;
