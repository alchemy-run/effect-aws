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
  sdkId: "Health",
  serviceShapeName: "AWSHealth_20160804",
});
const auth = T.AwsAuthSigv4({ name: "health" });
const ver = T.ServiceVersion("2016-08-04");
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
  {
    const PartitionResult = _.partition(Region);
    if (
      !(Endpoint != null) &&
      UseDualStack === false &&
      Region != null &&
      PartitionResult != null &&
      PartitionResult !== false &&
      !(_.getAttr(PartitionResult, "name") === "aws") &&
      !(_.getAttr(PartitionResult, "name") === "aws-cn") &&
      !(_.getAttr(PartitionResult, "name") === "aws-us-gov") &&
      !(_.getAttr(PartitionResult, "name") === "aws-iso") &&
      !(_.getAttr(PartitionResult, "name") === "aws-iso-b") &&
      !(_.getAttr(PartitionResult, "name") === "aws-iso-e") &&
      !(_.getAttr(PartitionResult, "name") === "aws-iso-f")
    ) {
      if (UseFIPS === true) {
        return e(
          `https://health-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
        );
      }
      return e(
        `https://health.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
      );
    }
  }
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
              `https://health-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://health-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://health.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        if (Region === "aws-global") {
          return e(
            "https://global.health.amazonaws.com",
            {
              authSchemes: [
                {
                  name: "sigv4",
                  signingName: "health",
                  signingRegion: "us-east-1",
                },
              ],
            },
            {},
          );
        }
        if (Region === "aws-cn-global") {
          return e(
            "https://global.health.amazonaws.com.cn",
            {
              authSchemes: [
                {
                  name: "sigv4",
                  signingName: "health",
                  signingRegion: "cn-northwest-1",
                },
              ],
            },
            {},
          );
        }
        return e(
          `https://health.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type EventArn = string;
export type NextToken = string;
export type MaxResults = number;
export type Locale = string;
export type MaxResultsLowerRange = number;
export type AccountId = string;
export type HealthServiceAccessStatusForOrganization = string;
export type EntityArn = string;
export type EntityValue = string;
export type EventType2 = string;
export type Service = string;
export type Region = string;
export type AvailabilityZone = string;
export type EventTypeCode = string;
export type TagKey = string;
export type TagValue = string;
export type Count = number;
export type EventDescription2 = string;
export type MetadataKey = string;
export type MetadataValue = string;
export type EntityUrl = string;
export type AggregateValue = string;
export type EntityMetadataKey = string;
export type EntityMetadataValue = string;

//# Schemas
export interface DescribeHealthServiceStatusForOrganizationRequest {}
export const DescribeHealthServiceStatusForOrganizationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeHealthServiceStatusForOrganizationRequest",
}) as any as S.Schema<DescribeHealthServiceStatusForOrganizationRequest>;
export interface DisableHealthServiceAccessForOrganizationRequest {}
export const DisableHealthServiceAccessForOrganizationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisableHealthServiceAccessForOrganizationRequest",
}) as any as S.Schema<DisableHealthServiceAccessForOrganizationRequest>;
export interface DisableHealthServiceAccessForOrganizationResponse {}
export const DisableHealthServiceAccessForOrganizationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisableHealthServiceAccessForOrganizationResponse",
}) as any as S.Schema<DisableHealthServiceAccessForOrganizationResponse>;
export interface EnableHealthServiceAccessForOrganizationRequest {}
export const EnableHealthServiceAccessForOrganizationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "EnableHealthServiceAccessForOrganizationRequest",
}) as any as S.Schema<EnableHealthServiceAccessForOrganizationRequest>;
export interface EnableHealthServiceAccessForOrganizationResponse {}
export const EnableHealthServiceAccessForOrganizationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "EnableHealthServiceAccessForOrganizationResponse",
}) as any as S.Schema<EnableHealthServiceAccessForOrganizationResponse>;
export type EventArnsList = string[];
export const EventArnsList = S.Array(S.String);
export type OrganizationEventArnsList = string[];
export const OrganizationEventArnsList = S.Array(S.String);
export type OrganizationAccountIdsList = string[];
export const OrganizationAccountIdsList = S.Array(S.String);
export type EventAggregateField = "eventTypeCategory" | (string & {});
export const EventAggregateField = S.String;
export type EventArnList = string[];
export const EventArnList = S.Array(S.String);
export interface EventAccountFilter {
  eventArn: string;
  awsAccountId?: string;
}
export const EventAccountFilter = S.suspend(() =>
  S.Struct({ eventArn: S.String, awsAccountId: S.optional(S.String) }),
).annotations({
  identifier: "EventAccountFilter",
}) as any as S.Schema<EventAccountFilter>;
export type OrganizationEventDetailFiltersList = EventAccountFilter[];
export const OrganizationEventDetailFiltersList = S.Array(EventAccountFilter);
export interface DescribeAffectedAccountsForOrganizationRequest {
  eventArn: string;
  nextToken?: string;
  maxResults?: number;
}
export const DescribeAffectedAccountsForOrganizationRequest = S.suspend(() =>
  S.Struct({
    eventArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeAffectedAccountsForOrganizationRequest",
}) as any as S.Schema<DescribeAffectedAccountsForOrganizationRequest>;
export interface DescribeEntityAggregatesRequest {
  eventArns?: string[];
}
export const DescribeEntityAggregatesRequest = S.suspend(() =>
  S.Struct({ eventArns: S.optional(EventArnsList) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeEntityAggregatesRequest",
}) as any as S.Schema<DescribeEntityAggregatesRequest>;
export interface DescribeEntityAggregatesForOrganizationRequest {
  eventArns: string[];
  awsAccountIds?: string[];
}
export const DescribeEntityAggregatesForOrganizationRequest = S.suspend(() =>
  S.Struct({
    eventArns: OrganizationEventArnsList,
    awsAccountIds: S.optional(OrganizationAccountIdsList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeEntityAggregatesForOrganizationRequest",
}) as any as S.Schema<DescribeEntityAggregatesForOrganizationRequest>;
export interface DescribeEventDetailsRequest {
  eventArns: string[];
  locale?: string;
}
export const DescribeEventDetailsRequest = S.suspend(() =>
  S.Struct({ eventArns: EventArnList, locale: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeEventDetailsRequest",
}) as any as S.Schema<DescribeEventDetailsRequest>;
export interface DescribeEventDetailsForOrganizationRequest {
  organizationEventDetailFilters: EventAccountFilter[];
  locale?: string;
}
export const DescribeEventDetailsForOrganizationRequest = S.suspend(() =>
  S.Struct({
    organizationEventDetailFilters: OrganizationEventDetailFiltersList,
    locale: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeEventDetailsForOrganizationRequest",
}) as any as S.Schema<DescribeEventDetailsForOrganizationRequest>;
export type EventActionability =
  | "ACTION_REQUIRED"
  | "ACTION_MAY_BE_REQUIRED"
  | "INFORMATIONAL"
  | (string & {});
export const EventActionability = S.String;
export type EventActionabilityList = EventActionability[];
export const EventActionabilityList = S.Array(EventActionability);
export type EventTypeList2 = string[];
export const EventTypeList2 = S.Array(S.String);
export type ServiceList = string[];
export const ServiceList = S.Array(S.String);
export type RegionList = string[];
export const RegionList = S.Array(S.String);
export type AvailabilityZones = string[];
export const AvailabilityZones = S.Array(S.String);
export interface DateTimeRange {
  from?: Date;
  to?: Date;
}
export const DateTimeRange = S.suspend(() =>
  S.Struct({
    from: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    to: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DateTimeRange",
}) as any as S.Schema<DateTimeRange>;
export type DateTimeRangeList = DateTimeRange[];
export const DateTimeRangeList = S.Array(DateTimeRange);
export type EntityArnList = string[];
export const EntityArnList = S.Array(S.String);
export type EntityValueList = string[];
export const EntityValueList = S.Array(S.String);
export type EventTypeCategory =
  | "issue"
  | "accountNotification"
  | "scheduledChange"
  | "investigation"
  | (string & {});
export const EventTypeCategory = S.String;
export type EventTypeCategoryList2 = EventTypeCategory[];
export const EventTypeCategoryList2 = S.Array(EventTypeCategory);
export type TagSet = { [key: string]: string | undefined };
export const TagSet = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type TagFilter = { [key: string]: string | undefined }[];
export const TagFilter = S.Array(TagSet);
export type EventStatusCode = "open" | "closed" | "upcoming" | (string & {});
export const EventStatusCode = S.String;
export type EventStatusCodeList = EventStatusCode[];
export const EventStatusCodeList = S.Array(EventStatusCode);
export type EventPersona =
  | "OPERATIONS"
  | "SECURITY"
  | "BILLING"
  | (string & {});
export const EventPersona = S.String;
export type EventPersonaList = EventPersona[];
export const EventPersonaList = S.Array(EventPersona);
export interface EventFilter {
  actionabilities?: EventActionability[];
  eventArns?: string[];
  eventTypeCodes?: string[];
  services?: string[];
  regions?: string[];
  availabilityZones?: string[];
  startTimes?: DateTimeRange[];
  endTimes?: DateTimeRange[];
  lastUpdatedTimes?: DateTimeRange[];
  entityArns?: string[];
  entityValues?: string[];
  eventTypeCategories?: EventTypeCategory[];
  tags?: { [key: string]: string | undefined }[];
  eventStatusCodes?: EventStatusCode[];
  personas?: EventPersona[];
}
export const EventFilter = S.suspend(() =>
  S.Struct({
    actionabilities: S.optional(EventActionabilityList),
    eventArns: S.optional(EventArnList),
    eventTypeCodes: S.optional(EventTypeList2),
    services: S.optional(ServiceList),
    regions: S.optional(RegionList),
    availabilityZones: S.optional(AvailabilityZones),
    startTimes: S.optional(DateTimeRangeList),
    endTimes: S.optional(DateTimeRangeList),
    lastUpdatedTimes: S.optional(DateTimeRangeList),
    entityArns: S.optional(EntityArnList),
    entityValues: S.optional(EntityValueList),
    eventTypeCategories: S.optional(EventTypeCategoryList2),
    tags: S.optional(TagFilter),
    eventStatusCodes: S.optional(EventStatusCodeList),
    personas: S.optional(EventPersonaList),
  }),
).annotations({ identifier: "EventFilter" }) as any as S.Schema<EventFilter>;
export interface DescribeEventsRequest {
  filter?: EventFilter;
  nextToken?: string;
  maxResults?: number;
  locale?: string;
}
export const DescribeEventsRequest = S.suspend(() =>
  S.Struct({
    filter: S.optional(EventFilter),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    locale: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeEventsRequest",
}) as any as S.Schema<DescribeEventsRequest>;
export interface DescribeHealthServiceStatusForOrganizationResponse {
  healthServiceAccessStatusForOrganization?: string;
}
export const DescribeHealthServiceStatusForOrganizationResponse = S.suspend(
  () =>
    S.Struct({
      healthServiceAccessStatusForOrganization: S.optional(S.String),
    }),
).annotations({
  identifier: "DescribeHealthServiceStatusForOrganizationResponse",
}) as any as S.Schema<DescribeHealthServiceStatusForOrganizationResponse>;
export type EntityStatusCode =
  | "IMPAIRED"
  | "UNIMPAIRED"
  | "UNKNOWN"
  | "PENDING"
  | "RESOLVED"
  | (string & {});
export const EntityStatusCode = S.String;
export type EntityStatusCodeList = EntityStatusCode[];
export const EntityStatusCodeList = S.Array(EntityStatusCode);
export type AwsAccountIdsList = string[];
export const AwsAccountIdsList = S.Array(S.String);
export type EventTypeCodeList = string[];
export const EventTypeCodeList = S.Array(S.String);
export type EventTypeCategoryList = EventTypeCategory[];
export const EventTypeCategoryList = S.Array(EventTypeCategory);
export type EventTypeActionability =
  | "ACTION_REQUIRED"
  | "ACTION_MAY_BE_REQUIRED"
  | "INFORMATIONAL"
  | (string & {});
export const EventTypeActionability = S.String;
export type EventTypeActionabilityList = EventTypeActionability[];
export const EventTypeActionabilityList = S.Array(EventTypeActionability);
export type EventTypePersona =
  | "OPERATIONS"
  | "SECURITY"
  | "BILLING"
  | (string & {});
export const EventTypePersona = S.String;
export type EventTypePersonaList = EventTypePersona[];
export const EventTypePersonaList = S.Array(EventTypePersona);
export type AffectedAccountsList = string[];
export const AffectedAccountsList = S.Array(S.String);
export type EventScopeCode =
  | "PUBLIC"
  | "ACCOUNT_SPECIFIC"
  | "NONE"
  | (string & {});
export const EventScopeCode = S.String;
export type OrganizationEntityFiltersList = EventAccountFilter[];
export const OrganizationEntityFiltersList = S.Array(EventAccountFilter);
export interface EntityAccountFilter {
  eventArn: string;
  awsAccountId?: string;
  statusCodes?: EntityStatusCode[];
}
export const EntityAccountFilter = S.suspend(() =>
  S.Struct({
    eventArn: S.String,
    awsAccountId: S.optional(S.String),
    statusCodes: S.optional(EntityStatusCodeList),
  }),
).annotations({
  identifier: "EntityAccountFilter",
}) as any as S.Schema<EntityAccountFilter>;
export type OrganizationEntityAccountFiltersList = EntityAccountFilter[];
export const OrganizationEntityAccountFiltersList =
  S.Array(EntityAccountFilter);
export interface OrganizationEventFilter {
  actionabilities?: EventActionability[];
  eventTypeCodes?: string[];
  awsAccountIds?: string[];
  services?: string[];
  regions?: string[];
  startTime?: DateTimeRange;
  endTime?: DateTimeRange;
  lastUpdatedTime?: DateTimeRange;
  entityArns?: string[];
  entityValues?: string[];
  eventTypeCategories?: EventTypeCategory[];
  eventStatusCodes?: EventStatusCode[];
  personas?: EventPersona[];
}
export const OrganizationEventFilter = S.suspend(() =>
  S.Struct({
    actionabilities: S.optional(EventActionabilityList),
    eventTypeCodes: S.optional(EventTypeList2),
    awsAccountIds: S.optional(AwsAccountIdsList),
    services: S.optional(ServiceList),
    regions: S.optional(RegionList),
    startTime: S.optional(DateTimeRange),
    endTime: S.optional(DateTimeRange),
    lastUpdatedTime: S.optional(DateTimeRange),
    entityArns: S.optional(EntityArnList),
    entityValues: S.optional(EntityValueList),
    eventTypeCategories: S.optional(EventTypeCategoryList2),
    eventStatusCodes: S.optional(EventStatusCodeList),
    personas: S.optional(EventPersonaList),
  }),
).annotations({
  identifier: "OrganizationEventFilter",
}) as any as S.Schema<OrganizationEventFilter>;
export interface EventTypeFilter {
  eventTypeCodes?: string[];
  services?: string[];
  eventTypeCategories?: EventTypeCategory[];
  actionabilities?: EventTypeActionability[];
  personas?: EventTypePersona[];
}
export const EventTypeFilter = S.suspend(() =>
  S.Struct({
    eventTypeCodes: S.optional(EventTypeCodeList),
    services: S.optional(ServiceList),
    eventTypeCategories: S.optional(EventTypeCategoryList),
    actionabilities: S.optional(EventTypeActionabilityList),
    personas: S.optional(EventTypePersonaList),
  }),
).annotations({
  identifier: "EventTypeFilter",
}) as any as S.Schema<EventTypeFilter>;
export interface DescribeAffectedAccountsForOrganizationResponse {
  affectedAccounts?: string[];
  eventScopeCode?: EventScopeCode;
  nextToken?: string;
}
export const DescribeAffectedAccountsForOrganizationResponse = S.suspend(() =>
  S.Struct({
    affectedAccounts: S.optional(AffectedAccountsList),
    eventScopeCode: S.optional(EventScopeCode),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeAffectedAccountsForOrganizationResponse",
}) as any as S.Schema<DescribeAffectedAccountsForOrganizationResponse>;
export interface DescribeAffectedEntitiesForOrganizationRequest {
  organizationEntityFilters?: EventAccountFilter[];
  locale?: string;
  nextToken?: string;
  maxResults?: number;
  organizationEntityAccountFilters?: EntityAccountFilter[];
}
export const DescribeAffectedEntitiesForOrganizationRequest = S.suspend(() =>
  S.Struct({
    organizationEntityFilters: S.optional(OrganizationEntityFiltersList),
    locale: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    organizationEntityAccountFilters: S.optional(
      OrganizationEntityAccountFiltersList,
    ),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeAffectedEntitiesForOrganizationRequest",
}) as any as S.Schema<DescribeAffectedEntitiesForOrganizationRequest>;
export interface DescribeEventAggregatesRequest {
  filter?: EventFilter;
  aggregateField: EventAggregateField;
  maxResults?: number;
  nextToken?: string;
}
export const DescribeEventAggregatesRequest = S.suspend(() =>
  S.Struct({
    filter: S.optional(EventFilter),
    aggregateField: EventAggregateField,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeEventAggregatesRequest",
}) as any as S.Schema<DescribeEventAggregatesRequest>;
export interface DescribeEventsForOrganizationRequest {
  filter?: OrganizationEventFilter;
  nextToken?: string;
  maxResults?: number;
  locale?: string;
}
export const DescribeEventsForOrganizationRequest = S.suspend(() =>
  S.Struct({
    filter: S.optional(OrganizationEventFilter),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    locale: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeEventsForOrganizationRequest",
}) as any as S.Schema<DescribeEventsForOrganizationRequest>;
export interface DescribeEventTypesRequest {
  filter?: EventTypeFilter;
  locale?: string;
  nextToken?: string;
  maxResults?: number;
}
export const DescribeEventTypesRequest = S.suspend(() =>
  S.Struct({
    filter: S.optional(EventTypeFilter),
    locale: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeEventTypesRequest",
}) as any as S.Schema<DescribeEventTypesRequest>;
export interface EntityFilter {
  eventArns: string[];
  entityArns?: string[];
  entityValues?: string[];
  lastUpdatedTimes?: DateTimeRange[];
  tags?: { [key: string]: string | undefined }[];
  statusCodes?: EntityStatusCode[];
}
export const EntityFilter = S.suspend(() =>
  S.Struct({
    eventArns: EventArnList,
    entityArns: S.optional(EntityArnList),
    entityValues: S.optional(EntityValueList),
    lastUpdatedTimes: S.optional(DateTimeRangeList),
    tags: S.optional(TagFilter),
    statusCodes: S.optional(EntityStatusCodeList),
  }),
).annotations({ identifier: "EntityFilter" }) as any as S.Schema<EntityFilter>;
export interface EventDetailsErrorItem {
  eventArn?: string;
  errorName?: string;
  errorMessage?: string;
}
export const EventDetailsErrorItem = S.suspend(() =>
  S.Struct({
    eventArn: S.optional(S.String),
    errorName: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "EventDetailsErrorItem",
}) as any as S.Schema<EventDetailsErrorItem>;
export type DescribeEventDetailsFailedSet = EventDetailsErrorItem[];
export const DescribeEventDetailsFailedSet = S.Array(EventDetailsErrorItem);
export interface Event {
  arn?: string;
  service?: string;
  eventTypeCode?: string;
  eventTypeCategory?: EventTypeCategory;
  region?: string;
  availabilityZone?: string;
  startTime?: Date;
  endTime?: Date;
  lastUpdatedTime?: Date;
  statusCode?: EventStatusCode;
  eventScopeCode?: EventScopeCode;
  actionability?: EventActionability;
  personas?: EventPersona[];
}
export const Event = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    service: S.optional(S.String),
    eventTypeCode: S.optional(S.String),
    eventTypeCategory: S.optional(EventTypeCategory),
    region: S.optional(S.String),
    availabilityZone: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    statusCode: S.optional(EventStatusCode),
    eventScopeCode: S.optional(EventScopeCode),
    actionability: S.optional(EventActionability),
    personas: S.optional(EventPersonaList),
  }),
).annotations({ identifier: "Event" }) as any as S.Schema<Event>;
export interface EventDescription {
  latestDescription?: string;
}
export const EventDescription = S.suspend(() =>
  S.Struct({ latestDescription: S.optional(S.String) }),
).annotations({
  identifier: "EventDescription",
}) as any as S.Schema<EventDescription>;
export type EventMetadata = { [key: string]: string | undefined };
export const EventMetadata = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface OrganizationEventDetails {
  awsAccountId?: string;
  event?: Event;
  eventDescription?: EventDescription;
  eventMetadata?: { [key: string]: string | undefined };
}
export const OrganizationEventDetails = S.suspend(() =>
  S.Struct({
    awsAccountId: S.optional(S.String),
    event: S.optional(Event),
    eventDescription: S.optional(EventDescription),
    eventMetadata: S.optional(EventMetadata),
  }),
).annotations({
  identifier: "OrganizationEventDetails",
}) as any as S.Schema<OrganizationEventDetails>;
export type DescribeEventDetailsForOrganizationSuccessfulSet =
  OrganizationEventDetails[];
export const DescribeEventDetailsForOrganizationSuccessfulSet = S.Array(
  OrganizationEventDetails,
);
export interface OrganizationEventDetailsErrorItem {
  awsAccountId?: string;
  eventArn?: string;
  errorName?: string;
  errorMessage?: string;
}
export const OrganizationEventDetailsErrorItem = S.suspend(() =>
  S.Struct({
    awsAccountId: S.optional(S.String),
    eventArn: S.optional(S.String),
    errorName: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "OrganizationEventDetailsErrorItem",
}) as any as S.Schema<OrganizationEventDetailsErrorItem>;
export type DescribeEventDetailsForOrganizationFailedSet =
  OrganizationEventDetailsErrorItem[];
export const DescribeEventDetailsForOrganizationFailedSet = S.Array(
  OrganizationEventDetailsErrorItem,
);
export type EventList = Event[];
export const EventList = S.Array(Event);
export interface DescribeAffectedEntitiesRequest {
  filter: EntityFilter;
  locale?: string;
  nextToken?: string;
  maxResults?: number;
}
export const DescribeAffectedEntitiesRequest = S.suspend(() =>
  S.Struct({
    filter: EntityFilter,
    locale: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeAffectedEntitiesRequest",
}) as any as S.Schema<DescribeAffectedEntitiesRequest>;
export interface DescribeEventDetailsForOrganizationResponse {
  successfulSet?: OrganizationEventDetails[];
  failedSet?: OrganizationEventDetailsErrorItem[];
}
export const DescribeEventDetailsForOrganizationResponse = S.suspend(() =>
  S.Struct({
    successfulSet: S.optional(DescribeEventDetailsForOrganizationSuccessfulSet),
    failedSet: S.optional(DescribeEventDetailsForOrganizationFailedSet),
  }),
).annotations({
  identifier: "DescribeEventDetailsForOrganizationResponse",
}) as any as S.Schema<DescribeEventDetailsForOrganizationResponse>;
export interface DescribeEventsResponse {
  events?: Event[];
  nextToken?: string;
}
export const DescribeEventsResponse = S.suspend(() =>
  S.Struct({ events: S.optional(EventList), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "DescribeEventsResponse",
}) as any as S.Schema<DescribeEventsResponse>;
export type EntityStatuses = { [key in EntityStatusCode]?: number };
export const EntityStatuses = S.partial(
  S.Record({ key: EntityStatusCode, value: S.UndefinedOr(S.Number) }),
);
export interface AccountEntityAggregate {
  accountId?: string;
  count?: number;
  statuses?: { [key: string]: number | undefined };
}
export const AccountEntityAggregate = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String),
    count: S.optional(S.Number),
    statuses: S.optional(EntityStatuses),
  }),
).annotations({
  identifier: "AccountEntityAggregate",
}) as any as S.Schema<AccountEntityAggregate>;
export type AccountEntityAggregatesList = AccountEntityAggregate[];
export const AccountEntityAggregatesList = S.Array(AccountEntityAggregate);
export interface OrganizationAffectedEntitiesErrorItem {
  awsAccountId?: string;
  eventArn?: string;
  errorName?: string;
  errorMessage?: string;
}
export const OrganizationAffectedEntitiesErrorItem = S.suspend(() =>
  S.Struct({
    awsAccountId: S.optional(S.String),
    eventArn: S.optional(S.String),
    errorName: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "OrganizationAffectedEntitiesErrorItem",
}) as any as S.Schema<OrganizationAffectedEntitiesErrorItem>;
export type DescribeAffectedEntitiesForOrganizationFailedSet =
  OrganizationAffectedEntitiesErrorItem[];
export const DescribeAffectedEntitiesForOrganizationFailedSet = S.Array(
  OrganizationAffectedEntitiesErrorItem,
);
export interface EntityAggregate {
  eventArn?: string;
  count?: number;
  statuses?: { [key: string]: number | undefined };
}
export const EntityAggregate = S.suspend(() =>
  S.Struct({
    eventArn: S.optional(S.String),
    count: S.optional(S.Number),
    statuses: S.optional(EntityStatuses),
  }),
).annotations({
  identifier: "EntityAggregate",
}) as any as S.Schema<EntityAggregate>;
export type EntityAggregateList = EntityAggregate[];
export const EntityAggregateList = S.Array(EntityAggregate);
export interface OrganizationEntityAggregate {
  eventArn?: string;
  count?: number;
  statuses?: { [key: string]: number | undefined };
  accounts?: AccountEntityAggregate[];
}
export const OrganizationEntityAggregate = S.suspend(() =>
  S.Struct({
    eventArn: S.optional(S.String),
    count: S.optional(S.Number),
    statuses: S.optional(EntityStatuses),
    accounts: S.optional(AccountEntityAggregatesList),
  }),
).annotations({
  identifier: "OrganizationEntityAggregate",
}) as any as S.Schema<OrganizationEntityAggregate>;
export type OrganizationEntityAggregatesList = OrganizationEntityAggregate[];
export const OrganizationEntityAggregatesList = S.Array(
  OrganizationEntityAggregate,
);
export interface EventAggregate {
  aggregateValue?: string;
  count?: number;
}
export const EventAggregate = S.suspend(() =>
  S.Struct({
    aggregateValue: S.optional(S.String),
    count: S.optional(S.Number),
  }),
).annotations({
  identifier: "EventAggregate",
}) as any as S.Schema<EventAggregate>;
export type EventAggregateList = EventAggregate[];
export const EventAggregateList = S.Array(EventAggregate);
export interface EventDetails {
  event?: Event;
  eventDescription?: EventDescription;
  eventMetadata?: { [key: string]: string | undefined };
}
export const EventDetails = S.suspend(() =>
  S.Struct({
    event: S.optional(Event),
    eventDescription: S.optional(EventDescription),
    eventMetadata: S.optional(EventMetadata),
  }),
).annotations({ identifier: "EventDetails" }) as any as S.Schema<EventDetails>;
export type DescribeEventDetailsSuccessfulSet = EventDetails[];
export const DescribeEventDetailsSuccessfulSet = S.Array(EventDetails);
export interface OrganizationEvent {
  arn?: string;
  service?: string;
  eventTypeCode?: string;
  eventTypeCategory?: EventTypeCategory;
  eventScopeCode?: EventScopeCode;
  region?: string;
  startTime?: Date;
  endTime?: Date;
  lastUpdatedTime?: Date;
  statusCode?: EventStatusCode;
  actionability?: EventActionability;
  personas?: EventPersona[];
}
export const OrganizationEvent = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    service: S.optional(S.String),
    eventTypeCode: S.optional(S.String),
    eventTypeCategory: S.optional(EventTypeCategory),
    eventScopeCode: S.optional(EventScopeCode),
    region: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    statusCode: S.optional(EventStatusCode),
    actionability: S.optional(EventActionability),
    personas: S.optional(EventPersonaList),
  }),
).annotations({
  identifier: "OrganizationEvent",
}) as any as S.Schema<OrganizationEvent>;
export type OrganizationEventList = OrganizationEvent[];
export const OrganizationEventList = S.Array(OrganizationEvent);
export interface EventType {
  service?: string;
  code?: string;
  category?: EventTypeCategory;
  actionability?: EventTypeActionability;
  personas?: EventTypePersona[];
}
export const EventType = S.suspend(() =>
  S.Struct({
    service: S.optional(S.String),
    code: S.optional(S.String),
    category: S.optional(EventTypeCategory),
    actionability: S.optional(EventTypeActionability),
    personas: S.optional(EventTypePersonaList),
  }),
).annotations({ identifier: "EventType" }) as any as S.Schema<EventType>;
export type EventTypeList = EventType[];
export const EventTypeList = S.Array(EventType);
export type EntityMetadata = { [key: string]: string | undefined };
export const EntityMetadata = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface AffectedEntity {
  entityArn?: string;
  eventArn?: string;
  entityValue?: string;
  entityUrl?: string;
  awsAccountId?: string;
  lastUpdatedTime?: Date;
  statusCode?: EntityStatusCode;
  tags?: { [key: string]: string | undefined };
  entityMetadata?: { [key: string]: string | undefined };
}
export const AffectedEntity = S.suspend(() =>
  S.Struct({
    entityArn: S.optional(S.String),
    eventArn: S.optional(S.String),
    entityValue: S.optional(S.String),
    entityUrl: S.optional(S.String),
    awsAccountId: S.optional(S.String),
    lastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    statusCode: S.optional(EntityStatusCode),
    tags: S.optional(TagSet),
    entityMetadata: S.optional(EntityMetadata),
  }),
).annotations({
  identifier: "AffectedEntity",
}) as any as S.Schema<AffectedEntity>;
export type EntityList = AffectedEntity[];
export const EntityList = S.Array(AffectedEntity);
export interface DescribeAffectedEntitiesResponse {
  entities?: AffectedEntity[];
  nextToken?: string;
}
export const DescribeAffectedEntitiesResponse = S.suspend(() =>
  S.Struct({
    entities: S.optional(EntityList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeAffectedEntitiesResponse",
}) as any as S.Schema<DescribeAffectedEntitiesResponse>;
export interface DescribeEntityAggregatesResponse {
  entityAggregates?: EntityAggregate[];
}
export const DescribeEntityAggregatesResponse = S.suspend(() =>
  S.Struct({ entityAggregates: S.optional(EntityAggregateList) }),
).annotations({
  identifier: "DescribeEntityAggregatesResponse",
}) as any as S.Schema<DescribeEntityAggregatesResponse>;
export interface DescribeEntityAggregatesForOrganizationResponse {
  organizationEntityAggregates?: OrganizationEntityAggregate[];
}
export const DescribeEntityAggregatesForOrganizationResponse = S.suspend(() =>
  S.Struct({
    organizationEntityAggregates: S.optional(OrganizationEntityAggregatesList),
  }),
).annotations({
  identifier: "DescribeEntityAggregatesForOrganizationResponse",
}) as any as S.Schema<DescribeEntityAggregatesForOrganizationResponse>;
export interface DescribeEventAggregatesResponse {
  eventAggregates?: EventAggregate[];
  nextToken?: string;
}
export const DescribeEventAggregatesResponse = S.suspend(() =>
  S.Struct({
    eventAggregates: S.optional(EventAggregateList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeEventAggregatesResponse",
}) as any as S.Schema<DescribeEventAggregatesResponse>;
export interface DescribeEventDetailsResponse {
  successfulSet?: EventDetails[];
  failedSet?: EventDetailsErrorItem[];
}
export const DescribeEventDetailsResponse = S.suspend(() =>
  S.Struct({
    successfulSet: S.optional(DescribeEventDetailsSuccessfulSet),
    failedSet: S.optional(DescribeEventDetailsFailedSet),
  }),
).annotations({
  identifier: "DescribeEventDetailsResponse",
}) as any as S.Schema<DescribeEventDetailsResponse>;
export interface DescribeEventsForOrganizationResponse {
  events?: OrganizationEvent[];
  nextToken?: string;
}
export const DescribeEventsForOrganizationResponse = S.suspend(() =>
  S.Struct({
    events: S.optional(OrganizationEventList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeEventsForOrganizationResponse",
}) as any as S.Schema<DescribeEventsForOrganizationResponse>;
export interface DescribeEventTypesResponse {
  eventTypes?: EventType[];
  nextToken?: string;
}
export const DescribeEventTypesResponse = S.suspend(() =>
  S.Struct({
    eventTypes: S.optional(EventTypeList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeEventTypesResponse",
}) as any as S.Schema<DescribeEventTypesResponse>;
export interface DescribeAffectedEntitiesForOrganizationResponse {
  entities?: AffectedEntity[];
  failedSet?: OrganizationAffectedEntitiesErrorItem[];
  nextToken?: string;
}
export const DescribeAffectedEntitiesForOrganizationResponse = S.suspend(() =>
  S.Struct({
    entities: S.optional(EntityList),
    failedSet: S.optional(DescribeAffectedEntitiesForOrganizationFailedSet),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeAffectedEntitiesForOrganizationResponse",
}) as any as S.Schema<DescribeAffectedEntitiesForOrganizationResponse>;

//# Errors
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { message: S.optional(S.String) },
) {}
export class InvalidPaginationToken extends S.TaggedError<InvalidPaginationToken>()(
  "InvalidPaginationToken",
  { message: S.optional(S.String) },
) {}
export class UnsupportedLocale extends S.TaggedError<UnsupportedLocale>()(
  "UnsupportedLocale",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * This operation provides status information on enabling or disabling Health to work
 * with your organization. To call this operation, you must use the organization's
 * management account.
 */
export const describeHealthServiceStatusForOrganization: (
  input: DescribeHealthServiceStatusForOrganizationRequest,
) => effect.Effect<
  DescribeHealthServiceStatusForOrganizationResponse,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeHealthServiceStatusForOrganizationRequest,
  output: DescribeHealthServiceStatusForOrganizationResponse,
  errors: [],
}));
/**
 * Disables Health from working with Organizations. To call this operation, you must sign
 * in to the organization's management account. For more information, see Aggregating
 * Health events in the *Health User Guide*.
 *
 * This operation doesn't remove the service-linked role from the management account in your
 * organization. You must use the IAM console, API, or Command Line Interface (CLI) to remove the
 * service-linked role. For more information, see Deleting a Service-Linked Role in the
 * *IAM User Guide*.
 *
 * You can also disable the organizational feature by using the Organizations DisableAWSServiceAccess API operation. After you call this operation,
 * Health stops aggregating events for all other Amazon Web Services accounts in your organization.
 * If you call the Health API operations for organizational view, Health returns
 * an error. Health continues to aggregate health events for your
 * Amazon Web Services account.
 */
export const disableHealthServiceAccessForOrganization: (
  input: DisableHealthServiceAccessForOrganizationRequest,
) => effect.Effect<
  DisableHealthServiceAccessForOrganizationResponse,
  ConcurrentModificationException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableHealthServiceAccessForOrganizationRequest,
  output: DisableHealthServiceAccessForOrganizationResponse,
  errors: [ConcurrentModificationException],
}));
/**
 * Enables Health to work with Organizations. You can use the organizational view feature
 * to aggregate events from all Amazon Web Services accounts in your organization in a centralized location.
 *
 * This operation also creates a service-linked role for the management account in the
 * organization.
 *
 * To call this operation, you must meet the following requirements:
 *
 * - You must have a Business, Enterprise On-Ramp, or Enterprise Support plan from Amazon Web Services Support to use the Health API. If you call
 * the Health API from an Amazon Web Services account that doesn't have a
 * Business, Enterprise On-Ramp, or Enterprise Support plan, you receive a `SubscriptionRequiredException`
 * error.
 *
 * - You must have permission to call this operation from the organization's
 * management account. For example IAM policies, see Health
 * identity-based policy examples.
 *
 * If you don't have the required support plan, you can instead use the Health console
 * to enable the organizational view feature. For more information, see Aggregating
 * Health events in the *Health User Guide*.
 */
export const enableHealthServiceAccessForOrganization: (
  input: EnableHealthServiceAccessForOrganizationRequest,
) => effect.Effect<
  EnableHealthServiceAccessForOrganizationResponse,
  ConcurrentModificationException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableHealthServiceAccessForOrganizationRequest,
  output: EnableHealthServiceAccessForOrganizationResponse,
  errors: [ConcurrentModificationException],
}));
/**
 * Returns a list of accounts in the organization from Organizations that are affected by the
 * provided event. For more information about the different types of Health events, see
 * Event.
 *
 * Before you can call this operation, you must first enable Health to work with
 * Organizations. To do this, call the EnableHealthServiceAccessForOrganization operation from your organization's
 * management account.
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the next request to return more results.
 */
export const describeAffectedAccountsForOrganization: {
  (
    input: DescribeAffectedAccountsForOrganizationRequest,
  ): effect.Effect<
    DescribeAffectedAccountsForOrganizationResponse,
    InvalidPaginationToken | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAffectedAccountsForOrganizationRequest,
  ) => stream.Stream<
    DescribeAffectedAccountsForOrganizationResponse,
    InvalidPaginationToken | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAffectedAccountsForOrganizationRequest,
  ) => stream.Stream<
    AccountId,
    InvalidPaginationToken | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeAffectedAccountsForOrganizationRequest,
  output: DescribeAffectedAccountsForOrganizationResponse,
  errors: [InvalidPaginationToken],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "affectedAccounts",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns the number of entities that are affected by each of the specified events.
 */
export const describeEntityAggregates: (
  input: DescribeEntityAggregatesRequest,
) => effect.Effect<
  DescribeEntityAggregatesResponse,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEntityAggregatesRequest,
  output: DescribeEntityAggregatesResponse,
  errors: [],
}));
/**
 * Returns a list of entity aggregates for your Organizations that are affected by each of the specified events.
 */
export const describeEntityAggregatesForOrganization: (
  input: DescribeEntityAggregatesForOrganizationRequest,
) => effect.Effect<
  DescribeEntityAggregatesForOrganizationResponse,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEntityAggregatesForOrganizationRequest,
  output: DescribeEntityAggregatesForOrganizationResponse,
  errors: [],
}));
/**
 * Returns the number of events of each event type (issue, scheduled change, and account
 * notification). If no filter is specified, the counts of all events in each category are
 * returned.
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the next request to return more results.
 */
export const describeEventAggregates: {
  (
    input: DescribeEventAggregatesRequest,
  ): effect.Effect<
    DescribeEventAggregatesResponse,
    InvalidPaginationToken | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEventAggregatesRequest,
  ) => stream.Stream<
    DescribeEventAggregatesResponse,
    InvalidPaginationToken | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEventAggregatesRequest,
  ) => stream.Stream<
    EventAggregate,
    InvalidPaginationToken | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeEventAggregatesRequest,
  output: DescribeEventAggregatesResponse,
  errors: [InvalidPaginationToken],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "eventAggregates",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns detailed information about one or more specified events for one or more
 * Amazon Web Services accounts in your organization. This information includes standard event data (such as
 * the Amazon Web Services Region and service), an event description, and (depending on the event) possible
 * metadata. This operation doesn't return affected entities, such as the resources related to
 * the event. To return affected entities, use the DescribeAffectedEntitiesForOrganization operation.
 *
 * Before you can call this operation, you must first enable Health to work with
 * Organizations. To do this, call the EnableHealthServiceAccessForOrganization operation from your organization's
 * management account.
 *
 * When you call the `DescribeEventDetailsForOrganization` operation, specify
 * the `organizationEventDetailFilters` object in the request. Depending on the
 * Health event type, note the following differences:
 *
 * - To return event details for a public event, you must specify a null value for the
 * `awsAccountId` parameter. If you specify an account ID for a public
 * event, Health returns an error message because public events aren't specific to
 * an account.
 *
 * - To return event details for an event that is specific to an account in your
 * organization, you must specify the `awsAccountId` parameter in the
 * request. If you don't specify an account ID, Health returns an error message
 * because the event is specific to an account in your organization.
 *
 * For more information, see Event.
 *
 * This operation doesn't support resource-level permissions. You can't use this operation to allow or deny access to specific Health events. For more
 * information, see Resource- and action-based conditions in the *Health User Guide*.
 */
