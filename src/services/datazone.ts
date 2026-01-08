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
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "DataZone",
  serviceShapeName: "DataZone",
});
const auth = T.AwsAuthSigv4({ name: "datazone" });
const ver = T.ServiceVersion("2018-05-10");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseFIPS = false, Endpoint } = p;
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
        if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
          if (UseFIPS === true) {
            if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
              return e(
                `https://datazone-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              );
            }
            return err(
              "FIPS is enabled but this partition does not support FIPS",
            );
          }
          return e(
            `https://datazone.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://datazone-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        return e(
          `https://datazone.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type DomainId = string;
export type AssetIdentifier = string;
export type Revision = string;
export type ClientToken = string;
export type SubscriptionRequestId = string;
export type DecisionComment = string | Redacted.Redacted<string>;
export type EnvironmentId = string;
export type EntityIdentifier = string;
export type GlossaryTermId = string;
export type EntityId = string;
export type AttributeIdentifier = string;
export type SubscriptionId = string;
export type AccountPoolName = string | Redacted.Redacted<string>;
export type Description = string | Redacted.Redacted<string>;
export type AssetId = string;
export type FilterName = string | Redacted.Redacted<string>;
export type ConnectionName = string;
export type ProjectId = string;
export type EnvironmentProfileId = string;
export type EnvironmentBlueprintName = string;
export type EnvironmentProfileName = string | Redacted.Redacted<string>;
export type EnvironmentBlueprintId = string;
export type AwsAccountId = string;
export type AwsRegion = string;
export type GroupIdentifier = string;
export type ProjectName = string | Redacted.Redacted<string>;
export type DomainUnitId = string;
export type ProjectProfileId = string;
export type ProjectProfileName = string | Redacted.Redacted<string>;
export type SubscriptionTargetId = string;
export type RequestReason = string | Redacted.Redacted<string>;
export type SubscriptionTargetName = string | Redacted.Redacted<string>;
export type AuthorizedPrincipalIdentifier = string;
export type IamRoleArn = string;
export type TypeName = string;
export type UserIdentifier = string;
export type AccountPoolId = string;
export type FilterId = string;
export type ConnectionId = string;
export type SubscriptionGrantId = string;
export type TimeSeriesFormName = string;
export type RunIdentifier = string;
export type LineageEventIdentifier = string;
export type LineageNodeIdentifier = string;
export type TimeSeriesDataPointIdentifier = string;
export type PaginationToken = string;
export type MaxResults = number;
export type DataProductId = string;
export type DataSourceRunId = string;
export type MaxResultsForListDomains = number;
export type ListingId = string;
export type UserProfileId = string;
export type GroupProfileId = string;
export type GrantIdentifier = string;
export type SearchText = string;
export type GroupSearchText = string | Redacted.Redacted<string>;
export type UserSearchText = string | Redacted.Redacted<string>;
export type TagKey = string;
export type AssetName = string | Redacted.Redacted<string>;
export type ExternalIdentifier = string;
export type AssetTypeIdentifier = string;
export type DataProductName = string | Redacted.Redacted<string>;
export type DataProductDescription = string | Redacted.Redacted<string>;
export type Name = string | Redacted.Redacted<string>;
export type DataSourceType = string;
export type DataSourceId = string;
export type RoleArn = string;
export type KmsKeyArn = string;
export type DomainUnitName = string | Redacted.Redacted<string>;
export type DomainUnitDescription = string | Redacted.Redacted<string>;
export type PolicyArn = string;
export type RegionName = string;
export type FormTypeName = string | Redacted.Redacted<string>;
export type FormTypeIdentifier = string;
export type GlossaryName = string | Redacted.Redacted<string>;
export type GlossaryDescription = string | Redacted.Redacted<string>;
export type GlossaryId = string;
export type GlossaryTermName = string | Redacted.Redacted<string>;
export type ShortDescription = string | Redacted.Redacted<string>;
export type LongDescription = string | Redacted.Redacted<string>;
export type MetadataGenerationRunIdentifier = string;
export type RuleName = string | Redacted.Redacted<string>;
export type RuleId = string;
export type EditedValue = string | Redacted.Redacted<string>;
export type TagValue = string;
export type EnvironmentConfigurationName = string | Redacted.Redacted<string>;
export type EnvironmentConfigurationId = string | Redacted.Redacted<string>;
export type DeploymentOrder = number;
export type FormName = string;
export type RevisionInput = string;
export type Attribute = string;
export type AggregationDisplayValue = string;
export type CronString = string;
export type Smithy = string;
export type ErrorMessage = string;
export type CreatedBy = string;
export type UpdatedBy = string;
export type GroupProfileName = string | Redacted.Redacted<string>;
export type EnvironmentName = string | Redacted.Redacted<string>;
export type EnvironmentActionId = string;
export type LineageNodeId = string;
export type ListingName = string;
export type AwsAccountName = string | Redacted.Redacted<string>;
export type LambdaFunctionArn = string;
export type LambdaExecutionRoleArn = string;
export type S3Uri = string;
export type S3AccessGrantLocationId = string;
export type ParameterStorePath = string;
export type S3Location = string;
export type DeploymentMessage = string;
export type DataPointIdentifier = string;
export type TaskId = string;
export type Title = string | Redacted.Redacted<string>;
export type Message = string | Redacted.Redacted<string>;
export type ActionLink = string | Redacted.Redacted<string>;
export type DomainName = string | Redacted.Redacted<string>;
export type DomainDescription = string | Redacted.Redacted<string>;
export type EnvironmentConfigurationParameterName = string;
export type SageMakerAssetType = string;
export type SageMakerResourceArn = string;
export type UserProfileName = string | Redacted.Redacted<string>;
export type FirstName = string | Redacted.Redacted<string>;
export type LastName = string | Redacted.Redacted<string>;
export type LineageEventErrorMessage = string;
export type Forms = string;
export type SubnetId = string;
export type Password = string | Redacted.Redacted<string>;
export type Username = string;
export type AggregationAttributeValue = string;
export type AggregationAttributeDisplayValue = string;

//# Schemas
export type GovernedGlossaryTerms = string[];
export const GovernedGlossaryTerms = S.Array(S.String);
export type AttributesList = string[];
export const AttributesList = S.Array(S.String);
export type GlossaryTerms = string[];
export const GlossaryTerms = S.Array(S.String);
export type AuthorizedPrincipalIdentifiers = string[];
export const AuthorizedPrincipalIdentifiers = S.Array(S.String);
export type ApplicableAssetTypes = string[];
export const ApplicableAssetTypes = S.Array(S.String);
export type NotificationSubjects = string[];
export const NotificationSubjects = S.Array(S.String);
export type SearchOutputAdditionalAttributes = string[];
export const SearchOutputAdditionalAttributes = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface FormInput {
  formName: string;
  typeIdentifier?: string;
  typeRevision?: string;
  content?: string;
}
export const FormInput = S.suspend(() =>
  S.Struct({
    formName: S.String,
    typeIdentifier: S.optional(S.String),
    typeRevision: S.optional(S.String),
    content: S.optional(S.String),
  }),
).annotations({ identifier: "FormInput" }) as any as S.Schema<FormInput>;
export type FormInputList = FormInput[];
export const FormInputList = S.Array(FormInput);
export type EnabledRegionList = string[];
export const EnabledRegionList = S.Array(S.String);
export type GlossaryUsageRestrictions = string[];
export const GlossaryUsageRestrictions = S.Array(S.String);
export type MetadataGenerationRunTypes = string[];
export const MetadataGenerationRunTypes = S.Array(S.String);
export type ProjectIds = string[];
export const ProjectIds = S.Array(S.String);
export type AssetTypeIdentifiers = string[];
export const AssetTypeIdentifiers = S.Array(S.String);
export interface AssociateEnvironmentRoleInput {
  domainIdentifier: string;
  environmentIdentifier: string;
  environmentRoleArn: string;
}
export const AssociateEnvironmentRoleInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    environmentRoleArn: S.String.pipe(T.HttpLabel("environmentRoleArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/roles/{environmentRoleArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateEnvironmentRoleInput",
}) as any as S.Schema<AssociateEnvironmentRoleInput>;
export interface AssociateEnvironmentRoleOutput {}
export const AssociateEnvironmentRoleOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateEnvironmentRoleOutput",
}) as any as S.Schema<AssociateEnvironmentRoleOutput>;
export interface AssociateGovernedTermsInput {
  domainIdentifier: string;
  entityIdentifier: string;
  entityType: string;
  governedGlossaryTerms: GovernedGlossaryTerms;
}
export const AssociateGovernedTermsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    governedGlossaryTerms: GovernedGlossaryTerms,
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/v2/domains/{domainIdentifier}/entities/{entityType}/{entityIdentifier}/associate-governed-terms",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateGovernedTermsInput",
}) as any as S.Schema<AssociateGovernedTermsInput>;
export interface AssociateGovernedTermsOutput {}
export const AssociateGovernedTermsOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateGovernedTermsOutput",
}) as any as S.Schema<AssociateGovernedTermsOutput>;
export interface BatchGetAttributesMetadataInput {
  domainIdentifier: string;
  entityType: string;
  entityIdentifier: string;
  entityRevision?: string;
  attributeIdentifiers: AttributesList;
}
export const BatchGetAttributesMetadataInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    entityRevision: S.optional(S.String).pipe(T.HttpQuery("entityRevision")),
    attributeIdentifiers: AttributesList.pipe(
      T.HttpQuery("attributeIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/entities/{entityType}/{entityIdentifier}/attributes-metadata",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetAttributesMetadataInput",
}) as any as S.Schema<BatchGetAttributesMetadataInput>;
export interface CancelSubscriptionInput {
  domainIdentifier: string;
  identifier: string;
}
export const CancelSubscriptionInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/domains/{domainIdentifier}/subscriptions/{identifier}/cancel",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelSubscriptionInput",
}) as any as S.Schema<CancelSubscriptionInput>;
export interface EnvironmentParameter {
  name?: string;
  value?: string;
}
export const EnvironmentParameter = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), value: S.optional(S.String) }),
).annotations({
  identifier: "EnvironmentParameter",
}) as any as S.Schema<EnvironmentParameter>;
export type EnvironmentParametersList = EnvironmentParameter[];
export const EnvironmentParametersList = S.Array(EnvironmentParameter);
export interface CreateEnvironmentProfileInput {
  domainIdentifier: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  environmentBlueprintIdentifier: string;
  projectIdentifier: string;
  userParameters?: EnvironmentParametersList;
  awsAccountId?: string;
  awsAccountRegion?: string;
}
export const CreateEnvironmentProfileInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    environmentBlueprintIdentifier: S.String,
    projectIdentifier: S.String,
    userParameters: S.optional(EnvironmentParametersList),
    awsAccountId: S.optional(S.String),
    awsAccountRegion: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/environment-profiles",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEnvironmentProfileInput",
}) as any as S.Schema<CreateEnvironmentProfileInput>;
export interface CreateGroupProfileInput {
  domainIdentifier: string;
  groupIdentifier: string;
  clientToken?: string;
}
export const CreateGroupProfileInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    groupIdentifier: S.String,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/group-profiles",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateGroupProfileInput",
}) as any as S.Schema<CreateGroupProfileInput>;
export interface CreateListingChangeSetInput {
  domainIdentifier: string;
  entityIdentifier: string;
  entityType: string;
  entityRevision?: string;
  action: string;
  clientToken?: string;
}
export const CreateListingChangeSetInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityIdentifier: S.String,
    entityType: S.String,
    entityRevision: S.optional(S.String),
    action: S.String,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/listings/change-set",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateListingChangeSetInput",
}) as any as S.Schema<CreateListingChangeSetInput>;
export interface CreateUserProfileInput {
  domainIdentifier: string;
  userIdentifier: string;
  userType?: string;
  clientToken?: string;
}
export const CreateUserProfileInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    userIdentifier: S.String,
    userType: S.optional(S.String),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/user-profiles",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateUserProfileInput",
}) as any as S.Schema<CreateUserProfileInput>;
export interface DeleteAccountPoolInput {
  domainIdentifier: string;
  identifier: string;
}
export const DeleteAccountPoolInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/account-pools/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAccountPoolInput",
}) as any as S.Schema<DeleteAccountPoolInput>;
export interface DeleteAccountPoolOutput {}
export const DeleteAccountPoolOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAccountPoolOutput",
}) as any as S.Schema<DeleteAccountPoolOutput>;
export interface DeleteAssetFilterInput {
  domainIdentifier: string;
  assetIdentifier: string;
  identifier: string;
}
export const DeleteAssetFilterInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    assetIdentifier: S.String.pipe(T.HttpLabel("assetIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/assets/{assetIdentifier}/filters/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAssetFilterInput",
}) as any as S.Schema<DeleteAssetFilterInput>;
export interface DeleteAssetFilterResponse {}
export const DeleteAssetFilterResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAssetFilterResponse",
}) as any as S.Schema<DeleteAssetFilterResponse>;
export interface DeleteConnectionInput {
  domainIdentifier: string;
  identifier: string;
}
export const DeleteConnectionInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/connections/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConnectionInput",
}) as any as S.Schema<DeleteConnectionInput>;
export interface DeleteEnvironmentInput {
  domainIdentifier: string;
  identifier: string;
}
export const DeleteEnvironmentInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/environments/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEnvironmentInput",
}) as any as S.Schema<DeleteEnvironmentInput>;
export interface DeleteEnvironmentResponse {}
export const DeleteEnvironmentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEnvironmentResponse",
}) as any as S.Schema<DeleteEnvironmentResponse>;
export interface DeleteEnvironmentActionInput {
  domainIdentifier: string;
  environmentIdentifier: string;
  identifier: string;
}
export const DeleteEnvironmentActionInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/actions/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEnvironmentActionInput",
}) as any as S.Schema<DeleteEnvironmentActionInput>;
export interface DeleteEnvironmentActionResponse {}
export const DeleteEnvironmentActionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEnvironmentActionResponse",
}) as any as S.Schema<DeleteEnvironmentActionResponse>;
export interface DeleteEnvironmentBlueprintInput {
  domainIdentifier: string;
  identifier: string;
}
export const DeleteEnvironmentBlueprintInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/environment-blueprints/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEnvironmentBlueprintInput",
}) as any as S.Schema<DeleteEnvironmentBlueprintInput>;
export interface DeleteEnvironmentBlueprintResponse {}
export const DeleteEnvironmentBlueprintResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEnvironmentBlueprintResponse",
}) as any as S.Schema<DeleteEnvironmentBlueprintResponse>;
export interface DeleteEnvironmentProfileInput {
  domainIdentifier: string;
  identifier: string;
}
export const DeleteEnvironmentProfileInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/environment-profiles/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEnvironmentProfileInput",
}) as any as S.Schema<DeleteEnvironmentProfileInput>;
export interface DeleteEnvironmentProfileResponse {}
export const DeleteEnvironmentProfileResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEnvironmentProfileResponse",
}) as any as S.Schema<DeleteEnvironmentProfileResponse>;
export interface DeleteProjectInput {
  domainIdentifier: string;
  identifier: string;
  skipDeletionCheck?: boolean;
}
export const DeleteProjectInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    skipDeletionCheck: S.optional(S.Boolean).pipe(
      T.HttpQuery("skipDeletionCheck"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/projects/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProjectInput",
}) as any as S.Schema<DeleteProjectInput>;
export interface DeleteProjectOutput {}
export const DeleteProjectOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteProjectOutput",
}) as any as S.Schema<DeleteProjectOutput>;
export type Member = { userIdentifier: string } | { groupIdentifier: string };
export const Member = S.Union(
  S.Struct({ userIdentifier: S.String }),
  S.Struct({ groupIdentifier: S.String }),
);
export interface DeleteProjectMembershipInput {
  domainIdentifier: string;
  projectIdentifier: string;
  member: (typeof Member)["Type"];
}
export const DeleteProjectMembershipInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    projectIdentifier: S.String.pipe(T.HttpLabel("projectIdentifier")),
    member: Member,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/projects/{projectIdentifier}/deleteMembership",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProjectMembershipInput",
}) as any as S.Schema<DeleteProjectMembershipInput>;
export interface DeleteProjectMembershipOutput {}
export const DeleteProjectMembershipOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteProjectMembershipOutput",
}) as any as S.Schema<DeleteProjectMembershipOutput>;
export interface DeleteProjectProfileInput {
  domainIdentifier: string;
  identifier: string;
}
export const DeleteProjectProfileInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/project-profiles/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProjectProfileInput",
}) as any as S.Schema<DeleteProjectProfileInput>;
export interface DeleteProjectProfileOutput {}
export const DeleteProjectProfileOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteProjectProfileOutput",
}) as any as S.Schema<DeleteProjectProfileOutput>;
export interface DeleteSubscriptionGrantInput {
  domainIdentifier: string;
  identifier: string;
}
export const DeleteSubscriptionGrantInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/subscription-grants/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSubscriptionGrantInput",
}) as any as S.Schema<DeleteSubscriptionGrantInput>;
export interface DeleteSubscriptionRequestInput {
  domainIdentifier: string;
  identifier: string;
}
export const DeleteSubscriptionRequestInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/subscription-requests/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSubscriptionRequestInput",
}) as any as S.Schema<DeleteSubscriptionRequestInput>;
export interface DeleteSubscriptionRequestResponse {}
export const DeleteSubscriptionRequestResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSubscriptionRequestResponse",
}) as any as S.Schema<DeleteSubscriptionRequestResponse>;
export interface DeleteSubscriptionTargetInput {
  domainIdentifier: string;
  environmentIdentifier: string;
  identifier: string;
}
export const DeleteSubscriptionTargetInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/subscription-targets/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSubscriptionTargetInput",
}) as any as S.Schema<DeleteSubscriptionTargetInput>;
export interface DeleteSubscriptionTargetResponse {}
export const DeleteSubscriptionTargetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSubscriptionTargetResponse",
}) as any as S.Schema<DeleteSubscriptionTargetResponse>;
export interface DeleteTimeSeriesDataPointsInput {
  domainIdentifier: string;
  entityIdentifier: string;
  entityType: string;
  formName: string;
  clientToken?: string;
}
export const DeleteTimeSeriesDataPointsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    formName: S.String.pipe(T.HttpQuery("formName")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/entities/{entityType}/{entityIdentifier}/time-series-data-points",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTimeSeriesDataPointsInput",
}) as any as S.Schema<DeleteTimeSeriesDataPointsInput>;
export interface DeleteTimeSeriesDataPointsOutput {}
export const DeleteTimeSeriesDataPointsOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTimeSeriesDataPointsOutput",
}) as any as S.Schema<DeleteTimeSeriesDataPointsOutput>;
export interface DisassociateEnvironmentRoleInput {
  domainIdentifier: string;
  environmentIdentifier: string;
  environmentRoleArn: string;
}
export const DisassociateEnvironmentRoleInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    environmentRoleArn: S.String.pipe(T.HttpLabel("environmentRoleArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/roles/{environmentRoleArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateEnvironmentRoleInput",
}) as any as S.Schema<DisassociateEnvironmentRoleInput>;
export interface DisassociateEnvironmentRoleOutput {}
export const DisassociateEnvironmentRoleOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateEnvironmentRoleOutput",
}) as any as S.Schema<DisassociateEnvironmentRoleOutput>;
export interface DisassociateGovernedTermsInput {
  domainIdentifier: string;
  entityIdentifier: string;
  entityType: string;
  governedGlossaryTerms: GovernedGlossaryTerms;
}
export const DisassociateGovernedTermsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    governedGlossaryTerms: GovernedGlossaryTerms,
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/v2/domains/{domainIdentifier}/entities/{entityType}/{entityIdentifier}/disassociate-governed-terms",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateGovernedTermsInput",
}) as any as S.Schema<DisassociateGovernedTermsInput>;
export interface DisassociateGovernedTermsOutput {}
export const DisassociateGovernedTermsOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateGovernedTermsOutput",
}) as any as S.Schema<DisassociateGovernedTermsOutput>;
export interface GetAccountPoolInput {
  domainIdentifier: string;
  identifier: string;
}
export const GetAccountPoolInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/account-pools/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAccountPoolInput",
}) as any as S.Schema<GetAccountPoolInput>;
export interface GetAssetFilterInput {
  domainIdentifier: string;
  assetIdentifier: string;
  identifier: string;
}
export const GetAssetFilterInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    assetIdentifier: S.String.pipe(T.HttpLabel("assetIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/assets/{assetIdentifier}/filters/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAssetFilterInput",
}) as any as S.Schema<GetAssetFilterInput>;
export interface GetConnectionInput {
  domainIdentifier: string;
  identifier: string;
  withSecret?: boolean;
}
export const GetConnectionInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    withSecret: S.optional(S.Boolean).pipe(T.HttpQuery("withSecret")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/connections/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConnectionInput",
}) as any as S.Schema<GetConnectionInput>;
export interface GetDataExportConfigurationInput {
  domainIdentifier: string;
}
export const GetDataExportConfigurationInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/data-export-configuration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDataExportConfigurationInput",
}) as any as S.Schema<GetDataExportConfigurationInput>;
export interface GetEnvironmentInput {
  domainIdentifier: string;
  identifier: string;
}
export const GetEnvironmentInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/environments/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEnvironmentInput",
}) as any as S.Schema<GetEnvironmentInput>;
export interface GetEnvironmentActionInput {
  domainIdentifier: string;
  environmentIdentifier: string;
  identifier: string;
}
export const GetEnvironmentActionInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/actions/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEnvironmentActionInput",
}) as any as S.Schema<GetEnvironmentActionInput>;
export interface GetEnvironmentBlueprintInput {
  domainIdentifier: string;
  identifier: string;
}
export const GetEnvironmentBlueprintInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/environment-blueprints/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEnvironmentBlueprintInput",
}) as any as S.Schema<GetEnvironmentBlueprintInput>;
export interface GetEnvironmentCredentialsInput {
  domainIdentifier: string;
  environmentIdentifier: string;
}
export const GetEnvironmentCredentialsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/credentials",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEnvironmentCredentialsInput",
}) as any as S.Schema<GetEnvironmentCredentialsInput>;
export interface GetEnvironmentProfileInput {
  domainIdentifier: string;
  identifier: string;
}
export const GetEnvironmentProfileInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/environment-profiles/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEnvironmentProfileInput",
}) as any as S.Schema<GetEnvironmentProfileInput>;
export interface GetGroupProfileInput {
  domainIdentifier: string;
  groupIdentifier: string;
}
export const GetGroupProfileInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    groupIdentifier: S.String.pipe(T.HttpLabel("groupIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/group-profiles/{groupIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGroupProfileInput",
}) as any as S.Schema<GetGroupProfileInput>;
export interface GetIamPortalLoginUrlInput {
  domainIdentifier: string;
}
export const GetIamPortalLoginUrlInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/get-portal-login-url",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIamPortalLoginUrlInput",
}) as any as S.Schema<GetIamPortalLoginUrlInput>;
export interface GetJobRunInput {
  domainIdentifier: string;
  identifier: string;
}
export const GetJobRunInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/jobRuns/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetJobRunInput",
}) as any as S.Schema<GetJobRunInput>;
export interface GetLineageEventInput {
  domainIdentifier: string;
  identifier: string;
}
export const GetLineageEventInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/lineage/events/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLineageEventInput",
}) as any as S.Schema<GetLineageEventInput>;
export interface GetLineageNodeInput {
  domainIdentifier: string;
  identifier: string;
  eventTimestamp?: Date;
}
export const GetLineageNodeInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    eventTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("timestamp")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/lineage/nodes/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLineageNodeInput",
}) as any as S.Schema<GetLineageNodeInput>;
export interface GetProjectInput {
  domainIdentifier: string;
  identifier: string;
}
export const GetProjectInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/projects/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProjectInput",
}) as any as S.Schema<GetProjectInput>;
export interface GetProjectProfileInput {
  domainIdentifier: string;
  identifier: string;
}
export const GetProjectProfileInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/project-profiles/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProjectProfileInput",
}) as any as S.Schema<GetProjectProfileInput>;
export interface GetSubscriptionInput {
  domainIdentifier: string;
  identifier: string;
}
export const GetSubscriptionInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/subscriptions/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSubscriptionInput",
}) as any as S.Schema<GetSubscriptionInput>;
export interface GetSubscriptionGrantInput {
  domainIdentifier: string;
  identifier: string;
}
export const GetSubscriptionGrantInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/subscription-grants/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSubscriptionGrantInput",
}) as any as S.Schema<GetSubscriptionGrantInput>;
export interface GetSubscriptionRequestDetailsInput {
  domainIdentifier: string;
  identifier: string;
}
export const GetSubscriptionRequestDetailsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/subscription-requests/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSubscriptionRequestDetailsInput",
}) as any as S.Schema<GetSubscriptionRequestDetailsInput>;
export interface GetSubscriptionTargetInput {
  domainIdentifier: string;
  environmentIdentifier: string;
  identifier: string;
}
export const GetSubscriptionTargetInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/subscription-targets/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSubscriptionTargetInput",
}) as any as S.Schema<GetSubscriptionTargetInput>;
export interface GetTimeSeriesDataPointInput {
  domainIdentifier: string;
  entityIdentifier: string;
  entityType: string;
  identifier: string;
  formName: string;
}
export const GetTimeSeriesDataPointInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    formName: S.String.pipe(T.HttpQuery("formName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/entities/{entityType}/{entityIdentifier}/time-series-data-points/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTimeSeriesDataPointInput",
}) as any as S.Schema<GetTimeSeriesDataPointInput>;
export interface GetUserProfileInput {
  domainIdentifier: string;
  userIdentifier: string;
  type?: string;
}
export const GetUserProfileInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    userIdentifier: S.String.pipe(T.HttpLabel("userIdentifier")),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/user-profiles/{userIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUserProfileInput",
}) as any as S.Schema<GetUserProfileInput>;
export interface ListAccountPoolsInput {
  domainIdentifier: string;
  name?: string | Redacted.Redacted<string>;
  sortBy?: string;
  sortOrder?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAccountPoolsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: S.optional(SensitiveString).pipe(T.HttpQuery("name")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/account-pools",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAccountPoolsInput",
}) as any as S.Schema<ListAccountPoolsInput>;
export interface ListAccountsInAccountPoolInput {
  domainIdentifier: string;
  identifier: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAccountsInAccountPoolInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/account-pools/{identifier}/accounts",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAccountsInAccountPoolInput",
}) as any as S.Schema<ListAccountsInAccountPoolInput>;
export interface ListAssetFiltersInput {
  domainIdentifier: string;
  assetIdentifier: string;
  status?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAssetFiltersInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    assetIdentifier: S.String.pipe(T.HttpLabel("assetIdentifier")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/assets/{assetIdentifier}/filters",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssetFiltersInput",
}) as any as S.Schema<ListAssetFiltersInput>;
export interface ListAssetRevisionsInput {
  domainIdentifier: string;
  identifier: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAssetRevisionsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/assets/{identifier}/revisions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssetRevisionsInput",
}) as any as S.Schema<ListAssetRevisionsInput>;
export interface ListConnectionsInput {
  domainIdentifier: string;
  maxResults?: number;
  nextToken?: string;
  sortBy?: string;
  sortOrder?: string;
  name?: string;
  environmentIdentifier?: string;
  projectIdentifier?: string;
  type?: string;
  scope?: string;
}
export const ListConnectionsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    environmentIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("environmentIdentifier"),
    ),
    projectIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("projectIdentifier"),
    ),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
    scope: S.optional(S.String).pipe(T.HttpQuery("scope")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/connections",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConnectionsInput",
}) as any as S.Schema<ListConnectionsInput>;
export interface ListDataProductRevisionsInput {
  domainIdentifier: string;
  identifier: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListDataProductRevisionsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/data-products/{identifier}/revisions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDataProductRevisionsInput",
}) as any as S.Schema<ListDataProductRevisionsInput>;
export interface ListDataSourceRunActivitiesInput {
  domainIdentifier: string;
  identifier: string;
  status?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListDataSourceRunActivitiesInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/data-source-runs/{identifier}/activities",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDataSourceRunActivitiesInput",
}) as any as S.Schema<ListDataSourceRunActivitiesInput>;
export interface ListEntityOwnersInput {
  domainIdentifier: string;
  entityType: string;
  entityIdentifier: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListEntityOwnersInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/entities/{entityType}/{entityIdentifier}/owners",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEntityOwnersInput",
}) as any as S.Schema<ListEntityOwnersInput>;
export interface ListEnvironmentActionsInput {
  domainIdentifier: string;
  environmentIdentifier: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListEnvironmentActionsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/actions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEnvironmentActionsInput",
}) as any as S.Schema<ListEnvironmentActionsInput>;
export interface ListEnvironmentBlueprintsInput {
  domainIdentifier: string;
  maxResults?: number;
  nextToken?: string;
  name?: string;
  managed?: boolean;
}
export const ListEnvironmentBlueprintsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    managed: S.optional(S.Boolean).pipe(T.HttpQuery("managed")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/environment-blueprints",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEnvironmentBlueprintsInput",
}) as any as S.Schema<ListEnvironmentBlueprintsInput>;
export interface ListEnvironmentProfilesInput {
  domainIdentifier: string;
  awsAccountId?: string;
  awsAccountRegion?: string;
  environmentBlueprintIdentifier?: string;
  projectIdentifier?: string;
  name?: string | Redacted.Redacted<string>;
  nextToken?: string;
  maxResults?: number;
}
export const ListEnvironmentProfilesInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    awsAccountId: S.optional(S.String).pipe(T.HttpQuery("awsAccountId")),
    awsAccountRegion: S.optional(S.String).pipe(
      T.HttpQuery("awsAccountRegion"),
    ),
    environmentBlueprintIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("environmentBlueprintIdentifier"),
    ),
    projectIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("projectIdentifier"),
    ),
    name: S.optional(SensitiveString).pipe(T.HttpQuery("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/environment-profiles",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEnvironmentProfilesInput",
}) as any as S.Schema<ListEnvironmentProfilesInput>;
export interface ListEnvironmentsInput {
  domainIdentifier: string;
  awsAccountId?: string;
  status?: string;
  awsAccountRegion?: string;
  projectIdentifier: string;
  environmentProfileIdentifier?: string;
  environmentBlueprintIdentifier?: string;
  provider?: string;
  name?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListEnvironmentsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    awsAccountId: S.optional(S.String).pipe(T.HttpQuery("awsAccountId")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    awsAccountRegion: S.optional(S.String).pipe(
      T.HttpQuery("awsAccountRegion"),
    ),
    projectIdentifier: S.String.pipe(T.HttpQuery("projectIdentifier")),
    environmentProfileIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("environmentProfileIdentifier"),
    ),
    environmentBlueprintIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("environmentBlueprintIdentifier"),
    ),
    provider: S.optional(S.String).pipe(T.HttpQuery("provider")),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/environments",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEnvironmentsInput",
}) as any as S.Schema<ListEnvironmentsInput>;
export interface ListJobRunsInput {
  domainIdentifier: string;
  jobIdentifier: string;
  status?: string;
  sortOrder?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListJobRunsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    jobIdentifier: S.String.pipe(T.HttpLabel("jobIdentifier")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/jobs/{jobIdentifier}/runs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListJobRunsInput",
}) as any as S.Schema<ListJobRunsInput>;
export interface ListLineageEventsInput {
  domainIdentifier: string;
  maxResults?: number;
  timestampAfter?: Date;
  timestampBefore?: Date;
  processingStatus?: string;
  sortOrder?: string;
  nextToken?: string;
}
export const ListLineageEventsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    timestampAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("timestampAfter")),
    timestampBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("timestampBefore")),
    processingStatus: S.optional(S.String).pipe(
      T.HttpQuery("processingStatus"),
    ),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/lineage/events",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLineageEventsInput",
}) as any as S.Schema<ListLineageEventsInput>;
export interface ListLineageNodeHistoryInput {
  domainIdentifier: string;
  maxResults?: number;
  nextToken?: string;
  identifier: string;
  direction?: string;
  eventTimestampGTE?: Date;
  eventTimestampLTE?: Date;
  sortOrder?: string;
}
export const ListLineageNodeHistoryInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    direction: S.optional(S.String).pipe(T.HttpQuery("direction")),
    eventTimestampGTE: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("timestampGTE")),
    eventTimestampLTE: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("timestampLTE")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/lineage/nodes/{identifier}/history",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLineageNodeHistoryInput",
}) as any as S.Schema<ListLineageNodeHistoryInput>;
export interface ListNotificationsInput {
  domainIdentifier: string;
  type: string;
  afterTimestamp?: Date;
  beforeTimestamp?: Date;
  subjects?: NotificationSubjects;
  taskStatus?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListNotificationsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    type: S.String.pipe(T.HttpQuery("type")),
    afterTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("afterTimestamp")),
    beforeTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("beforeTimestamp")),
    subjects: S.optional(NotificationSubjects).pipe(T.HttpQuery("subjects")),
    taskStatus: S.optional(S.String).pipe(T.HttpQuery("taskStatus")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/notifications",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListNotificationsInput",
}) as any as S.Schema<ListNotificationsInput>;
export interface ListPolicyGrantsInput {
  domainIdentifier: string;
  entityType: string;
  entityIdentifier: string;
  policyType: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListPolicyGrantsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    policyType: S.String.pipe(T.HttpQuery("policyType")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/policies/managed/{entityType}/{entityIdentifier}/grants",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPolicyGrantsInput",
}) as any as S.Schema<ListPolicyGrantsInput>;
export interface ListProjectMembershipsInput {
  domainIdentifier: string;
  projectIdentifier: string;
  sortBy?: string;
  sortOrder?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListProjectMembershipsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    projectIdentifier: S.String.pipe(T.HttpLabel("projectIdentifier")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/projects/{projectIdentifier}/memberships",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProjectMembershipsInput",
}) as any as S.Schema<ListProjectMembershipsInput>;
export interface ListProjectProfilesInput {
  domainIdentifier: string;
  name?: string | Redacted.Redacted<string>;
  sortBy?: string;
  sortOrder?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListProjectProfilesInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: S.optional(SensitiveString).pipe(T.HttpQuery("name")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/project-profiles",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProjectProfilesInput",
}) as any as S.Schema<ListProjectProfilesInput>;
export interface ListProjectsInput {
  domainIdentifier: string;
  userIdentifier?: string;
  groupIdentifier?: string;
  name?: string | Redacted.Redacted<string>;
  nextToken?: string;
  maxResults?: number;
}
export const ListProjectsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    userIdentifier: S.optional(S.String).pipe(T.HttpQuery("userIdentifier")),
    groupIdentifier: S.optional(S.String).pipe(T.HttpQuery("groupIdentifier")),
    name: S.optional(SensitiveString).pipe(T.HttpQuery("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/domains/{domainIdentifier}/projects" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProjectsInput",
}) as any as S.Schema<ListProjectsInput>;
export interface ListSubscriptionGrantsInput {
  domainIdentifier: string;
  environmentId?: string;
  subscriptionTargetId?: string;
  subscribedListingId?: string;
  subscriptionId?: string;
  owningProjectId?: string;
  owningUserId?: string;
  owningGroupId?: string;
  sortBy?: string;
  sortOrder?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListSubscriptionGrantsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentId: S.optional(S.String).pipe(T.HttpQuery("environmentId")),
    subscriptionTargetId: S.optional(S.String).pipe(
      T.HttpQuery("subscriptionTargetId"),
    ),
    subscribedListingId: S.optional(S.String).pipe(
      T.HttpQuery("subscribedListingId"),
    ),
    subscriptionId: S.optional(S.String).pipe(T.HttpQuery("subscriptionId")),
    owningProjectId: S.optional(S.String).pipe(T.HttpQuery("owningProjectId")),
    owningUserId: S.optional(S.String).pipe(T.HttpQuery("owningUserId")),
    owningGroupId: S.optional(S.String).pipe(T.HttpQuery("owningGroupId")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/subscription-grants",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSubscriptionGrantsInput",
}) as any as S.Schema<ListSubscriptionGrantsInput>;
export interface ListSubscriptionRequestsInput {
  domainIdentifier: string;
  status?: string;
  subscribedListingId?: string;
  owningProjectId?: string;
  approverProjectId?: string;
  owningUserId?: string;
  owningGroupId?: string;
  sortBy?: string;
  sortOrder?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListSubscriptionRequestsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    subscribedListingId: S.optional(S.String).pipe(
      T.HttpQuery("subscribedListingId"),
    ),
    owningProjectId: S.optional(S.String).pipe(T.HttpQuery("owningProjectId")),
    approverProjectId: S.optional(S.String).pipe(
      T.HttpQuery("approverProjectId"),
    ),
    owningUserId: S.optional(S.String).pipe(T.HttpQuery("owningUserId")),
    owningGroupId: S.optional(S.String).pipe(T.HttpQuery("owningGroupId")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/subscription-requests",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSubscriptionRequestsInput",
}) as any as S.Schema<ListSubscriptionRequestsInput>;
export interface ListSubscriptionsInput {
  domainIdentifier: string;
  subscriptionRequestIdentifier?: string;
  status?: string;
  subscribedListingId?: string;
  owningProjectId?: string;
  owningUserId?: string;
  owningGroupId?: string;
  approverProjectId?: string;
  sortBy?: string;
  sortOrder?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListSubscriptionsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    subscriptionRequestIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("subscriptionRequestIdentifier"),
    ),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    subscribedListingId: S.optional(S.String).pipe(
      T.HttpQuery("subscribedListingId"),
    ),
    owningProjectId: S.optional(S.String).pipe(T.HttpQuery("owningProjectId")),
    owningUserId: S.optional(S.String).pipe(T.HttpQuery("owningUserId")),
    owningGroupId: S.optional(S.String).pipe(T.HttpQuery("owningGroupId")),
    approverProjectId: S.optional(S.String).pipe(
      T.HttpQuery("approverProjectId"),
    ),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/subscriptions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSubscriptionsInput",
}) as any as S.Schema<ListSubscriptionsInput>;
export interface ListSubscriptionTargetsInput {
  domainIdentifier: string;
  environmentIdentifier: string;
  sortBy?: string;
  sortOrder?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListSubscriptionTargetsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/subscription-targets",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSubscriptionTargetsInput",
}) as any as S.Schema<ListSubscriptionTargetsInput>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
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
export interface ListTimeSeriesDataPointsInput {
  domainIdentifier: string;
  entityIdentifier: string;
  entityType: string;
  formName: string;
  startedAt?: Date;
  endedAt?: Date;
  nextToken?: string;
  maxResults?: number;
}
export const ListTimeSeriesDataPointsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    formName: S.String.pipe(T.HttpQuery("formName")),
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("startedAt"),
    ),
    endedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("endedAt"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/entities/{entityType}/{entityIdentifier}/time-series-data-points",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTimeSeriesDataPointsInput",
}) as any as S.Schema<ListTimeSeriesDataPointsInput>;
export interface PostLineageEventInput {
  domainIdentifier: string;
  event: T.StreamingInputBody;
  clientToken?: string;
}
export const PostLineageEventInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    event: T.StreamingInput.pipe(T.HttpPayload()),
    clientToken: S.optional(S.String).pipe(T.HttpHeader("Client-Token")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/lineage/events",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PostLineageEventInput",
}) as any as S.Schema<PostLineageEventInput>;
export interface RejectSubscriptionRequestInput {
  domainIdentifier: string;
  identifier: string;
  decisionComment?: string | Redacted.Redacted<string>;
}
export const RejectSubscriptionRequestInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    decisionComment: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/domains/{domainIdentifier}/subscription-requests/{identifier}/reject",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RejectSubscriptionRequestInput",
}) as any as S.Schema<RejectSubscriptionRequestInput>;
export interface OwnerUserProperties {
  userIdentifier: string;
}
export const OwnerUserProperties = S.suspend(() =>
  S.Struct({ userIdentifier: S.String }),
).annotations({
  identifier: "OwnerUserProperties",
}) as any as S.Schema<OwnerUserProperties>;
export interface OwnerGroupProperties {
  groupIdentifier: string;
}
export const OwnerGroupProperties = S.suspend(() =>
  S.Struct({ groupIdentifier: S.String }),
).annotations({
  identifier: "OwnerGroupProperties",
}) as any as S.Schema<OwnerGroupProperties>;
export type OwnerProperties =
  | { user: OwnerUserProperties }
  | { group: OwnerGroupProperties };
export const OwnerProperties = S.Union(
  S.Struct({ user: OwnerUserProperties }),
  S.Struct({ group: OwnerGroupProperties }),
);
export interface RemoveEntityOwnerInput {
  domainIdentifier: string;
  entityType: string;
  entityIdentifier: string;
  owner: (typeof OwnerProperties)["Type"];
  clientToken?: string;
}
export const RemoveEntityOwnerInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    owner: OwnerProperties,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/entities/{entityType}/{entityIdentifier}/removeOwner",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveEntityOwnerInput",
}) as any as S.Schema<RemoveEntityOwnerInput>;
export interface RemoveEntityOwnerOutput {}
export const RemoveEntityOwnerOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RemoveEntityOwnerOutput",
}) as any as S.Schema<RemoveEntityOwnerOutput>;
export interface AllUsersGrantFilter {}
export const AllUsersGrantFilter = S.suspend(() => S.Struct({})).annotations({
  identifier: "AllUsersGrantFilter",
}) as any as S.Schema<AllUsersGrantFilter>;
export type UserPolicyGrantPrincipal =
  | { userIdentifier: string }
  | { allUsersGrantFilter: AllUsersGrantFilter };
export const UserPolicyGrantPrincipal = S.Union(
  S.Struct({ userIdentifier: S.String }),
  S.Struct({ allUsersGrantFilter: AllUsersGrantFilter }),
);
export type GroupPolicyGrantPrincipal = { groupIdentifier: string };
export const GroupPolicyGrantPrincipal = S.Union(
  S.Struct({ groupIdentifier: S.String }),
);
export interface DomainUnitFilterForProject {
  domainUnit: string;
  includeChildDomainUnits?: boolean;
}
export const DomainUnitFilterForProject = S.suspend(() =>
  S.Struct({
    domainUnit: S.String,
    includeChildDomainUnits: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DomainUnitFilterForProject",
}) as any as S.Schema<DomainUnitFilterForProject>;
export type ProjectGrantFilter = {
  domainUnitFilter: DomainUnitFilterForProject;
};
export const ProjectGrantFilter = S.Union(
  S.Struct({ domainUnitFilter: DomainUnitFilterForProject }),
);
export interface ProjectPolicyGrantPrincipal {
  projectDesignation: string;
  projectIdentifier?: string;
  projectGrantFilter?: (typeof ProjectGrantFilter)["Type"];
}
export const ProjectPolicyGrantPrincipal = S.suspend(() =>
  S.Struct({
    projectDesignation: S.String,
    projectIdentifier: S.optional(S.String),
    projectGrantFilter: S.optional(ProjectGrantFilter),
  }),
).annotations({
  identifier: "ProjectPolicyGrantPrincipal",
}) as any as S.Schema<ProjectPolicyGrantPrincipal>;
export interface AllDomainUnitsGrantFilter {}
export const AllDomainUnitsGrantFilter = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AllDomainUnitsGrantFilter",
}) as any as S.Schema<AllDomainUnitsGrantFilter>;
export type DomainUnitGrantFilter = {
  allDomainUnitsGrantFilter: AllDomainUnitsGrantFilter;
};
export const DomainUnitGrantFilter = S.Union(
  S.Struct({ allDomainUnitsGrantFilter: AllDomainUnitsGrantFilter }),
);
export interface DomainUnitPolicyGrantPrincipal {
  domainUnitDesignation: string;
  domainUnitIdentifier?: string;
  domainUnitGrantFilter?: (typeof DomainUnitGrantFilter)["Type"];
}
export const DomainUnitPolicyGrantPrincipal = S.suspend(() =>
  S.Struct({
    domainUnitDesignation: S.String,
    domainUnitIdentifier: S.optional(S.String),
    domainUnitGrantFilter: S.optional(DomainUnitGrantFilter),
  }),
).annotations({
  identifier: "DomainUnitPolicyGrantPrincipal",
}) as any as S.Schema<DomainUnitPolicyGrantPrincipal>;
export type PolicyGrantPrincipal =
  | { user: (typeof UserPolicyGrantPrincipal)["Type"] }
  | { group: (typeof GroupPolicyGrantPrincipal)["Type"] }
  | { project: ProjectPolicyGrantPrincipal }
  | { domainUnit: DomainUnitPolicyGrantPrincipal };
export const PolicyGrantPrincipal = S.Union(
  S.Struct({ user: UserPolicyGrantPrincipal }),
  S.Struct({ group: GroupPolicyGrantPrincipal }),
  S.Struct({ project: ProjectPolicyGrantPrincipal }),
  S.Struct({ domainUnit: DomainUnitPolicyGrantPrincipal }),
);
export interface RemovePolicyGrantInput {
  domainIdentifier: string;
  entityType: string;
  entityIdentifier: string;
  policyType: string;
  principal: (typeof PolicyGrantPrincipal)["Type"];
  grantIdentifier?: string;
  clientToken?: string;
}
export const RemovePolicyGrantInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    policyType: S.String,
    principal: PolicyGrantPrincipal,
    grantIdentifier: S.optional(S.String),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/policies/managed/{entityType}/{entityIdentifier}/removeGrant",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemovePolicyGrantInput",
}) as any as S.Schema<RemovePolicyGrantInput>;
export interface RemovePolicyGrantOutput {}
export const RemovePolicyGrantOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RemovePolicyGrantOutput",
}) as any as S.Schema<RemovePolicyGrantOutput>;
export interface RevokeSubscriptionInput {
  domainIdentifier: string;
  identifier: string;
  retainPermissions?: boolean;
}
export const RevokeSubscriptionInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    retainPermissions: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/domains/{domainIdentifier}/subscriptions/{identifier}/revoke",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RevokeSubscriptionInput",
}) as any as S.Schema<RevokeSubscriptionInput>;
export interface SearchGroupProfilesInput {
  domainIdentifier: string;
  groupType: string;
  searchText?: string | Redacted.Redacted<string>;
  maxResults?: number;
  nextToken?: string;
}
export const SearchGroupProfilesInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    groupType: S.String,
    searchText: S.optional(SensitiveString),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/search-group-profiles",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchGroupProfilesInput",
}) as any as S.Schema<SearchGroupProfilesInput>;
export interface SearchInItem {
  attribute: string;
}
export const SearchInItem = S.suspend(() =>
  S.Struct({ attribute: S.String }),
).annotations({ identifier: "SearchInItem" }) as any as S.Schema<SearchInItem>;
export type SearchInList = SearchInItem[];
export const SearchInList = S.Array(SearchInItem);
export interface Filter {
  attribute: string;
  value: string;
}
export const Filter = S.suspend(() =>
  S.Struct({ attribute: S.String, value: S.String }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type FilterClause =
  | { filter: Filter }
  | { and: FilterList }
  | { or: FilterList };
export const FilterClause = S.Union(
  S.Struct({ filter: Filter }),
  S.Struct({
    and: S.suspend(() => FilterList).annotations({ identifier: "FilterList" }),
  }),
  S.Struct({
    or: S.suspend(() => FilterList).annotations({ identifier: "FilterList" }),
  }),
) as any as S.Schema<FilterClause>;
export interface SearchSort {
  attribute: string;
  order?: string;
}
export const SearchSort = S.suspend(() =>
  S.Struct({ attribute: S.String, order: S.optional(S.String) }),
).annotations({ identifier: "SearchSort" }) as any as S.Schema<SearchSort>;
export interface SearchTypesInput {
  domainIdentifier: string;
  maxResults?: number;
  nextToken?: string;
  searchScope: string;
  searchText?: string;
  searchIn?: SearchInList;
  filters?: FilterClause;
  sort?: SearchSort;
  managed: boolean;
}
export const SearchTypesInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    searchScope: S.String,
    searchText: S.optional(S.String),
    searchIn: S.optional(SearchInList),
    filters: S.optional(FilterClause),
    sort: S.optional(SearchSort),
    managed: S.Boolean,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/types-search",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchTypesInput",
}) as any as S.Schema<SearchTypesInput>;
export interface SearchUserProfilesInput {
  domainIdentifier: string;
  userType: string;
  searchText?: string | Redacted.Redacted<string>;
  maxResults?: number;
  nextToken?: string;
}
export const SearchUserProfilesInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    userType: S.String,
    searchText: S.optional(SensitiveString),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/search-user-profiles",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchUserProfilesInput",
}) as any as S.Schema<SearchUserProfilesInput>;
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface TagResourceRequest {
  resourceArn: string;
  tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: Tags,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export type AwsRegionList = string[];
export const AwsRegionList = S.Array(S.String);
export interface AccountInfo {
  awsAccountId: string;
  supportedRegions: AwsRegionList;
  awsAccountName?: string | Redacted.Redacted<string>;
}
export const AccountInfo = S.suspend(() =>
  S.Struct({
    awsAccountId: S.String,
    supportedRegions: AwsRegionList,
    awsAccountName: S.optional(SensitiveString),
  }),
).annotations({ identifier: "AccountInfo" }) as any as S.Schema<AccountInfo>;
export type AccountInfoList = AccountInfo[];
export const AccountInfoList = S.Array(AccountInfo);
export interface CustomAccountPoolHandler {
  lambdaFunctionArn: string;
  lambdaExecutionRoleArn?: string;
}
export const CustomAccountPoolHandler = S.suspend(() =>
  S.Struct({
    lambdaFunctionArn: S.String,
    lambdaExecutionRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomAccountPoolHandler",
}) as any as S.Schema<CustomAccountPoolHandler>;
export type AccountSource =
  | { accounts: AccountInfoList }
  | { customAccountPoolHandler: CustomAccountPoolHandler };
export const AccountSource = S.Union(
  S.Struct({ accounts: AccountInfoList }),
  S.Struct({ customAccountPoolHandler: CustomAccountPoolHandler }),
);
export interface UpdateAccountPoolInput {
  domainIdentifier: string;
  identifier: string;
  name?: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  resolutionStrategy?: string;
  accountSource?: (typeof AccountSource)["Type"];
}
export const UpdateAccountPoolInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    resolutionStrategy: S.optional(S.String),
    accountSource: S.optional(AccountSource),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/v2/domains/{domainIdentifier}/account-pools/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAccountPoolInput",
}) as any as S.Schema<UpdateAccountPoolInput>;
export type ColumnNameList = string[];
export const ColumnNameList = S.Array(S.String);
export interface ColumnFilterConfiguration {
  includedColumnNames?: ColumnNameList;
}
export const ColumnFilterConfiguration = S.suspend(() =>
  S.Struct({ includedColumnNames: S.optional(ColumnNameList) }),
).annotations({
  identifier: "ColumnFilterConfiguration",
}) as any as S.Schema<ColumnFilterConfiguration>;
export interface EqualToExpression {
  columnName: string;
  value: string;
}
export const EqualToExpression = S.suspend(() =>
  S.Struct({ columnName: S.String, value: S.String }),
).annotations({
  identifier: "EqualToExpression",
}) as any as S.Schema<EqualToExpression>;
export interface NotEqualToExpression {
  columnName: string;
  value: string;
}
export const NotEqualToExpression = S.suspend(() =>
  S.Struct({ columnName: S.String, value: S.String }),
).annotations({
  identifier: "NotEqualToExpression",
}) as any as S.Schema<NotEqualToExpression>;
export interface GreaterThanExpression {
  columnName: string;
  value: string;
}
export const GreaterThanExpression = S.suspend(() =>
  S.Struct({ columnName: S.String, value: S.String }),
).annotations({
  identifier: "GreaterThanExpression",
}) as any as S.Schema<GreaterThanExpression>;
export interface LessThanExpression {
  columnName: string;
  value: string;
}
export const LessThanExpression = S.suspend(() =>
  S.Struct({ columnName: S.String, value: S.String }),
).annotations({
  identifier: "LessThanExpression",
}) as any as S.Schema<LessThanExpression>;
export interface GreaterThanOrEqualToExpression {
  columnName: string;
  value: string;
}
export const GreaterThanOrEqualToExpression = S.suspend(() =>
  S.Struct({ columnName: S.String, value: S.String }),
).annotations({
  identifier: "GreaterThanOrEqualToExpression",
}) as any as S.Schema<GreaterThanOrEqualToExpression>;
export interface LessThanOrEqualToExpression {
  columnName: string;
  value: string;
}
export const LessThanOrEqualToExpression = S.suspend(() =>
  S.Struct({ columnName: S.String, value: S.String }),
).annotations({
  identifier: "LessThanOrEqualToExpression",
}) as any as S.Schema<LessThanOrEqualToExpression>;
export interface IsNullExpression {
  columnName: string;
}
export const IsNullExpression = S.suspend(() =>
  S.Struct({ columnName: S.String }),
).annotations({
  identifier: "IsNullExpression",
}) as any as S.Schema<IsNullExpression>;
export interface IsNotNullExpression {
  columnName: string;
}
export const IsNotNullExpression = S.suspend(() =>
  S.Struct({ columnName: S.String }),
).annotations({
  identifier: "IsNotNullExpression",
}) as any as S.Schema<IsNotNullExpression>;
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface InExpression {
  columnName: string;
  values: StringList;
}
export const InExpression = S.suspend(() =>
  S.Struct({ columnName: S.String, values: StringList }),
).annotations({ identifier: "InExpression" }) as any as S.Schema<InExpression>;
export interface NotInExpression {
  columnName: string;
  values: StringList;
}
export const NotInExpression = S.suspend(() =>
  S.Struct({ columnName: S.String, values: StringList }),
).annotations({
  identifier: "NotInExpression",
}) as any as S.Schema<NotInExpression>;
export interface LikeExpression {
  columnName: string;
  value: string;
}
export const LikeExpression = S.suspend(() =>
  S.Struct({ columnName: S.String, value: S.String }),
).annotations({
  identifier: "LikeExpression",
}) as any as S.Schema<LikeExpression>;
export interface NotLikeExpression {
  columnName: string;
  value: string;
}
export const NotLikeExpression = S.suspend(() =>
  S.Struct({ columnName: S.String, value: S.String }),
).annotations({
  identifier: "NotLikeExpression",
}) as any as S.Schema<NotLikeExpression>;
export type RowFilterExpression =
  | { equalTo: EqualToExpression }
  | { notEqualTo: NotEqualToExpression }
  | { greaterThan: GreaterThanExpression }
  | { lessThan: LessThanExpression }
  | { greaterThanOrEqualTo: GreaterThanOrEqualToExpression }
  | { lessThanOrEqualTo: LessThanOrEqualToExpression }
  | { isNull: IsNullExpression }
  | { isNotNull: IsNotNullExpression }
  | { in: InExpression }
  | { notIn: NotInExpression }
  | { like: LikeExpression }
  | { notLike: NotLikeExpression };
export const RowFilterExpression = S.Union(
  S.Struct({ equalTo: EqualToExpression }),
  S.Struct({ notEqualTo: NotEqualToExpression }),
  S.Struct({ greaterThan: GreaterThanExpression }),
  S.Struct({ lessThan: LessThanExpression }),
  S.Struct({ greaterThanOrEqualTo: GreaterThanOrEqualToExpression }),
  S.Struct({ lessThanOrEqualTo: LessThanOrEqualToExpression }),
  S.Struct({ isNull: IsNullExpression }),
  S.Struct({ isNotNull: IsNotNullExpression }),
  S.Struct({ in: InExpression }),
  S.Struct({ notIn: NotInExpression }),
  S.Struct({ like: LikeExpression }),
  S.Struct({ notLike: NotLikeExpression }),
);
export type RowFilter =
  | { expression: (typeof RowFilterExpression)["Type"] }
  | { and: RowFilterList }
  | { or: RowFilterList };
export const RowFilter = S.Union(
  S.Struct({ expression: RowFilterExpression }),
  S.Struct({
    and: S.suspend(() => RowFilterList).annotations({
      identifier: "RowFilterList",
    }),
  }),
  S.Struct({
    or: S.suspend(() => RowFilterList).annotations({
      identifier: "RowFilterList",
    }),
  }),
) as any as S.Schema<RowFilter>;
export interface RowFilterConfiguration {
  rowFilter: RowFilter;
  sensitive?: boolean;
}
export const RowFilterConfiguration = S.suspend(() =>
  S.Struct({ rowFilter: RowFilter, sensitive: S.optional(S.Boolean) }),
).annotations({
  identifier: "RowFilterConfiguration",
}) as any as S.Schema<RowFilterConfiguration>;
export type AssetFilterConfiguration =
  | { columnConfiguration: ColumnFilterConfiguration }
  | { rowConfiguration: RowFilterConfiguration };
export const AssetFilterConfiguration = S.Union(
  S.Struct({ columnConfiguration: ColumnFilterConfiguration }),
  S.Struct({ rowConfiguration: RowFilterConfiguration }),
);
export interface UpdateAssetFilterInput {
  domainIdentifier: string;
  assetIdentifier: string;
  identifier: string;
  name?: string;
  description?: string | Redacted.Redacted<string>;
  configuration?: (typeof AssetFilterConfiguration)["Type"];
}
export const UpdateAssetFilterInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    assetIdentifier: S.String.pipe(T.HttpLabel("assetIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: S.optional(S.String),
    description: S.optional(SensitiveString),
    configuration: S.optional(AssetFilterConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/v2/domains/{domainIdentifier}/assets/{assetIdentifier}/filters/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAssetFilterInput",
}) as any as S.Schema<UpdateAssetFilterInput>;
export interface UpdateEnvironmentInput {
  domainIdentifier: string;
  identifier: string;
  name?: string;
  description?: string;
  glossaryTerms?: GlossaryTerms;
  blueprintVersion?: string;
  userParameters?: EnvironmentParametersList;
}
export const UpdateEnvironmentInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    glossaryTerms: S.optional(GlossaryTerms),
    blueprintVersion: S.optional(S.String),
    userParameters: S.optional(EnvironmentParametersList),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/v2/domains/{domainIdentifier}/environments/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEnvironmentInput",
}) as any as S.Schema<UpdateEnvironmentInput>;
export interface AwsConsoleLinkParameters {
  uri?: string;
}
export const AwsConsoleLinkParameters = S.suspend(() =>
  S.Struct({ uri: S.optional(S.String) }),
).annotations({
  identifier: "AwsConsoleLinkParameters",
}) as any as S.Schema<AwsConsoleLinkParameters>;
export type ActionParameters = { awsConsoleLink: AwsConsoleLinkParameters };
export const ActionParameters = S.Union(
  S.Struct({ awsConsoleLink: AwsConsoleLinkParameters }),
);
export interface UpdateEnvironmentActionInput {
  domainIdentifier: string;
  environmentIdentifier: string;
  identifier: string;
  parameters?: (typeof ActionParameters)["Type"];
  name?: string;
  description?: string;
}
export const UpdateEnvironmentActionInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    parameters: S.optional(ActionParameters),
    name: S.optional(S.String),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/actions/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEnvironmentActionInput",
}) as any as S.Schema<UpdateEnvironmentActionInput>;
export interface CloudFormationProperties {
  templateUrl: string;
}
export const CloudFormationProperties = S.suspend(() =>
  S.Struct({ templateUrl: S.String }),
).annotations({
  identifier: "CloudFormationProperties",
}) as any as S.Schema<CloudFormationProperties>;
export type ProvisioningProperties = {
  cloudFormation: CloudFormationProperties;
};
export const ProvisioningProperties = S.Union(
  S.Struct({ cloudFormation: CloudFormationProperties }),
);
export interface CustomParameter {
  keyName: string;
  description?: string | Redacted.Redacted<string>;
  fieldType: string;
  defaultValue?: string;
  isEditable?: boolean;
  isOptional?: boolean;
  isUpdateSupported?: boolean;
}
export const CustomParameter = S.suspend(() =>
  S.Struct({
    keyName: S.String,
    description: S.optional(SensitiveString),
    fieldType: S.String,
    defaultValue: S.optional(S.String),
    isEditable: S.optional(S.Boolean),
    isOptional: S.optional(S.Boolean),
    isUpdateSupported: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CustomParameter",
}) as any as S.Schema<CustomParameter>;
export type CustomParameterList = CustomParameter[];
export const CustomParameterList = S.Array(CustomParameter);
export interface UpdateEnvironmentBlueprintInput {
  domainIdentifier: string;
  identifier: string;
  description?: string;
  provisioningProperties?: (typeof ProvisioningProperties)["Type"];
  userParameters?: CustomParameterList;
}
export const UpdateEnvironmentBlueprintInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    description: S.optional(S.String),
    provisioningProperties: S.optional(ProvisioningProperties),
    userParameters: S.optional(CustomParameterList),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/v2/domains/{domainIdentifier}/environment-blueprints/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEnvironmentBlueprintInput",
}) as any as S.Schema<UpdateEnvironmentBlueprintInput>;
export interface UpdateEnvironmentProfileInput {
  domainIdentifier: string;
  identifier: string;
  name?: string | Redacted.Redacted<string>;
  description?: string;
  userParameters?: EnvironmentParametersList;
  awsAccountId?: string;
  awsAccountRegion?: string;
}
export const UpdateEnvironmentProfileInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: S.optional(SensitiveString),
    description: S.optional(S.String),
    userParameters: S.optional(EnvironmentParametersList),
    awsAccountId: S.optional(S.String),
    awsAccountRegion: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/v2/domains/{domainIdentifier}/environment-profiles/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEnvironmentProfileInput",
}) as any as S.Schema<UpdateEnvironmentProfileInput>;
export interface UpdateGroupProfileInput {
  domainIdentifier: string;
  groupIdentifier: string;
  status: string;
}
export const UpdateGroupProfileInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    groupIdentifier: S.String.pipe(T.HttpLabel("groupIdentifier")),
    status: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/domains/{domainIdentifier}/group-profiles/{groupIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateGroupProfileInput",
}) as any as S.Schema<UpdateGroupProfileInput>;
export interface ResourceTagParameter {
  key: string;
  value: string;
  isValueEditable: boolean;
}
export const ResourceTagParameter = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String, isValueEditable: S.Boolean }),
).annotations({
  identifier: "ResourceTagParameter",
}) as any as S.Schema<ResourceTagParameter>;
export type ProjectResourceTagParameters = ResourceTagParameter[];
export const ProjectResourceTagParameters = S.Array(ResourceTagParameter);
export interface EnvironmentConfigurationParameter {
  name?: string;
  value?: string;
  isEditable?: boolean;
}
export const EnvironmentConfigurationParameter = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    value: S.optional(S.String),
    isEditable: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "EnvironmentConfigurationParameter",
}) as any as S.Schema<EnvironmentConfigurationParameter>;
export type EnvironmentConfigurationParametersList =
  EnvironmentConfigurationParameter[];
export const EnvironmentConfigurationParametersList = S.Array(
  EnvironmentConfigurationParameter,
);
export interface EnvironmentConfigurationParametersDetails {
  ssmPath?: string;
  parameterOverrides?: EnvironmentConfigurationParametersList;
  resolvedParameters?: EnvironmentConfigurationParametersList;
}
export const EnvironmentConfigurationParametersDetails = S.suspend(() =>
  S.Struct({
    ssmPath: S.optional(S.String),
    parameterOverrides: S.optional(EnvironmentConfigurationParametersList),
    resolvedParameters: S.optional(EnvironmentConfigurationParametersList),
  }),
).annotations({
  identifier: "EnvironmentConfigurationParametersDetails",
}) as any as S.Schema<EnvironmentConfigurationParametersDetails>;
export type AwsAccount =
  | { awsAccountId: string }
  | { awsAccountIdPath: string };
export const AwsAccount = S.Union(
  S.Struct({ awsAccountId: S.String }),
  S.Struct({ awsAccountIdPath: S.String }),
);
export type AccountPoolList = string[];
export const AccountPoolList = S.Array(S.String);
export type Region = { regionName: string } | { regionNamePath: string };
export const Region = S.Union(
  S.Struct({ regionName: S.String }),
  S.Struct({ regionNamePath: S.String }),
);
export interface EnvironmentConfiguration {
  name: string | Redacted.Redacted<string>;
  id?: string | Redacted.Redacted<string>;
  environmentBlueprintId: string;
  description?: string | Redacted.Redacted<string>;
  deploymentMode?: string;
  configurationParameters?: EnvironmentConfigurationParametersDetails;
  awsAccount?: (typeof AwsAccount)["Type"];
  accountPools?: AccountPoolList;
  awsRegion?: (typeof Region)["Type"];
  deploymentOrder?: number;
}
export const EnvironmentConfiguration = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    id: S.optional(SensitiveString),
    environmentBlueprintId: S.String,
    description: S.optional(SensitiveString),
    deploymentMode: S.optional(S.String),
    configurationParameters: S.optional(
      EnvironmentConfigurationParametersDetails,
    ),
    awsAccount: S.optional(AwsAccount),
    accountPools: S.optional(AccountPoolList),
    awsRegion: S.optional(Region),
    deploymentOrder: S.optional(S.Number),
  }),
).annotations({
  identifier: "EnvironmentConfiguration",
}) as any as S.Schema<EnvironmentConfiguration>;
export type EnvironmentConfigurationsList = EnvironmentConfiguration[];
export const EnvironmentConfigurationsList = S.Array(EnvironmentConfiguration);
export interface UpdateProjectProfileInput {
  domainIdentifier: string;
  identifier: string;
  name?: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  status?: string;
  projectResourceTags?: ProjectResourceTagParameters;
  allowCustomProjectResourceTags?: boolean;
  projectResourceTagsDescription?: string | Redacted.Redacted<string>;
  environmentConfigurations?: EnvironmentConfigurationsList;
  domainUnitIdentifier?: string;
}
export const UpdateProjectProfileInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    status: S.optional(S.String),
    projectResourceTags: S.optional(ProjectResourceTagParameters),
    allowCustomProjectResourceTags: S.optional(S.Boolean),
    projectResourceTagsDescription: S.optional(SensitiveString),
    environmentConfigurations: S.optional(EnvironmentConfigurationsList),
    domainUnitIdentifier: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/v2/domains/{domainIdentifier}/project-profiles/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateProjectProfileInput",
}) as any as S.Schema<UpdateProjectProfileInput>;
export interface UpdateRootDomainUnitOwnerInput {
  domainIdentifier: string;
  currentOwner: string;
  newOwner: string;
  clientToken?: string;
}
export const UpdateRootDomainUnitOwnerInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    currentOwner: S.String,
    newOwner: S.String,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/v2/domains/{domainIdentifier}/root-domain-unit-owner",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRootDomainUnitOwnerInput",
}) as any as S.Schema<UpdateRootDomainUnitOwnerInput>;
export interface UpdateRootDomainUnitOwnerOutput {}
export const UpdateRootDomainUnitOwnerOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateRootDomainUnitOwnerOutput",
}) as any as S.Schema<UpdateRootDomainUnitOwnerOutput>;
export interface UpdateSubscriptionRequestInput {
  domainIdentifier: string;
  identifier: string;
  requestReason: string | Redacted.Redacted<string>;
}
export const UpdateSubscriptionRequestInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    requestReason: SensitiveString,
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/v2/domains/{domainIdentifier}/subscription-requests/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSubscriptionRequestInput",
}) as any as S.Schema<UpdateSubscriptionRequestInput>;
export interface SubscriptionTargetForm {
  formName: string;
  content: string;
}
export const SubscriptionTargetForm = S.suspend(() =>
  S.Struct({ formName: S.String, content: S.String }),
).annotations({
  identifier: "SubscriptionTargetForm",
}) as any as S.Schema<SubscriptionTargetForm>;
export type SubscriptionTargetForms = SubscriptionTargetForm[];
export const SubscriptionTargetForms = S.Array(SubscriptionTargetForm);
export interface UpdateSubscriptionTargetInput {
  domainIdentifier: string;
  environmentIdentifier: string;
  identifier: string;
  name?: string | Redacted.Redacted<string>;
  authorizedPrincipals?: AuthorizedPrincipalIdentifiers;
  applicableAssetTypes?: ApplicableAssetTypes;
  subscriptionTargetConfig?: SubscriptionTargetForms;
  manageAccessRole?: string;
  provider?: string;
}
export const UpdateSubscriptionTargetInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: S.optional(SensitiveString),
    authorizedPrincipals: S.optional(AuthorizedPrincipalIdentifiers),
    applicableAssetTypes: S.optional(ApplicableAssetTypes),
    subscriptionTargetConfig: S.optional(SubscriptionTargetForms),
    manageAccessRole: S.optional(S.String),
    provider: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/subscription-targets/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSubscriptionTargetInput",
}) as any as S.Schema<UpdateSubscriptionTargetInput>;
export interface UpdateUserProfileInput {
  domainIdentifier: string;
  userIdentifier: string;
  type?: string;
  status: string;
}
export const UpdateUserProfileInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    userIdentifier: S.String.pipe(T.HttpLabel("userIdentifier")),
    type: S.optional(S.String),
    status: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/domains/{domainIdentifier}/user-profiles/{userIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateUserProfileInput",
}) as any as S.Schema<UpdateUserProfileInput>;
export interface GetAssetInput {
  domainIdentifier: string;
  identifier: string;
  revision?: string;
}
export const GetAssetInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    revision: S.optional(S.String).pipe(T.HttpQuery("revision")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/assets/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAssetInput",
}) as any as S.Schema<GetAssetInput>;
export interface DeleteAssetInput {
  domainIdentifier: string;
  identifier: string;
}
export const DeleteAssetInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/assets/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAssetInput",
}) as any as S.Schema<DeleteAssetInput>;
export interface DeleteAssetOutput {}
export const DeleteAssetOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteAssetOutput",
}) as any as S.Schema<DeleteAssetOutput>;
export interface BusinessNameGenerationConfiguration {
  enabled?: boolean;
}
export const BusinessNameGenerationConfiguration = S.suspend(() =>
  S.Struct({ enabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "BusinessNameGenerationConfiguration",
}) as any as S.Schema<BusinessNameGenerationConfiguration>;
export interface PredictionConfiguration {
  businessNameGeneration?: BusinessNameGenerationConfiguration;
}
export const PredictionConfiguration = S.suspend(() =>
  S.Struct({
    businessNameGeneration: S.optional(BusinessNameGenerationConfiguration),
  }),
).annotations({
  identifier: "PredictionConfiguration",
}) as any as S.Schema<PredictionConfiguration>;
export interface CreateAssetRevisionInput {
  name: string | Redacted.Redacted<string>;
  domainIdentifier: string;
  identifier: string;
  typeRevision?: string;
  description?: string | Redacted.Redacted<string>;
  glossaryTerms?: GlossaryTerms;
  formsInput?: FormInputList;
  predictionConfiguration?: PredictionConfiguration;
  clientToken?: string;
}
export const CreateAssetRevisionInput = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    typeRevision: S.optional(S.String),
    description: S.optional(SensitiveString),
    glossaryTerms: S.optional(GlossaryTerms),
    formsInput: S.optional(FormInputList),
    predictionConfiguration: S.optional(PredictionConfiguration),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/assets/{identifier}/revisions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAssetRevisionInput",
}) as any as S.Schema<CreateAssetRevisionInput>;
export interface DeleteAssetTypeInput {
  domainIdentifier: string;
  identifier: string;
}
export const DeleteAssetTypeInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/asset-types/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAssetTypeInput",
}) as any as S.Schema<DeleteAssetTypeInput>;
export interface DeleteAssetTypeOutput {}
export const DeleteAssetTypeOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteAssetTypeOutput",
}) as any as S.Schema<DeleteAssetTypeOutput>;
export interface GetAssetTypeInput {
  domainIdentifier: string;
  identifier: string;
  revision?: string;
}
export const GetAssetTypeInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    revision: S.optional(S.String).pipe(T.HttpQuery("revision")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/asset-types/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAssetTypeInput",
}) as any as S.Schema<GetAssetTypeInput>;
export interface GetDataProductInput {
  domainIdentifier: string;
  identifier: string;
  revision?: string;
}
export const GetDataProductInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    revision: S.optional(S.String).pipe(T.HttpQuery("revision")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/data-products/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDataProductInput",
}) as any as S.Schema<GetDataProductInput>;
export interface DeleteDataProductInput {
  domainIdentifier: string;
  identifier: string;
}
export const DeleteDataProductInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/data-products/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDataProductInput",
}) as any as S.Schema<DeleteDataProductInput>;
export interface DeleteDataProductOutput {}
export const DeleteDataProductOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDataProductOutput",
}) as any as S.Schema<DeleteDataProductOutput>;
export type ItemGlossaryTerms = string[];
export const ItemGlossaryTerms = S.Array(S.String);
export interface DataProductItem {
  itemType: string;
  identifier: string;
  revision?: string;
  glossaryTerms?: ItemGlossaryTerms;
}
export const DataProductItem = S.suspend(() =>
  S.Struct({
    itemType: S.String,
    identifier: S.String,
    revision: S.optional(S.String),
    glossaryTerms: S.optional(ItemGlossaryTerms),
  }),
).annotations({
  identifier: "DataProductItem",
}) as any as S.Schema<DataProductItem>;
export type DataProductItems = DataProductItem[];
export const DataProductItems = S.Array(DataProductItem);
export interface CreateDataProductRevisionInput {
  domainIdentifier: string;
  identifier: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  glossaryTerms?: GlossaryTerms;
  items?: DataProductItems;
  formsInput?: FormInputList;
  clientToken?: string;
}
export const CreateDataProductRevisionInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    glossaryTerms: S.optional(GlossaryTerms),
    items: S.optional(DataProductItems),
    formsInput: S.optional(FormInputList),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/data-products/{identifier}/revisions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDataProductRevisionInput",
}) as any as S.Schema<CreateDataProductRevisionInput>;
export interface GetDataSourceInput {
  domainIdentifier: string;
  identifier: string;
}
export const GetDataSourceInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/data-sources/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDataSourceInput",
}) as any as S.Schema<GetDataSourceInput>;
export interface ScheduleConfiguration {
  timezone?: string;
  schedule?: string;
}
export const ScheduleConfiguration = S.suspend(() =>
  S.Struct({ timezone: S.optional(S.String), schedule: S.optional(S.String) }),
).annotations({
  identifier: "ScheduleConfiguration",
}) as any as S.Schema<ScheduleConfiguration>;
export interface FilterExpression {
  type: string;
  expression: string;
}
export const FilterExpression = S.suspend(() =>
  S.Struct({ type: S.String, expression: S.String }),
).annotations({
  identifier: "FilterExpression",
}) as any as S.Schema<FilterExpression>;
export type FilterExpressions = FilterExpression[];
export const FilterExpressions = S.Array(FilterExpression);
export interface RelationalFilterConfiguration {
  databaseName: string;
  schemaName?: string;
  filterExpressions?: FilterExpressions;
}
export const RelationalFilterConfiguration = S.suspend(() =>
  S.Struct({
    databaseName: S.String,
    schemaName: S.optional(S.String),
    filterExpressions: S.optional(FilterExpressions),
  }),
).annotations({
  identifier: "RelationalFilterConfiguration",
}) as any as S.Schema<RelationalFilterConfiguration>;
export type RelationalFilterConfigurations = RelationalFilterConfiguration[];
export const RelationalFilterConfigurations = S.Array(
  RelationalFilterConfiguration,
);
export interface GlueRunConfigurationInput {
  dataAccessRole?: string;
  relationalFilterConfigurations: RelationalFilterConfigurations;
  autoImportDataQualityResult?: boolean;
  catalogName?: string;
}
export const GlueRunConfigurationInput = S.suspend(() =>
  S.Struct({
    dataAccessRole: S.optional(S.String),
    relationalFilterConfigurations: RelationalFilterConfigurations,
    autoImportDataQualityResult: S.optional(S.Boolean),
    catalogName: S.optional(S.String),
  }),
).annotations({
  identifier: "GlueRunConfigurationInput",
}) as any as S.Schema<GlueRunConfigurationInput>;
export interface RedshiftCredentialConfiguration {
  secretManagerArn: string;
}
export const RedshiftCredentialConfiguration = S.suspend(() =>
  S.Struct({ secretManagerArn: S.String }),
).annotations({
  identifier: "RedshiftCredentialConfiguration",
}) as any as S.Schema<RedshiftCredentialConfiguration>;
export interface RedshiftClusterStorage {
  clusterName: string;
}
export const RedshiftClusterStorage = S.suspend(() =>
  S.Struct({ clusterName: S.String }),
).annotations({
  identifier: "RedshiftClusterStorage",
}) as any as S.Schema<RedshiftClusterStorage>;
export interface RedshiftServerlessStorage {
  workgroupName: string;
}
export const RedshiftServerlessStorage = S.suspend(() =>
  S.Struct({ workgroupName: S.String }),
).annotations({
  identifier: "RedshiftServerlessStorage",
}) as any as S.Schema<RedshiftServerlessStorage>;
export type RedshiftStorage =
  | { redshiftClusterSource: RedshiftClusterStorage }
  | { redshiftServerlessSource: RedshiftServerlessStorage };
export const RedshiftStorage = S.Union(
  S.Struct({ redshiftClusterSource: RedshiftClusterStorage }),
  S.Struct({ redshiftServerlessSource: RedshiftServerlessStorage }),
);
export interface RedshiftRunConfigurationInput {
  dataAccessRole?: string;
  relationalFilterConfigurations: RelationalFilterConfigurations;
  redshiftCredentialConfiguration?: RedshiftCredentialConfiguration;
  redshiftStorage?: (typeof RedshiftStorage)["Type"];
}
export const RedshiftRunConfigurationInput = S.suspend(() =>
  S.Struct({
    dataAccessRole: S.optional(S.String),
    relationalFilterConfigurations: RelationalFilterConfigurations,
    redshiftCredentialConfiguration: S.optional(
      RedshiftCredentialConfiguration,
    ),
    redshiftStorage: S.optional(RedshiftStorage),
  }),
).annotations({
  identifier: "RedshiftRunConfigurationInput",
}) as any as S.Schema<RedshiftRunConfigurationInput>;
export type TrackingAssetArns = string[];
export const TrackingAssetArns = S.Array(S.String);
export type TrackingAssets = { [key: string]: TrackingAssetArns };
export const TrackingAssets = S.Record({
  key: S.String,
  value: TrackingAssetArns,
});
export interface SageMakerRunConfigurationInput {
  trackingAssets: TrackingAssets;
}
export const SageMakerRunConfigurationInput = S.suspend(() =>
  S.Struct({ trackingAssets: TrackingAssets }),
).annotations({
  identifier: "SageMakerRunConfigurationInput",
}) as any as S.Schema<SageMakerRunConfigurationInput>;
export type DataSourceConfigurationInput =
  | { glueRunConfiguration: GlueRunConfigurationInput }
  | { redshiftRunConfiguration: RedshiftRunConfigurationInput }
  | { sageMakerRunConfiguration: SageMakerRunConfigurationInput };
export const DataSourceConfigurationInput = S.Union(
  S.Struct({ glueRunConfiguration: GlueRunConfigurationInput }),
  S.Struct({ redshiftRunConfiguration: RedshiftRunConfigurationInput }),
  S.Struct({ sageMakerRunConfiguration: SageMakerRunConfigurationInput }),
);
export interface RecommendationConfiguration {
  enableBusinessNameGeneration?: boolean;
}
export const RecommendationConfiguration = S.suspend(() =>
  S.Struct({ enableBusinessNameGeneration: S.optional(S.Boolean) }),
).annotations({
  identifier: "RecommendationConfiguration",
}) as any as S.Schema<RecommendationConfiguration>;
export interface UpdateDataSourceInput {
  domainIdentifier: string;
  identifier: string;
  name?: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  enableSetting?: string;
  publishOnImport?: boolean;
  assetFormsInput?: FormInputList;
  schedule?: ScheduleConfiguration;
  configuration?: (typeof DataSourceConfigurationInput)["Type"];
  recommendation?: RecommendationConfiguration;
  retainPermissionsOnRevokeFailure?: boolean;
}
export const UpdateDataSourceInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    enableSetting: S.optional(S.String),
    publishOnImport: S.optional(S.Boolean),
    assetFormsInput: S.optional(FormInputList),
    schedule: S.optional(ScheduleConfiguration),
    configuration: S.optional(DataSourceConfigurationInput),
    recommendation: S.optional(RecommendationConfiguration),
    retainPermissionsOnRevokeFailure: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/v2/domains/{domainIdentifier}/data-sources/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDataSourceInput",
}) as any as S.Schema<UpdateDataSourceInput>;
export interface DeleteDataSourceInput {
  domainIdentifier: string;
  identifier: string;
  clientToken?: string;
  retainPermissionsOnRevokeFailure?: boolean;
}
export const DeleteDataSourceInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
    retainPermissionsOnRevokeFailure: S.optional(S.Boolean).pipe(
      T.HttpQuery("retainPermissionsOnRevokeFailure"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/data-sources/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDataSourceInput",
}) as any as S.Schema<DeleteDataSourceInput>;
export interface ListDataSourcesInput {
  domainIdentifier: string;
  projectIdentifier: string;
  environmentIdentifier?: string;
  connectionIdentifier?: string;
  type?: string;
  status?: string;
  name?: string | Redacted.Redacted<string>;
  nextToken?: string;
  maxResults?: number;
}
export const ListDataSourcesInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    projectIdentifier: S.String.pipe(T.HttpQuery("projectIdentifier")),
    environmentIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("environmentIdentifier"),
    ),
    connectionIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("connectionIdentifier"),
    ),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    name: S.optional(SensitiveString).pipe(T.HttpQuery("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/data-sources",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDataSourcesInput",
}) as any as S.Schema<ListDataSourcesInput>;
export interface StartDataSourceRunInput {
  domainIdentifier: string;
  dataSourceIdentifier: string;
  clientToken?: string;
}
export const StartDataSourceRunInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    dataSourceIdentifier: S.String.pipe(T.HttpLabel("dataSourceIdentifier")),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/data-sources/{dataSourceIdentifier}/runs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartDataSourceRunInput",
}) as any as S.Schema<StartDataSourceRunInput>;
export interface GetDataSourceRunInput {
  domainIdentifier: string;
  identifier: string;
}
export const GetDataSourceRunInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/data-source-runs/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDataSourceRunInput",
}) as any as S.Schema<GetDataSourceRunInput>;
export interface ListDataSourceRunsInput {
  domainIdentifier: string;
  dataSourceIdentifier: string;
  status?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListDataSourceRunsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    dataSourceIdentifier: S.String.pipe(T.HttpLabel("dataSourceIdentifier")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/data-sources/{dataSourceIdentifier}/runs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDataSourceRunsInput",
}) as any as S.Schema<ListDataSourceRunsInput>;
export interface GetDomainInput {
  identifier: string;
}
export const GetDomainInput = S.suspend(() =>
  S.Struct({ identifier: S.String.pipe(T.HttpLabel("identifier")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/domains/{identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDomainInput",
}) as any as S.Schema<GetDomainInput>;
export interface SingleSignOn {
  type?: string;
  userAssignment?: string;
  idcInstanceArn?: string;
}
export const SingleSignOn = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    userAssignment: S.optional(S.String),
    idcInstanceArn: S.optional(S.String),
  }),
).annotations({ identifier: "SingleSignOn" }) as any as S.Schema<SingleSignOn>;
export interface UpdateDomainInput {
  identifier: string;
  description?: string;
  singleSignOn?: SingleSignOn;
  domainExecutionRole?: string;
  serviceRole?: string;
  name?: string;
  clientToken?: string;
}
export const UpdateDomainInput = S.suspend(() =>
  S.Struct({
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    description: S.optional(S.String),
    singleSignOn: S.optional(SingleSignOn),
    domainExecutionRole: S.optional(S.String),
    serviceRole: S.optional(S.String),
    name: S.optional(S.String),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v2/domains/{identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDomainInput",
}) as any as S.Schema<UpdateDomainInput>;
export interface DeleteDomainInput {
  identifier: string;
  clientToken?: string;
  skipDeletionCheck?: boolean;
}
export const DeleteDomainInput = S.suspend(() =>
  S.Struct({
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
    skipDeletionCheck: S.optional(S.Boolean).pipe(
      T.HttpQuery("skipDeletionCheck"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v2/domains/{identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDomainInput",
}) as any as S.Schema<DeleteDomainInput>;
export interface ListDomainsInput {
  status?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListDomainsInput = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/domains" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDomainsInput",
}) as any as S.Schema<ListDomainsInput>;
export interface CreateDomainUnitInput {
  domainIdentifier: string;
  name: string | Redacted.Redacted<string>;
  parentDomainUnitIdentifier: string;
  description?: string | Redacted.Redacted<string>;
  clientToken?: string;
}
export const CreateDomainUnitInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: SensitiveString,
    parentDomainUnitIdentifier: S.String,
    description: S.optional(SensitiveString),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/domain-units",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDomainUnitInput",
}) as any as S.Schema<CreateDomainUnitInput>;
export interface GetDomainUnitInput {
  domainIdentifier: string;
  identifier: string;
}
export const GetDomainUnitInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/domain-units/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDomainUnitInput",
}) as any as S.Schema<GetDomainUnitInput>;
export interface UpdateDomainUnitInput {
  domainIdentifier: string;
  identifier: string;
  description?: string | Redacted.Redacted<string>;
  name?: string | Redacted.Redacted<string>;
}
export const UpdateDomainUnitInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    description: S.optional(SensitiveString),
    name: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/domains/{domainIdentifier}/domain-units/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDomainUnitInput",
}) as any as S.Schema<UpdateDomainUnitInput>;
export interface DeleteDomainUnitInput {
  domainIdentifier: string;
  identifier: string;
}
export const DeleteDomainUnitInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/domain-units/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDomainUnitInput",
}) as any as S.Schema<DeleteDomainUnitInput>;
export interface DeleteDomainUnitOutput {}
export const DeleteDomainUnitOutput = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteDomainUnitOutput" },
) as any as S.Schema<DeleteDomainUnitOutput>;
export interface ListDomainUnitsForParentInput {
  domainIdentifier: string;
  parentDomainUnitIdentifier: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListDomainUnitsForParentInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    parentDomainUnitIdentifier: S.String.pipe(
      T.HttpQuery("parentDomainUnitIdentifier"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/domain-units",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDomainUnitsForParentInput",
}) as any as S.Schema<ListDomainUnitsForParentInput>;
export interface GetEnvironmentBlueprintConfigurationInput {
  domainIdentifier: string;
  environmentBlueprintIdentifier: string;
}
export const GetEnvironmentBlueprintConfigurationInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentBlueprintIdentifier: S.String.pipe(
      T.HttpLabel("environmentBlueprintIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/environment-blueprint-configurations/{environmentBlueprintIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEnvironmentBlueprintConfigurationInput",
}) as any as S.Schema<GetEnvironmentBlueprintConfigurationInput>;
export interface DeleteEnvironmentBlueprintConfigurationInput {
  domainIdentifier: string;
  environmentBlueprintIdentifier: string;
}
export const DeleteEnvironmentBlueprintConfigurationInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentBlueprintIdentifier: S.String.pipe(
      T.HttpLabel("environmentBlueprintIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/environment-blueprint-configurations/{environmentBlueprintIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEnvironmentBlueprintConfigurationInput",
}) as any as S.Schema<DeleteEnvironmentBlueprintConfigurationInput>;
export interface DeleteEnvironmentBlueprintConfigurationOutput {}
export const DeleteEnvironmentBlueprintConfigurationOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEnvironmentBlueprintConfigurationOutput",
}) as any as S.Schema<DeleteEnvironmentBlueprintConfigurationOutput>;
export interface ListEnvironmentBlueprintConfigurationsInput {
  domainIdentifier: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListEnvironmentBlueprintConfigurationsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/environment-blueprint-configurations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEnvironmentBlueprintConfigurationsInput",
}) as any as S.Schema<ListEnvironmentBlueprintConfigurationsInput>;
export interface DeleteFormTypeInput {
  domainIdentifier: string;
  formTypeIdentifier: string;
}
export const DeleteFormTypeInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    formTypeIdentifier: S.String.pipe(T.HttpLabel("formTypeIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/form-types/{formTypeIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFormTypeInput",
}) as any as S.Schema<DeleteFormTypeInput>;
export interface DeleteFormTypeOutput {}
export const DeleteFormTypeOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteFormTypeOutput",
}) as any as S.Schema<DeleteFormTypeOutput>;
export interface GetFormTypeInput {
  domainIdentifier: string;
  formTypeIdentifier: string;
  revision?: string;
}
export const GetFormTypeInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    formTypeIdentifier: S.String.pipe(T.HttpLabel("formTypeIdentifier")),
    revision: S.optional(S.String).pipe(T.HttpQuery("revision")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/form-types/{formTypeIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFormTypeInput",
}) as any as S.Schema<GetFormTypeInput>;
export interface CreateGlossaryInput {
  domainIdentifier: string;
  name: string | Redacted.Redacted<string>;
  owningProjectIdentifier: string;
  description?: string | Redacted.Redacted<string>;
  status?: string;
  usageRestrictions?: GlossaryUsageRestrictions;
  clientToken?: string;
}
export const CreateGlossaryInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: SensitiveString,
    owningProjectIdentifier: S.String,
    description: S.optional(SensitiveString),
    status: S.optional(S.String),
    usageRestrictions: S.optional(GlossaryUsageRestrictions),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/glossaries",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateGlossaryInput",
}) as any as S.Schema<CreateGlossaryInput>;
export interface GetGlossaryInput {
  domainIdentifier: string;
  identifier: string;
}
export const GetGlossaryInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/glossaries/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGlossaryInput",
}) as any as S.Schema<GetGlossaryInput>;
export interface UpdateGlossaryInput {
  domainIdentifier: string;
  identifier: string;
  name?: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  status?: string;
  clientToken?: string;
}
export const UpdateGlossaryInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    status: S.optional(S.String),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/v2/domains/{domainIdentifier}/glossaries/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateGlossaryInput",
}) as any as S.Schema<UpdateGlossaryInput>;
export interface DeleteGlossaryInput {
  domainIdentifier: string;
  identifier: string;
}
export const DeleteGlossaryInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/glossaries/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteGlossaryInput",
}) as any as S.Schema<DeleteGlossaryInput>;
export interface DeleteGlossaryOutput {}
export const DeleteGlossaryOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteGlossaryOutput",
}) as any as S.Schema<DeleteGlossaryOutput>;
export interface GetGlossaryTermInput {
  domainIdentifier: string;
  identifier: string;
}
export const GetGlossaryTermInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/glossary-terms/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGlossaryTermInput",
}) as any as S.Schema<GetGlossaryTermInput>;
export interface TermRelations {
  isA?: GlossaryTerms;
  classifies?: GlossaryTerms;
}
export const TermRelations = S.suspend(() =>
  S.Struct({
    isA: S.optional(GlossaryTerms),
    classifies: S.optional(GlossaryTerms),
  }),
).annotations({
  identifier: "TermRelations",
}) as any as S.Schema<TermRelations>;
export interface UpdateGlossaryTermInput {
  domainIdentifier: string;
  glossaryIdentifier?: string;
  identifier: string;
  name?: string | Redacted.Redacted<string>;
  shortDescription?: string | Redacted.Redacted<string>;
  longDescription?: string | Redacted.Redacted<string>;
  termRelations?: TermRelations;
  status?: string;
}
export const UpdateGlossaryTermInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    glossaryIdentifier: S.optional(S.String),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: S.optional(SensitiveString),
    shortDescription: S.optional(SensitiveString),
    longDescription: S.optional(SensitiveString),
    termRelations: S.optional(TermRelations),
    status: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/v2/domains/{domainIdentifier}/glossary-terms/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateGlossaryTermInput",
}) as any as S.Schema<UpdateGlossaryTermInput>;
export interface DeleteGlossaryTermInput {
  domainIdentifier: string;
  identifier: string;
}
export const DeleteGlossaryTermInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/glossary-terms/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteGlossaryTermInput",
}) as any as S.Schema<DeleteGlossaryTermInput>;
export interface DeleteGlossaryTermOutput {}
export const DeleteGlossaryTermOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteGlossaryTermOutput",
}) as any as S.Schema<DeleteGlossaryTermOutput>;
export interface GetListingInput {
  domainIdentifier: string;
  identifier: string;
  listingRevision?: string;
}
export const GetListingInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    listingRevision: S.optional(S.String).pipe(T.HttpQuery("listingRevision")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/listings/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetListingInput",
}) as any as S.Schema<GetListingInput>;
export interface DeleteListingInput {
  domainIdentifier: string;
  identifier: string;
}
export const DeleteListingInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/listings/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteListingInput",
}) as any as S.Schema<DeleteListingInput>;
export interface DeleteListingOutput {}
export const DeleteListingOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteListingOutput",
}) as any as S.Schema<DeleteListingOutput>;
export interface GetMetadataGenerationRunInput {
  domainIdentifier: string;
  identifier: string;
  type?: string;
}
export const GetMetadataGenerationRunInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/metadata-generation-runs/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMetadataGenerationRunInput",
}) as any as S.Schema<GetMetadataGenerationRunInput>;
export interface CancelMetadataGenerationRunInput {
  domainIdentifier: string;
  identifier: string;
}
export const CancelMetadataGenerationRunInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/metadata-generation-runs/{identifier}/cancel",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelMetadataGenerationRunInput",
}) as any as S.Schema<CancelMetadataGenerationRunInput>;
export interface CancelMetadataGenerationRunOutput {}
export const CancelMetadataGenerationRunOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelMetadataGenerationRunOutput",
}) as any as S.Schema<CancelMetadataGenerationRunOutput>;
export interface ListMetadataGenerationRunsInput {
  domainIdentifier: string;
  status?: string;
  type?: string;
  nextToken?: string;
  maxResults?: number;
  targetIdentifier?: string;
}
export const ListMetadataGenerationRunsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    targetIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("targetIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/metadata-generation-runs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMetadataGenerationRunsInput",
}) as any as S.Schema<ListMetadataGenerationRunsInput>;
export interface GetRuleInput {
  domainIdentifier: string;
  identifier: string;
  revision?: string;
}
export const GetRuleInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    revision: S.optional(S.String).pipe(T.HttpQuery("revision")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/rules/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({ identifier: "GetRuleInput" }) as any as S.Schema<GetRuleInput>;
export type RuleAssetTypeList = string[];
export const RuleAssetTypeList = S.Array(S.String);
export interface AssetTypesForRule {
  selectionMode: string;
  specificAssetTypes?: RuleAssetTypeList;
}
export const AssetTypesForRule = S.suspend(() =>
  S.Struct({
    selectionMode: S.String,
    specificAssetTypes: S.optional(RuleAssetTypeList),
  }),
).annotations({
  identifier: "AssetTypesForRule",
}) as any as S.Schema<AssetTypesForRule>;
export type RuleProjectIdentifierList = string[];
export const RuleProjectIdentifierList = S.Array(S.String);
export interface ProjectsForRule {
  selectionMode: string;
  specificProjects?: RuleProjectIdentifierList;
}
export const ProjectsForRule = S.suspend(() =>
  S.Struct({
    selectionMode: S.String,
    specificProjects: S.optional(RuleProjectIdentifierList),
  }),
).annotations({
  identifier: "ProjectsForRule",
}) as any as S.Schema<ProjectsForRule>;
export interface RuleScope {
  assetType?: AssetTypesForRule;
  dataProduct?: boolean;
  project?: ProjectsForRule;
}
export const RuleScope = S.suspend(() =>
  S.Struct({
    assetType: S.optional(AssetTypesForRule),
    dataProduct: S.optional(S.Boolean),
    project: S.optional(ProjectsForRule),
  }),
).annotations({ identifier: "RuleScope" }) as any as S.Schema<RuleScope>;
export interface MetadataFormReference {
  typeIdentifier: string;
  typeRevision: string;
}
export const MetadataFormReference = S.suspend(() =>
  S.Struct({ typeIdentifier: S.String, typeRevision: S.String }),
).annotations({
  identifier: "MetadataFormReference",
}) as any as S.Schema<MetadataFormReference>;
export type RequiredMetadataFormList = MetadataFormReference[];
export const RequiredMetadataFormList = S.Array(MetadataFormReference);
export interface MetadataFormEnforcementDetail {
  requiredMetadataForms?: RequiredMetadataFormList;
}
export const MetadataFormEnforcementDetail = S.suspend(() =>
  S.Struct({ requiredMetadataForms: S.optional(RequiredMetadataFormList) }),
).annotations({
  identifier: "MetadataFormEnforcementDetail",
}) as any as S.Schema<MetadataFormEnforcementDetail>;
export type GlossaryTermIdentifiers = string[];
export const GlossaryTermIdentifiers = S.Array(S.String);
export interface GlossaryTermEnforcementDetail {
  requiredGlossaryTermIds?: GlossaryTermIdentifiers;
}
export const GlossaryTermEnforcementDetail = S.suspend(() =>
  S.Struct({ requiredGlossaryTermIds: S.optional(GlossaryTermIdentifiers) }),
).annotations({
  identifier: "GlossaryTermEnforcementDetail",
}) as any as S.Schema<GlossaryTermEnforcementDetail>;
export type RuleDetail =
  | { metadataFormEnforcementDetail: MetadataFormEnforcementDetail }
  | { glossaryTermEnforcementDetail: GlossaryTermEnforcementDetail };
export const RuleDetail = S.Union(
  S.Struct({ metadataFormEnforcementDetail: MetadataFormEnforcementDetail }),
  S.Struct({ glossaryTermEnforcementDetail: GlossaryTermEnforcementDetail }),
);
export interface UpdateRuleInput {
  domainIdentifier: string;
  identifier: string;
  name?: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  scope?: RuleScope;
  detail?: (typeof RuleDetail)["Type"];
  includeChildDomainUnits?: boolean;
}
export const UpdateRuleInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    scope: S.optional(RuleScope),
    detail: S.optional(RuleDetail),
    includeChildDomainUnits: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/v2/domains/{domainIdentifier}/rules/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRuleInput",
}) as any as S.Schema<UpdateRuleInput>;
export interface DeleteRuleInput {
  domainIdentifier: string;
  identifier: string;
}
export const DeleteRuleInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/domains/{domainIdentifier}/rules/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRuleInput",
}) as any as S.Schema<DeleteRuleInput>;
export interface DeleteRuleOutput {}
export const DeleteRuleOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteRuleOutput",
}) as any as S.Schema<DeleteRuleOutput>;
export interface ListRulesInput {
  domainIdentifier: string;
  targetType: string;
  targetIdentifier: string;
  ruleType?: string;
  action?: string;
  projectIds?: ProjectIds;
  assetTypes?: AssetTypeIdentifiers;
  dataProduct?: boolean;
  includeCascaded?: boolean;
  maxResults?: number;
  nextToken?: string;
}
export const ListRulesInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    targetType: S.String.pipe(T.HttpLabel("targetType")),
    targetIdentifier: S.String.pipe(T.HttpLabel("targetIdentifier")),
    ruleType: S.optional(S.String).pipe(T.HttpQuery("ruleType")),
    action: S.optional(S.String).pipe(T.HttpQuery("ruleAction")),
    projectIds: S.optional(ProjectIds).pipe(T.HttpQuery("projectIds")),
    assetTypes: S.optional(AssetTypeIdentifiers).pipe(
      T.HttpQuery("assetTypes"),
    ),
    dataProduct: S.optional(S.Boolean).pipe(T.HttpQuery("dataProduct")),
    includeCascaded: S.optional(S.Boolean).pipe(T.HttpQuery("includeCascaded")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domains/{domainIdentifier}/list-rules/{targetType}/{targetIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRulesInput",
}) as any as S.Schema<ListRulesInput>;
export type FilterIds = string[];
export const FilterIds = S.Array(S.String);
export interface Unit {}
export const Unit = S.suspend(() => S.Struct({})).annotations({
  identifier: "Unit",
}) as any as S.Schema<Unit>;
export type PredictionChoices = number[];
export const PredictionChoices = S.Array(S.Number);
export type FilterList = FilterClause[];
export const FilterList = S.Array(
  S.suspend(() => FilterClause).annotations({ identifier: "FilterClause" }),
) as any as S.Schema<FilterList>;
export interface AcceptRule {
  rule?: string;
  threshold?: number;
}
export const AcceptRule = S.suspend(() =>
  S.Struct({ rule: S.optional(S.String), threshold: S.optional(S.Number) }),
).annotations({ identifier: "AcceptRule" }) as any as S.Schema<AcceptRule>;
export interface AcceptChoice {
  predictionTarget: string;
  predictionChoice?: number;
  editedValue?: string | Redacted.Redacted<string>;
}
export const AcceptChoice = S.suspend(() =>
  S.Struct({
    predictionTarget: S.String,
    predictionChoice: S.optional(S.Number),
    editedValue: S.optional(SensitiveString),
  }),
).annotations({ identifier: "AcceptChoice" }) as any as S.Schema<AcceptChoice>;
export type AcceptChoices = AcceptChoice[];
export const AcceptChoices = S.Array(AcceptChoice);
export interface AcceptedAssetScope {
  assetId: string;
  filterIds: FilterIds;
}
export const AcceptedAssetScope = S.suspend(() =>
  S.Struct({ assetId: S.String, filterIds: FilterIds }),
).annotations({
  identifier: "AcceptedAssetScope",
}) as any as S.Schema<AcceptedAssetScope>;
export type AcceptedAssetScopes = AcceptedAssetScope[];
export const AcceptedAssetScopes = S.Array(AcceptedAssetScope);
export interface AttributeInput {
  attributeIdentifier: string;
  forms: FormInputList;
}
export const AttributeInput = S.suspend(() =>
  S.Struct({ attributeIdentifier: S.String, forms: FormInputList }),
).annotations({
  identifier: "AttributeInput",
}) as any as S.Schema<AttributeInput>;
export type Attributes = AttributeInput[];
export const Attributes = S.Array(AttributeInput);
export interface AwsLocation {
  accessRole?: string;
  awsAccountId?: string;
  awsRegion?: string;
  iamConnectionId?: string;
}
export const AwsLocation = S.suspend(() =>
  S.Struct({
    accessRole: S.optional(S.String),
    awsAccountId: S.optional(S.String),
    awsRegion: S.optional(S.String),
    iamConnectionId: S.optional(S.String),
  }),
).annotations({ identifier: "AwsLocation" }) as any as S.Schema<AwsLocation>;
export interface AssetTargetNameMap {
  assetId: string;
  targetName: string;
}
export const AssetTargetNameMap = S.suspend(() =>
  S.Struct({ assetId: S.String, targetName: S.String }),
).annotations({
  identifier: "AssetTargetNameMap",
}) as any as S.Schema<AssetTargetNameMap>;
export type AssetTargetNames = AssetTargetNameMap[];
export const AssetTargetNames = S.Array(AssetTargetNameMap);
export interface SubscribedListingInput {
  identifier: string;
}
export const SubscribedListingInput = S.suspend(() =>
  S.Struct({ identifier: S.String }),
).annotations({
  identifier: "SubscribedListingInput",
}) as any as S.Schema<SubscribedListingInput>;
export type SubscribedListingInputs = SubscribedListingInput[];
export const SubscribedListingInputs = S.Array(SubscribedListingInput);
export type MetadataFormInputs = FormInput[];
export const MetadataFormInputs = S.Array(FormInput);
export interface SubscribedProject {
  id?: string;
  name?: string | Redacted.Redacted<string>;
}
export const SubscribedProject = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), name: S.optional(SensitiveString) }),
).annotations({
  identifier: "SubscribedProject",
}) as any as S.Schema<SubscribedProject>;
export interface IamUserProfileDetails {
  arn?: string;
  principalId?: string;
}
export const IamUserProfileDetails = S.suspend(() =>
  S.Struct({ arn: S.optional(S.String), principalId: S.optional(S.String) }),
).annotations({
  identifier: "IamUserProfileDetails",
}) as any as S.Schema<IamUserProfileDetails>;
export interface SsoUserProfileDetails {
  username?: string | Redacted.Redacted<string>;
  firstName?: string | Redacted.Redacted<string>;
  lastName?: string | Redacted.Redacted<string>;
}
export const SsoUserProfileDetails = S.suspend(() =>
  S.Struct({
    username: S.optional(SensitiveString),
    firstName: S.optional(SensitiveString),
    lastName: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "SsoUserProfileDetails",
}) as any as S.Schema<SsoUserProfileDetails>;
export type UserProfileDetails =
  | { iam: IamUserProfileDetails }
  | { sso: SsoUserProfileDetails };
export const UserProfileDetails = S.Union(
  S.Struct({ iam: IamUserProfileDetails }),
  S.Struct({ sso: SsoUserProfileDetails }),
);
export interface SubscribedUser {
  id?: string;
  details?: (typeof UserProfileDetails)["Type"];
}
export const SubscribedUser = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    details: S.optional(UserProfileDetails),
  }),
).annotations({
  identifier: "SubscribedUser",
}) as any as S.Schema<SubscribedUser>;
export interface SubscribedGroup {
  id?: string;
  name?: string | Redacted.Redacted<string>;
}
export const SubscribedGroup = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), name: S.optional(SensitiveString) }),
).annotations({
  identifier: "SubscribedGroup",
}) as any as S.Schema<SubscribedGroup>;
export type SubscribedPrincipal =
  | { project: SubscribedProject }
  | { user: SubscribedUser }
  | { group: SubscribedGroup };
export const SubscribedPrincipal = S.Union(
  S.Struct({ project: SubscribedProject }),
  S.Struct({ user: SubscribedUser }),
  S.Struct({ group: SubscribedGroup }),
);
export type SubscribedPrincipals = (typeof SubscribedPrincipal)["Type"][];
export const SubscribedPrincipals = S.Array(SubscribedPrincipal);
export interface DetailedGlossaryTerm {
  name?: string | Redacted.Redacted<string>;
  shortDescription?: string | Redacted.Redacted<string>;
}
export const DetailedGlossaryTerm = S.suspend(() =>
  S.Struct({
    name: S.optional(SensitiveString),
    shortDescription: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "DetailedGlossaryTerm",
}) as any as S.Schema<DetailedGlossaryTerm>;
export type DetailedGlossaryTerms = DetailedGlossaryTerm[];
export const DetailedGlossaryTerms = S.Array(DetailedGlossaryTerm);
export interface AssetScope {
  assetId: string;
  filterIds: FilterIds;
  status: string;
  errorMessage?: string;
}
export const AssetScope = S.suspend(() =>
  S.Struct({
    assetId: S.String,
    filterIds: FilterIds,
    status: S.String,
    errorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "AssetScope" }) as any as S.Schema<AssetScope>;
export type S3Permissions = string[];
export const S3Permissions = S.Array(S.String);
export type Permissions = { s3: S3Permissions };
export const Permissions = S.Union(S.Struct({ s3: S3Permissions }));
export interface SubscribedAssetListing {
  entityId?: string;
  entityRevision?: string;
  entityType?: string;
  forms?: string;
  glossaryTerms?: DetailedGlossaryTerms;
  assetScope?: AssetScope;
  permissions?: (typeof Permissions)["Type"];
}
export const SubscribedAssetListing = S.suspend(() =>
  S.Struct({
    entityId: S.optional(S.String),
    entityRevision: S.optional(S.String),
    entityType: S.optional(S.String),
    forms: S.optional(S.String),
    glossaryTerms: S.optional(DetailedGlossaryTerms),
    assetScope: S.optional(AssetScope),
    permissions: S.optional(Permissions),
  }),
).annotations({
  identifier: "SubscribedAssetListing",
}) as any as S.Schema<SubscribedAssetListing>;
export interface AssetInDataProductListingItem {
  entityId?: string;
  entityRevision?: string;
  entityType?: string;
}
export const AssetInDataProductListingItem = S.suspend(() =>
  S.Struct({
    entityId: S.optional(S.String),
    entityRevision: S.optional(S.String),
    entityType: S.optional(S.String),
  }),
).annotations({
  identifier: "AssetInDataProductListingItem",
}) as any as S.Schema<AssetInDataProductListingItem>;
export type AssetInDataProductListingItems = AssetInDataProductListingItem[];
export const AssetInDataProductListingItems = S.Array(
  AssetInDataProductListingItem,
);
export interface SubscribedProductListing {
  entityId?: string;
  entityRevision?: string;
  glossaryTerms?: DetailedGlossaryTerms;
  name?: string;
  description?: string;
  assetListings?: AssetInDataProductListingItems;
}
export const SubscribedProductListing = S.suspend(() =>
  S.Struct({
    entityId: S.optional(S.String),
    entityRevision: S.optional(S.String),
    glossaryTerms: S.optional(DetailedGlossaryTerms),
    name: S.optional(S.String),
    description: S.optional(S.String),
    assetListings: S.optional(AssetInDataProductListingItems),
  }),
).annotations({
  identifier: "SubscribedProductListing",
}) as any as S.Schema<SubscribedProductListing>;
export type SubscribedListingItem =
  | { assetListing: SubscribedAssetListing }
  | { productListing: SubscribedProductListing };
export const SubscribedListingItem = S.Union(
  S.Struct({ assetListing: SubscribedAssetListing }),
  S.Struct({ productListing: SubscribedProductListing }),
);
export interface SubscribedListing {
  id: string;
  revision?: string;
  name: string;
  description: string | Redacted.Redacted<string>;
  item: (typeof SubscribedListingItem)["Type"];
  ownerProjectId: string;
  ownerProjectName?: string;
}
export const SubscribedListing = S.suspend(() =>
  S.Struct({
    id: S.String,
    revision: S.optional(S.String),
    name: S.String,
    description: SensitiveString,
    item: SubscribedListingItem,
    ownerProjectId: S.String,
    ownerProjectName: S.optional(S.String),
  }),
).annotations({
  identifier: "SubscribedListing",
}) as any as S.Schema<SubscribedListing>;
export type SubscribedListings = SubscribedListing[];
export const SubscribedListings = S.Array(SubscribedListing);
export interface FormOutput {
  formName: string;
  typeName?: string | Redacted.Redacted<string>;
  typeRevision?: string;
  content?: string;
}
export const FormOutput = S.suspend(() =>
  S.Struct({
    formName: S.String,
    typeName: S.optional(SensitiveString),
    typeRevision: S.optional(S.String),
    content: S.optional(S.String),
  }),
).annotations({ identifier: "FormOutput" }) as any as S.Schema<FormOutput>;
export type MetadataForms = FormOutput[];
export const MetadataForms = S.Array(FormOutput);
export interface TimeSeriesDataPointFormInput {
  formName: string;
  typeIdentifier: string;
  typeRevision?: string;
  timestamp: Date;
  content?: string;
}
export const TimeSeriesDataPointFormInput = S.suspend(() =>
  S.Struct({
    formName: S.String,
    typeIdentifier: S.String,
    typeRevision: S.optional(S.String),
    timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    content: S.optional(S.String),
  }),
).annotations({
  identifier: "TimeSeriesDataPointFormInput",
}) as any as S.Schema<TimeSeriesDataPointFormInput>;
export type TimeSeriesDataPointFormInputList = TimeSeriesDataPointFormInput[];
export const TimeSeriesDataPointFormInputList = S.Array(
  TimeSeriesDataPointFormInput,
);
export interface EncryptionConfiguration {
  kmsKeyArn?: string;
  sseAlgorithm?: string;
}
export const EncryptionConfiguration = S.suspend(() =>
  S.Struct({
    kmsKeyArn: S.optional(S.String),
    sseAlgorithm: S.optional(S.String),
  }),
).annotations({
  identifier: "EncryptionConfiguration",
}) as any as S.Schema<EncryptionConfiguration>;
export interface RejectRule {
  rule?: string;
  threshold?: number;
}
export const RejectRule = S.suspend(() =>
  S.Struct({ rule: S.optional(S.String), threshold: S.optional(S.Number) }),
).annotations({ identifier: "RejectRule" }) as any as S.Schema<RejectRule>;
export interface RejectChoice {
  predictionTarget: string;
  predictionChoices?: PredictionChoices;
}
export const RejectChoice = S.suspend(() =>
  S.Struct({
    predictionTarget: S.String,
    predictionChoices: S.optional(PredictionChoices),
  }),
).annotations({ identifier: "RejectChoice" }) as any as S.Schema<RejectChoice>;
export type RejectChoices = RejectChoice[];
export const RejectChoices = S.Array(RejectChoice);
export interface AggregationListItem {
  attribute: string;
  displayValue?: string;
}
export const AggregationListItem = S.suspend(() =>
  S.Struct({ attribute: S.String, displayValue: S.optional(S.String) }),
).annotations({
  identifier: "AggregationListItem",
}) as any as S.Schema<AggregationListItem>;
export type AggregationList = AggregationListItem[];
export const AggregationList = S.Array(AggregationListItem);
export interface FailureCause {
  message?: string;
}
export const FailureCause = S.suspend(() =>
  S.Struct({ message: S.optional(S.String) }),
).annotations({ identifier: "FailureCause" }) as any as S.Schema<FailureCause>;
export type DomainUnitIds = string[];
export const DomainUnitIds = S.Array(S.String);
export type GlobalParameterMap = { [key: string]: string };
export const GlobalParameterMap = S.Record({ key: S.String, value: S.String });
export type Model = { smithy: string };
export const Model = S.Union(S.Struct({ smithy: S.String }));
export interface MetadataGenerationRunTarget {
  type: string;
  identifier: string;
  revision?: string;
}
export const MetadataGenerationRunTarget = S.suspend(() =>
  S.Struct({
    type: S.String,
    identifier: S.String,
    revision: S.optional(S.String),
  }),
).annotations({
  identifier: "MetadataGenerationRunTarget",
}) as any as S.Schema<MetadataGenerationRunTarget>;
export type ProjectProfileList = string[];
export const ProjectProfileList = S.Array(S.String);
export type S3LocationList = string[];
export const S3LocationList = S.Array(S.String);
export interface AcceptPredictionsInput {
  domainIdentifier: string;
  identifier: string;
  revision?: string;
  acceptRule?: AcceptRule;
  acceptChoices?: AcceptChoices;
  clientToken?: string;
}
export const AcceptPredictionsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    revision: S.optional(S.String).pipe(T.HttpQuery("revision")),
    acceptRule: S.optional(AcceptRule),
    acceptChoices: S.optional(AcceptChoices),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/domains/{domainIdentifier}/assets/{identifier}/accept-predictions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AcceptPredictionsInput",
}) as any as S.Schema<AcceptPredictionsInput>;
export interface BatchPutAttributesMetadataInput {
  domainIdentifier: string;
  entityType: string;
  entityIdentifier: string;
  clientToken?: string;
  attributes: Attributes;
}
export const BatchPutAttributesMetadataInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    clientToken: S.optional(S.String),
    attributes: Attributes,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/domains/{domainIdentifier}/entities/{entityType}/{entityIdentifier}/attributes-metadata",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchPutAttributesMetadataInput",
}) as any as S.Schema<BatchPutAttributesMetadataInput>;
export interface CreateEnvironmentInput {
  projectIdentifier: string;
  domainIdentifier: string;
  description?: string;
  name: string;
  environmentProfileIdentifier?: string;
  userParameters?: EnvironmentParametersList;
  glossaryTerms?: GlossaryTerms;
  environmentAccountIdentifier?: string;
  environmentAccountRegion?: string;
  environmentBlueprintIdentifier?: string;
  deploymentOrder?: number;
  environmentConfigurationId?: string;
}
export const CreateEnvironmentInput = S.suspend(() =>
  S.Struct({
    projectIdentifier: S.String,
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    description: S.optional(S.String),
    name: S.String,
    environmentProfileIdentifier: S.optional(S.String),
    userParameters: S.optional(EnvironmentParametersList),
    glossaryTerms: S.optional(GlossaryTerms),
    environmentAccountIdentifier: S.optional(S.String),
    environmentAccountRegion: S.optional(S.String),
    environmentBlueprintIdentifier: S.optional(S.String),
    deploymentOrder: S.optional(S.Number),
    environmentConfigurationId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/environments",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEnvironmentInput",
}) as any as S.Schema<CreateEnvironmentInput>;
export interface CreateEnvironmentProfileOutput {
  id: string;
  domainId: string;
  awsAccountId?: string;
  awsAccountRegion?: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  environmentBlueprintId: string;
  projectId?: string;
  userParameters?: CustomParameterList;
}
export const CreateEnvironmentProfileOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    domainId: S.String,
    awsAccountId: S.optional(S.String),
    awsAccountRegion: S.optional(S.String),
    createdBy: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    environmentBlueprintId: S.String,
    projectId: S.optional(S.String),
    userParameters: S.optional(CustomParameterList),
  }),
).annotations({
  identifier: "CreateEnvironmentProfileOutput",
}) as any as S.Schema<CreateEnvironmentProfileOutput>;
export interface CreateGroupProfileOutput {
  domainId?: string;
  id?: string;
  status?: string;
  groupName?: string | Redacted.Redacted<string>;
}
export const CreateGroupProfileOutput = S.suspend(() =>
  S.Struct({
    domainId: S.optional(S.String),
    id: S.optional(S.String),
    status: S.optional(S.String),
    groupName: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "CreateGroupProfileOutput",
}) as any as S.Schema<CreateGroupProfileOutput>;
export interface CreateListingChangeSetOutput {
  listingId: string;
  listingRevision: string;
  status: string;
}
export const CreateListingChangeSetOutput = S.suspend(() =>
  S.Struct({
    listingId: S.String,
    listingRevision: S.String,
    status: S.String,
  }),
).annotations({
  identifier: "CreateListingChangeSetOutput",
}) as any as S.Schema<CreateListingChangeSetOutput>;
export interface CreateProjectMembershipInput {
  domainIdentifier: string;
  projectIdentifier: string;
  member: (typeof Member)["Type"];
  designation: string;
}
export const CreateProjectMembershipInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    projectIdentifier: S.String.pipe(T.HttpLabel("projectIdentifier")),
    member: Member,
    designation: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/projects/{projectIdentifier}/createMembership",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProjectMembershipInput",
}) as any as S.Schema<CreateProjectMembershipInput>;
export interface CreateProjectMembershipOutput {}
export const CreateProjectMembershipOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateProjectMembershipOutput",
}) as any as S.Schema<CreateProjectMembershipOutput>;
export interface CreateSubscriptionTargetInput {
  domainIdentifier: string;
  environmentIdentifier: string;
  name: string | Redacted.Redacted<string>;
  type: string;
  subscriptionTargetConfig: SubscriptionTargetForms;
  authorizedPrincipals: AuthorizedPrincipalIdentifiers;
  manageAccessRole: string;
  applicableAssetTypes: ApplicableAssetTypes;
  provider?: string;
  clientToken?: string;
}
export const CreateSubscriptionTargetInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    name: SensitiveString,
    type: S.String,
    subscriptionTargetConfig: SubscriptionTargetForms,
    authorizedPrincipals: AuthorizedPrincipalIdentifiers,
    manageAccessRole: S.String,
    applicableAssetTypes: ApplicableAssetTypes,
    provider: S.optional(S.String),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/subscription-targets",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSubscriptionTargetInput",
}) as any as S.Schema<CreateSubscriptionTargetInput>;
export interface DeleteConnectionOutput {
  status?: string;
}
export const DeleteConnectionOutput = S.suspend(() =>
  S.Struct({ status: S.optional(S.String) }),
).annotations({
  identifier: "DeleteConnectionOutput",
}) as any as S.Schema<DeleteConnectionOutput>;
export interface GetAccountPoolOutput {
  domainId?: string;
  name?: string | Redacted.Redacted<string>;
  id?: string;
  description?: string | Redacted.Redacted<string>;
  resolutionStrategy?: string;
  accountSource: (typeof AccountSource)["Type"];
  createdBy: string;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  updatedBy?: string;
  domainUnitId?: string;
}
export const GetAccountPoolOutput = S.suspend(() =>
  S.Struct({
    domainId: S.optional(S.String),
    name: S.optional(SensitiveString),
    id: S.optional(S.String),
    description: S.optional(SensitiveString),
    resolutionStrategy: S.optional(S.String),
    accountSource: AccountSource,
    createdBy: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedBy: S.optional(S.String),
    domainUnitId: S.optional(S.String),
  }),
).annotations({
  identifier: "GetAccountPoolOutput",
}) as any as S.Schema<GetAccountPoolOutput>;
export interface GetAssetFilterOutput {
  id: string;
  domainId: string;
  assetId: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  status?: string;
  configuration: (typeof AssetFilterConfiguration)["Type"];
  createdAt?: Date;
  errorMessage?: string;
  effectiveColumnNames?: ColumnNameList;
  effectiveRowFilter?: string;
}
export const GetAssetFilterOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    domainId: S.String,
    assetId: S.String,
    name: SensitiveString,
    description: S.optional(SensitiveString),
    status: S.optional(S.String),
    configuration: AssetFilterConfiguration,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    errorMessage: S.optional(S.String),
    effectiveColumnNames: S.optional(ColumnNameList),
    effectiveRowFilter: S.optional(S.String),
  }),
).annotations({
  identifier: "GetAssetFilterOutput",
}) as any as S.Schema<GetAssetFilterOutput>;
export interface GetDataExportConfigurationOutput {
  isExportEnabled?: boolean;
  status?: string;
  encryptionConfiguration?: EncryptionConfiguration;
  s3TableBucketArn?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export const GetDataExportConfigurationOutput = S.suspend(() =>
  S.Struct({
    isExportEnabled: S.optional(S.Boolean),
    status: S.optional(S.String),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    s3TableBucketArn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetDataExportConfigurationOutput",
}) as any as S.Schema<GetDataExportConfigurationOutput>;
export interface GetEnvironmentActionOutput {
  domainId: string;
  environmentId: string;
  id: string;
  name: string;
  parameters: (typeof ActionParameters)["Type"];
  description?: string;
}
export const GetEnvironmentActionOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    environmentId: S.String,
    id: S.String,
    name: S.String,
    parameters: ActionParameters,
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "GetEnvironmentActionOutput",
}) as any as S.Schema<GetEnvironmentActionOutput>;
export interface DeploymentProperties {
  startTimeoutMinutes?: number;
  endTimeoutMinutes?: number;
}
export const DeploymentProperties = S.suspend(() =>
  S.Struct({
    startTimeoutMinutes: S.optional(S.Number),
    endTimeoutMinutes: S.optional(S.Number),
  }),
).annotations({
  identifier: "DeploymentProperties",
}) as any as S.Schema<DeploymentProperties>;
export interface GetEnvironmentBlueprintOutput {
  id: string;
  name: string;
  description?: string | Redacted.Redacted<string>;
  provider: string;
  provisioningProperties: (typeof ProvisioningProperties)["Type"];
  deploymentProperties?: DeploymentProperties;
  userParameters?: CustomParameterList;
  glossaryTerms?: GlossaryTerms;
  createdAt?: Date;
  updatedAt?: Date;
}
export const GetEnvironmentBlueprintOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    description: S.optional(SensitiveString),
    provider: S.String,
    provisioningProperties: ProvisioningProperties,
    deploymentProperties: S.optional(DeploymentProperties),
    userParameters: S.optional(CustomParameterList),
    glossaryTerms: S.optional(GlossaryTerms),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetEnvironmentBlueprintOutput",
}) as any as S.Schema<GetEnvironmentBlueprintOutput>;
export interface GetEnvironmentCredentialsOutput {
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
  expiration?: Date;
}
export const GetEnvironmentCredentialsOutput = S.suspend(() =>
  S.Struct({
    accessKeyId: S.optional(S.String),
    secretAccessKey: S.optional(S.String),
    sessionToken: S.optional(S.String),
    expiration: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetEnvironmentCredentialsOutput",
}) as any as S.Schema<GetEnvironmentCredentialsOutput>;
export interface GetEnvironmentProfileOutput {
  id: string;
  domainId: string;
  awsAccountId?: string;
  awsAccountRegion?: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  environmentBlueprintId: string;
  projectId?: string;
  userParameters?: CustomParameterList;
}
export const GetEnvironmentProfileOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    domainId: S.String,
    awsAccountId: S.optional(S.String),
    awsAccountRegion: S.optional(S.String),
    createdBy: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    environmentBlueprintId: S.String,
    projectId: S.optional(S.String),
    userParameters: S.optional(CustomParameterList),
  }),
).annotations({
  identifier: "GetEnvironmentProfileOutput",
}) as any as S.Schema<GetEnvironmentProfileOutput>;
export interface GetGroupProfileOutput {
  domainId?: string;
  id?: string;
  status?: string;
  groupName?: string | Redacted.Redacted<string>;
}
export const GetGroupProfileOutput = S.suspend(() =>
  S.Struct({
    domainId: S.optional(S.String),
    id: S.optional(S.String),
    status: S.optional(S.String),
    groupName: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "GetGroupProfileOutput",
}) as any as S.Schema<GetGroupProfileOutput>;
export interface GetIamPortalLoginUrlOutput {
  authCodeUrl?: string;
  userProfileId: string;
}
export const GetIamPortalLoginUrlOutput = S.suspend(() =>
  S.Struct({ authCodeUrl: S.optional(S.String), userProfileId: S.String }),
).annotations({
  identifier: "GetIamPortalLoginUrlOutput",
}) as any as S.Schema<GetIamPortalLoginUrlOutput>;
export interface GetLineageEventOutput {
  domainId?: string;
  id?: string;
  event?: T.StreamingOutputBody;
  createdBy?: string;
  processingStatus?: string;
  eventTime?: Date;
  createdAt?: Date;
}
export const GetLineageEventOutput = S.suspend(() =>
  S.Struct({
    domainId: S.optional(S.String).pipe(T.HttpHeader("Domain-Id")),
    id: S.optional(S.String).pipe(T.HttpHeader("Id")),
    event: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
    createdBy: S.optional(S.String).pipe(T.HttpHeader("Created-By")),
    processingStatus: S.optional(S.String).pipe(
      T.HttpHeader("Processing-Status"),
    ),
    eventTime: S.optional(S.Date.pipe(T.TimestampFormat("http-date"))).pipe(
      T.HttpHeader("Event-Time"),
    ),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("http-date"))).pipe(
      T.HttpHeader("Created-At"),
    ),
  }),
).annotations({
  identifier: "GetLineageEventOutput",
}) as any as S.Schema<GetLineageEventOutput>;
export interface GetProjectProfileOutput {
  domainId: string;
  id: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  status?: string;
  projectResourceTags?: ProjectResourceTagParameters;
  allowCustomProjectResourceTags?: boolean;
  projectResourceTagsDescription?: string | Redacted.Redacted<string>;
  environmentConfigurations?: EnvironmentConfigurationsList;
  createdBy: string;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  domainUnitId?: string;
}
export const GetProjectProfileOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    id: S.String,
    name: SensitiveString,
    description: S.optional(SensitiveString),
    status: S.optional(S.String),
    projectResourceTags: S.optional(ProjectResourceTagParameters),
    allowCustomProjectResourceTags: S.optional(S.Boolean),
    projectResourceTagsDescription: S.optional(SensitiveString),
    environmentConfigurations: S.optional(EnvironmentConfigurationsList),
    createdBy: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    domainUnitId: S.optional(S.String),
  }),
).annotations({
  identifier: "GetProjectProfileOutput",
}) as any as S.Schema<GetProjectProfileOutput>;
export interface GetSubscriptionOutput {
  id: string;
  createdBy: string;
  updatedBy?: string;
  domainId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  subscribedPrincipal: (typeof SubscribedPrincipal)["Type"];
  subscribedListing: SubscribedListing;
  subscriptionRequestId?: string;
  retainPermissions?: boolean;
}
export const GetSubscriptionOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    createdBy: S.String,
    updatedBy: S.optional(S.String),
    domainId: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    subscribedPrincipal: SubscribedPrincipal,
    subscribedListing: SubscribedListing,
    subscriptionRequestId: S.optional(S.String),
    retainPermissions: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GetSubscriptionOutput",
}) as any as S.Schema<GetSubscriptionOutput>;
export interface ListingRevision {
  id: string;
  revision: string;
}
export const ListingRevision = S.suspend(() =>
  S.Struct({ id: S.String, revision: S.String }),
).annotations({
  identifier: "ListingRevision",
}) as any as S.Schema<ListingRevision>;
export type GrantedEntity = { listing: ListingRevision };
export const GrantedEntity = S.Union(S.Struct({ listing: ListingRevision }));
export interface SubscribedAsset {
  assetId: string;
  assetRevision: string;
  status: string;
  targetName?: string;
  failureCause?: FailureCause;
  grantedTimestamp?: Date;
  failureTimestamp?: Date;
  assetScope?: AssetScope;
  permissions?: (typeof Permissions)["Type"];
}
export const SubscribedAsset = S.suspend(() =>
  S.Struct({
    assetId: S.String,
    assetRevision: S.String,
    status: S.String,
    targetName: S.optional(S.String),
    failureCause: S.optional(FailureCause),
    grantedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    failureTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    assetScope: S.optional(AssetScope),
    permissions: S.optional(Permissions),
  }),
).annotations({
  identifier: "SubscribedAsset",
}) as any as S.Schema<SubscribedAsset>;
export type SubscribedAssets = SubscribedAsset[];
export const SubscribedAssets = S.Array(SubscribedAsset);
export interface GetSubscriptionGrantOutput {
  id: string;
  createdBy: string;
  updatedBy?: string;
  domainId: string;
  createdAt: Date;
  updatedAt: Date;
  environmentId?: string;
  subscriptionTargetId: string;
  grantedEntity: (typeof GrantedEntity)["Type"];
  status: string;
  assets?: SubscribedAssets;
  subscriptionId?: string;
}
export const GetSubscriptionGrantOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    createdBy: S.String,
    updatedBy: S.optional(S.String),
    domainId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    environmentId: S.optional(S.String),
    subscriptionTargetId: S.String,
    grantedEntity: GrantedEntity,
    status: S.String,
    assets: S.optional(SubscribedAssets),
    subscriptionId: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSubscriptionGrantOutput",
}) as any as S.Schema<GetSubscriptionGrantOutput>;
export interface GetSubscriptionRequestDetailsOutput {
  id: string;
  createdBy: string;
  updatedBy?: string;
  domainId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  requestReason: string | Redacted.Redacted<string>;
  subscribedPrincipals: SubscribedPrincipals;
  subscribedListings: SubscribedListings;
  reviewerId?: string;
  decisionComment?: string | Redacted.Redacted<string>;
  existingSubscriptionId?: string;
  metadataForms?: MetadataForms;
}
export const GetSubscriptionRequestDetailsOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    createdBy: S.String,
    updatedBy: S.optional(S.String),
    domainId: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    requestReason: SensitiveString,
    subscribedPrincipals: SubscribedPrincipals,
    subscribedListings: SubscribedListings,
    reviewerId: S.optional(S.String),
    decisionComment: S.optional(SensitiveString),
    existingSubscriptionId: S.optional(S.String),
    metadataForms: S.optional(MetadataForms),
  }),
).annotations({
  identifier: "GetSubscriptionRequestDetailsOutput",
}) as any as S.Schema<GetSubscriptionRequestDetailsOutput>;
export interface GetSubscriptionTargetOutput {
  id: string;
  authorizedPrincipals: AuthorizedPrincipalIdentifiers;
  domainId: string;
  projectId: string;
  environmentId: string;
  name: string | Redacted.Redacted<string>;
  type: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt?: Date;
  manageAccessRole?: string;
  applicableAssetTypes: ApplicableAssetTypes;
  subscriptionTargetConfig: SubscriptionTargetForms;
  provider: string;
}
export const GetSubscriptionTargetOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    authorizedPrincipals: AuthorizedPrincipalIdentifiers,
    domainId: S.String,
    projectId: S.String,
    environmentId: S.String,
    name: SensitiveString,
    type: S.String,
    createdBy: S.String,
    updatedBy: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    manageAccessRole: S.optional(S.String),
    applicableAssetTypes: ApplicableAssetTypes,
    subscriptionTargetConfig: SubscriptionTargetForms,
    provider: S.String,
  }),
).annotations({
  identifier: "GetSubscriptionTargetOutput",
}) as any as S.Schema<GetSubscriptionTargetOutput>;
export interface GetUserProfileOutput {
  domainId?: string;
  id?: string;
  type?: string;
  status?: string;
  details?: (typeof UserProfileDetails)["Type"];
}
export const GetUserProfileOutput = S.suspend(() =>
  S.Struct({
    domainId: S.optional(S.String),
    id: S.optional(S.String),
    type: S.optional(S.String),
    status: S.optional(S.String),
    details: S.optional(UserProfileDetails),
  }),
).annotations({
  identifier: "GetUserProfileOutput",
}) as any as S.Schema<GetUserProfileOutput>;
export interface ListAccountsInAccountPoolOutput {
  items?: AccountInfoList;
  nextToken?: string;
}
export const ListAccountsInAccountPoolOutput = S.suspend(() =>
  S.Struct({
    items: S.optional(AccountInfoList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAccountsInAccountPoolOutput",
}) as any as S.Schema<ListAccountsInAccountPoolOutput>;
export interface ListTagsForResourceResponse {
  tags?: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PostLineageEventOutput {
  id?: string;
  domainId?: string;
}
export const PostLineageEventOutput = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), domainId: S.optional(S.String) }),
).annotations({
  identifier: "PostLineageEventOutput",
}) as any as S.Schema<PostLineageEventOutput>;
export interface PostTimeSeriesDataPointsInput {
  domainIdentifier: string;
  entityIdentifier: string;
  entityType: string;
  forms: TimeSeriesDataPointFormInputList;
  clientToken?: string;
}
export const PostTimeSeriesDataPointsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    forms: TimeSeriesDataPointFormInputList,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/entities/{entityType}/{entityIdentifier}/time-series-data-points",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PostTimeSeriesDataPointsInput",
}) as any as S.Schema<PostTimeSeriesDataPointsInput>;
export interface PutDataExportConfigurationInput {
  domainIdentifier: string;
  enableExport: boolean;
  encryptionConfiguration?: EncryptionConfiguration;
  clientToken?: string;
}
export const PutDataExportConfigurationInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    enableExport: S.Boolean,
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/domains/{domainIdentifier}/data-export-configuration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutDataExportConfigurationInput",
}) as any as S.Schema<PutDataExportConfigurationInput>;
export interface PutDataExportConfigurationOutput {}
export const PutDataExportConfigurationOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutDataExportConfigurationOutput",
}) as any as S.Schema<PutDataExportConfigurationOutput>;
export interface RejectPredictionsInput {
  domainIdentifier: string;
  identifier: string;
  revision?: string;
  rejectRule?: RejectRule;
  rejectChoices?: RejectChoices;
  clientToken?: string;
}
export const RejectPredictionsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    revision: S.optional(S.String).pipe(T.HttpQuery("revision")),
    rejectRule: S.optional(RejectRule),
    rejectChoices: S.optional(RejectChoices),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/domains/{domainIdentifier}/assets/{identifier}/reject-predictions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RejectPredictionsInput",
}) as any as S.Schema<RejectPredictionsInput>;
export interface RejectSubscriptionRequestOutput {
  id: string;
  createdBy: string;
  updatedBy?: string;
  domainId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  requestReason: string | Redacted.Redacted<string>;
  subscribedPrincipals: SubscribedPrincipals;
  subscribedListings: SubscribedListings;
  reviewerId?: string;
  decisionComment?: string | Redacted.Redacted<string>;
  existingSubscriptionId?: string;
  metadataForms?: MetadataForms;
}
export const RejectSubscriptionRequestOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    createdBy: S.String,
    updatedBy: S.optional(S.String),
    domainId: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    requestReason: SensitiveString,
    subscribedPrincipals: SubscribedPrincipals,
    subscribedListings: SubscribedListings,
    reviewerId: S.optional(S.String),
    decisionComment: S.optional(SensitiveString),
    existingSubscriptionId: S.optional(S.String),
    metadataForms: S.optional(MetadataForms),
  }),
).annotations({
  identifier: "RejectSubscriptionRequestOutput",
}) as any as S.Schema<RejectSubscriptionRequestOutput>;
export interface RevokeSubscriptionOutput {
  id: string;
  createdBy: string;
  updatedBy?: string;
  domainId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  subscribedPrincipal: (typeof SubscribedPrincipal)["Type"];
  subscribedListing: SubscribedListing;
  subscriptionRequestId?: string;
  retainPermissions?: boolean;
}
export const RevokeSubscriptionOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    createdBy: S.String,
    updatedBy: S.optional(S.String),
    domainId: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    subscribedPrincipal: SubscribedPrincipal,
    subscribedListing: SubscribedListing,
    subscriptionRequestId: S.optional(S.String),
    retainPermissions: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "RevokeSubscriptionOutput",
}) as any as S.Schema<RevokeSubscriptionOutput>;
export interface SearchListingsInput {
  domainIdentifier: string;
  searchText?: string;
  searchIn?: SearchInList;
  maxResults?: number;
  nextToken?: string;
  filters?: FilterClause;
  aggregations?: AggregationList;
  sort?: SearchSort;
  additionalAttributes?: SearchOutputAdditionalAttributes;
}
export const SearchListingsInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    searchText: S.optional(S.String),
    searchIn: S.optional(SearchInList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    filters: S.optional(FilterClause),
    aggregations: S.optional(AggregationList),
    sort: S.optional(SearchSort),
    additionalAttributes: S.optional(SearchOutputAdditionalAttributes),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/listings/search",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchListingsInput",
}) as any as S.Schema<SearchListingsInput>;
export interface UpdateAccountPoolOutput {
  domainId?: string;
  name?: string | Redacted.Redacted<string>;
  id?: string;
  description?: string | Redacted.Redacted<string>;
  resolutionStrategy?: string;
  accountSource: (typeof AccountSource)["Type"];
  createdBy: string;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  updatedBy?: string;
  domainUnitId?: string;
}
export const UpdateAccountPoolOutput = S.suspend(() =>
  S.Struct({
    domainId: S.optional(S.String),
    name: S.optional(SensitiveString),
    id: S.optional(S.String),
    description: S.optional(SensitiveString),
    resolutionStrategy: S.optional(S.String),
    accountSource: AccountSource,
    createdBy: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedBy: S.optional(S.String),
    domainUnitId: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateAccountPoolOutput",
}) as any as S.Schema<UpdateAccountPoolOutput>;
export interface UpdateAssetFilterOutput {
  id: string;
  domainId: string;
  assetId: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  status?: string;
  configuration: (typeof AssetFilterConfiguration)["Type"];
  createdAt?: Date;
  errorMessage?: string;
  effectiveColumnNames?: ColumnNameList;
  effectiveRowFilter?: string;
}
export const UpdateAssetFilterOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    domainId: S.String,
    assetId: S.String,
    name: SensitiveString,
    description: S.optional(SensitiveString),
    status: S.optional(S.String),
    configuration: AssetFilterConfiguration,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    errorMessage: S.optional(S.String),
    effectiveColumnNames: S.optional(ColumnNameList),
    effectiveRowFilter: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateAssetFilterOutput",
}) as any as S.Schema<UpdateAssetFilterOutput>;
export interface Resource {
  provider?: string;
  name?: string;
  value: string;
  type: string;
}
export const Resource = S.suspend(() =>
  S.Struct({
    provider: S.optional(S.String),
    name: S.optional(S.String),
    value: S.String,
    type: S.String,
  }),
).annotations({ identifier: "Resource" }) as any as S.Schema<Resource>;
export type ResourceList = Resource[];
export const ResourceList = S.Array(Resource);
export interface ConfigurableActionParameter {
  key?: string;
  value?: string;
}
export const ConfigurableActionParameter = S.suspend(() =>
  S.Struct({ key: S.optional(S.String), value: S.optional(S.String) }),
).annotations({
  identifier: "ConfigurableActionParameter",
}) as any as S.Schema<ConfigurableActionParameter>;
export type ConfigurableActionParameterList = ConfigurableActionParameter[];
export const ConfigurableActionParameterList = S.Array(
  ConfigurableActionParameter,
);
export interface ConfigurableEnvironmentAction {
  type: string;
  auth?: string;
  parameters: ConfigurableActionParameterList;
}
export const ConfigurableEnvironmentAction = S.suspend(() =>
  S.Struct({
    type: S.String,
    auth: S.optional(S.String),
    parameters: ConfigurableActionParameterList,
  }),
).annotations({
  identifier: "ConfigurableEnvironmentAction",
}) as any as S.Schema<ConfigurableEnvironmentAction>;
export type EnvironmentActionList = ConfigurableEnvironmentAction[];
export const EnvironmentActionList = S.Array(ConfigurableEnvironmentAction);
export interface EnvironmentError {
  code?: string;
  message: string;
}
export const EnvironmentError = S.suspend(() =>
  S.Struct({ code: S.optional(S.String), message: S.String }),
).annotations({
  identifier: "EnvironmentError",
}) as any as S.Schema<EnvironmentError>;
export type DeploymentMessagesList = string[];
export const DeploymentMessagesList = S.Array(S.String);
export interface Deployment {
  deploymentId?: string;
  deploymentType?: string;
  deploymentStatus?: string;
  failureReason?: EnvironmentError;
  messages?: DeploymentMessagesList;
  isDeploymentComplete?: boolean;
}
export const Deployment = S.suspend(() =>
  S.Struct({
    deploymentId: S.optional(S.String),
    deploymentType: S.optional(S.String),
    deploymentStatus: S.optional(S.String),
    failureReason: S.optional(EnvironmentError),
    messages: S.optional(DeploymentMessagesList),
    isDeploymentComplete: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Deployment" }) as any as S.Schema<Deployment>;
export interface UpdateEnvironmentOutput {
  projectId: string;
  id?: string;
  domainId: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  environmentProfileId?: string;
  awsAccountId?: string;
  awsAccountRegion?: string;
  provider: string;
  provisionedResources?: ResourceList;
  status?: string;
  environmentActions?: EnvironmentActionList;
  glossaryTerms?: GlossaryTerms;
  userParameters?: CustomParameterList;
  lastDeployment?: Deployment;
  provisioningProperties?: (typeof ProvisioningProperties)["Type"];
  deploymentProperties?: DeploymentProperties;
  environmentBlueprintId?: string;
  environmentConfigurationId?: string | Redacted.Redacted<string>;
}
export const UpdateEnvironmentOutput = S.suspend(() =>
  S.Struct({
    projectId: S.String,
    id: S.optional(S.String),
    domainId: S.String,
    createdBy: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    environmentProfileId: S.optional(S.String),
    awsAccountId: S.optional(S.String),
    awsAccountRegion: S.optional(S.String),
    provider: S.String,
    provisionedResources: S.optional(ResourceList),
    status: S.optional(S.String),
    environmentActions: S.optional(EnvironmentActionList),
    glossaryTerms: S.optional(GlossaryTerms),
    userParameters: S.optional(CustomParameterList),
    lastDeployment: S.optional(Deployment),
    provisioningProperties: S.optional(ProvisioningProperties),
    deploymentProperties: S.optional(DeploymentProperties),
    environmentBlueprintId: S.optional(S.String),
    environmentConfigurationId: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "UpdateEnvironmentOutput",
}) as any as S.Schema<UpdateEnvironmentOutput>;
export interface UpdateEnvironmentActionOutput {
  domainId: string;
  environmentId: string;
  id: string;
  name: string;
  parameters: (typeof ActionParameters)["Type"];
  description?: string;
}
export const UpdateEnvironmentActionOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    environmentId: S.String,
    id: S.String,
    name: S.String,
    parameters: ActionParameters,
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateEnvironmentActionOutput",
}) as any as S.Schema<UpdateEnvironmentActionOutput>;
export interface UpdateEnvironmentBlueprintOutput {
  id: string;
  name: string;
  description?: string | Redacted.Redacted<string>;
  provider: string;
  provisioningProperties: (typeof ProvisioningProperties)["Type"];
  deploymentProperties?: DeploymentProperties;
  userParameters?: CustomParameterList;
  glossaryTerms?: GlossaryTerms;
  createdAt?: Date;
  updatedAt?: Date;
}
export const UpdateEnvironmentBlueprintOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    description: S.optional(SensitiveString),
    provider: S.String,
    provisioningProperties: ProvisioningProperties,
    deploymentProperties: S.optional(DeploymentProperties),
    userParameters: S.optional(CustomParameterList),
    glossaryTerms: S.optional(GlossaryTerms),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "UpdateEnvironmentBlueprintOutput",
}) as any as S.Schema<UpdateEnvironmentBlueprintOutput>;
export interface UpdateEnvironmentProfileOutput {
  id: string;
  domainId: string;
  awsAccountId?: string;
  awsAccountRegion?: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  environmentBlueprintId: string;
  projectId?: string;
  userParameters?: CustomParameterList;
}
export const UpdateEnvironmentProfileOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    domainId: S.String,
    awsAccountId: S.optional(S.String),
    awsAccountRegion: S.optional(S.String),
    createdBy: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    environmentBlueprintId: S.String,
    projectId: S.optional(S.String),
    userParameters: S.optional(CustomParameterList),
  }),
).annotations({
  identifier: "UpdateEnvironmentProfileOutput",
}) as any as S.Schema<UpdateEnvironmentProfileOutput>;
export interface UpdateGroupProfileOutput {
  domainId?: string;
  id?: string;
  status?: string;
  groupName?: string | Redacted.Redacted<string>;
}
export const UpdateGroupProfileOutput = S.suspend(() =>
  S.Struct({
    domainId: S.optional(S.String),
    id: S.optional(S.String),
    status: S.optional(S.String),
    groupName: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "UpdateGroupProfileOutput",
}) as any as S.Schema<UpdateGroupProfileOutput>;
export interface UpdateProjectProfileOutput {
  domainId: string;
  id: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  status?: string;
  projectResourceTags?: ProjectResourceTagParameters;
  allowCustomProjectResourceTags?: boolean;
  projectResourceTagsDescription?: string | Redacted.Redacted<string>;
  environmentConfigurations?: EnvironmentConfigurationsList;
  createdBy: string;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  domainUnitId?: string;
}
export const UpdateProjectProfileOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    id: S.String,
    name: SensitiveString,
    description: S.optional(SensitiveString),
    status: S.optional(S.String),
    projectResourceTags: S.optional(ProjectResourceTagParameters),
    allowCustomProjectResourceTags: S.optional(S.Boolean),
    projectResourceTagsDescription: S.optional(SensitiveString),
    environmentConfigurations: S.optional(EnvironmentConfigurationsList),
    createdBy: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    domainUnitId: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateProjectProfileOutput",
}) as any as S.Schema<UpdateProjectProfileOutput>;
export interface UpdateSubscriptionGrantStatusInput {
  domainIdentifier: string;
  identifier: string;
  assetIdentifier: string;
  status: string;
  failureCause?: FailureCause;
  targetName?: string;
}
export const UpdateSubscriptionGrantStatusInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    assetIdentifier: S.String.pipe(T.HttpLabel("assetIdentifier")),
    status: S.String,
    failureCause: S.optional(FailureCause),
    targetName: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/v2/domains/{domainIdentifier}/subscription-grants/{identifier}/status/{assetIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSubscriptionGrantStatusInput",
}) as any as S.Schema<UpdateSubscriptionGrantStatusInput>;
export interface UpdateSubscriptionRequestOutput {
  id: string;
  createdBy: string;
  updatedBy?: string;
  domainId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  requestReason: string | Redacted.Redacted<string>;
  subscribedPrincipals: SubscribedPrincipals;
  subscribedListings: SubscribedListings;
  reviewerId?: string;
  decisionComment?: string | Redacted.Redacted<string>;
  existingSubscriptionId?: string;
  metadataForms?: MetadataForms;
}
export const UpdateSubscriptionRequestOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    createdBy: S.String,
    updatedBy: S.optional(S.String),
    domainId: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    requestReason: SensitiveString,
    subscribedPrincipals: SubscribedPrincipals,
    subscribedListings: SubscribedListings,
    reviewerId: S.optional(S.String),
    decisionComment: S.optional(SensitiveString),
    existingSubscriptionId: S.optional(S.String),
    metadataForms: S.optional(MetadataForms),
  }),
).annotations({
  identifier: "UpdateSubscriptionRequestOutput",
}) as any as S.Schema<UpdateSubscriptionRequestOutput>;
export interface UpdateSubscriptionTargetOutput {
  id: string;
  authorizedPrincipals: AuthorizedPrincipalIdentifiers;
  domainId: string;
  projectId: string;
  environmentId: string;
  name: string | Redacted.Redacted<string>;
  type: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt?: Date;
  manageAccessRole?: string;
  applicableAssetTypes: ApplicableAssetTypes;
  subscriptionTargetConfig: SubscriptionTargetForms;
  provider: string;
}
export const UpdateSubscriptionTargetOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    authorizedPrincipals: AuthorizedPrincipalIdentifiers,
    domainId: S.String,
    projectId: S.String,
    environmentId: S.String,
    name: SensitiveString,
    type: S.String,
    createdBy: S.String,
    updatedBy: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    manageAccessRole: S.optional(S.String),
    applicableAssetTypes: ApplicableAssetTypes,
    subscriptionTargetConfig: SubscriptionTargetForms,
    provider: S.String,
  }),
).annotations({
  identifier: "UpdateSubscriptionTargetOutput",
}) as any as S.Schema<UpdateSubscriptionTargetOutput>;
export interface UpdateUserProfileOutput {
  domainId?: string;
  id?: string;
  type?: string;
  status?: string;
  details?: (typeof UserProfileDetails)["Type"];
}
export const UpdateUserProfileOutput = S.suspend(() =>
  S.Struct({
    domainId: S.optional(S.String),
    id: S.optional(S.String),
    type: S.optional(S.String),
    status: S.optional(S.String),
    details: S.optional(UserProfileDetails),
  }),
).annotations({
  identifier: "UpdateUserProfileOutput",
}) as any as S.Schema<UpdateUserProfileOutput>;
export interface AssetListingDetails {
  listingId: string;
  listingStatus: string;
}
export const AssetListingDetails = S.suspend(() =>
  S.Struct({ listingId: S.String, listingStatus: S.String }),
).annotations({
  identifier: "AssetListingDetails",
}) as any as S.Schema<AssetListingDetails>;
export type FormOutputList = FormOutput[];
export const FormOutputList = S.Array(FormOutput);
export interface TimeSeriesDataPointSummaryFormOutput {
  formName: string;
  typeIdentifier: string;
  typeRevision?: string;
  timestamp: Date;
  contentSummary?: string;
  id?: string;
}
export const TimeSeriesDataPointSummaryFormOutput = S.suspend(() =>
  S.Struct({
    formName: S.String,
    typeIdentifier: S.String,
    typeRevision: S.optional(S.String),
    timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    contentSummary: S.optional(S.String),
    id: S.optional(S.String),
  }),
).annotations({
  identifier: "TimeSeriesDataPointSummaryFormOutput",
}) as any as S.Schema<TimeSeriesDataPointSummaryFormOutput>;
export type TimeSeriesDataPointSummaryFormOutputList =
  TimeSeriesDataPointSummaryFormOutput[];
export const TimeSeriesDataPointSummaryFormOutputList = S.Array(
  TimeSeriesDataPointSummaryFormOutput,
);
export interface CreateAssetRevisionOutput {
  id: string;
  name: string | Redacted.Redacted<string>;
  typeIdentifier: string;
  typeRevision: string;
  externalIdentifier?: string;
  revision: string;
  description?: string | Redacted.Redacted<string>;
  createdAt?: Date;
  createdBy?: string;
  firstRevisionCreatedAt?: Date;
  firstRevisionCreatedBy?: string;
  glossaryTerms?: GlossaryTerms;
  governedGlossaryTerms?: GovernedGlossaryTerms;
  owningProjectId: string;
  domainId: string;
  listing?: AssetListingDetails;
  formsOutput: FormOutputList;
  readOnlyFormsOutput?: FormOutputList;
  latestTimeSeriesDataPointFormsOutput?: TimeSeriesDataPointSummaryFormOutputList;
  predictionConfiguration?: PredictionConfiguration;
}
export const CreateAssetRevisionOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: SensitiveString,
    typeIdentifier: S.String,
    typeRevision: S.String,
    externalIdentifier: S.optional(S.String),
    revision: S.String,
    description: S.optional(SensitiveString),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    firstRevisionCreatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    firstRevisionCreatedBy: S.optional(S.String),
    glossaryTerms: S.optional(GlossaryTerms),
    governedGlossaryTerms: S.optional(GovernedGlossaryTerms),
    owningProjectId: S.String,
    domainId: S.String,
    listing: S.optional(AssetListingDetails),
    formsOutput: FormOutputList,
    readOnlyFormsOutput: S.optional(FormOutputList),
    latestTimeSeriesDataPointFormsOutput: S.optional(
      TimeSeriesDataPointSummaryFormOutputList,
    ),
    predictionConfiguration: S.optional(PredictionConfiguration),
  }),
).annotations({
  identifier: "CreateAssetRevisionOutput",
}) as any as S.Schema<CreateAssetRevisionOutput>;
export interface CreateDataProductInput {
  domainIdentifier: string;
  name: string | Redacted.Redacted<string>;
  owningProjectIdentifier: string;
  description?: string | Redacted.Redacted<string>;
  glossaryTerms?: GlossaryTerms;
  formsInput?: FormInputList;
  items?: DataProductItems;
  clientToken?: string;
}
export const CreateDataProductInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: SensitiveString,
    owningProjectIdentifier: S.String,
    description: S.optional(SensitiveString),
    glossaryTerms: S.optional(GlossaryTerms),
    formsInput: S.optional(FormInputList),
    items: S.optional(DataProductItems),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/data-products",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDataProductInput",
}) as any as S.Schema<CreateDataProductInput>;
export interface GetDataProductOutput {
  domainId: string;
  id: string;
  revision: string;
  owningProjectId: string;
  name: string | Redacted.Redacted<string>;
  status: string;
  description?: string | Redacted.Redacted<string>;
  glossaryTerms?: GlossaryTerms;
  items?: DataProductItems;
  formsOutput?: FormOutputList;
  createdAt?: Date;
  createdBy?: string;
  firstRevisionCreatedAt?: Date;
  firstRevisionCreatedBy?: string;
}
export const GetDataProductOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    id: S.String,
    revision: S.String,
    owningProjectId: S.String,
    name: SensitiveString,
    status: S.String,
    description: S.optional(SensitiveString),
    glossaryTerms: S.optional(GlossaryTerms),
    items: S.optional(DataProductItems),
    formsOutput: S.optional(FormOutputList),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    firstRevisionCreatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    firstRevisionCreatedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDataProductOutput",
}) as any as S.Schema<GetDataProductOutput>;
export interface CreateDataProductRevisionOutput {
  domainId: string;
  id: string;
  revision: string;
  owningProjectId: string;
  name: string | Redacted.Redacted<string>;
  status: string;
  description?: string | Redacted.Redacted<string>;
  glossaryTerms?: GlossaryTerms;
  items?: DataProductItems;
  formsOutput?: FormOutputList;
  createdAt?: Date;
  createdBy?: string;
  firstRevisionCreatedAt?: Date;
  firstRevisionCreatedBy?: string;
}
export const CreateDataProductRevisionOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    id: S.String,
    revision: S.String,
    owningProjectId: S.String,
    name: SensitiveString,
    status: S.String,
    description: S.optional(SensitiveString),
    glossaryTerms: S.optional(GlossaryTerms),
    items: S.optional(DataProductItems),
    formsOutput: S.optional(FormOutputList),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    firstRevisionCreatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    firstRevisionCreatedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateDataProductRevisionOutput",
}) as any as S.Schema<CreateDataProductRevisionOutput>;
export interface GlueRunConfigurationOutput {
  accountId?: string;
  region?: string;
  dataAccessRole?: string;
  relationalFilterConfigurations: RelationalFilterConfigurations;
  autoImportDataQualityResult?: boolean;
  catalogName?: string;
}
export const GlueRunConfigurationOutput = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String),
    region: S.optional(S.String),
    dataAccessRole: S.optional(S.String),
    relationalFilterConfigurations: RelationalFilterConfigurations,
    autoImportDataQualityResult: S.optional(S.Boolean),
    catalogName: S.optional(S.String),
  }),
).annotations({
  identifier: "GlueRunConfigurationOutput",
}) as any as S.Schema<GlueRunConfigurationOutput>;
export interface RedshiftRunConfigurationOutput {
  accountId?: string;
  region?: string;
  dataAccessRole?: string;
  relationalFilterConfigurations: RelationalFilterConfigurations;
  redshiftCredentialConfiguration?: RedshiftCredentialConfiguration;
  redshiftStorage: (typeof RedshiftStorage)["Type"];
}
export const RedshiftRunConfigurationOutput = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String),
    region: S.optional(S.String),
    dataAccessRole: S.optional(S.String),
    relationalFilterConfigurations: RelationalFilterConfigurations,
    redshiftCredentialConfiguration: S.optional(
      RedshiftCredentialConfiguration,
    ),
    redshiftStorage: RedshiftStorage,
  }),
).annotations({
  identifier: "RedshiftRunConfigurationOutput",
}) as any as S.Schema<RedshiftRunConfigurationOutput>;
export interface SageMakerRunConfigurationOutput {
  accountId?: string;
  region?: string;
  trackingAssets: TrackingAssets;
}
export const SageMakerRunConfigurationOutput = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String),
    region: S.optional(S.String),
    trackingAssets: TrackingAssets,
  }),
).annotations({
  identifier: "SageMakerRunConfigurationOutput",
}) as any as S.Schema<SageMakerRunConfigurationOutput>;
export type DataSourceConfigurationOutput =
  | { glueRunConfiguration: GlueRunConfigurationOutput }
  | { redshiftRunConfiguration: RedshiftRunConfigurationOutput }
  | { sageMakerRunConfiguration: SageMakerRunConfigurationOutput };
export const DataSourceConfigurationOutput = S.Union(
  S.Struct({ glueRunConfiguration: GlueRunConfigurationOutput }),
  S.Struct({ redshiftRunConfiguration: RedshiftRunConfigurationOutput }),
  S.Struct({ sageMakerRunConfiguration: SageMakerRunConfigurationOutput }),
);
export interface DataSourceErrorMessage {
  errorType: string;
  errorDetail?: string;
}
export const DataSourceErrorMessage = S.suspend(() =>
  S.Struct({ errorType: S.String, errorDetail: S.optional(S.String) }),
).annotations({
  identifier: "DataSourceErrorMessage",
}) as any as S.Schema<DataSourceErrorMessage>;
export interface SelfGrantStatusDetail {
  databaseName: string;
  schemaName?: string;
  status: string;
  failureCause?: string;
}
export const SelfGrantStatusDetail = S.suspend(() =>
  S.Struct({
    databaseName: S.String,
    schemaName: S.optional(S.String),
    status: S.String,
    failureCause: S.optional(S.String),
  }),
).annotations({
  identifier: "SelfGrantStatusDetail",
}) as any as S.Schema<SelfGrantStatusDetail>;
export type SelfGrantStatusDetails = SelfGrantStatusDetail[];
export const SelfGrantStatusDetails = S.Array(SelfGrantStatusDetail);
export interface GlueSelfGrantStatusOutput {
  selfGrantStatusDetails: SelfGrantStatusDetails;
}
export const GlueSelfGrantStatusOutput = S.suspend(() =>
  S.Struct({ selfGrantStatusDetails: SelfGrantStatusDetails }),
).annotations({
  identifier: "GlueSelfGrantStatusOutput",
}) as any as S.Schema<GlueSelfGrantStatusOutput>;
export interface RedshiftSelfGrantStatusOutput {
  selfGrantStatusDetails: SelfGrantStatusDetails;
}
export const RedshiftSelfGrantStatusOutput = S.suspend(() =>
  S.Struct({ selfGrantStatusDetails: SelfGrantStatusDetails }),
).annotations({
  identifier: "RedshiftSelfGrantStatusOutput",
}) as any as S.Schema<RedshiftSelfGrantStatusOutput>;
export type SelfGrantStatusOutput =
  | { glueSelfGrantStatus: GlueSelfGrantStatusOutput }
  | { redshiftSelfGrantStatus: RedshiftSelfGrantStatusOutput };
export const SelfGrantStatusOutput = S.Union(
  S.Struct({ glueSelfGrantStatus: GlueSelfGrantStatusOutput }),
  S.Struct({ redshiftSelfGrantStatus: RedshiftSelfGrantStatusOutput }),
);
export interface UpdateDataSourceOutput {
  id: string;
  status?: string;
  type?: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  domainId: string;
  projectId: string;
  environmentId?: string;
  connectionId?: string;
  configuration?: (typeof DataSourceConfigurationOutput)["Type"];
  recommendation?: RecommendationConfiguration;
  enableSetting?: string;
  publishOnImport?: boolean;
  assetFormsOutput?: FormOutputList;
  schedule?: ScheduleConfiguration;
  lastRunStatus?: string;
  lastRunAt?: Date;
  lastRunErrorMessage?: DataSourceErrorMessage;
  errorMessage?: DataSourceErrorMessage;
  createdAt?: Date;
  updatedAt?: Date;
  selfGrantStatus?: (typeof SelfGrantStatusOutput)["Type"];
  retainPermissionsOnRevokeFailure?: boolean;
}
export const UpdateDataSourceOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    status: S.optional(S.String),
    type: S.optional(S.String),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    domainId: S.String,
    projectId: S.String,
    environmentId: S.optional(S.String),
    connectionId: S.optional(S.String),
    configuration: S.optional(DataSourceConfigurationOutput),
    recommendation: S.optional(RecommendationConfiguration),
    enableSetting: S.optional(S.String),
    publishOnImport: S.optional(S.Boolean),
    assetFormsOutput: S.optional(FormOutputList),
    schedule: S.optional(ScheduleConfiguration),
    lastRunStatus: S.optional(S.String),
    lastRunAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastRunErrorMessage: S.optional(DataSourceErrorMessage),
    errorMessage: S.optional(DataSourceErrorMessage),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    selfGrantStatus: S.optional(SelfGrantStatusOutput),
    retainPermissionsOnRevokeFailure: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "UpdateDataSourceOutput",
}) as any as S.Schema<UpdateDataSourceOutput>;
export interface DeleteDataSourceOutput {
  id: string;
  status?: string;
  type?: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  domainId: string;
  projectId: string;
  environmentId?: string;
  connectionId?: string;
  configuration?: (typeof DataSourceConfigurationOutput)["Type"];
  enableSetting?: string;
  publishOnImport?: boolean;
  assetFormsOutput?: FormOutputList;
  schedule?: ScheduleConfiguration;
  lastRunStatus?: string;
  lastRunAt?: Date;
  lastRunErrorMessage?: DataSourceErrorMessage;
  errorMessage?: DataSourceErrorMessage;
  createdAt?: Date;
  updatedAt?: Date;
  selfGrantStatus?: (typeof SelfGrantStatusOutput)["Type"];
  retainPermissionsOnRevokeFailure?: boolean;
}
export const DeleteDataSourceOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    status: S.optional(S.String),
    type: S.optional(S.String),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    domainId: S.String,
    projectId: S.String,
    environmentId: S.optional(S.String),
    connectionId: S.optional(S.String),
    configuration: S.optional(DataSourceConfigurationOutput),
    enableSetting: S.optional(S.String),
    publishOnImport: S.optional(S.Boolean),
    assetFormsOutput: S.optional(FormOutputList),
    schedule: S.optional(ScheduleConfiguration),
    lastRunStatus: S.optional(S.String),
    lastRunAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastRunErrorMessage: S.optional(DataSourceErrorMessage),
    errorMessage: S.optional(DataSourceErrorMessage),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    selfGrantStatus: S.optional(SelfGrantStatusOutput),
    retainPermissionsOnRevokeFailure: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DeleteDataSourceOutput",
}) as any as S.Schema<DeleteDataSourceOutput>;
export interface CreateDomainInput {
  name: string;
  description?: string;
  singleSignOn?: SingleSignOn;
  domainExecutionRole: string;
  kmsKeyIdentifier?: string;
  tags?: Tags;
  domainVersion?: string;
  serviceRole?: string;
  clientToken?: string;
}
export const CreateDomainInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    singleSignOn: S.optional(SingleSignOn),
    domainExecutionRole: S.String,
    kmsKeyIdentifier: S.optional(S.String),
    tags: S.optional(Tags),
    domainVersion: S.optional(S.String),
    serviceRole: S.optional(S.String),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/domains" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDomainInput",
}) as any as S.Schema<CreateDomainInput>;
export interface GetDomainOutput {
  id: string;
  rootDomainUnitId?: string;
  name?: string;
  description?: string;
  singleSignOn?: SingleSignOn;
  domainExecutionRole: string;
  arn?: string;
  kmsKeyIdentifier?: string;
  status: string;
  portalUrl?: string;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  tags?: Tags;
  domainVersion?: string;
  serviceRole?: string;
}
export const GetDomainOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    rootDomainUnitId: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    singleSignOn: S.optional(SingleSignOn),
    domainExecutionRole: S.String,
    arn: S.optional(S.String),
    kmsKeyIdentifier: S.optional(S.String),
    status: S.String,
    portalUrl: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    tags: S.optional(Tags),
    domainVersion: S.optional(S.String),
    serviceRole: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDomainOutput",
}) as any as S.Schema<GetDomainOutput>;
export interface UpdateDomainOutput {
  id: string;
  rootDomainUnitId?: string;
  description?: string;
  singleSignOn?: SingleSignOn;
  domainExecutionRole?: string;
  serviceRole?: string;
  name?: string;
  lastUpdatedAt?: Date;
}
export const UpdateDomainOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    rootDomainUnitId: S.optional(S.String),
    description: S.optional(S.String),
    singleSignOn: S.optional(SingleSignOn),
    domainExecutionRole: S.optional(S.String),
    serviceRole: S.optional(S.String),
    name: S.optional(S.String),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "UpdateDomainOutput",
}) as any as S.Schema<UpdateDomainOutput>;
export interface DeleteDomainOutput {
  status: string;
}
export const DeleteDomainOutput = S.suspend(() =>
  S.Struct({ status: S.String }),
).annotations({
  identifier: "DeleteDomainOutput",
}) as any as S.Schema<DeleteDomainOutput>;
export interface DomainUnitUserProperties {
  userId?: string;
}
export const DomainUnitUserProperties = S.suspend(() =>
  S.Struct({ userId: S.optional(S.String) }),
).annotations({
  identifier: "DomainUnitUserProperties",
}) as any as S.Schema<DomainUnitUserProperties>;
export interface DomainUnitGroupProperties {
  groupId?: string;
}
export const DomainUnitGroupProperties = S.suspend(() =>
  S.Struct({ groupId: S.optional(S.String) }),
).annotations({
  identifier: "DomainUnitGroupProperties",
}) as any as S.Schema<DomainUnitGroupProperties>;
export type DomainUnitOwnerProperties =
  | { user: DomainUnitUserProperties }
  | { group: DomainUnitGroupProperties };
export const DomainUnitOwnerProperties = S.Union(
  S.Struct({ user: DomainUnitUserProperties }),
  S.Struct({ group: DomainUnitGroupProperties }),
);
export type DomainUnitOwners = (typeof DomainUnitOwnerProperties)["Type"][];
export const DomainUnitOwners = S.Array(DomainUnitOwnerProperties);
export interface GetDomainUnitOutput {
  id: string;
  domainId: string;
  name: string | Redacted.Redacted<string>;
  parentDomainUnitId?: string;
  description?: string | Redacted.Redacted<string>;
  owners: DomainUnitOwners;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  createdBy?: string;
  lastUpdatedBy?: string;
}
export const GetDomainUnitOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    domainId: S.String,
    name: SensitiveString,
    parentDomainUnitId: S.optional(S.String),
    description: S.optional(SensitiveString),
    owners: DomainUnitOwners,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    lastUpdatedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDomainUnitOutput",
}) as any as S.Schema<GetDomainUnitOutput>;
export interface UpdateDomainUnitOutput {
  id: string;
  domainId: string;
  name: string | Redacted.Redacted<string>;
  owners: DomainUnitOwners;
  description?: string | Redacted.Redacted<string>;
  parentDomainUnitId?: string;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  createdBy?: string;
  lastUpdatedBy?: string;
}
export const UpdateDomainUnitOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    domainId: S.String,
    name: SensitiveString,
    owners: DomainUnitOwners,
    description: S.optional(SensitiveString),
    parentDomainUnitId: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    lastUpdatedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateDomainUnitOutput",
}) as any as S.Schema<UpdateDomainUnitOutput>;
export type RegionalParameter = { [key: string]: string };
export const RegionalParameter = S.Record({ key: S.String, value: S.String });
export type RegionalParameterMap = { [key: string]: RegionalParameter };
export const RegionalParameterMap = S.Record({
  key: S.String,
  value: RegionalParameter,
});
export interface LakeFormationConfiguration {
  locationRegistrationRole?: string;
  locationRegistrationExcludeS3Locations?: S3LocationList;
}
export const LakeFormationConfiguration = S.suspend(() =>
  S.Struct({
    locationRegistrationRole: S.optional(S.String),
    locationRegistrationExcludeS3Locations: S.optional(S3LocationList),
  }),
).annotations({
  identifier: "LakeFormationConfiguration",
}) as any as S.Schema<LakeFormationConfiguration>;
export type ProvisioningConfiguration = {
  lakeFormationConfiguration: LakeFormationConfiguration;
};
export const ProvisioningConfiguration = S.Union(
  S.Struct({ lakeFormationConfiguration: LakeFormationConfiguration }),
);
export type ProvisioningConfigurationList =
  (typeof ProvisioningConfiguration)["Type"][];
export const ProvisioningConfigurationList = S.Array(ProvisioningConfiguration);
export interface GetEnvironmentBlueprintConfigurationOutput {
  domainId: string;
  environmentBlueprintId: string;
  provisioningRoleArn?: string;
  environmentRolePermissionBoundary?: string;
  manageAccessRoleArn?: string;
  enabledRegions?: EnabledRegionList;
  regionalParameters?: RegionalParameterMap;
  createdAt?: Date;
  updatedAt?: Date;
  provisioningConfigurations?: ProvisioningConfigurationList;
}
export const GetEnvironmentBlueprintConfigurationOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    environmentBlueprintId: S.String,
    provisioningRoleArn: S.optional(S.String),
    environmentRolePermissionBoundary: S.optional(S.String),
    manageAccessRoleArn: S.optional(S.String),
    enabledRegions: S.optional(EnabledRegionList),
    regionalParameters: S.optional(RegionalParameterMap),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    provisioningConfigurations: S.optional(ProvisioningConfigurationList),
  }),
).annotations({
  identifier: "GetEnvironmentBlueprintConfigurationOutput",
}) as any as S.Schema<GetEnvironmentBlueprintConfigurationOutput>;
export interface CreateFormTypeInput {
  domainIdentifier: string;
  name: string | Redacted.Redacted<string>;
  model: (typeof Model)["Type"];
  owningProjectIdentifier: string;
  status?: string;
  description?: string | Redacted.Redacted<string>;
}
export const CreateFormTypeInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: SensitiveString,
    model: Model,
    owningProjectIdentifier: S.String,
    status: S.optional(S.String),
    description: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/form-types",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFormTypeInput",
}) as any as S.Schema<CreateFormTypeInput>;
export interface CreateGlossaryOutput {
  domainId: string;
  id: string;
  name: string | Redacted.Redacted<string>;
  owningProjectId: string;
  description?: string | Redacted.Redacted<string>;
  status?: string;
  usageRestrictions?: GlossaryUsageRestrictions;
}
export const CreateGlossaryOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    id: S.String,
    name: SensitiveString,
    owningProjectId: S.String,
    description: S.optional(SensitiveString),
    status: S.optional(S.String),
    usageRestrictions: S.optional(GlossaryUsageRestrictions),
  }),
).annotations({
  identifier: "CreateGlossaryOutput",
}) as any as S.Schema<CreateGlossaryOutput>;
export interface GetGlossaryOutput {
  domainId: string;
  id: string;
  owningProjectId: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  status: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  usageRestrictions?: GlossaryUsageRestrictions;
}
export const GetGlossaryOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    id: S.String,
    owningProjectId: S.String,
    name: SensitiveString,
    description: S.optional(SensitiveString),
    status: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedBy: S.optional(S.String),
    usageRestrictions: S.optional(GlossaryUsageRestrictions),
  }),
).annotations({
  identifier: "GetGlossaryOutput",
}) as any as S.Schema<GetGlossaryOutput>;
export interface UpdateGlossaryOutput {
  domainId: string;
  id: string;
  name: string | Redacted.Redacted<string>;
  owningProjectId: string;
  description?: string | Redacted.Redacted<string>;
  status?: string;
  usageRestrictions?: GlossaryUsageRestrictions;
}
export const UpdateGlossaryOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    id: S.String,
    name: SensitiveString,
    owningProjectId: S.String,
    description: S.optional(SensitiveString),
    status: S.optional(S.String),
    usageRestrictions: S.optional(GlossaryUsageRestrictions),
  }),
).annotations({
  identifier: "UpdateGlossaryOutput",
}) as any as S.Schema<UpdateGlossaryOutput>;
export interface CreateGlossaryTermInput {
  domainIdentifier: string;
  glossaryIdentifier: string;
  name: string | Redacted.Redacted<string>;
  status?: string;
  shortDescription?: string | Redacted.Redacted<string>;
  longDescription?: string | Redacted.Redacted<string>;
  termRelations?: TermRelations;
  clientToken?: string;
}
export const CreateGlossaryTermInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    glossaryIdentifier: S.String,
    name: SensitiveString,
    status: S.optional(S.String),
    shortDescription: S.optional(SensitiveString),
    longDescription: S.optional(SensitiveString),
    termRelations: S.optional(TermRelations),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/glossary-terms",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateGlossaryTermInput",
}) as any as S.Schema<CreateGlossaryTermInput>;
export interface GetGlossaryTermOutput {
  domainId: string;
  glossaryId: string;
  id: string;
  name: string | Redacted.Redacted<string>;
  shortDescription?: string | Redacted.Redacted<string>;
  longDescription?: string | Redacted.Redacted<string>;
  termRelations?: TermRelations;
  status: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  usageRestrictions?: GlossaryUsageRestrictions;
}
export const GetGlossaryTermOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    glossaryId: S.String,
    id: S.String,
    name: SensitiveString,
    shortDescription: S.optional(SensitiveString),
    longDescription: S.optional(SensitiveString),
    termRelations: S.optional(TermRelations),
    status: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedBy: S.optional(S.String),
    usageRestrictions: S.optional(GlossaryUsageRestrictions),
  }),
).annotations({
  identifier: "GetGlossaryTermOutput",
}) as any as S.Schema<GetGlossaryTermOutput>;
export interface UpdateGlossaryTermOutput {
  id: string;
  domainId: string;
  glossaryId: string;
  name: string | Redacted.Redacted<string>;
  status: string;
  shortDescription?: string | Redacted.Redacted<string>;
  longDescription?: string | Redacted.Redacted<string>;
  termRelations?: TermRelations;
  usageRestrictions?: GlossaryUsageRestrictions;
}
export const UpdateGlossaryTermOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    domainId: S.String,
    glossaryId: S.String,
    name: SensitiveString,
    status: S.String,
    shortDescription: S.optional(SensitiveString),
    longDescription: S.optional(SensitiveString),
    termRelations: S.optional(TermRelations),
    usageRestrictions: S.optional(GlossaryUsageRestrictions),
  }),
).annotations({
  identifier: "UpdateGlossaryTermOutput",
}) as any as S.Schema<UpdateGlossaryTermOutput>;
export interface StartMetadataGenerationRunInput {
  domainIdentifier: string;
  type?: string;
  types?: MetadataGenerationRunTypes;
  target: MetadataGenerationRunTarget;
  clientToken?: string;
  owningProjectIdentifier: string;
}
export const StartMetadataGenerationRunInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    type: S.optional(S.String),
    types: S.optional(MetadataGenerationRunTypes),
    target: MetadataGenerationRunTarget,
    clientToken: S.optional(S.String),
    owningProjectIdentifier: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/metadata-generation-runs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartMetadataGenerationRunInput",
}) as any as S.Schema<StartMetadataGenerationRunInput>;
export interface DomainUnitTarget {
  domainUnitId: string;
  includeChildDomainUnits?: boolean;
}
export const DomainUnitTarget = S.suspend(() =>
  S.Struct({
    domainUnitId: S.String,
    includeChildDomainUnits: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DomainUnitTarget",
}) as any as S.Schema<DomainUnitTarget>;
export type RuleTarget = { domainUnitTarget: DomainUnitTarget };
export const RuleTarget = S.Union(
  S.Struct({ domainUnitTarget: DomainUnitTarget }),
);
export interface GetRuleOutput {
  identifier: string;
  revision: string;
  name: string | Redacted.Redacted<string>;
  ruleType: string;
  target: (typeof RuleTarget)["Type"];
  action: string;
  scope: RuleScope;
  detail: (typeof RuleDetail)["Type"];
  targetType?: string;
  description?: string | Redacted.Redacted<string>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastUpdatedBy: string;
}
export const GetRuleOutput = S.suspend(() =>
  S.Struct({
    identifier: S.String,
    revision: S.String,
    name: SensitiveString,
    ruleType: S.String,
    target: RuleTarget,
    action: S.String,
    scope: RuleScope,
    detail: RuleDetail,
    targetType: S.optional(S.String),
    description: S.optional(SensitiveString),
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    createdBy: S.String,
    lastUpdatedBy: S.String,
  }),
).annotations({
  identifier: "GetRuleOutput",
}) as any as S.Schema<GetRuleOutput>;
export interface UpdateRuleOutput {
  identifier: string;
  revision: string;
  name: string | Redacted.Redacted<string>;
  ruleType: string;
  target: (typeof RuleTarget)["Type"];
  action: string;
  scope: RuleScope;
  detail: (typeof RuleDetail)["Type"];
  description?: string | Redacted.Redacted<string>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastUpdatedBy: string;
}
export const UpdateRuleOutput = S.suspend(() =>
  S.Struct({
    identifier: S.String,
    revision: S.String,
    name: SensitiveString,
    ruleType: S.String,
    target: RuleTarget,
    action: S.String,
    scope: RuleScope,
    detail: RuleDetail,
    description: S.optional(SensitiveString),
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    createdBy: S.String,
    lastUpdatedBy: S.String,
  }),
).annotations({
  identifier: "UpdateRuleOutput",
}) as any as S.Schema<UpdateRuleOutput>;
export interface CreateDomainUnitPolicyGrantDetail {
  includeChildDomainUnits?: boolean;
}
export const CreateDomainUnitPolicyGrantDetail = S.suspend(() =>
  S.Struct({ includeChildDomainUnits: S.optional(S.Boolean) }),
).annotations({
  identifier: "CreateDomainUnitPolicyGrantDetail",
}) as any as S.Schema<CreateDomainUnitPolicyGrantDetail>;
export interface OverrideDomainUnitOwnersPolicyGrantDetail {
  includeChildDomainUnits?: boolean;
}
export const OverrideDomainUnitOwnersPolicyGrantDetail = S.suspend(() =>
  S.Struct({ includeChildDomainUnits: S.optional(S.Boolean) }),
).annotations({
  identifier: "OverrideDomainUnitOwnersPolicyGrantDetail",
}) as any as S.Schema<OverrideDomainUnitOwnersPolicyGrantDetail>;
export interface AddToProjectMemberPoolPolicyGrantDetail {
  includeChildDomainUnits?: boolean;
}
export const AddToProjectMemberPoolPolicyGrantDetail = S.suspend(() =>
  S.Struct({ includeChildDomainUnits: S.optional(S.Boolean) }),
).annotations({
  identifier: "AddToProjectMemberPoolPolicyGrantDetail",
}) as any as S.Schema<AddToProjectMemberPoolPolicyGrantDetail>;
export interface OverrideProjectOwnersPolicyGrantDetail {
  includeChildDomainUnits?: boolean;
}
export const OverrideProjectOwnersPolicyGrantDetail = S.suspend(() =>
  S.Struct({ includeChildDomainUnits: S.optional(S.Boolean) }),
).annotations({
  identifier: "OverrideProjectOwnersPolicyGrantDetail",
}) as any as S.Schema<OverrideProjectOwnersPolicyGrantDetail>;
export interface CreateGlossaryPolicyGrantDetail {
  includeChildDomainUnits?: boolean;
}
export const CreateGlossaryPolicyGrantDetail = S.suspend(() =>
  S.Struct({ includeChildDomainUnits: S.optional(S.Boolean) }),
).annotations({
  identifier: "CreateGlossaryPolicyGrantDetail",
}) as any as S.Schema<CreateGlossaryPolicyGrantDetail>;
export interface CreateFormTypePolicyGrantDetail {
  includeChildDomainUnits?: boolean;
}
export const CreateFormTypePolicyGrantDetail = S.suspend(() =>
  S.Struct({ includeChildDomainUnits: S.optional(S.Boolean) }),
).annotations({
  identifier: "CreateFormTypePolicyGrantDetail",
}) as any as S.Schema<CreateFormTypePolicyGrantDetail>;
export interface CreateAssetTypePolicyGrantDetail {
  includeChildDomainUnits?: boolean;
}
export const CreateAssetTypePolicyGrantDetail = S.suspend(() =>
  S.Struct({ includeChildDomainUnits: S.optional(S.Boolean) }),
).annotations({
  identifier: "CreateAssetTypePolicyGrantDetail",
}) as any as S.Schema<CreateAssetTypePolicyGrantDetail>;
export interface CreateProjectPolicyGrantDetail {
  includeChildDomainUnits?: boolean;
}
export const CreateProjectPolicyGrantDetail = S.suspend(() =>
  S.Struct({ includeChildDomainUnits: S.optional(S.Boolean) }),
).annotations({
  identifier: "CreateProjectPolicyGrantDetail",
}) as any as S.Schema<CreateProjectPolicyGrantDetail>;
export interface CreateEnvironmentProfilePolicyGrantDetail {
  domainUnitId?: string;
}
export const CreateEnvironmentProfilePolicyGrantDetail = S.suspend(() =>
  S.Struct({ domainUnitId: S.optional(S.String) }),
).annotations({
  identifier: "CreateEnvironmentProfilePolicyGrantDetail",
}) as any as S.Schema<CreateEnvironmentProfilePolicyGrantDetail>;
export interface CreateProjectFromProjectProfilePolicyGrantDetail {
  includeChildDomainUnits?: boolean;
  projectProfiles?: ProjectProfileList;
}
export const CreateProjectFromProjectProfilePolicyGrantDetail = S.suspend(() =>
  S.Struct({
    includeChildDomainUnits: S.optional(S.Boolean),
    projectProfiles: S.optional(ProjectProfileList),
  }),
).annotations({
  identifier: "CreateProjectFromProjectProfilePolicyGrantDetail",
}) as any as S.Schema<CreateProjectFromProjectProfilePolicyGrantDetail>;
export interface UseAssetTypePolicyGrantDetail {
  domainUnitId?: string;
}
export const UseAssetTypePolicyGrantDetail = S.suspend(() =>
  S.Struct({ domainUnitId: S.optional(S.String) }),
).annotations({
  identifier: "UseAssetTypePolicyGrantDetail",
}) as any as S.Schema<UseAssetTypePolicyGrantDetail>;
export interface AthenaPropertiesInput {
  workgroupName?: string;
}
export const AthenaPropertiesInput = S.suspend(() =>
  S.Struct({ workgroupName: S.optional(S.String) }),
).annotations({
  identifier: "AthenaPropertiesInput",
}) as any as S.Schema<AthenaPropertiesInput>;
export interface HyperPodPropertiesInput {
  clusterName: string;
}
export const HyperPodPropertiesInput = S.suspend(() =>
  S.Struct({ clusterName: S.String }),
).annotations({
  identifier: "HyperPodPropertiesInput",
}) as any as S.Schema<HyperPodPropertiesInput>;
export interface IamPropertiesInput {
  glueLineageSyncEnabled?: boolean;
}
export const IamPropertiesInput = S.suspend(() =>
  S.Struct({ glueLineageSyncEnabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "IamPropertiesInput",
}) as any as S.Schema<IamPropertiesInput>;
export interface SparkEmrPropertiesInput {
  computeArn?: string;
  instanceProfileArn?: string;
  javaVirtualEnv?: string;
  logUri?: string;
  pythonVirtualEnv?: string;
  runtimeRole?: string;
  trustedCertificatesS3Uri?: string;
  managedEndpointArn?: string;
}
export const SparkEmrPropertiesInput = S.suspend(() =>
  S.Struct({
    computeArn: S.optional(S.String),
    instanceProfileArn: S.optional(S.String),
    javaVirtualEnv: S.optional(S.String),
    logUri: S.optional(S.String),
    pythonVirtualEnv: S.optional(S.String),
    runtimeRole: S.optional(S.String),
    trustedCertificatesS3Uri: S.optional(S.String),
    managedEndpointArn: S.optional(S.String),
  }),
).annotations({
  identifier: "SparkEmrPropertiesInput",
}) as any as S.Schema<SparkEmrPropertiesInput>;
export interface S3PropertiesInput {
  s3Uri: string;
  s3AccessGrantLocationId?: string;
}
export const S3PropertiesInput = S.suspend(() =>
  S.Struct({ s3Uri: S.String, s3AccessGrantLocationId: S.optional(S.String) }),
).annotations({
  identifier: "S3PropertiesInput",
}) as any as S.Schema<S3PropertiesInput>;
export interface AmazonQPropertiesInput {
  isEnabled: boolean;
  profileArn?: string;
  authMode?: string;
}
export const AmazonQPropertiesInput = S.suspend(() =>
  S.Struct({
    isEnabled: S.Boolean,
    profileArn: S.optional(S.String),
    authMode: S.optional(S.String),
  }),
).annotations({
  identifier: "AmazonQPropertiesInput",
}) as any as S.Schema<AmazonQPropertiesInput>;
export interface MlflowPropertiesInput {
  trackingServerArn?: string;
}
export const MlflowPropertiesInput = S.suspend(() =>
  S.Struct({ trackingServerArn: S.optional(S.String) }),
).annotations({
  identifier: "MlflowPropertiesInput",
}) as any as S.Schema<MlflowPropertiesInput>;
export interface EnvironmentResolvedAccount {
  awsAccountId: string;
  regionName: string;
  sourceAccountPoolId?: string;
}
export const EnvironmentResolvedAccount = S.suspend(() =>
  S.Struct({
    awsAccountId: S.String,
    regionName: S.String,
    sourceAccountPoolId: S.optional(S.String),
  }),
).annotations({
  identifier: "EnvironmentResolvedAccount",
}) as any as S.Schema<EnvironmentResolvedAccount>;
export interface ListingRevisionInput {
  identifier: string;
  revision: string;
}
export const ListingRevisionInput = S.suspend(() =>
  S.Struct({ identifier: S.String, revision: S.String }),
).annotations({
  identifier: "ListingRevisionInput",
}) as any as S.Schema<ListingRevisionInput>;
export interface SubscribedProjectInput {
  identifier?: string;
}
export const SubscribedProjectInput = S.suspend(() =>
  S.Struct({ identifier: S.optional(S.String) }),
).annotations({
  identifier: "SubscribedProjectInput",
}) as any as S.Schema<SubscribedProjectInput>;
export interface SubscribedUserInput {
  identifier?: string;
}
export const SubscribedUserInput = S.suspend(() =>
  S.Struct({ identifier: S.optional(S.String) }),
).annotations({
  identifier: "SubscribedUserInput",
}) as any as S.Schema<SubscribedUserInput>;
export interface SubscribedGroupInput {
  identifier?: string;
}
export const SubscribedGroupInput = S.suspend(() =>
  S.Struct({ identifier: S.optional(S.String) }),
).annotations({
  identifier: "SubscribedGroupInput",
}) as any as S.Schema<SubscribedGroupInput>;
export interface AthenaPropertiesPatch {
  workgroupName?: string;
}
export const AthenaPropertiesPatch = S.suspend(() =>
  S.Struct({ workgroupName: S.optional(S.String) }),
).annotations({
  identifier: "AthenaPropertiesPatch",
}) as any as S.Schema<AthenaPropertiesPatch>;
export interface IamPropertiesPatch {
  glueLineageSyncEnabled?: boolean;
}
export const IamPropertiesPatch = S.suspend(() =>
  S.Struct({ glueLineageSyncEnabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "IamPropertiesPatch",
}) as any as S.Schema<IamPropertiesPatch>;
export type RedshiftStorageProperties =
  | { clusterName: string }
  | { workgroupName: string };
export const RedshiftStorageProperties = S.Union(
  S.Struct({ clusterName: S.String }),
  S.Struct({ workgroupName: S.String }),
);
export interface UsernamePassword {
  password: string | Redacted.Redacted<string>;
  username: string;
}
export const UsernamePassword = S.suspend(() =>
  S.Struct({ password: SensitiveString, username: S.String }),
).annotations({
  identifier: "UsernamePassword",
}) as any as S.Schema<UsernamePassword>;
export type RedshiftCredentials =
  | { secretArn: string }
  | { usernamePassword: UsernamePassword };
export const RedshiftCredentials = S.Union(
  S.Struct({ secretArn: S.String }),
  S.Struct({ usernamePassword: UsernamePassword }),
);
export interface LineageSyncSchedule {
  schedule?: string;
}
export const LineageSyncSchedule = S.suspend(() =>
  S.Struct({ schedule: S.optional(S.String) }),
).annotations({
  identifier: "LineageSyncSchedule",
}) as any as S.Schema<LineageSyncSchedule>;
export interface RedshiftLineageSyncConfigurationInput {
  enabled?: boolean;
  schedule?: LineageSyncSchedule;
}
export const RedshiftLineageSyncConfigurationInput = S.suspend(() =>
  S.Struct({
    enabled: S.optional(S.Boolean),
    schedule: S.optional(LineageSyncSchedule),
  }),
).annotations({
  identifier: "RedshiftLineageSyncConfigurationInput",
}) as any as S.Schema<RedshiftLineageSyncConfigurationInput>;
export interface RedshiftPropertiesPatch {
  storage?: (typeof RedshiftStorageProperties)["Type"];
  databaseName?: string;
  host?: string;
  port?: number;
  credentials?: (typeof RedshiftCredentials)["Type"];
  lineageSync?: RedshiftLineageSyncConfigurationInput;
}
export const RedshiftPropertiesPatch = S.suspend(() =>
  S.Struct({
    storage: S.optional(RedshiftStorageProperties),
    databaseName: S.optional(S.String),
    host: S.optional(S.String),
    port: S.optional(S.Number),
    credentials: S.optional(RedshiftCredentials),
    lineageSync: S.optional(RedshiftLineageSyncConfigurationInput),
  }),
).annotations({
  identifier: "RedshiftPropertiesPatch",
}) as any as S.Schema<RedshiftPropertiesPatch>;
export interface SparkEmrPropertiesPatch {
  computeArn?: string;
  instanceProfileArn?: string;
  javaVirtualEnv?: string;
  logUri?: string;
  pythonVirtualEnv?: string;
  runtimeRole?: string;
  trustedCertificatesS3Uri?: string;
  managedEndpointArn?: string;
}
export const SparkEmrPropertiesPatch = S.suspend(() =>
  S.Struct({
    computeArn: S.optional(S.String),
    instanceProfileArn: S.optional(S.String),
    javaVirtualEnv: S.optional(S.String),
    logUri: S.optional(S.String),
    pythonVirtualEnv: S.optional(S.String),
    runtimeRole: S.optional(S.String),
    trustedCertificatesS3Uri: S.optional(S.String),
    managedEndpointArn: S.optional(S.String),
  }),
).annotations({
  identifier: "SparkEmrPropertiesPatch",
}) as any as S.Schema<SparkEmrPropertiesPatch>;
export interface S3PropertiesPatch {
  s3Uri: string;
  s3AccessGrantLocationId?: string;
}
export const S3PropertiesPatch = S.suspend(() =>
  S.Struct({ s3Uri: S.String, s3AccessGrantLocationId: S.optional(S.String) }),
).annotations({
  identifier: "S3PropertiesPatch",
}) as any as S.Schema<S3PropertiesPatch>;
export interface AmazonQPropertiesPatch {
  isEnabled: boolean;
  profileArn?: string;
  authMode?: string;
}
export const AmazonQPropertiesPatch = S.suspend(() =>
  S.Struct({
    isEnabled: S.Boolean,
    profileArn: S.optional(S.String),
    authMode: S.optional(S.String),
  }),
).annotations({
  identifier: "AmazonQPropertiesPatch",
}) as any as S.Schema<AmazonQPropertiesPatch>;
export interface MlflowPropertiesPatch {
  trackingServerArn?: string;
}
export const MlflowPropertiesPatch = S.suspend(() =>
  S.Struct({ trackingServerArn: S.optional(S.String) }),
).annotations({
  identifier: "MlflowPropertiesPatch",
}) as any as S.Schema<MlflowPropertiesPatch>;
export interface FormEntryInput {
  typeIdentifier: string;
  typeRevision: string;
  required?: boolean;
}
export const FormEntryInput = S.suspend(() =>
  S.Struct({
    typeIdentifier: S.String,
    typeRevision: S.String,
    required: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "FormEntryInput",
}) as any as S.Schema<FormEntryInput>;
export type RowFilterList = RowFilter[];
export const RowFilterList = S.Array(
  S.suspend(() => RowFilter).annotations({ identifier: "RowFilter" }),
) as any as S.Schema<RowFilterList>;
export type ComputeEnvironmentsList = string[];
export const ComputeEnvironmentsList = S.Array(S.String);
export interface AssetPermission {
  assetId: string;
  permissions: (typeof Permissions)["Type"];
}
export const AssetPermission = S.suspend(() =>
  S.Struct({ assetId: S.String, permissions: Permissions }),
).annotations({
  identifier: "AssetPermission",
}) as any as S.Schema<AssetPermission>;
export type AssetPermissions = AssetPermission[];
export const AssetPermissions = S.Array(AssetPermission);
export type PolicyGrantDetail =
  | { createDomainUnit: CreateDomainUnitPolicyGrantDetail }
  | { overrideDomainUnitOwners: OverrideDomainUnitOwnersPolicyGrantDetail }
  | { addToProjectMemberPool: AddToProjectMemberPoolPolicyGrantDetail }
  | { overrideProjectOwners: OverrideProjectOwnersPolicyGrantDetail }
  | { createGlossary: CreateGlossaryPolicyGrantDetail }
  | { createFormType: CreateFormTypePolicyGrantDetail }
  | { createAssetType: CreateAssetTypePolicyGrantDetail }
  | { createProject: CreateProjectPolicyGrantDetail }
  | { createEnvironmentProfile: CreateEnvironmentProfilePolicyGrantDetail }
  | { delegateCreateEnvironmentProfile: Unit }
  | { createEnvironment: Unit }
  | { createEnvironmentFromBlueprint: Unit }
  | {
      createProjectFromProjectProfile: CreateProjectFromProjectProfilePolicyGrantDetail;
    }
  | { useAssetType: UseAssetTypePolicyGrantDetail };
export const PolicyGrantDetail = S.Union(
  S.Struct({ createDomainUnit: CreateDomainUnitPolicyGrantDetail }),
  S.Struct({
    overrideDomainUnitOwners: OverrideDomainUnitOwnersPolicyGrantDetail,
  }),
  S.Struct({ addToProjectMemberPool: AddToProjectMemberPoolPolicyGrantDetail }),
  S.Struct({ overrideProjectOwners: OverrideProjectOwnersPolicyGrantDetail }),
  S.Struct({ createGlossary: CreateGlossaryPolicyGrantDetail }),
  S.Struct({ createFormType: CreateFormTypePolicyGrantDetail }),
  S.Struct({ createAssetType: CreateAssetTypePolicyGrantDetail }),
  S.Struct({ createProject: CreateProjectPolicyGrantDetail }),
  S.Struct({
    createEnvironmentProfile: CreateEnvironmentProfilePolicyGrantDetail,
  }),
  S.Struct({ delegateCreateEnvironmentProfile: Unit }),
  S.Struct({ createEnvironment: Unit }),
  S.Struct({ createEnvironmentFromBlueprint: Unit }),
  S.Struct({
    createProjectFromProjectProfile:
      CreateProjectFromProjectProfilePolicyGrantDetail,
  }),
  S.Struct({ useAssetType: UseAssetTypePolicyGrantDetail }),
);
export interface BatchGetAttributeOutput {
  attributeIdentifier: string;
  forms?: FormOutputList;
}
export const BatchGetAttributeOutput = S.suspend(() =>
  S.Struct({
    attributeIdentifier: S.String,
    forms: S.optional(FormOutputList),
  }),
).annotations({
  identifier: "BatchGetAttributeOutput",
}) as any as S.Schema<BatchGetAttributeOutput>;
export type BatchGetAttributeItems = BatchGetAttributeOutput[];
export const BatchGetAttributeItems = S.Array(BatchGetAttributeOutput);
export interface AttributeError {
  attributeIdentifier: string;
  code: string;
  message: string;
}
export const AttributeError = S.suspend(() =>
  S.Struct({
    attributeIdentifier: S.String,
    code: S.String,
    message: S.String,
  }),
).annotations({
  identifier: "AttributeError",
}) as any as S.Schema<AttributeError>;
export type AttributesErrors = AttributeError[];
export const AttributesErrors = S.Array(AttributeError);
export interface EnvironmentConfigurationUserParameter {
  environmentId?: string;
  environmentResolvedAccount?: EnvironmentResolvedAccount;
  environmentConfigurationName?: string | Redacted.Redacted<string>;
  environmentParameters?: EnvironmentParametersList;
}
export const EnvironmentConfigurationUserParameter = S.suspend(() =>
  S.Struct({
    environmentId: S.optional(S.String),
    environmentResolvedAccount: S.optional(EnvironmentResolvedAccount),
    environmentConfigurationName: S.optional(SensitiveString),
    environmentParameters: S.optional(EnvironmentParametersList),
  }),
).annotations({
  identifier: "EnvironmentConfigurationUserParameter",
}) as any as S.Schema<EnvironmentConfigurationUserParameter>;
export type EnvironmentConfigurationUserParametersList =
  EnvironmentConfigurationUserParameter[];
export const EnvironmentConfigurationUserParametersList = S.Array(
  EnvironmentConfigurationUserParameter,
);
export type GrantedEntityInput = { listing: ListingRevisionInput };
export const GrantedEntityInput = S.Union(
  S.Struct({ listing: ListingRevisionInput }),
);
export type SubscribedPrincipalInput =
  | { project: SubscribedProjectInput }
  | { user: SubscribedUserInput }
  | { group: SubscribedGroupInput };
export const SubscribedPrincipalInput = S.Union(
  S.Struct({ project: SubscribedProjectInput }),
  S.Struct({ user: SubscribedUserInput }),
  S.Struct({ group: SubscribedGroupInput }),
);
export type SubscribedPrincipalInputs =
  (typeof SubscribedPrincipalInput)["Type"][];
export const SubscribedPrincipalInputs = S.Array(SubscribedPrincipalInput);
export interface ConnectionCredentials {
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
  expiration?: Date;
}
export const ConnectionCredentials = S.suspend(() =>
  S.Struct({
    accessKeyId: S.optional(S.String),
    secretAccessKey: S.optional(S.String),
    sessionToken: S.optional(S.String),
    expiration: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "ConnectionCredentials",
}) as any as S.Schema<ConnectionCredentials>;
export interface JobRunError {
  message: string;
}
export const JobRunError = S.suspend(() =>
  S.Struct({ message: S.String }),
).annotations({ identifier: "JobRunError" }) as any as S.Schema<JobRunError>;
export interface LineageNodeReference {
  id?: string;
  eventTimestamp?: Date;
}
export const LineageNodeReference = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    eventTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "LineageNodeReference",
}) as any as S.Schema<LineageNodeReference>;
export type LineageNodeReferenceList = LineageNodeReference[];
export const LineageNodeReferenceList = S.Array(LineageNodeReference);
export interface ProjectDeletionError {
  code?: string;
  message?: string;
}
export const ProjectDeletionError = S.suspend(() =>
  S.Struct({ code: S.optional(S.String), message: S.optional(S.String) }),
).annotations({
  identifier: "ProjectDeletionError",
}) as any as S.Schema<ProjectDeletionError>;
export type FailureReasons = ProjectDeletionError[];
export const FailureReasons = S.Array(ProjectDeletionError);
export interface ResourceTag {
  key: string;
  value: string;
  source: string;
}
export const ResourceTag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String, source: S.String }),
).annotations({ identifier: "ResourceTag" }) as any as S.Schema<ResourceTag>;
export type ResourceTags = ResourceTag[];
export const ResourceTags = S.Array(ResourceTag);
export interface TimeSeriesDataPointFormOutput {
  formName: string;
  typeIdentifier: string;
  typeRevision?: string;
  timestamp: Date;
  content?: string;
  id?: string;
}
export const TimeSeriesDataPointFormOutput = S.suspend(() =>
  S.Struct({
    formName: S.String,
    typeIdentifier: S.String,
    typeRevision: S.optional(S.String),
    timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    content: S.optional(S.String),
    id: S.optional(S.String),
  }),
).annotations({
  identifier: "TimeSeriesDataPointFormOutput",
}) as any as S.Schema<TimeSeriesDataPointFormOutput>;
export interface AccountPoolSummary {
  domainId?: string;
  id?: string;
  name?: string | Redacted.Redacted<string>;
  resolutionStrategy?: string;
  domainUnitId?: string;
  createdBy?: string;
  updatedBy?: string;
}
export const AccountPoolSummary = S.suspend(() =>
  S.Struct({
    domainId: S.optional(S.String),
    id: S.optional(S.String),
    name: S.optional(SensitiveString),
    resolutionStrategy: S.optional(S.String),
    domainUnitId: S.optional(S.String),
    createdBy: S.optional(S.String),
    updatedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "AccountPoolSummary",
}) as any as S.Schema<AccountPoolSummary>;
export type AccountPoolSummaries = AccountPoolSummary[];
export const AccountPoolSummaries = S.Array(AccountPoolSummary);
export interface AssetFilterSummary {
  id: string;
  domainId: string;
  assetId: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  status?: string;
  effectiveColumnNames?: ColumnNameList;
  effectiveRowFilter?: string;
  createdAt?: Date;
  errorMessage?: string;
}
export const AssetFilterSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    domainId: S.String,
    assetId: S.String,
    name: SensitiveString,
    description: S.optional(SensitiveString),
    status: S.optional(S.String),
    effectiveColumnNames: S.optional(ColumnNameList),
    effectiveRowFilter: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "AssetFilterSummary",
}) as any as S.Schema<AssetFilterSummary>;
export type AssetFilters = AssetFilterSummary[];
export const AssetFilters = S.Array(AssetFilterSummary);
export interface AssetRevision {
  domainId?: string;
  id?: string;
  revision?: string;
  createdBy?: string;
  createdAt?: Date;
}
export const AssetRevision = S.suspend(() =>
  S.Struct({
    domainId: S.optional(S.String),
    id: S.optional(S.String),
    revision: S.optional(S.String),
    createdBy: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "AssetRevision",
}) as any as S.Schema<AssetRevision>;
export type AssetRevisions = AssetRevision[];
export const AssetRevisions = S.Array(AssetRevision);
export type MatchCriteria = string[];
export const MatchCriteria = S.Array(S.String);
export type ConnectionProperties = { [key: string]: string };
export const ConnectionProperties = S.Record({
  key: S.String,
  value: S.String,
});
export type PropertyMap = { [key: string]: string };
export const PropertyMap = S.Record({ key: S.String, value: S.String });
export type SubnetIdList = string[];
export const SubnetIdList = S.Array(S.String);
export type SecurityGroupIdList = string[];
export const SecurityGroupIdList = S.Array(S.String);
export interface PhysicalConnectionRequirements {
  subnetId?: string;
  subnetIdList?: SubnetIdList;
  securityGroupIdList?: SecurityGroupIdList;
  availabilityZone?: string;
}
export const PhysicalConnectionRequirements = S.suspend(() =>
  S.Struct({
    subnetId: S.optional(S.String),
    subnetIdList: S.optional(SubnetIdList),
    securityGroupIdList: S.optional(SecurityGroupIdList),
    availabilityZone: S.optional(S.String),
  }),
).annotations({
  identifier: "PhysicalConnectionRequirements",
}) as any as S.Schema<PhysicalConnectionRequirements>;
export interface OAuth2ClientApplication {
  userManagedClientApplicationClientId?: string;
  aWSManagedClientApplicationReference?: string;
}
export const OAuth2ClientApplication = S.suspend(() =>
  S.Struct({
    userManagedClientApplicationClientId: S.optional(S.String),
    aWSManagedClientApplicationReference: S.optional(S.String),
  }),
).annotations({
  identifier: "OAuth2ClientApplication",
}) as any as S.Schema<OAuth2ClientApplication>;
export type TokenUrlParametersMap = { [key: string]: string };
export const TokenUrlParametersMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface AuthorizationCodeProperties {
  authorizationCode?: string;
  redirectUri?: string;
}
export const AuthorizationCodeProperties = S.suspend(() =>
  S.Struct({
    authorizationCode: S.optional(S.String),
    redirectUri: S.optional(S.String),
  }),
).annotations({
  identifier: "AuthorizationCodeProperties",
}) as any as S.Schema<AuthorizationCodeProperties>;
export interface GlueOAuth2Credentials {
  userManagedClientApplicationClientSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  jwtToken?: string;
}
export const GlueOAuth2Credentials = S.suspend(() =>
  S.Struct({
    userManagedClientApplicationClientSecret: S.optional(S.String),
    accessToken: S.optional(S.String),
    refreshToken: S.optional(S.String),
    jwtToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GlueOAuth2Credentials",
}) as any as S.Schema<GlueOAuth2Credentials>;
export interface OAuth2Properties {
  oAuth2GrantType?: string;
  oAuth2ClientApplication?: OAuth2ClientApplication;
  tokenUrl?: string;
  tokenUrlParametersMap?: TokenUrlParametersMap;
  authorizationCodeProperties?: AuthorizationCodeProperties;
  oAuth2Credentials?: GlueOAuth2Credentials;
}
export const OAuth2Properties = S.suspend(() =>
  S.Struct({
    oAuth2GrantType: S.optional(S.String),
    oAuth2ClientApplication: S.optional(OAuth2ClientApplication),
    tokenUrl: S.optional(S.String),
    tokenUrlParametersMap: S.optional(TokenUrlParametersMap),
    authorizationCodeProperties: S.optional(AuthorizationCodeProperties),
    oAuth2Credentials: S.optional(GlueOAuth2Credentials),
  }),
).annotations({
  identifier: "OAuth2Properties",
}) as any as S.Schema<OAuth2Properties>;
export interface AuthenticationConfiguration {
  authenticationType?: string;
  secretArn?: string;
  oAuth2Properties?: OAuth2Properties;
}
export const AuthenticationConfiguration = S.suspend(() =>
  S.Struct({
    authenticationType: S.optional(S.String),
    secretArn: S.optional(S.String),
    oAuth2Properties: S.optional(OAuth2Properties),
  }),
).annotations({
  identifier: "AuthenticationConfiguration",
}) as any as S.Schema<AuthenticationConfiguration>;
export interface GlueConnection {
  name?: string;
  description?: string;
  connectionType?: string;
  matchCriteria?: MatchCriteria;
  connectionProperties?: ConnectionProperties;
  sparkProperties?: PropertyMap;
  athenaProperties?: PropertyMap;
  pythonProperties?: PropertyMap;
  physicalConnectionRequirements?: PhysicalConnectionRequirements;
  creationTime?: Date;
  lastUpdatedTime?: Date;
  lastUpdatedBy?: string;
  status?: string;
  statusReason?: string;
  lastConnectionValidationTime?: Date;
  authenticationConfiguration?: AuthenticationConfiguration;
  connectionSchemaVersion?: number;
  compatibleComputeEnvironments?: ComputeEnvironmentsList;
}
export const GlueConnection = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    connectionType: S.optional(S.String),
    matchCriteria: S.optional(MatchCriteria),
    connectionProperties: S.optional(ConnectionProperties),
    sparkProperties: S.optional(PropertyMap),
    athenaProperties: S.optional(PropertyMap),
    pythonProperties: S.optional(PropertyMap),
    physicalConnectionRequirements: S.optional(PhysicalConnectionRequirements),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedBy: S.optional(S.String),
    status: S.optional(S.String),
    statusReason: S.optional(S.String),
    lastConnectionValidationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    authenticationConfiguration: S.optional(AuthenticationConfiguration),
    connectionSchemaVersion: S.optional(S.Number),
    compatibleComputeEnvironments: S.optional(ComputeEnvironmentsList),
  }),
).annotations({
  identifier: "GlueConnection",
}) as any as S.Schema<GlueConnection>;
export interface PhysicalEndpoint {
  awsLocation?: AwsLocation;
  glueConnectionName?: string;
  glueConnection?: GlueConnection;
  enableTrustedIdentityPropagation?: boolean;
  host?: string;
  port?: number;
  protocol?: string;
  stage?: string;
}
export const PhysicalEndpoint = S.suspend(() =>
  S.Struct({
    awsLocation: S.optional(AwsLocation),
    glueConnectionName: S.optional(S.String),
    glueConnection: S.optional(GlueConnection),
    enableTrustedIdentityPropagation: S.optional(S.Boolean),
    host: S.optional(S.String),
    port: S.optional(S.Number),
    protocol: S.optional(S.String),
    stage: S.optional(S.String),
  }),
).annotations({
  identifier: "PhysicalEndpoint",
}) as any as S.Schema<PhysicalEndpoint>;
export type PhysicalEndpoints = PhysicalEndpoint[];
export const PhysicalEndpoints = S.Array(PhysicalEndpoint);
export interface AthenaPropertiesOutput {
  workgroupName?: string;
}
export const AthenaPropertiesOutput = S.suspend(() =>
  S.Struct({ workgroupName: S.optional(S.String) }),
).annotations({
  identifier: "AthenaPropertiesOutput",
}) as any as S.Schema<AthenaPropertiesOutput>;
export interface GluePropertiesOutput {
  status?: string;
  errorMessage?: string;
}
export const GluePropertiesOutput = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "GluePropertiesOutput",
}) as any as S.Schema<GluePropertiesOutput>;
export interface HyperPodPropertiesOutput {
  clusterName: string;
  clusterArn?: string;
  orchestrator?: string;
}
export const HyperPodPropertiesOutput = S.suspend(() =>
  S.Struct({
    clusterName: S.String,
    clusterArn: S.optional(S.String),
    orchestrator: S.optional(S.String),
  }),
).annotations({
  identifier: "HyperPodPropertiesOutput",
}) as any as S.Schema<HyperPodPropertiesOutput>;
export interface IamPropertiesOutput {
  environmentId?: string;
  glueLineageSyncEnabled?: boolean;
}
export const IamPropertiesOutput = S.suspend(() =>
  S.Struct({
    environmentId: S.optional(S.String),
    glueLineageSyncEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "IamPropertiesOutput",
}) as any as S.Schema<IamPropertiesOutput>;
export interface RedshiftLineageSyncConfigurationOutput {
  lineageJobId?: string;
  enabled?: boolean;
  schedule?: LineageSyncSchedule;
}
export const RedshiftLineageSyncConfigurationOutput = S.suspend(() =>
  S.Struct({
    lineageJobId: S.optional(S.String),
    enabled: S.optional(S.Boolean),
    schedule: S.optional(LineageSyncSchedule),
  }),
).annotations({
  identifier: "RedshiftLineageSyncConfigurationOutput",
}) as any as S.Schema<RedshiftLineageSyncConfigurationOutput>;
export interface RedshiftPropertiesOutput {
  storage?: (typeof RedshiftStorageProperties)["Type"];
  credentials?: (typeof RedshiftCredentials)["Type"];
  isProvisionedSecret?: boolean;
  jdbcIamUrl?: string;
  jdbcUrl?: string;
  redshiftTempDir?: string;
  lineageSync?: RedshiftLineageSyncConfigurationOutput;
  status?: string;
  databaseName?: string;
}
export const RedshiftPropertiesOutput = S.suspend(() =>
  S.Struct({
    storage: S.optional(RedshiftStorageProperties),
    credentials: S.optional(RedshiftCredentials),
    isProvisionedSecret: S.optional(S.Boolean),
    jdbcIamUrl: S.optional(S.String),
    jdbcUrl: S.optional(S.String),
    redshiftTempDir: S.optional(S.String),
    lineageSync: S.optional(RedshiftLineageSyncConfigurationOutput),
    status: S.optional(S.String),
    databaseName: S.optional(S.String),
  }),
).annotations({
  identifier: "RedshiftPropertiesOutput",
}) as any as S.Schema<RedshiftPropertiesOutput>;
export interface ManagedEndpointCredentials {
  id?: string;
  token?: string;
}
export const ManagedEndpointCredentials = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), token: S.optional(S.String) }),
).annotations({
  identifier: "ManagedEndpointCredentials",
}) as any as S.Schema<ManagedEndpointCredentials>;
export interface SparkEmrPropertiesOutput {
  computeArn?: string;
  credentials?: UsernamePassword;
  credentialsExpiration?: Date;
  governanceType?: string;
  instanceProfileArn?: string;
  javaVirtualEnv?: string;
  livyEndpoint?: string;
  logUri?: string;
  pythonVirtualEnv?: string;
  runtimeRole?: string;
  trustedCertificatesS3Uri?: string;
  certificateData?: string;
  managedEndpointArn?: string;
  managedEndpointCredentials?: ManagedEndpointCredentials;
}
export const SparkEmrPropertiesOutput = S.suspend(() =>
  S.Struct({
    computeArn: S.optional(S.String),
    credentials: S.optional(UsernamePassword),
    credentialsExpiration: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    governanceType: S.optional(S.String),
    instanceProfileArn: S.optional(S.String),
    javaVirtualEnv: S.optional(S.String),
    livyEndpoint: S.optional(S.String),
    logUri: S.optional(S.String),
    pythonVirtualEnv: S.optional(S.String),
    runtimeRole: S.optional(S.String),
    trustedCertificatesS3Uri: S.optional(S.String),
    certificateData: S.optional(S.String),
    managedEndpointArn: S.optional(S.String),
    managedEndpointCredentials: S.optional(ManagedEndpointCredentials),
  }),
).annotations({
  identifier: "SparkEmrPropertiesOutput",
}) as any as S.Schema<SparkEmrPropertiesOutput>;
export interface SparkGlueArgs {
  connection?: string;
}
export const SparkGlueArgs = S.suspend(() =>
  S.Struct({ connection: S.optional(S.String) }),
).annotations({
  identifier: "SparkGlueArgs",
}) as any as S.Schema<SparkGlueArgs>;
export interface SparkGluePropertiesOutput {
  additionalArgs?: SparkGlueArgs;
  glueConnectionName?: string;
  glueVersion?: string;
  idleTimeout?: number;
  javaVirtualEnv?: string;
  numberOfWorkers?: number;
  pythonVirtualEnv?: string;
  workerType?: string;
}
export const SparkGluePropertiesOutput = S.suspend(() =>
  S.Struct({
    additionalArgs: S.optional(SparkGlueArgs),
    glueConnectionName: S.optional(S.String),
    glueVersion: S.optional(S.String),
    idleTimeout: S.optional(S.Number),
    javaVirtualEnv: S.optional(S.String),
    numberOfWorkers: S.optional(S.Number),
    pythonVirtualEnv: S.optional(S.String),
    workerType: S.optional(S.String),
  }),
).annotations({
  identifier: "SparkGluePropertiesOutput",
}) as any as S.Schema<SparkGluePropertiesOutput>;
export interface S3PropertiesOutput {
  s3Uri: string;
  s3AccessGrantLocationId?: string;
  status?: string;
  errorMessage?: string;
}
export const S3PropertiesOutput = S.suspend(() =>
  S.Struct({
    s3Uri: S.String,
    s3AccessGrantLocationId: S.optional(S.String),
    status: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "S3PropertiesOutput",
}) as any as S.Schema<S3PropertiesOutput>;
export interface AmazonQPropertiesOutput {
  isEnabled: boolean;
  profileArn?: string;
  authMode?: string;
}
export const AmazonQPropertiesOutput = S.suspend(() =>
  S.Struct({
    isEnabled: S.Boolean,
    profileArn: S.optional(S.String),
    authMode: S.optional(S.String),
  }),
).annotations({
  identifier: "AmazonQPropertiesOutput",
}) as any as S.Schema<AmazonQPropertiesOutput>;
export interface MlflowPropertiesOutput {
  trackingServerArn?: string;
}
export const MlflowPropertiesOutput = S.suspend(() =>
  S.Struct({ trackingServerArn: S.optional(S.String) }),
).annotations({
  identifier: "MlflowPropertiesOutput",
}) as any as S.Schema<MlflowPropertiesOutput>;
export type ConnectionPropertiesOutput =
  | { athenaProperties: AthenaPropertiesOutput }
  | { glueProperties: GluePropertiesOutput }
  | { hyperPodProperties: HyperPodPropertiesOutput }
  | { iamProperties: IamPropertiesOutput }
  | { redshiftProperties: RedshiftPropertiesOutput }
  | { sparkEmrProperties: SparkEmrPropertiesOutput }
  | { sparkGlueProperties: SparkGluePropertiesOutput }
  | { s3Properties: S3PropertiesOutput }
  | { amazonQProperties: AmazonQPropertiesOutput }
  | { mlflowProperties: MlflowPropertiesOutput };
export const ConnectionPropertiesOutput = S.Union(
  S.Struct({ athenaProperties: AthenaPropertiesOutput }),
  S.Struct({ glueProperties: GluePropertiesOutput }),
  S.Struct({ hyperPodProperties: HyperPodPropertiesOutput }),
  S.Struct({ iamProperties: IamPropertiesOutput }),
  S.Struct({ redshiftProperties: RedshiftPropertiesOutput }),
  S.Struct({ sparkEmrProperties: SparkEmrPropertiesOutput }),
  S.Struct({ sparkGlueProperties: SparkGluePropertiesOutput }),
  S.Struct({ s3Properties: S3PropertiesOutput }),
  S.Struct({ amazonQProperties: AmazonQPropertiesOutput }),
  S.Struct({ mlflowProperties: MlflowPropertiesOutput }),
);
export interface ConnectionSummary {
  connectionId: string;
  domainId: string;
  domainUnitId: string;
  environmentId?: string;
  name: string;
  physicalEndpoints: PhysicalEndpoints;
  projectId?: string;
  props?: (typeof ConnectionPropertiesOutput)["Type"];
  type: string;
  scope?: string;
}
export const ConnectionSummary = S.suspend(() =>
  S.Struct({
    connectionId: S.String,
    domainId: S.String,
    domainUnitId: S.String,
    environmentId: S.optional(S.String),
    name: S.String,
    physicalEndpoints: PhysicalEndpoints,
    projectId: S.optional(S.String),
    props: S.optional(ConnectionPropertiesOutput),
    type: S.String,
    scope: S.optional(S.String),
  }),
).annotations({
  identifier: "ConnectionSummary",
}) as any as S.Schema<ConnectionSummary>;
export type ConnectionSummaries = ConnectionSummary[];
export const ConnectionSummaries = S.Array(ConnectionSummary);
export interface DataProductRevision {
  domainId?: string;
  id?: string;
  revision?: string;
  createdAt?: Date;
  createdBy?: string;
}
export const DataProductRevision = S.suspend(() =>
  S.Struct({
    domainId: S.optional(S.String),
    id: S.optional(S.String),
    revision: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
  }),
).annotations({
  identifier: "DataProductRevision",
}) as any as S.Schema<DataProductRevision>;
export type DataProductRevisions = DataProductRevision[];
export const DataProductRevisions = S.Array(DataProductRevision);
export interface EnvironmentActionSummary {
  domainId: string;
  environmentId: string;
  id: string;
  name: string;
  parameters: (typeof ActionParameters)["Type"];
  description?: string;
}
export const EnvironmentActionSummary = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    environmentId: S.String,
    id: S.String,
    name: S.String,
    parameters: ActionParameters,
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "EnvironmentActionSummary",
}) as any as S.Schema<EnvironmentActionSummary>;
export type ListEnvironmentActionSummaries = EnvironmentActionSummary[];
export const ListEnvironmentActionSummaries = S.Array(EnvironmentActionSummary);
export interface EnvironmentBlueprintSummary {
  id: string;
  name: string;
  description?: string | Redacted.Redacted<string>;
  provider: string;
  provisioningProperties: (typeof ProvisioningProperties)["Type"];
  createdAt?: Date;
  updatedAt?: Date;
}
export const EnvironmentBlueprintSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    description: S.optional(SensitiveString),
    provider: S.String,
    provisioningProperties: ProvisioningProperties,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "EnvironmentBlueprintSummary",
}) as any as S.Schema<EnvironmentBlueprintSummary>;
export type EnvironmentBlueprintSummaries = EnvironmentBlueprintSummary[];
export const EnvironmentBlueprintSummaries = S.Array(
  EnvironmentBlueprintSummary,
);
export interface EnvironmentProfileSummary {
  id: string;
  domainId: string;
  awsAccountId?: string;
  awsAccountRegion?: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  environmentBlueprintId: string;
  projectId?: string;
}
export const EnvironmentProfileSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    domainId: S.String,
    awsAccountId: S.optional(S.String),
    awsAccountRegion: S.optional(S.String),
    createdBy: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    environmentBlueprintId: S.String,
    projectId: S.optional(S.String),
  }),
).annotations({
  identifier: "EnvironmentProfileSummary",
}) as any as S.Schema<EnvironmentProfileSummary>;
export type EnvironmentProfileSummaries = EnvironmentProfileSummary[];
export const EnvironmentProfileSummaries = S.Array(EnvironmentProfileSummary);
export interface EnvironmentSummary {
  projectId: string;
  id?: string;
  domainId: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  environmentProfileId?: string;
  awsAccountId?: string;
  awsAccountRegion?: string;
  provider: string;
  status?: string;
  environmentConfigurationId?: string | Redacted.Redacted<string>;
}
export const EnvironmentSummary = S.suspend(() =>
  S.Struct({
    projectId: S.String,
    id: S.optional(S.String),
    domainId: S.String,
    createdBy: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    environmentProfileId: S.optional(S.String),
    awsAccountId: S.optional(S.String),
    awsAccountRegion: S.optional(S.String),
    provider: S.String,
    status: S.optional(S.String),
    environmentConfigurationId: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "EnvironmentSummary",
}) as any as S.Schema<EnvironmentSummary>;
export type EnvironmentSummaries = EnvironmentSummary[];
export const EnvironmentSummaries = S.Array(EnvironmentSummary);
export interface JobRunSummary {
  domainId?: string;
  jobId?: string;
  jobType?: string;
  runId?: string;
  runMode?: string;
  status?: string;
  error?: JobRunError;
  createdBy?: string;
  createdAt?: Date;
  startTime?: Date;
  endTime?: Date;
}
export const JobRunSummary = S.suspend(() =>
  S.Struct({
    domainId: S.optional(S.String),
    jobId: S.optional(S.String),
    jobType: S.optional(S.String),
    runId: S.optional(S.String),
    runMode: S.optional(S.String),
    status: S.optional(S.String),
    error: S.optional(JobRunError),
    createdBy: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "JobRunSummary",
}) as any as S.Schema<JobRunSummary>;
export type JobRunSummaries = JobRunSummary[];
export const JobRunSummaries = S.Array(JobRunSummary);
export interface LineageNodeSummary {
  domainId: string;
  name?: string;
  description?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  id: string;
  typeName: string;
  typeRevision?: string;
  sourceIdentifier?: string;
  eventTimestamp?: Date;
}
export const LineageNodeSummary = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    name: S.optional(S.String),
    description: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedBy: S.optional(S.String),
    id: S.String,
    typeName: S.String,
    typeRevision: S.optional(S.String),
    sourceIdentifier: S.optional(S.String),
    eventTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "LineageNodeSummary",
}) as any as S.Schema<LineageNodeSummary>;
export type LineageNodeSummaries = LineageNodeSummary[];
export const LineageNodeSummaries = S.Array(LineageNodeSummary);
export interface PolicyGrantMember {
  principal?: (typeof PolicyGrantPrincipal)["Type"];
  detail?: (typeof PolicyGrantDetail)["Type"];
  createdAt?: Date;
  createdBy?: string;
  grantId?: string;
}
export const PolicyGrantMember = S.suspend(() =>
  S.Struct({
    principal: S.optional(PolicyGrantPrincipal),
    detail: S.optional(PolicyGrantDetail),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    grantId: S.optional(S.String),
  }),
).annotations({
  identifier: "PolicyGrantMember",
}) as any as S.Schema<PolicyGrantMember>;
export type PolicyGrantList = PolicyGrantMember[];
export const PolicyGrantList = S.Array(PolicyGrantMember);
export interface ProjectProfileSummary {
  domainId: string;
  id: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  status?: string;
  createdBy: string;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  domainUnitId?: string;
}
export const ProjectProfileSummary = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    id: S.String,
    name: SensitiveString,
    description: S.optional(SensitiveString),
    status: S.optional(S.String),
    createdBy: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    domainUnitId: S.optional(S.String),
  }),
).annotations({
  identifier: "ProjectProfileSummary",
}) as any as S.Schema<ProjectProfileSummary>;
export type ProjectProfileSummaries = ProjectProfileSummary[];
export const ProjectProfileSummaries = S.Array(ProjectProfileSummary);
export interface ProjectSummary {
  domainId: string;
  id: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  projectStatus?: string;
  failureReasons?: FailureReasons;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  domainUnitId?: string;
}
export const ProjectSummary = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    id: S.String,
    name: SensitiveString,
    description: S.optional(SensitiveString),
    projectStatus: S.optional(S.String),
    failureReasons: S.optional(FailureReasons),
    createdBy: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    domainUnitId: S.optional(S.String),
  }),
).annotations({
  identifier: "ProjectSummary",
}) as any as S.Schema<ProjectSummary>;
export type ProjectSummaries = ProjectSummary[];
export const ProjectSummaries = S.Array(ProjectSummary);
export interface SubscriptionGrantSummary {
  id: string;
  createdBy: string;
  updatedBy?: string;
  domainId: string;
  createdAt: Date;
  updatedAt: Date;
  environmentId?: string;
  subscriptionTargetId: string;
  grantedEntity: (typeof GrantedEntity)["Type"];
  status: string;
  assets?: SubscribedAssets;
  subscriptionId?: string;
}
export const SubscriptionGrantSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    createdBy: S.String,
    updatedBy: S.optional(S.String),
    domainId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    environmentId: S.optional(S.String),
    subscriptionTargetId: S.String,
    grantedEntity: GrantedEntity,
    status: S.String,
    assets: S.optional(SubscribedAssets),
    subscriptionId: S.optional(S.String),
  }),
).annotations({
  identifier: "SubscriptionGrantSummary",
}) as any as S.Schema<SubscriptionGrantSummary>;
export type SubscriptionGrants = SubscriptionGrantSummary[];
export const SubscriptionGrants = S.Array(SubscriptionGrantSummary);
export interface SubscriptionSummary {
  id: string;
  createdBy: string;
  updatedBy?: string;
  domainId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  subscribedPrincipal: (typeof SubscribedPrincipal)["Type"];
  subscribedListing: SubscribedListing;
  subscriptionRequestId?: string;
  retainPermissions?: boolean;
}
export const SubscriptionSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    createdBy: S.String,
    updatedBy: S.optional(S.String),
    domainId: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    subscribedPrincipal: SubscribedPrincipal,
    subscribedListing: SubscribedListing,
    subscriptionRequestId: S.optional(S.String),
    retainPermissions: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SubscriptionSummary",
}) as any as S.Schema<SubscriptionSummary>;
export type Subscriptions = SubscriptionSummary[];
export const Subscriptions = S.Array(SubscriptionSummary);
export interface SubscriptionTargetSummary {
  id: string;
  authorizedPrincipals: AuthorizedPrincipalIdentifiers;
  domainId: string;
  projectId: string;
  environmentId: string;
  name: string | Redacted.Redacted<string>;
  type: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt?: Date;
  manageAccessRole?: string;
  applicableAssetTypes: ApplicableAssetTypes;
  subscriptionTargetConfig: SubscriptionTargetForms;
  provider: string;
}
export const SubscriptionTargetSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    authorizedPrincipals: AuthorizedPrincipalIdentifiers,
    domainId: S.String,
    projectId: S.String,
    environmentId: S.String,
    name: SensitiveString,
    type: S.String,
    createdBy: S.String,
    updatedBy: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    manageAccessRole: S.optional(S.String),
    applicableAssetTypes: ApplicableAssetTypes,
    subscriptionTargetConfig: SubscriptionTargetForms,
    provider: S.String,
  }),
).annotations({
  identifier: "SubscriptionTargetSummary",
}) as any as S.Schema<SubscriptionTargetSummary>;
export type SubscriptionTargets = SubscriptionTargetSummary[];
export const SubscriptionTargets = S.Array(SubscriptionTargetSummary);
export type TimeSeriesDataPointFormOutputList = TimeSeriesDataPointFormOutput[];
export const TimeSeriesDataPointFormOutputList = S.Array(
  TimeSeriesDataPointFormOutput,
);
export interface GroupProfileSummary {
  domainId?: string;
  id?: string;
  status?: string;
  groupName?: string | Redacted.Redacted<string>;
}
export const GroupProfileSummary = S.suspend(() =>
  S.Struct({
    domainId: S.optional(S.String),
    id: S.optional(S.String),
    status: S.optional(S.String),
    groupName: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "GroupProfileSummary",
}) as any as S.Schema<GroupProfileSummary>;
export type GroupProfileSummaries = GroupProfileSummary[];
export const GroupProfileSummaries = S.Array(GroupProfileSummary);
export interface UserProfileSummary {
  domainId?: string;
  id?: string;
  type?: string;
  status?: string;
  details?: (typeof UserProfileDetails)["Type"];
}
export const UserProfileSummary = S.suspend(() =>
  S.Struct({
    domainId: S.optional(S.String),
    id: S.optional(S.String),
    type: S.optional(S.String),
    status: S.optional(S.String),
    details: S.optional(UserProfileDetails),
  }),
).annotations({
  identifier: "UserProfileSummary",
}) as any as S.Schema<UserProfileSummary>;
export type UserProfileSummaries = UserProfileSummary[];
export const UserProfileSummaries = S.Array(UserProfileSummary);
export type FormsInputMap = { [key: string]: FormEntryInput };
export const FormsInputMap = S.Record({ key: S.String, value: FormEntryInput });
export interface DataSourceSummary {
  domainId: string;
  environmentId?: string;
  connectionId?: string;
  dataSourceId: string;
  name: string | Redacted.Redacted<string>;
  type: string;
  status: string;
  enableSetting?: string;
  schedule?: ScheduleConfiguration;
  lastRunStatus?: string;
  lastRunAt?: Date;
  lastRunErrorMessage?: DataSourceErrorMessage;
  lastRunAssetCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  description?: string | Redacted.Redacted<string>;
}
export const DataSourceSummary = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    environmentId: S.optional(S.String),
    connectionId: S.optional(S.String),
    dataSourceId: S.String,
    name: SensitiveString,
    type: S.String,
    status: S.String,
    enableSetting: S.optional(S.String),
    schedule: S.optional(ScheduleConfiguration),
    lastRunStatus: S.optional(S.String),
    lastRunAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastRunErrorMessage: S.optional(DataSourceErrorMessage),
    lastRunAssetCount: S.optional(S.Number),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    description: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "DataSourceSummary",
}) as any as S.Schema<DataSourceSummary>;
export type DataSourceSummaries = DataSourceSummary[];
export const DataSourceSummaries = S.Array(DataSourceSummary);
export interface RunStatisticsForAssets {
  added?: number;
  updated?: number;
  unchanged?: number;
  skipped?: number;
  failed?: number;
}
export const RunStatisticsForAssets = S.suspend(() =>
  S.Struct({
    added: S.optional(S.Number),
    updated: S.optional(S.Number),
    unchanged: S.optional(S.Number),
    skipped: S.optional(S.Number),
    failed: S.optional(S.Number),
  }),
).annotations({
  identifier: "RunStatisticsForAssets",
}) as any as S.Schema<RunStatisticsForAssets>;
export interface DataSourceRunLineageSummary {
  importStatus?: string;
}
export const DataSourceRunLineageSummary = S.suspend(() =>
  S.Struct({ importStatus: S.optional(S.String) }),
).annotations({
  identifier: "DataSourceRunLineageSummary",
}) as any as S.Schema<DataSourceRunLineageSummary>;
export interface DataSourceRunSummary {
  id: string;
  dataSourceId: string;
  type: string;
  status: string;
  projectId: string;
  runStatisticsForAssets?: RunStatisticsForAssets;
  errorMessage?: DataSourceErrorMessage;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  stoppedAt?: Date;
  lineageSummary?: DataSourceRunLineageSummary;
}
export const DataSourceRunSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    dataSourceId: S.String,
    type: S.String,
    status: S.String,
    projectId: S.String,
    runStatisticsForAssets: S.optional(RunStatisticsForAssets),
    errorMessage: S.optional(DataSourceErrorMessage),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    stoppedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lineageSummary: S.optional(DataSourceRunLineageSummary),
  }),
).annotations({
  identifier: "DataSourceRunSummary",
}) as any as S.Schema<DataSourceRunSummary>;
export type DataSourceRunSummaries = DataSourceRunSummary[];
export const DataSourceRunSummaries = S.Array(DataSourceRunSummary);
export interface DomainSummary {
  id: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  arn: string;
  managedAccountId: string;
  status: string;
  portalUrl?: string;
  createdAt: Date;
  lastUpdatedAt?: Date;
  domainVersion?: string;
}
export const DomainSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: SensitiveString,
    description: S.optional(SensitiveString),
    arn: S.String,
    managedAccountId: S.String,
    status: S.String,
    portalUrl: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    domainVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "DomainSummary",
}) as any as S.Schema<DomainSummary>;
export type DomainSummaries = DomainSummary[];
export const DomainSummaries = S.Array(DomainSummary);
export interface DomainUnitSummary {
  name: string;
  id: string;
}
export const DomainUnitSummary = S.suspend(() =>
  S.Struct({ name: S.String, id: S.String }),
).annotations({
  identifier: "DomainUnitSummary",
}) as any as S.Schema<DomainUnitSummary>;
export type DomainUnitSummaries = DomainUnitSummary[];
export const DomainUnitSummaries = S.Array(DomainUnitSummary);
export interface EnvironmentBlueprintConfigurationItem {
  domainId: string;
  environmentBlueprintId: string;
  provisioningRoleArn?: string;
  environmentRolePermissionBoundary?: string;
  manageAccessRoleArn?: string;
  enabledRegions?: EnabledRegionList;
  regionalParameters?: RegionalParameterMap;
  createdAt?: Date;
  updatedAt?: Date;
  provisioningConfigurations?: ProvisioningConfigurationList;
}
export const EnvironmentBlueprintConfigurationItem = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    environmentBlueprintId: S.String,
    provisioningRoleArn: S.optional(S.String),
    environmentRolePermissionBoundary: S.optional(S.String),
    manageAccessRoleArn: S.optional(S.String),
    enabledRegions: S.optional(EnabledRegionList),
    regionalParameters: S.optional(RegionalParameterMap),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    provisioningConfigurations: S.optional(ProvisioningConfigurationList),
  }),
).annotations({
  identifier: "EnvironmentBlueprintConfigurationItem",
}) as any as S.Schema<EnvironmentBlueprintConfigurationItem>;
export type EnvironmentBlueprintConfigurations =
  EnvironmentBlueprintConfigurationItem[];
export const EnvironmentBlueprintConfigurations = S.Array(
  EnvironmentBlueprintConfigurationItem,
);
export interface Import {
  name: string | Redacted.Redacted<string>;
  revision: string;
}
export const Import = S.suspend(() =>
  S.Struct({ name: SensitiveString, revision: S.String }),
).annotations({ identifier: "Import" }) as any as S.Schema<Import>;
export type ImportList = Import[];
export const ImportList = S.Array(Import);
export interface MetadataGenerationRunTypeStat {
  type: string;
  status: string;
  errorMessage?: string;
}
export const MetadataGenerationRunTypeStat = S.suspend(() =>
  S.Struct({
    type: S.String,
    status: S.String,
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "MetadataGenerationRunTypeStat",
}) as any as S.Schema<MetadataGenerationRunTypeStat>;
export type MetadataGenerationRunTypeStats = MetadataGenerationRunTypeStat[];
export const MetadataGenerationRunTypeStats = S.Array(
  MetadataGenerationRunTypeStat,
);
export interface MetadataGenerationRunItem {
  domainId: string;
  id: string;
  target?: MetadataGenerationRunTarget;
  status?: string;
  type?: string;
  types?: MetadataGenerationRunTypes;
  createdAt?: Date;
  createdBy?: string;
  owningProjectId: string;
}
export const MetadataGenerationRunItem = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    id: S.String,
    target: S.optional(MetadataGenerationRunTarget),
    status: S.optional(S.String),
    type: S.optional(S.String),
    types: S.optional(MetadataGenerationRunTypes),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    owningProjectId: S.String,
  }),
).annotations({
  identifier: "MetadataGenerationRunItem",
}) as any as S.Schema<MetadataGenerationRunItem>;
export type MetadataGenerationRuns = MetadataGenerationRunItem[];
export const MetadataGenerationRuns = S.Array(MetadataGenerationRunItem);
export interface RuleSummary {
  identifier?: string;
  revision?: string;
  ruleType?: string;
  name?: string | Redacted.Redacted<string>;
  targetType?: string;
  target?: (typeof RuleTarget)["Type"];
  action?: string;
  scope?: RuleScope;
  updatedAt?: Date;
  lastUpdatedBy?: string;
}
export const RuleSummary = S.suspend(() =>
  S.Struct({
    identifier: S.optional(S.String),
    revision: S.optional(S.String),
    ruleType: S.optional(S.String),
    name: S.optional(SensitiveString),
    targetType: S.optional(S.String),
    target: S.optional(RuleTarget),
    action: S.optional(S.String),
    scope: S.optional(RuleScope),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedBy: S.optional(S.String),
  }),
).annotations({ identifier: "RuleSummary" }) as any as S.Schema<RuleSummary>;
export type RuleSummaries = RuleSummary[];
export const RuleSummaries = S.Array(RuleSummary);
export type EnvironmentFailureReasonsList = EnvironmentError[];
export const EnvironmentFailureReasonsList = S.Array(EnvironmentError);
export interface AcceptPredictionsOutput {
  domainId: string;
  assetId: string;
  revision: string;
}
export const AcceptPredictionsOutput = S.suspend(() =>
  S.Struct({ domainId: S.String, assetId: S.String, revision: S.String }),
).annotations({
  identifier: "AcceptPredictionsOutput",
}) as any as S.Schema<AcceptPredictionsOutput>;
export interface AcceptSubscriptionRequestInput {
  domainIdentifier: string;
  identifier: string;
  decisionComment?: string | Redacted.Redacted<string>;
  assetScopes?: AcceptedAssetScopes;
  assetPermissions?: AssetPermissions;
}
export const AcceptSubscriptionRequestInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    decisionComment: S.optional(SensitiveString),
    assetScopes: S.optional(AcceptedAssetScopes),
    assetPermissions: S.optional(AssetPermissions),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/domains/{domainIdentifier}/subscription-requests/{identifier}/accept",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AcceptSubscriptionRequestInput",
}) as any as S.Schema<AcceptSubscriptionRequestInput>;
export interface AddEntityOwnerInput {
  domainIdentifier: string;
  entityType: string;
  entityIdentifier: string;
  owner: (typeof OwnerProperties)["Type"];
  clientToken?: string;
}
export const AddEntityOwnerInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    owner: OwnerProperties,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/entities/{entityType}/{entityIdentifier}/addOwner",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddEntityOwnerInput",
}) as any as S.Schema<AddEntityOwnerInput>;
export interface AddEntityOwnerOutput {}
export const AddEntityOwnerOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "AddEntityOwnerOutput",
}) as any as S.Schema<AddEntityOwnerOutput>;
export interface BatchGetAttributesMetadataOutput {
  attributes?: BatchGetAttributeItems;
  errors: AttributesErrors;
}
export const BatchGetAttributesMetadataOutput = S.suspend(() =>
  S.Struct({
    attributes: S.optional(BatchGetAttributeItems),
    errors: AttributesErrors,
  }),
).annotations({
  identifier: "BatchGetAttributesMetadataOutput",
}) as any as S.Schema<BatchGetAttributesMetadataOutput>;
export interface CreateAccountPoolInput {
  domainIdentifier: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  resolutionStrategy: string;
  accountSource: (typeof AccountSource)["Type"];
}
export const CreateAccountPoolInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    resolutionStrategy: S.String,
    accountSource: AccountSource,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/account-pools",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAccountPoolInput",
}) as any as S.Schema<CreateAccountPoolInput>;
export interface CreateEnvironmentOutput {
  projectId: string;
  id?: string;
  domainId: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  environmentProfileId?: string;
  awsAccountId?: string;
  awsAccountRegion?: string;
  provider: string;
  provisionedResources?: ResourceList;
  status?: string;
  environmentActions?: EnvironmentActionList;
  glossaryTerms?: GlossaryTerms;
  userParameters?: CustomParameterList;
  lastDeployment?: Deployment;
  provisioningProperties?: (typeof ProvisioningProperties)["Type"];
  deploymentProperties?: DeploymentProperties;
  environmentBlueprintId?: string;
  environmentConfigurationId?: string | Redacted.Redacted<string>;
}
export const CreateEnvironmentOutput = S.suspend(() =>
  S.Struct({
    projectId: S.String,
    id: S.optional(S.String),
    domainId: S.String,
    createdBy: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    environmentProfileId: S.optional(S.String),
    awsAccountId: S.optional(S.String),
    awsAccountRegion: S.optional(S.String),
    provider: S.String,
    provisionedResources: S.optional(ResourceList),
    status: S.optional(S.String),
    environmentActions: S.optional(EnvironmentActionList),
    glossaryTerms: S.optional(GlossaryTerms),
    userParameters: S.optional(CustomParameterList),
    lastDeployment: S.optional(Deployment),
    provisioningProperties: S.optional(ProvisioningProperties),
    deploymentProperties: S.optional(DeploymentProperties),
    environmentBlueprintId: S.optional(S.String),
    environmentConfigurationId: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "CreateEnvironmentOutput",
}) as any as S.Schema<CreateEnvironmentOutput>;
export interface CreateEnvironmentActionInput {
  domainIdentifier: string;
  environmentIdentifier: string;
  name: string;
  parameters: (typeof ActionParameters)["Type"];
  description?: string;
}
export const CreateEnvironmentActionInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String.pipe(T.HttpLabel("environmentIdentifier")),
    name: S.String,
    parameters: ActionParameters,
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/environments/{environmentIdentifier}/actions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEnvironmentActionInput",
}) as any as S.Schema<CreateEnvironmentActionInput>;
export interface CreateEnvironmentBlueprintInput {
  domainIdentifier: string;
  name: string;
  description?: string | Redacted.Redacted<string>;
  provisioningProperties: (typeof ProvisioningProperties)["Type"];
  userParameters?: CustomParameterList;
}
export const CreateEnvironmentBlueprintInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: S.String,
    description: S.optional(SensitiveString),
    provisioningProperties: ProvisioningProperties,
    userParameters: S.optional(CustomParameterList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/environment-blueprints",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEnvironmentBlueprintInput",
}) as any as S.Schema<CreateEnvironmentBlueprintInput>;
export interface CreateProjectInput {
  domainIdentifier: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  resourceTags?: Tags;
  glossaryTerms?: GlossaryTerms;
  domainUnitId?: string;
  projectProfileId?: string;
  userParameters?: EnvironmentConfigurationUserParametersList;
}
export const CreateProjectInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    resourceTags: S.optional(Tags),
    glossaryTerms: S.optional(GlossaryTerms),
    domainUnitId: S.optional(S.String),
    projectProfileId: S.optional(S.String),
    userParameters: S.optional(EnvironmentConfigurationUserParametersList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/projects",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProjectInput",
}) as any as S.Schema<CreateProjectInput>;
export interface CreateSubscriptionGrantInput {
  domainIdentifier: string;
  environmentIdentifier: string;
  subscriptionTargetIdentifier?: string;
  grantedEntity: (typeof GrantedEntityInput)["Type"];
  assetTargetNames?: AssetTargetNames;
  clientToken?: string;
}
export const CreateSubscriptionGrantInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.String,
    subscriptionTargetIdentifier: S.optional(S.String),
    grantedEntity: GrantedEntityInput,
    assetTargetNames: S.optional(AssetTargetNames),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/subscription-grants",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSubscriptionGrantInput",
}) as any as S.Schema<CreateSubscriptionGrantInput>;
export interface CreateSubscriptionRequestInput {
  domainIdentifier: string;
  subscribedPrincipals: SubscribedPrincipalInputs;
  subscribedListings: SubscribedListingInputs;
  requestReason: string | Redacted.Redacted<string>;
  clientToken?: string;
  metadataForms?: MetadataFormInputs;
  assetPermissions?: AssetPermissions;
  assetScopes?: AcceptedAssetScopes;
}
export const CreateSubscriptionRequestInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    subscribedPrincipals: SubscribedPrincipalInputs,
    subscribedListings: SubscribedListingInputs,
    requestReason: SensitiveString,
    clientToken: S.optional(S.String),
    metadataForms: S.optional(MetadataFormInputs),
    assetPermissions: S.optional(AssetPermissions),
    assetScopes: S.optional(AcceptedAssetScopes),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/subscription-requests",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSubscriptionRequestInput",
}) as any as S.Schema<CreateSubscriptionRequestInput>;
export interface CreateSubscriptionTargetOutput {
  id: string;
  authorizedPrincipals: AuthorizedPrincipalIdentifiers;
  domainId: string;
  projectId: string;
  environmentId: string;
  name: string | Redacted.Redacted<string>;
  type: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt?: Date;
  manageAccessRole?: string;
  applicableAssetTypes: ApplicableAssetTypes;
  subscriptionTargetConfig: SubscriptionTargetForms;
  provider: string;
}
export const CreateSubscriptionTargetOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    authorizedPrincipals: AuthorizedPrincipalIdentifiers,
    domainId: S.String,
    projectId: S.String,
    environmentId: S.String,
    name: SensitiveString,
    type: S.String,
    createdBy: S.String,
    updatedBy: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    manageAccessRole: S.optional(S.String),
    applicableAssetTypes: ApplicableAssetTypes,
    subscriptionTargetConfig: SubscriptionTargetForms,
    provider: S.String,
  }),
).annotations({
  identifier: "CreateSubscriptionTargetOutput",
}) as any as S.Schema<CreateSubscriptionTargetOutput>;
export interface GetLineageNodeOutput {
  domainId: string;
  name?: string;
  description?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  id: string;
  typeName: string;
  typeRevision?: string;
  sourceIdentifier?: string;
  eventTimestamp?: Date;
  formsOutput?: FormOutputList;
  upstreamNodes?: LineageNodeReferenceList;
  downstreamNodes?: LineageNodeReferenceList;
}
export const GetLineageNodeOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    name: S.optional(S.String),
    description: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedBy: S.optional(S.String),
    id: S.String,
    typeName: S.String,
    typeRevision: S.optional(S.String),
    sourceIdentifier: S.optional(S.String),
    eventTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    formsOutput: S.optional(FormOutputList),
    upstreamNodes: S.optional(LineageNodeReferenceList),
    downstreamNodes: S.optional(LineageNodeReferenceList),
  }),
).annotations({
  identifier: "GetLineageNodeOutput",
}) as any as S.Schema<GetLineageNodeOutput>;
export type EnvironmentFailureReasons = {
  [key: string]: EnvironmentFailureReasonsList;
};
export const EnvironmentFailureReasons = S.Record({
  key: S.String,
  value: EnvironmentFailureReasonsList,
});
export interface EnvironmentDeploymentDetails {
  overallDeploymentStatus?: string;
  environmentFailureReasons?: EnvironmentFailureReasons;
}
export const EnvironmentDeploymentDetails = S.suspend(() =>
  S.Struct({
    overallDeploymentStatus: S.optional(S.String),
    environmentFailureReasons: S.optional(EnvironmentFailureReasons),
  }),
).annotations({
  identifier: "EnvironmentDeploymentDetails",
}) as any as S.Schema<EnvironmentDeploymentDetails>;
export interface GetProjectOutput {
  domainId: string;
  id: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  projectStatus?: string;
  failureReasons?: FailureReasons;
  createdBy: string;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  resourceTags?: ResourceTags;
  glossaryTerms?: GlossaryTerms;
  domainUnitId?: string;
  projectProfileId?: string;
  userParameters?: EnvironmentConfigurationUserParametersList;
  environmentDeploymentDetails?: EnvironmentDeploymentDetails;
}
export const GetProjectOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    id: S.String,
    name: SensitiveString,
    description: S.optional(SensitiveString),
    projectStatus: S.optional(S.String),
    failureReasons: S.optional(FailureReasons),
    createdBy: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    resourceTags: S.optional(ResourceTags),
    glossaryTerms: S.optional(GlossaryTerms),
    domainUnitId: S.optional(S.String),
    projectProfileId: S.optional(S.String),
    userParameters: S.optional(EnvironmentConfigurationUserParametersList),
    environmentDeploymentDetails: S.optional(EnvironmentDeploymentDetails),
  }),
).annotations({
  identifier: "GetProjectOutput",
}) as any as S.Schema<GetProjectOutput>;
export interface GetTimeSeriesDataPointOutput {
  domainId?: string;
  entityId?: string;
  entityType?: string;
  formName?: string;
  form?: TimeSeriesDataPointFormOutput;
}
export const GetTimeSeriesDataPointOutput = S.suspend(() =>
  S.Struct({
    domainId: S.optional(S.String),
    entityId: S.optional(S.String),
    entityType: S.optional(S.String),
    formName: S.optional(S.String),
    form: S.optional(TimeSeriesDataPointFormOutput),
  }),
).annotations({
  identifier: "GetTimeSeriesDataPointOutput",
}) as any as S.Schema<GetTimeSeriesDataPointOutput>;
export interface ListAccountPoolsOutput {
  items?: AccountPoolSummaries;
  nextToken?: string;
}
export const ListAccountPoolsOutput = S.suspend(() =>
  S.Struct({
    items: S.optional(AccountPoolSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAccountPoolsOutput",
}) as any as S.Schema<ListAccountPoolsOutput>;
export interface ListAssetFiltersOutput {
  items: AssetFilters;
  nextToken?: string;
}
export const ListAssetFiltersOutput = S.suspend(() =>
  S.Struct({ items: AssetFilters, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListAssetFiltersOutput",
}) as any as S.Schema<ListAssetFiltersOutput>;
export interface ListAssetRevisionsOutput {
  items?: AssetRevisions;
  nextToken?: string;
}
export const ListAssetRevisionsOutput = S.suspend(() =>
  S.Struct({
    items: S.optional(AssetRevisions),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssetRevisionsOutput",
}) as any as S.Schema<ListAssetRevisionsOutput>;
export interface ListConnectionsOutput {
  items: ConnectionSummaries;
  nextToken?: string;
}
export const ListConnectionsOutput = S.suspend(() =>
  S.Struct({ items: ConnectionSummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListConnectionsOutput",
}) as any as S.Schema<ListConnectionsOutput>;
export interface ListDataProductRevisionsOutput {
  items: DataProductRevisions;
  nextToken?: string;
}
export const ListDataProductRevisionsOutput = S.suspend(() =>
  S.Struct({ items: DataProductRevisions, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListDataProductRevisionsOutput",
}) as any as S.Schema<ListDataProductRevisionsOutput>;
export interface ListEnvironmentActionsOutput {
  items?: ListEnvironmentActionSummaries;
  nextToken?: string;
}
export const ListEnvironmentActionsOutput = S.suspend(() =>
  S.Struct({
    items: S.optional(ListEnvironmentActionSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEnvironmentActionsOutput",
}) as any as S.Schema<ListEnvironmentActionsOutput>;
export interface ListEnvironmentBlueprintsOutput {
  items: EnvironmentBlueprintSummaries;
  nextToken?: string;
}
export const ListEnvironmentBlueprintsOutput = S.suspend(() =>
  S.Struct({
    items: EnvironmentBlueprintSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEnvironmentBlueprintsOutput",
}) as any as S.Schema<ListEnvironmentBlueprintsOutput>;
export interface ListEnvironmentProfilesOutput {
  items: EnvironmentProfileSummaries;
  nextToken?: string;
}
export const ListEnvironmentProfilesOutput = S.suspend(() =>
  S.Struct({
    items: EnvironmentProfileSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEnvironmentProfilesOutput",
}) as any as S.Schema<ListEnvironmentProfilesOutput>;
export interface ListEnvironmentsOutput {
  items: EnvironmentSummaries;
  nextToken?: string;
}
export const ListEnvironmentsOutput = S.suspend(() =>
  S.Struct({ items: EnvironmentSummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListEnvironmentsOutput",
}) as any as S.Schema<ListEnvironmentsOutput>;
export interface ListJobRunsOutput {
  items?: JobRunSummaries;
  nextToken?: string;
}
export const ListJobRunsOutput = S.suspend(() =>
  S.Struct({
    items: S.optional(JobRunSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListJobRunsOutput",
}) as any as S.Schema<ListJobRunsOutput>;
export interface ListLineageNodeHistoryOutput {
  nodes?: LineageNodeSummaries;
  nextToken?: string;
}
export const ListLineageNodeHistoryOutput = S.suspend(() =>
  S.Struct({
    nodes: S.optional(LineageNodeSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLineageNodeHistoryOutput",
}) as any as S.Schema<ListLineageNodeHistoryOutput>;
export interface ListPolicyGrantsOutput {
  grantList: PolicyGrantList;
  nextToken?: string;
}
export const ListPolicyGrantsOutput = S.suspend(() =>
  S.Struct({ grantList: PolicyGrantList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListPolicyGrantsOutput",
}) as any as S.Schema<ListPolicyGrantsOutput>;
export interface ListProjectProfilesOutput {
  items?: ProjectProfileSummaries;
  nextToken?: string;
}
export const ListProjectProfilesOutput = S.suspend(() =>
  S.Struct({
    items: S.optional(ProjectProfileSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProjectProfilesOutput",
}) as any as S.Schema<ListProjectProfilesOutput>;
export interface ListProjectsOutput {
  items?: ProjectSummaries;
  nextToken?: string;
}
export const ListProjectsOutput = S.suspend(() =>
  S.Struct({
    items: S.optional(ProjectSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProjectsOutput",
}) as any as S.Schema<ListProjectsOutput>;
export interface ListSubscriptionGrantsOutput {
  items: SubscriptionGrants;
  nextToken?: string;
}
export const ListSubscriptionGrantsOutput = S.suspend(() =>
  S.Struct({ items: SubscriptionGrants, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListSubscriptionGrantsOutput",
}) as any as S.Schema<ListSubscriptionGrantsOutput>;
export interface ListSubscriptionsOutput {
  items: Subscriptions;
  nextToken?: string;
}
export const ListSubscriptionsOutput = S.suspend(() =>
  S.Struct({ items: Subscriptions, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListSubscriptionsOutput",
}) as any as S.Schema<ListSubscriptionsOutput>;
export interface ListSubscriptionTargetsOutput {
  items: SubscriptionTargets;
  nextToken?: string;
}
export const ListSubscriptionTargetsOutput = S.suspend(() =>
  S.Struct({ items: SubscriptionTargets, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListSubscriptionTargetsOutput",
}) as any as S.Schema<ListSubscriptionTargetsOutput>;
export interface ListTimeSeriesDataPointsOutput {
  items?: TimeSeriesDataPointSummaryFormOutputList;
  nextToken?: string;
}
export const ListTimeSeriesDataPointsOutput = S.suspend(() =>
  S.Struct({
    items: S.optional(TimeSeriesDataPointSummaryFormOutputList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTimeSeriesDataPointsOutput",
}) as any as S.Schema<ListTimeSeriesDataPointsOutput>;
export interface PostTimeSeriesDataPointsOutput {
  domainId?: string;
  entityId?: string;
  entityType?: string;
  forms?: TimeSeriesDataPointFormOutputList;
}
export const PostTimeSeriesDataPointsOutput = S.suspend(() =>
  S.Struct({
    domainId: S.optional(S.String),
    entityId: S.optional(S.String),
    entityType: S.optional(S.String),
    forms: S.optional(TimeSeriesDataPointFormOutputList),
  }),
).annotations({
  identifier: "PostTimeSeriesDataPointsOutput",
}) as any as S.Schema<PostTimeSeriesDataPointsOutput>;
export interface RejectPredictionsOutput {
  domainId: string;
  assetId: string;
  assetRevision: string;
}
export const RejectPredictionsOutput = S.suspend(() =>
  S.Struct({ domainId: S.String, assetId: S.String, assetRevision: S.String }),
).annotations({
  identifier: "RejectPredictionsOutput",
}) as any as S.Schema<RejectPredictionsOutput>;
export interface SearchInput {
  domainIdentifier: string;
  owningProjectIdentifier?: string;
  maxResults?: number;
  nextToken?: string;
  searchScope: string;
  searchText?: string;
  searchIn?: SearchInList;
  filters?: FilterClause;
  sort?: SearchSort;
  additionalAttributes?: SearchOutputAdditionalAttributes;
}
export const SearchInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    owningProjectIdentifier: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    searchScope: S.String,
    searchText: S.optional(S.String),
    searchIn: S.optional(SearchInList),
    filters: S.optional(FilterClause),
    sort: S.optional(SearchSort),
    additionalAttributes: S.optional(SearchOutputAdditionalAttributes),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/domains/{domainIdentifier}/search" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({ identifier: "SearchInput" }) as any as S.Schema<SearchInput>;
export interface SearchGroupProfilesOutput {
  items?: GroupProfileSummaries;
  nextToken?: string;
}
export const SearchGroupProfilesOutput = S.suspend(() =>
  S.Struct({
    items: S.optional(GroupProfileSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchGroupProfilesOutput",
}) as any as S.Schema<SearchGroupProfilesOutput>;
export interface SearchUserProfilesOutput {
  items?: UserProfileSummaries;
  nextToken?: string;
}
export const SearchUserProfilesOutput = S.suspend(() =>
  S.Struct({
    items: S.optional(UserProfileSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchUserProfilesOutput",
}) as any as S.Schema<SearchUserProfilesOutput>;
export interface UpdateSubscriptionGrantStatusOutput {
  id: string;
  createdBy: string;
  updatedBy?: string;
  domainId: string;
  createdAt: Date;
  updatedAt: Date;
  environmentId?: string;
  subscriptionTargetId: string;
  grantedEntity: (typeof GrantedEntity)["Type"];
  status: string;
  assets?: SubscribedAssets;
  subscriptionId?: string;
}
export const UpdateSubscriptionGrantStatusOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    createdBy: S.String,
    updatedBy: S.optional(S.String),
    domainId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    environmentId: S.optional(S.String),
    subscriptionTargetId: S.String,
    grantedEntity: GrantedEntity,
    status: S.String,
    assets: S.optional(SubscribedAssets),
    subscriptionId: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateSubscriptionGrantStatusOutput",
}) as any as S.Schema<UpdateSubscriptionGrantStatusOutput>;
export interface CreateAssetInput {
  name: string | Redacted.Redacted<string>;
  domainIdentifier: string;
  externalIdentifier?: string;
  typeIdentifier: string;
  typeRevision?: string;
  description?: string | Redacted.Redacted<string>;
  glossaryTerms?: GlossaryTerms;
  formsInput?: FormInputList;
  owningProjectIdentifier: string;
  predictionConfiguration?: PredictionConfiguration;
  clientToken?: string;
}
export const CreateAssetInput = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    externalIdentifier: S.optional(S.String),
    typeIdentifier: S.String,
    typeRevision: S.optional(S.String),
    description: S.optional(SensitiveString),
    glossaryTerms: S.optional(GlossaryTerms),
    formsInput: S.optional(FormInputList),
    owningProjectIdentifier: S.String,
    predictionConfiguration: S.optional(PredictionConfiguration),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/domains/{domainIdentifier}/assets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAssetInput",
}) as any as S.Schema<CreateAssetInput>;
export interface GetAssetOutput {
  id: string;
  name: string | Redacted.Redacted<string>;
  typeIdentifier: string;
  typeRevision: string;
  externalIdentifier?: string;
  revision: string;
  description?: string | Redacted.Redacted<string>;
  createdAt?: Date;
  createdBy?: string;
  firstRevisionCreatedAt?: Date;
  firstRevisionCreatedBy?: string;
  glossaryTerms?: GlossaryTerms;
  governedGlossaryTerms?: GovernedGlossaryTerms;
  owningProjectId: string;
  domainId: string;
  listing?: AssetListingDetails;
  formsOutput: FormOutputList;
  readOnlyFormsOutput?: FormOutputList;
  latestTimeSeriesDataPointFormsOutput?: TimeSeriesDataPointSummaryFormOutputList;
}
export const GetAssetOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: SensitiveString,
    typeIdentifier: S.String,
    typeRevision: S.String,
    externalIdentifier: S.optional(S.String),
    revision: S.String,
    description: S.optional(SensitiveString),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    firstRevisionCreatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    firstRevisionCreatedBy: S.optional(S.String),
    glossaryTerms: S.optional(GlossaryTerms),
    governedGlossaryTerms: S.optional(GovernedGlossaryTerms),
    owningProjectId: S.String,
    domainId: S.String,
    listing: S.optional(AssetListingDetails),
    formsOutput: FormOutputList,
    readOnlyFormsOutput: S.optional(FormOutputList),
    latestTimeSeriesDataPointFormsOutput: S.optional(
      TimeSeriesDataPointSummaryFormOutputList,
    ),
  }),
).annotations({
  identifier: "GetAssetOutput",
}) as any as S.Schema<GetAssetOutput>;
export interface CreateAssetTypeInput {
  domainIdentifier: string;
  name: string;
  description?: string | Redacted.Redacted<string>;
  formsInput: FormsInputMap;
  owningProjectIdentifier: string;
}
export const CreateAssetTypeInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: S.String,
    description: S.optional(SensitiveString),
    formsInput: FormsInputMap,
    owningProjectIdentifier: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/asset-types",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAssetTypeInput",
}) as any as S.Schema<CreateAssetTypeInput>;
export interface CreateDataProductOutput {
  domainId: string;
  id: string;
  revision: string;
  owningProjectId: string;
  name: string | Redacted.Redacted<string>;
  status: string;
  description?: string | Redacted.Redacted<string>;
  glossaryTerms?: GlossaryTerms;
  items?: DataProductItems;
  formsOutput?: FormOutputList;
  createdAt?: Date;
  createdBy?: string;
  firstRevisionCreatedAt?: Date;
  firstRevisionCreatedBy?: string;
}
export const CreateDataProductOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    id: S.String,
    revision: S.String,
    owningProjectId: S.String,
    name: SensitiveString,
    status: S.String,
    description: S.optional(SensitiveString),
    glossaryTerms: S.optional(GlossaryTerms),
    items: S.optional(DataProductItems),
    formsOutput: S.optional(FormOutputList),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    firstRevisionCreatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    firstRevisionCreatedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateDataProductOutput",
}) as any as S.Schema<CreateDataProductOutput>;
export interface ListDataSourcesOutput {
  items: DataSourceSummaries;
  nextToken?: string;
}
export const ListDataSourcesOutput = S.suspend(() =>
  S.Struct({ items: DataSourceSummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListDataSourcesOutput",
}) as any as S.Schema<ListDataSourcesOutput>;
export interface StartDataSourceRunOutput {
  domainId: string;
  dataSourceId: string;
  id: string;
  projectId: string;
  status: string;
  type: string;
  dataSourceConfigurationSnapshot?: string;
  runStatisticsForAssets?: RunStatisticsForAssets;
  errorMessage?: DataSourceErrorMessage;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  stoppedAt?: Date;
}
export const StartDataSourceRunOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    dataSourceId: S.String,
    id: S.String,
    projectId: S.String,
    status: S.String,
    type: S.String,
    dataSourceConfigurationSnapshot: S.optional(S.String),
    runStatisticsForAssets: S.optional(RunStatisticsForAssets),
    errorMessage: S.optional(DataSourceErrorMessage),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    stoppedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "StartDataSourceRunOutput",
}) as any as S.Schema<StartDataSourceRunOutput>;
export interface GetDataSourceRunOutput {
  domainId: string;
  dataSourceId: string;
  id: string;
  projectId: string;
  status: string;
  type: string;
  dataSourceConfigurationSnapshot?: string;
  runStatisticsForAssets?: RunStatisticsForAssets;
  lineageSummary?: DataSourceRunLineageSummary;
  errorMessage?: DataSourceErrorMessage;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  stoppedAt?: Date;
}
export const GetDataSourceRunOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    dataSourceId: S.String,
    id: S.String,
    projectId: S.String,
    status: S.String,
    type: S.String,
    dataSourceConfigurationSnapshot: S.optional(S.String),
    runStatisticsForAssets: S.optional(RunStatisticsForAssets),
    lineageSummary: S.optional(DataSourceRunLineageSummary),
    errorMessage: S.optional(DataSourceErrorMessage),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    stoppedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetDataSourceRunOutput",
}) as any as S.Schema<GetDataSourceRunOutput>;
export interface ListDataSourceRunsOutput {
  items: DataSourceRunSummaries;
  nextToken?: string;
}
export const ListDataSourceRunsOutput = S.suspend(() =>
  S.Struct({ items: DataSourceRunSummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListDataSourceRunsOutput",
}) as any as S.Schema<ListDataSourceRunsOutput>;
export interface CreateDomainOutput {
  id: string;
  rootDomainUnitId?: string;
  name?: string;
  description?: string;
  singleSignOn?: SingleSignOn;
  domainExecutionRole?: string;
  arn?: string;
  kmsKeyIdentifier?: string;
  status?: string;
  portalUrl?: string;
  tags?: Tags;
  domainVersion?: string;
  serviceRole?: string;
}
export const CreateDomainOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    rootDomainUnitId: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    singleSignOn: S.optional(SingleSignOn),
    domainExecutionRole: S.optional(S.String),
    arn: S.optional(S.String),
    kmsKeyIdentifier: S.optional(S.String),
    status: S.optional(S.String),
    portalUrl: S.optional(S.String),
    tags: S.optional(Tags),
    domainVersion: S.optional(S.String),
    serviceRole: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateDomainOutput",
}) as any as S.Schema<CreateDomainOutput>;
export interface ListDomainsOutput {
  items: DomainSummaries;
  nextToken?: string;
}
export const ListDomainsOutput = S.suspend(() =>
  S.Struct({ items: DomainSummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListDomainsOutput",
}) as any as S.Schema<ListDomainsOutput>;
export interface ListDomainUnitsForParentOutput {
  items: DomainUnitSummaries;
  nextToken?: string;
}
export const ListDomainUnitsForParentOutput = S.suspend(() =>
  S.Struct({ items: DomainUnitSummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListDomainUnitsForParentOutput",
}) as any as S.Schema<ListDomainUnitsForParentOutput>;
export interface PutEnvironmentBlueprintConfigurationInput {
  domainIdentifier: string;
  environmentBlueprintIdentifier: string;
  provisioningRoleArn?: string;
  manageAccessRoleArn?: string;
  environmentRolePermissionBoundary?: string;
  enabledRegions: EnabledRegionList;
  regionalParameters?: RegionalParameterMap;
  globalParameters?: GlobalParameterMap;
  provisioningConfigurations?: ProvisioningConfigurationList;
}
export const PutEnvironmentBlueprintConfigurationInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentBlueprintIdentifier: S.String.pipe(
      T.HttpLabel("environmentBlueprintIdentifier"),
    ),
    provisioningRoleArn: S.optional(S.String),
    manageAccessRoleArn: S.optional(S.String),
    environmentRolePermissionBoundary: S.optional(S.String),
    enabledRegions: EnabledRegionList,
    regionalParameters: S.optional(RegionalParameterMap),
    globalParameters: S.optional(GlobalParameterMap),
    provisioningConfigurations: S.optional(ProvisioningConfigurationList),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/domains/{domainIdentifier}/environment-blueprint-configurations/{environmentBlueprintIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutEnvironmentBlueprintConfigurationInput",
}) as any as S.Schema<PutEnvironmentBlueprintConfigurationInput>;
export interface ListEnvironmentBlueprintConfigurationsOutput {
  items?: EnvironmentBlueprintConfigurations;
  nextToken?: string;
}
export const ListEnvironmentBlueprintConfigurationsOutput = S.suspend(() =>
  S.Struct({
    items: S.optional(EnvironmentBlueprintConfigurations),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEnvironmentBlueprintConfigurationsOutput",
}) as any as S.Schema<ListEnvironmentBlueprintConfigurationsOutput>;
export interface CreateFormTypeOutput {
  domainId: string;
  name: string | Redacted.Redacted<string>;
  revision: string;
  description?: string | Redacted.Redacted<string>;
  owningProjectId?: string;
  originDomainId?: string;
  originProjectId?: string;
}
export const CreateFormTypeOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    name: SensitiveString,
    revision: S.String,
    description: S.optional(SensitiveString),
    owningProjectId: S.optional(S.String),
    originDomainId: S.optional(S.String),
    originProjectId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateFormTypeOutput",
}) as any as S.Schema<CreateFormTypeOutput>;
export interface GetFormTypeOutput {
  domainId: string;
  name: string | Redacted.Redacted<string>;
  revision: string;
  model: (typeof Model)["Type"];
  owningProjectId?: string;
  originDomainId?: string;
  originProjectId?: string;
  status?: string;
  createdAt?: Date;
  createdBy?: string;
  description?: string | Redacted.Redacted<string>;
  imports?: ImportList;
}
export const GetFormTypeOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    name: SensitiveString,
    revision: S.String,
    model: Model,
    owningProjectId: S.optional(S.String),
    originDomainId: S.optional(S.String),
    originProjectId: S.optional(S.String),
    status: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    description: S.optional(SensitiveString),
    imports: S.optional(ImportList),
  }),
).annotations({
  identifier: "GetFormTypeOutput",
}) as any as S.Schema<GetFormTypeOutput>;
export interface CreateGlossaryTermOutput {
  id: string;
  domainId: string;
  glossaryId: string;
  name: string | Redacted.Redacted<string>;
  status: string;
  shortDescription?: string | Redacted.Redacted<string>;
  longDescription?: string | Redacted.Redacted<string>;
  termRelations?: TermRelations;
  usageRestrictions?: GlossaryUsageRestrictions;
}
export const CreateGlossaryTermOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    domainId: S.String,
    glossaryId: S.String,
    name: SensitiveString,
    status: S.String,
    shortDescription: S.optional(SensitiveString),
    longDescription: S.optional(SensitiveString),
    termRelations: S.optional(TermRelations),
    usageRestrictions: S.optional(GlossaryUsageRestrictions),
  }),
).annotations({
  identifier: "CreateGlossaryTermOutput",
}) as any as S.Schema<CreateGlossaryTermOutput>;
export interface StartMetadataGenerationRunOutput {
  domainId: string;
  id: string;
  status?: string;
  type?: string;
  types?: MetadataGenerationRunTypes;
  createdAt?: Date;
  createdBy?: string;
  owningProjectId?: string;
}
export const StartMetadataGenerationRunOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    id: S.String,
    status: S.optional(S.String),
    type: S.optional(S.String),
    types: S.optional(MetadataGenerationRunTypes),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    owningProjectId: S.optional(S.String),
  }),
).annotations({
  identifier: "StartMetadataGenerationRunOutput",
}) as any as S.Schema<StartMetadataGenerationRunOutput>;
export interface GetMetadataGenerationRunOutput {
  domainId: string;
  id: string;
  target?: MetadataGenerationRunTarget;
  status?: string;
  type?: string;
  types?: MetadataGenerationRunTypes;
  createdAt?: Date;
  createdBy?: string;
  owningProjectId: string;
  typeStats?: MetadataGenerationRunTypeStats;
}
export const GetMetadataGenerationRunOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    id: S.String,
    target: S.optional(MetadataGenerationRunTarget),
    status: S.optional(S.String),
    type: S.optional(S.String),
    types: S.optional(MetadataGenerationRunTypes),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    owningProjectId: S.String,
    typeStats: S.optional(MetadataGenerationRunTypeStats),
  }),
).annotations({
  identifier: "GetMetadataGenerationRunOutput",
}) as any as S.Schema<GetMetadataGenerationRunOutput>;
export interface ListMetadataGenerationRunsOutput {
  items?: MetadataGenerationRuns;
  nextToken?: string;
}
export const ListMetadataGenerationRunsOutput = S.suspend(() =>
  S.Struct({
    items: S.optional(MetadataGenerationRuns),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMetadataGenerationRunsOutput",
}) as any as S.Schema<ListMetadataGenerationRunsOutput>;
export interface ListRulesOutput {
  items: RuleSummaries;
  nextToken?: string;
}
export const ListRulesOutput = S.suspend(() =>
  S.Struct({ items: RuleSummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListRulesOutput",
}) as any as S.Schema<ListRulesOutput>;
export interface SparkGluePropertiesInput {
  additionalArgs?: SparkGlueArgs;
  glueConnectionName?: string;
  glueVersion?: string;
  idleTimeout?: number;
  javaVirtualEnv?: string;
  numberOfWorkers?: number;
  pythonVirtualEnv?: string;
  workerType?: string;
}
export const SparkGluePropertiesInput = S.suspend(() =>
  S.Struct({
    additionalArgs: S.optional(SparkGlueArgs),
    glueConnectionName: S.optional(S.String),
    glueVersion: S.optional(S.String),
    idleTimeout: S.optional(S.Number),
    javaVirtualEnv: S.optional(S.String),
    numberOfWorkers: S.optional(S.Number),
    pythonVirtualEnv: S.optional(S.String),
    workerType: S.optional(S.String),
  }),
).annotations({
  identifier: "SparkGluePropertiesInput",
}) as any as S.Schema<SparkGluePropertiesInput>;
export interface LineageInfo {
  eventId?: string;
  eventStatus?: string;
  errorMessage?: string;
}
export const LineageInfo = S.suspend(() =>
  S.Struct({
    eventId: S.optional(S.String),
    eventStatus: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "LineageInfo" }) as any as S.Schema<LineageInfo>;
export interface OwnerUserPropertiesOutput {
  userId?: string;
}
export const OwnerUserPropertiesOutput = S.suspend(() =>
  S.Struct({ userId: S.optional(S.String) }),
).annotations({
  identifier: "OwnerUserPropertiesOutput",
}) as any as S.Schema<OwnerUserPropertiesOutput>;
export interface OwnerGroupPropertiesOutput {
  groupId?: string;
}
export const OwnerGroupPropertiesOutput = S.suspend(() =>
  S.Struct({ groupId: S.optional(S.String) }),
).annotations({
  identifier: "OwnerGroupPropertiesOutput",
}) as any as S.Schema<OwnerGroupPropertiesOutput>;
export type MetadataMap = { [key: string]: string };
export const MetadataMap = S.Record({ key: S.String, value: S.String });
export interface MetadataFormSummary {
  formName?: string;
  typeName: string | Redacted.Redacted<string>;
  typeRevision: string;
}
export const MetadataFormSummary = S.suspend(() =>
  S.Struct({
    formName: S.optional(S.String),
    typeName: SensitiveString,
    typeRevision: S.String,
  }),
).annotations({
  identifier: "MetadataFormSummary",
}) as any as S.Schema<MetadataFormSummary>;
export type MetadataFormsSummary = MetadataFormSummary[];
export const MetadataFormsSummary = S.Array(MetadataFormSummary);
export interface FormEntryOutput {
  typeName: string | Redacted.Redacted<string>;
  typeRevision: string;
  required?: boolean;
}
export const FormEntryOutput = S.suspend(() =>
  S.Struct({
    typeName: SensitiveString,
    typeRevision: S.String,
    required: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "FormEntryOutput",
}) as any as S.Schema<FormEntryOutput>;
export type FormsOutputMap = { [key: string]: FormEntryOutput };
export const FormsOutputMap = S.Record({
  key: S.String,
  value: FormEntryOutput,
});
export interface AssetTypeItem {
  domainId: string;
  name: string;
  revision: string;
  description?: string | Redacted.Redacted<string>;
  formsOutput: FormsOutputMap;
  owningProjectId: string;
  originDomainId?: string;
  originProjectId?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}
export const AssetTypeItem = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    name: S.String,
    revision: S.String,
    description: S.optional(SensitiveString),
    formsOutput: FormsOutputMap,
    owningProjectId: S.String,
    originDomainId: S.optional(S.String),
    originProjectId: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "AssetTypeItem",
}) as any as S.Schema<AssetTypeItem>;
export interface FormTypeData {
  domainId: string;
  name: string | Redacted.Redacted<string>;
  revision: string;
  model?: (typeof Model)["Type"];
  status?: string;
  owningProjectId?: string;
  originDomainId?: string;
  originProjectId?: string;
  createdAt?: Date;
  createdBy?: string;
  description?: string | Redacted.Redacted<string>;
  imports?: ImportList;
}
export const FormTypeData = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    name: SensitiveString,
    revision: S.String,
    model: S.optional(Model),
    status: S.optional(S.String),
    owningProjectId: S.optional(S.String),
    originDomainId: S.optional(S.String),
    originProjectId: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    description: S.optional(SensitiveString),
    imports: S.optional(ImportList),
  }),
).annotations({ identifier: "FormTypeData" }) as any as S.Schema<FormTypeData>;
export interface LineageNodeTypeItem {
  domainId: string;
  name?: string;
  description?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  revision: string;
  formsOutput: FormsOutputMap;
}
export const LineageNodeTypeItem = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    name: S.optional(S.String),
    description: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedBy: S.optional(S.String),
    revision: S.String,
    formsOutput: FormsOutputMap,
  }),
).annotations({
  identifier: "LineageNodeTypeItem",
}) as any as S.Schema<LineageNodeTypeItem>;
export type FailedQueryProcessingErrorMessages = string[];
export const FailedQueryProcessingErrorMessages = S.Array(S.String);
export interface NameIdentifier {
  name?: string;
  namespace?: string;
}
export const NameIdentifier = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), namespace: S.optional(S.String) }),
).annotations({
  identifier: "NameIdentifier",
}) as any as S.Schema<NameIdentifier>;
export type NameIdentifiers = NameIdentifier[];
export const NameIdentifiers = S.Array(NameIdentifier);
export interface BasicAuthenticationCredentials {
  userName?: string;
  password?: string;
}
export const BasicAuthenticationCredentials = S.suspend(() =>
  S.Struct({ userName: S.optional(S.String), password: S.optional(S.String) }),
).annotations({
  identifier: "BasicAuthenticationCredentials",
}) as any as S.Schema<BasicAuthenticationCredentials>;
export interface AuthenticationConfigurationPatch {
  secretArn?: string;
  basicAuthenticationCredentials?: BasicAuthenticationCredentials;
}
export const AuthenticationConfigurationPatch = S.suspend(() =>
  S.Struct({
    secretArn: S.optional(S.String),
    basicAuthenticationCredentials: S.optional(BasicAuthenticationCredentials),
  }),
).annotations({
  identifier: "AuthenticationConfigurationPatch",
}) as any as S.Schema<AuthenticationConfigurationPatch>;
export interface BatchPutAttributeOutput {
  attributeIdentifier: string;
}
export const BatchPutAttributeOutput = S.suspend(() =>
  S.Struct({ attributeIdentifier: S.String }),
).annotations({
  identifier: "BatchPutAttributeOutput",
}) as any as S.Schema<BatchPutAttributeOutput>;
export type BatchPutAttributeItems = BatchPutAttributeOutput[];
export const BatchPutAttributeItems = S.Array(BatchPutAttributeOutput);
export interface DataSourceRunActivity {
  database: string | Redacted.Redacted<string>;
  dataSourceRunId: string;
  technicalName: string | Redacted.Redacted<string>;
  dataAssetStatus: string;
  projectId: string;
  dataAssetId?: string;
  technicalDescription?: string | Redacted.Redacted<string>;
  errorMessage?: DataSourceErrorMessage;
  lineageSummary?: LineageInfo;
  createdAt: Date;
  updatedAt: Date;
}
export const DataSourceRunActivity = S.suspend(() =>
  S.Struct({
    database: SensitiveString,
    dataSourceRunId: S.String,
    technicalName: SensitiveString,
    dataAssetStatus: S.String,
    projectId: S.String,
    dataAssetId: S.optional(S.String),
    technicalDescription: S.optional(SensitiveString),
    errorMessage: S.optional(DataSourceErrorMessage),
    lineageSummary: S.optional(LineageInfo),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "DataSourceRunActivity",
}) as any as S.Schema<DataSourceRunActivity>;
export type DataSourceRunActivities = DataSourceRunActivity[];
export const DataSourceRunActivities = S.Array(DataSourceRunActivity);
export type OwnerPropertiesOutput =
  | { user: OwnerUserPropertiesOutput }
  | { group: OwnerGroupPropertiesOutput };
export const OwnerPropertiesOutput = S.Union(
  S.Struct({ user: OwnerUserPropertiesOutput }),
  S.Struct({ group: OwnerGroupPropertiesOutput }),
);
export type EntityOwners = (typeof OwnerPropertiesOutput)["Type"][];
export const EntityOwners = S.Array(OwnerPropertiesOutput);
export interface SubscriptionRequestSummary {
  id: string;
  createdBy: string;
  updatedBy?: string;
  domainId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  requestReason: string | Redacted.Redacted<string>;
  subscribedPrincipals: SubscribedPrincipals;
  subscribedListings: SubscribedListings;
  reviewerId?: string;
  decisionComment?: string | Redacted.Redacted<string>;
  existingSubscriptionId?: string;
  metadataFormsSummary?: MetadataFormsSummary;
}
export const SubscriptionRequestSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    createdBy: S.String,
    updatedBy: S.optional(S.String),
    domainId: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    requestReason: SensitiveString,
    subscribedPrincipals: SubscribedPrincipals,
    subscribedListings: SubscribedListings,
    reviewerId: S.optional(S.String),
    decisionComment: S.optional(SensitiveString),
    existingSubscriptionId: S.optional(S.String),
    metadataFormsSummary: S.optional(MetadataFormsSummary),
  }),
).annotations({
  identifier: "SubscriptionRequestSummary",
}) as any as S.Schema<SubscriptionRequestSummary>;
export type SubscriptionRequests = SubscriptionRequestSummary[];
export const SubscriptionRequests = S.Array(SubscriptionRequestSummary);
export type SearchTypesResultItem =
  | { assetTypeItem: AssetTypeItem }
  | { formTypeItem: FormTypeData }
  | { lineageNodeTypeItem: LineageNodeTypeItem };
export const SearchTypesResultItem = S.Union(
  S.Struct({ assetTypeItem: AssetTypeItem }),
  S.Struct({ formTypeItem: FormTypeData }),
  S.Struct({ lineageNodeTypeItem: LineageNodeTypeItem }),
);
export type SearchTypesResultItems = (typeof SearchTypesResultItem)["Type"][];
export const SearchTypesResultItems = S.Array(SearchTypesResultItem);
export interface LineageSqlQueryRunDetails {
  queryStartTime?: Date;
  queryEndTime?: Date;
  totalQueriesProcessed?: number;
  numQueriesFailed?: number;
  errorMessages?: FailedQueryProcessingErrorMessages;
}
export const LineageSqlQueryRunDetails = S.suspend(() =>
  S.Struct({
    queryStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    queryEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    totalQueriesProcessed: S.optional(S.Number),
    numQueriesFailed: S.optional(S.Number),
    errorMessages: S.optional(FailedQueryProcessingErrorMessages),
  }),
).annotations({
  identifier: "LineageSqlQueryRunDetails",
}) as any as S.Schema<LineageSqlQueryRunDetails>;
export interface NotificationResource {
  type: string;
  id: string;
  name?: string;
}
export const NotificationResource = S.suspend(() =>
  S.Struct({ type: S.String, id: S.String, name: S.optional(S.String) }),
).annotations({
  identifier: "NotificationResource",
}) as any as S.Schema<NotificationResource>;
export interface UserDetails {
  userId: string;
}
export const UserDetails = S.suspend(() =>
  S.Struct({ userId: S.String }),
).annotations({ identifier: "UserDetails" }) as any as S.Schema<UserDetails>;
export interface GroupDetails {
  groupId: string;
}
export const GroupDetails = S.suspend(() =>
  S.Struct({ groupId: S.String }),
).annotations({ identifier: "GroupDetails" }) as any as S.Schema<GroupDetails>;
export interface GlueConnectionPatch {
  description?: string;
  connectionProperties?: ConnectionProperties;
  authenticationConfiguration?: AuthenticationConfigurationPatch;
}
export const GlueConnectionPatch = S.suspend(() =>
  S.Struct({
    description: S.optional(S.String),
    connectionProperties: S.optional(ConnectionProperties),
    authenticationConfiguration: S.optional(AuthenticationConfigurationPatch),
  }),
).annotations({
  identifier: "GlueConnectionPatch",
}) as any as S.Schema<GlueConnectionPatch>;
export interface ListingSummary {
  listingId?: string;
  listingRevision?: string;
  glossaryTerms?: DetailedGlossaryTerms;
}
export const ListingSummary = S.suspend(() =>
  S.Struct({
    listingId: S.optional(S.String),
    listingRevision: S.optional(S.String),
    glossaryTerms: S.optional(DetailedGlossaryTerms),
  }),
).annotations({
  identifier: "ListingSummary",
}) as any as S.Schema<ListingSummary>;
export type ListingSummaries = ListingSummary[];
export const ListingSummaries = S.Array(ListingSummary);
export interface AcceptSubscriptionRequestOutput {
  id: string;
  createdBy: string;
  updatedBy?: string;
  domainId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  requestReason: string | Redacted.Redacted<string>;
  subscribedPrincipals: SubscribedPrincipals;
  subscribedListings: SubscribedListings;
  reviewerId?: string;
  decisionComment?: string | Redacted.Redacted<string>;
  existingSubscriptionId?: string;
  metadataForms?: MetadataForms;
}
export const AcceptSubscriptionRequestOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    createdBy: S.String,
    updatedBy: S.optional(S.String),
    domainId: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    requestReason: SensitiveString,
    subscribedPrincipals: SubscribedPrincipals,
    subscribedListings: SubscribedListings,
    reviewerId: S.optional(S.String),
    decisionComment: S.optional(SensitiveString),
    existingSubscriptionId: S.optional(S.String),
    metadataForms: S.optional(MetadataForms),
  }),
).annotations({
  identifier: "AcceptSubscriptionRequestOutput",
}) as any as S.Schema<AcceptSubscriptionRequestOutput>;
export interface BatchPutAttributesMetadataOutput {
  errors?: AttributesErrors;
  attributes?: BatchPutAttributeItems;
}
export const BatchPutAttributesMetadataOutput = S.suspend(() =>
  S.Struct({
    errors: S.optional(AttributesErrors),
    attributes: S.optional(BatchPutAttributeItems),
  }),
).annotations({
  identifier: "BatchPutAttributesMetadataOutput",
}) as any as S.Schema<BatchPutAttributesMetadataOutput>;
export interface CreateAccountPoolOutput {
  domainId?: string;
  name?: string | Redacted.Redacted<string>;
  id?: string;
  description?: string | Redacted.Redacted<string>;
  resolutionStrategy?: string;
  accountSource: (typeof AccountSource)["Type"];
  createdBy: string;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  updatedBy?: string;
  domainUnitId?: string;
}
export const CreateAccountPoolOutput = S.suspend(() =>
  S.Struct({
    domainId: S.optional(S.String),
    name: S.optional(SensitiveString),
    id: S.optional(S.String),
    description: S.optional(SensitiveString),
    resolutionStrategy: S.optional(S.String),
    accountSource: AccountSource,
    createdBy: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedBy: S.optional(S.String),
    domainUnitId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateAccountPoolOutput",
}) as any as S.Schema<CreateAccountPoolOutput>;
export type CredentialMap = { [key: string]: string };
export const CredentialMap = S.Record({ key: S.String, value: S.String });
export interface CreateEnvironmentActionOutput {
  domainId: string;
  environmentId: string;
  id: string;
  name: string;
  parameters: (typeof ActionParameters)["Type"];
  description?: string;
}
export const CreateEnvironmentActionOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    environmentId: S.String,
    id: S.String,
    name: S.String,
    parameters: ActionParameters,
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateEnvironmentActionOutput",
}) as any as S.Schema<CreateEnvironmentActionOutput>;
export interface CreateEnvironmentBlueprintOutput {
  id: string;
  name: string;
  description?: string | Redacted.Redacted<string>;
  provider: string;
  provisioningProperties: (typeof ProvisioningProperties)["Type"];
  deploymentProperties?: DeploymentProperties;
  userParameters?: CustomParameterList;
  glossaryTerms?: GlossaryTerms;
  createdAt?: Date;
  updatedAt?: Date;
}
export const CreateEnvironmentBlueprintOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    description: S.optional(SensitiveString),
    provider: S.String,
    provisioningProperties: ProvisioningProperties,
    deploymentProperties: S.optional(DeploymentProperties),
    userParameters: S.optional(CustomParameterList),
    glossaryTerms: S.optional(GlossaryTerms),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "CreateEnvironmentBlueprintOutput",
}) as any as S.Schema<CreateEnvironmentBlueprintOutput>;
export interface CreateProjectOutput {
  domainId: string;
  id: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  projectStatus?: string;
  failureReasons?: FailureReasons;
  createdBy: string;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  resourceTags?: ResourceTags;
  glossaryTerms?: GlossaryTerms;
  domainUnitId?: string;
  projectProfileId?: string;
  userParameters?: EnvironmentConfigurationUserParametersList;
  environmentDeploymentDetails?: EnvironmentDeploymentDetails;
}
export const CreateProjectOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    id: S.String,
    name: SensitiveString,
    description: S.optional(SensitiveString),
    projectStatus: S.optional(S.String),
    failureReasons: S.optional(FailureReasons),
    createdBy: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    resourceTags: S.optional(ResourceTags),
    glossaryTerms: S.optional(GlossaryTerms),
    domainUnitId: S.optional(S.String),
    projectProfileId: S.optional(S.String),
    userParameters: S.optional(EnvironmentConfigurationUserParametersList),
    environmentDeploymentDetails: S.optional(EnvironmentDeploymentDetails),
  }),
).annotations({
  identifier: "CreateProjectOutput",
}) as any as S.Schema<CreateProjectOutput>;
export interface CreateProjectProfileInput {
  domainIdentifier: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  status?: string;
  projectResourceTags?: ProjectResourceTagParameters;
  allowCustomProjectResourceTags?: boolean;
  projectResourceTagsDescription?: string | Redacted.Redacted<string>;
  environmentConfigurations?: EnvironmentConfigurationsList;
  domainUnitIdentifier?: string;
}
export const CreateProjectProfileInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    status: S.optional(S.String),
    projectResourceTags: S.optional(ProjectResourceTagParameters),
    allowCustomProjectResourceTags: S.optional(S.Boolean),
    projectResourceTagsDescription: S.optional(SensitiveString),
    environmentConfigurations: S.optional(EnvironmentConfigurationsList),
    domainUnitIdentifier: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/project-profiles",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProjectProfileInput",
}) as any as S.Schema<CreateProjectProfileInput>;
export interface CreateSubscriptionGrantOutput {
  id: string;
  createdBy: string;
  updatedBy?: string;
  domainId: string;
  createdAt: Date;
  updatedAt: Date;
  environmentId?: string;
  subscriptionTargetId: string;
  grantedEntity: (typeof GrantedEntity)["Type"];
  status: string;
  assets?: SubscribedAssets;
  subscriptionId?: string;
}
export const CreateSubscriptionGrantOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    createdBy: S.String,
    updatedBy: S.optional(S.String),
    domainId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    environmentId: S.optional(S.String),
    subscriptionTargetId: S.String,
    grantedEntity: GrantedEntity,
    status: S.String,
    assets: S.optional(SubscribedAssets),
    subscriptionId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateSubscriptionGrantOutput",
}) as any as S.Schema<CreateSubscriptionGrantOutput>;
export interface CreateSubscriptionRequestOutput {
  id: string;
  createdBy: string;
  updatedBy?: string;
  domainId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  requestReason: string | Redacted.Redacted<string>;
  subscribedPrincipals: SubscribedPrincipals;
  subscribedListings: SubscribedListings;
  reviewerId?: string;
  decisionComment?: string | Redacted.Redacted<string>;
  existingSubscriptionId?: string;
  metadataForms?: MetadataForms;
}
export const CreateSubscriptionRequestOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    createdBy: S.String,
    updatedBy: S.optional(S.String),
    domainId: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    requestReason: SensitiveString,
    subscribedPrincipals: SubscribedPrincipals,
    subscribedListings: SubscribedListings,
    reviewerId: S.optional(S.String),
    decisionComment: S.optional(SensitiveString),
    existingSubscriptionId: S.optional(S.String),
    metadataForms: S.optional(MetadataForms),
  }),
).annotations({
  identifier: "CreateSubscriptionRequestOutput",
}) as any as S.Schema<CreateSubscriptionRequestOutput>;
export interface CreateUserProfileOutput {
  domainId?: string;
  id?: string;
  type?: string;
  status?: string;
  details?: (typeof UserProfileDetails)["Type"];
}
export const CreateUserProfileOutput = S.suspend(() =>
  S.Struct({
    domainId: S.optional(S.String),
    id: S.optional(S.String),
    type: S.optional(S.String),
    status: S.optional(S.String),
    details: S.optional(UserProfileDetails),
  }),
).annotations({
  identifier: "CreateUserProfileOutput",
}) as any as S.Schema<CreateUserProfileOutput>;
export interface DeleteSubscriptionGrantOutput {
  id: string;
  createdBy: string;
  updatedBy?: string;
  domainId: string;
  createdAt: Date;
  updatedAt: Date;
  environmentId?: string;
  subscriptionTargetId: string;
  grantedEntity: (typeof GrantedEntity)["Type"];
  status: string;
  assets?: SubscribedAssets;
  subscriptionId?: string;
}
export const DeleteSubscriptionGrantOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    createdBy: S.String,
    updatedBy: S.optional(S.String),
    domainId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    environmentId: S.optional(S.String),
    subscriptionTargetId: S.String,
    grantedEntity: GrantedEntity,
    status: S.String,
    assets: S.optional(SubscribedAssets),
    subscriptionId: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteSubscriptionGrantOutput",
}) as any as S.Schema<DeleteSubscriptionGrantOutput>;
export interface GetEnvironmentOutput {
  projectId: string;
  id?: string;
  domainId: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  environmentProfileId?: string;
  awsAccountId?: string;
  awsAccountRegion?: string;
  provider: string;
  provisionedResources?: ResourceList;
  status?: string;
  environmentActions?: EnvironmentActionList;
  glossaryTerms?: GlossaryTerms;
  userParameters?: CustomParameterList;
  lastDeployment?: Deployment;
  provisioningProperties?: (typeof ProvisioningProperties)["Type"];
  deploymentProperties?: DeploymentProperties;
  environmentBlueprintId?: string;
  environmentConfigurationId?: string | Redacted.Redacted<string>;
}
export const GetEnvironmentOutput = S.suspend(() =>
  S.Struct({
    projectId: S.String,
    id: S.optional(S.String),
    domainId: S.String,
    createdBy: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    environmentProfileId: S.optional(S.String),
    awsAccountId: S.optional(S.String),
    awsAccountRegion: S.optional(S.String),
    provider: S.String,
    provisionedResources: S.optional(ResourceList),
    status: S.optional(S.String),
    environmentActions: S.optional(EnvironmentActionList),
    glossaryTerms: S.optional(GlossaryTerms),
    userParameters: S.optional(CustomParameterList),
    lastDeployment: S.optional(Deployment),
    provisioningProperties: S.optional(ProvisioningProperties),
    deploymentProperties: S.optional(DeploymentProperties),
    environmentBlueprintId: S.optional(S.String),
    environmentConfigurationId: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "GetEnvironmentOutput",
}) as any as S.Schema<GetEnvironmentOutput>;
export interface ListDataSourceRunActivitiesOutput {
  items: DataSourceRunActivities;
  nextToken?: string;
}
export const ListDataSourceRunActivitiesOutput = S.suspend(() =>
  S.Struct({ items: DataSourceRunActivities, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListDataSourceRunActivitiesOutput",
}) as any as S.Schema<ListDataSourceRunActivitiesOutput>;
export interface ListEntityOwnersOutput {
  owners: EntityOwners;
  nextToken?: string;
}
export const ListEntityOwnersOutput = S.suspend(() =>
  S.Struct({ owners: EntityOwners, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListEntityOwnersOutput",
}) as any as S.Schema<ListEntityOwnersOutput>;
export interface ListSubscriptionRequestsOutput {
  items: SubscriptionRequests;
  nextToken?: string;
}
export const ListSubscriptionRequestsOutput = S.suspend(() =>
  S.Struct({ items: SubscriptionRequests, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListSubscriptionRequestsOutput",
}) as any as S.Schema<ListSubscriptionRequestsOutput>;
export interface SearchTypesOutput {
  items?: SearchTypesResultItems;
  nextToken?: string;
  totalMatchCount?: number;
}
export const SearchTypesOutput = S.suspend(() =>
  S.Struct({
    items: S.optional(SearchTypesResultItems),
    nextToken: S.optional(S.String),
    totalMatchCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "SearchTypesOutput",
}) as any as S.Schema<SearchTypesOutput>;
export interface UpdateProjectInput {
  domainIdentifier: string;
  identifier: string;
  name?: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  resourceTags?: Tags;
  glossaryTerms?: GlossaryTerms;
  domainUnitId?: string;
  environmentDeploymentDetails?: EnvironmentDeploymentDetails;
  userParameters?: EnvironmentConfigurationUserParametersList;
  projectProfileVersion?: string;
}
export const UpdateProjectInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    name: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    resourceTags: S.optional(Tags),
    glossaryTerms: S.optional(GlossaryTerms),
    domainUnitId: S.optional(S.String),
    environmentDeploymentDetails: S.optional(EnvironmentDeploymentDetails),
    userParameters: S.optional(EnvironmentConfigurationUserParametersList),
    projectProfileVersion: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/v2/domains/{domainIdentifier}/projects/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateProjectInput",
}) as any as S.Schema<UpdateProjectInput>;
export interface CreateAssetOutput {
  id: string;
  name: string | Redacted.Redacted<string>;
  typeIdentifier: string;
  typeRevision: string;
  externalIdentifier?: string;
  revision: string;
  description?: string | Redacted.Redacted<string>;
  createdAt?: Date;
  createdBy?: string;
  firstRevisionCreatedAt?: Date;
  firstRevisionCreatedBy?: string;
  glossaryTerms?: GlossaryTerms;
  governedGlossaryTerms?: GovernedGlossaryTerms;
  owningProjectId: string;
  domainId: string;
  listing?: AssetListingDetails;
  formsOutput: FormOutputList;
  readOnlyFormsOutput?: FormOutputList;
  latestTimeSeriesDataPointFormsOutput?: TimeSeriesDataPointSummaryFormOutputList;
  predictionConfiguration?: PredictionConfiguration;
}
export const CreateAssetOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: SensitiveString,
    typeIdentifier: S.String,
    typeRevision: S.String,
    externalIdentifier: S.optional(S.String),
    revision: S.String,
    description: S.optional(SensitiveString),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    firstRevisionCreatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    firstRevisionCreatedBy: S.optional(S.String),
    glossaryTerms: S.optional(GlossaryTerms),
    governedGlossaryTerms: S.optional(GovernedGlossaryTerms),
    owningProjectId: S.String,
    domainId: S.String,
    listing: S.optional(AssetListingDetails),
    formsOutput: FormOutputList,
    readOnlyFormsOutput: S.optional(FormOutputList),
    latestTimeSeriesDataPointFormsOutput: S.optional(
      TimeSeriesDataPointSummaryFormOutputList,
    ),
    predictionConfiguration: S.optional(PredictionConfiguration),
  }),
).annotations({
  identifier: "CreateAssetOutput",
}) as any as S.Schema<CreateAssetOutput>;
export interface CreateAssetTypeOutput {
  domainId: string;
  name: string;
  revision: string;
  description?: string | Redacted.Redacted<string>;
  formsOutput: FormsOutputMap;
  owningProjectId?: string;
  originDomainId?: string;
  originProjectId?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}
export const CreateAssetTypeOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    name: S.String,
    revision: S.String,
    description: S.optional(SensitiveString),
    formsOutput: FormsOutputMap,
    owningProjectId: S.optional(S.String),
    originDomainId: S.optional(S.String),
    originProjectId: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateAssetTypeOutput",
}) as any as S.Schema<CreateAssetTypeOutput>;
export interface GetAssetTypeOutput {
  domainId: string;
  name: string;
  revision: string;
  description?: string | Redacted.Redacted<string>;
  formsOutput: FormsOutputMap;
  owningProjectId: string;
  originDomainId?: string;
  originProjectId?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}
export const GetAssetTypeOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    name: S.String,
    revision: S.String,
    description: S.optional(SensitiveString),
    formsOutput: FormsOutputMap,
    owningProjectId: S.String,
    originDomainId: S.optional(S.String),
    originProjectId: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "GetAssetTypeOutput",
}) as any as S.Schema<GetAssetTypeOutput>;
export interface CreateDomainUnitOutput {
  id: string;
  domainId: string;
  name: string | Redacted.Redacted<string>;
  parentDomainUnitId?: string;
  description?: string | Redacted.Redacted<string>;
  owners: DomainUnitOwners;
  ancestorDomainUnitIds: DomainUnitIds;
  createdAt?: Date;
  createdBy?: string;
}
export const CreateDomainUnitOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    domainId: S.String,
    name: SensitiveString,
    parentDomainUnitId: S.optional(S.String),
    description: S.optional(SensitiveString),
    owners: DomainUnitOwners,
    ancestorDomainUnitIds: DomainUnitIds,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateDomainUnitOutput",
}) as any as S.Schema<CreateDomainUnitOutput>;
export interface PutEnvironmentBlueprintConfigurationOutput {
  domainId: string;
  environmentBlueprintId: string;
  provisioningRoleArn?: string;
  environmentRolePermissionBoundary?: string;
  manageAccessRoleArn?: string;
  enabledRegions?: EnabledRegionList;
  regionalParameters?: RegionalParameterMap;
  createdAt?: Date;
  updatedAt?: Date;
  provisioningConfigurations?: ProvisioningConfigurationList;
}
export const PutEnvironmentBlueprintConfigurationOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    environmentBlueprintId: S.String,
    provisioningRoleArn: S.optional(S.String),
    environmentRolePermissionBoundary: S.optional(S.String),
    manageAccessRoleArn: S.optional(S.String),
    enabledRegions: S.optional(EnabledRegionList),
    regionalParameters: S.optional(RegionalParameterMap),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    provisioningConfigurations: S.optional(ProvisioningConfigurationList),
  }),
).annotations({
  identifier: "PutEnvironmentBlueprintConfigurationOutput",
}) as any as S.Schema<PutEnvironmentBlueprintConfigurationOutput>;
export interface CreateRuleInput {
  domainIdentifier: string;
  name: string | Redacted.Redacted<string>;
  target: (typeof RuleTarget)["Type"];
  action: string;
  scope: RuleScope;
  detail: (typeof RuleDetail)["Type"];
  description?: string | Redacted.Redacted<string>;
  clientToken?: string;
}
export const CreateRuleInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    name: SensitiveString,
    target: RuleTarget,
    action: S.String,
    scope: RuleScope,
    detail: RuleDetail,
    description: S.optional(SensitiveString),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/domains/{domainIdentifier}/rules" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRuleInput",
}) as any as S.Schema<CreateRuleInput>;
export interface RedshiftPropertiesInput {
  storage?: (typeof RedshiftStorageProperties)["Type"];
  databaseName?: string;
  host?: string;
  port?: number;
  credentials?: (typeof RedshiftCredentials)["Type"];
  lineageSync?: RedshiftLineageSyncConfigurationInput;
}
export const RedshiftPropertiesInput = S.suspend(() =>
  S.Struct({
    storage: S.optional(RedshiftStorageProperties),
    databaseName: S.optional(S.String),
    host: S.optional(S.String),
    port: S.optional(S.Number),
    credentials: S.optional(RedshiftCredentials),
    lineageSync: S.optional(RedshiftLineageSyncConfigurationInput),
  }),
).annotations({
  identifier: "RedshiftPropertiesInput",
}) as any as S.Schema<RedshiftPropertiesInput>;
export interface LineageRunDetails {
  sqlQueryRunDetails?: LineageSqlQueryRunDetails;
}
export const LineageRunDetails = S.suspend(() =>
  S.Struct({ sqlQueryRunDetails: S.optional(LineageSqlQueryRunDetails) }),
).annotations({
  identifier: "LineageRunDetails",
}) as any as S.Schema<LineageRunDetails>;
export interface Topic {
  subject: string;
  resource: NotificationResource;
  role: string;
}
export const Topic = S.suspend(() =>
  S.Struct({
    subject: S.String,
    resource: NotificationResource,
    role: S.String,
  }),
).annotations({ identifier: "Topic" }) as any as S.Schema<Topic>;
export type MemberDetails = { user: UserDetails } | { group: GroupDetails };
export const MemberDetails = S.Union(
  S.Struct({ user: UserDetails }),
  S.Struct({ group: GroupDetails }),
);
export interface AggregationOutputItem {
  value?: string;
  count?: number;
  displayValue?: string;
}
export const AggregationOutputItem = S.suspend(() =>
  S.Struct({
    value: S.optional(S.String),
    count: S.optional(S.Number),
    displayValue: S.optional(S.String),
  }),
).annotations({
  identifier: "AggregationOutputItem",
}) as any as S.Schema<AggregationOutputItem>;
export type AggregationOutputItems = AggregationOutputItem[];
export const AggregationOutputItems = S.Array(AggregationOutputItem);
export interface GluePropertiesPatch {
  glueConnectionInput?: GlueConnectionPatch;
}
export const GluePropertiesPatch = S.suspend(() =>
  S.Struct({ glueConnectionInput: S.optional(GlueConnectionPatch) }),
).annotations({
  identifier: "GluePropertiesPatch",
}) as any as S.Schema<GluePropertiesPatch>;
export interface AssetListing {
  assetId?: string;
  assetRevision?: string;
  assetType?: string;
  createdAt?: Date;
  forms?: string;
  latestTimeSeriesDataPointForms?: TimeSeriesDataPointSummaryFormOutputList;
  glossaryTerms?: DetailedGlossaryTerms;
  governedGlossaryTerms?: DetailedGlossaryTerms;
  owningProjectId?: string;
}
export const AssetListing = S.suspend(() =>
  S.Struct({
    assetId: S.optional(S.String),
    assetRevision: S.optional(S.String),
    assetType: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    forms: S.optional(S.String),
    latestTimeSeriesDataPointForms: S.optional(
      TimeSeriesDataPointSummaryFormOutputList,
    ),
    glossaryTerms: S.optional(DetailedGlossaryTerms),
    governedGlossaryTerms: S.optional(DetailedGlossaryTerms),
    owningProjectId: S.optional(S.String),
  }),
).annotations({ identifier: "AssetListing" }) as any as S.Schema<AssetListing>;
export interface DataProductListing {
  dataProductId?: string;
  dataProductRevision?: string;
  createdAt?: Date;
  forms?: string;
  glossaryTerms?: DetailedGlossaryTerms;
  owningProjectId?: string;
  items?: ListingSummaries;
}
export const DataProductListing = S.suspend(() =>
  S.Struct({
    dataProductId: S.optional(S.String),
    dataProductRevision: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    forms: S.optional(S.String),
    glossaryTerms: S.optional(DetailedGlossaryTerms),
    owningProjectId: S.optional(S.String),
    items: S.optional(ListingSummaries),
  }),
).annotations({
  identifier: "DataProductListing",
}) as any as S.Schema<DataProductListing>;
export type JobRunDetails = { lineageRunDetails: LineageRunDetails };
export const JobRunDetails = S.Union(
  S.Struct({ lineageRunDetails: LineageRunDetails }),
);
export interface NotificationOutput {
  identifier: string;
  domainIdentifier: string;
  type: string;
  topic: Topic;
  title: string | Redacted.Redacted<string>;
  message: string | Redacted.Redacted<string>;
  status?: string;
  actionLink: string | Redacted.Redacted<string>;
  creationTimestamp: Date;
  lastUpdatedTimestamp: Date;
  metadata?: MetadataMap;
}
export const NotificationOutput = S.suspend(() =>
  S.Struct({
    identifier: S.String,
    domainIdentifier: S.String,
    type: S.String,
    topic: Topic,
    title: SensitiveString,
    message: SensitiveString,
    status: S.optional(S.String),
    actionLink: SensitiveString,
    creationTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    metadata: S.optional(MetadataMap),
  }),
).annotations({
  identifier: "NotificationOutput",
}) as any as S.Schema<NotificationOutput>;
export type NotificationsList = NotificationOutput[];
export const NotificationsList = S.Array(NotificationOutput);
export interface ProjectMember {
  memberDetails: (typeof MemberDetails)["Type"];
  designation: string;
}
export const ProjectMember = S.suspend(() =>
  S.Struct({ memberDetails: MemberDetails, designation: S.String }),
).annotations({
  identifier: "ProjectMember",
}) as any as S.Schema<ProjectMember>;
export type ProjectMembers = ProjectMember[];
export const ProjectMembers = S.Array(ProjectMember);
export interface AggregationOutput {
  attribute?: string;
  displayValue?: string;
  items?: AggregationOutputItems;
}
export const AggregationOutput = S.suspend(() =>
  S.Struct({
    attribute: S.optional(S.String),
    displayValue: S.optional(S.String),
    items: S.optional(AggregationOutputItems),
  }),
).annotations({
  identifier: "AggregationOutput",
}) as any as S.Schema<AggregationOutput>;
export type AggregationOutputList = AggregationOutput[];
export const AggregationOutputList = S.Array(AggregationOutput);
export type ConnectionPropertiesPatch =
  | { athenaProperties: AthenaPropertiesPatch }
  | { glueProperties: GluePropertiesPatch }
  | { iamProperties: IamPropertiesPatch }
  | { redshiftProperties: RedshiftPropertiesPatch }
  | { sparkEmrProperties: SparkEmrPropertiesPatch }
  | { s3Properties: S3PropertiesPatch }
  | { amazonQProperties: AmazonQPropertiesPatch }
  | { mlflowProperties: MlflowPropertiesPatch };
export const ConnectionPropertiesPatch = S.Union(
  S.Struct({ athenaProperties: AthenaPropertiesPatch }),
  S.Struct({ glueProperties: GluePropertiesPatch }),
  S.Struct({ iamProperties: IamPropertiesPatch }),
  S.Struct({ redshiftProperties: RedshiftPropertiesPatch }),
  S.Struct({ sparkEmrProperties: SparkEmrPropertiesPatch }),
  S.Struct({ s3Properties: S3PropertiesPatch }),
  S.Struct({ amazonQProperties: AmazonQPropertiesPatch }),
  S.Struct({ mlflowProperties: MlflowPropertiesPatch }),
);
export type ListingItem =
  | { assetListing: AssetListing }
  | { dataProductListing: DataProductListing };
export const ListingItem = S.Union(
  S.Struct({ assetListing: AssetListing }),
  S.Struct({ dataProductListing: DataProductListing }),
);
export interface OpenLineageRunEventSummary {
  eventType?: string;
  runId?: string;
  job?: NameIdentifier;
  inputs?: NameIdentifiers;
  outputs?: NameIdentifiers;
}
export const OpenLineageRunEventSummary = S.suspend(() =>
  S.Struct({
    eventType: S.optional(S.String),
    runId: S.optional(S.String),
    job: S.optional(NameIdentifier),
    inputs: S.optional(NameIdentifiers),
    outputs: S.optional(NameIdentifiers),
  }),
).annotations({
  identifier: "OpenLineageRunEventSummary",
}) as any as S.Schema<OpenLineageRunEventSummary>;
export interface MatchOffset {
  startOffset?: number;
  endOffset?: number;
}
export const MatchOffset = S.suspend(() =>
  S.Struct({
    startOffset: S.optional(S.Number),
    endOffset: S.optional(S.Number),
  }),
).annotations({ identifier: "MatchOffset" }) as any as S.Schema<MatchOffset>;
export type MatchOffsets = MatchOffset[];
export const MatchOffsets = S.Array(MatchOffset);
export interface TextMatchItem {
  attribute?: string;
  text?: string;
  matchOffsets?: MatchOffsets;
}
export const TextMatchItem = S.suspend(() =>
  S.Struct({
    attribute: S.optional(S.String),
    text: S.optional(S.String),
    matchOffsets: S.optional(MatchOffsets),
  }),
).annotations({
  identifier: "TextMatchItem",
}) as any as S.Schema<TextMatchItem>;
export type TextMatches = TextMatchItem[];
export const TextMatches = S.Array(TextMatchItem);
export type MatchRationaleItem = { textMatches: TextMatches };
export const MatchRationaleItem = S.Union(
  S.Struct({ textMatches: TextMatches }),
);
export type MatchRationale = (typeof MatchRationaleItem)["Type"][];
export const MatchRationale = S.Array(MatchRationaleItem);
export interface DataProductListingItemAdditionalAttributes {
  forms?: string;
  matchRationale?: MatchRationale;
}
export const DataProductListingItemAdditionalAttributes = S.suspend(() =>
  S.Struct({
    forms: S.optional(S.String),
    matchRationale: S.optional(MatchRationale),
  }),
).annotations({
  identifier: "DataProductListingItemAdditionalAttributes",
}) as any as S.Schema<DataProductListingItemAdditionalAttributes>;
export interface ListingSummaryItem {
  listingId?: string;
  listingRevision?: string;
  glossaryTerms?: DetailedGlossaryTerms;
}
export const ListingSummaryItem = S.suspend(() =>
  S.Struct({
    listingId: S.optional(S.String),
    listingRevision: S.optional(S.String),
    glossaryTerms: S.optional(DetailedGlossaryTerms),
  }),
).annotations({
  identifier: "ListingSummaryItem",
}) as any as S.Schema<ListingSummaryItem>;
export type ListingSummaryItems = ListingSummaryItem[];
export const ListingSummaryItems = S.Array(ListingSummaryItem);
export interface AddPolicyGrantInput {
  domainIdentifier: string;
  entityType: string;
  entityIdentifier: string;
  policyType: string;
  principal: (typeof PolicyGrantPrincipal)["Type"];
  detail: (typeof PolicyGrantDetail)["Type"];
  clientToken?: string;
}
export const AddPolicyGrantInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    entityType: S.String.pipe(T.HttpLabel("entityType")),
    entityIdentifier: S.String.pipe(T.HttpLabel("entityIdentifier")),
    policyType: S.String,
    principal: PolicyGrantPrincipal,
    detail: PolicyGrantDetail,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/policies/managed/{entityType}/{entityIdentifier}/addGrant",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddPolicyGrantInput",
}) as any as S.Schema<AddPolicyGrantInput>;
export interface CreateProjectProfileOutput {
  domainId: string;
  id: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  status?: string;
  projectResourceTags?: ProjectResourceTagParameters;
  allowCustomProjectResourceTags?: boolean;
  projectResourceTagsDescription?: string | Redacted.Redacted<string>;
  environmentConfigurations?: EnvironmentConfigurationsList;
  createdBy: string;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  domainUnitId?: string;
}
export const CreateProjectProfileOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    id: S.String,
    name: SensitiveString,
    description: S.optional(SensitiveString),
    status: S.optional(S.String),
    projectResourceTags: S.optional(ProjectResourceTagParameters),
    allowCustomProjectResourceTags: S.optional(S.Boolean),
    projectResourceTagsDescription: S.optional(SensitiveString),
    environmentConfigurations: S.optional(EnvironmentConfigurationsList),
    createdBy: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    domainUnitId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateProjectProfileOutput",
}) as any as S.Schema<CreateProjectProfileOutput>;
export interface GetConnectionOutput {
  connectionCredentials?: ConnectionCredentials;
  connectionId: string;
  description?: string | Redacted.Redacted<string>;
  domainId: string;
  domainUnitId: string;
  environmentId?: string;
  environmentUserRole?: string;
  name: string;
  physicalEndpoints: PhysicalEndpoints;
  projectId?: string;
  props?: (typeof ConnectionPropertiesOutput)["Type"];
  type: string;
  scope?: string;
}
export const GetConnectionOutput = S.suspend(() =>
  S.Struct({
    connectionCredentials: S.optional(ConnectionCredentials),
    connectionId: S.String,
    description: S.optional(SensitiveString),
    domainId: S.String,
    domainUnitId: S.String,
    environmentId: S.optional(S.String),
    environmentUserRole: S.optional(S.String),
    name: S.String,
    physicalEndpoints: PhysicalEndpoints,
    projectId: S.optional(S.String),
    props: S.optional(ConnectionPropertiesOutput),
    type: S.String,
    scope: S.optional(S.String),
  }),
).annotations({
  identifier: "GetConnectionOutput",
}) as any as S.Schema<GetConnectionOutput>;
export interface GetJobRunOutput {
  domainId?: string;
  id?: string;
  jobId?: string;
  jobType?: string;
  runMode?: string;
  details?: (typeof JobRunDetails)["Type"];
  status?: string;
  error?: JobRunError;
  createdBy?: string;
  createdAt?: Date;
  startTime?: Date;
  endTime?: Date;
}
export const GetJobRunOutput = S.suspend(() =>
  S.Struct({
    domainId: S.optional(S.String),
    id: S.optional(S.String),
    jobId: S.optional(S.String),
    jobType: S.optional(S.String),
    runMode: S.optional(S.String),
    details: S.optional(JobRunDetails),
    status: S.optional(S.String),
    error: S.optional(JobRunError),
    createdBy: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetJobRunOutput",
}) as any as S.Schema<GetJobRunOutput>;
export interface ListNotificationsOutput {
  notifications?: NotificationsList;
  nextToken?: string;
}
export const ListNotificationsOutput = S.suspend(() =>
  S.Struct({
    notifications: S.optional(NotificationsList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListNotificationsOutput",
}) as any as S.Schema<ListNotificationsOutput>;
export interface ListProjectMembershipsOutput {
  members: ProjectMembers;
  nextToken?: string;
}
export const ListProjectMembershipsOutput = S.suspend(() =>
  S.Struct({ members: ProjectMembers, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListProjectMembershipsOutput",
}) as any as S.Schema<ListProjectMembershipsOutput>;
export interface UpdateConnectionInput {
  domainIdentifier: string;
  identifier: string;
  description?: string | Redacted.Redacted<string>;
  awsLocation?: AwsLocation;
  props?: (typeof ConnectionPropertiesPatch)["Type"];
}
export const UpdateConnectionInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    identifier: S.String.pipe(T.HttpLabel("identifier")),
    description: S.optional(SensitiveString),
    awsLocation: S.optional(AwsLocation),
    props: S.optional(ConnectionPropertiesPatch),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/v2/domains/{domainIdentifier}/connections/{identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConnectionInput",
}) as any as S.Schema<UpdateConnectionInput>;
export interface UpdateProjectOutput {
  domainId: string;
  id: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  projectStatus?: string;
  failureReasons?: FailureReasons;
  createdBy: string;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  resourceTags?: ResourceTags;
  glossaryTerms?: GlossaryTerms;
  domainUnitId?: string;
  projectProfileId?: string;
  userParameters?: EnvironmentConfigurationUserParametersList;
  environmentDeploymentDetails?: EnvironmentDeploymentDetails;
}
export const UpdateProjectOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    id: S.String,
    name: SensitiveString,
    description: S.optional(SensitiveString),
    projectStatus: S.optional(S.String),
    failureReasons: S.optional(FailureReasons),
    createdBy: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    resourceTags: S.optional(ResourceTags),
    glossaryTerms: S.optional(GlossaryTerms),
    domainUnitId: S.optional(S.String),
    projectProfileId: S.optional(S.String),
    userParameters: S.optional(EnvironmentConfigurationUserParametersList),
    environmentDeploymentDetails: S.optional(EnvironmentDeploymentDetails),
  }),
).annotations({
  identifier: "UpdateProjectOutput",
}) as any as S.Schema<UpdateProjectOutput>;
export interface CreateDataSourceInput {
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  domainIdentifier: string;
  projectIdentifier: string;
  environmentIdentifier?: string;
  connectionIdentifier?: string;
  type: string;
  configuration?: (typeof DataSourceConfigurationInput)["Type"];
  recommendation?: RecommendationConfiguration;
  enableSetting?: string;
  schedule?: ScheduleConfiguration;
  publishOnImport?: boolean;
  assetFormsInput?: FormInputList;
  clientToken?: string;
}
export const CreateDataSourceInput = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    description: S.optional(SensitiveString),
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    projectIdentifier: S.String,
    environmentIdentifier: S.optional(S.String),
    connectionIdentifier: S.optional(S.String),
    type: S.String,
    configuration: S.optional(DataSourceConfigurationInput),
    recommendation: S.optional(RecommendationConfiguration),
    enableSetting: S.optional(S.String),
    schedule: S.optional(ScheduleConfiguration),
    publishOnImport: S.optional(S.Boolean),
    assetFormsInput: S.optional(FormInputList),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/data-sources",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDataSourceInput",
}) as any as S.Schema<CreateDataSourceInput>;
export interface GetDataSourceOutput {
  id: string;
  status?: string;
  type?: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  domainId: string;
  projectId: string;
  environmentId?: string;
  connectionId?: string;
  configuration?: (typeof DataSourceConfigurationOutput)["Type"];
  recommendation?: RecommendationConfiguration;
  enableSetting?: string;
  publishOnImport?: boolean;
  assetFormsOutput?: FormOutputList;
  schedule?: ScheduleConfiguration;
  lastRunStatus?: string;
  lastRunAt?: Date;
  lastRunErrorMessage?: DataSourceErrorMessage;
  lastRunAssetCount?: number;
  errorMessage?: DataSourceErrorMessage;
  createdAt?: Date;
  updatedAt?: Date;
  selfGrantStatus?: (typeof SelfGrantStatusOutput)["Type"];
}
export const GetDataSourceOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    status: S.optional(S.String),
    type: S.optional(S.String),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    domainId: S.String,
    projectId: S.String,
    environmentId: S.optional(S.String),
    connectionId: S.optional(S.String),
    configuration: S.optional(DataSourceConfigurationOutput),
    recommendation: S.optional(RecommendationConfiguration),
    enableSetting: S.optional(S.String),
    publishOnImport: S.optional(S.Boolean),
    assetFormsOutput: S.optional(FormOutputList),
    schedule: S.optional(ScheduleConfiguration),
    lastRunStatus: S.optional(S.String),
    lastRunAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastRunErrorMessage: S.optional(DataSourceErrorMessage),
    lastRunAssetCount: S.optional(S.Number),
    errorMessage: S.optional(DataSourceErrorMessage),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    selfGrantStatus: S.optional(SelfGrantStatusOutput),
  }),
).annotations({
  identifier: "GetDataSourceOutput",
}) as any as S.Schema<GetDataSourceOutput>;
export interface GetListingOutput {
  domainId: string;
  id: string;
  listingRevision: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  item?: (typeof ListingItem)["Type"];
  name?: string;
  description?: string | Redacted.Redacted<string>;
  status?: string;
}
export const GetListingOutput = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    id: S.String,
    listingRevision: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    updatedBy: S.optional(S.String),
    item: S.optional(ListingItem),
    name: S.optional(S.String),
    description: S.optional(SensitiveString),
    status: S.optional(S.String),
  }),
).annotations({
  identifier: "GetListingOutput",
}) as any as S.Schema<GetListingOutput>;
export interface CreateRuleOutput {
  identifier: string;
  name: string | Redacted.Redacted<string>;
  ruleType: string;
  target: (typeof RuleTarget)["Type"];
  action: string;
  scope: RuleScope;
  detail: (typeof RuleDetail)["Type"];
  targetType?: string;
  description?: string | Redacted.Redacted<string>;
  createdAt: Date;
  createdBy: string;
}
export const CreateRuleOutput = S.suspend(() =>
  S.Struct({
    identifier: S.String,
    name: SensitiveString,
    ruleType: S.String,
    target: RuleTarget,
    action: S.String,
    scope: RuleScope,
    detail: RuleDetail,
    targetType: S.optional(S.String),
    description: S.optional(SensitiveString),
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    createdBy: S.String,
  }),
).annotations({
  identifier: "CreateRuleOutput",
}) as any as S.Schema<CreateRuleOutput>;
export type EventSummary = {
  openLineageRunEventSummary: OpenLineageRunEventSummary;
};
export const EventSummary = S.Union(
  S.Struct({ openLineageRunEventSummary: OpenLineageRunEventSummary }),
);
export interface DataProductListingItem {
  listingId?: string;
  listingRevision?: string;
  name?: string | Redacted.Redacted<string>;
  entityId?: string;
  entityRevision?: string;
  description?: string | Redacted.Redacted<string>;
  createdAt?: Date;
  listingCreatedBy?: string;
  listingUpdatedBy?: string;
  glossaryTerms?: DetailedGlossaryTerms;
  owningProjectId?: string;
  additionalAttributes?: DataProductListingItemAdditionalAttributes;
  items?: ListingSummaryItems;
}
export const DataProductListingItem = S.suspend(() =>
  S.Struct({
    listingId: S.optional(S.String),
    listingRevision: S.optional(S.String),
    name: S.optional(SensitiveString),
    entityId: S.optional(S.String),
    entityRevision: S.optional(S.String),
    description: S.optional(SensitiveString),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    listingCreatedBy: S.optional(S.String),
    listingUpdatedBy: S.optional(S.String),
    glossaryTerms: S.optional(DetailedGlossaryTerms),
    owningProjectId: S.optional(S.String),
    additionalAttributes: S.optional(
      DataProductListingItemAdditionalAttributes,
    ),
    items: S.optional(ListingSummaryItems),
  }),
).annotations({
  identifier: "DataProductListingItem",
}) as any as S.Schema<DataProductListingItem>;
export interface AuthenticationConfigurationInput {
  authenticationType?: string;
  oAuth2Properties?: OAuth2Properties;
  secretArn?: string;
  kmsKeyArn?: string;
  basicAuthenticationCredentials?: BasicAuthenticationCredentials;
  customAuthenticationCredentials?: CredentialMap;
}
export const AuthenticationConfigurationInput = S.suspend(() =>
  S.Struct({
    authenticationType: S.optional(S.String),
    oAuth2Properties: S.optional(OAuth2Properties),
    secretArn: S.optional(S.String),
    kmsKeyArn: S.optional(S.String),
    basicAuthenticationCredentials: S.optional(BasicAuthenticationCredentials),
    customAuthenticationCredentials: S.optional(CredentialMap),
  }),
).annotations({
  identifier: "AuthenticationConfigurationInput",
}) as any as S.Schema<AuthenticationConfigurationInput>;
export interface LineageEventSummary {
  id?: string;
  domainId?: string;
  processingStatus?: string;
  eventTime?: Date;
  eventSummary?: (typeof EventSummary)["Type"];
  createdBy?: string;
  createdAt?: Date;
}
export const LineageEventSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    domainId: S.optional(S.String),
    processingStatus: S.optional(S.String),
    eventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    eventSummary: S.optional(EventSummary),
    createdBy: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "LineageEventSummary",
}) as any as S.Schema<LineageEventSummary>;
export type LineageEventSummaries = LineageEventSummary[];
export const LineageEventSummaries = S.Array(LineageEventSummary);
export interface GlueConnectionInput {
  connectionProperties?: ConnectionProperties;
  physicalConnectionRequirements?: PhysicalConnectionRequirements;
  name?: string;
  description?: string;
  connectionType?: string;
  matchCriteria?: string;
  validateCredentials?: boolean;
  validateForComputeEnvironments?: ComputeEnvironmentsList;
  sparkProperties?: PropertyMap;
  athenaProperties?: PropertyMap;
  pythonProperties?: PropertyMap;
  authenticationConfiguration?: AuthenticationConfigurationInput;
}
export const GlueConnectionInput = S.suspend(() =>
  S.Struct({
    connectionProperties: S.optional(ConnectionProperties),
    physicalConnectionRequirements: S.optional(PhysicalConnectionRequirements),
    name: S.optional(S.String),
    description: S.optional(S.String),
    connectionType: S.optional(S.String),
    matchCriteria: S.optional(S.String),
    validateCredentials: S.optional(S.Boolean),
    validateForComputeEnvironments: S.optional(ComputeEnvironmentsList),
    sparkProperties: S.optional(PropertyMap),
    athenaProperties: S.optional(PropertyMap),
    pythonProperties: S.optional(PropertyMap),
    authenticationConfiguration: S.optional(AuthenticationConfigurationInput),
  }),
).annotations({
  identifier: "GlueConnectionInput",
}) as any as S.Schema<GlueConnectionInput>;
export interface GlossaryItemAdditionalAttributes {
  matchRationale?: MatchRationale;
}
export const GlossaryItemAdditionalAttributes = S.suspend(() =>
  S.Struct({ matchRationale: S.optional(MatchRationale) }),
).annotations({
  identifier: "GlossaryItemAdditionalAttributes",
}) as any as S.Schema<GlossaryItemAdditionalAttributes>;
export interface GlossaryTermItemAdditionalAttributes {
  matchRationale?: MatchRationale;
}
export const GlossaryTermItemAdditionalAttributes = S.suspend(() =>
  S.Struct({ matchRationale: S.optional(MatchRationale) }),
).annotations({
  identifier: "GlossaryTermItemAdditionalAttributes",
}) as any as S.Schema<GlossaryTermItemAdditionalAttributes>;
export interface AssetItemAdditionalAttributes {
  formsOutput?: FormOutputList;
  readOnlyFormsOutput?: FormOutputList;
  latestTimeSeriesDataPointFormsOutput?: TimeSeriesDataPointSummaryFormOutputList;
  matchRationale?: MatchRationale;
}
export const AssetItemAdditionalAttributes = S.suspend(() =>
  S.Struct({
    formsOutput: S.optional(FormOutputList),
    readOnlyFormsOutput: S.optional(FormOutputList),
    latestTimeSeriesDataPointFormsOutput: S.optional(
      TimeSeriesDataPointSummaryFormOutputList,
    ),
    matchRationale: S.optional(MatchRationale),
  }),
).annotations({
  identifier: "AssetItemAdditionalAttributes",
}) as any as S.Schema<AssetItemAdditionalAttributes>;
export interface DataProductItemAdditionalAttributes {
  matchRationale?: MatchRationale;
}
export const DataProductItemAdditionalAttributes = S.suspend(() =>
  S.Struct({ matchRationale: S.optional(MatchRationale) }),
).annotations({
  identifier: "DataProductItemAdditionalAttributes",
}) as any as S.Schema<DataProductItemAdditionalAttributes>;
export interface AddPolicyGrantOutput {
  grantId?: string;
}
export const AddPolicyGrantOutput = S.suspend(() =>
  S.Struct({ grantId: S.optional(S.String) }),
).annotations({
  identifier: "AddPolicyGrantOutput",
}) as any as S.Schema<AddPolicyGrantOutput>;
export interface CancelSubscriptionOutput {
  id: string;
  createdBy: string;
  updatedBy?: string;
  domainId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  subscribedPrincipal: (typeof SubscribedPrincipal)["Type"];
  subscribedListing: SubscribedListing;
  subscriptionRequestId?: string;
  retainPermissions?: boolean;
}
export const CancelSubscriptionOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    createdBy: S.String,
    updatedBy: S.optional(S.String),
    domainId: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    subscribedPrincipal: SubscribedPrincipal,
    subscribedListing: SubscribedListing,
    subscriptionRequestId: S.optional(S.String),
    retainPermissions: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CancelSubscriptionOutput",
}) as any as S.Schema<CancelSubscriptionOutput>;
export interface CreateAssetFilterInput {
  domainIdentifier: string;
  assetIdentifier: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  configuration: (typeof AssetFilterConfiguration)["Type"];
  clientToken?: string;
}
export const CreateAssetFilterInput = S.suspend(() =>
  S.Struct({
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    assetIdentifier: S.String.pipe(T.HttpLabel("assetIdentifier")),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    configuration: AssetFilterConfiguration,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/assets/{assetIdentifier}/filters",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAssetFilterInput",
}) as any as S.Schema<CreateAssetFilterInput>;
export interface ListLineageEventsOutput {
  items?: LineageEventSummaries;
  nextToken?: string;
}
export const ListLineageEventsOutput = S.suspend(() =>
  S.Struct({
    items: S.optional(LineageEventSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLineageEventsOutput",
}) as any as S.Schema<ListLineageEventsOutput>;
export interface UpdateConnectionOutput {
  connectionId: string;
  description?: string | Redacted.Redacted<string>;
  domainId: string;
  domainUnitId: string;
  environmentId?: string;
  name: string;
  physicalEndpoints: PhysicalEndpoints;
  projectId?: string;
  props?: (typeof ConnectionPropertiesOutput)["Type"];
  type: string;
  scope?: string;
}
export const UpdateConnectionOutput = S.suspend(() =>
  S.Struct({
    connectionId: S.String,
    description: S.optional(SensitiveString),
    domainId: S.String,
    domainUnitId: S.String,
    environmentId: S.optional(S.String),
    name: S.String,
    physicalEndpoints: PhysicalEndpoints,
    projectId: S.optional(S.String),
    props: S.optional(ConnectionPropertiesOutput),
    type: S.String,
    scope: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateConnectionOutput",
}) as any as S.Schema<UpdateConnectionOutput>;
export interface CreateDataSourceOutput {
  id: string;
  status?: string;
  type?: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  domainId: string;
  projectId: string;
  environmentId?: string;
  connectionId?: string;
  configuration?: (typeof DataSourceConfigurationOutput)["Type"];
  recommendation?: RecommendationConfiguration;
  enableSetting?: string;
  publishOnImport?: boolean;
  assetFormsOutput?: FormOutputList;
  schedule?: ScheduleConfiguration;
  lastRunStatus?: string;
  lastRunAt?: Date;
  lastRunErrorMessage?: DataSourceErrorMessage;
  errorMessage?: DataSourceErrorMessage;
  createdAt?: Date;
  updatedAt?: Date;
}
export const CreateDataSourceOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    status: S.optional(S.String),
    type: S.optional(S.String),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    domainId: S.String,
    projectId: S.String,
    environmentId: S.optional(S.String),
    connectionId: S.optional(S.String),
    configuration: S.optional(DataSourceConfigurationOutput),
    recommendation: S.optional(RecommendationConfiguration),
    enableSetting: S.optional(S.String),
    publishOnImport: S.optional(S.Boolean),
    assetFormsOutput: S.optional(FormOutputList),
    schedule: S.optional(ScheduleConfiguration),
    lastRunStatus: S.optional(S.String),
    lastRunAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastRunErrorMessage: S.optional(DataSourceErrorMessage),
    errorMessage: S.optional(DataSourceErrorMessage),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "CreateDataSourceOutput",
}) as any as S.Schema<CreateDataSourceOutput>;
export interface GluePropertiesInput {
  glueConnectionInput?: GlueConnectionInput;
}
export const GluePropertiesInput = S.suspend(() =>
  S.Struct({ glueConnectionInput: S.optional(GlueConnectionInput) }),
).annotations({
  identifier: "GluePropertiesInput",
}) as any as S.Schema<GluePropertiesInput>;
export interface GlossaryItem {
  domainId: string;
  id: string;
  name: string | Redacted.Redacted<string>;
  owningProjectId: string;
  description?: string | Redacted.Redacted<string>;
  status: string;
  usageRestrictions?: GlossaryUsageRestrictions;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  additionalAttributes?: GlossaryItemAdditionalAttributes;
}
export const GlossaryItem = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    id: S.String,
    name: SensitiveString,
    owningProjectId: S.String,
    description: S.optional(SensitiveString),
    status: S.String,
    usageRestrictions: S.optional(GlossaryUsageRestrictions),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedBy: S.optional(S.String),
    additionalAttributes: S.optional(GlossaryItemAdditionalAttributes),
  }),
).annotations({ identifier: "GlossaryItem" }) as any as S.Schema<GlossaryItem>;
export interface GlossaryTermItem {
  domainId: string;
  glossaryId: string;
  id: string;
  name: string | Redacted.Redacted<string>;
  shortDescription?: string | Redacted.Redacted<string>;
  usageRestrictions?: GlossaryUsageRestrictions;
  longDescription?: string | Redacted.Redacted<string>;
  termRelations?: TermRelations;
  status: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  additionalAttributes?: GlossaryTermItemAdditionalAttributes;
}
export const GlossaryTermItem = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    glossaryId: S.String,
    id: S.String,
    name: SensitiveString,
    shortDescription: S.optional(SensitiveString),
    usageRestrictions: S.optional(GlossaryUsageRestrictions),
    longDescription: S.optional(SensitiveString),
    termRelations: S.optional(TermRelations),
    status: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedBy: S.optional(S.String),
    additionalAttributes: S.optional(GlossaryTermItemAdditionalAttributes),
  }),
).annotations({
  identifier: "GlossaryTermItem",
}) as any as S.Schema<GlossaryTermItem>;
export interface AssetItem {
  domainId: string;
  identifier: string;
  name: string | Redacted.Redacted<string>;
  typeIdentifier: string;
  typeRevision: string;
  externalIdentifier?: string;
  description?: string | Redacted.Redacted<string>;
  createdAt?: Date;
  createdBy?: string;
  firstRevisionCreatedAt?: Date;
  firstRevisionCreatedBy?: string;
  glossaryTerms?: GlossaryTerms;
  owningProjectId: string;
  additionalAttributes?: AssetItemAdditionalAttributes;
  governedGlossaryTerms?: GovernedGlossaryTerms;
}
export const AssetItem = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    identifier: S.String,
    name: SensitiveString,
    typeIdentifier: S.String,
    typeRevision: S.String,
    externalIdentifier: S.optional(S.String),
    description: S.optional(SensitiveString),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    firstRevisionCreatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    firstRevisionCreatedBy: S.optional(S.String),
    glossaryTerms: S.optional(GlossaryTerms),
    owningProjectId: S.String,
    additionalAttributes: S.optional(AssetItemAdditionalAttributes),
    governedGlossaryTerms: S.optional(GovernedGlossaryTerms),
  }),
).annotations({ identifier: "AssetItem" }) as any as S.Schema<AssetItem>;
export interface DataProductResultItem {
  domainId: string;
  id: string;
  name: string | Redacted.Redacted<string>;
  owningProjectId: string;
  description?: string | Redacted.Redacted<string>;
  glossaryTerms?: GlossaryTerms;
  createdAt?: Date;
  createdBy?: string;
  firstRevisionCreatedAt?: Date;
  firstRevisionCreatedBy?: string;
  additionalAttributes?: DataProductItemAdditionalAttributes;
}
export const DataProductResultItem = S.suspend(() =>
  S.Struct({
    domainId: S.String,
    id: S.String,
    name: SensitiveString,
    owningProjectId: S.String,
    description: S.optional(SensitiveString),
    glossaryTerms: S.optional(GlossaryTerms),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    firstRevisionCreatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    firstRevisionCreatedBy: S.optional(S.String),
    additionalAttributes: S.optional(DataProductItemAdditionalAttributes),
  }),
).annotations({
  identifier: "DataProductResultItem",
}) as any as S.Schema<DataProductResultItem>;
export type ConnectionPropertiesInput =
  | { athenaProperties: AthenaPropertiesInput }
  | { glueProperties: GluePropertiesInput }
  | { hyperPodProperties: HyperPodPropertiesInput }
  | { iamProperties: IamPropertiesInput }
  | { redshiftProperties: RedshiftPropertiesInput }
  | { sparkEmrProperties: SparkEmrPropertiesInput }
  | { sparkGlueProperties: SparkGluePropertiesInput }
  | { s3Properties: S3PropertiesInput }
  | { amazonQProperties: AmazonQPropertiesInput }
  | { mlflowProperties: MlflowPropertiesInput };
export const ConnectionPropertiesInput = S.Union(
  S.Struct({ athenaProperties: AthenaPropertiesInput }),
  S.Struct({ glueProperties: GluePropertiesInput }),
  S.Struct({ hyperPodProperties: HyperPodPropertiesInput }),
  S.Struct({ iamProperties: IamPropertiesInput }),
  S.Struct({ redshiftProperties: RedshiftPropertiesInput }),
  S.Struct({ sparkEmrProperties: SparkEmrPropertiesInput }),
  S.Struct({ sparkGlueProperties: SparkGluePropertiesInput }),
  S.Struct({ s3Properties: S3PropertiesInput }),
  S.Struct({ amazonQProperties: AmazonQPropertiesInput }),
  S.Struct({ mlflowProperties: MlflowPropertiesInput }),
);
export type SearchInventoryResultItem =
  | { glossaryItem: GlossaryItem }
  | { glossaryTermItem: GlossaryTermItem }
  | { assetItem: AssetItem }
  | { dataProductItem: DataProductResultItem };
export const SearchInventoryResultItem = S.Union(
  S.Struct({ glossaryItem: GlossaryItem }),
  S.Struct({ glossaryTermItem: GlossaryTermItem }),
  S.Struct({ assetItem: AssetItem }),
  S.Struct({ dataProductItem: DataProductResultItem }),
);
export type SearchInventoryResultItems =
  (typeof SearchInventoryResultItem)["Type"][];
export const SearchInventoryResultItems = S.Array(SearchInventoryResultItem);
export interface CreateAssetFilterOutput {
  id: string;
  domainId: string;
  assetId: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  status?: string;
  configuration: (typeof AssetFilterConfiguration)["Type"];
  createdAt?: Date;
  errorMessage?: string;
  effectiveColumnNames?: ColumnNameList;
  effectiveRowFilter?: string;
}
export const CreateAssetFilterOutput = S.suspend(() =>
  S.Struct({
    id: S.String,
    domainId: S.String,
    assetId: S.String,
    name: SensitiveString,
    description: S.optional(SensitiveString),
    status: S.optional(S.String),
    configuration: AssetFilterConfiguration,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    errorMessage: S.optional(S.String),
    effectiveColumnNames: S.optional(ColumnNameList),
    effectiveRowFilter: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateAssetFilterOutput",
}) as any as S.Schema<CreateAssetFilterOutput>;
export interface CreateConnectionInput {
  awsLocation?: AwsLocation;
  clientToken?: string;
  description?: string | Redacted.Redacted<string>;
  domainIdentifier: string;
  environmentIdentifier?: string;
  name: string;
  props?: (typeof ConnectionPropertiesInput)["Type"];
  enableTrustedIdentityPropagation?: boolean;
  scope?: string;
}
export const CreateConnectionInput = S.suspend(() =>
  S.Struct({
    awsLocation: S.optional(AwsLocation),
    clientToken: S.optional(S.String),
    description: S.optional(SensitiveString),
    domainIdentifier: S.String.pipe(T.HttpLabel("domainIdentifier")),
    environmentIdentifier: S.optional(S.String),
    name: S.String,
    props: S.optional(ConnectionPropertiesInput),
    enableTrustedIdentityPropagation: S.optional(S.Boolean),
    scope: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domains/{domainIdentifier}/connections",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConnectionInput",
}) as any as S.Schema<CreateConnectionInput>;
export interface SearchOutput {
  items?: SearchInventoryResultItems;
  nextToken?: string;
  totalMatchCount?: number;
}
export const SearchOutput = S.suspend(() =>
  S.Struct({
    items: S.optional(SearchInventoryResultItems),
    nextToken: S.optional(S.String),
    totalMatchCount: S.optional(S.Number),
  }),
).annotations({ identifier: "SearchOutput" }) as any as S.Schema<SearchOutput>;
export interface AssetListingItemAdditionalAttributes {
  forms?: string;
  matchRationale?: MatchRationale;
  latestTimeSeriesDataPointForms?: TimeSeriesDataPointSummaryFormOutputList;
}
export const AssetListingItemAdditionalAttributes = S.suspend(() =>
  S.Struct({
    forms: S.optional(S.String),
    matchRationale: S.optional(MatchRationale),
    latestTimeSeriesDataPointForms: S.optional(
      TimeSeriesDataPointSummaryFormOutputList,
    ),
  }),
).annotations({
  identifier: "AssetListingItemAdditionalAttributes",
}) as any as S.Schema<AssetListingItemAdditionalAttributes>;
export interface CreateConnectionOutput {
  connectionId: string;
  description?: string | Redacted.Redacted<string>;
  domainId: string;
  domainUnitId: string;
  environmentId?: string;
  name: string;
  physicalEndpoints: PhysicalEndpoints;
  projectId?: string;
  props?: (typeof ConnectionPropertiesOutput)["Type"];
  type: string;
  scope?: string;
}
export const CreateConnectionOutput = S.suspend(() =>
  S.Struct({
    connectionId: S.String,
    description: S.optional(SensitiveString),
    domainId: S.String,
    domainUnitId: S.String,
    environmentId: S.optional(S.String),
    name: S.String,
    physicalEndpoints: PhysicalEndpoints,
    projectId: S.optional(S.String),
    props: S.optional(ConnectionPropertiesOutput),
    type: S.String,
    scope: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateConnectionOutput",
}) as any as S.Schema<CreateConnectionOutput>;
export interface AssetListingItem {
  listingId?: string;
  listingRevision?: string;
  name?: string | Redacted.Redacted<string>;
  entityId?: string;
  entityRevision?: string;
  entityType?: string;
  description?: string | Redacted.Redacted<string>;
  createdAt?: Date;
  listingCreatedBy?: string;
  listingUpdatedBy?: string;
  glossaryTerms?: DetailedGlossaryTerms;
  governedGlossaryTerms?: DetailedGlossaryTerms;
  owningProjectId?: string;
  additionalAttributes?: AssetListingItemAdditionalAttributes;
}
export const AssetListingItem = S.suspend(() =>
  S.Struct({
    listingId: S.optional(S.String),
    listingRevision: S.optional(S.String),
    name: S.optional(SensitiveString),
    entityId: S.optional(S.String),
    entityRevision: S.optional(S.String),
    entityType: S.optional(S.String),
    description: S.optional(SensitiveString),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    listingCreatedBy: S.optional(S.String),
    listingUpdatedBy: S.optional(S.String),
    glossaryTerms: S.optional(DetailedGlossaryTerms),
    governedGlossaryTerms: S.optional(DetailedGlossaryTerms),
    owningProjectId: S.optional(S.String),
    additionalAttributes: S.optional(AssetListingItemAdditionalAttributes),
  }),
).annotations({
  identifier: "AssetListingItem",
}) as any as S.Schema<AssetListingItem>;
export type SearchResultItem =
  | { assetListing: AssetListingItem }
  | { dataProductListing: DataProductListingItem };
export const SearchResultItem = S.Union(
  S.Struct({ assetListing: AssetListingItem }),
  S.Struct({ dataProductListing: DataProductListingItem }),
);
export type SearchResultItems = (typeof SearchResultItem)["Type"][];
export const SearchResultItems = S.Array(SearchResultItem);
export interface SearchListingsOutput {
  items?: SearchResultItems;
  nextToken?: string;
  totalMatchCount?: number;
  aggregates?: AggregationOutputList;
}
export const SearchListingsOutput = S.suspend(() =>
  S.Struct({
    items: S.optional(SearchResultItems),
    nextToken: S.optional(S.String),
    totalMatchCount: S.optional(S.Number),
    aggregates: S.optional(AggregationOutputList),
  }),
).annotations({
  identifier: "SearchListingsOutput",
}) as any as S.Schema<SearchListingsOutput>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
  T.Retryable(),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Deletes the blueprint configuration in Amazon DataZone.
 */
export const deleteEnvironmentBlueprintConfiguration: (
  input: DeleteEnvironmentBlueprintConfigurationInput,
) => Effect.Effect<
  DeleteEnvironmentBlueprintConfigurationOutput,
  | AccessDeniedException
  | InternalServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentBlueprintConfigurationInput,
  output: DeleteEnvironmentBlueprintConfigurationOutput,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
}));
/**
 * Gets the data portal URL for the specified Amazon DataZone domain.
 */
export const getIamPortalLoginUrl: (
  input: GetIamPortalLoginUrlInput,
) => Effect.Effect<
  GetIamPortalLoginUrlOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIamPortalLoginUrlInput,
  output: GetIamPortalLoginUrlOutput,
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
 * Rejects the specified subscription request.
 */
export const rejectSubscriptionRequest: (
  input: RejectSubscriptionRequestInput,
) => Effect.Effect<
  RejectSubscriptionRequestOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectSubscriptionRequestInput,
  output: RejectSubscriptionRequestOutput,
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
 * Revokes a specified subscription in Amazon DataZone.
 */
export const revokeSubscription: (
  input: RevokeSubscriptionInput,
) => Effect.Effect<
  RevokeSubscriptionOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RevokeSubscriptionInput,
  output: RevokeSubscriptionOutput,
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
 * Updates an asset filter.
 *
 * Prerequisites:
 *
 * - The domain, asset, and asset filter identifier must all exist.
 *
 * - The asset must contain the columns being referenced in the update.
 *
 * - If applying a row filter, ensure the column referenced in the expression exists in the asset schema.
 */
export const updateAssetFilter: (
  input: UpdateAssetFilterInput,
) => Effect.Effect<
  UpdateAssetFilterOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAssetFilterInput,
  output: UpdateAssetFilterOutput,
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
 * Updates an environment action.
 */
export const updateEnvironmentAction: (
  input: UpdateEnvironmentActionInput,
) => Effect.Effect<
  UpdateEnvironmentActionOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnvironmentActionInput,
  output: UpdateEnvironmentActionOutput,
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
 * Updates a specified subscription request in Amazon DataZone.
 */
export const updateSubscriptionRequest: (
  input: UpdateSubscriptionRequestInput,
) => Effect.Effect<
  UpdateSubscriptionRequestOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSubscriptionRequestInput,
  output: UpdateSubscriptionRequestOutput,
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
 * Updates the specified subscription target in Amazon DataZone.
 */
export const updateSubscriptionTarget: (
  input: UpdateSubscriptionTargetInput,
) => Effect.Effect<
  UpdateSubscriptionTargetOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSubscriptionTargetInput,
  output: UpdateSubscriptionTargetOutput,
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
 * Creates a revision of the asset.
 *
 * Asset revisions represent new versions of existing assets, capturing changes to either the underlying data or its metadata. They maintain a historical record of how assets evolve over time, who made changes, and when those changes occurred. This versioning capability is crucial for governance and compliance, allowing organizations to track changes, understand their impact, and roll back if necessary.
 *
 * Prerequisites:
 *
 * - Asset must already exist in the domain with identifier.
 *
 * - `formsInput` is required when asset has the form type. `typeRevision` should be the latest version of form type.
 *
 * - The form content must include all required fields (e.g., `bucketArn` for `S3ObjectCollectionForm`).
 *
 * - The owning project of the original asset must still exist and be active.
 *
 * - User must have write access to the project and domain.
 */
export const createAssetRevision: (
  input: CreateAssetRevisionInput,
) => Effect.Effect<
  CreateAssetRevisionOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssetRevisionInput,
  output: CreateAssetRevisionOutput,
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
 * Creates a data product revision.
 *
 * Prerequisites:
 *
 * - The original data product must exist in the given domain.
 *
 * - User must have permissions on the data product.
 *
 * - The domain must be valid and accessible.
 *
 * - The new revision name must comply with naming constraints (if required).
 */
export const createDataProductRevision: (
  input: CreateDataProductRevisionInput,
) => Effect.Effect<
  CreateDataProductRevisionOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataProductRevisionInput,
  output: CreateDataProductRevisionOutput,
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
 * Deletes a Amazon DataZone domain.
 */
export const deleteDomain: (
  input: DeleteDomainInput,
) => Effect.Effect<
  DeleteDomainOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainInput,
  output: DeleteDomainOutput,
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
 * Updates the domain unit.
 */
export const updateDomainUnit: (
  input: UpdateDomainUnitInput,
) => Effect.Effect<
  UpdateDomainUnitOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDomainUnitInput,
  output: UpdateDomainUnitOutput,
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
 * Updates the business glossary in Amazon DataZone.
 *
 * Prerequisites:
 *
 * - The glossary must exist in the given domain.
 *
 * - The caller must have the `datazone:UpdateGlossary` permission to update it.
 *
 * - When updating the name, the new name must be unique within the domain.
 *
 * - The glossary must not be deleted or in a terminal state.
 */
export const updateGlossary: (
  input: UpdateGlossaryInput,
) => Effect.Effect<
  UpdateGlossaryOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGlossaryInput,
  output: UpdateGlossaryOutput,
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
 * Updates a business glossary term in Amazon DataZone.
 *
 * Prerequisites:
 *
 * - Glossary term must exist in the specified domain.
 *
 * - New name must not conflict with existing terms in the same glossary.
 *
 * - User must have permissions on the term.
 *
 * - The term must not be in DELETED status.
 */
export const updateGlossaryTerm: (
  input: UpdateGlossaryTermInput,
) => Effect.Effect<
  UpdateGlossaryTermOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGlossaryTermInput,
  output: UpdateGlossaryTermOutput,
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
 * Associates governed terms with an asset.
 */
export const associateGovernedTerms: (
  input: AssociateGovernedTermsInput,
) => Effect.Effect<
  AssociateGovernedTermsOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateGovernedTermsInput,
  output: AssociateGovernedTermsOutput,
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
 * Deletes an asset filter.
 *
 * Prerequisites:
 *
 * - The asset filter must exist.
 *
 * - The domain and asset must not have been deleted.
 *
 * - Ensure the --identifier refers to a valid filter ID.
 */
export const deleteAssetFilter: (
  input: DeleteAssetFilterInput,
) => Effect.Effect<
  DeleteAssetFilterResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssetFilterInput,
  output: DeleteAssetFilterResponse,
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
 * Deletes an action for the environment, for example, deletes a console link for an analytics tool that is available in this environment.
 */
export const deleteEnvironmentAction: (
  input: DeleteEnvironmentActionInput,
) => Effect.Effect<
  DeleteEnvironmentActionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentActionInput,
  output: DeleteEnvironmentActionResponse,
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
 * Deletes a blueprint in Amazon DataZone.
 */
export const deleteEnvironmentBlueprint: (
  input: DeleteEnvironmentBlueprintInput,
) => Effect.Effect<
  DeleteEnvironmentBlueprintResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentBlueprintInput,
  output: DeleteEnvironmentBlueprintResponse,
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
 * Deletes a subscription request in Amazon DataZone.
 */
export const deleteSubscriptionRequest: (
  input: DeleteSubscriptionRequestInput,
) => Effect.Effect<
  DeleteSubscriptionRequestResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSubscriptionRequestInput,
  output: DeleteSubscriptionRequestResponse,
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
 * Deletes a subscription target in Amazon DataZone.
 */
export const deleteSubscriptionTarget: (
  input: DeleteSubscriptionTargetInput,
) => Effect.Effect<
  DeleteSubscriptionTargetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSubscriptionTargetInput,
  output: DeleteSubscriptionTargetResponse,
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
 * Disassociates the environment role in Amazon DataZone.
 */
export const disassociateEnvironmentRole: (
  input: DisassociateEnvironmentRoleInput,
) => Effect.Effect<
  DisassociateEnvironmentRoleOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateEnvironmentRoleInput,
  output: DisassociateEnvironmentRoleOutput,
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
 * Disassociates restricted terms from an asset.
 */
export const disassociateGovernedTerms: (
  input: DisassociateGovernedTermsInput,
) => Effect.Effect<
  DisassociateGovernedTermsOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateGovernedTermsInput,
  output: DisassociateGovernedTermsOutput,
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
 * Updates the owner of the root domain unit.
 */
export const updateRootDomainUnitOwner: (
  input: UpdateRootDomainUnitOwnerInput,
) => Effect.Effect<
  UpdateRootDomainUnitOwnerOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRootDomainUnitOwnerInput,
  output: UpdateRootDomainUnitOwnerOutput,
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
 * Deletes an asset in Amazon DataZone.
 *
 * - --domain-identifier must refer to a valid and existing domain.
 *
 * - --identifier must refer to an existing asset in the specified domain.
 *
 * - Asset must not be referenced in any existing asset filters.
 *
 * - Asset must not be linked to any draft or published data product.
 *
 * - User must have delete permissions for the domain and project.
 */
export const deleteAsset: (
  input: DeleteAssetInput,
) => Effect.Effect<
  DeleteAssetOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssetInput,
  output: DeleteAssetOutput,
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
 * Deletes an asset type in Amazon DataZone.
 *
 * Prerequisites:
 *
 * - The asset type must exist in the domain.
 *
 * - You must have DeleteAssetType permission.
 *
 * - The asset type must not be in use (e.g., assigned to any asset). If used, deletion will fail.
 *
 * - You should retrieve the asset type using get-asset-type to confirm its presence before deletion.
 */
export const deleteAssetType: (
  input: DeleteAssetTypeInput,
) => Effect.Effect<
  DeleteAssetTypeOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssetTypeInput,
  output: DeleteAssetTypeOutput,
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
 * Deletes a data product in Amazon DataZone.
 *
 * Prerequisites:
 *
 * - The data product must exist and not be deleted or archived.
 *
 * - The user must have delete permissions for the data product.
 *
 * - Domain and project must be active.
 */
export const deleteDataProduct: (
  input: DeleteDataProductInput,
) => Effect.Effect<
  DeleteDataProductOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataProductInput,
  output: DeleteDataProductOutput,
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
 * Deletes a domain unit.
 */
export const deleteDomainUnit: (
  input: DeleteDomainUnitInput,
) => Effect.Effect<
  DeleteDomainUnitOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainUnitInput,
  output: DeleteDomainUnitOutput,
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
 * Deletes and metadata form type in Amazon DataZone.
 *
 * Prerequisites:
 *
 * - The form type must exist in the domain.
 *
 * - The form type must not be in use by any asset types or assets.
 *
 * - The domain must be valid and accessible.
 *
 * - User must have delete permissions on the form type.
 *
 * - Any dependencies (such as linked asset types) must be removed first.
 */
export const deleteFormType: (
  input: DeleteFormTypeInput,
) => Effect.Effect<
  DeleteFormTypeOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFormTypeInput,
  output: DeleteFormTypeOutput,
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
 * Deletes a business glossary in Amazon DataZone.
 *
 * Prerequisites:
 *
 * - The glossary must be in DISABLED state.
 *
 * - The glossary must not have any glossary terms associated with it.
 *
 * - The glossary must exist in the specified domain.
 *
 * - The caller must have the `datazone:DeleteGlossary` permission in the domain and glossary.
 *
 * - Glossary should not be linked to any active metadata forms.
 */
export const deleteGlossary: (
  input: DeleteGlossaryInput,
) => Effect.Effect<
  DeleteGlossaryOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGlossaryInput,
  output: DeleteGlossaryOutput,
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
 * Deletes a business glossary term in Amazon DataZone.
 *
 * Prerequisites:
 *
 * - Glossary term must exist and be active.
 *
 * - The term must not be linked to other assets or child terms.
 *
 * - Caller must have delete permissions in the domain/glossary.
 *
 * - Ensure all associations (such as to assets or parent terms) are removed before deletion.
 */
export const deleteGlossaryTerm: (
  input: DeleteGlossaryTermInput,
) => Effect.Effect<
  DeleteGlossaryTermOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGlossaryTermInput,
  output: DeleteGlossaryTermOutput,
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
 * Deletes a listing (a record of an asset at a given time).
 */
export const deleteListing: (
  input: DeleteListingInput,
) => Effect.Effect<
  DeleteListingOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteListingInput,
  output: DeleteListingOutput,
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
 * Cancels the metadata generation run.
 *
 * Prerequisites:
 *
 * - The run must exist and be in a cancelable status (e.g., SUBMITTED, IN_PROGRESS).
 *
 * - Runs in SUCCEEDED status cannot be cancelled.
 *
 * - User must have access to the run and cancel permissions.
 */
export const cancelMetadataGenerationRun: (
  input: CancelMetadataGenerationRunInput,
) => Effect.Effect<
  CancelMetadataGenerationRunOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelMetadataGenerationRunInput,
  output: CancelMetadataGenerationRunOutput,
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
 * Deletes a rule in Amazon DataZone. A rule is a formal agreement that enforces specific requirements across user workflows (e.g., publishing assets to the catalog, requesting subscriptions, creating projects) within the Amazon DataZone data portal. These rules help maintain consistency, ensure compliance, and uphold governance standards in data management processes. For instance, a metadata enforcement rule can specify the required information for creating a subscription request or publishing a data asset to the catalog, ensuring alignment with organizational standards.
 */
export const deleteRule: (
  input: DeleteRuleInput,
) => Effect.Effect<
  DeleteRuleOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRuleInput,
  output: DeleteRuleOutput,
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
 * Accepts automatically generated business-friendly metadata for your Amazon DataZone assets.
 */
export const acceptPredictions: (
  input: AcceptPredictionsInput,
) => Effect.Effect<
  AcceptPredictionsOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptPredictionsInput,
  output: AcceptPredictionsOutput,
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
 * Updates the specified group profile in Amazon DataZone.
 */
export const updateGroupProfile: (
  input: UpdateGroupProfileInput,
) => Effect.Effect<
  UpdateGroupProfileOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGroupProfileInput,
  output: UpdateGroupProfileOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the specified user profile in Amazon DataZone.
 */
export const updateUserProfile: (
  input: UpdateUserProfileInput,
) => Effect.Effect<
  UpdateUserProfileOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserProfileInput,
  output: UpdateUserProfileOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets the data product.
 *
 * Prerequisites:
 *
 * - The data product ID must exist.
 *
 * - The domain must be valid and accessible.
 *
 * - User must have read or discovery permissions for the data product.
 */
export const getDataProduct: (
  input: GetDataProductInput,
) => Effect.Effect<
  GetDataProductOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataProductInput,
  output: GetDataProductOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the details of the specified domain unit.
 */
export const getDomainUnit: (
  input: GetDomainUnitInput,
) => Effect.Effect<
  GetDomainUnitOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainUnitInput,
  output: GetDomainUnitOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the blueprint configuration in Amazon DataZone.
 */
export const getEnvironmentBlueprintConfiguration: (
  input: GetEnvironmentBlueprintConfigurationInput,
) => Effect.Effect<
  GetEnvironmentBlueprintConfigurationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnvironmentBlueprintConfigurationInput,
  output: GetEnvironmentBlueprintConfigurationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets a business glossary in Amazon DataZone.
 *
 * Prerequisites:
 *
 * - The specified glossary ID must exist and be associated with the given domain.
 *
 * - The caller must have the `datazone:GetGlossary` permission on the domain.
 */
export const getGlossary: (
  input: GetGlossaryInput,
) => Effect.Effect<
  GetGlossaryOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGlossaryInput,
  output: GetGlossaryOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a business glossary term in Amazon DataZone.
 *
 * Prerequisites:
 *
 * - Glossary term with identifier must exist in the domain.
 *
 * - User must have permission on the glossary term.
 *
 * - Domain must be accessible and active.
 */
export const getGlossaryTerm: (
  input: GetGlossaryTermInput,
) => Effect.Effect<
  GetGlossaryTermOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGlossaryTermInput,
  output: GetGlossaryTermOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the details of a rule in Amazon DataZone. A rule is a formal agreement that enforces specific requirements across user workflows (e.g., publishing assets to the catalog, requesting subscriptions, creating projects) within the Amazon DataZone data portal. These rules help maintain consistency, ensure compliance, and uphold governance standards in data management processes. For instance, a metadata enforcement rule can specify the required information for creating a subscription request or publishing a data asset to the catalog, ensuring alignment with organizational standards.
 */
export const getRule: (
  input: GetRuleInput,
) => Effect.Effect<
  GetRuleOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRuleInput,
  output: GetRuleOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an account pool.
 */
export const deleteAccountPool: (
  input: DeleteAccountPoolInput,
) => Effect.Effect<
  DeleteAccountPoolOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccountPoolInput,
  output: DeleteAccountPoolOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an environment in Amazon DataZone.
 */
export const deleteEnvironment: (
  input: DeleteEnvironmentInput,
) => Effect.Effect<
  DeleteEnvironmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentInput,
  output: DeleteEnvironmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an environment profile in Amazon DataZone.
 */
export const deleteEnvironmentProfile: (
  input: DeleteEnvironmentProfileInput,
) => Effect.Effect<
  DeleteEnvironmentProfileResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentProfileInput,
  output: DeleteEnvironmentProfileResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a project in Amazon DataZone.
 */
export const deleteProject: (
  input: DeleteProjectInput,
) => Effect.Effect<
  DeleteProjectOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProjectInput,
  output: DeleteProjectOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a project profile.
 */
export const deleteProjectProfile: (
  input: DeleteProjectProfileInput,
) => Effect.Effect<
  DeleteProjectProfileOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProjectProfileInput,
  output: DeleteProjectProfileOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified time series form for the specified asset.
 */
export const deleteTimeSeriesDataPoints: (
  input: DeleteTimeSeriesDataPointsInput,
) => Effect.Effect<
  DeleteTimeSeriesDataPointsOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTimeSeriesDataPointsInput,
  output: DeleteTimeSeriesDataPointsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes an owner from an entity.
 */
export const removeEntityOwner: (
  input: RemoveEntityOwnerInput,
) => Effect.Effect<
  RemoveEntityOwnerOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveEntityOwnerInput,
  output: RemoveEntityOwnerOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Untags a resource in Amazon DataZone.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  InternalServerException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [InternalServerException, ResourceNotFoundException],
}));
/**
 * Creates a group profile in Amazon DataZone.
 */
export const createGroupProfile: (
  input: CreateGroupProfileInput,
) => Effect.Effect<
  CreateGroupProfileOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGroupProfileInput,
  output: CreateGroupProfileOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a project membership in Amazon DataZone.
 */
export const createProjectMembership: (
  input: CreateProjectMembershipInput,
) => Effect.Effect<
  CreateProjectMembershipOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProjectMembershipInput,
  output: CreateProjectMembershipOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes and connection. In Amazon DataZone, a connection enables you to connect your resources (domains, projects, and environments) to external resources and services.
 */
export const deleteConnection: (
  input: DeleteConnectionInput,
) => Effect.Effect<
  DeleteConnectionOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectionInput,
  output: DeleteConnectionOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the details of the account pool.
 */
export const getAccountPool: (
  input: GetAccountPoolInput,
) => Effect.Effect<
  GetAccountPoolOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountPoolInput,
  output: GetAccountPoolOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets an asset filter.
 *
 * Prerequisites:
 *
 * - Domain (`--domain-identifier`), asset (`--asset-identifier`), and filter (`--identifier`) must all exist.
 *
 * - The asset filter should not have been deleted.
 *
 * - The asset must still exist (since the filter is linked to it).
 */
export const getAssetFilter: (
  input: GetAssetFilterInput,
) => Effect.Effect<
  GetAssetFilterOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssetFilterInput,
  output: GetAssetFilterOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets data export configuration details.
 */
export const getDataExportConfiguration: (
  input: GetDataExportConfigurationInput,
) => Effect.Effect<
  GetDataExportConfigurationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataExportConfigurationInput,
  output: GetDataExportConfigurationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the specified environment action.
 */
export const getEnvironmentAction: (
  input: GetEnvironmentActionInput,
) => Effect.Effect<
  GetEnvironmentActionOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnvironmentActionInput,
  output: GetEnvironmentActionOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets an Amazon DataZone blueprint.
 */
export const getEnvironmentBlueprint: (
  input: GetEnvironmentBlueprintInput,
) => Effect.Effect<
  GetEnvironmentBlueprintOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnvironmentBlueprintInput,
  output: GetEnvironmentBlueprintOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the credentials of an environment in Amazon DataZone.
 */
export const getEnvironmentCredentials: (
  input: GetEnvironmentCredentialsInput,
) => Effect.Effect<
  GetEnvironmentCredentialsOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnvironmentCredentialsInput,
  output: GetEnvironmentCredentialsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets an evinronment profile in Amazon DataZone.
 */
export const getEnvironmentProfile: (
  input: GetEnvironmentProfileInput,
) => Effect.Effect<
  GetEnvironmentProfileOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnvironmentProfileInput,
  output: GetEnvironmentProfileOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a group profile in Amazon DataZone.
 */
export const getGroupProfile: (
  input: GetGroupProfileInput,
) => Effect.Effect<
  GetGroupProfileOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGroupProfileInput,
  output: GetGroupProfileOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes the lineage event.
 */
export const getLineageEvent: (
  input: GetLineageEventInput,
) => Effect.Effect<
  GetLineageEventOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLineageEventInput,
  output: GetLineageEventOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The details of the project profile.
 */
export const getProjectProfile: (
  input: GetProjectProfileInput,
) => Effect.Effect<
  GetProjectProfileOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProjectProfileInput,
  output: GetProjectProfileOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a subscription in Amazon DataZone.
 */
export const getSubscription: (
  input: GetSubscriptionInput,
) => Effect.Effect<
  GetSubscriptionOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSubscriptionInput,
  output: GetSubscriptionOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the subscription grant in Amazon DataZone.
 */
export const getSubscriptionGrant: (
  input: GetSubscriptionGrantInput,
) => Effect.Effect<
  GetSubscriptionGrantOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSubscriptionGrantInput,
  output: GetSubscriptionGrantOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the details of the specified subscription request.
 */
export const getSubscriptionRequestDetails: (
  input: GetSubscriptionRequestDetailsInput,
) => Effect.Effect<
  GetSubscriptionRequestDetailsOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSubscriptionRequestDetailsInput,
  output: GetSubscriptionRequestDetailsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the subscription target in Amazon DataZone.
 */
export const getSubscriptionTarget: (
  input: GetSubscriptionTargetInput,
) => Effect.Effect<
  GetSubscriptionTargetOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSubscriptionTargetInput,
  output: GetSubscriptionTargetOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a user profile in Amazon DataZone.
 */
export const getUserProfile: (
  input: GetUserProfileInput,
) => Effect.Effect<
  GetUserProfileOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUserProfileInput,
  output: GetUserProfileOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the accounts in the specified account pool.
 */
export const listAccountsInAccountPool: {
  (
    input: ListAccountsInAccountPoolInput,
  ): Effect.Effect<
    ListAccountsInAccountPoolOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccountsInAccountPoolInput,
  ) => Stream.Stream<
    ListAccountsInAccountPoolOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListAccountsInAccountPoolInput,
  ) => Stream.Stream<
    AccountInfo,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccountsInAccountPoolInput,
  output: ListAccountsInAccountPoolOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists tags for the specified resource in Amazon DataZone.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Associates the environment role in Amazon DataZone.
 */
export const associateEnvironmentRole: (
  input: AssociateEnvironmentRoleInput,
) => Effect.Effect<
  AssociateEnvironmentRoleOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateEnvironmentRoleInput,
  output: AssociateEnvironmentRoleOutput,
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
 * Gets the attribute metadata.
 */
export const batchGetAttributesMetadata: (
  input: BatchGetAttributesMetadataInput,
) => Effect.Effect<
  BatchGetAttributesMetadataOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetAttributesMetadataInput,
  output: BatchGetAttributesMetadataOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create an Amazon DataZone environment.
 */
export const createEnvironment: (
  input: CreateEnvironmentInput,
) => Effect.Effect<
  CreateEnvironmentOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentInput,
  output: CreateEnvironmentOutput,
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
 * Creates a subscription target in Amazon DataZone.
 */
export const createSubscriptionTarget: (
  input: CreateSubscriptionTargetInput,
) => Effect.Effect<
  CreateSubscriptionTargetOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSubscriptionTargetInput,
  output: CreateSubscriptionTargetOutput,
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
 * Gets the data lineage node.
 */
export const getLineageNode: (
  input: GetLineageNodeInput,
) => Effect.Effect<
  GetLineageNodeOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLineageNodeInput,
  output: GetLineageNodeOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a project in Amazon DataZone.
 */
export const getProject: (
  input: GetProjectInput,
) => Effect.Effect<
  GetProjectOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProjectInput,
  output: GetProjectOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the existing data point for the asset.
 */
export const getTimeSeriesDataPoint: (
  input: GetTimeSeriesDataPointInput,
) => Effect.Effect<
  GetTimeSeriesDataPointOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTimeSeriesDataPointInput,
  output: GetTimeSeriesDataPointOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists asset filters.
 *
 * Prerequisites:
 *
 * - A valid domain and asset must exist.
 *
 * - The asset must have at least one filter created to return results.
 */
export const listAssetFilters: {
  (
    input: ListAssetFiltersInput,
  ): Effect.Effect<
    ListAssetFiltersOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssetFiltersInput,
  ) => Stream.Stream<
    ListAssetFiltersOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListAssetFiltersInput,
  ) => Stream.Stream<
    AssetFilterSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssetFiltersInput,
  output: ListAssetFiltersOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the revisions for the asset.
 *
 * Prerequisites:
 *
 * - The asset must exist in the domain.
 *
 * - There must be at least one revision of the asset (which happens automatically after creation).
 *
 * - The domain must be valid and active.
 *
 * - User must have permissions on the asset and domain.
 */
export const listAssetRevisions: {
  (
    input: ListAssetRevisionsInput,
  ): Effect.Effect<
    ListAssetRevisionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssetRevisionsInput,
  ) => Stream.Stream<
    ListAssetRevisionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListAssetRevisionsInput,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssetRevisionsInput,
  output: ListAssetRevisionsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists data product revisions.
 *
 * Prerequisites:
 *
 * - The data product ID must exist within the domain.
 *
 * - User must have view permissions on the data product.
 *
 * - The domain must be in a valid and accessible state.
 */
export const listDataProductRevisions: {
  (
    input: ListDataProductRevisionsInput,
  ): Effect.Effect<
    ListDataProductRevisionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataProductRevisionsInput,
  ) => Stream.Stream<
    ListDataProductRevisionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListDataProductRevisionsInput,
  ) => Stream.Stream<
    DataProductRevision,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDataProductRevisionsInput,
  output: ListDataProductRevisionsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists blueprints in an Amazon DataZone environment.
 */
export const listEnvironmentBlueprints: {
  (
    input: ListEnvironmentBlueprintsInput,
  ): Effect.Effect<
    ListEnvironmentBlueprintsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnvironmentBlueprintsInput,
  ) => Stream.Stream<
    ListEnvironmentBlueprintsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListEnvironmentBlueprintsInput,
  ) => Stream.Stream<
    EnvironmentBlueprintSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnvironmentBlueprintsInput,
  output: ListEnvironmentBlueprintsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists job runs.
 */
export const listJobRuns: {
  (
    input: ListJobRunsInput,
  ): Effect.Effect<
    ListJobRunsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobRunsInput,
  ) => Stream.Stream<
    ListJobRunsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListJobRunsInput,
  ) => Stream.Stream<
    JobRunSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListJobRunsInput,
  output: ListJobRunsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the history of the specified data lineage node.
 */
export const listLineageNodeHistory: {
  (
    input: ListLineageNodeHistoryInput,
  ): Effect.Effect<
    ListLineageNodeHistoryOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListLineageNodeHistoryInput,
  ) => Stream.Stream<
    ListLineageNodeHistoryOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListLineageNodeHistoryInput,
  ) => Stream.Stream<
    LineageNodeSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLineageNodeHistoryInput,
  output: ListLineageNodeHistoryOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "nodes",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists subscription grants.
 */
export const listSubscriptionGrants: {
  (
    input: ListSubscriptionGrantsInput,
  ): Effect.Effect<
    ListSubscriptionGrantsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListSubscriptionGrantsInput,
  ) => Stream.Stream<
    ListSubscriptionGrantsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListSubscriptionGrantsInput,
  ) => Stream.Stream<
    SubscriptionGrantSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSubscriptionGrantsInput,
  output: ListSubscriptionGrantsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists subscriptions in Amazon DataZone.
 */
export const listSubscriptions: {
  (
    input: ListSubscriptionsInput,
  ): Effect.Effect<
    ListSubscriptionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListSubscriptionsInput,
  ) => Stream.Stream<
    ListSubscriptionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListSubscriptionsInput,
  ) => Stream.Stream<
    SubscriptionSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSubscriptionsInput,
  output: ListSubscriptionsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists subscription targets in Amazon DataZone.
 */
export const listSubscriptionTargets: {
  (
    input: ListSubscriptionTargetsInput,
  ): Effect.Effect<
    ListSubscriptionTargetsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListSubscriptionTargetsInput,
  ) => Stream.Stream<
    ListSubscriptionTargetsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListSubscriptionTargetsInput,
  ) => Stream.Stream<
    SubscriptionTargetSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSubscriptionTargetsInput,
  output: ListSubscriptionTargetsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists time series data points.
 */
export const listTimeSeriesDataPoints: {
  (
    input: ListTimeSeriesDataPointsInput,
  ): Effect.Effect<
    ListTimeSeriesDataPointsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListTimeSeriesDataPointsInput,
  ) => Stream.Stream<
    ListTimeSeriesDataPointsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListTimeSeriesDataPointsInput,
  ) => Stream.Stream<
    TimeSeriesDataPointSummaryFormOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTimeSeriesDataPointsInput,
  output: ListTimeSeriesDataPointsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Rejects automatically generated business-friendly metadata for your Amazon DataZone assets.
 */
export const rejectPredictions: (
  input: RejectPredictionsInput,
) => Effect.Effect<
  RejectPredictionsOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectPredictionsInput,
  output: RejectPredictionsOutput,
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
 * Searches group profiles in Amazon DataZone.
 */
export const searchGroupProfiles: {
  (
    input: SearchGroupProfilesInput,
  ): Effect.Effect<
    SearchGroupProfilesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: SearchGroupProfilesInput,
  ) => Stream.Stream<
    SearchGroupProfilesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: SearchGroupProfilesInput,
  ) => Stream.Stream<
    GroupProfileSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchGroupProfilesInput,
  output: SearchGroupProfilesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Searches user profiles in Amazon DataZone.
 */
export const searchUserProfiles: {
  (
    input: SearchUserProfilesInput,
  ): Effect.Effect<
    SearchUserProfilesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: SearchUserProfilesInput,
  ) => Stream.Stream<
    SearchUserProfilesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: SearchUserProfilesInput,
  ) => Stream.Stream<
    UserProfileSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchUserProfilesInput,
  output: SearchUserProfilesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists existing account pools.
 */
export const listAccountPools: {
  (
    input: ListAccountPoolsInput,
  ): Effect.Effect<
    ListAccountPoolsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccountPoolsInput,
  ) => Stream.Stream<
    ListAccountPoolsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListAccountPoolsInput,
  ) => Stream.Stream<
    AccountPoolSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccountPoolsInput,
  output: ListAccountPoolsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists connections. In Amazon DataZone, a connection enables you to connect your resources (domains, projects, and environments) to external resources and services.
 */
export const listConnections: {
  (
    input: ListConnectionsInput,
  ): Effect.Effect<
    ListConnectionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListConnectionsInput,
  ) => Stream.Stream<
    ListConnectionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListConnectionsInput,
  ) => Stream.Stream<
    ConnectionSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConnectionsInput,
  output: ListConnectionsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists existing environment actions.
 */
export const listEnvironmentActions: {
  (
    input: ListEnvironmentActionsInput,
  ): Effect.Effect<
    ListEnvironmentActionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnvironmentActionsInput,
  ) => Stream.Stream<
    ListEnvironmentActionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListEnvironmentActionsInput,
  ) => Stream.Stream<
    EnvironmentActionSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnvironmentActionsInput,
  output: ListEnvironmentActionsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists Amazon DataZone environment profiles.
 */
export const listEnvironmentProfiles: {
  (
    input: ListEnvironmentProfilesInput,
  ): Effect.Effect<
    ListEnvironmentProfilesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnvironmentProfilesInput,
  ) => Stream.Stream<
    ListEnvironmentProfilesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListEnvironmentProfilesInput,
  ) => Stream.Stream<
    EnvironmentProfileSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnvironmentProfilesInput,
  output: ListEnvironmentProfilesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists Amazon DataZone environments.
 */
export const listEnvironments: {
  (
    input: ListEnvironmentsInput,
  ): Effect.Effect<
    ListEnvironmentsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnvironmentsInput,
  ) => Stream.Stream<
    ListEnvironmentsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListEnvironmentsInput,
  ) => Stream.Stream<
    EnvironmentSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnvironmentsInput,
  output: ListEnvironmentsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists policy grants.
 */
export const listPolicyGrants: {
  (
    input: ListPolicyGrantsInput,
  ): Effect.Effect<
    ListPolicyGrantsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListPolicyGrantsInput,
  ) => Stream.Stream<
    ListPolicyGrantsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListPolicyGrantsInput,
  ) => Stream.Stream<
    PolicyGrantMember,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPolicyGrantsInput,
  output: ListPolicyGrantsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "grantList",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists project profiles.
 */
export const listProjectProfiles: {
  (
    input: ListProjectProfilesInput,
  ): Effect.Effect<
    ListProjectProfilesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListProjectProfilesInput,
  ) => Stream.Stream<
    ListProjectProfilesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListProjectProfilesInput,
  ) => Stream.Stream<
    ProjectProfileSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProjectProfilesInput,
  output: ListProjectProfilesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists Amazon DataZone projects.
 */
export const listProjects: {
  (
    input: ListProjectsInput,
  ): Effect.Effect<
    ListProjectsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListProjectsInput,
  ) => Stream.Stream<
    ListProjectsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListProjectsInput,
  ) => Stream.Stream<
    ProjectSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProjectsInput,
  output: ListProjectsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates the status of the specified subscription grant status in Amazon DataZone.
 */
export const updateSubscriptionGrantStatus: (
  input: UpdateSubscriptionGrantStatusInput,
) => Effect.Effect<
  UpdateSubscriptionGrantStatusOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSubscriptionGrantStatusInput,
  output: UpdateSubscriptionGrantStatusOutput,
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
 * Gets an Amazon DataZone asset.
 *
 * An asset is the fundamental building block in Amazon DataZone, representing any data resource that needs to be cataloged and managed. It can take many forms, from Amazon S3 buckets and database tables to dashboards and machine learning models. Each asset contains comprehensive metadata about the resource, including its location, schema, ownership, and lineage information. Assets are essential for organizing and managing data resources across an organization, making them discoverable and usable while maintaining proper governance.
 *
 * Before using the Amazon DataZone GetAsset command, ensure the following prerequisites are met:
 *
 * - Domain identifier must exist and be valid
 *
 * - Asset identifier must exist
 *
 * - User must have the required permissions to perform the action
 */
export const getAsset: (
  input: GetAssetInput,
) => Effect.Effect<
  GetAssetOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssetInput,
  output: GetAssetOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists child domain units for the specified parent domain unit.
 */
export const listDomainUnitsForParent: {
  (
    input: ListDomainUnitsForParentInput,
  ): Effect.Effect<
    ListDomainUnitsForParentOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListDomainUnitsForParentInput,
  ) => Stream.Stream<
    ListDomainUnitsForParentOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListDomainUnitsForParentInput,
  ) => Stream.Stream<
    DomainUnitSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDomainUnitsForParentInput,
  output: ListDomainUnitsForParentOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a metadata form type in Amazon DataZone.
 *
 * Form types define the structure and validation rules for collecting metadata about assets in Amazon DataZone. They act as templates that ensure consistent metadata capture across similar types of assets, while allowing for customization to meet specific organizational needs. Form types can include required fields, validation rules, and dependencies, helping maintain high-quality metadata that makes data assets more discoverable and usable.
 *
 * - The form type with the specified identifier must exist in the given domain.
 *
 * - The domain must be valid and active.
 *
 * - User must have permission on the form type.
 *
 * - The form type should not be deleted or in an invalid state.
 *
 * One use case for this API is to determine whether a form field is indexed for search.
 *
 * A searchable field will be annotated with `@amazon.datazone#searchable`. By default, searchable fields are indexed for semantic search, where related query terms will match the attribute value even if they are not stemmed or keyword matches. If a field is indexed technical identifier search, it will be annotated with `@amazon.datazone#searchable(modes:["TECHNICAL"])`. If a field is indexed for lexical search (supports stemmed and prefix matches but not semantic matches), it will be annotated with `@amazon.datazone#searchable(modes:["LEXICAL"])`.
 *
 * A field storing glossary term IDs (which is filterable) will be annotated with `@amazon.datazone#glossaryterm("${glossaryId}")`.
 */
export const getFormType: (
  input: GetFormTypeInput,
) => Effect.Effect<
  GetFormTypeOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFormTypeInput,
  output: GetFormTypeOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a metadata generation run in Amazon DataZone.
 *
 * Prerequisites:
 *
 * - Valid domain and run identifier.
 *
 * - The metadata generation run must exist.
 *
 * - User must have read access to the metadata run.
 */
export const getMetadataGenerationRun: (
  input: GetMetadataGenerationRunInput,
) => Effect.Effect<
  GetMetadataGenerationRunOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMetadataGenerationRunInput,
  output: GetMetadataGenerationRunOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all metadata generation runs.
 *
 * Metadata generation runs represent automated processes that leverage AI/ML capabilities to create or enhance asset metadata at scale. This feature helps organizations maintain comprehensive and consistent metadata across large numbers of assets without manual intervention. It can automatically generate business descriptions, tags, and other metadata elements, significantly reducing the time and effort required for metadata management while improving consistency and completeness.
 *
 * Prerequisites:
 *
 * - Valid domain identifier.
 *
 * - User must have access to metadata generation runs in the domain.
 */
export const listMetadataGenerationRuns: {
  (
    input: ListMetadataGenerationRunsInput,
  ): Effect.Effect<
    ListMetadataGenerationRunsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListMetadataGenerationRunsInput,
  ) => Stream.Stream<
    ListMetadataGenerationRunsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListMetadataGenerationRunsInput,
  ) => Stream.Stream<
    MetadataGenerationRunItem,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMetadataGenerationRunsInput,
  output: ListMetadataGenerationRunsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists existing rules. In Amazon DataZone, a rule is a formal agreement that enforces specific requirements across user workflows (e.g., publishing assets to the catalog, requesting subscriptions, creating projects) within the Amazon DataZone data portal. These rules help maintain consistency, ensure compliance, and uphold governance standards in data management processes. For instance, a metadata enforcement rule can specify the required information for creating a subscription request or publishing a data asset to the catalog, ensuring alignment with organizational standards.
 */
export const listRules: {
  (
    input: ListRulesInput,
  ): Effect.Effect<
    ListRulesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListRulesInput,
  ) => Stream.Stream<
    ListRulesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListRulesInput,
  ) => Stream.Stream<
    RuleSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRulesInput,
  output: ListRulesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Tags a resource in Amazon DataZone.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists blueprint configurations for a Amazon DataZone environment.
 */
export const listEnvironmentBlueprintConfigurations: {
  (
    input: ListEnvironmentBlueprintConfigurationsInput,
  ): Effect.Effect<
    ListEnvironmentBlueprintConfigurationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnvironmentBlueprintConfigurationsInput,
  ) => Stream.Stream<
    ListEnvironmentBlueprintConfigurationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListEnvironmentBlueprintConfigurationsInput,
  ) => Stream.Stream<
    EnvironmentBlueprintConfigurationItem,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnvironmentBlueprintConfigurationsInput,
  output: ListEnvironmentBlueprintConfigurationsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Removes a policy grant.
 */
export const removePolicyGrant: (
  input: RemovePolicyGrantInput,
) => Effect.Effect<
  RemovePolicyGrantOutput,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemovePolicyGrantInput,
  output: RemovePolicyGrantOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Writes the attribute metadata.
 */
export const batchPutAttributesMetadata: (
  input: BatchPutAttributesMetadataInput,
) => Effect.Effect<
  BatchPutAttributesMetadataOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchPutAttributesMetadataInput,
  output: BatchPutAttributesMetadataOutput,
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
 * Creates an action for the environment, for example, creates a console link for an analytics tool that is available in this environment.
 */
export const createEnvironmentAction: (
  input: CreateEnvironmentActionInput,
) => Effect.Effect<
  CreateEnvironmentActionOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentActionInput,
  output: CreateEnvironmentActionOutput,
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
 * Creates a subsscription grant in Amazon DataZone.
 */
export const createSubscriptionGrant: (
  input: CreateSubscriptionGrantInput,
) => Effect.Effect<
  CreateSubscriptionGrantOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSubscriptionGrantInput,
  output: CreateSubscriptionGrantOutput,
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
 * Creates a user profile in Amazon DataZone.
 */
export const createUserProfile: (
  input: CreateUserProfileInput,
) => Effect.Effect<
  CreateUserProfileOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserProfileInput,
  output: CreateUserProfileOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes and subscription grant in Amazon DataZone.
 */
export const deleteSubscriptionGrant: (
  input: DeleteSubscriptionGrantInput,
) => Effect.Effect<
  DeleteSubscriptionGrantOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSubscriptionGrantInput,
  output: DeleteSubscriptionGrantOutput,
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
 * Gets an Amazon DataZone environment.
 */
export const getEnvironment: (
  input: GetEnvironmentInput,
) => Effect.Effect<
  GetEnvironmentOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnvironmentInput,
  output: GetEnvironmentOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the entity (domain units) owners.
 */
export const listEntityOwners: {
  (
    input: ListEntityOwnersInput,
  ): Effect.Effect<
    ListEntityOwnersOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListEntityOwnersInput,
  ) => Stream.Stream<
    ListEntityOwnersOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListEntityOwnersInput,
  ) => Stream.Stream<
    OwnerPropertiesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEntityOwnersInput,
  output: ListEntityOwnersOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "owners",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists Amazon DataZone subscription requests.
 */
export const listSubscriptionRequests: {
  (
    input: ListSubscriptionRequestsInput,
  ): Effect.Effect<
    ListSubscriptionRequestsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListSubscriptionRequestsInput,
  ) => Stream.Stream<
    ListSubscriptionRequestsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListSubscriptionRequestsInput,
  ) => Stream.Stream<
    SubscriptionRequestSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSubscriptionRequestsInput,
  output: ListSubscriptionRequestsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Searches for types in Amazon DataZone.
 *
 * Prerequisites:
 *
 * - The --domain-identifier must refer to an existing Amazon DataZone domain.
 *
 * - --search-scope must be one of the valid values including: ASSET_TYPE, GLOSSARY_TERM_TYPE, DATA_PRODUCT_TYPE.
 *
 * - The --managed flag must be present without a value.
 *
 * - The user must have permissions for form or asset types in the domain.
 *
 * - If using --filters, ensure that the JSON is valid.
 *
 * - Filters contain correct structure (attribute, value, operator).
 */
export const searchTypes: {
  (
    input: SearchTypesInput,
  ): Effect.Effect<
    SearchTypesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: SearchTypesInput,
  ) => Stream.Stream<
    SearchTypesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: SearchTypesInput,
  ) => Stream.Stream<
    SearchTypesResultItem,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchTypesInput,
  output: SearchTypesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets an Amazon DataZone asset type.
 *
 * Asset types define the categories and characteristics of different kinds of data assets within Amazon DataZone.. They determine what metadata fields are required, what operations are possible, and how the asset integrates with other Amazon Web Services services. Asset types can range from built-in types like Amazon S3 buckets and Amazon Web Services Glue tables to custom types defined for specific organizational needs. Understanding asset types is crucial for properly organizing and managing different kinds of data resources.
 *
 * Prerequisites:
 *
 * - The asset type with identifier must exist in the domain. ResourceNotFoundException.
 *
 * - You must have the GetAssetType permission.
 *
 * - Ensure the domain-identifier value is correct and accessible.
 */
export const getAssetType: (
  input: GetAssetTypeInput,
) => Effect.Effect<
  GetAssetTypeOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssetTypeInput,
  output: GetAssetTypeOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a data product.
 *
 * A data product is a comprehensive package that combines data assets with their associated metadata, documentation, and access controls. It's designed to serve specific business needs or use cases, making it easier for users to find and consume data appropriately. Data products include important information about data quality, freshness, and usage guidelines, effectively bridging the gap between data producers and consumers while ensuring proper governance.
 *
 * Prerequisites:
 *
 * - The domain must exist and be accessible.
 *
 * - The owning project must be valid and active.
 *
 * - The name must be unique within the domain (no existing data product with the same name).
 *
 * - User must have create permissions for data products in the project.
 */
export const createDataProduct: (
  input: CreateDataProductInput,
) => Effect.Effect<
  CreateDataProductOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataProductInput,
  output: CreateDataProductOutput,
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
 * Creates a domain unit in Amazon DataZone.
 */
export const createDomainUnit: (
  input: CreateDomainUnitInput,
) => Effect.Effect<
  CreateDomainUnitOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDomainUnitInput,
  output: CreateDomainUnitOutput,
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
 * Writes the configuration for the specified environment blueprint in Amazon DataZone.
 */
export const putEnvironmentBlueprintConfiguration: (
  input: PutEnvironmentBlueprintConfigurationInput,
) => Effect.Effect<
  PutEnvironmentBlueprintConfigurationOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEnvironmentBlueprintConfigurationInput,
  output: PutEnvironmentBlueprintConfigurationOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists data sources in Amazon DataZone.
 */
export const listDataSources: {
  (
    input: ListDataSourcesInput,
  ): Effect.Effect<
    ListDataSourcesOutput,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataSourcesInput,
  ) => Stream.Stream<
    ListDataSourcesOutput,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListDataSourcesInput,
  ) => Stream.Stream<
    DataSourceSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDataSourcesInput,
  output: ListDataSourcesOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Start the run of the specified data source in Amazon DataZone.
 */
export const startDataSourceRun: (
  input: StartDataSourceRunInput,
) => Effect.Effect<
  StartDataSourceRunOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDataSourceRunInput,
  output: StartDataSourceRunOutput,
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
 * Gets an Amazon DataZone data source run.
 */
export const getDataSourceRun: (
  input: GetDataSourceRunInput,
) => Effect.Effect<
  GetDataSourceRunOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataSourceRunInput,
  output: GetDataSourceRunOutput,
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
 * Lists data source runs in Amazon DataZone.
 */
export const listDataSourceRuns: {
  (
    input: ListDataSourceRunsInput,
  ): Effect.Effect<
    ListDataSourceRunsOutput,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataSourceRunsInput,
  ) => Stream.Stream<
    ListDataSourceRunsOutput,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListDataSourceRunsInput,
  ) => Stream.Stream<
    DataSourceRunSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDataSourceRunsInput,
  output: ListDataSourceRunsOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates an Amazon DataZone domain.
 */
export const createDomain: (
  input: CreateDomainInput,
) => Effect.Effect<
  CreateDomainOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDomainInput,
  output: CreateDomainOutput,
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
 * Lists Amazon DataZone domains.
 */
export const listDomains: {
  (
    input: ListDomainsInput,
  ): Effect.Effect<
    ListDomainsOutput,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListDomainsInput,
  ) => Stream.Stream<
    ListDomainsOutput,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListDomainsInput,
  ) => Stream.Stream<
    DomainSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDomainsInput,
  output: ListDomainsOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a metadata form type.
 *
 * Prerequisites:
 *
 * - The domain must exist and be in an `ENABLED` state.
 *
 * - The owning project must exist and be accessible.
 *
 * - The name must be unique within the domain.
 *
 * For custom form types, to indicate that a field should be searchable, annotate it with `@amazon.datazone#searchable`. By default, searchable fields are indexed for semantic search, where related query terms will match the attribute value even if they are not stemmed or keyword matches. To indicate that a field should be indexed for lexical search (which disables semantic search but supports stemmed and partial matches), annotate it with `@amazon.datazone#searchable(modes:["LEXICAL"])`. To indicate that a field should be indexed for technical identifier search (for more information on technical identifier search, see: https://aws.amazon.com/blogs/big-data/streamline-data-discovery-with-precise-technical-identifier-search-in-amazon-sagemaker-unified-studio/), annotate it with `@amazon.datazone#searchable(modes:["TECHNICAL"])`.
 *
 * To denote that a field will store glossary term ids (which are filterable via the Search/SearchListings APIs), annotate it with `@amazon.datazone#glossaryterm("${GLOSSARY_ID}")`, where `${GLOSSARY_ID}` is the id of the glossary that the glossary terms stored in the field belong to.
 */
export const createFormType: (
  input: CreateFormTypeInput,
) => Effect.Effect<
  CreateFormTypeOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFormTypeInput,
  output: CreateFormTypeOutput,
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
 * Creates a business glossary term.
 *
 * A glossary term represents an individual entry within the Amazon DataZone glossary, serving as a standardized definition for a specific business concept or data element. Each term can include rich metadata such as detailed definitions, synonyms, related terms, and usage examples. Glossary terms can be linked directly to data assets, providing business context to technical data elements. This linking capability helps users understand the business meaning of data fields and ensures consistent interpretation across different systems and teams. Terms can also have relationships with other terms, creating a semantic network that reflects the complexity of business concepts.
 *
 * Prerequisites:
 *
 * - Domain must exist.
 *
 * - Glossary must exist.
 *
 * - The term name must be unique within the glossary.
 *
 * - Ensure term does not conflict with existing terms in hierarchy.
 */
export const createGlossaryTerm: (
  input: CreateGlossaryTermInput,
) => Effect.Effect<
  CreateGlossaryTermOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGlossaryTermInput,
  output: CreateGlossaryTermOutput,
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
 * Starts the metadata generation run.
 *
 * Prerequisites:
 *
 * - Asset must be created and belong to the specified domain and project.
 *
 * - Asset type must be supported for metadata generation (e.g., Amazon Web Services Glue table).
 *
 * - Asset must have a structured schema with valid rows and columns.
 *
 * - Valid values for --type: BUSINESS_DESCRIPTIONS, BUSINESS_NAMES, BUSINESS_GLOSSARY_ASSOCIATIONS.
 *
 * - The user must have permission to run metadata generation in the domain/project.
 */
export const startMetadataGenerationRun: (
  input: StartMetadataGenerationRunInput,
) => Effect.Effect<
  StartMetadataGenerationRunOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMetadataGenerationRunInput,
  output: StartMetadataGenerationRunOutput,
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
 * Creates an Amazon DataZone environment profile.
 */
export const createEnvironmentProfile: (
  input: CreateEnvironmentProfileInput,
) => Effect.Effect<
  CreateEnvironmentProfileOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentProfileInput,
  output: CreateEnvironmentProfileOutput,
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
 * Publishes a listing (a record of an asset at a given time) or removes a listing from the catalog.
 */
export const createListingChangeSet: (
  input: CreateListingChangeSetInput,
) => Effect.Effect<
  CreateListingChangeSetOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateListingChangeSetInput,
  output: CreateListingChangeSetOutput,
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
 * Posts a data lineage event.
 */
export const postLineageEvent: (
  input: PostLineageEventInput,
) => Effect.Effect<
  PostLineageEventOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PostLineageEventInput,
  output: PostLineageEventOutput,
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
 * Creates data export configuration details.
 *
 * In the current release, you can enable exporting asset metadata only for one domain per Amazon Web Services account per region. If you disable exporting asset metadata feature for a domain where it's already enabled, you cannot enable this feature for another domain in the same Amazon Web Services account and region.
 */
export const putDataExportConfiguration: (
  input: PutDataExportConfigurationInput,
) => Effect.Effect<
  PutDataExportConfigurationOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDataExportConfigurationInput,
  output: PutDataExportConfigurationOutput,
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
 * Updates the account pool.
 */
export const updateAccountPool: (
  input: UpdateAccountPoolInput,
) => Effect.Effect<
  UpdateAccountPoolOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccountPoolInput,
  output: UpdateAccountPoolOutput,
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
 * Updates the specified environment in Amazon DataZone.
 */
export const updateEnvironment: (
  input: UpdateEnvironmentInput,
) => Effect.Effect<
  UpdateEnvironmentOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnvironmentInput,
  output: UpdateEnvironmentOutput,
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
 * Updates an environment blueprint in Amazon DataZone.
 */
export const updateEnvironmentBlueprint: (
  input: UpdateEnvironmentBlueprintInput,
) => Effect.Effect<
  UpdateEnvironmentBlueprintOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnvironmentBlueprintInput,
  output: UpdateEnvironmentBlueprintOutput,
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
 * Updates the specified environment profile in Amazon DataZone.
 */
export const updateEnvironmentProfile: (
  input: UpdateEnvironmentProfileInput,
) => Effect.Effect<
  UpdateEnvironmentProfileOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnvironmentProfileInput,
  output: UpdateEnvironmentProfileOutput,
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
 * Updates a project profile.
 */
export const updateProjectProfile: (
  input: UpdateProjectProfileInput,
) => Effect.Effect<
  UpdateProjectProfileOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProjectProfileInput,
  output: UpdateProjectProfileOutput,
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
 * Updates the specified data source in Amazon DataZone.
 */
export const updateDataSource: (
  input: UpdateDataSourceInput,
) => Effect.Effect<
  UpdateDataSourceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataSourceInput,
  output: UpdateDataSourceOutput,
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
 * Deletes a data source in Amazon DataZone.
 */
export const deleteDataSource: (
  input: DeleteDataSourceInput,
) => Effect.Effect<
  DeleteDataSourceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataSourceInput,
  output: DeleteDataSourceOutput,
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
 * Updates a Amazon DataZone domain.
 */
export const updateDomain: (
  input: UpdateDomainInput,
) => Effect.Effect<
  UpdateDomainOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDomainInput,
  output: UpdateDomainOutput,
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
 * Creates an Amazon DataZone business glossary.
 *
 * Specifies that this is a create glossary policy.
 *
 * A glossary serves as the central repository for business terminology and definitions within an organization. It helps establish and maintain a common language across different departments and teams, reducing miscommunication and ensuring consistent interpretation of business concepts. Glossaries can include hierarchical relationships between terms, cross-references, and links to actual data assets, making them invaluable for both business users and technical teams trying to understand and use data correctly.
 *
 * Prerequisites:
 *
 * - Domain must exist and be in an active state.
 *
 * - Owning project must exist and be accessible by the caller.
 *
 * - The glossary name must be unique within the domain.
 */
export const createGlossary: (
  input: CreateGlossaryInput,
) => Effect.Effect<
  CreateGlossaryOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGlossaryInput,
  output: CreateGlossaryOutput,
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
 * Updates a rule. In Amazon DataZone, a rule is a formal agreement that enforces specific requirements across user workflows (e.g., publishing assets to the catalog, requesting subscriptions, creating projects) within the Amazon DataZone data portal. These rules help maintain consistency, ensure compliance, and uphold governance standards in data management processes. For instance, a metadata enforcement rule can specify the required information for creating a subscription request or publishing a data asset to the catalog, ensuring alignment with organizational standards.
 */
export const updateRule: (
  input: UpdateRuleInput,
) => Effect.Effect<
  UpdateRuleOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRuleInput,
  output: UpdateRuleOutput,
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
 * Adds the owner of an entity (a domain unit).
 */
export const addEntityOwner: (
  input: AddEntityOwnerInput,
) => Effect.Effect<
  AddEntityOwnerOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddEntityOwnerInput,
  output: AddEntityOwnerOutput,
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
 * Gets an Amazon DataZone domain.
 */
export const getDomain: (
  input: GetDomainInput,
) => Effect.Effect<
  GetDomainOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainInput,
  output: GetDomainOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes project membership in Amazon DataZone.
 */
export const deleteProjectMembership: (
  input: DeleteProjectMembershipInput,
) => Effect.Effect<
  DeleteProjectMembershipOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProjectMembershipInput,
  output: DeleteProjectMembershipOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Posts time series data points to Amazon DataZone for the specified asset.
 */
export const postTimeSeriesDataPoints: (
  input: PostTimeSeriesDataPointsInput,
) => Effect.Effect<
  PostTimeSeriesDataPointsOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PostTimeSeriesDataPointsInput,
  output: PostTimeSeriesDataPointsOutput,
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
 * Accepts a subscription request to a specific asset.
 */
export const acceptSubscriptionRequest: (
  input: AcceptSubscriptionRequestInput,
) => Effect.Effect<
  AcceptSubscriptionRequestOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptSubscriptionRequestInput,
  output: AcceptSubscriptionRequestOutput,
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
 * Creates an account pool.
 */
export const createAccountPool: (
  input: CreateAccountPoolInput,
) => Effect.Effect<
  CreateAccountPoolOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccountPoolInput,
  output: CreateAccountPoolOutput,
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
 * Creates a Amazon DataZone blueprint.
 */
export const createEnvironmentBlueprint: (
  input: CreateEnvironmentBlueprintInput,
) => Effect.Effect<
  CreateEnvironmentBlueprintOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentBlueprintInput,
  output: CreateEnvironmentBlueprintOutput,
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
 * Creates an Amazon DataZone project.
 */
export const createProject: (
  input: CreateProjectInput,
) => Effect.Effect<
  CreateProjectOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProjectInput,
  output: CreateProjectOutput,
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
 * Creates a subscription request in Amazon DataZone.
 */
export const createSubscriptionRequest: (
  input: CreateSubscriptionRequestInput,
) => Effect.Effect<
  CreateSubscriptionRequestOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSubscriptionRequestInput,
  output: CreateSubscriptionRequestOutput,
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
 * Lists data source run activities.
 */
export const listDataSourceRunActivities: {
  (
    input: ListDataSourceRunActivitiesInput,
  ): Effect.Effect<
    ListDataSourceRunActivitiesOutput,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataSourceRunActivitiesInput,
  ) => Stream.Stream<
    ListDataSourceRunActivitiesOutput,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListDataSourceRunActivitiesInput,
  ) => Stream.Stream<
    DataSourceRunActivity,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDataSourceRunActivitiesInput,
  output: ListDataSourceRunActivitiesOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates an asset in Amazon DataZone catalog.
 *
 * Before creating assets, make sure that the following requirements are met:
 *
 * - `--domain-identifier` must refer to an existing domain.
 *
 * - `--owning-project-identifier` must be a valid project within the domain.
 *
 * - Asset type must be created beforehand using `create-asset-type`, or be a supported system-defined type. For more information, see create-asset-type.
 *
 * - `--type-revision` (if used) must match a valid revision of the asset type.
 *
 * - `formsInput` is required when it is associated as required in the `asset-type`. For more information, see create-form-type.
 *
 * - Form content must include all required fields as per the form schema (e.g., `bucketArn`).
 *
 * You must invoke the following pre-requisite commands before invoking this API:
 *
 * - CreateFormType
 *
 * - CreateAssetType
 */
export const createAsset: (
  input: CreateAssetInput,
) => Effect.Effect<
  CreateAssetOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssetInput,
  output: CreateAssetOutput,
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
 * Creates a custom asset type.
 *
 * Prerequisites:
 *
 * - The `formsInput` field is required, however, can be passed as empty (e.g. `-forms-input {})`.
 *
 * - You must have `CreateAssetType` permissions.
 *
 * - The domain-identifier and owning-project-identifier must be valid and active.
 *
 * - The name of the asset type must be unique within the domain — duplicate names will cause failure.
 *
 * - JSON input must be valid — incorrect formatting causes Invalid JSON errors.
 */
export const createAssetType: (
  input: CreateAssetTypeInput,
) => Effect.Effect<
  CreateAssetTypeOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssetTypeInput,
  output: CreateAssetTypeOutput,
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
 * Creates a project profile.
 */
export const createProjectProfile: (
  input: CreateProjectProfileInput,
) => Effect.Effect<
  CreateProjectProfileOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProjectProfileInput,
  output: CreateProjectProfileOutput,
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
 * Gets a connection. In Amazon DataZone, a connection enables you to connect your resources (domains, projects, and environments) to external resources and services.
 */
export const getConnection: (
  input: GetConnectionInput,
) => Effect.Effect<
  GetConnectionOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectionInput,
  output: GetConnectionOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The details of the job run.
 */
export const getJobRun: (
  input: GetJobRunInput,
) => Effect.Effect<
  GetJobRunOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobRunInput,
  output: GetJobRunOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all Amazon DataZone notifications.
 */
export const listNotifications: {
  (
    input: ListNotificationsInput,
  ): Effect.Effect<
    ListNotificationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListNotificationsInput,
  ) => Stream.Stream<
    ListNotificationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListNotificationsInput,
  ) => Stream.Stream<
    NotificationOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListNotificationsInput,
  output: ListNotificationsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "notifications",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all members of the specified project.
 */
export const listProjectMemberships: {
  (
    input: ListProjectMembershipsInput,
  ): Effect.Effect<
    ListProjectMembershipsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListProjectMembershipsInput,
  ) => Stream.Stream<
    ListProjectMembershipsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListProjectMembershipsInput,
  ) => Stream.Stream<
    ProjectMember,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProjectMembershipsInput,
  output: ListProjectMembershipsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "members",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates the specified project in Amazon DataZone.
 */
export const updateProject: (
  input: UpdateProjectInput,
) => Effect.Effect<
  UpdateProjectOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProjectInput,
  output: UpdateProjectOutput,
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
 * Gets an Amazon DataZone data source.
 */
export const getDataSource: (
  input: GetDataSourceInput,
) => Effect.Effect<
  GetDataSourceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataSourceInput,
  output: GetDataSourceOutput,
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
 * Gets a listing (a record of an asset at a given time). If you specify a listing version, only details that are specific to that version are returned.
 */
export const getListing: (
  input: GetListingInput,
) => Effect.Effect<
  GetListingOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetListingInput,
  output: GetListingOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a rule in Amazon DataZone. A rule is a formal agreement that enforces specific requirements across user workflows (e.g., publishing assets to the catalog, requesting subscriptions, creating projects) within the Amazon DataZone data portal. These rules help maintain consistency, ensure compliance, and uphold governance standards in data management processes. For instance, a metadata enforcement rule can specify the required information for creating a subscription request or publishing a data asset to the catalog, ensuring alignment with organizational standards.
 */
export const createRule: (
  input: CreateRuleInput,
) => Effect.Effect<
  CreateRuleOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRuleInput,
  output: CreateRuleOutput,
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
 * Adds a policy grant (an authorization policy) to a specified entity, including domain units, environment blueprint configurations, or environment profiles.
 */
export const addPolicyGrant: (
  input: AddPolicyGrantInput,
) => Effect.Effect<
  AddPolicyGrantOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddPolicyGrantInput,
  output: AddPolicyGrantOutput,
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
 * Cancels the subscription to the specified asset.
 */
export const cancelSubscription: (
  input: CancelSubscriptionInput,
) => Effect.Effect<
  CancelSubscriptionOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelSubscriptionInput,
  output: CancelSubscriptionOutput,
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
 * Lists lineage events.
 */
export const listLineageEvents: {
  (
    input: ListLineageEventsInput,
  ): Effect.Effect<
    ListLineageEventsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListLineageEventsInput,
  ) => Stream.Stream<
    ListLineageEventsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListLineageEventsInput,
  ) => Stream.Stream<
    LineageEventSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLineageEventsInput,
  output: ListLineageEventsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates a connection. In Amazon DataZone, a connection enables you to connect your resources (domains, projects, and environments) to external resources and services.
 */
export const updateConnection: (
  input: UpdateConnectionInput,
) => Effect.Effect<
  UpdateConnectionOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConnectionInput,
  output: UpdateConnectionOutput,
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
 * Creates an Amazon DataZone data source.
 */
export const createDataSource: (
  input: CreateDataSourceInput,
) => Effect.Effect<
  CreateDataSourceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataSourceInput,
  output: CreateDataSourceOutput,
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
 * Creates a data asset filter.
 *
 * Asset filters provide a sophisticated way to create controlled views of data assets by selecting specific columns or applying row-level filters. This capability is crucial for organizations that need to share data while maintaining security and privacy controls. For example, your database might be filtered to show only non-PII fields to certain users, or sales data might be filtered by region for different regional teams. Asset filters enable fine-grained access control while maintaining a single source of truth.
 *
 * Prerequisites:
 *
 * - A valid domain (`--domain-identifier`) must exist.
 *
 * - A data asset (`--asset-identifier`) must already be created under that domain.
 *
 * - The asset must have the referenced columns available in its schema for column-based filtering.
 *
 * - You cannot specify both (`columnConfiguration`, `rowConfiguration`)at the same time.
 */
export const createAssetFilter: (
  input: CreateAssetFilterInput,
) => Effect.Effect<
  CreateAssetFilterOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssetFilterInput,
  output: CreateAssetFilterOutput,
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
 * Searches for assets in Amazon DataZone.
 *
 * Search in Amazon DataZone is a powerful capability that enables users to discover and explore data assets, glossary terms, and data products across their organization. It provides both basic and advanced search functionality, allowing users to find resources based on names, descriptions, metadata, and other attributes. Search can be scoped to specific types of resources (like assets, glossary terms, or data products) and can be filtered using various criteria such as creation date, owner, or status. The search functionality is essential for making the wealth of data resources in an organization discoverable and usable, helping users find the right data for their needs quickly and efficiently.
 *
 * Many search commands in Amazon DataZone are paginated, including `search` and `search-types`. When the result set is large, Amazon DataZone returns a `nextToken` in the response. This token can be used to retrieve the next page of results.
 *
 * Prerequisites:
 *
 * - The --domain-identifier must refer to an existing Amazon DataZone domain.
 *
 * - --search-scope must be one of: ASSET, GLOSSARY_TERM, DATA_PRODUCT, or GLOSSARY.
 *
 * - The user must have search permissions in the specified domain.
 *
 * - If using --filters, ensure that the JSON is well-formed and that each filter includes valid attribute and value keys.
 *
 * - For paginated results, be prepared to use --next-token to fetch additional pages.
 */
export const search: {
  (
    input: SearchInput,
  ): Effect.Effect<
    SearchOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: SearchInput,
  ) => Stream.Stream<
    SearchOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: SearchInput,
  ) => Stream.Stream<
    SearchInventoryResultItem,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchInput,
  output: SearchOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a new connection. In Amazon DataZone, a connection enables you to connect your resources (domains, projects, and environments) to external resources and services.
 */
export const createConnection: (
  input: CreateConnectionInput,
) => Effect.Effect<
  CreateConnectionOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConnectionInput,
  output: CreateConnectionOutput,
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
 * Searches listings in Amazon DataZone.
 *
 * SearchListings is a powerful capability that enables users to discover and explore published assets and data products across their organization. It provides both basic and advanced search functionality, allowing users to find resources based on names, descriptions, metadata, and other attributes. SearchListings also supports filtering using various criteria such as creation date, owner, or status. This API is essential for making the wealth of data resources in an organization discoverable and usable, helping users find the right data for their needs quickly and efficiently.
 *
 * SearchListings returns results in a paginated format. When the result set is large, the response will include a nextToken, which can be used to retrieve the next page of results.
 *
 * The SearchListings API gives users flexibility in specifying what kind of search is run.
 *
 * To run a free-text search, the `searchText` parameter must be supplied. By default, all searchable fields are indexed for semantic search and will return semantic matches for SearchListings queries. To prevent semantic search indexing for a custom form attribute, see the CreateFormType API documentation. To run a lexical search query, enclose the query with double quotes (""). This will disable semantic search even for fields that have semantic search enabled and will only return results that contain the keywords wrapped by double quotes (order of tokens in the query is not enforced). Free-text search is supported for all attributes annotated with @amazon.datazone#searchable.
 *
 * To run a filtered search, provide filter clause using the filters parameter. To filter on glossary terms, use the special attribute `__DataZoneGlossaryTerms`.
 *
 * To find out whether an attribute has been annotated and indexed for a given search type, use the GetFormType API to retrieve the form containing the attribute.
 */
export const searchListings: {
  (
    input: SearchListingsInput,
  ): Effect.Effect<
    SearchListingsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: SearchListingsInput,
  ) => Stream.Stream<
    SearchListingsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: SearchListingsInput,
  ) => Stream.Stream<
    SearchResultItem,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchListingsInput,
  output: SearchListingsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
