import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToFloat(input: string | number): number {
  // Check if the input is a string and contains a comma
  if (typeof input === "string" && input.includes(",")) {
    // Replace comma with dot and convert to float
    return parseFloat(input.replace(",", "."));
  }
  // If it's not a string or doesn't contain a comma, just convert to float
  return parseFloat(input.toString());
}
