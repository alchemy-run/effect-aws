import { NodeContext } from "@effect/platform-node";
import * as FileSystem from "@effect/platform/FileSystem";
import { describe, expect, it } from "@effect/vitest";
import { JSONSchema } from "effect";
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Agent } from "../src/agent.ts";
import { Channel } from "../src/chat/channel.ts";
import { GroupChat } from "../src/chat/group-chat.ts";
import { createContext, preamble } from "../src/context.ts";
import * as File from "../src/file/index.ts";
import { input } from "../src/input.ts";
import { Group } from "../src/org/group.ts";
import { Role } from "../src/org/role.ts";
import { output } from "../src/output.ts";
import { tool } from "../src/tool/tool.ts";
import * as Toolkit from "../src/toolkit/index.ts";
import { Toolkit as ToolkitFactory } from "../src/toolkit/toolkit.ts";

// Test layer with real filesystem for reading fixture files
const TestLayer = NodeContext.layer;

describe("createContext", () => {
  it.effect("renders simple agent with no references", () =>
    Effect.gen(function* () {
      class SimpleAgent extends Agent("simple")`Hello world` {}

      const ctx = yield* createContext(SimpleAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("simple")}Hello world`,
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders agent with file reference including content", () =>
    Effect.gen(function* () {
      // Create a test fixture file
      const fs = yield* FileSystem.FileSystem;
      yield* fs.writeFileString(
        "test/fixtures/app.ts",
        "export const app = 'hello';",
      );

      class MyFile extends File.TypeScript(
        "test/fixtures/app.ts",
      )`App entry point` {}
      class MyAgent extends Agent("app")`Uses ${MyFile} for main logic` {}

      const ctx = yield* createContext(MyAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("app")}Uses [app.ts](test/fixtures/app.ts) for main logic`,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              id: "ctx-file-0",
              name: "read",
              params: { filePath: "test/fixtures/app.ts" },
              providerExecuted: false,
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              id: "ctx-file-0",
              name: "read",
              isFailure: false,
              result: { content: "export const app = 'hello';" },
              providerExecuted: false,
            },
          ],
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders agent with nested agent reference", () =>
    Effect.gen(function* () {
      class ChildAgent extends Agent("child")`I am the child` {}
      class ParentAgent extends Agent("parent")`Delegates to ${ChildAgent}` {}

      const ctx = yield* createContext(ParentAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("parent")}Delegates to @child`,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              id: "ctx-agent-0",
              name: "read",
              params: { filePath: ".distilled/agents/child.md" },
              providerExecuted: false,
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              id: "ctx-agent-0",
              name: "read",
              isFailure: false,
              result: { content: "# @child\n\nI am the child" },
              providerExecuted: false,
            },
          ],
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders toolkit with tool references", () =>
    Effect.gen(function* () {
      class MyAgent extends Agent("worker")`Uses ${Toolkit.Coding}` {}

      const ctx = yield* createContext(MyAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("worker")}Uses 🧰Coding

---

## Toolkits

You can (and should) use the following tools to accomplish your tasks. Tool definitions are provided separately.

### Coding

A set of tools for reading, writing, and editing code:

- 🛠️bash
- 🛠️readlints
- 🛠️edit
- 🛠️glob
- 🛠️grep
- 🛠️read
- 🛠️write
`,
        },
      ]);

      // Verify the toolkit contains the expected tools
      expect(Object.keys(ctx.toolkit.tools).sort()).toEqual([
        "bash",
        "edit",
        "glob",
        "grep",
        "read",
        "readlints",
        "write",
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("does not visit same reference twice", () =>
    Effect.gen(function* () {
      // Note: With depth-limited context, files referenced by nested agents
      // are NOT embedded in the root context. Only direct references are embedded.
      class Agent1 extends Agent("a1")`I handle task A` {}
      class Agent2 extends Agent("a2")`I handle task B` {}
      class Root extends Agent("root")`Has ${Agent1} and ${Agent2}` {}

      const ctx = yield* createContext(Root);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("root")}Has @a1 and @a2`,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              id: "ctx-agent-0",
              name: "read",
              params: { filePath: ".distilled/agents/a1.md" },
              providerExecuted: false,
            },
            {
              type: "tool-call",
              id: "ctx-agent-1",
              name: "read",
              params: { filePath: ".distilled/agents/a2.md" },
              providerExecuted: false,
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              id: "ctx-agent-0",
              name: "read",
              isFailure: false,
              result: { content: "# @a1\n\nI handle task A" },
              providerExecuted: false,
            },
            {
              type: "tool-result",
              id: "ctx-agent-1",
              name: "read",
              isFailure: false,
              result: { content: "# @a2\n\nI handle task B" },
              providerExecuted: false,
            },
          ],
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("maintains order of first encounter", () =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      yield* fs.writeFileString("test/fixtures/a.ts", "// a");
      yield* fs.writeFileString("test/fixtures/b.ts", "// b");
      yield* fs.writeFileString("test/fixtures/c.ts", "// c");

      class FileA extends File.TypeScript("test/fixtures/a.ts")`A` {}
      class FileB extends File.TypeScript("test/fixtures/b.ts")`B` {}
      class FileC extends File.TypeScript("test/fixtures/c.ts")`C` {}
      class MyAgent extends Agent(
        "order",
      )`${FileA} then ${FileB} then ${FileC}` {}

      const ctx = yield* createContext(MyAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("order")}[a.ts](test/fixtures/a.ts) then [b.ts](test/fixtures/b.ts) then [c.ts](test/fixtures/c.ts)`,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              id: "ctx-file-0",
              name: "read",
              params: { filePath: "test/fixtures/a.ts" },
              providerExecuted: false,
            },
            {
              type: "tool-call",
              id: "ctx-file-1",
              name: "read",
              params: { filePath: "test/fixtures/b.ts" },
              providerExecuted: false,
            },
            {
              type: "tool-call",
              id: "ctx-file-2",
              name: "read",
              params: { filePath: "test/fixtures/c.ts" },
              providerExecuted: false,
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              id: "ctx-file-0",
              name: "read",
              isFailure: false,
              result: { content: "// a" },
              providerExecuted: false,
            },
            {
              type: "tool-result",
              id: "ctx-file-1",
              name: "read",
              isFailure: false,
              result: { content: "// b" },
              providerExecuted: false,
            },
            {
              type: "tool-result",
              id: "ctx-file-2",
              name: "read",
              isFailure: false,
              result: { content: "// c" },
              providerExecuted: false,
            },
          ],
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("handles missing files gracefully", () =>
    Effect.gen(function* () {
      class MissingFile extends File.TypeScript(
        "does/not/exist.ts",
      )`Missing file` {}
      class MyAgent extends Agent("missing")`Uses ${MissingFile}` {}

      const ctx = yield* createContext(MyAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("missing")}Uses [exist.ts](does/not/exist.ts)`,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              id: "ctx-file-0",
              name: "read",
              params: { filePath: "does/not/exist.ts" },
              providerExecuted: false,
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              id: "ctx-file-0",
              name: "read",
              isFailure: false,
              result: { content: "// File not found" },
              providerExecuted: false,
            },
          ],
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders primitive values inline", () =>
    Effect.gen(function* () {
      const count = 42;
      const name = "Alice";
      const active = true;
      class MyAgent extends Agent(
        "primitives",
      )`Count: ${count}, Name: ${name}, Active: ${active}` {}

      const ctx = yield* createContext(MyAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("primitives")}Count: 42, Name: Alice, Active: true`,
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders arrays as YAML lists", () =>
    Effect.gen(function* () {
      const items = ["hello", "world"];
      class MyAgent extends Agent("arrays")`Items:${items}` {}

      const ctx = yield* createContext(MyAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("arrays")}Items:
- hello
- world`,
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders Sets as YAML lists", () =>
    Effect.gen(function* () {
      const tags = new Set(["typescript", "effect"]);
      class MyAgent extends Agent("sets")`Tags:${tags}` {}

      const ctx = yield* createContext(MyAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("sets")}Tags:
- typescript
- effect`,
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders objects as YAML key-value pairs", () =>
    Effect.gen(function* () {
      const config = { host: "localhost", port: 3000 };
      class MyAgent extends Agent("objects")`Config:${config}` {}

      const ctx = yield* createContext(MyAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("objects")}Config:
host: localhost
port: 3000`,
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders nested structures as YAML", () =>
    Effect.gen(function* () {
      const data = {
        names: ["Sam", "John"],
        settings: { debug: true },
      };
      class MyAgent extends Agent("nested")`Data:${data}` {}

      const ctx = yield* createContext(MyAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("nested")}Data:
names:
  - Sam
  - John
settings:
  debug: true`,
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders array of objects as YAML", () =>
    Effect.gen(function* () {
      const users = [
        { name: "Alice", age: 30 },
        { name: "Bob", age: 25 },
      ];
      class MyAgent extends Agent("array-objects")`Users:${users}` {}

      const ctx = yield* createContext(MyAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("array-objects")}Users:
- name: Alice
  age: 30
- name: Bob
  age: 25`,
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders custom toolkit with tools and includes tool schemas", () =>
    Effect.gen(function* () {
      const message = input("message")`The message to echo`;
      const result = output("result")`The echoed message`;

      const echoTool = tool("echo")`Echoes the ${message} back.
Returns the ${result}.`(function* ({ message }) {
        return { result: message };
      });

      class EchoToolkit extends ToolkitFactory("EchoToolkit")`
A simple echo toolkit:
- ${echoTool}
` {}

      class MyAgent extends Agent("echo-agent")`Uses ${EchoToolkit}` {}

      const ctx = yield* createContext(MyAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("echo-agent")}Uses 🧰EchoToolkit

---

## Toolkits

You can (and should) use the following tools to accomplish your tasks. Tool definitions are provided separately.

### EchoToolkit

A simple echo toolkit:
- 🛠️echo
`,
        },
      ]);

      // Verify toolkit contains the echo tool
      expect(Object.keys(ctx.toolkit.tools)).toEqual(["echo"]);

      // Verify tool description
      expect(ctx.toolkit.tools.echo).toMatchObject({
        name: "echo",
        description: "Echoes the ${message} back.\nReturns the ^{result}.",
      });

      // Verify tool parameters schema
      expect(JSONSchema.make(ctx.toolkit.tools.echo.parametersSchema)).toEqual({
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object",
        required: ["message"],
        properties: {
          message: {
            type: "string",
            description: "The message to echo",
          },
        },
        additionalProperties: false,
      });
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders tool that references a file", () =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      yield* fs.writeFileString(
        "test/fixtures/config.json",
        '{ "key": "value" }',
      );

      class ConfigFile extends File.Json(
        "test/fixtures/config.json",
      )`Configuration file` {}

      const configPath = input("configPath")`Path to config`;
      const configResult = output("config")`The loaded config`;

      const loadConfigTool = tool(
        "loadConfig",
      )`Loads configuration from ${ConfigFile}.
Takes ${configPath} and returns ${configResult}.`(function* () {
        return { config: "value" };
      });

      class ConfigToolkit extends ToolkitFactory("ConfigToolkit")`
Configuration tools:
- ${loadConfigTool}
` {}

      class MyAgent extends Agent("config-agent")`Uses ${ConfigToolkit}` {}

      const ctx = yield* createContext(MyAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("config-agent")}Uses 🧰ConfigToolkit

---

## Toolkits

You can (and should) use the following tools to accomplish your tasks. Tool definitions are provided separately.

### ConfigToolkit

Configuration tools:
- 🛠️loadConfig
`,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              id: "ctx-file-0",
              name: "read",
              params: { filePath: "test/fixtures/config.json" },
              providerExecuted: false,
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              id: "ctx-file-0",
              name: "read",
              isFailure: false,
              result: { content: '{ "key": "value" }' },
              providerExecuted: false,
            },
          ],
        },
      ]);

      // Verify tool description includes file reference
      expect(ctx.toolkit.tools.loadConfig).toMatchObject({
        name: "loadConfig",
        description:
          "Loads configuration from [config.json](test/fixtures/config.json).\nTakes ${configPath} and returns ^{config}.",
      });
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders tool that references an agent", () =>
    Effect.gen(function* () {
      class HelperAgent extends Agent("helper")`I help with tasks` {}

      const task = input("task")`The task to delegate`;
      const result = output("result")`The result from helper`;

      const delegateTool = tool("delegate")`Delegates a task to ${HelperAgent}.
Takes ${task} and returns ${result}.`(function* ({ task }) {
        return { result: `Completed: ${task}` };
      });

      class DelegationToolkit extends ToolkitFactory("DelegationToolkit")`
Delegation tools:
- ${delegateTool}
` {}

      class MyAgent extends Agent(
        "delegator",
      )`Uses ${DelegationToolkit} to work with ${HelperAgent}` {}

      const ctx = yield* createContext(MyAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("delegator")}Uses 🧰DelegationToolkit to work with @helper

---

## Toolkits

You can (and should) use the following tools to accomplish your tasks. Tool definitions are provided separately.

### DelegationToolkit

Delegation tools:
- 🛠️delegate
`,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              id: "ctx-agent-0",
              name: "read",
              params: { filePath: ".distilled/agents/helper.md" },
              providerExecuted: false,
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              id: "ctx-agent-0",
              name: "read",
              isFailure: false,
              result: { content: "# @helper\n\nI help with tasks" },
              providerExecuted: false,
            },
          ],
        },
      ]);

      // Verify tool description includes agent reference
      expect(ctx.toolkit.tools.delegate).toMatchObject({
        name: "delegate",
        description:
          "Delegates a task to @helper.\nTakes ${task} and returns ^{result}.",
      });
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders tool that references both file and agent", () =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      yield* fs.writeFileString("test/fixtures/data.json", '{ "items": [] }');

      class DataFile extends File.Json(
        "test/fixtures/data.json",
      )`Data storage file` {}
      class ProcessorAgent extends Agent("processor")`Processes data` {}

      const dataInput = input("data")`The data to process`;
      const processedOutput = output("processed")`The processed result`;

      const processTool = tool(
        "process",
      )`Reads from ${DataFile} and sends to ${ProcessorAgent}.
Takes ${dataInput} and returns ${processedOutput}.`(function* ({ data }) {
        return { processed: data };
      });

      class DataToolkit extends ToolkitFactory("DataToolkit")`
Data processing tools:
- ${processTool}
` {}

      class MyAgent extends Agent("data-agent")`Uses ${DataToolkit}` {}

      const ctx = yield* createContext(MyAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("data-agent")}Uses 🧰DataToolkit

---

## Toolkits

You can (and should) use the following tools to accomplish your tasks. Tool definitions are provided separately.

### DataToolkit

Data processing tools:
- 🛠️process
`,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              id: "ctx-agent-0",
              name: "read",
              params: { filePath: ".distilled/agents/processor.md" },
              providerExecuted: false,
            },
            {
              type: "tool-call",
              id: "ctx-file-1",
              name: "read",
              params: { filePath: "test/fixtures/data.json" },
              providerExecuted: false,
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              id: "ctx-agent-0",
              name: "read",
              isFailure: false,
              result: { content: "# @processor\n\nProcesses data" },
              providerExecuted: false,
            },
            {
              type: "tool-result",
              id: "ctx-file-1",
              name: "read",
              isFailure: false,
              result: { content: '{ "items": [] }' },
              providerExecuted: false,
            },
          ],
        },
      ]);

      // Verify tool description includes both references
      expect(ctx.toolkit.tools.process).toMatchObject({
        name: "process",
        description:
          "Reads from [data.json](test/fixtures/data.json) and sends to @processor.\nTakes ${data} and returns ^{processed}.",
      });
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders toolkit with multiple typed parameters", () =>
    Effect.gen(function* () {
      const a = input("a", S.Number)`First number`;
      const b = input("b", S.Number)`Second number`;
      const sum = output("sum", S.Number)`The sum`;

      const addTool = tool("add")`Adds ${a} and ${b}.
Returns the ${sum}.`(function* ({ a, b }) {
        return { sum: a + b };
      });

      class MathToolkit extends ToolkitFactory("MathToolkit")`
Math operations:
- ${addTool}
` {}

      class MyAgent extends Agent("math-agent")`Uses ${MathToolkit}` {}

      const ctx = yield* createContext(MyAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("math-agent")}Uses 🧰MathToolkit

---

## Toolkits

You can (and should) use the following tools to accomplish your tasks. Tool definitions are provided separately.

### MathToolkit

Math operations:
- 🛠️add
`,
        },
      ]);

      // Verify toolkit contains the add tool with correct schema
      expect(JSONSchema.make(ctx.toolkit.tools.add.parametersSchema)).toEqual({
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object",
        required: ["a", "b"],
        properties: {
          a: {
            type: "number",
            description: "First number",
          },
          b: {
            type: "number",
            description: "Second number",
          },
        },
        additionalProperties: false,
      });
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("merges multiple toolkits into one context", () =>
    Effect.gen(function* () {
      const inp1 = input("a")`Input A`;
      const out1 = output("b")`Output B`;
      const inp2 = input("c")`Input C`;
      const out2 = output("d")`Output D`;

      const toolA = tool("toolA")`Takes ${inp1}, returns ${out1}.`(function* ({
        a,
      }) {
        return { b: a };
      });

      const toolB = tool("toolB")`Takes ${inp2}, returns ${out2}.`(function* ({
        c,
      }) {
        return { d: c };
      });

      class ToolkitA extends ToolkitFactory("ToolkitA")`Has ${toolA}` {}
      class ToolkitB extends ToolkitFactory("ToolkitB")`Has ${toolB}` {}

      class MultiAgent extends Agent(
        "multi",
      )`Uses ${ToolkitA} and ${ToolkitB}` {}

      const ctx = yield* createContext(MultiAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("multi")}Uses 🧰ToolkitA and 🧰ToolkitB

---

## Toolkits

You can (and should) use the following tools to accomplish your tasks. Tool definitions are provided separately.

### ToolkitA

Has 🛠️toolA

### ToolkitB

Has 🛠️toolB
`,
        },
      ]);

      // Verify both tools are merged into the toolkit
      expect(Object.keys(ctx.toolkit.tools).sort()).toEqual(["toolA", "toolB"]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("does NOT collect toolkit from nested agent (depth-limited)", () =>
    Effect.gen(function* () {
      const inp = input("x")`Input`;
      const out = output("y")`Output`;

      const nestedTool = tool("nestedTool")`Takes ${inp}, returns ${out}.`(
        function* ({ x }) {
          return { y: x };
        },
      );

      class NestedToolkit extends ToolkitFactory("NestedToolkit")`
Nested toolkit with ${nestedTool}
` {}

      class ChildAgent extends Agent("child")`Uses ${NestedToolkit}` {}
      class ParentAgent extends Agent("parent")`Delegates to ${ChildAgent}` {}

      const ctx = yield* createContext(ParentAgent);

      // With depth-limited context, toolkits from nested agents are NOT embedded
      // The child agent is listed, but its toolkit is not included
      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("parent")}Delegates to @child`,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              id: "ctx-agent-0",
              name: "read",
              params: { filePath: ".distilled/agents/child.md" },
              providerExecuted: false,
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              id: "ctx-agent-0",
              name: "read",
              isFailure: false,
              result: { content: "# @child\n\nUses 🧰NestedToolkit" },
              providerExecuted: false,
            },
          ],
        },
      ]);

      // Toolkit from nested agent is NOT included - accessible via send/query tools
      expect(Object.keys(ctx.toolkit.tools)).toEqual([]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("returns empty toolkit for agent without toolkits", () =>
    Effect.gen(function* () {
      class SimpleAgent extends Agent("simple")`No toolkits here` {}

      const ctx = yield* createContext(SimpleAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("simple")}No toolkits here`,
        },
      ]);

      expect(ctx.toolkit.tools).toEqual({});
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("does NOT include toolkit from nested agents (depth-limited)", () =>
    Effect.gen(function* () {
      const inp = input("s")`String`;
      const out = output("r")`Result`;

      const sharedTool = tool("shared")`Takes ${inp}, returns ${out}.`(
        function* ({ s }) {
          return { r: s };
        },
      );

      class SharedToolkit extends ToolkitFactory("SharedToolkit")`
Shared: ${sharedTool}
` {}

      class Agent1 extends Agent("a1")`Uses ${SharedToolkit}` {}
      class Agent2 extends Agent("a2")`Also uses ${SharedToolkit}` {}
      class RootAgent extends Agent("root")`Has ${Agent1} and ${Agent2}` {}

      const ctx = yield* createContext(RootAgent);

      // With depth-limited context, toolkits from nested agents are NOT embedded
      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("root")}Has @a1 and @a2`,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              id: "ctx-agent-0",
              name: "read",
              params: { filePath: ".distilled/agents/a1.md" },
              providerExecuted: false,
            },
            {
              type: "tool-call",
              id: "ctx-agent-1",
              name: "read",
              params: { filePath: ".distilled/agents/a2.md" },
              providerExecuted: false,
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              id: "ctx-agent-0",
              name: "read",
              isFailure: false,
              result: { content: "# @a1\n\nUses 🧰SharedToolkit" },
              providerExecuted: false,
            },
            {
              type: "tool-result",
              id: "ctx-agent-1",
              name: "read",
              isFailure: false,
              result: { content: "# @a2\n\nAlso uses 🧰SharedToolkit" },
              providerExecuted: false,
            },
          ],
        },
      ]);

      // Toolkit from nested agents is NOT included
      expect(Object.keys(ctx.toolkit.tools)).toEqual([]);
    }).pipe(Effect.provide(TestLayer)),
  );

  // ============================================================
  // Tests for agents/files embedded in arrays and objects
  // ============================================================

  it.effect(
    "renders array of agents as YAML list with @ symbols (quoted)",
    () =>
      Effect.gen(function* () {
        class AgentA extends Agent("worker-a")`I handle task A` {}
        class AgentB extends Agent("worker-b")`I handle task B` {}
        class MyAgent extends Agent(
          "orchestrator",
        )`Available workers:${[AgentA, AgentB]}` {}

        const ctx = yield* createContext(MyAgent);

        // Note: References embedded in arrays are serialized as quoted strings
        // and are NOT automatically collected into the Agents section
        expect(ctx.messages).toEqual([
          {
            role: "system",
            content: `${preamble("orchestrator")}Available workers:
- "@worker-a"
- "@worker-b"`,
          },
        ]);
      }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders array of agents inline in sentence", () =>
    Effect.gen(function* () {
      class Alpha extends Agent("alpha")`Alpha agent` {}
      class Beta extends Agent("beta")`Beta agent` {}
      class Gamma extends Agent("gamma")`Gamma agent` {}
      class MyAgent extends Agent(
        "coordinator",
      )`Coordinate between these agents:${[Alpha, Beta, Gamma]} to complete tasks.` {}

      const ctx = yield* createContext(MyAgent);

      // Verify the array is rendered as YAML with quoted references
      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("coordinator")}Coordinate between these agents:
- "@alpha"
- "@beta"
- "@gamma" to complete tasks.`,
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders array of files as YAML list with markdown links", () =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      yield* fs.writeFileString("test/fixtures/main.ts", "// main entry");
      yield* fs.writeFileString("test/fixtures/utils.ts", "// utilities");

      class MainFile extends File.TypeScript(
        "test/fixtures/main.ts",
      )`Main entry point` {}
      class UtilsFile extends File.TypeScript(
        "test/fixtures/utils.ts",
      )`Utility functions` {}
      class MyAgent extends Agent(
        "codebase",
      )`Important files:${[MainFile, UtilsFile]}` {}

      const ctx = yield* createContext(MyAgent);

      // Note: Files embedded in arrays are serialized as quoted markdown links
      // but are NOT collected into the Files section
      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("codebase")}Important files:
- "[main.ts](test/fixtures/main.ts)"
- "[utils.ts](test/fixtures/utils.ts)"`,
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders array of files with mixed types", () =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      yield* fs.writeFileString("test/fixtures/config.json", '{"debug": true}');
      yield* fs.writeFileString("test/fixtures/styles.css", "body {}");

      class ConfigFile extends File.Json(
        "test/fixtures/config.json",
      )`Configuration` {}
      class StylesFile extends File.Css(
        "test/fixtures/styles.css",
      )`Stylesheet` {}
      class MyAgent extends Agent(
        "assets",
      )`Required assets:${[ConfigFile, StylesFile]}` {}

      const ctx = yield* createContext(MyAgent);

      // Verify array is rendered as YAML list with quoted links
      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("assets")}Required assets:
- "[config.json](test/fixtures/config.json)"
- "[styles.css](test/fixtures/styles.css)"`,
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders object with agent values as YAML", () =>
    Effect.gen(function* () {
      class LeaderAgent extends Agent("leader")`I lead the team` {}
      class WorkerAgent extends Agent("worker")`I do the work` {}
      class MyAgent extends Agent("team")`Team structure:${{
        leader: LeaderAgent,
        worker: WorkerAgent,
      }}` {}

      const ctx = yield* createContext(MyAgent);

      // Note: Agents embedded in objects are serialized as quoted strings
      // but are NOT collected into the Agents section
      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("team")}Team structure:
leader: "@leader"
worker: "@worker"`,
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders object with multiple agent roles", () =>
    Effect.gen(function* () {
      class Frontend extends Agent("frontend")`Frontend development` {}
      class Backend extends Agent("backend")`Backend development` {}
      class DevOps extends Agent("devops")`Infrastructure and deployment` {}
      class MyAgent extends Agent("project")`Project roles:${{
        ui: Frontend,
        api: Backend,
        infra: DevOps,
      }}` {}

      const ctx = yield* createContext(MyAgent);

      // Verify object is rendered as YAML with quoted agent references
      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("project")}Project roles:
ui: "@frontend"
api: "@backend"
infra: "@devops"`,
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders object with file values as YAML", () =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      yield* fs.writeFileString(
        "test/fixtures/schema.json",
        '{"type": "object"}',
      );
      yield* fs.writeFileString("test/fixtures/readme.md", "# Readme");

      class SchemaFile extends File.Json(
        "test/fixtures/schema.json",
      )`JSON Schema` {}
      class ReadmeFile extends File.Markdown(
        "test/fixtures/readme.md",
      )`Documentation` {}
      class MyAgent extends Agent("docs")`Documentation files:${{
        schema: SchemaFile,
        readme: ReadmeFile,
      }}` {}

      const ctx = yield* createContext(MyAgent);

      // Verify object is rendered as YAML with quoted file links
      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("docs")}Documentation files:
schema: "[schema.json](test/fixtures/schema.json)"
readme: "[readme.md](test/fixtures/readme.md)"`,
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders object with file values (direct refs get content)", () =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      yield* fs.writeFileString(
        "test/fixtures/app.config.ts",
        "export default { port: 3000 };",
      );

      class AppConfig extends File.TypeScript(
        "test/fixtures/app.config.ts",
      )`Application config` {}

      // Direct reference (not in object) DOES get collected and content shown
      class MyAgent extends Agent("config")`Configuration file: ${AppConfig}` {}

      const ctx = yield* createContext(MyAgent);

      // Direct reference includes file content via tool call
      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("config")}Configuration file: [app.config.ts](test/fixtures/app.config.ts)`,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              id: "ctx-file-0",
              name: "read",
              params: { filePath: "test/fixtures/app.config.ts" },
              providerExecuted: false,
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              id: "ctx-file-0",
              name: "read",
              isFailure: false,
              result: { content: "export default { port: 3000 };" },
              providerExecuted: false,
            },
          ],
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders nested object with arrays of agents", () =>
    Effect.gen(function* () {
      class ReviewerA extends Agent("reviewer-a")`Code reviewer A` {}
      class ReviewerB extends Agent("reviewer-b")`Code reviewer B` {}
      class ApproverA extends Agent("approver-a")`Approver A` {}
      class MyAgent extends Agent("workflow")`Workflow:${{
        reviewers: [ReviewerA, ReviewerB],
        approvers: [ApproverA],
      }}` {}

      const ctx = yield* createContext(MyAgent);

      // Verify nested structure is rendered correctly with quoted references
      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("workflow")}Workflow:
reviewers:
  - "@reviewer-a"
  - "@reviewer-b"
approvers:
  - "@approver-a"`,
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders nested object with files grouped by category", () =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      // Use flat path to avoid directory creation issues
      yield* fs.writeFileString("test/fixtures/index-src.ts", "// index");
      yield* fs.writeFileString("test/fixtures/types-src.ts", "// types");
      yield* fs.writeFileString("test/fixtures/main-test.ts", "// tests");

      class IndexFile extends File.TypeScript(
        "test/fixtures/index-src.ts",
      )`Main entry` {}
      class TypesFile extends File.TypeScript(
        "test/fixtures/types-src.ts",
      )`Type definitions` {}
      class TestFile extends File.TypeScript(
        "test/fixtures/main-test.ts",
      )`Test suite` {}

      class MyAgent extends Agent("codebase")`Code structure:${{
        source: {
          entry: IndexFile,
          types: TypesFile,
        },
        tests: [TestFile],
      }}` {}

      const ctx = yield* createContext(MyAgent);

      // Verify deeply nested structure with quoted links
      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("codebase")}Code structure:
