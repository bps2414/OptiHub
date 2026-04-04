# Pitfalls Research: OptiHub

## Domain: PC Game Optimization Desktop App (Tauri + React + Windows)

### Critical Pitfalls

#### 1. IPC Blocking & Main Thread Freezing
**Risk:** High | **Phase:** 1-2 (Foundation)

**What goes wrong:** Performing synchronous or long-running operations in Rust command handlers blocks the Tauri main thread. The UI freezes completely — no animations, no loading spinners, nothing.

**Warning signs:**
- UI becomes unresponsive during hardware detection or game scanning
- "Not Responding" in Windows title bar during operations
- Users perceive the app as crashed during legitimate operations

**Prevention:**
- Use `tokio::spawn` for all I/O-heavy commands (file scanning, registry reads, SQLite queries)
- Return immediately with a task ID, send progress via Tauri events
- Never use `std::thread::sleep` or blocking I/O in command handlers
- Add timeout mechanisms for all external operations

**Which phase:** Foundation (Phase 1) — establish async patterns from day one

---

#### 2. Rust ↔ TypeScript Type Mismatch
**Risk:** High | **Phase:** 1 (Foundation)

**What goes wrong:** Rust uses `snake_case`, TypeScript uses `camelCase`. Without explicit `serde` attributes, data arrives as `undefined` on the frontend with no error.

**Warning signs:**
- Frontend receives data but specific fields are `undefined`
- Debugging shows data exists in Rust but not in React
- Silent failures in UI rendering

**Prevention:**
- Use `#[serde(rename_all = "camelCase")]` on ALL Rust structs exposed via IPC
- Consider `tauri-specta` for auto-generating TypeScript types from Rust
- Create shared type definitions early, enforce consistency
- Add integration tests that verify serialization round-trips

**Which phase:** Foundation (Phase 1) — set up serde conventions immediately

---

#### 3. Steam VDF/ACF Parsing Edge Cases
**Risk:** Medium-High | **Phase:** 3 (Game Detection)

**What goes wrong:** Valve Data Format is not standard JSON. It has quirks: no commas, inconsistent quoting, nested braces, binary variants. Custom parsers frequently break on edge cases.

**Warning signs:**
- Parser works for simple cases but fails on complex VDF files
- Games not detected on some user systems
- Crashes when encountering unexpected VDF structure
- Multiple Steam library folders not all detected

**Prevention:**
- Use a battle-tested VDF parser crate (e.g., `keyvalues-parser` or `keyvalues-serde`)
- Test with real-world VDF files from diverse systems
- Handle gracefully: missing files, corrupted data, non-standard formatting
- Fallback: manual game addition when auto-detection fails
- Parse `libraryfolders.vdf` carefully — the format changed between Steam updates

**Which phase:** Game Detection (Phase 3)

---

#### 4. Tool Integration DLL Conflicts
**Risk:** High | **Phase:** 5-8 (Tool Integration + Apply)

**What goes wrong:** OptiScaler and Special K both work by placing DLLs in game directories. Both may want the same DLL name (`dxgi.dll`). Incorrect placement breaks games.

**Warning signs:**
- Game crashes on launch after optimization
- Black screen or infinite loading
- One tool works but disables the other
- Users lose confidence in the app after a broken game

**Prevention:**
- Map known DLL conflicts between tools (OptiScaler vs Special K `dxgi.dll` conflict)
- Implement conflict detection before applying any changes
- Use the OptiScaler plugins folder method when both tools are needed
- Never apply two conflicting configurations simultaneously
- Always test combinations: OptiScaler alone, Special K alone, both together
- Robust backup-before-write is CRITICAL — this is the safety net

**Which phase:** Tool Integration & Deployment Management (Phase 5), Apply & Restore (Phase 8)

---

#### 5. Lossless Scaling Legal/Detection Boundary
**Risk:** Medium | **Phase:** 5 (Tool Integration & Deployment Management)

**What goes wrong:** Lossless Scaling is commercial software. Any attempt to bundle, copy, or redistribute it violates terms. Even detecting it incorrectly (false positive) creates confusion.

**Warning signs:**
- Code that copies Lossless Scaling files
- Detection logic that triggers false positives
- UI that implies OptiHub provides Lossless Scaling
- Any path that leads users to pirated copies

