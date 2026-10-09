const express = require("express");

const {
  verifyCredentialController,
} = require("../controllers/verificationController");

const router = express.Router();

// Public endpoint: no login required
router.get("/:credentialId", verifyCredentialController);

module.exports = router;