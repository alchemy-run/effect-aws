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
import type { MessagePart, MessageWithSender } from "./thread.ts";

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
          INSERT INTO threads (thread_id, created_at, updated_at)
          VALUES (?, unixepoch(), unixepoch())
          ON CONFLICT (thread_id) DO UPDATE SET updated_at = unixepoch()
        `),

        selectMessages: yield* conn.prepare<{ role: string; content: string }>(`
          SELECT role, content FROM messages
          WHERE thread_id = ?
          ORDER BY position ASC
        `),
        selectMessagesWithSender: yield* conn.prepare<{
          role: string;
          content: string;
          sender: string | null;
        }>(`
          SELECT role, content, sender FROM messages
          WHERE thread_id = ?
          ORDER BY position ASC
        `),
        deleteMessages: yield* conn.prepare(`
          DELETE FROM messages WHERE thread_id = ?
        `),
        insertMessage: yield* conn.prepare(`
          INSERT INTO messages (thread_id, role, content, position)
          VALUES (?, ?, ?, ?)
        `),

        selectParts: yield* conn.prepare<{ type: string; content: string }>(`
          SELECT type, content FROM parts
          WHERE thread_id = ?
          ORDER BY position ASC
        `),
        selectAgentParts: yield* conn.prepare<{
          type: string;
          content: string;
        }>(`
          SELECT type, content FROM parts
          WHERE thread_id = ? AND sender = ?
          ORDER BY position ASC
        `),
        insertPart: yield* conn.prepare(`
          INSERT INTO parts (thread_id, type, content, position)
          VALUES (?, ?, ?, ?)
        `),
        countParts: yield* conn.prepare<{ count: number }>(`
          SELECT COUNT(*) as count FROM parts WHERE thread_id = ?
        `),
        deleteParts: yield* conn.prepare(`
          DELETE FROM parts WHERE thread_id = ?
        `),
        deleteAgentParts: yield* conn.prepare(`
          DELETE FROM parts WHERE thread_id = ? AND sender = ?
        `),
        // Get distinct senders that have incomplete message streams
        // An agent is "typing" if they have parts but no text-end yet
        selectTypingAgents: yield* conn.prepare<{ sender: string }>(`
          SELECT DISTINCT sender FROM parts
          WHERE thread_id = ? 
            AND sender IS NOT NULL
            AND sender NOT IN (
              SELECT DISTINCT sender FROM parts 
              WHERE thread_id = ? AND type = 'text-end' AND sender IS NOT NULL
            )
        `),

        listAllThreads: yield* conn.prepare<{
          thread_id: string;
        }>(`
          SELECT DISTINCT thread_id FROM threads ORDER BY thread_id
        `),
        deleteThread: yield* conn.prepare(`
          DELETE FROM threads WHERE thread_id = ?
        `),
        deleteThreadMessages: yield* conn.prepare(`
          DELETE FROM messages WHERE thread_id = ?
        `),
        deleteThreadParts: yield* conn.prepare(`
          DELETE FROM parts WHERE thread_id = ?
        `),
      };
    }).pipe(mapError("prepare statements"));

    return createStateStore({
      readThreadMessages: (threadId) =>
        Effect.gen(function* () {
          const rows = yield* stmts.selectMessages.all(threadId);
          return rows.map((row) => ({
            role: row.role as MessageEncoded["role"],
            content: JSON.parse(row.content),
          })) as readonly MessageEncoded[];
        }).pipe(mapError("read messages")),

      readThreadMessagesWithSender: (threadId) =>
        Effect.gen(function* () {
          const rows = yield* stmts.selectMessagesWithSender.all(threadId);
          return rows.map((row) => ({
            role: row.role as MessageEncoded["role"],
            content: JSON.parse(row.content),
            sender: row.sender ?? undefined,
          })) as readonly MessageWithSender[];
        }).pipe(mapError("read messages with sender")),

      writeThreadMessages: (threadId, messages) =>
        conn
          .batch([
            // Ensure thread exists
            {
              sql: `INSERT INTO threads (thread_id, created_at, updated_at)
                    VALUES (?, unixepoch(), unixepoch())
                    ON CONFLICT (thread_id) DO UPDATE SET updated_at = unixepoch()`,
              params: [threadId],
            },
            // Clear existing messages
            {
              sql: `DELETE FROM messages WHERE thread_id = ?`,
              params: [threadId],
            },
            // Insert all new messages
            ...messages.map((msg, i) => ({
              sql: `INSERT INTO messages (thread_id, role, content, position)
                    VALUES (?, ?, ?, ?)`,
              params: [
                threadId,
                msg.role,
                JSON.stringify(msg.content),
                i,
              ],
            })),
          ])
          .pipe(mapError("write messages")),

      writeThreadMessagesWithSender: (threadId, messages) =>
        conn
          .batch([
            // Ensure thread exists
            {
              sql: `INSERT INTO threads (thread_id, created_at, updated_at)
                    VALUES (?, unixepoch(), unixepoch())
                    ON CONFLICT (thread_id) DO UPDATE SET updated_at = unixepoch()`,
              params: [threadId],
            },
            // Clear existing messages
            {
              sql: `DELETE FROM messages WHERE thread_id = ?`,
              params: [threadId],
            },
            // Insert all new messages with sender
            ...messages.map((msg, i) => ({
              sql: `INSERT INTO messages (thread_id, role, content, position, sender)
                    VALUES (?, ?, ?, ?, ?)`,
              params: [
                threadId,
                msg.role,
                JSON.stringify(msg.content),
                i,
                msg.sender ?? null,
              ],
            })),
          ])
          .pipe(mapError("write messages with sender")),

      readThreadParts: (threadId) =>
        Effect.gen(function* () {
          const rows = yield* stmts.selectParts.all(threadId);
          return rows.map((row) => JSON.parse(row.content) as MessagePart);
        }).pipe(mapError("read parts")),

      readAgentParts: (threadId, sender) =>
        Effect.gen(function* () {
          const rows = yield* stmts.selectAgentParts.all(threadId, sender);
          return rows.map((row) => JSON.parse(row.content) as MessagePart);
        }).pipe(mapError("read agent parts")),

      appendThreadPart: (threadId, part) =>
        conn
          .batch([
            // Ensure thread exists
            {
              sql: `INSERT INTO threads (thread_id, created_at, updated_at)
                    VALUES (?, unixepoch(), unixepoch())
                    ON CONFLICT (thread_id) DO UPDATE SET updated_at = unixepoch()`,
              params: [threadId],
            },
            // Insert part with position from subquery (atomic within batch transaction)
            // Include sender from the part object
            {
              sql: `INSERT INTO parts (thread_id, type, content, position, sender)
                    SELECT ?, ?, ?, COALESCE(MAX(position) + 1, 0), ?
                    FROM parts WHERE thread_id = ?`,
              params: [
                threadId,
                part.type,
                JSON.stringify(part),
                (part as any).sender ?? null,
                threadId,
              ],
            },
          ])
          .pipe(mapError("append part")),

      // No-op for SQLite layer - PubSub handling is in createStateStore wrapper.
      // User input is published to PubSub for real-time UI but not persisted to parts table.
      publishThreadPart: () => Effect.void,

      truncateThreadParts: (threadId) =>
        stmts.deleteParts.run(threadId).pipe(mapError("truncate parts")),

      truncateAgentParts: (threadId, sender) =>
        stmts.deleteAgentParts
          .run(threadId, sender)
          .pipe(mapError("truncate agent parts")),

      getTypingAgents: (threadId) =>
        Effect.gen(function* () {
          const rows = yield* stmts.selectTypingAgents.all(threadId, threadId);
          return rows.map((row) => row.sender);
        }).pipe(mapError("get typing agents")),

      listThreads: () =>
        Effect.gen(function* () {
          const rows = yield* stmts.listAllThreads.all();
          return rows.map((row) => ({
            threadId: row.thread_id,
          }));
        }).pipe(mapError("list threads")),

      deleteThread: (threadId) =>
        // Batch is already atomic in libsql, no need for explicit transaction
        conn
          .batch([
            {
              sql: `DELETE FROM parts WHERE thread_id = ?`,
              params: [threadId],
            },
            {
              sql: `DELETE FROM messages WHERE thread_id = ?`,
              params: [threadId],
            },
            {
              sql: `DELETE FROM threads WHERE thread_id = ?`,
              params: [threadId],
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
  {
    version: "002_conversations_and_thread_replies",
    statements: [
      // Conversations table for DMs, Groups, and Channels
      `CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        channel_type TEXT NOT NULL CHECK (channel_type IN ('dm', 'group', 'channel')),
        channel_id TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
        UNIQUE (channel_type, channel_id)
      )`,
      // Index for looking up conversations by channel
      `CREATE INDEX IF NOT EXISTS idx_conversations_channel ON conversations(channel_type, channel_id)`,
      // Update threads table to support thread replies
      `ALTER TABLE threads ADD COLUMN conversation_id TEXT REFERENCES conversations(id)`,
      `ALTER TABLE threads ADD COLUMN parent_message_id INTEGER`,
      `ALTER TABLE threads ADD COLUMN channel_type TEXT`,
      `ALTER TABLE threads ADD COLUMN channel_id TEXT`,
      // Index for finding threads by conversation
      `CREATE INDEX IF NOT EXISTS idx_threads_conversation ON threads(conversation_id)`,
      // Index for finding reply threads
      `CREATE INDEX IF NOT EXISTS idx_threads_parent ON threads(parent_message_id)`,
    ],
  },
  {
    version: "003_unify_thread_storage",
    statements: [
      // Create new tables without agent_id in primary keys
      // All participants in a thread share the same conversation history
      `CREATE TABLE threads_v2 (
        thread_id TEXT PRIMARY KEY,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER NOT NULL DEFAULT (unixepoch())
      )`,
      `CREATE TABLE messages_v2 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        thread_id TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        position INTEGER NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      )`,
      `CREATE TABLE parts_v2 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        thread_id TEXT NOT NULL,
        type TEXT NOT NULL,
        content TEXT NOT NULL,
        position INTEGER NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      )`,
      `CREATE INDEX idx_messages_v2_thread ON messages_v2(thread_id)`,
      `CREATE INDEX idx_parts_v2_thread ON parts_v2(thread_id)`,
      // Migrate existing data - group by thread_id, keeping unique threads
      `INSERT OR REPLACE INTO threads_v2 (thread_id, created_at, updated_at)
       SELECT thread_id, MIN(created_at), MAX(updated_at) FROM threads GROUP BY thread_id`,
      // Migrate messages (for DMs, threadId == agentId so we just take one copy)
      `INSERT INTO messages_v2 (thread_id, role, content, position, created_at)
       SELECT thread_id, role, content, position, created_at FROM messages
       WHERE rowid IN (
         SELECT MIN(rowid) FROM messages GROUP BY thread_id, position
       )`,
      // Drop old tables and indexes
      `DROP INDEX IF EXISTS idx_messages_thread`,
      `DROP INDEX IF EXISTS idx_parts_thread`,
      `DROP INDEX IF EXISTS idx_threads_conversation`,
      `DROP INDEX IF EXISTS idx_threads_parent`,
      `DROP TABLE parts`,
      `DROP TABLE messages`,
      `DROP TABLE threads`,
      // Rename new tables
      `ALTER TABLE threads_v2 RENAME TO threads`,
      `ALTER TABLE messages_v2 RENAME TO messages`,
      `ALTER TABLE parts_v2 RENAME TO parts`,
    ],
  },
  {
    version: "004_add_sender_column",
    statements: [
      // Add sender column to parts table for tracking which agent produced each part
      `ALTER TABLE parts ADD COLUMN sender TEXT`,
      // Add sender column to messages table for tracking message attribution
      `ALTER TABLE messages ADD COLUMN sender TEXT`,
      // Index for efficient querying of parts by sender (for agent-scoped flush and typing indicators)
      `CREATE INDEX idx_parts_sender ON parts(thread_id, sender)`,
    ],
  },
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
