import type { MessageEncoded } from "@effect/ai/Prompt";
import * as FileSystem from "@effect/platform/FileSystem";
import * as Path from "@effect/platform/Path";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schedule from "effect/Schedule";
import {
  isRetryable,
  isSqliteError,
  SqliteBusy,
  type SqliteErrorType,
} from "../sql/sqlite-error.ts";
import { Sqlite, type SqliteConnection } from "../sql/sqlite.ts";
import {
  createStateStore,
  StateStore,
  StateStoreError,
} from "./state-store.ts";
import type { MessagePart } from "./thread.ts";

/**
 * Configuration for SQLite state store.
 */
export interface SqliteStateStoreConfig {
  /**
   * Path to the SQLite database file.
   * @default ".distilled/state.db"
   */
  dbPath?: string;
}

/**
 * Create a Layer that provides StateStore using SQLite.
 * Requires a Sqlite service to be provided (e.g., BunSqlite or LibsqlSqlite).
 */
export const sqliteStateStore = (config: SqliteStateStoreConfig = {}) =>
  Layer.effect(
    StateStore,
    Effect.gen(function* () {
      const sqlite = yield* Sqlite;
      const pathService = yield* Path.Path;
      const dbPath =
        config.dbPath ?? pathService.join(".distilled", "state.db");
      const fs = yield* FileSystem.FileSystem;
      const dir = pathService.dirname(dbPath);
      yield* fs.makeDirectory(dir, { recursive: true });
      const conn = yield* sqlite.open(dbPath);
      return yield* createSqliteStateStoreFromConnection(conn);
    }),
  );

/**
 * Create an Effect-native SQLite StateStore from a connection.
 */
