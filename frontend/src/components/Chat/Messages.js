import { Avatar, Box, Spinner, Stack, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { ChatState } from "../../context/chatProvider";
import ScrollableFeed from "react-scrollable-feed";
import "../../styles/chatStyles.css";
const Messages = ({ messageList, messagesLoading }) => {
  const chatState = ChatState();
  const messagesEndRef = React.createRef();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messageList]);
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
        <ScrollableFeed>
          {messageList.map((msg) => {
            return (
              <Box display={"flex"} key={msg._id}>
                {msg.sender._id !== chatState.user._id && (
                  <Avatar
                    size={"sm"}
                    key={msg.sender._id}
                    src={
                      "http://localhost:4700/api/user/image/" + msg.sender._id
                    }
                    name={msg.sender.name}
                    marginLeft="1%"
                  ></Avatar>
                )}

                <Box
                  key={msg._id}
                  className={
                    msg.sender._id === chatState.user._id
                      ? "rightBubble"
                      : "leftBubble"
                  }
                  maxWidth="600px"
                  overflowX="inherit"
                  marginTop={"0.3%"}
                  marginBottom={"0.8%"}
                  borderRadius="lg"
                  padding="1% 2%"
                >
                  <Box display={"flex"}>{msg.content}</Box>
                </Box>
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </ScrollableFeed>
      )}
    </>
  );
};

export default Messages;
