
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import { config } from './config.js';
import { auditMiddleware } from './middleware/audit.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import recordRoutes from './routes/records.js';
import appointmentRoutes from './routes/appointments.js';
import { connectDB } from './utils/db.js';

import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const app = express();

connectDB();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'AegisCare Enterprise HMS API',
      version: '1.0.0',
      description: 'Enterprise Hospital Management System API'
    },
    servers: [{ url: '/api' }]
  },
  apis: ['./src/routes/*.js']
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use(helmet());
app.use(express.json());
app.use(morgan('tiny'));
app.use(auditMiddleware);
app.use(limiter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the AegisCare Medical Systems API' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', system: 'AegisCare Medical Systems API', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/appointments', appointmentRoutes);

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
