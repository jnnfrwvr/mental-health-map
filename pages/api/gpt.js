export const config = { runtime: "nodejs" };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { message } = req.body;
  console.log("Incoming message:", message);

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: message }],
        temperature: 0.7
      })
    });

    const data = await openaiRes.json();
    console.log("OpenAI API raw response:", data);

    if (!data.choices || !data.choices[0]) {
      console.error("No valid choices returned:", data);
      return res.status(500).json({ reply: "OpenAI didn't return a valid response." });
    }

    const reply = data.choices[0].message.content;
    console.log("Reply sent to frontend:", reply);
    res.status(200).json({ reply });

  } catch (error) {
    console.error("❌ Error during OpenAI call:", error);
    res.status(500).json({ reply: "An error occurred while contacting OpenAI. Please try again later." });
  }
}
