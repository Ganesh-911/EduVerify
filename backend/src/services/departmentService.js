const Department = require("../models/Department");

async function createDepartment(departmentData) {
  const department = await Department.create(departmentData);

  return department;
}

async function getAllDepartments() {
const departments = await Department.find({
  isActive: true,
}).sort({ name: 1 });
  return departments;
}

module.exports = {
  createDepartment,
  getAllDepartments,
};