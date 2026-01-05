# src/aws

AWS primitives: credentials, region, endpoint, and common errors.

→ Parent: [src/AGENTS.md](../AGENTS.md)

## FILES

| File             | Purpose                                            |
| ---------------- | -------------------------------------------------- |
| `credentials.ts` | Credential providers (env, SSO, STS, ini, process) |
| `region.ts`      | `Region` context tag                               |
| `endpoint.ts`    | `Endpoint` override for LocalStack                 |
| `errors.ts`      | `UnknownAwsError`, common error types              |
| `parse-ini.ts`   | AWS config/credentials file parsing                |

## CREDENTIAL CHAIN

`Credentials.fromChain()` tries in order:

1. **Environment** — `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
2. **INI file** — `~/.aws/credentials`
3. **SSO** — SSO profile in `~/.aws/config`
4. **Process** — External process via `credential_process`

Other providers: `fromEnv`, `fromSSO`, `fromIni`, `fromSTS`, `fromProcess`, `mock`

## USAGE

```typescript
import { Credentials, Region, Endpoint } from "distilled-aws";
import * as Layer from "effect/Layer";

// Default chain
const creds = Credentials.fromChain();

// Explicit region
const region = Layer.succeed(Region.Region, "us-east-1");

// LocalStack override
const local = Layer.succeed(Endpoint.Endpoint, "http://localhost:4566");
```

## ERRORS

- `UnknownAwsError` — Catch-all for unexpected AWS errors
- `CommonAwsError` — Base for known error types
- Error categories in `../error-category.ts` drive retry behavior
