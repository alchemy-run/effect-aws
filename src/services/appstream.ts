import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "AppStream",
  serviceShapeName: "PhotonAdminProxyService",
});
const auth = T.AwsAuthSigv4({ name: "appstream" });
const ver = T.ServiceVersion("2016-12-01");
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
                        url: "https://appstream2-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://appstream2-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://appstream2.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://appstream2.{Region}.amazonaws.com",
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
                url: "https://appstream2.{Region}.amazonaws.com",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://appstream2.{Region}.{PartitionResult#dnsSuffix}",
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

//# Newtypes
export type Arn = string;
export type Name = string;
export type RegionName = string;
export type Description = string;
export type DisplayName = string;
export type Long = number;
export type DirectoryName = string;
export type OrganizationalUnitDistinguishedName = string;
export type AmiName = string;
export type Integer = number;
export type UsbDeviceFilterString = string;
export type AppstreamAgentVersion = string;
export type PhotonAmiId = string;
export type ImageImportDescription = string;
export type ImageImportDisplayName = string;
export type RedirectURL = string;
export type FeedbackURL = string;
export type EmbedHostDomain = string;
export type StreamingUrlUserId = string;
export type ThemeTitleText = string;
export type Username = string | Redacted.Redacted<string>;
export type UserAttributeValue = string | Redacted.Redacted<string>;
export type AwsAccountId = string;
export type ErrorMessage = string;
export type MaxResults = number;
export type DescribeImagesMaxResults = number;
export type UserId = string;
export type UUID = string;
export type TagKey = string;
export type S3Bucket = string;
export type S3Key = string;
export type TagValue = string;
export type AccountName = string | Redacted.Redacted<string>;
export type AccountPassword = string | Redacted.Redacted<string>;
export type InstanceType = string;
export type AppName = string;
export type AppDisplayName = string;
export type FilePath = string | Redacted.Redacted<string>;
export type LaunchParameters = string | Redacted.Redacted<string>;
export type ResourceIdentifier = string;
export type Domain = string;
export type SettingsGroup = string;
export type ThemeFooterLinkDisplayName = string;
export type ThemeFooterLinkURL = string;
export type FilterName = string;
export type FilterValue = string;

