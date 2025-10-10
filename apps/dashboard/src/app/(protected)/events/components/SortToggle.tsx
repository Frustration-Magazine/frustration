import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SortOrder = "asc" | "desc";

type SortToggleProps = {
  onToggle: () => void;
  sortOrder: SortOrder;
  activeTab: "future" | "past";
  disabled: boolean;
  className?: string;
};

export const SortToggle = ({ onToggle, sortOrder, activeTab, disabled, className }: SortToggleProps) => {
  return (
    <Button
      className={cn(className, "min-w-38 gap-2")}
      onClick={onToggle}
      disabled={disabled}
    >
      {sortOrder === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
      <span>
        {sortOrder === "asc"
          ? `Plus ${activeTab === "future" ? "proches" : "anciens"}`
          : `Plus ${activeTab === "future" ? "lointains" : "récents"}`}
      </span>
    </Button>
  );
};
