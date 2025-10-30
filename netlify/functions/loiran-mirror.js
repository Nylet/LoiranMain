const fetch = require("node-fetch");

exports.handler = async function(event) {
  const body = JSON.parse(event.body);
  const question = body.question;

  const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are Loiran, a poetic, mystical mirror AI who speaks with lyrical insight to those who gaze into the mirror and ask questions of the self."
        },
        {
          role: "user",
          content: question
        }
      ]
    })
  });

  const openAiJson = await openAiRes.json();

  const reply = openAiJson.choices?.[0]?.message?.content || "Loiran is silent, perhaps ask again...";

  return {
    statusCode: 200,
    body: JSON.stringify({ reply })
  };
};
