import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Route53Profiles",
  serviceShapeName: "Route53Profiles",
});
const auth = T.AwsAuthSigv4({ name: "route53profiles" });
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
                                url: "https://route53profiles-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://route53profiles-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://route53profiles.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://route53profiles.{Region}.{PartitionResult#dnsSuffix}",
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
export class AssociateResourceToProfileRequest extends S.Class<AssociateResourceToProfileRequest>(
  "AssociateResourceToProfileRequest",
)(
  {
    ProfileId: S.String,
    ResourceArn: S.String,
    Name: S.String,
    ResourceProperties: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/profileresourceassociation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateProfileRequest extends S.Class<CreateProfileRequest>(
  "CreateProfileRequest",
)(
  { Name: S.String, ClientToken: S.String, Tags: S.optional(TagList) },
  T.all(
    T.Http({ method: "POST", uri: "/profile" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProfileRequest extends S.Class<DeleteProfileRequest>(
  "DeleteProfileRequest",
)(
  { ProfileId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/profile/{ProfileId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateProfileRequest extends S.Class<DisassociateProfileRequest>(
  "DisassociateProfileRequest",
)(
  {
    ProfileId: S.String.pipe(T.HttpLabel()),
    ResourceId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class DisassociateResourceFromProfileRequest extends S.Class<DisassociateResourceFromProfileRequest>(
  "DisassociateResourceFromProfileRequest",
)(
  {
    ProfileId: S.String.pipe(T.HttpLabel()),
    ResourceArn: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetProfileRequest extends S.Class<GetProfileRequest>(
  "GetProfileRequest",
)(
  { ProfileId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/profile/{ProfileId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetProfileAssociationRequest extends S.Class<GetProfileAssociationRequest>(
  "GetProfileAssociationRequest",
)(
  { ProfileAssociationId: S.String.pipe(T.HttpLabel()) },
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
) {}
export class GetProfileResourceAssociationRequest extends S.Class<GetProfileResourceAssociationRequest>(
  "GetProfileResourceAssociationRequest",
)(
  { ProfileResourceAssociationId: S.String.pipe(T.HttpLabel()) },
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
) {}
export class ListProfileAssociationsRequest extends S.Class<ListProfileAssociationsRequest>(
  "ListProfileAssociationsRequest",
)(
  {
    ResourceId: S.optional(S.String).pipe(T.HttpQuery("resourceId")),
    ProfileId: S.optional(S.String).pipe(T.HttpQuery("profileId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/profileassociations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProfileResourceAssociationsRequest extends S.Class<ListProfileResourceAssociationsRequest>(
  "ListProfileResourceAssociationsRequest",
)(
  {
    ProfileId: S.String.pipe(T.HttpLabel()),
    ResourceType: S.optional(S.String).pipe(T.HttpQuery("resourceType")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
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
) {}
export class ListProfilesRequest extends S.Class<ListProfilesRequest>(
  "ListProfilesRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/profiles" }),
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
  { ResourceArn: S.String.pipe(T.HttpLabel()) },
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
    ResourceArn: S.String.pipe(T.HttpLabel()),
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
export class UpdateProfileResourceAssociationRequest extends S.Class<UpdateProfileResourceAssociationRequest>(
  "UpdateProfileResourceAssociationRequest",
)(
  {
    ProfileResourceAssociationId: S.String.pipe(T.HttpLabel()),
    Name: S.optional(S.String),
    ResourceProperties: S.optional(S.String),
  },
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
) {}
export class ProfileAssociation extends S.Class<ProfileAssociation>(
  "ProfileAssociation",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  OwnerId: S.optional(S.String),
  ProfileId: S.optional(S.String),
  ResourceId: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ModificationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ProfileAssociations = S.Array(ProfileAssociation);
export class ProfileResourceAssociation extends S.Class<ProfileResourceAssociation>(
  "ProfileResourceAssociation",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  OwnerId: S.optional(S.String),
  ProfileId: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  ResourceType: S.optional(S.String),
  ResourceProperties: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ModificationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ProfileResourceAssociations = S.Array(ProfileResourceAssociation);
export const TagMap = S.Record({ key: S.String, value: S.String });
export class AssociateProfileRequest extends S.Class<AssociateProfileRequest>(
  "AssociateProfileRequest",
)(
  {
    ProfileId: S.String,
    ResourceId: S.String,
    Name: S.String,
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/profileassociation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Profile extends S.Class<Profile>("Profile")({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  OwnerId: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  ShareStatus: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ModificationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ClientToken: S.optional(S.String),
}) {}
export class DeleteProfileResponse extends S.Class<DeleteProfileResponse>(
  "DeleteProfileResponse",
)({ Profile: S.optional(Profile) }) {}
export class DisassociateResourceFromProfileResponse extends S.Class<DisassociateResourceFromProfileResponse>(
  "DisassociateResourceFromProfileResponse",
)({ ProfileResourceAssociation: S.optional(ProfileResourceAssociation) }) {}
export class GetProfileResponse extends S.Class<GetProfileResponse>(
  "GetProfileResponse",
)({ Profile: S.optional(Profile) }) {}
export class GetProfileAssociationResponse extends S.Class<GetProfileAssociationResponse>(
  "GetProfileAssociationResponse",
)({ ProfileAssociation: S.optional(ProfileAssociation) }) {}
export class GetProfileResourceAssociationResponse extends S.Class<GetProfileResourceAssociationResponse>(
  "GetProfileResourceAssociationResponse",
)({ ProfileResourceAssociation: S.optional(ProfileResourceAssociation) }) {}
export class ListProfileAssociationsResponse extends S.Class<ListProfileAssociationsResponse>(
  "ListProfileAssociationsResponse",
)({
  ProfileAssociations: S.optional(ProfileAssociations),
  NextToken: S.optional(S.String),
}) {}
export class ListProfileResourceAssociationsResponse extends S.Class<ListProfileResourceAssociationsResponse>(
  "ListProfileResourceAssociationsResponse",
)({
  ProfileResourceAssociations: S.optional(ProfileResourceAssociations),
  NextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: TagMap }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel()), Tags: TagMap },
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
export class UpdateProfileResourceAssociationResponse extends S.Class<UpdateProfileResourceAssociationResponse>(
  "UpdateProfileResourceAssociationResponse",
)({ ProfileResourceAssociation: S.optional(ProfileResourceAssociation) }) {}
export class ProfileSummary extends S.Class<ProfileSummary>("ProfileSummary")({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  ShareStatus: S.optional(S.String),
}) {}
export const ProfileSummaryList = S.Array(ProfileSummary);
export class AssociateProfileResponse extends S.Class<AssociateProfileResponse>(
  "AssociateProfileResponse",
)({ ProfileAssociation: S.optional(ProfileAssociation) }) {}
export class AssociateResourceToProfileResponse extends S.Class<AssociateResourceToProfileResponse>(
  "AssociateResourceToProfileResponse",
)({ ProfileResourceAssociation: S.optional(ProfileResourceAssociation) }) {}
export class CreateProfileResponse extends S.Class<CreateProfileResponse>(
  "CreateProfileResponse",
)({ Profile: S.optional(Profile) }) {}
export class DisassociateProfileResponse extends S.Class<DisassociateProfileResponse>(
  "DisassociateProfileResponse",
)({ ProfileAssociation: S.optional(ProfileAssociation) }) {}
export class ListProfilesResponse extends S.Class<ListProfilesResponse>(
  "ListProfilesResponse",
)({
  ProfileSummaries: S.optional(ProfileSummaryList),
  NextToken: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class InternalServiceErrorException extends S.TaggedError<InternalServiceErrorException>()(
  "InternalServiceErrorException",
  {},
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  {},
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
) {}
export class ResourceExistsException extends S.TaggedError<ResourceExistsException>()(
  "ResourceExistsException",
  { Message: S.optional(S.String), ResourceType: S.optional(S.String) },
) {}

//# Operations
/**
 * Lists the tags that you associated with the specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Adds one or more tags to a specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Associates a DNS reource configuration to a Route 53 Profile.
 */
export const associateResourceToProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates an empty Route 53 Profile.
 */
export const createProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes the specified Route 53 Profile. Before you can delete a profile, you must first disassociate it from all VPCs.
 */
export const deleteProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Dissociates a specified Route 53 Profile from the specified VPC.
 */
export const disassociateProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Dissoaciated a specified resource, from the Route 53 Profile.
 */
export const disassociateResourceFromProfile =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns information about a specified Route 53 Profile, such as whether whether the Profile is shared, and the current status of the Profile.
 */
export const getProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves a Route 53 Profile association for a VPC. A VPC can have only one Profile association, but a Profile can be associated with up to 5000 VPCs.
 */
export const getProfileAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetProfileAssociationRequest,
    output: GetProfileAssociationResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns information about a specified Route 53 Profile resource association.
 */
export const getProfileResourceAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listProfileAssociations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListProfileAssociationsRequest,
    output: ListProfileAssociationsResponse,
    errors: [
      AccessDeniedException,
      InvalidNextTokenException,
      InvalidParameterException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all the resource associations for the specified Route 53 Profile.
 */
export const listProfileResourceAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
  }));
/**
 * Lists all the Route 53 Profiles associated with your Amazon Web Services account.
 */
export const listProfiles = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListProfilesRequest,
  output: ListProfilesResponse,
  errors: [
    AccessDeniedException,
    InvalidNextTokenException,
    InvalidParameterException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the specified Route 53 Profile resourse association.
 */
export const updateProfileResourceAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Associates a Route 53 Profiles profile with a VPC. A VPC can have only one Profile associated with it, but a Profile can be associated with 1000 of VPCs (and you can request a higher quota).
 * For more information, see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/DNSLimitations.html#limits-api-entities.
 */
export const associateProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
