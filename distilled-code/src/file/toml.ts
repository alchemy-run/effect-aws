import { createVariant } from "./file.ts";

export type TomlID = `${string}.toml`;

export const Toml = createVariant("toml");
