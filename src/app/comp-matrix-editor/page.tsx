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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Plus, Edit, FileText } from "lucide-react";
import useSWR from "swr";
import { fetchCompMatrices } from "~/lib/client-api/comp-matrix";
import { fetchFunctions } from "~/lib/client-api/functions";
import type { CompMatrix } from "~/server/queries/comp-matrix";
import type { Function } from "~/server/queries/function";

const CompetencyMatrixList = () => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // TODO: add type here
  const [newMatrix, setNewMatrix] = useState({
    name: "",
    functionId: "",
    published: false,
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

  if (isLoadingMatrices || isLoadingFunctions) {
    return (
      <div className="container mx-auto space-y-6 py-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (matricesError || functionsError) {
    return (
      <div className="container mx-auto space-y-6 py-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-destructive">Failed to load data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Competency Matrices</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
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
                      <Link href={`/comp-matrix-editor/${matrix.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Competency Matrix</DialogTitle>
            <DialogDescription>
              Define the basic properties of your new competency matrix.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Matrix Name</Label>
              <Input
                id="name"
                value={newMatrix.name}
                onChange={(e) =>
                  setNewMatrix({ ...newMatrix, name: e.target.value })
                }
                placeholder="e.g., Engineering Competency Matrix"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="function">Function</Label>
              <Select
                value={newMatrix.functionId}
                onValueChange={(value) =>
                  setNewMatrix({ ...newMatrix, functionId: value })
                }
              >
                <SelectTrigger id="function">
                  <SelectValue placeholder="Select a function" />
                </SelectTrigger>
                <SelectContent>
                  {functions.map((func: Function) => (
                    <SelectItem key={func.id} value={func.id.toString()}>
                      {func.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="published"
                checked={newMatrix.published}
                onCheckedChange={(checked) =>
                  setNewMatrix({ ...newMatrix, published: checked })
                }
              />
              <Label htmlFor="published">Publish immediately</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => setIsDialogOpen(false)}
              disabled={!newMatrix.name || !newMatrix.functionId}
            >
              Create Matrix
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompetencyMatrixList;
