import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import currentUser from "../config/currentUser";
import { ChatState } from "../context/chatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/Common/SideDrawer";
const ChatPage = () => {
  //const { user } = ChatState();
  const user = currentUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/chats");
    } else {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box></Box>
    </div>
  );
};

export default ChatPage;
