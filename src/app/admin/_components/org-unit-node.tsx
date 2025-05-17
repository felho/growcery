"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  ChevronRight as ChevronRightIcon,
  Building2 as Building2Icon,
  Users as UsersIcon,
  PlusCircle as PlusCircleIcon,
  Pencil as PencilIcon,
} from "lucide-react";
import type { OrgUnit } from "~/server/queries/org-unit";
import { cn } from "~/lib/utils";
import { DeleteOrgUnitDialog } from "../org-units/_components/delete-org-unit-dialog";

interface OrgUnitNodeProps {
  unit: OrgUnit;
  allUnits: OrgUnit[];
  level: number;
  openNodes?: Set<number>;
  highlightId?: number;
}

export function OrgUnitNode({
  unit,
  allUnits,
  level,
  openNodes,
  highlightId,
}: OrgUnitNodeProps) {
  const [isOpen, setIsOpen] = useState(openNodes?.has(unit.id) ?? level === 0);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const childUnits = allUnits.filter((u) => u.parentId === unit.id);
  const employeeCount = Math.floor(Math.random() * 10) + 1;

  // Open node if in openNodes set
  useEffect(() => {
    if (openNodes) {
      setIsOpen(openNodes.has(unit.id));
    }
  }, [openNodes, unit.id]);

  // Scroll into view + animate if this is the highlighted unit
  useEffect(() => {
    if (highlightId === unit.id && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightId, unit.id]);

  const handleAddSubUnit = () => {
    router.push(
      `/admin/org-units/form?parentId=${unit.id}&parentName=${encodeURIComponent(unit.name)}`,
    );
  };

  const handleEdit = () => {
    router.push(`/admin/org-units/form?orgUnitId=${unit.id}`);
  };

  return (
    <div ref={ref} className="animate-fade-in">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div
          className={cn(
            "hover:bg-secondary/80 flex items-center gap-4 rounded-md p-3 transition-colors",
            level === 0 && "bg-secondary/40",
            highlightId === unit.id && "animate-highlight",
          )}
        >
          {childUnits.length > 0 ? (
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 cursor-pointer p-0"
              >
                <ChevronRightIcon
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
          ) : (
            <div className="w-5" />
          )}

          <Building2Icon className="text-muted-foreground h-5 w-5" />

          <div className="flex-1">
            <h4 className="font-medium">{unit.name}</h4>
          </div>

          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <UsersIcon className="h-4 w-4" />
            <span>{employeeCount}</span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={handleAddSubUnit}
              className="hover:border-primary hover:bg-primary/10 ml-2 cursor-pointer border border-transparent px-2 py-1 transition-all duration-200"
            >
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Add Sub-unit
            </Button>
            <Button
              variant="ghost"
              onClick={handleEdit}
              className="hover:border-primary hover:bg-primary/10 cursor-pointer border border-transparent px-2 py-1 transition-all duration-200"
            >
              <PencilIcon className="mr-2 h-4 w-4" />
            </Button>
            <DeleteOrgUnitDialog
              onDelete={() => router.refresh()}
              className="hover:border-primary hover:bg-primary/10 cursor-pointer border border-transparent px-2 py-1 transition-all duration-200"
              orgUnitId={unit.id}
            />
          </div>
        </div>

        {childUnits.length > 0 && (
          <CollapsibleContent>
            <div className="border-border mt-1 ml-6 space-y-1 border-l pl-4">
              {childUnits.map((child) => (
                <OrgUnitNode
                  key={child.id}
                  unit={child}
                  allUnits={allUnits}
                  level={level + 1}
                  openNodes={openNodes}
                  highlightId={highlightId}
                />
              ))}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
}
