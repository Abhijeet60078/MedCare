const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Public
const createAppointment = asyncHandler(async (req, res) => {
  const { doctor, appointmentDate, appointmentTime } = req.body;

  // Verify doctor exists
  const doctorExists = await Doctor.findById(doctor);
  if (!doctorExists) throw new ApiError(404, 'Selected doctor does not exist');

  // Prevent double-booking the same doctor/date/time slot
  const clash = await Appointment.findOne({
    doctor,
    appointmentDate,
    appointmentTime,
    status: { $ne: 'Cancelled' },
  });
  if (clash) {
    throw new ApiError(400, 'This time slot is already booked. Please choose another.');
  }

  const appointment = await Appointment.create(req.body);
  res.status(201).json({
    success: true,
    message: 'Appointment booked successfully',
    data: appointment,
  });
});

// @desc    Get all appointments (supports ?status=)
// @route   GET /api/appointments
// @access  Public (should be admin-only in production)
const getAppointments = asyncHandler(async (req, res) => {
  const { status, email } = req.query;
  const query = {};
  if (status) query.status = status;
  if (email) query.email = email;

  const appointments = await Appointment.find(query)
    .populate('doctor', 'name specialization department image')
    .sort({ appointmentDate: 1 });

  res.status(200).json({ success: true, count: appointments.length, data: appointments });
});

// @desc    Get a single appointment
// @route   GET /api/appointments/:id
// @access  Public
const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate('doctor');
  if (!appointment) throw new ApiError(404, 'Appointment not found');
  res.status(200).json({ success: true, data: appointment });
});

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Public (should be admin-only in production)
const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!appointment) throw new ApiError(404, 'Appointment not found');
  res.status(200).json({ success: true, data: appointment });
});

// @desc    Cancel/delete appointment
// @route   DELETE /api/appointments/:id
// @access  Public
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);
  if (!appointment) throw new ApiError(404, 'Appointment not found');
  res.status(200).json({ success: true, message: 'Appointment cancelled' });
});

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
