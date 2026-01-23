import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import type { YieldWrap } from "effect/Utils";
import type { Fragment } from "./fragment.ts";
import { isInput, type Input } from "./input.ts";
import { isOutput, type Output } from "./output.ts";

export interface ITool<
  Name extends string,
  Input,
  Output,
  Err = never,
  Req = never,
  References extends any[] = any[],
> extends Fragment<"tool", Name, References> {
  readonly input: S.Schema<Input>;
  readonly output: S.Schema<Output>;
  readonly alias: ((model: string) => string | undefined) | undefined;
  readonly handler: (
    ...args: void extends Input ? [] : [Input]
  ) => Effect.Effect<Output, Err, Req>;
}
export interface Tool<
  Name extends string = string,
  Input = any,
  Output = any,
  Err = any,
  Req = any,
  References extends any[] = any[],
> extends ITool<Name, Input, Output, Err, Req, References> {
  new (_: never): ITool<Name, Input, Output, Err, Req, References>;
}

export const tool =
  <Name extends string>(
    name: Name,
    options?: {
      alias?: (model: string) => string | undefined;
    },
  ) =>
  <const References extends any[]>(
    template: TemplateStringsArray,
    ...references: References
  ) =>
  <Eff extends YieldWrap<Effect.Effect<any, any, any>>>(
    handler: (
      input: Input.Of<References>,
    ) => Generator<Eff, NoInfer<Output.Of<References>>, never>,
  ) =>
    ({
      type: "tool",
      name,
      alias: options?.alias,
      input: deriveSchema(references, isInput),
      output: deriveSchema(references, isOutput) ?? S.Any,
      references,
      template,
      handler: Effect.fn(handler),
    }) as any as Tool<
      Name,
      {
        [prop in keyof Input.Of<References>]: Input.Of<References>[prop];
      },
      Output.Of<References>,
      [Eff] extends [never]
        ? never
        : [Eff] extends [YieldWrap<Effect.Effect<infer _A, infer E, infer _R>>]
          ? E
          : never,
      [Eff] extends [never]
        ? never
        : [Eff] extends [YieldWrap<Effect.Effect<infer _A, infer _E, infer R>>]
          ? R
          : never,
      References
    >;

const deriveSchema = (
  references: any[],
  predicate: (artifact: any) => boolean,
) => {
  const matches = references.filter(predicate);
  if (matches.length === 0) {
    return undefined;
  }
  return S.Struct(
    Object.fromEntries(
      references
        .filter(predicate)
        .map((artifact) => [artifact.name, artifact.schema]),
    ),
  );
};
