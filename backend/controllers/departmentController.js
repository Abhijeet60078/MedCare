const Department = require('../models/Department');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
const getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find().sort({ name: 1 });
  res.status(200).json({ success: true, count: departments.length, data: departments });
});

// @desc    Create a department
// @route   POST /api/departments
// @access  Public (should be admin-only in production)
const createDepartment = asyncHandler(async (req, res) => {
  const department = await Department.create(req.body);
  res.status(201).json({ success: true, data: department });
});

// @desc    Update a department
// @route   PUT /api/departments/:id
// @access  Public (should be admin-only in production)
const updateDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!department) throw new ApiError(404, 'Department not found');
  res.status(200).json({ success: true, data: department });
});

// @desc    Delete a department
// @route   DELETE /api/departments/:id
// @access  Public (should be admin-only in production)
const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findByIdAndDelete(req.params.id);
  if (!department) throw new ApiError(404, 'Department not found');
  res.status(200).json({ success: true, message: 'Department removed' });
});

module.exports = { getDepartments, createDepartment, updateDepartment, deleteDepartment };
