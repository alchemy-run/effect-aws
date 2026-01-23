import { Toolkit } from "../toolkit.ts";
import { bash } from "../tools/bash.ts";
import { edit } from "../tools/edit.ts";
import { glob } from "../tools/glob.ts";
import { grep } from "../tools/grep.ts";
import { read } from "../tools/read.ts";
import { readlints } from "../tools/readlints.ts";
// import { task } from "./task.ts";
// import { todo } from "./todo.ts";
import { write } from "../tools/write.ts";

export class Coding extends Toolkit("Coding")`
A set of tools for reading, writing, and editing code:

- ${bash}
- ${readlints}
- ${edit}
- ${glob}
- ${grep}
- ${read}
- ${write}
` {}
