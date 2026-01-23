import type { Fragment } from "./fragment.ts";

export interface IAgent<
  Name extends string,
  References extends any[],
> extends Fragment<"agent", Name, References> {}

export type Agent<Name extends string, References extends any[]> = IAgent<
  Name,
  References
> & {
  new (_: never): IAgent<Name, References>;
};

export const Agent =
  <Name extends string>(name: Name) =>
  <References extends any[]>(
    template: TemplateStringsArray,
    ...references: References
  ) =>
    class {
      static readonly type = "agent";
      static readonly name = name;
      static readonly references = references;
      static readonly template = template;
      constructor(_: never) {}
    } as Agent<Name, References>;
