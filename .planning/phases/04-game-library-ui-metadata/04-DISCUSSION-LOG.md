# Phase 4: Game Library UI & Metadata - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-04-04
**Phase:** 04-game-library-ui-metadata
**Areas discussed:** route responsibilities, library visual model, game detail scope, metadata cache behavior, search/filtering, Steam/manual metadata relationship

---

## Route Responsibilities

| Option | Description | Selected |
|--------|-------------|----------|
| `Library` = coleção visual, `Games` = detalhe | Keep `/library` as the rich browser and turn `/games` into the detail surface | ✓ |
| `Library` = gestão, `Games` = coleção visual + detalhe | Move the richer browsing experience out of the current Library route | |
| Outro | Freeform route split | |

**User's choice:** `Library` should become the rich collection view and `Games` should become the detail page.
**Notes:** This preserves the existing route map while giving the current placeholder route a clear purpose.

---

## Library Visual Model

| Option | Description | Selected |
|--------|-------------|----------|
| Grid com capas como padrão, com toggle para lista | Cover-first library as default, with list as an alternate mode | ✓ |
| Lista rica como padrão, com toggle para grid | Rich list-first browsing | |
| Só grid nesta fase | No list fallback in Phase 4 | |
| Outro | Freeform visual direction | |

**User's choice:** Default to a cover-first grid with a list toggle.
**Notes:** This is the main visual upgrade from the Phase 3 management table.

---

## Card Content

| Option | Description | Selected |
|--------|-------------|----------|
| Capa + nome + origem + plataforma | Keep cards focused and push deeper data into the detail page | ✓ |
| Capa + nome + origem + tamanho instalado | Surface install size in the browsing card | |
| Capa + nome + descrição curta + origem | Emphasize summary copy on the card | |
| Outro | Freeform card payload | |

**User's choice:** Cards should show cover art, name, source, and platform.
**Notes:** This intentionally avoids overloading the browse surface.

---

## Game Detail Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Hero com capa, descrição, path, tamanho, plataforma, origem e cache status | Balanced detail page with identity plus install/context data | ✓ |
| Igual ao A, mas sem descrição longa | Lighter detail page | |
| Detalhe mais denso com tudo que existir de metadata | Maximal metadata dump in Phase 4 | |
| Outro | Freeform detail design | |

**User's choice:** Include hero presentation plus description, install path, install size, platform, provenance, and cache status.
**Notes:** This makes the detail page the main metadata surface.

---

## Metadata Cache Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Cache-first com refresh manual opcional | Always rely on cache unless the user explicitly refreshes | |
| Cache-first com refresh automático silencioso quando houver rede | Use cache as the base and silently improve it in the background | ✓ |
| Buscar online só quando o usuário abrir o detalhe | Defer enrichment until a detail page is opened | |
| Outro | Freeform metadata behavior | |

**User's choice:** Cache-first with silent background refresh when the network is available.
**Notes:** Offline behavior stays reliable while metadata freshness can improve without extra clicks.

---

## Search, Filters, And Sorting

| Option | Description | Selected |
|--------|-------------|----------|
| Busca por nome + filtro Steam/Manual + filtro com/sem metadata | Search plus provenance and metadata-presence facets | |
| Só busca por nome nesta fase | Minimal discovery controls | |
| Busca por nome + origem + ordenação | Search plus provenance filter and sorting controls | ✓ |
| Outro | Freeform control set | |

**User's choice:** Include search by name, source filtering, and ordering controls.
**Notes:** Metadata-presence filters were not prioritized for the first Phase 4 pass.

---

## Steam And Manual Metadata Relationship

| Option | Description | Selected |
|--------|-------------|----------|
| Continuam como entradas separadas, mas podem compartilhar metadata/capa relacionada | Separate library entries, shared enrichment allowed | ✓ |
| Continuam separadas e cada uma resolve metadata isoladamente | Full metadata separation between equivalent entries | |
| Outro | Freeform provenance/metadata relationship | |

**User's choice:** Steam and Manual entries remain separate, but related entries may share metadata and cover art.
**Notes:** This aligns with the latest accepted product direction from the Phase 3 UAT gap.

---

## Agent's Discretion

- Exact detail-route URL strategy
- Exact list-density and sorting menu shape
- Exact metadata-cache freshness rules and fallback timing

## Deferred Ideas

- Metadata-presence filters can wait behind search/source/sort
- Recommendations, presets, and tool-state overlays remain out of scope for Phase 4