//# Schemas
export interface CreateUsageReportSubscriptionRequest {}
export const CreateUsageReportSubscriptionRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateUsageReportSubscriptionRequest",
}) as any as S.Schema<CreateUsageReportSubscriptionRequest>;
export interface DeleteUsageReportSubscriptionRequest {}
export const DeleteUsageReportSubscriptionRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteUsageReportSubscriptionRequest",
}) as any as S.Schema<DeleteUsageReportSubscriptionRequest>;
export interface DeleteUsageReportSubscriptionResult {}
export const DeleteUsageReportSubscriptionResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteUsageReportSubscriptionResult",
}) as any as S.Schema<DeleteUsageReportSubscriptionResult>;
export type StringList = string[];
export const StringList = S.Array(S.String);
export type Platforms = string[];
export const Platforms = S.Array(S.String);
export type OrganizationalUnitDistinguishedNamesList = string[];
export const OrganizationalUnitDistinguishedNamesList = S.Array(S.String);
export type UsbDeviceFilterStrings = string[];
export const UsbDeviceFilterStrings = S.Array(S.String);
export type EmbedHostDomains = string[];
export const EmbedHostDomains = S.Array(S.String);
export type ArnList = string[];
export const ArnList = S.Array(S.String);
export type DirectoryNameList = string[];
export const DirectoryNameList = S.Array(S.String);
export type AwsAccountIdList = string[];
export const AwsAccountIdList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type AppBlockBuilderAttributes = string[];
export const AppBlockBuilderAttributes = S.Array(S.String);
export type ApplicationAttributes = string[];
export const ApplicationAttributes = S.Array(S.String);
export type FleetAttributes = string[];
export const FleetAttributes = S.Array(S.String);
export type StackAttributes = string[];
export const StackAttributes = S.Array(S.String);
export type ThemeAttributes = string[];
export const ThemeAttributes = S.Array(S.String);
export interface AssociateAppBlockBuilderAppBlockRequest {
  AppBlockArn: string;
  AppBlockBuilderName: string;
}
export const AssociateAppBlockBuilderAppBlockRequest = S.suspend(() =>
  S.Struct({ AppBlockArn: S.String, AppBlockBuilderName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateAppBlockBuilderAppBlockRequest",
}) as any as S.Schema<AssociateAppBlockBuilderAppBlockRequest>;
export interface AssociateApplicationFleetRequest {
  FleetName: string;
  ApplicationArn: string;
}
export const AssociateApplicationFleetRequest = S.suspend(() =>
  S.Struct({ FleetName: S.String, ApplicationArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateApplicationFleetRequest",
}) as any as S.Schema<AssociateApplicationFleetRequest>;
export interface AssociateApplicationToEntitlementRequest {
  StackName: string;
  EntitlementName: string;
  ApplicationIdentifier: string;
}
export const AssociateApplicationToEntitlementRequest = S.suspend(() =>
  S.Struct({
    StackName: S.String,
    EntitlementName: S.String,
    ApplicationIdentifier: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateApplicationToEntitlementRequest",
}) as any as S.Schema<AssociateApplicationToEntitlementRequest>;
export interface AssociateApplicationToEntitlementResult {}
export const AssociateApplicationToEntitlementResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateApplicationToEntitlementResult",
}) as any as S.Schema<AssociateApplicationToEntitlementResult>;
export interface AssociateFleetRequest {
  FleetName: string;
  StackName: string;
}
export const AssociateFleetRequest = S.suspend(() =>
  S.Struct({ FleetName: S.String, StackName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateFleetRequest",
}) as any as S.Schema<AssociateFleetRequest>;
export interface AssociateFleetResult {}
export const AssociateFleetResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "AssociateFleetResult",
}) as any as S.Schema<AssociateFleetResult>;
export interface AssociateSoftwareToImageBuilderRequest {
  ImageBuilderName: string;
  SoftwareNames: StringList;
}
export const AssociateSoftwareToImageBuilderRequest = S.suspend(() =>
  S.Struct({ ImageBuilderName: S.String, SoftwareNames: StringList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateSoftwareToImageBuilderRequest",
}) as any as S.Schema<AssociateSoftwareToImageBuilderRequest>;
export interface AssociateSoftwareToImageBuilderResult {}
export const AssociateSoftwareToImageBuilderResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateSoftwareToImageBuilderResult",
}) as any as S.Schema<AssociateSoftwareToImageBuilderResult>;
export interface UserStackAssociation {
  StackName: string;
  UserName: string | Redacted.Redacted<string>;
  AuthenticationType: string;
  SendEmailNotification?: boolean;
}
export const UserStackAssociation = S.suspend(() =>
  S.Struct({
    StackName: S.String,
    UserName: SensitiveString,
    AuthenticationType: S.String,
    SendEmailNotification: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "UserStackAssociation",
}) as any as S.Schema<UserStackAssociation>;
export type UserStackAssociationList = UserStackAssociation[];
export const UserStackAssociationList = S.Array(UserStackAssociation);
export interface BatchDisassociateUserStackRequest {
  UserStackAssociations: UserStackAssociationList;
}
export const BatchDisassociateUserStackRequest = S.suspend(() =>
  S.Struct({ UserStackAssociations: UserStackAssociationList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchDisassociateUserStackRequest",
}) as any as S.Schema<BatchDisassociateUserStackRequest>;
export interface CopyImageRequest {
  SourceImageName: string;
  DestinationImageName: string;
  DestinationRegion: string;
  DestinationImageDescription?: string;
}
export const CopyImageRequest = S.suspend(() =>
  S.Struct({
    SourceImageName: S.String,
    DestinationImageName: S.String,
    DestinationRegion: S.String,
    DestinationImageDescription: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CopyImageRequest",
}) as any as S.Schema<CopyImageRequest>;
export interface CreateAppBlockBuilderStreamingURLRequest {
  AppBlockBuilderName: string;
  Validity?: number;
}
export const CreateAppBlockBuilderStreamingURLRequest = S.suspend(() =>
  S.Struct({
    AppBlockBuilderName: S.String,
    Validity: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAppBlockBuilderStreamingURLRequest",
}) as any as S.Schema<CreateAppBlockBuilderStreamingURLRequest>;
export interface S3Location {
  S3Bucket: string;
  S3Key?: string;
}
export const S3Location = S.suspend(() =>
  S.Struct({ S3Bucket: S.String, S3Key: S.optional(S.String) }),
).annotations({ identifier: "S3Location" }) as any as S.Schema<S3Location>;
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface CreateApplicationRequest {
  Name: string;
  DisplayName?: string;
  Description?: string;
  IconS3Location: S3Location;
  LaunchPath: string;
  WorkingDirectory?: string;
  LaunchParameters?: string;
  Platforms: Platforms;
  InstanceFamilies: StringList;
  AppBlockArn: string;
  Tags?: Tags;
}
export const CreateApplicationRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    DisplayName: S.optional(S.String),
    Description: S.optional(S.String),
    IconS3Location: S3Location,
    LaunchPath: S.String,
    WorkingDirectory: S.optional(S.String),
    LaunchParameters: S.optional(S.String),
    Platforms: Platforms,
    InstanceFamilies: StringList,
    AppBlockArn: S.String,
    Tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateApplicationRequest",
}) as any as S.Schema<CreateApplicationRequest>;
export interface CreateExportImageTaskRequest {
  ImageName: string;
  AmiName: string;
  IamRoleArn: string;
  TagSpecifications?: Tags;
  AmiDescription?: string;
}
export const CreateExportImageTaskRequest = S.suspend(() =>
  S.Struct({
    ImageName: S.String,
    AmiName: S.String,
    IamRoleArn: S.String,
    TagSpecifications: S.optional(Tags),
    AmiDescription: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateExportImageTaskRequest",
}) as any as S.Schema<CreateExportImageTaskRequest>;
export type SubnetIdList = string[];
export const SubnetIdList = S.Array(S.String);
export type SecurityGroupIdList = string[];
export const SecurityGroupIdList = S.Array(S.String);
export interface VpcConfig {
  SubnetIds?: SubnetIdList;
  SecurityGroupIds?: SecurityGroupIdList;
}
export const VpcConfig = S.suspend(() =>
  S.Struct({
    SubnetIds: S.optional(SubnetIdList),
    SecurityGroupIds: S.optional(SecurityGroupIdList),
  }),
).annotations({ identifier: "VpcConfig" }) as any as S.Schema<VpcConfig>;
export interface DomainJoinInfo {
  DirectoryName?: string;
  OrganizationalUnitDistinguishedName?: string;
}
export const DomainJoinInfo = S.suspend(() =>
  S.Struct({
    DirectoryName: S.optional(S.String),
    OrganizationalUnitDistinguishedName: S.optional(S.String),
  }),
).annotations({
  identifier: "DomainJoinInfo",
}) as any as S.Schema<DomainJoinInfo>;
export interface AccessEndpoint {
  EndpointType: string;
  VpceId?: string;
}
export const AccessEndpoint = S.suspend(() =>
  S.Struct({ EndpointType: S.String, VpceId: S.optional(S.String) }),
).annotations({
  identifier: "AccessEndpoint",
}) as any as S.Schema<AccessEndpoint>;
export type AccessEndpointList = AccessEndpoint[];
export const AccessEndpointList = S.Array(AccessEndpoint);
export interface VolumeConfig {
  VolumeSizeInGb?: number;
}
export const VolumeConfig = S.suspend(() =>
  S.Struct({ VolumeSizeInGb: S.optional(S.Number) }),
).annotations({ identifier: "VolumeConfig" }) as any as S.Schema<VolumeConfig>;
export interface CreateImageBuilderRequest {
  Name: string;
  ImageName?: string;
  ImageArn?: string;
  InstanceType: string;
  Description?: string;
  DisplayName?: string;
  VpcConfig?: VpcConfig;
  IamRoleArn?: string;
  EnableDefaultInternetAccess?: boolean;
  DomainJoinInfo?: DomainJoinInfo;
  AppstreamAgentVersion?: string;
  Tags?: Tags;
  AccessEndpoints?: AccessEndpointList;
  RootVolumeConfig?: VolumeConfig;
  SoftwaresToInstall?: StringList;
  SoftwaresToUninstall?: StringList;
}
export const CreateImageBuilderRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ImageName: S.optional(S.String),
    ImageArn: S.optional(S.String),
    InstanceType: S.String,
    Description: S.optional(S.String),
    DisplayName: S.optional(S.String),
    VpcConfig: S.optional(VpcConfig),
    IamRoleArn: S.optional(S.String),
    EnableDefaultInternetAccess: S.optional(S.Boolean),
    DomainJoinInfo: S.optional(DomainJoinInfo),
    AppstreamAgentVersion: S.optional(S.String),
    Tags: S.optional(Tags),
    AccessEndpoints: S.optional(AccessEndpointList),
    RootVolumeConfig: S.optional(VolumeConfig),
    SoftwaresToInstall: S.optional(StringList),
    SoftwaresToUninstall: S.optional(StringList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateImageBuilderRequest",
}) as any as S.Schema<CreateImageBuilderRequest>;
export interface CreateImageBuilderStreamingURLRequest {
  Name: string;
  Validity?: number;
}
export const CreateImageBuilderStreamingURLRequest = S.suspend(() =>
  S.Struct({ Name: S.String, Validity: S.optional(S.Number) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateImageBuilderStreamingURLRequest",
}) as any as S.Schema<CreateImageBuilderStreamingURLRequest>;
export interface CreateStreamingURLRequest {
  StackName: string;
  FleetName: string;
  UserId: string;
  ApplicationId?: string;
  Validity?: number;
  SessionContext?: string;
}
export const CreateStreamingURLRequest = S.suspend(() =>
  S.Struct({
    StackName: S.String,
    FleetName: S.String,
    UserId: S.String,
    ApplicationId: S.optional(S.String),
    Validity: S.optional(S.Number),
    SessionContext: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateStreamingURLRequest",
}) as any as S.Schema<CreateStreamingURLRequest>;
export interface CreateUpdatedImageRequest {
  existingImageName: string;
  newImageName: string;
  newImageDescription?: string;
  newImageDisplayName?: string;
  newImageTags?: Tags;
  dryRun?: boolean;
}
export const CreateUpdatedImageRequest = S.suspend(() =>
  S.Struct({
    existingImageName: S.String,
    newImageName: S.String,
    newImageDescription: S.optional(S.String),
    newImageDisplayName: S.optional(S.String),
    newImageTags: S.optional(Tags),
    dryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateUpdatedImageRequest",
}) as any as S.Schema<CreateUpdatedImageRequest>;
export interface CreateUsageReportSubscriptionResult {
  S3BucketName?: string;
  Schedule?: string;
}
export const CreateUsageReportSubscriptionResult = S.suspend(() =>
  S.Struct({
    S3BucketName: S.optional(S.String),
    Schedule: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateUsageReportSubscriptionResult",
}) as any as S.Schema<CreateUsageReportSubscriptionResult>;
export interface CreateUserRequest {
  UserName: string | Redacted.Redacted<string>;
  MessageAction?: string;
  FirstName?: string | Redacted.Redacted<string>;
  LastName?: string | Redacted.Redacted<string>;
  AuthenticationType: string;
}
export const CreateUserRequest = S.suspend(() =>
  S.Struct({
    UserName: SensitiveString,
    MessageAction: S.optional(S.String),
    FirstName: S.optional(SensitiveString),
    LastName: S.optional(SensitiveString),
    AuthenticationType: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateUserRequest",
}) as any as S.Schema<CreateUserRequest>;
export interface CreateUserResult {}
export const CreateUserResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "CreateUserResult",
}) as any as S.Schema<CreateUserResult>;
export interface DeleteAppBlockRequest {
  Name: string;
}
export const DeleteAppBlockRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAppBlockRequest",
}) as any as S.Schema<DeleteAppBlockRequest>;
export interface DeleteAppBlockResult {}
export const DeleteAppBlockResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteAppBlockResult",
}) as any as S.Schema<DeleteAppBlockResult>;
export interface DeleteAppBlockBuilderRequest {
  Name: string;
}
export const DeleteAppBlockBuilderRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAppBlockBuilderRequest",
}) as any as S.Schema<DeleteAppBlockBuilderRequest>;
export interface DeleteAppBlockBuilderResult {}
export const DeleteAppBlockBuilderResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAppBlockBuilderResult",
}) as any as S.Schema<DeleteAppBlockBuilderResult>;
export interface DeleteApplicationRequest {
  Name: string;
}
export const DeleteApplicationRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteApplicationRequest",
}) as any as S.Schema<DeleteApplicationRequest>;
export interface DeleteApplicationResult {}
export const DeleteApplicationResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteApplicationResult",
}) as any as S.Schema<DeleteApplicationResult>;
export interface DeleteDirectoryConfigRequest {
  DirectoryName: string;
}
export const DeleteDirectoryConfigRequest = S.suspend(() =>
  S.Struct({ DirectoryName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteDirectoryConfigRequest",
}) as any as S.Schema<DeleteDirectoryConfigRequest>;
export interface DeleteDirectoryConfigResult {}
export const DeleteDirectoryConfigResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDirectoryConfigResult",
}) as any as S.Schema<DeleteDirectoryConfigResult>;
export interface DeleteEntitlementRequest {
  Name: string;
  StackName: string;
}
export const DeleteEntitlementRequest = S.suspend(() =>
  S.Struct({ Name: S.String, StackName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteEntitlementRequest",
}) as any as S.Schema<DeleteEntitlementRequest>;
export interface DeleteEntitlementResult {}
export const DeleteEntitlementResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEntitlementResult",
}) as any as S.Schema<DeleteEntitlementResult>;
export interface DeleteFleetRequest {
  Name: string;
}
export const DeleteFleetRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteFleetRequest",
}) as any as S.Schema<DeleteFleetRequest>;
export interface DeleteFleetResult {}
export const DeleteFleetResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteFleetResult",
}) as any as S.Schema<DeleteFleetResult>;
export interface DeleteImageRequest {
  Name: string;
}
export const DeleteImageRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteImageRequest",
}) as any as S.Schema<DeleteImageRequest>;
export interface DeleteImageBuilderRequest {
  Name: string;
}
export const DeleteImageBuilderRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteImageBuilderRequest",
}) as any as S.Schema<DeleteImageBuilderRequest>;
export interface DeleteImagePermissionsRequest {
  Name: string;
  SharedAccountId: string;
}
export const DeleteImagePermissionsRequest = S.suspend(() =>
  S.Struct({ Name: S.String, SharedAccountId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteImagePermissionsRequest",
}) as any as S.Schema<DeleteImagePermissionsRequest>;
export interface DeleteImagePermissionsResult {}
export const DeleteImagePermissionsResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteImagePermissionsResult",
}) as any as S.Schema<DeleteImagePermissionsResult>;
export interface DeleteStackRequest {
  Name: string;
}
export const DeleteStackRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteStackRequest",
}) as any as S.Schema<DeleteStackRequest>;
export interface DeleteStackResult {}
export const DeleteStackResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteStackResult",
}) as any as S.Schema<DeleteStackResult>;
export interface DeleteThemeForStackRequest {
  StackName: string;
}
export const DeleteThemeForStackRequest = S.suspend(() =>
  S.Struct({ StackName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteThemeForStackRequest",
}) as any as S.Schema<DeleteThemeForStackRequest>;
export interface DeleteThemeForStackResult {}
export const DeleteThemeForStackResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteThemeForStackResult",
}) as any as S.Schema<DeleteThemeForStackResult>;
export interface DeleteUserRequest {
  UserName: string | Redacted.Redacted<string>;
  AuthenticationType: string;
}
export const DeleteUserRequest = S.suspend(() =>
  S.Struct({ UserName: SensitiveString, AuthenticationType: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteUserRequest",
}) as any as S.Schema<DeleteUserRequest>;
export interface DeleteUserResult {}
export const DeleteUserResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteUserResult",
}) as any as S.Schema<DeleteUserResult>;
export interface DescribeAppBlockBuilderAppBlockAssociationsRequest {
  AppBlockArn?: string;
  AppBlockBuilderName?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeAppBlockBuilderAppBlockAssociationsRequest = S.suspend(
  () =>
    S.Struct({
      AppBlockArn: S.optional(S.String),
      AppBlockBuilderName: S.optional(S.String),
      MaxResults: S.optional(S.Number),
      NextToken: S.optional(S.String),
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "DescribeAppBlockBuilderAppBlockAssociationsRequest",
}) as any as S.Schema<DescribeAppBlockBuilderAppBlockAssociationsRequest>;
export interface DescribeAppBlockBuildersRequest {
  Names?: StringList;
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeAppBlockBuildersRequest = S.suspend(() =>
  S.Struct({
    Names: S.optional(StringList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeAppBlockBuildersRequest",
}) as any as S.Schema<DescribeAppBlockBuildersRequest>;
export interface DescribeAppBlocksRequest {
  Arns?: ArnList;
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeAppBlocksRequest = S.suspend(() =>
  S.Struct({
    Arns: S.optional(ArnList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeAppBlocksRequest",
}) as any as S.Schema<DescribeAppBlocksRequest>;
export interface DescribeApplicationFleetAssociationsRequest {
  FleetName?: string;
  ApplicationArn?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeApplicationFleetAssociationsRequest = S.suspend(() =>
  S.Struct({
    FleetName: S.optional(S.String),
    ApplicationArn: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeApplicationFleetAssociationsRequest",
}) as any as S.Schema<DescribeApplicationFleetAssociationsRequest>;
export interface DescribeApplicationsRequest {
  Arns?: ArnList;
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeApplicationsRequest = S.suspend(() =>
  S.Struct({
    Arns: S.optional(ArnList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeApplicationsRequest",
}) as any as S.Schema<DescribeApplicationsRequest>;
export interface DescribeAppLicenseUsageRequest {
  BillingPeriod: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeAppLicenseUsageRequest = S.suspend(() =>
  S.Struct({
    BillingPeriod: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeAppLicenseUsageRequest",
}) as any as S.Schema<DescribeAppLicenseUsageRequest>;
export interface DescribeDirectoryConfigsRequest {
  DirectoryNames?: DirectoryNameList;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeDirectoryConfigsRequest = S.suspend(() =>
  S.Struct({
    DirectoryNames: S.optional(DirectoryNameList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeDirectoryConfigsRequest",
}) as any as S.Schema<DescribeDirectoryConfigsRequest>;
export interface DescribeEntitlementsRequest {
  Name?: string;
  StackName: string;
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeEntitlementsRequest = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    StackName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeEntitlementsRequest",
}) as any as S.Schema<DescribeEntitlementsRequest>;
export interface DescribeFleetsRequest {
  Names?: StringList;
  NextToken?: string;
}
export const DescribeFleetsRequest = S.suspend(() =>
  S.Struct({
    Names: S.optional(StringList),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeFleetsRequest",
}) as any as S.Schema<DescribeFleetsRequest>;
export interface DescribeImageBuildersRequest {
  Names?: StringList;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeImageBuildersRequest = S.suspend(() =>
  S.Struct({
    Names: S.optional(StringList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeImageBuildersRequest",
}) as any as S.Schema<DescribeImageBuildersRequest>;
export interface DescribeImagePermissionsRequest {
  Name: string;
  MaxResults?: number;
  SharedAwsAccountIds?: AwsAccountIdList;
  NextToken?: string;
}
export const DescribeImagePermissionsRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    MaxResults: S.optional(S.Number),
    SharedAwsAccountIds: S.optional(AwsAccountIdList),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeImagePermissionsRequest",
}) as any as S.Schema<DescribeImagePermissionsRequest>;
export interface DescribeImagesRequest {
  Names?: StringList;
  Arns?: ArnList;
  Type?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeImagesRequest = S.suspend(() =>
  S.Struct({
    Names: S.optional(StringList),
    Arns: S.optional(ArnList),
    Type: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeImagesRequest",
}) as any as S.Schema<DescribeImagesRequest>;
export interface DescribeSessionsRequest {
  StackName: string;
  FleetName: string;
  UserId?: string;
  NextToken?: string;
  Limit?: number;
  AuthenticationType?: string;
  InstanceId?: string;
}
export const DescribeSessionsRequest = S.suspend(() =>
  S.Struct({
    StackName: S.String,
    FleetName: S.String,
    UserId: S.optional(S.String),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
    AuthenticationType: S.optional(S.String),
    InstanceId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeSessionsRequest",
}) as any as S.Schema<DescribeSessionsRequest>;
export interface DescribeSoftwareAssociationsRequest {
  AssociatedResource: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeSoftwareAssociationsRequest = S.suspend(() =>
  S.Struct({
    AssociatedResource: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeSoftwareAssociationsRequest",
}) as any as S.Schema<DescribeSoftwareAssociationsRequest>;
export interface DescribeStacksRequest {
  Names?: StringList;
  NextToken?: string;
}
export const DescribeStacksRequest = S.suspend(() =>
  S.Struct({
    Names: S.optional(StringList),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeStacksRequest",
}) as any as S.Schema<DescribeStacksRequest>;
export interface DescribeThemeForStackRequest {
  StackName: string;
}
export const DescribeThemeForStackRequest = S.suspend(() =>
  S.Struct({ StackName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeThemeForStackRequest",
}) as any as S.Schema<DescribeThemeForStackRequest>;
export interface DescribeUsageReportSubscriptionsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeUsageReportSubscriptionsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeUsageReportSubscriptionsRequest",
}) as any as S.Schema<DescribeUsageReportSubscriptionsRequest>;
export interface DescribeUsersRequest {
  AuthenticationType: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeUsersRequest = S.suspend(() =>
  S.Struct({
    AuthenticationType: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeUsersRequest",
}) as any as S.Schema<DescribeUsersRequest>;
export interface DescribeUserStackAssociationsRequest {
  StackName?: string;
  UserName?: string | Redacted.Redacted<string>;
  AuthenticationType?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeUserStackAssociationsRequest = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    UserName: S.optional(SensitiveString),
    AuthenticationType: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeUserStackAssociationsRequest",
}) as any as S.Schema<DescribeUserStackAssociationsRequest>;
export interface DisableUserRequest {
  UserName: string | Redacted.Redacted<string>;
  AuthenticationType: string;
}
export const DisableUserRequest = S.suspend(() =>
  S.Struct({ UserName: SensitiveString, AuthenticationType: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisableUserRequest",
}) as any as S.Schema<DisableUserRequest>;
export interface DisableUserResult {}
export const DisableUserResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "DisableUserResult",
}) as any as S.Schema<DisableUserResult>;
export interface DisassociateAppBlockBuilderAppBlockRequest {
  AppBlockArn: string;
  AppBlockBuilderName: string;
}
export const DisassociateAppBlockBuilderAppBlockRequest = S.suspend(() =>
  S.Struct({ AppBlockArn: S.String, AppBlockBuilderName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateAppBlockBuilderAppBlockRequest",
}) as any as S.Schema<DisassociateAppBlockBuilderAppBlockRequest>;
export interface DisassociateAppBlockBuilderAppBlockResult {}
export const DisassociateAppBlockBuilderAppBlockResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateAppBlockBuilderAppBlockResult",
}) as any as S.Schema<DisassociateAppBlockBuilderAppBlockResult>;
export interface DisassociateApplicationFleetRequest {
  FleetName: string;
  ApplicationArn: string;
}
export const DisassociateApplicationFleetRequest = S.suspend(() =>
  S.Struct({ FleetName: S.String, ApplicationArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateApplicationFleetRequest",
}) as any as S.Schema<DisassociateApplicationFleetRequest>;
export interface DisassociateApplicationFleetResult {}
export const DisassociateApplicationFleetResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateApplicationFleetResult",
}) as any as S.Schema<DisassociateApplicationFleetResult>;
export interface DisassociateApplicationFromEntitlementRequest {
  StackName: string;
  EntitlementName: string;
  ApplicationIdentifier: string;
}
export const DisassociateApplicationFromEntitlementRequest = S.suspend(() =>
  S.Struct({
    StackName: S.String,
    EntitlementName: S.String,
    ApplicationIdentifier: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateApplicationFromEntitlementRequest",
}) as any as S.Schema<DisassociateApplicationFromEntitlementRequest>;
export interface DisassociateApplicationFromEntitlementResult {}
export const DisassociateApplicationFromEntitlementResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateApplicationFromEntitlementResult",
}) as any as S.Schema<DisassociateApplicationFromEntitlementResult>;
export interface DisassociateFleetRequest {
  FleetName: string;
  StackName: string;
}
export const DisassociateFleetRequest = S.suspend(() =>
  S.Struct({ FleetName: S.String, StackName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateFleetRequest",
}) as any as S.Schema<DisassociateFleetRequest>;
export interface DisassociateFleetResult {}
export const DisassociateFleetResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateFleetResult",
}) as any as S.Schema<DisassociateFleetResult>;
export interface DisassociateSoftwareFromImageBuilderRequest {
  ImageBuilderName: string;
  SoftwareNames: StringList;
}
export const DisassociateSoftwareFromImageBuilderRequest = S.suspend(() =>
  S.Struct({ ImageBuilderName: S.String, SoftwareNames: StringList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateSoftwareFromImageBuilderRequest",
}) as any as S.Schema<DisassociateSoftwareFromImageBuilderRequest>;
export interface DisassociateSoftwareFromImageBuilderResult {}
export const DisassociateSoftwareFromImageBuilderResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateSoftwareFromImageBuilderResult",
}) as any as S.Schema<DisassociateSoftwareFromImageBuilderResult>;
export interface EnableUserRequest {
  UserName: string | Redacted.Redacted<string>;
  AuthenticationType: string;
}
export const EnableUserRequest = S.suspend(() =>
  S.Struct({ UserName: SensitiveString, AuthenticationType: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "EnableUserRequest",
}) as any as S.Schema<EnableUserRequest>;
export interface EnableUserResult {}
export const EnableUserResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "EnableUserResult",
}) as any as S.Schema<EnableUserResult>;
export interface ExpireSessionRequest {
  SessionId: string;
}
export const ExpireSessionRequest = S.suspend(() =>
  S.Struct({ SessionId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ExpireSessionRequest",
}) as any as S.Schema<ExpireSessionRequest>;
export interface ExpireSessionResult {}
export const ExpireSessionResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "ExpireSessionResult",
}) as any as S.Schema<ExpireSessionResult>;
export interface GetExportImageTaskRequest {
  TaskId?: string;
}
export const GetExportImageTaskRequest = S.suspend(() =>
  S.Struct({ TaskId: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetExportImageTaskRequest",
}) as any as S.Schema<GetExportImageTaskRequest>;
export interface ListAssociatedFleetsRequest {
  StackName: string;
  NextToken?: string;
}
export const ListAssociatedFleetsRequest = S.suspend(() =>
  S.Struct({ StackName: S.String, NextToken: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAssociatedFleetsRequest",
}) as any as S.Schema<ListAssociatedFleetsRequest>;
export interface ListAssociatedStacksRequest {
  FleetName: string;
  NextToken?: string;
}
export const ListAssociatedStacksRequest = S.suspend(() =>
  S.Struct({ FleetName: S.String, NextToken: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAssociatedStacksRequest",
}) as any as S.Schema<ListAssociatedStacksRequest>;
export interface ListEntitledApplicationsRequest {
  StackName: string;
  EntitlementName: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListEntitledApplicationsRequest = S.suspend(() =>
  S.Struct({
    StackName: S.String,
    EntitlementName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListEntitledApplicationsRequest",
}) as any as S.Schema<ListEntitledApplicationsRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface StartAppBlockBuilderRequest {
  Name: string;
}
export const StartAppBlockBuilderRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartAppBlockBuilderRequest",
}) as any as S.Schema<StartAppBlockBuilderRequest>;
export interface StartFleetRequest {
  Name: string;
}
export const StartFleetRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartFleetRequest",
}) as any as S.Schema<StartFleetRequest>;
export interface StartFleetResult {}
export const StartFleetResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "StartFleetResult",
}) as any as S.Schema<StartFleetResult>;
export interface StartImageBuilderRequest {
  Name: string;
  AppstreamAgentVersion?: string;
}
export const StartImageBuilderRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    AppstreamAgentVersion: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartImageBuilderRequest",
}) as any as S.Schema<StartImageBuilderRequest>;
export interface StartSoftwareDeploymentToImageBuilderRequest {
  ImageBuilderName: string;
  RetryFailedDeployments?: boolean;
}
export const StartSoftwareDeploymentToImageBuilderRequest = S.suspend(() =>
  S.Struct({
    ImageBuilderName: S.String,
    RetryFailedDeployments: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartSoftwareDeploymentToImageBuilderRequest",
}) as any as S.Schema<StartSoftwareDeploymentToImageBuilderRequest>;
export interface StartSoftwareDeploymentToImageBuilderResult {}
export const StartSoftwareDeploymentToImageBuilderResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StartSoftwareDeploymentToImageBuilderResult",
}) as any as S.Schema<StartSoftwareDeploymentToImageBuilderResult>;
export interface StopAppBlockBuilderRequest {
  Name: string;
}
export const StopAppBlockBuilderRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopAppBlockBuilderRequest",
}) as any as S.Schema<StopAppBlockBuilderRequest>;
export interface StopFleetRequest {
  Name: string;
}
export const StopFleetRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopFleetRequest",
}) as any as S.Schema<StopFleetRequest>;
export interface StopFleetResult {}
export const StopFleetResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "StopFleetResult",
}) as any as S.Schema<StopFleetResult>;
export interface StopImageBuilderRequest {
  Name: string;
}
export const StopImageBuilderRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopImageBuilderRequest",
}) as any as S.Schema<StopImageBuilderRequest>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: Tags }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagKeys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateAppBlockBuilderRequest {
  Name: string;
  Description?: string;
  DisplayName?: string;
  Platform?: string;
  InstanceType?: string;
  VpcConfig?: VpcConfig;
  EnableDefaultInternetAccess?: boolean;
  IamRoleArn?: string;
  AccessEndpoints?: AccessEndpointList;
  AttributesToDelete?: AppBlockBuilderAttributes;
}
export const UpdateAppBlockBuilderRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    DisplayName: S.optional(S.String),
    Platform: S.optional(S.String),
    InstanceType: S.optional(S.String),
    VpcConfig: S.optional(VpcConfig),
    EnableDefaultInternetAccess: S.optional(S.Boolean),
    IamRoleArn: S.optional(S.String),
    AccessEndpoints: S.optional(AccessEndpointList),
    AttributesToDelete: S.optional(AppBlockBuilderAttributes),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateAppBlockBuilderRequest",
}) as any as S.Schema<UpdateAppBlockBuilderRequest>;
export interface UpdateApplicationRequest {
  Name: string;
  DisplayName?: string;
  Description?: string;
  IconS3Location?: S3Location;
  LaunchPath?: string;
  WorkingDirectory?: string;
  LaunchParameters?: string;
  AppBlockArn?: string;
  AttributesToDelete?: ApplicationAttributes;
}
export const UpdateApplicationRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    DisplayName: S.optional(S.String),
    Description: S.optional(S.String),
    IconS3Location: S.optional(S3Location),
    LaunchPath: S.optional(S.String),
    WorkingDirectory: S.optional(S.String),
    LaunchParameters: S.optional(S.String),
    AppBlockArn: S.optional(S.String),
    AttributesToDelete: S.optional(ApplicationAttributes),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateApplicationRequest",
}) as any as S.Schema<UpdateApplicationRequest>;
export interface ServiceAccountCredentials {
  AccountName: string | Redacted.Redacted<string>;
  AccountPassword: string | Redacted.Redacted<string>;
}
export const ServiceAccountCredentials = S.suspend(() =>
  S.Struct({ AccountName: SensitiveString, AccountPassword: SensitiveString }),
).annotations({
  identifier: "ServiceAccountCredentials",
}) as any as S.Schema<ServiceAccountCredentials>;
export interface CertificateBasedAuthProperties {
  Status?: string;
  CertificateAuthorityArn?: string;
}
export const CertificateBasedAuthProperties = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    CertificateAuthorityArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CertificateBasedAuthProperties",
}) as any as S.Schema<CertificateBasedAuthProperties>;
export interface UpdateDirectoryConfigRequest {
  DirectoryName: string;
  OrganizationalUnitDistinguishedNames?: OrganizationalUnitDistinguishedNamesList;
  ServiceAccountCredentials?: ServiceAccountCredentials;
  CertificateBasedAuthProperties?: CertificateBasedAuthProperties;
}
export const UpdateDirectoryConfigRequest = S.suspend(() =>
  S.Struct({
    DirectoryName: S.String,
    OrganizationalUnitDistinguishedNames: S.optional(
      OrganizationalUnitDistinguishedNamesList,
    ),
    ServiceAccountCredentials: S.optional(ServiceAccountCredentials),
    CertificateBasedAuthProperties: S.optional(CertificateBasedAuthProperties),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateDirectoryConfigRequest",
}) as any as S.Schema<UpdateDirectoryConfigRequest>;
export interface EntitlementAttribute {
  Name: string;
  Value: string;
}
export const EntitlementAttribute = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({
  identifier: "EntitlementAttribute",
}) as any as S.Schema<EntitlementAttribute>;
export type EntitlementAttributeList = EntitlementAttribute[];
export const EntitlementAttributeList = S.Array(EntitlementAttribute);
export interface UpdateEntitlementRequest {
  Name: string;
  StackName: string;
  Description?: string;
  AppVisibility?: string;
  Attributes?: EntitlementAttributeList;
}
export const UpdateEntitlementRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    StackName: S.String,
    Description: S.optional(S.String),
    AppVisibility: S.optional(S.String),
    Attributes: S.optional(EntitlementAttributeList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateEntitlementRequest",
}) as any as S.Schema<UpdateEntitlementRequest>;
export interface ComputeCapacity {
  DesiredInstances?: number;
  DesiredSessions?: number;
}
export const ComputeCapacity = S.suspend(() =>
  S.Struct({
    DesiredInstances: S.optional(S.Number),
    DesiredSessions: S.optional(S.Number),
  }),
).annotations({
  identifier: "ComputeCapacity",
}) as any as S.Schema<ComputeCapacity>;
export interface UpdateFleetRequest {
  ImageName?: string;
  ImageArn?: string;
  Name?: string;
  InstanceType?: string;
  ComputeCapacity?: ComputeCapacity;
  VpcConfig?: VpcConfig;
  MaxUserDurationInSeconds?: number;
  DisconnectTimeoutInSeconds?: number;
  DeleteVpcConfig?: boolean;
  Description?: string;
  DisplayName?: string;
  EnableDefaultInternetAccess?: boolean;
  DomainJoinInfo?: DomainJoinInfo;
  IdleDisconnectTimeoutInSeconds?: number;
  AttributesToDelete?: FleetAttributes;
  IamRoleArn?: string;
  StreamView?: string;
  Platform?: string;
  MaxConcurrentSessions?: number;
  UsbDeviceFilterStrings?: UsbDeviceFilterStrings;
  SessionScriptS3Location?: S3Location;
  MaxSessionsPerInstance?: number;
  RootVolumeConfig?: VolumeConfig;
}
export const UpdateFleetRequest = S.suspend(() =>
  S.Struct({
    ImageName: S.optional(S.String),
    ImageArn: S.optional(S.String),
    Name: S.optional(S.String),
    InstanceType: S.optional(S.String),
    ComputeCapacity: S.optional(ComputeCapacity),
    VpcConfig: S.optional(VpcConfig),
    MaxUserDurationInSeconds: S.optional(S.Number),
    DisconnectTimeoutInSeconds: S.optional(S.Number),
    DeleteVpcConfig: S.optional(S.Boolean),
    Description: S.optional(S.String),
    DisplayName: S.optional(S.String),
    EnableDefaultInternetAccess: S.optional(S.Boolean),
    DomainJoinInfo: S.optional(DomainJoinInfo),
    IdleDisconnectTimeoutInSeconds: S.optional(S.Number),
    AttributesToDelete: S.optional(FleetAttributes),
    IamRoleArn: S.optional(S.String),
    StreamView: S.optional(S.String),
    Platform: S.optional(S.String),
    MaxConcurrentSessions: S.optional(S.Number),
    UsbDeviceFilterStrings: S.optional(UsbDeviceFilterStrings),
    SessionScriptS3Location: S.optional(S3Location),
    MaxSessionsPerInstance: S.optional(S.Number),
    RootVolumeConfig: S.optional(VolumeConfig),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateFleetRequest",
}) as any as S.Schema<UpdateFleetRequest>;
export type DomainList = string[];
export const DomainList = S.Array(S.String);
export interface StorageConnector {
  ConnectorType: string;
  ResourceIdentifier?: string;
  Domains?: DomainList;
  DomainsRequireAdminConsent?: DomainList;
}
export const StorageConnector = S.suspend(() =>
  S.Struct({
    ConnectorType: S.String,
    ResourceIdentifier: S.optional(S.String),
    Domains: S.optional(DomainList),
    DomainsRequireAdminConsent: S.optional(DomainList),
  }),
).annotations({
  identifier: "StorageConnector",
}) as any as S.Schema<StorageConnector>;
export type StorageConnectorList = StorageConnector[];
export const StorageConnectorList = S.Array(StorageConnector);
export interface UserSetting {
  Action: string;
  Permission: string;
  MaximumLength?: number;
}
export const UserSetting = S.suspend(() =>
  S.Struct({
    Action: S.String,
    Permission: S.String,
    MaximumLength: S.optional(S.Number),
  }),
).annotations({ identifier: "UserSetting" }) as any as S.Schema<UserSetting>;
export type UserSettingList = UserSetting[];
export const UserSettingList = S.Array(UserSetting);
export interface ApplicationSettings {
  Enabled: boolean;
  SettingsGroup?: string;
}
export const ApplicationSettings = S.suspend(() =>
  S.Struct({ Enabled: S.Boolean, SettingsGroup: S.optional(S.String) }),
).annotations({
  identifier: "ApplicationSettings",
}) as any as S.Schema<ApplicationSettings>;
export interface StreamingExperienceSettings {
  PreferredProtocol?: string;
}
export const StreamingExperienceSettings = S.suspend(() =>
  S.Struct({ PreferredProtocol: S.optional(S.String) }),
).annotations({
  identifier: "StreamingExperienceSettings",
}) as any as S.Schema<StreamingExperienceSettings>;
export interface UpdateStackRequest {
  DisplayName?: string;
  Description?: string;
  Name: string;
  StorageConnectors?: StorageConnectorList;
  DeleteStorageConnectors?: boolean;
  RedirectURL?: string;
  FeedbackURL?: string;
  AttributesToDelete?: StackAttributes;
  UserSettings?: UserSettingList;
  ApplicationSettings?: ApplicationSettings;
  AccessEndpoints?: AccessEndpointList;
  EmbedHostDomains?: EmbedHostDomains;
  StreamingExperienceSettings?: StreamingExperienceSettings;
}
export const UpdateStackRequest = S.suspend(() =>
  S.Struct({
    DisplayName: S.optional(S.String),
    Description: S.optional(S.String),
    Name: S.String,
    StorageConnectors: S.optional(StorageConnectorList),
    DeleteStorageConnectors: S.optional(S.Boolean),
    RedirectURL: S.optional(S.String),
    FeedbackURL: S.optional(S.String),
    AttributesToDelete: S.optional(StackAttributes),
    UserSettings: S.optional(UserSettingList),
    ApplicationSettings: S.optional(ApplicationSettings),
    AccessEndpoints: S.optional(AccessEndpointList),
    EmbedHostDomains: S.optional(EmbedHostDomains),
    StreamingExperienceSettings: S.optional(StreamingExperienceSettings),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateStackRequest",
}) as any as S.Schema<UpdateStackRequest>;
export interface ThemeFooterLink {
  DisplayName?: string;
  FooterLinkURL?: string;
}
export const ThemeFooterLink = S.suspend(() =>
  S.Struct({
    DisplayName: S.optional(S.String),
    FooterLinkURL: S.optional(S.String),
  }),
).annotations({
  identifier: "ThemeFooterLink",
}) as any as S.Schema<ThemeFooterLink>;
export type ThemeFooterLinks = ThemeFooterLink[];
export const ThemeFooterLinks = S.Array(ThemeFooterLink);
export interface UpdateThemeForStackRequest {
  StackName: string;
  FooterLinks?: ThemeFooterLinks;
  TitleText?: string;
  ThemeStyling?: string;
  OrganizationLogoS3Location?: S3Location;
  FaviconS3Location?: S3Location;
  State?: string;
  AttributesToDelete?: ThemeAttributes;
}
export const UpdateThemeForStackRequest = S.suspend(() =>
  S.Struct({
    StackName: S.String,
    FooterLinks: S.optional(ThemeFooterLinks),
    TitleText: S.optional(S.String),
    ThemeStyling: S.optional(S.String),
    OrganizationLogoS3Location: S.optional(S3Location),
    FaviconS3Location: S.optional(S3Location),
    State: S.optional(S.String),
    AttributesToDelete: S.optional(ThemeAttributes),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateThemeForStackRequest",
}) as any as S.Schema<UpdateThemeForStackRequest>;
export type FilterValues = string[];
export const FilterValues = S.Array(S.String);
export interface ScriptDetails {
  ScriptS3Location: S3Location;
  ExecutablePath: string;
  ExecutableParameters?: string;
  TimeoutInSeconds: number;
}
export const ScriptDetails = S.suspend(() =>
  S.Struct({
    ScriptS3Location: S3Location,
    ExecutablePath: S.String,
    ExecutableParameters: S.optional(S.String),
    TimeoutInSeconds: S.Number,
  }),
).annotations({
  identifier: "ScriptDetails",
}) as any as S.Schema<ScriptDetails>;
export interface RuntimeValidationConfig {
  IntendedInstanceType?: string;
}
export const RuntimeValidationConfig = S.suspend(() =>
  S.Struct({ IntendedInstanceType: S.optional(S.String) }),
).annotations({
  identifier: "RuntimeValidationConfig",
}) as any as S.Schema<RuntimeValidationConfig>;
export interface ApplicationConfig {
  Name: string;
  DisplayName?: string;
  AbsoluteAppPath: string | Redacted.Redacted<string>;
  AbsoluteIconPath?: string | Redacted.Redacted<string>;
  AbsoluteManifestPath?: string | Redacted.Redacted<string>;
  WorkingDirectory?: string | Redacted.Redacted<string>;
  LaunchParameters?: string | Redacted.Redacted<string>;
}
export const ApplicationConfig = S.suspend(() =>
  S.Struct({
    Name: S.String,
    DisplayName: S.optional(S.String),
    AbsoluteAppPath: SensitiveString,
    AbsoluteIconPath: S.optional(SensitiveString),
    AbsoluteManifestPath: S.optional(SensitiveString),
    WorkingDirectory: S.optional(SensitiveString),
    LaunchParameters: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ApplicationConfig",
}) as any as S.Schema<ApplicationConfig>;
export type AppCatalogConfig = ApplicationConfig[];
export const AppCatalogConfig = S.Array(ApplicationConfig);
export interface AppBlockBuilderAppBlockAssociation {
  AppBlockArn: string;
  AppBlockBuilderName: string;
}
export const AppBlockBuilderAppBlockAssociation = S.suspend(() =>
  S.Struct({ AppBlockArn: S.String, AppBlockBuilderName: S.String }),
).annotations({
  identifier: "AppBlockBuilderAppBlockAssociation",
}) as any as S.Schema<AppBlockBuilderAppBlockAssociation>;
export type AppBlockBuilderAppBlockAssociationsList =
  AppBlockBuilderAppBlockAssociation[];
export const AppBlockBuilderAppBlockAssociationsList = S.Array(
  AppBlockBuilderAppBlockAssociation,
);
export interface ApplicationFleetAssociation {
  FleetName: string;
  ApplicationArn: string;
}
export const ApplicationFleetAssociation = S.suspend(() =>
  S.Struct({ FleetName: S.String, ApplicationArn: S.String }),
).annotations({
  identifier: "ApplicationFleetAssociation",
}) as any as S.Schema<ApplicationFleetAssociation>;
export type ApplicationFleetAssociationList = ApplicationFleetAssociation[];
export const ApplicationFleetAssociationList = S.Array(
  ApplicationFleetAssociation,
);
export type Metadata = { [key: string]: string };
export const Metadata = S.Record({ key: S.String, value: S.String });
export interface Application {
  Name?: string;
  DisplayName?: string;
  IconURL?: string;
  LaunchPath?: string;
  LaunchParameters?: string;
  Enabled?: boolean;
  Metadata?: Metadata;
  WorkingDirectory?: string;
  Description?: string;
  Arn?: string;
  AppBlockArn?: string;
  IconS3Location?: S3Location;
  Platforms?: Platforms;
  InstanceFamilies?: StringList;
  CreatedTime?: Date;
}
export const Application = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    DisplayName: S.optional(S.String),
    IconURL: S.optional(S.String),
    LaunchPath: S.optional(S.String),
    LaunchParameters: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
    Metadata: S.optional(Metadata),
    WorkingDirectory: S.optional(S.String),
    Description: S.optional(S.String),
    Arn: S.optional(S.String),
    AppBlockArn: S.optional(S.String),
    IconS3Location: S.optional(S3Location),
    Platforms: S.optional(Platforms),
    InstanceFamilies: S.optional(StringList),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Application" }) as any as S.Schema<Application>;
export type Applications = Application[];
export const Applications = S.Array(Application);
export interface ImageBuilderStateChangeReason {
  Code?: string;
  Message?: string;
}
export const ImageBuilderStateChangeReason = S.suspend(() =>
  S.Struct({ Code: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({
  identifier: "ImageBuilderStateChangeReason",
}) as any as S.Schema<ImageBuilderStateChangeReason>;
export interface NetworkAccessConfiguration {
  EniPrivateIpAddress?: string;
  EniIpv6Addresses?: StringList;
  EniId?: string;
}
export const NetworkAccessConfiguration = S.suspend(() =>
  S.Struct({
    EniPrivateIpAddress: S.optional(S.String),
    EniIpv6Addresses: S.optional(StringList),
    EniId: S.optional(S.String),
  }),
).annotations({
  identifier: "NetworkAccessConfiguration",
}) as any as S.Schema<NetworkAccessConfiguration>;
export interface ResourceError {
  ErrorCode?: string;
  ErrorMessage?: string;
  ErrorTimestamp?: Date;
}
export const ResourceError = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
    ErrorTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ResourceError",
}) as any as S.Schema<ResourceError>;
export type ResourceErrors = ResourceError[];
export const ResourceErrors = S.Array(ResourceError);
export interface ImageBuilder {
  Name: string;
  Arn?: string;
  ImageArn?: string;
  Description?: string;
  DisplayName?: string;
  VpcConfig?: VpcConfig;
  InstanceType?: string;
  Platform?: string;
  IamRoleArn?: string;
  State?: string;
  StateChangeReason?: ImageBuilderStateChangeReason;
  CreatedTime?: Date;
  EnableDefaultInternetAccess?: boolean;
  DomainJoinInfo?: DomainJoinInfo;
  NetworkAccessConfiguration?: NetworkAccessConfiguration;
  ImageBuilderErrors?: ResourceErrors;
  AppstreamAgentVersion?: string;
  AccessEndpoints?: AccessEndpointList;
  RootVolumeConfig?: VolumeConfig;
  LatestAppstreamAgentVersion?: string;
}
export const ImageBuilder = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Arn: S.optional(S.String),
    ImageArn: S.optional(S.String),
    Description: S.optional(S.String),
    DisplayName: S.optional(S.String),
    VpcConfig: S.optional(VpcConfig),
    InstanceType: S.optional(S.String),
    Platform: S.optional(S.String),
    IamRoleArn: S.optional(S.String),
    State: S.optional(S.String),
    StateChangeReason: S.optional(ImageBuilderStateChangeReason),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EnableDefaultInternetAccess: S.optional(S.Boolean),
    DomainJoinInfo: S.optional(DomainJoinInfo),
    NetworkAccessConfiguration: S.optional(NetworkAccessConfiguration),
    ImageBuilderErrors: S.optional(ResourceErrors),
    AppstreamAgentVersion: S.optional(S.String),
    AccessEndpoints: S.optional(AccessEndpointList),
    RootVolumeConfig: S.optional(VolumeConfig),
    LatestAppstreamAgentVersion: S.optional(S.String),
  }),
).annotations({ identifier: "ImageBuilder" }) as any as S.Schema<ImageBuilder>;
export type ImageBuilderList = ImageBuilder[];
export const ImageBuilderList = S.Array(ImageBuilder);
export interface ImageStateChangeReason {
  Code?: string;
  Message?: string;
}
export const ImageStateChangeReason = S.suspend(() =>
  S.Struct({ Code: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({
  identifier: "ImageStateChangeReason",
}) as any as S.Schema<ImageStateChangeReason>;
export interface ImagePermissions {
  allowFleet?: boolean;
  allowImageBuilder?: boolean;
}
export const ImagePermissions = S.suspend(() =>
  S.Struct({
    allowFleet: S.optional(S.Boolean),
    allowImageBuilder: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ImagePermissions",
}) as any as S.Schema<ImagePermissions>;
export interface Image {
  Name: string;
  Arn?: string;
  BaseImageArn?: string;
  DisplayName?: string;
  State?: string;
  Visibility?: string;
  ImageBuilderSupported?: boolean;
  ImageBuilderName?: string;
  Platform?: string;
  Description?: string;
  StateChangeReason?: ImageStateChangeReason;
  Applications?: Applications;
  CreatedTime?: Date;
  PublicBaseImageReleasedDate?: Date;
  AppstreamAgentVersion?: string;
  ImagePermissions?: ImagePermissions;
  ImageErrors?: ResourceErrors;
  LatestAppstreamAgentVersion?: string;
  SupportedInstanceFamilies?: StringList;
  DynamicAppProvidersEnabled?: string;
  ImageSharedWithOthers?: string;
  ManagedSoftwareIncluded?: boolean;
  ImageType?: string;
}
export const Image = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Arn: S.optional(S.String),
    BaseImageArn: S.optional(S.String),
    DisplayName: S.optional(S.String),
    State: S.optional(S.String),
    Visibility: S.optional(S.String),
    ImageBuilderSupported: S.optional(S.Boolean),
    ImageBuilderName: S.optional(S.String),
    Platform: S.optional(S.String),
    Description: S.optional(S.String),
    StateChangeReason: S.optional(ImageStateChangeReason),
    Applications: S.optional(Applications),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    PublicBaseImageReleasedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AppstreamAgentVersion: S.optional(S.String),
    ImagePermissions: S.optional(ImagePermissions),
    ImageErrors: S.optional(ResourceErrors),
    LatestAppstreamAgentVersion: S.optional(S.String),
    SupportedInstanceFamilies: S.optional(StringList),
    DynamicAppProvidersEnabled: S.optional(S.String),
    ImageSharedWithOthers: S.optional(S.String),
    ManagedSoftwareIncluded: S.optional(S.Boolean),
    ImageType: S.optional(S.String),
  }),
).annotations({ identifier: "Image" }) as any as S.Schema<Image>;
export type ImageList = Image[];
export const ImageList = S.Array(Image);
export interface Filter {
  Name: string;
  Values: FilterValues;
}
export const Filter = S.suspend(() =>
  S.Struct({ Name: S.String, Values: FilterValues }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type Filters = Filter[];
export const Filters = S.Array(Filter);
export interface BatchAssociateUserStackRequest {
  UserStackAssociations: UserStackAssociationList;
}
export const BatchAssociateUserStackRequest = S.suspend(() =>
  S.Struct({ UserStackAssociations: UserStackAssociationList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchAssociateUserStackRequest",
}) as any as S.Schema<BatchAssociateUserStackRequest>;
export interface CopyImageResponse {
  DestinationImageName?: string;
}
export const CopyImageResponse = S.suspend(() =>
  S.Struct({ DestinationImageName: S.optional(S.String) }),
).annotations({
  identifier: "CopyImageResponse",
}) as any as S.Schema<CopyImageResponse>;
export interface CreateAppBlockRequest {
  Name: string;
  Description?: string;
  DisplayName?: string;
  SourceS3Location: S3Location;
  SetupScriptDetails?: ScriptDetails;
  Tags?: Tags;
  PostSetupScriptDetails?: ScriptDetails;
  PackagingType?: string;
}
export const CreateAppBlockRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    DisplayName: S.optional(S.String),
    SourceS3Location: S3Location,
    SetupScriptDetails: S.optional(ScriptDetails),
    Tags: S.optional(Tags),
    PostSetupScriptDetails: S.optional(ScriptDetails),
    PackagingType: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAppBlockRequest",
}) as any as S.Schema<CreateAppBlockRequest>;
export interface CreateAppBlockBuilderRequest {
  Name: string;
  Description?: string;
  DisplayName?: string;
  Tags?: Tags;
  Platform: string;
  InstanceType: string;
  VpcConfig: VpcConfig;
  EnableDefaultInternetAccess?: boolean;
  IamRoleArn?: string;
  AccessEndpoints?: AccessEndpointList;
}
export const CreateAppBlockBuilderRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    DisplayName: S.optional(S.String),
    Tags: S.optional(Tags),
    Platform: S.String,
    InstanceType: S.String,
    VpcConfig: VpcConfig,
    EnableDefaultInternetAccess: S.optional(S.Boolean),
    IamRoleArn: S.optional(S.String),
    AccessEndpoints: S.optional(AccessEndpointList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAppBlockBuilderRequest",
}) as any as S.Schema<CreateAppBlockBuilderRequest>;
export interface CreateAppBlockBuilderStreamingURLResult {
  StreamingURL?: string;
  Expires?: Date;
}
export const CreateAppBlockBuilderStreamingURLResult = S.suspend(() =>
  S.Struct({
    StreamingURL: S.optional(S.String),
    Expires: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "CreateAppBlockBuilderStreamingURLResult",
}) as any as S.Schema<CreateAppBlockBuilderStreamingURLResult>;
export interface CreateDirectoryConfigRequest {
  DirectoryName: string;
  OrganizationalUnitDistinguishedNames: OrganizationalUnitDistinguishedNamesList;
  ServiceAccountCredentials?: ServiceAccountCredentials;
  CertificateBasedAuthProperties?: CertificateBasedAuthProperties;
}
export const CreateDirectoryConfigRequest = S.suspend(() =>
  S.Struct({
    DirectoryName: S.String,
    OrganizationalUnitDistinguishedNames:
      OrganizationalUnitDistinguishedNamesList,
    ServiceAccountCredentials: S.optional(ServiceAccountCredentials),
    CertificateBasedAuthProperties: S.optional(CertificateBasedAuthProperties),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateDirectoryConfigRequest",
}) as any as S.Schema<CreateDirectoryConfigRequest>;
export interface CreateEntitlementRequest {
  Name: string;
  StackName: string;
  Description?: string;
  AppVisibility: string;
  Attributes: EntitlementAttributeList;
}
export const CreateEntitlementRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    StackName: S.String,
    Description: S.optional(S.String),
    AppVisibility: S.String,
    Attributes: EntitlementAttributeList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateEntitlementRequest",
}) as any as S.Schema<CreateEntitlementRequest>;
export interface CreateFleetRequest {
  Name: string;
  ImageName?: string;
  ImageArn?: string;
  InstanceType: string;
  FleetType?: string;
  ComputeCapacity?: ComputeCapacity;
  VpcConfig?: VpcConfig;
  MaxUserDurationInSeconds?: number;
  DisconnectTimeoutInSeconds?: number;
  Description?: string;
  DisplayName?: string;
  EnableDefaultInternetAccess?: boolean;
  DomainJoinInfo?: DomainJoinInfo;
  Tags?: Tags;
  IdleDisconnectTimeoutInSeconds?: number;
  IamRoleArn?: string;
  StreamView?: string;
  Platform?: string;
  MaxConcurrentSessions?: number;
  UsbDeviceFilterStrings?: UsbDeviceFilterStrings;
  SessionScriptS3Location?: S3Location;
  MaxSessionsPerInstance?: number;
  RootVolumeConfig?: VolumeConfig;
}
export const CreateFleetRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ImageName: S.optional(S.String),
    ImageArn: S.optional(S.String),
    InstanceType: S.String,
    FleetType: S.optional(S.String),
    ComputeCapacity: S.optional(ComputeCapacity),
    VpcConfig: S.optional(VpcConfig),
    MaxUserDurationInSeconds: S.optional(S.Number),
    DisconnectTimeoutInSeconds: S.optional(S.Number),
    Description: S.optional(S.String),
    DisplayName: S.optional(S.String),
    EnableDefaultInternetAccess: S.optional(S.Boolean),
    DomainJoinInfo: S.optional(DomainJoinInfo),
    Tags: S.optional(Tags),
    IdleDisconnectTimeoutInSeconds: S.optional(S.Number),
    IamRoleArn: S.optional(S.String),
    StreamView: S.optional(S.String),
    Platform: S.optional(S.String),
    MaxConcurrentSessions: S.optional(S.Number),
    UsbDeviceFilterStrings: S.optional(UsbDeviceFilterStrings),
    SessionScriptS3Location: S.optional(S3Location),
    MaxSessionsPerInstance: S.optional(S.Number),
    RootVolumeConfig: S.optional(VolumeConfig),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateFleetRequest",
}) as any as S.Schema<CreateFleetRequest>;
export interface CreateImageBuilderStreamingURLResult {
  StreamingURL?: string;
  Expires?: Date;
}
export const CreateImageBuilderStreamingURLResult = S.suspend(() =>
  S.Struct({
    StreamingURL: S.optional(S.String),
    Expires: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "CreateImageBuilderStreamingURLResult",
}) as any as S.Schema<CreateImageBuilderStreamingURLResult>;
export interface CreateImportedImageRequest {
  Name: string;
  SourceAmiId: string;
  IamRoleArn: string;
  Description?: string;
  DisplayName?: string;
  Tags?: Tags;
  RuntimeValidationConfig?: RuntimeValidationConfig;
  AgentSoftwareVersion?: string;
  AppCatalogConfig?: AppCatalogConfig;
  DryRun?: boolean;
}
export const CreateImportedImageRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    SourceAmiId: S.String,
    IamRoleArn: S.String,
    Description: S.optional(S.String),
    DisplayName: S.optional(S.String),
    Tags: S.optional(Tags),
    RuntimeValidationConfig: S.optional(RuntimeValidationConfig),
    AgentSoftwareVersion: S.optional(S.String),
    AppCatalogConfig: S.optional(AppCatalogConfig),
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateImportedImageRequest",
}) as any as S.Schema<CreateImportedImageRequest>;
export interface CreateStackRequest {
  Name: string;
  Description?: string;
  DisplayName?: string;
  StorageConnectors?: StorageConnectorList;
  RedirectURL?: string;
  FeedbackURL?: string;
  UserSettings?: UserSettingList;
  ApplicationSettings?: ApplicationSettings;
  Tags?: Tags;
  AccessEndpoints?: AccessEndpointList;
  EmbedHostDomains?: EmbedHostDomains;
  StreamingExperienceSettings?: StreamingExperienceSettings;
}
export const CreateStackRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    DisplayName: S.optional(S.String),
    StorageConnectors: S.optional(StorageConnectorList),
    RedirectURL: S.optional(S.String),
    FeedbackURL: S.optional(S.String),
    UserSettings: S.optional(UserSettingList),
    ApplicationSettings: S.optional(ApplicationSettings),
    Tags: S.optional(Tags),
    AccessEndpoints: S.optional(AccessEndpointList),
    EmbedHostDomains: S.optional(EmbedHostDomains),
    StreamingExperienceSettings: S.optional(StreamingExperienceSettings),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateStackRequest",
}) as any as S.Schema<CreateStackRequest>;
export interface CreateStreamingURLResult {
  StreamingURL?: string;
  Expires?: Date;
}
export const CreateStreamingURLResult = S.suspend(() =>
  S.Struct({
    StreamingURL: S.optional(S.String),
    Expires: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "CreateStreamingURLResult",
}) as any as S.Schema<CreateStreamingURLResult>;
export interface CreateThemeForStackRequest {
  StackName: string;
  FooterLinks?: ThemeFooterLinks;
  TitleText: string;
  ThemeStyling: string;
  OrganizationLogoS3Location: S3Location;
  FaviconS3Location: S3Location;
}
export const CreateThemeForStackRequest = S.suspend(() =>
  S.Struct({
    StackName: S.String,
    FooterLinks: S.optional(ThemeFooterLinks),
    TitleText: S.String,
    ThemeStyling: S.String,
    OrganizationLogoS3Location: S3Location,
    FaviconS3Location: S3Location,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateThemeForStackRequest",
}) as any as S.Schema<CreateThemeForStackRequest>;
export interface DeleteImageResult {
  Image?: Image;
}
export const DeleteImageResult = S.suspend(() =>
  S.Struct({ Image: S.optional(Image) }),
).annotations({
  identifier: "DeleteImageResult",
}) as any as S.Schema<DeleteImageResult>;
export interface DeleteImageBuilderResult {
  ImageBuilder?: ImageBuilder;
}
export const DeleteImageBuilderResult = S.suspend(() =>
  S.Struct({ ImageBuilder: S.optional(ImageBuilder) }),
).annotations({
  identifier: "DeleteImageBuilderResult",
}) as any as S.Schema<DeleteImageBuilderResult>;
export interface DescribeAppBlockBuilderAppBlockAssociationsResult {
  AppBlockBuilderAppBlockAssociations?: AppBlockBuilderAppBlockAssociationsList;
  NextToken?: string;
}
export const DescribeAppBlockBuilderAppBlockAssociationsResult = S.suspend(() =>
  S.Struct({
    AppBlockBuilderAppBlockAssociations: S.optional(
      AppBlockBuilderAppBlockAssociationsList,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeAppBlockBuilderAppBlockAssociationsResult",
}) as any as S.Schema<DescribeAppBlockBuilderAppBlockAssociationsResult>;
export interface DescribeApplicationFleetAssociationsResult {
  ApplicationFleetAssociations?: ApplicationFleetAssociationList;
  NextToken?: string;
}
export const DescribeApplicationFleetAssociationsResult = S.suspend(() =>
  S.Struct({
    ApplicationFleetAssociations: S.optional(ApplicationFleetAssociationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeApplicationFleetAssociationsResult",
}) as any as S.Schema<DescribeApplicationFleetAssociationsResult>;
export interface DescribeApplicationsResult {
  Applications?: Applications;
  NextToken?: string;
}
export const DescribeApplicationsResult = S.suspend(() =>
  S.Struct({
    Applications: S.optional(Applications),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeApplicationsResult",
}) as any as S.Schema<DescribeApplicationsResult>;
export interface DescribeImageBuildersResult {
  ImageBuilders?: ImageBuilderList;
  NextToken?: string;
}
export const DescribeImageBuildersResult = S.suspend(() =>
  S.Struct({
    ImageBuilders: S.optional(ImageBuilderList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeImageBuildersResult",
}) as any as S.Schema<DescribeImageBuildersResult>;
export interface DescribeImagesResult {
  Images?: ImageList;
  NextToken?: string;
}
export const DescribeImagesResult = S.suspend(() =>
  S.Struct({ Images: S.optional(ImageList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "DescribeImagesResult",
}) as any as S.Schema<DescribeImagesResult>;
export interface DescribeUserStackAssociationsResult {
  UserStackAssociations?: UserStackAssociationList;
  NextToken?: string;
}
export const DescribeUserStackAssociationsResult = S.suspend(() =>
  S.Struct({
    UserStackAssociations: S.optional(UserStackAssociationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeUserStackAssociationsResult",
}) as any as S.Schema<DescribeUserStackAssociationsResult>;
export interface ErrorDetails {
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const ErrorDetails = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "ErrorDetails" }) as any as S.Schema<ErrorDetails>;
export type ErrorDetailsList = ErrorDetails[];
export const ErrorDetailsList = S.Array(ErrorDetails);
export interface ExportImageTask {
  TaskId: string;
  ImageArn: string;
  AmiName: string;
  CreatedDate: Date;
  AmiDescription?: string;
  State?: string;
  AmiId?: string;
  TagSpecifications?: Tags;
  ErrorDetails?: ErrorDetailsList;
}
export const ExportImageTask = S.suspend(() =>
  S.Struct({
    TaskId: S.String,
    ImageArn: S.String,
    AmiName: S.String,
    CreatedDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    AmiDescription: S.optional(S.String),
    State: S.optional(S.String),
    AmiId: S.optional(S.String),
    TagSpecifications: S.optional(Tags),
    ErrorDetails: S.optional(ErrorDetailsList),
  }),
).annotations({
  identifier: "ExportImageTask",
}) as any as S.Schema<ExportImageTask>;
export interface GetExportImageTaskResult {
  ExportImageTask?: ExportImageTask;
}
export const GetExportImageTaskResult = S.suspend(() =>
  S.Struct({ ExportImageTask: S.optional(ExportImageTask) }),
).annotations({
  identifier: "GetExportImageTaskResult",
}) as any as S.Schema<GetExportImageTaskResult>;
export interface ListAssociatedFleetsResult {
  Names?: StringList;
  NextToken?: string;
}
export const ListAssociatedFleetsResult = S.suspend(() =>
  S.Struct({ Names: S.optional(StringList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListAssociatedFleetsResult",
}) as any as S.Schema<ListAssociatedFleetsResult>;
export interface ListAssociatedStacksResult {
  Names?: StringList;
  NextToken?: string;
}
export const ListAssociatedStacksResult = S.suspend(() =>
  S.Struct({ Names: S.optional(StringList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListAssociatedStacksResult",
}) as any as S.Schema<ListAssociatedStacksResult>;
export interface ListExportImageTasksRequest {
  Filters?: Filters;
  MaxResults?: number;
  NextToken?: string;
}
export const ListExportImageTasksRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(Filters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListExportImageTasksRequest",
}) as any as S.Schema<ListExportImageTasksRequest>;
export interface ListTagsForResourceResponse {
  Tags?: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface AppBlockBuilderStateChangeReason {
  Code?: string;
  Message?: string;
}
export const AppBlockBuilderStateChangeReason = S.suspend(() =>
  S.Struct({ Code: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({
  identifier: "AppBlockBuilderStateChangeReason",
}) as any as S.Schema<AppBlockBuilderStateChangeReason>;
export interface AppBlockBuilder {
  Arn: string;
  Name: string;
  DisplayName?: string;
  Description?: string;
  Platform: string;
  InstanceType: string;
  EnableDefaultInternetAccess?: boolean;
  IamRoleArn?: string;
  VpcConfig: VpcConfig;
  State: string;
  CreatedTime?: Date;
  AppBlockBuilderErrors?: ResourceErrors;
  StateChangeReason?: AppBlockBuilderStateChangeReason;
  AccessEndpoints?: AccessEndpointList;
}
export const AppBlockBuilder = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Name: S.String,
    DisplayName: S.optional(S.String),
    Description: S.optional(S.String),
    Platform: S.String,
    InstanceType: S.String,
    EnableDefaultInternetAccess: S.optional(S.Boolean),
    IamRoleArn: S.optional(S.String),
    VpcConfig: VpcConfig,
    State: S.String,
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    AppBlockBuilderErrors: S.optional(ResourceErrors),
    StateChangeReason: S.optional(AppBlockBuilderStateChangeReason),
    AccessEndpoints: S.optional(AccessEndpointList),
  }),
).annotations({
  identifier: "AppBlockBuilder",
}) as any as S.Schema<AppBlockBuilder>;
export interface StartAppBlockBuilderResult {
  AppBlockBuilder?: AppBlockBuilder;
}
export const StartAppBlockBuilderResult = S.suspend(() =>
  S.Struct({ AppBlockBuilder: S.optional(AppBlockBuilder) }),
).annotations({
  identifier: "StartAppBlockBuilderResult",
}) as any as S.Schema<StartAppBlockBuilderResult>;
export interface StartImageBuilderResult {
  ImageBuilder?: ImageBuilder;
}
export const StartImageBuilderResult = S.suspend(() =>
  S.Struct({ ImageBuilder: S.optional(ImageBuilder) }),
).annotations({
  identifier: "StartImageBuilderResult",
}) as any as S.Schema<StartImageBuilderResult>;
export interface StopAppBlockBuilderResult {
  AppBlockBuilder?: AppBlockBuilder;
}
export const StopAppBlockBuilderResult = S.suspend(() =>
  S.Struct({ AppBlockBuilder: S.optional(AppBlockBuilder) }),
).annotations({
  identifier: "StopAppBlockBuilderResult",
}) as any as S.Schema<StopAppBlockBuilderResult>;
export interface StopImageBuilderResult {
  ImageBuilder?: ImageBuilder;
}
export const StopImageBuilderResult = S.suspend(() =>
  S.Struct({ ImageBuilder: S.optional(ImageBuilder) }),
).annotations({
  identifier: "StopImageBuilderResult",
}) as any as S.Schema<StopImageBuilderResult>;
export interface UpdateAppBlockBuilderResult {
  AppBlockBuilder?: AppBlockBuilder;
}
export const UpdateAppBlockBuilderResult = S.suspend(() =>
  S.Struct({ AppBlockBuilder: S.optional(AppBlockBuilder) }),
).annotations({
  identifier: "UpdateAppBlockBuilderResult",
}) as any as S.Schema<UpdateAppBlockBuilderResult>;
export interface UpdateApplicationResult {
  Application?: Application;
}
export const UpdateApplicationResult = S.suspend(() =>
  S.Struct({ Application: S.optional(Application) }),
).annotations({
  identifier: "UpdateApplicationResult",
}) as any as S.Schema<UpdateApplicationResult>;
export interface DirectoryConfig {
  DirectoryName: string;
  OrganizationalUnitDistinguishedNames?: OrganizationalUnitDistinguishedNamesList;
  ServiceAccountCredentials?: ServiceAccountCredentials;
  CreatedTime?: Date;
  CertificateBasedAuthProperties?: CertificateBasedAuthProperties;
}
export const DirectoryConfig = S.suspend(() =>
  S.Struct({
    DirectoryName: S.String,
    OrganizationalUnitDistinguishedNames: S.optional(
      OrganizationalUnitDistinguishedNamesList,
    ),
    ServiceAccountCredentials: S.optional(ServiceAccountCredentials),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CertificateBasedAuthProperties: S.optional(CertificateBasedAuthProperties),
  }),
).annotations({
  identifier: "DirectoryConfig",
}) as any as S.Schema<DirectoryConfig>;
export interface UpdateDirectoryConfigResult {
  DirectoryConfig?: DirectoryConfig;
}
export const UpdateDirectoryConfigResult = S.suspend(() =>
  S.Struct({ DirectoryConfig: S.optional(DirectoryConfig) }),
).annotations({
  identifier: "UpdateDirectoryConfigResult",
}) as any as S.Schema<UpdateDirectoryConfigResult>;
export interface Entitlement {
  Name: string;
  StackName: string;
  Description?: string;
  AppVisibility: string;
  Attributes: EntitlementAttributeList;
  CreatedTime?: Date;
  LastModifiedTime?: Date;
}
export const Entitlement = S.suspend(() =>
  S.Struct({
    Name: S.String,
    StackName: S.String,
    Description: S.optional(S.String),
    AppVisibility: S.String,
    Attributes: EntitlementAttributeList,
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "Entitlement" }) as any as S.Schema<Entitlement>;
export interface UpdateEntitlementResult {
  Entitlement?: Entitlement;
}
export const UpdateEntitlementResult = S.suspend(() =>
  S.Struct({ Entitlement: S.optional(Entitlement) }),
).annotations({
  identifier: "UpdateEntitlementResult",
}) as any as S.Schema<UpdateEntitlementResult>;
export interface ComputeCapacityStatus {
  Desired: number;
  Running?: number;
  InUse?: number;
  Available?: number;
  DesiredUserSessions?: number;
  AvailableUserSessions?: number;
  ActiveUserSessions?: number;
  ActualUserSessions?: number;
}
export const ComputeCapacityStatus = S.suspend(() =>
  S.Struct({
    Desired: S.Number,
    Running: S.optional(S.Number),
    InUse: S.optional(S.Number),
    Available: S.optional(S.Number),
    DesiredUserSessions: S.optional(S.Number),
    AvailableUserSessions: S.optional(S.Number),
    ActiveUserSessions: S.optional(S.Number),
    ActualUserSessions: S.optional(S.Number),
  }),
).annotations({
  identifier: "ComputeCapacityStatus",
}) as any as S.Schema<ComputeCapacityStatus>;
export interface FleetError {
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const FleetError = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "FleetError" }) as any as S.Schema<FleetError>;
export type FleetErrors = FleetError[];
export const FleetErrors = S.Array(FleetError);
export interface Fleet {
  Arn: string;
  Name: string;
  DisplayName?: string;
  Description?: string;
  ImageName?: string;
  ImageArn?: string;
  InstanceType: string;
  FleetType?: string;
  ComputeCapacityStatus: ComputeCapacityStatus;
  MaxUserDurationInSeconds?: number;
  DisconnectTimeoutInSeconds?: number;
  State: string;
  VpcConfig?: VpcConfig;
  CreatedTime?: Date;
  FleetErrors?: FleetErrors;
  EnableDefaultInternetAccess?: boolean;
  DomainJoinInfo?: DomainJoinInfo;
  IdleDisconnectTimeoutInSeconds?: number;
  IamRoleArn?: string;
  StreamView?: string;
  Platform?: string;
  MaxConcurrentSessions?: number;
  UsbDeviceFilterStrings?: UsbDeviceFilterStrings;
  SessionScriptS3Location?: S3Location;
  MaxSessionsPerInstance?: number;
  RootVolumeConfig?: VolumeConfig;
}
export const Fleet = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Name: S.String,
    DisplayName: S.optional(S.String),
    Description: S.optional(S.String),
    ImageName: S.optional(S.String),
    ImageArn: S.optional(S.String),
    InstanceType: S.String,
    FleetType: S.optional(S.String),
    ComputeCapacityStatus: ComputeCapacityStatus,
    MaxUserDurationInSeconds: S.optional(S.Number),
    DisconnectTimeoutInSeconds: S.optional(S.Number),
    State: S.String,
    VpcConfig: S.optional(VpcConfig),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FleetErrors: S.optional(FleetErrors),
    EnableDefaultInternetAccess: S.optional(S.Boolean),
    DomainJoinInfo: S.optional(DomainJoinInfo),
    IdleDisconnectTimeoutInSeconds: S.optional(S.Number),
    IamRoleArn: S.optional(S.String),
    StreamView: S.optional(S.String),
    Platform: S.optional(S.String),
    MaxConcurrentSessions: S.optional(S.Number),
    UsbDeviceFilterStrings: S.optional(UsbDeviceFilterStrings),
    SessionScriptS3Location: S.optional(S3Location),
    MaxSessionsPerInstance: S.optional(S.Number),
    RootVolumeConfig: S.optional(VolumeConfig),
  }),
).annotations({ identifier: "Fleet" }) as any as S.Schema<Fleet>;
export interface UpdateFleetResult {
  Fleet?: Fleet;
}
export const UpdateFleetResult = S.suspend(() =>
  S.Struct({ Fleet: S.optional(Fleet) }),
).annotations({
  identifier: "UpdateFleetResult",
}) as any as S.Schema<UpdateFleetResult>;
export interface UpdateImagePermissionsRequest {
  Name: string;
  SharedAccountId: string;
  ImagePermissions: ImagePermissions;
}
export const UpdateImagePermissionsRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    SharedAccountId: S.String,
    ImagePermissions: ImagePermissions,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateImagePermissionsRequest",
}) as any as S.Schema<UpdateImagePermissionsRequest>;
export interface UpdateImagePermissionsResult {}
export const UpdateImagePermissionsResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateImagePermissionsResult",
}) as any as S.Schema<UpdateImagePermissionsResult>;
export interface StackError {
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const StackError = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "StackError" }) as any as S.Schema<StackError>;
export type StackErrors = StackError[];
export const StackErrors = S.Array(StackError);
export interface ApplicationSettingsResponse {
  Enabled?: boolean;
  SettingsGroup?: string;
  S3BucketName?: string;
}
export const ApplicationSettingsResponse = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    SettingsGroup: S.optional(S.String),
    S3BucketName: S.optional(S.String),
  }),
).annotations({
  identifier: "ApplicationSettingsResponse",
}) as any as S.Schema<ApplicationSettingsResponse>;
export interface Stack {
  Arn?: string;
  Name: string;
  Description?: string;
  DisplayName?: string;
  CreatedTime?: Date;
  StorageConnectors?: StorageConnectorList;
  RedirectURL?: string;
  FeedbackURL?: string;
  StackErrors?: StackErrors;
  UserSettings?: UserSettingList;
  ApplicationSettings?: ApplicationSettingsResponse;
  AccessEndpoints?: AccessEndpointList;
  EmbedHostDomains?: EmbedHostDomains;
  StreamingExperienceSettings?: StreamingExperienceSettings;
}
export const Stack = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.String,
    Description: S.optional(S.String),
    DisplayName: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StorageConnectors: S.optional(StorageConnectorList),
    RedirectURL: S.optional(S.String),
    FeedbackURL: S.optional(S.String),
    StackErrors: S.optional(StackErrors),
    UserSettings: S.optional(UserSettingList),
    ApplicationSettings: S.optional(ApplicationSettingsResponse),
    AccessEndpoints: S.optional(AccessEndpointList),
    EmbedHostDomains: S.optional(EmbedHostDomains),
    StreamingExperienceSettings: S.optional(StreamingExperienceSettings),
  }),
).annotations({ identifier: "Stack" }) as any as S.Schema<Stack>;
export interface UpdateStackResult {
  Stack?: Stack;
}
export const UpdateStackResult = S.suspend(() =>
  S.Struct({ Stack: S.optional(Stack) }),
).annotations({
  identifier: "UpdateStackResult",
}) as any as S.Schema<UpdateStackResult>;
export interface Theme {
  StackName?: string;
  State?: string;
  ThemeTitleText?: string;
  ThemeStyling?: string;
  ThemeFooterLinks?: ThemeFooterLinks;
  ThemeOrganizationLogoURL?: string;
  ThemeFaviconURL?: string;
  CreatedTime?: Date;
}
export const Theme = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    State: S.optional(S.String),
    ThemeTitleText: S.optional(S.String),
    ThemeStyling: S.optional(S.String),
    ThemeFooterLinks: S.optional(ThemeFooterLinks),
    ThemeOrganizationLogoURL: S.optional(S.String),
    ThemeFaviconURL: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Theme" }) as any as S.Schema<Theme>;
export interface UpdateThemeForStackResult {
  Theme?: Theme;
}
export const UpdateThemeForStackResult = S.suspend(() =>
  S.Struct({ Theme: S.optional(Theme) }),
).annotations({
  identifier: "UpdateThemeForStackResult",
}) as any as S.Schema<UpdateThemeForStackResult>;
export interface UserStackAssociationError {
  UserStackAssociation?: UserStackAssociation;
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const UserStackAssociationError = S.suspend(() =>
  S.Struct({
    UserStackAssociation: S.optional(UserStackAssociation),
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "UserStackAssociationError",
}) as any as S.Schema<UserStackAssociationError>;
export type UserStackAssociationErrorList = UserStackAssociationError[];
export const UserStackAssociationErrorList = S.Array(UserStackAssociationError);
export interface AppBlock {
  Name: string;
  Arn: string;
  Description?: string;
  DisplayName?: string;
  SourceS3Location?: S3Location;
  SetupScriptDetails?: ScriptDetails;
  CreatedTime?: Date;
  PostSetupScriptDetails?: ScriptDetails;
  PackagingType?: string;
  State?: string;
  AppBlockErrors?: ErrorDetailsList;
}
export const AppBlock = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Arn: S.String,
    Description: S.optional(S.String),
    DisplayName: S.optional(S.String),
    SourceS3Location: S.optional(S3Location),
    SetupScriptDetails: S.optional(ScriptDetails),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    PostSetupScriptDetails: S.optional(ScriptDetails),
    PackagingType: S.optional(S.String),
    State: S.optional(S.String),
    AppBlockErrors: S.optional(ErrorDetailsList),
  }),
).annotations({ identifier: "AppBlock" }) as any as S.Schema<AppBlock>;
export type AppBlocks = AppBlock[];
export const AppBlocks = S.Array(AppBlock);
export interface AdminAppLicenseUsageRecord {
  UserArn: string;
  BillingPeriod: string;
  OwnerAWSAccountId: string;
  SubscriptionFirstUsedDate: Date;
  SubscriptionLastUsedDate: Date;
  LicenseType: string;
  UserId: string;
}
export const AdminAppLicenseUsageRecord = S.suspend(() =>
  S.Struct({
    UserArn: S.String,
    BillingPeriod: S.String,
    OwnerAWSAccountId: S.String,
    SubscriptionFirstUsedDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    SubscriptionLastUsedDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LicenseType: S.String,
    UserId: S.String,
  }),
).annotations({
  identifier: "AdminAppLicenseUsageRecord",
}) as any as S.Schema<AdminAppLicenseUsageRecord>;
export type AdminAppLicenseUsageList = AdminAppLicenseUsageRecord[];
export const AdminAppLicenseUsageList = S.Array(AdminAppLicenseUsageRecord);
export type DirectoryConfigList = DirectoryConfig[];
export const DirectoryConfigList = S.Array(DirectoryConfig);
export type EntitlementList = Entitlement[];
export const EntitlementList = S.Array(Entitlement);
export interface SharedImagePermissions {
  sharedAccountId: string;
  imagePermissions: ImagePermissions;
}
export const SharedImagePermissions = S.suspend(() =>
  S.Struct({ sharedAccountId: S.String, imagePermissions: ImagePermissions }),
).annotations({
  identifier: "SharedImagePermissions",
}) as any as S.Schema<SharedImagePermissions>;
export type SharedImagePermissionsList = SharedImagePermissions[];
export const SharedImagePermissionsList = S.Array(SharedImagePermissions);
export interface Session {
  Id: string;
  UserId: string;
  StackName: string;
  FleetName: string;
  State: string;
  ConnectionState?: string;
  StartTime?: Date;
  MaxExpirationTime?: Date;
  AuthenticationType?: string;
  NetworkAccessConfiguration?: NetworkAccessConfiguration;
  InstanceId?: string;
}
export const Session = S.suspend(() =>
  S.Struct({
    Id: S.String,
    UserId: S.String,
    StackName: S.String,
    FleetName: S.String,
    State: S.String,
    ConnectionState: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    MaxExpirationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AuthenticationType: S.optional(S.String),
    NetworkAccessConfiguration: S.optional(NetworkAccessConfiguration),
    InstanceId: S.optional(S.String),
  }),
).annotations({ identifier: "Session" }) as any as S.Schema<Session>;
export type SessionList = Session[];
export const SessionList = S.Array(Session);
export interface SoftwareAssociations {
  SoftwareName?: string;
  Status?: string;
  DeploymentError?: ErrorDetailsList;
}
export const SoftwareAssociations = S.suspend(() =>
  S.Struct({
    SoftwareName: S.optional(S.String),
    Status: S.optional(S.String),
    DeploymentError: S.optional(ErrorDetailsList),
  }),
).annotations({
  identifier: "SoftwareAssociations",
}) as any as S.Schema<SoftwareAssociations>;
export type SoftwareAssociationsList = SoftwareAssociations[];
export const SoftwareAssociationsList = S.Array(SoftwareAssociations);
export interface User {
  Arn?: string;
  UserName?: string | Redacted.Redacted<string>;
  Enabled?: boolean;
  Status?: string;
  FirstName?: string | Redacted.Redacted<string>;
  LastName?: string | Redacted.Redacted<string>;
  CreatedTime?: Date;
  AuthenticationType: string;
}
export const User = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    UserName: S.optional(SensitiveString),
    Enabled: S.optional(S.Boolean),
    Status: S.optional(S.String),
    FirstName: S.optional(SensitiveString),
    LastName: S.optional(SensitiveString),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    AuthenticationType: S.String,
  }),
).annotations({ identifier: "User" }) as any as S.Schema<User>;
export type UserList = User[];
export const UserList = S.Array(User);
export interface EntitledApplication {
  ApplicationIdentifier: string;
}
export const EntitledApplication = S.suspend(() =>
  S.Struct({ ApplicationIdentifier: S.String }),
).annotations({
  identifier: "EntitledApplication",
}) as any as S.Schema<EntitledApplication>;
export type EntitledApplicationList = EntitledApplication[];
export const EntitledApplicationList = S.Array(EntitledApplication);
export type ExportImageTasks = ExportImageTask[];
export const ExportImageTasks = S.Array(ExportImageTask);
export interface AssociateAppBlockBuilderAppBlockResult {
  AppBlockBuilderAppBlockAssociation?: AppBlockBuilderAppBlockAssociation;
}
export const AssociateAppBlockBuilderAppBlockResult = S.suspend(() =>
  S.Struct({
    AppBlockBuilderAppBlockAssociation: S.optional(
      AppBlockBuilderAppBlockAssociation,
    ),
  }),
).annotations({
  identifier: "AssociateAppBlockBuilderAppBlockResult",
}) as any as S.Schema<AssociateAppBlockBuilderAppBlockResult>;
export interface AssociateApplicationFleetResult {
  ApplicationFleetAssociation?: ApplicationFleetAssociation;
}
export const AssociateApplicationFleetResult = S.suspend(() =>
  S.Struct({
    ApplicationFleetAssociation: S.optional(ApplicationFleetAssociation),
  }),
).annotations({
  identifier: "AssociateApplicationFleetResult",
}) as any as S.Schema<AssociateApplicationFleetResult>;
export interface BatchAssociateUserStackResult {
  errors?: UserStackAssociationErrorList;
}
export const BatchAssociateUserStackResult = S.suspend(() =>
  S.Struct({ errors: S.optional(UserStackAssociationErrorList) }),
).annotations({
  identifier: "BatchAssociateUserStackResult",
}) as any as S.Schema<BatchAssociateUserStackResult>;
export interface BatchDisassociateUserStackResult {
  errors?: UserStackAssociationErrorList;
}
export const BatchDisassociateUserStackResult = S.suspend(() =>
  S.Struct({ errors: S.optional(UserStackAssociationErrorList) }),
).annotations({
  identifier: "BatchDisassociateUserStackResult",
}) as any as S.Schema<BatchDisassociateUserStackResult>;
export interface CreateAppBlockResult {
  AppBlock?: AppBlock;
}
export const CreateAppBlockResult = S.suspend(() =>
  S.Struct({ AppBlock: S.optional(AppBlock) }),
).annotations({
  identifier: "CreateAppBlockResult",
}) as any as S.Schema<CreateAppBlockResult>;
export interface CreateAppBlockBuilderResult {
  AppBlockBuilder?: AppBlockBuilder;
}
export const CreateAppBlockBuilderResult = S.suspend(() =>
  S.Struct({ AppBlockBuilder: S.optional(AppBlockBuilder) }),
).annotations({
  identifier: "CreateAppBlockBuilderResult",
}) as any as S.Schema<CreateAppBlockBuilderResult>;
export interface CreateDirectoryConfigResult {
  DirectoryConfig?: DirectoryConfig;
}
export const CreateDirectoryConfigResult = S.suspend(() =>
  S.Struct({ DirectoryConfig: S.optional(DirectoryConfig) }),
).annotations({
  identifier: "CreateDirectoryConfigResult",
}) as any as S.Schema<CreateDirectoryConfigResult>;
export interface CreateEntitlementResult {
  Entitlement?: Entitlement;
}
export const CreateEntitlementResult = S.suspend(() =>
  S.Struct({ Entitlement: S.optional(Entitlement) }),
).annotations({
  identifier: "CreateEntitlementResult",
}) as any as S.Schema<CreateEntitlementResult>;
export interface CreateFleetResult {
  Fleet?: Fleet;
}
export const CreateFleetResult = S.suspend(() =>
  S.Struct({ Fleet: S.optional(Fleet) }),
).annotations({
  identifier: "CreateFleetResult",
}) as any as S.Schema<CreateFleetResult>;
export interface CreateImportedImageResult {
  Image?: Image;
}
export const CreateImportedImageResult = S.suspend(() =>
  S.Struct({ Image: S.optional(Image) }),
).annotations({
  identifier: "CreateImportedImageResult",
}) as any as S.Schema<CreateImportedImageResult>;
export interface CreateStackResult {
  Stack?: Stack;
}
export const CreateStackResult = S.suspend(() =>
  S.Struct({ Stack: S.optional(Stack) }),
).annotations({
  identifier: "CreateStackResult",
}) as any as S.Schema<CreateStackResult>;
export interface CreateThemeForStackResult {
  Theme?: Theme;
}
export const CreateThemeForStackResult = S.suspend(() =>
  S.Struct({ Theme: S.optional(Theme) }),
).annotations({
  identifier: "CreateThemeForStackResult",
}) as any as S.Schema<CreateThemeForStackResult>;
export interface DescribeAppBlocksResult {
  AppBlocks?: AppBlocks;
  NextToken?: string;
}
export const DescribeAppBlocksResult = S.suspend(() =>
  S.Struct({
    AppBlocks: S.optional(AppBlocks),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeAppBlocksResult",
}) as any as S.Schema<DescribeAppBlocksResult>;
export interface DescribeAppLicenseUsageResult {
  AppLicenseUsages?: AdminAppLicenseUsageList;
  NextToken?: string;
}
export const DescribeAppLicenseUsageResult = S.suspend(() =>
  S.Struct({
    AppLicenseUsages: S.optional(AdminAppLicenseUsageList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeAppLicenseUsageResult",
}) as any as S.Schema<DescribeAppLicenseUsageResult>;
export interface DescribeDirectoryConfigsResult {
  DirectoryConfigs?: DirectoryConfigList;
  NextToken?: string;
}
export const DescribeDirectoryConfigsResult = S.suspend(() =>
  S.Struct({
    DirectoryConfigs: S.optional(DirectoryConfigList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeDirectoryConfigsResult",
}) as any as S.Schema<DescribeDirectoryConfigsResult>;
export interface DescribeEntitlementsResult {
  Entitlements?: EntitlementList;
  NextToken?: string;
}
export const DescribeEntitlementsResult = S.suspend(() =>
  S.Struct({
    Entitlements: S.optional(EntitlementList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeEntitlementsResult",
}) as any as S.Schema<DescribeEntitlementsResult>;
export interface DescribeImagePermissionsResult {
  Name?: string;
  SharedImagePermissionsList?: SharedImagePermissionsList;
  NextToken?: string;
}
export const DescribeImagePermissionsResult = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    SharedImagePermissionsList: S.optional(SharedImagePermissionsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeImagePermissionsResult",
}) as any as S.Schema<DescribeImagePermissionsResult>;
export interface DescribeSessionsResult {
  Sessions?: SessionList;
  NextToken?: string;
}
export const DescribeSessionsResult = S.suspend(() =>
  S.Struct({
    Sessions: S.optional(SessionList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeSessionsResult",
}) as any as S.Schema<DescribeSessionsResult>;
export interface DescribeSoftwareAssociationsResult {
  AssociatedResource?: string;
  SoftwareAssociations?: SoftwareAssociationsList;
  NextToken?: string;
}
export const DescribeSoftwareAssociationsResult = S.suspend(() =>
  S.Struct({
    AssociatedResource: S.optional(S.String),
    SoftwareAssociations: S.optional(SoftwareAssociationsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeSoftwareAssociationsResult",
}) as any as S.Schema<DescribeSoftwareAssociationsResult>;
export interface DescribeThemeForStackResult {
  Theme?: Theme;
}
export const DescribeThemeForStackResult = S.suspend(() =>
  S.Struct({ Theme: S.optional(Theme) }),
).annotations({
  identifier: "DescribeThemeForStackResult",
}) as any as S.Schema<DescribeThemeForStackResult>;
export interface DescribeUsersResult {
  Users?: UserList;
  NextToken?: string;
}
export const DescribeUsersResult = S.suspend(() =>
  S.Struct({ Users: S.optional(UserList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "DescribeUsersResult",
}) as any as S.Schema<DescribeUsersResult>;
export interface ListEntitledApplicationsResult {
  EntitledApplications?: EntitledApplicationList;
  NextToken?: string;
}
export const ListEntitledApplicationsResult = S.suspend(() =>
  S.Struct({
    EntitledApplications: S.optional(EntitledApplicationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEntitledApplicationsResult",
}) as any as S.Schema<ListEntitledApplicationsResult>;
export interface ListExportImageTasksResult {
  ExportImageTasks?: ExportImageTasks;
  NextToken?: string;
}
export const ListExportImageTasksResult = S.suspend(() =>
  S.Struct({
    ExportImageTasks: S.optional(ExportImageTasks),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListExportImageTasksResult",
}) as any as S.Schema<ListExportImageTasksResult>;
export interface LastReportGenerationExecutionError {
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const LastReportGenerationExecutionError = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "LastReportGenerationExecutionError",
}) as any as S.Schema<LastReportGenerationExecutionError>;
export type LastReportGenerationExecutionErrors =
  LastReportGenerationExecutionError[];
export const LastReportGenerationExecutionErrors = S.Array(
  LastReportGenerationExecutionError,
);
export type AppBlockBuilderList = AppBlockBuilder[];
export const AppBlockBuilderList = S.Array(AppBlockBuilder);
export type FleetList = Fleet[];
export const FleetList = S.Array(Fleet);
export type StackList = Stack[];
export const StackList = S.Array(Stack);
export interface UsageReportSubscription {
  S3BucketName?: string;
  Schedule?: string;
  LastGeneratedReportDate?: Date;
  SubscriptionErrors?: LastReportGenerationExecutionErrors;
}
export const UsageReportSubscription = S.suspend(() =>
  S.Struct({
    S3BucketName: S.optional(S.String),
    Schedule: S.optional(S.String),
    LastGeneratedReportDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SubscriptionErrors: S.optional(LastReportGenerationExecutionErrors),
  }),
).annotations({
  identifier: "UsageReportSubscription",
}) as any as S.Schema<UsageReportSubscription>;
export type UsageReportSubscriptionList = UsageReportSubscription[];
export const UsageReportSubscriptionList = S.Array(UsageReportSubscription);
export interface CreateApplicationResult {
  Application?: Application;
}
export const CreateApplicationResult = S.suspend(() =>
  S.Struct({ Application: S.optional(Application) }),
).annotations({
  identifier: "CreateApplicationResult",
}) as any as S.Schema<CreateApplicationResult>;
export interface CreateExportImageTaskResult {
  ExportImageTask?: ExportImageTask;
}
export const CreateExportImageTaskResult = S.suspend(() =>
  S.Struct({ ExportImageTask: S.optional(ExportImageTask) }),
).annotations({
  identifier: "CreateExportImageTaskResult",
}) as any as S.Schema<CreateExportImageTaskResult>;
export interface CreateImageBuilderResult {
  ImageBuilder?: ImageBuilder;
}
export const CreateImageBuilderResult = S.suspend(() =>
  S.Struct({ ImageBuilder: S.optional(ImageBuilder) }),
).annotations({
  identifier: "CreateImageBuilderResult",
}) as any as S.Schema<CreateImageBuilderResult>;
export interface CreateUpdatedImageResult {
  image?: Image;
  canUpdateImage?: boolean;
}
export const CreateUpdatedImageResult = S.suspend(() =>
  S.Struct({ image: S.optional(Image), canUpdateImage: S.optional(S.Boolean) }),
).annotations({
  identifier: "CreateUpdatedImageResult",
}) as any as S.Schema<CreateUpdatedImageResult>;
export interface DescribeAppBlockBuildersResult {
  AppBlockBuilders?: AppBlockBuilderList;
  NextToken?: string;
}
export const DescribeAppBlockBuildersResult = S.suspend(() =>
  S.Struct({
    AppBlockBuilders: S.optional(AppBlockBuilderList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeAppBlockBuildersResult",
}) as any as S.Schema<DescribeAppBlockBuildersResult>;
export interface DescribeFleetsResult {
  Fleets?: FleetList;
  NextToken?: string;
}
export const DescribeFleetsResult = S.suspend(() =>
  S.Struct({ Fleets: S.optional(FleetList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "DescribeFleetsResult",
}) as any as S.Schema<DescribeFleetsResult>;
export interface DescribeStacksResult {
  Stacks?: StackList;
  NextToken?: string;
}
export const DescribeStacksResult = S.suspend(() =>
  S.Struct({ Stacks: S.optional(StackList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "DescribeStacksResult",
}) as any as S.Schema<DescribeStacksResult>;
export interface DescribeUsageReportSubscriptionsResult {
  UsageReportSubscriptions?: UsageReportSubscriptionList;
  NextToken?: string;
}
export const DescribeUsageReportSubscriptionsResult = S.suspend(() =>
  S.Struct({
    UsageReportSubscriptions: S.optional(UsageReportSubscriptionList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeUsageReportSubscriptionsResult",
}) as any as S.Schema<DescribeUsageReportSubscriptionsResult>;

//# Errors
export class InvalidAccountStatusException extends S.TaggedError<InvalidAccountStatusException>()(
  "InvalidAccountStatusException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class EntitlementNotFoundException extends S.TaggedError<EntitlementNotFoundException>()(
  "EntitlementNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotAvailableException extends S.TaggedError<ResourceNotAvailableException>()(
  "ResourceNotAvailableException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidRoleException extends S.TaggedError<InvalidRoleException>()(
  "InvalidRoleException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidParameterCombinationException extends S.TaggedError<InvalidParameterCombinationException>()(
  "InvalidParameterCombinationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class IncompatibleImageException extends S.TaggedError<IncompatibleImageException>()(
  "IncompatibleImageException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class OperationNotPermittedException extends S.TaggedError<OperationNotPermittedException>()(
  "OperationNotPermittedException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class EntitlementAlreadyExistsException extends S.TaggedError<EntitlementAlreadyExistsException>()(
  "EntitlementAlreadyExistsException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class RequestLimitExceededException extends S.TaggedError<RequestLimitExceededException>()(
  "RequestLimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DryRunOperationException extends S.TaggedError<DryRunOperationException>()(
  "DryRunOperationException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Immediately stops the specified streaming session.
 */
export const expireSession: (
  input: ExpireSessionRequest,
) => Effect.Effect<
  ExpireSessionResult,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExpireSessionRequest,
  output: ExpireSessionResult,
  errors: [],
}));
/**
 * Disables usage report generation.
 */
export const deleteUsageReportSubscription: (
  input: DeleteUsageReportSubscriptionRequest,
) => Effect.Effect<
  DeleteUsageReportSubscriptionResult,
  InvalidAccountStatusException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUsageReportSubscriptionRequest,
  output: DeleteUsageReportSubscriptionResult,
  errors: [InvalidAccountStatusException, ResourceNotFoundException],
}));
/**
 * Retrieves a list that describes one or more specified image builders, if the image builder names are provided. Otherwise, all image builders in the account are described.
 */
export const describeImageBuilders: (
  input: DescribeImageBuildersRequest,
) => Effect.Effect<
  DescribeImageBuildersResult,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeImageBuildersRequest,
  output: DescribeImageBuildersResult,
  errors: [ResourceNotFoundException],
}));
/**
 * Retrieves the name of the fleet that is associated with the specified stack.
 */
export const listAssociatedFleets: (
  input: ListAssociatedFleetsRequest,
) => Effect.Effect<
  ListAssociatedFleetsResult,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAssociatedFleetsRequest,
  output: ListAssociatedFleetsResult,
  errors: [],
}));
/**
 * Retrieves the name of the stack with which the specified fleet is associated.
 */
export const listAssociatedStacks: (
  input: ListAssociatedStacksRequest,
) => Effect.Effect<
  ListAssociatedStacksResult,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAssociatedStacksRequest,
  output: ListAssociatedStacksResult,
  errors: [],
}));
/**
 * Retrieves a list of all tags for the specified WorkSpaces Applications resource. You can tag WorkSpaces Applications image builders, images, fleets, and stacks.
 *
 * For more information about tags, see Tagging Your Resources in the *Amazon WorkSpaces Applications Administration Guide*.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Adds or overwrites one or more tags for the specified WorkSpaces Applications resource. You can tag WorkSpaces Applications image builders, images, fleets, and stacks.
 *
 * Each tag consists of a key and an optional value. If a resource already has a tag with the same key,
 * this operation updates its value.
 *
 * To list the current tags for your resources, use ListTagsForResource.
 * To disassociate tags from your resources, use UntagResource.
 *
 * For more information about tags, see Tagging Your Resources in the *Amazon WorkSpaces Applications Administration Guide*.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | InvalidAccountStatusException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InvalidAccountStatusException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Adds or updates permissions for the specified private image.
 */
export const updateImagePermissions: (
  input: UpdateImagePermissionsRequest,
) => Effect.Effect<
  UpdateImagePermissionsResult,
  | LimitExceededException
  | ResourceNotAvailableException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateImagePermissionsRequest,
  output: UpdateImagePermissionsResult,
  errors: [
    LimitExceededException,
    ResourceNotAvailableException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes an app block.
 */
export const deleteAppBlock: (
  input: DeleteAppBlockRequest,
) => Effect.Effect<
  DeleteAppBlockResult,
  | ConcurrentModificationException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppBlockRequest,
  output: DeleteAppBlockResult,
  errors: [
    ConcurrentModificationException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the specified fleet.
 */
export const deleteFleet: (
  input: DeleteFleetRequest,
) => Effect.Effect<
  DeleteFleetResult,
  | ConcurrentModificationException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFleetRequest,
  output: DeleteFleetResult,
  errors: [
    ConcurrentModificationException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Stops the specified fleet.
 */
export const stopFleet: (
  input: StopFleetRequest,
) => Effect.Effect<
  StopFleetResult,
  ConcurrentModificationException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopFleetRequest,
  output: StopFleetResult,
  errors: [ConcurrentModificationException, ResourceNotFoundException],
}));
/**
 * Creates a usage report subscription. Usage reports are generated daily.
 */
export const createUsageReportSubscription: (
  input: CreateUsageReportSubscriptionRequest,
) => Effect.Effect<
  CreateUsageReportSubscriptionResult,
  | InvalidAccountStatusException
  | InvalidRoleException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUsageReportSubscriptionRequest,
  output: CreateUsageReportSubscriptionResult,
  errors: [
    InvalidAccountStatusException,
    InvalidRoleException,
    LimitExceededException,
  ],
}));
/**
 * Deletes a user from the user pool.
 */
export const deleteUser: (
  input: DeleteUserRequest,
) => Effect.Effect<
  DeleteUserResult,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserRequest,
  output: DeleteUserResult,
  errors: [ResourceNotFoundException],
}));
/**
 * Disables the specified user in the user pool. Users can't sign in to WorkSpaces Applications until they are re-enabled. This action does not delete the user.
 */
export const disableUser: (
  input: DisableUserRequest,
) => Effect.Effect<
  DisableUserResult,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableUserRequest,
  output: DisableUserResult,
  errors: [ResourceNotFoundException],
}));
/**
 * Enables a user in the user pool. After being enabled, users can sign in to WorkSpaces Applications and open applications from the stacks to which they are assigned.
 */
