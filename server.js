import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// 🔑 Your API key from Render environment variables
const API_KEY = process.env.OPENAI_API_KEY;

// 🧠 AI Brain (your portfolio context)
const context = `
You are an AI assistant for Lordson Ugonna Anson.

He is a multi-skilled professional based in Lagos, Nigeria.

He is a scriptwriter, web developer, graphics designer, content creator, tutor, sales executive, and educator.

He has over 5 years of experience.

Your job:
- Answer questions about him
- Promote his skills professionally
- Encourage hiring, freelance work, and recruitment
- Guide users to contact him

Rules:
- Do NOT talk about personal life
- Do NOT guess unknown answers
- Stay strictly career-focused
- Be confident, formal, and helpful
`;

// 📡 Chat endpoint
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `${context}\n\nUser: ${userMessage}`
      })
    });

   const data = await response.json();

console.log("RAW OPENAI RESPONSE:");
console.log(JSON.stringify(data, null, 2));

    // 🔍 Debug (visible in Render logs)
    console.log("OPENAI RESPONSE:", JSON.stringify(data, null, 2));

    // 🧠 Safe response extraction
    if (!data.output) {
  return res.json({
    reply: "OpenAI did not return output. Check logs."
  });
}

const reply =
  data.output?.[0]?.content?.[0]?.text ||
  data.output_text ||
  "No valid response format";

res.json({ reply });
  } catch (error) {
    console.log("ERROR:", error);
    res.json({ reply: "Error talking to AI" });
  }
});

// 🚀 IMPORTANT: Render needs this port setup
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("AI server running on port", PORT);
});
