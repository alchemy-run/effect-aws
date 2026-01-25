import type { AiError } from "@effect/ai/AiError";
import * as Chat from "@effect/ai/Chat";
import type {
  GenerateObjectResponse,
  LanguageModel,
} from "@effect/ai/LanguageModel";
import type { Handler } from "@effect/ai/Tool";
import type { FileSystem } from "@effect/platform/FileSystem";
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import { createContext } from "./context.ts";
import type { Fragment } from "./fragment.ts";
import { input } from "./input.ts";
import { output } from "./output.ts";
import { AgentState, AgentStateError, type MessageEncoded } from "./state.ts";
import { tool } from "./tool/tool.ts";
import { Toolkit } from "./toolkit/toolkit.ts";

type _ = MessageEncoded;

export const isAgent = (x: any): x is Agent => x?.type === "agent";

export interface IAgent<
  Name extends string,
  References extends any[],
> extends Fragment<"agent", Name, References> {}

export type Agent<
  Name extends string = string,
  References extends any[] = any[],
> = IAgent<Name, References> & {
  new (_: never): IAgent<Name, References>;
};

export const Agent =
  <ID extends string>(id: ID) =>
  <References extends any[]>(
    template: TemplateStringsArray,
    ...references: References
  ) =>
    class {
      static readonly type = "agent";
      static readonly id = id;
      static readonly references = references;
      static readonly template = template;
      constructor(_: never) {}
    } as Agent<ID, References>;

export interface AgentInstance<A extends Agent<string, any[]>> {
  agent: A;
  send: (
    prompt: string,
  ) => Effect.Effect<
    void,
    AiError | AgentStateError,
    LanguageModel | Handler<string> | AgentState
  >;
  query: <A>(
    prompt: string,
    schema: S.Schema<A, any>,
  ) => Effect.Effect<
    GenerateObjectResponse<{}, A>,
    AiError | AgentStateError,
    LanguageModel | Handler<string> | AgentState
  >;
}

export const spawn: <A extends Agent<string, any[]>>(
  agent: A,
) => Effect.Effect<
  AgentInstance<A>,
  AiError | AgentStateError,
  LanguageModel | Handler<string> | AgentState | FileSystem
> = Effect.fn(function* <A extends Agent<string, any[]>>(agent: A) {
  const state = yield* AgentState;

  const agentState = yield* state.get(agent.id);

  const chat = yield* Chat.fromPrompt(agentState.messages);

  // TODO(sam): support interrupts/parallel threads
  const sem = yield* Effect.makeSemaphore(1);
  const locked = <A, E, R>(fn: Effect.Effect<A, E, R>) =>
    sem.withPermits(1)(fn);

  const children = yield* Effect.all(
    agent.references.filter(isAgent).map(spawn),
  );

  const message = input("message")`The message to send`;
  const recipient = input(
    "recipient",
    S.Literal(...children.map((a) => a.agent.id)),
  )`The recipient agent, can be one of:${children}`;
  const send = tool(
    "send",
  )`Send a ${message} to ${recipient}, receive a response as a ${S.String}`(
    function* ({ message, recipient }) {
      return "TODO(sam): implement send";
    },
  );

  const schema = input("schema")`The expected schema of the query response`;
  const object = output("object", S.Any);
  const query = tool(
    "query",
  )`Send a query ${message} to the ${recipient} agent and receive back a structured ${object} with the expected schema ${schema}`(
    function* ({ recipient, schema, message }) {
      return {
        object: "TODO(sam): implement query",
      };
    },
  );

  class Comms extends Toolkit(
    "Comms",
  )`Tools for communicating with other agents. Use these tools to coordinate work with other agents.
${[query, schema]}` {}

  const context = yield* createContext(agent, {
    tools: [Comms],
  });

  return {
    agent,
    send: (prompt: string) =>
      locked(
        Stream.runForEach(
          chat.streamText({
            toolkit: context.toolkit,
            prompt: [
              ...context.messages,
              {
                role: "user" as const,
                content: prompt,
              },
            ],
          }),
          (part) =>
            Effect.sync(() => {
              switch (part.type) {
                case "text-delta":
                  process.stdout.write(part.delta);
                  break;
              }
            }),
        ),
      ),
    query: <A>(prompt: string, schema: S.Schema<A, any>) =>
      locked(
        chat.generateObject({
          toolkit: context.toolkit,
          schema,
          prompt: [
            ...context.messages,
            {
              role: "user" as const,
              content: prompt,
            },
          ],
        }),
      ),
  } satisfies AgentInstance<A>;
});
