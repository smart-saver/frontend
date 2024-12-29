import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(number) {
  return Intl.NumberFormat('en-IN', {  style: 'currency', currency: 'USD' }).format(parseInt(number))
}