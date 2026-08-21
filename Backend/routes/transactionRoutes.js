const express = require("express");
const Transaction = require("../models/Transaction");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const {
      type,
      amount,
      category,
      description,
      date
    } = req.body;

    const transaction = await Transaction.create({
      user: req.user.userId,
      type,
      amount,
      category,
      description,
      date
    });

    res.status(201).json({
      message: "Transaction added successfully",
      transaction
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});
router.get("/", protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.userId
    }).sort({ date: -1 });

    res.status(200).json({
      message: "Transactions fetched successfully",
      transactions
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});
router.get("/summary", protect, async (req, res) => {
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

    const savingsRate =
      totalIncome > 0
        ? ((savings / totalIncome) * 100).toFixed(2)
        : 0;

    res.status(200).json({
      message: "Financial summary fetched successfully",
      summary: {
        totalIncome,
        totalExpenses,
        savings,
        savingsRate: Number(savingsRate),
        categoryExpenses
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});
router.get("/health-score", protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.userId
    });

    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      }

      if (transaction.type === "expense") {
        totalExpenses += transaction.amount;
      }
    });

    if (totalIncome === 0) {
      return res.status(200).json({
        message: "Not enough data to calculate health score",
        healthScore: 0
      });
    }

    const savings = totalIncome - totalExpenses;
    const savingsRate = (savings / totalIncome) * 100;
    const expenseRate = (totalExpenses / totalIncome) * 100;

    let score = 0;

    // Savings score
    if (savingsRate >= 30) {
      score += 40;
    } else if (savingsRate >= 20) {
      score += 30;
    } else if (savingsRate >= 10) {
      score += 20;
    } else if (savingsRate > 0) {
      score += 10;
    }

    // Expense score
    if (expenseRate <= 50) {
      score += 30;
    } else if (expenseRate <= 70) {
      score += 20;
    } else if (expenseRate <= 90) {
      score += 10;
    }

    // Positive savings bonus
    if (savings > 0) {
      score += 20;
    }

    // Score range
    score = Math.min(score, 100);

    let status;

    if (score >= 80) {
      status = "Excellent";
    } else if (score >= 60) {
      status = "Good";
    } else if (score >= 40) {
      status = "Fair";
    } else {
      status = "Needs Improvement";
    }

    res.status(200).json({
      message: "Financial health score calculated",
      healthScore: score,
      status,
      details: {
        totalIncome,
        totalExpenses,
        savings,
        savingsRate: Number(savingsRate.toFixed(2)),
        expenseRate: Number(expenseRate.toFixed(2))
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});
router.get("/spending-analysis", protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.userId,
      type: "expense"
    });

    let totalExpenses = 0;
    const categoryExpenses = {};

    transactions.forEach((transaction) => {
      totalExpenses += transaction.amount;

      if (!categoryExpenses[transaction.category]) {
        categoryExpenses[transaction.category] = 0;
      }

      categoryExpenses[transaction.category] += transaction.amount;
    });

    const categories = Object.entries(categoryExpenses)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage:
          totalExpenses > 0
            ? Number(((amount / totalExpenses) * 100).toFixed(2))
            : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    const highestCategory =
      categories.length > 0 ? categories[0] : null;

    res.status(200).json({
      message: "Spending analysis fetched successfully",
      totalExpenses,
      categories,
      highestCategory
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});
router.get("/recommendations", protect, async (req, res) => {
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

    if (totalIncome === 0) {
      return res.status(200).json({
        message: "Not enough financial data",
        recommendations: [
          "Add your income and expenses to receive personalized recommendations."
        ]
      });
    }

    const savings = totalIncome - totalExpenses;
    const savingsRate = (savings / totalIncome) * 100;
    const expenseRate = (totalExpenses / totalIncome) * 100;

    const recommendations = [];

    // Savings recommendation
    if (savingsRate < 10) {
      recommendations.push(
        "Your savings rate is below 10%. Try reducing unnecessary expenses and aim to save at least 10% of your income."
      );
    } else if (savingsRate < 20) {
      recommendations.push(
        "Your savings rate is moderate. Try increasing it toward 20% of your income."
      );
    } else {
      recommendations.push(
        "Great job maintaining a healthy savings rate. Consider investing part of your surplus for long-term goals."
      );
    }

    // Expense recommendation
    if (expenseRate > 80) {
      recommendations.push(
        "Your expenses are more than 80% of your income. Review your discretionary spending and identify areas where you can cut costs."
      );
    } else if (expenseRate > 60) {
      recommendations.push(
        "Your expenses are taking a significant portion of your income. Consider setting monthly spending limits."
      );
    }

    // Category recommendation
    const categories = Object.entries(categoryExpenses)
      .sort((a, b) => b[1] - a[1]);

    if (categories.length > 0) {
      const [highestCategory, highestAmount] = categories[0];

      const percentage =
        (highestAmount / totalExpenses) * 100;

      if (percentage > 30) {
        recommendations.push(
          `${highestCategory} is your largest expense category at ${percentage.toFixed(1)}% of total expenses. Consider setting a budget for this category.`
        );
      }
    }

    // Positive recommendation
    if (savingsRate >= 20) {
      recommendations.push(
        "Your finances show a strong savings pattern. Consider building an emergency fund and investing for long-term goals."
      );
    }

    res.status(200).json({
      message: "Personalized recommendations generated",
      financialSummary: {
        totalIncome,
        totalExpenses,
        savings,
        savingsRate: Number(savingsRate.toFixed(2))
      },
      recommendations
    });

  } catch (error) {
    console.error("RECOMMENDATION ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});
router.put("/:id", protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    const {
      type,
      amount,
      category,
      description,
      date
    } = req.body;

    transaction.type = type || transaction.type;
    transaction.amount = amount || transaction.amount;
    transaction.category = category || transaction.category;
    transaction.description = description || transaction.description;
    transaction.date = date || transaction.date;

    await transaction.save();

    res.status(200).json({
      message: "Transaction updated successfully",
      transaction
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});
router.delete("/:id", protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    await transaction.deleteOne();

    res.status(200).json({
      message: "Transaction deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;