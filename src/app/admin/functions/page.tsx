"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import type { Function } from "~/data/mock-data";
import { functions as initialFunctions } from "~/data/mock-data";

export default function FunctionsPage() {
  const router = useRouter();
  const [functions, setFunctions] = useState<Function[]>(initialFunctions);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFunctions = functions.filter((func) =>
    [func.name, func.description, func.type].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  const handleEdit = (id: string) => {
    toast(`Edit function with ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    toast(`Delete function with ID: ${id}`);
  };

  const handleAddFunction = () => {
    router.push("/admin/functions/add");
  };

  return (
    <div className="animate-fade-in space-y-6">
      <Breadcrumbs />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Functions</h1>
          <p className="text-muted-foreground mt-1">
            Manage your organization's functions
          </p>
        </div>

        <Button onClick={handleAddFunction} className="shrink-0 cursor-pointer">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add Function
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder="Search functions..."
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
              <TableHead>Type</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFunctions.map((func) => (
              <TableRow key={func.id}>
                <TableCell className="font-medium break-words whitespace-normal">
                  {func.name}
                </TableCell>
                <TableCell className="break-words whitespace-normal">
                  {func.description}
                </TableCell>
                <TableCell>{func.type}</TableCell>
                <TableCell>
                  {new Date(func.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => handleEdit(func.id)}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => handleDelete(func.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredFunctions.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-muted-foreground py-8 text-center"
                >
                  No functions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
