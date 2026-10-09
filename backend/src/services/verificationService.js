const Credential = require("../models/Credential");

async function verifyCredential(credentialId) {
  const normalizedCredentialId = credentialId.trim().toUpperCase();

  const credential = await Credential.findOne({
    credentialId: normalizedCredentialId,
  }).populate(
    "studentId",
    "studentId name program departmentId batch graduationYear"
  );

  if (!credential) {
    return {
      result: "NOT_FOUND",
      message: "No credential was found for the provided ID.",
      credential: null,
    };
  }

  if (!credential.studentId) {
    return {
      result: "REVIEW_REQUIRED",
      message: "The credential's linked student record could not be found.",
      credential: null,
    };
  }

  if (credential.status === "REVOKED") {
    return {
      result: "REVOKED",
      message: "This credential has been revoked by the institution.",
      credential: {
        credentialId: credential.credentialId,
        credentialType: credential.credentialType,
        status: credential.status,
        issueDate: credential.issueDate,
        revokedAt: credential.revokedAt,
        revocationReason: credential.revocationReason,
        student: {
          name: credential.studentId.name,
          studentId: credential.studentId.studentId,
          program: credential.studentId.program,
          batch: credential.studentId.batch,
          graduationYear: credential.studentId.graduationYear,
        },
      },
    };
  }

  if (credential.status !== "ACTIVE") {
    return {
      result: "NOT_ACTIVE",
      message: "This credential has not been activated for public verification.",
      credential: {
        credentialId: credential.credentialId,
        credentialType: credential.credentialType,
        status: credential.status,
      },
    };
  }

  return {
    result: "VERIFIED",
    message: "The credential is active in the institutional records.",
    credential: {
      credentialId: credential.credentialId,
      credentialType: credential.credentialType,
      status: credential.status,
      issueDate: credential.issueDate,
      student: {
        name: credential.studentId.name,
        studentId: credential.studentId.studentId,
        program: credential.studentId.program,
        batch: credential.studentId.batch,
        graduationYear: credential.studentId.graduationYear,
      },
    },
  };
}

module.exports = {
  verifyCredential,
};