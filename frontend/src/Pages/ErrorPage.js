import { Box, Text } from "@chakra-ui/react";
import React from "react";

const ErrorPage = () => {
  return (
    <Box
      height={"100vh"}
      width="100%"
      backgroundColor={"white"}
      display="flex"
      flexDirection={"column"}
    >
      <Text
        color="red"
        fontFamily={"Ubuntu"}
        fontSize="70px"
        textAlign={"center"}
        margin="auto"
      >
        {"😢{404}"}
        <br />
        {"Not Found"}
      </Text>
    </Box>
  );
};

export default ErrorPage;
