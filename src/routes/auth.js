
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../utils/db.js';
import { issueToken } from '../middleware/auth.js';
import { verifyPassword } from '../security/crypto.js';
import { RolePermissions } from '../utils/permissions.js';
import { config } from '../config.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  if (!config.allowInsecureHttp && req.protocol !== 'https') {
    return res.status(400).json({ error: 'HTTPS required in production' });
  }
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  const users = db.readUsers();
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const permissions = RolePermissions[user.role] || [];
  const payload = {
    sub: user.id,
    role: user.role,
    permissions
  };
  const token = issueToken(payload, config.jwtExpiresIn);

  req.audit('auth.login', { user_id: user.id, role: user.role });

  return res.json({ access_token: token, expires_in: config.jwtExpiresIn });
});

// Emergency escalation: Only Doctors may escalate to temporary higher scope (e.g., add manage_users? Typically not. Here we add an emergency flag and all permissions)
router.post('/escalate', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ error: 'Invalid Authorization header' });
  const { reason } = req.body || {};
  if (!reason) return res.status(400).json({ error: 'reason is required' });

  try {
    const jwt = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));
    if (jwt.role !== 'Doctor') {
      return res.status(403).json({ error: 'Only Doctors can request emergency escalation' });
    }
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // For simplicity, issue a short-lived token (15 min) with an emergency flag added.
  const users = db.readUsers();
  const orig = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));
  const user = users.find(u => u.id === orig.sub);
  if (!user) return res.status(401).json({ error: 'Unknown user' });

  const elevatedPayload = {
    sub: user.id,
    role: user.role,
    permissions: Array.from(new Set([...(orig.permissions || []), 'emergency_access'])),
    emergency: true
  };

  const elevatedToken = issueToken(elevatedPayload, 900); // 15 minutes
  req.audit('auth.escalate', { user_id: user.id, reason });

  return res.json({ access_token: elevatedToken, expires_in: 900 });
});

router.post('/register', async (req, res) => {
  if (!config.allowInsecureHttp && req.protocol !== 'https') {
    return res.status(400).json({ error: 'HTTPS required in production' });
  }
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  const users = db.readUsers();
  if (users.some(u => u.username === username)) {
    return res.status(409).json({ error: 'username already exists' });
  }

  const { hashPassword } = await import('../security/crypto.js');
  const password_hash = await hashPassword(password);
  
  // Create as Patient by default
  const user = {
    id: `patient-${Date.now()}`,
    username,
    role: 'Patient',
    password_hash
  };

  users.push(user);
  db.writeUsers(users);

  // Auto-login after registration
  const permissions = RolePermissions[user.role] || [];
  const payload = {
    sub: user.id,
    role: user.role,
    permissions
  };
  const token = issueToken(payload, config.jwtExpiresIn);

  req.audit('auth.register', { user_id: user.id, username });

  return res.status(201).json({ access_token: token, expires_in: config.jwtExpiresIn });
});

export default router;
