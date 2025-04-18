import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";
import { NumberTicker } from "./NumberTicker";
import { cn } from "@/lib/utils";

interface ProgressBarProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  background?: string;
  delayInSeconds: number;
}

const ProgressBar = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressBarProps
>(({ className, value, delayInSeconds, background, ...props }, ref) => {
  const [counter, setCounter] = React.useState(0);

  React.useEffect(function startCounter() {
    let intervalId: NodeJS.Timeout;
    let counter2 = 0;
    if (value) {
      setTimeout(() => {
        intervalId = setInterval(() => {
          if (counter2 >= value) {
            if (intervalId) clearInterval(intervalId);
            return;
          }
          setCounter((prev) => prev + 1);
          counter2++;
        }, 25);
      }, delayInSeconds * 1000);
    }
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-transparent",
        className,
      )}
      {...props}>
      <ProgressPrimitive.Indicator
        className={`h-full w-full flex-1 ${background} relative transition-all`}
        style={{ transform: `translateX(-${100 - (counter || 0)}%)` }}>
        <div
          className="absolute top-1.5 h-[25%] w-[20%] translate-x-1/2 rounded-full bg-white blur-xs"
          style={{
            right: `${(counter || 0) / 2}%`,
            width: `${counter / 4}%`,
          }}></div>
      </ProgressPrimitive.Indicator>
      <div className="animate-slideProgress absolute top-0 left-0 aspect-4/1 h-full rounded-full bg-white blur-xl"></div>
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 text-2xl font-bold text-black",
          {
            "translate-x-full": value && value < 70,
          },
        )}
        style={{
          right:
            value && value < 70 ? `calc(${100 - (counter || 0)}% - 10px)` : "0",
          left: value && value > 70 ? "20px" : "0",
        }}>
        <NumberTicker
          value={value ?? 0}
          delay={delayInSeconds}
        />
      </div>
    </ProgressPrimitive.Root>
  );
});
ProgressBar.displayName = ProgressPrimitive.Root.displayName;

export default ProgressBar;
