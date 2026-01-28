import { createVariant } from "./file.ts";

export type YamlID = `${string}.yaml` | `${string}.yml`;

export const Yaml = createVariant("yaml");
