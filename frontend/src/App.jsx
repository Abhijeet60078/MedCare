import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContext } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoadingSpinner, SiteHeader, SiteFooter, BackToTop, ToastBanner } from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import DoctorsPage from './pages/DoctorsPage';
import DepartmentsPage from './pages/DepartmentsPage';
import AppointmentPage from './pages/AppointmentPage';
import ContactPage from './pages/ContactPage';
import EmergencyPage from './pages/EmergencyPage';
import AuthPage from './pages/AuthPage';
import {
  AdminDashboardPage,
  DashboardHubPage,
  DoctorDashboardPage,
  PatientDashboardPage,
} from './pages/DashboardPage';

const THEME_KEY = 'medcare-theme';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}

function DashboardLandingRoute() {
  const { authUser } = useAuth();

  if (authUser) {
    return <Navigate replace to={`/dashboard/${authUser.role}`} />;
  }

  return <DashboardHubPage />;
}

function ProtectedDashboardRoute({ requiredRole, children }) {
  const { authUser } = useAuth();
  const location = useLocation();

  if (!authUser) {
    return <Navigate replace to={`/auth/${requiredRole}/login`} state={{ from: location.pathname }} />;
  }

  if (authUser.role !== requiredRole) {
    return <Navigate replace to={`/dashboard/${authUser.role}`} />;
  }

  return children;
}

function AppShell() {
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const savedTheme = window.localStorage.getItem(THEME_KEY);
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [loading, setLoading] = useState(true);
  const [backToTopVisible, setBackToTopVisible] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setBackToTopVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [location.pathname, loading]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={showToast}>
      <div className="fade-in-page">
        <LoadingSpinner hidden={!loading} />
        <SiteHeader theme={theme} onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/dashboard" element={<DashboardLandingRoute />} />
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedDashboardRoute requiredRole="admin">
                  <AdminDashboardPage />
                </ProtectedDashboardRoute>
              }
            />
            <Route
              path="/dashboard/doctor"
              element={
                <ProtectedDashboardRoute requiredRole="doctor">
                  <DoctorDashboardPage />
                </ProtectedDashboardRoute>
              }
            />
            <Route
              path="/dashboard/patient"
              element={
                <ProtectedDashboardRoute requiredRole="patient">
                  <PatientDashboardPage />
                </ProtectedDashboardRoute>
              }
            />
            <Route path="/auth" element={<Navigate replace to="/auth/patient/login" />} />
            <Route path="/auth/:role/:mode" element={<AuthPage />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
          </Routes>
        </main>
        <SiteFooter />
        <BackToTop visible={backToTopVisible} />
        {toast ? <ToastBanner message={toast.message} type={toast.type} /> : null}
      </div>
    </ToastContext.Provider>
  );
}

export default App;
