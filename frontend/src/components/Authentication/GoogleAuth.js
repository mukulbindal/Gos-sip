import { Box, Spinner, Text, Toast, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import secrets from "../../config/secrets";
import jwt_decode from "jwt-decode";
import axios, { AxiosError } from "axios";
import setCurrentUser from "../../config/setCurrentUser";
import { ChatState } from "../../context/chatProvider";
import { useNavigate } from "react-router-dom";

//var google;
const GoogleAuth = ({ id, label, handler }) => {
  //context
  const chatState = ChatState();
  //hooks
  const toast = useToast();
  const navigate = useNavigate();
  // states
  const [loggingIn, setloggingIn] = useState(false);
  const handleGoogleSignIn = async (response) => {
    try {
      setloggingIn(true);
      let token = response.credential;
      let userObject = jwt_decode(token);

      const userData = {
        name: userObject.name,
        email: userObject.email,
        verified: userObject.email_verified,
        pic: userObject.picture,
      };

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `/api/user/googleSignIn`,
        userData,
        config
      );
      toast({
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
        title: "Signed In Succesfully",
      });
      // @todo - can create a useEffect and change the localStorage
      // whenever our chatState.user changes.
      const user = setCurrentUser(data);
      chatState.setUser(user);
      navigate("/chats");
    } catch (e) {
      toast({
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
        title: e.message,
      });
    } finally {
      setloggingIn(false);
    }
  };
  const loadGoogleButton = async () => {};
  useEffect(() => {
    /**Global Google Account signInBox*/

    window.google.accounts.id.initialize({
      client_id: secrets.web.client_id,
      callback: handleGoogleSignIn,
    });

    window.google.accounts.id.renderButton(document.getElementById(id), {
      theme: "outline",
      size: "large",
      text: label,
      shape: "pill",
    });
  }, []);
  return (
    <Box display={"flex"} justifyContent="center" flexDirection={"column"}>
      <Box id={id} display={"flex"} justifyContent="center"></Box>
      {loggingIn && (
        <Spinner
          marginLeft={"auto"}
          marginRight="auto"
          marginTop="2%"
        ></Spinner>
      )}
      <Text textAlign={"center"} marginTop="2%">
        OR
      </Text>
    </Box>
  );
};

export default GoogleAuth;
