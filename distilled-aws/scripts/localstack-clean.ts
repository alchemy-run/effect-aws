import { $ } from "bun";

// Find and remove all localstack containers
const containers =
  await $`docker ps -a --filter "name=localstack-" --format "{{.Names}}"`.text();

const containerNames = containers
  .trim()
  .split("\n")
  .filter((name) => name.length > 0);

if (containerNames.length === 0) {
  console.log("No LocalStack containers found.");
  process.exit(0);
}

console.log(`Found ${containerNames.length} LocalStack container(s):`);
for (const name of containerNames) {
  console.log(`  - ${name}`);
}

console.log("\nStopping and removing containers...");
for (const name of containerNames) {
  await $`docker stop ${name} 2>/dev/null || true`.quiet();
  await $`docker rm ${name} 2>/dev/null || true`.quiet();
  console.log(`  ✓ Removed ${name}`);
}

console.log("\nAll LocalStack containers cleaned up.");
