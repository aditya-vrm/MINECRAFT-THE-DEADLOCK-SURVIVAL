/**
 * Simulation Service — orchestrates algorithm calls and state management.
 * In-memory store for the demo (no MongoDB needed for academic version).
 */

const { v4: uuidv4 } = require('uuid');
const {
  calculateNeed,
  safetyAlgorithm,
  resourceRequestAlgorithm,
  deadlockDetectionAlgorithm,
} = require('../algorithms/bankersAlgorithm');

// In-memory simulation store
const simulations = new Map();

/**
 * Build a simulation state from processes and resources.
 */
function buildState(resources, processes) {
  const available = resources.map((r) => r.total);
  const allocation = processes.map((p) => p.allocation);
  const maxMatrix = processes.map((p) => p.max);

  // Subtract all allocations from total to get available
  const totalAllocated = resources.map((_, j) =>
    processes.reduce((sum, p) => sum + p.allocation[j], 0)
  );

  const computedAvailable = resources.map((r, j) => r.total - totalAllocated[j]);

  for (let j = 0; j < computedAvailable.length; j++) {
    if (computedAvailable[j] < 0) {
      throw new Error(
        `Resource ${resources[j].name}: total allocations (${totalAllocated[j]}) exceed total (${resources[j].total}).`
      );
    }
  }

  const { need, error } = calculateNeed(maxMatrix, allocation);
  if (error) throw new Error(error);

  return {
    available: computedAvailable,
    allocation,
    max: maxMatrix,
    need,
    resources,
    processes,
  };
}

/**
 * Create a new simulation.
 */
function createSimulation(resources, processes, name = 'My Simulation') {
  const state = buildState(resources, processes);
  const id = uuidv4();

  const simulation = {
    id,
    name,
    resources,
    processes,
    currentState: state,
    initialState: JSON.parse(JSON.stringify(state)), // Deep copy for reset
    history: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  simulations.set(id, simulation);
  return simulation;
}

/**
 * Get a simulation by ID.
 */
function getSimulation(id) {
  const sim = simulations.get(id);
  if (!sim) throw new Error(`Simulation '${id}' not found.`);
  return sim;
}

/**
 * Update simulation configuration.
 */
function updateSimulation(id, resources, processes, name) {
  const sim = getSimulation(id);
  const state = buildState(resources, processes);

  sim.resources = resources;
  sim.processes = processes;
  sim.name = name || sim.name;
  sim.currentState = state;
  sim.initialState = JSON.parse(JSON.stringify(state));
  sim.history = [];
  sim.updatedAt = new Date().toISOString();

  return sim;
}

/**
 * Run safety algorithm on a simulation.
 */
function runSafetyCheck(id) {
  const sim = getSimulation(id);
  const { available, allocation, need } = sim.currentState;

  const result = safetyAlgorithm(available, allocation, need);

  sim.history.push({
    action: 'safety-check',
    timestamp: new Date().toISOString(),
    result,
  });

  return {
    status: result.safe ? 'SAFE' : 'UNSAFE',
    safeSequence: result.safeSequence,
    steps: result.steps,
    unfinishedProcesses: result.unfinishedProcesses,
  };
}

/**
 * Process a resource request.
 */
function processRequest(id, processIndex, request) {
  const sim = getSimulation(id);

  if (processIndex >= sim.processes.length) {
    throw new Error(`Process index ${processIndex} out of range.`);
  }

  const result = resourceRequestAlgorithm(sim.currentState, processIndex, request);

  if (result.granted && result.newState) {
    sim.currentState = {
      ...sim.currentState,
      ...result.newState,
    };
    sim.updatedAt = new Date().toISOString();
  }

  sim.history.push({
    action: 'resource-request',
    process: `P${processIndex}`,
    request,
    timestamp: new Date().toISOString(),
    result: { granted: result.granted, reason: result.reason },
  });

  return result;
}

/**
 * Reset simulation to initial state.
 */
function resetSimulation(id) {
  const sim = getSimulation(id);
  sim.currentState = JSON.parse(JSON.stringify(sim.initialState));
  sim.history.push({
    action: 'reset',
    timestamp: new Date().toISOString(),
  });
  sim.updatedAt = new Date().toISOString();
  return sim;
}

/**
 * Run deadlock detection on current state.
 */
function detectDeadlock(id) {
  const sim = getSimulation(id);
  const { available, allocation } = sim.currentState;

  // For detection, use allocation as outstanding requests (simplified model)
  // In a real OS, this would be the actual waiting requests
  const outstandingRequests = sim.currentState.need.map((row) => row.map((v) => Math.min(v, 1)));

  const result = deadlockDetectionAlgorithm(available, allocation, outstandingRequests);

  return result;
}

/**
 * Stateless safety check (no simulation created).
 */
function statelessSafetyCheck(available, allocation, max) {
  const { need, error } = calculateNeed(max, allocation);
  if (error) throw new Error(error);

  const result = safetyAlgorithm(available, allocation, need);

  return {
    status: result.safe ? 'SAFE' : 'UNSAFE',
    safeSequence: result.safeSequence,
    steps: result.steps,
    need,
    unfinishedProcesses: result.unfinishedProcesses,
  };
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
};
