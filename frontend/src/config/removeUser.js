import { ChatState } from "../context/chatProvider";

const removeUser = () => {
  localStorage.removeItem("userInfo");
};
export default removeUser;
