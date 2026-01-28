import { defineFile } from "./file.ts";

export type JsonID = `${string}.json` | `${string}.jsonc`;

export const Json = defineFile("json");
