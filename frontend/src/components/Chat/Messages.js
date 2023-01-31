import { Avatar, Box, Spinner, Stack, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { ChatState } from "../../context/chatProvider";
import ScrollableFeed from "react-scrollable-feed";
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
                    src={msg.sender.pic}
                    name={msg.sender.name}
                    marginLeft="1%"
                  ></Avatar>
                )}

                <Box
                  key={msg._id}
                  style={
                    msg.sender._id === chatState.user._id
                      ? {
                          backgroundColor: "rgba(200, 200, 255, 0.9)",
                          //marginLeft: "30%",
                        }
                      : {
                          backgroundColor: "rgba(230, 255, 230, 0.9)",
                          marginLeft: "1%",
                        }
                  }
                  maxWidth="70%"
                  marginTop="1%"
                  marginBottom={"0.5%"}
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