export const describeEventDetailsForOrganization: (
  input: DescribeEventDetailsForOrganizationRequest,
) => effect.Effect<
  DescribeEventDetailsForOrganizationResponse,
  UnsupportedLocale | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEventDetailsForOrganizationRequest,
  output: DescribeEventDetailsForOrganizationResponse,
  errors: [UnsupportedLocale],
}));
/**
 * Returns information about events across your organization in Organizations. You can use
 * the`filters` parameter to specify the events that you want to return. Events
 * are returned in a summary form and don't include the affected accounts, detailed
 * description, any additional metadata that depends on the event type, or any affected
 * resources. To retrieve that information, use the following operations:
 *
 * - DescribeAffectedAccountsForOrganization
 *
 * - DescribeEventDetailsForOrganization
 *
 * - DescribeAffectedEntitiesForOrganization
 *
 * If you don't specify a `filter`, the
 * `DescribeEventsForOrganizations` returns all events across your organization.
 * Results are sorted by `lastModifiedTime`, starting with the most recent event.
 *
 * For more information about the different types of Health events, see Event.
 *
 * Before you can call this operation, you must first enable Health to work with
 * Organizations. To do this, call the EnableHealthServiceAccessForOrganization operation from your organization's
 * management account.
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the next request to return more results.
 */
