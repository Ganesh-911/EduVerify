const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    program: {
      type: String,
      required: true,
      trim: true,
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    batch: {
      type: String,
      required: true,
      trim: true,
    },

    admissionYear: {
      type: Number,
      required: true,
    },

    graduationYear: {
      type: Number,
      required: true,
    },

    cgpa: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },

    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    academicStatus: {
      type: String,
      enum: ["ACTIVE", "GRADUATED", "SUSPENDED", "WITHDRAWN"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;