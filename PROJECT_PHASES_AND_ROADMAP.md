# Fases e Roadmap do OptiHub

> **⚠️ DIRECÃO REVISADA (pós-Fase 3):** O produto não é mais apenas um hub de ferramentas.
> O OptiHub agora é um **orquestrador guiado de otimização** que combina config nativa de jogos,
> ferramentas externas, conhecimento curado e rollback seguro.
> Fase 10 (Game Config Profiles & Safe Apply) é MVP-extended, não pós-MVP.
> Leia `docs/optihub_mvp_revised_vision.md` e `docs/optihub_roadmap_addendum.md` antes de planejar.


## Timeline das Fases

- [FATO] Fase 1 - Foundation & App Shell: concluida no codigo.
- [FATO] Fase 2 - Hardware Detection: concluida no codigo.
- [FATO] Fase 3 - Game Detection: concluida no codigo, com gap closure para manter Steam/manual separados.
- [FATO] Fase 4 - Game Library UI & Metadata: implementada/refinada no codigo, embora docs legadas ainda a tratem como "nao iniciada".
- [FATO] Fase 5 - Tool Integration & Deployment Management: unica change ativa; planejamento detalhado pronto, implementacao nao iniciada.
- [FATO] Fase 6 - Recommendation Engine: futura.
- [FATO] Fase 7 - Preset System: futura.
- [FATO] Fase 8 - Apply & Restore: futura.
- [FATO] Fase 9 - Compliance, Credits & Polish: futura.
- [FATO] Meta-work fora do roadmap principal: migracao GSD -> OpenSpec e cleanup de repositorio concluidos e arquivados.

## Tabela de Fases

| Fase | Objetivo | Status | Evidencia | Proxima dependencia |
| --- | --- | --- | --- | --- |
| Fase 1 | Scaffold Tauri + React, shell premium, rotas, IPC, i18n | Concluida | `src/App.tsx`, `src/components/Sidebar.tsx`, `src-tauri/src/commands/system.rs`, `.planning/phases/01-foundation-app-shell/01-01-PLAN.md`, `.agent/CONTINUITY.md` | Base para Fase 2 e 3 |
| Fase 2 | Snapshot de hardware e UI de diagnostico | Concluida | `src-tauri/src/commands/hardware.rs`, `src/pages/DiagnosticsPage.tsx`, `src/stores/hardware.ts`, `.planning/phases/02-hardware-detection/02-01-PLAN.md` | Entrada para Fase 6 |
| Fase 3 | Steam scan, add/remove manual, refresh, biblioteca base | Concluida | `src-tauri/src/commands/games.rs`, `src/pages/LibraryPage.tsx`, `.planning/phases/03-game-detection/03-01-PLAN.md`, `.planning/phases/03-game-detection/03-03-PLAN.md`, `.planning/phases/03-game-detection/03-UAT.md` | Base para Fase 4 e 5 |
| Fase 4 | Biblioteca rica, detalhe, metadata/cache/capas | Concluida no codigo; docs legadas desatualizadas | `src/pages/LibraryPage.tsx`, `src/components/games/GameDetailView.tsx`, `src-tauri/src/game_metadata.rs`, `openspec/changes/archive/2026-04-04-phase-4-game-library-ui-metadata/`, `openspec/changes/archive/2026-04-04-refine-library-artwork-and-detail-flow/`, `.planning/ROADMAP.md` | Nenhuma direta; melhora UX e prepara fases seguintes |
| Fase 5 | Tools reais: OptiScaler, Special K, Lossless Scaling, proveniencia e deployment state | Em planejamento ativo | `openspec/changes/phase-5-tool-integration-deployment/proposal.md`, `design.md`, `tasks.md`, `specs/*`, `src/pages/ToolsPage.tsx`, `src-tauri/src/lib.rs` | Necessaria para Fase 6 |
| Fase 6 | Recommendation engine com risco/confianca e explicacao | Futura | `openspec/specs/recommendation-engine/spec.md`, `.planning/ROADMAP.md` | Depende das fases 2, 3 e 5 |
| Fase 7 | Presets Q/B/P com preview e adaptacao por hardware | Futura | `openspec/specs/preset-system/spec.md`, `src/pages/PresetsPage.tsx`, `.planning/ROADMAP.md` | Depende da Fase 6 |
| Fase 8 | Apply/restore com backup-before-write, execution plan e history | Futura | `openspec/specs/apply-restore/spec.md`, `.planning/ROADMAP.md` | Depende da Fase 7 |
| Fase 9 | Credits/licencas, compliance e polish final | Futura | `openspec/specs/compliance-credits/spec.md`, `src/pages/CreditsPage.tsx`, `.planning/ROADMAP.md` | Depende da Fase 8 |

## Comparacao Entre Plano Legado e Estado Atual

- [FATO] `.planning/ROADMAP.md` ainda marca Fase 4 como `0/2` plans e `Not started`, mas o codigo atual ja implementa a Library rica e a metadata cacheada. Evidencias: `.planning/ROADMAP.md`, `src/pages/LibraryPage.tsx`, `src-tauri/src/game_metadata.rs`.
- [FATO] `README.md` ainda diz "Phase 03 complete, next up Phase 04". Evidencias: `README.md`, `src/pages/LibraryPage.tsx`.
- [FATO] `README.pt-BR.md` vai alem e descreve como presentes varias capacidades ainda futuras. Evidencias: `README.pt-BR.md`, `src/pages/ToolsPage.tsx`, `src/pages/PresetsPage.tsx`, `src-tauri/src/lib.rs`.
- [FATO] O OpenSpec e a superficie ativa e hoje aponta claramente para Fase 5 como change atual. Evidencias: `openspec/README.md`, `openspec list --json`.

## Roadmap Resumido

- [FATO] Proximo bloco real: Fase 5 com registry de tools, schema SQLite para `tool_sources` e `tool_deployments`, UI de `Tools`, e resumo de deployment por jogo. Evidencias: `openspec/changes/phase-5-tool-integration-deployment/tasks.md`, `openspec/changes/phase-5-tool-integration-deployment/specs/*`.
- [FATO] Depois disso, a sequencia prevista continua: recomendacoes -> presets -> apply/restore -> compliance/polish. Evidencias: `.planning/ROADMAP.md`, `openspec/specs/recommendation-engine/spec.md`, `openspec/specs/preset-system/spec.md`, `openspec/specs/apply-restore/spec.md`, `openspec/specs/compliance-credits/spec.md`.
- [INFERENCIA] O roadmap pratico de curtissimo prazo nao e "fazer Fase 4", e sim consolidar o estado local da Fase 4/refinacao e iniciar Fase 5.

## O Que Falta Para V1

- [FATO] Pela definicao historica do MVP, ainda faltam as Fases 5, 6, 7, 8 e 9. Evidencias: `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`.
- [FATO] Em termos concretos no codigo, faltam:
  - tools management real;
  - recommendation engine;
  - presets aplicaveis;
  - apply/restore com backup;
  - credits/compliance completos.
  Evidencias: `src/pages/ToolsPage.tsx`, `src/pages/OptimizationsPage.tsx`, `src/pages/PresetsPage.tsx`, `src/pages/CreditsPage.tsx`, `src-tauri/src/lib.rs`, `openspec/specs/*`.
- [INFERENCIA] Para V1 "operavel por outro LLM", tambem falta alinhar a documentacao publica com o estado real do codigo, senao o entendimento do roadmap fica enviesado.
