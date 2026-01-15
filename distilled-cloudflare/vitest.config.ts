import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  // Load .env from distilled-cloudflare root
  const env = loadEnv(mode, ".", "");

  return {
    test: {
      include: ["test/**/*.test.ts"],
      testTimeout: 120000,
      env,
    },
    resolve: {
      alias: {
        "~": new URL("./src", import.meta.url).pathname,
      },
    },
  };
});
