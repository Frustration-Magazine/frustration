import React from "react";
import { PiCalendarDotFill as CalendarIcon } from "react-icons/pi";
import { cn } from "@/libs/tailwind";

type Props = {
  readonly className: string;
};

function MailButton({ className }: Props) {
  return (
    <a
      href="/evenements"
      type="button"
      title="Voir nos événements"
      className={cn(
        "rounded-full bg-frustration-yellow p-2 text-black opacity-0 transition-opacity duration-1000",
        className,
      )}
      aria-label="Voir nos événements">
      <CalendarIcon size="clamp(30px, 2vw, 58px)" />
    </a>
  );
}

export default MailButton;
