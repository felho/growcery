"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  PlusCircle as PlusCircleIcon,
  Search as SearchIcon,
} from "lucide-react";
import Breadcrumbs from "../_components/breadcrumbs";
import { orgUnits as initialOrgUnits } from "~/data/mock-data";
import { OrgUnitNode } from "../_components/org-unit-node";
import type { OrgUnit } from "~/data/mock-data";

function filterOrgUnitsRecursively(
  units: OrgUnit[],
  search: string,
): OrgUnit[] {
  if (!search.trim()) return units;

  const lowerSearch = search.toLowerCase();
  const matched = new Set<number>();

  function dfs(unit: OrgUnit): boolean {
    const match = unit.name.toLowerCase().includes(lowerSearch);
    const children = units.filter((u) => u.parentId === unit.id);
    let childMatch = false;

    for (const child of children) {
      if (dfs(child)) {
        childMatch = true;
      }
    }

    if (match || childMatch) {
      matched.add(unit.id);
    }

    return match || childMatch;
  }

  units.filter((u) => !u.parentId).forEach((root) => dfs(root));
  return units.filter((u) => matched.has(u.id));
}

export default function OrgUnitsPage() {
  const [orgUnits] = useState<OrgUnit[]>(initialOrgUnits);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredOrgUnits = filterOrgUnitsRecursively(orgUnits, searchTerm);
  const rootUnits = filteredOrgUnits.filter((unit) => !unit.parentId);

  const handleAddOrgUnit = () => {
    router.push("/admin/org-units/form");
  };

  return (
    <div className="animate-fade-in space-y-6">
      <Breadcrumbs />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organizational Structure</h1>
          <p className="text-muted-foreground mt-1">
            Click on units to expand and view their sub-units
          </p>
        </div>

        <Button onClick={handleAddOrgUnit} className="shrink-0 cursor-pointer">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add Root Unit
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder="Search org units..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2 rounded-lg border p-4">
        {rootUnits.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            No organizational units found. Click "Add Root Unit" to create one.
          </div>
        ) : (
          rootUnits.map((unit) => (
            <OrgUnitNode
              key={unit.id}
              unit={unit}
              allUnits={filteredOrgUnits}
              level={0}
            />
          ))
        )}
      </div>
    </div>
  );
}
