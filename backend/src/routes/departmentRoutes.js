const express = require("express");

const {
  createDepartmentController,
  getAllDepartmentsController,
} = require("../controllers/departmentController");

const router = express.Router();

router.post("/", createDepartmentController);
router.get("/", getAllDepartmentsController);

module.exports = router;