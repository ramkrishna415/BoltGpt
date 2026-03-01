import express from 'express';
 import 'dotenv/config';
 import cors from 'cors';
 import mongoose from 'mongoose';
import chatRoutes from "./routers/chat.js"
 const app= express();
 const  port = 8080;

 app.use(express.json());
 app.use(cors());
 app.use("/api",chatRoutes);


 app.listen(port,()=>{
    console.log(`server is runing on the port ${port}`);
      connect();
  });

const connect = async()=>{
  try{
         await mongoose.connect(process.env.mongoDb_url);
          console.log("connected with Database")
        }catch(err){
       console.log("Failed to connect with Db",err); 
  }
}


// app.post("/test", async (req, res) => {
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
//     },
//     body: JSON.stringify({
//       model: "llama-3.3-70b-versatile", 
//       messages: [{
//         role: "user",
//         content:  req.body.message
//       }],
//     })
//   };

//   try {
//   const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options);
    
//     const data = await response.json();
//     console.log(data.choices[0].message.content);
    
   
//     res.send(data.choices[0].message.content);

//   } catch (err) {
//     console.error("Error:", err);
//   }
// });

















// import Groq from 'groq-sdk';
// import 'dotenv/config';

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY, // Apni .env file mein GROQ_API_KEY set karein
// });

// async function main() {
//   const chatCompletion = await groq.chat.completions.create({
//     messages: [
//       {
//         role: 'user',
//         content: 'different between java and javascript',
//       },
//     ],
//     model: 'llama-3.3-70b-versatile', // Groq par Llama 3 bahut fast chalta hai
//   });

//   console.log(chatCompletion.choices[0]?.message?.content);
// }

// main();
