
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const PDFDocument = require("pdfkit");
const { calculateFileHash } = require("../utils/fileHash");
const { generateQrCode } = require("../utils/qrCode");

async function generateCertificatePdf(credential) {
  const certificatesDirectory = path.resolve(
    __dirname,
    "../../../certificates"
  );

  await fs.promises.mkdir(certificatesDirectory, {
    recursive: true,
  });

  // Use a unique filename for each certificate version.
  const versionId = crypto.randomUUID();
  const fileName = `${credential.credentialId}-${versionId}.pdf`;
  const tempFileName = `.${fileName}.tmp`;
  const filePath = path.join(certificatesDirectory, fileName);
  const tempFilePath = path.join(
    certificatesDirectory,
    tempFileName
  );

  let published = false;

  try {
    const { verificationUrl, qrCodeDataUrl } =
      await generateQrCode(credential.credentialId);

    const qrCodeBase64 = qrCodeDataUrl.replace(
      /^data:image\/png;base64,/,
      ""
    );
    const qrCodeBuffer = Buffer.from(qrCodeBase64, "base64");

    await new Promise((resolve, reject) => {
      const document = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      const writeStream = fs.createWriteStream(tempFilePath, {
        flags: "wx",
      });

      let settled = false;

      const fail = (error) => {
        if (settled) return;
        settled = true;
        document.destroy();
        writeStream.destroy();
        reject(error);
      };

      writeStream.on("error", fail);
      document.on("error", fail);

      writeStream.on("finish", () => {
        if (settled) return;
        settled = true;
        resolve();
      });

      document.pipe(writeStream);

      try {
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
            { align: "center" }
          );

        document.end();
      } catch (error) {
        fail(error);
      }
    });

    // Publish only after the complete PDF has been written.
    // The unique destination prevents overwriting an existing PDF.
    await fs.promises.rename(tempFilePath, filePath);
    published = true;

    return {
      fileName,
      filePath,
      verificationUrl,
    };
  } catch (error) {
    await fs.promises.unlink(tempFilePath).catch(() => {});

    if (published) {
      await fs.promises.unlink(filePath).catch(() => {});
    }

    throw error;
  }
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
