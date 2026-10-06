const {
  createStudent,
  getStudentForUser,
  getAllStudents,
} = require("../services/studentService");
const validateStudent = require("../validators/studentValidator");

async function createStudentController(req, res, next) {
  try {
    const validation = validateStudent(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid student data",
        errors: validation.errors,
      });
    }

    const student = await createStudent(req.body);

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    console.error("Create student error:", error.message);
    next(error);
  }
}

async function getStudentByIdController(req, res, next) {
  try {
    const { studentId } = req.params;

    if (!studentId || !studentId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    const student = await getStudentForUser(
      studentId,
      req.user
    );

    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Get student error:", error.message);
    next(error);
  }
}

async function getAllStudentsController(req, res, next) {
  try {
    const students = await getAllStudents();

    return res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Get students error:", error.message);
    next(error);
  }
}

module.exports = {
  createStudentController,
  getStudentByIdController,
  getAllStudentsController,
};