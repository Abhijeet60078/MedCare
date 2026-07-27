const Doctor = require('../models/Doctor');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

// @desc    Get all doctors (supports ?search= & ?department= & ?specialization=)
// @route   GET /api/doctors
// @access  Public
const getDoctors = asyncHandler(async (req, res) => {
  const { search, department, specialization } = req.query;
  const query = { isActive: true };

  if (department) query.department = department;
  if (specialization) query.specialization = specialization;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { specialization: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } },
    ];
  }

  const doctors = await Doctor.find(query).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: doctors.length, data: doctors });
});

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) throw new ApiError(404, 'Doctor not found');
  res.status(200).json({ success: true, data: doctor });
});

// @desc    Create a doctor
// @route   POST /api/doctors
// @access  Public (add auth middleware for production/admin use)
const createDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.create(req.body);
  res.status(201).json({ success: true, data: doctor });
});

// @desc    Update a doctor
// @route   PUT /api/doctors/:id
// @access  Public (add auth middleware for production/admin use)
const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doctor) throw new ApiError(404, 'Doctor not found');
  res.status(200).json({ success: true, data: doctor });
});

// @desc    Delete a doctor
// @route   DELETE /api/doctors/:id
// @access  Public (add auth middleware for production/admin use)
const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  if (!doctor) throw new ApiError(404, 'Doctor not found');
  res.status(200).json({ success: true, message: 'Doctor removed' });
});

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
