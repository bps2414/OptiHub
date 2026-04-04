# Phase 5: Tool Integration & Deployment Management - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-03T23:26:30-03:00
**Phase:** 05-tool-integration-deployment-management
**Areas discussed:** integration model segmentation, source/acquisition policy, deployment/channel visibility, compliance surface, phase boundary with Phase 3

---

## Integration Model Segmentation

| Option | Description | Selected |
|--------|-------------|----------|
| Generic installed/missing model | Treat every tool as a flat installed/not-installed record | |
| Tool-specific integration models | Model OptiScaler per game, Special K globally, and Lossless Scaling as licensed Steam-only detection | ✓ |
| Defer the mismatch | Keep Phase 5 generic now and sort it out later in planning/execution | |

**User's choice:** Tool-specific integration models
**Notes:** The user explicitly rejected the generic "tool installed / missing" framing and asked to keep Phase 3 unchanged while reshaping Phase 5 around the real workflows of each tool.

---

## Source And Acquisition Policy

| Option | Description | Selected |
|--------|-------------|----------|
| Bundle when possible | Let OptiHub ship tool payloads whenever licensing seems permissive | |
| Official source plus user-supplied local sources | Prefer official acquisition channels and allow explicit local archive/path registration | ✓ |
| Any reachable mirror | Accept unofficial mirrors as a practical fallback | |

**User's choice:** Official source plus user-supplied local sources
**Notes:** The user required no piracy, no illegal redistribution, no bundling of proprietary software, and no unofficial mirrors by default.

---

## Deployment And Channel Visibility

| Option | Description | Selected |
|--------|-------------|----------|
| Installed/missing only | Show only global availability status | |
| Deployment-aware visibility | Show global install state, local source state, per-game deployment state, and release channel/build where relevant | ✓ |
| Hide channel/build for now | Track deeper state internally but do not expose it in the UI | |

**User's choice:** Deployment-aware visibility
**Notes:** OptiScaler must show whether it is already deployed per game and which build/channel is deployed. Special K should expose stable plus officially supported experimental/update channels where relevant.

---

## Compliance Surface

| Option | Description | Selected |
|--------|-------------|----------|
| Phase 9 only | Keep all credits/compliance/source details out of Phase 5 | |
| Lightweight in Phase 5, full detail in Phase 9 | Surface provenance/compliance metadata in Tools, then deepen the dedicated Credits/Licenses experience later | ✓ |
| Hidden metadata | Keep provenance/compliance mostly internal | |

**User's choice:** Lightweight in Phase 5, full detail in Phase 9
**Notes:** The user required every third-party tool to show credits, source, version, license/compliance notes, and channel where relevant, while still keeping the dedicated compliance screen as its own later phase.

---

## Phase Boundary With Phase 3

| Option | Description | Selected |
|--------|-------------|----------|
| Move game/tool state into Phase 3 | Expand Phase 3 to own tool-specific deployment awareness | |
| Keep Phase 3 intact and let Phase 5 consume it | Preserve game detection/library management in Phase 3 and use those records for Phase 5 per-game deployment visibility | ✓ |
| Merge phases later | Leave ownership ambiguous for now | |

**User's choice:** Keep Phase 3 intact and let Phase 5 consume it
**Notes:** The user explicitly said not to change Phase 3. Phase 5 should depend on the game library, not redefine it.

---

## Agent's Discretion

- Exact internal schema for tool records, source records, and per-game deployment records
- Exact detection heuristics for mapping deployed files back to an upstream build/channel
- Whether optional manual Lossless Scaling path support is worthwhile in Phase 5, under the strict local licensed-only rule

## Deferred Ideas

- Actual deployment/copy/remove/rollback mechanics remain Phase 8 work
- Full Credits & Licenses information architecture remains Phase 9 work
