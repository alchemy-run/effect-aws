import type { Effect } from "effect/Effect";
import * as S from "effect/Schema";
import type { Credentials } from "./aws/credentials.ts";
import type { Endpoint } from "./aws/endpoint.ts";
import type { Region } from "./aws/region.ts";
import type { PaginatedTrait } from "./traits.ts";

export declare namespace Operation {
  export type Input<Op extends Operation> = S.Schema.Type<Op["input"]>;
  export type Output<Op extends Operation> = S.Schema.Type<Op["output"]>;
  export type Error<Op extends Operation> = Instance<Op["errors"][number]>;
}

type Instance<T> = T extends new (...args: any) => infer U ? U : T;

export interface Operation<
  Input extends S.Schema.AnyNoContext = S.Schema.AnyNoContext,
  Output extends S.Schema.AnyNoContext = S.Schema.AnyNoContext,
  Error = any,
> {
  input: Input;
  output: Output;
  errors: Error[];
  /** Pagination metadata for paginated operations */
  pagination?: PaginatedTrait;
}
