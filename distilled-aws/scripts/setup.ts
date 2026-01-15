import { $ } from "bun";
import { parseArgs } from "util";

const { values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    http: { type: "boolean", default: false },
  },
});
const repos: Array<string | { repo: string; name: string }> = [
  { repo: "aws/api-models-aws", name: "aws-models" }, // alias: aws-models
  "smithy-lang/smithy",
  "smithy-lang/smithy-typescript",
  "aws/aws-sdk-js-v3",
];

for (const repoEntry of repos) {
  const repoPath = typeof repoEntry === "string" ? repoEntry : repoEntry.repo;
  // Determine directory name: use alias (name) if present, otherwise last path component
  const dir =
    typeof repoEntry === "string"
      ? repoPath
          .split("/")
          .pop()!
          .replace(/\.git$/, "")
      : repoEntry.name;

  // Build repo URL
  const repo = values.http
    ? `https://github.com/${repoPath}.git`
    : `git@github.com:${repoPath}.git`;

  const file = Bun.file(dir);
  const exists =
    (await file.exists()) ||
    (await file
      .stat()
      .then(() => true)
      .catch(() => false));
  if (!exists) {
    await $`git clone ${repo} ${dir} --depth=1`;
  } else {
    await $`git pull --ff-only`.cwd(dir);
  }
}
