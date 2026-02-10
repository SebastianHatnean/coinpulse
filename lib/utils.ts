import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combine multiple class values into a single merged class string.
 *
 * Accepts strings, arrays, and conditional class objects; resolves duplicates and merges Tailwind utility classes.
 *
 * @param inputs - One or more class values (strings, arrays, or objects with conditional classes)
 * @returns A single string containing the combined and merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a numeric value as a localized currency string.
 *
 * @param value - The numeric amount to format
 * @param currency - ISO 4217 currency code (default: "USD")
 * @param locale - BCP 47 locale identifier (default: "en-US")
 * @param options - Optional Intl.NumberFormatOptions to override formatting
 * @returns The formatted currency string (for example, "$1,234.56")
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