export const createSqliteStateStoreFromConnection = (conn: SqliteConnection) =>
  Effect.gen(function* () {
    /**
     * Map SqliteErrorType to StateStoreError.
     */
    const mapError = (operation: string) =>
      Effect.mapError(
        (error: SqliteErrorType) =>
          new StateStoreError({
            message: `Failed to ${operation}: ${error.message}`,
            cause: error,
          }),
      );

    // Configure SQLite for this application's requirements
    // Enable WAL mode for better concurrent read performance
    // WAL mode for better concurrency, busy_timeout waits up to 30s when locked
    yield* conn
      .exec("PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 30000;")
      .pipe(mapError("set pragmas"));

    // Run migrations
    yield* runMigrations(conn).pipe(mapError("run migrations"));

    // Prepare statements
    const stmts = yield* Effect.gen(function* () {
      return {
        upsertThread: yield* conn.prepare(`
          INSERT INTO threads (thread_id, agent_id, created_at, updated_at)
          VALUES (?, ?, unixepoch(), unixepoch())
          ON CONFLICT (thread_id, agent_id) DO UPDATE SET updated_at = unixepoch()
        `),

        selectMessages: yield* conn.prepare<{ role: string; content: string }>(`
          SELECT role, content FROM messages
          WHERE thread_id = ? AND agent_id = ?
          ORDER BY position ASC
        `),
        deleteMessages: yield* conn.prepare(`
          DELETE FROM messages WHERE thread_id = ? AND agent_id = ?
        `),
        insertMessage: yield* conn.prepare(`
          INSERT INTO messages (thread_id, agent_id, role, content, position)
          VALUES (?, ?, ?, ?, ?)
        `),

        selectParts: yield* conn.prepare<{ type: string; content: string }>(`
          SELECT type, content FROM parts
          WHERE thread_id = ? AND agent_id = ?
          ORDER BY position ASC
        `),
        insertPart: yield* conn.prepare(`
          INSERT INTO parts (thread_id, agent_id, type, content, position)
          VALUES (?, ?, ?, ?, ?)
        `),
        countParts: yield* conn.prepare<{ count: number }>(`
          SELECT COUNT(*) as count FROM parts WHERE thread_id = ? AND agent_id = ?
        `),
        deleteParts: yield* conn.prepare(`
          DELETE FROM parts WHERE thread_id = ? AND agent_id = ?
        `),

        listAllThreads: yield* conn.prepare<{
          agent_id: string;
          thread_id: string;
        }>(`
          SELECT DISTINCT agent_id, thread_id FROM threads ORDER BY agent_id, thread_id
        `),
        listAgentThreads: yield* conn.prepare<{
          agent_id: string;
          thread_id: string;
        }>(`
          SELECT DISTINCT agent_id, thread_id FROM threads WHERE agent_id = ? ORDER BY thread_id
        `),
        deleteThread: yield* conn.prepare(`
          DELETE FROM threads WHERE thread_id = ? AND agent_id = ?
        `),
        deleteThreadMessages: yield* conn.prepare(`
          DELETE FROM messages WHERE thread_id = ? AND agent_id = ?
        `),
        deleteThreadParts: yield* conn.prepare(`
          DELETE FROM parts WHERE thread_id = ? AND agent_id = ?
        `),
      };
    }).pipe(mapError("prepare statements"));

    return createStateStore({
      readThreadMessages: (agentId, threadId) =>
        Effect.gen(function* () {
          const rows = yield* stmts.selectMessages.all(threadId, agentId);
          return rows.map((row) => ({
            role: row.role as MessageEncoded["role"],
            content: JSON.parse(row.content),
          })) as readonly MessageEncoded[];
        }).pipe(mapError("read messages")),

      writeThreadMessages: (agentId, threadId, messages) =>
        conn
          .batch([
            // Ensure thread exists
            {
              sql: `INSERT INTO threads (thread_id, agent_id, created_at, updated_at)
                    VALUES (?, ?, unixepoch(), unixepoch())
                    ON CONFLICT (thread_id, agent_id) DO UPDATE SET updated_at = unixepoch()`,
              params: [threadId, agentId],
            },
            // Clear existing messages
            {
              sql: `DELETE FROM messages WHERE thread_id = ? AND agent_id = ?`,
              params: [threadId, agentId],
            },
            // Insert all new messages
            ...messages.map((msg, i) => ({
              sql: `INSERT INTO messages (thread_id, agent_id, role, content, position)
                    VALUES (?, ?, ?, ?, ?)`,
              params: [
                threadId,
                agentId,
                msg.role,
                JSON.stringify(msg.content),
                i,
              ],
            })),
          ])
          .pipe(mapError("write messages")),

      readThreadParts: (agentId, threadId) =>
        Effect.gen(function* () {
          const rows = yield* stmts.selectParts.all(threadId, agentId);
          return rows.map((row) => JSON.parse(row.content) as MessagePart);
        }).pipe(mapError("read parts")),

      appendThreadPart: (agentId, threadId, part) => {
        const stack = new Error().stack?.split("\n").slice(1, 5).join("\n");
        console.error(
          `[appendThreadPart] type=${part.type} id=${"id" in part ? (part as any).id : "n/a"}\nStack:\n${stack}`,
        );
        return conn
          .batch([
            // Ensure thread exists
            {
              sql: `INSERT INTO threads (thread_id, agent_id, created_at, updated_at)
                    VALUES (?, ?, unixepoch(), unixepoch())
                    ON CONFLICT (thread_id, agent_id) DO UPDATE SET updated_at = unixepoch()`,
              params: [threadId, agentId],
            },
            // Insert part with position from subquery (atomic within batch transaction)
            {
              sql: `INSERT INTO parts (thread_id, agent_id, type, content, position)
                    SELECT ?, ?, ?, ?, COALESCE(MAX(position) + 1, 0)
                    FROM parts WHERE thread_id = ? AND agent_id = ?`,
              params: [
                threadId,
                agentId,
                part.type,
                JSON.stringify(part),
                threadId,
                agentId,
              ],
            },
          ])
          .pipe(mapError("append part"));
      },

      truncateThreadParts: (agentId, threadId) =>
        stmts.deleteParts
          .run(threadId, agentId)
          .pipe(mapError("truncate parts")),

      listThreads: (agentId) =>
        Effect.gen(function* () {
          if (agentId !== undefined) {
            const rows = yield* stmts.listAgentThreads.all(agentId);
            return rows.map((row) => ({
              agentId: row.agent_id,
              threadId: row.thread_id,
            }));
          } else {
            const rows = yield* stmts.listAllThreads.all();
            return rows.map((row) => ({
              agentId: row.agent_id,
              threadId: row.thread_id,
            }));
          }
        }).pipe(mapError("list threads")),

      deleteThread: (agentId, threadId) =>
        // Batch is already atomic in libsql, no need for explicit transaction
        conn
          .batch([
            {
              sql: `DELETE FROM parts WHERE thread_id = ? AND agent_id = ?`,
              params: [threadId, agentId],
            },
            {
              sql: `DELETE FROM messages WHERE thread_id = ? AND agent_id = ?`,
              params: [threadId, agentId],
            },
            {
              sql: `DELETE FROM threads WHERE thread_id = ? AND agent_id = ?`,
              params: [threadId, agentId],
            },
          ])
          .pipe(mapError("delete thread")),
    });
  });