export const describeEventsForOrganization: {
  (
    input: DescribeEventsForOrganizationRequest,
  ): effect.Effect<
    DescribeEventsForOrganizationResponse,
    InvalidPaginationToken | UnsupportedLocale | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEventsForOrganizationRequest,
  ) => stream.Stream<
    DescribeEventsForOrganizationResponse,
    InvalidPaginationToken | UnsupportedLocale | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEventsForOrganizationRequest,
  ) => stream.Stream<
    OrganizationEvent,
    InvalidPaginationToken | UnsupportedLocale | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeEventsForOrganizationRequest,
  output: DescribeEventsForOrganizationResponse,
  errors: [InvalidPaginationToken, UnsupportedLocale],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "events",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns the event types that meet the specified filter criteria. You can use this API
 * operation to find information about the Health event, such as the category, Amazon Web Services service, and event code. The metadata for each event appears in the EventType object.
 *
 * If you don't specify a filter criteria, the API operation returns all event types, in no
 * particular order.
 *
 * This API operation uses pagination. Specify the `nextToken` parameter in the next request to return more results.
 */
export const describeEventTypes: {
  (
    input: DescribeEventTypesRequest,
  ): effect.Effect<
    DescribeEventTypesResponse,
    InvalidPaginationToken | UnsupportedLocale | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEventTypesRequest,
  ) => stream.Stream<
    DescribeEventTypesResponse,
    InvalidPaginationToken | UnsupportedLocale | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEventTypesRequest,
  ) => stream.Stream<
    EventType,
    InvalidPaginationToken | UnsupportedLocale | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeEventTypesRequest,
  output: DescribeEventTypesResponse,
  errors: [InvalidPaginationToken, UnsupportedLocale],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "eventTypes",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns information about events that meet the specified filter criteria. Events are
 * returned in a summary form and do not include the detailed description, any additional
 * metadata that depends on the event type, or any affected resources. To retrieve that
 * information, use the DescribeEventDetails and DescribeAffectedEntities operations.
 *
 * If no filter criteria are specified, all events are returned. Results are sorted by
 * `lastModifiedTime`, starting with the most recent event.
 *
 * - When you call the `DescribeEvents` operation and specify an entity
 * for the `entityValues` parameter, Health might return public
 * events that aren't specific to that resource. For example, if you call
 * `DescribeEvents` and specify an ID for an Amazon Elastic Compute Cloud (Amazon EC2)
 * instance, Health might return events that aren't specific to that resource or
 * service. To get events that are specific to a service, use the
 * `services` parameter in the `filter` object. For more
 * information, see Event.
 *
 * - This API operation uses pagination. Specify the `nextToken` parameter in the next request to return more results.
 */
