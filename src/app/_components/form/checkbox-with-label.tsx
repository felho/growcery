"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Checkbox } from "~/components/ui/checkbox";

type Props<S> = {
  fieldTitle: string;
  nameInSchema: keyof S & string;
  message?: string;
  className?: string;
};

export function CheckboxWithLabel<S>({
  fieldTitle,
  nameInSchema,
  message,
  className,
}: Props<S>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem
          className={`flex flex-row items-start space-y-0 space-x-3 ${className ?? ""}`}
        >
          <FormControl>
            <Checkbox
              id={nameInSchema}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel htmlFor={nameInSchema}>{fieldTitle}</FormLabel>
            {message && (
              <p className="text-muted-foreground text-sm">{message}</p>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
