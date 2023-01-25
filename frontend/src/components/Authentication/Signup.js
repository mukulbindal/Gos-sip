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
import React, { useState } from "react";
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [show, setShow] = useState(false);
  const [image, setImage] = useState();
  const [loadImage, setLoadImage] = useState(false);
  const [submitButton, setsubmitButton] = useState({
    isLoading: false,
    loadingText: "",
    buttonText: "Sign Up!",
    bgColor: "#449",
  });
  const [buttonTexts, setbuttonTexts] = useState({
    imageUpload: "",
    imageColor: "",
  });
  const toast = useToast();
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

  const imageHandler = async (image) => {
    setLoadImage(true);
    try {
      buttonTexts.imageUpload = "Uploading";
      buttonTexts.imageColor = "#449";
      setbuttonTexts(buttonTexts);
      setImage(image);
      // To be removed
      await timeout(5000);
      //if (image) throw new Error();
      buttonTexts.imageUpload = "Uploaded";
      buttonTexts.imageColor = "#494";
      setbuttonTexts(buttonTexts);
      setLoadImage(false);
    } catch (e) {
      buttonTexts.imageUpload = "Failed";
      buttonTexts.imageColor = "#944";
      setbuttonTexts(buttonTexts);
      setLoadImage(false);
    }
  };
  const flip = () => {
    setShow(!show);
  };
  const updateSubmit = (newState) => {
    console.log(newState, submitButton);
    for (let key in submitButton) {
      submitButton[key] =
        newState[key] === undefined ? submitButton[key] : newState[key];
    }
    console.log(newState, submitButton);
    setsubmitButton(submitButton);
  };
  const submitHandler = async (e) => {
    let errorMsg = [];
    try {
      //console.log(submitButton);

      updateSubmit({
        isLoading: true,
        loadingText: "Validating...",
      });
      //console.log(submitButton);
      //await timeout(5000);

      if (!name) {
        errorMsg.push("Name is empty");
      }
      if (!email) {
        errorMsg.push("Email is empty");
      }
      if (!password) {
        errorMsg.push("password is empty");
      }
      if (!confirmPassword) {
        errorMsg.push("confirm Password is empty");
      }
      if (password !== confirmPassword) {
        errorMsg.push("Passwords do not match!!");
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
    } catch (e) {
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
      updateSubmit({
        isLoading: false,
      });
    }
  };

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
        <InputGroup>
          <Input
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={(e) => {
              imageHandler(e.target.files[0]);
            }}
          />
          <InputRightElement>
            <Button
              backgroundColor={buttonTexts.imageColor}
              fontSize="8px"
              color={"white"}
              width="20em"
              height="4em"
              marginRight="40px"
              isLoading={loadImage}
              disabled="true"
              variant="ghost"
              //loadingText={buttonTexts.imageUpload}
            >
              {buttonTexts.imageUpload}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl>
        <Button
          type="submit"
          color="white"
          width="100%"
          backgroundColor={submitButton.bgColor}
          isLoading={submitButton.isLoading}
          loadingText={submitButton.loadingText}
          onClick={(e) => {
            submitHandler(e);
          }}
        >
          {submitButton.buttonText}
        </Button>
      </FormControl>
    </VStack>
  );
};

export default Signup;
