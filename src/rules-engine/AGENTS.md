# src/rules-engine

Smithy rules engine for endpoint resolution. Compiles rule sets to JavaScript functions that compute endpoint URL, headers, and auth scheme.

→ Parent: [AGENTS.md](../../AGENTS.md)

## FILES

| File                    | Purpose                                                          |
| ----------------------- | ---------------------------------------------------------------- |
| `endpoint-resolver.ts`  | `makeEndpointResolver(operation)` — creates resolver from schema |
| `expression.ts`         | `RuleSetObject`, `EndpointParams`, `Expression` types            |
| `standard-functions.ts` | `isSet`, `parseURL`, `substring`, `stringEquals`                 |
| `aws-functions.ts`      | `aws.partition`, `aws.isVirtualHostableS3Bucket`                 |
| `partitions.json`       | AWS partition data (copied from Smithy)                          |

## HOW IT WORKS

1. **Code Generation** — `scripts/compile-rules.ts` compiles Smithy rule sets to JavaScript functions at build time
2. **`makeEndpointResolver`** — Retrieves compiled resolver from schema annotations
3. **Input → EndpointParams** — Extracts `Region`, `Bucket`, etc. from input + static context
4. **Compiled Function** — Executes compiled JS function with runtime helpers
5. **Result** — `{ url, headers, authSchemes }` used to configure request

## SMITHY TRAITS

| Trait                              | Purpose                             |
| ---------------------------------- | ----------------------------------- |
| `smithy.rules#endpointRuleSet`     | Rule set JSON (on input schema)     |
| `smithy.rules#contextParam`        | Bind input member to endpoint param |
| `smithy.rules#staticContextParams` | Static params per operation         |
| `smithy.rules#clientContextParams` | Client-level endpoint params        |

## ADDING FUNCTIONS

Standard functions go in `standard-functions.ts`. AWS-specific in `aws-functions.ts`.

Functions must match the Smithy spec exactly — see `smithy/docs/source-2.0/aws/rules-engine/library-functions.rst`.

The compiler in `scripts/compile-rules.ts` must also be updated to emit calls to new functions.