export const enableUser: (
  input: EnableUserRequest,
) => Effect.Effect<
  EnableUserResult,
  InvalidAccountStatusException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableUserRequest,
  output: EnableUserResult,
  errors: [InvalidAccountStatusException, ResourceNotFoundException],
}));
/**
 * Disassociates one or more specified tags from the specified WorkSpaces Applications resource.
 *
 * To list the current tags for your resources, use ListTagsForResource.
 *
 * For more information about tags, see Tagging Your Resources in the *Amazon WorkSpaces Applications Administration Guide*.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Deletes the specified Directory Config object from WorkSpaces Applications. This object includes the information required to join streaming instances to an Active Directory domain.
 */
export const deleteDirectoryConfig: (
  input: DeleteDirectoryConfigRequest,
) => Effect.Effect<
  DeleteDirectoryConfigResult,
  ResourceInUseException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDirectoryConfigRequest,
  output: DeleteDirectoryConfigResult,
  errors: [ResourceInUseException, ResourceNotFoundException],
}));
/**
 * Deletes permissions for the specified private image. After you delete permissions for an image, AWS accounts to which you previously granted these permissions can no longer use the image.
 */
export const deleteImagePermissions: (
  input: DeleteImagePermissionsRequest,
) => Effect.Effect<
  DeleteImagePermissionsResult,
  ResourceNotAvailableException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteImagePermissionsRequest,
  output: DeleteImagePermissionsResult,
  errors: [ResourceNotAvailableException, ResourceNotFoundException],
}));
/**
 * Retrieves a list that describes one or more specified images, if the image names or image ARNs are provided. Otherwise, all images in the account are described.
 */
