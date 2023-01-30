import { CloseIcon } from "@chakra-ui/icons";
import { Badge, Box, Stack, Text, Tooltip } from "@chakra-ui/react";
import React from "react";
import ProfileModal from "../Common/ProfileModal";

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
      <ProfileModal user={user}>
        <Tooltip label="View Profile" hasArrow placement="auto">
          <Text cursor={"pointer"}>{user.name}</Text>
        </Tooltip>
      </ProfileModal>{" "}
      <CloseIcon
        onClick={() => {
          handler(user);
        }}
        paddingLeft={1}
        cursor="pointer"
        margin={"auto"}
      />
    </Box>
  );
};

export default UserBadgeItem;
