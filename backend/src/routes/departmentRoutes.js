const express = require("express");

const {
  createDepartmentController,
  getAllDepartmentsController,
} = require("../controllers/departmentController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, createDepartmentController);
router.get("/", getAllDepartmentsController);

module.exports = router;