export const describeImages: {
  (
    input: DescribeImagesRequest,
  ): Effect.Effect<
    DescribeImagesResult,
    | InvalidParameterCombinationException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeImagesRequest,
  ) => Stream.Stream<
    DescribeImagesResult,
    | InvalidParameterCombinationException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeImagesRequest,
  ) => Stream.Stream<
    unknown,
    | InvalidParameterCombinationException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeImagesRequest,
  output: DescribeImagesResult,
  errors: [InvalidParameterCombinationException, ResourceNotFoundException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates a URL to start a create app block builder streaming session.
 */
export const createAppBlockBuilderStreamingURL: (
  input: CreateAppBlockBuilderStreamingURLRequest,
) => Effect.Effect<
  CreateAppBlockBuilderStreamingURLResult,
  OperationNotPermittedException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAppBlockBuilderStreamingURLRequest,
  output: CreateAppBlockBuilderStreamingURLResult,
  errors: [OperationNotPermittedException, ResourceNotFoundException],
}));
/**
 * Retrieves a list that describes one or more app blocks.
 */
export const describeAppBlocks: (
  input: DescribeAppBlocksRequest,
) => Effect.Effect<
  DescribeAppBlocksResult,
  OperationNotPermittedException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAppBlocksRequest,
  output: DescribeAppBlocksResult,
  errors: [OperationNotPermittedException, ResourceNotFoundException],
}));
/**
 * Retrieves license included application usage information.
 */
