const mongoose = require("mongoose");

const credentialSchema = new mongoose.Schema(
  {
    credentialId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    credentialType: {
      type: String,
      required: true,
      trim: true,
    },

    issueDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["DRAFT", "ISSUED", "ACTIVE", "REVOKED"],
      default: "DRAFT",
    },

    documentUrl: {
      type: String,
      default: null,
      trim: true,
    },

    documentHash: {
      type: String,
      default: null,
      trim: true,
    },

    qrCode: {
      type: String,
      default: null,
      trim: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    revocationReason: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Credential = mongoose.model("Credential", credentialSchema);

module.exports = Credential;