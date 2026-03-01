### BoltGPT - AI Chat Application

## Project Description
BoltGPT is a high-performance, full-stack AI conversational platform built
 using the MERN stack. The application leverages the Groq Cloud API to provide
  lightning-fast, near-instantaneous AI responses, mimicking the seamless user experience of
   ChatGPT but with optimized inference speed.


## Features

High-Speed AI Conversations: Uses Groq’s LPU™ technology for ultra-low latency text generation.

MERN Stack Integration: A robust architecture with a React frontend and a Node/Express backend.

Persistent Chat History: Saves and retrieves previous conversations using MongoDB.

Markdown & Code Support: Renders code blocks and formatted text accurately.

Environment Security: Securely manages sensitive Groq API keys through server-side environment variables.


## Technologies Used

Frontend: React.js, CSS

Backend: Node.js, Express.js

Database: MongoDB

Inference Engine: Groq Cloud API 

## API Endpoints
POST /api/chat – Sends user prompt to Groq and returns AI response.
GET /api/history – Fetches saved chat logs from MongoDB.
DELETE /api/history/:id – Removes a specific chat session from the database.


## How to Run
Install dependencies: Run npm install in both the client and server directories.

Environment Setup: Create a .env file in the backend with your GROQ_API_KEY and MONGO_URI.

Start Server: Run npm start or node index.js.

## Validation Rules
Prompt Required: Input field cannot be empty.
Rate Limiting: Managed via Groq API constraints to prevent abuse.
Data Validation: Ensures valid JSON format for all API requests and responses.

## Conclusion
This project demonstrates the integration of modern AI inference engines with the MERN stack. It highlights how to build scalable, real-time AI applications that prioritize speed and user experience through Groq's high-speed API.


## Author
Name: Ramkrishna Upadhyay
Course: B.Tech (CSE)
Project Type: Personal Project 
Year: 2026