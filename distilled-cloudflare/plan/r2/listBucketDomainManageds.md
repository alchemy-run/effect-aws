Let me read more of the r2.ts file to find the `listBucketDomainManageds` operation and any related error types:Based on my analysis of the code, I now have a complete picture. Let me create the test plan.

## Test Plan for `listBucketDomainManageds`

### Overview

The `listBucketDomainManageds` operation retrieves the managed domain (r2.dev) configuration for an R2 bucket. It's a GET request to `/accounts/{account_id}/r2/buckets/{bucketName}/domains/managed` that returns information about the bucket's r2.dev domain including `bucketId`, `domain`, and `enabled` status.

### Operation Signature (from `src/services/r2.ts:1159-1178`)

```typescript
interface ListBucketDomainManagedsRequest {
  bucketName: string;
  accountId: string;
  jurisdiction?: "default" | "eu" | "fedramp";
}

interface ListBucketDomainManagedsResponse {
  bucketId: string;
  domain: string;
  enabled: boolean;
}
```

### Happy Path Tests

| Test Name                                         | Description                                               | Expected Assertions                                                                              |
| ------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `returns managed domain info for existing bucket` | Create a bucket and list its managed domain configuration | Response has `bucketId` (string), `domain` (string ending in `.r2.dev`), and `enabled` (boolean) |
| `works with jurisdiction header`                  | Test with explicit `jurisdiction: "default"` header       | Same assertions, verifies optional header works                                                  |

### Error Cases

| Error Tag           | Condition                                                 | How to Test                                                      |
| ------------------- | --------------------------------------------------------- | ---------------------------------------------------------------- |
| `NoSuchBucket`      | Bucket name doesn't exist                                 | Call with `bucketName: "distilled-cf-r2-nonexistent-bucket-xyz"` |
| `InvalidBucketName` | Bucket name is malformed (e.g., too short, invalid chars) | Call with `bucketName: "a"` or `bucketName: "INVALID_NAME!"`     |

Note: The existing error types `InvalidBucketName` (code 10005) and `BucketAlreadyExists` (code 10004) are defined in `r2.ts`. `NoSuchBucket` will likely need to be discovered and added via the error patch file.

### Helpers

#### `withBucket`

```typescript
const withBucket = <A, E, R>(
  fn: (bucketName: string) => Effect.Effect<A, E, R>
): Effect.Effect<A, E | CommonErrors, R | ApiToken | HttpClient.HttpClient>
```

**Purpose:** Creates a test bucket, runs the test function, and cleans up.

**Implementation:**

- Bucket name: `distilled-cf-r2-listbucketdomainmanageds`
- Cleanup first: Delete the bucket (ignore errors with `Effect.catchAll(() => Effect.void)`)
- Create bucket with `createBucket`
- Run test function with `Effect.ensuring()` for guaranteed cleanup
- Finally: Delete the bucket (ignore errors)

### Notes

1. **No query parameters** - This operation only takes path params and an optional header
2. **Response structure** - The response is a single object (not an array), representing the managed domain config
3. **Default state** - Newly created buckets have managed domains disabled by default (`enabled: false`)
4. **Domain format** - The `domain` field follows the pattern `{bucketId}.r2.dev` or similar
5. **Jurisdiction** - Testing all jurisdiction values (`default`, `eu`, `fedramp`) may require special account access## Test Plan Summary for `listBucketDomainManageds`

### Overview

Tests the `listBucketDomainManageds` operation which retrieves the managed r2.dev domain configuration for an R2 bucket.

---

### Happy Path Tests

1. **`returns managed domain info for existing bucket`**
   - Create a bucket using `withBucket` helper
   - Call `listBucketDomainManageds` with valid `accountId` and `bucketName`
   - Assert:
     - `bucketId` is a non-empty string
     - `domain` is a non-empty string (contains `.r2.dev`)
     - `enabled` is a boolean (likely `false` for new buckets)

2. **`works with explicit jurisdiction header`**
   - Same as above but pass `jurisdiction: "default"`
   - Verifies optional header parameter works correctly

---

### Error Cases

1. **`NoSuchBucket`**
   - Condition: Bucket does not exist
   - Test: Call with `bucketName: "distilled-cf-r2-nonexistent-bucket-xyz"`
   - Expected: Error with code indicating bucket not found

2. **`InvalidBucketName`**
   - Condition: Bucket name is malformed
   - Test: Call with `bucketName: "a"` (too short) or invalid characters
   - Expected: `InvalidBucketName` error (code 10005)

---

### Helpers

#### `withBucket`

```typescript
const withBucket = <A, E, R>(
  fn: (bucketName: string) => Effect.Effect<A, E, R>
) => {
  const bucketName = "distilled-cf-r2-listbucketdomainmanageds";
  const accountId = getAccountId();

  const cleanup = R2.deleteBucket({ accountId, bucketName }).pipe(
    Effect.catchAll(() => Effect.void)
  );

  return Effect.gen(function* () {
    // Cleanup first (in case previous test left bucket)
    yield* cleanup;

    // Create bucket
    yield* R2.createBucket({ accountId, name: bucketName });

    // Run test with guaranteed cleanup
    return yield* fn(bucketName).pipe(
      Effect.ensuring(cleanup)
    );
  });
};
```

---

### Notes

- The response is a single object, not an array (despite the plural naming)
- New buckets have `enabled: false` by default for managed domains
- The `InvalidBucketName` error class already exists in `r2.ts` (code 10005)
- `NoSuchBucket` may need to be discovered and added via `patch/r2/listBucketDomainManageds.json`
- No query parameters for this operation - only path params and optional jurisdiction header

---

### Todo List Created

| Priority | Task                                                        |
| -------- | ----------------------------------------------------------- |
| High     | Create `withBucket` helper with cleanup-first pattern       |
| High     | Happy path: returns managed domain info for existing bucket |
| Medium   | Happy path: works with explicit jurisdiction header         |
| High     | Error test: `NoSuchBucket` with non-existent bucket         |
| Medium   | Error test: `InvalidBucketName` with malformed name         |
| Low      | Create error patch file if new errors discovered            |