export const describeEvents: {
  (
    input: DescribeEventsRequest,
  ): effect.Effect<
    DescribeEventsResponse,
    InvalidPaginationToken | UnsupportedLocale | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEventsRequest,
  ) => stream.Stream<
    DescribeEventsResponse,
    InvalidPaginationToken | UnsupportedLocale | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEventsRequest,
  ) => stream.Stream<
    Event,
    InvalidPaginationToken | UnsupportedLocale | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeEventsRequest,
  output: DescribeEventsResponse,
  errors: [InvalidPaginationToken, UnsupportedLocale],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "events",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of entities that have been affected by the specified events, based on the
 * specified filter criteria. Entities can refer to individual customer resources, groups of
 * customer resources, or any other construct, depending on the Amazon Web Services service. Events that
 * have impact beyond that of the affected entities, or where the extent of impact is unknown,
 * include at least one entity indicating this.
 *
 * At least one event ARN is required.
 *
 * - This API operation uses pagination. Specify the `nextToken` parameter in the next request to return more results.
 *
 * - This operation supports resource-level permissions. You can use this operation to allow or deny access to specific Health events. For more
 * information, see Resource- and action-based conditions in the *Health User Guide*.
 */
export const describeAffectedEntities: {
  (
    input: DescribeAffectedEntitiesRequest,
  ): effect.Effect<
    DescribeAffectedEntitiesResponse,
    InvalidPaginationToken | UnsupportedLocale | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAffectedEntitiesRequest,
  ) => stream.Stream<
    DescribeAffectedEntitiesResponse,
    InvalidPaginationToken | UnsupportedLocale | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAffectedEntitiesRequest,
  ) => stream.Stream<
    AffectedEntity,
    InvalidPaginationToken | UnsupportedLocale | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeAffectedEntitiesRequest,
  output: DescribeAffectedEntitiesResponse,
  errors: [InvalidPaginationToken, UnsupportedLocale],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "entities",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns detailed information about one or more specified events. Information includes
 * standard event data (Amazon Web Services Region, service, and so on, as returned by DescribeEvents), a detailed event description, and possible additional metadata
 * that depends upon the nature of the event. Affected entities are not included. To retrieve
 * the entities, use the DescribeAffectedEntities operation.
 *
 * If a specified event can't be retrieved, an error message is returned for that
 * event.
 *
 * This operation supports resource-level permissions. You can use this operation to allow or deny access to specific Health events. For more
 * information, see Resource- and action-based conditions in the *Health User Guide*.
 */
