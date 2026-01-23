export interface Fragment<
  Type extends string,
  Name extends string,
  References extends any[],
> {
  readonly type: Type;
  readonly name: Name;
  readonly template: TemplateStringsArray;
  readonly references: References;
}
