const { authenticateUser } = require("../services/authService");
const { generateToken } = require("../utils/jwt");

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await authenticateUser(email, password);

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
      departmentId: user.departmentId
        ? user.departmentId.toString()
        : null,
      studentId: user.studentId || null,
    });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          departmentId: user.departmentId,
          isActive: user.isActive,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message:
        statusCode === 500
          ? "Login failed"
          : error.message,
    });
  }
}

module.exports = {
  login,
};