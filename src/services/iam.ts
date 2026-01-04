import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("https://iam.amazonaws.com/doc/2010-05-08/");
const svc = T.AwsApiService({
  sdkId: "IAM",
  serviceShapeName: "AWSIdentityManagementV20100508",
});
const auth = T.AwsAuthSigv4({ name: "iam" });
const ver = T.ServiceVersion("2010-05-08");
const proto = T.AwsProtocolsAwsQuery();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
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
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://iam.global.api.aws",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-east-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://iam-fips.global.api.aws",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-east-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-cn",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://iam.global.api.amazonwebservices.com.cn",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "cn-north-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-cn",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://iam.cn-north-1.amazonaws.com.cn",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "cn-north-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://iam.us-gov.api.aws",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-gov-west-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://iam.us-gov.api.aws",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-gov-west-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://iam.us-gov.amazonaws.com",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-gov-west-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://iam.us-gov.amazonaws.com",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-gov-west-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-iso",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://iam.us-iso-east-1.c2s.ic.gov",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-iso-east-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-iso",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://iam-fips.us-iso-east-1.c2s.ic.gov",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-iso-east-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-iso-b",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://iam.us-isob-east-1.sc2s.sgov.gov",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-isob-east-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-iso-b",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://iam-fips.us-isob-east-1.sc2s.sgov.gov",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-isob-east-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-iso-e",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://iam.eu-isoe-west-1.cloud.adc-e.uk",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "eu-isoe-west-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-iso-f",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://iam.us-isof-south-1.csp.hci.ic.gov",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-isof-south-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-eusc",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://iam.eusc-de-east-1.amazonaws.eu",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "eusc-de-east-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
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
                          endpoint: {
                            url: "https://iam-fips.{PartitionResult#dualStackDnsSuffix}",
                            properties: {
                              authSchemes: [
                                {
                                  name: "sigv4",
                                  signingRegion:
                                    "{PartitionResult#implicitGlobalRegion}",
                                },
                              ],
                            },
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
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
                            url: "https://iam-fips.{PartitionResult#dnsSuffix}",
                            properties: {
                              authSchemes: [
                                {
                                  name: "sigv4",
                                  signingRegion:
                                    "{PartitionResult#implicitGlobalRegion}",
                                },
                              ],
                            },
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
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
                          endpoint: {
                            url: "https://iam.{PartitionResult#dualStackDnsSuffix}",
                            properties: {
                              authSchemes: [
                                {
                                  name: "sigv4",
                                  signingRegion:
                                    "{PartitionResult#implicitGlobalRegion}",
                                },
                              ],
                            },
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
                    url: "https://iam.{PartitionResult#dnsSuffix}",
                    properties: {
                      authSchemes: [
                        {
                          name: "sigv4",
                          signingRegion:
                            "{PartitionResult#implicitGlobalRegion}",
                        },
                      ],
                    },
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
      type: "tree",
    },
  ],
});

