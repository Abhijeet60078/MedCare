const MedicalRecord = require('../models/MedicalRecord');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

const buildMedicalRecordQuery = ({ patientEmail, doctor, appointment }) => {
  const query = {};

  if (patientEmail) query.patientEmail = patientEmail.toLowerCase();
  if (doctor) query.doctor = doctor;
  if (appointment) query.appointment = appointment;

  return query;
};

// @desc    Get medical records (supports ?patientEmail= & ?doctor= & ?appointment=)
// @route   GET /api/medical-records
// @access  Public
const getMedicalRecords = asyncHandler(async (req, res) => {
  const { patientEmail, doctor, appointment } = req.query;
  const records = await MedicalRecord.find(buildMedicalRecordQuery({ patientEmail, doctor, appointment }))
    .populate('doctor', 'name specialization department image')
    .populate('appointment', 'patientName email appointmentDate appointmentTime status')
    .sort({ visitDate: -1, createdAt: -1 });

  res.status(200).json({ success: true, count: records.length, data: records });
});

// @desc    Get a single medical record
// @route   GET /api/medical-records/:id
// @access  Public
const getMedicalRecordById = asyncHandler(async (req, res) => {
  const record = await MedicalRecord.findById(req.params.id)
    .populate('doctor', 'name specialization department image')
    .populate('appointment', 'patientName email appointmentDate appointmentTime status');

  if (!record) throw new ApiError(404, 'Medical record not found');

  res.status(200).json({ success: true, data: record });
});

// @desc    Create a medical record
// @route   POST /api/medical-records
// @access  Public
const createMedicalRecord = asyncHandler(async (req, res) => {
  const { doctor, appointment, diagnosis } = req.body;

  if (!doctor) throw new ApiError(400, 'Doctor is required');
  if (!diagnosis) throw new ApiError(400, 'Diagnosis is required');

  const doctorExists = await Doctor.findById(doctor);
  if (!doctorExists) throw new ApiError(404, 'Selected doctor does not exist');

  const recordData = { ...req.body };
  recordData.patientEmail = (recordData.patientEmail || '').toLowerCase();

  if (appointment) {
    const appointmentRecord = await Appointment.findById(appointment);
    if (!appointmentRecord) throw new ApiError(404, 'Associated appointment not found');

    if (String(appointmentRecord.doctor) !== String(doctor)) {
      throw new ApiError(400, 'Appointment doctor does not match the selected doctor');
    }

    recordData.patientName = recordData.patientName || appointmentRecord.patientName;
    recordData.patientEmail = recordData.patientEmail || appointmentRecord.email;
    recordData.patientPhone = recordData.patientPhone || appointmentRecord.phone;
  }

  if (!recordData.patientName) throw new ApiError(400, 'Patient name is required');
  if (!recordData.patientEmail) throw new ApiError(400, 'Patient email is required');

  const record = await MedicalRecord.create(recordData);
  const populatedRecord = await MedicalRecord.findById(record._id)
    .populate('doctor', 'name specialization department image')
    .populate('appointment', 'patientName email appointmentDate appointmentTime status');

  res.status(201).json({
    success: true,
    message: 'Medical record saved successfully',
    data: populatedRecord,
  });
});

// @desc    Update a medical record
// @route   PUT /api/medical-records/:id
// @access  Public
const updateMedicalRecord = asyncHandler(async (req, res) => {
  const record = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate('doctor', 'name specialization department image')
    .populate('appointment', 'patientName email appointmentDate appointmentTime status');

  if (!record) throw new ApiError(404, 'Medical record not found');

  res.status(200).json({ success: true, data: record });
});

// @desc    Delete a medical record
// @route   DELETE /api/medical-records/:id
// @access  Public
const deleteMedicalRecord = asyncHandler(async (req, res) => {
  const record = await MedicalRecord.findByIdAndDelete(req.params.id);
  if (!record) throw new ApiError(404, 'Medical record not found');

  res.status(200).json({ success: true, message: 'Medical record deleted' });
});

module.exports = {
  getMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
};