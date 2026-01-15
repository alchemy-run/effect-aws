/**
 * Timestamp Formatting Utilities
 *
 * Handles formatting of Date objects according to AWS timestamp format types.
 */

import type { TimestampFormatType } from "../traits.ts";

/**
 * Format a timestamp according to the specified format.
 *
 * @param date - The date to format
 * @param format - The format type: "http-date", "epoch-seconds", or "date-time" (default)
 */
export function formatTimestamp(
  date: Date,
  format: TimestampFormatType = "date-time",
): string {
  switch (format) {
    case "http-date":
      return date.toUTCString();
    case "epoch-seconds":
      return String(Math.floor(date.getTime() / 1000));
    case "date-time":
    default:
      return date.toISOString();
  }
}
