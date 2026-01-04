import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({ sdkId: "odb", serviceShapeName: "Odb" });
const auth = T.AwsAuthSigv4({ name: "odb" });
const ver = T.ServiceVersion("2024-08-20");
const proto = T.AwsProtocolsAwsJson1_0();
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
                                url: "https://odb-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://odb-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://odb.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://odb.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetOciOnboardingStatusInput extends S.Class<GetOciOnboardingStatusInput>(
  "GetOciOnboardingStatusInput",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const TagKeys = S.Array(S.String);
export class AcceptMarketplaceRegistrationInput extends S.Class<AcceptMarketplaceRegistrationInput>(
  "AcceptMarketplaceRegistrationInput",
)(
  { marketplaceRegistrationToken: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AcceptMarketplaceRegistrationOutput extends S.Class<AcceptMarketplaceRegistrationOutput>(
  "AcceptMarketplaceRegistrationOutput",
)({}) {}
export class AssociateIamRoleToResourceInput extends S.Class<AssociateIamRoleToResourceInput>(
  "AssociateIamRoleToResourceInput",
)(
  { iamRoleArn: S.String, awsIntegration: S.String, resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateIamRoleToResourceOutput extends S.Class<AssociateIamRoleToResourceOutput>(
  "AssociateIamRoleToResourceOutput",
)({}) {}
export class DisassociateIamRoleFromResourceInput extends S.Class<DisassociateIamRoleFromResourceInput>(
  "DisassociateIamRoleFromResourceInput",
)(
  { iamRoleArn: S.String, awsIntegration: S.String, resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateIamRoleFromResourceOutput extends S.Class<DisassociateIamRoleFromResourceOutput>(
  "DisassociateIamRoleFromResourceOutput",
)({}) {}
export class InitializeServiceInput extends S.Class<InitializeServiceInput>(
  "InitializeServiceInput",
)(
  { ociIdentityDomain: S.optional(S.Boolean) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class InitializeServiceOutput extends S.Class<InitializeServiceOutput>(
  "InitializeServiceOutput",
)({}) {}
export class ListDbSystemShapesInput extends S.Class<ListDbSystemShapesInput>(
  "ListDbSystemShapesInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    availabilityZone: S.optional(S.String),
    availabilityZoneId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListGiVersionsInput extends S.Class<ListGiVersionsInput>(
  "ListGiVersionsInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    shape: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSystemVersionsInput extends S.Class<ListSystemVersionsInput>(
  "ListSystemVersionsInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    giVersion: S.String,
    shape: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()), tagKeys: TagKeys },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class OciIdentityDomain extends S.Class<OciIdentityDomain>(
  "OciIdentityDomain",
)({
  ociIdentityDomainId: S.optional(S.String),
  ociIdentityDomainResourceUrl: S.optional(S.String),
  ociIdentityDomainUrl: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  accountSetupCloudFormationUrl: S.optional(S.String),
}) {}
export const RequestTagMap = S.Record({ key: S.String, value: S.String });
export class GetOciOnboardingStatusOutput extends S.Class<GetOciOnboardingStatusOutput>(
  "GetOciOnboardingStatusOutput",
)({
  status: S.optional(S.String),
  existingTenancyActivationLink: S.optional(S.String),
  newTenancyActivationLink: S.optional(S.String),
  ociIdentityDomain: S.optional(OciIdentityDomain),
}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String, tags: RequestTagMap },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export const StringList = S.Array(S.String);
export class DbSystemShapeSummary extends S.Class<DbSystemShapeSummary>(
  "DbSystemShapeSummary",
)({
  availableCoreCount: S.optional(S.Number),
  availableCoreCountPerNode: S.optional(S.Number),
  availableDataStorageInTBs: S.optional(S.Number),
  availableDataStoragePerServerInTBs: S.optional(S.Number),
  availableDbNodePerNodeInGBs: S.optional(S.Number),
  availableDbNodeStorageInGBs: S.optional(S.Number),
  availableMemoryInGBs: S.optional(S.Number),
  availableMemoryPerNodeInGBs: S.optional(S.Number),
  coreCountIncrement: S.optional(S.Number),
  maxStorageCount: S.optional(S.Number),
  maximumNodeCount: S.optional(S.Number),
  minCoreCountPerNode: S.optional(S.Number),
  minDataStorageInTBs: S.optional(S.Number),
  minDbNodeStoragePerNodeInGBs: S.optional(S.Number),
  minMemoryPerNodeInGBs: S.optional(S.Number),
  minStorageCount: S.optional(S.Number),
  minimumCoreCount: S.optional(S.Number),
  minimumNodeCount: S.optional(S.Number),
  runtimeMinimumCoreCount: S.optional(S.Number),
  shapeFamily: S.optional(S.String),
  shapeType: S.optional(S.String),
  name: S.optional(S.String),
  computeModel: S.optional(S.String),
  areServerTypesSupported: S.optional(S.Boolean),
}) {}
export const DbSystemShapeList = S.Array(DbSystemShapeSummary);
export class GiVersionSummary extends S.Class<GiVersionSummary>(
  "GiVersionSummary",
)({ version: S.optional(S.String) }) {}
export const GiVersionList = S.Array(GiVersionSummary);
export class SystemVersionSummary extends S.Class<SystemVersionSummary>(
  "SystemVersionSummary",
)({
  giVersion: S.optional(S.String),
  shape: S.optional(S.String),
  systemVersions: S.optional(StringList),
}) {}
export const SystemVersionList = S.Array(SystemVersionSummary);
export const ResponseTagMap = S.Record({ key: S.String, value: S.String });
export class ListDbSystemShapesOutput extends S.Class<ListDbSystemShapesOutput>(
  "ListDbSystemShapesOutput",
)({ nextToken: S.optional(S.String), dbSystemShapes: DbSystemShapeList }) {}
export class ListGiVersionsOutput extends S.Class<ListGiVersionsOutput>(
  "ListGiVersionsOutput",
)({ nextToken: S.optional(S.String), giVersions: GiVersionList }) {}
export class ListSystemVersionsOutput extends S.Class<ListSystemVersionsOutput>(
  "ListSystemVersionsOutput",
)({ nextToken: S.optional(S.String), systemVersions: SystemVersionList }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(ResponseTagMap) }) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    quotaCode: S.String,
  },
) {}

//# Operations
/**
 * Associates an Amazon Web Services Identity and Access Management (IAM) service role with a specified resource to enable Amazon Web Services service integration.
 */
export const associateIamRoleToResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateIamRoleToResourceInput,
    output: AssociateIamRoleToResourceOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Disassociates an Amazon Web Services Identity and Access Management (IAM) service role from a specified resource to disable Amazon Web Services service integration.
 */
export const disassociateIamRoleFromResource =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateIamRoleFromResourceInput,
    output: DisassociateIamRoleFromResourceOutput,
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
 * Returns the tenancy activation link and onboarding status for your Amazon Web Services account.
 */
export const getOciOnboardingStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetOciOnboardingStatusInput,
    output: GetOciOnboardingStatusOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Initializes the ODB service for the first time in an account.
 */
export const initializeService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InitializeServiceInput,
  output: InitializeServiceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Returns information about the shapes that are available for an Exadata infrastructure.
 */
export const listDbSystemShapes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDbSystemShapesInput,
  output: ListDbSystemShapesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about Oracle Grid Infrastructure (GI) software versions that are available for a VM cluster for the specified shape.
 */
export const listGiVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListGiVersionsInput,
  output: ListGiVersionsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about the system versions that are available for a VM cluster for the specified `giVersion` and `shape`.
 */
export const listSystemVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSystemVersionsInput,
  output: ListSystemVersionsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about the tags applied to this resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Applies tags to the specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ResourceNotFoundException, ServiceQuotaExceededException],
}));
/**
 * Registers the Amazon Web Services Marketplace token for your Amazon Web Services account to activate your Oracle Database@Amazon Web Services subscription.
 */
export const acceptMarketplaceRegistration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AcceptMarketplaceRegistrationInput,
    output: AcceptMarketplaceRegistrationOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
