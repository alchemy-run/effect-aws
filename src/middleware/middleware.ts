import type * as Effect from "effect/Effect";
import type { Request } from "../client/request.ts";
import type { Response } from "../client/response.ts";

export interface Middleware {
  request?: (request: Request) => Effect.Effect<Request>;
  response?: (response: Response) => Effect.Effect<Response>;
}
