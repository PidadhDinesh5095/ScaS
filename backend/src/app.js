// src/app.js
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import soilRoutes from './routes/soil.routes.js';
import diseaseRoutes from './routes/disease.routes.js';
import weatherRoutes from './routes/weather.routes.js';
import marketRoutes from './routes/market.routes.js';
import project from './models/project.js';
import projectRoutes from './routes/project.routes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/auth', authRoutes);
app.use('/soil', soilRoutes);
app.use('/disease', diseaseRoutes);
app.use('/weather', weatherRoutes);
app.use('/market', marketRoutes);
app.use('/project',projectRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const code = err.status || 500;
  res.status(code).json({ error: err.message || 'Internal Server Error' });
});

export default app;
