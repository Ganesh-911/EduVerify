const fs = require("fs");
const path = require("path");

async function downloadCertificateController(req, res, next) {
  try {
    const { filename } = req.params;

    if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return res.status(400).json({
        success: false,
        message: "Invalid certificate filename",
      });
    }

    if (!filename.toLowerCase().endsWith(".pdf")) {
      return res.status(400).json({
        success: false,
        message: "Only PDF certificates are allowed",
      });
    }

    const certificatesDirectory = path.resolve(
      __dirname,
      "../../../certificates"
    );

    const filePath = path.join(certificatesDirectory, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Certificate file not found",
      });
    }

    return res.download(
      filePath,
      filename,
      {
        headers: {
          "Content-Type": "application/pdf",
        },
      },
      (error) => {
        if (error && !res.headersSent) {
          next(error);
        }
      }
    );
  } catch (error) {
    console.error("Download certificate error:", error.message);
    next(error);
  }
}

module.exports = {
  downloadCertificateController,
};