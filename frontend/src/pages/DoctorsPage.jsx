import { useEffect, useMemo, useState } from 'react';
import { PageBanner, DoctorCard } from '../components/Layout';
import { API_BASE_URL } from '../services/api';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [loadingDoctors, setLoadingDoctors] = useState(true);

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

  const departments = useMemo(() => {
    return [...new Set(doctors.map((doctor) => doctor.department))].sort();
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    return doctors.filter((doctor) => {
      const matchesQuery =
        !normalizedQuery ||
        doctor.name.toLowerCase().includes(normalizedQuery) ||
        doctor.specialization.toLowerCase().includes(normalizedQuery) ||
        doctor.department.toLowerCase().includes(normalizedQuery);
      const matchesDepartment = !department || doctor.department === department;
      return matchesQuery && matchesDepartment;
    });
  }, [department, doctors, query]);

  return (
    <>
      <PageBanner title="Our Doctors" breadcrumbLabel="Doctors" />
      <section>
        <div className="container">
          <div className="filter-bar reveal active">
            <div className="row g-3 align-items-center">
              <div className="col-md-7">
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0">
                    <i className="fa-solid fa-magnifying-glass" />
                  </span>
                  <input
                    type="text"
                    className="form-control form-control-custom border-start-0"
                    placeholder="Search by name, specialization, or department..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-5">
                <select className="form-select form-control-custom" value={department} onChange={(event) => setDepartment(event.target.value)}>
                  <option value="">All Departments</option>
                  {departments.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="row">
            {loadingDoctors ? (
              <p className="text-center text-muted-custom">Loading doctors...</p>
            ) : filteredDoctors.length ? (
              filteredDoctors.map((doctor) => <DoctorCard doctor={doctor} key={doctor._id} />)
            ) : (
              <div className="empty-state col-12">
                <i className="fa-solid fa-user-doctor fa-2x mb-3" />
                <p>No doctors found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}