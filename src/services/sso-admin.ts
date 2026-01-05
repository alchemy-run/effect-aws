import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "SSO Admin",
  serviceShapeName: "SWBExternalService",
});
const auth = T.AwsAuthSigv4({ name: "sso" });
const ver = T.ServiceVersion("2020-07-20");
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
                        url: "https://sso-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://sso.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://sso-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://sso.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://sso.{Region}.{PartitionResult#dnsSuffix}",
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
export const ScopeTargets = S.Array(S.String);
export class AttachManagedPolicyToPermissionSetRequest extends S.Class<AttachManagedPolicyToPermissionSetRequest>(
  "AttachManagedPolicyToPermissionSetRequest",
)(
  {
    InstanceArn: S.String,
    PermissionSetArn: S.String,
    ManagedPolicyArn: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AttachManagedPolicyToPermissionSetResponse extends S.Class<AttachManagedPolicyToPermissionSetResponse>(
  "AttachManagedPolicyToPermissionSetResponse",
)({}) {}
export class CreateAccountAssignmentRequest extends S.Class<CreateAccountAssignmentRequest>(
  "CreateAccountAssignmentRequest",
)(
  {
    InstanceArn: S.String,
    TargetId: S.String,
    TargetType: S.String,
    PermissionSetArn: S.String,
    PrincipalType: S.String,
    PrincipalId: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateApplicationAssignmentRequest extends S.Class<CreateApplicationAssignmentRequest>(
  "CreateApplicationAssignmentRequest",
)(
  { ApplicationArn: S.String, PrincipalId: S.String, PrincipalType: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateApplicationAssignmentResponse extends S.Class<CreateApplicationAssignmentResponse>(
  "CreateApplicationAssignmentResponse",
)({}) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateInstanceRequest extends S.Class<CreateInstanceRequest>(
  "CreateInstanceRequest",
)(
  {
    Name: S.optional(S.String),
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePermissionSetRequest extends S.Class<CreatePermissionSetRequest>(
  "CreatePermissionSetRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    InstanceArn: S.String,
    SessionDuration: S.optional(S.String),
    RelayState: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAccountAssignmentRequest extends S.Class<DeleteAccountAssignmentRequest>(
  "DeleteAccountAssignmentRequest",
)(
  {
    InstanceArn: S.String,
    TargetId: S.String,
    TargetType: S.String,
    PermissionSetArn: S.String,
    PrincipalType: S.String,
    PrincipalId: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApplicationRequest extends S.Class<DeleteApplicationRequest>(
  "DeleteApplicationRequest",
)(
  { ApplicationArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApplicationResponse extends S.Class<DeleteApplicationResponse>(
  "DeleteApplicationResponse",
)({}) {}
export class DeleteApplicationAssignmentRequest extends S.Class<DeleteApplicationAssignmentRequest>(
  "DeleteApplicationAssignmentRequest",
)(
  { ApplicationArn: S.String, PrincipalId: S.String, PrincipalType: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApplicationAssignmentResponse extends S.Class<DeleteApplicationAssignmentResponse>(
  "DeleteApplicationAssignmentResponse",
)({}) {}
export class DeleteInlinePolicyFromPermissionSetRequest extends S.Class<DeleteInlinePolicyFromPermissionSetRequest>(
  "DeleteInlinePolicyFromPermissionSetRequest",
)(
  { InstanceArn: S.String, PermissionSetArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteInlinePolicyFromPermissionSetResponse extends S.Class<DeleteInlinePolicyFromPermissionSetResponse>(
  "DeleteInlinePolicyFromPermissionSetResponse",
)({}) {}
export class DeleteInstanceRequest extends S.Class<DeleteInstanceRequest>(
  "DeleteInstanceRequest",
)(
  { InstanceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteInstanceResponse extends S.Class<DeleteInstanceResponse>(
  "DeleteInstanceResponse",
)({}) {}
export class DeleteInstanceAccessControlAttributeConfigurationRequest extends S.Class<DeleteInstanceAccessControlAttributeConfigurationRequest>(
  "DeleteInstanceAccessControlAttributeConfigurationRequest",
)(
  { InstanceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteInstanceAccessControlAttributeConfigurationResponse extends S.Class<DeleteInstanceAccessControlAttributeConfigurationResponse>(
  "DeleteInstanceAccessControlAttributeConfigurationResponse",
)({}) {}
export class DeletePermissionsBoundaryFromPermissionSetRequest extends S.Class<DeletePermissionsBoundaryFromPermissionSetRequest>(
  "DeletePermissionsBoundaryFromPermissionSetRequest",
)(
  { InstanceArn: S.String, PermissionSetArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePermissionsBoundaryFromPermissionSetResponse extends S.Class<DeletePermissionsBoundaryFromPermissionSetResponse>(
  "DeletePermissionsBoundaryFromPermissionSetResponse",
)({}) {}
export class DeletePermissionSetRequest extends S.Class<DeletePermissionSetRequest>(
  "DeletePermissionSetRequest",
)(
  { InstanceArn: S.String, PermissionSetArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePermissionSetResponse extends S.Class<DeletePermissionSetResponse>(
  "DeletePermissionSetResponse",
)({}) {}
export class DeleteTrustedTokenIssuerRequest extends S.Class<DeleteTrustedTokenIssuerRequest>(
  "DeleteTrustedTokenIssuerRequest",
)(
  { TrustedTokenIssuerArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTrustedTokenIssuerResponse extends S.Class<DeleteTrustedTokenIssuerResponse>(
  "DeleteTrustedTokenIssuerResponse",
)({}) {}
export class DescribeAccountAssignmentCreationStatusRequest extends S.Class<DescribeAccountAssignmentCreationStatusRequest>(
  "DescribeAccountAssignmentCreationStatusRequest",
)(
  { InstanceArn: S.String, AccountAssignmentCreationRequestId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAccountAssignmentDeletionStatusRequest extends S.Class<DescribeAccountAssignmentDeletionStatusRequest>(
  "DescribeAccountAssignmentDeletionStatusRequest",
)(
  { InstanceArn: S.String, AccountAssignmentDeletionRequestId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeApplicationRequest extends S.Class<DescribeApplicationRequest>(
  "DescribeApplicationRequest",
)(
  { ApplicationArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeApplicationAssignmentRequest extends S.Class<DescribeApplicationAssignmentRequest>(
  "DescribeApplicationAssignmentRequest",
)(
  { ApplicationArn: S.String, PrincipalId: S.String, PrincipalType: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeApplicationProviderRequest extends S.Class<DescribeApplicationProviderRequest>(
  "DescribeApplicationProviderRequest",
)(
  { ApplicationProviderArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeInstanceRequest extends S.Class<DescribeInstanceRequest>(
  "DescribeInstanceRequest",
)(
  { InstanceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeInstanceAccessControlAttributeConfigurationRequest extends S.Class<DescribeInstanceAccessControlAttributeConfigurationRequest>(
  "DescribeInstanceAccessControlAttributeConfigurationRequest",
)(
  { InstanceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePermissionSetRequest extends S.Class<DescribePermissionSetRequest>(
  "DescribePermissionSetRequest",
)(
  { InstanceArn: S.String, PermissionSetArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePermissionSetProvisioningStatusRequest extends S.Class<DescribePermissionSetProvisioningStatusRequest>(
  "DescribePermissionSetProvisioningStatusRequest",
)(
  { InstanceArn: S.String, ProvisionPermissionSetRequestId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTrustedTokenIssuerRequest extends S.Class<DescribeTrustedTokenIssuerRequest>(
  "DescribeTrustedTokenIssuerRequest",
)(
  { TrustedTokenIssuerArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CustomerManagedPolicyReference extends S.Class<CustomerManagedPolicyReference>(
  "CustomerManagedPolicyReference",
)({ Name: S.String, Path: S.optional(S.String) }) {}
export class DetachCustomerManagedPolicyReferenceFromPermissionSetRequest extends S.Class<DetachCustomerManagedPolicyReferenceFromPermissionSetRequest>(
  "DetachCustomerManagedPolicyReferenceFromPermissionSetRequest",
)(
  {
    InstanceArn: S.String,
    PermissionSetArn: S.String,
    CustomerManagedPolicyReference: CustomerManagedPolicyReference,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetachCustomerManagedPolicyReferenceFromPermissionSetResponse extends S.Class<DetachCustomerManagedPolicyReferenceFromPermissionSetResponse>(
  "DetachCustomerManagedPolicyReferenceFromPermissionSetResponse",
)({}) {}
export class DetachManagedPolicyFromPermissionSetRequest extends S.Class<DetachManagedPolicyFromPermissionSetRequest>(
  "DetachManagedPolicyFromPermissionSetRequest",
)(
  {
    InstanceArn: S.String,
    PermissionSetArn: S.String,
    ManagedPolicyArn: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetachManagedPolicyFromPermissionSetResponse extends S.Class<DetachManagedPolicyFromPermissionSetResponse>(
  "DetachManagedPolicyFromPermissionSetResponse",
)({}) {}
export class GetApplicationAssignmentConfigurationRequest extends S.Class<GetApplicationAssignmentConfigurationRequest>(
  "GetApplicationAssignmentConfigurationRequest",
)(
  { ApplicationArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetApplicationSessionConfigurationRequest extends S.Class<GetApplicationSessionConfigurationRequest>(
  "GetApplicationSessionConfigurationRequest",
)(
  { ApplicationArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetInlinePolicyForPermissionSetRequest extends S.Class<GetInlinePolicyForPermissionSetRequest>(
  "GetInlinePolicyForPermissionSetRequest",
)(
  { InstanceArn: S.String, PermissionSetArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPermissionsBoundaryForPermissionSetRequest extends S.Class<GetPermissionsBoundaryForPermissionSetRequest>(
  "GetPermissionsBoundaryForPermissionSetRequest",
)(
  { InstanceArn: S.String, PermissionSetArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class OperationStatusFilter extends S.Class<OperationStatusFilter>(
  "OperationStatusFilter",
)({ Status: S.optional(S.String) }) {}
export class ListAccountAssignmentDeletionStatusRequest extends S.Class<ListAccountAssignmentDeletionStatusRequest>(
  "ListAccountAssignmentDeletionStatusRequest",
)(
  {
    InstanceArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filter: S.optional(OperationStatusFilter),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAccountAssignmentsRequest extends S.Class<ListAccountAssignmentsRequest>(
  "ListAccountAssignmentsRequest",
)(
  {
    InstanceArn: S.String,
    AccountId: S.String,
    PermissionSetArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAccountsForProvisionedPermissionSetRequest extends S.Class<ListAccountsForProvisionedPermissionSetRequest>(
  "ListAccountsForProvisionedPermissionSetRequest",
)(
  {
    InstanceArn: S.String,
    PermissionSetArn: S.String,
    ProvisioningStatus: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListApplicationAssignmentsRequest extends S.Class<ListApplicationAssignmentsRequest>(
  "ListApplicationAssignmentsRequest",
)(
  {
    ApplicationArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListApplicationProvidersRequest extends S.Class<ListApplicationProvidersRequest>(
  "ListApplicationProvidersRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCustomerManagedPolicyReferencesInPermissionSetRequest extends S.Class<ListCustomerManagedPolicyReferencesInPermissionSetRequest>(
  "ListCustomerManagedPolicyReferencesInPermissionSetRequest",
)(
  {
    InstanceArn: S.String,
    PermissionSetArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListInstancesRequest extends S.Class<ListInstancesRequest>(
  "ListInstancesRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListManagedPoliciesInPermissionSetRequest extends S.Class<ListManagedPoliciesInPermissionSetRequest>(
  "ListManagedPoliciesInPermissionSetRequest",
)(
  {
    InstanceArn: S.String,
    PermissionSetArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPermissionSetProvisioningStatusRequest extends S.Class<ListPermissionSetProvisioningStatusRequest>(
  "ListPermissionSetProvisioningStatusRequest",
)(
  {
    InstanceArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filter: S.optional(OperationStatusFilter),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPermissionSetsRequest extends S.Class<ListPermissionSetsRequest>(
  "ListPermissionSetsRequest",
)(
  {
    InstanceArn: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPermissionSetsProvisionedToAccountRequest extends S.Class<ListPermissionSetsProvisionedToAccountRequest>(
  "ListPermissionSetsProvisionedToAccountRequest",
)(
  {
    InstanceArn: S.String,
    AccountId: S.String,
    ProvisioningStatus: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  {
    InstanceArn: S.optional(S.String),
    ResourceArn: S.String,
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTrustedTokenIssuersRequest extends S.Class<ListTrustedTokenIssuersRequest>(
  "ListTrustedTokenIssuersRequest",
)(
  {
    InstanceArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ProvisionPermissionSetRequest extends S.Class<ProvisionPermissionSetRequest>(
  "ProvisionPermissionSetRequest",
)(
  {
    InstanceArn: S.String,
    PermissionSetArn: S.String,
    TargetId: S.optional(S.String),
    TargetType: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutApplicationAssignmentConfigurationRequest extends S.Class<PutApplicationAssignmentConfigurationRequest>(
  "PutApplicationAssignmentConfigurationRequest",
)(
  { ApplicationArn: S.String, AssignmentRequired: S.Boolean },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutApplicationAssignmentConfigurationResponse extends S.Class<PutApplicationAssignmentConfigurationResponse>(
  "PutApplicationAssignmentConfigurationResponse",
)({}) {}
export class PutApplicationSessionConfigurationRequest extends S.Class<PutApplicationSessionConfigurationRequest>(
  "PutApplicationSessionConfigurationRequest",
)(
  {
    ApplicationArn: S.String,
    UserBackgroundSessionApplicationStatus: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutApplicationSessionConfigurationResponse extends S.Class<PutApplicationSessionConfigurationResponse>(
  "PutApplicationSessionConfigurationResponse",
)({}) {}
export class PutInlinePolicyToPermissionSetRequest extends S.Class<PutInlinePolicyToPermissionSetRequest>(
  "PutInlinePolicyToPermissionSetRequest",
)(
  { InstanceArn: S.String, PermissionSetArn: S.String, InlinePolicy: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutInlinePolicyToPermissionSetResponse extends S.Class<PutInlinePolicyToPermissionSetResponse>(
  "PutInlinePolicyToPermissionSetResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { InstanceArn: S.optional(S.String), ResourceArn: S.String, Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    InstanceArn: S.optional(S.String),
    ResourceArn: S.String,
    TagKeys: TagKeyList,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export const AccessControlAttributeValueSourceList = S.Array(S.String);
export class AccessControlAttributeValue extends S.Class<AccessControlAttributeValue>(
  "AccessControlAttributeValue",
)({ Source: AccessControlAttributeValueSourceList }) {}
export class AccessControlAttribute extends S.Class<AccessControlAttribute>(
  "AccessControlAttribute",
)({ Key: S.String, Value: AccessControlAttributeValue }) {}
export const AccessControlAttributeList = S.Array(AccessControlAttribute);
export class InstanceAccessControlAttributeConfiguration extends S.Class<InstanceAccessControlAttributeConfiguration>(
  "InstanceAccessControlAttributeConfiguration",
)({ AccessControlAttributes: AccessControlAttributeList }) {}
export class UpdateInstanceAccessControlAttributeConfigurationRequest extends S.Class<UpdateInstanceAccessControlAttributeConfigurationRequest>(
  "UpdateInstanceAccessControlAttributeConfigurationRequest",
)(
  {
    InstanceArn: S.String,
    InstanceAccessControlAttributeConfiguration:
      InstanceAccessControlAttributeConfiguration,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateInstanceAccessControlAttributeConfigurationResponse extends S.Class<UpdateInstanceAccessControlAttributeConfigurationResponse>(
  "UpdateInstanceAccessControlAttributeConfigurationResponse",
)({}) {}
export class UpdatePermissionSetRequest extends S.Class<UpdatePermissionSetRequest>(
  "UpdatePermissionSetRequest",
)(
  {
    InstanceArn: S.String,
    PermissionSetArn: S.String,
    Description: S.optional(S.String),
    SessionDuration: S.optional(S.String),
    RelayState: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdatePermissionSetResponse extends S.Class<UpdatePermissionSetResponse>(
  "UpdatePermissionSetResponse",
)({}) {}
export class PutApplicationAccessScopeRequest extends S.Class<PutApplicationAccessScopeRequest>(
  "PutApplicationAccessScopeRequest",
)(
  {
    Scope: S.String,
    AuthorizedTargets: S.optional(ScopeTargets),
    ApplicationArn: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutApplicationAccessScopeResponse extends S.Class<PutApplicationAccessScopeResponse>(
  "PutApplicationAccessScopeResponse",
)({}) {}
export class GetApplicationAccessScopeRequest extends S.Class<GetApplicationAccessScopeRequest>(
  "GetApplicationAccessScopeRequest",
)(
  { ApplicationArn: S.String, Scope: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApplicationAccessScopeRequest extends S.Class<DeleteApplicationAccessScopeRequest>(
  "DeleteApplicationAccessScopeRequest",
)(
  { ApplicationArn: S.String, Scope: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApplicationAccessScopeResponse extends S.Class<DeleteApplicationAccessScopeResponse>(
  "DeleteApplicationAccessScopeResponse",
)({}) {}
export class ListApplicationAccessScopesRequest extends S.Class<ListApplicationAccessScopesRequest>(
  "ListApplicationAccessScopesRequest",
)(
  {
    ApplicationArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetApplicationAuthenticationMethodRequest extends S.Class<GetApplicationAuthenticationMethodRequest>(
  "GetApplicationAuthenticationMethodRequest",
)(
  { ApplicationArn: S.String, AuthenticationMethodType: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApplicationAuthenticationMethodRequest extends S.Class<DeleteApplicationAuthenticationMethodRequest>(
  "DeleteApplicationAuthenticationMethodRequest",
)(
  { ApplicationArn: S.String, AuthenticationMethodType: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApplicationAuthenticationMethodResponse extends S.Class<DeleteApplicationAuthenticationMethodResponse>(
  "DeleteApplicationAuthenticationMethodResponse",
)({}) {}
export class ListApplicationAuthenticationMethodsRequest extends S.Class<ListApplicationAuthenticationMethodsRequest>(
  "ListApplicationAuthenticationMethodsRequest",
)(
  { ApplicationArn: S.String, NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetApplicationGrantRequest extends S.Class<GetApplicationGrantRequest>(
  "GetApplicationGrantRequest",
)(
  { ApplicationArn: S.String, GrantType: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApplicationGrantRequest extends S.Class<DeleteApplicationGrantRequest>(
  "DeleteApplicationGrantRequest",
)(
  { ApplicationArn: S.String, GrantType: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApplicationGrantResponse extends S.Class<DeleteApplicationGrantResponse>(
  "DeleteApplicationGrantResponse",
)({}) {}
export class ListApplicationGrantsRequest extends S.Class<ListApplicationGrantsRequest>(
  "ListApplicationGrantsRequest",
)(
  { ApplicationArn: S.String, NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RefreshTokenGrant extends S.Class<RefreshTokenGrant>(
  "RefreshTokenGrant",
)({}) {}
export class TokenExchangeGrant extends S.Class<TokenExchangeGrant>(
  "TokenExchangeGrant",
)({}) {}
export class ListAccountAssignmentsFilter extends S.Class<ListAccountAssignmentsFilter>(
  "ListAccountAssignmentsFilter",
)({ AccountId: S.optional(S.String) }) {}
export const AccountList = S.Array(S.String);
export class ListApplicationAssignmentsFilter extends S.Class<ListApplicationAssignmentsFilter>(
  "ListApplicationAssignmentsFilter",
)({ ApplicationArn: S.optional(S.String) }) {}
export class ListApplicationsFilter extends S.Class<ListApplicationsFilter>(
  "ListApplicationsFilter",
)({
  ApplicationAccount: S.optional(S.String),
  ApplicationProvider: S.optional(S.String),
}) {}
export const CustomerManagedPolicyReferenceList = S.Array(
  CustomerManagedPolicyReference,
);
export const PermissionSetList = S.Array(S.String);
export class PermissionsBoundary extends S.Class<PermissionsBoundary>(
  "PermissionsBoundary",
)({
  CustomerManagedPolicyReference: S.optional(CustomerManagedPolicyReference),
  ManagedPolicyArn: S.optional(S.String),
}) {}
export class SignInOptions extends S.Class<SignInOptions>("SignInOptions")({
  Origin: S.String,
  ApplicationUrl: S.optional(S.String),
}) {}
export class UpdateApplicationPortalOptions extends S.Class<UpdateApplicationPortalOptions>(
  "UpdateApplicationPortalOptions",
)({ SignInOptions: S.optional(SignInOptions) }) {}
export class EncryptionConfiguration extends S.Class<EncryptionConfiguration>(
  "EncryptionConfiguration",
)({ KeyType: S.String, KmsKeyArn: S.optional(S.String) }) {}
export const RedirectUris = S.Array(S.String);
export class AttachCustomerManagedPolicyReferenceToPermissionSetRequest extends S.Class<AttachCustomerManagedPolicyReferenceToPermissionSetRequest>(
  "AttachCustomerManagedPolicyReferenceToPermissionSetRequest",
)(
  {
    InstanceArn: S.String,
    PermissionSetArn: S.String,
    CustomerManagedPolicyReference: CustomerManagedPolicyReference,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AttachCustomerManagedPolicyReferenceToPermissionSetResponse extends S.Class<AttachCustomerManagedPolicyReferenceToPermissionSetResponse>(
  "AttachCustomerManagedPolicyReferenceToPermissionSetResponse",
)({}) {}
export class CreateInstanceResponse extends S.Class<CreateInstanceResponse>(
  "CreateInstanceResponse",
)({ InstanceArn: S.optional(S.String) }) {}
export class AccountAssignmentOperationStatus extends S.Class<AccountAssignmentOperationStatus>(
  "AccountAssignmentOperationStatus",
)({
  Status: S.optional(S.String),
  RequestId: S.optional(S.String),
  FailureReason: S.optional(S.String),
  TargetId: S.optional(S.String),
  TargetType: S.optional(S.String),
  PermissionSetArn: S.optional(S.String),
  PrincipalType: S.optional(S.String),
  PrincipalId: S.optional(S.String),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DeleteAccountAssignmentResponse extends S.Class<DeleteAccountAssignmentResponse>(
  "DeleteAccountAssignmentResponse",
)({
  AccountAssignmentDeletionStatus: S.optional(AccountAssignmentOperationStatus),
}) {}
export class DescribeAccountAssignmentCreationStatusResponse extends S.Class<DescribeAccountAssignmentCreationStatusResponse>(
  "DescribeAccountAssignmentCreationStatusResponse",
)({
  AccountAssignmentCreationStatus: S.optional(AccountAssignmentOperationStatus),
}) {}
export class DescribeAccountAssignmentDeletionStatusResponse extends S.Class<DescribeAccountAssignmentDeletionStatusResponse>(
  "DescribeAccountAssignmentDeletionStatusResponse",
)({
  AccountAssignmentDeletionStatus: S.optional(AccountAssignmentOperationStatus),
}) {}
export class PortalOptions extends S.Class<PortalOptions>("PortalOptions")({
  SignInOptions: S.optional(SignInOptions),
  Visibility: S.optional(S.String),
}) {}
export class DescribeApplicationResponse extends S.Class<DescribeApplicationResponse>(
  "DescribeApplicationResponse",
)({
  ApplicationArn: S.optional(S.String),
  ApplicationProviderArn: S.optional(S.String),
  Name: S.optional(S.String),
  ApplicationAccount: S.optional(S.String),
  InstanceArn: S.optional(S.String),
  Status: S.optional(S.String),
  PortalOptions: S.optional(PortalOptions),
  Description: S.optional(S.String),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DescribeApplicationAssignmentResponse extends S.Class<DescribeApplicationAssignmentResponse>(
  "DescribeApplicationAssignmentResponse",
)({
  PrincipalType: S.optional(S.String),
  PrincipalId: S.optional(S.String),
  ApplicationArn: S.optional(S.String),
}) {}
export class DescribeInstanceAccessControlAttributeConfigurationResponse extends S.Class<DescribeInstanceAccessControlAttributeConfigurationResponse>(
  "DescribeInstanceAccessControlAttributeConfigurationResponse",
)({
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  InstanceAccessControlAttributeConfiguration: S.optional(
    InstanceAccessControlAttributeConfiguration,
  ),
}) {}
export class PermissionSet extends S.Class<PermissionSet>("PermissionSet")({
  Name: S.optional(S.String),
  PermissionSetArn: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SessionDuration: S.optional(S.String),
  RelayState: S.optional(S.String),
}) {}
export class DescribePermissionSetResponse extends S.Class<DescribePermissionSetResponse>(
  "DescribePermissionSetResponse",
)({ PermissionSet: S.optional(PermissionSet) }) {}
export class OidcJwtConfiguration extends S.Class<OidcJwtConfiguration>(
  "OidcJwtConfiguration",
)({
  IssuerUrl: S.String,
  ClaimAttributePath: S.String,
  IdentityStoreAttributePath: S.String,
  JwksRetrievalOption: S.String,
}) {}
export const TrustedTokenIssuerConfiguration = S.Union(
  S.Struct({ OidcJwtConfiguration: OidcJwtConfiguration }),
);
export class DescribeTrustedTokenIssuerResponse extends S.Class<DescribeTrustedTokenIssuerResponse>(
  "DescribeTrustedTokenIssuerResponse",
)({
  TrustedTokenIssuerArn: S.optional(S.String),
  Name: S.optional(S.String),
  TrustedTokenIssuerType: S.optional(S.String),
  TrustedTokenIssuerConfiguration: S.optional(TrustedTokenIssuerConfiguration),
}) {}
export class GetApplicationAssignmentConfigurationResponse extends S.Class<GetApplicationAssignmentConfigurationResponse>(
  "GetApplicationAssignmentConfigurationResponse",
)({ AssignmentRequired: S.Boolean }) {}
export class GetApplicationSessionConfigurationResponse extends S.Class<GetApplicationSessionConfigurationResponse>(
  "GetApplicationSessionConfigurationResponse",
)({ UserBackgroundSessionApplicationStatus: S.optional(S.String) }) {}
export class GetInlinePolicyForPermissionSetResponse extends S.Class<GetInlinePolicyForPermissionSetResponse>(
  "GetInlinePolicyForPermissionSetResponse",
)({ InlinePolicy: S.optional(S.String) }) {}
export class GetPermissionsBoundaryForPermissionSetResponse extends S.Class<GetPermissionsBoundaryForPermissionSetResponse>(
  "GetPermissionsBoundaryForPermissionSetResponse",
)({ PermissionsBoundary: S.optional(PermissionsBoundary) }) {}
export class ListAccountAssignmentCreationStatusRequest extends S.Class<ListAccountAssignmentCreationStatusRequest>(
  "ListAccountAssignmentCreationStatusRequest",
)(
  {
    InstanceArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filter: S.optional(OperationStatusFilter),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAccountAssignmentsForPrincipalRequest extends S.Class<ListAccountAssignmentsForPrincipalRequest>(
  "ListAccountAssignmentsForPrincipalRequest",
)(
  {
    InstanceArn: S.String,
    PrincipalId: S.String,
    PrincipalType: S.String,
    Filter: S.optional(ListAccountAssignmentsFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAccountsForProvisionedPermissionSetResponse extends S.Class<ListAccountsForProvisionedPermissionSetResponse>(
  "ListAccountsForProvisionedPermissionSetResponse",
)({ AccountIds: S.optional(AccountList), NextToken: S.optional(S.String) }) {}
export class ListApplicationAssignmentsForPrincipalRequest extends S.Class<ListApplicationAssignmentsForPrincipalRequest>(
  "ListApplicationAssignmentsForPrincipalRequest",
)(
  {
    InstanceArn: S.String,
    PrincipalId: S.String,
    PrincipalType: S.String,
    Filter: S.optional(ListApplicationAssignmentsFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListApplicationsRequest extends S.Class<ListApplicationsRequest>(
  "ListApplicationsRequest",
)(
  {
    InstanceArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filter: S.optional(ListApplicationsFilter),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCustomerManagedPolicyReferencesInPermissionSetResponse extends S.Class<ListCustomerManagedPolicyReferencesInPermissionSetResponse>(
  "ListCustomerManagedPolicyReferencesInPermissionSetResponse",
)({
  CustomerManagedPolicyReferences: S.optional(
    CustomerManagedPolicyReferenceList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListPermissionSetsResponse extends S.Class<ListPermissionSetsResponse>(
  "ListPermissionSetsResponse",
)({
  PermissionSets: S.optional(PermissionSetList),
  NextToken: S.optional(S.String),
}) {}
export class ListPermissionSetsProvisionedToAccountResponse extends S.Class<ListPermissionSetsProvisionedToAccountResponse>(
  "ListPermissionSetsProvisionedToAccountResponse",
)({
  NextToken: S.optional(S.String),
  PermissionSets: S.optional(PermissionSetList),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList), NextToken: S.optional(S.String) }) {}
export class PermissionSetProvisioningStatus extends S.Class<PermissionSetProvisioningStatus>(
  "PermissionSetProvisioningStatus",
)({
  Status: S.optional(S.String),
  RequestId: S.optional(S.String),
  AccountId: S.optional(S.String),
  PermissionSetArn: S.optional(S.String),
  FailureReason: S.optional(S.String),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ProvisionPermissionSetResponse extends S.Class<ProvisionPermissionSetResponse>(
  "ProvisionPermissionSetResponse",
)({
  PermissionSetProvisioningStatus: S.optional(PermissionSetProvisioningStatus),
}) {}
export class PutPermissionsBoundaryToPermissionSetRequest extends S.Class<PutPermissionsBoundaryToPermissionSetRequest>(
  "PutPermissionsBoundaryToPermissionSetRequest",
)(
  {
    InstanceArn: S.String,
    PermissionSetArn: S.String,
    PermissionsBoundary: PermissionsBoundary,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutPermissionsBoundaryToPermissionSetResponse extends S.Class<PutPermissionsBoundaryToPermissionSetResponse>(
  "PutPermissionsBoundaryToPermissionSetResponse",
)({}) {}
export class UpdateApplicationRequest extends S.Class<UpdateApplicationRequest>(
  "UpdateApplicationRequest",
)(
  {
    ApplicationArn: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(S.String),
    PortalOptions: S.optional(UpdateApplicationPortalOptions),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateApplicationResponse extends S.Class<UpdateApplicationResponse>(
  "UpdateApplicationResponse",
)({}) {}
export class UpdateInstanceRequest extends S.Class<UpdateInstanceRequest>(
  "UpdateInstanceRequest",
)(
  {
    Name: S.optional(S.String),
    InstanceArn: S.String,
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateInstanceResponse extends S.Class<UpdateInstanceResponse>(
  "UpdateInstanceResponse",
)({}) {}
export class GetApplicationAccessScopeResponse extends S.Class<GetApplicationAccessScopeResponse>(
  "GetApplicationAccessScopeResponse",
)({ Scope: S.String, AuthorizedTargets: S.optional(ScopeTargets) }) {}
export class IamAuthenticationMethod extends S.Class<IamAuthenticationMethod>(
  "IamAuthenticationMethod",
)({ ActorPolicy: S.Any }) {}
export const AuthenticationMethod = S.Union(
  S.Struct({ Iam: IamAuthenticationMethod }),
);
export class GetApplicationAuthenticationMethodResponse extends S.Class<GetApplicationAuthenticationMethodResponse>(
  "GetApplicationAuthenticationMethodResponse",
)({ AuthenticationMethod: S.optional(AuthenticationMethod) }) {}
export class AuthorizationCodeGrant extends S.Class<AuthorizationCodeGrant>(
  "AuthorizationCodeGrant",
)({ RedirectUris: S.optional(RedirectUris) }) {}
export const TokenIssuerAudiences = S.Array(S.String);
export class AuthorizedTokenIssuer extends S.Class<AuthorizedTokenIssuer>(
  "AuthorizedTokenIssuer",
)({
  TrustedTokenIssuerArn: S.optional(S.String),
  AuthorizedAudiences: S.optional(TokenIssuerAudiences),
}) {}
export const AuthorizedTokenIssuers = S.Array(AuthorizedTokenIssuer);
export class JwtBearerGrant extends S.Class<JwtBearerGrant>("JwtBearerGrant")({
  AuthorizedTokenIssuers: S.optional(AuthorizedTokenIssuers),
}) {}
export const Grant = S.Union(
  S.Struct({ AuthorizationCode: AuthorizationCodeGrant }),
  S.Struct({ JwtBearer: JwtBearerGrant }),
  S.Struct({ RefreshToken: RefreshTokenGrant }),
  S.Struct({ TokenExchange: TokenExchangeGrant }),
);
export class GetApplicationGrantResponse extends S.Class<GetApplicationGrantResponse>(
  "GetApplicationGrantResponse",
)({ Grant: Grant }) {}
export class OidcJwtUpdateConfiguration extends S.Class<OidcJwtUpdateConfiguration>(
  "OidcJwtUpdateConfiguration",
)({
  ClaimAttributePath: S.optional(S.String),
  IdentityStoreAttributePath: S.optional(S.String),
  JwksRetrievalOption: S.optional(S.String),
}) {}
export class DisplayData extends S.Class<DisplayData>("DisplayData")({
  DisplayName: S.optional(S.String),
  IconUrl: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export class EncryptionConfigurationDetails extends S.Class<EncryptionConfigurationDetails>(
  "EncryptionConfigurationDetails",
)({
  KeyType: S.optional(S.String),
  KmsKeyArn: S.optional(S.String),
  EncryptionStatus: S.optional(S.String),
  EncryptionStatusReason: S.optional(S.String),
}) {}
export class AccountAssignmentOperationStatusMetadata extends S.Class<AccountAssignmentOperationStatusMetadata>(
  "AccountAssignmentOperationStatusMetadata",
)({
  Status: S.optional(S.String),
  RequestId: S.optional(S.String),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const AccountAssignmentOperationStatusList = S.Array(
  AccountAssignmentOperationStatusMetadata,
);
export class AccountAssignment extends S.Class<AccountAssignment>(
  "AccountAssignment",
)({
  AccountId: S.optional(S.String),
  PermissionSetArn: S.optional(S.String),
  PrincipalType: S.optional(S.String),
  PrincipalId: S.optional(S.String),
}) {}
export const AccountAssignmentList = S.Array(AccountAssignment);
export class ApplicationAssignment extends S.Class<ApplicationAssignment>(
  "ApplicationAssignment",
)({
  ApplicationArn: S.String,
  PrincipalId: S.String,
  PrincipalType: S.String,
}) {}
export const ApplicationAssignmentsList = S.Array(ApplicationAssignment);
export class ResourceServerScopeDetails extends S.Class<ResourceServerScopeDetails>(
  "ResourceServerScopeDetails",
)({
  LongDescription: S.optional(S.String),
  DetailedTitle: S.optional(S.String),
}) {}
export const ResourceServerScopes = S.Record({
  key: S.String,
  value: ResourceServerScopeDetails,
});
export class ResourceServerConfig extends S.Class<ResourceServerConfig>(
  "ResourceServerConfig",
)({ Scopes: S.optional(ResourceServerScopes) }) {}
export class ApplicationProvider extends S.Class<ApplicationProvider>(
  "ApplicationProvider",
)({
  ApplicationProviderArn: S.String,
  FederationProtocol: S.optional(S.String),
  DisplayData: S.optional(DisplayData),
  ResourceServerConfig: S.optional(ResourceServerConfig),
}) {}
export const ApplicationProviderList = S.Array(ApplicationProvider);
export class InstanceMetadata extends S.Class<InstanceMetadata>(
  "InstanceMetadata",
)({
  InstanceArn: S.optional(S.String),
  IdentityStoreId: S.optional(S.String),
  OwnerAccountId: S.optional(S.String),
  Name: S.optional(S.String),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
}) {}
export const InstanceList = S.Array(InstanceMetadata);
export class AttachedManagedPolicy extends S.Class<AttachedManagedPolicy>(
  "AttachedManagedPolicy",
)({ Name: S.optional(S.String), Arn: S.optional(S.String) }) {}
export const AttachedManagedPolicyList = S.Array(AttachedManagedPolicy);
export class PermissionSetProvisioningStatusMetadata extends S.Class<PermissionSetProvisioningStatusMetadata>(
  "PermissionSetProvisioningStatusMetadata",
)({
  Status: S.optional(S.String),
  RequestId: S.optional(S.String),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const PermissionSetProvisioningStatusList = S.Array(
  PermissionSetProvisioningStatusMetadata,
);
export class TrustedTokenIssuerMetadata extends S.Class<TrustedTokenIssuerMetadata>(
  "TrustedTokenIssuerMetadata",
)({
  TrustedTokenIssuerArn: S.optional(S.String),
  Name: S.optional(S.String),
  TrustedTokenIssuerType: S.optional(S.String),
}) {}
export const TrustedTokenIssuerList = S.Array(TrustedTokenIssuerMetadata);
export const TrustedTokenIssuerUpdateConfiguration = S.Union(
  S.Struct({ OidcJwtConfiguration: OidcJwtUpdateConfiguration }),
);
export class ScopeDetails extends S.Class<ScopeDetails>("ScopeDetails")({
  Scope: S.String,
  AuthorizedTargets: S.optional(ScopeTargets),
}) {}
export const Scopes = S.Array(ScopeDetails);
export class AuthenticationMethodItem extends S.Class<AuthenticationMethodItem>(
  "AuthenticationMethodItem",
)({
  AuthenticationMethodType: S.optional(S.String),
  AuthenticationMethod: S.optional(AuthenticationMethod),
}) {}
export const AuthenticationMethods = S.Array(AuthenticationMethodItem);
export class GrantItem extends S.Class<GrantItem>("GrantItem")({
  GrantType: S.String,
  Grant: Grant,
}) {}
export const Grants = S.Array(GrantItem);
export class CreateAccountAssignmentResponse extends S.Class<CreateAccountAssignmentResponse>(
  "CreateAccountAssignmentResponse",
)({
  AccountAssignmentCreationStatus: S.optional(AccountAssignmentOperationStatus),
}) {}
export class CreateApplicationRequest extends S.Class<CreateApplicationRequest>(
  "CreateApplicationRequest",
)(
  {
    InstanceArn: S.String,
    ApplicationProviderArn: S.String,
    Name: S.String,
    Description: S.optional(S.String),
    PortalOptions: S.optional(PortalOptions),
    Tags: S.optional(TagList),
    Status: S.optional(S.String),
    ClientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePermissionSetResponse extends S.Class<CreatePermissionSetResponse>(
  "CreatePermissionSetResponse",
)({ PermissionSet: S.optional(PermissionSet) }) {}
export class CreateTrustedTokenIssuerRequest extends S.Class<CreateTrustedTokenIssuerRequest>(
  "CreateTrustedTokenIssuerRequest",
)(
  {
    InstanceArn: S.String,
    Name: S.String,
    TrustedTokenIssuerType: S.String,
    TrustedTokenIssuerConfiguration: TrustedTokenIssuerConfiguration,
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeInstanceResponse extends S.Class<DescribeInstanceResponse>(
  "DescribeInstanceResponse",
)({
  InstanceArn: S.optional(S.String),
  IdentityStoreId: S.optional(S.String),
  OwnerAccountId: S.optional(S.String),
  Name: S.optional(S.String),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  EncryptionConfigurationDetails: S.optional(EncryptionConfigurationDetails),
}) {}
export class DescribePermissionSetProvisioningStatusResponse extends S.Class<DescribePermissionSetProvisioningStatusResponse>(
  "DescribePermissionSetProvisioningStatusResponse",
)({
  PermissionSetProvisioningStatus: S.optional(PermissionSetProvisioningStatus),
}) {}
export class ListAccountAssignmentCreationStatusResponse extends S.Class<ListAccountAssignmentCreationStatusResponse>(
  "ListAccountAssignmentCreationStatusResponse",
)({
  AccountAssignmentsCreationStatus: S.optional(
    AccountAssignmentOperationStatusList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListAccountAssignmentDeletionStatusResponse extends S.Class<ListAccountAssignmentDeletionStatusResponse>(
  "ListAccountAssignmentDeletionStatusResponse",
)({
  AccountAssignmentsDeletionStatus: S.optional(
    AccountAssignmentOperationStatusList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListAccountAssignmentsResponse extends S.Class<ListAccountAssignmentsResponse>(
  "ListAccountAssignmentsResponse",
)({
  AccountAssignments: S.optional(AccountAssignmentList),
  NextToken: S.optional(S.String),
}) {}
export class ListApplicationAssignmentsResponse extends S.Class<ListApplicationAssignmentsResponse>(
  "ListApplicationAssignmentsResponse",
)({
  ApplicationAssignments: S.optional(ApplicationAssignmentsList),
  NextToken: S.optional(S.String),
}) {}
export class ListApplicationProvidersResponse extends S.Class<ListApplicationProvidersResponse>(
  "ListApplicationProvidersResponse",
)({
  ApplicationProviders: S.optional(ApplicationProviderList),
  NextToken: S.optional(S.String),
}) {}
export class ListInstancesResponse extends S.Class<ListInstancesResponse>(
  "ListInstancesResponse",
)({ Instances: S.optional(InstanceList), NextToken: S.optional(S.String) }) {}
export class ListManagedPoliciesInPermissionSetResponse extends S.Class<ListManagedPoliciesInPermissionSetResponse>(
  "ListManagedPoliciesInPermissionSetResponse",
)({
  AttachedManagedPolicies: S.optional(AttachedManagedPolicyList),
  NextToken: S.optional(S.String),
}) {}
export class ListPermissionSetProvisioningStatusResponse extends S.Class<ListPermissionSetProvisioningStatusResponse>(
  "ListPermissionSetProvisioningStatusResponse",
)({
  PermissionSetsProvisioningStatus: S.optional(
    PermissionSetProvisioningStatusList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListTrustedTokenIssuersResponse extends S.Class<ListTrustedTokenIssuersResponse>(
  "ListTrustedTokenIssuersResponse",
)({
  TrustedTokenIssuers: S.optional(TrustedTokenIssuerList),
  NextToken: S.optional(S.String),
}) {}
export class UpdateTrustedTokenIssuerRequest extends S.Class<UpdateTrustedTokenIssuerRequest>(
  "UpdateTrustedTokenIssuerRequest",
)(
  {
    TrustedTokenIssuerArn: S.String,
    Name: S.optional(S.String),
    TrustedTokenIssuerConfiguration: S.optional(
      TrustedTokenIssuerUpdateConfiguration,
    ),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateTrustedTokenIssuerResponse extends S.Class<UpdateTrustedTokenIssuerResponse>(
  "UpdateTrustedTokenIssuerResponse",
)({}) {}
export class ListApplicationAccessScopesResponse extends S.Class<ListApplicationAccessScopesResponse>(
  "ListApplicationAccessScopesResponse",
)({ Scopes: Scopes, NextToken: S.optional(S.String) }) {}
export class PutApplicationAuthenticationMethodRequest extends S.Class<PutApplicationAuthenticationMethodRequest>(
  "PutApplicationAuthenticationMethodRequest",
)(
  {
    ApplicationArn: S.String,
    AuthenticationMethodType: S.String,
    AuthenticationMethod: AuthenticationMethod,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutApplicationAuthenticationMethodResponse extends S.Class<PutApplicationAuthenticationMethodResponse>(
  "PutApplicationAuthenticationMethodResponse",
)({}) {}
export class ListApplicationAuthenticationMethodsResponse extends S.Class<ListApplicationAuthenticationMethodsResponse>(
  "ListApplicationAuthenticationMethodsResponse",
)({
  AuthenticationMethods: S.optional(AuthenticationMethods),
  NextToken: S.optional(S.String),
}) {}
export class ListApplicationGrantsResponse extends S.Class<ListApplicationGrantsResponse>(
  "ListApplicationGrantsResponse",
)({ Grants: Grants, NextToken: S.optional(S.String) }) {}
export class AccountAssignmentForPrincipal extends S.Class<AccountAssignmentForPrincipal>(
  "AccountAssignmentForPrincipal",
)({
  AccountId: S.optional(S.String),
  PermissionSetArn: S.optional(S.String),
  PrincipalId: S.optional(S.String),
  PrincipalType: S.optional(S.String),
}) {}
export const AccountAssignmentListForPrincipal = S.Array(
  AccountAssignmentForPrincipal,
);
export class ApplicationAssignmentForPrincipal extends S.Class<ApplicationAssignmentForPrincipal>(
  "ApplicationAssignmentForPrincipal",
)({
  ApplicationArn: S.optional(S.String),
  PrincipalId: S.optional(S.String),
  PrincipalType: S.optional(S.String),
}) {}
export const ApplicationAssignmentListForPrincipal = S.Array(
  ApplicationAssignmentForPrincipal,
);
export class Application extends S.Class<Application>("Application")({
  ApplicationArn: S.optional(S.String),
  ApplicationProviderArn: S.optional(S.String),
  Name: S.optional(S.String),
  ApplicationAccount: S.optional(S.String),
  InstanceArn: S.optional(S.String),
  Status: S.optional(S.String),
  PortalOptions: S.optional(PortalOptions),
  Description: S.optional(S.String),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ApplicationList = S.Array(Application);
export class CreateApplicationResponse extends S.Class<CreateApplicationResponse>(
  "CreateApplicationResponse",
)({ ApplicationArn: S.optional(S.String) }) {}
export class CreateInstanceAccessControlAttributeConfigurationRequest extends S.Class<CreateInstanceAccessControlAttributeConfigurationRequest>(
  "CreateInstanceAccessControlAttributeConfigurationRequest",
)(
  {
    InstanceArn: S.String,
    InstanceAccessControlAttributeConfiguration:
      InstanceAccessControlAttributeConfiguration,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateInstanceAccessControlAttributeConfigurationResponse extends S.Class<CreateInstanceAccessControlAttributeConfigurationResponse>(
  "CreateInstanceAccessControlAttributeConfigurationResponse",
)({}) {}
export class CreateTrustedTokenIssuerResponse extends S.Class<CreateTrustedTokenIssuerResponse>(
  "CreateTrustedTokenIssuerResponse",
)({ TrustedTokenIssuerArn: S.optional(S.String) }) {}
export class ListAccountAssignmentsForPrincipalResponse extends S.Class<ListAccountAssignmentsForPrincipalResponse>(
  "ListAccountAssignmentsForPrincipalResponse",
)({
  AccountAssignments: S.optional(AccountAssignmentListForPrincipal),
  NextToken: S.optional(S.String),
}) {}
export class ListApplicationAssignmentsForPrincipalResponse extends S.Class<ListApplicationAssignmentsForPrincipalResponse>(
  "ListApplicationAssignmentsForPrincipalResponse",
)({
  ApplicationAssignments: S.optional(ApplicationAssignmentListForPrincipal),
  NextToken: S.optional(S.String),
}) {}
export class ListApplicationsResponse extends S.Class<ListApplicationsResponse>(
  "ListApplicationsResponse",
)({
  Applications: S.optional(ApplicationList),
  NextToken: S.optional(S.String),
}) {}
export class PutApplicationGrantRequest extends S.Class<PutApplicationGrantRequest>(
  "PutApplicationGrantRequest",
)(
  { ApplicationArn: S.String, GrantType: S.String, Grant: Grant },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutApplicationGrantResponse extends S.Class<PutApplicationGrantResponse>(
  "PutApplicationGrantResponse",
)({}) {}
export class DescribeApplicationProviderResponse extends S.Class<DescribeApplicationProviderResponse>(
  "DescribeApplicationProviderResponse",
)({
  ApplicationProviderArn: S.String,
  FederationProtocol: S.optional(S.String),
  DisplayData: S.optional(DisplayData),
  ResourceServerConfig: S.optional(ResourceServerConfig),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String), Reason: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String), Reason: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String), Reason: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String), Reason: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns the details of an instance of IAM Identity Center. The status can be one of the following:
 *
 * - `CREATE_IN_PROGRESS` - The instance is in the process of being created. When the instance is ready for use, DescribeInstance returns the status of `ACTIVE`. While the instance is in the `CREATE_IN_PROGRESS` state, you can call only DescribeInstance and DeleteInstance operations.
 *
 * - `DELETE_IN_PROGRESS` - The instance is being deleted. Returns `AccessDeniedException` after the delete operation completes.
 *
 * - `ACTIVE` - The instance is active.
 */
export const describeInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeInstanceRequest,
  output: DescribeInstanceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of the IAM Identity Center associated Amazon Web Services accounts that the principal has access to. This action must be called from the management account containing your organization instance of IAM Identity Center. This action is not valid for account instances of IAM Identity Center.
 */
export const listAccountAssignmentsForPrincipal =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAccountAssignmentsForPrincipalRequest,
    output: ListAccountAssignmentsForPrincipalResponse,
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
      items: "AccountAssignments",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the applications to which a specified principal is assigned. You must provide a filter when calling this action from a member account against your organization instance of IAM Identity Center. A filter is not required when called from the management account against an organization instance of IAM Identity Center, or from a member account against an account instance of IAM Identity Center in the same account.
 */
export const listApplicationAssignmentsForPrincipal =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListApplicationAssignmentsForPrincipalRequest,
    output: ListApplicationAssignmentsForPrincipalResponse,
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
      items: "ApplicationAssignments",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists all applications associated with the instance of IAM Identity Center. When listing applications for an organization instance in the management account, member accounts must use the `applicationAccount` parameter to filter the list to only applications created from that account. When listing applications for an account instance in the same member account, a filter is not required.
 */
export const listApplications = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListApplicationsRequest,
    output: ListApplicationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Applications",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Creates a configuration for an application to use grants. Conceptually grants are authorization to request actions related to tokens. This configuration will be used when parties are requesting and receiving tokens during the trusted identity propagation process. For more information on the IAM Identity Center supported grant workflows, see SAML 2.0 and OAuth 2.0.
 *
 * A grant is created between your applications and Identity Center instance which enables an application to use specified mechanisms to obtain tokens. These tokens are used by your applications to gain access to Amazon Web Services resources on behalf of users. The following elements are within these exchanges:
 *
 * - **Requester** - The application requesting access to Amazon Web Services resources.
 *
 * - **Subject** - Typically the user that is requesting access to Amazon Web Services resources.
 *
 * - **Grant** - Conceptually, a grant is authorization to access Amazon Web Services resources. These grants authorize token generation for authenticating access to the requester and for the request to make requests on behalf of the subjects. There are four types of grants:
 *
 * - **AuthorizationCode** - Allows an application to request authorization through a series of user-agent redirects.
 *
 * - **JWT bearer ** - Authorizes an application to exchange a JSON Web Token that came from an external identity provider. To learn more, see RFC 6479.
 *
 * - **Refresh token** - Enables application to request new access tokens to replace expiring or expired access tokens.
 *
 * - **Exchange token** - A grant that requests tokens from the authorization server by providing a ‘subject’ token with access scope authorizing trusted identity propagation to this application. To learn more, see RFC 8693.
 *
 * - **Authorization server** - IAM Identity Center requests tokens.
 *
 * User credentials are never shared directly within these exchanges. Instead, applications use grants to request access tokens from IAM Identity Center. For more information, see RFC 6479.
 * **Use cases**
 *
 * - Connecting to custom applications.
 *
 * - Configuring an Amazon Web Services service to make calls to another Amazon Web Services services using JWT tokens.
 */
export const putApplicationGrant = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutApplicationGrantRequest,
  output: PutApplicationGrantResponse,
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
 * Creates an instance of IAM Identity Center for a standalone Amazon Web Services account that is not managed by Organizations or a member Amazon Web Services account in an organization. You can create only one instance per account and across all Amazon Web Services Regions.
 *
 * The CreateInstance request is rejected if the following apply:
 *
 * - The instance is created within the organization management account.
 *
 * - An instance already exists in the same account.
 */
export const createInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateInstanceRequest,
  output: CreateInstanceResponse,
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
 * Describes the status for the given permission set provisioning request.
 */
export const describePermissionSetProvisioningStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribePermissionSetProvisioningStatusRequest,
    output: DescribePermissionSetProvisioningStatusResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists the status of the Amazon Web Services account assignment creation requests for a specified IAM Identity Center instance.
 */
export const listAccountAssignmentCreationStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAccountAssignmentCreationStatusRequest,
    output: ListAccountAssignmentCreationStatusResponse,
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
      items: "AccountAssignmentsCreationStatus",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the status of the Amazon Web Services account assignment deletion requests for a specified IAM Identity Center instance.
 */
export const listAccountAssignmentDeletionStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAccountAssignmentDeletionStatusRequest,
    output: ListAccountAssignmentDeletionStatusResponse,
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
      items: "AccountAssignmentsDeletionStatus",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the assignee of the specified Amazon Web Services account with the specified permission set.
 */
export const listAccountAssignments =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAccountAssignmentsRequest,
    output: ListAccountAssignmentsResponse,
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
      items: "AccountAssignments",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists Amazon Web Services account users that are assigned to an application.
 */
export const listApplicationAssignments =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListApplicationAssignmentsRequest,
    output: ListApplicationAssignmentsResponse,
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
      items: "ApplicationAssignments",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the Amazon Web Services managed policy that is attached to a specified permission set.
 */
export const listManagedPoliciesInPermissionSet =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListManagedPoliciesInPermissionSetRequest,
    output: ListManagedPoliciesInPermissionSetResponse,
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
      items: "AttachedManagedPolicies",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the status of the permission set provisioning requests for a specified IAM Identity Center instance.
 */
export const listPermissionSetProvisioningStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListPermissionSetProvisioningStatusRequest,
    output: ListPermissionSetProvisioningStatusResponse,
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
      items: "PermissionSetsProvisioningStatus",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Updates the name of the trusted token issuer, or the path of a source attribute or destination attribute for a trusted token issuer configuration.
 *
 * Updating this trusted token issuer configuration might cause users to lose access to any applications that are configured to use the trusted token issuer.
 */
export const updateTrustedTokenIssuer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateTrustedTokenIssuerRequest,
    output: UpdateTrustedTokenIssuerResponse,
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
 * Lists the access scopes and authorized targets associated with an application.
 */
export const listApplicationAccessScopes =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListApplicationAccessScopesRequest,
    output: ListApplicationAccessScopesResponse,
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
      items: "Scopes",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Adds or updates an authentication method for an application.
 */
export const putApplicationAuthenticationMethod =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutApplicationAuthenticationMethodRequest,
    output: PutApplicationAuthenticationMethodResponse,
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
 * Lists all of the authentication methods supported by the specified application.
 */
export const listApplicationAuthenticationMethods =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListApplicationAuthenticationMethodsRequest,
    output: ListApplicationAuthenticationMethodsResponse,
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
      items: "AuthenticationMethods",
    } as const,
  }));
/**
 * List the grants associated with an application.
 */
export const listApplicationGrants =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListApplicationGrantsRequest,
    output: ListApplicationGrantsResponse,
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
      items: "Grants",
    } as const,
  }));
/**
 * Deletes a principal's access from a specified Amazon Web Services account using a specified permission set.
 *
 * After a successful response, call `DescribeAccountAssignmentDeletionStatus` to describe the status of an assignment deletion request.
 */
export const deleteAccountAssignment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAccountAssignmentRequest,
    output: DeleteAccountAssignmentResponse,
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
 * The process by which a specified permission set is provisioned to the specified target.
 */
export const provisionPermissionSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ProvisionPermissionSetRequest,
    output: ProvisionPermissionSetResponse,
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
 * Attaches an Amazon Web Services managed or customer managed policy to the specified PermissionSet as a permissions boundary.
 */
export const putPermissionsBoundaryToPermissionSet =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutPermissionsBoundaryToPermissionSetRequest,
    output: PutPermissionsBoundaryToPermissionSetResponse,
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
 * Updates application properties.
 */
export const updateApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationRequest,
  output: UpdateApplicationResponse,
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
 * Update the details for the instance of IAM Identity Center that is owned by the Amazon Web Services account.
 */
export const updateInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateInstanceRequest,
  output: UpdateInstanceResponse,
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
 * Grant application access to a user or group.
 */
export const createApplicationAssignment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateApplicationAssignmentRequest,
    output: CreateApplicationAssignmentResponse,
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
 * Deletes the association with the application. The connected service resource still exists.
 */
export const deleteApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationRequest,
  output: DeleteApplicationResponse,
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
 * Revoke application access to an application by deleting application assignments for a user or group.
 */
export const deleteApplicationAssignment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteApplicationAssignmentRequest,
    output: DeleteApplicationAssignmentResponse,
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
 * Deletes the inline policy from a specified permission set.
 */
export const deleteInlinePolicyFromPermissionSet =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteInlinePolicyFromPermissionSetRequest,
    output: DeleteInlinePolicyFromPermissionSetResponse,
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
 * Disables the attributes-based access control (ABAC) feature for the specified IAM Identity Center instance and deletes all of the attribute mappings that have been configured. Once deleted, any attributes that are received from an identity source and any custom attributes you have previously configured will not be passed. For more information about ABAC, see Attribute-Based Access Control in the *IAM Identity Center User Guide*.
 */
export const deleteInstanceAccessControlAttributeConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteInstanceAccessControlAttributeConfigurationRequest,
    output: DeleteInstanceAccessControlAttributeConfigurationResponse,
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
 * Deletes the permissions boundary from a specified PermissionSet.
 */
export const deletePermissionsBoundaryFromPermissionSet =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeletePermissionsBoundaryFromPermissionSetRequest,
    output: DeletePermissionsBoundaryFromPermissionSetResponse,
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
 * Deletes the specified permission set.
 */
export const deletePermissionSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePermissionSetRequest,
  output: DeletePermissionSetResponse,
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
 * Deletes a trusted token issuer configuration from an instance of IAM Identity Center.
 *
 * Deleting this trusted token issuer configuration will cause users to lose access to any applications that are configured to use the trusted token issuer.
 */
export const deleteTrustedTokenIssuer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteTrustedTokenIssuerRequest,
    output: DeleteTrustedTokenIssuerResponse,
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
 * Detaches the specified customer managed policy from the specified PermissionSet.
 */
export const detachCustomerManagedPolicyReferenceFromPermissionSet =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DetachCustomerManagedPolicyReferenceFromPermissionSetRequest,
    output: DetachCustomerManagedPolicyReferenceFromPermissionSetResponse,
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
 * Detaches the attached Amazon Web Services managed policy ARN from the specified permission set.
 */
export const detachManagedPolicyFromPermissionSet =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DetachManagedPolicyFromPermissionSetRequest,
    output: DetachManagedPolicyFromPermissionSetResponse,
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
 * Configure how users gain access to an application. If `AssignmentsRequired` is `true` (default value), users don’t have access to the application unless an assignment is created using the CreateApplicationAssignment API. If `false`, all users have access to the application. If an assignment is created using CreateApplicationAssignment., the user retains access if `AssignmentsRequired` is set to `true`.
 */
export const putApplicationAssignmentConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutApplicationAssignmentConfigurationRequest,
    output: PutApplicationAssignmentConfigurationResponse,
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
 * Updates the session configuration for an application in IAM Identity Center.
 *
 * The session configuration determines how users can access an application. This includes whether user background sessions are enabled. User background sessions allow users to start a job on a supported Amazon Web Services managed application without having to remain signed in to an active session while the job runs.
 */
export const putApplicationSessionConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutApplicationSessionConfigurationRequest,
    output: PutApplicationSessionConfigurationResponse,
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
 * Attaches an inline policy to a permission set.
 *
 * If the permission set is already referenced by one or more account assignments, you will need to call ` ProvisionPermissionSet ` after this action to apply the corresponding IAM policy updates to all assigned accounts.
 */
export const putInlinePolicyToPermissionSet =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutInlinePolicyToPermissionSetRequest,
    output: PutInlinePolicyToPermissionSetResponse,
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
 * Associates a set of tags with a specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
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
 * Disassociates a set of tags from a specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
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
 * Updates the IAM Identity Center identity store attributes that you can use with the IAM Identity Center instance for attributes-based access control (ABAC). When using an external identity provider as an identity source, you can pass attributes through the SAML assertion as an alternative to configuring attributes from the IAM Identity Center identity store. If a SAML assertion passes any of these attributes, IAM Identity Center replaces the attribute value with the value from the IAM Identity Center identity store. For more information about ABAC, see Attribute-Based Access Control in the *IAM Identity Center User Guide*.
 */
export const updateInstanceAccessControlAttributeConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateInstanceAccessControlAttributeConfigurationRequest,
    output: UpdateInstanceAccessControlAttributeConfigurationResponse,
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
 * Updates an existing permission set.
 */
export const updatePermissionSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePermissionSetRequest,
  output: UpdatePermissionSetResponse,
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
 * Adds or updates the list of authorized targets for an IAM Identity Center access scope for an application.
 */
export const putApplicationAccessScope = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutApplicationAccessScopeRequest,
    output: PutApplicationAccessScopeResponse,
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
 * Deletes an IAM Identity Center access scope from an application.
 */
export const deleteApplicationAccessScope =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteApplicationAccessScopeRequest,
    output: DeleteApplicationAccessScopeResponse,
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
 * Deletes an authentication method from an application.
 */
export const deleteApplicationAuthenticationMethod =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteApplicationAuthenticationMethodRequest,
    output: DeleteApplicationAuthenticationMethodResponse,
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
 * Deletes a grant from an application.
 */
export const deleteApplicationGrant = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteApplicationGrantRequest,
    output: DeleteApplicationGrantResponse,
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
 * Attaches the specified customer managed policy to the specified PermissionSet.
 */
export const attachCustomerManagedPolicyReferenceToPermissionSet =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AttachCustomerManagedPolicyReferenceToPermissionSetRequest,
    output: AttachCustomerManagedPolicyReferenceToPermissionSetResponse,
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
 * Describes the status of the assignment deletion request.
 */
export const describeAccountAssignmentDeletionStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAccountAssignmentDeletionStatusRequest,
    output: DescribeAccountAssignmentDeletionStatusResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves the details of an application associated with an instance of IAM Identity Center.
 */
export const describeApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeApplicationRequest,
  output: DescribeApplicationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a direct assignment of a user or group to an application. If the user doesn’t have a direct assignment to the application, the user may still have access to the application through a group. Therefore, don’t use this API to test access to an application for a user. Instead use ListApplicationAssignmentsForPrincipal.
 */
export const describeApplicationAssignment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeApplicationAssignmentRequest,
    output: DescribeApplicationAssignmentResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns the list of IAM Identity Center identity store attributes that have been configured to work with attributes-based access control (ABAC) for the specified IAM Identity Center instance. This will not return attributes configured and sent by an external identity provider. For more information about ABAC, see Attribute-Based Access Control in the *IAM Identity Center User Guide*.
 */
export const describeInstanceAccessControlAttributeConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeInstanceAccessControlAttributeConfigurationRequest,
    output: DescribeInstanceAccessControlAttributeConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Gets the details of the permission set.
 */
export const describePermissionSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribePermissionSetRequest,
    output: DescribePermissionSetResponse,
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
 * Retrieves details about a trusted token issuer configuration stored in an instance of IAM Identity Center. Details include the name of the trusted token issuer, the issuer URL, and the path of the source attribute and the destination attribute for a trusted token issuer configuration.
 */
export const describeTrustedTokenIssuer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeTrustedTokenIssuerRequest,
    output: DescribeTrustedTokenIssuerResponse,
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
 * Retrieves the configuration of PutApplicationAssignmentConfiguration.
 */
export const getApplicationAssignmentConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetApplicationAssignmentConfigurationRequest,
    output: GetApplicationAssignmentConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves the session configuration for an application in IAM Identity Center.
 *
 * The session configuration determines how users can access an application. This includes whether user background sessions are enabled. User background sessions allow users to start a job on a supported Amazon Web Services managed application without having to remain signed in to an active session while the job runs.
 */
export const getApplicationSessionConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetApplicationSessionConfigurationRequest,
    output: GetApplicationSessionConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Obtains the inline policy assigned to the permission set.
 */
export const getInlinePolicyForPermissionSet =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetInlinePolicyForPermissionSetRequest,
    output: GetInlinePolicyForPermissionSetResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Obtains the permissions boundary for a specified PermissionSet.
 */
export const getPermissionsBoundaryForPermissionSet =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetPermissionsBoundaryForPermissionSetRequest,
    output: GetPermissionsBoundaryForPermissionSetResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists all the Amazon Web Services accounts where the specified permission set is provisioned.
 */
export const listAccountsForProvisionedPermissionSet =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAccountsForProvisionedPermissionSetRequest,
    output: ListAccountsForProvisionedPermissionSetResponse,
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
      items: "AccountIds",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists all customer managed policies attached to a specified PermissionSet.
 */
export const listCustomerManagedPolicyReferencesInPermissionSet =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCustomerManagedPolicyReferencesInPermissionSetRequest,
    output: ListCustomerManagedPolicyReferencesInPermissionSetResponse,
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
      items: "CustomerManagedPolicyReferences",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the PermissionSets in an IAM Identity Center instance.
 */
export const listPermissionSets = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPermissionSetsRequest,
    output: ListPermissionSetsResponse,
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
      items: "PermissionSets",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists all the permission sets that are provisioned to a specified Amazon Web Services account.
 */
export const listPermissionSetsProvisionedToAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListPermissionSetsProvisionedToAccountRequest,
    output: ListPermissionSetsProvisionedToAccountResponse,
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
      items: "PermissionSets",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the tags that are attached to a specified resource.
 */
export const listTagsForResource =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTagsForResourceRequest,
    output: ListTagsForResourceResponse,
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
      items: "Tags",
    } as const,
  }));
/**
 * Retrieves the authorized targets for an IAM Identity Center access scope for an application.
 */
export const getApplicationAccessScope = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetApplicationAccessScopeRequest,
    output: GetApplicationAccessScopeResponse,
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
 * Retrieves details about an authentication method used by an application.
 */
export const getApplicationAuthenticationMethod =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetApplicationAuthenticationMethodRequest,
    output: GetApplicationAuthenticationMethodResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves details about an application grant.
 */
export const getApplicationGrant = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApplicationGrantRequest,
  output: GetApplicationGrantResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Attaches an Amazon Web Services managed policy ARN to a permission set.
 *
 * If the permission set is already referenced by one or more account assignments, you will need to call ` ProvisionPermissionSet ` after this operation. Calling `ProvisionPermissionSet` applies the corresponding IAM policy updates to all assigned accounts.
 */
export const attachManagedPolicyToPermissionSet =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AttachManagedPolicyToPermissionSetRequest,
    output: AttachManagedPolicyToPermissionSetResponse,
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
 * Assigns access to a principal for a specified Amazon Web Services account using a specified permission set.
 *
 * The term *principal* here refers to a user or group that is defined in IAM Identity Center.
 *
 * As part of a successful `CreateAccountAssignment` call, the specified permission set will automatically be provisioned to the account in the form of an IAM policy. That policy is attached to the IAM role created in IAM Identity Center. If the permission set is subsequently updated, the corresponding IAM policies attached to roles in your accounts will not be updated automatically. In this case, you must call ` ProvisionPermissionSet ` to make these updates.
 *
 * After a successful response, call `DescribeAccountAssignmentCreationStatus` to describe the status of an assignment creation request.
 */
export const createAccountAssignment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAccountAssignmentRequest,
    output: CreateAccountAssignmentResponse,
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
 * Creates a permission set within a specified IAM Identity Center instance.
 *
 * To grant users and groups access to Amazon Web Services account resources, use ` CreateAccountAssignment `.
 */
export const createPermissionSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePermissionSetRequest,
  output: CreatePermissionSetResponse,
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
 * Creates an OAuth 2.0 customer managed application in IAM Identity Center for the given application provider.
 *
 * This API does not support creating SAML 2.0 customer managed applications or Amazon Web Services managed applications. To learn how to create an Amazon Web Services managed application, see the application user guide. You can create a SAML 2.0 customer managed application in the Amazon Web Services Management Console only. See Setting up customer managed SAML 2.0 applications. For more information on these application types, see Amazon Web Services managed applications.
 */
export const createApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationRequest,
  output: CreateApplicationResponse,
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
 * Enables the attributes-based access control (ABAC) feature for the specified IAM Identity Center instance. You can also specify new attributes to add to your ABAC configuration during the enabling process. For more information about ABAC, see Attribute-Based Access Control in the *IAM Identity Center User Guide*.
 *
 * After a successful response, call `DescribeInstanceAccessControlAttributeConfiguration` to validate that `InstanceAccessControlAttributeConfiguration` was created.
 */
export const createInstanceAccessControlAttributeConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateInstanceAccessControlAttributeConfigurationRequest,
    output: CreateInstanceAccessControlAttributeConfigurationResponse,
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
 * Lists the application providers configured in the IAM Identity Center identity store.
 */
export const listApplicationProviders =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListApplicationProvidersRequest,
    output: ListApplicationProvidersResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ApplicationProviders",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the details of the organization and account instances of IAM Identity Center that were created in or visible to the account calling this API.
 */
export const listInstances = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListInstancesRequest,
    output: ListInstancesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Instances",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists all the trusted token issuers configured in an instance of IAM Identity Center.
 */
export const listTrustedTokenIssuers =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTrustedTokenIssuersRequest,
    output: ListTrustedTokenIssuersResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "TrustedTokenIssuers",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Deletes the instance of IAM Identity Center. Only the account that owns the instance can call this API. Neither the delegated administrator nor member account can delete the organization instance, but those roles can delete their own instance.
 */
export const deleteInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInstanceRequest,
  output: DeleteInstanceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Describes the status of the assignment creation request.
 */
export const describeAccountAssignmentCreationStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAccountAssignmentCreationStatusRequest,
    output: DescribeAccountAssignmentCreationStatusResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates a connection to a trusted token issuer in an instance of IAM Identity Center. A trusted token issuer enables trusted identity propagation to be used with applications that authenticate outside of Amazon Web Services.
 *
 * This trusted token issuer describes an external identity provider (IdP) that can generate claims or assertions in the form of access tokens for a user. Applications enabled for IAM Identity Center can use these tokens for authentication.
 */
export const createTrustedTokenIssuer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateTrustedTokenIssuerRequest,
    output: CreateTrustedTokenIssuerResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves details about a provider that can be used to connect an Amazon Web Services managed application or customer managed application to IAM Identity Center.
 */
export const describeApplicationProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeApplicationProviderRequest,
    output: DescribeApplicationProviderResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