export const describeAppLicenseUsage: (
  input: DescribeAppLicenseUsageRequest,
) => Effect.Effect<
  DescribeAppLicenseUsageResult,
  | InvalidParameterCombinationException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAppLicenseUsageRequest,
  output: DescribeAppLicenseUsageResult,
  errors: [
    InvalidParameterCombinationException,
    OperationNotPermittedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves a list that describes one or more specified Directory Config objects for WorkSpaces Applications, if the names for these objects are provided. Otherwise, all Directory Config objects in the account are described. These objects include the configuration information required to join fleets and image builders to Microsoft Active Directory domains.
 *
 * Although the response syntax in this topic includes the account password, this password is not returned in the actual response.
 */
export const describeDirectoryConfigs: (
  input: DescribeDirectoryConfigsRequest,
) => Effect.Effect<
  DescribeDirectoryConfigsResult,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDirectoryConfigsRequest,
  output: DescribeDirectoryConfigsResult,
  errors: [ResourceNotFoundException],
}));
/**
 * Retrieves a list that describes one of more entitlements.
 */
export const describeEntitlements: (
  input: DescribeEntitlementsRequest,
) => Effect.Effect<
  DescribeEntitlementsResult,
  | EntitlementNotFoundException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEntitlementsRequest,
  output: DescribeEntitlementsResult,
  errors: [
    EntitlementNotFoundException,
    OperationNotPermittedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves a list that describes the permissions for shared AWS account IDs on a private image that you own.
 */
export const describeImagePermissions: {
  (
    input: DescribeImagePermissionsRequest,
  ): Effect.Effect<
    DescribeImagePermissionsResult,
    ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeImagePermissionsRequest,
  ) => Stream.Stream<
    DescribeImagePermissionsResult,
    ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeImagePermissionsRequest,
  ) => Stream.Stream<
    unknown,
    ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeImagePermissionsRequest,
  output: DescribeImagePermissionsResult,
  errors: [ResourceNotFoundException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a list that describes the streaming sessions for a specified stack and fleet. If a UserId is provided for the stack and fleet,
 * only streaming sessions for that user are described. If an authentication type is not provided,
 * the default is to authenticate users using a streaming URL.
 */
export const describeSessions: (
  input: DescribeSessionsRequest,
) => Effect.Effect<
  DescribeSessionsResult,
  InvalidParameterCombinationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSessionsRequest,
  output: DescribeSessionsResult,
  errors: [InvalidParameterCombinationException],
}));
/**
 * Retrieves license included application associations for a specified resource.
 */
