const express = require("express");
const Groq = require("groq-sdk");
const Transaction = require("../models/Transaction");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.post("/advice", protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.userId
    });

    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryExpenses = {};

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      }

      if (transaction.type === "expense") {
        totalExpenses += transaction.amount;

        if (!categoryExpenses[transaction.category]) {
          categoryExpenses[transaction.category] = 0;
        }

        categoryExpenses[transaction.category] += transaction.amount;
      }
    });

    const savings = totalIncome - totalExpenses;

    const question =
      req.body.question ||
      "Analyze my finances and give me useful suggestions.";

    const prompt = `
You are EliFin, a personal finance assistant.

User financial data:
Total income: ₹${totalIncome}
Total expenses: ₹${totalExpenses}
Savings: ₹${savings}

Expense categories:
${JSON.stringify(categoryExpenses)}

User question:
${question}

Give practical, concise financial guidance.
Do not guarantee investment returns.
Do not ask for passwords, bank account numbers, or other sensitive information.
Mention when professional financial advice may be appropriate.
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: "You are EliFin, a helpful personal finance assistant."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const advice = completion.choices[0].message.content;

    res.status(200).json({
      message: "AI advice generated successfully",
      advice
    });

  } catch (error) {
    console.error("GROQ ERROR:", error);

    res.status(500).json({
      message: "AI service error",
      error: error.message
    });
  }
});
router.post("/chat", protect, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Message is required"
      });
    }

    const transactions = await Transaction.find({
      user: req.user.userId
    }).sort({ date: -1 });

    let totalIncome = 0;
    let totalExpenses = 0;

    const categoryExpenses = {};

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      }

      if (transaction.type === "expense") {
        totalExpenses += transaction.amount;

        if (!categoryExpenses[transaction.category]) {
          categoryExpenses[transaction.category] = 0;
        }

        categoryExpenses[transaction.category] += transaction.amount;
      }
    });

    const savings = totalIncome - totalExpenses;

    const financialContext = `
Total income: ₹${totalIncome}
Total expenses: ₹${totalExpenses}
Current savings: ₹${savings}

Expenses by category:
${JSON.stringify(categoryExpenses)}
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: `
You are EliFin, a helpful personal finance assistant.

You have access to the user's financial summary.

Give clear and practical answers based on the provided financial data.

Do not invent financial information.

Do not request passwords, bank account numbers, OTPs,
credit card numbers, or other sensitive information.

Do not guarantee investment returns.

If the user asks for professional financial advice,
recommend consulting a qualified financial professional.
`
        },
        {
          role: "user",
          content: `
Financial information:

${financialContext}

User question:

${message}
`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({
      message: "AI response generated successfully",
      reply
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);

    res.status(500).json({
      message: "AI service error",
      error: error.message
    });
  }
});
router.get("/models", protect, async (req, res) => {
  try {
    const models = await groq.models.list();

    res.json({
      models: models.data.map((model) => ({
        id: model.id,
        active: model.active
      }))
    });

  } catch (error) {
    console.error("MODEL ERROR:", error);

    res.status(500).json({
      message: "Could not fetch models",
      error: error.message
    });
  }
});

module.exports = router;