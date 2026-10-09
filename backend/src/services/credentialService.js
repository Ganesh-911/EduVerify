const fs = require("fs");
const path = require("path");
const { calculateFileHash } = require("../utils/fileHash");

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
async function activateCredential(credentialId) {
  const normalizedCredentialId = credentialId.trim().toUpperCase();

  const credential = await Credential.findOne({
    credentialId: normalizedCredentialId,
  });

  if (!credential) {
    const error = new Error("Credential not found");
    error.statusCode = 404;
    throw error;
  }

  if (credential.status !== "ISSUED") {
    const error = new Error(
      `Only ISSUED credentials can be activated. Current status: ${credential.status}`
    );
    error.statusCode = 400;
    throw error;
  }

  if (!credential.documentUrl || !credential.documentHash) {
    const error = new Error(
      "Certificate and document hash must exist before activation"
    );
    error.statusCode = 400;
    throw error;
  }

  const fileName = path.basename(credential.documentUrl);

  // Prevent paths other than the expected generated PDF filename.
  if (fileName !== credential.documentUrl.split("/").pop()) {
    const error = new Error("Invalid certificate file reference");
    error.statusCode = 400;
    throw error;
  }

  const certificatesDirectory = path.resolve(
    __dirname,
    "../../../certificates"
  );

  const filePath = path.resolve(certificatesDirectory, fileName);

  if (
    path.dirname(filePath) !== certificatesDirectory ||
    !fileName.toLowerCase().endsWith(".pdf")
  ) {
    const error = new Error("Invalid certificate file reference");
    error.statusCode = 400;
    throw error;
  }

  if (!fs.existsSync(filePath)) {
    const error = new Error("Certificate file is missing");
    error.statusCode = 400;
    throw error;
  }

  const actualHash = await calculateFileHash(filePath);

  if (actualHash !== credential.documentHash) {
    const error = new Error(
      "Certificate integrity check failed. Regenerate the certificate before activation."
    );
    error.statusCode = 409;
    throw error;
  }

  credential.status = "ACTIVE";
  await credential.save();

  return credential;
}

async function revokeCredential(credentialId, reason) {
  const normalizedCredentialId = credentialId.trim().toUpperCase();
  const normalizedReason = reason.trim();

  if (!normalizedReason) {
    const error = new Error("Revocation reason is required");
    error.statusCode = 400;
    throw error;
  }

  const credential = await Credential.findOne({
    credentialId: normalizedCredentialId,
  });

  if (!credential) {
    const error = new Error("Credential not found");
    error.statusCode = 404;
    throw error;
  }

  if (credential.status !== "ACTIVE") {
    const error = new Error(
      "Only active credentials can be revoked"
    );
    error.statusCode = 409;
    throw error;
  }

  credential.status = "REVOKED";
  credential.revokedAt = new Date();
  credential.revocationReason = normalizedReason;

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
  activateCredential,
  revokeCredential,
};