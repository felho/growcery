# GROWcery

GROW people to their fullest potential.

---

## 🧭 Project Structure & Conventions

All developer-facing architectural and organizational rules are defined in [`cursor.rules.ts`](./cursor.rules.ts). Key concepts:

### 📁 `server/queries/`

This folder contains all database read operations, organized per entity.

- One folder per entity (e.g. `users`, `functions`, `org-units`)
- Each folder contains one file per query (`get-by-id.ts`, `create.ts`, `update.ts`, etc.)
- An `index.ts` file re-exports both the types and query functions for that entity
- Types like `User`, `NewUser`, etc., are defined using `InferSelectModel` and `InferInsertModel`

**Example:**

```
server/queries/
  users/
    get-by-id.ts
    create.ts
    update.ts
    index.ts
  functions/
    get-by-id.ts
    get-all-by-org.ts
    index.ts
```

### 📁 `server/actions/`

This folder wraps form submissions and mutation logic using [`next-safe-action`](https://github.com/teepsheep/next-safe-action).

- One file per entity (e.g. `users.ts`, `functions.ts`)
- Each action corresponds to a validated server mutation
- Actions use `zod` schemas for input validation
- Internally, these call the matching query function (e.g., `createUser()`)

**Example usage:**

```ts
export const createUserAction = action(createUserSchema, async (input) => {
  return createUser(input);
});
```

### 📁 `server/db/schema/`

Database tables and relations are defined here using Drizzle ORM.

- Tables are located in `schema/tables/`
- Foreign key relations are defined in `schema/relations/`
- Tables use `pgTableCreator()` to prefix names with `growcery_`
- Circular or self-referencing tables (e.g. `users.managerId`) define their references using `AnyPgColumn`

**Example structure:**

```
server/db/schema/
  tables/
    users.ts
    functions.ts
    org-units.ts
  relations/
    users.relations.ts
    org-units.relations.ts
```

### 📡 `lib/client-api/` — Client-side API Layer

This folder contains thin fetch wrappers to call API routes from the client.

- One file per entity (e.g. `functions.ts`, `org-units.ts`, `users.ts`)
- Each file exports one or more typed `fetch*` functions
- Errors are thrown on `!res.ok` to bubble up through SWR or other consumers
- Types are imported from the corresponding `queries/index.ts`

**Structure example:**

```
lib/
  client-api/
    functions.ts        // fetchFunctions()
    users.ts            // fetchUsers()
    org-units.ts        // fetchOrgUnits()
    index.ts            // optional barrel file
```

**Usage:**

```ts
import { fetchFunctions } from "~/lib/client-api/functions";
// or:
import { fetchFunctions, fetchUsers } from "~/lib/client-api";
```

### 🧩 `components/`

The UI is composed using components based on [shadcn/ui](https://ui.shadcn.com/), with some custom wrappers.

- Global, reusable components are placed in `components/ui/`
- Project-specific or context-aware components live closer to their usage (e.g., under a page folder)
- Form components often follow a pattern like `InputWithLabel`, `SelectWithLabel`, `TextareaWithLabel`

**Example:**

```
components/
  ui/
    button.tsx
    card.tsx
    input.tsx
  feedback/
    toast-provider.tsx
    form-error.tsx
```

### 🧪 `zod-schemas/`

All validation logic is centralized using [Zod](https://zod.dev/) schemas.

- Each entity (e.g., `user`, `function`) has a dedicated file (e.g., `user.ts`)
- Files define shared schemas for create, update, and action types
- Schemas are imported both by server actions and forms (via `zodResolver`)

**Example:**

```ts
// zod-schemas/user.ts
export const createUserSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
});

export type InsertUserInput = z.infer<typeof createUserSchema>;
```

### 🧭 Routing

Routes are organized by context and use the App Router structure in Next.js.

- `/admin/` contains internal entity CRUD views
- Future plans include `/o/[orgId]` scoped routing with OrgProvider and middleware
- Form routes follow a nested structure: e.g., `/admin/users/form?itemId=123`

**Example:**

```
src/app/
  admin/
    users/
      page.tsx
      form/
        page.tsx
        user-form.tsx
        user-form-loader.tsx
```

---

### 🛡️ Auth conventions (server-side only)

- All server-side queries and actions begin with a call to `auth()` or `requireUserId()`
- Client-side code assumes the user is already authenticated (Clerk middleware handles redirects)
- Unauthenticated server access throws immediately

### 🧮 Dashboard stats

- Queried via `getDashboardStats()` using parallel `count()` calls

---

🔗 For complete rules, see [`cursor.rules.ts`](./cursor.rules.ts)
