# Controle Financeiro Pessoal

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

MVP de um sistema de controle financeiro pessoal, desenvolvido para o trabalho da AV2.
Permite registrar receitas e despesas, categorizá-las e visualizar um dashboard com
saldo, totais e gráficos por período.

## Sumário

- [Arquitetura](#arquitetura)
- [Stack utilizada](#stack-utilizada)
- [Como executar (Docker)](#como-executar-docker)
- [Como executar sem Docker (desenvolvimento)](#como-executar-sem-docker-desenvolvimento)
- [Endpoints da API](#endpoints-da-api)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Padrão de commits](#padrão-de-commits)
- [Uso de IA no projeto](#uso-de-ia-no-projeto)

## Arquitetura

O projeto segue uma arquitetura em **3 camadas**, separadas em containers Docker
independentes:

```
┌────────────────────────────┐
│  Apresentação (frontend/)    │  React + Tailwind CSS
│  - Dashboard, formulário,    │
│    listagem, gráficos        │
└──────────────┬───────────────┘
               │ HTTP/JSON (Axios)
┌──────────────▼───────────────┐
│  Negócio (backend/src)        │  Node.js + Express
│  - controllers  → recebem     │
│    requisições HTTP           │
│  - services     → validações  │
│    e regras de negócio         │
└──────────────┬───────────────┘
               │ SQL (pg)
┌──────────────▼───────────────┐
│  Dados (backend/src/           │  PostgreSQL
│  repositories + db/init.sql)   │
│  - acesso direto ao banco       │
└─────────────────────────────────┘
```

No backend, cada requisição passa por **rota → controller → service → repository**:

- **routes/**: define os endpoints e qual controller atende cada um.
- **controllers/**: recebem a requisição HTTP, chamam o service e devolvem a resposta.
- **services/**: contêm as regras de negócio (validações, cálculo de saldo,
  agrupamento de despesas por categoria etc).
- **repositories/**: única camada que conversa diretamente com o banco (SQL puro).

## Stack utilizada

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 (Vite), Tailwind CSS, Recharts, Axios |
| Backend | Node.js 20, Express |
| Banco de dados | PostgreSQL 16 |
| Containers | Docker + Docker Compose |

## Como executar (Docker)

Pré-requisitos: Docker e Docker Compose instalados.

```bash
docker compose up --build
```

Isso irá:

1. Criar o banco PostgreSQL e popular as tabelas `categorias` e `transacoes`
   com dados de exemplo (`backend/db/init.sql`).
2. Subir a API em `http://localhost:3001`.
3. Subir o frontend em `http://localhost:5173`.

Para parar e remover os containers:

```bash
docker compose down
```

Para resetar completamente o banco (apaga o volume e recria os dados de exemplo):

```bash
docker compose down -v
docker compose up --build
```

## Como executar sem Docker (desenvolvimento)

**Banco de dados**: suba um Postgres local e execute o script `backend/db/init.sql`.

**Backend**:

```bash
cd backend
npm install
# configure as variáveis DB_HOST, DB_USER, DB_PASSWORD, DB_NAME (ou use um .env)
npm run dev
```

**Frontend**:

```bash
cd frontend
npm install
npm run dev
```

## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/transacoes?mes=&ano=` | Lista as transações do período |
| POST | `/api/transacoes` | Cria uma nova transação |
| PUT | `/api/transacoes/:id` | Atualiza uma transação existente |
| DELETE | `/api/transacoes/:id` | Remove uma transação |
| GET | `/api/categorias` | Lista as categorias disponíveis |
| GET | `/api/resumo?mes=&ano=` | Retorna saldo, totais e dados para os gráficos |

### Exemplo de payload (POST/PUT `/api/transacoes`)

```json
{
  "descricao": "Supermercado",
  "valor": 250.90,
  "data": "2026-06-10",
  "tipo": "despesa",
  "categoria_id": 4
}
```

## Estrutura de pastas

```
projeto-financas/
├── docker-compose.yml
├── escopo_controle_financeiro.md
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── db/
│   │   └── init.sql
│   └── src/
│       ├── index.js
│       ├── db.js
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       └── repositories/
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── components/
        │   ├── MonthSelector.jsx
        │   ├── Dashboard.jsx
        │   ├── TransactionForm.jsx
        │   └── TransactionList.jsx
        └── services/
            └── api.js
```

## Padrão de commits

Sugestão baseada em *Conventional Commits*:

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação (README, relatório, escopo)
- `style:` ajustes visuais/formatação (sem mudança de lógica)
- `refactor:` refatoração sem mudar comportamento
- `chore:` configuração, dependências, Docker

Exemplo: `feat: adiciona endpoint de resumo financeiro por período`

## Uso de IA no projeto

Este projeto foi desenvolvido com apoio de IA generativa (Claude). A IA foi usada para:

- Estruturar o escopo inicial do projeto (documento `escopo_controle_financeiro.md`).
- Gerar o esqueleto da arquitetura em 3 camadas do backend (rotas, controllers,
  services e repositories).
- Gerar os componentes iniciais do frontend em React + Tailwind (Dashboard,
  formulário de transações, listagem e seletor de período).
- Criar o `docker-compose.yml` e os Dockerfiles de frontend e backend.

A equipe é responsável por revisar, ajustar e estender este código conforme a
evolução do projeto, bem como por validar as regras de negócio implementadas.
