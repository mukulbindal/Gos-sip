import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

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

  const submitHandler = (e) => {};

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
        <Input
          type="submit"
          value="Login"
          color="white"
          backgroundColor="#449"
          onSubmit={(e) => {
            submitHandler(e);
          }}
        />
      </FormControl>
    </VStack>
  );
};

export default Login;
