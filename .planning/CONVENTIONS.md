# Conventions: OptiHub

## README Sync Policy

OptiHub mantém dois READMEs públicos no repositório:

- `README.md` — versão em inglês (padrão do GitHub)
- `README.pt-BR.md` — versão em português brasileiro (mais detalhada)

### Regra: READMEs são artefatos vivos

**Os READMEs devem estar sempre em sincronia com o estado real do projeto.**  
Não são documentos estáticos criados uma vez — precisam evoluir junto com cada fase entregue.

---

### Quando atualizar os READMEs

| Gatilho | O que atualizar |
|---------|----------------|
| Fase concluída | Tabela de status no roadmap dos READMEs |
| Nova feature entregue | Seção de funcionalidades (se a feature é nova para o usuário final) |
| Decisão técnica revisada | Seção de stack / arquitetura |
| Constraint adicionada ou removida | Seção de "O que o OptiHub não vai fazer" / constraints |
| Mudança no processo de setup | Seção "Como rodar localmente" |
| Mudança de status do projeto | Badge de status no topo |

---

### Como atualizar (passo a passo para agentes)

Ao concluir qualquer fase via `/gsd-execute-phase` ou `/gsd-quick`:

**1. Verificar o que está desatualizado**

Compare o estado atual do ROADMAP.md com o que está nos READMEs. Especificamente:

- A tabela de progresso das fases nos READMEs reflete o ROADMAP.md?
- Novas funcionalidades entregues estão descritas nas seções de features?
- O badge de `status` ainda é correto?

**2. Atualizar `README.md` (inglês)**

Seção a atualizar: a tabela de status em `## Features (Roadmap)`.

Mapeamento de status:

| Estado no ROADMAP.md | Badge no README |
|---------------------|----------------|
| `[ ]` (não iniciado) | `⏳ Planned` |
| Em execução (STATE.md mostra fase ativa) | `🔄 In progress` |
| `[x]` (concluído) | `✅ Complete` |

**3. Atualizar `README.pt-BR.md` (português)**

Mesmas seções do README.md, mas na tabela de status da seção `## Roadmap de desenvolvimento`.

**4. Commit das mudanças**

```bash
git add README.md README.pt-BR.md
git commit -m "docs: sync READMEs with phase {N} completion"
git push origin master
```

---

### Checklist rápido por fase

Ao encerrar uma fase, o agente executor **DEVE** verificar:

- [ ] `README.md` — tabela de fases atualizada com o novo status
- [ ] `README.pt-BR.md` — tabela de fases atualizada com o novo status
- [ ] Badge `status` no topo ainda reflete a realidade (in development → beta → stable)
- [ ] Se a fase entregou funcionalidade nova ao usuário final, a seção de features foi expandida?
- [ ] Commit feito com mensagem `docs: sync READMEs with phase {N} completion`
- [ ] Push feito para o GitHub

---

### O que NÃO fazer

- ❌ Não reescrever o README inteiro a cada fase — faça edições cirúrgicas
- ❌ Não mover features do roadmap para "concluídas" antes da fase realmente verificar
- ❌ Não remover a seção "O que o OptiHub não vai fazer" — ela é intencionalmente permanente
- ❌ Não mudar o badge para `stable` até o MVP (Fase 9) estar completo e verificado

---

### Estado atual dos READMEs

*Atualizado em: 2026-04-03*  
*Fase atual: 01 — Foundation & App Shell (em progresso)*

Os READMEs devem refletir exatamente este estado até mudanças forem entregues.
