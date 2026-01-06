/**
 * AWS EC2 Query Protocol Implementation
 *
 * https://smithy.io/2.0/aws/protocols/aws-ec2-query-protocol.html
 *
 * Key differences from awsQuery:
 * - All lists are flattened (no wrapper elements)
 * - Uses aws.protocols#ec2QueryName trait for custom query key names
 * - Response root is {OperationName}Response (no result wrapper)
 * - Errors wrapped in <Response><Errors><Error>...</Error></Errors><RequestID>...</RequestID></Response>
 * - HTTP binding traits are ignored
 */

import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import type * as AST from "effect/SchemaAST";
import type { Operation } from "../client/operation.ts";
import type { Protocol, ProtocolHandler } from "../client/protocol.ts";
import type { Request } from "../client/request.ts";
import type { Response } from "../client/response.ts";
import { ParseError } from "../errors.ts";
import {
  getEc2QueryName,
  getServiceVersion,
  getXmlNameProp,
  hasXmlAttribute,
} from "../traits.ts";
import {
  getArrayElementAST,
  getEncodedPropertySignatures,
  getIdentifier,
  isArrayAST,
} from "../util/ast.ts";
import { sanitizeErrorCode } from "../util/error.ts";
import { readStreamAsText } from "../util/stream.ts";
import {
  deserializePrimitive,
  extractXmlRoot,
  parseXml,
  unwrapArrayValue,
} from "../util/xml.ts";

// =============================================================================
// Protocol Export
// =============================================================================

export const ec2QueryProtocol: Protocol = (
  operation: Operation,
): ProtocolHandler => {
  const inputSchema = operation.input;
  const outputSchema = operation.output;
  const inputAst = inputSchema.ast;
  const outputAst = outputSchema.ast;

  // Pre-compute encoder (done once at init)
  const encodeInput = S.encode(inputSchema);

  // Pre-compute operation name and version from annotations
  const identifier = getIdentifier(inputAst) ?? "";
  const action = identifier.replace(/(?:Request|Input)$/, "");
  const version = getServiceVersion(inputAst) ?? "";

  return {
    serializeRequest: Effect.fn(function* (input: unknown) {
      // Encode the input via schema - handles all transformations
      // (TimestampFormat → ISO 8601 strings, etc.)
      const encoded = yield* encodeInput(input);

      const request: Request = {
        method: "POST",
        path: "/",
        query: {},
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      };

      // Build form-urlencoded body
      const params: string[] = [];
      params.push(`Action=${encodeURIComponent(action)}`);
      params.push(`Version=${encodeURIComponent(version)}`);

      // Serialize already-encoded input members
      serializeMembers(
        inputAst,
        encoded as Record<string, unknown>,
        "",
        params,
      );

      request.body = params.join("&");

      return request;
    }),

    deserializeResponse: Effect.fn(function* (response: Response) {
      const result: Record<string, unknown> = {};

      // Read body as text
      const bodyText = yield* readStreamAsText(response.body);

      // Parse body XML
      if (bodyText) {
        const parsed = parseXml(bodyText);

        // EC2 response root is {OperationName}Response
        const content = extractXmlRoot(parsed);

        if (content && typeof content === "object") {
          Object.assign(result, deserializeObject(outputAst, content));
        }
      }

      return result;
    }),

    deserializeError: Effect.fn(function* (response: Response) {
      // Read body as text
      const bodyText = yield* readStreamAsText(response.body);

      if (!bodyText) {
        return yield* new ParseError({ message: "Empty error response body" });
      }

      // Parse XML body
      const parsed = parseXml(bodyText);

      // EC2 Query error structure:
      // <Response>
      //   <Errors>
      //     <Error>
      //       <Code>InvalidParameterValue</Code>
      //       <Message>...</Message>
      //     </Error>
      //   </Errors>
      //   <RequestID>xxx</RequestID>
      // </Response>

      let errorContent: Record<string, unknown> | undefined;
      let requestId: string | undefined;

      if (parsed.Response && typeof parsed.Response === "object") {
        const responseObj = parsed.Response as Record<string, unknown>;

        // Extract RequestID
        if (typeof responseObj.RequestID === "string") {
          requestId = responseObj.RequestID;
        }

        // Navigate to Errors.Error
        if (responseObj.Errors && typeof responseObj.Errors === "object") {
          const errors = responseObj.Errors as Record<string, unknown>;
          if (errors.Error && typeof errors.Error === "object") {
            // Could be a single error or an array - take the first one
            if (Array.isArray(errors.Error)) {
              errorContent = errors.Error[0] as Record<string, unknown>;
            } else {
              errorContent = errors.Error as Record<string, unknown>;
            }
          }
        }
      }

      if (!errorContent) {
        return yield* new ParseError({
          message: `Could not find Error element in EC2 XML response: ${bodyText}`,
        });
      }

      // Extract error code from <Code> element
      const rawErrorCode = errorContent.Code;
      if (typeof rawErrorCode !== "string") {
        return yield* new ParseError({
          message: `No Code element found in error response: ${bodyText}`,
        });
      }

      const errorCode = sanitizeErrorCode(rawErrorCode);

      // Extract remaining data (remove Code, keep Message, etc.)
      const { Code: _Code, ...data } = errorContent;

      // Include RequestID if present
      if (requestId) {
        data.RequestID = requestId;
      }

      return { errorCode, data };
    }),
  };
};

