import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "ControlCatalog",
  serviceShapeName: "ControlCatalog",
});
const auth = T.AwsAuthSigv4({ name: "controlcatalog" });
const ver = T.ServiceVersion("2018-05-10");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseDualStack = false, UseFIPS = false, Endpoint } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  if (Endpoint != null) {
    if (UseFIPS === true) {
      return err(
        "Invalid Configuration: FIPS and custom endpoint are not supported",
      );
    }
    if (UseDualStack === true) {
      return err(
        "Invalid Configuration: Dualstack and custom endpoint are not supported",
      );
    }
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://controlcatalog-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://controlcatalog-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://controlcatalog.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://controlcatalog.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type PaginationToken = string;
export type MaxListControlMappingsResults = number;
export type MaxListCommonControlsResults = number;
export type ControlArn = string;
export type MaxListControlsResults = number;
export type MaxListDomainsResults = number;
export type MaxListObjectivesResults = number;
export type CommonControlArn = string;
export type ControlAlias = string;
export type GovernedResource = string;
export type ObjectiveArn = string;
export type ImplementationType = string;
export type ImplementationIdentifier = string;
export type DomainArn = string;
export type RegionCode = string;
export type FrameworkName = string;
export type FrameworkItem = string;

//# Schemas
export interface GetControlRequest {
  ControlArn: string;
}
export const GetControlRequest = S.suspend(() =>
  S.Struct({ ControlArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/get-control" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetControlRequest",
}) as any as S.Schema<GetControlRequest>;
export interface ListDomainsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListDomainsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domains" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDomainsRequest",
}) as any as S.Schema<ListDomainsRequest>;
export type ControlArnFilterList = string[];
export const ControlArnFilterList = S.Array(S.String);
export type CommonControlArnFilterList = string[];
export const CommonControlArnFilterList = S.Array(S.String);
export type MappingType =
  | "FRAMEWORK"
  | "COMMON_CONTROL"
  | "RELATED_CONTROL"
  | (string & {});
export const MappingType = S.String;
export type MappingTypeFilterList = MappingType[];
export const MappingTypeFilterList = S.Array(MappingType);
export interface ControlMappingFilter {
  ControlArns?: string[];
  CommonControlArns?: string[];
  MappingTypes?: MappingType[];
}
export const ControlMappingFilter = S.suspend(() =>
  S.Struct({
    ControlArns: S.optional(ControlArnFilterList),
    CommonControlArns: S.optional(CommonControlArnFilterList),
    MappingTypes: S.optional(MappingTypeFilterList),
  }),
).annotations({
  identifier: "ControlMappingFilter",
}) as any as S.Schema<ControlMappingFilter>;
export type ControlAliases = string[];
export const ControlAliases = S.Array(S.String);
export type ControlBehavior =
  | "PREVENTIVE"
  | "PROACTIVE"
  | "DETECTIVE"
  | (string & {});
export const ControlBehavior = S.String;
export type ControlSeverity =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL"
  | (string & {});
