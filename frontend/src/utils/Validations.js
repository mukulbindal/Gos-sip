import { ValidationError } from "../Errors/ValidationError";

const validateSignUp = (data) => {
  const { name, email, password, confirmPassword, image } = data;
  const errorMsg = [];
  const add = (err) => {
    errorMsg.push(err);
  };
  if (!name) {
    add("Name is empty");
  } else if (!name.trim()) {
    add("Name can not be just whitespaces");
  } else if (name.trim().length < 3) {
    add("Name should have atleast 3 characters");
  } else if (name.length > 100) {
    add("Name too large");
  }
  if (!email) {
    add("Email is empty");
  } else if (!/.+@.+\..+/.test(email)) {
    add("Invalid Email.");
  }

  if (!password) {
    add("password is empty");
  } else if (
    !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(password) ||
    password.length < 6
  ) {
    add(
      "Password should be atleast 6 character log and must contain atleast 1 lower, 1 upper, 1 digit & 1 special character"
    );
  }
  if (!confirmPassword) {
    add("confirm Password is empty");
  }
  if (password !== confirmPassword) {
    add("Passwords do not match!!");
  }

  //console.log(image);

  if (errorMsg.length === 0) return true;
  throw new ValidationError("Found Validation Errors", errorMsg);
};

const Validations = { validateSignUp };
export default Validations;
