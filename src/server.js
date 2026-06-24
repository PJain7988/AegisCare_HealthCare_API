
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import { config } from './config.js';
import { auditMiddleware } from './middleware/audit.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import recordRoutes from './routes/records.js';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(morgan('tiny'));
app.use(auditMiddleware);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the AegisCare Medical Systems API' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', system: 'AegisCare Medical Systems API', timestamp: new Date().toISOString() });
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/records', recordRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
