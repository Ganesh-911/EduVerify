const QRCode = require("qrcode");

function buildVerificationUrl(credentialId) {
  const baseUrl =
    process.env.FRONTEND_URL || "http://localhost:5173";

  return `${baseUrl}/verify/${encodeURIComponent(credentialId)}`;
}

async function generateQrCode(credentialId) {
  const verificationUrl = buildVerificationUrl(credentialId);

  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 300,
  });

  return {
    verificationUrl,
    qrCodeDataUrl,
  };
}

module.exports = {
  buildVerificationUrl,
  generateQrCode,
};