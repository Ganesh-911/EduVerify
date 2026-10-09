const {
  createCredential,
  getCredentialById,
  issueCredential,
  generateCredentialCertificate,
  activateCredential,
  revokeCredential,
} = require("../services/credentialService");

const validateCredential = require("../validators/credentialValidator");

async function createCredentialController(req, res, next) {
  try {
    const validation = validateCredential(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credential data",
        errors: validation.errors,
      });
    }

    const credential = await createCredential({
      studentId: req.body.studentId,
      credentialType: req.body.credentialType,
    });

    return res.status(201).json({
      success: true,
      message: "Credential created successfully",
      data: credential,
    });
  } catch (error) {
    console.error("Create credential error:", error.message);
    next(error);
  }
}
async function issueCredentialController(req, res, next) {
  try {
    const { credentialId } = req.params;

    if (!credentialId || !credentialId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Credential ID is required",
      });
    }

    const credential = await issueCredential(credentialId);

    return res.status(200).json({
      success: true,
      message: "Credential issued successfully",
      data: credential,
    });
  } catch (error) {
    console.error("Issue credential error:", error.message);
    next(error);
  }
}
async function generateCredentialCertificateController(req, res, next) {
  try {
    const { credentialId } = req.params;

    if (!credentialId || !credentialId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Credential ID is required",
      });
    }

    const credential = await generateCredentialCertificate(credentialId);

    return res.status(200).json({
      success: true,
      message: "Certificate generated successfully",
      data: credential,
    });
  } catch (error) {
    console.error("Generate certificate error:", error.message);
    next(error);
  }
}
async function activateCredentialController(req, res, next) {
  try {
    const { credentialId } = req.params;

    if (!credentialId || !credentialId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Credential ID is required",
      });
    }

    const credential = await activateCredential(credentialId);

    return res.status(200).json({
      success: true,
      message: "Credential activated successfully",
      data: credential,
    });
  } catch (error) {
    console.error("Activate credential error:", error.message);
    next(error);
  }
}

async function revokeCredentialController(req, res, next) {
  try {
    const { credentialId } = req.params;
    const { reason } = req.body;

    if (!credentialId || !credentialId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Credential ID is required",
      });
    }

    if (typeof reason !== "string" || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Revocation reason is required",
      });
    }

    const credential = await revokeCredential(
      credentialId,
      reason
    );

    return res.status(200).json({
      success: true,
      message: "Credential revoked successfully",
      data: credential,
    });
  } catch (error) {
    console.error("Revoke credential error:", error.message);
    next(error);
  }
}


async function getCredentialController(req, res, next) {
  try {
    const { credentialId } = req.params;

    if (!credentialId || !credentialId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Credential ID is required",
      });
    }

    const credential = await getCredentialById(credentialId);

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: "Credential not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: credential,
    });
  } catch (error) {
    console.error("Get credential error:", error.message);
    next(error);
  }
}

module.exports = {
  createCredentialController,
  getCredentialController,
  issueCredentialController,
  generateCredentialCertificateController,
  activateCredentialController,
  revokeCredentialController,
};