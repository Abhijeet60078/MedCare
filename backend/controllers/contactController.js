const Contact = require('../models/Contact');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

// @desc    Submit a contact message
// @route   POST /api/contacts
// @access  Public
const createContact = asyncHandler(async (req, res) => {
  const contact = await Contact.create(req.body);
  res.status(201).json({
    success: true,
    message: 'Your message has been sent. We will get back to you soon!',
    data: contact,
  });
});

// @desc    Get all contact messages
// @route   GET /api/contacts
// @access  Public (should be admin-only in production)
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: contacts.length, data: contacts });
});

// @desc    Get single contact message
// @route   GET /api/contacts/:id
// @access  Public
const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) throw new ApiError(404, 'Contact message not found');
  res.status(200).json({ success: true, data: contact });
});

// @desc    Mark contact message resolved / update
// @route   PUT /api/contacts/:id
// @access  Public (should be admin-only in production)
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!contact) throw new ApiError(404, 'Contact message not found');
  res.status(200).json({ success: true, data: contact });
});

// @desc    Delete a contact message
// @route   DELETE /api/contacts/:id
// @access  Public (should be admin-only in production)
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) throw new ApiError(404, 'Contact message not found');
  res.status(200).json({ success: true, message: 'Message deleted' });
});

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
};
