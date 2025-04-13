import { cn } from "@/lib/utils";

type Props = {
  readonly className?: string;
  readonly children: string;
};

function H2({ className, children }: Props) {
  return (
    <h2
      className={cn(
        "font-bakbak text-center font-bold text-balance uppercase",
        "mb-6 text-4xl",
        "sm:mb-6 sm:text-5xl",
        "md:zs-8 md:mb-8 md:text-5xl",
        "lg:mb-10 lg:text-6xl",
        className,
      )}>
      {children}
    </h2>
  );
}

export default H2;
