import { defineFile } from "./file.ts";

export type HtmlID = `${string}.html` | `${string}.htm`;

export const Html = defineFile("html");
