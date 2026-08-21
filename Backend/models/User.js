const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
     type: String,
     required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 18,
    },

    income: {
      type: Number,
      required: true,
      min: 0,
    },

    monthlyExpense: {
      type: Number,
      default: 0,
      min: 0,
    },

    savings: {
      type: Number,
      default: 0,
      min: 0,
    },

    riskProfile: {
      type: String,
      enum: [
        "Conservative",
        "Moderate",
        "Moderate-Aggressive",
        "Aggressive",
      ],
      default: "Moderate",
    },

    financialScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);