//# Schemas
export class DeleteAccountPasswordPolicyRequest extends S.Class<DeleteAccountPasswordPolicyRequest>(
  "DeleteAccountPasswordPolicyRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAccountPasswordPolicyResponse extends S.Class<DeleteAccountPasswordPolicyResponse>(
  "DeleteAccountPasswordPolicyResponse",
)({}, ns) {}
export class DisableOrganizationsRootCredentialsManagementRequest extends S.Class<DisableOrganizationsRootCredentialsManagementRequest>(
  "DisableOrganizationsRootCredentialsManagementRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisableOrganizationsRootSessionsRequest extends S.Class<DisableOrganizationsRootSessionsRequest>(
  "DisableOrganizationsRootSessionsRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisableOutboundWebIdentityFederationRequest extends S.Class<DisableOutboundWebIdentityFederationRequest>(
  "DisableOutboundWebIdentityFederationRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisableOutboundWebIdentityFederationResponse extends S.Class<DisableOutboundWebIdentityFederationResponse>(
  "DisableOutboundWebIdentityFederationResponse",
)({}, ns) {}
export class EnableOrganizationsRootCredentialsManagementRequest extends S.Class<EnableOrganizationsRootCredentialsManagementRequest>(
  "EnableOrganizationsRootCredentialsManagementRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EnableOrganizationsRootSessionsRequest extends S.Class<EnableOrganizationsRootSessionsRequest>(
  "EnableOrganizationsRootSessionsRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EnableOutboundWebIdentityFederationRequest extends S.Class<EnableOutboundWebIdentityFederationRequest>(
  "EnableOutboundWebIdentityFederationRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GenerateCredentialReportRequest extends S.Class<GenerateCredentialReportRequest>(
  "GenerateCredentialReportRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAccountPasswordPolicyRequest extends S.Class<GetAccountPasswordPolicyRequest>(
  "GetAccountPasswordPolicyRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAccountSummaryRequest extends S.Class<GetAccountSummaryRequest>(
  "GetAccountSummaryRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCredentialReportRequest extends S.Class<GetCredentialReportRequest>(
  "GetCredentialReportRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetOutboundWebIdentityFederationInfoRequest extends S.Class<GetOutboundWebIdentityFederationInfoRequest>(
  "GetOutboundWebIdentityFederationInfoRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListOpenIDConnectProvidersRequest extends S.Class<ListOpenIDConnectProvidersRequest>(
  "ListOpenIDConnectProvidersRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListOrganizationsFeaturesRequest extends S.Class<ListOrganizationsFeaturesRequest>(
  "ListOrganizationsFeaturesRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSAMLProvidersRequest extends S.Class<ListSAMLProvidersRequest>(
  "ListSAMLProvidersRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const clientIDListType = S.Array(S.String);
export const thumbprintListType = S.Array(S.String);
export const FeaturesListType = S.Array(S.String);
export const entityListType = S.Array(S.String);
export const SimulationPolicyListType = S.Array(S.String);
export const serviceNamespaceListType = S.Array(S.String);
export const ActionNameListType = S.Array(S.String);
export const ResourceNameListType = S.Array(S.String);
export const tagKeyListType = S.Array(S.String);
export class AcceptDelegationRequestRequest extends S.Class<AcceptDelegationRequestRequest>(
  "AcceptDelegationRequestRequest",
)(
  { DelegationRequestId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AcceptDelegationRequestResponse extends S.Class<AcceptDelegationRequestResponse>(
  "AcceptDelegationRequestResponse",
)({}, ns) {}
export class AddClientIDToOpenIDConnectProviderRequest extends S.Class<AddClientIDToOpenIDConnectProviderRequest>(
  "AddClientIDToOpenIDConnectProviderRequest",
)(
  { OpenIDConnectProviderArn: S.String, ClientID: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddClientIDToOpenIDConnectProviderResponse extends S.Class<AddClientIDToOpenIDConnectProviderResponse>(
  "AddClientIDToOpenIDConnectProviderResponse",
)({}, ns) {}
export class AddRoleToInstanceProfileRequest extends S.Class<AddRoleToInstanceProfileRequest>(
  "AddRoleToInstanceProfileRequest",
)(
  { InstanceProfileName: S.String, RoleName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddRoleToInstanceProfileResponse extends S.Class<AddRoleToInstanceProfileResponse>(
  "AddRoleToInstanceProfileResponse",
)({}, ns) {}
export class AddUserToGroupRequest extends S.Class<AddUserToGroupRequest>(
  "AddUserToGroupRequest",
)(
  { GroupName: S.String, UserName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddUserToGroupResponse extends S.Class<AddUserToGroupResponse>(
  "AddUserToGroupResponse",
)({}, ns) {}
export class AssociateDelegationRequestRequest extends S.Class<AssociateDelegationRequestRequest>(
  "AssociateDelegationRequestRequest",
)(
  { DelegationRequestId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateDelegationRequestResponse extends S.Class<AssociateDelegationRequestResponse>(
  "AssociateDelegationRequestResponse",
)({}, ns) {}
export class AttachGroupPolicyRequest extends S.Class<AttachGroupPolicyRequest>(
  "AttachGroupPolicyRequest",
)(
  { GroupName: S.String, PolicyArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AttachGroupPolicyResponse extends S.Class<AttachGroupPolicyResponse>(
  "AttachGroupPolicyResponse",
)({}, ns) {}
export class AttachRolePolicyRequest extends S.Class<AttachRolePolicyRequest>(
  "AttachRolePolicyRequest",
)(
  { RoleName: S.String, PolicyArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AttachRolePolicyResponse extends S.Class<AttachRolePolicyResponse>(
  "AttachRolePolicyResponse",
)({}, ns) {}
export class AttachUserPolicyRequest extends S.Class<AttachUserPolicyRequest>(
  "AttachUserPolicyRequest",
)(
  { UserName: S.String, PolicyArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AttachUserPolicyResponse extends S.Class<AttachUserPolicyResponse>(
  "AttachUserPolicyResponse",
)({}, ns) {}
export class ChangePasswordRequest extends S.Class<ChangePasswordRequest>(
  "ChangePasswordRequest",
)(
  { OldPassword: S.String, NewPassword: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ChangePasswordResponse extends S.Class<ChangePasswordResponse>(
  "ChangePasswordResponse",
)({}, ns) {}
export class CreateAccessKeyRequest extends S.Class<CreateAccessKeyRequest>(
  "CreateAccessKeyRequest",
)(
  { UserName: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateAccountAliasRequest extends S.Class<CreateAccountAliasRequest>(
  "CreateAccountAliasRequest",
)(
  { AccountAlias: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateAccountAliasResponse extends S.Class<CreateAccountAliasResponse>(
  "CreateAccountAliasResponse",
)({}, ns) {}
export class CreateGroupRequest extends S.Class<CreateGroupRequest>(
  "CreateGroupRequest",
)(
  { Path: S.optional(S.String), GroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLoginProfileRequest extends S.Class<CreateLoginProfileRequest>(
  "CreateLoginProfileRequest",
)(
  {
    UserName: S.optional(S.String),
    Password: S.optional(S.String),
    PasswordResetRequired: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const tagListType = S.Array(Tag);
export class CreateOpenIDConnectProviderRequest extends S.Class<CreateOpenIDConnectProviderRequest>(
  "CreateOpenIDConnectProviderRequest",
)(
  {
    Url: S.String,
    ClientIDList: S.optional(clientIDListType),
    ThumbprintList: S.optional(thumbprintListType),
    Tags: S.optional(tagListType),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePolicyRequest extends S.Class<CreatePolicyRequest>(
  "CreatePolicyRequest",
)(
  {
    PolicyName: S.String,
    Path: S.optional(S.String),
    PolicyDocument: S.String,
    Description: S.optional(S.String),
    Tags: S.optional(tagListType),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePolicyVersionRequest extends S.Class<CreatePolicyVersionRequest>(
  "CreatePolicyVersionRequest",
)(
  {
    PolicyArn: S.String,
    PolicyDocument: S.String,
    SetAsDefault: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateRoleRequest extends S.Class<CreateRoleRequest>(
  "CreateRoleRequest",
)(
  {
    Path: S.optional(S.String),
    RoleName: S.String,
    AssumeRolePolicyDocument: S.String,
    Description: S.optional(S.String),
    MaxSessionDuration: S.optional(S.Number),
    PermissionsBoundary: S.optional(S.String),
    Tags: S.optional(tagListType),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSAMLProviderRequest extends S.Class<CreateSAMLProviderRequest>(
  "CreateSAMLProviderRequest",
)(
  {
    SAMLMetadataDocument: S.String,
    Name: S.String,
    Tags: S.optional(tagListType),
    AssertionEncryptionMode: S.optional(S.String),
    AddPrivateKey: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateServiceLinkedRoleRequest extends S.Class<CreateServiceLinkedRoleRequest>(
  "CreateServiceLinkedRoleRequest",
)(
  {
    AWSServiceName: S.String,
    Description: S.optional(S.String),
    CustomSuffix: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateServiceSpecificCredentialRequest extends S.Class<CreateServiceSpecificCredentialRequest>(
  "CreateServiceSpecificCredentialRequest",
)(
  {
    UserName: S.String,
    ServiceName: S.String,
    CredentialAgeDays: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateUserRequest extends S.Class<CreateUserRequest>(
  "CreateUserRequest",
)(
  {
    Path: S.optional(S.String),
    UserName: S.String,
    PermissionsBoundary: S.optional(S.String),
    Tags: S.optional(tagListType),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateVirtualMFADeviceRequest extends S.Class<CreateVirtualMFADeviceRequest>(
  "CreateVirtualMFADeviceRequest",
)(
  {
    Path: S.optional(S.String),
    VirtualMFADeviceName: S.String,
    Tags: S.optional(tagListType),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeactivateMFADeviceRequest extends S.Class<DeactivateMFADeviceRequest>(
  "DeactivateMFADeviceRequest",
)(
  { UserName: S.optional(S.String), SerialNumber: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeactivateMFADeviceResponse extends S.Class<DeactivateMFADeviceResponse>(
  "DeactivateMFADeviceResponse",
)({}, ns) {}
export class DeleteAccessKeyRequest extends S.Class<DeleteAccessKeyRequest>(
  "DeleteAccessKeyRequest",
)(
  { UserName: S.optional(S.String), AccessKeyId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAccessKeyResponse extends S.Class<DeleteAccessKeyResponse>(
  "DeleteAccessKeyResponse",
)({}, ns) {}
export class DeleteAccountAliasRequest extends S.Class<DeleteAccountAliasRequest>(
  "DeleteAccountAliasRequest",
)(
  { AccountAlias: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAccountAliasResponse extends S.Class<DeleteAccountAliasResponse>(
  "DeleteAccountAliasResponse",
)({}, ns) {}
export class DeleteGroupRequest extends S.Class<DeleteGroupRequest>(
  "DeleteGroupRequest",
)(
  { GroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteGroupResponse extends S.Class<DeleteGroupResponse>(
  "DeleteGroupResponse",
)({}, ns) {}
export class DeleteGroupPolicyRequest extends S.Class<DeleteGroupPolicyRequest>(
  "DeleteGroupPolicyRequest",
)(
  { GroupName: S.String, PolicyName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteGroupPolicyResponse extends S.Class<DeleteGroupPolicyResponse>(
  "DeleteGroupPolicyResponse",
)({}, ns) {}
export class DeleteInstanceProfileRequest extends S.Class<DeleteInstanceProfileRequest>(
  "DeleteInstanceProfileRequest",
)(
  { InstanceProfileName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteInstanceProfileResponse extends S.Class<DeleteInstanceProfileResponse>(
  "DeleteInstanceProfileResponse",
)({}, ns) {}
export class DeleteLoginProfileRequest extends S.Class<DeleteLoginProfileRequest>(
  "DeleteLoginProfileRequest",
)(
  { UserName: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLoginProfileResponse extends S.Class<DeleteLoginProfileResponse>(
  "DeleteLoginProfileResponse",
)({}, ns) {}
export class DeleteOpenIDConnectProviderRequest extends S.Class<DeleteOpenIDConnectProviderRequest>(
  "DeleteOpenIDConnectProviderRequest",
)(
  { OpenIDConnectProviderArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteOpenIDConnectProviderResponse extends S.Class<DeleteOpenIDConnectProviderResponse>(
  "DeleteOpenIDConnectProviderResponse",
)({}, ns) {}
export class DeletePolicyRequest extends S.Class<DeletePolicyRequest>(
  "DeletePolicyRequest",
)(
  { PolicyArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePolicyResponse extends S.Class<DeletePolicyResponse>(
  "DeletePolicyResponse",
)({}, ns) {}
export class DeletePolicyVersionRequest extends S.Class<DeletePolicyVersionRequest>(
  "DeletePolicyVersionRequest",
)(
  { PolicyArn: S.String, VersionId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePolicyVersionResponse extends S.Class<DeletePolicyVersionResponse>(
  "DeletePolicyVersionResponse",
)({}, ns) {}
export class DeleteRoleRequest extends S.Class<DeleteRoleRequest>(
  "DeleteRoleRequest",
)(
  { RoleName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRoleResponse extends S.Class<DeleteRoleResponse>(
  "DeleteRoleResponse",
)({}, ns) {}
export class DeleteRolePermissionsBoundaryRequest extends S.Class<DeleteRolePermissionsBoundaryRequest>(
  "DeleteRolePermissionsBoundaryRequest",
)(
  { RoleName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRolePermissionsBoundaryResponse extends S.Class<DeleteRolePermissionsBoundaryResponse>(
  "DeleteRolePermissionsBoundaryResponse",
)({}, ns) {}
export class DeleteRolePolicyRequest extends S.Class<DeleteRolePolicyRequest>(
  "DeleteRolePolicyRequest",
)(
  { RoleName: S.String, PolicyName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRolePolicyResponse extends S.Class<DeleteRolePolicyResponse>(
  "DeleteRolePolicyResponse",
)({}, ns) {}
export class DeleteSAMLProviderRequest extends S.Class<DeleteSAMLProviderRequest>(
  "DeleteSAMLProviderRequest",
)(
  { SAMLProviderArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSAMLProviderResponse extends S.Class<DeleteSAMLProviderResponse>(
  "DeleteSAMLProviderResponse",
)({}, ns) {}
export class DeleteServerCertificateRequest extends S.Class<DeleteServerCertificateRequest>(
  "DeleteServerCertificateRequest",
)(
  { ServerCertificateName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteServerCertificateResponse extends S.Class<DeleteServerCertificateResponse>(
  "DeleteServerCertificateResponse",
)({}, ns) {}
export class DeleteServiceLinkedRoleRequest extends S.Class<DeleteServiceLinkedRoleRequest>(
  "DeleteServiceLinkedRoleRequest",
)(
  { RoleName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteServiceSpecificCredentialRequest extends S.Class<DeleteServiceSpecificCredentialRequest>(
  "DeleteServiceSpecificCredentialRequest",
)(
  { UserName: S.optional(S.String), ServiceSpecificCredentialId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteServiceSpecificCredentialResponse extends S.Class<DeleteServiceSpecificCredentialResponse>(
  "DeleteServiceSpecificCredentialResponse",
)({}, ns) {}
export class DeleteSigningCertificateRequest extends S.Class<DeleteSigningCertificateRequest>(
  "DeleteSigningCertificateRequest",
)(
  { UserName: S.optional(S.String), CertificateId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSigningCertificateResponse extends S.Class<DeleteSigningCertificateResponse>(
  "DeleteSigningCertificateResponse",
)({}, ns) {}
export class DeleteSSHPublicKeyRequest extends S.Class<DeleteSSHPublicKeyRequest>(
  "DeleteSSHPublicKeyRequest",
)(
  { UserName: S.String, SSHPublicKeyId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSSHPublicKeyResponse extends S.Class<DeleteSSHPublicKeyResponse>(
  "DeleteSSHPublicKeyResponse",
)({}, ns) {}
export class DeleteUserRequest extends S.Class<DeleteUserRequest>(
  "DeleteUserRequest",
)(
  { UserName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteUserResponse extends S.Class<DeleteUserResponse>(
  "DeleteUserResponse",
)({}, ns) {}
export class DeleteUserPermissionsBoundaryRequest extends S.Class<DeleteUserPermissionsBoundaryRequest>(
  "DeleteUserPermissionsBoundaryRequest",
)(
  { UserName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteUserPermissionsBoundaryResponse extends S.Class<DeleteUserPermissionsBoundaryResponse>(
  "DeleteUserPermissionsBoundaryResponse",
)({}, ns) {}
export class DeleteUserPolicyRequest extends S.Class<DeleteUserPolicyRequest>(
  "DeleteUserPolicyRequest",
)(
  { UserName: S.String, PolicyName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteUserPolicyResponse extends S.Class<DeleteUserPolicyResponse>(
  "DeleteUserPolicyResponse",
)({}, ns) {}
export class DeleteVirtualMFADeviceRequest extends S.Class<DeleteVirtualMFADeviceRequest>(
  "DeleteVirtualMFADeviceRequest",
)(
  { SerialNumber: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteVirtualMFADeviceResponse extends S.Class<DeleteVirtualMFADeviceResponse>(
  "DeleteVirtualMFADeviceResponse",
)({}, ns) {}
export class DetachGroupPolicyRequest extends S.Class<DetachGroupPolicyRequest>(
  "DetachGroupPolicyRequest",
)(
  { GroupName: S.String, PolicyArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetachGroupPolicyResponse extends S.Class<DetachGroupPolicyResponse>(
  "DetachGroupPolicyResponse",
)({}, ns) {}
export class DetachRolePolicyRequest extends S.Class<DetachRolePolicyRequest>(
  "DetachRolePolicyRequest",
)(
  { RoleName: S.String, PolicyArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetachRolePolicyResponse extends S.Class<DetachRolePolicyResponse>(
  "DetachRolePolicyResponse",
)({}, ns) {}
export class DetachUserPolicyRequest extends S.Class<DetachUserPolicyRequest>(
  "DetachUserPolicyRequest",
)(
  { UserName: S.String, PolicyArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetachUserPolicyResponse extends S.Class<DetachUserPolicyResponse>(
  "DetachUserPolicyResponse",
)({}, ns) {}
export class DisableOrganizationsRootCredentialsManagementResponse extends S.Class<DisableOrganizationsRootCredentialsManagementResponse>(
  "DisableOrganizationsRootCredentialsManagementResponse",
)(
  {
    OrganizationId: S.optional(S.String),
    EnabledFeatures: S.optional(FeaturesListType),
  },
  ns,
) {}
export class DisableOrganizationsRootSessionsResponse extends S.Class<DisableOrganizationsRootSessionsResponse>(
  "DisableOrganizationsRootSessionsResponse",
)(
  {
    OrganizationId: S.optional(S.String),
    EnabledFeatures: S.optional(FeaturesListType),
  },
  ns,
) {}
export class EnableMFADeviceRequest extends S.Class<EnableMFADeviceRequest>(
  "EnableMFADeviceRequest",
)(
  {
    UserName: S.String,
    SerialNumber: S.String,
    AuthenticationCode1: S.String,
    AuthenticationCode2: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EnableMFADeviceResponse extends S.Class<EnableMFADeviceResponse>(
  "EnableMFADeviceResponse",
)({}, ns) {}
export class EnableOrganizationsRootCredentialsManagementResponse extends S.Class<EnableOrganizationsRootCredentialsManagementResponse>(
  "EnableOrganizationsRootCredentialsManagementResponse",
)(
  {
    OrganizationId: S.optional(S.String),
    EnabledFeatures: S.optional(FeaturesListType),
  },
  ns,
) {}
export class EnableOrganizationsRootSessionsResponse extends S.Class<EnableOrganizationsRootSessionsResponse>(
  "EnableOrganizationsRootSessionsResponse",
)(
  {
    OrganizationId: S.optional(S.String),
    EnabledFeatures: S.optional(FeaturesListType),
  },
  ns,
) {}
export class EnableOutboundWebIdentityFederationResponse extends S.Class<EnableOutboundWebIdentityFederationResponse>(
  "EnableOutboundWebIdentityFederationResponse",
)({ IssuerIdentifier: S.optional(S.String) }, ns) {}
export class GenerateCredentialReportResponse extends S.Class<GenerateCredentialReportResponse>(
  "GenerateCredentialReportResponse",
)({ State: S.optional(S.String), Description: S.optional(S.String) }, ns) {}
export class GenerateOrganizationsAccessReportRequest extends S.Class<GenerateOrganizationsAccessReportRequest>(
  "GenerateOrganizationsAccessReportRequest",
)(
  { EntityPath: S.String, OrganizationsPolicyId: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GenerateServiceLastAccessedDetailsRequest extends S.Class<GenerateServiceLastAccessedDetailsRequest>(
  "GenerateServiceLastAccessedDetailsRequest",
)(
  { Arn: S.String, Granularity: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAccessKeyLastUsedRequest extends S.Class<GetAccessKeyLastUsedRequest>(
  "GetAccessKeyLastUsedRequest",
)(
  { AccessKeyId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAccountAuthorizationDetailsRequest extends S.Class<GetAccountAuthorizationDetailsRequest>(
  "GetAccountAuthorizationDetailsRequest",
)(
  {
    Filter: S.optional(entityListType),
    MaxItems: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetContextKeysForCustomPolicyRequest extends S.Class<GetContextKeysForCustomPolicyRequest>(
  "GetContextKeysForCustomPolicyRequest",
)(
  { PolicyInputList: SimulationPolicyListType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetContextKeysForPrincipalPolicyRequest extends S.Class<GetContextKeysForPrincipalPolicyRequest>(
  "GetContextKeysForPrincipalPolicyRequest",
)(
  {
    PolicySourceArn: S.String,
    PolicyInputList: S.optional(SimulationPolicyListType),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCredentialReportResponse extends S.Class<GetCredentialReportResponse>(
  "GetCredentialReportResponse",
)(
  {
    Content: S.optional(T.Blob),
    ReportFormat: S.optional(S.String),
    GeneratedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  },
  ns,
) {}
export class GetDelegationRequestRequest extends S.Class<GetDelegationRequestRequest>(
  "GetDelegationRequestRequest",
)(
  {
    DelegationRequestId: S.String,
    DelegationPermissionCheck: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetGroupRequest extends S.Class<GetGroupRequest>(
  "GetGroupRequest",
)(
  {
    GroupName: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetGroupPolicyRequest extends S.Class<GetGroupPolicyRequest>(
  "GetGroupPolicyRequest",
)(
  { GroupName: S.String, PolicyName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetHumanReadableSummaryRequest extends S.Class<GetHumanReadableSummaryRequest>(
  "GetHumanReadableSummaryRequest",
)(
  { EntityArn: S.String, Locale: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetInstanceProfileRequest extends S.Class<GetInstanceProfileRequest>(
  "GetInstanceProfileRequest",
)(
  { InstanceProfileName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetLoginProfileRequest extends S.Class<GetLoginProfileRequest>(
  "GetLoginProfileRequest",
)(
  { UserName: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetMFADeviceRequest extends S.Class<GetMFADeviceRequest>(
  "GetMFADeviceRequest",
)(
  { SerialNumber: S.String, UserName: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetOpenIDConnectProviderRequest extends S.Class<GetOpenIDConnectProviderRequest>(
  "GetOpenIDConnectProviderRequest",
)(
  { OpenIDConnectProviderArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetOrganizationsAccessReportRequest extends S.Class<GetOrganizationsAccessReportRequest>(
  "GetOrganizationsAccessReportRequest",
)(
  {
    JobId: S.String,
    MaxItems: S.optional(S.Number),
    Marker: S.optional(S.String),
    SortKey: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetOutboundWebIdentityFederationInfoResponse extends S.Class<GetOutboundWebIdentityFederationInfoResponse>(
  "GetOutboundWebIdentityFederationInfoResponse",
)(
  {
    IssuerIdentifier: S.optional(S.String),
    JwtVendingEnabled: S.optional(S.Boolean),
  },
  ns,
) {}
export class GetPolicyRequest extends S.Class<GetPolicyRequest>(
  "GetPolicyRequest",
)(
  { PolicyArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPolicyVersionRequest extends S.Class<GetPolicyVersionRequest>(
  "GetPolicyVersionRequest",
)(
  { PolicyArn: S.String, VersionId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRoleRequest extends S.Class<GetRoleRequest>("GetRoleRequest")(
  { RoleName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRolePolicyRequest extends S.Class<GetRolePolicyRequest>(
  "GetRolePolicyRequest",
)(
  { RoleName: S.String, PolicyName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSAMLProviderRequest extends S.Class<GetSAMLProviderRequest>(
  "GetSAMLProviderRequest",
)(
  { SAMLProviderArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetServerCertificateRequest extends S.Class<GetServerCertificateRequest>(
  "GetServerCertificateRequest",
)(
  { ServerCertificateName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetServiceLastAccessedDetailsRequest extends S.Class<GetServiceLastAccessedDetailsRequest>(
  "GetServiceLastAccessedDetailsRequest",
)(
  {
    JobId: S.String,
    MaxItems: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetServiceLastAccessedDetailsWithEntitiesRequest extends S.Class<GetServiceLastAccessedDetailsWithEntitiesRequest>(
  "GetServiceLastAccessedDetailsWithEntitiesRequest",
)(
  {
    JobId: S.String,
    ServiceNamespace: S.String,
    MaxItems: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetServiceLinkedRoleDeletionStatusRequest extends S.Class<GetServiceLinkedRoleDeletionStatusRequest>(
  "GetServiceLinkedRoleDeletionStatusRequest",
)(
  { DeletionTaskId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSSHPublicKeyRequest extends S.Class<GetSSHPublicKeyRequest>(
  "GetSSHPublicKeyRequest",
)(
  { UserName: S.String, SSHPublicKeyId: S.String, Encoding: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetUserRequest extends S.Class<GetUserRequest>("GetUserRequest")(
  { UserName: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetUserPolicyRequest extends S.Class<GetUserPolicyRequest>(
  "GetUserPolicyRequest",
)(
  { UserName: S.String, PolicyName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAccessKeysRequest extends S.Class<ListAccessKeysRequest>(
  "ListAccessKeysRequest",
)(
  {
    UserName: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAccountAliasesRequest extends S.Class<ListAccountAliasesRequest>(
  "ListAccountAliasesRequest",
)(
  { Marker: S.optional(S.String), MaxItems: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAttachedGroupPoliciesRequest extends S.Class<ListAttachedGroupPoliciesRequest>(
  "ListAttachedGroupPoliciesRequest",
)(
  {
    GroupName: S.String,
    PathPrefix: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAttachedRolePoliciesRequest extends S.Class<ListAttachedRolePoliciesRequest>(
  "ListAttachedRolePoliciesRequest",
)(
  {
    RoleName: S.String,
    PathPrefix: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAttachedUserPoliciesRequest extends S.Class<ListAttachedUserPoliciesRequest>(
  "ListAttachedUserPoliciesRequest",
)(
  {
    UserName: S.String,
    PathPrefix: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDelegationRequestsRequest extends S.Class<ListDelegationRequestsRequest>(
  "ListDelegationRequestsRequest",
)(
  {
    OwnerId: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEntitiesForPolicyRequest extends S.Class<ListEntitiesForPolicyRequest>(
  "ListEntitiesForPolicyRequest",
)(
  {
    PolicyArn: S.String,
    EntityFilter: S.optional(S.String),
    PathPrefix: S.optional(S.String),
    PolicyUsageFilter: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListGroupPoliciesRequest extends S.Class<ListGroupPoliciesRequest>(
  "ListGroupPoliciesRequest",
)(
  {
    GroupName: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListGroupsRequest extends S.Class<ListGroupsRequest>(
  "ListGroupsRequest",
)(
  {
    PathPrefix: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListGroupsForUserRequest extends S.Class<ListGroupsForUserRequest>(
  "ListGroupsForUserRequest",
)(
  {
    UserName: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListInstanceProfilesRequest extends S.Class<ListInstanceProfilesRequest>(
  "ListInstanceProfilesRequest",
)(
  {
    PathPrefix: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListInstanceProfilesForRoleRequest extends S.Class<ListInstanceProfilesForRoleRequest>(
  "ListInstanceProfilesForRoleRequest",
)(
  {
    RoleName: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListInstanceProfileTagsRequest extends S.Class<ListInstanceProfileTagsRequest>(
  "ListInstanceProfileTagsRequest",
)(
  {
    InstanceProfileName: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMFADevicesRequest extends S.Class<ListMFADevicesRequest>(
  "ListMFADevicesRequest",
)(
  {
    UserName: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMFADeviceTagsRequest extends S.Class<ListMFADeviceTagsRequest>(
  "ListMFADeviceTagsRequest",
)(
  {
    SerialNumber: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListOpenIDConnectProviderTagsRequest extends S.Class<ListOpenIDConnectProviderTagsRequest>(
  "ListOpenIDConnectProviderTagsRequest",
)(
  {
    OpenIDConnectProviderArn: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListOrganizationsFeaturesResponse extends S.Class<ListOrganizationsFeaturesResponse>(
  "ListOrganizationsFeaturesResponse",
)(
  {
    OrganizationId: S.optional(S.String),
    EnabledFeatures: S.optional(FeaturesListType),
  },
  ns,
) {}
export class ListPoliciesRequest extends S.Class<ListPoliciesRequest>(
  "ListPoliciesRequest",
)(
  {
    Scope: S.optional(S.String),
    OnlyAttached: S.optional(S.Boolean),
    PathPrefix: S.optional(S.String),
    PolicyUsageFilter: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPoliciesGrantingServiceAccessRequest extends S.Class<ListPoliciesGrantingServiceAccessRequest>(
  "ListPoliciesGrantingServiceAccessRequest",
)(
  {
    Marker: S.optional(S.String),
    Arn: S.String,
    ServiceNamespaces: serviceNamespaceListType,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPolicyTagsRequest extends S.Class<ListPolicyTagsRequest>(
  "ListPolicyTagsRequest",
)(
  {
    PolicyArn: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPolicyVersionsRequest extends S.Class<ListPolicyVersionsRequest>(
  "ListPolicyVersionsRequest",
)(
  {
    PolicyArn: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRolePoliciesRequest extends S.Class<ListRolePoliciesRequest>(
  "ListRolePoliciesRequest",
)(
  {
    RoleName: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRolesRequest extends S.Class<ListRolesRequest>(
  "ListRolesRequest",
)(
  {
    PathPrefix: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRoleTagsRequest extends S.Class<ListRoleTagsRequest>(
  "ListRoleTagsRequest",
)(
  {
    RoleName: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSAMLProviderTagsRequest extends S.Class<ListSAMLProviderTagsRequest>(
  "ListSAMLProviderTagsRequest",
)(
  {
    SAMLProviderArn: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListServerCertificatesRequest extends S.Class<ListServerCertificatesRequest>(
  "ListServerCertificatesRequest",
)(
  {
    PathPrefix: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListServerCertificateTagsRequest extends S.Class<ListServerCertificateTagsRequest>(
  "ListServerCertificateTagsRequest",
)(
  {
    ServerCertificateName: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListServiceSpecificCredentialsRequest extends S.Class<ListServiceSpecificCredentialsRequest>(
  "ListServiceSpecificCredentialsRequest",
)(
  {
    UserName: S.optional(S.String),
    ServiceName: S.optional(S.String),
    AllUsers: S.optional(S.Boolean),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSigningCertificatesRequest extends S.Class<ListSigningCertificatesRequest>(
  "ListSigningCertificatesRequest",
)(
  {
    UserName: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSSHPublicKeysRequest extends S.Class<ListSSHPublicKeysRequest>(
  "ListSSHPublicKeysRequest",
)(
  {
    UserName: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListUserPoliciesRequest extends S.Class<ListUserPoliciesRequest>(
  "ListUserPoliciesRequest",
)(
  {
    UserName: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListUsersRequest extends S.Class<ListUsersRequest>(
  "ListUsersRequest",
)(
  {
    PathPrefix: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListUserTagsRequest extends S.Class<ListUserTagsRequest>(
  "ListUserTagsRequest",
)(
  {
    UserName: S.String,
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListVirtualMFADevicesRequest extends S.Class<ListVirtualMFADevicesRequest>(
  "ListVirtualMFADevicesRequest",
)(
  {
    AssignmentStatus: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutGroupPolicyRequest extends S.Class<PutGroupPolicyRequest>(
  "PutGroupPolicyRequest",
)(
  { GroupName: S.String, PolicyName: S.String, PolicyDocument: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutGroupPolicyResponse extends S.Class<PutGroupPolicyResponse>(
  "PutGroupPolicyResponse",
)({}, ns) {}
export class PutRolePermissionsBoundaryRequest extends S.Class<PutRolePermissionsBoundaryRequest>(
  "PutRolePermissionsBoundaryRequest",
)(
  { RoleName: S.String, PermissionsBoundary: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutRolePermissionsBoundaryResponse extends S.Class<PutRolePermissionsBoundaryResponse>(
  "PutRolePermissionsBoundaryResponse",
)({}, ns) {}
export class PutRolePolicyRequest extends S.Class<PutRolePolicyRequest>(
  "PutRolePolicyRequest",
)(
  { RoleName: S.String, PolicyName: S.String, PolicyDocument: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutRolePolicyResponse extends S.Class<PutRolePolicyResponse>(
  "PutRolePolicyResponse",
)({}, ns) {}
export class PutUserPermissionsBoundaryRequest extends S.Class<PutUserPermissionsBoundaryRequest>(
  "PutUserPermissionsBoundaryRequest",
)(
  { UserName: S.String, PermissionsBoundary: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutUserPermissionsBoundaryResponse extends S.Class<PutUserPermissionsBoundaryResponse>(
  "PutUserPermissionsBoundaryResponse",
)({}, ns) {}
export class PutUserPolicyRequest extends S.Class<PutUserPolicyRequest>(
  "PutUserPolicyRequest",
)(
  { UserName: S.String, PolicyName: S.String, PolicyDocument: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutUserPolicyResponse extends S.Class<PutUserPolicyResponse>(
  "PutUserPolicyResponse",
)({}, ns) {}
export class RejectDelegationRequestRequest extends S.Class<RejectDelegationRequestRequest>(
  "RejectDelegationRequestRequest",
)(
  { DelegationRequestId: S.String, Notes: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RejectDelegationRequestResponse extends S.Class<RejectDelegationRequestResponse>(
  "RejectDelegationRequestResponse",
)({}, ns) {}
export class RemoveClientIDFromOpenIDConnectProviderRequest extends S.Class<RemoveClientIDFromOpenIDConnectProviderRequest>(
  "RemoveClientIDFromOpenIDConnectProviderRequest",
)(
  { OpenIDConnectProviderArn: S.String, ClientID: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveClientIDFromOpenIDConnectProviderResponse extends S.Class<RemoveClientIDFromOpenIDConnectProviderResponse>(
  "RemoveClientIDFromOpenIDConnectProviderResponse",
)({}, ns) {}
export class RemoveRoleFromInstanceProfileRequest extends S.Class<RemoveRoleFromInstanceProfileRequest>(
  "RemoveRoleFromInstanceProfileRequest",
)(
  { InstanceProfileName: S.String, RoleName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveRoleFromInstanceProfileResponse extends S.Class<RemoveRoleFromInstanceProfileResponse>(
  "RemoveRoleFromInstanceProfileResponse",
)({}, ns) {}
export class RemoveUserFromGroupRequest extends S.Class<RemoveUserFromGroupRequest>(
  "RemoveUserFromGroupRequest",
)(
  { GroupName: S.String, UserName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveUserFromGroupResponse extends S.Class<RemoveUserFromGroupResponse>(
  "RemoveUserFromGroupResponse",
)({}, ns) {}
export class ResetServiceSpecificCredentialRequest extends S.Class<ResetServiceSpecificCredentialRequest>(
  "ResetServiceSpecificCredentialRequest",
)(
  { UserName: S.optional(S.String), ServiceSpecificCredentialId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResyncMFADeviceRequest extends S.Class<ResyncMFADeviceRequest>(
  "ResyncMFADeviceRequest",
)(
  {
    UserName: S.String,
    SerialNumber: S.String,
    AuthenticationCode1: S.String,
    AuthenticationCode2: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResyncMFADeviceResponse extends S.Class<ResyncMFADeviceResponse>(
  "ResyncMFADeviceResponse",
)({}, ns) {}
export class SendDelegationTokenRequest extends S.Class<SendDelegationTokenRequest>(
  "SendDelegationTokenRequest",
)(
  { DelegationRequestId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SendDelegationTokenResponse extends S.Class<SendDelegationTokenResponse>(
  "SendDelegationTokenResponse",
)({}, ns) {}
export class SetDefaultPolicyVersionRequest extends S.Class<SetDefaultPolicyVersionRequest>(
  "SetDefaultPolicyVersionRequest",
)(
  { PolicyArn: S.String, VersionId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetDefaultPolicyVersionResponse extends S.Class<SetDefaultPolicyVersionResponse>(
  "SetDefaultPolicyVersionResponse",
)({}, ns) {}
export class SetSecurityTokenServicePreferencesRequest extends S.Class<SetSecurityTokenServicePreferencesRequest>(
  "SetSecurityTokenServicePreferencesRequest",
)(
  { GlobalEndpointTokenVersion: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetSecurityTokenServicePreferencesResponse extends S.Class<SetSecurityTokenServicePreferencesResponse>(
  "SetSecurityTokenServicePreferencesResponse",
)({}, ns) {}
export const ContextKeyValueListType = S.Array(S.String);
export class ContextEntry extends S.Class<ContextEntry>("ContextEntry")({
  ContextKeyName: S.optional(S.String),
  ContextKeyValues: S.optional(ContextKeyValueListType),
  ContextKeyType: S.optional(S.String),
}) {}
export const ContextEntryListType = S.Array(ContextEntry);
export class SimulatePrincipalPolicyRequest extends S.Class<SimulatePrincipalPolicyRequest>(
  "SimulatePrincipalPolicyRequest",
)(
  {
    PolicySourceArn: S.String,
    PolicyInputList: S.optional(SimulationPolicyListType),
    PermissionsBoundaryPolicyInputList: S.optional(SimulationPolicyListType),
    ActionNames: ActionNameListType,
    ResourceArns: S.optional(ResourceNameListType),
    ResourcePolicy: S.optional(S.String),
    ResourceOwner: S.optional(S.String),
    CallerArn: S.optional(S.String),
    ContextEntries: S.optional(ContextEntryListType),
    ResourceHandlingOption: S.optional(S.String),
    MaxItems: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagInstanceProfileRequest extends S.Class<TagInstanceProfileRequest>(
  "TagInstanceProfileRequest",
)(
  { InstanceProfileName: S.String, Tags: tagListType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagInstanceProfileResponse extends S.Class<TagInstanceProfileResponse>(
  "TagInstanceProfileResponse",
)({}, ns) {}
export class TagMFADeviceRequest extends S.Class<TagMFADeviceRequest>(
  "TagMFADeviceRequest",
)(
  { SerialNumber: S.String, Tags: tagListType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagMFADeviceResponse extends S.Class<TagMFADeviceResponse>(
  "TagMFADeviceResponse",
)({}, ns) {}
export class TagOpenIDConnectProviderRequest extends S.Class<TagOpenIDConnectProviderRequest>(
  "TagOpenIDConnectProviderRequest",
)(
  { OpenIDConnectProviderArn: S.String, Tags: tagListType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagOpenIDConnectProviderResponse extends S.Class<TagOpenIDConnectProviderResponse>(
  "TagOpenIDConnectProviderResponse",
)({}, ns) {}
export class TagPolicyRequest extends S.Class<TagPolicyRequest>(
  "TagPolicyRequest",
)(
  { PolicyArn: S.String, Tags: tagListType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagPolicyResponse extends S.Class<TagPolicyResponse>(
  "TagPolicyResponse",
)({}, ns) {}
export class TagRoleRequest extends S.Class<TagRoleRequest>("TagRoleRequest")(
  { RoleName: S.String, Tags: tagListType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagRoleResponse extends S.Class<TagRoleResponse>(
  "TagRoleResponse",
)({}, ns) {}
export class TagSAMLProviderRequest extends S.Class<TagSAMLProviderRequest>(
  "TagSAMLProviderRequest",
)(
  { SAMLProviderArn: S.String, Tags: tagListType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagSAMLProviderResponse extends S.Class<TagSAMLProviderResponse>(
  "TagSAMLProviderResponse",
)({}, ns) {}
export class TagServerCertificateRequest extends S.Class<TagServerCertificateRequest>(
  "TagServerCertificateRequest",
)(
  { ServerCertificateName: S.String, Tags: tagListType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagServerCertificateResponse extends S.Class<TagServerCertificateResponse>(
  "TagServerCertificateResponse",
)({}, ns) {}
export class TagUserRequest extends S.Class<TagUserRequest>("TagUserRequest")(
  { UserName: S.String, Tags: tagListType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagUserResponse extends S.Class<TagUserResponse>(
  "TagUserResponse",
)({}, ns) {}
export class UntagInstanceProfileRequest extends S.Class<UntagInstanceProfileRequest>(
  "UntagInstanceProfileRequest",
)(
  { InstanceProfileName: S.String, TagKeys: tagKeyListType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagInstanceProfileResponse extends S.Class<UntagInstanceProfileResponse>(
  "UntagInstanceProfileResponse",
)({}, ns) {}
export class UntagMFADeviceRequest extends S.Class<UntagMFADeviceRequest>(
  "UntagMFADeviceRequest",
)(
  { SerialNumber: S.String, TagKeys: tagKeyListType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagMFADeviceResponse extends S.Class<UntagMFADeviceResponse>(
  "UntagMFADeviceResponse",
)({}, ns) {}
export class UntagOpenIDConnectProviderRequest extends S.Class<UntagOpenIDConnectProviderRequest>(
  "UntagOpenIDConnectProviderRequest",
)(
  { OpenIDConnectProviderArn: S.String, TagKeys: tagKeyListType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagOpenIDConnectProviderResponse extends S.Class<UntagOpenIDConnectProviderResponse>(
  "UntagOpenIDConnectProviderResponse",
)({}, ns) {}
export class UntagPolicyRequest extends S.Class<UntagPolicyRequest>(
  "UntagPolicyRequest",
)(
  { PolicyArn: S.String, TagKeys: tagKeyListType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagPolicyResponse extends S.Class<UntagPolicyResponse>(
  "UntagPolicyResponse",
)({}, ns) {}
export class UntagRoleRequest extends S.Class<UntagRoleRequest>(
  "UntagRoleRequest",
)(
  { RoleName: S.String, TagKeys: tagKeyListType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagRoleResponse extends S.Class<UntagRoleResponse>(
  "UntagRoleResponse",
)({}, ns) {}
export class UntagSAMLProviderRequest extends S.Class<UntagSAMLProviderRequest>(
  "UntagSAMLProviderRequest",
)(
  { SAMLProviderArn: S.String, TagKeys: tagKeyListType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagSAMLProviderResponse extends S.Class<UntagSAMLProviderResponse>(
  "UntagSAMLProviderResponse",
)({}, ns) {}
export class UntagServerCertificateRequest extends S.Class<UntagServerCertificateRequest>(
  "UntagServerCertificateRequest",
)(
  { ServerCertificateName: S.String, TagKeys: tagKeyListType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagServerCertificateResponse extends S.Class<UntagServerCertificateResponse>(
  "UntagServerCertificateResponse",
)({}, ns) {}
export class UntagUserRequest extends S.Class<UntagUserRequest>(
  "UntagUserRequest",
)(
  { UserName: S.String, TagKeys: tagKeyListType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagUserResponse extends S.Class<UntagUserResponse>(
  "UntagUserResponse",
)({}, ns) {}
export class UpdateAccessKeyRequest extends S.Class<UpdateAccessKeyRequest>(
  "UpdateAccessKeyRequest",
)(
  { UserName: S.optional(S.String), AccessKeyId: S.String, Status: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateAccessKeyResponse extends S.Class<UpdateAccessKeyResponse>(
  "UpdateAccessKeyResponse",
)({}, ns) {}
export class UpdateAccountPasswordPolicyRequest extends S.Class<UpdateAccountPasswordPolicyRequest>(
  "UpdateAccountPasswordPolicyRequest",
)(
  {
    MinimumPasswordLength: S.optional(S.Number),
    RequireSymbols: S.optional(S.Boolean),
    RequireNumbers: S.optional(S.Boolean),
    RequireUppercaseCharacters: S.optional(S.Boolean),
    RequireLowercaseCharacters: S.optional(S.Boolean),
    AllowUsersToChangePassword: S.optional(S.Boolean),
    MaxPasswordAge: S.optional(S.Number),
    PasswordReusePrevention: S.optional(S.Number),
    HardExpiry: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateAccountPasswordPolicyResponse extends S.Class<UpdateAccountPasswordPolicyResponse>(
  "UpdateAccountPasswordPolicyResponse",
)({}, ns) {}
export class UpdateAssumeRolePolicyRequest extends S.Class<UpdateAssumeRolePolicyRequest>(
  "UpdateAssumeRolePolicyRequest",
)(
  { RoleName: S.String, PolicyDocument: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateAssumeRolePolicyResponse extends S.Class<UpdateAssumeRolePolicyResponse>(
  "UpdateAssumeRolePolicyResponse",
)({}, ns) {}
export class UpdateDelegationRequestRequest extends S.Class<UpdateDelegationRequestRequest>(
  "UpdateDelegationRequestRequest",
)(
  { DelegationRequestId: S.String, Notes: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDelegationRequestResponse extends S.Class<UpdateDelegationRequestResponse>(
  "UpdateDelegationRequestResponse",
)({}, ns) {}
export class UpdateGroupRequest extends S.Class<UpdateGroupRequest>(
  "UpdateGroupRequest",
)(
  {
    GroupName: S.String,
    NewPath: S.optional(S.String),
    NewGroupName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateGroupResponse extends S.Class<UpdateGroupResponse>(
  "UpdateGroupResponse",
)({}, ns) {}
export class UpdateLoginProfileRequest extends S.Class<UpdateLoginProfileRequest>(
  "UpdateLoginProfileRequest",
)(
  {
    UserName: S.String,
    Password: S.optional(S.String),
    PasswordResetRequired: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateLoginProfileResponse extends S.Class<UpdateLoginProfileResponse>(
  "UpdateLoginProfileResponse",
)({}, ns) {}
export class UpdateOpenIDConnectProviderThumbprintRequest extends S.Class<UpdateOpenIDConnectProviderThumbprintRequest>(
  "UpdateOpenIDConnectProviderThumbprintRequest",
)(
  { OpenIDConnectProviderArn: S.String, ThumbprintList: thumbprintListType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateOpenIDConnectProviderThumbprintResponse extends S.Class<UpdateOpenIDConnectProviderThumbprintResponse>(
  "UpdateOpenIDConnectProviderThumbprintResponse",
)({}, ns) {}
export class UpdateRoleRequest extends S.Class<UpdateRoleRequest>(
  "UpdateRoleRequest",
)(
  {
    RoleName: S.String,
    Description: S.optional(S.String),
    MaxSessionDuration: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateRoleResponse extends S.Class<UpdateRoleResponse>(
  "UpdateRoleResponse",
)({}, ns) {}
export class UpdateRoleDescriptionRequest extends S.Class<UpdateRoleDescriptionRequest>(
  "UpdateRoleDescriptionRequest",
)(
  { RoleName: S.String, Description: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSAMLProviderRequest extends S.Class<UpdateSAMLProviderRequest>(
  "UpdateSAMLProviderRequest",
)(
  {
    SAMLMetadataDocument: S.optional(S.String),
    SAMLProviderArn: S.String,
    AssertionEncryptionMode: S.optional(S.String),
    AddPrivateKey: S.optional(S.String),
    RemovePrivateKey: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateServerCertificateRequest extends S.Class<UpdateServerCertificateRequest>(
  "UpdateServerCertificateRequest",
)(
  {
    ServerCertificateName: S.String,
    NewPath: S.optional(S.String),
    NewServerCertificateName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateServerCertificateResponse extends S.Class<UpdateServerCertificateResponse>(
  "UpdateServerCertificateResponse",
)({}, ns) {}
export class UpdateServiceSpecificCredentialRequest extends S.Class<UpdateServiceSpecificCredentialRequest>(
  "UpdateServiceSpecificCredentialRequest",
)(
  {
    UserName: S.optional(S.String),
    ServiceSpecificCredentialId: S.String,
    Status: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateServiceSpecificCredentialResponse extends S.Class<UpdateServiceSpecificCredentialResponse>(
  "UpdateServiceSpecificCredentialResponse",
)({}, ns) {}
export class UpdateSigningCertificateRequest extends S.Class<UpdateSigningCertificateRequest>(
  "UpdateSigningCertificateRequest",
)(
  { UserName: S.optional(S.String), CertificateId: S.String, Status: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSigningCertificateResponse extends S.Class<UpdateSigningCertificateResponse>(
  "UpdateSigningCertificateResponse",
)({}, ns) {}
export class UpdateSSHPublicKeyRequest extends S.Class<UpdateSSHPublicKeyRequest>(
  "UpdateSSHPublicKeyRequest",
)(
  { UserName: S.String, SSHPublicKeyId: S.String, Status: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSSHPublicKeyResponse extends S.Class<UpdateSSHPublicKeyResponse>(
  "UpdateSSHPublicKeyResponse",
)({}, ns) {}
export class UpdateUserRequest extends S.Class<UpdateUserRequest>(
  "UpdateUserRequest",
)(
  {
    UserName: S.String,
    NewPath: S.optional(S.String),
    NewUserName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateUserResponse extends S.Class<UpdateUserResponse>(
  "UpdateUserResponse",
)({}, ns) {}
export class UploadServerCertificateRequest extends S.Class<UploadServerCertificateRequest>(
  "UploadServerCertificateRequest",
)(
  {
    Path: S.optional(S.String),
    ServerCertificateName: S.String,
    CertificateBody: S.String,
    PrivateKey: S.String,
    CertificateChain: S.optional(S.String),
    Tags: S.optional(tagListType),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UploadSigningCertificateRequest extends S.Class<UploadSigningCertificateRequest>(
  "UploadSigningCertificateRequest",
)(
  { UserName: S.optional(S.String), CertificateBody: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UploadSSHPublicKeyRequest extends S.Class<UploadSSHPublicKeyRequest>(
  "UploadSSHPublicKeyRequest",
)(
  { UserName: S.String, SSHPublicKeyBody: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PasswordPolicy extends S.Class<PasswordPolicy>("PasswordPolicy")({
  MinimumPasswordLength: S.optional(S.Number),
  RequireSymbols: S.optional(S.Boolean),
  RequireNumbers: S.optional(S.Boolean),
  RequireUppercaseCharacters: S.optional(S.Boolean),
  RequireLowercaseCharacters: S.optional(S.Boolean),
  AllowUsersToChangePassword: S.optional(S.Boolean),
  ExpirePasswords: S.optional(S.Boolean),
  MaxPasswordAge: S.optional(S.Number),
  PasswordReusePrevention: S.optional(S.Number),
  HardExpiry: S.optional(S.Boolean),
}) {}
export const summaryMapType = S.Record({ key: S.String, value: S.Number });
export const ContextKeyNamesResultListType = S.Array(S.String);
export class AttachedPermissionsBoundary extends S.Class<AttachedPermissionsBoundary>(
  "AttachedPermissionsBoundary",
)({
  PermissionsBoundaryType: S.optional(S.String),
  PermissionsBoundaryArn: S.optional(S.String),
}) {}
export class User extends S.Class<User>("User")({
  Path: S.String,
  UserName: S.String,
  UserId: S.String,
  Arn: S.String,
  CreateDate: S.Date.pipe(T.TimestampFormat("date-time")),
  PasswordLastUsed: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  PermissionsBoundary: S.optional(AttachedPermissionsBoundary),
  Tags: S.optional(tagListType),
}) {}
export const userListType = S.Array(User);
export const accountAliasListType = S.Array(S.String);
export const policyParameterValuesListType = S.Array(S.String);
export class PolicyParameter extends S.Class<PolicyParameter>(
  "PolicyParameter",
)({
  Name: S.optional(S.String),
  Values: S.optional(policyParameterValuesListType),
  Type: S.optional(S.String),
}) {}
export const policyParameterListType = S.Array(PolicyParameter);
export class DelegationPermission extends S.Class<DelegationPermission>(
  "DelegationPermission",
)({
  PolicyTemplateArn: S.optional(S.String),
  Parameters: S.optional(policyParameterListType),
}) {}
export const rolePermissionRestrictionArnListType = S.Array(S.String);
export class DelegationRequest extends S.Class<DelegationRequest>(
  "DelegationRequest",
)({
  DelegationRequestId: S.optional(S.String),
  OwnerAccountId: S.optional(S.String),
  Description: S.optional(S.String),
  RequestMessage: S.optional(S.String),
  Permissions: S.optional(DelegationPermission),
  PermissionPolicy: S.optional(S.String),
  RolePermissionRestrictionArns: S.optional(
    rolePermissionRestrictionArnListType,
  ),
  OwnerId: S.optional(S.String),
  ApproverId: S.optional(S.String),
  State: S.optional(S.String),
  ExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  RequestorId: S.optional(S.String),
  RequestorName: S.optional(S.String),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  SessionDuration: S.optional(S.Number),
  RedirectUrl: S.optional(S.String),
  Notes: S.optional(S.String),
  RejectionReason: S.optional(S.String),
  OnlySendByOwner: S.optional(S.Boolean),
  UpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const delegationRequestsListType = S.Array(DelegationRequest);
export const policyNameListType = S.Array(S.String);
export class Group extends S.Class<Group>("Group")({
  Path: S.String,
  GroupName: S.String,
  GroupId: S.String,
  Arn: S.String,
  CreateDate: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const groupListType = S.Array(Group);
export class RoleLastUsed extends S.Class<RoleLastUsed>("RoleLastUsed")({
  LastUsedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Region: S.optional(S.String),
}) {}
export class Role extends S.Class<Role>("Role")({
  Path: S.String,
  RoleName: S.String,
  RoleId: S.String,
  Arn: S.String,
  CreateDate: S.Date.pipe(T.TimestampFormat("date-time")),
  AssumeRolePolicyDocument: S.optional(S.String),
  Description: S.optional(S.String),
  MaxSessionDuration: S.optional(S.Number),
  PermissionsBoundary: S.optional(AttachedPermissionsBoundary),
  Tags: S.optional(tagListType),
  RoleLastUsed: S.optional(RoleLastUsed),
}) {}
export const roleListType = S.Array(Role);
export class InstanceProfile extends S.Class<InstanceProfile>(
  "InstanceProfile",
)({
  Path: S.String,
  InstanceProfileName: S.String,
  InstanceProfileId: S.String,
  Arn: S.String,
  CreateDate: S.Date.pipe(T.TimestampFormat("date-time")),
  Roles: roleListType,
  Tags: S.optional(tagListType),
}) {}
export const instanceProfileListType = S.Array(InstanceProfile);
export class OpenIDConnectProviderListEntry extends S.Class<OpenIDConnectProviderListEntry>(
  "OpenIDConnectProviderListEntry",
)({ Arn: S.optional(S.String) }) {}
export const OpenIDConnectProviderListType = S.Array(
  OpenIDConnectProviderListEntry,
);
export class Policy extends S.Class<Policy>("Policy")({
  PolicyName: S.optional(S.String),
  PolicyId: S.optional(S.String),
  Arn: S.optional(S.String),
  Path: S.optional(S.String),
  DefaultVersionId: S.optional(S.String),
  AttachmentCount: S.optional(S.Number),
  PermissionsBoundaryUsageCount: S.optional(S.Number),
  IsAttachable: S.optional(S.Boolean),
  Description: S.optional(S.String),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Tags: S.optional(tagListType),
}) {}
export const policyListType = S.Array(Policy);
export class PolicyVersion extends S.Class<PolicyVersion>("PolicyVersion")({
  Document: S.optional(S.String),
  VersionId: S.optional(S.String),
  IsDefaultVersion: S.optional(S.Boolean),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const policyDocumentVersionListType = S.Array(PolicyVersion);
export class SAMLProviderListEntry extends S.Class<SAMLProviderListEntry>(
  "SAMLProviderListEntry",
)({
  Arn: S.optional(S.String),
  ValidUntil: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const SAMLProviderListType = S.Array(SAMLProviderListEntry);
export class VirtualMFADevice extends S.Class<VirtualMFADevice>(
  "VirtualMFADevice",
)({
  SerialNumber: S.String,
  Base32StringSeed: S.optional(T.Blob),
  QRCodePNG: S.optional(T.Blob),
  User: S.optional(User),
  EnableDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Tags: S.optional(tagListType),
}) {}
export const virtualMFADeviceListType = S.Array(VirtualMFADevice);
export class CreateInstanceProfileRequest extends S.Class<CreateInstanceProfileRequest>(
  "CreateInstanceProfileRequest",
)(
  {
    InstanceProfileName: S.String,
    Path: S.optional(S.String),
    Tags: S.optional(tagListType),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateOpenIDConnectProviderResponse extends S.Class<CreateOpenIDConnectProviderResponse>(
  "CreateOpenIDConnectProviderResponse",
)(
  {
    OpenIDConnectProviderArn: S.optional(S.String),
    Tags: S.optional(tagListType),
  },
  ns,
) {}
export class CreateSAMLProviderResponse extends S.Class<CreateSAMLProviderResponse>(
  "CreateSAMLProviderResponse",
)(
  { SAMLProviderArn: S.optional(S.String), Tags: S.optional(tagListType) },
  ns,
) {}
export class CreateServiceLinkedRoleResponse extends S.Class<CreateServiceLinkedRoleResponse>(
  "CreateServiceLinkedRoleResponse",
)({ Role: S.optional(Role) }, ns) {}
export class DeleteServiceLinkedRoleResponse extends S.Class<DeleteServiceLinkedRoleResponse>(
  "DeleteServiceLinkedRoleResponse",
)({ DeletionTaskId: S.String }, ns) {}
export class GenerateOrganizationsAccessReportResponse extends S.Class<GenerateOrganizationsAccessReportResponse>(
  "GenerateOrganizationsAccessReportResponse",
)({ JobId: S.optional(S.String) }, ns) {}
export class GenerateServiceLastAccessedDetailsResponse extends S.Class<GenerateServiceLastAccessedDetailsResponse>(
  "GenerateServiceLastAccessedDetailsResponse",
)({ JobId: S.optional(S.String) }, ns) {}
export class GetAccountPasswordPolicyResponse extends S.Class<GetAccountPasswordPolicyResponse>(
  "GetAccountPasswordPolicyResponse",
)({ PasswordPolicy: PasswordPolicy }, ns) {}
export class GetAccountSummaryResponse extends S.Class<GetAccountSummaryResponse>(
  "GetAccountSummaryResponse",
)({ SummaryMap: S.optional(summaryMapType) }, ns) {}
export class GetContextKeysForPolicyResponse extends S.Class<GetContextKeysForPolicyResponse>(
  "GetContextKeysForPolicyResponse",
)({ ContextKeyNames: S.optional(ContextKeyNamesResultListType) }, ns) {}
export class GetGroupResponse extends S.Class<GetGroupResponse>(
  "GetGroupResponse",
)(
  {
    Group: Group,
    Users: userListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class GetGroupPolicyResponse extends S.Class<GetGroupPolicyResponse>(
  "GetGroupPolicyResponse",
)(
  { GroupName: S.String, PolicyName: S.String, PolicyDocument: S.String },
  ns,
) {}
export class GetHumanReadableSummaryResponse extends S.Class<GetHumanReadableSummaryResponse>(
  "GetHumanReadableSummaryResponse",
)(
  {
    SummaryContent: S.optional(S.String),
    Locale: S.optional(S.String),
    SummaryState: S.optional(S.String),
  },
  ns,
) {}
export class LoginProfile extends S.Class<LoginProfile>("LoginProfile")({
  UserName: S.String,
  CreateDate: S.Date.pipe(T.TimestampFormat("date-time")),
  PasswordResetRequired: S.optional(S.Boolean),
}) {}
export class GetLoginProfileResponse extends S.Class<GetLoginProfileResponse>(
  "GetLoginProfileResponse",
)({ LoginProfile: LoginProfile }, ns) {}
export class GetOpenIDConnectProviderResponse extends S.Class<GetOpenIDConnectProviderResponse>(
  "GetOpenIDConnectProviderResponse",
)(
  {
    Url: S.optional(S.String),
    ClientIDList: S.optional(clientIDListType),
    ThumbprintList: S.optional(thumbprintListType),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Tags: S.optional(tagListType),
  },
  ns,
) {}
export class GetPolicyResponse extends S.Class<GetPolicyResponse>(
  "GetPolicyResponse",
)({ Policy: S.optional(Policy) }, ns) {}
export class GetPolicyVersionResponse extends S.Class<GetPolicyVersionResponse>(
  "GetPolicyVersionResponse",
)({ PolicyVersion: S.optional(PolicyVersion) }, ns) {}
export class GetRoleResponse extends S.Class<GetRoleResponse>(
  "GetRoleResponse",
)({ Role: Role }, ns) {}
export class GetRolePolicyResponse extends S.Class<GetRolePolicyResponse>(
  "GetRolePolicyResponse",
)({ RoleName: S.String, PolicyName: S.String, PolicyDocument: S.String }, ns) {}
export class GetUserResponse extends S.Class<GetUserResponse>(
  "GetUserResponse",
)({ User: User }, ns) {}
export class GetUserPolicyResponse extends S.Class<GetUserPolicyResponse>(
  "GetUserPolicyResponse",
)({ UserName: S.String, PolicyName: S.String, PolicyDocument: S.String }, ns) {}
export class ListAccountAliasesResponse extends S.Class<ListAccountAliasesResponse>(
  "ListAccountAliasesResponse",
)(
  {
    AccountAliases: accountAliasListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class AttachedPolicy extends S.Class<AttachedPolicy>("AttachedPolicy")({
  PolicyName: S.optional(S.String),
  PolicyArn: S.optional(S.String),
}) {}
export const attachedPoliciesListType = S.Array(AttachedPolicy);
export class ListAttachedRolePoliciesResponse extends S.Class<ListAttachedRolePoliciesResponse>(
  "ListAttachedRolePoliciesResponse",
)(
  {
    AttachedPolicies: S.optional(attachedPoliciesListType),
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListAttachedUserPoliciesResponse extends S.Class<ListAttachedUserPoliciesResponse>(
  "ListAttachedUserPoliciesResponse",
)(
  {
    AttachedPolicies: S.optional(attachedPoliciesListType),
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListDelegationRequestsResponse extends S.Class<ListDelegationRequestsResponse>(
  "ListDelegationRequestsResponse",
)(
  {
    DelegationRequests: S.optional(delegationRequestsListType),
    Marker: S.optional(S.String),
    isTruncated: S.optional(S.Boolean),
  },
  ns,
) {}
export class ListGroupPoliciesResponse extends S.Class<ListGroupPoliciesResponse>(
  "ListGroupPoliciesResponse",
)(
  {
    PolicyNames: policyNameListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListGroupsResponse extends S.Class<ListGroupsResponse>(
  "ListGroupsResponse",
)(
  {
    Groups: groupListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListGroupsForUserResponse extends S.Class<ListGroupsForUserResponse>(
  "ListGroupsForUserResponse",
)(
  {
    Groups: groupListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListInstanceProfilesResponse extends S.Class<ListInstanceProfilesResponse>(
  "ListInstanceProfilesResponse",
)(
  {
    InstanceProfiles: instanceProfileListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListInstanceProfilesForRoleResponse extends S.Class<ListInstanceProfilesForRoleResponse>(
  "ListInstanceProfilesForRoleResponse",
)(
  {
    InstanceProfiles: instanceProfileListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListInstanceProfileTagsResponse extends S.Class<ListInstanceProfileTagsResponse>(
  "ListInstanceProfileTagsResponse",
)(
  {
    Tags: tagListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListMFADeviceTagsResponse extends S.Class<ListMFADeviceTagsResponse>(
  "ListMFADeviceTagsResponse",
)(
  {
    Tags: tagListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListOpenIDConnectProvidersResponse extends S.Class<ListOpenIDConnectProvidersResponse>(
  "ListOpenIDConnectProvidersResponse",
)(
  { OpenIDConnectProviderList: S.optional(OpenIDConnectProviderListType) },
  ns,
) {}
export class ListOpenIDConnectProviderTagsResponse extends S.Class<ListOpenIDConnectProviderTagsResponse>(
  "ListOpenIDConnectProviderTagsResponse",
)(
  {
    Tags: tagListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListPoliciesResponse extends S.Class<ListPoliciesResponse>(
  "ListPoliciesResponse",
)(
  {
    Policies: S.optional(policyListType),
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListPolicyTagsResponse extends S.Class<ListPolicyTagsResponse>(
  "ListPolicyTagsResponse",
)(
  {
    Tags: tagListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListPolicyVersionsResponse extends S.Class<ListPolicyVersionsResponse>(
  "ListPolicyVersionsResponse",
)(
  {
    Versions: S.optional(policyDocumentVersionListType),
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListRolePoliciesResponse extends S.Class<ListRolePoliciesResponse>(
  "ListRolePoliciesResponse",
)(
  {
    PolicyNames: policyNameListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListRolesResponse extends S.Class<ListRolesResponse>(
  "ListRolesResponse",
)(
  {
    Roles: roleListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListRoleTagsResponse extends S.Class<ListRoleTagsResponse>(
  "ListRoleTagsResponse",
)(
  {
    Tags: tagListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListSAMLProvidersResponse extends S.Class<ListSAMLProvidersResponse>(
  "ListSAMLProvidersResponse",
)({ SAMLProviderList: S.optional(SAMLProviderListType) }, ns) {}
export class ListSAMLProviderTagsResponse extends S.Class<ListSAMLProviderTagsResponse>(
  "ListSAMLProviderTagsResponse",
)(
  {
    Tags: tagListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListServerCertificateTagsResponse extends S.Class<ListServerCertificateTagsResponse>(
  "ListServerCertificateTagsResponse",
)(
  {
    Tags: tagListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListUserPoliciesResponse extends S.Class<ListUserPoliciesResponse>(
  "ListUserPoliciesResponse",
)(
  {
    PolicyNames: policyNameListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListUsersResponse extends S.Class<ListUsersResponse>(
  "ListUsersResponse",
)(
  {
    Users: userListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListUserTagsResponse extends S.Class<ListUserTagsResponse>(
  "ListUserTagsResponse",
)(
  {
    Tags: tagListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListVirtualMFADevicesResponse extends S.Class<ListVirtualMFADevicesResponse>(
  "ListVirtualMFADevicesResponse",
)(
  {
    VirtualMFADevices: virtualMFADeviceListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ServiceSpecificCredential extends S.Class<ServiceSpecificCredential>(
  "ServiceSpecificCredential",
)({
  CreateDate: S.Date.pipe(T.TimestampFormat("date-time")),
  ExpirationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ServiceName: S.String,
  ServiceUserName: S.optional(S.String),
  ServicePassword: S.optional(S.String),
  ServiceCredentialAlias: S.optional(S.String),
  ServiceCredentialSecret: S.optional(S.String),
  ServiceSpecificCredentialId: S.String,
  UserName: S.String,
  Status: S.String,
}) {}
export class ResetServiceSpecificCredentialResponse extends S.Class<ResetServiceSpecificCredentialResponse>(
  "ResetServiceSpecificCredentialResponse",
)({ ServiceSpecificCredential: S.optional(ServiceSpecificCredential) }, ns) {}
export class SimulateCustomPolicyRequest extends S.Class<SimulateCustomPolicyRequest>(
  "SimulateCustomPolicyRequest",
)(
  {
    PolicyInputList: SimulationPolicyListType,
    PermissionsBoundaryPolicyInputList: S.optional(SimulationPolicyListType),
    ActionNames: ActionNameListType,
    ResourceArns: S.optional(ResourceNameListType),
    ResourcePolicy: S.optional(S.String),
    ResourceOwner: S.optional(S.String),
    CallerArn: S.optional(S.String),
    ContextEntries: S.optional(ContextEntryListType),
    ResourceHandlingOption: S.optional(S.String),
    MaxItems: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateRoleDescriptionResponse extends S.Class<UpdateRoleDescriptionResponse>(
  "UpdateRoleDescriptionResponse",
)({ Role: S.optional(Role) }, ns) {}
export class UpdateSAMLProviderResponse extends S.Class<UpdateSAMLProviderResponse>(
  "UpdateSAMLProviderResponse",
)({ SAMLProviderArn: S.optional(S.String) }, ns) {}
export class ServerCertificateMetadata extends S.Class<ServerCertificateMetadata>(
  "ServerCertificateMetadata",
)({
  Path: S.String,
  ServerCertificateName: S.String,
  ServerCertificateId: S.String,
  Arn: S.String,
  UploadDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Expiration: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class UploadServerCertificateResponse extends S.Class<UploadServerCertificateResponse>(
  "UploadServerCertificateResponse",
)(
  {
    ServerCertificateMetadata: S.optional(ServerCertificateMetadata),
    Tags: S.optional(tagListType),
  },
  ns,
) {}
export class SigningCertificate extends S.Class<SigningCertificate>(
  "SigningCertificate",
)({
  UserName: S.String,
  CertificateId: S.String,
  CertificateBody: S.String,
  Status: S.String,
  UploadDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class UploadSigningCertificateResponse extends S.Class<UploadSigningCertificateResponse>(
  "UploadSigningCertificateResponse",
)({ Certificate: SigningCertificate }, ns) {}
export class SSHPublicKey extends S.Class<SSHPublicKey>("SSHPublicKey")({
  UserName: S.String,
  SSHPublicKeyId: S.String,
  Fingerprint: S.String,
  SSHPublicKeyBody: S.String,
  Status: S.String,
  UploadDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class UploadSSHPublicKeyResponse extends S.Class<UploadSSHPublicKeyResponse>(
  "UploadSSHPublicKeyResponse",
)({ SSHPublicKey: S.optional(SSHPublicKey) }, ns) {}
export const groupNameListType = S.Array(S.String);
export class AccessKey extends S.Class<AccessKey>("AccessKey")({
  UserName: S.String,
  AccessKeyId: S.String,
  Status: S.String,
  SecretAccessKey: S.String,
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class AccessKeyLastUsed extends S.Class<AccessKeyLastUsed>(
  "AccessKeyLastUsed",
)({
  LastUsedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ServiceName: S.String,
  Region: S.String,
}) {}
export class PolicyDetail extends S.Class<PolicyDetail>("PolicyDetail")({
  PolicyName: S.optional(S.String),
  PolicyDocument: S.optional(S.String),
}) {}
export const policyDetailListType = S.Array(PolicyDetail);
export class GroupDetail extends S.Class<GroupDetail>("GroupDetail")({
  Path: S.optional(S.String),
  GroupName: S.optional(S.String),
  GroupId: S.optional(S.String),
  Arn: S.optional(S.String),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  GroupPolicyList: S.optional(policyDetailListType),
  AttachedManagedPolicies: S.optional(attachedPoliciesListType),
}) {}
export const groupDetailListType = S.Array(GroupDetail);
export class RoleDetail extends S.Class<RoleDetail>("RoleDetail")({
  Path: S.optional(S.String),
  RoleName: S.optional(S.String),
  RoleId: S.optional(S.String),
  Arn: S.optional(S.String),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  AssumeRolePolicyDocument: S.optional(S.String),
  InstanceProfileList: S.optional(instanceProfileListType),
  RolePolicyList: S.optional(policyDetailListType),
  AttachedManagedPolicies: S.optional(attachedPoliciesListType),
  PermissionsBoundary: S.optional(AttachedPermissionsBoundary),
  Tags: S.optional(tagListType),
  RoleLastUsed: S.optional(RoleLastUsed),
}) {}
export const roleDetailListType = S.Array(RoleDetail);
export class ManagedPolicyDetail extends S.Class<ManagedPolicyDetail>(
  "ManagedPolicyDetail",
)({
  PolicyName: S.optional(S.String),
  PolicyId: S.optional(S.String),
  Arn: S.optional(S.String),
  Path: S.optional(S.String),
  DefaultVersionId: S.optional(S.String),
  AttachmentCount: S.optional(S.Number),
  PermissionsBoundaryUsageCount: S.optional(S.Number),
  IsAttachable: S.optional(S.Boolean),
  Description: S.optional(S.String),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  PolicyVersionList: S.optional(policyDocumentVersionListType),
}) {}
export const ManagedPolicyDetailListType = S.Array(ManagedPolicyDetail);
export const CertificationMapType = S.Record({
  key: S.String,
  value: S.String,
});
export class AccessDetail extends S.Class<AccessDetail>("AccessDetail")({
  ServiceName: S.String,
  ServiceNamespace: S.String,
  Region: S.optional(S.String),
  EntityPath: S.optional(S.String),
  LastAuthenticatedTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  TotalAuthenticatedEntities: S.optional(S.Number),
}) {}
export const AccessDetails = S.Array(AccessDetail);
export class ErrorDetails extends S.Class<ErrorDetails>("ErrorDetails")({
  Message: S.String,
  Code: S.String,
}) {}
export class SAMLPrivateKey extends S.Class<SAMLPrivateKey>("SAMLPrivateKey")({
  KeyId: S.optional(S.String),
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const privateKeyList = S.Array(SAMLPrivateKey);
export class ServerCertificate extends S.Class<ServerCertificate>(
  "ServerCertificate",
)({
  ServerCertificateMetadata: ServerCertificateMetadata,
  CertificateBody: S.String,
  CertificateChain: S.optional(S.String),
  Tags: S.optional(tagListType),
}) {}
export class AccessKeyMetadata extends S.Class<AccessKeyMetadata>(
  "AccessKeyMetadata",
)({
  UserName: S.optional(S.String),
  AccessKeyId: S.optional(S.String),
  Status: S.optional(S.String),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const accessKeyMetadataListType = S.Array(AccessKeyMetadata);
export class PolicyGroup extends S.Class<PolicyGroup>("PolicyGroup")({
  GroupName: S.optional(S.String),
  GroupId: S.optional(S.String),
}) {}
export const PolicyGroupListType = S.Array(PolicyGroup);
export class PolicyUser extends S.Class<PolicyUser>("PolicyUser")({
  UserName: S.optional(S.String),
  UserId: S.optional(S.String),
}) {}
export const PolicyUserListType = S.Array(PolicyUser);
export class PolicyRole extends S.Class<PolicyRole>("PolicyRole")({
  RoleName: S.optional(S.String),
  RoleId: S.optional(S.String),
}) {}
export const PolicyRoleListType = S.Array(PolicyRole);
export class MFADevice extends S.Class<MFADevice>("MFADevice")({
  UserName: S.String,
  SerialNumber: S.String,
  EnableDate: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const mfaDeviceListType = S.Array(MFADevice);
export const serverCertificateMetadataListType = S.Array(
  ServerCertificateMetadata,
);
export class ServiceSpecificCredentialMetadata extends S.Class<ServiceSpecificCredentialMetadata>(
  "ServiceSpecificCredentialMetadata",
)({
  UserName: S.String,
  Status: S.String,
  ServiceUserName: S.optional(S.String),
  ServiceCredentialAlias: S.optional(S.String),
  CreateDate: S.Date.pipe(T.TimestampFormat("date-time")),
  ExpirationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ServiceSpecificCredentialId: S.String,
  ServiceName: S.String,
}) {}
export const ServiceSpecificCredentialsListType = S.Array(
  ServiceSpecificCredentialMetadata,
);
export const certificateListType = S.Array(SigningCertificate);
export class SSHPublicKeyMetadata extends S.Class<SSHPublicKeyMetadata>(
  "SSHPublicKeyMetadata",
)({
  UserName: S.String,
  SSHPublicKeyId: S.String,
  Status: S.String,
  UploadDate: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const SSHPublicKeyListType = S.Array(SSHPublicKeyMetadata);
export const ArnListType = S.Array(S.String);
export class CreateAccessKeyResponse extends S.Class<CreateAccessKeyResponse>(
  "CreateAccessKeyResponse",
)({ AccessKey: AccessKey }, ns) {}
export class CreateDelegationRequestRequest extends S.Class<CreateDelegationRequestRequest>(
  "CreateDelegationRequestRequest",
)(
  {
    OwnerAccountId: S.optional(S.String),
    Description: S.String,
    Permissions: DelegationPermission,
    RequestMessage: S.optional(S.String),
    RequestorWorkflowId: S.String,
    RedirectUrl: S.optional(S.String),
    NotificationChannel: S.String,
    SessionDuration: S.Number,
    OnlySendByOwner: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateGroupResponse extends S.Class<CreateGroupResponse>(
  "CreateGroupResponse",
)({ Group: Group }, ns) {}
export class CreateInstanceProfileResponse extends S.Class<CreateInstanceProfileResponse>(
  "CreateInstanceProfileResponse",
)({ InstanceProfile: InstanceProfile }, ns) {}
export class CreateLoginProfileResponse extends S.Class<CreateLoginProfileResponse>(
  "CreateLoginProfileResponse",
)({ LoginProfile: LoginProfile }, ns) {}
export class CreatePolicyResponse extends S.Class<CreatePolicyResponse>(
  "CreatePolicyResponse",
)({ Policy: S.optional(Policy) }, ns) {}
export class CreatePolicyVersionResponse extends S.Class<CreatePolicyVersionResponse>(
  "CreatePolicyVersionResponse",
)({ PolicyVersion: S.optional(PolicyVersion) }, ns) {}
export class CreateServiceSpecificCredentialResponse extends S.Class<CreateServiceSpecificCredentialResponse>(
  "CreateServiceSpecificCredentialResponse",
)({ ServiceSpecificCredential: S.optional(ServiceSpecificCredential) }, ns) {}
export class CreateUserResponse extends S.Class<CreateUserResponse>(
  "CreateUserResponse",
)({ User: S.optional(User) }, ns) {}
export class CreateVirtualMFADeviceResponse extends S.Class<CreateVirtualMFADeviceResponse>(
  "CreateVirtualMFADeviceResponse",
)({ VirtualMFADevice: VirtualMFADevice }, ns) {}
export class GetAccessKeyLastUsedResponse extends S.Class<GetAccessKeyLastUsedResponse>(
  "GetAccessKeyLastUsedResponse",
)(
  {
    UserName: S.optional(S.String),
    AccessKeyLastUsed: S.optional(AccessKeyLastUsed),
  },
  ns,
) {}
export class GetDelegationRequestResponse extends S.Class<GetDelegationRequestResponse>(
  "GetDelegationRequestResponse",
)(
  {
    DelegationRequest: S.optional(DelegationRequest),
    PermissionCheckStatus: S.optional(S.String),
    PermissionCheckResult: S.optional(S.String),
  },
  ns,
) {}
export class GetInstanceProfileResponse extends S.Class<GetInstanceProfileResponse>(
  "GetInstanceProfileResponse",
)({ InstanceProfile: InstanceProfile }, ns) {}
export class GetMFADeviceResponse extends S.Class<GetMFADeviceResponse>(
  "GetMFADeviceResponse",
)(
  {
    UserName: S.optional(S.String),
    SerialNumber: S.String,
    EnableDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Certifications: S.optional(CertificationMapType),
  },
  ns,
) {}
export class GetOrganizationsAccessReportResponse extends S.Class<GetOrganizationsAccessReportResponse>(
  "GetOrganizationsAccessReportResponse",
)(
  {
    JobStatus: S.String,
    JobCreationDate: S.Date.pipe(T.TimestampFormat("date-time")),
    JobCompletionDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    NumberOfServicesAccessible: S.optional(S.Number),
    NumberOfServicesNotAccessed: S.optional(S.Number),
    AccessDetails: S.optional(AccessDetails),
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
    ErrorDetails: S.optional(ErrorDetails),
  },
  ns,
) {}
export class GetSAMLProviderResponse extends S.Class<GetSAMLProviderResponse>(
  "GetSAMLProviderResponse",
)(
  {
    SAMLProviderUUID: S.optional(S.String),
    SAMLMetadataDocument: S.optional(S.String),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ValidUntil: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Tags: S.optional(tagListType),
    AssertionEncryptionMode: S.optional(S.String),
    PrivateKeyList: S.optional(privateKeyList),
  },
  ns,
) {}
export class GetServerCertificateResponse extends S.Class<GetServerCertificateResponse>(
  "GetServerCertificateResponse",
)({ ServerCertificate: ServerCertificate }, ns) {}
export class GetSSHPublicKeyResponse extends S.Class<GetSSHPublicKeyResponse>(
  "GetSSHPublicKeyResponse",
)({ SSHPublicKey: S.optional(SSHPublicKey) }, ns) {}
export class ListAccessKeysResponse extends S.Class<ListAccessKeysResponse>(
  "ListAccessKeysResponse",
)(
  {
    AccessKeyMetadata: accessKeyMetadataListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListAttachedGroupPoliciesResponse extends S.Class<ListAttachedGroupPoliciesResponse>(
  "ListAttachedGroupPoliciesResponse",
)(
  {
    AttachedPolicies: S.optional(attachedPoliciesListType),
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListEntitiesForPolicyResponse extends S.Class<ListEntitiesForPolicyResponse>(
  "ListEntitiesForPolicyResponse",
)(
  {
    PolicyGroups: S.optional(PolicyGroupListType),
    PolicyUsers: S.optional(PolicyUserListType),
    PolicyRoles: S.optional(PolicyRoleListType),
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListMFADevicesResponse extends S.Class<ListMFADevicesResponse>(
  "ListMFADevicesResponse",
)(
  {
    MFADevices: mfaDeviceListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListServerCertificatesResponse extends S.Class<ListServerCertificatesResponse>(
  "ListServerCertificatesResponse",
)(
  {
    ServerCertificateMetadataList: serverCertificateMetadataListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListServiceSpecificCredentialsResponse extends S.Class<ListServiceSpecificCredentialsResponse>(
  "ListServiceSpecificCredentialsResponse",
)(
  {
    ServiceSpecificCredentials: S.optional(ServiceSpecificCredentialsListType),
    Marker: S.optional(S.String),
    IsTruncated: S.optional(S.Boolean),
  },
  ns,
) {}
export class ListSigningCertificatesResponse extends S.Class<ListSigningCertificatesResponse>(
  "ListSigningCertificatesResponse",
)(
  {
    Certificates: certificateListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListSSHPublicKeysResponse extends S.Class<ListSSHPublicKeysResponse>(
  "ListSSHPublicKeysResponse",
)(
  {
    SSHPublicKeys: S.optional(SSHPublicKeyListType),
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class TrackedActionLastAccessed extends S.Class<TrackedActionLastAccessed>(
  "TrackedActionLastAccessed",
)({
  ActionName: S.optional(S.String),
  LastAccessedEntity: S.optional(S.String),
  LastAccessedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  LastAccessedRegion: S.optional(S.String),
}) {}
export const TrackedActionsLastAccessed = S.Array(TrackedActionLastAccessed);
export class EntityInfo extends S.Class<EntityInfo>("EntityInfo")({
  Arn: S.String,
  Name: S.String,
  Type: S.String,
  Id: S.String,
  Path: S.optional(S.String),
}) {}
export class RoleUsageType extends S.Class<RoleUsageType>("RoleUsageType")({
  Region: S.optional(S.String),
  Resources: S.optional(ArnListType),
}) {}
export const RoleUsageListType = S.Array(RoleUsageType);
export class PolicyGrantingServiceAccess extends S.Class<PolicyGrantingServiceAccess>(
  "PolicyGrantingServiceAccess",
)({
  PolicyName: S.String,
  PolicyType: S.String,
  PolicyArn: S.optional(S.String),
  EntityType: S.optional(S.String),
  EntityName: S.optional(S.String),
}) {}
export const policyGrantingServiceAccessListType = S.Array(
  PolicyGrantingServiceAccess,
);
export class OrganizationsDecisionDetail extends S.Class<OrganizationsDecisionDetail>(
  "OrganizationsDecisionDetail",
)({ AllowedByOrganizations: S.optional(S.Boolean) }) {}
export class PermissionsBoundaryDecisionDetail extends S.Class<PermissionsBoundaryDecisionDetail>(
  "PermissionsBoundaryDecisionDetail",
)({ AllowedByPermissionsBoundary: S.optional(S.Boolean) }) {}
export const EvalDecisionDetailsType = S.Record({
  key: S.String,
  value: S.String,
});
export class Position extends S.Class<Position>("Position")({
  Line: S.optional(S.Number),
  Column: S.optional(S.Number),
}) {}
export class Statement extends S.Class<Statement>("Statement")({
  SourcePolicyId: S.optional(S.String),
  SourcePolicyType: S.optional(S.String),
  StartPosition: S.optional(Position),
  EndPosition: S.optional(Position),
}) {}
export const StatementListType = S.Array(Statement);
export class ResourceSpecificResult extends S.Class<ResourceSpecificResult>(
  "ResourceSpecificResult",
)({
  EvalResourceName: S.String,
  EvalResourceDecision: S.String,
  MatchedStatements: S.optional(StatementListType),
  MissingContextValues: S.optional(ContextKeyNamesResultListType),
  EvalDecisionDetails: S.optional(EvalDecisionDetailsType),
  PermissionsBoundaryDecisionDetail: S.optional(
    PermissionsBoundaryDecisionDetail,
  ),
}) {}
export const ResourceSpecificResultListType = S.Array(ResourceSpecificResult);
export class UserDetail extends S.Class<UserDetail>("UserDetail")({
  Path: S.optional(S.String),
  UserName: S.optional(S.String),
  UserId: S.optional(S.String),
  Arn: S.optional(S.String),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UserPolicyList: S.optional(policyDetailListType),
  GroupList: S.optional(groupNameListType),
  AttachedManagedPolicies: S.optional(attachedPoliciesListType),
  PermissionsBoundary: S.optional(AttachedPermissionsBoundary),
  Tags: S.optional(tagListType),
}) {}
export const userDetailListType = S.Array(UserDetail);
export class ServiceLastAccessed extends S.Class<ServiceLastAccessed>(
  "ServiceLastAccessed",
)({
  ServiceName: S.String,
  LastAuthenticated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ServiceNamespace: S.String,
  LastAuthenticatedEntity: S.optional(S.String),
  LastAuthenticatedRegion: S.optional(S.String),
  TotalAuthenticatedEntities: S.optional(S.Number),
  TrackedActionsLastAccessed: S.optional(TrackedActionsLastAccessed),
}) {}
export const ServicesLastAccessed = S.Array(ServiceLastAccessed);
export class EntityDetails extends S.Class<EntityDetails>("EntityDetails")({
  EntityInfo: EntityInfo,
  LastAuthenticated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const entityDetailsListType = S.Array(EntityDetails);
export class DeletionTaskFailureReasonType extends S.Class<DeletionTaskFailureReasonType>(
  "DeletionTaskFailureReasonType",
)({
  Reason: S.optional(S.String),
  RoleUsageList: S.optional(RoleUsageListType),
}) {}
export class ListPoliciesGrantingServiceAccessEntry extends S.Class<ListPoliciesGrantingServiceAccessEntry>(
  "ListPoliciesGrantingServiceAccessEntry",
)({
  ServiceNamespace: S.optional(S.String),
  Policies: S.optional(policyGrantingServiceAccessListType),
}) {}
export const listPolicyGrantingServiceAccessResponseListType = S.Array(
  ListPoliciesGrantingServiceAccessEntry,
);
export class CreateDelegationRequestResponse extends S.Class<CreateDelegationRequestResponse>(
  "CreateDelegationRequestResponse",
)(
  {
    ConsoleDeepLink: S.optional(S.String),
    DelegationRequestId: S.optional(S.String),
  },
  ns,
) {}
export class CreateRoleResponse extends S.Class<CreateRoleResponse>(
  "CreateRoleResponse",
)({ Role: Role }, ns) {}
export class GetAccountAuthorizationDetailsResponse extends S.Class<GetAccountAuthorizationDetailsResponse>(
  "GetAccountAuthorizationDetailsResponse",
)(
  {
    UserDetailList: S.optional(userDetailListType),
    GroupDetailList: S.optional(groupDetailListType),
    RoleDetailList: S.optional(roleDetailListType),
    Policies: S.optional(ManagedPolicyDetailListType),
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class GetServiceLastAccessedDetailsResponse extends S.Class<GetServiceLastAccessedDetailsResponse>(
  "GetServiceLastAccessedDetailsResponse",
)(
  {
    JobStatus: S.String,
    JobType: S.optional(S.String),
    JobCreationDate: S.Date.pipe(T.TimestampFormat("date-time")),
    ServicesLastAccessed: ServicesLastAccessed,
    JobCompletionDate: S.Date.pipe(T.TimestampFormat("date-time")),
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
    Error: S.optional(ErrorDetails),
  },
  ns,
) {}
export class GetServiceLastAccessedDetailsWithEntitiesResponse extends S.Class<GetServiceLastAccessedDetailsWithEntitiesResponse>(
  "GetServiceLastAccessedDetailsWithEntitiesResponse",
)(
  {
    JobStatus: S.String,
    JobCreationDate: S.Date.pipe(T.TimestampFormat("date-time")),
    JobCompletionDate: S.Date.pipe(T.TimestampFormat("date-time")),
    EntityDetailsList: entityDetailsListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
    Error: S.optional(ErrorDetails),
  },
  ns,
) {}
export class GetServiceLinkedRoleDeletionStatusResponse extends S.Class<GetServiceLinkedRoleDeletionStatusResponse>(
  "GetServiceLinkedRoleDeletionStatusResponse",
)(
  { Status: S.String, Reason: S.optional(DeletionTaskFailureReasonType) },
  ns,
) {}
export class ListPoliciesGrantingServiceAccessResponse extends S.Class<ListPoliciesGrantingServiceAccessResponse>(
  "ListPoliciesGrantingServiceAccessResponse",
)(
  {
    PoliciesGrantingServiceAccess:
      listPolicyGrantingServiceAccessResponseListType,
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class EvaluationResult extends S.Class<EvaluationResult>(
  "EvaluationResult",
)({
  EvalActionName: S.String,
  EvalResourceName: S.optional(S.String),
  EvalDecision: S.String,
  MatchedStatements: S.optional(StatementListType),
  MissingContextValues: S.optional(ContextKeyNamesResultListType),
  OrganizationsDecisionDetail: S.optional(OrganizationsDecisionDetail),
  PermissionsBoundaryDecisionDetail: S.optional(
    PermissionsBoundaryDecisionDetail,
  ),
  EvalDecisionDetails: S.optional(EvalDecisionDetailsType),
  ResourceSpecificResults: S.optional(ResourceSpecificResultListType),
}) {}
export const EvaluationResultsListType = S.Array(EvaluationResult);
export class SimulatePolicyResponse extends S.Class<SimulatePolicyResponse>(
  "SimulatePolicyResponse",
)(
  {
    EvaluationResults: S.optional(EvaluationResultsListType),
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
  },
  ns,
) {}

//# Errors
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  {},
  T.AwsQueryError({ code: "ConcurrentModification", httpResponseCode: 409 }),
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
  T.AwsQueryError({ code: "LimitExceeded", httpResponseCode: 409 }),
) {}
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  {},
  T.AwsQueryError({ code: "InvalidInput", httpResponseCode: 400 }),
) {}
export class NoSuchEntityException extends S.TaggedError<NoSuchEntityException>()(
  "NoSuchEntityException",
  {},
  T.AwsQueryError({ code: "NoSuchEntity", httpResponseCode: 404 }),
) {}
export class PolicyNotAttachableException extends S.TaggedError<PolicyNotAttachableException>()(
  "PolicyNotAttachableException",
  {},
  T.AwsQueryError({ code: "PolicyNotAttachable", httpResponseCode: 400 }),
) {}
export class ServiceFailureException extends S.TaggedError<ServiceFailureException>()(
  "ServiceFailureException",
  {},
  T.AwsQueryError({ code: "ServiceFailure", httpResponseCode: 500 }),
) {}
export class EntityAlreadyExistsException extends S.TaggedError<EntityAlreadyExistsException>()(
  "EntityAlreadyExistsException",
  {},
  T.AwsQueryError({ code: "EntityAlreadyExists", httpResponseCode: 409 }),
) {}
export class EntityTemporarilyUnmodifiableException extends S.TaggedError<EntityTemporarilyUnmodifiableException>()(
  "EntityTemporarilyUnmodifiableException",
  {},
  T.AwsQueryError({
    code: "EntityTemporarilyUnmodifiable",
    httpResponseCode: 409,
  }),
) {}
export class DeleteConflictException extends S.TaggedError<DeleteConflictException>()(
  "DeleteConflictException",
  {},
  T.AwsQueryError({ code: "DeleteConflict", httpResponseCode: 409 }),
) {}
export class UnmodifiableEntityException extends S.TaggedError<UnmodifiableEntityException>()(
  "UnmodifiableEntityException",
  {},
  T.AwsQueryError({ code: "UnmodifiableEntity", httpResponseCode: 400 }),
) {}
export class AccountNotManagementOrDelegatedAdministratorException extends S.TaggedError<AccountNotManagementOrDelegatedAdministratorException>()(
  "AccountNotManagementOrDelegatedAdministratorException",
  {},
) {}
export class FeatureDisabledException extends S.TaggedError<FeatureDisabledException>()(
  "FeatureDisabledException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "FeatureDisabled", httpResponseCode: 404 }),
) {}
export class CallerIsNotManagementAccountException extends S.TaggedError<CallerIsNotManagementAccountException>()(
  "CallerIsNotManagementAccountException",
  {},
) {}
export class OrganizationNotFoundException extends S.TaggedError<OrganizationNotFoundException>()(
  "OrganizationNotFoundException",
  {},
) {}
export class OrganizationNotInAllFeaturesModeException extends S.TaggedError<OrganizationNotInAllFeaturesModeException>()(
  "OrganizationNotInAllFeaturesModeException",
  {},
) {}
export class MalformedPolicyDocumentException extends S.TaggedError<MalformedPolicyDocumentException>()(
  "MalformedPolicyDocumentException",
  {},
  T.AwsQueryError({ code: "MalformedPolicyDocument", httpResponseCode: 400 }),
) {}
export class InvalidAuthenticationCodeException extends S.TaggedError<InvalidAuthenticationCodeException>()(
  "InvalidAuthenticationCodeException",
  {},
  T.AwsQueryError({ code: "InvalidAuthenticationCode", httpResponseCode: 403 }),
) {}
export class ServiceAccessNotEnabledException extends S.TaggedError<ServiceAccessNotEnabledException>()(
  "ServiceAccessNotEnabledException",
  {},
) {}
export class FeatureEnabledException extends S.TaggedError<FeatureEnabledException>()(
  "FeatureEnabledException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "FeatureEnabled", httpResponseCode: 409 }),
) {}
export class CredentialReportExpiredException extends S.TaggedError<CredentialReportExpiredException>()(
  "CredentialReportExpiredException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ReportExpired", httpResponseCode: 410 }),
) {}
export class PasswordPolicyViolationException extends S.TaggedError<PasswordPolicyViolationException>()(
  "PasswordPolicyViolationException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "PasswordPolicyViolation", httpResponseCode: 400 }),
) {}
export class InvalidUserTypeException extends S.TaggedError<InvalidUserTypeException>()(
  "InvalidUserTypeException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidUserType", httpResponseCode: 400 }),
) {}
export class OpenIdIdpCommunicationErrorException extends S.TaggedError<OpenIdIdpCommunicationErrorException>()(
  "OpenIdIdpCommunicationErrorException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "OpenIdIdpCommunicationError",
    httpResponseCode: 400,
  }),
) {}
export class ReportGenerationLimitExceededException extends S.TaggedError<ReportGenerationLimitExceededException>()(
  "ReportGenerationLimitExceededException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReportGenerationLimitExceeded",
    httpResponseCode: 409,
  }),
) {}
export class CredentialReportNotPresentException extends S.TaggedError<CredentialReportNotPresentException>()(
  "CredentialReportNotPresentException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ReportNotPresent", httpResponseCode: 410 }),
) {}
export class ServiceNotSupportedException extends S.TaggedError<ServiceNotSupportedException>()(
  "ServiceNotSupportedException",
  {},
  T.AwsQueryError({ code: "NotSupportedService", httpResponseCode: 404 }),
) {}
export class PolicyEvaluationException extends S.TaggedError<PolicyEvaluationException>()(
  "PolicyEvaluationException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "PolicyEvaluation", httpResponseCode: 500 }),
) {}
export class KeyPairMismatchException extends S.TaggedError<KeyPairMismatchException>()(
  "KeyPairMismatchException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KeyPairMismatch", httpResponseCode: 400 }),
) {}
export class DuplicateCertificateException extends S.TaggedError<DuplicateCertificateException>()(
  "DuplicateCertificateException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicateCertificate", httpResponseCode: 409 }),
) {}
export class DuplicateSSHPublicKeyException extends S.TaggedError<DuplicateSSHPublicKeyException>()(
  "DuplicateSSHPublicKeyException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicateSSHPublicKey", httpResponseCode: 400 }),
) {}
export class CredentialReportNotReadyException extends S.TaggedError<CredentialReportNotReadyException>()(
  "CredentialReportNotReadyException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ReportInProgress", httpResponseCode: 404 }),
) {}
export class UnrecognizedPublicKeyEncodingException extends S.TaggedError<UnrecognizedPublicKeyEncodingException>()(
  "UnrecognizedPublicKeyEncodingException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "UnrecognizedPublicKeyEncoding",
    httpResponseCode: 400,
  }),
) {}
export class MalformedCertificateException extends S.TaggedError<MalformedCertificateException>()(
  "MalformedCertificateException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "MalformedCertificate", httpResponseCode: 400 }),
) {}
export class InvalidCertificateException extends S.TaggedError<InvalidCertificateException>()(
  "InvalidCertificateException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidCertificate", httpResponseCode: 400 }),
) {}
export class InvalidPublicKeyException extends S.TaggedError<InvalidPublicKeyException>()(
  "InvalidPublicKeyException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidPublicKey", httpResponseCode: 400 }),
) {}

//# Operations
/**
 * Attaches the specified managed policy to the specified user.
 *
 * You use this operation to attach a *managed* policy to a user. To
 * embed an inline policy in a user, use
 * `PutUserPolicy`
 * .
 *
 * As a best practice, you can validate your IAM policies.
 * To learn more, see Validating IAM policies
 * in the *IAM User Guide*.
 *
 * For more information about policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 */
export const attachUserPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachUserPolicyRequest,
  output: AttachUserPolicyResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    PolicyNotAttachableException,
    ServiceFailureException,
  ],
}));
/**
 * Creates an alias for your Amazon Web Services account. For information about using an Amazon Web Services account
 * alias, see Creating, deleting, and
 * listing an Amazon Web Services account alias in the Amazon Web Services Sign-In User
 * Guide.
 */
export const createAccountAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccountAliasRequest,
  output: CreateAccountAliasResponse,
  errors: [
    ConcurrentModificationException,
    EntityAlreadyExistsException,
    LimitExceededException,
    ServiceFailureException,
  ],
}));
/**
 * Deactivates the specified MFA device and removes it from association with the user
 * name for which it was originally enabled.
 *
 * For more information about creating and working with virtual MFA devices, see Enabling a virtual
 * multi-factor authentication (MFA) device in the
 * *IAM User Guide*.
 */
export const deactivateMFADevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeactivateMFADeviceRequest,
  output: DeactivateMFADeviceResponse,
  errors: [
    ConcurrentModificationException,
    EntityTemporarilyUnmodifiableException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes the access key pair associated with the specified IAM user.
 *
 * If you do not specify a user name, IAM determines the user name implicitly based on
 * the Amazon Web Services access key ID signing the request. This operation works for access keys under
 * the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root
 * user credentials even if the Amazon Web Services account has no associated users.
 */
export const deleteAccessKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessKeyRequest,
  output: DeleteAccessKeyResponse,
  errors: [
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes the specified Amazon Web Services account alias. For information about using an Amazon Web Services
 * account alias, see Creating, deleting, and
 * listing an Amazon Web Services account alias in the Amazon Web Services Sign-In User
 * Guide.
 */
export const deleteAccountAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccountAliasRequest,
  output: DeleteAccountAliasResponse,
  errors: [
    ConcurrentModificationException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes the password policy for the Amazon Web Services account. There are no parameters.
 */
export const deleteAccountPasswordPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAccountPasswordPolicyRequest,
    output: DeleteAccountPasswordPolicyResponse,
    errors: [
      LimitExceededException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Deletes the specified inline policy that is embedded in the specified IAM
 * group.
 *
 * A group can also have managed policies attached to it. To detach a managed policy from
 * a group, use DetachGroupPolicy.
 * For more information about policies, refer to Managed policies and inline
 * policies in the *IAM User Guide*.
 */
export const deleteGroupPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGroupPolicyRequest,
  output: DeleteGroupPolicyResponse,
  errors: [
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes the specified instance profile. The instance profile must not have an
 * associated role.
 *
 * Make sure that you do not have any Amazon EC2 instances running with the instance
 * profile you are about to delete. Deleting a role or instance profile that is
 * associated with a running instance will break any applications running on the
 * instance.
 *
 * For more information about instance profiles, see Using
 * instance profiles in the *IAM User Guide*.
 */
export const deleteInstanceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteInstanceProfileRequest,
    output: DeleteInstanceProfileResponse,
    errors: [
      DeleteConflictException,
      LimitExceededException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Deletes the password for the specified IAM user or root user, For more information, see
 * Managing
 * passwords for IAM users.
 *
 * You can use the CLI, the Amazon Web Services API, or the **Users**
 * page in the IAM console to delete a password for any IAM user. You can use ChangePassword to update, but not delete, your own password in the
 * **My Security Credentials** page in the
 * Amazon Web Services Management Console.
 *
 * Deleting a user's password does not prevent a user from accessing Amazon Web Services through
 * the command line interface or the API. To prevent all user access, you must also
 * either make any access keys inactive or delete them. For more information about
 * making keys inactive or deleting them, see UpdateAccessKey
 * and DeleteAccessKey.
 */
export const deleteLoginProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLoginProfileRequest,
  output: DeleteLoginProfileResponse,
  errors: [
    EntityTemporarilyUnmodifiableException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes an OpenID Connect identity provider (IdP) resource object in IAM.
 *
 * Deleting an IAM OIDC provider resource does not update any roles that reference the
 * provider as a principal in their trust policies. Any attempt to assume a role that
 * references a deleted provider fails.
 *
 * This operation is idempotent; it does not fail or return an error if you call the
 * operation for a provider that does not exist.
 */
export const deleteOpenIDConnectProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteOpenIDConnectProviderRequest,
    output: DeleteOpenIDConnectProviderResponse,
    errors: [
      InvalidInputException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Deletes the specified managed policy.
 *
 * Before you can delete a managed policy, you must first detach the policy from all
 * users, groups, and roles that it is attached to. In addition, you must delete all the
 * policy's versions. The following steps describe the process for deleting a managed
 * policy:
 *
 * - Detach the policy from all users, groups, and roles that the policy is
 * attached to, using DetachUserPolicy, DetachGroupPolicy, or DetachRolePolicy. To list all the users, groups, and roles that a
 * policy is attached to, use ListEntitiesForPolicy.
 *
 * - Delete all versions of the policy using DeletePolicyVersion. To list the policy's versions, use ListPolicyVersions. You cannot use DeletePolicyVersion to delete the version that is marked as the
 * default version. You delete the policy's default version in the next step of the
 * process.
 *
 * - Delete the policy (this automatically deletes the policy's default version)
 * using this operation.
 *
 * For information about managed policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 */
export const deletePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePolicyRequest,
  output: DeletePolicyResponse,
  errors: [
    DeleteConflictException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes the specified version from the specified managed policy.
 *
 * You cannot delete the default version from a policy using this operation. To delete
 * the default version from a policy, use DeletePolicy. To find
 * out which version of a policy is marked as the default version, use ListPolicyVersions.
 *
 * For information about versions for managed policies, see Versioning for managed
 * policies in the *IAM User Guide*.
 */
export const deletePolicyVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePolicyVersionRequest,
  output: DeletePolicyVersionResponse,
  errors: [
    DeleteConflictException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes the specified role. Unlike the Amazon Web Services Management Console, when you delete a role
 * programmatically, you must delete the items attached to the role manually, or the
 * deletion fails. For more information, see Deleting an IAM role. Before attempting to delete a role, remove the
 * following attached items:
 *
 * - Inline policies (DeleteRolePolicy)
 *
 * - Attached managed policies (DetachRolePolicy)
 *
 * - Instance profile (RemoveRoleFromInstanceProfile)
 *
 * - Optional – Delete instance profile after detaching from role for
 * resource clean up (DeleteInstanceProfile)
 *
 * Make sure that you do not have any Amazon EC2 instances running with the role you are
 * about to delete. Deleting a role or instance profile that is associated with a
 * running instance will break any applications running on the instance.
 */
export const deleteRole = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRoleRequest,
  output: DeleteRoleResponse,
  errors: [
    ConcurrentModificationException,
    DeleteConflictException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
    UnmodifiableEntityException,
  ],
}));
/**
 * Deletes the permissions boundary for the specified IAM role.
 *
 * You cannot set the boundary for a service-linked role.
 *
 * Deleting the permissions boundary for a role might increase its permissions. For
 * example, it might allow anyone who assumes the role to perform all the actions
 * granted in its permissions policies.
 */
export const deleteRolePermissionsBoundary =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteRolePermissionsBoundaryRequest,
    output: DeleteRolePermissionsBoundaryResponse,
    errors: [
      NoSuchEntityException,
      ServiceFailureException,
      UnmodifiableEntityException,
    ],
  }));
/**
 * Deletes the specified inline policy that is embedded in the specified IAM
 * role.
 *
 * A role can also have managed policies attached to it. To detach a managed policy from
 * a role, use DetachRolePolicy.
 * For more information about policies, refer to Managed policies and inline
 * policies in the *IAM User Guide*.
 */
export const deleteRolePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRolePolicyRequest,
  output: DeleteRolePolicyResponse,
  errors: [
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
    UnmodifiableEntityException,
  ],
}));
/**
 * Deletes a SAML provider resource in IAM.
 *
 * Deleting the provider resource from IAM does not update any roles that reference the
 * SAML provider resource's ARN as a principal in their trust policies. Any attempt to
 * assume a role that references a non-existent provider resource ARN fails.
 *
 * This operation requires Signature Version 4.
 */
export const deleteSAMLProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSAMLProviderRequest,
  output: DeleteSAMLProviderResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes the specified server certificate.
 *
 * For more information about working with server certificates, see Working
 * with server certificates in the *IAM User Guide*. This
 * topic also includes a list of Amazon Web Services services that can use the server certificates that
 * you manage with IAM.
 *
 * If you are using a server certificate with Elastic Load Balancing, deleting the
 * certificate could have implications for your application. If Elastic Load Balancing
 * doesn't detect the deletion of bound certificates, it may continue to use the
 * certificates. This could cause Elastic Load Balancing to stop accepting traffic. We
 * recommend that you remove the reference to the certificate from Elastic Load
 * Balancing before using this command to delete the certificate. For more information,
 * see DeleteLoadBalancerListeners in the Elastic Load Balancing API
 * Reference.
 */
export const deleteServerCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteServerCertificateRequest,
    output: DeleteServerCertificateResponse,
    errors: [
      DeleteConflictException,
      LimitExceededException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Deletes the specified service-specific credential.
 */
export const deleteServiceSpecificCredential =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteServiceSpecificCredentialRequest,
    output: DeleteServiceSpecificCredentialResponse,
    errors: [NoSuchEntityException],
  }));
/**
 * Deletes a signing certificate associated with the specified IAM user.
 *
 * If you do not specify a user name, IAM determines the user name implicitly based on
 * the Amazon Web Services access key ID signing the request. This operation works for access keys under
 * the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root
 * user credentials even if the Amazon Web Services account has no associated IAM users.
 */
export const deleteSigningCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSigningCertificateRequest,
    output: DeleteSigningCertificateResponse,
    errors: [
      ConcurrentModificationException,
      LimitExceededException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Deletes the specified SSH public key.
 *
 * The SSH public key deleted by this operation is used only for authenticating the
 * associated IAM user to an CodeCommit repository. For more information about using SSH keys
 * to authenticate to an CodeCommit repository, see Set up CodeCommit for
 * SSH connections in the *CodeCommit User Guide*.
 */
export const deleteSSHPublicKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSSHPublicKeyRequest,
  output: DeleteSSHPublicKeyResponse,
  errors: [NoSuchEntityException],
}));
/**
 * Deletes the specified IAM user. Unlike the Amazon Web Services Management Console, when you delete a user
 * programmatically, you must delete the items attached to the user manually, or the
 * deletion fails. For more information, see Deleting an IAM
 * user. Before attempting to delete a user, remove the following items:
 *
 * - Password (DeleteLoginProfile)
 *
 * - Access keys (DeleteAccessKey)
 *
 * - Signing certificate (DeleteSigningCertificate)
 *
 * - SSH public key (DeleteSSHPublicKey)
 *
 * - Git credentials (DeleteServiceSpecificCredential)
 *
 * - Multi-factor authentication (MFA) device (DeactivateMFADevice, DeleteVirtualMFADevice)
 *
 * - Inline policies (DeleteUserPolicy)
 *
 * - Attached managed policies (DetachUserPolicy)
 *
 * - Group memberships (RemoveUserFromGroup)
 */
export const deleteUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserRequest,
  output: DeleteUserResponse,
  errors: [
    ConcurrentModificationException,
    DeleteConflictException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes the permissions boundary for the specified IAM user.
 *
 * Deleting the permissions boundary for a user might increase its permissions by
 * allowing the user to perform all the actions granted in its permissions policies.
 */
export const deleteUserPermissionsBoundary =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteUserPermissionsBoundaryRequest,
    output: DeleteUserPermissionsBoundaryResponse,
    errors: [NoSuchEntityException, ServiceFailureException],
  }));
/**
 * Deletes the specified inline policy that is embedded in the specified IAM
 * user.
 *
 * A user can also have managed policies attached to it. To detach a managed policy from
 * a user, use DetachUserPolicy.
 * For more information about policies, refer to Managed policies and inline
 * policies in the *IAM User Guide*.
 */
export const deleteUserPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserPolicyRequest,
  output: DeleteUserPolicyResponse,
  errors: [
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Deletes a virtual MFA device.
 *
 * You must deactivate a user's virtual MFA device before you can delete it. For
 * information about deactivating MFA devices, see DeactivateMFADevice.
 */
export const deleteVirtualMFADevice = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteVirtualMFADeviceRequest,
    output: DeleteVirtualMFADeviceResponse,
    errors: [
      ConcurrentModificationException,
      DeleteConflictException,
      LimitExceededException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Removes the specified managed policy from the specified IAM group.
 *
 * A group can also have inline policies embedded with it. To delete an inline policy,
 * use DeleteGroupPolicy. For information about policies, see Managed
 * policies and inline policies in the
 * *IAM User Guide*.
 */
export const detachGroupPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachGroupPolicyRequest,
  output: DetachGroupPolicyResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Removes the specified managed policy from the specified role.
 *
 * A role can also have inline policies embedded with it. To delete an inline policy, use
 * DeleteRolePolicy. For information about policies, see Managed
 * policies and inline policies in the
 * *IAM User Guide*.
 */
export const detachRolePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachRolePolicyRequest,
  output: DetachRolePolicyResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
    UnmodifiableEntityException,
  ],
}));
/**
 * Removes the specified managed policy from the specified user.
 *
 * A user can also have inline policies embedded with it. To delete an inline policy, use
 * DeleteUserPolicy. For information about policies, see Managed
 * policies and inline policies in the
 * *IAM User Guide*.
 */
export const detachUserPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachUserPolicyRequest,
  output: DetachUserPolicyResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Disables the outbound identity federation feature for your Amazon Web Services account. When disabled, IAM principals in the account cannot
 * use the `GetWebIdentityToken` API to obtain JSON Web Tokens (JWTs) for authentication with external services. This operation
 * does not affect tokens that were issued before the feature was disabled.
 */
export const disableOutboundWebIdentityFederation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisableOutboundWebIdentityFederationRequest,
    output: DisableOutboundWebIdentityFederationResponse,
    errors: [FeatureDisabledException],
  }));
/**
 * Generates a credential report for the Amazon Web Services account. For more information about the
 * credential report, see Getting credential reports in
 * the *IAM User Guide*.
 */
export const generateCredentialReport = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GenerateCredentialReportRequest,
    output: GenerateCredentialReportResponse,
    errors: [LimitExceededException, ServiceFailureException],
  }),
);
/**
 * Gets a list of all of the context keys referenced in all the IAM policies that are
 * attached to the specified IAM entity. The entity can be an IAM user, group, or role.
 * If you specify a user, then the request also includes all of the policies attached to
 * groups that the user is a member of.
 *
 * You can optionally include a list of one or more additional policies, specified as
 * strings. If you want to include *only* a list of policies by string,
 * use GetContextKeysForCustomPolicy instead.
 *
 * **Note:** This operation discloses information about the
 * permissions granted to other users. If you do not want users to see other user's
 * permissions, then consider allowing them to use GetContextKeysForCustomPolicy instead.
 *
 * Context keys are variables maintained by Amazon Web Services and its services that provide details
 * about the context of an API query request. Context keys can be evaluated by testing
 * against a value in an IAM policy. Use GetContextKeysForPrincipalPolicy to understand what key names and values
 * you must supply when you call SimulatePrincipalPolicy.
 */
export const getContextKeysForPrincipalPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetContextKeysForPrincipalPolicyRequest,
    output: GetContextKeysForPolicyResponse,
    errors: [InvalidInputException, NoSuchEntityException],
  }));
/**
 * Retrieves the configuration information for the outbound identity federation feature in your Amazon Web Services account. The response includes the unique issuer URL for your
 * Amazon Web Services account and the current enabled/disabled status of the feature. Use this operation to obtain the issuer URL that you need to configure trust relationships with external services.
 */
export const getOutboundWebIdentityFederationInfo =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetOutboundWebIdentityFederationInfoRequest,
    output: GetOutboundWebIdentityFederationInfoResponse,
    errors: [FeatureDisabledException],
  }));
/**
 * Adds or updates the policy that is specified as the IAM role's permissions boundary.
 * You can use an Amazon Web Services managed policy or a customer managed policy to set the boundary for
 * a role. Use the boundary to control the maximum permissions that the role can have.
 * Setting a permissions boundary is an advanced feature that can affect the permissions
 * for the role.
 *
 * You cannot set the boundary for a service-linked role.
 *
 * Policies used as permissions boundaries do not provide permissions. You must also
 * attach a permissions policy to the role. To learn how the effective permissions for
 * a role are evaluated, see IAM JSON policy
 * evaluation logic in the IAM User Guide.
 */
export const putRolePermissionsBoundary = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutRolePermissionsBoundaryRequest,
    output: PutRolePermissionsBoundaryResponse,
    errors: [
      InvalidInputException,
      NoSuchEntityException,
      PolicyNotAttachableException,
      ServiceFailureException,
      UnmodifiableEntityException,
    ],
  }),
);
/**
 * Adds or updates an inline policy document that is embedded in the specified IAM
 * role.
 *
 * When you embed an inline policy in a role, the inline policy is used as part of the
 * role's access (permissions) policy. The role's trust policy is created at the same time
 * as the role, using
 * `CreateRole`
 * .
 * You can update a role's trust policy using
 * `UpdateAssumeRolePolicy`
 * . For more information about roles,
 * see IAM
 * roles in the *IAM User Guide*.
 *
 * A role can also have a managed policy attached to it. To attach a managed policy to a
 * role, use
 * `AttachRolePolicy`
 * . To create a new managed policy, use
 *
 * `CreatePolicy`
 * . For information about policies, see Managed
 * policies and inline policies in the
 * *IAM User Guide*.
 *
 * For information about the maximum number of inline policies that you can embed with a
 * role, see IAM and STS quotas in the *IAM User Guide*.
 *
 * Because policy documents can be large, you should use POST rather than GET when
 * calling `PutRolePolicy`. For general information about using the Query
 * API with IAM, see Making query requests in the
 * *IAM User Guide*.
 */
export const putRolePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRolePolicyRequest,
  output: PutRolePolicyResponse,
  errors: [
    LimitExceededException,
    MalformedPolicyDocumentException,
    NoSuchEntityException,
    ServiceFailureException,
    UnmodifiableEntityException,
  ],
}));
/**
 * Adds or updates the policy that is specified as the IAM user's permissions
 * boundary. You can use an Amazon Web Services managed policy or a customer managed policy to set the
 * boundary for a user. Use the boundary to control the maximum permissions that the user
 * can have. Setting a permissions boundary is an advanced feature that can affect the
 * permissions for the user.
 *
 * Policies that are used as permissions boundaries do not provide permissions. You
 * must also attach a permissions policy to the user. To learn how the effective
 * permissions for a user are evaluated, see IAM JSON policy
 * evaluation logic in the IAM User Guide.
 */
export const putUserPermissionsBoundary = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutUserPermissionsBoundaryRequest,
    output: PutUserPermissionsBoundaryResponse,
    errors: [
      InvalidInputException,
      NoSuchEntityException,
      PolicyNotAttachableException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Adds or updates an inline policy document that is embedded in the specified IAM
 * user.
 *
 * An IAM user can also have a managed policy attached to it. To attach a managed
 * policy to a user, use
 * `AttachUserPolicy`
 * . To create a new managed policy, use
 *
 * `CreatePolicy`
 * . For information about policies, see Managed
 * policies and inline policies in the
 * *IAM User Guide*.
 *
 * For information about the maximum number of inline policies that you can embed in a
 * user, see IAM and STS quotas in the *IAM User Guide*.
 *
 * Because policy documents can be large, you should use POST rather than GET when
 * calling `PutUserPolicy`. For general information about using the Query
 * API with IAM, see Making query requests in the
 * *IAM User Guide*.
 */
export const putUserPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutUserPolicyRequest,
  output: PutUserPolicyResponse,
  errors: [
    LimitExceededException,
    MalformedPolicyDocumentException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Rejects a delegation request, denying the requested temporary access.
 *
 * Once a request is rejected, it cannot be accepted or updated later. Rejected requests expire after 7 days.
 *
 * When rejecting a request, an optional explanation can be added using the `Notes` request parameter.
 *
 * For more details, see
 *
 * Managing Permissions for Delegation Requests.
 */
export const rejectDelegationRequest = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RejectDelegationRequestRequest,
    output: RejectDelegationRequestResponse,
    errors: [
      ConcurrentModificationException,
      InvalidInputException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Removes the specified client ID (also known as audience) from the list of client IDs
 * registered for the specified IAM OpenID Connect (OIDC) provider resource
 * object.
 *
 * This operation is idempotent; it does not fail or return an error if you try to remove
 * a client ID that does not exist.
 */
export const removeClientIDFromOpenIDConnectProvider =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RemoveClientIDFromOpenIDConnectProviderRequest,
    output: RemoveClientIDFromOpenIDConnectProviderResponse,
    errors: [
      ConcurrentModificationException,
      InvalidInputException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }));
/**
 * Removes the specified IAM role from the specified Amazon EC2 instance profile.
 *
 * Make sure that you do not have any Amazon EC2 instances running with the role you are
 * about to remove from the instance profile. Removing a role from an instance profile
 * that is associated with a running instance might break any applications running on
 * the instance.
 *
 * For more information about roles, see IAM roles in the
 * *IAM User Guide*. For more information about instance profiles,
 * see Using
 * instance profiles in the *IAM User Guide*.
 */
export const removeRoleFromInstanceProfile =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RemoveRoleFromInstanceProfileRequest,
    output: RemoveRoleFromInstanceProfileResponse,
    errors: [
      LimitExceededException,
      NoSuchEntityException,
      ServiceFailureException,
      UnmodifiableEntityException,
    ],
  }));
/**
 * Removes the specified user from the specified group.
 */
export const removeUserFromGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveUserFromGroupRequest,
  output: RemoveUserFromGroupResponse,
  errors: [
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Synchronizes the specified MFA device with its IAM resource object on the Amazon Web Services
 * servers.
 *
 * For more information about creating and working with virtual MFA devices, see Using a virtual MFA
 * device in the *IAM User Guide*.
 */
export const resyncMFADevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResyncMFADeviceRequest,
  output: ResyncMFADeviceResponse,
  errors: [
    ConcurrentModificationException,
    InvalidAuthenticationCodeException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Sends the exchange token for an accepted delegation request.
 *
 * The exchange token is sent to the partner via an asynchronous notification channel, established by the partner.
 *
 * The delegation request must be in the `ACCEPTED` state when calling this API. After the
 * `SendDelegationToken` API
 * call is successful, the request transitions to a `FINALIZED` state and cannot be rolled back. However, a user may reject
 * an accepted request before the `SendDelegationToken` API is called.
 *
 * For more details, see
 *
 * Managing Permissions for Delegation Requests.
 */
export const sendDelegationToken = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendDelegationTokenRequest,
  output: SendDelegationTokenResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Sets the specified version of the specified policy as the policy's default (operative)
 * version.
 *
 * This operation affects all users, groups, and roles that the policy is attached to. To
 * list the users, groups, and roles that the policy is attached to, use ListEntitiesForPolicy.
 *
 * For information about managed policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 */
export const setDefaultPolicyVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SetDefaultPolicyVersionRequest,
    output: SetDefaultPolicyVersionResponse,
    errors: [
      InvalidInputException,
      LimitExceededException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Sets the specified version of the global endpoint token as the token version used for
 * the Amazon Web Services account.
 *
 * By default, Security Token Service (STS) is available as a global service, and all STS requests
 * go to a single endpoint at `https://sts.amazonaws.com`. Amazon Web Services recommends
 * using Regional STS endpoints to reduce latency, build in redundancy, and increase
 * session token availability. For information about Regional endpoints for STS, see
 * Security Token Service
 * endpoints and quotas in the *Amazon Web Services General Reference*.
 *
 * If you make an STS call to the global endpoint, the resulting session tokens might
 * be valid in some Regions but not others. It depends on the version that is set in this
 * operation. Version 1 tokens are valid only in Amazon Web Services Regions that are
 * available by default. These tokens do not work in manually enabled Regions, such as Asia
 * Pacific (Hong Kong). Version 2 tokens are valid in all Regions. However, version 2
 * tokens are longer and might affect systems where you temporarily store tokens. For
 * information, see Activating and
 * deactivating STS in an Amazon Web Services Region in the
 * *IAM User Guide*.
 *
 * To view the current session token version, see the
 * `GlobalEndpointTokenVersion` entry in the response of the GetAccountSummary operation.
 */
export const setSecurityTokenServicePreferences =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SetSecurityTokenServicePreferencesRequest,
    output: SetSecurityTokenServicePreferencesResponse,
    errors: [ServiceFailureException],
  }));
/**
 * Adds one or more tags to an IAM instance profile. If a tag with the same key name
 * already exists, then that tag is overwritten with the new value.
 *
 * Each tag consists of a key name and an associated value. By assigning tags to your resources, you can do the
 * following:
 *
 * - **Administrative grouping and discovery** - Attach
 * tags to resources to aid in organization and search. For example, you could search for all
 * resources with the key name *Project* and the value
 * *MyImportantProject*. Or search for all resources with the key name
 * *Cost Center* and the value *41200*.
 *
 * - **Access control** - Include tags in IAM user-based
 * and resource-based policies. You can use tags to restrict access to only an IAM instance
 * profile that has a specified tag attached. For examples of policies that show how to use
 * tags to control access, see Control access using IAM tags in the
 * *IAM User Guide*.
 *
 * - If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request
 * fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 *
 * - Amazon Web Services always interprets the tag `Value` as a single string. If you
 * need to store an array, you can store comma-separated values in the string. However, you
 * must interpret the value in your code.
 */
export const tagInstanceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagInstanceProfileRequest,
  output: TagInstanceProfileResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Adds one or more tags to an IAM virtual multi-factor authentication (MFA) device. If
 * a tag with the same key name already exists, then that tag is overwritten with the new
 * value.
 *
 * A tag consists of a key name and an associated value. By assigning tags to your
 * resources, you can do the following:
 *
 * - **Administrative grouping and discovery** - Attach
 * tags to resources to aid in organization and search. For example, you could search for all
 * resources with the key name *Project* and the value
 * *MyImportantProject*. Or search for all resources with the key name
 * *Cost Center* and the value *41200*.
 *
 * - **Access control** - Include tags in IAM user-based
 * and resource-based policies. You can use tags to restrict access to only an IAM virtual
 * MFA device that has a specified tag attached. For examples of policies that show how to
 * use tags to control access, see Control access using IAM tags in the
 * *IAM User Guide*.
 *
 * - If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request
 * fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 *
 * - Amazon Web Services always interprets the tag `Value` as a single string. If you
 * need to store an array, you can store comma-separated values in the string. However, you
 * must interpret the value in your code.
 */
export const tagMFADevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagMFADeviceRequest,
  output: TagMFADeviceResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Adds one or more tags to an OpenID Connect (OIDC)-compatible identity provider. For
 * more information about these providers, see About web identity federation. If
 * a tag with the same key name already exists, then that tag is overwritten with the new
 * value.
 *
 * A tag consists of a key name and an associated value. By assigning tags to your
 * resources, you can do the following:
 *
 * - **Administrative grouping and discovery** - Attach
 * tags to resources to aid in organization and search. For example, you could search for all
 * resources with the key name *Project* and the value
 * *MyImportantProject*. Or search for all resources with the key name
 * *Cost Center* and the value *41200*.
 *
 * - **Access control** - Include tags in IAM identity-based
 * and resource-based policies. You can use tags to restrict access to only an OIDC provider
 * that has a specified tag attached. For examples of policies that show how to use tags to
 * control access, see Control access using IAM tags in the
 * *IAM User Guide*.
 *
 * - If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request
 * fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 *
 * - Amazon Web Services always interprets the tag `Value` as a single string. If you
 * need to store an array, you can store comma-separated values in the string. However, you
 * must interpret the value in your code.
 */
export const tagOpenIDConnectProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: TagOpenIDConnectProviderRequest,
    output: TagOpenIDConnectProviderResponse,
    errors: [
      ConcurrentModificationException,
      InvalidInputException,
      LimitExceededException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Adds one or more tags to an IAM customer managed policy. If a tag with the same key
 * name already exists, then that tag is overwritten with the new value.
 *
 * A tag consists of a key name and an associated value. By assigning tags to your
 * resources, you can do the following:
 *
 * - **Administrative grouping and discovery** - Attach
 * tags to resources to aid in organization and search. For example, you could search for all
 * resources with the key name *Project* and the value
 * *MyImportantProject*. Or search for all resources with the key name
 * *Cost Center* and the value *41200*.
 *
 * - **Access control** - Include tags in IAM user-based
 * and resource-based policies. You can use tags to restrict access to only an IAM customer
 * managed policy that has a specified tag attached. For examples of policies that show how
 * to use tags to control access, see Control access using IAM tags in the
 * *IAM User Guide*.
 *
 * - If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request
 * fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 *
 * - Amazon Web Services always interprets the tag `Value` as a single string. If you
 * need to store an array, you can store comma-separated values in the string. However, you
 * must interpret the value in your code.
 */
export const tagPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagPolicyRequest,
  output: TagPolicyResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Adds one or more tags to an IAM role. The role can be a regular role or a
 * service-linked role. If a tag with the same key name already exists, then that tag is
 * overwritten with the new value.
 *
 * A tag consists of a key name and an associated value. By assigning tags to your
 * resources, you can do the following:
 *
 * - **Administrative grouping and discovery** - Attach
 * tags to resources to aid in organization and search. For example, you could search for all
 * resources with the key name *Project* and the value
 * *MyImportantProject*. Or search for all resources with the key name
 * *Cost Center* and the value *41200*.
 *
 * - **Access control** - Include tags in IAM user-based
 * and resource-based policies. You can use tags to restrict access to only an IAM role
 * that has a specified tag attached. You can also restrict access to only those resources
 * that have a certain tag attached. For examples of policies that show how to use tags to
 * control access, see Control access using IAM tags in the
 * *IAM User Guide*.
 *
 * - **Cost allocation** - Use tags to help track which
 * individuals and teams are using which Amazon Web Services resources.
 *
 * - If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request
 * fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 *
 * - Amazon Web Services always interprets the tag `Value` as a single string. If you
 * need to store an array, you can store comma-separated values in the string. However, you
 * must interpret the value in your code.
 *
 * For more information about tagging, see Tagging IAM identities in the
 * *IAM User Guide*.
 */
export const tagRole = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagRoleRequest,
  output: TagRoleResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Adds one or more tags to a Security Assertion Markup Language (SAML) identity provider.
 * For more information about these providers, see About SAML 2.0-based federation .
 * If a tag with the same key name already exists, then that tag is overwritten with the new
 * value.
 *
 * A tag consists of a key name and an associated value. By assigning tags to your
 * resources, you can do the following:
 *
 * - **Administrative grouping and discovery** - Attach
 * tags to resources to aid in organization and search. For example, you could search for all
 * resources with the key name *Project* and the value
 * *MyImportantProject*. Or search for all resources with the key name
 * *Cost Center* and the value *41200*.
 *
 * - **Access control** - Include tags in IAM user-based
 * and resource-based policies. You can use tags to restrict access to only a SAML identity
 * provider that has a specified tag attached. For examples of policies that show how to use
 * tags to control access, see Control access using IAM tags in the
 * *IAM User Guide*.
 *
 * - If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request
 * fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 *
 * - Amazon Web Services always interprets the tag `Value` as a single string. If you
 * need to store an array, you can store comma-separated values in the string. However, you
 * must interpret the value in your code.
 */
export const tagSAMLProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagSAMLProviderRequest,
  output: TagSAMLProviderResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Adds one or more tags to an IAM server certificate. If a tag with the same key name
 * already exists, then that tag is overwritten with the new value.
 *
 * For certificates in a Region supported by Certificate Manager (ACM), we
 * recommend that you don't use IAM server certificates. Instead, use ACM to provision,
 * manage, and deploy your server certificates. For more information about IAM server
 * certificates, Working with server
 * certificates in the *IAM User Guide*.
 *
 * A tag consists of a key name and an associated value. By assigning tags to your
 * resources, you can do the following:
 *
 * - **Administrative grouping and discovery** - Attach
 * tags to resources to aid in organization and search. For example, you could search for all
 * resources with the key name *Project* and the value
 * *MyImportantProject*. Or search for all resources with the key name
 * *Cost Center* and the value *41200*.
 *
 * - **Access control** - Include tags in IAM user-based
 * and resource-based policies. You can use tags to restrict access to only a server
 * certificate that has a specified tag attached. For examples of policies that show how to
 * use tags to control access, see Control access using IAM tags in the
 * *IAM User Guide*.
 *
 * - **Cost allocation** - Use tags to help track which
 * individuals and teams are using which Amazon Web Services resources.
 *
 * - If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request
 * fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 *
 * - Amazon Web Services always interprets the tag `Value` as a single string. If you
 * need to store an array, you can store comma-separated values in the string. However, you
 * must interpret the value in your code.
 */
export const tagServerCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: TagServerCertificateRequest,
    output: TagServerCertificateResponse,
    errors: [
      ConcurrentModificationException,
      InvalidInputException,
      LimitExceededException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Adds one or more tags to an IAM user. If a tag with the same key name already exists,
 * then that tag is overwritten with the new value.
 *
 * A tag consists of a key name and an associated value. By assigning tags to your
 * resources, you can do the following:
 *
 * - **Administrative grouping and discovery** - Attach
 * tags to resources to aid in organization and search. For example, you could search for all
 * resources with the key name *Project* and the value
 * *MyImportantProject*. Or search for all resources with the key name
 * *Cost Center* and the value *41200*.
 *
 * - **Access control** - Include tags in IAM identity-based
 * and resource-based policies. You can use tags to restrict access to only an IAM
 * requesting user that has a specified tag attached. You can also restrict access to only
 * those resources that have a certain tag attached. For examples of policies that show how
 * to use tags to control access, see Control access using IAM tags in the
 * *IAM User Guide*.
 *
 * - **Cost allocation** - Use tags to help track which
 * individuals and teams are using which Amazon Web Services resources.
 *
 * - If any one of the tags is invalid or if you exceed the allowed maximum number of tags, then the entire request
 * fails and the resource is not created. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 *
 * - Amazon Web Services always interprets the tag `Value` as a single string. If you
 * need to store an array, you can store comma-separated values in the string. However, you
 * must interpret the value in your code.
 *
 * For more information about tagging, see Tagging IAM identities in the
 * *IAM User Guide*.
 */
export const tagUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagUserRequest,
  output: TagUserResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Removes the specified tags from the IAM instance profile. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const untagInstanceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UntagInstanceProfileRequest,
    output: UntagInstanceProfileResponse,
    errors: [
      ConcurrentModificationException,
      InvalidInputException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Removes the specified tags from the IAM virtual multi-factor authentication (MFA)
 * device. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const untagMFADevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagMFADeviceRequest,
  output: UntagMFADeviceResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Removes the specified tags from the specified OpenID Connect (OIDC)-compatible identity
 * provider in IAM. For more information about OIDC providers, see About web identity federation.
 * For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const untagOpenIDConnectProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UntagOpenIDConnectProviderRequest,
    output: UntagOpenIDConnectProviderResponse,
    errors: [
      ConcurrentModificationException,
      InvalidInputException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Removes the specified tags from the customer managed policy. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const untagPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagPolicyRequest,
  output: UntagPolicyResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Removes the specified tags from the role. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const untagRole = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagRoleRequest,
  output: UntagRoleResponse,
  errors: [
    ConcurrentModificationException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Removes the specified tags from the specified Security Assertion Markup Language (SAML)
 * identity provider in IAM. For more information about these providers, see About web identity
 * federation. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const untagSAMLProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagSAMLProviderRequest,
  output: UntagSAMLProviderResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Removes the specified tags from the IAM server certificate.
 * For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 *
 * For certificates in a Region supported by Certificate Manager (ACM), we
 * recommend that you don't use IAM server certificates. Instead, use ACM to provision,
 * manage, and deploy your server certificates. For more information about IAM server
 * certificates, Working with server
 * certificates in the *IAM User Guide*.
 */
export const untagServerCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UntagServerCertificateRequest,
    output: UntagServerCertificateResponse,
    errors: [
      ConcurrentModificationException,
      InvalidInputException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Removes the specified tags from the user. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const untagUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagUserRequest,
  output: UntagUserResponse,
  errors: [
    ConcurrentModificationException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Changes the status of the specified access key from Active to Inactive, or vice versa.
 * This operation can be used to disable a user's key as part of a key rotation
 * workflow.
 *
 * If the `UserName` is not specified, the user name is determined implicitly
 * based on the Amazon Web Services access key ID used to sign the request. If a temporary access key is
 * used, then `UserName` is required. If a long-term key is assigned to the
 * user, then `UserName` is not required. This operation works for access keys
 * under the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root user
 * credentials even if the Amazon Web Services account has no associated users.
 *
 * For information about rotating keys, see Managing keys and certificates
 * in the *IAM User Guide*.
 */
export const updateAccessKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccessKeyRequest,
  output: UpdateAccessKeyResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Updates the password policy settings for the Amazon Web Services account.
 *
 * This operation does not support partial updates. No parameters are required, but
 * if you do not specify a parameter, that parameter's value reverts to its default
 * value. See the **Request Parameters** section for each
 * parameter's default value. Also note that some parameters do not allow the default
 * parameter to be explicitly set. Instead, to invoke the default value, do not include
 * that parameter when you invoke the operation.
 *
 * For more information about using a password policy, see Managing an IAM password
 * policy in the *IAM User Guide*.
 */
export const updateAccountPasswordPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAccountPasswordPolicyRequest,
    output: UpdateAccountPasswordPolicyResponse,
    errors: [
      LimitExceededException,
      MalformedPolicyDocumentException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Updates the policy that grants an IAM entity permission to assume a role. This is
 * typically referred to as the "role trust policy". For more information about roles, see
 * Using roles to
 * delegate permissions and federate identities.
 */
export const updateAssumeRolePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAssumeRolePolicyRequest,
    output: UpdateAssumeRolePolicyResponse,
    errors: [
      LimitExceededException,
      MalformedPolicyDocumentException,
      NoSuchEntityException,
      ServiceFailureException,
      UnmodifiableEntityException,
    ],
  }),
);
/**
 * Updates an existing delegation request with additional information. When the delegation
 * request is updated, it reaches the `PENDING_APPROVAL` state.
 *
 * Once a delegation request has an owner, that owner gets a default permission to update the
 * delegation request. For more details, see
 *
 * Managing Permissions for Delegation Requests.
 */
export const updateDelegationRequest = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDelegationRequestRequest,
    output: UpdateDelegationRequestResponse,
    errors: [
      ConcurrentModificationException,
      InvalidInputException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Updates the name and/or the path of the specified IAM group.
 *
 * You should understand the implications of changing a group's path or name. For
 * more information, see Renaming users and
 * groups in the *IAM User Guide*.
 *
 * The person making the request (the principal), must have permission to change the
 * role group with the old name and the new name. For example, to change the group
 * named `Managers` to `MGRs`, the principal must have a policy
 * that allows them to update both groups. If the principal has permission to update
 * the `Managers` group, but not the `MGRs` group, then the
 * update fails. For more information about permissions, see Access management.
 */
export const updateGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGroupRequest,
  output: UpdateGroupResponse,
  errors: [
    EntityAlreadyExistsException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Replaces the existing list of server certificate thumbprints associated with an OpenID
 * Connect (OIDC) provider resource object with a new list of thumbprints.
 *
 * The list that you pass with this operation completely replaces the existing list of
 * thumbprints. (The lists are not merged.)
 *
 * Typically, you need to update a thumbprint only when the identity provider certificate
 * changes, which occurs rarely. However, if the provider's certificate
 * *does* change, any attempt to assume an IAM role that specifies
 * the OIDC provider as a principal fails until the certificate thumbprint is
 * updated.
 *
 * Amazon Web Services secures communication with OIDC identity providers (IdPs) using our library of
 * trusted root certificate authorities (CAs) to verify the JSON Web Key Set (JWKS)
 * endpoint's TLS certificate. If your OIDC IdP relies on a certificate that is not signed
 * by one of these trusted CAs, only then we secure communication using the thumbprints set
 * in the IdP's configuration.
 *
 * Trust for the OIDC provider is derived from the provider certificate and is
 * validated by the thumbprint. Therefore, it is best to limit access to the
 * `UpdateOpenIDConnectProviderThumbprint` operation to highly
 * privileged users.
 */
export const updateOpenIDConnectProviderThumbprint =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateOpenIDConnectProviderThumbprintRequest,
    output: UpdateOpenIDConnectProviderThumbprintResponse,
    errors: [
      ConcurrentModificationException,
      InvalidInputException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }));
/**
 * Updates the description or maximum session duration setting of a role.
 */
export const updateRole = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRoleRequest,
  output: UpdateRoleResponse,
  errors: [
    NoSuchEntityException,
    ServiceFailureException,
    UnmodifiableEntityException,
  ],
}));
/**
 * Updates the name and/or the path of the specified server certificate stored in
 * IAM.
 *
 * For more information about working with server certificates, see Working
 * with server certificates in the *IAM User Guide*. This
 * topic also includes a list of Amazon Web Services services that can use the server certificates that
 * you manage with IAM.
 *
 * You should understand the implications of changing a server certificate's path or
 * name. For more information, see Renaming a server certificate in the
 * *IAM User Guide*.
 *
 * The person making the request (the principal), must have permission to change the
 * server certificate with the old name and the new name. For example, to change the
 * certificate named `ProductionCert` to `ProdCert`, the
 * principal must have a policy that allows them to update both certificates. If the
 * principal has permission to update the `ProductionCert` group, but not
 * the `ProdCert` certificate, then the update fails. For more information
 * about permissions, see Access management in the *IAM User Guide*.
 */
export const updateServerCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateServerCertificateRequest,
    output: UpdateServerCertificateResponse,
    errors: [
      EntityAlreadyExistsException,
      LimitExceededException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Sets the status of a service-specific credential to `Active` or
 * `Inactive`. Service-specific credentials that are inactive cannot be used
 * for authentication to the service. This operation can be used to disable a user's
 * service-specific credential as part of a credential rotation work flow.
 */
export const updateServiceSpecificCredential =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateServiceSpecificCredentialRequest,
    output: UpdateServiceSpecificCredentialResponse,
    errors: [NoSuchEntityException],
  }));
/**
 * Changes the status of the specified user signing certificate from active to disabled,
 * or vice versa. This operation can be used to disable an IAM user's signing
 * certificate as part of a certificate rotation work flow.
 *
 * If the `UserName` field is not specified, the user name is determined
 * implicitly based on the Amazon Web Services access key ID used to sign the request. This operation
 * works for access keys under the Amazon Web Services account. Consequently, you can use this operation
 * to manage Amazon Web Services account root user credentials even if the Amazon Web Services account has no associated
 * users.
 */
export const updateSigningCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSigningCertificateRequest,
    output: UpdateSigningCertificateResponse,
    errors: [
      InvalidInputException,
      LimitExceededException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Sets the status of an IAM user's SSH public key to active or inactive. SSH public
 * keys that are inactive cannot be used for authentication. This operation can be used to
 * disable a user's SSH public key as part of a key rotation work flow.
 *
 * The SSH public key affected by this operation is used only for authenticating the
 * associated IAM user to an CodeCommit repository. For more information about using SSH keys
 * to authenticate to an CodeCommit repository, see Set up CodeCommit for
 * SSH connections in the *CodeCommit User Guide*.
 */
export const updateSSHPublicKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSSHPublicKeyRequest,
  output: UpdateSSHPublicKeyResponse,
  errors: [InvalidInputException, NoSuchEntityException],
}));
/**
 * Updates the name and/or the path of the specified IAM user.
 *
 * You should understand the implications of changing an IAM user's path or
 * name. For more information, see Renaming an IAM
 * user and Renaming an IAM
 * group in the *IAM User Guide*.
 *
 * To change a user name, the requester must have appropriate permissions on both
 * the source object and the target object. For example, to change Bob to Robert, the
 * entity making the request must have permission on Bob and Robert, or must have
 * permission on all (*). For more information about permissions, see Permissions and policies.
 */
export const updateUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserRequest,
  output: UpdateUserResponse,
  errors: [
    ConcurrentModificationException,
    EntityAlreadyExistsException,
    EntityTemporarilyUnmodifiableException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Accepts a delegation request, granting the requested temporary access.
 *
 * Once the delegation request is accepted, it is eligible to send the exchange token to the partner.
 * The SendDelegationToken
 * API has to be explicitly called to send the delegation token.
 *
 * At the time of acceptance, IAM records the details and the state of the identity that called this API.
 * This is the identity that gets mapped to the delegated credential.
 *
 * An accepted request may be rejected before the exchange token is sent to the partner.
 */
export const acceptDelegationRequest = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AcceptDelegationRequestRequest,
    output: AcceptDelegationRequestResponse,
    errors: [
      ConcurrentModificationException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Adds a new client ID (also known as audience) to the list of client IDs already
 * registered for the specified IAM OpenID Connect (OIDC) provider resource.
 *
 * This operation is idempotent; it does not fail or return an error if you add an
 * existing client ID to the provider.
 */
export const addClientIDToOpenIDConnectProvider =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AddClientIDToOpenIDConnectProviderRequest,
    output: AddClientIDToOpenIDConnectProviderResponse,
    errors: [
      ConcurrentModificationException,
      InvalidInputException,
      LimitExceededException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }));
/**
 * Adds the specified IAM role to the specified instance profile. An instance profile
 * can contain only one role, and this quota cannot be increased. You can remove the
 * existing role and then add a different role to an instance profile. You must then wait
 * for the change to appear across all of Amazon Web Services because of eventual
 * consistency. To force the change, you must disassociate the instance profile and then associate the
 * instance profile, or you can stop your instance and then restart it.
 *
 * The caller of this operation must be granted the `PassRole` permission
 * on the IAM role by a permissions policy.
 *
 * When using the iam:AssociatedResourceArn condition in a policy to restrict the PassRole IAM action, special considerations apply if the policy is
 * intended to define access for the `AddRoleToInstanceProfile` action. In
 * this case, you cannot specify a Region or instance ID in the EC2 instance ARN. The
 * ARN value must be `arn:aws:ec2:*:CallerAccountId:instance/*`. Using any
 * other ARN value may lead to unexpected evaluation results.
 *
 * For more information about roles, see IAM roles in the
 * *IAM User Guide*. For more information about instance profiles,
 * see Using
 * instance profiles in the *IAM User Guide*.
 */
export const addRoleToInstanceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AddRoleToInstanceProfileRequest,
    output: AddRoleToInstanceProfileResponse,
    errors: [
      EntityAlreadyExistsException,
      LimitExceededException,
      NoSuchEntityException,
      ServiceFailureException,
      UnmodifiableEntityException,
    ],
  }),
);
/**
 * Adds the specified user to the specified group.
 */
export const addUserToGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddUserToGroupRequest,
  output: AddUserToGroupResponse,
  errors: [
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Associates a delegation request with the current identity.
 *
 * If the partner that created the delegation request has specified the owner account during creation,
 * only an identity from that owner account can call the `AssociateDelegationRequest` API for
 * the specified delegation request. Once the `AssociateDelegationRequest` API call is successful,
 * the ARN of the current calling identity will be stored as the
 * `ownerId`
 * of the request.
 *
 * If the partner that created the delegation request has not specified the owner account during creation,
 * any caller from any account can call the `AssociateDelegationRequest` API for
 * the delegation request. Once this API call is successful, the ARN of the current calling identity will be stored as the
 * `ownerId`
 * and the Amazon Web Services account ID of the current calling identity will be stored as the
 * `ownerAccount`
 * of the request.
 *
 * For more details, see
 *
 * Managing Permissions for Delegation Requests.
 */
export const associateDelegationRequest = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateDelegationRequestRequest,
    output: AssociateDelegationRequestResponse,
    errors: [
      ConcurrentModificationException,
      InvalidInputException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Attaches the specified managed policy to the specified IAM group.
 *
 * You use this operation to attach a managed policy to a group. To embed an inline
 * policy in a group, use
 * `PutGroupPolicy`
 * .
 *
 * As a best practice, you can validate your IAM policies.
 * To learn more, see Validating IAM policies
 * in the *IAM User Guide*.
 *
 * For more information about policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 */
export const attachGroupPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachGroupPolicyRequest,
  output: AttachGroupPolicyResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    PolicyNotAttachableException,
    ServiceFailureException,
  ],
}));
/**
 * Attaches the specified managed policy to the specified IAM role. When you attach a
 * managed policy to a role, the managed policy becomes part of the role's permission
 * (access) policy.
 *
 * You cannot use a managed policy as the role's trust policy. The role's trust
 * policy is created at the same time as the role, using
 * `CreateRole`
 * . You can update a role's trust policy using
 *
 * `UpdateAssumerolePolicy`
 * .
 *
 * Use this operation to attach a *managed* policy to a role. To embed
 * an inline policy in a role, use
 * `PutRolePolicy`
 * . For more information about policies, see Managed
 * policies and inline policies in the
 * *IAM User Guide*.
 *
 * As a best practice, you can validate your IAM policies.
 * To learn more, see Validating IAM policies
 * in the *IAM User Guide*.
 */
export const attachRolePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachRolePolicyRequest,
  output: AttachRolePolicyResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    PolicyNotAttachableException,
    ServiceFailureException,
    UnmodifiableEntityException,
  ],
}));
/**
 * Creates an IAM resource that describes an identity provider (IdP) that supports SAML
 * 2.0.
 *
 * The SAML provider resource that you create with this operation can be used as a
 * principal in an IAM role's trust policy. Such a policy can enable federated users who
 * sign in using the SAML IdP to assume the role. You can create an IAM role that
 * supports Web-based single sign-on (SSO) to the Amazon Web Services Management Console or one that supports API access
 * to Amazon Web Services.
 *
 * When you create the SAML provider resource, you upload a SAML metadata document that
 * you get from your IdP. That document includes the issuer's name, expiration information,
 * and keys that can be used to validate the SAML authentication response (assertions) that
 * the IdP sends. You must generate the metadata document using the identity management
 * software that is used as your organization's IdP.
 *
 * This operation requires Signature Version 4.
 *
 * For more information, see Enabling SAML 2.0
 * federated users to access the Amazon Web Services Management Console and About SAML 2.0-based
 * federation in the *IAM User Guide*.
 */
export const createSAMLProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSAMLProviderRequest,
  output: CreateSAMLProviderResponse,
  errors: [
    ConcurrentModificationException,
    EntityAlreadyExistsException,
    InvalidInputException,
    LimitExceededException,
    ServiceFailureException,
  ],
}));
/**
 * Creates an IAM role that is linked to a specific Amazon Web Services service. The service controls
 * the attached policies and when the role can be deleted. This helps ensure that the
 * service is not broken by an unexpectedly changed or deleted role, which could put your
 * Amazon Web Services resources into an unknown state. Allowing the service to control the role helps
 * improve service stability and proper cleanup when a service and its role are no longer
 * needed. For more information, see Using service-linked
 * roles in the *IAM User Guide*.
 *
 * To attach a policy to this service-linked role, you must make the request using the
 * Amazon Web Services service that depends on this role.
 */
export const createServiceLinkedRole = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateServiceLinkedRoleRequest,
    output: CreateServiceLinkedRoleResponse,
    errors: [
      InvalidInputException,
      LimitExceededException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Deletes the specified IAM group. The group must not contain any users or have any
 * attached policies.
 */
export const deleteGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGroupRequest,
  output: DeleteGroupResponse,
  errors: [
    DeleteConflictException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Submits a service-linked role deletion request and returns a
 * `DeletionTaskId`, which you can use to check the status of the deletion.
 * Before you call this operation, confirm that the role has no active sessions and that
 * any resources used by the role in the linked service are deleted. If you call this
 * operation more than once for the same service-linked role and an earlier deletion task
 * is not complete, then the `DeletionTaskId` of the earlier request is
 * returned.
 *
 * If you submit a deletion request for a service-linked role whose linked service is
 * still accessing a resource, then the deletion task fails. If it fails, the GetServiceLinkedRoleDeletionStatus operation returns the reason for the
 * failure, usually including the resources that must be deleted. To delete the
 * service-linked role, you must first remove those resources from the linked service and
 * then submit the deletion request again. Resources are specific to the service that is
 * linked to the role. For more information about removing resources from a service, see
 * the Amazon Web Services documentation for your
 * service.
 *
 * For more information about service-linked roles, see Roles terms and concepts: Amazon Web Services service-linked role in the
 * *IAM User Guide*.
 */
export const deleteServiceLinkedRole = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteServiceLinkedRoleRequest,
    output: DeleteServiceLinkedRoleResponse,
    errors: [
      LimitExceededException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Disables the management of privileged root user credentials across member accounts in
 * your organization. When you disable this feature, the management account and the
 * delegated administrator for IAM can no longer manage root user credentials for member
 * accounts in your organization.
 */
export const disableOrganizationsRootCredentialsManagement =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisableOrganizationsRootCredentialsManagementRequest,
    output: DisableOrganizationsRootCredentialsManagementResponse,
    errors: [
      AccountNotManagementOrDelegatedAdministratorException,
      OrganizationNotFoundException,
      OrganizationNotInAllFeaturesModeException,
      ServiceAccessNotEnabledException,
    ],
  }));
/**
 * Disables root user sessions for privileged tasks across member accounts in your
 * organization. When you disable this feature, the management account and the delegated
 * administrator for IAM can no longer perform privileged tasks on member accounts in
 * your organization.
 */
export const disableOrganizationsRootSessions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisableOrganizationsRootSessionsRequest,
    output: DisableOrganizationsRootSessionsResponse,
    errors: [
      AccountNotManagementOrDelegatedAdministratorException,
      OrganizationNotFoundException,
      OrganizationNotInAllFeaturesModeException,
      ServiceAccessNotEnabledException,
    ],
  }));
/**
 * Enables the specified MFA device and associates it with the specified IAM user. When
 * enabled, the MFA device is required for every subsequent login by the IAM user
 * associated with the device.
 */
export const enableMFADevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableMFADeviceRequest,
  output: EnableMFADeviceResponse,
  errors: [
    ConcurrentModificationException,
    EntityAlreadyExistsException,
    EntityTemporarilyUnmodifiableException,
    InvalidAuthenticationCodeException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Enables the management of privileged root user credentials across member accounts in your
 * organization. When you enable root credentials management for centralized root access, the management account and the delegated
 * administrator for IAM can manage root user credentials for member accounts in your
 * organization.
 *
 * Before you enable centralized root access, you must have an account configured with
 * the following settings:
 *
 * - You must manage your Amazon Web Services accounts in Organizations.
 *
 * - Enable trusted access for Identity and Access Management in Organizations. For details, see
 * IAM and Organizations in the Organizations User
 * Guide.
 */
export const enableOrganizationsRootCredentialsManagement =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: EnableOrganizationsRootCredentialsManagementRequest,
    output: EnableOrganizationsRootCredentialsManagementResponse,
    errors: [
      AccountNotManagementOrDelegatedAdministratorException,
      CallerIsNotManagementAccountException,
      OrganizationNotFoundException,
      OrganizationNotInAllFeaturesModeException,
      ServiceAccessNotEnabledException,
    ],
  }));
/**
 * Allows the management account or delegated administrator to perform privileged tasks
 * on member accounts in your organization. For more information, see Centrally manage root access for member accounts in the Identity and Access Management
 * User Guide.
 *
 * Before you enable this feature, you must have an account configured with the following
 * settings:
 *
 * - You must manage your Amazon Web Services accounts in Organizations.
 *
 * - Enable trusted access for Identity and Access Management in Organizations. For details, see
 * IAM and Organizations in the Organizations User
 * Guide.
 */
export const enableOrganizationsRootSessions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: EnableOrganizationsRootSessionsRequest,
    output: EnableOrganizationsRootSessionsResponse,
    errors: [
      AccountNotManagementOrDelegatedAdministratorException,
      CallerIsNotManagementAccountException,
      OrganizationNotFoundException,
      OrganizationNotInAllFeaturesModeException,
      ServiceAccessNotEnabledException,
    ],
  }));
/**
 * Enables the outbound identity federation feature for your Amazon Web Services account. When enabled, IAM principals in your account
 * can use the `GetWebIdentityToken` API to obtain JSON Web Tokens (JWTs) for secure authentication with external services.
 * This operation also generates a unique issuer URL for your Amazon Web Services account.
 */
export const enableOutboundWebIdentityFederation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: EnableOutboundWebIdentityFederationRequest,
    output: EnableOutboundWebIdentityFederationResponse,
    errors: [FeatureEnabledException],
  }));
/**
 * Generates a report that includes details about when an IAM resource (user, group,
 * role, or policy) was last used in an attempt to access Amazon Web Services services. Recent activity
 * usually appears within four hours. IAM reports activity for at least the last 400
 * days, or less if your Region began supporting this feature within the last year. For
 * more information, see Regions where data is tracked. For more information about services and
 * actions for which action last accessed information is displayed, see IAM
 * action last accessed information services and actions.
 *
 * The service last accessed data includes all attempts to access an Amazon Web Services API, not
 * just the successful ones. This includes all attempts that were made using the
 * Amazon Web Services Management Console, the Amazon Web Services API through any of the SDKs, or any of the command line tools.
 * An unexpected entry in the service last accessed data does not mean that your
 * account has been compromised, because the request might have been denied. Refer to
 * your CloudTrail logs as the authoritative source for information about all API calls
 * and whether they were successful or denied access. For more information, see Logging
 * IAM events with CloudTrail in the
 * *IAM User Guide*.
 *
 * The `GenerateServiceLastAccessedDetails` operation returns a
 * `JobId`. Use this parameter in the following operations to retrieve the
 * following details from your report:
 *
 * - GetServiceLastAccessedDetails – Use this operation for
 * users, groups, roles, or policies to list every Amazon Web Services service that the resource
 * could access using permissions policies. For each service, the response includes
 * information about the most recent access attempt.
 *
 * The `JobId` returned by
 * `GenerateServiceLastAccessedDetail` must be used by the same role
 * within a session, or by the same user when used to call
 * `GetServiceLastAccessedDetail`.
 *
 * - GetServiceLastAccessedDetailsWithEntities – Use this
 * operation for groups and policies to list information about the associated
 * entities (users or roles) that attempted to access a specific Amazon Web Services service.
 *
 * To check the status of the `GenerateServiceLastAccessedDetails` request,
 * use the `JobId` parameter in the same operations and test the
 * `JobStatus` response parameter.
 *
 * For additional information about the permissions policies that allow an identity
 * (user, group, or role) to access specific services, use the ListPoliciesGrantingServiceAccess operation.
 *
 * Service last accessed data does not use other policy types when determining
 * whether a resource could access a service. These other policy types include
 * resource-based policies, access control lists, Organizations policies, IAM permissions
 * boundaries, and STS assume role policies. It only applies permissions policy
 * logic. For more about the evaluation of policy types, see Evaluating policies in the
 * *IAM User Guide*.
 *
 * For more information about service and action last accessed data, see Reducing permissions using service last accessed data in the
 * *IAM User Guide*.
 */
export const generateServiceLastAccessedDetails =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GenerateServiceLastAccessedDetailsRequest,
    output: GenerateServiceLastAccessedDetailsResponse,
    errors: [InvalidInputException, NoSuchEntityException],
  }));
/**
 * Retrieves the password policy for the Amazon Web Services account. This tells you the complexity
 * requirements and mandatory rotation periods for the IAM user passwords in your account.
 * For more information about using a password policy, see Managing an IAM password
 * policy.
 */
export const getAccountPasswordPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAccountPasswordPolicyRequest,
    output: GetAccountPasswordPolicyResponse,
    errors: [NoSuchEntityException, ServiceFailureException],
  }),
);
/**
 * Retrieves information about IAM entity usage and IAM quotas in the Amazon Web Services
 * account.
 *
 * For information about IAM quotas, see IAM and STS quotas in the
 * *IAM User Guide*.
 */
export const getAccountSummary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountSummaryRequest,
  output: GetAccountSummaryResponse,
  errors: [ServiceFailureException],
}));
/**
 * Gets a list of all of the context keys referenced in the input policies. The policies
 * are supplied as a list of one or more strings. To get the context keys from policies
 * associated with an IAM user, group, or role, use GetContextKeysForPrincipalPolicy.
 *
 * Context keys are variables maintained by Amazon Web Services and its services that provide details
 * about the context of an API query request. Context keys can be evaluated by testing
 * against a value specified in an IAM policy. Use
 * `GetContextKeysForCustomPolicy` to understand what key names and values
 * you must supply when you call SimulateCustomPolicy. Note that all parameters are shown in unencoded form
 * here for clarity but must be URL encoded to be included as a part of a real HTML
 * request.
 */
export const getContextKeysForCustomPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetContextKeysForCustomPolicyRequest,
    output: GetContextKeysForPolicyResponse,
    errors: [InvalidInputException],
  }));
/**
 * Returns a list of IAM users that are in the specified IAM group. You can paginate
 * the results using the `MaxItems` and `Marker` parameters.
 */
export const getGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGroupRequest,
  output: GetGroupResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Retrieves the specified inline policy document that is embedded in the specified IAM
 * group.
 *
 * Policies returned by this operation are URL-encoded compliant
 * with RFC 3986. You can use a URL
 * decoding method to convert the policy back to plain JSON text. For example, if you use Java, you
 * can use the `decode` method of the `java.net.URLDecoder` utility class in
 * the Java SDK. Other languages and SDKs provide similar functionality, and some SDKs do this decoding
 * automatically.
 *
 * An IAM group can also have managed policies attached to it. To retrieve a managed
 * policy document that is attached to a group, use GetPolicy to determine the
 * policy's default version, then use GetPolicyVersion to
 * retrieve the policy document.
 *
 * For more information about policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 */
export const getGroupPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGroupPolicyRequest,
  output: GetGroupPolicyResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Retrieves a human readable summary for a given entity. At this time, the only supported
 * entity type is `delegation-request`
 *
 * This method uses a Large Language Model (LLM) to generate the summary.
 *
 * If a delegation request has no owner or owner account, `GetHumanReadableSummary` for that delegation request can be called by any account.
 * If the owner account is assigned but there is
 * no owner id, only identities within that owner account can call `GetHumanReadableSummary`
 * for the delegation request to retrieve a summary of that request.
 * Once the delegation request is fully owned, the owner of the request gets
 * a default permission to get that delegation request. For more details, read
 * default permissions granted to delegation requests. These rules are identical to
 * GetDelegationRequest
 * API behavior, such that a party who has permissions to call
 * GetDelegationRequest
 * for a given delegation request will always be able to retrieve the human readable summary for that request.
 */
export const getHumanReadableSummary = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetHumanReadableSummaryRequest,
    output: GetHumanReadableSummaryResponse,
    errors: [
      InvalidInputException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Retrieves the user name for the specified IAM user. A login profile is created when
 * you create a password for the user to access the Amazon Web Services Management Console. If the user does not exist
 * or does not have a password, the operation returns a 404 (`NoSuchEntity`)
 * error.
 *
 * If you create an IAM user with access to the console, the `CreateDate`
 * reflects the date you created the initial password for the user.
 *
 * If you create an IAM user with programmatic access, and then later add a password
 * for the user to access the Amazon Web Services Management Console, the `CreateDate` reflects the initial
 * password creation date. A user with programmatic access does not have a login profile
 * unless you create a password for the user to access the Amazon Web Services Management Console.
 */
export const getLoginProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLoginProfileRequest,
  output: GetLoginProfileResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Returns information about the specified OpenID Connect (OIDC) provider resource object
 * in IAM.
 */
export const getOpenIDConnectProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetOpenIDConnectProviderRequest,
    output: GetOpenIDConnectProviderResponse,
    errors: [
      InvalidInputException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Retrieves information about the specified managed policy, including the policy's
 * default version and the total number of IAM users, groups, and roles to which the
 * policy is attached. To retrieve the list of the specific users, groups, and roles that
 * the policy is attached to, use ListEntitiesForPolicy. This operation returns metadata about the policy. To
 * retrieve the actual policy document for a specific version of the policy, use GetPolicyVersion.
 *
 * This operation retrieves information about managed policies. To retrieve information
 * about an inline policy that is embedded with an IAM user, group, or role, use GetUserPolicy, GetGroupPolicy, or
 * GetRolePolicy.
 *
 * For more information about policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 */
export const getPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyRequest,
  output: GetPolicyResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Retrieves information about the specified version of the specified managed policy,
 * including the policy document.
 *
 * Policies returned by this operation are URL-encoded compliant
 * with RFC 3986. You can use a URL
 * decoding method to convert the policy back to plain JSON text. For example, if you use Java, you
 * can use the `decode` method of the `java.net.URLDecoder` utility class in
 * the Java SDK. Other languages and SDKs provide similar functionality, and some SDKs do this decoding
 * automatically.
 *
 * To list the available versions for a policy, use ListPolicyVersions.
 *
 * This operation retrieves information about managed policies. To retrieve information
 * about an inline policy that is embedded in a user, group, or role, use GetUserPolicy, GetGroupPolicy, or
 * GetRolePolicy.
 *
 * For more information about the types of policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 *
 * For more information about managed policy versions, see Versioning for managed
 * policies in the *IAM User Guide*.
 */
export const getPolicyVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyVersionRequest,
  output: GetPolicyVersionResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Retrieves information about the specified role, including the role's path, GUID, ARN,
 * and the role's trust policy that grants permission to assume the role. For more
 * information about roles, see IAM roles in the
 * *IAM User Guide*.
 *
 * Policies returned by this operation are URL-encoded compliant
 * with RFC 3986. You can use a URL
 * decoding method to convert the policy back to plain JSON text. For example, if you use Java, you
 * can use the `decode` method of the `java.net.URLDecoder` utility class in
 * the Java SDK. Other languages and SDKs provide similar functionality, and some SDKs do this decoding
 * automatically.
 */
export const getRole = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRoleRequest,
  output: GetRoleResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Retrieves the specified inline policy document that is embedded with the specified
 * IAM role.
 *
 * Policies returned by this operation are URL-encoded compliant
 * with RFC 3986. You can use a URL
 * decoding method to convert the policy back to plain JSON text. For example, if you use Java, you
 * can use the `decode` method of the `java.net.URLDecoder` utility class in
 * the Java SDK. Other languages and SDKs provide similar functionality, and some SDKs do this decoding
 * automatically.
 *
 * An IAM role can also have managed policies attached to it. To retrieve a managed
 * policy document that is attached to a role, use GetPolicy to determine the
 * policy's default version, then use GetPolicyVersion to
 * retrieve the policy document.
 *
 * For more information about policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 *
 * For more information about roles, see IAM roles in the
 * *IAM User Guide*.
 */
export const getRolePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRolePolicyRequest,
  output: GetRolePolicyResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Retrieves information about the specified IAM user, including the user's creation
 * date, path, unique ID, and ARN.
 *
 * If you do not specify a user name, IAM determines the user name implicitly based on
 * the Amazon Web Services access key ID used to sign the request to this operation.
 */
export const getUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUserRequest,
  output: GetUserResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Retrieves the specified inline policy document that is embedded in the specified IAM
 * user.
 *
 * Policies returned by this operation are URL-encoded compliant
 * with RFC 3986. You can use a URL
 * decoding method to convert the policy back to plain JSON text. For example, if you use Java, you
 * can use the `decode` method of the `java.net.URLDecoder` utility class in
 * the Java SDK. Other languages and SDKs provide similar functionality, and some SDKs do this decoding
 * automatically.
 *
 * An IAM user can also have managed policies attached to it. To retrieve a managed
 * policy document that is attached to a user, use GetPolicy to determine the
 * policy's default version. Then use GetPolicyVersion to
 * retrieve the policy document.
 *
 * For more information about policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 */
export const getUserPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUserPolicyRequest,
  output: GetUserPolicyResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Lists the account alias associated with the Amazon Web Services account (Note: you can have only
 * one). For information about using an Amazon Web Services account alias, see Creating,
 * deleting, and listing an Amazon Web Services account alias in the
 * *IAM User Guide*.
 */
export const listAccountAliases = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAccountAliasesRequest,
  output: ListAccountAliasesResponse,
  errors: [ServiceFailureException],
}));
/**
 * Lists all managed policies that are attached to the specified IAM role.
 *
 * An IAM role can also have inline policies embedded with it. To list the inline
 * policies for a role, use ListRolePolicies.
 * For information about policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters. You can use the `PathPrefix` parameter to limit the list of
 * policies to only those matching the specified path prefix. If there are no policies
 * attached to the specified role (or none that match the specified path prefix), the
 * operation returns an empty list.
 */
export const listAttachedRolePolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAttachedRolePoliciesRequest,
    output: ListAttachedRolePoliciesResponse,
    errors: [
      InvalidInputException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Lists all managed policies that are attached to the specified IAM user.
 *
 * An IAM user can also have inline policies embedded with it. To list the inline
 * policies for a user, use ListUserPolicies.
 * For information about policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters. You can use the `PathPrefix` parameter to limit the list of
 * policies to only those matching the specified path prefix. If there are no policies
 * attached to the specified group (or none that match the specified path prefix), the
 * operation returns an empty list.
 */
export const listAttachedUserPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAttachedUserPoliciesRequest,
    output: ListAttachedUserPoliciesResponse,
    errors: [
      InvalidInputException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Lists delegation requests based on the specified criteria.
 *
 * If a delegation request has no owner, even if it is assigned to a specific account, it will not be part of the
 * `ListDelegationRequests` output for that account.
 *
 * For more details, see
 *
 * Managing Permissions for Delegation Requests.
 */
export const listDelegationRequests = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDelegationRequestsRequest,
    output: ListDelegationRequestsResponse,
    errors: [
      InvalidInputException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Lists the names of the inline policies that are embedded in the specified IAM
 * group.
 *
 * An IAM group can also have managed policies attached to it. To list the managed
 * policies that are attached to a group, use ListAttachedGroupPolicies. For more information about policies, see Managed
 * policies and inline policies in the
 * *IAM User Guide*.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters. If there are no inline policies embedded with the specified group, the
 * operation returns an empty list.
 */
export const listGroupPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListGroupPoliciesRequest,
  output: ListGroupPoliciesResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Lists the IAM groups that have the specified path prefix.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters.
 */
export const listGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListGroupsRequest,
  output: ListGroupsResponse,
  errors: [ServiceFailureException],
}));
/**
 * Lists the IAM groups that the specified IAM user belongs to.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters.
 */
export const listGroupsForUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListGroupsForUserRequest,
  output: ListGroupsForUserResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Lists the instance profiles that have the specified path prefix. If there are none,
 * the operation returns an empty list. For more information about instance profiles, see
 * Using
 * instance profiles in the *IAM User Guide*.
 *
 * IAM resource-listing operations return a subset of the available
 * attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view all of the information for an instance profile, see
 * GetInstanceProfile.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters.
 */
export const listInstanceProfiles = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListInstanceProfilesRequest,
    output: ListInstanceProfilesResponse,
    errors: [ServiceFailureException],
  }),
);
/**
 * Lists the instance profiles that have the specified associated IAM role. If there
 * are none, the operation returns an empty list. For more information about instance
 * profiles, go to Using
 * instance profiles in the *IAM User Guide*.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters.
 */
export const listInstanceProfilesForRole = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListInstanceProfilesForRoleRequest,
    output: ListInstanceProfilesForRoleResponse,
    errors: [NoSuchEntityException, ServiceFailureException],
  }),
);
/**
 * Lists the tags that are attached to the specified IAM instance profile. The returned list of tags is sorted by tag key.
 * For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const listInstanceProfileTags = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListInstanceProfileTagsRequest,
    output: ListInstanceProfileTagsResponse,
    errors: [NoSuchEntityException, ServiceFailureException],
  }),
);
/**
 * Lists the tags that are attached to the specified IAM virtual multi-factor authentication (MFA) device. The returned list of tags is
 * sorted by tag key. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const listMFADeviceTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMFADeviceTagsRequest,
  output: ListMFADeviceTagsResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Lists information about the IAM OpenID Connect (OIDC) provider resource objects
 * defined in the Amazon Web Services account.
 *
 * IAM resource-listing operations return a subset of the available
 * attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view all of the information for an OIDC provider, see GetOpenIDConnectProvider.
 */
export const listOpenIDConnectProviders = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListOpenIDConnectProvidersRequest,
    output: ListOpenIDConnectProvidersResponse,
    errors: [ServiceFailureException],
  }),
);
/**
 * Lists the tags that are attached to the specified OpenID Connect (OIDC)-compatible
 * identity provider. The returned list of tags is sorted by tag key. For more information, see About web identity
 * federation.
 *
 * For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const listOpenIDConnectProviderTags =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListOpenIDConnectProviderTagsRequest,
    output: ListOpenIDConnectProviderTagsResponse,
    errors: [
      InvalidInputException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }));
/**
 * Lists the centralized root access features enabled for your organization. For more
 * information, see Centrally manage root access for member accounts.
 */
export const listOrganizationsFeatures = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListOrganizationsFeaturesRequest,
    output: ListOrganizationsFeaturesResponse,
    errors: [
      AccountNotManagementOrDelegatedAdministratorException,
      OrganizationNotFoundException,
      OrganizationNotInAllFeaturesModeException,
      ServiceAccessNotEnabledException,
    ],
  }),
);
/**
 * Lists all the managed policies that are available in your Amazon Web Services account, including
 * your own customer-defined managed policies and all Amazon Web Services managed policies.
 *
 * You can filter the list of policies that is returned using the optional
 * `OnlyAttached`, `Scope`, and `PathPrefix`
 * parameters. For example, to list only the customer managed policies in your Amazon Web Services
 * account, set `Scope` to `Local`. To list only Amazon Web Services managed
 * policies, set `Scope` to `AWS`.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters.
 *
 * For more information about managed policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 *
 * IAM resource-listing operations return a subset of the available
 * attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view all of the information for a customer manged policy, see
 * GetPolicy.
 */
export const listPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPoliciesRequest,
  output: ListPoliciesResponse,
  errors: [ServiceFailureException],
}));
/**
 * Lists the tags that are attached to the specified IAM customer managed policy.
 * The returned list of tags is sorted by tag key. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const listPolicyTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPolicyTagsRequest,
  output: ListPolicyTagsResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Lists information about the versions of the specified managed policy, including the
 * version that is currently set as the policy's default version.
 *
 * For more information about managed policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 */
export const listPolicyVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPolicyVersionsRequest,
  output: ListPolicyVersionsResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Lists the names of the inline policies that are embedded in the specified IAM
 * role.
 *
 * An IAM role can also have managed policies attached to it. To list the managed
 * policies that are attached to a role, use ListAttachedRolePolicies. For more information about policies, see Managed
 * policies and inline policies in the
 * *IAM User Guide*.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters. If there are no inline policies embedded with the specified role, the
 * operation returns an empty list.
 */
export const listRolePolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRolePoliciesRequest,
  output: ListRolePoliciesResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Lists the IAM roles that have the specified path prefix. If there are none, the
 * operation returns an empty list. For more information about roles, see IAM roles in the
 * *IAM User Guide*.
 *
 * IAM resource-listing operations return a subset of the available
 * attributes for the resource. This operation does not return the following attributes, even though they are an attribute of the returned object:
 *
 * - PermissionsBoundary
 *
 * - RoleLastUsed
 *
 * - Tags
 *
 * To view all of the information for a role, see GetRole.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters.
 */
export const listRoles = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRolesRequest,
  output: ListRolesResponse,
  errors: [ServiceFailureException],
}));
/**
 * Lists the tags that are attached to the specified role. The returned list of tags is
 * sorted by tag key. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const listRoleTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRoleTagsRequest,
  output: ListRoleTagsResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Lists the SAML provider resource objects defined in IAM in the account.
 * IAM resource-listing operations return a subset of the available
 * attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view all of the information for a SAML provider, see GetSAMLProvider.
 *
 * This operation requires Signature Version 4.
 */
export const listSAMLProviders = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSAMLProvidersRequest,
  output: ListSAMLProvidersResponse,
  errors: [ServiceFailureException],
}));
/**
 * Lists the tags that are attached to the specified Security Assertion Markup Language
 * (SAML) identity provider. The returned list of tags is sorted by tag key. For more information, see About SAML 2.0-based
 * federation.
 *
 * For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const listSAMLProviderTags = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSAMLProviderTagsRequest,
    output: ListSAMLProviderTagsResponse,
    errors: [
      InvalidInputException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Lists the tags that are attached to the specified IAM server certificate. The
 * returned list of tags is sorted by tag key. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 *
 * For certificates in a Region supported by Certificate Manager (ACM), we
 * recommend that you don't use IAM server certificates. Instead, use ACM to provision,
 * manage, and deploy your server certificates. For more information about IAM server
 * certificates, Working with server
 * certificates in the *IAM User Guide*.
 */
export const listServerCertificateTags = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListServerCertificateTagsRequest,
    output: ListServerCertificateTagsResponse,
    errors: [NoSuchEntityException, ServiceFailureException],
  }),
);
/**
 * Lists the names of the inline policies embedded in the specified IAM user.
 *
 * An IAM user can also have managed policies attached to it. To list the managed
 * policies that are attached to a user, use ListAttachedUserPolicies. For more information about policies, see Managed
 * policies and inline policies in the
 * *IAM User Guide*.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters. If there are no inline policies embedded with the specified user, the
 * operation returns an empty list.
 */
export const listUserPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListUserPoliciesRequest,
  output: ListUserPoliciesResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Lists the IAM users that have the specified path prefix. If no path prefix is
 * specified, the operation returns all users in the Amazon Web Services account. If there are none, the
 * operation returns an empty list.
 *
 * IAM resource-listing operations return a subset of the available
 * attributes for the resource. This operation does not return the following attributes, even though they are an attribute of the returned object:
 *
 * - PermissionsBoundary
 *
 * - Tags
 *
 * To view all of the information for a user, see GetUser.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters.
 */
export const listUsers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListUsersRequest,
  output: ListUsersResponse,
  errors: [ServiceFailureException],
}));
/**
 * Lists the tags that are attached to the specified IAM user. The returned list of tags is sorted by tag key. For more information about tagging, see Tagging IAM resources in the
 * *IAM User Guide*.
 */
export const listUserTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListUserTagsRequest,
  output: ListUserTagsResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Lists the virtual MFA devices defined in the Amazon Web Services account by assignment status. If
 * you do not specify an assignment status, the operation returns a list of all virtual MFA
 * devices. Assignment status can be `Assigned`, `Unassigned`, or
 * `Any`.
 *
 * IAM resource-listing operations return a subset of the available
 * attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view tag information for a virtual MFA device, see ListMFADeviceTags.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters.
 */
export const listVirtualMFADevices = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListVirtualMFADevicesRequest,
    output: ListVirtualMFADevicesResponse,
    errors: [],
  }),
);
/**
 * Adds or updates an inline policy document that is embedded in the specified IAM
 * group.
 *
 * A user can also have managed policies attached to it. To attach a managed policy to a
 * group, use
 * `AttachGroupPolicy`
 * . To create a new managed policy, use
 *
 * `CreatePolicy`
 * . For information about policies, see Managed
 * policies and inline policies in the
 * *IAM User Guide*.
 *
 * For information about the maximum number of inline policies that you can embed in a
 * group, see IAM and STS quotas in the *IAM User Guide*.
 *
 * Because policy documents can be large, you should use POST rather than GET when
 * calling `PutGroupPolicy`. For general information about using the Query
 * API with IAM, see Making query requests in the
 * *IAM User Guide*.
 */
export const putGroupPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutGroupPolicyRequest,
  output: PutGroupPolicyResponse,
  errors: [
    LimitExceededException,
    MalformedPolicyDocumentException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Resets the password for a service-specific credential. The new password is Amazon Web Services
 * generated and cryptographically strong. It cannot be configured by the user. Resetting
 * the password immediately invalidates the previous password associated with this
 * user.
 */
export const resetServiceSpecificCredential =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ResetServiceSpecificCredentialRequest,
    output: ResetServiceSpecificCredentialResponse,
    errors: [NoSuchEntityException],
  }));
/**
 * Changes the password for the specified IAM user. You can use the CLI, the Amazon Web Services
 * API, or the **Users** page in the IAM console to change
 * the password for any IAM user. Use ChangePassword to
 * change your own password in the **My Security Credentials**
 * page in the Amazon Web Services Management Console.
 *
 * For more information about modifying passwords, see Managing passwords in the
 * *IAM User Guide*.
 */
export const updateLoginProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLoginProfileRequest,
  output: UpdateLoginProfileResponse,
  errors: [
    EntityTemporarilyUnmodifiableException,
    LimitExceededException,
    NoSuchEntityException,
    PasswordPolicyViolationException,
    ServiceFailureException,
  ],
}));
/**
 * Use UpdateRole instead.
 *
 * Modifies only the description of a role. This operation performs the same function as
 * the `Description` parameter in the `UpdateRole` operation.
 */
export const updateRoleDescription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateRoleDescriptionRequest,
    output: UpdateRoleDescriptionResponse,
    errors: [
      NoSuchEntityException,
      ServiceFailureException,
      UnmodifiableEntityException,
    ],
  }),
);
/**
 * Updates the metadata document, SAML encryption settings, and private keys for an
 * existing SAML provider. To rotate private keys, add your new private key and then remove
 * the old key in a separate request.
 */
export const updateSAMLProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSAMLProviderRequest,
  output: UpdateSAMLProviderResponse,
  errors: [
    ConcurrentModificationException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Changes the password of the IAM user who is calling this operation. This operation
 * can be performed using the CLI, the Amazon Web Services API, or the My
 * Security Credentials page in the Amazon Web Services Management Console. The Amazon Web Services account root user password is
 * not affected by this operation.
 *
 * Use UpdateLoginProfile
 * to use the CLI, the Amazon Web Services API, or the **Users** page in
 * the IAM console to change the password for any IAM user. For more information about
 * modifying passwords, see Managing passwords in the
 * *IAM User Guide*.
 */
export const changePassword = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ChangePasswordRequest,
  output: ChangePasswordResponse,
  errors: [
    EntityTemporarilyUnmodifiableException,
    InvalidUserTypeException,
    LimitExceededException,
    NoSuchEntityException,
    PasswordPolicyViolationException,
    ServiceFailureException,
  ],
}));
/**
 * Creates a new Amazon Web Services secret access key and corresponding Amazon Web Services access key ID for the
 * specified user. The default status for new keys is `Active`.
 *
 * If you do not specify a user name, IAM determines the user name implicitly based on
 * the Amazon Web Services access key ID signing the request. This operation works for access keys under
 * the Amazon Web Services account. Consequently, you can use this operation to manage Amazon Web Services account root
 * user credentials. This is true even if the Amazon Web Services account has no associated users.
 *
 * For information about quotas on the number of keys you can create, see IAM and STS
 * quotas in the *IAM User Guide*.
 *
 * To ensure the security of your Amazon Web Services account, the secret access key is accessible
 * only during key and user creation. You must save the key (for example, in a text
 * file) if you want to be able to access it again. If a secret key is lost, you can
 * delete the access keys for the associated user and then create new keys.
 */
export const createAccessKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessKeyRequest,
  output: CreateAccessKeyResponse,
  errors: [
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Creates a new group.
 *
 * For information about the number of groups you can create, see IAM and STS
 * quotas in the *IAM User Guide*.
 */
export const createGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGroupRequest,
  output: CreateGroupResponse,
  errors: [
    EntityAlreadyExistsException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Creates a new instance profile. For information about instance profiles, see Using
 * roles for applications on Amazon EC2 in the
 * *IAM User Guide*, and Instance profiles in the *Amazon EC2 User Guide*.
 *
 * For information about the number of instance profiles you can create, see IAM object
 * quotas in the *IAM User Guide*.
 */
export const createInstanceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateInstanceProfileRequest,
    output: CreateInstanceProfileResponse,
    errors: [
      ConcurrentModificationException,
      EntityAlreadyExistsException,
      InvalidInputException,
      LimitExceededException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Creates a password for the specified IAM user. A password allows an IAM user to
 * access Amazon Web Services services through the Amazon Web Services Management Console.
 *
 * You can use the CLI, the Amazon Web Services API, or the **Users**
 * page in the IAM console to create a password for any IAM user. Use ChangePassword to update your own existing password in the **My Security Credentials** page in the Amazon Web Services Management Console.
 *
 * For more information about managing passwords, see Managing passwords in the
 * *IAM User Guide*.
 */
export const createLoginProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLoginProfileRequest,
  output: CreateLoginProfileResponse,
  errors: [
    EntityAlreadyExistsException,
    LimitExceededException,
    NoSuchEntityException,
    PasswordPolicyViolationException,
    ServiceFailureException,
  ],
}));
/**
 * Creates an IAM entity to describe an identity provider (IdP) that supports OpenID Connect (OIDC).
 *
 * The OIDC provider that you create with this operation can be used as a principal in a
 * role's trust policy. Such a policy establishes a trust relationship between Amazon Web Services and
 * the OIDC provider.
 *
 * If you are using an OIDC identity provider from Google, Facebook, or Amazon Cognito, you don't
 * need to create a separate IAM identity provider. These OIDC identity providers are
 * already built-in to Amazon Web Services and are available for your use. Instead, you can move directly
 * to creating new roles using your identity provider. To learn more, see Creating
 * a role for web identity or OpenID connect federation in the IAM
 * User Guide.
 *
 * When you create the IAM OIDC provider, you specify the following:
 *
 * - The URL of the OIDC identity provider (IdP) to trust
 *
 * - A list of client IDs (also known as audiences) that identify the application
 * or applications allowed to authenticate using the OIDC provider
 *
 * - A list of tags that are attached to the specified IAM OIDC provider
 *
 * - A list of thumbprints of one or more server certificates that the IdP
 * uses
 *
 * You get all of this information from the OIDC IdP you want to use to access
 * Amazon Web Services.
 *
 * Amazon Web Services secures communication with OIDC identity providers (IdPs) using our library of
 * trusted root certificate authorities (CAs) to verify the JSON Web Key Set (JWKS)
 * endpoint's TLS certificate. If your OIDC IdP relies on a certificate that is not signed
 * by one of these trusted CAs, only then we secure communication using the thumbprints set
 * in the IdP's configuration.
 *
 * The trust for the OIDC provider is derived from the IAM provider that this
 * operation creates. Therefore, it is best to limit access to the CreateOpenIDConnectProvider operation to highly privileged
 * users.
 */
export const createOpenIDConnectProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateOpenIDConnectProviderRequest,
    output: CreateOpenIDConnectProviderResponse,
    errors: [
      ConcurrentModificationException,
      EntityAlreadyExistsException,
      InvalidInputException,
      LimitExceededException,
      OpenIdIdpCommunicationErrorException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Creates a new managed policy for your Amazon Web Services account.
 *
 * This operation creates a policy version with a version identifier of `v1`
 * and sets v1 as the policy's default version. For more information about policy versions,
 * see Versioning for managed policies in the
 * *IAM User Guide*.
 *
 * As a best practice, you can validate your IAM policies.
 * To learn more, see Validating IAM policies
 * in the *IAM User Guide*.
 *
 * For more information about managed policies in general, see Managed
 * policies and inline policies in the
 * *IAM User Guide*.
 */
export const createPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePolicyRequest,
  output: CreatePolicyResponse,
  errors: [
    ConcurrentModificationException,
    EntityAlreadyExistsException,
    InvalidInputException,
    LimitExceededException,
    MalformedPolicyDocumentException,
    ServiceFailureException,
  ],
}));
/**
 * Creates a new version of the specified managed policy. To update a managed policy, you
 * create a new policy version. A managed policy can have up to five versions. If the
 * policy has five versions, you must delete an existing version using DeletePolicyVersion before you create a new version.
 *
 * Optionally, you can set the new version as the policy's default version. The default
 * version is the version that is in effect for the IAM users, groups, and roles to which
 * the policy is attached.
 *
 * For more information about managed policy versions, see Versioning for managed
 * policies in the *IAM User Guide*.
 */
export const createPolicyVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePolicyVersionRequest,
  output: CreatePolicyVersionResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    MalformedPolicyDocumentException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Creates a new IAM user for your Amazon Web Services account.
 *
 * For information about quotas for the number of IAM users you can create, see IAM and STS
 * quotas in the *IAM User Guide*.
 */
export const createUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserRequest,
  output: CreateUserResponse,
  errors: [
    ConcurrentModificationException,
    EntityAlreadyExistsException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Creates a new virtual MFA device for the Amazon Web Services account. After creating the virtual
 * MFA, use EnableMFADevice to
 * attach the MFA device to an IAM user. For more information about creating and working
 * with virtual MFA devices, see Using a virtual MFA device in the
 * *IAM User Guide*.
 *
 * For information about the maximum number of MFA devices you can create, see IAM and STS
 * quotas in the *IAM User Guide*.
 *
 * The seed information contained in the QR code and the Base32 string should be
 * treated like any other secret access information. In other words, protect the seed
 * information as you would your Amazon Web Services access keys or your passwords. After you
 * provision your virtual device, you should ensure that the information is destroyed
 * following secure procedures.
 */
export const createVirtualMFADevice = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateVirtualMFADeviceRequest,
    output: CreateVirtualMFADeviceResponse,
    errors: [
      ConcurrentModificationException,
      EntityAlreadyExistsException,
      InvalidInputException,
      LimitExceededException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Generates a report for service last accessed data for Organizations. You can generate a
 * report for any entities (organization root, organizational unit, or account) or policies
 * in your organization.
 *
 * To call this operation, you must be signed in using your Organizations management account
 * credentials. You can use your long-term IAM user or root user credentials, or temporary
 * credentials from assuming an IAM role. SCPs must be enabled for your organization
 * root. You must have the required IAM and Organizations permissions. For more information, see
 * Refining permissions using service last accessed data in the
 * *IAM User Guide*.
 *
 * You can generate a service last accessed data report for entities by specifying only
 * the entity's path. This data includes a list of services that are allowed by any service
 * control policies (SCPs) that apply to the entity.
 *
 * You can generate a service last accessed data report for a policy by specifying an
 * entity's path and an optional Organizations policy ID. This data includes a list of services that
 * are allowed by the specified SCP.
 *
 * For each service in both report types, the data includes the most recent account
 * activity that the policy allows to account principals in the entity or the entity's
 * children. For important information about the data, reporting period, permissions
 * required, troubleshooting, and supported Regions see Reducing permissions using
 * service last accessed data in the
 * *IAM User Guide*.
 *
 * The data includes all attempts to access Amazon Web Services, not just the successful ones. This
 * includes all attempts that were made using the Amazon Web Services Management Console, the Amazon Web Services API through any
 * of the SDKs, or any of the command line tools. An unexpected entry in the service
 * last accessed data does not mean that an account has been compromised, because the
 * request might have been denied. Refer to your CloudTrail logs as the authoritative
 * source for information about all API calls and whether they were successful or
 * denied access. For more information, see Logging IAM events with
 * CloudTrail in the *IAM User Guide*.
 *
 * This operation returns a `JobId`. Use this parameter in the
 * GetOrganizationsAccessReport
 * operation to check the status of
 * the report generation. To check the status of this request, use the `JobId`
 * parameter in the
 * GetOrganizationsAccessReport
 * operation and test the
 * `JobStatus` response parameter. When the job is complete, you can
 * retrieve the report.
 *
 * To generate a service last accessed data report for entities, specify an entity path
 * without specifying the optional Organizations policy ID. The type of entity that you specify
 * determines the data returned in the report.
 *
 * - **Root** – When you specify the
 * organizations root as the entity, the resulting report lists all of the services
 * allowed by SCPs that are attached to your root. For each service, the report
 * includes data for all accounts in your organization except the
 * management account, because the management account is not limited by SCPs.
 *
 * - **OU** – When you specify an
 * organizational unit (OU) as the entity, the resulting report lists all of the
 * services allowed by SCPs that are attached to the OU and its parents. For each
 * service, the report includes data for all accounts in the OU or its children.
 * This data excludes the management account, because the management account is not
 * limited by SCPs.
 *
 * - **management account** – When you specify the
 * management account, the resulting report lists all Amazon Web Services services, because the
 * management account is not limited by SCPs. For each service, the report includes
 * data for only the management account.
 *
 * - **Account** – When you specify another
 * account as the entity, the resulting report lists all of the services allowed by
 * SCPs that are attached to the account and its parents. For each service, the
 * report includes data for only the specified account.
 *
 * To generate a service last accessed data report for policies, specify an entity path
 * and the optional Organizations policy ID. The type of entity that you specify determines the data
 * returned for each service.
 *
 * - **Root** – When you specify the root
 * entity and a policy ID, the resulting report lists all of the services that are
 * allowed by the specified SCP. For each service, the report includes data for all
 * accounts in your organization to which the SCP applies. This data excludes the
 * management account, because the management account is not limited by SCPs. If the
 * SCP is not attached to any entities in the organization, then the report will
 * return a list of services with no data.
 *
 * - **OU** – When you specify an OU entity and
 * a policy ID, the resulting report lists all of the services that are allowed by
 * the specified SCP. For each service, the report includes data for all accounts
 * in the OU or its children to which the SCP applies. This means that other
 * accounts outside the OU that are affected by the SCP might not be included in
 * the data. This data excludes the management account, because the
 * management account is not limited by SCPs. If the SCP is not attached to the OU
 * or one of its children, the report will return a list of services with no
 * data.
 *
 * - **management account** – When you specify the
 * management account, the resulting report lists all Amazon Web Services services, because the
 * management account is not limited by SCPs. If you specify a policy ID in the CLI
 * or API, the policy is ignored. For each service, the report includes data for
 * only the management account.
 *
 * - **Account** – When you specify another
 * account entity and a policy ID, the resulting report lists all of the services
 * that are allowed by the specified SCP. For each service, the report includes
 * data for only the specified account. This means that other accounts in the
 * organization that are affected by the SCP might not be included in the data. If
 * the SCP is not attached to the account, the report will return a list of
 * services with no data.
 *
 * Service last accessed data does not use other policy types when determining
 * whether a principal could access a service. These other policy types include
 * identity-based policies, resource-based policies, access control lists, IAM
 * permissions boundaries, and STS assume role policies. It only applies SCP logic.
 * For more about the evaluation of policy types, see Evaluating policies in the
 * *IAM User Guide*.
 *
 * For more information about service last accessed data, see Reducing policy scope by
 * viewing user activity in the *IAM User Guide*.
 */
export const generateOrganizationsAccessReport =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GenerateOrganizationsAccessReportRequest,
    output: GenerateOrganizationsAccessReportResponse,
    errors: [ReportGenerationLimitExceededException],
  }));
/**
 * Retrieves information about when the specified access key was last used. The
 * information includes the date and time of last use, along with the Amazon Web Services service and
 * Region that were specified in the last request made with that key.
 */
export const getAccessKeyLastUsed = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAccessKeyLastUsedRequest,
    output: GetAccessKeyLastUsedResponse,
    errors: [],
  }),
);
/**
 * Retrieves information about a specific delegation request.
 *
 * If a delegation request has no owner or owner account, `GetDelegationRequest` for that delegation request can be called by any account.
 * If the owner account is assigned but there is
 * no owner id, only identities within that owner account can call `GetDelegationRequest`
 * for the delegation request. Once the delegation request is fully owned, the owner of the request gets
 * a default permission to get that delegation request. For more details, see
 *
 * Managing Permissions for Delegation Requests.
 */
export const getDelegationRequest = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDelegationRequestRequest,
    output: GetDelegationRequestResponse,
    errors: [NoSuchEntityException, ServiceFailureException],
  }),
);
/**
 * Retrieves information about the specified instance profile, including the instance
 * profile's path, GUID, ARN, and role. For more information about instance profiles, see
 * Using
 * instance profiles in the *IAM User Guide*.
 */
export const getInstanceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInstanceProfileRequest,
  output: GetInstanceProfileResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Retrieves information about an MFA device for a specified user.
 */
export const getMFADevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMFADeviceRequest,
  output: GetMFADeviceResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Retrieves the service last accessed data report for Organizations that was previously
 * generated using the
 * GenerateOrganizationsAccessReport
 * operation. This operation
 * retrieves the status of your report job and the report contents.
 *
 * Depending on the parameters that you passed when you generated the report, the data
 * returned could include different information. For details, see GenerateOrganizationsAccessReport.
 *
 * To call this operation, you must be signed in to the management account in your
 * organization. SCPs must be enabled for your organization root. You must have permissions
 * to perform this operation. For more information, see Refining permissions using
 * service last accessed data in the
 * *IAM User Guide*.
 *
 * For each service that principals in an account (root user, IAM users, or IAM roles)
 * could access using SCPs, the operation returns details about the most recent access
 * attempt. If there was no attempt, the service is listed without details about the most
 * recent attempt to access the service. If the operation fails, it returns the reason that
 * it failed.
 *
 * By default, the list is sorted by service namespace.
 */
export const getOrganizationsAccessReport =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetOrganizationsAccessReportRequest,
    output: GetOrganizationsAccessReportResponse,
    errors: [NoSuchEntityException],
  }));
/**
 * Returns the SAML provider metadocument that was uploaded when the IAM SAML provider
 * resource object was created or updated.
 *
 * This operation requires Signature Version 4.
 */
export const getSAMLProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSAMLProviderRequest,
  output: GetSAMLProviderResponse,
  errors: [
    InvalidInputException,
    NoSuchEntityException,
    ServiceFailureException,
  ],
}));
/**
 * Retrieves information about the specified server certificate stored in IAM.
 *
 * For more information about working with server certificates, see Working
 * with server certificates in the *IAM User Guide*. This
 * topic includes a list of Amazon Web Services services that can use the server certificates that you
 * manage with IAM.
 */
export const getServerCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetServerCertificateRequest,
    output: GetServerCertificateResponse,
    errors: [NoSuchEntityException, ServiceFailureException],
  }),
);
/**
 * Returns information about the access key IDs associated with the specified IAM user.
 * If there is none, the operation returns an empty list.
 *
 * Although each user is limited to a small number of keys, you can still paginate the
 * results using the `MaxItems` and `Marker` parameters.
 *
 * If the `UserName` is not specified, the user name is determined implicitly
 * based on the Amazon Web Services access key ID used to sign the request. If a temporary access key is
 * used, then `UserName` is required. If a long-term key is assigned to the
 * user, then `UserName` is not required.
 *
 * This operation works for access keys under the Amazon Web Services account. If the Amazon Web Services account has
 * no associated users, the root user returns it's own access key IDs by running this
 * command.
 *
 * To ensure the security of your Amazon Web Services account, the secret access key is accessible
 * only during key and user creation.
 */
export const listAccessKeys = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAccessKeysRequest,
  output: ListAccessKeysResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Lists all managed policies that are attached to the specified IAM group.
 *
 * An IAM group can also have inline policies embedded with it. To list the inline
 * policies for a group, use ListGroupPolicies.
 * For information about policies, see Managed policies and inline
 * policies in the *IAM User Guide*.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters. You can use the `PathPrefix` parameter to limit the list of
 * policies to only those matching the specified path prefix. If there are no policies
 * attached to the specified group (or none that match the specified path prefix), the
 * operation returns an empty list.
 */
export const listAttachedGroupPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAttachedGroupPoliciesRequest,
    output: ListAttachedGroupPoliciesResponse,
    errors: [
      InvalidInputException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Lists all IAM users, groups, and roles that the specified managed policy is attached
 * to.
 *
 * You can use the optional `EntityFilter` parameter to limit the results to a
 * particular type of entity (users, groups, or roles). For example, to list only the roles
 * that are attached to the specified policy, set `EntityFilter` to
 * `Role`.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters.
 */
export const listEntitiesForPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListEntitiesForPolicyRequest,
    output: ListEntitiesForPolicyResponse,
    errors: [
      InvalidInputException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Lists the MFA devices for an IAM user. If the request includes a IAM user name,
 * then this operation lists all the MFA devices associated with the specified user. If you
 * do not specify a user name, IAM determines the user name implicitly based on the Amazon Web Services
 * access key ID signing the request for this operation.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters.
 */
export const listMFADevices = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMFADevicesRequest,
  output: ListMFADevicesResponse,
  errors: [NoSuchEntityException, ServiceFailureException],
}));
/**
 * Lists the server certificates stored in IAM that have the specified path prefix. If
 * none exist, the operation returns an empty list.
 *
 * You can paginate the results using the `MaxItems` and `Marker`
 * parameters.
 *
 * For more information about working with server certificates, see Working
 * with server certificates in the *IAM User Guide*. This
 * topic also includes a list of Amazon Web Services services that can use the server certificates that
 * you manage with IAM.
 *
 * IAM resource-listing operations return a subset of the available
 * attributes for the resource. For example, this operation does not return tags, even though they are an attribute of the returned object. To view all of the information for a servercertificate, see
 * GetServerCertificate.
 */
export const listServerCertificates = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListServerCertificatesRequest,
    output: ListServerCertificatesResponse,
    errors: [ServiceFailureException],
  }),
);
/**
 * Returns information about the service-specific credentials associated with the
 * specified IAM user. If none exists, the operation returns an empty list. The
 * service-specific credentials returned by this operation are used only for authenticating
 * the IAM user to a specific service. For more information about using service-specific
 * credentials to authenticate to an Amazon Web Services service, see Set up service-specific credentials
 * in the CodeCommit User Guide.
 */
export const listServiceSpecificCredentials =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListServiceSpecificCredentialsRequest,
    output: ListServiceSpecificCredentialsResponse,
    errors: [NoSuchEntityException, ServiceNotSupportedException],
  }));
/**
 * Returns information about the signing certificates associated with the specified IAM
 * user. If none exists, the operation returns an empty list.
 *
 * Although each user is limited to a small number of signing certificates, you can still
 * paginate the results using the `MaxItems` and `Marker`
 * parameters.
 *
 * If the `UserName` field is not specified, the user name is determined
 * implicitly based on the Amazon Web Services access key ID used to sign the request for this operation.
 * This operation works for access keys under the Amazon Web Services account. Consequently, you can use
 * this operation to manage Amazon Web Services account root user credentials even if the Amazon Web Services account has no
 * associated users.
 */
export const listSigningCertificates = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSigningCertificatesRequest,
    output: ListSigningCertificatesResponse,
    errors: [NoSuchEntityException, ServiceFailureException],
  }),
);
/**
 * Returns information about the SSH public keys associated with the specified IAM
 * user. If none exists, the operation returns an empty list.
 *
 * The SSH public keys returned by this operation are used only for authenticating the
 * IAM user to an CodeCommit repository. For more information about using SSH keys to
 * authenticate to an CodeCommit repository, see Set up CodeCommit for
 * SSH connections in the *CodeCommit User Guide*.
 *
 * Although each user is limited to a small number of keys, you can still paginate the
 * results using the `MaxItems` and `Marker` parameters.
 */
export const listSSHPublicKeys = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSSHPublicKeysRequest,
  output: ListSSHPublicKeysResponse,
  errors: [NoSuchEntityException],
}));
/**
 * Simulate how a set of IAM policies and optionally a resource-based policy works with
 * a list of API operations and Amazon Web Services resources to determine the policies' effective
 * permissions. The policies are provided as strings.
 *
 * The simulation does not perform the API operations; it only checks the authorization
 * to determine if the simulated policies allow or deny the operations. You can simulate
 * resources that don't exist in your account.
 *
 * If you want to simulate existing policies that are attached to an IAM user, group,
 * or role, use SimulatePrincipalPolicy instead.
 *
 * Context keys are variables that are maintained by Amazon Web Services and its services and which
 * provide details about the context of an API query request. You can use the
 * `Condition` element of an IAM policy to evaluate context keys. To get
 * the list of context keys that the policies require for correct simulation, use GetContextKeysForCustomPolicy.
 *
 * If the output is long, you can use `MaxItems` and `Marker`
 * parameters to paginate the results.
 *
 * The IAM policy simulator evaluates statements in the identity-based policy and
 * the inputs that you provide during simulation. The policy simulator results can
 * differ from your live Amazon Web Services environment. We recommend that you check your policies
 * against your live Amazon Web Services environment after testing using the policy simulator to
 * confirm that you have the desired results. For more information about using the
 * policy simulator, see Testing IAM
 * policies with the IAM policy simulator in the
 * *IAM User Guide*.
 */
export const simulateCustomPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SimulateCustomPolicyRequest,
    output: SimulatePolicyResponse,
    errors: [InvalidInputException, PolicyEvaluationException],
  }),
);
/**
 * Creates an IAM delegation request for temporary access delegation.
 *
 * This API is not available for general use. In order to use this API, a caller first need to
 * go through an onboarding process described in the
 * partner onboarding documentation.
 */
export const createDelegationRequest = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDelegationRequestRequest,
    output: CreateDelegationRequestResponse,
    errors: [
      ConcurrentModificationException,
      EntityAlreadyExistsException,
      InvalidInputException,
      LimitExceededException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Creates a new role for your Amazon Web Services account.
 *
 * For more information about roles, see IAM roles in the
 * *IAM User Guide*. For information about quotas for role names
 * and the number of roles you can create, see IAM and STS quotas in the
 * *IAM User Guide*.
 */
export const createRole = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRoleRequest,
  output: CreateRoleResponse,
  errors: [
    ConcurrentModificationException,
    EntityAlreadyExistsException,
    InvalidInputException,
    LimitExceededException,
    MalformedPolicyDocumentException,
    ServiceFailureException,
  ],
}));
/**
 * Generates a set of credentials consisting of a user name and password that can be used
 * to access the service specified in the request. These credentials are generated by
 * IAM, and can be used only for the specified service.
 *
 * You can have a maximum of two sets of service-specific credentials for each supported
 * service per user.
 *
 * You can create service-specific credentials for Amazon Bedrock, CodeCommit and Amazon Keyspaces (for Apache Cassandra).
 *
 * You can reset the password to a new service-generated value by calling ResetServiceSpecificCredential.
 *
 * For more information about service-specific credentials, see Service-specific credentials for IAM users in the
 * *IAM User Guide*.
 */
export const createServiceSpecificCredential =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateServiceSpecificCredentialRequest,
    output: CreateServiceSpecificCredentialResponse,
    errors: [
      LimitExceededException,
      NoSuchEntityException,
      ServiceNotSupportedException,
    ],
  }));
/**
 * Retrieves information about all IAM users, groups, roles, and policies in your Amazon Web Services
 * account, including their relationships to one another. Use this operation to obtain a
 * snapshot of the configuration of IAM permissions (users, groups, roles, and policies)
 * in your account.
 *
 * Policies returned by this operation are URL-encoded compliant
 * with RFC 3986. You can use a URL
 * decoding method to convert the policy back to plain JSON text. For example, if you use Java, you
 * can use the `decode` method of the `java.net.URLDecoder` utility class in
 * the Java SDK. Other languages and SDKs provide similar functionality, and some SDKs do this decoding
 * automatically.
 *
 * You can optionally filter the results using the `Filter` parameter. You can
 * paginate the results using the `MaxItems` and `Marker`
 * parameters.
 */
export const getAccountAuthorizationDetails =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetAccountAuthorizationDetailsRequest,
    output: GetAccountAuthorizationDetailsResponse,
    errors: [ServiceFailureException],
  }));
/**
 * Retrieves a credential report for the Amazon Web Services account. For more information about the
 * credential report, see Getting credential reports in
 * the *IAM User Guide*.
 */
export const getCredentialReport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCredentialReportRequest,
  output: GetCredentialReportResponse,
  errors: [
    CredentialReportExpiredException,
    CredentialReportNotPresentException,
    CredentialReportNotReadyException,
    ServiceFailureException,
  ],
}));
/**
 * Retrieves a service last accessed report that was created using the
 * `GenerateServiceLastAccessedDetails` operation. You can use the
 * `JobId` parameter in `GetServiceLastAccessedDetails` to
 * retrieve the status of your report job. When the report is complete, you can retrieve
 * the generated report. The report includes a list of Amazon Web Services services that the resource
 * (user, group, role, or managed policy) can access.
 *
 * Service last accessed data does not use other policy types when determining
 * whether a resource could access a service. These other policy types include
 * resource-based policies, access control lists, Organizations policies, IAM permissions
 * boundaries, and STS assume role policies. It only applies permissions policy
 * logic. For more about the evaluation of policy types, see Evaluating policies in the
 * *IAM User Guide*.
 *
 * For each service that the resource could access using permissions policies, the
 * operation returns details about the most recent access attempt. If there was no attempt,
 * the service is listed without details about the most recent attempt to access the
 * service. If the operation fails, the `GetServiceLastAccessedDetails`
 * operation returns the reason that it failed.
 *
 * The `GetServiceLastAccessedDetails` operation returns a list of services.
 * This list includes the number of entities that have attempted to access the service and
 * the date and time of the last attempt. It also returns the ARN of the following entity,
 * depending on the resource ARN that you used to generate the report:
 *
 * - **User** – Returns the user ARN that you
 * used to generate the report
 *
 * - **Group** – Returns the ARN of the group
 * member (user) that last attempted to access the service
 *
 * - **Role** – Returns the role ARN that you
 * used to generate the report
 *
 * - **Policy** – Returns the ARN of the user
 * or role that last used the policy to attempt to access the service
 *
 * By default, the list is sorted by service namespace.
 *
 * If you specified `ACTION_LEVEL` granularity when you generated the report,
 * this operation returns service and action last accessed data. This includes the most
 * recent access attempt for each tracked action within a service. Otherwise, this
 * operation returns only service data.
 *
 * For more information about service and action last accessed data, see Reducing permissions using service last accessed data in the
 * *IAM User Guide*.
 */
export const getServiceLastAccessedDetails =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetServiceLastAccessedDetailsRequest,
    output: GetServiceLastAccessedDetailsResponse,
    errors: [InvalidInputException, NoSuchEntityException],
  }));
/**
 * After you generate a group or policy report using the
 * `GenerateServiceLastAccessedDetails` operation, you can use the
 * `JobId` parameter in
 * `GetServiceLastAccessedDetailsWithEntities`. This operation retrieves the
 * status of your report job and a list of entities that could have used group or policy
 * permissions to access the specified service.
 *
 * - **Group** – For a group report, this
 * operation returns a list of users in the group that could have used the group’s
 * policies in an attempt to access the service.
 *
 * - **Policy** – For a policy report, this
 * operation returns a list of entities (users or roles) that could have used the
 * policy in an attempt to access the service.
 *
 * You can also use this operation for user or role reports to retrieve details about
 * those entities.
 *
 * If the operation fails, the `GetServiceLastAccessedDetailsWithEntities`
 * operation returns the reason that it failed.
 *
 * By default, the list of associated entities is sorted by date, with the most recent
 * access listed first.
 */
export const getServiceLastAccessedDetailsWithEntities =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetServiceLastAccessedDetailsWithEntitiesRequest,
    output: GetServiceLastAccessedDetailsWithEntitiesResponse,
    errors: [InvalidInputException, NoSuchEntityException],
  }));
/**
 * Retrieves the status of your service-linked role deletion. After you use DeleteServiceLinkedRole to submit a service-linked role for deletion, you
 * can use the `DeletionTaskId` parameter in
 * `GetServiceLinkedRoleDeletionStatus` to check the status of the deletion.
 * If the deletion fails, this operation returns the reason that it failed, if that
 * information is returned by the service.
 */
export const getServiceLinkedRoleDeletionStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetServiceLinkedRoleDeletionStatusRequest,
    output: GetServiceLinkedRoleDeletionStatusResponse,
    errors: [
      InvalidInputException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }));
/**
 * Retrieves the specified SSH public key, including metadata about the key.
 *
 * The SSH public key retrieved by this operation is used only for authenticating the
 * associated IAM user to an CodeCommit repository. For more information about using SSH keys
 * to authenticate to an CodeCommit repository, see Set up CodeCommit for SSH
 * connections in the *CodeCommit User Guide*.
 */
export const getSSHPublicKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSSHPublicKeyRequest,
  output: GetSSHPublicKeyResponse,
  errors: [NoSuchEntityException, UnrecognizedPublicKeyEncodingException],
}));
/**
 * Retrieves a list of policies that the IAM identity (user, group, or role) can use to
 * access each specified service.
 *
 * This operation does not use other policy types when determining whether a resource
 * could access a service. These other policy types include resource-based policies,
 * access control lists, Organizations policies, IAM permissions boundaries, and STS
 * assume role policies. It only applies permissions policy logic. For more about the
 * evaluation of policy types, see Evaluating policies in the
 * *IAM User Guide*.
 *
 * The list of policies returned by the operation depends on the ARN of the identity that
 * you provide.
 *
 * - **User** – The list of policies includes
 * the managed and inline policies that are attached to the user directly. The list
 * also includes any additional managed and inline policies that are attached to
 * the group to which the user belongs.
 *
 * - **Group** – The list of policies includes
 * only the managed and inline policies that are attached to the group directly.
 * Policies that are attached to the group’s user are not included.
 *
 * - **Role** – The list of policies includes
 * only the managed and inline policies that are attached to the role.
 *
 * For each managed policy, this operation returns the ARN and policy name. For each
 * inline policy, it returns the policy name and the entity to which it is attached. Inline
 * policies do not have an ARN. For more information about these policy types, see Managed policies and inline policies in the
 * *IAM User Guide*.
 *
 * Policies that are attached to users and roles as permissions boundaries are not
 * returned. To view which managed policy is currently used to set the permissions boundary
 * for a user or role, use the GetUser or GetRole
 * operations.
 */
export const listPoliciesGrantingServiceAccess =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListPoliciesGrantingServiceAccessRequest,
    output: ListPoliciesGrantingServiceAccessResponse,
    errors: [InvalidInputException, NoSuchEntityException],
  }));
/**
 * Uploads a server certificate entity for the Amazon Web Services account. The server certificate
 * entity includes a public key certificate, a private key, and an optional certificate
 * chain, which should all be PEM-encoded.
 *
 * We recommend that you use Certificate Manager to
 * provision, manage, and deploy your server certificates. With ACM you can request a
 * certificate, deploy it to Amazon Web Services resources, and let ACM handle certificate renewals for
 * you. Certificates provided by ACM are free. For more information about using ACM,
 * see the Certificate Manager User
 * Guide.
 *
 * For more information about working with server certificates, see Working
 * with server certificates in the *IAM User Guide*. This
 * topic includes a list of Amazon Web Services services that can use the server certificates that you
 * manage with IAM.
 *
 * For information about the number of server certificates you can upload, see IAM and STS
 * quotas in the *IAM User Guide*.
 *
 * Because the body of the public key certificate, private key, and the certificate
 * chain can be large, you should use POST rather than GET when calling
 * `UploadServerCertificate`. For information about setting up
 * signatures and authorization through the API, see Signing Amazon Web Services API
 * requests in the *Amazon Web Services General Reference*. For general
 * information about using the Query API with IAM, see Calling the API by making HTTP query
 * requests in the *IAM User Guide*.
 */
export const uploadServerCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UploadServerCertificateRequest,
    output: UploadServerCertificateResponse,
    errors: [
      ConcurrentModificationException,
      EntityAlreadyExistsException,
      InvalidInputException,
      KeyPairMismatchException,
      LimitExceededException,
      MalformedCertificateException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Uploads an X.509 signing certificate and associates it with the specified IAM user.
 * Some Amazon Web Services services require you to use certificates to validate requests that are signed
 * with a corresponding private key. When you upload the certificate, its default status is
 * `Active`.
 *
 * For information about when you would use an X.509 signing certificate, see Managing
 * server certificates in IAM in the
 * *IAM User Guide*.
 *
 * If the `UserName` is not specified, the IAM user name is determined
 * implicitly based on the Amazon Web Services access key ID used to sign the request. This operation
 * works for access keys under the Amazon Web Services account. Consequently, you can use this operation
 * to manage Amazon Web Services account root user credentials even if the Amazon Web Services account has no associated
 * users.
 *
 * Because the body of an X.509 certificate can be large, you should use POST rather
 * than GET when calling `UploadSigningCertificate`. For information about
 * setting up signatures and authorization through the API, see Signing
 * Amazon Web Services API requests in the *Amazon Web Services General Reference*. For
 * general information about using the Query API with IAM, see Making query
 * requests in the *IAM User Guide*.
 */
export const uploadSigningCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UploadSigningCertificateRequest,
    output: UploadSigningCertificateResponse,
    errors: [
      ConcurrentModificationException,
      DuplicateCertificateException,
      EntityAlreadyExistsException,
      InvalidCertificateException,
      LimitExceededException,
      MalformedCertificateException,
      NoSuchEntityException,
      ServiceFailureException,
    ],
  }),
);
/**
 * Uploads an SSH public key and associates it with the specified IAM user.
 *
 * The SSH public key uploaded by this operation can be used only for authenticating the
 * associated IAM user to an CodeCommit repository. For more information about using SSH keys
 * to authenticate to an CodeCommit repository, see Set up CodeCommit for
 * SSH connections in the *CodeCommit User Guide*.
 */
export const uploadSSHPublicKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UploadSSHPublicKeyRequest,
  output: UploadSSHPublicKeyResponse,
  errors: [
    DuplicateSSHPublicKeyException,
    InvalidPublicKeyException,
    LimitExceededException,
    NoSuchEntityException,
    UnrecognizedPublicKeyEncodingException,
  ],
}));
/**
 * Simulate how a set of IAM policies attached to an IAM entity works with a list of
 * API operations and Amazon Web Services resources to determine the policies' effective permissions. The
 * entity can be an IAM user, group, or role. If you specify a user, then the simulation
 * also includes all of the policies that are attached to groups that the user belongs to.
 * You can simulate resources that don't exist in your account.
 *
 * You can optionally include a list of one or more additional policies specified as
 * strings to include in the simulation. If you want to simulate only policies specified as
 * strings, use SimulateCustomPolicy instead.
 *
 * You can also optionally include one resource-based policy to be evaluated with each of
 * the resources included in the simulation for IAM users only.
 *
 * The simulation does not perform the API operations; it only checks the authorization
 * to determine if the simulated policies allow or deny the operations.
 *
 * **Note:** This operation discloses information about the
 * permissions granted to other users. If you do not want users to see other user's
 * permissions, then consider allowing them to use SimulateCustomPolicy instead.
 *
 * Context keys are variables maintained by Amazon Web Services and its services that provide details
 * about the context of an API query request. You can use the `Condition`
 * element of an IAM policy to evaluate context keys. To get the list of context keys
 * that the policies require for correct simulation, use GetContextKeysForPrincipalPolicy.
 *
 * If the output is long, you can use the `MaxItems` and `Marker`
 * parameters to paginate the results.
 *
 * The IAM policy simulator evaluates statements in the identity-based policy and
 * the inputs that you provide during simulation. The policy simulator results can
 * differ from your live Amazon Web Services environment. We recommend that you check your policies
 * against your live Amazon Web Services environment after testing using the policy simulator to
 * confirm that you have the desired results. For more information about using the
 * policy simulator, see Testing IAM
 * policies with the IAM policy simulator in the
 * *IAM User Guide*.
 */
export const simulatePrincipalPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SimulatePrincipalPolicyRequest,
    output: SimulatePolicyResponse,
    errors: [
      InvalidInputException,
      NoSuchEntityException,
      PolicyEvaluationException,
    ],
  }),
);
