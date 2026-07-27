/* ==========================================================================
   MedCare Hospital - Appointment Booking (appointment.html)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const appointmentForm = document.getElementById('appointmentForm');
  if (!appointmentForm) return; // Only run on appointment.html

  loadDoctorsIntoSelect();
  setMinDateToday();
  preselectDoctorFromURL();

  appointmentForm.addEventListener('submit', handleAppointmentSubmit);
});

async function loadDoctorsIntoSelect() {
  const doctorSelect = document.getElementById('doctorSelect');
  const departmentSelect = document.getElementById('departmentSelect');
  if (!doctorSelect) return;

  try {
    const res = await fetch(`${API_BASE_URL}/doctors`);
    const json = await res.json();
    const doctors = json.data || [];

    doctorSelect.innerHTML = '<option value="" selected disabled>Choose a doctor</option>';
    doctors.forEach((doc) => {
      const opt = document.createElement('option');
      opt.value = doc._id;
      opt.textContent = `${doc.name} - ${doc.specialization}`;
      opt.dataset.department = doc.department;
      doctorSelect.appendChild(opt);
    });

    // Auto-fill department when doctor changes
    doctorSelect.addEventListener('change', () => {
      const selected = doctorSelect.options[doctorSelect.selectedIndex];
      if (departmentSelect && selected?.dataset.department) {
        departmentSelect.value = selected.dataset.department;
      }
    });
  } catch (err) {
    console.error('Failed to load doctors for appointment form:', err);
    doctorSelect.innerHTML = '<option value="">Unable to load doctors</option>';
  }
}

function setMinDateToday() {
  const dateInput = document.getElementById('appointmentDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }
}

function preselectDoctorFromURL() {
  const params = new URLSearchParams(window.location.search);
  const doctorId = params.get('doctorId');
  if (!doctorId) return;

  // Wait for options to populate, then select
  const interval = setInterval(() => {
    const doctorSelect = document.getElementById('doctorSelect');
    if (doctorSelect && doctorSelect.options.length > 1) {
      doctorSelect.value = doctorId;
      doctorSelect.dispatchEvent(new Event('change'));
      clearInterval(interval);
    }
  }, 150);
  setTimeout(() => clearInterval(interval), 3000);
}

async function handleAppointmentSubmit(e) {
  e.preventDefault();
  const form = e.target;

  // ----- Field validation -----
  const patientName = form.patientName.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const department = form.department.value;
  const doctor = form.doctor.value;
  const appointmentDate = form.appointmentDate.value;
  const appointmentTime = form.appointmentTime.value;

  let isValid = true;
  isValid = validateField(form.patientName, Validator.isRequired, 'Please enter your full name.') && isValid;
  isValid = validateField(form.email, Validator.isEmail, 'Please enter a valid email address.') && isValid;
  isValid = validateField(form.phone, Validator.isPhone, 'Please enter a valid phone number.') && isValid;
  isValid = validateField(form.department, Validator.isRequired, 'Please select a department.') && isValid;
  isValid = validateField(form.doctor, Validator.isRequired, 'Please select a doctor.') && isValid;
  isValid = validateField(form.appointmentDate, Validator.isRequired, 'Please select a date.') && isValid;
  isValid = validateField(form.appointmentTime, Validator.isRequired, 'Please select a time slot.') && isValid;

  if (!isValid) {
    showToast('Please fix the errors in the form.', 'error');
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Booking...';

  const payload = {
    patientName,
    email,
    phone,
    age: form.age.value ? parseInt(form.age.value, 10) : undefined,
    gender: form.gender.value || undefined,
    department,
    doctor,
    appointmentDate,
    appointmentTime,
    message: form.message.value.trim(),
  };

  try {
    const res = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message || 'Failed to book appointment');
    }

    showToast('🎉 Appointment booked successfully! We will contact you shortly.');
    form.reset();
    setMinDateToday();
  } catch (err) {
    console.error(err);
    showToast(err.message || 'Something went wrong. Please try again.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}
