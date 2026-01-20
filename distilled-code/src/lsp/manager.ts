import * as Effect from "effect/Effect";
import * as HashMap from "effect/HashMap";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Ref from "effect/Ref";
import { type Diagnostic, type LSPClient, makeLSPClient } from "./client.ts";
import { AllServers, type ServerConfig } from "./servers.ts";

/**
 * LSP Manager - manages multiple LSP clients and aggregates diagnostics.
 */
export class LSPManager extends Effect.Service<LSPManager>()("LSPManager", {
  effect: Effect.gen(function* () {
    // Map of serverId -> LSPClient
    const clients = yield* Ref.make(HashMap.empty<string, LSPClient>());

    // Aggregated diagnostics: uri -> Map<serverId, Diagnostic[]>
    const diagnosticsMap = yield* Ref.make(
      HashMap.empty<string, HashMap.HashMap<string, Diagnostic[]>>(),
    );

    // Initialization state
    const initialized = yield* Ref.make(false);

    return {
      /**
       * Initialize all available LSP servers.
       */
      initialize: (root: string) =>
        Effect.gen(function* () {
          const alreadyInitialized = yield* Ref.get(initialized);
          if (alreadyInitialized) return;

          yield* Effect.logDebug("[LSPManager] Initializing LSP servers...");

          // Spawn all available servers in parallel
          yield* Effect.forEach(
            AllServers,
            (config) =>
              Effect.gen(function* () {
                yield* Effect.logDebug(
                  `[LSPManager] Starting ${config.id} server...`,
                );

                const proc = yield* config.spawn(root);
                if (!proc) {
                  yield* Effect.logWarning(
                    `[LSPManager] ${config.id} server not available`,
                  );
                  return;
                }

                const client = yield* makeLSPClient(config.id, proc, root);

                // Wire up diagnostics aggregation
                yield* client.onDiagnostics((uri, diags) =>
                  Ref.update(diagnosticsMap, (m) => {
                    const existing = HashMap.get(m, uri).pipe(
                      Option.getOrElse(() =>
                        HashMap.empty<string, Diagnostic[]>(),
                      ),
                    );
                    const updated = HashMap.set(existing, config.id, diags);
                    return HashMap.set(m, uri, updated);
                  }),
                );

                yield* Ref.update(clients, (m) =>
                  HashMap.set(m, config.id, client),
                );
                yield* Effect.logDebug(
                  `[LSPManager] ${config.id} server started`,
                );
              }).pipe(
                Effect.catchAll((e) =>
                  Effect.logWarning(
                    `[LSPManager] Failed to start ${config.id}: ${e}`,
                  ),
                ),
              ),
            { concurrency: "unbounded" },
          );

          yield* Ref.set(initialized, true);
          yield* Effect.logDebug("[LSPManager] All LSP servers initialized");
        }),

      /**
       * Notify all servers that a file has changed.
       */
      notifyFileChanged: (path: string, content: string) =>
        Effect.gen(function* () {
          const allClients = yield* Ref.get(clients);
          yield* Effect.forEach(
            HashMap.values(allClients),
            (client) => client.notifyFileChanged(path, content),
            { concurrency: "unbounded" },
          ).pipe(Effect.catchAll(() => Effect.void));
        }),

      /**
       * Wait for diagnostics from all servers and return aggregated results.
       */
      waitForDiagnostics: (path: string, timeout = 3000) =>
        Effect.gen(function* () {
          const allClients = yield* Ref.get(clients);
          const uri = `file://${path}`;

          // Wait for all servers to report diagnostics
          yield* Effect.forEach(
            HashMap.values(allClients),
            (client) => client.waitForDiagnostics(path, timeout),
            { concurrency: "unbounded" },
          ).pipe(Effect.catchAll(() => Effect.void));

          // Aggregate diagnostics from all servers
          const allDiagnostics = yield* Ref.get(diagnosticsMap).pipe(
            Effect.map((m) => {
              const byServer = HashMap.get(m, uri).pipe(
                Option.getOrElse(() => HashMap.empty<string, Diagnostic[]>()),
              );
              return Array.from(HashMap.values(byServer)).flat();
            }),
          );

          return allDiagnostics;
        }),

      /**
       * Get current diagnostics for a file (without waiting).
       */
      getDiagnostics: (path: string) =>
        Effect.gen(function* () {
          const uri = `file://${path}`;
          const allDiagnostics = yield* Ref.get(diagnosticsMap).pipe(
            Effect.map((m) => {
              const byServer = HashMap.get(m, uri).pipe(
                Option.getOrElse(() => HashMap.empty<string, Diagnostic[]>()),
              );
              return Array.from(HashMap.values(byServer)).flat();
            }),
          );
          return allDiagnostics;
        }),

      /**
       * Shutdown all servers.
       */
      shutdown: Effect.gen(function* () {
        yield* Effect.logDebug("[LSPManager] Shutting down LSP servers...");
        const allClients = yield* Ref.get(clients);
        yield* Effect.forEach(
          HashMap.values(allClients),
          (client) => client.shutdown,
          { concurrency: "unbounded" },
        ).pipe(Effect.catchAll(() => Effect.void));
        yield* Ref.set(clients, HashMap.empty());
        yield* Ref.set(initialized, false);
        yield* Effect.logDebug("[LSPManager] All LSP servers shut down");
      }),
    };
  }),
}) {}

/**
 * Live layer for LSPManager.
 */
export const LSPManagerLive = LSPManager.Default;