// =============================================================================
// Query String Serialization
// =============================================================================

/**
 * Get the query key name for a member following EC2 query key resolution:
 * 1. Use ec2QueryName trait if present
 * 2. Use xmlName trait with first letter capitalized if present
 * 3. Use member name with first letter capitalized
 */
function getQueryKeyName(prop: AST.PropertySignature): string {
  const ec2QueryName = getEc2QueryName(prop);
  if (ec2QueryName) return ec2QueryName;

  const xmlName = getXmlNameProp(prop);
  if (xmlName) {
    return xmlName.charAt(0).toUpperCase() + xmlName.slice(1);
  }

  const memberName = String(prop.name);
  return memberName.charAt(0).toUpperCase() + memberName.slice(1);
}

/**
 * Serialize object members to query parameters
 */
function serializeMembers(
  ast: AST.AST,
  input: Record<string, unknown>,
  prefix: string,
  params: string[],
): void {
  for (const prop of getEncodedPropertySignatures(ast)) {
    const memberName = String(prop.name);
    const value = input[memberName];
    if (value === undefined || value === null) continue;

    const queryKey = getQueryKeyName(prop);
    const fullKey = prefix ? `${prefix}.${queryKey}` : queryKey;

    serializeValue(prop.type, value, fullKey, params, prop);
  }
}

/**
 * Serialize a value to query parameters.
 * Values are already encoded (dates as ISO 8601 strings, etc.)
 */
function serializeValue(
  ast: AST.AST,
  value: unknown,
  key: string,
  params: string[],
  _prop?: AST.PropertySignature,
): void {
  if (value === undefined || value === null) return;

  // Handle primitives (includes encoded dates as strings, blobs as base64)
  // Blob schema transforms Uint8Array → base64 string during encoding
  if (typeof value !== "object") {
    params.push(
      `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    );
    return;
  }

  // Handle arrays - EC2 always uses flattened lists with 1-based indexing
  if (Array.isArray(value)) {
    // Empty arrays are not serialized in EC2 query
    if (value.length === 0) return;

    const elementAST = getArrayElementAST(ast);
    for (let i = 0; i < value.length; i++) {
      const itemKey = `${key}.${i + 1}`;
      serializeValue(elementAST ?? ast, value[i], itemKey, params);
    }
    return;
  }

  // Handle objects (nested structures)
  if (typeof value === "object") {
    serializeMembers(ast, value as Record<string, unknown>, key, params);
  }
}

// =============================================================================
// XML Deserialization
// =============================================================================

function deserializeValue(ast: AST.AST, value: unknown): unknown {
  if (value == null || value === "") return undefined;

  // Handle arrays
  if (isArrayAST(ast)) {
    const elAST = getArrayElementAST(ast);
    if (!elAST) return Array.isArray(value) ? value : [value];

    // Handle wrapped arrays: { member: [...] } or { item: [...] }
    const elTag = getIdentifier(elAST);
    const unwrapped = unwrapArrayValue(value, elTag, ["member", "item"]);

    const items = Array.isArray(unwrapped) ? unwrapped : [unwrapped];
    return items.map((item) => deserializeValue(elAST, item));
  }

  // Handle strings
  if (typeof value === "string") {
    return deserializePrimitive(ast, value);
  }

  // Handle numbers/booleans from parser
  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  // Handle objects
  if (typeof value === "object" && !Array.isArray(value)) {
    return deserializeObject(ast, value as Record<string, unknown>);
  }

  return value;
}

function deserializeObject(
  ast: AST.AST,
  value: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const prop of getEncodedPropertySignatures(ast)) {
    const key = String(prop.name);
    const xmlName = getXmlNameProp(prop) ?? key;

    // Handle XML attributes (parser prefixes attributes with @_)
    if (hasXmlAttribute(prop)) {
      const attrValue = value[`@_${xmlName}`];
      if (attrValue !== undefined) {
        result[key] = deserializeValue(prop.type, attrValue);
      }
      continue;
    }

    // Try member name first, then xmlName
    let propValue = value[key] ?? value[xmlName];

    // For response XML, try lowercase first character variations
    if (propValue === undefined) {
      const lcKey = key.charAt(0).toLowerCase() + key.slice(1);
      const lcXmlName = xmlName.charAt(0).toLowerCase() + xmlName.slice(1);
      propValue = value[lcKey] ?? value[lcXmlName];
    }

    if (propValue === undefined) continue;

    // Handle arrays (EC2 uses wrapped lists in responses with <item> elements)
    if (isArrayAST(prop.type)) {
      const elAST = getArrayElementAST(prop.type) ?? prop.type;

      // Unwrap list wrapper elements from XML parser output
      const elTag = getIdentifier(elAST);
      const arrayValue = unwrapArrayValue(propValue, elTag, ["item", "member"]);

      const items = Array.isArray(arrayValue) ? arrayValue : [arrayValue];
      result[key] = items.map((item) => deserializeValue(elAST, item));
    } else {
      result[key] = deserializeValue(prop.type, propValue);
    }
  }

  return result;
}
