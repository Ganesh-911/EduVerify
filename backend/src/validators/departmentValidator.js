function validateDepartment(data) {
  const errors = {};

  if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
    errors.name = "Department name is required";
  }

  if (!data.code || typeof data.code !== "string" || !data.code.trim()) {
    errors.code = "Department code is required";
  } else if (!/^[A-Za-z0-9-]{2,10}$/.test(data.code.trim())) {
    errors.code =
      "Department code must contain 2-10 letters, numbers, or hyphens";
  }

  if (
    data.description !== undefined &&
    typeof data.description !== "string"
  ) {
    errors.description = "Description must be a string";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

module.exports = validateDepartment;