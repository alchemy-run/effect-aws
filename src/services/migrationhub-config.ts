import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "MigrationHub Config",
  serviceShapeName: "AWSMigrationHubMultiAccountService",
});
const auth = T.AwsAuthSigv4({ name: "mgh" });
const ver = T.ServiceVersion("2019-06-30");
const proto = T.AwsProtocolsAwsJson1_1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
      type: "string",
    },
    UseDualStack: {
      builtIn: "AWS::UseDualStack",
      required: true,
      default: false,
      documentation:
        "When true, use the dual-stack endpoint. If the configured endpoint does not support dual-stack, dispatching the request MAY return an error.",
      type: "boolean",
    },
    UseFIPS: {
      builtIn: "AWS::UseFIPS",
      required: true,
      default: false,
      documentation:
        "When true, send this request to the FIPS-compliant regional endpoint. If the configured endpoint does not have a FIPS compliant endpoint, dispatching the request will return an error.",
      type: "boolean",
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
      rules: [
        {
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
          ],
          error:
            "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: "error",
        },
        {
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
          ],
          error:
            "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: "error",
        },
        {
          conditions: [],
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
    {
      conditions: [{ fn: "isSet", argv: [{ ref: "Region" }] }],
      rules: [
        {
          conditions: [
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
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                        },
                      ],
                    },
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [
                            { ref: "PartitionResult" },
                            "supportsDualStack",
                          ],
                        },
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://migrationhub-config-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                  error:
                    "FIPS and DualStack are enabled, but this partition does not support one or both",
                  type: "error",
                },
              ],
              type: "tree",
            },
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
                        true,
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://migrationhub-config-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                  error:
                    "FIPS is enabled but this partition does not support FIPS",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [
                            { ref: "PartitionResult" },
                            "supportsDualStack",
                          ],
                        },
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://migrationhub-config.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                  error:
                    "DualStack is enabled but this partition does not support DualStack",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://migrationhub-config.{Region}.{PartitionResult#dnsSuffix}",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
          ],
          type: "tree",
        },
      ],
      type: "tree",
    },
    {
      conditions: [],
      error: "Invalid Configuration: Missing Region",
      type: "error",
    },
  ],
});

//# Schemas
export class GetHomeRegionRequest extends S.Class<GetHomeRegionRequest>(
  "GetHomeRegionRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteHomeRegionControlRequest extends S.Class<DeleteHomeRegionControlRequest>(
  "DeleteHomeRegionControlRequest",
)(
  { ControlId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteHomeRegionControlResult extends S.Class<DeleteHomeRegionControlResult>(
  "DeleteHomeRegionControlResult",
)({}) {}
export class Target extends S.Class<Target>("Target")({
  Type: S.String,
  Id: S.optional(S.String),
}) {}
export class DescribeHomeRegionControlsRequest extends S.Class<DescribeHomeRegionControlsRequest>(
  "DescribeHomeRegionControlsRequest",
)(
  {
    ControlId: S.optional(S.String),
    HomeRegion: S.optional(S.String),
    Target: S.optional(Target),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetHomeRegionResult extends S.Class<GetHomeRegionResult>(
  "GetHomeRegionResult",
)({ HomeRegion: S.optional(S.String) }) {}
export class CreateHomeRegionControlRequest extends S.Class<CreateHomeRegionControlRequest>(
  "CreateHomeRegionControlRequest",
)(
  { HomeRegion: S.String, Target: Target, DryRun: S.optional(S.Boolean) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class HomeRegionControl extends S.Class<HomeRegionControl>(
  "HomeRegionControl",
)({
  ControlId: S.optional(S.String),
  HomeRegion: S.optional(S.String),
  Target: S.optional(Target),
  RequestedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const HomeRegionControls = S.Array(HomeRegionControl);
export class CreateHomeRegionControlResult extends S.Class<CreateHomeRegionControlResult>(
  "CreateHomeRegionControlResult",
)({ HomeRegionControl: S.optional(HomeRegionControl) }) {}
export class DescribeHomeRegionControlsResult extends S.Class<DescribeHomeRegionControlsResult>(
  "DescribeHomeRegionControlsResult",
)({
  HomeRegionControls: S.optional(HomeRegionControls),
  NextToken: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  {},
) {}
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  {},
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class DryRunOperation extends S.TaggedError<DryRunOperation>()(
  "DryRunOperation",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * This API permits filtering on the `ControlId` and `HomeRegion`
 * fields.
 */
export const describeHomeRegionControls = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeHomeRegionControlsRequest,
    output: DescribeHomeRegionControlsResult,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidInputException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns the calling account’s home region, if configured. This API is used by other AWS
 * services to determine the regional endpoint for calling AWS Application Discovery Service and
 * Migration Hub. You must call `GetHomeRegion` at least once before you call any
 * other AWS Application Discovery Service and AWS Migration Hub APIs, to obtain the account's
 * Migration Hub home region.
 */
export const getHomeRegion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetHomeRegionRequest,
  output: GetHomeRegionResult,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidInputException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * This API sets up the home region for the calling account only.
 */
export const createHomeRegionControl = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateHomeRegionControlRequest,
    output: CreateHomeRegionControlResult,
    errors: [
      AccessDeniedException,
      DryRunOperation,
      InternalServerError,
      InvalidInputException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * This operation deletes the home region configuration for the calling account. The operation does not delete discovery or migration tracking data in the home region.
 */
export const deleteHomeRegionControl = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteHomeRegionControlRequest,
    output: DeleteHomeRegionControlResult,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidInputException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
