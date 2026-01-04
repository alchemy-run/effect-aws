import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Health",
  serviceShapeName: "AWSHealth_20160804",
});
const auth = T.AwsAuthSigv4({ name: "health" });
const ver = T.ServiceVersion("2016-08-04");
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
      conditions: [
        { fn: "not", argv: [{ fn: "isSet", argv: [{ ref: "Endpoint" }] }] },
        { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, false] },
        { fn: "isSet", argv: [{ ref: "Region" }] },
        {
          fn: "aws.partition",
          argv: [{ ref: "Region" }],
          assign: "PartitionResult",
        },
        {
          fn: "not",
          argv: [
            {
              fn: "stringEquals",
              argv: [
                { fn: "getAttr", argv: [{ ref: "PartitionResult" }, "name"] },
                "aws",
              ],
            },
          ],
        },
        {
          fn: "not",
          argv: [
            {
              fn: "stringEquals",
              argv: [
                { fn: "getAttr", argv: [{ ref: "PartitionResult" }, "name"] },
                "aws-cn",
              ],
            },
          ],
        },
        {
          fn: "not",
          argv: [
            {
              fn: "stringEquals",
              argv: [
                { fn: "getAttr", argv: [{ ref: "PartitionResult" }, "name"] },
                "aws-us-gov",
              ],
            },
          ],
        },
        {
          fn: "not",
          argv: [
            {
              fn: "stringEquals",
              argv: [
                { fn: "getAttr", argv: [{ ref: "PartitionResult" }, "name"] },
                "aws-iso",
              ],
            },
          ],
        },
        {
          fn: "not",
          argv: [
            {
              fn: "stringEquals",
              argv: [
                { fn: "getAttr", argv: [{ ref: "PartitionResult" }, "name"] },
                "aws-iso-b",
              ],
            },
          ],
        },
        {
          fn: "not",
          argv: [
            {
              fn: "stringEquals",
              argv: [
                { fn: "getAttr", argv: [{ ref: "PartitionResult" }, "name"] },
                "aws-iso-e",
              ],
            },
          ],
        },
        {
          fn: "not",
          argv: [
            {
              fn: "stringEquals",
              argv: [
                { fn: "getAttr", argv: [{ ref: "PartitionResult" }, "name"] },
                "aws-iso-f",
              ],
            },
          ],
        },
      ],
      rules: [
        {
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
          ],
          endpoint: {
            url: "https://health-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
            properties: {},
            headers: {},
          },
          type: "endpoint",
        },
        {
          conditions: [],
          endpoint: {
            url: "https://health.{Region}.{PartitionResult#dualStackDnsSuffix}",
            properties: {},
            headers: {},
          },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
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
                        url: "https://health-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://health-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://health.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                { fn: "stringEquals", argv: [{ ref: "Region" }, "aws-global"] },
              ],
              endpoint: {
                url: "https://global.health.amazonaws.com",
                properties: {
                  authSchemes: [
                    {
                      name: "sigv4",
                      signingName: "health",
                      signingRegion: "us-east-1",
                    },
                  ],
                },
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [{ ref: "Region" }, "aws-cn-global"],
                },
              ],
              endpoint: {
                url: "https://global.health.amazonaws.com.cn",
                properties: {
                  authSchemes: [
                    {
                      name: "sigv4",
                      signingName: "health",
                      signingRegion: "cn-northwest-1",
                    },
                  ],
                },
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://health.{Region}.{PartitionResult#dnsSuffix}",
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
export class DescribeHealthServiceStatusForOrganizationRequest extends S.Class<DescribeHealthServiceStatusForOrganizationRequest>(
  "DescribeHealthServiceStatusForOrganizationRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisableHealthServiceAccessForOrganizationRequest extends S.Class<DisableHealthServiceAccessForOrganizationRequest>(
  "DisableHealthServiceAccessForOrganizationRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisableHealthServiceAccessForOrganizationResponse extends S.Class<DisableHealthServiceAccessForOrganizationResponse>(
  "DisableHealthServiceAccessForOrganizationResponse",
)({}) {}
export class EnableHealthServiceAccessForOrganizationRequest extends S.Class<EnableHealthServiceAccessForOrganizationRequest>(
  "EnableHealthServiceAccessForOrganizationRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EnableHealthServiceAccessForOrganizationResponse extends S.Class<EnableHealthServiceAccessForOrganizationResponse>(
  "EnableHealthServiceAccessForOrganizationResponse",
)({}) {}
export const EventArnsList = S.Array(S.String);
export const OrganizationEventArnsList = S.Array(S.String);
export const OrganizationAccountIdsList = S.Array(S.String);
export const eventArnList = S.Array(S.String);
export class EventAccountFilter extends S.Class<EventAccountFilter>(
  "EventAccountFilter",
)({ eventArn: S.String, awsAccountId: S.optional(S.String) }) {}
export const OrganizationEventDetailFiltersList = S.Array(EventAccountFilter);
export class DescribeAffectedAccountsForOrganizationRequest extends S.Class<DescribeAffectedAccountsForOrganizationRequest>(
  "DescribeAffectedAccountsForOrganizationRequest",
)(
  {
    eventArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEntityAggregatesRequest extends S.Class<DescribeEntityAggregatesRequest>(
  "DescribeEntityAggregatesRequest",
)(
  { eventArns: S.optional(EventArnsList) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEntityAggregatesForOrganizationRequest extends S.Class<DescribeEntityAggregatesForOrganizationRequest>(
  "DescribeEntityAggregatesForOrganizationRequest",
)(
  {
    eventArns: OrganizationEventArnsList,
    awsAccountIds: S.optional(OrganizationAccountIdsList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEventDetailsRequest extends S.Class<DescribeEventDetailsRequest>(
  "DescribeEventDetailsRequest",
)(
  { eventArns: eventArnList, locale: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEventDetailsForOrganizationRequest extends S.Class<DescribeEventDetailsForOrganizationRequest>(
  "DescribeEventDetailsForOrganizationRequest",
)(
  {
    organizationEventDetailFilters: OrganizationEventDetailFiltersList,
    locale: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const EventActionabilityList = S.Array(S.String);
export const eventTypeList2 = S.Array(S.String);
export const serviceList = S.Array(S.String);
export const regionList = S.Array(S.String);
export const availabilityZones = S.Array(S.String);
export class DateTimeRange extends S.Class<DateTimeRange>("DateTimeRange")({
  from: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  to: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const dateTimeRangeList = S.Array(DateTimeRange);
export const entityArnList = S.Array(S.String);
export const entityValueList = S.Array(S.String);
export const eventTypeCategoryList2 = S.Array(S.String);
export const tagSet = S.Record({ key: S.String, value: S.String });
export const tagFilter = S.Array(tagSet);
export const eventStatusCodeList = S.Array(S.String);
export const EventPersonaList = S.Array(S.String);
export class EventFilter extends S.Class<EventFilter>("EventFilter")({
  actionabilities: S.optional(EventActionabilityList),
  eventArns: S.optional(eventArnList),
  eventTypeCodes: S.optional(eventTypeList2),
  services: S.optional(serviceList),
  regions: S.optional(regionList),
  availabilityZones: S.optional(availabilityZones),
  startTimes: S.optional(dateTimeRangeList),
  endTimes: S.optional(dateTimeRangeList),
  lastUpdatedTimes: S.optional(dateTimeRangeList),
  entityArns: S.optional(entityArnList),
  entityValues: S.optional(entityValueList),
  eventTypeCategories: S.optional(eventTypeCategoryList2),
  tags: S.optional(tagFilter),
  eventStatusCodes: S.optional(eventStatusCodeList),
  personas: S.optional(EventPersonaList),
}) {}
export class DescribeEventsRequest extends S.Class<DescribeEventsRequest>(
  "DescribeEventsRequest",
)(
  {
    filter: S.optional(EventFilter),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    locale: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeHealthServiceStatusForOrganizationResponse extends S.Class<DescribeHealthServiceStatusForOrganizationResponse>(
  "DescribeHealthServiceStatusForOrganizationResponse",
)({ healthServiceAccessStatusForOrganization: S.optional(S.String) }) {}
export const entityStatusCodeList = S.Array(S.String);
export const awsAccountIdsList = S.Array(S.String);
export const EventTypeCodeList = S.Array(S.String);
export const EventTypeCategoryList = S.Array(S.String);
export const EventTypeActionabilityList = S.Array(S.String);
export const EventTypePersonaList = S.Array(S.String);
export const affectedAccountsList = S.Array(S.String);
export const OrganizationEntityFiltersList = S.Array(EventAccountFilter);
export class EntityAccountFilter extends S.Class<EntityAccountFilter>(
  "EntityAccountFilter",
)({
  eventArn: S.String,
  awsAccountId: S.optional(S.String),
  statusCodes: S.optional(entityStatusCodeList),
}) {}
export const OrganizationEntityAccountFiltersList =
  S.Array(EntityAccountFilter);
export class OrganizationEventFilter extends S.Class<OrganizationEventFilter>(
  "OrganizationEventFilter",
)({
  actionabilities: S.optional(EventActionabilityList),
  eventTypeCodes: S.optional(eventTypeList2),
  awsAccountIds: S.optional(awsAccountIdsList),
  services: S.optional(serviceList),
  regions: S.optional(regionList),
  startTime: S.optional(DateTimeRange),
  endTime: S.optional(DateTimeRange),
  lastUpdatedTime: S.optional(DateTimeRange),
  entityArns: S.optional(entityArnList),
  entityValues: S.optional(entityValueList),
  eventTypeCategories: S.optional(eventTypeCategoryList2),
  eventStatusCodes: S.optional(eventStatusCodeList),
  personas: S.optional(EventPersonaList),
}) {}
export class EventTypeFilter extends S.Class<EventTypeFilter>(
  "EventTypeFilter",
)({
  eventTypeCodes: S.optional(EventTypeCodeList),
  services: S.optional(serviceList),
  eventTypeCategories: S.optional(EventTypeCategoryList),
  actionabilities: S.optional(EventTypeActionabilityList),
  personas: S.optional(EventTypePersonaList),
}) {}
export class DescribeAffectedAccountsForOrganizationResponse extends S.Class<DescribeAffectedAccountsForOrganizationResponse>(
  "DescribeAffectedAccountsForOrganizationResponse",
)({
  affectedAccounts: S.optional(affectedAccountsList),
  eventScopeCode: S.optional(S.String),
  nextToken: S.optional(S.String),
}) {}
export class DescribeAffectedEntitiesForOrganizationRequest extends S.Class<DescribeAffectedEntitiesForOrganizationRequest>(
  "DescribeAffectedEntitiesForOrganizationRequest",
)(
  {
    organizationEntityFilters: S.optional(OrganizationEntityFiltersList),
    locale: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    organizationEntityAccountFilters: S.optional(
      OrganizationEntityAccountFiltersList,
    ),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEventAggregatesRequest extends S.Class<DescribeEventAggregatesRequest>(
  "DescribeEventAggregatesRequest",
)(
  {
    filter: S.optional(EventFilter),
    aggregateField: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEventsForOrganizationRequest extends S.Class<DescribeEventsForOrganizationRequest>(
  "DescribeEventsForOrganizationRequest",
)(
  {
    filter: S.optional(OrganizationEventFilter),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    locale: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEventTypesRequest extends S.Class<DescribeEventTypesRequest>(
  "DescribeEventTypesRequest",
)(
  {
    filter: S.optional(EventTypeFilter),
    locale: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EntityFilter extends S.Class<EntityFilter>("EntityFilter")({
  eventArns: eventArnList,
  entityArns: S.optional(entityArnList),
  entityValues: S.optional(entityValueList),
  lastUpdatedTimes: S.optional(dateTimeRangeList),
  tags: S.optional(tagFilter),
  statusCodes: S.optional(entityStatusCodeList),
}) {}
export class EventDetailsErrorItem extends S.Class<EventDetailsErrorItem>(
  "EventDetailsErrorItem",
)({
  eventArn: S.optional(S.String),
  errorName: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const DescribeEventDetailsFailedSet = S.Array(EventDetailsErrorItem);
export class Event extends S.Class<Event>("Event")({
  arn: S.optional(S.String),
  service: S.optional(S.String),
  eventTypeCode: S.optional(S.String),
  eventTypeCategory: S.optional(S.String),
  region: S.optional(S.String),
  availabilityZone: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  statusCode: S.optional(S.String),
  eventScopeCode: S.optional(S.String),
  actionability: S.optional(S.String),
  personas: S.optional(EventPersonaList),
}) {}
export class EventDescription extends S.Class<EventDescription>(
  "EventDescription",
)({ latestDescription: S.optional(S.String) }) {}
export const eventMetadata = S.Record({ key: S.String, value: S.String });
export class OrganizationEventDetails extends S.Class<OrganizationEventDetails>(
  "OrganizationEventDetails",
)({
  awsAccountId: S.optional(S.String),
  event: S.optional(Event),
  eventDescription: S.optional(EventDescription),
  eventMetadata: S.optional(eventMetadata),
}) {}
export const DescribeEventDetailsForOrganizationSuccessfulSet = S.Array(
  OrganizationEventDetails,
);
export class OrganizationEventDetailsErrorItem extends S.Class<OrganizationEventDetailsErrorItem>(
  "OrganizationEventDetailsErrorItem",
)({
  awsAccountId: S.optional(S.String),
  eventArn: S.optional(S.String),
  errorName: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const DescribeEventDetailsForOrganizationFailedSet = S.Array(
  OrganizationEventDetailsErrorItem,
);
export const EventList = S.Array(Event);
export class DescribeAffectedEntitiesRequest extends S.Class<DescribeAffectedEntitiesRequest>(
  "DescribeAffectedEntitiesRequest",
)(
  {
    filter: EntityFilter,
    locale: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEventDetailsForOrganizationResponse extends S.Class<DescribeEventDetailsForOrganizationResponse>(
  "DescribeEventDetailsForOrganizationResponse",
)({
  successfulSet: S.optional(DescribeEventDetailsForOrganizationSuccessfulSet),
  failedSet: S.optional(DescribeEventDetailsForOrganizationFailedSet),
}) {}
export class DescribeEventsResponse extends S.Class<DescribeEventsResponse>(
  "DescribeEventsResponse",
)({ events: S.optional(EventList), nextToken: S.optional(S.String) }) {}
export const entityStatuses = S.Record({ key: S.String, value: S.Number });
export class AccountEntityAggregate extends S.Class<AccountEntityAggregate>(
  "AccountEntityAggregate",
)({
  accountId: S.optional(S.String),
  count: S.optional(S.Number),
  statuses: S.optional(entityStatuses),
}) {}
export const AccountEntityAggregatesList = S.Array(AccountEntityAggregate);
export class OrganizationAffectedEntitiesErrorItem extends S.Class<OrganizationAffectedEntitiesErrorItem>(
  "OrganizationAffectedEntitiesErrorItem",
)({
  awsAccountId: S.optional(S.String),
  eventArn: S.optional(S.String),
  errorName: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const DescribeAffectedEntitiesForOrganizationFailedSet = S.Array(
  OrganizationAffectedEntitiesErrorItem,
);
export class EntityAggregate extends S.Class<EntityAggregate>(
  "EntityAggregate",
)({
  eventArn: S.optional(S.String),
  count: S.optional(S.Number),
  statuses: S.optional(entityStatuses),
}) {}
export const EntityAggregateList = S.Array(EntityAggregate);
export class OrganizationEntityAggregate extends S.Class<OrganizationEntityAggregate>(
  "OrganizationEntityAggregate",
)({
  eventArn: S.optional(S.String),
  count: S.optional(S.Number),
  statuses: S.optional(entityStatuses),
  accounts: S.optional(AccountEntityAggregatesList),
}) {}
export const OrganizationEntityAggregatesList = S.Array(
  OrganizationEntityAggregate,
);
export class EventAggregate extends S.Class<EventAggregate>("EventAggregate")({
  aggregateValue: S.optional(S.String),
  count: S.optional(S.Number),
}) {}
export const EventAggregateList = S.Array(EventAggregate);
export class EventDetails extends S.Class<EventDetails>("EventDetails")({
  event: S.optional(Event),
  eventDescription: S.optional(EventDescription),
  eventMetadata: S.optional(eventMetadata),
}) {}
export const DescribeEventDetailsSuccessfulSet = S.Array(EventDetails);
export class OrganizationEvent extends S.Class<OrganizationEvent>(
  "OrganizationEvent",
)({
  arn: S.optional(S.String),
  service: S.optional(S.String),
  eventTypeCode: S.optional(S.String),
  eventTypeCategory: S.optional(S.String),
  eventScopeCode: S.optional(S.String),
  region: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  statusCode: S.optional(S.String),
  actionability: S.optional(S.String),
  personas: S.optional(EventPersonaList),
}) {}
export const OrganizationEventList = S.Array(OrganizationEvent);
export class EventType extends S.Class<EventType>("EventType")({
  service: S.optional(S.String),
  code: S.optional(S.String),
  category: S.optional(S.String),
  actionability: S.optional(S.String),
  personas: S.optional(EventTypePersonaList),
}) {}
export const EventTypeList = S.Array(EventType);
export const entityMetadata = S.Record({ key: S.String, value: S.String });
export class AffectedEntity extends S.Class<AffectedEntity>("AffectedEntity")({
  entityArn: S.optional(S.String),
  eventArn: S.optional(S.String),
  entityValue: S.optional(S.String),
  entityUrl: S.optional(S.String),
  awsAccountId: S.optional(S.String),
  lastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  statusCode: S.optional(S.String),
  tags: S.optional(tagSet),
  entityMetadata: S.optional(entityMetadata),
}) {}
export const EntityList = S.Array(AffectedEntity);
export class DescribeAffectedEntitiesResponse extends S.Class<DescribeAffectedEntitiesResponse>(
  "DescribeAffectedEntitiesResponse",
)({ entities: S.optional(EntityList), nextToken: S.optional(S.String) }) {}
export class DescribeEntityAggregatesResponse extends S.Class<DescribeEntityAggregatesResponse>(
  "DescribeEntityAggregatesResponse",
)({ entityAggregates: S.optional(EntityAggregateList) }) {}
export class DescribeEntityAggregatesForOrganizationResponse extends S.Class<DescribeEntityAggregatesForOrganizationResponse>(
  "DescribeEntityAggregatesForOrganizationResponse",
)({
  organizationEntityAggregates: S.optional(OrganizationEntityAggregatesList),
}) {}
export class DescribeEventAggregatesResponse extends S.Class<DescribeEventAggregatesResponse>(
  "DescribeEventAggregatesResponse",
)({
  eventAggregates: S.optional(EventAggregateList),
  nextToken: S.optional(S.String),
}) {}
export class DescribeEventDetailsResponse extends S.Class<DescribeEventDetailsResponse>(
  "DescribeEventDetailsResponse",
)({
  successfulSet: S.optional(DescribeEventDetailsSuccessfulSet),
  failedSet: S.optional(DescribeEventDetailsFailedSet),
}) {}
export class DescribeEventsForOrganizationResponse extends S.Class<DescribeEventsForOrganizationResponse>(
  "DescribeEventsForOrganizationResponse",
)({
  events: S.optional(OrganizationEventList),
  nextToken: S.optional(S.String),
}) {}
export class DescribeEventTypesResponse extends S.Class<DescribeEventTypesResponse>(
  "DescribeEventTypesResponse",
)({ eventTypes: S.optional(EventTypeList), nextToken: S.optional(S.String) }) {}
export class DescribeAffectedEntitiesForOrganizationResponse extends S.Class<DescribeAffectedEntitiesForOrganizationResponse>(
  "DescribeAffectedEntitiesForOrganizationResponse",
)({
  entities: S.optional(EntityList),
  failedSet: S.optional(DescribeAffectedEntitiesForOrganizationFailedSet),
  nextToken: S.optional(S.String),
}) {}

//# Errors
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  {},
) {}
export class InvalidPaginationToken extends S.TaggedError<InvalidPaginationToken>()(
  "InvalidPaginationToken",
  { message: S.optional(S.String) },
) {}
export class UnsupportedLocale extends S.TaggedError<UnsupportedLocale>()(
  "UnsupportedLocale",
  {},
) {}

//# Operations
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
export const enableHealthServiceAccessForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: EnableHealthServiceAccessForOrganizationRequest,
    output: EnableHealthServiceAccessForOrganizationResponse,
    errors: [ConcurrentModificationException],
  }));
/**
 * This operation provides status information on enabling or disabling Health to work
 * with your organization. To call this operation, you must use the organization's
 * management account.
 */
export const describeHealthServiceStatusForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disableHealthServiceAccessForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisableHealthServiceAccessForOrganizationRequest,
    output: DisableHealthServiceAccessForOrganizationResponse,
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
export const describeAffectedAccountsForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAffectedAccountsForOrganizationRequest,
    output: DescribeAffectedAccountsForOrganizationResponse,
    errors: [InvalidPaginationToken],
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
export const describeEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEventsRequest,
  output: DescribeEventsResponse,
  errors: [InvalidPaginationToken, UnsupportedLocale],
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
export const describeAffectedEntities = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAffectedEntitiesRequest,
    output: DescribeAffectedEntitiesResponse,
    errors: [InvalidPaginationToken, UnsupportedLocale],
  }),
);
/**
 * Returns the number of entities that are affected by each of the specified events.
 */
export const describeEntityAggregates = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeEntityAggregatesRequest,
    output: DescribeEntityAggregatesResponse,
    errors: [],
  }),
);
/**
 * Returns a list of entity aggregates for your Organizations that are affected by each of the specified events.
 */
export const describeEntityAggregatesForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeEventAggregates = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeEventAggregatesRequest,
    output: DescribeEventAggregatesResponse,
    errors: [InvalidPaginationToken],
  }),
);
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
export const describeEventDetails = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeEventDetailsRequest,
    output: DescribeEventDetailsResponse,
    errors: [UnsupportedLocale],
  }),
);
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
export const describeEventDetailsForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeEventsForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeEventsForOrganizationRequest,
    output: DescribeEventsForOrganizationResponse,
    errors: [InvalidPaginationToken, UnsupportedLocale],
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
export const describeEventTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEventTypesRequest,
  output: DescribeEventTypesResponse,
  errors: [InvalidPaginationToken, UnsupportedLocale],
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
export const describeAffectedEntitiesForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAffectedEntitiesForOrganizationRequest,
    output: DescribeAffectedEntitiesForOrganizationResponse,
    errors: [InvalidPaginationToken, UnsupportedLocale],
  }));
