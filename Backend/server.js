const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const aiRoutes = require("./routes/aiRoutes");

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/ai", aiRoutes);

// Middleware



// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to EliFin API 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`EliFin server running on port ${PORT}`);
});
