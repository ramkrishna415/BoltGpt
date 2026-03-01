import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { myContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";

function Sidebar(){
  const{allThreads,setAllThreads,currThreadId,setNewChat,setPrompt,setReply,setCurrThreadId,setPrevChats}=useContext(myContext);


  const getAllThreads =async ()=>{
        try{
          const response = await fetch("http://localhost:8080/api/thread");
          const res = await response.json();
           const filterData = res.map(thread =>({threadId:thread.threadId,title:thread.title}));
            //console.log(res);
           console.log(filterData);
           setAllThreads(filterData);
          
        }catch(err){
          console.log(err);
        }
  };
  useEffect(()=>{
    getAllThreads();
  },[currThreadId])

 const createNewChat =()=>{
  setNewChat(true);
  setPrompt("");
  setReply(null);
  setCurrThreadId(uuidv1());
  setPrevChats([]);
 }

 const changeThread = async (newthreadId)=>{
      setCurrThreadId(newthreadId);
      try{
        const response = await fetch(`http://localhost:8080/api/thread/${newthreadId}`);
        const res = await response.json();
        console.log(res);
         setPrevChats(res);
        setNewChat(false);
        setReply(null);
      }catch(err){
        console.log(err);
      }
 }

 const deleteThread =async (threadId)=>{
  try{
      const response =await fetch(`http://localhost:8080/api/thread/${threadId}`,{method:"DELETE"});
       const res= await response.json();
       console.log(res);
       //updated thread re -render
       setAllThreads(prev =>prev.filter(thread =>thread.threadId !==threadId));
     if(threadId===currThreadId){
      createNewChat();
     }
    }catch(err){
    console.log(err);
  }
 }

    return(
       <section className="sidebar">
          <button onClick={createNewChat}>
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