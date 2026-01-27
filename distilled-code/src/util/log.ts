/**
 * Simple file-based logging for debugging
 */
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

export function logError(category: string, message: string, error: unknown) {
  const timestamp = new Date().toISOString();
  const errorStr =
    error instanceof Error ? `${error.message}\n${error.stack}` : String(error);
  const line = `[${timestamp}] [${category}] ERROR: ${message} | ${errorStr}\n`;
  try {
    fs.appendFileSync(LOG_FILE, line);
  } catch {}
}
