const express = require("express");

const {
  createCredentialController,
  getCredentialController,
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

// Get credential — authenticated users for internal management
router.get(
  "/:credentialId",
  authenticateToken,
  getCredentialController
);

module.exports = router;