# Solus Educacional API

API para gestão educacional, construída com [NestJS](https://nestjs.com/), [Prisma ORM](https://www.prisma.io/), PostgreSQL e Redis. O sistema gerencia usuários, operadores, provedores de serviço, funcionários, disciplinas, módulos, missões, atividades, chat, prêmios, relatórios e muito mais.

## Sumário

- [Tecnologias](#tecnologias)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Como rodar localmente](#como-rodar-localmente)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Documentação da API (Swagger)](#documentação-da-api-swagger)
- [Principais Comandos](#principais-comandos)
- [Fluxo Principal](#fluxo-principal)

---

## Tecnologias

- Node.js (NestJS)
- Typescript
- PostgreSQL
- Prisma ORM
- Redis
- BullMQ (filas)
- Docker e Docker Compose
- Swagger (documentação)

---

## Estrutura de Pastas

```
src/
  domain/         # Entidades de domínio e interfaces
  infra/          # Implementações, controllers, módulos, helpers, config
  use-cases/      # Casos de uso (aplicação)
  prisma/         # Migrations, seeds do banco e schema do banco de dados
```

---

## Como rodar localmente

> **Pré-requisitos:**
>
> - [Node.js 22+](https://nodejs.org/)
> - [Docker](https://www.docker.com/)

1. **Clone o repositório**
2. Instale as dependências:
   ```bash
   pnpm install
   # ou
   npm install
   ```
3. Configure o arquivo `.env` na raiz do projeto (veja [Variáveis de Ambiente](#variáveis-de-ambiente)).
4. Suba o banco e o Redis (requer Docker):
   ```bash
   docker-compose up -d
   ```
5. Rode as migrations e o seed:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   # ou
   npx prisma migrate reset
   ```
6. Inicie a API:
   ```bash
   pnpm start:dev
   # ou
   npm run start:dev
   ```

A API estará disponível em `http://localhost:3000`.

---

## Variáveis de Ambiente

Exemplo de variáveis necessárias (coloque no `.env`):

```
DATABASE_URL=
PORT=
JWT_SECRET=
NODE_ENV=
PGPORT=
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
REDIS_HOST=
REDIS_PORT=
```

---

## Documentação da API (Swagger)

Acesse a documentação interativa em:

```
http://localhost:3000/api-docs
```

---

## Principais Comandos

- `pnpm start:dev` — Inicia a API em modo desenvolvimento
- `pnpm build` — Compila o projeto
- `pnpm lint` — Lint do código
- `pnpm format` — Formata o código
- `pnpm seed:prod` — Executa o seed de produção
- `pnpm prisma migrate reset` - Aplica todas as migrations e a seed de desenvolvimento

---

## Fluxo Principal

- A aplicação é inicializada pelo arquivo `src/infra/config/main.ts`, que carrega o `AppModule`.
- O `AppModule` importa todos os módulos principais do sistema (autenticação, usuários, operadores, disciplinas, módulos, missões, chat, prêmios, relatórios, etc).
- O banco de dados é gerenciado via Prisma e PostgreSQL.
- Redis é utilizado para cache e filas (BullMQ).
- A documentação Swagger é gerada automaticamente e exposta em `/api-docs`.

---

Se precisar de mais detalhes sobre endpoints, exemplos de payloads ou fluxos específicos, acesse a documentação Swagger ou consulte os casos de uso em `src/use-cases/`.
