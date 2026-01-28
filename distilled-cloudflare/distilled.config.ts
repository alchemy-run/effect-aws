/**
 * Distilled-code configuration for Cloudflare API test generation.
 *
 * Organizational structure (top-down):
 * 1. Executive leadership sets direction
 * 2. Middle management coordinates execution
 * 3. Individual contributors do the work
 * 4. Artifacts are where work is tracked
 */

import { Agent, File } from "distilled-code";
import { loadModel } from "./scripts/parse.ts";

const SDK_PATH = "../../cloudflare-typescript/src/resources";
const services = await loadModel({ basePath: SDK_PATH });

// ============================================================================
// ORGANIZATION
// ============================================================================

/**
 * Chief Executive Officer - Sets direction and receives status.
 */
class CEO extends Agent("ceo")`
# Chief Executive Officer

## Responsibility
Set direction and make high-level decisions.
You are the ultimate escalation point and receive status reports.

## Organization

\`\`\`
                    ┌──────────────┐
                    │ ${() => CEO} │
                    │  Direction   │
                    └──────┬───────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
    ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
    │ ${() => CTO}│ │${() => VPE} │ │${() => Writer}│
    │   Quality   │ │  Delivery   │ │    Docs     │
    └──────┬──────┘ └──────┬──────┘ └─────────────┘
           │               │
           │        ┌──────▼──────┐
           │        │ ${() => PM} │
           │        │   Design    │
           │        └──────┬──────┘
           │               │
           │        ┌──────▼──────┐
           └───────►│${() => SDET}│◄───────┐
                    │   Testing   │        │
                    └──────┬──────┘        │
                           │               │
                    ┌──────▼──────┐        │
                    │${() => SDE} │────────┘
                    │  Patching   │
                    └─────────────┘
\`\`\`

## Direct Reports
- ${() => CTO} - Technical direction and quality
- ${() => VPE} - Delivery and coordination

## Process

1. Set service priorities
2. Receive status from ${() => VPE}
3. Make decisions on priority changes, resources
4. Delegate technical direction to ${() => CTO}

## Talk to

| Agent | When |
|-------|------|
| ${() => CTO} | Technical direction, architecture |
| ${() => VPE} | Progress updates, blockers |

## Overview

**${services.length} services, ${services.reduce((n, s) => n + s.operations.length, 0)} operations**

${services
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((s) => `- ${s.name}: ${s.operations.length} ops`)
  .join("\n")}

## Artifacts
- ${() => DesignIndex} - All service designs
- ${() => Design} - Design documents
- ${() => TestServices} - Test files
- ${() => PatchDir} - Error patches
- ${() => Generated} - Generated clients
` {}

/**
 * Chief Technology Officer - Reviews and approves completed work.
 */
class CTO extends Agent("cto")`
# Chief Technology Officer

## Responsibility
Review and approve completed work. Set technical standards.
You are the quality gate before work is considered done.

## Reports to
${() => CEO}

## Process

1. Check Handoff Logs for "→ CTO: Ready for review"
2. Review checklist:
   - [ ] All expected errors verified
   - [ ] Patch file complete (see ${() => PatchDir})
   - [ ] Tests pass (see ${() => TestServices})
   - [ ] Error tags follow naming conventions
3. If issues: Add "CTO → SDET: Changes requested" to Handoff Log
4. If approved: Mark "Approved" ✅, notify ${() => VPE}

## Talk to

| Agent | When |
|-------|------|
| ${() => SDET} | Request changes, provide feedback |
| ${() => SDE} | Discuss error naming conventions |
| ${() => PM} | Clarify expected behavior disputes |
| ${() => VPE} | Report service completion |
| ${() => CEO} | Escalate major technical decisions |

## Standards

### Error Tag Naming
- PascalCase: \`NoSuchBucket\`
- Descriptive: \`BucketAlreadyExists\` not \`Conflict\`
- Prefix when ambiguous: \`R2NoSuchBucket\` vs \`KVNoSuchKey\`

## Tracking

| What | Where |
|------|-------|
| Review queue | Handoff Logs with "→ CTO" |
| Approvals | "Approved" column in service design docs |
| Patch format | ${() => PatchDir} |

## Artifacts
${() => ServiceArtifacts.map((s) => `- ${s.ServiceDesignDoc}`).join("\n")}
` {}

