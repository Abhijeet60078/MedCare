# 🏥 MedCare - Hospital Management System

A modern, responsive **Full Stack Hospital Management System** built using **HTML, CSS, Bootstrap, JavaScript, Node.js, Express.js, and MongoDB**. The application enables users to explore hospital services, search doctors, book appointments, and contact the hospital through an intuitive interface.

---

## 📸 Project Preview

> Add screenshots of your project here.

| Home Page | Doctors Page |
|-----------|--------------|
| ![Home](frontend/images/home.png) | ![Doctors](frontend/images/doctors.png) |

---

# 🚀 Features

### 👨‍⚕️ Patient Features
- View hospital information
- Browse doctors
- Search doctors by name
- Filter doctors by department
- Book appointments
- Contact hospital
- Emergency information
- Responsive design
- Dark/Light mode
- Animated counters
- Smooth scrolling

### 🏥 Hospital Features
- Manage doctors
- Manage departments
- Store appointments
- Store contact messages
- Display testimonials
- REST API architecture
- MVC project structure
- MongoDB integration

---

# 🛠 Tech Stack

## Frontend
- HTML5
- CSS3
- Bootstrap 5
- JavaScript (ES6)

## Backend
- Node.js
- Express.js

## Database
- MongoDB
- Mongoose

## Tools
- Git
- GitHub
- VS Code
- Postman

---

# 📂 Project Structure

```
medcare-hospital/
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── images/
│   ├── index.html
│   ├── doctors.html
│   ├── departments.html
│   ├── appointment.html
│   ├── emergency.html
│   ├── contact.html
│   └── about.html
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── seed.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/Abhijeet60078/MedCare.git
```

```bash
cd MedCare
```

---

## Install Dependencies

```bash
cd backend
npm install
```

---

## Configure Environment

Create a `.env` file inside the `backend` folder.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/medcare
NODE_ENV=development
CLIENT_URL=http://localhost:5000
```

---

## Seed Database

```bash
npm run seed
```

---

## Start Server

```bash
npm run dev
```

or

```bash
npm start
```

---

# 🌐 Application URL

Frontend

```
http://localhost:5000
```

API Health

```
http://localhost:5000/api/health
```

---

# 📡 API Endpoints

## Doctors

| Method | Endpoint |
|---------|----------|
| GET | /api/doctors |
| GET | /api/doctors/:id |
| POST | /api/doctors |
| PUT | /api/doctors/:id |
| DELETE | /api/doctors/:id |

---

## Appointments

| Method | Endpoint |
|---------|----------|
| GET | /api/appointments |
| POST | /api/appointments |
| PUT | /api/appointments/:id |
| DELETE | /api/appointments/:id |

---

## Departments

| Method | Endpoint |
|---------|----------|
| GET | /api/departments |
| POST | /api/departments |

---

## Contacts

| Method | Endpoint |
|---------|----------|
| GET | /api/contacts |
| POST | /api/contacts |

---

## Testimonials

| Method | Endpoint |
|---------|----------|
| GET | /api/testimonials |
| POST | /api/testimonials |

---

# ✨ Future Enhancements

- User Authentication (JWT)
- Admin Dashboard
- Doctor Login
- Patient Login
- Online Payment Integration
- Email Notifications
- Video Consultation
- Medical Report Upload
- Prescription Management

---

# 📷 Screenshots

Add screenshots here after deployment.

- Home Page
- Doctors
- Appointment
- Contact
- Dashboard

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added new feature"
```

4. Push changes

```bash
git push origin feature-name
```

5. Create a Pull Request

---

# 👨‍💻 Author

**Abhijeet Mishra**

- GitHub: https://github.com/Abhijeet60078
- LinkedIn: *(Add your LinkedIn profile here)*

---

# ⭐ Show Your Support

If you found this project helpful, please give it a ⭐ on GitHub.

---

## 📄 License

This project is licensed under the MIT License.