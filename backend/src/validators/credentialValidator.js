function validateCredential(data) {
  const errors = {};

  if (
    !data.studentId ||
    typeof data.studentId !== "string" ||
    !data.studentId.trim()
  ) {
    errors.studentId = "Student ID is required";
  }

  if (
    !data.credentialType ||
    typeof data.credentialType !== "string" ||
    !data.credentialType.trim()
  ) {
    errors.credentialType = "Credential type is required";
  }

  if (
    data.status !== undefined &&
    !["DRAFT", "ISSUED", "ACTIVE", "REVOKED"].includes(
      data.status
    )
  ) {
    errors.status = "Invalid credential status";
  }

  if (
    data.documentUrl !== undefined &&
    data.documentUrl !== null &&
    typeof data.documentUrl !== "string"
  ) {
    errors.documentUrl = "Document URL must be a string";
  }

  if (
    data.documentHash !== undefined &&
    data.documentHash !== null &&
    typeof data.documentHash !== "string"
  ) {
    errors.documentHash = "Document hash must be a string";
  }

  if (
    data.qrCode !== undefined &&
    data.qrCode !== null &&
    typeof data.qrCode !== "string"
  ) {
    errors.qrCode = "QR code data must be a string";
  }

  if (
    data.revocationReason !== undefined &&
    data.revocationReason !== null &&
    typeof data.revocationReason !== "string"
  ) {
    errors.revocationReason =
      "Revocation reason must be a string";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

module.exports = validateCredential;