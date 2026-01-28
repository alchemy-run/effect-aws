export interface Fragment<
  Type extends string,
  Name extends string,
  References extends any[],
> {
  readonly type: Type;
  /**
   * The identifier for this fragment.
   * Uses `id` instead of `name` to avoid conflicts with JavaScript's
   * built-in `name` property on classes/functions.
   */
  readonly id: Name;
  readonly template: TemplateStringsArray;
  readonly references: References;
}

/**
 * The class type returned by fragment builders.
 * Structurally compatible with user-defined interfaces that extend Fragment.
 */
export interface FragmentClass<
  Type extends string,
  ID extends string,
  References extends any[],
  Extra extends Record<string, unknown> = {},
> extends Fragment<Type, ID, References> {
  new (_: never): Fragment<Type, ID, References> & Extra;
}

/**
 * Check if a value matches the Fragment shape.
 */
export function isFragment(
  value: unknown,
): value is Fragment<string, string, any[]> {
  return (
    typeof value === "function" &&
    "type" in value &&
    typeof value.type === "string" &&
    "id" in value &&
    "template" in value &&
    "references" in value
  );
}

/**
 * Factory that creates a fragment builder with optional extra properties.
 *
 * @example
 * ```typescript
 * // Basic usage (Agent, Channel, Group pattern)
 * export const Channel = defineFragment("channel")();
 * // Usage: Channel("my-channel")`description`
 *
 * // With extra static properties (File pattern)
 * export const File = defineFragment("file")<{ language: string }>();
 * // Usage: File("my-file", { language: "typescript" as const })`description`
 * ```
 */
export const defineFragment =
  <Type extends string>(type: Type) =>
  <Extra extends Record<string, unknown> = {}>() => {
    const builder = <ID extends string, Props extends Extra>(
      id: ID,
      ...args: keyof Extra extends never ? [] : [props: Props]
    ) => {
      const props = (args[0] ?? {}) as Props;
      return <References extends any[]>(
        template: TemplateStringsArray,
        ...references: References
      ): FragmentClass<Type, ID, References, Props> => {
        const cls = class {
          static readonly type = type;
          static readonly id = id;
          static readonly template = template;
          static readonly references = references;
          constructor(_: never) {}
        };
        Object.assign(cls, props);
        return cls as unknown as FragmentClass<Type, ID, References, Props>;
      };
    };

    builder.is = <
      T extends Fragment<Type, string, any[]> = Fragment<Type, string, any[]>,
    >(
      x: any,
    ): x is T => x?.type === type;
    return builder;
  };
