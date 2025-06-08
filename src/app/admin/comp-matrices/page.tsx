"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Plus, Pencil as PencilIcon } from "lucide-react";
import useSWR, { mutate } from "swr";
import {
  fetchCompMatrices,
  deleteCompMatrix,
} from "~/lib/client-api/comp-matrix";
import { fetchFunctions } from "~/lib/client-api/functions";
import type { CompMatrix } from "~/server/queries/comp-matrix";
import { CreateMatrixDialog } from "./_components/create-matrix-dialog";
import { DeleteMatrixDialog } from "./_components/delete-matrix-dialog";
import { toast } from "sonner";
import Breadcrumbs from "../_components/breadcrumbs";

const CompetencyMatrixList = () => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMatrix, setNewMatrix] = useState({
    name: "",
    functionId: "",
    published: false,
    levelCode: "L",
  });

  const {
    data: matrices = [],
    isLoading: isLoadingMatrices,
    error: matricesError,
  } = useSWR("/comp-matrices", fetchCompMatrices);

  const {
    data: functions = [],
    isLoading: isLoadingFunctions,
    error: functionsError,
  } = useSWR("/functions", fetchFunctions);

  const handleDelete = async (id: number) => {
    try {
      await deleteCompMatrix(id);
      toast.success("Matrix deleted successfully");
      await mutate("/comp-matrices");
    } catch (error) {
      console.error("Failed to delete matrix:", error);
      toast.error("Failed to delete matrix");
    }
  };

  if (isLoadingMatrices || isLoadingFunctions) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (matricesError || functionsError) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-destructive">Failed to load data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <Breadcrumbs />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Competency Matrices</h1>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Matrix
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Competency Matrices</CardTitle>
          <CardDescription>
            Manage and edit your organization's competency matrices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Function</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matrices.map((matrix: CompMatrix) => (
                <TableRow key={matrix.id}>
                  <TableCell className="font-medium">{matrix.title}</TableCell>
                  <TableCell>
                    {functions.find((f) => f.id === matrix.functionId)?.name}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        matrix.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {matrix.isPublished ? "Published" : "Draft"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(matrix.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/admin/comp-matrices/editor?matrixId=${matrix.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteMatrixDialog
                        onDelete={() => handleDelete(matrix.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {matrices.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-muted-foreground py-8 text-center"
                  >
                    No matrices found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateMatrixDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        functions={functions}
        newMatrix={newMatrix}
        onMatrixChange={setNewMatrix}
        onSubmit={() => setIsDialogOpen(false)}
      />
    </div>
  );
};

export default CompetencyMatrixList;
