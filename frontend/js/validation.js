/* ==========================================================================
   MedCare Hospital - Client-side Form Validation Helpers
   ========================================================================== */

const Validator = {
  isRequired(value) {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  },
  isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },
  isPhone(value) {
    return /^[0-9+\-\s()]{7,15}$/.test(value);
  },
  minLength(value, len) {
    return value && value.toString().trim().length >= len;
  },
};

/**
 * Validates a form field and toggles error UI.
 * @param {HTMLElement} input
 * @param {Function} rule - returns true if valid
 * @param {string} errorMessage
 */
function validateField(input, rule, errorMessage) {
  const feedback = input.parentElement.querySelector('.invalid-feedback-custom');
  const valid = rule(input.value);

  if (!valid) {
    input.classList.add('is-invalid-custom');
    if (feedback) feedback.textContent = errorMessage;
  } else {
    input.classList.remove('is-invalid-custom');
  }
  return valid;
}

/**
 * Attaches live validation (on blur) to a field.
 */
function attachLiveValidation(input, rule, errorMessage) {
  input.addEventListener('blur', () => validateField(input, rule, errorMessage));
  input.addEventListener('input', () => {
    if (input.classList.contains('is-invalid-custom')) {
      validateField(input, rule, errorMessage);
    }
  });
}