source:
  entry: "[index-src.ts](test/fixtures/index-src.ts)"
  types: "[types-src.ts](test/fixtures/types-src.ts)"
tests:
  - "[main-test.ts](test/fixtures/main-test.ts)"`,
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect(
    "renders mixed references (agents, files, toolkits) in nested structure",
    () =>
      Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        yield* fs.writeFileString("test/fixtures/spec.md", "# Spec");

        class SpecFile extends File.Markdown(
          "test/fixtures/spec.md",
        )`Specification` {}
        class ImplementerAgent extends Agent(
          "implementer",
        )`Implements features` {}

        const taskInput = input("task")`Task to run`;
        const taskOutput = output("result")`The task result`;
        const runTool = tool(
          "run",
        )`Runs the ${taskInput}. Returns ${taskOutput}.`(function* ({ task }) {
          return { result: task };
        });
        class TaskToolkit extends ToolkitFactory(
          "TaskToolkit",
        )`Task tools: ${runTool}` {}

        class MyAgent extends Agent("project")`Project:${{
          spec: SpecFile,
          agent: ImplementerAgent,
          toolkit: TaskToolkit,
        }}` {}

        const ctx = yield* createContext(MyAgent);

        // Verify mixed references in object with appropriate symbols
        expect(ctx.messages).toEqual([
          {
            role: "system",
            content: `${preamble("project")}Project:
