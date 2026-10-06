const Student = require("../models/Student");
const Department = require("../models/Department");

async function createStudent(studentData) {
  const {
    studentId,
    name,
    email,
    program,
    departmentId,
    batch,
    admissionYear,
    graduationYear,
    cgpa,
    percentage = null,
    academicStatus = "ACTIVE",
  } = studentData;

  const existingStudent = await Student.findOne({
    studentId: studentId.trim().toUpperCase(),
  });

  if (existingStudent) {
    const error = new Error("Student ID already exists");
    error.statusCode = 409;
    throw error;
  }

  const department = await Department.findOne({
    _id: departmentId,
    isActive: true,
  });

  if (!department) {
    const error = new Error("Active department not found");
    error.statusCode = 400;
    throw error;
  }

  const student = await Student.create({
    studentId: studentId.trim().toUpperCase(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    program: program.trim(),
    departmentId,
    batch: batch.trim(),
    admissionYear,
    graduationYear,
    cgpa,
    percentage,
    academicStatus,
  });

  return student;
}

async function getStudentByStudentId(studentId) {
  return Student.findOne({
    studentId: studentId.trim().toUpperCase(),
  }).populate("departmentId", "name code");
}
async function getStudentForUser(studentId, user) {
  const student = await Student.findOne({
    studentId: studentId.trim().toUpperCase(),
  }).populate("departmentId", "name code");

  if (!student) {
    const error = new Error("Student not found");
    error.statusCode = 404;
    throw error;
  }

  // Registrar and Super Admin can view any student.
  if (
    user.role === "REGISTRAR" ||
    user.role === "SUPER_ADMIN"
  ) {
    return student;
  }

  // Department Admin can view students from their own department.
  if (user.role === "DEPARTMENT_ADMIN") {
    if (
      !user.departmentId ||
      user.departmentId.toString() !==
        student.departmentId._id.toString()
    ) {
      const error = new Error(
        "You do not have access to this student's record"
      );
      error.statusCode = 403;
      throw error;
    }

    return student;
  }

  // Student can view only their own record.
  if (user.role === "STUDENT") {
    if (
      !user.studentId ||
      user.studentId.toUpperCase() !== student.studentId
    ) {
      const error = new Error(
        "You do not have access to this student's record"
      );
      error.statusCode = 403;
      throw error;
    }

    return student;
  }

  const error = new Error(
    "You do not have permission to view student records"
  );
  error.statusCode = 403;
  throw error;
}

async function getAllStudents() {
  return Student.find({
    academicStatus: {
      $ne: "WITHDRAWN",
    },
  })
    .populate("departmentId", "name code")
    .sort({ name: 1 });
}

module.exports = {
  createStudent,
  getStudentByStudentId,
  getStudentForUser,
  getAllStudents,
};