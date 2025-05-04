import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";
import { GiPositionMarker as MapMarkerIcon } from "react-icons/gi";
import { IoMailOutline as MailIcon } from "react-icons/io5";
import { type Event } from "../_models";

const formatDate = (date: Date, displayHour: boolean) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
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
  <div
    className={cn(
      "absolute right-0 h-full",
      "scale-1 rotate-[15deg] opacity-10",
      "sm:scale-[1.3] sm:rotate-[25deg] sm:opacity-20",
    )}>
    {bookImage}
  </div>
);

const LeftBorderColored = () => (
  <div className="absolute h-full w-1 bg-[#FCCF00]" />
);

/* ============== */
/* |||||||||||||| */
/* ============== */

function CardEvent({
  event,
  children,
}: Readonly<{ event: Event; children: ReactNode }>) {
  return (
    <Card
      className={cn(
        "relative left-0 overflow-hidden bg-white",
        "first:after:content-none",
      )}>
      <LeftBorderColored />
      <BookCoverBackground bookImage={children} />
      <CardHeader>
        <CardTitle
          className={cn("first-letter:capitalize", "text-xl", "sm:text-2xl")}>
          {formatDate(event.date, event.displayHour)} - {event.city}
        </CardTitle>
        <CardDescription
          className={cn("flex items-center gap-1", "text-base", "sm:text-lg")}>
          <MapMarkerIcon />
          {event.place}
        </CardDescription>
      </CardHeader>
      <CardContent className={cn("w-full text-sm", "sm:w-[75%] sm:text-base")}>
        <p>{event.description}</p>
        <br />
        <i> Entrée libre</i>
      </CardContent>
      {event.displayContact && (
        <CardFooter className="flex items-center gap-1 text-sm">
          <MailIcon />
          <a
            href={`mailto:${event.contact}`}
            className="underline">
            {event.contact}
          </a>
        </CardFooter>
      )}
    </Card>
  );
}

export default CardEvent;
