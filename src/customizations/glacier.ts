/**
 * Amazon Glacier Customizations
 *
 * https://smithy.io/2.0/aws/customizations/glacier-customizations.html
 *
 * 1. X-Amz-Glacier-Version header: MUST be set to the service version for all requests
 * 2. Default accountId: "-" indicates the account making the request should be used
 * 3. Checksum headers: UploadArchive and UploadMultipartPart MUST set
 *    X-Amz-Content-Sha256 and X-Amz-Sha256-Tree-Hash headers
 */

import type { Request } from "../client/request.ts";

/**
 * Apply Glacier-specific customizations to a request.
 *
 * - Sets X-Amz-Glacier-Version header to the service version
 *
 * @param request - The request to customize
 * @param serviceVersion - The Glacier service version (e.g., "2012-06-01")
 * @returns The request with Glacier customizations applied
 */
export function applyGlacierCustomizations(
  request: Request,
  serviceVersion: string,
): Request {
  return {
    ...request,
    headers: {
      ...request.headers,
      "X-Amz-Glacier-Version": serviceVersion,
    },
  };
}

/**
 * Check if a service is Amazon Glacier based on its SDK ID.
 *
 * @param sdkId - The SDK ID from the aws.api#service trait
 * @returns true if the service is Glacier
 */
export function isGlacier(sdkId: string | undefined): boolean {
  return sdkId === "Glacier";
}

/**
 * The default accountId value for Glacier operations.
 *
 * The string "-" indicates that the account making the request should be used.
 * This is what customers usually want, so clients should use this by default.
 */
export const DEFAULT_GLACIER_ACCOUNT_ID = "-";

/**
 * Check if an operation requires checksum headers.
 * UploadArchive and UploadMultipartPart operations require:
 * - X-Amz-Content-Sha256
 * - X-Amz-Sha256-Tree-Hash
 *
 * @param operationName - The name of the operation
 * @returns true if the operation requires checksum headers
 */
export function requiresGlacierChecksums(operationName: string): boolean {
  return (
    operationName === "UploadArchive" || operationName === "UploadMultipartPart"
  );
}

/**
 * Compute SHA256 hash of data.
 *
 * @param data - The data to hash
 * @returns Hex-encoded SHA256 hash
 */
export async function computeSha256(
  data: Uint8Array | string,
): Promise<string> {
  const bytes =
    typeof data === "string" ? new TextEncoder().encode(data) : data;
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    bytes as BufferSource,
  );
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Compute SHA256 tree hash for Glacier.
 *
 * The tree hash is computed by:
 * 1. Breaking the data into 1 MB chunks
 * 2. Computing SHA256 of each chunk
 * 3. Combining hashes pairwise up the tree
 *
 * See: https://docs.aws.amazon.com/amazonglacier/latest/dev/checksum-calculations.html
 *
 * @param data - The data to compute the tree hash for
 * @returns Hex-encoded SHA256 tree hash
 */
export async function computeTreeHash(
  data: Uint8Array | string,
): Promise<string> {
  const bytes =
    typeof data === "string" ? new TextEncoder().encode(data) : data;

  // 1 MB chunk size
  const CHUNK_SIZE = 1024 * 1024;

  // Compute SHA256 of each 1 MB chunk
  const chunkHashes: Uint8Array[] = [];
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.slice(i, Math.min(i + CHUNK_SIZE, bytes.length));
    const hashBuffer = await crypto.subtle.digest("SHA-256", chunk);
    chunkHashes.push(new Uint8Array(hashBuffer));
  }

  // Handle empty data
  if (chunkHashes.length === 0) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", new Uint8Array(0));
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  // Build tree by combining hashes pairwise
  while (chunkHashes.length > 1) {
    const newLevel: Uint8Array[] = [];
    for (let i = 0; i < chunkHashes.length; i += 2) {
      if (i + 1 < chunkHashes.length) {
        // Concatenate two hashes and hash the result
        const combined = new Uint8Array(64);
        combined.set(chunkHashes[i], 0);
        combined.set(chunkHashes[i + 1], 32);
        const hashBuffer = await crypto.subtle.digest("SHA-256", combined);
        newLevel.push(new Uint8Array(hashBuffer));
      } else {
        // Odd number of hashes, promote the last one
        newLevel.push(chunkHashes[i]);
      }
    }
    chunkHashes.length = 0;
    chunkHashes.push(...newLevel);
  }

  // Return the root hash as hex
  return Array.from(chunkHashes[0])
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Apply Glacier checksum headers to a request.
 *
 * For UploadArchive and UploadMultipartPart operations, this computes and sets:
 * - X-Amz-Content-Sha256: SHA256 hash of the body
 * - X-Amz-Sha256-Tree-Hash: SHA256 tree hash of the body
 *
 * Note: This only works with string/Uint8Array bodies, not streams.
 * For streaming uploads, the caller must compute and provide these values.
 *
 * @param request - The request to add checksum headers to
 * @returns The request with checksum headers added
 */
export async function applyGlacierChecksums(
  request: Request,
): Promise<Request> {
  // Skip if body is not present or is a stream
  if (!request.body || request.body instanceof ReadableStream) {
    return request;
  }

  const body = request.body;
  const bodyBytes =
    typeof body === "string"
      ? new TextEncoder().encode(body)
      : body instanceof Uint8Array
        ? body
        : null;

  if (!bodyBytes) {
    return request;
  }

  const [sha256, treeHash] = await Promise.all([
    computeSha256(bodyBytes),
    computeTreeHash(bodyBytes),
  ]);

  return {
    ...request,
    headers: {
      ...request.headers,
      "X-Amz-Content-Sha256": sha256,
      "X-Amz-Sha256-Tree-Hash": treeHash,
    },
  };
}
