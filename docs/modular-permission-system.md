# Idea how to make permission system more modular

This is just an example of how to make the permission system more modular. Also an implementation idea for the permission system to support ABAC type of authorization in a type-safe way.

# Original code

```ts
type Comment = {
  id: string;
  body: string;
  authorId: string;
  createdAt: Date;
};

type Todo = {
  id: string;
  title: string;
  userId: string;
  completed: boolean;
  invitedUsers: string[];
};

type Role = "admin" | "moderator" | "user";
type User = { blockedBy: string[]; roles: Role[]; id: string };

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: User, data: Permissions[Key]["dataType"]) => boolean);

type RolesWithPermissions = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
    }>;
  }>;
};

type Permissions = {
  comments: {
    dataType: Comment;
    action: "view" | "create" | "update";
  };
  todos: {
    // Can do something like Pick<Todo, "userId"> to get just the rows you use
    dataType: Todo;
    action: "view" | "create" | "update" | "delete";
  };
};

const ROLES = {
  admin: {
    comments: {
      view: true,
      create: true,
      update: true,
    },
    todos: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
  },
  moderator: {
    comments: {
      view: true,
      create: true,
      update: true,
    },
    todos: {
      view: true,
      create: true,
      update: true,
      delete: (user, todo) => todo.completed,
    },
  },
  user: {
    comments: {
      view: (user, comment) => !user.blockedBy.includes(comment.authorId),
      create: true,
      update: (user, comment) => comment.authorId === user.id,
    },
    todos: {
      view: (user, todo) => !user.blockedBy.includes(todo.userId),
      create: true,
      update: (user, todo) =>
        todo.userId === user.id || todo.invitedUsers.includes(user.id),
      delete: (user, todo) =>
        (todo.userId === user.id || todo.invitedUsers.includes(user.id)) &&
        todo.completed,
    },
  },
} as const satisfies RolesWithPermissions;

export function hasPermission<Resource extends keyof Permissions>(
  user: User,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"],
) {
  return user.roles.some((role) => {
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[
      action
    ];
    if (permission == null) return false;

    if (typeof permission === "boolean") return permission;
    return data != null && permission(user, data);
  });
}

// USAGE:
const user: User = { blockedBy: ["2"], id: "1", roles: ["user"] };
const todo: Todo = {
  completed: false,
  id: "3",
  invitedUsers: [],
  title: "Test Todo",
  userId: "1",
};

// Can create a comment
hasPermission(user, "comments", "create");

// Can view the `todo` Todo
hasPermission(user, "todos", "view", todo);

// Can view all todos
hasPermission(user, "todos", "view");
```

# Modular Permission System

## Folder Structure

```txt
lib/
└── permissions/
    ├── has-permission.ts
    ├── permissions.ts
    ├── roles/
    │   ├── admin.ts
    │   ├── moderator.ts
    │   └── user.ts
    ├── types.ts
    └── index.ts
```

## Content of the files

### `lib/permissions/types.ts`

```ts
export type Comment = {
  id: string;
  body: string;
  authorId: string;
  createdAt: Date;
};

export type Todo = {
  id: string;
  title: string;
  userId: string;
  completed: boolean;
  invitedUsers: string[];
};

export type Role = "admin" | "moderator" | "user";

export type User = {
  id: string;
  roles: Role[];
  blockedBy: string[];
};

export type Permissions = {
  comments: {
    dataType: Comment;
    action: "view" | "create" | "update";
  };
  todos: {
    dataType: Todo;
    action: "view" | "create" | "update" | "delete";
  };
};

export type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: User, data: Permissions[Key]["dataType"]) => boolean);

export type RolesWithPermissions = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
    }>;
  }>;
};
```

### `lib/permissions/roles/admin.ts`

```ts
import type { RolesWithPermissions } from "../types";

export const adminPermissions: RolesWithPermissions["admin"] = {
  comments: {
    view: true,
    create: true,
    update: true,
  },
  todos: {
    view: true,
    create: true,
    update: true,
    delete: true,
  },
};
```

### `lib/permissions/roles/moderator.ts`

```ts
import type { RolesWithPermissions } from "../types";

export const moderatorPermissions: RolesWithPermissions["moderator"] = {
  comments: {
    view: true,
    create: true,
    update: true,
  },
  todos: {
    view: true,
    create: true,
    update: true,
    delete: (user, todo) => todo.completed,
  },
};
```

### `lib/permissions/roles/user.ts`

```ts
import type { RolesWithPermissions } from "../types";

export const userPermissions: RolesWithPermissions["user"] = {
  comments: {
    view: (user, comment) => !user.blockedBy.includes(comment.authorId),
    create: true,
    update: (user, comment) => comment.authorId === user.id,
  },
  todos: {
    view: (user, todo) => !user.blockedBy.includes(todo.userId),
    create: true,
    update: (user, todo) =>
      todo.userId === user.id || todo.invitedUsers.includes(user.id),
    delete: (user, todo) =>
      (todo.userId === user.id || todo.invitedUsers.includes(user.id)) &&
      todo.completed,
  },
};
```

### `lib/permissions/permissions.ts`

```ts
import { adminPermissions } from "./roles/admin";
import { moderatorPermissions } from "./roles/moderator";
import { userPermissions } from "./roles/user";
import type { RolesWithPermissions } from "./types";

export const ROLES: RolesWithPermissions = {
  admin: adminPermissions,
  moderator: moderatorPermissions,
  user: userPermissions,
};
```

### `lib/permissions/has-permission.ts`

```ts
import { ROLES } from "./permissions";
import type { User, Permissions } from "./types";

export function hasPermission<Resource extends keyof Permissions>(
  user: User,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"],
): boolean {
  return user.roles.some((role) => {
    const permission = ROLES[role][resource]?.[action];
    if (permission == null) return false;

    if (typeof permission === "boolean") return permission;
    return data != null && permission(user, data);
  });
}
```

### `lib/permissions/index.ts`

```ts
export * from "./has-permission";
export * from "./types";
```
