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
import React, { useState } from "react";
import { ChatState } from "../../context/chatProvider";
import ChatUser from "./ChatUser";
import UserBadgeItem from "./UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setgroupChatName] = useState();
  const [selectedUsers, setselectedUsers] = useState([]);
  const [search, setSearch] = useState();
  const [searchresult, setSearchresult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const chatState = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    console.log(query);
    if (!query) {
      //setSearchresult([]);
      return;
    }
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
      //console.log(data);
      setSearchresult(data);
    } catch (error) {
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
  const submitHandler = async () => {
    try {
      if (!groupChatName) {
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
        chatName: groupChatName,
      };

      const { data } = await axios.post(
        "/api/chat/createGroup",
        reqBody,
        config
      );

      console.log(data);
      setselectedUsers([]);
      setSearchresult([]);
      if (
        !chatState.chats?.find((c) => {
          return c._id === data._id;
        })
      ) {
        chatState.setChats([data, ...chatState.chats]);
      }
      chatState.setSelectedChat(data);
      onClose();
      toast({
        status: "success",
        title: "Group Created Successfully",
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
    }
  };
  const handleGroup = (user) => {
    try {
      if (selectedUsers.filter((su) => su._id === user._id).length === 0) {
        setselectedUsers([...selectedUsers, user]);
      }
    } catch (error) {}
  };
  const handleDelete = (user) => {
    setselectedUsers(selectedUsers.filter((u) => u._id !== user._id));
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={"flex"} justifyContent="center">
            Create New Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection="column"
            alignItems={"center"}
          >
            <FormControl isRequired>
              <Input
                placeholder="Group Name"
                margin={1}
                onChange={(e) => {
                  setgroupChatName(e.target.value);
                }}
              ></Input>
            </FormControl>
            <FormControl isRequired>
              <Input
                placeholder="Add users eg: John, Kabir..."
                margin={1}
                onKeyUp={(e) => {
                  handleSearch(e.target.value);
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
            <Button colorScheme="blue" onClick={submitHandler} margin="auto">
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
