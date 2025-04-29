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
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { toast } from "sonner";
import Breadcrumbs from "../_components/breadcrumbs";
import { users as initialUsers, getOrgUnitName } from "~/data/mock-data";
import type { User } from "~/data/mock-data"; // ha van ilyen típusod
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getOrgUnitName(user.orgUnit)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const handleEdit = (id: string) => {
    toast(`Edit user with ID: ${id}`);
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
                Status
              </TableHead>
              <TableHead className="text-muted-foreground text-xs font-medium">
                Last Login
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
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-muted-foreground text-xs">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{getOrgUnitName(user.orgUnit)}</TableCell>
                <TableCell>
                  {user.status === "active" ? (
                    <div className="flex items-center">
                      <CheckCircleIcon className="mr-1 h-4 w-4 text-green-500" />
                      <span>Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <XCircleIcon className="mr-1 h-4 w-4 text-red-500" />
                      <span>Inactive</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(user.lastLogin).toLocaleDateString()}
                </TableCell>
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
                      onClick={() => handleDelete(user.id)}
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
