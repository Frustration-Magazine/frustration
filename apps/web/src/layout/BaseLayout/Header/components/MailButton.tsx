import { IoIosMail as MailIcon } from "react-icons/io";
import { cn } from "@/lib/utils";

type Props = {
  readonly className: string;
};

function MailButton({ className }: Props) {
  return (
    <a
      href="/contact"
      type="button"
      title="Nous contacter"
      className={cn("bg-primary rounded-full p-2 text-black opacity-0 transition-opacity duration-1000", className)}
      aria-label="Nous contacter"
    >
      <MailIcon size="clamp(30px, 2vw, 58px)" />
    </a>
  );
}

export default MailButton;
