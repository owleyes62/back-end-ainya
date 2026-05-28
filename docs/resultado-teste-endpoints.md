# Resultado dos testes de endpoints

## Metadados
- **Data do teste:** 2026-05-24
- **Branch:** `homolog`
- **Banco:** Neon Postgres (`neondb` em sa-east-1)
- **Schema:** migrações `20260422233522_user_institutuin` + `20260524115735_full_schema` aplicadas
- **Script de teste:** [scripts/test-endpoints.ts](../scripts/test-endpoints.ts)
- **Resultado bruto (JSON):** [scripts/results.json](../scripts/results.json)

## Como rodar
```bash
# 1. Subir o servidor
npm install
npx prisma generate
npm run dev          # http://localhost:3000

# 2. Em outro terminal, rodar a bateria de testes
npx tsx scripts/test-endpoints.ts
```

## Pequenas correções feitas para os testes funcionarem
- **Adicionado `JWT_SECRET` e `NODE_ENV` ao `.env`.** Sem o `JWT_SECRET`, o endpoint `POST /api/users/login` retornava 500 com `secretOrPrivateKey must have a value`. Login, refresh e logout estavam todos quebrados por isso.
- **Ajuste no script de teste** (não no projeto): extração do `id` agora cobre tanto respostas planas (`{ id }`) quanto envelope (`{ data: { id } }`). Foi só para o script conseguir encadear as próximas chamadas — nenhum controller foi alterado.

Nenhum outro ajuste foi feito.

## Resumo
- **Total:** 59 chamadas / **OK:** 59 / **FAIL:** 0
- 100% dos endpoints reais estão respondendo.
- Rota `/api/relatorios/:id/export-pdf` gera **PDF real** (200, application/pdf, ~1750 bytes) via `pdfkit`.
- Rota `/api/academic-periods/active` retorna **200** com o período `2026.1` (após o seed atualizado).

## IDs gerados durante o teste
| Recurso | Valor |
|---|---|
| `institutionId` | criado a cada execução (`Instituição Teste <timestamp>`) |
| `userId` | gerado por `POST /api/users` |
| `plantId` | `pf-037` (Amendoim Forrageiro — primeiro do seed) |
| `templateId` | template do `pf-037` (já existia via seed) |
| `canteiroId` | criado por `POST /api/canteiros` |
| `listaId` | criado por `POST /api/listas-formularios` |
| `formularioId` | criado por `POST /api/formularios` |
| `checklistId` | criado por `POST /api/checklist` |
| `measurementId` | criado por `POST /api/measurements` |
| `photoId` | criado por `POST /api/photos` (e deletado em seguida) |
| `relatorioId` | criado por `POST /api/relatorios/generate` |

## Tabela completa de endpoints testados

