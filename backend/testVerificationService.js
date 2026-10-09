const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDatabase = require("./src/config/database");
const Credential = require("./src/models/Credential");
const Student = require("./src/models/Student");

const {
  verifyCredential,
} = require("./src/services/verificationService");

dotenv.config();

async function testVerificationService() {
  try {
    await connectDatabase();

    const credentialId = "EV-2026-A985397BC554";

    console.log("Testing existing credential...");

    const result = await verifyCredential(credentialId);

    console.log("Verification result:", JSON.stringify(result, null, 2));

    console.log("\nTesting a nonexistent credential...");

    const missingResult = await verifyCredential("EV-2026-NOTFOUND");

    console.log(
      "Missing credential result:",
      JSON.stringify(missingResult, null, 2)
    );
  } catch (error) {
    console.error("Verification test failed:", error.message);
  } finally {
    await mongoose.connection.close();
  }
}

testVerificationService();