require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Route imports
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');

// Connect to MongoDB
connectDB();

const app = express();
const frontendRoot = path.join(__dirname, '..', 'frontend');
const frontendDist = path.join(frontendRoot, 'dist');
const frontendServePath = fs.existsSync(frontendDist) ? frontendDist : frontendRoot;
const frontendIndexPath = fs.existsSync(path.join(frontendDist, 'index.html'))
  ? path.join(frontendDist, 'index.html')
  : path.join(frontendRoot, 'index.html');

// ------- Middleware -------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Serve the frontend statically (so you can run everything from one server)
app.use(express.static(frontendServePath));

// ------- API Routes (MVC: routes -> controllers -> models) -------
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/medical-records', medicalRecordRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'MedCare API is running 🏥' });
});

// Fallback: serve index.html for any non-API route (basic SPA-style support)
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) return next();
  res.sendFile(frontendIndexPath);
});

// ------- Error Handling (must be last) -------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 MedCare server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
