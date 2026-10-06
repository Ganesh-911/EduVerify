const express = require("express");

const {
  createStudentController,
  getStudentByIdController,
  getAllStudentsController,
} = require("../controllers/studentController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const router = express.Router();

// Create a student — Registrar / Super Admin only
router.post(
  "/",
  authenticateToken,
  authorizeRoles("REGISTRAR", "SUPER_ADMIN"),
  createStudentController
);

// Get one student — authenticated users for now
router.get(
  "/:studentId",
  authenticateToken,
  getStudentByIdController
);

// Get all students — Registrar / Super Admin / Department Admin
router.get(
  "/",
  authenticateToken,
  authorizeRoles(
    "REGISTRAR",
    "SUPER_ADMIN",
    "DEPARTMENT_ADMIN"
  ),
  getAllStudentsController
);

module.exports = router;