export const describeEventDetails: (
  input: DescribeEventDetailsRequest,
) => effect.Effect<
  DescribeEventDetailsResponse,
  UnsupportedLocale | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEventDetailsRequest,
  output: DescribeEventDetailsResponse,
  errors: [UnsupportedLocale],
}));
/**
 * Returns a list of entities that have been affected by one or more events for one or more
 * accounts in your organization in Organizations, based on the filter criteria. Entities can refer
 * to individual customer resources, groups of customer resources, or any other construct,
 * depending on the Amazon Web Services service.
 *
 * At least one event Amazon Resource Name (ARN) and account ID are required.
 *
 * Before you can call this operation, you must first enable Health to work with
 * Organizations. To do this, call the EnableHealthServiceAccessForOrganization operation from your organization's
 * management account.
 *
 * - This API operation uses pagination. Specify the `nextToken` parameter in the next request to return more results.
 *
 * - This operation doesn't support resource-level permissions. You can't use this operation to allow or deny access to specific Health events. For more
 * information, see Resource- and action-based conditions in the *Health User Guide*.
 */
export const describeAffectedEntitiesForOrganization: {
  (
    input: DescribeAffectedEntitiesForOrganizationRequest,
  ): effect.Effect<
    DescribeAffectedEntitiesForOrganizationResponse,
    InvalidPaginationToken | UnsupportedLocale | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAffectedEntitiesForOrganizationRequest,
  ) => stream.Stream<
    DescribeAffectedEntitiesForOrganizationResponse,
    InvalidPaginationToken | UnsupportedLocale | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAffectedEntitiesForOrganizationRequest,
  ) => stream.Stream<
    AffectedEntity,
    InvalidPaginationToken | UnsupportedLocale | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeAffectedEntitiesForOrganizationRequest,
  output: DescribeAffectedEntitiesForOrganizationResponse,
  errors: [InvalidPaginationToken, UnsupportedLocale],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "entities",
    pageSize: "maxResults",
  } as const,
}));
