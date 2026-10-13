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

/** Play authentic Minecraft wooden button click sound using Web Audio API */
let sharedAudioCtx = null;
const getAudioContext = () => {
  if (!sharedAudioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume();
  }
  return sharedAudioCtx;
};

export const playClickSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. Sharp high-frequency mechanical snap / transient
    const snapOsc = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snapOsc.type = 'triangle';
    snapOsc.frequency.setValueAtTime(1250, now);
    snapOsc.frequency.exponentialRampToValueAtTime(320, now + 0.03);
    snapGain.gain.setValueAtTime(0.35, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    snapOsc.connect(snapGain);
    snapGain.connect(ctx.destination);
    snapOsc.start(now);
    snapOsc.stop(now + 0.03);

    // 2. Wooden body resonance thud
    const woodOsc = ctx.createOscillator();
    const woodGain = ctx.createGain();
    woodOsc.type = 'sine';
    woodOsc.frequency.setValueAtTime(380, now);
    woodOsc.frequency.exponentialRampToValueAtTime(110, now + 0.045);
    woodGain.gain.setValueAtTime(0.28, now);
    woodGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
    woodOsc.connect(woodGain);
    woodGain.connect(ctx.destination);
    woodOsc.start(now);
    woodOsc.stop(now + 0.045);

    // 3. Crisp mechanical button noise texture
    const noiseSamples = Math.floor(ctx.sampleRate * 0.015);
    const noiseBuffer = ctx.createBuffer(1, noiseSamples, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseSamples; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (noiseSamples * 0.35));
    }
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1800;
    noiseFilter.Q.value = 2.5;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.22, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
    noiseSrc.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSrc.start(now);
    noiseSrc.stop(now + 0.015);
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
