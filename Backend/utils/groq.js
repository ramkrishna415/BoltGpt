import "dotenv/config";

const getGroqApiResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      messages: [{
        role: "user",
        content: message
      }],
    })
  };

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options);
    const data = await response.json();

    if (data && data.choices && data.choices[0] && data.choices[0].message) {
      console.log("Success:", data.choices[0].message.content);
      return data.choices[0].message.content;
    } else {
      console.error("Groq API Error Response:", data);
      return "Groq API se sahi response nahi mila.";
    }

  } catch (err) {
    console.error("Error inside getGroqApiResponse catch block:", err);
    // ✅ Yeh lagana zaroori hai taaki frontend crash na ho aur error message dikhe
    return "Network error: Connection with Groq failed.";
  }
}

export default getGroqApiResponse;
