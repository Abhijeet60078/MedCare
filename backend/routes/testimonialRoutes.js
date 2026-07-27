const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  createTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonialController');

router.route('/').get(getTestimonials).post(createTestimonial);
router.route('/:id').delete(deleteTestimonial);

module.exports = router;
