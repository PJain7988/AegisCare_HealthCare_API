
import { db } from './utils/db.js';
import { hashPassword } from './security/crypto.js';
import { Role, RolePermissions } from './utils/permissions.js';

async function run() {
  const users = [
    { username: 'alice_patient', role: Role.Patient, password: 'Patient@123', id: 'patient-1' },
    { username: 'nina_nurse', role: Role.Nurse, password: 'Nurse@123', id: 'nurse-1' },
    { username: 'dr_doe', role: Role.Doctor, password: 'Doctor@123', id: 'doctor-1' },
    { username: 'adam_admin', role: Role.Administrator, password: 'Admin@123', id: 'admin-1' }
  ];

  const withHashes = [];
  for (const u of users) {
    const password_hash = await hashPassword(u.password);
    withHashes.push({ id: u.id, username: u.username, role: u.role, password_hash });
  }
  db.writeUsers(withHashes);

  const records = [
    {
      id: 'rec-1',
      patient_id: 'patient-1',
      status: 'stable',
      data: [{ type: 'note', text: 'Annual check-up normal.' }],
      prescriptions: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  db.writeRecords(records);

  const perms = Object.entries(RolePermissions).map(([role, perms]) => ({
    role, permissions: perms
  }));
  db.writePermissions(perms);

  console.log('Seed complete.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
