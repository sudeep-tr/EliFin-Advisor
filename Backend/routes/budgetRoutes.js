const Transaction = require("../models/Transaction");
const express = require("express");
const router = express.Router();

const Budget = require("../models/Budget");
const protect = require("../middleware/authMiddleware");

// =====================================================
// GET ALL BUDGETS
// GET /api/budgets
// =====================================================

router.get("/", protect, async (req, res) => {
  try {
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });
    }

    const now = new Date();

    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Get current month's budgets
    const budgets = await Budget.find({
      user: userId,
      month,
      year,
    }).sort({
      createdAt: -1,
    });

    // Get current month's expense transactions
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const transactions = await Transaction.find({
      user: userId,
      type: "expense",
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    // Calculate spent for every budget
    const updatedBudgets = budgets.map((budget) => {

      const spent = transactions
        .filter(
          (transaction) =>
            transaction.category?.toLowerCase() ===
            budget.category?.toLowerCase()
        )
        .reduce(
          (total, transaction) =>
            total + Number(transaction.amount || 0),
          0
        );

      const limit = Number(
        budget.amount || budget.limit || 0
      );

      const remaining = limit - spent;

      const percentage =
        limit > 0
          ? Number(((spent / limit) * 100).toFixed(1))
          : 0;

      return {
        ...budget.toObject(),

        // Frontend-friendly values
        id: budget._id,
        limit,
        amount: limit,
        spent,
        remaining,
        percentage,
      };
    });

    res.json({
      success: true,
      budgets: updatedBudgets,
    });

  } catch (error) {

    console.error(
      "GET BUDGET ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch budgets",
      error: error.message,
    });
  }
});


// =====================================================
// GET CURRENT MONTH BUDGET
// GET /api/budgets/current
// =====================================================

router.get("/current", protect, async (req, res) => {
  try {
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId;

    const now = new Date();

    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const budgets = await Budget.find({
      user: userId,
      month,
      year,
    });

    res.json({
      success: true,
      budgets,
      month,
      year,
    });
  } catch (error) {
    console.error("CURRENT BUDGET ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch current budget",
    });
  }
});


// =====================================================
// CREATE BUDGET
// POST /api/budgets
// =====================================================

router.post("/", protect, async (req, res) => {
  try {
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });
    }

    const {
      category,
      amount,
      month,
      year,
    } = req.body;

    if (!category || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Category and amount are required",
      });
    }

    const now = new Date();

    const budgetMonth =
      month || now.getMonth() + 1;

    const budgetYear =
      year || now.getFullYear();

    // Prevent duplicate category budget
    const existingBudget = await Budget.findOne({
      user: userId,
      category,
      month: budgetMonth,
      year: budgetYear,
    });

    if (existingBudget) {
      return res.status(400).json({
        success: false,
        message:
          "Budget already exists for this category",
      });
    }

    const budget = await Budget.create({
      user: userId,
      category,
      amount: Number(amount),
      spent: 0,
      month: budgetMonth,
      year: budgetYear,
    });

    res.status(201).json({
      success: true,
      message: "Budget created successfully",
      budget,
    });
  } catch (error) {
    console.error("CREATE BUDGET ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create budget",
    });
  }
});


// =====================================================
// UPDATE BUDGET
// PUT /api/budgets/:id
// =====================================================

router.put("/:id", protect, async (req, res) => {
  try {
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId;

    const {
      category,
      amount,
    } = req.body;

    const budget = await Budget.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    if (category !== undefined) {
      budget.category = category;
    }

    if (amount !== undefined) {
      budget.amount = Number(amount);
    }

    await budget.save();

    res.json({
      success: true,
      message: "Budget updated successfully",
      budget,
    });
  } catch (error) {
    console.error("UPDATE BUDGET ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update budget",
    });
  }
});


// =====================================================
// DELETE BUDGET
// DELETE /api/budgets/:id
// =====================================================

router.delete("/:id", protect, async (req, res) => {
  try {
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId;

    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    res.json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    console.error("DELETE BUDGET ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete budget",
    });
  }
});


// =====================================================
// EXPORT
// =====================================================

module.exports = router;

