const User = require("../models/User");
const Department = require("../models/Department");
const { hashPassword } = require("../utils/password");

async function createUser(userData) {
  const { name, email, password, role, departmentId = null } = userData;

  const existingUser = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (existingUser) {
    const error = new Error("User with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  if (departmentId) {
    const department = await Department.findOne({
      _id: departmentId,
      isActive: true,
    });

    if (!department) {
      const error = new Error("Active department not found");
      error.statusCode = 400;
      throw error;
    }
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
    role,
    departmentId,
  });

  return user;
}

async function findUserByEmail(email) {
  return User.findOne({
    email: email.toLowerCase().trim(),
  });
}

module.exports = {
  createUser,
  findUserByEmail,
};