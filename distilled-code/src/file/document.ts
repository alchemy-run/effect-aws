import type { Fragment } from "../fragment.ts";
import type { Tool } from "../tool.ts";

export interface IDocument<
  Name extends string,
  References extends any[],
> extends Fragment<"document", Name, References> {}

export type Document<Name extends string, References extends any[]> = Fragment<
  "document",
  Name,
  References
> & {
  new (_: never): IDocument<Name, References>;
};

export const Document =
  <Name extends string, Tools extends Record<string, Tool<any, any, any>> = {}>(
    name: Name,
    tools?: Tools,
  ) =>
  <References extends any[]>(
    template: TemplateStringsArray,
    ...references: References
  ) =>
    class {
      static readonly type = "document";
      static readonly name = name;
      static readonly references = references;
      static readonly template = template;
      constructor(_: never) {}
    } as Document<Name, References>;
