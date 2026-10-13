/**
 * ╔══════════════════════════════════════════════════════╗
 * ║   BANKER'S ALGORITHM — Pure Simulation Engine       ║
 * ║   MINECRAFT: THE DEADLOCK SURVIVAL                  ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * Pure, deterministic module. No side effects.
 * Receives state → returns result.
 * Safe for direct unit testing.
 */

/**
 * Calculate the Need matrix from Max and Allocation.
 * Need[i][j] = Max[i][j] - Allocation[i][j]
 *
 * @param {number[][]} maxMatrix
 * @param {number[][]} allocationMatrix
 * @returns {{ need: number[][], error: string|null }}
 */
function calculateNeed(maxMatrix, allocationMatrix) {
  const n = maxMatrix.length;
  const m = maxMatrix[0]?.length || 0;
  const need = [];

  for (let i = 0; i < n; i++) {
    need[i] = [];
    for (let j = 0; j < m; j++) {
      if (allocationMatrix[i][j] > maxMatrix[i][j]) {
        return {
          need: null,
          error: `Process P${i}: Allocation[${j}] (${allocationMatrix[i][j]}) exceeds Max[${j}] (${maxMatrix[i][j]}). Invalid state!`,
        };
      }
      need[i][j] = maxMatrix[i][j] - allocationMatrix[i][j];
    }
  }

  return { need, error: null };
}

/**
 * Banker's Safety Algorithm
 * Determines if the current state is safe and finds a safe sequence.
 *
 * @param {number[]} available - Available resources vector
 * @param {number[][]} allocation - Allocation matrix [processes x resources]
 * @param {number[][]} need - Need matrix [processes x resources]
 * @returns {{ safe: boolean, safeSequence: string[], steps: object[] }}
 */
function safetyAlgorithm(available, allocation, need) {
  const n = allocation.length;   // number of processes
  const m = available.length;    // number of resource types

  // Step 1: Initialize Work = Available, Finish = [false, ...]
  const work = [...available];
  const finish = new Array(n).fill(false);
  const safeSequence = [];
  const steps = [];

  let found = true;

  // Iterate until no eligible process is found
  while (found) {
    found = false;

    for (let i = 0; i < n; i++) {
      if (finish[i]) continue;

      // Check if Need[i] <= Work
      const needLEWork = need[i].every((val, j) => val <= work[j]);

      if (needLEWork) {
        // Record step before simulation
        const workBefore = [...work];
        const needSnapshot = [...need[i]];
        const allocSnapshot = [...allocation[i]];

        // Simulate process completion: Work += Allocation[i]
        for (let j = 0; j < m; j++) {
          work[j] += allocation[i][j];
        }

        finish[i] = true;
        safeSequence.push(`P${i}`);
        found = true;

        steps.push({
          process: `P${i}`,
          workBefore,
          need: needSnapshot,
          allocationReleased: allocSnapshot,
          workAfter: [...work],
          step: safeSequence.length,
        });

        break; // Restart search from beginning
      }
    }
  }

  // Check if all processes finished
  const safe = finish.every(Boolean);

  return {
    safe,
    safeSequence: safe ? safeSequence : [],
    steps,
    unfinishedProcesses: finish
      .map((f, i) => (!f ? `P${i}` : null))
      .filter(Boolean),
  };
}

/**
 * Resource Request Algorithm
 * Simulates a resource request from process Pi.
 *
 * @param {object} state - Current simulation state
 * @param {number} processIndex - Which process is making the request
 * @param {number[]} request - Requested resources vector
 * @returns {{ granted: boolean, reason: string, newState: object|null, safeResult: object|null }}
 */
function resourceRequestAlgorithm(state, processIndex, request) {
  const { available, allocation, need } = state;
  const m = available.length;
  const i = processIndex;

  // Validate request length
  if (request.length !== m) {
    return {
      granted: false,
      reason: `Request vector length (${request.length}) doesn't match resource count (${m}).`,
      newState: null,
      safeResult: null,
    };
  }

  // Rule 1: Request must not exceed Need[i]
  for (let j = 0; j < m; j++) {
    if (request[j] > need[i][j]) {
      return {
        granted: false,
        reason: `Request[${j}] (${request[j]}) exceeds Need[${i}][${j}] (${need[i][j]}). Process claims it doesn't need that many!`,
        newState: null,
        safeResult: null,
      };
    }
  }

  // Rule 2: Request must not exceed Available
  for (let j = 0; j < m; j++) {
    if (request[j] > available[j]) {
      return {
        granted: false,
        reason: `Request[${j}] (${request[j]}) exceeds Available[${j}] (${available[j]}). Process must wait — resources unavailable!`,
        newState: null,
        safeResult: null,
        deferred: true,
      };
    }
  }

  // Rule 3: Tentative allocation — deep copy state
  const tentativeAvailable = [...available];
  const tentativeAllocation = allocation.map((row) => [...row]);
  const tentativeNeed = need.map((row) => [...row]);

  for (let j = 0; j < m; j++) {
    tentativeAvailable[j] -= request[j];
    tentativeAllocation[i][j] += request[j];
    tentativeNeed[i][j] -= request[j];
  }

  // Rule 4: Run safety algorithm on tentative state
  const safeResult = safetyAlgorithm(
    tentativeAvailable,
    tentativeAllocation,
    tentativeNeed
  );

  if (safeResult.safe) {
    return {
      granted: true,
      reason: `Request granted! System remains safe. Safe sequence: ${safeResult.safeSequence.join(' → ')}`,
      newState: {
        available: tentativeAvailable,
        allocation: tentativeAllocation,
        need: tentativeNeed,
      },
      safeResult,
    };
  } else {
    return {
      granted: false,
      reason: `Request DENIED! Granting this would lead to an unsafe state. System rolled back to original state.`,
      newState: null,
      safeResult,
    };
  }
}

/**
 * Deadlock Detection Algorithm
 * Different from safety — checks CURRENT outstanding requests (not max future needs).
 *
 * @param {number[]} available
 * @param {number[][]} allocation
 * @param {number[][]} request - Current outstanding requests (NOT the Need matrix)
 * @returns {{ deadlocked: boolean, deadlockedProcesses: string[], steps: object[] }}
 */
function deadlockDetectionAlgorithm(available, allocation, request) {
  const n = allocation.length;
  const m = available.length;

  const work = [...available];
  const finish = allocation.map((alloc) => alloc.every((v) => v === 0));
  const steps = [];
  const detectedSequence = [];

  let found = true;

  while (found) {
    found = false;

    for (let i = 0; i < n; i++) {
      if (finish[i]) continue;

      const requestLEWork = request[i].every((val, j) => val <= work[j]);

      if (requestLEWork) {
        const workBefore = [...work];

        for (let j = 0; j < m; j++) {
          work[j] += allocation[i][j];
        }

        finish[i] = true;
        detectedSequence.push(`P${i}`);
        found = true;

        steps.push({
          process: `P${i}`,
          workBefore,
          requestGranted: [...request[i]],
          allocationReleased: [...allocation[i]],
          workAfter: [...work],
        });

        break;
      }
    }
  }

  const deadlockedProcesses = finish
    .map((f, i) => (!f ? `P${i}` : null))
    .filter(Boolean);

  return {
    deadlocked: deadlockedProcesses.length > 0,
    deadlockedProcesses,
    completedProcesses: detectedSequence,
    steps,
  };
}

module.exports = {
  calculateNeed,
  safetyAlgorithm,
  resourceRequestAlgorithm,
  deadlockDetectionAlgorithm,
};
