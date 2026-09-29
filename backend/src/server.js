const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

// Request body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EduVerify API is running",
    environment: process.env.NODE_ENV,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`EduVerify API running on http://localhost:${PORT}`);
});