export const describeSoftwareAssociations: (
  input: DescribeSoftwareAssociationsRequest,
) => Effect.Effect<
  DescribeSoftwareAssociationsResult,
  OperationNotPermittedException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSoftwareAssociationsRequest,
  output: DescribeSoftwareAssociationsResult,
  errors: [OperationNotPermittedException, ResourceNotFoundException],
}));
/**
 * Retrieves a list that describes the theme for a specified stack. A theme is custom branding that customizes the appearance of the streaming application catalog page.
 */
export const describeThemeForStack: (
  input: DescribeThemeForStackRequest,
) => Effect.Effect<
  DescribeThemeForStackResult,
  OperationNotPermittedException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeThemeForStackRequest,
  output: DescribeThemeForStackResult,
  errors: [OperationNotPermittedException, ResourceNotFoundException],
}));
/**
 * Retrieves a list that describes one or more specified users in the user pool.
 */
export const describeUsers: (
  input: DescribeUsersRequest,
) => Effect.Effect<
  DescribeUsersResult,
  | InvalidParameterCombinationException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeUsersRequest,
  output: DescribeUsersResult,
  errors: [
    InvalidParameterCombinationException,
    OperationNotPermittedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves a list of entitled applications.
 */
export const listEntitledApplications: (
  input: ListEntitledApplicationsRequest,
) => Effect.Effect<
  ListEntitledApplicationsResult,
  | EntitlementNotFoundException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEntitledApplicationsRequest,
  output: ListEntitledApplicationsResult,
  errors: [
    EntitlementNotFoundException,
    OperationNotPermittedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists export image tasks, with optional filtering and pagination. Use this operation to monitor the status of multiple export operations.
 */
export const listExportImageTasks: (
  input: ListExportImageTasksRequest,
) => Effect.Effect<
  ListExportImageTasksResult,
  OperationNotPermittedException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListExportImageTasksRequest,
  output: ListExportImageTasksResult,
  errors: [OperationNotPermittedException],
}));
/**
 * Starts the specified image builder.
 */
