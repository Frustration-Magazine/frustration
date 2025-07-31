import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  readonly gradient?: string;
  readonly id: string;
  readonly children: React.ReactNode;
}

function GradientButton({ gradient, id, children }: Props) {
  return (
    <Button
      variant="ghost"
      data-button={id}
      className={cn(
        "relative! group mt-auto inline-flex h-11 w-[80%] overflow-hidden rounded-none p-[3px] ring-offset-black will-change-transform",
      )}
    >
      <div className={cn("bg-conic absolute inset-[-1000%] animate-spin blur-sm [animation-duration:5s]", gradient)} />
      <div
        className={cn(
          "font-bakbak inline-flex h-full w-full cursor-pointer items-center justify-center px-8 py-1 text-2xl font-medium",
          "bg-linear-to-t from-neutral-50 to-white text-neutral-950 backdrop-blur-3xl",
        )}
      >
        <span
          className={cn(
            "bg-linear-to-tr bg-clip-text text-transparent transition-transform duration-100 ease-in-out",
            gradient,
          )}
        >
          {children}
        </span>
      </div>
    </Button>
  );
}

export default GradientButton;
