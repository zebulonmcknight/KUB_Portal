import cors from 'cors';
import express, { Application } from 'express';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'KUB Portal API'
  });
});

// Placeholder for router (you'll add this in Issue #2)
// app.use('/api', router);

export default app;