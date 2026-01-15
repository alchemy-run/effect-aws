/**
 * Common schemas for Cloudflare API types.
 *
 * Includes file upload schemas for multipart form-data operations.
 */

import * as Schema from "effect/Schema";

// =============================================================================
// File Upload Schemas
// =============================================================================

/**
 * Schema for File objects (browser File API).
 *
 * Used for multipart form-data file uploads.
 */
export const FileSchema = Schema.declare(
  (input): input is File =>
    typeof File !== "undefined" && input instanceof File,
  {
    identifier: "File",
    description: "A File object for upload",
  },
);

/**
 * Schema for Blob objects.
 *
 * Used for binary data uploads.
 */
export const BlobSchema = Schema.declare(
  (input): input is Blob =>
    typeof Blob !== "undefined" && input instanceof Blob,
  {
    identifier: "Blob",
    description: "A Blob object for upload",
  },
);

/**
 * Schema for uploadable content (File or Blob).
 *
 * Accepts any file-like object that can be uploaded via multipart form.
 */
export const UploadableSchema = Schema.Union(FileSchema, BlobSchema);

/**
 * TypeScript type for uploadable content.
 */
export type Uploadable = File | Blob;
