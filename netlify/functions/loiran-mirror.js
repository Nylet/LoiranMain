exports.handler = async function(event) {
  try {
    // Dynamically import node-fetch
    const fetch = (await import('node-fetch')).default;

    // Parse the request body safely
    let body;
    try {
      body = JSON.parse(event.body);
    } catch {
      return {
        statusCode: 400,
        body: JSON.stringify({ reply: "⚠️ Could not read your question. Make sure it’s valid JSON." })
      };
    }

    const question = body?.question?.trim();
    if (!question) {
      return {
        statusCode: 400,
        body: JSON.stringify({ reply: "⚠️ Please ask a question for the mirror to respond." })
      };
    }

    // Call OpenAI
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

  } catch (err) {
    console.error("Mirror function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "⚠️ The mirror encountered an error. Please try again later." })
    };
  }
};
