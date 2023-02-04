const asyncHandler = require("express-async-handler");
const BadRequestError = require("../Exceptions/BadRequestError");
const chatModel = require("../models/chatModel");
const messageModel = require("../models/messageModel");
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
    await message.populate("chat.users", "_id name");
    await message.populate("sender", "name email");

    res.json(message);
    await chatModel.findByIdAndUpdate(
      message.chat._id,
      {
        latestMessage: message._id,
      },
      { new: true }
    );
  } catch (error) {
    res.status(error.statusCode || 500);
    throw error;
  }
});

const fetchMessages = asyncHandler(async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const messages = await messageModel
      .find({
        chat: chatId,
      })
      .populate("chat", "isGroupChat")
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    return res.json(messages);
  } catch (error) {
    res.status(error.statusCode || 500);
    throw error;
  }
});
const messageController = {
  sendMessage,
  fetchMessages,
};
module.exports = messageController;
