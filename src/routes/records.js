
import express from 'express';
import { db } from '../utils/db.js';
import { requireAuth } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { Permission } from '../utils/permissions.js';

const router = express.Router();

router.get('/:patient_id', requireAuth, requirePermission(Permission.ViewRecords), (req, res) => {
  const { patient_id } = req.params;
  const records = db.readRecords().filter(r => r.patient_id === patient_id);
  if (req.user.role === 'Patient' && req.user.sub !== patient_id) {
    return res.status(403).json({ error: 'Patients may only view their own records' });
  }
  req.audit('records.view', { actor_id: req.user.sub, patient_id });
  return res.json({ patient_id, records });
});

router.patch('/:patient_id/status', requireAuth, requirePermission(Permission.UpdateStatus), (req, res) => {
  const { patient_id } = req.params;
  const { status } = req.body || {};
  if (typeof status !== 'string' || !status.trim()) {
    return res.status(400).json({ error: 'status must be a non-empty string' });
  }
  const records = db.readRecords();
  const idx = records.findIndex(r => r.patient_id === patient_id);
  if (idx === -1) return res.status(404).json({ error: 'Patient record not found' });
  records[idx].status = status;
  records[idx].updated_at = new Date().toISOString();
  db.writeRecords(records);
  req.audit('records.update_status', { actor_id: req.user.sub, patient_id, status });
  return res.status(204).end();
});

router.post('/:patient_id/prescriptions', requireAuth, requirePermission(Permission.PrescribeMedication), (req, res) => {
  const { patient_id } = req.params;
  const { medication, dosage } = req.body || {};
  if (!medication || !dosage) return res.status(400).json({ error: 'medication and dosage required' });

  const records = db.readRecords();
  const rec = records.find(r => r.patient_id === patient_id);
  if (!rec) return res.status(404).json({ error: 'Patient record not found' });

  const newRx = {
    id: String(Date.now()),
    medication,
    dosage,
    prescribed_by: req.user.sub,
    prescribed_at: new Date().toISOString()
  };

  rec.prescriptions = rec.prescriptions || [];
  rec.prescriptions.push(newRx);
  db.writeRecords(records);

  req.audit('records.prescribe', { actor_id: req.user.sub, patient_id, medication });
  return res.status(201).json(newRx);
});

export default router;
