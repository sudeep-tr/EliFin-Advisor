
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: [ 
      "http://localhost:5173",
      "https://your-frontend.vercel.app",
    ],
      credentials: true,
  })
);

app.use(express.json());


// =====================================================
// ROUTES
// =====================================================

const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const investmentRoutes = require("./routes/investmentRoutes");
const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const Transaction = require("./models/Transaction");
const protect = require("./middleware/authMiddleware");
// const aiRoutes = require("./routes/aiRoutes");
const aiAdvisorRoutes = require("./routes/aiAdvisor");
app.use("/api/budgets", budgetRoutes);

app.use("/api/auth", authRoutes);


// User routes
app.use("/api/users", userRoutes);

// Transaction routes
app.use("/api/transactions", transactionRoutes);

// Investment routes
app.use("/api/investments", investmentRoutes);

// AI routes
app.use("/api/ai", aiRoutes);
app.use("/api/ai-advisor", aiAdvisorRoutes);


// =====================================================
// FINANCIAL HEALTH
// =====================================================

// =====================================================
// FINANCIAL HEALTH
// GET /api/health
// =====================================================

app.get("/api/health", protect, async (req, res) => {
  try {

    const userId =
      req.user?.userId ||
      req.user?.id ||
      req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });
    }

    // Get user's transactions
    const transactions = await Transaction.find({
      user: userId,
    });

    let totalIncome = 0;
    let totalExpenses = 0;

    // Calculate income and expenses
    transactions.forEach((transaction) => {

      const amount =
        Number(transaction.amount) || 0;

      if (transaction.type === "income") {
        totalIncome += amount;
      }

      if (transaction.type === "expense") {
        totalExpenses += amount;
      }

    });

    // ==========================================
    // BASIC CALCULATIONS
    // ==========================================

    const savings =
      totalIncome - totalExpenses;

    const savingsRate =
      totalIncome > 0
        ? (savings / totalIncome) * 100
        : 0;

    const expenseRate =
      totalIncome > 0
        ? (totalExpenses / totalIncome) * 100
        : 100;


    // ==========================================
    // HEALTH SCORE
    // ==========================================

    let savingsScore = 0;
    let expenseScore = 0;
    let incomeScore = 0;
    let bufferScore = 0;


    // Savings: 40 points
    if (savingsRate >= 50) {
      savingsScore = 40;
    } else if (savingsRate >= 30) {
      savingsScore = 32;
    } else if (savingsRate >= 20) {
      savingsScore = 24;
    } else if (savingsRate >= 10) {
      savingsScore = 15;
    } else if (savingsRate > 0) {
      savingsScore = 8;
    }


    // Expense control: 25 points
    if (expenseRate <= 30) {
      expenseScore = 25;
    } else if (expenseRate <= 50) {
      expenseScore = 20;
    } else if (expenseRate <= 70) {
      expenseScore = 15;
    } else if (expenseRate <= 90) {
      expenseScore = 8;
    }


    // Income consistency: 10 points
    const incomeTransactions =
      transactions.filter(
        (transaction) =>
          transaction.type === "income"
      );

    if (incomeTransactions.length > 0) {
      incomeScore = 10;
    }


    // Financial buffer: 10 points
    if (savings > 0) {
      bufferScore = 10;
    }


    // Remaining 15 points for spending distribution
    let spendingScore = 15;

    if (totalExpenses > 0) {

      const categoryExpenses = {};

      transactions
        .filter(
          (transaction) =>
            transaction.type === "expense"
        )
        .forEach((transaction) => {

          const category =
            transaction.category || "Other";

          categoryExpenses[category] =
            (categoryExpenses[category] || 0) +
            Number(transaction.amount || 0);

        });


      const amounts =
        Object.values(categoryExpenses);

      if (amounts.length > 0) {

        const largestCategory =
          Math.max(...amounts);

        const largestCategoryRate =
          (largestCategory / totalExpenses) * 100;

        if (largestCategoryRate > 70) {
          spendingScore = 5;
        } else if (largestCategoryRate > 50) {
          spendingScore = 10;
        }

      }

    }


    // ==========================================
    // FINAL SCORE
    // ==========================================

    let score =
      savingsScore +
      expenseScore +
      spendingScore +
      incomeScore +
      bufferScore;

    score = Math.max(
      0,
      Math.min(100, score)
    );


    // ==========================================
    // HEALTH LEVEL
    // ==========================================

    let level;
    let message;

    if (score >= 80) {

      level = "Excellent";

      message =
        "Excellent financial habits! Keep maintaining your healthy savings and spending patterns.";

    } else if (score >= 60) {

      level = "Good";

      message =
        "Your financial health is looking good. Keep improving your savings and spending habits.";

    } else if (score >= 40) {

      level = "Fair";

      message =
        "Your finances are fairly stable, but there is room for improvement.";

    } else {

      level = "Needs Improvement";

      message =
        "Your finances need some attention. Focus on controlling expenses and increasing savings.";

    }


    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({

      success: true,

      health: {

        score,

        level,

        message,

        breakdown: {

          savings: savingsScore,

          expenses: expenseScore,

          budget: spendingScore,

          emergency: bufferScore,

        },

        details: {

          totalIncome,

          totalExpenses,

          savings,

          savingsRate:
            Number(
              savingsRate.toFixed(1)
            ),

          expenseRate:
            Number(
              expenseRate.toFixed(1)
            ),

        },

      },

    });

  } catch (error) {

    console.error(
      "HEALTH ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Unable to calculate financial health.",

      error: error.message,

    });

  }

});


// =====================================================
// ROOT ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EliFin Backend API is running 🚀",
  });
});


// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});


// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error(
    "SERVER ERROR:",
    err
  );

  res.status(500).json({
    success: false,
    message:
      err.message ||
      "Internal server error",
  });
});


// =====================================================
// MONGODB CONNECTION
// =====================================================

const PORT =
  process.env.PORT || 5000;

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI;


if (!MONGO_URI) {

  console.error(
    "❌ MongoDB connection string not found."
  );

  console.error(
    "Add MONGO_URI to your .env file."
  );

  process.exit(1);
}


mongoose
  .connect(MONGO_URI)
  .then(() => {

    console.log(
      "✅ MongoDB connected successfully"
    );

    app.listen(
      PORT,
      () => {

        console.log(
          `🚀 EliFin server running on port ${PORT}`
        );

        console.log(
          `🌐 http://localhost:${PORT}`
        );

      }
    );

  })
  .catch((error) => {

    console.error(
      "❌ MongoDB connection failed:"
    );

    console.error(
      error.message
    );

    process.exit(1);

  });

