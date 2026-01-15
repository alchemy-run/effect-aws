import { withLocalStack } from "./localstack.ts";

const run = () =>
  Bun.spawn(
    [
      "bun",
      "--env-file",
      ".env",
      "src/patch/discover-errors.ts",
      ...process.argv.slice(2),
    ],
    {
      stdio: ["inherit", "inherit", "inherit"],
      env: process.env,
      cwd: process.cwd(),
    },
  ).exited;

if (process.env.LIVE) {
  await run();
} else {
  await withLocalStack(run);
}
