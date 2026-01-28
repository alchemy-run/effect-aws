import { createVariant } from "./file.ts";

export type TypeScriptID = `${string}.ts` | `${string}.tsx`;

export const TypeScript = createVariant("typescript");
