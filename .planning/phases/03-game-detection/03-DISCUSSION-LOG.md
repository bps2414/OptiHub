# Phase 3: Game Detection - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-04T01:51:30.4819237Z
**Phase:** 03-game-detection
**Areas discussed:** Minimal library presentation, manual registration flow, source distinction and removal rules, refresh and duplicate handling

---

## Minimal library presentation

| Option | Description | Selected |
|--------|-------------|----------|
| Compact table/list | Shows name, source, install path, and quick actions; optimized for management-first Phase 3 | ✓ |
| Simple stacked cards | Premium-feeling cards with source badge and actions | |
| Split usage by route | `/library` as management list and `/games` as lighter overview until Phase 4 | |
| You decide | Leave the exact choice to the agent | |

**User's choice:** Compact table/list
**Notes:** The user chose a dense, management-first baseline and explicitly kept the richer visual treatment for later work.

---

## Manual registration flow

| Option | Description | Selected |
|--------|-------------|----------|
| Pick `.exe`, auto-fill name, optional rename | Fast default with optional cleanup | |
| Pick `.exe`, auto-fill everything, no editing | Fastest path with no confirmation form | |
| Pick `.exe`, then require a small confirmation form | Lets the user review path and define display name before saving | ✓ |
| You decide | Leave the exact flow to the agent | |

**User's choice:** Require a small confirmation form after selecting the executable
**Notes:** The user wanted a clearer, more intentional add-game flow and later asked that all further discussion happen in Portuguese.

---

## Source distinction and removal rules

| Option | Description | Selected |
|--------|-------------|----------|
| Steam/manual badge + remove only manual entries | Clear provenance and safe removal boundaries | ✓ |
| Keep stale Steam games visible when no longer detected | Preserve history of previously found Steam titles | |
| Let all sources be removable | Symmetric controls across all entries | |
| You decide | Leave the exact rules to the agent | |

**User's choice:** Keep visible provenance, remove only manual entries, and let missing Steam detections disappear on refresh
**Notes:** The user also requested a future UI detail: Steam games should show a Steam icon on the bottom-left corner of the game cover once cover art exists.

---

## Refresh and duplicate handling

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-scan on library open + manual refresh + merge duplicates by path/root | Most robust management flow for Phase 3 | ✓ |
| Manual refresh only | Avoids automatic scanning when entering the page | |
| Keep manual and Steam duplicates as separate rows | Preserves original provenance even when they point to the same install | |
| You decide | Leave the exact rules to the agent | |

**User's choice:** Accepted the recommended default
**Notes:** A manual entry that matches a Steam install should collapse into one record and be promoted to Steam origin.

---

## Agent's Discretion

- Exact route ownership split between `/library` and `/games`
- Exact styling/layout details for the compact list within the current theme
- Exact parser crate and merge heuristics for near-duplicate game names

## Deferred Ideas

- Steam icon on the bottom-left of each game cover should be implemented when cover art arrives in Phase 4, not pulled into Phase 3.
