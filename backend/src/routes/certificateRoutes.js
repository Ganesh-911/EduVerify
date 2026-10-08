const express = require("express");

const {
  downloadCertificateController,
} = require("../controllers/certificateController");

const router = express.Router();

router.get("/:filename", downloadCertificateController);

module.exports = router;