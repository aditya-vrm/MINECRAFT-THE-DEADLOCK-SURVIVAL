# 🎮 MINECRAFT: THE DEADLOCK SURVIVAL

> **An interactive Banker's Algorithm simulator styled as a Minecraft game client.**
> Built as an Operating Systems college project for Sarala Birla University, BCA Program.

---

## 🌍 Overview

A fully functional, interactive single-page web application that simulates a Minecraft game client to teach **OS Deadlocks** and **Banker's Algorithm**.

## 🚀 Quick Start

### 1. Backend (Express API)
```bash
cd backend
npm install
npm run dev       # Starts at http://localhost:5001
```

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev       # Starts at http://localhost:5173
```

---

## 🎮 Screens

| Screen | Description |
|--------|-------------|
| **Main Menu** | Cinematic sunset background, bouncing splash text, 3 Minecraft-style buttons |
| **Story Mode** | 6 interactive slides with Minecraft biome backgrounds |
| **Survival Mode** | Full Banker's Algorithm simulator with editable matrices |
| **Cherry Blossom** | Cinematic thank-you screen with falling petals |

## ⚙️ Features

- **Safety Algorithm** — determines if a safe sequence exists
- **Resource Request Simulator** — validates requests using all 5 protocol rules
- **Step-by-step Execution** — watch the algorithm unfold one step at a time
- **4 Predefined Scenarios** — from classic textbook to unsafe nether realm
- **Deadlock vs Unsafe State** — correctly distinguished
- **Pixel-art Minecraft UI** — authentic look and feel with Web Audio sound effects

## 🏗️ Architecture

```
MINECRAFT-THE-DEADLOCK-SURVIVAL/
├── backend/                    # Node.js + Express
│   └── src/
│       ├── algorithms/         # Pure Banker's Algorithm engine
│       ├── controllers/        # HTTP request handlers
│       ├── services/           # Business logic & scenarios
│       ├── validators/         # Input validation
│       ├── middleware/         # Error handling
│       ├── routes/             # API routes
│       ├── app.js              # Express app
│       └── server.js           # Server entry
└── frontend/                   # React + Vite
    └── src/
        ├── components/
        │   ├── ui/             # LoadingScreen
        │   ├── menu/           # MainMenu, ThankYou
        │   ├── presentation/   # StoryMode (6 slides)
        │   └── simulator/      # SurvivalMode
        ├── services/           # API client (axios)
        ├── utils/              # matrixUtils, sounds
        └── App.jsx             # Root orchestrator
```

## 📡 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Health check |
| GET | `/api/scenarios` | List predefined scenarios |
| POST | `/api/safety-check` | Stateless safety check |
| POST | `/api/simulations` | Create simulation |
| POST | `/api/simulations/:id/safety-check` | Run safety algorithm |
| POST | `/api/simulations/:id/requests` | Process resource request |
| POST | `/api/simulations/:id/reset` | Reset to initial state |
| POST | `/api/simulations/:id/detect-deadlock` | Detect deadlock |

## 👥 Team

- **Aditya Verma** — Lead Developer
- **Student 2** — Co-Developer
- **Student 3** — Researcher
- **Prof. Guide** — Faculty Mentor

## 📚 References

- Silberschatz, A., Galvin, P. B., & Gagne, G. (2018). *Operating System Concepts*. Wiley.
- Dijkstra, E. W. (1965). *EWD108: Een Algorithme ter voorkoming van de dodelijke omarming*
- [Minecraft](https://minecraft.net) — for the aesthetic inspiration 🎮

---

*Made with ❤️ and 💎 Diamonds | Sarala Birla University — BCA 2026*
