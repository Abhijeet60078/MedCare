import { useEffect, useState } from 'react';
import { PageBanner, DepartmentCard } from '../components/Layout';
import { API_BASE_URL } from '../services/api';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setLoadingDepartments(true);

        const response = await fetch(`${API_BASE_URL}/departments`);

        if (!response.ok) {
          throw new Error("Failed to fetch departments");
        }

        const json = await response.json();

        console.log("Department API Response:", json);

        // API returns data inside json.data
        setDepartments(json.data || []);

      } catch (error) {
        console.error("Department fetch error:", error);
        setError("Unable to load departments");
        setDepartments([]);

      } finally {
        setLoadingDepartments(false);
      }
    };

    loadDepartments();

  }, []);

  return (
    <>
      <PageBanner 
        title="Our Departments" 
        breadcrumbLabel="Departments" 
      />

      <section>
        <div className="container">
          <div className="row g-4" id="departmentsGrid">

            {loadingDepartments ? (

              <p className="text-center text-muted-custom">
                Loading departments...
              </p>

            ) : error ? (

              <p className="text-center text-danger">
                {error}
              </p>

            ) : departments.length > 0 ? (

              departments.map((department) => (
                <DepartmentCard
                  key={department._id}
                  department={department}
                />
              ))

            ) : (

              <p className="text-center text-muted-custom">
                No departments found.
              </p>

            )}

          </div>
        </div>
      </section>
    </>
  );
}