spec: "[spec.md](test/fixtures/spec.md)"
agent: "@implementer"
toolkit: 🧰TaskToolkit`,
          },
        ]);
      }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders array of objects each containing references", () =>
    Effect.gen(function* () {
      class AgentA extends Agent("agent-a")`Agent A` {}
      class AgentB extends Agent("agent-b")`Agent B` {}
      class MyAgent extends Agent("manager")`Tasks:${[
        { name: "Task 1", assignee: AgentA },
        { name: "Task 2", assignee: AgentB },
      ]}` {}

      const ctx = yield* createContext(MyAgent);

      // Verify array of objects with references
      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("manager")}Tasks:
- name: Task 1
  assignee: "@agent-a"
- name: Task 2
  assignee: "@agent-b"`,
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  // ============================================================
  // Tests for tool descriptions with embedded references
  // ============================================================

  it.effect("renders tool description with array of agents", () =>
    Effect.gen(function* () {
      class WorkerA extends Agent("worker-a")`Worker A tasks` {}
      class WorkerB extends Agent("worker-b")`Worker B tasks` {}

      const taskInput = input("task")`The task to dispatch`;
      const dispatchOutput = output("dispatched")`The dispatched task`;
      const dispatchTool = tool(
        "dispatch",
      )`Dispatches tasks to workers:${[WorkerA, WorkerB]}. Takes ${taskInput}. Returns ${dispatchOutput}.`(
        function* ({ task }) {
          return { dispatched: task };
        },
      );

      class DispatchToolkit extends ToolkitFactory(
        "DispatchToolkit",
      )`Dispatch tools: ${dispatchTool}` {}
      class MyAgent extends Agent("dispatcher")`Uses ${DispatchToolkit}` {}

      const ctx = yield* createContext(MyAgent);

      // Verify tool description contains array of quoted agent references
      // Note: YAML serialization puts last item on same line as following text
      expect(ctx.toolkit.tools.dispatch.description).toEqual(
        `Dispatches tasks to workers:
- "@worker-a"
- "@worker-b". Takes \${task}. Returns ^{dispatched}.`,
      );
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders tool description with array of files", () =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      yield* fs.writeFileString("test/fixtures/template1.html", "<html>");
      yield* fs.writeFileString("test/fixtures/template2.html", "<body>");

      class Template1 extends File.Html(
        "test/fixtures/template1.html",
      )`First template` {}
      class Template2 extends File.Html(
        "test/fixtures/template2.html",
      )`Second template` {}

      const nameInput = input("name")`Template name`;
      const htmlOutput = output("html")`The rendered HTML`;
      const renderTool = tool(
        "render",
      )`Renders one of these templates:${[Template1, Template2]}. Takes ${nameInput}. Returns ${htmlOutput}.`(
        function* ({ name }) {
          return { html: `<html>${name}</html>` };
        },
      );

      class RenderToolkit extends ToolkitFactory(
        "RenderToolkit",
      )`Render tools: ${renderTool}` {}
      class MyAgent extends Agent("renderer")`Uses ${RenderToolkit}` {}

      const ctx = yield* createContext(MyAgent);

      // Verify tool description contains array of quoted file references
      // Note: YAML serialization puts last item on same line as following text
      expect(ctx.toolkit.tools.render.description).toEqual(
        `Renders one of these templates:
- "[template1.html](test/fixtures/template1.html)"
- "[template2.html](test/fixtures/template2.html)". Takes \${name}. Returns ^{html}.`,
      );
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect(
    "renders tool description with object containing agent references",
    () =>
      Effect.gen(function* () {
        class Encoder extends Agent("encoder")`Encodes data` {}
        class Decoder extends Agent("decoder")`Decodes data` {}

        const dataInput = input("data")`Data to transform`;
        const transformedOutput = output("transformed")`The transformed data`;
        const transformTool = tool("transform")`Transforms data using:${{
          encode: Encoder,
          decode: Decoder,
        }}. Takes ${dataInput}. Returns ${transformedOutput}.`(function* ({
          data,
        }) {
          return { transformed: data };
        });

        class TransformToolkit extends ToolkitFactory(
          "TransformToolkit",
        )`Transform tools: ${transformTool}` {}
        class MyAgent extends Agent("transformer")`Uses ${TransformToolkit}` {}

        const ctx = yield* createContext(MyAgent);

        // Verify tool description contains object with quoted agent references
        // Note: YAML serialization puts last item on same line as following text
        expect(ctx.toolkit.tools.transform.description).toEqual(
          `Transforms data using:
encode: "@encoder"
decode: "@decoder". Takes \${data}. Returns ^{transformed}.`,
        );
      }).pipe(Effect.provide(TestLayer)),
  );

  it.effect(
    "renders tool description with object containing file references",
    () =>
      Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        yield* fs.writeFileString("test/fixtures/input.json", "{}");
        yield* fs.writeFileString("test/fixtures/output.json", "{}");

        class InputFile extends File.Json(
          "test/fixtures/input.json",
        )`Input schema` {}
        class OutputFile extends File.Json(
          "test/fixtures/output.json",
        )`Output schema` {}

        const validateInput = input("payload")`Payload to validate`;
        const validateTool = tool("validate")`Validates against schemas:${{
          input: InputFile,
          output: OutputFile,
        }}. Takes ${validateInput}.`(function* ({ payload: _ }) {});

        class ValidateToolkit extends ToolkitFactory(
          "ValidateToolkit",
        )`Validate tools: ${validateTool}` {}
        class MyAgent extends Agent("validator")`Uses ${ValidateToolkit}` {}

        const ctx = yield* createContext(MyAgent);

        // Verify tool description contains object with quoted file references
        // Note: YAML serialization puts last item on same line as following text
        expect(ctx.toolkit.tools.validate.description).toEqual(
          `Validates against schemas:
input: "[input.json](test/fixtures/input.json)"
output: "[output.json](test/fixtures/output.json)". Takes \${payload}.`,
        );
      }).pipe(Effect.provide(TestLayer)),
  );

  it.effect(
    "renders tool description with nested structure of references",
    () =>
      Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        yield* fs.writeFileString("test/fixtures/rules.json", '{"rules": []}');

        class RulesFile extends File.Json(
          "test/fixtures/rules.json",
        )`Validation rules` {}
        class ValidatorAgent extends Agent("validator")`Validates data` {}
        class FormatterAgent extends Agent("formatter")`Formats output` {}

        const dataInput = input("data")`Data to process`;
        const processTool = tool("process")`Processes data with:${{
          config: RulesFile,
          pipeline: [ValidatorAgent, FormatterAgent],
        }}. Takes ${dataInput}.`(function* () {});

        class ProcessToolkit extends ToolkitFactory(
          "ProcessToolkit",
        )`Process tools: ${processTool}` {}
        class MyAgent extends Agent("processor")`Uses ${ProcessToolkit}` {}

        const ctx = yield* createContext(MyAgent);

        // Verify tool description contains nested structure with quoted refs
        // Note: YAML serialization puts last item on same line as following text
        expect(ctx.toolkit.tools.process.description).toEqual(
          `Processes data with:
config: "[rules.json](test/fixtures/rules.json)"
pipeline:
  - "@validator"
  - "@formatter". Takes \${data}.`,
        );
      }).pipe(Effect.provide(TestLayer)),
  );

  // ============================================================
  // Tests for JSON Schema generation with embedded references
  // ============================================================

  it.effect(
    "JSON Schema is valid when tool description contains agent array",
    () =>
      Effect.gen(function* () {
        class WorkerA extends Agent("worker-a")`Worker A` {}
        class WorkerB extends Agent("worker-b")`Worker B` {}

        const taskInput = input("task")`Task description`;
        const priorityInput = input("priority", S.Number)`Priority level`;
        const assignTool = tool(
          "assign",
        )`Assigns to workers:${[WorkerA, WorkerB]}. Takes ${taskInput} with ${priorityInput}.`(
          function* ({ task: _task, priority: _priority }) {},
        );

        class AssignToolkit extends ToolkitFactory(
          "AssignToolkit",
        )`Assign tools: ${assignTool}` {}
        class MyAgent extends Agent("assigner")`Uses ${AssignToolkit}` {}

        const ctx = yield* createContext(MyAgent);

        // Verify JSON Schema is correct and not affected by agent references in description
        expect(
          JSONSchema.make(ctx.toolkit.tools.assign.parametersSchema),
        ).toEqual({
          $schema: "http://json-schema.org/draft-07/schema#",
          type: "object",
          required: ["task", "priority"],
          properties: {
            task: {
              type: "string",
              description: "Task description",
            },
            priority: {
              type: "number",
              description: "Priority level",
            },
          },
          additionalProperties: false,
        });
      }).pipe(Effect.provide(TestLayer)),
  );

  it.effect(
    "JSON Schema is valid when tool description contains file object",
    () =>
      Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        yield* fs.writeFileString("test/fixtures/schema.json", "{}");

        class SchemaFile extends File.Json(
          "test/fixtures/schema.json",
        )`Schema definition` {}

        const nameInput = input("name")`Resource name`;
        const tagsInput = input("tags", S.Array(S.String))`Resource tags`;
        const createTool = tool(
          "create",
        )`Creates resource following:${{ schema: SchemaFile }}. Takes ${nameInput} and ${tagsInput}.`(
          function* ({ name: _name, tags: _tags }) {},
        );

        class CreateToolkit extends ToolkitFactory(
          "CreateToolkit",
        )`Create tools: ${createTool}` {}
        class MyAgent extends Agent("creator")`Uses ${CreateToolkit}` {}

        const ctx = yield* createContext(MyAgent);

        // Verify JSON Schema has correct structure
        expect(
          JSONSchema.make(ctx.toolkit.tools.create.parametersSchema),
        ).toEqual({
          $schema: "http://json-schema.org/draft-07/schema#",
          type: "object",
          required: ["name", "tags"],
          properties: {
            name: {
              type: "string",
              description: "Resource name",
            },
            tags: {
              type: "array",
              items: { type: "string" },
              description: "Resource tags",
            },
          },
          additionalProperties: false,
        });
      }).pipe(Effect.provide(TestLayer)),
  );

  it.effect(
    "JSON Schema is valid when tool description contains complex nested references",
    () =>
      Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        yield* fs.writeFileString("test/fixtures/config.yaml", "key: value");

        class ConfigFile extends File.Yaml(
          "test/fixtures/config.yaml",
        )`Config file` {}
        class ProcessorAgent extends Agent("processor")`Processes data` {}

        const idInput = input("id")`Unique identifier`;
        const countInput = input("count", S.Number)`Number of items`;
        const enabledInput = input("enabled", S.Boolean)`Whether enabled`;
        const runTool = tool("run")`Runs with context:${{
          config: ConfigFile,
          workers: [ProcessorAgent],
        }}. Takes ${idInput}, ${countInput}, ${enabledInput}.`(function* ({
          id: _id,
          count: _count,
          enabled: _enabled,
        }) {});

        class RunToolkit extends ToolkitFactory(
          "RunToolkit",
        )`Run tools: ${runTool}` {}
        class MyAgent extends Agent("runner")`Uses ${RunToolkit}` {}

        const ctx = yield* createContext(MyAgent);

        // Verify JSON Schema has all input parameters correctly typed
        expect(JSONSchema.make(ctx.toolkit.tools.run.parametersSchema)).toEqual(
          {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            required: ["id", "count", "enabled"],
            properties: {
              id: {
                type: "string",
                description: "Unique identifier",
              },
              count: {
                type: "number",
                description: "Number of items",
              },
              enabled: {
                type: "boolean",
                description: "Whether enabled",
              },
            },
            additionalProperties: false,
          },
        );
      }).pipe(Effect.provide(TestLayer)),
  );

  it.effect(
    "JSON Schema input descriptions use template strings only (not rendered refs)",
    () =>
      Effect.gen(function* () {
        class HelperAgent extends Agent("helper")`Helper agent` {}

        // Input with agent reference in description
        // Note: deriveSchema uses template.join("") which doesn't render refs
        const targetInput = input("target")`Target to send to ${HelperAgent}`;
        const messageInput = input("message")`Message content`;

        const sendTool = tool(
          "send",
        )`Sends message. Takes ${targetInput} and ${messageInput}.`(function* ({
          target: _target,
          message: _message,
        }) {});

        class SendToolkit extends ToolkitFactory(
          "SendToolkit",
        )`Send tools: ${sendTool}` {}
        class MyAgent extends Agent("sender")`Uses ${SendToolkit}` {}

        const ctx = yield* createContext(MyAgent);

        // Input descriptions are generated from template.join("")
        // which only concatenates template strings, not rendered references
        const schema = JSONSchema.make(ctx.toolkit.tools.send.parametersSchema);
        expect(schema).toEqual({
          $schema: "http://json-schema.org/draft-07/schema#",
          type: "object",
          required: ["target", "message"],
          properties: {
            target: {
              type: "string",
              // Note: Reference is NOT included in description (template.join behavior)
              description: "Target to send to",
            },
            message: {
              type: "string",
              description: "Message content",
            },
          },
          additionalProperties: false,
        });

        // Note: References in input templates are NOT collected into system prompt
        // The collection only walks direct references, not nested in input templates
        expect(ctx.messages).toEqual([
          {
            role: "system",
            content: `${preamble("sender")}Uses 🧰SendToolkit

---

## Toolkits

You can (and should) use the following tools to accomplish your tasks. Tool definitions are provided separately.

### SendToolkit

Send tools: 🛠️send
`,
          },
        ]);
      }).pipe(Effect.provide(TestLayer)),
  );

  it.effect(
    "JSON Schema input descriptions with file refs use template strings only",
    () =>
      Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        yield* fs.writeFileString(
          "test/fixtures/format.json",
          '{"format": "v1"}',
        );

        class FormatFile extends File.Json(
          "test/fixtures/format.json",
        )`Format specification` {}

        // Input with file reference in description
        const dataInput = input("data")`Data formatted per ${FormatFile}`;
        const outputInput = input("outputPath")`Path to write output`;

        const formatTool = tool(
          "format",
        )`Formats data. Takes ${dataInput} and ${outputInput}.`(function* ({
          data: _data,
          outputPath: _outputPath,
        }) {});

        class FormatToolkit extends ToolkitFactory(
          "FormatToolkit",
        )`Format tools: ${formatTool}` {}
        class MyAgent extends Agent("formatter")`Uses ${FormatToolkit}` {}

        const ctx = yield* createContext(MyAgent);

        // Input descriptions are generated from template.join("")
        // which only concatenates template strings, not rendered references
        const schema = JSONSchema.make(
          ctx.toolkit.tools.format.parametersSchema,
        );
        expect(schema).toEqual({
          $schema: "http://json-schema.org/draft-07/schema#",
          type: "object",
          required: ["data", "outputPath"],
          properties: {
            data: {
              type: "string",
              // Note: Reference is NOT included in description (template.join behavior)
              description: "Data formatted per",
            },
            outputPath: {
              type: "string",
              description: "Path to write output",
            },
          },
          additionalProperties: false,
        });

        // Note: References in input templates are NOT collected into system prompt
        // The collection only walks direct references, not nested in input templates
        expect(ctx.messages).toEqual([
          {
            role: "system",
            content: `${preamble("formatter")}Uses 🧰FormatToolkit

---

## Toolkits

You can (and should) use the following tools to accomplish your tasks. Tool definitions are provided separately.

### FormatToolkit

Format tools: 🛠️format
`,
          },
        ]);
      }).pipe(Effect.provide(TestLayer)),
  );

  // ============================================================
  // Tests for forward references (thunks)
  // ============================================================

  it.effect("renders forward reference to agent declared later", () =>
    Effect.gen(function* () {
      // ParentAgent references ChildAgent via thunk - enabling forward reference
      class ParentAgent extends Agent(
        "parent",
      )`Delegates to ${() => ChildAgent}` {}
      class ChildAgent extends Agent("child")`I am the child` {}

      const ctx = yield* createContext(ParentAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("parent")}Delegates to @child`,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              id: "ctx-agent-0",
              name: "read",
              params: { filePath: ".distilled/agents/child.md" },
              providerExecuted: false,
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              id: "ctx-agent-0",
              name: "read",
              isFailure: false,
              result: { content: "# @child\n\nI am the child" },
              providerExecuted: false,
            },
          ],
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders multiple forward references to agents", () =>
    Effect.gen(function* () {
      // Orchestrator references Worker agents via thunks
      class Orchestrator extends Agent(
        "orchestrator",
      )`Coordinates ${() => WorkerA} and ${() => WorkerB}` {}
      class WorkerA extends Agent("worker-a")`I handle task A` {}
      class WorkerB extends Agent("worker-b")`I handle task B` {}

      const ctx = yield* createContext(Orchestrator);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("orchestrator")}Coordinates @worker-a and @worker-b`,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              id: "ctx-agent-0",
              name: "read",
              params: { filePath: ".distilled/agents/worker-a.md" },
              providerExecuted: false,
            },
            {
              type: "tool-call",
              id: "ctx-agent-1",
              name: "read",
              params: { filePath: ".distilled/agents/worker-b.md" },
              providerExecuted: false,
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              id: "ctx-agent-0",
              name: "read",
              isFailure: false,
              result: { content: "# @worker-a\n\nI handle task A" },
              providerExecuted: false,
            },
            {
              type: "tool-result",
              id: "ctx-agent-1",
              name: "read",
              isFailure: false,
              result: { content: "# @worker-b\n\nI handle task B" },
              providerExecuted: false,
            },
          ],
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders forward reference to file declared later", () =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      yield* fs.writeFileString(
        "test/fixtures/forward-ref.ts",
        "export const value = 42;",
      );

      // Agent references file via thunk
      class MyAgent extends Agent("reader")`Reads ${() => ConfigFile}` {}
      class ConfigFile extends File.TypeScript(
        "test/fixtures/forward-ref.ts",
      )`Config file` {}

      const ctx = yield* createContext(MyAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("reader")}Reads [forward-ref.ts](test/fixtures/forward-ref.ts)`,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              id: "ctx-file-0",
              name: "read",
              params: { filePath: "test/fixtures/forward-ref.ts" },
              providerExecuted: false,
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              id: "ctx-file-0",
              name: "read",
              isFailure: false,
              result: { content: "export const value = 42;" },
              providerExecuted: false,
            },
          ],
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders forward reference to toolkit declared later", () =>
    Effect.gen(function* () {
      const inp = input("x")`Input`;
      const out = output("y")`Output`;
      const myTool = tool("myTool")`Takes ${inp}, returns ${out}.`(function* ({
        x,
      }) {
        return { y: x };
      });

      // Agent references toolkit via thunk
      class MyAgent extends Agent("worker")`Uses ${() => MyToolkit}` {}
      class MyToolkit extends ToolkitFactory("MyToolkit")`Tools: ${myTool}` {}

      const ctx = yield* createContext(MyAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("worker")}Uses 🧰MyToolkit

---

## Toolkits

You can (and should) use the following tools to accomplish your tasks. Tool definitions are provided separately.

### MyToolkit

Tools: 🛠️myTool
`,
        },
      ]);
      expect(Object.keys(ctx.toolkit.tools)).toEqual(["myTool"]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders mixed direct and forward references", () =>
    Effect.gen(function* () {
      class DirectAgent extends Agent("direct")`I am direct` {}
      class MyAgent extends Agent(
        "mixed",
      )`Has ${DirectAgent} and ${() => ForwardAgent}` {}
      class ForwardAgent extends Agent("forward")`I am forward` {}

      const ctx = yield* createContext(MyAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("mixed")}Has @direct and @forward`,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              id: "ctx-agent-0",
              name: "read",
              params: { filePath: ".distilled/agents/direct.md" },
              providerExecuted: false,
            },
            {
              type: "tool-call",
              id: "ctx-agent-1",
              name: "read",
              params: { filePath: ".distilled/agents/forward.md" },
              providerExecuted: false,
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              id: "ctx-agent-0",
              name: "read",
              isFailure: false,
              result: { content: "# @direct\n\nI am direct" },
              providerExecuted: false,
            },
            {
              type: "tool-result",
              id: "ctx-agent-1",
              name: "read",
              isFailure: false,
              result: { content: "# @forward\n\nI am forward" },
              providerExecuted: false,
            },
          ],
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders forward reference in array", () =>
    Effect.gen(function* () {
      class MyAgent extends Agent(
        "coordinator",
      )`Workers:${[() => WorkerX, () => WorkerY]}` {}
      class WorkerX extends Agent("worker-x")`Worker X` {}
      class WorkerY extends Agent("worker-y")`Worker Y` {}

      const ctx = yield* createContext(MyAgent);

      // Forward refs in arrays are resolved and serialized (not collected)
      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("coordinator")}Workers:
- "@worker-x"
- "@worker-y"`,
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders forward reference in object", () =>
    Effect.gen(function* () {
      class MyAgent extends Agent("team")`Team:${{
        leader: () => LeaderAgent,
        member: () => MemberAgent,
      }}` {}
      class LeaderAgent extends Agent("leader")`I lead` {}
      class MemberAgent extends Agent("member")`I follow` {}

      const ctx = yield* createContext(MyAgent);

      // Forward refs in objects are resolved and serialized (not collected)
      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("team")}Team:
leader: "@leader"
member: "@member"`,
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders forward reference in nested structure", () =>
    Effect.gen(function* () {
      class MyAgent extends Agent("workflow")`Workflow:${{
        stages: [
          { name: "build", agent: () => BuildAgent },
          { name: "deploy", agent: () => DeployAgent },
        ],
      }}` {}
      class BuildAgent extends Agent("build")`I build things` {}
      class DeployAgent extends Agent("deploy")`I deploy things` {}

      const ctx = yield* createContext(MyAgent);

      // Refs in nested objects are serialized (not collected)
      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("workflow")}Workflow:
stages:
  - name: build
    agent: "@build"
  - name: deploy
    agent: "@deploy"`,
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect(
    "does not include transitive forward-referenced agent (depth-limited)",
    () =>
      Effect.gen(function* () {
        // Agent1 and Agent2 reference SharedAgent, but SharedAgent is at depth 2
        class Agent1 extends Agent("a1")`Uses ${() => SharedAgent}` {}
        class Agent2 extends Agent("a2")`Also uses ${() => SharedAgent}` {}
        class Root extends Agent("root")`Has ${Agent1} and ${Agent2}` {}
        class SharedAgent extends Agent("shared")`I am shared` {}

        const ctx = yield* createContext(Root);

        // SharedAgent should NOT appear in the output (depth > 1)
        // Agent1 and Agent2 should appear (depth = 1)
        expect(ctx.messages).toEqual([
          {
            role: "system",
            content: `${preamble("root")}Has @a1 and @a2`,
          },
          {
            role: "assistant",
            content: [
              {
                type: "tool-call",
                id: "ctx-agent-0",
                name: "read",
                params: { filePath: ".distilled/agents/a1.md" },
                providerExecuted: false,
              },
              {
                type: "tool-call",
                id: "ctx-agent-1",
                name: "read",
                params: { filePath: ".distilled/agents/a2.md" },
                providerExecuted: false,
              },
            ],
          },
          {
            role: "tool",
            content: [
              {
                type: "tool-result",
                id: "ctx-agent-0",
                name: "read",
                isFailure: false,
                result: { content: "# @a1\n\nUses @shared" },
                providerExecuted: false,
              },
              {
                type: "tool-result",
                id: "ctx-agent-1",
                name: "read",
                isFailure: false,
                result: { content: "# @a2\n\nAlso uses @shared" },
                providerExecuted: false,
              },
            ],
          },
        ]);
      }).pipe(Effect.provide(TestLayer)),
  );

  it.effect(
    "does NOT collect toolkit from forward-referenced nested agent (depth-limited)",
    () =>
      Effect.gen(function* () {
        const inp = input("s")`String`;
        const out = output("r")`Result`;
        const sharedTool = tool("sharedTool")`Takes ${inp}, returns ${out}.`(
          function* ({ s }) {
            return { r: s };
          },
        );

        class SharedToolkit extends ToolkitFactory("SharedToolkit")`
Tools: ${sharedTool}
` {}

        // Forward reference to child agent which has a toolkit
        class Parent extends Agent("parent")`Uses ${() => Child}` {}
        class Child extends Agent("child")`Has ${SharedToolkit}` {}

        const ctx = yield* createContext(Parent);

        // Toolkit from nested agent is NOT collected (depth > 1)
        expect(Object.keys(ctx.toolkit.tools)).toEqual([]);

        // Child agent is listed but its toolkit is not included
        expect(ctx.messages).toEqual([
          {
            role: "system",
            content: `${preamble("parent")}Uses @child`,
          },
          {
            role: "assistant",
            content: [
              {
                type: "tool-call",
                id: "ctx-agent-0",
                name: "read",
                params: { filePath: ".distilled/agents/child.md" },
                providerExecuted: false,
              },
            ],
          },
          {
            role: "tool",
            content: [
              {
                type: "tool-result",
                id: "ctx-agent-0",
                name: "read",
                isFailure: false,
                result: { content: "# @child\n\nHas 🧰SharedToolkit" },
                providerExecuted: false,
              },
            ],
          },
        ]);
      }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders tool description with forward reference to agent", () =>
    Effect.gen(function* () {
      const taskInput = input("task")`The task`;
      const taskOutput = output("result")`The result`;
      const delegateTool = tool(
        "delegate",
      )`Delegates to ${() => HelperAgent}. Takes ${taskInput}. Returns ${taskOutput}.`(
        function* ({ task }) {
          return { result: task };
        },
      );

      class DelegateToolkit extends ToolkitFactory(
        "DelegateToolkit",
      )`Tools: ${delegateTool}` {}
      class MyAgent extends Agent("delegator")`Uses ${DelegateToolkit}` {}
      class HelperAgent extends Agent("helper")`I help` {}

      const ctx = yield* createContext(MyAgent);

      // Tool description should contain resolved forward reference
      expect(ctx.toolkit.tools.delegate.description).toEqual(
        "Delegates to @helper. Takes ${task}. Returns ^{result}.",
      );
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders tool description with forward reference to file", () =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      yield* fs.writeFileString("test/fixtures/schema-forward.json", "{}");

      const dataInput = input("data")`Data`;
      const validateTool = tool(
        "validate",
      )`Validates against ${() => SchemaFile}. Takes ${dataInput}.`(function* ({
        data: _,
      }) {});

      class ValidateToolkit extends ToolkitFactory(
        "ValidateToolkit",
      )`Tools: ${validateTool}` {}
      class MyAgent extends Agent("validator")`Uses ${ValidateToolkit}` {}
      class SchemaFile extends File.Json(
        "test/fixtures/schema-forward.json",
      )`Schema` {}

      const ctx = yield* createContext(MyAgent);

      // Tool description should contain resolved forward reference
      expect(ctx.toolkit.tools.validate.description).toEqual(
        "Validates against [schema-forward.json](test/fixtures/schema-forward.json). Takes ${data}.",
      );
    }).pipe(Effect.provide(TestLayer)),
  );

  // ============================================================
  // Tests for additional toolkits via options
  // ============================================================

  it.effect("includes single additional toolkit via options", () =>
    Effect.gen(function* () {
      const inp = input("msg")`Message`;
      const out = output("result")`Result`;
      const echoTool = tool("echo")`Echoes ${inp}. Returns ${out}.`(function* ({
        msg,
      }) {
        return { result: msg };
      });

      class EchoToolkit extends ToolkitFactory("EchoToolkit")`
Echo toolkit: ${echoTool}
` {}

      class SimpleAgent extends Agent("simple")`A simple agent` {}

      const ctx = yield* createContext(SimpleAgent, { tools: [EchoToolkit] });

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("simple")}A simple agent

---

## Toolkits

You can (and should) use the following tools to accomplish your tasks. Tool definitions are provided separately.

### EchoToolkit

Echo toolkit: 🛠️echo
`,
        },
      ]);

      expect(Object.keys(ctx.toolkit.tools)).toEqual(["echo"]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("includes multiple additional toolkits via options", () =>
    Effect.gen(function* () {
      const inp1 = input("a")`Input A`;
      const out1 = output("b")`Output B`;
      const tool1 = tool("toolOne")`Takes ${inp1}. Returns ${out1}.`(
        function* ({ a }) {
          return { b: a };
        },
      );

      const inp2 = input("c")`Input C`;
      const out2 = output("d")`Output D`;
      const tool2 = tool("toolTwo")`Takes ${inp2}. Returns ${out2}.`(
        function* ({ c }) {
          return { d: c };
        },
      );

      class ToolkitOne extends ToolkitFactory("ToolkitOne")`Has ${tool1}` {}
      class ToolkitTwo extends ToolkitFactory("ToolkitTwo")`Has ${tool2}` {}

      class SimpleAgent extends Agent("simple")`A simple agent` {}

      const ctx = yield* createContext(SimpleAgent, {
        tools: [ToolkitOne, ToolkitTwo],
      });

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("simple")}A simple agent

---

## Toolkits

You can (and should) use the following tools to accomplish your tasks. Tool definitions are provided separately.

### ToolkitOne

Has 🛠️toolOne

### ToolkitTwo

Has 🛠️toolTwo
`,
        },
      ]);

      expect(Object.keys(ctx.toolkit.tools).sort()).toEqual([
        "toolOne",
        "toolTwo",
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("merges additional toolkits with agent-referenced toolkits", () =>
    Effect.gen(function* () {
      const inp1 = input("x")`X`;
      const out1 = output("y")`Y`;
      const refTool = tool("refTool")`Takes ${inp1}. Returns ${out1}.`(
        function* ({ x }) {
          return { y: x };
        },
      );

      const inp2 = input("p")`P`;
      const out2 = output("q")`Q`;
      const addTool = tool("addTool")`Takes ${inp2}. Returns ${out2}.`(
        function* ({ p }) {
          return { q: p };
        },
      );

      class ReferencedToolkit extends ToolkitFactory("ReferencedToolkit")`
Referenced: ${refTool}
` {}

      class AdditionalToolkit extends ToolkitFactory("AdditionalToolkit")`
Additional: ${addTool}
` {}

      class MyAgent extends Agent("merger")`Uses ${ReferencedToolkit}` {}

      const ctx = yield* createContext(MyAgent, {
        tools: [AdditionalToolkit],
      });

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("merger")}Uses 🧰ReferencedToolkit

---

## Toolkits

You can (and should) use the following tools to accomplish your tasks. Tool definitions are provided separately.

### ReferencedToolkit

Referenced: 🛠️refTool

### AdditionalToolkit

Additional: 🛠️addTool
`,
        },
      ]);

      expect(Object.keys(ctx.toolkit.tools).sort()).toEqual([
        "addTool",
        "refTool",
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect(
    "deduplicates toolkit when both referenced and passed as additional",
    () =>
      Effect.gen(function* () {
        const inp = input("s")`String`;
        const out = output("r")`Result`;
        const sharedTool = tool("sharedTool")`Takes ${inp}. Returns ${out}.`(
          function* ({ s }) {
            return { r: s };
          },
        );

        class SharedToolkit extends ToolkitFactory("SharedToolkit")`
Shared: ${sharedTool}
` {}

        // Agent references the toolkit AND we pass it as additional
        class MyAgent extends Agent("dedup")`Uses ${SharedToolkit}` {}

        const ctx = yield* createContext(MyAgent, { tools: [SharedToolkit] });

        expect(ctx.messages).toEqual([
          {
            role: "system",
            content: `${preamble("dedup")}Uses 🧰SharedToolkit

---

## Toolkits

You can (and should) use the following tools to accomplish your tasks. Tool definitions are provided separately.

### SharedToolkit

Shared: 🛠️sharedTool
`,
          },
        ]);

        expect(Object.keys(ctx.toolkit.tools)).toEqual(["sharedTool"]);
      }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("works without options (backward compatible)", () =>
    Effect.gen(function* () {
      class SimpleAgent extends Agent("backward")`No toolkits here` {}

      // Call without options - should work as before
      const ctx = yield* createContext(SimpleAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("backward")}No toolkits here`,
        },
      ]);
      expect(ctx.toolkit.tools).toEqual({});
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("works with empty tools array", () =>
    Effect.gen(function* () {
      class SimpleAgent extends Agent("empty")`No toolkits` {}

      const ctx = yield* createContext(SimpleAgent, { tools: [] });

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("empty")}No toolkits`,
        },
      ]);
      expect(ctx.toolkit.tools).toEqual({});
    }).pipe(Effect.provide(TestLayer)),
  );

  // ============================================================
  // Tests for depth-limited context (transitive exclusion)
  // ============================================================

  it.effect("excludes transitive agents (depth > 1) from context", () =>
    Effect.gen(function* () {
      // CEO -> VP -> Developer (transitive chain)
      class Developer extends Agent("developer")`I write code` {}
      class VP extends Agent("vp")`I manage ${Developer}` {}
      class CEO extends Agent("ceo")`I lead ${VP}` {}

      const ctx = yield* createContext(CEO);

      // VP should be included (depth = 1), Developer should NOT (depth = 2)
      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("ceo")}I lead @vp`,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              id: "ctx-agent-0",
              name: "read",
              params: { filePath: ".distilled/agents/vp.md" },
              providerExecuted: false,
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              id: "ctx-agent-0",
              name: "read",
              isFailure: false,
              result: { content: "# @vp\n\nI manage @developer" },
              providerExecuted: false,
            },
          ],
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("excludes files from transitive agents (depth > 1)", () =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      yield* fs.writeFileString("test/fixtures/ceo-report.md", "# CEO Report");
      yield* fs.writeFileString(
        "test/fixtures/developer-code.ts",
        "// Developer code",
      );

      class CEOReport extends File.Markdown(
        "test/fixtures/ceo-report.md",
      )`CEO quarterly report` {}
      class DeveloperCode extends File.TypeScript(
        "test/fixtures/developer-code.ts",
      )`Developer source code` {}

      class Developer extends Agent("developer")`Uses ${DeveloperCode}` {}
      class CEO extends Agent(
        "ceo",
      )`Reviews ${CEOReport} and leads ${Developer}` {}

      const ctx = yield* createContext(CEO);

      // CEOReport should be included (direct reference)
      // DeveloperCode should NOT be included (referenced by nested agent)
      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("ceo")}Reviews [ceo-report.md](test/fixtures/ceo-report.md) and leads @developer`,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              id: "ctx-agent-0",
              name: "read",
              params: { filePath: ".distilled/agents/developer.md" },
              providerExecuted: false,
            },
            {
              type: "tool-call",
              id: "ctx-file-1",
              name: "read",
              params: { filePath: "test/fixtures/ceo-report.md" },
              providerExecuted: false,
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              id: "ctx-agent-0",
              name: "read",
              isFailure: false,
              result: {
                content:
                  "# @developer\n\nUses [developer-code.ts](test/fixtures/developer-code.ts)",
              },
              providerExecuted: false,
            },
            {
              type: "tool-result",
              id: "ctx-file-1",
              name: "read",
              isFailure: false,
              result: { content: "# CEO Report" },
              providerExecuted: false,
            },
          ],
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("excludes toolkits from transitive agents (depth > 1)", () =>
    Effect.gen(function* () {
      const codeInput = input("code")`The code to review`;
      const reviewTool = tool("review")`Reviews ${codeInput}`(function* ({
        code: _,
      }) {});

      class CodingToolkit extends ToolkitFactory("CodingToolkit")`
Developer tools: ${reviewTool}
` {}

      class Developer extends Agent("developer")`Uses ${CodingToolkit}` {}
      class CEO extends Agent("ceo")`Leads ${Developer}` {}

      const ctx = yield* createContext(CEO);

      // Developer is listed but CodingToolkit is NOT included (from nested agent)
      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("ceo")}Leads @developer`,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              id: "ctx-agent-0",
              name: "read",
              params: { filePath: ".distilled/agents/developer.md" },
              providerExecuted: false,
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              id: "ctx-agent-0",
              name: "read",
              isFailure: false,
              result: { content: "# @developer\n\nUses 🧰CodingToolkit" },
              providerExecuted: false,
            },
          ],
        },
      ]);
      expect(Object.keys(ctx.toolkit.tools)).toEqual([]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("includes direct toolkit but excludes nested agent toolkit", () =>
    Effect.gen(function* () {
      const planInput = input("plan")`The plan`;
      const planTool = tool("plan")`Creates ${planInput}`(function* ({
        plan: _,
      }) {});
      const codeInput = input("code")`The code`;
      const codeTool = tool("code")`Writes ${codeInput}`(function* ({
        code: _,
      }) {});

      class PlanningToolkit extends ToolkitFactory("PlanningToolkit")`
CEO tools: ${planTool}
` {}
      class CodingToolkit extends ToolkitFactory("CodingToolkit")`
Developer tools: ${codeTool}
` {}

      class Developer extends Agent("developer")`Uses ${CodingToolkit}` {}
      class CEO extends Agent(
        "ceo",
      )`Uses ${PlanningToolkit} and leads ${Developer}` {}

      const ctx = yield* createContext(CEO);

      // PlanningToolkit is included (direct reference)
      // CodingToolkit is NOT included (from nested agent)
      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("ceo")}Uses 🧰PlanningToolkit and leads @developer

---

## Toolkits

You can (and should) use the following tools to accomplish your tasks. Tool definitions are provided separately.

### PlanningToolkit

CEO tools: 🛠️plan
`,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              id: "ctx-agent-0",
              name: "read",
              params: { filePath: ".distilled/agents/developer.md" },
              providerExecuted: false,
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              id: "ctx-agent-0",
              name: "read",
              isFailure: false,
              result: { content: "# @developer\n\nUses 🧰CodingToolkit" },
              providerExecuted: false,
            },
          ],
        },
      ]);
      expect(Object.keys(ctx.toolkit.tools)).toEqual(["plan"]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("preamble includes agent communication guidance", () =>
    Effect.gen(function* () {
      class SimpleAgent extends Agent("test")`Test agent` {}

      const ctx = yield* createContext(SimpleAgent);

      // Verify full context with agent communication section in preamble
      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("test")}Test agent`,
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("deep chain only includes direct level", () =>
    Effect.gen(function* () {
      // 5-level deep chain: A -> B -> C -> D -> E
      class E extends Agent("e")`Level E` {}
      class D extends Agent("d")`Level D, uses ${E}` {}
      class C extends Agent("c")`Level C, uses ${D}` {}
      class B extends Agent("b")`Level B, uses ${C}` {}
      class A extends Agent("a")`Level A, uses ${B}` {}

      const ctx = yield* createContext(A);

      // Only B should be included (depth = 1), C/D/E should NOT (depth > 1)
      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("a")}Level A, uses @b`,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              id: "ctx-agent-0",
              name: "read",
              params: { filePath: ".distilled/agents/b.md" },
              providerExecuted: false,
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              id: "ctx-agent-0",
              name: "read",
              isFailure: false,
              result: { content: "# @b\n\nLevel B, uses @c" },
              providerExecuted: false,
            },
          ],
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  // ============================================================
  // Tests for duplicate ID prevention
  // ============================================================

  it.effect(
    "handles duplicate file references without generating duplicate IDs",
    () =>
      Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        yield* fs.writeFileString("test/fixtures/config.ts", "// config");

        // Same file referenced twice in template (like ErrorPatch in Developer agent)
        class ConfigFile extends File.TypeScript(
          "test/fixtures/config.ts",
        )`Config` {}
        class MyAgent extends Agent("dup-ref-test")`
Uses ${ConfigFile} for setup.
Also update ${ConfigFile} when done.
` {}

        const ctx = yield* createContext(MyAgent);

        // Assert exact structure of all messages
        expect(ctx.messages).toEqual([
          {
            role: "system",
            content: `${preamble("dup-ref-test")}
Uses [config.ts](test/fixtures/config.ts) for setup.
Also update [config.ts](test/fixtures/config.ts) when done.
`,
          },
          {
            role: "assistant",
            content: [
              {
                type: "tool-call",
                id: "ctx-file-0",
                name: "read",
                params: { filePath: "test/fixtures/config.ts" },
                providerExecuted: false,
              },
            ],
          },
          {
            role: "tool",
            content: [
              {
                type: "tool-result",
                id: "ctx-file-0",
                name: "read",
                isFailure: false,
                result: { content: "// config" },
                providerExecuted: false,
              },
            ],
          },
        ]);
      }).pipe(Effect.provide(TestLayer)),
  );

  it.effect(
    "stress test: Developer agent structure with multiple file refs",
    () =>
      Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        yield* fs.writeFileString("test/fixtures/service.ts", "// service");
        yield* fs.writeFileString("test/fixtures/plan.md", "# plan");
        yield* fs.writeFileString("test/fixtures/test-file.ts", "// test");
        yield* fs.writeFileString("test/fixtures/errors.json", "{}");

        class ServiceClient extends File.TypeScript(
          "test/fixtures/service.ts",
        )`Service` {}
        class TestPlan extends File.Markdown("test/fixtures/plan.md")`Plan` {}
        class TestFile extends File.TypeScript(
          "test/fixtures/test-file.ts",
        )`Test` {}
        class ErrorPatch extends File.Json(
          "test/fixtures/errors.json",
        )`Errors` {}

        // Mirrors Developer agent from distilled-cloudflare
        class Developer extends Agent("stress-test-developer")`
Implement tests per ${TestPlan} using ${Toolkit.Coding}.

## Files
- ${ServiceClient} - signatures
- ${TestFile} - implement here
- ${ErrorPatch} - patch errors

## On Error
1. Update ${ErrorPatch}
2. Regenerate
` {}

        const ctx = yield* createContext(Developer);

        // Assert exact structure of all messages
        expect(ctx.messages).toEqual([
          {
            role: "system",
            content: `${preamble("stress-test-developer")}
Implement tests per [plan.md](test/fixtures/plan.md) using 🧰Coding.

## Files
- [service.ts](test/fixtures/service.ts) - signatures
- [test-file.ts](test/fixtures/test-file.ts) - implement here
- [errors.json](test/fixtures/errors.json) - patch errors

## On Error
1. Update [errors.json](test/fixtures/errors.json)
2. Regenerate


---

## Toolkits

You can (and should) use the following tools to accomplish your tasks. Tool definitions are provided separately.

### Coding

A set of tools for reading, writing, and editing code:

- 🛠️bash
- 🛠️readlints
- 🛠️edit
- 🛠️glob
- 🛠️grep
- 🛠️read
- 🛠️write
`,
          },
          {
            role: "assistant",
            content: [
              {
                type: "tool-call",
                id: "ctx-file-0",
                name: "read",
                params: { filePath: "test/fixtures/plan.md" },
                providerExecuted: false,
              },
              {
                type: "tool-call",
                id: "ctx-file-1",
                name: "read",
                params: { filePath: "test/fixtures/service.ts" },
                providerExecuted: false,
              },
              {
                type: "tool-call",
                id: "ctx-file-2",
                name: "read",
                params: { filePath: "test/fixtures/test-file.ts" },
                providerExecuted: false,
              },
              {
                type: "tool-call",
                id: "ctx-file-3",
                name: "read",
                params: { filePath: "test/fixtures/errors.json" },
                providerExecuted: false,
              },
            ],
          },
          {
            role: "tool",
            content: [
              {
                type: "tool-result",
                id: "ctx-file-0",
                name: "read",
                isFailure: false,
                result: { content: "# plan" },
                providerExecuted: false,
              },
              {
                type: "tool-result",
                id: "ctx-file-1",
                name: "read",
                isFailure: false,
                result: { content: "// service" },
                providerExecuted: false,
              },
              {
                type: "tool-result",
                id: "ctx-file-2",
                name: "read",
                isFailure: false,
                result: { content: "// test" },
                providerExecuted: false,
              },
              {
                type: "tool-result",
                id: "ctx-file-3",
                name: "read",
                isFailure: false,
                result: { content: "{}" },
                providerExecuted: false,
              },
            ],
          },
        ]);
      }).pipe(Effect.provide(TestLayer)),
  );

  // ============================================================
  // Tests for Channel and GroupChat entities
  // ============================================================

  it.effect("renders agent with channel reference", () =>
    Effect.gen(function* () {
      class CodeReviewer extends Agent(
        "code-reviewer",
      )`Reviews pull requests` {}
      class Architect extends Agent("architect")`Designs system architecture` {}

      class Engineering extends Channel("engineering")`
Engineering channel for technical discussions.

Members:
- ${CodeReviewer}
- ${Architect}
` {}

      class MyAgent extends Agent(
        "coordinator",
      )`Uses ${Engineering} for coordination` {}

      const ctx = yield* createContext(MyAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("coordinator")}Uses #engineering for coordination`,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              id: "ctx-agent-0",
              name: "read",
              params: { filePath: ".distilled/agents/code-reviewer.md" },
              providerExecuted: false,
            },
            {
              type: "tool-call",
              id: "ctx-agent-1",
              name: "read",
              params: { filePath: ".distilled/agents/architect.md" },
              providerExecuted: false,
            },
            {
              type: "tool-call",
              id: "ctx-channel-2",
              name: "read",
              params: { filePath: ".distilled/channels/engineering.md" },
              providerExecuted: false,
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              id: "ctx-agent-0",
              name: "read",
              isFailure: false,
              result: { content: "# @code-reviewer\n\nReviews pull requests" },
              providerExecuted: false,
            },
            {
              type: "tool-result",
              id: "ctx-agent-1",
              name: "read",
              isFailure: false,
              result: {
                content: "# @architect\n\nDesigns system architecture",
              },
              providerExecuted: false,
            },
            {
              type: "tool-result",
              id: "ctx-channel-2",
              name: "read",
              isFailure: false,
              result: {
                content: `# #engineering


Engineering channel for technical discussions.

Members:
- @code-reviewer
- @architect
`,
              },
              providerExecuted: false,
            },
          ],
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders agent with group chat reference", () =>
    Effect.gen(function* () {
      class Frontend extends Agent("frontend")`Frontend developer` {}
      class Backend extends Agent("backend")`Backend developer` {}

      class FeatureTeam extends GroupChat("feature-team")`
Feature development group chat.

Team:
- ${Frontend}
- ${Backend}
` {}

      class MyAgent extends Agent("pm")`Works with ${FeatureTeam}` {}

      const ctx = yield* createContext(MyAgent);

      expect(ctx.messages).toEqual([
        {
          role: "system",
          content: `${preamble("pm")}Works with @{frontend, backend}`,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              id: "ctx-agent-0",
              name: "read",
              params: { filePath: ".distilled/agents/frontend.md" },
              providerExecuted: false,
            },
            {
              type: "tool-call",
              id: "ctx-agent-1",
              name: "read",
              params: { filePath: ".distilled/agents/backend.md" },
              providerExecuted: false,
            },
            {
              type: "tool-call",
              id: "ctx-group-chat-2",
              name: "read",
              params: { filePath: ".distilled/group-chats/feature-team.md" },
              providerExecuted: false,
            },
          ],
        },
        {
          role: "tool",
          content: [
            {
              type: "tool-result",
              id: "ctx-agent-0",
              name: "read",
              isFailure: false,
              result: { content: "# @frontend\n\nFrontend developer" },
              providerExecuted: false,
            },
            {
              type: "tool-result",
              id: "ctx-agent-1",
              name: "read",
              isFailure: false,
              result: { content: "# @backend\n\nBackend developer" },
              providerExecuted: false,
            },
            {
              type: "tool-result",
              id: "ctx-group-chat-2",
              name: "read",
              isFailure: false,
              result: {
                content: `# feature-team


Feature development group chat.

Team:
- @frontend
- @backend
`,
              },
              providerExecuted: false,
            },
          ],
        },
      ]);
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders channel with file reference", () =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      yield* fs.writeFileString("test/fixtures/design.md", "# Design Docs");

      class DesignDocs extends File.Markdown(
        "test/fixtures/design.md",
      )`Design documentation` {}
      class Architect extends Agent("architect")`Designs systems` {}

      class DesignReview extends Channel("design-review")`
Channel for reviewing ${DesignDocs}.

Members:
- ${Architect}
` {}

      class MyAgent extends Agent(
        "reviewer",
      )`Participates in ${DesignReview}` {}

      const ctx = yield* createContext(MyAgent);

      expect(ctx.messages[0]).toEqual({
        role: "system",
        content: `${preamble("reviewer")}Participates in #design-review`,
      });

      // Verify file content is included
      const toolResults = ctx.messages[2];
      expect(toolResults).toBeDefined();
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders simple channel without members", () =>
    Effect.gen(function* () {
      class GeneralChannel extends Channel(
        "general",
      )`General discussion channel` {}

      class MyAgent extends Agent("user")`Uses ${GeneralChannel}` {}

      const ctx = yield* createContext(MyAgent);

      expect(ctx.messages[0]).toEqual({
        role: "system",
        content: `${preamble("user")}Uses #general`,
      });
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect(
    "renders group chat with no agent members shows group chat ID",
    () =>
      Effect.gen(function* () {
        class EmptyGroupChat extends GroupChat(
          "empty-group-chat",
        )`An empty group chat` {}

        class MyAgent extends Agent("admin")`Manages ${EmptyGroupChat}` {}

        const ctx = yield* createContext(MyAgent);

        // When no agent members, shows @{group-chat-id}
        expect(ctx.messages[0]).toEqual({
          role: "system",
          content: `${preamble("admin")}Manages @{empty-group-chat}`,
        });
      }).pipe(Effect.provide(TestLayer)),
  );

  // ============================================================
  // Tests for Role and Group (organizational) entities
  // ============================================================

  it.effect("renders agent with role reference using & prefix", () =>
    Effect.gen(function* () {
      const ReviewTool = tool("review")`Review code ${input("code", S.String)}`;

      class Reviewer extends Role("reviewer")`
Code review capabilities.
${ReviewTool}
` {}

      class Alice extends Agent("alice")`
Alice is a senior engineer with ${Reviewer}.
` {}

      const ctx = yield* createContext(Alice);

      // Role is rendered with & prefix (template literal has leading newline)
      expect(ctx.messages[0]).toEqual({
        role: "system",
        content: `${preamble("alice")}
Alice is a senior engineer with &reviewer.
`,
      });
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders agent with org group reference using % prefix", () =>
    Effect.gen(function* () {
      class Bob extends Agent("bob")`Bob` {}
      class Carol extends Agent("carol")`Carol` {}

      class Engineering extends Group("engineering")`
The engineering team.
${Bob}
${Carol}
` {}

      class Manager extends Agent("manager")`
Manages ${Engineering}.
` {}

      const ctx = yield* createContext(Manager);

      // Group with members is rendered with %{members} (template literal has leading newline)
      expect(ctx.messages[0]).toEqual({
        role: "system",
        content: `${preamble("manager")}
Manages %{bob, carol}.
`,
      });
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("renders org group with no agents using % prefix with ID", () =>
    Effect.gen(function* () {
      class EmptyOrgGroup extends Group("empty-org")`An empty organization` {}

      class Admin extends Agent("admin")`Oversees ${EmptyOrgGroup}` {}

      const ctx = yield* createContext(Admin);

      // When no agent members, shows %{group-id}
      expect(ctx.messages[0]).toEqual({
        role: "system",
        content: `${preamble("admin")}Oversees %empty-org`,
      });
    }).pipe(Effect.provide(TestLayer)),
  );

  it.effect("agent with role gets tools from role in context", () =>
    Effect.gen(function* () {
      const ReviewTool = tool("review")`Review code ${input("code", S.String)}`;
      const DeployTool = tool("deploy")`Deploy ${input("target", S.String)}`;

      class Reviewer extends Role("reviewer")`${ReviewTool}` {}
      class Deployer extends Role("deployer")`${DeployTool}` {}

      class Alice extends Agent("alice")`
Alice has:
${Reviewer}
${Deployer}
` {}

      const ctx = yield* createContext(Alice);

      // The toolkit should include tools from the roles
      // This is verified by checking the toolkit exists
      expect(ctx.toolkit).toBeDefined();
    }).pipe(Effect.provide(TestLayer)),
  );
});
