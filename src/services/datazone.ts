import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "DataZone",
  serviceShapeName: "DataZone",
});
const auth = T.AwsAuthSigv4({ name: "datazone" });
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
                {
                  fn: "booleanEquals",
                  argv: [
                    true,
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "supportsDualStack"],
                    },
                  ],
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
                          endpoint: {
                            url: "https://datazone-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                  conditions: [],
                  endpoint: {
                    url: "https://datazone.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://datazone-fips.{Region}.{PartitionResult#dnsSuffix}",
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
              conditions: [],
              endpoint: {
                url: "https://datazone.{Region}.{PartitionResult#dnsSuffix}",
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
export const GovernedGlossaryTerms = S.Array(S.String);
export const AttributesList = S.Array(S.String);
export const GlossaryTerms = S.Array(S.String);
export const AuthorizedPrincipalIdentifiers = S.Array(S.String);
export const ApplicableAssetTypes = S.Array(S.String);
export const NotificationSubjects = S.Array(S.String);
export const SearchOutputAdditionalAttributes = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class FormInput extends S.Class<FormInput>("FormInput")({
  formName: S.String,
  typeIdentifier: S.optional(S.String),
  typeRevision: S.optional(S.String),
  content: S.optional(S.String),
}) {}
export const FormInputList = S.Array(FormInput);
export const EnabledRegionList = S.Array(S.String);
export const GlossaryUsageRestrictions = S.Array(S.String);
export const MetadataGenerationRunTypes = S.Array(S.String);
export const ProjectIds = S.Array(S.String);
export const AssetTypeIdentifiers = S.Array(S.String);
export class AssociateEnvironmentRoleInput extends S.Class<AssociateEnvironmentRoleInput>(
  "AssociateEnvironmentRoleInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    environmentRoleArn: S.String.pipe(T.HttpLabel("environmentRoleArn")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/roles/{environmentRoleArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateEnvironmentRoleOutput extends S.Class<AssociateEnvironmentRoleOutput>(
  "AssociateEnvironmentRoleOutput",
)({}) {}
export class AssociateGovernedTermsInput extends S.Class<AssociateGovernedTermsInput>(
  "AssociateGovernedTermsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    governedGlossaryTerms: GovernedGlossaryTerms,
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/domains/{domainIdentifier}/entities/{entityType}/{entityIdentifier}/associate-governed-terms",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateGovernedTermsOutput extends S.Class<AssociateGovernedTermsOutput>(
  "AssociateGovernedTermsOutput",
)({}) {}
export class BatchGetAttributesMetadataInput extends S.Class<BatchGetAttributesMetadataInput>(
  "BatchGetAttributesMetadataInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    entityRevision: S.optional(S.String).pipe(T.HttpQuery("entityRevision")),
    attributeIdentifiers: AttributesList.pipe(
      T.HttpQuery("attributeIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/entities/{entityType}/{entityIdentifier}/attributes-metadata",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelSubscriptionInput extends S.Class<CancelSubscriptionInput>(
  "CancelSubscriptionInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v2/domains/{domainIdentifier}/subscriptions/{identifier}/cancel",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EnvironmentParameter extends S.Class<EnvironmentParameter>(
  "EnvironmentParameter",
)({ name: S.optional(S.String), value: S.optional(S.String) }) {}
export const EnvironmentParametersList = S.Array(EnvironmentParameter);
export class CreateEnvironmentProfileInput extends S.Class<CreateEnvironmentProfileInput>(
  "CreateEnvironmentProfileInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: S.String,
    description: S.optional(S.String),
    environmentBlueprintIdentifier: S.String,
    projectIdentifier: S.String,
    userParameters: S.optional(EnvironmentParametersList),
    awsAccountId: S.optional(S.String),
    awsAccountRegion: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/environment-profiles",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateGroupProfileInput extends S.Class<CreateGroupProfileInput>(
  "CreateGroupProfileInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    groupIdentifier: S.String,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/group-profiles",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateListingChangeSetInput extends S.Class<CreateListingChangeSetInput>(
  "CreateListingChangeSetInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityIdentifier: S.String,
    entityType: S.String,
    entityRevision: S.optional(S.String),
    action: S.String,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/listings/change-set",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateUserProfileInput extends S.Class<CreateUserProfileInput>(
  "CreateUserProfileInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    userIdentifier: S.String,
    userType: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/user-profiles",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccountPoolInput extends S.Class<DeleteAccountPoolInput>(
  "DeleteAccountPoolInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/account-pools/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccountPoolOutput extends S.Class<DeleteAccountPoolOutput>(
  "DeleteAccountPoolOutput",
)({}) {}
export class DeleteAssetFilterInput extends S.Class<DeleteAssetFilterInput>(
  "DeleteAssetFilterInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    assetIdentifier: S.String.pipe(T.HttpLabel("assetIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/assets/{assetIdentifier}/filters/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAssetFilterResponse extends S.Class<DeleteAssetFilterResponse>(
  "DeleteAssetFilterResponse",
)({}) {}
export class DeleteConnectionInput extends S.Class<DeleteConnectionInput>(
  "DeleteConnectionInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/connections/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEnvironmentInput extends S.Class<DeleteEnvironmentInput>(
  "DeleteEnvironmentInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/environments/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEnvironmentResponse extends S.Class<DeleteEnvironmentResponse>(
  "DeleteEnvironmentResponse",
)({}) {}
export class DeleteEnvironmentActionInput extends S.Class<DeleteEnvironmentActionInput>(
  "DeleteEnvironmentActionInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/actions/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEnvironmentActionResponse extends S.Class<DeleteEnvironmentActionResponse>(
  "DeleteEnvironmentActionResponse",
)({}) {}
export class DeleteEnvironmentBlueprintInput extends S.Class<DeleteEnvironmentBlueprintInput>(
  "DeleteEnvironmentBlueprintInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/environment-blueprints/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEnvironmentBlueprintResponse extends S.Class<DeleteEnvironmentBlueprintResponse>(
  "DeleteEnvironmentBlueprintResponse",
)({}) {}
export class DeleteEnvironmentProfileInput extends S.Class<DeleteEnvironmentProfileInput>(
  "DeleteEnvironmentProfileInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/environment-profiles/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEnvironmentProfileResponse extends S.Class<DeleteEnvironmentProfileResponse>(
  "DeleteEnvironmentProfileResponse",
)({}) {}
export class DeleteProjectInput extends S.Class<DeleteProjectInput>(
  "DeleteProjectInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    skipDeletionCheck: S.optional(S.Boolean).pipe(
      T.HttpQuery("skipDeletionCheck"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/projects/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProjectOutput extends S.Class<DeleteProjectOutput>(
  "DeleteProjectOutput",
)({}) {}
export const Member = S.Union(
  S.Struct({ userIdentifier: S.String }),
  S.Struct({ groupIdentifier: S.String }),
);
export class DeleteProjectMembershipInput extends S.Class<DeleteProjectMembershipInput>(
  "DeleteProjectMembershipInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    projectIdentifier: S.String.pipe(T.HttpLabel("projectIdentifier")),
    member: Member,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/projects/{projectIdentifier}/deleteMembership",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProjectMembershipOutput extends S.Class<DeleteProjectMembershipOutput>(
  "DeleteProjectMembershipOutput",
)({}) {}
export class DeleteProjectProfileInput extends S.Class<DeleteProjectProfileInput>(
  "DeleteProjectProfileInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/project-profiles/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProjectProfileOutput extends S.Class<DeleteProjectProfileOutput>(
  "DeleteProjectProfileOutput",
)({}) {}
export class DeleteSubscriptionGrantInput extends S.Class<DeleteSubscriptionGrantInput>(
  "DeleteSubscriptionGrantInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/subscription-grants/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSubscriptionRequestInput extends S.Class<DeleteSubscriptionRequestInput>(
  "DeleteSubscriptionRequestInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/subscription-requests/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSubscriptionRequestResponse extends S.Class<DeleteSubscriptionRequestResponse>(
  "DeleteSubscriptionRequestResponse",
)({}) {}
export class DeleteSubscriptionTargetInput extends S.Class<DeleteSubscriptionTargetInput>(
  "DeleteSubscriptionTargetInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/subscription-targets/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSubscriptionTargetResponse extends S.Class<DeleteSubscriptionTargetResponse>(
  "DeleteSubscriptionTargetResponse",
)({}) {}
export class DeleteTimeSeriesDataPointsInput extends S.Class<DeleteTimeSeriesDataPointsInput>(
  "DeleteTimeSeriesDataPointsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    formName: S.String.pipe(T.HttpQuery("formName")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/entities/{entityType}/{entityIdentifier}/time-series-data-points",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTimeSeriesDataPointsOutput extends S.Class<DeleteTimeSeriesDataPointsOutput>(
  "DeleteTimeSeriesDataPointsOutput",
)({}) {}
export class DisassociateEnvironmentRoleInput extends S.Class<DisassociateEnvironmentRoleInput>(
  "DisassociateEnvironmentRoleInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    environmentRoleArn: S.String.pipe(T.HttpLabel("environmentRoleArn")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/roles/{environmentRoleArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateEnvironmentRoleOutput extends S.Class<DisassociateEnvironmentRoleOutput>(
  "DisassociateEnvironmentRoleOutput",
)({}) {}
export class DisassociateGovernedTermsInput extends S.Class<DisassociateGovernedTermsInput>(
  "DisassociateGovernedTermsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    governedGlossaryTerms: GovernedGlossaryTerms,
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/domains/{domainIdentifier}/entities/{entityType}/{entityIdentifier}/disassociate-governed-terms",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateGovernedTermsOutput extends S.Class<DisassociateGovernedTermsOutput>(
  "DisassociateGovernedTermsOutput",
)({}) {}
export class GetAccountPoolInput extends S.Class<GetAccountPoolInput>(
  "GetAccountPoolInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/account-pools/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAssetFilterInput extends S.Class<GetAssetFilterInput>(
  "GetAssetFilterInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    assetIdentifier: S.String.pipe(T.HttpLabel("assetIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/assets/{assetIdentifier}/filters/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConnectionInput extends S.Class<GetConnectionInput>(
  "GetConnectionInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    withSecret: S.optional(S.Boolean).pipe(T.HttpQuery("withSecret")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/connections/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataExportConfigurationInput extends S.Class<GetDataExportConfigurationInput>(
  "GetDataExportConfigurationInput",
)(
  { domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/data-export-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEnvironmentInput extends S.Class<GetEnvironmentInput>(
  "GetEnvironmentInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/environments/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEnvironmentActionInput extends S.Class<GetEnvironmentActionInput>(
  "GetEnvironmentActionInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/actions/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEnvironmentBlueprintInput extends S.Class<GetEnvironmentBlueprintInput>(
  "GetEnvironmentBlueprintInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/environment-blueprints/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEnvironmentCredentialsInput extends S.Class<GetEnvironmentCredentialsInput>(
  "GetEnvironmentCredentialsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/credentials",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEnvironmentProfileInput extends S.Class<GetEnvironmentProfileInput>(
  "GetEnvironmentProfileInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/environment-profiles/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetGroupProfileInput extends S.Class<GetGroupProfileInput>(
  "GetGroupProfileInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    groupIdentifier: S.String.pipe(T.HttpLabel("groupIdentifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/group-profiles/{groupIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIamPortalLoginUrlInput extends S.Class<GetIamPortalLoginUrlInput>(
  "GetIamPortalLoginUrlInput",
)(
  { domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/get-portal-login-url",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetJobRunInput extends S.Class<GetJobRunInput>("GetJobRunInput")(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/jobRuns/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLineageEventInput extends S.Class<GetLineageEventInput>(
  "GetLineageEventInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/lineage/events/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLineageNodeInput extends S.Class<GetLineageNodeInput>(
  "GetLineageNodeInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    eventTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("timestamp")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/lineage/nodes/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetProjectInput extends S.Class<GetProjectInput>(
  "GetProjectInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/projects/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetProjectProfileInput extends S.Class<GetProjectProfileInput>(
  "GetProjectProfileInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/project-profiles/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSubscriptionInput extends S.Class<GetSubscriptionInput>(
  "GetSubscriptionInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/subscriptions/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSubscriptionGrantInput extends S.Class<GetSubscriptionGrantInput>(
  "GetSubscriptionGrantInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/subscription-grants/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSubscriptionRequestDetailsInput extends S.Class<GetSubscriptionRequestDetailsInput>(
  "GetSubscriptionRequestDetailsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/subscription-requests/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSubscriptionTargetInput extends S.Class<GetSubscriptionTargetInput>(
  "GetSubscriptionTargetInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/subscription-targets/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTimeSeriesDataPointInput extends S.Class<GetTimeSeriesDataPointInput>(
  "GetTimeSeriesDataPointInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    formName: S.String.pipe(T.HttpQuery("formName")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/entities/{entityType}/{entityIdentifier}/time-series-data-points/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetUserProfileInput extends S.Class<GetUserProfileInput>(
  "GetUserProfileInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    userIdentifier: S.String.pipe(T.HttpLabel("userIdentifier")),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/user-profiles/{userIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAccountPoolsInput extends S.Class<ListAccountPoolsInput>(
  "ListAccountPoolsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/account-pools",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAccountsInAccountPoolInput extends S.Class<ListAccountsInAccountPoolInput>(
  "ListAccountsInAccountPoolInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/account-pools/{identifier}/accounts",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssetFiltersInput extends S.Class<ListAssetFiltersInput>(
  "ListAssetFiltersInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    assetIdentifier: S.String.pipe(T.HttpLabel("assetIdentifier")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/assets/{assetIdentifier}/filters",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssetRevisionsInput extends S.Class<ListAssetRevisionsInput>(
  "ListAssetRevisionsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/assets/{identifier}/revisions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConnectionsInput extends S.Class<ListConnectionsInput>(
  "ListConnectionsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    environmentIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("environmentIdentifier"),
    ),
    projectIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("projectIdentifier"),
    ),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
    scope: S.optional(S.String).pipe(T.HttpQuery("scope")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/connections",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataProductRevisionsInput extends S.Class<ListDataProductRevisionsInput>(
  "ListDataProductRevisionsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/data-products/{identifier}/revisions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataSourceRunActivitiesInput extends S.Class<ListDataSourceRunActivitiesInput>(
  "ListDataSourceRunActivitiesInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/data-source-runs/{identifier}/activities",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEntityOwnersInput extends S.Class<ListEntityOwnersInput>(
  "ListEntityOwnersInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/entities/{entityType}/{entityIdentifier}/owners",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEnvironmentActionsInput extends S.Class<ListEnvironmentActionsInput>(
  "ListEnvironmentActionsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/actions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEnvironmentBlueprintsInput extends S.Class<ListEnvironmentBlueprintsInput>(
  "ListEnvironmentBlueprintsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    managed: S.optional(S.Boolean).pipe(T.HttpQuery("managed")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/environment-blueprints",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEnvironmentProfilesInput extends S.Class<ListEnvironmentProfilesInput>(
  "ListEnvironmentProfilesInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    awsAccountId: S.optional(S.String).pipe(T.HttpQuery("awsAccountId")),
    awsAccountRegion: S.optional(S.String).pipe(
      T.HttpQuery("awsAccountRegion"),
    ),
    environmentBlueprintIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("environmentBlueprintIdentifier"),
    ),
    projectIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("projectIdentifier"),
    ),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/environment-profiles",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEnvironmentsInput extends S.Class<ListEnvironmentsInput>(
  "ListEnvironmentsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    awsAccountId: S.optional(S.String).pipe(T.HttpQuery("awsAccountId")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    awsAccountRegion: S.optional(S.String).pipe(
      T.HttpQuery("awsAccountRegion"),
    ),
    projectIdentifier: S.String.pipe(T.HttpQuery("projectIdentifier")),
    environmentProfileIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("environmentProfileIdentifier"),
    ),
    environmentBlueprintIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("environmentBlueprintIdentifier"),
    ),
    provider: S.optional(S.String).pipe(T.HttpQuery("provider")),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/environments",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListJobRunsInput extends S.Class<ListJobRunsInput>(
  "ListJobRunsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    jobIdentifier: S.String.pipe(T.HttpLabel("jobIdentifier")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/jobs/{jobIdentifier}/runs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLineageEventsInput extends S.Class<ListLineageEventsInput>(
  "ListLineageEventsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    timestampAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("timestampAfter")),
    timestampBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("timestampBefore")),
    processingStatus: S.optional(S.String).pipe(
      T.HttpQuery("processingStatus"),
    ),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/lineage/events",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLineageNodeHistoryInput extends S.Class<ListLineageNodeHistoryInput>(
  "ListLineageNodeHistoryInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    direction: S.optional(S.String).pipe(T.HttpQuery("direction")),
    eventTimestampGTE: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("timestampGTE")),
    eventTimestampLTE: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("timestampLTE")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/lineage/nodes/{identifier}/history",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListNotificationsInput extends S.Class<ListNotificationsInput>(
  "ListNotificationsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    type: S.String.pipe(T.HttpQuery("type")),
    afterTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("afterTimestamp")),
    beforeTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("beforeTimestamp")),
    subjects: S.optional(NotificationSubjects).pipe(T.HttpQuery("subjects")),
    taskStatus: S.optional(S.String).pipe(T.HttpQuery("taskStatus")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/notifications",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPolicyGrantsInput extends S.Class<ListPolicyGrantsInput>(
  "ListPolicyGrantsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    policyType: S.String.pipe(T.HttpQuery("policyType")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/policies/managed/{entityType}/{entityIdentifier}/grants",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProjectMembershipsInput extends S.Class<ListProjectMembershipsInput>(
  "ListProjectMembershipsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    projectIdentifier: S.String.pipe(T.HttpLabel("projectIdentifier")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/projects/{projectIdentifier}/memberships",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProjectProfilesInput extends S.Class<ListProjectProfilesInput>(
  "ListProjectProfilesInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/project-profiles",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProjectsInput extends S.Class<ListProjectsInput>(
  "ListProjectsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    userIdentifier: S.optional(S.String).pipe(T.HttpQuery("userIdentifier")),
    groupIdentifier: S.optional(S.String).pipe(T.HttpQuery("groupIdentifier")),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v2/domains/{domainIdentifier}/projects" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSubscriptionGrantsInput extends S.Class<ListSubscriptionGrantsInput>(
  "ListSubscriptionGrantsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentId: S.optional(S.String).pipe(T.HttpQuery("environmentId")),
    subscriptionTargetId: S.optional(S.String).pipe(
      T.HttpQuery("subscriptionTargetId"),
    ),
    subscribedListingId: S.optional(S.String).pipe(
      T.HttpQuery("subscribedListingId"),
    ),
    subscriptionId: S.optional(S.String).pipe(T.HttpQuery("subscriptionId")),
    owningProjectId: S.optional(S.String).pipe(T.HttpQuery("owningProjectId")),
    owningUserId: S.optional(S.String).pipe(T.HttpQuery("owningUserId")),
    owningGroupId: S.optional(S.String).pipe(T.HttpQuery("owningGroupId")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/subscription-grants",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSubscriptionRequestsInput extends S.Class<ListSubscriptionRequestsInput>(
  "ListSubscriptionRequestsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    subscribedListingId: S.optional(S.String).pipe(
      T.HttpQuery("subscribedListingId"),
    ),
    owningProjectId: S.optional(S.String).pipe(T.HttpQuery("owningProjectId")),
    approverProjectId: S.optional(S.String).pipe(
      T.HttpQuery("approverProjectId"),
    ),
    owningUserId: S.optional(S.String).pipe(T.HttpQuery("owningUserId")),
    owningGroupId: S.optional(S.String).pipe(T.HttpQuery("owningGroupId")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/subscription-requests",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSubscriptionsInput extends S.Class<ListSubscriptionsInput>(
  "ListSubscriptionsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    subscriptionRequestIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("subscriptionRequestIdentifier"),
    ),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    subscribedListingId: S.optional(S.String).pipe(
      T.HttpQuery("subscribedListingId"),
    ),
    owningProjectId: S.optional(S.String).pipe(T.HttpQuery("owningProjectId")),
    owningUserId: S.optional(S.String).pipe(T.HttpQuery("owningUserId")),
    owningGroupId: S.optional(S.String).pipe(T.HttpQuery("owningGroupId")),
    approverProjectId: S.optional(S.String).pipe(
      T.HttpQuery("approverProjectId"),
    ),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/subscriptions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSubscriptionTargetsInput extends S.Class<ListSubscriptionTargetsInput>(
  "ListSubscriptionTargetsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/subscription-targets",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTimeSeriesDataPointsInput extends S.Class<ListTimeSeriesDataPointsInput>(
  "ListTimeSeriesDataPointsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    formName: S.String.pipe(T.HttpQuery("formName")),
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("startedAt"),
    ),
    endedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("endedAt"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/entities/{entityType}/{entityIdentifier}/time-series-data-points",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PostLineageEventInput extends S.Class<PostLineageEventInput>(
  "PostLineageEventInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    event: T.StreamingInput.pipe(T.HttpPayload()),
    clientToken: S.optional(S.String).pipe(T.HttpHeader("Client-Token")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/lineage/events",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RejectSubscriptionRequestInput extends S.Class<RejectSubscriptionRequestInput>(
  "RejectSubscriptionRequestInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    decisionComment: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v2/domains/{domainIdentifier}/subscription-requests/{identifier}/reject",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class OwnerUserProperties extends S.Class<OwnerUserProperties>(
  "OwnerUserProperties",
)({ userIdentifier: S.String }) {}
export class OwnerGroupProperties extends S.Class<OwnerGroupProperties>(
  "OwnerGroupProperties",
)({ groupIdentifier: S.String }) {}
export const OwnerProperties = S.Union(
  S.Struct({ user: OwnerUserProperties }),
  S.Struct({ group: OwnerGroupProperties }),
);
export class RemoveEntityOwnerInput extends S.Class<RemoveEntityOwnerInput>(
  "RemoveEntityOwnerInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    owner: OwnerProperties,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/entities/{entityType}/{entityIdentifier}/removeOwner",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveEntityOwnerOutput extends S.Class<RemoveEntityOwnerOutput>(
  "RemoveEntityOwnerOutput",
)({}) {}
export class AllUsersGrantFilter extends S.Class<AllUsersGrantFilter>(
  "AllUsersGrantFilter",
)({}) {}
export const UserPolicyGrantPrincipal = S.Union(
  S.Struct({ userIdentifier: S.String }),
  S.Struct({ allUsersGrantFilter: AllUsersGrantFilter }),
);
export const GroupPolicyGrantPrincipal = S.Union(
  S.Struct({ groupIdentifier: S.String }),
);
export class DomainUnitFilterForProject extends S.Class<DomainUnitFilterForProject>(
  "DomainUnitFilterForProject",
)({ domainUnit: S.String, includeChildDomainUnits: S.optional(S.Boolean) }) {}
export const ProjectGrantFilter = S.Union(
  S.Struct({ domainUnitFilter: DomainUnitFilterForProject }),
);
export class ProjectPolicyGrantPrincipal extends S.Class<ProjectPolicyGrantPrincipal>(
  "ProjectPolicyGrantPrincipal",
)({
  projectDesignation: S.String,
  projectIdentifier: S.optional(S.String),
  projectGrantFilter: S.optional(ProjectGrantFilter),
}) {}
export class AllDomainUnitsGrantFilter extends S.Class<AllDomainUnitsGrantFilter>(
  "AllDomainUnitsGrantFilter",
)({}) {}
export const DomainUnitGrantFilter = S.Union(
  S.Struct({ allDomainUnitsGrantFilter: AllDomainUnitsGrantFilter }),
);
export class DomainUnitPolicyGrantPrincipal extends S.Class<DomainUnitPolicyGrantPrincipal>(
  "DomainUnitPolicyGrantPrincipal",
)({
  domainUnitDesignation: S.String,
  domainUnitIdentifier: S.optional(S.String),
  domainUnitGrantFilter: S.optional(DomainUnitGrantFilter),
}) {}
export const PolicyGrantPrincipal = S.Union(
  S.Struct({ user: UserPolicyGrantPrincipal }),
  S.Struct({ group: GroupPolicyGrantPrincipal }),
  S.Struct({ project: ProjectPolicyGrantPrincipal }),
  S.Struct({ domainUnit: DomainUnitPolicyGrantPrincipal }),
);
export class RemovePolicyGrantInput extends S.Class<RemovePolicyGrantInput>(
  "RemovePolicyGrantInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    policyType: S.String,
    principal: PolicyGrantPrincipal,
    grantIdentifier: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/policies/managed/{entityType}/{entityIdentifier}/removeGrant",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemovePolicyGrantOutput extends S.Class<RemovePolicyGrantOutput>(
  "RemovePolicyGrantOutput",
)({}) {}
export class RevokeSubscriptionInput extends S.Class<RevokeSubscriptionInput>(
  "RevokeSubscriptionInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    retainPermissions: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v2/domains/{domainIdentifier}/subscriptions/{identifier}/revoke",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchGroupProfilesInput extends S.Class<SearchGroupProfilesInput>(
  "SearchGroupProfilesInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    groupType: S.String,
    searchText: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/search-group-profiles",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchInItem extends S.Class<SearchInItem>("SearchInItem")({
  attribute: S.String,
}) {}
export const SearchInList = S.Array(SearchInItem);
export class Filter extends S.Class<Filter>("Filter")({
  attribute: S.String,
  value: S.String,
}) {}
export type FilterClause =
  | { filter: Filter }
  | { and: FilterList }
  | { or: FilterList };
export const FilterClause = S.Union(
  S.Struct({ filter: Filter }),
  S.Struct({ and: S.suspend(() => FilterList) }),
  S.Struct({ or: S.suspend(() => FilterList) }),
) as any as S.Schema<FilterClause>;
export class SearchSort extends S.Class<SearchSort>("SearchSort")({
  attribute: S.String,
  order: S.optional(S.String),
}) {}
export class SearchTypesInput extends S.Class<SearchTypesInput>(
  "SearchTypesInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    searchScope: S.String,
    searchText: S.optional(S.String),
    searchIn: S.optional(SearchInList),
    filters: S.optional(FilterClause),
    sort: S.optional(SearchSort),
    managed: S.Boolean,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/types-search",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchUserProfilesInput extends S.Class<SearchUserProfilesInput>(
  "SearchUserProfilesInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    userType: S.String,
    searchText: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/search-user-profiles",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: Tags },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export const AwsRegionList = S.Array(S.String);
export class AccountInfo extends S.Class<AccountInfo>("AccountInfo")({
  awsAccountId: S.String,
  supportedRegions: AwsRegionList,
  awsAccountName: S.optional(S.String),
}) {}
export const AccountInfoList = S.Array(AccountInfo);
export class CustomAccountPoolHandler extends S.Class<CustomAccountPoolHandler>(
  "CustomAccountPoolHandler",
)({
  lambdaFunctionArn: S.String,
  lambdaExecutionRoleArn: S.optional(S.String),
}) {}
export const AccountSource = S.Union(
  S.Struct({ accounts: AccountInfoList }),
  S.Struct({ customAccountPoolHandler: CustomAccountPoolHandler }),
);
export class UpdateAccountPoolInput extends S.Class<UpdateAccountPoolInput>(
  "UpdateAccountPoolInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    resolutionStrategy: S.optional(S.String),
    accountSource: S.optional(AccountSource),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/domains/{domainIdentifier}/account-pools/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ColumnNameList = S.Array(S.String);
export class ColumnFilterConfiguration extends S.Class<ColumnFilterConfiguration>(
  "ColumnFilterConfiguration",
)({ includedColumnNames: S.optional(ColumnNameList) }) {}
export class EqualToExpression extends S.Class<EqualToExpression>(
  "EqualToExpression",
)({ columnName: S.String, value: S.String }) {}
export class NotEqualToExpression extends S.Class<NotEqualToExpression>(
  "NotEqualToExpression",
)({ columnName: S.String, value: S.String }) {}
export class GreaterThanExpression extends S.Class<GreaterThanExpression>(
  "GreaterThanExpression",
)({ columnName: S.String, value: S.String }) {}
export class LessThanExpression extends S.Class<LessThanExpression>(
  "LessThanExpression",
)({ columnName: S.String, value: S.String }) {}
export class GreaterThanOrEqualToExpression extends S.Class<GreaterThanOrEqualToExpression>(
  "GreaterThanOrEqualToExpression",
)({ columnName: S.String, value: S.String }) {}
export class LessThanOrEqualToExpression extends S.Class<LessThanOrEqualToExpression>(
  "LessThanOrEqualToExpression",
)({ columnName: S.String, value: S.String }) {}
export class IsNullExpression extends S.Class<IsNullExpression>(
  "IsNullExpression",
)({ columnName: S.String }) {}
export class IsNotNullExpression extends S.Class<IsNotNullExpression>(
  "IsNotNullExpression",
)({ columnName: S.String }) {}
export const StringList = S.Array(S.String);
export class InExpression extends S.Class<InExpression>("InExpression")({
  columnName: S.String,
  values: StringList,
}) {}
export class NotInExpression extends S.Class<NotInExpression>(
  "NotInExpression",
)({ columnName: S.String, values: StringList }) {}
export class LikeExpression extends S.Class<LikeExpression>("LikeExpression")({
  columnName: S.String,
  value: S.String,
}) {}
export class NotLikeExpression extends S.Class<NotLikeExpression>(
  "NotLikeExpression",
)({ columnName: S.String, value: S.String }) {}
export const RowFilterExpression = S.Union(
  S.Struct({ equalTo: EqualToExpression }),
  S.Struct({ notEqualTo: NotEqualToExpression }),
  S.Struct({ greaterThan: GreaterThanExpression }),
  S.Struct({ lessThan: LessThanExpression }),
  S.Struct({ greaterThanOrEqualTo: GreaterThanOrEqualToExpression }),
  S.Struct({ lessThanOrEqualTo: LessThanOrEqualToExpression }),
  S.Struct({ isNull: IsNullExpression }),
  S.Struct({ isNotNull: IsNotNullExpression }),
  S.Struct({ in: InExpression }),
  S.Struct({ notIn: NotInExpression }),
  S.Struct({ like: LikeExpression }),
  S.Struct({ notLike: NotLikeExpression }),
);
export type RowFilter =
  | { expression: (typeof RowFilterExpression)["Type"] }
  | { and: RowFilterList }
  | { or: RowFilterList };
export const RowFilter = S.Union(
  S.Struct({ expression: RowFilterExpression }),
  S.Struct({ and: S.suspend(() => RowFilterList) }),
  S.Struct({ or: S.suspend(() => RowFilterList) }),
) as any as S.Schema<RowFilter>;
export class RowFilterConfiguration extends S.Class<RowFilterConfiguration>(
  "RowFilterConfiguration",
)({ rowFilter: RowFilter, sensitive: S.optional(S.Boolean) }) {}
export const AssetFilterConfiguration = S.Union(
  S.Struct({ columnConfiguration: ColumnFilterConfiguration }),
  S.Struct({ rowConfiguration: RowFilterConfiguration }),
);
export class UpdateAssetFilterInput extends S.Class<UpdateAssetFilterInput>(
  "UpdateAssetFilterInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    assetIdentifier: S.String.pipe(T.HttpLabel("assetIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    configuration: S.optional(AssetFilterConfiguration),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/domains/{domainIdentifier}/assets/{assetIdentifier}/filters/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEnvironmentInput extends S.Class<UpdateEnvironmentInput>(
  "UpdateEnvironmentInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    glossaryTerms: S.optional(GlossaryTerms),
    blueprintVersion: S.optional(S.String),
    userParameters: S.optional(EnvironmentParametersList),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/domains/{domainIdentifier}/environments/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AwsConsoleLinkParameters extends S.Class<AwsConsoleLinkParameters>(
  "AwsConsoleLinkParameters",
)({ uri: S.optional(S.String) }) {}
export const ActionParameters = S.Union(
  S.Struct({ awsConsoleLink: AwsConsoleLinkParameters }),
);
export class UpdateEnvironmentActionInput extends S.Class<UpdateEnvironmentActionInput>(
  "UpdateEnvironmentActionInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    parameters: S.optional(ActionParameters),
    name: S.optional(S.String),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/actions/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CloudFormationProperties extends S.Class<CloudFormationProperties>(
  "CloudFormationProperties",
)({ templateUrl: S.String }) {}
export const ProvisioningProperties = S.Union(
  S.Struct({ cloudFormation: CloudFormationProperties }),
);
export class CustomParameter extends S.Class<CustomParameter>(
  "CustomParameter",
)({
  keyName: S.String,
  description: S.optional(S.String),
  fieldType: S.String,
  defaultValue: S.optional(S.String),
  isEditable: S.optional(S.Boolean),
  isOptional: S.optional(S.Boolean),
  isUpdateSupported: S.optional(S.Boolean),
}) {}
export const CustomParameterList = S.Array(CustomParameter);
export class UpdateEnvironmentBlueprintInput extends S.Class<UpdateEnvironmentBlueprintInput>(
  "UpdateEnvironmentBlueprintInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    description: S.optional(S.String),
    provisioningProperties: S.optional(ProvisioningProperties),
    userParameters: S.optional(CustomParameterList),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/domains/{domainIdentifier}/environment-blueprints/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEnvironmentProfileInput extends S.Class<UpdateEnvironmentProfileInput>(
  "UpdateEnvironmentProfileInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    userParameters: S.optional(EnvironmentParametersList),
    awsAccountId: S.optional(S.String),
    awsAccountRegion: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/domains/{domainIdentifier}/environment-profiles/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateGroupProfileInput extends S.Class<UpdateGroupProfileInput>(
  "UpdateGroupProfileInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    groupIdentifier: S.String.pipe(T.HttpLabel("groupIdentifier")),
    status: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v2/domains/{domainIdentifier}/group-profiles/{groupIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResourceTagParameter extends S.Class<ResourceTagParameter>(
  "ResourceTagParameter",
)({ key: S.String, value: S.String, isValueEditable: S.Boolean }) {}
export const ProjectResourceTagParameters = S.Array(ResourceTagParameter);
export class EnvironmentConfigurationParameter extends S.Class<EnvironmentConfigurationParameter>(
  "EnvironmentConfigurationParameter",
)({
  name: S.optional(S.String),
  value: S.optional(S.String),
  isEditable: S.optional(S.Boolean),
}) {}
export const EnvironmentConfigurationParametersList = S.Array(
  EnvironmentConfigurationParameter,
);
export class EnvironmentConfigurationParametersDetails extends S.Class<EnvironmentConfigurationParametersDetails>(
  "EnvironmentConfigurationParametersDetails",
)({
  ssmPath: S.optional(S.String),
  parameterOverrides: S.optional(EnvironmentConfigurationParametersList),
  resolvedParameters: S.optional(EnvironmentConfigurationParametersList),
}) {}
export const AwsAccount = S.Union(
  S.Struct({ awsAccountId: S.String }),
  S.Struct({ awsAccountIdPath: S.String }),
);
export const AccountPoolList = S.Array(S.String);
export const Region = S.Union(
  S.Struct({ regionName: S.String }),
  S.Struct({ regionNamePath: S.String }),
);
export class EnvironmentConfiguration extends S.Class<EnvironmentConfiguration>(
  "EnvironmentConfiguration",
)({
  name: S.String,
  id: S.optional(S.String),
  environmentBlueprintId: S.String,
  description: S.optional(S.String),
  deploymentMode: S.optional(S.String),
  configurationParameters: S.optional(
    EnvironmentConfigurationParametersDetails,
  ),
  awsAccount: S.optional(AwsAccount),
  accountPools: S.optional(AccountPoolList),
  awsRegion: S.optional(Region),
  deploymentOrder: S.optional(S.Number),
}) {}
export const EnvironmentConfigurationsList = S.Array(EnvironmentConfiguration);
export class UpdateProjectProfileInput extends S.Class<UpdateProjectProfileInput>(
  "UpdateProjectProfileInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    status: S.optional(S.String),
    projectResourceTags: S.optional(ProjectResourceTagParameters),
    allowCustomProjectResourceTags: S.optional(S.Boolean),
    projectResourceTagsDescription: S.optional(S.String),
    environmentConfigurations: S.optional(EnvironmentConfigurationsList),
    domainUnitIdentifier: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/domains/{domainIdentifier}/project-profiles/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRootDomainUnitOwnerInput extends S.Class<UpdateRootDomainUnitOwnerInput>(
  "UpdateRootDomainUnitOwnerInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    currentOwner: S.String,
    newOwner: S.String,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/domains/{domainIdentifier}/root-domain-unit-owner",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRootDomainUnitOwnerOutput extends S.Class<UpdateRootDomainUnitOwnerOutput>(
  "UpdateRootDomainUnitOwnerOutput",
)({}) {}
export class UpdateSubscriptionRequestInput extends S.Class<UpdateSubscriptionRequestInput>(
  "UpdateSubscriptionRequestInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    requestReason: S.String,
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/domains/{domainIdentifier}/subscription-requests/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SubscriptionTargetForm extends S.Class<SubscriptionTargetForm>(
  "SubscriptionTargetForm",
)({ formName: S.String, content: S.String }) {}
export const SubscriptionTargetForms = S.Array(SubscriptionTargetForm);
export class UpdateSubscriptionTargetInput extends S.Class<UpdateSubscriptionTargetInput>(
  "UpdateSubscriptionTargetInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: S.optional(S.String),
    authorizedPrincipals: S.optional(AuthorizedPrincipalIdentifiers),
    applicableAssetTypes: S.optional(ApplicableAssetTypes),
    subscriptionTargetConfig: S.optional(SubscriptionTargetForms),
    manageAccessRole: S.optional(S.String),
    provider: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/subscription-targets/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateUserProfileInput extends S.Class<UpdateUserProfileInput>(
  "UpdateUserProfileInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    userIdentifier: S.String.pipe(T.HttpLabel("userIdentifier")),
    type: S.optional(S.String),
    status: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v2/domains/{domainIdentifier}/user-profiles/{userIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAssetInput extends S.Class<GetAssetInput>("GetAssetInput")(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    revision: S.optional(S.String).pipe(T.HttpQuery("revision")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/assets/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAssetInput extends S.Class<DeleteAssetInput>(
  "DeleteAssetInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/assets/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAssetOutput extends S.Class<DeleteAssetOutput>(
  "DeleteAssetOutput",
)({}) {}
export class BusinessNameGenerationConfiguration extends S.Class<BusinessNameGenerationConfiguration>(
  "BusinessNameGenerationConfiguration",
)({ enabled: S.optional(S.Boolean) }) {}
export class PredictionConfiguration extends S.Class<PredictionConfiguration>(
  "PredictionConfiguration",
)({
  businessNameGeneration: S.optional(BusinessNameGenerationConfiguration),
}) {}
export class CreateAssetRevisionInput extends S.Class<CreateAssetRevisionInput>(
  "CreateAssetRevisionInput",
)(
  {
    name: S.String,
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    typeRevision: S.optional(S.String),
    description: S.optional(S.String),
    glossaryTerms: S.optional(GlossaryTerms),
    formsInput: S.optional(FormInputList),
    predictionConfiguration: S.optional(PredictionConfiguration),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/assets/{identifier}/revisions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAssetTypeInput extends S.Class<DeleteAssetTypeInput>(
  "DeleteAssetTypeInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/asset-types/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAssetTypeOutput extends S.Class<DeleteAssetTypeOutput>(
  "DeleteAssetTypeOutput",
)({}) {}
export class GetAssetTypeInput extends S.Class<GetAssetTypeInput>(
  "GetAssetTypeInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    revision: S.optional(S.String).pipe(T.HttpQuery("revision")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/asset-types/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataProductInput extends S.Class<GetDataProductInput>(
  "GetDataProductInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    revision: S.optional(S.String).pipe(T.HttpQuery("revision")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/data-products/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDataProductInput extends S.Class<DeleteDataProductInput>(
  "DeleteDataProductInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/data-products/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDataProductOutput extends S.Class<DeleteDataProductOutput>(
  "DeleteDataProductOutput",
)({}) {}
export const ItemGlossaryTerms = S.Array(S.String);
export class DataProductItem extends S.Class<DataProductItem>(
  "DataProductItem",
)({
  itemType: S.String,
  identifier: S.String,
  revision: S.optional(S.String),
  glossaryTerms: S.optional(ItemGlossaryTerms),
}) {}
export const DataProductItems = S.Array(DataProductItem);
export class CreateDataProductRevisionInput extends S.Class<CreateDataProductRevisionInput>(
  "CreateDataProductRevisionInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: S.String,
    description: S.optional(S.String),
    glossaryTerms: S.optional(GlossaryTerms),
    items: S.optional(DataProductItems),
    formsInput: S.optional(FormInputList),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/data-products/{identifier}/revisions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataSourceInput extends S.Class<GetDataSourceInput>(
  "GetDataSourceInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/data-sources/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ScheduleConfiguration extends S.Class<ScheduleConfiguration>(
  "ScheduleConfiguration",
)({ timezone: S.optional(S.String), schedule: S.optional(S.String) }) {}
export class FilterExpression extends S.Class<FilterExpression>(
  "FilterExpression",
)({ type: S.String, expression: S.String }) {}
export const FilterExpressions = S.Array(FilterExpression);
export class RelationalFilterConfiguration extends S.Class<RelationalFilterConfiguration>(
  "RelationalFilterConfiguration",
)({
  databaseName: S.String,
  schemaName: S.optional(S.String),
  filterExpressions: S.optional(FilterExpressions),
}) {}
export const RelationalFilterConfigurations = S.Array(
  RelationalFilterConfiguration,
);
export class GlueRunConfigurationInput extends S.Class<GlueRunConfigurationInput>(
  "GlueRunConfigurationInput",
)({
  dataAccessRole: S.optional(S.String),
  relationalFilterConfigurations: RelationalFilterConfigurations,
  autoImportDataQualityResult: S.optional(S.Boolean),
  catalogName: S.optional(S.String),
}) {}
export class RedshiftCredentialConfiguration extends S.Class<RedshiftCredentialConfiguration>(
  "RedshiftCredentialConfiguration",
)({ secretManagerArn: S.String }) {}
export class RedshiftClusterStorage extends S.Class<RedshiftClusterStorage>(
  "RedshiftClusterStorage",
)({ clusterName: S.String }) {}
export class RedshiftServerlessStorage extends S.Class<RedshiftServerlessStorage>(
  "RedshiftServerlessStorage",
)({ workgroupName: S.String }) {}
export const RedshiftStorage = S.Union(
  S.Struct({ redshiftClusterSource: RedshiftClusterStorage }),
  S.Struct({ redshiftServerlessSource: RedshiftServerlessStorage }),
);
export class RedshiftRunConfigurationInput extends S.Class<RedshiftRunConfigurationInput>(
  "RedshiftRunConfigurationInput",
)({
  dataAccessRole: S.optional(S.String),
  relationalFilterConfigurations: RelationalFilterConfigurations,
  redshiftCredentialConfiguration: S.optional(RedshiftCredentialConfiguration),
  redshiftStorage: S.optional(RedshiftStorage),
}) {}
export const TrackingAssetArns = S.Array(S.String);
export const TrackingAssets = S.Record({
  key: S.String,
  value: TrackingAssetArns,
});
export class SageMakerRunConfigurationInput extends S.Class<SageMakerRunConfigurationInput>(
  "SageMakerRunConfigurationInput",
)({ trackingAssets: TrackingAssets }) {}
export const DataSourceConfigurationInput = S.Union(
  S.Struct({ glueRunConfiguration: GlueRunConfigurationInput }),
  S.Struct({ redshiftRunConfiguration: RedshiftRunConfigurationInput }),
  S.Struct({ sageMakerRunConfiguration: SageMakerRunConfigurationInput }),
);
export class RecommendationConfiguration extends S.Class<RecommendationConfiguration>(
  "RecommendationConfiguration",
)({ enableBusinessNameGeneration: S.optional(S.Boolean) }) {}
export class UpdateDataSourceInput extends S.Class<UpdateDataSourceInput>(
  "UpdateDataSourceInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    enableSetting: S.optional(S.String),
    publishOnImport: S.optional(S.Boolean),
    assetFormsInput: S.optional(FormInputList),
    schedule: S.optional(ScheduleConfiguration),
    configuration: S.optional(DataSourceConfigurationInput),
    recommendation: S.optional(RecommendationConfiguration),
    retainPermissionsOnRevokeFailure: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/domains/{domainIdentifier}/data-sources/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDataSourceInput extends S.Class<DeleteDataSourceInput>(
  "DeleteDataSourceInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
    retainPermissionsOnRevokeFailure: S.optional(S.Boolean).pipe(
      T.HttpQuery("retainPermissionsOnRevokeFailure"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/data-sources/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataSourcesInput extends S.Class<ListDataSourcesInput>(
  "ListDataSourcesInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    projectIdentifier: S.String.pipe(T.HttpQuery("projectIdentifier")),
    environmentIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("environmentIdentifier"),
    ),
    connectionIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("connectionIdentifier"),
    ),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/data-sources",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartDataSourceRunInput extends S.Class<StartDataSourceRunInput>(
  "StartDataSourceRunInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    dataSourceIdentifier: S.String.pipe(T.HttpLabel("dataSourceIdentifier")),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/data-sources/{dataSourceIdentifier}/runs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataSourceRunInput extends S.Class<GetDataSourceRunInput>(
  "GetDataSourceRunInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/data-source-runs/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataSourceRunsInput extends S.Class<ListDataSourceRunsInput>(
  "ListDataSourceRunsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    dataSourceIdentifier: S.String.pipe(T.HttpLabel("dataSourceIdentifier")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/data-sources/{dataSourceIdentifier}/runs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDomainInput extends S.Class<GetDomainInput>("GetDomainInput")(
  { identifier: S.String.pipe(T.HttpLabel("identifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/v2/domains/{identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SingleSignOn extends S.Class<SingleSignOn>("SingleSignOn")({
  type: S.optional(S.String),
  userAssignment: S.optional(S.String),
  idcInstanceArn: S.optional(S.String),
}) {}
export class UpdateDomainInput extends S.Class<UpdateDomainInput>(
  "UpdateDomainInput",
)(
  {
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    description: S.optional(S.String),
    singleSignOn: S.optional(SingleSignOn),
    domainExecutionRole: S.optional(S.String),
    serviceRole: S.optional(S.String),
    name: S.optional(S.String),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v2/domains/{identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDomainInput extends S.Class<DeleteDomainInput>(
  "DeleteDomainInput",
)(
  {
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
    skipDeletionCheck: S.optional(S.Boolean).pipe(
      T.HttpQuery("skipDeletionCheck"),
    ),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v2/domains/{identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDomainsInput extends S.Class<ListDomainsInput>(
  "ListDomainsInput",
)(
  {
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v2/domains" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDomainUnitInput extends S.Class<CreateDomainUnitInput>(
  "CreateDomainUnitInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: S.String,
    parentDomainUnitIdentifier: S.String,
    description: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/domain-units",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDomainUnitInput extends S.Class<GetDomainUnitInput>(
  "GetDomainUnitInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/domain-units/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDomainUnitInput extends S.Class<UpdateDomainUnitInput>(
  "UpdateDomainUnitInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    description: S.optional(S.String),
    name: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v2/domains/{domainIdentifier}/domain-units/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDomainUnitInput extends S.Class<DeleteDomainUnitInput>(
  "DeleteDomainUnitInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/domain-units/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDomainUnitOutput extends S.Class<DeleteDomainUnitOutput>(
  "DeleteDomainUnitOutput",
)({}) {}
export class ListDomainUnitsForParentInput extends S.Class<ListDomainUnitsForParentInput>(
  "ListDomainUnitsForParentInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    parentDomainUnitIdentifier: S.String.pipe(
      T.HttpQuery("parentDomainUnitIdentifier"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/domain-units",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEnvironmentBlueprintConfigurationInput extends S.Class<GetEnvironmentBlueprintConfigurationInput>(
  "GetEnvironmentBlueprintConfigurationInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentBlueprintIdentifier: S.String.pipe(
      T.HttpLabel("environmentBlueprintIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/environment-blueprint-configurations/{environmentBlueprintIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEnvironmentBlueprintConfigurationInput extends S.Class<DeleteEnvironmentBlueprintConfigurationInput>(
  "DeleteEnvironmentBlueprintConfigurationInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentBlueprintIdentifier: S.String.pipe(
      T.HttpLabel("environmentBlueprintIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/environment-blueprint-configurations/{environmentBlueprintIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEnvironmentBlueprintConfigurationOutput extends S.Class<DeleteEnvironmentBlueprintConfigurationOutput>(
  "DeleteEnvironmentBlueprintConfigurationOutput",
)({}) {}
export class ListEnvironmentBlueprintConfigurationsInput extends S.Class<ListEnvironmentBlueprintConfigurationsInput>(
  "ListEnvironmentBlueprintConfigurationsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/environment-blueprint-configurations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFormTypeInput extends S.Class<DeleteFormTypeInput>(
  "DeleteFormTypeInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    formTypeIdentifier: S.String.pipe(T.HttpLabel("formTypeIdentifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/form-types/{formTypeIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFormTypeOutput extends S.Class<DeleteFormTypeOutput>(
  "DeleteFormTypeOutput",
)({}) {}
export class GetFormTypeInput extends S.Class<GetFormTypeInput>(
  "GetFormTypeInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    formTypeIdentifier: S.String.pipe(T.HttpLabel("formTypeIdentifier")),
    revision: S.optional(S.String).pipe(T.HttpQuery("revision")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/form-types/{formTypeIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateGlossaryInput extends S.Class<CreateGlossaryInput>(
  "CreateGlossaryInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: S.String,
    owningProjectIdentifier: S.String,
    description: S.optional(S.String),
    status: S.optional(S.String),
    usageRestrictions: S.optional(GlossaryUsageRestrictions),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/glossaries",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetGlossaryInput extends S.Class<GetGlossaryInput>(
  "GetGlossaryInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/glossaries/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateGlossaryInput extends S.Class<UpdateGlossaryInput>(
  "UpdateGlossaryInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    status: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/domains/{domainIdentifier}/glossaries/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGlossaryInput extends S.Class<DeleteGlossaryInput>(
  "DeleteGlossaryInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/glossaries/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGlossaryOutput extends S.Class<DeleteGlossaryOutput>(
  "DeleteGlossaryOutput",
)({}) {}
export class GetGlossaryTermInput extends S.Class<GetGlossaryTermInput>(
  "GetGlossaryTermInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/glossary-terms/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TermRelations extends S.Class<TermRelations>("TermRelations")({
  isA: S.optional(GlossaryTerms),
  classifies: S.optional(GlossaryTerms),
}) {}
export class UpdateGlossaryTermInput extends S.Class<UpdateGlossaryTermInput>(
  "UpdateGlossaryTermInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    glossaryIdentifier: S.optional(S.String),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: S.optional(S.String),
    shortDescription: S.optional(S.String),
    longDescription: S.optional(S.String),
    termRelations: S.optional(TermRelations),
    status: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/domains/{domainIdentifier}/glossary-terms/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGlossaryTermInput extends S.Class<DeleteGlossaryTermInput>(
  "DeleteGlossaryTermInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/glossary-terms/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGlossaryTermOutput extends S.Class<DeleteGlossaryTermOutput>(
  "DeleteGlossaryTermOutput",
)({}) {}
export class GetListingInput extends S.Class<GetListingInput>(
  "GetListingInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    listingRevision: S.optional(S.String).pipe(T.HttpQuery("listingRevision")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/listings/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteListingInput extends S.Class<DeleteListingInput>(
  "DeleteListingInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/listings/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteListingOutput extends S.Class<DeleteListingOutput>(
  "DeleteListingOutput",
)({}) {}
export class GetMetadataGenerationRunInput extends S.Class<GetMetadataGenerationRunInput>(
  "GetMetadataGenerationRunInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/metadata-generation-runs/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelMetadataGenerationRunInput extends S.Class<CancelMetadataGenerationRunInput>(
  "CancelMetadataGenerationRunInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/metadata-generation-runs/{identifier}/cancel",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelMetadataGenerationRunOutput extends S.Class<CancelMetadataGenerationRunOutput>(
  "CancelMetadataGenerationRunOutput",
)({}) {}
export class ListMetadataGenerationRunsInput extends S.Class<ListMetadataGenerationRunsInput>(
  "ListMetadataGenerationRunsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    targetIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("targetIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/metadata-generation-runs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRuleInput extends S.Class<GetRuleInput>("GetRuleInput")(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    revision: S.optional(S.String).pipe(T.HttpQuery("revision")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/rules/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const RuleAssetTypeList = S.Array(S.String);
export class AssetTypesForRule extends S.Class<AssetTypesForRule>(
  "AssetTypesForRule",
)({
  selectionMode: S.String,
  specificAssetTypes: S.optional(RuleAssetTypeList),
}) {}
export const RuleProjectIdentifierList = S.Array(S.String);
export class ProjectsForRule extends S.Class<ProjectsForRule>(
  "ProjectsForRule",
)({
  selectionMode: S.String,
  specificProjects: S.optional(RuleProjectIdentifierList),
}) {}
export class RuleScope extends S.Class<RuleScope>("RuleScope")({
  assetType: S.optional(AssetTypesForRule),
  dataProduct: S.optional(S.Boolean),
  project: S.optional(ProjectsForRule),
}) {}
export class MetadataFormReference extends S.Class<MetadataFormReference>(
  "MetadataFormReference",
)({ typeIdentifier: S.String, typeRevision: S.String }) {}
export const RequiredMetadataFormList = S.Array(MetadataFormReference);
export class MetadataFormEnforcementDetail extends S.Class<MetadataFormEnforcementDetail>(
  "MetadataFormEnforcementDetail",
)({ requiredMetadataForms: S.optional(RequiredMetadataFormList) }) {}
export const GlossaryTermIdentifiers = S.Array(S.String);
export class GlossaryTermEnforcementDetail extends S.Class<GlossaryTermEnforcementDetail>(
  "GlossaryTermEnforcementDetail",
)({ requiredGlossaryTermIds: S.optional(GlossaryTermIdentifiers) }) {}
export const RuleDetail = S.Union(
  S.Struct({ metadataFormEnforcementDetail: MetadataFormEnforcementDetail }),
  S.Struct({ glossaryTermEnforcementDetail: GlossaryTermEnforcementDetail }),
);
export class UpdateRuleInput extends S.Class<UpdateRuleInput>(
  "UpdateRuleInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    scope: S.optional(RuleScope),
    detail: S.optional(RuleDetail),
    includeChildDomainUnits: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/domains/{domainIdentifier}/rules/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRuleInput extends S.Class<DeleteRuleInput>(
  "DeleteRuleInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domains/{domainIdentifier}/rules/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRuleOutput extends S.Class<DeleteRuleOutput>(
  "DeleteRuleOutput",
)({}) {}
export class ListRulesInput extends S.Class<ListRulesInput>("ListRulesInput")(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    targetType: S.String.pipe(T.HttpLabel("targetType")),
    targetIdentifier: S.String.pipe(T.HttpLabel("targetIdentifier")),
    ruleType: S.optional(S.String).pipe(T.HttpQuery("ruleType")),
    action: S.optional(S.String).pipe(T.HttpQuery("ruleAction")),
    projectIds: S.optional(ProjectIds).pipe(T.HttpQuery("projectIds")),
    assetTypes: S.optional(AssetTypeIdentifiers).pipe(
      T.HttpQuery("assetTypes"),
    ),
    dataProduct: S.optional(S.Boolean).pipe(T.HttpQuery("dataProduct")),
    includeCascaded: S.optional(S.Boolean).pipe(T.HttpQuery("includeCascaded")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domains/{domainIdentifier}/list-rules/{targetType}/{targetIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const FilterIds = S.Array(S.String);
export class Unit extends S.Class<Unit>("Unit")({}) {}
export const PredictionChoices = S.Array(S.Number);
export type FilterList = FilterClause[];
export const FilterList = S.Array(
  S.suspend(() => FilterClause),
) as any as S.Schema<FilterList>;
export class AcceptRule extends S.Class<AcceptRule>("AcceptRule")({
  rule: S.optional(S.String),
  threshold: S.optional(S.Number),
}) {}
export class AcceptChoice extends S.Class<AcceptChoice>("AcceptChoice")({
  predictionTarget: S.String,
  predictionChoice: S.optional(S.Number),
  editedValue: S.optional(S.String),
}) {}
export const AcceptChoices = S.Array(AcceptChoice);
export class AcceptedAssetScope extends S.Class<AcceptedAssetScope>(
  "AcceptedAssetScope",
)({ assetId: S.String, filterIds: FilterIds }) {}
export const AcceptedAssetScopes = S.Array(AcceptedAssetScope);
export class AttributeInput extends S.Class<AttributeInput>("AttributeInput")({
  attributeIdentifier: S.String,
  forms: FormInputList,
}) {}
export const Attributes = S.Array(AttributeInput);
export class AwsLocation extends S.Class<AwsLocation>("AwsLocation")({
  accessRole: S.optional(S.String),
  awsAccountId: S.optional(S.String),
  awsRegion: S.optional(S.String),
  iamConnectionId: S.optional(S.String),
}) {}
export class AssetTargetNameMap extends S.Class<AssetTargetNameMap>(
  "AssetTargetNameMap",
)({ assetId: S.String, targetName: S.String }) {}
export const AssetTargetNames = S.Array(AssetTargetNameMap);
export class SubscribedListingInput extends S.Class<SubscribedListingInput>(
  "SubscribedListingInput",
)({ identifier: S.String }) {}
export const SubscribedListingInputs = S.Array(SubscribedListingInput);
export const MetadataFormInputs = S.Array(FormInput);
export class SubscribedProject extends S.Class<SubscribedProject>(
  "SubscribedProject",
)({ id: S.optional(S.String), name: S.optional(S.String) }) {}
export class IamUserProfileDetails extends S.Class<IamUserProfileDetails>(
  "IamUserProfileDetails",
)({ arn: S.optional(S.String), principalId: S.optional(S.String) }) {}
export class SsoUserProfileDetails extends S.Class<SsoUserProfileDetails>(
  "SsoUserProfileDetails",
)({
  username: S.optional(S.String),
  firstName: S.optional(S.String),
  lastName: S.optional(S.String),
}) {}
export const UserProfileDetails = S.Union(
  S.Struct({ iam: IamUserProfileDetails }),
  S.Struct({ sso: SsoUserProfileDetails }),
);
export class SubscribedUser extends S.Class<SubscribedUser>("SubscribedUser")({
  id: S.optional(S.String),
  details: S.optional(UserProfileDetails),
}) {}
export class SubscribedGroup extends S.Class<SubscribedGroup>(
  "SubscribedGroup",
)({ id: S.optional(S.String), name: S.optional(S.String) }) {}
export const SubscribedPrincipal = S.Union(
  S.Struct({ project: SubscribedProject }),
  S.Struct({ user: SubscribedUser }),
  S.Struct({ group: SubscribedGroup }),
);
export const SubscribedPrincipals = S.Array(SubscribedPrincipal);
export class DetailedGlossaryTerm extends S.Class<DetailedGlossaryTerm>(
  "DetailedGlossaryTerm",
)({ name: S.optional(S.String), shortDescription: S.optional(S.String) }) {}
export const DetailedGlossaryTerms = S.Array(DetailedGlossaryTerm);
export class AssetScope extends S.Class<AssetScope>("AssetScope")({
  assetId: S.String,
  filterIds: FilterIds,
  status: S.String,
  errorMessage: S.optional(S.String),
}) {}
export const S3Permissions = S.Array(S.String);
export const Permissions = S.Union(S.Struct({ s3: S3Permissions }));
export class SubscribedAssetListing extends S.Class<SubscribedAssetListing>(
  "SubscribedAssetListing",
)({
  entityId: S.optional(S.String),
  entityRevision: S.optional(S.String),
  entityType: S.optional(S.String),
  forms: S.optional(S.String),
  glossaryTerms: S.optional(DetailedGlossaryTerms),
  assetScope: S.optional(AssetScope),
  permissions: S.optional(Permissions),
}) {}
export class AssetInDataProductListingItem extends S.Class<AssetInDataProductListingItem>(
  "AssetInDataProductListingItem",
)({
  entityId: S.optional(S.String),
  entityRevision: S.optional(S.String),
  entityType: S.optional(S.String),
}) {}
export const AssetInDataProductListingItems = S.Array(
  AssetInDataProductListingItem,
);
export class SubscribedProductListing extends S.Class<SubscribedProductListing>(
  "SubscribedProductListing",
)({
  entityId: S.optional(S.String),
  entityRevision: S.optional(S.String),
  glossaryTerms: S.optional(DetailedGlossaryTerms),
  name: S.optional(S.String),
  description: S.optional(S.String),
  assetListings: S.optional(AssetInDataProductListingItems),
}) {}
export const SubscribedListingItem = S.Union(
  S.Struct({ assetListing: SubscribedAssetListing }),
  S.Struct({ productListing: SubscribedProductListing }),
);
export class SubscribedListing extends S.Class<SubscribedListing>(
  "SubscribedListing",
)({
  id: S.String,
  revision: S.optional(S.String),
  name: S.String,
  description: S.String,
  item: SubscribedListingItem,
  ownerProjectId: S.String,
  ownerProjectName: S.optional(S.String),
}) {}
export const SubscribedListings = S.Array(SubscribedListing);
export class FormOutput extends S.Class<FormOutput>("FormOutput")({
  formName: S.String,
  typeName: S.optional(S.String),
  typeRevision: S.optional(S.String),
  content: S.optional(S.String),
}) {}
export const MetadataForms = S.Array(FormOutput);
export class TimeSeriesDataPointFormInput extends S.Class<TimeSeriesDataPointFormInput>(
  "TimeSeriesDataPointFormInput",
)({
  formName: S.String,
  typeIdentifier: S.String,
  typeRevision: S.optional(S.String),
  timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  content: S.optional(S.String),
}) {}
export const TimeSeriesDataPointFormInputList = S.Array(
  TimeSeriesDataPointFormInput,
);
export class EncryptionConfiguration extends S.Class<EncryptionConfiguration>(
  "EncryptionConfiguration",
)({ kmsKeyArn: S.optional(S.String), sseAlgorithm: S.optional(S.String) }) {}
export class RejectRule extends S.Class<RejectRule>("RejectRule")({
  rule: S.optional(S.String),
  threshold: S.optional(S.Number),
}) {}
export class RejectChoice extends S.Class<RejectChoice>("RejectChoice")({
  predictionTarget: S.String,
  predictionChoices: S.optional(PredictionChoices),
}) {}
export const RejectChoices = S.Array(RejectChoice);
export class AggregationListItem extends S.Class<AggregationListItem>(
  "AggregationListItem",
)({ attribute: S.String, displayValue: S.optional(S.String) }) {}
export const AggregationList = S.Array(AggregationListItem);
export class FailureCause extends S.Class<FailureCause>("FailureCause")({
  message: S.optional(S.String),
}) {}
export const DomainUnitIds = S.Array(S.String);
export const GlobalParameterMap = S.Record({ key: S.String, value: S.String });
export const Model = S.Union(S.Struct({ smithy: S.String }));
export class MetadataGenerationRunTarget extends S.Class<MetadataGenerationRunTarget>(
  "MetadataGenerationRunTarget",
)({ type: S.String, identifier: S.String, revision: S.optional(S.String) }) {}
export const ProjectProfileList = S.Array(S.String);
export const S3LocationList = S.Array(S.String);
export class AcceptPredictionsInput extends S.Class<AcceptPredictionsInput>(
  "AcceptPredictionsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    revision: S.optional(S.String).pipe(T.HttpQuery("revision")),
    acceptRule: S.optional(AcceptRule),
    acceptChoices: S.optional(AcceptChoices),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v2/domains/{domainIdentifier}/assets/{identifier}/accept-predictions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchPutAttributesMetadataInput extends S.Class<BatchPutAttributesMetadataInput>(
  "BatchPutAttributesMetadataInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    clientToken: S.optional(S.String),
    attributes: Attributes,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v2/domains/{domainIdentifier}/entities/{entityType}/{entityIdentifier}/attributes-metadata",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateEnvironmentInput extends S.Class<CreateEnvironmentInput>(
  "CreateEnvironmentInput",
)(
  {
    projectIdentifier: S.String,
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    description: S.optional(S.String),
    name: S.String,
    environmentProfileIdentifier: S.optional(S.String),
    userParameters: S.optional(EnvironmentParametersList),
    glossaryTerms: S.optional(GlossaryTerms),
    environmentAccountIdentifier: S.optional(S.String),
    environmentAccountRegion: S.optional(S.String),
    environmentBlueprintIdentifier: S.optional(S.String),
    deploymentOrder: S.optional(S.Number),
    environmentConfigurationId: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/environments",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateEnvironmentProfileOutput extends S.Class<CreateEnvironmentProfileOutput>(
  "CreateEnvironmentProfileOutput",
)({
  id: S.String,
  domainId: S.String,
  awsAccountId: S.optional(S.String),
  awsAccountRegion: S.optional(S.String),
  createdBy: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  name: S.String,
  description: S.optional(S.String),
  environmentBlueprintId: S.String,
  projectId: S.optional(S.String),
  userParameters: S.optional(CustomParameterList),
}) {}
export class CreateGroupProfileOutput extends S.Class<CreateGroupProfileOutput>(
  "CreateGroupProfileOutput",
)({
  domainId: S.optional(S.String),
  id: S.optional(S.String),
  status: S.optional(S.String),
  groupName: S.optional(S.String),
}) {}
export class CreateListingChangeSetOutput extends S.Class<CreateListingChangeSetOutput>(
  "CreateListingChangeSetOutput",
)({ listingId: S.String, listingRevision: S.String, status: S.String }) {}
export class CreateProjectMembershipInput extends S.Class<CreateProjectMembershipInput>(
  "CreateProjectMembershipInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    projectIdentifier: S.String.pipe(T.HttpLabel("projectIdentifier")),
    member: Member,
    designation: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/projects/{projectIdentifier}/createMembership",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateProjectMembershipOutput extends S.Class<CreateProjectMembershipOutput>(
  "CreateProjectMembershipOutput",
)({}) {}
export class CreateSubscriptionTargetInput extends S.Class<CreateSubscriptionTargetInput>(
  "CreateSubscriptionTargetInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    name: S.String,
    type: S.String,
    subscriptionTargetConfig: SubscriptionTargetForms,
    authorizedPrincipals: AuthorizedPrincipalIdentifiers,
    manageAccessRole: S.String,
    applicableAssetTypes: ApplicableAssetTypes,
    provider: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/subscription-targets",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConnectionOutput extends S.Class<DeleteConnectionOutput>(
  "DeleteConnectionOutput",
)({ status: S.optional(S.String) }) {}
export class GetAccountPoolOutput extends S.Class<GetAccountPoolOutput>(
  "GetAccountPoolOutput",
)({
  domainId: S.optional(S.String),
  name: S.optional(S.String),
  id: S.optional(S.String),
  description: S.optional(S.String),
  resolutionStrategy: S.optional(S.String),
  accountSource: AccountSource,
  createdBy: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  domainUnitId: S.optional(S.String),
}) {}
export class GetAssetFilterOutput extends S.Class<GetAssetFilterOutput>(
  "GetAssetFilterOutput",
)({
  id: S.String,
  domainId: S.String,
  assetId: S.String,
  name: S.String,
  description: S.optional(S.String),
  status: S.optional(S.String),
  configuration: AssetFilterConfiguration,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  errorMessage: S.optional(S.String),
  effectiveColumnNames: S.optional(ColumnNameList),
  effectiveRowFilter: S.optional(S.String),
}) {}
export class GetDataExportConfigurationOutput extends S.Class<GetDataExportConfigurationOutput>(
  "GetDataExportConfigurationOutput",
)({
  isExportEnabled: S.optional(S.Boolean),
  status: S.optional(S.String),
  encryptionConfiguration: S.optional(EncryptionConfiguration),
  s3TableBucketArn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetEnvironmentActionOutput extends S.Class<GetEnvironmentActionOutput>(
  "GetEnvironmentActionOutput",
)({
  domainId: S.String,
  environmentId: S.String,
  id: S.String,
  name: S.String,
  parameters: ActionParameters,
  description: S.optional(S.String),
}) {}
export class DeploymentProperties extends S.Class<DeploymentProperties>(
  "DeploymentProperties",
)({
  startTimeoutMinutes: S.optional(S.Number),
  endTimeoutMinutes: S.optional(S.Number),
}) {}
export class GetEnvironmentBlueprintOutput extends S.Class<GetEnvironmentBlueprintOutput>(
  "GetEnvironmentBlueprintOutput",
)({
  id: S.String,
  name: S.String,
  description: S.optional(S.String),
  provider: S.String,
  provisioningProperties: ProvisioningProperties,
  deploymentProperties: S.optional(DeploymentProperties),
  userParameters: S.optional(CustomParameterList),
  glossaryTerms: S.optional(GlossaryTerms),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class GetEnvironmentCredentialsOutput extends S.Class<GetEnvironmentCredentialsOutput>(
  "GetEnvironmentCredentialsOutput",
)({
  accessKeyId: S.optional(S.String),
  secretAccessKey: S.optional(S.String),
  sessionToken: S.optional(S.String),
  expiration: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class GetEnvironmentProfileOutput extends S.Class<GetEnvironmentProfileOutput>(
  "GetEnvironmentProfileOutput",
)({
  id: S.String,
  domainId: S.String,
  awsAccountId: S.optional(S.String),
  awsAccountRegion: S.optional(S.String),
  createdBy: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  name: S.String,
  description: S.optional(S.String),
  environmentBlueprintId: S.String,
  projectId: S.optional(S.String),
  userParameters: S.optional(CustomParameterList),
}) {}
export class GetGroupProfileOutput extends S.Class<GetGroupProfileOutput>(
  "GetGroupProfileOutput",
)({
  domainId: S.optional(S.String),
  id: S.optional(S.String),
  status: S.optional(S.String),
  groupName: S.optional(S.String),
}) {}
export class GetIamPortalLoginUrlOutput extends S.Class<GetIamPortalLoginUrlOutput>(
  "GetIamPortalLoginUrlOutput",
)({ authCodeUrl: S.optional(S.String), userProfileId: S.String }) {}
export class GetLineageEventOutput extends S.Class<GetLineageEventOutput>(
  "GetLineageEventOutput",
)({
  domainId: S.optional(S.String).pipe(T.HttpHeader("Domain-Id")),
  id: S.optional(S.String).pipe(T.HttpHeader("Id")),
  event: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
  createdBy: S.optional(S.String).pipe(T.HttpHeader("Created-By")),
  processingStatus: S.optional(S.String).pipe(
    T.HttpHeader("Processing-Status"),
  ),
  eventTime: S.optional(S.Date.pipe(T.TimestampFormat("http-date"))).pipe(
    T.HttpHeader("Event-Time"),
  ),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("http-date"))).pipe(
    T.HttpHeader("Created-At"),
  ),
}) {}
export class GetProjectProfileOutput extends S.Class<GetProjectProfileOutput>(
  "GetProjectProfileOutput",
)({
  domainId: S.String,
  id: S.String,
  name: S.String,
  description: S.optional(S.String),
  status: S.optional(S.String),
  projectResourceTags: S.optional(ProjectResourceTagParameters),
  allowCustomProjectResourceTags: S.optional(S.Boolean),
  projectResourceTagsDescription: S.optional(S.String),
  environmentConfigurations: S.optional(EnvironmentConfigurationsList),
  createdBy: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  domainUnitId: S.optional(S.String),
}) {}
export class GetSubscriptionOutput extends S.Class<GetSubscriptionOutput>(
  "GetSubscriptionOutput",
)({
  id: S.String,
  createdBy: S.String,
  updatedBy: S.optional(S.String),
  domainId: S.String,
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  subscribedPrincipal: SubscribedPrincipal,
  subscribedListing: SubscribedListing,
  subscriptionRequestId: S.optional(S.String),
  retainPermissions: S.optional(S.Boolean),
}) {}
export class ListingRevision extends S.Class<ListingRevision>(
  "ListingRevision",
)({ id: S.String, revision: S.String }) {}
export const GrantedEntity = S.Union(S.Struct({ listing: ListingRevision }));
export class SubscribedAsset extends S.Class<SubscribedAsset>(
  "SubscribedAsset",
)({
  assetId: S.String,
  assetRevision: S.String,
  status: S.String,
  targetName: S.optional(S.String),
  failureCause: S.optional(FailureCause),
  grantedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  failureTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  assetScope: S.optional(AssetScope),
  permissions: S.optional(Permissions),
}) {}
export const SubscribedAssets = S.Array(SubscribedAsset);
export class GetSubscriptionGrantOutput extends S.Class<GetSubscriptionGrantOutput>(
  "GetSubscriptionGrantOutput",
)({
  id: S.String,
  createdBy: S.String,
  updatedBy: S.optional(S.String),
  domainId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  environmentId: S.optional(S.String),
  subscriptionTargetId: S.String,
  grantedEntity: GrantedEntity,
  status: S.String,
  assets: S.optional(SubscribedAssets),
  subscriptionId: S.optional(S.String),
}) {}
export class GetSubscriptionRequestDetailsOutput extends S.Class<GetSubscriptionRequestDetailsOutput>(
  "GetSubscriptionRequestDetailsOutput",
)({
  id: S.String,
  createdBy: S.String,
  updatedBy: S.optional(S.String),
  domainId: S.String,
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  requestReason: S.String,
  subscribedPrincipals: SubscribedPrincipals,
  subscribedListings: SubscribedListings,
  reviewerId: S.optional(S.String),
  decisionComment: S.optional(S.String),
  existingSubscriptionId: S.optional(S.String),
  metadataForms: S.optional(MetadataForms),
}) {}
export class GetSubscriptionTargetOutput extends S.Class<GetSubscriptionTargetOutput>(
  "GetSubscriptionTargetOutput",
)({
  id: S.String,
  authorizedPrincipals: AuthorizedPrincipalIdentifiers,
  domainId: S.String,
  projectId: S.String,
  environmentId: S.String,
  name: S.String,
  type: S.String,
  createdBy: S.String,
  updatedBy: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  manageAccessRole: S.optional(S.String),
  applicableAssetTypes: ApplicableAssetTypes,
  subscriptionTargetConfig: SubscriptionTargetForms,
  provider: S.String,
}) {}
export class GetUserProfileOutput extends S.Class<GetUserProfileOutput>(
  "GetUserProfileOutput",
)({
  domainId: S.optional(S.String),
  id: S.optional(S.String),
  type: S.optional(S.String),
  status: S.optional(S.String),
  details: S.optional(UserProfileDetails),
}) {}
export class ListAccountsInAccountPoolOutput extends S.Class<ListAccountsInAccountPoolOutput>(
  "ListAccountsInAccountPoolOutput",
)({ items: S.optional(AccountInfoList), nextToken: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(Tags) }) {}
export class PostLineageEventOutput extends S.Class<PostLineageEventOutput>(
  "PostLineageEventOutput",
)({ id: S.optional(S.String), domainId: S.optional(S.String) }) {}
export class PostTimeSeriesDataPointsInput extends S.Class<PostTimeSeriesDataPointsInput>(
  "PostTimeSeriesDataPointsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    forms: TimeSeriesDataPointFormInputList,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/entities/{entityType}/{entityIdentifier}/time-series-data-points",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutDataExportConfigurationInput extends S.Class<PutDataExportConfigurationInput>(
  "PutDataExportConfigurationInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    enableExport: S.Boolean,
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v2/domains/{domainIdentifier}/data-export-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutDataExportConfigurationOutput extends S.Class<PutDataExportConfigurationOutput>(
  "PutDataExportConfigurationOutput",
)({}) {}
export class RejectPredictionsInput extends S.Class<RejectPredictionsInput>(
  "RejectPredictionsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    revision: S.optional(S.String).pipe(T.HttpQuery("revision")),
    rejectRule: S.optional(RejectRule),
    rejectChoices: S.optional(RejectChoices),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v2/domains/{domainIdentifier}/assets/{identifier}/reject-predictions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RejectSubscriptionRequestOutput extends S.Class<RejectSubscriptionRequestOutput>(
  "RejectSubscriptionRequestOutput",
)({
  id: S.String,
  createdBy: S.String,
  updatedBy: S.optional(S.String),
  domainId: S.String,
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  requestReason: S.String,
  subscribedPrincipals: SubscribedPrincipals,
  subscribedListings: SubscribedListings,
  reviewerId: S.optional(S.String),
  decisionComment: S.optional(S.String),
  existingSubscriptionId: S.optional(S.String),
  metadataForms: S.optional(MetadataForms),
}) {}
export class RevokeSubscriptionOutput extends S.Class<RevokeSubscriptionOutput>(
  "RevokeSubscriptionOutput",
)({
  id: S.String,
  createdBy: S.String,
  updatedBy: S.optional(S.String),
  domainId: S.String,
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  subscribedPrincipal: SubscribedPrincipal,
  subscribedListing: SubscribedListing,
  subscriptionRequestId: S.optional(S.String),
  retainPermissions: S.optional(S.Boolean),
}) {}
export class SearchListingsInput extends S.Class<SearchListingsInput>(
  "SearchListingsInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    searchText: S.optional(S.String),
    searchIn: S.optional(SearchInList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    filters: S.optional(FilterClause),
    aggregations: S.optional(AggregationList),
    sort: S.optional(SearchSort),
    additionalAttributes: S.optional(SearchOutputAdditionalAttributes),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/listings/search",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAccountPoolOutput extends S.Class<UpdateAccountPoolOutput>(
  "UpdateAccountPoolOutput",
)({
  domainId: S.optional(S.String),
  name: S.optional(S.String),
  id: S.optional(S.String),
  description: S.optional(S.String),
  resolutionStrategy: S.optional(S.String),
  accountSource: AccountSource,
  createdBy: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  domainUnitId: S.optional(S.String),
}) {}
export class UpdateAssetFilterOutput extends S.Class<UpdateAssetFilterOutput>(
  "UpdateAssetFilterOutput",
)({
  id: S.String,
  domainId: S.String,
  assetId: S.String,
  name: S.String,
  description: S.optional(S.String),
  status: S.optional(S.String),
  configuration: AssetFilterConfiguration,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  errorMessage: S.optional(S.String),
  effectiveColumnNames: S.optional(ColumnNameList),
  effectiveRowFilter: S.optional(S.String),
}) {}
export class Resource extends S.Class<Resource>("Resource")({
  provider: S.optional(S.String),
  name: S.optional(S.String),
  value: S.String,
  type: S.String,
}) {}
export const ResourceList = S.Array(Resource);
export class ConfigurableActionParameter extends S.Class<ConfigurableActionParameter>(
  "ConfigurableActionParameter",
)({ key: S.optional(S.String), value: S.optional(S.String) }) {}
export const ConfigurableActionParameterList = S.Array(
  ConfigurableActionParameter,
);
export class ConfigurableEnvironmentAction extends S.Class<ConfigurableEnvironmentAction>(
  "ConfigurableEnvironmentAction",
)({
  type: S.String,
  auth: S.optional(S.String),
  parameters: ConfigurableActionParameterList,
}) {}
export const EnvironmentActionList = S.Array(ConfigurableEnvironmentAction);
export class EnvironmentError extends S.Class<EnvironmentError>(
  "EnvironmentError",
)({ code: S.optional(S.String), message: S.String }) {}
export const DeploymentMessagesList = S.Array(S.String);
export class Deployment extends S.Class<Deployment>("Deployment")({
  deploymentId: S.optional(S.String),
  deploymentType: S.optional(S.String),
  deploymentStatus: S.optional(S.String),
  failureReason: S.optional(EnvironmentError),
  messages: S.optional(DeploymentMessagesList),
  isDeploymentComplete: S.optional(S.Boolean),
}) {}
export class UpdateEnvironmentOutput extends S.Class<UpdateEnvironmentOutput>(
  "UpdateEnvironmentOutput",
)({
  projectId: S.String,
  id: S.optional(S.String),
  domainId: S.String,
  createdBy: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  name: S.String,
  description: S.optional(S.String),
  environmentProfileId: S.optional(S.String),
  awsAccountId: S.optional(S.String),
  awsAccountRegion: S.optional(S.String),
  provider: S.String,
  provisionedResources: S.optional(ResourceList),
  status: S.optional(S.String),
  environmentActions: S.optional(EnvironmentActionList),
  glossaryTerms: S.optional(GlossaryTerms),
  userParameters: S.optional(CustomParameterList),
  lastDeployment: S.optional(Deployment),
  provisioningProperties: S.optional(ProvisioningProperties),
  deploymentProperties: S.optional(DeploymentProperties),
  environmentBlueprintId: S.optional(S.String),
  environmentConfigurationId: S.optional(S.String),
}) {}
export class UpdateEnvironmentActionOutput extends S.Class<UpdateEnvironmentActionOutput>(
  "UpdateEnvironmentActionOutput",
)({
  domainId: S.String,
  environmentId: S.String,
  id: S.String,
  name: S.String,
  parameters: ActionParameters,
  description: S.optional(S.String),
}) {}
export class UpdateEnvironmentBlueprintOutput extends S.Class<UpdateEnvironmentBlueprintOutput>(
  "UpdateEnvironmentBlueprintOutput",
)({
  id: S.String,
  name: S.String,
  description: S.optional(S.String),
  provider: S.String,
  provisioningProperties: ProvisioningProperties,
  deploymentProperties: S.optional(DeploymentProperties),
  userParameters: S.optional(CustomParameterList),
  glossaryTerms: S.optional(GlossaryTerms),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class UpdateEnvironmentProfileOutput extends S.Class<UpdateEnvironmentProfileOutput>(
  "UpdateEnvironmentProfileOutput",
)({
  id: S.String,
  domainId: S.String,
  awsAccountId: S.optional(S.String),
  awsAccountRegion: S.optional(S.String),
  createdBy: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  name: S.String,
  description: S.optional(S.String),
  environmentBlueprintId: S.String,
  projectId: S.optional(S.String),
  userParameters: S.optional(CustomParameterList),
}) {}
export class UpdateGroupProfileOutput extends S.Class<UpdateGroupProfileOutput>(
  "UpdateGroupProfileOutput",
)({
  domainId: S.optional(S.String),
  id: S.optional(S.String),
  status: S.optional(S.String),
  groupName: S.optional(S.String),
}) {}
export class UpdateProjectProfileOutput extends S.Class<UpdateProjectProfileOutput>(
  "UpdateProjectProfileOutput",
)({
  domainId: S.String,
  id: S.String,
  name: S.String,
  description: S.optional(S.String),
  status: S.optional(S.String),
  projectResourceTags: S.optional(ProjectResourceTagParameters),
  allowCustomProjectResourceTags: S.optional(S.Boolean),
  projectResourceTagsDescription: S.optional(S.String),
  environmentConfigurations: S.optional(EnvironmentConfigurationsList),
  createdBy: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  domainUnitId: S.optional(S.String),
}) {}
export class UpdateSubscriptionGrantStatusInput extends S.Class<UpdateSubscriptionGrantStatusInput>(
  "UpdateSubscriptionGrantStatusInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    assetIdentifier: S.String.pipe(T.HttpLabel("assetIdentifier")),
    status: S.String,
    failureCause: S.optional(FailureCause),
    targetName: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/domains/{domainIdentifier}/subscription-grants/{identifier}/status/{assetIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSubscriptionRequestOutput extends S.Class<UpdateSubscriptionRequestOutput>(
  "UpdateSubscriptionRequestOutput",
)({
  id: S.String,
  createdBy: S.String,
  updatedBy: S.optional(S.String),
  domainId: S.String,
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  requestReason: S.String,
  subscribedPrincipals: SubscribedPrincipals,
  subscribedListings: SubscribedListings,
  reviewerId: S.optional(S.String),
  decisionComment: S.optional(S.String),
  existingSubscriptionId: S.optional(S.String),
  metadataForms: S.optional(MetadataForms),
}) {}
export class UpdateSubscriptionTargetOutput extends S.Class<UpdateSubscriptionTargetOutput>(
  "UpdateSubscriptionTargetOutput",
)({
  id: S.String,
  authorizedPrincipals: AuthorizedPrincipalIdentifiers,
  domainId: S.String,
  projectId: S.String,
  environmentId: S.String,
  name: S.String,
  type: S.String,
  createdBy: S.String,
  updatedBy: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  manageAccessRole: S.optional(S.String),
  applicableAssetTypes: ApplicableAssetTypes,
  subscriptionTargetConfig: SubscriptionTargetForms,
  provider: S.String,
}) {}
export class UpdateUserProfileOutput extends S.Class<UpdateUserProfileOutput>(
  "UpdateUserProfileOutput",
)({
  domainId: S.optional(S.String),
  id: S.optional(S.String),
  type: S.optional(S.String),
  status: S.optional(S.String),
  details: S.optional(UserProfileDetails),
}) {}
export class AssetListingDetails extends S.Class<AssetListingDetails>(
  "AssetListingDetails",
)({ listingId: S.String, listingStatus: S.String }) {}
export const FormOutputList = S.Array(FormOutput);
export class TimeSeriesDataPointSummaryFormOutput extends S.Class<TimeSeriesDataPointSummaryFormOutput>(
  "TimeSeriesDataPointSummaryFormOutput",
)({
  formName: S.String,
  typeIdentifier: S.String,
  typeRevision: S.optional(S.String),
  timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  contentSummary: S.optional(S.String),
  id: S.optional(S.String),
}) {}
export const TimeSeriesDataPointSummaryFormOutputList = S.Array(
  TimeSeriesDataPointSummaryFormOutput,
);
export class CreateAssetRevisionOutput extends S.Class<CreateAssetRevisionOutput>(
  "CreateAssetRevisionOutput",
)({
  id: S.String,
  name: S.String,
  typeIdentifier: S.String,
  typeRevision: S.String,
  externalIdentifier: S.optional(S.String),
  revision: S.String,
  description: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  firstRevisionCreatedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  firstRevisionCreatedBy: S.optional(S.String),
  glossaryTerms: S.optional(GlossaryTerms),
  governedGlossaryTerms: S.optional(GovernedGlossaryTerms),
  owningProjectId: S.String,
  domainId: S.String,
  listing: S.optional(AssetListingDetails),
  formsOutput: FormOutputList,
  readOnlyFormsOutput: S.optional(FormOutputList),
  latestTimeSeriesDataPointFormsOutput: S.optional(
    TimeSeriesDataPointSummaryFormOutputList,
  ),
  predictionConfiguration: S.optional(PredictionConfiguration),
}) {}
export class CreateDataProductInput extends S.Class<CreateDataProductInput>(
  "CreateDataProductInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: S.String,
    owningProjectIdentifier: S.String,
    description: S.optional(S.String),
    glossaryTerms: S.optional(GlossaryTerms),
    formsInput: S.optional(FormInputList),
    items: S.optional(DataProductItems),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/data-products",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataProductOutput extends S.Class<GetDataProductOutput>(
  "GetDataProductOutput",
)({
  domainId: S.String,
  id: S.String,
  revision: S.String,
  owningProjectId: S.String,
  name: S.String,
  status: S.String,
  description: S.optional(S.String),
  glossaryTerms: S.optional(GlossaryTerms),
  items: S.optional(DataProductItems),
  formsOutput: S.optional(FormOutputList),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  firstRevisionCreatedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  firstRevisionCreatedBy: S.optional(S.String),
}) {}
export class CreateDataProductRevisionOutput extends S.Class<CreateDataProductRevisionOutput>(
  "CreateDataProductRevisionOutput",
)({
  domainId: S.String,
  id: S.String,
  revision: S.String,
  owningProjectId: S.String,
  name: S.String,
  status: S.String,
  description: S.optional(S.String),
  glossaryTerms: S.optional(GlossaryTerms),
  items: S.optional(DataProductItems),
  formsOutput: S.optional(FormOutputList),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  firstRevisionCreatedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  firstRevisionCreatedBy: S.optional(S.String),
}) {}
export class GlueRunConfigurationOutput extends S.Class<GlueRunConfigurationOutput>(
  "GlueRunConfigurationOutput",
)({
  accountId: S.optional(S.String),
  region: S.optional(S.String),
  dataAccessRole: S.optional(S.String),
  relationalFilterConfigurations: RelationalFilterConfigurations,
  autoImportDataQualityResult: S.optional(S.Boolean),
  catalogName: S.optional(S.String),
}) {}
export class RedshiftRunConfigurationOutput extends S.Class<RedshiftRunConfigurationOutput>(
  "RedshiftRunConfigurationOutput",
)({
  accountId: S.optional(S.String),
  region: S.optional(S.String),
  dataAccessRole: S.optional(S.String),
  relationalFilterConfigurations: RelationalFilterConfigurations,
  redshiftCredentialConfiguration: S.optional(RedshiftCredentialConfiguration),
  redshiftStorage: RedshiftStorage,
}) {}
export class SageMakerRunConfigurationOutput extends S.Class<SageMakerRunConfigurationOutput>(
  "SageMakerRunConfigurationOutput",
)({
  accountId: S.optional(S.String),
  region: S.optional(S.String),
  trackingAssets: TrackingAssets,
}) {}
export const DataSourceConfigurationOutput = S.Union(
  S.Struct({ glueRunConfiguration: GlueRunConfigurationOutput }),
  S.Struct({ redshiftRunConfiguration: RedshiftRunConfigurationOutput }),
  S.Struct({ sageMakerRunConfiguration: SageMakerRunConfigurationOutput }),
);
export class DataSourceErrorMessage extends S.Class<DataSourceErrorMessage>(
  "DataSourceErrorMessage",
)({ errorType: S.String, errorDetail: S.optional(S.String) }) {}
export class SelfGrantStatusDetail extends S.Class<SelfGrantStatusDetail>(
  "SelfGrantStatusDetail",
)({
  databaseName: S.String,
  schemaName: S.optional(S.String),
  status: S.String,
  failureCause: S.optional(S.String),
}) {}
export const SelfGrantStatusDetails = S.Array(SelfGrantStatusDetail);
export class GlueSelfGrantStatusOutput extends S.Class<GlueSelfGrantStatusOutput>(
  "GlueSelfGrantStatusOutput",
)({ selfGrantStatusDetails: SelfGrantStatusDetails }) {}
export class RedshiftSelfGrantStatusOutput extends S.Class<RedshiftSelfGrantStatusOutput>(
  "RedshiftSelfGrantStatusOutput",
)({ selfGrantStatusDetails: SelfGrantStatusDetails }) {}
export const SelfGrantStatusOutput = S.Union(
  S.Struct({ glueSelfGrantStatus: GlueSelfGrantStatusOutput }),
  S.Struct({ redshiftSelfGrantStatus: RedshiftSelfGrantStatusOutput }),
);
export class UpdateDataSourceOutput extends S.Class<UpdateDataSourceOutput>(
  "UpdateDataSourceOutput",
)({
  id: S.String,
  status: S.optional(S.String),
  type: S.optional(S.String),
  name: S.String,
  description: S.optional(S.String),
  domainId: S.String,
  projectId: S.String,
  environmentId: S.optional(S.String),
  connectionId: S.optional(S.String),
  configuration: S.optional(DataSourceConfigurationOutput),
  recommendation: S.optional(RecommendationConfiguration),
  enableSetting: S.optional(S.String),
  publishOnImport: S.optional(S.Boolean),
  assetFormsOutput: S.optional(FormOutputList),
  schedule: S.optional(ScheduleConfiguration),
  lastRunStatus: S.optional(S.String),
  lastRunAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastRunErrorMessage: S.optional(DataSourceErrorMessage),
  errorMessage: S.optional(DataSourceErrorMessage),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  selfGrantStatus: S.optional(SelfGrantStatusOutput),
  retainPermissionsOnRevokeFailure: S.optional(S.Boolean),
}) {}
export class DeleteDataSourceOutput extends S.Class<DeleteDataSourceOutput>(
  "DeleteDataSourceOutput",
)({
  id: S.String,
  status: S.optional(S.String),
  type: S.optional(S.String),
  name: S.String,
  description: S.optional(S.String),
  domainId: S.String,
  projectId: S.String,
  environmentId: S.optional(S.String),
  connectionId: S.optional(S.String),
  configuration: S.optional(DataSourceConfigurationOutput),
  enableSetting: S.optional(S.String),
  publishOnImport: S.optional(S.Boolean),
  assetFormsOutput: S.optional(FormOutputList),
  schedule: S.optional(ScheduleConfiguration),
  lastRunStatus: S.optional(S.String),
  lastRunAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastRunErrorMessage: S.optional(DataSourceErrorMessage),
  errorMessage: S.optional(DataSourceErrorMessage),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  selfGrantStatus: S.optional(SelfGrantStatusOutput),
  retainPermissionsOnRevokeFailure: S.optional(S.Boolean),
}) {}
export class CreateDomainInput extends S.Class<CreateDomainInput>(
  "CreateDomainInput",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    singleSignOn: S.optional(SingleSignOn),
    domainExecutionRole: S.String,
    kmsKeyIdentifier: S.optional(S.String),
    tags: S.optional(Tags),
    domainVersion: S.optional(S.String),
    serviceRole: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v2/domains" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDomainOutput extends S.Class<GetDomainOutput>(
  "GetDomainOutput",
)({
  id: S.String,
  rootDomainUnitId: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  singleSignOn: S.optional(SingleSignOn),
  domainExecutionRole: S.String,
  arn: S.optional(S.String),
  kmsKeyIdentifier: S.optional(S.String),
  status: S.String,
  portalUrl: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(Tags),
  domainVersion: S.optional(S.String),
  serviceRole: S.optional(S.String),
}) {}
export class UpdateDomainOutput extends S.Class<UpdateDomainOutput>(
  "UpdateDomainOutput",
)({
  id: S.String,
  rootDomainUnitId: S.optional(S.String),
  description: S.optional(S.String),
  singleSignOn: S.optional(SingleSignOn),
  domainExecutionRole: S.optional(S.String),
  serviceRole: S.optional(S.String),
  name: S.optional(S.String),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DeleteDomainOutput extends S.Class<DeleteDomainOutput>(
  "DeleteDomainOutput",
)({ status: S.String }) {}
export class DomainUnitUserProperties extends S.Class<DomainUnitUserProperties>(
  "DomainUnitUserProperties",
)({ userId: S.optional(S.String) }) {}
export class DomainUnitGroupProperties extends S.Class<DomainUnitGroupProperties>(
  "DomainUnitGroupProperties",
)({ groupId: S.optional(S.String) }) {}
export const DomainUnitOwnerProperties = S.Union(
  S.Struct({ user: DomainUnitUserProperties }),
  S.Struct({ group: DomainUnitGroupProperties }),
);
export const DomainUnitOwners = S.Array(DomainUnitOwnerProperties);
export class GetDomainUnitOutput extends S.Class<GetDomainUnitOutput>(
  "GetDomainUnitOutput",
)({
  id: S.String,
  domainId: S.String,
  name: S.String,
  parentDomainUnitId: S.optional(S.String),
  description: S.optional(S.String),
  owners: DomainUnitOwners,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  lastUpdatedBy: S.optional(S.String),
}) {}
export class UpdateDomainUnitOutput extends S.Class<UpdateDomainUnitOutput>(
  "UpdateDomainUnitOutput",
)({
  id: S.String,
  domainId: S.String,
  name: S.String,
  owners: DomainUnitOwners,
  description: S.optional(S.String),
  parentDomainUnitId: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  lastUpdatedBy: S.optional(S.String),
}) {}
export const RegionalParameter = S.Record({ key: S.String, value: S.String });
export const RegionalParameterMap = S.Record({
  key: S.String,
  value: RegionalParameter,
});
export class LakeFormationConfiguration extends S.Class<LakeFormationConfiguration>(
  "LakeFormationConfiguration",
)({
  locationRegistrationRole: S.optional(S.String),
  locationRegistrationExcludeS3Locations: S.optional(S3LocationList),
}) {}
export const ProvisioningConfiguration = S.Union(
  S.Struct({ lakeFormationConfiguration: LakeFormationConfiguration }),
);
export const ProvisioningConfigurationList = S.Array(ProvisioningConfiguration);
export class GetEnvironmentBlueprintConfigurationOutput extends S.Class<GetEnvironmentBlueprintConfigurationOutput>(
  "GetEnvironmentBlueprintConfigurationOutput",
)({
  domainId: S.String,
  environmentBlueprintId: S.String,
  provisioningRoleArn: S.optional(S.String),
  environmentRolePermissionBoundary: S.optional(S.String),
  manageAccessRoleArn: S.optional(S.String),
  enabledRegions: S.optional(EnabledRegionList),
  regionalParameters: S.optional(RegionalParameterMap),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  provisioningConfigurations: S.optional(ProvisioningConfigurationList),
}) {}
export class CreateFormTypeInput extends S.Class<CreateFormTypeInput>(
  "CreateFormTypeInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: S.String,
    model: Model,
    owningProjectIdentifier: S.String,
    status: S.optional(S.String),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/form-types",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateGlossaryOutput extends S.Class<CreateGlossaryOutput>(
  "CreateGlossaryOutput",
)({
  domainId: S.String,
  id: S.String,
  name: S.String,
  owningProjectId: S.String,
  description: S.optional(S.String),
  status: S.optional(S.String),
  usageRestrictions: S.optional(GlossaryUsageRestrictions),
}) {}
export class GetGlossaryOutput extends S.Class<GetGlossaryOutput>(
  "GetGlossaryOutput",
)({
  domainId: S.String,
  id: S.String,
  owningProjectId: S.String,
  name: S.String,
  description: S.optional(S.String),
  status: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedBy: S.optional(S.String),
  usageRestrictions: S.optional(GlossaryUsageRestrictions),
}) {}
export class UpdateGlossaryOutput extends S.Class<UpdateGlossaryOutput>(
  "UpdateGlossaryOutput",
)({
  domainId: S.String,
  id: S.String,
  name: S.String,
  owningProjectId: S.String,
  description: S.optional(S.String),
  status: S.optional(S.String),
  usageRestrictions: S.optional(GlossaryUsageRestrictions),
}) {}
export class CreateGlossaryTermInput extends S.Class<CreateGlossaryTermInput>(
  "CreateGlossaryTermInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    glossaryIdentifier: S.String,
    name: S.String,
    status: S.optional(S.String),
    shortDescription: S.optional(S.String),
    longDescription: S.optional(S.String),
    termRelations: S.optional(TermRelations),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/glossary-terms",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetGlossaryTermOutput extends S.Class<GetGlossaryTermOutput>(
  "GetGlossaryTermOutput",
)({
  domainId: S.String,
  glossaryId: S.String,
  id: S.String,
  name: S.String,
  shortDescription: S.optional(S.String),
  longDescription: S.optional(S.String),
  termRelations: S.optional(TermRelations),
  status: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedBy: S.optional(S.String),
  usageRestrictions: S.optional(GlossaryUsageRestrictions),
}) {}
export class UpdateGlossaryTermOutput extends S.Class<UpdateGlossaryTermOutput>(
  "UpdateGlossaryTermOutput",
)({
  id: S.String,
  domainId: S.String,
  glossaryId: S.String,
  name: S.String,
  status: S.String,
  shortDescription: S.optional(S.String),
  longDescription: S.optional(S.String),
  termRelations: S.optional(TermRelations),
  usageRestrictions: S.optional(GlossaryUsageRestrictions),
}) {}
export class StartMetadataGenerationRunInput extends S.Class<StartMetadataGenerationRunInput>(
  "StartMetadataGenerationRunInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    type: S.optional(S.String),
    types: S.optional(MetadataGenerationRunTypes),
    target: MetadataGenerationRunTarget,
    clientToken: S.optional(S.String),
    owningProjectIdentifier: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/metadata-generation-runs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DomainUnitTarget extends S.Class<DomainUnitTarget>(
  "DomainUnitTarget",
)({ domainUnitId: S.String, includeChildDomainUnits: S.optional(S.Boolean) }) {}
export const RuleTarget = S.Union(
  S.Struct({ domainUnitTarget: DomainUnitTarget }),
);
export class GetRuleOutput extends S.Class<GetRuleOutput>("GetRuleOutput")({
  identifier: S.String,
  revision: S.String,
  name: S.String,
  ruleType: S.String,
  target: RuleTarget,
  action: S.String,
  scope: RuleScope,
  detail: RuleDetail,
  targetType: S.optional(S.String),
  description: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  createdBy: S.String,
  lastUpdatedBy: S.String,
}) {}
export class UpdateRuleOutput extends S.Class<UpdateRuleOutput>(
  "UpdateRuleOutput",
)({
  identifier: S.String,
  revision: S.String,
  name: S.String,
  ruleType: S.String,
  target: RuleTarget,
  action: S.String,
  scope: RuleScope,
  detail: RuleDetail,
  description: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  createdBy: S.String,
  lastUpdatedBy: S.String,
}) {}
export class CreateDomainUnitPolicyGrantDetail extends S.Class<CreateDomainUnitPolicyGrantDetail>(
  "CreateDomainUnitPolicyGrantDetail",
)({ includeChildDomainUnits: S.optional(S.Boolean) }) {}
export class OverrideDomainUnitOwnersPolicyGrantDetail extends S.Class<OverrideDomainUnitOwnersPolicyGrantDetail>(
  "OverrideDomainUnitOwnersPolicyGrantDetail",
)({ includeChildDomainUnits: S.optional(S.Boolean) }) {}
export class AddToProjectMemberPoolPolicyGrantDetail extends S.Class<AddToProjectMemberPoolPolicyGrantDetail>(
  "AddToProjectMemberPoolPolicyGrantDetail",
)({ includeChildDomainUnits: S.optional(S.Boolean) }) {}
export class OverrideProjectOwnersPolicyGrantDetail extends S.Class<OverrideProjectOwnersPolicyGrantDetail>(
  "OverrideProjectOwnersPolicyGrantDetail",
)({ includeChildDomainUnits: S.optional(S.Boolean) }) {}
export class CreateGlossaryPolicyGrantDetail extends S.Class<CreateGlossaryPolicyGrantDetail>(
  "CreateGlossaryPolicyGrantDetail",
)({ includeChildDomainUnits: S.optional(S.Boolean) }) {}
export class CreateFormTypePolicyGrantDetail extends S.Class<CreateFormTypePolicyGrantDetail>(
  "CreateFormTypePolicyGrantDetail",
)({ includeChildDomainUnits: S.optional(S.Boolean) }) {}
export class CreateAssetTypePolicyGrantDetail extends S.Class<CreateAssetTypePolicyGrantDetail>(
  "CreateAssetTypePolicyGrantDetail",
)({ includeChildDomainUnits: S.optional(S.Boolean) }) {}
export class CreateProjectPolicyGrantDetail extends S.Class<CreateProjectPolicyGrantDetail>(
  "CreateProjectPolicyGrantDetail",
)({ includeChildDomainUnits: S.optional(S.Boolean) }) {}
export class CreateEnvironmentProfilePolicyGrantDetail extends S.Class<CreateEnvironmentProfilePolicyGrantDetail>(
  "CreateEnvironmentProfilePolicyGrantDetail",
)({ domainUnitId: S.optional(S.String) }) {}
export class CreateProjectFromProjectProfilePolicyGrantDetail extends S.Class<CreateProjectFromProjectProfilePolicyGrantDetail>(
  "CreateProjectFromProjectProfilePolicyGrantDetail",
)({
  includeChildDomainUnits: S.optional(S.Boolean),
  projectProfiles: S.optional(ProjectProfileList),
}) {}
export class UseAssetTypePolicyGrantDetail extends S.Class<UseAssetTypePolicyGrantDetail>(
  "UseAssetTypePolicyGrantDetail",
)({ domainUnitId: S.optional(S.String) }) {}
export class AthenaPropertiesInput extends S.Class<AthenaPropertiesInput>(
  "AthenaPropertiesInput",
)({ workgroupName: S.optional(S.String) }) {}
export class HyperPodPropertiesInput extends S.Class<HyperPodPropertiesInput>(
  "HyperPodPropertiesInput",
)({ clusterName: S.String }) {}
export class IamPropertiesInput extends S.Class<IamPropertiesInput>(
  "IamPropertiesInput",
)({ glueLineageSyncEnabled: S.optional(S.Boolean) }) {}
export class SparkEmrPropertiesInput extends S.Class<SparkEmrPropertiesInput>(
  "SparkEmrPropertiesInput",
)({
  computeArn: S.optional(S.String),
  instanceProfileArn: S.optional(S.String),
  javaVirtualEnv: S.optional(S.String),
  logUri: S.optional(S.String),
  pythonVirtualEnv: S.optional(S.String),
  runtimeRole: S.optional(S.String),
  trustedCertificatesS3Uri: S.optional(S.String),
  managedEndpointArn: S.optional(S.String),
}) {}
export class S3PropertiesInput extends S.Class<S3PropertiesInput>(
  "S3PropertiesInput",
)({ s3Uri: S.String, s3AccessGrantLocationId: S.optional(S.String) }) {}
export class AmazonQPropertiesInput extends S.Class<AmazonQPropertiesInput>(
  "AmazonQPropertiesInput",
)({
  isEnabled: S.Boolean,
  profileArn: S.optional(S.String),
  authMode: S.optional(S.String),
}) {}
export class MlflowPropertiesInput extends S.Class<MlflowPropertiesInput>(
  "MlflowPropertiesInput",
)({ trackingServerArn: S.optional(S.String) }) {}
export class EnvironmentResolvedAccount extends S.Class<EnvironmentResolvedAccount>(
  "EnvironmentResolvedAccount",
)({
  awsAccountId: S.String,
  regionName: S.String,
  sourceAccountPoolId: S.optional(S.String),
}) {}
export class ListingRevisionInput extends S.Class<ListingRevisionInput>(
  "ListingRevisionInput",
)({ identifier: S.String, revision: S.String }) {}
export class SubscribedProjectInput extends S.Class<SubscribedProjectInput>(
  "SubscribedProjectInput",
)({ identifier: S.optional(S.String) }) {}
export class SubscribedUserInput extends S.Class<SubscribedUserInput>(
  "SubscribedUserInput",
)({ identifier: S.optional(S.String) }) {}
export class SubscribedGroupInput extends S.Class<SubscribedGroupInput>(
  "SubscribedGroupInput",
)({ identifier: S.optional(S.String) }) {}
export class AthenaPropertiesPatch extends S.Class<AthenaPropertiesPatch>(
  "AthenaPropertiesPatch",
)({ workgroupName: S.optional(S.String) }) {}
export class IamPropertiesPatch extends S.Class<IamPropertiesPatch>(
  "IamPropertiesPatch",
)({ glueLineageSyncEnabled: S.optional(S.Boolean) }) {}
export const RedshiftStorageProperties = S.Union(
  S.Struct({ clusterName: S.String }),
  S.Struct({ workgroupName: S.String }),
);
export class UsernamePassword extends S.Class<UsernamePassword>(
  "UsernamePassword",
)({ password: S.String, username: S.String }) {}
export const RedshiftCredentials = S.Union(
  S.Struct({ secretArn: S.String }),
  S.Struct({ usernamePassword: UsernamePassword }),
);
export class LineageSyncSchedule extends S.Class<LineageSyncSchedule>(
  "LineageSyncSchedule",
)({ schedule: S.optional(S.String) }) {}
export class RedshiftLineageSyncConfigurationInput extends S.Class<RedshiftLineageSyncConfigurationInput>(
  "RedshiftLineageSyncConfigurationInput",
)({
  enabled: S.optional(S.Boolean),
  schedule: S.optional(LineageSyncSchedule),
}) {}
export class RedshiftPropertiesPatch extends S.Class<RedshiftPropertiesPatch>(
  "RedshiftPropertiesPatch",
)({
  storage: S.optional(RedshiftStorageProperties),
  databaseName: S.optional(S.String),
  host: S.optional(S.String),
  port: S.optional(S.Number),
  credentials: S.optional(RedshiftCredentials),
  lineageSync: S.optional(RedshiftLineageSyncConfigurationInput),
}) {}
export class SparkEmrPropertiesPatch extends S.Class<SparkEmrPropertiesPatch>(
  "SparkEmrPropertiesPatch",
)({
  computeArn: S.optional(S.String),
  instanceProfileArn: S.optional(S.String),
  javaVirtualEnv: S.optional(S.String),
  logUri: S.optional(S.String),
  pythonVirtualEnv: S.optional(S.String),
  runtimeRole: S.optional(S.String),
  trustedCertificatesS3Uri: S.optional(S.String),
  managedEndpointArn: S.optional(S.String),
}) {}
export class S3PropertiesPatch extends S.Class<S3PropertiesPatch>(
  "S3PropertiesPatch",
)({ s3Uri: S.String, s3AccessGrantLocationId: S.optional(S.String) }) {}
export class AmazonQPropertiesPatch extends S.Class<AmazonQPropertiesPatch>(
  "AmazonQPropertiesPatch",
)({
  isEnabled: S.Boolean,
  profileArn: S.optional(S.String),
  authMode: S.optional(S.String),
}) {}
export class MlflowPropertiesPatch extends S.Class<MlflowPropertiesPatch>(
  "MlflowPropertiesPatch",
)({ trackingServerArn: S.optional(S.String) }) {}
export class FormEntryInput extends S.Class<FormEntryInput>("FormEntryInput")({
  typeIdentifier: S.String,
  typeRevision: S.String,
  required: S.optional(S.Boolean),
}) {}
export type RowFilterList = RowFilter[];
export const RowFilterList = S.Array(
  S.suspend(() => RowFilter),
) as any as S.Schema<RowFilterList>;
export const ComputeEnvironmentsList = S.Array(S.String);
export class AssetPermission extends S.Class<AssetPermission>(
  "AssetPermission",
)({ assetId: S.String, permissions: Permissions }) {}
export const AssetPermissions = S.Array(AssetPermission);
export const PolicyGrantDetail = S.Union(
  S.Struct({ createDomainUnit: CreateDomainUnitPolicyGrantDetail }),
  S.Struct({
    overrideDomainUnitOwners: OverrideDomainUnitOwnersPolicyGrantDetail,
  }),
  S.Struct({ addToProjectMemberPool: AddToProjectMemberPoolPolicyGrantDetail }),
  S.Struct({ overrideProjectOwners: OverrideProjectOwnersPolicyGrantDetail }),
  S.Struct({ createGlossary: CreateGlossaryPolicyGrantDetail }),
  S.Struct({ createFormType: CreateFormTypePolicyGrantDetail }),
  S.Struct({ createAssetType: CreateAssetTypePolicyGrantDetail }),
  S.Struct({ createProject: CreateProjectPolicyGrantDetail }),
  S.Struct({
    createEnvironmentProfile: CreateEnvironmentProfilePolicyGrantDetail,
  }),
  S.Struct({ delegateCreateEnvironmentProfile: Unit }),
  S.Struct({ createEnvironment: Unit }),
  S.Struct({ createEnvironmentFromBlueprint: Unit }),
  S.Struct({
    createProjectFromProjectProfile:
      CreateProjectFromProjectProfilePolicyGrantDetail,
  }),
  S.Struct({ useAssetType: UseAssetTypePolicyGrantDetail }),
);
export class BatchGetAttributeOutput extends S.Class<BatchGetAttributeOutput>(
  "BatchGetAttributeOutput",
)({ attributeIdentifier: S.String, forms: S.optional(FormOutputList) }) {}
export const BatchGetAttributeItems = S.Array(BatchGetAttributeOutput);
export class AttributeError extends S.Class<AttributeError>("AttributeError")({
  attributeIdentifier: S.String,
  code: S.String,
  message: S.String,
}) {}
export const AttributesErrors = S.Array(AttributeError);
export class EnvironmentConfigurationUserParameter extends S.Class<EnvironmentConfigurationUserParameter>(
  "EnvironmentConfigurationUserParameter",
)({
  environmentId: S.optional(S.String),
  environmentResolvedAccount: S.optional(EnvironmentResolvedAccount),
  environmentConfigurationName: S.optional(S.String),
  environmentParameters: S.optional(EnvironmentParametersList),
}) {}
export const EnvironmentConfigurationUserParametersList = S.Array(
  EnvironmentConfigurationUserParameter,
);
export const GrantedEntityInput = S.Union(
  S.Struct({ listing: ListingRevisionInput }),
);
export const SubscribedPrincipalInput = S.Union(
  S.Struct({ project: SubscribedProjectInput }),
  S.Struct({ user: SubscribedUserInput }),
  S.Struct({ group: SubscribedGroupInput }),
);
export const SubscribedPrincipalInputs = S.Array(SubscribedPrincipalInput);
export class ConnectionCredentials extends S.Class<ConnectionCredentials>(
  "ConnectionCredentials",
)({
  accessKeyId: S.optional(S.String),
  secretAccessKey: S.optional(S.String),
  sessionToken: S.optional(S.String),
  expiration: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class JobRunError extends S.Class<JobRunError>("JobRunError")({
  message: S.String,
}) {}
export class LineageNodeReference extends S.Class<LineageNodeReference>(
  "LineageNodeReference",
)({
  id: S.optional(S.String),
  eventTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const LineageNodeReferenceList = S.Array(LineageNodeReference);
export class ProjectDeletionError extends S.Class<ProjectDeletionError>(
  "ProjectDeletionError",
)({ code: S.optional(S.String), message: S.optional(S.String) }) {}
export const FailureReasons = S.Array(ProjectDeletionError);
export class ResourceTag extends S.Class<ResourceTag>("ResourceTag")({
  key: S.String,
  value: S.String,
  source: S.String,
}) {}
export const ResourceTags = S.Array(ResourceTag);
export class TimeSeriesDataPointFormOutput extends S.Class<TimeSeriesDataPointFormOutput>(
  "TimeSeriesDataPointFormOutput",
)({
  formName: S.String,
  typeIdentifier: S.String,
  typeRevision: S.optional(S.String),
  timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  content: S.optional(S.String),
  id: S.optional(S.String),
}) {}
export class AccountPoolSummary extends S.Class<AccountPoolSummary>(
  "AccountPoolSummary",
)({
  domainId: S.optional(S.String),
  id: S.optional(S.String),
  name: S.optional(S.String),
  resolutionStrategy: S.optional(S.String),
  domainUnitId: S.optional(S.String),
  createdBy: S.optional(S.String),
  updatedBy: S.optional(S.String),
}) {}
export const AccountPoolSummaries = S.Array(AccountPoolSummary);
export class AssetFilterSummary extends S.Class<AssetFilterSummary>(
  "AssetFilterSummary",
)({
  id: S.String,
  domainId: S.String,
  assetId: S.String,
  name: S.String,
  description: S.optional(S.String),
  status: S.optional(S.String),
  effectiveColumnNames: S.optional(ColumnNameList),
  effectiveRowFilter: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  errorMessage: S.optional(S.String),
}) {}
export const AssetFilters = S.Array(AssetFilterSummary);
export class AssetRevision extends S.Class<AssetRevision>("AssetRevision")({
  domainId: S.optional(S.String),
  id: S.optional(S.String),
  revision: S.optional(S.String),
  createdBy: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const AssetRevisions = S.Array(AssetRevision);
export const MatchCriteria = S.Array(S.String);
export const ConnectionProperties = S.Record({
  key: S.String,
  value: S.String,
});
export const PropertyMap = S.Record({ key: S.String, value: S.String });
export const SubnetIdList = S.Array(S.String);
export const SecurityGroupIdList = S.Array(S.String);
export class PhysicalConnectionRequirements extends S.Class<PhysicalConnectionRequirements>(
  "PhysicalConnectionRequirements",
)({
  subnetId: S.optional(S.String),
  subnetIdList: S.optional(SubnetIdList),
  securityGroupIdList: S.optional(SecurityGroupIdList),
  availabilityZone: S.optional(S.String),
}) {}
export class OAuth2ClientApplication extends S.Class<OAuth2ClientApplication>(
  "OAuth2ClientApplication",
)({
  userManagedClientApplicationClientId: S.optional(S.String),
  aWSManagedClientApplicationReference: S.optional(S.String),
}) {}
export const TokenUrlParametersMap = S.Record({
  key: S.String,
  value: S.String,
});
export class AuthorizationCodeProperties extends S.Class<AuthorizationCodeProperties>(
  "AuthorizationCodeProperties",
)({
  authorizationCode: S.optional(S.String),
  redirectUri: S.optional(S.String),
}) {}
export class GlueOAuth2Credentials extends S.Class<GlueOAuth2Credentials>(
  "GlueOAuth2Credentials",
)({
  userManagedClientApplicationClientSecret: S.optional(S.String),
  accessToken: S.optional(S.String),
  refreshToken: S.optional(S.String),
  jwtToken: S.optional(S.String),
}) {}
export class OAuth2Properties extends S.Class<OAuth2Properties>(
  "OAuth2Properties",
)({
  oAuth2GrantType: S.optional(S.String),
  oAuth2ClientApplication: S.optional(OAuth2ClientApplication),
  tokenUrl: S.optional(S.String),
  tokenUrlParametersMap: S.optional(TokenUrlParametersMap),
  authorizationCodeProperties: S.optional(AuthorizationCodeProperties),
  oAuth2Credentials: S.optional(GlueOAuth2Credentials),
}) {}
export class AuthenticationConfiguration extends S.Class<AuthenticationConfiguration>(
  "AuthenticationConfiguration",
)({
  authenticationType: S.optional(S.String),
  secretArn: S.optional(S.String),
  oAuth2Properties: S.optional(OAuth2Properties),
}) {}
export class GlueConnection extends S.Class<GlueConnection>("GlueConnection")({
  name: S.optional(S.String),
  description: S.optional(S.String),
  connectionType: S.optional(S.String),
  matchCriteria: S.optional(MatchCriteria),
  connectionProperties: S.optional(ConnectionProperties),
  sparkProperties: S.optional(PropertyMap),
  athenaProperties: S.optional(PropertyMap),
  pythonProperties: S.optional(PropertyMap),
  physicalConnectionRequirements: S.optional(PhysicalConnectionRequirements),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedBy: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  lastConnectionValidationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  authenticationConfiguration: S.optional(AuthenticationConfiguration),
  connectionSchemaVersion: S.optional(S.Number),
  compatibleComputeEnvironments: S.optional(ComputeEnvironmentsList),
}) {}
export class PhysicalEndpoint extends S.Class<PhysicalEndpoint>(
  "PhysicalEndpoint",
)({
  awsLocation: S.optional(AwsLocation),
  glueConnectionName: S.optional(S.String),
  glueConnection: S.optional(GlueConnection),
  enableTrustedIdentityPropagation: S.optional(S.Boolean),
  host: S.optional(S.String),
  port: S.optional(S.Number),
  protocol: S.optional(S.String),
  stage: S.optional(S.String),
}) {}
export const PhysicalEndpoints = S.Array(PhysicalEndpoint);
export class AthenaPropertiesOutput extends S.Class<AthenaPropertiesOutput>(
  "AthenaPropertiesOutput",
)({ workgroupName: S.optional(S.String) }) {}
export class GluePropertiesOutput extends S.Class<GluePropertiesOutput>(
  "GluePropertiesOutput",
)({ status: S.optional(S.String), errorMessage: S.optional(S.String) }) {}
export class HyperPodPropertiesOutput extends S.Class<HyperPodPropertiesOutput>(
  "HyperPodPropertiesOutput",
)({
  clusterName: S.String,
  clusterArn: S.optional(S.String),
  orchestrator: S.optional(S.String),
}) {}
export class IamPropertiesOutput extends S.Class<IamPropertiesOutput>(
  "IamPropertiesOutput",
)({
  environmentId: S.optional(S.String),
  glueLineageSyncEnabled: S.optional(S.Boolean),
}) {}
export class RedshiftLineageSyncConfigurationOutput extends S.Class<RedshiftLineageSyncConfigurationOutput>(
  "RedshiftLineageSyncConfigurationOutput",
)({
  lineageJobId: S.optional(S.String),
  enabled: S.optional(S.Boolean),
  schedule: S.optional(LineageSyncSchedule),
}) {}
export class RedshiftPropertiesOutput extends S.Class<RedshiftPropertiesOutput>(
  "RedshiftPropertiesOutput",
)({
  storage: S.optional(RedshiftStorageProperties),
  credentials: S.optional(RedshiftCredentials),
  isProvisionedSecret: S.optional(S.Boolean),
  jdbcIamUrl: S.optional(S.String),
  jdbcUrl: S.optional(S.String),
  redshiftTempDir: S.optional(S.String),
  lineageSync: S.optional(RedshiftLineageSyncConfigurationOutput),
  status: S.optional(S.String),
  databaseName: S.optional(S.String),
}) {}
export class ManagedEndpointCredentials extends S.Class<ManagedEndpointCredentials>(
  "ManagedEndpointCredentials",
)({ id: S.optional(S.String), token: S.optional(S.String) }) {}
export class SparkEmrPropertiesOutput extends S.Class<SparkEmrPropertiesOutput>(
  "SparkEmrPropertiesOutput",
)({
  computeArn: S.optional(S.String),
  credentials: S.optional(UsernamePassword),
  credentialsExpiration: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  governanceType: S.optional(S.String),
  instanceProfileArn: S.optional(S.String),
  javaVirtualEnv: S.optional(S.String),
  livyEndpoint: S.optional(S.String),
  logUri: S.optional(S.String),
  pythonVirtualEnv: S.optional(S.String),
  runtimeRole: S.optional(S.String),
  trustedCertificatesS3Uri: S.optional(S.String),
  certificateData: S.optional(S.String),
  managedEndpointArn: S.optional(S.String),
  managedEndpointCredentials: S.optional(ManagedEndpointCredentials),
}) {}
export class SparkGlueArgs extends S.Class<SparkGlueArgs>("SparkGlueArgs")({
  connection: S.optional(S.String),
}) {}
export class SparkGluePropertiesOutput extends S.Class<SparkGluePropertiesOutput>(
  "SparkGluePropertiesOutput",
)({
  additionalArgs: S.optional(SparkGlueArgs),
  glueConnectionName: S.optional(S.String),
  glueVersion: S.optional(S.String),
  idleTimeout: S.optional(S.Number),
  javaVirtualEnv: S.optional(S.String),
  numberOfWorkers: S.optional(S.Number),
  pythonVirtualEnv: S.optional(S.String),
  workerType: S.optional(S.String),
}) {}
export class S3PropertiesOutput extends S.Class<S3PropertiesOutput>(
  "S3PropertiesOutput",
)({
  s3Uri: S.String,
  s3AccessGrantLocationId: S.optional(S.String),
  status: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export class AmazonQPropertiesOutput extends S.Class<AmazonQPropertiesOutput>(
  "AmazonQPropertiesOutput",
)({
  isEnabled: S.Boolean,
  profileArn: S.optional(S.String),
  authMode: S.optional(S.String),
}) {}
export class MlflowPropertiesOutput extends S.Class<MlflowPropertiesOutput>(
  "MlflowPropertiesOutput",
)({ trackingServerArn: S.optional(S.String) }) {}
export const ConnectionPropertiesOutput = S.Union(
  S.Struct({ athenaProperties: AthenaPropertiesOutput }),
  S.Struct({ glueProperties: GluePropertiesOutput }),
  S.Struct({ hyperPodProperties: HyperPodPropertiesOutput }),
  S.Struct({ iamProperties: IamPropertiesOutput }),
  S.Struct({ redshiftProperties: RedshiftPropertiesOutput }),
  S.Struct({ sparkEmrProperties: SparkEmrPropertiesOutput }),
  S.Struct({ sparkGlueProperties: SparkGluePropertiesOutput }),
  S.Struct({ s3Properties: S3PropertiesOutput }),
  S.Struct({ amazonQProperties: AmazonQPropertiesOutput }),
  S.Struct({ mlflowProperties: MlflowPropertiesOutput }),
);
export class ConnectionSummary extends S.Class<ConnectionSummary>(
  "ConnectionSummary",
)({
  connectionId: S.String,
  domainId: S.String,
  domainUnitId: S.String,
  environmentId: S.optional(S.String),
  name: S.String,
  physicalEndpoints: PhysicalEndpoints,
  projectId: S.optional(S.String),
  props: S.optional(ConnectionPropertiesOutput),
  type: S.String,
  scope: S.optional(S.String),
}) {}
export const ConnectionSummaries = S.Array(ConnectionSummary);
export class DataProductRevision extends S.Class<DataProductRevision>(
  "DataProductRevision",
)({
  domainId: S.optional(S.String),
  id: S.optional(S.String),
  revision: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
}) {}
export const DataProductRevisions = S.Array(DataProductRevision);
export class EnvironmentActionSummary extends S.Class<EnvironmentActionSummary>(
  "EnvironmentActionSummary",
)({
  domainId: S.String,
  environmentId: S.String,
  id: S.String,
  name: S.String,
  parameters: ActionParameters,
  description: S.optional(S.String),
}) {}
export const ListEnvironmentActionSummaries = S.Array(EnvironmentActionSummary);
export class EnvironmentBlueprintSummary extends S.Class<EnvironmentBlueprintSummary>(
  "EnvironmentBlueprintSummary",
)({
  id: S.String,
  name: S.String,
  description: S.optional(S.String),
  provider: S.String,
  provisioningProperties: ProvisioningProperties,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const EnvironmentBlueprintSummaries = S.Array(
  EnvironmentBlueprintSummary,
);
export class EnvironmentProfileSummary extends S.Class<EnvironmentProfileSummary>(
  "EnvironmentProfileSummary",
)({
  id: S.String,
  domainId: S.String,
  awsAccountId: S.optional(S.String),
  awsAccountRegion: S.optional(S.String),
  createdBy: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  name: S.String,
  description: S.optional(S.String),
  environmentBlueprintId: S.String,
  projectId: S.optional(S.String),
}) {}
export const EnvironmentProfileSummaries = S.Array(EnvironmentProfileSummary);
export class EnvironmentSummary extends S.Class<EnvironmentSummary>(
  "EnvironmentSummary",
)({
  projectId: S.String,
  id: S.optional(S.String),
  domainId: S.String,
  createdBy: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  name: S.String,
  description: S.optional(S.String),
  environmentProfileId: S.optional(S.String),
  awsAccountId: S.optional(S.String),
  awsAccountRegion: S.optional(S.String),
  provider: S.String,
  status: S.optional(S.String),
  environmentConfigurationId: S.optional(S.String),
}) {}
export const EnvironmentSummaries = S.Array(EnvironmentSummary);
export class JobRunSummary extends S.Class<JobRunSummary>("JobRunSummary")({
  domainId: S.optional(S.String),
  jobId: S.optional(S.String),
  jobType: S.optional(S.String),
  runId: S.optional(S.String),
  runMode: S.optional(S.String),
  status: S.optional(S.String),
  error: S.optional(JobRunError),
  createdBy: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const JobRunSummaries = S.Array(JobRunSummary);
export class LineageNodeSummary extends S.Class<LineageNodeSummary>(
  "LineageNodeSummary",
)({
  domainId: S.String,
  name: S.optional(S.String),
  description: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedBy: S.optional(S.String),
  id: S.String,
  typeName: S.String,
  typeRevision: S.optional(S.String),
  sourceIdentifier: S.optional(S.String),
  eventTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const LineageNodeSummaries = S.Array(LineageNodeSummary);
export class PolicyGrantMember extends S.Class<PolicyGrantMember>(
  "PolicyGrantMember",
)({
  principal: S.optional(PolicyGrantPrincipal),
  detail: S.optional(PolicyGrantDetail),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  grantId: S.optional(S.String),
}) {}
export const PolicyGrantList = S.Array(PolicyGrantMember);
export class ProjectProfileSummary extends S.Class<ProjectProfileSummary>(
  "ProjectProfileSummary",
)({
  domainId: S.String,
  id: S.String,
  name: S.String,
  description: S.optional(S.String),
  status: S.optional(S.String),
  createdBy: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  domainUnitId: S.optional(S.String),
}) {}
export const ProjectProfileSummaries = S.Array(ProjectProfileSummary);
export class ProjectSummary extends S.Class<ProjectSummary>("ProjectSummary")({
  domainId: S.String,
  id: S.String,
  name: S.String,
  description: S.optional(S.String),
  projectStatus: S.optional(S.String),
  failureReasons: S.optional(FailureReasons),
  createdBy: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  domainUnitId: S.optional(S.String),
}) {}
export const ProjectSummaries = S.Array(ProjectSummary);
export class SubscriptionGrantSummary extends S.Class<SubscriptionGrantSummary>(
  "SubscriptionGrantSummary",
)({
  id: S.String,
  createdBy: S.String,
  updatedBy: S.optional(S.String),
  domainId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  environmentId: S.optional(S.String),
  subscriptionTargetId: S.String,
  grantedEntity: GrantedEntity,
  status: S.String,
  assets: S.optional(SubscribedAssets),
  subscriptionId: S.optional(S.String),
}) {}
export const SubscriptionGrants = S.Array(SubscriptionGrantSummary);
export class SubscriptionSummary extends S.Class<SubscriptionSummary>(
  "SubscriptionSummary",
)({
  id: S.String,
  createdBy: S.String,
  updatedBy: S.optional(S.String),
  domainId: S.String,
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  subscribedPrincipal: SubscribedPrincipal,
  subscribedListing: SubscribedListing,
  subscriptionRequestId: S.optional(S.String),
  retainPermissions: S.optional(S.Boolean),
}) {}
export const Subscriptions = S.Array(SubscriptionSummary);
export class SubscriptionTargetSummary extends S.Class<SubscriptionTargetSummary>(
  "SubscriptionTargetSummary",
)({
  id: S.String,
  authorizedPrincipals: AuthorizedPrincipalIdentifiers,
  domainId: S.String,
  projectId: S.String,
  environmentId: S.String,
  name: S.String,
  type: S.String,
  createdBy: S.String,
  updatedBy: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  manageAccessRole: S.optional(S.String),
  applicableAssetTypes: ApplicableAssetTypes,
  subscriptionTargetConfig: SubscriptionTargetForms,
  provider: S.String,
}) {}
export const SubscriptionTargets = S.Array(SubscriptionTargetSummary);
export const TimeSeriesDataPointFormOutputList = S.Array(
  TimeSeriesDataPointFormOutput,
);
export class GroupProfileSummary extends S.Class<GroupProfileSummary>(
  "GroupProfileSummary",
)({
  domainId: S.optional(S.String),
  id: S.optional(S.String),
  status: S.optional(S.String),
  groupName: S.optional(S.String),
}) {}
export const GroupProfileSummaries = S.Array(GroupProfileSummary);
export class UserProfileSummary extends S.Class<UserProfileSummary>(
  "UserProfileSummary",
)({
  domainId: S.optional(S.String),
  id: S.optional(S.String),
  type: S.optional(S.String),
  status: S.optional(S.String),
  details: S.optional(UserProfileDetails),
}) {}
export const UserProfileSummaries = S.Array(UserProfileSummary);
export const FormsInputMap = S.Record({ key: S.String, value: FormEntryInput });
export class DataSourceSummary extends S.Class<DataSourceSummary>(
  "DataSourceSummary",
)({
  domainId: S.String,
  environmentId: S.optional(S.String),
  connectionId: S.optional(S.String),
  dataSourceId: S.String,
  name: S.String,
  type: S.String,
  status: S.String,
  enableSetting: S.optional(S.String),
  schedule: S.optional(ScheduleConfiguration),
  lastRunStatus: S.optional(S.String),
  lastRunAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastRunErrorMessage: S.optional(DataSourceErrorMessage),
  lastRunAssetCount: S.optional(S.Number),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  description: S.optional(S.String),
}) {}
export const DataSourceSummaries = S.Array(DataSourceSummary);
export class RunStatisticsForAssets extends S.Class<RunStatisticsForAssets>(
  "RunStatisticsForAssets",
)({
  added: S.optional(S.Number),
  updated: S.optional(S.Number),
  unchanged: S.optional(S.Number),
  skipped: S.optional(S.Number),
  failed: S.optional(S.Number),
}) {}
export class DataSourceRunLineageSummary extends S.Class<DataSourceRunLineageSummary>(
  "DataSourceRunLineageSummary",
)({ importStatus: S.optional(S.String) }) {}
export class DataSourceRunSummary extends S.Class<DataSourceRunSummary>(
  "DataSourceRunSummary",
)({
  id: S.String,
  dataSourceId: S.String,
  type: S.String,
  status: S.String,
  projectId: S.String,
  runStatisticsForAssets: S.optional(RunStatisticsForAssets),
  errorMessage: S.optional(DataSourceErrorMessage),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  stoppedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lineageSummary: S.optional(DataSourceRunLineageSummary),
}) {}
export const DataSourceRunSummaries = S.Array(DataSourceRunSummary);
export class DomainSummary extends S.Class<DomainSummary>("DomainSummary")({
  id: S.String,
  name: S.String,
  description: S.optional(S.String),
  arn: S.String,
  managedAccountId: S.String,
  status: S.String,
  portalUrl: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  domainVersion: S.optional(S.String),
}) {}
export const DomainSummaries = S.Array(DomainSummary);
export class DomainUnitSummary extends S.Class<DomainUnitSummary>(
  "DomainUnitSummary",
)({ name: S.String, id: S.String }) {}
export const DomainUnitSummaries = S.Array(DomainUnitSummary);
export class EnvironmentBlueprintConfigurationItem extends S.Class<EnvironmentBlueprintConfigurationItem>(
  "EnvironmentBlueprintConfigurationItem",
)({
  domainId: S.String,
  environmentBlueprintId: S.String,
  provisioningRoleArn: S.optional(S.String),
  environmentRolePermissionBoundary: S.optional(S.String),
  manageAccessRoleArn: S.optional(S.String),
  enabledRegions: S.optional(EnabledRegionList),
  regionalParameters: S.optional(RegionalParameterMap),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  provisioningConfigurations: S.optional(ProvisioningConfigurationList),
}) {}
export const EnvironmentBlueprintConfigurations = S.Array(
  EnvironmentBlueprintConfigurationItem,
);
export class Import extends S.Class<Import>("Import")({
  name: S.String,
  revision: S.String,
}) {}
export const ImportList = S.Array(Import);
export class MetadataGenerationRunTypeStat extends S.Class<MetadataGenerationRunTypeStat>(
  "MetadataGenerationRunTypeStat",
)({ type: S.String, status: S.String, errorMessage: S.optional(S.String) }) {}
export const MetadataGenerationRunTypeStats = S.Array(
  MetadataGenerationRunTypeStat,
);
export class MetadataGenerationRunItem extends S.Class<MetadataGenerationRunItem>(
  "MetadataGenerationRunItem",
)({
  domainId: S.String,
  id: S.String,
  target: S.optional(MetadataGenerationRunTarget),
  status: S.optional(S.String),
  type: S.optional(S.String),
  types: S.optional(MetadataGenerationRunTypes),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  owningProjectId: S.String,
}) {}
export const MetadataGenerationRuns = S.Array(MetadataGenerationRunItem);
export class RuleSummary extends S.Class<RuleSummary>("RuleSummary")({
  identifier: S.optional(S.String),
  revision: S.optional(S.String),
  ruleType: S.optional(S.String),
  name: S.optional(S.String),
  targetType: S.optional(S.String),
  target: S.optional(RuleTarget),
  action: S.optional(S.String),
  scope: S.optional(RuleScope),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedBy: S.optional(S.String),
}) {}
export const RuleSummaries = S.Array(RuleSummary);
export const EnvironmentFailureReasonsList = S.Array(EnvironmentError);
export class AcceptPredictionsOutput extends S.Class<AcceptPredictionsOutput>(
  "AcceptPredictionsOutput",
)({ domainId: S.String, assetId: S.String, revision: S.String }) {}
export class AcceptSubscriptionRequestInput extends S.Class<AcceptSubscriptionRequestInput>(
  "AcceptSubscriptionRequestInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    decisionComment: S.optional(S.String),
    assetScopes: S.optional(AcceptedAssetScopes),
    assetPermissions: S.optional(AssetPermissions),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v2/domains/{domainIdentifier}/subscription-requests/{identifier}/accept",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AddEntityOwnerInput extends S.Class<AddEntityOwnerInput>(
  "AddEntityOwnerInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    owner: OwnerProperties,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/entities/{entityType}/{entityIdentifier}/addOwner",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AddEntityOwnerOutput extends S.Class<AddEntityOwnerOutput>(
  "AddEntityOwnerOutput",
)({}) {}
export class BatchGetAttributesMetadataOutput extends S.Class<BatchGetAttributesMetadataOutput>(
  "BatchGetAttributesMetadataOutput",
)({
  attributes: S.optional(BatchGetAttributeItems),
  errors: AttributesErrors,
}) {}
export class CreateAccountPoolInput extends S.Class<CreateAccountPoolInput>(
  "CreateAccountPoolInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: S.String,
    description: S.optional(S.String),
    resolutionStrategy: S.String,
    accountSource: AccountSource,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/account-pools",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateEnvironmentOutput extends S.Class<CreateEnvironmentOutput>(
  "CreateEnvironmentOutput",
)({
  projectId: S.String,
  id: S.optional(S.String),
  domainId: S.String,
  createdBy: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  name: S.String,
  description: S.optional(S.String),
  environmentProfileId: S.optional(S.String),
  awsAccountId: S.optional(S.String),
  awsAccountRegion: S.optional(S.String),
  provider: S.String,
  provisionedResources: S.optional(ResourceList),
  status: S.optional(S.String),
  environmentActions: S.optional(EnvironmentActionList),
  glossaryTerms: S.optional(GlossaryTerms),
  userParameters: S.optional(CustomParameterList),
  lastDeployment: S.optional(Deployment),
  provisioningProperties: S.optional(ProvisioningProperties),
  deploymentProperties: S.optional(DeploymentProperties),
  environmentBlueprintId: S.optional(S.String),
  environmentConfigurationId: S.optional(S.String),
}) {}
export class CreateEnvironmentActionInput extends S.Class<CreateEnvironmentActionInput>(
  "CreateEnvironmentActionInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    name: S.String,
    parameters: ActionParameters,
    description: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/actions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateEnvironmentBlueprintInput extends S.Class<CreateEnvironmentBlueprintInput>(
  "CreateEnvironmentBlueprintInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: S.String,
    description: S.optional(S.String),
    provisioningProperties: ProvisioningProperties,
    userParameters: S.optional(CustomParameterList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/environment-blueprints",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateProjectInput extends S.Class<CreateProjectInput>(
  "CreateProjectInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: S.String,
    description: S.optional(S.String),
    resourceTags: S.optional(Tags),
    glossaryTerms: S.optional(GlossaryTerms),
    domainUnitId: S.optional(S.String),
    projectProfileId: S.optional(S.String),
    userParameters: S.optional(EnvironmentConfigurationUserParametersList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v2/domains/{domainIdentifier}/projects" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSubscriptionGrantInput extends S.Class<CreateSubscriptionGrantInput>(
  "CreateSubscriptionGrantInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String,
    subscriptionTargetIdentifier: S.optional(S.String),
    grantedEntity: GrantedEntityInput,
    assetTargetNames: S.optional(AssetTargetNames),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/subscription-grants",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSubscriptionRequestInput extends S.Class<CreateSubscriptionRequestInput>(
  "CreateSubscriptionRequestInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    subscribedPrincipals: SubscribedPrincipalInputs,
    subscribedListings: SubscribedListingInputs,
    requestReason: S.String,
    clientToken: S.optional(S.String),
    metadataForms: S.optional(MetadataFormInputs),
    assetPermissions: S.optional(AssetPermissions),
    assetScopes: S.optional(AcceptedAssetScopes),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/subscription-requests",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSubscriptionTargetOutput extends S.Class<CreateSubscriptionTargetOutput>(
  "CreateSubscriptionTargetOutput",
)({
  id: S.String,
  authorizedPrincipals: AuthorizedPrincipalIdentifiers,
  domainId: S.String,
  projectId: S.String,
  environmentId: S.String,
  name: S.String,
  type: S.String,
  createdBy: S.String,
  updatedBy: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  manageAccessRole: S.optional(S.String),
  applicableAssetTypes: ApplicableAssetTypes,
  subscriptionTargetConfig: SubscriptionTargetForms,
  provider: S.String,
}) {}
export class GetLineageNodeOutput extends S.Class<GetLineageNodeOutput>(
  "GetLineageNodeOutput",
)({
  domainId: S.String,
  name: S.optional(S.String),
  description: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedBy: S.optional(S.String),
  id: S.String,
  typeName: S.String,
  typeRevision: S.optional(S.String),
  sourceIdentifier: S.optional(S.String),
  eventTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  formsOutput: S.optional(FormOutputList),
  upstreamNodes: S.optional(LineageNodeReferenceList),
  downstreamNodes: S.optional(LineageNodeReferenceList),
}) {}
export const EnvironmentFailureReasons = S.Record({
  key: S.String,
  value: EnvironmentFailureReasonsList,
});
export class EnvironmentDeploymentDetails extends S.Class<EnvironmentDeploymentDetails>(
  "EnvironmentDeploymentDetails",
)({
  overallDeploymentStatus: S.optional(S.String),
  environmentFailureReasons: S.optional(EnvironmentFailureReasons),
}) {}
export class GetProjectOutput extends S.Class<GetProjectOutput>(
  "GetProjectOutput",
)({
  domainId: S.String,
  id: S.String,
  name: S.String,
  description: S.optional(S.String),
  projectStatus: S.optional(S.String),
  failureReasons: S.optional(FailureReasons),
  createdBy: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  resourceTags: S.optional(ResourceTags),
  glossaryTerms: S.optional(GlossaryTerms),
  domainUnitId: S.optional(S.String),
  projectProfileId: S.optional(S.String),
  userParameters: S.optional(EnvironmentConfigurationUserParametersList),
  environmentDeploymentDetails: S.optional(EnvironmentDeploymentDetails),
}) {}
export class GetTimeSeriesDataPointOutput extends S.Class<GetTimeSeriesDataPointOutput>(
  "GetTimeSeriesDataPointOutput",
)({
  domainId: S.optional(S.String),
  entityId: S.optional(S.String),
  entityType: S.optional(S.String),
  formName: S.optional(S.String),
  form: S.optional(TimeSeriesDataPointFormOutput),
}) {}
export class ListAccountPoolsOutput extends S.Class<ListAccountPoolsOutput>(
  "ListAccountPoolsOutput",
)({
  items: S.optional(AccountPoolSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListAssetFiltersOutput extends S.Class<ListAssetFiltersOutput>(
  "ListAssetFiltersOutput",
)({ items: AssetFilters, nextToken: S.optional(S.String) }) {}
export class ListAssetRevisionsOutput extends S.Class<ListAssetRevisionsOutput>(
  "ListAssetRevisionsOutput",
)({ items: S.optional(AssetRevisions), nextToken: S.optional(S.String) }) {}
export class ListConnectionsOutput extends S.Class<ListConnectionsOutput>(
  "ListConnectionsOutput",
)({ items: ConnectionSummaries, nextToken: S.optional(S.String) }) {}
export class ListDataProductRevisionsOutput extends S.Class<ListDataProductRevisionsOutput>(
  "ListDataProductRevisionsOutput",
)({ items: DataProductRevisions, nextToken: S.optional(S.String) }) {}
export class ListEnvironmentActionsOutput extends S.Class<ListEnvironmentActionsOutput>(
  "ListEnvironmentActionsOutput",
)({
  items: S.optional(ListEnvironmentActionSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListEnvironmentBlueprintsOutput extends S.Class<ListEnvironmentBlueprintsOutput>(
  "ListEnvironmentBlueprintsOutput",
)({ items: EnvironmentBlueprintSummaries, nextToken: S.optional(S.String) }) {}
export class ListEnvironmentProfilesOutput extends S.Class<ListEnvironmentProfilesOutput>(
  "ListEnvironmentProfilesOutput",
)({ items: EnvironmentProfileSummaries, nextToken: S.optional(S.String) }) {}
export class ListEnvironmentsOutput extends S.Class<ListEnvironmentsOutput>(
  "ListEnvironmentsOutput",
)({ items: EnvironmentSummaries, nextToken: S.optional(S.String) }) {}
export class ListJobRunsOutput extends S.Class<ListJobRunsOutput>(
  "ListJobRunsOutput",
)({ items: S.optional(JobRunSummaries), nextToken: S.optional(S.String) }) {}
export class ListLineageNodeHistoryOutput extends S.Class<ListLineageNodeHistoryOutput>(
  "ListLineageNodeHistoryOutput",
)({
  nodes: S.optional(LineageNodeSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListPolicyGrantsOutput extends S.Class<ListPolicyGrantsOutput>(
  "ListPolicyGrantsOutput",
)({ grantList: PolicyGrantList, nextToken: S.optional(S.String) }) {}
export class ListProjectProfilesOutput extends S.Class<ListProjectProfilesOutput>(
  "ListProjectProfilesOutput",
)({
  items: S.optional(ProjectProfileSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListProjectsOutput extends S.Class<ListProjectsOutput>(
  "ListProjectsOutput",
)({ items: S.optional(ProjectSummaries), nextToken: S.optional(S.String) }) {}
export class ListSubscriptionGrantsOutput extends S.Class<ListSubscriptionGrantsOutput>(
  "ListSubscriptionGrantsOutput",
)({ items: SubscriptionGrants, nextToken: S.optional(S.String) }) {}
export class ListSubscriptionsOutput extends S.Class<ListSubscriptionsOutput>(
  "ListSubscriptionsOutput",
)({ items: Subscriptions, nextToken: S.optional(S.String) }) {}
export class ListSubscriptionTargetsOutput extends S.Class<ListSubscriptionTargetsOutput>(
  "ListSubscriptionTargetsOutput",
)({ items: SubscriptionTargets, nextToken: S.optional(S.String) }) {}
export class ListTimeSeriesDataPointsOutput extends S.Class<ListTimeSeriesDataPointsOutput>(
  "ListTimeSeriesDataPointsOutput",
)({
  items: S.optional(TimeSeriesDataPointSummaryFormOutputList),
  nextToken: S.optional(S.String),
}) {}
export class PostTimeSeriesDataPointsOutput extends S.Class<PostTimeSeriesDataPointsOutput>(
  "PostTimeSeriesDataPointsOutput",
)({
  domainId: S.optional(S.String),
  entityId: S.optional(S.String),
  entityType: S.optional(S.String),
  forms: S.optional(TimeSeriesDataPointFormOutputList),
}) {}
export class RejectPredictionsOutput extends S.Class<RejectPredictionsOutput>(
  "RejectPredictionsOutput",
)({ domainId: S.String, assetId: S.String, assetRevision: S.String }) {}
export class SearchInput extends S.Class<SearchInput>("SearchInput")(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    owningProjectIdentifier: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    searchScope: S.String,
    searchText: S.optional(S.String),
    searchIn: S.optional(SearchInList),
    filters: S.optional(FilterClause),
    sort: S.optional(SearchSort),
    additionalAttributes: S.optional(SearchOutputAdditionalAttributes),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v2/domains/{domainIdentifier}/search" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchGroupProfilesOutput extends S.Class<SearchGroupProfilesOutput>(
  "SearchGroupProfilesOutput",
)({
  items: S.optional(GroupProfileSummaries),
  nextToken: S.optional(S.String),
}) {}
export class SearchUserProfilesOutput extends S.Class<SearchUserProfilesOutput>(
  "SearchUserProfilesOutput",
)({
  items: S.optional(UserProfileSummaries),
  nextToken: S.optional(S.String),
}) {}
export class UpdateSubscriptionGrantStatusOutput extends S.Class<UpdateSubscriptionGrantStatusOutput>(
  "UpdateSubscriptionGrantStatusOutput",
)({
  id: S.String,
  createdBy: S.String,
  updatedBy: S.optional(S.String),
  domainId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  environmentId: S.optional(S.String),
  subscriptionTargetId: S.String,
  grantedEntity: GrantedEntity,
  status: S.String,
  assets: S.optional(SubscribedAssets),
  subscriptionId: S.optional(S.String),
}) {}
export class CreateAssetInput extends S.Class<CreateAssetInput>(
  "CreateAssetInput",
)(
  {
    name: S.String,
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    externalIdentifier: S.optional(S.String),
    typeIdentifier: S.String,
    typeRevision: S.optional(S.String),
    description: S.optional(S.String),
    glossaryTerms: S.optional(GlossaryTerms),
    formsInput: S.optional(FormInputList),
    owningProjectIdentifier: S.String,
    predictionConfiguration: S.optional(PredictionConfiguration),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v2/domains/{domainIdentifier}/assets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAssetOutput extends S.Class<GetAssetOutput>("GetAssetOutput")({
  id: S.String,
  name: S.String,
  typeIdentifier: S.String,
  typeRevision: S.String,
  externalIdentifier: S.optional(S.String),
  revision: S.String,
  description: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  firstRevisionCreatedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  firstRevisionCreatedBy: S.optional(S.String),
  glossaryTerms: S.optional(GlossaryTerms),
  governedGlossaryTerms: S.optional(GovernedGlossaryTerms),
  owningProjectId: S.String,
  domainId: S.String,
  listing: S.optional(AssetListingDetails),
  formsOutput: FormOutputList,
  readOnlyFormsOutput: S.optional(FormOutputList),
  latestTimeSeriesDataPointFormsOutput: S.optional(
    TimeSeriesDataPointSummaryFormOutputList,
  ),
}) {}
export class CreateAssetTypeInput extends S.Class<CreateAssetTypeInput>(
  "CreateAssetTypeInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: S.String,
    description: S.optional(S.String),
    formsInput: FormsInputMap,
    owningProjectIdentifier: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/asset-types",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDataProductOutput extends S.Class<CreateDataProductOutput>(
  "CreateDataProductOutput",
)({
  domainId: S.String,
  id: S.String,
  revision: S.String,
  owningProjectId: S.String,
  name: S.String,
  status: S.String,
  description: S.optional(S.String),
  glossaryTerms: S.optional(GlossaryTerms),
  items: S.optional(DataProductItems),
  formsOutput: S.optional(FormOutputList),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  firstRevisionCreatedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  firstRevisionCreatedBy: S.optional(S.String),
}) {}
export class ListDataSourcesOutput extends S.Class<ListDataSourcesOutput>(
  "ListDataSourcesOutput",
)({ items: DataSourceSummaries, nextToken: S.optional(S.String) }) {}
export class StartDataSourceRunOutput extends S.Class<StartDataSourceRunOutput>(
  "StartDataSourceRunOutput",
)({
  domainId: S.String,
  dataSourceId: S.String,
  id: S.String,
  projectId: S.String,
  status: S.String,
  type: S.String,
  dataSourceConfigurationSnapshot: S.optional(S.String),
  runStatisticsForAssets: S.optional(RunStatisticsForAssets),
  errorMessage: S.optional(DataSourceErrorMessage),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  stoppedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class GetDataSourceRunOutput extends S.Class<GetDataSourceRunOutput>(
  "GetDataSourceRunOutput",
)({
  domainId: S.String,
  dataSourceId: S.String,
  id: S.String,
  projectId: S.String,
  status: S.String,
  type: S.String,
  dataSourceConfigurationSnapshot: S.optional(S.String),
  runStatisticsForAssets: S.optional(RunStatisticsForAssets),
  lineageSummary: S.optional(DataSourceRunLineageSummary),
  errorMessage: S.optional(DataSourceErrorMessage),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  stoppedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class ListDataSourceRunsOutput extends S.Class<ListDataSourceRunsOutput>(
  "ListDataSourceRunsOutput",
)({ items: DataSourceRunSummaries, nextToken: S.optional(S.String) }) {}
export class CreateDomainOutput extends S.Class<CreateDomainOutput>(
  "CreateDomainOutput",
)({
  id: S.String,
  rootDomainUnitId: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  singleSignOn: S.optional(SingleSignOn),
  domainExecutionRole: S.optional(S.String),
  arn: S.optional(S.String),
  kmsKeyIdentifier: S.optional(S.String),
  status: S.optional(S.String),
  portalUrl: S.optional(S.String),
  tags: S.optional(Tags),
  domainVersion: S.optional(S.String),
  serviceRole: S.optional(S.String),
}) {}
export class ListDomainsOutput extends S.Class<ListDomainsOutput>(
  "ListDomainsOutput",
)({ items: DomainSummaries, nextToken: S.optional(S.String) }) {}
export class ListDomainUnitsForParentOutput extends S.Class<ListDomainUnitsForParentOutput>(
  "ListDomainUnitsForParentOutput",
)({ items: DomainUnitSummaries, nextToken: S.optional(S.String) }) {}
export class PutEnvironmentBlueprintConfigurationInput extends S.Class<PutEnvironmentBlueprintConfigurationInput>(
  "PutEnvironmentBlueprintConfigurationInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentBlueprintIdentifier: S.String.pipe(
      T.HttpLabel("environmentBlueprintIdentifier"),
    ),
    provisioningRoleArn: S.optional(S.String),
    manageAccessRoleArn: S.optional(S.String),
    environmentRolePermissionBoundary: S.optional(S.String),
    enabledRegions: EnabledRegionList,
    regionalParameters: S.optional(RegionalParameterMap),
    globalParameters: S.optional(GlobalParameterMap),
    provisioningConfigurations: S.optional(ProvisioningConfigurationList),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v2/domains/{domainIdentifier}/environment-blueprint-configurations/{environmentBlueprintIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEnvironmentBlueprintConfigurationsOutput extends S.Class<ListEnvironmentBlueprintConfigurationsOutput>(
  "ListEnvironmentBlueprintConfigurationsOutput",
)({
  items: S.optional(EnvironmentBlueprintConfigurations),
  nextToken: S.optional(S.String),
}) {}
export class CreateFormTypeOutput extends S.Class<CreateFormTypeOutput>(
  "CreateFormTypeOutput",
)({
  domainId: S.String,
  name: S.String,
  revision: S.String,
  description: S.optional(S.String),
  owningProjectId: S.optional(S.String),
  originDomainId: S.optional(S.String),
  originProjectId: S.optional(S.String),
}) {}
export class GetFormTypeOutput extends S.Class<GetFormTypeOutput>(
  "GetFormTypeOutput",
)({
  domainId: S.String,
  name: S.String,
  revision: S.String,
  model: Model,
  owningProjectId: S.optional(S.String),
  originDomainId: S.optional(S.String),
  originProjectId: S.optional(S.String),
  status: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  description: S.optional(S.String),
  imports: S.optional(ImportList),
}) {}
export class CreateGlossaryTermOutput extends S.Class<CreateGlossaryTermOutput>(
  "CreateGlossaryTermOutput",
)({
  id: S.String,
  domainId: S.String,
  glossaryId: S.String,
  name: S.String,
  status: S.String,
  shortDescription: S.optional(S.String),
  longDescription: S.optional(S.String),
  termRelations: S.optional(TermRelations),
  usageRestrictions: S.optional(GlossaryUsageRestrictions),
}) {}
export class StartMetadataGenerationRunOutput extends S.Class<StartMetadataGenerationRunOutput>(
  "StartMetadataGenerationRunOutput",
)({
  domainId: S.String,
  id: S.String,
  status: S.optional(S.String),
  type: S.optional(S.String),
  types: S.optional(MetadataGenerationRunTypes),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  owningProjectId: S.optional(S.String),
}) {}
export class GetMetadataGenerationRunOutput extends S.Class<GetMetadataGenerationRunOutput>(
  "GetMetadataGenerationRunOutput",
)({
  domainId: S.String,
  id: S.String,
  target: S.optional(MetadataGenerationRunTarget),
  status: S.optional(S.String),
  type: S.optional(S.String),
  types: S.optional(MetadataGenerationRunTypes),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  owningProjectId: S.String,
  typeStats: S.optional(MetadataGenerationRunTypeStats),
}) {}
export class ListMetadataGenerationRunsOutput extends S.Class<ListMetadataGenerationRunsOutput>(
  "ListMetadataGenerationRunsOutput",
)({
  items: S.optional(MetadataGenerationRuns),
  nextToken: S.optional(S.String),
}) {}
export class ListRulesOutput extends S.Class<ListRulesOutput>(
  "ListRulesOutput",
)({ items: RuleSummaries, nextToken: S.optional(S.String) }) {}
export class SparkGluePropertiesInput extends S.Class<SparkGluePropertiesInput>(
  "SparkGluePropertiesInput",
)({
  additionalArgs: S.optional(SparkGlueArgs),
  glueConnectionName: S.optional(S.String),
  glueVersion: S.optional(S.String),
  idleTimeout: S.optional(S.Number),
  javaVirtualEnv: S.optional(S.String),
  numberOfWorkers: S.optional(S.Number),
  pythonVirtualEnv: S.optional(S.String),
  workerType: S.optional(S.String),
}) {}
export class LineageInfo extends S.Class<LineageInfo>("LineageInfo")({
  eventId: S.optional(S.String),
  eventStatus: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export class OwnerUserPropertiesOutput extends S.Class<OwnerUserPropertiesOutput>(
  "OwnerUserPropertiesOutput",
)({ userId: S.optional(S.String) }) {}
export class OwnerGroupPropertiesOutput extends S.Class<OwnerGroupPropertiesOutput>(
  "OwnerGroupPropertiesOutput",
)({ groupId: S.optional(S.String) }) {}
export const MetadataMap = S.Record({ key: S.String, value: S.String });
export class MetadataFormSummary extends S.Class<MetadataFormSummary>(
  "MetadataFormSummary",
)({
  formName: S.optional(S.String),
  typeName: S.String,
  typeRevision: S.String,
}) {}
export const MetadataFormsSummary = S.Array(MetadataFormSummary);
export class FormEntryOutput extends S.Class<FormEntryOutput>(
  "FormEntryOutput",
)({
  typeName: S.String,
  typeRevision: S.String,
  required: S.optional(S.Boolean),
}) {}
export const FormsOutputMap = S.Record({
  key: S.String,
  value: FormEntryOutput,
});
export class AssetTypeItem extends S.Class<AssetTypeItem>("AssetTypeItem")({
  domainId: S.String,
  name: S.String,
  revision: S.String,
  description: S.optional(S.String),
  formsOutput: FormsOutputMap,
  owningProjectId: S.String,
  originDomainId: S.optional(S.String),
  originProjectId: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedBy: S.optional(S.String),
}) {}
export class FormTypeData extends S.Class<FormTypeData>("FormTypeData")({
  domainId: S.String,
  name: S.String,
  revision: S.String,
  model: S.optional(Model),
  status: S.optional(S.String),
  owningProjectId: S.optional(S.String),
  originDomainId: S.optional(S.String),
  originProjectId: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  description: S.optional(S.String),
  imports: S.optional(ImportList),
}) {}
export class LineageNodeTypeItem extends S.Class<LineageNodeTypeItem>(
  "LineageNodeTypeItem",
)({
  domainId: S.String,
  name: S.optional(S.String),
  description: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedBy: S.optional(S.String),
  revision: S.String,
  formsOutput: FormsOutputMap,
}) {}
export const FailedQueryProcessingErrorMessages = S.Array(S.String);
export class NameIdentifier extends S.Class<NameIdentifier>("NameIdentifier")({
  name: S.optional(S.String),
  namespace: S.optional(S.String),
}) {}
export const NameIdentifiers = S.Array(NameIdentifier);
export class BasicAuthenticationCredentials extends S.Class<BasicAuthenticationCredentials>(
  "BasicAuthenticationCredentials",
)({ userName: S.optional(S.String), password: S.optional(S.String) }) {}
export class AuthenticationConfigurationPatch extends S.Class<AuthenticationConfigurationPatch>(
  "AuthenticationConfigurationPatch",
)({
  secretArn: S.optional(S.String),
  basicAuthenticationCredentials: S.optional(BasicAuthenticationCredentials),
}) {}
export class BatchPutAttributeOutput extends S.Class<BatchPutAttributeOutput>(
  "BatchPutAttributeOutput",
)({ attributeIdentifier: S.String }) {}
export const BatchPutAttributeItems = S.Array(BatchPutAttributeOutput);
export class DataSourceRunActivity extends S.Class<DataSourceRunActivity>(
  "DataSourceRunActivity",
)({
  database: S.String,
  dataSourceRunId: S.String,
  technicalName: S.String,
  dataAssetStatus: S.String,
  projectId: S.String,
  dataAssetId: S.optional(S.String),
  technicalDescription: S.optional(S.String),
  errorMessage: S.optional(DataSourceErrorMessage),
  lineageSummary: S.optional(LineageInfo),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const DataSourceRunActivities = S.Array(DataSourceRunActivity);
export const OwnerPropertiesOutput = S.Union(
  S.Struct({ user: OwnerUserPropertiesOutput }),
  S.Struct({ group: OwnerGroupPropertiesOutput }),
);
export const EntityOwners = S.Array(OwnerPropertiesOutput);
export class SubscriptionRequestSummary extends S.Class<SubscriptionRequestSummary>(
  "SubscriptionRequestSummary",
)({
  id: S.String,
  createdBy: S.String,
  updatedBy: S.optional(S.String),
  domainId: S.String,
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  requestReason: S.String,
  subscribedPrincipals: SubscribedPrincipals,
  subscribedListings: SubscribedListings,
  reviewerId: S.optional(S.String),
  decisionComment: S.optional(S.String),
  existingSubscriptionId: S.optional(S.String),
  metadataFormsSummary: S.optional(MetadataFormsSummary),
}) {}
export const SubscriptionRequests = S.Array(SubscriptionRequestSummary);
export const SearchTypesResultItem = S.Union(
  S.Struct({ assetTypeItem: AssetTypeItem }),
  S.Struct({ formTypeItem: FormTypeData }),
  S.Struct({ lineageNodeTypeItem: LineageNodeTypeItem }),
);
export const SearchTypesResultItems = S.Array(SearchTypesResultItem);
export class LineageSqlQueryRunDetails extends S.Class<LineageSqlQueryRunDetails>(
  "LineageSqlQueryRunDetails",
)({
  queryStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  queryEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  totalQueriesProcessed: S.optional(S.Number),
  numQueriesFailed: S.optional(S.Number),
  errorMessages: S.optional(FailedQueryProcessingErrorMessages),
}) {}
export class NotificationResource extends S.Class<NotificationResource>(
  "NotificationResource",
)({ type: S.String, id: S.String, name: S.optional(S.String) }) {}
export class UserDetails extends S.Class<UserDetails>("UserDetails")({
  userId: S.String,
}) {}
export class GroupDetails extends S.Class<GroupDetails>("GroupDetails")({
  groupId: S.String,
}) {}
export class GlueConnectionPatch extends S.Class<GlueConnectionPatch>(
  "GlueConnectionPatch",
)({
  description: S.optional(S.String),
  connectionProperties: S.optional(ConnectionProperties),
  authenticationConfiguration: S.optional(AuthenticationConfigurationPatch),
}) {}
export class ListingSummary extends S.Class<ListingSummary>("ListingSummary")({
  listingId: S.optional(S.String),
  listingRevision: S.optional(S.String),
  glossaryTerms: S.optional(DetailedGlossaryTerms),
}) {}
export const ListingSummaries = S.Array(ListingSummary);
export class AcceptSubscriptionRequestOutput extends S.Class<AcceptSubscriptionRequestOutput>(
  "AcceptSubscriptionRequestOutput",
)({
  id: S.String,
  createdBy: S.String,
  updatedBy: S.optional(S.String),
  domainId: S.String,
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  requestReason: S.String,
  subscribedPrincipals: SubscribedPrincipals,
  subscribedListings: SubscribedListings,
  reviewerId: S.optional(S.String),
  decisionComment: S.optional(S.String),
  existingSubscriptionId: S.optional(S.String),
  metadataForms: S.optional(MetadataForms),
}) {}
export class BatchPutAttributesMetadataOutput extends S.Class<BatchPutAttributesMetadataOutput>(
  "BatchPutAttributesMetadataOutput",
)({
  errors: S.optional(AttributesErrors),
  attributes: S.optional(BatchPutAttributeItems),
}) {}
export class CreateAccountPoolOutput extends S.Class<CreateAccountPoolOutput>(
  "CreateAccountPoolOutput",
)({
  domainId: S.optional(S.String),
  name: S.optional(S.String),
  id: S.optional(S.String),
  description: S.optional(S.String),
  resolutionStrategy: S.optional(S.String),
  accountSource: AccountSource,
  createdBy: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  domainUnitId: S.optional(S.String),
}) {}
export const CredentialMap = S.Record({ key: S.String, value: S.String });
export class CreateEnvironmentActionOutput extends S.Class<CreateEnvironmentActionOutput>(
  "CreateEnvironmentActionOutput",
)({
  domainId: S.String,
  environmentId: S.String,
  id: S.String,
  name: S.String,
  parameters: ActionParameters,
  description: S.optional(S.String),
}) {}
export class CreateEnvironmentBlueprintOutput extends S.Class<CreateEnvironmentBlueprintOutput>(
  "CreateEnvironmentBlueprintOutput",
)({
  id: S.String,
  name: S.String,
  description: S.optional(S.String),
  provider: S.String,
  provisioningProperties: ProvisioningProperties,
  deploymentProperties: S.optional(DeploymentProperties),
  userParameters: S.optional(CustomParameterList),
  glossaryTerms: S.optional(GlossaryTerms),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class CreateProjectOutput extends S.Class<CreateProjectOutput>(
  "CreateProjectOutput",
)({
  domainId: S.String,
  id: S.String,
  name: S.String,
  description: S.optional(S.String),
  projectStatus: S.optional(S.String),
  failureReasons: S.optional(FailureReasons),
  createdBy: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  resourceTags: S.optional(ResourceTags),
  glossaryTerms: S.optional(GlossaryTerms),
  domainUnitId: S.optional(S.String),
  projectProfileId: S.optional(S.String),
  userParameters: S.optional(EnvironmentConfigurationUserParametersList),
  environmentDeploymentDetails: S.optional(EnvironmentDeploymentDetails),
}) {}
export class CreateProjectProfileInput extends S.Class<CreateProjectProfileInput>(
  "CreateProjectProfileInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: S.String,
    description: S.optional(S.String),
    status: S.optional(S.String),
    projectResourceTags: S.optional(ProjectResourceTagParameters),
    allowCustomProjectResourceTags: S.optional(S.Boolean),
    projectResourceTagsDescription: S.optional(S.String),
    environmentConfigurations: S.optional(EnvironmentConfigurationsList),
    domainUnitIdentifier: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/project-profiles",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSubscriptionGrantOutput extends S.Class<CreateSubscriptionGrantOutput>(
  "CreateSubscriptionGrantOutput",
)({
  id: S.String,
  createdBy: S.String,
  updatedBy: S.optional(S.String),
  domainId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  environmentId: S.optional(S.String),
  subscriptionTargetId: S.String,
  grantedEntity: GrantedEntity,
  status: S.String,
  assets: S.optional(SubscribedAssets),
  subscriptionId: S.optional(S.String),
}) {}
export class CreateSubscriptionRequestOutput extends S.Class<CreateSubscriptionRequestOutput>(
  "CreateSubscriptionRequestOutput",
)({
  id: S.String,
  createdBy: S.String,
  updatedBy: S.optional(S.String),
  domainId: S.String,
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  requestReason: S.String,
  subscribedPrincipals: SubscribedPrincipals,
  subscribedListings: SubscribedListings,
  reviewerId: S.optional(S.String),
  decisionComment: S.optional(S.String),
  existingSubscriptionId: S.optional(S.String),
  metadataForms: S.optional(MetadataForms),
}) {}
export class CreateUserProfileOutput extends S.Class<CreateUserProfileOutput>(
  "CreateUserProfileOutput",
)({
  domainId: S.optional(S.String),
  id: S.optional(S.String),
  type: S.optional(S.String),
  status: S.optional(S.String),
  details: S.optional(UserProfileDetails),
}) {}
export class DeleteSubscriptionGrantOutput extends S.Class<DeleteSubscriptionGrantOutput>(
  "DeleteSubscriptionGrantOutput",
)({
  id: S.String,
  createdBy: S.String,
  updatedBy: S.optional(S.String),
  domainId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  environmentId: S.optional(S.String),
  subscriptionTargetId: S.String,
  grantedEntity: GrantedEntity,
  status: S.String,
  assets: S.optional(SubscribedAssets),
  subscriptionId: S.optional(S.String),
}) {}
export class GetEnvironmentOutput extends S.Class<GetEnvironmentOutput>(
  "GetEnvironmentOutput",
)({
  projectId: S.String,
  id: S.optional(S.String),
  domainId: S.String,
  createdBy: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  name: S.String,
  description: S.optional(S.String),
  environmentProfileId: S.optional(S.String),
  awsAccountId: S.optional(S.String),
  awsAccountRegion: S.optional(S.String),
  provider: S.String,
  provisionedResources: S.optional(ResourceList),
  status: S.optional(S.String),
  environmentActions: S.optional(EnvironmentActionList),
  glossaryTerms: S.optional(GlossaryTerms),
  userParameters: S.optional(CustomParameterList),
  lastDeployment: S.optional(Deployment),
  provisioningProperties: S.optional(ProvisioningProperties),
  deploymentProperties: S.optional(DeploymentProperties),
  environmentBlueprintId: S.optional(S.String),
  environmentConfigurationId: S.optional(S.String),
}) {}
export class ListDataSourceRunActivitiesOutput extends S.Class<ListDataSourceRunActivitiesOutput>(
  "ListDataSourceRunActivitiesOutput",
)({ items: DataSourceRunActivities, nextToken: S.optional(S.String) }) {}
export class ListEntityOwnersOutput extends S.Class<ListEntityOwnersOutput>(
  "ListEntityOwnersOutput",
)({ owners: EntityOwners, nextToken: S.optional(S.String) }) {}
export class ListSubscriptionRequestsOutput extends S.Class<ListSubscriptionRequestsOutput>(
  "ListSubscriptionRequestsOutput",
)({ items: SubscriptionRequests, nextToken: S.optional(S.String) }) {}
export class SearchTypesOutput extends S.Class<SearchTypesOutput>(
  "SearchTypesOutput",
)({
  items: S.optional(SearchTypesResultItems),
  nextToken: S.optional(S.String),
  totalMatchCount: S.optional(S.Number),
}) {}
export class UpdateProjectInput extends S.Class<UpdateProjectInput>(
  "UpdateProjectInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    resourceTags: S.optional(Tags),
    glossaryTerms: S.optional(GlossaryTerms),
    domainUnitId: S.optional(S.String),
    environmentDeploymentDetails: S.optional(EnvironmentDeploymentDetails),
    userParameters: S.optional(EnvironmentConfigurationUserParametersList),
    projectProfileVersion: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/domains/{domainIdentifier}/projects/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAssetOutput extends S.Class<CreateAssetOutput>(
  "CreateAssetOutput",
)({
  id: S.String,
  name: S.String,
  typeIdentifier: S.String,
  typeRevision: S.String,
  externalIdentifier: S.optional(S.String),
  revision: S.String,
  description: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  firstRevisionCreatedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  firstRevisionCreatedBy: S.optional(S.String),
  glossaryTerms: S.optional(GlossaryTerms),
  governedGlossaryTerms: S.optional(GovernedGlossaryTerms),
  owningProjectId: S.String,
  domainId: S.String,
  listing: S.optional(AssetListingDetails),
  formsOutput: FormOutputList,
  readOnlyFormsOutput: S.optional(FormOutputList),
  latestTimeSeriesDataPointFormsOutput: S.optional(
    TimeSeriesDataPointSummaryFormOutputList,
  ),
  predictionConfiguration: S.optional(PredictionConfiguration),
}) {}
export class CreateAssetTypeOutput extends S.Class<CreateAssetTypeOutput>(
  "CreateAssetTypeOutput",
)({
  domainId: S.String,
  name: S.String,
  revision: S.String,
  description: S.optional(S.String),
  formsOutput: FormsOutputMap,
  owningProjectId: S.optional(S.String),
  originDomainId: S.optional(S.String),
  originProjectId: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedBy: S.optional(S.String),
}) {}
export class GetAssetTypeOutput extends S.Class<GetAssetTypeOutput>(
  "GetAssetTypeOutput",
)({
  domainId: S.String,
  name: S.String,
  revision: S.String,
  description: S.optional(S.String),
  formsOutput: FormsOutputMap,
  owningProjectId: S.String,
  originDomainId: S.optional(S.String),
  originProjectId: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedBy: S.optional(S.String),
}) {}
export class CreateDomainUnitOutput extends S.Class<CreateDomainUnitOutput>(
  "CreateDomainUnitOutput",
)({
  id: S.String,
  domainId: S.String,
  name: S.String,
  parentDomainUnitId: S.optional(S.String),
  description: S.optional(S.String),
  owners: DomainUnitOwners,
  ancestorDomainUnitIds: DomainUnitIds,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
}) {}
export class PutEnvironmentBlueprintConfigurationOutput extends S.Class<PutEnvironmentBlueprintConfigurationOutput>(
  "PutEnvironmentBlueprintConfigurationOutput",
)({
  domainId: S.String,
  environmentBlueprintId: S.String,
  provisioningRoleArn: S.optional(S.String),
  environmentRolePermissionBoundary: S.optional(S.String),
  manageAccessRoleArn: S.optional(S.String),
  enabledRegions: S.optional(EnabledRegionList),
  regionalParameters: S.optional(RegionalParameterMap),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  provisioningConfigurations: S.optional(ProvisioningConfigurationList),
}) {}
export class CreateRuleInput extends S.Class<CreateRuleInput>(
  "CreateRuleInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: S.String,
    target: RuleTarget,
    action: S.String,
    scope: RuleScope,
    detail: RuleDetail,
    description: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v2/domains/{domainIdentifier}/rules" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RedshiftPropertiesInput extends S.Class<RedshiftPropertiesInput>(
  "RedshiftPropertiesInput",
)({
  storage: S.optional(RedshiftStorageProperties),
  databaseName: S.optional(S.String),
  host: S.optional(S.String),
  port: S.optional(S.Number),
  credentials: S.optional(RedshiftCredentials),
  lineageSync: S.optional(RedshiftLineageSyncConfigurationInput),
}) {}
export class LineageRunDetails extends S.Class<LineageRunDetails>(
  "LineageRunDetails",
)({ sqlQueryRunDetails: S.optional(LineageSqlQueryRunDetails) }) {}
export class Topic extends S.Class<Topic>("Topic")({
  subject: S.String,
  resource: NotificationResource,
  role: S.String,
}) {}
export const MemberDetails = S.Union(
  S.Struct({ user: UserDetails }),
  S.Struct({ group: GroupDetails }),
);
export class AggregationOutputItem extends S.Class<AggregationOutputItem>(
  "AggregationOutputItem",
)({
  value: S.optional(S.String),
  count: S.optional(S.Number),
  displayValue: S.optional(S.String),
}) {}
export const AggregationOutputItems = S.Array(AggregationOutputItem);
export class GluePropertiesPatch extends S.Class<GluePropertiesPatch>(
  "GluePropertiesPatch",
)({ glueConnectionInput: S.optional(GlueConnectionPatch) }) {}
export class AssetListing extends S.Class<AssetListing>("AssetListing")({
  assetId: S.optional(S.String),
  assetRevision: S.optional(S.String),
  assetType: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  forms: S.optional(S.String),
  latestTimeSeriesDataPointForms: S.optional(
    TimeSeriesDataPointSummaryFormOutputList,
  ),
  glossaryTerms: S.optional(DetailedGlossaryTerms),
  governedGlossaryTerms: S.optional(DetailedGlossaryTerms),
  owningProjectId: S.optional(S.String),
}) {}
export class DataProductListing extends S.Class<DataProductListing>(
  "DataProductListing",
)({
  dataProductId: S.optional(S.String),
  dataProductRevision: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  forms: S.optional(S.String),
  glossaryTerms: S.optional(DetailedGlossaryTerms),
  owningProjectId: S.optional(S.String),
  items: S.optional(ListingSummaries),
}) {}
export const JobRunDetails = S.Union(
  S.Struct({ lineageRunDetails: LineageRunDetails }),
);
export class NotificationOutput extends S.Class<NotificationOutput>(
  "NotificationOutput",
)({
  identifier: S.String,
  domainIdentifier: S.String,
  type: S.String,
  topic: Topic,
  title: S.String,
  message: S.String,
  status: S.optional(S.String),
  actionLink: S.String,
  creationTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  metadata: S.optional(MetadataMap),
}) {}
export const NotificationsList = S.Array(NotificationOutput);
export class ProjectMember extends S.Class<ProjectMember>("ProjectMember")({
  memberDetails: MemberDetails,
  designation: S.String,
}) {}
export const ProjectMembers = S.Array(ProjectMember);
export class AggregationOutput extends S.Class<AggregationOutput>(
  "AggregationOutput",
)({
  attribute: S.optional(S.String),
  displayValue: S.optional(S.String),
  items: S.optional(AggregationOutputItems),
}) {}
export const AggregationOutputList = S.Array(AggregationOutput);
export const ConnectionPropertiesPatch = S.Union(
  S.Struct({ athenaProperties: AthenaPropertiesPatch }),
  S.Struct({ glueProperties: GluePropertiesPatch }),
  S.Struct({ iamProperties: IamPropertiesPatch }),
  S.Struct({ redshiftProperties: RedshiftPropertiesPatch }),
  S.Struct({ sparkEmrProperties: SparkEmrPropertiesPatch }),
  S.Struct({ s3Properties: S3PropertiesPatch }),
  S.Struct({ amazonQProperties: AmazonQPropertiesPatch }),
  S.Struct({ mlflowProperties: MlflowPropertiesPatch }),
);
export const ListingItem = S.Union(
  S.Struct({ assetListing: AssetListing }),
  S.Struct({ dataProductListing: DataProductListing }),
);
export class OpenLineageRunEventSummary extends S.Class<OpenLineageRunEventSummary>(
  "OpenLineageRunEventSummary",
)({
  eventType: S.optional(S.String),
  runId: S.optional(S.String),
  job: S.optional(NameIdentifier),
  inputs: S.optional(NameIdentifiers),
  outputs: S.optional(NameIdentifiers),
}) {}
export class MatchOffset extends S.Class<MatchOffset>("MatchOffset")({
  startOffset: S.optional(S.Number),
  endOffset: S.optional(S.Number),
}) {}
export const MatchOffsets = S.Array(MatchOffset);
export class TextMatchItem extends S.Class<TextMatchItem>("TextMatchItem")({
  attribute: S.optional(S.String),
  text: S.optional(S.String),
  matchOffsets: S.optional(MatchOffsets),
}) {}
export const TextMatches = S.Array(TextMatchItem);
export const MatchRationaleItem = S.Union(
  S.Struct({ textMatches: TextMatches }),
);
export const MatchRationale = S.Array(MatchRationaleItem);
export class DataProductListingItemAdditionalAttributes extends S.Class<DataProductListingItemAdditionalAttributes>(
  "DataProductListingItemAdditionalAttributes",
)({
  forms: S.optional(S.String),
  matchRationale: S.optional(MatchRationale),
}) {}
export class ListingSummaryItem extends S.Class<ListingSummaryItem>(
  "ListingSummaryItem",
)({
  listingId: S.optional(S.String),
  listingRevision: S.optional(S.String),
  glossaryTerms: S.optional(DetailedGlossaryTerms),
}) {}
export const ListingSummaryItems = S.Array(ListingSummaryItem);
export class AddPolicyGrantInput extends S.Class<AddPolicyGrantInput>(
  "AddPolicyGrantInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    policyType: S.String,
    principal: PolicyGrantPrincipal,
    detail: PolicyGrantDetail,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/policies/managed/{entityType}/{entityIdentifier}/addGrant",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateProjectProfileOutput extends S.Class<CreateProjectProfileOutput>(
  "CreateProjectProfileOutput",
)({
  domainId: S.String,
  id: S.String,
  name: S.String,
  description: S.optional(S.String),
  status: S.optional(S.String),
  projectResourceTags: S.optional(ProjectResourceTagParameters),
  allowCustomProjectResourceTags: S.optional(S.Boolean),
  projectResourceTagsDescription: S.optional(S.String),
  environmentConfigurations: S.optional(EnvironmentConfigurationsList),
  createdBy: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  domainUnitId: S.optional(S.String),
}) {}
export class GetConnectionOutput extends S.Class<GetConnectionOutput>(
  "GetConnectionOutput",
)({
  connectionCredentials: S.optional(ConnectionCredentials),
  connectionId: S.String,
  description: S.optional(S.String),
  domainId: S.String,
  domainUnitId: S.String,
  environmentId: S.optional(S.String),
  environmentUserRole: S.optional(S.String),
  name: S.String,
  physicalEndpoints: PhysicalEndpoints,
  projectId: S.optional(S.String),
  props: S.optional(ConnectionPropertiesOutput),
  type: S.String,
  scope: S.optional(S.String),
}) {}
export class GetJobRunOutput extends S.Class<GetJobRunOutput>(
  "GetJobRunOutput",
)({
  domainId: S.optional(S.String),
  id: S.optional(S.String),
  jobId: S.optional(S.String),
  jobType: S.optional(S.String),
  runMode: S.optional(S.String),
  details: S.optional(JobRunDetails),
  status: S.optional(S.String),
  error: S.optional(JobRunError),
  createdBy: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ListNotificationsOutput extends S.Class<ListNotificationsOutput>(
  "ListNotificationsOutput",
)({
  notifications: S.optional(NotificationsList),
  nextToken: S.optional(S.String),
}) {}
export class ListProjectMembershipsOutput extends S.Class<ListProjectMembershipsOutput>(
  "ListProjectMembershipsOutput",
)({ members: ProjectMembers, nextToken: S.optional(S.String) }) {}
export class UpdateConnectionInput extends S.Class<UpdateConnectionInput>(
  "UpdateConnectionInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    description: S.optional(S.String),
    awsLocation: S.optional(AwsLocation),
    props: S.optional(ConnectionPropertiesPatch),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/domains/{domainIdentifier}/connections/{identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateProjectOutput extends S.Class<UpdateProjectOutput>(
  "UpdateProjectOutput",
)({
  domainId: S.String,
  id: S.String,
  name: S.String,
  description: S.optional(S.String),
  projectStatus: S.optional(S.String),
  failureReasons: S.optional(FailureReasons),
  createdBy: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  resourceTags: S.optional(ResourceTags),
  glossaryTerms: S.optional(GlossaryTerms),
  domainUnitId: S.optional(S.String),
  projectProfileId: S.optional(S.String),
  userParameters: S.optional(EnvironmentConfigurationUserParametersList),
  environmentDeploymentDetails: S.optional(EnvironmentDeploymentDetails),
}) {}
export class CreateDataSourceInput extends S.Class<CreateDataSourceInput>(
  "CreateDataSourceInput",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    projectIdentifier: S.String,
    environmentIdentifier: S.optional(S.String),
    connectionIdentifier: S.optional(S.String),
    type: S.String,
    configuration: S.optional(DataSourceConfigurationInput),
    recommendation: S.optional(RecommendationConfiguration),
    enableSetting: S.optional(S.String),
    schedule: S.optional(ScheduleConfiguration),
    publishOnImport: S.optional(S.Boolean),
    assetFormsInput: S.optional(FormInputList),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/data-sources",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataSourceOutput extends S.Class<GetDataSourceOutput>(
  "GetDataSourceOutput",
)({
  id: S.String,
  status: S.optional(S.String),
  type: S.optional(S.String),
  name: S.String,
  description: S.optional(S.String),
  domainId: S.String,
  projectId: S.String,
  environmentId: S.optional(S.String),
  connectionId: S.optional(S.String),
  configuration: S.optional(DataSourceConfigurationOutput),
  recommendation: S.optional(RecommendationConfiguration),
  enableSetting: S.optional(S.String),
  publishOnImport: S.optional(S.Boolean),
  assetFormsOutput: S.optional(FormOutputList),
  schedule: S.optional(ScheduleConfiguration),
  lastRunStatus: S.optional(S.String),
  lastRunAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastRunErrorMessage: S.optional(DataSourceErrorMessage),
  lastRunAssetCount: S.optional(S.Number),
  errorMessage: S.optional(DataSourceErrorMessage),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  selfGrantStatus: S.optional(SelfGrantStatusOutput),
}) {}
export class GetListingOutput extends S.Class<GetListingOutput>(
  "GetListingOutput",
)({
  domainId: S.String,
  id: S.String,
  listingRevision: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  updatedBy: S.optional(S.String),
  item: S.optional(ListingItem),
  name: S.optional(S.String),
  description: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export class CreateRuleOutput extends S.Class<CreateRuleOutput>(
  "CreateRuleOutput",
)({
  identifier: S.String,
  name: S.String,
  ruleType: S.String,
  target: RuleTarget,
  action: S.String,
  scope: RuleScope,
  detail: RuleDetail,
  targetType: S.optional(S.String),
  description: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  createdBy: S.String,
}) {}
export const EventSummary = S.Union(
  S.Struct({ openLineageRunEventSummary: OpenLineageRunEventSummary }),
);
export class DataProductListingItem extends S.Class<DataProductListingItem>(
  "DataProductListingItem",
)({
  listingId: S.optional(S.String),
  listingRevision: S.optional(S.String),
  name: S.optional(S.String),
  entityId: S.optional(S.String),
  entityRevision: S.optional(S.String),
  description: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  listingCreatedBy: S.optional(S.String),
  listingUpdatedBy: S.optional(S.String),
  glossaryTerms: S.optional(DetailedGlossaryTerms),
  owningProjectId: S.optional(S.String),
  additionalAttributes: S.optional(DataProductListingItemAdditionalAttributes),
  items: S.optional(ListingSummaryItems),
}) {}
export class AuthenticationConfigurationInput extends S.Class<AuthenticationConfigurationInput>(
  "AuthenticationConfigurationInput",
)({
  authenticationType: S.optional(S.String),
  oAuth2Properties: S.optional(OAuth2Properties),
  secretArn: S.optional(S.String),
  kmsKeyArn: S.optional(S.String),
  basicAuthenticationCredentials: S.optional(BasicAuthenticationCredentials),
  customAuthenticationCredentials: S.optional(CredentialMap),
}) {}
export class LineageEventSummary extends S.Class<LineageEventSummary>(
  "LineageEventSummary",
)({
  id: S.optional(S.String),
  domainId: S.optional(S.String),
  processingStatus: S.optional(S.String),
  eventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  eventSummary: S.optional(EventSummary),
  createdBy: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const LineageEventSummaries = S.Array(LineageEventSummary);
export class GlueConnectionInput extends S.Class<GlueConnectionInput>(
  "GlueConnectionInput",
)({
  connectionProperties: S.optional(ConnectionProperties),
  physicalConnectionRequirements: S.optional(PhysicalConnectionRequirements),
  name: S.optional(S.String),
  description: S.optional(S.String),
  connectionType: S.optional(S.String),
  matchCriteria: S.optional(S.String),
  validateCredentials: S.optional(S.Boolean),
  validateForComputeEnvironments: S.optional(ComputeEnvironmentsList),
  sparkProperties: S.optional(PropertyMap),
  athenaProperties: S.optional(PropertyMap),
  pythonProperties: S.optional(PropertyMap),
  authenticationConfiguration: S.optional(AuthenticationConfigurationInput),
}) {}
export class GlossaryItemAdditionalAttributes extends S.Class<GlossaryItemAdditionalAttributes>(
  "GlossaryItemAdditionalAttributes",
)({ matchRationale: S.optional(MatchRationale) }) {}
export class GlossaryTermItemAdditionalAttributes extends S.Class<GlossaryTermItemAdditionalAttributes>(
  "GlossaryTermItemAdditionalAttributes",
)({ matchRationale: S.optional(MatchRationale) }) {}
export class AssetItemAdditionalAttributes extends S.Class<AssetItemAdditionalAttributes>(
  "AssetItemAdditionalAttributes",
)({
  formsOutput: S.optional(FormOutputList),
  readOnlyFormsOutput: S.optional(FormOutputList),
  latestTimeSeriesDataPointFormsOutput: S.optional(
    TimeSeriesDataPointSummaryFormOutputList,
  ),
  matchRationale: S.optional(MatchRationale),
}) {}
export class DataProductItemAdditionalAttributes extends S.Class<DataProductItemAdditionalAttributes>(
  "DataProductItemAdditionalAttributes",
)({ matchRationale: S.optional(MatchRationale) }) {}
export class AddPolicyGrantOutput extends S.Class<AddPolicyGrantOutput>(
  "AddPolicyGrantOutput",
)({ grantId: S.optional(S.String) }) {}
export class CancelSubscriptionOutput extends S.Class<CancelSubscriptionOutput>(
  "CancelSubscriptionOutput",
)({
  id: S.String,
  createdBy: S.String,
  updatedBy: S.optional(S.String),
  domainId: S.String,
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  subscribedPrincipal: SubscribedPrincipal,
  subscribedListing: SubscribedListing,
  subscriptionRequestId: S.optional(S.String),
  retainPermissions: S.optional(S.Boolean),
}) {}
export class CreateAssetFilterInput extends S.Class<CreateAssetFilterInput>(
  "CreateAssetFilterInput",
)(
  {
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    assetIdentifier: S.String.pipe(T.HttpLabel("assetIdentifier")),
    name: S.String,
    description: S.optional(S.String),
    configuration: AssetFilterConfiguration,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/assets/{assetIdentifier}/filters",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLineageEventsOutput extends S.Class<ListLineageEventsOutput>(
  "ListLineageEventsOutput",
)({
  items: S.optional(LineageEventSummaries),
  nextToken: S.optional(S.String),
}) {}
export class UpdateConnectionOutput extends S.Class<UpdateConnectionOutput>(
  "UpdateConnectionOutput",
)({
  connectionId: S.String,
  description: S.optional(S.String),
  domainId: S.String,
  domainUnitId: S.String,
  environmentId: S.optional(S.String),
  name: S.String,
  physicalEndpoints: PhysicalEndpoints,
  projectId: S.optional(S.String),
  props: S.optional(ConnectionPropertiesOutput),
  type: S.String,
  scope: S.optional(S.String),
}) {}
export class CreateDataSourceOutput extends S.Class<CreateDataSourceOutput>(
  "CreateDataSourceOutput",
)({
  id: S.String,
  status: S.optional(S.String),
  type: S.optional(S.String),
  name: S.String,
  description: S.optional(S.String),
  domainId: S.String,
  projectId: S.String,
  environmentId: S.optional(S.String),
  connectionId: S.optional(S.String),
  configuration: S.optional(DataSourceConfigurationOutput),
  recommendation: S.optional(RecommendationConfiguration),
  enableSetting: S.optional(S.String),
  publishOnImport: S.optional(S.Boolean),
  assetFormsOutput: S.optional(FormOutputList),
  schedule: S.optional(ScheduleConfiguration),
  lastRunStatus: S.optional(S.String),
  lastRunAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastRunErrorMessage: S.optional(DataSourceErrorMessage),
  errorMessage: S.optional(DataSourceErrorMessage),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class GluePropertiesInput extends S.Class<GluePropertiesInput>(
  "GluePropertiesInput",
)({ glueConnectionInput: S.optional(GlueConnectionInput) }) {}
export class GlossaryItem extends S.Class<GlossaryItem>("GlossaryItem")({
  domainId: S.String,
  id: S.String,
  name: S.String,
  owningProjectId: S.String,
  description: S.optional(S.String),
  status: S.String,
  usageRestrictions: S.optional(GlossaryUsageRestrictions),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedBy: S.optional(S.String),
  additionalAttributes: S.optional(GlossaryItemAdditionalAttributes),
}) {}
export class GlossaryTermItem extends S.Class<GlossaryTermItem>(
  "GlossaryTermItem",
)({
  domainId: S.String,
  glossaryId: S.String,
  id: S.String,
  name: S.String,
  shortDescription: S.optional(S.String),
  usageRestrictions: S.optional(GlossaryUsageRestrictions),
  longDescription: S.optional(S.String),
  termRelations: S.optional(TermRelations),
  status: S.String,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedBy: S.optional(S.String),
  additionalAttributes: S.optional(GlossaryTermItemAdditionalAttributes),
}) {}
export class AssetItem extends S.Class<AssetItem>("AssetItem")({
  domainId: S.String,
  identifier: S.String,
  name: S.String,
  typeIdentifier: S.String,
  typeRevision: S.String,
  externalIdentifier: S.optional(S.String),
  description: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  firstRevisionCreatedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  firstRevisionCreatedBy: S.optional(S.String),
  glossaryTerms: S.optional(GlossaryTerms),
  owningProjectId: S.String,
  additionalAttributes: S.optional(AssetItemAdditionalAttributes),
  governedGlossaryTerms: S.optional(GovernedGlossaryTerms),
}) {}
export class DataProductResultItem extends S.Class<DataProductResultItem>(
  "DataProductResultItem",
)({
  domainId: S.String,
  id: S.String,
  name: S.String,
  owningProjectId: S.String,
  description: S.optional(S.String),
  glossaryTerms: S.optional(GlossaryTerms),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  firstRevisionCreatedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  firstRevisionCreatedBy: S.optional(S.String),
  additionalAttributes: S.optional(DataProductItemAdditionalAttributes),
}) {}
export const ConnectionPropertiesInput = S.Union(
  S.Struct({ athenaProperties: AthenaPropertiesInput }),
  S.Struct({ glueProperties: GluePropertiesInput }),
  S.Struct({ hyperPodProperties: HyperPodPropertiesInput }),
  S.Struct({ iamProperties: IamPropertiesInput }),
  S.Struct({ redshiftProperties: RedshiftPropertiesInput }),
  S.Struct({ sparkEmrProperties: SparkEmrPropertiesInput }),
  S.Struct({ sparkGlueProperties: SparkGluePropertiesInput }),
  S.Struct({ s3Properties: S3PropertiesInput }),
  S.Struct({ amazonQProperties: AmazonQPropertiesInput }),
  S.Struct({ mlflowProperties: MlflowPropertiesInput }),
);
export const SearchInventoryResultItem = S.Union(
  S.Struct({ glossaryItem: GlossaryItem }),
  S.Struct({ glossaryTermItem: GlossaryTermItem }),
  S.Struct({ assetItem: AssetItem }),
  S.Struct({ dataProductItem: DataProductResultItem }),
);
export const SearchInventoryResultItems = S.Array(SearchInventoryResultItem);
export class CreateAssetFilterOutput extends S.Class<CreateAssetFilterOutput>(
  "CreateAssetFilterOutput",
)({
  id: S.String,
  domainId: S.String,
  assetId: S.String,
  name: S.String,
  description: S.optional(S.String),
  status: S.optional(S.String),
  configuration: AssetFilterConfiguration,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  errorMessage: S.optional(S.String),
  effectiveColumnNames: S.optional(ColumnNameList),
  effectiveRowFilter: S.optional(S.String),
}) {}
export class CreateConnectionInput extends S.Class<CreateConnectionInput>(
  "CreateConnectionInput",
)(
  {
    awsLocation: S.optional(AwsLocation),
    clientToken: S.optional(S.String),
    description: S.optional(S.String),
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.optional(S.String),
    name: S.String,
    props: S.optional(ConnectionPropertiesInput),
    enableTrustedIdentityPropagation: S.optional(S.Boolean),
    scope: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domains/{domainIdentifier}/connections",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchOutput extends S.Class<SearchOutput>("SearchOutput")({
  items: S.optional(SearchInventoryResultItems),
  nextToken: S.optional(S.String),
  totalMatchCount: S.optional(S.Number),
}) {}
export class AssetListingItemAdditionalAttributes extends S.Class<AssetListingItemAdditionalAttributes>(
  "AssetListingItemAdditionalAttributes",
)({
  forms: S.optional(S.String),
  matchRationale: S.optional(MatchRationale),
  latestTimeSeriesDataPointForms: S.optional(
    TimeSeriesDataPointSummaryFormOutputList,
  ),
}) {}
export class CreateConnectionOutput extends S.Class<CreateConnectionOutput>(
  "CreateConnectionOutput",
)({
  connectionId: S.String,
  description: S.optional(S.String),
  domainId: S.String,
  domainUnitId: S.String,
  environmentId: S.optional(S.String),
  name: S.String,
  physicalEndpoints: PhysicalEndpoints,
  projectId: S.optional(S.String),
  props: S.optional(ConnectionPropertiesOutput),
  type: S.String,
  scope: S.optional(S.String),
}) {}
export class AssetListingItem extends S.Class<AssetListingItem>(
  "AssetListingItem",
)({
  listingId: S.optional(S.String),
  listingRevision: S.optional(S.String),
  name: S.optional(S.String),
  entityId: S.optional(S.String),
  entityRevision: S.optional(S.String),
  entityType: S.optional(S.String),
  description: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  listingCreatedBy: S.optional(S.String),
  listingUpdatedBy: S.optional(S.String),
  glossaryTerms: S.optional(DetailedGlossaryTerms),
  governedGlossaryTerms: S.optional(DetailedGlossaryTerms),
  owningProjectId: S.optional(S.String),
  additionalAttributes: S.optional(AssetListingItemAdditionalAttributes),
}) {}
export const SearchResultItem = S.Union(
  S.Struct({ assetListing: AssetListingItem }),
  S.Struct({ dataProductListing: DataProductListingItem }),
);
export const SearchResultItems = S.Array(SearchResultItem);
export class SearchListingsOutput extends S.Class<SearchListingsOutput>(
  "SearchListingsOutput",
)({
  items: S.optional(SearchResultItems),
  nextToken: S.optional(S.String),
  totalMatchCount: S.optional(S.Number),
  aggregates: S.optional(AggregationOutputList),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
) {}

//# Operations
/**
 * Deletes the blueprint configuration in Amazon DataZone.
 */
export const deleteEnvironmentBlueprintConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteEnvironmentBlueprintConfigurationInput,
    output: DeleteEnvironmentBlueprintConfigurationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ValidationException,
    ],
  }));
/**
 * Gets the data portal URL for the specified Amazon DataZone domain.
 */
export const getIamPortalLoginUrl = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetIamPortalLoginUrlInput,
    output: GetIamPortalLoginUrlOutput,
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
 * Rejects the specified subscription request.
 */
export const rejectSubscriptionRequest = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RejectSubscriptionRequestInput,
    output: RejectSubscriptionRequestOutput,
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
 * Revokes a specified subscription in Amazon DataZone.
 */
export const revokeSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RevokeSubscriptionInput,
  output: RevokeSubscriptionOutput,
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
 * Updates an asset filter.
 *
 * Prerequisites:
 *
 * - The domain, asset, and asset filter identifier must all exist.
 *
 * - The asset must contain the columns being referenced in the update.
 *
 * - If applying a row filter, ensure the column referenced in the expression exists in the asset schema.
 */
export const updateAssetFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAssetFilterInput,
  output: UpdateAssetFilterOutput,
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
 * Updates an environment action.
 */
export const updateEnvironmentAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateEnvironmentActionInput,
    output: UpdateEnvironmentActionOutput,
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
 * Updates a specified subscription request in Amazon DataZone.
 */
export const updateSubscriptionRequest = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSubscriptionRequestInput,
    output: UpdateSubscriptionRequestOutput,
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
 * Updates the specified subscription target in Amazon DataZone.
 */
export const updateSubscriptionTarget = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSubscriptionTargetInput,
    output: UpdateSubscriptionTargetOutput,
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
 * Creates a revision of the asset.
 *
 * Asset revisions represent new versions of existing assets, capturing changes to either the underlying data or its metadata. They maintain a historical record of how assets evolve over time, who made changes, and when those changes occurred. This versioning capability is crucial for governance and compliance, allowing organizations to track changes, understand their impact, and roll back if necessary.
 *
 * Prerequisites:
 *
 * - Asset must already exist in the domain with identifier.
 *
 * - `formsInput` is required when asset has the form type. `typeRevision` should be the latest version of form type.
 *
 * - The form content must include all required fields (e.g., `bucketArn` for `S3ObjectCollectionForm`).
 *
 * - The owning project of the original asset must still exist and be active.
 *
 * - User must have write access to the project and domain.
 */
export const createAssetRevision = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssetRevisionInput,
  output: CreateAssetRevisionOutput,
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
 * Creates a data product revision.
 *
 * Prerequisites:
 *
 * - The original data product must exist in the given domain.
 *
 * - User must have permissions on the data product.
 *
 * - The domain must be valid and accessible.
 *
 * - The new revision name must comply with naming constraints (if required).
 */
export const createDataProductRevision = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDataProductRevisionInput,
    output: CreateDataProductRevisionOutput,
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
 * Deletes a Amazon DataZone domain.
 */
export const deleteDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainInput,
  output: DeleteDomainOutput,
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
 * Updates the domain unit.
 */
export const updateDomainUnit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDomainUnitInput,
  output: UpdateDomainUnitOutput,
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
 * Updates the business glossary in Amazon DataZone.
 *
 * Prerequisites:
 *
 * - The glossary must exist in the given domain.
 *
 * - The caller must have the `datazone:UpdateGlossary` permission to update it.
 *
 * - When updating the name, the new name must be unique within the domain.
 *
 * - The glossary must not be deleted or in a terminal state.
 */
export const updateGlossary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGlossaryInput,
  output: UpdateGlossaryOutput,
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
 * Updates a business glossary term in Amazon DataZone.
 *
 * Prerequisites:
 *
 * - Glossary term must exist in the specified domain.
 *
 * - New name must not conflict with existing terms in the same glossary.
 *
 * - User must have permissions on the term.
 *
 * - The term must not be in DELETED status.
 */
export const updateGlossaryTerm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGlossaryTermInput,
  output: UpdateGlossaryTermOutput,
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
 * Associates governed terms with an asset.
 */
export const associateGovernedTerms = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateGovernedTermsInput,
    output: AssociateGovernedTermsOutput,
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
 * Deletes an asset filter.
 *
 * Prerequisites:
 *
 * - The asset filter must exist.
 *
 * - The domain and asset must not have been deleted.
 *
 * - Ensure the --identifier refers to a valid filter ID.
 */
export const deleteAssetFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssetFilterInput,
  output: DeleteAssetFilterResponse,
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
 * Deletes an action for the environment, for example, deletes a console link for an analytics tool that is available in this environment.
 */
export const deleteEnvironmentAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEnvironmentActionInput,
    output: DeleteEnvironmentActionResponse,
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
 * Deletes a blueprint in Amazon DataZone.
 */
export const deleteEnvironmentBlueprint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEnvironmentBlueprintInput,
    output: DeleteEnvironmentBlueprintResponse,
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
 * Deletes a subscription request in Amazon DataZone.
 */
export const deleteSubscriptionRequest = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSubscriptionRequestInput,
    output: DeleteSubscriptionRequestResponse,
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
 * Deletes a subscription target in Amazon DataZone.
 */
export const deleteSubscriptionTarget = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSubscriptionTargetInput,
    output: DeleteSubscriptionTargetResponse,
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
 * Disassociates the environment role in Amazon DataZone.
 */
export const disassociateEnvironmentRole = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateEnvironmentRoleInput,
    output: DisassociateEnvironmentRoleOutput,
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
 * Disassociates restricted terms from an asset.
 */
export const disassociateGovernedTerms = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateGovernedTermsInput,
    output: DisassociateGovernedTermsOutput,
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
 * Updates the owner of the root domain unit.
 */
export const updateRootDomainUnitOwner = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateRootDomainUnitOwnerInput,
    output: UpdateRootDomainUnitOwnerOutput,
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
 * Deletes an asset in Amazon DataZone.
 *
 * - --domain-identifier must refer to a valid and existing domain.
 *
 * - --identifier must refer to an existing asset in the specified domain.
 *
 * - Asset must not be referenced in any existing asset filters.
 *
 * - Asset must not be linked to any draft or published data product.
 *
 * - User must have delete permissions for the domain and project.
 */
export const deleteAsset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssetInput,
  output: DeleteAssetOutput,
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
 * Deletes an asset type in Amazon DataZone.
 *
 * Prerequisites:
 *
 * - The asset type must exist in the domain.
 *
 * - You must have DeleteAssetType permission.
 *
 * - The asset type must not be in use (e.g., assigned to any asset). If used, deletion will fail.
 *
 * - You should retrieve the asset type using get-asset-type to confirm its presence before deletion.
 */
export const deleteAssetType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssetTypeInput,
  output: DeleteAssetTypeOutput,
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
 * Deletes a data product in Amazon DataZone.
 *
 * Prerequisites:
 *
 * - The data product must exist and not be deleted or archived.
 *
 * - The user must have delete permissions for the data product.
 *
 * - Domain and project must be active.
 */
export const deleteDataProduct = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataProductInput,
  output: DeleteDataProductOutput,
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
 * Deletes a domain unit.
 */
export const deleteDomainUnit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainUnitInput,
  output: DeleteDomainUnitOutput,
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
 * Deletes and metadata form type in Amazon DataZone.
 *
 * Prerequisites:
 *
 * - The form type must exist in the domain.
 *
 * - The form type must not be in use by any asset types or assets.
 *
 * - The domain must be valid and accessible.
 *
 * - User must have delete permissions on the form type.
 *
 * - Any dependencies (such as linked asset types) must be removed first.
 */
export const deleteFormType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFormTypeInput,
  output: DeleteFormTypeOutput,
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
 * Deletes a business glossary in Amazon DataZone.
 *
 * Prerequisites:
 *
 * - The glossary must be in DISABLED state.
 *
 * - The glossary must not have any glossary terms associated with it.
 *
 * - The glossary must exist in the specified domain.
 *
 * - The caller must have the `datazone:DeleteGlossary` permission in the domain and glossary.
 *
 * - Glossary should not be linked to any active metadata forms.
 */
export const deleteGlossary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGlossaryInput,
  output: DeleteGlossaryOutput,
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
 * Deletes a business glossary term in Amazon DataZone.
 *
 * Prerequisites:
 *
 * - Glossary term must exist and be active.
 *
 * - The term must not be linked to other assets or child terms.
 *
 * - Caller must have delete permissions in the domain/glossary.
 *
 * - Ensure all associations (such as to assets or parent terms) are removed before deletion.
 */
export const deleteGlossaryTerm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGlossaryTermInput,
  output: DeleteGlossaryTermOutput,
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
 * Deletes a listing (a record of an asset at a given time).
 */
export const deleteListing = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteListingInput,
  output: DeleteListingOutput,
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
 * Cancels the metadata generation run.
 *
 * Prerequisites:
 *
 * - The run must exist and be in a cancelable status (e.g., SUBMITTED, IN_PROGRESS).
 *
 * - Runs in SUCCEEDED status cannot be cancelled.
 *
 * - User must have access to the run and cancel permissions.
 */
export const cancelMetadataGenerationRun = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelMetadataGenerationRunInput,
    output: CancelMetadataGenerationRunOutput,
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
 * Deletes a rule in Amazon DataZone. A rule is a formal agreement that enforces specific requirements across user workflows (e.g., publishing assets to the catalog, requesting subscriptions, creating projects) within the Amazon DataZone data portal. These rules help maintain consistency, ensure compliance, and uphold governance standards in data management processes. For instance, a metadata enforcement rule can specify the required information for creating a subscription request or publishing a data asset to the catalog, ensuring alignment with organizational standards.
 */
export const deleteRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRuleInput,
  output: DeleteRuleOutput,
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
 * Accepts automatically generated business-friendly metadata for your Amazon DataZone assets.
 */
export const acceptPredictions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptPredictionsInput,
  output: AcceptPredictionsOutput,
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
 * Updates the specified group profile in Amazon DataZone.
 */
export const updateGroupProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGroupProfileInput,
  output: UpdateGroupProfileOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the specified user profile in Amazon DataZone.
 */
export const updateUserProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserProfileInput,
  output: UpdateUserProfileOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets the data product.
 *
 * Prerequisites:
 *
 * - The data product ID must exist.
 *
 * - The domain must be valid and accessible.
 *
 * - User must have read or discovery permissions for the data product.
 */
export const getDataProduct = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataProductInput,
  output: GetDataProductOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the details of the specified domain unit.
 */
export const getDomainUnit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainUnitInput,
  output: GetDomainUnitOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the blueprint configuration in Amazon DataZone.
 */
export const getEnvironmentBlueprintConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetEnvironmentBlueprintConfigurationInput,
    output: GetEnvironmentBlueprintConfigurationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Gets a business glossary in Amazon DataZone.
 *
 * Prerequisites:
 *
 * - The specified glossary ID must exist and be associated with the given domain.
 *
 * - The caller must have the `datazone:GetGlossary` permission on the domain.
 */
export const getGlossary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGlossaryInput,
  output: GetGlossaryOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a business glossary term in Amazon DataZone.
 *
 * Prerequisites:
 *
 * - Glossary term with identifier must exist in the domain.
 *
 * - User must have permission on the glossary term.
 *
 * - Domain must be accessible and active.
 */
export const getGlossaryTerm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGlossaryTermInput,
  output: GetGlossaryTermOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the details of a rule in Amazon DataZone. A rule is a formal agreement that enforces specific requirements across user workflows (e.g., publishing assets to the catalog, requesting subscriptions, creating projects) within the Amazon DataZone data portal. These rules help maintain consistency, ensure compliance, and uphold governance standards in data management processes. For instance, a metadata enforcement rule can specify the required information for creating a subscription request or publishing a data asset to the catalog, ensuring alignment with organizational standards.
 */
export const getRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRuleInput,
  output: GetRuleOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an account pool.
 */
export const deleteAccountPool = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccountPoolInput,
  output: DeleteAccountPoolOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an environment in Amazon DataZone.
 */
export const deleteEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentInput,
  output: DeleteEnvironmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an environment profile in Amazon DataZone.
 */
export const deleteEnvironmentProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEnvironmentProfileInput,
    output: DeleteEnvironmentProfileResponse,
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
 * Deletes a project in Amazon DataZone.
 */
export const deleteProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProjectInput,
  output: DeleteProjectOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a project profile.
 */
export const deleteProjectProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteProjectProfileInput,
    output: DeleteProjectProfileOutput,
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
 * Deletes the specified time series form for the specified asset.
 */
export const deleteTimeSeriesDataPoints = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteTimeSeriesDataPointsInput,
    output: DeleteTimeSeriesDataPointsOutput,
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
 * Removes an owner from an entity.
 */
export const removeEntityOwner = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveEntityOwnerInput,
  output: RemoveEntityOwnerOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Untags a resource in Amazon DataZone.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [InternalServerException, ResourceNotFoundException],
}));
/**
 * Creates a group profile in Amazon DataZone.
 */
export const createGroupProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGroupProfileInput,
  output: CreateGroupProfileOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a project membership in Amazon DataZone.
 */
export const createProjectMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateProjectMembershipInput,
    output: CreateProjectMembershipOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes and connection. In Amazon DataZone, a connection enables you to connect your resources (domains, projects, and environments) to external resources and services.
 */
export const deleteConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectionInput,
  output: DeleteConnectionOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the details of the account pool.
 */
export const getAccountPool = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountPoolInput,
  output: GetAccountPoolOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets an asset filter.
 *
 * Prerequisites:
 *
 * - Domain (`--domain-identifier`), asset (`--asset-identifier`), and filter (`--identifier`) must all exist.
 *
 * - The asset filter should not have been deleted.
 *
 * - The asset must still exist (since the filter is linked to it).
 */
export const getAssetFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssetFilterInput,
  output: GetAssetFilterOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets data export configuration details.
 */
export const getDataExportConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDataExportConfigurationInput,
    output: GetDataExportConfigurationOutput,
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
 * Gets the specified environment action.
 */
export const getEnvironmentAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetEnvironmentActionInput,
    output: GetEnvironmentActionOutput,
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
 * Gets an Amazon DataZone blueprint.
 */
export const getEnvironmentBlueprint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetEnvironmentBlueprintInput,
    output: GetEnvironmentBlueprintOutput,
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
 * Gets the credentials of an environment in Amazon DataZone.
 */
export const getEnvironmentCredentials = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetEnvironmentCredentialsInput,
    output: GetEnvironmentCredentialsOutput,
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
 * Gets an evinronment profile in Amazon DataZone.
 */
export const getEnvironmentProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetEnvironmentProfileInput,
    output: GetEnvironmentProfileOutput,
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
 * Gets a group profile in Amazon DataZone.
 */
export const getGroupProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGroupProfileInput,
  output: GetGroupProfileOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes the lineage event.
 */
export const getLineageEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLineageEventInput,
  output: GetLineageEventOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The details of the project profile.
 */
export const getProjectProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProjectProfileInput,
  output: GetProjectProfileOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a subscription in Amazon DataZone.
 */
export const getSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSubscriptionInput,
  output: GetSubscriptionOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the subscription grant in Amazon DataZone.
 */
export const getSubscriptionGrant = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSubscriptionGrantInput,
    output: GetSubscriptionGrantOutput,
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
 * Gets the details of the specified subscription request.
 */
export const getSubscriptionRequestDetails =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetSubscriptionRequestDetailsInput,
    output: GetSubscriptionRequestDetailsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Gets the subscription target in Amazon DataZone.
 */
export const getSubscriptionTarget = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSubscriptionTargetInput,
    output: GetSubscriptionTargetOutput,
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
 * Gets a user profile in Amazon DataZone.
 */
export const getUserProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUserProfileInput,
  output: GetUserProfileOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the accounts in the specified account pool.
 */
export const listAccountsInAccountPool =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAccountsInAccountPoolInput,
    output: ListAccountsInAccountPoolOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists tags for the specified resource in Amazon DataZone.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Associates the environment role in Amazon DataZone.
 */
export const associateEnvironmentRole = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateEnvironmentRoleInput,
    output: AssociateEnvironmentRoleOutput,
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
 * Gets the attribute metadata.
 */
export const batchGetAttributesMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetAttributesMetadataInput,
    output: BatchGetAttributesMetadataOutput,
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
 * Create an Amazon DataZone environment.
 */
export const createEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentInput,
  output: CreateEnvironmentOutput,
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
 * Creates a subscription target in Amazon DataZone.
 */
export const createSubscriptionTarget = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSubscriptionTargetInput,
    output: CreateSubscriptionTargetOutput,
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
 * Gets the data lineage node.
 */
export const getLineageNode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLineageNodeInput,
  output: GetLineageNodeOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a project in Amazon DataZone.
 */
export const getProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProjectInput,
  output: GetProjectOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the existing data point for the asset.
 */
export const getTimeSeriesDataPoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTimeSeriesDataPointInput,
    output: GetTimeSeriesDataPointOutput,
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
 * Lists asset filters.
 *
 * Prerequisites:
 *
 * - A valid domain and asset must exist.
 *
 * - The asset must have at least one filter created to return results.
 */
export const listAssetFilters = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListAssetFiltersInput,
    output: ListAssetFiltersOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists the revisions for the asset.
 *
 * Prerequisites:
 *
 * - The asset must exist in the domain.
 *
 * - There must be at least one revision of the asset (which happens automatically after creation).
 *
 * - The domain must be valid and active.
 *
 * - User must have permissions on the asset and domain.
 */
export const listAssetRevisions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListAssetRevisionsInput,
    output: ListAssetRevisionsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists data product revisions.
 *
 * Prerequisites:
 *
 * - The data product ID must exist within the domain.
 *
 * - User must have view permissions on the data product.
 *
 * - The domain must be in a valid and accessible state.
 */
export const listDataProductRevisions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDataProductRevisionsInput,
    output: ListDataProductRevisionsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists blueprints in an Amazon DataZone environment.
 */
export const listEnvironmentBlueprints =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEnvironmentBlueprintsInput,
    output: ListEnvironmentBlueprintsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists job runs.
 */
export const listJobRuns = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListJobRunsInput,
    output: ListJobRunsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists the history of the specified data lineage node.
 */
export const listLineageNodeHistory =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListLineageNodeHistoryInput,
    output: ListLineageNodeHistoryOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "nodes",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists subscription grants.
 */
export const listSubscriptionGrants =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSubscriptionGrantsInput,
    output: ListSubscriptionGrantsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists subscriptions in Amazon DataZone.
 */
export const listSubscriptions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSubscriptionsInput,
    output: ListSubscriptionsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists subscription targets in Amazon DataZone.
 */
export const listSubscriptionTargets =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSubscriptionTargetsInput,
    output: ListSubscriptionTargetsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists time series data points.
 */
export const listTimeSeriesDataPoints =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTimeSeriesDataPointsInput,
    output: ListTimeSeriesDataPointsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Rejects automatically generated business-friendly metadata for your Amazon DataZone assets.
 */
export const rejectPredictions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectPredictionsInput,
  output: RejectPredictionsOutput,
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
 * Searches group profiles in Amazon DataZone.
 */
export const searchGroupProfiles =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: SearchGroupProfilesInput,
    output: SearchGroupProfilesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Searches user profiles in Amazon DataZone.
 */
export const searchUserProfiles = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: SearchUserProfilesInput,
    output: SearchUserProfilesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists existing account pools.
 */
export const listAccountPools = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListAccountPoolsInput,
    output: ListAccountPoolsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists connections. In Amazon DataZone, a connection enables you to connect your resources (domains, projects, and environments) to external resources and services.
 */
export const listConnections = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListConnectionsInput,
    output: ListConnectionsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists existing environment actions.
 */
export const listEnvironmentActions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEnvironmentActionsInput,
    output: ListEnvironmentActionsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists Amazon DataZone environment profiles.
 */
export const listEnvironmentProfiles =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEnvironmentProfilesInput,
    output: ListEnvironmentProfilesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists Amazon DataZone environments.
 */
export const listEnvironments = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListEnvironmentsInput,
    output: ListEnvironmentsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists policy grants.
 */
export const listPolicyGrants = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPolicyGrantsInput,
    output: ListPolicyGrantsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "grantList",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists project profiles.
 */
export const listProjectProfiles =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListProjectProfilesInput,
    output: ListProjectProfilesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists Amazon DataZone projects.
 */
export const listProjects = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListProjectsInput,
    output: ListProjectsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Updates the status of the specified subscription grant status in Amazon DataZone.
 */
export const updateSubscriptionGrantStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateSubscriptionGrantStatusInput,
    output: UpdateSubscriptionGrantStatusOutput,
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
 * Gets an Amazon DataZone asset.
 *
 * An asset is the fundamental building block in Amazon DataZone, representing any data resource that needs to be cataloged and managed. It can take many forms, from Amazon S3 buckets and database tables to dashboards and machine learning models. Each asset contains comprehensive metadata about the resource, including its location, schema, ownership, and lineage information. Assets are essential for organizing and managing data resources across an organization, making them discoverable and usable while maintaining proper governance.
 *
 * Before using the Amazon DataZone GetAsset command, ensure the following prerequisites are met:
 *
 * - Domain identifier must exist and be valid
 *
 * - Asset identifier must exist
 *
 * - User must have the required permissions to perform the action
 */
export const getAsset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssetInput,
  output: GetAssetOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists child domain units for the specified parent domain unit.
 */
export const listDomainUnitsForParent =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDomainUnitsForParentInput,
    output: ListDomainUnitsForParentOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Gets a metadata form type in Amazon DataZone.
 *
 * Form types define the structure and validation rules for collecting metadata about assets in Amazon DataZone. They act as templates that ensure consistent metadata capture across similar types of assets, while allowing for customization to meet specific organizational needs. Form types can include required fields, validation rules, and dependencies, helping maintain high-quality metadata that makes data assets more discoverable and usable.
 *
 * - The form type with the specified identifier must exist in the given domain.
 *
 * - The domain must be valid and active.
 *
 * - User must have permission on the form type.
 *
 * - The form type should not be deleted or in an invalid state.
 *
 * One use case for this API is to determine whether a form field is indexed for search.
 *
 * A searchable field will be annotated with `@amazon.datazone#searchable`. By default, searchable fields are indexed for semantic search, where related query terms will match the attribute value even if they are not stemmed or keyword matches. If a field is indexed technical identifier search, it will be annotated with `@amazon.datazone#searchable(modes:["TECHNICAL"])`. If a field is indexed for lexical search (supports stemmed and prefix matches but not semantic matches), it will be annotated with `@amazon.datazone#searchable(modes:["LEXICAL"])`.
 *
 * A field storing glossary term IDs (which is filterable) will be annotated with `@amazon.datazone#glossaryterm("${glossaryId}")`.
 */
export const getFormType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFormTypeInput,
  output: GetFormTypeOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a metadata generation run in Amazon DataZone.
 *
 * Prerequisites:
 *
 * - Valid domain and run identifier.
 *
 * - The metadata generation run must exist.
 *
 * - User must have read access to the metadata run.
 */
export const getMetadataGenerationRun = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetMetadataGenerationRunInput,
    output: GetMetadataGenerationRunOutput,
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
 * Lists all metadata generation runs.
 *
 * Metadata generation runs represent automated processes that leverage AI/ML capabilities to create or enhance asset metadata at scale. This feature helps organizations maintain comprehensive and consistent metadata across large numbers of assets without manual intervention. It can automatically generate business descriptions, tags, and other metadata elements, significantly reducing the time and effort required for metadata management while improving consistency and completeness.
 *
 * Prerequisites:
 *
 * - Valid domain identifier.
 *
 * - User must have access to metadata generation runs in the domain.
 */
export const listMetadataGenerationRuns =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListMetadataGenerationRunsInput,
    output: ListMetadataGenerationRunsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists existing rules. In Amazon DataZone, a rule is a formal agreement that enforces specific requirements across user workflows (e.g., publishing assets to the catalog, requesting subscriptions, creating projects) within the Amazon DataZone data portal. These rules help maintain consistency, ensure compliance, and uphold governance standards in data management processes. For instance, a metadata enforcement rule can specify the required information for creating a subscription request or publishing a data asset to the catalog, ensuring alignment with organizational standards.
 */
export const listRules = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRulesInput,
  output: ListRulesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Tags a resource in Amazon DataZone.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists blueprint configurations for a Amazon DataZone environment.
 */
export const listEnvironmentBlueprintConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEnvironmentBlueprintConfigurationsInput,
    output: ListEnvironmentBlueprintConfigurationsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Removes a policy grant.
 */
export const removePolicyGrant = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemovePolicyGrantInput,
  output: RemovePolicyGrantOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Writes the attribute metadata.
 */
export const batchPutAttributesMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchPutAttributesMetadataInput,
    output: BatchPutAttributesMetadataOutput,
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
 * Creates an action for the environment, for example, creates a console link for an analytics tool that is available in this environment.
 */
export const createEnvironmentAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateEnvironmentActionInput,
    output: CreateEnvironmentActionOutput,
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
 * Creates a subsscription grant in Amazon DataZone.
 */
export const createSubscriptionGrant = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSubscriptionGrantInput,
    output: CreateSubscriptionGrantOutput,
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
 * Creates a user profile in Amazon DataZone.
 */
export const createUserProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserProfileInput,
  output: CreateUserProfileOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes and subscription grant in Amazon DataZone.
 */
export const deleteSubscriptionGrant = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSubscriptionGrantInput,
    output: DeleteSubscriptionGrantOutput,
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
 * Gets an Amazon DataZone environment.
 */
export const getEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnvironmentInput,
  output: GetEnvironmentOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the entity (domain units) owners.
 */
export const listEntityOwners = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListEntityOwnersInput,
    output: ListEntityOwnersOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "owners",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists Amazon DataZone subscription requests.
 */
export const listSubscriptionRequests =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSubscriptionRequestsInput,
    output: ListSubscriptionRequestsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Searches for types in Amazon DataZone.
 *
 * Prerequisites:
 *
 * - The --domain-identifier must refer to an existing Amazon DataZone domain.
 *
 * - --search-scope must be one of the valid values including: ASSET_TYPE, GLOSSARY_TERM_TYPE, DATA_PRODUCT_TYPE.
 *
 * - The --managed flag must be present without a value.
 *
 * - The user must have permissions for form or asset types in the domain.
 *
 * - If using --filters, ensure that the JSON is valid.
 *
 * - Filters contain correct structure (attribute, value, operator).
 */
export const searchTypes = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: SearchTypesInput,
    output: SearchTypesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Gets an Amazon DataZone asset type.
 *
 * Asset types define the categories and characteristics of different kinds of data assets within Amazon DataZone.. They determine what metadata fields are required, what operations are possible, and how the asset integrates with other Amazon Web Services services. Asset types can range from built-in types like Amazon S3 buckets and Amazon Web Services Glue tables to custom types defined for specific organizational needs. Understanding asset types is crucial for properly organizing and managing different kinds of data resources.
 *
 * Prerequisites:
 *
 * - The asset type with identifier must exist in the domain. ResourceNotFoundException.
 *
 * - You must have the GetAssetType permission.
 *
 * - Ensure the domain-identifier value is correct and accessible.
 */
export const getAssetType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssetTypeInput,
  output: GetAssetTypeOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a data product.
 *
 * A data product is a comprehensive package that combines data assets with their associated metadata, documentation, and access controls. It's designed to serve specific business needs or use cases, making it easier for users to find and consume data appropriately. Data products include important information about data quality, freshness, and usage guidelines, effectively bridging the gap between data producers and consumers while ensuring proper governance.
 *
 * Prerequisites:
 *
 * - The domain must exist and be accessible.
 *
 * - The owning project must be valid and active.
 *
 * - The name must be unique within the domain (no existing data product with the same name).
 *
 * - User must have create permissions for data products in the project.
 */
export const createDataProduct = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataProductInput,
  output: CreateDataProductOutput,
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
 * Creates a domain unit in Amazon DataZone.
 */
export const createDomainUnit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDomainUnitInput,
  output: CreateDomainUnitOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Writes the configuration for the specified environment blueprint in Amazon DataZone.
 */
export const putEnvironmentBlueprintConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutEnvironmentBlueprintConfigurationInput,
    output: PutEnvironmentBlueprintConfigurationOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Lists data sources in Amazon DataZone.
 */
export const listDataSources = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDataSourcesInput,
    output: ListDataSourcesOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Start the run of the specified data source in Amazon DataZone.
 */
export const startDataSourceRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDataSourceRunInput,
  output: StartDataSourceRunOutput,
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
 * Gets an Amazon DataZone data source run.
 */
export const getDataSourceRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataSourceRunInput,
  output: GetDataSourceRunOutput,
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
 * Lists data source runs in Amazon DataZone.
 */
export const listDataSourceRuns = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDataSourceRunsInput,
    output: ListDataSourceRunsOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Creates an Amazon DataZone domain.
 */
export const createDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDomainInput,
  output: CreateDomainOutput,
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
 * Lists Amazon DataZone domains.
 */
export const listDomains = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDomainsInput,
    output: ListDomainsOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Creates a metadata form type.
 *
 * Prerequisites:
 *
 * - The domain must exist and be in an `ENABLED` state.
 *
 * - The owning project must exist and be accessible.
 *
 * - The name must be unique within the domain.
 *
 * For custom form types, to indicate that a field should be searchable, annotate it with `@amazon.datazone#searchable`. By default, searchable fields are indexed for semantic search, where related query terms will match the attribute value even if they are not stemmed or keyword matches. To indicate that a field should be indexed for lexical search (which disables semantic search but supports stemmed and partial matches), annotate it with `@amazon.datazone#searchable(modes:["LEXICAL"])`. To indicate that a field should be indexed for technical identifier search (for more information on technical identifier search, see: https://aws.amazon.com/blogs/big-data/streamline-data-discovery-with-precise-technical-identifier-search-in-amazon-sagemaker-unified-studio/), annotate it with `@amazon.datazone#searchable(modes:["TECHNICAL"])`.
 *
 * To denote that a field will store glossary term ids (which are filterable via the Search/SearchListings APIs), annotate it with `@amazon.datazone#glossaryterm("${GLOSSARY_ID}")`, where `${GLOSSARY_ID}` is the id of the glossary that the glossary terms stored in the field belong to.
 */
export const createFormType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFormTypeInput,
  output: CreateFormTypeOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a business glossary term.
 *
 * A glossary term represents an individual entry within the Amazon DataZone glossary, serving as a standardized definition for a specific business concept or data element. Each term can include rich metadata such as detailed definitions, synonyms, related terms, and usage examples. Glossary terms can be linked directly to data assets, providing business context to technical data elements. This linking capability helps users understand the business meaning of data fields and ensures consistent interpretation across different systems and teams. Terms can also have relationships with other terms, creating a semantic network that reflects the complexity of business concepts.
 *
 * Prerequisites:
 *
 * - Domain must exist.
 *
 * - Glossary must exist.
 *
 * - The term name must be unique within the glossary.
 *
 * - Ensure term does not conflict with existing terms in hierarchy.
 */
export const createGlossaryTerm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGlossaryTermInput,
  output: CreateGlossaryTermOutput,
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
 * Starts the metadata generation run.
 *
 * Prerequisites:
 *
 * - Asset must be created and belong to the specified domain and project.
 *
 * - Asset type must be supported for metadata generation (e.g., Amazon Web Services Glue table).
 *
 * - Asset must have a structured schema with valid rows and columns.
 *
 * - Valid values for --type: BUSINESS_DESCRIPTIONS, BUSINESS_NAMES, BUSINESS_GLOSSARY_ASSOCIATIONS.
 *
 * - The user must have permission to run metadata generation in the domain/project.
 */
export const startMetadataGenerationRun = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartMetadataGenerationRunInput,
    output: StartMetadataGenerationRunOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates an Amazon DataZone environment profile.
 */
export const createEnvironmentProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateEnvironmentProfileInput,
    output: CreateEnvironmentProfileOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Publishes a listing (a record of an asset at a given time) or removes a listing from the catalog.
 */
export const createListingChangeSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateListingChangeSetInput,
    output: CreateListingChangeSetOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Posts a data lineage event.
 */
export const postLineageEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PostLineageEventInput,
  output: PostLineageEventOutput,
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
 * Creates data export configuration details.
 *
 * In the current release, you can enable exporting asset metadata only for one domain per Amazon Web Services account per region. If you disable exporting asset metadata feature for a domain where it's already enabled, you cannot enable this feature for another domain in the same Amazon Web Services account and region.
 */
export const putDataExportConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutDataExportConfigurationInput,
    output: PutDataExportConfigurationOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the account pool.
 */
export const updateAccountPool = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccountPoolInput,
  output: UpdateAccountPoolOutput,
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
 * Updates the specified environment in Amazon DataZone.
 */
export const updateEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnvironmentInput,
  output: UpdateEnvironmentOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an environment blueprint in Amazon DataZone.
 */
export const updateEnvironmentBlueprint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateEnvironmentBlueprintInput,
    output: UpdateEnvironmentBlueprintOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the specified environment profile in Amazon DataZone.
 */
export const updateEnvironmentProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateEnvironmentProfileInput,
    output: UpdateEnvironmentProfileOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates a project profile.
 */
export const updateProjectProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateProjectProfileInput,
    output: UpdateProjectProfileOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the specified data source in Amazon DataZone.
 */
export const updateDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataSourceInput,
  output: UpdateDataSourceOutput,
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
 * Deletes a data source in Amazon DataZone.
 */
export const deleteDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataSourceInput,
  output: DeleteDataSourceOutput,
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
 * Updates a Amazon DataZone domain.
 */
export const updateDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDomainInput,
  output: UpdateDomainOutput,
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
 * Creates an Amazon DataZone business glossary.
 *
 * Specifies that this is a create glossary policy.
 *
 * A glossary serves as the central repository for business terminology and definitions within an organization. It helps establish and maintain a common language across different departments and teams, reducing miscommunication and ensuring consistent interpretation of business concepts. Glossaries can include hierarchical relationships between terms, cross-references, and links to actual data assets, making them invaluable for both business users and technical teams trying to understand and use data correctly.
 *
 * Prerequisites:
 *
 * - Domain must exist and be in an active state.
 *
 * - Owning project must exist and be accessible by the caller.
 *
 * - The glossary name must be unique within the domain.
 */
export const createGlossary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGlossaryInput,
  output: CreateGlossaryOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a rule. In Amazon DataZone, a rule is a formal agreement that enforces specific requirements across user workflows (e.g., publishing assets to the catalog, requesting subscriptions, creating projects) within the Amazon DataZone data portal. These rules help maintain consistency, ensure compliance, and uphold governance standards in data management processes. For instance, a metadata enforcement rule can specify the required information for creating a subscription request or publishing a data asset to the catalog, ensuring alignment with organizational standards.
 */
export const updateRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRuleInput,
  output: UpdateRuleOutput,
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
 * Adds the owner of an entity (a domain unit).
 */
export const addEntityOwner = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddEntityOwnerInput,
  output: AddEntityOwnerOutput,
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
 * Gets an Amazon DataZone domain.
 */
export const getDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainInput,
  output: GetDomainOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes project membership in Amazon DataZone.
 */
export const deleteProjectMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteProjectMembershipInput,
    output: DeleteProjectMembershipOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Posts time series data points to Amazon DataZone for the specified asset.
 */
export const postTimeSeriesDataPoints = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PostTimeSeriesDataPointsInput,
    output: PostTimeSeriesDataPointsOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Accepts a subscription request to a specific asset.
 */
export const acceptSubscriptionRequest = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AcceptSubscriptionRequestInput,
    output: AcceptSubscriptionRequestOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates an account pool.
 */
export const createAccountPool = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccountPoolInput,
  output: CreateAccountPoolOutput,
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
 * Creates a Amazon DataZone blueprint.
 */
export const createEnvironmentBlueprint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateEnvironmentBlueprintInput,
    output: CreateEnvironmentBlueprintOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates an Amazon DataZone project.
 */
export const createProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProjectInput,
  output: CreateProjectOutput,
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
 * Creates a subscription request in Amazon DataZone.
 */
export const createSubscriptionRequest = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSubscriptionRequestInput,
    output: CreateSubscriptionRequestOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists data source run activities.
 */
export const listDataSourceRunActivities =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDataSourceRunActivitiesInput,
    output: ListDataSourceRunActivitiesOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Creates an asset in Amazon DataZone catalog.
 *
 * Before creating assets, make sure that the following requirements are met:
 *
 * - `--domain-identifier` must refer to an existing domain.
 *
 * - `--owning-project-identifier` must be a valid project within the domain.
 *
 * - Asset type must be created beforehand using `create-asset-type`, or be a supported system-defined type. For more information, see create-asset-type.
 *
 * - `--type-revision` (if used) must match a valid revision of the asset type.
 *
 * - `formsInput` is required when it is associated as required in the `asset-type`. For more information, see create-form-type.
 *
 * - Form content must include all required fields as per the form schema (e.g., `bucketArn`).
 *
 * You must invoke the following pre-requisite commands before invoking this API:
 *
 * - CreateFormType
 *
 * - CreateAssetType
 */
export const createAsset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssetInput,
  output: CreateAssetOutput,
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
 * Creates a custom asset type.
 *
 * Prerequisites:
 *
 * - The `formsInput` field is required, however, can be passed as empty (e.g. `-forms-input {})`.
 *
 * - You must have `CreateAssetType` permissions.
 *
 * - The domain-identifier and owning-project-identifier must be valid and active.
 *
 * - The name of the asset type must be unique within the domain — duplicate names will cause failure.
 *
 * - JSON input must be valid — incorrect formatting causes Invalid JSON errors.
 */
export const createAssetType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssetTypeInput,
  output: CreateAssetTypeOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a project profile.
 */
export const createProjectProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateProjectProfileInput,
    output: CreateProjectProfileOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets a connection. In Amazon DataZone, a connection enables you to connect your resources (domains, projects, and environments) to external resources and services.
 */
export const getConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectionInput,
  output: GetConnectionOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The details of the job run.
 */
export const getJobRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobRunInput,
  output: GetJobRunOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all Amazon DataZone notifications.
 */
export const listNotifications = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListNotificationsInput,
    output: ListNotificationsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "notifications",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists all members of the specified project.
 */
export const listProjectMemberships =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListProjectMembershipsInput,
    output: ListProjectMembershipsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "members",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Updates the specified project in Amazon DataZone.
 */
export const updateProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProjectInput,
  output: UpdateProjectOutput,
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
 * Gets an Amazon DataZone data source.
 */
export const getDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataSourceInput,
  output: GetDataSourceOutput,
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
 * Gets a listing (a record of an asset at a given time). If you specify a listing version, only details that are specific to that version are returned.
 */
export const getListing = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetListingInput,
  output: GetListingOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a rule in Amazon DataZone. A rule is a formal agreement that enforces specific requirements across user workflows (e.g., publishing assets to the catalog, requesting subscriptions, creating projects) within the Amazon DataZone data portal. These rules help maintain consistency, ensure compliance, and uphold governance standards in data management processes. For instance, a metadata enforcement rule can specify the required information for creating a subscription request or publishing a data asset to the catalog, ensuring alignment with organizational standards.
 */
export const createRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRuleInput,
  output: CreateRuleOutput,
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
 * Adds a policy grant (an authorization policy) to a specified entity, including domain units, environment blueprint configurations, or environment profiles.
 */
export const addPolicyGrant = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddPolicyGrantInput,
  output: AddPolicyGrantOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Cancels the subscription to the specified asset.
 */
export const cancelSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelSubscriptionInput,
  output: CancelSubscriptionOutput,
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
 * Lists lineage events.
 */
export const listLineageEvents = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListLineageEventsInput,
    output: ListLineageEventsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Updates a connection. In Amazon DataZone, a connection enables you to connect your resources (domains, projects, and environments) to external resources and services.
 */
export const updateConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConnectionInput,
  output: UpdateConnectionOutput,
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
 * Creates an Amazon DataZone data source.
 */
export const createDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataSourceInput,
  output: CreateDataSourceOutput,
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
 * Creates a data asset filter.
 *
 * Asset filters provide a sophisticated way to create controlled views of data assets by selecting specific columns or applying row-level filters. This capability is crucial for organizations that need to share data while maintaining security and privacy controls. For example, your database might be filtered to show only non-PII fields to certain users, or sales data might be filtered by region for different regional teams. Asset filters enable fine-grained access control while maintaining a single source of truth.
 *
 * Prerequisites:
 *
 * - A valid domain (`--domain-identifier`) must exist.
 *
 * - A data asset (`--asset-identifier`) must already be created under that domain.
 *
 * - The asset must have the referenced columns available in its schema for column-based filtering.
 *
 * - You cannot specify both (`columnConfiguration`, `rowConfiguration`)at the same time.
 */
export const createAssetFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssetFilterInput,
  output: CreateAssetFilterOutput,
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
 * Searches for assets in Amazon DataZone.
 *
 * Search in Amazon DataZone is a powerful capability that enables users to discover and explore data assets, glossary terms, and data products across their organization. It provides both basic and advanced search functionality, allowing users to find resources based on names, descriptions, metadata, and other attributes. Search can be scoped to specific types of resources (like assets, glossary terms, or data products) and can be filtered using various criteria such as creation date, owner, or status. The search functionality is essential for making the wealth of data resources in an organization discoverable and usable, helping users find the right data for their needs quickly and efficiently.
 *
 * Many search commands in Amazon DataZone are paginated, including `search` and `search-types`. When the result set is large, Amazon DataZone returns a `nextToken` in the response. This token can be used to retrieve the next page of results.
 *
 * Prerequisites:
 *
 * - The --domain-identifier must refer to an existing Amazon DataZone domain.
 *
 * - --search-scope must be one of: ASSET, GLOSSARY_TERM, DATA_PRODUCT, or GLOSSARY.
 *
 * - The user must have search permissions in the specified domain.
 *
 * - If using --filters, ensure that the JSON is well-formed and that each filter includes valid attribute and value keys.
 *
 * - For paginated results, be prepared to use --next-token to fetch additional pages.
 */
export const search = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchInput,
  output: SearchOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a new connection. In Amazon DataZone, a connection enables you to connect your resources (domains, projects, and environments) to external resources and services.
 */
export const createConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConnectionInput,
  output: CreateConnectionOutput,
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
 * Searches listings in Amazon DataZone.
 *
 * SearchListings is a powerful capability that enables users to discover and explore published assets and data products across their organization. It provides both basic and advanced search functionality, allowing users to find resources based on names, descriptions, metadata, and other attributes. SearchListings also supports filtering using various criteria such as creation date, owner, or status. This API is essential for making the wealth of data resources in an organization discoverable and usable, helping users find the right data for their needs quickly and efficiently.
 *
 * SearchListings returns results in a paginated format. When the result set is large, the response will include a nextToken, which can be used to retrieve the next page of results.
 *
 * The SearchListings API gives users flexibility in specifying what kind of search is run.
 *
 * To run a free-text search, the `searchText` parameter must be supplied. By default, all searchable fields are indexed for semantic search and will return semantic matches for SearchListings queries. To prevent semantic search indexing for a custom form attribute, see the CreateFormType API documentation. To run a lexical search query, enclose the query with double quotes (""). This will disable semantic search even for fields that have semantic search enabled and will only return results that contain the keywords wrapped by double quotes (order of tokens in the query is not enforced). Free-text search is supported for all attributes annotated with @amazon.datazone#searchable.
 *
 * To run a filtered search, provide filter clause using the filters parameter. To filter on glossary terms, use the special attribute `__DataZoneGlossaryTerms`.
 *
 * To find out whether an attribute has been annotated and indexed for a given search type, use the GetFormType API to retrieve the form containing the attribute.
 */
export const searchListings = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: SearchListingsInput,
    output: SearchListingsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
