/**
 * Predefined College Lab scenarios for the Banker's Algorithm simulator.
 * Real-world academic resource allocation scenarios for SBU OS Lab.
 */

const scenarios = [
  {
    id: 'classic-safe',
    name: '🎓 SBU Computer Lab (Standard Safe State)',
    description: 'Textbook Banker\'s Algorithm: 5 student project batches sharing campus lab equipment. Safe sequence: P1 → P3 → P4 → P0 → P2.',
    theme: 'overworld',
    resources: [
      { name: '💻 High-End PCs (A)', total: 10 },
      { name: '📽️ Projectors (B)', total: 5 },
      { name: '📚 Reference Kits (C)', total: 7 },
    ],
    processes: [
      { name: 'Team Alpha (P0)', max: [7, 5, 3], allocation: [0, 1, 0] },
      { name: 'Team Beta (P1)', max: [3, 2, 2], allocation: [2, 0, 0] },
      { name: 'Team Gamma (P2)', max: [9, 0, 2], allocation: [3, 0, 2] },
      { name: 'Team Delta (P3)', max: [2, 2, 2], allocation: [2, 1, 1] },
      { name: 'Team Omega (P4)', max: [4, 3, 3], allocation: [0, 0, 2] },
    ],
  },
  {
    id: 'unsafe-deadlock',
    name: '⚠️ Project Submission Rush (Deadlock / Circular Wait)',
    description: 'Three student groups holding equipment and waiting for each other before deadline. Circular dependency causes a complete Deadlock!',
    theme: 'nether',
    resources: [
      { name: '📷 Media Cameras (A)', total: 3 },
      { name: '🎙️ Audio Kits (B)', total: 3 },
    ],
    processes: [
      { name: 'Media Team 1 (P0)', max: [2, 2], allocation: [1, 1] },
      { name: 'Media Team 2 (P1)', max: [2, 2], allocation: [1, 1] },
      { name: 'Media Team 3 (P2)', max: [2, 2], allocation: [1, 1] },
    ],
  },
  {
    id: 'iot-robotics-lab',
    name: '🔬 IoT & Robotics Lab Competition',
    description: 'Three engineering teams competing for microcontrollers, sensors, and power packs. Banker checks if requests are grantable safely.',
    theme: 'mine',
    resources: [
      { name: '🤖 Microcontrollers (A)', total: 9 },
      { name: '🔌 Sensor Kits (B)', total: 6 },
      { name: '🔋 Power Units (C)', total: 4 },
    ],
    processes: [
      { name: 'Robotics Team 1 (P0)', max: [5, 3, 2], allocation: [2, 1, 2] },
      { name: 'Robotics Team 2 (P1)', max: [4, 2, 2], allocation: [1, 2, 1] },
      { name: 'Robotics Team 3 (P2)', max: [3, 3, 2], allocation: [2, 2, 0] },
    ],
  },
  {
    id: 'symposium-hall',
    name: '🏛️ Multi-Department College Symposium',
    description: 'Five department committees coordinating shared seminar hall resources (Laptops, Projectors, Mics, Sound Systems).',
    theme: 'end',
    resources: [
      { name: '💻 Seminar Laptops (A)', total: 7 },
      { name: '📽️ Overhead Projectors (B)', total: 5 },
      { name: '🎙️ Wireless Mics (C)', total: 6 },
      { name: '🔊 PA Sound Systems (D)', total: 4 },
    ],
    processes: [
      { name: 'BCA Dept (P0)', max: [4, 2, 1, 1], allocation: [0, 0, 1, 1] },
      { name: 'MCA Dept (P1)', max: [3, 3, 2, 0], allocation: [1, 2, 0, 0] },
      { name: 'B.Tech CSE (P2)', max: [2, 1, 4, 2], allocation: [1, 0, 2, 0] },
      { name: 'Data Science (P3)', max: [1, 1, 1, 2], allocation: [0, 1, 1, 1] },
      { name: 'IT Dept (P4)', max: [2, 2, 2, 3], allocation: [1, 1, 1, 2] },
    ],
  },
];

module.exports = scenarios;
