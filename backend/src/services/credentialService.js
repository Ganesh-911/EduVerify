const crypto = require("crypto");

const Credential = require("../models/Credential");
const Student = require("../models/Student");
const {
  generateCertificateWithHash,
} = require("./certificateService");

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
async function issueCredential(credentialId) {
  const credential = await Credential.findOne({
    credentialId: credentialId.trim().toUpperCase(),
  });

  if (!credential) {
    const error = new Error("Credential not found");
    error.statusCode = 404;
    throw error;
  }

  if (credential.status !== "DRAFT") {
    const error = new Error(
      `Credential cannot be issued because its current status is ${credential.status}`
    );
    error.statusCode = 400;
    throw error;
  }

  credential.status = "ISSUED";
  credential.issueDate = new Date();

  await credential.save();

  return credential.populate(
    "studentId",
    "studentId name email program departmentId batch graduationYear cgpa percentage"
  );
}
async function generateCredentialCertificate(credentialId) {
  const credential = await Credential.findOne({
    credentialId: credentialId.trim().toUpperCase(),
  }).populate(
    "studentId",
    "studentId name email program departmentId batch graduationYear cgpa percentage"
  );

  if (!credential) {
    const error = new Error("Credential not found");
    error.statusCode = 404;
    throw error;
  }

  if (credential.status !== "ISSUED") {
    const error = new Error(
      `Certificate can only be generated for an ISSUED credential. Current status: ${credential.status}`
    );
    error.statusCode = 400;
    throw error;
  }

  const result = await generateCertificateWithHash(credential);

  credential.documentUrl = `/certificates/${result.fileName}`;
  credential.documentHash = result.documentHash;

  await credential.save();

  return credential;
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
  issueCredential,
  generateCredentialCertificate,
};