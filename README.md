# 🏥 MedCare Hospital Management System

A full-stack hospital management web app: responsive frontend (HTML5, CSS3, Bootstrap 5, JavaScript) + REST API backend (Node.js, Express.js, MongoDB, Mongoose) built with the MVC pattern.

## ✨ Features

**Frontend**
- Responsive Home, About, Doctors, Departments, Appointment, Emergency, Contact pages
- Doctor search & department filter
- Dark / Light mode (persisted via localStorage)
- Animated counters, scroll-reveal animations
- Sticky navbar, back-to-top button, loading spinner
- Newsletter signup, FAQ accordion, testimonials, responsive footer

**Backend**
- REST APIs for Doctors, Appointments, Contacts, Departments, Testimonials
- MVC architecture (routes → controllers → models)
- Mongoose schemas with validation
- Centralized error handling & 404 middleware
- Appointment double-booking prevention
- Search & filter query support

## 🗂 Project Structure

```
medcare-hospital/
├── frontend/
│   ├── index.html, about.html, doctors.html, departments.html,
│   │   appointment.html, emergency.html, contact.html
│   ├── css/ (style.css, responsive.css, animations.css)
│   ├── js/  (app.js, darkmode.js, search.js, appointment.js, counter.js, validation.js)
│   └── images/
│
├── backend/
│   ├── server.js
│   ├── seed.js               # populates sample data
│   ├── config/db.js
│   ├── models/                Doctor, Appointment, Contact, Department, Testimonial, User
│   ├── controllers/           doctorController, appointmentController, contactController,
│   │                          departmentController, testimonialController
│   ├── routes/                doctorRoutes, appointmentRoutes, contactRoutes,
│   │                          departmentRoutes, testimonialRoutes
│   ├── middleware/errorHandler.js
│   └── .env
│
└── README.md
```

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally, or a MongoDB Atlas connection string

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Configure environment
Edit `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/medcare
NODE_ENV=development
CLIENT_URL=http://localhost:5500
```

### 4. Seed sample data (doctors, departments, testimonials)
```bash
npm run seed
```

### 5. Start the server
```bash
npm run dev      # with nodemon (auto-restart)
# or
npm start
```

The backend also serves the frontend statically, so once running you can open:
```
http://localhost:5000
```

Alternatively, open `frontend/index.html` directly (e.g. via VS Code "Live Server" on port 5500) —
`js/app.js` auto-detects and points API calls to `http://localhost:5000/api`.

## 🔌 API Endpoints

| Method | Endpoint                  | Description                  |
|--------|----------------------------|-------------------------------|
| GET    | /api/doctors               | List doctors (supports `?search=`, `?department=`) |
| GET    | /api/doctors/:id           | Get single doctor             |
| POST   | /api/doctors                | Create doctor                 |
| PUT    | /api/doctors/:id           | Update doctor                 |
| DELETE | /api/doctors/:id           | Delete doctor                 |
| GET    | /api/appointments          | List appointments (`?status=`, `?email=`) |
| POST   | /api/appointments           | Book an appointment           |
| GET    | /api/appointments/:id      | Get single appointment        |
| PUT    | /api/appointments/:id      | Update appointment status     |
| DELETE | /api/appointments/:id      | Cancel appointment            |
| GET    | /api/contacts               | List contact messages         |
| POST   | /api/contacts                | Submit contact message        |
| GET    | /api/departments            | List departments              |
| POST   | /api/departments             | Create department             |
| GET    | /api/testimonials           | List testimonials             |
| POST   | /api/testimonials            | Create testimonial            |
| GET    | /api/health                  | API health check              |

## 🛠 Tech Stack
- **Frontend:** HTML5, CSS3, Bootstrap 5, Vanilla JavaScript (Fetch API)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Architecture:** MVC (Model–View–Controller)

## 📌 Notes
- All write endpoints (`POST`/`PUT`/`DELETE` on doctors, appointments, etc.) are open in this starter — add authentication/authorization middleware before deploying to production.
- Images currently use Unsplash/placehold.co URLs so the app works without any local assets; drop your own images into `frontend/images/` and update paths as needed.

## 📄 License
MIT — free to use and modify for learning or production projects.
