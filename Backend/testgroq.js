require("dotenv").config();

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function test() {
  try {
    const models = await groq.models.list();

    console.log("\nAVAILABLE MODELS:\n");

    models.data.forEach((model) => {
      console.log(model.id);
    });

  } catch (error) {
    console.error("\nGROQ ERROR:");
    console.error(error.message);
  }
}

test();