import type { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { EventFormModal } from "./EventFormModal";
import { EventFormType } from "../models/EventFormSchema";

import { createEvent } from "../actions/createEvent";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { EventWithImage } from "../page";

export const AddEvent = ({
  setEvents,
  className,
}: {
  setEvents: Dispatch<SetStateAction<EventWithImage[]>>;
  className?: string;
}) => {
  const isMobile = useIsMobile();

  const onSubmit = async (data: EventFormType) => {
    const { success, error, result } = await createEvent(data);
    if (error || !result) {
      toast.error(error);
      return;
    }

    toast.success(success);
    setEvents((prevEvents) => [...prevEvents, result]);
  };

  return (
    <EventFormModal
      title="Ajouter un événement à venir"
      description="Cliquez sur enregistrer lorsque vous avez terminé."
      onSubmit={onSubmit}
      trigger={
        <DialogTrigger asChild>
          <Button className={cn(className, "gap-2")}>
            <Plus />
            <span>{isMobile ? "Ajouter" : "Ajouter un événement"}</span>
          </Button>
        </DialogTrigger>
      }
    />
  );
};
