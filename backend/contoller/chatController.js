const asyncHandler = require("express-async-handler");
const BadRequestError = require("../Exceptions/BadRequestError");
const NotAuthorisedError = require("../Exceptions/NotAuthorisedError");
const chatModel = require("../models/chatModel");
const { findByIdAndUpdate } = require("../models/userModel");
const userModel = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      throw new Error("User not sent with the request");
    }

    let isChat = await chatModel
      .find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: req.currentUser._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await userModel.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      // create the new chat
      let chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.currentUser._id, userId],
      };

      const createdChat = await chatModel.create(chatData);
      const fullChat = await chatModel
        .findById(createdChat._id)
        .populate("users", "-password");
      return res.status(200).json(fullChat);
    }
  } catch (error) {
    res.status(error.statusCode || 500);
    throw new Error(error.message);
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  // one example without async await
  try {
    //console.log("insode fetch");
    chatModel
      .find({
        users: { $elemMatch: { $eq: req.currentUser._id } },
        $or: [
          {
            isGroupChat: false,
            latestMessage: { $exists: true },
          },
          {
            isGroupChat: true,
            groupAdmin: req.currentUser._id,
          },
        ],
      })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await userModel.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        return res.status(200).json(results);
      });
  } catch (error) {
    res.status(error.statusCode || 500);
    throw new Error(error.message);
  }
});

const createGroup = asyncHandler(async (req, res) => {
  try {
    const { users, chatName } = req.body;
    if (!users || !chatName) {
      throw new BadRequestError("Send all the fields");
    }

    if (users.length < 2) {
      throw new BadRequestError("Group needs more than 2 users");
    }

    users.push(req.currentUser);

    const groupChat = await chatModel.create({
      chatName,
      isGroupChat: true,
      users,
      groupAdmin: req.currentUser,
    });

    const fullGroup = await chatModel
      .findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).json(fullGroup);
  } catch (error) {
    res.status(error.statusCode || 500);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    if (!chatId || !chatName) {
      throw new BadRequestError("Please send all the fields");
    }

    const group = await chatModel.findOne({
      _id: chatId,
    });

    if (!group) {
      throw new BadRequestError("Incorrect Chat Id");
    }

    if (group.groupAdmin._id.toString() !== req.currentUser._id.toString()) {
      throw new NotAuthorisedError(
        "Only Group Admin can change the group Name"
      );
    }

    group.chatName = chatName;
    await group.save();

    const updatedGroup = await chatModel
      .findById(chatId)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(error.statusCode || 500);
    throw new Error(error.message);
  }
});

const addUserToGroup = asyncHandler(async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
      throw new BadRequestError("Send all details");
    }

    const chat = await chatModel.findById(chatId);

    if (!chat) {
      throw new BadRequestError("Invalid chat id");
    }

    if (chat.groupAdmin._id.toString() !== req.currentUser._id.toString()) {
      throw new NotAuthorisedError("Only Group Admin can add new users");
    }

    if (
      chat.users.filter((userObjId) => {
        return userObjId._id.toString() === userId.toString();
      })
    ) {
      throw new BadRequestError("User already exists in the group");
    }

    chat.users.push(userId);

    await chat.save();

    const newChat = await chatModel
      .findById(chat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).json(newChat);
  } catch (error) {
    res.status(error.statusCode || 500);
    throw new Error(error.message);
  }
});

const removeUserFromGroup = asyncHandler(async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
      throw new BadRequestError("Send all details");
    }

    const chat = await chatModel.findById(chatId);

    if (!chat) {
      throw new BadRequestError("Invalid chat id");
    }

    if (chat.groupAdmin._id.toString() !== req.currentUser._id.toString()) {
      throw new NotAuthorisedError("Only Group Admin can add new users");
    }

    if (
      chat.users.filter((userObjId) => {
        return userObjId._id.toString() === userId.toString();
      }).length == 0
    ) {
      throw new BadRequestError("User Does not exist in the group");
    }

    chat.users = chat.users.filter((user) => {
      return user._id.toString() !== userId.toString();
    });

    await chat.save();

    const newChat = await chatModel
      .findById(chat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).json(newChat);
  } catch (error) {
    res.status(error.statusCode || 500);
    throw new Error(error.message);
  }
});
const chatController = {
  accessChat,
  fetchChats,
  createGroup,
  renameGroup,
  addUserToGroup,
  removeUserFromGroup,
};
module.exports = chatController;
