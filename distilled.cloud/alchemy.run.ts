import alchemy from "alchemy";
import { GitHubComment, GitHubSecret } from "alchemy/github";
import { CloudflareStateStore } from "alchemy/state";
import { Astro, Zone } from "alchemy/cloudflare";

const app = await alchemy("distilled-cloud", {
  stateStore: (scope) => new CloudflareStateStore(scope),
});

export const worker = await Astro("website", {
  domains: app.stage === "prod" ? ["distilled.cloud"] : undefined,
  url: app.stage !== "prod",
  dev: {
    command: "bun astro dev --host",
  },
});

console.log({
  url: app.stage !== "prod" ? worker.url : `https://distilled.cloud`,
});

if (app.stage === "prod") {
  await Zone("distilled-cloud", {
    name: "distilled.cloud",
  });
}

if (app.stage === "samgoodwin") {
  await Promise.all(
    [
      "ALCHEMY_STATE_TOKEN",
      "ALCHEMY_PASSWORD",
      "CLOUDFLARE_EMAIL",
      "CLOUDFLARE_API_TOKEN",
      "CLOUDFLARE_ACCOUNT_ID",
    ].map((secret) =>
      GitHubSecret("github-secret", {
        name: secret,
        value: alchemy.secret.env[secret],
        owner: "alchemy-run",
        repository: "distilled.cloud",
      }),
    ),
  );
}

if (process.env.PULL_REQUEST) {
  const previewUrl = worker.url;

  await GitHubComment("pr-preview-comment", {
    owner: process.env.GITHUB_REPOSITORY_OWNER || "alchemy-run",
    repository: process.env.GITHUB_REPOSITORY_NAME || "distilled.cloud",
    issueNumber: Number(process.env.PULL_REQUEST),
    body: `
## 🚀 Preview Deployed

Your preview is ready!

**Preview URL:** ${previewUrl}

This preview was built from commit ${process.env.GITHUB_SHA}

---
<sub>🤖 This comment will be updated automatically when you push new commits to this PR.</sub>`,
  });
}

await app.finalize();
