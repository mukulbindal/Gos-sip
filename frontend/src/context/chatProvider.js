import { createContext, useContext, useState, useEffect } from "react";
import currentUser from "../config/currentUser";
import { useNavigate } from "react-router-dom";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(currentUser());
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  useEffect(() => {
    const nowUser = currentUser();
    if (nowUser) {
      setUser(nowUser);
      navigate("/chats");
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
