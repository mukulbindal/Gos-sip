import { AddIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/chatProvider";
import ChatBoxBody from "./ChatBoxBody";
import ChatBoxHeader from "./ChatBoxHeader";
import io from "socket.io-client";
const SOCKET_ENDPOINT = "http://localhost:4700";
const socket = io(SOCKET_ENDPOINT);
const ChatBox = () => {
  const chatState = ChatState();
  const [isUserConnected, setisUserConnected] = useState(false);
  const bodyRef = React.useRef();
  const sendLiveMessage = (messageData) => {
    socket.emit("new-message", messageData);
  };
  const updateTheChatList = (message) => {
    const chatToBeModified = chatState.chats?.find(
      (chat) => chat._id === message.chat._id
    );
    chatToBeModified.latestMessage = message;
    chatState.setChats([
      chatToBeModified,
      ...chatState.chats?.filter((chat) => chat._id !== message.chat._id),
    ]);
  };

  useEffect(() => {
    socket.emit("init-conn", chatState.user);
    socket.on("connect", () => {
      console.log("connected");

      setisUserConnected(true);
    });
  }, []);

  return (
    <Box
      display={{
        base: chatState.selectedChat ? "block" : "none",
        md: "block",
      }}
      width={"100%"}
      marginX={2}
      backgroundColor="rgba(230, 230, 255, 0.8)"
      borderRadius={"lg"}
    >
      {chatState.selectedChat ? (
        <>
          <ChatBoxHeader></ChatBoxHeader>
          <ChatBoxBody
            sendLiveMessage={sendLiveMessage}
            updateTheChatList={updateTheChatList}
            bodyRef={bodyRef}
            socket={socket}
          ></ChatBoxBody>
        </>
      ) : (
        <Box display={"flex"} flexDirection="column">
          <Text align="center" marginTop="40vh">
            <AddIcon /> <br />
            Start a new conversation
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default ChatBox;
