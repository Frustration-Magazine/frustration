import type { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { PaperItemFormModal } from "./PaperItemFormModal";
import { type PaperItemFormType } from "../models/PaperItemFormSchema";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { type PaperItemWithRelations } from "../page";
import { createPaperItem } from "../actions/createPaperItem";

export const AddPaperItem = ({
  setPaperItems,
  className,
}: {
  setPaperItems: Dispatch<SetStateAction<PaperItemWithRelations[]>>;
  className?: string;
}) => {
  const isMobile = useIsMobile();

  const onSubmit = async (data: PaperItemFormType) => {
    const { success, error, result } = await createPaperItem(data);
    if (success && result) {
      toast.success(success);
      setPaperItems((prevPaperItems) => [...prevPaperItems, result]);
    } else {
      toast.error(error);
    }
  };

  return (
    <PaperItemFormModal
      title="Ajouter un item"
      description="Cliquez sur enregistrer lorsque vous avez terminé."
      onSubmit={onSubmit}
      trigger={
        <DialogTrigger asChild>
          <Button className={cn(className, "gap-2")}>
            <Plus />
            <span>{isMobile ? "Ajouter" : "Ajouter un item"}</span>
          </Button>
        </DialogTrigger>
      }
    />
  );
};
