"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  PlusCircle as PlusCircleIcon,
  Search as SearchIcon,
  Pencil as PencilIcon,
  Grid3X3 as Grid3X3Icon,
  Plus as PlusIcon,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { toast } from "sonner";
import Breadcrumbs from "../_components/breadcrumbs";
import { fetchOrgUnits } from "~/lib/client-api/org-units";
import type { OrgUnit } from "~/server/queries/org-unit";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetchUsersWithMatrixNames } from "~/lib/client-api";
import { fetchPublishedCompMatrices } from "~/lib/client-api/comp-matrices";
import type { UserWithActiveMatrixName } from "~/server/queries/user/get-all-with-active-matrix-name";
import type { CompMatrixForAssignment } from "~/server/queries/comp-matrix/get-published";
import { AssignMatrixDialog } from "./_components/assign-matrix-dialog";
import { useAction } from "next-safe-action/hooks";
import { deleteUserAction } from "~/server/actions/user/delete";
import { DeleteUserDialog } from "./_components/delete-user-dialog";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const {
    data: users = [],
    isLoading: isLoadingUsers,
    error: usersError,
    mutate,
  } = useSWR<UserWithActiveMatrixName[]>(
    "/users/with-matrix-names",
    fetchUsersWithMatrixNames,
  );

  const { data: matrices = [], isLoading: isLoadingMatrices } = useSWR<
    CompMatrixForAssignment[]
  >("/comp-matrices/published", fetchPublishedCompMatrices);

  // Dialog kezelés
  const [isAssignMatrixDialogOpen, setIsAssignMatrixDialogOpen] =
    useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>("");
  const [selectedUserFunctionId, setSelectedUserFunctionId] = useState<
    number | null
  >(null);

  const {
    data: orgUnits = [],
    isLoading: isLoadingOrgUnits,
    error: orgUnitsError,
  } = useSWR<OrgUnit[]>("/org-units", fetchOrgUnits);

  const getOrgUnitName = (id: number): string => {
    const orgUnit = orgUnits.find((ou) => ou.id === id);
    return orgUnit ? orgUnit.name : "Unknown";
  };

  const filteredUsers = users
    .filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getOrgUnitName(user.orgUnitId ?? 0)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user.archetype?.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => a.fullName.localeCompare(b.fullName));

  const { execute: deleteUser } = useAction(deleteUserAction, {
    onSuccess: () => {
      toast.success("User deleted successfully");
      void mutate();
    },
    onError: () => toast.error("Failed to delete user"),
  });

  const handleEdit = (id: number) => {
    router.push(`/admin/users/form?userId=${id}`);
  };

  const handleAssignMatrix = (
    userId: number,
    fullName: string,
    functionId: number | null,
  ) => {
    if (!functionId) {
      toast.error("User doesn't have a function assigned");
      return;
    }

    setSelectedUserId(userId);
    setSelectedUserName(fullName);
    setSelectedUserFunctionId(functionId);
    setIsAssignMatrixDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteUser({ id });
  };

  const handleAddUser = () => {
    router.push("/admin/users/form");
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

  const isLoading = isLoadingUsers || isLoadingOrgUnits;
  const error = usersError || orgUnitsError;

  if (isLoading) {
    return (
      <div className="animate-fade-in space-y-6">
        <Breadcrumbs />
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading users...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in space-y-6">
        <Breadcrumbs />
        <div className="flex items-center justify-center py-8">
          <div className="text-destructive">Failed to load users</div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <Breadcrumbs />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage users in your organization
          </p>
        </div>

        <Button onClick={handleAddUser} className="shrink-0 cursor-pointer">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground text-xs font-medium">
                User
              </TableHead>
              <TableHead className="text-muted-foreground text-xs font-medium">
                Role
              </TableHead>
              <TableHead className="text-muted-foreground text-xs font-medium">
                Org Unit
              </TableHead>
              <TableHead className="text-muted-foreground text-xs font-medium">
                Archetype
              </TableHead>
              <TableHead className="text-muted-foreground text-xs font-medium">
                Competency Matrix
              </TableHead>
              <TableHead className="text-muted-foreground w-[100px] text-xs font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="h-16">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {getInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-muted-foreground text-xs">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.isManager ? "Manager" : "User"}</TableCell>
                <TableCell>{getOrgUnitName(user.orgUnitId ?? 0)}</TableCell>
                <TableCell>{user.archetype?.name ?? "-"}</TableCell>
                <TableCell>
                  {user.activeMatrix ? (
                    <Badge variant="secondary">
                      <Grid3X3Icon className="mr-2 h-4 w-4" />
                      {user.activeMatrix.title}
                    </Badge>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleAssignMatrix(
                          user.id,
                          user.fullName,
                          user.functionId,
                        )
                      }
                      className="!border-primary flex h-7 cursor-pointer items-center gap-1 border text-xs"
                    >
                      <PlusIcon className="h-3 w-3" />
                      Assign Matrix
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => handleEdit(user.id)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <DeleteUserDialog
                      onDelete={() => handleDelete(user.id)}
                      className="cursor-pointer"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-muted-foreground py-8 text-center"
                >
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedUserId !== null && selectedUserFunctionId !== null && (
        <AssignMatrixDialog
          userId={selectedUserId}
          userName={selectedUserName}
          functionId={selectedUserFunctionId}
          open={isAssignMatrixDialogOpen}
          onOpenChange={setIsAssignMatrixDialogOpen}
          onSuccess={() => mutate()}
          matrices={matrices}
          isLoading={isLoadingMatrices}
        />
      )}
    </div>
  );
}
