
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
  jwtSecret: process.env.JWT_SECRET || 'super-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN, 10) : 3600,
  auditLogPath: process.env.AUDIT_LOG_PATH || './data/audit.log',
  dataDir: process.env.DATA_DIR || './data',
  allowInsecureHttp: (process.env.ALLOW_INSECURE_HTTP || 'false').toLowerCase() === 'true'
};
