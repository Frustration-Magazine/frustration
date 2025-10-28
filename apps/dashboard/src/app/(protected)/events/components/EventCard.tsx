import { useState } from "react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
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

import { Trash, PenIcon, EyeOff, Eye, LinkIcon, InfoIcon, MailIcon, MapPin, ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { EventFormType } from "../models/EventFormSchema";
import { updateEvent } from "../actions/updateEvent";
import { deleteEvent } from "../actions/deleteEvent";
import { EventFormModal } from "./EventFormModal";
import { formatDateHour } from "utils";
import { EventWithImage } from "../page";
import { toast } from "sonner";
import { toggleDisplayEvent } from "../actions/toggleDisplayEvent";

export const EventCard = ({
  event,
  setEvents,
}: {
  event: EventWithImage;
  setEvents: React.Dispatch<React.SetStateAction<EventWithImage[]>>;
}) => {
  const [displayEvent, setDisplayEvent] = useState(event.displayEvent);
  const { date, displayHour, city, place, description, link, entrance, contact, displayContact, image } = event;

  const handleUpdate = async (data: EventFormType) => {
    const { error, result: updatedEvent } = await updateEvent(data);

    if (error || !updatedEvent) {
      toast.error(error);
      return;
    }

    setEvents((prevEvents) => prevEvents.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev)));
  };

  const handleDelete = async (id: number) => {
    const { error } = await deleteEvent(id);
    if (error) {
      toast.error(error);
      return;
    }

    setEvents((prevEvents) => prevEvents.filter((e) => e.id !== id));
  };

  const handleToggleDisplay = async (checked: boolean) => {
    setDisplayEvent(checked);

    const { error, result: updatedEvent } = await toggleDisplayEvent(event.id, checked);

    if (error || !updatedEvent) {
      toast.error(error);
      setDisplayEvent(!checked);
      return;
    }

    setEvents((prevEvents) => prevEvents.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev)));
  };

  const EditButton = () => (
    <EventFormModal
      title="Modifier l'événement"
      description="Cliquez sur enregistrer lorsque vous avez terminé."
      event={event}
      onSubmit={handleUpdate}
      trigger={
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button size="icon">
                <PenIcon size={16} />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent className="bg-black text-white">
            <p>Modifier</p>
          </TooltipContent>
        </Tooltip>
      }
    />
  );

  const DeleteButton = () => (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="destructive"
            >
              <Trash size={16} />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent className="bg-black text-white">
          <p>Supprimer</p>
        </TooltipContent>
      </Tooltip>
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
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          pressed={displayEvent}
          onPressedChange={handleToggleDisplay}
          className={cn(
            "cursor-pointer rounded-md p-2 text-white transition-colors data-[state=on]:text-white",
            displayEvent ? "bg-green-500 hover:bg-green-500/90" : "bg-gray-400 hover:bg-gray-500",
          )}
        >
          {displayEvent ? <Eye size={16} /> : <EyeOff size={16} />}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent className="bg-black text-white">
        <p>{displayEvent ? "Masquer l'événement du site" : "Afficher l'événement sur le site"}</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <Card className={cn("relative left-0 max-w-[700px] overflow-hidden bg-white", "first:after:content-none")}>
      <div className="flex">
        <div className="relative flex w-32 shrink-0 items-center justify-center overflow-hidden bg-gray-100">
          {image?.url ? (
            <img
              src={image.url}
              alt={`Image de l'événement à ${city}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageOff className="size-1/3 text-gray-400" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <CardHeader>
            <CardTitle className="flex justify-between">
              <div className="min-w-0 flex-1">
                <span className="text-lg">
                  <span className="first-letter:uppercase">{formatDateHour(date, displayHour)}</span> -{" "}
                  <span className="first-letter:uppercase">{city}</span>
                </span>
                <div className="flex items-center gap-1 font-normal text-gray-500">
                  <MapPin size={12} />
                  <span>{place}</span>
                </div>
              </div>
              <div className="flex shrink-0 items-start gap-3">
                <DisplayEventToggle />
                <EditButton />
                <DeleteButton />
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="text-[15px]">{description}</CardContent>

          <CardFooter className="mt-auto flex justify-between gap-1 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <InfoIcon size={16} />
                {entrance ? <i className="not-italic">{entrance}</i> : <i>Entrée libre</i>}
              </div>

              {link && (
                <div className="flex items-center gap-1">
                  <LinkIcon size={16} />
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="max-w-[30ch] truncate underline hover:text-blue-500"
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
        </div>
      </div>
    </Card>
  );
};
