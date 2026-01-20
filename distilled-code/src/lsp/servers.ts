import * as Effect from "effect/Effect";
import type { Subprocess } from "bun";

/**
 * Configuration for an LSP server.
 */
export interface ServerConfig {
  /**
   * Unique identifier for the server.
   */
  id: string;

  /**
   * Spawn the server process.
   * Returns null if the server is not available.
   */
  spawn: (cwd: string) => Effect.Effect<Subprocess | null>;
}

/**
 * TypeScript Language Server configuration.
 * Uses typescript-language-server which wraps tsserver.
 */
export const TypeScriptServer: ServerConfig = {
  id: "typescript",
  spawn: (cwd: string) =>
    Effect.sync(() => {
      const bin = Bun.which("typescript-language-server");
      const cmd = bin
        ? ["typescript-language-server", "--stdio"]
        : ["bunx", "typescript-language-server", "--stdio"];

      return Bun.spawn(cmd, {
        cwd,
        stdin: "pipe",
        stdout: "pipe",
        stderr: "inherit",
      });
    }),
};

/**
 * oxlint Language Server configuration.
 * Uses oxlint --lsp for fast linting.
 */
export const OxlintServer: ServerConfig = {
  id: "oxlint",
  spawn: (cwd: string) =>
    Effect.sync(() =>
      Bun.spawn(["bun", "oxlint", "--lsp"], {
        cwd,
        stdin: "pipe",
        stdout: "pipe",
        stderr: "inherit",
      }),
    ),
};

/**
 * All available LSP servers.
 */
export const AllServers: ServerConfig[] = [TypeScriptServer, OxlintServer];
