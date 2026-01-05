import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "RolesAnywhere",
  serviceShapeName: "RolesAnywhere",
});
const auth = T.AwsAuthSigv4({ name: "rolesanywhere" });
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
                        url: "https://rolesanywhere-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://rolesanywhere-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://rolesanywhere.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://rolesanywhere.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
export const RoleArnList = S.Array(S.String);
export const ManagedPolicyList = S.Array(S.String);
export class MappingRule extends S.Class<MappingRule>("MappingRule")({
  specifier: S.String,
}) {}
export const MappingRules = S.Array(MappingRule);
export class AttributeMapping extends S.Class<AttributeMapping>(
  "AttributeMapping",
)({
  certificateField: S.optional(S.String),
  mappingRules: S.optional(MappingRules),
}) {}
export const AttributeMappings = S.Array(AttributeMapping);
export class ProfileDetail extends S.Class<ProfileDetail>("ProfileDetail")({
  profileId: S.optional(S.String),
  profileArn: S.optional(S.String),
  name: S.optional(S.String),
  requireInstanceProperties: S.optional(S.Boolean),
  enabled: S.optional(S.Boolean),
  createdBy: S.optional(S.String),
  sessionPolicy: S.optional(S.String),
  roleArns: S.optional(RoleArnList),
  managedPolicyArns: S.optional(ManagedPolicyList),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  durationSeconds: S.optional(S.Number),
  acceptRoleSessionName: S.optional(S.Boolean),
  attributeMappings: S.optional(AttributeMappings),
}) {}
export const ProfileDetails = S.Array(ProfileDetail);
export const SpecifierList = S.Array(S.String);
export const SourceData = S.Union(
  S.Struct({ x509CertificateData: S.String }),
  S.Struct({ acmPcaArn: S.String }),
);
export class Source extends S.Class<Source>("Source")({
  sourceType: S.optional(S.String),
  sourceData: S.optional(SourceData),
}) {}
export class NotificationSettingDetail extends S.Class<NotificationSettingDetail>(
  "NotificationSettingDetail",
)({
  enabled: S.Boolean,
  event: S.String,
  threshold: S.optional(S.Number),
  channel: S.optional(S.String),
  configuredBy: S.optional(S.String),
}) {}
export const NotificationSettingDetails = S.Array(NotificationSettingDetail);
export class TrustAnchorDetail extends S.Class<TrustAnchorDetail>(
  "TrustAnchorDetail",
)({
  trustAnchorId: S.optional(S.String),
  trustAnchorArn: S.optional(S.String),
  name: S.optional(S.String),
  source: S.optional(Source),
  enabled: S.optional(S.Boolean),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  notificationSettings: S.optional(NotificationSettingDetails),
}) {}
export const TrustAnchorDetails = S.Array(TrustAnchorDetail);
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpQuery("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/ListTagsForResource" }),
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
  { resourceArn: S.String, tagKeys: TagKeyList },
  T.all(
    T.Http({ method: "POST", uri: "/UntagResource" }),
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
export class Tag extends S.Class<Tag>("Tag")({
  key: S.String,
  value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class ImportCrlRequest extends S.Class<ImportCrlRequest>(
  "ImportCrlRequest",
)(
  {
    name: S.String,
    crlData: T.Blob,
    enabled: S.optional(S.Boolean),
    tags: S.optional(TagList),
    trustAnchorArn: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/crls" }), svc, auth, proto, ver, rules),
) {}
export class ScalarCrlRequest extends S.Class<ScalarCrlRequest>(
  "ScalarCrlRequest",
)(
  { crlId: S.String.pipe(T.HttpLabel("crlId")) },
  T.all(
    T.Http({ method: "GET", uri: "/crl/{crlId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCrlRequest extends S.Class<UpdateCrlRequest>(
  "UpdateCrlRequest",
)(
  {
    crlId: S.String.pipe(T.HttpLabel("crlId")),
    name: S.optional(S.String),
    crlData: S.optional(T.Blob),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/crl/{crlId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRequest extends S.Class<ListRequest>("ListRequest")(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/trustanchors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateProfileRequest extends S.Class<CreateProfileRequest>(
  "CreateProfileRequest",
)(
  {
    name: S.String,
    requireInstanceProperties: S.optional(S.Boolean),
    sessionPolicy: S.optional(S.String),
    roleArns: RoleArnList,
    managedPolicyArns: S.optional(ManagedPolicyList),
    durationSeconds: S.optional(S.Number),
    enabled: S.optional(S.Boolean),
    tags: S.optional(TagList),
    acceptRoleSessionName: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/profiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ScalarProfileRequest extends S.Class<ScalarProfileRequest>(
  "ScalarProfileRequest",
)(
  { profileId: S.String.pipe(T.HttpLabel("profileId")) },
  T.all(
    T.Http({ method: "GET", uri: "/profile/{profileId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateProfileRequest extends S.Class<UpdateProfileRequest>(
  "UpdateProfileRequest",
)(
  {
    profileId: S.String.pipe(T.HttpLabel("profileId")),
    name: S.optional(S.String),
    sessionPolicy: S.optional(S.String),
    roleArns: S.optional(RoleArnList),
    managedPolicyArns: S.optional(ManagedPolicyList),
    durationSeconds: S.optional(S.Number),
    acceptRoleSessionName: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/profile/{profileId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProfilesResponse extends S.Class<ListProfilesResponse>(
  "ListProfilesResponse",
)({ nextToken: S.optional(S.String), profiles: S.optional(ProfileDetails) }) {}
export class DeleteAttributeMappingRequest extends S.Class<DeleteAttributeMappingRequest>(
  "DeleteAttributeMappingRequest",
)(
  {
    profileId: S.String.pipe(T.HttpLabel("profileId")),
    certificateField: S.String.pipe(T.HttpQuery("certificateField")),
    specifiers: S.optional(SpecifierList).pipe(T.HttpQuery("specifiers")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/profiles/{profileId}/mappings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ScalarSubjectRequest extends S.Class<ScalarSubjectRequest>(
  "ScalarSubjectRequest",
)(
  { subjectId: S.String.pipe(T.HttpLabel("subjectId")) },
  T.all(
    T.Http({ method: "GET", uri: "/subject/{subjectId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ScalarTrustAnchorRequest extends S.Class<ScalarTrustAnchorRequest>(
  "ScalarTrustAnchorRequest",
)(
  { trustAnchorId: S.String.pipe(T.HttpLabel("trustAnchorId")) },
  T.all(
    T.Http({ method: "GET", uri: "/trustanchor/{trustAnchorId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTrustAnchorRequest extends S.Class<UpdateTrustAnchorRequest>(
  "UpdateTrustAnchorRequest",
)(
  {
    trustAnchorId: S.String.pipe(T.HttpLabel("trustAnchorId")),
    name: S.optional(S.String),
    source: S.optional(Source),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/trustanchor/{trustAnchorId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTrustAnchorsResponse extends S.Class<ListTrustAnchorsResponse>(
  "ListTrustAnchorsResponse",
)({
  nextToken: S.optional(S.String),
  trustAnchors: S.optional(TrustAnchorDetails),
}) {}
export class NotificationSetting extends S.Class<NotificationSetting>(
  "NotificationSetting",
)({
  enabled: S.Boolean,
  event: S.String,
  threshold: S.optional(S.Number),
  channel: S.optional(S.String),
}) {}
export const NotificationSettings = S.Array(NotificationSetting);
export class NotificationSettingKey extends S.Class<NotificationSettingKey>(
  "NotificationSettingKey",
)({ event: S.String, channel: S.optional(S.String) }) {}
export const NotificationSettingKeys = S.Array(NotificationSettingKey);
export class CrlDetail extends S.Class<CrlDetail>("CrlDetail")({
  crlId: S.optional(S.String),
  crlArn: S.optional(S.String),
  name: S.optional(S.String),
  enabled: S.optional(S.Boolean),
  crlData: S.optional(T.Blob),
  trustAnchorArn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const CrlDetails = S.Array(CrlDetail);
export class SubjectSummary extends S.Class<SubjectSummary>("SubjectSummary")({
  subjectArn: S.optional(S.String),
  subjectId: S.optional(S.String),
  enabled: S.optional(S.Boolean),
  x509Subject: S.optional(S.String),
  lastSeenAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const SubjectSummaries = S.Array(SubjectSummary);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagList) }) {}
export class PutNotificationSettingsRequest extends S.Class<PutNotificationSettingsRequest>(
  "PutNotificationSettingsRequest",
)(
  { trustAnchorId: S.String, notificationSettings: NotificationSettings },
  T.all(
    T.Http({ method: "PATCH", uri: "/put-notifications-settings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResetNotificationSettingsRequest extends S.Class<ResetNotificationSettingsRequest>(
  "ResetNotificationSettingsRequest",
)(
  { trustAnchorId: S.String, notificationSettingKeys: NotificationSettingKeys },
  T.all(
    T.Http({ method: "PATCH", uri: "/reset-notifications-settings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String, tags: TagList },
  T.all(
    T.Http({ method: "POST", uri: "/TagResource" }),
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
export class CrlDetailResponse extends S.Class<CrlDetailResponse>(
  "CrlDetailResponse",
)({ crl: CrlDetail }) {}
export class ListCrlsResponse extends S.Class<ListCrlsResponse>(
  "ListCrlsResponse",
)({ nextToken: S.optional(S.String), crls: S.optional(CrlDetails) }) {}
export class DeleteAttributeMappingResponse extends S.Class<DeleteAttributeMappingResponse>(
  "DeleteAttributeMappingResponse",
)({ profile: ProfileDetail }) {}
export class PutAttributeMappingRequest extends S.Class<PutAttributeMappingRequest>(
  "PutAttributeMappingRequest",
)(
  {
    profileId: S.String.pipe(T.HttpLabel("profileId")),
    certificateField: S.String,
    mappingRules: MappingRules,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/profiles/{profileId}/mappings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSubjectsResponse extends S.Class<ListSubjectsResponse>(
  "ListSubjectsResponse",
)({
  subjects: S.optional(SubjectSummaries),
  nextToken: S.optional(S.String),
}) {}
export class PutNotificationSettingsResponse extends S.Class<PutNotificationSettingsResponse>(
  "PutNotificationSettingsResponse",
)({ trustAnchor: TrustAnchorDetail }) {}
export class ResetNotificationSettingsResponse extends S.Class<ResetNotificationSettingsResponse>(
  "ResetNotificationSettingsResponse",
)({ trustAnchor: TrustAnchorDetail }) {}
export class ProfileDetailResponse extends S.Class<ProfileDetailResponse>(
  "ProfileDetailResponse",
)({ profile: S.optional(ProfileDetail) }) {}
export class PutAttributeMappingResponse extends S.Class<PutAttributeMappingResponse>(
  "PutAttributeMappingResponse",
)({ profile: ProfileDetail }) {}
export class CreateTrustAnchorRequest extends S.Class<CreateTrustAnchorRequest>(
  "CreateTrustAnchorRequest",
)(
  {
    name: S.String,
    source: Source,
    enabled: S.optional(S.Boolean),
    tags: S.optional(TagList),
    notificationSettings: S.optional(NotificationSettings),
  },
  T.all(
    T.Http({ method: "POST", uri: "/trustanchors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TrustAnchorDetailResponse extends S.Class<TrustAnchorDetailResponse>(
  "TrustAnchorDetailResponse",
)({ trustAnchor: TrustAnchorDetail }) {}
export class CredentialSummary extends S.Class<CredentialSummary>(
  "CredentialSummary",
)({
  seenAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  serialNumber: S.optional(S.String),
  issuer: S.optional(S.String),
  enabled: S.optional(S.Boolean),
  x509CertificateData: S.optional(S.String),
  failed: S.optional(S.Boolean),
}) {}
export const CredentialSummaries = S.Array(CredentialSummary);
export const InstancePropertyMap = S.Record({ key: S.String, value: S.String });
export class InstanceProperty extends S.Class<InstanceProperty>(
  "InstanceProperty",
)({
  seenAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  properties: S.optional(InstancePropertyMap),
  failed: S.optional(S.Boolean),
}) {}
export const InstanceProperties = S.Array(InstanceProperty);
export class SubjectDetail extends S.Class<SubjectDetail>("SubjectDetail")({
  subjectArn: S.optional(S.String),
  subjectId: S.optional(S.String),
  enabled: S.optional(S.Boolean),
  x509Subject: S.optional(S.String),
  lastSeenAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  credentials: S.optional(CredentialSummaries),
  instanceProperties: S.optional(InstanceProperties),
}) {}
export class SubjectDetailResponse extends S.Class<SubjectDetailResponse>(
  "SubjectDetailResponse",
)({ subject: S.optional(SubjectDetail) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Gets a certificate revocation list (CRL).
 *
 * **Required permissions: ** `rolesanywhere:GetCrl`.
 */
export const getCrl = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarCrlRequest,
  output: CrlDetailResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Deletes a certificate revocation list (CRL).
 *
 * **Required permissions: ** `rolesanywhere:DeleteCrl`.
 */
export const deleteCrl = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarCrlRequest,
  output: CrlDetailResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Creates a *profile*, a list of the roles that Roles Anywhere service is trusted to assume. You use profiles to intersect permissions with IAM managed policies.
 *
 * **Required permissions: ** `rolesanywhere:CreateProfile`.
 */
export const createProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProfileRequest,
  output: ProfileDetailResponse,
  errors: [AccessDeniedException, ValidationException],
}));
/**
 * Delete an entry from the attribute mapping rules enforced by a given profile.
 */
export const deleteAttributeMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAttributeMappingRequest,
    output: DeleteAttributeMappingResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Lists the subjects in the authenticated account and Amazon Web Services Region.
 *
 * **Required permissions: ** `rolesanywhere:ListSubjects`.
 */
export const listSubjects = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListRequest,
    output: ListSubjectsResponse,
    errors: [AccessDeniedException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "subjects",
    } as const,
  }),
);
/**
 * Disables a certificate revocation list (CRL).
 *
 * **Required permissions: ** `rolesanywhere:DisableCrl`.
 */
export const disableCrl = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarCrlRequest,
  output: CrlDetailResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Gets a profile.
 *
 * **Required permissions: ** `rolesanywhere:GetProfile`.
 */
export const getProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarProfileRequest,
  output: ProfileDetailResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Updates a *profile*, a list of the roles that IAM Roles Anywhere service is trusted to assume. You use profiles to intersect permissions with IAM managed policies.
 *
 * **Required permissions: ** `rolesanywhere:UpdateProfile`.
 */
export const updateProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProfileRequest,
  output: ProfileDetailResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets a trust anchor.
 *
 * **Required permissions: ** `rolesanywhere:GetTrustAnchor`.
 */
export const getTrustAnchor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarTrustAnchorRequest,
  output: TrustAnchorDetailResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates a trust anchor. You establish trust between IAM Roles Anywhere and your certificate authority (CA) by configuring a trust anchor. You can define a trust anchor as a reference to an Private Certificate Authority (Private CA) or by uploading a CA certificate. Your Amazon Web Services workloads can authenticate with the trust anchor using certificates issued by the CA in exchange for temporary Amazon Web Services credentials.
 *
 * **Required permissions: ** `rolesanywhere:UpdateTrustAnchor`.
 */
export const updateTrustAnchor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTrustAnchorRequest,
  output: TrustAnchorDetailResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Enables a certificate revocation list (CRL). When enabled, certificates stored in the CRL are unauthorized to receive session credentials.
 *
 * **Required permissions: ** `rolesanywhere:EnableCrl`.
 */
export const enableCrl = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarCrlRequest,
  output: CrlDetailResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Disables a profile. When disabled, temporary credential requests with this profile fail.
 *
 * **Required permissions: ** `rolesanywhere:DisableProfile`.
 */
export const disableProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarProfileRequest,
  output: ProfileDetailResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Enables temporary credential requests for a profile.
 *
 * **Required permissions: ** `rolesanywhere:EnableProfile`.
 */
export const enableProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarProfileRequest,
  output: ProfileDetailResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Disables a trust anchor. When disabled, temporary credential requests specifying this trust anchor are unauthorized.
 *
 * **Required permissions: ** `rolesanywhere:DisableTrustAnchor`.
 */
export const disableTrustAnchor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarTrustAnchorRequest,
  output: TrustAnchorDetailResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Enables a trust anchor. When enabled, certificates in the trust anchor chain are authorized for trust validation.
 *
 * **Required permissions: ** `rolesanywhere:EnableTrustAnchor`.
 */
export const enableTrustAnchor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarTrustAnchorRequest,
  output: TrustAnchorDetailResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Removes tags from the resource.
 *
 * **Required permissions: ** `rolesanywhere:UntagResource`.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the certificate revocation list (CRL). A CRL is a list of certificates that have been revoked by the issuing certificate authority (CA). IAM Roles Anywhere validates against the CRL before issuing credentials.
 *
 * **Required permissions: ** `rolesanywhere:UpdateCrl`.
 */
export const updateCrl = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCrlRequest,
  output: CrlDetailResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the tags attached to the resource.
 *
 * **Required permissions: ** `rolesanywhere:ListTagsForResource`.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists all profiles in the authenticated account and Amazon Web Services Region.
 *
 * **Required permissions: ** `rolesanywhere:ListProfiles`.
 */
export const listProfiles = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListRequest,
    output: ListProfilesResponse,
    errors: [AccessDeniedException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "profiles",
    } as const,
  }),
);
/**
 * Lists the trust anchors in the authenticated account and Amazon Web Services Region.
 *
 * **Required permissions: ** `rolesanywhere:ListTrustAnchors`.
 */
export const listTrustAnchors = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListRequest,
    output: ListTrustAnchorsResponse,
    errors: [AccessDeniedException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "trustAnchors",
    } as const,
  }),
);
/**
 * Imports the certificate revocation list (CRL). A CRL is a list of certificates that have been revoked by the issuing certificate Authority (CA).In order to be properly imported, a CRL must be in PEM format. IAM Roles Anywhere validates against the CRL before issuing credentials.
 *
 * **Required permissions: ** `rolesanywhere:ImportCrl`.
 */
export const importCrl = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportCrlRequest,
  output: CrlDetailResponse,
  errors: [AccessDeniedException, ValidationException],
}));
/**
 * Lists all certificate revocation lists (CRL) in the authenticated account and Amazon Web Services Region.
 *
 * **Required permissions: ** `rolesanywhere:ListCrls`.
 */
export const listCrls = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRequest,
  output: ListCrlsResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "crls",
  } as const,
}));
/**
 * Attaches a list of *notification settings* to a trust anchor.
 *
 * A notification setting includes information such as event name, threshold, status of the notification setting, and the channel to notify.
 *
 * **Required permissions: ** `rolesanywhere:PutNotificationSettings`.
 */
export const putNotificationSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutNotificationSettingsRequest,
    output: PutNotificationSettingsResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Resets the *custom notification setting* to IAM Roles Anywhere default setting.
 *
 * **Required permissions: ** `rolesanywhere:ResetNotificationSettings`.
 */
export const resetNotificationSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ResetNotificationSettingsRequest,
    output: ResetNotificationSettingsResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a profile.
 *
 * **Required permissions: ** `rolesanywhere:DeleteProfile`.
 */
export const deleteProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarProfileRequest,
  output: ProfileDetailResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Put an entry in the attribute mapping rules that will be enforced by a given profile. A mapping specifies a certificate field and one or more specifiers that have contextual meanings.
 */
export const putAttributeMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAttributeMappingRequest,
  output: PutAttributeMappingResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a trust anchor to establish trust between IAM Roles Anywhere and your certificate authority (CA). You can define a trust anchor as a reference to an Private Certificate Authority (Private CA) or by uploading a CA certificate. Your Amazon Web Services workloads can authenticate with the trust anchor using certificates issued by the CA in exchange for temporary Amazon Web Services credentials.
 *
 * **Required permissions: ** `rolesanywhere:CreateTrustAnchor`.
 */
export const createTrustAnchor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTrustAnchorRequest,
  output: TrustAnchorDetailResponse,
  errors: [AccessDeniedException, ValidationException],
}));
/**
 * Deletes a trust anchor.
 *
 * **Required permissions: ** `rolesanywhere:DeleteTrustAnchor`.
 */
export const deleteTrustAnchor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarTrustAnchorRequest,
  output: TrustAnchorDetailResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Attaches tags to a resource.
 *
 * **Required permissions: ** `rolesanywhere:TagResource`.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Gets a *subject*, which associates a certificate identity with authentication attempts. The subject stores auditing information such as the status of the last authentication attempt, the certificate data used in the attempt, and the last time the associated identity attempted authentication.
 *
 * **Required permissions: ** `rolesanywhere:GetSubject`.
 */
export const getSubject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarSubjectRequest,
  output: SubjectDetailResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
