"use client";

import { useState } from "react";
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
} from "lucide-react";
import type { OrgUnit } from "~/data/mock-data";

interface OrgUnitNodeProps {
  unit: OrgUnit;
  allUnits: OrgUnit[];
  level: number;
}

export function OrgUnitNode({ unit, allUnits, level }: OrgUnitNodeProps) {
  const [isOpen, setIsOpen] = useState(level === 0);
  const router = useRouter();
  const childUnits = allUnits.filter((u) => u.parentId === unit.id);
  const employeeCount = Math.floor(Math.random() * 10) + 1; // Simulated employee count

  const handleAddSubUnit = () => {
    router.push(
      `/admin/org-units/add?parentId=${unit.id}&parentName=${encodeURIComponent(unit.name)}`,
    );
  };

  return (
    <div className="animate-fade-in">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div
          className={`hover:bg-secondary/80 flex items-center gap-4 rounded-md p-3 transition-colors ${level === 0 ? "bg-secondary/40" : ""}`}
        >
          {childUnits.length > 0 ? (
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 cursor-pointer p-0"
              >
                <ChevronRightIcon
                  className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                />
              </Button>
            </CollapsibleTrigger>
          ) : (
            <div className="w-5" />
          )}

          <Building2Icon className="text-muted-foreground h-5 w-5" />

          <div className="flex-1">
            <h4 className="font-medium">{unit.name}</h4>
            <p className="text-muted-foreground text-sm">
              Manager: {unit.description}
            </p>
          </div>

          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <UsersIcon className="h-4 w-4" />
            <span>{employeeCount}</span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={handleAddSubUnit}
              // This is another hover effect that might be interesting
              // className="hover:!bg-primary/10 hover:!text-primary cursor-pointer rounded-md px-2 py-1 transition"
              className="hover:border-primary hover:bg-primary/10 ml-2 cursor-pointer border border-transparent px-2 py-1 transition-all duration-200"
            >
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Add Sub-unit
            </Button>
            <Button
              variant="ghost"
              // This is another hover effect that might be interesting
              // className="hover:!bg-primary/10 hover:!text-primary cursor-pointer rounded-md px-2 py-1 transition"
              className="hover:border-primary hover:bg-primary/10 cursor-pointer border border-transparent px-2 py-1 transition-all duration-200"
            >
              View
            </Button>
          </div>
        </div>

        {childUnits.length > 0 && (
          <CollapsibleContent>
            <div className="border-border mt-1 ml-6 space-y-1 border-l pl-4">
              {childUnits.map((childUnit) => (
                <OrgUnitNode
                  key={childUnit.id}
                  unit={childUnit}
                  allUnits={allUnits}
                  level={level + 1}
                />
              ))}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
}
