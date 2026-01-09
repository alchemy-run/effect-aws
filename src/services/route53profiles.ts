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
  sdkId: "Route53Profiles",
  serviceShapeName: "Route53Profiles",
});
const auth = T.AwsAuthSigv4({ name: "route53profiles" });
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
              `https://route53profiles-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://route53profiles-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://route53profiles.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://route53profiles.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ResourceId = string;
export type Name = string;
export type Arn = string;
export type ResourceProperties = string;
export type CreatorRequestId = string;
export type MaxResults = number;
export type NextToken = string;
export type TagKey = string;
export type TagValue = string;
export type ExceptionMessage = string;
export type AccountId = string;
export type Rfc3339Timestamp = Date;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AssociateResourceToProfileRequest {
  ProfileId: string;
  ResourceArn: string;
  Name: string;
  ResourceProperties?: string;
}
export const AssociateResourceToProfileRequest = S.suspend(() =>
  S.Struct({
    ProfileId: S.String,
    ResourceArn: S.String,
    Name: S.String,
    ResourceProperties: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/profileresourceassociation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateResourceToProfileRequest",
}) as any as S.Schema<AssociateResourceToProfileRequest>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateProfileRequest {
  Name: string;
  ClientToken: string;
  Tags?: Tag[];
}
export const CreateProfileRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/profile" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProfileRequest",
}) as any as S.Schema<CreateProfileRequest>;
export interface DeleteProfileRequest {
  ProfileId: string;
}
export const DeleteProfileRequest = S.suspend(() =>
  S.Struct({ ProfileId: S.String.pipe(T.HttpLabel("ProfileId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/profile/{ProfileId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProfileRequest",
}) as any as S.Schema<DeleteProfileRequest>;
export interface DisassociateProfileRequest {
  ProfileId: string;
  ResourceId: string;
}
export const DisassociateProfileRequest = S.suspend(() =>
  S.Struct({
    ProfileId: S.String.pipe(T.HttpLabel("ProfileId")),
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/profileassociation/Profileid/{ProfileId}/resourceid/{ResourceId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateProfileRequest",
}) as any as S.Schema<DisassociateProfileRequest>;
export interface DisassociateResourceFromProfileRequest {
  ProfileId: string;
  ResourceArn: string;
}
export const DisassociateResourceFromProfileRequest = S.suspend(() =>
  S.Struct({
    ProfileId: S.String.pipe(T.HttpLabel("ProfileId")),
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/profileresourceassociation/profileid/{ProfileId}/resourcearn/{ResourceArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateResourceFromProfileRequest",
}) as any as S.Schema<DisassociateResourceFromProfileRequest>;
export interface GetProfileRequest {
  ProfileId: string;
}
export const GetProfileRequest = S.suspend(() =>
  S.Struct({ ProfileId: S.String.pipe(T.HttpLabel("ProfileId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/profile/{ProfileId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProfileRequest",
}) as any as S.Schema<GetProfileRequest>;
export interface GetProfileAssociationRequest {
  ProfileAssociationId: string;
}
export const GetProfileAssociationRequest = S.suspend(() =>
  S.Struct({
    ProfileAssociationId: S.String.pipe(T.HttpLabel("ProfileAssociationId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/profileassociation/{ProfileAssociationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProfileAssociationRequest",
}) as any as S.Schema<GetProfileAssociationRequest>;
export interface GetProfileResourceAssociationRequest {
  ProfileResourceAssociationId: string;
}
export const GetProfileResourceAssociationRequest = S.suspend(() =>
  S.Struct({
    ProfileResourceAssociationId: S.String.pipe(
      T.HttpLabel("ProfileResourceAssociationId"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/profileresourceassociation/{ProfileResourceAssociationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProfileResourceAssociationRequest",
}) as any as S.Schema<GetProfileResourceAssociationRequest>;
export interface ListProfileAssociationsRequest {
  ResourceId?: string;
  ProfileId?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListProfileAssociationsRequest = S.suspend(() =>
  S.Struct({
    ResourceId: S.optional(S.String).pipe(T.HttpQuery("resourceId")),
    ProfileId: S.optional(S.String).pipe(T.HttpQuery("profileId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/profileassociations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProfileAssociationsRequest",
}) as any as S.Schema<ListProfileAssociationsRequest>;
export interface ListProfileResourceAssociationsRequest {
  ProfileId: string;
  ResourceType?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListProfileResourceAssociationsRequest = S.suspend(() =>
  S.Struct({
    ProfileId: S.String.pipe(T.HttpLabel("ProfileId")),
    ResourceType: S.optional(S.String).pipe(T.HttpQuery("resourceType")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/profileresourceassociations/profileid/{ProfileId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProfileResourceAssociationsRequest",
}) as any as S.Schema<ListProfileResourceAssociationsRequest>;
export interface ListProfilesRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListProfilesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/profiles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProfilesRequest",
}) as any as S.Schema<ListProfilesRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
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
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
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
export interface UpdateProfileResourceAssociationRequest {
  ProfileResourceAssociationId: string;
  Name?: string;
  ResourceProperties?: string;
}
export const UpdateProfileResourceAssociationRequest = S.suspend(() =>
  S.Struct({
    ProfileResourceAssociationId: S.String.pipe(
      T.HttpLabel("ProfileResourceAssociationId"),
    ),
    Name: S.optional(S.String),
    ResourceProperties: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/profileresourceassociation/{ProfileResourceAssociationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateProfileResourceAssociationRequest",
}) as any as S.Schema<UpdateProfileResourceAssociationRequest>;
export type ProfileStatus =
  | "COMPLETE"
  | "DELETING"
  | "UPDATING"
  | "CREATING"
  | "DELETED"
  | "FAILED"
  | (string & {});
export const ProfileStatus = S.String;
export interface ProfileAssociation {
  Id?: string;
  Name?: string;
  OwnerId?: string;
  ProfileId?: string;
  ResourceId?: string;
  Status?: ProfileStatus;
  StatusMessage?: string;
  CreationTime?: Date;
  ModificationTime?: Date;
}
export const ProfileAssociation = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    OwnerId: S.optional(S.String),
    ProfileId: S.optional(S.String),
    ResourceId: S.optional(S.String),
    Status: S.optional(ProfileStatus),
    StatusMessage: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ProfileAssociation",
}) as any as S.Schema<ProfileAssociation>;
export type ProfileAssociations = ProfileAssociation[];
export const ProfileAssociations = S.Array(ProfileAssociation);
export interface ProfileResourceAssociation {
  Id?: string;
  Name?: string;
  OwnerId?: string;
  ProfileId?: string;
  ResourceArn?: string;
  ResourceType?: string;
  ResourceProperties?: string;
  Status?: ProfileStatus;
  StatusMessage?: string;
  CreationTime?: Date;
  ModificationTime?: Date;
}
export const ProfileResourceAssociation = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    OwnerId: S.optional(S.String),
    ProfileId: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    ResourceType: S.optional(S.String),
    ResourceProperties: S.optional(S.String),
    Status: S.optional(ProfileStatus),
    StatusMessage: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ProfileResourceAssociation",
}) as any as S.Schema<ProfileResourceAssociation>;
export type ProfileResourceAssociations = ProfileResourceAssociation[];
export const ProfileResourceAssociations = S.Array(ProfileResourceAssociation);
export type TagMap = { [key: string]: string | undefined };
export const TagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface AssociateProfileRequest {
  ProfileId: string;
  ResourceId: string;
  Name: string;
  Tags?: Tag[];
}
export const AssociateProfileRequest = S.suspend(() =>
  S.Struct({
    ProfileId: S.String,
    ResourceId: S.String,
    Name: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/profileassociation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateProfileRequest",
}) as any as S.Schema<AssociateProfileRequest>;
export type ShareStatus =
  | "NOT_SHARED"
  | "SHARED_WITH_ME"
  | "SHARED_BY_ME"
  | (string & {});
export const ShareStatus = S.String;
export interface Profile {
  Id?: string;
  Arn?: string;
  Name?: string;
  OwnerId?: string;
  Status?: ProfileStatus;
  StatusMessage?: string;
  ShareStatus?: ShareStatus;
  CreationTime?: Date;
  ModificationTime?: Date;
  ClientToken?: string;
}
export const Profile = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    OwnerId: S.optional(S.String),
    Status: S.optional(ProfileStatus),
    StatusMessage: S.optional(S.String),
    ShareStatus: S.optional(ShareStatus),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ClientToken: S.optional(S.String),
  }),
).annotations({ identifier: "Profile" }) as any as S.Schema<Profile>;
export interface DeleteProfileResponse {
  Profile?: Profile;
}
export const DeleteProfileResponse = S.suspend(() =>
  S.Struct({ Profile: S.optional(Profile) }),
).annotations({
  identifier: "DeleteProfileResponse",
}) as any as S.Schema<DeleteProfileResponse>;
export interface DisassociateResourceFromProfileResponse {
  ProfileResourceAssociation?: ProfileResourceAssociation;
}
export const DisassociateResourceFromProfileResponse = S.suspend(() =>
  S.Struct({
    ProfileResourceAssociation: S.optional(ProfileResourceAssociation),
  }),
).annotations({
  identifier: "DisassociateResourceFromProfileResponse",
}) as any as S.Schema<DisassociateResourceFromProfileResponse>;
export interface GetProfileResponse {
  Profile?: Profile;
}
export const GetProfileResponse = S.suspend(() =>
  S.Struct({ Profile: S.optional(Profile) }),
).annotations({
  identifier: "GetProfileResponse",
}) as any as S.Schema<GetProfileResponse>;
export interface GetProfileAssociationResponse {
  ProfileAssociation?: ProfileAssociation;
}
export const GetProfileAssociationResponse = S.suspend(() =>
  S.Struct({ ProfileAssociation: S.optional(ProfileAssociation) }),
).annotations({
  identifier: "GetProfileAssociationResponse",
}) as any as S.Schema<GetProfileAssociationResponse>;
export interface GetProfileResourceAssociationResponse {
  ProfileResourceAssociation?: ProfileResourceAssociation;
}
export const GetProfileResourceAssociationResponse = S.suspend(() =>
  S.Struct({
    ProfileResourceAssociation: S.optional(ProfileResourceAssociation),
  }),
).annotations({
  identifier: "GetProfileResourceAssociationResponse",
}) as any as S.Schema<GetProfileResourceAssociationResponse>;
export interface ListProfileAssociationsResponse {
  ProfileAssociations?: ProfileAssociation[];
  NextToken?: string;
}
export const ListProfileAssociationsResponse = S.suspend(() =>
  S.Struct({
    ProfileAssociations: S.optional(ProfileAssociations),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProfileAssociationsResponse",
}) as any as S.Schema<ListProfileAssociationsResponse>;
export interface ListProfileResourceAssociationsResponse {
  ProfileResourceAssociations?: ProfileResourceAssociation[];
  NextToken?: string;
}
export const ListProfileResourceAssociationsResponse = S.suspend(() =>
  S.Struct({
    ProfileResourceAssociations: S.optional(ProfileResourceAssociations),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProfileResourceAssociationsResponse",
}) as any as S.Schema<ListProfileResourceAssociationsResponse>;
export interface ListTagsForResourceResponse {
  Tags: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: TagMap }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: TagMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
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
export interface UpdateProfileResourceAssociationResponse {
  ProfileResourceAssociation?: ProfileResourceAssociation;
}
export const UpdateProfileResourceAssociationResponse = S.suspend(() =>
  S.Struct({
    ProfileResourceAssociation: S.optional(ProfileResourceAssociation),
  }),
).annotations({
  identifier: "UpdateProfileResourceAssociationResponse",
}) as any as S.Schema<UpdateProfileResourceAssociationResponse>;
export interface ProfileSummary {
  Id?: string;
  Arn?: string;
  Name?: string;
  ShareStatus?: ShareStatus;
}
export const ProfileSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    ShareStatus: S.optional(ShareStatus),
  }),
).annotations({
  identifier: "ProfileSummary",
}) as any as S.Schema<ProfileSummary>;
export type ProfileSummaryList = ProfileSummary[];
export const ProfileSummaryList = S.Array(ProfileSummary);
export interface AssociateProfileResponse {
  ProfileAssociation?: ProfileAssociation;
}
export const AssociateProfileResponse = S.suspend(() =>
  S.Struct({ ProfileAssociation: S.optional(ProfileAssociation) }),
).annotations({
  identifier: "AssociateProfileResponse",
}) as any as S.Schema<AssociateProfileResponse>;
export interface AssociateResourceToProfileResponse {
  ProfileResourceAssociation?: ProfileResourceAssociation;
}
export const AssociateResourceToProfileResponse = S.suspend(() =>
  S.Struct({
    ProfileResourceAssociation: S.optional(ProfileResourceAssociation),
  }),
).annotations({
  identifier: "AssociateResourceToProfileResponse",
}) as any as S.Schema<AssociateResourceToProfileResponse>;
export interface CreateProfileResponse {
  Profile?: Profile;
}
export const CreateProfileResponse = S.suspend(() =>
  S.Struct({ Profile: S.optional(Profile) }),
).annotations({
  identifier: "CreateProfileResponse",
}) as any as S.Schema<CreateProfileResponse>;
export interface DisassociateProfileResponse {
  ProfileAssociation?: ProfileAssociation;
}
export const DisassociateProfileResponse = S.suspend(() =>
  S.Struct({ ProfileAssociation: S.optional(ProfileAssociation) }),
).annotations({
  identifier: "DisassociateProfileResponse",
}) as any as S.Schema<DisassociateProfileResponse>;
export interface ListProfilesResponse {
  ProfileSummaries?: ProfileSummary[];
  NextToken?: string;
}
export const ListProfilesResponse = S.suspend(() =>
  S.Struct({
    ProfileSummaries: S.optional(ProfileSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProfilesResponse",
}) as any as S.Schema<ListProfilesResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String), ResourceType: S.optional(S.String) },
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { Message: S.String, FieldName: S.optional(S.String) },
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
) {}
export class InternalServiceErrorException extends S.TaggedError<InternalServiceErrorException>()(
  "InternalServiceErrorException",
  { Message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String), ResourceType: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}
export class ResourceExistsException extends S.TaggedError<ResourceExistsException>()(
  "ResourceExistsException",
  { Message: S.optional(S.String), ResourceType: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns information about a specified Route 53 Profile, such as whether whether the Profile is shared, and the current status of the Profile.
 */
export const getProfile: (
  input: GetProfileRequest,
) => effect.Effect<
  GetProfileResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProfileRequest,
  output: GetProfileResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the specified Route 53 Profile resourse association.
 */
export const updateProfileResourceAssociation: (
  input: UpdateProfileResourceAssociationRequest,
) => effect.Effect<
  UpdateProfileResourceAssociationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServiceErrorException
  | InvalidParameterException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProfileResourceAssociationRequest,
  output: UpdateProfileResourceAssociationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServiceErrorException,
    InvalidParameterException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about a specified Route 53 Profile resource association.
 */
export const getProfileResourceAssociation: (
  input: GetProfileResourceAssociationRequest,
) => effect.Effect<
  GetProfileResourceAssociationResponse,
  | AccessDeniedException
  | InvalidParameterException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProfileResourceAssociationRequest,
  output: GetProfileResourceAssociationResponse,
  errors: [
    AccessDeniedException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all the VPCs that the specified Route 53 Profile is associated with.
 */
export const listProfileAssociations: {
  (
    input: ListProfileAssociationsRequest,
  ): effect.Effect<
    ListProfileAssociationsResponse,
    | AccessDeniedException
    | InvalidNextTokenException
    | InvalidParameterException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProfileAssociationsRequest,
  ) => stream.Stream<
    ListProfileAssociationsResponse,
    | AccessDeniedException
    | InvalidNextTokenException
    | InvalidParameterException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProfileAssociationsRequest,
  ) => stream.Stream<
    ProfileAssociation,
    | AccessDeniedException
    | InvalidNextTokenException
    | InvalidParameterException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProfileAssociationsRequest,
  output: ListProfileAssociationsResponse,
  errors: [
    AccessDeniedException,
    InvalidNextTokenException,
    InvalidParameterException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ProfileAssociations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all the resource associations for the specified Route 53 Profile.
 */
export const listProfileResourceAssociations: {
  (
    input: ListProfileResourceAssociationsRequest,
  ): effect.Effect<
    ListProfileResourceAssociationsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProfileResourceAssociationsRequest,
  ) => stream.Stream<
    ListProfileResourceAssociationsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProfileResourceAssociationsRequest,
  ) => stream.Stream<
    ProfileResourceAssociation,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProfileResourceAssociationsRequest,
  output: ListProfileResourceAssociationsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidNextTokenException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ProfileResourceAssociations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Deletes the specified Route 53 Profile. Before you can delete a profile, you must first disassociate it from all VPCs.
 */
export const deleteProfile: (
  input: DeleteProfileRequest,
) => effect.Effect<
  DeleteProfileResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProfileRequest,
  output: DeleteProfileResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the tags that you associated with the specified resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | ConflictException
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
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a Route 53 Profile association for a VPC. A VPC can have only one Profile association, but a Profile can be associated with up to 5000 VPCs.
 */
export const getProfileAssociation: (
  input: GetProfileAssociationRequest,
) => effect.Effect<
  GetProfileAssociationResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProfileAssociationRequest,
  output: GetProfileAssociationResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds one or more tags to a specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
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
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes one or more tags from a specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | ConflictException
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
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all the Route 53 Profiles associated with your Amazon Web Services account.
 */
export const listProfiles: {
  (
    input: ListProfilesRequest,
  ): effect.Effect<
    ListProfilesResponse,
    | AccessDeniedException
    | InvalidNextTokenException
    | InvalidParameterException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProfilesRequest,
  ) => stream.Stream<
    ListProfilesResponse,
    | AccessDeniedException
    | InvalidNextTokenException
    | InvalidParameterException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProfilesRequest,
  ) => stream.Stream<
    ProfileSummary,
    | AccessDeniedException
    | InvalidNextTokenException
    | InvalidParameterException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProfilesRequest,
  output: ListProfilesResponse,
  errors: [
    AccessDeniedException,
    InvalidNextTokenException,
    InvalidParameterException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ProfileSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Dissoaciated a specified resource, from the Route 53 Profile.
 */
export const disassociateResourceFromProfile: (
  input: DisassociateResourceFromProfileRequest,
) => effect.Effect<
  DisassociateResourceFromProfileResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServiceErrorException
  | InvalidParameterException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateResourceFromProfileRequest,
  output: DisassociateResourceFromProfileResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServiceErrorException,
    InvalidParameterException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Associates a DNS reource configuration to a Route 53 Profile.
 */
export const associateResourceToProfile: (
  input: AssociateResourceToProfileRequest,
) => effect.Effect<
  AssociateResourceToProfileResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServiceErrorException
  | InvalidParameterException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateResourceToProfileRequest,
  output: AssociateResourceToProfileResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServiceErrorException,
    InvalidParameterException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an empty Route 53 Profile.
 */
export const createProfile: (
  input: CreateProfileRequest,
) => effect.Effect<
  CreateProfileResponse,
  | AccessDeniedException
  | InvalidParameterException
  | LimitExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProfileRequest,
  output: CreateProfileResponse,
  errors: [
    AccessDeniedException,
    InvalidParameterException,
    LimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Dissociates a specified Route 53 Profile from the specified VPC.
 */
export const disassociateProfile: (
  input: DisassociateProfileRequest,
) => effect.Effect<
  DisassociateProfileResponse,
  | AccessDeniedException
  | InvalidParameterException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateProfileRequest,
  output: DisassociateProfileResponse,
  errors: [
    AccessDeniedException,
    InvalidParameterException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Associates a Route 53 Profiles profile with a VPC. A VPC can have only one Profile associated with it, but a Profile can be associated with 1000 of VPCs (and you can request a higher quota).
 * For more information, see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/DNSLimitations.html#limits-api-entities.
 */
export const associateProfile: (
  input: AssociateProfileRequest,
) => effect.Effect<
  AssociateProfileResponse,
  | AccessDeniedException
  | ConflictException
  | InvalidParameterException
  | LimitExceededException
  | ResourceExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateProfileRequest,
  output: AssociateProfileResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InvalidParameterException,
    LimitExceededException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
