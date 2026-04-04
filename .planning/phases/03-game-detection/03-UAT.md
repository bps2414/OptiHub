---
status: complete
phase: 03-game-detection
source:
  - 03-01-SUMMARY.md
  - 03-02-SUMMARY.md
started: 2026-04-04T00:00:00-03:00
updated: 2026-04-04T00:20:00-03:00
---

## Current Test

batch: complete
awaiting: none
instruction: |
  Retest completed. One architecture/product gap remains open from item 6.

## Tests

### 1. Cold Start Smoke Test
expected: |
  Abrindo `src-tauri/target/release/optihub.exe`, o app inicializa sem crash. A shell principal renderiza normalmente, a navegação lateral aparece e a rota Library pode ser aberta sem travamentos.
result: pass
reported: "Pass"

### 2. Steam Auto-Detection
expected: |
  Na rota Library, jogos instalados via Steam aparecem automaticamente quando existem instalações detectáveis. Cada item Steam aparece na lista de gestão, com badge Steam, sem exigir capa/metadata da Fase 4.
result: pass
reported: "Pass"

### 3. Refresh Library
expected: |
  Clicar em `Refresh library` / `Atualizar biblioteca` recarrega a biblioteca sem travar o app. Se houver mudanças detectáveis na biblioteca Steam, elas aparecem após o refresh.
result: pass
reported: "Passou"
previous_issue: "Refresh Library funciona, porem sem algo visual, nao da nem pra saber se apertei o botao ou nao, nao tem loading ou validacao visual"
fix_status: fixed-and-validated
note: "Usuário ainda percebe o refresh como um flash visual rápido/esquisito, mas validou o comportamento funcional."

### 4. Native Manual Add Flow
expected: |
  Clicar em `Add game` / `Adicionar jogo` abre o seletor nativo de arquivo para `.exe`. Depois de escolher um executável, aparece um formulário de confirmação com o caminho do executável preenchido e um nome sugerido editável.
result: pass
reported: "Pass"
previous_issue: "Botao nao funciona, nao abre nada"
fix_status: fixed-and-validated

### 5. Save Manual Game
expected: |
  Salvando um jogo manual pelo formulário, a entrada aparece na Library com badge Manual, caminho de instalação visível e ação de remover disponível.
result: pass
reported: "pass"
previous_blocked_by: prior-phase
previous_reason: "Nao consegui abrir de acordo com 4"
fix_status: fixed-and-validated

### 6. Steam + User-Added Provenance Merge
expected: |
  Se um executável escolhido manualmente pertence a um jogo já detectado via Steam, a entrada reconciliada aparece com fonte efetiva Steam e indicação de que também foi adicionada manualmente. Nessa situação, a linha não deve mostrar ação de remover.
result: issue
reported: "Nao, e pessoalmente eu acho que deve ser separado isso, o manual nao afeta o steam e vice versa"
severity: major
fix_status: open-gap

### 7. Manual Remove
expected: |
  Remover uma entrada manual apaga essa linha da Library após o refresh. Entradas Steam puras continuam sem botão de remover.
result: pass
reported: "Correto"
previous_blocked_by: prior-phase
previous_reason: "O mesmo"
fix_status: fixed-and-validated

### 8. Games Page Handoff
expected: |
  A rota Games continua leve na Fase 3 e orienta o usuário a usar a Library como fluxo principal de gestão, sem prometer capa, metadata ou detalhes ricos da Fase 4.
result: pass
reported: "Correto"

## Summary

total: 8
passed: 7
issues: 1
pending: 0
skipped: 0
blocked: 0

## Gaps

- truth: "Adicionar manualmente um jogo que também existe na Steam não deve alterar a representação do item Steam, e vice-versa; as duas proveniências devem permanecer separadas."
  status: fixed-awaiting-retest
  reason: "User reported: Nao, e pessoalmente eu acho que deve ser separado isso, o manual nao afeta o steam e vice versa"
  severity: major
  test: 6
  plan: 03-03-PLAN.md
  artifacts:
    - src-tauri/src/commands/games.rs
    - src/stores/games.ts
    - src/components/games/GameLibraryTable.tsx
    - src/pages/LibraryPage.tsx
  missing:
    - Separate lifecycle for manual and Steam entries
    - UI model that keeps manual and Steam independent instead of reconciling into one effective row
