import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { ChatState } from "../../context/chatProvider";
import removeUser from "../../config/removeUser";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import ChatUser from "../Chat/ChatUser";
import { debounce } from "lodash";
import Logo from "./Logo";
const SideDrawer = () => {
  // Context
  const chatState = ChatState();
  // State
  const [search, setsearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  // Hooks
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  // Reactions
  useEffect(() => {
    if (!search) {
      setSearchResult([]);
    }
  }, [search]);
  // Handlers

  const logoutHandler = () => {
    removeUser();
    chatState.setUser(null);
    chatState.setSelectedChat(null);
    chatState.setChats([]);
    navigate("/");
  };

  const delayedQuery = useCallback(
    debounce((q) => handleSearch(q), 500),
    []
  );

  /** args: query is the text to search and button is flag if search button was clicked*/
  const handleSearch = async (query, button) => {
    try {
      if ((!query || query === search) && !button) return;

      setSearchResult([]);
      setLoading(true);

      // To handle what happens if nothing is entered and button is pressed
      // Or onchange of search box text
      if ((!query || !query.trim()) && (!search || !search.trim())) {
        if (button) throw new Error("Please enter something to search");
        else return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${chatState.user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/user?search=${query.trim() || search.trim()}`,
        config
      );

      if (data.length === 0) {
        throw new Error("No user found!");
      }

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        status: "error",
        title: error.message,
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // To create or open chat when clicked the searched user
  const chatHandler = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${chatState.user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);

      // If this chat is not present in current chats, add it
      if (
        !chatState.chats?.find((c) => {
          return c._id === data._id;
        })
      ) {
        chatState.setChats([data, ...chatState.chats]);
      }

      // Set selected chat to current chat
      chatState.setSelectedChat(data);

      // Clear the search results.
      setsearch();
      setSearchResult([]);
    } catch (error) {
      toast({
        status: "error",
        title: error.message,
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setLoadingChat(false);
      onClose();
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        width="100%"
        padding="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users" hasArrow placement="auto">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search
            </Text>
          </Button>
        </Tooltip>

        <Logo />

        <div>
          <Menu>
            <MenuButton padding={1}>
              {/* @todo: Notification icon */}
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList>
              <Text padding={"3%"} fontSize="sm">
                Please verify your email.
              </Text>
              <Text padding={"3%"} fontSize="sm">
                You have some unread notifications
              </Text>
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={chatState.user.name}
                src={`/api/user/image/${chatState.user._id}`}
              />
            </MenuButton>
            <MenuList margin={2}>
              <ProfileModal user={chatState.user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      {/** Side Drawer */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={2}>Search Users</DrawerHeader>

          <DrawerBody>
            <Box display="flex" paddingBottom={2}>
              <Input
                placeholder="Search by name or email"
                marginRight={2}
                value={search}
                onChange={(e) => {
                  setsearch(e.target.value);
                  delayedQuery(e.target.value);
                }}
              />
              <Button
                onClick={() => {
                  handleSearch(search, true);
                }}
              >
                <SearchIcon></SearchIcon>
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => {
                return (
                  <ChatUser
                    key={user._id}
                    user={user}
                    handler={() => {
                      chatHandler(user._id);
                    }}
                  />
                );
              })
            )}

            {loadingChat && <Spinner margin={"auto"} display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
