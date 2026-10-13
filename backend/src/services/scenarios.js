/**
 * Predefined Minecraft-themed scenarios for the simulator.
 * Players = Processes, Resources = Diamonds/Iron/Gold/Wood
 */

const scenarios = [
  {
    id: 'classic-safe',
    name: '⚔️ Classic Safe Kingdom',
    description: 'The textbook Banker\'s Algorithm example. A safe sequence exists: P1 → P3 → P4 → P0 → P2.',
    theme: 'overworld',
    resources: [
      { name: '💎 Diamonds', total: 10 },
      { name: '🪨 Iron', total: 5 },
      { name: '🪵 Wood', total: 7 },
    ],
    processes: [
      { name: 'Steve (P0)', max: [7, 5, 3], allocation: [0, 1, 0] },
      { name: 'Alex (P1)', max: [3, 2, 2], allocation: [2, 0, 0] },
      { name: 'Creeper (P2)', max: [9, 0, 2], allocation: [3, 0, 2] },
      { name: 'Enderman (P3)', max: [2, 2, 2], allocation: [2, 1, 1] },
      { name: 'Villager (P4)', max: [4, 3, 3], allocation: [0, 0, 2] },
    ],
  },
  {
    id: 'unsafe-nether',
    name: '🔥 Unsafe Nether Realm',
    description: 'No safe sequence exists. Processes are deadlocked in the Nether!',
    theme: 'nether',
    resources: [
      { name: '🔥 Blaze Rods', total: 3 },
      { name: '💀 Skulls', total: 3 },
    ],
    processes: [
      { name: 'Ghast (P0)', max: [2, 2], allocation: [1, 1] },
      { name: 'Blaze (P1)', max: [2, 2], allocation: [1, 1] },
      { name: 'Wither Skeleton (P2)', max: [2, 2], allocation: [1, 1] },
    ],
  },
  {
    id: 'diamond-pickaxe',
    name: '⛏️ Diamond Pickaxe Wars',
    description: 'Three miners fighting over resources. Run safety check to find who gets the pickaxe!',
    theme: 'mine',
    resources: [
      { name: '💎 Diamonds', total: 9 },
      { name: '🪵 Wood Planks', total: 6 },
      { name: '🧵 String', total: 4 },
    ],
    processes: [
      { name: 'Miner Steve (P0)', max: [5, 3, 2], allocation: [2, 1, 2] },
      { name: 'Miner Alex (P1)', max: [4, 2, 2], allocation: [1, 2, 1] },
      { name: 'Miner Herobrine (P2)', max: [3, 3, 2], allocation: [2, 2, 0] },
    ],
  },
  {
    id: 'end-battle',
    name: '🐉 End Battle - Dragon Slaying',
    description: 'Five heroes must coordinate their End Crystal resources to defeat the Ender Dragon.',
    theme: 'end',
    resources: [
      { name: '🌟 End Crystals', total: 7 },
      { name: '🏹 Arrows', total: 5 },
      { name: '⚡ Ender Pearls', total: 6 },
      { name: '🛡️ Golden Apples', total: 4 },
    ],
    processes: [
      { name: 'Knight (P0)', max: [4, 2, 1, 1], allocation: [0, 0, 1, 1] },
      { name: 'Archer (P1)', max: [3, 3, 2, 0], allocation: [1, 2, 0, 0] },
      { name: 'Mage (P2)', max: [2, 1, 4, 2], allocation: [1, 0, 2, 0] },
      { name: 'Rogue (P3)', max: [1, 1, 1, 2], allocation: [0, 1, 1, 1] },
      { name: 'Healer (P4)', max: [2, 2, 2, 3], allocation: [1, 1, 1, 2] },
    ],
  },
];

module.exports = scenarios;