export const ControlSeverity = S.String;
export type GovernedResources = string[];
export const GovernedResources = S.Array(S.String);
export type ImplementationTypeFilterList = string[];
export const ImplementationTypeFilterList = S.Array(S.String);
export type ImplementationIdentifierFilterList = string[];
export const ImplementationIdentifierFilterList = S.Array(S.String);
export interface ListControlMappingsRequest {
  NextToken?: string;
  MaxResults?: number;
  Filter?: ControlMappingFilter;
}
export const ListControlMappingsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    Filter: S.optional(ControlMappingFilter),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-control-mappings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListControlMappingsRequest",
}) as any as S.Schema<ListControlMappingsRequest>;
export interface ObjectiveResourceFilter {
  Arn?: string;
}
export const ObjectiveResourceFilter = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "ObjectiveResourceFilter",
}) as any as S.Schema<ObjectiveResourceFilter>;
export type ObjectiveResourceFilterList = ObjectiveResourceFilter[];
export const ObjectiveResourceFilterList = S.Array(ObjectiveResourceFilter);
export type ControlScope = "GLOBAL" | "REGIONAL" | (string & {});
export const ControlScope = S.String;
export type DeployableRegions = string[];
export const DeployableRegions = S.Array(S.String);
export interface ImplementationFilter {
  Types?: string[];
  Identifiers?: string[];
}
export const ImplementationFilter = S.suspend(() =>
  S.Struct({
    Types: S.optional(ImplementationTypeFilterList),
    Identifiers: S.optional(ImplementationIdentifierFilterList),
  }),
).annotations({
  identifier: "ImplementationFilter",
}) as any as S.Schema<ImplementationFilter>;
export interface DomainResourceFilter {
  Arn?: string;
}
export const DomainResourceFilter = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "DomainResourceFilter",
}) as any as S.Schema<DomainResourceFilter>;
export type DomainResourceFilterList = DomainResourceFilter[];
export const DomainResourceFilterList = S.Array(DomainResourceFilter);
export interface CommonControlFilter {
  Objectives?: ObjectiveResourceFilter[];
}
export const CommonControlFilter = S.suspend(() =>
  S.Struct({ Objectives: S.optional(ObjectiveResourceFilterList) }),
).annotations({
  identifier: "CommonControlFilter",
}) as any as S.Schema<CommonControlFilter>;
export interface RegionConfiguration {
  Scope: ControlScope;
  DeployableRegions?: string[];
}
export const RegionConfiguration = S.suspend(() =>
  S.Struct({
    Scope: ControlScope,
    DeployableRegions: S.optional(DeployableRegions),
  }),
).annotations({
  identifier: "RegionConfiguration",
}) as any as S.Schema<RegionConfiguration>;
export interface ImplementationDetails {
  Type: string;
  Identifier?: string;
}
export const ImplementationDetails = S.suspend(() =>
  S.Struct({ Type: S.String, Identifier: S.optional(S.String) }),
).annotations({
  identifier: "ImplementationDetails",
}) as any as S.Schema<ImplementationDetails>;
export interface ControlParameter {
  Name: string;
}
export const ControlParameter = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "ControlParameter",
}) as any as S.Schema<ControlParameter>;
export type ControlParameters = ControlParameter[];
export const ControlParameters = S.Array(ControlParameter);
export interface ControlFilter {
  Implementations?: ImplementationFilter;
}
export const ControlFilter = S.suspend(() =>
  S.Struct({ Implementations: S.optional(ImplementationFilter) }),
).annotations({
  identifier: "ControlFilter",
}) as any as S.Schema<ControlFilter>;
export interface DomainSummary {
  Arn: string;
  Name: string;
  Description: string;
  CreateTime: Date;
  LastUpdateTime: Date;
}
export const DomainSummary = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Name: S.String,
    Description: S.String,
    CreateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "DomainSummary",
}) as any as S.Schema<DomainSummary>;
export type DomainSummaryList = DomainSummary[];
export const DomainSummaryList = S.Array(DomainSummary);
export interface ObjectiveFilter {
  Domains?: DomainResourceFilter[];
}
export const ObjectiveFilter = S.suspend(() =>
  S.Struct({ Domains: S.optional(DomainResourceFilterList) }),
).annotations({
  identifier: "ObjectiveFilter",
}) as any as S.Schema<ObjectiveFilter>;
export interface ListCommonControlsRequest {
  MaxResults?: number;
  NextToken?: string;
  CommonControlFilter?: CommonControlFilter;
}
export const ListCommonControlsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    CommonControlFilter: S.optional(CommonControlFilter),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/common-controls" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCommonControlsRequest",
}) as any as S.Schema<ListCommonControlsRequest>;
export interface GetControlResponse {
  Arn: string;
  Aliases?: string[];
  Name: string;
  Description: string;
  Behavior: ControlBehavior;
  Severity?: ControlSeverity;
  RegionConfiguration: RegionConfiguration;
  Implementation?: ImplementationDetails;
  Parameters?: ControlParameter[];
  CreateTime?: Date;
  GovernedResources?: string[];
}
export const GetControlResponse = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Aliases: S.optional(ControlAliases),
    Name: S.String,
    Description: S.String,
    Behavior: ControlBehavior,
    Severity: S.optional(ControlSeverity),
    RegionConfiguration: RegionConfiguration,
    Implementation: S.optional(ImplementationDetails),
    Parameters: S.optional(ControlParameters),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    GovernedResources: S.optional(GovernedResources),
  }),
).annotations({
  identifier: "GetControlResponse",
}) as any as S.Schema<GetControlResponse>;
export interface ListControlsRequest {
  NextToken?: string;
  MaxResults?: number;
  Filter?: ControlFilter;
}
export const ListControlsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    Filter: S.optional(ControlFilter),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-controls" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListControlsRequest",
}) as any as S.Schema<ListControlsRequest>;
export interface ListDomainsResponse {
  Domains: DomainSummary[];
  NextToken?: string;
}
export const ListDomainsResponse = S.suspend(() =>
  S.Struct({ Domains: DomainSummaryList, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListDomainsResponse",
}) as any as S.Schema<ListDomainsResponse>;
export interface ListObjectivesRequest {
  MaxResults?: number;
  NextToken?: string;
  ObjectiveFilter?: ObjectiveFilter;
}
export const ListObjectivesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    ObjectiveFilter: S.optional(ObjectiveFilter),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/objectives" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListObjectivesRequest",
}) as any as S.Schema<ListObjectivesRequest>;
export type ControlRelationType =
  | "COMPLEMENTARY"
  | "ALTERNATIVE"
  | "MUTUALLY_EXCLUSIVE"
  | (string & {});
