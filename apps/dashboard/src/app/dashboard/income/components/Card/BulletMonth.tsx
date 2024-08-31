// 🔩 Base
import React from "react"; // Add the import statement for React

// 🔧 Libs
import { cn } from "@/utils/tailwind";
import { inEuros } from "../../_utils";

export default ({
  monthName,
  monthTotal,
  evolutionFromLastMonthInPercent,
  isHighlighted,
}: {
  monthName: string;
  monthTotal: number;
  evolutionFromLastMonthInPercent: string | null;
  isHighlighted: boolean;
}) => {
  return (
    <div
      key={String(monthTotal)}
      className={cn("rounded-md p-2", isHighlighted && "bg-white text-black")}
    >
      <h3 className='text-xl font-semibold capitalize'>{monthName} </h3>
      <p className='flex justify-between'>
        <span>{inEuros(monthTotal)}</span>
        {evolutionFromLastMonthInPercent ? (
          <span className='ml-3 text-muted-foreground'>{evolutionFromLastMonthInPercent}</span>
        ) : null}
      </p>
    </div>
  );
};
