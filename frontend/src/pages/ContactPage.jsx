import { useState } from 'react';
import { PageBanner, FormField, FormTextarea } from '../components/Layout';
import { API_BASE_URL } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function ContactPage() {
  const showToast = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Please enter a valid email.';
    if (!form.message.trim() || form.message.trim().length < 10) nextErrors.message = 'Message should be at least 10 characters.';
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

    try {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          subject: form.subject,
          message: form.message.trim(),
        }),
      });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || 'Failed to send message');
      }

      showToast('✅ Message sent! We will get back to you soon.');
      setForm({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      setErrors({});
    } catch (error) {
      showToast(error.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageBanner title="Contact Us" breadcrumbLabel="Contact" />
      <section>
        <div className="container">
          <div className="row g-4 mb-5 text-center">
            <div className="col-md-4 reveal active">
              <div className="card-custom p-4">
                <i className="fa-solid fa-location-dot fa-2x text-primary mb-3" />
                <h5>Address</h5>
                <p className="text-muted-custom mb-0">123 Wellness Ave, Health City, HC 45678</p>
              </div>
            </div>
            <div className="col-md-4 reveal active">
              <div className="card-custom p-4">
                <i className="fa-solid fa-phone fa-2x text-primary mb-3" />
                <h5>Phone</h5>
                <p className="text-muted-custom mb-0">+1 (800) 123-4567</p>
              </div>
            </div>
            <div className="col-md-4 reveal active">
              <div className="card-custom p-4">
                <i className="fa-solid fa-envelope fa-2x text-primary mb-3" />
                <h5>Email</h5>
                <p className="text-muted-custom mb-0">info@medcare.com</p>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card-custom p-4 p-md-5 reveal active">
                <h3 className="fw-bold mb-4 text-center">Send Us a Message</h3>
                <form id="contactForm" noValidate onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <FormField label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="Your name" error={errors.name} />
                    <FormField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      error={errors.email}
                    />
                    <div className="col-md-6">
                      <label className="form-label-custom">Phone (optional)</label>
                      <input type="tel" name="phone" className="form-control form-control-custom" placeholder="+1 234 567 8901" value={form.phone} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label-custom">Subject</label>
                      <select name="subject" className="form-select form-control-custom" value={form.subject} onChange={handleChange}>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Appointment">Appointment</option>
                        <option value="Billing">Billing</option>
                        <option value="Feedback">Feedback</option>
                      </select>
                    </div>
                    <FormTextarea
                      label="Message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      rows={5}
                      error={errors.message}
                    />
                    <div className="col-12 text-center">
                      <button type="submit" className="btn btn-primary-custom px-5" disabled={submitting}>
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />Sending...
                          </>
                        ) : (
                          'Send Message'
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