export const startImageBuilder: (
  input: StartImageBuilderRequest,
) => Effect.Effect<
  StartImageBuilderResult,
  | ConcurrentModificationException
  | IncompatibleImageException
  | InvalidAccountStatusException
  | ResourceNotAvailableException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartImageBuilderRequest,
  output: StartImageBuilderResult,
  errors: [
    ConcurrentModificationException,
    IncompatibleImageException,
    InvalidAccountStatusException,
    ResourceNotAvailableException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the specified Directory Config object in WorkSpaces Applications. This object includes the configuration information required to join fleets and image builders to Microsoft Active Directory domains.
 */
export const updateDirectoryConfig: (
  input: UpdateDirectoryConfigRequest,
) => Effect.Effect<
  UpdateDirectoryConfigResult,
  | ConcurrentModificationException
  | IncompatibleImageException
  | InvalidRoleException
  | OperationNotPermittedException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDirectoryConfigRequest,
  output: UpdateDirectoryConfigResult,
  errors: [
    ConcurrentModificationException,
    IncompatibleImageException,
    InvalidRoleException,
    OperationNotPermittedException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the specified fields for the specified stack.
 */
export const updateStack: (
  input: UpdateStackRequest,
) => Effect.Effect<
  UpdateStackResult,
  | ConcurrentModificationException
  | IncompatibleImageException
  | InvalidAccountStatusException
  | InvalidParameterCombinationException
  | InvalidRoleException
  | LimitExceededException
  | OperationNotPermittedException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStackRequest,
  output: UpdateStackResult,
  errors: [
    ConcurrentModificationException,
    IncompatibleImageException,
    InvalidAccountStatusException,
    InvalidParameterCombinationException,
    InvalidRoleException,
    LimitExceededException,
    OperationNotPermittedException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Associates license included application(s) with an existing image builder instance.
 */
export const associateSoftwareToImageBuilder: (
  input: AssociateSoftwareToImageBuilderRequest,
) => Effect.Effect<
  AssociateSoftwareToImageBuilderResult,
  | ConcurrentModificationException
  | IncompatibleImageException
  | InvalidParameterCombinationException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateSoftwareToImageBuilderRequest,
  output: AssociateSoftwareToImageBuilderResult,
  errors: [
    ConcurrentModificationException,
    IncompatibleImageException,
    InvalidParameterCombinationException,
    OperationNotPermittedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a URL to start an image builder streaming session.
 */
export const createImageBuilderStreamingURL: (
  input: CreateImageBuilderStreamingURLRequest,
) => Effect.Effect<
  CreateImageBuilderStreamingURLResult,
  OperationNotPermittedException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateImageBuilderStreamingURLRequest,
  output: CreateImageBuilderStreamingURLResult,
  errors: [OperationNotPermittedException, ResourceNotFoundException],
}));
/**
 * Deletes the specified image. You cannot delete an image when it is in use.
 * After you delete an image, you cannot provision new capacity using the image.
 */
export const deleteImage: (
  input: DeleteImageRequest,
) => Effect.Effect<
  DeleteImageResult,
  | ConcurrentModificationException
  | OperationNotPermittedException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteImageRequest,
  output: DeleteImageResult,
  errors: [
    ConcurrentModificationException,
    OperationNotPermittedException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the specified image builder and releases the capacity.
 */
export const deleteImageBuilder: (
  input: DeleteImageBuilderRequest,
) => Effect.Effect<
  DeleteImageBuilderResult,
  | ConcurrentModificationException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteImageBuilderRequest,
  output: DeleteImageBuilderResult,
  errors: [
    ConcurrentModificationException,
    OperationNotPermittedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves a list that describes one or more applications.
 */
export const describeApplications: (
  input: DescribeApplicationsRequest,
) => Effect.Effect<
  DescribeApplicationsResult,
  OperationNotPermittedException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeApplicationsRequest,
  output: DescribeApplicationsResult,
  errors: [OperationNotPermittedException, ResourceNotFoundException],
}));
/**
 * Retrieves information about an export image task, including its current state, progress, and any error details.
 */
export const getExportImageTask: (
  input: GetExportImageTaskRequest,
) => Effect.Effect<
  GetExportImageTaskResult,
  OperationNotPermittedException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExportImageTaskRequest,
  output: GetExportImageTaskResult,
  errors: [OperationNotPermittedException, ResourceNotFoundException],
}));
/**
 * Stops an app block builder.
 *
 * Stopping an app block builder terminates the instance, and the instance state is not
 * persisted.
 */
