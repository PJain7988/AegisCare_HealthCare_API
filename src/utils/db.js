
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.resolve(__dirname, '../../', config.dataDir);

const usersPath = path.join(dir, 'users.json');
const recordsPath = path.join(dir, 'records.json');
const permissionsPath = path.join(dir, 'permissions.json');
const auditPath = path.join(dir, 'audit.log');

function ensureFiles() {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  for (const p of [usersPath, recordsPath, permissionsPath]) {
    if (!fs.existsSync(p)) fs.writeFileSync(p, '[]', 'utf8');
  }
  if (!fs.existsSync(auditPath)) fs.writeFileSync(auditPath, '', 'utf8');
}

ensureFiles();

export const db = {
  readUsers() {
    return JSON.parse(fs.readFileSync(usersPath, 'utf8'));
  },
  writeUsers(users) {
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  },
  readRecords() {
    return JSON.parse(fs.readFileSync(recordsPath, 'utf8'));
  },
  writeRecords(records) {
    fs.writeFileSync(recordsPath, JSON.stringify(records, null, 2));
  },
  readPermissions() {
    return JSON.parse(fs.readFileSync(permissionsPath, 'utf8'));
  },
  writePermissions(perms) {
    fs.writeFileSync(permissionsPath, JSON.stringify(perms, null, 2));
  },
  appendAudit(line) {
    fs.appendFileSync(auditPath, line + '\n', 'utf8');
  }
};
