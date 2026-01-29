/**
 * Simple file-based logging for debugging
 */
import { Cause, Exit } from "effect";
import * as fs from "fs";
import * as path from "path";

const LOG_FILE = path.join(process.cwd(), ".distilled-code.log");

// Clear log file on startup
try {
  fs.writeFileSync(
    LOG_FILE,
    `=== Effect Code Log Started ${new Date().toISOString()} ===\n`,
  );
} catch {}

export function log(category: string, message: string, data?: unknown) {
  const timestamp = new Date().toISOString();
  const dataStr = data !== undefined ? ` | ${JSON.stringify(data)}` : "";
  const line = `[${timestamp}] [${category}] ${message}${dataStr}\n`;
  try {
    fs.appendFileSync(LOG_FILE, line);
  } catch {}
}

/**
 * Format an error for logging, handling Effect errors properly.
 */
function formatError(error: unknown): string {
  // Handle Effect Cause objects
  if (Cause.isCause(error)) {
    return Cause.pretty(error);
  }

  // Handle Effect Exit objects (failed)
  if (Exit.isExit(error) && Exit.isFailure(error)) {
    return Cause.pretty(error.cause);
  }

  // Handle objects with _tag (Effect-style tagged errors)
  if (
    error !== null &&
    typeof error === "object" &&
    "_tag" in error &&
    typeof (error as any)._tag === "string"
  ) {
    const tagged = error as { _tag: string; message?: string; cause?: unknown };
    const parts: string[] = [`[${tagged._tag}]`];

    if (tagged.message) {
      parts.push(tagged.message);
    }

    // Try to get more details from common error structures
    if ("body" in error) {
      parts.push(
        `\nResponse Body: ${JSON.stringify((error as any).body, null, 2)}`,
      );
    }

    if (error instanceof Error && error.stack) {
      parts.push(`\n${error.stack}`);
    }

    // Include cause if present
    if (tagged.cause) {
      parts.push(`\nCaused by: ${formatError(tagged.cause)}`);
    }

    return parts.join(" ");
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return `${error.message}\n${error.stack}`;
  }

  // Handle objects - try JSON serialization
  if (error !== null && typeof error === "object") {
    try {
      return JSON.stringify(error, null, 2);
    } catch {
      return String(error);
    }
  }

  // Fallback
  return String(error);
}

export function logError(category: string, message: string, error: unknown) {
  const timestamp = new Date().toISOString();
  const errorStr = formatError(error);
  const line = `[${timestamp}] [${category}] ERROR: ${message} | ${errorStr}\n`;
  try {
    fs.appendFileSync(LOG_FILE, line);
  } catch {}
}
