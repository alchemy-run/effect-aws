import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://cloudsearch.amazonaws.com/doc/2013-01-01/");
const svc = T.AwsApiService({
  sdkId: "CloudSearch",
  serviceShapeName: "A9SearchCloudConfigService2013",
});
const auth = T.AwsAuthSigv4({ name: "cloudsearch" });
const ver = T.ServiceVersion("2013-01-01");
const proto = T.AwsProtocolsAwsQuery();
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
                        url: "https://cloudsearch-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://cloudsearch-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://cloudsearch.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://cloudsearch.{Region}.{PartitionResult#dnsSuffix}",
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
export class ListDomainNamesRequest extends S.Class<ListDomainNamesRequest>(
  "ListDomainNamesRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const StandardNameList = S.Array(S.String);
export const DomainNameList = S.Array(S.String);
export const DynamicFieldNameList = S.Array(S.String);
export class BuildSuggestersRequest extends S.Class<BuildSuggestersRequest>(
  "BuildSuggestersRequest",
)(
  { DomainName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDomainRequest extends S.Class<CreateDomainRequest>(
  "CreateDomainRequest",
)(
  { DomainName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAnalysisSchemeRequest extends S.Class<DeleteAnalysisSchemeRequest>(
  "DeleteAnalysisSchemeRequest",
)(
  { DomainName: S.String, AnalysisSchemeName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDomainRequest extends S.Class<DeleteDomainRequest>(
  "DeleteDomainRequest",
)(
  { DomainName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteExpressionRequest extends S.Class<DeleteExpressionRequest>(
  "DeleteExpressionRequest",
)(
  { DomainName: S.String, ExpressionName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteIndexFieldRequest extends S.Class<DeleteIndexFieldRequest>(
  "DeleteIndexFieldRequest",
)(
  { DomainName: S.String, IndexFieldName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSuggesterRequest extends S.Class<DeleteSuggesterRequest>(
  "DeleteSuggesterRequest",
)(
  { DomainName: S.String, SuggesterName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAnalysisSchemesRequest extends S.Class<DescribeAnalysisSchemesRequest>(
  "DescribeAnalysisSchemesRequest",
)(
  {
    DomainName: S.String,
    AnalysisSchemeNames: S.optional(StandardNameList),
    Deployed: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAvailabilityOptionsRequest extends S.Class<DescribeAvailabilityOptionsRequest>(
  "DescribeAvailabilityOptionsRequest",
)(
  { DomainName: S.String, Deployed: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDomainEndpointOptionsRequest extends S.Class<DescribeDomainEndpointOptionsRequest>(
  "DescribeDomainEndpointOptionsRequest",
)(
  { DomainName: S.String, Deployed: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDomainsRequest extends S.Class<DescribeDomainsRequest>(
  "DescribeDomainsRequest",
)(
  { DomainNames: S.optional(DomainNameList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeExpressionsRequest extends S.Class<DescribeExpressionsRequest>(
  "DescribeExpressionsRequest",
)(
  {
    DomainName: S.String,
    ExpressionNames: S.optional(StandardNameList),
    Deployed: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeIndexFieldsRequest extends S.Class<DescribeIndexFieldsRequest>(
  "DescribeIndexFieldsRequest",
)(
  {
    DomainName: S.String,
    FieldNames: S.optional(DynamicFieldNameList),
    Deployed: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeScalingParametersRequest extends S.Class<DescribeScalingParametersRequest>(
  "DescribeScalingParametersRequest",
)(
  { DomainName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeServiceAccessPoliciesRequest extends S.Class<DescribeServiceAccessPoliciesRequest>(
  "DescribeServiceAccessPoliciesRequest",
)(
  { DomainName: S.String, Deployed: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSuggestersRequest extends S.Class<DescribeSuggestersRequest>(
  "DescribeSuggestersRequest",
)(
  {
    DomainName: S.String,
    SuggesterNames: S.optional(StandardNameList),
    Deployed: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class IndexDocumentsRequest extends S.Class<IndexDocumentsRequest>(
  "IndexDocumentsRequest",
)(
  { DomainName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateAvailabilityOptionsRequest extends S.Class<UpdateAvailabilityOptionsRequest>(
  "UpdateAvailabilityOptionsRequest",
)(
  { DomainName: S.String, MultiAZ: S.Boolean },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateServiceAccessPoliciesRequest extends S.Class<UpdateServiceAccessPoliciesRequest>(
  "UpdateServiceAccessPoliciesRequest",
)(
  { DomainName: S.String, AccessPolicies: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const FieldNameList = S.Array(S.String);
export class Expression extends S.Class<Expression>("Expression")({
  ExpressionName: S.String,
  ExpressionValue: S.String,
}) {}
export class AnalysisOptions extends S.Class<AnalysisOptions>(
  "AnalysisOptions",
)({
  Synonyms: S.optional(S.String),
  Stopwords: S.optional(S.String),
  StemmingDictionary: S.optional(S.String),
  JapaneseTokenizationDictionary: S.optional(S.String),
  AlgorithmicStemming: S.optional(S.String),
}) {}
export class AnalysisScheme extends S.Class<AnalysisScheme>("AnalysisScheme")({
  AnalysisSchemeName: S.String,
  AnalysisSchemeLanguage: S.String,
  AnalysisOptions: S.optional(AnalysisOptions),
}) {}
export class OptionStatus extends S.Class<OptionStatus>("OptionStatus")({
  CreationDate: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdateDate: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdateVersion: S.optional(S.Number),
  State: S.String,
  PendingDeletion: S.optional(S.Boolean),
}) {}
export class AnalysisSchemeStatus extends S.Class<AnalysisSchemeStatus>(
  "AnalysisSchemeStatus",
)({ Options: AnalysisScheme, Status: OptionStatus }) {}
export const AnalysisSchemeStatusList = S.Array(AnalysisSchemeStatus);
export class ServiceEndpoint extends S.Class<ServiceEndpoint>(
  "ServiceEndpoint",
)({ Endpoint: S.optional(S.String) }) {}
export class Limits extends S.Class<Limits>("Limits")({
  MaximumReplicationCount: S.Number,
  MaximumPartitionCount: S.Number,
}) {}
export class DomainStatus extends S.Class<DomainStatus>("DomainStatus")({
  DomainId: S.String,
  DomainName: S.String,
  ARN: S.optional(S.String),
  Created: S.optional(S.Boolean),
  Deleted: S.optional(S.Boolean),
  DocService: S.optional(ServiceEndpoint),
  SearchService: S.optional(ServiceEndpoint),
  RequiresIndexDocuments: S.Boolean,
  Processing: S.optional(S.Boolean),
  SearchInstanceType: S.optional(S.String),
  SearchPartitionCount: S.optional(S.Number),
  SearchInstanceCount: S.optional(S.Number),
  Limits: S.optional(Limits),
}) {}
export const DomainStatusList = S.Array(DomainStatus);
export class ExpressionStatus extends S.Class<ExpressionStatus>(
  "ExpressionStatus",
)({ Options: Expression, Status: OptionStatus }) {}
export const ExpressionStatusList = S.Array(ExpressionStatus);
export class IntOptions extends S.Class<IntOptions>("IntOptions")({
  DefaultValue: S.optional(S.Number),
  SourceField: S.optional(S.String),
  FacetEnabled: S.optional(S.Boolean),
  SearchEnabled: S.optional(S.Boolean),
  ReturnEnabled: S.optional(S.Boolean),
  SortEnabled: S.optional(S.Boolean),
}) {}
export class DoubleOptions extends S.Class<DoubleOptions>("DoubleOptions")({
  DefaultValue: S.optional(S.Number),
  SourceField: S.optional(S.String),
  FacetEnabled: S.optional(S.Boolean),
  SearchEnabled: S.optional(S.Boolean),
  ReturnEnabled: S.optional(S.Boolean),
  SortEnabled: S.optional(S.Boolean),
}) {}
export class LiteralOptions extends S.Class<LiteralOptions>("LiteralOptions")({
  DefaultValue: S.optional(S.String),
  SourceField: S.optional(S.String),
  FacetEnabled: S.optional(S.Boolean),
  SearchEnabled: S.optional(S.Boolean),
  ReturnEnabled: S.optional(S.Boolean),
  SortEnabled: S.optional(S.Boolean),
}) {}
export class TextOptions extends S.Class<TextOptions>("TextOptions")({
  DefaultValue: S.optional(S.String),
  SourceField: S.optional(S.String),
  ReturnEnabled: S.optional(S.Boolean),
  SortEnabled: S.optional(S.Boolean),
  HighlightEnabled: S.optional(S.Boolean),
  AnalysisScheme: S.optional(S.String),
}) {}
export class DateOptions extends S.Class<DateOptions>("DateOptions")({
  DefaultValue: S.optional(S.String),
  SourceField: S.optional(S.String),
  FacetEnabled: S.optional(S.Boolean),
  SearchEnabled: S.optional(S.Boolean),
  ReturnEnabled: S.optional(S.Boolean),
  SortEnabled: S.optional(S.Boolean),
}) {}
export class LatLonOptions extends S.Class<LatLonOptions>("LatLonOptions")({
  DefaultValue: S.optional(S.String),
  SourceField: S.optional(S.String),
  FacetEnabled: S.optional(S.Boolean),
  SearchEnabled: S.optional(S.Boolean),
  ReturnEnabled: S.optional(S.Boolean),
  SortEnabled: S.optional(S.Boolean),
}) {}
export class IntArrayOptions extends S.Class<IntArrayOptions>(
  "IntArrayOptions",
)({
  DefaultValue: S.optional(S.Number),
  SourceFields: S.optional(S.String),
  FacetEnabled: S.optional(S.Boolean),
  SearchEnabled: S.optional(S.Boolean),
  ReturnEnabled: S.optional(S.Boolean),
}) {}
export class DoubleArrayOptions extends S.Class<DoubleArrayOptions>(
  "DoubleArrayOptions",
)({
  DefaultValue: S.optional(S.Number),
  SourceFields: S.optional(S.String),
  FacetEnabled: S.optional(S.Boolean),
  SearchEnabled: S.optional(S.Boolean),
  ReturnEnabled: S.optional(S.Boolean),
}) {}
export class LiteralArrayOptions extends S.Class<LiteralArrayOptions>(
  "LiteralArrayOptions",
)({
  DefaultValue: S.optional(S.String),
  SourceFields: S.optional(S.String),
  FacetEnabled: S.optional(S.Boolean),
  SearchEnabled: S.optional(S.Boolean),
  ReturnEnabled: S.optional(S.Boolean),
}) {}
export class TextArrayOptions extends S.Class<TextArrayOptions>(
  "TextArrayOptions",
)({
  DefaultValue: S.optional(S.String),
  SourceFields: S.optional(S.String),
  ReturnEnabled: S.optional(S.Boolean),
  HighlightEnabled: S.optional(S.Boolean),
  AnalysisScheme: S.optional(S.String),
}) {}
export class DateArrayOptions extends S.Class<DateArrayOptions>(
  "DateArrayOptions",
)({
  DefaultValue: S.optional(S.String),
  SourceFields: S.optional(S.String),
  FacetEnabled: S.optional(S.Boolean),
  SearchEnabled: S.optional(S.Boolean),
  ReturnEnabled: S.optional(S.Boolean),
}) {}
export class IndexField extends S.Class<IndexField>("IndexField")({
  IndexFieldName: S.String,
  IndexFieldType: S.String,
  IntOptions: S.optional(IntOptions),
  DoubleOptions: S.optional(DoubleOptions),
  LiteralOptions: S.optional(LiteralOptions),
  TextOptions: S.optional(TextOptions),
  DateOptions: S.optional(DateOptions),
  LatLonOptions: S.optional(LatLonOptions),
  IntArrayOptions: S.optional(IntArrayOptions),
  DoubleArrayOptions: S.optional(DoubleArrayOptions),
  LiteralArrayOptions: S.optional(LiteralArrayOptions),
  TextArrayOptions: S.optional(TextArrayOptions),
  DateArrayOptions: S.optional(DateArrayOptions),
}) {}
export class IndexFieldStatus extends S.Class<IndexFieldStatus>(
  "IndexFieldStatus",
)({ Options: IndexField, Status: OptionStatus }) {}
export const IndexFieldStatusList = S.Array(IndexFieldStatus);
export class DocumentSuggesterOptions extends S.Class<DocumentSuggesterOptions>(
  "DocumentSuggesterOptions",
)({
  SourceField: S.String,
  FuzzyMatching: S.optional(S.String),
  SortExpression: S.optional(S.String),
}) {}
export class Suggester extends S.Class<Suggester>("Suggester")({
  SuggesterName: S.String,
  DocumentSuggesterOptions: DocumentSuggesterOptions,
}) {}
export class SuggesterStatus extends S.Class<SuggesterStatus>(
  "SuggesterStatus",
)({ Options: Suggester, Status: OptionStatus }) {}
export const SuggesterStatusList = S.Array(SuggesterStatus);
export const DomainNameMap = S.Record({ key: S.String, value: S.String });
export class DomainEndpointOptions extends S.Class<DomainEndpointOptions>(
  "DomainEndpointOptions",
)({
  EnforceHTTPS: S.optional(S.Boolean),
  TLSSecurityPolicy: S.optional(S.String),
}) {}
export class ScalingParameters extends S.Class<ScalingParameters>(
  "ScalingParameters",
)({
  DesiredInstanceType: S.optional(S.String),
  DesiredReplicationCount: S.optional(S.Number),
  DesiredPartitionCount: S.optional(S.Number),
}) {}
export class BuildSuggestersResponse extends S.Class<BuildSuggestersResponse>(
  "BuildSuggestersResponse",
)({ FieldNames: S.optional(FieldNameList) }, ns) {}
export class DefineExpressionRequest extends S.Class<DefineExpressionRequest>(
  "DefineExpressionRequest",
)(
  { DomainName: S.String, Expression: Expression },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDomainResponse extends S.Class<DeleteDomainResponse>(
  "DeleteDomainResponse",
)({ DomainStatus: S.optional(DomainStatus) }, ns) {}
export class DescribeAnalysisSchemesResponse extends S.Class<DescribeAnalysisSchemesResponse>(
  "DescribeAnalysisSchemesResponse",
)({ AnalysisSchemes: AnalysisSchemeStatusList }, ns) {}
export class DescribeDomainsResponse extends S.Class<DescribeDomainsResponse>(
  "DescribeDomainsResponse",
)({ DomainStatusList: DomainStatusList }, ns) {}
export class DescribeExpressionsResponse extends S.Class<DescribeExpressionsResponse>(
  "DescribeExpressionsResponse",
)({ Expressions: ExpressionStatusList }, ns) {}
export class DescribeIndexFieldsResponse extends S.Class<DescribeIndexFieldsResponse>(
  "DescribeIndexFieldsResponse",
)({ IndexFields: IndexFieldStatusList }, ns) {}
export class DescribeSuggestersResponse extends S.Class<DescribeSuggestersResponse>(
  "DescribeSuggestersResponse",
)({ Suggesters: SuggesterStatusList }, ns) {}
export class IndexDocumentsResponse extends S.Class<IndexDocumentsResponse>(
  "IndexDocumentsResponse",
)({ FieldNames: S.optional(FieldNameList) }, ns) {}
export class ListDomainNamesResponse extends S.Class<ListDomainNamesResponse>(
  "ListDomainNamesResponse",
)({ DomainNames: S.optional(DomainNameMap) }, ns) {}
export class AvailabilityOptionsStatus extends S.Class<AvailabilityOptionsStatus>(
  "AvailabilityOptionsStatus",
)({ Options: S.Boolean, Status: OptionStatus }) {}
export class UpdateAvailabilityOptionsResponse extends S.Class<UpdateAvailabilityOptionsResponse>(
  "UpdateAvailabilityOptionsResponse",
)({ AvailabilityOptions: S.optional(AvailabilityOptionsStatus) }, ns) {}
export class UpdateDomainEndpointOptionsRequest extends S.Class<UpdateDomainEndpointOptionsRequest>(
  "UpdateDomainEndpointOptionsRequest",
)(
  { DomainName: S.String, DomainEndpointOptions: DomainEndpointOptions },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateScalingParametersRequest extends S.Class<UpdateScalingParametersRequest>(
  "UpdateScalingParametersRequest",
)(
  { DomainName: S.String, ScalingParameters: ScalingParameters },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AccessPoliciesStatus extends S.Class<AccessPoliciesStatus>(
  "AccessPoliciesStatus",
)({ Options: S.String, Status: OptionStatus }) {}
export class UpdateServiceAccessPoliciesResponse extends S.Class<UpdateServiceAccessPoliciesResponse>(
  "UpdateServiceAccessPoliciesResponse",
)({ AccessPolicies: AccessPoliciesStatus }, ns) {}
export class DomainEndpointOptionsStatus extends S.Class<DomainEndpointOptionsStatus>(
  "DomainEndpointOptionsStatus",
)({ Options: DomainEndpointOptions, Status: OptionStatus }) {}
export class ScalingParametersStatus extends S.Class<ScalingParametersStatus>(
  "ScalingParametersStatus",
)({ Options: ScalingParameters, Status: OptionStatus }) {}
export class DefineAnalysisSchemeRequest extends S.Class<DefineAnalysisSchemeRequest>(
  "DefineAnalysisSchemeRequest",
)(
  { DomainName: S.String, AnalysisScheme: AnalysisScheme },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DefineExpressionResponse extends S.Class<DefineExpressionResponse>(
  "DefineExpressionResponse",
)({ Expression: ExpressionStatus }, ns) {}
export class DefineIndexFieldRequest extends S.Class<DefineIndexFieldRequest>(
  "DefineIndexFieldRequest",
)(
  { DomainName: S.String, IndexField: IndexField },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DefineSuggesterRequest extends S.Class<DefineSuggesterRequest>(
  "DefineSuggesterRequest",
)(
  { DomainName: S.String, Suggester: Suggester },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteExpressionResponse extends S.Class<DeleteExpressionResponse>(
  "DeleteExpressionResponse",
)({ Expression: ExpressionStatus }, ns) {}
export class DeleteIndexFieldResponse extends S.Class<DeleteIndexFieldResponse>(
  "DeleteIndexFieldResponse",
)({ IndexField: IndexFieldStatus }, ns) {}
export class DeleteSuggesterResponse extends S.Class<DeleteSuggesterResponse>(
  "DeleteSuggesterResponse",
)({ Suggester: SuggesterStatus }, ns) {}
export class DescribeAvailabilityOptionsResponse extends S.Class<DescribeAvailabilityOptionsResponse>(
  "DescribeAvailabilityOptionsResponse",
)({ AvailabilityOptions: S.optional(AvailabilityOptionsStatus) }, ns) {}
export class DescribeDomainEndpointOptionsResponse extends S.Class<DescribeDomainEndpointOptionsResponse>(
  "DescribeDomainEndpointOptionsResponse",
)({ DomainEndpointOptions: S.optional(DomainEndpointOptionsStatus) }, ns) {}
export class DescribeScalingParametersResponse extends S.Class<DescribeScalingParametersResponse>(
  "DescribeScalingParametersResponse",
)({ ScalingParameters: ScalingParametersStatus }, ns) {}
export class DescribeServiceAccessPoliciesResponse extends S.Class<DescribeServiceAccessPoliciesResponse>(
  "DescribeServiceAccessPoliciesResponse",
)({ AccessPolicies: AccessPoliciesStatus }, ns) {}
export class UpdateDomainEndpointOptionsResponse extends S.Class<UpdateDomainEndpointOptionsResponse>(
  "UpdateDomainEndpointOptionsResponse",
)({ DomainEndpointOptions: S.optional(DomainEndpointOptionsStatus) }, ns) {}
export class UpdateScalingParametersResponse extends S.Class<UpdateScalingParametersResponse>(
  "UpdateScalingParametersResponse",
)({ ScalingParameters: ScalingParametersStatus }, ns) {}
export class CreateDomainResponse extends S.Class<CreateDomainResponse>(
  "CreateDomainResponse",
)({ DomainStatus: S.optional(DomainStatus) }, ns) {}
export class DefineAnalysisSchemeResponse extends S.Class<DefineAnalysisSchemeResponse>(
  "DefineAnalysisSchemeResponse",
)({ AnalysisScheme: AnalysisSchemeStatus }, ns) {}
export class DefineIndexFieldResponse extends S.Class<DefineIndexFieldResponse>(
  "DefineIndexFieldResponse",
)({ IndexField: IndexFieldStatus }, ns) {}
export class DefineSuggesterResponse extends S.Class<DefineSuggesterResponse>(
  "DefineSuggesterResponse",
)({ Suggester: SuggesterStatus }, ns) {}
export class DeleteAnalysisSchemeResponse extends S.Class<DeleteAnalysisSchemeResponse>(
  "DeleteAnalysisSchemeResponse",
)({ AnalysisScheme: AnalysisSchemeStatus }, ns) {}

//# Errors
export class BaseException extends S.TaggedError<BaseException>()(
  "BaseException",
  {},
) {}
export class InternalException extends S.TaggedError<InternalException>()(
  "InternalException",
  {},
  T.AwsQueryError({ code: "InternalException", httpResponseCode: 500 }),
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
  T.AwsQueryError({ code: "ResourceNotFound", httpResponseCode: 409 }),
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class InvalidTypeException extends S.TaggedError<InvalidTypeException>()(
  "InvalidTypeException",
  {},
  T.AwsQueryError({ code: "InvalidType", httpResponseCode: 409 }),
) {}
export class DisabledOperationException extends S.TaggedError<DisabledOperationException>()(
  "DisabledOperationException",
  {},
  T.AwsQueryError({ code: "DisabledAction", httpResponseCode: 409 }),
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
  T.AwsQueryError({ code: "LimitExceeded", httpResponseCode: 409 }),
) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceAlreadyExists", httpResponseCode: 409 }),
) {}

//# Operations
/**
 * Gets information about the search domains owned by this account. Can be limited to specific domains. Shows
 * all domains by default. To get the number of searchable documents in a domain, use the console or submit a `matchall` request to your domain's search endpoint: `q=matchall&q.parser=structured&size=0`. For more information,
 * see Getting Information about a Search Domain in the *Amazon CloudSearch Developer Guide*.
 */
export const describeDomains = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDomainsRequest,
  output: DescribeDomainsResponse,
  errors: [BaseException, InternalException],
}));
/**
 * Gets the expressions configured for the search domain. Can be limited to specific expressions by name. By default, shows all expressions and includes any pending changes to the configuration. Set the `Deployed` option to `true` to show the active configuration and exclude pending changes. For more information, see Configuring Expressions in the *Amazon CloudSearch Developer Guide*.
 */
export const describeExpressions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeExpressionsRequest,
  output: DescribeExpressionsResponse,
  errors: [BaseException, InternalException, ResourceNotFoundException],
}));
/**
 * Gets information about the index fields configured for the search domain.
 * Can be limited to specific fields by name. By default, shows all fields and includes any pending changes to the configuration. Set the `Deployed` option to `true` to show the active configuration and exclude pending changes. For more information,
 * see Getting Domain Information in the *Amazon CloudSearch Developer Guide*.
 */
export const describeIndexFields = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeIndexFieldsRequest,
  output: DescribeIndexFieldsResponse,
  errors: [BaseException, InternalException, ResourceNotFoundException],
}));
/**
 * Gets the suggesters configured for a domain. A suggester enables you to display possible matches before users finish typing their queries. Can be limited to specific suggesters by name. By default, shows all suggesters and includes any pending changes to the configuration. Set the `Deployed` option to `true` to show the active configuration and exclude pending changes. For more information, see Getting Search Suggestions in the *Amazon CloudSearch Developer Guide*.
 */
export const describeSuggesters = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSuggestersRequest,
  output: DescribeSuggestersResponse,
  errors: [BaseException, InternalException, ResourceNotFoundException],
}));
/**
 * Lists all search domains owned by an account.
 */
export const listDomainNames = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDomainNamesRequest,
  output: ListDomainNamesResponse,
  errors: [BaseException],
}));
/**
 * Indexes the search suggestions. For more information, see Configuring Suggesters in the *Amazon CloudSearch Developer Guide*.
 */
export const buildSuggesters = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BuildSuggestersRequest,
  output: BuildSuggestersResponse,
  errors: [
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Permanently deletes a search domain and all of its data. Once a domain has been deleted, it cannot be recovered. For more information,
 * see Deleting a Search Domain in the *Amazon CloudSearch Developer Guide*.
 */
export const deleteDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainRequest,
  output: DeleteDomainResponse,
  errors: [BaseException, InternalException],
}));
/**
 * Removes an `Expression` from the search domain. For more information, see Configuring Expressions in the *Amazon CloudSearch Developer Guide*.
 */
export const deleteExpression = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteExpressionRequest,
  output: DeleteExpressionResponse,
  errors: [
    BaseException,
    InternalException,
    InvalidTypeException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes an `IndexField` from the search domain. For more information, see Configuring Index Fields in the *Amazon CloudSearch Developer Guide*.
 */
export const deleteIndexField = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIndexFieldRequest,
  output: DeleteIndexFieldResponse,
  errors: [
    BaseException,
    InternalException,
    InvalidTypeException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a suggester. For more information, see Getting Search Suggestions in the *Amazon CloudSearch Developer Guide*.
 */
export const deleteSuggester = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSuggesterRequest,
  output: DeleteSuggesterResponse,
  errors: [
    BaseException,
    InternalException,
    InvalidTypeException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets the analysis schemes configured for a domain. An analysis scheme defines language-specific text processing options for a `text` field. Can be limited to specific analysis schemes by name. By default, shows all analysis schemes and includes any pending changes to the configuration. Set the `Deployed` option to `true` to show the active configuration and exclude pending changes. For more information, see Configuring Analysis Schemes in the *Amazon CloudSearch Developer Guide*.
 */
export const describeAnalysisSchemes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAnalysisSchemesRequest,
    output: DescribeAnalysisSchemesResponse,
    errors: [BaseException, InternalException, ResourceNotFoundException],
  }),
);
/**
 * Gets the availability options configured for a domain. By default, shows the configuration with any pending changes. Set the `Deployed` option to `true` to show the active configuration and exclude pending changes. For more information, see Configuring Availability Options in the *Amazon CloudSearch Developer Guide*.
 */
export const describeAvailabilityOptions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAvailabilityOptionsRequest,
    output: DescribeAvailabilityOptionsResponse,
    errors: [
      BaseException,
      DisabledOperationException,
      InternalException,
      InvalidTypeException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Returns the domain's endpoint options, specifically whether all requests to the domain must arrive over HTTPS. For more information, see Configuring Domain Endpoint Options in the *Amazon CloudSearch Developer Guide*.
 */
export const describeDomainEndpointOptions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDomainEndpointOptionsRequest,
    output: DescribeDomainEndpointOptionsResponse,
    errors: [
      BaseException,
      DisabledOperationException,
      InternalException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Gets the scaling parameters configured for a domain. A domain's scaling parameters specify the desired search instance type and replication count. For more information, see Configuring Scaling Options in the *Amazon CloudSearch Developer Guide*.
 */
export const describeScalingParameters = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeScalingParametersRequest,
    output: DescribeScalingParametersResponse,
    errors: [BaseException, InternalException, ResourceNotFoundException],
  }),
);
/**
 * Gets information about the access policies that control access to the domain's document and search endpoints. By default, shows the configuration with any pending changes. Set the `Deployed` option to `true` to show the active configuration and exclude pending changes. For more information,
 * see Configuring Access for a Search Domain in the *Amazon CloudSearch Developer Guide*.
 */
export const describeServiceAccessPolicies =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeServiceAccessPoliciesRequest,
    output: DescribeServiceAccessPoliciesResponse,
    errors: [BaseException, InternalException, ResourceNotFoundException],
  }));
/**
 * Tells the search domain to start indexing its documents using the latest indexing options. This operation must be invoked to activate options whose OptionStatus is `RequiresIndexDocuments`.
 */
export const indexDocuments = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: IndexDocumentsRequest,
  output: IndexDocumentsResponse,
  errors: [
    BaseException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Configures the availability options for a domain. Enabling the Multi-AZ option expands an Amazon CloudSearch domain to an additional Availability Zone in the same Region to increase fault tolerance in the event of a service disruption. Changes to the Multi-AZ option can take about half an hour to become active. For more information, see Configuring Availability Options in the *Amazon CloudSearch Developer Guide*.
 */
export const updateAvailabilityOptions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAvailabilityOptionsRequest,
    output: UpdateAvailabilityOptionsResponse,
    errors: [
      BaseException,
      DisabledOperationException,
      InternalException,
      InvalidTypeException,
      LimitExceededException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the domain's endpoint options, specifically whether all requests to the domain must arrive over HTTPS. For more information, see Configuring Domain Endpoint Options in the *Amazon CloudSearch Developer Guide*.
 */
export const updateDomainEndpointOptions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDomainEndpointOptionsRequest,
    output: UpdateDomainEndpointOptionsResponse,
    errors: [
      BaseException,
      DisabledOperationException,
      InternalException,
      InvalidTypeException,
      LimitExceededException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Configures scaling parameters for a domain. A domain's scaling parameters specify the desired search instance type and replication count. Amazon CloudSearch will still automatically scale your domain based on the volume of data and traffic, but not below the desired instance type and replication count. If the Multi-AZ option is enabled, these values control the resources used per Availability Zone. For more information, see Configuring Scaling Options in the *Amazon CloudSearch Developer Guide*.
 */
export const updateScalingParameters = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateScalingParametersRequest,
    output: UpdateScalingParametersResponse,
    errors: [
      BaseException,
      InternalException,
      InvalidTypeException,
      LimitExceededException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Configures the access rules that control access to the domain's document and search endpoints.
 * For more information, see
 * Configuring Access for an Amazon CloudSearch Domain.
 */
export const updateServiceAccessPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateServiceAccessPoliciesRequest,
    output: UpdateServiceAccessPoliciesResponse,
    errors: [
      BaseException,
      InternalException,
      InvalidTypeException,
      LimitExceededException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Configures an analysis scheme that can be applied to a `text` or `text-array` field to define language-specific text processing options. For more information, see Configuring Analysis Schemes in the *Amazon CloudSearch Developer Guide*.
 */
export const defineAnalysisScheme = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DefineAnalysisSchemeRequest,
    output: DefineAnalysisSchemeResponse,
    errors: [
      BaseException,
      InternalException,
      InvalidTypeException,
      LimitExceededException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Configures an `Expression` for the search domain. Used to create new expressions and modify existing ones. If the expression exists, the new configuration replaces the old one. For more information, see Configuring Expressions in the *Amazon CloudSearch Developer Guide*.
 */
export const defineExpression = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DefineExpressionRequest,
  output: DefineExpressionResponse,
  errors: [
    BaseException,
    InternalException,
    InvalidTypeException,
    LimitExceededException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Configures an `IndexField` for the search domain. Used to create new fields and modify existing ones. You must specify the name of the domain you are configuring and an index field configuration. The index field configuration specifies a unique name, the index field type, and the options you want to configure for the field. The options you can specify depend on the `IndexFieldType`. If the field exists, the new configuration replaces the old one. For more information, see Configuring Index Fields in the *Amazon CloudSearch Developer Guide*.
 */
export const defineIndexField = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DefineIndexFieldRequest,
  output: DefineIndexFieldResponse,
  errors: [
    BaseException,
    InternalException,
    InvalidTypeException,
    LimitExceededException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Configures a suggester for a domain. A suggester enables you to display possible matches before users finish typing their queries. When you configure a suggester, you must specify the name of the text field you want to search for possible matches and a unique name for the suggester. For more information, see Getting Search Suggestions in the *Amazon CloudSearch Developer Guide*.
 */
export const defineSuggester = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DefineSuggesterRequest,
  output: DefineSuggesterResponse,
  errors: [
    BaseException,
    InternalException,
    InvalidTypeException,
    LimitExceededException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes an analysis scheme. For more information, see Configuring Analysis Schemes in the *Amazon CloudSearch Developer Guide*.
 */
export const deleteAnalysisScheme = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAnalysisSchemeRequest,
    output: DeleteAnalysisSchemeResponse,
    errors: [
      BaseException,
      InternalException,
      InvalidTypeException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a new search domain. For more information,
 * see Creating a Search Domain in the *Amazon CloudSearch Developer Guide*.
 */
export const createDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDomainRequest,
  output: CreateDomainResponse,
  errors: [
    BaseException,
    InternalException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ValidationException,
  ],
}));