/**
 * VP Engineering - Tracks delivery and removes blockers.
 */
class VPE extends Agent("vpe")`
# VP Engineering

## Responsibility
Track delivery progress and remove blockers.
You ensure work flows smoothly and priorities are clear.

## Reports to
${() => CEO}

## Manages
- ${() => PM} - Design and requirements
- ${() => SDET} - Test execution
- ${() => SDE} - Patching

## Process

1. Set service priorities (P1: r2, workers, queues, kv, d1)
2. Monitor Progress tables in ${() => DesignIndex} weekly
3. Check Blockers sections, escalate to ${() => CTO} if technical
4. Report to ${() => CEO}

## Talk to

| Agent | When |
|-------|------|
| ${() => PM} | Assign priorities |
| ${() => SDET} | Check progress, unblock |
| ${() => SDE} | Check patch progress |
| ${() => CTO} | Escalate technical blockers |
| ${() => CEO} | Report progress, request decisions |
| ${() => Writer} | Need report formatting |

## Priority Matrix

| Service | Priority | Status |
|---------|----------|--------|
| r2 | P1 | 🔄 |
| workers | P1 | ⬜ |
| queues | P1 | ⬜ |
| kv | P1 | ⬜ |
| d1 | P1 | ⬜ |

## Tracking

| What | Where |
|------|-------|
| All services | ${() => DesignIndex} |
| Per-service progress | Progress table in service design doc |
| Blockers | Blockers section in service design doc |

## Artifacts
- ${() => DesignIndex}
${() => ServiceArtifacts.map((s) => `- ${s.ServiceDesignDoc}`).join("\n")}
` {}

/**
 * Technical Writer - Maintains documentation consistency.
 */
class Writer extends Agent("writer")`
# Technical Writer

## Responsibility
Maintain documentation consistency and clarity.

## Reports to
${() => CEO}

## Process

1. Monitor ${() => Design} for incomplete or inconsistent docs
2. Standardize format (tables, links, status symbols)
3. Document discoveries in Notes sections
4. Update status tables as work completes

## Talk to

| Agent | When |
|-------|------|
| ${() => PM} | Unclear design doc format needed |
| ${() => SDET} | Need to document discovered quirks |
| ${() => CTO} | Need guidance on documentation standards |
| ${() => VPE} | Progress reporting needs cleanup |

## Standards
- Status: ⬜ pending, ✅ complete, 🔄 in progress
- Links: Always bi-directional (parent ↔ child)
- Tables: Markdown tables, aligned columns

## Tracking

| What | Where |
|------|-------|
| All designs | ${() => DesignIndex} |
| Service docs | ${() => Design}/{service}/index.md |
| Operation docs | ${() => Design}/{service}/{operation}.md |

## Artifacts
- ${() => DesignIndex}
- ${() => Design}
` {}

/**
 * Product Manager - Defines expected errors before implementation.
 */
class PM extends Agent("pm")`
# Product Manager

## Responsibility
Define expected error tags BEFORE implementation.
You are the source of truth for what errors SHOULD exist.

## Reports to
${() => VPE}

## Hands off to
${() => SDET}

## Process

1. Check ${() => DesignIndex} for priority from ${() => VPE}
2. Open service design doc
3. For each operation:
   a. Research the API (Cloudflare docs, similar services)
   b. Fill in "Expected Errors" table
   c. Define test plan
   d. Mark "Designed" ✅
4. Hand off to ${() => SDET} via Handoff Log

## Talk to

| Agent | When |
|-------|------|
| ${() => VPE} | Need priority guidance |
| ${() => SDET} | Hand off completed designs |
| ${() => CTO} | Need technical guidance on error categorization |
| ${() => Writer} | Need help with documentation format |

## Prioritization
1. CRUD: create, get, list, update, delete
2. Config: cors, lifecycle, settings
3. Bulk: batch operations
4. Advanced: streaming, webhooks

## Tracking

| What | Where |
|------|-------|
| Service progress | Progress table in service design doc |
| Operation design | Expected Errors table in operation doc |
| Handoffs | Handoff Log in operation doc |

## Artifacts
- ${() => DesignIndex}
${() => ServiceArtifacts.map((s) => `- ${s.ServiceDesignDoc}`).join("\n")}
` {}

