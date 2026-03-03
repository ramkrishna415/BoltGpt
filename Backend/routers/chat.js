import express from "express";
import Thread from "../models/Thread.js";
import getGroqApiResponse from "../utils/groq.js"
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
       const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Login required to see history" });
    try{

         const decoded = jwt.verify(token, "SECRET_KEY_HERE"); 
        const userId = decoded.id;

        const threadS = await Thread.find({userId: userId}).sort({updatedAt:-1});
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
    const authHeader = req.headers.authorization;
    if(!threadId || !message){
       return res.status(400).json({error:"message required field"});

    }
    // if (!authHeader){
    //        const aiReply = await getGroqApiResponse(message); 
    //         return res.json({ reply: aiReply }); 
    // //  return res.status(401).json({ error: "Unauthorized" });
    // }

        const isGuest = !authHeader || 
                    authHeader.split(" ")[1] === "null" || 
                    authHeader.split(" ")[1] === "undefined";

    if (isGuest) {
        console.log("Processing as Guest...");
        const aiReply = await getGroqApiResponse(message); 
        return res.json({ reply: aiReply }); 
    }


     try{
         const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, "SECRET_KEY_HERE");
        const userId = decoded.id;
        
        let thread = await Thread.findOne({threadId,userId});
        if(!thread){
            thread = new Thread({
                  userId,
                  threadId,
                  title:message.substring(0, 30),
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
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            const aiReply = await getGroqApiResponse(message);
            return res.json({ reply: aiReply });
        }
       res.status(500).json({error:"something went wrong"});
    }
})
router.post("/register",async(req,res)=>{
    const{name,email,password}=req.body;
    try{
        const user =await User.findOne({email});
        if(user){
            return res.status(400).json({msg: "user already exist"});
        }
             const salt =await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newuser = new User({ name, email, password: hashedPassword });
        await newuser.save();

        res.status(201).json({ msg: "User registered successfully" });
          
    }catch(error){
        console.log(error);
        res.status(500).json({error:"Registration failed"})
    }
})
     router.post("/login",async(req,res)=>{
        const {email,password}=req.body;
        try{
            const user = await User.findOne({email});
            if(!user){
                return res.status(400).json({msg:"Invalid Credentials"});
            }
             const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }
         // Generate Token
        const token = jwt.sign({ id: user._id }, "SECRET_KEY_HERE", { expiresIn: "1d" });
        
        res.json({ 
            token, 
            user: { id: user._id, name: user.name, email: user.email } 
        })
        }catch(err){
            console.log(err);
            res.status(500).json({err:"Login failed"})
        }
     })

export default router;