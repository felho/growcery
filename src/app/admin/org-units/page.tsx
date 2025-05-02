"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import {
  PlusCircle as PlusCircleIcon,
  Search as SearchIcon,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import Breadcrumbs from "../_components/breadcrumbs";
import { OrgUnitNode } from "../_components/org-unit-node";
import { fetchOrgUnits } from "~/lib/client-api";
import type { OrgUnitRecord } from "~/server/queries";

export default function OrgUnitsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const highlightId = searchParams.get("highlightId");

  const {
    data: orgUnits = [],
    isLoading,
    error,
  } = useSWR("/org-units", fetchOrgUnits);

  const filteredUnitIds = getMatchingUnitIds(orgUnits, searchTerm);
  const visibleUnits = orgUnits.filter((u) => filteredUnitIds.has(u.id));
  const openNodeIds = getOpenNodeIds(orgUnits, searchTerm, highlightId);

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
        {isLoading ? (
          <div className="text-muted-foreground py-8 text-center">
            Loading org units...
          </div>
        ) : error ? (
          <div className="text-destructive py-8 text-center">
            Failed to load org units.
          </div>
        ) : visibleUnits.filter((u) => !u.parentId).length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            No organizational units found. Click "Add Root Unit" to create one.
          </div>
        ) : (
          visibleUnits
            .filter((unit) => !unit.parentId)
            .map((unit) => (
              <OrgUnitNode
                key={unit.id}
                unit={unit}
                allUnits={visibleUnits}
                level={0}
                openNodes={openNodeIds}
                highlightId={highlightId ? Number(highlightId) : undefined}
              />
            ))
        )}
      </div>
    </div>
  );
}

function getMatchingUnitIds(
  units: OrgUnitRecord[],
  searchTerm: string,
): Set<number> {
  if (!searchTerm) {
    return new Set(units.map((u) => u.id));
  }

  const matched = new Set<number>();

  function matchRecursive(unit: OrgUnitRecord): boolean {
    const match =
      unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (unit.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false);

    const children = units.filter((u) => u.parentId === unit.id);
    const childMatch = children.map(matchRecursive).some(Boolean);

    if (match || childMatch) {
      matched.add(unit.id);
      if (unit.parentId) matched.add(unit.parentId);
    }

    return match || childMatch;
  }

  units.forEach((u) => matchRecursive(u));
  return matched;
}

function getOpenNodeIds(
  units: OrgUnitRecord[],
  searchTerm: string,
  highlightId?: string | null,
): Set<number> {
  const open = new Set<number>();

  if (searchTerm) {
    function collectOpenIds(unit: OrgUnitRecord): boolean {
      const match =
        unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (unit.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false);

      const children = units.filter((u) => u.parentId === unit.id);
      const childMatch = children.map(collectOpenIds).some(Boolean);

      if (match || childMatch) {
        open.add(unit.id);
        if (unit.parentId) open.add(unit.parentId);
      }

      return match || childMatch;
    }

    units.forEach((u) => collectOpenIds(u));
  } else {
    units.filter((u) => !u.parentId).forEach((u) => open.add(u.id));
  }

  if (highlightId) {
    const highlightNum = Number(highlightId);
    const map = new Map(units.map((u) => [u.id, u]));
    let current = map.get(highlightNum);
    while (current?.parentId) {
      open.add(current.parentId);
      current = map.get(current.parentId);
    }
  }

  return open;
}
