import { PageBanner } from '../components/Layout';
import { formatIndianNumber } from '../services/format';

const ABOUT_STATS = [
  { value: 4500, label: 'Happy Patients' },
  { value: 120, label: 'Expert Doctors' },
  { value: 15, label: 'Departments' },
  { value: 20, label: 'Years of Service' },
];

export default function AboutPage() {
  return (
    <>
      <PageBanner title="About MedCare Hospital" breadcrumbLabel="About" />
      <section>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 reveal-left active">
              <img src="https://images.unsplash.com/photo-1587351021355-a479a299d2f9?w=650&q=80" className="img-fluid rounded-4 shadow" alt="Hospital building" />
            </div>
            <div className="col-lg-6 reveal-right active">
              <div className="tag">Who We Are</div>
              <h2 className="fw-bold mt-2 mb-3">Two Decades of Trusted Care</h2>
              <p className="text-muted-custom">
                MedCare Hospital was founded with a simple mission: deliver exceptional healthcare with compassion and integrity. Today, we're proud to serve thousands of patients each year through a network of specialists, modern diagnostic equipment, and a patient-first philosophy.
              </p>
              <p className="text-muted-custom">Our multidisciplinary approach ensures every patient receives coordinated, personalized care — from routine check-ups to complex treatments.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-alt">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-4 reveal active">
              <div className="card-custom p-4">
                <i className="fa-solid fa-bullseye fa-2x text-primary mb-3" />
                <h5>Our Mission</h5>
                <p className="text-muted-custom">To provide accessible, high-quality healthcare that improves lives and builds healthier communities.</p>
              </div>
            </div>
            <div className="col-md-4 reveal active">
              <div className="card-custom p-4">
                <i className="fa-solid fa-eye fa-2x text-primary mb-3" />
                <h5>Our Vision</h5>
                <p className="text-muted-custom">To be the most trusted healthcare provider, recognized for clinical excellence and genuine patient care.</p>
              </div>
            </div>
            <div className="col-md-4 reveal active">
              <div className="card-custom p-4">
                <i className="fa-solid fa-hand-holding-heart fa-2x text-primary mb-3" />
                <h5>Our Values</h5>
                <p className="text-muted-custom">Compassion, integrity, excellence, and innovation guide everything we do.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
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
    </>
  );
}