function validateStudent(data) {
  const errors = {};

  if (
    !data.studentId ||
    typeof data.studentId !== "string" ||
    !data.studentId.trim()
  ) {
    errors.studentId = "Student ID is required";
  }

  if (
    !data.name ||
    typeof data.name !== "string" ||
    !data.name.trim()
  ) {
    errors.name = "Student name is required";
  }

  if (
    !data.email ||
    typeof data.email !== "string" ||
    !data.email.trim()
  ) {
    errors.email = "Student email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Invalid email format";
  }

  if (
    !data.program ||
    typeof data.program !== "string" ||
    !data.program.trim()
  ) {
    errors.program = "Program is required";
  }

  if (!data.departmentId) {
    errors.departmentId = "Department is required";
  }

  if (
    !data.batch ||
    typeof data.batch !== "string" ||
    !data.batch.trim()
  ) {
    errors.batch = "Batch is required";
  }

  if (
    data.admissionYear === undefined ||
    !Number.isInteger(data.admissionYear)
  ) {
    errors.admissionYear = "Admission year must be an integer";
  }

  if (
    data.graduationYear === undefined ||
    !Number.isInteger(data.graduationYear)
  ) {
    errors.graduationYear = "Graduation year must be an integer";
  }

  if (
    data.cgpa === undefined ||
    typeof data.cgpa !== "number" ||
    data.cgpa < 0 ||
    data.cgpa > 10
  ) {
    errors.cgpa = "CGPA must be a number between 0 and 10";
  }

  if (
    data.percentage !== undefined &&
    data.percentage !== null &&
    (typeof data.percentage !== "number" ||
      data.percentage < 0 ||
      data.percentage > 100)
  ) {
    errors.percentage = "Percentage must be between 0 and 100";
  }

  if (
    data.academicStatus !== undefined &&
    !["ACTIVE", "GRADUATED", "SUSPENDED", "WITHDRAWN"].includes(
      data.academicStatus
    )
  ) {
    errors.academicStatus = "Invalid academic status";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

module.exports = validateStudent;