import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../services/api';
import { FormField, FormTextarea, PageBanner, SelectField, SectionTitle } from '../components/Layout';

const DASHBOARD_ROLES = [
  {
    title: 'Admin Portal',
    description: 'Login with an admin account to manage hospital-wide appointments, doctors, and departments.',
    to: '/auth/admin/login',
    icon: 'fa-user-shield',
  },
  {
    title: 'Doctor Portal',
    description: 'Login with a doctor account to review appointments, capture clinical notes, and manage visits.',
    to: '/auth/doctor/login',
    icon: 'fa-user-doctor',
  },
  {
    title: 'Patient Portal',
    description: 'Login with a patient account to check appointments and follow your own medical history.',
    to: '/auth/patient/login',
    icon: 'fa-user-injured',
  },
];

const INITIAL_MEDICAL_RECORD_FORM = {
  patientName: '',
  patientEmail: '',
  patientPhone: '',
  appointment: '',
  visitDate: new Date().toISOString().slice(0, 10),
  symptoms: '',
  diagnosis: '',
  prescription: '',
  notes: '',
  followUpDate: '',
};

function formatDate(value) {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function formatDateTime(value) {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatAppointmentSlot(dateValue, timeValue) {
  const dateLabel = formatDate(dateValue);
  return timeValue ? `${dateLabel} at ${timeValue}` : dateLabel;
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const json = await response.json();

  if (!response.ok || json.success === false) {
    throw new Error(json.message || 'Request failed');
  }

  return json;
}

function DashboardMetric({ label, value, icon, tone = 'primary' }) {
  return (
    <div className="col-lg-3 col-md-6">
      <div className={`dashboard-metric metric-${tone}`}>
        <div className="dashboard-metric-icon">
          <i className={`fa-solid ${icon}`} />
        </div>
        <div>
          <div className="dashboard-metric-value">{value}</div>
          <div className="dashboard-metric-label">{label}</div>
        </div>
      </div>
    </div>
  );
}

function DashboardCardLink({ title, description, to, icon }) {
  return (
    <div className="col-lg-4 col-md-6">
      <div className="card-custom dashboard-role-card p-4 reveal active">
        <div className="dashboard-role-icon">
          <i className={`fa-solid ${icon}`} />
        </div>
        <h5>{title}</h5>
        <p className="text-muted-custom mb-4">{description}</p>
        <Link to={to} className="btn btn-primary-custom w-100">
          Open Portal
        </Link>
      </div>
    </div>
  );
}

export function DashboardHubPage() {
  return (
    <>
      <PageBanner title="Portal Access" breadcrumbLabel="Portal Access" />
      <section>
        <div className="container">
          <SectionTitle
            tag="Role Locked Access"
            title="Choose The Correct Portal For Your Role"
            description="Each portal opens a different login and signup flow so patients never enter the doctor workspace, and doctors never use the patient flow."
          />
          <div className="row g-4">
            {DASHBOARD_ROLES.map((role) => (
              <DashboardCardLink key={role.title} {...role} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function AdminDashboardPage() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadAdminData() {
      try {
        setLoading(true);
        setError('');
        const [doctorJson, appointmentJson, recordJson, departmentJson] = await Promise.all([
          requestJson(`${API_BASE_URL}/doctors`),
          requestJson(`${API_BASE_URL}/appointments`),
          requestJson(`${API_BASE_URL}/medical-records`),
          requestJson(`${API_BASE_URL}/departments`),
        ]);

        if (!cancelled) {
          setDoctors(doctorJson.data || []);
          setAppointments(appointmentJson.data || []);
          setRecords(recordJson.data || []);
          setDepartments(departmentJson.data || []);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message);
          setDoctors([]);
          setAppointments([]);
          setRecords([]);
          setDepartments([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAdminData();
    return () => {
      cancelled = true;
    };
  }, []);

  const completedAppointments = useMemo(() => appointments.filter((appointment) => appointment.status === 'Completed').length, [appointments]);
  const activePatients = useMemo(() => new Set(records.map((record) => record.patientEmail)).size, [records]);

  return (
    <>
      <PageBanner title="Admin Dashboard" breadcrumbLabel="Admin Dashboard" />
      <section>
        <div className="container">
          <SectionTitle
            tag="Administration"
            title="Hospital Operations Overview"
            description="Monitor appointments, doctors, departments, and the latest medical history entries from a single view."
          />
          {error ? <div className="alert alert-danger">{error}</div> : null}
          <div className="row g-4 mb-4">
            <DashboardMetric label="Doctors" value={loading ? '...' : doctors.length} icon="fa-user-doctor" />
            <DashboardMetric label="Appointments" value={loading ? '...' : appointments.length} icon="fa-calendar-check" tone="secondary" />
            <DashboardMetric label="Medical Records" value={loading ? '...' : records.length} icon="fa-file-medical" tone="accent" />
            <DashboardMetric label="Active Patients" value={loading ? '...' : activePatients} icon="fa-users" tone="muted" />
          </div>

          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card-custom dashboard-panel p-4 h-100">
                <div className="dashboard-panel-header">
                  <div>
                    <div className="dashboard-panel-eyebrow">Operations</div>
                    <h4 className="mb-0">Recent appointments</h4>
                  </div>
                  <span className="badge-soft">{completedAppointments} completed</span>
                </div>
                <div className="table-responsive mt-4">
                  <table className="table dashboard-table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.slice(0, 5).map((appointment) => (
                        <tr key={appointment._id}>
                          <td>{appointment.patientName}</td>
                          <td>{appointment.doctor?.name || 'Unassigned'}</td>
                          <td>{formatAppointmentSlot(appointment.appointmentDate, appointment.appointmentTime)}</td>
                          <td>
                            <span className={`status-pill status-${String(appointment.status || '').toLowerCase()}`}>{appointment.status}</span>
                          </td>
                        </tr>
                      ))}
                      {!appointments.length ? (
                        <tr>
                          <td colSpan="4" className="text-center text-muted-custom py-4">
                            No appointments yet.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card-custom dashboard-panel p-4 h-100">
                <div className="dashboard-panel-header">
                  <div>
                    <div className="dashboard-panel-eyebrow">Clinical history</div>
                    <h4 className="mb-0">Latest medical records</h4>
                  </div>
                  <span className="badge-soft">{departments.length} departments</span>
                </div>
                <div className="dashboard-history-list mt-4">
                  {records.slice(0, 5).map((record) => (
                    <div className="dashboard-history-item" key={record._id}>
                      <div className="dashboard-history-icon">
                        <i className="fa-solid fa-notes-medical" />
                      </div>
                      <div>
                        <h6 className="mb-1">{record.patientName}</h6>
                        <p className="mb-1 text-muted-custom">{record.diagnosis}</p>
                        <small className="text-muted-custom">
                          {record.doctor?.name || 'Unknown doctor'} • {formatDate(record.visitDate)}
                        </small>
                      </div>
                    </div>
                  ))}
                  {!records.length ? <p className="text-muted-custom mb-0">No medical history records yet.</p> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function DoctorDashboardPage() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(INITIAL_MEDICAL_RECORD_FORM);

  const selectedDoctor = useMemo(() => doctors.find((doctor) => doctor._id === selectedDoctorId), [doctors, selectedDoctorId]);

  useEffect(() => {
    let cancelled = false;

    async function loadDoctors() {
      try {
        const json = await requestJson(`${API_BASE_URL}/doctors`);
        if (!cancelled) {
          const doctorList = json.data || [];
          setDoctors(doctorList);
          setSelectedDoctorId((current) => current || doctorList[0]?._id || '');
        }
      } catch (requestError) {
        if (!cancelled) setError(requestError.message);
      }
    }

    loadDoctors();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedDoctorId) return undefined;
    let cancelled = false;

    async function loadDoctorWorklist() {
      try {
        setLoading(true);
        setError('');
        const [appointmentJson, recordJson] = await Promise.all([
          requestJson(`${API_BASE_URL}/appointments?doctor=${selectedDoctorId}`),
          requestJson(`${API_BASE_URL}/medical-records?doctor=${selectedDoctorId}`),
        ]);

        if (!cancelled) {
          setAppointments(appointmentJson.data || []);
          setRecords(recordJson.data || []);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message);
          setAppointments([]);
          setRecords([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDoctorWorklist();
    return () => {
      cancelled = true;
    };
  }, [selectedDoctorId]);

  useEffect(() => {
    if (!selectedDoctor) return;

    setForm((current) => ({
      ...current,
      patientName: current.patientName,
      patientEmail: current.patientEmail,
      patientPhone: current.patientPhone,
    }));
  }, [selectedDoctor]);

  const completedAppointments = useMemo(() => appointments.filter((appointment) => appointment.status === 'Completed').length, [appointments]);
  const followUps = useMemo(() => records.filter((record) => record.followUpDate).length, [records]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => {
      if (name !== 'appointment') {
        return { ...current, [name]: value };
      }

      const appointment = appointments.find((item) => item._id === value);
      return {
        ...current,
        appointment: value,
        patientName: appointment?.patientName || current.patientName,
        patientEmail: appointment?.email || current.patientEmail,
        patientPhone: appointment?.phone || current.patientPhone,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedDoctorId) {
      setError('Select a doctor first.');
      return;
    }

    if (!form.patientName.trim() || !form.patientEmail.trim() || !form.diagnosis.trim()) {
      setError('Patient name, email, and diagnosis are required.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await requestJson(`${API_BASE_URL}/medical-records`, {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          doctor: selectedDoctorId,
          patientEmail: form.patientEmail.trim().toLowerCase(),
          patientName: form.patientName.trim(),
        }),
      });
      setForm(INITIAL_MEDICAL_RECORD_FORM);
      const [appointmentJson, recordJson] = await Promise.all([
        requestJson(`${API_BASE_URL}/appointments?doctor=${selectedDoctorId}`),
        requestJson(`${API_BASE_URL}/medical-records?doctor=${selectedDoctorId}`),
      ]);
      setAppointments(appointmentJson.data || []);
      setRecords(recordJson.data || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageBanner title="Doctor Dashboard" breadcrumbLabel="Doctor Dashboard" />
      <section>
        <div className="container">
          <SectionTitle
            tag="Clinical Workflow"
            title="Manage Your Patient History"
            description="Select a doctor profile, review upcoming visits, and record the diagnosis and treatment notes for each appointment."
          />
          {error ? <div className="alert alert-danger">{error}</div> : null}
          <div className="row g-4 mb-4 align-items-end">
            <div className="col-lg-6">
              <div className="card-custom dashboard-panel p-4">
                <label className="form-label-custom">Choose Doctor</label>
                <select className="form-select form-control-custom" value={selectedDoctorId} onChange={(event) => setSelectedDoctorId(event.target.value)}>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
                <p className="text-muted-custom mt-3 mb-0">{selectedDoctor ? `${selectedDoctor.department} department • ${selectedDoctor.availableTime}` : 'Loading doctor profile...'}</p>
              </div>
            </div>
            <DashboardMetric label="Appointments" value={loading ? '...' : appointments.length} icon="fa-calendar-days" />
            <DashboardMetric label="Completed Visits" value={loading ? '...' : completedAppointments} icon="fa-circle-check" tone="secondary" />
            <DashboardMetric label="Medical Notes" value={loading ? '...' : records.length} icon="fa-file-medical" tone="accent" />
          </div>

          <div className="row g-4">
            <div className="col-lg-5">
              <div className="card-custom dashboard-panel p-4 h-100">
                <div className="dashboard-panel-header mb-3">
                  <div>
                    <div className="dashboard-panel-eyebrow">Create record</div>
                    <h4 className="mb-0">Medical history entry</h4>
                  </div>
                  <span className="badge-soft">{followUps} follow-ups</span>
                </div>
                <form className="row g-3" onSubmit={handleSubmit}>
                  <FormField label="Patient Name" name="patientName" value={form.patientName} onChange={handleChange} placeholder="Patient full name" />
                  <FormField label="Patient Email" name="patientEmail" value={form.patientEmail} onChange={handleChange} placeholder="patient@example.com" />
                  <FormField label="Patient Phone" name="patientPhone" value={form.patientPhone} onChange={handleChange} placeholder="Phone number" />
                  <SelectField
                    label="Appointment"
                    name="appointment"
                    value={form.appointment}
                    onChange={handleChange}
                    options={[
                      { value: '', label: 'Link to appointment (optional)' },
                      ...appointments.map((appointment) => ({
                        value: appointment._id,
                        label: `${appointment.patientName} • ${formatAppointmentSlot(appointment.appointmentDate, appointment.appointmentTime)}`,
                      })),
                    ]}
                  />
                  <FormField label="Visit Date" name="visitDate" type="date" value={form.visitDate} onChange={handleChange} />
                  <FormTextarea label="Symptoms" name="symptoms" value={form.symptoms} onChange={handleChange} placeholder="Symptoms reported during the visit" rows={3} />
                  <FormTextarea label="Diagnosis" name="diagnosis" value={form.diagnosis} onChange={handleChange} placeholder="Clinical diagnosis" rows={3} />
                  <FormTextarea label="Prescription" name="prescription" value={form.prescription} onChange={handleChange} placeholder="Medication and instructions" rows={3} />
                  <FormTextarea label="Doctor Notes" name="notes" value={form.notes} onChange={handleChange} placeholder="Additional notes or observations" rows={3} />
                  <FormField label="Follow Up Date" name="followUpDate" type="date" value={form.followUpDate} onChange={handleChange} />
                  <div className="col-12 d-flex gap-3">
                    <button className="btn btn-primary-custom" type="submit" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Record'}
                    </button>
                    <button className="btn btn-outline-custom" type="button" onClick={() => setForm(INITIAL_MEDICAL_RECORD_FORM)}>
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="card-custom dashboard-panel p-4 mb-4">
                <div className="dashboard-panel-header">
                  <div>
                    <div className="dashboard-panel-eyebrow">Worklist</div>
                    <h4 className="mb-0">Upcoming appointments</h4>
                  </div>
                  <span className="badge-soft">{appointments.length} total</span>
                </div>
                <div className="table-responsive mt-4">
                  <table className="table dashboard-table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.slice(0, 6).map((appointment) => (
                        <tr key={appointment._id}>
                          <td>{appointment.patientName}</td>
                          <td>{formatAppointmentSlot(appointment.appointmentDate, appointment.appointmentTime)}</td>
                          <td>
                            <span className={`status-pill status-${String(appointment.status || '').toLowerCase()}`}>{appointment.status}</span>
                          </td>
                        </tr>
                      ))}
                      {!appointments.length ? (
                        <tr>
                          <td colSpan="3" className="text-center text-muted-custom py-4">
                            No appointments assigned to this doctor.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card-custom dashboard-panel p-4">
                <div className="dashboard-panel-header">
                  <div>
                    <div className="dashboard-panel-eyebrow">History</div>
                    <h4 className="mb-0">Recent medical records</h4>
                  </div>
                </div>
                <div className="dashboard-history-list mt-4">
                  {records.slice(0, 6).map((record) => (
                    <div className="dashboard-history-item" key={record._id}>
                      <div className="dashboard-history-icon">
                        <i className="fa-solid fa-file-prescription" />
                      </div>
                      <div>
                        <h6 className="mb-1">{record.patientName}</h6>
                        <p className="mb-1 text-muted-custom">{record.diagnosis}</p>
                        <small className="text-muted-custom">{formatDate(record.visitDate)} • {record.patientEmail}</small>
                      </div>
                    </div>
                  ))}
                  {!records.length ? <p className="text-muted-custom mb-0">No records have been added yet.</p> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function PatientDashboardPage() {
  const [email, setEmail] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const loadPatientData = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setError('Enter the patient email used for the appointment or history entry.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSearched(true);
      const [appointmentJson, recordJson] = await Promise.all([
        requestJson(`${API_BASE_URL}/appointments?email=${encodeURIComponent(email.trim().toLowerCase())}`),
        requestJson(`${API_BASE_URL}/medical-records?patientEmail=${encodeURIComponent(email.trim().toLowerCase())}`),
      ]);

      setAppointments(appointmentJson.data || []);
      setRecords(recordJson.data || []);
    } catch (requestError) {
      setError(requestError.message);
      setAppointments([]);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = useMemo(
    () => appointments.filter((appointment) => ['Pending', 'Confirmed'].includes(appointment.status)),
    [appointments]
  );

  return (
    <>
      <PageBanner title="Patient Dashboard" breadcrumbLabel="Patient Dashboard" />
      <section>
        <div className="container">
          <SectionTitle
            tag="Patient View"
            title="Your Appointments and Medical History"
            description="Look up the records associated with your email address to review visit notes, prescriptions, and follow-up instructions."
          />
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8">
              <div className="card-custom dashboard-panel p-4">
                <form className="row g-3 align-items-end" onSubmit={loadPatientData}>
                  <div className="col-md-9">
                    <label className="form-label-custom">Patient Email</label>
                    <input
                      type="email"
                      className="form-control form-control-custom"
                      placeholder="patient@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <button className="btn btn-primary-custom w-100" type="submit" disabled={loading}>
                      {loading ? 'Loading...' : 'Find Records'}
                    </button>
                  </div>
                </form>
                {error ? <div className="alert alert-danger mt-3 mb-0">{error}</div> : null}
              </div>
            </div>
          </div>

          {searched ? (
            <>
              <div className="row g-4 mb-4">
                <DashboardMetric label="Appointments" value={appointments.length} icon="fa-calendar-check" />
                <DashboardMetric label="Upcoming" value={upcomingAppointments.length} icon="fa-clock" tone="secondary" />
                <DashboardMetric label="History Entries" value={records.length} icon="fa-file-medical" tone="accent" />
                <DashboardMetric label="Doctor Visits" value={new Set(records.map((record) => record.doctor?._id)).size} icon="fa-user-doctor" tone="muted" />
              </div>

              <div className="row g-4">
                <div className="col-lg-6">
                  <div className="card-custom dashboard-panel p-4 h-100">
                    <div className="dashboard-panel-header">
                      <div>
                        <div className="dashboard-panel-eyebrow">Appointments</div>
                        <h4 className="mb-0">Upcoming and recent visits</h4>
                      </div>
                    </div>
                    <div className="dashboard-history-list mt-4">
                      {appointments.map((appointment) => (
                        <div className="dashboard-history-item" key={appointment._id}>
                          <div className="dashboard-history-icon">
                            <i className="fa-solid fa-calendar-check" />
                          </div>
                          <div>
                            <h6 className="mb-1">{appointment.doctor?.name || 'Assigned doctor unavailable'}</h6>
                            <p className="mb-1 text-muted-custom">{formatAppointmentSlot(appointment.appointmentDate, appointment.appointmentTime)}</p>
                            <small className="text-muted-custom">{appointment.status} • {appointment.department}</small>
                          </div>
                        </div>
                      ))}
                      {!appointments.length ? <p className="text-muted-custom mb-0">No appointments found for this email address.</p> : null}
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="card-custom dashboard-panel p-4 h-100">
                    <div className="dashboard-panel-header">
                      <div>
                        <div className="dashboard-panel-eyebrow">History</div>
                        <h4 className="mb-0">Medical records</h4>
                      </div>
                    </div>
                    <div className="dashboard-history-list mt-4">
                      {records.map((record) => (
                        <div className="dashboard-history-item" key={record._id}>
                          <div className="dashboard-history-icon">
                            <i className="fa-solid fa-notes-medical" />
                          </div>
                          <div>
                            <h6 className="mb-1">{record.diagnosis}</h6>
                            <p className="mb-1 text-muted-custom">{record.notes || record.prescription || 'No additional notes recorded.'}</p>
                            <small className="text-muted-custom">{record.doctor?.name || 'Doctor not available'} • {formatDate(record.visitDate)}</small>
                          </div>
                        </div>
                      ))}
                      {!records.length ? <p className="text-muted-custom mb-0">No medical records are linked to this email yet.</p> : null}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card-custom dashboard-panel p-4 text-center">
                  <i className="fa-solid fa-id-card-clip dashboard-empty-icon" />
                  <h4>Search your medical history</h4>
                  <p className="text-muted-custom mb-0">Enter the email address used for your appointment booking to load your dashboard.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}