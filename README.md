# GROWcery

GROW people to their fullest potential.

---

## 🧭 Project Structure & Conventions

All developer-facing architectural and organizational rules are defined in [`cursor.rules.ts`](./cursor.rules.ts). Key concepts:

### 📁 `server/queries/`

- One folder per entity (e.g. `users`, `functions`, `org-units`)
- One file per query (`get-by-id.ts`, `create.ts`, `update.ts`)
- Each `index.ts` exports both entity-specific queries and types (`User`, `NewUser`, etc.)

### 📁 `server/actions/`

- One file per entity (e.g. `users.ts`, `functions.ts`)
- Uses `next-safe-action` for secure form and mutation handling
- Imports and uses query functions (e.g. `createUser`) internally
- Validated via Zod schemas from `~/zod-schemas/`

### 📁 `server/db/schema/`

- Tables live in `tables/`, relations in `relations/`
- Table names use `pgTableCreator()` to add a project prefix (`growcery_*`)
- Relations only defined on FK side when needed (`relations()`)

### 📡 `lib/client-api/` — Client-side API Layer

This folder contains thin fetch wrappers to call API routes from the client.

- One file per entity (e.g. `functions.ts`, `org-units.ts`, `users.ts`)
- Each file exports one or more typed `fetch*` functions
- Errors are thrown on `!res.ok` to bubble up through SWR or other consumers
- Types are imported from the corresponding `queries/index.ts`

Structure example:

```txt
lib/
  client-api/
    functions.ts        // fetchFunctions()
    users.ts            // fetchUsers()
    org-units.ts        // fetchOrgUnits()
    index.ts            // barrel file
```

Usage:

```ts
import { fetchFunctions } from "~/lib/client-api/functions";
// or:
import { fetchFunctions, fetchUsers } from "~/lib/client-api";
```

---

### 🛡️ Auth conventions

- All queries and actions begin with a call to `auth()` or `requireUserId()`
- Unauthenticated access throws immediately

### 🧮 Dashboard stats

- Queried via `getDashboardStats()` using parallel `count()` calls

🔗 For complete rules, see [`cursor.rules.ts`](./cursor.rules.ts)
