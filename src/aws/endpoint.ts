import * as Context from "effect/Context";

export class Endpoint extends Context.Tag("effect-aws/Endpoint")<
  Endpoint,
  string
>() {}
