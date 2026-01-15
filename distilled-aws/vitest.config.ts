// Source - https://stackoverflow.com/a
// Posted by Lakshmaji
// Retrieved 2026-01-04, License - CC BY-SA 4.0

import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts", "scripts/**/*.test.ts"],
    exclude: [
      ...configDefaults.exclude,
      "aws-models",
      "aws-sdk-js-v3",
      "smithy",
      "smithy-typescript",
    ],
    // Run test files in parallel
    // fileParallelism: true,
    // // Run tests within a file concurrently
    sequence: {
      concurrent: true,
    },
    // Use forks pool for better isolation with concurrent tests
    pool: "threads",
    // Enable auto-recording of unknown AWS errors to spec files
    env: {
      DISTILLED_AWS_DEBUG: "1",
    },
  },
});
