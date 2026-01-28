import { defineFile } from "./file.ts";

export type TypeScriptID = `${string}.ts` | `${string}.tsx`;

export const TypeScript = defineFile("typescript");
