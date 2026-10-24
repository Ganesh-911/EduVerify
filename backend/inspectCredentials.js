
require("dotenv").config({ path: "backend/.env" });

const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const mongoose = require("mongoose");
const User = require("./src/models/User");

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const accounts = await User.aggregate([
      {
        $match: {
          role: { $in: ["REGISTRAR", "SUPER_ADMIN"] },
        },
      },
      {
        $group: {
          _id: { role: "$role", isActive: "$isActive" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.role": 1, "_id.isActive": -1 } },
    ]);

    console.log("\nAuthorized account counts:");
    console.table(
      accounts.map(({ _id, count }) => ({
        role: _id.role,
        isActive: _id.isActive,
        count,
      }))
    );
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
