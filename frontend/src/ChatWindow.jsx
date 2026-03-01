import "./ChatWindow.css";
import Chat from "./Chat.jsx"
import { myContext } from "./MyContext.jsx";
import { useContext ,useState,useEffect} from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow(){
    const{prompt,setPrompt,reply,setReply, currThreadId,prevChats,setPrevChats,setNewChat}=useContext(myContext);
    const[loading,setLoading]=useState(false);
    const [isOpen, setIsOpen]=useState(false);



   const getReply =async ()=> {
   setLoading(true);
   setNewChat(false);
    console.log("message",prompt,"threadId",currThreadId)
    const options ={
        method:"POST",
        headers:{
            "content-Type":"application/json"
        },
        body: JSON.stringify({
            message:prompt,
            threadId:currThreadId
        })
    };
    try{                           //http://localhost:8080
      const response= await fetch("https://boltgpt.onrender.com/api/chat",options);
       const res=  await response.json();
      console.log(res);
      setReply(res.reply);
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
                  <div className="dropDownItem"><i class="fa-solid fa-right-from-bracket"></i>Log out</div>
                  
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