export const ControlRelationType = S.String;
export interface AssociatedDomainSummary {
  Arn?: string;
  Name?: string;
}
export const AssociatedDomainSummary = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Name: S.optional(S.String) }),
).annotations({
  identifier: "AssociatedDomainSummary",
}) as any as S.Schema<AssociatedDomainSummary>;
export interface ObjectiveSummary {
  Arn: string;
  Name: string;
  Description: string;
  Domain: AssociatedDomainSummary;
  CreateTime: Date;
  LastUpdateTime: Date;
}
export const ObjectiveSummary = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Name: S.String,
    Description: S.String,
    Domain: AssociatedDomainSummary,
    CreateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ObjectiveSummary",
}) as any as S.Schema<ObjectiveSummary>;
export type ObjectiveSummaryList = ObjectiveSummary[];
export const ObjectiveSummaryList = S.Array(ObjectiveSummary);
export interface FrameworkMappingDetails {
  Name: string;
  Item: string;
}
export const FrameworkMappingDetails = S.suspend(() =>
  S.Struct({ Name: S.String, Item: S.String }),
).annotations({
  identifier: "FrameworkMappingDetails",
}) as any as S.Schema<FrameworkMappingDetails>;
export interface CommonControlMappingDetails {
  CommonControlArn: string;
}
export const CommonControlMappingDetails = S.suspend(() =>
  S.Struct({ CommonControlArn: S.String }),
).annotations({
  identifier: "CommonControlMappingDetails",
}) as any as S.Schema<CommonControlMappingDetails>;
export interface RelatedControlMappingDetails {
  ControlArn?: string;
  RelationType: ControlRelationType;
}
export const RelatedControlMappingDetails = S.suspend(() =>
  S.Struct({
    ControlArn: S.optional(S.String),
    RelationType: ControlRelationType,
  }),
).annotations({
  identifier: "RelatedControlMappingDetails",
}) as any as S.Schema<RelatedControlMappingDetails>;
export interface ListObjectivesResponse {
  Objectives: ObjectiveSummary[];
  NextToken?: string;
}
export const ListObjectivesResponse = S.suspend(() =>
  S.Struct({
    Objectives: ObjectiveSummaryList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListObjectivesResponse",
}) as any as S.Schema<ListObjectivesResponse>;
export type Mapping =
  | {
      Framework: FrameworkMappingDetails;
      CommonControl?: never;
      RelatedControl?: never;
    }
  | {
      Framework?: never;
      CommonControl: CommonControlMappingDetails;
      RelatedControl?: never;
    }
  | {
      Framework?: never;
      CommonControl?: never;
      RelatedControl: RelatedControlMappingDetails;
    };
export const Mapping = S.Union(
  S.Struct({ Framework: FrameworkMappingDetails }),
  S.Struct({ CommonControl: CommonControlMappingDetails }),
  S.Struct({ RelatedControl: RelatedControlMappingDetails }),
);
export interface AssociatedObjectiveSummary {
  Arn?: string;
  Name?: string;
}
export const AssociatedObjectiveSummary = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Name: S.optional(S.String) }),
).annotations({
  identifier: "AssociatedObjectiveSummary",
}) as any as S.Schema<AssociatedObjectiveSummary>;
export interface ImplementationSummary {
  Type: string;
  Identifier?: string;
}
export const ImplementationSummary = S.suspend(() =>
  S.Struct({ Type: S.String, Identifier: S.optional(S.String) }),
).annotations({
  identifier: "ImplementationSummary",
}) as any as S.Schema<ImplementationSummary>;
export interface ControlMapping {
  ControlArn: string;
  MappingType: MappingType;
  Mapping: Mapping;
}
export const ControlMapping = S.suspend(() =>
  S.Struct({
    ControlArn: S.String,
    MappingType: MappingType,
    Mapping: Mapping,
  }),
).annotations({
  identifier: "ControlMapping",
}) as any as S.Schema<ControlMapping>;
export type ControlMappings = ControlMapping[];
export const ControlMappings = S.Array(ControlMapping);
export interface CommonControlSummary {
  Arn: string;
  Name: string;
  Description: string;
  Domain: AssociatedDomainSummary;
  Objective: AssociatedObjectiveSummary;
  CreateTime: Date;
  LastUpdateTime: Date;
}
export const CommonControlSummary = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Name: S.String,
    Description: S.String,
    Domain: AssociatedDomainSummary,
    Objective: AssociatedObjectiveSummary,
    CreateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "CommonControlSummary",
}) as any as S.Schema<CommonControlSummary>;
export type CommonControlSummaryList = CommonControlSummary[];
export const CommonControlSummaryList = S.Array(CommonControlSummary);
export interface ControlSummary {
  Arn: string;
  Aliases?: string[];
  Name: string;
  Description: string;
  Behavior?: ControlBehavior;
  Severity?: ControlSeverity;
  Implementation?: ImplementationSummary;
  CreateTime?: Date;
  GovernedResources?: string[];
}
export const ControlSummary = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Aliases: S.optional(ControlAliases),
    Name: S.String,
    Description: S.String,
    Behavior: S.optional(ControlBehavior),
    Severity: S.optional(ControlSeverity),
    Implementation: S.optional(ImplementationSummary),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    GovernedResources: S.optional(GovernedResources),
  }),
).annotations({
  identifier: "ControlSummary",
}) as any as S.Schema<ControlSummary>;
export type Controls = ControlSummary[];
export const Controls = S.Array(ControlSummary);
export interface ListControlMappingsResponse {
  ControlMappings: ControlMapping[];
  NextToken?: string;
}
export const ListControlMappingsResponse = S.suspend(() =>
  S.Struct({
    ControlMappings: ControlMappings,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListControlMappingsResponse",
}) as any as S.Schema<ListControlMappingsResponse>;
export interface ListCommonControlsResponse {
  CommonControls: CommonControlSummary[];
  NextToken?: string;
}
export const ListCommonControlsResponse = S.suspend(() =>
  S.Struct({
    CommonControls: CommonControlSummaryList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCommonControlsResponse",
}) as any as S.Schema<ListCommonControlsResponse>;
export interface ListControlsResponse {
  Controls: ControlSummary[];
  NextToken?: string;
}
export const ListControlsResponse = S.suspend(() =>
  S.Struct({ Controls: Controls, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListControlsResponse",
}) as any as S.Schema<ListControlsResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns a paginated list of objectives from the Control Catalog.
 *
 * You can apply an optional filter to see the objectives that belong to a specific domain. If you don’t provide a filter, the operation returns all objectives.
 */
export const listObjectives: {
  (
    input: ListObjectivesRequest,
  ): effect.Effect<
    ListObjectivesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListObjectivesRequest,
  ) => stream.Stream<
    ListObjectivesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListObjectivesRequest,
  ) => stream.Stream<
    ObjectiveSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListObjectivesRequest,
  output: ListObjectivesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Objectives",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a paginated list of domains from the Control Catalog.
 */
export const listDomains: {
  (
    input: ListDomainsRequest,
  ): effect.Effect<
    ListDomainsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDomainsRequest,
  ) => stream.Stream<
    ListDomainsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDomainsRequest,
  ) => stream.Stream<
    DomainSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDomainsRequest,
  output: ListDomainsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Domains",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a paginated list of control mappings from the Control Catalog. Control mappings show relationships between controls and other entities, such as common controls or compliance frameworks.
 */
export const listControlMappings: {
  (
    input: ListControlMappingsRequest,
  ): effect.Effect<
    ListControlMappingsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListControlMappingsRequest,
  ) => stream.Stream<
    ListControlMappingsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListControlMappingsRequest,
  ) => stream.Stream<
    ControlMapping,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListControlMappingsRequest,
  output: ListControlMappingsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ControlMappings",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a paginated list of common controls from the Amazon Web Services Control Catalog.
 *
 * You can apply an optional filter to see common controls that have a specific objective. If you don’t provide a filter, the operation returns all common controls.
 */
