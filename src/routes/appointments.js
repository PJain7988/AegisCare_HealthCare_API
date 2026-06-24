import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../utils/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all appointments (Admin/Doctor see all, Patient sees own)
router.get('/', requireAuth, (req, res) => {
  const allAppointments = db.readAppointments();
  
  if (req.user.role === 'Patient') {
    const patientApts = allAppointments.filter(a => a.patient_id === req.user.sub);
    req.audit('appointments.view_own', { user_id: req.user.sub });
    return res.json(patientApts);
  } else {
    req.audit('appointments.view_all', { user_id: req.user.sub });
    return res.json(allAppointments);
  }
});

// Book a new appointment
router.post('/', requireAuth, (req, res) => {
  if (req.user.role !== 'Patient') {
    return res.status(403).json({ error: 'Only patients can book appointments' });
  }

  const { doctor_name, department, date_time } = req.body || {};
  if (!doctor_name || !department || !date_time) {
    return res.status(400).json({ error: 'doctor_name, department, and date_time required' });
  }

  const appointments = db.readAppointments();
  
  const newAppointment = {
    id: uuidv4(),
    patient_id: req.user.sub,
    doctor_name,
    department,
    date_time,
    status: 'Scheduled',
    created_at: new Date().toISOString()
  };

  appointments.push(newAppointment);
  db.writeAppointments(appointments);

  req.audit('appointments.book', { user_id: req.user.sub, appointment_id: newAppointment.id });
  
  return res.status(201).json(newAppointment);
});

export default router;
