import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Pca Connector Scep",
  serviceShapeName: "PcaConnectorScep",
});
const auth = T.AwsAuthSigv4({ name: "pca-connector-scep" });
const ver = T.ServiceVersion("2018-05-10");
const proto = T.AwsProtocolsRestJson1();
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
          conditions: [],
          rules: [
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
              endpoint: {
                url: { ref: "Endpoint" },
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
      rules: [
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                                "supportsFIPS",
                              ],
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://pca-connector-scep-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://pca-connector-scep-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://pca-connector-scep.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://pca-connector-scep.{Region}.{PartitionResult#dnsSuffix}",
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
          ],
          type: "tree",
        },
        {
          conditions: [],
          error: "Invalid Configuration: Missing Region",
          type: "error",
        },
      ],
      type: "tree",
    },
  ],
});

//# Schemas
export const TagKeyList = S.Array(S.String);
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class CreateChallengeRequest extends S.Class<CreateChallengeRequest>(
  "CreateChallengeRequest",
)(
  {
    ConnectorArn: S.String,
    ClientToken: S.optional(S.String),
    Tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/challenges" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetChallengeMetadataRequest extends S.Class<GetChallengeMetadataRequest>(
  "GetChallengeMetadataRequest",
)(
  { ChallengeArn: S.String.pipe(T.HttpLabel("ChallengeArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/challengeMetadata/{ChallengeArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteChallengeRequest extends S.Class<DeleteChallengeRequest>(
  "DeleteChallengeRequest",
)(
  { ChallengeArn: S.String.pipe(T.HttpLabel("ChallengeArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/challenges/{ChallengeArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteChallengeResponse extends S.Class<DeleteChallengeResponse>(
  "DeleteChallengeResponse",
)({}) {}
export class ListChallengeMetadataRequest extends S.Class<ListChallengeMetadataRequest>(
  "ListChallengeMetadataRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    ConnectorArn: S.String.pipe(T.HttpQuery("ConnectorArn")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/challengeMetadata" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetChallengePasswordRequest extends S.Class<GetChallengePasswordRequest>(
  "GetChallengePasswordRequest",
)(
  { ChallengeArn: S.String.pipe(T.HttpLabel("ChallengeArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/challengePasswords/{ChallengeArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConnectorRequest extends S.Class<GetConnectorRequest>(
  "GetConnectorRequest",
)(
  { ConnectorArn: S.String.pipe(T.HttpLabel("ConnectorArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/connectors/{ConnectorArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConnectorRequest extends S.Class<DeleteConnectorRequest>(
  "DeleteConnectorRequest",
)(
  { ConnectorArn: S.String.pipe(T.HttpLabel("ConnectorArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/connectors/{ConnectorArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConnectorResponse extends S.Class<DeleteConnectorResponse>(
  "DeleteConnectorResponse",
)({}) {}
export class ListConnectorsRequest extends S.Class<ListConnectorsRequest>(
  "ListConnectorsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/connectors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(Tags) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")), Tags: Tags },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class GetChallengePasswordResponse extends S.Class<GetChallengePasswordResponse>(
  "GetChallengePasswordResponse",
)({ Password: S.optional(S.String) }) {}
export class IntuneConfiguration extends S.Class<IntuneConfiguration>(
  "IntuneConfiguration",
)({ AzureApplicationId: S.String, Domain: S.String }) {}
export class Challenge extends S.Class<Challenge>("Challenge")({
  Arn: S.optional(S.String),
  ConnectorArn: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Password: S.optional(S.String),
}) {}
export class ChallengeMetadata extends S.Class<ChallengeMetadata>(
  "ChallengeMetadata",
)({
  Arn: S.optional(S.String),
  ConnectorArn: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ChallengeMetadataSummary extends S.Class<ChallengeMetadataSummary>(
  "ChallengeMetadataSummary",
)({
  Arn: S.optional(S.String),
  ConnectorArn: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ChallengeMetadataList = S.Array(ChallengeMetadataSummary);
export const MobileDeviceManagement = S.Union(
  S.Struct({ Intune: IntuneConfiguration }),
);
export class OpenIdConfiguration extends S.Class<OpenIdConfiguration>(
  "OpenIdConfiguration",
)({
  Issuer: S.optional(S.String),
  Subject: S.optional(S.String),
  Audience: S.optional(S.String),
}) {}
export class ConnectorSummary extends S.Class<ConnectorSummary>(
  "ConnectorSummary",
)({
  Arn: S.optional(S.String),
  CertificateAuthorityArn: S.optional(S.String),
  Type: S.optional(S.String),
  MobileDeviceManagement: S.optional(MobileDeviceManagement),
  OpenIdConfiguration: S.optional(OpenIdConfiguration),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  Endpoint: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ConnectorList = S.Array(ConnectorSummary);
export class CreateChallengeResponse extends S.Class<CreateChallengeResponse>(
  "CreateChallengeResponse",
)({ Challenge: S.optional(Challenge) }) {}
export class GetChallengeMetadataResponse extends S.Class<GetChallengeMetadataResponse>(
  "GetChallengeMetadataResponse",
)({ ChallengeMetadata: S.optional(ChallengeMetadata) }) {}
export class ListChallengeMetadataResponse extends S.Class<ListChallengeMetadataResponse>(
  "ListChallengeMetadataResponse",
)({
  Challenges: S.optional(ChallengeMetadataList),
  NextToken: S.optional(S.String),
}) {}
export class CreateConnectorRequest extends S.Class<CreateConnectorRequest>(
  "CreateConnectorRequest",
)(
  {
    CertificateAuthorityArn: S.String,
    MobileDeviceManagement: S.optional(MobileDeviceManagement),
    ClientToken: S.optional(S.String),
    Tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/connectors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConnectorsResponse extends S.Class<ListConnectorsResponse>(
  "ListConnectorsResponse",
)({ Connectors: S.optional(ConnectorList), NextToken: S.optional(S.String) }) {}
export class Connector extends S.Class<Connector>("Connector")({
  Arn: S.optional(S.String),
  CertificateAuthorityArn: S.optional(S.String),
  Type: S.optional(S.String),
  MobileDeviceManagement: S.optional(MobileDeviceManagement),
  OpenIdConfiguration: S.optional(OpenIdConfiguration),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  Endpoint: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateConnectorResponse extends S.Class<CreateConnectorResponse>(
  "CreateConnectorResponse",
)({ ConnectorArn: S.optional(S.String) }) {}
export class GetConnectorResponse extends S.Class<GetConnectorResponse>(
  "GetConnectorResponse",
)({ Connector: S.optional(Connector) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.String,
    ResourceType: S.String,
    ServiceCode: S.String,
    QuotaCode: S.String,
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.String, Reason: S.optional(S.String) },
) {}

//# Operations
/**
 * Lists the connectors belonging to your Amazon Web Services account.
 */
export const listConnectors = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListConnectorsRequest,
    output: ListConnectorsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Connectors",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Creates a SCEP connector. A SCEP connector links Amazon Web Services Private Certificate Authority to your SCEP-compatible devices and mobile device management (MDM) systems. Before you create a connector, you must complete a set of prerequisites, including creation of a private certificate authority (CA) to use with this connector. For more information, see Connector for SCEP prerequisites.
 */
export const createConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConnectorRequest,
  output: CreateConnectorResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the metadata for the specified Challenge.
 */
export const getChallengeMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetChallengeMetadataRequest,
    output: GetChallengeMetadataResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves the challenge metadata for the specified ARN.
 */
export const listChallengeMetadata =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListChallengeMetadataRequest,
    output: ListChallengeMetadataResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Challenges",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Deletes the specified Challenge.
 */
export const deleteChallenge = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChallengeRequest,
  output: DeleteChallengeResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the challenge password for the specified Challenge.
 */
export const getChallengePassword = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetChallengePasswordRequest,
    output: GetChallengePasswordResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves the tags associated with the specified resource. Tags are key-value pairs that
 * you can use to categorize and manage your resources, for purposes like billing. For
 * example, you might set the tag key to "customer" and the value to the customer name or ID.
 * You can specify one or more tags to add to each Amazon Web Services resource, up to 50 tags for a
 * resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds one or more tags to your resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified Connector. This operation also deletes any challenges associated with the connector.
 */
export const deleteConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectorRequest,
  output: DeleteConnectorResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes one or more tags from your resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves details about the specified Connector. Calling this action returns important details about the connector, such as the public SCEP URL where your clients can request certificates.
 */
export const getConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectorRequest,
  output: GetConnectorResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * For general-purpose connectors. Creates a *challenge password* for the specified connector. The SCEP protocol uses a challenge password to authenticate a request before issuing a certificate from a certificate authority (CA). Your SCEP clients include the challenge password as part of their certificate request to Connector for SCEP. To retrieve the connector Amazon Resource Names (ARNs) for the connectors in your account, call ListConnectors.
 *
 * To create additional challenge passwords for the connector, call `CreateChallenge` again. We recommend frequently rotating your challenge passwords.
 */
export const createChallenge = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChallengeRequest,
  output: CreateChallengeResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
