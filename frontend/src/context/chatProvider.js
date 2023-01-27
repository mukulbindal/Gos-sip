import { createContext, useContext, useState, useEffect } from "react";
import currentUser from "../config/currentUser";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(currentUser());

  useEffect(() => {
    const nowUser = currentUser();
    if (nowUser) {
      setUser(nowUser);
    }
  }, [user]);

  return (
    <ChatContext.Provider value={{ user, setUser }}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
