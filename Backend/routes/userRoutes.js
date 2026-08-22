const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "Profile fetched successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});
router.put("/profile", protect, async (req, res) => {
  try {
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId;

    const { name, email, age, income, password } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (age !== undefined) user.age = age;
    if (income !== undefined) user.income = income;

    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        income: user.income,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
});

module.exports = router;