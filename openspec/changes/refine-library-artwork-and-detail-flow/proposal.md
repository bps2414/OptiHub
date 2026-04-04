## Why

The first Phase 4 implementation exposed three product-level issues during real user testing: library cards do not hydrate cover art reliably on first open, portrait artwork presentation is inconsistent or letterboxed, and the split between `Library` and `Games` makes the game-browsing flow feel confusing. We need a focused refinement change now so the rich library experience becomes dependable, visually coherent, and easier to understand before more downstream phases build on it.

## What Changes

- Refine the game-navigation model so Library becomes the single primary surface for browsing and opening game detail, and remove the separate top-level `Games` destination from the sidebar.
- Tighten the artwork strategy so the app distinguishes portrait-oriented library card art from more flexible detail hero art instead of forcing one asset to serve both roles.
- Tighten the artwork strategy for browse cards so the library prefers portrait-oriented art, avoids black-bar letterboxing, and uses a deterministic fallback when compliant portrait art is unavailable.
- Tighten metadata hydration so library cards receive cached or freshly hydrated artwork without requiring the user to open a detail view first.
- Refine metadata localization so cached descriptions and related metadata respect the app language when localized content is available.
- Approve SteamGridDB as the portrait-art fallback path for 600x900-style library assets when Steam-family sources do not provide a good vertical option.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `app-shell-ui`: Simplify the top-level game navigation so the library flow is no longer split into separate user-facing Library and Games destinations.
- `game-library`: Refine the browse/detail flow so detail opens within the single library experience and library cards follow stronger portrait-art and hydration expectations.
- `metadata-cache`: Refine the metadata pipeline so artwork is portrait-first, localization-aware, and hydrated in the library without relying on a prior detail-page visit.

## Impact

- Frontend surfaces: `src/App.tsx`, `src/components/Sidebar.tsx`, `src/pages/LibraryPage.tsx`, `src/pages/GamesPage.tsx` or its replacement, `src/components/games/*`, `src/stores/games.ts`, `src/i18n/messages.ts`, and `src/index.css`.
- Backend surfaces: `src-tauri/src/commands/games.rs`, `src-tauri/src/game_metadata.rs`, cache-key strategy, metadata refresh flow, and provider/fallback hooks used for portrait card art selection.
- Product behavior: Phase 4 becomes a single, clearer library flow with more reliable card artwork and locale-aware metadata.
