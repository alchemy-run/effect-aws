import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Service Catalog",
  serviceShapeName: "AWS242ServiceCatalogService",
});
const auth = T.AwsAuthSigv4({ name: "servicecatalog" });
const ver = T.ServiceVersion("2015-12-10");
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
                        url: "https://servicecatalog-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://servicecatalog-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://servicecatalog.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
              conditions: [],
              endpoint: {
                url: "https://servicecatalog.{Region}.{PartitionResult#dnsSuffix}",
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

//# Schemas
export class DisableAWSOrganizationsAccessInput extends S.Class<DisableAWSOrganizationsAccessInput>(
  "DisableAWSOrganizationsAccessInput",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisableAWSOrganizationsAccessOutput extends S.Class<DisableAWSOrganizationsAccessOutput>(
  "DisableAWSOrganizationsAccessOutput",
)({}) {}
export class EnableAWSOrganizationsAccessInput extends S.Class<EnableAWSOrganizationsAccessInput>(
  "EnableAWSOrganizationsAccessInput",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EnableAWSOrganizationsAccessOutput extends S.Class<EnableAWSOrganizationsAccessOutput>(
  "EnableAWSOrganizationsAccessOutput",
)({}) {}
export class GetAWSOrganizationsAccessStatusInput extends S.Class<GetAWSOrganizationsAccessStatusInput>(
  "GetAWSOrganizationsAccessStatusInput",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const CopyOptions = S.Array(S.String);
export const NotificationArns = S.Array(S.String);
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const Tags = S.Array(Tag);
export const OutputKeys = S.Array(S.String);
export const TagKeys = S.Array(S.String);
export class AcceptPortfolioShareInput extends S.Class<AcceptPortfolioShareInput>(
  "AcceptPortfolioShareInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    PortfolioShareType: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AcceptPortfolioShareOutput extends S.Class<AcceptPortfolioShareOutput>(
  "AcceptPortfolioShareOutput",
)({}) {}
export class AssociateBudgetWithResourceInput extends S.Class<AssociateBudgetWithResourceInput>(
  "AssociateBudgetWithResourceInput",
)(
  { BudgetName: S.String, ResourceId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateBudgetWithResourceOutput extends S.Class<AssociateBudgetWithResourceOutput>(
  "AssociateBudgetWithResourceOutput",
)({}) {}
export class AssociatePrincipalWithPortfolioInput extends S.Class<AssociatePrincipalWithPortfolioInput>(
  "AssociatePrincipalWithPortfolioInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    PrincipalARN: S.String,
    PrincipalType: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociatePrincipalWithPortfolioOutput extends S.Class<AssociatePrincipalWithPortfolioOutput>(
  "AssociatePrincipalWithPortfolioOutput",
)({}) {}
export class AssociateProductWithPortfolioInput extends S.Class<AssociateProductWithPortfolioInput>(
  "AssociateProductWithPortfolioInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    ProductId: S.String,
    PortfolioId: S.String,
    SourcePortfolioId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateProductWithPortfolioOutput extends S.Class<AssociateProductWithPortfolioOutput>(
  "AssociateProductWithPortfolioOutput",
)({}) {}
export class AssociateServiceActionWithProvisioningArtifactInput extends S.Class<AssociateServiceActionWithProvisioningArtifactInput>(
  "AssociateServiceActionWithProvisioningArtifactInput",
)(
  {
    ProductId: S.String,
    ProvisioningArtifactId: S.String,
    ServiceActionId: S.String,
    AcceptLanguage: S.optional(S.String),
    IdempotencyToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateServiceActionWithProvisioningArtifactOutput extends S.Class<AssociateServiceActionWithProvisioningArtifactOutput>(
  "AssociateServiceActionWithProvisioningArtifactOutput",
)({}) {}
export class AssociateTagOptionWithResourceInput extends S.Class<AssociateTagOptionWithResourceInput>(
  "AssociateTagOptionWithResourceInput",
)(
  { ResourceId: S.String, TagOptionId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateTagOptionWithResourceOutput extends S.Class<AssociateTagOptionWithResourceOutput>(
  "AssociateTagOptionWithResourceOutput",
)({}) {}
export class ServiceActionAssociation extends S.Class<ServiceActionAssociation>(
  "ServiceActionAssociation",
)({
  ServiceActionId: S.String,
  ProductId: S.String,
  ProvisioningArtifactId: S.String,
}) {}
export const ServiceActionAssociations = S.Array(ServiceActionAssociation);
export class BatchDisassociateServiceActionFromProvisioningArtifactInput extends S.Class<BatchDisassociateServiceActionFromProvisioningArtifactInput>(
  "BatchDisassociateServiceActionFromProvisioningArtifactInput",
)(
  {
    ServiceActionAssociations: ServiceActionAssociations,
    AcceptLanguage: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateConstraintInput extends S.Class<CreateConstraintInput>(
  "CreateConstraintInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    ProductId: S.String,
    Parameters: S.String,
    Type: S.String,
    Description: S.optional(S.String),
    IdempotencyToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ProvisioningArtifactInfo = S.Record({
  key: S.String,
  value: S.String,
});
export class ProvisioningArtifactProperties extends S.Class<ProvisioningArtifactProperties>(
  "ProvisioningArtifactProperties",
)({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Info: S.optional(ProvisioningArtifactInfo),
  Type: S.optional(S.String),
  DisableTemplateValidation: S.optional(S.Boolean),
}) {}
export class CreateProvisioningArtifactInput extends S.Class<CreateProvisioningArtifactInput>(
  "CreateProvisioningArtifactInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    ProductId: S.String,
    Parameters: ProvisioningArtifactProperties,
    IdempotencyToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTagOptionInput extends S.Class<CreateTagOptionInput>(
  "CreateTagOptionInput",
)(
  { Key: S.String, Value: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteConstraintInput extends S.Class<DeleteConstraintInput>(
  "DeleteConstraintInput",
)(
  { AcceptLanguage: S.optional(S.String), Id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteConstraintOutput extends S.Class<DeleteConstraintOutput>(
  "DeleteConstraintOutput",
)({}) {}
export class DeletePortfolioInput extends S.Class<DeletePortfolioInput>(
  "DeletePortfolioInput",
)(
  { AcceptLanguage: S.optional(S.String), Id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePortfolioOutput extends S.Class<DeletePortfolioOutput>(
  "DeletePortfolioOutput",
)({}) {}
export class OrganizationNode extends S.Class<OrganizationNode>(
  "OrganizationNode",
)({ Type: S.optional(S.String), Value: S.optional(S.String) }) {}
export class DeletePortfolioShareInput extends S.Class<DeletePortfolioShareInput>(
  "DeletePortfolioShareInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    AccountId: S.optional(S.String),
    OrganizationNode: S.optional(OrganizationNode),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProductInput extends S.Class<DeleteProductInput>(
  "DeleteProductInput",
)(
  { AcceptLanguage: S.optional(S.String), Id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProductOutput extends S.Class<DeleteProductOutput>(
  "DeleteProductOutput",
)({}) {}
export class DeleteProvisionedProductPlanInput extends S.Class<DeleteProvisionedProductPlanInput>(
  "DeleteProvisionedProductPlanInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    PlanId: S.String,
    IgnoreErrors: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProvisionedProductPlanOutput extends S.Class<DeleteProvisionedProductPlanOutput>(
  "DeleteProvisionedProductPlanOutput",
)({}) {}
export class DeleteProvisioningArtifactInput extends S.Class<DeleteProvisioningArtifactInput>(
  "DeleteProvisioningArtifactInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    ProductId: S.String,
    ProvisioningArtifactId: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProvisioningArtifactOutput extends S.Class<DeleteProvisioningArtifactOutput>(
  "DeleteProvisioningArtifactOutput",
)({}) {}
export class DeleteServiceActionInput extends S.Class<DeleteServiceActionInput>(
  "DeleteServiceActionInput",
)(
  {
    Id: S.String,
    AcceptLanguage: S.optional(S.String),
    IdempotencyToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteServiceActionOutput extends S.Class<DeleteServiceActionOutput>(
  "DeleteServiceActionOutput",
)({}) {}
export class DeleteTagOptionInput extends S.Class<DeleteTagOptionInput>(
  "DeleteTagOptionInput",
)(
  { Id: S.String.pipe(T.HttpQuery("id")) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTagOptionOutput extends S.Class<DeleteTagOptionOutput>(
  "DeleteTagOptionOutput",
)({}) {}
export class DescribeConstraintInput extends S.Class<DescribeConstraintInput>(
  "DescribeConstraintInput",
)(
  { AcceptLanguage: S.optional(S.String), Id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeCopyProductStatusInput extends S.Class<DescribeCopyProductStatusInput>(
  "DescribeCopyProductStatusInput",
)(
  { AcceptLanguage: S.optional(S.String), CopyProductToken: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePortfolioInput extends S.Class<DescribePortfolioInput>(
  "DescribePortfolioInput",
)(
  { AcceptLanguage: S.optional(S.String), Id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePortfolioSharesInput extends S.Class<DescribePortfolioSharesInput>(
  "DescribePortfolioSharesInput",
)(
  {
    PortfolioId: S.String,
    Type: S.String,
    PageToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePortfolioShareStatusInput extends S.Class<DescribePortfolioShareStatusInput>(
  "DescribePortfolioShareStatusInput",
)(
  { PortfolioShareToken: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeProductInput extends S.Class<DescribeProductInput>(
  "DescribeProductInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeProductAsAdminInput extends S.Class<DescribeProductAsAdminInput>(
  "DescribeProductAsAdminInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    SourcePortfolioId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeProductViewInput extends S.Class<DescribeProductViewInput>(
  "DescribeProductViewInput",
)(
  { AcceptLanguage: S.optional(S.String), Id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeProvisionedProductInput extends S.Class<DescribeProvisionedProductInput>(
  "DescribeProvisionedProductInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeProvisionedProductPlanInput extends S.Class<DescribeProvisionedProductPlanInput>(
  "DescribeProvisionedProductPlanInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    PlanId: S.String,
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeProvisioningArtifactInput extends S.Class<DescribeProvisioningArtifactInput>(
  "DescribeProvisioningArtifactInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    ProvisioningArtifactId: S.optional(S.String),
    ProductId: S.optional(S.String),
    ProvisioningArtifactName: S.optional(S.String),
    ProductName: S.optional(S.String),
    Verbose: S.optional(S.Boolean),
    IncludeProvisioningArtifactParameters: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeProvisioningParametersInput extends S.Class<DescribeProvisioningParametersInput>(
  "DescribeProvisioningParametersInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    ProductId: S.optional(S.String),
    ProductName: S.optional(S.String),
    ProvisioningArtifactId: S.optional(S.String),
    ProvisioningArtifactName: S.optional(S.String),
    PathId: S.optional(S.String),
    PathName: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRecordInput extends S.Class<DescribeRecordInput>(
  "DescribeRecordInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    Id: S.String,
    PageToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeServiceActionInput extends S.Class<DescribeServiceActionInput>(
  "DescribeServiceActionInput",
)(
  { Id: S.String, AcceptLanguage: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeServiceActionExecutionParametersInput extends S.Class<DescribeServiceActionExecutionParametersInput>(
  "DescribeServiceActionExecutionParametersInput",
)(
  {
    ProvisionedProductId: S.String,
    ServiceActionId: S.String,
    AcceptLanguage: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTagOptionInput extends S.Class<DescribeTagOptionInput>(
  "DescribeTagOptionInput",
)(
  { Id: S.String.pipe(T.HttpQuery("id")) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateBudgetFromResourceInput extends S.Class<DisassociateBudgetFromResourceInput>(
  "DisassociateBudgetFromResourceInput",
)(
  { BudgetName: S.String, ResourceId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateBudgetFromResourceOutput extends S.Class<DisassociateBudgetFromResourceOutput>(
  "DisassociateBudgetFromResourceOutput",
)({}) {}
export class DisassociatePrincipalFromPortfolioInput extends S.Class<DisassociatePrincipalFromPortfolioInput>(
  "DisassociatePrincipalFromPortfolioInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    PrincipalARN: S.String,
    PrincipalType: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociatePrincipalFromPortfolioOutput extends S.Class<DisassociatePrincipalFromPortfolioOutput>(
  "DisassociatePrincipalFromPortfolioOutput",
)({}) {}
export class DisassociateProductFromPortfolioInput extends S.Class<DisassociateProductFromPortfolioInput>(
  "DisassociateProductFromPortfolioInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    ProductId: S.String,
    PortfolioId: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateProductFromPortfolioOutput extends S.Class<DisassociateProductFromPortfolioOutput>(
  "DisassociateProductFromPortfolioOutput",
)({}) {}
export class DisassociateServiceActionFromProvisioningArtifactInput extends S.Class<DisassociateServiceActionFromProvisioningArtifactInput>(
  "DisassociateServiceActionFromProvisioningArtifactInput",
)(
  {
    ProductId: S.String,
    ProvisioningArtifactId: S.String,
    ServiceActionId: S.String,
    AcceptLanguage: S.optional(S.String),
    IdempotencyToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateServiceActionFromProvisioningArtifactOutput extends S.Class<DisassociateServiceActionFromProvisioningArtifactOutput>(
  "DisassociateServiceActionFromProvisioningArtifactOutput",
)({}) {}
export class DisassociateTagOptionFromResourceInput extends S.Class<DisassociateTagOptionFromResourceInput>(
  "DisassociateTagOptionFromResourceInput",
)(
  {
    ResourceId: S.String.pipe(T.HttpQuery("resourceId")),
    TagOptionId: S.String.pipe(T.HttpQuery("tagOptionId")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateTagOptionFromResourceOutput extends S.Class<DisassociateTagOptionFromResourceOutput>(
  "DisassociateTagOptionFromResourceOutput",
)({}) {}
export class ExecuteProvisionedProductPlanInput extends S.Class<ExecuteProvisionedProductPlanInput>(
  "ExecuteProvisionedProductPlanInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    PlanId: S.String,
    IdempotencyToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAWSOrganizationsAccessStatusOutput extends S.Class<GetAWSOrganizationsAccessStatusOutput>(
  "GetAWSOrganizationsAccessStatusOutput",
)({ AccessStatus: S.optional(S.String) }) {}
export class GetProvisionedProductOutputsInput extends S.Class<GetProvisionedProductOutputsInput>(
  "GetProvisionedProductOutputsInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    ProvisionedProductId: S.optional(S.String),
    ProvisionedProductName: S.optional(S.String),
    OutputKeys: S.optional(OutputKeys),
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ImportAsProvisionedProductInput extends S.Class<ImportAsProvisionedProductInput>(
  "ImportAsProvisionedProductInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    ProductId: S.String,
    ProvisioningArtifactId: S.String,
    ProvisionedProductName: S.String,
    PhysicalId: S.String,
    IdempotencyToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAcceptedPortfolioSharesInput extends S.Class<ListAcceptedPortfolioSharesInput>(
  "ListAcceptedPortfolioSharesInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    PageToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
    PortfolioShareType: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListBudgetsForResourceInput extends S.Class<ListBudgetsForResourceInput>(
  "ListBudgetsForResourceInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    ResourceId: S.String,
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListConstraintsForPortfolioInput extends S.Class<ListConstraintsForPortfolioInput>(
  "ListConstraintsForPortfolioInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    ProductId: S.optional(S.String),
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLaunchPathsInput extends S.Class<ListLaunchPathsInput>(
  "ListLaunchPathsInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    ProductId: S.String,
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListOrganizationPortfolioAccessInput extends S.Class<ListOrganizationPortfolioAccessInput>(
  "ListOrganizationPortfolioAccessInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    OrganizationNodeType: S.String,
    PageToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPortfolioAccessInput extends S.Class<ListPortfolioAccessInput>(
  "ListPortfolioAccessInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    OrganizationParentId: S.optional(S.String),
    PageToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPortfoliosInput extends S.Class<ListPortfoliosInput>(
  "ListPortfoliosInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    PageToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPortfoliosForProductInput extends S.Class<ListPortfoliosForProductInput>(
  "ListPortfoliosForProductInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    ProductId: S.String,
    PageToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPrincipalsForPortfolioInput extends S.Class<ListPrincipalsForPortfolioInput>(
  "ListPrincipalsForPortfolioInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListProvisioningArtifactsInput extends S.Class<ListProvisioningArtifactsInput>(
  "ListProvisioningArtifactsInput",
)(
  { AcceptLanguage: S.optional(S.String), ProductId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListProvisioningArtifactsForServiceActionInput extends S.Class<ListProvisioningArtifactsForServiceActionInput>(
  "ListProvisioningArtifactsForServiceActionInput",
)(
  {
    ServiceActionId: S.String,
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
    AcceptLanguage: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListResourcesForTagOptionInput extends S.Class<ListResourcesForTagOptionInput>(
  "ListResourcesForTagOptionInput",
)(
  {
    TagOptionId: S.String.pipe(T.HttpQuery("tagOptionId")),
    ResourceType: S.optional(S.String).pipe(T.HttpQuery("resourceType")),
    PageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
    PageToken: S.optional(S.String).pipe(T.HttpQuery("pageToken")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListServiceActionsInput extends S.Class<ListServiceActionsInput>(
  "ListServiceActionsInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListServiceActionsForProvisioningArtifactInput extends S.Class<ListServiceActionsForProvisioningArtifactInput>(
  "ListServiceActionsForProvisioningArtifactInput",
)(
  {
    ProductId: S.String,
    ProvisioningArtifactId: S.String,
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
    AcceptLanguage: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStackInstancesForProvisionedProductInput extends S.Class<ListStackInstancesForProvisionedProductInput>(
  "ListStackInstancesForProvisionedProductInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    ProvisionedProductId: S.String,
    PageToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class NotifyTerminateProvisionedProductEngineWorkflowResultInput extends S.Class<NotifyTerminateProvisionedProductEngineWorkflowResultInput>(
  "NotifyTerminateProvisionedProductEngineWorkflowResultInput",
)(
  {
    WorkflowToken: S.String,
    RecordId: S.String,
    Status: S.String,
    FailureReason: S.optional(S.String),
    IdempotencyToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class NotifyTerminateProvisionedProductEngineWorkflowResultOutput extends S.Class<NotifyTerminateProvisionedProductEngineWorkflowResultOutput>(
  "NotifyTerminateProvisionedProductEngineWorkflowResultOutput",
)({}) {}
export class RecordOutput extends S.Class<RecordOutput>("RecordOutput")({
  OutputKey: S.optional(S.String),
  OutputValue: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export const RecordOutputs = S.Array(RecordOutput);
export class NotifyUpdateProvisionedProductEngineWorkflowResultInput extends S.Class<NotifyUpdateProvisionedProductEngineWorkflowResultInput>(
  "NotifyUpdateProvisionedProductEngineWorkflowResultInput",
)(
  {
    WorkflowToken: S.String,
    RecordId: S.String,
    Status: S.String,
    FailureReason: S.optional(S.String),
    Outputs: S.optional(RecordOutputs),
    IdempotencyToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class NotifyUpdateProvisionedProductEngineWorkflowResultOutput extends S.Class<NotifyUpdateProvisionedProductEngineWorkflowResultOutput>(
  "NotifyUpdateProvisionedProductEngineWorkflowResultOutput",
)({}) {}
export class RejectPortfolioShareInput extends S.Class<RejectPortfolioShareInput>(
  "RejectPortfolioShareInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    PortfolioShareType: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RejectPortfolioShareOutput extends S.Class<RejectPortfolioShareOutput>(
  "RejectPortfolioShareOutput",
)({}) {}
export class AccessLevelFilter extends S.Class<AccessLevelFilter>(
  "AccessLevelFilter",
)({ Key: S.optional(S.String), Value: S.optional(S.String) }) {}
export class ScanProvisionedProductsInput extends S.Class<ScanProvisionedProductsInput>(
  "ScanProvisionedProductsInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    AccessLevelFilter: S.optional(AccessLevelFilter),
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ProductViewFilterValues = S.Array(S.String);
export const ProductViewFilters = S.Record({
  key: S.String,
  value: ProductViewFilterValues,
});
export class SearchProductsAsAdminInput extends S.Class<SearchProductsAsAdminInput>(
  "SearchProductsAsAdminInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.optional(S.String),
    Filters: S.optional(ProductViewFilters),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    PageToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
    ProductSource: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TerminateProvisionedProductInput extends S.Class<TerminateProvisionedProductInput>(
  "TerminateProvisionedProductInput",
)(
  {
    ProvisionedProductName: S.optional(S.String),
    ProvisionedProductId: S.optional(S.String),
    TerminateToken: S.String,
    IgnoreErrors: S.optional(S.Boolean),
    AcceptLanguage: S.optional(S.String),
    RetainPhysicalResources: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateConstraintInput extends S.Class<UpdateConstraintInput>(
  "UpdateConstraintInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    Id: S.String,
    Description: S.optional(S.String),
    Parameters: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const AddTags = S.Array(Tag);
export class UpdatePortfolioInput extends S.Class<UpdatePortfolioInput>(
  "UpdatePortfolioInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    Id: S.String,
    DisplayName: S.optional(S.String),
    Description: S.optional(S.String),
    ProviderName: S.optional(S.String),
    AddTags: S.optional(AddTags),
    RemoveTags: S.optional(TagKeys),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdatePortfolioShareInput extends S.Class<UpdatePortfolioShareInput>(
  "UpdatePortfolioShareInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    AccountId: S.optional(S.String),
    OrganizationNode: S.optional(OrganizationNode),
    ShareTagOptions: S.optional(S.Boolean),
    SharePrincipals: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CodeStarParameters extends S.Class<CodeStarParameters>(
  "CodeStarParameters",
)({
  ConnectionArn: S.String,
  Repository: S.String,
  Branch: S.String,
  ArtifactPath: S.String,
}) {}
export class SourceConnectionParameters extends S.Class<SourceConnectionParameters>(
  "SourceConnectionParameters",
)({ CodeStar: S.optional(CodeStarParameters) }) {}
export class SourceConnection extends S.Class<SourceConnection>(
  "SourceConnection",
)({
  Type: S.optional(S.String),
  ConnectionParameters: SourceConnectionParameters,
}) {}
export class UpdateProductInput extends S.Class<UpdateProductInput>(
  "UpdateProductInput",
)(
  {
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
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateProvisioningArtifactInput extends S.Class<UpdateProvisioningArtifactInput>(
  "UpdateProvisioningArtifactInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    ProductId: S.String,
    ProvisioningArtifactId: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Active: S.optional(S.Boolean),
    Guidance: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ServiceActionDefinitionMap = S.Record({
  key: S.String,
  value: S.String,
});
export class UpdateServiceActionInput extends S.Class<UpdateServiceActionInput>(
  "UpdateServiceActionInput",
)(
  {
    Id: S.String,
    Name: S.optional(S.String),
    Definition: S.optional(ServiceActionDefinitionMap),
    Description: S.optional(S.String),
    AcceptLanguage: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateTagOptionInput extends S.Class<UpdateTagOptionInput>(
  "UpdateTagOptionInput",
)(
  { Id: S.String, Value: S.optional(S.String), Active: S.optional(S.Boolean) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ExecutionParameterValueList = S.Array(S.String);
export const StackSetAccounts = S.Array(S.String);
export const StackSetRegions = S.Array(S.String);
export const ProvisionedProductViewFilterValues = S.Array(S.String);
export const SourceProvisioningArtifactPropertiesMap = S.Record({
  key: S.String,
  value: S.String,
});
export const SourceProvisioningArtifactProperties = S.Array(
  SourceProvisioningArtifactPropertiesMap,
);
export class UpdateProvisioningParameter extends S.Class<UpdateProvisioningParameter>(
  "UpdateProvisioningParameter",
)({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
  UsePreviousValue: S.optional(S.Boolean),
}) {}
export const UpdateProvisioningParameters = S.Array(
  UpdateProvisioningParameter,
);
export class TagOptionDetail extends S.Class<TagOptionDetail>(
  "TagOptionDetail",
)({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
  Active: S.optional(S.Boolean),
  Id: S.optional(S.String),
  Owner: S.optional(S.String),
}) {}
export const TagOptionDetails = S.Array(TagOptionDetail);
export const ExecutionParameterMap = S.Record({
  key: S.String,
  value: ExecutionParameterValueList,
});
export class PortfolioDetail extends S.Class<PortfolioDetail>(
  "PortfolioDetail",
)({
  Id: S.optional(S.String),
  ARN: S.optional(S.String),
  DisplayName: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ProviderName: S.optional(S.String),
}) {}
export const PortfolioDetails = S.Array(PortfolioDetail);
export class ConstraintDetail extends S.Class<ConstraintDetail>(
  "ConstraintDetail",
)({
  ConstraintId: S.optional(S.String),
  Type: S.optional(S.String),
  Description: S.optional(S.String),
  Owner: S.optional(S.String),
  ProductId: S.optional(S.String),
  PortfolioId: S.optional(S.String),
}) {}
export const ConstraintDetails = S.Array(ConstraintDetail);
export const OrganizationNodes = S.Array(OrganizationNode);
export const AccountIds = S.Array(S.String);
export class ProvisioningArtifactDetail extends S.Class<ProvisioningArtifactDetail>(
  "ProvisioningArtifactDetail",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Type: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Active: S.optional(S.Boolean),
  Guidance: S.optional(S.String),
  SourceRevision: S.optional(S.String),
}) {}
export const ProvisioningArtifactDetails = S.Array(ProvisioningArtifactDetail);
export class ListRecordHistorySearchFilter extends S.Class<ListRecordHistorySearchFilter>(
  "ListRecordHistorySearchFilter",
)({ Key: S.optional(S.String), Value: S.optional(S.String) }) {}
export class ListTagOptionsFilters extends S.Class<ListTagOptionsFilters>(
  "ListTagOptionsFilters",
)({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
  Active: S.optional(S.Boolean),
}) {}
export class ProvisioningParameter extends S.Class<ProvisioningParameter>(
  "ProvisioningParameter",
)({ Key: S.optional(S.String), Value: S.optional(S.String) }) {}
export const ProvisioningParameters = S.Array(ProvisioningParameter);
export class ProvisioningPreferences extends S.Class<ProvisioningPreferences>(
  "ProvisioningPreferences",
)({
  StackSetAccounts: S.optional(StackSetAccounts),
  StackSetRegions: S.optional(StackSetRegions),
  StackSetFailureToleranceCount: S.optional(S.Number),
  StackSetFailureTolerancePercentage: S.optional(S.Number),
  StackSetMaxConcurrencyCount: S.optional(S.Number),
  StackSetMaxConcurrencyPercentage: S.optional(S.Number),
}) {}
export class ProvisionedProductDetail extends S.Class<ProvisionedProductDetail>(
  "ProvisionedProductDetail",
)({
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
  Type: S.optional(S.String),
  Id: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  IdempotencyToken: S.optional(S.String),
  LastRecordId: S.optional(S.String),
  LastProvisioningRecordId: S.optional(S.String),
  LastSuccessfulProvisioningRecordId: S.optional(S.String),
  ProductId: S.optional(S.String),
  ProvisioningArtifactId: S.optional(S.String),
  LaunchRoleArn: S.optional(S.String),
}) {}
export const ProvisionedProductDetails = S.Array(ProvisionedProductDetail);
export class ProductViewSummary extends S.Class<ProductViewSummary>(
  "ProductViewSummary",
)({
  Id: S.optional(S.String),
  ProductId: S.optional(S.String),
  Name: S.optional(S.String),
  Owner: S.optional(S.String),
  ShortDescription: S.optional(S.String),
  Type: S.optional(S.String),
  Distributor: S.optional(S.String),
  HasDefaultPath: S.optional(S.Boolean),
  SupportEmail: S.optional(S.String),
  SupportDescription: S.optional(S.String),
  SupportUrl: S.optional(S.String),
}) {}
export class LastSync extends S.Class<LastSync>("LastSync")({
  LastSyncTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastSyncStatus: S.optional(S.String),
  LastSyncStatusMessage: S.optional(S.String),
  LastSuccessfulSyncTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastSuccessfulSyncProvisioningArtifactId: S.optional(S.String),
}) {}
export class SourceConnectionDetail extends S.Class<SourceConnectionDetail>(
  "SourceConnectionDetail",
)({
  Type: S.optional(S.String),
  ConnectionParameters: S.optional(SourceConnectionParameters),
  LastSync: S.optional(LastSync),
}) {}
export class ProductViewDetail extends S.Class<ProductViewDetail>(
  "ProductViewDetail",
)({
  ProductViewSummary: S.optional(ProductViewSummary),
  Status: S.optional(S.String),
  ProductARN: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SourceConnection: S.optional(SourceConnectionDetail),
}) {}
export const ProductViewDetails = S.Array(ProductViewDetail);
export const ProvisionedProductFilters = S.Record({
  key: S.String,
  value: ProvisionedProductViewFilterValues,
});
export class UpdateProvisioningPreferences extends S.Class<UpdateProvisioningPreferences>(
  "UpdateProvisioningPreferences",
)({
  StackSetAccounts: S.optional(StackSetAccounts),
  StackSetRegions: S.optional(StackSetRegions),
  StackSetFailureToleranceCount: S.optional(S.Number),
  StackSetFailureTolerancePercentage: S.optional(S.Number),
  StackSetMaxConcurrencyCount: S.optional(S.Number),
  StackSetMaxConcurrencyPercentage: S.optional(S.Number),
  StackSetOperationType: S.optional(S.String),
}) {}
export const ProvisionedProductProperties = S.Record({
  key: S.String,
  value: S.String,
});
export class BatchAssociateServiceActionWithProvisioningArtifactInput extends S.Class<BatchAssociateServiceActionWithProvisioningArtifactInput>(
  "BatchAssociateServiceActionWithProvisioningArtifactInput",
)(
  {
    ServiceActionAssociations: ServiceActionAssociations,
    AcceptLanguage: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CopyProductInput extends S.Class<CopyProductInput>(
  "CopyProductInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    SourceProductArn: S.String,
    TargetProductId: S.optional(S.String),
    TargetProductName: S.optional(S.String),
    SourceProvisioningArtifactIdentifiers: S.optional(
      SourceProvisioningArtifactProperties,
    ),
    CopyOptions: S.optional(CopyOptions),
    IdempotencyToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePortfolioInput extends S.Class<CreatePortfolioInput>(
  "CreatePortfolioInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    DisplayName: S.String,
    Description: S.optional(S.String),
    ProviderName: S.String,
    Tags: S.optional(AddTags),
    IdempotencyToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePortfolioShareInput extends S.Class<CreatePortfolioShareInput>(
  "CreatePortfolioShareInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    PortfolioId: S.String,
    AccountId: S.optional(S.String),
    OrganizationNode: S.optional(OrganizationNode),
    ShareTagOptions: S.optional(S.Boolean),
    SharePrincipals: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateProvisionedProductPlanInput extends S.Class<CreateProvisionedProductPlanInput>(
  "CreateProvisionedProductPlanInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    PlanName: S.String,
    PlanType: S.String,
    NotificationArns: S.optional(NotificationArns),
    PathId: S.optional(S.String),
    ProductId: S.String,
    ProvisionedProductName: S.String,
    ProvisioningArtifactId: S.String,
    ProvisioningParameters: S.optional(UpdateProvisioningParameters),
    IdempotencyToken: S.String,
    Tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateServiceActionInput extends S.Class<CreateServiceActionInput>(
  "CreateServiceActionInput",
)(
  {
    Name: S.String,
    DefinitionType: S.String,
    Definition: ServiceActionDefinitionMap,
    Description: S.optional(S.String),
    AcceptLanguage: S.optional(S.String),
    IdempotencyToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePortfolioShareOutput extends S.Class<DeletePortfolioShareOutput>(
  "DeletePortfolioShareOutput",
)({ PortfolioShareToken: S.optional(S.String) }) {}
export class DescribeConstraintOutput extends S.Class<DescribeConstraintOutput>(
  "DescribeConstraintOutput",
)({
  ConstraintDetail: S.optional(ConstraintDetail),
  ConstraintParameters: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export class DescribeCopyProductStatusOutput extends S.Class<DescribeCopyProductStatusOutput>(
  "DescribeCopyProductStatusOutput",
)({
  CopyProductStatus: S.optional(S.String),
  TargetProductId: S.optional(S.String),
  StatusDetail: S.optional(S.String),
}) {}
export class ProvisioningArtifact extends S.Class<ProvisioningArtifact>(
  "ProvisioningArtifact",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Guidance: S.optional(S.String),
}) {}
export const ProvisioningArtifacts = S.Array(ProvisioningArtifact);
export class DescribeProductViewOutput extends S.Class<DescribeProductViewOutput>(
  "DescribeProductViewOutput",
)({
  ProductViewSummary: S.optional(ProductViewSummary),
  ProvisioningArtifacts: S.optional(ProvisioningArtifacts),
}) {}
export class DescribeTagOptionOutput extends S.Class<DescribeTagOptionOutput>(
  "DescribeTagOptionOutput",
)({ TagOptionDetail: S.optional(TagOptionDetail) }) {}
export class RecordError extends S.Class<RecordError>("RecordError")({
  Code: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export const RecordErrors = S.Array(RecordError);
export class RecordTag extends S.Class<RecordTag>("RecordTag")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const RecordTags = S.Array(RecordTag);
export class RecordDetail extends S.Class<RecordDetail>("RecordDetail")({
  RecordId: S.optional(S.String),
  ProvisionedProductName: S.optional(S.String),
  Status: S.optional(S.String),
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
}) {}
export class ExecuteProvisionedProductPlanOutput extends S.Class<ExecuteProvisionedProductPlanOutput>(
  "ExecuteProvisionedProductPlanOutput",
)({ RecordDetail: S.optional(RecordDetail) }) {}
export class ExecuteProvisionedProductServiceActionInput extends S.Class<ExecuteProvisionedProductServiceActionInput>(
  "ExecuteProvisionedProductServiceActionInput",
)(
  {
    ProvisionedProductId: S.String,
    ServiceActionId: S.String,
    ExecuteToken: S.String,
    AcceptLanguage: S.optional(S.String),
    Parameters: S.optional(ExecutionParameterMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetProvisionedProductOutputsOutput extends S.Class<GetProvisionedProductOutputsOutput>(
  "GetProvisionedProductOutputsOutput",
)({
  Outputs: S.optional(RecordOutputs),
  NextPageToken: S.optional(S.String),
}) {}
export class ImportAsProvisionedProductOutput extends S.Class<ImportAsProvisionedProductOutput>(
  "ImportAsProvisionedProductOutput",
)({ RecordDetail: S.optional(RecordDetail) }) {}
export class ListAcceptedPortfolioSharesOutput extends S.Class<ListAcceptedPortfolioSharesOutput>(
  "ListAcceptedPortfolioSharesOutput",
)({
  PortfolioDetails: S.optional(PortfolioDetails),
  NextPageToken: S.optional(S.String),
}) {}
export class BudgetDetail extends S.Class<BudgetDetail>("BudgetDetail")({
  BudgetName: S.optional(S.String),
}) {}
export const Budgets = S.Array(BudgetDetail);
export class ListBudgetsForResourceOutput extends S.Class<ListBudgetsForResourceOutput>(
  "ListBudgetsForResourceOutput",
)({ Budgets: S.optional(Budgets), NextPageToken: S.optional(S.String) }) {}
export class ListConstraintsForPortfolioOutput extends S.Class<ListConstraintsForPortfolioOutput>(
  "ListConstraintsForPortfolioOutput",
)({
  ConstraintDetails: S.optional(ConstraintDetails),
  NextPageToken: S.optional(S.String),
}) {}
export class ListOrganizationPortfolioAccessOutput extends S.Class<ListOrganizationPortfolioAccessOutput>(
  "ListOrganizationPortfolioAccessOutput",
)({
  OrganizationNodes: S.optional(OrganizationNodes),
  NextPageToken: S.optional(S.String),
}) {}
export class ListPortfolioAccessOutput extends S.Class<ListPortfolioAccessOutput>(
  "ListPortfolioAccessOutput",
)({
  AccountIds: S.optional(AccountIds),
  NextPageToken: S.optional(S.String),
}) {}
export class ListPortfoliosOutput extends S.Class<ListPortfoliosOutput>(
  "ListPortfoliosOutput",
)({
  PortfolioDetails: S.optional(PortfolioDetails),
  NextPageToken: S.optional(S.String),
}) {}
export class ListPortfoliosForProductOutput extends S.Class<ListPortfoliosForProductOutput>(
  "ListPortfoliosForProductOutput",
)({
  PortfolioDetails: S.optional(PortfolioDetails),
  NextPageToken: S.optional(S.String),
}) {}
export class ListProvisionedProductPlansInput extends S.Class<ListProvisionedProductPlansInput>(
  "ListProvisionedProductPlansInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    ProvisionProductId: S.optional(S.String),
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
    AccessLevelFilter: S.optional(AccessLevelFilter),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListProvisioningArtifactsOutput extends S.Class<ListProvisioningArtifactsOutput>(
  "ListProvisioningArtifactsOutput",
)({
  ProvisioningArtifactDetails: S.optional(ProvisioningArtifactDetails),
  NextPageToken: S.optional(S.String),
}) {}
export class ListRecordHistoryInput extends S.Class<ListRecordHistoryInput>(
  "ListRecordHistoryInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    AccessLevelFilter: S.optional(AccessLevelFilter),
    SearchFilter: S.optional(ListRecordHistorySearchFilter),
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ServiceActionSummary extends S.Class<ServiceActionSummary>(
  "ServiceActionSummary",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  DefinitionType: S.optional(S.String),
}) {}
export const ServiceActionSummaries = S.Array(ServiceActionSummary);
export class ListServiceActionsForProvisioningArtifactOutput extends S.Class<ListServiceActionsForProvisioningArtifactOutput>(
  "ListServiceActionsForProvisioningArtifactOutput",
)({
  ServiceActionSummaries: S.optional(ServiceActionSummaries),
  NextPageToken: S.optional(S.String),
}) {}
export class ListTagOptionsInput extends S.Class<ListTagOptionsInput>(
  "ListTagOptionsInput",
)(
  {
    Filters: S.optional(ListTagOptionsFilters),
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ProvisionProductInput extends S.Class<ProvisionProductInput>(
  "ProvisionProductInput",
)(
  {
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
    ProvisionToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ScanProvisionedProductsOutput extends S.Class<ScanProvisionedProductsOutput>(
  "ScanProvisionedProductsOutput",
)({
  ProvisionedProducts: S.optional(ProvisionedProductDetails),
  NextPageToken: S.optional(S.String),
}) {}
export class SearchProductsInput extends S.Class<SearchProductsInput>(
  "SearchProductsInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    Filters: S.optional(ProductViewFilters),
    PageSize: S.optional(S.Number),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    PageToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SearchProductsAsAdminOutput extends S.Class<SearchProductsAsAdminOutput>(
  "SearchProductsAsAdminOutput",
)({
  ProductViewDetails: S.optional(ProductViewDetails),
  NextPageToken: S.optional(S.String),
}) {}
export class SearchProvisionedProductsInput extends S.Class<SearchProvisionedProductsInput>(
  "SearchProvisionedProductsInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    AccessLevelFilter: S.optional(AccessLevelFilter),
    Filters: S.optional(ProvisionedProductFilters),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    PageSize: S.optional(S.Number),
    PageToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TerminateProvisionedProductOutput extends S.Class<TerminateProvisionedProductOutput>(
  "TerminateProvisionedProductOutput",
)({ RecordDetail: S.optional(RecordDetail) }) {}
export class UpdateConstraintOutput extends S.Class<UpdateConstraintOutput>(
  "UpdateConstraintOutput",
)({
  ConstraintDetail: S.optional(ConstraintDetail),
  ConstraintParameters: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export class UpdatePortfolioOutput extends S.Class<UpdatePortfolioOutput>(
  "UpdatePortfolioOutput",
)({ PortfolioDetail: S.optional(PortfolioDetail), Tags: S.optional(Tags) }) {}
export class UpdatePortfolioShareOutput extends S.Class<UpdatePortfolioShareOutput>(
  "UpdatePortfolioShareOutput",
)({
  PortfolioShareToken: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export class UpdateProductOutput extends S.Class<UpdateProductOutput>(
  "UpdateProductOutput",
)({
  ProductViewDetail: S.optional(ProductViewDetail),
  Tags: S.optional(Tags),
}) {}
export class UpdateProvisionedProductInput extends S.Class<UpdateProvisionedProductInput>(
  "UpdateProvisionedProductInput",
)(
  {
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
    UpdateToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateProvisionedProductPropertiesInput extends S.Class<UpdateProvisionedProductPropertiesInput>(
  "UpdateProvisionedProductPropertiesInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    ProvisionedProductId: S.String,
    ProvisionedProductProperties: ProvisionedProductProperties,
    IdempotencyToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateProvisioningArtifactOutput extends S.Class<UpdateProvisioningArtifactOutput>(
  "UpdateProvisioningArtifactOutput",
)({
  ProvisioningArtifactDetail: S.optional(ProvisioningArtifactDetail),
  Info: S.optional(ProvisioningArtifactInfo),
  Status: S.optional(S.String),
}) {}
export class ServiceActionDetail extends S.Class<ServiceActionDetail>(
  "ServiceActionDetail",
)({
  ServiceActionSummary: S.optional(ServiceActionSummary),
  Definition: S.optional(ServiceActionDefinitionMap),
}) {}
export class UpdateServiceActionOutput extends S.Class<UpdateServiceActionOutput>(
  "UpdateServiceActionOutput",
)({ ServiceActionDetail: S.optional(ServiceActionDetail) }) {}
export class UpdateTagOptionOutput extends S.Class<UpdateTagOptionOutput>(
  "UpdateTagOptionOutput",
)({ TagOptionDetail: S.optional(TagOptionDetail) }) {}
export const SuccessfulShares = S.Array(S.String);
export const Scope = S.Array(S.String);
export const TagOptionValues = S.Array(S.String);
export class UniqueTagResourceIdentifier extends S.Class<UniqueTagResourceIdentifier>(
  "UniqueTagResourceIdentifier",
)({ Key: S.optional(S.String), Value: S.optional(S.String) }) {}
export class FailedServiceActionAssociation extends S.Class<FailedServiceActionAssociation>(
  "FailedServiceActionAssociation",
)({
  ServiceActionId: S.optional(S.String),
  ProductId: S.optional(S.String),
  ProvisioningArtifactId: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const FailedServiceActionAssociations = S.Array(
  FailedServiceActionAssociation,
);
export class PortfolioShareDetail extends S.Class<PortfolioShareDetail>(
  "PortfolioShareDetail",
)({
  PrincipalId: S.optional(S.String),
  Type: S.optional(S.String),
  Accepted: S.optional(S.Boolean),
  ShareTagOptions: S.optional(S.Boolean),
  SharePrincipals: S.optional(S.Boolean),
}) {}
export const PortfolioShareDetails = S.Array(PortfolioShareDetail);
export class LaunchPath extends S.Class<LaunchPath>("LaunchPath")({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export const LaunchPaths = S.Array(LaunchPath);
export class ProvisioningArtifactSummary extends S.Class<ProvisioningArtifactSummary>(
  "ProvisioningArtifactSummary",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ProvisioningArtifactMetadata: S.optional(ProvisioningArtifactInfo),
}) {}
export const ProvisioningArtifactSummaries = S.Array(
  ProvisioningArtifactSummary,
);
export class CloudWatchDashboard extends S.Class<CloudWatchDashboard>(
  "CloudWatchDashboard",
)({ Name: S.optional(S.String) }) {}
export const CloudWatchDashboards = S.Array(CloudWatchDashboard);
export class ProvisionedProductPlanDetails extends S.Class<ProvisionedProductPlanDetails>(
  "ProvisionedProductPlanDetails",
)({
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  PathId: S.optional(S.String),
  ProductId: S.optional(S.String),
  PlanName: S.optional(S.String),
  PlanId: S.optional(S.String),
  ProvisionProductId: S.optional(S.String),
  ProvisionProductName: S.optional(S.String),
  PlanType: S.optional(S.String),
  ProvisioningArtifactId: S.optional(S.String),
  Status: S.optional(S.String),
  UpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  NotificationArns: S.optional(NotificationArns),
  ProvisioningParameters: S.optional(UpdateProvisioningParameters),
  Tags: S.optional(Tags),
  StatusMessage: S.optional(S.String),
}) {}
export class ConstraintSummary extends S.Class<ConstraintSummary>(
  "ConstraintSummary",
)({ Type: S.optional(S.String), Description: S.optional(S.String) }) {}
export const ConstraintSummaries = S.Array(ConstraintSummary);
export class UsageInstruction extends S.Class<UsageInstruction>(
  "UsageInstruction",
)({ Type: S.optional(S.String), Value: S.optional(S.String) }) {}
export const UsageInstructions = S.Array(UsageInstruction);
export class TagOptionSummary extends S.Class<TagOptionSummary>(
  "TagOptionSummary",
)({ Key: S.optional(S.String), Values: S.optional(TagOptionValues) }) {}
export const TagOptionSummaries = S.Array(TagOptionSummary);
export class ProvisioningArtifactPreferences extends S.Class<ProvisioningArtifactPreferences>(
  "ProvisioningArtifactPreferences",
)({
  StackSetAccounts: S.optional(StackSetAccounts),
  StackSetRegions: S.optional(StackSetRegions),
}) {}
export class ProvisioningArtifactOutput extends S.Class<ProvisioningArtifactOutput>(
  "ProvisioningArtifactOutput",
)({ Key: S.optional(S.String), Description: S.optional(S.String) }) {}
export const ProvisioningArtifactOutputs = S.Array(ProvisioningArtifactOutput);
export class ExecutionParameter extends S.Class<ExecutionParameter>(
  "ExecutionParameter",
)({
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  DefaultValues: S.optional(ExecutionParameterValueList),
}) {}
export const ExecutionParameters = S.Array(ExecutionParameter);
export class LaunchPathSummary extends S.Class<LaunchPathSummary>(
  "LaunchPathSummary",
)({
  Id: S.optional(S.String),
  ConstraintSummaries: S.optional(ConstraintSummaries),
  Tags: S.optional(Tags),
  Name: S.optional(S.String),
}) {}
export const LaunchPathSummaries = S.Array(LaunchPathSummary);
export class Principal extends S.Class<Principal>("Principal")({
  PrincipalARN: S.optional(S.String),
  PrincipalType: S.optional(S.String),
}) {}
export const Principals = S.Array(Principal);
export class ProvisioningArtifactView extends S.Class<ProvisioningArtifactView>(
  "ProvisioningArtifactView",
)({
  ProductViewSummary: S.optional(ProductViewSummary),
  ProvisioningArtifact: S.optional(ProvisioningArtifact),
}) {}
export const ProvisioningArtifactViews = S.Array(ProvisioningArtifactView);
export const RecordDetails = S.Array(RecordDetail);
export class ResourceDetail extends S.Class<ResourceDetail>("ResourceDetail")({
  Id: S.optional(S.String),
  ARN: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ResourceDetails = S.Array(ResourceDetail);
export class StackInstance extends S.Class<StackInstance>("StackInstance")({
  Account: S.optional(S.String),
  Region: S.optional(S.String),
  StackInstanceStatus: S.optional(S.String),
}) {}
export const StackInstances = S.Array(StackInstance);
export class EngineWorkflowResourceIdentifier extends S.Class<EngineWorkflowResourceIdentifier>(
  "EngineWorkflowResourceIdentifier",
)({ UniqueTag: S.optional(UniqueTagResourceIdentifier) }) {}
export const ProductViewSummaries = S.Array(ProductViewSummary);
export const Namespaces = S.Array(S.String);
export const AllowedValues = S.Array(S.String);
export class BatchAssociateServiceActionWithProvisioningArtifactOutput extends S.Class<BatchAssociateServiceActionWithProvisioningArtifactOutput>(
  "BatchAssociateServiceActionWithProvisioningArtifactOutput",
)({
  FailedServiceActionAssociations: S.optional(FailedServiceActionAssociations),
}) {}
export class BatchDisassociateServiceActionFromProvisioningArtifactOutput extends S.Class<BatchDisassociateServiceActionFromProvisioningArtifactOutput>(
  "BatchDisassociateServiceActionFromProvisioningArtifactOutput",
)({
  FailedServiceActionAssociations: S.optional(FailedServiceActionAssociations),
}) {}
export class CopyProductOutput extends S.Class<CopyProductOutput>(
  "CopyProductOutput",
)({ CopyProductToken: S.optional(S.String) }) {}
export class CreateConstraintOutput extends S.Class<CreateConstraintOutput>(
  "CreateConstraintOutput",
)({
  ConstraintDetail: S.optional(ConstraintDetail),
  ConstraintParameters: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export class CreatePortfolioOutput extends S.Class<CreatePortfolioOutput>(
  "CreatePortfolioOutput",
)({ PortfolioDetail: S.optional(PortfolioDetail), Tags: S.optional(Tags) }) {}
export class CreatePortfolioShareOutput extends S.Class<CreatePortfolioShareOutput>(
  "CreatePortfolioShareOutput",
)({ PortfolioShareToken: S.optional(S.String) }) {}
export class CreateProvisionedProductPlanOutput extends S.Class<CreateProvisionedProductPlanOutput>(
  "CreateProvisionedProductPlanOutput",
)({
  PlanName: S.optional(S.String),
  PlanId: S.optional(S.String),
  ProvisionProductId: S.optional(S.String),
  ProvisionedProductName: S.optional(S.String),
  ProvisioningArtifactId: S.optional(S.String),
}) {}
export class CreateProvisioningArtifactOutput extends S.Class<CreateProvisioningArtifactOutput>(
  "CreateProvisioningArtifactOutput",
)({
  ProvisioningArtifactDetail: S.optional(ProvisioningArtifactDetail),
  Info: S.optional(ProvisioningArtifactInfo),
  Status: S.optional(S.String),
}) {}
export class CreateServiceActionOutput extends S.Class<CreateServiceActionOutput>(
  "CreateServiceActionOutput",
)({ ServiceActionDetail: S.optional(ServiceActionDetail) }) {}
export class CreateTagOptionOutput extends S.Class<CreateTagOptionOutput>(
  "CreateTagOptionOutput",
)({ TagOptionDetail: S.optional(TagOptionDetail) }) {}
export class DescribePortfolioOutput extends S.Class<DescribePortfolioOutput>(
  "DescribePortfolioOutput",
)({
  PortfolioDetail: S.optional(PortfolioDetail),
  Tags: S.optional(Tags),
  TagOptions: S.optional(TagOptionDetails),
  Budgets: S.optional(Budgets),
}) {}
export class DescribePortfolioSharesOutput extends S.Class<DescribePortfolioSharesOutput>(
  "DescribePortfolioSharesOutput",
)({
  NextPageToken: S.optional(S.String),
  PortfolioShareDetails: S.optional(PortfolioShareDetails),
}) {}
export class DescribeProductOutput extends S.Class<DescribeProductOutput>(
  "DescribeProductOutput",
)({
  ProductViewSummary: S.optional(ProductViewSummary),
  ProvisioningArtifacts: S.optional(ProvisioningArtifacts),
  Budgets: S.optional(Budgets),
  LaunchPaths: S.optional(LaunchPaths),
}) {}
export class DescribeProvisionedProductOutput extends S.Class<DescribeProvisionedProductOutput>(
  "DescribeProvisionedProductOutput",
)({
  ProvisionedProductDetail: S.optional(ProvisionedProductDetail),
  CloudWatchDashboards: S.optional(CloudWatchDashboards),
}) {}
export class ParameterConstraints extends S.Class<ParameterConstraints>(
  "ParameterConstraints",
)({
  AllowedValues: S.optional(AllowedValues),
  AllowedPattern: S.optional(S.String),
  ConstraintDescription: S.optional(S.String),
  MaxLength: S.optional(S.String),
  MinLength: S.optional(S.String),
  MaxValue: S.optional(S.String),
  MinValue: S.optional(S.String),
}) {}
export class ProvisioningArtifactParameter extends S.Class<ProvisioningArtifactParameter>(
  "ProvisioningArtifactParameter",
)({
  ParameterKey: S.optional(S.String),
  DefaultValue: S.optional(S.String),
  ParameterType: S.optional(S.String),
  IsNoEcho: S.optional(S.Boolean),
  Description: S.optional(S.String),
  ParameterConstraints: S.optional(ParameterConstraints),
}) {}
export const ProvisioningArtifactParameters = S.Array(
  ProvisioningArtifactParameter,
);
export class DescribeProvisioningParametersOutput extends S.Class<DescribeProvisioningParametersOutput>(
  "DescribeProvisioningParametersOutput",
)({
  ProvisioningArtifactParameters: S.optional(ProvisioningArtifactParameters),
  ConstraintSummaries: S.optional(ConstraintSummaries),
  UsageInstructions: S.optional(UsageInstructions),
  TagOptions: S.optional(TagOptionSummaries),
  ProvisioningArtifactPreferences: S.optional(ProvisioningArtifactPreferences),
  ProvisioningArtifactOutputs: S.optional(ProvisioningArtifactOutputs),
  ProvisioningArtifactOutputKeys: S.optional(ProvisioningArtifactOutputs),
}) {}
export class DescribeServiceActionOutput extends S.Class<DescribeServiceActionOutput>(
  "DescribeServiceActionOutput",
)({ ServiceActionDetail: S.optional(ServiceActionDetail) }) {}
export class DescribeServiceActionExecutionParametersOutput extends S.Class<DescribeServiceActionExecutionParametersOutput>(
  "DescribeServiceActionExecutionParametersOutput",
)({ ServiceActionParameters: S.optional(ExecutionParameters) }) {}
export class ExecuteProvisionedProductServiceActionOutput extends S.Class<ExecuteProvisionedProductServiceActionOutput>(
  "ExecuteProvisionedProductServiceActionOutput",
)({ RecordDetail: S.optional(RecordDetail) }) {}
export class ListLaunchPathsOutput extends S.Class<ListLaunchPathsOutput>(
  "ListLaunchPathsOutput",
)({
  LaunchPathSummaries: S.optional(LaunchPathSummaries),
  NextPageToken: S.optional(S.String),
}) {}
export class ListPrincipalsForPortfolioOutput extends S.Class<ListPrincipalsForPortfolioOutput>(
  "ListPrincipalsForPortfolioOutput",
)({
  Principals: S.optional(Principals),
  NextPageToken: S.optional(S.String),
}) {}
export class ListProvisioningArtifactsForServiceActionOutput extends S.Class<ListProvisioningArtifactsForServiceActionOutput>(
  "ListProvisioningArtifactsForServiceActionOutput",
)({
  ProvisioningArtifactViews: S.optional(ProvisioningArtifactViews),
  NextPageToken: S.optional(S.String),
}) {}
export class ListRecordHistoryOutput extends S.Class<ListRecordHistoryOutput>(
  "ListRecordHistoryOutput",
)({
  RecordDetails: S.optional(RecordDetails),
  NextPageToken: S.optional(S.String),
}) {}
export class ListResourcesForTagOptionOutput extends S.Class<ListResourcesForTagOptionOutput>(
  "ListResourcesForTagOptionOutput",
)({
  ResourceDetails: S.optional(ResourceDetails),
  PageToken: S.optional(S.String),
}) {}
export class ListServiceActionsOutput extends S.Class<ListServiceActionsOutput>(
  "ListServiceActionsOutput",
)({
  ServiceActionSummaries: S.optional(ServiceActionSummaries),
  NextPageToken: S.optional(S.String),
}) {}
export class ListStackInstancesForProvisionedProductOutput extends S.Class<ListStackInstancesForProvisionedProductOutput>(
  "ListStackInstancesForProvisionedProductOutput",
)({
  StackInstances: S.optional(StackInstances),
  NextPageToken: S.optional(S.String),
}) {}
export class ListTagOptionsOutput extends S.Class<ListTagOptionsOutput>(
  "ListTagOptionsOutput",
)({
  TagOptionDetails: S.optional(TagOptionDetails),
  PageToken: S.optional(S.String),
}) {}
export class NotifyProvisionProductEngineWorkflowResultInput extends S.Class<NotifyProvisionProductEngineWorkflowResultInput>(
  "NotifyProvisionProductEngineWorkflowResultInput",
)(
  {
    WorkflowToken: S.String,
    RecordId: S.String,
    Status: S.String,
    FailureReason: S.optional(S.String),
    ResourceIdentifier: S.optional(EngineWorkflowResourceIdentifier),
    Outputs: S.optional(RecordOutputs),
    IdempotencyToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class NotifyProvisionProductEngineWorkflowResultOutput extends S.Class<NotifyProvisionProductEngineWorkflowResultOutput>(
  "NotifyProvisionProductEngineWorkflowResultOutput",
)({}) {}
export class ProvisionProductOutput extends S.Class<ProvisionProductOutput>(
  "ProvisionProductOutput",
)({ RecordDetail: S.optional(RecordDetail) }) {}
export class UpdateProvisionedProductOutput extends S.Class<UpdateProvisionedProductOutput>(
  "UpdateProvisionedProductOutput",
)({ RecordDetail: S.optional(RecordDetail) }) {}
export class UpdateProvisionedProductPropertiesOutput extends S.Class<UpdateProvisionedProductPropertiesOutput>(
  "UpdateProvisionedProductPropertiesOutput",
)({
  ProvisionedProductId: S.optional(S.String),
  ProvisionedProductProperties: S.optional(ProvisionedProductProperties),
  RecordId: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export class ShareError extends S.Class<ShareError>("ShareError")({
  Accounts: S.optional(Namespaces),
  Message: S.optional(S.String),
  Error: S.optional(S.String),
}) {}
export const ShareErrors = S.Array(ShareError);
export class ShareDetails extends S.Class<ShareDetails>("ShareDetails")({
  SuccessfulShares: S.optional(SuccessfulShares),
  ShareErrors: S.optional(ShareErrors),
}) {}
export class ProvisionedProductPlanSummary extends S.Class<ProvisionedProductPlanSummary>(
  "ProvisionedProductPlanSummary",
)({
  PlanName: S.optional(S.String),
  PlanId: S.optional(S.String),
  ProvisionProductId: S.optional(S.String),
  ProvisionProductName: S.optional(S.String),
  PlanType: S.optional(S.String),
  ProvisioningArtifactId: S.optional(S.String),
}) {}
export const ProvisionedProductPlans = S.Array(ProvisionedProductPlanSummary);
export class ProvisionedProductAttribute extends S.Class<ProvisionedProductAttribute>(
  "ProvisionedProductAttribute",
)({
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
  Type: S.optional(S.String),
  Id: S.optional(S.String),
  Status: S.optional(S.String),
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
}) {}
export const ProvisionedProductAttributes = S.Array(
  ProvisionedProductAttribute,
);
export class ResourceTargetDefinition extends S.Class<ResourceTargetDefinition>(
  "ResourceTargetDefinition",
)({
  Attribute: S.optional(S.String),
  Name: S.optional(S.String),
  RequiresRecreation: S.optional(S.String),
}) {}
export class CreateProductInput extends S.Class<CreateProductInput>(
  "CreateProductInput",
)(
  {
    AcceptLanguage: S.optional(S.String),
    Name: S.String,
    Owner: S.String,
    Description: S.optional(S.String),
    Distributor: S.optional(S.String),
    SupportDescription: S.optional(S.String),
    SupportEmail: S.optional(S.String),
    SupportUrl: S.optional(S.String),
    ProductType: S.String,
    Tags: S.optional(AddTags),
    ProvisioningArtifactParameters: S.optional(ProvisioningArtifactProperties),
    IdempotencyToken: S.String,
    SourceConnection: S.optional(SourceConnection),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePortfolioShareStatusOutput extends S.Class<DescribePortfolioShareStatusOutput>(
  "DescribePortfolioShareStatusOutput",
)({
  PortfolioShareToken: S.optional(S.String),
  PortfolioId: S.optional(S.String),
  OrganizationNodeValue: S.optional(S.String),
  Status: S.optional(S.String),
  ShareDetails: S.optional(ShareDetails),
}) {}
export class DescribeProvisioningArtifactOutput extends S.Class<DescribeProvisioningArtifactOutput>(
  "DescribeProvisioningArtifactOutput",
)({
  ProvisioningArtifactDetail: S.optional(ProvisioningArtifactDetail),
  Info: S.optional(ProvisioningArtifactInfo),
  Status: S.optional(S.String),
  ProvisioningArtifactParameters: S.optional(ProvisioningArtifactParameters),
}) {}
export class DescribeRecordOutput extends S.Class<DescribeRecordOutput>(
  "DescribeRecordOutput",
)({
  RecordDetail: S.optional(RecordDetail),
  RecordOutputs: S.optional(RecordOutputs),
  NextPageToken: S.optional(S.String),
}) {}
export class ListProvisionedProductPlansOutput extends S.Class<ListProvisionedProductPlansOutput>(
  "ListProvisionedProductPlansOutput",
)({
  ProvisionedProductPlans: S.optional(ProvisionedProductPlans),
  NextPageToken: S.optional(S.String),
}) {}
export class SearchProvisionedProductsOutput extends S.Class<SearchProvisionedProductsOutput>(
  "SearchProvisionedProductsOutput",
)({
  ProvisionedProducts: S.optional(ProvisionedProductAttributes),
  TotalResultsCount: S.optional(S.Number),
  NextPageToken: S.optional(S.String),
}) {}
export class ResourceChangeDetail extends S.Class<ResourceChangeDetail>(
  "ResourceChangeDetail",
)({
  Target: S.optional(ResourceTargetDefinition),
  Evaluation: S.optional(S.String),
  CausingEntity: S.optional(S.String),
}) {}
export const ResourceChangeDetails = S.Array(ResourceChangeDetail);
export class ProductViewAggregationValue extends S.Class<ProductViewAggregationValue>(
  "ProductViewAggregationValue",
)({ Value: S.optional(S.String), ApproximateCount: S.optional(S.Number) }) {}
export const ProductViewAggregationValues = S.Array(
  ProductViewAggregationValue,
);
export class ResourceChange extends S.Class<ResourceChange>("ResourceChange")({
  Action: S.optional(S.String),
  LogicalResourceId: S.optional(S.String),
  PhysicalResourceId: S.optional(S.String),
  ResourceType: S.optional(S.String),
  Replacement: S.optional(S.String),
  Scope: S.optional(Scope),
  Details: S.optional(ResourceChangeDetails),
}) {}
export const ResourceChanges = S.Array(ResourceChange);
export const ProductViewAggregations = S.Record({
  key: S.String,
  value: ProductViewAggregationValues,
});
export class CreateProductOutput extends S.Class<CreateProductOutput>(
  "CreateProductOutput",
)({
  ProductViewDetail: S.optional(ProductViewDetail),
  ProvisioningArtifactDetail: S.optional(ProvisioningArtifactDetail),
  Tags: S.optional(Tags),
}) {}
export class DescribeProductAsAdminOutput extends S.Class<DescribeProductAsAdminOutput>(
  "DescribeProductAsAdminOutput",
)({
  ProductViewDetail: S.optional(ProductViewDetail),
  ProvisioningArtifactSummaries: S.optional(ProvisioningArtifactSummaries),
  Tags: S.optional(Tags),
  TagOptions: S.optional(TagOptionDetails),
  Budgets: S.optional(Budgets),
}) {}
export class DescribeProvisionedProductPlanOutput extends S.Class<DescribeProvisionedProductPlanOutput>(
  "DescribeProvisionedProductPlanOutput",
)({
  ProvisionedProductPlanDetails: S.optional(ProvisionedProductPlanDetails),
  ResourceChanges: S.optional(ResourceChanges),
  NextPageToken: S.optional(S.String),
}) {}
export class SearchProductsOutput extends S.Class<SearchProductsOutput>(
  "SearchProductsOutput",
)({
  ProductViewSummaries: S.optional(ProductViewSummaries),
  ProductViewAggregations: S.optional(ProductViewAggregations),
  NextPageToken: S.optional(S.String),
}) {}

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
export const disassociateBudgetFromResource =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateBudgetFromResourceInput,
    output: DisassociateBudgetFromResourceOutput,
    errors: [ResourceNotFoundException],
  }));
/**
 * Provisions or modifies a product based on the resource changes for the specified plan.
 */
export const executeProvisionedProductPlan =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getProvisionedProductOutputs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const importAsProvisionedProduct = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ImportAsProvisionedProductInput,
    output: ImportAsProvisionedProductOutput,
    errors: [
      DuplicateResourceException,
      InvalidParametersException,
      InvalidStateException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Lists all imported portfolios for which account-to-account shares were accepted by
 * this account. By specifying the `PortfolioShareType`, you can list portfolios for which
 * organizational shares were accepted by this account.
 */
export const listAcceptedPortfolioShares =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listBudgetsForResource =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listConstraintsForPortfolio =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listOrganizationPortfolioAccess =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listPortfolioAccess =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listPortfolios = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPortfoliosInput,
    output: ListPortfoliosOutput,
    errors: [InvalidParametersException],
    pagination: {
      inputToken: "PageToken",
      outputToken: "NextPageToken",
      pageSize: "PageSize",
    } as const,
  }),
);
/**
 * Lists all portfolios that the specified product is associated with.
 */
export const listPortfoliosForProduct =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listProvisioningArtifacts = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListProvisioningArtifactsInput,
    output: ListProvisioningArtifactsOutput,
    errors: [InvalidParametersException, ResourceNotFoundException],
  }),
);
/**
 * Returns a paginated list of self-service actions associated with the specified Product ID and Provisioning Artifact ID.
 */
export const listServiceActionsForProvisioningArtifact =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const scanProvisionedProducts = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ScanProvisionedProductsInput,
    output: ScanProvisionedProductsOutput,
    errors: [InvalidParametersException],
  }),
);
/**
 * Gets information about the products for the specified portfolio or all products.
 */
export const searchProductsAsAdmin =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const terminateProvisionedProduct = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: TerminateProvisionedProductInput,
    output: TerminateProvisionedProductOutput,
    errors: [ResourceNotFoundException],
  }),
);
/**
 * Updates the specified constraint.
 */
export const updateConstraint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePortfolioShare = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdatePortfolioShareInput,
    output: UpdatePortfolioShareOutput,
    errors: [
      InvalidParametersException,
      InvalidStateException,
      OperationNotSupportedException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Updates the specified provisioning artifact (also known as a version) for the specified product.
 *
 * You cannot update a provisioning artifact for a product that was shared with you.
 */
export const updateProvisioningArtifact = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateProvisioningArtifactInput,
    output: UpdateProvisioningArtifactOutput,
    errors: [InvalidParametersException, ResourceNotFoundException],
  }),
);
/**
 * Updates a self-service action.
 */
export const updateServiceAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServiceActionInput,
  output: UpdateServiceActionOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Deletes the specified constraint.
 *
 * A delegated admin is authorized to invoke this command.
 */
export const deleteConstraint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConstraintInput,
  output: DeleteConstraintOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Deletes the specified plan.
 */
export const deleteProvisionedProductPlan =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteProvisioningArtifact = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteProvisioningArtifactInput,
    output: DeleteProvisioningArtifactOutput,
    errors: [
      InvalidParametersException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Deletes a self-service action.
 */
export const deleteServiceAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociatePrincipalFromPortfolio =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociatePrincipalFromPortfolioInput,
    output: DisassociatePrincipalFromPortfolioOutput,
    errors: [InvalidParametersException, ResourceNotFoundException],
  }));
/**
 * Disassociates the specified product from the specified portfolio.
 *
 * A delegated admin is authorized to invoke this command.
 */
export const disassociateProductFromPortfolio =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateServiceActionFromProvisioningArtifact =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateServiceActionFromProvisioningArtifactInput,
    output: DisassociateServiceActionFromProvisioningArtifactOutput,
    errors: [InvalidParametersException, ResourceNotFoundException],
  }));
/**
 * Notifies the result
 * of the terminate engine execution.
 */
export const notifyTerminateProvisionedProductEngineWorkflowResult =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: NotifyTerminateProvisionedProductEngineWorkflowResultInput,
    output: NotifyTerminateProvisionedProductEngineWorkflowResultOutput,
    errors: [InvalidParametersException, ResourceNotFoundException],
  }));
/**
 * Notifies the result
 * of the update engine execution.
 */
export const notifyUpdateProvisionedProductEngineWorkflowResult =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: NotifyUpdateProvisionedProductEngineWorkflowResultInput,
    output: NotifyUpdateProvisionedProductEngineWorkflowResultOutput,
    errors: [InvalidParametersException, ResourceNotFoundException],
  }));
/**
 * Get the Access Status for Organizations portfolio share feature. This API can only be
 * called by the management account in the organization or by a delegated admin.
 */
export const getAWSOrganizationsAccessStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const enableAWSOrganizationsAccess =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deletePortfolioShare = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeletePortfolioShareInput,
    output: DeletePortfolioShareOutput,
    errors: [
      InvalidParametersException,
      InvalidStateException,
      OperationNotSupportedException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Rejects an offer to share the specified portfolio.
 */
export const rejectPortfolioShare = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RejectPortfolioShareInput,
    output: RejectPortfolioShareOutput,
    errors: [ResourceNotFoundException],
  }),
);
/**
 * Gets information about the specified constraint.
 */
export const describeConstraint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConstraintInput,
  output: DescribeConstraintOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Gets the status of the specified copy product operation.
 */
export const describeCopyProductStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeCopyProductStatusInput,
    output: DescribeCopyProductStatusOutput,
    errors: [ResourceNotFoundException],
  }),
);
/**
 * Gets information about the specified product.
 */
export const describeProductView = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disableAWSOrganizationsAccess =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const acceptPortfolioShare = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AcceptPortfolioShareInput,
    output: AcceptPortfolioShareOutput,
    errors: [
      InvalidParametersException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Associates multiple self-service actions with provisioning artifacts.
 */
export const batchAssociateServiceActionWithProvisioningArtifact =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchAssociateServiceActionWithProvisioningArtifactInput,
    output: BatchAssociateServiceActionWithProvisioningArtifactOutput,
    errors: [InvalidParametersException],
  }));
/**
 * Disassociates a batch of self-service actions from the specified provisioning artifact.
 */
export const batchDisassociateServiceActionFromProvisioningArtifact =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const copyProduct = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopyProductInput,
  output: CopyProductOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Creates a constraint.
 *
 * A delegated admin is authorized to invoke this command.
 */
export const createConstraint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPortfolioShare = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreatePortfolioShareInput,
    output: CreatePortfolioShareOutput,
    errors: [
      InvalidParametersException,
      InvalidStateException,
      LimitExceededException,
      OperationNotSupportedException,
      ResourceNotFoundException,
    ],
  }),
);
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
export const createProvisionedProductPlan =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createProvisioningArtifact = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateProvisioningArtifactInput,
    output: CreateProvisioningArtifactOutput,
    errors: [
      InvalidParametersException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Creates a self-service action.
 */
export const createServiceAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateServiceActionInput,
  output: CreateServiceActionOutput,
  errors: [InvalidParametersException, LimitExceededException],
}));
/**
 * Gets information about the specified portfolio.
 *
 * A delegated admin is authorized to invoke this command.
 */
export const describePortfolio = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describePortfolioShares =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeProduct = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProductInput,
  output: DescribeProductOutput,
  errors: [InvalidParametersException, ResourceNotFoundException],
}));
/**
 * Gets information about the specified provisioned product.
 */
export const describeProvisionedProduct = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeProvisionedProductInput,
    output: DescribeProvisionedProductOutput,
    errors: [InvalidParametersException, ResourceNotFoundException],
  }),
);
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
export const describeProvisioningParameters =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeProvisioningParametersInput,
    output: DescribeProvisioningParametersOutput,
    errors: [InvalidParametersException, ResourceNotFoundException],
  }));
/**
 * Describes a self-service action.
 */
export const describeServiceAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeServiceActionInput,
    output: DescribeServiceActionOutput,
    errors: [ResourceNotFoundException],
  }),
);
/**
 * Finds the default parameters for a specific self-service action on a specific provisioned product and returns a map of the results to the user.
 */
export const describeServiceActionExecutionParameters =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeServiceActionExecutionParametersInput,
    output: DescribeServiceActionExecutionParametersOutput,
    errors: [InvalidParametersException, ResourceNotFoundException],
  }));
/**
 * Executes a self-service action against a provisioned product.
 */
export const executeProvisionedProductServiceAction =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listLaunchPaths = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListLaunchPathsInput,
    output: ListLaunchPathsOutput,
    errors: [InvalidParametersException, ResourceNotFoundException],
    pagination: {
      inputToken: "PageToken",
      outputToken: "NextPageToken",
      pageSize: "PageSize",
    } as const,
  }),
);
/**
 * Lists all `PrincipalARN`s and corresponding `PrincipalType`s associated with the specified portfolio.
 */
export const listPrincipalsForPortfolio =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listProvisioningArtifactsForServiceAction =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listRecordHistory = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRecordHistoryInput,
  output: ListRecordHistoryOutput,
  errors: [InvalidParametersException],
}));
/**
 * Lists all self-service actions.
 */
export const listServiceActions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListServiceActionsInput,
    output: ListServiceActionsOutput,
    errors: [InvalidParametersException],
    pagination: {
      inputToken: "PageToken",
      outputToken: "NextPageToken",
      pageSize: "PageSize",
    } as const,
  }),
);
/**
 * Returns summary information about stack instances that are associated with the specified `CFN_STACKSET` type provisioned product. You can filter for stack instances that are associated with a specific Amazon Web Services account name or Region.
 */
export const listStackInstancesForProvisionedProduct =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListStackInstancesForProvisionedProductInput,
    output: ListStackInstancesForProvisionedProductOutput,
    errors: [InvalidParametersException, ResourceNotFoundException],
  }));
/**
 * Notifies the result
 * of the provisioning engine execution.
 */
export const notifyProvisionProductEngineWorkflowResult =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const provisionProduct = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateProduct = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateProvisionedProduct = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateProvisionedProductInput,
    output: UpdateProvisionedProductOutput,
    errors: [InvalidParametersException, ResourceNotFoundException],
  }),
);
/**
 * Requests updates to the properties of the specified provisioned product.
 */
export const updateProvisionedProductProperties =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateBudgetWithResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateBudgetWithResourceInput,
    output: AssociateBudgetWithResourceOutput,
    errors: [
      DuplicateResourceException,
      InvalidParametersException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Updates the specified portfolio.
 *
 * You cannot update a product that was shared with you.
 */
export const updatePortfolio = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associatePrincipalWithPortfolio =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateProductWithPortfolio =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateServiceActionWithProvisioningArtifact =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateTagOptionWithResource =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateTagOption = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deletePortfolio = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteProduct = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateTagOptionFromResource =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateTagOptionFromResourceInput,
    output: DisassociateTagOptionFromResourceOutput,
    errors: [ResourceNotFoundException, TagOptionNotMigratedException],
  }));
/**
 * Deletes the specified TagOption.
 *
 * You cannot delete a TagOption if it is associated with a product or portfolio.
 */
export const deleteTagOption = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeTagOption = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTagOptionInput,
  output: DescribeTagOptionOutput,
  errors: [ResourceNotFoundException, TagOptionNotMigratedException],
}));
/**
 * Creates a portfolio.
 *
 * A delegated admin is authorized to invoke this command.
 */
export const createPortfolio = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createTagOption = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listResourcesForTagOption =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listTagOptions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListTagOptionsInput,
    output: ListTagOptionsOutput,
    errors: [InvalidParametersException, TagOptionNotMigratedException],
    pagination: {
      inputToken: "PageToken",
      outputToken: "PageToken",
      pageSize: "PageSize",
    } as const,
  }),
);
/**
 * Gets the status of the specified portfolio share operation. This API can only be called
 * by the management account in the organization or by a delegated admin.
 */
export const describePortfolioShareStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeProvisioningArtifact =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeRecord = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRecordInput,
  output: DescribeRecordOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Lists the plans for the specified provisioned product or all plans to which the user has access.
 */
export const listProvisionedProductPlans = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListProvisionedProductPlansInput,
    output: ListProvisionedProductPlansOutput,
    errors: [InvalidParametersException, ResourceNotFoundException],
  }),
);
/**
 * Gets information about the provisioned products that meet the specified criteria.
 */
export const searchProvisionedProducts =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createProduct = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeProductAsAdmin = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeProductAsAdminInput,
    output: DescribeProductAsAdminOutput,
    errors: [InvalidParametersException, ResourceNotFoundException],
  }),
);
/**
 * Gets information about the resource changes for the specified plan.
 */
export const describeProvisionedProductPlan =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeProvisionedProductPlanInput,
    output: DescribeProvisionedProductPlanOutput,
    errors: [InvalidParametersException, ResourceNotFoundException],
  }));
/**
 * Gets information about the products to which the caller has access.
 */
export const searchProducts = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: SearchProductsInput,
    output: SearchProductsOutput,
    errors: [InvalidParametersException],
    pagination: {
      inputToken: "PageToken",
      outputToken: "NextPageToken",
      pageSize: "PageSize",
    } as const,
  }),
);