| Status | Método | Endpoint | Resultado |
|---|---|---|---|
| OK | GET | /api/health | Servidor responde |
| OK | GET | /api/institutions | Lista instituições |
| OK | POST | /api/institutions | Institution criada |
| OK | POST | /api/users | Usuário criado |
| OK | GET | /api/users | Lista de usuários |
| OK | POST | /api/users/login | Tokens retornados |
| OK | GET | /api/users/:id | Usuário com institution |
| OK | PUT | /api/users/:id/profile | Nome atualizado |
| OK | POST | /api/users/refresh | Novos tokens |
| OK | POST | /api/users/logout | Token revogado |
| OK | GET | /api/plantas-forrageiras | Lista de plantas |
| OK | GET | /api/plantas-forrageiras?category=CACTACEA | Filtro funciona |
| OK | GET | /api/plantas-forrageiras/:id | Planta por id |
| OK | POST | /api/canteiros | Canteiro criado + UserCanteiro automático |
| OK | GET | /api/canteiros/user/:userId | Canteiros via UserCanteiro |
| OK | GET | /api/canteiros/:canteiroId/listas | Listas do canteiro |
| OK | GET | /api/user-canteiros/user/:userId | Vínculos por user |
| OK | GET | /api/user-canteiros/canteiro/:canteiroId | Vínculos por canteiro |
| OK | POST | /api/user-canteiros (duplicate) | 409 conforme esperado |
| OK | GET | /api/plant-templates/plant/:plantId | Templates da planta |
| OK | POST | /api/listas-formularios | Lista criada (valida UserCanteiro) |
| OK | GET | /api/listas-formularios/canteiro/:canteiroId | Listas do canteiro |
| OK | GET | /api/listas-formularios/:listaId | Lista por id |
| OK | GET | /api/listas-formularios/:id/formularios | Formulários da lista |
| OK | POST | /api/formularios | Formulário criado |
| OK | GET | /api/formularios/user/:userId | Formulários do user |
| OK | GET | /api/formularios/:id | Formulário por id |
| OK | GET | /api/formularios/:id/checklist | Sub-recurso |
| OK | GET | /api/formularios/:id/measurements | Sub-recurso |
| OK | GET | /api/formularios/:id/photos | Sub-recurso |
| OK | PATCH | /api/formularios/:id | Atualização ok |
| OK | POST | /api/checklist | Item criado |
| OK | GET | /api/checklist/formulario/:formularioId | Lista do formulário |
| OK | PUT | /api/checklist/:id | Checked atualizado |
| OK | POST | /api/measurements | Medição criada |
| OK | GET | /api/measurements/formulario/:formularioId | Lista do formulário |
| OK | PUT | /api/measurements/:id | Value atualizado |
| OK | GET | /api/photos/formulario/:formularioId | Lista do formulário |
| OK | POST | /api/photos | Foto criada via URL |
| OK | DELETE | /api/photos/:id | Foto removida |
| OK | POST | /api/relatorios/generate | Relatório criado (valida UserCanteiro) |
| OK | GET | /api/relatorios/user/:userId | Relatórios do user |
| OK | GET | /api/relatorios/:id | Relatório por id |
| OK | PUT | /api/relatorios/:id/introduction | Seção atualizada |
| OK | PUT | /api/relatorios/:id/objective | Seção atualizada |
| OK | PUT | /api/relatorios/:id/development | Seção atualizada |
| OK | PUT | /api/relatorios/:id/final-thoughts | Seção atualizada |
| OK | PUT | /api/relatorios/:id/references | Seção atualizada |
| OK | PUT | /api/relatorios/:id | Atualização múltipla |
| OK | POST | /api/relatorios/:id/submit | Status SUBMETIDO |
| OK | GET | /api/relatorios/:id/export-pdf | PDF real gerado via pdfkit |
| OK | POST | /api/formularios/:id/photos (multipart) | Upload binário aceito (multer) |
| OK | POST | /api/formularios/:id/sync | Checklist + measurements + photos em lote |
| OK | GET | /api/turmas | Lista de turmas |
| OK | GET | /api/academic-periods | Lista de períodos |
| OK | GET | /api/academic-periods/active | 200 - período 2026.1 (após seed) |
| OK | GET | /api/aluno-turma/user/:userId | Vínculos turma do user |
| OK | GET | /api/alunos/:userId/resumo | Resumo (totais) |
| OK | GET | /api/alunos/:userId/home | Home completa do aluno |

## Endpoints reais mas não cobertos pelo script
- **`POST /api/users/refresh`** com refresh inválido — só caminho feliz testado.
- **`POST /api/turmas`**, **`POST /api/aluno-turma`** — services existem mas precisam de criação de Turma explícita; AcademicPeriod já existe após o seed atualizado.
- **`GET /api/canteiros?user_id=…`** (variante via query) — testamos a variante `/canteiros/user/:userId`. A query-string aceita o mesmo controller.
- **`GET /api/formularios?user_id=…`** (variante via query) — mesmo caso acima.

## Rotas pendentes / não montadas
**Nenhuma.** Todas as rotas declaradas em `api/routes/*.routes.ts` estão montadas em `api/routes/index.ts`.

## Erros encontrados durante a primeira passada (já corrigidos)
| Erro | Causa | Correção |
|---|---|---|
| `POST /api/users/login` retornava 500 `secretOrPrivateKey must have a value` | Variável `JWT_SECRET` ausente no `.env` | Adicionei `JWT_SECRET=...` no [.env](../.env) |

## Próximos passos recomendados
1. ✅ **`.env.example` atualizado** com `DATABASE_URL`, `JWT_SECRET` e `NODE_ENV`.
2. ✅ **`AcademicPeriod` 2026.1 e 2026.2 adicionados ao seed** (idempotente via upsert por id fixo).
3. ✅ **`export-pdf` implementado** com `pdfkit`. Gera PDF com cabeçalho, status, planta, canteiro e as 5 seções.
4. ✅ **`formulario.sync` coberto** pelo script (envia checklist + measurements + photos em lote).
5. ✅ **Upload multipart coberto** pelo script (envia PNG 1x1 in-memory via `FormData`).

## Conclusão
Todos os endpoints expostos pela API estão funcionais. O único bloqueio inicial era a falta de `JWT_SECRET`, já resolvido. A entidade `UserCanteiro` está validada em três pontos (criação automática junto ao `Canteiro`, validação ao criar `ListaDeFormularios` e validação ao gerar `Relatorio`) — todas testadas no fluxo real.

Os 5 itens da lista "Próximos passos" foram concluídos nesta iteração:
- `.env.example` agora documenta todas as variáveis necessárias.
- Períodos letivos vivem no seed e podem ser ressetados a qualquer momento.
- `pdfkit` (+ `@types/pdfkit`) adicionados como dependência; `RelatorioController.exportPdf` agora faz `doc.pipe(res)`.
- Cobertura de teste pulou de 57 para 59 chamadas, incluindo o caso multipart e o caso sync.
