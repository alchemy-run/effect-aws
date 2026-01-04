import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "IoT",
  serviceShapeName: "AWSIotService",
});
const auth = T.AwsAuthSigv4({ name: "iot" });
const ver = T.ServiceVersion("2015-05-28");
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
                        url: "https://iot-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://iot-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://iot.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [
                    "aws",
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                  ],
                },
              ],
              endpoint: {
                url: "https://iot.{Region}.amazonaws.com",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [
                    "aws-cn",
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                  ],
                },
              ],
              endpoint: {
                url: "https://iot.{Region}.amazonaws.com.cn",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [
                    "aws-us-gov",
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                  ],
                },
              ],
              endpoint: {
                url: "https://iot.{Region}.amazonaws.com",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://iot.{Region}.{PartitionResult#dnsSuffix}",
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
export class ClearDefaultAuthorizerRequest extends S.Class<ClearDefaultAuthorizerRequest>(
  "ClearDefaultAuthorizerRequest",
)(
  {},
  T.all(
    T.Http({ method: "DELETE", uri: "/default-authorizer" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ClearDefaultAuthorizerResponse extends S.Class<ClearDefaultAuthorizerResponse>(
  "ClearDefaultAuthorizerResponse",
)({}) {}
export class DeleteRegistrationCodeRequest extends S.Class<DeleteRegistrationCodeRequest>(
  "DeleteRegistrationCodeRequest",
)(
  {},
  T.all(
    T.Http({ method: "DELETE", uri: "/registrationcode" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRegistrationCodeResponse extends S.Class<DeleteRegistrationCodeResponse>(
  "DeleteRegistrationCodeResponse",
)({}) {}
export class DescribeAccountAuditConfigurationRequest extends S.Class<DescribeAccountAuditConfigurationRequest>(
  "DescribeAccountAuditConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/audit/configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDefaultAuthorizerRequest extends S.Class<DescribeDefaultAuthorizerRequest>(
  "DescribeDefaultAuthorizerRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/default-authorizer" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeEncryptionConfigurationRequest extends S.Class<DescribeEncryptionConfigurationRequest>(
  "DescribeEncryptionConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/encryption-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeEventConfigurationsRequest extends S.Class<DescribeEventConfigurationsRequest>(
  "DescribeEventConfigurationsRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/event-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIndexingConfigurationRequest extends S.Class<GetIndexingConfigurationRequest>(
  "GetIndexingConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/indexing/config" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLoggingOptionsRequest extends S.Class<GetLoggingOptionsRequest>(
  "GetLoggingOptionsRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/loggingOptions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPackageConfigurationRequest extends S.Class<GetPackageConfigurationRequest>(
  "GetPackageConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/package-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRegistrationCodeRequest extends S.Class<GetRegistrationCodeRequest>(
  "GetRegistrationCodeRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/registrationcode" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const JobTargets = S.Array(S.String);
export const CertificateProviderAccountDefaultForOperations = S.Array(S.String);
export const DimensionStringValues = S.Array(S.String);
export const ServerCertificateArns = S.Array(S.String);
export const DestinationPackageVersions = S.Array(S.String);
export const Targets = S.Array(S.String);
export const Protocols = S.Array(S.String);
export const TargetAuditCheckNames = S.Array(S.String);
export const AdditionalMetricsToRetainList = S.Array(S.String);
export const PercentList = S.Array(S.Number);
export const DetectMitigationActionsToExecuteList = S.Array(S.String);
export const PolicyNames = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export const ThingGroupList = S.Array(S.String);
export class AcceptCertificateTransferRequest extends S.Class<AcceptCertificateTransferRequest>(
  "AcceptCertificateTransferRequest",
)(
  {
    certificateId: S.String.pipe(T.HttpLabel()),
    setAsActive: S.optional(S.Boolean).pipe(T.HttpQuery("setAsActive")),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/accept-certificate-transfer/{certificateId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AcceptCertificateTransferResponse extends S.Class<AcceptCertificateTransferResponse>(
  "AcceptCertificateTransferResponse",
)({}) {}
export class AddThingToBillingGroupRequest extends S.Class<AddThingToBillingGroupRequest>(
  "AddThingToBillingGroupRequest",
)(
  {
    billingGroupName: S.optional(S.String),
    billingGroupArn: S.optional(S.String),
    thingName: S.optional(S.String),
    thingArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/billing-groups/addThingToBillingGroup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AddThingToBillingGroupResponse extends S.Class<AddThingToBillingGroupResponse>(
  "AddThingToBillingGroupResponse",
)({}) {}
export class AddThingToThingGroupRequest extends S.Class<AddThingToThingGroupRequest>(
  "AddThingToThingGroupRequest",
)(
  {
    thingGroupName: S.optional(S.String),
    thingGroupArn: S.optional(S.String),
    thingName: S.optional(S.String),
    thingArn: S.optional(S.String),
    overrideDynamicGroups: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/thing-groups/addThingToThingGroup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AddThingToThingGroupResponse extends S.Class<AddThingToThingGroupResponse>(
  "AddThingToThingGroupResponse",
)({}) {}
export class AssociateTargetsWithJobRequest extends S.Class<AssociateTargetsWithJobRequest>(
  "AssociateTargetsWithJobRequest",
)(
  {
    targets: JobTargets,
    jobId: S.String.pipe(T.HttpLabel()),
    comment: S.optional(S.String),
    namespaceId: S.optional(S.String).pipe(T.HttpQuery("namespaceId")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/jobs/{jobId}/targets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AttachPolicyRequest extends S.Class<AttachPolicyRequest>(
  "AttachPolicyRequest",
)(
  { policyName: S.String.pipe(T.HttpLabel()), target: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/target-policies/{policyName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AttachPolicyResponse extends S.Class<AttachPolicyResponse>(
  "AttachPolicyResponse",
)({}) {}
export class AttachPrincipalPolicyRequest extends S.Class<AttachPrincipalPolicyRequest>(
  "AttachPrincipalPolicyRequest",
)(
  {
    policyName: S.String.pipe(T.HttpLabel()),
    principal: S.String.pipe(T.HttpHeader("x-amzn-iot-principal")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/principal-policies/{policyName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AttachPrincipalPolicyResponse extends S.Class<AttachPrincipalPolicyResponse>(
  "AttachPrincipalPolicyResponse",
)({}) {}
export class AttachSecurityProfileRequest extends S.Class<AttachSecurityProfileRequest>(
  "AttachSecurityProfileRequest",
)(
  {
    securityProfileName: S.String.pipe(T.HttpLabel()),
    securityProfileTargetArn: S.String.pipe(
      T.HttpQuery("securityProfileTargetArn"),
    ),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/security-profiles/{securityProfileName}/targets",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AttachSecurityProfileResponse extends S.Class<AttachSecurityProfileResponse>(
  "AttachSecurityProfileResponse",
)({}) {}
export class AttachThingPrincipalRequest extends S.Class<AttachThingPrincipalRequest>(
  "AttachThingPrincipalRequest",
)(
  {
    thingName: S.String.pipe(T.HttpLabel()),
    principal: S.String.pipe(T.HttpHeader("x-amzn-principal")),
    thingPrincipalType: S.optional(S.String).pipe(
      T.HttpQuery("thingPrincipalType"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/things/{thingName}/principals" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AttachThingPrincipalResponse extends S.Class<AttachThingPrincipalResponse>(
  "AttachThingPrincipalResponse",
)({}) {}
export class CancelAuditMitigationActionsTaskRequest extends S.Class<CancelAuditMitigationActionsTaskRequest>(
  "CancelAuditMitigationActionsTaskRequest",
)(
  { taskId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/audit/mitigationactions/tasks/{taskId}/cancel",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelAuditMitigationActionsTaskResponse extends S.Class<CancelAuditMitigationActionsTaskResponse>(
  "CancelAuditMitigationActionsTaskResponse",
)({}) {}
export class CancelAuditTaskRequest extends S.Class<CancelAuditTaskRequest>(
  "CancelAuditTaskRequest",
)(
  { taskId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "PUT", uri: "/audit/tasks/{taskId}/cancel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelAuditTaskResponse extends S.Class<CancelAuditTaskResponse>(
  "CancelAuditTaskResponse",
)({}) {}
export class CancelCertificateTransferRequest extends S.Class<CancelCertificateTransferRequest>(
  "CancelCertificateTransferRequest",
)(
  { certificateId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/cancel-certificate-transfer/{certificateId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelCertificateTransferResponse extends S.Class<CancelCertificateTransferResponse>(
  "CancelCertificateTransferResponse",
)({}) {}
export class CancelDetectMitigationActionsTaskRequest extends S.Class<CancelDetectMitigationActionsTaskRequest>(
  "CancelDetectMitigationActionsTaskRequest",
)(
  { taskId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/detect/mitigationactions/tasks/{taskId}/cancel",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelDetectMitigationActionsTaskResponse extends S.Class<CancelDetectMitigationActionsTaskResponse>(
  "CancelDetectMitigationActionsTaskResponse",
)({}) {}
export class CancelJobRequest extends S.Class<CancelJobRequest>(
  "CancelJobRequest",
)(
  {
    jobId: S.String.pipe(T.HttpLabel()),
    reasonCode: S.optional(S.String),
    comment: S.optional(S.String),
    force: S.optional(S.Boolean).pipe(T.HttpQuery("force")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/jobs/{jobId}/cancel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ConfirmTopicRuleDestinationRequest extends S.Class<ConfirmTopicRuleDestinationRequest>(
  "ConfirmTopicRuleDestinationRequest",
)(
  { confirmationToken: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/confirmdestination/{confirmationToken+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ConfirmTopicRuleDestinationResponse extends S.Class<ConfirmTopicRuleDestinationResponse>(
  "ConfirmTopicRuleDestinationResponse",
)({}) {}
export class CreateCertificateFromCsrRequest extends S.Class<CreateCertificateFromCsrRequest>(
  "CreateCertificateFromCsrRequest",
)(
  {
    certificateSigningRequest: S.String,
    setAsActive: S.optional(S.Boolean).pipe(T.HttpQuery("setAsActive")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/certificates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class CreateCertificateProviderRequest extends S.Class<CreateCertificateProviderRequest>(
  "CreateCertificateProviderRequest",
)(
  {
    certificateProviderName: S.String.pipe(T.HttpLabel()),
    lambdaFunctionArn: S.String,
    accountDefaultForOperations: CertificateProviderAccountDefaultForOperations,
    clientToken: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/certificate-providers/{certificateProviderName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCustomMetricRequest extends S.Class<CreateCustomMetricRequest>(
  "CreateCustomMetricRequest",
)(
  {
    metricName: S.String.pipe(T.HttpLabel()),
    displayName: S.optional(S.String),
    metricType: S.String,
    tags: S.optional(TagList),
    clientRequestToken: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/custom-metric/{metricName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDimensionRequest extends S.Class<CreateDimensionRequest>(
  "CreateDimensionRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel()),
    type: S.String,
    stringValues: DimensionStringValues,
    tags: S.optional(TagList),
    clientRequestToken: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/dimensions/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateKeysAndCertificateRequest extends S.Class<CreateKeysAndCertificateRequest>(
  "CreateKeysAndCertificateRequest",
)(
  { setAsActive: S.optional(S.Boolean).pipe(T.HttpQuery("setAsActive")) },
  T.all(
    T.Http({ method: "POST", uri: "/keys-and-certificate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePolicyRequest extends S.Class<CreatePolicyRequest>(
  "CreatePolicyRequest",
)(
  {
    policyName: S.String.pipe(T.HttpLabel()),
    policyDocument: S.String,
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/policies/{policyName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePolicyVersionRequest extends S.Class<CreatePolicyVersionRequest>(
  "CreatePolicyVersionRequest",
)(
  {
    policyName: S.String.pipe(T.HttpLabel()),
    policyDocument: S.String,
    setAsDefault: S.optional(S.Boolean).pipe(T.HttpQuery("setAsDefault")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/policies/{policyName}/version" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateProvisioningClaimRequest extends S.Class<CreateProvisioningClaimRequest>(
  "CreateProvisioningClaimRequest",
)(
  { templateName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/provisioning-templates/{templateName}/provisioning-claim",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateProvisioningTemplateVersionRequest extends S.Class<CreateProvisioningTemplateVersionRequest>(
  "CreateProvisioningTemplateVersionRequest",
)(
  {
    templateName: S.String.pipe(T.HttpLabel()),
    templateBody: S.String,
    setAsDefault: S.optional(S.Boolean).pipe(T.HttpQuery("setAsDefault")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/provisioning-templates/{templateName}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRoleAliasRequest extends S.Class<CreateRoleAliasRequest>(
  "CreateRoleAliasRequest",
)(
  {
    roleAlias: S.String.pipe(T.HttpLabel()),
    roleArn: S.String,
    credentialDurationSeconds: S.optional(S.Number),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/role-aliases/{roleAlias}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateScheduledAuditRequest extends S.Class<CreateScheduledAuditRequest>(
  "CreateScheduledAuditRequest",
)(
  {
    frequency: S.String,
    dayOfMonth: S.optional(S.String),
    dayOfWeek: S.optional(S.String),
    targetCheckNames: TargetAuditCheckNames,
    scheduledAuditName: S.String.pipe(T.HttpLabel()),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/audit/scheduledaudits/{scheduledAuditName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Attributes = S.Record({ key: S.String, value: S.String });
export class AttributePayload extends S.Class<AttributePayload>(
  "AttributePayload",
)({ attributes: S.optional(Attributes), merge: S.optional(S.Boolean) }) {}
export class ThingGroupProperties extends S.Class<ThingGroupProperties>(
  "ThingGroupProperties",
)({
  thingGroupDescription: S.optional(S.String),
  attributePayload: S.optional(AttributePayload),
}) {}
export class CreateThingGroupRequest extends S.Class<CreateThingGroupRequest>(
  "CreateThingGroupRequest",
)(
  {
    thingGroupName: S.String.pipe(T.HttpLabel()),
    parentGroupName: S.optional(S.String),
    thingGroupProperties: S.optional(ThingGroupProperties),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/thing-groups/{thingGroupName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccountAuditConfigurationRequest extends S.Class<DeleteAccountAuditConfigurationRequest>(
  "DeleteAccountAuditConfigurationRequest",
)(
  {
    deleteScheduledAudits: S.optional(S.Boolean).pipe(
      T.HttpQuery("deleteScheduledAudits"),
    ),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/audit/configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccountAuditConfigurationResponse extends S.Class<DeleteAccountAuditConfigurationResponse>(
  "DeleteAccountAuditConfigurationResponse",
)({}) {}
export class PolicyVersionIdentifier extends S.Class<PolicyVersionIdentifier>(
  "PolicyVersionIdentifier",
)({
  policyName: S.optional(S.String),
  policyVersionId: S.optional(S.String),
}) {}
export class IssuerCertificateIdentifier extends S.Class<IssuerCertificateIdentifier>(
  "IssuerCertificateIdentifier",
)({
  issuerCertificateSubject: S.optional(S.String),
  issuerId: S.optional(S.String),
  issuerCertificateSerialNumber: S.optional(S.String),
}) {}
export class ResourceIdentifier extends S.Class<ResourceIdentifier>(
  "ResourceIdentifier",
)({
  deviceCertificateId: S.optional(S.String),
  caCertificateId: S.optional(S.String),
  cognitoIdentityPoolId: S.optional(S.String),
  clientId: S.optional(S.String),
  policyVersionIdentifier: S.optional(PolicyVersionIdentifier),
  account: S.optional(S.String),
  iamRoleArn: S.optional(S.String),
  roleAliasArn: S.optional(S.String),
  issuerCertificateIdentifier: S.optional(IssuerCertificateIdentifier),
  deviceCertificateArn: S.optional(S.String),
}) {}
export class DeleteAuditSuppressionRequest extends S.Class<DeleteAuditSuppressionRequest>(
  "DeleteAuditSuppressionRequest",
)(
  { checkName: S.String, resourceIdentifier: ResourceIdentifier },
  T.all(
    T.Http({ method: "POST", uri: "/audit/suppressions/delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAuditSuppressionResponse extends S.Class<DeleteAuditSuppressionResponse>(
  "DeleteAuditSuppressionResponse",
)({}) {}
export class DeleteAuthorizerRequest extends S.Class<DeleteAuthorizerRequest>(
  "DeleteAuthorizerRequest",
)(
  { authorizerName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/authorizer/{authorizerName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAuthorizerResponse extends S.Class<DeleteAuthorizerResponse>(
  "DeleteAuthorizerResponse",
)({}) {}
export class DeleteBillingGroupRequest extends S.Class<DeleteBillingGroupRequest>(
  "DeleteBillingGroupRequest",
)(
  {
    billingGroupName: S.String.pipe(T.HttpLabel()),
    expectedVersion: S.optional(S.Number).pipe(T.HttpQuery("expectedVersion")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/billing-groups/{billingGroupName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBillingGroupResponse extends S.Class<DeleteBillingGroupResponse>(
  "DeleteBillingGroupResponse",
)({}) {}
export class DeleteCACertificateRequest extends S.Class<DeleteCACertificateRequest>(
  "DeleteCACertificateRequest",
)(
  { certificateId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/cacertificate/{certificateId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCACertificateResponse extends S.Class<DeleteCACertificateResponse>(
  "DeleteCACertificateResponse",
)({}) {}
export class DeleteCertificateRequest extends S.Class<DeleteCertificateRequest>(
  "DeleteCertificateRequest",
)(
  {
    certificateId: S.String.pipe(T.HttpLabel()),
    forceDelete: S.optional(S.Boolean).pipe(T.HttpQuery("forceDelete")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/certificates/{certificateId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCertificateResponse extends S.Class<DeleteCertificateResponse>(
  "DeleteCertificateResponse",
)({}) {}
export class DeleteCertificateProviderRequest extends S.Class<DeleteCertificateProviderRequest>(
  "DeleteCertificateProviderRequest",
)(
  { certificateProviderName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/certificate-providers/{certificateProviderName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCertificateProviderResponse extends S.Class<DeleteCertificateProviderResponse>(
  "DeleteCertificateProviderResponse",
)({}) {}
export class DeleteCommandRequest extends S.Class<DeleteCommandRequest>(
  "DeleteCommandRequest",
)(
  { commandId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/commands/{commandId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCommandExecutionRequest extends S.Class<DeleteCommandExecutionRequest>(
  "DeleteCommandExecutionRequest",
)(
  {
    executionId: S.String.pipe(T.HttpLabel()),
    targetArn: S.String.pipe(T.HttpQuery("targetArn")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/command-executions/{executionId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCommandExecutionResponse extends S.Class<DeleteCommandExecutionResponse>(
  "DeleteCommandExecutionResponse",
)({}) {}
export class DeleteCustomMetricRequest extends S.Class<DeleteCustomMetricRequest>(
  "DeleteCustomMetricRequest",
)(
  { metricName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/custom-metric/{metricName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCustomMetricResponse extends S.Class<DeleteCustomMetricResponse>(
  "DeleteCustomMetricResponse",
)({}) {}
export class DeleteDimensionRequest extends S.Class<DeleteDimensionRequest>(
  "DeleteDimensionRequest",
)(
  { name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/dimensions/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDimensionResponse extends S.Class<DeleteDimensionResponse>(
  "DeleteDimensionResponse",
)({}) {}
export class DeleteDomainConfigurationRequest extends S.Class<DeleteDomainConfigurationRequest>(
  "DeleteDomainConfigurationRequest",
)(
  { domainConfigurationName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/domainConfigurations/{domainConfigurationName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDomainConfigurationResponse extends S.Class<DeleteDomainConfigurationResponse>(
  "DeleteDomainConfigurationResponse",
)({}) {}
export class DeleteDynamicThingGroupRequest extends S.Class<DeleteDynamicThingGroupRequest>(
  "DeleteDynamicThingGroupRequest",
)(
  {
    thingGroupName: S.String.pipe(T.HttpLabel()),
    expectedVersion: S.optional(S.Number).pipe(T.HttpQuery("expectedVersion")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/dynamic-thing-groups/{thingGroupName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDynamicThingGroupResponse extends S.Class<DeleteDynamicThingGroupResponse>(
  "DeleteDynamicThingGroupResponse",
)({}) {}
export class DeleteFleetMetricRequest extends S.Class<DeleteFleetMetricRequest>(
  "DeleteFleetMetricRequest",
)(
  {
    metricName: S.String.pipe(T.HttpLabel()),
    expectedVersion: S.optional(S.Number).pipe(T.HttpQuery("expectedVersion")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/fleet-metric/{metricName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFleetMetricResponse extends S.Class<DeleteFleetMetricResponse>(
  "DeleteFleetMetricResponse",
)({}) {}
export class DeleteJobRequest extends S.Class<DeleteJobRequest>(
  "DeleteJobRequest",
)(
  {
    jobId: S.String.pipe(T.HttpLabel()),
    force: S.optional(S.Boolean).pipe(T.HttpQuery("force")),
    namespaceId: S.optional(S.String).pipe(T.HttpQuery("namespaceId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/jobs/{jobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteJobResponse extends S.Class<DeleteJobResponse>(
  "DeleteJobResponse",
)({}) {}
export class DeleteJobExecutionRequest extends S.Class<DeleteJobExecutionRequest>(
  "DeleteJobExecutionRequest",
)(
  {
    jobId: S.String.pipe(T.HttpLabel()),
    thingName: S.String.pipe(T.HttpLabel()),
    executionNumber: S.Number.pipe(T.HttpLabel()),
    force: S.optional(S.Boolean).pipe(T.HttpQuery("force")),
    namespaceId: S.optional(S.String).pipe(T.HttpQuery("namespaceId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/things/{thingName}/jobs/{jobId}/executionNumber/{executionNumber}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteJobExecutionResponse extends S.Class<DeleteJobExecutionResponse>(
  "DeleteJobExecutionResponse",
)({}) {}
export class DeleteJobTemplateRequest extends S.Class<DeleteJobTemplateRequest>(
  "DeleteJobTemplateRequest",
)(
  { jobTemplateId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/job-templates/{jobTemplateId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteJobTemplateResponse extends S.Class<DeleteJobTemplateResponse>(
  "DeleteJobTemplateResponse",
)({}) {}
export class DeleteMitigationActionRequest extends S.Class<DeleteMitigationActionRequest>(
  "DeleteMitigationActionRequest",
)(
  { actionName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/mitigationactions/actions/{actionName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMitigationActionResponse extends S.Class<DeleteMitigationActionResponse>(
  "DeleteMitigationActionResponse",
)({}) {}
export class DeleteOTAUpdateRequest extends S.Class<DeleteOTAUpdateRequest>(
  "DeleteOTAUpdateRequest",
)(
  {
    otaUpdateId: S.String.pipe(T.HttpLabel()),
    deleteStream: S.optional(S.Boolean).pipe(T.HttpQuery("deleteStream")),
    forceDeleteAWSJob: S.optional(S.Boolean).pipe(
      T.HttpQuery("forceDeleteAWSJob"),
    ),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/otaUpdates/{otaUpdateId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteOTAUpdateResponse extends S.Class<DeleteOTAUpdateResponse>(
  "DeleteOTAUpdateResponse",
)({}) {}
export class DeletePackageRequest extends S.Class<DeletePackageRequest>(
  "DeletePackageRequest",
)(
  {
    packageName: S.String.pipe(T.HttpLabel()),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/packages/{packageName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePackageResponse extends S.Class<DeletePackageResponse>(
  "DeletePackageResponse",
)({}) {}
export class DeletePackageVersionRequest extends S.Class<DeletePackageVersionRequest>(
  "DeletePackageVersionRequest",
)(
  {
    packageName: S.String.pipe(T.HttpLabel()),
    versionName: S.String.pipe(T.HttpLabel()),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/packages/{packageName}/versions/{versionName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePackageVersionResponse extends S.Class<DeletePackageVersionResponse>(
  "DeletePackageVersionResponse",
)({}) {}
export class DeletePolicyRequest extends S.Class<DeletePolicyRequest>(
  "DeletePolicyRequest",
)(
  { policyName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/policies/{policyName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePolicyResponse extends S.Class<DeletePolicyResponse>(
  "DeletePolicyResponse",
)({}) {}
export class DeletePolicyVersionRequest extends S.Class<DeletePolicyVersionRequest>(
  "DeletePolicyVersionRequest",
)(
  {
    policyName: S.String.pipe(T.HttpLabel()),
    policyVersionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/policies/{policyName}/version/{policyVersionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePolicyVersionResponse extends S.Class<DeletePolicyVersionResponse>(
  "DeletePolicyVersionResponse",
)({}) {}
export class DeleteProvisioningTemplateRequest extends S.Class<DeleteProvisioningTemplateRequest>(
  "DeleteProvisioningTemplateRequest",
)(
  { templateName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/provisioning-templates/{templateName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProvisioningTemplateResponse extends S.Class<DeleteProvisioningTemplateResponse>(
  "DeleteProvisioningTemplateResponse",
)({}) {}
export class DeleteProvisioningTemplateVersionRequest extends S.Class<DeleteProvisioningTemplateVersionRequest>(
  "DeleteProvisioningTemplateVersionRequest",
)(
  {
    templateName: S.String.pipe(T.HttpLabel()),
    versionId: S.Number.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/provisioning-templates/{templateName}/versions/{versionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProvisioningTemplateVersionResponse extends S.Class<DeleteProvisioningTemplateVersionResponse>(
  "DeleteProvisioningTemplateVersionResponse",
)({}) {}
export class DeleteRoleAliasRequest extends S.Class<DeleteRoleAliasRequest>(
  "DeleteRoleAliasRequest",
)(
  { roleAlias: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/role-aliases/{roleAlias}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRoleAliasResponse extends S.Class<DeleteRoleAliasResponse>(
  "DeleteRoleAliasResponse",
)({}) {}
export class DeleteScheduledAuditRequest extends S.Class<DeleteScheduledAuditRequest>(
  "DeleteScheduledAuditRequest",
)(
  { scheduledAuditName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/audit/scheduledaudits/{scheduledAuditName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteScheduledAuditResponse extends S.Class<DeleteScheduledAuditResponse>(
  "DeleteScheduledAuditResponse",
)({}) {}
export class DeleteSecurityProfileRequest extends S.Class<DeleteSecurityProfileRequest>(
  "DeleteSecurityProfileRequest",
)(
  {
    securityProfileName: S.String.pipe(T.HttpLabel()),
    expectedVersion: S.optional(S.Number).pipe(T.HttpQuery("expectedVersion")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/security-profiles/{securityProfileName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSecurityProfileResponse extends S.Class<DeleteSecurityProfileResponse>(
  "DeleteSecurityProfileResponse",
)({}) {}
export class DeleteStreamRequest extends S.Class<DeleteStreamRequest>(
  "DeleteStreamRequest",
)(
  { streamId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/streams/{streamId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteStreamResponse extends S.Class<DeleteStreamResponse>(
  "DeleteStreamResponse",
)({}) {}
export class DeleteThingRequest extends S.Class<DeleteThingRequest>(
  "DeleteThingRequest",
)(
  {
    thingName: S.String.pipe(T.HttpLabel()),
    expectedVersion: S.optional(S.Number).pipe(T.HttpQuery("expectedVersion")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/things/{thingName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteThingResponse extends S.Class<DeleteThingResponse>(
  "DeleteThingResponse",
)({}) {}
export class DeleteThingGroupRequest extends S.Class<DeleteThingGroupRequest>(
  "DeleteThingGroupRequest",
)(
  {
    thingGroupName: S.String.pipe(T.HttpLabel()),
    expectedVersion: S.optional(S.Number).pipe(T.HttpQuery("expectedVersion")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/thing-groups/{thingGroupName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteThingGroupResponse extends S.Class<DeleteThingGroupResponse>(
  "DeleteThingGroupResponse",
)({}) {}
export class DeleteThingTypeRequest extends S.Class<DeleteThingTypeRequest>(
  "DeleteThingTypeRequest",
)(
  { thingTypeName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/thing-types/{thingTypeName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteThingTypeResponse extends S.Class<DeleteThingTypeResponse>(
  "DeleteThingTypeResponse",
)({}) {}
export class DeleteTopicRuleRequest extends S.Class<DeleteTopicRuleRequest>(
  "DeleteTopicRuleRequest",
)(
  { ruleName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/rules/{ruleName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTopicRuleResponse extends S.Class<DeleteTopicRuleResponse>(
  "DeleteTopicRuleResponse",
)({}) {}
export class DeleteTopicRuleDestinationRequest extends S.Class<DeleteTopicRuleDestinationRequest>(
  "DeleteTopicRuleDestinationRequest",
)(
  { arn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/destinations/{arn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTopicRuleDestinationResponse extends S.Class<DeleteTopicRuleDestinationResponse>(
  "DeleteTopicRuleDestinationResponse",
)({}) {}
export class DeleteV2LoggingLevelRequest extends S.Class<DeleteV2LoggingLevelRequest>(
  "DeleteV2LoggingLevelRequest",
)(
  {
    targetType: S.String.pipe(T.HttpQuery("targetType")),
    targetName: S.String.pipe(T.HttpQuery("targetName")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v2LoggingLevel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteV2LoggingLevelResponse extends S.Class<DeleteV2LoggingLevelResponse>(
  "DeleteV2LoggingLevelResponse",
)({}) {}
export class DeprecateThingTypeRequest extends S.Class<DeprecateThingTypeRequest>(
  "DeprecateThingTypeRequest",
)(
  {
    thingTypeName: S.String.pipe(T.HttpLabel()),
    undoDeprecate: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/thing-types/{thingTypeName}/deprecate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeprecateThingTypeResponse extends S.Class<DeprecateThingTypeResponse>(
  "DeprecateThingTypeResponse",
)({}) {}
export class DescribeAuditFindingRequest extends S.Class<DescribeAuditFindingRequest>(
  "DescribeAuditFindingRequest",
)(
  { findingId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/audit/findings/{findingId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAuditMitigationActionsTaskRequest extends S.Class<DescribeAuditMitigationActionsTaskRequest>(
  "DescribeAuditMitigationActionsTaskRequest",
)(
  { taskId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/audit/mitigationactions/tasks/{taskId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAuditSuppressionRequest extends S.Class<DescribeAuditSuppressionRequest>(
  "DescribeAuditSuppressionRequest",
)(
  { checkName: S.String, resourceIdentifier: ResourceIdentifier },
  T.all(
    T.Http({ method: "POST", uri: "/audit/suppressions/describe" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAuditTaskRequest extends S.Class<DescribeAuditTaskRequest>(
  "DescribeAuditTaskRequest",
)(
  { taskId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/audit/tasks/{taskId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAuthorizerRequest extends S.Class<DescribeAuthorizerRequest>(
  "DescribeAuthorizerRequest",
)(
  { authorizerName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/authorizer/{authorizerName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeBillingGroupRequest extends S.Class<DescribeBillingGroupRequest>(
  "DescribeBillingGroupRequest",
)(
  { billingGroupName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/billing-groups/{billingGroupName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeCACertificateRequest extends S.Class<DescribeCACertificateRequest>(
  "DescribeCACertificateRequest",
)(
  { certificateId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/cacertificate/{certificateId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeCertificateRequest extends S.Class<DescribeCertificateRequest>(
  "DescribeCertificateRequest",
)(
  { certificateId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/certificates/{certificateId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeCertificateProviderRequest extends S.Class<DescribeCertificateProviderRequest>(
  "DescribeCertificateProviderRequest",
)(
  { certificateProviderName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/certificate-providers/{certificateProviderName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeCustomMetricRequest extends S.Class<DescribeCustomMetricRequest>(
  "DescribeCustomMetricRequest",
)(
  { metricName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/custom-metric/{metricName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDetectMitigationActionsTaskRequest extends S.Class<DescribeDetectMitigationActionsTaskRequest>(
  "DescribeDetectMitigationActionsTaskRequest",
)(
  { taskId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/detect/mitigationactions/tasks/{taskId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDimensionRequest extends S.Class<DescribeDimensionRequest>(
  "DescribeDimensionRequest",
)(
  { name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/dimensions/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDomainConfigurationRequest extends S.Class<DescribeDomainConfigurationRequest>(
  "DescribeDomainConfigurationRequest",
)(
  { domainConfigurationName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/domainConfigurations/{domainConfigurationName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeEndpointRequest extends S.Class<DescribeEndpointRequest>(
  "DescribeEndpointRequest",
)(
  { endpointType: S.optional(S.String).pipe(T.HttpQuery("endpointType")) },
  T.all(
    T.Http({ method: "GET", uri: "/endpoint" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeFleetMetricRequest extends S.Class<DescribeFleetMetricRequest>(
  "DescribeFleetMetricRequest",
)(
  { metricName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/fleet-metric/{metricName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeIndexRequest extends S.Class<DescribeIndexRequest>(
  "DescribeIndexRequest",
)(
  { indexName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/indices/{indexName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeJobRequest extends S.Class<DescribeJobRequest>(
  "DescribeJobRequest",
)(
  {
    jobId: S.String.pipe(T.HttpLabel()),
    beforeSubstitution: S.optional(S.Boolean).pipe(
      T.HttpQuery("beforeSubstitution"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/jobs/{jobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeJobExecutionRequest extends S.Class<DescribeJobExecutionRequest>(
  "DescribeJobExecutionRequest",
)(
  {
    jobId: S.String.pipe(T.HttpLabel()),
    thingName: S.String.pipe(T.HttpLabel()),
    executionNumber: S.optional(S.Number).pipe(T.HttpQuery("executionNumber")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/things/{thingName}/jobs/{jobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeJobTemplateRequest extends S.Class<DescribeJobTemplateRequest>(
  "DescribeJobTemplateRequest",
)(
  { jobTemplateId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/job-templates/{jobTemplateId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeManagedJobTemplateRequest extends S.Class<DescribeManagedJobTemplateRequest>(
  "DescribeManagedJobTemplateRequest",
)(
  {
    templateName: S.String.pipe(T.HttpLabel()),
    templateVersion: S.optional(S.String).pipe(T.HttpQuery("templateVersion")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/managed-job-templates/{templateName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeMitigationActionRequest extends S.Class<DescribeMitigationActionRequest>(
  "DescribeMitigationActionRequest",
)(
  { actionName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/mitigationactions/actions/{actionName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeProvisioningTemplateRequest extends S.Class<DescribeProvisioningTemplateRequest>(
  "DescribeProvisioningTemplateRequest",
)(
  { templateName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/provisioning-templates/{templateName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeProvisioningTemplateVersionRequest extends S.Class<DescribeProvisioningTemplateVersionRequest>(
  "DescribeProvisioningTemplateVersionRequest",
)(
  {
    templateName: S.String.pipe(T.HttpLabel()),
    versionId: S.Number.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/provisioning-templates/{templateName}/versions/{versionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeRoleAliasRequest extends S.Class<DescribeRoleAliasRequest>(
  "DescribeRoleAliasRequest",
)(
  { roleAlias: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/role-aliases/{roleAlias}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeScheduledAuditRequest extends S.Class<DescribeScheduledAuditRequest>(
  "DescribeScheduledAuditRequest",
)(
  { scheduledAuditName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/audit/scheduledaudits/{scheduledAuditName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeSecurityProfileRequest extends S.Class<DescribeSecurityProfileRequest>(
  "DescribeSecurityProfileRequest",
)(
  { securityProfileName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/security-profiles/{securityProfileName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeStreamRequest extends S.Class<DescribeStreamRequest>(
  "DescribeStreamRequest",
)(
  { streamId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/streams/{streamId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeThingRequest extends S.Class<DescribeThingRequest>(
  "DescribeThingRequest",
)(
  { thingName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/things/{thingName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeThingGroupRequest extends S.Class<DescribeThingGroupRequest>(
  "DescribeThingGroupRequest",
)(
  { thingGroupName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/thing-groups/{thingGroupName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeThingRegistrationTaskRequest extends S.Class<DescribeThingRegistrationTaskRequest>(
  "DescribeThingRegistrationTaskRequest",
)(
  { taskId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/thing-registration-tasks/{taskId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeThingTypeRequest extends S.Class<DescribeThingTypeRequest>(
  "DescribeThingTypeRequest",
)(
  { thingTypeName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/thing-types/{thingTypeName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DetachPolicyRequest extends S.Class<DetachPolicyRequest>(
  "DetachPolicyRequest",
)(
  { policyName: S.String.pipe(T.HttpLabel()), target: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/target-policies/{policyName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DetachPolicyResponse extends S.Class<DetachPolicyResponse>(
  "DetachPolicyResponse",
)({}) {}
export class DetachPrincipalPolicyRequest extends S.Class<DetachPrincipalPolicyRequest>(
  "DetachPrincipalPolicyRequest",
)(
  {
    policyName: S.String.pipe(T.HttpLabel()),
    principal: S.String.pipe(T.HttpHeader("x-amzn-iot-principal")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/principal-policies/{policyName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DetachPrincipalPolicyResponse extends S.Class<DetachPrincipalPolicyResponse>(
  "DetachPrincipalPolicyResponse",
)({}) {}
export class DetachSecurityProfileRequest extends S.Class<DetachSecurityProfileRequest>(
  "DetachSecurityProfileRequest",
)(
  {
    securityProfileName: S.String.pipe(T.HttpLabel()),
    securityProfileTargetArn: S.String.pipe(
      T.HttpQuery("securityProfileTargetArn"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/security-profiles/{securityProfileName}/targets",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DetachSecurityProfileResponse extends S.Class<DetachSecurityProfileResponse>(
  "DetachSecurityProfileResponse",
)({}) {}
export class DetachThingPrincipalRequest extends S.Class<DetachThingPrincipalRequest>(
  "DetachThingPrincipalRequest",
)(
  {
    thingName: S.String.pipe(T.HttpLabel()),
    principal: S.String.pipe(T.HttpHeader("x-amzn-principal")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/things/{thingName}/principals" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DetachThingPrincipalResponse extends S.Class<DetachThingPrincipalResponse>(
  "DetachThingPrincipalResponse",
)({}) {}
export class DisableTopicRuleRequest extends S.Class<DisableTopicRuleRequest>(
  "DisableTopicRuleRequest",
)(
  { ruleName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "POST", uri: "/rules/{ruleName}/disable" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisableTopicRuleResponse extends S.Class<DisableTopicRuleResponse>(
  "DisableTopicRuleResponse",
)({}) {}
export class DisassociateSbomFromPackageVersionRequest extends S.Class<DisassociateSbomFromPackageVersionRequest>(
  "DisassociateSbomFromPackageVersionRequest",
)(
  {
    packageName: S.String.pipe(T.HttpLabel()),
    versionName: S.String.pipe(T.HttpLabel()),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/packages/{packageName}/versions/{versionName}/sbom",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateSbomFromPackageVersionResponse extends S.Class<DisassociateSbomFromPackageVersionResponse>(
  "DisassociateSbomFromPackageVersionResponse",
)({}) {}
export class EnableTopicRuleRequest extends S.Class<EnableTopicRuleRequest>(
  "EnableTopicRuleRequest",
)(
  { ruleName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "POST", uri: "/rules/{ruleName}/enable" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EnableTopicRuleResponse extends S.Class<EnableTopicRuleResponse>(
  "EnableTopicRuleResponse",
)({}) {}
export class GetBehaviorModelTrainingSummariesRequest extends S.Class<GetBehaviorModelTrainingSummariesRequest>(
  "GetBehaviorModelTrainingSummariesRequest",
)(
  {
    securityProfileName: S.optional(S.String).pipe(
      T.HttpQuery("securityProfileName"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/behavior-model-training/summaries" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCardinalityRequest extends S.Class<GetCardinalityRequest>(
  "GetCardinalityRequest",
)(
  {
    indexName: S.optional(S.String),
    queryString: S.String,
    aggregationField: S.optional(S.String),
    queryVersion: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/indices/cardinality" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCommandRequest extends S.Class<GetCommandRequest>(
  "GetCommandRequest",
)(
  { commandId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/commands/{commandId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCommandExecutionRequest extends S.Class<GetCommandExecutionRequest>(
  "GetCommandExecutionRequest",
)(
  {
    executionId: S.String.pipe(T.HttpLabel()),
    targetArn: S.String.pipe(T.HttpQuery("targetArn")),
    includeResult: S.optional(S.Boolean).pipe(T.HttpQuery("includeResult")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/command-executions/{executionId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEffectivePoliciesRequest extends S.Class<GetEffectivePoliciesRequest>(
  "GetEffectivePoliciesRequest",
)(
  {
    principal: S.optional(S.String),
    cognitoIdentityPoolId: S.optional(S.String),
    thingName: S.optional(S.String).pipe(T.HttpQuery("thingName")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/effective-policies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetJobDocumentRequest extends S.Class<GetJobDocumentRequest>(
  "GetJobDocumentRequest",
)(
  {
    jobId: S.String.pipe(T.HttpLabel()),
    beforeSubstitution: S.optional(S.Boolean).pipe(
      T.HttpQuery("beforeSubstitution"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/jobs/{jobId}/job-document" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLoggingOptionsResponse extends S.Class<GetLoggingOptionsResponse>(
  "GetLoggingOptionsResponse",
)({ roleArn: S.optional(S.String), logLevel: S.optional(S.String) }) {}
export class GetOTAUpdateRequest extends S.Class<GetOTAUpdateRequest>(
  "GetOTAUpdateRequest",
)(
  { otaUpdateId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/otaUpdates/{otaUpdateId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPackageRequest extends S.Class<GetPackageRequest>(
  "GetPackageRequest",
)(
  { packageName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/packages/{packageName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPackageVersionRequest extends S.Class<GetPackageVersionRequest>(
  "GetPackageVersionRequest",
)(
  {
    packageName: S.String.pipe(T.HttpLabel()),
    versionName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/packages/{packageName}/versions/{versionName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPercentilesRequest extends S.Class<GetPercentilesRequest>(
  "GetPercentilesRequest",
)(
  {
    indexName: S.optional(S.String),
    queryString: S.String,
    aggregationField: S.optional(S.String),
    queryVersion: S.optional(S.String),
    percents: S.optional(PercentList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/indices/percentiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPolicyRequest extends S.Class<GetPolicyRequest>(
  "GetPolicyRequest",
)(
  { policyName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/policies/{policyName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPolicyVersionRequest extends S.Class<GetPolicyVersionRequest>(
  "GetPolicyVersionRequest",
)(
  {
    policyName: S.String.pipe(T.HttpLabel()),
    policyVersionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/policies/{policyName}/version/{policyVersionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRegistrationCodeResponse extends S.Class<GetRegistrationCodeResponse>(
  "GetRegistrationCodeResponse",
)({ registrationCode: S.optional(S.String) }) {}
export class GetStatisticsRequest extends S.Class<GetStatisticsRequest>(
  "GetStatisticsRequest",
)(
  {
    indexName: S.optional(S.String),
    queryString: S.String,
    aggregationField: S.optional(S.String),
    queryVersion: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/indices/statistics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetThingConnectivityDataRequest extends S.Class<GetThingConnectivityDataRequest>(
  "GetThingConnectivityDataRequest",
)(
  { thingName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "POST", uri: "/things/{thingName}/connectivity-data" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTopicRuleRequest extends S.Class<GetTopicRuleRequest>(
  "GetTopicRuleRequest",
)(
  { ruleName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/rules/{ruleName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTopicRuleDestinationRequest extends S.Class<GetTopicRuleDestinationRequest>(
  "GetTopicRuleDestinationRequest",
)(
  { arn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/destinations/{arn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetV2LoggingOptionsRequest extends S.Class<GetV2LoggingOptionsRequest>(
  "GetV2LoggingOptionsRequest",
)(
  { verbose: S.optional(S.Boolean).pipe(T.HttpQuery("verbose")) },
  T.all(
    T.Http({ method: "GET", uri: "/v2LoggingOptions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListActiveViolationsRequest extends S.Class<ListActiveViolationsRequest>(
  "ListActiveViolationsRequest",
)(
  {
    thingName: S.optional(S.String).pipe(T.HttpQuery("thingName")),
    securityProfileName: S.optional(S.String).pipe(
      T.HttpQuery("securityProfileName"),
    ),
    behaviorCriteriaType: S.optional(S.String).pipe(
      T.HttpQuery("behaviorCriteriaType"),
    ),
    listSuppressedAlerts: S.optional(S.Boolean).pipe(
      T.HttpQuery("listSuppressedAlerts"),
    ),
    verificationState: S.optional(S.String).pipe(
      T.HttpQuery("verificationState"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/active-violations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAttachedPoliciesRequest extends S.Class<ListAttachedPoliciesRequest>(
  "ListAttachedPoliciesRequest",
)(
  {
    target: S.String.pipe(T.HttpLabel()),
    recursive: S.optional(S.Boolean).pipe(T.HttpQuery("recursive")),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/attached-policies/{target}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAuditFindingsRequest extends S.Class<ListAuditFindingsRequest>(
  "ListAuditFindingsRequest",
)(
  {
    taskId: S.optional(S.String),
    checkName: S.optional(S.String),
    resourceIdentifier: S.optional(ResourceIdentifier),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    listSuppressedFindings: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/audit/findings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAuditMitigationActionsExecutionsRequest extends S.Class<ListAuditMitigationActionsExecutionsRequest>(
  "ListAuditMitigationActionsExecutionsRequest",
)(
  {
    taskId: S.String.pipe(T.HttpQuery("taskId")),
    actionStatus: S.optional(S.String).pipe(T.HttpQuery("actionStatus")),
    findingId: S.String.pipe(T.HttpQuery("findingId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/audit/mitigationactions/executions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAuditMitigationActionsTasksRequest extends S.Class<ListAuditMitigationActionsTasksRequest>(
  "ListAuditMitigationActionsTasksRequest",
)(
  {
    auditTaskId: S.optional(S.String).pipe(T.HttpQuery("auditTaskId")),
    findingId: S.optional(S.String).pipe(T.HttpQuery("findingId")),
    taskStatus: S.optional(S.String).pipe(T.HttpQuery("taskStatus")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("endTime"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/audit/mitigationactions/tasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAuditSuppressionsRequest extends S.Class<ListAuditSuppressionsRequest>(
  "ListAuditSuppressionsRequest",
)(
  {
    checkName: S.optional(S.String),
    resourceIdentifier: S.optional(ResourceIdentifier),
    ascendingOrder: S.optional(S.Boolean),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/audit/suppressions/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAuditTasksRequest extends S.Class<ListAuditTasksRequest>(
  "ListAuditTasksRequest",
)(
  {
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("endTime"),
    ),
    taskType: S.optional(S.String).pipe(T.HttpQuery("taskType")),
    taskStatus: S.optional(S.String).pipe(T.HttpQuery("taskStatus")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/audit/tasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAuthorizersRequest extends S.Class<ListAuthorizersRequest>(
  "ListAuthorizersRequest",
)(
  {
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    ascendingOrder: S.optional(S.Boolean).pipe(T.HttpQuery("isAscendingOrder")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/authorizers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBillingGroupsRequest extends S.Class<ListBillingGroupsRequest>(
  "ListBillingGroupsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    namePrefixFilter: S.optional(S.String).pipe(
      T.HttpQuery("namePrefixFilter"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/billing-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCACertificatesRequest extends S.Class<ListCACertificatesRequest>(
  "ListCACertificatesRequest",
)(
  {
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    ascendingOrder: S.optional(S.Boolean).pipe(T.HttpQuery("isAscendingOrder")),
    templateName: S.optional(S.String).pipe(T.HttpQuery("templateName")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/cacertificates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCertificateProvidersRequest extends S.Class<ListCertificateProvidersRequest>(
  "ListCertificateProvidersRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    ascendingOrder: S.optional(S.Boolean).pipe(T.HttpQuery("isAscendingOrder")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/certificate-providers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCertificatesRequest extends S.Class<ListCertificatesRequest>(
  "ListCertificatesRequest",
)(
  {
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    ascendingOrder: S.optional(S.Boolean).pipe(T.HttpQuery("isAscendingOrder")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/certificates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCertificatesByCARequest extends S.Class<ListCertificatesByCARequest>(
  "ListCertificatesByCARequest",
)(
  {
    caCertificateId: S.String.pipe(T.HttpLabel()),
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    ascendingOrder: S.optional(S.Boolean).pipe(T.HttpQuery("isAscendingOrder")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/certificates-by-ca/{caCertificateId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCommandsRequest extends S.Class<ListCommandsRequest>(
  "ListCommandsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    commandParameterName: S.optional(S.String).pipe(
      T.HttpQuery("commandParameterName"),
    ),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/commands" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCustomMetricsRequest extends S.Class<ListCustomMetricsRequest>(
  "ListCustomMetricsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/custom-metrics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDetectMitigationActionsExecutionsRequest extends S.Class<ListDetectMitigationActionsExecutionsRequest>(
  "ListDetectMitigationActionsExecutionsRequest",
)(
  {
    taskId: S.optional(S.String).pipe(T.HttpQuery("taskId")),
    violationId: S.optional(S.String).pipe(T.HttpQuery("violationId")),
    thingName: S.optional(S.String).pipe(T.HttpQuery("thingName")),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("endTime"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/detect/mitigationactions/executions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDetectMitigationActionsTasksRequest extends S.Class<ListDetectMitigationActionsTasksRequest>(
  "ListDetectMitigationActionsTasksRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("endTime"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/detect/mitigationactions/tasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDimensionsRequest extends S.Class<ListDimensionsRequest>(
  "ListDimensionsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/dimensions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDomainConfigurationsRequest extends S.Class<ListDomainConfigurationsRequest>(
  "ListDomainConfigurationsRequest",
)(
  {
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
    serviceType: S.optional(S.String).pipe(T.HttpQuery("serviceType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/domainConfigurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFleetMetricsRequest extends S.Class<ListFleetMetricsRequest>(
  "ListFleetMetricsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/fleet-metrics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIndicesRequest extends S.Class<ListIndicesRequest>(
  "ListIndicesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/indices" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListJobExecutionsForJobRequest extends S.Class<ListJobExecutionsForJobRequest>(
  "ListJobExecutionsForJobRequest",
)(
  {
    jobId: S.String.pipe(T.HttpLabel()),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/jobs/{jobId}/things" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListJobExecutionsForThingRequest extends S.Class<ListJobExecutionsForThingRequest>(
  "ListJobExecutionsForThingRequest",
)(
  {
    thingName: S.String.pipe(T.HttpLabel()),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    namespaceId: S.optional(S.String).pipe(T.HttpQuery("namespaceId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    jobId: S.optional(S.String).pipe(T.HttpQuery("jobId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/things/{thingName}/jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListJobsRequest extends S.Class<ListJobsRequest>(
  "ListJobsRequest",
)(
  {
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    targetSelection: S.optional(S.String).pipe(T.HttpQuery("targetSelection")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    thingGroupName: S.optional(S.String).pipe(T.HttpQuery("thingGroupName")),
    thingGroupId: S.optional(S.String).pipe(T.HttpQuery("thingGroupId")),
    namespaceId: S.optional(S.String).pipe(T.HttpQuery("namespaceId")),
  },
  T.all(T.Http({ method: "GET", uri: "/jobs" }), svc, auth, proto, ver, rules),
) {}
export class ListJobTemplatesRequest extends S.Class<ListJobTemplatesRequest>(
  "ListJobTemplatesRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/job-templates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListManagedJobTemplatesRequest extends S.Class<ListManagedJobTemplatesRequest>(
  "ListManagedJobTemplatesRequest",
)(
  {
    templateName: S.optional(S.String).pipe(T.HttpQuery("templateName")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/managed-job-templates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMetricValuesRequest extends S.Class<ListMetricValuesRequest>(
  "ListMetricValuesRequest",
)(
  {
    thingName: S.String.pipe(T.HttpQuery("thingName")),
    metricName: S.String.pipe(T.HttpQuery("metricName")),
    dimensionName: S.optional(S.String).pipe(T.HttpQuery("dimensionName")),
    dimensionValueOperator: S.optional(S.String).pipe(
      T.HttpQuery("dimensionValueOperator"),
    ),
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("endTime"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/metric-values" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMitigationActionsRequest extends S.Class<ListMitigationActionsRequest>(
  "ListMitigationActionsRequest",
)(
  {
    actionType: S.optional(S.String).pipe(T.HttpQuery("actionType")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/mitigationactions/actions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOTAUpdatesRequest extends S.Class<ListOTAUpdatesRequest>(
  "ListOTAUpdatesRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    otaUpdateStatus: S.optional(S.String).pipe(T.HttpQuery("otaUpdateStatus")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/otaUpdates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOutgoingCertificatesRequest extends S.Class<ListOutgoingCertificatesRequest>(
  "ListOutgoingCertificatesRequest",
)(
  {
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    ascendingOrder: S.optional(S.Boolean).pipe(T.HttpQuery("isAscendingOrder")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/certificates-out-going" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPackagesRequest extends S.Class<ListPackagesRequest>(
  "ListPackagesRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/packages" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPackageVersionsRequest extends S.Class<ListPackageVersionsRequest>(
  "ListPackageVersionsRequest",
)(
  {
    packageName: S.String.pipe(T.HttpLabel()),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/packages/{packageName}/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPoliciesRequest extends S.Class<ListPoliciesRequest>(
  "ListPoliciesRequest",
)(
  {
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
    ascendingOrder: S.optional(S.Boolean).pipe(T.HttpQuery("isAscendingOrder")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/policies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPolicyPrincipalsRequest extends S.Class<ListPolicyPrincipalsRequest>(
  "ListPolicyPrincipalsRequest",
)(
  {
    policyName: S.String.pipe(T.HttpHeader("x-amzn-iot-policy")),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
    ascendingOrder: S.optional(S.Boolean).pipe(T.HttpQuery("isAscendingOrder")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/policy-principals" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPolicyVersionsRequest extends S.Class<ListPolicyVersionsRequest>(
  "ListPolicyVersionsRequest",
)(
  { policyName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/policies/{policyName}/version" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPrincipalPoliciesRequest extends S.Class<ListPrincipalPoliciesRequest>(
  "ListPrincipalPoliciesRequest",
)(
  {
    principal: S.String.pipe(T.HttpHeader("x-amzn-iot-principal")),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
    ascendingOrder: S.optional(S.Boolean).pipe(T.HttpQuery("isAscendingOrder")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/principal-policies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPrincipalThingsRequest extends S.Class<ListPrincipalThingsRequest>(
  "ListPrincipalThingsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    principal: S.String.pipe(T.HttpHeader("x-amzn-principal")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/principals/things" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPrincipalThingsV2Request extends S.Class<ListPrincipalThingsV2Request>(
  "ListPrincipalThingsV2Request",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    principal: S.String.pipe(T.HttpHeader("x-amzn-principal")),
    thingPrincipalType: S.optional(S.String).pipe(
      T.HttpQuery("thingPrincipalType"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/principals/things-v2" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProvisioningTemplatesRequest extends S.Class<ListProvisioningTemplatesRequest>(
  "ListProvisioningTemplatesRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/provisioning-templates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProvisioningTemplateVersionsRequest extends S.Class<ListProvisioningTemplateVersionsRequest>(
  "ListProvisioningTemplateVersionsRequest",
)(
  {
    templateName: S.String.pipe(T.HttpLabel()),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/provisioning-templates/{templateName}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRelatedResourcesForAuditFindingRequest extends S.Class<ListRelatedResourcesForAuditFindingRequest>(
  "ListRelatedResourcesForAuditFindingRequest",
)(
  {
    findingId: S.String.pipe(T.HttpQuery("findingId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/audit/relatedResources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRoleAliasesRequest extends S.Class<ListRoleAliasesRequest>(
  "ListRoleAliasesRequest",
)(
  {
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    ascendingOrder: S.optional(S.Boolean).pipe(T.HttpQuery("isAscendingOrder")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/role-aliases" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSbomValidationResultsRequest extends S.Class<ListSbomValidationResultsRequest>(
  "ListSbomValidationResultsRequest",
)(
  {
    packageName: S.String.pipe(T.HttpLabel()),
    versionName: S.String.pipe(T.HttpLabel()),
    validationResult: S.optional(S.String).pipe(
      T.HttpQuery("validationResult"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/packages/{packageName}/versions/{versionName}/sbom-validation-results",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListScheduledAuditsRequest extends S.Class<ListScheduledAuditsRequest>(
  "ListScheduledAuditsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/audit/scheduledaudits" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSecurityProfilesRequest extends S.Class<ListSecurityProfilesRequest>(
  "ListSecurityProfilesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    dimensionName: S.optional(S.String).pipe(T.HttpQuery("dimensionName")),
    metricName: S.optional(S.String).pipe(T.HttpQuery("metricName")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/security-profiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSecurityProfilesForTargetRequest extends S.Class<ListSecurityProfilesForTargetRequest>(
  "ListSecurityProfilesForTargetRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    recursive: S.optional(S.Boolean).pipe(T.HttpQuery("recursive")),
    securityProfileTargetArn: S.String.pipe(
      T.HttpQuery("securityProfileTargetArn"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/security-profiles-for-target" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListStreamsRequest extends S.Class<ListStreamsRequest>(
  "ListStreamsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    ascendingOrder: S.optional(S.Boolean).pipe(T.HttpQuery("isAscendingOrder")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/streams" }),
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
  {
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(T.Http({ method: "GET", uri: "/tags" }), svc, auth, proto, ver, rules),
) {}
export class ListTargetsForPolicyRequest extends S.Class<ListTargetsForPolicyRequest>(
  "ListTargetsForPolicyRequest",
)(
  {
    policyName: S.String.pipe(T.HttpLabel()),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/policy-targets/{policyName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTargetsForSecurityProfileRequest extends S.Class<ListTargetsForSecurityProfileRequest>(
  "ListTargetsForSecurityProfileRequest",
)(
  {
    securityProfileName: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/security-profiles/{securityProfileName}/targets",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListThingGroupsRequest extends S.Class<ListThingGroupsRequest>(
  "ListThingGroupsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    parentGroup: S.optional(S.String).pipe(T.HttpQuery("parentGroup")),
    namePrefixFilter: S.optional(S.String).pipe(
      T.HttpQuery("namePrefixFilter"),
    ),
    recursive: S.optional(S.Boolean).pipe(T.HttpQuery("recursive")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/thing-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListThingGroupsForThingRequest extends S.Class<ListThingGroupsForThingRequest>(
  "ListThingGroupsForThingRequest",
)(
  {
    thingName: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/things/{thingName}/thing-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListThingPrincipalsRequest extends S.Class<ListThingPrincipalsRequest>(
  "ListThingPrincipalsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    thingName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/things/{thingName}/principals" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListThingPrincipalsV2Request extends S.Class<ListThingPrincipalsV2Request>(
  "ListThingPrincipalsV2Request",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    thingName: S.String.pipe(T.HttpLabel()),
    thingPrincipalType: S.optional(S.String).pipe(
      T.HttpQuery("thingPrincipalType"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/things/{thingName}/principals-v2" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListThingRegistrationTaskReportsRequest extends S.Class<ListThingRegistrationTaskReportsRequest>(
  "ListThingRegistrationTaskReportsRequest",
)(
  {
    taskId: S.String.pipe(T.HttpLabel()),
    reportType: S.String.pipe(T.HttpQuery("reportType")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/thing-registration-tasks/{taskId}/reports",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListThingRegistrationTasksRequest extends S.Class<ListThingRegistrationTasksRequest>(
  "ListThingRegistrationTasksRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/thing-registration-tasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListThingsRequest extends S.Class<ListThingsRequest>(
  "ListThingsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    attributeName: S.optional(S.String).pipe(T.HttpQuery("attributeName")),
    attributeValue: S.optional(S.String).pipe(T.HttpQuery("attributeValue")),
    thingTypeName: S.optional(S.String).pipe(T.HttpQuery("thingTypeName")),
    usePrefixAttributeValue: S.optional(S.Boolean).pipe(
      T.HttpQuery("usePrefixAttributeValue"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/things" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListThingsInBillingGroupRequest extends S.Class<ListThingsInBillingGroupRequest>(
  "ListThingsInBillingGroupRequest",
)(
  {
    billingGroupName: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/billing-groups/{billingGroupName}/things" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListThingsInThingGroupRequest extends S.Class<ListThingsInThingGroupRequest>(
  "ListThingsInThingGroupRequest",
)(
  {
    thingGroupName: S.String.pipe(T.HttpLabel()),
    recursive: S.optional(S.Boolean).pipe(T.HttpQuery("recursive")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/thing-groups/{thingGroupName}/things" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListThingTypesRequest extends S.Class<ListThingTypesRequest>(
  "ListThingTypesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    thingTypeName: S.optional(S.String).pipe(T.HttpQuery("thingTypeName")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/thing-types" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTopicRuleDestinationsRequest extends S.Class<ListTopicRuleDestinationsRequest>(
  "ListTopicRuleDestinationsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/destinations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTopicRulesRequest extends S.Class<ListTopicRulesRequest>(
  "ListTopicRulesRequest",
)(
  {
    topic: S.optional(S.String).pipe(T.HttpQuery("topic")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    ruleDisabled: S.optional(S.Boolean).pipe(T.HttpQuery("ruleDisabled")),
  },
  T.all(T.Http({ method: "GET", uri: "/rules" }), svc, auth, proto, ver, rules),
) {}
export class ListV2LoggingLevelsRequest extends S.Class<ListV2LoggingLevelsRequest>(
  "ListV2LoggingLevelsRequest",
)(
  {
    targetType: S.optional(S.String).pipe(T.HttpQuery("targetType")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v2LoggingLevel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListViolationEventsRequest extends S.Class<ListViolationEventsRequest>(
  "ListViolationEventsRequest",
)(
  {
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("endTime"),
    ),
    thingName: S.optional(S.String).pipe(T.HttpQuery("thingName")),
    securityProfileName: S.optional(S.String).pipe(
      T.HttpQuery("securityProfileName"),
    ),
    behaviorCriteriaType: S.optional(S.String).pipe(
      T.HttpQuery("behaviorCriteriaType"),
    ),
    listSuppressedAlerts: S.optional(S.Boolean).pipe(
      T.HttpQuery("listSuppressedAlerts"),
    ),
    verificationState: S.optional(S.String).pipe(
      T.HttpQuery("verificationState"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/violation-events" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutVerificationStateOnViolationRequest extends S.Class<PutVerificationStateOnViolationRequest>(
  "PutVerificationStateOnViolationRequest",
)(
  {
    violationId: S.String.pipe(T.HttpLabel()),
    verificationState: S.String,
    verificationStateDescription: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/violations/verification-state/{violationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutVerificationStateOnViolationResponse extends S.Class<PutVerificationStateOnViolationResponse>(
  "PutVerificationStateOnViolationResponse",
)({}) {}
export class RegisterCertificateRequest extends S.Class<RegisterCertificateRequest>(
  "RegisterCertificateRequest",
)(
  {
    certificatePem: S.String,
    caCertificatePem: S.optional(S.String),
    setAsActive: S.optional(S.Boolean).pipe(T.HttpQuery("setAsActive")),
    status: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/certificate/register" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterCertificateWithoutCARequest extends S.Class<RegisterCertificateWithoutCARequest>(
  "RegisterCertificateWithoutCARequest",
)(
  { certificatePem: S.String, status: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/certificate/register-no-ca" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RejectCertificateTransferRequest extends S.Class<RejectCertificateTransferRequest>(
  "RejectCertificateTransferRequest",
)(
  {
    certificateId: S.String.pipe(T.HttpLabel()),
    rejectReason: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/reject-certificate-transfer/{certificateId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RejectCertificateTransferResponse extends S.Class<RejectCertificateTransferResponse>(
  "RejectCertificateTransferResponse",
)({}) {}
export class RemoveThingFromBillingGroupRequest extends S.Class<RemoveThingFromBillingGroupRequest>(
  "RemoveThingFromBillingGroupRequest",
)(
  {
    billingGroupName: S.optional(S.String),
    billingGroupArn: S.optional(S.String),
    thingName: S.optional(S.String),
    thingArn: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/billing-groups/removeThingFromBillingGroup",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveThingFromBillingGroupResponse extends S.Class<RemoveThingFromBillingGroupResponse>(
  "RemoveThingFromBillingGroupResponse",
)({}) {}
export class RemoveThingFromThingGroupRequest extends S.Class<RemoveThingFromThingGroupRequest>(
  "RemoveThingFromThingGroupRequest",
)(
  {
    thingGroupName: S.optional(S.String),
    thingGroupArn: S.optional(S.String),
    thingName: S.optional(S.String),
    thingArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/thing-groups/removeThingFromThingGroup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveThingFromThingGroupResponse extends S.Class<RemoveThingFromThingGroupResponse>(
  "RemoveThingFromThingGroupResponse",
)({}) {}
export class DynamoDBAction extends S.Class<DynamoDBAction>("DynamoDBAction")({
  tableName: S.String,
  roleArn: S.String,
  operation: S.optional(S.String),
  hashKeyField: S.String,
  hashKeyValue: S.String,
  hashKeyType: S.optional(S.String),
  rangeKeyField: S.optional(S.String),
  rangeKeyValue: S.optional(S.String),
  rangeKeyType: S.optional(S.String),
  payloadField: S.optional(S.String),
}) {}
export class PutItemInput extends S.Class<PutItemInput>("PutItemInput")({
  tableName: S.String,
}) {}
export class DynamoDBv2Action extends S.Class<DynamoDBv2Action>(
  "DynamoDBv2Action",
)({ roleArn: S.String, putItem: PutItemInput }) {}
export class LambdaAction extends S.Class<LambdaAction>("LambdaAction")({
  functionArn: S.String,
}) {}
export class SnsAction extends S.Class<SnsAction>("SnsAction")({
  targetArn: S.String,
  roleArn: S.String,
  messageFormat: S.optional(S.String),
}) {}
export class SqsAction extends S.Class<SqsAction>("SqsAction")({
  roleArn: S.String,
  queueUrl: S.String,
  useBase64: S.optional(S.Boolean),
}) {}
export class KinesisAction extends S.Class<KinesisAction>("KinesisAction")({
  roleArn: S.String,
  streamName: S.String,
  partitionKey: S.optional(S.String),
}) {}
export class UserProperty extends S.Class<UserProperty>("UserProperty")({
  key: S.String,
  value: S.String,
}) {}
export const UserProperties = S.Array(UserProperty);
export class MqttHeaders extends S.Class<MqttHeaders>("MqttHeaders")({
  payloadFormatIndicator: S.optional(S.String),
  contentType: S.optional(S.String),
  responseTopic: S.optional(S.String),
  correlationData: S.optional(S.String),
  messageExpiry: S.optional(S.String),
  userProperties: S.optional(UserProperties),
}) {}
export class RepublishAction extends S.Class<RepublishAction>(
  "RepublishAction",
)({
  roleArn: S.String,
  topic: S.String,
  qos: S.optional(S.Number),
  headers: S.optional(MqttHeaders),
}) {}
export class S3Action extends S.Class<S3Action>("S3Action")({
  roleArn: S.String,
  bucketName: S.String,
  key: S.String,
  cannedAcl: S.optional(S.String),
}) {}
export class FirehoseAction extends S.Class<FirehoseAction>("FirehoseAction")({
  roleArn: S.String,
  deliveryStreamName: S.String,
  separator: S.optional(S.String),
  batchMode: S.optional(S.Boolean),
}) {}
export class CloudwatchMetricAction extends S.Class<CloudwatchMetricAction>(
  "CloudwatchMetricAction",
)({
  roleArn: S.String,
  metricNamespace: S.String,
  metricName: S.String,
  metricValue: S.String,
  metricUnit: S.String,
  metricTimestamp: S.optional(S.String),
}) {}
export class CloudwatchAlarmAction extends S.Class<CloudwatchAlarmAction>(
  "CloudwatchAlarmAction",
)({
  roleArn: S.String,
  alarmName: S.String,
  stateReason: S.String,
  stateValue: S.String,
}) {}
export class CloudwatchLogsAction extends S.Class<CloudwatchLogsAction>(
  "CloudwatchLogsAction",
)({
  roleArn: S.String,
  logGroupName: S.String,
  batchMode: S.optional(S.Boolean),
}) {}
export class ElasticsearchAction extends S.Class<ElasticsearchAction>(
  "ElasticsearchAction",
)({
  roleArn: S.String,
  endpoint: S.String,
  index: S.String,
  type: S.String,
  id: S.String,
}) {}
export class SalesforceAction extends S.Class<SalesforceAction>(
  "SalesforceAction",
)({ token: S.String, url: S.String }) {}
export class IotAnalyticsAction extends S.Class<IotAnalyticsAction>(
  "IotAnalyticsAction",
)({
  channelArn: S.optional(S.String),
  channelName: S.optional(S.String),
  batchMode: S.optional(S.Boolean),
  roleArn: S.optional(S.String),
}) {}
export class IotEventsAction extends S.Class<IotEventsAction>(
  "IotEventsAction",
)({
  inputName: S.String,
  messageId: S.optional(S.String),
  batchMode: S.optional(S.Boolean),
  roleArn: S.String,
}) {}
export const AssetPropertyVariant = S.Union(
  S.Struct({ stringValue: S.String }),
  S.Struct({ integerValue: S.String }),
  S.Struct({ doubleValue: S.String }),
  S.Struct({ booleanValue: S.String }),
);
export class AssetPropertyTimestamp extends S.Class<AssetPropertyTimestamp>(
  "AssetPropertyTimestamp",
)({ timeInSeconds: S.String, offsetInNanos: S.optional(S.String) }) {}
export class AssetPropertyValue extends S.Class<AssetPropertyValue>(
  "AssetPropertyValue",
)({
  value: AssetPropertyVariant,
  timestamp: AssetPropertyTimestamp,
  quality: S.optional(S.String),
}) {}
export const AssetPropertyValueList = S.Array(AssetPropertyValue);
export class PutAssetPropertyValueEntry extends S.Class<PutAssetPropertyValueEntry>(
  "PutAssetPropertyValueEntry",
)({
  entryId: S.optional(S.String),
  assetId: S.optional(S.String),
  propertyId: S.optional(S.String),
  propertyAlias: S.optional(S.String),
  propertyValues: AssetPropertyValueList,
}) {}
export const PutAssetPropertyValueEntryList = S.Array(
  PutAssetPropertyValueEntry,
);
export class IotSiteWiseAction extends S.Class<IotSiteWiseAction>(
  "IotSiteWiseAction",
)({
  putAssetPropertyValueEntries: PutAssetPropertyValueEntryList,
  roleArn: S.String,
}) {}
export class StepFunctionsAction extends S.Class<StepFunctionsAction>(
  "StepFunctionsAction",
)({
  executionNamePrefix: S.optional(S.String),
  stateMachineName: S.String,
  roleArn: S.String,
}) {}
export class TimestreamDimension extends S.Class<TimestreamDimension>(
  "TimestreamDimension",
)({ name: S.String, value: S.String }) {}
export const TimestreamDimensionList = S.Array(TimestreamDimension);
export class TimestreamTimestamp extends S.Class<TimestreamTimestamp>(
  "TimestreamTimestamp",
)({ value: S.String, unit: S.String }) {}
export class TimestreamAction extends S.Class<TimestreamAction>(
  "TimestreamAction",
)({
  roleArn: S.String,
  databaseName: S.String,
  tableName: S.String,
  dimensions: TimestreamDimensionList,
  timestamp: S.optional(TimestreamTimestamp),
}) {}
export class HttpActionHeader extends S.Class<HttpActionHeader>(
  "HttpActionHeader",
)({ key: S.String, value: S.String }) {}
export const HeaderList = S.Array(HttpActionHeader);
export class SigV4Authorization extends S.Class<SigV4Authorization>(
  "SigV4Authorization",
)({ signingRegion: S.String, serviceName: S.String, roleArn: S.String }) {}
export class HttpAuthorization extends S.Class<HttpAuthorization>(
  "HttpAuthorization",
)({ sigv4: S.optional(SigV4Authorization) }) {}
export class BatchConfig extends S.Class<BatchConfig>("BatchConfig")({
  maxBatchOpenMs: S.optional(S.Number),
  maxBatchSize: S.optional(S.Number),
  maxBatchSizeBytes: S.optional(S.Number),
}) {}
export class HttpAction extends S.Class<HttpAction>("HttpAction")({
  url: S.String,
  confirmationUrl: S.optional(S.String),
  headers: S.optional(HeaderList),
  auth: S.optional(HttpAuthorization),
  enableBatching: S.optional(S.Boolean),
  batchConfig: S.optional(BatchConfig),
}) {}
export const ClientProperties = S.Record({ key: S.String, value: S.String });
export class KafkaActionHeader extends S.Class<KafkaActionHeader>(
  "KafkaActionHeader",
)({ key: S.String, value: S.String }) {}
export const KafkaHeaders = S.Array(KafkaActionHeader);
export class KafkaAction extends S.Class<KafkaAction>("KafkaAction")({
  destinationArn: S.String,
  topic: S.String,
  key: S.optional(S.String),
  partition: S.optional(S.String),
  clientProperties: ClientProperties,
  headers: S.optional(KafkaHeaders),
}) {}
export class OpenSearchAction extends S.Class<OpenSearchAction>(
  "OpenSearchAction",
)({
  roleArn: S.String,
  endpoint: S.String,
  index: S.String,
  type: S.String,
  id: S.String,
}) {}
export class LocationTimestamp extends S.Class<LocationTimestamp>(
  "LocationTimestamp",
)({ value: S.String, unit: S.optional(S.String) }) {}
export class LocationAction extends S.Class<LocationAction>("LocationAction")({
  roleArn: S.String,
  trackerName: S.String,
  deviceId: S.String,
  timestamp: S.optional(LocationTimestamp),
  latitude: S.String,
  longitude: S.String,
}) {}
export class Action extends S.Class<Action>("Action")({
  dynamoDB: S.optional(DynamoDBAction),
  dynamoDBv2: S.optional(DynamoDBv2Action),
  lambda: S.optional(LambdaAction),
  sns: S.optional(SnsAction),
  sqs: S.optional(SqsAction),
  kinesis: S.optional(KinesisAction),
  republish: S.optional(RepublishAction),
  s3: S.optional(S3Action),
  firehose: S.optional(FirehoseAction),
  cloudwatchMetric: S.optional(CloudwatchMetricAction),
  cloudwatchAlarm: S.optional(CloudwatchAlarmAction),
  cloudwatchLogs: S.optional(CloudwatchLogsAction),
  elasticsearch: S.optional(ElasticsearchAction),
  salesforce: S.optional(SalesforceAction),
  iotAnalytics: S.optional(IotAnalyticsAction),
  iotEvents: S.optional(IotEventsAction),
  iotSiteWise: S.optional(IotSiteWiseAction),
  stepFunctions: S.optional(StepFunctionsAction),
  timestream: S.optional(TimestreamAction),
  http: S.optional(HttpAction),
  kafka: S.optional(KafkaAction),
  openSearch: S.optional(OpenSearchAction),
  location: S.optional(LocationAction),
}) {}
export const ActionList = S.Array(Action);
export class TopicRulePayload extends S.Class<TopicRulePayload>(
  "TopicRulePayload",
)({
  sql: S.String,
  description: S.optional(S.String),
  actions: ActionList,
  ruleDisabled: S.optional(S.Boolean),
  awsIotSqlVersion: S.optional(S.String),
  errorAction: S.optional(Action),
}) {}
export class ReplaceTopicRuleRequest extends S.Class<ReplaceTopicRuleRequest>(
  "ReplaceTopicRuleRequest",
)(
  {
    ruleName: S.String.pipe(T.HttpLabel()),
    topicRulePayload: TopicRulePayload.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/rules/{ruleName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ReplaceTopicRuleResponse extends S.Class<ReplaceTopicRuleResponse>(
  "ReplaceTopicRuleResponse",
)({}) {}
export class SearchIndexRequest extends S.Class<SearchIndexRequest>(
  "SearchIndexRequest",
)(
  {
    indexName: S.optional(S.String),
    queryString: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    queryVersion: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/indices/search" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SetDefaultAuthorizerRequest extends S.Class<SetDefaultAuthorizerRequest>(
  "SetDefaultAuthorizerRequest",
)(
  { authorizerName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/default-authorizer" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SetDefaultPolicyVersionRequest extends S.Class<SetDefaultPolicyVersionRequest>(
  "SetDefaultPolicyVersionRequest",
)(
  {
    policyName: S.String.pipe(T.HttpLabel()),
    policyVersionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/policies/{policyName}/version/{policyVersionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SetDefaultPolicyVersionResponse extends S.Class<SetDefaultPolicyVersionResponse>(
  "SetDefaultPolicyVersionResponse",
)({}) {}
export class StartOnDemandAuditTaskRequest extends S.Class<StartOnDemandAuditTaskRequest>(
  "StartOnDemandAuditTaskRequest",
)(
  { targetCheckNames: TargetAuditCheckNames },
  T.all(
    T.Http({ method: "POST", uri: "/audit/tasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartThingRegistrationTaskRequest extends S.Class<StartThingRegistrationTaskRequest>(
  "StartThingRegistrationTaskRequest",
)(
  {
    templateBody: S.String,
    inputFileBucket: S.String,
    inputFileKey: S.String,
    roleArn: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/thing-registration-tasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopThingRegistrationTaskRequest extends S.Class<StopThingRegistrationTaskRequest>(
  "StopThingRegistrationTaskRequest",
)(
  { taskId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "PUT", uri: "/thing-registration-tasks/{taskId}/cancel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopThingRegistrationTaskResponse extends S.Class<StopThingRegistrationTaskResponse>(
  "StopThingRegistrationTaskResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String, tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/tags" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class TransferCertificateRequest extends S.Class<TransferCertificateRequest>(
  "TransferCertificateRequest",
)(
  {
    certificateId: S.String.pipe(T.HttpLabel()),
    targetAwsAccount: S.String.pipe(T.HttpQuery("targetAwsAccount")),
    transferMessage: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/transfer-certificate/{certificateId}" }),
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
    T.Http({ method: "POST", uri: "/untag" }),
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
export class AuditNotificationTarget extends S.Class<AuditNotificationTarget>(
  "AuditNotificationTarget",
)({
  targetArn: S.optional(S.String),
  roleArn: S.optional(S.String),
  enabled: S.optional(S.Boolean),
}) {}
export const AuditNotificationTargetConfigurations = S.Record({
  key: S.String,
  value: AuditNotificationTarget,
});
export const CheckCustomConfiguration = S.Record({
  key: S.String,
  value: S.String,
});
export class AuditCheckConfiguration extends S.Class<AuditCheckConfiguration>(
  "AuditCheckConfiguration",
)({
  enabled: S.optional(S.Boolean),
  configuration: S.optional(CheckCustomConfiguration),
}) {}
export const AuditCheckConfigurations = S.Record({
  key: S.String,
  value: AuditCheckConfiguration,
});
export class UpdateAccountAuditConfigurationRequest extends S.Class<UpdateAccountAuditConfigurationRequest>(
  "UpdateAccountAuditConfigurationRequest",
)(
  {
    roleArn: S.optional(S.String),
    auditNotificationTargetConfigurations: S.optional(
      AuditNotificationTargetConfigurations,
    ),
    auditCheckConfigurations: S.optional(AuditCheckConfigurations),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/audit/configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAccountAuditConfigurationResponse extends S.Class<UpdateAccountAuditConfigurationResponse>(
  "UpdateAccountAuditConfigurationResponse",
)({}) {}
export class UpdateAuditSuppressionRequest extends S.Class<UpdateAuditSuppressionRequest>(
  "UpdateAuditSuppressionRequest",
)(
  {
    checkName: S.String,
    resourceIdentifier: ResourceIdentifier,
    expirationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    suppressIndefinitely: S.optional(S.Boolean),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/audit/suppressions/update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAuditSuppressionResponse extends S.Class<UpdateAuditSuppressionResponse>(
  "UpdateAuditSuppressionResponse",
)({}) {}
export const PublicKeyMap = S.Record({ key: S.String, value: S.String });
export class UpdateAuthorizerRequest extends S.Class<UpdateAuthorizerRequest>(
  "UpdateAuthorizerRequest",
)(
  {
    authorizerName: S.String.pipe(T.HttpLabel()),
    authorizerFunctionArn: S.optional(S.String),
    tokenKeyName: S.optional(S.String),
    tokenSigningPublicKeys: S.optional(PublicKeyMap),
    status: S.optional(S.String),
    enableCachingForHttp: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/authorizer/{authorizerName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BillingGroupProperties extends S.Class<BillingGroupProperties>(
  "BillingGroupProperties",
)({ billingGroupDescription: S.optional(S.String) }) {}
export class UpdateBillingGroupRequest extends S.Class<UpdateBillingGroupRequest>(
  "UpdateBillingGroupRequest",
)(
  {
    billingGroupName: S.String.pipe(T.HttpLabel()),
    billingGroupProperties: BillingGroupProperties,
    expectedVersion: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/billing-groups/{billingGroupName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegistrationConfig extends S.Class<RegistrationConfig>(
  "RegistrationConfig",
)({
  templateBody: S.optional(S.String),
  roleArn: S.optional(S.String),
  templateName: S.optional(S.String),
}) {}
export class UpdateCACertificateRequest extends S.Class<UpdateCACertificateRequest>(
  "UpdateCACertificateRequest",
)(
  {
    certificateId: S.String.pipe(T.HttpLabel()),
    newStatus: S.optional(S.String).pipe(T.HttpQuery("newStatus")),
    newAutoRegistrationStatus: S.optional(S.String).pipe(
      T.HttpQuery("newAutoRegistrationStatus"),
    ),
    registrationConfig: S.optional(RegistrationConfig),
    removeAutoRegistration: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/cacertificate/{certificateId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCACertificateResponse extends S.Class<UpdateCACertificateResponse>(
  "UpdateCACertificateResponse",
)({}) {}
export class UpdateCertificateRequest extends S.Class<UpdateCertificateRequest>(
  "UpdateCertificateRequest",
)(
  {
    certificateId: S.String.pipe(T.HttpLabel()),
    newStatus: S.String.pipe(T.HttpQuery("newStatus")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/certificates/{certificateId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCertificateResponse extends S.Class<UpdateCertificateResponse>(
  "UpdateCertificateResponse",
)({}) {}
export class UpdateCertificateProviderRequest extends S.Class<UpdateCertificateProviderRequest>(
  "UpdateCertificateProviderRequest",
)(
  {
    certificateProviderName: S.String.pipe(T.HttpLabel()),
    lambdaFunctionArn: S.optional(S.String),
    accountDefaultForOperations: S.optional(
      CertificateProviderAccountDefaultForOperations,
    ),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/certificate-providers/{certificateProviderName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCommandRequest extends S.Class<UpdateCommandRequest>(
  "UpdateCommandRequest",
)(
  {
    commandId: S.String.pipe(T.HttpLabel()),
    displayName: S.optional(S.String),
    description: S.optional(S.String),
    deprecated: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/commands/{commandId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCustomMetricRequest extends S.Class<UpdateCustomMetricRequest>(
  "UpdateCustomMetricRequest",
)(
  { metricName: S.String.pipe(T.HttpLabel()), displayName: S.String },
  T.all(
    T.Http({ method: "PATCH", uri: "/custom-metric/{metricName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDimensionRequest extends S.Class<UpdateDimensionRequest>(
  "UpdateDimensionRequest",
)(
  { name: S.String.pipe(T.HttpLabel()), stringValues: DimensionStringValues },
  T.all(
    T.Http({ method: "PATCH", uri: "/dimensions/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AuthorizerConfig extends S.Class<AuthorizerConfig>(
  "AuthorizerConfig",
)({
  defaultAuthorizerName: S.optional(S.String),
  allowAuthorizerOverride: S.optional(S.Boolean),
}) {}
export class TlsConfig extends S.Class<TlsConfig>("TlsConfig")({
  securityPolicy: S.optional(S.String),
}) {}
export class ServerCertificateConfig extends S.Class<ServerCertificateConfig>(
  "ServerCertificateConfig",
)({
  enableOCSPCheck: S.optional(S.Boolean),
  ocspLambdaArn: S.optional(S.String),
  ocspAuthorizedResponderArn: S.optional(S.String),
}) {}
export class ClientCertificateConfig extends S.Class<ClientCertificateConfig>(
  "ClientCertificateConfig",
)({ clientCertificateCallbackArn: S.optional(S.String) }) {}
export class UpdateDomainConfigurationRequest extends S.Class<UpdateDomainConfigurationRequest>(
  "UpdateDomainConfigurationRequest",
)(
  {
    domainConfigurationName: S.String.pipe(T.HttpLabel()),
    authorizerConfig: S.optional(AuthorizerConfig),
    domainConfigurationStatus: S.optional(S.String),
    removeAuthorizerConfig: S.optional(S.Boolean),
    tlsConfig: S.optional(TlsConfig),
    serverCertificateConfig: S.optional(ServerCertificateConfig),
    authenticationType: S.optional(S.String),
    applicationProtocol: S.optional(S.String),
    clientCertificateConfig: S.optional(ClientCertificateConfig),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/domainConfigurations/{domainConfigurationName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDynamicThingGroupRequest extends S.Class<UpdateDynamicThingGroupRequest>(
  "UpdateDynamicThingGroupRequest",
)(
  {
    thingGroupName: S.String.pipe(T.HttpLabel()),
    thingGroupProperties: ThingGroupProperties,
    expectedVersion: S.optional(S.Number),
    indexName: S.optional(S.String),
    queryString: S.optional(S.String),
    queryVersion: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/dynamic-thing-groups/{thingGroupName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEncryptionConfigurationRequest extends S.Class<UpdateEncryptionConfigurationRequest>(
  "UpdateEncryptionConfigurationRequest",
)(
  {
    encryptionType: S.String,
    kmsKeyArn: S.optional(S.String),
    kmsAccessRoleArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/encryption-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEncryptionConfigurationResponse extends S.Class<UpdateEncryptionConfigurationResponse>(
  "UpdateEncryptionConfigurationResponse",
)({}) {}
export class Configuration extends S.Class<Configuration>("Configuration")({
  Enabled: S.optional(S.Boolean),
}) {}
export const EventConfigurations = S.Record({
  key: S.String,
  value: Configuration,
});
export class UpdateEventConfigurationsRequest extends S.Class<UpdateEventConfigurationsRequest>(
  "UpdateEventConfigurationsRequest",
)(
  { eventConfigurations: S.optional(EventConfigurations) },
  T.all(
    T.Http({ method: "PATCH", uri: "/event-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEventConfigurationsResponse extends S.Class<UpdateEventConfigurationsResponse>(
  "UpdateEventConfigurationsResponse",
)({}) {}
export const AggregationTypeValues = S.Array(S.String);
export class AggregationType extends S.Class<AggregationType>(
  "AggregationType",
)({ name: S.String, values: S.optional(AggregationTypeValues) }) {}
export class UpdateFleetMetricRequest extends S.Class<UpdateFleetMetricRequest>(
  "UpdateFleetMetricRequest",
)(
  {
    metricName: S.String.pipe(T.HttpLabel()),
    queryString: S.optional(S.String),
    aggregationType: S.optional(AggregationType),
    period: S.optional(S.Number),
    aggregationField: S.optional(S.String),
    description: S.optional(S.String),
    queryVersion: S.optional(S.String),
    indexName: S.String,
    unit: S.optional(S.String),
    expectedVersion: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/fleet-metric/{metricName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFleetMetricResponse extends S.Class<UpdateFleetMetricResponse>(
  "UpdateFleetMetricResponse",
)({}) {}
export class Field extends S.Class<Field>("Field")({
  name: S.optional(S.String),
  type: S.optional(S.String),
}) {}
export const Fields = S.Array(Field);
export const NamedShadowNamesFilter = S.Array(S.String);
export class GeoLocationTarget extends S.Class<GeoLocationTarget>(
  "GeoLocationTarget",
)({ name: S.optional(S.String), order: S.optional(S.String) }) {}
export const GeoLocationsFilter = S.Array(GeoLocationTarget);
export class IndexingFilter extends S.Class<IndexingFilter>("IndexingFilter")({
  namedShadowNames: S.optional(NamedShadowNamesFilter),
  geoLocations: S.optional(GeoLocationsFilter),
}) {}
export class ThingIndexingConfiguration extends S.Class<ThingIndexingConfiguration>(
  "ThingIndexingConfiguration",
)({
  thingIndexingMode: S.String,
  thingConnectivityIndexingMode: S.optional(S.String),
  deviceDefenderIndexingMode: S.optional(S.String),
  namedShadowIndexingMode: S.optional(S.String),
  managedFields: S.optional(Fields),
  customFields: S.optional(Fields),
  filter: S.optional(IndexingFilter),
}) {}
export class ThingGroupIndexingConfiguration extends S.Class<ThingGroupIndexingConfiguration>(
  "ThingGroupIndexingConfiguration",
)({
  thingGroupIndexingMode: S.String,
  managedFields: S.optional(Fields),
  customFields: S.optional(Fields),
}) {}
export class UpdateIndexingConfigurationRequest extends S.Class<UpdateIndexingConfigurationRequest>(
  "UpdateIndexingConfigurationRequest",
)(
  {
    thingIndexingConfiguration: S.optional(ThingIndexingConfiguration),
    thingGroupIndexingConfiguration: S.optional(
      ThingGroupIndexingConfiguration,
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/indexing/config" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateIndexingConfigurationResponse extends S.Class<UpdateIndexingConfigurationResponse>(
  "UpdateIndexingConfigurationResponse",
)({}) {}
export class PresignedUrlConfig extends S.Class<PresignedUrlConfig>(
  "PresignedUrlConfig",
)({ roleArn: S.optional(S.String), expiresInSec: S.optional(S.Number) }) {}
export class RateIncreaseCriteria extends S.Class<RateIncreaseCriteria>(
  "RateIncreaseCriteria",
)({
  numberOfNotifiedThings: S.optional(S.Number),
  numberOfSucceededThings: S.optional(S.Number),
}) {}
export class ExponentialRolloutRate extends S.Class<ExponentialRolloutRate>(
  "ExponentialRolloutRate",
)({
  baseRatePerMinute: S.Number,
  incrementFactor: S.Number,
  rateIncreaseCriteria: RateIncreaseCriteria,
}) {}
export class JobExecutionsRolloutConfig extends S.Class<JobExecutionsRolloutConfig>(
  "JobExecutionsRolloutConfig",
)({
  maximumPerMinute: S.optional(S.Number),
  exponentialRate: S.optional(ExponentialRolloutRate),
}) {}
export class AbortCriteria extends S.Class<AbortCriteria>("AbortCriteria")({
  failureType: S.String,
  action: S.String,
  thresholdPercentage: S.Number,
  minNumberOfExecutedThings: S.Number,
}) {}
export const AbortCriteriaList = S.Array(AbortCriteria);
export class AbortConfig extends S.Class<AbortConfig>("AbortConfig")({
  criteriaList: AbortCriteriaList,
}) {}
export class TimeoutConfig extends S.Class<TimeoutConfig>("TimeoutConfig")({
  inProgressTimeoutInMinutes: S.optional(S.Number),
}) {}
export class RetryCriteria extends S.Class<RetryCriteria>("RetryCriteria")({
  failureType: S.String,
  numberOfRetries: S.Number,
}) {}
export const RetryCriteriaList = S.Array(RetryCriteria);
export class JobExecutionsRetryConfig extends S.Class<JobExecutionsRetryConfig>(
  "JobExecutionsRetryConfig",
)({ criteriaList: RetryCriteriaList }) {}
export class UpdateJobRequest extends S.Class<UpdateJobRequest>(
  "UpdateJobRequest",
)(
  {
    jobId: S.String.pipe(T.HttpLabel()),
    description: S.optional(S.String),
    presignedUrlConfig: S.optional(PresignedUrlConfig),
    jobExecutionsRolloutConfig: S.optional(JobExecutionsRolloutConfig),
    abortConfig: S.optional(AbortConfig),
    timeoutConfig: S.optional(TimeoutConfig),
    namespaceId: S.optional(S.String).pipe(T.HttpQuery("namespaceId")),
    jobExecutionsRetryConfig: S.optional(JobExecutionsRetryConfig),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/jobs/{jobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateJobResponse extends S.Class<UpdateJobResponse>(
  "UpdateJobResponse",
)({}) {}
export class UpdateDeviceCertificateParams extends S.Class<UpdateDeviceCertificateParams>(
  "UpdateDeviceCertificateParams",
)({ action: S.String }) {}
export class UpdateCACertificateParams extends S.Class<UpdateCACertificateParams>(
  "UpdateCACertificateParams",
)({ action: S.String }) {}
export const ThingGroupNames = S.Array(S.String);
export class AddThingsToThingGroupParams extends S.Class<AddThingsToThingGroupParams>(
  "AddThingsToThingGroupParams",
)({
  thingGroupNames: ThingGroupNames,
  overrideDynamicGroups: S.optional(S.Boolean),
}) {}
export class ReplaceDefaultPolicyVersionParams extends S.Class<ReplaceDefaultPolicyVersionParams>(
  "ReplaceDefaultPolicyVersionParams",
)({ templateName: S.String }) {}
export class EnableIoTLoggingParams extends S.Class<EnableIoTLoggingParams>(
  "EnableIoTLoggingParams",
)({ roleArnForLogging: S.String, logLevel: S.String }) {}
export class PublishFindingToSnsParams extends S.Class<PublishFindingToSnsParams>(
  "PublishFindingToSnsParams",
)({ topicArn: S.String }) {}
export class MitigationActionParams extends S.Class<MitigationActionParams>(
  "MitigationActionParams",
)({
  updateDeviceCertificateParams: S.optional(UpdateDeviceCertificateParams),
  updateCACertificateParams: S.optional(UpdateCACertificateParams),
  addThingsToThingGroupParams: S.optional(AddThingsToThingGroupParams),
  replaceDefaultPolicyVersionParams: S.optional(
    ReplaceDefaultPolicyVersionParams,
  ),
  enableIoTLoggingParams: S.optional(EnableIoTLoggingParams),
  publishFindingToSnsParams: S.optional(PublishFindingToSnsParams),
}) {}
export class UpdateMitigationActionRequest extends S.Class<UpdateMitigationActionRequest>(
  "UpdateMitigationActionRequest",
)(
  {
    actionName: S.String.pipe(T.HttpLabel()),
    roleArn: S.optional(S.String),
    actionParams: S.optional(MitigationActionParams),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/mitigationactions/actions/{actionName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePackageRequest extends S.Class<UpdatePackageRequest>(
  "UpdatePackageRequest",
)(
  {
    packageName: S.String.pipe(T.HttpLabel()),
    description: S.optional(S.String),
    defaultVersionName: S.optional(S.String),
    unsetDefaultVersion: S.optional(S.Boolean),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/packages/{packageName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePackageResponse extends S.Class<UpdatePackageResponse>(
  "UpdatePackageResponse",
)({}) {}
export class VersionUpdateByJobsConfig extends S.Class<VersionUpdateByJobsConfig>(
  "VersionUpdateByJobsConfig",
)({ enabled: S.optional(S.Boolean), roleArn: S.optional(S.String) }) {}
export class UpdatePackageConfigurationRequest extends S.Class<UpdatePackageConfigurationRequest>(
  "UpdatePackageConfigurationRequest",
)(
  {
    versionUpdateByJobsConfig: S.optional(VersionUpdateByJobsConfig),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/package-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePackageConfigurationResponse extends S.Class<UpdatePackageConfigurationResponse>(
  "UpdatePackageConfigurationResponse",
)({}) {}
export const ResourceAttributes = S.Record({ key: S.String, value: S.String });
export class S3Location extends S.Class<S3Location>("S3Location")({
  bucket: S.optional(S.String),
  key: S.optional(S.String),
  version: S.optional(S.String),
}) {}
export class PackageVersionArtifact extends S.Class<PackageVersionArtifact>(
  "PackageVersionArtifact",
)({ s3Location: S.optional(S3Location) }) {}
export class UpdatePackageVersionRequest extends S.Class<UpdatePackageVersionRequest>(
  "UpdatePackageVersionRequest",
)(
  {
    packageName: S.String.pipe(T.HttpLabel()),
    versionName: S.String.pipe(T.HttpLabel()),
    description: S.optional(S.String),
    attributes: S.optional(ResourceAttributes),
    artifact: S.optional(PackageVersionArtifact),
    action: S.optional(S.String),
    recipe: S.optional(S.String),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/packages/{packageName}/versions/{versionName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePackageVersionResponse extends S.Class<UpdatePackageVersionResponse>(
  "UpdatePackageVersionResponse",
)({}) {}
export class ProvisioningHook extends S.Class<ProvisioningHook>(
  "ProvisioningHook",
)({ payloadVersion: S.optional(S.String), targetArn: S.String }) {}
export class UpdateProvisioningTemplateRequest extends S.Class<UpdateProvisioningTemplateRequest>(
  "UpdateProvisioningTemplateRequest",
)(
  {
    templateName: S.String.pipe(T.HttpLabel()),
    description: S.optional(S.String),
    enabled: S.optional(S.Boolean),
    defaultVersionId: S.optional(S.Number),
    provisioningRoleArn: S.optional(S.String),
    preProvisioningHook: S.optional(ProvisioningHook),
    removePreProvisioningHook: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/provisioning-templates/{templateName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateProvisioningTemplateResponse extends S.Class<UpdateProvisioningTemplateResponse>(
  "UpdateProvisioningTemplateResponse",
)({}) {}
export class UpdateRoleAliasRequest extends S.Class<UpdateRoleAliasRequest>(
  "UpdateRoleAliasRequest",
)(
  {
    roleAlias: S.String.pipe(T.HttpLabel()),
    roleArn: S.optional(S.String),
    credentialDurationSeconds: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/role-aliases/{roleAlias}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateScheduledAuditRequest extends S.Class<UpdateScheduledAuditRequest>(
  "UpdateScheduledAuditRequest",
)(
  {
    frequency: S.optional(S.String),
    dayOfMonth: S.optional(S.String),
    dayOfWeek: S.optional(S.String),
    targetCheckNames: S.optional(TargetAuditCheckNames),
    scheduledAuditName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/audit/scheduledaudits/{scheduledAuditName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class MetricDimension extends S.Class<MetricDimension>(
  "MetricDimension",
)({ dimensionName: S.String, operator: S.optional(S.String) }) {}
export const Cidrs = S.Array(S.String);
export const Ports = S.Array(S.Number);
export const NumberList = S.Array(S.Number);
export const StringList = S.Array(S.String);
export class MetricValue extends S.Class<MetricValue>("MetricValue")({
  count: S.optional(S.Number),
  cidrs: S.optional(Cidrs),
  ports: S.optional(Ports),
  number: S.optional(S.Number),
  numbers: S.optional(NumberList),
  strings: S.optional(StringList),
}) {}
export class StatisticalThreshold extends S.Class<StatisticalThreshold>(
  "StatisticalThreshold",
)({ statistic: S.optional(S.String) }) {}
export class MachineLearningDetectionConfig extends S.Class<MachineLearningDetectionConfig>(
  "MachineLearningDetectionConfig",
)({ confidenceLevel: S.String }) {}
export class BehaviorCriteria extends S.Class<BehaviorCriteria>(
  "BehaviorCriteria",
)({
  comparisonOperator: S.optional(S.String),
  value: S.optional(MetricValue),
  durationSeconds: S.optional(S.Number),
  consecutiveDatapointsToAlarm: S.optional(S.Number),
  consecutiveDatapointsToClear: S.optional(S.Number),
  statisticalThreshold: S.optional(StatisticalThreshold),
  mlDetectionConfig: S.optional(MachineLearningDetectionConfig),
}) {}
export class Behavior extends S.Class<Behavior>("Behavior")({
  name: S.String,
  metric: S.optional(S.String),
  metricDimension: S.optional(MetricDimension),
  criteria: S.optional(BehaviorCriteria),
  suppressAlerts: S.optional(S.Boolean),
  exportMetric: S.optional(S.Boolean),
}) {}
export const Behaviors = S.Array(Behavior);
export class AlertTarget extends S.Class<AlertTarget>("AlertTarget")({
  alertTargetArn: S.String,
  roleArn: S.String,
}) {}
export const AlertTargets = S.Record({ key: S.String, value: AlertTarget });
export class MetricToRetain extends S.Class<MetricToRetain>("MetricToRetain")({
  metric: S.String,
  metricDimension: S.optional(MetricDimension),
  exportMetric: S.optional(S.Boolean),
}) {}
export const AdditionalMetricsToRetainV2List = S.Array(MetricToRetain);
export class MetricsExportConfig extends S.Class<MetricsExportConfig>(
  "MetricsExportConfig",
)({ mqttTopic: S.String, roleArn: S.String }) {}
export class UpdateSecurityProfileRequest extends S.Class<UpdateSecurityProfileRequest>(
  "UpdateSecurityProfileRequest",
)(
  {
    securityProfileName: S.String.pipe(T.HttpLabel()),
    securityProfileDescription: S.optional(S.String),
    behaviors: S.optional(Behaviors),
    alertTargets: S.optional(AlertTargets),
    additionalMetricsToRetain: S.optional(AdditionalMetricsToRetainList),
    additionalMetricsToRetainV2: S.optional(AdditionalMetricsToRetainV2List),
    deleteBehaviors: S.optional(S.Boolean),
    deleteAlertTargets: S.optional(S.Boolean),
    deleteAdditionalMetricsToRetain: S.optional(S.Boolean),
    expectedVersion: S.optional(S.Number).pipe(T.HttpQuery("expectedVersion")),
    metricsExportConfig: S.optional(MetricsExportConfig),
    deleteMetricsExportConfig: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/security-profiles/{securityProfileName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StreamFile extends S.Class<StreamFile>("StreamFile")({
  fileId: S.optional(S.Number),
  s3Location: S.optional(S3Location),
}) {}
export const StreamFiles = S.Array(StreamFile);
export class UpdateStreamRequest extends S.Class<UpdateStreamRequest>(
  "UpdateStreamRequest",
)(
  {
    streamId: S.String.pipe(T.HttpLabel()),
    description: S.optional(S.String),
    files: S.optional(StreamFiles),
    roleArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/streams/{streamId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateThingRequest extends S.Class<UpdateThingRequest>(
  "UpdateThingRequest",
)(
  {
    thingName: S.String.pipe(T.HttpLabel()),
    thingTypeName: S.optional(S.String),
    attributePayload: S.optional(AttributePayload),
    expectedVersion: S.optional(S.Number),
    removeThingType: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/things/{thingName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateThingResponse extends S.Class<UpdateThingResponse>(
  "UpdateThingResponse",
)({}) {}
export class UpdateThingGroupRequest extends S.Class<UpdateThingGroupRequest>(
  "UpdateThingGroupRequest",
)(
  {
    thingGroupName: S.String.pipe(T.HttpLabel()),
    thingGroupProperties: ThingGroupProperties,
    expectedVersion: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/thing-groups/{thingGroupName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateThingGroupsForThingRequest extends S.Class<UpdateThingGroupsForThingRequest>(
  "UpdateThingGroupsForThingRequest",
)(
  {
    thingName: S.optional(S.String),
    thingGroupsToAdd: S.optional(ThingGroupList),
    thingGroupsToRemove: S.optional(ThingGroupList),
    overrideDynamicGroups: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/thing-groups/updateThingGroupsForThing" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateThingGroupsForThingResponse extends S.Class<UpdateThingGroupsForThingResponse>(
  "UpdateThingGroupsForThingResponse",
)({}) {}
export const SearchableAttributes = S.Array(S.String);
export class PropagatingAttribute extends S.Class<PropagatingAttribute>(
  "PropagatingAttribute",
)({
  userPropertyKey: S.optional(S.String),
  thingAttribute: S.optional(S.String),
  connectionAttribute: S.optional(S.String),
}) {}
export const PropagatingAttributeList = S.Array(PropagatingAttribute);
export class Mqtt5Configuration extends S.Class<Mqtt5Configuration>(
  "Mqtt5Configuration",
)({ propagatingAttributes: S.optional(PropagatingAttributeList) }) {}
export class ThingTypeProperties extends S.Class<ThingTypeProperties>(
  "ThingTypeProperties",
)({
  thingTypeDescription: S.optional(S.String),
  searchableAttributes: S.optional(SearchableAttributes),
  mqtt5Configuration: S.optional(Mqtt5Configuration),
}) {}
export class UpdateThingTypeRequest extends S.Class<UpdateThingTypeRequest>(
  "UpdateThingTypeRequest",
)(
  {
    thingTypeName: S.String.pipe(T.HttpLabel()),
    thingTypeProperties: S.optional(ThingTypeProperties),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/thing-types/{thingTypeName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateThingTypeResponse extends S.Class<UpdateThingTypeResponse>(
  "UpdateThingTypeResponse",
)({}) {}
export class UpdateTopicRuleDestinationRequest extends S.Class<UpdateTopicRuleDestinationRequest>(
  "UpdateTopicRuleDestinationRequest",
)(
  { arn: S.String, status: S.String },
  T.all(
    T.Http({ method: "PATCH", uri: "/destinations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTopicRuleDestinationResponse extends S.Class<UpdateTopicRuleDestinationResponse>(
  "UpdateTopicRuleDestinationResponse",
)({}) {}
export class ValidateSecurityProfileBehaviorsRequest extends S.Class<ValidateSecurityProfileBehaviorsRequest>(
  "ValidateSecurityProfileBehaviorsRequest",
)(
  { behaviors: Behaviors },
  T.all(
    T.Http({ method: "POST", uri: "/security-profile-behaviors/validate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const FindingIds = S.Array(S.String);
export const MitigationActionNameList = S.Array(S.String);
export const TargetViolationIdsForDetectMitigationActions = S.Array(S.String);
export const Resources = S.Array(S.String);
export const DetailsMap = S.Record({ key: S.String, value: S.String });
export class CommandPayload extends S.Class<CommandPayload>("CommandPayload")({
  content: S.optional(T.Blob),
  contentType: S.optional(S.String),
}) {}
export const ParameterMap = S.Record({ key: S.String, value: S.String });
export class MaintenanceWindow extends S.Class<MaintenanceWindow>(
  "MaintenanceWindow",
)({ startTime: S.String, durationInMinutes: S.Number }) {}
export const MaintenanceWindows = S.Array(MaintenanceWindow);
export class SchedulingConfig extends S.Class<SchedulingConfig>(
  "SchedulingConfig",
)({
  startTime: S.optional(S.String),
  endTime: S.optional(S.String),
  endBehavior: S.optional(S.String),
  maintenanceWindows: S.optional(MaintenanceWindows),
}) {}
export class AwsJobPresignedUrlConfig extends S.Class<AwsJobPresignedUrlConfig>(
  "AwsJobPresignedUrlConfig",
)({ expiresInSec: S.optional(S.Number) }) {}
export class AwsJobTimeoutConfig extends S.Class<AwsJobTimeoutConfig>(
  "AwsJobTimeoutConfig",
)({ inProgressTimeoutInMinutes: S.optional(S.Number) }) {}
export const AdditionalParameterMap = S.Record({
  key: S.String,
  value: S.String,
});
export const TagMap = S.Record({ key: S.String, value: S.String });
export class AuthorizerDescription extends S.Class<AuthorizerDescription>(
  "AuthorizerDescription",
)({
  authorizerName: S.optional(S.String),
  authorizerArn: S.optional(S.String),
  authorizerFunctionArn: S.optional(S.String),
  tokenKeyName: S.optional(S.String),
  tokenSigningPublicKeys: S.optional(PublicKeyMap),
  status: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  signingDisabled: S.optional(S.Boolean),
  enableCachingForHttp: S.optional(S.Boolean),
}) {}
export class ConfigurationDetails extends S.Class<ConfigurationDetails>(
  "ConfigurationDetails",
)({
  configurationStatus: S.optional(S.String),
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const Environments = S.Array(S.String);
export const StringMap = S.Record({ key: S.String, value: S.String });
export class NonCompliantResource extends S.Class<NonCompliantResource>(
  "NonCompliantResource",
)({
  resourceType: S.optional(S.String),
  resourceIdentifier: S.optional(ResourceIdentifier),
  additionalInfo: S.optional(StringMap),
}) {}
export class RelatedResource extends S.Class<RelatedResource>(
  "RelatedResource",
)({
  resourceType: S.optional(S.String),
  resourceIdentifier: S.optional(ResourceIdentifier),
  additionalInfo: S.optional(StringMap),
}) {}
export const RelatedResources = S.Array(RelatedResource);
export class AuditFinding extends S.Class<AuditFinding>("AuditFinding")({
  findingId: S.optional(S.String),
  taskId: S.optional(S.String),
  checkName: S.optional(S.String),
  taskStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  findingTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  severity: S.optional(S.String),
  nonCompliantResource: S.optional(NonCompliantResource),
  relatedResources: S.optional(RelatedResources),
  reasonForNonCompliance: S.optional(S.String),
  reasonForNonComplianceCode: S.optional(S.String),
  isSuppressed: S.optional(S.Boolean),
}) {}
export const AuditFindings = S.Array(AuditFinding);
export class TimeFilter extends S.Class<TimeFilter>("TimeFilter")({
  after: S.optional(S.String),
  before: S.optional(S.String),
}) {}
export const MetricNames = S.Array(S.String);
export class DetectMitigationActionsTaskTarget extends S.Class<DetectMitigationActionsTaskTarget>(
  "DetectMitigationActionsTaskTarget",
)({
  violationIds: S.optional(TargetViolationIdsForDetectMitigationActions),
  securityProfileName: S.optional(S.String),
  behaviorName: S.optional(S.String),
}) {}
export class ViolationEventOccurrenceRange extends S.Class<ViolationEventOccurrenceRange>(
  "ViolationEventOccurrenceRange",
)({
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class MitigationAction extends S.Class<MitigationAction>(
  "MitigationAction",
)({
  name: S.optional(S.String),
  id: S.optional(S.String),
  roleArn: S.optional(S.String),
  actionParams: S.optional(MitigationActionParams),
}) {}
export const MitigationActionList = S.Array(MitigationAction);
export class DetectMitigationActionsTaskStatistics extends S.Class<DetectMitigationActionsTaskStatistics>(
  "DetectMitigationActionsTaskStatistics",
)({
  actionsExecuted: S.optional(S.Number),
  actionsSkipped: S.optional(S.Number),
  actionsFailed: S.optional(S.Number),
}) {}
export class DetectMitigationActionsTaskSummary extends S.Class<DetectMitigationActionsTaskSummary>(
  "DetectMitigationActionsTaskSummary",
)({
  taskId: S.optional(S.String),
  taskStatus: S.optional(S.String),
  taskStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  taskEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  target: S.optional(DetectMitigationActionsTaskTarget),
  violationEventOccurrenceRange: S.optional(ViolationEventOccurrenceRange),
  onlyActiveViolationsIncluded: S.optional(S.Boolean),
  suppressedAlertsIncluded: S.optional(S.Boolean),
  actionsDefinition: S.optional(MitigationActionList),
  taskStatistics: S.optional(DetectMitigationActionsTaskStatistics),
}) {}
export const DetectMitigationActionsTaskSummaryList = S.Array(
  DetectMitigationActionsTaskSummary,
);
export const DimensionNames = S.Array(S.String);
export const IndexNamesList = S.Array(S.String);
export const Principals = S.Array(S.String);
export const ThingNameList = S.Array(S.String);
export const RoleAliases = S.Array(S.String);
export const PolicyTargets = S.Array(S.String);
export class GroupNameAndArn extends S.Class<GroupNameAndArn>(
  "GroupNameAndArn",
)({ groupName: S.optional(S.String), groupArn: S.optional(S.String) }) {}
export const ThingGroupNameAndArnList = S.Array(GroupNameAndArn);
export const S3FileUrlList = S.Array(S.String);
export const TaskIdList = S.Array(S.String);
export const Parameters = S.Record({ key: S.String, value: S.String });
export class LoggingOptionsPayload extends S.Class<LoggingOptionsPayload>(
  "LoggingOptionsPayload",
)({ roleArn: S.String, logLevel: S.optional(S.String) }) {}
export class LogTarget extends S.Class<LogTarget>("LogTarget")({
  targetType: S.String,
  targetName: S.optional(S.String),
}) {}
export class LogEventConfiguration extends S.Class<LogEventConfiguration>(
  "LogEventConfiguration",
)({
  eventType: S.String,
  logLevel: S.optional(S.String),
  logDestination: S.optional(S.String),
}) {}
export const LogEventConfigurations = S.Array(LogEventConfiguration);
export const AuditCheckToActionsMapping = S.Record({
  key: S.String,
  value: MitigationActionNameList,
});
export class AuthInfo extends S.Class<AuthInfo>("AuthInfo")({
  actionType: S.optional(S.String),
  resources: Resources,
}) {}
export const AuthInfos = S.Array(AuthInfo);
export class MqttContext extends S.Class<MqttContext>("MqttContext")({
  username: S.optional(S.String),
  password: S.optional(T.Blob),
  clientId: S.optional(S.String),
}) {}
export class TlsContext extends S.Class<TlsContext>("TlsContext")({
  serverName: S.optional(S.String),
}) {}
export const SubnetIdList = S.Array(S.String);
export const SecurityGroupList = S.Array(S.String);
export const ReasonForNonComplianceCodes = S.Array(S.String);
export class AssociateTargetsWithJobResponse extends S.Class<AssociateTargetsWithJobResponse>(
  "AssociateTargetsWithJobResponse",
)({
  jobArn: S.optional(S.String),
  jobId: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export class CancelJobResponse extends S.Class<CancelJobResponse>(
  "CancelJobResponse",
)({
  jobArn: S.optional(S.String),
  jobId: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export class CancelJobExecutionRequest extends S.Class<CancelJobExecutionRequest>(
  "CancelJobExecutionRequest",
)(
  {
    jobId: S.String.pipe(T.HttpLabel()),
    thingName: S.String.pipe(T.HttpLabel()),
    force: S.optional(S.Boolean).pipe(T.HttpQuery("force")),
    expectedVersion: S.optional(S.Number),
    statusDetails: S.optional(DetailsMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/things/{thingName}/jobs/{jobId}/cancel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelJobExecutionResponse extends S.Class<CancelJobExecutionResponse>(
  "CancelJobExecutionResponse",
)({}) {}
export class CreateAuthorizerRequest extends S.Class<CreateAuthorizerRequest>(
  "CreateAuthorizerRequest",
)(
  {
    authorizerName: S.String.pipe(T.HttpLabel()),
    authorizerFunctionArn: S.String,
    tokenKeyName: S.optional(S.String),
    tokenSigningPublicKeys: S.optional(PublicKeyMap),
    status: S.optional(S.String),
    tags: S.optional(TagList),
    signingDisabled: S.optional(S.Boolean),
    enableCachingForHttp: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/authorizer/{authorizerName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateBillingGroupRequest extends S.Class<CreateBillingGroupRequest>(
  "CreateBillingGroupRequest",
)(
  {
    billingGroupName: S.String.pipe(T.HttpLabel()),
    billingGroupProperties: S.optional(BillingGroupProperties),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/billing-groups/{billingGroupName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCertificateFromCsrResponse extends S.Class<CreateCertificateFromCsrResponse>(
  "CreateCertificateFromCsrResponse",
)({
  certificateArn: S.optional(S.String),
  certificateId: S.optional(S.String),
  certificatePem: S.optional(S.String),
}) {}
export class CreateCertificateProviderResponse extends S.Class<CreateCertificateProviderResponse>(
  "CreateCertificateProviderResponse",
)({
  certificateProviderName: S.optional(S.String),
  certificateProviderArn: S.optional(S.String),
}) {}
export class CreateCustomMetricResponse extends S.Class<CreateCustomMetricResponse>(
  "CreateCustomMetricResponse",
)({ metricName: S.optional(S.String), metricArn: S.optional(S.String) }) {}
export class CreateDimensionResponse extends S.Class<CreateDimensionResponse>(
  "CreateDimensionResponse",
)({ name: S.optional(S.String), arn: S.optional(S.String) }) {}
export class CreateDomainConfigurationRequest extends S.Class<CreateDomainConfigurationRequest>(
  "CreateDomainConfigurationRequest",
)(
  {
    domainConfigurationName: S.String.pipe(T.HttpLabel()),
    domainName: S.optional(S.String),
    serverCertificateArns: S.optional(ServerCertificateArns),
    validationCertificateArn: S.optional(S.String),
    authorizerConfig: S.optional(AuthorizerConfig),
    serviceType: S.optional(S.String),
    tags: S.optional(TagList),
    tlsConfig: S.optional(TlsConfig),
    serverCertificateConfig: S.optional(ServerCertificateConfig),
    authenticationType: S.optional(S.String),
    applicationProtocol: S.optional(S.String),
    clientCertificateConfig: S.optional(ClientCertificateConfig),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/domainConfigurations/{domainConfigurationName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDynamicThingGroupRequest extends S.Class<CreateDynamicThingGroupRequest>(
  "CreateDynamicThingGroupRequest",
)(
  {
    thingGroupName: S.String.pipe(T.HttpLabel()),
    thingGroupProperties: S.optional(ThingGroupProperties),
    indexName: S.optional(S.String),
    queryString: S.String,
    queryVersion: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/dynamic-thing-groups/{thingGroupName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFleetMetricRequest extends S.Class<CreateFleetMetricRequest>(
  "CreateFleetMetricRequest",
)(
  {
    metricName: S.String.pipe(T.HttpLabel()),
    queryString: S.String,
    aggregationType: AggregationType,
    period: S.Number,
    aggregationField: S.String,
    description: S.optional(S.String),
    queryVersion: S.optional(S.String),
    indexName: S.optional(S.String),
    unit: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/fleet-metric/{metricName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateJobTemplateRequest extends S.Class<CreateJobTemplateRequest>(
  "CreateJobTemplateRequest",
)(
  {
    jobTemplateId: S.String.pipe(T.HttpLabel()),
    jobArn: S.optional(S.String),
    documentSource: S.optional(S.String),
    document: S.optional(S.String),
    description: S.String,
    presignedUrlConfig: S.optional(PresignedUrlConfig),
    jobExecutionsRolloutConfig: S.optional(JobExecutionsRolloutConfig),
    abortConfig: S.optional(AbortConfig),
    timeoutConfig: S.optional(TimeoutConfig),
    tags: S.optional(TagList),
    jobExecutionsRetryConfig: S.optional(JobExecutionsRetryConfig),
    maintenanceWindows: S.optional(MaintenanceWindows),
    destinationPackageVersions: S.optional(DestinationPackageVersions),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/job-templates/{jobTemplateId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePackageRequest extends S.Class<CreatePackageRequest>(
  "CreatePackageRequest",
)(
  {
    packageName: S.String.pipe(T.HttpLabel()),
    description: S.optional(S.String),
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/packages/{packageName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePackageVersionRequest extends S.Class<CreatePackageVersionRequest>(
  "CreatePackageVersionRequest",
)(
  {
    packageName: S.String.pipe(T.HttpLabel()),
    versionName: S.String.pipe(T.HttpLabel()),
    description: S.optional(S.String),
    attributes: S.optional(ResourceAttributes),
    artifact: S.optional(PackageVersionArtifact),
    recipe: S.optional(S.String),
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/packages/{packageName}/versions/{versionName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePolicyResponse extends S.Class<CreatePolicyResponse>(
  "CreatePolicyResponse",
)({
  policyName: S.optional(S.String),
  policyArn: S.optional(S.String),
  policyDocument: S.optional(S.String),
  policyVersionId: S.optional(S.String),
}) {}
export class CreatePolicyVersionResponse extends S.Class<CreatePolicyVersionResponse>(
  "CreatePolicyVersionResponse",
)({
  policyArn: S.optional(S.String),
  policyDocument: S.optional(S.String),
  policyVersionId: S.optional(S.String),
  isDefaultVersion: S.optional(S.Boolean),
}) {}
export class KeyPair extends S.Class<KeyPair>("KeyPair")({
  PublicKey: S.optional(S.String),
  PrivateKey: S.optional(S.String),
}) {}
export class CreateProvisioningClaimResponse extends S.Class<CreateProvisioningClaimResponse>(
  "CreateProvisioningClaimResponse",
)({
  certificateId: S.optional(S.String),
  certificatePem: S.optional(S.String),
  keyPair: S.optional(KeyPair),
  expiration: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateProvisioningTemplateRequest extends S.Class<CreateProvisioningTemplateRequest>(
  "CreateProvisioningTemplateRequest",
)(
  {
    templateName: S.String,
    description: S.optional(S.String),
    templateBody: S.String,
    enabled: S.optional(S.Boolean),
    provisioningRoleArn: S.String,
    preProvisioningHook: S.optional(ProvisioningHook),
    tags: S.optional(TagList),
    type: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/provisioning-templates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateProvisioningTemplateVersionResponse extends S.Class<CreateProvisioningTemplateVersionResponse>(
  "CreateProvisioningTemplateVersionResponse",
)({
  templateArn: S.optional(S.String),
  templateName: S.optional(S.String),
  versionId: S.optional(S.Number),
  isDefaultVersion: S.optional(S.Boolean),
}) {}
export class CreateRoleAliasResponse extends S.Class<CreateRoleAliasResponse>(
  "CreateRoleAliasResponse",
)({ roleAlias: S.optional(S.String), roleAliasArn: S.optional(S.String) }) {}
export class CreateScheduledAuditResponse extends S.Class<CreateScheduledAuditResponse>(
  "CreateScheduledAuditResponse",
)({ scheduledAuditArn: S.optional(S.String) }) {}
export class CreateStreamRequest extends S.Class<CreateStreamRequest>(
  "CreateStreamRequest",
)(
  {
    streamId: S.String.pipe(T.HttpLabel()),
    description: S.optional(S.String),
    files: StreamFiles,
    roleArn: S.String,
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/streams/{streamId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateThingGroupResponse extends S.Class<CreateThingGroupResponse>(
  "CreateThingGroupResponse",
)({
  thingGroupName: S.optional(S.String),
  thingGroupArn: S.optional(S.String),
  thingGroupId: S.optional(S.String),
}) {}
export class DeleteCommandResponse extends S.Class<DeleteCommandResponse>(
  "DeleteCommandResponse",
)({ statusCode: S.optional(S.Number).pipe(T.HttpResponseCode()) }) {}
export class DescribeAuditSuppressionResponse extends S.Class<DescribeAuditSuppressionResponse>(
  "DescribeAuditSuppressionResponse",
)({
  checkName: S.optional(S.String),
  resourceIdentifier: S.optional(ResourceIdentifier),
  expirationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  suppressIndefinitely: S.optional(S.Boolean),
  description: S.optional(S.String),
}) {}
export class DescribeAuthorizerResponse extends S.Class<DescribeAuthorizerResponse>(
  "DescribeAuthorizerResponse",
)({ authorizerDescription: S.optional(AuthorizerDescription) }) {}
export class DescribeCertificateProviderResponse extends S.Class<DescribeCertificateProviderResponse>(
  "DescribeCertificateProviderResponse",
)({
  certificateProviderName: S.optional(S.String),
  certificateProviderArn: S.optional(S.String),
  lambdaFunctionArn: S.optional(S.String),
  accountDefaultForOperations: S.optional(
    CertificateProviderAccountDefaultForOperations,
  ),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DescribeCustomMetricResponse extends S.Class<DescribeCustomMetricResponse>(
  "DescribeCustomMetricResponse",
)({
  metricName: S.optional(S.String),
  metricArn: S.optional(S.String),
  metricType: S.optional(S.String),
  displayName: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DescribeDefaultAuthorizerResponse extends S.Class<DescribeDefaultAuthorizerResponse>(
  "DescribeDefaultAuthorizerResponse",
)({ authorizerDescription: S.optional(AuthorizerDescription) }) {}
export class DescribeDimensionResponse extends S.Class<DescribeDimensionResponse>(
  "DescribeDimensionResponse",
)({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  type: S.optional(S.String),
  stringValues: S.optional(DimensionStringValues),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DescribeEncryptionConfigurationResponse extends S.Class<DescribeEncryptionConfigurationResponse>(
  "DescribeEncryptionConfigurationResponse",
)({
  encryptionType: S.optional(S.String),
  kmsKeyArn: S.optional(S.String),
  kmsAccessRoleArn: S.optional(S.String),
  configurationDetails: S.optional(ConfigurationDetails),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DescribeEndpointResponse extends S.Class<DescribeEndpointResponse>(
  "DescribeEndpointResponse",
)({ endpointAddress: S.optional(S.String) }) {}
export class DescribeFleetMetricResponse extends S.Class<DescribeFleetMetricResponse>(
  "DescribeFleetMetricResponse",
)({
  metricName: S.optional(S.String),
  queryString: S.optional(S.String),
  aggregationType: S.optional(AggregationType),
  period: S.optional(S.Number),
  aggregationField: S.optional(S.String),
  description: S.optional(S.String),
  queryVersion: S.optional(S.String),
  indexName: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  unit: S.optional(S.String),
  version: S.optional(S.Number),
  metricArn: S.optional(S.String),
}) {}
export class DescribeIndexResponse extends S.Class<DescribeIndexResponse>(
  "DescribeIndexResponse",
)({
  indexName: S.optional(S.String),
  indexStatus: S.optional(S.String),
  schema: S.optional(S.String),
}) {}
export class DescribeJobTemplateResponse extends S.Class<DescribeJobTemplateResponse>(
  "DescribeJobTemplateResponse",
)({
  jobTemplateArn: S.optional(S.String),
  jobTemplateId: S.optional(S.String),
  description: S.optional(S.String),
  documentSource: S.optional(S.String),
  document: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  presignedUrlConfig: S.optional(PresignedUrlConfig),
  jobExecutionsRolloutConfig: S.optional(JobExecutionsRolloutConfig),
  abortConfig: S.optional(AbortConfig),
  timeoutConfig: S.optional(TimeoutConfig),
  jobExecutionsRetryConfig: S.optional(JobExecutionsRetryConfig),
  maintenanceWindows: S.optional(MaintenanceWindows),
  destinationPackageVersions: S.optional(DestinationPackageVersions),
}) {}
export class DescribeMitigationActionResponse extends S.Class<DescribeMitigationActionResponse>(
  "DescribeMitigationActionResponse",
)({
  actionName: S.optional(S.String),
  actionType: S.optional(S.String),
  actionArn: S.optional(S.String),
  actionId: S.optional(S.String),
  roleArn: S.optional(S.String),
  actionParams: S.optional(MitigationActionParams),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DescribeProvisioningTemplateResponse extends S.Class<DescribeProvisioningTemplateResponse>(
  "DescribeProvisioningTemplateResponse",
)({
  templateArn: S.optional(S.String),
  templateName: S.optional(S.String),
  description: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  defaultVersionId: S.optional(S.Number),
  templateBody: S.optional(S.String),
  enabled: S.optional(S.Boolean),
  provisioningRoleArn: S.optional(S.String),
  preProvisioningHook: S.optional(ProvisioningHook),
  type: S.optional(S.String),
}) {}
export class DescribeProvisioningTemplateVersionResponse extends S.Class<DescribeProvisioningTemplateVersionResponse>(
  "DescribeProvisioningTemplateVersionResponse",
)({
  versionId: S.optional(S.Number),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  templateBody: S.optional(S.String),
  isDefaultVersion: S.optional(S.Boolean),
}) {}
export class DescribeScheduledAuditResponse extends S.Class<DescribeScheduledAuditResponse>(
  "DescribeScheduledAuditResponse",
)({
  frequency: S.optional(S.String),
  dayOfMonth: S.optional(S.String),
  dayOfWeek: S.optional(S.String),
  targetCheckNames: S.optional(TargetAuditCheckNames),
  scheduledAuditName: S.optional(S.String),
  scheduledAuditArn: S.optional(S.String),
}) {}
export class DescribeSecurityProfileResponse extends S.Class<DescribeSecurityProfileResponse>(
  "DescribeSecurityProfileResponse",
)({
  securityProfileName: S.optional(S.String),
  securityProfileArn: S.optional(S.String),
  securityProfileDescription: S.optional(S.String),
  behaviors: S.optional(Behaviors),
  alertTargets: S.optional(AlertTargets),
  additionalMetricsToRetain: S.optional(AdditionalMetricsToRetainList),
  additionalMetricsToRetainV2: S.optional(AdditionalMetricsToRetainV2List),
  version: S.optional(S.Number),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  metricsExportConfig: S.optional(MetricsExportConfig),
}) {}
export class DescribeThingResponse extends S.Class<DescribeThingResponse>(
  "DescribeThingResponse",
)({
  defaultClientId: S.optional(S.String),
  thingName: S.optional(S.String),
  thingId: S.optional(S.String),
  thingArn: S.optional(S.String),
  thingTypeName: S.optional(S.String),
  attributes: S.optional(Attributes),
  version: S.optional(S.Number),
  billingGroupName: S.optional(S.String),
}) {}
export class DescribeThingRegistrationTaskResponse extends S.Class<DescribeThingRegistrationTaskResponse>(
  "DescribeThingRegistrationTaskResponse",
)({
  taskId: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  templateBody: S.optional(S.String),
  inputFileBucket: S.optional(S.String),
  inputFileKey: S.optional(S.String),
  roleArn: S.optional(S.String),
  status: S.optional(S.String),
  message: S.optional(S.String),
  successCount: S.optional(S.Number),
  failureCount: S.optional(S.Number),
  percentageProgress: S.optional(S.Number),
}) {}
export class GetCardinalityResponse extends S.Class<GetCardinalityResponse>(
  "GetCardinalityResponse",
)({ cardinality: S.optional(S.Number) }) {}
export class CommandParameterValue extends S.Class<CommandParameterValue>(
  "CommandParameterValue",
)({
  S: S.optional(S.String),
  B: S.optional(S.Boolean),
  I: S.optional(S.Number),
  L: S.optional(S.Number),
  D: S.optional(S.Number),
  BIN: S.optional(T.Blob),
  UL: S.optional(S.String),
}) {}
export const CommandParameterValueStringList = S.Array(S.String);
export class CommandParameterValueNumberRange extends S.Class<CommandParameterValueNumberRange>(
  "CommandParameterValueNumberRange",
)({ min: S.String, max: S.String }) {}
export class CommandParameterValueComparisonOperand extends S.Class<CommandParameterValueComparisonOperand>(
  "CommandParameterValueComparisonOperand",
)({
  number: S.optional(S.String),
  numbers: S.optional(CommandParameterValueStringList),
  string: S.optional(S.String),
  strings: S.optional(CommandParameterValueStringList),
  numberRange: S.optional(CommandParameterValueNumberRange),
}) {}
export class CommandParameterValueCondition extends S.Class<CommandParameterValueCondition>(
  "CommandParameterValueCondition",
)({
  comparisonOperator: S.String,
  operand: CommandParameterValueComparisonOperand,
}) {}
export const CommandParameterValueConditionList = S.Array(
  CommandParameterValueCondition,
);
export class CommandParameter extends S.Class<CommandParameter>(
  "CommandParameter",
)({
  name: S.String,
  type: S.optional(S.String),
  value: S.optional(CommandParameterValue),
  defaultValue: S.optional(CommandParameterValue),
  valueConditions: S.optional(CommandParameterValueConditionList),
  description: S.optional(S.String),
}) {}
export const CommandParameterList = S.Array(CommandParameter);
export class AwsJsonSubstitutionCommandPreprocessorConfig extends S.Class<AwsJsonSubstitutionCommandPreprocessorConfig>(
  "AwsJsonSubstitutionCommandPreprocessorConfig",
)({ outputFormat: S.String }) {}
export class CommandPreprocessor extends S.Class<CommandPreprocessor>(
  "CommandPreprocessor",
)({
  awsJsonSubstitution: S.optional(AwsJsonSubstitutionCommandPreprocessorConfig),
}) {}
export class GetCommandResponse extends S.Class<GetCommandResponse>(
  "GetCommandResponse",
)({
  commandId: S.optional(S.String),
  commandArn: S.optional(S.String),
  namespace: S.optional(S.String),
  displayName: S.optional(S.String),
  description: S.optional(S.String),
  mandatoryParameters: S.optional(CommandParameterList),
  payload: S.optional(CommandPayload),
  payloadTemplate: S.optional(S.String),
  preprocessor: S.optional(CommandPreprocessor),
  roleArn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  deprecated: S.optional(S.Boolean),
  pendingDeletion: S.optional(S.Boolean),
}) {}
export class GetJobDocumentResponse extends S.Class<GetJobDocumentResponse>(
  "GetJobDocumentResponse",
)({ document: S.optional(S.String) }) {}
export class GetPackageResponse extends S.Class<GetPackageResponse>(
  "GetPackageResponse",
)({
  packageName: S.optional(S.String),
  packageArn: S.optional(S.String),
  description: S.optional(S.String),
  defaultVersionName: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetPackageConfigurationResponse extends S.Class<GetPackageConfigurationResponse>(
  "GetPackageConfigurationResponse",
)({ versionUpdateByJobsConfig: S.optional(VersionUpdateByJobsConfig) }) {}
export class Sbom extends S.Class<Sbom>("Sbom")({
  s3Location: S.optional(S3Location),
}) {}
export class GetPackageVersionResponse extends S.Class<GetPackageVersionResponse>(
  "GetPackageVersionResponse",
)({
  packageVersionArn: S.optional(S.String),
  packageName: S.optional(S.String),
  versionName: S.optional(S.String),
  description: S.optional(S.String),
  attributes: S.optional(ResourceAttributes),
  artifact: S.optional(PackageVersionArtifact),
  status: S.optional(S.String),
  errorReason: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  sbom: S.optional(Sbom),
  sbomValidationStatus: S.optional(S.String),
  recipe: S.optional(S.String),
}) {}
export class GetPolicyResponse extends S.Class<GetPolicyResponse>(
  "GetPolicyResponse",
)({
  policyName: S.optional(S.String),
  policyArn: S.optional(S.String),
  policyDocument: S.optional(S.String),
  defaultVersionId: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  generationId: S.optional(S.String),
}) {}
export class GetPolicyVersionResponse extends S.Class<GetPolicyVersionResponse>(
  "GetPolicyVersionResponse",
)({
  policyArn: S.optional(S.String),
  policyName: S.optional(S.String),
  policyDocument: S.optional(S.String),
  policyVersionId: S.optional(S.String),
  isDefaultVersion: S.optional(S.Boolean),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  generationId: S.optional(S.String),
}) {}
export class GetThingConnectivityDataResponse extends S.Class<GetThingConnectivityDataResponse>(
  "GetThingConnectivityDataResponse",
)({
  thingName: S.optional(S.String),
  connected: S.optional(S.Boolean),
  timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  disconnectReason: S.optional(S.String),
}) {}
export class GetV2LoggingOptionsResponse extends S.Class<GetV2LoggingOptionsResponse>(
  "GetV2LoggingOptionsResponse",
)({
  roleArn: S.optional(S.String),
  defaultLogLevel: S.optional(S.String),
  disableAllLogs: S.optional(S.Boolean),
  eventConfigurations: S.optional(LogEventConfigurations),
}) {}
export class ListAuditFindingsResponse extends S.Class<ListAuditFindingsResponse>(
  "ListAuditFindingsResponse",
)({ findings: S.optional(AuditFindings), nextToken: S.optional(S.String) }) {}
export class Certificate extends S.Class<Certificate>("Certificate")({
  certificateArn: S.optional(S.String),
  certificateId: S.optional(S.String),
  status: S.optional(S.String),
  certificateMode: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const Certificates = S.Array(Certificate);
export class ListCertificatesByCAResponse extends S.Class<ListCertificatesByCAResponse>(
  "ListCertificatesByCAResponse",
)({
  certificates: S.optional(Certificates),
  nextMarker: S.optional(S.String),
}) {}
export class ListCommandExecutionsRequest extends S.Class<ListCommandExecutionsRequest>(
  "ListCommandExecutionsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    namespace: S.optional(S.String),
    status: S.optional(S.String),
    sortOrder: S.optional(S.String),
    startedTimeFilter: S.optional(TimeFilter),
    completedTimeFilter: S.optional(TimeFilter),
    targetArn: S.optional(S.String),
    commandArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/command-executions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCustomMetricsResponse extends S.Class<ListCustomMetricsResponse>(
  "ListCustomMetricsResponse",
)({ metricNames: S.optional(MetricNames), nextToken: S.optional(S.String) }) {}
export class ListDetectMitigationActionsTasksResponse extends S.Class<ListDetectMitigationActionsTasksResponse>(
  "ListDetectMitigationActionsTasksResponse",
)({
  tasks: S.optional(DetectMitigationActionsTaskSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListDimensionsResponse extends S.Class<ListDimensionsResponse>(
  "ListDimensionsResponse",
)({
  dimensionNames: S.optional(DimensionNames),
  nextToken: S.optional(S.String),
}) {}
export class ListIndicesResponse extends S.Class<ListIndicesResponse>(
  "ListIndicesResponse",
)({
  indexNames: S.optional(IndexNamesList),
  nextToken: S.optional(S.String),
}) {}
export class Policy extends S.Class<Policy>("Policy")({
  policyName: S.optional(S.String),
  policyArn: S.optional(S.String),
}) {}
export const Policies = S.Array(Policy);
export class ListPoliciesResponse extends S.Class<ListPoliciesResponse>(
  "ListPoliciesResponse",
)({ policies: S.optional(Policies), nextMarker: S.optional(S.String) }) {}
export class ListPolicyPrincipalsResponse extends S.Class<ListPolicyPrincipalsResponse>(
  "ListPolicyPrincipalsResponse",
)({ principals: S.optional(Principals), nextMarker: S.optional(S.String) }) {}
export class ListPrincipalPoliciesResponse extends S.Class<ListPrincipalPoliciesResponse>(
  "ListPrincipalPoliciesResponse",
)({ policies: S.optional(Policies), nextMarker: S.optional(S.String) }) {}
export class ListPrincipalThingsResponse extends S.Class<ListPrincipalThingsResponse>(
  "ListPrincipalThingsResponse",
)({ things: S.optional(ThingNameList), nextToken: S.optional(S.String) }) {}
export class ListRoleAliasesResponse extends S.Class<ListRoleAliasesResponse>(
  "ListRoleAliasesResponse",
)({ roleAliases: S.optional(RoleAliases), nextMarker: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagList), nextToken: S.optional(S.String) }) {}
export class ListTargetsForPolicyResponse extends S.Class<ListTargetsForPolicyResponse>(
  "ListTargetsForPolicyResponse",
)({ targets: S.optional(PolicyTargets), nextMarker: S.optional(S.String) }) {}
export class ListThingGroupsResponse extends S.Class<ListThingGroupsResponse>(
  "ListThingGroupsResponse",
)({
  thingGroups: S.optional(ThingGroupNameAndArnList),
  nextToken: S.optional(S.String),
}) {}
export class ListThingGroupsForThingResponse extends S.Class<ListThingGroupsForThingResponse>(
  "ListThingGroupsForThingResponse",
)({
  thingGroups: S.optional(ThingGroupNameAndArnList),
  nextToken: S.optional(S.String),
}) {}
export class ListThingPrincipalsResponse extends S.Class<ListThingPrincipalsResponse>(
  "ListThingPrincipalsResponse",
)({ principals: S.optional(Principals), nextToken: S.optional(S.String) }) {}
export class ListThingRegistrationTaskReportsResponse extends S.Class<ListThingRegistrationTaskReportsResponse>(
  "ListThingRegistrationTaskReportsResponse",
)({
  resourceLinks: S.optional(S3FileUrlList),
  reportType: S.optional(S.String),
  nextToken: S.optional(S.String),
}) {}
export class ListThingRegistrationTasksResponse extends S.Class<ListThingRegistrationTasksResponse>(
  "ListThingRegistrationTasksResponse",
)({ taskIds: S.optional(TaskIdList), nextToken: S.optional(S.String) }) {}
export class ListThingsInBillingGroupResponse extends S.Class<ListThingsInBillingGroupResponse>(
  "ListThingsInBillingGroupResponse",
)({ things: S.optional(ThingNameList), nextToken: S.optional(S.String) }) {}
export class ListThingsInThingGroupResponse extends S.Class<ListThingsInThingGroupResponse>(
  "ListThingsInThingGroupResponse",
)({ things: S.optional(ThingNameList), nextToken: S.optional(S.String) }) {}
export class RegisterCACertificateRequest extends S.Class<RegisterCACertificateRequest>(
  "RegisterCACertificateRequest",
)(
  {
    caCertificate: S.String,
    verificationCertificate: S.optional(S.String),
    setAsActive: S.optional(S.Boolean).pipe(T.HttpQuery("setAsActive")),
    allowAutoRegistration: S.optional(S.Boolean).pipe(
      T.HttpQuery("allowAutoRegistration"),
    ),
    registrationConfig: S.optional(RegistrationConfig),
    tags: S.optional(TagList),
    certificateMode: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/cacertificate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterCertificateResponse extends S.Class<RegisterCertificateResponse>(
  "RegisterCertificateResponse",
)({
  certificateArn: S.optional(S.String),
  certificateId: S.optional(S.String),
}) {}
export class RegisterCertificateWithoutCAResponse extends S.Class<RegisterCertificateWithoutCAResponse>(
  "RegisterCertificateWithoutCAResponse",
)({
  certificateArn: S.optional(S.String),
  certificateId: S.optional(S.String),
}) {}
export class RegisterThingRequest extends S.Class<RegisterThingRequest>(
  "RegisterThingRequest",
)(
  { templateBody: S.String, parameters: S.optional(Parameters) },
  T.all(
    T.Http({ method: "POST", uri: "/things" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SetDefaultAuthorizerResponse extends S.Class<SetDefaultAuthorizerResponse>(
  "SetDefaultAuthorizerResponse",
)({
  authorizerName: S.optional(S.String),
  authorizerArn: S.optional(S.String),
}) {}
export class SetLoggingOptionsRequest extends S.Class<SetLoggingOptionsRequest>(
  "SetLoggingOptionsRequest",
)(
  { loggingOptionsPayload: LoggingOptionsPayload.pipe(T.HttpPayload()) },
  T.all(
    T.Http({ method: "POST", uri: "/loggingOptions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SetLoggingOptionsResponse extends S.Class<SetLoggingOptionsResponse>(
  "SetLoggingOptionsResponse",
)({}) {}
export class SetV2LoggingLevelRequest extends S.Class<SetV2LoggingLevelRequest>(
  "SetV2LoggingLevelRequest",
)(
  { logTarget: LogTarget, logLevel: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/v2LoggingLevel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SetV2LoggingLevelResponse extends S.Class<SetV2LoggingLevelResponse>(
  "SetV2LoggingLevelResponse",
)({}) {}
export class SetV2LoggingOptionsRequest extends S.Class<SetV2LoggingOptionsRequest>(
  "SetV2LoggingOptionsRequest",
)(
  {
    roleArn: S.optional(S.String),
    defaultLogLevel: S.optional(S.String),
    disableAllLogs: S.optional(S.Boolean),
    eventConfigurations: S.optional(LogEventConfigurations),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v2LoggingOptions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SetV2LoggingOptionsResponse extends S.Class<SetV2LoggingOptionsResponse>(
  "SetV2LoggingOptionsResponse",
)({}) {}
export class StartDetectMitigationActionsTaskRequest extends S.Class<StartDetectMitigationActionsTaskRequest>(
  "StartDetectMitigationActionsTaskRequest",
)(
  {
    taskId: S.String.pipe(T.HttpLabel()),
    target: DetectMitigationActionsTaskTarget,
    actions: DetectMitigationActionsToExecuteList,
    violationEventOccurrenceRange: S.optional(ViolationEventOccurrenceRange),
    includeOnlyActiveViolations: S.optional(S.Boolean),
    includeSuppressedAlerts: S.optional(S.Boolean),
    clientRequestToken: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/detect/mitigationactions/tasks/{taskId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartOnDemandAuditTaskResponse extends S.Class<StartOnDemandAuditTaskResponse>(
  "StartOnDemandAuditTaskResponse",
)({ taskId: S.optional(S.String) }) {}
export class StartThingRegistrationTaskResponse extends S.Class<StartThingRegistrationTaskResponse>(
  "StartThingRegistrationTaskResponse",
)({ taskId: S.optional(S.String) }) {}
export class TestAuthorizationRequest extends S.Class<TestAuthorizationRequest>(
  "TestAuthorizationRequest",
)(
  {
    principal: S.optional(S.String),
    cognitoIdentityPoolId: S.optional(S.String),
    authInfos: AuthInfos,
    clientId: S.optional(S.String).pipe(T.HttpQuery("clientId")),
    policyNamesToAdd: S.optional(PolicyNames),
    policyNamesToSkip: S.optional(PolicyNames),
  },
  T.all(
    T.Http({ method: "POST", uri: "/test-authorization" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TransferCertificateResponse extends S.Class<TransferCertificateResponse>(
  "TransferCertificateResponse",
)({ transferredCertificateArn: S.optional(S.String) }) {}
export class UpdateAuthorizerResponse extends S.Class<UpdateAuthorizerResponse>(
  "UpdateAuthorizerResponse",
)({
  authorizerName: S.optional(S.String),
  authorizerArn: S.optional(S.String),
}) {}
export class UpdateBillingGroupResponse extends S.Class<UpdateBillingGroupResponse>(
  "UpdateBillingGroupResponse",
)({ version: S.optional(S.Number) }) {}
export class UpdateCertificateProviderResponse extends S.Class<UpdateCertificateProviderResponse>(
  "UpdateCertificateProviderResponse",
)({
  certificateProviderName: S.optional(S.String),
  certificateProviderArn: S.optional(S.String),
}) {}
export class UpdateCommandResponse extends S.Class<UpdateCommandResponse>(
  "UpdateCommandResponse",
)({
  commandId: S.optional(S.String),
  displayName: S.optional(S.String),
  description: S.optional(S.String),
  deprecated: S.optional(S.Boolean),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class UpdateCustomMetricResponse extends S.Class<UpdateCustomMetricResponse>(
  "UpdateCustomMetricResponse",
)({
  metricName: S.optional(S.String),
  metricArn: S.optional(S.String),
  metricType: S.optional(S.String),
  displayName: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class UpdateDimensionResponse extends S.Class<UpdateDimensionResponse>(
  "UpdateDimensionResponse",
)({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  type: S.optional(S.String),
  stringValues: S.optional(DimensionStringValues),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class UpdateDomainConfigurationResponse extends S.Class<UpdateDomainConfigurationResponse>(
  "UpdateDomainConfigurationResponse",
)({
  domainConfigurationName: S.optional(S.String),
  domainConfigurationArn: S.optional(S.String),
}) {}
export class UpdateDynamicThingGroupResponse extends S.Class<UpdateDynamicThingGroupResponse>(
  "UpdateDynamicThingGroupResponse",
)({ version: S.optional(S.Number) }) {}
export class UpdateMitigationActionResponse extends S.Class<UpdateMitigationActionResponse>(
  "UpdateMitigationActionResponse",
)({ actionArn: S.optional(S.String), actionId: S.optional(S.String) }) {}
export class UpdateRoleAliasResponse extends S.Class<UpdateRoleAliasResponse>(
  "UpdateRoleAliasResponse",
)({ roleAlias: S.optional(S.String), roleAliasArn: S.optional(S.String) }) {}
export class UpdateScheduledAuditResponse extends S.Class<UpdateScheduledAuditResponse>(
  "UpdateScheduledAuditResponse",
)({ scheduledAuditArn: S.optional(S.String) }) {}
export class UpdateSecurityProfileResponse extends S.Class<UpdateSecurityProfileResponse>(
  "UpdateSecurityProfileResponse",
)({
  securityProfileName: S.optional(S.String),
  securityProfileArn: S.optional(S.String),
  securityProfileDescription: S.optional(S.String),
  behaviors: S.optional(Behaviors),
  alertTargets: S.optional(AlertTargets),
  additionalMetricsToRetain: S.optional(AdditionalMetricsToRetainList),
  additionalMetricsToRetainV2: S.optional(AdditionalMetricsToRetainV2List),
  version: S.optional(S.Number),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  metricsExportConfig: S.optional(MetricsExportConfig),
}) {}
export class UpdateStreamResponse extends S.Class<UpdateStreamResponse>(
  "UpdateStreamResponse",
)({
  streamId: S.optional(S.String),
  streamArn: S.optional(S.String),
  description: S.optional(S.String),
  streamVersion: S.optional(S.Number),
}) {}
export class UpdateThingGroupResponse extends S.Class<UpdateThingGroupResponse>(
  "UpdateThingGroupResponse",
)({ version: S.optional(S.Number) }) {}
export class AwsJobAbortCriteria extends S.Class<AwsJobAbortCriteria>(
  "AwsJobAbortCriteria",
)({
  failureType: S.String,
  action: S.String,
  thresholdPercentage: S.Number,
  minNumberOfExecutedThings: S.Number,
}) {}
export const AwsJobAbortCriteriaList = S.Array(AwsJobAbortCriteria);
export const AttributesMap = S.Record({ key: S.String, value: S.String });
export class HttpUrlDestinationConfiguration extends S.Class<HttpUrlDestinationConfiguration>(
  "HttpUrlDestinationConfiguration",
)({ confirmationUrl: S.String }) {}
export class VpcDestinationConfiguration extends S.Class<VpcDestinationConfiguration>(
  "VpcDestinationConfiguration",
)({
  subnetIds: SubnetIdList,
  securityGroups: S.optional(SecurityGroupList),
  vpcId: S.String,
  roleArn: S.String,
}) {}
export class TermsAggregation extends S.Class<TermsAggregation>(
  "TermsAggregation",
)({ maxBuckets: S.optional(S.Number) }) {}
export const ThingGroupNameList = S.Array(S.String);
export const AuditCheckToReasonCodeFilter = S.Record({
  key: S.String,
  value: ReasonForNonComplianceCodes,
});
export const HttpHeaders = S.Record({ key: S.String, value: S.String });
export class AwsJobAbortConfig extends S.Class<AwsJobAbortConfig>(
  "AwsJobAbortConfig",
)({ abortCriteriaList: AwsJobAbortCriteriaList }) {}
export class TopicRuleDestinationConfiguration extends S.Class<TopicRuleDestinationConfiguration>(
  "TopicRuleDestinationConfiguration",
)({
  httpUrlConfiguration: S.optional(HttpUrlDestinationConfiguration),
  vpcConfiguration: S.optional(VpcDestinationConfiguration),
}) {}
export class TaskStatistics extends S.Class<TaskStatistics>("TaskStatistics")({
  totalChecks: S.optional(S.Number),
  inProgressChecks: S.optional(S.Number),
  waitingForDataCollectionChecks: S.optional(S.Number),
  compliantChecks: S.optional(S.Number),
  nonCompliantChecks: S.optional(S.Number),
  failedChecks: S.optional(S.Number),
  canceledChecks: S.optional(S.Number),
}) {}
export class BillingGroupMetadata extends S.Class<BillingGroupMetadata>(
  "BillingGroupMetadata",
)({
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ServerCertificateSummary extends S.Class<ServerCertificateSummary>(
  "ServerCertificateSummary",
)({
  serverCertificateArn: S.optional(S.String),
  serverCertificateStatus: S.optional(S.String),
  serverCertificateStatusDetail: S.optional(S.String),
}) {}
export const ServerCertificates = S.Array(ServerCertificateSummary);
export class DocumentParameter extends S.Class<DocumentParameter>(
  "DocumentParameter",
)({
  key: S.optional(S.String),
  description: S.optional(S.String),
  regex: S.optional(S.String),
  example: S.optional(S.String),
  optional: S.optional(S.Boolean),
}) {}
export const DocumentParameters = S.Array(DocumentParameter);
export class RoleAliasDescription extends S.Class<RoleAliasDescription>(
  "RoleAliasDescription",
)({
  roleAlias: S.optional(S.String),
  roleAliasArn: S.optional(S.String),
  roleArn: S.optional(S.String),
  owner: S.optional(S.String),
  credentialDurationSeconds: S.optional(S.Number),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class StreamInfo extends S.Class<StreamInfo>("StreamInfo")({
  streamId: S.optional(S.String),
  streamArn: S.optional(S.String),
  streamVersion: S.optional(S.Number),
  description: S.optional(S.String),
  files: S.optional(StreamFiles),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  roleArn: S.optional(S.String),
}) {}
export class ThingGroupMetadata extends S.Class<ThingGroupMetadata>(
  "ThingGroupMetadata",
)({
  parentGroupName: S.optional(S.String),
  rootToParentThingGroups: S.optional(ThingGroupNameAndArnList),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ThingTypeMetadata extends S.Class<ThingTypeMetadata>(
  "ThingTypeMetadata",
)({
  deprecated: S.optional(S.Boolean),
  deprecationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class BehaviorModelTrainingSummary extends S.Class<BehaviorModelTrainingSummary>(
  "BehaviorModelTrainingSummary",
)({
  securityProfileName: S.optional(S.String),
  behaviorName: S.optional(S.String),
  trainingDataCollectionStartDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  modelStatus: S.optional(S.String),
  datapointsCollectionPercentage: S.optional(S.Number),
  lastModelRefreshDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const BehaviorModelTrainingSummaries = S.Array(
  BehaviorModelTrainingSummary,
);
export class BucketsAggregationType extends S.Class<BucketsAggregationType>(
  "BucketsAggregationType",
)({ termsAggregation: S.optional(TermsAggregation) }) {}
export class StatusReason extends S.Class<StatusReason>("StatusReason")({
  reasonCode: S.String,
  reasonDescription: S.optional(S.String),
}) {}
export const CommandExecutionParameterMap = S.Record({
  key: S.String,
  value: CommandParameterValue,
});
export class EffectivePolicy extends S.Class<EffectivePolicy>(
  "EffectivePolicy",
)({
  policyName: S.optional(S.String),
  policyArn: S.optional(S.String),
  policyDocument: S.optional(S.String),
}) {}
export const EffectivePolicies = S.Array(EffectivePolicy);
export class PercentPair extends S.Class<PercentPair>("PercentPair")({
  percent: S.optional(S.Number),
  value: S.optional(S.Number),
}) {}
export const Percentiles = S.Array(PercentPair);
export class Statistics extends S.Class<Statistics>("Statistics")({
  count: S.optional(S.Number),
  average: S.optional(S.Number),
  sum: S.optional(S.Number),
  minimum: S.optional(S.Number),
  maximum: S.optional(S.Number),
  sumOfSquares: S.optional(S.Number),
  variance: S.optional(S.Number),
  stdDeviation: S.optional(S.Number),
}) {}
export class TopicRule extends S.Class<TopicRule>("TopicRule")({
  ruleName: S.optional(S.String),
  sql: S.optional(S.String),
  description: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  actions: S.optional(ActionList),
  ruleDisabled: S.optional(S.Boolean),
  awsIotSqlVersion: S.optional(S.String),
  errorAction: S.optional(Action),
}) {}
export class AuditMitigationActionExecutionMetadata extends S.Class<AuditMitigationActionExecutionMetadata>(
  "AuditMitigationActionExecutionMetadata",
)({
  taskId: S.optional(S.String),
  findingId: S.optional(S.String),
  actionName: S.optional(S.String),
  actionId: S.optional(S.String),
  status: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  errorCode: S.optional(S.String),
  message: S.optional(S.String),
}) {}
export const AuditMitigationActionExecutionMetadataList = S.Array(
  AuditMitigationActionExecutionMetadata,
);
export class AuditMitigationActionsTaskMetadata extends S.Class<AuditMitigationActionsTaskMetadata>(
  "AuditMitigationActionsTaskMetadata",
)({
  taskId: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  taskStatus: S.optional(S.String),
}) {}
export const AuditMitigationActionsTaskMetadataList = S.Array(
  AuditMitigationActionsTaskMetadata,
);
export class AuditSuppression extends S.Class<AuditSuppression>(
  "AuditSuppression",
)({
  checkName: S.String,
  resourceIdentifier: ResourceIdentifier,
  expirationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  suppressIndefinitely: S.optional(S.Boolean),
  description: S.optional(S.String),
}) {}
export const AuditSuppressionList = S.Array(AuditSuppression);
export class AuditTaskMetadata extends S.Class<AuditTaskMetadata>(
  "AuditTaskMetadata",
)({
  taskId: S.optional(S.String),
  taskStatus: S.optional(S.String),
  taskType: S.optional(S.String),
}) {}
export const AuditTaskMetadataList = S.Array(AuditTaskMetadata);
export class AuthorizerSummary extends S.Class<AuthorizerSummary>(
  "AuthorizerSummary",
)({
  authorizerName: S.optional(S.String),
  authorizerArn: S.optional(S.String),
}) {}
export const Authorizers = S.Array(AuthorizerSummary);
export const BillingGroupNameAndArnList = S.Array(GroupNameAndArn);
export class CACertificate extends S.Class<CACertificate>("CACertificate")({
  certificateArn: S.optional(S.String),
  certificateId: S.optional(S.String),
  status: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const CACertificates = S.Array(CACertificate);
export class CertificateProviderSummary extends S.Class<CertificateProviderSummary>(
  "CertificateProviderSummary",
)({
  certificateProviderName: S.optional(S.String),
  certificateProviderArn: S.optional(S.String),
}) {}
export const CertificateProviders = S.Array(CertificateProviderSummary);
export class CommandSummary extends S.Class<CommandSummary>("CommandSummary")({
  commandArn: S.optional(S.String),
  commandId: S.optional(S.String),
  displayName: S.optional(S.String),
  deprecated: S.optional(S.Boolean),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  pendingDeletion: S.optional(S.Boolean),
}) {}
export const CommandSummaryList = S.Array(CommandSummary);
export class DetectMitigationActionExecution extends S.Class<DetectMitigationActionExecution>(
  "DetectMitigationActionExecution",
)({
  taskId: S.optional(S.String),
  violationId: S.optional(S.String),
  actionName: S.optional(S.String),
  thingName: S.optional(S.String),
  executionStartDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  executionEndDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
  errorCode: S.optional(S.String),
  message: S.optional(S.String),
}) {}
export const DetectMitigationActionExecutionList = S.Array(
  DetectMitigationActionExecution,
);
export class DomainConfigurationSummary extends S.Class<DomainConfigurationSummary>(
  "DomainConfigurationSummary",
)({
  domainConfigurationName: S.optional(S.String),
  domainConfigurationArn: S.optional(S.String),
  serviceType: S.optional(S.String),
}) {}
export const DomainConfigurations = S.Array(DomainConfigurationSummary);
export class FleetMetricNameAndArn extends S.Class<FleetMetricNameAndArn>(
  "FleetMetricNameAndArn",
)({ metricName: S.optional(S.String), metricArn: S.optional(S.String) }) {}
export const FleetMetricNameAndArnList = S.Array(FleetMetricNameAndArn);
export class JobExecutionSummary extends S.Class<JobExecutionSummary>(
  "JobExecutionSummary",
)({
  status: S.optional(S.String),
  queuedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  executionNumber: S.optional(S.Number),
  retryAttempt: S.optional(S.Number),
}) {}
export class JobExecutionSummaryForThing extends S.Class<JobExecutionSummaryForThing>(
  "JobExecutionSummaryForThing",
)({
  jobId: S.optional(S.String),
  jobExecutionSummary: S.optional(JobExecutionSummary),
}) {}
export const JobExecutionSummaryForThingList = S.Array(
  JobExecutionSummaryForThing,
);
export class JobSummary extends S.Class<JobSummary>("JobSummary")({
  jobArn: S.optional(S.String),
  jobId: S.optional(S.String),
  thingGroupId: S.optional(S.String),
  targetSelection: S.optional(S.String),
  status: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  completedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  isConcurrent: S.optional(S.Boolean),
}) {}
export const JobSummaryList = S.Array(JobSummary);
export class JobTemplateSummary extends S.Class<JobTemplateSummary>(
  "JobTemplateSummary",
)({
  jobTemplateArn: S.optional(S.String),
  jobTemplateId: S.optional(S.String),
  description: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const JobTemplateSummaryList = S.Array(JobTemplateSummary);
export class ManagedJobTemplateSummary extends S.Class<ManagedJobTemplateSummary>(
  "ManagedJobTemplateSummary",
)({
  templateArn: S.optional(S.String),
  templateName: S.optional(S.String),
  description: S.optional(S.String),
  environments: S.optional(Environments),
  templateVersion: S.optional(S.String),
}) {}
export const ManagedJobTemplatesSummaryList = S.Array(
  ManagedJobTemplateSummary,
);
export class MetricDatum extends S.Class<MetricDatum>("MetricDatum")({
  timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  value: S.optional(MetricValue),
}) {}
export const MetricDatumList = S.Array(MetricDatum);
export class MitigationActionIdentifier extends S.Class<MitigationActionIdentifier>(
  "MitigationActionIdentifier",
)({
  actionName: S.optional(S.String),
  actionArn: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const MitigationActionIdentifierList = S.Array(
  MitigationActionIdentifier,
);
export class OTAUpdateSummary extends S.Class<OTAUpdateSummary>(
  "OTAUpdateSummary",
)({
  otaUpdateId: S.optional(S.String),
  otaUpdateArn: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const OTAUpdatesSummary = S.Array(OTAUpdateSummary);
export class OutgoingCertificate extends S.Class<OutgoingCertificate>(
  "OutgoingCertificate",
)({
  certificateArn: S.optional(S.String),
  certificateId: S.optional(S.String),
  transferredTo: S.optional(S.String),
  transferDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  transferMessage: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const OutgoingCertificates = S.Array(OutgoingCertificate);
export class PackageSummary extends S.Class<PackageSummary>("PackageSummary")({
  packageName: S.optional(S.String),
  defaultVersionName: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const PackageSummaryList = S.Array(PackageSummary);
export class PackageVersionSummary extends S.Class<PackageVersionSummary>(
  "PackageVersionSummary",
)({
  packageName: S.optional(S.String),
  versionName: S.optional(S.String),
  status: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const PackageVersionSummaryList = S.Array(PackageVersionSummary);
export class PolicyVersion extends S.Class<PolicyVersion>("PolicyVersion")({
  versionId: S.optional(S.String),
  isDefaultVersion: S.optional(S.Boolean),
  createDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const PolicyVersions = S.Array(PolicyVersion);
export class PrincipalThingObject extends S.Class<PrincipalThingObject>(
  "PrincipalThingObject",
)({ thingName: S.String, thingPrincipalType: S.optional(S.String) }) {}
export const PrincipalThingObjects = S.Array(PrincipalThingObject);
export class ProvisioningTemplateSummary extends S.Class<ProvisioningTemplateSummary>(
  "ProvisioningTemplateSummary",
)({
  templateArn: S.optional(S.String),
  templateName: S.optional(S.String),
  description: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  enabled: S.optional(S.Boolean),
  type: S.optional(S.String),
}) {}
export const ProvisioningTemplateListing = S.Array(ProvisioningTemplateSummary);
export class ProvisioningTemplateVersionSummary extends S.Class<ProvisioningTemplateVersionSummary>(
  "ProvisioningTemplateVersionSummary",
)({
  versionId: S.optional(S.Number),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  isDefaultVersion: S.optional(S.Boolean),
}) {}
export const ProvisioningTemplateVersionListing = S.Array(
  ProvisioningTemplateVersionSummary,
);
export class SbomValidationResultSummary extends S.Class<SbomValidationResultSummary>(
  "SbomValidationResultSummary",
)({
  fileName: S.optional(S.String),
  validationResult: S.optional(S.String),
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const SbomValidationResultSummaryList = S.Array(
  SbomValidationResultSummary,
);
export class ScheduledAuditMetadata extends S.Class<ScheduledAuditMetadata>(
  "ScheduledAuditMetadata",
)({
  scheduledAuditName: S.optional(S.String),
  scheduledAuditArn: S.optional(S.String),
  frequency: S.optional(S.String),
  dayOfMonth: S.optional(S.String),
  dayOfWeek: S.optional(S.String),
}) {}
export const ScheduledAuditMetadataList = S.Array(ScheduledAuditMetadata);
export class SecurityProfileIdentifier extends S.Class<SecurityProfileIdentifier>(
  "SecurityProfileIdentifier",
)({ name: S.String, arn: S.String }) {}
export const SecurityProfileIdentifiers = S.Array(SecurityProfileIdentifier);
export class SecurityProfileTarget extends S.Class<SecurityProfileTarget>(
  "SecurityProfileTarget",
)({ arn: S.String }) {}
export class SecurityProfileTargetMapping extends S.Class<SecurityProfileTargetMapping>(
  "SecurityProfileTargetMapping",
)({
  securityProfileIdentifier: S.optional(SecurityProfileIdentifier),
  target: S.optional(SecurityProfileTarget),
}) {}
export const SecurityProfileTargetMappings = S.Array(
  SecurityProfileTargetMapping,
);
export class StreamSummary extends S.Class<StreamSummary>("StreamSummary")({
  streamId: S.optional(S.String),
  streamArn: S.optional(S.String),
  streamVersion: S.optional(S.Number),
  description: S.optional(S.String),
}) {}
export const StreamsSummary = S.Array(StreamSummary);
export const SecurityProfileTargets = S.Array(SecurityProfileTarget);
export class ThingPrincipalObject extends S.Class<ThingPrincipalObject>(
  "ThingPrincipalObject",
)({ principal: S.String, thingPrincipalType: S.optional(S.String) }) {}
export const ThingPrincipalObjects = S.Array(ThingPrincipalObject);
export class ThingAttribute extends S.Class<ThingAttribute>("ThingAttribute")({
  thingName: S.optional(S.String),
  thingTypeName: S.optional(S.String),
  thingArn: S.optional(S.String),
  attributes: S.optional(Attributes),
  version: S.optional(S.Number),
}) {}
export const ThingAttributeList = S.Array(ThingAttribute);
export class ThingTypeDefinition extends S.Class<ThingTypeDefinition>(
  "ThingTypeDefinition",
)({
  thingTypeName: S.optional(S.String),
  thingTypeArn: S.optional(S.String),
  thingTypeProperties: S.optional(ThingTypeProperties),
  thingTypeMetadata: S.optional(ThingTypeMetadata),
}) {}
export const ThingTypeList = S.Array(ThingTypeDefinition);
export class TopicRuleListItem extends S.Class<TopicRuleListItem>(
  "TopicRuleListItem",
)({
  ruleArn: S.optional(S.String),
  ruleName: S.optional(S.String),
  topicPattern: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ruleDisabled: S.optional(S.Boolean),
}) {}
export const TopicRuleList = S.Array(TopicRuleListItem);
export class LogTargetConfiguration extends S.Class<LogTargetConfiguration>(
  "LogTargetConfiguration",
)({ logTarget: S.optional(LogTarget), logLevel: S.optional(S.String) }) {}
export const LogTargetConfigurations = S.Array(LogTargetConfiguration);
export class ViolationEventAdditionalInfo extends S.Class<ViolationEventAdditionalInfo>(
  "ViolationEventAdditionalInfo",
)({ confidenceLevel: S.optional(S.String) }) {}
export class ViolationEvent extends S.Class<ViolationEvent>("ViolationEvent")({
  violationId: S.optional(S.String),
  thingName: S.optional(S.String),
  securityProfileName: S.optional(S.String),
  behavior: S.optional(Behavior),
  metricValue: S.optional(MetricValue),
  violationEventAdditionalInfo: S.optional(ViolationEventAdditionalInfo),
  violationEventType: S.optional(S.String),
  verificationState: S.optional(S.String),
  verificationStateDescription: S.optional(S.String),
  violationEventTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const ViolationEvents = S.Array(ViolationEvent);
export class ThingGroupDocument extends S.Class<ThingGroupDocument>(
  "ThingGroupDocument",
)({
  thingGroupName: S.optional(S.String),
  thingGroupId: S.optional(S.String),
  thingGroupDescription: S.optional(S.String),
  attributes: S.optional(Attributes),
  parentGroupNames: S.optional(ThingGroupNameList),
}) {}
export const ThingGroupDocumentList = S.Array(ThingGroupDocument);
export class AuditMitigationActionsTaskTarget extends S.Class<AuditMitigationActionsTaskTarget>(
  "AuditMitigationActionsTaskTarget",
)({
  auditTaskId: S.optional(S.String),
  findingIds: S.optional(FindingIds),
  auditCheckToReasonCodeFilter: S.optional(AuditCheckToReasonCodeFilter),
}) {}
export class HttpContext extends S.Class<HttpContext>("HttpContext")({
  headers: S.optional(HttpHeaders),
  queryString: S.optional(S.String),
}) {}
export class ValidationError extends S.Class<ValidationError>(
  "ValidationError",
)({ errorMessage: S.optional(S.String) }) {}
export const ValidationErrors = S.Array(ValidationError);
export class AwsJobRateIncreaseCriteria extends S.Class<AwsJobRateIncreaseCriteria>(
  "AwsJobRateIncreaseCriteria",
)({
  numberOfNotifiedThings: S.optional(S.Number),
  numberOfSucceededThings: S.optional(S.Number),
}) {}
export class Stream extends S.Class<Stream>("Stream")({
  streamId: S.optional(S.String),
  fileId: S.optional(S.Number),
}) {}
export const ProcessingTargetNameList = S.Array(S.String);
export class AssociateSbomWithPackageVersionRequest extends S.Class<AssociateSbomWithPackageVersionRequest>(
  "AssociateSbomWithPackageVersionRequest",
)(
  {
    packageName: S.String.pipe(T.HttpLabel()),
    versionName: S.String.pipe(T.HttpLabel()),
    sbom: Sbom,
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/packages/{packageName}/versions/{versionName}/sbom",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAuditSuppressionRequest extends S.Class<CreateAuditSuppressionRequest>(
  "CreateAuditSuppressionRequest",
)(
  {
    checkName: S.String,
    resourceIdentifier: ResourceIdentifier,
    expirationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    suppressIndefinitely: S.optional(S.Boolean),
    description: S.optional(S.String),
    clientRequestToken: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/audit/suppressions/create" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAuditSuppressionResponse extends S.Class<CreateAuditSuppressionResponse>(
  "CreateAuditSuppressionResponse",
)({}) {}
export class CreateAuthorizerResponse extends S.Class<CreateAuthorizerResponse>(
  "CreateAuthorizerResponse",
)({
  authorizerName: S.optional(S.String),
  authorizerArn: S.optional(S.String),
}) {}
export class CreateBillingGroupResponse extends S.Class<CreateBillingGroupResponse>(
  "CreateBillingGroupResponse",
)({
  billingGroupName: S.optional(S.String),
  billingGroupArn: S.optional(S.String),
  billingGroupId: S.optional(S.String),
}) {}
export class CreateDomainConfigurationResponse extends S.Class<CreateDomainConfigurationResponse>(
  "CreateDomainConfigurationResponse",
)({
  domainConfigurationName: S.optional(S.String),
  domainConfigurationArn: S.optional(S.String),
}) {}
export class CreateDynamicThingGroupResponse extends S.Class<CreateDynamicThingGroupResponse>(
  "CreateDynamicThingGroupResponse",
)({
  thingGroupName: S.optional(S.String),
  thingGroupArn: S.optional(S.String),
  thingGroupId: S.optional(S.String),
  indexName: S.optional(S.String),
  queryString: S.optional(S.String),
  queryVersion: S.optional(S.String),
}) {}
export class CreateFleetMetricResponse extends S.Class<CreateFleetMetricResponse>(
  "CreateFleetMetricResponse",
)({ metricName: S.optional(S.String), metricArn: S.optional(S.String) }) {}
export class CreateJobTemplateResponse extends S.Class<CreateJobTemplateResponse>(
  "CreateJobTemplateResponse",
)({
  jobTemplateArn: S.optional(S.String),
  jobTemplateId: S.optional(S.String),
}) {}
export class CreateKeysAndCertificateResponse extends S.Class<CreateKeysAndCertificateResponse>(
  "CreateKeysAndCertificateResponse",
)({
  certificateArn: S.optional(S.String),
  certificateId: S.optional(S.String),
  certificatePem: S.optional(S.String),
  keyPair: S.optional(KeyPair),
}) {}
export class CreateMitigationActionRequest extends S.Class<CreateMitigationActionRequest>(
  "CreateMitigationActionRequest",
)(
  {
    actionName: S.String.pipe(T.HttpLabel()),
    roleArn: S.String,
    actionParams: MitigationActionParams,
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/mitigationactions/actions/{actionName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePackageResponse extends S.Class<CreatePackageResponse>(
  "CreatePackageResponse",
)({
  packageName: S.optional(S.String),
  packageArn: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export class CreatePackageVersionResponse extends S.Class<CreatePackageVersionResponse>(
  "CreatePackageVersionResponse",
)({
  packageVersionArn: S.optional(S.String),
  packageName: S.optional(S.String),
  versionName: S.optional(S.String),
  description: S.optional(S.String),
  attributes: S.optional(ResourceAttributes),
  status: S.optional(S.String),
  errorReason: S.optional(S.String),
}) {}
export class CreateProvisioningTemplateResponse extends S.Class<CreateProvisioningTemplateResponse>(
  "CreateProvisioningTemplateResponse",
)({
  templateArn: S.optional(S.String),
  templateName: S.optional(S.String),
  defaultVersionId: S.optional(S.Number),
}) {}
export class CreateStreamResponse extends S.Class<CreateStreamResponse>(
  "CreateStreamResponse",
)({
  streamId: S.optional(S.String),
  streamArn: S.optional(S.String),
  description: S.optional(S.String),
  streamVersion: S.optional(S.Number),
}) {}
export class CreateThingRequest extends S.Class<CreateThingRequest>(
  "CreateThingRequest",
)(
  {
    thingName: S.String.pipe(T.HttpLabel()),
    thingTypeName: S.optional(S.String),
    attributePayload: S.optional(AttributePayload),
    billingGroupName: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/things/{thingName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTopicRuleDestinationRequest extends S.Class<CreateTopicRuleDestinationRequest>(
  "CreateTopicRuleDestinationRequest",
)(
  { destinationConfiguration: TopicRuleDestinationConfiguration },
  T.all(
    T.Http({ method: "POST", uri: "/destinations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeBillingGroupResponse extends S.Class<DescribeBillingGroupResponse>(
  "DescribeBillingGroupResponse",
)({
  billingGroupName: S.optional(S.String),
  billingGroupId: S.optional(S.String),
  billingGroupArn: S.optional(S.String),
  version: S.optional(S.Number),
  billingGroupProperties: S.optional(BillingGroupProperties),
  billingGroupMetadata: S.optional(BillingGroupMetadata),
}) {}
export class DescribeDomainConfigurationResponse extends S.Class<DescribeDomainConfigurationResponse>(
  "DescribeDomainConfigurationResponse",
)({
  domainConfigurationName: S.optional(S.String),
  domainConfigurationArn: S.optional(S.String),
  domainName: S.optional(S.String),
  serverCertificates: S.optional(ServerCertificates),
  authorizerConfig: S.optional(AuthorizerConfig),
  domainConfigurationStatus: S.optional(S.String),
  serviceType: S.optional(S.String),
  domainType: S.optional(S.String),
  lastStatusChangeDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  tlsConfig: S.optional(TlsConfig),
  serverCertificateConfig: S.optional(ServerCertificateConfig),
  authenticationType: S.optional(S.String),
  applicationProtocol: S.optional(S.String),
  clientCertificateConfig: S.optional(ClientCertificateConfig),
}) {}
export class DescribeEventConfigurationsResponse extends S.Class<DescribeEventConfigurationsResponse>(
  "DescribeEventConfigurationsResponse",
)({
  eventConfigurations: S.optional(EventConfigurations),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DescribeManagedJobTemplateResponse extends S.Class<DescribeManagedJobTemplateResponse>(
  "DescribeManagedJobTemplateResponse",
)({
  templateName: S.optional(S.String),
  templateArn: S.optional(S.String),
  description: S.optional(S.String),
  templateVersion: S.optional(S.String),
  environments: S.optional(Environments),
  documentParameters: S.optional(DocumentParameters),
  document: S.optional(S.String),
}) {}
export class DescribeRoleAliasResponse extends S.Class<DescribeRoleAliasResponse>(
  "DescribeRoleAliasResponse",
)({ roleAliasDescription: S.optional(RoleAliasDescription) }) {}
export class DescribeStreamResponse extends S.Class<DescribeStreamResponse>(
  "DescribeStreamResponse",
)({ streamInfo: S.optional(StreamInfo) }) {}
export class DescribeThingGroupResponse extends S.Class<DescribeThingGroupResponse>(
  "DescribeThingGroupResponse",
)({
  thingGroupName: S.optional(S.String),
  thingGroupId: S.optional(S.String),
  thingGroupArn: S.optional(S.String),
  version: S.optional(S.Number),
  thingGroupProperties: S.optional(ThingGroupProperties),
  thingGroupMetadata: S.optional(ThingGroupMetadata),
  indexName: S.optional(S.String),
  queryString: S.optional(S.String),
  queryVersion: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export class DescribeThingTypeResponse extends S.Class<DescribeThingTypeResponse>(
  "DescribeThingTypeResponse",
)({
  thingTypeName: S.optional(S.String),
  thingTypeId: S.optional(S.String),
  thingTypeArn: S.optional(S.String),
  thingTypeProperties: S.optional(ThingTypeProperties),
  thingTypeMetadata: S.optional(ThingTypeMetadata),
}) {}
export class GetBehaviorModelTrainingSummariesResponse extends S.Class<GetBehaviorModelTrainingSummariesResponse>(
  "GetBehaviorModelTrainingSummariesResponse",
)({
  summaries: S.optional(BehaviorModelTrainingSummaries),
  nextToken: S.optional(S.String),
}) {}
export class GetBucketsAggregationRequest extends S.Class<GetBucketsAggregationRequest>(
  "GetBucketsAggregationRequest",
)(
  {
    indexName: S.optional(S.String),
    queryString: S.String,
    aggregationField: S.String,
    queryVersion: S.optional(S.String),
    bucketsAggregationType: BucketsAggregationType,
  },
  T.all(
    T.Http({ method: "POST", uri: "/indices/buckets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEffectivePoliciesResponse extends S.Class<GetEffectivePoliciesResponse>(
  "GetEffectivePoliciesResponse",
)({ effectivePolicies: S.optional(EffectivePolicies) }) {}
export class GetPercentilesResponse extends S.Class<GetPercentilesResponse>(
  "GetPercentilesResponse",
)({ percentiles: S.optional(Percentiles) }) {}
export class GetStatisticsResponse extends S.Class<GetStatisticsResponse>(
  "GetStatisticsResponse",
)({ statistics: S.optional(Statistics) }) {}
export class GetTopicRuleResponse extends S.Class<GetTopicRuleResponse>(
  "GetTopicRuleResponse",
)({ ruleArn: S.optional(S.String), rule: S.optional(TopicRule) }) {}
export class ListAttachedPoliciesResponse extends S.Class<ListAttachedPoliciesResponse>(
  "ListAttachedPoliciesResponse",
)({ policies: S.optional(Policies), nextMarker: S.optional(S.String) }) {}
export class ListAuditMitigationActionsExecutionsResponse extends S.Class<ListAuditMitigationActionsExecutionsResponse>(
  "ListAuditMitigationActionsExecutionsResponse",
)({
  actionsExecutions: S.optional(AuditMitigationActionExecutionMetadataList),
  nextToken: S.optional(S.String),
}) {}
export class ListAuditMitigationActionsTasksResponse extends S.Class<ListAuditMitigationActionsTasksResponse>(
  "ListAuditMitigationActionsTasksResponse",
)({
  tasks: S.optional(AuditMitigationActionsTaskMetadataList),
  nextToken: S.optional(S.String),
}) {}
export class ListAuditSuppressionsResponse extends S.Class<ListAuditSuppressionsResponse>(
  "ListAuditSuppressionsResponse",
)({
  suppressions: S.optional(AuditSuppressionList),
  nextToken: S.optional(S.String),
}) {}
export class ListAuditTasksResponse extends S.Class<ListAuditTasksResponse>(
  "ListAuditTasksResponse",
)({
  tasks: S.optional(AuditTaskMetadataList),
  nextToken: S.optional(S.String),
}) {}
export class ListAuthorizersResponse extends S.Class<ListAuthorizersResponse>(
  "ListAuthorizersResponse",
)({ authorizers: S.optional(Authorizers), nextMarker: S.optional(S.String) }) {}
export class ListBillingGroupsResponse extends S.Class<ListBillingGroupsResponse>(
  "ListBillingGroupsResponse",
)({
  billingGroups: S.optional(BillingGroupNameAndArnList),
  nextToken: S.optional(S.String),
}) {}
export class ListCACertificatesResponse extends S.Class<ListCACertificatesResponse>(
  "ListCACertificatesResponse",
)({
  certificates: S.optional(CACertificates),
  nextMarker: S.optional(S.String),
}) {}
export class ListCertificateProvidersResponse extends S.Class<ListCertificateProvidersResponse>(
  "ListCertificateProvidersResponse",
)({
  certificateProviders: S.optional(CertificateProviders),
  nextToken: S.optional(S.String),
}) {}
export class ListCertificatesResponse extends S.Class<ListCertificatesResponse>(
  "ListCertificatesResponse",
)({
  certificates: S.optional(Certificates),
  nextMarker: S.optional(S.String),
}) {}
export class ListCommandsResponse extends S.Class<ListCommandsResponse>(
  "ListCommandsResponse",
)({
  commands: S.optional(CommandSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListDetectMitigationActionsExecutionsResponse extends S.Class<ListDetectMitigationActionsExecutionsResponse>(
  "ListDetectMitigationActionsExecutionsResponse",
)({
  actionsExecutions: S.optional(DetectMitigationActionExecutionList),
  nextToken: S.optional(S.String),
}) {}
export class ListDomainConfigurationsResponse extends S.Class<ListDomainConfigurationsResponse>(
  "ListDomainConfigurationsResponse",
)({
  domainConfigurations: S.optional(DomainConfigurations),
  nextMarker: S.optional(S.String),
}) {}
export class ListFleetMetricsResponse extends S.Class<ListFleetMetricsResponse>(
  "ListFleetMetricsResponse",
)({
  fleetMetrics: S.optional(FleetMetricNameAndArnList),
  nextToken: S.optional(S.String),
}) {}
export class ListJobExecutionsForThingResponse extends S.Class<ListJobExecutionsForThingResponse>(
  "ListJobExecutionsForThingResponse",
)({
  executionSummaries: S.optional(JobExecutionSummaryForThingList),
  nextToken: S.optional(S.String),
}) {}
export class ListJobsResponse extends S.Class<ListJobsResponse>(
  "ListJobsResponse",
)({ jobs: S.optional(JobSummaryList), nextToken: S.optional(S.String) }) {}
export class ListJobTemplatesResponse extends S.Class<ListJobTemplatesResponse>(
  "ListJobTemplatesResponse",
)({
  jobTemplates: S.optional(JobTemplateSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListManagedJobTemplatesResponse extends S.Class<ListManagedJobTemplatesResponse>(
  "ListManagedJobTemplatesResponse",
)({
  managedJobTemplates: S.optional(ManagedJobTemplatesSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListMetricValuesResponse extends S.Class<ListMetricValuesResponse>(
  "ListMetricValuesResponse",
)({
  metricDatumList: S.optional(MetricDatumList),
  nextToken: S.optional(S.String),
}) {}
export class ListMitigationActionsResponse extends S.Class<ListMitigationActionsResponse>(
  "ListMitigationActionsResponse",
)({
  actionIdentifiers: S.optional(MitigationActionIdentifierList),
  nextToken: S.optional(S.String),
}) {}
export class ListOTAUpdatesResponse extends S.Class<ListOTAUpdatesResponse>(
  "ListOTAUpdatesResponse",
)({
  otaUpdates: S.optional(OTAUpdatesSummary),
  nextToken: S.optional(S.String),
}) {}
export class ListOutgoingCertificatesResponse extends S.Class<ListOutgoingCertificatesResponse>(
  "ListOutgoingCertificatesResponse",
)({
  outgoingCertificates: S.optional(OutgoingCertificates),
  nextMarker: S.optional(S.String),
}) {}
export class ListPackagesResponse extends S.Class<ListPackagesResponse>(
  "ListPackagesResponse",
)({
  packageSummaries: S.optional(PackageSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListPackageVersionsResponse extends S.Class<ListPackageVersionsResponse>(
  "ListPackageVersionsResponse",
)({
  packageVersionSummaries: S.optional(PackageVersionSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListPolicyVersionsResponse extends S.Class<ListPolicyVersionsResponse>(
  "ListPolicyVersionsResponse",
)({ policyVersions: S.optional(PolicyVersions) }) {}
export class ListPrincipalThingsV2Response extends S.Class<ListPrincipalThingsV2Response>(
  "ListPrincipalThingsV2Response",
)({
  principalThingObjects: S.optional(PrincipalThingObjects),
  nextToken: S.optional(S.String),
}) {}
export class ListProvisioningTemplatesResponse extends S.Class<ListProvisioningTemplatesResponse>(
  "ListProvisioningTemplatesResponse",
)({
  templates: S.optional(ProvisioningTemplateListing),
  nextToken: S.optional(S.String),
}) {}
export class ListProvisioningTemplateVersionsResponse extends S.Class<ListProvisioningTemplateVersionsResponse>(
  "ListProvisioningTemplateVersionsResponse",
)({
  versions: S.optional(ProvisioningTemplateVersionListing),
  nextToken: S.optional(S.String),
}) {}
export class ListSbomValidationResultsResponse extends S.Class<ListSbomValidationResultsResponse>(
  "ListSbomValidationResultsResponse",
)({
  validationResultSummaries: S.optional(SbomValidationResultSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListScheduledAuditsResponse extends S.Class<ListScheduledAuditsResponse>(
  "ListScheduledAuditsResponse",
)({
  scheduledAudits: S.optional(ScheduledAuditMetadataList),
  nextToken: S.optional(S.String),
}) {}
export class ListSecurityProfilesResponse extends S.Class<ListSecurityProfilesResponse>(
  "ListSecurityProfilesResponse",
)({
  securityProfileIdentifiers: S.optional(SecurityProfileIdentifiers),
  nextToken: S.optional(S.String),
}) {}
export class ListSecurityProfilesForTargetResponse extends S.Class<ListSecurityProfilesForTargetResponse>(
  "ListSecurityProfilesForTargetResponse",
)({
  securityProfileTargetMappings: S.optional(SecurityProfileTargetMappings),
  nextToken: S.optional(S.String),
}) {}
export class ListStreamsResponse extends S.Class<ListStreamsResponse>(
  "ListStreamsResponse",
)({ streams: S.optional(StreamsSummary), nextToken: S.optional(S.String) }) {}
export class ListTargetsForSecurityProfileResponse extends S.Class<ListTargetsForSecurityProfileResponse>(
  "ListTargetsForSecurityProfileResponse",
)({
  securityProfileTargets: S.optional(SecurityProfileTargets),
  nextToken: S.optional(S.String),
}) {}
export class ListThingPrincipalsV2Response extends S.Class<ListThingPrincipalsV2Response>(
  "ListThingPrincipalsV2Response",
)({
  thingPrincipalObjects: S.optional(ThingPrincipalObjects),
  nextToken: S.optional(S.String),
}) {}
export class ListThingsResponse extends S.Class<ListThingsResponse>(
  "ListThingsResponse",
)({
  things: S.optional(ThingAttributeList),
  nextToken: S.optional(S.String),
}) {}
export class ListThingTypesResponse extends S.Class<ListThingTypesResponse>(
  "ListThingTypesResponse",
)({ thingTypes: S.optional(ThingTypeList), nextToken: S.optional(S.String) }) {}
export class ListTopicRulesResponse extends S.Class<ListTopicRulesResponse>(
  "ListTopicRulesResponse",
)({ rules: S.optional(TopicRuleList), nextToken: S.optional(S.String) }) {}
export class ListV2LoggingLevelsResponse extends S.Class<ListV2LoggingLevelsResponse>(
  "ListV2LoggingLevelsResponse",
)({
  logTargetConfigurations: S.optional(LogTargetConfigurations),
  nextToken: S.optional(S.String),
}) {}
export class ListViolationEventsResponse extends S.Class<ListViolationEventsResponse>(
  "ListViolationEventsResponse",
)({
  violationEvents: S.optional(ViolationEvents),
  nextToken: S.optional(S.String),
}) {}
export class RegisterCACertificateResponse extends S.Class<RegisterCACertificateResponse>(
  "RegisterCACertificateResponse",
)({
  certificateArn: S.optional(S.String),
  certificateId: S.optional(S.String),
}) {}
export class StartAuditMitigationActionsTaskRequest extends S.Class<StartAuditMitigationActionsTaskRequest>(
  "StartAuditMitigationActionsTaskRequest",
)(
  {
    taskId: S.String.pipe(T.HttpLabel()),
    target: AuditMitigationActionsTaskTarget,
    auditCheckToActionsMapping: AuditCheckToActionsMapping,
    clientRequestToken: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/audit/mitigationactions/tasks/{taskId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartDetectMitigationActionsTaskResponse extends S.Class<StartDetectMitigationActionsTaskResponse>(
  "StartDetectMitigationActionsTaskResponse",
)({ taskId: S.optional(S.String) }) {}
export class TestInvokeAuthorizerRequest extends S.Class<TestInvokeAuthorizerRequest>(
  "TestInvokeAuthorizerRequest",
)(
  {
    authorizerName: S.String.pipe(T.HttpLabel()),
    token: S.optional(S.String),
    tokenSignature: S.optional(S.String),
    httpContext: S.optional(HttpContext),
    mqttContext: S.optional(MqttContext),
    tlsContext: S.optional(TlsContext),
  },
  T.all(
    T.Http({ method: "POST", uri: "/authorizer/{authorizerName}/test" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ValidateSecurityProfileBehaviorsResponse extends S.Class<ValidateSecurityProfileBehaviorsResponse>(
  "ValidateSecurityProfileBehaviorsResponse",
)({
  valid: S.optional(S.Boolean),
  validationErrors: S.optional(ValidationErrors),
}) {}
export class AwsJobExponentialRolloutRate extends S.Class<AwsJobExponentialRolloutRate>(
  "AwsJobExponentialRolloutRate",
)({
  baseRatePerMinute: S.Number,
  incrementFactor: S.Number,
  rateIncreaseCriteria: AwsJobRateIncreaseCriteria,
}) {}
export class FileLocation extends S.Class<FileLocation>("FileLocation")({
  stream: S.optional(Stream),
  s3Location: S.optional(S3Location),
}) {}
export class TaskStatisticsForAuditCheck extends S.Class<TaskStatisticsForAuditCheck>(
  "TaskStatisticsForAuditCheck",
)({
  totalFindingsCount: S.optional(S.Number),
  failedFindingsCount: S.optional(S.Number),
  succeededFindingsCount: S.optional(S.Number),
  skippedFindingsCount: S.optional(S.Number),
  canceledFindingsCount: S.optional(S.Number),
}) {}
export class AuditCheckDetails extends S.Class<AuditCheckDetails>(
  "AuditCheckDetails",
)({
  checkRunStatus: S.optional(S.String),
  checkCompliant: S.optional(S.Boolean),
  totalResourcesCount: S.optional(S.Number),
  nonCompliantResourcesCount: S.optional(S.Number),
  suppressedNonCompliantResourcesCount: S.optional(S.Number),
  errorCode: S.optional(S.String),
  message: S.optional(S.String),
}) {}
export class CertificateValidity extends S.Class<CertificateValidity>(
  "CertificateValidity",
)({
  notBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  notAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class TransferData extends S.Class<TransferData>("TransferData")({
  transferMessage: S.optional(S.String),
  rejectReason: S.optional(S.String),
  transferDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  acceptDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  rejectDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class JobProcessDetails extends S.Class<JobProcessDetails>(
  "JobProcessDetails",
)({
  processingTargets: S.optional(ProcessingTargetNameList),
  numberOfCanceledThings: S.optional(S.Number),
  numberOfSucceededThings: S.optional(S.Number),
  numberOfFailedThings: S.optional(S.Number),
  numberOfRejectedThings: S.optional(S.Number),
  numberOfQueuedThings: S.optional(S.Number),
  numberOfInProgressThings: S.optional(S.Number),
  numberOfRemovedThings: S.optional(S.Number),
  numberOfTimedOutThings: S.optional(S.Number),
}) {}
export class ScheduledJobRollout extends S.Class<ScheduledJobRollout>(
  "ScheduledJobRollout",
)({ startTime: S.optional(S.String) }) {}
export const ScheduledJobRolloutList = S.Array(ScheduledJobRollout);
export class JobExecutionStatusDetails extends S.Class<JobExecutionStatusDetails>(
  "JobExecutionStatusDetails",
)({ detailsMap: S.optional(DetailsMap) }) {}
export class CommandExecutionResult extends S.Class<CommandExecutionResult>(
  "CommandExecutionResult",
)({
  S: S.optional(S.String),
  B: S.optional(S.Boolean),
  BIN: S.optional(T.Blob),
}) {}
export class ErrorInfo extends S.Class<ErrorInfo>("ErrorInfo")({
  code: S.optional(S.String),
  message: S.optional(S.String),
}) {}
export class HttpUrlDestinationProperties extends S.Class<HttpUrlDestinationProperties>(
  "HttpUrlDestinationProperties",
)({ confirmationUrl: S.optional(S.String) }) {}
export class VpcDestinationProperties extends S.Class<VpcDestinationProperties>(
  "VpcDestinationProperties",
)({
  subnetIds: S.optional(SubnetIdList),
  securityGroups: S.optional(SecurityGroupList),
  vpcId: S.optional(S.String),
  roleArn: S.optional(S.String),
}) {}
export class HttpUrlDestinationSummary extends S.Class<HttpUrlDestinationSummary>(
  "HttpUrlDestinationSummary",
)({ confirmationUrl: S.optional(S.String) }) {}
export class VpcDestinationSummary extends S.Class<VpcDestinationSummary>(
  "VpcDestinationSummary",
)({
  subnetIds: S.optional(SubnetIdList),
  securityGroups: S.optional(SecurityGroupList),
  vpcId: S.optional(S.String),
  roleArn: S.optional(S.String),
}) {}
export class ThingConnectivity extends S.Class<ThingConnectivity>(
  "ThingConnectivity",
)({
  connected: S.optional(S.Boolean),
  timestamp: S.optional(S.Number),
  disconnectReason: S.optional(S.String),
}) {}
export const MissingContextValues = S.Array(S.String);
export class SigningProfileParameter extends S.Class<SigningProfileParameter>(
  "SigningProfileParameter",
)({
  certificateArn: S.optional(S.String),
  platform: S.optional(S.String),
  certificatePathOnDevice: S.optional(S.String),
}) {}
export class CodeSigningSignature extends S.Class<CodeSigningSignature>(
  "CodeSigningSignature",
)({ inlineDocument: S.optional(T.Blob) }) {}
export class CodeSigningCertificateChain extends S.Class<CodeSigningCertificateChain>(
  "CodeSigningCertificateChain",
)({
  certificateName: S.optional(S.String),
  inlineDocument: S.optional(S.String),
}) {}
export class AwsJobExecutionsRolloutConfig extends S.Class<AwsJobExecutionsRolloutConfig>(
  "AwsJobExecutionsRolloutConfig",
)({
  maximumPerMinute: S.optional(S.Number),
  exponentialRate: S.optional(AwsJobExponentialRolloutRate),
}) {}
export const AuditMitigationActionsTaskStatistics = S.Record({
  key: S.String,
  value: TaskStatisticsForAuditCheck,
});
export const AuditDetails = S.Record({
  key: S.String,
  value: AuditCheckDetails,
});
export class CACertificateDescription extends S.Class<CACertificateDescription>(
  "CACertificateDescription",
)({
  certificateArn: S.optional(S.String),
  certificateId: S.optional(S.String),
  status: S.optional(S.String),
  certificatePem: S.optional(S.String),
  ownedBy: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  autoRegistrationStatus: S.optional(S.String),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  customerVersion: S.optional(S.Number),
  generationId: S.optional(S.String),
  validity: S.optional(CertificateValidity),
  certificateMode: S.optional(S.String),
}) {}
export class CertificateDescription extends S.Class<CertificateDescription>(
  "CertificateDescription",
)({
  certificateArn: S.optional(S.String),
  certificateId: S.optional(S.String),
  caCertificateId: S.optional(S.String),
  status: S.optional(S.String),
  certificatePem: S.optional(S.String),
  ownedBy: S.optional(S.String),
  previousOwnedBy: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  customerVersion: S.optional(S.Number),
  transferData: S.optional(TransferData),
  generationId: S.optional(S.String),
  validity: S.optional(CertificateValidity),
  certificateMode: S.optional(S.String),
}) {}
export class Job extends S.Class<Job>("Job")({
  jobArn: S.optional(S.String),
  jobId: S.optional(S.String),
  targetSelection: S.optional(S.String),
  status: S.optional(S.String),
  forceCanceled: S.optional(S.Boolean),
  reasonCode: S.optional(S.String),
  comment: S.optional(S.String),
  targets: S.optional(JobTargets),
  description: S.optional(S.String),
  presignedUrlConfig: S.optional(PresignedUrlConfig),
  jobExecutionsRolloutConfig: S.optional(JobExecutionsRolloutConfig),
  abortConfig: S.optional(AbortConfig),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  completedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  jobProcessDetails: S.optional(JobProcessDetails),
  timeoutConfig: S.optional(TimeoutConfig),
  namespaceId: S.optional(S.String),
  jobTemplateArn: S.optional(S.String),
  jobExecutionsRetryConfig: S.optional(JobExecutionsRetryConfig),
  documentParameters: S.optional(ParameterMap),
  isConcurrent: S.optional(S.Boolean),
  schedulingConfig: S.optional(SchedulingConfig),
  scheduledJobRollouts: S.optional(ScheduledJobRolloutList),
  destinationPackageVersions: S.optional(DestinationPackageVersions),
}) {}
export class JobExecution extends S.Class<JobExecution>("JobExecution")({
  jobId: S.optional(S.String),
  status: S.optional(S.String),
  forceCanceled: S.optional(S.Boolean),
  statusDetails: S.optional(JobExecutionStatusDetails),
  thingArn: S.optional(S.String),
  queuedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  executionNumber: S.optional(S.Number),
  versionNumber: S.optional(S.Number),
  approximateSecondsBeforeTimedOut: S.optional(S.Number),
}) {}
export const CommandExecutionResultMap = S.Record({
  key: S.String,
  value: CommandExecutionResult,
});
export class S3Destination extends S.Class<S3Destination>("S3Destination")({
  bucket: S.optional(S.String),
  prefix: S.optional(S.String),
}) {}
export class Destination extends S.Class<Destination>("Destination")({
  s3Destination: S.optional(S3Destination),
}) {}
export class StartSigningJobParameter extends S.Class<StartSigningJobParameter>(
  "StartSigningJobParameter",
)({
  signingProfileParameter: S.optional(SigningProfileParameter),
  signingProfileName: S.optional(S.String),
  destination: S.optional(Destination),
}) {}
export class CustomCodeSigning extends S.Class<CustomCodeSigning>(
  "CustomCodeSigning",
)({
  signature: S.optional(CodeSigningSignature),
  certificateChain: S.optional(CodeSigningCertificateChain),
  hashAlgorithm: S.optional(S.String),
  signatureAlgorithm: S.optional(S.String),
}) {}
export class CodeSigning extends S.Class<CodeSigning>("CodeSigning")({
  awsSignerJobId: S.optional(S.String),
  startSigningJobParameter: S.optional(StartSigningJobParameter),
  customCodeSigning: S.optional(CustomCodeSigning),
}) {}
export class OTAUpdateFile extends S.Class<OTAUpdateFile>("OTAUpdateFile")({
  fileName: S.optional(S.String),
  fileType: S.optional(S.Number),
  fileVersion: S.optional(S.String),
  fileLocation: S.optional(FileLocation),
  codeSigning: S.optional(CodeSigning),
  attributes: S.optional(AttributesMap),
}) {}
export const OTAUpdateFiles = S.Array(OTAUpdateFile);
export class OTAUpdateInfo extends S.Class<OTAUpdateInfo>("OTAUpdateInfo")({
  otaUpdateId: S.optional(S.String),
  otaUpdateArn: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  description: S.optional(S.String),
  targets: S.optional(Targets),
  protocols: S.optional(Protocols),
  awsJobExecutionsRolloutConfig: S.optional(AwsJobExecutionsRolloutConfig),
  awsJobPresignedUrlConfig: S.optional(AwsJobPresignedUrlConfig),
  targetSelection: S.optional(S.String),
  otaUpdateFiles: S.optional(OTAUpdateFiles),
  otaUpdateStatus: S.optional(S.String),
  awsIotJobId: S.optional(S.String),
  awsIotJobArn: S.optional(S.String),
  errorInfo: S.optional(ErrorInfo),
  additionalParameters: S.optional(AdditionalParameterMap),
}) {}
export class TopicRuleDestination extends S.Class<TopicRuleDestination>(
  "TopicRuleDestination",
)({
  arn: S.optional(S.String),
  status: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  statusReason: S.optional(S.String),
  httpUrlProperties: S.optional(HttpUrlDestinationProperties),
  vpcProperties: S.optional(VpcDestinationProperties),
}) {}
export class ActiveViolation extends S.Class<ActiveViolation>(
  "ActiveViolation",
)({
  violationId: S.optional(S.String),
  thingName: S.optional(S.String),
  securityProfileName: S.optional(S.String),
  behavior: S.optional(Behavior),
  lastViolationValue: S.optional(MetricValue),
  violationEventAdditionalInfo: S.optional(ViolationEventAdditionalInfo),
  verificationState: S.optional(S.String),
  verificationStateDescription: S.optional(S.String),
  lastViolationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  violationStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const ActiveViolations = S.Array(ActiveViolation);
export class CommandExecutionSummary extends S.Class<CommandExecutionSummary>(
  "CommandExecutionSummary",
)({
  commandArn: S.optional(S.String),
  executionId: S.optional(S.String),
  targetArn: S.optional(S.String),
  status: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  completedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const CommandExecutionSummaryList = S.Array(CommandExecutionSummary);
export class JobExecutionSummaryForJob extends S.Class<JobExecutionSummaryForJob>(
  "JobExecutionSummaryForJob",
)({
  thingArn: S.optional(S.String),
  jobExecutionSummary: S.optional(JobExecutionSummary),
}) {}
export const JobExecutionSummaryForJobList = S.Array(JobExecutionSummaryForJob);
export class TopicRuleDestinationSummary extends S.Class<TopicRuleDestinationSummary>(
  "TopicRuleDestinationSummary",
)({
  arn: S.optional(S.String),
  status: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  statusReason: S.optional(S.String),
  httpUrlSummary: S.optional(HttpUrlDestinationSummary),
  vpcDestinationSummary: S.optional(VpcDestinationSummary),
}) {}
export const TopicRuleDestinationSummaries = S.Array(
  TopicRuleDestinationSummary,
);
export const ResourceArns = S.Record({ key: S.String, value: S.String });
export class ThingDocument extends S.Class<ThingDocument>("ThingDocument")({
  thingName: S.optional(S.String),
  thingId: S.optional(S.String),
  thingTypeName: S.optional(S.String),
  thingGroupNames: S.optional(ThingGroupNameList),
  attributes: S.optional(Attributes),
  shadow: S.optional(S.String),
  deviceDefender: S.optional(S.String),
  connectivity: S.optional(ThingConnectivity),
}) {}
export const ThingDocumentList = S.Array(ThingDocument);
export const PolicyDocuments = S.Array(S.String);
export class AssociateSbomWithPackageVersionResponse extends S.Class<AssociateSbomWithPackageVersionResponse>(
  "AssociateSbomWithPackageVersionResponse",
)({
  packageName: S.optional(S.String),
  versionName: S.optional(S.String),
  sbom: S.optional(Sbom),
  sbomValidationStatus: S.optional(S.String),
}) {}
export class CreateJobRequest extends S.Class<CreateJobRequest>(
  "CreateJobRequest",
)(
  {
    jobId: S.String.pipe(T.HttpLabel()),
    targets: JobTargets,
    documentSource: S.optional(S.String),
    document: S.optional(S.String),
    description: S.optional(S.String),
    presignedUrlConfig: S.optional(PresignedUrlConfig),
    targetSelection: S.optional(S.String),
    jobExecutionsRolloutConfig: S.optional(JobExecutionsRolloutConfig),
    abortConfig: S.optional(AbortConfig),
    timeoutConfig: S.optional(TimeoutConfig),
    tags: S.optional(TagList),
    namespaceId: S.optional(S.String),
    jobTemplateArn: S.optional(S.String),
    jobExecutionsRetryConfig: S.optional(JobExecutionsRetryConfig),
    documentParameters: S.optional(ParameterMap),
    schedulingConfig: S.optional(SchedulingConfig),
    destinationPackageVersions: S.optional(DestinationPackageVersions),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/jobs/{jobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMitigationActionResponse extends S.Class<CreateMitigationActionResponse>(
  "CreateMitigationActionResponse",
)({ actionArn: S.optional(S.String), actionId: S.optional(S.String) }) {}
export class CreateSecurityProfileRequest extends S.Class<CreateSecurityProfileRequest>(
  "CreateSecurityProfileRequest",
)(
  {
    securityProfileName: S.String.pipe(T.HttpLabel()),
    securityProfileDescription: S.optional(S.String),
    behaviors: S.optional(Behaviors),
    alertTargets: S.optional(AlertTargets),
    additionalMetricsToRetain: S.optional(AdditionalMetricsToRetainList),
    additionalMetricsToRetainV2: S.optional(AdditionalMetricsToRetainV2List),
    tags: S.optional(TagList),
    metricsExportConfig: S.optional(MetricsExportConfig),
  },
  T.all(
    T.Http({ method: "POST", uri: "/security-profiles/{securityProfileName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateThingResponse extends S.Class<CreateThingResponse>(
  "CreateThingResponse",
)({
  thingName: S.optional(S.String),
  thingArn: S.optional(S.String),
  thingId: S.optional(S.String),
}) {}
export class CreateThingTypeRequest extends S.Class<CreateThingTypeRequest>(
  "CreateThingTypeRequest",
)(
  {
    thingTypeName: S.String.pipe(T.HttpLabel()),
    thingTypeProperties: S.optional(ThingTypeProperties),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/thing-types/{thingTypeName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTopicRuleDestinationResponse extends S.Class<CreateTopicRuleDestinationResponse>(
  "CreateTopicRuleDestinationResponse",
)({ topicRuleDestination: S.optional(TopicRuleDestination) }) {}
export class DescribeAccountAuditConfigurationResponse extends S.Class<DescribeAccountAuditConfigurationResponse>(
  "DescribeAccountAuditConfigurationResponse",
)({
  roleArn: S.optional(S.String),
  auditNotificationTargetConfigurations: S.optional(
    AuditNotificationTargetConfigurations,
  ),
  auditCheckConfigurations: S.optional(AuditCheckConfigurations),
}) {}
export class DescribeAuditFindingResponse extends S.Class<DescribeAuditFindingResponse>(
  "DescribeAuditFindingResponse",
)({ finding: S.optional(AuditFinding) }) {}
export class DescribeAuditMitigationActionsTaskResponse extends S.Class<DescribeAuditMitigationActionsTaskResponse>(
  "DescribeAuditMitigationActionsTaskResponse",
)({
  taskStatus: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  taskStatistics: S.optional(AuditMitigationActionsTaskStatistics),
  target: S.optional(AuditMitigationActionsTaskTarget),
  auditCheckToActionsMapping: S.optional(AuditCheckToActionsMapping),
  actionsDefinition: S.optional(MitigationActionList),
}) {}
export class DescribeAuditTaskResponse extends S.Class<DescribeAuditTaskResponse>(
  "DescribeAuditTaskResponse",
)({
  taskStatus: S.optional(S.String),
  taskType: S.optional(S.String),
  taskStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  taskStatistics: S.optional(TaskStatistics),
  scheduledAuditName: S.optional(S.String),
  auditDetails: S.optional(AuditDetails),
}) {}
export class DescribeCACertificateResponse extends S.Class<DescribeCACertificateResponse>(
  "DescribeCACertificateResponse",
)({
  certificateDescription: S.optional(CACertificateDescription),
  registrationConfig: S.optional(RegistrationConfig),
}) {}
export class DescribeCertificateResponse extends S.Class<DescribeCertificateResponse>(
  "DescribeCertificateResponse",
)({ certificateDescription: S.optional(CertificateDescription) }) {}
export class DescribeDetectMitigationActionsTaskResponse extends S.Class<DescribeDetectMitigationActionsTaskResponse>(
  "DescribeDetectMitigationActionsTaskResponse",
)({ taskSummary: S.optional(DetectMitigationActionsTaskSummary) }) {}
export class DescribeJobResponse extends S.Class<DescribeJobResponse>(
  "DescribeJobResponse",
)({ documentSource: S.optional(S.String), job: S.optional(Job) }) {}
export class DescribeJobExecutionResponse extends S.Class<DescribeJobExecutionResponse>(
  "DescribeJobExecutionResponse",
)({ execution: S.optional(JobExecution) }) {}
export class GetCommandExecutionResponse extends S.Class<GetCommandExecutionResponse>(
  "GetCommandExecutionResponse",
)({
  executionId: S.optional(S.String),
  commandArn: S.optional(S.String),
  targetArn: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(StatusReason),
  result: S.optional(CommandExecutionResultMap),
  parameters: S.optional(CommandExecutionParameterMap),
  executionTimeoutSeconds: S.optional(S.Number),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  completedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  timeToLive: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetIndexingConfigurationResponse extends S.Class<GetIndexingConfigurationResponse>(
  "GetIndexingConfigurationResponse",
)({
  thingIndexingConfiguration: S.optional(ThingIndexingConfiguration),
  thingGroupIndexingConfiguration: S.optional(ThingGroupIndexingConfiguration),
}) {}
export class GetOTAUpdateResponse extends S.Class<GetOTAUpdateResponse>(
  "GetOTAUpdateResponse",
)({ otaUpdateInfo: S.optional(OTAUpdateInfo) }) {}
export class GetTopicRuleDestinationResponse extends S.Class<GetTopicRuleDestinationResponse>(
  "GetTopicRuleDestinationResponse",
)({ topicRuleDestination: S.optional(TopicRuleDestination) }) {}
export class ListActiveViolationsResponse extends S.Class<ListActiveViolationsResponse>(
  "ListActiveViolationsResponse",
)({
  activeViolations: S.optional(ActiveViolations),
  nextToken: S.optional(S.String),
}) {}
export class ListCommandExecutionsResponse extends S.Class<ListCommandExecutionsResponse>(
  "ListCommandExecutionsResponse",
)({
  commandExecutions: S.optional(CommandExecutionSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListJobExecutionsForJobResponse extends S.Class<ListJobExecutionsForJobResponse>(
  "ListJobExecutionsForJobResponse",
)({
  executionSummaries: S.optional(JobExecutionSummaryForJobList),
  nextToken: S.optional(S.String),
}) {}
export class ListRelatedResourcesForAuditFindingResponse extends S.Class<ListRelatedResourcesForAuditFindingResponse>(
  "ListRelatedResourcesForAuditFindingResponse",
)({
  relatedResources: S.optional(RelatedResources),
  nextToken: S.optional(S.String),
}) {}
export class ListTopicRuleDestinationsResponse extends S.Class<ListTopicRuleDestinationsResponse>(
  "ListTopicRuleDestinationsResponse",
)({
  destinationSummaries: S.optional(TopicRuleDestinationSummaries),
  nextToken: S.optional(S.String),
}) {}
export class RegisterThingResponse extends S.Class<RegisterThingResponse>(
  "RegisterThingResponse",
)({
  certificatePem: S.optional(S.String),
  resourceArns: S.optional(ResourceArns),
}) {}
export class SearchIndexResponse extends S.Class<SearchIndexResponse>(
  "SearchIndexResponse",
)({
  nextToken: S.optional(S.String),
  things: S.optional(ThingDocumentList),
  thingGroups: S.optional(ThingGroupDocumentList),
}) {}
export class StartAuditMitigationActionsTaskResponse extends S.Class<StartAuditMitigationActionsTaskResponse>(
  "StartAuditMitigationActionsTaskResponse",
)({ taskId: S.optional(S.String) }) {}
export class TestInvokeAuthorizerResponse extends S.Class<TestInvokeAuthorizerResponse>(
  "TestInvokeAuthorizerResponse",
)({
  isAuthenticated: S.optional(S.Boolean),
  principalId: S.optional(S.String),
  policyDocuments: S.optional(PolicyDocuments),
  refreshAfterInSeconds: S.optional(S.Number),
  disconnectAfterInSeconds: S.optional(S.Number),
}) {}
export class Allowed extends S.Class<Allowed>("Allowed")({
  policies: S.optional(Policies),
}) {}
export class Bucket extends S.Class<Bucket>("Bucket")({
  keyValue: S.optional(S.String),
  count: S.optional(S.Number),
}) {}
export const Buckets = S.Array(Bucket);
export class ImplicitDeny extends S.Class<ImplicitDeny>("ImplicitDeny")({
  policies: S.optional(Policies),
}) {}
export class ExplicitDeny extends S.Class<ExplicitDeny>("ExplicitDeny")({
  policies: S.optional(Policies),
}) {}
export class CreateCommandRequest extends S.Class<CreateCommandRequest>(
  "CreateCommandRequest",
)(
  {
    commandId: S.String.pipe(T.HttpLabel()),
    namespace: S.optional(S.String),
    displayName: S.optional(S.String),
    description: S.optional(S.String),
    payload: S.optional(CommandPayload),
    payloadTemplate: S.optional(S.String),
    preprocessor: S.optional(CommandPreprocessor),
    mandatoryParameters: S.optional(CommandParameterList),
    roleArn: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/commands/{commandId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateJobResponse extends S.Class<CreateJobResponse>(
  "CreateJobResponse",
)({
  jobArn: S.optional(S.String),
  jobId: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export class CreateSecurityProfileResponse extends S.Class<CreateSecurityProfileResponse>(
  "CreateSecurityProfileResponse",
)({
  securityProfileName: S.optional(S.String),
  securityProfileArn: S.optional(S.String),
}) {}
export class CreateThingTypeResponse extends S.Class<CreateThingTypeResponse>(
  "CreateThingTypeResponse",
)({
  thingTypeName: S.optional(S.String),
  thingTypeArn: S.optional(S.String),
  thingTypeId: S.optional(S.String),
}) {}
export class GetBucketsAggregationResponse extends S.Class<GetBucketsAggregationResponse>(
  "GetBucketsAggregationResponse",
)({ totalCount: S.optional(S.Number), buckets: S.optional(Buckets) }) {}
export class Denied extends S.Class<Denied>("Denied")({
  implicitDeny: S.optional(ImplicitDeny),
  explicitDeny: S.optional(ExplicitDeny),
}) {}
export class AuthResult extends S.Class<AuthResult>("AuthResult")({
  authInfo: S.optional(AuthInfo),
  allowed: S.optional(Allowed),
  denied: S.optional(Denied),
  authDecision: S.optional(S.String),
  missingContextValues: S.optional(MissingContextValues),
}) {}
export const AuthResults = S.Array(AuthResult);
export class CreateCommandResponse extends S.Class<CreateCommandResponse>(
  "CreateCommandResponse",
)({ commandId: S.optional(S.String), commandArn: S.optional(S.String) }) {}
export class CreateOTAUpdateRequest extends S.Class<CreateOTAUpdateRequest>(
  "CreateOTAUpdateRequest",
)(
  {
    otaUpdateId: S.String.pipe(T.HttpLabel()),
    description: S.optional(S.String),
    targets: Targets,
    protocols: S.optional(Protocols),
    targetSelection: S.optional(S.String),
    awsJobExecutionsRolloutConfig: S.optional(AwsJobExecutionsRolloutConfig),
    awsJobPresignedUrlConfig: S.optional(AwsJobPresignedUrlConfig),
    awsJobAbortConfig: S.optional(AwsJobAbortConfig),
    awsJobTimeoutConfig: S.optional(AwsJobTimeoutConfig),
    files: OTAUpdateFiles,
    roleArn: S.String,
    additionalParameters: S.optional(AdditionalParameterMap),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/otaUpdates/{otaUpdateId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TestAuthorizationResponse extends S.Class<TestAuthorizationResponse>(
  "TestAuthorizationResponse",
)({ authResults: S.optional(AuthResults) }) {}
export class CreateOTAUpdateResponse extends S.Class<CreateOTAUpdateResponse>(
  "CreateOTAUpdateResponse",
)({
  otaUpdateId: S.optional(S.String),
  awsIotJobId: S.optional(S.String),
  otaUpdateArn: S.optional(S.String),
  awsIotJobArn: S.optional(S.String),
  otaUpdateStatus: S.optional(S.String),
}) {}
export class CreateTopicRuleRequest extends S.Class<CreateTopicRuleRequest>(
  "CreateTopicRuleRequest",
)(
  {
    ruleName: S.String.pipe(T.HttpLabel()),
    topicRulePayload: TopicRulePayload.pipe(T.HttpPayload()),
    tags: S.optional(S.String).pipe(T.HttpHeader("x-amz-tagging")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/rules/{ruleName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTopicRuleResponse extends S.Class<CreateTopicRuleResponse>(
  "CreateTopicRuleResponse",
)({}) {}

//# Errors
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  {},
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  {},
) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  {},
) {}
export class VersionConflictException extends S.TaggedError<VersionConflictException>()(
  "VersionConflictException",
  {},
) {}
export class CertificateStateException extends S.TaggedError<CertificateStateException>()(
  "CertificateStateException",
  {},
) {}
export class DeleteConflictException extends S.TaggedError<DeleteConflictException>()(
  "DeleteConflictException",
  {},
) {}
export class InvalidStateTransitionException extends S.TaggedError<InvalidStateTransitionException>()(
  "InvalidStateTransitionException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ConflictingResourceUpdateException extends S.TaggedError<ConflictingResourceUpdateException>()(
  "ConflictingResourceUpdateException",
  {},
) {}
export class InternalException extends S.TaggedError<InternalException>()(
  "InternalException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class TransferAlreadyCompletedException extends S.TaggedError<TransferAlreadyCompletedException>()(
  "TransferAlreadyCompletedException",
  {},
) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  {},
) {}
export class MalformedPolicyException extends S.TaggedError<MalformedPolicyException>()(
  "MalformedPolicyException",
  {},
) {}
export class VersionsLimitExceededException extends S.TaggedError<VersionsLimitExceededException>()(
  "VersionsLimitExceededException",
  {},
) {}
export class IndexNotReadyException extends S.TaggedError<IndexNotReadyException>()(
  "IndexNotReadyException",
  {},
) {}
export class SqlParseException extends S.TaggedError<SqlParseException>()(
  "SqlParseException",
  { message: S.optional(S.String) },
) {}
export class NotConfiguredException extends S.TaggedError<NotConfiguredException>()(
  "NotConfiguredException",
  {},
) {}
export class CertificateValidationException extends S.TaggedError<CertificateValidationException>()(
  "CertificateValidationException",
  {},
) {}
export class InvalidAggregationException extends S.TaggedError<InvalidAggregationException>()(
  "InvalidAggregationException",
  {},
) {}
export class InvalidQueryException extends S.TaggedError<InvalidQueryException>()(
  "InvalidQueryException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
) {}
export class CertificateConflictException extends S.TaggedError<CertificateConflictException>()(
  "CertificateConflictException",
  { message: S.optional(S.String) },
) {}
export class TransferConflictException extends S.TaggedError<TransferConflictException>()(
  "TransferConflictException",
  { message: S.optional(S.String) },
) {}
export class RegistrationCodeValidationException extends S.TaggedError<RegistrationCodeValidationException>()(
  "RegistrationCodeValidationException",
  { message: S.optional(S.String) },
) {}
export class TaskAlreadyExistsException extends S.TaggedError<TaskAlreadyExistsException>()(
  "TaskAlreadyExistsException",
  {},
) {}
export class ResourceRegistrationFailureException extends S.TaggedError<ResourceRegistrationFailureException>()(
  "ResourceRegistrationFailureException",
  { message: S.optional(S.String) },
) {}
export class InvalidResponseException extends S.TaggedError<InvalidResponseException>()(
  "InvalidResponseException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Adds a thing to a thing group.
 *
 * Requires permission to access the AddThingToThingGroup action.
 */
export const addThingToThingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AddThingToThingGroupRequest,
    output: AddThingToThingGroupResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Cancels a mitigation action task that is in progress. If the task
 * is not
 * in progress, an InvalidRequestException occurs.
 *
 * Requires permission to access the CancelAuditMitigationActionsTask action.
 */
export const cancelAuditMitigationActionsTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CancelAuditMitigationActionsTaskRequest,
    output: CancelAuditMitigationActionsTaskResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Cancels an audit that is in progress. The audit can be either scheduled or on demand. If the audit isn't in progress, an "InvalidRequestException" occurs.
 *
 * Requires permission to access the CancelAuditTask action.
 */
export const cancelAuditTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelAuditTaskRequest,
  output: CancelAuditTaskResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Cancels a Device Defender ML Detect mitigation action.
 *
 * Requires permission to access the CancelDetectMitigationActionsTask action.
 */
export const cancelDetectMitigationActionsTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CancelDetectMitigationActionsTaskRequest,
    output: CancelDetectMitigationActionsTaskResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Clears the default authorizer.
 *
 * Requires permission to access the ClearDefaultAuthorizer action.
 */
export const clearDefaultAuthorizer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ClearDefaultAuthorizerRequest,
    output: ClearDefaultAuthorizerResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Restores the default settings for Device Defender audits for this account. Any
 * configuration data you entered is deleted and all audit checks are reset to
 * disabled.
 *
 * Requires permission to access the DeleteAccountAuditConfiguration action.
 */
export const deleteAccountAuditConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteAccountAuditConfigurationRequest,
    output: DeleteAccountAuditConfigurationResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Deletes a Device Defender audit suppression.
 *
 * Requires permission to access the DeleteAuditSuppression action.
 */
export const deleteAuditSuppression = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAuditSuppressionRequest,
    output: DeleteAuditSuppressionResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes the billing group.
 *
 * Requires permission to access the DeleteBillingGroup action.
 */
export const deleteBillingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBillingGroupRequest,
  output: DeleteBillingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
    VersionConflictException,
  ],
}));
/**
 * Deletes the specified certificate.
 *
 * A certificate cannot be deleted if it has a policy or IoT thing attached to it or if
 * its status is set to ACTIVE. To delete a certificate, first use the DetachPolicy action to detach all policies. Next, use the UpdateCertificate action to set the certificate to the INACTIVE
 * status.
 *
 * Requires permission to access the DeleteCertificate action.
 */
export const deleteCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCertificateRequest,
  output: DeleteCertificateResponse,
  errors: [
    CertificateStateException,
    DeleteConflictException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a certificate provider.
 *
 * Requires permission to access the DeleteCertificateProvider action.
 *
 * If you delete the certificate provider resource, the behavior of
 * `CreateCertificateFromCsr` will resume, and IoT will create
 * certificates signed by IoT from a certificate signing request (CSR).
 */
export const deleteCertificateProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCertificateProviderRequest,
    output: DeleteCertificateProviderResponse,
    errors: [
      DeleteConflictException,
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Deletes a Device Defender detect custom metric.
 *
 * Requires permission to access the DeleteCustomMetric action.
 *
 * Before you can delete a custom metric, you must first remove the custom metric from all
 * security profiles it's a part of.
 * The
 * security
 * profile associated with the custom metric can be found using the ListSecurityProfiles
 * API with `metricName` set to your custom metric name.
 */
export const deleteCustomMetric = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCustomMetricRequest,
  output: DeleteCustomMetricResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Removes the specified dimension from your Amazon Web Services accounts.
 *
 * Requires permission to access the DeleteDimension action.
 */
export const deleteDimension = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDimensionRequest,
  output: DeleteDimensionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the specified domain configuration.
 *
 * Requires permission to access the DeleteDomainConfiguration action.
 */
export const deleteDomainConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDomainConfigurationRequest,
    output: DeleteDomainConfigurationResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Deletes a dynamic thing group.
 *
 * Requires permission to access the DeleteDynamicThingGroup action.
 */
export const deleteDynamicThingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDynamicThingGroupRequest,
    output: DeleteDynamicThingGroupResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
      VersionConflictException,
    ],
  }),
);
/**
 * Deletes the specified fleet metric.
 * Returns successfully with no error if the deletion is successful or you specify a fleet metric that doesn't exist.
 *
 * Requires permission to access the DeleteFleetMetric action.
 */
export const deleteFleetMetric = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFleetMetricRequest,
  output: DeleteFleetMetricResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    VersionConflictException,
  ],
}));
/**
 * Deletes a job execution.
 *
 * Requires permission to access the DeleteJobExecution action.
 */
export const deleteJobExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteJobExecutionRequest,
  output: DeleteJobExecutionResponse,
  errors: [
    InvalidRequestException,
    InvalidStateTransitionException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the specified job template.
 */
export const deleteJobTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteJobTemplateRequest,
  output: DeleteJobTemplateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a defined mitigation action from your Amazon Web Services accounts.
 *
 * Requires permission to access the DeleteMitigationAction action.
 */
export const deleteMitigationAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteMitigationActionRequest,
    output: DeleteMitigationActionResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
    ],
  }),
);
/**
 * Delete an OTA update.
 *
 * Requires permission to access the DeleteOTAUpdate action.
 */
export const deleteOTAUpdate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOTAUpdateRequest,
  output: DeleteOTAUpdateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    VersionConflictException,
  ],
}));
/**
 * Deletes the specified policy.
 *
 * A policy cannot be deleted if it has non-default versions or it is attached to any
 * certificate.
 *
 * To delete a policy, use the DeletePolicyVersion action to delete all non-default
 * versions of the policy; use the DetachPolicy action to detach the policy from any
 * certificate; and then use the DeletePolicy action to delete the policy.
 *
 * When a policy is deleted using DeletePolicy, its default version is deleted with
 * it.
 *
 * Because of the distributed nature of Amazon Web Services, it can take up to five minutes after
 * a policy is detached before it's ready to be deleted.
 *
 * Requires permission to access the DeletePolicy action.
 */
export const deletePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePolicyRequest,
  output: DeletePolicyResponse,
  errors: [
    DeleteConflictException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes the specified version of the specified policy. You cannot delete the default
 * version of a policy using this action. To delete the default version of a policy, use DeletePolicy. To find out which version of a policy is marked as the default
 * version, use ListPolicyVersions.
 *
 * Requires permission to access the DeletePolicyVersion action.
 */
export const deletePolicyVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePolicyVersionRequest,
  output: DeletePolicyVersionResponse,
  errors: [
    DeleteConflictException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a provisioning template.
 *
 * Requires permission to access the DeleteProvisioningTemplate action.
 */
export const deleteProvisioningTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteProvisioningTemplateRequest,
    output: DeleteProvisioningTemplateResponse,
    errors: [
      ConflictingResourceUpdateException,
      DeleteConflictException,
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Deletes a provisioning template version.
 *
 * Requires permission to access the DeleteProvisioningTemplateVersion action.
 */
export const deleteProvisioningTemplateVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteProvisioningTemplateVersionRequest,
    output: DeleteProvisioningTemplateVersionResponse,
    errors: [
      ConflictingResourceUpdateException,
      DeleteConflictException,
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }));
/**
 * Deletes a CA certificate registration code.
 *
 * Requires permission to access the DeleteRegistrationCode action.
 */
export const deleteRegistrationCode = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRegistrationCodeRequest,
    output: DeleteRegistrationCodeResponse,
    errors: [
      InternalFailureException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Deletes a role alias
 *
 * Requires permission to access the DeleteRoleAlias action.
 */
export const deleteRoleAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRoleAliasRequest,
  output: DeleteRoleAliasResponse,
  errors: [
    DeleteConflictException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a scheduled audit.
 *
 * Requires permission to access the DeleteScheduledAudit action.
 */
export const deleteScheduledAudit = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteScheduledAuditRequest,
    output: DeleteScheduledAuditResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes a Device Defender security profile.
 *
 * Requires permission to access the DeleteSecurityProfile action.
 */
export const deleteSecurityProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSecurityProfileRequest,
    output: DeleteSecurityProfileResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
      VersionConflictException,
    ],
  }),
);
/**
 * Deletes a stream.
 *
 * Requires permission to access the DeleteStream action.
 */
export const deleteStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStreamRequest,
  output: DeleteStreamResponse,
  errors: [
    DeleteConflictException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes the specified thing. Returns successfully with no error if the deletion is
 * successful or you specify a thing that doesn't exist.
 *
 * Requires permission to access the DeleteThing action.
 */
export const deleteThing = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteThingRequest,
  output: DeleteThingResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    VersionConflictException,
  ],
}));
/**
 * Deletes a thing group.
 *
 * Requires permission to access the DeleteThingGroup action.
 */
export const deleteThingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteThingGroupRequest,
  output: DeleteThingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
    VersionConflictException,
  ],
}));
/**
 * Deletes the specified thing type. You cannot delete a thing type if it has things
 * associated with it. To delete a thing type, first mark it as deprecated by calling DeprecateThingType, then remove any associated things by calling UpdateThing to change the thing type on any associated thing, and
 * finally use DeleteThingType to delete the thing type.
 *
 * Requires permission to access the DeleteThingType action.
 */
export const deleteThingType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteThingTypeRequest,
  output: DeleteThingTypeResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a topic rule destination.
 *
 * Requires permission to access the DeleteTopicRuleDestination action.
 */
export const deleteTopicRuleDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteTopicRuleDestinationRequest,
    output: DeleteTopicRuleDestinationResponse,
    errors: [
      ConflictingResourceUpdateException,
      InternalException,
      InvalidRequestException,
      ServiceUnavailableException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Deletes a logging level.
 *
 * Requires permission to access the DeleteV2LoggingLevel action.
 */
export const deleteV2LoggingLevel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteV2LoggingLevelRequest,
    output: DeleteV2LoggingLevelResponse,
    errors: [
      InternalException,
      InvalidRequestException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Deprecates a thing type. You can not associate new things with deprecated thing
 * type.
 *
 * Requires permission to access the DeprecateThingType action.
 */
export const deprecateThingType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeprecateThingTypeRequest,
  output: DeprecateThingTypeResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Detaches a policy from the specified target.
 *
 * Because of the distributed nature of Amazon Web Services, it can take up to five minutes after
 * a policy is detached before it's ready to be deleted.
 *
 * Requires permission to access the DetachPolicy action.
 */
export const detachPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachPolicyRequest,
  output: DetachPolicyResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Removes the specified policy from the specified certificate.
 *
 * **Note:** This action is deprecated and works as
 * expected for backward compatibility, but we won't add enhancements. Use DetachPolicy instead.
 *
 * Requires permission to access the DetachPrincipalPolicy action.
 */
export const detachPrincipalPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DetachPrincipalPolicyRequest,
    output: DetachPrincipalPolicyResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Disassociates a Device Defender security profile from a thing group or from this account.
 *
 * Requires permission to access the DetachSecurityProfile action.
 */
export const detachSecurityProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DetachSecurityProfileRequest,
    output: DetachSecurityProfileResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Detaches the specified principal from the specified thing. A principal can be X.509
 * certificates, IAM users, groups, and roles, Amazon Cognito identities or federated
 * identities.
 *
 * This call is asynchronous. It might take several seconds for the detachment to
 * propagate.
 *
 * Requires permission to access the DetachThingPrincipal action.
 */
export const detachThingPrincipal = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DetachThingPrincipalRequest,
    output: DetachThingPrincipalResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Disables the rule.
 *
 * Requires permission to access the DisableTopicRule action.
 */
export const disableTopicRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableTopicRuleRequest,
  output: DisableTopicRuleResponse,
  errors: [
    ConflictingResourceUpdateException,
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Disassociates the selected software bill of materials (SBOM) from a specific software package version.
 *
 * Requires permission to access the DisassociateSbomWithPackageVersion action.
 */
export const disassociateSbomFromPackageVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateSbomFromPackageVersionRequest,
    output: DisassociateSbomFromPackageVersionResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Enables the rule.
 *
 * Requires permission to access the EnableTopicRule action.
 */
export const enableTopicRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableTopicRuleRequest,
  output: EnableTopicRuleResponse,
  errors: [
    ConflictingResourceUpdateException,
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Gets the logging options.
 *
 * NOTE: use of this command is not recommended. Use `GetV2LoggingOptions`
 * instead.
 *
 * Requires permission to access the GetLoggingOptions action.
 */
export const getLoggingOptions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLoggingOptionsRequest,
  output: GetLoggingOptionsResponse,
  errors: [
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
  ],
}));
/**
 * Gets a registration code used to register a CA certificate with IoT.
 *
 * IoT will create a registration code as part of this API call if the registration
 * code doesn't exist or has been deleted. If you already have a registration code, this API
 * call will return the same registration code.
 *
 * Requires permission to access the GetRegistrationCode action.
 */
export const getRegistrationCode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRegistrationCodeRequest,
  output: GetRegistrationCodeResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Set a verification state and provide a description of that verification state on a violation (detect alarm).
 */
export const putVerificationStateOnViolation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutVerificationStateOnViolationRequest,
    output: PutVerificationStateOnViolationResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
    ],
  }));
/**
 * Rejects a pending certificate transfer. After IoT rejects a certificate transfer,
 * the certificate status changes from **PENDING_TRANSFER** to
 * **INACTIVE**.
 *
 * To check for pending certificate transfers, call ListCertificates
 * to enumerate your certificates.
 *
 * This operation can only be called by the transfer destination. After it is called,
 * the certificate will be returned to the source's account in the INACTIVE state.
 *
 * Requires permission to access the RejectCertificateTransfer action.
 */
export const rejectCertificateTransfer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RejectCertificateTransferRequest,
    output: RejectCertificateTransferResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      TransferAlreadyCompletedException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Removes the given thing from the billing group.
 *
 * Requires permission to access the RemoveThingFromBillingGroup action.
 *
 * This call is asynchronous. It might take several seconds for the detachment to propagate.
 */
export const removeThingFromBillingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveThingFromBillingGroupRequest,
    output: RemoveThingFromBillingGroupResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Remove the specified thing from the specified group.
 *
 * You must specify either a `thingGroupArn` or a
 * `thingGroupName` to identify the thing group and
 * either a `thingArn` or a `thingName` to
 * identify the thing to remove from the thing group.
 *
 * Requires permission to access the RemoveThingFromThingGroup action.
 */
export const removeThingFromThingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveThingFromThingGroupRequest,
    output: RemoveThingFromThingGroupResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Sets the specified version of the specified policy as the policy's default
 * (operative) version. This action affects all certificates to which the policy is attached.
 * To list the principals the policy is attached to, use the ListPrincipalPolicies
 * action.
 *
 * Requires permission to access the SetDefaultPolicyVersion action.
 */
export const setDefaultPolicyVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SetDefaultPolicyVersionRequest,
    output: SetDefaultPolicyVersionResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Cancels a bulk thing provisioning task.
 *
 * Requires permission to access the StopThingRegistrationTask action.
 */
export const stopThingRegistrationTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopThingRegistrationTaskRequest,
    output: StopThingRegistrationTaskResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Adds to or modifies the tags of the given resource. Tags are metadata which can be
 * used to manage a resource.
 *
 * Requires permission to access the TagResource action.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Removes the given tags (metadata) from the resource.
 *
 * Requires permission to access the UntagResource action.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Configures or reconfigures the Device Defender audit settings for this account.
 * Settings include how audit notifications are sent and which audit checks are
 * enabled or disabled.
 *
 * Requires permission to access the UpdateAccountAuditConfiguration action.
 */
export const updateAccountAuditConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateAccountAuditConfigurationRequest,
    output: UpdateAccountAuditConfigurationResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
    ],
  }));
/**
 * Updates a Device Defender audit suppression.
 */
export const updateAuditSuppression = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAuditSuppressionRequest,
    output: UpdateAuditSuppressionResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates a registered CA certificate.
 *
 * Requires permission to access the UpdateCACertificate action.
 */
export const updateCACertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCACertificateRequest,
  output: UpdateCACertificateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Updates the status of the specified certificate. This operation is
 * idempotent.
 *
 * Requires permission to access the UpdateCertificate action.
 *
 * Certificates must be in the ACTIVE state to authenticate devices that use
 * a certificate to connect to IoT.
 *
 * Within a few minutes of updating a certificate from the ACTIVE state to any other
 * state, IoT disconnects all devices that used that certificate to connect. Devices cannot
 * use a certificate that is not in the ACTIVE state to reconnect.
 */
export const updateCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCertificateRequest,
  output: UpdateCertificateResponse,
  errors: [
    CertificateStateException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Updates the encryption configuration. By default, Amazon Web Services IoT Core encrypts your data at rest using Amazon Web Services owned keys. Amazon Web Services IoT Core also supports symmetric customer managed keys
 * from Key Management Service (KMS). With customer managed keys, you create, own, and
 * manage the KMS keys in your Amazon Web Services account.
 *
 * Before using this API, you must set up permissions for Amazon Web Services IoT Core to access KMS. For more information, see Data encryption at rest in the *Amazon Web Services IoT Core Developer Guide*.
 */
export const updateEncryptionConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateEncryptionConfigurationRequest,
    output: UpdateEncryptionConfigurationResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }));
/**
 * Updates the event configurations.
 *
 * Requires permission to access the UpdateEventConfigurations action.
 */
export const updateEventConfigurations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateEventConfigurationsRequest,
    output: UpdateEventConfigurationsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates the search configuration.
 *
 * Requires permission to access the UpdateIndexingConfiguration action.
 */
export const updateIndexingConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateIndexingConfigurationRequest,
    output: UpdateIndexingConfigurationResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Updates supported fields of the specified job.
 *
 * Requires permission to access the UpdateJob action.
 */
export const updateJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateJobRequest,
  output: UpdateJobResponse,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Updates the supported fields for a specific software package.
 *
 * Requires permission to access the UpdatePackage and GetIndexingConfiguration actions.
 */
export const updatePackage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePackageRequest,
  output: UpdatePackageResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the software package configuration.
 *
 * Requires permission to access the UpdatePackageConfiguration and iam:PassRole actions.
 */
export const updatePackageConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdatePackageConfigurationRequest,
    output: UpdatePackageConfigurationResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the supported fields for a specific package version.
 *
 * Requires permission to access the UpdatePackageVersion and GetIndexingConfiguration actions.
 */
export const updatePackageVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdatePackageVersionRequest,
    output: UpdatePackageVersionResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates a provisioning template.
 *
 * Requires permission to access the UpdateProvisioningTemplate action.
 */
export const updateProvisioningTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateProvisioningTemplateRequest,
    output: UpdateProvisioningTemplateResponse,
    errors: [
      ConflictingResourceUpdateException,
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Updates the data for a thing.
 *
 * Requires permission to access the UpdateThing action.
 */
export const updateThing = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateThingRequest,
  output: UpdateThingResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    VersionConflictException,
  ],
}));
/**
 * Updates the groups to which the thing belongs.
 *
 * Requires permission to access the UpdateThingGroupsForThing action.
 */
export const updateThingGroupsForThing = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateThingGroupsForThingRequest,
    output: UpdateThingGroupsForThingResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates a thing type.
 */
export const updateThingType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateThingTypeRequest,
  output: UpdateThingTypeResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Updates a topic rule destination. You use this to change the status, endpoint URL, or
 * confirmation URL of the destination.
 *
 * Requires permission to access the UpdateTopicRuleDestination action.
 */
export const updateTopicRuleDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateTopicRuleDestinationRequest,
    output: UpdateTopicRuleDestinationResponse,
    errors: [
      ConflictingResourceUpdateException,
      InternalException,
      InvalidRequestException,
      ServiceUnavailableException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Accepts a pending certificate transfer. The default state of the certificate is
 * INACTIVE.
 *
 * To check for pending certificate transfers, call ListCertificates
 * to enumerate your certificates.
 *
 * Requires permission to access the AcceptCertificateTransfer action.
 */
export const acceptCertificateTransfer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AcceptCertificateTransferRequest,
    output: AcceptCertificateTransferResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      TransferAlreadyCompletedException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Adds a thing to a billing group.
 *
 * Requires permission to access the AddThingToBillingGroup action.
 */
export const addThingToBillingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AddThingToBillingGroupRequest,
    output: AddThingToBillingGroupResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Associates a group with a continuous job. The following criteria must be met:
 *
 * - The job must have been created with the `targetSelection` field
 * set to "CONTINUOUS".
 *
 * - The job status must currently be "IN_PROGRESS".
 *
 * - The total number of targets associated with a job must not exceed
 * 100.
 *
 * Requires permission to access the AssociateTargetsWithJob action.
 */
export const associateTargetsWithJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateTargetsWithJobRequest,
    output: AssociateTargetsWithJobResponse,
    errors: [
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Attaches the specified policy to the specified principal (certificate or other
 * credential).
 *
 * Requires permission to access the AttachPolicy action.
 */
export const attachPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachPolicyRequest,
  output: AttachPolicyResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Attaches the specified policy to the specified principal (certificate or other
 * credential).
 *
 * **Note:** This action is deprecated and works as
 * expected for backward compatibility, but we won't add enhancements. Use AttachPolicy instead.
 *
 * Requires permission to access the AttachPrincipalPolicy action.
 */
export const attachPrincipalPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AttachPrincipalPolicyRequest,
    output: AttachPrincipalPolicyResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Associates a Device Defender security profile with a thing group or this account. Each
 * thing group or account can have up to five security profiles associated with it.
 *
 * Requires permission to access the AttachSecurityProfile action.
 */
export const attachSecurityProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AttachSecurityProfileRequest,
    output: AttachSecurityProfileResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
      VersionConflictException,
    ],
  }),
);
/**
 * Attaches the specified principal to the specified thing. A principal can be X.509
 * certificates, Amazon Cognito identities or federated identities.
 *
 * Requires permission to access the AttachThingPrincipal action.
 */
export const attachThingPrincipal = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AttachThingPrincipalRequest,
    output: AttachThingPrincipalResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Cancels a pending transfer for the specified certificate.
 *
 * **Note** Only the transfer source account can use this
 * operation to cancel a transfer. (Transfer destinations can use RejectCertificateTransfer instead.) After transfer, IoT returns the
 * certificate to the source account in the INACTIVE state. After the destination account has
 * accepted the transfer, the transfer cannot be cancelled.
 *
 * After a certificate transfer is cancelled, the status of the certificate changes from
 * PENDING_TRANSFER to INACTIVE.
 *
 * Requires permission to access the CancelCertificateTransfer action.
 */
export const cancelCertificateTransfer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelCertificateTransferRequest,
    output: CancelCertificateTransferResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      TransferAlreadyCompletedException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Cancels a job.
 *
 * Requires permission to access the CancelJob action.
 */
export const cancelJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelJobRequest,
  output: CancelJobResponse,
  errors: [
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Cancels the execution of a job for a given thing.
 *
 * Requires permission to access the CancelJobExecution action.
 */
export const cancelJobExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelJobExecutionRequest,
  output: CancelJobExecutionResponse,
  errors: [
    InvalidRequestException,
    InvalidStateTransitionException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    VersionConflictException,
  ],
}));
/**
 * Confirms a topic rule destination. When you create a rule requiring a destination, IoT
 * sends a confirmation message to the endpoint or base address you specify. The message
 * includes a token which you pass back when calling `ConfirmTopicRuleDestination`
 * to confirm that you own or have access to the endpoint.
 *
 * Requires permission to access the ConfirmTopicRuleDestination action.
 */
export const confirmTopicRuleDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ConfirmTopicRuleDestinationRequest,
    output: ConfirmTopicRuleDestinationResponse,
    errors: [
      ConflictingResourceUpdateException,
      InternalException,
      InvalidRequestException,
      ServiceUnavailableException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Creates an X.509 certificate using the specified certificate signing
 * request.
 *
 * Requires permission to access the CreateCertificateFromCsr action.
 *
 * The CSR must include a public key that is either an RSA key with a length of at least
 * 2048 bits or an ECC key from NIST P-256, NIST P-384, or NIST P-521 curves. For supported
 * certificates, consult Certificate signing algorithms supported by IoT.
 *
 * Reusing the same certificate signing request (CSR)
 * results in a distinct certificate.
 *
 * You can create multiple certificates in a batch by creating a directory, copying
 * multiple `.csr` files into that directory, and then specifying that directory on the command
 * line. The following commands show how to create a batch of certificates given a batch of
 * CSRs. In the following commands, we assume that a set of CSRs are located inside of the
 * directory my-csr-directory:
 *
 * On Linux and OS X, the command is:
 *
 * $ ls my-csr-directory/ | xargs -I {} aws iot create-certificate-from-csr
 * --certificate-signing-request file://my-csr-directory/{}
 *
 * This command lists all of the CSRs in my-csr-directory and pipes each CSR file name
 * to the `aws iot create-certificate-from-csr` Amazon Web Services CLI command to create a certificate for
 * the corresponding CSR.
 *
 * You can also run the `aws iot create-certificate-from-csr` part of the
 * command in parallel to speed up the certificate creation process:
 *
 * $ ls my-csr-directory/ | xargs -P 10 -I {} aws iot create-certificate-from-csr
 * --certificate-signing-request file://my-csr-directory/{}
 *
 * On Windows PowerShell, the command to create certificates for all CSRs in
 * my-csr-directory is:
 *
 * > ls -Name my-csr-directory | %{aws iot create-certificate-from-csr
 * --certificate-signing-request file://my-csr-directory/$_}
 *
 * On a Windows command prompt, the command to create certificates for all CSRs in
 * my-csr-directory is:
 *
 * > forfiles /p my-csr-directory /c "cmd /c aws iot create-certificate-from-csr
 * --certificate-signing-request file://@path"
 */
export const createCertificateFromCsr = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCertificateFromCsrRequest,
    output: CreateCertificateFromCsrResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Use this API to define a
 * Custom
 * Metric
 * published by your devices to Device Defender.
 *
 * Requires permission to access the CreateCustomMetric action.
 */
export const createCustomMetric = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCustomMetricRequest,
  output: CreateCustomMetricResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Create a dimension that you can use to limit the scope of a metric used in a security profile for IoT Device Defender.
 * For example, using a `TOPIC_FILTER` dimension, you can narrow down the scope of the metric only to MQTT topics whose name match the pattern specified in the dimension.
 *
 * Requires permission to access the CreateDimension action.
 */
export const createDimension = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDimensionRequest,
  output: CreateDimensionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Creates a provisioning claim.
 *
 * Requires permission to access the CreateProvisioningClaim action.
 */
export const createProvisioningClaim = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateProvisioningClaimRequest,
    output: CreateProvisioningClaimResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Creates a new version of a provisioning template.
 *
 * Requires permission to access the CreateProvisioningTemplateVersion action.
 */
export const createProvisioningTemplateVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateProvisioningTemplateVersionRequest,
    output: CreateProvisioningTemplateVersionResponse,
    errors: [
      ConflictingResourceUpdateException,
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
      VersionsLimitExceededException,
    ],
  }));
/**
 * Creates a role alias.
 *
 * Requires permission to access the CreateRoleAlias action.
 *
 * The value of
 * `credentialDurationSeconds`
 * must be less than or equal to the maximum session
 * duration of the IAM role that the role alias references. For more information, see
 *
 * Modifying a role maximum session duration (Amazon Web Services API) from the Amazon Web Services Identity and Access Management User Guide.
 */
export const createRoleAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRoleAliasRequest,
  output: CreateRoleAliasResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a scheduled audit that is run at a specified
 * time interval.
 *
 * Requires permission to access the CreateScheduledAudit action.
 */
export const createScheduledAudit = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateScheduledAuditRequest,
    output: CreateScheduledAuditResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ThrottlingException,
    ],
  }),
);
/**
 * Create a thing group.
 *
 * This is a control plane operation. See Authorization for
 * information about authorizing control plane actions.
 *
 * If the `ThingGroup` that you create has the exact same attributes as an existing
 * `ThingGroup`, you will get a 200 success response.
 *
 * Requires permission to access the CreateThingGroup action.
 */
export const createThingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateThingGroupRequest,
  output: CreateThingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Deletes an authorizer.
 *
 * Requires permission to access the DeleteAuthorizer action.
 */
export const deleteAuthorizer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAuthorizerRequest,
  output: DeleteAuthorizerResponse,
  errors: [
    DeleteConflictException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a registered CA certificate.
 *
 * Requires permission to access the DeleteCACertificate action.
 */
export const deleteCACertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCACertificateRequest,
  output: DeleteCACertificateResponse,
  errors: [
    CertificateStateException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Delete a command resource.
 */
export const deleteCommand = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCommandRequest,
  output: DeleteCommandResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete a command execution.
 *
 * Only command executions that enter a terminal state can be deleted from
 * your account.
 */
export const deleteCommandExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCommandExecutionRequest,
    output: DeleteCommandExecutionResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a job and its related job executions.
 *
 * Deleting a job may take time, depending on the number of job executions created for
 * the job and various other factors. While the job is being deleted, the status of the job
 * will be shown as "DELETION_IN_PROGRESS". Attempting to delete or cancel a job whose
 * status is already "DELETION_IN_PROGRESS" will result in an error.
 *
 * Only 10 jobs may have status "DELETION_IN_PROGRESS" at the same time, or a
 * LimitExceededException will occur.
 *
 * Requires permission to access the DeleteJob action.
 */
export const deleteJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteJobRequest,
  output: DeleteJobResponse,
  errors: [
    InvalidRequestException,
    InvalidStateTransitionException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a specific version from a software package.
 *
 * **Note:** All package versions must be deleted before deleting the software package.
 *
 * Requires permission to access the DeletePackageVersion action.
 */
export const deletePackage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePackageRequest,
  output: DeletePackageResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
}));
/**
 * Deletes a specific version from a software package.
 *
 * **Note:** If a package version is designated as default, you must remove the designation from the software package using the UpdatePackage action.
 */
export const deletePackageVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeletePackageVersionRequest,
    output: DeletePackageVersionResponse,
    errors: [InternalServerException, ThrottlingException, ValidationException],
  }),
);
/**
 * Deletes the rule.
 *
 * Requires permission to access the DeleteTopicRule action.
 */
export const deleteTopicRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTopicRuleRequest,
  output: DeleteTopicRuleResponse,
  errors: [
    ConflictingResourceUpdateException,
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about a Device Defender audit suppression.
 */
export const describeAuditSuppression = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAuditSuppressionRequest,
    output: DescribeAuditSuppressionResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes an authorizer.
 *
 * Requires permission to access the DescribeAuthorizer action.
 */
export const describeAuthorizer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAuthorizerRequest,
  output: DescribeAuthorizerResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Describes a certificate provider.
 *
 * Requires permission to access the DescribeCertificateProvider action.
 */
export const describeCertificateProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeCertificateProviderRequest,
    output: DescribeCertificateProviderResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Gets information about a Device Defender detect custom metric.
 *
 * Requires permission to access the DescribeCustomMetric action.
 */
export const describeCustomMetric = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeCustomMetricRequest,
    output: DescribeCustomMetricResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes the default authorizer.
 *
 * Requires permission to access the DescribeDefaultAuthorizer action.
 */
export const describeDefaultAuthorizer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDefaultAuthorizerRequest,
    output: DescribeDefaultAuthorizerResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Provides details about a dimension that is defined in your Amazon Web Services accounts.
 *
 * Requires permission to access the DescribeDimension action.
 */
export const describeDimension = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDimensionRequest,
  output: DescribeDimensionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves the encryption configuration for resources and data of your Amazon Web Services account in
 * Amazon Web Services IoT Core. For more information, see Data encryption at rest in
 * the *Amazon Web Services IoT Core Developer Guide*.
 */
export const describeEncryptionConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeEncryptionConfigurationRequest,
    output: DescribeEncryptionConfigurationResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }));
/**
 * Returns or creates a unique endpoint specific to the Amazon Web Services account making the
 * call.
 *
 * The first time `DescribeEndpoint` is called, an endpoint is created. All subsequent calls to `DescribeEndpoint` return the same endpoint.
 *
 * Requires permission to access the DescribeEndpoint action.
 */
export const describeEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEndpointRequest,
  output: DescribeEndpointResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about the specified fleet metric.
 *
 * Requires permission to access the DescribeFleetMetric action.
 */
export const describeFleetMetric = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFleetMetricRequest,
  output: DescribeFleetMetricResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Describes a search index.
 *
 * Requires permission to access the DescribeIndex action.
 */
export const describeIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeIndexRequest,
  output: DescribeIndexResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Returns information about a job template.
 */
export const describeJobTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeJobTemplateRequest,
  output: DescribeJobTemplateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets information about a mitigation action.
 *
 * Requires permission to access the DescribeMitigationAction action.
 */
export const describeMitigationAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeMitigationActionRequest,
    output: DescribeMitigationActionResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns information about a provisioning template.
 *
 * Requires permission to access the DescribeProvisioningTemplate action.
 */
export const describeProvisioningTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeProvisioningTemplateRequest,
    output: DescribeProvisioningTemplateResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }));
/**
 * Returns information about a provisioning template version.
 *
 * Requires permission to access the DescribeProvisioningTemplateVersion action.
 */
export const describeProvisioningTemplateVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeProvisioningTemplateVersionRequest,
    output: DescribeProvisioningTemplateVersionResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }));
/**
 * Gets information about a scheduled audit.
 *
 * Requires permission to access the DescribeScheduledAudit action.
 */
export const describeScheduledAudit = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeScheduledAuditRequest,
    output: DescribeScheduledAuditResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Gets information about a Device Defender security profile.
 *
 * Requires permission to access the DescribeSecurityProfile action.
 */
export const describeSecurityProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeSecurityProfileRequest,
    output: DescribeSecurityProfileResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Gets information about the specified thing.
 *
 * Requires permission to access the DescribeThing action.
 */
export const describeThing = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeThingRequest,
  output: DescribeThingResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Describes a bulk thing provisioning task.
 *
 * Requires permission to access the DescribeThingRegistrationTask action.
 */
export const describeThingRegistrationTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeThingRegistrationTaskRequest,
    output: DescribeThingRegistrationTaskResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }));
/**
 * Gets information about the specified command.
 */
export const getCommand = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCommandRequest,
  output: GetCommandResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a job document.
 *
 * Requires permission to access the GetJobDocument action.
 */
export const getJobDocument = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobDocumentRequest,
  output: GetJobDocumentResponse,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Gets information about the specified software package.
 *
 * Requires permission to access the GetPackage action.
 */
export const getPackage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPackageRequest,
  output: GetPackageResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about the specified software package's configuration.
 *
 * Requires permission to access the GetPackageConfiguration action.
 */
export const getPackageConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetPackageConfigurationRequest,
    output: GetPackageConfigurationResponse,
    errors: [InternalServerException, ThrottlingException],
  }),
);
/**
 * Gets information about the specified package version.
 *
 * Requires permission to access the GetPackageVersion action.
 */
export const getPackageVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPackageVersionRequest,
  output: GetPackageVersionResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about the specified policy with the policy document of the default
 * version.
 *
 * Requires permission to access the GetPolicy action.
 */
export const getPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyRequest,
  output: GetPolicyResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about the specified policy version.
 *
 * Requires permission to access the GetPolicyVersion action.
 */
export const getPolicyVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyVersionRequest,
  output: GetPolicyVersionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Retrieves the live connectivity status per device.
 */
export const getThingConnectivityData = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetThingConnectivityDataRequest,
    output: GetThingConnectivityDataResponse,
    errors: [
      IndexNotReadyException,
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Lists the findings (results) of a Device Defender audit or of the audits
 * performed during a specified time period. (Findings are retained for 90 days.)
 *
 * Requires permission to access the ListAuditFindings action.
 */
export const listAuditFindings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAuditFindingsRequest,
  output: ListAuditFindingsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * List the device certificates signed by the specified CA certificate.
 *
 * Requires permission to access the ListCertificatesByCA action.
 */
export const listCertificatesByCA = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListCertificatesByCARequest,
    output: ListCertificatesByCAResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Lists your Device Defender detect custom metrics.
 *
 * Requires permission to access the ListCustomMetrics action.
 */
export const listCustomMetrics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCustomMetricsRequest,
  output: ListCustomMetricsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * List of Device Defender ML Detect mitigation actions tasks.
 *
 * Requires permission to access the ListDetectMitigationActionsTasks action.
 */
export const listDetectMitigationActionsTasks =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDetectMitigationActionsTasksRequest,
    output: ListDetectMitigationActionsTasksResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
    ],
  }));
/**
 * List the set of dimensions that are defined for your Amazon Web Services accounts.
 *
 * Requires permission to access the ListDimensions action.
 */
export const listDimensions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDimensionsRequest,
  output: ListDimensionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Lists the search indices.
 *
 * Requires permission to access the ListIndices action.
 */
export const listIndices = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListIndicesRequest,
  output: ListIndicesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Lists your policies.
 *
 * Requires permission to access the ListPolicies action.
 */
export const listPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPoliciesRequest,
  output: ListPoliciesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the principals associated with the specified policy.
 *
 * **Note:** This action is deprecated and works as
 * expected for backward compatibility, but we won't add enhancements. Use ListTargetsForPolicy instead.
 *
 * Requires permission to access the ListPolicyPrincipals action.
 */
export const listPolicyPrincipals = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListPolicyPrincipalsRequest,
    output: ListPolicyPrincipalsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Lists the policies attached to the specified principal. If you use an Cognito
 * identity, the ID must be in AmazonCognito Identity format.
 *
 * **Note:** This action is deprecated and works as
 * expected for backward compatibility, but we won't add enhancements. Use ListAttachedPolicies instead.
 *
 * Requires permission to access the ListPrincipalPolicies action.
 */
export const listPrincipalPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListPrincipalPoliciesRequest,
    output: ListPrincipalPoliciesResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Lists the things associated with the specified principal. A principal can be X.509
 * certificates, IAM users, groups, and roles, Amazon Cognito identities or federated
 * identities.
 *
 * Requires permission to access the ListPrincipalThings action.
 */
export const listPrincipalThings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPrincipalThingsRequest,
  output: ListPrincipalThingsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the role aliases registered in your account.
 *
 * Requires permission to access the ListRoleAliases action.
 */
export const listRoleAliases = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRoleAliasesRequest,
  output: ListRoleAliasesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the tags (metadata) you have assigned to the resource.
 *
 * Requires permission to access the ListTagsForResource action.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * List targets for the specified policy.
 *
 * Requires permission to access the ListTargetsForPolicy action.
 */
export const listTargetsForPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTargetsForPolicyRequest,
    output: ListTargetsForPolicyResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * List the thing groups in your account.
 *
 * Requires permission to access the ListThingGroups action.
 */
export const listThingGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListThingGroupsRequest,
  output: ListThingGroupsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * List the thing groups to which the specified thing belongs.
 *
 * Requires permission to access the ListThingGroupsForThing action.
 */
export const listThingGroupsForThing = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListThingGroupsForThingRequest,
    output: ListThingGroupsForThingResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists the principals associated with the specified thing. A principal can be X.509
 * certificates, IAM users, groups, and roles, Amazon Cognito identities or federated
 * identities.
 *
 * Requires permission to access the ListThingPrincipals action.
 */
export const listThingPrincipals = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListThingPrincipalsRequest,
  output: ListThingPrincipalsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Information about the thing registration tasks.
 */
export const listThingRegistrationTaskReports =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListThingRegistrationTaskReportsRequest,
    output: ListThingRegistrationTaskReportsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }));
/**
 * List bulk thing provisioning tasks.
 *
 * Requires permission to access the ListThingRegistrationTasks action.
 */
export const listThingRegistrationTasks = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListThingRegistrationTasksRequest,
    output: ListThingRegistrationTasksResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Lists the things you have added to the given billing group.
 *
 * Requires permission to access the ListThingsInBillingGroup action.
 */
export const listThingsInBillingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListThingsInBillingGroupRequest,
    output: ListThingsInBillingGroupResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists the things in the specified group.
 *
 * Requires permission to access the ListThingsInThingGroup action.
 */
export const listThingsInThingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListThingsInThingGroupRequest,
    output: ListThingsInThingGroupResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Replaces the rule. You must specify all parameters for the new rule. Creating rules
 * is an administrator-level action. Any user who has permission to create rules will be able
 * to access data processed by the rule.
 *
 * Requires permission to access the ReplaceTopicRule action.
 */
export const replaceTopicRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReplaceTopicRuleRequest,
  output: ReplaceTopicRuleResponse,
  errors: [
    ConflictingResourceUpdateException,
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
    SqlParseException,
    UnauthorizedException,
  ],
}));
/**
 * Sets the default authorizer. This will be used if a websocket connection is made
 * without specifying an authorizer.
 *
 * Requires permission to access the SetDefaultAuthorizer action.
 */
export const setDefaultAuthorizer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SetDefaultAuthorizerRequest,
    output: SetDefaultAuthorizerResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceAlreadyExistsException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Sets the logging options.
 *
 * NOTE: use of this command is not recommended. Use `SetV2LoggingOptions`
 * instead.
 *
 * Requires permission to access the SetLoggingOptions action.
 */
export const setLoggingOptions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetLoggingOptionsRequest,
  output: SetLoggingOptionsResponse,
  errors: [
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
  ],
}));
/**
 * Sets the logging level.
 *
 * Requires permission to access the SetV2LoggingLevel action.
 */
export const setV2LoggingLevel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetV2LoggingLevelRequest,
  output: SetV2LoggingLevelResponse,
  errors: [
    InternalException,
    InvalidRequestException,
    LimitExceededException,
    NotConfiguredException,
    ServiceUnavailableException,
  ],
}));
/**
 * Sets the logging options for the V2 logging service.
 *
 * Requires permission to access the SetV2LoggingOptions action.
 */
export const setV2LoggingOptions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetV2LoggingOptionsRequest,
  output: SetV2LoggingOptionsResponse,
  errors: [
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
  ],
}));
/**
 * Starts an on-demand Device Defender audit.
 *
 * Requires permission to access the StartOnDemandAuditTask action.
 */
export const startOnDemandAuditTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartOnDemandAuditTaskRequest,
    output: StartOnDemandAuditTaskResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates a bulk thing provisioning task.
 *
 * Requires permission to access the StartThingRegistrationTask action.
 */
export const startThingRegistrationTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartThingRegistrationTaskRequest,
    output: StartThingRegistrationTaskResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Updates an authorizer.
 *
 * Requires permission to access the UpdateAuthorizer action.
 */
export const updateAuthorizer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAuthorizerRequest,
  output: UpdateAuthorizerResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Updates information about the billing group.
 *
 * Requires permission to access the UpdateBillingGroup action.
 */
export const updateBillingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBillingGroupRequest,
  output: UpdateBillingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
    VersionConflictException,
  ],
}));
/**
 * Updates a certificate provider.
 *
 * Requires permission to access the UpdateCertificateProvider action.
 */
export const updateCertificateProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateCertificateProviderRequest,
    output: UpdateCertificateProviderResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Update information about a command or mark a command for deprecation.
 */
export const updateCommand = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCommandRequest,
  output: UpdateCommandResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a
 * Device Defender detect custom metric.
 *
 * Requires permission to access the UpdateCustomMetric action.
 */
export const updateCustomMetric = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCustomMetricRequest,
  output: UpdateCustomMetricResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the definition for a dimension. You
 * cannot
 * change the type of a dimension after
 * it is created (you can delete it and
 * recreate
 * it).
 *
 * Requires permission to access the UpdateDimension action.
 */
export const updateDimension = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDimensionRequest,
  output: UpdateDimensionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates values stored in the domain configuration. Domain configurations for default
 * endpoints can't be updated.
 *
 * Requires permission to access the UpdateDomainConfiguration action.
 */
export const updateDomainConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDomainConfigurationRequest,
    output: UpdateDomainConfigurationResponse,
    errors: [
      CertificateValidationException,
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Updates the data for a fleet metric.
 *
 * Requires permission to access the UpdateFleetMetric action.
 */
export const updateFleetMetric = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFleetMetricRequest,
  output: UpdateFleetMetricResponse,
  errors: [
    IndexNotReadyException,
    InternalFailureException,
    InvalidAggregationException,
    InvalidQueryException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    VersionConflictException,
  ],
}));
/**
 * Updates the definition for the specified mitigation action.
 *
 * Requires permission to access the UpdateMitigationAction action.
 */
export const updateMitigationAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateMitigationActionRequest,
    output: UpdateMitigationActionResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates a role alias.
 *
 * Requires permission to access the UpdateRoleAlias action.
 *
 * The value of
 * `credentialDurationSeconds`
 * must be less than or equal to the
 * maximum session duration of the IAM role that the role alias references. For more
 * information, see Modifying a role maximum session duration (Amazon Web Services API) from the Amazon Web Services
 * Identity and Access Management User Guide.
 */
export const updateRoleAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRoleAliasRequest,
  output: UpdateRoleAliasResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Updates a scheduled audit, including which checks are performed and
 * how often the audit takes place.
 *
 * Requires permission to access the UpdateScheduledAudit action.
 */
export const updateScheduledAudit = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateScheduledAuditRequest,
    output: UpdateScheduledAuditResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates a Device Defender security profile.
 *
 * Requires permission to access the UpdateSecurityProfile action.
 */
export const updateSecurityProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSecurityProfileRequest,
    output: UpdateSecurityProfileResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
      VersionConflictException,
    ],
  }),
);
/**
 * Updates an existing stream. The stream version will be incremented by one.
 *
 * Requires permission to access the UpdateStream action.
 */
export const updateStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStreamRequest,
  output: UpdateStreamResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Update a thing group.
 *
 * Requires permission to access the UpdateThingGroup action.
 */
export const updateThingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateThingGroupRequest,
  output: UpdateThingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
    VersionConflictException,
  ],
}));
/**
 * Creates a Device Defender audit suppression.
 *
 * Requires permission to access the CreateAuditSuppression action.
 */
export const createAuditSuppression = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAuditSuppressionRequest,
    output: CreateAuditSuppressionResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates an authorizer.
 *
 * Requires permission to access the CreateAuthorizer action.
 */
export const createAuthorizer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAuthorizerRequest,
  output: CreateAuthorizerResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a billing group. If this call is made multiple times using
 * the same billing group name and configuration, the call will succeed. If this call is made with
 * the same billing group name but different configuration a `ResourceAlreadyExistsException` is thrown.
 *
 * Requires permission to access the CreateBillingGroup action.
 */
export const createBillingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBillingGroupRequest,
  output: CreateBillingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Creates an Amazon Web Services IoT Core certificate provider. You can use Amazon Web Services IoT Core certificate provider to
 * customize how to sign a certificate signing request (CSR) in IoT fleet provisioning. For
 * more information, see Customizing certificate
 * signing using Amazon Web Services IoT Core certificate provider from Amazon Web Services IoT Core Developer
 * Guide.
 *
 * Requires permission to access the CreateCertificateProvider action.
 *
 * After you create a certificate provider, the behavior of
 * `CreateCertificateFromCsr` API for fleet provisioning will
 * change and all API calls to `CreateCertificateFromCsr` will invoke the
 * certificate provider to create the certificates. It can take up to a few minutes for
 * this behavior to change after a certificate provider is created.
 */
export const createCertificateProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCertificateProviderRequest,
    output: CreateCertificateProviderResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Creates a domain configuration.
 *
 * Requires permission to access the CreateDomainConfiguration action.
 */
export const createDomainConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDomainConfigurationRequest,
    output: CreateDomainConfigurationResponse,
    errors: [
      CertificateValidationException,
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Creates a dynamic thing group.
 *
 * Requires permission to access the CreateDynamicThingGroup action.
 */
export const createDynamicThingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDynamicThingGroupRequest,
    output: CreateDynamicThingGroupResponse,
    errors: [
      InternalFailureException,
      InvalidQueryException,
      InvalidRequestException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates a fleet metric.
 *
 * Requires permission to access the CreateFleetMetric action.
 */
export const createFleetMetric = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFleetMetricRequest,
  output: CreateFleetMetricResponse,
  errors: [
    IndexNotReadyException,
    InternalFailureException,
    InvalidAggregationException,
    InvalidQueryException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a job template.
 *
 * Requires permission to access the CreateJobTemplate action.
 */
export const createJobTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateJobTemplateRequest,
  output: CreateJobTemplateResponse,
  errors: [
    ConflictException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a 2048-bit RSA key pair and issues an X.509 certificate using the issued
 * public key. You can also call `CreateKeysAndCertificate` over MQTT from a
 * device, for more information, see Provisioning MQTT API.
 *
 * **Note** This is the only time IoT issues the private key
 * for this certificate, so it is important to keep it in a secure location.
 *
 * Requires permission to access the CreateKeysAndCertificate action.
 */
export const createKeysAndCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateKeysAndCertificateRequest,
    output: CreateKeysAndCertificateResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Creates a new version for an existing IoT software package.
 *
 * Requires permission to access the CreatePackageVersion and GetIndexingConfiguration actions.
 */
export const createPackageVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreatePackageVersionRequest,
    output: CreatePackageVersionResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates an IoT policy.
 *
 * The created policy is the default version for the policy. This operation creates a
 * policy version with a version identifier of **1** and sets
 * **1** as the policy's default version.
 *
 * Requires permission to access the CreatePolicy action.
 */
export const createPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePolicyRequest,
  output: CreatePolicyResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    MalformedPolicyException,
    ResourceAlreadyExistsException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a new version of the specified IoT policy. To update a policy, create a
 * new policy version. A managed policy can have up to five versions. If the policy has five
 * versions, you must use DeletePolicyVersion to delete an existing version
 * before you create a new one.
 *
 * Optionally, you can set the new version as the policy's default version. The default
 * version is the operative version (that is, the version that is in effect for the
 * certificates to which the policy is attached).
 *
 * Requires permission to access the CreatePolicyVersion action.
 */
export const createPolicyVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePolicyVersionRequest,
  output: CreatePolicyVersionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    MalformedPolicyException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    VersionsLimitExceededException,
  ],
}));
/**
 * Creates a provisioning template.
 *
 * Requires permission to access the CreateProvisioningTemplate action.
 */
export const createProvisioningTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateProvisioningTemplateRequest,
    output: CreateProvisioningTemplateResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Creates a stream for delivering one or more large files in chunks over MQTT. A stream transports data
 * bytes in chunks or blocks packaged as MQTT messages from a source like S3. You can have one or more files
 * associated with a stream.
 *
 * Requires permission to access the CreateStream action.
 */
export const createStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStreamRequest,
  output: CreateStreamResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Returns information about a billing group.
 *
 * Requires permission to access the DescribeBillingGroup action.
 */
export const describeBillingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeBillingGroupRequest,
    output: DescribeBillingGroupResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Gets summary information about a domain configuration.
 *
 * Requires permission to access the DescribeDomainConfiguration action.
 */
export const describeDomainConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDomainConfigurationRequest,
    output: DescribeDomainConfigurationResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Describes event configurations.
 *
 * Requires permission to access the DescribeEventConfigurations action.
 */
export const describeEventConfigurations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeEventConfigurationsRequest,
    output: DescribeEventConfigurationsResponse,
    errors: [InternalFailureException, ThrottlingException],
  }),
);
/**
 * View details of a managed job template.
 */
export const describeManagedJobTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeManagedJobTemplateRequest,
    output: DescribeManagedJobTemplateResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes a role alias.
 *
 * Requires permission to access the DescribeRoleAlias action.
 */
export const describeRoleAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRoleAliasRequest,
  output: DescribeRoleAliasResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about a stream.
 *
 * Requires permission to access the DescribeStream action.
 */
export const describeStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStreamRequest,
  output: DescribeStreamResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Describe a thing group.
 *
 * Requires permission to access the DescribeThingGroup action.
 */
export const describeThingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeThingGroupRequest,
  output: DescribeThingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets information about the specified thing type.
 *
 * Requires permission to access the DescribeThingType action.
 */
export const describeThingType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeThingTypeRequest,
  output: DescribeThingTypeResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Returns a Device Defender's ML Detect Security Profile training model's status.
 *
 * Requires permission to access the GetBehaviorModelTrainingSummaries action.
 */
export const getBehaviorModelTrainingSummaries =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetBehaviorModelTrainingSummariesRequest,
    output: GetBehaviorModelTrainingSummariesResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Returns the approximate count of unique values that match the query.
 *
 * Requires permission to access the GetCardinality action.
 */
export const getCardinality = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCardinalityRequest,
  output: GetCardinalityResponse,
  errors: [
    IndexNotReadyException,
    InternalFailureException,
    InvalidAggregationException,
    InvalidQueryException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets a list of the policies that have an effect on the authorization behavior of the
 * specified device when it connects to the IoT device gateway.
 *
 * Requires permission to access the GetEffectivePolicies action.
 */
export const getEffectivePolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetEffectivePoliciesRequest,
    output: GetEffectivePoliciesResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Groups the aggregated values that match the query into percentile groupings. The default
 * percentile groupings are: 1,5,25,50,75,95,99, although you can specify your own
 * when you call `GetPercentiles`. This function returns a value for each
 * percentile group specified (or the default percentile groupings). The percentile group
 * "1" contains the aggregated field value that occurs in approximately one percent of the
 * values that match the query. The percentile group "5" contains the aggregated field value
 * that occurs in approximately five percent of the values that match the query, and so on.
 * The result is an approximation, the more values that match the query, the more accurate
 * the percentile values.
 *
 * Requires permission to access the GetPercentiles action.
 */
export const getPercentiles = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPercentilesRequest,
  output: GetPercentilesResponse,
  errors: [
    IndexNotReadyException,
    InternalFailureException,
    InvalidAggregationException,
    InvalidQueryException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Returns the count, average, sum, minimum, maximum, sum of squares, variance,
 * and standard deviation for the specified aggregated field. If the aggregation field is of type
 * `String`, only the count statistic is returned.
 *
 * Requires permission to access the GetStatistics action.
 */
export const getStatistics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStatisticsRequest,
  output: GetStatisticsResponse,
  errors: [
    IndexNotReadyException,
    InternalFailureException,
    InvalidAggregationException,
    InvalidQueryException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about the rule.
 *
 * Requires permission to access the GetTopicRule action.
 */
export const getTopicRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTopicRuleRequest,
  output: GetTopicRuleResponse,
  errors: [
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Gets the fine grained logging options.
 *
 * Requires permission to access the GetV2LoggingOptions action.
 */
export const getV2LoggingOptions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetV2LoggingOptionsRequest,
  output: GetV2LoggingOptionsResponse,
  errors: [
    InternalException,
    NotConfiguredException,
    ServiceUnavailableException,
  ],
}));
/**
 * Lists the policies attached to the specified thing group.
 *
 * Requires permission to access the ListAttachedPolicies action.
 */
export const listAttachedPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAttachedPoliciesRequest,
    output: ListAttachedPoliciesResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Gets the status of audit mitigation action tasks that were
 * executed.
 *
 * Requires permission to access the ListAuditMitigationActionsExecutions action.
 */
export const listAuditMitigationActionsExecutions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAuditMitigationActionsExecutionsRequest,
    output: ListAuditMitigationActionsExecutionsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
    ],
  }));
/**
 * Gets a list of audit mitigation action tasks that match the specified filters.
 *
 * Requires permission to access the ListAuditMitigationActionsTasks action.
 */
export const listAuditMitigationActionsTasks =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAuditMitigationActionsTasksRequest,
    output: ListAuditMitigationActionsTasksResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
    ],
  }));
/**
 * Lists your Device Defender audit listings.
 *
 * Requires permission to access the ListAuditSuppressions action.
 */
export const listAuditSuppressions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAuditSuppressionsRequest,
    output: ListAuditSuppressionsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists the Device Defender audits that have been performed during a given
 * time period.
 *
 * Requires permission to access the ListAuditTasks action.
 */
export const listAuditTasks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAuditTasksRequest,
  output: ListAuditTasksResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Lists the authorizers registered in your account.
 *
 * Requires permission to access the ListAuthorizers action.
 */
export const listAuthorizers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAuthorizersRequest,
  output: ListAuthorizersResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the billing groups you have created.
 *
 * Requires permission to access the ListBillingGroups action.
 */
export const listBillingGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBillingGroupsRequest,
  output: ListBillingGroupsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists the CA certificates registered for your Amazon Web Services account.
 *
 * The results are paginated with a default page size of 25. You can use the returned
 * marker to retrieve additional results.
 *
 * Requires permission to access the ListCACertificates action.
 */
export const listCACertificates = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCACertificatesRequest,
  output: ListCACertificatesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Lists all your certificate providers in your Amazon Web Services account.
 *
 * Requires permission to access the ListCertificateProviders action.
 */
export const listCertificateProviders = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListCertificateProvidersRequest,
    output: ListCertificateProvidersResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Lists the certificates registered in your Amazon Web Services account.
 *
 * The results are paginated with a default page size of 25. You can use the returned
 * marker to retrieve additional results.
 *
 * Requires permission to access the ListCertificates action.
 */
export const listCertificates = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCertificatesRequest,
  output: ListCertificatesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * List all commands in your account.
 */
export const listCommands = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCommandsRequest,
  output: ListCommandsResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
}));
/**
 * Lists mitigation actions executions for a Device Defender ML Detect Security Profile.
 *
 * Requires permission to access the ListDetectMitigationActionsExecutions action.
 */
export const listDetectMitigationActionsExecutions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDetectMitigationActionsExecutionsRequest,
    output: ListDetectMitigationActionsExecutionsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
    ],
  }));
/**
 * Gets a list of domain configurations for the user. This list is sorted
 * alphabetically by domain configuration name.
 *
 * Requires permission to access the ListDomainConfigurations action.
 */
export const listDomainConfigurations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDomainConfigurationsRequest,
    output: ListDomainConfigurationsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Lists all your fleet metrics.
 *
 * Requires permission to access the ListFleetMetrics action.
 */
export const listFleetMetrics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFleetMetricsRequest,
  output: ListFleetMetricsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the job executions for the specified thing.
 *
 * Requires permission to access the ListJobExecutionsForThing action.
 */
export const listJobExecutionsForThing = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListJobExecutionsForThingRequest,
    output: ListJobExecutionsForThingResponse,
    errors: [
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists jobs.
 *
 * Requires permission to access the ListJobs action.
 */
export const listJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListJobsRequest,
  output: ListJobsResponse,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Returns a list of job templates.
 *
 * Requires permission to access the ListJobTemplates action.
 */
export const listJobTemplates = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListJobTemplatesRequest,
  output: ListJobTemplatesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Returns a list of managed job templates.
 */
export const listManagedJobTemplates = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListManagedJobTemplatesRequest,
    output: ListManagedJobTemplatesResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists the values reported for an IoT Device Defender metric (device-side metric, cloud-side metric, or custom metric)
 * by the given thing during the specified time period.
 */
export const listMetricValues = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMetricValuesRequest,
  output: ListMetricValuesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets a list of all mitigation actions that match the specified filter criteria.
 *
 * Requires permission to access the ListMitigationActions action.
 */
export const listMitigationActions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListMitigationActionsRequest,
    output: ListMitigationActionsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists OTA updates.
 *
 * Requires permission to access the ListOTAUpdates action.
 */
export const listOTAUpdates = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListOTAUpdatesRequest,
  output: ListOTAUpdatesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Lists certificates that are being transferred but not yet accepted.
 *
 * Requires permission to access the ListOutgoingCertificates action.
 */
export const listOutgoingCertificates = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListOutgoingCertificatesRequest,
    output: ListOutgoingCertificatesResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Lists the software packages associated to the account.
 *
 * Requires permission to access the ListPackages action.
 */
export const listPackages = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPackagesRequest,
  output: ListPackagesResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
}));
/**
 * Lists the software package versions associated to the account.
 *
 * Requires permission to access the ListPackageVersions action.
 */
export const listPackageVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPackageVersionsRequest,
  output: ListPackageVersionsResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
}));
/**
 * Lists the versions of the specified policy and identifies the default
 * version.
 *
 * Requires permission to access the ListPolicyVersions action.
 */
export const listPolicyVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPolicyVersionsRequest,
  output: ListPolicyVersionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the things associated with the specified principal. A principal can be an X.509
 * certificate or an Amazon Cognito ID.
 *
 * Requires permission to access the ListPrincipalThings action.
 */
export const listPrincipalThingsV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListPrincipalThingsV2Request,
    output: ListPrincipalThingsV2Response,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Lists the provisioning templates in your Amazon Web Services account.
 *
 * Requires permission to access the ListProvisioningTemplates action.
 */
export const listProvisioningTemplates = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListProvisioningTemplatesRequest,
    output: ListProvisioningTemplatesResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * A list of provisioning template versions.
 *
 * Requires permission to access the ListProvisioningTemplateVersions action.
 */
export const listProvisioningTemplateVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListProvisioningTemplateVersionsRequest,
    output: ListProvisioningTemplateVersionsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }));
/**
 * The validation results for all software bill of materials (SBOM) attached to a specific software package version.
 *
 * Requires permission to access the ListSbomValidationResults action.
 */
export const listSbomValidationResults = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSbomValidationResultsRequest,
    output: ListSbomValidationResultsResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all of your scheduled audits.
 *
 * Requires permission to access the ListScheduledAudits action.
 */
export const listScheduledAudits = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListScheduledAuditsRequest,
  output: ListScheduledAuditsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Lists the Device Defender security profiles
 * you've
 * created. You can filter security profiles by dimension or custom metric.
 *
 * Requires permission to access the ListSecurityProfiles action.
 *
 * `dimensionName` and `metricName` cannot be used in the same request.
 */
export const listSecurityProfiles = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSecurityProfilesRequest,
    output: ListSecurityProfilesResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists the Device Defender security profiles attached to a target (thing group).
 *
 * Requires permission to access the ListSecurityProfilesForTarget action.
 */
export const listSecurityProfilesForTarget =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListSecurityProfilesForTargetRequest,
    output: ListSecurityProfilesForTargetResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Lists all of the streams in your Amazon Web Services account.
 *
 * Requires permission to access the ListStreams action.
 */
export const listStreams = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStreamsRequest,
  output: ListStreamsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the targets (thing groups) associated with a given Device Defender security profile.
 *
 * Requires permission to access the ListTargetsForSecurityProfile action.
 */
export const listTargetsForSecurityProfile =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListTargetsForSecurityProfileRequest,
    output: ListTargetsForSecurityProfileResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Lists the principals associated with the specified thing. A principal can be an X.509
 * certificate or an Amazon Cognito ID.
 *
 * Requires permission to access the ListThingPrincipals action.
 */
export const listThingPrincipalsV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListThingPrincipalsV2Request,
    output: ListThingPrincipalsV2Response,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Lists your things. Use the **attributeName** and **attributeValue** parameters to filter your things. For example,
 * calling `ListThings` with attributeName=Color and attributeValue=Red
 * retrieves all things in the registry that contain an attribute **Color** with the value **Red**. For more
 * information, see List Things from the Amazon Web Services IoT Core Developer
 * Guide.
 *
 * Requires permission to access the ListThings action.
 *
 * You will not be charged for calling this API if an `Access denied` error is returned. You will also not be charged if no attributes or pagination token was provided in request and no pagination token and no results were returned.
 */
export const listThings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListThingsRequest,
  output: ListThingsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the existing thing types.
 *
 * Requires permission to access the ListThingTypes action.
 */
export const listThingTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListThingTypesRequest,
  output: ListThingTypesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the rules for the specific topic.
 *
 * Requires permission to access the ListTopicRules action.
 */
export const listTopicRules = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTopicRulesRequest,
  output: ListTopicRulesResponse,
  errors: [
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Lists logging levels.
 *
 * Requires permission to access the ListV2LoggingLevels action.
 */
export const listV2LoggingLevels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListV2LoggingLevelsRequest,
  output: ListV2LoggingLevelsResponse,
  errors: [
    InternalException,
    InvalidRequestException,
    NotConfiguredException,
    ServiceUnavailableException,
  ],
}));
/**
 * Lists the Device Defender security profile violations discovered during the given time period.
 * You can use filters to limit the results to those alerts issued for a particular security profile,
 * behavior, or thing (device).
 *
 * Requires permission to access the ListViolationEvents action.
 */
export const listViolationEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListViolationEventsRequest,
  output: ListViolationEventsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Registers a device certificate with IoT in the same certificate mode as the signing CA. If you have more than one CA certificate that has the same subject field, you must
 * specify the CA certificate that was used to sign the device certificate being
 * registered.
 *
 * Requires permission to access the RegisterCertificate action.
 */
export const registerCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterCertificateRequest,
  output: RegisterCertificateResponse,
  errors: [
    CertificateConflictException,
    CertificateStateException,
    CertificateValidationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Register a certificate that does not have a certificate authority (CA).
 * For supported certificates, consult
 * Certificate signing algorithms supported by IoT.
 */
export const registerCertificateWithoutCA =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RegisterCertificateWithoutCARequest,
    output: RegisterCertificateWithoutCAResponse,
    errors: [
      CertificateStateException,
      CertificateValidationException,
      InternalFailureException,
      InvalidRequestException,
      ResourceAlreadyExistsException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }));
/**
 * Transfers the specified certificate to the specified Amazon Web Services account.
 *
 * Requires permission to access the TransferCertificate action.
 *
 * You can cancel the transfer until it is accepted by the recipient.
 *
 * No notification is sent to the transfer destination's account. The caller is responsible for notifying the transfer target.
 *
 * The certificate being transferred must not be in the `ACTIVE` state. You can use the
 * UpdateCertificate action to deactivate it.
 *
 * The certificate must not have any policies attached to it. You can use the
 * DetachPolicy action to detach them.
 *
 * **Customer managed key behavior:** When you use a customer managed key to encrypt your data and then transfer
 * the certificate to a customer in a different account using the `TransferCertificate` operation, the certificates will no longer be encrypted by their
 * customer managed key configuration. During the transfer process, certificates are encrypted using Amazon Web Services IoT Core owned keys.
 *
 * While a certificate is in the **PENDING_TRANSFER** state, it's always protected by Amazon Web Services IoT Core owned keys, regardless of the customer managed key configuration of either the source or destination account.
 *
 * Once the transfer is completed through AcceptCertificateTransfer, RejectCertificateTransfer, or
 * CancelCertificateTransfer, the certificate will be protected by the customer managed key configuration of the account that owns
 * the certificate after the transfer operation:
 *
 * - If the transfer is accepted: The certificate is encrypted by the target account's customer managed key configuration.
 *
 * - If the transfer is rejected or cancelled: The certificate is protected by the source account's customer managed key configuration.
 */
export const transferCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TransferCertificateRequest,
  output: TransferCertificateResponse,
  errors: [
    CertificateStateException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    TransferConflictException,
    UnauthorizedException,
  ],
}));
/**
 * Updates a dynamic thing group.
 *
 * Requires permission to access the UpdateDynamicThingGroup action.
 */
export const updateDynamicThingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDynamicThingGroupRequest,
    output: UpdateDynamicThingGroupResponse,
    errors: [
      InternalFailureException,
      InvalidQueryException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
      VersionConflictException,
    ],
  }),
);
/**
 * Validates a Device Defender security profile behaviors specification.
 *
 * Requires permission to access the ValidateSecurityProfileBehaviors action.
 */
export const validateSecurityProfileBehaviors =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ValidateSecurityProfileBehaviorsRequest,
    output: ValidateSecurityProfileBehaviorsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
    ],
  }));
/**
 * Associates the selected software bill of materials (SBOM) with a specific software package version.
 *
 * Requires permission to access the AssociateSbomWithPackageVersion action.
 */
export const associateSbomWithPackageVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateSbomWithPackageVersionRequest,
    output: AssociateSbomWithPackageVersionResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Defines an action that can be applied to audit findings by using StartAuditMitigationActionsTask. Only certain types of mitigation actions can be applied to specific check names.
 * For more information, see Mitigation actions. Each mitigation action can apply only one type of change.
 *
 * Requires permission to access the CreateMitigationAction action.
 */
export const createMitigationAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateMitigationActionRequest,
    output: CreateMitigationActionResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates an IoT software package that can be deployed to your fleet.
 *
 * Requires permission to access the CreatePackage and GetIndexingConfiguration actions.
 */
export const createPackage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePackageRequest,
  output: CreatePackageResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a thing record in the registry. If this call is made multiple times using
 * the same thing name and configuration, the call will succeed. If this call is made with
 * the same thing name but different configuration a
 * `ResourceAlreadyExistsException` is thrown.
 *
 * This is a control plane operation. See Authorization for
 * information about authorizing control plane actions.
 *
 * Requires permission to access the CreateThing action.
 */
export const createThing = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateThingRequest,
  output: CreateThingResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a topic rule destination. The destination must be confirmed prior to use.
 *
 * Requires permission to access the CreateTopicRuleDestination action.
 */
export const createTopicRuleDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateTopicRuleDestinationRequest,
    output: CreateTopicRuleDestinationResponse,
    errors: [
      ConflictingResourceUpdateException,
      InternalException,
      InvalidRequestException,
      ResourceAlreadyExistsException,
      ServiceUnavailableException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Gets information about the Device Defender audit settings for this account.
 * Settings include how audit notifications are sent and which audit checks are
 * enabled or disabled.
 *
 * Requires permission to access the DescribeAccountAuditConfiguration action.
 */
export const describeAccountAuditConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAccountAuditConfigurationRequest,
    output: DescribeAccountAuditConfigurationResponse,
    errors: [InternalFailureException, ThrottlingException],
  }));
/**
 * Gets information about a single audit finding. Properties include the reason for
 * noncompliance, the severity of the issue,
 * and the start time
 * when the audit that returned the
 * finding.
 *
 * Requires permission to access the DescribeAuditFinding action.
 */
export const describeAuditFinding = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAuditFindingRequest,
    output: DescribeAuditFindingResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Gets information about an audit mitigation task that is used to apply mitigation actions to a set of audit findings. Properties include the actions being applied, the audit checks to which they're being applied, the task status, and aggregated task statistics.
 */
export const describeAuditMitigationActionsTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAuditMitigationActionsTaskRequest,
    output: DescribeAuditMitigationActionsTaskResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Gets information about a Device Defender audit.
 *
 * Requires permission to access the DescribeAuditTask action.
 */
export const describeAuditTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAuditTaskRequest,
  output: DescribeAuditTaskResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes a registered CA certificate.
 *
 * Requires permission to access the DescribeCACertificate action.
 */
export const describeCACertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeCACertificateRequest,
    output: DescribeCACertificateResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Gets information about the specified certificate.
 *
 * Requires permission to access the DescribeCertificate action.
 */
export const describeCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCertificateRequest,
  output: DescribeCertificateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about a Device Defender ML Detect mitigation action.
 *
 * Requires permission to access the DescribeDetectMitigationActionsTask action.
 */
export const describeDetectMitigationActionsTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDetectMitigationActionsTaskRequest,
    output: DescribeDetectMitigationActionsTaskResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Describes a job.
 *
 * Requires permission to access the DescribeJob action.
 */
export const describeJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeJobRequest,
  output: DescribeJobResponse,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Describes a job execution.
 *
 * Requires permission to access the DescribeJobExecution action.
 */
export const describeJobExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeJobExecutionRequest,
    output: DescribeJobExecutionResponse,
    errors: [
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Gets information about the specific command execution on a single device.
 */
export const getCommandExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCommandExecutionRequest,
  output: GetCommandExecutionResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the indexing configuration.
 *
 * Requires permission to access the GetIndexingConfiguration action.
 */
export const getIndexingConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetIndexingConfigurationRequest,
    output: GetIndexingConfigurationResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Gets an OTA update.
 *
 * Requires permission to access the GetOTAUpdate action.
 */
export const getOTAUpdate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOTAUpdateRequest,
  output: GetOTAUpdateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about a topic rule destination.
 *
 * Requires permission to access the GetTopicRuleDestination action.
 */
export const getTopicRuleDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTopicRuleDestinationRequest,
    output: GetTopicRuleDestinationResponse,
    errors: [
      InternalException,
      InvalidRequestException,
      ServiceUnavailableException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Lists the active violations for a given Device Defender security profile.
 *
 * Requires permission to access the ListActiveViolations action.
 */
export const listActiveViolations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListActiveViolationsRequest,
    output: ListActiveViolationsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * List all command executions.
 *
 * - You must provide only the `startedTimeFilter` or
 * the `completedTimeFilter` information. If you provide
 * both time filters, the API will generate an error. You can use
 * this information to retrieve a list of command executions
 * within a specific timeframe.
 *
 * - You must provide only the `commandArn` or
 * the `thingArn` information depending on whether you want
 * to list executions for a specific command or an IoT thing. If you provide
 * both fields, the API will generate an error.
 *
 * For more information about considerations for using this API, see
 * List
 * command executions in your account (CLI).
 */
export const listCommandExecutions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListCommandExecutionsRequest,
    output: ListCommandExecutionsResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists the job executions for a job.
 *
 * Requires permission to access the ListJobExecutionsForJob action.
 */
export const listJobExecutionsForJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListJobExecutionsForJobRequest,
    output: ListJobExecutionsForJobResponse,
    errors: [
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * The related resources of an Audit finding.
 * The following resources can be returned from calling this API:
 *
 * - DEVICE_CERTIFICATE
 *
 * - CA_CERTIFICATE
 *
 * - IOT_POLICY
 *
 * - COGNITO_IDENTITY_POOL
 *
 * - CLIENT_ID
 *
 * - ACCOUNT_SETTINGS
 *
 * - ROLE_ALIAS
 *
 * - IAM_ROLE
 *
 * - ISSUER_CERTIFICATE
 *
 * This API is similar to DescribeAuditFinding's RelatedResources
 * but provides pagination and is not limited to 10 resources.
 * When calling DescribeAuditFinding for the intermediate CA revoked for
 * active device certificates check, RelatedResources will not be populated. You must use this API, ListRelatedResourcesForAuditFinding, to list the certificates.
 */
export const listRelatedResourcesForAuditFinding =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListRelatedResourcesForAuditFindingRequest,
    output: ListRelatedResourcesForAuditFindingResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Lists all the topic rule destinations in your Amazon Web Services account.
 *
 * Requires permission to access the ListTopicRuleDestinations action.
 */
export const listTopicRuleDestinations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTopicRuleDestinationsRequest,
    output: ListTopicRuleDestinationsResponse,
    errors: [
      InternalException,
      InvalidRequestException,
      ServiceUnavailableException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Registers a CA certificate with Amazon Web Services IoT Core. There is no limit to the number of CA
 * certificates you can register in your Amazon Web Services account. You can register up to 10 CA
 * certificates with the same `CA subject field` per Amazon Web Services account.
 *
 * Requires permission to access the RegisterCACertificate action.
 */
export const registerCACertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RegisterCACertificateRequest,
    output: RegisterCACertificateResponse,
    errors: [
      CertificateValidationException,
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      RegistrationCodeValidationException,
      ResourceAlreadyExistsException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * The query search index.
 *
 * Requires permission to access the SearchIndex action.
 */
export const searchIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchIndexRequest,
  output: SearchIndexResponse,
  errors: [
    IndexNotReadyException,
    InternalFailureException,
    InvalidQueryException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Starts a task that applies a set of mitigation actions to the specified target.
 *
 * Requires permission to access the StartAuditMitigationActionsTask action.
 */
export const startAuditMitigationActionsTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartAuditMitigationActionsTaskRequest,
    output: StartAuditMitigationActionsTaskResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      TaskAlreadyExistsException,
      ThrottlingException,
    ],
  }));
/**
 * Starts a Device Defender ML Detect mitigation actions task.
 *
 * Requires permission to access the StartDetectMitigationActionsTask action.
 */
export const startDetectMitigationActionsTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartDetectMitigationActionsTaskRequest,
    output: StartDetectMitigationActionsTaskResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      TaskAlreadyExistsException,
      ThrottlingException,
    ],
  }));
/**
 * Creates a job.
 *
 * Requires permission to access the CreateJob action.
 */
export const createJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateJobRequest,
  output: CreateJobResponse,
  errors: [
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Creates a Device Defender security profile.
 *
 * Requires permission to access the CreateSecurityProfile action.
 */
export const createSecurityProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSecurityProfileRequest,
    output: CreateSecurityProfileResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceAlreadyExistsException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates a new thing type. If this call is made multiple times using
 * the same thing type name and configuration, the call will succeed. If this call is made with
 * the same thing type name but different configuration a `ResourceAlreadyExistsException` is thrown.
 *
 * Requires permission to access the CreateThingType action.
 */
export const createThingType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateThingTypeRequest,
  output: CreateThingTypeResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Aggregates on indexed data with search queries pertaining to particular fields.
 *
 * Requires permission to access the GetBucketsAggregation action.
 */
export const getBucketsAggregation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetBucketsAggregationRequest,
    output: GetBucketsAggregationResponse,
    errors: [
      IndexNotReadyException,
      InternalFailureException,
      InvalidAggregationException,
      InvalidQueryException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Provisions a thing in the device registry. RegisterThing calls other IoT control
 * plane APIs. These calls might exceed your account level
 * IoT Throttling Limits and cause throttle errors. Please contact Amazon Web Services Customer Support to raise
 * your throttling limits if necessary.
 *
 * Requires permission to access the RegisterThing action.
 */
export const registerThing = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterThingRequest,
  output: RegisterThingResponse,
  errors: [
    ConflictingResourceUpdateException,
    InternalFailureException,
    InvalidRequestException,
    ResourceRegistrationFailureException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Tests a custom authorization behavior by invoking a specified custom authorizer. Use
 * this to test and debug the custom authorization behavior of devices that connect to the IoT
 * device gateway.
 *
 * Requires permission to access the TestInvokeAuthorizer action.
 */
export const testInvokeAuthorizer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: TestInvokeAuthorizerRequest,
    output: TestInvokeAuthorizerResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      InvalidResponseException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Creates a command. A command contains reusable configurations that can be applied
 * before they are sent to the devices.
 */
export const createCommand = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCommandRequest,
  output: CreateCommandResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Tests if a specified principal is authorized to perform an IoT action on a
 * specified resource. Use this to test and debug the authorization behavior of devices that
 * connect to the IoT device gateway.
 *
 * Requires permission to access the TestAuthorization action.
 */
export const testAuthorization = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestAuthorizationRequest,
  output: TestAuthorizationResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Creates an IoT OTA update on a target group of things or groups.
 *
 * Requires permission to access the CreateOTAUpdate action.
 */
export const createOTAUpdate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOTAUpdateRequest,
  output: CreateOTAUpdateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a rule. Creating rules is an administrator-level action. Any user who has
 * permission to create rules will be able to access data processed by the rule.
 *
 * Requires permission to access the CreateTopicRule action.
 */
export const createTopicRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTopicRuleRequest,
  output: CreateTopicRuleResponse,
  errors: [
    ConflictingResourceUpdateException,
    InternalException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ServiceUnavailableException,
    SqlParseException,
    UnauthorizedException,
  ],
}));
