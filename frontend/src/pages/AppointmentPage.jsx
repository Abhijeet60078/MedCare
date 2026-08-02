import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageBanner, FormField, FormTextarea, SelectField } from '../components/Layout';
import { API_BASE_URL } from '../services/api';
import { useToast } from '../context/ToastContext';

const INITIAL_FORM = {
  patientName: '',
  email: '',
  phone: '',
  age: '',
  gender: '',
  department: '',
  doctor: '',
  appointmentDate: '',
  appointmentTime: '',
  message: '',
};

export default function AppointmentPage() {
  const showToast = useToast();
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function loadDoctors() {
      try {
        const response = await fetch(`${API_BASE_URL}/doctors`);
        const json = await response.json();

        if (!cancelled) {
          setDoctors(json.data || []);
        }
      } catch (error) {
        if (!cancelled) {
          setDoctors([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingDoctors(false);
        }
      }
    }

    loadDoctors();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const doctorId = searchParams.get('doctorId');
    if (!doctorId || !doctors.length) return;

    const selectedDoctor = doctors.find((doctor) => doctor._id === doctorId);
    if (selectedDoctor) {
      setForm((current) => ({
        ...current,
        doctor: selectedDoctor._id,
        department: selectedDoctor.department,
      }));
    }
  }, [doctors, searchParams]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'doctor') {
      const selectedDoctor = doctors.find((doctor) => doctor._id === value);
      setForm((current) => ({
        ...current,
        doctor: value,
        department: selectedDoctor?.department || current.department,
      }));
    } else {
      setForm((current) => ({ ...current, [name]: value }));
    }

    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.patientName.trim()) nextErrors.patientName = 'Please enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Please enter a valid email address.';
    if (!/^[0-9+\-\s()]{7,15}$/.test(form.phone)) nextErrors.phone = 'Please enter a valid phone number.';
    if (!form.department) nextErrors.department = 'Please select a department.';
    if (!form.doctor) nextErrors.doctor = 'Please select a doctor.';
    if (!form.appointmentDate) nextErrors.appointmentDate = 'Please select a date.';
    if (form.appointmentDate && form.appointmentDate < today) nextErrors.appointmentDate = 'Please choose today or a future date.';
    if (!form.appointmentTime) nextErrors.appointmentTime = 'Please select a time slot.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      showToast('Please fix the errors in the form.', 'error');
      return;
    }

    setSubmitting(true);

    const payload = {
      patientName: form.patientName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      age: form.age ? parseInt(form.age, 10) : undefined,
      gender: form.gender || undefined,
      department: form.department,
      doctor: form.doctor,
      appointmentDate: form.appointmentDate,
      appointmentTime: form.appointmentTime,
      message: form.message.trim(),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || 'Failed to book appointment');
      }

      showToast('🎉 Appointment booked successfully! We will contact you shortly.');
      setForm(INITIAL_FORM);
      setErrors({});
    } catch (error) {
      showToast(error.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageBanner title="Book an Appointment" breadcrumbLabel="Appointment" />
      <section>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="card-custom p-4 p-md-5 reveal active">
                <form id="appointmentForm" noValidate onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <FormField label="Full Name" name="patientName" value={form.patientName} onChange={handleChange} placeholder="John Doe" error={errors.patientName} />
                    <FormField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      error={errors.email}
                    />
                    <FormField
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 234 567 8901"
                      error={errors.phone}
                    />
                    <div className="col-md-3">
                      <label className="form-label-custom">Age</label>
                      <input type="number" name="age" min="0" className="form-control form-control-custom" placeholder="30" value={form.age} onChange={handleChange} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label-custom">Gender</label>
                      <select name="gender" className="form-select form-control-custom" value={form.gender} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <SelectField
                      label="Department"
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      options={[
                        { value: '', label: 'Select department', disabled: true },
                        { value: 'Cardiology', label: 'Cardiology' },
                        { value: 'Neurology', label: 'Neurology' },
                        { value: 'Orthopedics', label: 'Orthopedics' },
                        { value: 'Pediatrics', label: 'Pediatrics' },
                        { value: 'Dermatology', label: 'Dermatology' },
                        { value: 'ENT', label: 'ENT' },
                      ]}
                      error={errors.department}
                    />
                    <SelectField
                      label="Doctor"
                      name="doctor"
                      value={form.doctor}
                      onChange={handleChange}
                      options={
                        loadingDoctors
                          ? [{ value: '', label: 'Loading doctors...', disabled: true }]
                          : [{ value: '', label: 'Choose a doctor', disabled: true }].concat(
                              doctors.map((doctor) => ({
                                value: doctor._id,
                                label: `${doctor.name} - ${doctor.specialization}`,
                              }))
                            )
                      }
                      error={errors.doctor}
                    />

                    <FormField label="Preferred Date" name="appointmentDate" type="date" value={form.appointmentDate} onChange={handleChange} error={errors.appointmentDate} min={today} />
                    <SelectField
                      label="Preferred Time"
                      name="appointmentTime"
                      value={form.appointmentTime}
                      onChange={handleChange}
                      options={[
                        { value: '', label: 'Select time slot', disabled: true },
                        { value: '09:00 AM', label: '09:00 AM' },
                        { value: '10:00 AM', label: '10:00 AM' },
                        { value: '11:00 AM', label: '11:00 AM' },
                        { value: '12:00 PM', label: '12:00 PM' },
                        { value: '02:00 PM', label: '02:00 PM' },
                        { value: '03:00 PM', label: '03:00 PM' },
                        { value: '04:00 PM', label: '04:00 PM' },
                      ]}
                      error={errors.appointmentTime}
                    />

                    <FormTextarea
                      label="Additional Message (optional)"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your visit..."
                    />

                    <div className="col-12 text-center">
                      <button type="submit" className="btn btn-primary-custom px-5" disabled={submitting}>
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />Booking...
                          </>
                        ) : (
                          'Confirm Appointment'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}