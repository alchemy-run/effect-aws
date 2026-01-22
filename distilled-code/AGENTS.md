# distilled-code

> See [../AGENTS.md](../AGENTS.md) for ecosystem overview and shared TDD patterns.

Programmatic coding agent library with a simple CLI.

## CLI Usage

```bash
# Send a prompt to all agents
distill "implement the API endpoints"

# Filter agents by pattern
distill --filter "api/*" "implement the API endpoints"

# List all configured agents
distill --list

# List agents matching a pattern
distill --list --filter "api/*"

# Use a specific config file
distill -c ./my.config.ts "implement the API"

# Use a different model
distill -m claude-opus "implement the API"
```

## Configuration

Create a `distilled.config.ts`:

```typescript
import { agent, defineConfig } from "distilled-code";

export default defineConfig({
  name: "my-project",
  model: "claude-sonnet",
  agents: [
    agent("api/listTodos", {
      toolkit: "Coding",
      tags: ["api", "get"],
      description: "Implements GET /todos",
    }),
    agent("api/createTodo", {
      toolkit: "Coding",
      tags: ["api", "post"],
      description: "Implements POST /todos",
    }),
  ],
});
```

## Core API

### `agent()` - Single Unified Function

The `agent()` function handles both simple and workflow agents:

```typescript
import { agent } from "distilled-code";
import { Effect } from "effect";

// Leaf agent - just key and options
const myAgent = yield* agent("api/listTodos", {
  toolkit: "Coding",
  tags: ["api"],
  description: "Implements GET /todos",
});

yield* myAgent.send("implement the endpoint");
const result = yield* myAgent.query("what files did you create?", MySchema);
```

### Workflow Agents

Pass a workflow function as the second argument:

```typescript
const workflow = yield* agent(
  "feature/implement",
  Effect.fn(function* (prompt) {
    // Sub-agents get nested keys: "feature/implement/planner"
    const planner = yield* agent("planner", { toolkit: "Planning" });
    const executor = yield* agent("executor", { toolkit: "Coding" });
    const reviewer = yield* agent("reviewer", { toolkit: "ReadOnly" });

    // Orchestrate
    yield* planner.send(prompt);

    for (let i = 0; i < 3; i++) {
      yield* executor.send("Complete todos");
      const review = yield* reviewer.send("Review. Say APPROVED if done.");
      if (review.includes("APPROVED")) break;
    }
  }),
  { tags: ["feature"], description: "Multi-agent workflow" },
);

yield* workflow.send("add user authentication");
```

### Agent Interface

When you `yield* agent(...)`, you get:

```typescript
interface Agent {
  key: string;           // "api/listTodos"
  tags?: string[];       // ["api", "get"]
  description?: string;  // "Implements GET /todos"

  send: (prompt: string) => Effect<string>;
  query: <A>(prompt: string, schema: Schema<A>) => Effect<A>;
}
```

### Options

```typescript
interface AgentOptions {
  toolkit?: "Coding" | "Planning" | "ReadOnly";
  tags?: string[];
  description?: string;
  todoScope?: "parent" | "agent" | string;
  onText?: (delta: string) => void;
}
```

### Toolkits

| Toolkit | Description | Tools |
| ------- | ----------- | ----- |
| `Coding` | Full toolkit | bash, edit, write, read, glob, grep, todo |
| `Planning` | Read/write, no bash | edit, write, read, glob, grep, todo |
| `ReadOnly` | Analysis only | read, glob, grep, todo (read) |

### Todo Scoping

```typescript
// Share todos with parent workflow
const planner = yield* agent("planner", { todoScope: "parent" });

// Isolated (default)
const executor = yield* agent("executor", { todoScope: "agent" });

// Custom scope
const reviewer = yield* agent("reviewer", { todoScope: "shared" });
```

## Dynamic Agents

Generate agents from parsed code:

```typescript
import { agent, defineConfig } from "distilled-code";
import { Effect } from "effect";

export default defineConfig({
  agents: Effect.gen(function* () {
    const services = yield* parseCode({ basePath: "./src" });

    return yield* Effect.all(services.flatMap((s) =>
      s.operations.map((op) =>
        agent(`${s.name}/${op.name}`, {
          toolkit: "Coding",
          tags: [s.name, op.method],
          description: `Test ${op.name}`,
        }),
      ),
    ));
  }),
});
```

## Persistence

Sessions persist to `.distilled/{key}.json`:

```
.distilled/
├── api/
│   ├── listTodos.json
│   └── createTodo.json
└── feature/
    └── implement.json
```

## Project Structure

```
distilled-code/
├── bin/
│   └── distill.ts         # CLI
├── src/
│   ├── agent.ts           # agent(), AgentScope
│   ├── config.ts          # defineConfig, helpers
│   ├── tools/             # Toolkits
│   ├── services/          # AgentState, etc.
│   └── lsp/               # Language server
└── test/
    └── agent.test.ts
```
