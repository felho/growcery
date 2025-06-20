import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  X,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Pencil,
  Save,
} from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateLevelSchema } from "~/zod-schemas/comp-matrix-level";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

interface LevelMetadata {
  title: string;
  description: string;
  persona: string;
  areaOfImpact: string;
}

interface LevelData {
  id: number;
  name: string;
  metadata: LevelMetadata;
}

interface LevelCardProps {
  level: LevelData;
  index: number;
  onMove: (index: number, direction: "up" | "down") => void;
  onToggleExpand: (index: number) => void;
  onUpdateMetadata: (
    index: number,
    field: keyof LevelMetadata,
    value: string,
  ) => void;
  onSave: (index: number, metadata: LevelMetadata) => Promise<void>;
  isExpanded: boolean;
  onInsertBefore: () => void;
  levelsLength: number;
  onRemove: (levelId: number) => void;
}

export const LevelCard: React.FC<LevelCardProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(props.level.id) });

  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<LevelMetadata>({
    resolver: zodResolver(updateLevelSchema.omit({ levelId: true })),
    defaultValues: props.level.metadata,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await form.handleSubmit(async (formData) => {
        await props.onSave(props.index, formData);
        props.onToggleExpand(props.index);
      })();
    } catch (error) {
      console.error("Failed to save level:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="border-border border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div {...attributes} {...listeners} className="cursor-grab">
                <GripVertical className="text-muted-foreground h-5 w-5" />
              </div>
              <span>{props.level.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={props.onInsertBefore}
                className="cursor-pointer"
              >
                Insert Before
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => props.onMove(props.index, "up")}
                disabled={props.index === 0}
                className="cursor-pointer"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => props.onMove(props.index, "down")}
                disabled={props.index === props.levelsLength - 1}
                className="cursor-pointer"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={props.isExpanded ? "default" : "ghost"}
                onClick={
                  props.isExpanded
                    ? handleSave
                    : () => props.onToggleExpand(props.index)
                }
                disabled={isSaving}
                className="cursor-pointer"
              >
                {props.isExpanded ? (
                  <Save className="h-4 w-4" />
                ) : (
                  <Pencil className="h-4 w-4" />
                )}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the level.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => props.onRemove(props.level.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          {props.isExpanded && (
            <div className="mt-4 space-y-4">
              <Form {...form}>
                <form className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="persona"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Persona</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="areaOfImpact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area of Impact</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
