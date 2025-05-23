import { cn } from "@/lib/utils";
interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function RainbowButton({
  children,
  className,
  ...props
}: RainbowButtonProps) {
  return (
    <button
      className={cn(
        "text-primary-foreground focus-visible:ring-ring group animate-rainbow relative inline-flex cursor-pointer items-center justify-center rounded-xl border-0 bg-[length:200%] [background-clip:padding-box,border-box,border-box] [background-origin:border-box] px-4 font-medium transition-colors [border:calc(0.08*1rem)_solid_transparent] focus-visible:ring-1 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",

        // before styles
        "before:animate-rainbow before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:bg-[linear-gradient(90deg,hsl(var(--color-rainbow-1)),hsl(var(--color-rainbow-5)),hsl(var(--color-rainbow-3)),hsl(var(--color-rainbow-4)),hsl(var(--color-rainbow-2)))] before:bg-[length:200%] before:[filter:blur(calc(0.8*1rem))]",

        // light mode colors
        "bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(var(--color-rainbow-1)),hsl(var(--color-rainbow-5)),hsl(var(--color-rainbow-3)),hsl(var(--color-rainbow-4)),hsl(var(--color-rainbow-2)))]",

        className,
      )}
      {...props}>
      {children}
    </button>
  );
}
