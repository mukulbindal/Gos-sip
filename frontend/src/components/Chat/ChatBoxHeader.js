import { ArrowBackIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import { Avatar, Box, IconButton, Text } from "@chakra-ui/react";
import React from "react";

import utils from "../../config/utils";
import { ChatState } from "../../context/chatProvider";
import ProfileModal from "../Common/ProfileModal";
import GroupChatModal from "./GroupChatModal";

const ChatBoxHeader = () => {
  const chatState = ChatState();
  return (
    chatState.selectedChat && (
      <Box
        display={"flex"}
        alignItems="center"
        backgroundColor="rgba(200,200,230,0.8)"
        width="100%"
        padding={"10px"}
        borderTopLeftRadius="lg"
        borderTopRightRadius={"lg"}
        borderBottom={"1px solid #999"}
        borderBottomWidth="30%"
      >
        <IconButton
          borderRadius={"full"}
          backgroundColor="rgba(0,0,0,0)"
          display={{
            base: "block",
            md: "none",
          }}
          onClick={() => {
            chatState.setSelectedChat(null);
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Avatar
          size="md"
          cursor={"pointer"}
          name={
            chatState.selectedChat.isGroupChat
              ? chatState.selectedChat.chatName
              : utils.sender(chatState.user, chatState.selectedChat.users)?.name
          }
          src={
            chatState.selectedChat.isGroupChat
              ? ""
              : `/api/user/image/${
                  utils.sender(chatState.user, chatState.selectedChat.users)
                    ?._id
                }`
          }
          border="1px solid #7a7"
        />
        <Text margin={"auto"} fontSize="25px">
          {chatState.selectedChat.isGroupChat
            ? chatState.selectedChat.chatName
            : utils.sender(chatState.user, chatState.selectedChat.users)?.name}
        </Text>
        {chatState.selectedChat.isGroupChat ? (
          <GroupChatModal
            mode="edit"
            isAdmin={
              chatState.user._id === chatState.selectedChat.groupAdmin._id
            }
            disabledMode={
              chatState.user._id !== chatState.selectedChat.groupAdmin._id
            }
          >
            <IconButton borderRadius={"full"} backgroundColor="#eee">
              <EditIcon />
            </IconButton>
          </GroupChatModal>
        ) : (
          <ProfileModal
            user={utils.sender(chatState.user, chatState.selectedChat.users)}
          >
            <IconButton borderRadius={"full"} backgroundColor="#eee">
              <ViewIcon />
            </IconButton>
          </ProfileModal>
        )}
      </Box>
    )
  );
};

export default ChatBoxHeader;
