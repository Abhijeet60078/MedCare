import { useEffect, useState } from 'react';
import { PageBanner, DepartmentCard } from '../components/Layout';
import { API_BASE_URL } from '../services/api';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadDepartments() {
      try {
        const response = await fetch(`${API_BASE_URL}/departments`);
        const json = await response.json();

        if (!cancelled) {
          setDepartments(json.data || []);
        }
      } catch (error) {
        if (!cancelled) {
          setDepartments([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingDepartments(false);
        }
      }
    }

    loadDepartments();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <PageBanner title="Our Departments" breadcrumbLabel="Departments" />
      <section>
        <div className="container">
          <div className="row g-4" id="departmentsGrid">
            {loadingDepartments ? (
              <p className="text-center text-muted-custom">Loading departments...</p>
            ) : departments.length ? (
              departments.map((department) => <DepartmentCard department={department} key={department._id} />)
            ) : (
              <p className="text-center text-muted-custom">No departments found. Run the seed script to add sample data.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}