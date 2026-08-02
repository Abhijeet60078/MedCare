export default function EmergencyPage() {
  const emergencyItems = [
    'Chest pain or difficulty breathing',
    'Severe bleeding or major injuries',
    'Sudden numbness or confusion (stroke symptoms)',
    'Severe allergic reactions',
    'High fever with severe symptoms',
  ];

  return (
    <>
      <div className="emergency-banner">
        <div className="container">
          <i className="fa-solid fa-truck-medical fa-3x mb-3" />
          <h1>24/7 Emergency Care</h1>
          <p>Our emergency team is available around the clock for any medical crisis.</p>
          <div className="emergency-hotline pulse rounded-4 d-inline-block px-4 py-2">
            <i className="fa-solid fa-phone-volume me-2" />+1 (800) 911-CARE
          </div>
        </div>
      </div>

      <section>
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4 reveal active">
              <div className="card-custom emergency-card p-4">
                <i className="fa-solid fa-clock text-primary fa-2x mb-3" />
                <h5>Always Available</h5>
                <p className="text-muted-custom">Our emergency department operates 24 hours a day, 7 days a week, 365 days a year.</p>
              </div>
            </div>
            <div className="col-md-4 reveal active">
              <div className="card-custom emergency-card p-4">
                <i className="fa-solid fa-user-doctor text-primary fa-2x mb-3" />
                <h5>Expert Trauma Team</h5>
                <p className="text-muted-custom">Highly trained emergency physicians and nurses ready to respond immediately.</p>
              </div>
            </div>
            <div className="col-md-4 reveal active">
              <div className="card-custom emergency-card p-4">
                <i className="fa-solid fa-truck-medical text-primary fa-2x mb-3" />
                <h5>Ambulance Service</h5>
                <p className="text-muted-custom">Rapid-response ambulance service equipped with life-saving equipment.</p>
              </div>
            </div>
          </div>

          <div className="row mt-5 align-items-center">
            <div className="col-lg-6 reveal-left active">
              <h2 className="fw-bold mb-3">When to Seek Emergency Care</h2>
              <ul className="list-unstyled">
                {emergencyItems.map((item) => (
                  <li className="mb-2" key={item}>
                    <i className="fa-solid fa-circle-exclamation text-danger me-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-lg-6 reveal-right active">
              <img src="https://images.unsplash.com/photo-1587351021355-a479a299d2f9?w=650&q=80" className="img-fluid rounded-4 shadow" alt="Emergency room" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}