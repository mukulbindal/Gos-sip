import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/chatProvider";
import Messages from "./Messages";

const ChatBoxBody = () => {
  const chatState = ChatState();
  const [message, setMessage] = useState("");
  const [loadingStates, setLoadingStates] = useState({ msgLoading: false });
  const [messageList, setMessageList] = useState([]);
  const messageInputHandler = async (msg) => {
    setMessage(msg);
    //console.log(msg);
  };

  const toast = useToast();
  useEffect(() => {
    fetchMessages();
  }, [chatState.selectedChat]);
  const fetchMessages = async () => {
    try {
      setLoadingStates({ ...loadingStates, msgLoading: true });
      setMessageList([]);
      const config = {
        headers: {
          Authorization: `Bearer ${chatState.user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/message/${chatState.selectedChat._id}`,
        config
      );
      setMessageList(data);
    } catch (error) {
      toast({
        status: "error",
        title: error.message,
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoadingStates({ ...loadingStates, msgLoading: false });
    }
  };
  const handleSend = async (msg) => {
    if (!msg) {
      msg = message;
    }

    try {
      if (!msg || !msg.trim()) {
        throw new Error("Please enter the message first");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${chatState.user.token}`,
        },
      };
      const reqBody = {
        content: msg,
        sender: chatState.user._id,
        chat: chatState.selectedChat._id,
      };

      const { data } = await axios.post("/api/message/send", reqBody, config);
      setMessageList([...messageList, data]);
      console.log(data);
    } catch (error) {
      toast({
        status: "error",
        title: error.message,
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setMessage("");
    }
  };
  return (
    <Box height={"90%"} position="relative">
      <Messages
        messageList={messageList}
        messagesLoading={loadingStates.msgLoading}
      />
      <FormControl
        position="absolute"
        bottom="1%"
        display={"flex"}
        paddingLeft="2%"
        paddingRight={"2%"}
      >
        <Input
          placeholder="Type a message..."
          backgroundColor="white"
          value={message}
          onChange={(e) => {
            messageInputHandler(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSend(e.target.value);
            }
          }}
        />
        <IconButton
          backgroundColor={"whatsapp.500"}
          color="white"
          borderRadius={"full"}
          _hover={{ color: "whatsapp.500", backgroundColor: "#e8e8e8" }}
          onClick={() => {
            handleSend();
          }}
        >
          <i className="fa-solid fa-paper-plane"></i>
        </IconButton>
      </FormControl>
    </Box>
  );
};

export default ChatBoxBody;
