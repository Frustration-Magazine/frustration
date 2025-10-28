import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isEnvironmentProduction = process.env.NODE_ENV === "production";
export const isEnvironmentDevelopment = process.env.NODE_ENV !== "production";
