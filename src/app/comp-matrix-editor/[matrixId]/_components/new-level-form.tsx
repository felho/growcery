import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Plus, ChevronUp, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
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
import {
  createLevelSchemaFromForm,
  type CreateLevelInputFromForm,
} from "~/zod-schemas/comp-matrix-levels";

interface NewLevelFormProps {
  showForm: boolean;
  onShowFormChange: (show: boolean) => void;
  onSubmit: (data: CreateLevelInputFromForm) => void;
  insertPosition?: number;
}

export const NewLevelForm: React.FC<NewLevelFormProps> = ({
  showForm,
  onShowFormChange,
  onSubmit,
  insertPosition,
}) => {
  const form = useForm<CreateLevelInputFromForm>({
    resolver: zodResolver(createLevelSchemaFromForm),
    defaultValues: {
      title: "",
      description: "",
      persona: "",
      areaOfImpact: "",
    },
  });

  const handleSubmit = async (data: CreateLevelInputFromForm) => {
    onSubmit({
      ...data,
    });
    form.reset();
    onShowFormChange(false);
  };

  return (
    <Collapsible
      open={showForm}
      onOpenChange={onShowFormChange}
      className="mb-4 rounded-md border"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant={showForm ? "outline" : "default"}
          className="flex w-full justify-between"
        >
          <span>
            {insertPosition !== undefined
              ? `Insert New Level at Position ${insertPosition + 1}`
              : "Add New Level"}
          </span>
          {showForm ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 pt-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4">
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title*</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        required
                        placeholder="Short descriptive title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description*</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        required
                        rows={3}
                        placeholder="Detailed description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  name="persona"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Persona*</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          required
                          placeholder="Target persona"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="areaOfImpact"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area of Impact*</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          required
                          placeholder="Scope of influence"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onShowFormChange(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                {insertPosition !== undefined ? "Insert Level" : "Add Level"}
              </Button>
            </div>
          </form>
        </Form>
      </CollapsibleContent>
    </Collapsible>
  );
};
