# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `pnpm dev` - Start development server with Turbo
- `pnpm build` - Build production bundle
- `pnpm preview` - Build and preview production bundle
- `pnpm start` - Start production server

### Code Quality
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm check` - Run both linting and type checking
- `pnpm format:check` - Check code formatting with Prettier
- `pnpm format:write` - Format code with Prettier

### Database Operations
- `pnpm db:generate` - Generate Drizzle migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:push` - Push schema changes to database
- `pnpm db:studio` - Open Drizzle Studio GUI
- `pnpm db:seed:matrix` - Seed engineering competency matrix data

## Architecture Overview

GROWcery is a Next.js application for competency matrix management and employee growth tracking. It uses:

- **Framework**: Next.js 15 with App Router
- **Database**: Drizzle ORM with PostgreSQL (Neon)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS + shadcn/ui components
- **Validation**: Zod schemas
- **State Management**: SWR for data fetching
- **Package Manager**: pnpm

## Key Architecture Patterns

### Database Layer (`server/db/`)
- **Tables**: Defined in `schema/tables/` using Drizzle ORM
- **Relations**: Defined in `schema/relations/` for foreign key relationships
- **Naming**: All tables prefixed with `growcery_` using `pgTableCreator`
- **Self-references**: Use `(): AnyPgColumn => table.column` pattern

### Query Layer (`server/queries/`)
- **Structure**: One folder per entity (users, functions, org-units, etc.)
- **Files**: One file per operation (`get-by-id.ts`, `create.ts`, `update.ts`)
- **Index**: Each folder has `index.ts` re-exporting types and functions
- **Types**: Defined using `InferSelectModel` and `InferInsertModel`
- **Auth**: All queries begin with `auth()` or `requireUserId()`

### Action Layer (`server/actions/`)
- **Purpose**: Wraps server-side mutations using `next-safe-action`
- **Structure**: One file per entity
- **Validation**: Uses Zod schemas from `~/zod-schemas/`
- **Dependencies**: Imports from corresponding `queries` modules

### Client API Layer (`lib/client-api/`)
- **Structure**: One file per entity
- **Purpose**: Thin fetch wrappers for API routes
- **Error Handling**: Throws on `!res.ok` to bubble up through SWR
- **Types**: Imports from corresponding `queries/index.ts`

### Validation (`zod-schemas/`)
- **Structure**: One file per entity
- **Purpose**: Centralized validation logic using Zod
- **Usage**: Shared between server actions and forms via `zodResolver`

### Forms
- **Structure**: Each form has a `page.tsx` under relevant route
- **Modes**: Handles both create and edit based on query params
- **Components**: Uses `InputWithLabel`, `SelectWithLabel`, `TextareaWithLabel`
- **Validation**: Uses `react-hook-form` with `zodResolver`

## Core Domain Models

### Competency Management
- **Competency Matrices**: Define skills frameworks with areas, competencies, and levels
- **Assessments**: Track user progress through competency levels
- **Ratings**: Current and reference ratings for competencies
- **Calibration**: Process for aligning rating consistency

### Organizational Structure
- **Organizations**: Top-level tenant isolation
- **Org Units**: Hierarchical organizational structure
- **Functions**: Job roles/positions
- **User Archetypes**: Templates for user types
- **Manager Groups**: Collections of managers for assignment

### User Management
- **Users**: Core user entity with Clerk integration
- **Assignments**: Link users to competency matrices
- **Permissions**: Role-based access control

## Important Implementation Notes

### Authentication
- All server-side code must start with `auth()` or `requireUserId()`
- Client-side assumes user is authenticated (Clerk middleware handles redirects)
- Unauthenticated server access throws immediately

### Database Constraints
- Primary key columns must explicitly include `.notNull()`
- Table constraints defined as array elements in second `createTable` parameter
- Use `[index(...).on(...)]` not `{ indexName: ... }`

### Type Naming Conventions
- Select models: `User`, `OrgUnit`, `Function`
- Insert models: `NewUser`, `NewFunction`
- Joined models: `UserWithOrgUnit`, `FunctionWithUsers`

### File Organization
- Page components: `src/app/[route]/page.tsx`
- Form pages: `src/app/[route]/form/page.tsx`
- Reusable components: `src/components/ui/`
- Context-specific components: Co-located with usage

## Testing & Quality

Always run these commands before committing:
1. `pnpm check` - Lint and type check
2. `pnpm format:check` - Verify formatting
3. `pnpm build` - Ensure production build works