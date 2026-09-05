# AGENTS.md

## What This Is

NestJS 11 backend for a school parent association management system (APAFA). Fresh scaffold — only `AppModule` exists. The complete system design is in `doc/`.

## Stack

- **Backend**: NestJS 11, TypeScript 5.7+, Prisma ORM, MySQL
- **Auth**: Firebase Admin SDK → validates tokens → issues internal JWT
- **Frontend**: Angular (separate project, not in this repo)
- **Package manager**: pnpm (not npm)

## Commands

```bash
pnpm install          # setup
pnpm run start:dev    # dev server (watch mode)
pnpm run build        # compile to dist/
pnpm run start:prod   # production
pnpm run test         # unit tests (src/**/*.spec.ts)
pnpm run test:e2e     # e2e tests (test/*.e2e-spec.ts)
pnpm run lint         # eslint --fix
pnpm run format       # prettier
```

Single test file: `pnpm run test -- --testPathPattern=filename`

## Before Implementing

Read `doc/` in this order — it's the system blueprint:

1. `doc/a2-entidades-atributos.md` — DB entities and fields
2. `doc/a3-actores-permisos.md` — roles and permissions
3. `doc/a4-caso-uso.md` — use case matrix
4. `doc/a5/` — endpoint overview per module
5. `doc/a7/` — DTOs and validation rules
6. `doc/a8/` — request/response examples
7. `doc/a9-infrastructure.md` — auth guards, filters, interceptors (NestJS-specific)
8. `doc/schema-mysql.sql` — database schema

Modules: M1 (Auth), M2 (Parents/Students), M3 (Board), M4 (Assemblies), M5 (Events), M6 (Attendance), M7 (Fines), M8 (Income), M9 (Expenses), M10 (Transactions/Reports), M11 (Notices). 71 endpoints total.

## Conventions

- **ESLint**: flat config (`eslint.config.mjs`), `@typescript-eslint/no-explicit-any: off`, `no-floating-promises: warn`
- **Prettier**: single quotes, trailing commas (`.prettierrc`)
- **Decorators**: `emitDecoratorMetadata` + `experimentalDecorators` required for NestJS
- **Module resolution**: `nodenext` (not `node`)
- **Tests**: Jest 30, `ts-jest`, files as `*.spec.ts` in `src/`, e2e in `test/`
- **Soft deletes**: `deleted_at` column on all domain tables, auto-filtered by Prisma middleware
- **API prefix**: `/api/v1` (set in `main.ts`)
