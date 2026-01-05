import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Pricing",
  serviceShapeName: "AWSPriceListService",
});
const auth = T.AwsAuthSigv4({ name: "pricing" });
const ver = T.ServiceVersion("2017-10-15");
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
                        url: "https://api.pricing-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://api.pricing-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://api.pricing.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [
                    "aws",
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                  ],
                },
              ],
              endpoint: {
                url: "https://api.pricing.{Region}.amazonaws.com",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://api.pricing.{Region}.{PartitionResult#dnsSuffix}",
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
export class DescribeServicesRequest extends S.Class<DescribeServicesRequest>(
  "DescribeServicesRequest",
)(
  {
    ServiceCode: S.optional(S.String),
    FormatVersion: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAttributeValuesRequest extends S.Class<GetAttributeValuesRequest>(
  "GetAttributeValuesRequest",
)(
  {
    ServiceCode: S.String,
    AttributeName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPriceListFileUrlRequest extends S.Class<GetPriceListFileUrlRequest>(
  "GetPriceListFileUrlRequest",
)(
  { PriceListArn: S.String, FileFormat: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPriceListsRequest extends S.Class<ListPriceListsRequest>(
  "ListPriceListsRequest",
)(
  {
    ServiceCode: S.String,
    EffectiveDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    RegionCode: S.optional(S.String),
    CurrencyCode: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Filter extends S.Class<Filter>("Filter")({
  Type: S.String,
  Field: S.String,
  Value: S.String,
}) {}
export const Filters = S.Array(Filter);
export class GetPriceListFileUrlResponse extends S.Class<GetPriceListFileUrlResponse>(
  "GetPriceListFileUrlResponse",
)({ Url: S.optional(S.String) }) {}
export class GetProductsRequest extends S.Class<GetProductsRequest>(
  "GetProductsRequest",
)(
  {
    ServiceCode: S.String,
    Filters: S.optional(Filters),
    FormatVersion: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const AttributeNameList = S.Array(S.String);
export const FileFormats = S.Array(S.String);
export class Service extends S.Class<Service>("Service")({
  ServiceCode: S.String,
  AttributeNames: S.optional(AttributeNameList),
}) {}
export const ServiceList = S.Array(Service);
export class AttributeValue extends S.Class<AttributeValue>("AttributeValue")({
  Value: S.optional(S.String),
}) {}
export const AttributeValueList = S.Array(AttributeValue);
export const PriceListJsonItems = S.Array(S.String);
export class PriceList extends S.Class<PriceList>("PriceList")({
  PriceListArn: S.optional(S.String),
  RegionCode: S.optional(S.String),
  CurrencyCode: S.optional(S.String),
  FileFormats: S.optional(FileFormats),
}) {}
export const PriceLists = S.Array(PriceList);
export class DescribeServicesResponse extends S.Class<DescribeServicesResponse>(
  "DescribeServicesResponse",
)({
  Services: S.optional(ServiceList),
  FormatVersion: S.optional(S.String),
  NextToken: S.optional(S.String),
}) {}
export class GetAttributeValuesResponse extends S.Class<GetAttributeValuesResponse>(
  "GetAttributeValuesResponse",
)({
  AttributeValues: S.optional(AttributeValueList),
  NextToken: S.optional(S.String),
}) {}
export class GetProductsResponse extends S.Class<GetProductsResponse>(
  "GetProductsResponse",
)({
  FormatVersion: S.optional(S.String),
  PriceList: S.optional(PriceListJsonItems),
  NextToken: S.optional(S.String),
}) {}
export class ListPriceListsResponse extends S.Class<ListPriceListsResponse>(
  "ListPriceListsResponse",
)({ PriceLists: S.optional(PriceLists), NextToken: S.optional(S.String) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
) {}
export class ExpiredNextTokenException extends S.TaggedError<ExpiredNextTokenException>()(
  "ExpiredNextTokenException",
  { Message: S.optional(S.String) },
) {}
export class InternalErrorException extends S.TaggedError<InternalErrorException>()(
  "InternalErrorException",
  { Message: S.optional(S.String) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { Message: S.optional(S.String) },
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}

//# Operations
/**
 * Returns a list of attribute values. Attributes are similar to the details
 * in a Price List API offer file. For a list of available attributes, see
 * Offer File Definitions
 * in the Billing and Cost Management User Guide.
 */
export const getAttributeValues = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetAttributeValuesRequest,
    output: GetAttributeValuesResponse,
    errors: [
      ExpiredNextTokenException,
      InternalErrorException,
      InvalidNextTokenException,
      InvalidParameterException,
      NotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "AttributeValues",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * **This feature is in preview release and is subject to change. Your use of Amazon Web Services Price List API is subject to the Beta Service Participation terms of the Amazon Web Services Service Terms (Section 1.10).**
 *
 * This returns a list of Price List references that the requester if authorized to view,
 * given a `ServiceCode`, `CurrencyCode`, and an
 * `EffectiveDate`. Use without a `RegionCode` filter to list Price
 * List references from all available Amazon Web Services Regions. Use with a
 * `RegionCode` filter to get the Price List reference that's specific to a
 * specific Amazon Web Services Region. You can use the `PriceListArn` from the
 * response to get your preferred Price List files through the GetPriceListFileUrl API.
 */
export const listPriceLists = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPriceListsRequest,
    output: ListPriceListsResponse,
    errors: [
      AccessDeniedException,
      ExpiredNextTokenException,
      InternalErrorException,
      InvalidNextTokenException,
      InvalidParameterException,
      NotFoundException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "PriceLists",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns a list of all products that match the filter criteria.
 */
export const getProducts = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetProductsRequest,
    output: GetProductsResponse,
    errors: [
      ExpiredNextTokenException,
      InternalErrorException,
      InvalidNextTokenException,
      InvalidParameterException,
      NotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "PriceList",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns the metadata for one service or a list of the metadata for all services. Use
 * this without a service code to get the service codes for all services.
 * Use it with a service code, such as `AmazonEC2`, to get information specific to
 * that service, such as the attribute
 * names available for that service. For example, some of the attribute names available for EC2 are
 * `volumeType`, `maxIopsVolume`, `operation`,
 * `locationType`, and `instanceCapacity10xlarge`.
 */
export const describeServices = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: DescribeServicesRequest,
    output: DescribeServicesResponse,
    errors: [
      ExpiredNextTokenException,
      InternalErrorException,
      InvalidNextTokenException,
      InvalidParameterException,
      NotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Services",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * **This feature is in preview release and is subject to change. Your use of Amazon Web Services Price List API is subject to the Beta Service Participation terms of the Amazon Web Services Service Terms (Section 1.10).**
 *
 * This returns the URL that you can retrieve your Price List file from. This URL is based
 * on the `PriceListArn` and `FileFormat` that you retrieve from the
 * ListPriceLists response.
 */
export const getPriceListFileUrl = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPriceListFileUrlRequest,
  output: GetPriceListFileUrlResponse,
  errors: [
    AccessDeniedException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
