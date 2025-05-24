# Authorization Architecture for Competency Matrix System

This document outlines the recommended authorization strategy for the competency matrix application, covering roles, permissions, structure, and practical organization within a Next.js project.

---

## 1. Overview

We aim to implement an **Attribute-Based Access Control (ABAC)** system that considers:

- Who is acting (user, roles)
- What resource they’re accessing (e.g., matrix, rating)
- What action they want to perform (e.g., view, edit)
- What contextual attributes exist (e.g., user is manager of target)

---

## 2. Role Definitions

### Role Hierarchy

- **super_admin**  
  System-wide access across all organizations  
  Can manage organizations and global settings  
  Technical administration capabilities

- **org_admin**  
  Full access to all features within their organization  
  Can manage all users, structures, and settings within their organization  
  Cannot access other organizations' data

- **hr_manager**  
  Can manage users, org units, functions, and archetypes  
  Can create and manage competency matrices  
  Can view all reports and assessments

- **manager_chain_member**  
  This role is implicit and derived from the `managerId` field.  
  A user is considered part of the managerial chain of another if they appear at any level above them in the manager hierarchy.  
  Access is granted based on hierarchical relationships without relying on explicit org unit manager assignments.  
  Enables access to assessments and reporting data for all users under them in the chain.

- **direct_manager**  
  This role is implicit and derived directly from the `managerId` field.  
  A user is a direct manager of another if their `id` is listed as the `managerId` of the other user.  
  They can view and assess competency matrices for their direct reports.  
  No administrative capabilities.

- **user**  
  Can view and self-assess their own competency matrices  
  Limited view of organizational structure

- **peer_manager**  
  This role is implicit and derived based on manager hierarchy and org unit grouping.  
  A user is considered a peer manager if:
  - They are both managers (i.e., have direct reports)
  - They are not in the same management chain (i.e., not above/below each other)
  - The `orgUnitId` of their reports belong to org units that share the same parent org unit  
    This logic ensures peer calibration is scoped to logically grouped departments, even if multiple teams exist under a shared organizational unit.

---

## 3. Permissions Model

### Permission Categories

- **Administrative**

  - `manage_users`
  - `manage_org_units`
  - `manage_functions`
  - `manage_archetypes`

- **Competency Matrix**

  - `create_matrix`
  - `edit_matrix`
  - `assign_matrix`
  - `view_matrix`
  - `rate_matrix`

- **Reports**

  - `view_reports`
  - `export_reports`

- **Scopes**
  - `org_wide`: Entire organization
  - `department_only`: Limited to specific org unit
  - `team_only`: Direct reports only
  - `self_only`: User's own data only

### Org Unit vs Manager Chain Context

The authorization system uses a dual-context model to determine access:

- **Org Unit Context:** Permissions scoped to organizational units (`orgUnitId`), typically used for department-level managers who have access within their org unit boundaries.
- **Manager Chain Context:** Permissions based on the managerial hierarchy (`managerId` chain), supporting direct and indirect management relationships.

In practice, the system resolves access primarily using the manager chain context. Org unit data may be used as a metadata aid but does not define managerial authority.

This model enables scenarios such as:

- Department managers accessing all users within their org unit.
- Team leads and peer managers accessing users based on reporting lines.
- Cross-departmental peer evaluations where manager chains intersect but org units differ.

---

### Example Resource and Actions

```ts
type Permissions = {
  matrix: {
    dataType: DecoratedMatrix;
    action:
      | "view"
      | "edit"
      | "accessJointDiscussionView"
      | "accessCalibrationView";
  };
  rating: {
    dataType: RatingRow;
    action: "view" | "edit";
  };
};
```

### Example `hasPermission` Function

```ts
function hasPermission(
  user: User,
  resource: "matrix",
  action: Permission,
  decorated: DecoratedMatrix,
): boolean {
  switch (action) {
    case "view":
      return (
        decorated.viewerIsOwner ||
        decorated.viewerIsDirectManager ||
        decorated.viewerHasObserverAccess ||
        decorated.managersInChain.includes(user.id)
      );
    case "edit":
      return (
        decorated.matrix.state === "assessment" &&
        ((decorated.viewerIsOwner && !decorated.matrix.assessmentDoneByUser) ||
          (decorated.viewerIsDirectManager &&
            !decorated.matrix.assessmentDoneByManager))
      );
    default:
      return false;
  }
}
```

---

## 4. File Structure

Organize permission-related logic under `lib/permissions/`:

```txt
lib/
└── permissions/
    ├── has-permission.ts       # Core logic
    ├── permissions.ts          # Resources & actions mapping
    ├── types.ts                # Role and permission types
    ├── index.ts                # Entry point
    └── roles/
        ├── super_admin.ts
        ├── org_admin.ts
        ├── hr_manager.ts
        ├── manager.ts
        ├── user.ts
```

Each file under `roles/` exports only the relevant subset of rules for its role.

---

## 5. Integration Points

### Server-side

- Call `hasPermission()` before performing sensitive operations in route handlers or API endpoints.
- Optional: Decorate data before passing into permission functions (e.g., build `DecoratedMatrix`).
- **Context resolution (org unit vs manager chain) should happen prior to permission checks. A utility like `getScopeFilter()` can help determine the applicable scope filter for queries and access control.**

### Client-side

- Use `hasPermission()` to disable/hide controls in the UI.
- Keep permission checks minimal on client side — server is source of truth.

---

## 6. Future Enhancements

- Extend ABAC conditions with dynamic attributes (e.g. assignment state).
- Support scoped permissions in review cycles.
- Add UI to simulate access or preview permission rules.
