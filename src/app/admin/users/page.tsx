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
  Edit as EditIcon,
  Trash as TrashIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { toast } from "sonner";
import Breadcrumbs from "../_components/breadcrumbs";
import { getOrgUnitName } from "~/data/mock-data";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetchUsers } from "~/lib/client-api";
import type { User } from "~/server/queries/users";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const { data: users = [], isLoading, error } = useSWR("/users", fetchUsers);

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getOrgUnitName(user.orgUnitId ?? 0)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const handleEdit = (id: number) => {
    router.push(`/admin/users/form?userId=${id}`);
  };

  const handleDelete = (id: string) => {
    toast(`Delete user with ID: ${id}`);
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
                <TableCell>User</TableCell>
                <TableCell>{getOrgUnitName(user.orgUnitId ?? 0)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => handleEdit(user.id)}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => handleDelete(user.id.toString())}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
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
    </div>
  );
}