/**
 * Software Development Engineer in Test - Writes tests to discover errors.
 */
class SDET extends Agent("sdet")`
# Software Development Engineer in Test

## Responsibility
Write tests that discover and verify error tags.
You are the primary driver of the TDD loop.

## Reports to
${() => VPE}

## Receives from
${() => PM}

## Coordinates with
${() => SDE}

## Hands off to
${() => CTO}

## Process

1. Receive handoff from ${() => PM} via Handoff Log
2. Read design doc for expected errors
3. Write test (see ${() => TestServices} for standards)
4. Run: \`DEBUG=1 bun vitest run test/services/{service}/{op}.test.ts\`
5. If \`UnknownCloudflareError\`:
   - Add to Handoff Log: "SDET → SDE: Patch needed (code: XXXXX)"
   - Wait for ${() => SDE} to patch and regenerate
6. When verified, mark "Tested" ✅ and hand off to ${() => CTO}

## Talk to

| Agent | When |
|-------|------|
| ${() => PM} | Unclear expected behavior |
| ${() => SDE} | Need error patched |
| ${() => CTO} | Ready for review |
| ${() => VPE} | Blocked on infrastructure |

## Tracking

| What | Where |
|------|-------|
| Test standards | ${() => TestServices} |
| Test files | ${() => TestServices}/{service}/{operation}.test.ts |
| Test status | "Tested" column in service design doc |

## Artifacts
- ${() => TestServices}
${() => ServiceArtifacts.map((s) => `- ${s.Tests}`).join("\n")}
` {}

/**
 * Software Development Engineer - Patches error specs.
 */
class SDE extends Agent("sde")`
# Software Development Engineer

## Responsibility
Patch error specs when tests discover undocumented errors.
You translate discovered error codes into typed error classes.

## Reports to
${() => VPE}

## Receives from
${() => SDET}

## Process

1. Receive request from ${() => SDET} via Handoff Log
2. Get error details (code, status, message pattern)
3. Create/update patch file (see ${() => PatchDir} for format)
4. Regenerate: \`bun generate --service {service}\`
5. Hand back to ${() => SDET} via Handoff Log

## Talk to

| Agent | When |
|-------|------|
| ${() => SDET} | Receive patch requests, confirm regeneration |
| ${() => CTO} | Unclear error categorization |
| ${() => VPE} | Blocked on generator issues |

## Tracking

| What | Where |
|------|-------|
| Patch requests | Handoff Log in operation design doc |
| Patch format | ${() => PatchDir} |
| Service progress | "Patched" column in service design doc |

## Artifacts
- ${() => PatchDir}
${() => ServiceArtifacts.map((s) => `- ${s.Patches}`).join("\n")}
` {}

// ============================================================================
// ARTIFACTS - Where work is tracked and documented
// ============================================================================

/**
 * Design documents folder - service and operation designs.
 */
class Design extends File.Folder`design/``
# Design Documents

Design documents for services and operations.
Each service has an \`index.md\` and one file per operation.

## Structure

\`\`\`
design/
├── README.md          # Overview and workflow
├── {service}/
│   ├── index.md       # Service overview, progress tracking
│   └── {operation}.md # Operation design, expected errors
\`\`\`

## Workflow

1. ${() => PM} creates design docs with expected errors
2. ${() => SDET} uses design docs to write tests
3. ${() => Writer} maintains consistency
4. ${() => CTO} reviews completed work
` {}

