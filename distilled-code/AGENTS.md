# Effect Code - Coding Agent Architecture

This document describes the architecture and patterns used in the Effect Code project, an AI-powered coding agent built with [Effect](https://effect.website/).

## Project Overview

Effect Code is a terminal-based coding agent that uses LLMs to assist with code generation, editing, and exploration. It leverages Effect's powerful type-safe abstractions for managing side effects, concurrency, and error handling.

## Directory Structure

```
src/
├── index.ts                 # CLI entry point
├── check.ts                 # Type checking utilities
├── tools/                   # AI tool definitions
│   ├── index.ts             # Tool exports and merged toolkit
│   ├── bash.ts              # Shell command execution
│   ├── edit.ts              # File editing with smart replacement
│   ├── glob.ts              # File pattern matching
│   ├── grep.ts              # Content search with ripgrep
│   ├── read.ts              # File reading
│   ├── write.ts             # File writing
│   └── spawn.ts             # Parallel sub-agent spawning
├── tui/                     # Terminal UI (OpenTUI + SolidJS)
│   ├── index.tsx            # TUI entry point
│   ├── App.tsx              # Main application component
│   ├── components/          # UI components
│   └── services/            # Effect services for TUI
├── agent/                   # Agent orchestration
│   └── SubAgent.ts          # Parallel sub-agent execution
└── util/                    # Utility functions
    ├── command-validator.ts # Shell command validation
    ├── exec.ts              # Command execution helpers
    ├── parser.ts            # Tree-sitter parsing
    ├── replace.ts           # Smart string replacement
    ├── ripgrep.ts           # Ripgrep integration
    └── wildcard.ts          # Glob pattern matching
```

## Core Concepts

### Tools

Tools are the primary interface between the LLM and the system. Each tool is defined using `@effect/ai`'s `Tool.make` function:

```typescript
import { Tool, Toolkit } from "@effect/ai";
import * as S from "effect/Schema";
import * as Effect from "effect/Effect";

// Define the tool
export const myTool = Tool.make("toolName", {
  description: "What this tool does",
  parameters: {
    param1: S.String.annotations({ description: "Parameter description" }),
    param2: S.Number.annotations({ description: "Another parameter" }),
  },
  success: S.String,  // Return type schema
  failure: S.Any,     // Error type schema
});

// Create a toolkit from the tool
export const myToolkit = Toolkit.make(myTool);

// Implement the tool as a Layer
export const myToolkitLayer = myToolkit.toLayer(
  Effect.gen(function* () {
    // Access services here
    const fs = yield* FileSystem.FileSystem;
    
    return {
      toolName: Effect.fn(function* (params) {
        // Tool implementation
        return "result";
      }),
    };
  }),
);
```

### Toolkit Composition

Tools are merged together into a single toolkit:

```typescript
// src/tools/index.ts
export const toolkit = Toolkit.merge(
  editToolkit,
  globToolkit,
  grepToolkit,
  readToolkit,
  writeToolkit,
  spawnToolkit,
);

export const toolkitLayer = Layer.mergeAll(
  editToolkitLayer,
  globToolkitLayer,
  grepToolkitLayer,
  readToolkitLayer,
  writeToolkitLayer,
  spawnToolkitLayer,
);
```

### AI Integration

The project uses `@effect/ai` and `@effect/ai-openai` for LLM integration:

```typescript
import * as Chat from "@effect/ai/Chat";
import * as LanguageModel from "@effect/ai/LanguageModel";
import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai";

// Configure OpenAI client
const OpenAi = OpenAiClient.layerConfig({
  apiKey: Config.redacted("OPENAI_API_KEY"),
});

// Select a model
const model = OpenAiLanguageModel.model("gpt-5-codex");

// Use chat with tools
yield* Chat.fromPrompt([
  { role: "system", content: systemPrompt },
]);

const response = yield* LanguageModel.generateObject({
  toolkit,
  prompt: userMessage,
  schema: ResponseSchema,
});
```

### String Replacement Strategy

The `edit` tool uses a sophisticated multi-strategy replacement system (`src/util/replace.ts`):

1. **SimpleReplacer** - Exact string match
2. **LineTrimmedReplacer** - Match ignoring leading/trailing whitespace per line
3. **BlockAnchorReplacer** - Match by first/last line anchors with fuzzy middle
4. **WhitespaceNormalizedReplacer** - Match with normalized whitespace
5. **IndentationFlexibleReplacer** - Match ignoring base indentation
6. **EscapeNormalizedReplacer** - Handle escape sequences
7. **TrimmedBoundaryReplacer** - Match trimmed content
8. **ContextAwareReplacer** - Match using context lines as anchors

### Effect Patterns Used

#### Service Pattern

```typescript
import * as Context from "effect/Context";
import * as Layer from "effect/Layer";

export class MyService extends Context.Tag("MyService")<
  MyService,
  { doSomething: () => Effect.Effect<void> }
>() {}

export const myServiceLayer = Layer.effect(
  MyService,
  Effect.gen(function* () {
    return { doSomething: () => Effect.void };
  }),
);
```

#### Error Handling

```typescript
yield* Effect.fail({ error: "descriptive message" });

// Or with typed errors
yield* fs.stat(filePath).pipe(
  Effect.catchIf(
    (err) => err._tag === "SystemError" && err.reason === "NotFound",
    () => Effect.void,
  ),
);
```

#### Concurrency

```typescript
// Parallel execution
yield* Effect.all(tasks, { concurrency: "unbounded" });

// Fiber-based interruption
const fiber = yield* Effect.fork(longRunningTask);
yield* Fiber.interrupt(fiber);
```

## Adding a New Tool

1. Create a new file in `src/tools/`:

```typescript
// src/tools/mytool.ts
import { Tool, Toolkit } from "@effect/ai";
import * as S from "effect/Schema";
import * as Effect from "effect/Effect";

export const myTool = Tool.make("myTool", {
  description: "Description of what the tool does",
  parameters: {
    input: S.String.annotations({ description: "Input parameter" }),
  },
  success: S.String,
  failure: S.Any,
});

export const myToolkit = Toolkit.make(myTool);

export const myToolkitLayer = myToolkit.toLayer(
  Effect.gen(function* () {
    return {
      myTool: Effect.fn(function* ({ input }) {
        // Implementation
        return `Processed: ${input}`;
      }),
    };
  }),
);
```

2. Export from `src/tools/index.ts`:

```typescript
import { myToolkit, myToolkitLayer } from "./mytool.ts";

export const toolkit = Toolkit.merge(
  // ... existing tools
  myToolkit,
);

export const toolkitLayer = Layer.mergeAll(
  // ... existing layers
  myToolkitLayer,
);
```

## TUI Architecture

The terminal UI is built with OpenTUI and SolidJS:

- **Input handling** - User text input with ESC interrupt support
- **Message display** - Chat-style conversation view
- **Diff rendering** - Inline colored diffs for file changes
- **Sub-agent display** - Collapsible views for parallel task progress

### Interrupt Controller

The `InterruptController` service enables graceful cancellation:

```typescript
// Press ESC to interrupt running operations
const result = yield* InterruptController.run(agentTask);
```

### Parallel Sub-Agents

The main agent can spawn sub-agents for concurrent tasks:

```typescript
// Agent calls spawn tool
yield* spawn({
  tasks: [
    { id: "task1", prompt: "Analyze file A" },
    { id: "task2", prompt: "Analyze file B" },
  ],
});
```

## Running the Project

```bash
# Install dependencies
bun install

# Run the TUI
bun run src/index.ts tui

# Run with a specific command
bun run src/index.ts generate <service>
```

## Environment Variables

- `ANTHROPIC_API_KEY` - Required for LLM access (Anthropic Claude)
- `DEBUG` - Set to enable debug logging

## Reference Codebase: OpenCode

We include [OpenCode](https://github.com/anomalyco/opencode) as a git submodule at `vendor/opencode/`. OpenCode is a production-grade open source coding agent that uses the same technologies we use (OpenTUI, SolidJS, Effect). Use it as a reference for:

- **OpenTUI patterns** - See how they structure TUI components
- **Effect patterns** - Learn from their Effect service implementations
- **Tool implementations** - Reference their tool designs and prompts

### Key Directories in OpenCode

```
vendor/opencode/packages/opencode/src/
├── cli/cmd/tui/                # TUI application
│   ├── app.tsx                 # Main TUI app entry
│   ├── component/              # Reusable UI components
│   │   ├── prompt/             # Input/autocomplete components
│   │   ├── dialog-*.tsx        # Modal dialogs
│   │   └── logo.tsx, border.tsx, etc.
│   ├── context/                # SolidJS context providers
│   │   ├── theme/              # Theme JSON files
│   │   ├── theme.tsx           # Theme context
│   │   ├── keybind.tsx         # Keyboard shortcut handling
│   │   └── route.tsx           # Routing/navigation
│   ├── routes/                 # Page components
│   │   ├── home.tsx            # Main chat view
│   │   └── session/            # Session-related views
│   ├── ui/                     # Base UI primitives
│   │   ├── dialog.tsx          # Dialog base component
│   │   ├── spinner.ts          # Loading spinner
│   │   └── toast.tsx           # Toast notifications
│   └── util/                   # TUI utilities
│       ├── clipboard.ts        # Clipboard handling
│       └── terminal.ts         # Terminal utilities
├── tool/                       # AI tool implementations (23 tools)
├── session/                    # Chat session management
├── agent/                      # Agent orchestration
├── provider/                   # LLM provider integrations
└── util/                       # Utility functions
```

### How to Use This Reference

1. **Search for patterns**:
   ```bash
   # Find how opencode handles text rendering
   grep -r "wrapMode" vendor/opencode/
   
   # Find their tool implementations
   ls vendor/opencode/packages/opencode/src/tool/
   
   # Search for Effect patterns
   grep -r "Effect.gen" vendor/opencode/packages/opencode/src/
   ```

2. **Read specific implementations**:
   ```bash
   # Read their TUI components
   cat vendor/opencode/packages/opencode/src/cli/cmd/chat.tsx
   
   # Read their tool definitions
   cat vendor/opencode/packages/opencode/src/tool/read.ts
   ```

3. **Copy and adapt patterns** - When implementing new features, find the equivalent in OpenCode and adapt it to our architecture.

### Updating the Submodule

```bash
# Pull latest changes
cd vendor/opencode && git pull origin dev

# Or from project root
git submodule update --remote vendor/opencode
```

### Important Notes

- OpenCode is MIT licensed, so we can reference and learn from their code
- Their TUI is more mature and battle-tested - prefer their patterns over custom solutions
- They also use OpenTUI which is "not ready for production" but they've worked around many issues
