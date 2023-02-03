import { AddIcon } from "@chakra-ui/icons";
import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import utils from "../../config/utils";

import { ChatState } from "../../context/chatProvider";
import ChatLoading from "../Common/ChatLoading";
import GroupChatModal from "./GroupChatModal";

const MyChats = () => {
  const chatState = ChatState();

  const [loadingChats, setLoadingChats] = useState(false);
  const toast = useToast();
  const fetchChats = async () => {
    setLoadingChats(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${chatState.user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      chatState.setChats(data);
    } catch (error) {
      toast({
        status: "error",
        title: error.message,
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);
  return (
    <Box
      display={{ base: chatState.selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems={"center"}
      padding={3}
      backgroundColor="rgba(200,200,255, 0.5)"
      width={{ base: "100%", md: "35%" }}
      borderRadius="lg"
      borderWidth={"1px"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "25px", md: "25px" }}
        fontFamily="Ubuntu"
        display="flex"
        width="100%"
        justifyContent="space-between"
      >
        Recent Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "12px", md: "10px", lg: "10px" }}
            rightIcon={<AddIcon />}
            border="2px solid rgba(200,200,200,0.4)"
            backgroundColor="rgba(170,170,255, 0.3)"
          >
            New Group
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display={"flex"}
        flexDirection="column"
        padding={3}
        //backgroundColor="#e6e6e6"
        width={"100%"}
        height={"100%"}
        borderRadius="lg"
        overflowY={"hidden"}
      >
        {chatState.chats.length > 0 ? (
          //JSON.stringify(chatState.chats)
          <Stack overflowY={"scroll"}>
            {chatState.chats.map((chat) => (
              <Box
                onClick={() => {
                  chatState.setSelectedChat(chat);
                }}
                cursor="pointer"
                backgroundColor={
                  chatState.selectedChat?._id === chat._id
                    ? "rgba(1,1,1,0.8)"
                    : "rgba(200,200,230,0.8)"
                }
                color={
                  chatState.selectedChat?._id === chat._id ? "white" : "black"
                }
                paddingX={3}
                paddingY={2}
                key={chat._id}
                borderRadius="lg"
                //border={"1px solid #99d"}
                display={"flex"}
              >
                <Avatar
                  marginRight={4}
                  size="md"
                  cursor={"pointer"}
                  name={
                    chat.isGroupChat
                      ? chat.chatName
                      : utils.sender(chatState.user, chat.users)?.name
                  }
                  src={
                    chat.isGroupChat
                      ? ""
                      : utils.sender(chatState.user, chat.users)?.pic
                  }
                ></Avatar>
                <Box display={"flex"} flexDirection="column">
                  <Text>
                    {chat.isGroupChat
                      ? chat.chatName
                      : utils.sender(chatState.user, chat.users)?.name}
                  </Text>
                  <Text fontSize={"12px"}>
                    {chat.latestMessage
                      ? (chat.latestMessage.sender?._id === chatState.user._id
                          ? "You: "
                          : "") +
                        (chat.latestMessage.content &&
                          (chat.latestMessage.content?.length < 25
                            ? chat.latestMessage.content
                            : chat.latestMessage.content.substring(0, 25) +
                              "..."))
                      : "Start a new conversation"}
                  </Text>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : loadingChats ? (
          <ChatLoading />
        ) : (
          <Text margin="auto" align="center" fontSize={"20px"}>
            No Chat Found. <br />
            Search Users to start Chat
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
