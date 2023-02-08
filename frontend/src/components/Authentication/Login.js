import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  StackDivider,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import urls from "../../config/urls";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../context/chatProvider";
import setCurrentUser from "../../config/setCurrentUser";
import GoogleAuth from "./GoogleAuth";

const Login = () => {
  // Context
  const chatState = ChatState();

  // States
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);

  //Hooks
  const toast = useToast();
  const navigate = useNavigate();

  // Handlers
  const emailHandler = (email) => {
    setEmail(email);
  };

  const passwordHandler = (password) => {
    setPassword(password);
  };

  const flip = () => {
    setShow(!show);
  };

  const submitHandler = async (e) => {
    let errorMsg = [];
    try {
      if (!email || !email.trim()) {
        errorMsg.push("Email is empty");
      }
      if (!password || !password.trim()) {
        errorMsg.push("password is empty");
      }

      if (errorMsg.length > 0) {
        throw new Error();
      } else {
        toast({
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom",
          title: "Validated Successfully",
        });
      }

      // Call the auth API
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `/api/user/auth`,
        { email, password },
        config
      );

      toast({
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
        title: "Logged in Successfully",
      });
      const user = setCurrentUser(data);
      chatState.setUser(user);
      navigate("/chats");
    } catch (e) {
      if (e.name === "AxiosError") errorMsg.push(e?.response?.data?.message);
      for (let errorM of errorMsg) {
        toast({
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
          title: errorM,
        });
      }
    } finally {
    }
  };

  return (
    <VStack
      divider={<StackDivider borderColor="gray.200" />}
      spacing={3}
      align="stretch"
    >
      <GoogleAuth id="signInBox" label="signin_with" />
      <FormControl id="login-email" isRequired>
        <FormLabel>Enter your Email / Username</FormLabel>
        <Input
          type="text"
          onChange={(e) => {
            emailHandler(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              document.getElementById("login-password").focus();
            }
          }}
        />
      </FormControl>

      <FormControl id="login-password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            onChange={(e) => {
              passwordHandler(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                submitHandler(e);
              }
            }}
          />
          <InputRightElement>
            <Button padding={0} height="0px" marginRight="20px" onClick={flip}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl>
        <Button
          type="submit"
          value="Login"
          color="white"
          backgroundColor="#449"
          onClick={(e) => {
            submitHandler(e);
          }}
          width="100%"
        >
          Login
        </Button>
      </FormControl>
    </VStack>
  );
};

export default Login;
