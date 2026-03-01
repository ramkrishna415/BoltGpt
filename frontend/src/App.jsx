
import './App.css'
import ChatWindow from './ChatWindow'
import Sidebar from './Sidebar'
import {myContext}from "./MyContext.jsx";
import { useState } from 'react';
import{v1 as uuidv1}from "uuid";
function App() {
  const [prompt,setPrompt]=useState("");
  const[reply,setReply]=useState(null);
   const[currThreadId,setCurrThreadId]=useState(uuidv1());
   const[prevChats,setPrevChats]=useState([]);
   const[newChat,setNewChat]=useState(true);
   const[allThreads,setAllThreads]=useState([]);


  const providerValues={
    prompt,setPrompt,
    reply,setReply,
    currThreadId,setCurrThreadId,
    prevChats,setPrevChats,
    newChat,setNewChat,
    allThreads,setAllThreads

  }; //passing value
  return (
   <div className='main'>
   <myContext.Provider value={providerValues}>
     <Sidebar></Sidebar>
    <ChatWindow></ChatWindow>
   </myContext.Provider>
   
   </div>
  )
}

export default App
