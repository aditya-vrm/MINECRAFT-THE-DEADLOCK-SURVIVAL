/**
 * API Service — connects frontend to the Banker's Algorithm backend.
 * All API calls live here — clean separation from UI components.
 */

import axios from 'axios';

let rawBase = import.meta.env.VITE_API_URL || '/api';
if (rawBase && rawBase !== '/api') {
  // Strip trailing slashes
  rawBase = rawBase.replace(/\/+$/, '');
  // If user passed root backend URL without /api, append /api
  if (!rawBase.endsWith('/api')) {
    rawBase += '/api';
  }
}

const BASE_URL = rawBase;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Stateless Safety Check (no simulation object created) ──
export const statelessSafetyCheck = async (available, allocation, max) => {
  const { data } = await api.post('/safety-check', { available, allocation, max });
  return data;
};

// ── Scenarios ──────────────────────────────────────────────
export const getScenarios = async () => {
  const { data } = await api.get('/scenarios');
  return data;
};

// ── Simulation CRUD ────────────────────────────────────────
export const createSimulation = async (name, resources, processes) => {
  const { data } = await api.post('/simulations', { name, resources, processes });
  return data;
};

export const getSimulation = async (id) => {
  const { data } = await api.get(`/simulations/${id}`);
  return data;
};

export const updateSimulation = async (id, name, resources, processes) => {
  const { data } = await api.put(`/simulations/${id}`, { name, resources, processes });
  return data;
};

// ── Algorithm Endpoints ────────────────────────────────────
export const runSafetyCheck = async (id) => {
  const { data } = await api.post(`/simulations/${id}/safety-check`);
  return data;
};

export const submitRequest = async (id, processIndex, request) => {
  const { data } = await api.post(`/simulations/${id}/requests`, { processIndex, request });
  return data;
};

export const resetSimulation = async (id) => {
  const { data } = await api.post(`/simulations/${id}/reset`);
  return data;
};

export const detectDeadlock = async (id) => {
  const { data } = await api.post(`/simulations/${id}/detect-deadlock`);
  return data;
};

export const checkHealth = async () => {
  const { data } = await api.get('/health');
  return data;
};

export default api;
