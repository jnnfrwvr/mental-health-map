export const config = { runtime: "nodejs" };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { message } = req.body;

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
  const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't retrieve resources at the moment.";
  res.status(200).json({ reply });
}
Add logging and nodejs runtime config to gpt.js