/**
 * Migration definition.
 */
interface Migration {
  /** Unique version identifier (e.g., "001_initial_schema") */
  version: string;
  /** SQL statements to execute for this migration (array for libsql compatibility) */
  statements: string[];
}

/**
 * Ordered list of migrations.
 * New migrations should be appended to this array.
 * Never modify or remove existing migrations - only add new ones.
 */
export const MIGRATIONS: Migration[] = [
  {
    version: "001_initial_schema",
    statements: [
      `CREATE TABLE IF NOT EXISTS threads (
        thread_id TEXT NOT NULL,
        agent_id TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
        PRIMARY KEY (thread_id, agent_id)
      )`,
      `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        thread_id TEXT NOT NULL,
        agent_id TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        position INTEGER NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        FOREIGN KEY (thread_id, agent_id) REFERENCES threads(thread_id, agent_id)
      )`,
      `CREATE TABLE IF NOT EXISTS parts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        thread_id TEXT NOT NULL,
        agent_id TEXT NOT NULL,
        type TEXT NOT NULL,
        content TEXT NOT NULL,
        position INTEGER NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        FOREIGN KEY (thread_id, agent_id) REFERENCES threads(thread_id, agent_id)
      )`,
      `CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_id, agent_id)`,
      `CREATE INDEX IF NOT EXISTS idx_parts_thread ON parts(thread_id, agent_id)`,
    ],
  },
  // Add new migrations here:
  // {
  //   version: "002_add_some_column",
  //   sql: `ALTER TABLE threads ADD COLUMN some_column TEXT;`,
  // },
];

/**
 * Run all pending migrations on the database.
 * Creates the migrations table if it doesn't exist.
 * Uses retry logic to handle concurrent migration attempts.
 */
export const runMigrations = (conn: SqliteConnection) =>
  Effect.gen(function* () {
    // Create migrations table if it doesn't exist
    yield* conn.exec(`
      CREATE TABLE IF NOT EXISTS _migrations (
        version TEXT PRIMARY KEY,
        applied_at INTEGER NOT NULL DEFAULT (unixepoch())
      );
    `);

    // Get already applied migrations
    const selectMigrations = yield* conn.prepare<{ version: string }>(
      "SELECT version FROM _migrations ORDER BY version",
    );
    const appliedRows = yield* selectMigrations.all();
    const appliedVersions = new Set(appliedRows.map((r) => r.version));

    // Run pending migrations in order
    for (const migration of MIGRATIONS) {
      if (appliedVersions.has(migration.version)) {
        continue; // Already applied
      }

      // Execute migration in a transaction with retry for busy errors
      yield* conn
        .transaction((tx) =>
          Effect.gen(function* () {
            // Check again inside transaction in case another process applied it
            const checkMigration = yield* tx.prepare<{ version: string }>(
              "SELECT version FROM _migrations WHERE version = ?",
            );
            const existing = yield* checkMigration.get(migration.version);
            if (existing) {
              // Another process already applied this migration
              return;
            }

            // Execute each migration statement
            for (const sql of migration.statements) {
              yield* tx.exec(sql);
            }

            const insertMigration = yield* tx.prepare(
              "INSERT INTO _migrations (version) VALUES (?)",
            );
            yield* insertMigration.run(migration.version);
          }),
        )
        .pipe(
          Effect.tapError((e) =>
            Effect.log(`[sqlite] Migration failed: ${e.message}`),
          ),
          Effect.retry(
            Schedule.recurWhile((e) => isSqliteError(e) && isRetryable(e)).pipe(
              Schedule.intersect(Schedule.exponential("100 millis")),
              Schedule.intersect(Schedule.recurs(10)),
            ),
          ),
          // If we still fail, check if the migration was applied by another process
          Effect.catchIf(
            (e) => isSqliteError(e) && isRetryable(e),
            () =>
              Effect.gen(function* () {
                const checkMigration = yield* conn.prepare<{ version: string }>(
                  "SELECT version FROM _migrations WHERE version = ?",
                );
                const existing = yield* checkMigration.get(migration.version);
                if (existing) {
                  // Migration was applied by another process, continue
                  return;
                }
                // Still not applied and we can't get a lock, fail
                yield* new SqliteBusy({
                  message: `Failed to apply migration ${migration.version}: database is locked`,
                });
              }),
          ),
        );
    }
  });
