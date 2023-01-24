import React from "react";
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
const HomePage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        padding={3}
        backgroundColor="#d2d"
        width="100%"
        margin="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="3xl" color="White" fontWeight="600">
          Gos-sip
        </Text>
      </Box>
      <Box marginTop="10px" borderRadius="lg" borderWidth="1px" width="100%">
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
