# Unicorn Betting

Unicorn Betting is a full-stack demo app for managing unicorn races and online bets.

The app includes:

- 10 races per day
- bets opening 2 hours before each race
- three bet types: winner, top 3, top 5
- simulated card payment
- bettor dashboard
- product usage dashboard with views, clicks and KPIs
- Swagger API documentation

## Tech Stack

- Frontend: React, Vite, TypeScript
- Backend: NestJS, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- API docs: Swagger
- Local database: Docker Compose

## Requirements

- Node.js
- npm
- Docker

## Setup

Install dependencies:

```bash
npm install
```

Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Start PostgreSQL:

```bash
npm run db:up
```

Run Prisma migrations and seed the database:

```bash
npm run db:migrate
npm run db:seed
```

Start the backend:

```bash
npm run dev:backend
```

Start the frontend in another terminal:

```bash
npm run dev
```

## URLs

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`
- Swagger docs: `http://localhost:3000/api/docs`

## Useful Commands

```bash
npm run build
npm run db:up
npm run db:migrate
npm run db:seed
npm run dev:backend
npm run dev
```

## Notes

The payment flow is simulated. No real card payment is processed.

The seed creates demo users, My Little Pony-inspired unicorn names, today's races and sample product analytics events.
