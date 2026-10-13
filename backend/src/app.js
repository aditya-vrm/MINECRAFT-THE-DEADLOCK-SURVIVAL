require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const simulationRoutes = require('./routes/simulationRoutes');
const ctrl = require('./controllers/simulationController');

const app = express();

// ── Middleware ────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '⛏️ MINECRAFT: THE DEADLOCK SURVIVAL - Backend is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Scenarios list
app.get('/api/scenarios', ctrl.getScenarios);

// Stateless safety check
app.post('/api/safety-check', ctrl.statelessSafetyCheck);

// Simulation CRUD + algorithm endpoints
app.use('/api/simulations', simulationRoutes);

// ── Error Handling ────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
