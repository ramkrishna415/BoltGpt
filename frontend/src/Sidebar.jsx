import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { myContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";

function Sidebar(){
  const{allThreads,setAllThreads,currThreadId,setNewChat,setPrompt,setReply,setCurrThreadId,setPrevChats,isLogin,guestMessages}=useContext(myContext);


  const getAllThreads =async ()=>{
     const token = localStorage.getItem("token")?.replace(/['"]+/g, '');
    if (!token) return; 
        try{
          const response = await fetch("https://boltgpt.onrender.com/api/thread",{
             headers: {
            "Authorization": `Bearer ${token}` // Token bhejna zaroori hai
        }
    
          });
          const res = await response.json();
          //  const filterData = res.map(thread =>({threadId:thread.threadId,title:thread.title}));
          //   //console.log(res);
          //  console.log(filterData);
          //  setAllThreads(filterData);
            if (response.ok) {
        setAllThreads(res);
    } else {
        console.error(res.error);
    }
        }catch(err){
          console.log(err);
        }
  };
  useEffect(()=>{
    const token = localStorage.getItem("token");
  if(token){
getAllThreads();
  }else{
    // setAllThreads([])
      
  }
   
  },[currThreadId,]);



 const createNewChat =(e)=>{
      if(e){
        e.preventDefault();
      }
  setNewChat(true);
  setPrompt("");
  setReply(null);
  setCurrThreadId(uuidv1());
  setPrevChats([]);
 }

 const changeThread = async (newthreadId)=>{
      setCurrThreadId(newthreadId);
      
      const token = localStorage.getItem("token")?.replace(/['"]+/g, '');
      if (token && token !== "null") {
      try{
        const response = await fetch(`https://boltgpt.onrender.com/api/thread/${newthreadId}`,{
           headers: { "Authorization": `Bearer ${token}` }
        });
        const res = await response.json();
        console.log(res);
         setPrevChats(res);
        setNewChat(false);
        setReply(null);
      }catch(err){
        console.log(err);
      }
 }else{
const localHistory = guestMessages[newthreadId] || [];
        setPrevChats(localHistory);

 }
 setNewChat(false);
    setReply(null);
}

 const deleteThread =async (threadId)=>{
  const token = localStorage.getItem("token")?.replace(/['"]+/g, '');
    setAllThreads(prev =>prev.filter(thread =>thread.threadId !==threadId));
     if(threadId===currThreadId){
      createNewChat();
     }
     if (token && token !== "null") {
  try{
      const response =await fetch(`https://boltgpt.onrender.com/api/thread/${threadId}`,{
        
        method:"DELETE",
         headers: { "Authorization": `Bearer ${token}` }});
      
        const res= await response.json();
       console.log(res);
       //updated thread re -render
       
    }catch(err){
    console.log(err);
  }
 }else{
 console.log("Guest mode: Deleted from UI only");
 }
}

    return(
       <section className="sidebar">
          <button  type="button" onClick={createNewChat}>
            <img src="src/assets/images.jpg" alt='groq logo' className="logo"></img>
           <span> <i className="fa-solid fa-pen-to-square"></i>
          </span>
        </button>
          <ul className="history">
              {
                allThreads?.map((thread,idx)=>(
                  <li key={idx} onClick={(e)=>changeThread(thread.threadId)}
                  className={thread.threadId === currThreadId ? "highlighted": " "}
                  >{thread.title}
                  <i className="fa-solid fa-trash"
                      onClick={(e)=>{
                        e.stopPropagation()//stop event bubbling 
                        deleteThread(thread.threadId);
                      }}
                  ></i>
                  </li>

                ))
              }
          </ul>
          <div className="sign">
            <p>By upadhyay &hearts;</p>
          </div>
       </section>
    )
}

export default Sidebar;