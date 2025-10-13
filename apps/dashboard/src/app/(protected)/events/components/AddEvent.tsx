import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { EventFormModal } from "./EventFormModal";
import { EventFormType } from "../models/models";
import { createEvent } from "../actions/createEvent";
import { type events as Event } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export const AddEvent = ({
  setEvents,
  className,
}: {
  setEvents: Dispatch<SetStateAction<Event[]>>;
  className?: string;
}) => {
  const isMobile = useIsMobile();

  const onSubmit = async (data: EventFormType) => {
    const { success, result } = await createEvent(data);
    if (!success || !result) return;

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
