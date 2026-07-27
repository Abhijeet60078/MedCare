/* ==========================================================================
   MedCare Hospital - Core App Script
   Handles: loading spinner, sticky navbar, back-to-top, scroll reveal,
   newsletter, FAQ (bootstrap handles accordion), active nav link.
   ========================================================================== */

// Base URL for API calls - change if backend runs elsewhere
const API_BASE_URL = window.location.origin.includes('5500') || window.location.origin.includes('file')
  ? 'http://localhost:5000/api'
  : '/api';

// ---------- Loading Spinner ----------
window.addEventListener('load', () => {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    setTimeout(() => spinner.classList.add('hide'), 350);
  }
});

// ---------- Sticky Navbar on Scroll ----------
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (!navbar) return;
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  toggleBackToTop();
});

// ---------- Back to Top Button ----------
const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTop() {
  if (!backToTopBtn) return;
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
}

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---------- Scroll Reveal Animations ----------
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!revealEls.length) return;

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

  revealEls.forEach((el) => observer.observe(el));
}
document.addEventListener('DOMContentLoaded', initScrollReveal);

// ---------- Mark Active Nav Link ----------
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
});

// ---------- Newsletter Form ----------
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    if (emailInput && emailInput.value.trim()) {
      showToast('Thanks for subscribing! 🎉');
      newsletterForm.reset();
    }
  });
}

// ---------- Simple Toast Notification ----------
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.style.cssText =
      'position:fixed;top:90px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? '#14b8a6' : type === 'error' ? '#dc2626' : '#0d6efd';
  toast.style.cssText = `background:${bgColor};color:#fff;padding:14px 22px;border-radius:10px;box-shadow:0 8px 20px rgba(0,0,0,0.15);font-weight:600;min-width:250px;opacity:0;transform:translateX(30px);transition:all 0.3s ease;`;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
