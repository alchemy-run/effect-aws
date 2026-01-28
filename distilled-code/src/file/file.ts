import type { Fragment } from "../fragment.ts";

/**
 * File type - a file reference defined via template.
 * Extends Fragment for template support with additional language and description properties.
 */
export interface File<
  Name extends string = string,
  Language extends string = string,
  References extends any[] = any[],
> extends Fragment<"file", Name, References> {
  readonly language: Language;
  readonly description: string;
  new (_: never): this;
}

/**
 * Type guard for File entities
 */
export const isFile = (x: any): x is File => x?.type === "file";

/**
 * Creates a File class from a name, language, path template, and description template.
 */
export const File =
  <Name extends string, Language extends string>(
    name: Name,
    language: Language,
  ) =>
  <References extends any[]>(
    pathTemplate: TemplateStringsArray,
    ...references: References
  ) =>
  (
    descriptionTemplate: TemplateStringsArray,
    ..._descriptionRefs: any[]
  ): File<Name, Language, References> =>
    class {
      static readonly type = "file";
      static readonly id = name;
      static readonly references = references;
      static readonly template = pathTemplate;
      static readonly language = language;
      static readonly description = descriptionTemplate.join("").trim();
      constructor(_: never) {}
    } as unknown as File<Name, Language, References>;

/**
 * Creates a language-specific file variant builder.
 *
 * Supports two calling conventions:
 * 1. Explicit string ID: `Folder("docs/")` followed by description template
 * 2. Tagged template for path: `Folder\`${Root}/path/\`` followed by description template
 *
 * @example
 * ```ts
 * export const Folder = defineFile("folder");
 *
 * // Usage with explicit string ID:
 * class Docs extends Folder("docs/")`
 * Documentation root folder.
 * ` {}
 *
 * // Usage with template literal path (references other files):
 * class Designs extends Folder`${Docs}/designs/``
 * Design documents folder.
 * ` {}
 * ```
 */
export const defineFile = <const Language extends string>(
  language: Language,
) => {
  // This function handles both calling conventions
  function variant<ID extends string>(
    id: ID,
  ): DescriptionBuilder<ID, Language, []>;
  function variant<ID extends string>(
    pathTemplate: TemplateStringsArray,
    ...references: any[]
  ): DescriptionBuilder<ID, Language, typeof references>;
  function variant<ID extends string>(
    idOrTemplate: ID | TemplateStringsArray,
    ...references: any[]
  ): DescriptionBuilder<ID, Language, typeof references> {
    // Detect if called as tagged template or with explicit string
    const isTaggedTemplate =
      Array.isArray(idOrTemplate) && "raw" in idOrTemplate;

    if (isTaggedTemplate) {
      const pathTemplate = idOrTemplate as TemplateStringsArray;
      const id = computeId(pathTemplate, references) as ID;
      return createDescriptionBuilder(id, language, pathTemplate, references);
    } else {
      const id = idOrTemplate as ID;
      // Create a synthetic template for explicit string IDs
      const syntheticTemplate = Object.assign([id], {
        raw: [id],
      }) as TemplateStringsArray;
      return createDescriptionBuilder(id, language, syntheticTemplate, []);
    }
  }
  return variant;
};

type DescriptionBuilder<
  ID extends string,
  Language extends string,
  References extends any[],
> = (
  descriptionTemplate: TemplateStringsArray,
  ...descriptionRefs: any[]
) => File<ID, Language, References>;

function createDescriptionBuilder<
  ID extends string,
  Language extends string,
  References extends any[],
>(
  id: ID,
  language: Language,
  pathTemplate: TemplateStringsArray,
  references: References,
): DescriptionBuilder<ID, Language, References> {
  return (
    descriptionTemplate: TemplateStringsArray,
    ...descriptionRefs: any[]
  ): File<ID, Language, References> => {
    // Interpolate description references
    const description = interpolateTemplate(
      descriptionTemplate,
      descriptionRefs,
    );
    return class {
      static readonly type = "file";
      static readonly id = id;
      static readonly references = references;
      static readonly template = pathTemplate;
      static readonly language = language;
      static readonly description = description;
      constructor(_: never) {}
    } as unknown as File<ID, Language, References>;
  };
}

/**
 * Interpolates a template string array with its references.
 */
function interpolateTemplate(
  template: TemplateStringsArray,
  references: any[],
): string {
  let result = template[0];
  for (let i = 0; i < references.length; i++) {
    const ref = references[i];
    const refStr = typeof ref === "string" ? ref : (ref?.id ?? String(ref));
    result += refStr + template[i + 1];
  }
  return result.trim();
}

/**
 * Computes a file ID from a path template and its references.
 * References that have an `id` property (like other File classes) use that id.
 */
function computeId(template: TemplateStringsArray, references: any[]): string {
  let result = template[0];
  for (let i = 0; i < references.length; i++) {
    const ref = references[i];
    const refId = typeof ref === "string" ? ref : (ref?.id ?? "");
    result += refId + template[i + 1];
  }
  return result;
}
