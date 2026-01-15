import { execSync } from "node:child_process";

const packageJson = await Bun.file("package.json").json();

const [major, minor, patch] = packageJson.version.split(".").map(Number);
const newVersion = `${major}.${minor}.${patch + 1}`;

packageJson.version = newVersion;

await Bun.write("package.json", JSON.stringify(packageJson, null, 2) + "\n");

execSync("git add package.json", { stdio: "inherit" });
execSync(`git commit -m "chore(release): ${newVersion}"`, { stdio: "inherit" });

console.log(`Bumped version to ${newVersion}`);
