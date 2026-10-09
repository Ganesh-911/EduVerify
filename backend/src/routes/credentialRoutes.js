const express = require("express");

const {
  createCredentialController,
  getCredentialController,
  issueCredentialController,
  generateCredentialCertificateController,
  activateCredentialController,
  revokeCredentialController,
} = require("../controllers/credentialController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const router = express.Router();

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
router.get(
  "/:credentialId",
  authenticateToken,
  getCredentialController
);

module.exports = router;