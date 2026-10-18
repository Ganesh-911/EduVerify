
require("dotenv").config({ path: "backend/.env" });

const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const mongoose = require("mongoose");
const Student = require("./src/models/Student");

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const student = await Student.findOne(
  { studentId: "BVC23CSE002" }
)
  .select("studentId name academicStatus program batch graduationYear")
  .lean();

console.log("\nStudent record:");
console.dir(student, { depth: 2 });
  } catch (error) {
    console.error("Inspection failed:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

main();
