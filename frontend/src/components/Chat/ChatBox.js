import { Box } from "@chakra-ui/react";
import React from "react";
import ChatBoxBody from "./ChatBoxBody";
import ChatBoxHeader from "./ChatBoxHeader";

const ChatBox = () => {
  return (
    <Box
      width={"100%"}
      marginX={2}
      backgroundColor="rgba(230, 230, 255, 0.99)"
      borderRadius={"lg"}
    >
      <ChatBoxHeader></ChatBoxHeader>
      <ChatBoxBody></ChatBoxBody>
    </Box>
  );
};

export default ChatBox;
