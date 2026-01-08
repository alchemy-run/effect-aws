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
  sdkId: "PartnerCentral Benefits",
  serviceShapeName: "PartnerCentralBenefitsService",
});
const auth = T.AwsAuthSigv4({ name: "partnercentral-benefits" });
const ver = T.ServiceVersion("2018-05-10");
const proto = T.AwsProtocolsAwsJson1_0();
const rules = T.EndpointResolver((p, _) => {
  const { UseFIPS = false, Endpoint, Region } = p;
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
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true) {
          return e(
            `https://partnercentral-benefits-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        return e(
          `https://partnercentral-benefits.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type CatalogName = string;
export type BenefitApplicationIdentifier = string;
export type Arn = string;
export type BenefitApplicationName = string;
export type BenefitApplicationDescription = string;
export type BenefitAllocationIdentifier = string;
export type BenefitId = string;
export type Program = string;
export type BenefitApplicationStage = string;
export type TaggableResourceArn = string;
export type TagKey = string;
export type TagValue = string;
export type ContactEmail = string | Redacted.Redacted<string>;
export type ContactFirstName = string | Redacted.Redacted<string>;
export type ContactLastName = string | Redacted.Redacted<string>;
export type ContactPhone = string | Redacted.Redacted<string>;
export type FileURI = string;
export type BenefitApplicationId = string;
export type BenefitAllocationId = string;
export type BenefitAllocationArn = string;
export type StatusReasonCode = string;
export type BenefitAllocationName = string;

//# Schemas
export type FulfillmentTypes = string[];
export const FulfillmentTypes = S.Array(S.String);
export type Arns = string[];
export const Arns = S.Array(S.String);
export type BenefitIdentifiers = string[];
export const BenefitIdentifiers = S.Array(S.String);
export type BenefitApplicationIdentifierList = string[];
export const BenefitApplicationIdentifierList = S.Array(S.String);
export type BenefitAllocationStatusList = string[];
export const BenefitAllocationStatusList = S.Array(S.String);
export type Programs = string[];
export const Programs = S.Array(S.String);
export type Statuses = string[];
export const Statuses = S.Array(S.String);
export type Stages = string[];
export const Stages = S.Array(S.String);
export type BenefitStatuses = string[];
export const BenefitStatuses = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AssociateBenefitApplicationResourceInput {
  Catalog: string;
  BenefitApplicationIdentifier: string;
  ResourceArn: string;
}
export const AssociateBenefitApplicationResourceInput = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    BenefitApplicationIdentifier: S.String,
    ResourceArn: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/AssociateBenefitApplicationResource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateBenefitApplicationResourceInput",
}) as any as S.Schema<AssociateBenefitApplicationResourceInput>;
export interface CancelBenefitApplicationInput {
  Catalog: string;
  ClientToken: string;
  Identifier: string;
  Reason?: string;
}
export const CancelBenefitApplicationInput = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ClientToken: S.String,
    Identifier: S.String,
    Reason: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CancelBenefitApplication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelBenefitApplicationInput",
}) as any as S.Schema<CancelBenefitApplicationInput>;
export interface CancelBenefitApplicationOutput {}
export const CancelBenefitApplicationOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelBenefitApplicationOutput",
}) as any as S.Schema<CancelBenefitApplicationOutput>;
export interface DisassociateBenefitApplicationResourceInput {
  Catalog: string;
  BenefitApplicationIdentifier: string;
  ResourceArn: string;
}
export const DisassociateBenefitApplicationResourceInput = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    BenefitApplicationIdentifier: S.String,
    ResourceArn: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/DisassociateBenefitApplicationResource",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateBenefitApplicationResourceInput",
}) as any as S.Schema<DisassociateBenefitApplicationResourceInput>;
export interface GetBenefitInput {
  Catalog: string;
  Identifier: string;
}
export const GetBenefitInput = S.suspend(() =>
  S.Struct({ Catalog: S.String, Identifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetBenefit" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBenefitInput",
}) as any as S.Schema<GetBenefitInput>;
export interface GetBenefitAllocationInput {
  Catalog: string;
  Identifier: string;
}
export const GetBenefitAllocationInput = S.suspend(() =>
  S.Struct({ Catalog: S.String, Identifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetBenefitAllocation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBenefitAllocationInput",
}) as any as S.Schema<GetBenefitAllocationInput>;
export interface GetBenefitApplicationInput {
  Catalog: string;
  Identifier: string;
}
export const GetBenefitApplicationInput = S.suspend(() =>
  S.Struct({ Catalog: S.String, Identifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetBenefitApplication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBenefitApplicationInput",
}) as any as S.Schema<GetBenefitApplicationInput>;
export interface ListBenefitAllocationsInput {
  Catalog: string;
  FulfillmentTypes?: FulfillmentTypes;
  BenefitIdentifiers?: BenefitIdentifiers;
  BenefitApplicationIdentifiers?: BenefitApplicationIdentifierList;
  Status?: BenefitAllocationStatusList;
  MaxResults?: number;
  NextToken?: string;
}
export const ListBenefitAllocationsInput = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    FulfillmentTypes: S.optional(FulfillmentTypes),
    BenefitIdentifiers: S.optional(BenefitIdentifiers),
    BenefitApplicationIdentifiers: S.optional(BenefitApplicationIdentifierList),
    Status: S.optional(BenefitAllocationStatusList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListBenefitAllocations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBenefitAllocationsInput",
}) as any as S.Schema<ListBenefitAllocationsInput>;
export interface ListBenefitsInput {
  Catalog: string;
  Programs?: Programs;
  FulfillmentTypes?: FulfillmentTypes;
  Status?: BenefitStatuses;
  MaxResults?: number;
  NextToken?: string;
}
export const ListBenefitsInput = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Programs: S.optional(Programs),
    FulfillmentTypes: S.optional(FulfillmentTypes),
    Status: S.optional(BenefitStatuses),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListBenefits" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBenefitsInput",
}) as any as S.Schema<ListBenefitsInput>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
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
export interface RecallBenefitApplicationInput {
  Catalog: string;
  ClientToken?: string;
  Identifier: string;
  Reason: string;
}
export const RecallBenefitApplicationInput = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ClientToken: S.optional(S.String),
    Identifier: S.String,
    Reason: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/RecallBenefitApplication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RecallBenefitApplicationInput",
}) as any as S.Schema<RecallBenefitApplicationInput>;
export interface RecallBenefitApplicationOutput {}
export const RecallBenefitApplicationOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RecallBenefitApplicationOutput",
}) as any as S.Schema<RecallBenefitApplicationOutput>;
export interface SubmitBenefitApplicationInput {
  Catalog: string;
  Identifier: string;
}
export const SubmitBenefitApplicationInput = S.suspend(() =>
  S.Struct({ Catalog: S.String, Identifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/SubmitBenefitApplication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SubmitBenefitApplicationInput",
}) as any as S.Schema<SubmitBenefitApplicationInput>;
export interface SubmitBenefitApplicationOutput {}
export const SubmitBenefitApplicationOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "SubmitBenefitApplicationOutput",
}) as any as S.Schema<SubmitBenefitApplicationOutput>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export interface TagResourceRequest {
  resourceArn: string;
  tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: Tags }).pipe(
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
  resourceArn: string;
  tagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tagKeys: TagKeyList }).pipe(
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
export interface Contact {
  Email?: string | Redacted.Redacted<string>;
  FirstName?: string | Redacted.Redacted<string>;
  LastName?: string | Redacted.Redacted<string>;
  BusinessTitle?: string;
  Phone?: string | Redacted.Redacted<string>;
}
export const Contact = S.suspend(() =>
  S.Struct({
    Email: S.optional(SensitiveString),
    FirstName: S.optional(SensitiveString),
    LastName: S.optional(SensitiveString),
    BusinessTitle: S.optional(S.String),
    Phone: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Contact" }) as any as S.Schema<Contact>;
export type Contacts = Contact[];
export const Contacts = S.Array(Contact);
export interface FileInput {
  FileURI: string;
  BusinessUseCase?: string;
}
export const FileInput = S.suspend(() =>
  S.Struct({ FileURI: S.String, BusinessUseCase: S.optional(S.String) }),
).annotations({ identifier: "FileInput" }) as any as S.Schema<FileInput>;
export type FileInputDetails = FileInput[];
export const FileInputDetails = S.Array(FileInput);
export interface UpdateBenefitApplicationInput {
  Catalog: string;
  ClientToken: string;
  Name?: string;
  Description?: string;
  Identifier: string;
  Revision: string;
  BenefitApplicationDetails?: any;
  PartnerContacts?: Contacts;
  FileDetails?: FileInputDetails;
}
export const UpdateBenefitApplicationInput = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ClientToken: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Identifier: S.String,
    Revision: S.String,
    BenefitApplicationDetails: S.optional(S.Any),
    PartnerContacts: S.optional(Contacts),
    FileDetails: S.optional(FileInputDetails),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateBenefitApplication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBenefitApplicationInput",
}) as any as S.Schema<UpdateBenefitApplicationInput>;
export interface Amendment {
  FieldPath: string;
  NewValue: string;
}
export const Amendment = S.suspend(() =>
  S.Struct({ FieldPath: S.String, NewValue: S.String }),
).annotations({ identifier: "Amendment" }) as any as S.Schema<Amendment>;
export type AmendmentList = Amendment[];
export const AmendmentList = S.Array(Amendment);
export type StatusReasonCodes = string[];
export const StatusReasonCodes = S.Array(S.String);
export interface AssociatedResource {
  ResourceType?: string;
  ResourceIdentifier?: string;
  ResourceArn?: string;
}
export const AssociatedResource = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(S.String),
    ResourceIdentifier: S.optional(S.String),
    ResourceArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AssociatedResource",
}) as any as S.Schema<AssociatedResource>;
export type AssociatedResources = AssociatedResource[];
export const AssociatedResources = S.Array(AssociatedResource);
export interface AmendBenefitApplicationInput {
  Catalog: string;
  ClientToken: string;
  Revision: string;
  Identifier: string;
  AmendmentReason: string;
  Amendments: AmendmentList;
}
export const AmendBenefitApplicationInput = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ClientToken: S.String,
    Revision: S.String,
    Identifier: S.String,
    AmendmentReason: S.String,
    Amendments: AmendmentList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/AmendBenefitApplication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AmendBenefitApplicationInput",
}) as any as S.Schema<AmendBenefitApplicationInput>;
export interface AmendBenefitApplicationOutput {}
export const AmendBenefitApplicationOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AmendBenefitApplicationOutput",
}) as any as S.Schema<AmendBenefitApplicationOutput>;
export interface AssociateBenefitApplicationResourceOutput {
  Id?: string;
  Arn?: string;
  Revision?: string;
}
export const AssociateBenefitApplicationResourceOutput = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Revision: S.optional(S.String),
  }),
).annotations({
  identifier: "AssociateBenefitApplicationResourceOutput",
}) as any as S.Schema<AssociateBenefitApplicationResourceOutput>;
export interface CreateBenefitApplicationInput {
  Catalog: string;
  ClientToken: string;
  Name?: string;
  Description?: string;
  BenefitIdentifier: string;
  FulfillmentTypes?: FulfillmentTypes;
  BenefitApplicationDetails?: any;
  Tags?: Tags;
  AssociatedResources?: Arns;
  PartnerContacts?: Contacts;
  FileDetails?: FileInputDetails;
}
export const CreateBenefitApplicationInput = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ClientToken: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    BenefitIdentifier: S.String,
    FulfillmentTypes: S.optional(FulfillmentTypes),
    BenefitApplicationDetails: S.optional(S.Any),
    Tags: S.optional(Tags),
    AssociatedResources: S.optional(Arns),
    PartnerContacts: S.optional(Contacts),
    FileDetails: S.optional(FileInputDetails),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateBenefitApplication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBenefitApplicationInput",
}) as any as S.Schema<CreateBenefitApplicationInput>;
export interface DisassociateBenefitApplicationResourceOutput {
  Id?: string;
  Arn?: string;
  Revision?: string;
}
export const DisassociateBenefitApplicationResourceOutput = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Revision: S.optional(S.String),
  }),
).annotations({
  identifier: "DisassociateBenefitApplicationResourceOutput",
}) as any as S.Schema<DisassociateBenefitApplicationResourceOutput>;
export interface GetBenefitOutput {
  Id?: string;
  Catalog?: string;
  Arn?: string;
  Name?: string;
  Description?: string;
  Programs?: Programs;
  FulfillmentTypes?: FulfillmentTypes;
  BenefitRequestSchema?: any;
  Status?: string;
}
export const GetBenefitOutput = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Catalog: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Programs: S.optional(Programs),
    FulfillmentTypes: S.optional(FulfillmentTypes),
    BenefitRequestSchema: S.optional(S.Any),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "GetBenefitOutput",
}) as any as S.Schema<GetBenefitOutput>;
export interface ListBenefitApplicationsInput {
  Catalog: string;
  Programs?: Programs;
  FulfillmentTypes?: FulfillmentTypes;
  BenefitIdentifiers?: BenefitIdentifiers;
  Status?: Statuses;
  Stages?: Stages;
  AssociatedResources?: AssociatedResources;
  AssociatedResourceArns?: Arns;
  MaxResults?: number;
  NextToken?: string;
}
export const ListBenefitApplicationsInput = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Programs: S.optional(Programs),
    FulfillmentTypes: S.optional(FulfillmentTypes),
    BenefitIdentifiers: S.optional(BenefitIdentifiers),
    Status: S.optional(Statuses),
    Stages: S.optional(Stages),
    AssociatedResources: S.optional(AssociatedResources),
    AssociatedResourceArns: S.optional(Arns),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListBenefitApplications" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBenefitApplicationsInput",
}) as any as S.Schema<ListBenefitApplicationsInput>;
export interface ListTagsForResourceResponse {
  tags?: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface UpdateBenefitApplicationOutput {
  Id?: string;
  Arn?: string;
  Revision?: string;
}
export const UpdateBenefitApplicationOutput = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Revision: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateBenefitApplicationOutput",
}) as any as S.Schema<UpdateBenefitApplicationOutput>;
export type BenefitIds = string[];
export const BenefitIds = S.Array(S.String);
export interface FileDetail {
  FileURI: string;
  BusinessUseCase?: string;
  FileName?: string;
  FileStatus?: string;
  FileStatusReason?: string;
  FileType?: string;
  CreatedBy?: string;
  CreatedAt?: Date;
}
export const FileDetail = S.suspend(() =>
  S.Struct({
    FileURI: S.String,
    BusinessUseCase: S.optional(S.String),
    FileName: S.optional(S.String),
    FileStatus: S.optional(S.String),
    FileStatusReason: S.optional(S.String),
    FileType: S.optional(S.String),
    CreatedBy: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({ identifier: "FileDetail" }) as any as S.Schema<FileDetail>;
export type FileDetails = FileDetail[];
export const FileDetails = S.Array(FileDetail);
export interface BenefitAllocationSummary {
  Id?: string;
  Catalog?: string;
  Arn?: string;
  Status?: string;
  StatusReason?: string;
  Name?: string;
  BenefitId?: string;
  BenefitApplicationId?: string;
  FulfillmentTypes?: FulfillmentTypes;
  CreatedAt?: Date;
  ExpiresAt?: Date;
  ApplicableBenefitIds?: BenefitIds;
}
export const BenefitAllocationSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Catalog: S.optional(S.String),
    Arn: S.optional(S.String),
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
    Name: S.optional(S.String),
    BenefitId: S.optional(S.String),
    BenefitApplicationId: S.optional(S.String),
    FulfillmentTypes: S.optional(FulfillmentTypes),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ApplicableBenefitIds: S.optional(BenefitIds),
  }),
).annotations({
  identifier: "BenefitAllocationSummary",
}) as any as S.Schema<BenefitAllocationSummary>;
export type BenefitAllocationSummaries = BenefitAllocationSummary[];
export const BenefitAllocationSummaries = S.Array(BenefitAllocationSummary);
export interface BenefitSummary {
  Id?: string;
  Catalog?: string;
  Arn?: string;
  Name?: string;
  Description?: string;
  Programs?: Programs;
  FulfillmentTypes?: FulfillmentTypes;
  Status?: string;
}
export const BenefitSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Catalog: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Programs: S.optional(Programs),
    FulfillmentTypes: S.optional(FulfillmentTypes),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "BenefitSummary",
}) as any as S.Schema<BenefitSummary>;
export type BenefitSummaries = BenefitSummary[];
export const BenefitSummaries = S.Array(BenefitSummary);
export interface CreateBenefitApplicationOutput {
  Id?: string;
  Arn?: string;
  Revision?: string;
}
export const CreateBenefitApplicationOutput = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Revision: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateBenefitApplicationOutput",
}) as any as S.Schema<CreateBenefitApplicationOutput>;
export interface GetBenefitApplicationOutput {
  Id?: string;
  Arn?: string;
  Catalog?: string;
  BenefitId?: string;
  Name?: string;
  Description?: string;
  FulfillmentTypes?: FulfillmentTypes;
  BenefitApplicationDetails?: any;
  Programs?: Programs;
  Status?: string;
  Stage?: string;
  StatusReason?: string;
  StatusReasonCode?: string;
  StatusReasonCodes?: StatusReasonCodes;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  Revision?: string;
  AssociatedResources?: Arns;
  PartnerContacts?: Contacts;
  FileDetails?: FileDetails;
}
export const GetBenefitApplicationOutput = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Catalog: S.optional(S.String),
    BenefitId: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    FulfillmentTypes: S.optional(FulfillmentTypes),
    BenefitApplicationDetails: S.optional(S.Any),
    Programs: S.optional(Programs),
    Status: S.optional(S.String),
    Stage: S.optional(S.String),
    StatusReason: S.optional(S.String),
    StatusReasonCode: S.optional(S.String),
    StatusReasonCodes: S.optional(StatusReasonCodes),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Revision: S.optional(S.String),
    AssociatedResources: S.optional(Arns),
    PartnerContacts: S.optional(Contacts),
    FileDetails: S.optional(FileDetails),
  }),
).annotations({
  identifier: "GetBenefitApplicationOutput",
}) as any as S.Schema<GetBenefitApplicationOutput>;
export interface ListBenefitAllocationsOutput {
  BenefitAllocationSummaries?: BenefitAllocationSummaries;
  NextToken?: string;
}
export const ListBenefitAllocationsOutput = S.suspend(() =>
  S.Struct({
    BenefitAllocationSummaries: S.optional(BenefitAllocationSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBenefitAllocationsOutput",
}) as any as S.Schema<ListBenefitAllocationsOutput>;
export interface ListBenefitsOutput {
  BenefitSummaries?: BenefitSummaries;
  NextToken?: string;
}
export const ListBenefitsOutput = S.suspend(() =>
  S.Struct({
    BenefitSummaries: S.optional(BenefitSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBenefitsOutput",
}) as any as S.Schema<ListBenefitsOutput>;
export interface MonetaryValue {
  Amount: string;
  CurrencyCode: string;
}
export const MonetaryValue = S.suspend(() =>
  S.Struct({ Amount: S.String, CurrencyCode: S.String }),
).annotations({
  identifier: "MonetaryValue",
}) as any as S.Schema<MonetaryValue>;
export interface IssuanceDetail {
  IssuanceId?: string;
  IssuanceAmount?: MonetaryValue;
  IssuedAt?: Date;
}
export const IssuanceDetail = S.suspend(() =>
  S.Struct({
    IssuanceId: S.optional(S.String),
    IssuanceAmount: S.optional(MonetaryValue),
    IssuedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "IssuanceDetail",
}) as any as S.Schema<IssuanceDetail>;
export interface ConsumableDetails {
  AllocatedAmount?: MonetaryValue;
  RemainingAmount?: MonetaryValue;
  UtilizedAmount?: MonetaryValue;
  IssuanceDetails?: IssuanceDetail;
}
export const ConsumableDetails = S.suspend(() =>
  S.Struct({
    AllocatedAmount: S.optional(MonetaryValue),
    RemainingAmount: S.optional(MonetaryValue),
    UtilizedAmount: S.optional(MonetaryValue),
    IssuanceDetails: S.optional(IssuanceDetail),
  }),
).annotations({
  identifier: "ConsumableDetails",
}) as any as S.Schema<ConsumableDetails>;
export interface AccessDetails {
  Description?: string;
}
export const AccessDetails = S.suspend(() =>
  S.Struct({ Description: S.optional(S.String) }),
).annotations({
  identifier: "AccessDetails",
}) as any as S.Schema<AccessDetails>;
export interface CreditCode {
  AwsAccountId: string;
  Value: MonetaryValue;
  AwsCreditCode: string;
  Status: string;
  IssuedAt: Date;
  ExpiresAt: Date;
}
export const CreditCode = S.suspend(() =>
  S.Struct({
    AwsAccountId: S.String,
    Value: MonetaryValue,
    AwsCreditCode: S.String,
    Status: S.String,
    IssuedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    ExpiresAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({ identifier: "CreditCode" }) as any as S.Schema<CreditCode>;
export type CreditCodes = CreditCode[];
export const CreditCodes = S.Array(CreditCode);
export interface DisbursementDetails {
  DisbursedAmount?: MonetaryValue;
  IssuanceDetails?: IssuanceDetail;
}
export const DisbursementDetails = S.suspend(() =>
  S.Struct({
    DisbursedAmount: S.optional(MonetaryValue),
    IssuanceDetails: S.optional(IssuanceDetail),
  }),
).annotations({
  identifier: "DisbursementDetails",
}) as any as S.Schema<DisbursementDetails>;
export interface CreditDetails {
  AllocatedAmount: MonetaryValue;
  IssuedAmount: MonetaryValue;
  Codes: CreditCodes;
}
export const CreditDetails = S.suspend(() =>
  S.Struct({
    AllocatedAmount: MonetaryValue,
    IssuedAmount: MonetaryValue,
    Codes: CreditCodes,
  }),
).annotations({
  identifier: "CreditDetails",
}) as any as S.Schema<CreditDetails>;
export type Attributes = { [key: string]: string };
export const Attributes = S.Record({ key: S.String, value: S.String });
export type FulfillmentDetails =
  | { DisbursementDetails: DisbursementDetails }
  | { ConsumableDetails: ConsumableDetails }
  | { CreditDetails: CreditDetails }
  | { AccessDetails: AccessDetails };
export const FulfillmentDetails = S.Union(
  S.Struct({ DisbursementDetails: DisbursementDetails }),
  S.Struct({ ConsumableDetails: ConsumableDetails }),
  S.Struct({ CreditDetails: CreditDetails }),
  S.Struct({ AccessDetails: AccessDetails }),
);
export interface BenefitApplicationSummary {
  Catalog?: string;
  Name?: string;
  Id?: string;
  Arn?: string;
  BenefitId?: string;
  Programs?: Programs;
  FulfillmentTypes?: FulfillmentTypes;
  Status?: string;
  Stage?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  BenefitApplicationDetails?: Attributes;
  AssociatedResources?: Arns;
}
export const BenefitApplicationSummary = S.suspend(() =>
  S.Struct({
    Catalog: S.optional(S.String),
    Name: S.optional(S.String),
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    BenefitId: S.optional(S.String),
    Programs: S.optional(Programs),
    FulfillmentTypes: S.optional(FulfillmentTypes),
    Status: S.optional(S.String),
    Stage: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    BenefitApplicationDetails: S.optional(Attributes),
    AssociatedResources: S.optional(Arns),
  }),
).annotations({
  identifier: "BenefitApplicationSummary",
}) as any as S.Schema<BenefitApplicationSummary>;
export type BenefitApplicationSummaries = BenefitApplicationSummary[];
export const BenefitApplicationSummaries = S.Array(BenefitApplicationSummary);
export interface GetBenefitAllocationOutput {
  Id?: string;
  Catalog?: string;
  Arn?: string;
  Name?: string;
  Description?: string;
  Status?: string;
  StatusReason?: string;
  BenefitApplicationId?: string;
  BenefitId?: string;
  FulfillmentType?: string;
  ApplicableBenefitIds?: BenefitIdentifiers;
  FulfillmentDetail?: (typeof FulfillmentDetails)["Type"];
  CreatedAt?: Date;
  UpdatedAt?: Date;
  StartsAt?: Date;
  ExpiresAt?: Date;
}
export const GetBenefitAllocationOutput = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Catalog: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
    BenefitApplicationId: S.optional(S.String),
    BenefitId: S.optional(S.String),
    FulfillmentType: S.optional(S.String),
    ApplicableBenefitIds: S.optional(BenefitIdentifiers),
    FulfillmentDetail: S.optional(FulfillmentDetails),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    StartsAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetBenefitAllocationOutput",
}) as any as S.Schema<GetBenefitAllocationOutput>;
export interface ListBenefitApplicationsOutput {
  BenefitApplicationSummaries?: BenefitApplicationSummaries;
  NextToken?: string;
}
export const ListBenefitApplicationsOutput = S.suspend(() =>
  S.Struct({
    BenefitApplicationSummaries: S.optional(BenefitApplicationSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBenefitApplicationsOutput",
}) as any as S.Schema<ListBenefitApplicationsOutput>;
export interface ValidationExceptionField {
  Name: string;
  Message: string;
  Code?: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ Name: S.String, Message: S.String, Code: S.optional(S.String) }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.String,
    ResourceId: S.String,
    ResourceType: S.String,
    QuotaCode: S.String,
  },
  T.Retryable(),
).pipe(C.withQuotaError, C.withRetryableError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String,
    Reason: S.String,
    FieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Retrieves detailed information about a specific benefit available in the partner catalog.
 */
export const getBenefit: (
  input: GetBenefitInput,
) => Effect.Effect<
  GetBenefitOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBenefitInput,
  output: GetBenefitOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves detailed information about a specific benefit allocation that has been granted to a partner.
 */
export const getBenefitAllocation: (
  input: GetBenefitAllocationInput,
) => Effect.Effect<
  GetBenefitAllocationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBenefitAllocationInput,
  output: GetBenefitAllocationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a paginated list of benefit applications based on specified filter criteria.
 */
export const listBenefitApplications: {
  (
    input: ListBenefitApplicationsInput,
  ): Effect.Effect<
    ListBenefitApplicationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBenefitApplicationsInput,
  ) => Stream.Stream<
    ListBenefitApplicationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBenefitApplicationsInput,
  ) => Stream.Stream<
    BenefitApplicationSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBenefitApplicationsInput,
  output: ListBenefitApplicationsOutput,
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
    items: "BenefitApplicationSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Adds or updates tags for a specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves detailed information about a specific benefit application.
 */
export const getBenefitApplication: (
  input: GetBenefitApplicationInput,
) => Effect.Effect<
  GetBenefitApplicationOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBenefitApplicationInput,
  output: GetBenefitApplicationOutput,
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
 * Retrieves a paginated list of benefit allocations based on specified filter criteria.
 */
export const listBenefitAllocations: {
  (
    input: ListBenefitAllocationsInput,
  ): Effect.Effect<
    ListBenefitAllocationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBenefitAllocationsInput,
  ) => Stream.Stream<
    ListBenefitAllocationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBenefitAllocationsInput,
  ) => Stream.Stream<
    BenefitAllocationSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBenefitAllocationsInput,
  output: ListBenefitAllocationsOutput,
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
    items: "BenefitAllocationSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of available benefits based on specified filter criteria.
 */
export const listBenefits: {
  (
    input: ListBenefitsInput,
  ): Effect.Effect<
    ListBenefitsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBenefitsInput,
  ) => Stream.Stream<
    ListBenefitsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBenefitsInput,
  ) => Stream.Stream<
    BenefitSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBenefitsInput,
  output: ListBenefitsOutput,
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
    items: "BenefitSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Removes the association between an AWS resource and a benefit application.
 */
export const disassociateBenefitApplicationResource: (
  input: DisassociateBenefitApplicationResourceInput,
) => Effect.Effect<
  DisassociateBenefitApplicationResourceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateBenefitApplicationResourceInput,
  output: DisassociateBenefitApplicationResourceOutput,
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
 * Updates an existing benefit application with new information while maintaining revision control.
 */
export const updateBenefitApplication: (
  input: UpdateBenefitApplicationInput,
) => Effect.Effect<
  UpdateBenefitApplicationOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBenefitApplicationInput,
  output: UpdateBenefitApplicationOutput,
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
 * Recalls a submitted benefit application, returning it to draft status for further modifications.
 */
export const recallBenefitApplication: (
  input: RecallBenefitApplicationInput,
) => Effect.Effect<
  RecallBenefitApplicationOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RecallBenefitApplicationInput,
  output: RecallBenefitApplicationOutput,
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
 * Submits a benefit application for review and processing by AWS.
 */
export const submitBenefitApplication: (
  input: SubmitBenefitApplicationInput,
) => Effect.Effect<
  SubmitBenefitApplicationOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SubmitBenefitApplicationInput,
  output: SubmitBenefitApplicationOutput,
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
 * Modifies an existing benefit application by applying amendments to specific fields while maintaining revision control.
 */
export const amendBenefitApplication: (
  input: AmendBenefitApplicationInput,
) => Effect.Effect<
  AmendBenefitApplicationOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AmendBenefitApplicationInput,
  output: AmendBenefitApplicationOutput,
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
 * Links an AWS resource to an existing benefit application for tracking and management purposes.
 */
export const associateBenefitApplicationResource: (
  input: AssociateBenefitApplicationResourceInput,
) => Effect.Effect<
  AssociateBenefitApplicationResourceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateBenefitApplicationResourceInput,
  output: AssociateBenefitApplicationResourceOutput,
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
 * Retrieves all tags associated with a specific resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServerException
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
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Cancels a benefit application that is currently in progress, preventing further processing.
 */
export const cancelBenefitApplication: (
  input: CancelBenefitApplicationInput,
) => Effect.Effect<
  CancelBenefitApplicationOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelBenefitApplicationInput,
  output: CancelBenefitApplicationOutput,
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
 * Creates a new benefit application for a partner to request access to AWS benefits and programs.
 */
export const createBenefitApplication: (
  input: CreateBenefitApplicationInput,
) => Effect.Effect<
  CreateBenefitApplicationOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBenefitApplicationInput,
  output: CreateBenefitApplicationOutput,
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
 * Removes specified tags from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
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
