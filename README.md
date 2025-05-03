## Issues

### Small todos

- [x] Rename files: topnav to top-nav, syncuser to sync-user

### Org in the URL related fixes

- [ ] The sidebar has to be fixed: the current item is not highlighted
- [ ] Remove syncUserToDb function
- [ ] At the end, doesn't allow URLs in the SyncUser component not following the /o/ID pattern

### Small improvement ideas

- [ ] Check the clsx package, it could simplify writing className related logic
- [ ] Check whether a useHasInteracted() hook is better solution then the useHasInteracted() parameter
- [ ] Check this idea: in the case a component has more paramters, defaultProps pattern or NextJS's withDefaults helper could be better.
- [ ] The actionClient error handling has to be tested
- [ ] Rename the sync-user.ts to sync-user-action.ts. (Or remove action from all the other actions.)
- [ ] Add unique index to email in user table.
- [ ] Add the max validation for all the fields.
- [ ] I need to think about structuring the db, zod, actions, queries, etc. (the files getting bigger or the number of files in a folder will be too much)
- [ ] I like extend more in the zod file than the current merge
- [ ] Would it make sense to move the type definitions from queries into a separate file?
- [ ] On the function edit page, and probably elsewhere later, the icons should be aligned with the Action header
- [ ] Adding fields to users: isActive, lastLogin
- [ ] Is the "-action" needed in the name of the server action files?
- [ ] Adding placeholder support to input and textarea with label components.
- [ ] client-apis file --> use the FunctionRecord in the case of the first fetch.
- [ ] client-apis file --> think about separating the different entities into separate files.
- [ ] Think about the naming of the zod schemas as currently the naming is a bit messy
- [ ] The user listing page has to be checked thorougly as this is a very naiv implementation
- [ ] The authorization has to be checked everywhere we query or change data
- [ ] Under the \_components we might need to group files based on being client or server side components

### Login / user management

- [ ] Saving user is not perfect now, it is possible that a user is created already, but not yet logged in, so we need to first check whether a user with the email address exists or not.
- [ ] User has to be added to the default organization until multiple ones are supported
- [ ] We need to work out how a user is connected to an organization

### Thing I was not able to do, so needs to be fixed later

- [ ] The slade-in animation in the case of Sidebar through className.
- [ ] The fade-in animation in admin/page.tsx.
- [ ] Uninstall tailwindcss-animate and remove it from tailwind config. (I have it now only for debug purposes.)
- [ ] Check pnpm audit --> Figure out how to manage updates properly.
- [ ] Check pnpm outdated --> Figure out how to manage updates properly.
- [ ] The breadcrumbs component is not yet flexible enough.

## Decisions for feedback

- [ ] I wanted to ensure in one place that if a user is not signed in, then they can't reach other parts of the app except the home page. I tried to do this with in the middleware.ts, but redirecting there resulted in error. Then I tried to do it in the layout, but it turned out that it not sure that a request is chained through the layout (like a middleware), so I dropped that idea. Finally, I managed to do it in the layout with the SignedIn and SingnedOut providers provided by Clerk.
- [ ] I was not able to call "await syncUserToDb()" inside the TSX in the layout. Moving before the return statement wouldn't work, as I wanted to rely on the SignedIn provider. This is why I decided to move it to the `<SyncUser />` component.
- [ ] Originally T3 stack created a JS tailwind config, I changed that to TS.
- [ ] I used originally not fully consciously the "dark" mode. It is applied through class on the body tag. The design I am building is dark, and the light version is not designed. So for now, I add all the color definitions to both the `:root` and `.dark` in the global.css. I assume, this way it will be easy to see which colors have to be adjusted to create a light version.
- [ ] When I implemented the sidebar toggle functionality, I needed to use useState. But it can only be used in a client component, so I was not able to use it in the top layout. So I needed to move `<TopNav />` to the `<MainLayout />`. This component is needed on the Sign In state as well, so I also needed to add to `<SignInLayout />` as well.

# Project Overview and Dev Workflow Summary

This document summarizes the architectural and implementation details of the current project based on our conversation history. It is intended as a reference to reestablish context in a new session or with a new assistant.

---

## Tech Stack

- **Framework**: Next.js 15+ App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth**: Clerk
- **Form Handling**: react-hook-form + zod
- **UI Components**: ShadCN-based design system (e.g., Button, Input, Table, etc.)
- **Icons**: Lucide
- **State/Effects**: SWR for client-side data fetching; safe-actions for form actions (server)
- **Database**: Drizzle
- **Server Action**: next-safe-action

---

## Folder Structure Pattern (Example: `org-units`)

```
src/
  app/
    admin/
      org-units/
        form/
          org-unit-form.tsx          # Form component
          org-unit-form-page.tsx     # Page wrapper: handles create/edit mode
          org-unit-form-loader.tsx   # Loader: fetches orgId + options
          page.tsx                   # Exports loader for route
        page.tsx                     # List page
```

---

## Admin Entity CRUD Pattern

### 1. List Page

- Uses SWR to fetch items (e.g., `/functions`)
- Filters with search bar
- UI via `<Table>` or tree-based structure
- Edit: `router.push(/form?itemId=123)`
- Add new: `router.push(/form)`

### 2. Form Page

- Uses `useForm` from `react-hook-form` with `zodResolver`
- Schema: defined in shared `zod-schemas/*.ts`
- `createXAction` and `updateXAction` for server actions
- Handles both **edit** and **create** modes
- Key logic:

  ```ts
  const mode = item ? "edit" : "create";
  const form = useForm({ defaultValues: ... });
  const onSubmit = values => mode === "edit" ? update(values) : create(values);
  ```

### 3. Form Component (`*-form.tsx`)

- Fully extracted UI form
- Props:

  ```ts
  form: UseFormReturn
  onSubmit: (values) => void
  mode: "create" | "edit"
  isPending: boolean
  additional options (e.g., dropdown data)
  ```

- Includes `SelectWithLabel`, `InputWithLabel`, `TextareaWithLabel`, etc.
- `Cancel` button uses `window.history.back()`

### 4. Selects / Hierarchy

- Supports parent-child relationships
- `SelectWithLabel` component used with `getValue={(item) => item.id.toString()}`
- Can visually indicate depth in hierarchy via indented option labels

---

## Org-Aware Routing

- Plans in progress to support `/o/[orgId]` scoped routing
- Context (`OrgProvider`) will expose current org
- Helper utilities to build links like `getOrgPath("/users") => /o/42/users`
- Auth redirect on login goes to user's org homepage `/o/:orgId`

---

## Middlewares & Access Control

- Plans for middleware at `/o/:orgId/*` to ensure user has access
- Pattern-based access protection (matcher: `/o/:orgId/:path*`)
- Users not in org will be redirected to fallback org or login

---

## UX Details

- Default focus on first input via `<Input autoFocus />`
- New item addition triggers highlight animation on list page (Tailwind `highlight` animation)
- Open/expanded state of tree views handled via `useState` or `openNodes` Set
- Redirection after save with highlight: `router.push("/admin/org-units?highlightId=xxx")`
