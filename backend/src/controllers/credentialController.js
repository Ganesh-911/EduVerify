const {
  createCredential,
  getCredentialById,
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
};