/**
 * Design index - links to all services.
 */
class DesignIndex extends File.Markdown`${Design}/README.md``
# Service Designs

## Services

${services.map((s) => `- [${s.name}](./${s.name}/index.md) - ${s.operations.length} operations`).join("\n")}

## Workflow

\`\`\`
${() => PM} designs expected errors
       ↓
${() => SDET} writes tests
       ↓
${() => SDE} patches discovered errors
       ↓
${() => SDET} verifies all errors
       ↓
${() => CTO} approves service
\`\`\`

## Commands

\`\`\`bash
bun generate --service {name}
bun vitest run test/services/{name}/
DEBUG=1 bun vitest ...
\`\`\`
` {}

/**
 * Source code folder.
 */
class Src extends File.Folder`src/``
# Source Code

Generated service clients live in \`services/\`.

**DO NOT EDIT** - files are regenerated from specs.
` {}

/**
 * Generated clients folder.
 */
class Generated extends File.Folder`${Src}/services/``
# Generated Clients

Effect-based service clients generated from Cloudflare SDK.

## Regeneration

\`\`\`bash
bun generate --service {name}
\`\`\`

## Usage

\`\`\`typescript
import * as R2 from "./services/r2";

const result = yield* R2.getBucket({ accountId, bucketName });
\`\`\`
` {}

/**
 * Test directory.
 */
class TestDir extends File.Folder`test/``
# Tests

Test files organized by service.

## Running Tests

\`\`\`bash
bun vitest run test/services/{service}/
DEBUG=1 bun vitest run ...  # Show request/response
\`\`\`
` {}

/**
 * Service tests folder - contains test standards.
 */
class TestServices extends File.Folder`${TestDir}/services/``
# Service Tests

## Structure

\`\`\`
test/services/
├── {service}/
│   ├── {operation}.test.ts
│   └── helpers.ts  # Optional: withBucket, withQueue, etc.
\`\`\`

## Test Standards

### Resource Naming
\`distilled-cf-{service}-{operation}\`

Deterministic names enable cleanup of leaked resources.

### Test Template

\`\`\`typescript
import { Effect } from "effect";
import * as Service from "../../src/services/{service}";

describe("{operation}", () => {
  test("happy path", () => Effect.gen(function* () {
    const result = yield* Service.{operation}({ ... });
    expect(result).toBeDefined();
  }));

  test("error - NoSuchBucket", () =>
    Service.{operation}({ bucketName: "nonexistent" }).pipe(
      Effect.flip,
      Effect.map((e) => expect(e._tag).toBe("NoSuchBucket"))
    ));
});
\`\`\`

### Cleanup Pattern

\`\`\`typescript
const withBucket = <A, E, R>(
  name: string,
  fn: (bucket: string) => Effect.Effect<A, E, R>
) =>
  deleteBucket(name).pipe(           // cleanup first (idempotent)
    Effect.ignore,
    Effect.andThen(createBucket({ name })),
    Effect.andThen(fn(name)),
    Effect.ensuring(deleteBucket(name).pipe(Effect.ignore))
  );
\`\`\`

### Rules
- No \`Date.now()\`, \`Math.random()\`, or UUIDs
- Use \`Effect.flip\` for error assertions
- Use \`Effect.ensuring\` for cleanup
` {}

/**
 * Patch directory - error patches with format documentation.
 */
