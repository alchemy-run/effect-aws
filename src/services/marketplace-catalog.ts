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
  sdkId: "Marketplace Catalog",
  serviceShapeName: "AWSMPSeymour",
});
const auth = T.AwsAuthSigv4({ name: "aws-marketplace" });
const ver = T.ServiceVersion("2018-09-17");
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
              `https://catalog.marketplace-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://catalog.marketplace-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://catalog.marketplace.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://catalog.marketplace.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Catalog = string;
export type ResourceId = string;
export type ResourceARN = string;
export type ListChangeSetsMaxResultInteger = number;
export type NextToken = string;
export type EntityType = string;
export type ListEntitiesMaxResultInteger = number;
export type ResourcePolicyJson = string;
export type ChangeSetName = string;
export type ClientRequestToken = string;
export type TagKey = string;
export type EntityId = string;
export type FilterName = string;
export type FilterValueContent = string;
export type SortBy = string;
export type ChangeType = string;
export type Json = string;
export type JsonDocumentType = unknown;
export type ChangeName = string;
export type TagValue = string;
export type ARN = string;
export type ExceptionMessageContent = string;
export type DateTimeISO8601 = string;
export type Identifier = string;
export type DataProductEntityIdString = string;
export type DataProductTitleString = string;
export type SaaSProductEntityIdString = string;
export type SaaSProductTitleString = string;
export type AmiProductEntityIdString = string;
export type AmiProductTitleString = string;
export type OfferEntityIdString = string;
export type OfferNameString = string;
export type OfferProductIdString = string;
export type OfferResaleAuthorizationIdString = string;
export type OfferBuyerAccountsFilterWildcard = string;
export type OfferSetIdString = string;
export type ContainerProductEntityIdString = string;
export type ContainerProductTitleString = string;
export type ResaleAuthorizationEntityIdString = string;
export type ResaleAuthorizationNameString = string;
export type ResaleAuthorizationNameFilterWildcard = string;
export type ResaleAuthorizationProductIdString = string;
export type ResaleAuthorizationProductIdFilterWildcard = string;
export type ResaleAuthorizationManufacturerAccountIdString = string;
export type ResaleAuthorizationManufacturerAccountIdFilterWildcard = string;
export type ResaleAuthorizationProductNameString = string;
export type ResaleAuthorizationProductNameFilterWildcard = string;
export type ResaleAuthorizationManufacturerLegalNameString = string;
export type ResaleAuthorizationManufacturerLegalNameFilterWildcard = string;
export type ResaleAuthorizationResellerAccountIDString = string;
export type ResaleAuthorizationResellerAccountIDFilterWildcard = string;
export type ResaleAuthorizationResellerLegalNameString = string;
export type ResaleAuthorizationResellerLegalNameFilterWildcard = string;
export type ResaleAuthorizationOfferExtendedStatusString = string;
export type MachineLearningProductEntityIdString = string;
export type MachineLearningProductTitleString = string;
export type OfferSetEntityIdString = string;
export type OfferSetNameString = string;
export type OfferSetAssociatedOfferIdsString = string;
export type OfferSetSolutionIdString = string;
export type ErrorCodeString = string;
export type BatchDescribeErrorCodeString = string;
export type BatchDescribeErrorMessageContent = string;
export type EntityNameString = string;
export type VisibilityValue = string;
export type OfferBuyerAccountsString = string;

//# Schemas
export type OwnershipType = "SELF" | "SHARED" | (string & {});
export const OwnershipType = S.String;
export type Intent = "VALIDATE" | "APPLY" | (string & {});
export const Intent = S.String;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface CancelChangeSetRequest {
  Catalog: string;
  ChangeSetId: string;
}
export const CancelChangeSetRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String.pipe(T.HttpQuery("catalog")),
    ChangeSetId: S.String.pipe(T.HttpQuery("changeSetId")),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/CancelChangeSet" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelChangeSetRequest",
}) as any as S.Schema<CancelChangeSetRequest>;
export interface DeleteResourcePolicyRequest {
  ResourceArn: string;
}
export const DeleteResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpQuery("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/DeleteResourcePolicy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteResourcePolicyRequest",
}) as any as S.Schema<DeleteResourcePolicyRequest>;
export interface DeleteResourcePolicyResponse {}
export const DeleteResourcePolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteResourcePolicyResponse",
}) as any as S.Schema<DeleteResourcePolicyResponse>;
export interface DescribeChangeSetRequest {
  Catalog: string;
  ChangeSetId: string;
}
export const DescribeChangeSetRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String.pipe(T.HttpQuery("catalog")),
    ChangeSetId: S.String.pipe(T.HttpQuery("changeSetId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/DescribeChangeSet" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeChangeSetRequest",
}) as any as S.Schema<DescribeChangeSetRequest>;
export interface DescribeEntityRequest {
  Catalog: string;
  EntityId: string;
}
export const DescribeEntityRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String.pipe(T.HttpQuery("catalog")),
    EntityId: S.String.pipe(T.HttpQuery("entityId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/DescribeEntity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeEntityRequest",
}) as any as S.Schema<DescribeEntityRequest>;
export interface GetResourcePolicyRequest {
  ResourceArn: string;
}
export const GetResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpQuery("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/GetResourcePolicy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourcePolicyRequest",
}) as any as S.Schema<GetResourcePolicyRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListTagsForResource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface PutResourcePolicyRequest {
  ResourceArn: string;
  Policy: string;
}
export const PutResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Policy: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/PutResourcePolicy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutResourcePolicyRequest",
}) as any as S.Schema<PutResourcePolicyRequest>;
export interface PutResourcePolicyResponse {}
export const PutResourcePolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutResourcePolicyResponse",
}) as any as S.Schema<PutResourcePolicyResponse>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: TagList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/TagResource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
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
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagKeys: TagKeyList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UntagResource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type ValueList = string[];
export const ValueList = S.Array(S.String);
export type SortOrder = "ASCENDING" | "DESCENDING" | (string & {});
export const SortOrder = S.String;
export interface EntityRequest {
  Catalog: string;
  EntityId: string;
}
export const EntityRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, EntityId: S.String }),
).annotations({
  identifier: "EntityRequest",
}) as any as S.Schema<EntityRequest>;
export type EntityRequestList = EntityRequest[];
export const EntityRequestList = S.Array(EntityRequest);
export type ChangeStatus =
  | "PREPARING"
  | "APPLYING"
  | "SUCCEEDED"
  | "CANCELLED"
  | "FAILED"
  | (string & {});
export const ChangeStatus = S.String;
export type FailureCode = "CLIENT_ERROR" | "SERVER_FAULT" | (string & {});
export const FailureCode = S.String;
export interface Filter {
  Name?: string;
  ValueList?: string[];
}
export const Filter = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), ValueList: S.optional(ValueList) }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type FilterList = Filter[];
export const FilterList = S.Array(Filter);
export interface Sort {
  SortBy?: string;
  SortOrder?: SortOrder;
}
export const Sort = S.suspend(() =>
  S.Struct({ SortBy: S.optional(S.String), SortOrder: S.optional(SortOrder) }),
).annotations({ identifier: "Sort" }) as any as S.Schema<Sort>;
export type DataProductSortBy =
  | "EntityId"
  | "ProductTitle"
  | "Visibility"
  | "LastModifiedDate"
  | (string & {});
export const DataProductSortBy = S.String;
export type SaaSProductSortBy =
  | "EntityId"
  | "ProductTitle"
  | "Visibility"
  | "LastModifiedDate"
  | "DeliveryOptionTypes"
  | (string & {});
export const SaaSProductSortBy = S.String;
export type AmiProductSortBy =
  | "EntityId"
  | "LastModifiedDate"
  | "ProductTitle"
  | "Visibility"
  | (string & {});
export const AmiProductSortBy = S.String;
export type OfferSortBy =
  | "EntityId"
  | "Name"
  | "ProductId"
  | "ResaleAuthorizationId"
  | "ReleaseDate"
  | "AvailabilityEndDate"
  | "BuyerAccounts"
  | "State"
  | "Targeting"
  | "LastModifiedDate"
  | "OfferSetId"
  | (string & {});
export const OfferSortBy = S.String;
export type ContainerProductSortBy =
  | "EntityId"
  | "LastModifiedDate"
  | "ProductTitle"
  | "Visibility"
  | "CompatibleAWSServices"
  | (string & {});
export const ContainerProductSortBy = S.String;
export type ResaleAuthorizationSortBy =
  | "EntityId"
  | "Name"
  | "ProductId"
  | "ProductName"
  | "ManufacturerAccountId"
  | "ManufacturerLegalName"
  | "ResellerAccountID"
  | "ResellerLegalName"
  | "Status"
  | "OfferExtendedStatus"
  | "CreatedDate"
  | "AvailabilityEndDate"
  | "LastModifiedDate"
  | (string & {});
export const ResaleAuthorizationSortBy = S.String;
export type MachineLearningProductSortBy =
  | "EntityId"
  | "LastModifiedDate"
  | "ProductTitle"
  | "Visibility"
  | (string & {});
export const MachineLearningProductSortBy = S.String;
export type OfferSetSortBy =
  | "Name"
  | "State"
  | "ReleaseDate"
  | "SolutionId"
  | "EntityId"
  | "LastModifiedDate"
  | (string & {});
export const OfferSetSortBy = S.String;
export interface BatchDescribeEntitiesRequest {
  EntityRequestList: EntityRequest[];
}
export const BatchDescribeEntitiesRequest = S.suspend(() =>
  S.Struct({ EntityRequestList: EntityRequestList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/BatchDescribeEntities" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDescribeEntitiesRequest",
}) as any as S.Schema<BatchDescribeEntitiesRequest>;
export interface CancelChangeSetResponse {
  ChangeSetId?: string;
  ChangeSetArn?: string;
}
export const CancelChangeSetResponse = S.suspend(() =>
  S.Struct({
    ChangeSetId: S.optional(S.String),
    ChangeSetArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CancelChangeSetResponse",
}) as any as S.Schema<CancelChangeSetResponse>;
export interface DescribeEntityResponse {
  EntityType?: string;
  EntityIdentifier?: string;
  EntityArn?: string;
  LastModifiedDate?: string;
  Details?: string;
  DetailsDocument?: any;
}
export const DescribeEntityResponse = S.suspend(() =>
  S.Struct({
    EntityType: S.optional(S.String),
    EntityIdentifier: S.optional(S.String),
    EntityArn: S.optional(S.String),
    LastModifiedDate: S.optional(S.String),
    Details: S.optional(S.String),
    DetailsDocument: S.optional(S.Any),
  }),
).annotations({
  identifier: "DescribeEntityResponse",
}) as any as S.Schema<DescribeEntityResponse>;
export interface GetResourcePolicyResponse {
  Policy?: string;
}
export const GetResourcePolicyResponse = S.suspend(() =>
  S.Struct({ Policy: S.optional(S.String) }),
).annotations({
  identifier: "GetResourcePolicyResponse",
}) as any as S.Schema<GetResourcePolicyResponse>;
export interface ListChangeSetsRequest {
  Catalog: string;
  FilterList?: Filter[];
  Sort?: Sort;
  MaxResults?: number;
  NextToken?: string;
}
export const ListChangeSetsRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    FilterList: S.optional(FilterList),
    Sort: S.optional(Sort),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListChangeSets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListChangeSetsRequest",
}) as any as S.Schema<ListChangeSetsRequest>;
export interface ListTagsForResourceResponse {
  ResourceArn?: string;
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ ResourceArn: S.optional(S.String), Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface DataProductSort {
  SortBy?: DataProductSortBy;
  SortOrder?: SortOrder;
}
export const DataProductSort = S.suspend(() =>
  S.Struct({
    SortBy: S.optional(DataProductSortBy),
    SortOrder: S.optional(SortOrder),
  }),
).annotations({
  identifier: "DataProductSort",
}) as any as S.Schema<DataProductSort>;
export interface SaaSProductSort {
  SortBy?: SaaSProductSortBy;
  SortOrder?: SortOrder;
}
export const SaaSProductSort = S.suspend(() =>
  S.Struct({
    SortBy: S.optional(SaaSProductSortBy),
    SortOrder: S.optional(SortOrder),
  }),
).annotations({
  identifier: "SaaSProductSort",
}) as any as S.Schema<SaaSProductSort>;
export interface AmiProductSort {
  SortBy?: AmiProductSortBy;
  SortOrder?: SortOrder;
}
export const AmiProductSort = S.suspend(() =>
  S.Struct({
    SortBy: S.optional(AmiProductSortBy),
    SortOrder: S.optional(SortOrder),
  }),
).annotations({
  identifier: "AmiProductSort",
}) as any as S.Schema<AmiProductSort>;
export interface OfferSort {
  SortBy?: OfferSortBy;
  SortOrder?: SortOrder;
}
export const OfferSort = S.suspend(() =>
  S.Struct({
    SortBy: S.optional(OfferSortBy),
    SortOrder: S.optional(SortOrder),
  }),
).annotations({ identifier: "OfferSort" }) as any as S.Schema<OfferSort>;
export interface ContainerProductSort {
  SortBy?: ContainerProductSortBy;
  SortOrder?: SortOrder;
}
export const ContainerProductSort = S.suspend(() =>
  S.Struct({
    SortBy: S.optional(ContainerProductSortBy),
    SortOrder: S.optional(SortOrder),
  }),
).annotations({
  identifier: "ContainerProductSort",
}) as any as S.Schema<ContainerProductSort>;
export interface ResaleAuthorizationSort {
  SortBy?: ResaleAuthorizationSortBy;
  SortOrder?: SortOrder;
}
export const ResaleAuthorizationSort = S.suspend(() =>
  S.Struct({
    SortBy: S.optional(ResaleAuthorizationSortBy),
    SortOrder: S.optional(SortOrder),
  }),
).annotations({
  identifier: "ResaleAuthorizationSort",
}) as any as S.Schema<ResaleAuthorizationSort>;
export interface MachineLearningProductSort {
  SortBy?: MachineLearningProductSortBy;
  SortOrder?: SortOrder;
}
export const MachineLearningProductSort = S.suspend(() =>
  S.Struct({
    SortBy: S.optional(MachineLearningProductSortBy),
    SortOrder: S.optional(SortOrder),
  }),
).annotations({
  identifier: "MachineLearningProductSort",
}) as any as S.Schema<MachineLearningProductSort>;
export interface OfferSetSort {
  SortBy?: OfferSetSortBy;
  SortOrder?: SortOrder;
}
export const OfferSetSort = S.suspend(() =>
  S.Struct({
    SortBy: S.optional(OfferSetSortBy),
    SortOrder: S.optional(SortOrder),
  }),
).annotations({ identifier: "OfferSetSort" }) as any as S.Schema<OfferSetSort>;
export interface Entity {
  Type: string;
  Identifier?: string;
}
export const Entity = S.suspend(() =>
  S.Struct({ Type: S.String, Identifier: S.optional(S.String) }),
).annotations({ identifier: "Entity" }) as any as S.Schema<Entity>;
export type DataProductEntityIdFilterValueList = string[];
export const DataProductEntityIdFilterValueList = S.Array(S.String);
export type DataProductTitleFilterValueList = string[];
export const DataProductTitleFilterValueList = S.Array(S.String);
export type DataProductVisibilityString =
  | "Limited"
  | "Public"
  | "Restricted"
  | "Unavailable"
  | "Draft"
  | (string & {});
export const DataProductVisibilityString = S.String;
export type DataProductVisibilityFilterValueList =
  DataProductVisibilityString[];
export const DataProductVisibilityFilterValueList = S.Array(
  DataProductVisibilityString,
);
export type SaaSProductEntityIdFilterValueList = string[];
export const SaaSProductEntityIdFilterValueList = S.Array(S.String);
export type SaaSProductTitleFilterValueList = string[];
export const SaaSProductTitleFilterValueList = S.Array(S.String);
export type SaaSProductVisibilityString =
  | "Limited"
  | "Public"
  | "Restricted"
  | "Draft"
  | (string & {});
export const SaaSProductVisibilityString = S.String;
export type SaaSProductVisibilityFilterValueList =
  SaaSProductVisibilityString[];
export const SaaSProductVisibilityFilterValueList = S.Array(
  SaaSProductVisibilityString,
);
export type AmiProductEntityIdFilterValueList = string[];
export const AmiProductEntityIdFilterValueList = S.Array(S.String);
export type AmiProductTitleFilterValueList = string[];
export const AmiProductTitleFilterValueList = S.Array(S.String);
export type AmiProductVisibilityString =
  | "Limited"
  | "Public"
  | "Restricted"
  | "Draft"
  | (string & {});
export const AmiProductVisibilityString = S.String;
export type AmiProductVisibilityFilterValueList = AmiProductVisibilityString[];
export const AmiProductVisibilityFilterValueList = S.Array(
  AmiProductVisibilityString,
);
export type OfferEntityIdFilterValueList = string[];
export const OfferEntityIdFilterValueList = S.Array(S.String);
export type OfferNameFilterValueList = string[];
export const OfferNameFilterValueList = S.Array(S.String);
export type OfferProductIdFilterValueList = string[];
export const OfferProductIdFilterValueList = S.Array(S.String);
export type OfferResaleAuthorizationIdFilterValueList = string[];
export const OfferResaleAuthorizationIdFilterValueList = S.Array(S.String);
export type OfferStateString = "Draft" | "Released" | (string & {});
export const OfferStateString = S.String;
export type OfferStateFilterValueList = OfferStateString[];
export const OfferStateFilterValueList = S.Array(OfferStateString);
export type OfferTargetingString =
  | "BuyerAccounts"
  | "ParticipatingPrograms"
  | "CountryCodes"
  | "None"
  | (string & {});
export const OfferTargetingString = S.String;
export type OfferTargetingFilterValueList = OfferTargetingString[];
export const OfferTargetingFilterValueList = S.Array(OfferTargetingString);
export type OfferSetIdFilterValueList = string[];
export const OfferSetIdFilterValueList = S.Array(S.String);
export type ContainerProductEntityIdFilterValueList = string[];
export const ContainerProductEntityIdFilterValueList = S.Array(S.String);
export type ContainerProductTitleFilterValueList = string[];
export const ContainerProductTitleFilterValueList = S.Array(S.String);
export type ContainerProductVisibilityString =
  | "Limited"
  | "Public"
  | "Restricted"
  | "Draft"
  | (string & {});
export const ContainerProductVisibilityString = S.String;
export type ContainerProductVisibilityFilterValueList =
  ContainerProductVisibilityString[];
export const ContainerProductVisibilityFilterValueList = S.Array(
  ContainerProductVisibilityString,
);
export type ResaleAuthorizationEntityIdFilterValueList = string[];
export const ResaleAuthorizationEntityIdFilterValueList = S.Array(S.String);
export type ResaleAuthorizationNameFilterValueList = string[];
export const ResaleAuthorizationNameFilterValueList = S.Array(S.String);
export type ResaleAuthorizationProductIdFilterValueList = string[];
export const ResaleAuthorizationProductIdFilterValueList = S.Array(S.String);
export type ResaleAuthorizationCreatedDateFilterValueList = string[];
export const ResaleAuthorizationCreatedDateFilterValueList = S.Array(S.String);
export type ResaleAuthorizationAvailabilityEndDateFilterValueList = string[];
export const ResaleAuthorizationAvailabilityEndDateFilterValueList = S.Array(
  S.String,
);
export type ResaleAuthorizationManufacturerAccountIdFilterValueList = string[];
export const ResaleAuthorizationManufacturerAccountIdFilterValueList = S.Array(
  S.String,
);
export type ResaleAuthorizationProductNameFilterValueList = string[];
export const ResaleAuthorizationProductNameFilterValueList = S.Array(S.String);
export type ResaleAuthorizationManufacturerLegalNameFilterValueList = string[];
export const ResaleAuthorizationManufacturerLegalNameFilterValueList = S.Array(
  S.String,
);
export type ResaleAuthorizationResellerAccountIDFilterValueList = string[];
export const ResaleAuthorizationResellerAccountIDFilterValueList = S.Array(
  S.String,
);
export type ResaleAuthorizationResellerLegalNameFilterValueList = string[];
export const ResaleAuthorizationResellerLegalNameFilterValueList = S.Array(
  S.String,
);
export type ResaleAuthorizationStatusString =
  | "Draft"
  | "Active"
  | "Restricted"
  | (string & {});
export const ResaleAuthorizationStatusString = S.String;
export type ResaleAuthorizationStatusFilterValueList =
  ResaleAuthorizationStatusString[];
export const ResaleAuthorizationStatusFilterValueList = S.Array(
  ResaleAuthorizationStatusString,
);
export type ResaleAuthorizationOfferExtendedStatusFilterValueList = string[];
export const ResaleAuthorizationOfferExtendedStatusFilterValueList = S.Array(
  S.String,
);
export type MachineLearningProductEntityIdFilterValueList = string[];
export const MachineLearningProductEntityIdFilterValueList = S.Array(S.String);
export type MachineLearningProductTitleFilterValueList = string[];
export const MachineLearningProductTitleFilterValueList = S.Array(S.String);
export type MachineLearningProductVisibilityString =
  | "Limited"
  | "Public"
  | "Restricted"
  | "Draft"
  | (string & {});
export const MachineLearningProductVisibilityString = S.String;
export type MachineLearningProductVisibilityFilterValueList =
  MachineLearningProductVisibilityString[];
export const MachineLearningProductVisibilityFilterValueList = S.Array(
  MachineLearningProductVisibilityString,
);
export type OfferSetEntityIdFilterValueList = string[];
export const OfferSetEntityIdFilterValueList = S.Array(S.String);
export type OfferSetNameFilterValueList = string[];
export const OfferSetNameFilterValueList = S.Array(S.String);
export type OfferSetStateString = "Draft" | "Released" | (string & {});
export const OfferSetStateString = S.String;
export type OfferSetStateFilterValueList = OfferSetStateString[];
export const OfferSetStateFilterValueList = S.Array(OfferSetStateString);
export type OfferSetAssociatedOfferIdsFilterValueList = string[];
export const OfferSetAssociatedOfferIdsFilterValueList = S.Array(S.String);
export type OfferSetSolutionIdFilterValueList = string[];
export const OfferSetSolutionIdFilterValueList = S.Array(S.String);
export type EntityTypeSort =
  | {
      DataProductSort: DataProductSort;
      SaaSProductSort?: never;
      AmiProductSort?: never;
      OfferSort?: never;
      ContainerProductSort?: never;
      ResaleAuthorizationSort?: never;
      MachineLearningProductSort?: never;
      OfferSetSort?: never;
    }
  | {
      DataProductSort?: never;
      SaaSProductSort: SaaSProductSort;
      AmiProductSort?: never;
      OfferSort?: never;
      ContainerProductSort?: never;
      ResaleAuthorizationSort?: never;
      MachineLearningProductSort?: never;
      OfferSetSort?: never;
    }
  | {
      DataProductSort?: never;
      SaaSProductSort?: never;
      AmiProductSort: AmiProductSort;
      OfferSort?: never;
      ContainerProductSort?: never;
      ResaleAuthorizationSort?: never;
      MachineLearningProductSort?: never;
      OfferSetSort?: never;
    }
  | {
      DataProductSort?: never;
      SaaSProductSort?: never;
      AmiProductSort?: never;
      OfferSort: OfferSort;
      ContainerProductSort?: never;
      ResaleAuthorizationSort?: never;
      MachineLearningProductSort?: never;
      OfferSetSort?: never;
    }
  | {
      DataProductSort?: never;
      SaaSProductSort?: never;
      AmiProductSort?: never;
      OfferSort?: never;
      ContainerProductSort: ContainerProductSort;
      ResaleAuthorizationSort?: never;
      MachineLearningProductSort?: never;
      OfferSetSort?: never;
    }
  | {
      DataProductSort?: never;
      SaaSProductSort?: never;
      AmiProductSort?: never;
      OfferSort?: never;
      ContainerProductSort?: never;
      ResaleAuthorizationSort: ResaleAuthorizationSort;
      MachineLearningProductSort?: never;
      OfferSetSort?: never;
    }
  | {
      DataProductSort?: never;
      SaaSProductSort?: never;
      AmiProductSort?: never;
      OfferSort?: never;
      ContainerProductSort?: never;
      ResaleAuthorizationSort?: never;
      MachineLearningProductSort: MachineLearningProductSort;
      OfferSetSort?: never;
    }
  | {
      DataProductSort?: never;
      SaaSProductSort?: never;
      AmiProductSort?: never;
      OfferSort?: never;
      ContainerProductSort?: never;
      ResaleAuthorizationSort?: never;
      MachineLearningProductSort?: never;
      OfferSetSort: OfferSetSort;
    };
export const EntityTypeSort = S.Union(
  S.Struct({ DataProductSort: DataProductSort }),
  S.Struct({ SaaSProductSort: SaaSProductSort }),
  S.Struct({ AmiProductSort: AmiProductSort }),
  S.Struct({ OfferSort: OfferSort }),
  S.Struct({ ContainerProductSort: ContainerProductSort }),
  S.Struct({ ResaleAuthorizationSort: ResaleAuthorizationSort }),
  S.Struct({ MachineLearningProductSort: MachineLearningProductSort }),
  S.Struct({ OfferSetSort: OfferSetSort }),
);
export interface Change {
  ChangeType: string;
  Entity: Entity;
  EntityTags?: Tag[];
  Details?: string;
  DetailsDocument?: any;
  ChangeName?: string;
}
export const Change = S.suspend(() =>
  S.Struct({
    ChangeType: S.String,
    Entity: Entity,
    EntityTags: S.optional(TagList),
    Details: S.optional(S.String),
    DetailsDocument: S.optional(S.Any),
    ChangeName: S.optional(S.String),
  }),
).annotations({ identifier: "Change" }) as any as S.Schema<Change>;
export type RequestedChangeList = Change[];
export const RequestedChangeList = S.Array(Change);
export interface DataProductEntityIdFilter {
  ValueList?: string[];
}
export const DataProductEntityIdFilter = S.suspend(() =>
  S.Struct({ ValueList: S.optional(DataProductEntityIdFilterValueList) }),
).annotations({
  identifier: "DataProductEntityIdFilter",
}) as any as S.Schema<DataProductEntityIdFilter>;
export interface DataProductTitleFilter {
  ValueList?: string[];
  WildCardValue?: string;
}
export const DataProductTitleFilter = S.suspend(() =>
  S.Struct({
    ValueList: S.optional(DataProductTitleFilterValueList),
    WildCardValue: S.optional(S.String),
  }),
).annotations({
  identifier: "DataProductTitleFilter",
}) as any as S.Schema<DataProductTitleFilter>;
export interface DataProductVisibilityFilter {
  ValueList?: DataProductVisibilityString[];
}
export const DataProductVisibilityFilter = S.suspend(() =>
  S.Struct({ ValueList: S.optional(DataProductVisibilityFilterValueList) }),
).annotations({
  identifier: "DataProductVisibilityFilter",
}) as any as S.Schema<DataProductVisibilityFilter>;
export interface SaaSProductEntityIdFilter {
  ValueList?: string[];
}
export const SaaSProductEntityIdFilter = S.suspend(() =>
  S.Struct({ ValueList: S.optional(SaaSProductEntityIdFilterValueList) }),
).annotations({
  identifier: "SaaSProductEntityIdFilter",
}) as any as S.Schema<SaaSProductEntityIdFilter>;
export interface SaaSProductTitleFilter {
  ValueList?: string[];
  WildCardValue?: string;
}
export const SaaSProductTitleFilter = S.suspend(() =>
  S.Struct({
    ValueList: S.optional(SaaSProductTitleFilterValueList),
    WildCardValue: S.optional(S.String),
  }),
).annotations({
  identifier: "SaaSProductTitleFilter",
}) as any as S.Schema<SaaSProductTitleFilter>;
export interface SaaSProductVisibilityFilter {
  ValueList?: SaaSProductVisibilityString[];
}
export const SaaSProductVisibilityFilter = S.suspend(() =>
  S.Struct({ ValueList: S.optional(SaaSProductVisibilityFilterValueList) }),
).annotations({
  identifier: "SaaSProductVisibilityFilter",
}) as any as S.Schema<SaaSProductVisibilityFilter>;
export interface AmiProductEntityIdFilter {
  ValueList?: string[];
}
export const AmiProductEntityIdFilter = S.suspend(() =>
  S.Struct({ ValueList: S.optional(AmiProductEntityIdFilterValueList) }),
).annotations({
  identifier: "AmiProductEntityIdFilter",
}) as any as S.Schema<AmiProductEntityIdFilter>;
export interface AmiProductTitleFilter {
  ValueList?: string[];
  WildCardValue?: string;
}
export const AmiProductTitleFilter = S.suspend(() =>
  S.Struct({
    ValueList: S.optional(AmiProductTitleFilterValueList),
    WildCardValue: S.optional(S.String),
  }),
).annotations({
  identifier: "AmiProductTitleFilter",
}) as any as S.Schema<AmiProductTitleFilter>;
export interface AmiProductVisibilityFilter {
  ValueList?: AmiProductVisibilityString[];
}
export const AmiProductVisibilityFilter = S.suspend(() =>
  S.Struct({ ValueList: S.optional(AmiProductVisibilityFilterValueList) }),
).annotations({
  identifier: "AmiProductVisibilityFilter",
}) as any as S.Schema<AmiProductVisibilityFilter>;
export interface OfferEntityIdFilter {
  ValueList?: string[];
}
export const OfferEntityIdFilter = S.suspend(() =>
  S.Struct({ ValueList: S.optional(OfferEntityIdFilterValueList) }),
).annotations({
  identifier: "OfferEntityIdFilter",
}) as any as S.Schema<OfferEntityIdFilter>;
export interface OfferNameFilter {
  ValueList?: string[];
  WildCardValue?: string;
}
export const OfferNameFilter = S.suspend(() =>
  S.Struct({
    ValueList: S.optional(OfferNameFilterValueList),
    WildCardValue: S.optional(S.String),
  }),
).annotations({
  identifier: "OfferNameFilter",
}) as any as S.Schema<OfferNameFilter>;
export interface OfferProductIdFilter {
  ValueList?: string[];
}
export const OfferProductIdFilter = S.suspend(() =>
  S.Struct({ ValueList: S.optional(OfferProductIdFilterValueList) }),
).annotations({
  identifier: "OfferProductIdFilter",
}) as any as S.Schema<OfferProductIdFilter>;
export interface OfferResaleAuthorizationIdFilter {
  ValueList?: string[];
}
export const OfferResaleAuthorizationIdFilter = S.suspend(() =>
  S.Struct({
    ValueList: S.optional(OfferResaleAuthorizationIdFilterValueList),
  }),
).annotations({
  identifier: "OfferResaleAuthorizationIdFilter",
}) as any as S.Schema<OfferResaleAuthorizationIdFilter>;
export interface OfferBuyerAccountsFilter {
  WildCardValue?: string;
}
export const OfferBuyerAccountsFilter = S.suspend(() =>
  S.Struct({ WildCardValue: S.optional(S.String) }),
).annotations({
  identifier: "OfferBuyerAccountsFilter",
}) as any as S.Schema<OfferBuyerAccountsFilter>;
export interface OfferStateFilter {
  ValueList?: OfferStateString[];
}
export const OfferStateFilter = S.suspend(() =>
  S.Struct({ ValueList: S.optional(OfferStateFilterValueList) }),
).annotations({
  identifier: "OfferStateFilter",
}) as any as S.Schema<OfferStateFilter>;
export interface OfferTargetingFilter {
  ValueList?: OfferTargetingString[];
}
export const OfferTargetingFilter = S.suspend(() =>
  S.Struct({ ValueList: S.optional(OfferTargetingFilterValueList) }),
).annotations({
  identifier: "OfferTargetingFilter",
}) as any as S.Schema<OfferTargetingFilter>;
export interface OfferSetIdFilter {
  ValueList?: string[];
}
export const OfferSetIdFilter = S.suspend(() =>
  S.Struct({ ValueList: S.optional(OfferSetIdFilterValueList) }),
).annotations({
  identifier: "OfferSetIdFilter",
}) as any as S.Schema<OfferSetIdFilter>;
export interface ContainerProductEntityIdFilter {
  ValueList?: string[];
}
export const ContainerProductEntityIdFilter = S.suspend(() =>
  S.Struct({ ValueList: S.optional(ContainerProductEntityIdFilterValueList) }),
).annotations({
  identifier: "ContainerProductEntityIdFilter",
}) as any as S.Schema<ContainerProductEntityIdFilter>;
export interface ContainerProductTitleFilter {
  ValueList?: string[];
  WildCardValue?: string;
}
export const ContainerProductTitleFilter = S.suspend(() =>
  S.Struct({
    ValueList: S.optional(ContainerProductTitleFilterValueList),
    WildCardValue: S.optional(S.String),
  }),
).annotations({
  identifier: "ContainerProductTitleFilter",
}) as any as S.Schema<ContainerProductTitleFilter>;
export interface ContainerProductVisibilityFilter {
  ValueList?: ContainerProductVisibilityString[];
}
export const ContainerProductVisibilityFilter = S.suspend(() =>
  S.Struct({
    ValueList: S.optional(ContainerProductVisibilityFilterValueList),
  }),
).annotations({
  identifier: "ContainerProductVisibilityFilter",
}) as any as S.Schema<ContainerProductVisibilityFilter>;
export interface ResaleAuthorizationEntityIdFilter {
  ValueList?: string[];
}
export const ResaleAuthorizationEntityIdFilter = S.suspend(() =>
  S.Struct({
    ValueList: S.optional(ResaleAuthorizationEntityIdFilterValueList),
  }),
).annotations({
  identifier: "ResaleAuthorizationEntityIdFilter",
}) as any as S.Schema<ResaleAuthorizationEntityIdFilter>;
export interface ResaleAuthorizationNameFilter {
  ValueList?: string[];
  WildCardValue?: string;
}
export const ResaleAuthorizationNameFilter = S.suspend(() =>
  S.Struct({
    ValueList: S.optional(ResaleAuthorizationNameFilterValueList),
    WildCardValue: S.optional(S.String),
  }),
).annotations({
  identifier: "ResaleAuthorizationNameFilter",
}) as any as S.Schema<ResaleAuthorizationNameFilter>;
export interface ResaleAuthorizationProductIdFilter {
  ValueList?: string[];
  WildCardValue?: string;
}
export const ResaleAuthorizationProductIdFilter = S.suspend(() =>
  S.Struct({
    ValueList: S.optional(ResaleAuthorizationProductIdFilterValueList),
    WildCardValue: S.optional(S.String),
  }),
).annotations({
  identifier: "ResaleAuthorizationProductIdFilter",
}) as any as S.Schema<ResaleAuthorizationProductIdFilter>;
export interface ResaleAuthorizationManufacturerAccountIdFilter {
  ValueList?: string[];
  WildCardValue?: string;
}
export const ResaleAuthorizationManufacturerAccountIdFilter = S.suspend(() =>
  S.Struct({
    ValueList: S.optional(
      ResaleAuthorizationManufacturerAccountIdFilterValueList,
    ),
    WildCardValue: S.optional(S.String),
  }),
).annotations({
  identifier: "ResaleAuthorizationManufacturerAccountIdFilter",
}) as any as S.Schema<ResaleAuthorizationManufacturerAccountIdFilter>;
export interface ResaleAuthorizationProductNameFilter {
  ValueList?: string[];
  WildCardValue?: string;
}
export const ResaleAuthorizationProductNameFilter = S.suspend(() =>
  S.Struct({
    ValueList: S.optional(ResaleAuthorizationProductNameFilterValueList),
    WildCardValue: S.optional(S.String),
  }),
).annotations({
  identifier: "ResaleAuthorizationProductNameFilter",
}) as any as S.Schema<ResaleAuthorizationProductNameFilter>;
export interface ResaleAuthorizationManufacturerLegalNameFilter {
  ValueList?: string[];
  WildCardValue?: string;
}
export const ResaleAuthorizationManufacturerLegalNameFilter = S.suspend(() =>
  S.Struct({
    ValueList: S.optional(
      ResaleAuthorizationManufacturerLegalNameFilterValueList,
    ),
    WildCardValue: S.optional(S.String),
  }),
).annotations({
  identifier: "ResaleAuthorizationManufacturerLegalNameFilter",
}) as any as S.Schema<ResaleAuthorizationManufacturerLegalNameFilter>;
export interface ResaleAuthorizationResellerAccountIDFilter {
  ValueList?: string[];
  WildCardValue?: string;
}
export const ResaleAuthorizationResellerAccountIDFilter = S.suspend(() =>
  S.Struct({
    ValueList: S.optional(ResaleAuthorizationResellerAccountIDFilterValueList),
    WildCardValue: S.optional(S.String),
  }),
).annotations({
  identifier: "ResaleAuthorizationResellerAccountIDFilter",
}) as any as S.Schema<ResaleAuthorizationResellerAccountIDFilter>;
export interface ResaleAuthorizationResellerLegalNameFilter {
  ValueList?: string[];
  WildCardValue?: string;
}
export const ResaleAuthorizationResellerLegalNameFilter = S.suspend(() =>
  S.Struct({
    ValueList: S.optional(ResaleAuthorizationResellerLegalNameFilterValueList),
    WildCardValue: S.optional(S.String),
  }),
).annotations({
  identifier: "ResaleAuthorizationResellerLegalNameFilter",
}) as any as S.Schema<ResaleAuthorizationResellerLegalNameFilter>;
export interface ResaleAuthorizationStatusFilter {
  ValueList?: ResaleAuthorizationStatusString[];
}
export const ResaleAuthorizationStatusFilter = S.suspend(() =>
  S.Struct({ ValueList: S.optional(ResaleAuthorizationStatusFilterValueList) }),
).annotations({
  identifier: "ResaleAuthorizationStatusFilter",
}) as any as S.Schema<ResaleAuthorizationStatusFilter>;
export interface ResaleAuthorizationOfferExtendedStatusFilter {
  ValueList?: string[];
}
export const ResaleAuthorizationOfferExtendedStatusFilter = S.suspend(() =>
  S.Struct({
    ValueList: S.optional(
      ResaleAuthorizationOfferExtendedStatusFilterValueList,
    ),
  }),
).annotations({
  identifier: "ResaleAuthorizationOfferExtendedStatusFilter",
}) as any as S.Schema<ResaleAuthorizationOfferExtendedStatusFilter>;
export interface MachineLearningProductEntityIdFilter {
  ValueList?: string[];
}
export const MachineLearningProductEntityIdFilter = S.suspend(() =>
  S.Struct({
    ValueList: S.optional(MachineLearningProductEntityIdFilterValueList),
  }),
).annotations({
  identifier: "MachineLearningProductEntityIdFilter",
}) as any as S.Schema<MachineLearningProductEntityIdFilter>;
export interface MachineLearningProductTitleFilter {
  ValueList?: string[];
  WildCardValue?: string;
}
export const MachineLearningProductTitleFilter = S.suspend(() =>
  S.Struct({
    ValueList: S.optional(MachineLearningProductTitleFilterValueList),
    WildCardValue: S.optional(S.String),
  }),
).annotations({
  identifier: "MachineLearningProductTitleFilter",
}) as any as S.Schema<MachineLearningProductTitleFilter>;
export interface MachineLearningProductVisibilityFilter {
  ValueList?: MachineLearningProductVisibilityString[];
}
export const MachineLearningProductVisibilityFilter = S.suspend(() =>
  S.Struct({
    ValueList: S.optional(MachineLearningProductVisibilityFilterValueList),
  }),
).annotations({
  identifier: "MachineLearningProductVisibilityFilter",
}) as any as S.Schema<MachineLearningProductVisibilityFilter>;
export interface OfferSetEntityIdFilter {
  ValueList?: string[];
}
export const OfferSetEntityIdFilter = S.suspend(() =>
  S.Struct({ ValueList: S.optional(OfferSetEntityIdFilterValueList) }),
).annotations({
  identifier: "OfferSetEntityIdFilter",
}) as any as S.Schema<OfferSetEntityIdFilter>;
export interface OfferSetNameFilter {
  ValueList?: string[];
}
export const OfferSetNameFilter = S.suspend(() =>
  S.Struct({ ValueList: S.optional(OfferSetNameFilterValueList) }),
).annotations({
  identifier: "OfferSetNameFilter",
}) as any as S.Schema<OfferSetNameFilter>;
export interface OfferSetStateFilter {
  ValueList?: OfferSetStateString[];
}
export const OfferSetStateFilter = S.suspend(() =>
  S.Struct({ ValueList: S.optional(OfferSetStateFilterValueList) }),
).annotations({
  identifier: "OfferSetStateFilter",
}) as any as S.Schema<OfferSetStateFilter>;
export interface OfferSetAssociatedOfferIdsFilter {
  ValueList?: string[];
}
export const OfferSetAssociatedOfferIdsFilter = S.suspend(() =>
  S.Struct({
    ValueList: S.optional(OfferSetAssociatedOfferIdsFilterValueList),
  }),
).annotations({
  identifier: "OfferSetAssociatedOfferIdsFilter",
}) as any as S.Schema<OfferSetAssociatedOfferIdsFilter>;
export interface OfferSetSolutionIdFilter {
  ValueList?: string[];
}
export const OfferSetSolutionIdFilter = S.suspend(() =>
  S.Struct({ ValueList: S.optional(OfferSetSolutionIdFilterValueList) }),
).annotations({
  identifier: "OfferSetSolutionIdFilter",
}) as any as S.Schema<OfferSetSolutionIdFilter>;
export interface StartChangeSetRequest {
  Catalog: string;
  ChangeSet: Change[];
  ChangeSetName?: string;
  ClientRequestToken?: string;
  ChangeSetTags?: Tag[];
  Intent?: Intent;
}
export const StartChangeSetRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ChangeSet: RequestedChangeList,
    ChangeSetName: S.optional(S.String),
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    ChangeSetTags: S.optional(TagList),
    Intent: S.optional(Intent),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StartChangeSet" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartChangeSetRequest",
}) as any as S.Schema<StartChangeSetRequest>;
export interface ErrorDetail {
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const ErrorDetail = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "ErrorDetail" }) as any as S.Schema<ErrorDetail>;
export type ErrorDetailList = ErrorDetail[];
export const ErrorDetailList = S.Array(ErrorDetail);
export type ResourceIdList = string[];
export const ResourceIdList = S.Array(S.String);
export interface DataProductLastModifiedDateFilterDateRange {
  AfterValue?: string;
  BeforeValue?: string;
}
export const DataProductLastModifiedDateFilterDateRange = S.suspend(() =>
  S.Struct({
    AfterValue: S.optional(S.String),
    BeforeValue: S.optional(S.String),
  }),
).annotations({
  identifier: "DataProductLastModifiedDateFilterDateRange",
}) as any as S.Schema<DataProductLastModifiedDateFilterDateRange>;
export interface SaaSProductLastModifiedDateFilterDateRange {
  AfterValue?: string;
  BeforeValue?: string;
}
export const SaaSProductLastModifiedDateFilterDateRange = S.suspend(() =>
  S.Struct({
    AfterValue: S.optional(S.String),
    BeforeValue: S.optional(S.String),
  }),
).annotations({
  identifier: "SaaSProductLastModifiedDateFilterDateRange",
}) as any as S.Schema<SaaSProductLastModifiedDateFilterDateRange>;
export interface AmiProductLastModifiedDateFilterDateRange {
  AfterValue?: string;
  BeforeValue?: string;
}
export const AmiProductLastModifiedDateFilterDateRange = S.suspend(() =>
  S.Struct({
    AfterValue: S.optional(S.String),
    BeforeValue: S.optional(S.String),
  }),
).annotations({
  identifier: "AmiProductLastModifiedDateFilterDateRange",
}) as any as S.Schema<AmiProductLastModifiedDateFilterDateRange>;
export interface OfferReleaseDateFilterDateRange {
  AfterValue?: string;
  BeforeValue?: string;
}
export const OfferReleaseDateFilterDateRange = S.suspend(() =>
  S.Struct({
    AfterValue: S.optional(S.String),
    BeforeValue: S.optional(S.String),
  }),
).annotations({
  identifier: "OfferReleaseDateFilterDateRange",
}) as any as S.Schema<OfferReleaseDateFilterDateRange>;
export interface OfferAvailabilityEndDateFilterDateRange {
  AfterValue?: string;
  BeforeValue?: string;
}
export const OfferAvailabilityEndDateFilterDateRange = S.suspend(() =>
  S.Struct({
    AfterValue: S.optional(S.String),
    BeforeValue: S.optional(S.String),
  }),
).annotations({
  identifier: "OfferAvailabilityEndDateFilterDateRange",
}) as any as S.Schema<OfferAvailabilityEndDateFilterDateRange>;
export interface OfferLastModifiedDateFilterDateRange {
  AfterValue?: string;
  BeforeValue?: string;
}
export const OfferLastModifiedDateFilterDateRange = S.suspend(() =>
  S.Struct({
    AfterValue: S.optional(S.String),
    BeforeValue: S.optional(S.String),
  }),
).annotations({
  identifier: "OfferLastModifiedDateFilterDateRange",
}) as any as S.Schema<OfferLastModifiedDateFilterDateRange>;
export interface ContainerProductLastModifiedDateFilterDateRange {
  AfterValue?: string;
  BeforeValue?: string;
}
export const ContainerProductLastModifiedDateFilterDateRange = S.suspend(() =>
  S.Struct({
    AfterValue: S.optional(S.String),
    BeforeValue: S.optional(S.String),
  }),
).annotations({
  identifier: "ContainerProductLastModifiedDateFilterDateRange",
}) as any as S.Schema<ContainerProductLastModifiedDateFilterDateRange>;
export interface ResaleAuthorizationCreatedDateFilterDateRange {
  AfterValue?: string;
  BeforeValue?: string;
}
export const ResaleAuthorizationCreatedDateFilterDateRange = S.suspend(() =>
  S.Struct({
    AfterValue: S.optional(S.String),
    BeforeValue: S.optional(S.String),
  }),
).annotations({
  identifier: "ResaleAuthorizationCreatedDateFilterDateRange",
}) as any as S.Schema<ResaleAuthorizationCreatedDateFilterDateRange>;
export interface ResaleAuthorizationAvailabilityEndDateFilterDateRange {
  AfterValue?: string;
  BeforeValue?: string;
}
export const ResaleAuthorizationAvailabilityEndDateFilterDateRange = S.suspend(
  () =>
    S.Struct({
      AfterValue: S.optional(S.String),
      BeforeValue: S.optional(S.String),
    }),
).annotations({
  identifier: "ResaleAuthorizationAvailabilityEndDateFilterDateRange",
}) as any as S.Schema<ResaleAuthorizationAvailabilityEndDateFilterDateRange>;
export interface ResaleAuthorizationLastModifiedDateFilterDateRange {
  AfterValue?: string;
  BeforeValue?: string;
}
export const ResaleAuthorizationLastModifiedDateFilterDateRange = S.suspend(
  () =>
    S.Struct({
      AfterValue: S.optional(S.String),
      BeforeValue: S.optional(S.String),
    }),
).annotations({
  identifier: "ResaleAuthorizationLastModifiedDateFilterDateRange",
}) as any as S.Schema<ResaleAuthorizationLastModifiedDateFilterDateRange>;
export interface MachineLearningProductLastModifiedDateFilterDateRange {
  AfterValue?: string;
  BeforeValue?: string;
}
export const MachineLearningProductLastModifiedDateFilterDateRange = S.suspend(
  () =>
    S.Struct({
      AfterValue: S.optional(S.String),
      BeforeValue: S.optional(S.String),
    }),
).annotations({
  identifier: "MachineLearningProductLastModifiedDateFilterDateRange",
}) as any as S.Schema<MachineLearningProductLastModifiedDateFilterDateRange>;
export interface OfferSetReleaseDateFilterDateRange {
  AfterValue?: string;
  BeforeValue?: string;
}
export const OfferSetReleaseDateFilterDateRange = S.suspend(() =>
  S.Struct({
    AfterValue: S.optional(S.String),
    BeforeValue: S.optional(S.String),
  }),
).annotations({
  identifier: "OfferSetReleaseDateFilterDateRange",
}) as any as S.Schema<OfferSetReleaseDateFilterDateRange>;
export interface OfferSetLastModifiedDateFilterDateRange {
  AfterValue?: string;
  BeforeValue?: string;
}
export const OfferSetLastModifiedDateFilterDateRange = S.suspend(() =>
  S.Struct({
    AfterValue: S.optional(S.String),
    BeforeValue: S.optional(S.String),
  }),
).annotations({
  identifier: "OfferSetLastModifiedDateFilterDateRange",
}) as any as S.Schema<OfferSetLastModifiedDateFilterDateRange>;
export interface ChangeSummary {
  ChangeType?: string;
  Entity?: Entity;
  Details?: string;
  DetailsDocument?: any;
  ErrorDetailList?: ErrorDetail[];
  ChangeName?: string;
}
export const ChangeSummary = S.suspend(() =>
  S.Struct({
    ChangeType: S.optional(S.String),
    Entity: S.optional(Entity),
    Details: S.optional(S.String),
    DetailsDocument: S.optional(S.Any),
    ErrorDetailList: S.optional(ErrorDetailList),
    ChangeName: S.optional(S.String),
  }),
).annotations({
  identifier: "ChangeSummary",
}) as any as S.Schema<ChangeSummary>;
export type ChangeSetDescription = ChangeSummary[];
export const ChangeSetDescription = S.Array(ChangeSummary);
export interface ChangeSetSummaryListItem {
  ChangeSetId?: string;
  ChangeSetArn?: string;
  ChangeSetName?: string;
  StartTime?: string;
  EndTime?: string;
  Status?: ChangeStatus;
  EntityIdList?: string[];
  FailureCode?: FailureCode;
}
export const ChangeSetSummaryListItem = S.suspend(() =>
  S.Struct({
    ChangeSetId: S.optional(S.String),
    ChangeSetArn: S.optional(S.String),
    ChangeSetName: S.optional(S.String),
    StartTime: S.optional(S.String),
    EndTime: S.optional(S.String),
    Status: S.optional(ChangeStatus),
    EntityIdList: S.optional(ResourceIdList),
    FailureCode: S.optional(FailureCode),
  }),
).annotations({
  identifier: "ChangeSetSummaryListItem",
}) as any as S.Schema<ChangeSetSummaryListItem>;
export type ChangeSetSummaryList = ChangeSetSummaryListItem[];
export const ChangeSetSummaryList = S.Array(ChangeSetSummaryListItem);
export interface DataProductLastModifiedDateFilter {
  DateRange?: DataProductLastModifiedDateFilterDateRange;
}
export const DataProductLastModifiedDateFilter = S.suspend(() =>
  S.Struct({
    DateRange: S.optional(DataProductLastModifiedDateFilterDateRange),
  }),
).annotations({
  identifier: "DataProductLastModifiedDateFilter",
}) as any as S.Schema<DataProductLastModifiedDateFilter>;
export interface SaaSProductLastModifiedDateFilter {
  DateRange?: SaaSProductLastModifiedDateFilterDateRange;
}
export const SaaSProductLastModifiedDateFilter = S.suspend(() =>
  S.Struct({
    DateRange: S.optional(SaaSProductLastModifiedDateFilterDateRange),
  }),
).annotations({
  identifier: "SaaSProductLastModifiedDateFilter",
}) as any as S.Schema<SaaSProductLastModifiedDateFilter>;
export interface AmiProductLastModifiedDateFilter {
  DateRange?: AmiProductLastModifiedDateFilterDateRange;
}
export const AmiProductLastModifiedDateFilter = S.suspend(() =>
  S.Struct({
    DateRange: S.optional(AmiProductLastModifiedDateFilterDateRange),
  }),
).annotations({
  identifier: "AmiProductLastModifiedDateFilter",
}) as any as S.Schema<AmiProductLastModifiedDateFilter>;
export interface OfferReleaseDateFilter {
  DateRange?: OfferReleaseDateFilterDateRange;
}
export const OfferReleaseDateFilter = S.suspend(() =>
  S.Struct({ DateRange: S.optional(OfferReleaseDateFilterDateRange) }),
).annotations({
  identifier: "OfferReleaseDateFilter",
}) as any as S.Schema<OfferReleaseDateFilter>;
export interface OfferAvailabilityEndDateFilter {
  DateRange?: OfferAvailabilityEndDateFilterDateRange;
}
export const OfferAvailabilityEndDateFilter = S.suspend(() =>
  S.Struct({ DateRange: S.optional(OfferAvailabilityEndDateFilterDateRange) }),
).annotations({
  identifier: "OfferAvailabilityEndDateFilter",
}) as any as S.Schema<OfferAvailabilityEndDateFilter>;
export interface OfferLastModifiedDateFilter {
  DateRange?: OfferLastModifiedDateFilterDateRange;
}
export const OfferLastModifiedDateFilter = S.suspend(() =>
  S.Struct({ DateRange: S.optional(OfferLastModifiedDateFilterDateRange) }),
).annotations({
  identifier: "OfferLastModifiedDateFilter",
}) as any as S.Schema<OfferLastModifiedDateFilter>;
export interface ContainerProductLastModifiedDateFilter {
  DateRange?: ContainerProductLastModifiedDateFilterDateRange;
}
export const ContainerProductLastModifiedDateFilter = S.suspend(() =>
  S.Struct({
    DateRange: S.optional(ContainerProductLastModifiedDateFilterDateRange),
  }),
).annotations({
  identifier: "ContainerProductLastModifiedDateFilter",
}) as any as S.Schema<ContainerProductLastModifiedDateFilter>;
export interface ResaleAuthorizationCreatedDateFilter {
  DateRange?: ResaleAuthorizationCreatedDateFilterDateRange;
  ValueList?: string[];
}
export const ResaleAuthorizationCreatedDateFilter = S.suspend(() =>
  S.Struct({
    DateRange: S.optional(ResaleAuthorizationCreatedDateFilterDateRange),
    ValueList: S.optional(ResaleAuthorizationCreatedDateFilterValueList),
  }),
).annotations({
  identifier: "ResaleAuthorizationCreatedDateFilter",
}) as any as S.Schema<ResaleAuthorizationCreatedDateFilter>;
export interface ResaleAuthorizationAvailabilityEndDateFilter {
  DateRange?: ResaleAuthorizationAvailabilityEndDateFilterDateRange;
  ValueList?: string[];
}
export const ResaleAuthorizationAvailabilityEndDateFilter = S.suspend(() =>
  S.Struct({
    DateRange: S.optional(
      ResaleAuthorizationAvailabilityEndDateFilterDateRange,
    ),
    ValueList: S.optional(
      ResaleAuthorizationAvailabilityEndDateFilterValueList,
    ),
  }),
).annotations({
  identifier: "ResaleAuthorizationAvailabilityEndDateFilter",
}) as any as S.Schema<ResaleAuthorizationAvailabilityEndDateFilter>;
export interface ResaleAuthorizationLastModifiedDateFilter {
  DateRange?: ResaleAuthorizationLastModifiedDateFilterDateRange;
}
export const ResaleAuthorizationLastModifiedDateFilter = S.suspend(() =>
  S.Struct({
    DateRange: S.optional(ResaleAuthorizationLastModifiedDateFilterDateRange),
  }),
).annotations({
  identifier: "ResaleAuthorizationLastModifiedDateFilter",
}) as any as S.Schema<ResaleAuthorizationLastModifiedDateFilter>;
export interface MachineLearningProductLastModifiedDateFilter {
  DateRange?: MachineLearningProductLastModifiedDateFilterDateRange;
}
export const MachineLearningProductLastModifiedDateFilter = S.suspend(() =>
  S.Struct({
    DateRange: S.optional(
      MachineLearningProductLastModifiedDateFilterDateRange,
    ),
  }),
).annotations({
  identifier: "MachineLearningProductLastModifiedDateFilter",
}) as any as S.Schema<MachineLearningProductLastModifiedDateFilter>;
export interface OfferSetReleaseDateFilter {
  DateRange?: OfferSetReleaseDateFilterDateRange;
}
export const OfferSetReleaseDateFilter = S.suspend(() =>
  S.Struct({ DateRange: S.optional(OfferSetReleaseDateFilterDateRange) }),
).annotations({
  identifier: "OfferSetReleaseDateFilter",
}) as any as S.Schema<OfferSetReleaseDateFilter>;
export interface OfferSetLastModifiedDateFilter {
  DateRange?: OfferSetLastModifiedDateFilterDateRange;
}
export const OfferSetLastModifiedDateFilter = S.suspend(() =>
  S.Struct({ DateRange: S.optional(OfferSetLastModifiedDateFilterDateRange) }),
).annotations({
  identifier: "OfferSetLastModifiedDateFilter",
}) as any as S.Schema<OfferSetLastModifiedDateFilter>;
export interface DescribeChangeSetResponse {
  ChangeSetId?: string;
  ChangeSetArn?: string;
  ChangeSetName?: string;
  Intent?: Intent;
  StartTime?: string;
  EndTime?: string;
  Status?: ChangeStatus;
  FailureCode?: FailureCode;
  FailureDescription?: string;
  ChangeSet?: ChangeSummary[];
}
export const DescribeChangeSetResponse = S.suspend(() =>
  S.Struct({
    ChangeSetId: S.optional(S.String),
    ChangeSetArn: S.optional(S.String),
    ChangeSetName: S.optional(S.String),
    Intent: S.optional(Intent),
    StartTime: S.optional(S.String),
    EndTime: S.optional(S.String),
    Status: S.optional(ChangeStatus),
    FailureCode: S.optional(FailureCode),
    FailureDescription: S.optional(S.String),
    ChangeSet: S.optional(ChangeSetDescription),
  }),
).annotations({
  identifier: "DescribeChangeSetResponse",
}) as any as S.Schema<DescribeChangeSetResponse>;
export interface ListChangeSetsResponse {
  ChangeSetSummaryList?: ChangeSetSummaryListItem[];
  NextToken?: string;
}
export const ListChangeSetsResponse = S.suspend(() =>
  S.Struct({
    ChangeSetSummaryList: S.optional(ChangeSetSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListChangeSetsResponse",
}) as any as S.Schema<ListChangeSetsResponse>;
export interface StartChangeSetResponse {
  ChangeSetId?: string;
  ChangeSetArn?: string;
}
export const StartChangeSetResponse = S.suspend(() =>
  S.Struct({
    ChangeSetId: S.optional(S.String),
    ChangeSetArn: S.optional(S.String),
  }),
).annotations({
  identifier: "StartChangeSetResponse",
}) as any as S.Schema<StartChangeSetResponse>;
export interface EntityDetail {
  EntityType?: string;
  EntityArn?: string;
  EntityIdentifier?: string;
  LastModifiedDate?: string;
  DetailsDocument?: any;
}
export const EntityDetail = S.suspend(() =>
  S.Struct({
    EntityType: S.optional(S.String),
    EntityArn: S.optional(S.String),
    EntityIdentifier: S.optional(S.String),
    LastModifiedDate: S.optional(S.String),
    DetailsDocument: S.optional(S.Any),
  }),
).annotations({ identifier: "EntityDetail" }) as any as S.Schema<EntityDetail>;
export interface BatchDescribeErrorDetail {
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const BatchDescribeErrorDetail = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchDescribeErrorDetail",
}) as any as S.Schema<BatchDescribeErrorDetail>;
export interface DataProductFilters {
  EntityId?: DataProductEntityIdFilter;
  ProductTitle?: DataProductTitleFilter;
  Visibility?: DataProductVisibilityFilter;
  LastModifiedDate?: DataProductLastModifiedDateFilter;
}
export const DataProductFilters = S.suspend(() =>
  S.Struct({
    EntityId: S.optional(DataProductEntityIdFilter),
    ProductTitle: S.optional(DataProductTitleFilter),
    Visibility: S.optional(DataProductVisibilityFilter),
    LastModifiedDate: S.optional(DataProductLastModifiedDateFilter),
  }),
).annotations({
  identifier: "DataProductFilters",
}) as any as S.Schema<DataProductFilters>;
export interface SaaSProductFilters {
  EntityId?: SaaSProductEntityIdFilter;
  ProductTitle?: SaaSProductTitleFilter;
  Visibility?: SaaSProductVisibilityFilter;
  LastModifiedDate?: SaaSProductLastModifiedDateFilter;
}
export const SaaSProductFilters = S.suspend(() =>
  S.Struct({
    EntityId: S.optional(SaaSProductEntityIdFilter),
    ProductTitle: S.optional(SaaSProductTitleFilter),
    Visibility: S.optional(SaaSProductVisibilityFilter),
    LastModifiedDate: S.optional(SaaSProductLastModifiedDateFilter),
  }),
).annotations({
  identifier: "SaaSProductFilters",
}) as any as S.Schema<SaaSProductFilters>;
export interface AmiProductFilters {
  EntityId?: AmiProductEntityIdFilter;
  LastModifiedDate?: AmiProductLastModifiedDateFilter;
  ProductTitle?: AmiProductTitleFilter;
  Visibility?: AmiProductVisibilityFilter;
}
export const AmiProductFilters = S.suspend(() =>
  S.Struct({
    EntityId: S.optional(AmiProductEntityIdFilter),
    LastModifiedDate: S.optional(AmiProductLastModifiedDateFilter),
    ProductTitle: S.optional(AmiProductTitleFilter),
    Visibility: S.optional(AmiProductVisibilityFilter),
  }),
).annotations({
  identifier: "AmiProductFilters",
}) as any as S.Schema<AmiProductFilters>;
export interface OfferFilters {
  EntityId?: OfferEntityIdFilter;
  Name?: OfferNameFilter;
  ProductId?: OfferProductIdFilter;
  ResaleAuthorizationId?: OfferResaleAuthorizationIdFilter;
  ReleaseDate?: OfferReleaseDateFilter;
  AvailabilityEndDate?: OfferAvailabilityEndDateFilter;
  BuyerAccounts?: OfferBuyerAccountsFilter;
  State?: OfferStateFilter;
  Targeting?: OfferTargetingFilter;
  LastModifiedDate?: OfferLastModifiedDateFilter;
  OfferSetId?: OfferSetIdFilter;
}
export const OfferFilters = S.suspend(() =>
  S.Struct({
    EntityId: S.optional(OfferEntityIdFilter),
    Name: S.optional(OfferNameFilter),
    ProductId: S.optional(OfferProductIdFilter),
    ResaleAuthorizationId: S.optional(OfferResaleAuthorizationIdFilter),
    ReleaseDate: S.optional(OfferReleaseDateFilter),
    AvailabilityEndDate: S.optional(OfferAvailabilityEndDateFilter),
    BuyerAccounts: S.optional(OfferBuyerAccountsFilter),
    State: S.optional(OfferStateFilter),
    Targeting: S.optional(OfferTargetingFilter),
    LastModifiedDate: S.optional(OfferLastModifiedDateFilter),
    OfferSetId: S.optional(OfferSetIdFilter),
  }),
).annotations({ identifier: "OfferFilters" }) as any as S.Schema<OfferFilters>;
export interface ContainerProductFilters {
  EntityId?: ContainerProductEntityIdFilter;
  LastModifiedDate?: ContainerProductLastModifiedDateFilter;
  ProductTitle?: ContainerProductTitleFilter;
  Visibility?: ContainerProductVisibilityFilter;
}
export const ContainerProductFilters = S.suspend(() =>
  S.Struct({
    EntityId: S.optional(ContainerProductEntityIdFilter),
    LastModifiedDate: S.optional(ContainerProductLastModifiedDateFilter),
    ProductTitle: S.optional(ContainerProductTitleFilter),
    Visibility: S.optional(ContainerProductVisibilityFilter),
  }),
).annotations({
  identifier: "ContainerProductFilters",
}) as any as S.Schema<ContainerProductFilters>;
export interface ResaleAuthorizationFilters {
  EntityId?: ResaleAuthorizationEntityIdFilter;
  Name?: ResaleAuthorizationNameFilter;
  ProductId?: ResaleAuthorizationProductIdFilter;
  CreatedDate?: ResaleAuthorizationCreatedDateFilter;
  AvailabilityEndDate?: ResaleAuthorizationAvailabilityEndDateFilter;
  ManufacturerAccountId?: ResaleAuthorizationManufacturerAccountIdFilter;
  ProductName?: ResaleAuthorizationProductNameFilter;
  ManufacturerLegalName?: ResaleAuthorizationManufacturerLegalNameFilter;
  ResellerAccountID?: ResaleAuthorizationResellerAccountIDFilter;
  ResellerLegalName?: ResaleAuthorizationResellerLegalNameFilter;
  Status?: ResaleAuthorizationStatusFilter;
  OfferExtendedStatus?: ResaleAuthorizationOfferExtendedStatusFilter;
  LastModifiedDate?: ResaleAuthorizationLastModifiedDateFilter;
}
export const ResaleAuthorizationFilters = S.suspend(() =>
  S.Struct({
    EntityId: S.optional(ResaleAuthorizationEntityIdFilter),
    Name: S.optional(ResaleAuthorizationNameFilter),
    ProductId: S.optional(ResaleAuthorizationProductIdFilter),
    CreatedDate: S.optional(ResaleAuthorizationCreatedDateFilter),
    AvailabilityEndDate: S.optional(
      ResaleAuthorizationAvailabilityEndDateFilter,
    ),
    ManufacturerAccountId: S.optional(
      ResaleAuthorizationManufacturerAccountIdFilter,
    ),
    ProductName: S.optional(ResaleAuthorizationProductNameFilter),
    ManufacturerLegalName: S.optional(
      ResaleAuthorizationManufacturerLegalNameFilter,
    ),
    ResellerAccountID: S.optional(ResaleAuthorizationResellerAccountIDFilter),
    ResellerLegalName: S.optional(ResaleAuthorizationResellerLegalNameFilter),
    Status: S.optional(ResaleAuthorizationStatusFilter),
    OfferExtendedStatus: S.optional(
      ResaleAuthorizationOfferExtendedStatusFilter,
    ),
    LastModifiedDate: S.optional(ResaleAuthorizationLastModifiedDateFilter),
  }),
).annotations({
  identifier: "ResaleAuthorizationFilters",
}) as any as S.Schema<ResaleAuthorizationFilters>;
export interface MachineLearningProductFilters {
  EntityId?: MachineLearningProductEntityIdFilter;
  LastModifiedDate?: MachineLearningProductLastModifiedDateFilter;
  ProductTitle?: MachineLearningProductTitleFilter;
  Visibility?: MachineLearningProductVisibilityFilter;
}
export const MachineLearningProductFilters = S.suspend(() =>
  S.Struct({
    EntityId: S.optional(MachineLearningProductEntityIdFilter),
    LastModifiedDate: S.optional(MachineLearningProductLastModifiedDateFilter),
    ProductTitle: S.optional(MachineLearningProductTitleFilter),
    Visibility: S.optional(MachineLearningProductVisibilityFilter),
  }),
).annotations({
  identifier: "MachineLearningProductFilters",
}) as any as S.Schema<MachineLearningProductFilters>;
export interface OfferSetFilters {
  EntityId?: OfferSetEntityIdFilter;
  Name?: OfferSetNameFilter;
  State?: OfferSetStateFilter;
  ReleaseDate?: OfferSetReleaseDateFilter;
  AssociatedOfferIds?: OfferSetAssociatedOfferIdsFilter;
  SolutionId?: OfferSetSolutionIdFilter;
  LastModifiedDate?: OfferSetLastModifiedDateFilter;
}
export const OfferSetFilters = S.suspend(() =>
  S.Struct({
    EntityId: S.optional(OfferSetEntityIdFilter),
    Name: S.optional(OfferSetNameFilter),
    State: S.optional(OfferSetStateFilter),
    ReleaseDate: S.optional(OfferSetReleaseDateFilter),
    AssociatedOfferIds: S.optional(OfferSetAssociatedOfferIdsFilter),
    SolutionId: S.optional(OfferSetSolutionIdFilter),
    LastModifiedDate: S.optional(OfferSetLastModifiedDateFilter),
  }),
).annotations({
  identifier: "OfferSetFilters",
}) as any as S.Schema<OfferSetFilters>;
export type EntityDetails = { [key: string]: EntityDetail | undefined };
export const EntityDetails = S.Record({
  key: S.String,
  value: S.UndefinedOr(EntityDetail),
});
export type Errors = { [key: string]: BatchDescribeErrorDetail | undefined };
export const Errors = S.Record({
  key: S.String,
  value: S.UndefinedOr(BatchDescribeErrorDetail),
});
export type EntityTypeFilters =
  | {
      DataProductFilters: DataProductFilters;
      SaaSProductFilters?: never;
      AmiProductFilters?: never;
      OfferFilters?: never;
      ContainerProductFilters?: never;
      ResaleAuthorizationFilters?: never;
      MachineLearningProductFilters?: never;
      OfferSetFilters?: never;
    }
  | {
      DataProductFilters?: never;
      SaaSProductFilters: SaaSProductFilters;
      AmiProductFilters?: never;
      OfferFilters?: never;
      ContainerProductFilters?: never;
      ResaleAuthorizationFilters?: never;
      MachineLearningProductFilters?: never;
      OfferSetFilters?: never;
    }
  | {
      DataProductFilters?: never;
      SaaSProductFilters?: never;
      AmiProductFilters: AmiProductFilters;
      OfferFilters?: never;
      ContainerProductFilters?: never;
      ResaleAuthorizationFilters?: never;
      MachineLearningProductFilters?: never;
      OfferSetFilters?: never;
    }
  | {
      DataProductFilters?: never;
      SaaSProductFilters?: never;
      AmiProductFilters?: never;
      OfferFilters: OfferFilters;
      ContainerProductFilters?: never;
      ResaleAuthorizationFilters?: never;
      MachineLearningProductFilters?: never;
      OfferSetFilters?: never;
    }
  | {
      DataProductFilters?: never;
      SaaSProductFilters?: never;
      AmiProductFilters?: never;
      OfferFilters?: never;
      ContainerProductFilters: ContainerProductFilters;
      ResaleAuthorizationFilters?: never;
      MachineLearningProductFilters?: never;
      OfferSetFilters?: never;
    }
  | {
      DataProductFilters?: never;
      SaaSProductFilters?: never;
      AmiProductFilters?: never;
      OfferFilters?: never;
      ContainerProductFilters?: never;
      ResaleAuthorizationFilters: ResaleAuthorizationFilters;
      MachineLearningProductFilters?: never;
      OfferSetFilters?: never;
    }
  | {
      DataProductFilters?: never;
      SaaSProductFilters?: never;
      AmiProductFilters?: never;
      OfferFilters?: never;
      ContainerProductFilters?: never;
      ResaleAuthorizationFilters?: never;
      MachineLearningProductFilters: MachineLearningProductFilters;
      OfferSetFilters?: never;
    }
  | {
      DataProductFilters?: never;
      SaaSProductFilters?: never;
      AmiProductFilters?: never;
      OfferFilters?: never;
      ContainerProductFilters?: never;
      ResaleAuthorizationFilters?: never;
      MachineLearningProductFilters?: never;
      OfferSetFilters: OfferSetFilters;
    };
export const EntityTypeFilters = S.Union(
  S.Struct({ DataProductFilters: DataProductFilters }),
  S.Struct({ SaaSProductFilters: SaaSProductFilters }),
  S.Struct({ AmiProductFilters: AmiProductFilters }),
  S.Struct({ OfferFilters: OfferFilters }),
  S.Struct({ ContainerProductFilters: ContainerProductFilters }),
  S.Struct({ ResaleAuthorizationFilters: ResaleAuthorizationFilters }),
  S.Struct({ MachineLearningProductFilters: MachineLearningProductFilters }),
  S.Struct({ OfferSetFilters: OfferSetFilters }),
);
export interface BatchDescribeEntitiesResponse {
  EntityDetails?: { [key: string]: EntityDetail | undefined };
  Errors?: { [key: string]: BatchDescribeErrorDetail | undefined };
}
export const BatchDescribeEntitiesResponse = S.suspend(() =>
  S.Struct({
    EntityDetails: S.optional(EntityDetails),
    Errors: S.optional(Errors),
  }),
).annotations({
  identifier: "BatchDescribeEntitiesResponse",
}) as any as S.Schema<BatchDescribeEntitiesResponse>;
export interface ListEntitiesRequest {
  Catalog: string;
  EntityType: string;
  FilterList?: Filter[];
  Sort?: Sort;
  NextToken?: string;
  MaxResults?: number;
  OwnershipType?: OwnershipType;
  EntityTypeFilters?: EntityTypeFilters;
  EntityTypeSort?: EntityTypeSort;
}
export const ListEntitiesRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    EntityType: S.String,
    FilterList: S.optional(FilterList),
    Sort: S.optional(Sort),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    OwnershipType: S.optional(OwnershipType),
    EntityTypeFilters: S.optional(EntityTypeFilters),
    EntityTypeSort: S.optional(EntityTypeSort),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListEntities" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEntitiesRequest",
}) as any as S.Schema<ListEntitiesRequest>;
export type OfferBuyerAccountsList = string[];
export const OfferBuyerAccountsList = S.Array(S.String);
export type OfferTargetingList = OfferTargetingString[];
export const OfferTargetingList = S.Array(OfferTargetingString);
export type OfferSetAssociatedOfferIdsList = string[];
export const OfferSetAssociatedOfferIdsList = S.Array(S.String);
export interface AmiProductSummary {
  ProductTitle?: string;
  Visibility?: AmiProductVisibilityString;
}
export const AmiProductSummary = S.suspend(() =>
  S.Struct({
    ProductTitle: S.optional(S.String),
    Visibility: S.optional(AmiProductVisibilityString),
  }),
).annotations({
  identifier: "AmiProductSummary",
}) as any as S.Schema<AmiProductSummary>;
export interface ContainerProductSummary {
  ProductTitle?: string;
  Visibility?: ContainerProductVisibilityString;
}
export const ContainerProductSummary = S.suspend(() =>
  S.Struct({
    ProductTitle: S.optional(S.String),
    Visibility: S.optional(ContainerProductVisibilityString),
  }),
).annotations({
  identifier: "ContainerProductSummary",
}) as any as S.Schema<ContainerProductSummary>;
export interface DataProductSummary {
  ProductTitle?: string;
  Visibility?: DataProductVisibilityString;
}
export const DataProductSummary = S.suspend(() =>
  S.Struct({
    ProductTitle: S.optional(S.String),
    Visibility: S.optional(DataProductVisibilityString),
  }),
).annotations({
  identifier: "DataProductSummary",
}) as any as S.Schema<DataProductSummary>;
export interface SaaSProductSummary {
  ProductTitle?: string;
  Visibility?: SaaSProductVisibilityString;
}
export const SaaSProductSummary = S.suspend(() =>
  S.Struct({
    ProductTitle: S.optional(S.String),
    Visibility: S.optional(SaaSProductVisibilityString),
  }),
).annotations({
  identifier: "SaaSProductSummary",
}) as any as S.Schema<SaaSProductSummary>;
export interface OfferSummary {
  Name?: string;
  ProductId?: string;
  ResaleAuthorizationId?: string;
  ReleaseDate?: string;
  AvailabilityEndDate?: string;
  BuyerAccounts?: string[];
  State?: OfferStateString;
  Targeting?: OfferTargetingString[];
  OfferSetId?: string;
}
export const OfferSummary = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    ProductId: S.optional(S.String),
    ResaleAuthorizationId: S.optional(S.String),
    ReleaseDate: S.optional(S.String),
    AvailabilityEndDate: S.optional(S.String),
    BuyerAccounts: S.optional(OfferBuyerAccountsList),
    State: S.optional(OfferStateString),
    Targeting: S.optional(OfferTargetingList),
    OfferSetId: S.optional(S.String),
  }),
).annotations({ identifier: "OfferSummary" }) as any as S.Schema<OfferSummary>;
export interface ResaleAuthorizationSummary {
  Name?: string;
  ProductId?: string;
  ProductName?: string;
  ManufacturerAccountId?: string;
  ManufacturerLegalName?: string;
  ResellerAccountID?: string;
  ResellerLegalName?: string;
  Status?: ResaleAuthorizationStatusString;
  OfferExtendedStatus?: string;
  CreatedDate?: string;
  AvailabilityEndDate?: string;
}
export const ResaleAuthorizationSummary = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    ProductId: S.optional(S.String),
    ProductName: S.optional(S.String),
    ManufacturerAccountId: S.optional(S.String),
    ManufacturerLegalName: S.optional(S.String),
    ResellerAccountID: S.optional(S.String),
    ResellerLegalName: S.optional(S.String),
    Status: S.optional(ResaleAuthorizationStatusString),
    OfferExtendedStatus: S.optional(S.String),
    CreatedDate: S.optional(S.String),
    AvailabilityEndDate: S.optional(S.String),
  }),
).annotations({
  identifier: "ResaleAuthorizationSummary",
}) as any as S.Schema<ResaleAuthorizationSummary>;
export interface MachineLearningProductSummary {
  ProductTitle?: string;
  Visibility?: MachineLearningProductVisibilityString;
}
export const MachineLearningProductSummary = S.suspend(() =>
  S.Struct({
    ProductTitle: S.optional(S.String),
    Visibility: S.optional(MachineLearningProductVisibilityString),
  }),
).annotations({
  identifier: "MachineLearningProductSummary",
}) as any as S.Schema<MachineLearningProductSummary>;
export interface OfferSetSummary {
  Name?: string;
  State?: OfferSetStateString;
  ReleaseDate?: string;
  AssociatedOfferIds?: string[];
  SolutionId?: string;
}
export const OfferSetSummary = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    State: S.optional(OfferSetStateString),
    ReleaseDate: S.optional(S.String),
    AssociatedOfferIds: S.optional(OfferSetAssociatedOfferIdsList),
    SolutionId: S.optional(S.String),
  }),
).annotations({
  identifier: "OfferSetSummary",
}) as any as S.Schema<OfferSetSummary>;
export interface EntitySummary {
  Name?: string;
  EntityType?: string;
  EntityId?: string;
  EntityArn?: string;
  LastModifiedDate?: string;
  Visibility?: string;
  AmiProductSummary?: AmiProductSummary;
  ContainerProductSummary?: ContainerProductSummary;
  DataProductSummary?: DataProductSummary;
  SaaSProductSummary?: SaaSProductSummary;
  OfferSummary?: OfferSummary;
  ResaleAuthorizationSummary?: ResaleAuthorizationSummary;
  MachineLearningProductSummary?: MachineLearningProductSummary;
  OfferSetSummary?: OfferSetSummary;
}
export const EntitySummary = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    EntityType: S.optional(S.String),
    EntityId: S.optional(S.String),
    EntityArn: S.optional(S.String),
    LastModifiedDate: S.optional(S.String),
    Visibility: S.optional(S.String),
    AmiProductSummary: S.optional(AmiProductSummary),
    ContainerProductSummary: S.optional(ContainerProductSummary),
    DataProductSummary: S.optional(DataProductSummary),
    SaaSProductSummary: S.optional(SaaSProductSummary),
    OfferSummary: S.optional(OfferSummary),
    ResaleAuthorizationSummary: S.optional(ResaleAuthorizationSummary),
    MachineLearningProductSummary: S.optional(MachineLearningProductSummary),
    OfferSetSummary: S.optional(OfferSetSummary),
  }),
).annotations({
  identifier: "EntitySummary",
}) as any as S.Schema<EntitySummary>;
export type EntitySummaryList = EntitySummary[];
export const EntitySummaryList = S.Array(EntitySummary);
export interface ListEntitiesResponse {
  EntitySummaryList?: EntitySummary[];
  NextToken?: string;
}
export const ListEntitiesResponse = S.suspend(() =>
  S.Struct({
    EntitySummaryList: S.optional(EntitySummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEntitiesResponse",
}) as any as S.Schema<ListEntitiesResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { Message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ResourceNotSupportedException extends S.TaggedError<ResourceNotSupportedException>()(
  "ResourceNotSupportedException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Deletes a resource-based policy on an entity that is identified by its resource
 * ARN.
 */
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyRequest,
) => effect.Effect<
  DeleteResourcePolicyResponse,
  | AccessDeniedException
  | InternalServiceException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePolicyRequest,
  output: DeleteResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the metadata and content of the entity.
 */
export const describeEntity: (
  input: DescribeEntityRequest,
) => effect.Effect<
  DescribeEntityResponse,
  | AccessDeniedException
  | InternalServiceException
  | ResourceNotFoundException
  | ResourceNotSupportedException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEntityRequest,
  output: DescribeEntityResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    ResourceNotFoundException,
    ResourceNotSupportedException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provides information about a given change set.
 */
export const describeChangeSet: (
  input: DescribeChangeSetRequest,
) => effect.Effect<
  DescribeChangeSetResponse,
  | AccessDeniedException
  | InternalServiceException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeChangeSetRequest,
  output: DescribeChangeSetResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the list of change sets owned by the account being used to make the call. You
 * can filter this list by providing any combination of `entityId`,
 * `ChangeSetName`, and status. If you provide more than one filter, the API
 * operation applies a logical AND between the filters.
 *
 * You can describe a change during the 60-day request history retention period for API
 * calls.
 */
export const listChangeSets: {
  (
    input: ListChangeSetsRequest,
  ): effect.Effect<
    ListChangeSetsResponse,
    | AccessDeniedException
    | InternalServiceException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChangeSetsRequest,
  ) => stream.Stream<
    ListChangeSetsResponse,
    | AccessDeniedException
    | InternalServiceException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChangeSetsRequest,
  ) => stream.Stream<
    ChangeSetSummaryListItem,
    | AccessDeniedException
    | InternalServiceException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChangeSetsRequest,
  output: ListChangeSetsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ChangeSetSummaryList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Used to cancel an open change request. Must be sent before the status of the request
 * changes to `APPLYING`, the final stage of completing your change request. You
 * can describe a change during the 60-day request history retention period for API
 * calls.
 */
export const cancelChangeSet: (
  input: CancelChangeSetRequest,
) => effect.Effect<
  CancelChangeSetResponse,
  | AccessDeniedException
  | InternalServiceException
  | ResourceInUseException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelChangeSetRequest,
  output: CancelChangeSetResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a resource-based policy of an entity that is identified by its resource
 * ARN.
 */
export const getResourcePolicy: (
  input: GetResourcePolicyRequest,
) => effect.Effect<
  GetResourcePolicyResponse,
  | AccessDeniedException
  | InternalServiceException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all tags that have been added to a resource (either an entity or change set).
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServiceException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Attaches a resource-based policy to an entity. Examples of an entity include:
 * `AmiProduct` and `ContainerProduct`.
 */
export const putResourcePolicy: (
  input: PutResourcePolicyRequest,
) => effect.Effect<
  PutResourcePolicyResponse,
  | AccessDeniedException
  | InternalServiceException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Tags a resource (either an entity or change set).
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServiceException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a tag or list of tags from a resource (either an entity or change set).
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | InternalServiceException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns metadata and content for multiple entities. This is the Batch version of the `DescribeEntity` API and uses the same IAM permission action as `DescribeEntity` API.
 */
export const batchDescribeEntities: (
  input: BatchDescribeEntitiesRequest,
) => effect.Effect<
  BatchDescribeEntitiesResponse,
  | AccessDeniedException
  | InternalServiceException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDescribeEntitiesRequest,
  output: BatchDescribeEntitiesResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Allows you to request changes for your entities. Within a single
 * `ChangeSet`, you can't start the same change type against the same entity
 * multiple times. Additionally, when a `ChangeSet` is running, all the entities
 * targeted by the different changes are locked until the change set has completed (either
 * succeeded, cancelled, or failed). If you try to start a change set containing a change
 * against an entity that is already locked, you will receive a
 * `ResourceInUseException` error.
 *
 * For example, you can't start the `ChangeSet` described in the example later in this topic because it contains two changes to run the same
 * change type (`AddRevisions`) against the same entity
 * (`entity-id@1`).
 *
 * For more information about working with change sets, see Working with change sets. For information about change types for
 * single-AMI products, see Working with single-AMI products. Also, for more information about change
 * types available for container-based products, see Working with container products.
 *
 * To download "DetailsDocument" shapes, see Python
 * and Java shapes on GitHub.
 */
export const startChangeSet: (
  input: StartChangeSetRequest,
) => effect.Effect<
  StartChangeSetResponse,
  | AccessDeniedException
  | InternalServiceException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartChangeSetRequest,
  output: StartChangeSetResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provides the list of entities of a given type.
 */
export const listEntities: {
  (
    input: ListEntitiesRequest,
  ): effect.Effect<
    ListEntitiesResponse,
    | AccessDeniedException
    | InternalServiceException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEntitiesRequest,
  ) => stream.Stream<
    ListEntitiesResponse,
    | AccessDeniedException
    | InternalServiceException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEntitiesRequest,
  ) => stream.Stream<
    EntitySummary,
    | AccessDeniedException
    | InternalServiceException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEntitiesRequest,
  output: ListEntitiesResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "EntitySummaryList",
    pageSize: "MaxResults",
  } as const,
}));
