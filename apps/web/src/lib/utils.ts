import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatVideoTitle = (title: string): string => {
  if (title.startsWith("(Vidéo)")) {
    return title.replace("(Vidéo)", "📼");
  }
  return title;
};
