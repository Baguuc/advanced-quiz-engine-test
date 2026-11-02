import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ltrim(str: string, char: string) {
  while (str.startsWith(char)) {
    str = str.slice(char.length);
  }
  return str;
}
