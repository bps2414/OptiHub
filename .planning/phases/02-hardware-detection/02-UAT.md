---
status: complete
phase: 02-hardware-detection
source:
  - 02-01-SUMMARY.md
  - 02-02-SUMMARY.md
started: 2026-04-03T19:06:00Z
updated: 2026-04-04T01:55:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Diagnostics Hardware Cards
expected: Diagnostics mostra quatro cards separados: CPU, GPU, Memory e Display, sem esconder secoes quando faltar dado.
result: pass

### 2. Real Hardware Values
expected: CPU, GPU e RAM mostram dados reais da maquina; Display mostra resolucao e taxa de atualizacao detectadas quando disponiveis.
result: pass
note: Corrigido apos investigacao. VRAM agora prioriza memoria dedicada via DXGI em vez de depender apenas de `Win32_VideoController.AdapterRAM`, e nomes crus/genericos de display deixaram de ser exibidos como labels amigaveis.

### 3. Manual Display Override
expected: No card Display, clicar em "Use manual override" / "Usar override manual" permite informar largura, altura e taxa de atualizacao, aplicar o override e depois voltar com "Reset to detected" / "Voltar ao detectado".
result: pass

### 4. Home Hardware Summary
expected: A Home mostra um resumo compacto com CPU, GPU, Memory e Display abaixo do card de status do backend, refletindo o override manual se ele estiver ativo.
result: pass

### 5. State Labels
expected: O card Display mostra claramente o estado como Detected / Manual override active / Unavailable (ou equivalente em PT-BR), distinguindo dado detectado, override manual e ausencia de dado.
result: pass

## Summary

total: 5
passed: 5
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

- truth: "CPU, GPU e RAM mostram dados reais da maquina; Display mostra resolucao e taxa de atualizacao detectadas quando disponiveis."
  status: resolved
  reason: "User inicialmente reportou VRAM como 4GB em vez de 8GB e labels de display cruas."
  severity: major
  test: 2
  root_cause: "O backend dependia de `Win32_VideoController.AdapterRAM`, que subestimou VRAM na AMD RX 6600, e a UI exibia `DeviceName`/nomes genericos de monitor como se fossem nomes amigaveis."
  artifacts:
    - path: "src-tauri/src/commands/hardware.rs"
      issue: "Passou a combinar WMI com DXGI para VRAM dedicada e normalizar nomes de display"
  missing: []
  debug_session: ""