export const listCommonControls: {
  (
    input: ListCommonControlsRequest,
  ): effect.Effect<
    ListCommonControlsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCommonControlsRequest,
  ) => stream.Stream<
    ListCommonControlsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCommonControlsRequest,
  ) => stream.Stream<
    CommonControlSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCommonControlsRequest,
  output: ListCommonControlsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "CommonControls",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns details about a specific control, most notably a list of Amazon Web Services Regions where this control is supported. Input a value for the *ControlArn* parameter, in ARN form. `GetControl` accepts *controltower* or *controlcatalog* control ARNs as input. Returns a *controlcatalog* ARN format.
 *
 * In the API response, controls that have the value `GLOBAL` in the `Scope` field do not show the `DeployableRegions` field, because it does not apply. Controls that have the value `REGIONAL` in the `Scope` field return a value for the `DeployableRegions` field, as shown in the example.
 */
export const getControl: (
  input: GetControlRequest,
) => effect.Effect<
  GetControlResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetControlRequest,
  output: GetControlResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a paginated list of all available controls in the Control Catalog library. Allows you to discover available controls. The list of controls is given as structures of type *controlSummary*. The ARN is returned in the global *controlcatalog* format, as shown in the examples.
 */
export const listControls: {
  (
    input: ListControlsRequest,
  ): effect.Effect<
    ListControlsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListControlsRequest,
  ) => stream.Stream<
    ListControlsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListControlsRequest,
  ) => stream.Stream<
    ControlSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListControlsRequest,
  output: ListControlsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Controls",
    pageSize: "MaxResults",
  } as const,
}));
