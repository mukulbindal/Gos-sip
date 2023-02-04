import { Box, Image, Text } from "@chakra-ui/react";
import React from "react";
import "../../styles/logo.css";
const Logo = () => {
  return (
    <Box display={"flex"} alignItems="center">
      <Text className="cover">{"["}</Text>
      <Image
        src="/assets/images/owl.png"
        borderRadius="full"
        boxSize="35px"
        margin={"auto"}
      />
      <Text className="cover">{"]"}</Text>
      <Text
        className="logo"
        fontSize="3xl"
        fontFamily="Broadway, Ubuntu"
        marginLeft={"50px"}
        fontWeight="extrabold"
      >
        OWL BOX
      </Text>
    </Box>
  );
};

export default Logo;
