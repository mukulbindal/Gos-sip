import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ViewIcon, CloseIcon } from "@chakra-ui/icons";
import React from "react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <span>
          <IconButton
            d={{ base: "flex" }}
            icon={<ViewIcon />}
            onClick={onOpen}
          />
        </span>
      )}

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px" display="flex" flexDir="column">
          {/* <ModalCloseButton /> */}
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <ModalHeader fontSize="40px" fontFamily="Ubuntu">
              {user.name}
            </ModalHeader>
            <Image
              borderRadius="full"
              boxSize="150px"
              src={`/api/user/image/${user._id}`}
              fallbackSrc="./assets/images/default_user.webp"
              alt={user.name}
            />
            {/* Need to work @todo */}
            <Text fontSize={{ base: "20px", md: "22px" }} fontFamily="Ubuntu">
              Email: {user.email}
            </Text>
            <Button
              colorScheme="red"
              onClick={onClose}
              borderRadius="100%"
              padding={2}
              marginBottom={4}
            >
              <CloseIcon />
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
