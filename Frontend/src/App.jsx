import './App.css'
import Sidebar from "./Sidebar.jsx";
import Chatwindow from "./Chatwindow.jsx";
import { MyContext } from './MyContext.jsx';
import { useState } from 'react';
import {v1 as uuidv1} from "uuid";

function App() {
  const [prompt , setPrompt] = useState("");
  const [reply , setReply] = useState("");
  const [currThreadId , setCurrThreadId] = useState(uuidv1());
  const [prevChat , setPrevChat] = useState([]);  // stores all chats of curr threads
  const [newChat , setNewChat] = useState(true);
  const [allThreads , setAllThreads] = useState([]);

  const providerValues ={
    prompt , setPrompt,
    reply , setReply,
    currThreadId , setCurrThreadId,
    newChat ,setNewChat,
    prevChat ,setPrevChat,
    allThreads , setAllThreads
  };

  return (
    <div className='app'>
      <MyContext.Provider value= {providerValues}>
      <Sidebar></Sidebar>
      <Chatwindow></Chatwindow>
      </MyContext.Provider>
      
    </div>
  )
}

export default App
