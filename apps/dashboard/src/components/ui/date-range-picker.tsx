import React, { useState, useEffect } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type DateRange = {
  from: Date;
  to: Date;
};

type DateRangePickerProps = {
  className?: string;
  date: DateRange;
  setDate: (date: DateRange) => void;
  footer?: string;
};

export const DatePickerWithRange = ({ className, date, setDate, footer }: DateRangePickerProps) => {
  const [tempDate, setTempDate] = useState(date);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTempDate(date);
  }, [date]);

  const handleValidate = (): void => {
    if (!tempDate?.from || !tempDate?.to || tempDate === date) return;
    setDate(tempDate);
    setOpen(false);
  };

  const handleCancel = (): void => {
    setTempDate(date);
    setOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", { locale: fr })} - {format(date.to, "LLL dd, y", { locale: fr })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale: fr })
              )
            ) : (
              <span className="text-muted-foreground">Choisir des dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
        >
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            disabled={(date) => date > new Date() || date < new Date("2023-01-01")}
            selected={tempDate}
            onSelect={(date) => setTempDate(date as DateRange)}
            numberOfMonths={2}
          />

          <div className="flex justify-end gap-2 border-t p-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Annuler
            </Button>
            <Button
              size="sm"
              onClick={handleValidate}
              disabled={!tempDate?.from || !tempDate?.to || tempDate === date}
            >
              Valider
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {footer && <span className="text-accent-foreground text-center text-sm">{footer}</span>}
    </div>
  );
};
