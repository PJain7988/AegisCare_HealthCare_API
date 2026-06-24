
import { db } from '../utils/db.js';
import { config } from '../config.js';

export function audit(action, details) {
  const entry = {
    timestamp: new Date().toISOString(),
    action,
    ...details
  };
  // Avoid logging sensitive content (like passwords, full tokens)
  if (entry.token) delete entry.token;
  const line = JSON.stringify(entry);
  db.appendAudit(line);
}

export function auditMiddleware(req, res, next) {
  // Attach a helper so routes can log easily
  req.audit = (action, details = {}) => audit(action, details);
  next();
}
