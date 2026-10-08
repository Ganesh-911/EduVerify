const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDatabase = require("./src/config/database");
const Credential = require("./src/models/Credential");
const Student = require("./src/models/Student");

const {
  generateCertificateWithHash,
} = require("./src/services/certificateService");

dotenv.config();

async function testCertificateHash() {
  try {
    await connectDatabase();

    const credential = await Credential.findOne({
      credentialId: "EV-2026-A985397BC554",
    }).populate(
      "studentId",
      "studentId name email program departmentId batch graduationYear cgpa percentage"
    );

    if (!credential) {
      throw new Error("Test credential not found");
    }

    console.log("Credential:", credential.credentialId);
    console.log("Status:", credential.status);
    console.log("Student:", credential.studentId.name);

    const result = await generateCertificateWithHash(credential);

    console.log("Certificate generated successfully");
    console.log("File:", result.fileName);
    console.log("Path:", result.filePath);
    console.log("SHA-256:", result.documentHash);
    console.log("Hash length:", result.documentHash.length);
  } catch (error) {
    console.error("Certificate hash test failed:", error.message);
  } finally {
    await mongoose.connection.close();
  }
}

testCertificateHash();