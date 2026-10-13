/**
 * Input Validators for Banker's Algorithm Simulation
 * All validation logic lives here — separate from routes and algorithms.
 */

/**
 * Validate the simulation setup payload.
 * @param {object} body - Request body
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateSimulationSetup(body) {
  const errors = [];
  const { resources, processes } = body;

  // Validate resources
  if (!resources || !Array.isArray(resources) || resources.length === 0) {
    errors.push('Resources must be a non-empty array.');
  } else {
    resources.forEach((r, i) => {
      if (!r.name || typeof r.name !== 'string') {
        errors.push(`Resource[${i}]: name must be a string.`);
      }
      if (typeof r.total !== 'number' || r.total < 1) {
        errors.push(`Resource[${i}]: total must be a positive integer.`);
      }
    });
  }

  // Validate processes
  if (!processes || !Array.isArray(processes) || processes.length === 0) {
    errors.push('Processes must be a non-empty array.');
  } else {
    const numResources = resources?.length || 0;
    processes.forEach((p, i) => {
      if (!p.name || typeof p.name !== 'string') {
        errors.push(`Process[${i}]: name must be a string.`);
      }
      if (!Array.isArray(p.max) || p.max.length !== numResources) {
        errors.push(`Process[${i}]: max must be an array of length ${numResources}.`);
      } else if (p.max.some((v) => typeof v !== 'number' || v < 0)) {
        errors.push(`Process[${i}]: max values must be non-negative numbers.`);
      }
      if (!Array.isArray(p.allocation) || p.allocation.length !== numResources) {
        errors.push(`Process[${i}]: allocation must be an array of length ${numResources}.`);
      } else if (p.allocation.some((v) => typeof v !== 'number' || v < 0)) {
        errors.push(`Process[${i}]: allocation values must be non-negative numbers.`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a resource request payload.
 * @param {object} body
 * @param {number} numResources
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateResourceRequest(body, numResources) {
  const errors = [];
  const { processIndex, request } = body;

  if (typeof processIndex !== 'number' || processIndex < 0) {
    errors.push('processIndex must be a non-negative integer.');
  }

  if (!Array.isArray(request) || request.length !== numResources) {
    errors.push(`request must be an array of length ${numResources}.`);
  } else if (request.some((v) => typeof v !== 'number' || v < 0)) {
    errors.push('All request values must be non-negative numbers.');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate matrices for stateless safety check.
 * @param {object} body
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateStatelessCheck(body) {
  const errors = [];
  const { available, allocation, max } = body;

  if (!Array.isArray(available) || available.length === 0) {
    errors.push('available must be a non-empty array.');
  }

  if (!Array.isArray(allocation) || allocation.length === 0) {
    errors.push('allocation must be a non-empty array.');
  }

  if (!Array.isArray(max) || max.length === 0) {
    errors.push('max must be a non-empty array.');
  }

  if (errors.length === 0) {
    const m = available.length;
    allocation.forEach((row, i) => {
      if (!Array.isArray(row) || row.length !== m) {
        errors.push(`allocation[${i}] must have ${m} values.`);
      }
    });
    max.forEach((row, i) => {
      if (!Array.isArray(row) || row.length !== m) {
        errors.push(`max[${i}] must have ${m} values.`);
      }
    });
    if (allocation.length !== max.length) {
      errors.push('allocation and max must have the same number of processes.');
    }
  }

  return { valid: errors.length === 0, errors };
}

module.exports = {
  validateSimulationSetup,
  validateResourceRequest,
  validateStatelessCheck,
};
