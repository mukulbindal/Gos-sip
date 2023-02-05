import { Box, Image, Text } from "@chakra-ui/react";
import React from "react";
import "../../styles/logo.css";
const Logo = ({ imageSize, myFontSize, myTransform }) => {
  return (
    <Box display={"flex"} alignItems="center" transform={myTransform}>
      <Text className="cover" fontSize={myFontSize}>
        {"["}
      </Text>
      <Image
        src="/assets/images/owl.png"
        borderRadius="full"
        boxSize={imageSize || "35px"}
        margin={"auto"}
      />
      <Text className="cover" fontSize={myFontSize}>
        {"]"}
      </Text>
      <Text
        className="logo"
        fontSize={myFontSize || "3xl"}
        fontFamily="Broadway, Ubuntu"
        marginLeft={"50px"}
        fontWeight="extrabold"
      >
        {" "}
        OWL BOX
      </Text>
    </Box>
  );
};

export default Logo;
