import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "CodeCatalyst",
  serviceShapeName: "CodeCatalyst",
});
const auth = T.AwsAuthSigv4({ name: "CodeCatalyst" });
const ver = T.ServiceVersion("2022-09-28");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
    UseFIPS: {
      builtIn: "AWS::UseFIPS",
      required: true,
      default: false,
      documentation:
        "When true, send this request to the FIPS-compliant regional endpoint. If the configured endpoint does not have a FIPS compliant endpoint, dispatching the request will return an error.",
      type: "boolean",
    },
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
      type: "string",
    },
    Endpoint: {
      builtIn: "SDK::Endpoint",
      required: false,
      documentation: "Override the endpoint used to send this request",
      type: "string",
    },
  },
  rules: [
    {
      conditions: [{ fn: "isSet", argv: [{ ref: "Endpoint" }] }],
      endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
      type: "endpoint",
    },
    {
      conditions: [
        { fn: "not", argv: [{ fn: "isSet", argv: [{ ref: "Region" }] }] },
        { fn: "aws.partition", argv: ["us-west-2"], assign: "PartitionResult" },
      ],
      rules: [
        {
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
          ],
          rules: [
            {
              conditions: [
                {
                  fn: "booleanEquals",
                  argv: [
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                    },
                    false,
                  ],
                },
              ],
              error: "Partition does not support FIPS.",
              type: "error",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://codecatalyst-fips.global.{PartitionResult#dualStackDnsSuffix}",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
          ],
          type: "tree",
        },
        {
          conditions: [],
          endpoint: {
            url: "https://codecatalyst.global.{PartitionResult#dualStackDnsSuffix}",
            properties: {},
            headers: {},
          },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
    {
      conditions: [
        { fn: "isSet", argv: [{ ref: "Region" }] },
        {
          fn: "aws.partition",
          argv: [{ ref: "Region" }],
          assign: "PartitionResult",
        },
      ],
      rules: [
        {
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
          ],
          rules: [
            {
              conditions: [
                {
                  fn: "booleanEquals",
                  argv: [
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                    },
                    false,
                  ],
                },
              ],
              error: "Partition does not support FIPS.",
              type: "error",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://codecatalyst-fips.global.{PartitionResult#dualStackDnsSuffix}",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
          ],
          type: "tree",
        },
        {
          conditions: [],
          endpoint: {
            url: "https://codecatalyst.global.{PartitionResult#dualStackDnsSuffix}",
            properties: {},
            headers: {},
          },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
  ],
});

//# Schemas
export class VerifySessionRequest extends S.Class<VerifySessionRequest>(
  "VerifySessionRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetUserDetailsRequest extends S.Class<GetUserDetailsRequest>(
  "GetUserDetailsRequest",
)(
  {
    id: S.optional(S.String).pipe(T.HttpQuery("id")),
    userName: S.optional(S.String).pipe(T.HttpQuery("userName")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/userDetails" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class VerifySessionResponse extends S.Class<VerifySessionResponse>(
  "VerifySessionResponse",
)({ identity: S.optional(S.String) }) {}
export class EmailAddress extends S.Class<EmailAddress>("EmailAddress")({
  email: S.optional(S.String),
  verified: S.optional(S.Boolean),
}) {}
export class GetUserDetailsResponse extends S.Class<GetUserDetailsResponse>(
  "GetUserDetailsResponse",
)({
  userId: S.optional(S.String),
  userName: S.optional(S.String),
  displayName: S.optional(S.String),
  primaryEmail: S.optional(EmailAddress),
  version: S.optional(S.String),
}) {}

//# Errors

//# Operations
/**
 * Verifies whether the calling user has a valid Amazon CodeCatalyst login and session. If successful, this returns the ID of the user in Amazon CodeCatalyst.
 */
export const verifySession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: VerifySessionRequest,
  output: VerifySessionResponse,
  errors: [],
}));
/**
 * Returns information about a user.
 */
export const getUserDetails = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUserDetailsRequest,
  output: GetUserDetailsResponse,
  errors: [],
}));
