// Run with: node seed.js
// Populates the database with sample doctors, departments, testimonials.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const Doctor = require('./models/Doctor');
const Department = require('./models/Department');
const Testimonial = require('./models/Testimonial');

const departments = [
  { name: 'Cardiology', icon: 'fa-heart-pulse', description: 'Heart & cardiovascular care' },
  { name: 'Neurology', icon: 'fa-brain', description: 'Brain & nervous system care' },
  { name: 'Orthopedics', icon: 'fa-bone', description: 'Bones, joints & muscles' },
  { name: 'Pediatrics', icon: 'fa-baby', description: 'Child healthcare' },
  { name: 'Dermatology', icon: 'fa-hand-dots', description: 'Skin care & treatment' },
  { name: 'ENT', icon: 'fa-ear-listen', description: 'Ear, nose & throat' },
];

const doctors = [
  {
    name: 'Dr. Ananya Sharma',
    specialization: 'Cardiologist',
    department: 'Cardiology',
    qualification: 'MBBS, MD (Cardiology)',
    experience: 12,
    email: 'ananya.sharma@medcare.com',
    phone: '+91 98765 43210',
    availableTime: '09:00 AM - 03:00 PM',
    rating: 4.8,
    fees: 800,
    about: 'Specialist in interventional cardiology with over a decade of experience.',
  },
  {
    name: 'Dr. Rohit Verma',
    specialization: 'Neurologist',
    department: 'Neurology',
    qualification: 'MBBS, DM (Neurology)',
    experience: 15,
    email: 'rohit.verma@medcare.com',
    phone: '+91 98765 43211',
    availableTime: '10:00 AM - 04:00 PM',
    rating: 4.9,
    fees: 900,
    about: 'Expert in treating stroke, epilepsy, and movement disorders.',
  },
  {
    name: 'Dr. Priya Nair',
    specialization: 'Orthopedic Surgeon',
    department: 'Orthopedics',
    qualification: 'MBBS, MS (Ortho)',
    experience: 10,
    email: 'priya.nair@medcare.com',
    phone: '+91 98765 43212',
    availableTime: '11:00 AM - 05:00 PM',
    rating: 4.7,
    fees: 700,
    about: 'Focused on joint replacement and sports injury treatment.',
  },
  {
    name: 'Dr. Arjun Mehta',
    specialization: 'Pediatrician',
    department: 'Pediatrics',
    qualification: 'MBBS, MD (Pediatrics)',
    experience: 8,
    email: 'arjun.mehta@medcare.com',
    phone: '+91 98765 43213',
    availableTime: '09:00 AM - 01:00 PM',
    rating: 4.6,
    fees: 500,
    about: 'Caring for infants, children, and adolescents.',
  },
  {
    name: 'Dr. Kavita Iyer',
    specialization: 'Dermatologist',
    department: 'Dermatology',
    qualification: 'MBBS, MD (Dermatology)',
    experience: 9,
    email: 'kavita.iyer@medcare.com',
    phone: '+91 98765 43214',
    availableTime: '12:00 PM - 06:00 PM',
    rating: 4.5,
    fees: 600,
    about: 'Specializes in skin, hair, and cosmetic dermatology.',
  },
  {
    name: 'Dr. Sanjay Kapoor',
    specialization: 'ENT Specialist',
    department: 'ENT',
    qualification: 'MBBS, MS (ENT)',
    experience: 11,
    email: 'sanjay.kapoor@medcare.com',
    phone: '+91 98765 43215',
    availableTime: '10:00 AM - 04:00 PM',
    rating: 4.7,
    fees: 650,
    about: 'Experienced in treating ear, nose, and throat disorders.',
  },
];

const testimonials = [
  {
    name: 'Meera Joshi',
    role: 'Patient',
    message: 'The doctors and staff at MedCare were incredibly caring and professional throughout my treatment.',
    rating: 5,
  },
  {
    name: 'Vikram Singh',
    role: 'Patient',
    message: 'Booking an appointment online was quick and easy. Highly recommend MedCare Hospital.',
    rating: 5,
  },
  {
    name: 'Ritu Desai',
    role: 'Patient',
    message: 'Excellent facilities and a very supportive medical team. My family trusts MedCare completely.',
    rating: 4,
  },
];

const seedData = async () => {
  try {
    await connectDB();

    await Promise.all([
      Doctor.deleteMany(),
      Department.deleteMany(),
      Testimonial.deleteMany(),
    ]);

    await Department.insertMany(departments);
    await Doctor.insertMany(doctors);
    await Testimonial.insertMany(testimonials);

    console.log('✅ Sample data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
