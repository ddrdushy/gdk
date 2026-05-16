import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPassportId(prefix: "ST" | "MN", year: number, seq: number) {
  return `TP-${prefix}-${year}-${seq.toString().padStart(3, "0")}`;
}
