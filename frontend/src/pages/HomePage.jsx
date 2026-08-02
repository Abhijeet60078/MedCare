import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../services/api';
import { DoctorCard, SectionTitle, TestimonialCard } from '../components/Layout';
import { useToast } from '../context/ToastContext';
import { formatIndianNumber } from '../services/format';

const HOME_DEPARTMENTS = [
  { icon: 'fa-heart-pulse', name: 'Cardiology', description: 'Heart & cardiovascular care' },
  { icon: 'fa-brain', name: 'Neurology', description: 'Brain & nervous system care' },
  { icon: 'fa-bone', name: 'Orthopedics', description: 'Bones, joints & muscles' },
  { icon: 'fa-baby', name: 'Pediatrics', description: 'Child healthcare' },
];

const HOME_FAQ = [
  {
    id: 'faq1',
    question: 'How do I book an appointment?',
    answer:
      "Simply visit our Appointment page, select your preferred doctor, date, and time, and fill in your details. You'll receive a confirmation shortly after.",
    open: true,
  },
  {
    id: 'faq2',
    question: 'Do you offer emergency services?',
    answer:
      'Yes, MedCare Hospital provides 24/7 emergency care. Please visit our Emergency page for the hotline number and directions.',
  },
  {
    id: 'faq3',
    question: 'Can I cancel or reschedule my appointment?',
    answer: 'Yes, please contact our support team via the Contact page at least 24 hours before your scheduled appointment.',
  },
  {
    id: 'faq4',
    question: 'Is my personal information secure?',
    answer:
      'Absolutely. We follow strict data protection protocols to ensure your medical and personal information remains confidential.',
  },
];

const ABOUT_STATS = [
  { value: 4500, label: 'Happy Patients' },
  { value: 120, label: 'Expert Doctors' },
  { value: 15, label: 'Departments' },
  { value: 20, label: 'Years of Service' },
];

export default function HomePage() {
  const showToast = useToast();
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadHomeData() {
      try {
        const [doctorsResponse, testimonialsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/doctors`),
          fetch(`${API_BASE_URL}/testimonials`),
        ]);

        const doctorsJson = await doctorsResponse.json();
        const testimonialsJson = await testimonialsResponse.json();

        if (!cancelled) {
          setFeaturedDoctors((doctorsJson.data || []).slice(0, 4));
          setTestimonials((testimonialsJson.data || []).slice(0, 3));
        }
      } catch (error) {
        if (!cancelled) {
          setFeaturedDoctors([]);
          setTestimonials([]);
        }
      }
    }

    loadHomeData();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();

    if (!newsletterEmail.trim()) {
      showToast('Please enter your email address.', 'error');
      return;
    }

    showToast('Thanks for subscribing! 🎉');
    setNewsletterEmail('');
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 reveal-left active">
              <h1>
                Your Health, Our <span>Priority</span>
              </h1>
              <p>MedCare Hospital brings together expert doctors, modern facilities, and compassionate care — all in one place. Book your appointment in minutes.</p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/appointment" className="btn btn-primary-custom">
                  Book Appointment <i className="fa-solid fa-arrow-right ms-1" />
                </Link>
                <Link to="/doctors" className="btn btn-outline-custom">
                  Find a Doctor
                </Link>
              </div>
            </div>
            <div className="col-lg-6 mt-5 mt-lg-0">
              <div className="hero-img-wrap reveal-right active">
                <img src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=700&q=80" className="img-fluid" alt="Doctors team" />
                <div className="floating-card card-1">
                  <i className="fa-solid fa-user-doctor" />
                  <div>
                    <strong>50+</strong>
                    <br />
                    <small>Expert Doctors</small>
                  </div>
                </div>
                <div className="floating-card card-2">
                  <i className="fa-solid fa-heart-pulse" />
                  <div>
                    <strong>24/7</strong>
                    <br />
                    <small>Emergency Care</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-alt py-5">
        <div className="container">
          <div className="row">
            {ABOUT_STATS.map((stat) => (
              <div className="col-6 col-md-3 stat-box reveal active" key={stat.label}>
                <span className="counter" data-target={stat.value}>
                  {formatIndianNumber(stat.value)}
                </span>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 reveal-left active">
              <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=650&q=80" className="img-fluid rounded-4 shadow" alt="Hospital" />
            </div>
            <div className="col-lg-6 reveal-right active">
              <div className="tag">About MedCare</div>
              <h2 className="fw-bold mt-2 mb-3">Committed to Excellence in Healthcare</h2>
              <p className="text-muted-custom">
                For over 20 years, MedCare Hospital has delivered world-class medical care with a human touch. Our multidisciplinary team combines advanced technology with genuine compassion to give every patient the best possible outcome.
              </p>
              <ul className="list-unstyled mt-4">
                <li className="mb-2">
                  <i className="fa-solid fa-circle-check text-success me-2" />Certified &amp; experienced medical staff
                </li>
                <li className="mb-2">
                  <i className="fa-solid fa-circle-check text-success me-2" />State-of-the-art equipment
                </li>
                <li className="mb-2">
                  <i className="fa-solid fa-circle-check text-success me-2" />24/7 emergency support
                </li>
              </ul>
              <Link to="/about" className="btn btn-primary-custom mt-2">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-alt">
        <div className="container">
          <SectionTitle tag="Our Departments" title="Specialized Care For Every Need" description="Explore our wide range of medical departments staffed by leading specialists." />
          <div className="row g-4 reveal-group">
            {HOME_DEPARTMENTS.map((department) => (
              <div className="col-lg-3 col-md-6" key={department.name}>
                <div className="card-custom dept-card reveal active">
                  <div className="dept-icon">
                    <i className={`fa-solid ${department.icon}`} />
                  </div>
                  <h5>{department.name}</h5>
                  <p>{department.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link to="/departments" className="btn btn-outline-custom">
              View All Departments
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <SectionTitle tag="Meet Our Team" title="Expert Doctors You Can Trust" description="Our doctors bring years of experience and genuine care to every consultation." />
          <div className="row">
            {featuredDoctors.length ? featuredDoctors.map((doctor) => <DoctorCard doctor={doctor} key={doctor._id} />) : <p className="text-center text-muted-custom">Loading doctors...</p>}
          </div>
          <div className="text-center mt-4">
            <Link to="/doctors" className="btn btn-outline-custom">
              View All Doctors
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-alt">
        <div className="container">
          <SectionTitle tag="Testimonials" title="What Our Patients Say" />
          <div className="row">
            {testimonials.length ? testimonials.map((testimonial) => <TestimonialCard testimonial={testimonial} key={testimonial._id || testimonial.name} />) : <p className="text-center text-muted-custom">Loading testimonials...</p>}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <SectionTitle tag="FAQ" title="Frequently Asked Questions" />
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="accordion" id="faqAccordion">
                {HOME_FAQ.map((item) => (
                  <div className="accordion-item" key={item.id}>
                    <h2 className="accordion-header">
                      <button className={`accordion-button${item.open ? '' : ' collapsed'}`} type="button" data-bs-toggle="collapse" data-bs-target={`#${item.id}`}>
                        {item.question}
                      </button>
                    </h2>
                    <div id={item.id} className={`accordion-collapse collapse${item.open ? ' show' : ''}`} data-bs-parent="#faqAccordion">
                      <div className="accordion-body">{item.answer}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-0">
        <div className="container">
          <div className="newsletter-box reveal active">
            <h3>Subscribe to Our Newsletter</h3>
            <p className="mb-0">Get health tips, hospital news, and updates straight to your inbox.</p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input type="email" placeholder="Enter your email" value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}