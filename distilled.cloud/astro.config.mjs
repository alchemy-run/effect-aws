import alchemy from "alchemy/cloudflare/astro";
import { defineConfig } from "astro/config";
import { distilledTheme } from "./src/lib/shiki-theme";

// https://astro.build/config
export default defineConfig({
  output: "static",
  adapter: alchemy(),
  markdown: {
    shikiConfig: {
      theme: distilledTheme,
    },
  },
});
