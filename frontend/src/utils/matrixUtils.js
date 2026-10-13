/**
 * Matrix utility helpers for the Banker's Algorithm UI
 */

/** Create an n×m matrix filled with 0 */
export const createMatrix = (n, m, fill = 0) =>
  Array.from({ length: n }, () => Array(m).fill(fill));

/** Deep clone a matrix */
export const cloneMatrix = (m) => m.map((row) => [...row]);

/** Parse matrix from string input */
export const parseMatrix = (matrix) =>
  matrix.map((row) => row.map((v) => parseInt(v, 10) || 0));

/** Validate that allocation[i] <= max[i] for all i,j */
export const validateAllocation = (max, alloc) => {
  for (let i = 0; i < max.length; i++) {
    for (let j = 0; j < max[i].length; j++) {
      if (alloc[i][j] > max[i][j]) {
        return { valid: false, error: `P${i}: Alloc[${j}]=${alloc[i][j]} > Max[${j}]=${max[i][j]}` };
      }
    }
  }
  return { valid: true, error: null };
};

/** Calculate available from total and allocation */
export const calculateAvailable = (totals, allocation) => {
  return totals.map((total, j) =>
    total - allocation.reduce((sum, row) => sum + (row[j] || 0), 0)
  );
};

/** Format number with color class based on value */
export const valueColorClass = (val, max) => {
  if (val === 0) return 'mc-green-text';
  if (val >= max) return 'mc-red-text';
  return 'mc-gold-text';
};

/** Generate resource labels (A, B, C, ...) */
export const resourceLabel = (idx) => String.fromCharCode(65 + idx);

/** Play a click sound using Web Audio API */
export const playClickSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(440, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.08);
  } catch (_) {}
};

/** Play a success ding */
export const playSuccessSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.15);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.15);
    });
  } catch (_) {}
};

/** Play an error buzz */
export const playErrorSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  } catch (_) {}
};
