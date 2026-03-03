
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatWindow from './ChatWindow'
import Sidebar from './Sidebar'
import {myContext}from "./MyContext.jsx";
import { useState } from 'react';
import{v1 as uuidv1}from "uuid";
import Loginpage from './loginpage.jsx';
function App() {
  const [prompt,setPrompt]=useState("");
  const[reply,setReply]=useState(null);
   const[currThreadId,setCurrThreadId]=useState(uuidv1());
   const[prevChats,setPrevChats]=useState([]);
   const[newChat,setNewChat]=useState(true);
   const[allThreads,setAllThreads]=useState([]);
    const [isLoging ,setIsLogin]=useState(true);
    const [guestMessages, setGuestMessages] = useState({}); 


  const providerValues={
    prompt,setPrompt,
    reply,setReply,
    currThreadId,setCurrThreadId,
    prevChats,setPrevChats,
    newChat,setNewChat,
    allThreads,setAllThreads,
    isLoging ,setIsLogin,
    guestMessages, setGuestMessages

  }; //passing value
  return (
    <Router>
   <div className='main'>
   <myContext.Provider value={providerValues}>
     <Routes>
     <Route path="/" element={
          <div className="home-container"> {/* Flexbox for side-by-side */}
            <Sidebar />
            <ChatWindow />
          </div>
        } />
 <Route path="/login" element={<Loginpage />} />
    </Routes>
   </myContext.Provider>
   
   </div>
   </Router>
  )
}

export default App
