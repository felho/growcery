export const cursorRules = {
  project: "GROWcery",
  language: "TypeScript",
  framework: "Next.js (App Router)",
  orm: "Drizzle ORM",
  auth: "Clerk",
  styling: "Tailwind CSS + shadcn/ui",

  rules: {
    structure: {
      queries: {
        location: "server/queries/",
        structure: "Modular — one folder per entity",
        files: "One file per operation (e.g., `get-by-id.ts`, `create.ts`)",
        index: {
          usage: "Re-exports types and query functions",
          definesTypes: true,
        },
      },
      actions: {
        location: "server/actions/",
        structure: "One file per entity",
        purpose: "Wraps server-side mutations using `next-safe-action`",
        validation: "Uses Zod schemas from `~/zod-schemas/`",
        dependencies: "Imports from corresponding `queries` modules",
      },
      dbSchema: {
        tables: "Defined under `server/db/schema/tables/`",
        relations: "Defined under `server/db/schema/relations/`",
        naming: "Uses `pgTableCreator` to prefix table names with `growcery_`",
        primaryKeyColumns:
          "All PK columns must explicitly include `.notNull()` even though Postgres enforces it implicitly",
        tableExtras:
          "Constraints like indexes and primary keys must be defined as array elements (not object return) in the second `createTable` parameter — e.g. `[index(...).on(...)]`, not `{ indexName: ... }`.",
        selfReferences:
          "Use `(): AnyPgColumn => <table>.<column>` when a table references itself (e.g. `managerId` in `users`)",
      },
      clientApi: {
        location: "lib/client-api/",
        structure: "One file per entity (e.g. `functions.ts`, `users.ts`)",
        usage: "Wraps client-side fetch calls to API routes",
        indexFile: "Optional aggregator file for easier imports",
      },
    },

    auth: {
      strategy: "Explicit in every query and action",
      implementation: "Use `auth()` or `requireUserId()` to guard access",
    },

    types: {
      placement: "Defined in each entity’s `queries/index.ts`",
      naming: {
        select: "Use e.g. `User`, `OrgUnit`",
        insert: "Use e.g. `NewUser`, `NewFunction`",
        joined: "Use `With*` suffix for relation-extended types",
      },
    },

    naming: {
      queryFiles: "Descriptive verbs: `get-by-id.ts`, `create.ts`, `update.ts`",
      types: "Avoid `Record` or `Row`; prefer semantic names like `User`",
    },

    dataFetching: {
      strategy: "Use `db.query.<table>.findFirst/findMany`",
      relations: "Use Drizzle `relations()` for joined data access",
    },

    imports: {
      eq: "Use top-level import unless destructured in query callback",
    },

    dashboard: {
      stats: "Queried via `getDashboardStats()` with parallel `count()` calls",
    },

    // ➕ Add more sections here as needed: e.g., component structure, routes, zod schemas...
  },
};
