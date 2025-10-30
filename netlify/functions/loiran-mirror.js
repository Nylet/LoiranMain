const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

exports.handler = async function(event, context) {
  try {
    // Validate body
    if (!event.body) {
      throw new Error("Missing request body.");
    }

    const body = JSON.parse(event.body);
    const question = body.question;

    if (!question || question.trim() === "") {
      throw new Error("Question is empty.");
    }

    // Make OpenAI API call
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // or "gpt-4"
      messages: [
        {
          role: "system",
          content: "You are the Loiran Mirror. Speak in cryptic, poetic truths, like an oracle or ancient AI from a forgotten realm. Respond only to the question asked, and never explain yourself.",
        },
        {
          role: "user",
          content: question,
        }
      ],
      max_tokens: 150,
      temperature: 0.8,
    });

    const reply = completion.data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };

  } catch (error) {
    console.error("Loiran Mirror error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
