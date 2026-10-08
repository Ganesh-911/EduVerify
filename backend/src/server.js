const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");

const connectDatabase = require("./config/database");
const departmentRoutes = require("./routes/departmentRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const studentRoutes = require("./routes/studentRoutes");
const credentialRoutes = require("./routes/credentialRoutes");
const certificateRoutes = require("./routes/certificateRoutes");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/departments", departmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/credentials", credentialRoutes);
app.use("/api/certificates", certificateRoutes);
app.use(errorHandler);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EduVerify API is running",
    environment: process.env.NODE_ENV,
  });
});

async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(
      `EduVerify API running on http://localhost:${PORT}`
    );
  });
}

startServer();