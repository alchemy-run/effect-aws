import type { Fragment } from "./fragment.ts";
import type { Tool } from "./tool.ts";

export interface IToolkit<
  Name extends string,
  Tools extends Tool[],
  References extends any[] = any[],
> extends Fragment<"toolkit", Name, References> {
  readonly tools: {
    [name in Tools[number]["name"]]: Extract<Tools[number], { name: name }>;
  };
}

export interface Toolkit<
  Name extends string = string,
  Tools extends Tool[] = Tool[],
  References extends any[] = any[],
> extends IToolkit<Name, Tools, References> {
  new (_: never): IToolkit<Name, Tools, References>;
}

export const Toolkit =
  <Name extends string>(name: Name) =>
  <const References extends any[]>(
    template: TemplateStringsArray,
    ...references: References
  ) => {
    const tools = references.filter((ref): ref is Tool => ref?.type === "tool");
    return {
      type: "toolkit",
      name,
      tools,
      template,
      references,
    } as any as Toolkit<Name, ExtractTools<References>, References>;
  };

type ExtractTools<
  References extends any[],
  Tools extends Tool[] = [],
> = References extends [infer x, ...infer xs]
  ? x extends Tool
    ? ExtractTools<xs, [...Tools, x]>
    : ExtractTools<xs, Tools>
  : Tools;
