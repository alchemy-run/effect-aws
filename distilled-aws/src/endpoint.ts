import * as Context from "effect/Context";

export class Endpoint extends Context.Tag("distilled-aws/Endpoint")<
  Endpoint,
  string
>() {}
