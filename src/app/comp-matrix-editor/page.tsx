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
import { mockFunctions } from "~/data/mock-competency-data";

// Interface for our matrix metadata
interface CompetencyMatrixMeta {
  id: string;
  name: string;
  functionId: string;
  functionName: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock data for matrices
const mockMatrices: CompetencyMatrixMeta[] = [
  {
    id: "1",
    name: "Software Engineering Matrix",
    functionId: "func1",
    functionName: "Engineering",
    published: true,
    createdAt: "2025-04-01",
    updatedAt: "2025-05-01",
  },
  {
    id: "2",
    name: "Product Management Matrix",
    functionId: "func2",
    functionName: "Product",
    published: false,
    createdAt: "2025-04-10",
    updatedAt: "2025-04-30",
  },
  {
    id: "3",
    name: "Design Matrix",
    functionId: "func3",
    functionName: "Design",
    published: true,
    createdAt: "2025-03-15",
    updatedAt: "2025-04-20",
  },
];

const CompetencyMatrixList = () => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [matrices, setMatrices] =
    useState<CompetencyMatrixMeta[]>(mockMatrices);
  const [newMatrix, setNewMatrix] = useState({
    name: "",
    functionId: "",
    published: false,
  });

  const handleCreateMatrix = () => {
    const id = `matrix-${Date.now()}`;
    const functionName =
      mockFunctions.find((f) => f.id === newMatrix.functionId)?.name || "";

    const matrix: CompetencyMatrixMeta = {
      id,
      name: newMatrix.name,
      functionId: newMatrix.functionId,
      functionName,
      published: newMatrix.published,
      createdAt: new Date().toISOString().split("T")[0] || "",
      updatedAt: new Date().toISOString().split("T")[0] || "",
    };

    setMatrices([...matrices, matrix]);
    setIsDialogOpen(false);
    setNewMatrix({ name: "", functionId: "", published: false });

    // Navigate to the new matrix editor
    router.push(`/comp-matrix-editor/${id}`);
  };

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
              {matrices.map((matrix) => (
                <TableRow key={matrix.id}>
                  <TableCell className="font-medium">{matrix.name}</TableCell>
                  <TableCell>{matrix.functionName}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        matrix.published
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {matrix.published ? "Published" : "Draft"}
                    </span>
                  </TableCell>
                  <TableCell>{matrix.updatedAt}</TableCell>
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
                  {mockFunctions.map((func) => (
                    <SelectItem key={func.id} value={func.id}>
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
              onClick={handleCreateMatrix}
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
