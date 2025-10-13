import * as React from "react";

const BREAKPOINTS = {
  "sm": 640,
  "md": 768,
  "lg": 1024,
  "xl": 1280,
  "2xl": 1536,
};

export function useIsMobile({ breakpoint = "md" }: { breakpoint?: "sm" | "md" | "lg" | "xl" | "2xl" } = {}) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS[breakpoint] - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS[breakpoint]);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < BREAKPOINTS[breakpoint]);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
