import { Link, NavLink } from 'react-router-dom';
import { formatIndianNumber } from '../services/format';

export const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/departments', label: 'Departments' },
  { to: '/emergency', label: 'Emergency' },
  { to: '/contact', label: 'Contact' },
];

export function LoadingSpinner({ hidden }) {
  return (
    <div id="loadingSpinner" className={hidden ? 'hide' : ''}>
      <div className="spinner-ring" />
    </div>
  );
}

export function SiteHeader({ theme, onToggleTheme }) {
  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fa-solid fa-heart-pulse" />MedCare
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav mx-auto">
            {NAV_ITEMS.map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink end={item.to === '/'} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to={item.to}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="d-flex align-items-center gap-3">
            <button className="theme-toggle-btn" id="themeToggle" type="button" onClick={onToggleTheme} aria-label="Toggle theme">
              <i className={theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'} />
            </button>
            <Link to="/appointment" className="btn btn-primary-custom">
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h5>
              <i className="fa-solid fa-heart-pulse text-primary me-2" />MedCare
            </h5>
            <p className="text-muted-custom">Compassionate care and advanced medicine, dedicated to your wellbeing.</p>
            <div className="social-icons mt-3">
              <a href="#">
                <i className="fa-brands fa-facebook-f" />
              </a>
              <a href="#">
                <i className="fa-brands fa-twitter" />
              </a>
              <a href="#">
                <i className="fa-brands fa-instagram" />
              </a>
              <a href="#">
                <i className="fa-brands fa-linkedin-in" />
              </a>
            </div>
          </div>
          <div className="col-lg-2 col-md-6">
            <h5>Quick Links</h5>
            <div className="footer-links">
              <Link to="/about">About Us</Link>
              <Link to="/doctors">Doctors</Link>
              <Link to="/departments">Departments</Link>
              <Link to="/appointment">Appointment</Link>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5>Support</h5>
            <div className="footer-links">
              <Link to="/contact">Contact Us</Link>
              <Link to="/emergency">Emergency</Link>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5>Contact Info</h5>
            <p className="text-muted-custom mb-1">
              <i className="fa-solid fa-location-dot me-2" />123 Wellness Ave, Health City
            </p>
            <p className="text-muted-custom mb-1">
              <i className="fa-solid fa-phone me-2" />+1 (800) 123-4567
            </p>
            <p className="text-muted-custom">
              <i className="fa-solid fa-envelope me-2" />info@medcare.com
            </p>
          </div>
        </div>
        <div className="footer-bottom">&copy; {formatIndianNumber(new Date().getFullYear())} MedCare Hospital. All rights reserved.</div>
      </div>
    </footer>
  );
}

export function BackToTop({ visible }) {
  return (
    <button id="backToTop" className={visible ? 'show' : ''} type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <i className="fa-solid fa-arrow-up" />
    </button>
  );
}

export function ToastBanner({ message, type }) {
  const bgColor = type === 'error' ? '#dc2626' : type === 'info' ? '#0d6efd' : '#14b8a6';

  return (
    <div
      id="toastContainer"
      style={{
        position: 'fixed',
        top: '90px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div
        style={{
          background: bgColor,
          color: '#fff',
          padding: '14px 22px',
          borderRadius: '10px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          fontWeight: 600,
          minWidth: '250px',
        }}
      >
        {message}
      </div>
    </div>
  );
}

export function PageBanner({ title, breadcrumbLabel }) {
  return (
    <div className="page-banner">
      <div className="container">
        <h1>{title}</h1>
        <div className="breadcrumb-custom mt-2">
          <Link to="/">Home</Link> / <span>{breadcrumbLabel}</span>
        </div>
      </div>
    </div>
  );
}

export function SectionTitle({ tag, title, description }) {
  return (
    <div className="section-title reveal active">
      {tag ? <div className="tag">{tag}</div> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

export function FormField({ label, name, type = 'text', value, onChange, placeholder, error, min }) {
  return (
    <div className="col-md-6">
      <label className="form-label-custom">{label}</label>
      <input
        type={type}
        name={name}
        className={`form-control form-control-custom${error ? ' is-invalid-custom' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
      />
      <div className="invalid-feedback-custom">{error || ''}</div>
    </div>
  );
}

export function SelectField({ label, name, value, onChange, options, error }) {
  return (
    <div className="col-md-6">
      <label className="form-label-custom">{label}</label>
      <select name={name} className={`form-select form-control-custom${error ? ' is-invalid-custom' : ''}`} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={`${name}-${option.label}`} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="invalid-feedback-custom">{error || ''}</div>
    </div>
  );
}

export function FormTextarea({ label, name, value, onChange, placeholder, rows = 4, error }) {
  return (
    <div className="col-12">
      <label className="form-label-custom">{label}</label>
      <textarea
        name={name}
        rows={rows}
        className={`form-control form-control-custom${error ? ' is-invalid-custom' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <div className="invalid-feedback-custom">{error || ''}</div>
    </div>
  );
}

export function DoctorCard({ doctor }) {
  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className="card-custom doctor-card reveal active">
        <img
          src={doctor.image || '/images/doctor-placeholder.jpg'}
          alt={doctor.name}
          onError={(event) => {
            event.currentTarget.src = 'https://placehold.co/400x300?text=Doctor';
          }}
        />
        <div className="doctor-card-body">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h5>{doctor.name}</h5>
              <div className="spec">{doctor.specialization}</div>
            </div>
            <span className="rating-badge">
              <i className="fa-solid fa-star" /> {doctor.rating}
            </span>
          </div>
          <div className="meta">
            <div>
              <i className="fa-solid fa-hospital me-1" /> {doctor.department}
            </div>
            <div>
              <i className="fa-solid fa-briefcase me-1" /> {formatIndianNumber(doctor.experience)} yrs experience
            </div>
            <div>
              <i className="fa-regular fa-clock me-1" /> {doctor.availableTime}
            </div>
          </div>
          <Link to={`/appointment?doctorId=${doctor._id}`} className="btn btn-primary-custom w-100 mt-2">
            Book Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}

export function DepartmentCard({ department }) {
  return (
    <div className="col-lg-4 col-md-6">
      <div className="card-custom dept-card reveal active">
        <div className="dept-icon">
          <i className={`fa-solid ${department.icon || 'fa-notes-medical'}`} />
        </div>
        <h5>{department.name}</h5>
        <p>{department.description || ''}</p>
        <Link to="/doctors" className="badge-soft">
          View Doctors <i className="fa-solid fa-arrow-right ms-1" />
        </Link>
      </div>
    </div>
  );
}

export function TestimonialCard({ testimonial }) {
  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className="card-custom p-4 reveal active">
        <div className="d-flex align-items-center gap-3 mb-3">
          <img
            src={testimonial.image || '/images/user-placeholder.jpg'}
            alt={testimonial.name}
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
            onError={(event) => {
              event.currentTarget.src = 'https://placehold.co/128x128?text=User';
            }}
          />
          <div>
            <h5 className="mb-1">{testimonial.name}</h5>
            <small className="text-muted-custom">{testimonial.role || 'Patient'}</small>
          </div>
        </div>
        <p className="text-muted-custom mb-3">{testimonial.message}</p>
        <div className="text-warning">
          {Array.from({ length: testimonial.rating || 5 }).map((_, index) => (
            <i className="fa-solid fa-star" key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}