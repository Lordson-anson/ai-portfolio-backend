import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// use environment variable (IMPORTANT for hosting)
const API_KEY = process.env.OPENAI_API_KEY;

const context = `
You are an AI assistant for Lordson Ugonna Anson.

He is a multi-skilled professional based in Lagos, Nigeria.

He is a scriptwriter, web developer, graphics designer, and more.

He is available for freelance, internships, and full-time roles.

Your job is to:
- Answer questions about him
- Promote his skills professionally
- Encourage users to contact or hire him

Do not talk about personal life.
Do not answer unrelated questions.
Keep responses clear and confident.
`;

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

    res.json({
      reply: data.output[0].content[0].text
    });

  } catch (error) {
    res.json({ reply: "Error talking to AI" });
  }
});

app.listen(3000, () => {
  console.log("Server running");
});
