import { useState } from "react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Toggle } from "@radix-ui/react-toggle";

import { Trash, PenIcon, EyeOff, Eye, LinkIcon, InfoIcon, MailIcon, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { type events as Event } from "@prisma/client";
import { EventFormType } from "../models/models";
import { updateEvent } from "../actions/updateEvent";
import { deleteEvent } from "../actions/deleteEvent";
import { EventFormModal } from "./EventFormModal";
import { formatDateHour } from "utils";

export const CardEvent = ({
  event,
  setEvents,
}: {
  event: Event;
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
}) => {
  const [displayEvent, setDisplayEvent] = useState(event.displayEvent);
  const { date, displayHour, city, place, description, link, entrance, contact, displayContact } = event;

  const handleUpdate = async (data: EventFormType) => {
    const { success } = await updateEvent(data);
    if (!success) return;

    const updatedEvent: Event = { ...event, ...data };
    setEvents((prevEvents) => prevEvents.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev)));
  };

  const handleDelete = async (id: number) => {
    const { success } = await deleteEvent(id);
    if (!success) return;

    setEvents((prevEvents) => prevEvents.filter((e) => e.id !== id));
  };

  const handleToggleDisplay = async (checked: boolean) => {
    setDisplayEvent(checked);

    const { success } = await updateEvent({ ...(event as EventFormType), displayEvent: checked });
    if (!success) {
      setDisplayEvent(!checked);
      return;
    }

    const updatedEvent: Event = { ...event, displayEvent: checked };
    setEvents((prevEvents) => prevEvents.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev)));
  };

  const EditButton = () => (
    <EventFormModal
      title="Modifier l'événement"
      description="Cliquez sur enregistrer lorsque vous avez terminé."
      event={event as EventFormType}
      onSubmit={handleUpdate}
      trigger={
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <button className="cursor-pointer rounded-md bg-black p-2 text-white">
                  <PenIcon size={16} />
                </button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent className="bg-black text-white">
              <p>Modifier</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      }
    />
  );

  const DeleteButton = () => (
    <AlertDialog>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <button className="cursor-pointer rounded-md bg-red-500 p-2 text-white">
                <Trash size={16} />
              </button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent className="bg-black text-white">
            <p>Supprimer</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer l'événement ?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-700"
            onClick={() => handleDelete(event.id)}
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const DisplayEventToggle = () => (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={displayEvent}
            onPressedChange={handleToggleDisplay}
            className={cn(
              "cursor-pointer rounded-md p-2 text-white transition-colors data-[state=on]:text-white",
              displayEvent ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-500",
            )}
          >
            {displayEvent ? <Eye size={16} /> : <EyeOff size={16} />}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent className="bg-black text-white">
          <p>{displayEvent ? "Masquer l'événement du site" : "Afficher l'événement sur le site"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <Card className={cn("relative left-0 max-w-[700px] overflow-hidden bg-white", "first:after:content-none")}>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div>
            <span className="text-lg">
              <span className="first-letter:uppercase">{formatDateHour(date, displayHour)}</span> -{" "}
              <span className="first-letter:uppercase">{city}</span>
            </span>
            <div className="flex items-center gap-0.5 font-normal text-gray-500">
              <MapPin size={12} />
              {place}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <DisplayEventToggle />
            <EditButton />
            <DeleteButton />
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="text-[15px]">{description}</CardContent>

      <CardFooter className="flex justify-between gap-1 text-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <InfoIcon size={16} />
            <i className="not-italic">{entrance ? entrance : "Entrée libre"}</i>
          </div>

          {link && (
            <div className="flex items-center gap-1">
              <LinkIcon size={16} />
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="max-w-[40ch] truncate underline hover:text-blue-500"
              >
                {link}
              </a>
            </div>
          )}
        </div>

        {displayContact && contact && (
          <div className="z-10 mt-auto flex items-center gap-1">
            <MailIcon size={16} />
            <a
              href={`mailto:${contact}`}
              className="underline hover:text-blue-500"
            >
              {contact}
            </a>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
