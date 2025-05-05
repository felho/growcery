"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetchUserArchetypes } from "~/lib/client-api/user-archetypes";
import type { UserArchetype } from "~/server/queries/user-archetypes";
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
import { toast } from "sonner";
import Breadcrumbs from "../_components/breadcrumbs";

export default function UserArchetypesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: archetypes = [],
    isLoading,
    error,
  } = useSWR("/user-archetypes", fetchUserArchetypes);

  const filteredArchetypes = archetypes.filter((archetype: UserArchetype) =>
    [archetype.name, archetype.description || ""].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  const handleEdit = (id: number) => {
    router.push(`/admin/user-archetypes/form?archetypeId=${id}`);
  };

  const handleDelete = (id: number) => {
    toast(`Delete archetype with ID: ${id}`);
  };

  const handleAddArchetype = () => {
    router.push("/admin/user-archetypes/form");
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in space-y-6">
        <Breadcrumbs />
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading archetypes...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in space-y-6">
        <Breadcrumbs />
        <div className="flex items-center justify-center py-8">
          <div className="text-destructive">Failed to load archetypes</div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <Breadcrumbs />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Archetypes</h1>
          <p className="text-muted-foreground mt-1">
            Manage user archetypes in your organization
          </p>
        </div>

        <Button
          onClick={handleAddArchetype}
          className="shrink-0 cursor-pointer"
        >
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add Archetype
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder="Search archetypes..."
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
                Name
              </TableHead>
              <TableHead className="text-muted-foreground text-xs font-medium">
                Description
              </TableHead>
              <TableHead className="text-muted-foreground w-[100px] text-xs font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArchetypes.map((archetype) => (
              <TableRow key={archetype.id} className="h-16">
                <TableCell>
                  <div className="font-medium">{archetype.name}</div>
                </TableCell>
                <TableCell>
                  <div className="text-muted-foreground">
                    {archetype.description || "-"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => handleEdit(archetype.id)}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => handleDelete(archetype.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredArchetypes.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-muted-foreground py-8 text-center"
                >
                  No archetypes found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
