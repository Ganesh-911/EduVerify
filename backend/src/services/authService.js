const { findUserByEmail } = require("./userService");
const { comparePassword } = require("../utils/password");

async function authenticateUser(email, password) {
  const user = await findUserByEmail(email);

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error("User account is inactive");
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid = await comparePassword(
    password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return user;
}

module.exports = {
  authenticateUser,
};