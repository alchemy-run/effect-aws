import { withLocalStack } from "./localstack.ts";

const run = async (port?: number) => {
  // Run tests with inherited stdout/stderr, passing through all args
  const args = process.argv.slice(2);

  // Set LOCALSTACK_HOST env var so tests connect to the correct port
  const env = { ...process.env };
  if (port) {
    env.LOCALSTACK_HOST = `http://localhost:${port}`;
  }

  const proc = Bun.spawn(["bun", "vitest", "run", ...args], {
    stdio: ["inherit", "inherit", "inherit"],
    env,
    cwd: process.cwd(),
  });

  process.exit(await proc.exited);
};

if (process.env.LOCAL) {
  const port = parseInt(process.env.LOCALSTACK_PORT ?? "4566");
  await withLocalStack(() => run(port), { port });
} else {
  await run();
}
