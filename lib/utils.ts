import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as currency using Intl.NumberFormat.
 * @param value - The numeric value to format
 * @param currency - ISO 4217 currency code (default: 'USD')
 * @param locale - BCP 47 locale (default: 'en-US')
 * @param options - Optional Intl.NumberFormatOptions overrides
 */
export function formatCurrency(
  value: number,
  currency: string = "USD",
  locale: string = "en-US",
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(value)
}
