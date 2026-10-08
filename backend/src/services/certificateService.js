const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { calculateFileHash } = require("../utils/fileHash");
const { generateQrCode } = require("../utils/qrCode");

function generateCertificatePdf(credential) {
  return new Promise(async (resolve, reject) => {
    try {
      const certificatesDirectory = path.join(
        __dirname,
        "../../../certificates"
      );

      if (!fs.existsSync(certificatesDirectory)) {
        fs.mkdirSync(certificatesDirectory, { recursive: true });
      }

      const fileName = `${credential.credentialId}.pdf`;
      const filePath = path.join(certificatesDirectory, fileName);

      const document = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      const writeStream = fs.createWriteStream(filePath);

      document.pipe(writeStream);

      const { verificationUrl, qrCodeDataUrl } =
        await generateQrCode(credential.credentialId);

      const qrCodeBase64 = qrCodeDataUrl.replace(
        /^data:image\/png;base64,/,
        ""
      );

      const qrCodeBuffer = Buffer.from(qrCodeBase64, "base64");

      // Header
      document
        .fontSize(26)
        .font("Helvetica-Bold")
        .text("EDUVERIFY", { align: "center" });

      document
        .moveDown(0.4)
        .fontSize(17)
        .font("Helvetica")
        .text("ACADEMIC CREDENTIAL", { align: "center" });

      document.moveDown(1.5);

      // Certificate body
      document
        .fontSize(12)
        .font("Helvetica")
        .text("This is to certify that", { align: "center" });

      document
        .moveDown(0.5)
        .fontSize(22)
        .font("Helvetica-Bold")
        .text(credential.studentId.name, { align: "center" });

      document.moveDown(1);

      document
        .fontSize(12)
        .font("Helvetica")
        .text(
          `Student ID: ${credential.studentId.studentId}`,
          { align: "center" }
        );

      document
        .moveDown(0.4)
        .text(`Program: ${credential.studentId.program}`, {
          align: "center",
        });

      document
        .moveDown(0.4)
        .text(`Batch: ${credential.studentId.batch}`, {
          align: "center",
        });

      document
        .moveDown(0.4)
        .text(
          `Graduation Year: ${credential.studentId.graduationYear}`,
          { align: "center" }
        );

      document
        .moveDown(0.4)
        .text(`CGPA: ${credential.studentId.cgpa}`, {
          align: "center",
        });

      document.moveDown(1.2);

      document
        .font("Helvetica-Bold")
        .text(`Credential Type: ${credential.credentialType}`, {
          align: "center",
        });

      document
        .moveDown(0.4)
        .text(`Credential ID: ${credential.credentialId}`, {
          align: "center",
        });

      document
        .moveDown(0.4)
        .font("Helvetica")
        .text(
          `Issue Date: ${
            credential.issueDate
              ? new Date(credential.issueDate).toLocaleDateString()
              : "Not issued"
          }`,
          { align: "center" }
        );

      document.moveDown(1);

      // QR code
      const qrX = (document.page.width - 130) / 2;

      document.image(qrCodeBuffer, qrX, document.y, {
        width: 130,
        height: 130,
      });

      document.y += 145;

      document
        .fontSize(9)
        .font("Helvetica")
        .text("Scan to verify this credential", {
          align: "center",
        });

      document
        .moveDown(0.3)
        .fontSize(8)
        .text(verificationUrl, {
          align: "center",
        });

      document.moveDown(1.5);

      document
        .fontSize(9)
        .text(
          "This digital credential is issued through the EduVerify academic credential management system.",
          {
            align: "center",
          }
        );

      document.end();

      writeStream.on("finish", () => {
        resolve({
          fileName,
          filePath,
          verificationUrl,
        });
      });

      writeStream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
}
async function generateCertificateWithHash(credential) {
  const pdfResult = await generateCertificatePdf(credential);

  const documentHash = await calculateFileHash(pdfResult.filePath);

  return {
    ...pdfResult,
    documentHash,
  };
}

module.exports = {
  generateCertificatePdf,
  generateCertificateWithHash,
};