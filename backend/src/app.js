require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const simulationRoutes = require('./routes/simulationRoutes');
const ctrl = require('./controllers/simulationController');

const path = require('path');
const fs = require('fs');

const app = express();

// ── Middleware ────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes('*') ||
      allowedOrigins.includes(origin) ||
      origin.endsWith('.onrender.com') ||
      origin.includes('localhost')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Frontend Static Asset Serving (for Fullstack Deployments) ──
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
const hasFrontendDist = fs.existsSync(frontendDistPath);

if (hasFrontendDist) {
  app.use(express.static(frontendDistPath));
}

// ── Root / Health Routes ──────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: "⚡ Banker's Algorithm & Deadlock Simulation API is online!",
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Root GET / handler (prevents 404 on deployment checks)
app.get('/', (req, res, next) => {
  if (hasFrontendDist) {
    const indexPath = path.join(frontendDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  return res.status(200).json({
    success: true,
    message: "⚡ Banker's Algorithm & Deadlock Simulation API is running!",
    status: 'healthy',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      scenarios: 'GET /api/scenarios',
      safetyCheck: 'POST /api/safety-check',
      simulations: 'GET /api/simulations',
    },
    timestamp: new Date().toISOString(),
    documentation: 'Use frontend web app or call /api endpoints directly.',
  });
});

// ── API Routes ────────────────────────────────────────────
// Scenarios list
app.get('/api/scenarios', ctrl.getScenarios);

// Stateless safety check
app.post('/api/safety-check', ctrl.statelessSafetyCheck);

// Simulation CRUD + algorithm endpoints
app.use('/api/simulations', simulationRoutes);

// ── SPA Fallback (Non-API routes serve index.html if frontend is built) ──
if (hasFrontendDist) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    const indexPath = path.join(frontendDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    next();
  });
}

// ── Error Handling ────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
