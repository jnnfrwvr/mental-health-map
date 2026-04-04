export const config = { runtime: "nodejs" };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed." });
  }

  const { message } = req.body || {};

  if (!message || typeof message !== "string") {
    return res.status(400).json({ reply: "A valid message is required." });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a compassionate mental health resource assistant. Provide supportive, clear information. Do not claim to be a therapist. Do not invent local organizations, addresses, or phone numbers. Always include the 988 Suicide & Crisis Lifeline for U.S. users when discussing crisis support."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.4
      })
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      console.error("OpenAI error:", data);
      return res.status(500).json({
        reply: "The AI service returned an error. Please try again later."
      });
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      console.error("No valid response returned:", data);
      return res.status(500).json({
        reply: "No valid response was returned."
      });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Error during OpenAI call:", error);
    return res.status(500).json({
      reply: "An error occurred while contacting the AI service."
    });
  }
}