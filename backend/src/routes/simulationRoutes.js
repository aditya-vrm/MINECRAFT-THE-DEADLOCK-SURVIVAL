const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/simulationController');

// Simulation CRUD
router.post('/', ctrl.createSimulation);
router.get('/:id', ctrl.getSimulation);
router.put('/:id', ctrl.updateSimulation);

// Algorithm endpoints
router.post('/:id/safety-check', ctrl.runSafetyCheck);
router.post('/:id/requests', ctrl.processRequest);
router.post('/:id/reset', ctrl.resetSimulation);
router.post('/:id/detect-deadlock', ctrl.detectDeadlock);

module.exports = router;
