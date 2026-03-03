import "./ChatWindow.css";
import Chat from "./Chat.jsx"
import { myContext } from "./MyContext.jsx";
import { useContext ,useState,useEffect} from "react";
import { ScaleLoader } from "react-spinners";
 import { useNavigate } from 'react-router-dom';
function ChatWindow(){
    const{prompt,setPrompt,reply,setReply, currThreadId,prevChats,setPrevChats,setNewChat ,isLogin, setIsLogin,setAllThreads,allThreads,guestMessages, setGuestMessages}=useContext(myContext);
    const[loading,setLoading]=useState(false);
    const [isOpen, setIsOpen]=useState(false);
    const navigate = useNavigate(); 



   const getReply =async ()=> {
   setLoading(true);
   setNewChat(false);
   const token = localStorage.getItem("token")?.replace(/['"]+/g, '');
    console.log("message",prompt,"threadId",currThreadId)
    const options ={
        method:"POST",
        headers:{
            "content-Type":"application/json",
             "Authorization": `Bearer ${localStorage.getItem("token")?.replace(/['"]+/g,'')}`
        },
        body: JSON.stringify({
            message:prompt,
            threadId:currThreadId
        })
    };
if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
    }

    try{
      const response= await fetch("https://boltgpt.onrender.com/api/chat",options);
       const res=  await response.json();
      console.log(res);
      setReply(res.reply);

      if (token) {
            if (typeof getAllThreads === 'function') getAllThreads();
        }else{
            const exists = allThreads.some(t => t.threadId === currThreadId);
      
      if (!exists) {
        const newTitle = prompt.length > 30 ? prompt.substring(0, 30) + " " : prompt;
        
        setAllThreads(prev => [
          { 
            threadId: currThreadId, 
            title:newTitle
          }, 
          ...prev
        ]);
      } 
       setGuestMessages(prev => ({
            ...prev,
            [currThreadId]: [
                ...(prev[currThreadId] || []), 
                { role: "user", content: prompt },
                { role: "assistant", content: res.reply }
            ]
        }));
        }
      
    }catch(err){
        console.log(err);
    }
    setLoading(false);
   }


   //Append new chats to prevChats
      useEffect(()=>{
            if(prompt && reply){
                 setPrevChats(prevChats => [
                    ...prevChats,
                       { role:"user",
                       content:prompt
                   },{
                         role:"assistant",
                         content:reply}

                ])
            
            setPrompt("");
              }
      }, [reply])

      const handleProfileClick =() =>{
        setIsOpen(!isOpen);
      }   
      
       const handleLogout = () => {
    // 1. Token delete kare
    localStorage.removeItem("token");
     
    setPrevChats([]);   
    setAllThreads([]);   
    setReply(null);      
    setPrompt("");      
    
    // 3. Login state ko false kare
    setIsLogin(false)
    setNewChat(true);

    
    

    
    navigate("/"); 
    
    alert("Logged out successfully!");
  };


    return(
       <div className="chatWindow">
        <div className="navbar">
            <span>BoltGPT <i className="fa-solid fa-angle-down"></i></span>
            <div className="userIconDiv" onClick={handleProfileClick}>
                <span className="userIcon"><i className="fa-solid fa-circle-user"></i></span>
            </div>

        </div>

        {
            isOpen &&
            <div className="dropDown">
              
                 <div className="dropDownItem"><i class="fa-solid fa-gear"></i>Settings</div>
                   <div className="dropDownItem"><i class="fa-solid fa-file-arrow-up"></i>Upgrade plan</div>
                  <div className="dropDownItem" onClick={() => {
                     const token = localStorage.getItem("token");
    if (token) {
      handleLogout(); 
       
    } else {
      navigate("/login");
    }
  }}><i className="fa-solid fa-right-from-bracket"></i>{localStorage.getItem("token")  ?"Logout": "Login"}</div>
                  
                 </div>
        }
        <Chat></Chat>
        <ScaleLoader color="#fff" loading={loading}>

        </ScaleLoader>
        <div className="chatInput">
            <div className="inputBox">
                <input placeholder="Ask anything"  value={prompt}
                onChange={(e)=>setPrompt(e.target.value)}
                    onKeyDown={(e)=>e.key==='Enter'?getReply():''}
               
                />
                <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
            </div>
            <p className="info">
                BoltGPT can make mistake. check important info. See cookie Preferences.
            </p>
        </div>
       </div>
    )
}

export default ChatWindow;