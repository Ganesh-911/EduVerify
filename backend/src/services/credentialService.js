const crypto = require("crypto");

const Credential = require("../models/Credential");
const Student = require("../models/Student");

function generateCredentialId() {
  const randomPart = crypto.randomBytes(6).toString("hex").toUpperCase();

  return `EV-${new Date().getFullYear()}-${randomPart}`;
}

async function createCredential({
  studentId,
  credentialType,
}) {
  const student = await Student.findOne({
    studentId: studentId.trim().toUpperCase(),
    academicStatus: {
      $ne: "WITHDRAWN",
    },
  });

  if (!student) {
    const error = new Error("Student not found");
    error.statusCode = 404;
    throw error;
  }

  const credentialId = generateCredentialId();

  const credential = await Credential.create({
    credentialId,
    studentId: student._id,
    credentialType: credentialType.trim(),
    status: "DRAFT",
  });

  return credential.populate(
    "studentId",
    "studentId name email program departmentId batch graduationYear cgpa percentage"
  );
}

async function getCredentialById(credentialId) {
  return Credential.findOne({
    credentialId: credentialId.trim().toUpperCase(),
  }).populate(
    "studentId",
    "studentId name email program departmentId batch graduationYear cgpa percentage"
  );
}

module.exports = {
  createCredential,
  getCredentialById,
};