
const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");

const {
  downloadCertificateController,
} = require("../controllers/certificateController");

const router = express.Router();

// Only authenticated users can download certificate PDFs.
router.get("/:filename", authenticateToken, downloadCertificateController);

module.exports = router;
