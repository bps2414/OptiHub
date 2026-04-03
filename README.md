# OptiHub

> Windows-first, offline-first desktop application that centralizes PC game optimization into a single premium hub.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Platform](https://img.shields.io/badge/platform-Windows-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-in%20development-orange)

**[🇧🇷 Leia em Português](README.pt-BR.md)**

## What is OptiHub?

OptiHub detects your installed games and PC hardware, recommends the best optimization tools per game, offers automatic presets (Quality / Balanced / Performance), and applies reversible configurations — all with your explicit confirmation. No more bouncing between a dozen tools and guides.

**Core Value:** Optimize any detected game with one guided flow — see what tool to use, pick a preset, apply it safely, undo it anytime.

## Features (Roadmap)

- 🎮 **Game Detection** — Automatically detects Steam library and installed games
- 🖥️ **Hardware Profiling** — CPU, GPU, RAM detection for personalized recommendations
- 🛠️ **Tool Recommendations** — Per-game optimization tool suggestions with risk levels (safe / limited / experimental)
- ⚙️ **Preset System** — Quality / Balanced / Performance presets per game
- 🔄 **Reversible Changes** — Every modification is backed up and undoable
- 📦 **Offline-First** — All core functionality works without internet

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Tailwind CSS 4 |
| Desktop Shell | Tauri 2 (Rust backend) |
| State | Zustand 5 |
| Build | Vite 6 + pnpm |
| Storage | SQLite (rusqlite) + JSON config files |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+
- [Rust](https://rustup.rs/) (stable)
- [Tauri prerequisites](https://tauri.app/start/prerequisites/) for Windows

### Development

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm tauri dev
```

### Build

```bash
# Build production installer
pnpm tauri build
```

## Project Status

Currently in active development — **Phase 01: Foundation App Shell** in progress.

See [`.planning/`](.planning/) for the roadmap and phase plans.

## License

MIT — see [LICENSE](LICENSE) for details.
