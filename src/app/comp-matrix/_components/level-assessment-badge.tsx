import React, { useState } from "react";
import { Pencil, Save, X } from "lucide-react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { createLevelAssessmentAction } from "~/server/actions/comp-matrix-level-assessments/create";
import { updateLevelAssessmentAction } from "~/server/actions/comp-matrix-level-assessments/update";
import { toast } from "sonner";

interface LevelAssessmentBadgeProps {
  userCompMatrixAssignmentId: number;
  compMatrixId: number;
  isGeneral: boolean;
  compMatrixAreaId?: number;
  initialMainLevel?: number;
  initialSubLevel?: number;
  maxLevel: number;
  onSave?: () => void;
}

export function LevelAssessmentBadge({
  userCompMatrixAssignmentId,
  compMatrixId,
  isGeneral,
  compMatrixAreaId,
  initialMainLevel,
  initialSubLevel,
  maxLevel,
  onSave,
}: LevelAssessmentBadgeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [mainLevel, setMainLevel] = useState(
    initialMainLevel?.toString() ?? "",
  );
  const [subLevel, setSubLevel] = useState(initialSubLevel?.toString() ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const mainLevelNum = parseInt(mainLevel);
    const subLevelNum = parseInt(subLevel);

    // Validate input
    if (
      isNaN(mainLevelNum) ||
      isNaN(subLevelNum) ||
      mainLevelNum < 1 ||
      mainLevelNum > maxLevel ||
      subLevelNum < 1 ||
      subLevelNum > 3
    ) {
      toast.error("Invalid level values");
      return;
    }

    setIsSaving(true);
    try {
      const data = {
        userCompMatrixAssignmentId,
        compMatrixId,
        isGeneral,
        compMatrixAreaId,
        mainLevel: mainLevelNum,
        subLevel: subLevelNum,
      };

      if (initialMainLevel && initialSubLevel) {
        await updateLevelAssessmentAction(data);
      } else {
        await createLevelAssessmentAction(data);
      }

      toast.success("Level assessment saved");
      setIsEditing(false);
      onSave?.();
    } catch (error) {
      toast.error("Failed to save level assessment");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setMainLevel(initialMainLevel?.toString() ?? "");
    setSubLevel(initialSubLevel?.toString() ?? "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Input
            type="number"
            min={1}
            max={maxLevel}
            value={mainLevel}
            onChange={(e) => setMainLevel(e.target.value)}
            className="h-6 w-12 text-sm"
            placeholder="e.g. 2"
          />
          <span className="text-sm">.</span>
          <Input
            type="number"
            min={1}
            max={3}
            value={subLevel}
            onChange={(e) => setSubLevel(e.target.value)}
            className="h-6 w-12 text-sm"
            placeholder="e.g. 2"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="text-green-600 hover:text-green-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
        </button>
        <button
          onClick={handleCancel}
          className="text-gray-600 hover:text-gray-800"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "rounded px-2 py-0.5 text-sm font-medium",
          initialMainLevel && initialSubLevel
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800",
        )}
      >
        {initialMainLevel && initialSubLevel
          ? `${initialMainLevel}.${initialSubLevel}`
          : "0.0"}
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="text-gray-600 hover:text-gray-800"
      >
        <Pencil className="h-4 w-4" />
      </button>
    </div>
  );
}
