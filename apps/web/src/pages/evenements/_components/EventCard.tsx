import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon, LinkIcon, MailIcon, MapPin } from "lucide-react";
import type { EventWithImage } from "../_models";
import { cn } from "@/lib/utils";

const formatDate = (date: Date, displayHour: boolean, timezone: string = "Europe/Paris") => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: timezone,
    ...(displayHour
      ? {
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        }
      : null),
  };

  let formattedDate = new Intl.DateTimeFormat("fr-FR", options).format(date);
  formattedDate = formattedDate.replace(":", "h");
  return formattedDate;
};

export const EventCard = ({ event }: Readonly<{ event: EventWithImage }>) => {
  return (
    <Card className={cn("relative left-0 overflow-hidden bg-white", "first:after:content-none")}>
      {/* Left border */}
      <div className="bg-logo-yellow absolute h-full w-1" />

      {/* Event image */}
      {event.image && (
        <img
          className={cn("absolute bottom-0 right-0 h-full", "xs:w-1/3 sm:opacity-33 w-1/2 opacity-15 sm:w-1/4")}
          src={event.image.url}
          alt={event.image.name ?? "Image de l'événement"}
          width={200}
          height={500}
        />
      )}

      <CardHeader>
        <CardTitle className={cn("first-letter:capitalize", "text-xl", "sm:text-2xl")}>
          {formatDate(new Date(event.date), event.displayHour)} - {event.city}
        </CardTitle>
        <CardDescription className={cn("flex items-center gap-1", "text-base", "sm:text-lg")}>
          <MapPin size={16} />
          {event.place}
        </CardDescription>
      </CardHeader>

      <CardContent className={cn("w-full text-sm", "sm:w-[75%] sm:text-base")}>
        <p>{event.description}</p>
      </CardContent>

      <CardFooter className="flex justify-between gap-1 text-sm">
        <div className="min-w-fit space-y-1">
          <p className="flex items-center gap-1">
            <InfoIcon size={16} />
            <i className="not-italic">{event.entrance ? event.entrance : "Entrée libre"}</i>
          </p>

          {event.link && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue/50 flex items-center gap-1 truncate underline"
            >
              <LinkIcon size={16} />
              Lien vers l'événement
            </a>
          )}
        </div>

        {event.displayContact && event.contact && (
          <a
            href={`mailto:${event.contact}`}
            title={event.contact}
            className="hover:text-blue/50 z-10 mt-auto flex items-center gap-1 underline"
          >
            <MailIcon size={16} />
            Mail de contact
          </a>
        )}
      </CardFooter>
    </Card>
  );
};
