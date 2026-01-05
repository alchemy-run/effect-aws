import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Pca Connector Ad",
  serviceShapeName: "PcaConnectorAd",
});
const auth = T.AwsAuthSigv4({ name: "pca-connector-ad" });
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
                                url: "https://pca-connector-ad-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://pca-connector-ad-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://pca-connector-ad.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://pca-connector-ad.{Region}.{PartitionResult#dnsSuffix}",
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
export const Tags = S.Record({ key: S.String, value: S.String });
export class CreateDirectoryRegistrationRequest extends S.Class<CreateDirectoryRegistrationRequest>(
  "CreateDirectoryRegistrationRequest",
)(
  {
    DirectoryId: S.String,
    ClientToken: S.optional(S.String),
    Tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/directoryRegistrations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDirectoryRegistrationRequest extends S.Class<GetDirectoryRegistrationRequest>(
  "GetDirectoryRegistrationRequest",
)(
  {
    DirectoryRegistrationArn: S.String.pipe(
      T.HttpLabel("DirectoryRegistrationArn"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/directoryRegistrations/{DirectoryRegistrationArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDirectoryRegistrationRequest extends S.Class<DeleteDirectoryRegistrationRequest>(
  "DeleteDirectoryRegistrationRequest",
)(
  {
    DirectoryRegistrationArn: S.String.pipe(
      T.HttpLabel("DirectoryRegistrationArn"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/directoryRegistrations/{DirectoryRegistrationArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDirectoryRegistrationResponse extends S.Class<DeleteDirectoryRegistrationResponse>(
  "DeleteDirectoryRegistrationResponse",
)({}) {}
export class ListDirectoryRegistrationsRequest extends S.Class<ListDirectoryRegistrationsRequest>(
  "ListDirectoryRegistrationsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/directoryRegistrations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateServicePrincipalNameRequest extends S.Class<CreateServicePrincipalNameRequest>(
  "CreateServicePrincipalNameRequest",
)(
  {
    DirectoryRegistrationArn: S.String.pipe(
      T.HttpLabel("DirectoryRegistrationArn"),
    ),
    ConnectorArn: S.String.pipe(T.HttpLabel("ConnectorArn")),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/directoryRegistrations/{DirectoryRegistrationArn}/servicePrincipalNames/{ConnectorArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateServicePrincipalNameResponse extends S.Class<CreateServicePrincipalNameResponse>(
  "CreateServicePrincipalNameResponse",
)({}) {}
export class GetServicePrincipalNameRequest extends S.Class<GetServicePrincipalNameRequest>(
  "GetServicePrincipalNameRequest",
)(
  {
    DirectoryRegistrationArn: S.String.pipe(
      T.HttpLabel("DirectoryRegistrationArn"),
    ),
    ConnectorArn: S.String.pipe(T.HttpLabel("ConnectorArn")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/directoryRegistrations/{DirectoryRegistrationArn}/servicePrincipalNames/{ConnectorArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteServicePrincipalNameRequest extends S.Class<DeleteServicePrincipalNameRequest>(
  "DeleteServicePrincipalNameRequest",
)(
  {
    DirectoryRegistrationArn: S.String.pipe(
      T.HttpLabel("DirectoryRegistrationArn"),
    ),
    ConnectorArn: S.String.pipe(T.HttpLabel("ConnectorArn")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/directoryRegistrations/{DirectoryRegistrationArn}/servicePrincipalNames/{ConnectorArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteServicePrincipalNameResponse extends S.Class<DeleteServicePrincipalNameResponse>(
  "DeleteServicePrincipalNameResponse",
)({}) {}
export class ListServicePrincipalNamesRequest extends S.Class<ListServicePrincipalNamesRequest>(
  "ListServicePrincipalNamesRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    DirectoryRegistrationArn: S.String.pipe(
      T.HttpLabel("DirectoryRegistrationArn"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/directoryRegistrations/{DirectoryRegistrationArn}/servicePrincipalNames",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTemplateGroupAccessControlEntryRequest extends S.Class<GetTemplateGroupAccessControlEntryRequest>(
  "GetTemplateGroupAccessControlEntryRequest",
)(
  {
    TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")),
    GroupSecurityIdentifier: S.String.pipe(
      T.HttpLabel("GroupSecurityIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/templates/{TemplateArn}/accessControlEntries/{GroupSecurityIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AccessRights extends S.Class<AccessRights>("AccessRights")({
  Enroll: S.optional(S.String),
  AutoEnroll: S.optional(S.String),
}) {}
export class UpdateTemplateGroupAccessControlEntryRequest extends S.Class<UpdateTemplateGroupAccessControlEntryRequest>(
  "UpdateTemplateGroupAccessControlEntryRequest",
)(
  {
    TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")),
    GroupSecurityIdentifier: S.String.pipe(
      T.HttpLabel("GroupSecurityIdentifier"),
    ),
    GroupDisplayName: S.optional(S.String),
    AccessRights: S.optional(AccessRights),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/templates/{TemplateArn}/accessControlEntries/{GroupSecurityIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTemplateGroupAccessControlEntryResponse extends S.Class<UpdateTemplateGroupAccessControlEntryResponse>(
  "UpdateTemplateGroupAccessControlEntryResponse",
)({}) {}
export class DeleteTemplateGroupAccessControlEntryRequest extends S.Class<DeleteTemplateGroupAccessControlEntryRequest>(
  "DeleteTemplateGroupAccessControlEntryRequest",
)(
  {
    TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")),
    GroupSecurityIdentifier: S.String.pipe(
      T.HttpLabel("GroupSecurityIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/templates/{TemplateArn}/accessControlEntries/{GroupSecurityIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTemplateGroupAccessControlEntryResponse extends S.Class<DeleteTemplateGroupAccessControlEntryResponse>(
  "DeleteTemplateGroupAccessControlEntryResponse",
)({}) {}
export class ListTemplateGroupAccessControlEntriesRequest extends S.Class<ListTemplateGroupAccessControlEntriesRequest>(
  "ListTemplateGroupAccessControlEntriesRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/templates/{TemplateArn}/accessControlEntries",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTemplateRequest extends S.Class<GetTemplateRequest>(
  "GetTemplateRequest",
)(
  { TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/templates/{TemplateArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ValidityPeriod extends S.Class<ValidityPeriod>("ValidityPeriod")({
  PeriodType: S.String,
  Period: S.Number,
}) {}
export class CertificateValidity extends S.Class<CertificateValidity>(
  "CertificateValidity",
)({ ValidityPeriod: ValidityPeriod, RenewalPeriod: ValidityPeriod }) {}
export const TemplateNameList = S.Array(S.String);
export const CryptoProvidersList = S.Array(S.String);
export class PrivateKeyAttributesV2 extends S.Class<PrivateKeyAttributesV2>(
  "PrivateKeyAttributesV2",
)({
  MinimalKeyLength: S.Number,
  KeySpec: S.String,
  CryptoProviders: S.optional(CryptoProvidersList),
}) {}
export class PrivateKeyFlagsV2 extends S.Class<PrivateKeyFlagsV2>(
  "PrivateKeyFlagsV2",
)({
  ExportableKey: S.optional(S.Boolean),
  StrongKeyProtectionRequired: S.optional(S.Boolean),
  ClientVersion: S.String,
}) {}
export class EnrollmentFlagsV2 extends S.Class<EnrollmentFlagsV2>(
  "EnrollmentFlagsV2",
)({
  IncludeSymmetricAlgorithms: S.optional(S.Boolean),
  UserInteractionRequired: S.optional(S.Boolean),
  RemoveInvalidCertificateFromPersonalStore: S.optional(S.Boolean),
  NoSecurityExtension: S.optional(S.Boolean),
  EnableKeyReuseOnNtTokenKeysetStorageFull: S.optional(S.Boolean),
}) {}
export class SubjectNameFlagsV2 extends S.Class<SubjectNameFlagsV2>(
  "SubjectNameFlagsV2",
)({
  SanRequireDomainDns: S.optional(S.Boolean),
  SanRequireSpn: S.optional(S.Boolean),
  SanRequireDirectoryGuid: S.optional(S.Boolean),
  SanRequireUpn: S.optional(S.Boolean),
  SanRequireEmail: S.optional(S.Boolean),
  SanRequireDns: S.optional(S.Boolean),
  RequireDnsAsCn: S.optional(S.Boolean),
  RequireEmail: S.optional(S.Boolean),
  RequireCommonName: S.optional(S.Boolean),
  RequireDirectoryPath: S.optional(S.Boolean),
}) {}
export class GeneralFlagsV2 extends S.Class<GeneralFlagsV2>("GeneralFlagsV2")({
  AutoEnrollment: S.optional(S.Boolean),
  MachineType: S.optional(S.Boolean),
}) {}
export class KeyUsageFlags extends S.Class<KeyUsageFlags>("KeyUsageFlags")({
  DigitalSignature: S.optional(S.Boolean),
  NonRepudiation: S.optional(S.Boolean),
  KeyEncipherment: S.optional(S.Boolean),
  DataEncipherment: S.optional(S.Boolean),
  KeyAgreement: S.optional(S.Boolean),
}) {}
export class KeyUsage extends S.Class<KeyUsage>("KeyUsage")({
  Critical: S.optional(S.Boolean),
  UsageFlags: KeyUsageFlags,
}) {}
export const ApplicationPolicy = S.Union(
  S.Struct({ PolicyType: S.String }),
  S.Struct({ PolicyObjectIdentifier: S.String }),
);
export const ApplicationPolicyList = S.Array(ApplicationPolicy);
export class ApplicationPolicies extends S.Class<ApplicationPolicies>(
  "ApplicationPolicies",
)({ Critical: S.optional(S.Boolean), Policies: ApplicationPolicyList }) {}
export class ExtensionsV2 extends S.Class<ExtensionsV2>("ExtensionsV2")({
  KeyUsage: KeyUsage,
  ApplicationPolicies: S.optional(ApplicationPolicies),
}) {}
export class TemplateV2 extends S.Class<TemplateV2>("TemplateV2")({
  CertificateValidity: CertificateValidity,
  SupersededTemplates: S.optional(TemplateNameList),
  PrivateKeyAttributes: PrivateKeyAttributesV2,
  PrivateKeyFlags: PrivateKeyFlagsV2,
  EnrollmentFlags: EnrollmentFlagsV2,
  SubjectNameFlags: SubjectNameFlagsV2,
  GeneralFlags: GeneralFlagsV2,
  Extensions: ExtensionsV2,
}) {}
export class KeyUsagePropertyFlags extends S.Class<KeyUsagePropertyFlags>(
  "KeyUsagePropertyFlags",
)({
  Decrypt: S.optional(S.Boolean),
  KeyAgreement: S.optional(S.Boolean),
  Sign: S.optional(S.Boolean),
}) {}
export const KeyUsageProperty = S.Union(
  S.Struct({ PropertyType: S.String }),
  S.Struct({ PropertyFlags: KeyUsagePropertyFlags }),
);
export class PrivateKeyAttributesV3 extends S.Class<PrivateKeyAttributesV3>(
  "PrivateKeyAttributesV3",
)({
  MinimalKeyLength: S.Number,
  KeySpec: S.String,
  CryptoProviders: S.optional(CryptoProvidersList),
  KeyUsageProperty: KeyUsageProperty,
  Algorithm: S.String,
}) {}
export class PrivateKeyFlagsV3 extends S.Class<PrivateKeyFlagsV3>(
  "PrivateKeyFlagsV3",
)({
  ExportableKey: S.optional(S.Boolean),
  StrongKeyProtectionRequired: S.optional(S.Boolean),
  RequireAlternateSignatureAlgorithm: S.optional(S.Boolean),
  ClientVersion: S.String,
}) {}
export class EnrollmentFlagsV3 extends S.Class<EnrollmentFlagsV3>(
  "EnrollmentFlagsV3",
)({
  IncludeSymmetricAlgorithms: S.optional(S.Boolean),
  UserInteractionRequired: S.optional(S.Boolean),
  RemoveInvalidCertificateFromPersonalStore: S.optional(S.Boolean),
  NoSecurityExtension: S.optional(S.Boolean),
  EnableKeyReuseOnNtTokenKeysetStorageFull: S.optional(S.Boolean),
}) {}
export class SubjectNameFlagsV3 extends S.Class<SubjectNameFlagsV3>(
  "SubjectNameFlagsV3",
)({
  SanRequireDomainDns: S.optional(S.Boolean),
  SanRequireSpn: S.optional(S.Boolean),
  SanRequireDirectoryGuid: S.optional(S.Boolean),
  SanRequireUpn: S.optional(S.Boolean),
  SanRequireEmail: S.optional(S.Boolean),
  SanRequireDns: S.optional(S.Boolean),
  RequireDnsAsCn: S.optional(S.Boolean),
  RequireEmail: S.optional(S.Boolean),
  RequireCommonName: S.optional(S.Boolean),
  RequireDirectoryPath: S.optional(S.Boolean),
}) {}
export class GeneralFlagsV3 extends S.Class<GeneralFlagsV3>("GeneralFlagsV3")({
  AutoEnrollment: S.optional(S.Boolean),
  MachineType: S.optional(S.Boolean),
}) {}
export class ExtensionsV3 extends S.Class<ExtensionsV3>("ExtensionsV3")({
  KeyUsage: KeyUsage,
  ApplicationPolicies: S.optional(ApplicationPolicies),
}) {}
export class TemplateV3 extends S.Class<TemplateV3>("TemplateV3")({
  CertificateValidity: CertificateValidity,
  SupersededTemplates: S.optional(TemplateNameList),
  PrivateKeyAttributes: PrivateKeyAttributesV3,
  PrivateKeyFlags: PrivateKeyFlagsV3,
  EnrollmentFlags: EnrollmentFlagsV3,
  SubjectNameFlags: SubjectNameFlagsV3,
  GeneralFlags: GeneralFlagsV3,
  HashAlgorithm: S.String,
  Extensions: ExtensionsV3,
}) {}
export class PrivateKeyAttributesV4 extends S.Class<PrivateKeyAttributesV4>(
  "PrivateKeyAttributesV4",
)({
  MinimalKeyLength: S.Number,
  KeySpec: S.String,
  CryptoProviders: S.optional(CryptoProvidersList),
  KeyUsageProperty: S.optional(KeyUsageProperty),
  Algorithm: S.optional(S.String),
}) {}
export class PrivateKeyFlagsV4 extends S.Class<PrivateKeyFlagsV4>(
  "PrivateKeyFlagsV4",
)({
  ExportableKey: S.optional(S.Boolean),
  StrongKeyProtectionRequired: S.optional(S.Boolean),
  RequireAlternateSignatureAlgorithm: S.optional(S.Boolean),
  RequireSameKeyRenewal: S.optional(S.Boolean),
  UseLegacyProvider: S.optional(S.Boolean),
  ClientVersion: S.String,
}) {}
export class EnrollmentFlagsV4 extends S.Class<EnrollmentFlagsV4>(
  "EnrollmentFlagsV4",
)({
  IncludeSymmetricAlgorithms: S.optional(S.Boolean),
  UserInteractionRequired: S.optional(S.Boolean),
  RemoveInvalidCertificateFromPersonalStore: S.optional(S.Boolean),
  NoSecurityExtension: S.optional(S.Boolean),
  EnableKeyReuseOnNtTokenKeysetStorageFull: S.optional(S.Boolean),
}) {}
export class SubjectNameFlagsV4 extends S.Class<SubjectNameFlagsV4>(
  "SubjectNameFlagsV4",
)({
  SanRequireDomainDns: S.optional(S.Boolean),
  SanRequireSpn: S.optional(S.Boolean),
  SanRequireDirectoryGuid: S.optional(S.Boolean),
  SanRequireUpn: S.optional(S.Boolean),
  SanRequireEmail: S.optional(S.Boolean),
  SanRequireDns: S.optional(S.Boolean),
  RequireDnsAsCn: S.optional(S.Boolean),
  RequireEmail: S.optional(S.Boolean),
  RequireCommonName: S.optional(S.Boolean),
  RequireDirectoryPath: S.optional(S.Boolean),
}) {}
export class GeneralFlagsV4 extends S.Class<GeneralFlagsV4>("GeneralFlagsV4")({
  AutoEnrollment: S.optional(S.Boolean),
  MachineType: S.optional(S.Boolean),
}) {}
export class ExtensionsV4 extends S.Class<ExtensionsV4>("ExtensionsV4")({
  KeyUsage: KeyUsage,
  ApplicationPolicies: S.optional(ApplicationPolicies),
}) {}
export class TemplateV4 extends S.Class<TemplateV4>("TemplateV4")({
  CertificateValidity: CertificateValidity,
  SupersededTemplates: S.optional(TemplateNameList),
  PrivateKeyAttributes: PrivateKeyAttributesV4,
  PrivateKeyFlags: PrivateKeyFlagsV4,
  EnrollmentFlags: EnrollmentFlagsV4,
  SubjectNameFlags: SubjectNameFlagsV4,
  GeneralFlags: GeneralFlagsV4,
  HashAlgorithm: S.optional(S.String),
  Extensions: ExtensionsV4,
}) {}
export const TemplateDefinition = S.Union(
  S.Struct({ TemplateV2: TemplateV2 }),
  S.Struct({ TemplateV3: TemplateV3 }),
  S.Struct({ TemplateV4: TemplateV4 }),
);
export class UpdateTemplateRequest extends S.Class<UpdateTemplateRequest>(
  "UpdateTemplateRequest",
)(
  {
    TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")),
    Definition: S.optional(TemplateDefinition),
    ReenrollAllCertificateHolders: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/templates/{TemplateArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTemplateResponse extends S.Class<UpdateTemplateResponse>(
  "UpdateTemplateResponse",
)({}) {}
export class DeleteTemplateRequest extends S.Class<DeleteTemplateRequest>(
  "DeleteTemplateRequest",
)(
  { TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/templates/{TemplateArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTemplateResponse extends S.Class<DeleteTemplateResponse>(
  "DeleteTemplateResponse",
)({}) {}
export class ListTemplatesRequest extends S.Class<ListTemplatesRequest>(
  "ListTemplatesRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    ConnectorArn: S.String.pipe(T.HttpQuery("ConnectorArn")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/templates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const SecurityGroupIdList = S.Array(S.String);
export class VpcInformation extends S.Class<VpcInformation>("VpcInformation")({
  IpAddressType: S.optional(S.String),
  SecurityGroupIds: SecurityGroupIdList,
}) {}
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
export class CreateConnectorRequest extends S.Class<CreateConnectorRequest>(
  "CreateConnectorRequest",
)(
  {
    DirectoryId: S.String,
    CertificateAuthorityArn: S.String,
    VpcInformation: VpcInformation,
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
export class CreateDirectoryRegistrationResponse extends S.Class<CreateDirectoryRegistrationResponse>(
  "CreateDirectoryRegistrationResponse",
)({ DirectoryRegistrationArn: S.optional(S.String) }) {}
export class CreateTemplateGroupAccessControlEntryRequest extends S.Class<CreateTemplateGroupAccessControlEntryRequest>(
  "CreateTemplateGroupAccessControlEntryRequest",
)(
  {
    TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")),
    GroupSecurityIdentifier: S.String,
    GroupDisplayName: S.String,
    AccessRights: AccessRights,
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/templates/{TemplateArn}/accessControlEntries",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTemplateGroupAccessControlEntryResponse extends S.Class<CreateTemplateGroupAccessControlEntryResponse>(
  "CreateTemplateGroupAccessControlEntryResponse",
)({}) {}
export class Connector extends S.Class<Connector>("Connector")({
  Arn: S.optional(S.String),
  CertificateAuthorityArn: S.optional(S.String),
  CertificateEnrollmentPolicyServerEndpoint: S.optional(S.String),
  DirectoryId: S.optional(S.String),
  VpcInformation: S.optional(VpcInformation),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ConnectorSummary extends S.Class<ConnectorSummary>(
  "ConnectorSummary",
)({
  Arn: S.optional(S.String),
  CertificateAuthorityArn: S.optional(S.String),
  CertificateEnrollmentPolicyServerEndpoint: S.optional(S.String),
  DirectoryId: S.optional(S.String),
  VpcInformation: S.optional(VpcInformation),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ConnectorList = S.Array(ConnectorSummary);
export class DirectoryRegistration extends S.Class<DirectoryRegistration>(
  "DirectoryRegistration",
)({
  Arn: S.optional(S.String),
  DirectoryId: S.optional(S.String),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DirectoryRegistrationSummary extends S.Class<DirectoryRegistrationSummary>(
  "DirectoryRegistrationSummary",
)({
  Arn: S.optional(S.String),
  DirectoryId: S.optional(S.String),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const DirectoryRegistrationList = S.Array(DirectoryRegistrationSummary);
export class ServicePrincipalName extends S.Class<ServicePrincipalName>(
  "ServicePrincipalName",
)({
  DirectoryRegistrationArn: S.optional(S.String),
  ConnectorArn: S.optional(S.String),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ServicePrincipalNameSummary extends S.Class<ServicePrincipalNameSummary>(
  "ServicePrincipalNameSummary",
)({
  DirectoryRegistrationArn: S.optional(S.String),
  ConnectorArn: S.optional(S.String),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ServicePrincipalNameList = S.Array(ServicePrincipalNameSummary);
export class AccessControlEntry extends S.Class<AccessControlEntry>(
  "AccessControlEntry",
)({
  GroupDisplayName: S.optional(S.String),
  GroupSecurityIdentifier: S.optional(S.String),
  AccessRights: S.optional(AccessRights),
  TemplateArn: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class AccessControlEntrySummary extends S.Class<AccessControlEntrySummary>(
  "AccessControlEntrySummary",
)({
  GroupDisplayName: S.optional(S.String),
  GroupSecurityIdentifier: S.optional(S.String),
  AccessRights: S.optional(AccessRights),
  TemplateArn: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const AccessControlEntryList = S.Array(AccessControlEntrySummary);
export class TemplateRevision extends S.Class<TemplateRevision>(
  "TemplateRevision",
)({ MajorRevision: S.Number, MinorRevision: S.Number }) {}
export class TemplateSummary extends S.Class<TemplateSummary>(
  "TemplateSummary",
)({
  Arn: S.optional(S.String),
  ConnectorArn: S.optional(S.String),
  Definition: S.optional(TemplateDefinition),
  Name: S.optional(S.String),
  ObjectIdentifier: S.optional(S.String),
  PolicySchema: S.optional(S.Number),
  Status: S.optional(S.String),
  Revision: S.optional(TemplateRevision),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const TemplateList = S.Array(TemplateSummary);
export class CreateConnectorResponse extends S.Class<CreateConnectorResponse>(
  "CreateConnectorResponse",
)({ ConnectorArn: S.optional(S.String) }) {}
export class GetConnectorResponse extends S.Class<GetConnectorResponse>(
  "GetConnectorResponse",
)({ Connector: S.optional(Connector) }) {}
export class ListConnectorsResponse extends S.Class<ListConnectorsResponse>(
  "ListConnectorsResponse",
)({ Connectors: S.optional(ConnectorList), NextToken: S.optional(S.String) }) {}
export class GetDirectoryRegistrationResponse extends S.Class<GetDirectoryRegistrationResponse>(
  "GetDirectoryRegistrationResponse",
)({ DirectoryRegistration: S.optional(DirectoryRegistration) }) {}
export class ListDirectoryRegistrationsResponse extends S.Class<ListDirectoryRegistrationsResponse>(
  "ListDirectoryRegistrationsResponse",
)({
  DirectoryRegistrations: S.optional(DirectoryRegistrationList),
  NextToken: S.optional(S.String),
}) {}
export class GetServicePrincipalNameResponse extends S.Class<GetServicePrincipalNameResponse>(
  "GetServicePrincipalNameResponse",
)({ ServicePrincipalName: S.optional(ServicePrincipalName) }) {}
export class ListServicePrincipalNamesResponse extends S.Class<ListServicePrincipalNamesResponse>(
  "ListServicePrincipalNamesResponse",
)({
  ServicePrincipalNames: S.optional(ServicePrincipalNameList),
  NextToken: S.optional(S.String),
}) {}
export class GetTemplateGroupAccessControlEntryResponse extends S.Class<GetTemplateGroupAccessControlEntryResponse>(
  "GetTemplateGroupAccessControlEntryResponse",
)({ AccessControlEntry: S.optional(AccessControlEntry) }) {}
export class ListTemplateGroupAccessControlEntriesResponse extends S.Class<ListTemplateGroupAccessControlEntriesResponse>(
  "ListTemplateGroupAccessControlEntriesResponse",
)({
  AccessControlEntries: S.optional(AccessControlEntryList),
  NextToken: S.optional(S.String),
}) {}
export class ListTemplatesResponse extends S.Class<ListTemplatesResponse>(
  "ListTemplatesResponse",
)({ Templates: S.optional(TemplateList), NextToken: S.optional(S.String) }) {}
export class Template extends S.Class<Template>("Template")({
  Arn: S.optional(S.String),
  ConnectorArn: S.optional(S.String),
  Definition: S.optional(TemplateDefinition),
  Name: S.optional(S.String),
  ObjectIdentifier: S.optional(S.String),
  PolicySchema: S.optional(S.Number),
  Status: S.optional(S.String),
  Revision: S.optional(TemplateRevision),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetTemplateResponse extends S.Class<GetTemplateResponse>(
  "GetTemplateResponse",
)({ Template: S.optional(Template) }) {}
export class CreateTemplateRequest extends S.Class<CreateTemplateRequest>(
  "CreateTemplateRequest",
)(
  {
    ConnectorArn: S.String,
    Name: S.String,
    Definition: TemplateDefinition,
    ClientToken: S.optional(S.String),
    Tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/templates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTemplateResponse extends S.Class<CreateTemplateResponse>(
  "CreateTemplateResponse",
)({ TemplateArn: S.optional(S.String) }) {}

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
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.String,
    ServiceCode: S.optional(S.String),
    QuotaCode: S.optional(S.String),
  },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.String, Reason: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.String,
    ResourceId: S.String,
    ResourceType: S.String,
    ServiceCode: S.String,
    QuotaCode: S.String,
  },
) {}

//# Operations
/**
 * Lists the connectors that you created by using the https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_CreateConnector action.
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
 * Create a group access control entry. Allow or deny Active Directory groups from enrolling and/or
 * autoenrolling with the template based on the group security identifiers (SIDs).
 */
export const createTemplateGroupAccessControlEntry =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateTemplateGroupAccessControlEntryRequest,
    output: CreateTemplateGroupAccessControlEntryResponse,
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
 * Retrieves a certificate template that the connector uses to issue certificates from a
 * private CA.
 */
export const getTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTemplateRequest,
  output: GetTemplateResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists information about your connector. You specify the connector on input by its ARN
 * (Amazon Resource Name).
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
 * Creates a directory registration that authorizes communication between Amazon Web Services Private CA and an
 * Active Directory
 */
export const createDirectoryRegistration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDirectoryRegistrationRequest,
    output: CreateDirectoryRegistrationResponse,
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
 * A structure that contains information about your directory registration.
 */
export const getDirectoryRegistration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDirectoryRegistrationRequest,
    output: GetDirectoryRegistrationResponse,
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
 * Lists the service principal name that the connector uses to authenticate with
 * Active Directory.
 */
export const getServicePrincipalName = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetServicePrincipalNameRequest,
    output: GetServicePrincipalNameResponse,
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
 * Lists the service principal names that the connector uses to authenticate with
 * Active Directory.
 */
export const listServicePrincipalNames =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListServicePrincipalNamesRequest,
    output: ListServicePrincipalNamesResponse,
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
      items: "ServicePrincipalNames",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Retrieves the group access control entries for a template.
 */
export const getTemplateGroupAccessControlEntry =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetTemplateGroupAccessControlEntryRequest,
    output: GetTemplateGroupAccessControlEntryResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists group access control entries you created.
 */
export const listTemplateGroupAccessControlEntries =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTemplateGroupAccessControlEntriesRequest,
    output: ListTemplateGroupAccessControlEntriesResponse,
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
      items: "AccessControlEntries",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the templates, if any, that are associated with a connector.
 */
export const listTemplates = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListTemplatesRequest,
    output: ListTemplatesResponse,
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
      items: "Templates",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists the tags, if any, that are associated with your resource.
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
 * Deletes a connector for Active Directory. You must provide the Amazon Resource Name (ARN) of the
 * connector that you want to delete. You can find the ARN by calling the https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_ListConnectors
 * action. Deleting a connector does not deregister your directory with Amazon Web Services Private CA. You can
 * deregister your directory by calling the https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_DeleteDirectoryRegistration
 * action.
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
 * Creates a service principal name (SPN) for the service account in Active Directory. Kerberos
 * authentication uses SPNs to associate a service instance with a service sign-in
 * account.
 */
export const createServicePrincipalName = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateServicePrincipalNameRequest,
    output: CreateServicePrincipalNameResponse,
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
 * Update a group access control entry you created using CreateTemplateGroupAccessControlEntry.
 */
export const updateTemplateGroupAccessControlEntry =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateTemplateGroupAccessControlEntryRequest,
    output: UpdateTemplateGroupAccessControlEntryResponse,
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
 * Deletes a group access control entry.
 */
export const deleteTemplateGroupAccessControlEntry =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteTemplateGroupAccessControlEntryRequest,
    output: DeleteTemplateGroupAccessControlEntryResponse,
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
 * Update template configuration to define the information included in certificates.
 */
export const updateTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTemplateRequest,
  output: UpdateTemplateResponse,
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
 * Deletes a template. Certificates issued using the template are still valid until they
 * are revoked or expired.
 */
export const deleteTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTemplateRequest,
  output: DeleteTemplateResponse,
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
 * Lists the directory registrations that you created by using the https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_CreateDirectoryRegistration
 * action.
 */
export const listDirectoryRegistrations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDirectoryRegistrationsRequest,
    output: ListDirectoryRegistrationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "DirectoryRegistrations",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Deletes a directory registration. Deleting a directory registration deauthorizes
 * Amazon Web Services Private CA with the directory.
 */
export const deleteDirectoryRegistration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDirectoryRegistrationRequest,
    output: DeleteDirectoryRegistrationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes the service principal name (SPN) used by a connector to authenticate with your
 * Active Directory.
 */
export const deleteServicePrincipalName = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteServicePrincipalNameRequest,
    output: DeleteServicePrincipalNameResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
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
 * Creates a connector between Amazon Web Services Private CA and an Active Directory. You must specify the private CA,
 * directory ID, and security groups.
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
 * Creates an Active Directory compatible certificate template. The connectors issues certificates
 * using these templates based on the requester’s Active Directory group membership.
 */
export const createTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTemplateRequest,
  output: CreateTemplateResponse,
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
