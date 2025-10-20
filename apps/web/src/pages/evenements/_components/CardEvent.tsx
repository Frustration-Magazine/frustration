import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon, LinkIcon, Mail, MailIcon, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";
import { type events as Event } from "@prisma/client";

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

const BookCoverBackground = ({ bookImage }: { bookImage: any }) => (
  <div className={cn("absolute bottom-0 right-0 h-fit", "rotate-[15deg] opacity-15", "sm:opacity-25")}>{bookImage}</div>
);

const LeftBorderColored = () => <div className="bg-logo-yellow absolute h-full w-1" />;

export const CardEvent = ({ event, children }: Readonly<{ event: Event; children: ReactNode }>) => {
  return (
    <Card className={cn("relative left-0 overflow-hidden bg-white", "first:after:content-none")}>
      <LeftBorderColored />
      <BookCoverBackground bookImage={children} />

      <CardHeader>
        <CardTitle className={cn("first-letter:capitalize", "text-xl", "sm:text-2xl")}>
          {formatDate(event.date, event.displayHour)} - {event.city}
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
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <InfoIcon size={16} />
            <i className="not-italic">{event.entrance ? event.entrance : "Entrée libre"}</i>
          </div>

          {event.link && (
            <div className="flex items-center gap-1">
              <LinkIcon size={16} />
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue/50 max-w-[40ch] truncate underline"
              >
                {event.link}
              </a>
            </div>
          )}
        </div>

        {event.displayContact && event.contact && (
          <div className="z-10 mt-auto flex items-center gap-1">
            <MailIcon size={16} />
            <a
              href={`mailto:${event.contact}`}
              className="hover:text-blue/50 underline"
            >
              {event.contact}
            </a>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
