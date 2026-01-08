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
  sdkId: "MailManager",
  serviceShapeName: "MailManagerSvc",
});
const auth = T.AwsAuthSigv4({ name: "ses" });
const ver = T.ServiceVersion("2023-10-17");
const proto = T.AwsProtocolsAwsJson1_0();
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
              `https://mail-manager-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://mail-manager-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://mail-manager.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://mail-manager.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type IdempotencyToken = string;
export type AddressListId = string;
export type JobName = string;
export type Address = string | redacted.Redacted<string>;
export type JobId = string;
export type ExportId = string;
export type ArchivedMessageId = string;
export type SearchId = string;
export type PaginationToken = string;
export type PageSize = number;
export type ArchiveId = string;
export type AddressPageSize = number;
export type TaggableResourceArn = string;
export type ExportMaxResults = number;
export type SearchMaxResults = number;
export type TagKey = string;
export type AddonSubscriptionId = string;
export type AddonInstanceId = string;
export type AddonName = string;
export type AddressListName = string;
export type ArchiveNameString = string;
export type KmsKeyArn = string;
export type ArchiveIdString = string;
export type IngressPointName = string;
export type RuleSetId = string;
export type TrafficPolicyId = string;
export type IngressPointId = string;
export type RelayName = string;
export type RelayServerName = string;
export type RelayServerPort = number;
export type RelayId = string;
export type RuleSetName = string;
export type TrafficPolicyName = string;
export type MaxMessageSizeBytes = number;
export type AddressPrefix = string | redacted.Redacted<string>;
export type TagValue = string;
export type SmtpPassword = string | redacted.Redacted<string>;
export type SecretArn = string;
export type RuleName = string;
export type ErrorMessage = string;
export type PreSignedUrl = string | redacted.Redacted<string>;
export type JobItemsCount = number;
export type S3PresignedURL = string;
export type AddonInstanceArn = string;
export type AddonSubscriptionArn = string;
export type AddressListArn = string;
export type ArchiveArn = string;
export type IngressPointArn = string;
export type IngressPointARecord = string;
export type RelayArn = string;
export type RuleSetArn = string;
export type TrafficPolicyArn = string;
export type S3Location = string;
export type VpcEndpointId = string;
export type SenderIpAddress = string | redacted.Redacted<string>;
export type StringValue = string;
export type RuleStringValue = string;
export type RuleIpStringValue = string;
export type IdOrArn = string;
export type NameOrArn = string;
export type IamRoleArn = string;
export type S3Bucket = string;
export type S3Prefix = string;
export type KmsKeyId = string;
export type HeaderName = string;
export type HeaderValue = string;
export type EmailAddress = string | redacted.Redacted<string>;
export type QBusinessApplicationId = string;
export type QBusinessIndexId = string;
export type SnsTopicArn = string;
export type Ipv4Cidr = string;
export type Ipv6Cidr = string;
export type MimeHeaderAttribute = string;
export type AnalyzerArn = string;
export type ResultField = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type IngressPointType = "OPEN" | "AUTH";
export const IngressPointType = S.Literal("OPEN", "AUTH");
export type IngressPointStatusToUpdate = "ACTIVE" | "CLOSED";
export const IngressPointStatusToUpdate = S.Literal("ACTIVE", "CLOSED");
export type AcceptAction = "ALLOW" | "DENY";
export const AcceptAction = S.Literal("ALLOW", "DENY");
export interface DeregisterMemberFromAddressListRequest {
  AddressListId: string;
  Address: string | redacted.Redacted<string>;
}
export const DeregisterMemberFromAddressListRequest = S.suspend(() =>
  S.Struct({ AddressListId: S.String, Address: SensitiveString }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeregisterMemberFromAddressListRequest",
}) as any as S.Schema<DeregisterMemberFromAddressListRequest>;
export interface DeregisterMemberFromAddressListResponse {}
export const DeregisterMemberFromAddressListResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeregisterMemberFromAddressListResponse",
}) as any as S.Schema<DeregisterMemberFromAddressListResponse>;
export interface GetAddressListImportJobRequest {
  JobId: string;
}
export const GetAddressListImportJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAddressListImportJobRequest",
}) as any as S.Schema<GetAddressListImportJobRequest>;
export interface GetArchiveExportRequest {
  ExportId: string;
}
export const GetArchiveExportRequest = S.suspend(() =>
  S.Struct({ ExportId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetArchiveExportRequest",
}) as any as S.Schema<GetArchiveExportRequest>;
export interface GetArchiveMessageRequest {
  ArchivedMessageId: string;
}
export const GetArchiveMessageRequest = S.suspend(() =>
  S.Struct({ ArchivedMessageId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetArchiveMessageRequest",
}) as any as S.Schema<GetArchiveMessageRequest>;
export interface GetArchiveMessageContentRequest {
  ArchivedMessageId: string;
}
export const GetArchiveMessageContentRequest = S.suspend(() =>
  S.Struct({ ArchivedMessageId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetArchiveMessageContentRequest",
}) as any as S.Schema<GetArchiveMessageContentRequest>;
export interface GetArchiveSearchRequest {
  SearchId: string;
}
export const GetArchiveSearchRequest = S.suspend(() =>
  S.Struct({ SearchId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetArchiveSearchRequest",
}) as any as S.Schema<GetArchiveSearchRequest>;
export interface GetArchiveSearchResultsRequest {
  SearchId: string;
}
export const GetArchiveSearchResultsRequest = S.suspend(() =>
  S.Struct({ SearchId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetArchiveSearchResultsRequest",
}) as any as S.Schema<GetArchiveSearchResultsRequest>;
export interface GetMemberOfAddressListRequest {
  AddressListId: string;
  Address: string | redacted.Redacted<string>;
}
export const GetMemberOfAddressListRequest = S.suspend(() =>
  S.Struct({ AddressListId: S.String, Address: SensitiveString }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetMemberOfAddressListRequest",
}) as any as S.Schema<GetMemberOfAddressListRequest>;
export interface ListAddressListImportJobsRequest {
  AddressListId: string;
  NextToken?: string;
  PageSize?: number;
}
export const ListAddressListImportJobsRequest = S.suspend(() =>
  S.Struct({
    AddressListId: S.String,
    NextToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAddressListImportJobsRequest",
}) as any as S.Schema<ListAddressListImportJobsRequest>;
export interface ListArchiveExportsRequest {
  ArchiveId: string;
  NextToken?: string;
  PageSize?: number;
}
export const ListArchiveExportsRequest = S.suspend(() =>
  S.Struct({
    ArchiveId: S.String,
    NextToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListArchiveExportsRequest",
}) as any as S.Schema<ListArchiveExportsRequest>;
export interface ListArchiveSearchesRequest {
  ArchiveId: string;
  NextToken?: string;
  PageSize?: number;
}
export const ListArchiveSearchesRequest = S.suspend(() =>
  S.Struct({
    ArchiveId: S.String,
    NextToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListArchiveSearchesRequest",
}) as any as S.Schema<ListArchiveSearchesRequest>;
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
export interface RegisterMemberToAddressListRequest {
  AddressListId: string;
  Address: string | redacted.Redacted<string>;
}
export const RegisterMemberToAddressListRequest = S.suspend(() =>
  S.Struct({ AddressListId: S.String, Address: SensitiveString }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RegisterMemberToAddressListRequest",
}) as any as S.Schema<RegisterMemberToAddressListRequest>;
export interface RegisterMemberToAddressListResponse {}
export const RegisterMemberToAddressListResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RegisterMemberToAddressListResponse",
}) as any as S.Schema<RegisterMemberToAddressListResponse>;
export interface StartAddressListImportJobRequest {
  JobId: string;
}
export const StartAddressListImportJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartAddressListImportJobRequest",
}) as any as S.Schema<StartAddressListImportJobRequest>;
export interface StartAddressListImportJobResponse {}
export const StartAddressListImportJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StartAddressListImportJobResponse",
}) as any as S.Schema<StartAddressListImportJobResponse>;
export type ArchiveStringEmailAttribute =
  | "TO"
  | "FROM"
  | "CC"
  | "SUBJECT"
  | "ENVELOPE_TO"
  | "ENVELOPE_FROM";
export const ArchiveStringEmailAttribute = S.Literal(
  "TO",
  "FROM",
  "CC",
  "SUBJECT",
  "ENVELOPE_TO",
  "ENVELOPE_FROM",
);
export type ArchiveStringToEvaluate = {
  Attribute: ArchiveStringEmailAttribute;
};
export const ArchiveStringToEvaluate = S.Union(
  S.Struct({ Attribute: ArchiveStringEmailAttribute }),
);
export type ArchiveStringOperator = "CONTAINS";
export const ArchiveStringOperator = S.Literal("CONTAINS");
export type StringValueList = string[];
export const StringValueList = S.Array(S.String);
export interface ArchiveStringExpression {
  Evaluate: ArchiveStringToEvaluate;
  Operator: ArchiveStringOperator;
  Values: string[];
}
export const ArchiveStringExpression = S.suspend(() =>
  S.Struct({
    Evaluate: ArchiveStringToEvaluate,
    Operator: ArchiveStringOperator,
    Values: StringValueList,
  }),
).annotations({
  identifier: "ArchiveStringExpression",
}) as any as S.Schema<ArchiveStringExpression>;
export type ArchiveBooleanEmailAttribute = "HAS_ATTACHMENTS";
export const ArchiveBooleanEmailAttribute = S.Literal("HAS_ATTACHMENTS");
export type ArchiveBooleanToEvaluate = {
  Attribute: ArchiveBooleanEmailAttribute;
};
export const ArchiveBooleanToEvaluate = S.Union(
  S.Struct({ Attribute: ArchiveBooleanEmailAttribute }),
);
export type ArchiveBooleanOperator = "IS_TRUE" | "IS_FALSE";
export const ArchiveBooleanOperator = S.Literal("IS_TRUE", "IS_FALSE");
export interface ArchiveBooleanExpression {
  Evaluate: ArchiveBooleanToEvaluate;
  Operator: ArchiveBooleanOperator;
}
export const ArchiveBooleanExpression = S.suspend(() =>
  S.Struct({
    Evaluate: ArchiveBooleanToEvaluate,
    Operator: ArchiveBooleanOperator,
  }),
).annotations({
  identifier: "ArchiveBooleanExpression",
}) as any as S.Schema<ArchiveBooleanExpression>;
export type ArchiveFilterCondition =
  | { StringExpression: ArchiveStringExpression }
  | { BooleanExpression: ArchiveBooleanExpression };
export const ArchiveFilterCondition = S.Union(
  S.Struct({ StringExpression: ArchiveStringExpression }),
  S.Struct({ BooleanExpression: ArchiveBooleanExpression }),
);
export type ArchiveFilterConditions = ArchiveFilterCondition[];
export const ArchiveFilterConditions = S.Array(ArchiveFilterCondition);
export interface ArchiveFilters {
  Include?: ArchiveFilterCondition[];
  Unless?: ArchiveFilterCondition[];
}
export const ArchiveFilters = S.suspend(() =>
  S.Struct({
    Include: S.optional(ArchiveFilterConditions),
    Unless: S.optional(ArchiveFilterConditions),
  }),
).annotations({
  identifier: "ArchiveFilters",
}) as any as S.Schema<ArchiveFilters>;
export interface StartArchiveSearchRequest {
  ArchiveId: string;
  Filters?: ArchiveFilters;
  FromTimestamp: Date;
  ToTimestamp: Date;
  MaxResults: number;
}
export const StartArchiveSearchRequest = S.suspend(() =>
  S.Struct({
    ArchiveId: S.String,
    Filters: S.optional(ArchiveFilters),
    FromTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ToTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    MaxResults: S.Number,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartArchiveSearchRequest",
}) as any as S.Schema<StartArchiveSearchRequest>;
export interface StopAddressListImportJobRequest {
  JobId: string;
}
export const StopAddressListImportJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopAddressListImportJobRequest",
}) as any as S.Schema<StopAddressListImportJobRequest>;
export interface StopAddressListImportJobResponse {}
export const StopAddressListImportJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopAddressListImportJobResponse",
}) as any as S.Schema<StopAddressListImportJobResponse>;
export interface StopArchiveExportRequest {
  ExportId: string;
}
export const StopArchiveExportRequest = S.suspend(() =>
  S.Struct({ ExportId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopArchiveExportRequest",
}) as any as S.Schema<StopArchiveExportRequest>;
export interface StopArchiveExportResponse {}
export const StopArchiveExportResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopArchiveExportResponse",
}) as any as S.Schema<StopArchiveExportResponse>;
export interface StopArchiveSearchRequest {
  SearchId: string;
}
export const StopArchiveSearchRequest = S.suspend(() =>
  S.Struct({ SearchId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopArchiveSearchRequest",
}) as any as S.Schema<StopArchiveSearchRequest>;
export interface StopArchiveSearchResponse {}
export const StopArchiveSearchResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopArchiveSearchResponse",
}) as any as S.Schema<StopArchiveSearchResponse>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: string[];
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
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateAddonInstanceRequest {
  ClientToken?: string;
  AddonSubscriptionId: string;
  Tags?: Tag[];
}
export const CreateAddonInstanceRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    AddonSubscriptionId: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAddonInstanceRequest",
}) as any as S.Schema<CreateAddonInstanceRequest>;
export interface GetAddonInstanceRequest {
  AddonInstanceId: string;
}
export const GetAddonInstanceRequest = S.suspend(() =>
  S.Struct({ AddonInstanceId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAddonInstanceRequest",
}) as any as S.Schema<GetAddonInstanceRequest>;
export interface DeleteAddonInstanceRequest {
  AddonInstanceId: string;
}
export const DeleteAddonInstanceRequest = S.suspend(() =>
  S.Struct({ AddonInstanceId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAddonInstanceRequest",
}) as any as S.Schema<DeleteAddonInstanceRequest>;
export interface DeleteAddonInstanceResponse {}
export const DeleteAddonInstanceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAddonInstanceResponse",
}) as any as S.Schema<DeleteAddonInstanceResponse>;
export interface ListAddonInstancesRequest {
  NextToken?: string;
  PageSize?: number;
}
export const ListAddonInstancesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAddonInstancesRequest",
}) as any as S.Schema<ListAddonInstancesRequest>;
export interface CreateAddonSubscriptionRequest {
  ClientToken?: string;
  AddonName: string;
  Tags?: Tag[];
}
export const CreateAddonSubscriptionRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    AddonName: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAddonSubscriptionRequest",
}) as any as S.Schema<CreateAddonSubscriptionRequest>;
export interface GetAddonSubscriptionRequest {
  AddonSubscriptionId: string;
}
export const GetAddonSubscriptionRequest = S.suspend(() =>
  S.Struct({ AddonSubscriptionId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAddonSubscriptionRequest",
}) as any as S.Schema<GetAddonSubscriptionRequest>;
export interface DeleteAddonSubscriptionRequest {
  AddonSubscriptionId: string;
}
export const DeleteAddonSubscriptionRequest = S.suspend(() =>
  S.Struct({ AddonSubscriptionId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAddonSubscriptionRequest",
}) as any as S.Schema<DeleteAddonSubscriptionRequest>;
export interface DeleteAddonSubscriptionResponse {}
export const DeleteAddonSubscriptionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAddonSubscriptionResponse",
}) as any as S.Schema<DeleteAddonSubscriptionResponse>;
export interface ListAddonSubscriptionsRequest {
  NextToken?: string;
  PageSize?: number;
}
export const ListAddonSubscriptionsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAddonSubscriptionsRequest",
}) as any as S.Schema<ListAddonSubscriptionsRequest>;
export interface CreateAddressListRequest {
  ClientToken?: string;
  AddressListName: string;
  Tags?: Tag[];
}
export const CreateAddressListRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    AddressListName: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAddressListRequest",
}) as any as S.Schema<CreateAddressListRequest>;
export interface GetAddressListRequest {
  AddressListId: string;
}
export const GetAddressListRequest = S.suspend(() =>
  S.Struct({ AddressListId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAddressListRequest",
}) as any as S.Schema<GetAddressListRequest>;
export interface DeleteAddressListRequest {
  AddressListId: string;
}
export const DeleteAddressListRequest = S.suspend(() =>
  S.Struct({ AddressListId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAddressListRequest",
}) as any as S.Schema<DeleteAddressListRequest>;
export interface DeleteAddressListResponse {}
export const DeleteAddressListResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAddressListResponse",
}) as any as S.Schema<DeleteAddressListResponse>;
export interface ListAddressListsRequest {
  NextToken?: string;
  PageSize?: number;
}
export const ListAddressListsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAddressListsRequest",
}) as any as S.Schema<ListAddressListsRequest>;
export interface GetArchiveRequest {
  ArchiveId: string;
}
export const GetArchiveRequest = S.suspend(() =>
  S.Struct({ ArchiveId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetArchiveRequest",
}) as any as S.Schema<GetArchiveRequest>;
export type RetentionPeriod =
  | "THREE_MONTHS"
  | "SIX_MONTHS"
  | "NINE_MONTHS"
  | "ONE_YEAR"
  | "EIGHTEEN_MONTHS"
  | "TWO_YEARS"
  | "THIRTY_MONTHS"
  | "THREE_YEARS"
  | "FOUR_YEARS"
  | "FIVE_YEARS"
  | "SIX_YEARS"
  | "SEVEN_YEARS"
  | "EIGHT_YEARS"
  | "NINE_YEARS"
  | "TEN_YEARS"
  | "PERMANENT";
export const RetentionPeriod = S.Literal(
  "THREE_MONTHS",
  "SIX_MONTHS",
  "NINE_MONTHS",
  "ONE_YEAR",
  "EIGHTEEN_MONTHS",
  "TWO_YEARS",
  "THIRTY_MONTHS",
  "THREE_YEARS",
  "FOUR_YEARS",
  "FIVE_YEARS",
  "SIX_YEARS",
  "SEVEN_YEARS",
  "EIGHT_YEARS",
  "NINE_YEARS",
  "TEN_YEARS",
  "PERMANENT",
);
export type ArchiveRetention = { RetentionPeriod: RetentionPeriod };
export const ArchiveRetention = S.Union(
  S.Struct({ RetentionPeriod: RetentionPeriod }),
);
export interface UpdateArchiveRequest {
  ArchiveId: string;
  ArchiveName?: string;
  Retention?: ArchiveRetention;
}
export const UpdateArchiveRequest = S.suspend(() =>
  S.Struct({
    ArchiveId: S.String,
    ArchiveName: S.optional(S.String),
    Retention: S.optional(ArchiveRetention),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateArchiveRequest",
}) as any as S.Schema<UpdateArchiveRequest>;
export interface UpdateArchiveResponse {}
export const UpdateArchiveResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateArchiveResponse",
}) as any as S.Schema<UpdateArchiveResponse>;
export interface DeleteArchiveRequest {
  ArchiveId: string;
}
export const DeleteArchiveRequest = S.suspend(() =>
  S.Struct({ ArchiveId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteArchiveRequest",
}) as any as S.Schema<DeleteArchiveRequest>;
export interface DeleteArchiveResponse {}
export const DeleteArchiveResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteArchiveResponse",
}) as any as S.Schema<DeleteArchiveResponse>;
export interface ListArchivesRequest {
  NextToken?: string;
  PageSize?: number;
}
export const ListArchivesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListArchivesRequest",
}) as any as S.Schema<ListArchivesRequest>;
export interface GetIngressPointRequest {
  IngressPointId: string;
}
export const GetIngressPointRequest = S.suspend(() =>
  S.Struct({ IngressPointId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetIngressPointRequest",
}) as any as S.Schema<GetIngressPointRequest>;
export type IngressPointConfiguration =
  | { SmtpPassword: string | redacted.Redacted<string> }
  | { SecretArn: string };
export const IngressPointConfiguration = S.Union(
  S.Struct({ SmtpPassword: SensitiveString }),
  S.Struct({ SecretArn: S.String }),
);
export interface UpdateIngressPointRequest {
  IngressPointId: string;
  IngressPointName?: string;
  StatusToUpdate?: IngressPointStatusToUpdate;
  RuleSetId?: string;
  TrafficPolicyId?: string;
  IngressPointConfiguration?: IngressPointConfiguration;
}
export const UpdateIngressPointRequest = S.suspend(() =>
  S.Struct({
    IngressPointId: S.String,
    IngressPointName: S.optional(S.String),
    StatusToUpdate: S.optional(IngressPointStatusToUpdate),
    RuleSetId: S.optional(S.String),
    TrafficPolicyId: S.optional(S.String),
    IngressPointConfiguration: S.optional(IngressPointConfiguration),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateIngressPointRequest",
}) as any as S.Schema<UpdateIngressPointRequest>;
export interface UpdateIngressPointResponse {}
export const UpdateIngressPointResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateIngressPointResponse",
}) as any as S.Schema<UpdateIngressPointResponse>;
export interface DeleteIngressPointRequest {
  IngressPointId: string;
}
export const DeleteIngressPointRequest = S.suspend(() =>
  S.Struct({ IngressPointId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteIngressPointRequest",
}) as any as S.Schema<DeleteIngressPointRequest>;
export interface DeleteIngressPointResponse {}
export const DeleteIngressPointResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteIngressPointResponse",
}) as any as S.Schema<DeleteIngressPointResponse>;
export interface ListIngressPointsRequest {
  PageSize?: number;
  NextToken?: string;
}
export const ListIngressPointsRequest = S.suspend(() =>
  S.Struct({
    PageSize: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListIngressPointsRequest",
}) as any as S.Schema<ListIngressPointsRequest>;
export interface GetRelayRequest {
  RelayId: string;
}
export const GetRelayRequest = S.suspend(() =>
  S.Struct({ RelayId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetRelayRequest",
}) as any as S.Schema<GetRelayRequest>;
export interface NoAuthentication {}
export const NoAuthentication = S.suspend(() => S.Struct({})).annotations({
  identifier: "NoAuthentication",
}) as any as S.Schema<NoAuthentication>;
export type RelayAuthentication =
  | { SecretArn: string }
  | { NoAuthentication: NoAuthentication };
export const RelayAuthentication = S.Union(
  S.Struct({ SecretArn: S.String }),
  S.Struct({ NoAuthentication: NoAuthentication }),
);
export interface UpdateRelayRequest {
  RelayId: string;
  RelayName?: string;
  ServerName?: string;
  ServerPort?: number;
  Authentication?: RelayAuthentication;
}
export const UpdateRelayRequest = S.suspend(() =>
  S.Struct({
    RelayId: S.String,
    RelayName: S.optional(S.String),
    ServerName: S.optional(S.String),
    ServerPort: S.optional(S.Number),
    Authentication: S.optional(RelayAuthentication),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateRelayRequest",
}) as any as S.Schema<UpdateRelayRequest>;
export interface UpdateRelayResponse {}
export const UpdateRelayResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateRelayResponse",
}) as any as S.Schema<UpdateRelayResponse>;
export interface DeleteRelayRequest {
  RelayId: string;
}
export const DeleteRelayRequest = S.suspend(() =>
  S.Struct({ RelayId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteRelayRequest",
}) as any as S.Schema<DeleteRelayRequest>;
export interface DeleteRelayResponse {}
export const DeleteRelayResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteRelayResponse",
}) as any as S.Schema<DeleteRelayResponse>;
export interface ListRelaysRequest {
  PageSize?: number;
  NextToken?: string;
}
export const ListRelaysRequest = S.suspend(() =>
  S.Struct({
    PageSize: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRelaysRequest",
}) as any as S.Schema<ListRelaysRequest>;
export interface GetRuleSetRequest {
  RuleSetId: string;
}
export const GetRuleSetRequest = S.suspend(() =>
  S.Struct({ RuleSetId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetRuleSetRequest",
}) as any as S.Schema<GetRuleSetRequest>;
export type RuleBooleanEmailAttribute =
  | "READ_RECEIPT_REQUESTED"
  | "TLS"
  | "TLS_WRAPPED";
export const RuleBooleanEmailAttribute = S.Literal(
  "READ_RECEIPT_REQUESTED",
  "TLS",
  "TLS_WRAPPED",
);
export interface Analysis {
  Analyzer: string;
  ResultField: string;
}
export const Analysis = S.suspend(() =>
  S.Struct({ Analyzer: S.String, ResultField: S.String }),
).annotations({ identifier: "Analysis" }) as any as S.Schema<Analysis>;
export type RuleAddressListEmailAttribute =
  | "RECIPIENT"
  | "MAIL_FROM"
  | "SENDER"
  | "FROM"
  | "TO"
  | "CC";
export const RuleAddressListEmailAttribute = S.Literal(
  "RECIPIENT",
  "MAIL_FROM",
  "SENDER",
  "FROM",
  "TO",
  "CC",
);
export type RuleAddressListArnList = string[];
export const RuleAddressListArnList = S.Array(S.String);
export interface RuleIsInAddressList {
  Attribute: RuleAddressListEmailAttribute;
  AddressLists: string[];
}
export const RuleIsInAddressList = S.suspend(() =>
  S.Struct({
    Attribute: RuleAddressListEmailAttribute,
    AddressLists: RuleAddressListArnList,
  }),
).annotations({
  identifier: "RuleIsInAddressList",
}) as any as S.Schema<RuleIsInAddressList>;
export type RuleBooleanToEvaluate =
  | { Attribute: RuleBooleanEmailAttribute }
  | { Analysis: Analysis }
  | { IsInAddressList: RuleIsInAddressList };
export const RuleBooleanToEvaluate = S.Union(
  S.Struct({ Attribute: RuleBooleanEmailAttribute }),
  S.Struct({ Analysis: Analysis }),
  S.Struct({ IsInAddressList: RuleIsInAddressList }),
);
export type RuleBooleanOperator = "IS_TRUE" | "IS_FALSE";
export const RuleBooleanOperator = S.Literal("IS_TRUE", "IS_FALSE");
export interface RuleBooleanExpression {
  Evaluate: RuleBooleanToEvaluate;
  Operator: RuleBooleanOperator;
}
export const RuleBooleanExpression = S.suspend(() =>
  S.Struct({ Evaluate: RuleBooleanToEvaluate, Operator: RuleBooleanOperator }),
).annotations({
  identifier: "RuleBooleanExpression",
}) as any as S.Schema<RuleBooleanExpression>;
export type RuleStringEmailAttribute =
  | "MAIL_FROM"
  | "HELO"
  | "RECIPIENT"
  | "SENDER"
  | "FROM"
  | "SUBJECT"
  | "TO"
  | "CC";
export const RuleStringEmailAttribute = S.Literal(
  "MAIL_FROM",
  "HELO",
  "RECIPIENT",
  "SENDER",
  "FROM",
  "SUBJECT",
  "TO",
  "CC",
);
export type RuleStringToEvaluate =
  | { Attribute: RuleStringEmailAttribute }
  | { MimeHeaderAttribute: string }
  | { Analysis: Analysis };
export const RuleStringToEvaluate = S.Union(
  S.Struct({ Attribute: RuleStringEmailAttribute }),
  S.Struct({ MimeHeaderAttribute: S.String }),
  S.Struct({ Analysis: Analysis }),
);
export type RuleStringOperator =
  | "EQUALS"
  | "NOT_EQUALS"
  | "STARTS_WITH"
  | "ENDS_WITH"
  | "CONTAINS";
export const RuleStringOperator = S.Literal(
  "EQUALS",
  "NOT_EQUALS",
  "STARTS_WITH",
  "ENDS_WITH",
  "CONTAINS",
);
export type RuleStringList = string[];
export const RuleStringList = S.Array(S.String);
export interface RuleStringExpression {
  Evaluate: RuleStringToEvaluate;
  Operator: RuleStringOperator;
  Values: string[];
}
export const RuleStringExpression = S.suspend(() =>
  S.Struct({
    Evaluate: RuleStringToEvaluate,
    Operator: RuleStringOperator,
    Values: RuleStringList,
  }),
).annotations({
  identifier: "RuleStringExpression",
}) as any as S.Schema<RuleStringExpression>;
export type RuleNumberEmailAttribute = "MESSAGE_SIZE";
export const RuleNumberEmailAttribute = S.Literal("MESSAGE_SIZE");
export type RuleNumberToEvaluate = { Attribute: RuleNumberEmailAttribute };
export const RuleNumberToEvaluate = S.Union(
  S.Struct({ Attribute: RuleNumberEmailAttribute }),
);
export type RuleNumberOperator =
  | "EQUALS"
  | "NOT_EQUALS"
  | "LESS_THAN"
  | "GREATER_THAN"
  | "LESS_THAN_OR_EQUAL"
  | "GREATER_THAN_OR_EQUAL";
export const RuleNumberOperator = S.Literal(
  "EQUALS",
  "NOT_EQUALS",
  "LESS_THAN",
  "GREATER_THAN",
  "LESS_THAN_OR_EQUAL",
  "GREATER_THAN_OR_EQUAL",
);
export interface RuleNumberExpression {
  Evaluate: RuleNumberToEvaluate;
  Operator: RuleNumberOperator;
  Value: number;
}
export const RuleNumberExpression = S.suspend(() =>
  S.Struct({
    Evaluate: RuleNumberToEvaluate,
    Operator: RuleNumberOperator,
    Value: S.Number,
  }),
).annotations({
  identifier: "RuleNumberExpression",
}) as any as S.Schema<RuleNumberExpression>;
export type RuleIpEmailAttribute = "SOURCE_IP";
export const RuleIpEmailAttribute = S.Literal("SOURCE_IP");
export type RuleIpToEvaluate = { Attribute: RuleIpEmailAttribute };
export const RuleIpToEvaluate = S.Union(
  S.Struct({ Attribute: RuleIpEmailAttribute }),
);
export type RuleIpOperator = "CIDR_MATCHES" | "NOT_CIDR_MATCHES";
export const RuleIpOperator = S.Literal("CIDR_MATCHES", "NOT_CIDR_MATCHES");
export type RuleIpValueList = string[];
export const RuleIpValueList = S.Array(S.String);
export interface RuleIpExpression {
  Evaluate: RuleIpToEvaluate;
  Operator: RuleIpOperator;
  Values: string[];
}
export const RuleIpExpression = S.suspend(() =>
  S.Struct({
    Evaluate: RuleIpToEvaluate,
    Operator: RuleIpOperator,
    Values: RuleIpValueList,
  }),
).annotations({
  identifier: "RuleIpExpression",
}) as any as S.Schema<RuleIpExpression>;
export type RuleVerdictAttribute = "SPF" | "DKIM";
export const RuleVerdictAttribute = S.Literal("SPF", "DKIM");
export type RuleVerdictToEvaluate =
  | { Attribute: RuleVerdictAttribute }
  | { Analysis: Analysis };
export const RuleVerdictToEvaluate = S.Union(
  S.Struct({ Attribute: RuleVerdictAttribute }),
  S.Struct({ Analysis: Analysis }),
);
export type RuleVerdictOperator = "EQUALS" | "NOT_EQUALS";
export const RuleVerdictOperator = S.Literal("EQUALS", "NOT_EQUALS");
export type RuleVerdict = "PASS" | "FAIL" | "GRAY" | "PROCESSING_FAILED";
export const RuleVerdict = S.Literal(
  "PASS",
  "FAIL",
  "GRAY",
  "PROCESSING_FAILED",
);
export type RuleVerdictValueList = RuleVerdict[];
export const RuleVerdictValueList = S.Array(RuleVerdict);
export interface RuleVerdictExpression {
  Evaluate: RuleVerdictToEvaluate;
  Operator: RuleVerdictOperator;
  Values: RuleVerdict[];
}
export const RuleVerdictExpression = S.suspend(() =>
  S.Struct({
    Evaluate: RuleVerdictToEvaluate,
    Operator: RuleVerdictOperator,
    Values: RuleVerdictValueList,
  }),
).annotations({
  identifier: "RuleVerdictExpression",
}) as any as S.Schema<RuleVerdictExpression>;
export type RuleDmarcOperator = "EQUALS" | "NOT_EQUALS";
export const RuleDmarcOperator = S.Literal("EQUALS", "NOT_EQUALS");
export type RuleDmarcPolicy = "NONE" | "QUARANTINE" | "REJECT";
export const RuleDmarcPolicy = S.Literal("NONE", "QUARANTINE", "REJECT");
export type RuleDmarcValueList = RuleDmarcPolicy[];
export const RuleDmarcValueList = S.Array(RuleDmarcPolicy);
export interface RuleDmarcExpression {
  Operator: RuleDmarcOperator;
  Values: RuleDmarcPolicy[];
}
export const RuleDmarcExpression = S.suspend(() =>
  S.Struct({ Operator: RuleDmarcOperator, Values: RuleDmarcValueList }),
).annotations({
  identifier: "RuleDmarcExpression",
}) as any as S.Schema<RuleDmarcExpression>;
export type RuleCondition =
  | { BooleanExpression: RuleBooleanExpression }
  | { StringExpression: RuleStringExpression }
  | { NumberExpression: RuleNumberExpression }
  | { IpExpression: RuleIpExpression }
  | { VerdictExpression: RuleVerdictExpression }
  | { DmarcExpression: RuleDmarcExpression };
export const RuleCondition = S.Union(
  S.Struct({ BooleanExpression: RuleBooleanExpression }),
  S.Struct({ StringExpression: RuleStringExpression }),
  S.Struct({ NumberExpression: RuleNumberExpression }),
  S.Struct({ IpExpression: RuleIpExpression }),
  S.Struct({ VerdictExpression: RuleVerdictExpression }),
  S.Struct({ DmarcExpression: RuleDmarcExpression }),
);
export type RuleConditions = RuleCondition[];
export const RuleConditions = S.Array(RuleCondition);
export interface DropAction {}
export const DropAction = S.suspend(() => S.Struct({})).annotations({
  identifier: "DropAction",
}) as any as S.Schema<DropAction>;
export type ActionFailurePolicy = "CONTINUE" | "DROP";
export const ActionFailurePolicy = S.Literal("CONTINUE", "DROP");
export type MailFrom = "REPLACE" | "PRESERVE";
export const MailFrom = S.Literal("REPLACE", "PRESERVE");
export interface RelayAction {
  ActionFailurePolicy?: ActionFailurePolicy;
  Relay: string;
  MailFrom?: MailFrom;
}
export const RelayAction = S.suspend(() =>
  S.Struct({
    ActionFailurePolicy: S.optional(ActionFailurePolicy),
    Relay: S.String,
    MailFrom: S.optional(MailFrom),
  }),
).annotations({ identifier: "RelayAction" }) as any as S.Schema<RelayAction>;
export interface ArchiveAction {
  ActionFailurePolicy?: ActionFailurePolicy;
  TargetArchive: string;
}
export const ArchiveAction = S.suspend(() =>
  S.Struct({
    ActionFailurePolicy: S.optional(ActionFailurePolicy),
    TargetArchive: S.String,
  }),
).annotations({
  identifier: "ArchiveAction",
}) as any as S.Schema<ArchiveAction>;
export interface S3Action {
  ActionFailurePolicy?: ActionFailurePolicy;
  RoleArn: string;
  S3Bucket: string;
  S3Prefix?: string;
  S3SseKmsKeyId?: string;
}
export const S3Action = S.suspend(() =>
  S.Struct({
    ActionFailurePolicy: S.optional(ActionFailurePolicy),
    RoleArn: S.String,
    S3Bucket: S.String,
    S3Prefix: S.optional(S.String),
    S3SseKmsKeyId: S.optional(S.String),
  }),
).annotations({ identifier: "S3Action" }) as any as S.Schema<S3Action>;
export interface SendAction {
  ActionFailurePolicy?: ActionFailurePolicy;
  RoleArn: string;
}
export const SendAction = S.suspend(() =>
  S.Struct({
    ActionFailurePolicy: S.optional(ActionFailurePolicy),
    RoleArn: S.String,
  }),
).annotations({ identifier: "SendAction" }) as any as S.Schema<SendAction>;
export interface AddHeaderAction {
  HeaderName: string;
  HeaderValue: string;
}
export const AddHeaderAction = S.suspend(() =>
  S.Struct({ HeaderName: S.String, HeaderValue: S.String }),
).annotations({
  identifier: "AddHeaderAction",
}) as any as S.Schema<AddHeaderAction>;
export type Recipients = string | redacted.Redacted<string>[];
export const Recipients = S.Array(SensitiveString);
export interface ReplaceRecipientAction {
  ReplaceWith?: string | redacted.Redacted<string>[];
}
export const ReplaceRecipientAction = S.suspend(() =>
  S.Struct({ ReplaceWith: S.optional(Recipients) }),
).annotations({
  identifier: "ReplaceRecipientAction",
}) as any as S.Schema<ReplaceRecipientAction>;
export interface DeliverToMailboxAction {
  ActionFailurePolicy?: ActionFailurePolicy;
  MailboxArn: string;
  RoleArn: string;
}
export const DeliverToMailboxAction = S.suspend(() =>
  S.Struct({
    ActionFailurePolicy: S.optional(ActionFailurePolicy),
    MailboxArn: S.String,
    RoleArn: S.String,
  }),
).annotations({
  identifier: "DeliverToMailboxAction",
}) as any as S.Schema<DeliverToMailboxAction>;
export interface DeliverToQBusinessAction {
  ActionFailurePolicy?: ActionFailurePolicy;
  ApplicationId: string;
  IndexId: string;
  RoleArn: string;
}
export const DeliverToQBusinessAction = S.suspend(() =>
  S.Struct({
    ActionFailurePolicy: S.optional(ActionFailurePolicy),
    ApplicationId: S.String,
    IndexId: S.String,
    RoleArn: S.String,
  }),
).annotations({
  identifier: "DeliverToQBusinessAction",
}) as any as S.Schema<DeliverToQBusinessAction>;
export type SnsNotificationEncoding = "UTF-8" | "BASE64";
export const SnsNotificationEncoding = S.Literal("UTF-8", "BASE64");
export type SnsNotificationPayloadType = "HEADERS" | "CONTENT";
export const SnsNotificationPayloadType = S.Literal("HEADERS", "CONTENT");
export interface SnsAction {
  ActionFailurePolicy?: ActionFailurePolicy;
  TopicArn: string;
  RoleArn: string;
  Encoding?: SnsNotificationEncoding;
  PayloadType?: SnsNotificationPayloadType;
}
export const SnsAction = S.suspend(() =>
  S.Struct({
    ActionFailurePolicy: S.optional(ActionFailurePolicy),
    TopicArn: S.String,
    RoleArn: S.String,
    Encoding: S.optional(SnsNotificationEncoding),
    PayloadType: S.optional(SnsNotificationPayloadType),
  }),
).annotations({ identifier: "SnsAction" }) as any as S.Schema<SnsAction>;
export type RuleAction =
  | { Drop: DropAction }
  | { Relay: RelayAction }
  | { Archive: ArchiveAction }
  | { WriteToS3: S3Action }
  | { Send: SendAction }
  | { AddHeader: AddHeaderAction }
  | { ReplaceRecipient: ReplaceRecipientAction }
  | { DeliverToMailbox: DeliverToMailboxAction }
  | { DeliverToQBusiness: DeliverToQBusinessAction }
  | { PublishToSns: SnsAction };
export const RuleAction = S.Union(
  S.Struct({ Drop: DropAction }),
  S.Struct({ Relay: RelayAction }),
  S.Struct({ Archive: ArchiveAction }),
  S.Struct({ WriteToS3: S3Action }),
  S.Struct({ Send: SendAction }),
  S.Struct({ AddHeader: AddHeaderAction }),
  S.Struct({ ReplaceRecipient: ReplaceRecipientAction }),
  S.Struct({ DeliverToMailbox: DeliverToMailboxAction }),
  S.Struct({ DeliverToQBusiness: DeliverToQBusinessAction }),
  S.Struct({ PublishToSns: SnsAction }),
);
export type RuleActions = RuleAction[];
export const RuleActions = S.Array(RuleAction);
export interface Rule {
  Name?: string;
  Conditions?: RuleCondition[];
  Unless?: RuleCondition[];
  Actions: RuleAction[];
}
export const Rule = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Conditions: S.optional(RuleConditions),
    Unless: S.optional(RuleConditions),
    Actions: RuleActions,
  }),
).annotations({ identifier: "Rule" }) as any as S.Schema<Rule>;
export type Rules = Rule[];
export const Rules = S.Array(Rule);
export interface UpdateRuleSetRequest {
  RuleSetId: string;
  RuleSetName?: string;
  Rules?: Rule[];
}
export const UpdateRuleSetRequest = S.suspend(() =>
  S.Struct({
    RuleSetId: S.String,
    RuleSetName: S.optional(S.String),
    Rules: S.optional(Rules),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateRuleSetRequest",
}) as any as S.Schema<UpdateRuleSetRequest>;
export interface UpdateRuleSetResponse {}
export const UpdateRuleSetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateRuleSetResponse",
}) as any as S.Schema<UpdateRuleSetResponse>;
export interface DeleteRuleSetRequest {
  RuleSetId: string;
}
export const DeleteRuleSetRequest = S.suspend(() =>
  S.Struct({ RuleSetId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteRuleSetRequest",
}) as any as S.Schema<DeleteRuleSetRequest>;
export interface DeleteRuleSetResponse {}
export const DeleteRuleSetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteRuleSetResponse",
}) as any as S.Schema<DeleteRuleSetResponse>;
export interface ListRuleSetsRequest {
  NextToken?: string;
  PageSize?: number;
}
export const ListRuleSetsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRuleSetsRequest",
}) as any as S.Schema<ListRuleSetsRequest>;
export interface GetTrafficPolicyRequest {
  TrafficPolicyId: string;
}
export const GetTrafficPolicyRequest = S.suspend(() =>
  S.Struct({ TrafficPolicyId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetTrafficPolicyRequest",
}) as any as S.Schema<GetTrafficPolicyRequest>;
export type IngressStringEmailAttribute = "RECIPIENT";
export const IngressStringEmailAttribute = S.Literal("RECIPIENT");
export interface IngressAnalysis {
  Analyzer: string;
  ResultField: string;
}
export const IngressAnalysis = S.suspend(() =>
  S.Struct({ Analyzer: S.String, ResultField: S.String }),
).annotations({
  identifier: "IngressAnalysis",
}) as any as S.Schema<IngressAnalysis>;
export type IngressStringToEvaluate =
  | { Attribute: IngressStringEmailAttribute }
  | { Analysis: IngressAnalysis };
export const IngressStringToEvaluate = S.Union(
  S.Struct({ Attribute: IngressStringEmailAttribute }),
  S.Struct({ Analysis: IngressAnalysis }),
);
export type IngressStringOperator =
  | "EQUALS"
  | "NOT_EQUALS"
  | "STARTS_WITH"
  | "ENDS_WITH"
  | "CONTAINS";
export const IngressStringOperator = S.Literal(
  "EQUALS",
  "NOT_EQUALS",
  "STARTS_WITH",
  "ENDS_WITH",
  "CONTAINS",
);
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface IngressStringExpression {
  Evaluate: IngressStringToEvaluate;
  Operator: IngressStringOperator;
  Values: string[];
}
export const IngressStringExpression = S.suspend(() =>
  S.Struct({
    Evaluate: IngressStringToEvaluate,
    Operator: IngressStringOperator,
    Values: StringList,
  }),
).annotations({
  identifier: "IngressStringExpression",
}) as any as S.Schema<IngressStringExpression>;
export type IngressIpv4Attribute = "SENDER_IP";
export const IngressIpv4Attribute = S.Literal("SENDER_IP");
export type IngressIpToEvaluate = { Attribute: IngressIpv4Attribute };
export const IngressIpToEvaluate = S.Union(
  S.Struct({ Attribute: IngressIpv4Attribute }),
);
export type IngressIpOperator = "CIDR_MATCHES" | "NOT_CIDR_MATCHES";
export const IngressIpOperator = S.Literal("CIDR_MATCHES", "NOT_CIDR_MATCHES");
export type Ipv4Cidrs = string[];
export const Ipv4Cidrs = S.Array(S.String);
export interface IngressIpv4Expression {
  Evaluate: IngressIpToEvaluate;
  Operator: IngressIpOperator;
  Values: string[];
}
export const IngressIpv4Expression = S.suspend(() =>
  S.Struct({
    Evaluate: IngressIpToEvaluate,
    Operator: IngressIpOperator,
    Values: Ipv4Cidrs,
  }),
).annotations({
  identifier: "IngressIpv4Expression",
}) as any as S.Schema<IngressIpv4Expression>;
export type IngressIpv6Attribute = "SENDER_IPV6";
export const IngressIpv6Attribute = S.Literal("SENDER_IPV6");
export type IngressIpv6ToEvaluate = { Attribute: IngressIpv6Attribute };
export const IngressIpv6ToEvaluate = S.Union(
  S.Struct({ Attribute: IngressIpv6Attribute }),
);
export type Ipv6Cidrs = string[];
export const Ipv6Cidrs = S.Array(S.String);
export interface IngressIpv6Expression {
  Evaluate: IngressIpv6ToEvaluate;
  Operator: IngressIpOperator;
  Values: string[];
}
export const IngressIpv6Expression = S.suspend(() =>
  S.Struct({
    Evaluate: IngressIpv6ToEvaluate,
    Operator: IngressIpOperator,
    Values: Ipv6Cidrs,
  }),
).annotations({
  identifier: "IngressIpv6Expression",
}) as any as S.Schema<IngressIpv6Expression>;
export type IngressTlsAttribute = "TLS_PROTOCOL";
export const IngressTlsAttribute = S.Literal("TLS_PROTOCOL");
export type IngressTlsProtocolToEvaluate = { Attribute: IngressTlsAttribute };
export const IngressTlsProtocolToEvaluate = S.Union(
  S.Struct({ Attribute: IngressTlsAttribute }),
);
export type IngressTlsProtocolOperator = "MINIMUM_TLS_VERSION" | "IS";
export const IngressTlsProtocolOperator = S.Literal(
  "MINIMUM_TLS_VERSION",
  "IS",
);
export type IngressTlsProtocolAttribute = "TLS1_2" | "TLS1_3";
export const IngressTlsProtocolAttribute = S.Literal("TLS1_2", "TLS1_3");
export interface IngressTlsProtocolExpression {
  Evaluate: IngressTlsProtocolToEvaluate;
  Operator: IngressTlsProtocolOperator;
  Value: IngressTlsProtocolAttribute;
}
export const IngressTlsProtocolExpression = S.suspend(() =>
  S.Struct({
    Evaluate: IngressTlsProtocolToEvaluate,
    Operator: IngressTlsProtocolOperator,
    Value: IngressTlsProtocolAttribute,
  }),
).annotations({
  identifier: "IngressTlsProtocolExpression",
}) as any as S.Schema<IngressTlsProtocolExpression>;
export type IngressAddressListEmailAttribute = "RECIPIENT";
export const IngressAddressListEmailAttribute = S.Literal("RECIPIENT");
export type IngressAddressListArnList = string[];
export const IngressAddressListArnList = S.Array(S.String);
export interface IngressIsInAddressList {
  Attribute: IngressAddressListEmailAttribute;
  AddressLists: string[];
}
export const IngressIsInAddressList = S.suspend(() =>
  S.Struct({
    Attribute: IngressAddressListEmailAttribute,
    AddressLists: IngressAddressListArnList,
  }),
).annotations({
  identifier: "IngressIsInAddressList",
}) as any as S.Schema<IngressIsInAddressList>;
export type IngressBooleanToEvaluate =
  | { Analysis: IngressAnalysis }
  | { IsInAddressList: IngressIsInAddressList };
export const IngressBooleanToEvaluate = S.Union(
  S.Struct({ Analysis: IngressAnalysis }),
  S.Struct({ IsInAddressList: IngressIsInAddressList }),
);
export type IngressBooleanOperator = "IS_TRUE" | "IS_FALSE";
export const IngressBooleanOperator = S.Literal("IS_TRUE", "IS_FALSE");
export interface IngressBooleanExpression {
  Evaluate: IngressBooleanToEvaluate;
  Operator: IngressBooleanOperator;
}
export const IngressBooleanExpression = S.suspend(() =>
  S.Struct({
    Evaluate: IngressBooleanToEvaluate,
    Operator: IngressBooleanOperator,
  }),
).annotations({
  identifier: "IngressBooleanExpression",
}) as any as S.Schema<IngressBooleanExpression>;
export type PolicyCondition =
  | { StringExpression: IngressStringExpression }
  | { IpExpression: IngressIpv4Expression }
  | { Ipv6Expression: IngressIpv6Expression }
  | { TlsExpression: IngressTlsProtocolExpression }
  | { BooleanExpression: IngressBooleanExpression };
export const PolicyCondition = S.Union(
  S.Struct({ StringExpression: IngressStringExpression }),
  S.Struct({ IpExpression: IngressIpv4Expression }),
  S.Struct({ Ipv6Expression: IngressIpv6Expression }),
  S.Struct({ TlsExpression: IngressTlsProtocolExpression }),
  S.Struct({ BooleanExpression: IngressBooleanExpression }),
);
export type PolicyConditions = PolicyCondition[];
export const PolicyConditions = S.Array(PolicyCondition);
export interface PolicyStatement {
  Conditions: PolicyCondition[];
  Action: AcceptAction;
}
export const PolicyStatement = S.suspend(() =>
  S.Struct({ Conditions: PolicyConditions, Action: AcceptAction }),
).annotations({
  identifier: "PolicyStatement",
}) as any as S.Schema<PolicyStatement>;
export type PolicyStatementList = PolicyStatement[];
export const PolicyStatementList = S.Array(PolicyStatement);
export interface UpdateTrafficPolicyRequest {
  TrafficPolicyId: string;
  TrafficPolicyName?: string;
  PolicyStatements?: PolicyStatement[];
  DefaultAction?: AcceptAction;
  MaxMessageSizeBytes?: number;
}
export const UpdateTrafficPolicyRequest = S.suspend(() =>
  S.Struct({
    TrafficPolicyId: S.String,
    TrafficPolicyName: S.optional(S.String),
    PolicyStatements: S.optional(PolicyStatementList),
    DefaultAction: S.optional(AcceptAction),
    MaxMessageSizeBytes: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateTrafficPolicyRequest",
}) as any as S.Schema<UpdateTrafficPolicyRequest>;
export interface UpdateTrafficPolicyResponse {}
export const UpdateTrafficPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateTrafficPolicyResponse",
}) as any as S.Schema<UpdateTrafficPolicyResponse>;
export interface DeleteTrafficPolicyRequest {
  TrafficPolicyId: string;
}
export const DeleteTrafficPolicyRequest = S.suspend(() =>
  S.Struct({ TrafficPolicyId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteTrafficPolicyRequest",
}) as any as S.Schema<DeleteTrafficPolicyRequest>;
export interface DeleteTrafficPolicyResponse {}
export const DeleteTrafficPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTrafficPolicyResponse",
}) as any as S.Schema<DeleteTrafficPolicyResponse>;
export interface ListTrafficPoliciesRequest {
  PageSize?: number;
  NextToken?: string;
}
export const ListTrafficPoliciesRequest = S.suspend(() =>
  S.Struct({
    PageSize: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTrafficPoliciesRequest",
}) as any as S.Schema<ListTrafficPoliciesRequest>;
export type ImportDataType = "CSV" | "JSON";
export const ImportDataType = S.Literal("CSV", "JSON");
export interface ImportDataFormat {
  ImportDataType: ImportDataType;
}
export const ImportDataFormat = S.suspend(() =>
  S.Struct({ ImportDataType: ImportDataType }),
).annotations({
  identifier: "ImportDataFormat",
}) as any as S.Schema<ImportDataFormat>;
export type ImportJobStatus =
  | "CREATED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "STOPPED";
export const ImportJobStatus = S.Literal(
  "CREATED",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "STOPPED",
);
export interface AddressFilter {
  AddressPrefix?: string | redacted.Redacted<string>;
}
export const AddressFilter = S.suspend(() =>
  S.Struct({ AddressPrefix: S.optional(SensitiveString) }),
).annotations({
  identifier: "AddressFilter",
}) as any as S.Schema<AddressFilter>;
export type ArchiveState = "ACTIVE" | "PENDING_DELETION";
export const ArchiveState = S.Literal("ACTIVE", "PENDING_DELETION");
export type IngressPointStatus =
  | "PROVISIONING"
  | "DEPROVISIONING"
  | "UPDATING"
  | "ACTIVE"
  | "CLOSED"
  | "FAILED";
export const IngressPointStatus = S.Literal(
  "PROVISIONING",
  "DEPROVISIONING",
  "UPDATING",
  "ACTIVE",
  "CLOSED",
  "FAILED",
);
export type IpType = "IPV4" | "DUAL_STACK";
export const IpType = S.Literal("IPV4", "DUAL_STACK");
export interface CreateAddressListImportJobRequest {
  ClientToken?: string;
  AddressListId: string;
  Name: string;
  ImportDataFormat: ImportDataFormat;
}
export const CreateAddressListImportJobRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    AddressListId: S.String,
    Name: S.String,
    ImportDataFormat: ImportDataFormat,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAddressListImportJobRequest",
}) as any as S.Schema<CreateAddressListImportJobRequest>;
export interface GetAddressListImportJobResponse {
  JobId: string;
  Name: string;
  Status: ImportJobStatus;
  PreSignedUrl: string | redacted.Redacted<string>;
  ImportedItemsCount?: number;
  FailedItemsCount?: number;
  ImportDataFormat: ImportDataFormat;
  AddressListId: string;
  CreatedTimestamp: Date;
  StartTimestamp?: Date;
  CompletedTimestamp?: Date;
  Error?: string;
}
export const GetAddressListImportJobResponse = S.suspend(() =>
  S.Struct({
    JobId: S.String,
    Name: S.String,
    Status: ImportJobStatus,
    PreSignedUrl: SensitiveString,
    ImportedItemsCount: S.optional(S.Number),
    FailedItemsCount: S.optional(S.Number),
    ImportDataFormat: ImportDataFormat,
    AddressListId: S.String,
    CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    StartTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CompletedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Error: S.optional(S.String),
  }),
).annotations({
  identifier: "GetAddressListImportJobResponse",
}) as any as S.Schema<GetAddressListImportJobResponse>;
export interface GetMemberOfAddressListResponse {
  Address: string | redacted.Redacted<string>;
  CreatedTimestamp: Date;
}
export const GetMemberOfAddressListResponse = S.suspend(() =>
  S.Struct({
    Address: SensitiveString,
    CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "GetMemberOfAddressListResponse",
}) as any as S.Schema<GetMemberOfAddressListResponse>;
export interface ListMembersOfAddressListRequest {
  AddressListId: string;
  Filter?: AddressFilter;
  NextToken?: string;
  PageSize?: number;
}
export const ListMembersOfAddressListRequest = S.suspend(() =>
  S.Struct({
    AddressListId: S.String,
    Filter: S.optional(AddressFilter),
    NextToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListMembersOfAddressListRequest",
}) as any as S.Schema<ListMembersOfAddressListRequest>;
export interface ListTagsForResourceResponse {
  Tags: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: TagList }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface StartArchiveSearchResponse {
  SearchId?: string;
}
export const StartArchiveSearchResponse = S.suspend(() =>
  S.Struct({ SearchId: S.optional(S.String) }),
).annotations({
  identifier: "StartArchiveSearchResponse",
}) as any as S.Schema<StartArchiveSearchResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: TagList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface CreateAddonInstanceResponse {
  AddonInstanceId: string;
}
export const CreateAddonInstanceResponse = S.suspend(() =>
  S.Struct({ AddonInstanceId: S.String }),
).annotations({
  identifier: "CreateAddonInstanceResponse",
}) as any as S.Schema<CreateAddonInstanceResponse>;
export interface GetAddonInstanceResponse {
  AddonSubscriptionId?: string;
  AddonName?: string;
  AddonInstanceArn?: string;
  CreatedTimestamp?: Date;
}
export const GetAddonInstanceResponse = S.suspend(() =>
  S.Struct({
    AddonSubscriptionId: S.optional(S.String),
    AddonName: S.optional(S.String),
    AddonInstanceArn: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "GetAddonInstanceResponse",
}) as any as S.Schema<GetAddonInstanceResponse>;
export interface CreateAddonSubscriptionResponse {
  AddonSubscriptionId: string;
}
export const CreateAddonSubscriptionResponse = S.suspend(() =>
  S.Struct({ AddonSubscriptionId: S.String }),
).annotations({
  identifier: "CreateAddonSubscriptionResponse",
}) as any as S.Schema<CreateAddonSubscriptionResponse>;
export interface GetAddonSubscriptionResponse {
  AddonName?: string;
  AddonSubscriptionArn?: string;
  CreatedTimestamp?: Date;
}
export const GetAddonSubscriptionResponse = S.suspend(() =>
  S.Struct({
    AddonName: S.optional(S.String),
    AddonSubscriptionArn: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "GetAddonSubscriptionResponse",
}) as any as S.Schema<GetAddonSubscriptionResponse>;
export interface CreateAddressListResponse {
  AddressListId: string;
}
export const CreateAddressListResponse = S.suspend(() =>
  S.Struct({ AddressListId: S.String }),
).annotations({
  identifier: "CreateAddressListResponse",
}) as any as S.Schema<CreateAddressListResponse>;
export interface GetAddressListResponse {
  AddressListId: string;
  AddressListArn: string;
  AddressListName: string;
  CreatedTimestamp: Date;
  LastUpdatedTimestamp: Date;
}
export const GetAddressListResponse = S.suspend(() =>
  S.Struct({
    AddressListId: S.String,
    AddressListArn: S.String,
    AddressListName: S.String,
    CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "GetAddressListResponse",
}) as any as S.Schema<GetAddressListResponse>;
export interface CreateArchiveRequest {
  ClientToken?: string;
  ArchiveName: string;
  Retention?: ArchiveRetention;
  KmsKeyArn?: string;
  Tags?: Tag[];
}
export const CreateArchiveRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    ArchiveName: S.String,
    Retention: S.optional(ArchiveRetention),
    KmsKeyArn: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateArchiveRequest",
}) as any as S.Schema<CreateArchiveRequest>;
export interface GetArchiveResponse {
  ArchiveId: string;
  ArchiveName: string;
  ArchiveArn: string;
  ArchiveState: ArchiveState;
  Retention: ArchiveRetention;
  CreatedTimestamp?: Date;
  LastUpdatedTimestamp?: Date;
  KmsKeyArn?: string;
}
export const GetArchiveResponse = S.suspend(() =>
  S.Struct({
    ArchiveId: S.String,
    ArchiveName: S.String,
    ArchiveArn: S.String,
    ArchiveState: ArchiveState,
    Retention: ArchiveRetention,
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    KmsKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "GetArchiveResponse",
}) as any as S.Schema<GetArchiveResponse>;
export interface CreateRelayRequest {
  ClientToken?: string;
  RelayName: string;
  ServerName: string;
  ServerPort: number;
  Authentication: RelayAuthentication;
  Tags?: Tag[];
}
export const CreateRelayRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    RelayName: S.String,
    ServerName: S.String,
    ServerPort: S.Number,
    Authentication: RelayAuthentication,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateRelayRequest",
}) as any as S.Schema<CreateRelayRequest>;
export interface GetRelayResponse {
  RelayId: string;
  RelayArn?: string;
  RelayName?: string;
  ServerName?: string;
  ServerPort?: number;
  Authentication?: RelayAuthentication;
  CreatedTimestamp?: Date;
  LastModifiedTimestamp?: Date;
}
export const GetRelayResponse = S.suspend(() =>
  S.Struct({
    RelayId: S.String,
    RelayArn: S.optional(S.String),
    RelayName: S.optional(S.String),
    ServerName: S.optional(S.String),
    ServerPort: S.optional(S.Number),
    Authentication: S.optional(RelayAuthentication),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "GetRelayResponse",
}) as any as S.Schema<GetRelayResponse>;
export interface GetRuleSetResponse {
  RuleSetId: string;
  RuleSetArn: string;
  RuleSetName: string;
  CreatedDate: Date;
  LastModificationDate: Date;
  Rules: Rule[];
}
export const GetRuleSetResponse = S.suspend(() =>
  S.Struct({
    RuleSetId: S.String,
    RuleSetArn: S.String,
    RuleSetName: S.String,
    CreatedDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastModificationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Rules: Rules,
  }),
).annotations({
  identifier: "GetRuleSetResponse",
}) as any as S.Schema<GetRuleSetResponse>;
export interface GetTrafficPolicyResponse {
  TrafficPolicyName: string;
  TrafficPolicyId: string;
  TrafficPolicyArn?: string;
  PolicyStatements?: PolicyStatement[];
  MaxMessageSizeBytes?: number;
  DefaultAction?: AcceptAction;
  CreatedTimestamp?: Date;
  LastUpdatedTimestamp?: Date;
}
export const GetTrafficPolicyResponse = S.suspend(() =>
  S.Struct({
    TrafficPolicyName: S.String,
    TrafficPolicyId: S.String,
    TrafficPolicyArn: S.optional(S.String),
    PolicyStatements: S.optional(PolicyStatementList),
    MaxMessageSizeBytes: S.optional(S.Number),
    DefaultAction: S.optional(AcceptAction),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "GetTrafficPolicyResponse",
}) as any as S.Schema<GetTrafficPolicyResponse>;
export type ExportState =
  | "QUEUED"
  | "PREPROCESSING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";
export const ExportState = S.Literal(
  "QUEUED",
  "PREPROCESSING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
);
export type SearchState =
  | "QUEUED"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";
export const SearchState = S.Literal(
  "QUEUED",
  "RUNNING",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
);
export type EmailReceivedHeadersList = string[];
export const EmailReceivedHeadersList = S.Array(S.String);
export interface S3ExportDestinationConfiguration {
  S3Location?: string;
}
export const S3ExportDestinationConfiguration = S.suspend(() =>
  S.Struct({ S3Location: S.optional(S.String) }),
).annotations({
  identifier: "S3ExportDestinationConfiguration",
}) as any as S.Schema<S3ExportDestinationConfiguration>;
export interface PublicNetworkConfiguration {
  IpType: IpType;
}
export const PublicNetworkConfiguration = S.suspend(() =>
  S.Struct({ IpType: IpType }),
).annotations({
  identifier: "PublicNetworkConfiguration",
}) as any as S.Schema<PublicNetworkConfiguration>;
export interface PrivateNetworkConfiguration {
  VpcEndpointId: string;
}
export const PrivateNetworkConfiguration = S.suspend(() =>
  S.Struct({ VpcEndpointId: S.String }),
).annotations({
  identifier: "PrivateNetworkConfiguration",
}) as any as S.Schema<PrivateNetworkConfiguration>;
export interface ExportStatus {
  SubmissionTimestamp?: Date;
  CompletionTimestamp?: Date;
  State?: ExportState;
  ErrorMessage?: string;
}
export const ExportStatus = S.suspend(() =>
  S.Struct({
    SubmissionTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CompletionTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    State: S.optional(ExportState),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "ExportStatus" }) as any as S.Schema<ExportStatus>;
export interface Metadata {
  Timestamp?: Date;
  IngressPointId?: string;
  TrafficPolicyId?: string;
  RuleSetId?: string;
  SenderHostname?: string;
  SenderIpAddress?: string | redacted.Redacted<string>;
  TlsCipherSuite?: string;
  TlsProtocol?: string;
  SendingMethod?: string;
  SourceIdentity?: string;
  SendingPool?: string;
  ConfigurationSet?: string;
  SourceArn?: string;
}
export const Metadata = S.suspend(() =>
  S.Struct({
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    IngressPointId: S.optional(S.String),
    TrafficPolicyId: S.optional(S.String),
    RuleSetId: S.optional(S.String),
    SenderHostname: S.optional(S.String),
    SenderIpAddress: S.optional(SensitiveString),
    TlsCipherSuite: S.optional(S.String),
    TlsProtocol: S.optional(S.String),
    SendingMethod: S.optional(S.String),
    SourceIdentity: S.optional(S.String),
    SendingPool: S.optional(S.String),
    ConfigurationSet: S.optional(S.String),
    SourceArn: S.optional(S.String),
  }),
).annotations({ identifier: "Metadata" }) as any as S.Schema<Metadata>;
export interface Envelope {
  Helo?: string;
  From?: string;
  To?: string[];
}
export const Envelope = S.suspend(() =>
  S.Struct({
    Helo: S.optional(S.String),
    From: S.optional(S.String),
    To: S.optional(StringList),
  }),
).annotations({ identifier: "Envelope" }) as any as S.Schema<Envelope>;
export interface MessageBody {
  Text?: string;
  Html?: string;
  MessageMalformed?: boolean;
}
export const MessageBody = S.suspend(() =>
  S.Struct({
    Text: S.optional(S.String),
    Html: S.optional(S.String),
    MessageMalformed: S.optional(S.Boolean),
  }),
).annotations({ identifier: "MessageBody" }) as any as S.Schema<MessageBody>;
export interface SearchStatus {
  SubmissionTimestamp?: Date;
  CompletionTimestamp?: Date;
  State?: SearchState;
  ErrorMessage?: string;
}
export const SearchStatus = S.suspend(() =>
  S.Struct({
    SubmissionTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CompletionTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    State: S.optional(SearchState),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "SearchStatus" }) as any as S.Schema<SearchStatus>;
export interface Row {
  ArchivedMessageId?: string;
  ReceivedTimestamp?: Date;
  Date?: string;
  To?: string;
  From?: string;
  Cc?: string;
  Subject?: string;
  MessageId?: string;
  HasAttachments?: boolean;
  ReceivedHeaders?: string[];
  InReplyTo?: string;
  XMailer?: string;
  XOriginalMailer?: string;
  XPriority?: string;
  IngressPointId?: string;
  SenderHostname?: string;
  SenderIpAddress?: string | redacted.Redacted<string>;
  Envelope?: Envelope;
  SourceArn?: string;
}
export const Row = S.suspend(() =>
  S.Struct({
    ArchivedMessageId: S.optional(S.String),
    ReceivedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Date: S.optional(S.String),
    To: S.optional(S.String),
    From: S.optional(S.String),
    Cc: S.optional(S.String),
    Subject: S.optional(S.String),
    MessageId: S.optional(S.String),
    HasAttachments: S.optional(S.Boolean),
    ReceivedHeaders: S.optional(EmailReceivedHeadersList),
    InReplyTo: S.optional(S.String),
    XMailer: S.optional(S.String),
    XOriginalMailer: S.optional(S.String),
    XPriority: S.optional(S.String),
    IngressPointId: S.optional(S.String),
    SenderHostname: S.optional(S.String),
    SenderIpAddress: S.optional(SensitiveString),
    Envelope: S.optional(Envelope),
    SourceArn: S.optional(S.String),
  }),
).annotations({ identifier: "Row" }) as any as S.Schema<Row>;
export type RowsList = Row[];
export const RowsList = S.Array(Row);
export interface ImportJob {
  JobId: string;
  Name: string;
  Status: ImportJobStatus;
  PreSignedUrl: string | redacted.Redacted<string>;
  ImportedItemsCount?: number;
  FailedItemsCount?: number;
  ImportDataFormat: ImportDataFormat;
  AddressListId: string;
  CreatedTimestamp: Date;
  StartTimestamp?: Date;
  CompletedTimestamp?: Date;
  Error?: string;
}
export const ImportJob = S.suspend(() =>
  S.Struct({
    JobId: S.String,
    Name: S.String,
    Status: ImportJobStatus,
    PreSignedUrl: SensitiveString,
    ImportedItemsCount: S.optional(S.Number),
    FailedItemsCount: S.optional(S.Number),
    ImportDataFormat: ImportDataFormat,
    AddressListId: S.String,
    CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    StartTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CompletedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Error: S.optional(S.String),
  }),
).annotations({ identifier: "ImportJob" }) as any as S.Schema<ImportJob>;
export type ImportJobs = ImportJob[];
export const ImportJobs = S.Array(ImportJob);
export interface ExportSummary {
  ExportId?: string;
  Status?: ExportStatus;
}
export const ExportSummary = S.suspend(() =>
  S.Struct({
    ExportId: S.optional(S.String),
    Status: S.optional(ExportStatus),
  }),
).annotations({
  identifier: "ExportSummary",
}) as any as S.Schema<ExportSummary>;
export type ExportSummaryList = ExportSummary[];
export const ExportSummaryList = S.Array(ExportSummary);
export interface SearchSummary {
  SearchId?: string;
  Status?: SearchStatus;
}
export const SearchSummary = S.suspend(() =>
  S.Struct({
    SearchId: S.optional(S.String),
    Status: S.optional(SearchStatus),
  }),
).annotations({
  identifier: "SearchSummary",
}) as any as S.Schema<SearchSummary>;
export type SearchSummaryList = SearchSummary[];
export const SearchSummaryList = S.Array(SearchSummary);
export type ExportDestinationConfiguration = {
  S3: S3ExportDestinationConfiguration;
};
export const ExportDestinationConfiguration = S.Union(
  S.Struct({ S3: S3ExportDestinationConfiguration }),
);
export interface AddonInstance {
  AddonInstanceId?: string;
  AddonSubscriptionId?: string;
  AddonName?: string;
  AddonInstanceArn?: string;
  CreatedTimestamp?: Date;
}
export const AddonInstance = S.suspend(() =>
  S.Struct({
    AddonInstanceId: S.optional(S.String),
    AddonSubscriptionId: S.optional(S.String),
    AddonName: S.optional(S.String),
    AddonInstanceArn: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "AddonInstance",
}) as any as S.Schema<AddonInstance>;
export type AddonInstances = AddonInstance[];
export const AddonInstances = S.Array(AddonInstance);
export interface AddonSubscription {
  AddonSubscriptionId?: string;
  AddonName?: string;
  AddonSubscriptionArn?: string;
  CreatedTimestamp?: Date;
}
export const AddonSubscription = S.suspend(() =>
  S.Struct({
    AddonSubscriptionId: S.optional(S.String),
    AddonName: S.optional(S.String),
    AddonSubscriptionArn: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "AddonSubscription",
}) as any as S.Schema<AddonSubscription>;
export type AddonSubscriptions = AddonSubscription[];
export const AddonSubscriptions = S.Array(AddonSubscription);
export interface AddressList {
  AddressListId: string;
  AddressListArn: string;
  AddressListName: string;
  CreatedTimestamp: Date;
  LastUpdatedTimestamp: Date;
}
export const AddressList = S.suspend(() =>
  S.Struct({
    AddressListId: S.String,
    AddressListArn: S.String,
    AddressListName: S.String,
    CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({ identifier: "AddressList" }) as any as S.Schema<AddressList>;
export type AddressLists = AddressList[];
export const AddressLists = S.Array(AddressList);
export interface Archive {
  ArchiveId: string;
  ArchiveName?: string;
  ArchiveState?: ArchiveState;
  LastUpdatedTimestamp?: Date;
}
export const Archive = S.suspend(() =>
  S.Struct({
    ArchiveId: S.String,
    ArchiveName: S.optional(S.String),
    ArchiveState: S.optional(ArchiveState),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "Archive" }) as any as S.Schema<Archive>;
export type ArchivesList = Archive[];
export const ArchivesList = S.Array(Archive);
export type NetworkConfiguration =
  | { PublicNetworkConfiguration: PublicNetworkConfiguration }
  | { PrivateNetworkConfiguration: PrivateNetworkConfiguration };
export const NetworkConfiguration = S.Union(
  S.Struct({ PublicNetworkConfiguration: PublicNetworkConfiguration }),
  S.Struct({ PrivateNetworkConfiguration: PrivateNetworkConfiguration }),
);
export interface IngressPoint {
  IngressPointName: string;
  IngressPointId: string;
  Status: IngressPointStatus;
  Type: IngressPointType;
  ARecord?: string;
}
export const IngressPoint = S.suspend(() =>
  S.Struct({
    IngressPointName: S.String,
    IngressPointId: S.String,
    Status: IngressPointStatus,
    Type: IngressPointType,
    ARecord: S.optional(S.String),
  }),
).annotations({ identifier: "IngressPoint" }) as any as S.Schema<IngressPoint>;
export type IngressPointsList = IngressPoint[];
export const IngressPointsList = S.Array(IngressPoint);
export interface Relay {
  RelayId?: string;
  RelayName?: string;
  LastModifiedTimestamp?: Date;
}
export const Relay = S.suspend(() =>
  S.Struct({
    RelayId: S.optional(S.String),
    RelayName: S.optional(S.String),
    LastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "Relay" }) as any as S.Schema<Relay>;
export type Relays = Relay[];
export const Relays = S.Array(Relay);
export interface RuleSet {
  RuleSetId?: string;
  RuleSetName?: string;
  LastModificationDate?: Date;
}
export const RuleSet = S.suspend(() =>
  S.Struct({
    RuleSetId: S.optional(S.String),
    RuleSetName: S.optional(S.String),
    LastModificationDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "RuleSet" }) as any as S.Schema<RuleSet>;
export type RuleSets = RuleSet[];
export const RuleSets = S.Array(RuleSet);
export interface TrafficPolicy {
  TrafficPolicyName: string;
  TrafficPolicyId: string;
  DefaultAction: AcceptAction;
}
export const TrafficPolicy = S.suspend(() =>
  S.Struct({
    TrafficPolicyName: S.String,
    TrafficPolicyId: S.String,
    DefaultAction: AcceptAction,
  }),
).annotations({
  identifier: "TrafficPolicy",
}) as any as S.Schema<TrafficPolicy>;
export type TrafficPolicyList = TrafficPolicy[];
export const TrafficPolicyList = S.Array(TrafficPolicy);
export interface CreateAddressListImportJobResponse {
  JobId: string;
  PreSignedUrl: string | redacted.Redacted<string>;
}
export const CreateAddressListImportJobResponse = S.suspend(() =>
  S.Struct({ JobId: S.String, PreSignedUrl: SensitiveString }),
).annotations({
  identifier: "CreateAddressListImportJobResponse",
}) as any as S.Schema<CreateAddressListImportJobResponse>;
export interface GetArchiveExportResponse {
  ArchiveId?: string;
  Filters?: ArchiveFilters;
  FromTimestamp?: Date;
  ToTimestamp?: Date;
  MaxResults?: number;
  ExportDestinationConfiguration?: ExportDestinationConfiguration;
  Status?: ExportStatus;
}
export const GetArchiveExportResponse = S.suspend(() =>
  S.Struct({
    ArchiveId: S.optional(S.String),
    Filters: S.optional(ArchiveFilters),
    FromTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ToTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    MaxResults: S.optional(S.Number),
    ExportDestinationConfiguration: S.optional(ExportDestinationConfiguration),
    Status: S.optional(ExportStatus),
  }),
).annotations({
  identifier: "GetArchiveExportResponse",
}) as any as S.Schema<GetArchiveExportResponse>;
export interface GetArchiveMessageResponse {
  MessageDownloadLink?: string;
  Metadata?: Metadata;
  Envelope?: Envelope;
}
export const GetArchiveMessageResponse = S.suspend(() =>
  S.Struct({
    MessageDownloadLink: S.optional(S.String),
    Metadata: S.optional(Metadata),
    Envelope: S.optional(Envelope),
  }),
).annotations({
  identifier: "GetArchiveMessageResponse",
}) as any as S.Schema<GetArchiveMessageResponse>;
export interface GetArchiveMessageContentResponse {
  Body?: MessageBody;
}
export const GetArchiveMessageContentResponse = S.suspend(() =>
  S.Struct({ Body: S.optional(MessageBody) }),
).annotations({
  identifier: "GetArchiveMessageContentResponse",
}) as any as S.Schema<GetArchiveMessageContentResponse>;
export interface GetArchiveSearchResponse {
  ArchiveId?: string;
  Filters?: ArchiveFilters;
  FromTimestamp?: Date;
  ToTimestamp?: Date;
  MaxResults?: number;
  Status?: SearchStatus;
}
export const GetArchiveSearchResponse = S.suspend(() =>
  S.Struct({
    ArchiveId: S.optional(S.String),
    Filters: S.optional(ArchiveFilters),
    FromTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ToTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    MaxResults: S.optional(S.Number),
    Status: S.optional(SearchStatus),
  }),
).annotations({
  identifier: "GetArchiveSearchResponse",
}) as any as S.Schema<GetArchiveSearchResponse>;
export interface GetArchiveSearchResultsResponse {
  Rows?: Row[];
}
export const GetArchiveSearchResultsResponse = S.suspend(() =>
  S.Struct({ Rows: S.optional(RowsList) }),
).annotations({
  identifier: "GetArchiveSearchResultsResponse",
}) as any as S.Schema<GetArchiveSearchResultsResponse>;
export interface ListAddressListImportJobsResponse {
  ImportJobs: ImportJob[];
  NextToken?: string;
}
export const ListAddressListImportJobsResponse = S.suspend(() =>
  S.Struct({ ImportJobs: ImportJobs, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListAddressListImportJobsResponse",
}) as any as S.Schema<ListAddressListImportJobsResponse>;
export interface ListArchiveExportsResponse {
  Exports?: ExportSummary[];
  NextToken?: string;
}
export const ListArchiveExportsResponse = S.suspend(() =>
  S.Struct({
    Exports: S.optional(ExportSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListArchiveExportsResponse",
}) as any as S.Schema<ListArchiveExportsResponse>;
export interface ListArchiveSearchesResponse {
  Searches?: SearchSummary[];
  NextToken?: string;
}
export const ListArchiveSearchesResponse = S.suspend(() =>
  S.Struct({
    Searches: S.optional(SearchSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListArchiveSearchesResponse",
}) as any as S.Schema<ListArchiveSearchesResponse>;
export interface ListAddonInstancesResponse {
  AddonInstances?: AddonInstance[];
  NextToken?: string;
}
export const ListAddonInstancesResponse = S.suspend(() =>
  S.Struct({
    AddonInstances: S.optional(AddonInstances),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAddonInstancesResponse",
}) as any as S.Schema<ListAddonInstancesResponse>;
export interface ListAddonSubscriptionsResponse {
  AddonSubscriptions?: AddonSubscription[];
  NextToken?: string;
}
export const ListAddonSubscriptionsResponse = S.suspend(() =>
  S.Struct({
    AddonSubscriptions: S.optional(AddonSubscriptions),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAddonSubscriptionsResponse",
}) as any as S.Schema<ListAddonSubscriptionsResponse>;
export interface ListAddressListsResponse {
  AddressLists: AddressList[];
  NextToken?: string;
}
export const ListAddressListsResponse = S.suspend(() =>
  S.Struct({ AddressLists: AddressLists, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListAddressListsResponse",
}) as any as S.Schema<ListAddressListsResponse>;
export interface CreateArchiveResponse {
  ArchiveId: string;
}
export const CreateArchiveResponse = S.suspend(() =>
  S.Struct({ ArchiveId: S.String }),
).annotations({
  identifier: "CreateArchiveResponse",
}) as any as S.Schema<CreateArchiveResponse>;
export interface ListArchivesResponse {
  Archives: Archive[];
  NextToken?: string;
}
export const ListArchivesResponse = S.suspend(() =>
  S.Struct({ Archives: ArchivesList, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListArchivesResponse",
}) as any as S.Schema<ListArchivesResponse>;
export interface CreateIngressPointRequest {
  ClientToken?: string;
  IngressPointName: string;
  Type: IngressPointType;
  RuleSetId: string;
  TrafficPolicyId: string;
  IngressPointConfiguration?: IngressPointConfiguration;
  NetworkConfiguration?: NetworkConfiguration;
  Tags?: Tag[];
}
export const CreateIngressPointRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    IngressPointName: S.String,
    Type: IngressPointType,
    RuleSetId: S.String,
    TrafficPolicyId: S.String,
    IngressPointConfiguration: S.optional(IngressPointConfiguration),
    NetworkConfiguration: S.optional(NetworkConfiguration),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateIngressPointRequest",
}) as any as S.Schema<CreateIngressPointRequest>;
export interface ListIngressPointsResponse {
  IngressPoints?: IngressPoint[];
  NextToken?: string;
}
export const ListIngressPointsResponse = S.suspend(() =>
  S.Struct({
    IngressPoints: S.optional(IngressPointsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListIngressPointsResponse",
}) as any as S.Schema<ListIngressPointsResponse>;
export interface CreateRelayResponse {
  RelayId: string;
}
export const CreateRelayResponse = S.suspend(() =>
  S.Struct({ RelayId: S.String }),
).annotations({
  identifier: "CreateRelayResponse",
}) as any as S.Schema<CreateRelayResponse>;
export interface ListRelaysResponse {
  Relays: Relay[];
  NextToken?: string;
}
export const ListRelaysResponse = S.suspend(() =>
  S.Struct({ Relays: Relays, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListRelaysResponse",
}) as any as S.Schema<ListRelaysResponse>;
export interface ListRuleSetsResponse {
  RuleSets: RuleSet[];
  NextToken?: string;
}
export const ListRuleSetsResponse = S.suspend(() =>
  S.Struct({ RuleSets: RuleSets, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListRuleSetsResponse",
}) as any as S.Schema<ListRuleSetsResponse>;
export interface ListTrafficPoliciesResponse {
  TrafficPolicies?: TrafficPolicy[];
  NextToken?: string;
}
export const ListTrafficPoliciesResponse = S.suspend(() =>
  S.Struct({
    TrafficPolicies: S.optional(TrafficPolicyList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTrafficPoliciesResponse",
}) as any as S.Schema<ListTrafficPoliciesResponse>;
export interface IngressPointPasswordConfiguration {
  SmtpPasswordVersion?: string;
  PreviousSmtpPasswordVersion?: string;
  PreviousSmtpPasswordExpiryTimestamp?: Date;
}
export const IngressPointPasswordConfiguration = S.suspend(() =>
  S.Struct({
    SmtpPasswordVersion: S.optional(S.String),
    PreviousSmtpPasswordVersion: S.optional(S.String),
    PreviousSmtpPasswordExpiryTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "IngressPointPasswordConfiguration",
}) as any as S.Schema<IngressPointPasswordConfiguration>;
export interface SavedAddress {
  Address: string | redacted.Redacted<string>;
  CreatedTimestamp: Date;
}
export const SavedAddress = S.suspend(() =>
  S.Struct({
    Address: SensitiveString,
    CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({ identifier: "SavedAddress" }) as any as S.Schema<SavedAddress>;
export type SavedAddresses = SavedAddress[];
export const SavedAddresses = S.Array(SavedAddress);
export interface IngressPointAuthConfiguration {
  IngressPointPasswordConfiguration?: IngressPointPasswordConfiguration;
  SecretArn?: string;
}
export const IngressPointAuthConfiguration = S.suspend(() =>
  S.Struct({
    IngressPointPasswordConfiguration: S.optional(
      IngressPointPasswordConfiguration,
    ),
    SecretArn: S.optional(S.String),
  }),
).annotations({
  identifier: "IngressPointAuthConfiguration",
}) as any as S.Schema<IngressPointAuthConfiguration>;
export interface ListMembersOfAddressListResponse {
  Addresses: SavedAddress[];
  NextToken?: string;
}
export const ListMembersOfAddressListResponse = S.suspend(() =>
  S.Struct({ Addresses: SavedAddresses, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListMembersOfAddressListResponse",
}) as any as S.Schema<ListMembersOfAddressListResponse>;
export interface CreateIngressPointResponse {
  IngressPointId: string;
}
export const CreateIngressPointResponse = S.suspend(() =>
  S.Struct({ IngressPointId: S.String }),
).annotations({
  identifier: "CreateIngressPointResponse",
}) as any as S.Schema<CreateIngressPointResponse>;
export interface GetIngressPointResponse {
  IngressPointId: string;
  IngressPointName: string;
  IngressPointArn?: string;
  Status?: IngressPointStatus;
  Type?: IngressPointType;
  ARecord?: string;
  RuleSetId?: string;
  TrafficPolicyId?: string;
  IngressPointAuthConfiguration?: IngressPointAuthConfiguration;
  NetworkConfiguration?: NetworkConfiguration;
  CreatedTimestamp?: Date;
  LastUpdatedTimestamp?: Date;
}
export const GetIngressPointResponse = S.suspend(() =>
  S.Struct({
    IngressPointId: S.String,
    IngressPointName: S.String,
    IngressPointArn: S.optional(S.String),
    Status: S.optional(IngressPointStatus),
    Type: S.optional(IngressPointType),
    ARecord: S.optional(S.String),
    RuleSetId: S.optional(S.String),
    TrafficPolicyId: S.optional(S.String),
    IngressPointAuthConfiguration: S.optional(IngressPointAuthConfiguration),
    NetworkConfiguration: S.optional(NetworkConfiguration),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "GetIngressPointResponse",
}) as any as S.Schema<GetIngressPointResponse>;
export interface StartArchiveExportRequest {
  ArchiveId: string;
  Filters?: ArchiveFilters;
  FromTimestamp: Date;
  ToTimestamp: Date;
  MaxResults?: number;
  ExportDestinationConfiguration: ExportDestinationConfiguration;
  IncludeMetadata?: boolean;
}
export const StartArchiveExportRequest = S.suspend(() =>
  S.Struct({
    ArchiveId: S.String,
    Filters: S.optional(ArchiveFilters),
    FromTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ToTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    MaxResults: S.optional(S.Number),
    ExportDestinationConfiguration: ExportDestinationConfiguration,
    IncludeMetadata: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartArchiveExportRequest",
}) as any as S.Schema<StartArchiveExportRequest>;
export interface StartArchiveExportResponse {
  ExportId?: string;
}
export const StartArchiveExportResponse = S.suspend(() =>
  S.Struct({ ExportId: S.optional(S.String) }),
).annotations({
  identifier: "StartArchiveExportResponse",
}) as any as S.Schema<StartArchiveExportResponse>;
export interface CreateRuleSetRequest {
  ClientToken?: string;
  RuleSetName: string;
  Rules: Rule[];
  Tags?: Tag[];
}
export const CreateRuleSetRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    RuleSetName: S.String,
    Rules: Rules,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateRuleSetRequest",
}) as any as S.Schema<CreateRuleSetRequest>;
export interface CreateTrafficPolicyRequest {
  ClientToken?: string;
  TrafficPolicyName: string;
  PolicyStatements: PolicyStatement[];
  DefaultAction: AcceptAction;
  MaxMessageSizeBytes?: number;
  Tags?: Tag[];
}
export const CreateTrafficPolicyRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    TrafficPolicyName: S.String,
    PolicyStatements: PolicyStatementList,
    DefaultAction: AcceptAction,
    MaxMessageSizeBytes: S.optional(S.Number),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateTrafficPolicyRequest",
}) as any as S.Schema<CreateTrafficPolicyRequest>;
export interface CreateRuleSetResponse {
  RuleSetId: string;
}
export const CreateRuleSetResponse = S.suspend(() =>
  S.Struct({ RuleSetId: S.String }),
).annotations({
  identifier: "CreateRuleSetResponse",
}) as any as S.Schema<CreateRuleSetResponse>;
export interface CreateTrafficPolicyResponse {
  TrafficPolicyId: string;
}
export const CreateTrafficPolicyResponse = S.suspend(() =>
  S.Struct({ TrafficPolicyId: S.String }),
).annotations({
  identifier: "CreateTrafficPolicyResponse",
}) as any as S.Schema<CreateTrafficPolicyResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Deletes an Add On instance.
 */
export const deleteAddonInstance: (
  input: DeleteAddonInstanceRequest,
) => effect.Effect<
  DeleteAddonInstanceResponse,
  ConflictException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAddonInstanceRequest,
  output: DeleteAddonInstanceResponse,
  errors: [ConflictException, ValidationException],
}));
/**
 * Creates a new address list.
 */
export const createAddressList: (
  input: CreateAddressListRequest,
) => effect.Effect<
  CreateAddressListResponse,
  | AccessDeniedException
  | ConflictException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAddressListRequest,
  output: CreateAddressListResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stops an in-progress archive search job.
 */
export const stopArchiveSearch: (
  input: StopArchiveSearchRequest,
) => effect.Effect<
  StopArchiveSearchResponse,
  | AccessDeniedException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopArchiveSearchRequest,
  output: StopArchiveSearchResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
}));
/**
 * Deletes an address list.
 */
export const deleteAddressList: (
  input: DeleteAddressListRequest,
) => effect.Effect<
  DeleteAddressListResponse,
  | AccessDeniedException
  | ConflictException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAddressListRequest,
  output: DeleteAddressListResponse,
  errors: [AccessDeniedException, ConflictException, ThrottlingException],
}));
/**
 * Initiates deletion of an email archive. This changes the archive state to pending deletion. In this state, no new emails can be added, and existing archived emails become inaccessible (search, export, download). The archive and all of its contents will be permanently deleted 30 days after entering the pending deletion state, regardless of the configured retention period.
 */
export const deleteArchive: (
  input: DeleteArchiveRequest,
) => effect.Effect<
  DeleteArchiveResponse,
  | AccessDeniedException
  | ConflictException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteArchiveRequest,
  output: DeleteArchiveResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a member from an address list.
 */
export const deregisterMemberFromAddressList: (
  input: DeregisterMemberFromAddressListRequest,
) => effect.Effect<
  DeregisterMemberFromAddressListResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterMemberFromAddressListRequest,
  output: DeregisterMemberFromAddressListResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the details and current status of a specific email archive export job.
 */
export const getArchiveExport: (
  input: GetArchiveExportRequest,
) => effect.Effect<
  GetArchiveExportResponse,
  | AccessDeniedException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetArchiveExportRequest,
  output: GetArchiveExportResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
}));
/**
 * Returns a pre-signed URL that provides temporary download access to the specific email message stored in the archive.
 */
export const getArchiveMessage: (
  input: GetArchiveMessageRequest,
) => effect.Effect<
  GetArchiveMessageResponse,
  | AccessDeniedException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetArchiveMessageRequest,
  output: GetArchiveMessageResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
}));
/**
 * Returns the textual content of a specific email message stored in the archive. Attachments are not included.
 */
export const getArchiveMessageContent: (
  input: GetArchiveMessageContentRequest,
) => effect.Effect<
  GetArchiveMessageContentResponse,
  | AccessDeniedException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetArchiveMessageContentRequest,
  output: GetArchiveMessageContentResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
}));
/**
 * Retrieves the details and current status of a specific email archive search job.
 */
export const getArchiveSearch: (
  input: GetArchiveSearchRequest,
) => effect.Effect<
  GetArchiveSearchResponse,
  | AccessDeniedException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetArchiveSearchRequest,
  output: GetArchiveSearchResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
}));
/**
 * Returns the results of a completed email archive search job.
 */
export const getArchiveSearchResults: (
  input: GetArchiveSearchResultsRequest,
) => effect.Effect<
  GetArchiveSearchResultsResponse,
  | AccessDeniedException
  | ConflictException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetArchiveSearchResultsRequest,
  output: GetArchiveSearchResultsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists jobs for an address list.
 */
export const listAddressListImportJobs: {
  (
    input: ListAddressListImportJobsRequest,
  ): effect.Effect<
    ListAddressListImportJobsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAddressListImportJobsRequest,
  ) => stream.Stream<
    ListAddressListImportJobsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAddressListImportJobsRequest,
  ) => stream.Stream<
    ImportJob,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAddressListImportJobsRequest,
  output: ListAddressListImportJobsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ImportJobs",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Returns a list of email archive export jobs.
 */
export const listArchiveExports: {
  (
    input: ListArchiveExportsRequest,
  ): effect.Effect<
    ListArchiveExportsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListArchiveExportsRequest,
  ) => stream.Stream<
    ListArchiveExportsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListArchiveExportsRequest,
  ) => stream.Stream<
    ExportSummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListArchiveExportsRequest,
  output: ListArchiveExportsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Exports",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Returns a list of email archive search jobs.
 */
export const listArchiveSearches: {
  (
    input: ListArchiveSearchesRequest,
  ): effect.Effect<
    ListArchiveSearchesResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListArchiveSearchesRequest,
  ) => stream.Stream<
    ListArchiveSearchesResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListArchiveSearchesRequest,
  ) => stream.Stream<
    SearchSummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListArchiveSearchesRequest,
  output: ListArchiveSearchesResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Searches",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Lists address lists for this account.
 */
export const listAddressLists: {
  (
    input: ListAddressListsRequest,
  ): effect.Effect<
    ListAddressListsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAddressListsRequest,
  ) => stream.Stream<
    ListAddressListsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAddressListsRequest,
  ) => stream.Stream<
    AddressList,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAddressListsRequest,
  output: ListAddressListsResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AddressLists",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Creates a new email archive resource for storing and retaining emails.
 */
export const createArchive: (
  input: CreateArchiveRequest,
) => effect.Effect<
  CreateArchiveResponse,
  | AccessDeniedException
  | ConflictException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateArchiveRequest,
  output: CreateArchiveResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of all email archives in your account.
 */
export const listArchives: {
  (
    input: ListArchivesRequest,
  ): effect.Effect<
    ListArchivesResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListArchivesRequest,
  ) => stream.Stream<
    ListArchivesResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListArchivesRequest,
  ) => stream.Stream<
    Archive,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListArchivesRequest,
  output: ListArchivesResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Archives",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Deletes an Add On subscription.
 */
export const deleteAddonSubscription: (
  input: DeleteAddonSubscriptionRequest,
) => effect.Effect<
  DeleteAddonSubscriptionResponse,
  ConflictException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAddonSubscriptionRequest,
  output: DeleteAddonSubscriptionResponse,
  errors: [ConflictException, ValidationException],
}));
/**
 * Delete a rule set.
 */
export const deleteRuleSet: (
  input: DeleteRuleSetRequest,
) => effect.Effect<
  DeleteRuleSetResponse,
  ConflictException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRuleSetRequest,
  output: DeleteRuleSetResponse,
  errors: [ConflictException, ValidationException],
}));
/**
 * Lists all Add On instances in your account.
 */
export const listAddonInstances: {
  (
    input: ListAddonInstancesRequest,
  ): effect.Effect<
    ListAddonInstancesResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAddonInstancesRequest,
  ) => stream.Stream<
    ListAddonInstancesResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAddonInstancesRequest,
  ) => stream.Stream<
    AddonInstance,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAddonInstancesRequest,
  output: ListAddonInstancesResponse,
  errors: [ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AddonInstances",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Creates a subscription for an Add On representing the acceptance of its terms of use and additional pricing. The subscription can then be used to create an instance for use in rule sets or traffic policies.
 */
export const createAddonSubscription: (
  input: CreateAddonSubscriptionRequest,
) => effect.Effect<
  CreateAddonSubscriptionResponse,
  | ConflictException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAddonSubscriptionRequest,
  output: CreateAddonSubscriptionResponse,
  errors: [
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Lists all Add On subscriptions in your account.
 */
export const listAddonSubscriptions: {
  (
    input: ListAddonSubscriptionsRequest,
  ): effect.Effect<
    ListAddonSubscriptionsResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAddonSubscriptionsRequest,
  ) => stream.Stream<
    ListAddonSubscriptionsResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAddonSubscriptionsRequest,
  ) => stream.Stream<
    AddonSubscription,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAddonSubscriptionsRequest,
  output: ListAddonSubscriptionsResponse,
  errors: [ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AddonSubscriptions",
    pageSize: "PageSize",
  } as const,
}));
/**
 * List all ingress endpoint resources.
 */
export const listIngressPoints: {
  (
    input: ListIngressPointsRequest,
  ): effect.Effect<
    ListIngressPointsResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIngressPointsRequest,
  ) => stream.Stream<
    ListIngressPointsResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIngressPointsRequest,
  ) => stream.Stream<
    IngressPoint,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIngressPointsRequest,
  output: ListIngressPointsResponse,
  errors: [ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "IngressPoints",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Creates a relay resource which can be used in rules to relay incoming emails to defined relay destinations.
 */
export const createRelay: (
  input: CreateRelayRequest,
) => effect.Effect<
  CreateRelayResponse,
  | ConflictException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRelayRequest,
  output: CreateRelayResponse,
  errors: [
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Lists all the existing relay resources.
 */
export const listRelays: {
  (
    input: ListRelaysRequest,
  ): effect.Effect<
    ListRelaysResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRelaysRequest,
  ) => stream.Stream<
    ListRelaysResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRelaysRequest,
  ) => stream.Stream<
    Relay,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRelaysRequest,
  output: ListRelaysResponse,
  errors: [ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Relays",
    pageSize: "PageSize",
  } as const,
}));
/**
 * List rule sets for this account.
 */
export const listRuleSets: {
  (
    input: ListRuleSetsRequest,
  ): effect.Effect<
    ListRuleSetsResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRuleSetsRequest,
  ) => stream.Stream<
    ListRuleSetsResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRuleSetsRequest,
  ) => stream.Stream<
    RuleSet,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRuleSetsRequest,
  output: ListRuleSetsResponse,
  errors: [ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RuleSets",
    pageSize: "PageSize",
  } as const,
}));
/**
 * List traffic policy resources.
 */
export const listTrafficPolicies: {
  (
    input: ListTrafficPoliciesRequest,
  ): effect.Effect<
    ListTrafficPoliciesResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTrafficPoliciesRequest,
  ) => stream.Stream<
    ListTrafficPoliciesResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTrafficPoliciesRequest,
  ) => stream.Stream<
    TrafficPolicy,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTrafficPoliciesRequest,
  output: ListTrafficPoliciesResponse,
  errors: [ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "TrafficPolicies",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Stops an in-progress export of emails from an archive.
 */
export const stopArchiveExport: (
  input: StopArchiveExportRequest,
) => effect.Effect<
  StopArchiveExportResponse,
  | AccessDeniedException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopArchiveExportRequest,
  output: StopArchiveExportResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
}));
/**
 * Fetch attributes of an import job.
 */
export const getAddressListImportJob: (
  input: GetAddressListImportJobRequest,
) => effect.Effect<
  GetAddressListImportJobResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAddressListImportJobRequest,
  output: GetAddressListImportJobResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Fetch attributes of a member in an address list.
 */
export const getMemberOfAddressList: (
  input: GetMemberOfAddressListRequest,
) => effect.Effect<
  GetMemberOfAddressListResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMemberOfAddressListRequest,
  output: GetMemberOfAddressListResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the list of tags (keys and values) assigned to the resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Remove one or more tags (keys and values) from a specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Creates an Add On instance for the subscription indicated in the request. The resulting Amazon Resource Name (ARN) can be used in a conditional statement for a rule set or traffic policy.
 */
export const createAddonInstance: (
  input: CreateAddonInstanceRequest,
) => effect.Effect<
  CreateAddonInstanceResponse,
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAddonInstanceRequest,
  output: CreateAddonInstanceResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Gets detailed information about an Add On instance.
 */
export const getAddonInstance: (
  input: GetAddonInstanceRequest,
) => effect.Effect<
  GetAddonInstanceResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAddonInstanceRequest,
  output: GetAddonInstanceResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Gets detailed information about an Add On subscription.
 */
export const getAddonSubscription: (
  input: GetAddonSubscriptionRequest,
) => effect.Effect<
  GetAddonSubscriptionResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAddonSubscriptionRequest,
  output: GetAddonSubscriptionResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Fetch attributes of an address list.
 */
export const getAddressList: (
  input: GetAddressListRequest,
) => effect.Effect<
  GetAddressListResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAddressListRequest,
  output: GetAddressListResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the full details and current state of a specified email archive.
 */
export const getArchive: (
  input: GetArchiveRequest,
) => effect.Effect<
  GetArchiveResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetArchiveRequest,
  output: GetArchiveResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Fetch the relay resource and it's attributes.
 */
export const getRelay: (
  input: GetRelayRequest,
) => effect.Effect<
  GetRelayResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRelayRequest,
  output: GetRelayResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Fetch attributes of a rule set.
 */
export const getRuleSet: (
  input: GetRuleSetRequest,
) => effect.Effect<
  GetRuleSetResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRuleSetRequest,
  output: GetRuleSetResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Fetch attributes of a traffic policy resource.
 */
export const getTrafficPolicy: (
  input: GetTrafficPolicyRequest,
) => effect.Effect<
  GetTrafficPolicyResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrafficPolicyRequest,
  output: GetTrafficPolicyResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Adds a member to an address list.
 */
export const registerMemberToAddressList: (
  input: RegisterMemberToAddressListRequest,
) => effect.Effect<
  RegisterMemberToAddressListResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterMemberToAddressListRequest,
  output: RegisterMemberToAddressListResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts an import job for an address list.
 */
export const startAddressListImportJob: (
  input: StartAddressListImportJobRequest,
) => effect.Effect<
  StartAddressListImportJobResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartAddressListImportJobRequest,
  output: StartAddressListImportJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stops an ongoing import job for an address list.
 */
export const stopAddressListImportJob: (
  input: StopAddressListImportJobRequest,
) => effect.Effect<
  StopAddressListImportJobResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopAddressListImportJobRequest,
  output: StopAddressListImportJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the attributes of an existing email archive.
 */
export const updateArchive: (
  input: UpdateArchiveRequest,
) => effect.Effect<
  UpdateArchiveResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateArchiveRequest,
  output: UpdateArchiveResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update attributes of a provisioned ingress endpoint resource.
 */
export const updateIngressPoint: (
  input: UpdateIngressPointRequest,
) => effect.Effect<
  UpdateIngressPointResponse,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIngressPointRequest,
  output: UpdateIngressPointResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Delete an ingress endpoint resource.
 */
export const deleteIngressPoint: (
  input: DeleteIngressPointRequest,
) => effect.Effect<
  DeleteIngressPointResponse,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIngressPointRequest,
  output: DeleteIngressPointResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Updates the attributes of an existing relay resource.
 */
export const updateRelay: (
  input: UpdateRelayRequest,
) => effect.Effect<
  UpdateRelayResponse,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRelayRequest,
  output: UpdateRelayResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Deletes an existing relay resource.
 */
export const deleteRelay: (
  input: DeleteRelayRequest,
) => effect.Effect<
  DeleteRelayResponse,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRelayRequest,
  output: DeleteRelayResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Update attributes of an already provisioned rule set.
 */
export const updateRuleSet: (
  input: UpdateRuleSetRequest,
) => effect.Effect<
  UpdateRuleSetResponse,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRuleSetRequest,
  output: UpdateRuleSetResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Update attributes of an already provisioned traffic policy resource.
 */
export const updateTrafficPolicy: (
  input: UpdateTrafficPolicyRequest,
) => effect.Effect<
  UpdateTrafficPolicyResponse,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTrafficPolicyRequest,
  output: UpdateTrafficPolicyResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Delete a traffic policy resource.
 */
export const deleteTrafficPolicy: (
  input: DeleteTrafficPolicyRequest,
) => effect.Effect<
  DeleteTrafficPolicyResponse,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTrafficPolicyRequest,
  output: DeleteTrafficPolicyResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Initiates a search across emails in the specified archive.
 */
export const startArchiveSearch: (
  input: StartArchiveSearchRequest,
) => effect.Effect<
  StartArchiveSearchResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartArchiveSearchRequest,
  output: StartArchiveSearchResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds one or more tags (keys and values) to a specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates an import job for an address list.
 */
export const createAddressListImportJob: (
  input: CreateAddressListImportJobRequest,
) => effect.Effect<
  CreateAddressListImportJobResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAddressListImportJobRequest,
  output: CreateAddressListImportJobResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists members of an address list.
 */
export const listMembersOfAddressList: {
  (
    input: ListMembersOfAddressListRequest,
  ): effect.Effect<
    ListMembersOfAddressListResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMembersOfAddressListRequest,
  ) => stream.Stream<
    ListMembersOfAddressListResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMembersOfAddressListRequest,
  ) => stream.Stream<
    SavedAddress,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMembersOfAddressListRequest,
  output: ListMembersOfAddressListResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Addresses",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Provision a new ingress endpoint resource.
 */
export const createIngressPoint: (
  input: CreateIngressPointRequest,
) => effect.Effect<
  CreateIngressPointResponse,
  | ConflictException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIngressPointRequest,
  output: CreateIngressPointResponse,
  errors: [
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Fetch ingress endpoint resource attributes.
 */
export const getIngressPoint: (
  input: GetIngressPointRequest,
) => effect.Effect<
  GetIngressPointResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIngressPointRequest,
  output: GetIngressPointResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Initiates an export of emails from the specified archive.
 */
export const startArchiveExport: (
  input: StartArchiveExportRequest,
) => effect.Effect<
  StartArchiveExportResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartArchiveExportRequest,
  output: StartArchiveExportResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provision a new rule set.
 */
export const createRuleSet: (
  input: CreateRuleSetRequest,
) => effect.Effect<
  CreateRuleSetResponse,
  | ConflictException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRuleSetRequest,
  output: CreateRuleSetResponse,
  errors: [
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Provision a new traffic policy resource.
 */
export const createTrafficPolicy: (
  input: CreateTrafficPolicyRequest,
) => effect.Effect<
  CreateTrafficPolicyResponse,
  | ConflictException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTrafficPolicyRequest,
  output: CreateTrafficPolicyResponse,
  errors: [
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
