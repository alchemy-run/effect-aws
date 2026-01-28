import { defineFile } from "./file.ts";

export type TomlID = `${string}.toml`;

export const Toml = defineFile("toml");
