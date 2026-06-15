# Escopo do Projeto — Controle Financeiro Pessoal (AV2)

**Universidade Maurício de Nassau — Maceió**

**Integrantes:**

1. João Victor Araujo dos Santos
2. Ruan Welisson Nazário Teles
3. Guilherme Virgílio de Moura Alves
4. Pedro Henrique Mendes de Oliveira
5. Ivano Gabriel Silva Melo
6. Cauã Manoel Nogueira de Aguiar
7. Eduardo dos Santos Silva
8. Pedro Bertonha Sodré
9. Matheus Kayke da Silva Marinho Mariano

## 1. Visão Geral

Aplicação web para gerenciamento de finanças pessoais, permitindo ao usuário registrar receitas e despesas, organizá-las por categorias e visualizar sua situação financeira por meio de um dashboard com indicadores e gráficos.

**Tipo de entrega:** MVP (Minimum Viable Product) funcional, com foco em demonstrar a arquitetura e o fluxo completo (front-end → back-end → banco de dados).

## 2. Objetivo

Permitir que o usuário tenha uma visão clara de quanto ganha, quanto gasta e em quais categorias, facilitando o controle do orçamento mensal.

## 3. Justificativa

Controle financeiro pessoal é um problema universal e de fácil compreensão para qualquer público (banca avaliadora, colegas, etc.), o que atende ao requisito de apresentar com rigor técnico, mas de forma acessível. Além disso, o domínio permite explorar bem regras de negócio (cálculos de saldo, totais por categoria, validações), reforçando a separação em camadas.

## 4. Escopo do MVP — Funcionalidades

- **Cadastro de transações**: criar, listar, editar e excluir (CRUD) lançamentos de receita ou despesa, contendo descrição, valor, data, categoria e tipo (receita/despesa).
- **Categorias**: conjunto pré-definido (ex.: Alimentação, Transporte, Moradia, Lazer, Saúde, Salário, Outros), podendo ser fixas no banco (não é prioridade permitir o usuário criar novas categorias no MVP).
- **Dashboard principal**: exibir saldo atual, total de receitas e total de despesas do período selecionado.
- **Filtro por período**: selecionar mês/ano para visualizar os dados correspondentes.
- **Gráficos**:
  - Gráfico de pizza/rosca: distribuição de despesas por categoria.
  - Gráfico de barras ou linha: evolução de receitas x despesas ao longo dos meses.
- **Listagem de transações**: tabela com busca/ordenação simples.

### Fora do escopo (versões futuras)

- Autenticação completa com múltiplos usuários (no MVP, pode-se usar um usuário único fixo, sem tela de login).
- Integração bancária real (Open Finance).
- Notificações, metas de gastos, exportação de relatórios em PDF.
- Aplicativo mobile.

## 5. Arquitetura — 3 Camadas

```
┌─────────────────────────────┐
│   Camada de Apresentação      │  React + Tailwind/Bootstrap
│   (Front-end)                  │  - Dashboard, formulários, gráficos
└──────────────┬────────────────┘
               │ HTTP (REST/JSON)
┌──────────────▼────────────────┐
│   Camada de Negócio             │  Node.js + Express (ou FastAPI)
│   (Back-end / API)              │  - Validações, cálculos de saldo
│                                  │  - Regras: tipo de transação,
│                                  │    agrupamento por categoria/período
└──────────────┬────────────────┘
               │ ORM / Driver
┌──────────────▼────────────────┐
│   Camada de Dados               │  PostgreSQL (ou MongoDB)
│   (Persistência)                │  - Tabelas: transacoes, categorias
└─────────────────────────────────┘
```

Cada camada roda em um container Docker separado, orquestrados via `docker-compose`.

## 6. Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Front-end | React + Vite, Tailwind CSS, Recharts (gráficos), Axios |
| Back-end | Node.js + Express (alternativa: Python + FastAPI) |
| Banco de dados | PostgreSQL |
| Containerização | Docker + docker-compose |
| Versionamento | Git/GitHub (commits semânticos) |

