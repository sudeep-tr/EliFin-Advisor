const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

const protect = require("../middleware/authMiddleware");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// =====================================================
// AI FINANCIAL ADVISOR CHAT
// POST /api/ai-advisor/chat
// =====================================================

router.post("/chat", protect, async (req, res) => {
  try {
    const { message } = req.body;

    // Validate message
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a question.",
      });
    }

    // =================================================
    // AI SYSTEM PROMPT
    // =================================================

    const systemPrompt = `
You are EliFin AI Advisor, a friendly and knowledgeable
financial education assistant.

Your job is to help users understand personal finance,
saving, budgeting, investing, SIPs, mutual funds, stocks,
fixed deposits, gold, diversification, risk management,
and financial planning.

IMPORTANT RULES:

1. Give clear and simple explanations.
2. Use Indian financial context when appropriate.
3. Use ₹ when discussing Indian currency.
4. Never guarantee investment returns.
5. Never claim that an investment is completely safe.
6. Explain risks along with potential benefits.
7. Do not encourage reckless or speculative investing.
8. Do not pretend to be a certified financial advisor.
9. For investment decisions, encourage users to consider
   their financial goals, time horizon, and risk tolerance.
10. Keep answers practical and easy for beginners to understand.
11. If the user asks something unrelated to finance,
    politely explain that you specialize in financial guidance.
12. Do not invent current market prices, returns, or news.
13. If current market data is required, tell the user that
    real-time market data is not available.

You can structure responses using:
- headings
- bullet points
- numbered lists
- short examples

Always prioritize financial education and responsible
decision-making.
`;

    // =================================================
    // CALL GROQ
    // =================================================

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message.trim(),
        },
      ],

      model: "openai/gpt-oss-20b",

      temperature: 0.5,

      max_tokens: 1000,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    // =================================================
    // RESPONSE
    // =================================================

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error(
      "AI ADVISOR ERROR:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to generate AI response.",
    });
  }
});

module.exports = router;