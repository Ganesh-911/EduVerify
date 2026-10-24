const fs = require("fs");
const path = require("path");
const { calculateFileHash } = require("../utils/fileHash");

const crypto = require("crypto");

const Credential = require("../models/Credential");
const Student = require("../models/Student");
const {
  generateCertificateWithHash,
} = require("./certificateService");
const AuditLog = require("../models/AuditLog");

function generateCredentialId() {
  const randomPart = crypto.randomBytes(6).toString("hex").toUpperCase();

  return `EV-${new Date().getFullYear()}-${randomPart}`;
}


async function createCredential({
  studentId,
  credentialType,
}, actor) {
  const session = await Credential.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const student = await Student.findOne({
        studentId: studentId.trim().toUpperCase(),
        academicStatus: {
          $ne: "WITHDRAWN",
        },
      }).session(session);

      if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
      }

      const credentialId = generateCredentialId();

      const [credential] = await Credential.create(
        [
          {
            credentialId,
            studentId: student._id,
            credentialType: credentialType.trim(),
            status: "DRAFT",
          },
        ],
        { session }
      );

      await AuditLog.create(
        [
          {
            actorId: actor.id,
            actorRole: actor.role,
            action: "CREDENTIAL_CREATED",
            credentialId: credential.credentialId,
            previousStatus: null,
            newStatus: credential.status,
          },
        ],
        { session }
      );

      result = credential;
    });

    return await result.populate(
      "studentId",
      "studentId name email program departmentId batch graduationYear cgpa percentage"
    );
  } finally {
    await session.endSession();
  }
}



async function issueCredential(credentialId, actor) {
  const session = await Credential.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const credential = await Credential.findOne({
        credentialId: credentialId.trim().toUpperCase(),
      }).session(session);

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

      const previousStatus = credential.status;

      credential.status = "ISSUED";
      credential.issueDate = new Date();

      await credential.save({ session });

      await AuditLog.create(
        [
          {
            actorId: actor.id,
            actorRole: actor.role,
            action: "CREDENTIAL_ISSUED",
            credentialId: credential.credentialId,
            previousStatus,
            newStatus: credential.status,
          },
        ],
        { session }
      );

      result = credential;
    });

    return await result.populate(
      "studentId",
      "studentId name email program departmentId batch graduationYear cgpa percentage"
    );
  } finally {
    await session.endSession();
  }
}
async function generateCredentialCertificate(credentialId, actor) {
  const normalizedCredentialId = credentialId.trim().toUpperCase();

  // Read the credential before generating the PDF.
  const existingCredential = await Credential.findOne({
    credentialId: normalizedCredentialId,
  }).populate(
    "studentId",
    "studentId name email program departmentId batch graduationYear cgpa percentage"
  );

  if (!existingCredential) {
    const error = new Error("Credential not found");
    error.statusCode = 404;
    throw error;
  }

  if (existingCredential.status !== "ISSUED") {
    const error = new Error(
      `Certificate cannot be generated because the current status is ${existingCredential.status}`
    );
    error.statusCode = 400;
    throw error;
  }

  // File generation happens outside the transaction.
  // Do not delete this file if the transaction fails:
  // it may have overwritten a previously valid PDF.
  const pdfResult = await generateCertificateWithHash(
    existingCredential
  );

  const session = await Credential.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      // Recheck the current database state inside the transaction.
      const credential = await Credential.findOne({
        credentialId: normalizedCredentialId,
      })
        .session(session)
        .populate(
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
          `Certificate cannot be generated because the current status is ${credential.status}`
        );
        error.statusCode = 409;
        throw error;
      }

      const previousStatus = credential.status;

      credential.documentUrl = `/certificates/${pdfResult.fileName}`;
      credential.documentHash = pdfResult.documentHash;

      await credential.save({ session });

      await AuditLog.create(
        [
          {
            actorId: actor.id,
            actorRole: actor.role,
            action: "CERTIFICATE_GENERATED",
            credentialId: credential.credentialId,
            previousStatus,
            newStatus: credential.status,
            metadata: {
              documentUrl: credential.documentUrl,
              documentHash: credential.documentHash,
            },
          },
        ],
        { session }
      );

      result = credential;
    });

    return result;
  } finally {
    await session.endSession();
  }
}
async function activateCredential(credentialId, actor) {
  const session = await Credential.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const normalizedCredentialId = credentialId.trim().toUpperCase();

      const credential = await Credential.findOne({
        credentialId: normalizedCredentialId,
      }).session(session);

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

      const previousStatus = credential.status;

      credential.status = "ACTIVE";
      await credential.save({ session });

      await AuditLog.create(
        [
          {
            actorId: actor.id,
            actorRole: actor.role,
            action: "CREDENTIAL_ACTIVATED",
            credentialId: credential.credentialId,
            previousStatus,
            newStatus: credential.status,
          },
        ],
        { session }
      );

      result = credential;
    });

    return result;
  } finally {
    await session.endSession();
  }
}



async function revokeCredential(credentialId, reason, actor) {
  const normalizedCredentialId = credentialId.trim().toUpperCase();
  const normalizedReason = reason.trim();
  const session = await Credential.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      if (!normalizedReason) {
        const error = new Error("Revocation reason is required");
        error.statusCode = 400;
        throw error;
      }

      const credential = await Credential.findOne({
        credentialId: normalizedCredentialId,
      }).session(session);

      if (!credential) {
        const error = new Error("Credential not found");
        error.statusCode = 404;
        throw error;
      }

      if (credential.status !== "ACTIVE") {
        const error = new Error("Only active credentials can be revoked");
        error.statusCode = 409;
        throw error;
      }

      const previousStatus = credential.status;

      credential.status = "REVOKED";
      credential.revokedAt = new Date();
      credential.revocationReason = normalizedReason;

      await credential.save({ session });

      await AuditLog.create(
        [
          {
            actorId: actor.id,
            actorRole: actor.role,
            action: "CREDENTIAL_REVOKED",
            credentialId: credential.credentialId,
            previousStatus,
            newStatus: credential.status,
            reason: normalizedReason,
          },
        ],
        { session }
      );

      result = credential;
    });

    return result;
  } finally {
    await session.endSession();
  }
}



async function getCredentialById(credentialId) {
  return Credential.findOne({
    credentialId: credentialId.trim().toUpperCase(),
  }).populate(
    "studentId",
    "studentId name email program departmentId batch graduationYear cgpa percentage"
  );
}

async function getAllCredentials() {
  return Credential.find()
    .populate(
      "studentId",
      "studentId name email program departmentId batch graduationYear cgpa percentage"
    )
    .sort({ createdAt: -1 });
}

async function getCredentialAuditHistory(credentialId) {
  const normalizedCredentialId = credentialId.trim().toUpperCase();

  const credential = await Credential.findOne({
    credentialId: normalizedCredentialId,
  }).select("_id credentialId");

  if (!credential) {
    const error = new Error("Credential not found");
    error.statusCode = 404;
    throw error;
  }

  const events = await AuditLog.find({
    credentialId: normalizedCredentialId,
  })
    .select(
      "actorId actorRole action credentialId previousStatus newStatus reason metadata createdAt"
    )
    .sort({ createdAt: 1, _id: 1 })
    .lean();

  return {
    credentialId: credential.credentialId,
    events,
  };
}


module.exports = {
  createCredential,
  getCredentialById,
  getAllCredentials,
  issueCredential,
  generateCredentialCertificate,
  activateCredential,
  revokeCredential,
  getCredentialAuditHistory,
};