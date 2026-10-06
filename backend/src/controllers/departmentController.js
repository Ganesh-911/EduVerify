const {
  createDepartment,
  getAllDepartments,
} = require("../services/departmentService");

const validateDepartment = require("../validators/departmentValidator");
async function createDepartmentController(req, res) {
  try {
    const validation = validateDepartment(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid department data",
        errors: validation.errors,
      });
    }

    const department = await createDepartment(req.body);

    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
  } 
  catch (error) {
  console.error("Create department error:", error.message);

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Department code already exists",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Failed to create department",
  });
}
}

async function getAllDepartmentsController(req, res) {
  try {
    const departments = await getAllDepartments();

    return res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    console.error("Get departments error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
    });
  }
}

module.exports = {
  createDepartmentController,
  getAllDepartmentsController,
};