const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "Stocks",
        "Mutual Fund",
        "SIP",
        "FD",
        "Gold",
        "Bonds",
        "Crypto",
        "Other",
      ],
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    investedAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    currentValue: {
      type: Number,
      required: true,
      min: 0,
    },

    riskLevel: {
      type: String,
      enum: ["Low", "Moderate", "High"],
      default: "Moderate",
    },

    purchaseDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Investment", investmentSchema);