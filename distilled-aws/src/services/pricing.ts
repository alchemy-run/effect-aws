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
  sdkId: "Pricing",
  serviceShapeName: "AWSPriceListService",
});
const auth = T.AwsAuthSigv4({ name: "pricing" });
const ver = T.ServiceVersion("2017-10-15");
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
              `https://api.pricing-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://api.pricing-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://api.pricing.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        if ("aws" === _.getAttr(PartitionResult, "name")) {
          return e(`https://api.pricing.${Region}.amazonaws.com`);
        }
        return e(
          `https://api.pricing.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type FormatVersion = string;
export type BoxedInteger = number;
export type PriceListArn = string;
export type FileFormat = string;
export type ServiceCode = string;
export type EffectiveDate = Date;
export type RegionCode = string;
export type CurrencyCode = string;
export type MaxResults = number;
export type Field = string;
export type Value = string;
export type ErrorMessage = string;
export type SynthesizedJsonPriceListJsonItem = string;

//# Schemas
export interface DescribeServicesRequest {
  ServiceCode?: string;
  FormatVersion?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeServicesRequest = S.suspend(() =>
  S.Struct({
    ServiceCode: S.optional(S.String),
    FormatVersion: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeServicesRequest",
}) as any as S.Schema<DescribeServicesRequest>;
export interface GetAttributeValuesRequest {
  ServiceCode: string;
  AttributeName: string;
  NextToken?: string;
  MaxResults?: number;
}
export const GetAttributeValuesRequest = S.suspend(() =>
  S.Struct({
    ServiceCode: S.String,
    AttributeName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAttributeValuesRequest",
}) as any as S.Schema<GetAttributeValuesRequest>;
export interface GetPriceListFileUrlRequest {
  PriceListArn: string;
  FileFormat: string;
}
export const GetPriceListFileUrlRequest = S.suspend(() =>
  S.Struct({ PriceListArn: S.String, FileFormat: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetPriceListFileUrlRequest",
}) as any as S.Schema<GetPriceListFileUrlRequest>;
export interface ListPriceListsRequest {
  ServiceCode: string;
  EffectiveDate: Date;
  RegionCode?: string;
  CurrencyCode: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListPriceListsRequest = S.suspend(() =>
  S.Struct({
    ServiceCode: S.String,
    EffectiveDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    RegionCode: S.optional(S.String),
    CurrencyCode: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPriceListsRequest",
}) as any as S.Schema<ListPriceListsRequest>;
export type FilterType =
  | "TERM_MATCH"
  | "EQUALS"
  | "CONTAINS"
  | "ANY_OF"
  | "NONE_OF"
  | (string & {});
export const FilterType = S.String;
export interface Filter {
  Type: FilterType;
  Field: string;
  Value: string;
}
export const Filter = S.suspend(() =>
  S.Struct({ Type: FilterType, Field: S.String, Value: S.String }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type Filters = Filter[];
export const Filters = S.Array(Filter);
export interface GetPriceListFileUrlResponse {
  Url?: string;
}
export const GetPriceListFileUrlResponse = S.suspend(() =>
  S.Struct({ Url: S.optional(S.String) }),
).annotations({
  identifier: "GetPriceListFileUrlResponse",
}) as any as S.Schema<GetPriceListFileUrlResponse>;
export interface GetProductsRequest {
  ServiceCode: string;
  Filters?: Filter[];
  FormatVersion?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const GetProductsRequest = S.suspend(() =>
  S.Struct({
    ServiceCode: S.String,
    Filters: S.optional(Filters),
    FormatVersion: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetProductsRequest",
}) as any as S.Schema<GetProductsRequest>;
export type AttributeNameList = string[];
export const AttributeNameList = S.Array(S.String);
export type FileFormats = string[];
export const FileFormats = S.Array(S.String);
export interface Service {
  ServiceCode: string;
  AttributeNames?: string[];
}
export const Service = S.suspend(() =>
  S.Struct({
    ServiceCode: S.String,
    AttributeNames: S.optional(AttributeNameList),
  }),
).annotations({ identifier: "Service" }) as any as S.Schema<Service>;
export type ServiceList = Service[];
export const ServiceList = S.Array(Service);
export interface AttributeValue {
  Value?: string;
}
export const AttributeValue = S.suspend(() =>
  S.Struct({ Value: S.optional(S.String) }),
).annotations({
  identifier: "AttributeValue",
}) as any as S.Schema<AttributeValue>;
export type AttributeValueList = AttributeValue[];
export const AttributeValueList = S.Array(AttributeValue);
export type PriceListJsonItems = string[];
export const PriceListJsonItems = S.Array(S.String);
export interface PriceList {
  PriceListArn?: string;
  RegionCode?: string;
  CurrencyCode?: string;
  FileFormats?: string[];
}
export const PriceList = S.suspend(() =>
  S.Struct({
    PriceListArn: S.optional(S.String),
    RegionCode: S.optional(S.String),
    CurrencyCode: S.optional(S.String),
    FileFormats: S.optional(FileFormats),
  }),
).annotations({ identifier: "PriceList" }) as any as S.Schema<PriceList>;
export type PriceLists = PriceList[];
export const PriceLists = S.Array(PriceList);
export interface DescribeServicesResponse {
  Services?: Service[];
  FormatVersion?: string;
  NextToken?: string;
}
export const DescribeServicesResponse = S.suspend(() =>
  S.Struct({
    Services: S.optional(ServiceList),
    FormatVersion: S.optional(S.String),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeServicesResponse",
}) as any as S.Schema<DescribeServicesResponse>;
export interface GetAttributeValuesResponse {
  AttributeValues?: AttributeValue[];
  NextToken?: string;
}
export const GetAttributeValuesResponse = S.suspend(() =>
  S.Struct({
    AttributeValues: S.optional(AttributeValueList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetAttributeValuesResponse",
}) as any as S.Schema<GetAttributeValuesResponse>;
export interface GetProductsResponse {
  FormatVersion?: string;
  PriceList?: string[];
  NextToken?: string;
}
export const GetProductsResponse = S.suspend(() =>
  S.Struct({
    FormatVersion: S.optional(S.String),
    PriceList: S.optional(PriceListJsonItems),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetProductsResponse",
}) as any as S.Schema<GetProductsResponse>;
export interface ListPriceListsResponse {
  PriceLists?: PriceList[];
  NextToken?: string;
}
export const ListPriceListsResponse = S.suspend(() =>
  S.Struct({
    PriceLists: S.optional(PriceLists),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPriceListsResponse",
}) as any as S.Schema<ListPriceListsResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ExpiredNextTokenException extends S.TaggedError<ExpiredNextTokenException>()(
  "ExpiredNextTokenException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InternalErrorException extends S.TaggedError<InternalErrorException>()(
  "InternalErrorException",
  { Message: S.optional(S.String) },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}

//# Operations
/**
 * Returns a list of attribute values. Attributes are similar to the details
 * in a Price List API offer file. For a list of available attributes, see
 * Offer File Definitions
 * in the Billing and Cost Management User Guide.
 */
export const getAttributeValues: {
  (
    input: GetAttributeValuesRequest,
  ): effect.Effect<
    GetAttributeValuesResponse,
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetAttributeValuesRequest,
  ) => stream.Stream<
    GetAttributeValuesResponse,
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetAttributeValuesRequest,
  ) => stream.Stream<
    AttributeValue,
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
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
export const listPriceLists: {
  (
    input: ListPriceListsRequest,
  ): effect.Effect<
    ListPriceListsResponse,
    | AccessDeniedException
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPriceListsRequest,
  ) => stream.Stream<
    ListPriceListsResponse,
    | AccessDeniedException
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPriceListsRequest,
  ) => stream.Stream<
    PriceList,
    | AccessDeniedException
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Returns a list of all products that match the filter criteria.
 */
export const getProducts: {
  (
    input: GetProductsRequest,
  ): effect.Effect<
    GetProductsResponse,
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetProductsRequest,
  ) => stream.Stream<
    GetProductsResponse,
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetProductsRequest,
  ) => stream.Stream<
    SynthesizedJsonPriceListJsonItem,
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Returns the metadata for one service or a list of the metadata for all services. Use
 * this without a service code to get the service codes for all services.
 * Use it with a service code, such as `AmazonEC2`, to get information specific to
 * that service, such as the attribute
 * names available for that service. For example, some of the attribute names available for EC2 are
 * `volumeType`, `maxIopsVolume`, `operation`,
 * `locationType`, and `instanceCapacity10xlarge`.
 */
export const describeServices: {
  (
    input: DescribeServicesRequest,
  ): effect.Effect<
    DescribeServicesResponse,
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeServicesRequest,
  ) => stream.Stream<
    DescribeServicesResponse,
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeServicesRequest,
  ) => stream.Stream<
    Service,
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * **This feature is in preview release and is subject to change. Your use of Amazon Web Services Price List API is subject to the Beta Service Participation terms of the Amazon Web Services Service Terms (Section 1.10).**
 *
 * This returns the URL that you can retrieve your Price List file from. This URL is based
 * on the `PriceListArn` and `FileFormat` that you retrieve from the
 * ListPriceLists response.
 */
export const getPriceListFileUrl: (
  input: GetPriceListFileUrlRequest,
) => effect.Effect<
  GetPriceListFileUrlResponse,
  | AccessDeniedException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
