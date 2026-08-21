const express = require("express");
const Groq = require("groq-sdk");

const User = require("../models/User");
const Transaction = require("../models/Transaction");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


// ======================================================
// AI FINANCIAL ADVICE
// POST /api/ai/advice
// ======================================================

router.post("/advice", protect, async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    // Find logged-in user
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Find user's transactions
    const transactions = await Transaction.find({
      user: req.user.userId,
    });

    let totalIncome = 0;
    let totalExpenses = 0;

    const categoryExpenses = {};

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += Number(transaction.amount);
      }

      if (transaction.type === "expense") {
        totalExpenses += Number(transaction.amount);

        categoryExpenses[transaction.category] =
          (categoryExpenses[transaction.category] || 0) +
          Number(transaction.amount);
      }
    });

    const savings = totalIncome - totalExpenses;

    const savingsRate =
      totalIncome > 0
        ? ((savings / totalIncome) * 100).toFixed(1)
        : 0;

    // Financial information sent to AI
    const prompt = `
You are EliFin, a personal financial advisor.

User:
Name: ${user.name}
Monthly Income: ₹${user.income}

Financial Summary:
Total Income: ₹${totalIncome}
Total Expenses: ₹${totalExpenses}
Savings: ₹${savings}
Savings Rate: ${savingsRate}%

Expenses by Category:
${JSON.stringify(categoryExpenses)}

User Question:
${question}

Instructions:
- Give practical and personalized financial advice.
- Use the user's financial data when relevant.
- Keep the answer simple and easy to understand.
- Do not invent financial information.
- Do not guarantee investment returns.
- Never ask for passwords, OTPs, bank account numbers,
  credit card numbers, or other sensitive information.
- If professional financial advice is required,
  recommend consulting a qualified financial professional.
`;

    // Call Groq
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content:
            "You are EliFin, a helpful and responsible personal finance assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.7,
      max_tokens: 500,
    });

    const advice =
      completion.choices[0].message.content;

    res.status(200).json({
      message: "AI advice generated successfully",
      advice,
    });

  } catch (error) {
    console.error("GROQ ERROR:", error);

    res.status(500).json({
      message: "AI service error",
      error: error.message,
    });
  }
});


// ======================================================
// AI CHAT
// POST /api/ai/chat
// ======================================================

router.post("/chat", protect, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const transactions = await Transaction.find({
      user: req.user.userId,
    }).sort({ date: -1 });

    let totalIncome = 0;
    let totalExpenses = 0;

    const categoryExpenses = {};

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += Number(transaction.amount);
      }

      if (transaction.type === "expense") {
        totalExpenses += Number(transaction.amount);

        categoryExpenses[transaction.category] =
          (categoryExpenses[transaction.category] || 0) +
          Number(transaction.amount);
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

If professional financial advice is required,
recommend consulting a qualified financial professional.
`,
        },

        {
          role: "user",
          content: `
Financial information:

${financialContext}

User question:

${message}
`,
        },
      ],

      temperature: 0.7,
      max_tokens: 500,
    });

    const reply =
      completion.choices[0].message.content;

    res.status(200).json({
      message: "AI response generated successfully",
      reply,
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);

    res.status(500).json({
      message: "AI service error",
      error: error.message,
    });
  }
});


// ======================================================
// AVAILABLE GROQ MODELS
// GET /api/ai/models
// ======================================================

router.get("/models", protect, async (req, res) => {
  try {
    const models = await groq.models.list();

    res.json({
      models: models.data.map((model) => ({
        id: model.id,
        active: model.active,
      })),
    });

  } catch (error) {
    console.error("MODEL ERROR:", error);

    res.status(500).json({
      message: "Could not fetch models",
      error: error.message,
    });
  }
});


module.exports = router;