
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../utils/db.js';
import { requireAuth } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { Permission, Role, RolePermissions } from '../utils/permissions.js';
import { hashPassword } from '../security/crypto.js';

const router = express.Router();

router.post('/', requireAuth, requirePermission(Permission.ManageUsers), async (req, res) => {
  const { username, role, password } = req.body || {};
  if (!username || !role) return res.status(400).json({ error: 'username and role required' });
  if (!(role in RolePermissions)) return res.status(400).json({ error: 'invalid role' });
  const users = db.readUsers();
  if (users.some(u => u.username === username)) {
    return res.status(409).json({ error: 'username already exists' });
  }
  const id = uuidv4();
  const password_hash = await hashPassword(password || 'ChangeMe123!');
  const user = { id, username, role, password_hash };
  users.push(user);
  db.writeUsers(users);
  req.audit('users.create', { actor_id: req.user.sub, new_user_id: id, role });
  res.status(201).json({ id, username, role });
});

export default router;