**Prevention:**
- Detection ONLY: check Steam library for app ID 993090
- Never access, copy, or modify Lossless Scaling files
- Clear UI messaging: "Detected" vs "Not installed — get it on Steam"
- No download links beyond the official licensed channel, no workarounds, no bypass
- Document this constraint in code comments at the detection site

**Which phase:** Tool Integration & Deployment Management (Phase 5)

---

#### 6. Backup/Restore Reliability
**Risk:** Critical | **Phase:** 8 (Apply & Restore)

**What goes wrong:** If the backup mechanism fails silently, users lose original game configurations with no way to restore. This is the single most trust-damaging failure.

**Warning signs:**
- Backup files overwritten by subsequent operations
- Partial backups (some files backed up, others missed)
- Restore fails because backup is corrupted or missing
- Hash verification not implemented (can't verify backup integrity)

**Prevention:**
- Atomic backup operations: all-or-nothing
- SHA-256 hash of every backed-up file, verified before restore
- Backup metadata in SQLite: what, when, where, hash
- Never overwrite a backup — use versioned backup directories
- Test restore immediately after backup (smoke test)
- Show backup health status in UI

**Which phase:** Apply & Restore (Phase 8) — this is THE critical phase

---

#### 7. WebView2 Windows Quirks
**Risk:** Medium | **Phase:** 1 (Foundation)

**What goes wrong:** Tauri on Windows uses WebView2 (Chromium-based). Some CSS features, fonts, or animations behave differently than in standard Chrome. Also, WebView2 runtime may not be installed on older Windows systems.

**Warning signs:**
- UI looks different in dev (browser) vs production (WebView2)
- Fonts render differently or fail to load
- CSS backdrop-filter or glassmorphism effects not working
- App fails to launch on some Windows 10 machines

**Prevention:**
- Test in production build early and often (not just `tauri dev`)
- Bundle WebView2 bootstrapper with installer
- Keep CSS effects to well-supported features
- Test on Windows 10 (21H2+) and Windows 11
- Use local fonts if possible (don't rely on Google Fonts CDN for offline-first)

**Which phase:** Foundation (Phase 1)

---

#### 8. Permission/Capability Misconfiguration
**Risk:** Medium | **Phase:** 1, 5, 8

**What goes wrong:** Tauri 2.x uses capability-based permissions. If not configured correctly, commands silently fail or the app can't access required resources.

**Warning signs:**
- Commands return errors but the Rust logic is correct
- File operations fail with permission denied
- Shell commands can't execute
- Features work in dev but break in production

**Prevention:**
- Define capabilities incrementally: add permissions as new features are built
- Use separate capability files for different feature domains
- Test with production build after adding each new capability
- Document why each permission is needed (for security audits)

**Which phase:** Foundation (Phase 1), then ongoing

---

#### 9. Recommendation Engine Accuracy
**Risk:** Medium | **Phase:** 6 (Recommendation Engine)

**What goes wrong:** A rules engine that gives wrong recommendations destroys user trust faster than anything. Recommending an incompatible tool, or marking something "safe" when it breaks a game.

**Warning signs:**
- Users report broken games after following recommendations
- "Safe" recommendations cause issues
- Recommendations don't account for GPU vendor differences
- Missing game-specific exceptions

**Prevention:**
- Start conservative: default to "experimental" unless proven safe
- Use PCGamingWiki data as ground truth for compatibility
- Allow users to report issues with recommendations
- Version the rules database so it can be updated independently
- Include "why" with every recommendation — transparency builds trust

**Which phase:** Recommendation Engine (Phase 6)

---

#### 10. Scope Creep — The "Just One More Feature" Trap
**Risk:** High | **Phase:** All

**What goes wrong:** The vision document includes Potato-to-Playable, Anti-Lag Wizard, FPS Doctor, overlay, cloud sync. The temptation to add "just a bit" of these into MVP will delay launch indefinitely.

**Warning signs:**
- Phase plans include features not in MVP requirements
- "Quick" additions to recommendation engine for edge cases
- UI designed with placeholders for v2/v3 features
- Backend architecture over-engineered for future needs

**Prevention:**
- Hard boundary: if it's not in REQUIREMENTS.md v1, it doesn't exist yet
- Review each phase plan for scope creep before execution
- MVP is "detect, recommend, apply, restore" — nothing more
- v2/v3 features are documented in Out of Scope with clear reasoning
- Architecture should be extensible but implementation should be minimal

**Which phase:** All phases — constant vigilance

---
*Researched: 2026-04-03*
