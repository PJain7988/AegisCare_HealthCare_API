import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Links to User.username or email
  fullName: String,
  phone: String,
  bloodGroup: String,
  allergies: [String],
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  insuranceDetails: {
    provider: String,
    policyNumber: String
  }
});

export const Patient = mongoose.model('Patient', patientSchema);

const appointmentSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  doctorName: { type: String, required: true },
  department: String,
  dateTime: { type: Date, required: true },
  status: { type: String, enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled'], default: 'Scheduled' },
  createdAt: { type: Date, default: Date.now }
});

export const Appointment = mongoose.model('Appointment', appointmentSchema);

const medicalRecordSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  diagnosis: String,
  treatment: String,
  notes: [String],
  documents: [String],
  updatedAt: { type: Date, default: Date.now }
});

export const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

const prescriptionSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  doctorId: { type: String, required: true },
  medicines: [{
    name: String,
    dosage: String
  }],
  prescribedAt: { type: Date, default: Date.now }
});

export const Prescription = mongoose.model('Prescription', prescriptionSchema);

const auditLogSchema = new mongoose.Schema({
  user: String,
  action: String,
  details: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now }
});

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
