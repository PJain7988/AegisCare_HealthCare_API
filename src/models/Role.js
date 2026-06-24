import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., 'patient.read'
  description: { type: String }
});

export const Permission = mongoose.model('Permission', permissionSchema);

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., 'Doctor'
  permissions: [{ type: String }] // Store permission names as strings
});

export const Role = mongoose.model('Role', roleSchema);
