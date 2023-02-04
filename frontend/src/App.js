import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import ChatProvider from "./context/chatProvider";
import ErrorPage from "./Pages/ErrorPage";
function App() {
  return (
    <div className="App">
      <ChatProvider>
        <Routes>
          <Route path="/" element={<HomePage />} exact />
          <Route path="/chats" element={<ChatPage />} exact />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </ChatProvider>
    </div>
  );
}

export default App;
