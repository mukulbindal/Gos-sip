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
import currentUser from "../config/currentUser";
import { ChatState } from "../context/chatProvider";
import Logo from "../components/Common/Logo";

const HomePage = () => {
  const chatState = ChatState();
  const navigate = useNavigate();
  useEffect(() => {
    if (chatState.user) {
      navigate("/chats");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        padding={3}
        width="100%"
        margin="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        backgroundColor="white"
      >
        <Logo />
      </Box>
      <Box
        marginTop="10px"
        borderRadius="lg"
        borderWidth="1px"
        width="100%"
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
    </Container>
  );
};

export default HomePage;
