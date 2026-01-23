import type { Fragment } from "../fragment.ts";
import type { Tool } from "../tool.ts";

export interface ITypeScript<
  Name extends string,
  References extends any[],
> extends Fragment<"typescript", Name, References> {}

export type TypeScript<
  Name extends string,
  References extends any[],
> = Fragment<"typescript", Name, References> & {
  new (_: never): ITypeScript<Name, References>;
};

export const TypeScript =
  <Name extends string, Tools extends Record<string, Tool<any, any, any>> = {}>(
    name: Name,
    tools?: Tools,
  ) =>
  <References extends any[]>(
    template: TemplateStringsArray,
    ...references: References
  ) =>
    class {
      static readonly type = "typescript";
      static readonly name = name;
      static readonly references = references;
      static readonly template = template;
      constructor(_: never) {}
    } as TypeScript<Name, References>;
