import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [nickName, setNickName] = useState();
  const [show, setShow] = useState(false);
  const [image, setImage] = useState();
  const nameHandler = (name) => {
    setName(name);
  };
  const emailHandler = (email) => {
    setEmail(email);
  };

  const passwordHandler = (password) => {
    setPassword(password);
  };

  const confirmPasswordHandler = (password) => {
    setConfirmPassword(password);
  };

  const nickNameHandler = (nickName) => {
    setNickName(nickName);
  };

  const imageHandler = (image) => {
    setImage(image);
  };
  const flip = () => {
    setShow(!show);
  };

  const submitHandler = (e) => {};

  return (
    <VStack
      divider={<StackDivider borderColor="gray.200" />}
      spacing={2}
      align="stretch"
    >
      <FormControl id="user-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          onChange={(e) => {
            nameHandler(e.target.value);
          }}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email address</FormLabel>
        <Input
          type="email"
          onChange={(e) => {
            emailHandler(e.target.value);
          }}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type="password"
            onChange={(e) => {
              passwordHandler(e.target.value);
            }}
          />
          <InputRightElement></InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            onChange={(e) => {
              confirmPasswordHandler(e.target.value);
            }}
          />
          <InputRightElement>
            <Button padding={0} height="0px" marginRight="20px" onClick={flip}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="photo">
        <FormLabel>Upload your display picture</FormLabel>
        <Input
          type="file"
          accept="image/jpeg,image/png,image/gif"
          onChange={(e) => {
            imageHandler(e.target.files[0]);
          }}
        />
      </FormControl>

      <FormControl>
        <Input
          type="submit"
          value="Sign Up!"
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

export default Signup;
