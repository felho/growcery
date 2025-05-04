// cursor.rules.ts (project root)

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

    // ➕ Add more sections here as needed: e.g., component structure, routes, zod schemas...
  },
};
