import React, { useEffect } from "react";
import {
  Box,
  Container,
  Tab,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  TabList,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";

import { ChatState } from "../context/chatProvider";
import Logo from "../components/Common/Logo";

const HomePage = () => {
  // context
  const chatState = ChatState();

  //Hooks
  const navigate = useNavigate();

  // Reactions
  useEffect(() => {
    if (chatState.user) {
      navigate("/chats");
    }
  }, [chatState.user]);

  return (
    <Box
      width={"100%"}
      display={{ base: "block", md: "block", lg: "flex" }}
      justifyContent={"center"}
    >
      <Box
        width={{ base: "100%", md: "100%", lg: "50%" }}
        display="flex"
        justifyContent="center"
      >
        <Box
          display={"flex"}
          height={{ base: "95%", md: "90%", lg: "70%" }}
          width={{ base: "95%", md: "90%", lg: "70%" }}
          backgroundColor="white"
          border={{
            base: "0px",
            md: "0px",
            lg: "0",
          }}
          justifyContent="center"
          margin={{ base: "1%", md: "1%", lg: "auto" }}
          borderRadius={{ base: "lg", md: "lg", lg: "xl" }}
          paddingLeft={{ lg: "10%" }}
          paddingRight={{ lg: "10%" }}
          transform={{ lg: "rotate(-45deg)" }}
          shadow={{ lg: "3px 8px 8px rgba(13, 64, 159, 0.8)" }}
        >
          <Logo
            myTransform={{ lg: "rotate(35deg)" }}
            imageSize={{ base: "30px", md: "37px", lg: "68px" }}
            myFontSize={{ base: "35px", md: "40px", lg: "90px" }}
          />
        </Box>
      </Box>
      <Box
        width={{ base: "95%", md: "90%", lg: "50%" }}
        marginLeft={{ base: "auto", md: "auto", lg: "3%" }}
        marginRight={{ base: "auto", md: "auto", lg: "3%" }}
        marginTop={{ base: "1%", md: "1%", lg: "1%" }}
        marginBottom={{ base: "1%", md: "10%", lg: "6%" }}
        padding={"2%"}
        borderRadius="lg"
        borderWidth="1px"
        backgroundColor="white"
      >
        <Tabs size="md" variant="enclosed">
          <TabList>
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>

            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default HomePage;
