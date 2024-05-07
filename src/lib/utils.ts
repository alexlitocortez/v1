import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { signIn } from "next-auth/react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}