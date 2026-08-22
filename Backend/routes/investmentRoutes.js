const express = require("express");

const Investment = require("../models/Investment");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// GET ALL INVESTMENTS
// ==========================================

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

    const investments = await Investment.find({
      user: userId,
    }).sort({ createdAt: -1 });

    console.log("USER ID:", userId);
    console.log("INVESTMENTS FOUND:", investments.length);

    res.status(200).json({
      success: true,
      investments,
    });

  } catch (error) {
    console.error("GET INVESTMENTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ==========================================
// ADD INVESTMENT
// ==========================================
router.post("/", protect, async (req, res) => {
  try {
    console.log("AUTH USER:", req.user);

    const userId = req.user?.id || req.user?._id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in authentication token",
      });
    }

    const investment = await Investment.create({
      user: userId,

      name: req.body.name,
      type: req.body.type || "SIP",
      category: req.body.category || "Mutual Fund",

      monthlyAmount: Number(req.body.monthlyAmount) || 0,
      investedAmount: Number(req.body.investedAmount) || 0,
      currentValue: Number(req.body.currentValue) || 0,

      frequency: req.body.frequency || "monthly",
      startDate: req.body.startDate,
      notes: req.body.notes || "",
    });

    res.status(201).json({
      success: true,
      message: "Investment added successfully",
      investment,
    });

  } catch (error) {
    console.error("ADD INVESTMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ==========================================
// UPDATE INVESTMENT
// ==========================================

router.put("/:id", protect, async (req, res) => {
  try {

    const investment =
      await Investment.findOne({
        _id: req.params.id,
        user: req.user.userId,
      });


    if (!investment) {
      return res.status(404).json({
        message: "Investment not found",
      });
    }


    const {
      name,
      type,
      category,
      monthlyAmount,
      investedAmount,
      currentValue,
      startDate,
      frequency,
      notes,
    } = req.body;


    investment.name =
      name ?? investment.name;

    investment.type =
      type ?? investment.type;

    investment.category =
      category ?? investment.category;

    investment.monthlyAmount =
      monthlyAmount !== undefined
        ? Number(monthlyAmount)
        : investment.monthlyAmount;

    investment.investedAmount =
      investedAmount !== undefined
        ? Number(investedAmount)
        : investment.investedAmount;

    investment.currentValue =
      currentValue !== undefined
        ? Number(currentValue)
        : investment.currentValue;

    investment.startDate =
      startDate ?? investment.startDate;

    investment.frequency =
      frequency ?? investment.frequency;

    investment.notes =
      notes ?? investment.notes;


    await investment.save();


    res.status(200).json({
      message:
        "Investment updated successfully",

      investment,
    });

  } catch (error) {

    console.error(
      "UPDATE INVESTMENT ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Unable to update investment",

      error: error.message,
    });
  }
});


// ==========================================
// DELETE INVESTMENT
// ==========================================

router.delete("/:id", protect, async (req, res) => {
  try {

    const investment =
      await Investment.findOneAndDelete({
        _id: req.params.id,
        user: req.user.userId,
      });


    if (!investment) {
      return res.status(404).json({
        message: "Investment not found",
      });
    }


    res.status(200).json({
      message:
        "Investment deleted successfully",
    });

  } catch (error) {

    console.error(
      "DELETE INVESTMENT ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Unable to delete investment",

      error: error.message,
    });
  }
});


// ==========================================
// PORTFOLIO SUMMARY
// ==========================================

router.get("/summary", protect, async (req, res) => {
  try {
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId;

    const investments = await Investment.find({
      user: userId,
    });

    const totalInvested = investments.reduce(
      (sum, item) => sum + Number(item.investedAmount || 0),
      0
    );

    const totalCurrentValue = investments.reduce(
      (sum, item) => sum + Number(item.currentValue || 0),
      0
    );

    const totalReturns =
      totalCurrentValue - totalInvested;

    const returnPercentage =
      totalInvested > 0
        ? ((totalReturns / totalInvested) * 100).toFixed(2)
        : 0;

    const totalMonthlySIP = investments.reduce(
      (sum, item) => sum + Number(item.monthlyAmount || 0),
      0
    );

    res.json({
      success: true,
      summary: {
        totalInvested,
        totalCurrentValue,
        totalReturns,
        returnPercentage: Number(returnPercentage),
        totalMonthlySIP,
        investmentCount: investments.length,
      },
    });

  } catch (error) {
    console.error("PORTFOLIO SUMMARY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