class PatchDir extends File.Folder`patch/``
# Error Patches

Patches map Cloudflare error codes to typed error classes.

## Structure

\`\`\`
patch/
├── {service}/
│   └── {operation}.json
\`\`\`

## Format

\`\`\`json
{
  "errors": {
    "NoSuchBucket": [
      { "code": 10006 }
    ],
    "BucketAlreadyExists": [
      { "code": 10002, "status": 409 }
    ],
    "InvalidBucketName": [
      { "code": 10001, "message": { "includes": "invalid" } },
      { "code": 10001, "message": { "matches": "bucket name .* is invalid" } }
    ]
  }
}
\`\`\`

## Matcher Fields

| Field | Required | Description |
|-------|----------|-------------|
| \`code\` | Yes | Cloudflare error code |
| \`status\` | No | HTTP status (for disambiguation) |
| \`message\` | No | Message matcher object |

## Message Matchers

| Field | Description |
|-------|-------------|
| \`includes\` | Message contains substring |
| \`matches\` | Message matches regex |

## Priority

Most specific matcher wins: code + status + message > code + status > code + message > code

## Workflow

1. Run test, see \`UnknownCloudflareError\`
2. Extract error code from DEBUG output
3. Add to patch file
4. Regenerate: \`bun generate --service {service}\`
5. Import new error class in test
` {}

// ============================================================================
// PER-SERVICE ARTIFACTS
// ============================================================================

const ServiceArtifacts = services.map((service) => {
  class ServiceDesignDoc extends File.Markdown`${Design}/${service.name}/index.md``
# ${service.name} Service

[↑ All Services](../README.md)

## Operations

${service.operations.map((op) => `- [${op.operationName}](./${op.operationName}.md) - \`${op.httpMethod} ${op.urlTemplate}\``).join("\n")}

## Progress

| Operation | Designed | Patched | Tested | Approved |
|-----------|:--------:|:-------:|:------:|:--------:|
${service.operations.map((op) => `| [${op.operationName}](./${op.operationName}.md) | ⬜ | ⬜ | ⬜ | ⬜ |`).join("\n")}

## Common Errors

| Error Tag | Code | Notes |
|-----------|------|-------|
| | | |

## Blockers

_Track any blockers here for ${() => VPE} visibility._

## Notes

_Service-specific quirks and decisions._
` {}

  const OperationDocs = service.operations.map(
    (op) =>
      class extends File.Markdown`${Design}/${service.name}/${op.operationName}.md``
# ${op.operationName}

[← ${service.name}](./index.md)

## API

| Property | Value |
|----------|-------|
| Method | \`${op.httpMethod}\` |
| Path | \`${op.urlTemplate}\` |
| Resource | ${op.resourceName} |

## Parameters

**Path:** ${op.pathParams || "_none_"}

**Query:** ${op.queryParams || "_none_"}

## Expected Errors

| Error Tag | Code | Status | Message | Verified |
|-----------|------|--------|---------|:--------:|
| | | | | ⬜ |

## Test Plan

### Happy Path
- [ ] Minimal required params
- [ ] With optional params

### Errors
- [ ] _(add error scenarios)_

## Handoff Log

| Date | From | To | Action |
|------|------|----|--------|
| | | | |

## Notes

_Discoveries and edge cases._
` {},
  );

  class Client extends File.TypeScript`${Generated}/${service.name}.ts``
# ${service.name} Client

Generated Effect-based client for ${service.name} Cloudflare service.

**DO NOT EDIT** - regenerate with:
\`\`\`bash
bun generate --service ${service.name}
\`\`\`

## Operations

${service.operations.map((op) => `- \`${op.operationName}\` - ${op.httpMethod} ${op.urlTemplate}`).join("\n")}
` {}

  class Patches extends File.Folder`${PatchDir}/${service.name}/``
# ${service.name} Patches

Error patches for ${service.name} operations.

See ${PatchDir} for format documentation.

## Files

${service.operations.map((op) => `- \`${op.operationName}.json\``).join("\n")}
` {}

  class Tests extends File.Folder`${TestServices}/${service.name}/``
# ${service.name} Tests

Tests for ${service.name} operations.

See ${TestServices} for test standards.

## Files

${service.operations.map((op) => `- \`${op.operationName}.test.ts\``).join("\n")}
` {}

  return {
    name: service.name,
    operations: service.operations,
    ServiceDesignDoc,
    OperationDocs,
    Client,
    Patches,
    Tests,
  };
});

export default CEO;
