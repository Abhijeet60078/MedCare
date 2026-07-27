require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Route imports
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// ------- Middleware -------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Serve the frontend statically (so you can run everything from one server)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ------- API Routes (MVC: routes -> controllers -> models) -------
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/testimonials', testimonialRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'MedCare API is running 🏥' });
});

// Fallback: serve index.html for any non-API route (basic SPA-style support)
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ------- Error Handling (must be last) -------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 MedCare server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