export const stopAppBlockBuilder: (
  input: StopAppBlockBuilderRequest,
) => Effect.Effect<
  StopAppBlockBuilderResult,
  | ConcurrentModificationException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopAppBlockBuilderRequest,
  output: StopAppBlockBuilderResult,
  errors: [
    ConcurrentModificationException,
    OperationNotPermittedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Stops the specified image builder.
 */
export const stopImageBuilder: (
  input: StopImageBuilderRequest,
) => Effect.Effect<
  StopImageBuilderResult,
  | ConcurrentModificationException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopImageBuilderRequest,
  output: StopImageBuilderResult,
  errors: [
    ConcurrentModificationException,
    OperationNotPermittedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the specified application.
 */
export const updateApplication: (
  input: UpdateApplicationRequest,
) => Effect.Effect<
  UpdateApplicationResult,
  | ConcurrentModificationException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationRequest,
  output: UpdateApplicationResult,
  errors: [
    ConcurrentModificationException,
    OperationNotPermittedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the specified entitlement.
 */
export const updateEntitlement: (
  input: UpdateEntitlementRequest,
) => Effect.Effect<
  UpdateEntitlementResult,
  | ConcurrentModificationException
  | EntitlementNotFoundException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEntitlementRequest,
  output: UpdateEntitlementResult,
  errors: [
    ConcurrentModificationException,
    EntitlementNotFoundException,
    OperationNotPermittedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the specified application from the specified entitlement.
 */
export const disassociateApplicationFromEntitlement: (
  input: DisassociateApplicationFromEntitlementRequest,
) => Effect.Effect<
  DisassociateApplicationFromEntitlementResult,
  | EntitlementNotFoundException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateApplicationFromEntitlementRequest,
  output: DisassociateApplicationFromEntitlementResult,
  errors: [
    EntitlementNotFoundException,
    OperationNotPermittedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes an app block builder.
 *
 * An app block builder can only be deleted when it has no association with an app
 * block.
 */
export const deleteAppBlockBuilder: (
  input: DeleteAppBlockBuilderRequest,
) => Effect.Effect<
  DeleteAppBlockBuilderResult,
  | ConcurrentModificationException
  | OperationNotPermittedException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppBlockBuilderRequest,
  output: DeleteAppBlockBuilderResult,
  errors: [
    ConcurrentModificationException,
    OperationNotPermittedException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes an application.
 */
export const deleteApplication: (
  input: DeleteApplicationRequest,
) => Effect.Effect<
  DeleteApplicationResult,
  | ConcurrentModificationException
  | OperationNotPermittedException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationRequest,
  output: DeleteApplicationResult,
  errors: [
    ConcurrentModificationException,
    OperationNotPermittedException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the specified entitlement.
 */
export const deleteEntitlement: (
  input: DeleteEntitlementRequest,
) => Effect.Effect<
  DeleteEntitlementResult,
  | ConcurrentModificationException
  | EntitlementNotFoundException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEntitlementRequest,
  output: DeleteEntitlementResult,
  errors: [
    ConcurrentModificationException,
    EntitlementNotFoundException,
    OperationNotPermittedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the specified stack. After the stack is deleted, the application streaming environment provided by the stack is no longer available to users. Also, any reservations made for application streaming sessions for the stack are released.
 */
export const deleteStack: (
  input: DeleteStackRequest,
) => Effect.Effect<
  DeleteStackResult,
  | ConcurrentModificationException
  | OperationNotPermittedException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStackRequest,
  output: DeleteStackResult,
  errors: [
    ConcurrentModificationException,
    OperationNotPermittedException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes custom branding that customizes the appearance of the streaming application catalog page.
 */
export const deleteThemeForStack: (
  input: DeleteThemeForStackRequest,
) => Effect.Effect<
  DeleteThemeForStackResult,
  | ConcurrentModificationException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteThemeForStackRequest,
  output: DeleteThemeForStackResult,
  errors: [
    ConcurrentModificationException,
    OperationNotPermittedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Disassociates the specified fleet from the specified stack.
 */
export const disassociateFleet: (
  input: DisassociateFleetRequest,
) => Effect.Effect<
  DisassociateFleetResult,
  | ConcurrentModificationException
  | OperationNotPermittedException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateFleetRequest,
  output: DisassociateFleetResult,
  errors: [
    ConcurrentModificationException,
    OperationNotPermittedException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Initiates license included applications deployment to an image builder instance.
 */
export const startSoftwareDeploymentToImageBuilder: (
  input: StartSoftwareDeploymentToImageBuilderRequest,
) => Effect.Effect<
  StartSoftwareDeploymentToImageBuilderResult,
  | ConcurrentModificationException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSoftwareDeploymentToImageBuilderRequest,
  output: StartSoftwareDeploymentToImageBuilderResult,
  errors: [
    ConcurrentModificationException,
    OperationNotPermittedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Associates an application to entitle.
 */
export const associateApplicationToEntitlement: (
  input: AssociateApplicationToEntitlementRequest,
) => Effect.Effect<
  AssociateApplicationToEntitlementResult,
  | EntitlementNotFoundException
  | LimitExceededException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateApplicationToEntitlementRequest,
  output: AssociateApplicationToEntitlementResult,
  errors: [
    EntitlementNotFoundException,
    LimitExceededException,
    OperationNotPermittedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a temporary URL to start an WorkSpaces Applications streaming session for the specified user. A streaming URL enables application streaming to be tested without user setup.
 */
export const createStreamingURL: (
  input: CreateStreamingURLRequest,
) => Effect.Effect<
  CreateStreamingURLResult,
  | InvalidParameterCombinationException
  | OperationNotPermittedException
  | ResourceNotAvailableException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStreamingURLRequest,
  output: CreateStreamingURLResult,
  errors: [
    InvalidParameterCombinationException,
    OperationNotPermittedException,
    ResourceNotAvailableException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves a list that describes one or more app block builder associations.
 */
export const describeAppBlockBuilderAppBlockAssociations: {
  (
    input: DescribeAppBlockBuilderAppBlockAssociationsRequest,
  ): Effect.Effect<
    DescribeAppBlockBuilderAppBlockAssociationsResult,
    | InvalidParameterCombinationException
    | OperationNotPermittedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAppBlockBuilderAppBlockAssociationsRequest,
  ) => Stream.Stream<
    DescribeAppBlockBuilderAppBlockAssociationsResult,
    | InvalidParameterCombinationException
    | OperationNotPermittedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAppBlockBuilderAppBlockAssociationsRequest,
  ) => Stream.Stream<
    unknown,
    | InvalidParameterCombinationException
    | OperationNotPermittedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeAppBlockBuilderAppBlockAssociationsRequest,
  output: DescribeAppBlockBuilderAppBlockAssociationsResult,
  errors: [
    InvalidParameterCombinationException,
    OperationNotPermittedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a list that describes one or more application fleet associations. Either ApplicationArn or FleetName must be specified.
 */
export const describeApplicationFleetAssociations: (
  input: DescribeApplicationFleetAssociationsRequest,
) => Effect.Effect<
  DescribeApplicationFleetAssociationsResult,
  | InvalidParameterCombinationException
  | OperationNotPermittedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeApplicationFleetAssociationsRequest,
  output: DescribeApplicationFleetAssociationsResult,
  errors: [
    InvalidParameterCombinationException,
    OperationNotPermittedException,
  ],
}));
/**
 * Retrieves a list that describes the UserStackAssociation objects. You must specify either or both of the following:
 *
 * - The stack name
 *
 * - The user name (email address of the user associated with the stack) and the authentication type for the user
 */
export const describeUserStackAssociations: (
  input: DescribeUserStackAssociationsRequest,
) => Effect.Effect<
  DescribeUserStackAssociationsResult,
  | InvalidParameterCombinationException
  | OperationNotPermittedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeUserStackAssociationsRequest,
  output: DescribeUserStackAssociationsResult,
  errors: [
    InvalidParameterCombinationException,
    OperationNotPermittedException,
  ],
}));
/**
 * Updates custom branding that customizes the appearance of the streaming application catalog page.
 */
export const updateThemeForStack: (
  input: UpdateThemeForStackRequest,
) => Effect.Effect<
  UpdateThemeForStackResult,
  | ConcurrentModificationException
  | InvalidAccountStatusException
  | InvalidParameterCombinationException
  | LimitExceededException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateThemeForStackRequest,
  output: UpdateThemeForStackResult,
  errors: [
    ConcurrentModificationException,
    InvalidAccountStatusException,
    InvalidParameterCombinationException,
    LimitExceededException,
    OperationNotPermittedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Disassociates a specified app block builder from a specified app block.
 */
export const disassociateAppBlockBuilderAppBlock: (
  input: DisassociateAppBlockBuilderAppBlockRequest,
) => Effect.Effect<
  DisassociateAppBlockBuilderAppBlockResult,
  | ConcurrentModificationException
  | InvalidParameterCombinationException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateAppBlockBuilderAppBlockRequest,
  output: DisassociateAppBlockBuilderAppBlockResult,
  errors: [
    ConcurrentModificationException,
    InvalidParameterCombinationException,
    OperationNotPermittedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Disassociates the specified application from the fleet.
 */
export const disassociateApplicationFleet: (
  input: DisassociateApplicationFleetRequest,
) => Effect.Effect<
  DisassociateApplicationFleetResult,
  | ConcurrentModificationException
  | InvalidParameterCombinationException
  | OperationNotPermittedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateApplicationFleetRequest,
  output: DisassociateApplicationFleetResult,
  errors: [
    ConcurrentModificationException,
    InvalidParameterCombinationException,
    OperationNotPermittedException,
  ],
}));
/**
 * Removes license included application(s) association(s) from an image builder instance.
 */
export const disassociateSoftwareFromImageBuilder: (
  input: DisassociateSoftwareFromImageBuilderRequest,
) => Effect.Effect<
  DisassociateSoftwareFromImageBuilderResult,
  | ConcurrentModificationException
  | InvalidParameterCombinationException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateSoftwareFromImageBuilderRequest,
  output: DisassociateSoftwareFromImageBuilderResult,
  errors: [
    ConcurrentModificationException,
    InvalidParameterCombinationException,
    OperationNotPermittedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Associates the specified app block builder with the specified app block.
 */
export const associateAppBlockBuilderAppBlock: (
  input: AssociateAppBlockBuilderAppBlockRequest,
) => Effect.Effect<
  AssociateAppBlockBuilderAppBlockResult,
  | ConcurrentModificationException
  | InvalidParameterCombinationException
  | LimitExceededException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateAppBlockBuilderAppBlockRequest,
  output: AssociateAppBlockBuilderAppBlockResult,
  errors: [
    ConcurrentModificationException,
    InvalidParameterCombinationException,
    LimitExceededException,
    OperationNotPermittedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Associates the specified application with the specified fleet. This is only supported for Elastic fleets.
 */
export const associateApplicationFleet: (
  input: AssociateApplicationFleetRequest,
) => Effect.Effect<
  AssociateApplicationFleetResult,
  | ConcurrentModificationException
  | InvalidParameterCombinationException
  | LimitExceededException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateApplicationFleetRequest,
  output: AssociateApplicationFleetResult,
  errors: [
    ConcurrentModificationException,
    InvalidParameterCombinationException,
    LimitExceededException,
    OperationNotPermittedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Associates the specified fleet with the specified stack.
 */
export const associateFleet: (
  input: AssociateFleetRequest,
) => Effect.Effect<
  AssociateFleetResult,
  | ConcurrentModificationException
  | IncompatibleImageException
  | InvalidAccountStatusException
  | LimitExceededException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateFleetRequest,
  output: AssociateFleetResult,
  errors: [
    ConcurrentModificationException,
    IncompatibleImageException,
    InvalidAccountStatusException,
    LimitExceededException,
    OperationNotPermittedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Associates the specified users with the specified stacks. Users in a user pool cannot be assigned to stacks with fleets that are joined to an Active Directory domain.
 */
export const batchAssociateUserStack: (
  input: BatchAssociateUserStackRequest,
) => Effect.Effect<
  BatchAssociateUserStackResult,
  | InvalidParameterCombinationException
  | OperationNotPermittedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchAssociateUserStackRequest,
  output: BatchAssociateUserStackResult,
  errors: [
    InvalidParameterCombinationException,
    OperationNotPermittedException,
  ],
}));
/**
 * Disassociates the specified users from the specified stacks.
 */
export const batchDisassociateUserStack: (
  input: BatchDisassociateUserStackRequest,
) => Effect.Effect<
  BatchDisassociateUserStackResult,
  | InvalidParameterCombinationException
  | OperationNotPermittedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDisassociateUserStackRequest,
  output: BatchDisassociateUserStackResult,
  errors: [
    InvalidParameterCombinationException,
    OperationNotPermittedException,
  ],
}));
/**
 * Creates a Directory Config object in WorkSpaces Applications. This object includes the configuration information required to join fleets and image builders to Microsoft Active Directory domains.
 */
export const createDirectoryConfig: (
  input: CreateDirectoryConfigRequest,
) => Effect.Effect<
  CreateDirectoryConfigResult,
  | InvalidAccountStatusException
  | InvalidRoleException
  | LimitExceededException
  | OperationNotPermittedException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDirectoryConfigRequest,
  output: CreateDirectoryConfigResult,
  errors: [
    InvalidAccountStatusException,
    InvalidRoleException,
    LimitExceededException,
    OperationNotPermittedException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a new entitlement. Entitlements control access to specific applications within
 * a stack, based on user attributes. Entitlements apply to SAML 2.0 federated user
 * identities. WorkSpaces Applications user pool and streaming URL users are entitled to all
 * applications in a stack. Entitlements don't apply to the desktop stream view
 * application, or to applications managed by a dynamic app provider using the Dynamic
 * Application Framework.
 */
export const createEntitlement: (
  input: CreateEntitlementRequest,
) => Effect.Effect<
  CreateEntitlementResult,
  | EntitlementAlreadyExistsException
  | LimitExceededException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEntitlementRequest,
  output: CreateEntitlementResult,
  errors: [
    EntitlementAlreadyExistsException,
    LimitExceededException,
    OperationNotPermittedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a task to export a WorkSpaces Applications image to an EC2 AMI. This allows you to use your customized WorkSpaces Applications images with other AWS services or for backup purposes.
 */
export const createExportImageTask: (
  input: CreateExportImageTaskRequest,
) => Effect.Effect<
  CreateExportImageTaskResult,
  | ConcurrentModificationException
  | InvalidAccountStatusException
  | InvalidRoleException
  | LimitExceededException
  | OperationNotPermittedException
  | ResourceNotAvailableException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateExportImageTaskRequest,
  output: CreateExportImageTaskResult,
  errors: [
    ConcurrentModificationException,
    InvalidAccountStatusException,
    InvalidRoleException,
    LimitExceededException,
    OperationNotPermittedException,
    ResourceNotAvailableException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a fleet. A fleet consists of streaming instances that your users access for their applications and desktops.
 */
export const createFleet: (
  input: CreateFleetRequest,
) => Effect.Effect<
  CreateFleetResult,
  | ConcurrentModificationException
  | IncompatibleImageException
  | InvalidAccountStatusException
  | InvalidParameterCombinationException
  | InvalidRoleException
  | LimitExceededException
  | OperationNotPermittedException
  | RequestLimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotAvailableException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFleetRequest,
  output: CreateFleetResult,
  errors: [
    ConcurrentModificationException,
    IncompatibleImageException,
    InvalidAccountStatusException,
    InvalidParameterCombinationException,
    InvalidRoleException,
    LimitExceededException,
    OperationNotPermittedException,
    RequestLimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotAvailableException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates an image builder. An image builder is a virtual machine that is used to create an image.
 *
 * The initial state of the builder is `PENDING`. When it is ready, the state is `RUNNING`.
 */
export const createImageBuilder: (
  input: CreateImageBuilderRequest,
) => Effect.Effect<
  CreateImageBuilderResult,
  | ConcurrentModificationException
  | IncompatibleImageException
  | InvalidAccountStatusException
  | InvalidParameterCombinationException
  | InvalidRoleException
  | LimitExceededException
  | OperationNotPermittedException
  | RequestLimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotAvailableException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateImageBuilderRequest,
  output: CreateImageBuilderResult,
  errors: [
    ConcurrentModificationException,
    IncompatibleImageException,
    InvalidAccountStatusException,
    InvalidParameterCombinationException,
    InvalidRoleException,
    LimitExceededException,
    OperationNotPermittedException,
    RequestLimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotAvailableException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a custom WorkSpaces Applications image by importing an EC2 AMI. This allows you to use your own customized AMI to create WorkSpaces Applications images that support additional instance types beyond the standard stream.* instances.
 */
export const createImportedImage: (
  input: CreateImportedImageRequest,
) => Effect.Effect<
  CreateImportedImageResult,
  | DryRunOperationException
  | IncompatibleImageException
  | InvalidAccountStatusException
  | InvalidRoleException
  | LimitExceededException
  | OperationNotPermittedException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateImportedImageRequest,
  output: CreateImportedImageResult,
  errors: [
    DryRunOperationException,
    IncompatibleImageException,
    InvalidAccountStatusException,
    InvalidRoleException,
    LimitExceededException,
    OperationNotPermittedException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a new image with the latest Windows operating system updates, driver updates, and WorkSpaces Applications agent software.
 *
 * For more information, see the "Update an Image by Using
 * Managed WorkSpaces Applications Image Updates" section in Administer Your WorkSpaces Applications Images, in the *Amazon WorkSpaces Applications Administration Guide*.
 */
export const createUpdatedImage: (
  input: CreateUpdatedImageRequest,
) => Effect.Effect<
  CreateUpdatedImageResult,
  | ConcurrentModificationException
  | IncompatibleImageException
  | InvalidAccountStatusException
  | LimitExceededException
  | OperationNotPermittedException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUpdatedImageRequest,
  output: CreateUpdatedImageResult,
  errors: [
    ConcurrentModificationException,
    IncompatibleImageException,
    InvalidAccountStatusException,
    LimitExceededException,
    OperationNotPermittedException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves a list that describes one or more app block builders.
 */
export const describeAppBlockBuilders: {
  (
    input: DescribeAppBlockBuildersRequest,
  ): Effect.Effect<
    DescribeAppBlockBuildersResult,
    OperationNotPermittedException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAppBlockBuildersRequest,
  ) => Stream.Stream<
    DescribeAppBlockBuildersResult,
    OperationNotPermittedException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAppBlockBuildersRequest,
  ) => Stream.Stream<
    unknown,
    OperationNotPermittedException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeAppBlockBuildersRequest,
  output: DescribeAppBlockBuildersResult,
  errors: [OperationNotPermittedException, ResourceNotFoundException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a list that describes one or more specified fleets, if the fleet names are provided. Otherwise, all fleets in the account are described.
 */
export const describeFleets: (
  input: DescribeFleetsRequest,
) => Effect.Effect<
  DescribeFleetsResult,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFleetsRequest,
  output: DescribeFleetsResult,
  errors: [ResourceNotFoundException],
}));
/**
 * Retrieves a list that describes one or more specified stacks, if the stack names are provided. Otherwise, all stacks in the account are described.
 */
export const describeStacks: (
  input: DescribeStacksRequest,
) => Effect.Effect<
  DescribeStacksResult,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStacksRequest,
  output: DescribeStacksResult,
  errors: [ResourceNotFoundException],
}));
/**
 * Retrieves a list that describes one or more usage report subscriptions.
 */
export const describeUsageReportSubscriptions: (
  input: DescribeUsageReportSubscriptionsRequest,
) => Effect.Effect<
  DescribeUsageReportSubscriptionsResult,
  InvalidAccountStatusException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeUsageReportSubscriptionsRequest,
  output: DescribeUsageReportSubscriptionsResult,
  errors: [InvalidAccountStatusException, ResourceNotFoundException],
}));
/**
 * Creates a stack to start streaming applications to users. A stack consists of an associated fleet, user access policies, and storage configurations.
 */
export const createStack: (
  input: CreateStackRequest,
) => Effect.Effect<
  CreateStackResult,
  | ConcurrentModificationException
  | InvalidAccountStatusException
  | InvalidParameterCombinationException
  | InvalidRoleException
  | LimitExceededException
  | OperationNotPermittedException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStackRequest,
  output: CreateStackResult,
  errors: [
    ConcurrentModificationException,
    InvalidAccountStatusException,
    InvalidParameterCombinationException,
    InvalidRoleException,
    LimitExceededException,
    OperationNotPermittedException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates custom branding that customizes the appearance of the streaming application catalog page.
 */
export const createThemeForStack: (
  input: CreateThemeForStackRequest,
) => Effect.Effect<
  CreateThemeForStackResult,
  | ConcurrentModificationException
  | InvalidAccountStatusException
  | LimitExceededException
  | OperationNotPermittedException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateThemeForStackRequest,
  output: CreateThemeForStackResult,
  errors: [
    ConcurrentModificationException,
    InvalidAccountStatusException,
    LimitExceededException,
    OperationNotPermittedException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
  ],
}));
/**
 * Copies the image within the same region or to a new region within the same AWS account. Note that any tags you added to the image will not be copied.
 */
export const copyImage: (
  input: CopyImageRequest,
) => Effect.Effect<
  CopyImageResponse,
  | IncompatibleImageException
  | InvalidAccountStatusException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotAvailableException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopyImageRequest,
  output: CopyImageResponse,
  errors: [
    IncompatibleImageException,
    InvalidAccountStatusException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotAvailableException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a new user in the user pool.
 */
export const createUser: (
  input: CreateUserRequest,
) => Effect.Effect<
  CreateUserResult,
  | InvalidAccountStatusException
  | InvalidParameterCombinationException
  | LimitExceededException
  | OperationNotPermittedException
  | ResourceAlreadyExistsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserRequest,
  output: CreateUserResult,
  errors: [
    InvalidAccountStatusException,
    InvalidParameterCombinationException,
    LimitExceededException,
    OperationNotPermittedException,
    ResourceAlreadyExistsException,
  ],
}));
/**
 * Creates an app block.
 *
 * App blocks are a WorkSpaces Applications resource that stores the details about the
 * virtual hard disk in an S3 bucket. It also stores the setup script with details about
 * how to mount the virtual hard disk. The virtual hard disk includes the application
 * binaries and other files necessary to launch your applications. Multiple applications
 * can be assigned to a single app block.
 *
 * This is only supported for Elastic fleets.
 */
export const createAppBlock: (
  input: CreateAppBlockRequest,
) => Effect.Effect<
  CreateAppBlockResult,
  | ConcurrentModificationException
  | LimitExceededException
  | OperationNotPermittedException
  | ResourceAlreadyExistsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAppBlockRequest,
  output: CreateAppBlockResult,
  errors: [
    ConcurrentModificationException,
    LimitExceededException,
    OperationNotPermittedException,
    ResourceAlreadyExistsException,
  ],
}));
/**
 * Creates an application.
 *
 * Applications are a WorkSpaces Applications resource that stores the details about how to
 * launch applications on Elastic fleet streaming instances. An application consists of the
 * launch details, icon, and display name. Applications are associated with an app block
 * that contains the application binaries and other files. The applications assigned to an
 * Elastic fleet are the applications users can launch.
 *
 * This is only supported for Elastic fleets.
 */
export const createApplication: (
  input: CreateApplicationRequest,
) => Effect.Effect<
  CreateApplicationResult,
  | ConcurrentModificationException
  | LimitExceededException
  | OperationNotPermittedException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationRequest,
  output: CreateApplicationResult,
  errors: [
    ConcurrentModificationException,
    LimitExceededException,
    OperationNotPermittedException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the specified fleet.
 *
 * If the fleet is in the `STOPPED` state, you can update any attribute except
 * the fleet name.
 *
 * If the fleet is in the `RUNNING` state, you can update the following based
 * on the fleet type:
 *
 * - Always-On and On-Demand fleet types
 *
 * You can update the `DisplayName`, `ComputeCapacity`,
 * `ImageARN`, `ImageName`,
 * `IdleDisconnectTimeoutInSeconds`, and
 * `DisconnectTimeoutInSeconds` attributes.
 *
 * - Elastic fleet type
 *
 * You can update the `DisplayName`,
 * `IdleDisconnectTimeoutInSeconds`,
 * `DisconnectTimeoutInSeconds`, `MaxConcurrentSessions`, `SessionScriptS3Location`
 * and `UsbDeviceFilterStrings` attributes.
 *
 * If the fleet is in the `STARTING` or `STOPPED` state, you can't update it.
 */
export const updateFleet: (
  input: UpdateFleetRequest,
) => Effect.Effect<
  UpdateFleetResult,
  | ConcurrentModificationException
  | IncompatibleImageException
  | InvalidAccountStatusException
  | InvalidParameterCombinationException
  | InvalidRoleException
  | LimitExceededException
  | OperationNotPermittedException
  | RequestLimitExceededException
  | ResourceInUseException
  | ResourceNotAvailableException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFleetRequest,
  output: UpdateFleetResult,
  errors: [
    ConcurrentModificationException,
    IncompatibleImageException,
    InvalidAccountStatusException,
    InvalidParameterCombinationException,
    InvalidRoleException,
    LimitExceededException,
    OperationNotPermittedException,
    RequestLimitExceededException,
    ResourceInUseException,
    ResourceNotAvailableException,
    ResourceNotFoundException,
  ],
}));
/**
 * Starts an app block builder.
 *
 * An app block builder can only be started when it's associated with an app
 * block.
 *
 * Starting an app block builder starts a new instance, which is equivalent to an elastic
 * fleet instance with application builder assistance functionality.
 */
export const startAppBlockBuilder: (
  input: StartAppBlockBuilderRequest,
) => Effect.Effect<
  StartAppBlockBuilderResult,
  | ConcurrentModificationException
  | InvalidAccountStatusException
  | LimitExceededException
  | OperationNotPermittedException
  | RequestLimitExceededException
  | ResourceNotAvailableException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartAppBlockBuilderRequest,
  output: StartAppBlockBuilderResult,
  errors: [
    ConcurrentModificationException,
    InvalidAccountStatusException,
    LimitExceededException,
    OperationNotPermittedException,
    RequestLimitExceededException,
    ResourceNotAvailableException,
    ResourceNotFoundException,
  ],
}));
/**
 * Starts the specified fleet.
 */
export const startFleet: (
  input: StartFleetRequest,
) => Effect.Effect<
  StartFleetResult,
  | ConcurrentModificationException
  | InvalidAccountStatusException
  | InvalidRoleException
  | LimitExceededException
  | OperationNotPermittedException
  | RequestLimitExceededException
  | ResourceNotAvailableException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartFleetRequest,
  output: StartFleetResult,
  errors: [
    ConcurrentModificationException,
    InvalidAccountStatusException,
    InvalidRoleException,
    LimitExceededException,
    OperationNotPermittedException,
    RequestLimitExceededException,
    ResourceNotAvailableException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates an app block builder.
 *
 * If the app block builder is in the `STARTING` or `STOPPING`
 * state, you can't update it. If the app block builder is in the `RUNNING`
 * state, you can only update the DisplayName and Description. If the app block builder is
 * in the `STOPPED` state, you can update any attribute except the Name.
 */
export const updateAppBlockBuilder: (
  input: UpdateAppBlockBuilderRequest,
) => Effect.Effect<
  UpdateAppBlockBuilderResult,
  | ConcurrentModificationException
  | InvalidAccountStatusException
  | InvalidParameterCombinationException
  | InvalidRoleException
  | LimitExceededException
  | OperationNotPermittedException
  | RequestLimitExceededException
  | ResourceInUseException
  | ResourceNotAvailableException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAppBlockBuilderRequest,
  output: UpdateAppBlockBuilderResult,
  errors: [
    ConcurrentModificationException,
    InvalidAccountStatusException,
    InvalidParameterCombinationException,
    InvalidRoleException,
    LimitExceededException,
    OperationNotPermittedException,
    RequestLimitExceededException,
    ResourceInUseException,
    ResourceNotAvailableException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates an app block builder.
 */
export const createAppBlockBuilder: (
  input: CreateAppBlockBuilderRequest,
) => Effect.Effect<
  CreateAppBlockBuilderResult,
  | ConcurrentModificationException
  | InvalidAccountStatusException
  | InvalidParameterCombinationException
  | InvalidRoleException
  | LimitExceededException
  | OperationNotPermittedException
  | RequestLimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotAvailableException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAppBlockBuilderRequest,
  output: CreateAppBlockBuilderResult,
  errors: [
    ConcurrentModificationException,
    InvalidAccountStatusException,
    InvalidParameterCombinationException,
    InvalidRoleException,
    LimitExceededException,
    OperationNotPermittedException,
    RequestLimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotAvailableException,
    ResourceNotFoundException,
  ],
}));
