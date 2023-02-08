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
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import urls from "../../config/urls";
import setCurrentUser from "../../config/setCurrentUser";
import { ChatState } from "../../context/chatProvider";
import { ValidationError } from "../../Errors/ValidationError";
import Validations from "../../utils/Validations";
import { set } from "lodash";
import GoogleAuth from "./GoogleAuth";

const Signup = () => {
  // Contexts
  const chatState = ChatState();

  // States
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

  // Hooks
  const toast = useToast();
  const navigate = useNavigate();

  // Handler Functions
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

  const reset = () => {
    setName();
    setEmail();
    setImage();
    setPassword();
    setConfirmPassword();
  };
  /* arg: image is a File object*/
  const imageHandler = async (image) => {
    setLoadImage(true);
    try {
      buttonTexts.imageUpload = "Uploading";
      buttonTexts.imageColor = "#449";
      setbuttonTexts(buttonTexts);

      const reader = new FileReader();
      reader.readAsDataURL(image);
      // When image loads into base64, executes onload function
      reader.onload = () => {
        try {
          // Do not allow large image files, it can cause performance issues later
          if (image.size > 1024 * 1024) {
            throw new Error("Photo size should be less than 1 MB");
          }
          setImage(reader.result);
          buttonTexts.imageUpload = "Uploaded";
          buttonTexts.imageColor = "#494";
          setbuttonTexts(buttonTexts);
          setLoadImage(false);
        } catch (error) {
          console.log(error);
          buttonTexts.imageUpload = "Failed";
          buttonTexts.imageColor = "#944";
          setImage("");
          toast({
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "bottom",
            title: error.message,
          });
          setbuttonTexts(buttonTexts);
          setLoadImage(false);
        }
      };

      // If any error during base64 conversion, fires onerror
      reader.onerror = () => {
        buttonTexts.imageUpload = "Failed";
        buttonTexts.imageColor = "#944";
        setbuttonTexts(buttonTexts);
        setLoadImage(false);
        setImage("");
      };
    } catch (e) {
      buttonTexts.imageUpload = "Failed";
      buttonTexts.imageColor = "#944";
      setbuttonTexts(buttonTexts);
      setLoadImage(false);
      setImage("");
    }
  };
  const flip = () => {
    setShow(!show);
  };

  // A simple but weird function to update the states of submit button
  // Better way is using the expandor (...Object)
  const updateSubmit = (newState) => {
    for (let key in submitButton) {
      submitButton[key] =
        newState[key] === undefined ? submitButton[key] : newState[key];
    }
    setsubmitButton(submitButton);
  };
  const submitHandler = async (e) => {
    try {
      updateSubmit({
        isLoading: true,
        loadingText: "Validating...",
      });

      // Validate the inputs. If invalid, it throws error
      Validations.validateSignUp({
        name,
        email,
        password,
        confirmPassword,
        image,
      });

      toast({
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
        title: "Validated Successfully",
      });

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `/api/user/register`,
        { name, email, password, pic: image },
        config
      );

      toast({
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
        title: "Registered Successfully",
      });
      // @todo - can create a useEffect and change the localStorage
      // whenever our chatState.user changes.
      const user = setCurrentUser(data);
      chatState.setUser(user);
      // reset the form
      reset();
      navigate("/chats");
    } catch (e) {
      const errorMsg = [];
      if (e instanceof AxiosError) errorMsg.push(e.response.data.message);
      errorMsg.push(e.message);
      if (e instanceof ValidationError) {
        e.errors.forEach((msg) => errorMsg.push(msg));
      }

      for (let i in errorMsg) {
        toast({
          status: "error",
          duration: 3000 + i * 1000,
          isClosable: true,
          position: "bottom",
          title: errorMsg[i],
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
      <GoogleAuth id="signUpBox" label="signup_with" />
      <FormControl id="user-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          onChange={(e) => {
            nameHandler(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              document.getElementById("email").focus();
            }
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
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              document.getElementById("password").focus();
            }
          }}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <Tooltip
          label="Password Must be: 6 characters long, Must have atleast 1 digit, 1 lowercase, 1 uppercase and 1 special character"
          hasArrow
          placement="auto"
        >
          <InputGroup>
            <Input
              type="password"
              onChange={(e) => {
                passwordHandler(e.target.value);
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  document.getElementById("confirm-password").focus();
                }
              }}
            />
            <InputRightElement></InputRightElement>
          </InputGroup>
        </Tooltip>
      </FormControl>

      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            onChange={(e) => {
              confirmPasswordHandler(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                document.getElementById("photo").focus();
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

      <FormControl id="photo">
        <FormLabel>Upload your Photo</FormLabel>
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
