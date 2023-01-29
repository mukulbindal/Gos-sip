import { CloseIcon } from "@chakra-ui/icons";
import { Badge, Box, Stack, Text } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handler }) => {
  return (
    <Box
      paddingX={2}
      paddingY={1}
      fontSize={12}
      margin={1}
      marginBottom={2}
      display="flex"
      backgroundColor="rgba(180, 180, 220, 0.7)"
      borderRadius="lg"
    >
      <Text>
        {user.name}{" "}
        <CloseIcon
          onClick={() => {
            handler(user);
          }}
          paddingLeft={1}
          cursor="pointer"
        />
      </Text>
    </Box>
  );
};

export default UserBadgeItem;
