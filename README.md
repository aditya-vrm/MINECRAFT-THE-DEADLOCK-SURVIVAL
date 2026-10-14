# 💻 Banker's Algorithm & Deadlock Simulator (PWA)

> **An interactive Operating Systems simulation and Progressive Web App (PWA) for Banker's Algorithm and Deadlock Avoidance.**
> Built as an Operating Systems college project for Sarala Birla University, BCA Program.

---

## 🌍 Overview

A fully functional, interactive Progressive Web App that provides an intuitive visual simulation of **OS Deadlocks** and **Banker's Algorithm**. Uses real-world college laboratory resource allocation scenarios with step-by-step mathematical verification.

## 📱 PWA (Installable Web App)

This application is a **Progressive Web App (PWA)**:
- **Desktop (Chrome/Edge)**: Click the **Install** button on the home screen or the install icon in the address bar.
- **Android**: Tap the install banner or "Add to Home Screen".
- **iOS (Safari)**: Tap the Share button → **"Add to Home Screen"**.
- Works offline with service worker asset caching.

---

## 🚀 Quick Start

### 1. Backend (Express API)
```bash
cd backend
npm install
npm run dev       # Starts at http://localhost:5001
```

### 2. Frontend (React + Vite PWA)
```bash
cd frontend
npm install
npm run dev       # Starts at http://localhost:5173
```

---

## 🎮 Screens & Features

| Screen | Description |
|--------|-------------|
| **Main Menu** | Animated title ("Banker's Algorithm & Deadlock"), sound effects, mode selection, and PWA install button |
| **Story Mode** | 6 presentation slides with college campus lab scenarios, 4 Coffman conditions, and formulas |
| **Simulator Mode** | Interactive Banker's Algorithm calculator with editable matrices, step-by-step playback, and scenarios |
| **Acknowledgments** | Falling cherry blossom petals, SBU team recognition, and Dijkstra quote |

## ⚙️ Core Mechanics

- **Safety Algorithm** — determines whether a safe execution order exists
- **Resource Request Protocol** — validates tentative allocation across all 5 safety rules
- **Step-by-Step History** — inspects $Work$, $Need$, and released allocations at every step
- **4 Real-World College Scenarios** — from Standard Lab Safe state to Project Submission Deadlock
- **Deadlock vs Unsafe State** — correctly differentiated with detection algorithms
- **Authentic Wooden Click Sound** — Web Audio API synthesized switch clicks

---

## 👥 Project Team

### Students
- **Aditya Verma** — SBU2500852
- **Anish Deep Kerketta** — SBU2500871
- **Vishal Kumar** — SBU2500915

### Faculty Guidance
- **DR. Prakash Kumar**

---

## 🏛️ Academic Information

- **Institution**: Sarala Birla University, Ranchi
- **Program**: Bachelor of Computer Applications (BCA)
- **Course**: Operating Systems — Semester III

---

*Sarala Birla University — BCA 2026*
