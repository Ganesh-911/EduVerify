const {
  verifyCredential,
} = require("../services/verificationService");

async function verifyCredentialController(req, res, next) {
  try {
    const { credentialId } = req.params;

    if (!credentialId || !credentialId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Credential ID is required",
      });
    }

    const result = await verifyCredential(credentialId);

    const statusCode =
      result.result === "NOT_FOUND" ? 404 : 200;

    return res.status(statusCode).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Public verification error:", error.message);
    next(error);
  }
}

module.exports = {
  verifyCredentialController,
};