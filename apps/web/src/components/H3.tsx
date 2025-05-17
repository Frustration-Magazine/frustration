import { cn } from "@/lib/utils";

type Props = {
  readonly className?: string;
  readonly children: string;
};

function H3({ className, children }: Props) {
  return (
    <h3
      className={cn(
        "mb-2 font-bold text-balance",
        "font-open-sans",
        "text-xl",
        "sm:text-2xl",
        "lg:text-3xl",
        className,
      )}>
      {children}
    </h3>
  );
}

export default H3;
