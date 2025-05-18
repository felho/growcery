import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface ComboboxItem {
  label: string;
  value: string;
}

interface ComboboxProps {
  id?: string;
  items: ComboboxItem[];
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Combobox({
  id,
  items,
  value,
  onChange,
  placeholder = "Select...",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedLabel =
    items.find((item) => item.value === value)?.label ?? placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          id={id}
        >
          {selectedLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-full p-0"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No result found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
