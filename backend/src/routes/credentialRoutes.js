const express = require("express");

const {
  createCredentialController,
  getCredentialController,
  getAllCredentialsController,
  issueCredentialController,
  generateCredentialCertificateController,
  activateCredentialController,
  revokeCredentialController,
  getCredentialAuditHistoryController,
} = require("../controllers/credentialController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const router = express.Router();
// List credentials — Registrar / Super Admin only
router.get(
  "/",
  authenticateToken,
  authorizeRoles("REGISTRAR", "SUPER_ADMIN"),
  getAllCredentialsController
);
// Create credential — Registrar / Super Admin only
router.post(
  "/",
  authenticateToken,
  authorizeRoles("REGISTRAR", "SUPER_ADMIN"),
  createCredentialController
);

router.patch(
  "/:credentialId/issue",
  authenticateToken,
  authorizeRoles("REGISTRAR", "SUPER_ADMIN"),
  issueCredentialController
);
router.post(
  "/:credentialId/certificate",
  authenticateToken,
  authorizeRoles("REGISTRAR", "SUPER_ADMIN"),
  generateCredentialCertificateController
);
router.patch(
  "/:credentialId/activate",
  authenticateToken,
  authorizeRoles("REGISTRAR", "SUPER_ADMIN"),
  activateCredentialController
);
router.patch(
  "/:credentialId/revoke",
  authenticateToken,
  authorizeRoles("REGISTRAR", "SUPER_ADMIN"),
  revokeCredentialController
);
// Get credential — authenticated users for internal management
// Get credential audit history — Registrar / Super Admin only
router.get(
  "/:credentialId/audit-history",
  authenticateToken,
  authorizeRoles("REGISTRAR", "SUPER_ADMIN"),
  getCredentialAuditHistoryController
);
router.get(
  "/:credentialId",
  authenticateToken,
  getCredentialController
);

module.exports = router;