import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { ChatState } from "../../context/chatProvider";
import ChatUser from "./ChatUser";
import UserBadgeItem from "./UserBadgeItem";
import { debounce } from "lodash";
const GroupChatModal = ({ children, mode, isAdmin, disabledMode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setgroupChatName] = useState();
  const [selectedUsers, setselectedUsers] = useState([]);
  const [search, setSearch] = useState();
  const [searchresult, setSearchresult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState({
    saveLoading: false,
    leaveLoading: false,
  });
  useEffect(() => {
    if (mode === "edit") {
      setgroupChatName(null);
      setselectedUsers(chatState.selectedChat.users);
    }
  }, [isOpen]);
  const toast = useToast();
  const chatState = ChatState();
  const delayedQuery = useCallback(
    debounce((q) => handleSearch(q), 500),
    []
  );
  const handleSearch = async (query) => {
    console.log(query);
    if (!query || query === search) {
      //setSearchresult([]);
      return;
    }
    setSearch(query);

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${chatState.user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/user?search=${query}&limit=4`,
        config
      );
      console.log(search, data);
      setSearchresult(data);
    } catch (error) {
      console.log(error);
      toast({
        status: "error",
        title: error.message,
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };
  // Need to modify
  const leaveGroupHandler = async () => {
    try {
      setButtonLoading({ ...buttonLoading, leaveLoading: true });
      const config = {
        headers: {
          Authorization: `Bearer ${chatState.user.token}`,
        },
      };

      const reqBody = {
        users: selectedUsers.filter((u) => u._id !== chatState.user._id),
        chatName: groupChatName || chatState.selectedChat.chatName,
        chatId: mode === "edit" ? chatState.selectedChat._id : null,
        leaveGroup: true,
      };

      const { data } = await axios.post(
        "/api/chat/createGroup",
        reqBody,
        config
      );

      console.log(data);
      setselectedUsers([]);
      setSearchresult([]);

      const newChats = chatState.chats.filter((c) => c._id !== data._id);

      chatState.setChats(newChats);
      chatState.setSelectedChat(null);

      onClose();
      toast({
        status: "success",
        title: `You have left the Group Successfully`,
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        status: "error",
        title: error.message,
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setButtonLoading({ ...buttonLoading, leaveLoading: false });
    }
  };
  const submitHandler = async () => {
    try {
      setButtonLoading({ ...buttonLoading, saveLoading: true });
      if (mode === "edit" && (disabledMode || !isAdmin)) {
        throw new Error("Only Admins are allowed to modify the group.");
      }
      if (mode !== "edit" && !groupChatName) {
        throw new Error("Please enter the Group Name");
      }
      if (selectedUsers.length < 2) {
        throw new Error("Please select atleast 2 users to create the group");
      }
      const config = {
        headers: {
          Authorization: `Bearer ${chatState.user.token}`,
        },
      };

      const reqBody = {
        users: selectedUsers,
        chatName: groupChatName || chatState.selectedChat.chatName,
        chatId: mode === "edit" ? chatState.selectedChat._id : null,
      };

      const { data } = await axios.post(
        "/api/chat/createGroup",
        reqBody,
        config
      );

      console.log(data);
      setselectedUsers([]);
      setSearchresult([]);

      if (!chatState.chats?.find((c) => c._id === data._id)) {
        chatState.setChats([data, ...chatState.chats]);
      } else {
        const newChats = chatState.chats.filter((c) => c._id !== data._id);
        if (data.users.find((u) => u._id === chatState.user._id)) {
          chatState.setChats([data, ...newChats]);
          chatState.setSelectedChat(data);
        } else {
          chatState.setChats(newChats);
          chatState.setSelectedChat(null);
        }
      }

      onClose();
      toast({
        status: "success",
        title: `Group ${mode === "edit" ? "Modified" : "Created"} Successfully`,
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        status: "error",
        title: error.message,
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setButtonLoading({ ...buttonLoading, saveLoading: false });
    }
  };
  const handleGroup = (user) => {
    if (disabledMode) return;
    try {
      if (selectedUsers.filter((su) => su._id === user._id).length === 0) {
        setselectedUsers([...selectedUsers, user]);
      }
    } catch (error) {}
  };
  const handleDelete = (user) => {
    if (disabledMode) return;
    setselectedUsers(selectedUsers.filter((u) => u._id !== user._id));
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={"flex"} justifyContent="center">
            {mode === "edit"
              ? chatState.selectedChat.chatName
              : "Create New Group Chat"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection="column"
            alignItems={"center"}
          >
            <FormControl isRequired>
              <Input
                placeholder={mode === "edit" ? "New Group Name" : "Group Name"}
                disabled={disabledMode}
                display={disabledMode ? "none" : "block"}
                margin={1}
                onChange={(e) => {
                  setgroupChatName(e.target.value);
                }}
              ></Input>
            </FormControl>
            <FormControl isRequired>
              <Input
                placeholder="Add users eg: John, Kabir..."
                disabled={disabledMode}
                margin={1}
                display={disabledMode ? "none" : "block"}
                onKeyUp={(e) => {
                  delayedQuery(e.target.value);
                }}
              ></Input>
            </FormControl>
            <Box display={"flex"} alignItems="center" flexWrap={"wrap"}>
              {selectedUsers.map((user) => {
                return (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handler={() => handleDelete(user)}
                  />
                );
              })}
            </Box>
            {loading
              ? "Loading"
              : searchresult?.map((user) => {
                  return (
                    <ChatUser
                      user={user}
                      handler={handleGroup}
                      key={user._id}
                    />
                  );
                })}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={submitHandler}
              margin="auto"
              isLoading={buttonLoading.saveLoading}
              display={disabledMode ? "none" : "block"}
            >
              {mode === "edit" ? "Save" : "Create"}
            </Button>
            <Button
              colorScheme="red"
              onClick={leaveGroupHandler}
              margin="auto"
              isLoading={buttonLoading.leaveLoading}
              display={mode === "edit" ? "block" : "none"}
            >
              {mode === "edit" ? "Leave Group" : ""}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
