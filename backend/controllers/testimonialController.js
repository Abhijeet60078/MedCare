const Testimonial = require('../models/Testimonial');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
});

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Public
const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.create(req.body);
  res.status(201).json({ success: true, data: testimonial });
});

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Public (should be admin-only in production)
const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) throw new ApiError(404, 'Testimonial not found');
  res.status(200).json({ success: true, message: 'Testimonial removed' });
});

module.exports = { getTestimonials, createTestimonial, deleteTestimonial };
