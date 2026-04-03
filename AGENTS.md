<!-- GSD:project-start source:PROJECT.md -->
## Project

**OptiHub**

OptiHub is a Windows-first, offline-first desktop application that centralizes PC game optimization into a single premium hub. It detects installed games and hardware, recommends the best optimization tools per game, offers automatic presets (Quality/Balanced/Performance), and applies reversible configurations with user confirmation. The UI targets a modern gamer launcher aesthetic — dark premium, sidebar-based, beautiful and accessible.

**Core Value:** The user can optimize any detected game with one guided flow — see what tool to use, pick a preset, apply it safely, and undo it anytime — without needing to understand the fragmented optimization ecosystem.

### Constraints

- **Platform**: Windows only — architecture optimized for Windows APIs, no cross-platform abstractions
- **Stack**: Tauri + React + Tailwind — user's preferred stack, suitable for desktop with native access
- **Offline-first**: All core functionality must work without internet connection
- **No redistribution**: Third-party tools must not be bundled without license compliance; prefer detection of existing installs
- **Lossless Scaling**: Commercial software — integration only via detection of existing Steam install, never redistribute
- **User consent**: All system modifications require explicit user confirmation before execution
- **Reversibility**: Every change the app makes must be undoable
- **Safety classification**: Every recommendation must carry a risk level (safe/limited/experimental)
- **Licensing compliance**: Every integrated project must have documented name, author, license, and source URL from day one
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

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
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Full conventions: `.planning/CONVENTIONS.md`

### README Sync (mandatory after every phase)

OptiHub maintains two public READMEs: `README.md` (EN) and `README.pt-BR.md` (PT-BR).

**After every phase execution or quick task that changes user-facing functionality:**

1. Update the phase status table in both READMEs to match the current ROADMAP.md
2. If the phase delivered a new end-user feature, expand the features section
3. Commit: `git add README.md README.pt-BR.md && git commit -m "docs: sync READMEs with phase {N} completion"`
4. Push: `git push origin master`

Status mapping:
- `[ ]` not started → `⏳ Planned` (EN) / `⏳ Planejada` (PT-BR)
- Active phase in STATE.md → `🔄 In progress` / `🔄 Em progresso`
- `[x]` complete → `✅ Complete` / `✅ Concluída`

See `.planning/CONVENTIONS.md` for the full checklist and what NOT to do.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.

### Post-Execution Checklist (every phase and quick task)

After any execution that changes user-facing behavior:

1. **Update READMEs** — sync phase status table in `README.md` and `README.pt-BR.md`
2. **Commit READMEs** — `docs: sync READMEs with phase {N} completion`
3. **Push** — `git push origin master`

This is not optional. Stale public READMEs misrepresent the project state on GitHub.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
