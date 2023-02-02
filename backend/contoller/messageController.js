const asyncHandler = require("express-async-handler");
const BadRequestError = require("../Exceptions/BadRequestError");
const NotAuthorisedError = require("../Exceptions/NotAuthorisedError");
const chatModel = require("../models/chatModel");
const messageModel = require("../models/messageModel");
const { findByIdAndUpdate } = require("../models/userModel");
const userModel = require("../models/userModel");

const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { sender, chat, content } = req.body;
    if (!sender || !chat || !content) {
      throw new BadRequestError("Send all details");
    }
    const message = await new messageModel({
      content,
      sender,
      chat,
    });
    await message.save();
    await message.populate("chat");
    await message.populate("sender", "name email");
    //let fullMessage = await chatModel.populate(message, "chat");
    //fullMessage = await fullMessage.populate("sender", "name email");
    //await messa
    await chatModel.findByIdAndUpdate(
      message.chat._id,
      {
        latestMessage: message._id,
      },
      { new: true }
    );

    //console.log(message);
    res.json(message);
  } catch (error) {
    res.status(error.statusCode || 500);
    throw new Error(error.message);
  }
});
let controller;

const fetchMessages = asyncHandler(async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const messages = await messageModel.find({
      chat: chatId,
    });
    let fullMessages = await chatModel.populate(messages, "chat");
    fullMessages = await userModel.populate(fullMessages, "sender");

    res.json(fullMessages);
  } catch (error) {
    res.status(error.statusCode || 500);
    throw new Error(error.message);
  }
});
const messageController = {
  sendMessage,
  fetchMessages,
};
module.exports = messageController;
