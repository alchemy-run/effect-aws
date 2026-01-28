import { createVariant } from "./file.ts";

export type JsonID = `${string}.json` | `${string}.jsonc`;

export const Json = createVariant("json");
