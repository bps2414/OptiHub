# Phase 1: Foundation & App Shell — Research

## Phase Goal
Establish the Tauri + React project with premium dark UI, sidebar navigation (including Credits/Licenses placeholder), and all IPC/async patterns that downstream phases depend on.

## Requirements
UIUX-01, UIUX-02, UIUX-04

## Key Findings

### Project Scaffolding (Tauri 2.x + React + Vite + TypeScript)

**Setup command:**
```bash
pnpm create tauri-app@latest
```
Prompts: project name → identifier (`com.optihub.app`) → TypeScript → pnpm → React → TypeScript

**Project structure:**
- `src/` — React frontend (Vite-managed)
- `src-tauri/` — Rust backend + Tauri config
- `src-tauri/tauri.conf.json` — main app config
- `src-tauri/capabilities/` — security permissions
- `src-tauri/src/` — Rust command handlers

**Dev command:** `pnpm tauri dev`
**Build command:** `pnpm tauri build`

### Tailwind CSS 4 Integration

Tailwind 4 uses the new `@theme` directive for design tokens as CSS variables. For a dark gaming UI:

- Use `@theme` to centralize color palette, spacing, typography
- Glassmorphism via `backdrop-blur-{size}`, `bg-{color}/{opacity}`, `border-white/10`
- Performance note: apply `backdrop-filter` to key components only (sidebar, modals), not every element
- Embed fonts locally for offline-first (don't rely on Google Fonts CDN)

### React Router 7 Sidebar Layout

- Use **layout routes** with `<Outlet />` for sidebar persistence
- Define a `DashboardLayout` component containing sidebar + content area
- Nest all page routes under the layout
- Use Zustand for non-URL UI state (sidebar collapse, theme)
- Use URL/route for navigation state

### Tauri 2.x IPC Patterns

**Command pattern:**
```rust
#[tauri::command]
async fn command_name(state: State<AppState>) -> Result<Response, AppError>
```

**Frontend invocation:**
```typescript
import { invoke } from '@tauri-apps/api/core';
const result = await invoke<ResponseType>('command_name', { arg });
```

**Error handling best practices:**
- Custom error enums with `thiserror` + `serde::Serialize`
- Never `.unwrap()` or `panic!()` in commands
- Use `#[serde(rename_all = "camelCase")]` on all IPC structs
- All async commands to avoid main thread blocking
- Consider `tauri-specta` for auto-generated TypeScript types

### Capability-Based Security (Tauri 2.x)

- Define capabilities incrementally in `src-tauri/capabilities/`
- Phase 1 needs minimal capabilities: just the default window capability
- Add permissions as new features require them (file system, shell, etc.)

### Design Patterns for Premium Gaming UI

**Color palette direction:**
- Deep background: `#0a0a0f` to `#141420`
- Surface/card: `#1a1a2e` to `#1e1e36`
- Accent: cyberpunk purple/blue gradient (`#6c5ce7` → `#a29bfe`)
- Text: `#e8e8f0` (primary), `#8888a0` (secondary)
- Border: `rgba(255, 255, 255, 0.06)`

**Sidebar pattern:**
- Fixed left sidebar, ~240px wide
- Icon + label navigation items
- Active state with accent highlight + subtle left border
- Hover state with surface-light background
- Section dividers between groups

**Typography:**
- Use Inter or Outfit (load locally for offline)
- Font sizes: 13-14px base, 12px for secondary

### Validation Architecture

**Dimension 1: Build Validation**
- `pnpm tauri dev` launches without errors
- React renders in WebView2 window

**Dimension 2: Navigation Validation**
- All 9 sidebar routes navigable
- Active state visually distinct
- Credits placeholder renders

**Dimension 3: IPC Validation**
- `invoke("greet")` returns expected response
- Error case returns structured error
- TypeScript types match Rust structs

---
*Researched: 2026-04-03*
