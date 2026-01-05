import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Geo Places",
  serviceShapeName: "PlacesService",
});
const auth = T.AwsAuthSigv4({ name: "geo-places" });
const ver = T.ServiceVersion("2020-11-19");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
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
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://places.geo.{Region}.{PartitionResult#dnsSuffix}/v2",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://places.geo-fips.{Region}.{PartitionResult#dualStackDnsSuffix}/v2",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://places.geo-fips.{Region}.{PartitionResult#dnsSuffix}/v2",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://places.geo.{Region}.{PartitionResult#dualStackDnsSuffix}/v2",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-us-gov",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://places.geo.{Region}.{PartitionResult#dnsSuffix}/v2",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-us-gov",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://places.geo-fips.{Region}.{PartitionResult#dualStackDnsSuffix}/v2",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-us-gov",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://places.geo-fips.{Region}.{PartitionResult#dnsSuffix}/v2",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-us-gov",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://places.geo.{Region}.{PartitionResult#dualStackDnsSuffix}/v2",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
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
                          endpoint: {
                            url: "https://geo-places-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
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
                          endpoint: {
                            url: "https://geo-places-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
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
                          endpoint: {
                            url: "https://geo-places.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                    url: "https://geo-places.{Region}.{PartitionResult#dnsSuffix}",
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
      type: "tree",
    },
  ],
});

