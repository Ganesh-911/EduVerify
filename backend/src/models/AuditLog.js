
const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    actorRole: {
      type: String,
      enum: [
        "STUDENT",
        "DEPARTMENT_ADMIN",
        "REGISTRAR",
        "SUPER_ADMIN",
      ],
      required: true,
    },

    action: {
      type: String,
      enum: [
        "CREDENTIAL_CREATED",
        "CREDENTIAL_ISSUED",
        "CERTIFICATE_GENERATED",
        "CREDENTIAL_ACTIVATED",
        "CREDENTIAL_REVOKED",
      ],
      required: true,
    },

    credentialId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    previousStatus: {
      type: String,
      enum: ["DRAFT", "ISSUED", "ACTIVE", "REVOKED", null],
      default: null,
    },

    newStatus: {
      type: String,
      enum: ["DRAFT", "ISSUED", "ACTIVE", "REVOKED", null],
      default: null,
    },

    reason: {
      type: String,
      trim: true,
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

auditLogSchema.index({ credentialId: 1, createdAt: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
