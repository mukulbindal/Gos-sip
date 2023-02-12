import {
  Box,
  Button,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import utils from "../../config/utils";
import axios from "axios";
import { ChatState } from "../../context/chatProvider";

const ProfileModal = ({ user, children, editable = false }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [uploading, setUploading] = useState(false);
  const [refreshImage, setRefreshImage] = useState(1);
  const [imageURL, setImageURL] = useState(
    `/api/user/image/${user._id}?${Date.now()}`
  );
  const toast = useToast();
  const chatState = ChatState();
  const updateImage = async (image) => {
    try {
      setUploading(true);
      const reader = new FileReader();
      reader.readAsDataURL(image);
      // When image loads into base64, executes onload function
      reader.onload = async () => {
        try {
          // Do not allow large image files, it can cause performance issues later
          if (image.size > 1024 * 1024) {
            throw new Error("Photo size should be less than 1 MB");
          }
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${chatState.user.token}`,
            },
          };
          const { data } = await axios.patch(
            "/api/user/image/update",
            { pic: reader.result },
            config
          );
          console.log(data);
          //setRefreshImage(Date.now());
          chatState.setUser({ ...chatState.user, _id: data._id });
          setImageURL(`/api/user/image/${chatState.user._id}?${Date.now()}`);
          setUploading(false);
        } catch (error) {
          toast({
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "bottom",
            title: error.message,
          });
          setUploading(false);
        }
      };

      // If any error during base64 conversion, fires onerror
      reader.onerror = () => {
        setUploading(false);
      };
    } catch (error) {
    } finally {
      setUploading(false);
    }
  };
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
            <Box display={"flex"}>
              <Image
                borderRadius="full"
                boxSize="150px"
                src={imageURL}
                fallbackSrc="./assets/images/default_user.webp"
                alt={user.name}
                display="block"
                key={refreshImage}
              />
              {editable && (
                <>
                  {uploading ? (
                    <Spinner
                      position="relative"
                      left={"-28px"}
                      top={"112px"}
                      backgroundColor="white"
                    ></Spinner>
                  ) : (
                    <IconButton
                      borderRadius={"full"}
                      background="white"
                      borderWidth={"1px"}
                      left={"-38px"}
                      top={"106px"}
                      onClick={(e) => {
                        document.querySelector("#updateImage").click();
                      }}
                    >
                      <EditIcon></EditIcon>
                    </IconButton>
                  )}
                  <Input
                    id="updateImage"
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    display={"none"}
                    onChange={(e) => {
                      updateImage(e.target.files[0]);
                    }}
                  />
                </>
              )}
            </Box>

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
