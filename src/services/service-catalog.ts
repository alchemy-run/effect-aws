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
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "Service Catalog",
  serviceShapeName: "AWS242ServiceCatalogService",
});
const auth = T.AwsAuthSigv4({ name: "servicecatalog" });
const ver = T.ServiceVersion("2015-12-10");
const proto = T.AwsProtocolsAwsJson1_1();
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
              `https://servicecatalog-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://servicecatalog-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://servicecatalog.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://servicecatalog.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type AcceptLanguage = string;
export type Id = string;
export type BudgetName = string;
export type PrincipalARN = string;
export type IdempotencyToken = string;
export type ResourceId = string;
export type TagOptionId = string;
export type ProductArn = string;
export type ProductViewName = string;
export type ConstraintParameters = string;
export type ConstraintType = string;
export type ConstraintDescription = string;
export type PortfolioDisplayName = string;
export type PortfolioDescription = string;
export type ProviderName = string;
export type AccountId = string;
export type ProductViewOwner = string;
export type ProductViewShortDescription = string;
export type SupportDescription = string;
export type SupportEmail = string;
export type SupportUrl = string;
export type ProvisionedProductPlanName = string;
export type NotificationArn = string;
export type ProvisionedProductName = string;
export type ServiceActionName = string;
export type ServiceActionDescription = string;
export type TagOptionKey = string;
export type TagOptionValue = string;
export type IgnoreErrors = boolean;
export type PageToken = string;
export type PageSizeMax100 = number;
export type PageSize = number;
export type ProvisioningArtifactName = string;
export type Verbose = boolean;
export type ErrorMessage = string;
export type OutputKey = string;
export type PhysicalId = string;
export type ResourceType = string;
export type EngineWorkflowToken = string;
export type EngineWorkflowFailureReason = string;
export type SortField = string;
export type SearchProvisionedProductsPageSize = number;
export type ProvisionedProductNameOrArn = string;
export type RetainPhysicalResources = boolean;
export type TagKey = string;
export type ProvisioningArtifactDescription = string;
export type ProvisioningArtifactActive = boolean;
export type TagOptionActive = boolean;
export type ProvisioningArtifactPropertyValue = string;
export type TagValue = string;
export type OrganizationNodeValue = string;
export type DisableTemplateValidation = boolean;
export type ParameterKey = string;
export type ParameterValue = string;
export type UsePreviousValue = boolean;
export type ServiceActionDefinitionValue = string;
export type ExecutionParameterKey = string;
export type ExecutionParameterValue = string;
export type AccessLevelFilterValue = string;
export type SearchFilterKey = string;
export type SearchFilterValue = string;
export type OutputValue = string;
export type Description = string;
export type Region = string;
export type StackSetFailureToleranceCount = number;
export type StackSetFailureTolerancePercentage = number;
export type StackSetMaxConcurrencyCount = number;
export type StackSetMaxConcurrencyPercentage = number;
export type ProductViewFilterValue = string;
export type ProvisionedProductViewFilterValue = string;
export type PropertyValue = string;
export type StatusDetail = string;
export type ProvisioningArtifactInfoKey = string;
export type ProvisioningArtifactInfoValue = string;
export type UniqueTagKey = string;
export type UniqueTagValue = string;
export type ServiceActionAssociationErrorMessage = string;
export type CreationTime = Date;
export type SourceRevision = string;
export type Owner = string;
export type ResourceARN = string;
export type ProductViewDistributor = string;
export type HasDefaultPath = boolean;
export type ProvisioningArtifactCreatedTime = Date;
export type PortfolioName = string;
export type CreatedTime = Date;
export type ProvisionedProductType = string;
export type ProvisionedProductId = string;
export type ProvisionedProductStatusMessage = string;
export type LastRequestId = string;
export type RoleArn = string;
export type CloudWatchDashboardName = string;
export type UpdatedTime = Date;
export type StatusMessage = string;
export type LogicalResourceId = string;
export type PhysicalResourceId = string;
export type PlanResourceType = string;
export type DefaultValue = string;
export type ParameterType = string;
export type NoEcho = boolean;
export type InstructionType = string;
export type InstructionValue = string;
export type ProvisioningArtifactOutputKey = string;
export type OutputDescription = string;
export type RecordType = string;
export type ExecutionParameterType = string;
export type ResourceDetailId = string;
export type ResourceDetailARN = string;
export type ResourceDetailName = string;
export type ResourceDetailDescription = string;
export type ResourceDetailCreatedTime = Date;
export type CodeStarConnectionArn = string;
export type Repository = string;
export type RepositoryBranch = string;
export type RepositoryArtifactPath = string;
export type TotalResultsCount = number;
export type Message = string;
export type CausingEntity = string;
export type ErrorCode = string;
export type ErrorDescription = string;
export type RecordTagKey = string;
export type RecordTagValue = string;
export type ProductViewAggregationType = string;
export type UserArn = string;
export type UserArnSession = string;
export type LastSyncTime = Date;
export type LastSyncStatusMessage = string;
export type LastSuccessfulSyncTime = Date;
export type PropertyName = string;
export type AttributeValue = string;
export type ApproximateCount = number;

//# Schemas
export interface DisableAWSOrganizationsAccessInput {}
export const DisableAWSOrganizationsAccessInput = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisableAWSOrganizationsAccessInput",
}) as any as S.Schema<DisableAWSOrganizationsAccessInput>;
export interface DisableAWSOrganizationsAccessOutput {}
export const DisableAWSOrganizationsAccessOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisableAWSOrganizationsAccessOutput",
}) as any as S.Schema<DisableAWSOrganizationsAccessOutput>;
export interface EnableAWSOrganizationsAccessInput {}
export const EnableAWSOrganizationsAccessInput = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "EnableAWSOrganizationsAccessInput",
}) as any as S.Schema<EnableAWSOrganizationsAccessInput>;
export interface EnableAWSOrganizationsAccessOutput {}
export const EnableAWSOrganizationsAccessOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "EnableAWSOrganizationsAccessOutput",
}) as any as S.Schema<EnableAWSOrganizationsAccessOutput>;
export interface GetAWSOrganizationsAccessStatusInput {}
export const GetAWSOrganizationsAccessStatusInput = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAWSOrganizationsAccessStatusInput",
}) as any as S.Schema<GetAWSOrganizationsAccessStatusInput>;
export type PortfolioShareType =
  | "IMPORTED"
  | "AWS_SERVICECATALOG"
  | "AWS_ORGANIZATIONS";
export const PortfolioShareType = S.Literal(
  "IMPORTED",
  "AWS_SERVICECATALOG",
  "AWS_ORGANIZATIONS",
);
export type PrincipalType = "IAM" | "IAM_PATTERN";
export const PrincipalType = S.Literal("IAM", "IAM_PATTERN");
export type CopyOption = "CopyTags";
export const CopyOption = S.Literal("CopyTags");
export type CopyOptions = CopyOption[];
export const CopyOptions = S.Array(CopyOption);
export type ProductType =
  | "CLOUD_FORMATION_TEMPLATE"
  | "MARKETPLACE"
  | "TERRAFORM_OPEN_SOURCE"
  | "TERRAFORM_CLOUD"
  | "EXTERNAL";
export const ProductType = S.Literal(
  "CLOUD_FORMATION_TEMPLATE",
  "MARKETPLACE",
  "TERRAFORM_OPEN_SOURCE",
  "TERRAFORM_CLOUD",
  "EXTERNAL",
);
export type ProvisionedProductPlanType = "CLOUDFORMATION";
export const ProvisionedProductPlanType = S.Literal("CLOUDFORMATION");
export type NotificationArns = string[];
export const NotificationArns = S.Array(S.String);
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export type ServiceActionDefinitionType = "SSM_AUTOMATION";
export const ServiceActionDefinitionType = S.Literal("SSM_AUTOMATION");
export type DescribePortfolioShareType =
  | "ACCOUNT"
  | "ORGANIZATION"
  | "ORGANIZATIONAL_UNIT"
  | "ORGANIZATION_MEMBER_ACCOUNT";
export const DescribePortfolioShareType = S.Literal(
  "ACCOUNT",
  "ORGANIZATION",
  "ORGANIZATIONAL_UNIT",
  "ORGANIZATION_MEMBER_ACCOUNT",
);
export type AccessStatus = "ENABLED" | "UNDER_CHANGE" | "DISABLED";
export const AccessStatus = S.Literal("ENABLED", "UNDER_CHANGE", "DISABLED");
export type OutputKeys = string[];
export const OutputKeys = S.Array(S.String);
export type OrganizationNodeType =
  | "ORGANIZATION"
  | "ORGANIZATIONAL_UNIT"
  | "ACCOUNT";
export const OrganizationNodeType = S.Literal(
  "ORGANIZATION",
  "ORGANIZATIONAL_UNIT",
  "ACCOUNT",
);
export type EngineWorkflowStatus = "SUCCEEDED" | "FAILED";
export const EngineWorkflowStatus = S.Literal("SUCCEEDED", "FAILED");
export type ProductViewSortBy = "Title" | "VersionCount" | "CreationDate";
export const ProductViewSortBy = S.Literal(
  "Title",
  "VersionCount",
  "CreationDate",
);
export type SortOrder = "ASCENDING" | "DESCENDING";
export const SortOrder = S.Literal("ASCENDING", "DESCENDING");
export type ProductSource = "ACCOUNT";
export const ProductSource = S.Literal("ACCOUNT");
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type ProvisioningArtifactGuidance = "DEFAULT" | "DEPRECATED";
export const ProvisioningArtifactGuidance = S.Literal("DEFAULT", "DEPRECATED");
export interface AcceptPortfolioShareInput {
  AcceptLanguage?: string;
  PortfolioId: string;
  PortfolioShareType?: PortfolioShareType;
}
export const AcceptPortfolioShareInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    PortfolioShareType: S.optional(PortfolioShareType),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AcceptPortfolioShareInput",
}) as any as S.Schema<AcceptPortfolioShareInput>;
export interface AcceptPortfolioShareOutput {}
export const AcceptPortfolioShareOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AcceptPortfolioShareOutput",
}) as any as S.Schema<AcceptPortfolioShareOutput>;
export interface AssociateBudgetWithResourceInput {
  BudgetName: string;
  ResourceId: string;
}
export const AssociateBudgetWithResourceInput = S.suspend(() =>
  S.Struct({ BudgetName: S.String, ResourceId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateBudgetWithResourceInput",
}) as any as S.Schema<AssociateBudgetWithResourceInput>;
export interface AssociateBudgetWithResourceOutput {}
export const AssociateBudgetWithResourceOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateBudgetWithResourceOutput",
}) as any as S.Schema<AssociateBudgetWithResourceOutput>;
export interface AssociatePrincipalWithPortfolioInput {
  AcceptLanguage?: string;
  PortfolioId: string;
  PrincipalARN: string;
  PrincipalType: PrincipalType;
}
export const AssociatePrincipalWithPortfolioInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    PrincipalARN: S.String,
    PrincipalType: PrincipalType,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociatePrincipalWithPortfolioInput",
}) as any as S.Schema<AssociatePrincipalWithPortfolioInput>;
export interface AssociatePrincipalWithPortfolioOutput {}
export const AssociatePrincipalWithPortfolioOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociatePrincipalWithPortfolioOutput",
}) as any as S.Schema<AssociatePrincipalWithPortfolioOutput>;
export interface AssociateProductWithPortfolioInput {
  AcceptLanguage?: string;
  ProductId: string;
  PortfolioId: string;
  SourcePortfolioId?: string;
}
export const AssociateProductWithPortfolioInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    ProductId: S.String,
    PortfolioId: S.String,
    SourcePortfolioId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateProductWithPortfolioInput",
}) as any as S.Schema<AssociateProductWithPortfolioInput>;
export interface AssociateProductWithPortfolioOutput {}
export const AssociateProductWithPortfolioOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateProductWithPortfolioOutput",
}) as any as S.Schema<AssociateProductWithPortfolioOutput>;
export interface AssociateServiceActionWithProvisioningArtifactInput {
  ProductId: string;
  ProvisioningArtifactId: string;
  ServiceActionId: string;
  AcceptLanguage?: string;
  IdempotencyToken?: string;
}
export const AssociateServiceActionWithProvisioningArtifactInput = S.suspend(
  () =>
    S.Struct({
      ProductId: S.String,
      ProvisioningArtifactId: S.String,
      ServiceActionId: S.String,
      AcceptLanguage: S.optional(S.String),
      IdempotencyToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "AssociateServiceActionWithProvisioningArtifactInput",
}) as any as S.Schema<AssociateServiceActionWithProvisioningArtifactInput>;
export interface AssociateServiceActionWithProvisioningArtifactOutput {}
export const AssociateServiceActionWithProvisioningArtifactOutput = S.suspend(
  () => S.Struct({}),
).annotations({
  identifier: "AssociateServiceActionWithProvisioningArtifactOutput",
}) as any as S.Schema<AssociateServiceActionWithProvisioningArtifactOutput>;
export interface AssociateTagOptionWithResourceInput {
  ResourceId: string;
  TagOptionId: string;
}
export const AssociateTagOptionWithResourceInput = S.suspend(() =>
  S.Struct({ ResourceId: S.String, TagOptionId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateTagOptionWithResourceInput",
}) as any as S.Schema<AssociateTagOptionWithResourceInput>;
export interface AssociateTagOptionWithResourceOutput {}
export const AssociateTagOptionWithResourceOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateTagOptionWithResourceOutput",
}) as any as S.Schema<AssociateTagOptionWithResourceOutput>;
export interface ServiceActionAssociation {
  ServiceActionId: string;
  ProductId: string;
  ProvisioningArtifactId: string;
}
export const ServiceActionAssociation = S.suspend(() =>
  S.Struct({
    ServiceActionId: S.String,
    ProductId: S.String,
    ProvisioningArtifactId: S.String,
  }),
).annotations({
  identifier: "ServiceActionAssociation",
}) as any as S.Schema<ServiceActionAssociation>;
export type ServiceActionAssociations = ServiceActionAssociation[];
export const ServiceActionAssociations = S.Array(ServiceActionAssociation);
export interface BatchDisassociateServiceActionFromProvisioningArtifactInput {
  ServiceActionAssociations: ServiceActionAssociation[];
  AcceptLanguage?: string;
}
export const BatchDisassociateServiceActionFromProvisioningArtifactInput =
  S.suspend(() =>
    S.Struct({
      ServiceActionAssociations: ServiceActionAssociations,
      AcceptLanguage: S.optional(S.String),
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
  ).annotations({
    identifier: "BatchDisassociateServiceActionFromProvisioningArtifactInput",
  }) as any as S.Schema<BatchDisassociateServiceActionFromProvisioningArtifactInput>;
export interface CreateConstraintInput {
  AcceptLanguage?: string;
  PortfolioId: string;
  ProductId: string;
  Parameters: string;
  Type: string;
  Description?: string;
  IdempotencyToken: string;
}
export const CreateConstraintInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    ProductId: S.String,
    Parameters: S.String,
    Type: S.String,
    Description: S.optional(S.String),
    IdempotencyToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateConstraintInput",
}) as any as S.Schema<CreateConstraintInput>;
export type ProvisioningArtifactInfo = { [key: string]: string };
export const ProvisioningArtifactInfo = S.Record({
  key: S.String,
  value: S.String,
});
export type ProvisioningArtifactType =
  | "CLOUD_FORMATION_TEMPLATE"
  | "MARKETPLACE_AMI"
  | "MARKETPLACE_CAR"
  | "TERRAFORM_OPEN_SOURCE"
  | "TERRAFORM_CLOUD"
  | "EXTERNAL";
export const ProvisioningArtifactType = S.Literal(
  "CLOUD_FORMATION_TEMPLATE",
  "MARKETPLACE_AMI",
  "MARKETPLACE_CAR",
  "TERRAFORM_OPEN_SOURCE",
  "TERRAFORM_CLOUD",
  "EXTERNAL",
);
export interface ProvisioningArtifactProperties {
  Name?: string;
  Description?: string;
  Info?: { [key: string]: string };
  Type?: ProvisioningArtifactType;
  DisableTemplateValidation?: boolean;
}
export const ProvisioningArtifactProperties = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Info: S.optional(ProvisioningArtifactInfo),
    Type: S.optional(ProvisioningArtifactType),
    DisableTemplateValidation: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ProvisioningArtifactProperties",
}) as any as S.Schema<ProvisioningArtifactProperties>;
export interface CreateProvisioningArtifactInput {
  AcceptLanguage?: string;
  ProductId: string;
  Parameters: ProvisioningArtifactProperties;
  IdempotencyToken: string;
}
export const CreateProvisioningArtifactInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    ProductId: S.String,
    Parameters: ProvisioningArtifactProperties,
    IdempotencyToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateProvisioningArtifactInput",
}) as any as S.Schema<CreateProvisioningArtifactInput>;
export interface CreateTagOptionInput {
  Key: string;
  Value: string;
}
export const CreateTagOptionInput = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateTagOptionInput",
}) as any as S.Schema<CreateTagOptionInput>;
export interface DeleteConstraintInput {
  AcceptLanguage?: string;
  Id: string;
}
export const DeleteConstraintInput = S.suspend(() =>
  S.Struct({ AcceptLanguage: S.optional(S.String), Id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteConstraintInput",
}) as any as S.Schema<DeleteConstraintInput>;
export interface DeleteConstraintOutput {}
export const DeleteConstraintOutput = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteConstraintOutput" },
) as any as S.Schema<DeleteConstraintOutput>;
export interface DeletePortfolioInput {
  AcceptLanguage?: string;
  Id: string;
}
export const DeletePortfolioInput = S.suspend(() =>
  S.Struct({ AcceptLanguage: S.optional(S.String), Id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeletePortfolioInput",
}) as any as S.Schema<DeletePortfolioInput>;
export interface DeletePortfolioOutput {}
export const DeletePortfolioOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeletePortfolioOutput",
}) as any as S.Schema<DeletePortfolioOutput>;
export interface OrganizationNode {
  Type?: OrganizationNodeType;
  Value?: string;
}
export const OrganizationNode = S.suspend(() =>
  S.Struct({
    Type: S.optional(OrganizationNodeType),
    Value: S.optional(S.String),
  }),
).annotations({
  identifier: "OrganizationNode",
}) as any as S.Schema<OrganizationNode>;
export interface DeletePortfolioShareInput {
  AcceptLanguage?: string;
  PortfolioId: string;
  AccountId?: string;
  OrganizationNode?: OrganizationNode;
}
export const DeletePortfolioShareInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    AccountId: S.optional(S.String),
    OrganizationNode: S.optional(OrganizationNode),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeletePortfolioShareInput",
}) as any as S.Schema<DeletePortfolioShareInput>;
export interface DeleteProductInput {
  AcceptLanguage?: string;
  Id: string;
}
export const DeleteProductInput = S.suspend(() =>
  S.Struct({ AcceptLanguage: S.optional(S.String), Id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteProductInput",
}) as any as S.Schema<DeleteProductInput>;
export interface DeleteProductOutput {}
export const DeleteProductOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteProductOutput",
}) as any as S.Schema<DeleteProductOutput>;
export interface DeleteProvisionedProductPlanInput {
  AcceptLanguage?: string;
  PlanId: string;
  IgnoreErrors?: boolean;
}
export const DeleteProvisionedProductPlanInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    PlanId: S.String,
    IgnoreErrors: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteProvisionedProductPlanInput",
}) as any as S.Schema<DeleteProvisionedProductPlanInput>;
export interface DeleteProvisionedProductPlanOutput {}
export const DeleteProvisionedProductPlanOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteProvisionedProductPlanOutput",
}) as any as S.Schema<DeleteProvisionedProductPlanOutput>;
export interface DeleteProvisioningArtifactInput {
  AcceptLanguage?: string;
  ProductId: string;
  ProvisioningArtifactId: string;
}
export const DeleteProvisioningArtifactInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    ProductId: S.String,
    ProvisioningArtifactId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteProvisioningArtifactInput",
}) as any as S.Schema<DeleteProvisioningArtifactInput>;
export interface DeleteProvisioningArtifactOutput {}
export const DeleteProvisioningArtifactOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteProvisioningArtifactOutput",
}) as any as S.Schema<DeleteProvisioningArtifactOutput>;
export interface DeleteServiceActionInput {
  Id: string;
  AcceptLanguage?: string;
  IdempotencyToken?: string;
}
export const DeleteServiceActionInput = S.suspend(() =>
  S.Struct({
    Id: S.String,
    AcceptLanguage: S.optional(S.String),
    IdempotencyToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteServiceActionInput",
}) as any as S.Schema<DeleteServiceActionInput>;
export interface DeleteServiceActionOutput {}
export const DeleteServiceActionOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteServiceActionOutput",
}) as any as S.Schema<DeleteServiceActionOutput>;
export interface DeleteTagOptionInput {
  Id: string;
}
export const DeleteTagOptionInput = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpQuery("id")) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteTagOptionInput",
}) as any as S.Schema<DeleteTagOptionInput>;
export interface DeleteTagOptionOutput {}
export const DeleteTagOptionOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteTagOptionOutput",
}) as any as S.Schema<DeleteTagOptionOutput>;
export interface DescribeConstraintInput {
  AcceptLanguage?: string;
  Id: string;
}
export const DescribeConstraintInput = S.suspend(() =>
  S.Struct({ AcceptLanguage: S.optional(S.String), Id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeConstraintInput",
}) as any as S.Schema<DescribeConstraintInput>;
export interface DescribeCopyProductStatusInput {
  AcceptLanguage?: string;
  CopyProductToken: string;
}
export const DescribeCopyProductStatusInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    CopyProductToken: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeCopyProductStatusInput",
}) as any as S.Schema<DescribeCopyProductStatusInput>;
export interface DescribePortfolioInput {
  AcceptLanguage?: string;
  Id: string;
}
export const DescribePortfolioInput = S.suspend(() =>
  S.Struct({ AcceptLanguage: S.optional(S.String), Id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribePortfolioInput",
}) as any as S.Schema<DescribePortfolioInput>;
export interface DescribePortfolioSharesInput {
  PortfolioId: string;
  Type: DescribePortfolioShareType;
  PageToken?: string;
  PageSize?: number;
}
export const DescribePortfolioSharesInput = S.suspend(() =>
  S.Struct({
    PortfolioId: S.String,
    Type: DescribePortfolioShareType,
    PageToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribePortfolioSharesInput",
}) as any as S.Schema<DescribePortfolioSharesInput>;
export interface DescribePortfolioShareStatusInput {
  PortfolioShareToken: string;
}
export const DescribePortfolioShareStatusInput = S.suspend(() =>
  S.Struct({ PortfolioShareToken: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribePortfolioShareStatusInput",
}) as any as S.Schema<DescribePortfolioShareStatusInput>;
export interface DescribeProductInput {
  AcceptLanguage?: string;
  Id?: string;
  Name?: string;
}
export const DescribeProductInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeProductInput",
}) as any as S.Schema<DescribeProductInput>;
export interface DescribeProductAsAdminInput {
  AcceptLanguage?: string;
  Id?: string;
  Name?: string;
  SourcePortfolioId?: string;
}
export const DescribeProductAsAdminInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    SourcePortfolioId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeProductAsAdminInput",
}) as any as S.Schema<DescribeProductAsAdminInput>;
export interface DescribeProductViewInput {
  AcceptLanguage?: string;
  Id: string;
}
export const DescribeProductViewInput = S.suspend(() =>
  S.Struct({ AcceptLanguage: S.optional(S.String), Id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeProductViewInput",
}) as any as S.Schema<DescribeProductViewInput>;
export interface DescribeProvisionedProductInput {
  AcceptLanguage?: string;
  Id?: string;
  Name?: string;
}
export const DescribeProvisionedProductInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeProvisionedProductInput",
}) as any as S.Schema<DescribeProvisionedProductInput>;
export interface DescribeProvisionedProductPlanInput {
  AcceptLanguage?: string;
  PlanId: string;
  PageSize?: number;
  PageToken?: string;
}
export const DescribeProvisionedProductPlanInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    PlanId: S.String,
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeProvisionedProductPlanInput",
}) as any as S.Schema<DescribeProvisionedProductPlanInput>;
export interface DescribeProvisioningArtifactInput {
  AcceptLanguage?: string;
  ProvisioningArtifactId?: string;
  ProductId?: string;
  ProvisioningArtifactName?: string;
  ProductName?: string;
  Verbose?: boolean;
  IncludeProvisioningArtifactParameters?: boolean;
}
export const DescribeProvisioningArtifactInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    ProvisioningArtifactId: S.optional(S.String),
    ProductId: S.optional(S.String),
    ProvisioningArtifactName: S.optional(S.String),
    ProductName: S.optional(S.String),
    Verbose: S.optional(S.Boolean),
    IncludeProvisioningArtifactParameters: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeProvisioningArtifactInput",
}) as any as S.Schema<DescribeProvisioningArtifactInput>;
export interface DescribeProvisioningParametersInput {
  AcceptLanguage?: string;
  ProductId?: string;
  ProductName?: string;
  ProvisioningArtifactId?: string;
  ProvisioningArtifactName?: string;
  PathId?: string;
  PathName?: string;
}
export const DescribeProvisioningParametersInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    ProductId: S.optional(S.String),
    ProductName: S.optional(S.String),
    ProvisioningArtifactId: S.optional(S.String),
    ProvisioningArtifactName: S.optional(S.String),
    PathId: S.optional(S.String),
    PathName: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeProvisioningParametersInput",
}) as any as S.Schema<DescribeProvisioningParametersInput>;
export interface DescribeRecordInput {
  AcceptLanguage?: string;
  Id: string;
  PageToken?: string;
  PageSize?: number;
}
export const DescribeRecordInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    Id: S.String,
    PageToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeRecordInput",
}) as any as S.Schema<DescribeRecordInput>;
export interface DescribeServiceActionInput {
  Id: string;
  AcceptLanguage?: string;
}
export const DescribeServiceActionInput = S.suspend(() =>
  S.Struct({ Id: S.String, AcceptLanguage: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeServiceActionInput",
}) as any as S.Schema<DescribeServiceActionInput>;
export interface DescribeServiceActionExecutionParametersInput {
  ProvisionedProductId: string;
  ServiceActionId: string;
  AcceptLanguage?: string;
}
export const DescribeServiceActionExecutionParametersInput = S.suspend(() =>
  S.Struct({
    ProvisionedProductId: S.String,
    ServiceActionId: S.String,
    AcceptLanguage: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeServiceActionExecutionParametersInput",
}) as any as S.Schema<DescribeServiceActionExecutionParametersInput>;
export interface DescribeTagOptionInput {
  Id: string;
}
export const DescribeTagOptionInput = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpQuery("id")) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeTagOptionInput",
}) as any as S.Schema<DescribeTagOptionInput>;
export interface DisassociateBudgetFromResourceInput {
  BudgetName: string;
  ResourceId: string;
}
export const DisassociateBudgetFromResourceInput = S.suspend(() =>
  S.Struct({ BudgetName: S.String, ResourceId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateBudgetFromResourceInput",
}) as any as S.Schema<DisassociateBudgetFromResourceInput>;
export interface DisassociateBudgetFromResourceOutput {}
export const DisassociateBudgetFromResourceOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateBudgetFromResourceOutput",
}) as any as S.Schema<DisassociateBudgetFromResourceOutput>;
export interface DisassociatePrincipalFromPortfolioInput {
  AcceptLanguage?: string;
  PortfolioId: string;
  PrincipalARN: string;
  PrincipalType?: PrincipalType;
}
export const DisassociatePrincipalFromPortfolioInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    PrincipalARN: S.String,
    PrincipalType: S.optional(PrincipalType),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociatePrincipalFromPortfolioInput",
}) as any as S.Schema<DisassociatePrincipalFromPortfolioInput>;
export interface DisassociatePrincipalFromPortfolioOutput {}
export const DisassociatePrincipalFromPortfolioOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociatePrincipalFromPortfolioOutput",
}) as any as S.Schema<DisassociatePrincipalFromPortfolioOutput>;
export interface DisassociateProductFromPortfolioInput {
  AcceptLanguage?: string;
  ProductId: string;
  PortfolioId: string;
}
export const DisassociateProductFromPortfolioInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    ProductId: S.String,
    PortfolioId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateProductFromPortfolioInput",
}) as any as S.Schema<DisassociateProductFromPortfolioInput>;
export interface DisassociateProductFromPortfolioOutput {}
export const DisassociateProductFromPortfolioOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateProductFromPortfolioOutput",
}) as any as S.Schema<DisassociateProductFromPortfolioOutput>;
export interface DisassociateServiceActionFromProvisioningArtifactInput {
  ProductId: string;
  ProvisioningArtifactId: string;
  ServiceActionId: string;
  AcceptLanguage?: string;
  IdempotencyToken?: string;
}
export const DisassociateServiceActionFromProvisioningArtifactInput = S.suspend(
  () =>
    S.Struct({
      ProductId: S.String,
      ProvisioningArtifactId: S.String,
      ServiceActionId: S.String,
      AcceptLanguage: S.optional(S.String),
      IdempotencyToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "DisassociateServiceActionFromProvisioningArtifactInput",
}) as any as S.Schema<DisassociateServiceActionFromProvisioningArtifactInput>;
export interface DisassociateServiceActionFromProvisioningArtifactOutput {}
export const DisassociateServiceActionFromProvisioningArtifactOutput =
  S.suspend(() => S.Struct({})).annotations({
    identifier: "DisassociateServiceActionFromProvisioningArtifactOutput",
  }) as any as S.Schema<DisassociateServiceActionFromProvisioningArtifactOutput>;
export interface DisassociateTagOptionFromResourceInput {
  ResourceId: string;
  TagOptionId: string;
}
export const DisassociateTagOptionFromResourceInput = S.suspend(() =>
  S.Struct({
    ResourceId: S.String.pipe(T.HttpQuery("resourceId")),
    TagOptionId: S.String.pipe(T.HttpQuery("tagOptionId")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateTagOptionFromResourceInput",
}) as any as S.Schema<DisassociateTagOptionFromResourceInput>;
export interface DisassociateTagOptionFromResourceOutput {}
export const DisassociateTagOptionFromResourceOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateTagOptionFromResourceOutput",
}) as any as S.Schema<DisassociateTagOptionFromResourceOutput>;
export interface ExecuteProvisionedProductPlanInput {
  AcceptLanguage?: string;
  PlanId: string;
  IdempotencyToken: string;
}
export const ExecuteProvisionedProductPlanInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    PlanId: S.String,
    IdempotencyToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ExecuteProvisionedProductPlanInput",
}) as any as S.Schema<ExecuteProvisionedProductPlanInput>;
export interface GetAWSOrganizationsAccessStatusOutput {
  AccessStatus?: AccessStatus;
}
export const GetAWSOrganizationsAccessStatusOutput = S.suspend(() =>
  S.Struct({ AccessStatus: S.optional(AccessStatus) }),
).annotations({
  identifier: "GetAWSOrganizationsAccessStatusOutput",
}) as any as S.Schema<GetAWSOrganizationsAccessStatusOutput>;
export interface GetProvisionedProductOutputsInput {
  AcceptLanguage?: string;
  ProvisionedProductId?: string;
  ProvisionedProductName?: string;
  OutputKeys?: string[];
  PageSize?: number;
  PageToken?: string;
}
export const GetProvisionedProductOutputsInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    ProvisionedProductId: S.optional(S.String),
    ProvisionedProductName: S.optional(S.String),
    OutputKeys: S.optional(OutputKeys),
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetProvisionedProductOutputsInput",
}) as any as S.Schema<GetProvisionedProductOutputsInput>;
export interface ImportAsProvisionedProductInput {
  AcceptLanguage?: string;
  ProductId: string;
  ProvisioningArtifactId: string;
  ProvisionedProductName: string;
  PhysicalId: string;
  IdempotencyToken: string;
}
export const ImportAsProvisionedProductInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    ProductId: S.String,
    ProvisioningArtifactId: S.String,
    ProvisionedProductName: S.String,
    PhysicalId: S.String,
    IdempotencyToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ImportAsProvisionedProductInput",
}) as any as S.Schema<ImportAsProvisionedProductInput>;
export interface ListAcceptedPortfolioSharesInput {
  AcceptLanguage?: string;
  PageToken?: string;
  PageSize?: number;
  PortfolioShareType?: PortfolioShareType;
}
export const ListAcceptedPortfolioSharesInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    PageToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
    PortfolioShareType: S.optional(PortfolioShareType),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAcceptedPortfolioSharesInput",
}) as any as S.Schema<ListAcceptedPortfolioSharesInput>;
export interface ListBudgetsForResourceInput {
  AcceptLanguage?: string;
  ResourceId: string;
  PageSize?: number;
  PageToken?: string;
}
export const ListBudgetsForResourceInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    ResourceId: S.String,
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListBudgetsForResourceInput",
}) as any as S.Schema<ListBudgetsForResourceInput>;
export interface ListConstraintsForPortfolioInput {
  AcceptLanguage?: string;
  PortfolioId: string;
  ProductId?: string;
  PageSize?: number;
  PageToken?: string;
}
export const ListConstraintsForPortfolioInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    ProductId: S.optional(S.String),
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListConstraintsForPortfolioInput",
}) as any as S.Schema<ListConstraintsForPortfolioInput>;
export interface ListLaunchPathsInput {
  AcceptLanguage?: string;
  ProductId: string;
  PageSize?: number;
  PageToken?: string;
}
export const ListLaunchPathsInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    ProductId: S.String,
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListLaunchPathsInput",
}) as any as S.Schema<ListLaunchPathsInput>;
export interface ListOrganizationPortfolioAccessInput {
  AcceptLanguage?: string;
  PortfolioId: string;
  OrganizationNodeType: OrganizationNodeType;
  PageToken?: string;
  PageSize?: number;
}
export const ListOrganizationPortfolioAccessInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    OrganizationNodeType: OrganizationNodeType,
    PageToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListOrganizationPortfolioAccessInput",
}) as any as S.Schema<ListOrganizationPortfolioAccessInput>;
export interface ListPortfolioAccessInput {
  AcceptLanguage?: string;
  PortfolioId: string;
  OrganizationParentId?: string;
  PageToken?: string;
  PageSize?: number;
}
export const ListPortfolioAccessInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    OrganizationParentId: S.optional(S.String),
    PageToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPortfolioAccessInput",
}) as any as S.Schema<ListPortfolioAccessInput>;
export interface ListPortfoliosInput {
  AcceptLanguage?: string;
  PageToken?: string;
  PageSize?: number;
}
export const ListPortfoliosInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    PageToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPortfoliosInput",
}) as any as S.Schema<ListPortfoliosInput>;
export interface ListPortfoliosForProductInput {
  AcceptLanguage?: string;
  ProductId: string;
  PageToken?: string;
  PageSize?: number;
}
export const ListPortfoliosForProductInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    ProductId: S.String,
    PageToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPortfoliosForProductInput",
}) as any as S.Schema<ListPortfoliosForProductInput>;
export interface ListPrincipalsForPortfolioInput {
  AcceptLanguage?: string;
  PortfolioId: string;
  PageSize?: number;
  PageToken?: string;
}
export const ListPrincipalsForPortfolioInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPrincipalsForPortfolioInput",
}) as any as S.Schema<ListPrincipalsForPortfolioInput>;
export interface ListProvisioningArtifactsInput {
  AcceptLanguage?: string;
  ProductId: string;
}
export const ListProvisioningArtifactsInput = S.suspend(() =>
  S.Struct({ AcceptLanguage: S.optional(S.String), ProductId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListProvisioningArtifactsInput",
}) as any as S.Schema<ListProvisioningArtifactsInput>;
export interface ListProvisioningArtifactsForServiceActionInput {
  ServiceActionId: string;
  PageSize?: number;
  PageToken?: string;
  AcceptLanguage?: string;
}
export const ListProvisioningArtifactsForServiceActionInput = S.suspend(() =>
  S.Struct({
    ServiceActionId: S.String,
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
    AcceptLanguage: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListProvisioningArtifactsForServiceActionInput",
}) as any as S.Schema<ListProvisioningArtifactsForServiceActionInput>;
export interface ListResourcesForTagOptionInput {
  TagOptionId: string;
  ResourceType?: string;
  PageSize?: number;
  PageToken?: string;
}
export const ListResourcesForTagOptionInput = S.suspend(() =>
  S.Struct({
    TagOptionId: S.String.pipe(T.HttpQuery("tagOptionId")),
    ResourceType: S.optional(S.String).pipe(T.HttpQuery("resourceType")),
    PageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
    PageToken: S.optional(S.String).pipe(T.HttpQuery("pageToken")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListResourcesForTagOptionInput",
}) as any as S.Schema<ListResourcesForTagOptionInput>;
export interface ListServiceActionsInput {
  AcceptLanguage?: string;
  PageSize?: number;
  PageToken?: string;
}
export const ListServiceActionsInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListServiceActionsInput",
}) as any as S.Schema<ListServiceActionsInput>;
export interface ListServiceActionsForProvisioningArtifactInput {
  ProductId: string;
  ProvisioningArtifactId: string;
  PageSize?: number;
  PageToken?: string;
  AcceptLanguage?: string;
}
export const ListServiceActionsForProvisioningArtifactInput = S.suspend(() =>
  S.Struct({
    ProductId: S.String,
    ProvisioningArtifactId: S.String,
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
    AcceptLanguage: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListServiceActionsForProvisioningArtifactInput",
}) as any as S.Schema<ListServiceActionsForProvisioningArtifactInput>;
export interface ListStackInstancesForProvisionedProductInput {
  AcceptLanguage?: string;
  ProvisionedProductId: string;
  PageToken?: string;
  PageSize?: number;
}
export const ListStackInstancesForProvisionedProductInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    ProvisionedProductId: S.String,
    PageToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListStackInstancesForProvisionedProductInput",
}) as any as S.Schema<ListStackInstancesForProvisionedProductInput>;
export interface NotifyTerminateProvisionedProductEngineWorkflowResultInput {
  WorkflowToken: string;
  RecordId: string;
  Status: EngineWorkflowStatus;
  FailureReason?: string;
  IdempotencyToken: string;
}
export const NotifyTerminateProvisionedProductEngineWorkflowResultInput =
  S.suspend(() =>
    S.Struct({
      WorkflowToken: S.String,
      RecordId: S.String,
      Status: EngineWorkflowStatus,
      FailureReason: S.optional(S.String),
      IdempotencyToken: S.String.pipe(T.IdempotencyToken()),
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
  ).annotations({
    identifier: "NotifyTerminateProvisionedProductEngineWorkflowResultInput",
  }) as any as S.Schema<NotifyTerminateProvisionedProductEngineWorkflowResultInput>;
export interface NotifyTerminateProvisionedProductEngineWorkflowResultOutput {}
export const NotifyTerminateProvisionedProductEngineWorkflowResultOutput =
  S.suspend(() => S.Struct({})).annotations({
    identifier: "NotifyTerminateProvisionedProductEngineWorkflowResultOutput",
  }) as any as S.Schema<NotifyTerminateProvisionedProductEngineWorkflowResultOutput>;
export interface RecordOutput {
  OutputKey?: string;
  OutputValue?: string;
  Description?: string;
}
export const RecordOutput = S.suspend(() =>
  S.Struct({
    OutputKey: S.optional(S.String),
    OutputValue: S.optional(S.String),
    Description: S.optional(S.String),
  }),
).annotations({ identifier: "RecordOutput" }) as any as S.Schema<RecordOutput>;
export type RecordOutputs = RecordOutput[];
export const RecordOutputs = S.Array(RecordOutput);
export interface NotifyUpdateProvisionedProductEngineWorkflowResultInput {
  WorkflowToken: string;
  RecordId: string;
  Status: EngineWorkflowStatus;
  FailureReason?: string;
  Outputs?: RecordOutput[];
  IdempotencyToken: string;
}
export const NotifyUpdateProvisionedProductEngineWorkflowResultInput =
  S.suspend(() =>
    S.Struct({
      WorkflowToken: S.String,
      RecordId: S.String,
      Status: EngineWorkflowStatus,
      FailureReason: S.optional(S.String),
      Outputs: S.optional(RecordOutputs),
      IdempotencyToken: S.String.pipe(T.IdempotencyToken()),
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
  ).annotations({
    identifier: "NotifyUpdateProvisionedProductEngineWorkflowResultInput",
  }) as any as S.Schema<NotifyUpdateProvisionedProductEngineWorkflowResultInput>;
export interface NotifyUpdateProvisionedProductEngineWorkflowResultOutput {}
export const NotifyUpdateProvisionedProductEngineWorkflowResultOutput =
  S.suspend(() => S.Struct({})).annotations({
    identifier: "NotifyUpdateProvisionedProductEngineWorkflowResultOutput",
  }) as any as S.Schema<NotifyUpdateProvisionedProductEngineWorkflowResultOutput>;
export interface RejectPortfolioShareInput {
  AcceptLanguage?: string;
  PortfolioId: string;
  PortfolioShareType?: PortfolioShareType;
}
export const RejectPortfolioShareInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    PortfolioShareType: S.optional(PortfolioShareType),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RejectPortfolioShareInput",
}) as any as S.Schema<RejectPortfolioShareInput>;
export interface RejectPortfolioShareOutput {}
export const RejectPortfolioShareOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RejectPortfolioShareOutput",
}) as any as S.Schema<RejectPortfolioShareOutput>;
export type AccessLevelFilterKey = "Account" | "Role" | "User";
export const AccessLevelFilterKey = S.Literal("Account", "Role", "User");
export interface AccessLevelFilter {
  Key?: AccessLevelFilterKey;
  Value?: string;
}
export const AccessLevelFilter = S.suspend(() =>
  S.Struct({
    Key: S.optional(AccessLevelFilterKey),
    Value: S.optional(S.String),
  }),
).annotations({
  identifier: "AccessLevelFilter",
}) as any as S.Schema<AccessLevelFilter>;
export interface ScanProvisionedProductsInput {
  AcceptLanguage?: string;
  AccessLevelFilter?: AccessLevelFilter;
  PageSize?: number;
  PageToken?: string;
}
export const ScanProvisionedProductsInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    AccessLevelFilter: S.optional(AccessLevelFilter),
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ScanProvisionedProductsInput",
}) as any as S.Schema<ScanProvisionedProductsInput>;
export type ProductViewFilterBy =
  | "FullTextSearch"
  | "Owner"
  | "ProductType"
  | "SourceProductId";
export const ProductViewFilterBy = S.Literal(
  "FullTextSearch",
  "Owner",
  "ProductType",
  "SourceProductId",
);
export type ProductViewFilterValues = string[];
export const ProductViewFilterValues = S.Array(S.String);
export type ProductViewFilters = { [key in ProductViewFilterBy]?: string[] };
export const ProductViewFilters = S.partial(
  S.Record({ key: ProductViewFilterBy, value: ProductViewFilterValues }),
);
export interface SearchProductsAsAdminInput {
  AcceptLanguage?: string;
  PortfolioId?: string;
  Filters?: { [key: string]: string[] };
  SortBy?: ProductViewSortBy;
  SortOrder?: SortOrder;
  PageToken?: string;
  PageSize?: number;
  ProductSource?: ProductSource;
}
export const SearchProductsAsAdminInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.optional(S.String),
    Filters: S.optional(ProductViewFilters),
    SortBy: S.optional(ProductViewSortBy),
    SortOrder: S.optional(SortOrder),
    PageToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
    ProductSource: S.optional(ProductSource),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SearchProductsAsAdminInput",
}) as any as S.Schema<SearchProductsAsAdminInput>;
export interface TerminateProvisionedProductInput {
  ProvisionedProductName?: string;
  ProvisionedProductId?: string;
  TerminateToken: string;
  IgnoreErrors?: boolean;
  AcceptLanguage?: string;
  RetainPhysicalResources?: boolean;
}
export const TerminateProvisionedProductInput = S.suspend(() =>
  S.Struct({
    ProvisionedProductName: S.optional(S.String),
    ProvisionedProductId: S.optional(S.String),
    TerminateToken: S.String.pipe(T.IdempotencyToken()),
    IgnoreErrors: S.optional(S.Boolean),
    AcceptLanguage: S.optional(S.String),
    RetainPhysicalResources: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TerminateProvisionedProductInput",
}) as any as S.Schema<TerminateProvisionedProductInput>;
export interface UpdateConstraintInput {
  AcceptLanguage?: string;
  Id: string;
  Description?: string;
  Parameters?: string;
}
export const UpdateConstraintInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    Id: S.String,
    Description: S.optional(S.String),
    Parameters: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateConstraintInput",
}) as any as S.Schema<UpdateConstraintInput>;
export type AddTags = Tag[];
export const AddTags = S.Array(Tag);
export interface UpdatePortfolioInput {
  AcceptLanguage?: string;
  Id: string;
  DisplayName?: string;
  Description?: string;
  ProviderName?: string;
  AddTags?: Tag[];
  RemoveTags?: string[];
}
export const UpdatePortfolioInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    Id: S.String,
    DisplayName: S.optional(S.String),
    Description: S.optional(S.String),
    ProviderName: S.optional(S.String),
    AddTags: S.optional(AddTags),
    RemoveTags: S.optional(TagKeys),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdatePortfolioInput",
}) as any as S.Schema<UpdatePortfolioInput>;
export interface UpdatePortfolioShareInput {
  AcceptLanguage?: string;
  PortfolioId: string;
  AccountId?: string;
  OrganizationNode?: OrganizationNode;
  ShareTagOptions?: boolean;
  SharePrincipals?: boolean;
}
export const UpdatePortfolioShareInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    AccountId: S.optional(S.String),
    OrganizationNode: S.optional(OrganizationNode),
    ShareTagOptions: S.optional(S.Boolean),
    SharePrincipals: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdatePortfolioShareInput",
}) as any as S.Schema<UpdatePortfolioShareInput>;
export type SourceType = "CODESTAR";
export const SourceType = S.Literal("CODESTAR");
export interface CodeStarParameters {
  ConnectionArn: string;
  Repository: string;
  Branch: string;
  ArtifactPath: string;
}
export const CodeStarParameters = S.suspend(() =>
  S.Struct({
    ConnectionArn: S.String,
    Repository: S.String,
    Branch: S.String,
    ArtifactPath: S.String,
  }),
).annotations({
  identifier: "CodeStarParameters",
}) as any as S.Schema<CodeStarParameters>;
export interface SourceConnectionParameters {
  CodeStar?: CodeStarParameters;
}
export const SourceConnectionParameters = S.suspend(() =>
  S.Struct({ CodeStar: S.optional(CodeStarParameters) }),
).annotations({
  identifier: "SourceConnectionParameters",
}) as any as S.Schema<SourceConnectionParameters>;
export interface SourceConnection {
  Type?: SourceType;
  ConnectionParameters: SourceConnectionParameters;
}
export const SourceConnection = S.suspend(() =>
  S.Struct({
    Type: S.optional(SourceType),
    ConnectionParameters: SourceConnectionParameters,
  }),
).annotations({
  identifier: "SourceConnection",
}) as any as S.Schema<SourceConnection>;
export interface UpdateProductInput {
  AcceptLanguage?: string;
  Id: string;
  Name?: string;
  Owner?: string;
  Description?: string;
  Distributor?: string;
  SupportDescription?: string;
  SupportEmail?: string;
  SupportUrl?: string;
  AddTags?: Tag[];
  RemoveTags?: string[];
  SourceConnection?: SourceConnection;
}
export const UpdateProductInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    Id: S.String,
    Name: S.optional(S.String),
    Owner: S.optional(S.String),
    Description: S.optional(S.String),
    Distributor: S.optional(S.String),
    SupportDescription: S.optional(S.String),
    SupportEmail: S.optional(S.String),
    SupportUrl: S.optional(S.String),
    AddTags: S.optional(AddTags),
    RemoveTags: S.optional(TagKeys),
    SourceConnection: S.optional(SourceConnection),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateProductInput",
}) as any as S.Schema<UpdateProductInput>;
export interface UpdateProvisioningArtifactInput {
  AcceptLanguage?: string;
  ProductId: string;
  ProvisioningArtifactId: string;
  Name?: string;
  Description?: string;
  Active?: boolean;
  Guidance?: ProvisioningArtifactGuidance;
}
export const UpdateProvisioningArtifactInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    ProductId: S.String,
    ProvisioningArtifactId: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Active: S.optional(S.Boolean),
    Guidance: S.optional(ProvisioningArtifactGuidance),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateProvisioningArtifactInput",
}) as any as S.Schema<UpdateProvisioningArtifactInput>;
export type ServiceActionDefinitionKey =
  | "Name"
  | "Version"
  | "AssumeRole"
  | "Parameters";
export const ServiceActionDefinitionKey = S.Literal(
  "Name",
  "Version",
  "AssumeRole",
  "Parameters",
);
export type ServiceActionDefinitionMap = {
  [key in ServiceActionDefinitionKey]?: string;
};
export const ServiceActionDefinitionMap = S.partial(
  S.Record({ key: ServiceActionDefinitionKey, value: S.String }),
);
export interface UpdateServiceActionInput {
  Id: string;
  Name?: string;
  Definition?: { [key: string]: string };
  Description?: string;
  AcceptLanguage?: string;
}
export const UpdateServiceActionInput = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Name: S.optional(S.String),
    Definition: S.optional(ServiceActionDefinitionMap),
    Description: S.optional(S.String),
    AcceptLanguage: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateServiceActionInput",
}) as any as S.Schema<UpdateServiceActionInput>;
export interface UpdateTagOptionInput {
  Id: string;
  Value?: string;
  Active?: boolean;
}
export const UpdateTagOptionInput = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Value: S.optional(S.String),
    Active: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateTagOptionInput",
}) as any as S.Schema<UpdateTagOptionInput>;
export type ProvisioningArtifactPropertyName = "Id";
export const ProvisioningArtifactPropertyName = S.Literal("Id");
export type ExecutionParameterValueList = string[];
export const ExecutionParameterValueList = S.Array(S.String);
export type StackSetAccounts = string[];
export const StackSetAccounts = S.Array(S.String);
export type StackSetRegions = string[];
export const StackSetRegions = S.Array(S.String);
export type ProvisionedProductViewFilterBy = "SearchQuery";
export const ProvisionedProductViewFilterBy = S.Literal("SearchQuery");
export type ProvisionedProductViewFilterValues = string[];
export const ProvisionedProductViewFilterValues = S.Array(S.String);
export type StackSetOperationType = "CREATE" | "UPDATE" | "DELETE";
export const StackSetOperationType = S.Literal("CREATE", "UPDATE", "DELETE");
export type PropertyKey = "OWNER" | "LAUNCH_ROLE";
export const PropertyKey = S.Literal("OWNER", "LAUNCH_ROLE");
export type SourceProvisioningArtifactPropertiesMap = {
  [key in ProvisioningArtifactPropertyName]?: string;
};
export const SourceProvisioningArtifactPropertiesMap = S.partial(
  S.Record({ key: ProvisioningArtifactPropertyName, value: S.String }),
);
export type SourceProvisioningArtifactProperties = { [key: string]: string }[];
export const SourceProvisioningArtifactProperties = S.Array(
  SourceProvisioningArtifactPropertiesMap,
);
export type Status = "AVAILABLE" | "CREATING" | "FAILED";
export const Status = S.Literal("AVAILABLE", "CREATING", "FAILED");
export interface UpdateProvisioningParameter {
  Key?: string;
  Value?: string;
  UsePreviousValue?: boolean;
}
export const UpdateProvisioningParameter = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Value: S.optional(S.String),
    UsePreviousValue: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "UpdateProvisioningParameter",
}) as any as S.Schema<UpdateProvisioningParameter>;
export type UpdateProvisioningParameters = UpdateProvisioningParameter[];
export const UpdateProvisioningParameters = S.Array(
  UpdateProvisioningParameter,
);
export type CopyProductStatus = "SUCCEEDED" | "IN_PROGRESS" | "FAILED";
export const CopyProductStatus = S.Literal(
  "SUCCEEDED",
  "IN_PROGRESS",
  "FAILED",
);
export interface TagOptionDetail {
  Key?: string;
  Value?: string;
  Active?: boolean;
  Id?: string;
  Owner?: string;
}
export const TagOptionDetail = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Value: S.optional(S.String),
    Active: S.optional(S.Boolean),
    Id: S.optional(S.String),
    Owner: S.optional(S.String),
  }),
).annotations({
  identifier: "TagOptionDetail",
}) as any as S.Schema<TagOptionDetail>;
export type TagOptionDetails = TagOptionDetail[];
export const TagOptionDetails = S.Array(TagOptionDetail);
export type ShareStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "COMPLETED_WITH_ERRORS"
  | "ERROR";
export const ShareStatus = S.Literal(
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
  "COMPLETED_WITH_ERRORS",
  "ERROR",
);
export type ExecutionParameterMap = { [key: string]: string[] };
export const ExecutionParameterMap = S.Record({
  key: S.String,
  value: ExecutionParameterValueList,
});
export interface PortfolioDetail {
  Id?: string;
  ARN?: string;
  DisplayName?: string;
  Description?: string;
  CreatedTime?: Date;
  ProviderName?: string;
}
export const PortfolioDetail = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    ARN: S.optional(S.String),
    DisplayName: S.optional(S.String),
    Description: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ProviderName: S.optional(S.String),
  }),
).annotations({
  identifier: "PortfolioDetail",
}) as any as S.Schema<PortfolioDetail>;
export type PortfolioDetails = PortfolioDetail[];
export const PortfolioDetails = S.Array(PortfolioDetail);
export interface ConstraintDetail {
  ConstraintId?: string;
  Type?: string;
  Description?: string;
  Owner?: string;
  ProductId?: string;
  PortfolioId?: string;
}
export const ConstraintDetail = S.suspend(() =>
  S.Struct({
    ConstraintId: S.optional(S.String),
    Type: S.optional(S.String),
    Description: S.optional(S.String),
    Owner: S.optional(S.String),
    ProductId: S.optional(S.String),
    PortfolioId: S.optional(S.String),
  }),
).annotations({
  identifier: "ConstraintDetail",
}) as any as S.Schema<ConstraintDetail>;
export type ConstraintDetails = ConstraintDetail[];
export const ConstraintDetails = S.Array(ConstraintDetail);
export type OrganizationNodes = OrganizationNode[];
export const OrganizationNodes = S.Array(OrganizationNode);
export type AccountIds = string[];
export const AccountIds = S.Array(S.String);
export interface ProvisioningArtifactDetail {
  Id?: string;
  Name?: string;
  Description?: string;
  Type?: ProvisioningArtifactType;
  CreatedTime?: Date;
  Active?: boolean;
  Guidance?: ProvisioningArtifactGuidance;
  SourceRevision?: string;
}
export const ProvisioningArtifactDetail = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Type: S.optional(ProvisioningArtifactType),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Active: S.optional(S.Boolean),
    Guidance: S.optional(ProvisioningArtifactGuidance),
    SourceRevision: S.optional(S.String),
  }),
).annotations({
  identifier: "ProvisioningArtifactDetail",
}) as any as S.Schema<ProvisioningArtifactDetail>;
export type ProvisioningArtifactDetails = ProvisioningArtifactDetail[];
export const ProvisioningArtifactDetails = S.Array(ProvisioningArtifactDetail);
export interface ListRecordHistorySearchFilter {
  Key?: string;
  Value?: string;
}
export const ListRecordHistorySearchFilter = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "ListRecordHistorySearchFilter",
}) as any as S.Schema<ListRecordHistorySearchFilter>;
export interface ListTagOptionsFilters {
  Key?: string;
  Value?: string;
  Active?: boolean;
}
export const ListTagOptionsFilters = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Value: S.optional(S.String),
    Active: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ListTagOptionsFilters",
}) as any as S.Schema<ListTagOptionsFilters>;
export interface ProvisioningParameter {
  Key?: string;
  Value?: string;
}
export const ProvisioningParameter = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "ProvisioningParameter",
}) as any as S.Schema<ProvisioningParameter>;
export type ProvisioningParameters = ProvisioningParameter[];
export const ProvisioningParameters = S.Array(ProvisioningParameter);
export interface ProvisioningPreferences {
  StackSetAccounts?: string[];
  StackSetRegions?: string[];
  StackSetFailureToleranceCount?: number;
  StackSetFailureTolerancePercentage?: number;
  StackSetMaxConcurrencyCount?: number;
  StackSetMaxConcurrencyPercentage?: number;
}
export const ProvisioningPreferences = S.suspend(() =>
  S.Struct({
    StackSetAccounts: S.optional(StackSetAccounts),
    StackSetRegions: S.optional(StackSetRegions),
    StackSetFailureToleranceCount: S.optional(S.Number),
    StackSetFailureTolerancePercentage: S.optional(S.Number),
    StackSetMaxConcurrencyCount: S.optional(S.Number),
    StackSetMaxConcurrencyPercentage: S.optional(S.Number),
  }),
).annotations({
  identifier: "ProvisioningPreferences",
}) as any as S.Schema<ProvisioningPreferences>;
export type ProvisionedProductStatus =
  | "AVAILABLE"
  | "UNDER_CHANGE"
  | "TAINTED"
  | "ERROR"
  | "PLAN_IN_PROGRESS";
export const ProvisionedProductStatus = S.Literal(
  "AVAILABLE",
  "UNDER_CHANGE",
  "TAINTED",
  "ERROR",
  "PLAN_IN_PROGRESS",
);
export interface ProvisionedProductDetail {
  Name?: string;
  Arn?: string;
  Type?: string;
  Id?: string;
  Status?: ProvisionedProductStatus;
  StatusMessage?: string;
  CreatedTime?: Date;
  IdempotencyToken?: string;
  LastRecordId?: string;
  LastProvisioningRecordId?: string;
  LastSuccessfulProvisioningRecordId?: string;
  ProductId?: string;
  ProvisioningArtifactId?: string;
  LaunchRoleArn?: string;
}
export const ProvisionedProductDetail = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    Type: S.optional(S.String),
    Id: S.optional(S.String),
    Status: S.optional(ProvisionedProductStatus),
    StatusMessage: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    IdempotencyToken: S.optional(S.String),
    LastRecordId: S.optional(S.String),
    LastProvisioningRecordId: S.optional(S.String),
    LastSuccessfulProvisioningRecordId: S.optional(S.String),
    ProductId: S.optional(S.String),
    ProvisioningArtifactId: S.optional(S.String),
    LaunchRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ProvisionedProductDetail",
}) as any as S.Schema<ProvisionedProductDetail>;
export type ProvisionedProductDetails = ProvisionedProductDetail[];
export const ProvisionedProductDetails = S.Array(ProvisionedProductDetail);
export interface ProductViewSummary {
  Id?: string;
  ProductId?: string;
  Name?: string;
  Owner?: string;
  ShortDescription?: string;
  Type?: ProductType;
  Distributor?: string;
  HasDefaultPath?: boolean;
  SupportEmail?: string;
  SupportDescription?: string;
  SupportUrl?: string;
}
export const ProductViewSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    ProductId: S.optional(S.String),
    Name: S.optional(S.String),
    Owner: S.optional(S.String),
    ShortDescription: S.optional(S.String),
    Type: S.optional(ProductType),
    Distributor: S.optional(S.String),
    HasDefaultPath: S.optional(S.Boolean),
    SupportEmail: S.optional(S.String),
    SupportDescription: S.optional(S.String),
    SupportUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "ProductViewSummary",
}) as any as S.Schema<ProductViewSummary>;
export type LastSyncStatus = "SUCCEEDED" | "FAILED";
export const LastSyncStatus = S.Literal("SUCCEEDED", "FAILED");
export interface LastSync {
  LastSyncTime?: Date;
  LastSyncStatus?: LastSyncStatus;
  LastSyncStatusMessage?: string;
  LastSuccessfulSyncTime?: Date;
  LastSuccessfulSyncProvisioningArtifactId?: string;
}
export const LastSync = S.suspend(() =>
  S.Struct({
    LastSyncTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastSyncStatus: S.optional(LastSyncStatus),
    LastSyncStatusMessage: S.optional(S.String),
    LastSuccessfulSyncTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastSuccessfulSyncProvisioningArtifactId: S.optional(S.String),
  }),
).annotations({ identifier: "LastSync" }) as any as S.Schema<LastSync>;
export interface SourceConnectionDetail {
  Type?: SourceType;
  ConnectionParameters?: SourceConnectionParameters;
  LastSync?: LastSync;
}
export const SourceConnectionDetail = S.suspend(() =>
  S.Struct({
    Type: S.optional(SourceType),
    ConnectionParameters: S.optional(SourceConnectionParameters),
    LastSync: S.optional(LastSync),
  }),
).annotations({
  identifier: "SourceConnectionDetail",
}) as any as S.Schema<SourceConnectionDetail>;
export interface ProductViewDetail {
  ProductViewSummary?: ProductViewSummary;
  Status?: Status;
  ProductARN?: string;
  CreatedTime?: Date;
  SourceConnection?: SourceConnectionDetail;
}
export const ProductViewDetail = S.suspend(() =>
  S.Struct({
    ProductViewSummary: S.optional(ProductViewSummary),
    Status: S.optional(Status),
    ProductARN: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SourceConnection: S.optional(SourceConnectionDetail),
  }),
).annotations({
  identifier: "ProductViewDetail",
}) as any as S.Schema<ProductViewDetail>;
export type ProductViewDetails = ProductViewDetail[];
export const ProductViewDetails = S.Array(ProductViewDetail);
export type ProvisionedProductFilters = {
  [key in ProvisionedProductViewFilterBy]?: string[];
};
export const ProvisionedProductFilters = S.partial(
  S.Record({
    key: ProvisionedProductViewFilterBy,
    value: ProvisionedProductViewFilterValues,
  }),
);
export interface UpdateProvisioningPreferences {
  StackSetAccounts?: string[];
  StackSetRegions?: string[];
  StackSetFailureToleranceCount?: number;
  StackSetFailureTolerancePercentage?: number;
  StackSetMaxConcurrencyCount?: number;
  StackSetMaxConcurrencyPercentage?: number;
  StackSetOperationType?: StackSetOperationType;
}
export const UpdateProvisioningPreferences = S.suspend(() =>
  S.Struct({
    StackSetAccounts: S.optional(StackSetAccounts),
    StackSetRegions: S.optional(StackSetRegions),
    StackSetFailureToleranceCount: S.optional(S.Number),
    StackSetFailureTolerancePercentage: S.optional(S.Number),
    StackSetMaxConcurrencyCount: S.optional(S.Number),
    StackSetMaxConcurrencyPercentage: S.optional(S.Number),
    StackSetOperationType: S.optional(StackSetOperationType),
  }),
).annotations({
  identifier: "UpdateProvisioningPreferences",
}) as any as S.Schema<UpdateProvisioningPreferences>;
export type ProvisionedProductProperties = { [key in PropertyKey]?: string };
export const ProvisionedProductProperties = S.partial(
  S.Record({ key: PropertyKey, value: S.String }),
);
export interface BatchAssociateServiceActionWithProvisioningArtifactInput {
  ServiceActionAssociations: ServiceActionAssociation[];
  AcceptLanguage?: string;
}
export const BatchAssociateServiceActionWithProvisioningArtifactInput =
  S.suspend(() =>
    S.Struct({
      ServiceActionAssociations: ServiceActionAssociations,
      AcceptLanguage: S.optional(S.String),
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
  ).annotations({
    identifier: "BatchAssociateServiceActionWithProvisioningArtifactInput",
  }) as any as S.Schema<BatchAssociateServiceActionWithProvisioningArtifactInput>;
export interface CopyProductInput {
  AcceptLanguage?: string;
  SourceProductArn: string;
  TargetProductId?: string;
  TargetProductName?: string;
  SourceProvisioningArtifactIdentifiers?: { [key: string]: string }[];
  CopyOptions?: CopyOption[];
  IdempotencyToken: string;
}
export const CopyProductInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    SourceProductArn: S.String,
    TargetProductId: S.optional(S.String),
    TargetProductName: S.optional(S.String),
    SourceProvisioningArtifactIdentifiers: S.optional(
      SourceProvisioningArtifactProperties,
    ),
    CopyOptions: S.optional(CopyOptions),
    IdempotencyToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CopyProductInput",
}) as any as S.Schema<CopyProductInput>;
export interface CreatePortfolioInput {
  AcceptLanguage?: string;
  DisplayName: string;
  Description?: string;
  ProviderName: string;
  Tags?: Tag[];
  IdempotencyToken: string;
}
export const CreatePortfolioInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    DisplayName: S.String,
    Description: S.optional(S.String),
    ProviderName: S.String,
    Tags: S.optional(AddTags),
    IdempotencyToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreatePortfolioInput",
}) as any as S.Schema<CreatePortfolioInput>;
export interface CreatePortfolioShareInput {
  AcceptLanguage?: string;
  PortfolioId: string;
  AccountId?: string;
  OrganizationNode?: OrganizationNode;
  ShareTagOptions?: boolean;
  SharePrincipals?: boolean;
}
export const CreatePortfolioShareInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    AccountId: S.optional(S.String),
    OrganizationNode: S.optional(OrganizationNode),
    ShareTagOptions: S.optional(S.Boolean),
    SharePrincipals: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreatePortfolioShareInput",
}) as any as S.Schema<CreatePortfolioShareInput>;
export interface CreateProvisionedProductPlanInput {
  AcceptLanguage?: string;
  PlanName: string;
  PlanType: ProvisionedProductPlanType;
  NotificationArns?: string[];
  PathId?: string;
  ProductId: string;
  ProvisionedProductName: string;
  ProvisioningArtifactId: string;
  ProvisioningParameters?: UpdateProvisioningParameter[];
  IdempotencyToken: string;
  Tags?: Tag[];
}
export const CreateProvisionedProductPlanInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    PlanName: S.String,
    PlanType: ProvisionedProductPlanType,
    NotificationArns: S.optional(NotificationArns),
    PathId: S.optional(S.String),
    ProductId: S.String,
    ProvisionedProductName: S.String,
    ProvisioningArtifactId: S.String,
    ProvisioningParameters: S.optional(UpdateProvisioningParameters),
    IdempotencyToken: S.String.pipe(T.IdempotencyToken()),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateProvisionedProductPlanInput",
}) as any as S.Schema<CreateProvisionedProductPlanInput>;
export interface CreateServiceActionInput {
  Name: string;
  DefinitionType: ServiceActionDefinitionType;
  Definition: { [key: string]: string };
  Description?: string;
  AcceptLanguage?: string;
  IdempotencyToken: string;
}
export const CreateServiceActionInput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    DefinitionType: ServiceActionDefinitionType,
    Definition: ServiceActionDefinitionMap,
    Description: S.optional(S.String),
    AcceptLanguage: S.optional(S.String),
    IdempotencyToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateServiceActionInput",
}) as any as S.Schema<CreateServiceActionInput>;
export interface DeletePortfolioShareOutput {
  PortfolioShareToken?: string;
}
export const DeletePortfolioShareOutput = S.suspend(() =>
  S.Struct({ PortfolioShareToken: S.optional(S.String) }),
).annotations({
  identifier: "DeletePortfolioShareOutput",
}) as any as S.Schema<DeletePortfolioShareOutput>;
export interface DescribeConstraintOutput {
  ConstraintDetail?: ConstraintDetail;
  ConstraintParameters?: string;
  Status?: Status;
}
export const DescribeConstraintOutput = S.suspend(() =>
  S.Struct({
    ConstraintDetail: S.optional(ConstraintDetail),
    ConstraintParameters: S.optional(S.String),
    Status: S.optional(Status),
  }),
).annotations({
  identifier: "DescribeConstraintOutput",
}) as any as S.Schema<DescribeConstraintOutput>;
export interface DescribeCopyProductStatusOutput {
  CopyProductStatus?: CopyProductStatus;
  TargetProductId?: string;
  StatusDetail?: string;
}
export const DescribeCopyProductStatusOutput = S.suspend(() =>
  S.Struct({
    CopyProductStatus: S.optional(CopyProductStatus),
    TargetProductId: S.optional(S.String),
    StatusDetail: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeCopyProductStatusOutput",
}) as any as S.Schema<DescribeCopyProductStatusOutput>;
export interface ProvisioningArtifact {
  Id?: string;
  Name?: string;
  Description?: string;
  CreatedTime?: Date;
  Guidance?: ProvisioningArtifactGuidance;
}
export const ProvisioningArtifact = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Guidance: S.optional(ProvisioningArtifactGuidance),
  }),
).annotations({
  identifier: "ProvisioningArtifact",
}) as any as S.Schema<ProvisioningArtifact>;
export type ProvisioningArtifacts = ProvisioningArtifact[];
export const ProvisioningArtifacts = S.Array(ProvisioningArtifact);
export interface DescribeProductViewOutput {
  ProductViewSummary?: ProductViewSummary;
  ProvisioningArtifacts?: ProvisioningArtifact[];
}
export const DescribeProductViewOutput = S.suspend(() =>
  S.Struct({
    ProductViewSummary: S.optional(ProductViewSummary),
    ProvisioningArtifacts: S.optional(ProvisioningArtifacts),
  }),
).annotations({
  identifier: "DescribeProductViewOutput",
}) as any as S.Schema<DescribeProductViewOutput>;
export interface DescribeTagOptionOutput {
  TagOptionDetail?: TagOptionDetail;
}
export const DescribeTagOptionOutput = S.suspend(() =>
  S.Struct({ TagOptionDetail: S.optional(TagOptionDetail) }),
).annotations({
  identifier: "DescribeTagOptionOutput",
}) as any as S.Schema<DescribeTagOptionOutput>;
export type RecordStatus =
  | "CREATED"
  | "IN_PROGRESS"
  | "IN_PROGRESS_IN_ERROR"
  | "SUCCEEDED"
  | "FAILED";
export const RecordStatus = S.Literal(
  "CREATED",
  "IN_PROGRESS",
  "IN_PROGRESS_IN_ERROR",
  "SUCCEEDED",
  "FAILED",
);
export interface RecordError {
  Code?: string;
  Description?: string;
}
export const RecordError = S.suspend(() =>
  S.Struct({ Code: S.optional(S.String), Description: S.optional(S.String) }),
).annotations({ identifier: "RecordError" }) as any as S.Schema<RecordError>;
export type RecordErrors = RecordError[];
export const RecordErrors = S.Array(RecordError);
export interface RecordTag {
  Key?: string;
  Value?: string;
}
export const RecordTag = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "RecordTag" }) as any as S.Schema<RecordTag>;
export type RecordTags = RecordTag[];
export const RecordTags = S.Array(RecordTag);
export interface RecordDetail {
  RecordId?: string;
  ProvisionedProductName?: string;
  Status?: RecordStatus;
  CreatedTime?: Date;
  UpdatedTime?: Date;
  ProvisionedProductType?: string;
  RecordType?: string;
  ProvisionedProductId?: string;
  ProductId?: string;
  ProvisioningArtifactId?: string;
  PathId?: string;
  RecordErrors?: RecordError[];
  RecordTags?: RecordTag[];
  LaunchRoleArn?: string;
}
export const RecordDetail = S.suspend(() =>
  S.Struct({
    RecordId: S.optional(S.String),
    ProvisionedProductName: S.optional(S.String),
    Status: S.optional(RecordStatus),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ProvisionedProductType: S.optional(S.String),
    RecordType: S.optional(S.String),
    ProvisionedProductId: S.optional(S.String),
    ProductId: S.optional(S.String),
    ProvisioningArtifactId: S.optional(S.String),
    PathId: S.optional(S.String),
    RecordErrors: S.optional(RecordErrors),
    RecordTags: S.optional(RecordTags),
    LaunchRoleArn: S.optional(S.String),
  }),
).annotations({ identifier: "RecordDetail" }) as any as S.Schema<RecordDetail>;
export interface ExecuteProvisionedProductPlanOutput {
  RecordDetail?: RecordDetail;
}
export const ExecuteProvisionedProductPlanOutput = S.suspend(() =>
  S.Struct({ RecordDetail: S.optional(RecordDetail) }),
).annotations({
  identifier: "ExecuteProvisionedProductPlanOutput",
}) as any as S.Schema<ExecuteProvisionedProductPlanOutput>;
export interface ExecuteProvisionedProductServiceActionInput {
  ProvisionedProductId: string;
  ServiceActionId: string;
  ExecuteToken: string;
  AcceptLanguage?: string;
  Parameters?: { [key: string]: string[] };
}
export const ExecuteProvisionedProductServiceActionInput = S.suspend(() =>
  S.Struct({
    ProvisionedProductId: S.String,
    ServiceActionId: S.String,
    ExecuteToken: S.String.pipe(T.IdempotencyToken()),
    AcceptLanguage: S.optional(S.String),
    Parameters: S.optional(ExecutionParameterMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ExecuteProvisionedProductServiceActionInput",
}) as any as S.Schema<ExecuteProvisionedProductServiceActionInput>;
export interface GetProvisionedProductOutputsOutput {
  Outputs?: RecordOutput[];
  NextPageToken?: string;
}
export const GetProvisionedProductOutputsOutput = S.suspend(() =>
  S.Struct({
    Outputs: S.optional(RecordOutputs),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetProvisionedProductOutputsOutput",
}) as any as S.Schema<GetProvisionedProductOutputsOutput>;
export interface ImportAsProvisionedProductOutput {
  RecordDetail?: RecordDetail;
}
export const ImportAsProvisionedProductOutput = S.suspend(() =>
  S.Struct({ RecordDetail: S.optional(RecordDetail) }),
).annotations({
  identifier: "ImportAsProvisionedProductOutput",
}) as any as S.Schema<ImportAsProvisionedProductOutput>;
export interface ListAcceptedPortfolioSharesOutput {
  PortfolioDetails?: PortfolioDetail[];
  NextPageToken?: string;
}
export const ListAcceptedPortfolioSharesOutput = S.suspend(() =>
  S.Struct({
    PortfolioDetails: S.optional(PortfolioDetails),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAcceptedPortfolioSharesOutput",
}) as any as S.Schema<ListAcceptedPortfolioSharesOutput>;
export interface BudgetDetail {
  BudgetName?: string;
}
export const BudgetDetail = S.suspend(() =>
  S.Struct({ BudgetName: S.optional(S.String) }),
).annotations({ identifier: "BudgetDetail" }) as any as S.Schema<BudgetDetail>;
export type Budgets = BudgetDetail[];
export const Budgets = S.Array(BudgetDetail);
export interface ListBudgetsForResourceOutput {
  Budgets?: BudgetDetail[];
  NextPageToken?: string;
}
export const ListBudgetsForResourceOutput = S.suspend(() =>
  S.Struct({
    Budgets: S.optional(Budgets),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBudgetsForResourceOutput",
}) as any as S.Schema<ListBudgetsForResourceOutput>;
export interface ListConstraintsForPortfolioOutput {
  ConstraintDetails?: ConstraintDetail[];
  NextPageToken?: string;
}
export const ListConstraintsForPortfolioOutput = S.suspend(() =>
  S.Struct({
    ConstraintDetails: S.optional(ConstraintDetails),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConstraintsForPortfolioOutput",
}) as any as S.Schema<ListConstraintsForPortfolioOutput>;
export interface ListOrganizationPortfolioAccessOutput {
  OrganizationNodes?: OrganizationNode[];
  NextPageToken?: string;
}
export const ListOrganizationPortfolioAccessOutput = S.suspend(() =>
  S.Struct({
    OrganizationNodes: S.optional(OrganizationNodes),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListOrganizationPortfolioAccessOutput",
}) as any as S.Schema<ListOrganizationPortfolioAccessOutput>;
export interface ListPortfolioAccessOutput {
  AccountIds?: string[];
  NextPageToken?: string;
}
export const ListPortfolioAccessOutput = S.suspend(() =>
  S.Struct({
    AccountIds: S.optional(AccountIds),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPortfolioAccessOutput",
}) as any as S.Schema<ListPortfolioAccessOutput>;
export interface ListPortfoliosOutput {
  PortfolioDetails?: PortfolioDetail[];
  NextPageToken?: string;
}
export const ListPortfoliosOutput = S.suspend(() =>
  S.Struct({
    PortfolioDetails: S.optional(PortfolioDetails),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPortfoliosOutput",
}) as any as S.Schema<ListPortfoliosOutput>;
export interface ListPortfoliosForProductOutput {
  PortfolioDetails?: PortfolioDetail[];
  NextPageToken?: string;
}
export const ListPortfoliosForProductOutput = S.suspend(() =>
  S.Struct({
    PortfolioDetails: S.optional(PortfolioDetails),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPortfoliosForProductOutput",
}) as any as S.Schema<ListPortfoliosForProductOutput>;
export interface ListProvisionedProductPlansInput {
  AcceptLanguage?: string;
  ProvisionProductId?: string;
  PageSize?: number;
  PageToken?: string;
  AccessLevelFilter?: AccessLevelFilter;
}
export const ListProvisionedProductPlansInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    ProvisionProductId: S.optional(S.String),
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
    AccessLevelFilter: S.optional(AccessLevelFilter),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListProvisionedProductPlansInput",
}) as any as S.Schema<ListProvisionedProductPlansInput>;
export interface ListProvisioningArtifactsOutput {
  ProvisioningArtifactDetails?: ProvisioningArtifactDetail[];
  NextPageToken?: string;
}
export const ListProvisioningArtifactsOutput = S.suspend(() =>
  S.Struct({
    ProvisioningArtifactDetails: S.optional(ProvisioningArtifactDetails),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProvisioningArtifactsOutput",
}) as any as S.Schema<ListProvisioningArtifactsOutput>;
export interface ListRecordHistoryInput {
  AcceptLanguage?: string;
  AccessLevelFilter?: AccessLevelFilter;
  SearchFilter?: ListRecordHistorySearchFilter;
  PageSize?: number;
  PageToken?: string;
}
export const ListRecordHistoryInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    AccessLevelFilter: S.optional(AccessLevelFilter),
    SearchFilter: S.optional(ListRecordHistorySearchFilter),
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRecordHistoryInput",
}) as any as S.Schema<ListRecordHistoryInput>;
export interface ServiceActionSummary {
  Id?: string;
  Name?: string;
  Description?: string;
  DefinitionType?: ServiceActionDefinitionType;
}
export const ServiceActionSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    DefinitionType: S.optional(ServiceActionDefinitionType),
  }),
).annotations({
  identifier: "ServiceActionSummary",
}) as any as S.Schema<ServiceActionSummary>;
export type ServiceActionSummaries = ServiceActionSummary[];
export const ServiceActionSummaries = S.Array(ServiceActionSummary);
export interface ListServiceActionsForProvisioningArtifactOutput {
  ServiceActionSummaries?: ServiceActionSummary[];
  NextPageToken?: string;
}
export const ListServiceActionsForProvisioningArtifactOutput = S.suspend(() =>
  S.Struct({
    ServiceActionSummaries: S.optional(ServiceActionSummaries),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListServiceActionsForProvisioningArtifactOutput",
}) as any as S.Schema<ListServiceActionsForProvisioningArtifactOutput>;
export interface ListTagOptionsInput {
  Filters?: ListTagOptionsFilters;
  PageSize?: number;
  PageToken?: string;
}
export const ListTagOptionsInput = S.suspend(() =>
  S.Struct({
    Filters: S.optional(ListTagOptionsFilters),
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagOptionsInput",
}) as any as S.Schema<ListTagOptionsInput>;
export interface ProvisionProductInput {
  AcceptLanguage?: string;
  ProductId?: string;
  ProductName?: string;
  ProvisioningArtifactId?: string;
  ProvisioningArtifactName?: string;
  PathId?: string;
  PathName?: string;
  ProvisionedProductName: string;
  ProvisioningParameters?: ProvisioningParameter[];
  ProvisioningPreferences?: ProvisioningPreferences;
  Tags?: Tag[];
  NotificationArns?: string[];
  ProvisionToken: string;
}
export const ProvisionProductInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    ProductId: S.optional(S.String),
    ProductName: S.optional(S.String),
    ProvisioningArtifactId: S.optional(S.String),
    ProvisioningArtifactName: S.optional(S.String),
    PathId: S.optional(S.String),
    PathName: S.optional(S.String),
    ProvisionedProductName: S.String,
    ProvisioningParameters: S.optional(ProvisioningParameters),
    ProvisioningPreferences: S.optional(ProvisioningPreferences),
    Tags: S.optional(Tags),
    NotificationArns: S.optional(NotificationArns),
    ProvisionToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ProvisionProductInput",
}) as any as S.Schema<ProvisionProductInput>;
export interface ScanProvisionedProductsOutput {
  ProvisionedProducts?: ProvisionedProductDetail[];
  NextPageToken?: string;
}
export const ScanProvisionedProductsOutput = S.suspend(() =>
  S.Struct({
    ProvisionedProducts: S.optional(ProvisionedProductDetails),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ScanProvisionedProductsOutput",
}) as any as S.Schema<ScanProvisionedProductsOutput>;
export interface SearchProductsInput {
  AcceptLanguage?: string;
  Filters?: { [key: string]: string[] };
  PageSize?: number;
  SortBy?: ProductViewSortBy;
  SortOrder?: SortOrder;
  PageToken?: string;
}
export const SearchProductsInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    Filters: S.optional(ProductViewFilters),
    PageSize: S.optional(S.Number),
    SortBy: S.optional(ProductViewSortBy),
    SortOrder: S.optional(SortOrder),
    PageToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SearchProductsInput",
}) as any as S.Schema<SearchProductsInput>;
export interface SearchProductsAsAdminOutput {
  ProductViewDetails?: ProductViewDetail[];
  NextPageToken?: string;
}
export const SearchProductsAsAdminOutput = S.suspend(() =>
  S.Struct({
    ProductViewDetails: S.optional(ProductViewDetails),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchProductsAsAdminOutput",
}) as any as S.Schema<SearchProductsAsAdminOutput>;
export interface SearchProvisionedProductsInput {
  AcceptLanguage?: string;
  AccessLevelFilter?: AccessLevelFilter;
  Filters?: { [key: string]: string[] };
  SortBy?: string;
  SortOrder?: SortOrder;
  PageSize?: number;
  PageToken?: string;
}
export const SearchProvisionedProductsInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    AccessLevelFilter: S.optional(AccessLevelFilter),
    Filters: S.optional(ProvisionedProductFilters),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(SortOrder),
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SearchProvisionedProductsInput",
}) as any as S.Schema<SearchProvisionedProductsInput>;
export interface TerminateProvisionedProductOutput {
  RecordDetail?: RecordDetail;
}
export const TerminateProvisionedProductOutput = S.suspend(() =>
  S.Struct({ RecordDetail: S.optional(RecordDetail) }),
).annotations({
  identifier: "TerminateProvisionedProductOutput",
}) as any as S.Schema<TerminateProvisionedProductOutput>;
export interface UpdateConstraintOutput {
  ConstraintDetail?: ConstraintDetail;
  ConstraintParameters?: string;
  Status?: Status;
}
export const UpdateConstraintOutput = S.suspend(() =>
  S.Struct({
    ConstraintDetail: S.optional(ConstraintDetail),
    ConstraintParameters: S.optional(S.String),
    Status: S.optional(Status),
  }),
).annotations({
  identifier: "UpdateConstraintOutput",
}) as any as S.Schema<UpdateConstraintOutput>;
export interface UpdatePortfolioOutput {
  PortfolioDetail?: PortfolioDetail;
  Tags?: Tag[];
}
export const UpdatePortfolioOutput = S.suspend(() =>
  S.Struct({
    PortfolioDetail: S.optional(PortfolioDetail),
    Tags: S.optional(Tags),
  }),
).annotations({
  identifier: "UpdatePortfolioOutput",
}) as any as S.Schema<UpdatePortfolioOutput>;
export interface UpdatePortfolioShareOutput {
  PortfolioShareToken?: string;
  Status?: ShareStatus;
}
export const UpdatePortfolioShareOutput = S.suspend(() =>
  S.Struct({
    PortfolioShareToken: S.optional(S.String),
    Status: S.optional(ShareStatus),
  }),
).annotations({
  identifier: "UpdatePortfolioShareOutput",
}) as any as S.Schema<UpdatePortfolioShareOutput>;
export interface UpdateProductOutput {
  ProductViewDetail?: ProductViewDetail;
  Tags?: Tag[];
}
export const UpdateProductOutput = S.suspend(() =>
  S.Struct({
    ProductViewDetail: S.optional(ProductViewDetail),
    Tags: S.optional(Tags),
  }),
).annotations({
  identifier: "UpdateProductOutput",
}) as any as S.Schema<UpdateProductOutput>;
export interface UpdateProvisionedProductInput {
  AcceptLanguage?: string;
  ProvisionedProductName?: string;
  ProvisionedProductId?: string;
  ProductId?: string;
  ProductName?: string;
  ProvisioningArtifactId?: string;
  ProvisioningArtifactName?: string;
  PathId?: string;
  PathName?: string;
  ProvisioningParameters?: UpdateProvisioningParameter[];
  ProvisioningPreferences?: UpdateProvisioningPreferences;
  Tags?: Tag[];
  UpdateToken: string;
}
export const UpdateProvisionedProductInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    ProvisionedProductName: S.optional(S.String),
    ProvisionedProductId: S.optional(S.String),
    ProductId: S.optional(S.String),
    ProductName: S.optional(S.String),
    ProvisioningArtifactId: S.optional(S.String),
    ProvisioningArtifactName: S.optional(S.String),
    PathId: S.optional(S.String),
    PathName: S.optional(S.String),
    ProvisioningParameters: S.optional(UpdateProvisioningParameters),
    ProvisioningPreferences: S.optional(UpdateProvisioningPreferences),
    Tags: S.optional(Tags),
    UpdateToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateProvisionedProductInput",
}) as any as S.Schema<UpdateProvisionedProductInput>;
export interface UpdateProvisionedProductPropertiesInput {
  AcceptLanguage?: string;
  ProvisionedProductId: string;
  ProvisionedProductProperties: { [key: string]: string };
  IdempotencyToken: string;
}
export const UpdateProvisionedProductPropertiesInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    ProvisionedProductId: S.String,
    ProvisionedProductProperties: ProvisionedProductProperties,
    IdempotencyToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateProvisionedProductPropertiesInput",
}) as any as S.Schema<UpdateProvisionedProductPropertiesInput>;
export interface UpdateProvisioningArtifactOutput {
  ProvisioningArtifactDetail?: ProvisioningArtifactDetail;
  Info?: { [key: string]: string };
  Status?: Status;
}
export const UpdateProvisioningArtifactOutput = S.suspend(() =>
  S.Struct({
    ProvisioningArtifactDetail: S.optional(ProvisioningArtifactDetail),
    Info: S.optional(ProvisioningArtifactInfo),
    Status: S.optional(Status),
  }),
).annotations({
  identifier: "UpdateProvisioningArtifactOutput",
}) as any as S.Schema<UpdateProvisioningArtifactOutput>;
export interface ServiceActionDetail {
  ServiceActionSummary?: ServiceActionSummary;
  Definition?: { [key: string]: string };
}
export const ServiceActionDetail = S.suspend(() =>
  S.Struct({
    ServiceActionSummary: S.optional(ServiceActionSummary),
    Definition: S.optional(ServiceActionDefinitionMap),
  }),
).annotations({
  identifier: "ServiceActionDetail",
}) as any as S.Schema<ServiceActionDetail>;
export interface UpdateServiceActionOutput {
  ServiceActionDetail?: ServiceActionDetail;
}
export const UpdateServiceActionOutput = S.suspend(() =>
  S.Struct({ ServiceActionDetail: S.optional(ServiceActionDetail) }),
).annotations({
  identifier: "UpdateServiceActionOutput",
}) as any as S.Schema<UpdateServiceActionOutput>;
export interface UpdateTagOptionOutput {
  TagOptionDetail?: TagOptionDetail;
}
export const UpdateTagOptionOutput = S.suspend(() =>
  S.Struct({ TagOptionDetail: S.optional(TagOptionDetail) }),
).annotations({
  identifier: "UpdateTagOptionOutput",
}) as any as S.Schema<UpdateTagOptionOutput>;
export type ServiceActionAssociationErrorCode =
  | "DUPLICATE_RESOURCE"
  | "INTERNAL_FAILURE"
  | "LIMIT_EXCEEDED"
  | "RESOURCE_NOT_FOUND"
  | "THROTTLING"
  | "INVALID_PARAMETER";
export const ServiceActionAssociationErrorCode = S.Literal(
  "DUPLICATE_RESOURCE",
  "INTERNAL_FAILURE",
  "LIMIT_EXCEEDED",
  "RESOURCE_NOT_FOUND",
  "THROTTLING",
  "INVALID_PARAMETER",
);
export type SuccessfulShares = string[];
export const SuccessfulShares = S.Array(S.String);
export type ProvisionedProductPlanStatus =
  | "CREATE_IN_PROGRESS"
  | "CREATE_SUCCESS"
  | "CREATE_FAILED"
  | "EXECUTE_IN_PROGRESS"
  | "EXECUTE_SUCCESS"
  | "EXECUTE_FAILED";
export const ProvisionedProductPlanStatus = S.Literal(
  "CREATE_IN_PROGRESS",
  "CREATE_SUCCESS",
  "CREATE_FAILED",
  "EXECUTE_IN_PROGRESS",
  "EXECUTE_SUCCESS",
  "EXECUTE_FAILED",
);
export type ChangeAction = "ADD" | "MODIFY" | "REMOVE";
export const ChangeAction = S.Literal("ADD", "MODIFY", "REMOVE");
export type Replacement = "TRUE" | "FALSE" | "CONDITIONAL";
export const Replacement = S.Literal("TRUE", "FALSE", "CONDITIONAL");
export type ResourceAttribute =
  | "PROPERTIES"
  | "METADATA"
  | "CREATIONPOLICY"
  | "UPDATEPOLICY"
  | "DELETIONPOLICY"
  | "TAGS";
export const ResourceAttribute = S.Literal(
  "PROPERTIES",
  "METADATA",
  "CREATIONPOLICY",
  "UPDATEPOLICY",
  "DELETIONPOLICY",
  "TAGS",
);
export type Scope = ResourceAttribute[];
export const Scope = S.Array(ResourceAttribute);
export type TagOptionValues = string[];
export const TagOptionValues = S.Array(S.String);
export type StackInstanceStatus = "CURRENT" | "OUTDATED" | "INOPERABLE";
export const StackInstanceStatus = S.Literal(
  "CURRENT",
  "OUTDATED",
  "INOPERABLE",
);
export interface UniqueTagResourceIdentifier {
  Key?: string;
  Value?: string;
}
export const UniqueTagResourceIdentifier = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "UniqueTagResourceIdentifier",
}) as any as S.Schema<UniqueTagResourceIdentifier>;
export interface FailedServiceActionAssociation {
  ServiceActionId?: string;
  ProductId?: string;
  ProvisioningArtifactId?: string;
  ErrorCode?: ServiceActionAssociationErrorCode;
  ErrorMessage?: string;
}
export const FailedServiceActionAssociation = S.suspend(() =>
  S.Struct({
    ServiceActionId: S.optional(S.String),
    ProductId: S.optional(S.String),
    ProvisioningArtifactId: S.optional(S.String),
    ErrorCode: S.optional(ServiceActionAssociationErrorCode),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "FailedServiceActionAssociation",
}) as any as S.Schema<FailedServiceActionAssociation>;
export type FailedServiceActionAssociations = FailedServiceActionAssociation[];
export const FailedServiceActionAssociations = S.Array(
  FailedServiceActionAssociation,
);
export interface PortfolioShareDetail {
  PrincipalId?: string;
  Type?: DescribePortfolioShareType;
  Accepted?: boolean;
  ShareTagOptions?: boolean;
  SharePrincipals?: boolean;
}
export const PortfolioShareDetail = S.suspend(() =>
  S.Struct({
    PrincipalId: S.optional(S.String),
    Type: S.optional(DescribePortfolioShareType),
    Accepted: S.optional(S.Boolean),
    ShareTagOptions: S.optional(S.Boolean),
    SharePrincipals: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "PortfolioShareDetail",
}) as any as S.Schema<PortfolioShareDetail>;
export type PortfolioShareDetails = PortfolioShareDetail[];
export const PortfolioShareDetails = S.Array(PortfolioShareDetail);
export interface LaunchPath {
  Id?: string;
  Name?: string;
}
export const LaunchPath = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String), Name: S.optional(S.String) }),
).annotations({ identifier: "LaunchPath" }) as any as S.Schema<LaunchPath>;
export type LaunchPaths = LaunchPath[];
export const LaunchPaths = S.Array(LaunchPath);
export interface ProvisioningArtifactSummary {
  Id?: string;
  Name?: string;
  Description?: string;
  CreatedTime?: Date;
  ProvisioningArtifactMetadata?: { [key: string]: string };
}
export const ProvisioningArtifactSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ProvisioningArtifactMetadata: S.optional(ProvisioningArtifactInfo),
  }),
).annotations({
  identifier: "ProvisioningArtifactSummary",
}) as any as S.Schema<ProvisioningArtifactSummary>;
export type ProvisioningArtifactSummaries = ProvisioningArtifactSummary[];
export const ProvisioningArtifactSummaries = S.Array(
  ProvisioningArtifactSummary,
);
export interface CloudWatchDashboard {
  Name?: string;
}
export const CloudWatchDashboard = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "CloudWatchDashboard",
}) as any as S.Schema<CloudWatchDashboard>;
export type CloudWatchDashboards = CloudWatchDashboard[];
export const CloudWatchDashboards = S.Array(CloudWatchDashboard);
export interface ProvisionedProductPlanDetails {
  CreatedTime?: Date;
  PathId?: string;
  ProductId?: string;
  PlanName?: string;
  PlanId?: string;
  ProvisionProductId?: string;
  ProvisionProductName?: string;
  PlanType?: ProvisionedProductPlanType;
  ProvisioningArtifactId?: string;
  Status?: ProvisionedProductPlanStatus;
  UpdatedTime?: Date;
  NotificationArns?: string[];
  ProvisioningParameters?: UpdateProvisioningParameter[];
  Tags?: Tag[];
  StatusMessage?: string;
}
export const ProvisionedProductPlanDetails = S.suspend(() =>
  S.Struct({
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    PathId: S.optional(S.String),
    ProductId: S.optional(S.String),
    PlanName: S.optional(S.String),
    PlanId: S.optional(S.String),
    ProvisionProductId: S.optional(S.String),
    ProvisionProductName: S.optional(S.String),
    PlanType: S.optional(ProvisionedProductPlanType),
    ProvisioningArtifactId: S.optional(S.String),
    Status: S.optional(ProvisionedProductPlanStatus),
    UpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    NotificationArns: S.optional(NotificationArns),
    ProvisioningParameters: S.optional(UpdateProvisioningParameters),
    Tags: S.optional(Tags),
    StatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "ProvisionedProductPlanDetails",
}) as any as S.Schema<ProvisionedProductPlanDetails>;
export interface ConstraintSummary {
  Type?: string;
  Description?: string;
}
export const ConstraintSummary = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String), Description: S.optional(S.String) }),
).annotations({
  identifier: "ConstraintSummary",
}) as any as S.Schema<ConstraintSummary>;
export type ConstraintSummaries = ConstraintSummary[];
export const ConstraintSummaries = S.Array(ConstraintSummary);
export interface UsageInstruction {
  Type?: string;
  Value?: string;
}
export const UsageInstruction = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "UsageInstruction",
}) as any as S.Schema<UsageInstruction>;
export type UsageInstructions = UsageInstruction[];
export const UsageInstructions = S.Array(UsageInstruction);
export interface TagOptionSummary {
  Key?: string;
  Values?: string[];
}
export const TagOptionSummary = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Values: S.optional(TagOptionValues) }),
).annotations({
  identifier: "TagOptionSummary",
}) as any as S.Schema<TagOptionSummary>;
export type TagOptionSummaries = TagOptionSummary[];
export const TagOptionSummaries = S.Array(TagOptionSummary);
export interface ProvisioningArtifactPreferences {
  StackSetAccounts?: string[];
  StackSetRegions?: string[];
}
export const ProvisioningArtifactPreferences = S.suspend(() =>
  S.Struct({
    StackSetAccounts: S.optional(StackSetAccounts),
    StackSetRegions: S.optional(StackSetRegions),
  }),
).annotations({
  identifier: "ProvisioningArtifactPreferences",
}) as any as S.Schema<ProvisioningArtifactPreferences>;
export interface ProvisioningArtifactOutput {
  Key?: string;
  Description?: string;
}
export const ProvisioningArtifactOutput = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Description: S.optional(S.String) }),
).annotations({
  identifier: "ProvisioningArtifactOutput",
}) as any as S.Schema<ProvisioningArtifactOutput>;
export type ProvisioningArtifactOutputs = ProvisioningArtifactOutput[];
export const ProvisioningArtifactOutputs = S.Array(ProvisioningArtifactOutput);
export interface ExecutionParameter {
  Name?: string;
  Type?: string;
  DefaultValues?: string[];
}
export const ExecutionParameter = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Type: S.optional(S.String),
    DefaultValues: S.optional(ExecutionParameterValueList),
  }),
).annotations({
  identifier: "ExecutionParameter",
}) as any as S.Schema<ExecutionParameter>;
export type ExecutionParameters = ExecutionParameter[];
export const ExecutionParameters = S.Array(ExecutionParameter);
export interface LaunchPathSummary {
  Id?: string;
  ConstraintSummaries?: ConstraintSummary[];
  Tags?: Tag[];
  Name?: string;
}
export const LaunchPathSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    ConstraintSummaries: S.optional(ConstraintSummaries),
    Tags: S.optional(Tags),
    Name: S.optional(S.String),
  }),
).annotations({
  identifier: "LaunchPathSummary",
}) as any as S.Schema<LaunchPathSummary>;
export type LaunchPathSummaries = LaunchPathSummary[];
export const LaunchPathSummaries = S.Array(LaunchPathSummary);
export interface Principal {
  PrincipalARN?: string;
  PrincipalType?: PrincipalType;
}
export const Principal = S.suspend(() =>
  S.Struct({
    PrincipalARN: S.optional(S.String),
    PrincipalType: S.optional(PrincipalType),
  }),
).annotations({ identifier: "Principal" }) as any as S.Schema<Principal>;
export type Principals = Principal[];
export const Principals = S.Array(Principal);
export interface ProvisioningArtifactView {
  ProductViewSummary?: ProductViewSummary;
  ProvisioningArtifact?: ProvisioningArtifact;
}
export const ProvisioningArtifactView = S.suspend(() =>
  S.Struct({
    ProductViewSummary: S.optional(ProductViewSummary),
    ProvisioningArtifact: S.optional(ProvisioningArtifact),
  }),
).annotations({
  identifier: "ProvisioningArtifactView",
}) as any as S.Schema<ProvisioningArtifactView>;
export type ProvisioningArtifactViews = ProvisioningArtifactView[];
export const ProvisioningArtifactViews = S.Array(ProvisioningArtifactView);
export type RecordDetails = RecordDetail[];
export const RecordDetails = S.Array(RecordDetail);
export interface ResourceDetail {
  Id?: string;
  ARN?: string;
  Name?: string;
  Description?: string;
  CreatedTime?: Date;
}
export const ResourceDetail = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    ARN: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ResourceDetail",
}) as any as S.Schema<ResourceDetail>;
export type ResourceDetails = ResourceDetail[];
export const ResourceDetails = S.Array(ResourceDetail);
export interface StackInstance {
  Account?: string;
  Region?: string;
  StackInstanceStatus?: StackInstanceStatus;
}
export const StackInstance = S.suspend(() =>
  S.Struct({
    Account: S.optional(S.String),
    Region: S.optional(S.String),
    StackInstanceStatus: S.optional(StackInstanceStatus),
  }),
).annotations({
  identifier: "StackInstance",
}) as any as S.Schema<StackInstance>;
export type StackInstances = StackInstance[];
export const StackInstances = S.Array(StackInstance);
export interface EngineWorkflowResourceIdentifier {
  UniqueTag?: UniqueTagResourceIdentifier;
}
export const EngineWorkflowResourceIdentifier = S.suspend(() =>
  S.Struct({ UniqueTag: S.optional(UniqueTagResourceIdentifier) }),
).annotations({
  identifier: "EngineWorkflowResourceIdentifier",
}) as any as S.Schema<EngineWorkflowResourceIdentifier>;
export type ProductViewSummaries = ProductViewSummary[];
export const ProductViewSummaries = S.Array(ProductViewSummary);
export type Namespaces = string[];
export const Namespaces = S.Array(S.String);
export type EvaluationType = "STATIC" | "DYNAMIC";
export const EvaluationType = S.Literal("STATIC", "DYNAMIC");
export type AllowedValues = string[];
export const AllowedValues = S.Array(S.String);
export interface BatchAssociateServiceActionWithProvisioningArtifactOutput {
  FailedServiceActionAssociations?: FailedServiceActionAssociation[];
}
export const BatchAssociateServiceActionWithProvisioningArtifactOutput =
  S.suspend(() =>
    S.Struct({
      FailedServiceActionAssociations: S.optional(
        FailedServiceActionAssociations,
      ),
    }),
  ).annotations({
    identifier: "BatchAssociateServiceActionWithProvisioningArtifactOutput",
  }) as any as S.Schema<BatchAssociateServiceActionWithProvisioningArtifactOutput>;
export interface BatchDisassociateServiceActionFromProvisioningArtifactOutput {
  FailedServiceActionAssociations?: FailedServiceActionAssociation[];
}
export const BatchDisassociateServiceActionFromProvisioningArtifactOutput =
  S.suspend(() =>
    S.Struct({
      FailedServiceActionAssociations: S.optional(
        FailedServiceActionAssociations,
      ),
    }),
  ).annotations({
    identifier: "BatchDisassociateServiceActionFromProvisioningArtifactOutput",
  }) as any as S.Schema<BatchDisassociateServiceActionFromProvisioningArtifactOutput>;
export interface CopyProductOutput {
  CopyProductToken?: string;
}
export const CopyProductOutput = S.suspend(() =>
  S.Struct({ CopyProductToken: S.optional(S.String) }),
).annotations({
  identifier: "CopyProductOutput",
}) as any as S.Schema<CopyProductOutput>;
export interface CreateConstraintOutput {
  ConstraintDetail?: ConstraintDetail;
  ConstraintParameters?: string;
  Status?: Status;
}
export const CreateConstraintOutput = S.suspend(() =>
  S.Struct({
    ConstraintDetail: S.optional(ConstraintDetail),
    ConstraintParameters: S.optional(S.String),
    Status: S.optional(Status),
  }),
).annotations({
  identifier: "CreateConstraintOutput",
}) as any as S.Schema<CreateConstraintOutput>;
export interface CreatePortfolioOutput {
  PortfolioDetail?: PortfolioDetail;
  Tags?: Tag[];
}
export const CreatePortfolioOutput = S.suspend(() =>
  S.Struct({
    PortfolioDetail: S.optional(PortfolioDetail),
    Tags: S.optional(Tags),
  }),
).annotations({
  identifier: "CreatePortfolioOutput",
}) as any as S.Schema<CreatePortfolioOutput>;
export interface CreatePortfolioShareOutput {
  PortfolioShareToken?: string;
}
export const CreatePortfolioShareOutput = S.suspend(() =>
  S.Struct({ PortfolioShareToken: S.optional(S.String) }),
).annotations({
  identifier: "CreatePortfolioShareOutput",
}) as any as S.Schema<CreatePortfolioShareOutput>;
export interface CreateProvisionedProductPlanOutput {
  PlanName?: string;
  PlanId?: string;
  ProvisionProductId?: string;
  ProvisionedProductName?: string;
  ProvisioningArtifactId?: string;
}
export const CreateProvisionedProductPlanOutput = S.suspend(() =>
  S.Struct({
    PlanName: S.optional(S.String),
    PlanId: S.optional(S.String),
    ProvisionProductId: S.optional(S.String),
    ProvisionedProductName: S.optional(S.String),
    ProvisioningArtifactId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateProvisionedProductPlanOutput",
}) as any as S.Schema<CreateProvisionedProductPlanOutput>;
export interface CreateProvisioningArtifactOutput {
  ProvisioningArtifactDetail?: ProvisioningArtifactDetail;
  Info?: { [key: string]: string };
  Status?: Status;
}
export const CreateProvisioningArtifactOutput = S.suspend(() =>
  S.Struct({
    ProvisioningArtifactDetail: S.optional(ProvisioningArtifactDetail),
    Info: S.optional(ProvisioningArtifactInfo),
    Status: S.optional(Status),
  }),
).annotations({
  identifier: "CreateProvisioningArtifactOutput",
}) as any as S.Schema<CreateProvisioningArtifactOutput>;
export interface CreateServiceActionOutput {
  ServiceActionDetail?: ServiceActionDetail;
}
export const CreateServiceActionOutput = S.suspend(() =>
  S.Struct({ ServiceActionDetail: S.optional(ServiceActionDetail) }),
).annotations({
  identifier: "CreateServiceActionOutput",
}) as any as S.Schema<CreateServiceActionOutput>;
export interface CreateTagOptionOutput {
  TagOptionDetail?: TagOptionDetail;
}
export const CreateTagOptionOutput = S.suspend(() =>
  S.Struct({ TagOptionDetail: S.optional(TagOptionDetail) }),
).annotations({
  identifier: "CreateTagOptionOutput",
}) as any as S.Schema<CreateTagOptionOutput>;
export interface DescribePortfolioOutput {
  PortfolioDetail?: PortfolioDetail;
  Tags?: Tag[];
  TagOptions?: TagOptionDetail[];
  Budgets?: BudgetDetail[];
}
export const DescribePortfolioOutput = S.suspend(() =>
  S.Struct({
    PortfolioDetail: S.optional(PortfolioDetail),
    Tags: S.optional(Tags),
    TagOptions: S.optional(TagOptionDetails),
    Budgets: S.optional(Budgets),
  }),
).annotations({
  identifier: "DescribePortfolioOutput",
}) as any as S.Schema<DescribePortfolioOutput>;
export interface DescribePortfolioSharesOutput {
  NextPageToken?: string;
  PortfolioShareDetails?: PortfolioShareDetail[];
}
export const DescribePortfolioSharesOutput = S.suspend(() =>
  S.Struct({
    NextPageToken: S.optional(S.String),
    PortfolioShareDetails: S.optional(PortfolioShareDetails),
  }),
).annotations({
  identifier: "DescribePortfolioSharesOutput",
}) as any as S.Schema<DescribePortfolioSharesOutput>;
export interface DescribeProductOutput {
  ProductViewSummary?: ProductViewSummary;
  ProvisioningArtifacts?: ProvisioningArtifact[];
  Budgets?: BudgetDetail[];
  LaunchPaths?: LaunchPath[];
}
export const DescribeProductOutput = S.suspend(() =>
  S.Struct({
    ProductViewSummary: S.optional(ProductViewSummary),
    ProvisioningArtifacts: S.optional(ProvisioningArtifacts),
    Budgets: S.optional(Budgets),
    LaunchPaths: S.optional(LaunchPaths),
  }),
).annotations({
  identifier: "DescribeProductOutput",
}) as any as S.Schema<DescribeProductOutput>;
export interface DescribeProvisionedProductOutput {
  ProvisionedProductDetail?: ProvisionedProductDetail;
  CloudWatchDashboards?: CloudWatchDashboard[];
}
export const DescribeProvisionedProductOutput = S.suspend(() =>
  S.Struct({
    ProvisionedProductDetail: S.optional(ProvisionedProductDetail),
    CloudWatchDashboards: S.optional(CloudWatchDashboards),
  }),
).annotations({
  identifier: "DescribeProvisionedProductOutput",
}) as any as S.Schema<DescribeProvisionedProductOutput>;
export interface ParameterConstraints {
  AllowedValues?: string[];
  AllowedPattern?: string;
  ConstraintDescription?: string;
  MaxLength?: string;
  MinLength?: string;
  MaxValue?: string;
  MinValue?: string;
}
export const ParameterConstraints = S.suspend(() =>
  S.Struct({
    AllowedValues: S.optional(AllowedValues),
    AllowedPattern: S.optional(S.String),
    ConstraintDescription: S.optional(S.String),
    MaxLength: S.optional(S.String),
    MinLength: S.optional(S.String),
    MaxValue: S.optional(S.String),
    MinValue: S.optional(S.String),
  }),
).annotations({
  identifier: "ParameterConstraints",
}) as any as S.Schema<ParameterConstraints>;
export interface ProvisioningArtifactParameter {
  ParameterKey?: string;
  DefaultValue?: string;
  ParameterType?: string;
  IsNoEcho?: boolean;
  Description?: string;
  ParameterConstraints?: ParameterConstraints;
}
export const ProvisioningArtifactParameter = S.suspend(() =>
  S.Struct({
    ParameterKey: S.optional(S.String),
    DefaultValue: S.optional(S.String),
    ParameterType: S.optional(S.String),
    IsNoEcho: S.optional(S.Boolean),
    Description: S.optional(S.String),
    ParameterConstraints: S.optional(ParameterConstraints),
  }),
).annotations({
  identifier: "ProvisioningArtifactParameter",
}) as any as S.Schema<ProvisioningArtifactParameter>;
export type ProvisioningArtifactParameters = ProvisioningArtifactParameter[];
export const ProvisioningArtifactParameters = S.Array(
  ProvisioningArtifactParameter,
);
export interface DescribeProvisioningParametersOutput {
  ProvisioningArtifactParameters?: ProvisioningArtifactParameter[];
  ConstraintSummaries?: ConstraintSummary[];
  UsageInstructions?: UsageInstruction[];
  TagOptions?: TagOptionSummary[];
  ProvisioningArtifactPreferences?: ProvisioningArtifactPreferences;
  ProvisioningArtifactOutputs?: ProvisioningArtifactOutput[];
  ProvisioningArtifactOutputKeys?: ProvisioningArtifactOutput[];
}
export const DescribeProvisioningParametersOutput = S.suspend(() =>
  S.Struct({
    ProvisioningArtifactParameters: S.optional(ProvisioningArtifactParameters),
    ConstraintSummaries: S.optional(ConstraintSummaries),
    UsageInstructions: S.optional(UsageInstructions),
    TagOptions: S.optional(TagOptionSummaries),
    ProvisioningArtifactPreferences: S.optional(
      ProvisioningArtifactPreferences,
    ),
    ProvisioningArtifactOutputs: S.optional(ProvisioningArtifactOutputs),
    ProvisioningArtifactOutputKeys: S.optional(ProvisioningArtifactOutputs),
  }),
).annotations({
  identifier: "DescribeProvisioningParametersOutput",
}) as any as S.Schema<DescribeProvisioningParametersOutput>;
export interface DescribeServiceActionOutput {
  ServiceActionDetail?: ServiceActionDetail;
}
export const DescribeServiceActionOutput = S.suspend(() =>
  S.Struct({ ServiceActionDetail: S.optional(ServiceActionDetail) }),
).annotations({
  identifier: "DescribeServiceActionOutput",
}) as any as S.Schema<DescribeServiceActionOutput>;
export interface DescribeServiceActionExecutionParametersOutput {
  ServiceActionParameters?: ExecutionParameter[];
}
export const DescribeServiceActionExecutionParametersOutput = S.suspend(() =>
  S.Struct({ ServiceActionParameters: S.optional(ExecutionParameters) }),
).annotations({
  identifier: "DescribeServiceActionExecutionParametersOutput",
}) as any as S.Schema<DescribeServiceActionExecutionParametersOutput>;
export interface ExecuteProvisionedProductServiceActionOutput {
  RecordDetail?: RecordDetail;
}
export const ExecuteProvisionedProductServiceActionOutput = S.suspend(() =>
  S.Struct({ RecordDetail: S.optional(RecordDetail) }),
).annotations({
  identifier: "ExecuteProvisionedProductServiceActionOutput",
}) as any as S.Schema<ExecuteProvisionedProductServiceActionOutput>;
export interface ListLaunchPathsOutput {
  LaunchPathSummaries?: LaunchPathSummary[];
  NextPageToken?: string;
}
export const ListLaunchPathsOutput = S.suspend(() =>
  S.Struct({
    LaunchPathSummaries: S.optional(LaunchPathSummaries),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLaunchPathsOutput",
}) as any as S.Schema<ListLaunchPathsOutput>;
export interface ListPrincipalsForPortfolioOutput {
  Principals?: Principal[];
  NextPageToken?: string;
}
export const ListPrincipalsForPortfolioOutput = S.suspend(() =>
  S.Struct({
    Principals: S.optional(Principals),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPrincipalsForPortfolioOutput",
}) as any as S.Schema<ListPrincipalsForPortfolioOutput>;
export interface ListProvisioningArtifactsForServiceActionOutput {
  ProvisioningArtifactViews?: ProvisioningArtifactView[];
  NextPageToken?: string;
}
export const ListProvisioningArtifactsForServiceActionOutput = S.suspend(() =>
  S.Struct({
    ProvisioningArtifactViews: S.optional(ProvisioningArtifactViews),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProvisioningArtifactsForServiceActionOutput",
}) as any as S.Schema<ListProvisioningArtifactsForServiceActionOutput>;
export interface ListRecordHistoryOutput {
  RecordDetails?: RecordDetail[];
  NextPageToken?: string;
}
export const ListRecordHistoryOutput = S.suspend(() =>
  S.Struct({
    RecordDetails: S.optional(RecordDetails),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRecordHistoryOutput",
}) as any as S.Schema<ListRecordHistoryOutput>;
export interface ListResourcesForTagOptionOutput {
  ResourceDetails?: ResourceDetail[];
  PageToken?: string;
}
export const ListResourcesForTagOptionOutput = S.suspend(() =>
  S.Struct({
    ResourceDetails: S.optional(ResourceDetails),
    PageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResourcesForTagOptionOutput",
}) as any as S.Schema<ListResourcesForTagOptionOutput>;
export interface ListServiceActionsOutput {
  ServiceActionSummaries?: ServiceActionSummary[];
  NextPageToken?: string;
}
export const ListServiceActionsOutput = S.suspend(() =>
  S.Struct({
    ServiceActionSummaries: S.optional(ServiceActionSummaries),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListServiceActionsOutput",
}) as any as S.Schema<ListServiceActionsOutput>;
export interface ListStackInstancesForProvisionedProductOutput {
  StackInstances?: StackInstance[];
  NextPageToken?: string;
}
export const ListStackInstancesForProvisionedProductOutput = S.suspend(() =>
  S.Struct({
    StackInstances: S.optional(StackInstances),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListStackInstancesForProvisionedProductOutput",
}) as any as S.Schema<ListStackInstancesForProvisionedProductOutput>;
export interface ListTagOptionsOutput {
  TagOptionDetails?: TagOptionDetail[];
  PageToken?: string;
}
export const ListTagOptionsOutput = S.suspend(() =>
  S.Struct({
    TagOptionDetails: S.optional(TagOptionDetails),
    PageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTagOptionsOutput",
}) as any as S.Schema<ListTagOptionsOutput>;
export interface NotifyProvisionProductEngineWorkflowResultInput {
  WorkflowToken: string;
  RecordId: string;
  Status: EngineWorkflowStatus;
  FailureReason?: string;
  ResourceIdentifier?: EngineWorkflowResourceIdentifier;
  Outputs?: RecordOutput[];
  IdempotencyToken: string;
}
export const NotifyProvisionProductEngineWorkflowResultInput = S.suspend(() =>
  S.Struct({
    WorkflowToken: S.String,
    RecordId: S.String,
    Status: EngineWorkflowStatus,
    FailureReason: S.optional(S.String),
    ResourceIdentifier: S.optional(EngineWorkflowResourceIdentifier),
    Outputs: S.optional(RecordOutputs),
    IdempotencyToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "NotifyProvisionProductEngineWorkflowResultInput",
}) as any as S.Schema<NotifyProvisionProductEngineWorkflowResultInput>;
export interface NotifyProvisionProductEngineWorkflowResultOutput {}
export const NotifyProvisionProductEngineWorkflowResultOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "NotifyProvisionProductEngineWorkflowResultOutput",
}) as any as S.Schema<NotifyProvisionProductEngineWorkflowResultOutput>;
export interface ProvisionProductOutput {
  RecordDetail?: RecordDetail;
}
export const ProvisionProductOutput = S.suspend(() =>
  S.Struct({ RecordDetail: S.optional(RecordDetail) }),
).annotations({
  identifier: "ProvisionProductOutput",
}) as any as S.Schema<ProvisionProductOutput>;
export interface UpdateProvisionedProductOutput {
  RecordDetail?: RecordDetail;
}
export const UpdateProvisionedProductOutput = S.suspend(() =>
  S.Struct({ RecordDetail: S.optional(RecordDetail) }),
).annotations({
  identifier: "UpdateProvisionedProductOutput",
}) as any as S.Schema<UpdateProvisionedProductOutput>;
export interface UpdateProvisionedProductPropertiesOutput {
  ProvisionedProductId?: string;
  ProvisionedProductProperties?: { [key: string]: string };
  RecordId?: string;
  Status?: RecordStatus;
}
export const UpdateProvisionedProductPropertiesOutput = S.suspend(() =>
  S.Struct({
    ProvisionedProductId: S.optional(S.String),
    ProvisionedProductProperties: S.optional(ProvisionedProductProperties),
    RecordId: S.optional(S.String),
    Status: S.optional(RecordStatus),
  }),
).annotations({
  identifier: "UpdateProvisionedProductPropertiesOutput",
}) as any as S.Schema<UpdateProvisionedProductPropertiesOutput>;
export interface ShareError {
  Accounts?: string[];
  Message?: string;
  Error?: string;
}
export const ShareError = S.suspend(() =>
  S.Struct({
    Accounts: S.optional(Namespaces),
    Message: S.optional(S.String),
    Error: S.optional(S.String),
  }),
).annotations({ identifier: "ShareError" }) as any as S.Schema<ShareError>;
export type ShareErrors = ShareError[];
export const ShareErrors = S.Array(ShareError);
export type RequiresRecreation = "NEVER" | "CONDITIONALLY" | "ALWAYS";
export const RequiresRecreation = S.Literal("NEVER", "CONDITIONALLY", "ALWAYS");
export interface ShareDetails {
  SuccessfulShares?: string[];
  ShareErrors?: ShareError[];
}
export const ShareDetails = S.suspend(() =>
  S.Struct({
    SuccessfulShares: S.optional(SuccessfulShares),
    ShareErrors: S.optional(ShareErrors),
  }),
).annotations({ identifier: "ShareDetails" }) as any as S.Schema<ShareDetails>;
export interface ProvisionedProductPlanSummary {
  PlanName?: string;
  PlanId?: string;
  ProvisionProductId?: string;
  ProvisionProductName?: string;
  PlanType?: ProvisionedProductPlanType;
  ProvisioningArtifactId?: string;
}
export const ProvisionedProductPlanSummary = S.suspend(() =>
  S.Struct({
    PlanName: S.optional(S.String),
    PlanId: S.optional(S.String),
    ProvisionProductId: S.optional(S.String),
    ProvisionProductName: S.optional(S.String),
    PlanType: S.optional(ProvisionedProductPlanType),
    ProvisioningArtifactId: S.optional(S.String),
  }),
).annotations({
  identifier: "ProvisionedProductPlanSummary",
}) as any as S.Schema<ProvisionedProductPlanSummary>;
export type ProvisionedProductPlans = ProvisionedProductPlanSummary[];
export const ProvisionedProductPlans = S.Array(ProvisionedProductPlanSummary);
export interface ProvisionedProductAttribute {
  Name?: string;
  Arn?: string;
  Type?: string;
  Id?: string;
  Status?: ProvisionedProductStatus;
  StatusMessage?: string;
  CreatedTime?: Date;
  IdempotencyToken?: string;
  LastRecordId?: string;
  LastProvisioningRecordId?: string;
  LastSuccessfulProvisioningRecordId?: string;
  Tags?: Tag[];
  PhysicalId?: string;
  ProductId?: string;
  ProductName?: string;
  ProvisioningArtifactId?: string;
  ProvisioningArtifactName?: string;
  UserArn?: string;
  UserArnSession?: string;
}
export const ProvisionedProductAttribute = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    Type: S.optional(S.String),
    Id: S.optional(S.String),
    Status: S.optional(ProvisionedProductStatus),
    StatusMessage: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    IdempotencyToken: S.optional(S.String),
    LastRecordId: S.optional(S.String),
    LastProvisioningRecordId: S.optional(S.String),
    LastSuccessfulProvisioningRecordId: S.optional(S.String),
    Tags: S.optional(Tags),
    PhysicalId: S.optional(S.String),
    ProductId: S.optional(S.String),
    ProductName: S.optional(S.String),
    ProvisioningArtifactId: S.optional(S.String),
    ProvisioningArtifactName: S.optional(S.String),
    UserArn: S.optional(S.String),
    UserArnSession: S.optional(S.String),
  }),
).annotations({
  identifier: "ProvisionedProductAttribute",
}) as any as S.Schema<ProvisionedProductAttribute>;
export type ProvisionedProductAttributes = ProvisionedProductAttribute[];
export const ProvisionedProductAttributes = S.Array(
  ProvisionedProductAttribute,
);
export interface ResourceTargetDefinition {
  Attribute?: ResourceAttribute;
  Name?: string;
  RequiresRecreation?: RequiresRecreation;
}
export const ResourceTargetDefinition = S.suspend(() =>
  S.Struct({
    Attribute: S.optional(ResourceAttribute),
    Name: S.optional(S.String),
    RequiresRecreation: S.optional(RequiresRecreation),
  }),
).annotations({
  identifier: "ResourceTargetDefinition",
}) as any as S.Schema<ResourceTargetDefinition>;
export interface CreateProductInput {
  AcceptLanguage?: string;
  Name: string;
  Owner: string;
  Description?: string;
  Distributor?: string;
  SupportDescription?: string;
  SupportEmail?: string;
  SupportUrl?: string;
  ProductType: ProductType;
  Tags?: Tag[];
  ProvisioningArtifactParameters?: ProvisioningArtifactProperties;
  IdempotencyToken: string;
  SourceConnection?: SourceConnection;
}
export const CreateProductInput = S.suspend(() =>
  S.Struct({
    AcceptLanguage: S.optional(S.String),
    Name: S.String,
    Owner: S.String,
    Description: S.optional(S.String),
    Distributor: S.optional(S.String),
    SupportDescription: S.optional(S.String),
    SupportEmail: S.optional(S.String),
    SupportUrl: S.optional(S.String),
    ProductType: ProductType,
    Tags: S.optional(AddTags),
    ProvisioningArtifactParameters: S.optional(ProvisioningArtifactProperties),
    IdempotencyToken: S.String.pipe(T.IdempotencyToken()),
    SourceConnection: S.optional(SourceConnection),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateProductInput",
}) as any as S.Schema<CreateProductInput>;
export interface DescribePortfolioShareStatusOutput {
  PortfolioShareToken?: string;
  PortfolioId?: string;
  OrganizationNodeValue?: string;
  Status?: ShareStatus;
  ShareDetails?: ShareDetails;
}
export const DescribePortfolioShareStatusOutput = S.suspend(() =>
  S.Struct({
    PortfolioShareToken: S.optional(S.String),
    PortfolioId: S.optional(S.String),
    OrganizationNodeValue: S.optional(S.String),
    Status: S.optional(ShareStatus),
    ShareDetails: S.optional(ShareDetails),
  }),
).annotations({
  identifier: "DescribePortfolioShareStatusOutput",
}) as any as S.Schema<DescribePortfolioShareStatusOutput>;
export interface DescribeProvisioningArtifactOutput {
  ProvisioningArtifactDetail?: ProvisioningArtifactDetail;
  Info?: { [key: string]: string };
  Status?: Status;
  ProvisioningArtifactParameters?: ProvisioningArtifactParameter[];
}
export const DescribeProvisioningArtifactOutput = S.suspend(() =>
  S.Struct({
    ProvisioningArtifactDetail: S.optional(ProvisioningArtifactDetail),
    Info: S.optional(ProvisioningArtifactInfo),
    Status: S.optional(Status),
    ProvisioningArtifactParameters: S.optional(ProvisioningArtifactParameters),
  }),
).annotations({
  identifier: "DescribeProvisioningArtifactOutput",
}) as any as S.Schema<DescribeProvisioningArtifactOutput>;
export interface DescribeRecordOutput {
  RecordDetail?: RecordDetail;
  RecordOutputs?: RecordOutput[];
  NextPageToken?: string;
}
export const DescribeRecordOutput = S.suspend(() =>
  S.Struct({
    RecordDetail: S.optional(RecordDetail),
    RecordOutputs: S.optional(RecordOutputs),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeRecordOutput",
}) as any as S.Schema<DescribeRecordOutput>;
export interface ListProvisionedProductPlansOutput {
  ProvisionedProductPlans?: ProvisionedProductPlanSummary[];
  NextPageToken?: string;
}
export const ListProvisionedProductPlansOutput = S.suspend(() =>
  S.Struct({
    ProvisionedProductPlans: S.optional(ProvisionedProductPlans),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProvisionedProductPlansOutput",
}) as any as S.Schema<ListProvisionedProductPlansOutput>;
export interface SearchProvisionedProductsOutput {
  ProvisionedProducts?: ProvisionedProductAttribute[];
  TotalResultsCount?: number;
  NextPageToken?: string;
}
export const SearchProvisionedProductsOutput = S.suspend(() =>
  S.Struct({
    ProvisionedProducts: S.optional(ProvisionedProductAttributes),
    TotalResultsCount: S.optional(S.Number),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchProvisionedProductsOutput",
}) as any as S.Schema<SearchProvisionedProductsOutput>;
export interface ResourceChangeDetail {
  Target?: ResourceTargetDefinition;
  Evaluation?: EvaluationType;
  CausingEntity?: string;
}
export const ResourceChangeDetail = S.suspend(() =>
  S.Struct({
    Target: S.optional(ResourceTargetDefinition),
    Evaluation: S.optional(EvaluationType),
    CausingEntity: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceChangeDetail",
}) as any as S.Schema<ResourceChangeDetail>;
export type ResourceChangeDetails = ResourceChangeDetail[];
export const ResourceChangeDetails = S.Array(ResourceChangeDetail);
export interface ProductViewAggregationValue {
  Value?: string;
  ApproximateCount?: number;
}
export const ProductViewAggregationValue = S.suspend(() =>
  S.Struct({
    Value: S.optional(S.String),
    ApproximateCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "ProductViewAggregationValue",
}) as any as S.Schema<ProductViewAggregationValue>;
export type ProductViewAggregationValues = ProductViewAggregationValue[];
export const ProductViewAggregationValues = S.Array(
  ProductViewAggregationValue,
);
export interface ResourceChange {
  Action?: ChangeAction;
  LogicalResourceId?: string;
  PhysicalResourceId?: string;
  ResourceType?: string;
  Replacement?: Replacement;
  Scope?: ResourceAttribute[];
  Details?: ResourceChangeDetail[];
}
export const ResourceChange = S.suspend(() =>
  S.Struct({
    Action: S.optional(ChangeAction),
    LogicalResourceId: S.optional(S.String),
    PhysicalResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    Replacement: S.optional(Replacement),
    Scope: S.optional(Scope),
    Details: S.optional(ResourceChangeDetails),
  }),
).annotations({
  identifier: "ResourceChange",
}) as any as S.Schema<ResourceChange>;
export type ResourceChanges = ResourceChange[];
export const ResourceChanges = S.Array(ResourceChange);
export type ProductViewAggregations = {
  [key: string]: ProductViewAggregationValue[];
};
export const ProductViewAggregations = S.Record({
  key: S.String,
  value: ProductViewAggregationValues,
});
export interface CreateProductOutput {
  ProductViewDetail?: ProductViewDetail;
  ProvisioningArtifactDetail?: ProvisioningArtifactDetail;
  Tags?: Tag[];
}
export const CreateProductOutput = S.suspend(() =>
  S.Struct({
    ProductViewDetail: S.optional(ProductViewDetail),
    ProvisioningArtifactDetail: S.optional(ProvisioningArtifactDetail),
    Tags: S.optional(Tags),
  }),
).annotations({
  identifier: "CreateProductOutput",
}) as any as S.Schema<CreateProductOutput>;
export interface DescribeProductAsAdminOutput {
  ProductViewDetail?: ProductViewDetail;
  ProvisioningArtifactSummaries?: ProvisioningArtifactSummary[];
  Tags?: Tag[];
  TagOptions?: TagOptionDetail[];
  Budgets?: BudgetDetail[];
}
export const DescribeProductAsAdminOutput = S.suspend(() =>
  S.Struct({
    ProductViewDetail: S.optional(ProductViewDetail),
    ProvisioningArtifactSummaries: S.optional(ProvisioningArtifactSummaries),
    Tags: S.optional(Tags),
    TagOptions: S.optional(TagOptionDetails),
    Budgets: S.optional(Budgets),
  }),
).annotations({
  identifier: "DescribeProductAsAdminOutput",
}) as any as S.Schema<DescribeProductAsAdminOutput>;
export interface DescribeProvisionedProductPlanOutput {
  ProvisionedProductPlanDetails?: ProvisionedProductPlanDetails;
  ResourceChanges?: ResourceChange[];
  NextPageToken?: string;
}
export const DescribeProvisionedProductPlanOutput = S.suspend(() =>
  S.Struct({
    ProvisionedProductPlanDetails: S.optional(ProvisionedProductPlanDetails),
    ResourceChanges: S.optional(ResourceChanges),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeProvisionedProductPlanOutput",
}) as any as S.Schema<DescribeProvisionedProductPlanOutput>;
export interface SearchProductsOutput {
  ProductViewSummaries?: ProductViewSummary[];
  ProductViewAggregations?: { [key: string]: ProductViewAggregationValue[] };
  NextPageToken?: string;
}
export const SearchProductsOutput = S.suspend(() =>
  S.Struct({
    ProductViewSummaries: S.optional(ProductViewSummaries),
    ProductViewAggregations: S.optional(ProductViewAggregations),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchProductsOutput",
}) as any as S.Schema<SearchProductsOutput>;

//# Errors
export class InvalidStateException extends S.TaggedError<InvalidStateException>()(
  "InvalidStateException",
  { Message: S.optional(S.String) },
) {}
export class InvalidParametersException extends S.TaggedError<InvalidParametersException>()(
  "InvalidParametersException",
  { Message: S.optional(S.String) },
) {}
export class DuplicateResourceException extends S.TaggedError<DuplicateResourceException>()(
  "DuplicateResourceException",
  { Message: S.optional(S.String) },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { Message: S.optional(S.String) },
) {}
export class OperationNotSupportedException extends S.TaggedError<OperationNotSupportedException>()(
  "OperationNotSupportedException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class TagOptionNotMigratedException extends S.TaggedError<TagOptionNotMigratedException>()(
  "TagOptionNotMigratedException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Disassociates the specified budget from the specified resource.
 */
export const disassociateBudgetFromResource: (
  input: DisassociateBudgetFromResourceInput,
) => effect.Effect<
  DisassociateBudgetFromResourceOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateBudgetFromResourceInput,
  output: DisassociateBudgetFromResourceOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Provisions or modifies a product based on the resource changes for the specified plan.
 */
export const executeProvisionedProductPlan: (
  input: ExecuteProvisionedProductPlanInput,
) => effect.Effect<
  ExecuteProvisionedProductPlanOutput,
  | InvalidParametersException
  | InvalidStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExecuteProvisionedProductPlanInput,
  output: ExecuteProvisionedProductPlanOutput,
  errors: [
    InvalidParametersException,
    InvalidStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * This API takes either a `ProvisonedProductId` or a `ProvisionedProductName`, along with a list of one or more output keys, and responds with the key/value pairs of those outputs.
 */
export const getProvisionedProductOutputs: {
  (
    input: GetProvisionedProductOutputsInput,
  ): effect.Effect<
    GetProvisionedProductOutputsOutput,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: GetProvisionedProductOutputsInput,
  ) => stream.Stream<
    GetProvisionedProductOutputsOutput,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: GetProvisionedProductOutputsInput,
  ) => stream.Stream<
    unknown,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetProvisionedProductOutputsInput,
  output: GetProvisionedProductOutputsOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
  pagination: {
    inputToken: "PageToken",
    outputToken: "NextPageToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Requests the import of a resource as an Service Catalog provisioned product
 * that is associated to an Service Catalog product and provisioning artifact.
 * Once imported, all supported governance actions are supported on the provisioned product.
 *
 * Resource import only supports CloudFormation stack ARNs. CloudFormation StackSets,
 * and non-root nested stacks, are not supported.
 *
 * The CloudFormation stack must have one
 * of the following statuses
 * to be imported: `CREATE_COMPLETE`, `UPDATE_COMPLETE`,
 * `UPDATE_ROLLBACK_COMPLETE`, `IMPORT_COMPLETE`, and
 * `IMPORT_ROLLBACK_COMPLETE`.
 *
 * Import of the resource requires that the CloudFormation stack template matches
 * the associated Service Catalog product provisioning artifact.
 *
 * When you import an existing CloudFormation stack
 * into a portfolio, Service Catalog does not apply the product's associated constraints
 * during the import process. Service Catalog applies the constraints
 * after you call `UpdateProvisionedProduct` for the provisioned product.
 *
 * The user or role that performs this operation must have the `cloudformation:GetTemplate`
 * and `cloudformation:DescribeStacks` IAM policy permissions.
 *
 * You can only import one provisioned product at a time. The product's CloudFormation stack must have the
 * `IMPORT_COMPLETE` status before you import another.
 */
export const importAsProvisionedProduct: (
  input: ImportAsProvisionedProductInput,
) => effect.Effect<
  ImportAsProvisionedProductOutput,
  | DuplicateResourceException
  | InvalidParametersException
  | InvalidStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportAsProvisionedProductInput,
  output: ImportAsProvisionedProductOutput,
  errors: [
    DuplicateResourceException,
    InvalidParametersException,
    InvalidStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists all imported portfolios for which account-to-account shares were accepted by
 * this account. By specifying the `PortfolioShareType`, you can list portfolios for which
 * organizational shares were accepted by this account.
 */
export const listAcceptedPortfolioShares: {
  (
    input: ListAcceptedPortfolioSharesInput,
  ): effect.Effect<
    ListAcceptedPortfolioSharesOutput,
    InvalidParametersException | OperationNotSupportedException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListAcceptedPortfolioSharesInput,
  ) => stream.Stream<
    ListAcceptedPortfolioSharesOutput,
    InvalidParametersException | OperationNotSupportedException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListAcceptedPortfolioSharesInput,
  ) => stream.Stream<
    unknown,
    InvalidParametersException | OperationNotSupportedException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAcceptedPortfolioSharesInput,
  output: ListAcceptedPortfolioSharesOutput,
  errors: [InvalidParametersException, OperationNotSupportedException],
  pagination: {
    inputToken: "PageToken",
    outputToken: "NextPageToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Lists all the budgets associated to the specified resource.
 */
export const listBudgetsForResource: {
  (
    input: ListBudgetsForResourceInput,
  ): effect.Effect<
    ListBudgetsForResourceOutput,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListBudgetsForResourceInput,
  ) => stream.Stream<
    ListBudgetsForResourceOutput,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListBudgetsForResourceInput,
  ) => stream.Stream<
    unknown,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBudgetsForResourceInput,
  output: ListBudgetsForResourceOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
  pagination: {
    inputToken: "PageToken",
    outputToken: "NextPageToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Lists the constraints for the specified portfolio and product.
 */
export const listConstraintsForPortfolio: {
  (
    input: ListConstraintsForPortfolioInput,
  ): effect.Effect<
    ListConstraintsForPortfolioOutput,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListConstraintsForPortfolioInput,
  ) => stream.Stream<
    ListConstraintsForPortfolioOutput,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListConstraintsForPortfolioInput,
  ) => stream.Stream<
    unknown,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConstraintsForPortfolioInput,
  output: ListConstraintsForPortfolioOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
  pagination: {
    inputToken: "PageToken",
    outputToken: "NextPageToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Lists the organization nodes that have access to the specified portfolio. This API can
 * only be called by the management account in the organization or by a delegated
 * admin.
 *
 * If a delegated admin is de-registered, they can no longer perform this operation.
 */
export const listOrganizationPortfolioAccess: {
  (
    input: ListOrganizationPortfolioAccessInput,
  ): effect.Effect<
    ListOrganizationPortfolioAccessOutput,
    | InvalidParametersException
    | OperationNotSupportedException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListOrganizationPortfolioAccessInput,
  ) => stream.Stream<
    ListOrganizationPortfolioAccessOutput,
    | InvalidParametersException
    | OperationNotSupportedException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListOrganizationPortfolioAccessInput,
  ) => stream.Stream<
    unknown,
    | InvalidParametersException
    | OperationNotSupportedException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOrganizationPortfolioAccessInput,
  output: ListOrganizationPortfolioAccessOutput,
  errors: [
    InvalidParametersException,
    OperationNotSupportedException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "PageToken",
    outputToken: "NextPageToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Lists the account IDs that have access to the specified portfolio.
 *
 * A delegated admin can list the accounts that have access to the shared portfolio. Note that if a delegated admin is de-registered, they can no longer perform this operation.
 */
export const listPortfolioAccess: {
  (
    input: ListPortfolioAccessInput,
  ): effect.Effect<
    ListPortfolioAccessOutput,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListPortfolioAccessInput,
  ) => stream.Stream<
    ListPortfolioAccessOutput,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListPortfolioAccessInput,
  ) => stream.Stream<
    unknown,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPortfolioAccessInput,
  output: ListPortfolioAccessOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
  pagination: {
    inputToken: "PageToken",
    outputToken: "NextPageToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Lists all portfolios in the catalog.
 */
export const listPortfolios: {
  (
    input: ListPortfoliosInput,
  ): effect.Effect<
    ListPortfoliosOutput,
    InvalidParametersException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListPortfoliosInput,
  ) => stream.Stream<
    ListPortfoliosOutput,
    InvalidParametersException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListPortfoliosInput,
  ) => stream.Stream<
    unknown,
    InvalidParametersException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPortfoliosInput,
  output: ListPortfoliosOutput,
  errors: [InvalidParametersException],
  pagination: {
    inputToken: "PageToken",
    outputToken: "NextPageToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Lists all portfolios that the specified product is associated with.
 */
export const listPortfoliosForProduct: {
  (
    input: ListPortfoliosForProductInput,
  ): effect.Effect<
    ListPortfoliosForProductOutput,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListPortfoliosForProductInput,
  ) => stream.Stream<
    ListPortfoliosForProductOutput,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListPortfoliosForProductInput,
  ) => stream.Stream<
    unknown,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPortfoliosForProductInput,
  output: ListPortfoliosForProductOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
  pagination: {
    inputToken: "PageToken",
    outputToken: "NextPageToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Lists all provisioning artifacts (also known as versions) for the specified product.
 */
export const listProvisioningArtifacts: (
  input: ListProvisioningArtifactsInput,
) => effect.Effect<
  ListProvisioningArtifactsOutput,
  InvalidParametersException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListProvisioningArtifactsInput,
  output: ListProvisioningArtifactsOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Returns a paginated list of self-service actions associated with the specified Product ID and Provisioning Artifact ID.
 */
export const listServiceActionsForProvisioningArtifact: {
  (
    input: ListServiceActionsForProvisioningArtifactInput,
  ): effect.Effect<
    ListServiceActionsForProvisioningArtifactOutput,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListServiceActionsForProvisioningArtifactInput,
  ) => stream.Stream<
    ListServiceActionsForProvisioningArtifactOutput,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListServiceActionsForProvisioningArtifactInput,
  ) => stream.Stream<
    unknown,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServiceActionsForProvisioningArtifactInput,
  output: ListServiceActionsForProvisioningArtifactOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
  pagination: {
    inputToken: "PageToken",
    outputToken: "NextPageToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Lists the provisioned products that are available (not terminated).
 *
 * To use additional filtering, see SearchProvisionedProducts.
 */
export const scanProvisionedProducts: (
  input: ScanProvisionedProductsInput,
) => effect.Effect<
  ScanProvisionedProductsOutput,
  InvalidParametersException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScanProvisionedProductsInput,
  output: ScanProvisionedProductsOutput,
  errors: [InvalidParametersException],
}));
/**
 * Gets information about the products for the specified portfolio or all products.
 */
export const searchProductsAsAdmin: {
  (
    input: SearchProductsAsAdminInput,
  ): effect.Effect<
    SearchProductsAsAdminOutput,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: SearchProductsAsAdminInput,
  ) => stream.Stream<
    SearchProductsAsAdminOutput,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: SearchProductsAsAdminInput,
  ) => stream.Stream<
    unknown,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchProductsAsAdminInput,
  output: SearchProductsAsAdminOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
  pagination: {
    inputToken: "PageToken",
    outputToken: "NextPageToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Terminates the specified provisioned product.
 *
 * This operation does not delete any records associated with the provisioned product.
 *
 * You can check the status of this request using DescribeRecord.
 */
export const terminateProvisionedProduct: (
  input: TerminateProvisionedProductInput,
) => effect.Effect<
  TerminateProvisionedProductOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TerminateProvisionedProductInput,
  output: TerminateProvisionedProductOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Updates the specified constraint.
 */
export const updateConstraint: (
  input: UpdateConstraintInput,
) => effect.Effect<
  UpdateConstraintOutput,
  InvalidParametersException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConstraintInput,
  output: UpdateConstraintOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Updates the specified portfolio share. You can use this API to enable or disable `TagOptions` sharing
 * or Principal sharing for an existing portfolio share.
 *
 * The portfolio share cannot be updated if the `CreatePortfolioShare` operation is `IN_PROGRESS`, as the share is not available to recipient entities.
 * In this case, you must wait for the portfolio share to be completed.
 *
 * You must provide the `accountId` or organization node in the input, but not both.
 *
 * If the portfolio is shared to both an external account and an organization node, and both shares need to be updated, you must invoke `UpdatePortfolioShare` separately for each share type.
 *
 * This API cannot be used for removing the portfolio share. You must use `DeletePortfolioShare` API for that action.
 *
 * When you associate a principal with portfolio, a potential privilege escalation path may occur when that portfolio is
 * then shared with other accounts. For a user in a recipient account who is *not* an Service Catalog Admin,
 * but still has the ability to create Principals (Users/Groups/Roles), that user could create a role that matches a principal
 * name association for the portfolio. Although this user may not know which principal names are associated through
 * Service Catalog, they may be able to guess the user. If this potential escalation path is a concern, then
 * Service Catalog recommends using `PrincipalType` as `IAM`. With this configuration,
 * the `PrincipalARN` must already exist in the recipient account before it can be associated.
 */
export const updatePortfolioShare: (
  input: UpdatePortfolioShareInput,
) => effect.Effect<
  UpdatePortfolioShareOutput,
  | InvalidParametersException
  | InvalidStateException
  | OperationNotSupportedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePortfolioShareInput,
  output: UpdatePortfolioShareOutput,
  errors: [
    InvalidParametersException,
    InvalidStateException,
    OperationNotSupportedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the specified provisioning artifact (also known as a version) for the specified product.
 *
 * You cannot update a provisioning artifact for a product that was shared with you.
 */
export const updateProvisioningArtifact: (
  input: UpdateProvisioningArtifactInput,
) => effect.Effect<
  UpdateProvisioningArtifactOutput,
  InvalidParametersException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProvisioningArtifactInput,
  output: UpdateProvisioningArtifactOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Updates a self-service action.
 */
export const updateServiceAction: (
  input: UpdateServiceActionInput,
) => effect.Effect<
  UpdateServiceActionOutput,
  InvalidParametersException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServiceActionInput,
  output: UpdateServiceActionOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Deletes the specified constraint.
 *
 * A delegated admin is authorized to invoke this command.
 */
export const deleteConstraint: (
  input: DeleteConstraintInput,
) => effect.Effect<
  DeleteConstraintOutput,
  InvalidParametersException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConstraintInput,
  output: DeleteConstraintOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Deletes the specified plan.
 */
export const deleteProvisionedProductPlan: (
  input: DeleteProvisionedProductPlanInput,
) => effect.Effect<
  DeleteProvisionedProductPlanOutput,
  InvalidParametersException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProvisionedProductPlanInput,
  output: DeleteProvisionedProductPlanOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Deletes the specified provisioning artifact (also known as a version) for the specified product.
 *
 * You cannot delete a provisioning artifact associated with a product that was shared with you.
 * You cannot delete the last provisioning artifact for a product, because a product must have at
 * least one provisioning artifact.
 */
export const deleteProvisioningArtifact: (
  input: DeleteProvisioningArtifactInput,
) => effect.Effect<
  DeleteProvisioningArtifactOutput,
  | InvalidParametersException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProvisioningArtifactInput,
  output: DeleteProvisioningArtifactOutput,
  errors: [
    InvalidParametersException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a self-service action.
 */
export const deleteServiceAction: (
  input: DeleteServiceActionInput,
) => effect.Effect<
  DeleteServiceActionOutput,
  | InvalidParametersException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServiceActionInput,
  output: DeleteServiceActionOutput,
  errors: [
    InvalidParametersException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Disassociates a previously associated principal ARN from a specified
 * portfolio.
 *
 * The `PrincipalType` and `PrincipalARN` must match the
 * `AssociatePrincipalWithPortfolio` call request details. For example,
 * to disassociate an association created with a `PrincipalARN` of `PrincipalType`
 * IAM you must use the `PrincipalType` IAM when calling `DisassociatePrincipalFromPortfolio`.
 *
 * For portfolios that have been shared with principal name sharing enabled: after disassociating a principal,
 * share recipient accounts will no longer be able to provision products in this portfolio using a role matching the name
 * of the associated principal.
 *
 * For more information, review associate-principal-with-portfolio
 * in the Amazon Web Services CLI Command Reference.
 *
 * If you disassociate a principal from a portfolio, with PrincipalType as `IAM`, the same principal will
 * still have access to the portfolio if it matches one of the associated principals of type `IAM_PATTERN`.
 * To fully remove access for a principal, verify all the associated Principals of type `IAM_PATTERN`,
 * and then ensure you disassociate any `IAM_PATTERN` principals that match the principal
 * whose access you are removing.
 */
export const disassociatePrincipalFromPortfolio: (
  input: DisassociatePrincipalFromPortfolioInput,
) => effect.Effect<
  DisassociatePrincipalFromPortfolioOutput,
  InvalidParametersException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociatePrincipalFromPortfolioInput,
  output: DisassociatePrincipalFromPortfolioOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Disassociates the specified product from the specified portfolio.
 *
 * A delegated admin is authorized to invoke this command.
 */
export const disassociateProductFromPortfolio: (
  input: DisassociateProductFromPortfolioInput,
) => effect.Effect<
  DisassociateProductFromPortfolioOutput,
  | InvalidParametersException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateProductFromPortfolioInput,
  output: DisassociateProductFromPortfolioOutput,
  errors: [
    InvalidParametersException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Disassociates the specified self-service action association from the specified provisioning artifact.
 */
export const disassociateServiceActionFromProvisioningArtifact: (
  input: DisassociateServiceActionFromProvisioningArtifactInput,
) => effect.Effect<
  DisassociateServiceActionFromProvisioningArtifactOutput,
  InvalidParametersException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateServiceActionFromProvisioningArtifactInput,
  output: DisassociateServiceActionFromProvisioningArtifactOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Notifies the result
 * of the terminate engine execution.
 */
export const notifyTerminateProvisionedProductEngineWorkflowResult: (
  input: NotifyTerminateProvisionedProductEngineWorkflowResultInput,
) => effect.Effect<
  NotifyTerminateProvisionedProductEngineWorkflowResultOutput,
  InvalidParametersException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: NotifyTerminateProvisionedProductEngineWorkflowResultInput,
  output: NotifyTerminateProvisionedProductEngineWorkflowResultOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Notifies the result
 * of the update engine execution.
 */
export const notifyUpdateProvisionedProductEngineWorkflowResult: (
  input: NotifyUpdateProvisionedProductEngineWorkflowResultInput,
) => effect.Effect<
  NotifyUpdateProvisionedProductEngineWorkflowResultOutput,
  InvalidParametersException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: NotifyUpdateProvisionedProductEngineWorkflowResultInput,
  output: NotifyUpdateProvisionedProductEngineWorkflowResultOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Get the Access Status for Organizations portfolio share feature. This API can only be
 * called by the management account in the organization or by a delegated admin.
 */
export const getAWSOrganizationsAccessStatus: (
  input: GetAWSOrganizationsAccessStatusInput,
) => effect.Effect<
  GetAWSOrganizationsAccessStatusOutput,
  OperationNotSupportedException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAWSOrganizationsAccessStatusInput,
  output: GetAWSOrganizationsAccessStatusOutput,
  errors: [OperationNotSupportedException, ResourceNotFoundException],
}));
/**
 * Enable portfolio sharing feature through Organizations. This API will allow Service Catalog to receive updates on your organization in order to sync your shares with the
 * current structure. This API can only be called by the management account in the organization.
 *
 * When you call this API, Service Catalog calls `organizations:EnableAWSServiceAccess` on your behalf so that your shares stay in sync with any changes in your Organizations structure.
 *
 * Note that a delegated administrator is not authorized to invoke `EnableAWSOrganizationsAccess`.
 *
 * If you have previously disabled Organizations access for Service Catalog, and then
 * enable access again, the portfolio access permissions might not sync with the latest changes to
 * the organization structure. Specifically, accounts that you removed from the organization after
 * disabling Service Catalog access, and before you enabled access again, can retain access to the
 * previously shared portfolio. As a result, an account that has been removed from the organization
 * might still be able to create or manage Amazon Web Services resources when it is no longer
 * authorized to do so. Amazon Web Services is working to resolve this issue.
 */
export const enableAWSOrganizationsAccess: (
  input: EnableAWSOrganizationsAccessInput,
) => effect.Effect<
  EnableAWSOrganizationsAccessOutput,
  | InvalidStateException
  | OperationNotSupportedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableAWSOrganizationsAccessInput,
  output: EnableAWSOrganizationsAccessOutput,
  errors: [
    InvalidStateException,
    OperationNotSupportedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Stops sharing the specified portfolio with the specified account or organization
 * node. Shares to an organization node can only be deleted by the management account of an
 * organization or by a delegated administrator.
 *
 * Note that if a delegated admin is de-registered, portfolio shares created from that account are removed.
 */
export const deletePortfolioShare: (
  input: DeletePortfolioShareInput,
) => effect.Effect<
  DeletePortfolioShareOutput,
  | InvalidParametersException
  | InvalidStateException
  | OperationNotSupportedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePortfolioShareInput,
  output: DeletePortfolioShareOutput,
  errors: [
    InvalidParametersException,
    InvalidStateException,
    OperationNotSupportedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Rejects an offer to share the specified portfolio.
 */
export const rejectPortfolioShare: (
  input: RejectPortfolioShareInput,
) => effect.Effect<
  RejectPortfolioShareOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectPortfolioShareInput,
  output: RejectPortfolioShareOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Gets information about the specified constraint.
 */
export const describeConstraint: (
  input: DescribeConstraintInput,
) => effect.Effect<
  DescribeConstraintOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConstraintInput,
  output: DescribeConstraintOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Gets the status of the specified copy product operation.
 */
export const describeCopyProductStatus: (
  input: DescribeCopyProductStatusInput,
) => effect.Effect<
  DescribeCopyProductStatusOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCopyProductStatusInput,
  output: DescribeCopyProductStatusOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Gets information about the specified product.
 */
export const describeProductView: (
  input: DescribeProductViewInput,
) => effect.Effect<
  DescribeProductViewOutput,
  InvalidParametersException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProductViewInput,
  output: DescribeProductViewOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Disable portfolio sharing through the Organizations service. This command will not
 * delete your current shares, but prevents you from creating new shares throughout your
 * organization. Current shares are not kept in sync with your organization structure if the structure
 * changes after calling this API. Only the management account in the organization can call this API.
 *
 * You cannot call this API if there are active delegated administrators in the organization.
 *
 * Note that a delegated administrator is not authorized to invoke `DisableAWSOrganizationsAccess`.
 *
 * If you share an Service Catalog portfolio in an organization within
 * Organizations, and then disable Organizations access for Service Catalog,
 * the portfolio access permissions will not sync with the latest changes to the organization
 * structure. Specifically, accounts that you removed from the organization after
 * disabling Service Catalog access will retain access to the previously shared portfolio.
 */
export const disableAWSOrganizationsAccess: (
  input: DisableAWSOrganizationsAccessInput,
) => effect.Effect<
  DisableAWSOrganizationsAccessOutput,
  | InvalidStateException
  | OperationNotSupportedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableAWSOrganizationsAccessInput,
  output: DisableAWSOrganizationsAccessOutput,
  errors: [
    InvalidStateException,
    OperationNotSupportedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Accepts an offer to share the specified portfolio.
 */
export const acceptPortfolioShare: (
  input: AcceptPortfolioShareInput,
) => effect.Effect<
  AcceptPortfolioShareOutput,
  | InvalidParametersException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptPortfolioShareInput,
  output: AcceptPortfolioShareOutput,
  errors: [
    InvalidParametersException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Associates multiple self-service actions with provisioning artifacts.
 */
export const batchAssociateServiceActionWithProvisioningArtifact: (
  input: BatchAssociateServiceActionWithProvisioningArtifactInput,
) => effect.Effect<
  BatchAssociateServiceActionWithProvisioningArtifactOutput,
  InvalidParametersException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchAssociateServiceActionWithProvisioningArtifactInput,
  output: BatchAssociateServiceActionWithProvisioningArtifactOutput,
  errors: [InvalidParametersException],
}));
/**
 * Disassociates a batch of self-service actions from the specified provisioning artifact.
 */
export const batchDisassociateServiceActionFromProvisioningArtifact: (
  input: BatchDisassociateServiceActionFromProvisioningArtifactInput,
) => effect.Effect<
  BatchDisassociateServiceActionFromProvisioningArtifactOutput,
  InvalidParametersException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDisassociateServiceActionFromProvisioningArtifactInput,
  output: BatchDisassociateServiceActionFromProvisioningArtifactOutput,
  errors: [InvalidParametersException],
}));
/**
 * Copies the specified source product to the specified target product or a new
 * product.
 *
 * You can copy a product to the same account or another account. You can copy a product
 * to the same Region or another Region. If you copy a product to another account, you must
 * first share the product in a portfolio using CreatePortfolioShare.
 *
 * This operation is performed asynchronously. To track the progress of the
 * operation, use DescribeCopyProductStatus.
 */
export const copyProduct: (
  input: CopyProductInput,
) => effect.Effect<
  CopyProductOutput,
  InvalidParametersException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopyProductInput,
  output: CopyProductOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Creates a constraint.
 *
 * A delegated admin is authorized to invoke this command.
 */
export const createConstraint: (
  input: CreateConstraintInput,
) => effect.Effect<
  CreateConstraintOutput,
  | DuplicateResourceException
  | InvalidParametersException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConstraintInput,
  output: CreateConstraintOutput,
  errors: [
    DuplicateResourceException,
    InvalidParametersException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Shares the specified portfolio with the specified account or organization node.
 * Shares to an organization node can only be created by the management account of an
 * organization or by a delegated administrator. You can share portfolios to an organization,
 * an organizational unit, or a specific account.
 *
 * Note that if a delegated admin is de-registered, they can no longer create portfolio shares.
 *
 * `AWSOrganizationsAccess` must be enabled in order to create a portfolio share to an organization node.
 *
 * You can't share a shared resource, including portfolios that contain a shared product.
 *
 * If the portfolio share with the specified account or organization node already exists, this action will have no effect
 * and will not return an error. To update an existing share, you must use the ` UpdatePortfolioShare` API instead.
 *
 * When you associate a principal with portfolio, a potential privilege escalation path may occur when that portfolio is
 * then shared with other accounts. For a user in a recipient account who is *not* an Service Catalog Admin,
 * but still has the ability to create Principals (Users/Groups/Roles), that user could create a role that matches a principal
 * name association for the portfolio. Although this user may not know which principal names are associated through
 * Service Catalog, they may be able to guess the user. If this potential escalation path is a concern, then
 * Service Catalog recommends using `PrincipalType` as `IAM`. With this configuration,
 * the `PrincipalARN` must already exist in the recipient account before it can be associated.
 */
export const createPortfolioShare: (
  input: CreatePortfolioShareInput,
) => effect.Effect<
  CreatePortfolioShareOutput,
  | InvalidParametersException
  | InvalidStateException
  | LimitExceededException
  | OperationNotSupportedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePortfolioShareInput,
  output: CreatePortfolioShareOutput,
  errors: [
    InvalidParametersException,
    InvalidStateException,
    LimitExceededException,
    OperationNotSupportedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a plan.
 *
 * A plan includes the list of resources to be
 * created (when provisioning a new product) or modified (when updating a provisioned product)
 * when the plan is executed.
 *
 * You can create one plan for each provisioned product. To create a plan for an existing
 * provisioned product, the product status must be AVAILABLE or TAINTED.
 *
 * To view the resource changes in the change set, use DescribeProvisionedProductPlan.
 * To create or modify the provisioned product, use ExecuteProvisionedProductPlan.
 */
export const createProvisionedProductPlan: (
  input: CreateProvisionedProductPlanInput,
) => effect.Effect<
  CreateProvisionedProductPlanOutput,
  | InvalidParametersException
  | InvalidStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProvisionedProductPlanInput,
  output: CreateProvisionedProductPlanOutput,
  errors: [
    InvalidParametersException,
    InvalidStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a provisioning artifact (also known as a version) for the specified product.
 *
 * You cannot create a provisioning artifact for a product that was shared with you.
 *
 * The user or role that performs this operation must have the `cloudformation:GetTemplate`
 * IAM policy permission. This policy permission is required when using the
 * `ImportFromPhysicalId` template source in the information data section.
 */
export const createProvisioningArtifact: (
  input: CreateProvisioningArtifactInput,
) => effect.Effect<
  CreateProvisioningArtifactOutput,
  | InvalidParametersException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProvisioningArtifactInput,
  output: CreateProvisioningArtifactOutput,
  errors: [
    InvalidParametersException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a self-service action.
 */
export const createServiceAction: (
  input: CreateServiceActionInput,
) => effect.Effect<
  CreateServiceActionOutput,
  InvalidParametersException | LimitExceededException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateServiceActionInput,
  output: CreateServiceActionOutput,
  errors: [InvalidParametersException, LimitExceededException],
}));
/**
 * Gets information about the specified portfolio.
 *
 * A delegated admin is authorized to invoke this command.
 */
export const describePortfolio: (
  input: DescribePortfolioInput,
) => effect.Effect<
  DescribePortfolioOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePortfolioInput,
  output: DescribePortfolioOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Returns a summary of each of the portfolio shares that were created for the specified portfolio.
 *
 * You can use this API to determine which accounts or organizational nodes this
 * portfolio have been shared, whether the recipient entity has imported the share, and
 * whether TagOptions are included with the share.
 *
 * The `PortfolioId` and `Type` parameters are both required.
 */
export const describePortfolioShares: {
  (
    input: DescribePortfolioSharesInput,
  ): effect.Effect<
    DescribePortfolioSharesOutput,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribePortfolioSharesInput,
  ) => stream.Stream<
    DescribePortfolioSharesOutput,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribePortfolioSharesInput,
  ) => stream.Stream<
    unknown,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribePortfolioSharesInput,
  output: DescribePortfolioSharesOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
  pagination: {
    inputToken: "PageToken",
    outputToken: "NextPageToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Gets information about the specified product.
 *
 * Running this operation
 * with administrator access
 * results
 * in a failure.
 * DescribeProductAsAdmin should be used instead.
 */
export const describeProduct: (
  input: DescribeProductInput,
) => effect.Effect<
  DescribeProductOutput,
  InvalidParametersException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProductInput,
  output: DescribeProductOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Gets information about the specified provisioned product.
 */
export const describeProvisionedProduct: (
  input: DescribeProvisionedProductInput,
) => effect.Effect<
  DescribeProvisionedProductOutput,
  InvalidParametersException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProvisionedProductInput,
  output: DescribeProvisionedProductOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Gets information about the configuration required to provision the specified product using
 * the specified provisioning artifact.
 *
 * If the output contains a TagOption key with an empty list of values, there is a
 * TagOption conflict for that key. The end user cannot take action to fix the conflict, and
 * launch is not blocked. In subsequent calls to ProvisionProduct,
 * do not include conflicted TagOption keys as tags, or this causes the error
 * "Parameter validation failed: Missing required parameter in Tags[*N*]:*Value*".
 * Tag the provisioned product with the value `sc-tagoption-conflict-portfolioId-productId`.
 */
export const describeProvisioningParameters: (
  input: DescribeProvisioningParametersInput,
) => effect.Effect<
  DescribeProvisioningParametersOutput,
  InvalidParametersException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProvisioningParametersInput,
  output: DescribeProvisioningParametersOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Describes a self-service action.
 */
export const describeServiceAction: (
  input: DescribeServiceActionInput,
) => effect.Effect<
  DescribeServiceActionOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeServiceActionInput,
  output: DescribeServiceActionOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Finds the default parameters for a specific self-service action on a specific provisioned product and returns a map of the results to the user.
 */
export const describeServiceActionExecutionParameters: (
  input: DescribeServiceActionExecutionParametersInput,
) => effect.Effect<
  DescribeServiceActionExecutionParametersOutput,
  InvalidParametersException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeServiceActionExecutionParametersInput,
  output: DescribeServiceActionExecutionParametersOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Executes a self-service action against a provisioned product.
 */
export const executeProvisionedProductServiceAction: (
  input: ExecuteProvisionedProductServiceActionInput,
) => effect.Effect<
  ExecuteProvisionedProductServiceActionOutput,
  | InvalidParametersException
  | InvalidStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExecuteProvisionedProductServiceActionInput,
  output: ExecuteProvisionedProductServiceActionOutput,
  errors: [
    InvalidParametersException,
    InvalidStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists the paths
 * to the specified product.
 * A path describes
 * how the user
 * gets access
 * to a specified product
 * and is necessary
 * when provisioning a product.
 * A path also determines the constraints
 * that are put on a product.
 * A path is dependent
 * on a specific product, porfolio, and principal.
 *
 * When provisioning a product
 * that's been added
 * to a portfolio,
 * you must grant your user, group, or role access
 * to the portfolio.
 * For more information,
 * see Granting users access
 * in the *Service Catalog User Guide*.
 */
export const listLaunchPaths: {
  (
    input: ListLaunchPathsInput,
  ): effect.Effect<
    ListLaunchPathsOutput,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListLaunchPathsInput,
  ) => stream.Stream<
    ListLaunchPathsOutput,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListLaunchPathsInput,
  ) => stream.Stream<
    unknown,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLaunchPathsInput,
  output: ListLaunchPathsOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
  pagination: {
    inputToken: "PageToken",
    outputToken: "NextPageToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Lists all `PrincipalARN`s and corresponding `PrincipalType`s associated with the specified portfolio.
 */
export const listPrincipalsForPortfolio: {
  (
    input: ListPrincipalsForPortfolioInput,
  ): effect.Effect<
    ListPrincipalsForPortfolioOutput,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListPrincipalsForPortfolioInput,
  ) => stream.Stream<
    ListPrincipalsForPortfolioOutput,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListPrincipalsForPortfolioInput,
  ) => stream.Stream<
    unknown,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPrincipalsForPortfolioInput,
  output: ListPrincipalsForPortfolioOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
  pagination: {
    inputToken: "PageToken",
    outputToken: "NextPageToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Lists all provisioning artifacts (also known as versions) for the specified self-service action.
 */
export const listProvisioningArtifactsForServiceAction: {
  (
    input: ListProvisioningArtifactsForServiceActionInput,
  ): effect.Effect<
    ListProvisioningArtifactsForServiceActionOutput,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListProvisioningArtifactsForServiceActionInput,
  ) => stream.Stream<
    ListProvisioningArtifactsForServiceActionOutput,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListProvisioningArtifactsForServiceActionInput,
  ) => stream.Stream<
    unknown,
    InvalidParametersException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProvisioningArtifactsForServiceActionInput,
  output: ListProvisioningArtifactsForServiceActionOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
  pagination: {
    inputToken: "PageToken",
    outputToken: "NextPageToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Lists the specified requests or all performed requests.
 */
export const listRecordHistory: (
  input: ListRecordHistoryInput,
) => effect.Effect<
  ListRecordHistoryOutput,
  InvalidParametersException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRecordHistoryInput,
  output: ListRecordHistoryOutput,
  errors: [InvalidParametersException],
}));
/**
 * Lists all self-service actions.
 */
export const listServiceActions: {
  (
    input: ListServiceActionsInput,
  ): effect.Effect<
    ListServiceActionsOutput,
    InvalidParametersException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListServiceActionsInput,
  ) => stream.Stream<
    ListServiceActionsOutput,
    InvalidParametersException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListServiceActionsInput,
  ) => stream.Stream<
    unknown,
    InvalidParametersException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServiceActionsInput,
  output: ListServiceActionsOutput,
  errors: [InvalidParametersException],
  pagination: {
    inputToken: "PageToken",
    outputToken: "NextPageToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Returns summary information about stack instances that are associated with the specified `CFN_STACKSET` type provisioned product. You can filter for stack instances that are associated with a specific Amazon Web Services account name or Region.
 */
export const listStackInstancesForProvisionedProduct: (
  input: ListStackInstancesForProvisionedProductInput,
) => effect.Effect<
  ListStackInstancesForProvisionedProductOutput,
  InvalidParametersException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStackInstancesForProvisionedProductInput,
  output: ListStackInstancesForProvisionedProductOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Notifies the result
 * of the provisioning engine execution.
 */
export const notifyProvisionProductEngineWorkflowResult: (
  input: NotifyProvisionProductEngineWorkflowResultInput,
) => effect.Effect<
  NotifyProvisionProductEngineWorkflowResultOutput,
  InvalidParametersException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: NotifyProvisionProductEngineWorkflowResultInput,
  output: NotifyProvisionProductEngineWorkflowResultOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Provisions the specified product.
 *
 * A provisioned product is a resourced instance
 * of a product.
 * For example,
 * provisioning a product
 * that's based
 * on an CloudFormation template
 * launches an CloudFormation stack and its underlying resources.
 * You can check the status
 * of this request
 * using DescribeRecord.
 *
 * If the request contains a tag key
 * with an empty list
 * of values,
 * there's a tag conflict
 * for that key.
 * Don't include conflicted keys
 * as tags,
 * or this will cause the error "Parameter validation failed: Missing required parameter in Tags[*N*]:*Value*".
 *
 * When provisioning a product
 * that's been added
 * to a portfolio,
 * you must grant your user, group, or role access
 * to the portfolio.
 * For more information,
 * see Granting users access
 * in the *Service Catalog User Guide*.
 */
export const provisionProduct: (
  input: ProvisionProductInput,
) => effect.Effect<
  ProvisionProductOutput,
  | DuplicateResourceException
  | InvalidParametersException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ProvisionProductInput,
  output: ProvisionProductOutput,
  errors: [
    DuplicateResourceException,
    InvalidParametersException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the specified product.
 */
export const updateProduct: (
  input: UpdateProductInput,
) => effect.Effect<
  UpdateProductOutput,
  | InvalidParametersException
  | ResourceNotFoundException
  | TagOptionNotMigratedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProductInput,
  output: UpdateProductOutput,
  errors: [
    InvalidParametersException,
    ResourceNotFoundException,
    TagOptionNotMigratedException,
  ],
}));
/**
 * Requests updates to the configuration of the specified provisioned product.
 *
 * If there are tags associated with the object, they cannot be updated or added.
 * Depending on the specific updates requested, this operation can update with no
 * interruption, with some interruption, or replace the provisioned product entirely.
 *
 * You can check the status of this request using DescribeRecord.
 */
export const updateProvisionedProduct: (
  input: UpdateProvisionedProductInput,
) => effect.Effect<
  UpdateProvisionedProductOutput,
  InvalidParametersException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProvisionedProductInput,
  output: UpdateProvisionedProductOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Requests updates to the properties of the specified provisioned product.
 */
export const updateProvisionedProductProperties: (
  input: UpdateProvisionedProductPropertiesInput,
) => effect.Effect<
  UpdateProvisionedProductPropertiesOutput,
  | InvalidParametersException
  | InvalidStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProvisionedProductPropertiesInput,
  output: UpdateProvisionedProductPropertiesOutput,
  errors: [
    InvalidParametersException,
    InvalidStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Associates the specified budget with the specified resource.
 */
export const associateBudgetWithResource: (
  input: AssociateBudgetWithResourceInput,
) => effect.Effect<
  AssociateBudgetWithResourceOutput,
  | DuplicateResourceException
  | InvalidParametersException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateBudgetWithResourceInput,
  output: AssociateBudgetWithResourceOutput,
  errors: [
    DuplicateResourceException,
    InvalidParametersException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the specified portfolio.
 *
 * You cannot update a product that was shared with you.
 */
export const updatePortfolio: (
  input: UpdatePortfolioInput,
) => effect.Effect<
  UpdatePortfolioOutput,
  | InvalidParametersException
  | LimitExceededException
  | ResourceNotFoundException
  | TagOptionNotMigratedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePortfolioInput,
  output: UpdatePortfolioOutput,
  errors: [
    InvalidParametersException,
    LimitExceededException,
    ResourceNotFoundException,
    TagOptionNotMigratedException,
  ],
}));
/**
 * Associates the specified principal ARN with the specified portfolio.
 *
 * If you share the portfolio with principal name sharing enabled, the `PrincipalARN` association is
 * included in the share.
 *
 * The `PortfolioID`, `PrincipalARN`, and `PrincipalType` parameters are
 * required.
 *
 * You can associate a maximum of 10 Principals with a portfolio using `PrincipalType` as `IAM_PATTERN`.
 *
 * When you associate a principal with portfolio, a potential privilege escalation path may occur when that portfolio is
 * then shared with other accounts. For a user in a recipient account who is *not* an Service Catalog Admin,
 * but still has the ability to create Principals (Users/Groups/Roles), that user could create a role that matches a principal
 * name association for the portfolio. Although this user may not know which principal names are associated through
 * Service Catalog, they may be able to guess the user. If this potential escalation path is a concern, then
 * Service Catalog recommends using `PrincipalType` as `IAM`. With this configuration,
 * the `PrincipalARN` must already exist in the recipient account before it can be associated.
 */
export const associatePrincipalWithPortfolio: (
  input: AssociatePrincipalWithPortfolioInput,
) => effect.Effect<
  AssociatePrincipalWithPortfolioOutput,
  | InvalidParametersException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociatePrincipalWithPortfolioInput,
  output: AssociatePrincipalWithPortfolioOutput,
  errors: [
    InvalidParametersException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Associates the specified product with the specified portfolio.
 *
 * A delegated admin is authorized to invoke this command.
 */
export const associateProductWithPortfolio: (
  input: AssociateProductWithPortfolioInput,
) => effect.Effect<
  AssociateProductWithPortfolioOutput,
  | InvalidParametersException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateProductWithPortfolioInput,
  output: AssociateProductWithPortfolioOutput,
  errors: [
    InvalidParametersException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Associates a self-service action with a provisioning artifact.
 */
export const associateServiceActionWithProvisioningArtifact: (
  input: AssociateServiceActionWithProvisioningArtifactInput,
) => effect.Effect<
  AssociateServiceActionWithProvisioningArtifactOutput,
  | DuplicateResourceException
  | InvalidParametersException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateServiceActionWithProvisioningArtifactInput,
  output: AssociateServiceActionWithProvisioningArtifactOutput,
  errors: [
    DuplicateResourceException,
    InvalidParametersException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Associate the specified TagOption with the specified portfolio or product.
 */
export const associateTagOptionWithResource: (
  input: AssociateTagOptionWithResourceInput,
) => effect.Effect<
  AssociateTagOptionWithResourceOutput,
  | DuplicateResourceException
  | InvalidParametersException
  | InvalidStateException
  | LimitExceededException
  | ResourceNotFoundException
  | TagOptionNotMigratedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateTagOptionWithResourceInput,
  output: AssociateTagOptionWithResourceOutput,
  errors: [
    DuplicateResourceException,
    InvalidParametersException,
    InvalidStateException,
    LimitExceededException,
    ResourceNotFoundException,
    TagOptionNotMigratedException,
  ],
}));
/**
 * Updates the specified TagOption.
 */
export const updateTagOption: (
  input: UpdateTagOptionInput,
) => effect.Effect<
  UpdateTagOptionOutput,
  | DuplicateResourceException
  | InvalidParametersException
  | ResourceNotFoundException
  | TagOptionNotMigratedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTagOptionInput,
  output: UpdateTagOptionOutput,
  errors: [
    DuplicateResourceException,
    InvalidParametersException,
    ResourceNotFoundException,
    TagOptionNotMigratedException,
  ],
}));
/**
 * Deletes the specified portfolio.
 *
 * You cannot delete a portfolio if it was shared with you or if it has associated
 * products, users, constraints, or shared accounts.
 *
 * A delegated admin is authorized to invoke this command.
 */
export const deletePortfolio: (
  input: DeletePortfolioInput,
) => effect.Effect<
  DeletePortfolioOutput,
  | InvalidParametersException
  | ResourceInUseException
  | ResourceNotFoundException
  | TagOptionNotMigratedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePortfolioInput,
  output: DeletePortfolioOutput,
  errors: [
    InvalidParametersException,
    ResourceInUseException,
    ResourceNotFoundException,
    TagOptionNotMigratedException,
  ],
}));
/**
 * Deletes the specified product.
 *
 * You cannot delete a product if it was shared with you or is associated with a portfolio.
 *
 * A delegated admin is authorized to invoke this command.
 */
export const deleteProduct: (
  input: DeleteProductInput,
) => effect.Effect<
  DeleteProductOutput,
  | InvalidParametersException
  | ResourceInUseException
  | ResourceNotFoundException
  | TagOptionNotMigratedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProductInput,
  output: DeleteProductOutput,
  errors: [
    InvalidParametersException,
    ResourceInUseException,
    ResourceNotFoundException,
    TagOptionNotMigratedException,
  ],
}));
/**
 * Disassociates the specified TagOption from the specified resource.
 */
export const disassociateTagOptionFromResource: (
  input: DisassociateTagOptionFromResourceInput,
) => effect.Effect<
  DisassociateTagOptionFromResourceOutput,
  ResourceNotFoundException | TagOptionNotMigratedException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateTagOptionFromResourceInput,
  output: DisassociateTagOptionFromResourceOutput,
  errors: [ResourceNotFoundException, TagOptionNotMigratedException],
}));
/**
 * Deletes the specified TagOption.
 *
 * You cannot delete a TagOption if it is associated with a product or portfolio.
 */
export const deleteTagOption: (
  input: DeleteTagOptionInput,
) => effect.Effect<
  DeleteTagOptionOutput,
  | ResourceInUseException
  | ResourceNotFoundException
  | TagOptionNotMigratedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTagOptionInput,
  output: DeleteTagOptionOutput,
  errors: [
    ResourceInUseException,
    ResourceNotFoundException,
    TagOptionNotMigratedException,
  ],
}));
/**
 * Gets information about the specified TagOption.
 */
export const describeTagOption: (
  input: DescribeTagOptionInput,
) => effect.Effect<
  DescribeTagOptionOutput,
  ResourceNotFoundException | TagOptionNotMigratedException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTagOptionInput,
  output: DescribeTagOptionOutput,
  errors: [ResourceNotFoundException, TagOptionNotMigratedException],
}));
/**
 * Creates a portfolio.
 *
 * A delegated admin is authorized to invoke this command.
 */
export const createPortfolio: (
  input: CreatePortfolioInput,
) => effect.Effect<
  CreatePortfolioOutput,
  | InvalidParametersException
  | LimitExceededException
  | TagOptionNotMigratedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePortfolioInput,
  output: CreatePortfolioOutput,
  errors: [
    InvalidParametersException,
    LimitExceededException,
    TagOptionNotMigratedException,
  ],
}));
/**
 * Creates a TagOption.
 */
export const createTagOption: (
  input: CreateTagOptionInput,
) => effect.Effect<
  CreateTagOptionOutput,
  | DuplicateResourceException
  | LimitExceededException
  | TagOptionNotMigratedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTagOptionInput,
  output: CreateTagOptionOutput,
  errors: [
    DuplicateResourceException,
    LimitExceededException,
    TagOptionNotMigratedException,
  ],
}));
/**
 * Lists the resources associated with the specified TagOption.
 */
export const listResourcesForTagOption: {
  (
    input: ListResourcesForTagOptionInput,
  ): effect.Effect<
    ListResourcesForTagOptionOutput,
    | InvalidParametersException
    | ResourceNotFoundException
    | TagOptionNotMigratedException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourcesForTagOptionInput,
  ) => stream.Stream<
    ListResourcesForTagOptionOutput,
    | InvalidParametersException
    | ResourceNotFoundException
    | TagOptionNotMigratedException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListResourcesForTagOptionInput,
  ) => stream.Stream<
    unknown,
    | InvalidParametersException
    | ResourceNotFoundException
    | TagOptionNotMigratedException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourcesForTagOptionInput,
  output: ListResourcesForTagOptionOutput,
  errors: [
    InvalidParametersException,
    ResourceNotFoundException,
    TagOptionNotMigratedException,
  ],
  pagination: {
    inputToken: "PageToken",
    outputToken: "PageToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Lists the specified TagOptions or all TagOptions.
 */
export const listTagOptions: {
  (
    input: ListTagOptionsInput,
  ): effect.Effect<
    ListTagOptionsOutput,
    InvalidParametersException | TagOptionNotMigratedException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListTagOptionsInput,
  ) => stream.Stream<
    ListTagOptionsOutput,
    InvalidParametersException | TagOptionNotMigratedException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListTagOptionsInput,
  ) => stream.Stream<
    unknown,
    InvalidParametersException | TagOptionNotMigratedException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTagOptionsInput,
  output: ListTagOptionsOutput,
  errors: [InvalidParametersException, TagOptionNotMigratedException],
  pagination: {
    inputToken: "PageToken",
    outputToken: "PageToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Gets the status of the specified portfolio share operation. This API can only be called
 * by the management account in the organization or by a delegated admin.
 */
export const describePortfolioShareStatus: (
  input: DescribePortfolioShareStatusInput,
) => effect.Effect<
  DescribePortfolioShareStatusOutput,
  | InvalidParametersException
  | OperationNotSupportedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePortfolioShareStatusInput,
  output: DescribePortfolioShareStatusOutput,
  errors: [
    InvalidParametersException,
    OperationNotSupportedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Gets information about the specified provisioning artifact (also known as a version) for the specified product.
 */
export const describeProvisioningArtifact: (
  input: DescribeProvisioningArtifactInput,
) => effect.Effect<
  DescribeProvisioningArtifactOutput,
  InvalidParametersException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProvisioningArtifactInput,
  output: DescribeProvisioningArtifactOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Gets information about the specified request operation.
 *
 * Use this operation after calling a request operation (for example, ProvisionProduct,
 * TerminateProvisionedProduct, or UpdateProvisionedProduct).
 *
 * If a provisioned product was transferred to a new owner using UpdateProvisionedProductProperties, the new owner
 * will be able to describe all past records for that product. The previous owner will no longer be able to describe the records, but will be able to
 * use ListRecordHistory to see the product's history from when he was the owner.
 */
export const describeRecord: (
  input: DescribeRecordInput,
) => effect.Effect<
  DescribeRecordOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRecordInput,
  output: DescribeRecordOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Lists the plans for the specified provisioned product or all plans to which the user has access.
 */
export const listProvisionedProductPlans: (
  input: ListProvisionedProductPlansInput,
) => effect.Effect<
  ListProvisionedProductPlansOutput,
  InvalidParametersException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListProvisionedProductPlansInput,
  output: ListProvisionedProductPlansOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Gets information about the provisioned products that meet the specified criteria.
 */
export const searchProvisionedProducts: {
  (
    input: SearchProvisionedProductsInput,
  ): effect.Effect<
    SearchProvisionedProductsOutput,
    InvalidParametersException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: SearchProvisionedProductsInput,
  ) => stream.Stream<
    SearchProvisionedProductsOutput,
    InvalidParametersException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: SearchProvisionedProductsInput,
  ) => stream.Stream<
    unknown,
    InvalidParametersException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchProvisionedProductsInput,
  output: SearchProvisionedProductsOutput,
  errors: [InvalidParametersException],
  pagination: {
    inputToken: "PageToken",
    outputToken: "NextPageToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Creates a product.
 *
 * A delegated admin is authorized to invoke this command.
 *
 * The user or role that performs this operation must have the
 * `cloudformation:GetTemplate` IAM policy permission. This policy permission is
 * required when using the `ImportFromPhysicalId` template source in the
 * information data section.
 */
export const createProduct: (
  input: CreateProductInput,
) => effect.Effect<
  CreateProductOutput,
  | InvalidParametersException
  | LimitExceededException
  | TagOptionNotMigratedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProductInput,
  output: CreateProductOutput,
  errors: [
    InvalidParametersException,
    LimitExceededException,
    TagOptionNotMigratedException,
  ],
}));
/**
 * Gets information about the specified product. This operation is run with administrator access.
 */
export const describeProductAsAdmin: (
  input: DescribeProductAsAdminInput,
) => effect.Effect<
  DescribeProductAsAdminOutput,
  InvalidParametersException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProductAsAdminInput,
  output: DescribeProductAsAdminOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Gets information about the resource changes for the specified plan.
 */
export const describeProvisionedProductPlan: (
  input: DescribeProvisionedProductPlanInput,
) => effect.Effect<
  DescribeProvisionedProductPlanOutput,
  InvalidParametersException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProvisionedProductPlanInput,
  output: DescribeProvisionedProductPlanOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Gets information about the products to which the caller has access.
 */
export const searchProducts: {
  (
    input: SearchProductsInput,
  ): effect.Effect<
    SearchProductsOutput,
    InvalidParametersException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: SearchProductsInput,
  ) => stream.Stream<
    SearchProductsOutput,
    InvalidParametersException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: SearchProductsInput,
  ) => stream.Stream<
    unknown,
    InvalidParametersException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchProductsInput,
  output: SearchProductsOutput,
  errors: [InvalidParametersException],
  pagination: {
    inputToken: "PageToken",
    outputToken: "NextPageToken",
    pageSize: "PageSize",
  } as const,
}));
