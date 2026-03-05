import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.GROQ_API_KEY) {
  console.error("ERROR: GROQ_API_KEY is not set in .env");
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use(express.static("."));

app.post("/api/propose", async (req, res) => {
  const { system, messages, max_tokens } = req.body;

  if (!system || !messages) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  console.log("Calling Groq API...");

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: system },
          { role: "user", content: messages[0].content }
        ],
        max_tokens: max_tokens || 1000,
      }),
    });

    console.log("Groq status:", response.status);

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq error:", err);
      return res.status(response.status).json({ error: err });
    }

    const raw = await response.json();

    const converted = {
      content: [{ text: raw.choices[0].message.content }],
      usage: {
        input_tokens: raw.usage.prompt_tokens,
        output_tokens: raw.usage.completion_tokens,
      }
    };

    return res.json(converted);

  } catch (err) {
    console.error("Server error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Groq key: ${process.env.GROQ_API_KEY.slice(0, 14)}...`);
});