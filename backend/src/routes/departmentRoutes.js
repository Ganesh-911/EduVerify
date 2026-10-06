const express = require("express");

const {
  createDepartmentController,
  getAllDepartmentsController,
} = require("../controllers/departmentController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  authorizeRoles("REGISTRAR", "SUPER_ADMIN"),
  createDepartmentController
);

router.get("/", getAllDepartmentsController);

module.exports = router;