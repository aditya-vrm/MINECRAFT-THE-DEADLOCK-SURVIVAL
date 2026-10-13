const {
  calculateNeed,
  safetyAlgorithm,
  resourceRequestAlgorithm,
  deadlockDetectionAlgorithm,
} = require('../bankersAlgorithm');

describe("Banker's Algorithm Tests", () => {
  // Standard textbook example: 5 processes (P0-P4), 3 resource types (A, B, C)
  const allocation = [
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2],
    [2, 1, 1],
    [0, 0, 2],
  ];

  const max = [
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2],
    [2, 2, 2],
    [4, 3, 3],
  ];

  const available = [3, 3, 2];

  test('calculateNeed correctly calculates Need matrix (Max - Allocation)', () => {
    const { need, error } = calculateNeed(max, allocation);
    expect(error).toBeNull();
    expect(need).toEqual([
      [7, 4, 3],
      [1, 2, 2],
      [6, 0, 0],
      [0, 1, 1],
      [4, 3, 1],
    ]);
  });

  test('calculateNeed catches Allocation exceeding Max', () => {
    const invalidAlloc = [
      [8, 1, 0], // 8 > 7
      [2, 0, 0],
      [3, 0, 2],
      [2, 1, 1],
      [0, 0, 2],
    ];
    const { need, error } = calculateNeed(max, invalidAlloc);
    expect(need).toBeNull();
    expect(error).toContain('exceeds Max');
  });

  test('safetyAlgorithm identifies safe state and valid safe sequence', () => {
    const { need } = calculateNeed(max, allocation);
    const result = safetyAlgorithm(available, allocation, need);
    expect(result.safe).toBe(true);
    expect(result.safeSequence.length).toBe(5);
    // Standard sequence is usually P1, P3, P4, P0, P2 or P1, P3, P0, P2, P4 etc.
    expect(result.safeSequence[0]).toBe('P1');
    expect(result.unfinishedProcesses).toEqual([]);
    expect(result.steps.length).toBe(5);
  });

  test('resourceRequestAlgorithm grants valid safe request for P1 [1, 0, 2]', () => {
    const { need } = calculateNeed(max, allocation);
    const state = {
      available: [...available],
      allocation: allocation.map((r) => [...r]),
      need: need.map((r) => [...r]),
    };

    const request = [1, 0, 2];
    const result = resourceRequestAlgorithm(state, 1, request);
    expect(result.granted).toBe(true);
    expect(result.newState).toBeDefined();
    expect(result.newState.available).toEqual([2, 3, 0]);
  });

  test('resourceRequestAlgorithm denies request exceeding Need', () => {
    const { need } = calculateNeed(max, allocation);
    const state = {
      available: [...available],
      allocation: allocation.map((r) => [...r]),
      need: need.map((r) => [...r]),
    };

    const request = [2, 0, 0]; // P1 need is [1, 2, 2], request[0]=2 > need[0]=1
    const result = resourceRequestAlgorithm(state, 1, request);
    expect(result.granted).toBe(false);
    expect(result.reason).toContain('exceeds Need');
  });

  test('resourceRequestAlgorithm denies request exceeding Available', () => {
    const { need } = calculateNeed(max, allocation);
    const state = {
      available: [...available],
      allocation: allocation.map((r) => [...r]),
      need: need.map((r) => [...r]),
    };

    const request = [4, 0, 0]; // Available is [3, 3, 2]
    const result = resourceRequestAlgorithm(state, 0, request);
    expect(result.granted).toBe(false);
    expect(result.reason).toContain('exceeds Available');
  });

  test('deadlockDetectionAlgorithm detects deadlock when circular wait occurs', () => {
    const deadlockedAlloc = [
      [1, 0],
      [0, 1],
    ];
    const deadlockedRequest = [
      [0, 1],
      [1, 0],
    ];
    const deadlockedAvail = [0, 0];

    const result = deadlockDetectionAlgorithm(
      deadlockedAvail,
      deadlockedAlloc,
      deadlockedRequest
    );
    expect(result.deadlocked).toBe(true);
    expect(result.deadlockedProcesses).toEqual(['P0', 'P1']);
  });
});
