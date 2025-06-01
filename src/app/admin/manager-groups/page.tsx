"use client";

import React from "react";
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
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetchManagerGroups } from "~/lib/client-api/manager-groups";
import type { ManagerGroupWithMembers } from "~/server/queries/manager-group";
import { toast } from "sonner";
import Breadcrumbs from "../_components/breadcrumbs";
import { formatDate } from "~/lib/utils";
import { PlusCircle, Search, Users, Pencil as PencilIcon } from "lucide-react";
import { DeleteManagerGroupDialog } from "./_components/delete-manager-group-dialog";

const ManagerGroups = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const {
    data: managerGroups,
    error,
    isLoading,
  } = useSWR("managerGroups", fetchManagerGroups);

  const filteredGroups =
    managerGroups?.filter(
      (group) =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (group.description?.toLowerCase() || "").includes(
          searchTerm.toLowerCase(),
        ),
    ) || [];

  const handleEdit = (id: number) => {
    router.push(`/admin/manager-groups/form?id=${id}`);
  };

  const handleDelete = () => {
    // This is handled by the DeleteManagerGroupDialog component
    router.refresh();
  };

  const handleAddGroup = () => {
    router.push("/admin/manager-groups/form");
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in space-y-6">
        <Breadcrumbs />
        <div className="text-muted-foreground py-8 text-center">
          Loading manager groups...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in space-y-6">
        <Breadcrumbs />
        <div className="bg-destructive/15 text-destructive rounded-md p-4">
          Error loading manager groups: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <Breadcrumbs />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manager Groups</h1>
          <p className="text-muted-foreground mt-1">
            Organize managers into groups for better coordination
          </p>
        </div>
        <Button onClick={handleAddGroup} className="shrink-0">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Manager Group
        </Button>
      </div>

      <div className="space-y-4">
        <div className="relative w-full max-w-sm">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder="Search manager groups..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground text-xs font-medium">
                  Name
                </TableHead>
                <TableHead className="text-muted-foreground text-xs font-medium">
                  Description
                </TableHead>
                <TableHead className="text-muted-foreground text-xs font-medium">
                  Members
                </TableHead>
                <TableHead className="text-muted-foreground text-xs font-medium">
                  Created
                </TableHead>
                <TableHead className="text-muted-foreground w-[100px] text-xs font-medium">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-muted-foreground py-8 text-center"
                  >
                    No manager groups found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell>
                      <div className="text-muted-foreground max-w-xs truncate text-sm">
                        {group.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="text-muted-foreground mr-1 h-4 w-4" />
                        <span>{group.members.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(group.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(group.id)}
                          className="cursor-pointer"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <DeleteManagerGroupDialog
                          onDelete={handleDelete}
                          managerGroupId={group.id}
                          className="hover:bg-destructive/10"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ManagerGroups;
