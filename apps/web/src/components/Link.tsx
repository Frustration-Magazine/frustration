import { cn } from "@/lib/utils";

export const Link = ({
  children,
  href,
  target,
  className,
  variant = "primary",
}: {
  children: React.ReactNode;
  href: string;
  target?: string;
  className?: string;
  variant?: "primary";
}) => {
  return (
    <a
      href={href}
      target={target}
      className={cn(
        variant === "primary" &&
          "bg-pale-yellow hover:bg-primary whitespace-nowrap rounded-full px-2.5 py-1 text-black",
        className,
      )}
    >
      {children}
    </a>
  );
};
