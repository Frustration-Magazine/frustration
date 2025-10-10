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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { GiPositionMarker as MapMarkerIcon } from "react-icons/gi";
import { Trash, PenIcon, EyeOff, Eye } from "lucide-react";
import { IoMailOutline as MailIcon } from "react-icons/io5";

import { cn } from "@/lib/utils";
import { type events as Event } from "@prisma/client";
import { EventFormType } from "../models/models";
import { updateEvent } from "../actions/updateEvent";
import { deleteEvent } from "../actions/deleteEvent";
import { EventFormModal } from "./EventFormModal";
import { formatDateHour } from "utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@radix-ui/react-toggle";

export const CardEvent = ({
  event,
  setEvents,
}: {
  event: Event;
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
}) => {
  const [displayEvent, setDisplayEvent] = useState(event.displayEvent);
  const { date, displayHour, city, place, description, contact, displayContact } = event;

  const handleUpdate = async (data: EventFormType) => {
    const { success } = await updateEvent(data);
    if (!success) return;

    const updatedEvent = { ...event, ...data } as Event;
    setEvents((prevEvents) => prevEvents.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev)));
  };

  const handleDelete = async (id: number) => {
    const { success } = await deleteEvent(id);
    if (!success) return;

    setEvents((prevEvents) => prevEvents.filter((e) => e.id !== id));
  };

  const handleToggleDisplay = async (checked: boolean) => {
    setDisplayEvent(checked);

    const { success } = await updateEvent({ ...event, displayEvent: checked });
    if (!success) {
      // Revert on error
      setDisplayEvent(!checked);
      return;
    }

    // Update the events list
    const updatedEvent = { ...event, displayEvent: checked } as Event;
    setEvents((prevEvents) => prevEvents.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev)));
  };

  const EditButton = () => (
    <EventFormModal
      title="Modifier l'événement"
      description="Cliquez sur enregistrer lorsque vous avez terminé."
      event={event}
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
          <TooltipContent className="bg-red-500 text-white">
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
              <MapMarkerIcon size={12} />
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

      <CardContent>{description}</CardContent>

      <CardFooter className="block text-sm">
        <div className="flex w-full items-center justify-between gap-1">
          {/* <i> Entrée libre</i> */}
          {displayContact && contact && (
            <div className="flex items-center gap-1">
              <MailIcon />
              <a
                href={`mailto:${contact}`}
                className="underline"
              >
                {contact}
              </a>
            </div>
          )}
        </div>

        {/* <div className="mt-4 flex items-center gap-1.5">
          <div className={cn("flex cursor-pointer items-center justify-center gap-2")}>
            <Switch
              id="displayEvent"
              checked={displayEvent}
              onCheckedChange={handleToggleDisplay}
            />
            <Label
              htmlFor="displayEvent"
              className="text-base"
            >
              Afficher l'événement sur le site
            </Label>
          </div>
        </div> */}
      </CardFooter>
    </Card>
  );
};
