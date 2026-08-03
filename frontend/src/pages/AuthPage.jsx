import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FormField, PageBanner, SectionTitle } from '../components/Layout';

const ROLE_META = {
  admin: {
    label: 'Admin',
    title: 'Administration Portal',
    description: 'Secure entry for hospital operations, doctor coordination, and patient oversight.',
    icon: 'fa-user-shield',
    points: ['Approve operational changes', 'Review hospital-wide records', 'Manage doctors and departments'],
    demo: { email: 'admin@medcare.com', password: 'Admin@123' },
  },
  doctor: {
    label: 'Doctor',
    title: 'Doctor Portal',
    description: 'Clinical access for appointments, visit notes, prescriptions, and treatment history.',
    icon: 'fa-user-doctor',
    points: ['View assigned appointments', 'Add patient history entries', 'Track follow-up care'],
    demo: { email: 'doctor@medcare.com', password: 'Doctor@123' },
  },
  patient: {
    label: 'Patient',
    title: 'Patient Portal',
    description: 'Personal access for booking, appointment tracking, and your own medical history.',
    icon: 'fa-user-injured',
    points: ['Check upcoming visits', 'Review your records', 'Keep your care plan in one place'],
    demo: { email: 'patient@medcare.com', password: 'Patient@123' },
  },
};

const AUTH_MODES = {
  login: {
    title: 'Login',
    submitLabel: 'Sign In',
    switchLabel: 'Create an account',
  },
  signup: {
    title: 'Sign Up',
    submitLabel: 'Create Account',
    switchLabel: 'Already have an account?',
  },
};

const DEFAULT_FORM = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function getRolePath(role, mode) {
  return `/auth/${role}/${mode}`;
}

export default function AuthPage() {
  const { role = 'patient', mode = 'login' } = useParams();
  const navigate = useNavigate();
  const { authUser, login, signup, logout } = useAuth();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedRole = ROLE_META[role] ? role : '';
  const selectedMode = AUTH_MODES[mode] ? mode : '';

  useEffect(() => {
    setForm(DEFAULT_FORM);
    setError('');
  }, [selectedRole, selectedMode]);

  const pageMeta = useMemo(() => {
    if (!selectedRole || !selectedMode) return null;
    return {
      role: ROLE_META[selectedRole],
      mode: AUTH_MODES[selectedMode],
    };
  }, [selectedMode, selectedRole]);

  if (!pageMeta) {
    return <Navigate replace to={getRolePath('patient', 'login')} />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (selectedMode === 'signup' && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setSaving(true);
      const session =
        selectedMode === 'login'
          ? await login({ email: form.email, password: form.password, role: selectedRole })
          : await signup({ name: form.name, email: form.email, password: form.password, role: selectedRole });

      navigate(`/dashboard/${session.role}`, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageBanner title={`${pageMeta.role.title} ${pageMeta.mode.title}`} breadcrumbLabel={`${pageMeta.role.label} ${pageMeta.mode.title}`} />
      <section className="auth-section">
        <div className="container">
          <SectionTitle
            tag="Role Locked Access"
            title="Separate Login And Sign Up For Each Role"
            description="Choose the portal that matches your access level. Admin, doctor, and patient accounts stay isolated from one another."
          />
          <div className="row g-4 align-items-stretch">
            <div className="col-lg-5">
              <div className="card-custom auth-info-panel p-4 p-lg-5 h-100 reveal active">
                <div className="auth-role-icon mb-4">
                  <i className={`fa-solid ${pageMeta.role.icon}`} />
                </div>
                <div className="tag mb-2">{pageMeta.role.label} Access</div>
                <h3 className="mb-3">{pageMeta.role.title}</h3>
                <p className="text-muted-custom mb-4">{pageMeta.role.description}</p>
                <ul className="auth-feature-list">
                  {pageMeta.role.points.map((point) => (
                    <li key={point}>
                      <i className="fa-solid fa-circle-check" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="auth-demo-box mt-4">
                  <div className="auth-demo-label">Demo credentials</div>
                  <div className="auth-demo-value">{pageMeta.role.demo.email}</div>
                  <div className="text-muted-custom">{pageMeta.role.demo.password}</div>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="card-custom auth-card p-4 p-lg-5 h-100 reveal active">
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {Object.entries(AUTH_MODES).map(([key, value]) => (
                    <Link key={key} to={getRolePath(selectedRole, key)} className={`auth-toggle ${selectedMode === key ? 'active' : ''}`}>
                      {value.title}
                    </Link>
                  ))}
                </div>

                <div className="auth-role-tabs mb-4">
                  {Object.entries(ROLE_META).map(([key, value]) => (
                    <Link key={key} to={getRolePath(key, selectedMode)} className={`auth-role-tab ${selectedRole === key ? 'active' : ''}`}>
                      <i className={`fa-solid ${value.icon}`} />
                      <span>{value.label}</span>
                    </Link>
                  ))}
                </div>

                {authUser ? (
                  <div className="alert alert-info d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div>
                      Signed in as <strong>{authUser.name || authUser.email}</strong> with <strong>{authUser.role}</strong> access.
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-custom btn-sm" type="button" onClick={logout}>
                        Logout
                      </button>
                      <button className="btn btn-primary-custom btn-sm" type="button" onClick={() => navigate(`/dashboard/${authUser.role}`)}>
                        Open Dashboard
                      </button>
                    </div>
                  </div>
                ) : null}

                {error ? <div className="alert alert-danger">{error}</div> : null}

                <form className="row g-3" onSubmit={handleSubmit}>
                  {selectedMode === 'signup' ? (
                    <FormField label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" />
                  ) : null}
                  <FormField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
                  <FormField label="Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter password" />
                  {selectedMode === 'signup' ? (
                    <FormField
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                    />
                  ) : null}

                  <div className="col-12 d-flex flex-wrap gap-3 align-items-center mt-2">
                    <button className="btn btn-primary-custom" type="submit" disabled={saving}>
                      {saving ? 'Please wait...' : pageMeta.mode.submitLabel}
                    </button>
                    <Link to={getRolePath(selectedRole, selectedMode === 'login' ? 'signup' : 'login')} className="btn btn-outline-custom">
                      {pageMeta.mode.switchLabel}
                    </Link>
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