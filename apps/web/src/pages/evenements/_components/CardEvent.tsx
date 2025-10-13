import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin } from "lucide-react";

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
        {/* <br />
        <i> Entrée libre</i> */}
      </CardContent>
      {event.displayContact && event.contact && (
        <CardFooter className="flex items-center gap-1 text-sm">
          <Mail
            size={14}
            className="mt-0.5"
          />
          <a
            href={`mailto:${event.contact}`}
            className="underline"
          >
            {event.contact}
          </a>
        </CardFooter>
      )}
    </Card>
  );
};
