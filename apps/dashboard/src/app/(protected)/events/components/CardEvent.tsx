import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IoMailOutline as MailIcon } from "react-icons/io5";
import { GiPositionMarker as MapMarkerIcon } from "react-icons/gi";
import { type Event } from "../models/models";

import { cn } from "@/lib/utils";

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

function CardEvent({ event }: Readonly<{ event: Event }>) {
  return (
    <Card className={cn("relative left-0 overflow-hidden bg-white", "first:after:content-none")}>
      <div className="absolute h-full w-1 bg-[#FCCF00]" />
      <CardHeader>
        <CardTitle className="text-2xl first-letter:capitalize">
          {formatDate(event.date, event.displayHour)} - {event.city}
        </CardTitle>
        <CardDescription className="flex items-center gap-1 text-lg">
          <MapMarkerIcon />
          {event.place}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{event.description}</p>
        <br />
        <i> Entrée libre</i>
      </CardContent>
      <CardFooter className="flex items-center gap-1 text-sm">
        <MailIcon />
        <a href={`mailto:${event.contact}`} className="underline">
          {event.contact}
        </a>
      </CardFooter>
    </Card>
  );
}

export default CardEvent;
