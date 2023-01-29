import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { ChatState } from "../context/chatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/Common/SideDrawer";
import MyChats from "../components/Chat/MyChats";
import ChatBox from "../components/Chat/ChatBox";
const ChatPage = () => {
  const chatState = ChatState();
  const navigate = useNavigate();
  useEffect(() => {
    if (chatState.user) {
      navigate("/chats");
    } else {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <div style={{ width: "100%" }}>
      {chatState.user && <SideDrawer />}
      <Box
        display={"flex"}
        justifyContent="space-between"
        width={"100%"}
        h="91vh"
        padding={"10px"}
      >
        {chatState.user && <MyChats />}
        {chatState.user && <ChatBox />}
      </Box>
    </div>
  );
};

export default ChatPage;
