import * as S from "effect/Schema";
import type { Fragment } from "./fragment.ts";

export const isInput = (artifact: any): artifact is Input<any, any, any[]> => {
  return artifact?.type === "input";
};

export interface IInput<
  Name extends string,
  Schema extends S.Struct.Field,
  References extends any[],
> extends Fragment<"input", Name, References> {
  readonly schema: Schema;
  readonly description?: string;
}

export interface Input<
  Name extends string,
  Schema extends S.Struct.Field,
  References extends any[],
> extends IInput<Name, Schema, References> {
  new (_: never): IInput<Name, Schema, References>;
  <References extends any[]>(
    template: TemplateStringsArray,
    ...references: References
  ): Input<Name, Schema, References>;
}

export declare namespace Input {
  export type Of<
    References extends any[],
    Fields extends S.Struct.Fields = {},
  > = References extends []
    ? S.Struct<Fields>["Type"]
    : References extends [infer Artifact, ...infer Rest]
      ? Artifact extends IInput<infer Name extends string, infer Field, any>
        ? Input.Of<Rest, Fields & { [name in Name]: Field }>
        : Input.Of<Rest, Fields>
      : [];
}

export const input = <
  const Name extends string,
  Schema extends S.Struct.Field = S.Schema<string>,
>(
  name: Name,
  schema: Schema = S.String as any as Schema,
  options: {
    description?: string;
  } = {},
): Input<Name, Schema, []> => {
  const props = (
    template: TemplateStringsArray | undefined,
    references: any[],
  ) => ({
    type: "input",
    name,
    schema,
    description: options?.description,
    template,
    references,
  });
  const input = (template: TemplateStringsArray, ...references: any[]) =>
    Object.assign(input, props(template, references));
  return Object.assign(input, props(undefined, [])) as any as Input<
    Name,
    Schema,
    []
  >;
};
