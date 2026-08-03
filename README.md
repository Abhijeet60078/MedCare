# 🏥 MedCare – Hospital Management System

## Overview

MedCare is a full-stack Hospital Management System built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. It streamlines hospital operations by providing separate portals for administrators, doctors, and patients, ensuring secure, role-based access to the system while maintaining patients' medical records digitally.

## Key Features

### 🔐 Role-Based Authentication

* Separate **Login** and **Signup** pages for:

  * Admin
  * Doctor
  * Patient
* Secure JWT-based authentication.
* Users can access only the features permitted for their role.

### 👨‍💼 Admin Dashboard

The Admin has complete control over the hospital management system and can:

* Manage doctors (Add, Update, Delete)
* Manage departments
* View and manage all patients
* View and manage all appointments
* Monitor hospital statistics through the dashboard

### 👨‍⚕️ Doctor Dashboard

Doctors have access only to doctor-related features:

* View their assigned appointments
* Access patient details for scheduled appointments
* Record patient diagnoses and treatment notes
* Update appointment status
* Manage their own profile

Doctors **cannot** access administrative functions such as managing departments or other doctors.

### 👤 Patient Dashboard

Patients have a dedicated dashboard where they can:

* Register and log in securely
* Book appointments with doctors
* View their appointment history
* Access their diagnosis history and treatment records
* Update their personal profile

Patients **cannot** access the Admin Dashboard or Doctor Dashboard and **cannot modify doctor records, department information, or other patients' data**.

### 🩺 Diagnosis & Medical Records

* Doctors can add a diagnosis and treatment notes after every consultation.
* The system securely stores each diagnosis as part of the patient's medical history.
* Patients can view their previous diagnoses, treatments, and doctor recommendations anytime from their dashboard.
* Doctors can review a patient's previous medical history during future visits, helping provide better continuity of care.
* Eliminates the need for patients to remember or carry paper records manually.

### 📅 Appointment Management

* Book appointments with available doctors.
* View appointment details.
* Manage appointment records using role-based permissions.

### 👨‍⚕️ Doctor Management

* Add, update, delete, and search doctors.
* Organize doctors by department and specialization.

### 🏥 Department Management

* Create and manage hospital departments.
* Assign doctors to departments.

### 👤 Patient Management

* Maintain patient records securely.
* Patients can access only their own information.

### 🌐 REST APIs

* Secure RESTful APIs built with Node.js and Express.js.
* CRUD operations for doctors, patients, departments, appointments, and medical records.
* Protected routes with role-based authorization.

## Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication:** JWT
* **API:** RESTful APIs

## Security

* JWT-based authentication
* Role-based authorization (Admin, Doctor, Patient)
* Protected routes
* Input validation and error handling

## Future Enhancements

* Email notifications for appointments
* Online payment integration
* Dashboard analytics
* Prescription PDF generation
* Cloud deployment (Render/Vercel)
