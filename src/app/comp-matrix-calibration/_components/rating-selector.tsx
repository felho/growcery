import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

interface RatingSelectorProps {
  value?: string;
  onChange: (value: string) => void;
}

const RatingSelector = ({ value, onChange }: RatingSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Mindig megjelenítünk egy badge-et, még ha nincs is beállítva level assessment
  // Ha nincs érték vagy üres string, akkor 0.0-t mutatunk
  const safeValue = value || "";
  const valueRegex = /^\d+\.\d+$/;
  const isValidValue = valueRegex.test(safeValue);
  
  // Alapértelmezett értékek
  let mainLevel = 0;
  let subLevel = 0;
  const displayValue = isValidValue ? safeValue : "0.0";
  
  // Ha érvényes érték, akkor feldolgozzuk
  if (isValidValue) {
    const parts = safeValue.split(".");
    mainLevel = parseInt(parts[0] || "0");
    subLevel = parseInt(parts[1] || "0");
  }

  const handleRatingSelect = (main: number, sub: number) => {
    onChange(`${main}.${sub}`);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`h-6 w-12 cursor-pointer border p-1 text-xs font-medium ${
            displayValue === "0.0"
              ? "!bg-red-100 text-red-800"
              : "!bg-green-100 text-green-800"
          } hover:!bg-secondary hover:!text-secondary-foreground hover:!border-primary`}
        >
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="center">
        <div className="space-y-3">
          <div className="text-muted-foreground mb-2 text-center text-xs font-medium">
            Select Rating
          </div>
          <div className="grid grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((main) => (
              <div key={main} className="space-y-2">
                <div className="bg-muted rounded p-1 text-center text-xs font-bold">
                  Level {main}
                </div>
                {[1, 2, 3].map((sub) => (
                  <Button
                    key={`${main}.${sub}`}
                    variant="outline"
                    size="sm"
                    className={`h-6 w-12 cursor-pointer p-1 text-xs ${
                      mainLevel === main && subLevel === sub
                        ? "!bg-green-100 text-green-800"
                        : "hover:!bg-secondary hover:!text-secondary-foreground hover:!border-primary"
                    }`}
                    onClick={() => handleRatingSelect(main, sub)}
                  >
                    {main}.{sub}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RatingSelector;