//# Schemas
export const Position = S.Array(S.Number);
export const AutocompleteAdditionalFeatureList = S.Array(S.String);
export const GeocodeAdditionalFeatureList = S.Array(S.String);
export const GetPlaceAdditionalFeatureList = S.Array(S.String);
export const ReverseGeocodeAdditionalFeatureList = S.Array(S.String);
export const SearchNearbyAdditionalFeatureList = S.Array(S.String);
export const SearchTextAdditionalFeatureList = S.Array(S.String);
export const SuggestAdditionalFeatureList = S.Array(S.String);
export class GetPlaceRequest extends S.Class<GetPlaceRequest>(
  "GetPlaceRequest",
)(
  {
    PlaceId: S.String.pipe(T.HttpLabel("PlaceId")),
    AdditionalFeatures: S.optional(GetPlaceAdditionalFeatureList).pipe(
      T.HttpQuery("additional-features"),
    ),
    Language: S.optional(S.String).pipe(T.HttpQuery("language")),
    PoliticalView: S.optional(S.String).pipe(T.HttpQuery("political-view")),
    IntendedUse: S.optional(S.String).pipe(T.HttpQuery("intended-use")),
    Key: S.optional(S.String).pipe(T.HttpQuery("key")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/place/{PlaceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const BoundingBox = S.Array(S.Number);
export const CountryCodeList = S.Array(S.String);
export const AutocompleteFilterPlaceTypeList = S.Array(S.String);
export const GeocodeFilterPlaceTypeList = S.Array(S.String);
export const ReverseGeocodeFilterPlaceTypeList = S.Array(S.String);
export const FilterCategoryList = S.Array(S.String);
export const FilterBusinessChainList = S.Array(S.String);
export const FilterFoodTypeList = S.Array(S.String);
export class GeocodeQueryComponents extends S.Class<GeocodeQueryComponents>(
  "GeocodeQueryComponents",
)({
  Country: S.optional(S.String),
  Region: S.optional(S.String),
  SubRegion: S.optional(S.String),
  Locality: S.optional(S.String),
  District: S.optional(S.String),
  Street: S.optional(S.String),
  AddressNumber: S.optional(S.String),
  PostalCode: S.optional(S.String),
}) {}
export class GeocodeFilter extends S.Class<GeocodeFilter>("GeocodeFilter")({
  IncludeCountries: S.optional(CountryCodeList),
  IncludePlaceTypes: S.optional(GeocodeFilterPlaceTypeList),
}) {}
export class Country extends S.Class<Country>("Country")({
  Code2: S.optional(S.String),
  Code3: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export class Region extends S.Class<Region>("Region")({
  Code: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export class SubRegion extends S.Class<SubRegion>("SubRegion")({
  Code: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export const IntersectionStreetList = S.Array(S.String);
export class StreetComponents extends S.Class<StreetComponents>(
  "StreetComponents",
)({
  BaseName: S.optional(S.String),
  Type: S.optional(S.String),
  TypePlacement: S.optional(S.String),
  TypeSeparator: S.optional(S.String),
  Prefix: S.optional(S.String),
  Suffix: S.optional(S.String),
  Direction: S.optional(S.String),
  Language: S.optional(S.String),
}) {}
export const StreetComponentsList = S.Array(StreetComponents);
export class SecondaryAddressComponent extends S.Class<SecondaryAddressComponent>(
  "SecondaryAddressComponent",
)({ Number: S.String, Designator: S.optional(S.String) }) {}
export const SecondaryAddressComponentList = S.Array(SecondaryAddressComponent);
export class Address extends S.Class<Address>("Address")({
  Label: S.optional(S.String),
  Country: S.optional(Country),
  Region: S.optional(Region),
  SubRegion: S.optional(SubRegion),
  Locality: S.optional(S.String),
  District: S.optional(S.String),
  SubDistrict: S.optional(S.String),
  PostalCode: S.optional(S.String),
  Block: S.optional(S.String),
  SubBlock: S.optional(S.String),
  Intersection: S.optional(IntersectionStreetList),
  Street: S.optional(S.String),
  StreetComponents: S.optional(StreetComponentsList),
  AddressNumber: S.optional(S.String),
  Building: S.optional(S.String),
  SecondaryAddressComponents: S.optional(SecondaryAddressComponentList),
}) {}
export class AccessPoint extends S.Class<AccessPoint>("AccessPoint")({
  Position: S.optional(Position),
}) {}
export const AccessPointList = S.Array(AccessPoint);
export class RelatedPlace extends S.Class<RelatedPlace>("RelatedPlace")({
  PlaceId: S.String,
  PlaceType: S.String,
  Title: S.String,
  Address: S.optional(Address),
  Position: S.optional(Position),
  AccessPoints: S.optional(AccessPointList),
}) {}
export const RelatedPlaceList = S.Array(RelatedPlace);
export class ReverseGeocodeFilter extends S.Class<ReverseGeocodeFilter>(
  "ReverseGeocodeFilter",
)({ IncludePlaceTypes: S.optional(ReverseGeocodeFilterPlaceTypeList) }) {}
export class SearchNearbyFilter extends S.Class<SearchNearbyFilter>(
  "SearchNearbyFilter",
)({
  BoundingBox: S.optional(BoundingBox),
  IncludeCountries: S.optional(CountryCodeList),
  IncludeCategories: S.optional(FilterCategoryList),
  ExcludeCategories: S.optional(FilterCategoryList),
  IncludeBusinessChains: S.optional(FilterBusinessChainList),
  ExcludeBusinessChains: S.optional(FilterBusinessChainList),
  IncludeFoodTypes: S.optional(FilterFoodTypeList),
  ExcludeFoodTypes: S.optional(FilterFoodTypeList),
}) {}
export class FilterCircle extends S.Class<FilterCircle>("FilterCircle")({
  Center: Position,
  Radius: S.Number,
}) {}
export class SearchTextFilter extends S.Class<SearchTextFilter>(
  "SearchTextFilter",
)({
  BoundingBox: S.optional(BoundingBox),
  Circle: S.optional(FilterCircle),
  IncludeCountries: S.optional(CountryCodeList),
}) {}
export class SuggestFilter extends S.Class<SuggestFilter>("SuggestFilter")({
  BoundingBox: S.optional(BoundingBox),
  Circle: S.optional(FilterCircle),
  IncludeCountries: S.optional(CountryCodeList),
}) {}
export class GeocodeRequest extends S.Class<GeocodeRequest>("GeocodeRequest")(
  {
    QueryText: S.optional(S.String),
    QueryComponents: S.optional(GeocodeQueryComponents),
    MaxResults: S.optional(S.Number),
    BiasPosition: S.optional(Position),
    Filter: S.optional(GeocodeFilter),
    AdditionalFeatures: S.optional(GeocodeAdditionalFeatureList),
    Language: S.optional(S.String),
    PoliticalView: S.optional(S.String),
    IntendedUse: S.optional(S.String),
    Key: S.optional(S.String).pipe(T.HttpQuery("key")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/geocode" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ReverseGeocodeRequest extends S.Class<ReverseGeocodeRequest>(
  "ReverseGeocodeRequest",
)(
  {
    QueryPosition: Position,
    QueryRadius: S.optional(S.Number),
    MaxResults: S.optional(S.Number),
    Filter: S.optional(ReverseGeocodeFilter),
    AdditionalFeatures: S.optional(ReverseGeocodeAdditionalFeatureList),
    Language: S.optional(S.String),
    PoliticalView: S.optional(S.String),
    IntendedUse: S.optional(S.String),
    Key: S.optional(S.String).pipe(T.HttpQuery("key")),
    Heading: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/reverse-geocode" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchNearbyRequest extends S.Class<SearchNearbyRequest>(
  "SearchNearbyRequest",
)(
  {
    QueryPosition: Position,
    QueryRadius: S.optional(S.Number),
    MaxResults: S.optional(S.Number),
    Filter: S.optional(SearchNearbyFilter),
    AdditionalFeatures: S.optional(SearchNearbyAdditionalFeatureList),
    Language: S.optional(S.String),
    PoliticalView: S.optional(S.String),
    IntendedUse: S.optional(S.String),
    NextToken: S.optional(S.String),
    Key: S.optional(S.String).pipe(T.HttpQuery("key")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-nearby" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchTextRequest extends S.Class<SearchTextRequest>(
  "SearchTextRequest",
)(
  {
    QueryText: S.optional(S.String),
    QueryId: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    BiasPosition: S.optional(Position),
    Filter: S.optional(SearchTextFilter),
    AdditionalFeatures: S.optional(SearchTextAdditionalFeatureList),
    Language: S.optional(S.String),
    PoliticalView: S.optional(S.String),
    IntendedUse: S.optional(S.String),
    NextToken: S.optional(S.String),
    Key: S.optional(S.String).pipe(T.HttpQuery("key")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-text" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SuggestRequest extends S.Class<SuggestRequest>("SuggestRequest")(
  {
    QueryText: S.String,
    MaxResults: S.optional(S.Number),
    MaxQueryRefinements: S.optional(S.Number),
    BiasPosition: S.optional(Position),
    Filter: S.optional(SuggestFilter),
    AdditionalFeatures: S.optional(SuggestAdditionalFeatureList),
    Language: S.optional(S.String),
    PoliticalView: S.optional(S.String),
    IntendedUse: S.optional(S.String),
    Key: S.optional(S.String).pipe(T.HttpQuery("key")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/suggest" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const OpeningHoursDisplayList = S.Array(S.String);
export class AutocompleteFilter extends S.Class<AutocompleteFilter>(
  "AutocompleteFilter",
)({
  BoundingBox: S.optional(BoundingBox),
  Circle: S.optional(FilterCircle),
  IncludeCountries: S.optional(CountryCodeList),
  IncludePlaceTypes: S.optional(AutocompleteFilterPlaceTypeList),
}) {}
export class Category extends S.Class<Category>("Category")({
  Id: S.String,
  Name: S.String,
  LocalizedName: S.optional(S.String),
  Primary: S.optional(S.Boolean),
}) {}
export const CategoryList = S.Array(Category);
export class FoodType extends S.Class<FoodType>("FoodType")({
  LocalizedName: S.String,
  Id: S.optional(S.String),
  Primary: S.optional(S.Boolean),
}) {}
export const FoodTypeList = S.Array(FoodType);
export class BusinessChain extends S.Class<BusinessChain>("BusinessChain")({
  Name: S.optional(S.String),
  Id: S.optional(S.String),
}) {}
export const BusinessChainList = S.Array(BusinessChain);
export class AccessRestriction extends S.Class<AccessRestriction>(
  "AccessRestriction",
)({
  Restricted: S.optional(S.Boolean),
  Categories: S.optional(CategoryList),
}) {}
export const AccessRestrictionList = S.Array(AccessRestriction);
export class TimeZone extends S.Class<TimeZone>("TimeZone")({
  Name: S.String,
  Offset: S.optional(S.String),
  OffsetSeconds: S.optional(S.Number),
}) {}
export class AutocompleteRequest extends S.Class<AutocompleteRequest>(
  "AutocompleteRequest",
)(
  {
    QueryText: S.String,
    MaxResults: S.optional(S.Number),
    BiasPosition: S.optional(Position),
    Filter: S.optional(AutocompleteFilter),
    PostalCodeMode: S.optional(S.String),
    AdditionalFeatures: S.optional(AutocompleteAdditionalFeatureList),
    Language: S.optional(S.String),
    PoliticalView: S.optional(S.String),
    IntendedUse: S.optional(S.String),
    Key: S.optional(S.String).pipe(T.HttpQuery("key")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/autocomplete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UspsZip extends S.Class<UspsZip>("UspsZip")({
  ZipClassificationCode: S.optional(S.String),
}) {}
export class UspsZipPlus4 extends S.Class<UspsZipPlus4>("UspsZipPlus4")({
  RecordTypeCode: S.optional(S.String),
}) {}
export class ContactDetails extends S.Class<ContactDetails>("ContactDetails")({
  Label: S.optional(S.String),
  Value: S.optional(S.String),
  Categories: S.optional(CategoryList),
}) {}
export const ContactDetailsList = S.Array(ContactDetails);
export class OpeningHoursComponents extends S.Class<OpeningHoursComponents>(
  "OpeningHoursComponents",
)({
  OpenTime: S.optional(S.String),
  OpenDuration: S.optional(S.String),
  Recurrence: S.optional(S.String),
}) {}
export const OpeningHoursComponentsList = S.Array(OpeningHoursComponents);
export class PhonemeTranscription extends S.Class<PhonemeTranscription>(
  "PhonemeTranscription",
)({
  Value: S.optional(S.String),
  Language: S.optional(S.String),
  Preferred: S.optional(S.Boolean),
}) {}
export const PhonemeTranscriptionList = S.Array(PhonemeTranscription);
export class AddressComponentPhonemes extends S.Class<AddressComponentPhonemes>(
  "AddressComponentPhonemes",
)({
  Country: S.optional(PhonemeTranscriptionList),
  Region: S.optional(PhonemeTranscriptionList),
  SubRegion: S.optional(PhonemeTranscriptionList),
  Locality: S.optional(PhonemeTranscriptionList),
  District: S.optional(PhonemeTranscriptionList),
  SubDistrict: S.optional(PhonemeTranscriptionList),
  Block: S.optional(PhonemeTranscriptionList),
  SubBlock: S.optional(PhonemeTranscriptionList),
  Street: S.optional(PhonemeTranscriptionList),
}) {}
export class PostalCodeDetails extends S.Class<PostalCodeDetails>(
  "PostalCodeDetails",
)({
  PostalCode: S.optional(S.String),
  PostalAuthority: S.optional(S.String),
  PostalCodeType: S.optional(S.String),
  UspsZip: S.optional(UspsZip),
  UspsZipPlus4: S.optional(UspsZipPlus4),
}) {}
export const PostalCodeDetailsList = S.Array(PostalCodeDetails);
export class Contacts extends S.Class<Contacts>("Contacts")({
  Phones: S.optional(ContactDetailsList),
  Faxes: S.optional(ContactDetailsList),
  Websites: S.optional(ContactDetailsList),
  Emails: S.optional(ContactDetailsList),
}) {}
export class OpeningHours extends S.Class<OpeningHours>("OpeningHours")({
  Display: S.optional(OpeningHoursDisplayList),
  OpenNow: S.optional(S.Boolean),
  Components: S.optional(OpeningHoursComponentsList),
  Categories: S.optional(CategoryList),
}) {}
export const OpeningHoursList = S.Array(OpeningHours);
export class PhonemeDetails extends S.Class<PhonemeDetails>("PhonemeDetails")({
  Title: S.optional(PhonemeTranscriptionList),
  Address: S.optional(AddressComponentPhonemes),
}) {}
export class Intersection extends S.Class<Intersection>("Intersection")({
  PlaceId: S.String,
  Title: S.String,
  Address: S.optional(Address),
  Position: S.optional(Position),
  Distance: S.optional(S.Number),
  RouteDistance: S.optional(S.Number),
  MapView: S.optional(BoundingBox),
  AccessPoints: S.optional(AccessPointList),
}) {}
export const IntersectionList = S.Array(Intersection);
export class ReverseGeocodeResultItem extends S.Class<ReverseGeocodeResultItem>(
  "ReverseGeocodeResultItem",
)({
  PlaceId: S.String,
  PlaceType: S.String,
  Title: S.String,
  Address: S.optional(Address),
  AddressNumberCorrected: S.optional(S.Boolean),
  PostalCodeDetails: S.optional(PostalCodeDetailsList),
  Position: S.optional(Position),
  Distance: S.optional(S.Number),
  MapView: S.optional(BoundingBox),
  Categories: S.optional(CategoryList),
  FoodTypes: S.optional(FoodTypeList),
  AccessPoints: S.optional(AccessPointList),
  TimeZone: S.optional(TimeZone),
  PoliticalView: S.optional(S.String),
  Intersections: S.optional(IntersectionList),
}) {}
export const ReverseGeocodeResultItemList = S.Array(ReverseGeocodeResultItem);
export class SearchNearbyResultItem extends S.Class<SearchNearbyResultItem>(
  "SearchNearbyResultItem",
)({
  PlaceId: S.String,
  PlaceType: S.String,
  Title: S.String,
  Address: S.optional(Address),
  AddressNumberCorrected: S.optional(S.Boolean),
  Position: S.optional(Position),
  Distance: S.optional(S.Number),
  MapView: S.optional(BoundingBox),
  Categories: S.optional(CategoryList),
  FoodTypes: S.optional(FoodTypeList),
  BusinessChains: S.optional(BusinessChainList),
  Contacts: S.optional(Contacts),
  OpeningHours: S.optional(OpeningHoursList),
  AccessPoints: S.optional(AccessPointList),
  AccessRestrictions: S.optional(AccessRestrictionList),
  TimeZone: S.optional(TimeZone),
  PoliticalView: S.optional(S.String),
  Phonemes: S.optional(PhonemeDetails),
}) {}
export const SearchNearbyResultItemList = S.Array(SearchNearbyResultItem);
export class SearchTextResultItem extends S.Class<SearchTextResultItem>(
  "SearchTextResultItem",
)({
  PlaceId: S.String,
  PlaceType: S.String,
  Title: S.String,
  Address: S.optional(Address),
  AddressNumberCorrected: S.optional(S.Boolean),
  Position: S.optional(Position),
  Distance: S.optional(S.Number),
  MapView: S.optional(BoundingBox),
  Categories: S.optional(CategoryList),
  FoodTypes: S.optional(FoodTypeList),
  BusinessChains: S.optional(BusinessChainList),
  Contacts: S.optional(Contacts),
  OpeningHours: S.optional(OpeningHoursList),
  AccessPoints: S.optional(AccessPointList),
  AccessRestrictions: S.optional(AccessRestrictionList),
  TimeZone: S.optional(TimeZone),
  PoliticalView: S.optional(S.String),
  Phonemes: S.optional(PhonemeDetails),
}) {}
export const SearchTextResultItemList = S.Array(SearchTextResultItem);
export class QueryRefinement extends S.Class<QueryRefinement>(
  "QueryRefinement",
)({
  RefinedTerm: S.String,
  OriginalTerm: S.String,
  StartIndex: S.Number,
  EndIndex: S.Number,
}) {}
export const QueryRefinementList = S.Array(QueryRefinement);
export class GetPlaceResponse extends S.Class<GetPlaceResponse>(
  "GetPlaceResponse",
)({
  PlaceId: S.String,
  PlaceType: S.String,
  Title: S.String,
  PricingBucket: S.String.pipe(T.HttpHeader("x-amz-geo-pricing-bucket")),
  Address: S.optional(Address),
  AddressNumberCorrected: S.optional(S.Boolean),
  PostalCodeDetails: S.optional(PostalCodeDetailsList),
  Position: S.optional(Position),
  MapView: S.optional(BoundingBox),
  Categories: S.optional(CategoryList),
  FoodTypes: S.optional(FoodTypeList),
  BusinessChains: S.optional(BusinessChainList),
  Contacts: S.optional(Contacts),
  OpeningHours: S.optional(OpeningHoursList),
  AccessPoints: S.optional(AccessPointList),
  AccessRestrictions: S.optional(AccessRestrictionList),
  TimeZone: S.optional(TimeZone),
  PoliticalView: S.optional(S.String),
  Phonemes: S.optional(PhonemeDetails),
  MainAddress: S.optional(RelatedPlace),
  SecondaryAddresses: S.optional(RelatedPlaceList),
}) {}
export class ReverseGeocodeResponse extends S.Class<ReverseGeocodeResponse>(
  "ReverseGeocodeResponse",
)({
  PricingBucket: S.String.pipe(T.HttpHeader("x-amz-geo-pricing-bucket")),
  ResultItems: S.optional(ReverseGeocodeResultItemList),
}) {}
export class SearchNearbyResponse extends S.Class<SearchNearbyResponse>(
  "SearchNearbyResponse",
)({
  PricingBucket: S.String.pipe(T.HttpHeader("x-amz-geo-pricing-bucket")),
  ResultItems: S.optional(SearchNearbyResultItemList),
  NextToken: S.optional(S.String),
}) {}
export class SearchTextResponse extends S.Class<SearchTextResponse>(
  "SearchTextResponse",
)({
  PricingBucket: S.String.pipe(T.HttpHeader("x-amz-geo-pricing-bucket")),
  ResultItems: S.optional(SearchTextResultItemList),
  NextToken: S.optional(S.String),
}) {}
export class SuggestPlaceResult extends S.Class<SuggestPlaceResult>(
  "SuggestPlaceResult",
)({
  PlaceId: S.optional(S.String),
  PlaceType: S.optional(S.String),
  Address: S.optional(Address),
  Position: S.optional(Position),
  Distance: S.optional(S.Number),
  MapView: S.optional(BoundingBox),
  Categories: S.optional(CategoryList),
  FoodTypes: S.optional(FoodTypeList),
  BusinessChains: S.optional(BusinessChainList),
  AccessPoints: S.optional(AccessPointList),
  AccessRestrictions: S.optional(AccessRestrictionList),
  TimeZone: S.optional(TimeZone),
  PoliticalView: S.optional(S.String),
  Phonemes: S.optional(PhonemeDetails),
}) {}
export class SuggestQueryResult extends S.Class<SuggestQueryResult>(
  "SuggestQueryResult",
)({ QueryId: S.optional(S.String), QueryType: S.optional(S.String) }) {}
export class ParsedQueryComponent extends S.Class<ParsedQueryComponent>(
  "ParsedQueryComponent",
)({
  StartIndex: S.optional(S.Number),
  EndIndex: S.optional(S.Number),
  Value: S.optional(S.String),
  QueryComponent: S.optional(S.String),
}) {}
export const ParsedQueryComponentList = S.Array(ParsedQueryComponent);
export class Highlight extends S.Class<Highlight>("Highlight")({
  StartIndex: S.optional(S.Number),
  EndIndex: S.optional(S.Number),
  Value: S.optional(S.String),
}) {}
export const HighlightList = S.Array(Highlight);
export class SuggestAddressHighlights extends S.Class<SuggestAddressHighlights>(
  "SuggestAddressHighlights",
)({ Label: S.optional(HighlightList) }) {}
export const MatchScoreList = S.Array(S.Number);
export class SuggestHighlights extends S.Class<SuggestHighlights>(
  "SuggestHighlights",
)({
  Title: S.optional(HighlightList),
  Address: S.optional(SuggestAddressHighlights),
}) {}
export const IntersectionHighlightsList = S.Array(HighlightList);
export class ParsedQuerySecondaryAddressComponent extends S.Class<ParsedQuerySecondaryAddressComponent>(
  "ParsedQuerySecondaryAddressComponent",
)({
  StartIndex: S.Number,
  EndIndex: S.Number,
  Value: S.String,
  Number: S.String,
  Designator: S.String,
}) {}
export const ParsedQuerySecondaryAddressComponentList = S.Array(
  ParsedQuerySecondaryAddressComponent,
);
export class SuggestResultItem extends S.Class<SuggestResultItem>(
  "SuggestResultItem",
)({
  Title: S.String,
  SuggestResultItemType: S.String,
  Place: S.optional(SuggestPlaceResult),
  Query: S.optional(SuggestQueryResult),
  Highlights: S.optional(SuggestHighlights),
}) {}
export const SuggestResultItemList = S.Array(SuggestResultItem);
export class GeocodeParsedQueryAddressComponents extends S.Class<GeocodeParsedQueryAddressComponents>(
  "GeocodeParsedQueryAddressComponents",
)({
  Country: S.optional(ParsedQueryComponentList),
  Region: S.optional(ParsedQueryComponentList),
  SubRegion: S.optional(ParsedQueryComponentList),
  Locality: S.optional(ParsedQueryComponentList),
  District: S.optional(ParsedQueryComponentList),
  SubDistrict: S.optional(ParsedQueryComponentList),
  PostalCode: S.optional(ParsedQueryComponentList),
  Block: S.optional(ParsedQueryComponentList),
  SubBlock: S.optional(ParsedQueryComponentList),
  Street: S.optional(ParsedQueryComponentList),
  AddressNumber: S.optional(ParsedQueryComponentList),
  Building: S.optional(ParsedQueryComponentList),
  SecondaryAddressComponents: S.optional(
    ParsedQuerySecondaryAddressComponentList,
  ),
}) {}
export class SecondaryAddressComponentMatchScore extends S.Class<SecondaryAddressComponentMatchScore>(
  "SecondaryAddressComponentMatchScore",
)({ Number: S.optional(S.Number) }) {}
export const SecondaryAddressComponentMatchScoreList = S.Array(
  SecondaryAddressComponentMatchScore,
);
export class SuggestResponse extends S.Class<SuggestResponse>(
  "SuggestResponse",
)({
  PricingBucket: S.String.pipe(T.HttpHeader("x-amz-geo-pricing-bucket")),
  ResultItems: S.optional(SuggestResultItemList),
  QueryRefinements: S.optional(QueryRefinementList),
}) {}
export class GeocodeParsedQuery extends S.Class<GeocodeParsedQuery>(
  "GeocodeParsedQuery",
)({
  Title: S.optional(ParsedQueryComponentList),
  Address: S.optional(GeocodeParsedQueryAddressComponents),
}) {}
export class CountryHighlights extends S.Class<CountryHighlights>(
  "CountryHighlights",
)({ Code: S.optional(HighlightList), Name: S.optional(HighlightList) }) {}
export class RegionHighlights extends S.Class<RegionHighlights>(
  "RegionHighlights",
)({ Code: S.optional(HighlightList), Name: S.optional(HighlightList) }) {}
export class SubRegionHighlights extends S.Class<SubRegionHighlights>(
  "SubRegionHighlights",
)({ Code: S.optional(HighlightList), Name: S.optional(HighlightList) }) {}
export class AddressComponentMatchScores extends S.Class<AddressComponentMatchScores>(
  "AddressComponentMatchScores",
)({
  Country: S.optional(S.Number),
  Region: S.optional(S.Number),
  SubRegion: S.optional(S.Number),
  Locality: S.optional(S.Number),
  District: S.optional(S.Number),
  SubDistrict: S.optional(S.Number),
  PostalCode: S.optional(S.Number),
  Block: S.optional(S.Number),
  SubBlock: S.optional(S.Number),
  Intersection: S.optional(MatchScoreList),
  AddressNumber: S.optional(S.Number),
  Building: S.optional(S.Number),
  SecondaryAddressComponents: S.optional(
    SecondaryAddressComponentMatchScoreList,
  ),
}) {}
export class AutocompleteAddressHighlights extends S.Class<AutocompleteAddressHighlights>(
  "AutocompleteAddressHighlights",
)({
  Label: S.optional(HighlightList),
  Country: S.optional(CountryHighlights),
  Region: S.optional(RegionHighlights),
  SubRegion: S.optional(SubRegionHighlights),
  Locality: S.optional(HighlightList),
  District: S.optional(HighlightList),
  SubDistrict: S.optional(HighlightList),
  Street: S.optional(HighlightList),
  Block: S.optional(HighlightList),
  SubBlock: S.optional(HighlightList),
  Intersection: S.optional(IntersectionHighlightsList),
  PostalCode: S.optional(HighlightList),
  AddressNumber: S.optional(HighlightList),
  Building: S.optional(HighlightList),
}) {}
export class ComponentMatchScores extends S.Class<ComponentMatchScores>(
  "ComponentMatchScores",
)({
  Title: S.optional(S.Number),
  Address: S.optional(AddressComponentMatchScores),
}) {}
export class AutocompleteHighlights extends S.Class<AutocompleteHighlights>(
  "AutocompleteHighlights",
)({
  Title: S.optional(HighlightList),
  Address: S.optional(AutocompleteAddressHighlights),
}) {}
export class MatchScoreDetails extends S.Class<MatchScoreDetails>(
  "MatchScoreDetails",
)({
  Overall: S.optional(S.Number),
  Components: S.optional(ComponentMatchScores),
}) {}
export class AutocompleteResultItem extends S.Class<AutocompleteResultItem>(
  "AutocompleteResultItem",
)({
  PlaceId: S.String,
  PlaceType: S.String,
  Title: S.String,
  Address: S.optional(Address),
  Distance: S.optional(S.Number),
  Language: S.optional(S.String),
  PoliticalView: S.optional(S.String),
  Highlights: S.optional(AutocompleteHighlights),
}) {}
export const AutocompleteResultItemList = S.Array(AutocompleteResultItem);
export class GeocodeResultItem extends S.Class<GeocodeResultItem>(
  "GeocodeResultItem",
)({
  PlaceId: S.String,
  PlaceType: S.String,
  Title: S.String,
  Address: S.optional(Address),
  AddressNumberCorrected: S.optional(S.Boolean),
  PostalCodeDetails: S.optional(PostalCodeDetailsList),
  Position: S.optional(Position),
  Distance: S.optional(S.Number),
  MapView: S.optional(BoundingBox),
  Categories: S.optional(CategoryList),
  FoodTypes: S.optional(FoodTypeList),
  AccessPoints: S.optional(AccessPointList),
  TimeZone: S.optional(TimeZone),
  PoliticalView: S.optional(S.String),
  MatchScores: S.optional(MatchScoreDetails),
  ParsedQuery: S.optional(GeocodeParsedQuery),
  Intersections: S.optional(IntersectionList),
  MainAddress: S.optional(RelatedPlace),
  SecondaryAddresses: S.optional(RelatedPlaceList),
}) {}
export const GeocodeResultItemList = S.Array(GeocodeResultItem);
export class AutocompleteResponse extends S.Class<AutocompleteResponse>(
  "AutocompleteResponse",
)({
  PricingBucket: S.String.pipe(T.HttpHeader("x-amz-geo-pricing-bucket")),
  ResultItems: S.optional(AutocompleteResultItemList),
}) {}
export class GeocodeResponse extends S.Class<GeocodeResponse>(
  "GeocodeResponse",
)({
  PricingBucket: S.String.pipe(T.HttpHeader("x-amz-geo-pricing-bucket")),
  ResultItems: S.optional(GeocodeResultItemList),
}) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({
  Name: S.String.pipe(T.JsonName("name")),
  Message: S.String.pipe(T.JsonName("message")),
}) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String.pipe(T.JsonName("message")) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String.pipe(T.JsonName("message")) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String.pipe(T.JsonName("message")) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String.pipe(T.JsonName("message")),
    Reason: S.String.pipe(T.JsonName("reason")),
    FieldList: ValidationExceptionFieldList.pipe(T.JsonName("fieldList")),
  },
) {}

//# Operations
/**
 * `GetPlace` finds a place by its unique ID. A `PlaceId` is returned by other place operations.
 *
 * For more information, see GetPlace in the *Amazon Location Service Developer Guide*.
 */
export const getPlace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPlaceRequest,
  output: GetPlaceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * `Suggest` provides intelligent predictions or recommendations based on the user's input or context, such as relevant places, points of interest, query terms or search category. It is designed to help users find places or point of interests candidates or identify a follow on query based on incomplete or misspelled queries. It returns a list of possible matches or refinements that can be used to formulate a more accurate query. Users can select the most appropriate suggestion and use it for further searching. The API provides options for filtering results by location and other attributes, and allows for additional features like phonemes and timezones. The response includes refined query terms and detailed place information.
 *
 * For more information, see Suggest in the *Amazon Location Service Developer Guide*.
 */
export const suggest = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SuggestRequest,
  output: SuggestResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * `ReverseGeocode` converts geographic coordinates into a human-readable address or place. You can obtain address component, and other related information such as place type, category, street information. The Reverse Geocode API supports filtering to on place type so that you can refine result based on your need. Also, The Reverse Geocode API can also provide additional features such as time zone information and the inclusion of political views.
 *
 * For more information, see Reverse Geocode in the *Amazon Location Service Developer Guide*.
 */
export const reverseGeocode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReverseGeocodeRequest,
  output: ReverseGeocodeResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * `SearchNearby` queries for points of interest within a radius from a central coordinates, returning place results with optional filters such as categories, business chains, food types and more. The API returns details such as a place name, address, phone, category, food type, contact, opening hours. Also, the API can return phonemes, time zones and more based on requested parameters.
 *
 * For more information, see Search Nearby in the *Amazon Location Service Developer Guide*.
 */
export const searchNearby = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchNearbyRequest,
  output: SearchNearbyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * `SearchText` searches for geocode and place information. You can then complete a follow-up query suggested from the `Suggest` API via a query id.
 *
 * For more information, see Search Text in the *Amazon Location Service Developer Guide*.
 */
export const searchText = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchTextRequest,
  output: SearchTextResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * `Autocomplete` completes potential places and addresses as the user types, based on the partial input. The API enhances the efficiency and accuracy of address by completing query based on a few entered keystrokes. It helps you by completing partial queries with valid address completion. Also, the API supports the filtering of results based on geographic location, country, or specific place types, and can be tailored using optional parameters like language and political views.
 *
 * For more information, see Autocomplete in the *Amazon Location Service Developer Guide*.
 */
export const autocomplete = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AutocompleteRequest,
  output: AutocompleteResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * `Geocode` converts a textual address or place into geographic coordinates. You can obtain geographic coordinates, address component, and other related information. It supports flexible queries, including free-form text or structured queries with components like street names, postal codes, and regions. The Geocode API can also provide additional features such as time zone information and the inclusion of political views.
 *
 * For more information, see Geocode in the *Amazon Location Service Developer Guide*.
 */
export const geocode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GeocodeRequest,
  output: GeocodeResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
