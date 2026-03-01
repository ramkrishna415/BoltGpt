import express from "express";
import Thread from "../models/Thread.js";
import getGroqApiResponse from "../utils/groq.js"
const router = express.Router();


//test
router.post("/test",async(req,res)=>{
try{
    const thread = new Thread({
        threadId: "abc",
        title:"testing new Thread 2"
    });
    const response = await thread.save();
    res.send(response);
}catch(err){
    console.log(err);
    res.status(500).json({err:"Failed to save in DB"})
}
})


router.get("/thread",async(req,res)=>{
    try{
        const threadS = await Thread.find({}).sort({updatedAt:-1});
        res.json(threadS);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to fetch threads"});
    }
})

router.get("/thread/:threadId",async(req,res)=>{
    const {threadId}= req.params;
    try{
        const thread = await Thread.findOne({threadId});

        if(!thread){
              res.status(404).json({err:"Thread is not found"});
        }
        res.json(thread.message);
    }catch(err){
        console.log(err);
        res.status(500).json({err:"Failed to fetch chat"});
    }
});

router.delete("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;
    try{
        const deleteThread = await Thread.findOneAndDelete({threadId});
         if(!deleteThread){
            res.status(404).json({err:"Thread could not be deleted"});
         }
         res.status(200).json({success:"Thread deleted successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({err:"Failed to fetch chat"});
    }
});

router.post("/chat",async(req,res)=>{
    const{threadId,message}=req.body;
    if(!threadId || !message){
        res.status(400).json({error:"message required field"});

    }
    try{
        let thread = await Thread.findOne({threadId});
        if(!thread){
            thread = new Thread({
                  threadId,
                  title:message,
                  message:[{role:"user",content:message}]   
            });
        }else{
             thread.message.push({role:"user",content:message})
        }

     const assistanReply =await getGroqApiResponse(message);
       thread.message.push({role:"assistant",content:assistanReply});
        thread.updatedAt = new Date();
       await thread.save();
           res.json({reply:assistanReply});
    }catch(err){
        console.log(err);
       res.status(500).json({error:"something went wrong"});
    }
})

export default router;