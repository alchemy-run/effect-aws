import { execSync } from "node:child_process";
import { existsSync, symlinkSync, unlinkSync, lstatSync } from "node:fs";
import { dirname, join } from "node:path";

// Find all AGENTS.md files tracked by git (respects .gitignore)
const files = execSync("git ls-files '**/AGENTS.md' 'AGENTS.md'", {
  encoding: "utf-8",
})
  .trim()
  .split("\n")
  .filter(Boolean);

for (const file of files) {
  const dir = dirname(file);
  const symlinkPath = join(dir, "CLAUDE.md");

  // Remove existing symlink if present
  if (existsSync(symlinkPath)) {
    const stat = lstatSync(symlinkPath);
    if (stat.isSymbolicLink()) {
      unlinkSync(symlinkPath);
    } else {
      console.log(`Skipping ${symlinkPath}: exists and is not a symlink`);
      continue;
    }
  }

  // Create relative symlink
  symlinkSync("AGENTS.md", symlinkPath);
  console.log(`Created symlink: ${symlinkPath} -> AGENTS.md`);
}
