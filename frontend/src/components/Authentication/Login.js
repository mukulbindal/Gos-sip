import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  StackDivider,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import urls from "../../config/urls";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../context/chatProvider";
const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { user, setUser } = ChatState();
  const [show, setShow] = useState(false);

  const emailHandler = (email) => {
    setEmail(email);
  };

  const passwordHandler = (password) => {
    setPassword(password);
  };

  const flip = () => {
    setShow(!show);
  };
  const toast = useToast();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    let errorMsg = [];
    try {
      //console.log(submitButton);

      //console.log(submitButton);
      //await timeout(5000);

      if (!email) {
        errorMsg.push("Email is empty");
      }
      if (!password) {
        errorMsg.push("password is empty");
      }

      //console.log(errorMsg);
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
      // start the submit logic

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${urls.CHAT_HOST}/api/user/auth`,
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

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      navigate("/chats");
    } catch (e) {
      //console.log(e);
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
      <FormControl id="email" isRequired>
        <FormLabel>Enter your Email / Username</FormLabel>
        <Input
          type="text"
          onChange={(e) => {
            emailHandler(e.target.value);
          }}
        />
      </FormControl>

      <FormControl id="confirm-password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            onChange={(e) => {
              passwordHandler(e.target.value);
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
