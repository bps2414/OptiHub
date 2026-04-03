# Stack Research: OptiHub

## Recommended Stack (2026)

### Frontend
| Technology | Version | Confidence | Rationale |
|-----------|---------|------------|-----------|
| **React** | 19.x | ✅ High | User preference. Mature ecosystem, vast component libraries, excellent Tauri integration |
| **TypeScript** | 5.x | ✅ High | Type safety essential for complex IPC between React ↔ Rust |
| **Tailwind CSS** | 4.x | ✅ High | User preference. Utility-first, great for custom dark premium UI |
| **Vite** | 6.x | ✅ High | Default Tauri bundler. Fast HMR, excellent DX |
| **React Router** | 7.x | ✅ High | Sidebar-based navigation with nested routes |
| **Zustand** | 5.x | ✅ High | Lightweight state management, simpler than Redux for desktop apps |
| **Shadcn/UI** | latest | 🟡 Medium | Customizable accessible components. Consider for form elements, dialogs |
| **Lucide React** | latest | ✅ High | Icon library, consistent with Shadcn ecosystem |

### Backend (Rust / Tauri)
| Technology | Version | Confidence | Rationale |
|-----------|---------|------------|-----------|
| **Tauri** | 2.x | ✅ High | User preference. Smaller binary than Electron, native Windows integration, Rust backend |
| **sysinfo** (crate) | latest | ✅ High | Cross-platform CPU/RAM detection. Industry standard |
| **wmi** (crate) | latest | ✅ High | Windows-specific GPU/VRAM detection via Win32_VideoController |
| **nvml-wrapper** (crate) | latest | 🟡 Medium | NVIDIA-specific VRAM metrics. Optional enhancement |
| **serde / serde_json** | latest | ✅ High | Serialization for IPC and config files |
| **tokio** | 1.x | ✅ High | Async runtime for non-blocking file I/O |
| **winreg** (crate) | latest | ✅ High | Windows Registry access for Steam path detection |
| **keyvalues-parser** or custom VDF | latest | 🟡 Medium | Parse Valve Data Format (.vdf/.acf) files |

### Data & Storage
| Technology | Version | Confidence | Rationale |
|-----------|---------|------------|-----------|
| **SQLite** (via rusqlite) | latest | ✅ High | Local metadata DB: game library, presets, backup history |
| **JSON files** | — | ✅ High | Config files, preset definitions, tool metadata |
| **File system backups** | — | ✅ High | std::fs / tokio::fs for config backup/restore operations |

### Build & Distribution
| Technology | Version | Confidence | Rationale |
|-----------|---------|------------|-----------|
| **pnpm** | 9.x | ✅ High | Fast, efficient package manager |
| **Tauri bundler** | built-in | ✅ High | MSI/NSIS installer for Windows distribution |
| **GitHub Actions** | — | 🟡 Medium | CI/CD for builds and releases |

## What NOT to Use

| Technology | Reason |
|-----------|--------|
| **Electron** | Bloated binary, higher memory. Tauri is the explicit choice |
| **Redux** | Overkill for desktop app state. Zustand is simpler |
| **Next.js** | Server-side framework, irrelevant for desktop app |
| **MongoDB/PostgreSQL** | Overkill for local-only app. SQLite is the right fit |
| **Prisma** | ORM designed for server contexts, not embedded SQLite |
| **TailwindUI** | Paid license. Use Shadcn/UI (free) or custom components |
| **Node.js backend** | Rust backend via Tauri covers all system-level needs |

## Key Architecture Notes

1. **IPC Model**: React frontend invokes Rust commands via `@tauri-apps/api invoke()`. All system operations (file I/O, registry, hardware detection) happen in Rust.
2. **Security**: Tauri 2.0 uses capability-based permissions. Only enable what's needed in `src-tauri/capabilities/`.
3. **State**: Frontend state in Zustand. Persistent state in SQLite (Rust side). Config files in app data directory.
4. **VDF Parsing**: Steam's `.vdf` and `.acf` files require a custom parser or lightweight crate — not standard JSON.

---
*Researched: 2026-04-02*
