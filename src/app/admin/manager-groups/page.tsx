"use client";
import React, { useState } from "react";
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
import { PlusCircle, Search, Edit, Trash, Users } from "lucide-react";
import { toast } from "sonner";
import Breadcrumbs from "../_components/breadcrumbs";
import { useRouter } from "next/navigation";

// Mock data for manager groups
const mockManagerGroups = [
  {
    id: "1",
    name: "Engineering Leadership",
    description: "Senior engineering managers and tech leads",
    memberCount: 8,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Product Management",
    description: "Product managers across all teams",
    memberCount: 5,
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    name: "Sales Directors",
    description: "Regional sales directors and team leads",
    memberCount: 12,
    createdAt: "2024-01-20",
  },
];

const ManagerGroups = () => {
  const [managerGroups, setManagerGroups] = useState(mockManagerGroups);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Filter manager groups based on search term
  const filteredGroups = managerGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEdit = (id: string) => {};

  const handleDelete = (id: string) => {};

  const handleAddGroup = () => {
    router.push("/admin/manager-groups/create");
  };

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

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder="Search manager groups..."
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
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>
                  <div className="font-medium">{group.name}</div>
                </TableCell>
                <TableCell>
                  <div className="text-muted-foreground max-w-xs truncate text-sm">
                    {group.description}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Users className="text-muted-foreground mr-1 h-4 w-4" />
                    <span>{group.memberCount}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(group.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(group.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(group.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredGroups.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-muted-foreground py-8 text-center"
                >
                  No manager groups found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ManagerGroups;