## 7. Modelo de Dados (simplificado)

**categorias**
| Campo | Tipo | Descrição |
|---|---|---|
| id | INT (PK) | identificador |
| nome | VARCHAR | ex.: "Alimentação" |
| tipo | ENUM | "receita" ou "despesa" |
| cor | VARCHAR | usada nos gráficos |

**transacoes**
| Campo | Tipo | Descrição |
|---|---|---|
| id | INT (PK) | identificador |
| descricao | VARCHAR | ex.: "Mercado" |
| valor | DECIMAL | valor da transação |
| data | DATE | data do lançamento |
| tipo | ENUM | "receita" ou "despesa" |
| categoria_id | INT (FK) | referência à categoria |

## 8. Endpoints da API (sugestão)

| Método | Rota | Descrição |
|---|---|---|
| GET | /api/transacoes?mes=&ano= | lista transações do período |
| POST | /api/transacoes | cria nova transação |
| PUT | /api/transacoes/:id | edita transação |
| DELETE | /api/transacoes/:id | remove transação |
| GET | /api/categorias | lista categorias |
| GET | /api/resumo?mes=&ano= | retorna saldo, total receitas, total despesas e totais por categoria |

## 9. Telas Principais (wireframe textual)

1. **Dashboard**: cards com saldo, total receitas e total despesas do mês; gráfico de pizza por categoria; gráfico de barras (receita x despesa nos últimos meses); seletor de mês/ano.
2. **Transações**: tabela com lista de lançamentos, botão "Nova transação" (abre modal/formulário), ações de editar e excluir por linha.
3. **Formulário de transação**: campos descrição, valor, data, tipo (receita/despesa) e categoria.

## 10. Estrutura de Pastas Sugerida

```
projeto-financas/
├── docker-compose.yml
├── frontend/
│   ├── src/
│   │   ├── components/   (Dashboard, TransactionForm, TransactionList, Charts)
│   │   ├── pages/
│   │   ├── services/      (chamadas à API)
│   │   └── App.jsx
│   └── Dockerfile
├── backend/
│   ├── src/
│   │   ├── controllers/    (camada de apresentação da API)
│   │   ├── services/       (camada de negócio - cálculos, validações)
│   │   ├── repositories/   (camada de dados - acesso ao banco)
│   │   ├── models/
│   │   └── routes/
│   └── Dockerfile
└── README.md
```

## 11. Cronograma Sugerido (entrega em ~2 dias)

**Dia 1**
- Configurar repositório, docker-compose e estrutura de pastas.
- Criar banco de dados, tabelas e seed de categorias.
- Implementar back-end: CRUD de transações + endpoint de resumo.

**Dia 2**
- Implementar front-end: layout com Tailwind, formulário de transação, listagem.
- Integrar gráficos (Recharts) com dados reais via API.
- Testes finais, ajustes visuais, gravação/preparo da apresentação e finalização do relatório LaTeX.

## 12. Padrão de Commits (sugestão — Conventional Commits)

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação (README, relatório)
- `style:` ajustes visuais/formatação
- `refactor:` refatoração sem mudar comportamento
- `chore:` configuração, dependências, Docker

## 13. Uso de IA (a ser documentado no relatório)

Registrar, por exemplo: geração de boilerplate de componentes React, sugestões de queries SQL, revisão/explicação de trechos de código e apoio na estruturação deste documento de escopo — deixando claro o que foi gerado/assistido por IA e o que foi escrito/ajustado pela equipe.

## 14. Critérios para a Apresentação

- Demonstrar o fluxo completo: cadastrar uma transação → ver refletida no dashboard e nos gráficos.
- Explicar a divisão em 3 camadas, mostrando onde está cada regra de negócio (ex.: cálculo do saldo).
- Mostrar o ambiente rodando via Docker (docker-compose up).
- Relacionar o MVP entregue com o escopo definido, destacando o que foi priorizado e o que ficou para versões futuras.
