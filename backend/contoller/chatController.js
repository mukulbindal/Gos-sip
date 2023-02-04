const asyncHandler = require("express-async-handler");
const BadRequestError = require("../Exceptions/BadRequestError");
const NotAuthorisedError = require("../Exceptions/NotAuthorisedError");
const chatModel = require("../models/chatModel");
const userModel = require("../models/userModel");

/* This method will return the chat between two users if exists, else creates a new one */
const accessChat = asyncHandler(async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      throw new BadRequestError("User not sent with the request");
    }

    let isChat = await chatModel
      .find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: req.currentUser._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
      .populate("users", "-password -pic")
      .populate("latestMessage");

    isChat = await userModel.populate(isChat, {
      path: "latestMessage.sender",
      select: "name email",
    });

    if (isChat.length > 0) {
      return res.send(isChat[0]);
    } else {
      // create the new chat
      const chatData = new chatModel({
        chatName: "Single",
        isGroupChat: false,
        users: [req.currentUser._id, userId],
      });

      await chatData.save();
      await chatData.populate("users", "-password -pic");
      return res.status(200).json(chatData);
    }
  } catch (error) {
    res.status(error.statusCode || 500);
    throw error;
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  // one example without async await
  try {
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
            $or: [
              { latestMessage: { $exists: true } },
              { groupAdmin: req.currentUser._id },
            ],
          },
        ],
      })
      .populate("users", "-password -pic")
      .populate("groupAdmin", "-password -pic")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await userModel.populate(results, {
          path: "latestMessage.sender",
          select: "name email",
        });
        return res.status(200).json(results);
      });
  } catch (error) {
    res.status(error.statusCode || 500);
    throw error;
  }
});
// An Example on why to use microservices. It's bad practice and should be avoided.
const createGroup = asyncHandler(async (req, res) => {
  try {
    const {
      users, // list of users
      chatName, // Name of the chat
      chatId, // Chat Id if chat already exists
      requestType, // Type of request: C=Create M=Modify L=Leave Group
    } = req.body;

    // Request Validation
    if (!requestType) {
      throw new BadRequestError("Request Type is not present");
    }

    if (requestType === "C" && (!users || !chatName)) {
      throw new BadRequestError("Send all the fields");
    }

    if ((requestType === "L" || requestType === "M") && !chatId) {
      throw new BadRequestError("Send the chat Id to be modified");
    }

    if (requestType !== "L" && users.length < 2) {
      throw new BadRequestError("Group needs more than 2 users");
    }

    if (requestType == "C") users.push(req.currentUser);
    let groupChat = null;
    if (requestType == "C") {
      groupChat = await chatModel.create({
        chatName,
        isGroupChat: true,
        users,
        groupAdmin: req.currentUser._id,
      });
    } else {
      if (requestType === "L") {
        groupChat = await chatModel.findOne({
          _id: chatId,
        });
      } else {
        groupChat = await chatModel.findOne({
          _id: chatId,
          groupAdmin: req.currentUser._id,
        });
      }
      if (!groupChat) {
        throw new BadRequestError(
          "You are not allowed to perform this operation"
        );
      }
      if (requestType === "M" && chatName) {
        groupChat.chatName = chatName;
        groupChat.users = users;
      }

      // if removing group admin, assign new admin
      if (requestType === "L") {
        groupChat.users = await users.filter(
          (user) => user._id !== req.currentUser._id
        );
        if (groupChat.groupAdmin._id === req.currentUser._id) {
          groupChat.groupAdmin = groupChat.users[0]?._id || null;
        }
      }

      await groupChat.save();
    }

    const fullGroup = await chatModel
      .findById(groupChat._id)
      .populate("users", "-password -pic")
      .populate("groupAdmin", "-password -pic");

    return res.status(200).json(fullGroup);
  } catch (error) {
    res.status(error.statusCode || 500);
    throw error;
  }
});

// An Example on why to use microservices. Below are the better approaches
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
