import './App.css'
import Sidebar from "./Sidebar.jsx";
import Chatwindow from "./Chatwindow.jsx";
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import { MyContext } from './MyContext.jsx';
import { useState, useEffect } from 'react';
import { v1 as uuidv1 } from "uuid";

function App() {

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChat, setPrevChat] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);


  // Reset all chat data
  const resetChatState = () => {
    setPrompt("");
    setReply("");
    setCurrThreadId(uuidv1());
    setPrevChat([]);
    setNewChat(true);
    setAllThreads([]);
  };


  // Login + Signup
  const handleAuthSuccess = (newToken) => {

    // Clear previous account's chat data
    resetChatState();

    localStorage.setItem("token", newToken);

    setUser(null);
    setToken(newToken);
  };


  // Logout
  const handleLogout = () => {

    localStorage.removeItem("token");

    // Clear current account's data from frontend state
    resetChatState();

    setUser(null);
    setToken(null);
    setShowSignup(false);
  };


  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChat, setPrevChat,
    allThreads, setAllThreads,
    token,
    user,
    handleLogout
  };


  // Get logged-in user
  useEffect(() => {

    const getUser = async () => {

      if (!token) {
        setUser(null);
        return;
      }

      try {

        const response = await fetch(
          "http://localhost:8080/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          handleLogout();
          return;
        }

        setUser(data.user);

      } catch (error) {
        console.log("User fetch error:", error);
      }
    };

    getUser();

  }, [token]);


  // Not logged in
  if (!token) {

    if (showSignup) {

      return (
        <Signup
          onSignup={handleAuthSuccess}
          onLogin={() => setShowSignup(false)}
        />
      );

    }

    return (
      <Login
        onLogin={handleAuthSuccess}
        onSignup={() => setShowSignup(true)}
      />
    );
  }


  // Logged in
  return (
    <div className="app">

      <MyContext.Provider value={providerValues}>

        <Sidebar />

        <Chatwindow />

      </MyContext.Provider>

    </div>
  );
}

export default App;