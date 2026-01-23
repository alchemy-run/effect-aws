import * as S from "effect/Schema";
import type { Fragment } from "./fragment.ts";
import type { IsNever } from "./util.ts";

export const isOutput = (
  artifact: any,
): artifact is Output<any, any, any[]> => {
  return artifact?.type === "output";
};
export interface IOutput<
  Name extends string,
  Schema extends S.Schema<any>,
  References extends any[],
> extends Fragment<"output", Name, References> {
  readonly schema: Schema;
}

export interface Output<
  Name extends string,
  Schema extends S.Schema<any>,
  References extends any[],
> extends IOutput<Name, Schema, References> {
  new (_: never): IOutput<Name, Schema, References>;
  <References extends any[]>(
    template: TemplateStringsArray,
    ...references: References
  ): Output<Name, Schema, References>;
}

export declare namespace Output {
  export type Of<
    References extends any[],
    Outputs = never,
    Primitives = never,
  > = References extends []
    ? Outputs | Primitives
    : References extends [infer Ref, ...infer Rest]
      ? Ref extends IOutput<
          infer Name extends string,
          infer Schema,
          // TODO(sam): do anything with this?
          infer _References
        >
        ? Output.Of<
            Rest,
            (IsNever<Outputs> extends true ? {} : Outputs) & {
              [name in Name]: Schema["Type"];
            },
            Primitives
          >
        : Ref extends S.Schema<infer T>
          ? Output.Of<Rest, Outputs, Primitives | T>
          : Output.Of<Rest, Outputs, Primitives>
      : [];
}

export const output = <
  Name extends string,
  Schema extends S.Schema<any> = S.Schema<string>,
>(
  name: Name,
  schema: Schema = S.String as any as Schema,
): Output<Name, Schema, []> => {
  return Object.assign(function () {}, {
    type: "output",
    name,
    schema,
  }) as any as Output<Name, Schema, []>;
};
