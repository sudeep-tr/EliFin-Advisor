const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

const protect = require("../middleware/authMiddleware");
const Investment = require("../models/Investment");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ==========================================
// AI PORTFOLIO ADVICE
// ==========================================

router.post("/portfolio-advice", protect, async (req, res) => {
  try {
    console.log("================================");
    console.log("AI PORTFOLIO REQUEST");
    console.log("REQ.USER:", req.user);
    console.log("================================");

    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId;

    if (!userId) {
      console.log("❌ NO USER ID");

      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });
    }

    console.log("✅ AI USER ID:", userId);

    // ==========================================
    // GET USER INVESTMENTS
    // ==========================================

    const investments = await Investment.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    console.log(
      "📊 AI INVESTMENTS FOUND:",
      investments.length
    );

    console.log(
      "📊 INVESTMENTS:",
      investments
    );

    // ==========================================
    // NO INVESTMENTS
    // ==========================================

    if (investments.length === 0) {
      return res.json({
        success: true,
        advice: `
## 🤖 EliFin AI Advisor

You don't have any investments added yet.

### 💡 Suggestions

- Start by defining your financial goals.
- Build an emergency fund.
- Consider starting a disciplined SIP.
- Choose investments according to your risk tolerance.

> This information is for general financial education, not personalized financial advice.
        `,
      });
    }

    // ==========================================
    // CALCULATE PORTFOLIO
    // ==========================================

    const totalInvested = investments.reduce(
      (sum, investment) =>
        sum + Number(investment.investedAmount || 0),
      0
    );

    const totalCurrentValue = investments.reduce(
      (sum, investment) =>
        sum + Number(investment.currentValue || 0),
      0
    );

    const totalReturns =
      totalCurrentValue - totalInvested;

    const returnPercentage =
      totalInvested > 0
        ? Number(
            (
              (totalReturns / totalInvested) *
              100
            ).toFixed(2)
          )
        : 0;

    const totalMonthlySIP = investments.reduce(
      (sum, investment) =>
        sum + Number(investment.monthlyAmount || 0),
      0
    );

    // ==========================================
    // PORTFOLIO DATA FOR AI
    // ==========================================

    const portfolioData = {
      totalInvested,
      totalCurrentValue,
      totalReturns,
      returnPercentage,
      totalMonthlySIP,
      investmentCount: investments.length,

      investments: investments.map(
        (investment) => ({
          name: investment.name,
          type: investment.type,
          category: investment.category,
          monthlyAmount: Number(
            investment.monthlyAmount || 0
          ),
          investedAmount: Number(
            investment.investedAmount || 0
          ),
          currentValue: Number(
            investment.currentValue || 0
          ),
          frequency: investment.frequency,
          startDate: investment.startDate,
        })
      ),
    };

    console.log(
      "📈 PORTFOLIO DATA SENT TO GROQ:"
    );

    console.log(
      JSON.stringify(
        portfolioData,
        null,
        2
      )
    );

    // ==========================================
    // GROQ PROMPT
    // ==========================================

    const prompt = `
You are EliFin, an AI financial education assistant.

Analyze the user's investment portfolio below.

PORTFOLIO DATA:

${JSON.stringify(
  portfolioData,
  null,
  2
)}

Provide a clear and useful portfolio analysis.

Include these sections:

## 🤖 EliFin AI Advisor

### 📊 Portfolio Performance
Explain:
- Total invested
- Current portfolio value
- Absolute gain/loss
- Return percentage

### 🎯 Portfolio Diversification
Explain whether the portfolio is concentrated or diversified.

### 💡 Practical Suggestions
Give 4-5 useful suggestions based ONLY on the available portfolio data.

### ⚠️ Things to Watch
Mention relevant risks such as:
- Market risk
- Concentration risk
- Liquidity risk
- Long-term volatility

### 🚀 Next Steps
Give simple actions the investor can consider.

Important rules:

- Use Indian Rupee (₹).
- Do not invent investments or financial information.
- Do not claim that past performance guarantees future returns.
- Do not call an absolute return an annualized return.
- Clearly distinguish absolute return from annualized return.
- This is general financial education, not personalized regulated financial advice.
- Keep the response easy for a college student to understand.
- Use Markdown.
`;

    // ==========================================
    // CALL GROQ
    // ==========================================

    console.log("🤖 Calling Groq...");

    const completion =
      await groq.chat.completions.create({
        model:  "openai/gpt-oss-20b",

        messages: [
          {
            role: "system",
            content:
              "You are EliFin, a helpful financial education assistant.",
          },

          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.4,

        max_tokens: 1500,
      });

    const advice =
      completion.choices?.[0]?.message?.content ||
      "";

    console.log("✅ GROQ RESPONSE RECEIVED");

    // ==========================================
    // SEND RESPONSE
    // ==========================================

    return res.json({
      success: true,

      advice,

      portfolio: {
        totalInvested,
        totalCurrentValue,
        totalReturns,
        returnPercentage,
        totalMonthlySIP,
        investmentCount:
          investments.length,
      },
    });

  } catch (error) {
    console.error(
      "❌ AI PORTFOLIO ADVICE ERROR:"
    );

    console.error(error);

    return res.status(500).json({
      success: false,

      message:
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to generate AI advice",
    });
  }
});

module.exports = router;