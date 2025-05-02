"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type DefaultData = {
  id: string;
  description: string;
};

type Props<S, T = DefaultData> = {
  fieldTitle: string;
  nameInSchema: keyof S & string;
  data: T[];
  className?: string;
  placeholder?: string;
  getValue?: (item: T) => string;
  getLabel?: (item: T) => string;
};

export function SelectWithLabel<S, T = DefaultData>({
  fieldTitle,
  nameInSchema,
  data,
  className,
  placeholder = "Select",
  getValue = (item) => (item as DefaultData).id,
  getLabel = (item) => (item as DefaultData).description,
}: Props<S, T>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={nameInSchema} className="text-base">
            {fieldTitle}
          </FormLabel>

          <Select
            value={
              field.value !== undefined && field.value !== null
                ? field.value.toString()
                : ""
            }
            onValueChange={(val) =>
              field.onChange(val === "" ? undefined : Number(val))
            }
          >
            <FormControl>
              <SelectTrigger
                id={nameInSchema}
                className={`w-full max-w-xs ${className ?? ""}`}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>

            <SelectContent>
              {data.map((item) => (
                <SelectItem
                  key={`${nameInSchema}_${getValue(item)}`}
                  value={getValue(item)}
                >
                  {getLabel(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
