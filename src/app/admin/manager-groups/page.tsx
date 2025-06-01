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
    router.push(`/admin/manager-groups/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    toast.info("Delete functionality will be implemented later");
  };

  const handleAddGroup = () => {
    router.push("/admin/manager-groups/create");
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
        <Button onClick={handleAddGroup}>Add New Group</Button>
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Search manager groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-muted-foreground h-24 text-center"
                  >
                    No manager groups found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell>{group.description}</TableCell>
                    <TableCell>{group.members.length} members</TableCell>
                    <TableCell>{formatDate(group.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(group.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(group.id)}
                        >
                          Delete
                        </Button>
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
