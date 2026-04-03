# OptiHub 🎮

> Hub desktop offline-first para otimização de jogos de PC — tudo em um lugar, com segurança e controle total.

![Versão](https://img.shields.io/badge/versão-0.1.0-blue)
![Plataforma](https://img.shields.io/badge/plataforma-Windows-blue)
![Licença](https://img.shields.io/badge/licença-MIT-green)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-orange)

**[🇺🇸 Read in English](README.md)**

---

## O que é o OptiHub?

O universo de otimização de jogos de PC está fragmentado. Para deixar um jogo rodando no seu melhor, você precisa conhecer e configurar manualmente ferramentas como **OptiScaler**, **Special K** e **Lossless Scaling** — cada uma com sua própria documentação, riscos e processo de instalação. Isso é barreira demais para a maioria dos jogadores.

**O OptiHub resolve isso.**

Ele detecta seus jogos instalados e o hardware do seu PC, recomenda a melhor ferramenta de otimização para cada jogo, oferece presets prontos (Qualidade / Balanceado / Performance) e aplica as configurações com sua confirmação explícita — com backup automático de tudo, para você poder desfazer a qualquer momento.

> **Pense no OptiHub como um gerenciador de pacotes para otimizações de jogos.**

---

## Por que preciso disso?

Sem o OptiHub, o fluxo típico de um jogador que quer otimizar um jogo é:

1. Pesquisar no Google qual ferramenta usar para aquele jogo específico
2. Encontrar o fórum ou guia certo (muitas vezes em inglês)
3. Baixar a ferramenta da fonte correta (várias são redistribuídas ilegitimamente)
4. Seguir um tutorial de instalação manual
5. Configurar manualmente parâmetros técnicos (DLSS, FSR, frame gen, etc.)
6. Torcer para não ter quebrado nada
7. Não ter nenhuma forma prática de reverter caso dê errado

Com o OptiHub, isso vira um fluxo guiado de 3 cliques.

---

## Funcionalidades (Roadmap do MVP)

### ✅ Detecção automática de jogos
- Lê a biblioteca do Steam via registro do Windows e arquivos VDF/ACF
- Suporte a registro manual de jogos fora da Steam (executável customizado)
- Distinção visual entre jogos detectados automaticamente e adicionados manualmente

### ✅ Perfil de hardware
- Detecta CPU (modelo, núcleos, threads)
- Detecta GPU (modelo, fabricante — NVIDIA/AMD/Intel) e VRAM
- Detecta RAM total do sistema
- Detecta resolução e taxa de atualização dos monitores (com fallback manual)
- Painel de diagnóstico com resumo completo do sistema

### ✅ Detecção de ferramentas de otimização
Detecta instalações existentes de:

| Ferramenta | Descrição | Detecção |
|-----------|-----------|---------|
| **OptiScaler** | Upscaling DLSS/FSR/XeSS universal | Arquivo local |
| **Special K** | Framework avançado de modding em jogos | Arquivo local |
| **Lossless Scaling** | Frame generation e upscaling via Steam | Steam App ID 993090 |

> ⚠️ O OptiHub **nunca redistribui** essas ferramentas. Apenas detecta instalações existentes e aponta para as fontes oficiais.

### ✅ Motor de recomendações
- Mapeia jogo + hardware + ferramentas disponíveis → recomendação com explicação em linguagem simples
- Classifica cada recomendação por nível de risco:
  - 🟢 **Seguro** — amplamente testado, sem riscos conhecidos
  - 🟡 **Limitado** — funciona com ressalvas ou em jogos específicos
  - 🔴 **Experimental** — pode causar instabilidade, use por sua conta e risco

### ✅ Sistema de presets
Três presets prontos por jogo:

| Preset | Objetivo |
|--------|---------|
| **Qualidade** | Máxima fidelidade visual, FPS estável |
| **Balanceado** | Equilíbrio entre visual e performance |
| **Performance** | Máximo FPS, visual reduzido |

Os parâmetros de cada preset se adaptam automaticamente ao hardware detectado.

### ✅ Aplicação segura com backup e reversão
- **Pré-visualização** do que será modificado antes de aplicar
- **Confirmação explícita** do usuário obrigatória — nada é feito sem você autorizar
- **Backup automático** de todos os arquivos originais com verificação SHA-256
- **Histórico completo** de otimizações aplicadas
- **Rollback total** — desfaça qualquer mudança a qualquer momento, mesmo meses depois

---

### Shell desktop premium
- Tema dark premium com barra lateral fixa e todos os destinos principais do app
- Shell bilingue com suporte a English + Português (Brasil), preferencia persistida e fallback por locale
- Card de saude do backend na Home validando a comunicacao React <-> Rust
- Pagina inicial de Creditos & Licencas preparada desde o comeco do produto

---

## O que o OptiHub *não* vai fazer

Por design e por princípio, o OptiHub **nunca irá**:

- ❌ Modificar drivers ou fazer alterações em nível de kernel
- ❌ Redistribuir ferramentas de terceiros
- ❌ Coletar dados de uso ou telemetria
- ❌ Aplicar qualquer mudança sem sua confirmação explícita
- ❌ Focar em jogos online competitivos (risco de ban)
- ❌ Suportar bypass de anti-cheat

---

## Tecnologia

O OptiHub é construído com tecnologias modernas escolhidas para máxima performance, segurança e experiência premium no Windows.

### Visão geral da arquitetura

```
┌──────────────────────────────────────┐
│           Frontend (React)            │
│   React 19 + TypeScript + Tailwind    │
│          Vite + Zustand               │
└──────────────┬───────────────────────┘
               │  IPC (invoke commands)
┌──────────────▼───────────────────────┐
│           Backend (Rust)              │
│            Tauri 2.x                  │
│  sysinfo · wmi · winreg · rusqlite   │
│         tokio · serde_json            │
└──────────────────────────────────────┘
               │
┌──────────────▼───────────────────────┐
│           Sistema Windows             │
│  Registro · Sistema de Arquivos      │
│  WMI · Steam Library · Ferramentas  │
└──────────────────────────────────────┘
```

**Por que Tauri e não Electron?**
Tauri usa o WebView2 nativo do Windows em vez de um Chromium embutido, resultando em binários **~10x menores** e consumo de memória significativamente menor.

### Stack completa

| Camada | Tecnologia |
|--------|-----------|
| Interface | React 19 + TypeScript 5 + Tailwind CSS 4 |
| Shell desktop | Tauri 2 (backend Rust) |
| Gerenciamento de estado | Zustand 5 |
| Navegação | React Router 7 |
| Ícones | Lucide React |
| Build | Vite 6 + pnpm 9 |
| Banco de dados local | SQLite via rusqlite |
| Hardware (CPU/RAM) | crate sysinfo |
| Hardware (GPU/VRAM) | crate wmi (Win32) |
| Registro do Windows | crate winreg |
| Async | Tokio 1.x |
| Serialização | serde + serde_json |

---

## Roadmap de desenvolvimento

O MVP é construído em 9 fases em ordem de dependência:

```
Fase 1: Foundation & App Shell          → UI base, temas, navegação, IPC
Fase 2: Detecção de Hardware            → CPU, GPU, RAM, monitores
Fase 3: Detecção de Jogos              → Steam, VDF/ACF, registro manual
Fase 4: UI da Biblioteca & Metadados   → Grid/lista, capa, detalhes
Fase 5: Detecção de Ferramentas        → OptiScaler, Special K, LS
Fase 6: Motor de Recomendações         → Regras, risco, explicações
Fase 7: Sistema de Presets             → Q/B/P com adaptação por hardware
Fase 8: Aplicar & Restaurar           → Backup, execução, rollback
Fase 9: Compliance & Polish            → Créditos, licenças, UX final
```

| Fase | Status |
|------|--------|
| 1. Foundation & App Shell | ✅ Completa |
| 2. Detecção de Hardware | ⏳ Planejada |
| 3. Detecção de Jogos | ⏳ Planejada |
| 4. UI da Biblioteca | ⏳ Planejada |
| 5. Detecção de Ferramentas | ⏳ Planejada |
| 6. Motor de Recomendações | ⏳ Planejada |
| 7. Sistema de Presets | ⏳ Planejada |
| 8. Aplicar & Restaurar | ⏳ Planejada |
| 9. Compliance & Polish | ⏳ Planejada |

Status atual: Fase 1 concluida, incluindo a base bilingue do shell (English + Portugues do Brasil). Proxima etapa: Fase 2 - Deteccao de Hardware.

---

## Como rodar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+ — `npm install -g pnpm`
- [Rust](https://rustup.rs/) (toolchain stable)
- [Pré-requisitos do Tauri para Windows](https://tauri.app/start/prerequisites/) (WebView2 + Build Tools)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/bps2414/OptiHub.git
cd OptiHub

# Instale as dependências
pnpm install
```

### Desenvolvimento

```bash
# Inicia o app em modo desenvolvimento (hot reload)
pnpm tauri dev
```

### Build de produção

```bash
# Gera o instalador .msi/.exe para Windows
pnpm tauri build
```

---

## Princípios do projeto

1. **Segurança primeiro** — toda modificação tem backup, toda ação precisa de confirmação
2. **Controle total do usuário** — nada acontece sem sua autorização explícita
3. **Offline-first** — todas as funcionalidades principais funcionam sem internet
4. **Transparência** — cada recomendação tem uma explicação, cada ferramenta tem sua fonte oficial
5. **Compliance** — todas as ferramentas integradas têm licença documentada; nenhuma é redistribuída sem autorização

---

## Licença

MIT — veja [LICENSE](LICENSE) para detalhes.

---

*OptiHub está em desenvolvimento ativo. Contribuições e feedbacks são bem-vindos.*
