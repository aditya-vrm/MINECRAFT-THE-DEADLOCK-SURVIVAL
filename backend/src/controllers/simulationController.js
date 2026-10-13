/**
 * Simulation Controller — handles HTTP request/response.
 * Delegates all business logic to simulationService.
 */

const simulationService = require('../services/simulationService');
const { validateSimulationSetup, validateResourceRequest, validateStatelessCheck } = require('../validators/simulationValidator');

// POST /api/simulations
async function createSimulation(req, res) {
  const { valid, errors } = validateSimulationSetup(req.body);
  if (!valid) {
    return res.status(400).json({ success: false, errors });
  }

  try {
    const { resources, processes, name } = req.body;
    const simulation = simulationService.createSimulation(resources, processes, name);
    return res.status(201).json({ success: true, simulation });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

// GET /api/simulations/:id
async function getSimulation(req, res) {
  try {
    const simulation = simulationService.getSimulation(req.params.id);
    return res.json({ success: true, simulation });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
}

// PUT /api/simulations/:id
async function updateSimulation(req, res) {
  const { valid, errors } = validateSimulationSetup(req.body);
  if (!valid) {
    return res.status(400).json({ success: false, errors });
  }

  try {
    const { resources, processes, name } = req.body;
    const simulation = simulationService.updateSimulation(req.params.id, resources, processes, name);
    return res.json({ success: true, simulation });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

// POST /api/simulations/:id/safety-check
async function runSafetyCheck(req, res) {
  try {
    const result = simulationService.runSafetyCheck(req.params.id);
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

// POST /api/simulations/:id/requests
async function processRequest(req, res) {
  try {
    const sim = simulationService.getSimulation(req.params.id);
    const numResources = sim.currentState.available.length;
    const { valid, errors } = validateResourceRequest(req.body, numResources);

    if (!valid) {
      return res.status(400).json({ success: false, errors });
    }

    const { processIndex, request } = req.body;
    const result = simulationService.processRequest(req.params.id, processIndex, request);
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

// POST /api/simulations/:id/reset
async function resetSimulation(req, res) {
  try {
    const simulation = simulationService.resetSimulation(req.params.id);
    return res.json({ success: true, simulation });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
}

// POST /api/simulations/:id/detect-deadlock
async function detectDeadlock(req, res) {
  try {
    const result = simulationService.detectDeadlock(req.params.id);
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

// POST /api/safety-check (stateless)
async function statelessSafetyCheck(req, res) {
  const { valid, errors } = validateStatelessCheck(req.body);
  if (!valid) {
    return res.status(400).json({ success: false, errors });
  }

  try {
    const { available, allocation, max } = req.body;
    const result = simulationService.statelessSafetyCheck(available, allocation, max);
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

// GET /api/scenarios
async function getScenarios(req, res) {
  const scenarios = require('../services/scenarios');
  return res.json({ success: true, scenarios });
}

module.exports = {
  createSimulation,
  getSimulation,
  updateSimulation,
  runSafetyCheck,
  processRequest,
  resetSimulation,
  detectDeadlock,
  statelessSafetyCheck,
  getScenarios,
};
