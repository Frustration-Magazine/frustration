import { cn } from "@/libs/tailwind";

type Props = {
  readonly className?: string;
  readonly children: string;
};

function H3({ className, children }: Props) {
  return (
    <h3
      className={cn(
        "mb-2 text-balance font-bold",
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
