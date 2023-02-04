const chatModel = require("../models/chatModel");

const fetchUsersByChat = async (chatId) => {
  try {
    const users = await chatModel
      .findById(chatId, { users: 1 })
      .populate("users", "_id");
    //console.log(users);
    return users.users;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const ChatLogic = { fetchUsersByChat };

module.exports = ChatLogic;
