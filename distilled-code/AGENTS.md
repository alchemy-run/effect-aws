# distilled-code

> See [../AGENTS.md](../AGENTS.md) for ecosystem overview and shared TDD patterns.

Programmatic coding agent library with a simple CLI.

## CLI Usage

```bash
# Send a prompt to all agents
distill "implement the API endpoints"

# Send a prompt to agents matching a pattern
distill "api/*" "implement the API endpoints"

# List all configured agents
distill --list

# List agents matching a pattern
distill --list "api/*"

# Use a specific config file
distill -c ./my.config.ts "implement the API"

# Use a different model
distill -m claude-opus "implement the API"
```

Agents run in parallel by default.

## Configuration

Create a `distilled.config.ts` in your project:

```typescript
import { agent, defineConfig, Toolkit } from "distilled-code";

export default defineConfig({
  name: "my-project",
  model: "claude-sonnet",
  agents: [
    agent("api/listTodos", {
      toolkit: Toolkit.Coding,
      description: "Implements GET /todos",
    }),
    agent("api/createTodo", {
      toolkit: Toolkit.Coding,
      description: "Implements POST /todos",
      tags: ["api", "post"],
    }),
  ],
});
```

## Core API

```typescript
import { agent, spawn, Toolkit } from "distilled-code";

// Define an agent
const myAgent = agent("api/listTodos", {
  toolkit: Toolkit.Coding,
  description: "Implements GET /todos",
});

// Spawn it - persists to .distilled/{key}.json
const spawned = yield* spawn(myAgent, {
  onText: (delta) => process.stdout.write(delta),
});

// Send prompts - conversation persists across calls
yield* spawned.send("Read the API spec and implement GET /todos");
yield* spawned.send("Now add pagination support");

// Access the definition
spawned.definition.metadata?.description;
```

## Persistence

Sessions stream to disk:

```
.distilled/
├── api/
│   ├── listTodos.json
│   ├── getTodo.json
│   └── createTodo.json
└── test/
    └── unit.json
```

Keys are paths. Nested keys create directories.

## Available Tools

| Tool    | Description                                |
| ------- | ------------------------------------------ |
| `read`  | Read file contents                         |
| `write` | Write file contents                        |
| `edit`  | Edit existing files with smart replacement |
| `glob`  | Find files by pattern                      |
| `grep`  | Search file contents                       |
| `bash`  | Execute shell commands                     |
| `spawn` | Spawn parallel sub-agents                  |

## Tool Error Handling

**Philosophy**: LLMs benefit from information, not exceptions. Most "errors" are helpful data the LLM can use to adjust.

Return as success strings:
- **File not found**: `"File not found: foo.ts. Did you mean?\nbar.ts"`
- **No matches**: `"No matches found for pattern \"xyz\""`
- **Command output**: `"Command failed: npm ERR! ..."`
- **Edit failures**: `"Could not find oldString in file..."`

Tools use `failure: S.Never` - all results go through the success channel.

```typescript
// In tool implementation - catch errors and return as success
const result = yield* someOperation().pipe(
  Effect.catchAll((e) => Effect.succeed(`Operation failed: ${e}`)),
);
```

## Effect-First I/O

distilled tooling is Effect-native. Avoid raw `Promise`/`async` usage for I/O and prefer
Effect services so failures are modeled and handled consistently.

**Use Effect services:**
- `FileSystem.FileSystem` for filesystem work
- `Command` for running subprocesses
- `Console` for logs

**Avoid** `Effect.promise` and ad-hoc `async` I/O wrappers in scripts.

Example:

```typescript
const fs = yield* FileSystem.FileSystem;
yield* fs.makeDirectory("out", { recursive: true });
yield* fs.writeFileString("out/file.ts", content);
yield* Command.make("bun", "format").pipe(Command.string);
```

## Architecture

```
distilled-code/
├── bin/
│   └── distilled.ts       # CLI entry point
├── src/
│   ├── agent.ts           # agent(), spawn(), AgentDefinition
│   ├── config.ts          # defineConfig, config loading
│   ├── tools/
│   │   ├── index.ts       # CodingTools, Toolkit namespace
│   │   ├── bash.ts        # Execute shell commands
│   │   ├── read.ts        # Read files
│   │   ├── write.ts       # Write files
│   │   ├── edit.ts        # Edit files
│   │   ├── glob.ts        # Find files
│   │   ├── grep.ts        # Search content
│   │   └── spawn.ts       # Sub-agents
│   └── util/
│       ├── replace.ts     # Edit replacement logic
│       └── wildcard.ts    # Glob pattern matching
└── .distilled/            # Persisted sessions
```

## Development

```bash
bun install
bun vitest run
bun tsgo -b
bun run bin/distilled.ts --list
```

## Environment

```bash
ANTHROPIC_API_KEY=xxx    # Required
DEBUG=1                  # Enable debug logging
```
