### 🧭 Project Structure & Conventions

All developer-facing architectural and organizational rules are defined in [`cursor.rules.ts`](./server/cursor.rules.ts). Key concepts:

#### 📁 `server/queries/`

- One folder per entity (e.g. `users`, `functions`, `org-units`).
- One file per query (e.g. `get-by-id.ts`, `create.ts`, `update.ts`).
- Each `index.ts` exports both entity-specific queries and types (`User`, `NewUser`, etc.).

#### 📁 `server/actions/`

- One file per entity (e.g. `users.ts`, `functions.ts`).
- Uses `next-safe-action` for secure form and mutation handling.
- Imports and uses query functions (e.g. `createUser`) internally.
- Validated via Zod schemas from `~/zod-schemas/`.

#### 📁 `server/db/schema/`

- Tables live in `tables/`, relations in `relations/`.
- Table names use `pgTableCreator()` to add a project prefix (`growcery_*`).
- Relations only defined on FK side when needed (`relations()`).

#### 🛡️ Auth conventions

- All queries and actions begin with a call to `auth()` or `requireUserId()`.
- Unauthenticated access throws immediately.

#### 🧮 Dashboard stats

- Queried via `getDashboardStats()` using parallel `count()` calls.

🔗 For complete up-to-date rules, always refer to [`cursor.rules.ts`](./server/cursor.rules.ts).
