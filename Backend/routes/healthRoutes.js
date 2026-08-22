const express = require("express");

const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// FINANCIAL HEALTH SCORE
// ==========================================

router.get("/", protect, async (req, res) => {

  try {

    const userId = req.user.userId;

    // ----------------------------------------
    // CURRENT MONTH
    // ----------------------------------------

    const now = new Date();

    const month = now.getMonth() + 1;
    const year = now.getFullYear();


    // ----------------------------------------
    // TRANSACTIONS
    // ----------------------------------------

    const transactions =
      await Transaction.find({
        user: userId
      });


    let totalIncome = 0;
    let totalExpenses = 0;

    const categoryExpenses = {};


    transactions.forEach((transaction) => {

      const date =
        new Date(transaction.date);

      const transactionMonth =
        date.getMonth() + 1;

      const transactionYear =
        date.getFullYear();


      // Only current month

      if (
        transactionMonth !== month ||
        transactionYear !== year
      ) {
        return;
      }


      if (transaction.type === "income") {

        totalIncome += transaction.amount;

      }


      if (transaction.type === "expense") {

        totalExpenses += transaction.amount;


        categoryExpenses[
          transaction.category
        ] =
          (
            categoryExpenses[
              transaction.category
            ] || 0
          ) + transaction.amount;

      }

    });


    // ----------------------------------------
    // BASIC CALCULATIONS
    // ----------------------------------------

    const savings =
      totalIncome - totalExpenses;


    const savingsRate =
      totalIncome > 0
        ? (savings / totalIncome) * 100
        : 0;


    // ========================================
    // 1. SAVINGS SCORE
    // Maximum = 40
    // ========================================

    let savingsScore = 0;


    if (savingsRate >= 30) {

      savingsScore = 40;

    } else if (savingsRate >= 20) {

      savingsScore = 32;

    } else if (savingsRate >= 15) {

      savingsScore = 25;

    } else if (savingsRate >= 10) {

      savingsScore = 18;

    } else if (savingsRate > 0) {

      savingsScore = 10;

    }


    // ========================================
    // 2. EXPENSE CONTROL
    // Maximum = 25
    // ========================================

    const expenseRate =
      totalIncome > 0
        ? (totalExpenses / totalIncome) * 100
        : 100;


    let expenseScore = 0;


    if (expenseRate <= 50) {

      expenseScore = 25;

    } else if (expenseRate <= 60) {

      expenseScore = 21;

    } else if (expenseRate <= 70) {

      expenseScore = 17;

    } else if (expenseRate <= 80) {

      expenseScore = 12;

    } else if (expenseRate <= 90) {

      expenseScore = 6;

    }


    // ========================================
    // 3. BUDGET ADHERENCE
    // Maximum = 20
    // ========================================

    const budgets =
      await Budget.find({
        user: userId,
        month,
        year
      });


    let budgetScore = 20;


    if (budgets.length > 0) {

      let exceeded = 0;


      budgets.forEach((budget) => {

        const spent =
          categoryExpenses[
            budget.category
          ] || 0;


        if (spent > budget.limit) {
          exceeded++;
        }

      });


      if (exceeded > 0) {

        budgetScore = Math.max(
          0,
          20 - exceeded * 5
        );

      }

    }


    // ========================================
    // 4. EMERGENCY FUND
    // Maximum = 15
    // ========================================

    let emergencyScore = 0;


    /*
      Basic estimate:
      3 months of current expenses
    */

    const emergencyTarget =
      totalExpenses * 3;


    if (
      emergencyTarget > 0 &&
      savings >= emergencyTarget
    ) {

      emergencyScore = 15;

    } else if (
      emergencyTarget > 0 &&
      savings >=
        emergencyTarget * 0.66
    ) {

      emergencyScore = 10;

    } else if (
      emergencyTarget > 0 &&
      savings >=
        emergencyTarget * 0.33
    ) {

      emergencyScore = 5;

    }


    // ========================================
    // FINAL SCORE
    // ========================================

    const score = Math.min(
      100,
      Math.round(
        savingsScore +
        expenseScore +
        budgetScore +
        emergencyScore
      )
    );


    // ========================================
    // HEALTH LEVEL
    // ========================================

    let level;
    let message;


    if (score >= 80) {

      level = "Excellent";

      message =
        "Your finances are in excellent shape. Keep maintaining your savings and spending habits.";

    } else if (score >= 60) {

      level = "Good";

      message =
        "Your financial position is healthy, but there is still room to improve.";

    } else if (score >= 40) {

      level = "Fair";

      message =
        "Your finances are reasonably stable, but some areas need attention.";

    } else {

      level = "Needs Improvement";

      message =
        "Focus on controlling expenses and building your savings.";

    }


    // ========================================
    // RESPONSE
    // ========================================

    res.json({

      message:
        "Financial health calculated successfully",

      health: {

        score,

        level,

        message,

        savingsRate:
          Number(
            savingsRate.toFixed(1)
          ),

        expenseRate:
          Number(
            expenseRate.toFixed(1)
          ),

        breakdown: {

          savings:
            savingsScore,

          expenses:
            expenseScore,

          budget:
            budgetScore,

          emergency:
            emergencyScore

        },

        financialData: {

          totalIncome,

          totalExpenses,

          savings,

          categoryExpenses

        }

      }

    });

  } catch (error) {

    console.error(
      "HEALTH ERROR:",
      error
    );

    res.status(500).json({

      message:
        "Could not calculate financial health",

      error: error.message

    });

  }

});


module.exports = router;