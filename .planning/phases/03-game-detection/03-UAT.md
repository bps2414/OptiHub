---
status: partial
phase: 03-game-detection
source:
  - 03-01-SUMMARY.md
  - 03-02-SUMMARY.md
started: 2026-04-04T00:00:00-03:00
updated: 2026-04-04T00:11:36.4892031-03:00
---

## Current Test

batch: retest-needed
awaiting: user retest for items 3-7 after fixes
instruction: |
  User reported issues in items 3-7. Refresh feedback and native picker flow were fixed in a follow-up patch and now need retest.

## Tests

### 1. Cold Start Smoke Test
expected: |
  Abrindo `src-tauri/target/release/optihub.exe`, o app inicializa sem crash. A shell principal renderiza normalmente, a navegação lateral aparece e a rota Library pode ser aberta sem travamentos.
result: pending
reported: "Pass"

### 2. Steam Auto-Detection
expected: |
  Na rota Library, jogos instalados via Steam aparecem automaticamente quando existem instalações detectáveis. Cada item Steam aparece na lista de gestão, com badge Steam, sem exigir capa/metadata da Fase 4.
result: pending
reported: "Pass"

### 3. Refresh Library
expected: |
  Clicar em `Refresh library` / `Atualizar biblioteca` recarrega a biblioteca sem travar o app. Se houver mudanças detectáveis na biblioteca Steam, elas aparecem após o refresh.
result: issue
reported: "Refresh Library funciona, porem sem algo visual, nao da nem pra saber se apertei o botao ou nao, nao tem loading ou validacao visual"
severity: major
fix_status: fixed-awaiting-retest

### 4. Native Manual Add Flow
expected: |
  Clicar em `Add game` / `Adicionar jogo` abre o seletor nativo de arquivo para `.exe`. Depois de escolher um executável, aparece um formulário de confirmação com o caminho do executável preenchido e um nome sugerido editável.
result: issue
reported: "Botao nao funciona, nao abre nada"
severity: blocker
fix_status: fixed-awaiting-retest

### 5. Save Manual Game
expected: |
  Salvando um jogo manual pelo formulário, a entrada aparece na Library com badge Manual, caminho de instalação visível e ação de remover disponível.
result: blocked
blocked_by: prior-phase
reason: "Nao consegui abrir de acordo com 4"
fix_status: awaiting-retest-after-picker-fix

### 6. Steam + User-Added Provenance Merge
expected: |
  Se um executável escolhido manualmente pertence a um jogo já detectado via Steam, a entrada reconciliada aparece com fonte efetiva Steam e indicação de que também foi adicionada manualmente. Nessa situação, a linha não deve mostrar ação de remover.
result: blocked
blocked_by: prior-phase
reason: "O mesmo"
fix_status: awaiting-retest-after-picker-fix

### 7. Manual Remove
expected: |
  Remover uma entrada manual apaga essa linha da Library após o refresh. Entradas Steam puras continuam sem botão de remover.
result: blocked
blocked_by: prior-phase
reason: "O mesmo"
fix_status: awaiting-retest-after-picker-fix

### 8. Games Page Handoff
expected: |
  A rota Games continua leve na Fase 3 e orienta o usuário a usar a Library como fluxo principal de gestão, sem prometer capa, metadata ou detalhes ricos da Fase 4.
result: pass
reported: "Correto"

## Summary

total: 8
passed: 3
issues: 2
pending: 0
skipped: 0
blocked: 3

## Gaps

- truth: "Clicar em `Refresh library` / `Atualizar biblioteca` recarrega a biblioteca sem travar o app e fornece feedback visual claro durante a ação."
  status: fixed-awaiting-retest
  reason: "User reported missing loading / validation feedback on refresh. Follow-up fix adds visible refresh state in LibraryPage."
  severity: major
  test: 3
  artifacts:
    - src/pages/LibraryPage.tsx
    - src/stores/games.ts
    - src/i18n/messages.ts
    - src/pages/LibraryPage.test.tsx
  missing:
    - Visible loading / action feedback for refresh

- truth: "Clicar em `Add game` / `Adicionar jogo` abre o seletor nativo de `.exe`."
  status: fixed-awaiting-retest
  reason: "User reported the add-game button did not open anything. Follow-up fix adds Tauri dialog capability permission plus explicit picker error handling."
  severity: blocker
  test: 4
  artifacts:
    - src-tauri/capabilities/default.json
    - src/stores/games.ts
    - src/lib/dialog.ts
    - src/i18n/messages.ts
  missing:
    - Dialog capability permission
    - Non-silent picker failure handling
