import { AddIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../context/chatProvider";
import ChatBoxBody from "./ChatBoxBody";
import ChatBoxHeader from "./ChatBoxHeader";

const ChatBox = () => {
  const chatState = ChatState();
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
          <ChatBoxBody></ChatBoxBody>
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
