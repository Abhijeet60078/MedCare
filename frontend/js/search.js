/* ==========================================================================
   MedCare Hospital - Doctors Search, Filter & Render (doctors.html)
   ========================================================================== */

let allDoctors = [];

document.addEventListener('DOMContentLoaded', () => {
  const doctorsGrid = document.getElementById('doctorsGrid');
  if (!doctorsGrid) return; // Only run on doctors.html

  fetchDoctors();

  const searchInput = document.getElementById('doctorSearchInput');
  const deptFilter = document.getElementById('departmentFilter');

  if (searchInput) {
    searchInput.addEventListener('input', debounce(renderFilteredDoctors, 300));
  }
  if (deptFilter) {
    deptFilter.addEventListener('change', renderFilteredDoctors);
  }
});

async function fetchDoctors() {
  const doctorsGrid = document.getElementById('doctorsGrid');
  try {
    const res = await fetch(`${API_BASE_URL}/doctors`);
    const json = await res.json();
    allDoctors = json.data || [];
    populateDepartmentFilter(allDoctors);
    renderDoctors(allDoctors);
  } catch (err) {
    console.error('Failed to load doctors:', err);
    doctorsGrid.innerHTML = `
      <div class="empty-state col-12">
        <i class="fa-solid fa-triangle-exclamation fa-2x mb-3"></i>
        <p>Could not load doctors. Please make sure the backend server is running.</p>
      </div>`;
  }
}

function populateDepartmentFilter(doctors) {
  const deptFilter = document.getElementById('departmentFilter');
  if (!deptFilter) return;

  const departments = [...new Set(doctors.map((d) => d.department))].sort();
  departments.forEach((dept) => {
    const opt = document.createElement('option');
    opt.value = dept;
    opt.textContent = dept;
    deptFilter.appendChild(opt);
  });
}

function renderFilteredDoctors() {
  const searchInput = document.getElementById('doctorSearchInput');
  const deptFilter = document.getElementById('departmentFilter');

  const query = (searchInput?.value || '').toLowerCase().trim();
  const dept = deptFilter?.value || '';

  const filtered = allDoctors.filter((doc) => {
    const matchesQuery =
      !query ||
      doc.name.toLowerCase().includes(query) ||
      doc.specialization.toLowerCase().includes(query) ||
      doc.department.toLowerCase().includes(query);
    const matchesDept = !dept || doc.department === dept;
    return matchesQuery && matchesDept;
  });

  renderDoctors(filtered);
}

function renderDoctors(doctors) {
  const doctorsGrid = document.getElementById('doctorsGrid');
  if (!doctorsGrid) return;

  if (!doctors.length) {
    doctorsGrid.innerHTML = `
      <div class="empty-state col-12">
        <i class="fa-solid fa-user-doctor fa-2x mb-3"></i>
        <p>No doctors found matching your search.</p>
      </div>`;
    return;
  }

  doctorsGrid.innerHTML = doctors
    .map(
      (doc) => `
    <div class="col-lg-4 col-md-6 mb-4">
      <div class="card-custom doctor-card reveal active">
        <img src="${doc.image || 'images/doctor-placeholder.jpg'}" alt="${doc.name}" onerror="this.src='https://placehold.co/400x300?text=Doctor'">
        <div class="doctor-card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h5>${doc.name}</h5>
              <div class="spec">${doc.specialization}</div>
            </div>
            <span class="rating-badge"><i class="fa-solid fa-star"></i> ${doc.rating}</span>
          </div>
          <div class="meta">
            <div><i class="fa-solid fa-hospital me-1"></i> ${doc.department}</div>
            <div><i class="fa-solid fa-briefcase me-1"></i> ${doc.experience} yrs experience</div>
            <div><i class="fa-regular fa-clock me-1"></i> ${doc.availableTime}</div>
          </div>
          <a href="appointment.html?doctorId=${doc._id}" class="btn btn-primary-custom w-100 mt-2">Book Appointment</a>
        </div>
      </div>
    </div>`
    )
    .join('');
}

// Debounce helper for search input
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
