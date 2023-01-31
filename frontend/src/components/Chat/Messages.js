import { Box, Spinner, Text } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../context/chatProvider";

const Messages = ({ messageList, messagesLoading }) => {
  const chatState = ChatState();
  return (
    <>
      {messageList && messageList.length === 0 ? (
        messagesLoading ? (
          <Box display={"flex"} height="100%">
            <Spinner margin="auto" size={"xl"}></Spinner>
          </Box>
        ) : (
          <Box display={"flex"} height="100%">
            <Text margin={"auto"}>Send Your First Message 🙂</Text>
          </Box>
        )
      ) : (
        <Box height={"100%"} display="flex" flexDirection={"column"}>
          {messageList.map((msg) => {
            return (
              <Box
                key={msg._id}
                style={
                  msg.sender._id === chatState.user._id
                    ? { backgroundColor: "rgba(200, 200, 255, 0.9)" }
                    : { backgroundColor: "rgba(230, 255, 230, 0.9)" }
                }
                maxWidth="70%"
                marginTop="4px"
                marginBottom={"4px"}
                borderRadius="lg"
                padding={"4px"}
              >
                {msg.content}
              </Box>
            );
          })}
        </Box>
      )}
    </>
  );
};

export default Messages;
