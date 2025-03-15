import React from "react";
import { IoIosMail as MailIcon } from "react-icons/io";
import { cn } from "@/libs/tailwind";

type Props = {
  readonly className: string;
};

function MailButton({ className }: Props) {
  return (
    <a
      href="/contact"
      type="button"
      title="Nous contacter"
      className={cn(
        "rounded-full bg-frustration-yellow p-2 text-black opacity-0 transition-opacity duration-1000",
        className,
      )}
      aria-label="Nous contacter">
      <MailIcon size="clamp(30px, 2vw, 58px)" />
    </a>
  );
}

export default MailButton;
