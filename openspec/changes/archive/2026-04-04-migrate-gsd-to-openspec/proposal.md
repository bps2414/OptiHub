## Why

OptiHub already has strong planning artifacts, but the current source of truth lives in the legacy Get Shit Done structure under `.planning/`, which makes future requirement changes harder to express as capability deltas. We need a first-class OpenSpec baseline now so the team can preserve existing product knowledge, migrate phase intent into durable specs, and execute future work through change-driven artifacts instead of phase documents.

## What Changes

- Establish OpenSpec as the forward-looking planning system for OptiHub while preserving `.planning/` as historical migration input.
- Translate the current product definition, roadmap, and validated/pending requirements into baseline OpenSpec capabilities grouped by product domain.
- Add a planning governance capability that defines how roadmap state, validated work, and future changes are represented in OpenSpec.
- Document the migration boundaries so completed GSD execution history is retained, but new requirement evolution happens through OpenSpec changes.
- Prepare implementation tasks for seeding capability specs, updating repository guidance, and defining the archival/transition path for GSD artifacts.

## Capabilities

### New Capabilities
- `planning-governance`: Defines OpenSpec as the planning source of truth, how GSD artifacts are mapped or archived, and how future work is proposed and applied.
- `app-shell-ui`: Captures the desktop shell, navigation, theming, and bilingual UX requirements currently validated in Phase 1.
- `hardware-detection`: Captures diagnostics and hardware snapshot requirements currently validated in Phase 2.
- `game-library`: Captures game discovery, manual registration, library management, and game detail requirements spanning current and upcoming game-library work.
- `metadata-cache`: Captures metadata acquisition, caching, and offline availability requirements for game assets and descriptions.
- `tool-integration-deployment`: Captures tool-specific integration rules for OptiScaler, Special K, Lossless Scaling, provenance, and compliance metadata.
- `recommendation-engine`: Captures recommendation, confidence, and rationale requirements for tool selection per game.
- `preset-system`: Captures preset definition, preview, and hardware-aware adaptation requirements.
- `apply-restore`: Captures execution planning, confirmation, backup integrity, apply safety, and rollback requirements.
- `compliance-credits`: Captures third-party attribution, compliance policy, and credits/licensing requirements.

### Modified Capabilities
- None.

## Impact

- Affected planning surfaces: `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/STATE.md`, and phase artifacts that currently hold product truth.
- Affected OpenSpec surfaces: `openspec/specs/*`, `openspec/changes/*`, and repository guidance that tells contributors which planning workflow to use.
- Affected contributor workflow: future requirement changes will be proposed as OpenSpec changes instead of new GSD phase/plan documents.
