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
  sdkId: "Geo Routes",
  serviceShapeName: "RoutesService",
});
const auth = T.AwsAuthSigv4({ name: "geo-routes" });
const ver = T.ServiceVersion("2020-11-19");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { UseDualStack = false, UseFIPS = false, Endpoint, Region } = p;
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
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            `https://routes.geo.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}/v2`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://routes.geo-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}/v2`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            `https://routes.geo-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}/v2`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://routes.geo.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}/v2`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            `https://routes.geo.${Region}.us-gov.${_.getAttr(PartitionResult, "dnsSuffix")}/v2`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://routes.geo-fips.${Region}.us-gov.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}/v2`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            `https://routes.geo-fips.${Region}.us-gov.${_.getAttr(PartitionResult, "dnsSuffix")}/v2`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://routes.geo.${Region}.us-gov.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}/v2`,
          );
        }
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://geo-routes-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true && UseDualStack === false) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://geo-routes-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseFIPS === false && UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://geo-routes.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://geo-routes.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type TimestampWithTimezoneOffset = string | redacted.Redacted<string>;
export type SensitiveBoolean = boolean;
export type GeometryFormat = string;
export type ApiKey = string | redacted.Redacted<string>;
export type IsolineOptimizationObjective = string;
export type RoutingObjective = string;
export type IsolineTravelMode = string;
export type RouteMatrixTravelMode = string;
export type MeasurementSystem = string;
export type LanguageTag = string;
export type RouteLegAdditionalFeature = string | redacted.Redacted<string>;
export type RouteSpanAdditionalFeature = string;
export type RouteTravelMode = string;
export type RouteTravelStepType = string;
export type WaypointOptimizationSequencingObjective = string;
export type WaypointOptimizationTravelMode = string;
export type DistanceMeters = number;
export type RoadSnapTravelMode = string;
export type TruckRoadType = string | redacted.Redacted<string>;
export type Heading = number;
export type DurationSeconds = number;
export type TrafficUsage = string;
export type CountryCode = string | redacted.Redacted<string>;
export type CurrencyCode = string;
export type RouteTollVehicleCategory = string | redacted.Redacted<string>;
export type WaypointOptimizationClusteringAlgorithm =
  | string
  | redacted.Redacted<string>;
export type WaypointId = string;
export type WaypointOptimizationServiceTimeTreatment =
  | string
  | redacted.Redacted<string>;
export type WaypointIndex = number;
export type SpeedKilometersPerHour = number;
export type IsolineZoneCategory = string;
export type SensitiveString = string | redacted.Redacted<string>;
export type MatchingStrategy = string;
export type SideOfStreetMatchingStrategy = string;
export type IsolineEngineType = string | redacted.Redacted<string>;
export type SensitiveInteger = number;
export type WeightKilograms = number;
export type IsolineHazardousCargoType = string | redacted.Redacted<string>;
export type DimensionCentimeters = number;
export type IsolineTruckType = string;
export type TunnelRestrictionCode = string | redacted.Redacted<string>;
export type RouteMatrixZoneCategory = string | redacted.Redacted<string>;
export type RouteMatrixHazardousCargoType = string | redacted.Redacted<string>;
export type RouteMatrixTruckType = string | redacted.Redacted<string>;
export type RouteZoneCategory = string | redacted.Redacted<string>;
export type RouteEngineType = string | redacted.Redacted<string>;
export type RouteHazardousCargoType = string | redacted.Redacted<string>;
export type RouteTruckType = string | redacted.Redacted<string>;
export type WaypointOptimizationHazardousCargoType =
  | string
  | redacted.Redacted<string>;
export type WaypointOptimizationTruckType = string | redacted.Redacted<string>;
export type RoadSnapHazardousCargoType = string | redacted.Redacted<string>;
export type PolylineRing = string | redacted.Redacted<string>;
export type SensitiveDouble = number;
export type DayOfWeek = string | redacted.Redacted<string>;
export type TimeOfDay = string | redacted.Redacted<string>;
export type Polyline = string | redacted.Redacted<string>;
export type RouteMatrixErrorCode = string;
export type RouteResponseNoticeCode = string;
export type RouteNoticeImpact = string;
export type ClusterIndex = number;
export type RoadSnapNoticeCode = string | redacted.Redacted<string>;
export type RouteLegTravelMode = string | redacted.Redacted<string>;
export type RouteLegType = string | redacted.Redacted<string>;
export type WaypointOptimizationConstraint = string | redacted.Redacted<string>;
export type RouteDirection = string | redacted.Redacted<string>;
export type RouteFerryAfterTravelStepType = string | redacted.Redacted<string>;
export type RouteFerryBeforeTravelStepType = string | redacted.Redacted<string>;
export type RouteFerryNoticeCode = string;
export type CountryCode3 = string | redacted.Redacted<string>;
export type RouteFerryTravelStepType = string | redacted.Redacted<string>;
export type RoutePedestrianNoticeCode = string;
export type RouteSpanPedestrianAccessAttribute =
  | string
  | redacted.Redacted<string>;
export type RouteSpanRoadAttribute = string | redacted.Redacted<string>;
export type RoutePedestrianTravelStepType = string | redacted.Redacted<string>;
export type RouteVehicleIncidentSeverity = string | redacted.Redacted<string>;
export type RouteVehicleIncidentType = string | redacted.Redacted<string>;
export type RouteVehicleNoticeCode = string;
export type RouteSpanCarAccessAttribute = string | redacted.Redacted<string>;
export type RouteSpanGateAttribute = string | redacted.Redacted<string>;
export type RouteSpanRailwayCrossingAttribute =
  | string
  | redacted.Redacted<string>;
export type RouteSpanScooterAccessAttribute =
  | string
  | redacted.Redacted<string>;
export type RouteSpanTruckAccessAttribute = string | redacted.Redacted<string>;
export type RouteVehicleTravelStepType = string | redacted.Redacted<string>;
export type RouteSideOfStreet = string | redacted.Redacted<string>;
export type RouteRoadType = string | redacted.Redacted<string>;
export type RouteSteeringDirection = string | redacted.Redacted<string>;
export type TurnAngle = number;
export type RouteTurnIntensity = string | redacted.Redacted<string>;
export type RoundaboutAngle = number;
export type RouteTollPaymentMethod = string | redacted.Redacted<string>;
export type RouteWeightConstraintType = string;
export type RouteTollPassValidityPeriodType =
  | string
  | redacted.Redacted<string>;
export type ValidationExceptionReason = string;

//# Schemas
export type Position = number[];
export const Position = S.Array(S.Number);
export type LanguageTagList = string[];
export const LanguageTagList = S.Array(S.String);
export type RouteLegAdditionalFeatureList =
  | string
  | redacted.Redacted<string>[];
export const RouteLegAdditionalFeatureList = S.Array(SensitiveString);
export type RouteSpanAdditionalFeatureList = string[];
export const RouteSpanAdditionalFeatureList = S.Array(S.String);
export type TruckRoadTypeList = string | redacted.Redacted<string>[];
export const TruckRoadTypeList = S.Array(SensitiveString);
export type DistanceThresholdList = number[];
export const DistanceThresholdList = S.Array(S.Number);
export type TimeThresholdList = number[];
export const TimeThresholdList = S.Array(S.Number);
export type CountryCodeList = string | redacted.Redacted<string>[];
export const CountryCodeList = S.Array(SensitiveString);
export type BeforeWaypointsList = number[];
export const BeforeWaypointsList = S.Array(S.Number);
export interface IsolineAllowOptions {
  Hot?: boolean;
  Hov?: boolean;
}
export const IsolineAllowOptions = S.suspend(() =>
  S.Struct({ Hot: S.optional(S.Boolean), Hov: S.optional(S.Boolean) }),
).annotations({
  identifier: "IsolineAllowOptions",
}) as any as S.Schema<IsolineAllowOptions>;
export interface IsolineGranularityOptions {
  MaxPoints?: number;
  MaxResolution?: number;
}
export const IsolineGranularityOptions = S.suspend(() =>
  S.Struct({
    MaxPoints: S.optional(S.Number),
    MaxResolution: S.optional(S.Number),
  }),
).annotations({
  identifier: "IsolineGranularityOptions",
}) as any as S.Schema<IsolineGranularityOptions>;
export interface IsolineMatchingOptions {
  NameHint?: string | redacted.Redacted<string>;
  OnRoadThreshold?: number;
  Radius?: number;
  Strategy?: string;
}
export const IsolineMatchingOptions = S.suspend(() =>
  S.Struct({
    NameHint: S.optional(SensitiveString),
    OnRoadThreshold: S.optional(S.Number),
    Radius: S.optional(S.Number),
    Strategy: S.optional(S.String),
  }),
).annotations({
  identifier: "IsolineMatchingOptions",
}) as any as S.Schema<IsolineMatchingOptions>;
export interface IsolineSideOfStreetOptions {
  Position: number[];
  UseWith?: string;
}
export const IsolineSideOfStreetOptions = S.suspend(() =>
  S.Struct({ Position: Position, UseWith: S.optional(S.String) }),
).annotations({
  identifier: "IsolineSideOfStreetOptions",
}) as any as S.Schema<IsolineSideOfStreetOptions>;
export interface IsolineOriginOptions {
  AvoidActionsForDistance?: number;
  Heading?: number;
  Matching?: IsolineMatchingOptions;
  SideOfStreet?: IsolineSideOfStreetOptions;
}
export const IsolineOriginOptions = S.suspend(() =>
  S.Struct({
    AvoidActionsForDistance: S.optional(S.Number),
    Heading: S.optional(S.Number),
    Matching: S.optional(IsolineMatchingOptions),
    SideOfStreet: S.optional(IsolineSideOfStreetOptions),
  }),
).annotations({
  identifier: "IsolineOriginOptions",
}) as any as S.Schema<IsolineOriginOptions>;
export interface IsolineThresholds {
  Distance?: number[];
  Time?: number[];
}
export const IsolineThresholds = S.suspend(() =>
  S.Struct({
    Distance: S.optional(DistanceThresholdList),
    Time: S.optional(TimeThresholdList),
  }),
).annotations({
  identifier: "IsolineThresholds",
}) as any as S.Schema<IsolineThresholds>;
export interface IsolineTrafficOptions {
  FlowEventThresholdOverride?: number;
  Usage?: string;
}
export const IsolineTrafficOptions = S.suspend(() =>
  S.Struct({
    FlowEventThresholdOverride: S.optional(S.Number),
    Usage: S.optional(S.String),
  }),
).annotations({
  identifier: "IsolineTrafficOptions",
}) as any as S.Schema<IsolineTrafficOptions>;
export interface RouteMatrixAllowOptions {
  Hot?: boolean;
  Hov?: boolean;
}
export const RouteMatrixAllowOptions = S.suspend(() =>
  S.Struct({ Hot: S.optional(S.Boolean), Hov: S.optional(S.Boolean) }),
).annotations({
  identifier: "RouteMatrixAllowOptions",
}) as any as S.Schema<RouteMatrixAllowOptions>;
export interface RouteMatrixExclusionOptions {
  Countries: string | redacted.Redacted<string>[];
}
export const RouteMatrixExclusionOptions = S.suspend(() =>
  S.Struct({ Countries: CountryCodeList }),
).annotations({
  identifier: "RouteMatrixExclusionOptions",
}) as any as S.Schema<RouteMatrixExclusionOptions>;
export interface RouteMatrixTrafficOptions {
  FlowEventThresholdOverride?: number;
  Usage?: string;
}
export const RouteMatrixTrafficOptions = S.suspend(() =>
  S.Struct({
    FlowEventThresholdOverride: S.optional(S.Number),
    Usage: S.optional(S.String),
  }),
).annotations({
  identifier: "RouteMatrixTrafficOptions",
}) as any as S.Schema<RouteMatrixTrafficOptions>;
export interface RouteAllowOptions {
  Hot?: boolean;
  Hov?: boolean;
}
export const RouteAllowOptions = S.suspend(() =>
  S.Struct({ Hot: S.optional(S.Boolean), Hov: S.optional(S.Boolean) }),
).annotations({
  identifier: "RouteAllowOptions",
}) as any as S.Schema<RouteAllowOptions>;
export interface RouteExclusionOptions {
  Countries: string | redacted.Redacted<string>[];
}
export const RouteExclusionOptions = S.suspend(() =>
  S.Struct({ Countries: CountryCodeList }),
).annotations({
  identifier: "RouteExclusionOptions",
}) as any as S.Schema<RouteExclusionOptions>;
export interface RouteMatchingOptions {
  NameHint?: string | redacted.Redacted<string>;
  OnRoadThreshold?: number;
  Radius?: number;
  Strategy?: string;
}
export const RouteMatchingOptions = S.suspend(() =>
  S.Struct({
    NameHint: S.optional(SensitiveString),
    OnRoadThreshold: S.optional(S.Number),
    Radius: S.optional(S.Number),
    Strategy: S.optional(S.String),
  }),
).annotations({
  identifier: "RouteMatchingOptions",
}) as any as S.Schema<RouteMatchingOptions>;
export interface RouteSideOfStreetOptions {
  Position: number[];
  UseWith?: string;
}
export const RouteSideOfStreetOptions = S.suspend(() =>
  S.Struct({ Position: Position, UseWith: S.optional(S.String) }),
).annotations({
  identifier: "RouteSideOfStreetOptions",
}) as any as S.Schema<RouteSideOfStreetOptions>;
export interface RouteOriginOptions {
  AvoidActionsForDistance?: number;
  AvoidUTurns?: boolean;
  Heading?: number;
  Matching?: RouteMatchingOptions;
  SideOfStreet?: RouteSideOfStreetOptions;
}
export const RouteOriginOptions = S.suspend(() =>
  S.Struct({
    AvoidActionsForDistance: S.optional(S.Number),
    AvoidUTurns: S.optional(S.Boolean),
    Heading: S.optional(S.Number),
    Matching: S.optional(RouteMatchingOptions),
    SideOfStreet: S.optional(RouteSideOfStreetOptions),
  }),
).annotations({
  identifier: "RouteOriginOptions",
}) as any as S.Schema<RouteOriginOptions>;
export interface RouteTrafficOptions {
  FlowEventThresholdOverride?: number;
  Usage?: string;
}
export const RouteTrafficOptions = S.suspend(() =>
  S.Struct({
    FlowEventThresholdOverride: S.optional(S.Number),
    Usage: S.optional(S.String),
  }),
).annotations({
  identifier: "RouteTrafficOptions",
}) as any as S.Schema<RouteTrafficOptions>;
export interface RouteWaypoint {
  AvoidActionsForDistance?: number;
  AvoidUTurns?: boolean;
  Heading?: number;
  Matching?: RouteMatchingOptions;
  PassThrough?: boolean;
  Position: number[];
  SideOfStreet?: RouteSideOfStreetOptions;
  StopDuration?: number;
}
export const RouteWaypoint = S.suspend(() =>
  S.Struct({
    AvoidActionsForDistance: S.optional(S.Number),
    AvoidUTurns: S.optional(S.Boolean),
    Heading: S.optional(S.Number),
    Matching: S.optional(RouteMatchingOptions),
    PassThrough: S.optional(S.Boolean),
    Position: Position,
    SideOfStreet: S.optional(RouteSideOfStreetOptions),
    StopDuration: S.optional(S.Number),
  }),
).annotations({
  identifier: "RouteWaypoint",
}) as any as S.Schema<RouteWaypoint>;
export type RouteWaypointList = RouteWaypoint[];
export const RouteWaypointList = S.Array(RouteWaypoint);
export interface WaypointOptimizationExclusionOptions {
  Countries: string | redacted.Redacted<string>[];
}
export const WaypointOptimizationExclusionOptions = S.suspend(() =>
  S.Struct({ Countries: CountryCodeList }),
).annotations({
  identifier: "WaypointOptimizationExclusionOptions",
}) as any as S.Schema<WaypointOptimizationExclusionOptions>;
export interface WaypointOptimizationOriginOptions {
  Id?: string;
}
export const WaypointOptimizationOriginOptions = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String) }),
).annotations({
  identifier: "WaypointOptimizationOriginOptions",
}) as any as S.Schema<WaypointOptimizationOriginOptions>;
export interface WaypointOptimizationTrafficOptions {
  Usage?: string;
}
export const WaypointOptimizationTrafficOptions = S.suspend(() =>
  S.Struct({ Usage: S.optional(S.String) }),
).annotations({
  identifier: "WaypointOptimizationTrafficOptions",
}) as any as S.Schema<WaypointOptimizationTrafficOptions>;
export interface WaypointOptimizationAccessHoursEntry {
  DayOfWeek: string | redacted.Redacted<string>;
  TimeOfDay: string | redacted.Redacted<string>;
}
export const WaypointOptimizationAccessHoursEntry = S.suspend(() =>
  S.Struct({ DayOfWeek: SensitiveString, TimeOfDay: SensitiveString }),
).annotations({
  identifier: "WaypointOptimizationAccessHoursEntry",
}) as any as S.Schema<WaypointOptimizationAccessHoursEntry>;
export interface WaypointOptimizationAccessHours {
  From: WaypointOptimizationAccessHoursEntry;
  To: WaypointOptimizationAccessHoursEntry;
}
export const WaypointOptimizationAccessHours = S.suspend(() =>
  S.Struct({
    From: WaypointOptimizationAccessHoursEntry,
    To: WaypointOptimizationAccessHoursEntry,
  }),
).annotations({
  identifier: "WaypointOptimizationAccessHours",
}) as any as S.Schema<WaypointOptimizationAccessHours>;
export interface WaypointOptimizationSideOfStreetOptions {
  Position: number[];
  UseWith?: string;
}
export const WaypointOptimizationSideOfStreetOptions = S.suspend(() =>
  S.Struct({ Position: Position, UseWith: S.optional(S.String) }),
).annotations({
  identifier: "WaypointOptimizationSideOfStreetOptions",
}) as any as S.Schema<WaypointOptimizationSideOfStreetOptions>;
export interface WaypointOptimizationWaypoint {
  AccessHours?: WaypointOptimizationAccessHours;
  AppointmentTime?: string | redacted.Redacted<string>;
  Before?: number[];
  Heading?: number;
  Id?: string;
  Position: number[];
  ServiceDuration?: number;
  SideOfStreet?: WaypointOptimizationSideOfStreetOptions;
}
export const WaypointOptimizationWaypoint = S.suspend(() =>
  S.Struct({
    AccessHours: S.optional(WaypointOptimizationAccessHours),
    AppointmentTime: S.optional(SensitiveString),
    Before: S.optional(BeforeWaypointsList),
    Heading: S.optional(S.Number),
    Id: S.optional(S.String),
    Position: Position,
    ServiceDuration: S.optional(S.Number),
    SideOfStreet: S.optional(WaypointOptimizationSideOfStreetOptions),
  }),
).annotations({
  identifier: "WaypointOptimizationWaypoint",
}) as any as S.Schema<WaypointOptimizationWaypoint>;
export type WaypointOptimizationWaypointList = WaypointOptimizationWaypoint[];
export const WaypointOptimizationWaypointList = S.Array(
  WaypointOptimizationWaypoint,
);
export interface RoadSnapTracePoint {
  Heading?: number;
  Position: number[];
  Speed?: number;
  Timestamp?: string | redacted.Redacted<string>;
}
export const RoadSnapTracePoint = S.suspend(() =>
  S.Struct({
    Heading: S.optional(S.Number),
    Position: Position,
    Speed: S.optional(S.Number),
    Timestamp: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "RoadSnapTracePoint",
}) as any as S.Schema<RoadSnapTracePoint>;
export type RoadSnapTracePointList = RoadSnapTracePoint[];
export const RoadSnapTracePointList = S.Array(RoadSnapTracePoint);
export type IsolineHazardousCargoTypeList =
  | string
  | redacted.Redacted<string>[];
export const IsolineHazardousCargoTypeList = S.Array(SensitiveString);
export type BoundingBox = number[];
export const BoundingBox = S.Array(S.Number);
export type LinearRing = number[][];
export const LinearRing = S.Array(Position);
export type LinearRings = number[][][];
export const LinearRings = S.Array(LinearRing);
export type RouteMatrixHazardousCargoTypeList =
  | string
  | redacted.Redacted<string>[];
export const RouteMatrixHazardousCargoTypeList = S.Array(SensitiveString);
export type RouteHazardousCargoTypeList = string | redacted.Redacted<string>[];
export const RouteHazardousCargoTypeList = S.Array(SensitiveString);
export type WaypointOptimizationHazardousCargoTypeList =
  | string
  | redacted.Redacted<string>[];
export const WaypointOptimizationHazardousCargoTypeList =
  S.Array(SensitiveString);
export type RoadSnapHazardousCargoTypeList =
  | string
  | redacted.Redacted<string>[];
export const RoadSnapHazardousCargoTypeList = S.Array(SensitiveString);
export interface IsolineAvoidanceZoneCategory {
  Category?: string;
}
export const IsolineAvoidanceZoneCategory = S.suspend(() =>
  S.Struct({ Category: S.optional(S.String) }),
).annotations({
  identifier: "IsolineAvoidanceZoneCategory",
}) as any as S.Schema<IsolineAvoidanceZoneCategory>;
export type IsolineAvoidanceZoneCategoryList = IsolineAvoidanceZoneCategory[];
export const IsolineAvoidanceZoneCategoryList = S.Array(
  IsolineAvoidanceZoneCategory,
);
export interface IsolineVehicleLicensePlate {
  LastCharacter?: string;
}
export const IsolineVehicleLicensePlate = S.suspend(() =>
  S.Struct({ LastCharacter: S.optional(S.String) }),
).annotations({
  identifier: "IsolineVehicleLicensePlate",
}) as any as S.Schema<IsolineVehicleLicensePlate>;
export interface IsolineScooterOptions {
  EngineType?: string | redacted.Redacted<string>;
  LicensePlate?: IsolineVehicleLicensePlate;
  MaxSpeed?: number;
  Occupancy?: number;
}
export const IsolineScooterOptions = S.suspend(() =>
  S.Struct({
    EngineType: S.optional(SensitiveString),
    LicensePlate: S.optional(IsolineVehicleLicensePlate),
    MaxSpeed: S.optional(S.Number),
    Occupancy: S.optional(S.Number),
  }),
).annotations({
  identifier: "IsolineScooterOptions",
}) as any as S.Schema<IsolineScooterOptions>;
export interface RouteMatrixAvoidanceZoneCategory {
  Category?: string | redacted.Redacted<string>;
}
export const RouteMatrixAvoidanceZoneCategory = S.suspend(() =>
  S.Struct({ Category: S.optional(SensitiveString) }),
).annotations({
  identifier: "RouteMatrixAvoidanceZoneCategory",
}) as any as S.Schema<RouteMatrixAvoidanceZoneCategory>;
export type RouteMatrixAvoidanceZoneCategoryList =
  RouteMatrixAvoidanceZoneCategory[];
export const RouteMatrixAvoidanceZoneCategoryList = S.Array(
  RouteMatrixAvoidanceZoneCategory,
);
export interface RouteMatrixMatchingOptions {
  NameHint?: string | redacted.Redacted<string>;
  OnRoadThreshold?: number;
  Radius?: number;
  Strategy?: string;
}
export const RouteMatrixMatchingOptions = S.suspend(() =>
  S.Struct({
    NameHint: S.optional(SensitiveString),
    OnRoadThreshold: S.optional(S.Number),
    Radius: S.optional(S.Number),
    Strategy: S.optional(S.String),
  }),
).annotations({
  identifier: "RouteMatrixMatchingOptions",
}) as any as S.Schema<RouteMatrixMatchingOptions>;
export interface RouteMatrixSideOfStreetOptions {
  Position: number[];
  UseWith?: string;
}
export const RouteMatrixSideOfStreetOptions = S.suspend(() =>
  S.Struct({ Position: Position, UseWith: S.optional(S.String) }),
).annotations({
  identifier: "RouteMatrixSideOfStreetOptions",
}) as any as S.Schema<RouteMatrixSideOfStreetOptions>;
export interface RouteMatrixOriginOptions {
  AvoidActionsForDistance?: number;
  Heading?: number;
  Matching?: RouteMatrixMatchingOptions;
  SideOfStreet?: RouteMatrixSideOfStreetOptions;
}
export const RouteMatrixOriginOptions = S.suspend(() =>
  S.Struct({
    AvoidActionsForDistance: S.optional(S.Number),
    Heading: S.optional(S.Number),
    Matching: S.optional(RouteMatrixMatchingOptions),
    SideOfStreet: S.optional(RouteMatrixSideOfStreetOptions),
  }),
).annotations({
  identifier: "RouteMatrixOriginOptions",
}) as any as S.Schema<RouteMatrixOriginOptions>;
export interface RouteMatrixVehicleLicensePlate {
  LastCharacter?: string;
}
export const RouteMatrixVehicleLicensePlate = S.suspend(() =>
  S.Struct({ LastCharacter: S.optional(S.String) }),
).annotations({
  identifier: "RouteMatrixVehicleLicensePlate",
}) as any as S.Schema<RouteMatrixVehicleLicensePlate>;
export interface RouteMatrixScooterOptions {
  LicensePlate?: RouteMatrixVehicleLicensePlate;
  MaxSpeed?: number;
  Occupancy?: number;
}
export const RouteMatrixScooterOptions = S.suspend(() =>
  S.Struct({
    LicensePlate: S.optional(RouteMatrixVehicleLicensePlate),
    MaxSpeed: S.optional(S.Number),
    Occupancy: S.optional(S.Number),
  }),
).annotations({
  identifier: "RouteMatrixScooterOptions",
}) as any as S.Schema<RouteMatrixScooterOptions>;
export interface RouteAvoidanceZoneCategory {
  Category: string | redacted.Redacted<string>;
}
export const RouteAvoidanceZoneCategory = S.suspend(() =>
  S.Struct({ Category: SensitiveString }),
).annotations({
  identifier: "RouteAvoidanceZoneCategory",
}) as any as S.Schema<RouteAvoidanceZoneCategory>;
export type RouteAvoidanceZoneCategoryList = RouteAvoidanceZoneCategory[];
export const RouteAvoidanceZoneCategoryList = S.Array(
  RouteAvoidanceZoneCategory,
);
export interface RouteDriverScheduleInterval {
  DriveDuration: number;
  RestDuration: number;
}
export const RouteDriverScheduleInterval = S.suspend(() =>
  S.Struct({ DriveDuration: S.Number, RestDuration: S.Number }),
).annotations({
  identifier: "RouteDriverScheduleInterval",
}) as any as S.Schema<RouteDriverScheduleInterval>;
export type RouteDriverScheduleIntervalList = RouteDriverScheduleInterval[];
export const RouteDriverScheduleIntervalList = S.Array(
  RouteDriverScheduleInterval,
);
export interface RouteEmissionType {
  Co2EmissionClass?: string | redacted.Redacted<string>;
  Type: string | redacted.Redacted<string>;
}
export const RouteEmissionType = S.suspend(() =>
  S.Struct({
    Co2EmissionClass: S.optional(SensitiveString),
    Type: SensitiveString,
  }),
).annotations({
  identifier: "RouteEmissionType",
}) as any as S.Schema<RouteEmissionType>;
export interface RoutePedestrianOptions {
  Speed?: number;
}
export const RoutePedestrianOptions = S.suspend(() =>
  S.Struct({ Speed: S.optional(S.Number) }),
).annotations({
  identifier: "RoutePedestrianOptions",
}) as any as S.Schema<RoutePedestrianOptions>;
export interface RouteVehicleLicensePlate {
  LastCharacter?: string | redacted.Redacted<string>;
}
export const RouteVehicleLicensePlate = S.suspend(() =>
  S.Struct({ LastCharacter: S.optional(SensitiveString) }),
).annotations({
  identifier: "RouteVehicleLicensePlate",
}) as any as S.Schema<RouteVehicleLicensePlate>;
export interface RouteScooterOptions {
  EngineType?: string | redacted.Redacted<string>;
  LicensePlate?: RouteVehicleLicensePlate;
  MaxSpeed?: number;
  Occupancy?: number;
}
export const RouteScooterOptions = S.suspend(() =>
  S.Struct({
    EngineType: S.optional(SensitiveString),
    LicensePlate: S.optional(RouteVehicleLicensePlate),
    MaxSpeed: S.optional(S.Number),
    Occupancy: S.optional(S.Number),
  }),
).annotations({
  identifier: "RouteScooterOptions",
}) as any as S.Schema<RouteScooterOptions>;
export interface WaypointOptimizationDrivingDistanceOptions {
  DrivingDistance: number;
}
export const WaypointOptimizationDrivingDistanceOptions = S.suspend(() =>
  S.Struct({ DrivingDistance: S.Number }),
).annotations({
  identifier: "WaypointOptimizationDrivingDistanceOptions",
}) as any as S.Schema<WaypointOptimizationDrivingDistanceOptions>;
export interface WaypointOptimizationRestProfile {
  Profile: string | redacted.Redacted<string>;
}
export const WaypointOptimizationRestProfile = S.suspend(() =>
  S.Struct({ Profile: SensitiveString }),
).annotations({
  identifier: "WaypointOptimizationRestProfile",
}) as any as S.Schema<WaypointOptimizationRestProfile>;
export interface WaypointOptimizationPedestrianOptions {
  Speed?: number;
}
export const WaypointOptimizationPedestrianOptions = S.suspend(() =>
  S.Struct({ Speed: S.optional(S.Number) }),
).annotations({
  identifier: "WaypointOptimizationPedestrianOptions",
}) as any as S.Schema<WaypointOptimizationPedestrianOptions>;
export type PolylineRingList = string | redacted.Redacted<string>[];
export const PolylineRingList = S.Array(SensitiveString);
export interface IsolineDestinationOptions {
  AvoidActionsForDistance?: number;
  Heading?: number;
  Matching?: IsolineMatchingOptions;
  SideOfStreet?: IsolineSideOfStreetOptions;
}
export const IsolineDestinationOptions = S.suspend(() =>
  S.Struct({
    AvoidActionsForDistance: S.optional(S.Number),
    Heading: S.optional(S.Number),
    Matching: S.optional(IsolineMatchingOptions),
    SideOfStreet: S.optional(IsolineSideOfStreetOptions),
  }),
).annotations({
  identifier: "IsolineDestinationOptions",
}) as any as S.Schema<IsolineDestinationOptions>;
export interface RouteMatrixOrigin {
  Options?: RouteMatrixOriginOptions;
  Position: number[];
}
export const RouteMatrixOrigin = S.suspend(() =>
  S.Struct({
    Options: S.optional(RouteMatrixOriginOptions),
    Position: Position,
  }),
).annotations({
  identifier: "RouteMatrixOrigin",
}) as any as S.Schema<RouteMatrixOrigin>;
export type RouteMatrixOriginList = RouteMatrixOrigin[];
export const RouteMatrixOriginList = S.Array(RouteMatrixOrigin);
export interface RouteDestinationOptions {
  AvoidActionsForDistance?: number;
  AvoidUTurns?: boolean;
  Heading?: number;
  Matching?: RouteMatchingOptions;
  SideOfStreet?: RouteSideOfStreetOptions;
  StopDuration?: number;
}
export const RouteDestinationOptions = S.suspend(() =>
  S.Struct({
    AvoidActionsForDistance: S.optional(S.Number),
    AvoidUTurns: S.optional(S.Boolean),
    Heading: S.optional(S.Number),
    Matching: S.optional(RouteMatchingOptions),
    SideOfStreet: S.optional(RouteSideOfStreetOptions),
    StopDuration: S.optional(S.Number),
  }),
).annotations({
  identifier: "RouteDestinationOptions",
}) as any as S.Schema<RouteDestinationOptions>;
export interface RouteDriverOptions {
  Schedule?: RouteDriverScheduleInterval[];
}
export const RouteDriverOptions = S.suspend(() =>
  S.Struct({ Schedule: S.optional(RouteDriverScheduleIntervalList) }),
).annotations({
  identifier: "RouteDriverOptions",
}) as any as S.Schema<RouteDriverOptions>;
export interface RouteTollOptions {
  AllTransponders?: boolean;
  AllVignettes?: boolean;
  Currency?: string;
  EmissionType?: RouteEmissionType;
  VehicleCategory?: string | redacted.Redacted<string>;
}
export const RouteTollOptions = S.suspend(() =>
  S.Struct({
    AllTransponders: S.optional(S.Boolean),
    AllVignettes: S.optional(S.Boolean),
    Currency: S.optional(S.String),
    EmissionType: S.optional(RouteEmissionType),
    VehicleCategory: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "RouteTollOptions",
}) as any as S.Schema<RouteTollOptions>;
export interface WaypointOptimizationClusteringOptions {
  Algorithm: string | redacted.Redacted<string>;
  DrivingDistanceOptions?: WaypointOptimizationDrivingDistanceOptions;
}
export const WaypointOptimizationClusteringOptions = S.suspend(() =>
  S.Struct({
    Algorithm: SensitiveString,
    DrivingDistanceOptions: S.optional(
      WaypointOptimizationDrivingDistanceOptions,
    ),
  }),
).annotations({
  identifier: "WaypointOptimizationClusteringOptions",
}) as any as S.Schema<WaypointOptimizationClusteringOptions>;
export interface IsolineTrailerOptions {
  AxleCount?: number;
  TrailerCount?: number;
}
export const IsolineTrailerOptions = S.suspend(() =>
  S.Struct({
    AxleCount: S.optional(S.Number),
    TrailerCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "IsolineTrailerOptions",
}) as any as S.Schema<IsolineTrailerOptions>;
export interface WeightPerAxleGroup {
  Single?: number;
  Tandem?: number;
  Triple?: number;
  Quad?: number;
  Quint?: number;
}
export const WeightPerAxleGroup = S.suspend(() =>
  S.Struct({
    Single: S.optional(S.Number),
    Tandem: S.optional(S.Number),
    Triple: S.optional(S.Number),
    Quad: S.optional(S.Number),
    Quint: S.optional(S.Number),
  }),
).annotations({
  identifier: "WeightPerAxleGroup",
}) as any as S.Schema<WeightPerAxleGroup>;
export interface RouteMatrixAvoidanceAreaGeometry {
  BoundingBox?: number[];
  Polygon?: number[][][];
  PolylinePolygon?: string | redacted.Redacted<string>[];
}
export const RouteMatrixAvoidanceAreaGeometry = S.suspend(() =>
  S.Struct({
    BoundingBox: S.optional(BoundingBox),
    Polygon: S.optional(LinearRings),
    PolylinePolygon: S.optional(PolylineRingList),
  }),
).annotations({
  identifier: "RouteMatrixAvoidanceAreaGeometry",
}) as any as S.Schema<RouteMatrixAvoidanceAreaGeometry>;
export interface RouteMatrixAutoCircle {
  Margin?: number;
  MaxRadius?: number;
}
export const RouteMatrixAutoCircle = S.suspend(() =>
  S.Struct({ Margin: S.optional(S.Number), MaxRadius: S.optional(S.Number) }),
).annotations({
  identifier: "RouteMatrixAutoCircle",
}) as any as S.Schema<RouteMatrixAutoCircle>;
export interface Circle {
  Center: number[];
  Radius: number;
}
export const Circle = S.suspend(() =>
  S.Struct({ Center: Position, Radius: S.Number }),
).annotations({ identifier: "Circle" }) as any as S.Schema<Circle>;
export interface RouteMatrixTrailerOptions {
  TrailerCount?: number;
}
export const RouteMatrixTrailerOptions = S.suspend(() =>
  S.Struct({ TrailerCount: S.optional(S.Number) }),
).annotations({
  identifier: "RouteMatrixTrailerOptions",
}) as any as S.Schema<RouteMatrixTrailerOptions>;
export type LineString = number[][];
export const LineString = S.Array(Position);
export interface Corridor {
  LineString: number[][];
  Radius: number;
}
export const Corridor = S.suspend(() =>
  S.Struct({ LineString: LineString, Radius: S.Number }),
).annotations({ identifier: "Corridor" }) as any as S.Schema<Corridor>;
export interface PolylineCorridor {
  Polyline: string | redacted.Redacted<string>;
  Radius: number;
}
export const PolylineCorridor = S.suspend(() =>
  S.Struct({ Polyline: SensitiveString, Radius: S.Number }),
).annotations({
  identifier: "PolylineCorridor",
}) as any as S.Schema<PolylineCorridor>;
export interface RouteAvoidanceAreaGeometry {
  Corridor?: Corridor;
  BoundingBox?: number[];
  Polygon?: number[][][];
  PolylineCorridor?: PolylineCorridor;
  PolylinePolygon?: string | redacted.Redacted<string>[];
}
export const RouteAvoidanceAreaGeometry = S.suspend(() =>
  S.Struct({
    Corridor: S.optional(Corridor),
    BoundingBox: S.optional(BoundingBox),
    Polygon: S.optional(LinearRings),
    PolylineCorridor: S.optional(PolylineCorridor),
    PolylinePolygon: S.optional(PolylineRingList),
  }),
).annotations({
  identifier: "RouteAvoidanceAreaGeometry",
}) as any as S.Schema<RouteAvoidanceAreaGeometry>;
export type RouteAvoidanceAreaGeometryList = RouteAvoidanceAreaGeometry[];
export const RouteAvoidanceAreaGeometryList = S.Array(
  RouteAvoidanceAreaGeometry,
);
export interface RouteTrailerOptions {
  AxleCount?: number;
  TrailerCount?: number;
}
export const RouteTrailerOptions = S.suspend(() =>
  S.Struct({
    AxleCount: S.optional(S.Number),
    TrailerCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "RouteTrailerOptions",
}) as any as S.Schema<RouteTrailerOptions>;
export interface WaypointOptimizationAvoidanceAreaGeometry {
  BoundingBox?: number[];
}
export const WaypointOptimizationAvoidanceAreaGeometry = S.suspend(() =>
  S.Struct({ BoundingBox: S.optional(BoundingBox) }),
).annotations({
  identifier: "WaypointOptimizationAvoidanceAreaGeometry",
}) as any as S.Schema<WaypointOptimizationAvoidanceAreaGeometry>;
export interface WaypointOptimizationRestCycleDurations {
  RestDuration: number;
  WorkDuration: number;
}
export const WaypointOptimizationRestCycleDurations = S.suspend(() =>
  S.Struct({ RestDuration: S.Number, WorkDuration: S.Number }),
).annotations({
  identifier: "WaypointOptimizationRestCycleDurations",
}) as any as S.Schema<WaypointOptimizationRestCycleDurations>;
export interface WaypointOptimizationTrailerOptions {
  TrailerCount?: number;
}
export const WaypointOptimizationTrailerOptions = S.suspend(() =>
  S.Struct({ TrailerCount: S.optional(S.Number) }),
).annotations({
  identifier: "WaypointOptimizationTrailerOptions",
}) as any as S.Schema<WaypointOptimizationTrailerOptions>;
export interface RoadSnapTrailerOptions {
  TrailerCount?: number;
}
export const RoadSnapTrailerOptions = S.suspend(() =>
  S.Struct({ TrailerCount: S.optional(S.Number) }),
).annotations({
  identifier: "RoadSnapTrailerOptions",
}) as any as S.Schema<RoadSnapTrailerOptions>;
export interface IsolineCarOptions {
  EngineType?: string | redacted.Redacted<string>;
  LicensePlate?: IsolineVehicleLicensePlate;
  MaxSpeed?: number;
  Occupancy?: number;
}
export const IsolineCarOptions = S.suspend(() =>
  S.Struct({
    EngineType: S.optional(SensitiveString),
    LicensePlate: S.optional(IsolineVehicleLicensePlate),
    MaxSpeed: S.optional(S.Number),
    Occupancy: S.optional(S.Number),
  }),
).annotations({
  identifier: "IsolineCarOptions",
}) as any as S.Schema<IsolineCarOptions>;
export interface IsolineTruckOptions {
  AxleCount?: number;
  EngineType?: string | redacted.Redacted<string>;
  GrossWeight?: number;
  HazardousCargos?: string | redacted.Redacted<string>[];
  Height?: number;
  HeightAboveFirstAxle?: number;
  KpraLength?: number;
  Length?: number;
  LicensePlate?: IsolineVehicleLicensePlate;
  MaxSpeed?: number;
  Occupancy?: number;
  PayloadCapacity?: number;
  TireCount?: number;
  Trailer?: IsolineTrailerOptions;
  TruckType?: string;
  TunnelRestrictionCode?: string | redacted.Redacted<string>;
  WeightPerAxle?: number;
  WeightPerAxleGroup?: WeightPerAxleGroup;
  Width?: number;
}
export const IsolineTruckOptions = S.suspend(() =>
  S.Struct({
    AxleCount: S.optional(S.Number),
    EngineType: S.optional(SensitiveString),
    GrossWeight: S.optional(S.Number),
    HazardousCargos: S.optional(IsolineHazardousCargoTypeList),
    Height: S.optional(S.Number),
    HeightAboveFirstAxle: S.optional(S.Number),
    KpraLength: S.optional(S.Number),
    Length: S.optional(S.Number),
    LicensePlate: S.optional(IsolineVehicleLicensePlate),
    MaxSpeed: S.optional(S.Number),
    Occupancy: S.optional(S.Number),
    PayloadCapacity: S.optional(S.Number),
    TireCount: S.optional(S.Number),
    Trailer: S.optional(IsolineTrailerOptions),
    TruckType: S.optional(S.String),
    TunnelRestrictionCode: S.optional(SensitiveString),
    WeightPerAxle: S.optional(S.Number),
    WeightPerAxleGroup: S.optional(WeightPerAxleGroup),
    Width: S.optional(S.Number),
  }),
).annotations({
  identifier: "IsolineTruckOptions",
}) as any as S.Schema<IsolineTruckOptions>;
export interface RouteMatrixAvoidanceArea {
  Geometry: RouteMatrixAvoidanceAreaGeometry;
}
export const RouteMatrixAvoidanceArea = S.suspend(() =>
  S.Struct({ Geometry: RouteMatrixAvoidanceAreaGeometry }),
).annotations({
  identifier: "RouteMatrixAvoidanceArea",
}) as any as S.Schema<RouteMatrixAvoidanceArea>;
export type RouteMatrixAvoidanceAreaList = RouteMatrixAvoidanceArea[];
export const RouteMatrixAvoidanceAreaList = S.Array(RouteMatrixAvoidanceArea);
export interface RouteMatrixDestinationOptions {
  AvoidActionsForDistance?: number;
  Heading?: number;
  Matching?: RouteMatrixMatchingOptions;
  SideOfStreet?: RouteMatrixSideOfStreetOptions;
}
export const RouteMatrixDestinationOptions = S.suspend(() =>
  S.Struct({
    AvoidActionsForDistance: S.optional(S.Number),
    Heading: S.optional(S.Number),
    Matching: S.optional(RouteMatrixMatchingOptions),
    SideOfStreet: S.optional(RouteMatrixSideOfStreetOptions),
  }),
).annotations({
  identifier: "RouteMatrixDestinationOptions",
}) as any as S.Schema<RouteMatrixDestinationOptions>;
export interface RouteMatrixBoundaryGeometry {
  AutoCircle?: RouteMatrixAutoCircle;
  Circle?: Circle;
  BoundingBox?: number[];
  Polygon?: number[][][];
}
export const RouteMatrixBoundaryGeometry = S.suspend(() =>
  S.Struct({
    AutoCircle: S.optional(RouteMatrixAutoCircle),
    Circle: S.optional(Circle),
    BoundingBox: S.optional(BoundingBox),
    Polygon: S.optional(LinearRings),
  }),
).annotations({
  identifier: "RouteMatrixBoundaryGeometry",
}) as any as S.Schema<RouteMatrixBoundaryGeometry>;
export interface RouteMatrixCarOptions {
  LicensePlate?: RouteMatrixVehicleLicensePlate;
  MaxSpeed?: number;
  Occupancy?: number;
}
export const RouteMatrixCarOptions = S.suspend(() =>
  S.Struct({
    LicensePlate: S.optional(RouteMatrixVehicleLicensePlate),
    MaxSpeed: S.optional(S.Number),
    Occupancy: S.optional(S.Number),
  }),
).annotations({
  identifier: "RouteMatrixCarOptions",
}) as any as S.Schema<RouteMatrixCarOptions>;
export interface RouteMatrixTruckOptions {
  AxleCount?: number;
  GrossWeight?: number;
  HazardousCargos?: string | redacted.Redacted<string>[];
  Height?: number;
  KpraLength?: number;
  Length?: number;
  LicensePlate?: RouteMatrixVehicleLicensePlate;
  MaxSpeed?: number;
  Occupancy?: number;
  PayloadCapacity?: number;
  Trailer?: RouteMatrixTrailerOptions;
  TruckType?: string | redacted.Redacted<string>;
  TunnelRestrictionCode?: string | redacted.Redacted<string>;
  WeightPerAxle?: number;
  WeightPerAxleGroup?: WeightPerAxleGroup;
  Width?: number;
}
export const RouteMatrixTruckOptions = S.suspend(() =>
  S.Struct({
    AxleCount: S.optional(S.Number),
    GrossWeight: S.optional(S.Number),
    HazardousCargos: S.optional(RouteMatrixHazardousCargoTypeList),
    Height: S.optional(S.Number),
    KpraLength: S.optional(S.Number),
    Length: S.optional(S.Number),
    LicensePlate: S.optional(RouteMatrixVehicleLicensePlate),
    MaxSpeed: S.optional(S.Number),
    Occupancy: S.optional(S.Number),
    PayloadCapacity: S.optional(S.Number),
    Trailer: S.optional(RouteMatrixTrailerOptions),
    TruckType: S.optional(SensitiveString),
    TunnelRestrictionCode: S.optional(SensitiveString),
    WeightPerAxle: S.optional(S.Number),
    WeightPerAxleGroup: S.optional(WeightPerAxleGroup),
    Width: S.optional(S.Number),
  }),
).annotations({
  identifier: "RouteMatrixTruckOptions",
}) as any as S.Schema<RouteMatrixTruckOptions>;
export interface RouteAvoidanceArea {
  Except?: RouteAvoidanceAreaGeometry[];
  Geometry: RouteAvoidanceAreaGeometry;
}
export const RouteAvoidanceArea = S.suspend(() =>
  S.Struct({
    Except: S.optional(RouteAvoidanceAreaGeometryList),
    Geometry: RouteAvoidanceAreaGeometry,
  }),
).annotations({
  identifier: "RouteAvoidanceArea",
}) as any as S.Schema<RouteAvoidanceArea>;
export type RouteAvoidanceAreaList = RouteAvoidanceArea[];
export const RouteAvoidanceAreaList = S.Array(RouteAvoidanceArea);
export interface RouteCarOptions {
  EngineType?: string | redacted.Redacted<string>;
  LicensePlate?: RouteVehicleLicensePlate;
  MaxSpeed?: number;
  Occupancy?: number;
}
export const RouteCarOptions = S.suspend(() =>
  S.Struct({
    EngineType: S.optional(SensitiveString),
    LicensePlate: S.optional(RouteVehicleLicensePlate),
    MaxSpeed: S.optional(S.Number),
    Occupancy: S.optional(S.Number),
  }),
).annotations({
  identifier: "RouteCarOptions",
}) as any as S.Schema<RouteCarOptions>;
export interface RouteTruckOptions {
  AxleCount?: number;
  EngineType?: string | redacted.Redacted<string>;
  GrossWeight?: number;
  HazardousCargos?: string | redacted.Redacted<string>[];
  Height?: number;
  HeightAboveFirstAxle?: number;
  KpraLength?: number;
  Length?: number;
  LicensePlate?: RouteVehicleLicensePlate;
  MaxSpeed?: number;
  Occupancy?: number;
  PayloadCapacity?: number;
  TireCount?: number;
  Trailer?: RouteTrailerOptions;
  TruckType?: string | redacted.Redacted<string>;
  TunnelRestrictionCode?: string | redacted.Redacted<string>;
  WeightPerAxle?: number;
  WeightPerAxleGroup?: WeightPerAxleGroup;
  Width?: number;
}
export const RouteTruckOptions = S.suspend(() =>
  S.Struct({
    AxleCount: S.optional(S.Number),
    EngineType: S.optional(SensitiveString),
    GrossWeight: S.optional(S.Number),
    HazardousCargos: S.optional(RouteHazardousCargoTypeList),
    Height: S.optional(S.Number),
    HeightAboveFirstAxle: S.optional(S.Number),
    KpraLength: S.optional(S.Number),
    Length: S.optional(S.Number),
    LicensePlate: S.optional(RouteVehicleLicensePlate),
    MaxSpeed: S.optional(S.Number),
    Occupancy: S.optional(S.Number),
    PayloadCapacity: S.optional(S.Number),
    TireCount: S.optional(S.Number),
    Trailer: S.optional(RouteTrailerOptions),
    TruckType: S.optional(SensitiveString),
    TunnelRestrictionCode: S.optional(SensitiveString),
    WeightPerAxle: S.optional(S.Number),
    WeightPerAxleGroup: S.optional(WeightPerAxleGroup),
    Width: S.optional(S.Number),
  }),
).annotations({
  identifier: "RouteTruckOptions",
}) as any as S.Schema<RouteTruckOptions>;
export interface WaypointOptimizationAvoidanceArea {
  Geometry: WaypointOptimizationAvoidanceAreaGeometry;
}
export const WaypointOptimizationAvoidanceArea = S.suspend(() =>
  S.Struct({ Geometry: WaypointOptimizationAvoidanceAreaGeometry }),
).annotations({
  identifier: "WaypointOptimizationAvoidanceArea",
}) as any as S.Schema<WaypointOptimizationAvoidanceArea>;
export type WaypointOptimizationAvoidanceAreaList =
  WaypointOptimizationAvoidanceArea[];
export const WaypointOptimizationAvoidanceAreaList = S.Array(
  WaypointOptimizationAvoidanceArea,
);
export interface WaypointOptimizationRestCycles {
  LongCycle: WaypointOptimizationRestCycleDurations;
  ShortCycle: WaypointOptimizationRestCycleDurations;
}
export const WaypointOptimizationRestCycles = S.suspend(() =>
  S.Struct({
    LongCycle: WaypointOptimizationRestCycleDurations,
    ShortCycle: WaypointOptimizationRestCycleDurations,
  }),
).annotations({
  identifier: "WaypointOptimizationRestCycles",
}) as any as S.Schema<WaypointOptimizationRestCycles>;
export interface WaypointOptimizationTruckOptions {
  GrossWeight?: number;
  HazardousCargos?: string | redacted.Redacted<string>[];
  Height?: number;
  Length?: number;
  Trailer?: WaypointOptimizationTrailerOptions;
  TruckType?: string | redacted.Redacted<string>;
  TunnelRestrictionCode?: string | redacted.Redacted<string>;
  WeightPerAxle?: number;
  Width?: number;
}
export const WaypointOptimizationTruckOptions = S.suspend(() =>
  S.Struct({
    GrossWeight: S.optional(S.Number),
    HazardousCargos: S.optional(WaypointOptimizationHazardousCargoTypeList),
    Height: S.optional(S.Number),
    Length: S.optional(S.Number),
    Trailer: S.optional(WaypointOptimizationTrailerOptions),
    TruckType: S.optional(SensitiveString),
    TunnelRestrictionCode: S.optional(SensitiveString),
    WeightPerAxle: S.optional(S.Number),
    Width: S.optional(S.Number),
  }),
).annotations({
  identifier: "WaypointOptimizationTruckOptions",
}) as any as S.Schema<WaypointOptimizationTruckOptions>;
export interface RoadSnapTruckOptions {
  GrossWeight?: number;
  HazardousCargos?: string | redacted.Redacted<string>[];
  Height?: number;
  Length?: number;
  Trailer?: RoadSnapTrailerOptions;
  TunnelRestrictionCode?: string | redacted.Redacted<string>;
  Width?: number;
}
export const RoadSnapTruckOptions = S.suspend(() =>
  S.Struct({
    GrossWeight: S.optional(S.Number),
    HazardousCargos: S.optional(RoadSnapHazardousCargoTypeList),
    Height: S.optional(S.Number),
    Length: S.optional(S.Number),
    Trailer: S.optional(RoadSnapTrailerOptions),
    TunnelRestrictionCode: S.optional(SensitiveString),
    Width: S.optional(S.Number),
  }),
).annotations({
  identifier: "RoadSnapTruckOptions",
}) as any as S.Schema<RoadSnapTruckOptions>;
export interface IsolineTravelModeOptions {
  Car?: IsolineCarOptions;
  Scooter?: IsolineScooterOptions;
  Truck?: IsolineTruckOptions;
}
export const IsolineTravelModeOptions = S.suspend(() =>
  S.Struct({
    Car: S.optional(IsolineCarOptions),
    Scooter: S.optional(IsolineScooterOptions),
    Truck: S.optional(IsolineTruckOptions),
  }),
).annotations({
  identifier: "IsolineTravelModeOptions",
}) as any as S.Schema<IsolineTravelModeOptions>;
export interface RouteMatrixAvoidanceOptions {
  Areas?: RouteMatrixAvoidanceArea[];
  CarShuttleTrains?: boolean;
  ControlledAccessHighways?: boolean;
  DirtRoads?: boolean;
  Ferries?: boolean;
  TollRoads?: boolean;
  TollTransponders?: boolean;
  TruckRoadTypes?: string | redacted.Redacted<string>[];
  Tunnels?: boolean;
  UTurns?: boolean;
  ZoneCategories?: RouteMatrixAvoidanceZoneCategory[];
}
export const RouteMatrixAvoidanceOptions = S.suspend(() =>
  S.Struct({
    Areas: S.optional(RouteMatrixAvoidanceAreaList),
    CarShuttleTrains: S.optional(S.Boolean),
    ControlledAccessHighways: S.optional(S.Boolean),
    DirtRoads: S.optional(S.Boolean),
    Ferries: S.optional(S.Boolean),
    TollRoads: S.optional(S.Boolean),
    TollTransponders: S.optional(S.Boolean),
    TruckRoadTypes: S.optional(TruckRoadTypeList),
    Tunnels: S.optional(S.Boolean),
    UTurns: S.optional(S.Boolean),
    ZoneCategories: S.optional(RouteMatrixAvoidanceZoneCategoryList),
  }),
).annotations({
  identifier: "RouteMatrixAvoidanceOptions",
}) as any as S.Schema<RouteMatrixAvoidanceOptions>;
export interface RouteMatrixDestination {
  Options?: RouteMatrixDestinationOptions;
  Position: number[];
}
export const RouteMatrixDestination = S.suspend(() =>
  S.Struct({
    Options: S.optional(RouteMatrixDestinationOptions),
    Position: Position,
  }),
).annotations({
  identifier: "RouteMatrixDestination",
}) as any as S.Schema<RouteMatrixDestination>;
export type RouteMatrixDestinationList = RouteMatrixDestination[];
export const RouteMatrixDestinationList = S.Array(RouteMatrixDestination);
export interface RouteMatrixBoundary {
  Geometry?: RouteMatrixBoundaryGeometry;
  Unbounded?: boolean;
}
export const RouteMatrixBoundary = S.suspend(() =>
  S.Struct({
    Geometry: S.optional(RouteMatrixBoundaryGeometry),
    Unbounded: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "RouteMatrixBoundary",
}) as any as S.Schema<RouteMatrixBoundary>;
export interface RouteMatrixTravelModeOptions {
  Car?: RouteMatrixCarOptions;
  Scooter?: RouteMatrixScooterOptions;
  Truck?: RouteMatrixTruckOptions;
}
export const RouteMatrixTravelModeOptions = S.suspend(() =>
  S.Struct({
    Car: S.optional(RouteMatrixCarOptions),
    Scooter: S.optional(RouteMatrixScooterOptions),
    Truck: S.optional(RouteMatrixTruckOptions),
  }),
).annotations({
  identifier: "RouteMatrixTravelModeOptions",
}) as any as S.Schema<RouteMatrixTravelModeOptions>;
export interface RouteAvoidanceOptions {
  Areas?: RouteAvoidanceArea[];
  CarShuttleTrains?: boolean;
  ControlledAccessHighways?: boolean;
  DirtRoads?: boolean;
  Ferries?: boolean;
  SeasonalClosure?: boolean;
  TollRoads?: boolean;
  TollTransponders?: boolean;
  TruckRoadTypes?: string | redacted.Redacted<string>[];
  Tunnels?: boolean;
  UTurns?: boolean;
  ZoneCategories?: RouteAvoidanceZoneCategory[];
}
export const RouteAvoidanceOptions = S.suspend(() =>
  S.Struct({
    Areas: S.optional(RouteAvoidanceAreaList),
    CarShuttleTrains: S.optional(S.Boolean),
    ControlledAccessHighways: S.optional(S.Boolean),
    DirtRoads: S.optional(S.Boolean),
    Ferries: S.optional(S.Boolean),
    SeasonalClosure: S.optional(S.Boolean),
    TollRoads: S.optional(S.Boolean),
    TollTransponders: S.optional(S.Boolean),
    TruckRoadTypes: S.optional(TruckRoadTypeList),
    Tunnels: S.optional(S.Boolean),
    UTurns: S.optional(S.Boolean),
    ZoneCategories: S.optional(RouteAvoidanceZoneCategoryList),
  }),
).annotations({
  identifier: "RouteAvoidanceOptions",
}) as any as S.Schema<RouteAvoidanceOptions>;
export interface RouteTravelModeOptions {
  Car?: RouteCarOptions;
  Pedestrian?: RoutePedestrianOptions;
  Scooter?: RouteScooterOptions;
  Truck?: RouteTruckOptions;
}
export const RouteTravelModeOptions = S.suspend(() =>
  S.Struct({
    Car: S.optional(RouteCarOptions),
    Pedestrian: S.optional(RoutePedestrianOptions),
    Scooter: S.optional(RouteScooterOptions),
    Truck: S.optional(RouteTruckOptions),
  }),
).annotations({
  identifier: "RouteTravelModeOptions",
}) as any as S.Schema<RouteTravelModeOptions>;
export interface WaypointOptimizationAvoidanceOptions {
  Areas?: WaypointOptimizationAvoidanceArea[];
  CarShuttleTrains?: boolean;
  ControlledAccessHighways?: boolean;
  DirtRoads?: boolean;
  Ferries?: boolean;
  TollRoads?: boolean;
  Tunnels?: boolean;
  UTurns?: boolean;
}
export const WaypointOptimizationAvoidanceOptions = S.suspend(() =>
  S.Struct({
    Areas: S.optional(WaypointOptimizationAvoidanceAreaList),
    CarShuttleTrains: S.optional(S.Boolean),
    ControlledAccessHighways: S.optional(S.Boolean),
    DirtRoads: S.optional(S.Boolean),
    Ferries: S.optional(S.Boolean),
    TollRoads: S.optional(S.Boolean),
    Tunnels: S.optional(S.Boolean),
    UTurns: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "WaypointOptimizationAvoidanceOptions",
}) as any as S.Schema<WaypointOptimizationAvoidanceOptions>;
export interface WaypointOptimizationDestinationOptions {
  AccessHours?: WaypointOptimizationAccessHours;
  AppointmentTime?: string | redacted.Redacted<string>;
  Heading?: number;
  Id?: string;
  ServiceDuration?: number;
  SideOfStreet?: WaypointOptimizationSideOfStreetOptions;
}
export const WaypointOptimizationDestinationOptions = S.suspend(() =>
  S.Struct({
    AccessHours: S.optional(WaypointOptimizationAccessHours),
    AppointmentTime: S.optional(SensitiveString),
    Heading: S.optional(S.Number),
    Id: S.optional(S.String),
    ServiceDuration: S.optional(S.Number),
    SideOfStreet: S.optional(WaypointOptimizationSideOfStreetOptions),
  }),
).annotations({
  identifier: "WaypointOptimizationDestinationOptions",
}) as any as S.Schema<WaypointOptimizationDestinationOptions>;
export interface WaypointOptimizationDriverOptions {
  RestCycles?: WaypointOptimizationRestCycles;
  RestProfile?: WaypointOptimizationRestProfile;
  TreatServiceTimeAs?: string | redacted.Redacted<string>;
}
export const WaypointOptimizationDriverOptions = S.suspend(() =>
  S.Struct({
    RestCycles: S.optional(WaypointOptimizationRestCycles),
    RestProfile: S.optional(WaypointOptimizationRestProfile),
    TreatServiceTimeAs: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "WaypointOptimizationDriverOptions",
}) as any as S.Schema<WaypointOptimizationDriverOptions>;
export interface WaypointOptimizationTravelModeOptions {
  Pedestrian?: WaypointOptimizationPedestrianOptions;
  Truck?: WaypointOptimizationTruckOptions;
}
export const WaypointOptimizationTravelModeOptions = S.suspend(() =>
  S.Struct({
    Pedestrian: S.optional(WaypointOptimizationPedestrianOptions),
    Truck: S.optional(WaypointOptimizationTruckOptions),
  }),
).annotations({
  identifier: "WaypointOptimizationTravelModeOptions",
}) as any as S.Schema<WaypointOptimizationTravelModeOptions>;
export interface RoadSnapTravelModeOptions {
  Truck?: RoadSnapTruckOptions;
}
export const RoadSnapTravelModeOptions = S.suspend(() =>
  S.Struct({ Truck: S.optional(RoadSnapTruckOptions) }),
).annotations({
  identifier: "RoadSnapTravelModeOptions",
}) as any as S.Schema<RoadSnapTravelModeOptions>;
export interface IsolineAvoidanceAreaGeometry {
  BoundingBox?: number[];
  Corridor?: Corridor;
  Polygon?: number[][][];
  PolylineCorridor?: PolylineCorridor;
  PolylinePolygon?: string | redacted.Redacted<string>[];
}
export const IsolineAvoidanceAreaGeometry = S.suspend(() =>
  S.Struct({
    BoundingBox: S.optional(BoundingBox),
    Corridor: S.optional(Corridor),
    Polygon: S.optional(LinearRings),
    PolylineCorridor: S.optional(PolylineCorridor),
    PolylinePolygon: S.optional(PolylineRingList),
  }),
).annotations({
  identifier: "IsolineAvoidanceAreaGeometry",
}) as any as S.Schema<IsolineAvoidanceAreaGeometry>;
export type IsolineAvoidanceAreaGeometryList = IsolineAvoidanceAreaGeometry[];
export const IsolineAvoidanceAreaGeometryList = S.Array(
  IsolineAvoidanceAreaGeometry,
);
export interface CalculateRouteMatrixRequest {
  Allow?: RouteMatrixAllowOptions;
  Avoid?: RouteMatrixAvoidanceOptions;
  DepartNow?: boolean;
  DepartureTime?: string | redacted.Redacted<string>;
  Destinations: RouteMatrixDestination[];
  Exclude?: RouteMatrixExclusionOptions;
  Key?: string | redacted.Redacted<string>;
  OptimizeRoutingFor?: string;
  Origins: RouteMatrixOrigin[];
  RoutingBoundary: RouteMatrixBoundary;
  Traffic?: RouteMatrixTrafficOptions;
  TravelMode?: string;
  TravelModeOptions?: RouteMatrixTravelModeOptions;
}
export const CalculateRouteMatrixRequest = S.suspend(() =>
  S.Struct({
    Allow: S.optional(RouteMatrixAllowOptions),
    Avoid: S.optional(RouteMatrixAvoidanceOptions),
    DepartNow: S.optional(S.Boolean),
    DepartureTime: S.optional(SensitiveString),
    Destinations: RouteMatrixDestinationList,
    Exclude: S.optional(RouteMatrixExclusionOptions),
    Key: S.optional(SensitiveString).pipe(T.HttpQuery("key")),
    OptimizeRoutingFor: S.optional(S.String),
    Origins: RouteMatrixOriginList,
    RoutingBoundary: RouteMatrixBoundary,
    Traffic: S.optional(RouteMatrixTrafficOptions),
    TravelMode: S.optional(S.String),
    TravelModeOptions: S.optional(RouteMatrixTravelModeOptions),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/route-matrix" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CalculateRouteMatrixRequest",
}) as any as S.Schema<CalculateRouteMatrixRequest>;
export interface CalculateRoutesRequest {
  Allow?: RouteAllowOptions;
  ArrivalTime?: string | redacted.Redacted<string>;
  Avoid?: RouteAvoidanceOptions;
  DepartNow?: boolean;
  DepartureTime?: string | redacted.Redacted<string>;
  Destination: number[];
  DestinationOptions?: RouteDestinationOptions;
  Driver?: RouteDriverOptions;
  Exclude?: RouteExclusionOptions;
  InstructionsMeasurementSystem?: string;
  Key?: string | redacted.Redacted<string>;
  Languages?: string[];
  LegAdditionalFeatures?: string | redacted.Redacted<string>[];
  LegGeometryFormat?: string;
  MaxAlternatives?: number;
  OptimizeRoutingFor?: string;
  Origin: number[];
  OriginOptions?: RouteOriginOptions;
  SpanAdditionalFeatures?: string[];
  Tolls?: RouteTollOptions;
  Traffic?: RouteTrafficOptions;
  TravelMode?: string;
  TravelModeOptions?: RouteTravelModeOptions;
  TravelStepType?: string;
  Waypoints?: RouteWaypoint[];
}
export const CalculateRoutesRequest = S.suspend(() =>
  S.Struct({
    Allow: S.optional(RouteAllowOptions),
    ArrivalTime: S.optional(SensitiveString),
    Avoid: S.optional(RouteAvoidanceOptions),
    DepartNow: S.optional(S.Boolean),
    DepartureTime: S.optional(SensitiveString),
    Destination: Position,
    DestinationOptions: S.optional(RouteDestinationOptions),
    Driver: S.optional(RouteDriverOptions),
    Exclude: S.optional(RouteExclusionOptions),
    InstructionsMeasurementSystem: S.optional(S.String),
    Key: S.optional(SensitiveString).pipe(T.HttpQuery("key")),
    Languages: S.optional(LanguageTagList),
    LegAdditionalFeatures: S.optional(RouteLegAdditionalFeatureList),
    LegGeometryFormat: S.optional(S.String),
    MaxAlternatives: S.optional(S.Number),
    OptimizeRoutingFor: S.optional(S.String),
    Origin: Position,
    OriginOptions: S.optional(RouteOriginOptions),
    SpanAdditionalFeatures: S.optional(RouteSpanAdditionalFeatureList),
    Tolls: S.optional(RouteTollOptions),
    Traffic: S.optional(RouteTrafficOptions),
    TravelMode: S.optional(S.String),
    TravelModeOptions: S.optional(RouteTravelModeOptions),
    TravelStepType: S.optional(S.String),
    Waypoints: S.optional(RouteWaypointList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/routes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CalculateRoutesRequest",
}) as any as S.Schema<CalculateRoutesRequest>;
export interface OptimizeWaypointsRequest {
  Avoid?: WaypointOptimizationAvoidanceOptions;
  Clustering?: WaypointOptimizationClusteringOptions;
  DepartureTime?: string | redacted.Redacted<string>;
  Destination?: number[];
  DestinationOptions?: WaypointOptimizationDestinationOptions;
  Driver?: WaypointOptimizationDriverOptions;
  Exclude?: WaypointOptimizationExclusionOptions;
  Key?: string | redacted.Redacted<string>;
  OptimizeSequencingFor?: string;
  Origin: number[];
  OriginOptions?: WaypointOptimizationOriginOptions;
  Traffic?: WaypointOptimizationTrafficOptions;
  TravelMode?: string;
  TravelModeOptions?: WaypointOptimizationTravelModeOptions;
  Waypoints?: WaypointOptimizationWaypoint[];
}
export const OptimizeWaypointsRequest = S.suspend(() =>
  S.Struct({
    Avoid: S.optional(WaypointOptimizationAvoidanceOptions),
    Clustering: S.optional(WaypointOptimizationClusteringOptions),
    DepartureTime: S.optional(SensitiveString),
    Destination: S.optional(Position),
    DestinationOptions: S.optional(WaypointOptimizationDestinationOptions),
    Driver: S.optional(WaypointOptimizationDriverOptions),
    Exclude: S.optional(WaypointOptimizationExclusionOptions),
    Key: S.optional(SensitiveString).pipe(T.HttpQuery("key")),
    OptimizeSequencingFor: S.optional(S.String),
    Origin: Position,
    OriginOptions: S.optional(WaypointOptimizationOriginOptions),
    Traffic: S.optional(WaypointOptimizationTrafficOptions),
    TravelMode: S.optional(S.String),
    TravelModeOptions: S.optional(WaypointOptimizationTravelModeOptions),
    Waypoints: S.optional(WaypointOptimizationWaypointList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/optimize-waypoints" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "OptimizeWaypointsRequest",
}) as any as S.Schema<OptimizeWaypointsRequest>;
export interface SnapToRoadsRequest {
  Key?: string | redacted.Redacted<string>;
  SnappedGeometryFormat?: string;
  SnapRadius?: number;
  TracePoints: RoadSnapTracePoint[];
  TravelMode?: string;
  TravelModeOptions?: RoadSnapTravelModeOptions;
}
export const SnapToRoadsRequest = S.suspend(() =>
  S.Struct({
    Key: S.optional(SensitiveString).pipe(T.HttpQuery("key")),
    SnappedGeometryFormat: S.optional(S.String),
    SnapRadius: S.optional(S.Number),
    TracePoints: RoadSnapTracePointList,
    TravelMode: S.optional(S.String),
    TravelModeOptions: S.optional(RoadSnapTravelModeOptions),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/snap-to-roads" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SnapToRoadsRequest",
}) as any as S.Schema<SnapToRoadsRequest>;
export interface IsolineAvoidanceArea {
  Except?: IsolineAvoidanceAreaGeometry[];
  Geometry: IsolineAvoidanceAreaGeometry;
}
export const IsolineAvoidanceArea = S.suspend(() =>
  S.Struct({
    Except: S.optional(IsolineAvoidanceAreaGeometryList),
    Geometry: IsolineAvoidanceAreaGeometry,
  }),
).annotations({
  identifier: "IsolineAvoidanceArea",
}) as any as S.Schema<IsolineAvoidanceArea>;
export type IsolineAvoidanceAreaList = IsolineAvoidanceArea[];
export const IsolineAvoidanceAreaList = S.Array(IsolineAvoidanceArea);
export interface IsolineAvoidanceOptions {
  Areas?: IsolineAvoidanceArea[];
  CarShuttleTrains?: boolean;
  ControlledAccessHighways?: boolean;
  DirtRoads?: boolean;
  Ferries?: boolean;
  SeasonalClosure?: boolean;
  TollRoads?: boolean;
  TollTransponders?: boolean;
  TruckRoadTypes?: string | redacted.Redacted<string>[];
  Tunnels?: boolean;
  UTurns?: boolean;
  ZoneCategories?: IsolineAvoidanceZoneCategory[];
}
export const IsolineAvoidanceOptions = S.suspend(() =>
  S.Struct({
    Areas: S.optional(IsolineAvoidanceAreaList),
    CarShuttleTrains: S.optional(S.Boolean),
    ControlledAccessHighways: S.optional(S.Boolean),
    DirtRoads: S.optional(S.Boolean),
    Ferries: S.optional(S.Boolean),
    SeasonalClosure: S.optional(S.Boolean),
    TollRoads: S.optional(S.Boolean),
    TollTransponders: S.optional(S.Boolean),
    TruckRoadTypes: S.optional(TruckRoadTypeList),
    Tunnels: S.optional(S.Boolean),
    UTurns: S.optional(S.Boolean),
    ZoneCategories: S.optional(IsolineAvoidanceZoneCategoryList),
  }),
).annotations({
  identifier: "IsolineAvoidanceOptions",
}) as any as S.Schema<IsolineAvoidanceOptions>;
export interface CalculateIsolinesRequest {
  Allow?: IsolineAllowOptions;
  ArrivalTime?: string | redacted.Redacted<string>;
  Avoid?: IsolineAvoidanceOptions;
  DepartNow?: boolean;
  DepartureTime?: string | redacted.Redacted<string>;
  Destination?: number[];
  DestinationOptions?: IsolineDestinationOptions;
  IsolineGeometryFormat?: string;
  IsolineGranularity?: IsolineGranularityOptions;
  Key?: string | redacted.Redacted<string>;
  OptimizeIsolineFor?: string;
  OptimizeRoutingFor?: string;
  Origin?: number[];
  OriginOptions?: IsolineOriginOptions;
  Thresholds: IsolineThresholds;
  Traffic?: IsolineTrafficOptions;
  TravelMode?: string;
  TravelModeOptions?: IsolineTravelModeOptions;
}
export const CalculateIsolinesRequest = S.suspend(() =>
  S.Struct({
    Allow: S.optional(IsolineAllowOptions),
    ArrivalTime: S.optional(SensitiveString),
    Avoid: S.optional(IsolineAvoidanceOptions),
    DepartNow: S.optional(S.Boolean),
    DepartureTime: S.optional(SensitiveString),
    Destination: S.optional(Position),
    DestinationOptions: S.optional(IsolineDestinationOptions),
    IsolineGeometryFormat: S.optional(S.String),
    IsolineGranularity: S.optional(IsolineGranularityOptions),
    Key: S.optional(SensitiveString).pipe(T.HttpQuery("key")),
    OptimizeIsolineFor: S.optional(S.String),
    OptimizeRoutingFor: S.optional(S.String),
    Origin: S.optional(Position),
    OriginOptions: S.optional(IsolineOriginOptions),
    Thresholds: IsolineThresholds,
    Traffic: S.optional(IsolineTrafficOptions),
    TravelMode: S.optional(S.String),
    TravelModeOptions: S.optional(IsolineTravelModeOptions),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/isolines" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CalculateIsolinesRequest",
}) as any as S.Schema<CalculateIsolinesRequest>;
export type RoadSnapTracePointIndexList = number[];
export const RoadSnapTracePointIndexList = S.Array(S.Number);
export interface RouteMatrixEntry {
  Distance: number;
  Duration: number;
  Error?: string;
}
export const RouteMatrixEntry = S.suspend(() =>
  S.Struct({
    Distance: S.Number,
    Duration: S.Number,
    Error: S.optional(S.String),
  }),
).annotations({
  identifier: "RouteMatrixEntry",
}) as any as S.Schema<RouteMatrixEntry>;
export type RouteMatrixRow = RouteMatrixEntry[];
export const RouteMatrixRow = S.Array(RouteMatrixEntry);
export type RouteMatrix = RouteMatrixEntry[][];
export const RouteMatrix = S.Array(RouteMatrixRow);
export interface RouteResponseNotice {
  Code: string;
  Impact?: string;
}
export const RouteResponseNotice = S.suspend(() =>
  S.Struct({ Code: S.String, Impact: S.optional(S.String) }),
).annotations({
  identifier: "RouteResponseNotice",
}) as any as S.Schema<RouteResponseNotice>;
export type RouteResponseNoticeList = RouteResponseNotice[];
export const RouteResponseNoticeList = S.Array(RouteResponseNotice);
export interface WaypointOptimizationConnection {
  Distance: number;
  From: string;
  RestDuration: number;
  To: string;
  TravelDuration: number;
  WaitDuration: number;
}
export const WaypointOptimizationConnection = S.suspend(() =>
  S.Struct({
    Distance: S.Number,
    From: S.String,
    RestDuration: S.Number,
    To: S.String,
    TravelDuration: S.Number,
    WaitDuration: S.Number,
  }),
).annotations({
  identifier: "WaypointOptimizationConnection",
}) as any as S.Schema<WaypointOptimizationConnection>;
export type WaypointOptimizationConnectionList =
  WaypointOptimizationConnection[];
export const WaypointOptimizationConnectionList = S.Array(
  WaypointOptimizationConnection,
);
export interface WaypointOptimizationOptimizedWaypoint {
  ArrivalTime?: string | redacted.Redacted<string>;
  ClusterIndex?: number;
  DepartureTime: string | redacted.Redacted<string>;
  Id: string;
  Position: number[];
}
export const WaypointOptimizationOptimizedWaypoint = S.suspend(() =>
  S.Struct({
    ArrivalTime: S.optional(SensitiveString),
    ClusterIndex: S.optional(S.Number),
    DepartureTime: SensitiveString,
    Id: S.String,
    Position: Position,
  }),
).annotations({
  identifier: "WaypointOptimizationOptimizedWaypoint",
}) as any as S.Schema<WaypointOptimizationOptimizedWaypoint>;
export type WaypointOptimizationOptimizedWaypointList =
  WaypointOptimizationOptimizedWaypoint[];
export const WaypointOptimizationOptimizedWaypointList = S.Array(
  WaypointOptimizationOptimizedWaypoint,
);
export interface WaypointOptimizationTimeBreakdown {
  RestDuration: number;
  ServiceDuration: number;
  TravelDuration: number;
  WaitDuration: number;
}
export const WaypointOptimizationTimeBreakdown = S.suspend(() =>
  S.Struct({
    RestDuration: S.Number,
    ServiceDuration: S.Number,
    TravelDuration: S.Number,
    WaitDuration: S.Number,
  }),
).annotations({
  identifier: "WaypointOptimizationTimeBreakdown",
}) as any as S.Schema<WaypointOptimizationTimeBreakdown>;
export interface RoadSnapNotice {
  Code: string | redacted.Redacted<string>;
  Title: string | redacted.Redacted<string>;
  TracePointIndexes: number[];
}
export const RoadSnapNotice = S.suspend(() =>
  S.Struct({
    Code: SensitiveString,
    Title: SensitiveString,
    TracePointIndexes: RoadSnapTracePointIndexList,
  }),
).annotations({
  identifier: "RoadSnapNotice",
}) as any as S.Schema<RoadSnapNotice>;
export type RoadSnapNoticeList = RoadSnapNotice[];
export const RoadSnapNoticeList = S.Array(RoadSnapNotice);
export interface RoadSnapSnappedGeometry {
  LineString?: number[][];
  Polyline?: string | redacted.Redacted<string>;
}
export const RoadSnapSnappedGeometry = S.suspend(() =>
  S.Struct({
    LineString: S.optional(LineString),
    Polyline: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "RoadSnapSnappedGeometry",
}) as any as S.Schema<RoadSnapSnappedGeometry>;
export interface RoadSnapSnappedTracePoint {
  Confidence: number;
  OriginalPosition: number[];
  SnappedPosition: number[];
}
export const RoadSnapSnappedTracePoint = S.suspend(() =>
  S.Struct({
    Confidence: S.Number,
    OriginalPosition: Position,
    SnappedPosition: Position,
  }),
).annotations({
  identifier: "RoadSnapSnappedTracePoint",
}) as any as S.Schema<RoadSnapSnappedTracePoint>;
export type RoadSnapSnappedTracePointList = RoadSnapSnappedTracePoint[];
export const RoadSnapSnappedTracePointList = S.Array(RoadSnapSnappedTracePoint);
export interface CalculateRouteMatrixResponse {
  ErrorCount: number;
  PricingBucket: string;
  RouteMatrix: RouteMatrixEntry[][];
  RoutingBoundary: RouteMatrixBoundary;
}
export const CalculateRouteMatrixResponse = S.suspend(() =>
  S.Struct({
    ErrorCount: S.Number,
    PricingBucket: S.String.pipe(T.HttpHeader("x-amz-geo-pricing-bucket")),
    RouteMatrix: RouteMatrix,
    RoutingBoundary: RouteMatrixBoundary,
  }),
).annotations({
  identifier: "CalculateRouteMatrixResponse",
}) as any as S.Schema<CalculateRouteMatrixResponse>;
export interface SnapToRoadsResponse {
  Notices: RoadSnapNotice[];
  PricingBucket: string;
  SnappedGeometry?: RoadSnapSnappedGeometry;
  SnappedGeometryFormat: string;
  SnappedTracePoints: RoadSnapSnappedTracePoint[];
}
export const SnapToRoadsResponse = S.suspend(() =>
  S.Struct({
    Notices: RoadSnapNoticeList,
    PricingBucket: S.String.pipe(T.HttpHeader("x-amz-geo-pricing-bucket")),
    SnappedGeometry: S.optional(RoadSnapSnappedGeometry),
    SnappedGeometryFormat: S.String,
    SnappedTracePoints: RoadSnapSnappedTracePointList,
  }),
).annotations({
  identifier: "SnapToRoadsResponse",
}) as any as S.Schema<SnapToRoadsResponse>;
export interface WaypointOptimizationFailedConstraint {
  Constraint?: string | redacted.Redacted<string>;
  Reason?: string | redacted.Redacted<string>;
}
export const WaypointOptimizationFailedConstraint = S.suspend(() =>
  S.Struct({
    Constraint: S.optional(SensitiveString),
    Reason: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "WaypointOptimizationFailedConstraint",
}) as any as S.Schema<WaypointOptimizationFailedConstraint>;
export type WaypointOptimizationFailedConstraintList =
  WaypointOptimizationFailedConstraint[];
export const WaypointOptimizationFailedConstraintList = S.Array(
  WaypointOptimizationFailedConstraint,
);
export interface WaypointOptimizationImpedingWaypoint {
  FailedConstraints: WaypointOptimizationFailedConstraint[];
  Id: string;
  Position: number[];
}
export const WaypointOptimizationImpedingWaypoint = S.suspend(() =>
  S.Struct({
    FailedConstraints: WaypointOptimizationFailedConstraintList,
    Id: S.String,
    Position: Position,
  }),
).annotations({
  identifier: "WaypointOptimizationImpedingWaypoint",
}) as any as S.Schema<WaypointOptimizationImpedingWaypoint>;
export type WaypointOptimizationImpedingWaypointList =
  WaypointOptimizationImpedingWaypoint[];
export const WaypointOptimizationImpedingWaypointList = S.Array(
  WaypointOptimizationImpedingWaypoint,
);
export interface RouteLegGeometry {
  LineString?: number[][];
  Polyline?: string | redacted.Redacted<string>;
}
export const RouteLegGeometry = S.suspend(() =>
  S.Struct({
    LineString: S.optional(LineString),
    Polyline: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "RouteLegGeometry",
}) as any as S.Schema<RouteLegGeometry>;
export interface LocalizedString {
  Language?: string;
  Value: string | redacted.Redacted<string>;
}
export const LocalizedString = S.suspend(() =>
  S.Struct({ Language: S.optional(S.String), Value: SensitiveString }),
).annotations({
  identifier: "LocalizedString",
}) as any as S.Schema<LocalizedString>;
export interface RouteNumber {
  Direction?: string | redacted.Redacted<string>;
  Language?: string;
  Value: string | redacted.Redacted<string>;
}
export const RouteNumber = S.suspend(() =>
  S.Struct({
    Direction: S.optional(SensitiveString),
    Language: S.optional(S.String),
    Value: SensitiveString,
  }),
).annotations({ identifier: "RouteNumber" }) as any as S.Schema<RouteNumber>;
export type LocalizedStringList = LocalizedString[];
export const LocalizedStringList = S.Array(LocalizedString);
export type IndexList = number[];
export const IndexList = S.Array(S.Number);
export type RouteSpanPedestrianAccessAttributeList =
  | string
  | redacted.Redacted<string>[];
export const RouteSpanPedestrianAccessAttributeList = S.Array(SensitiveString);
export type RouteSpanRoadAttributeList = string | redacted.Redacted<string>[];
export const RouteSpanRoadAttributeList = S.Array(SensitiveString);
export type RouteNumberList = RouteNumber[];
export const RouteNumberList = S.Array(RouteNumber);
export type RouteSpanCarAccessAttributeList =
  | string
  | redacted.Redacted<string>[];
export const RouteSpanCarAccessAttributeList = S.Array(SensitiveString);
export type RouteSpanScooterAccessAttributeList =
  | string
  | redacted.Redacted<string>[];
export const RouteSpanScooterAccessAttributeList = S.Array(SensitiveString);
export type RouteSpanTruckAccessAttributeList =
  | string
  | redacted.Redacted<string>[];
export const RouteSpanTruckAccessAttributeList = S.Array(SensitiveString);
export interface OptimizeWaypointsResponse {
  Connections: WaypointOptimizationConnection[];
  Distance: number;
  Duration: number;
  ImpedingWaypoints: WaypointOptimizationImpedingWaypoint[];
  OptimizedWaypoints: WaypointOptimizationOptimizedWaypoint[];
  PricingBucket: string;
  TimeBreakdown: WaypointOptimizationTimeBreakdown;
}
export const OptimizeWaypointsResponse = S.suspend(() =>
  S.Struct({
    Connections: WaypointOptimizationConnectionList,
    Distance: S.Number,
    Duration: S.Number,
    ImpedingWaypoints: WaypointOptimizationImpedingWaypointList,
    OptimizedWaypoints: WaypointOptimizationOptimizedWaypointList,
    PricingBucket: S.String.pipe(T.HttpHeader("x-amz-geo-pricing-bucket")),
    TimeBreakdown: WaypointOptimizationTimeBreakdown,
  }),
).annotations({
  identifier: "OptimizeWaypointsResponse",
}) as any as S.Schema<OptimizeWaypointsResponse>;
export interface IsolineShapeGeometry {
  Polygon?: number[][][];
  PolylinePolygon?: string | redacted.Redacted<string>[];
}
export const IsolineShapeGeometry = S.suspend(() =>
  S.Struct({
    Polygon: S.optional(LinearRings),
    PolylinePolygon: S.optional(PolylineRingList),
  }),
).annotations({
  identifier: "IsolineShapeGeometry",
}) as any as S.Schema<IsolineShapeGeometry>;
export type IsolineShapeGeometryList = IsolineShapeGeometry[];
export const IsolineShapeGeometryList = S.Array(IsolineShapeGeometry);
export interface RouteMajorRoadLabel {
  RoadName?: LocalizedString;
  RouteNumber?: RouteNumber;
}
export const RouteMajorRoadLabel = S.suspend(() =>
  S.Struct({
    RoadName: S.optional(LocalizedString),
    RouteNumber: S.optional(RouteNumber),
  }),
).annotations({
  identifier: "RouteMajorRoadLabel",
}) as any as S.Schema<RouteMajorRoadLabel>;
export type RouteMajorRoadLabelList = RouteMajorRoadLabel[];
export const RouteMajorRoadLabelList = S.Array(RouteMajorRoadLabel);
export interface RouteFerryAfterTravelStep {
  Duration: number;
  Instruction?: string | redacted.Redacted<string>;
  Type: string | redacted.Redacted<string>;
}
export const RouteFerryAfterTravelStep = S.suspend(() =>
  S.Struct({
    Duration: S.Number,
    Instruction: S.optional(SensitiveString),
    Type: SensitiveString,
  }),
).annotations({
  identifier: "RouteFerryAfterTravelStep",
}) as any as S.Schema<RouteFerryAfterTravelStep>;
export type RouteFerryAfterTravelStepList = RouteFerryAfterTravelStep[];
export const RouteFerryAfterTravelStepList = S.Array(RouteFerryAfterTravelStep);
export interface RouteFerryBeforeTravelStep {
  Duration: number;
  Instruction?: string | redacted.Redacted<string>;
  Type: string | redacted.Redacted<string>;
}
export const RouteFerryBeforeTravelStep = S.suspend(() =>
  S.Struct({
    Duration: S.Number,
    Instruction: S.optional(SensitiveString),
    Type: SensitiveString,
  }),
).annotations({
  identifier: "RouteFerryBeforeTravelStep",
}) as any as S.Schema<RouteFerryBeforeTravelStep>;
export type RouteFerryBeforeTravelStepList = RouteFerryBeforeTravelStep[];
export const RouteFerryBeforeTravelStepList = S.Array(
  RouteFerryBeforeTravelStep,
);
export type Position23 = number[];
export const Position23 = S.Array(S.Number);
export interface RouteFerryPlace {
  Name?: string | redacted.Redacted<string>;
  OriginalPosition?: number[];
  Position: number[];
  WaypointIndex?: number;
}
export const RouteFerryPlace = S.suspend(() =>
  S.Struct({
    Name: S.optional(SensitiveString),
    OriginalPosition: S.optional(Position23),
    Position: Position23,
    WaypointIndex: S.optional(S.Number),
  }),
).annotations({
  identifier: "RouteFerryPlace",
}) as any as S.Schema<RouteFerryPlace>;
export interface RouteFerryDeparture {
  Place: RouteFerryPlace;
  Time?: string | redacted.Redacted<string>;
}
export const RouteFerryDeparture = S.suspend(() =>
  S.Struct({ Place: RouteFerryPlace, Time: S.optional(SensitiveString) }),
).annotations({
  identifier: "RouteFerryDeparture",
}) as any as S.Schema<RouteFerryDeparture>;
export interface RouteFerryNotice {
  Code: string;
  Impact?: string;
}
export const RouteFerryNotice = S.suspend(() =>
  S.Struct({ Code: S.String, Impact: S.optional(S.String) }),
).annotations({
  identifier: "RouteFerryNotice",
}) as any as S.Schema<RouteFerryNotice>;
export type RouteFerryNoticeList = RouteFerryNotice[];
export const RouteFerryNoticeList = S.Array(RouteFerryNotice);
export interface RouteFerrySpan {
  Country?: string | redacted.Redacted<string>;
  Distance?: number;
  Duration?: number;
  GeometryOffset?: number;
  Names?: LocalizedString[];
  Region?: string | redacted.Redacted<string>;
}
export const RouteFerrySpan = S.suspend(() =>
  S.Struct({
    Country: S.optional(SensitiveString),
    Distance: S.optional(S.Number),
    Duration: S.optional(S.Number),
    GeometryOffset: S.optional(S.Number),
    Names: S.optional(LocalizedStringList),
    Region: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "RouteFerrySpan",
}) as any as S.Schema<RouteFerrySpan>;
export type RouteFerrySpanList = RouteFerrySpan[];
export const RouteFerrySpanList = S.Array(RouteFerrySpan);
export interface RouteFerryTravelStep {
  Distance?: number;
  Duration: number;
  GeometryOffset?: number;
  Instruction?: string | redacted.Redacted<string>;
  Type: string | redacted.Redacted<string>;
}
export const RouteFerryTravelStep = S.suspend(() =>
  S.Struct({
    Distance: S.optional(S.Number),
    Duration: S.Number,
    GeometryOffset: S.optional(S.Number),
    Instruction: S.optional(SensitiveString),
    Type: SensitiveString,
  }),
).annotations({
  identifier: "RouteFerryTravelStep",
}) as any as S.Schema<RouteFerryTravelStep>;
export type RouteFerryTravelStepList = RouteFerryTravelStep[];
export const RouteFerryTravelStepList = S.Array(RouteFerryTravelStep);
export interface RoutePedestrianPlace {
  Name?: string | redacted.Redacted<string>;
  OriginalPosition?: number[];
  Position: number[];
  SideOfStreet?: string | redacted.Redacted<string>;
  WaypointIndex?: number;
}
export const RoutePedestrianPlace = S.suspend(() =>
  S.Struct({
    Name: S.optional(SensitiveString),
    OriginalPosition: S.optional(Position23),
    Position: Position23,
    SideOfStreet: S.optional(SensitiveString),
    WaypointIndex: S.optional(S.Number),
  }),
).annotations({
  identifier: "RoutePedestrianPlace",
}) as any as S.Schema<RoutePedestrianPlace>;
export interface RoutePedestrianDeparture {
  Place: RoutePedestrianPlace;
  Time?: string | redacted.Redacted<string>;
}
export const RoutePedestrianDeparture = S.suspend(() =>
  S.Struct({ Place: RoutePedestrianPlace, Time: S.optional(SensitiveString) }),
).annotations({
  identifier: "RoutePedestrianDeparture",
}) as any as S.Schema<RoutePedestrianDeparture>;
export interface RoutePedestrianNotice {
  Code: string;
  Impact?: string;
}
export const RoutePedestrianNotice = S.suspend(() =>
  S.Struct({ Code: S.String, Impact: S.optional(S.String) }),
).annotations({
  identifier: "RoutePedestrianNotice",
}) as any as S.Schema<RoutePedestrianNotice>;
export type RoutePedestrianNoticeList = RoutePedestrianNotice[];
export const RoutePedestrianNoticeList = S.Array(RoutePedestrianNotice);
export interface RouteVehiclePlace {
  Name?: string | redacted.Redacted<string>;
  OriginalPosition?: number[];
  Position: number[];
  SideOfStreet?: string | redacted.Redacted<string>;
  WaypointIndex?: number;
}
export const RouteVehiclePlace = S.suspend(() =>
  S.Struct({
    Name: S.optional(SensitiveString),
    OriginalPosition: S.optional(Position23),
    Position: Position23,
    SideOfStreet: S.optional(SensitiveString),
    WaypointIndex: S.optional(S.Number),
  }),
).annotations({
  identifier: "RouteVehiclePlace",
}) as any as S.Schema<RouteVehiclePlace>;
export interface RouteVehicleDeparture {
  Place: RouteVehiclePlace;
  Time?: string | redacted.Redacted<string>;
}
export const RouteVehicleDeparture = S.suspend(() =>
  S.Struct({ Place: RouteVehiclePlace, Time: S.optional(SensitiveString) }),
).annotations({
  identifier: "RouteVehicleDeparture",
}) as any as S.Schema<RouteVehicleDeparture>;
export interface RouteVehicleIncident {
  Description?: string | redacted.Redacted<string>;
  EndTime?: string | redacted.Redacted<string>;
  Severity?: string | redacted.Redacted<string>;
  StartTime?: string | redacted.Redacted<string>;
  Type?: string | redacted.Redacted<string>;
}
export const RouteVehicleIncident = S.suspend(() =>
  S.Struct({
    Description: S.optional(SensitiveString),
    EndTime: S.optional(SensitiveString),
    Severity: S.optional(SensitiveString),
    StartTime: S.optional(SensitiveString),
    Type: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "RouteVehicleIncident",
}) as any as S.Schema<RouteVehicleIncident>;
export type RouteVehicleIncidentList = RouteVehicleIncident[];
export const RouteVehicleIncidentList = S.Array(RouteVehicleIncident);
export interface RouteSpanDynamicSpeedDetails {
  BestCaseSpeed?: number;
  TurnDuration?: number;
  TypicalSpeed?: number;
}
export const RouteSpanDynamicSpeedDetails = S.suspend(() =>
  S.Struct({
    BestCaseSpeed: S.optional(S.Number),
    TurnDuration: S.optional(S.Number),
    TypicalSpeed: S.optional(S.Number),
  }),
).annotations({
  identifier: "RouteSpanDynamicSpeedDetails",
}) as any as S.Schema<RouteSpanDynamicSpeedDetails>;
export interface RouteSpanSpeedLimitDetails {
  MaxSpeed?: number;
  Unlimited?: boolean;
}
export const RouteSpanSpeedLimitDetails = S.suspend(() =>
  S.Struct({
    MaxSpeed: S.optional(S.Number),
    Unlimited: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "RouteSpanSpeedLimitDetails",
}) as any as S.Schema<RouteSpanSpeedLimitDetails>;
export interface RouteVehicleSpan {
  BestCaseDuration?: number;
  CarAccess?: string | redacted.Redacted<string>[];
  Country?: string | redacted.Redacted<string>;
  Distance?: number;
  Duration?: number;
  DynamicSpeed?: RouteSpanDynamicSpeedDetails;
  FunctionalClassification?: number;
  Gate?: string | redacted.Redacted<string>;
  GeometryOffset?: number;
  Incidents?: number[];
  Names?: LocalizedString[];
  Notices?: number[];
  RailwayCrossing?: string | redacted.Redacted<string>;
  Region?: string | redacted.Redacted<string>;
  RoadAttributes?: string | redacted.Redacted<string>[];
  RouteNumbers?: RouteNumber[];
  ScooterAccess?: string | redacted.Redacted<string>[];
  SpeedLimit?: RouteSpanSpeedLimitDetails;
  TollSystems?: number[];
  TruckAccess?: string | redacted.Redacted<string>[];
  TruckRoadTypes?: number[];
  TypicalDuration?: number;
  Zones?: number[];
}
export const RouteVehicleSpan = S.suspend(() =>
  S.Struct({
    BestCaseDuration: S.optional(S.Number),
    CarAccess: S.optional(RouteSpanCarAccessAttributeList),
    Country: S.optional(SensitiveString),
    Distance: S.optional(S.Number),
    Duration: S.optional(S.Number),
    DynamicSpeed: S.optional(RouteSpanDynamicSpeedDetails),
    FunctionalClassification: S.optional(S.Number),
    Gate: S.optional(SensitiveString),
    GeometryOffset: S.optional(S.Number),
    Incidents: S.optional(IndexList),
    Names: S.optional(LocalizedStringList),
    Notices: S.optional(IndexList),
    RailwayCrossing: S.optional(SensitiveString),
    Region: S.optional(SensitiveString),
    RoadAttributes: S.optional(RouteSpanRoadAttributeList),
    RouteNumbers: S.optional(RouteNumberList),
    ScooterAccess: S.optional(RouteSpanScooterAccessAttributeList),
    SpeedLimit: S.optional(RouteSpanSpeedLimitDetails),
    TollSystems: S.optional(IndexList),
    TruckAccess: S.optional(RouteSpanTruckAccessAttributeList),
    TruckRoadTypes: S.optional(IndexList),
    TypicalDuration: S.optional(S.Number),
    Zones: S.optional(IndexList),
  }),
).annotations({
  identifier: "RouteVehicleSpan",
}) as any as S.Schema<RouteVehicleSpan>;
export type RouteVehicleSpanList = RouteVehicleSpan[];
export const RouteVehicleSpanList = S.Array(RouteVehicleSpan);
export interface RouteTollSystem {
  Name?: string | redacted.Redacted<string>;
}
export const RouteTollSystem = S.suspend(() =>
  S.Struct({ Name: S.optional(SensitiveString) }),
).annotations({
  identifier: "RouteTollSystem",
}) as any as S.Schema<RouteTollSystem>;
export type RouteTollSystemList = RouteTollSystem[];
export const RouteTollSystemList = S.Array(RouteTollSystem);
export interface RouteZone {
  Category?: string | redacted.Redacted<string>;
  Name?: string | redacted.Redacted<string>;
}
export const RouteZone = S.suspend(() =>
  S.Struct({
    Category: S.optional(SensitiveString),
    Name: S.optional(SensitiveString),
  }),
).annotations({ identifier: "RouteZone" }) as any as S.Schema<RouteZone>;
export type RouteZoneList = RouteZone[];
export const RouteZoneList = S.Array(RouteZone);
export type RouteTollPaymentMethodList = string | redacted.Redacted<string>[];
export const RouteTollPaymentMethodList = S.Array(SensitiveString);
export interface IsolineConnectionGeometry {
  LineString?: number[][];
  Polyline?: string | redacted.Redacted<string>;
}
export const IsolineConnectionGeometry = S.suspend(() =>
  S.Struct({
    LineString: S.optional(LineString),
    Polyline: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "IsolineConnectionGeometry",
}) as any as S.Schema<IsolineConnectionGeometry>;
export interface RoutePassThroughPlace {
  OriginalPosition?: number[];
  Position: number[];
  WaypointIndex?: number;
}
export const RoutePassThroughPlace = S.suspend(() =>
  S.Struct({
    OriginalPosition: S.optional(Position23),
    Position: Position23,
    WaypointIndex: S.optional(S.Number),
  }),
).annotations({
  identifier: "RoutePassThroughPlace",
}) as any as S.Schema<RoutePassThroughPlace>;
export interface RouteFerryOverviewSummary {
  Distance: number;
  Duration: number;
}
export const RouteFerryOverviewSummary = S.suspend(() =>
  S.Struct({ Distance: S.Number, Duration: S.Number }),
).annotations({
  identifier: "RouteFerryOverviewSummary",
}) as any as S.Schema<RouteFerryOverviewSummary>;
export interface RouteFerryTravelOnlySummary {
  Duration: number;
}
export const RouteFerryTravelOnlySummary = S.suspend(() =>
  S.Struct({ Duration: S.Number }),
).annotations({
  identifier: "RouteFerryTravelOnlySummary",
}) as any as S.Schema<RouteFerryTravelOnlySummary>;
export interface RoutePedestrianOverviewSummary {
  Distance: number;
  Duration: number;
}
export const RoutePedestrianOverviewSummary = S.suspend(() =>
  S.Struct({ Distance: S.Number, Duration: S.Number }),
).annotations({
  identifier: "RoutePedestrianOverviewSummary",
}) as any as S.Schema<RoutePedestrianOverviewSummary>;
export interface RoutePedestrianTravelOnlySummary {
  Duration: number;
}
export const RoutePedestrianTravelOnlySummary = S.suspend(() =>
  S.Struct({ Duration: S.Number }),
).annotations({
  identifier: "RoutePedestrianTravelOnlySummary",
}) as any as S.Schema<RoutePedestrianTravelOnlySummary>;
export interface RouteContinueStepDetails {
  Intersection: LocalizedString[];
}
export const RouteContinueStepDetails = S.suspend(() =>
  S.Struct({ Intersection: LocalizedStringList }),
).annotations({
  identifier: "RouteContinueStepDetails",
}) as any as S.Schema<RouteContinueStepDetails>;
export interface RouteRoad {
  RoadName: LocalizedString[];
  RouteNumber: RouteNumber[];
  Towards: LocalizedString[];
  Type?: string | redacted.Redacted<string>;
}
export const RouteRoad = S.suspend(() =>
  S.Struct({
    RoadName: LocalizedStringList,
    RouteNumber: RouteNumberList,
    Towards: LocalizedStringList,
    Type: S.optional(SensitiveString),
  }),
).annotations({ identifier: "RouteRoad" }) as any as S.Schema<RouteRoad>;
export interface RouteKeepStepDetails {
  Intersection: LocalizedString[];
  SteeringDirection?: string | redacted.Redacted<string>;
  TurnAngle?: number;
  TurnIntensity?: string | redacted.Redacted<string>;
}
export const RouteKeepStepDetails = S.suspend(() =>
  S.Struct({
    Intersection: LocalizedStringList,
    SteeringDirection: S.optional(SensitiveString),
    TurnAngle: S.optional(S.Number),
    TurnIntensity: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "RouteKeepStepDetails",
}) as any as S.Schema<RouteKeepStepDetails>;
export interface RouteRoundaboutEnterStepDetails {
  Intersection: LocalizedString[];
  SteeringDirection?: string | redacted.Redacted<string>;
  TurnAngle?: number;
  TurnIntensity?: string | redacted.Redacted<string>;
}
export const RouteRoundaboutEnterStepDetails = S.suspend(() =>
  S.Struct({
    Intersection: LocalizedStringList,
    SteeringDirection: S.optional(SensitiveString),
    TurnAngle: S.optional(S.Number),
    TurnIntensity: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "RouteRoundaboutEnterStepDetails",
}) as any as S.Schema<RouteRoundaboutEnterStepDetails>;
export interface RouteRoundaboutExitStepDetails {
  Intersection: LocalizedString[];
  RelativeExit?: number;
  RoundaboutAngle?: number;
  SteeringDirection?: string | redacted.Redacted<string>;
}
export const RouteRoundaboutExitStepDetails = S.suspend(() =>
  S.Struct({
    Intersection: LocalizedStringList,
    RelativeExit: S.optional(S.Number),
    RoundaboutAngle: S.optional(S.Number),
    SteeringDirection: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "RouteRoundaboutExitStepDetails",
}) as any as S.Schema<RouteRoundaboutExitStepDetails>;
export interface RouteRoundaboutPassStepDetails {
  Intersection: LocalizedString[];
  SteeringDirection?: string | redacted.Redacted<string>;
  TurnAngle?: number;
  TurnIntensity?: string | redacted.Redacted<string>;
}
export const RouteRoundaboutPassStepDetails = S.suspend(() =>
  S.Struct({
    Intersection: LocalizedStringList,
    SteeringDirection: S.optional(SensitiveString),
    TurnAngle: S.optional(S.Number),
    TurnIntensity: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "RouteRoundaboutPassStepDetails",
}) as any as S.Schema<RouteRoundaboutPassStepDetails>;
export interface RouteTurnStepDetails {
  Intersection: LocalizedString[];
  SteeringDirection?: string | redacted.Redacted<string>;
  TurnAngle?: number;
  TurnIntensity?: string | redacted.Redacted<string>;
}
export const RouteTurnStepDetails = S.suspend(() =>
  S.Struct({
    Intersection: LocalizedStringList,
    SteeringDirection: S.optional(SensitiveString),
    TurnAngle: S.optional(S.Number),
    TurnIntensity: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "RouteTurnStepDetails",
}) as any as S.Schema<RouteTurnStepDetails>;
export interface RouteVehicleOverviewSummary {
  BestCaseDuration?: number;
  Distance: number;
  Duration: number;
  TypicalDuration?: number;
}
export const RouteVehicleOverviewSummary = S.suspend(() =>
  S.Struct({
    BestCaseDuration: S.optional(S.Number),
    Distance: S.Number,
    Duration: S.Number,
    TypicalDuration: S.optional(S.Number),
  }),
).annotations({
  identifier: "RouteVehicleOverviewSummary",
}) as any as S.Schema<RouteVehicleOverviewSummary>;
export interface RouteVehicleTravelOnlySummary {
  BestCaseDuration?: number;
  Duration: number;
  TypicalDuration?: number;
}
export const RouteVehicleTravelOnlySummary = S.suspend(() =>
  S.Struct({
    BestCaseDuration: S.optional(S.Number),
    Duration: S.Number,
    TypicalDuration: S.optional(S.Number),
  }),
).annotations({
  identifier: "RouteVehicleTravelOnlySummary",
}) as any as S.Schema<RouteVehicleTravelOnlySummary>;
export interface RouteTollPaymentSite {
  Name?: string;
  Position: number[];
}
export const RouteTollPaymentSite = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Position: Position23 }),
).annotations({
  identifier: "RouteTollPaymentSite",
}) as any as S.Schema<RouteTollPaymentSite>;
export type RouteTollPaymentSiteList = RouteTollPaymentSite[];
export const RouteTollPaymentSiteList = S.Array(RouteTollPaymentSite);
export interface RouteContinueHighwayStepDetails {
  Intersection: LocalizedString[];
  SteeringDirection?: string | redacted.Redacted<string>;
  TurnAngle?: number;
  TurnIntensity?: string | redacted.Redacted<string>;
}
export const RouteContinueHighwayStepDetails = S.suspend(() =>
  S.Struct({
    Intersection: LocalizedStringList,
    SteeringDirection: S.optional(SensitiveString),
    TurnAngle: S.optional(S.Number),
    TurnIntensity: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "RouteContinueHighwayStepDetails",
}) as any as S.Schema<RouteContinueHighwayStepDetails>;
export interface RouteEnterHighwayStepDetails {
  Intersection: LocalizedString[];
  SteeringDirection?: string | redacted.Redacted<string>;
  TurnAngle?: number;
  TurnIntensity?: string | redacted.Redacted<string>;
}
export const RouteEnterHighwayStepDetails = S.suspend(() =>
  S.Struct({
    Intersection: LocalizedStringList,
    SteeringDirection: S.optional(SensitiveString),
    TurnAngle: S.optional(S.Number),
    TurnIntensity: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "RouteEnterHighwayStepDetails",
}) as any as S.Schema<RouteEnterHighwayStepDetails>;
export interface RouteExitStepDetails {
  Intersection: LocalizedString[];
  RelativeExit?: number;
  SteeringDirection?: string | redacted.Redacted<string>;
  TurnAngle?: number;
  TurnIntensity?: string | redacted.Redacted<string>;
}
export const RouteExitStepDetails = S.suspend(() =>
  S.Struct({
    Intersection: LocalizedStringList,
    RelativeExit: S.optional(S.Number),
    SteeringDirection: S.optional(SensitiveString),
    TurnAngle: S.optional(S.Number),
    TurnIntensity: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "RouteExitStepDetails",
}) as any as S.Schema<RouteExitStepDetails>;
export interface RouteRampStepDetails {
  Intersection: LocalizedString[];
  SteeringDirection?: string | redacted.Redacted<string>;
  TurnAngle?: number;
  TurnIntensity?: string | redacted.Redacted<string>;
}
export const RouteRampStepDetails = S.suspend(() =>
  S.Struct({
    Intersection: LocalizedStringList,
    SteeringDirection: S.optional(SensitiveString),
    TurnAngle: S.optional(S.Number),
    TurnIntensity: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "RouteRampStepDetails",
}) as any as S.Schema<RouteRampStepDetails>;
export interface RouteUTurnStepDetails {
  Intersection: LocalizedString[];
  SteeringDirection?: string | redacted.Redacted<string>;
  TurnAngle?: number;
  TurnIntensity?: string | redacted.Redacted<string>;
}
export const RouteUTurnStepDetails = S.suspend(() =>
  S.Struct({
    Intersection: LocalizedStringList,
    SteeringDirection: S.optional(SensitiveString),
    TurnAngle: S.optional(S.Number),
    TurnIntensity: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "RouteUTurnStepDetails",
}) as any as S.Schema<RouteUTurnStepDetails>;
export interface RouteTollPriceValueRange {
  Min: number;
  Max: number;
}
export const RouteTollPriceValueRange = S.suspend(() =>
  S.Struct({ Min: S.Number, Max: S.Number }),
).annotations({
  identifier: "RouteTollPriceValueRange",
}) as any as S.Schema<RouteTollPriceValueRange>;
export interface IsolineConnection {
  FromPolygonIndex: number;
  Geometry: IsolineConnectionGeometry;
  ToPolygonIndex: number;
}
export const IsolineConnection = S.suspend(() =>
  S.Struct({
    FromPolygonIndex: S.Number,
    Geometry: IsolineConnectionGeometry,
    ToPolygonIndex: S.Number,
  }),
).annotations({
  identifier: "IsolineConnection",
}) as any as S.Schema<IsolineConnection>;
export type IsolineConnectionList = IsolineConnection[];
export const IsolineConnectionList = S.Array(IsolineConnection);
export interface RouteFerryArrival {
  Place: RouteFerryPlace;
  Time?: string | redacted.Redacted<string>;
}
export const RouteFerryArrival = S.suspend(() =>
  S.Struct({ Place: RouteFerryPlace, Time: S.optional(SensitiveString) }),
).annotations({
  identifier: "RouteFerryArrival",
}) as any as S.Schema<RouteFerryArrival>;
export interface RoutePassThroughWaypoint {
  GeometryOffset?: number;
  Place: RoutePassThroughPlace;
}
export const RoutePassThroughWaypoint = S.suspend(() =>
  S.Struct({
    GeometryOffset: S.optional(S.Number),
    Place: RoutePassThroughPlace,
  }),
).annotations({
  identifier: "RoutePassThroughWaypoint",
}) as any as S.Schema<RoutePassThroughWaypoint>;
export type RoutePassThroughWaypointList = RoutePassThroughWaypoint[];
export const RoutePassThroughWaypointList = S.Array(RoutePassThroughWaypoint);
export interface RouteFerrySummary {
  Overview?: RouteFerryOverviewSummary;
  TravelOnly?: RouteFerryTravelOnlySummary;
}
export const RouteFerrySummary = S.suspend(() =>
  S.Struct({
    Overview: S.optional(RouteFerryOverviewSummary),
    TravelOnly: S.optional(RouteFerryTravelOnlySummary),
  }),
).annotations({
  identifier: "RouteFerrySummary",
}) as any as S.Schema<RouteFerrySummary>;
export interface RoutePedestrianArrival {
  Place: RoutePedestrianPlace;
  Time?: string | redacted.Redacted<string>;
}
export const RoutePedestrianArrival = S.suspend(() =>
  S.Struct({ Place: RoutePedestrianPlace, Time: S.optional(SensitiveString) }),
).annotations({
  identifier: "RoutePedestrianArrival",
}) as any as S.Schema<RoutePedestrianArrival>;
export interface RoutePedestrianSpan {
  BestCaseDuration?: number;
  Country?: string | redacted.Redacted<string>;
  Distance?: number;
  Duration?: number;
  DynamicSpeed?: RouteSpanDynamicSpeedDetails;
  FunctionalClassification?: number;
  GeometryOffset?: number;
  Incidents?: number[];
  Names?: LocalizedString[];
  PedestrianAccess?: string | redacted.Redacted<string>[];
  Region?: string | redacted.Redacted<string>;
  RoadAttributes?: string | redacted.Redacted<string>[];
  RouteNumbers?: RouteNumber[];
  SpeedLimit?: RouteSpanSpeedLimitDetails;
  TypicalDuration?: number;
}
export const RoutePedestrianSpan = S.suspend(() =>
  S.Struct({
    BestCaseDuration: S.optional(S.Number),
    Country: S.optional(SensitiveString),
    Distance: S.optional(S.Number),
    Duration: S.optional(S.Number),
    DynamicSpeed: S.optional(RouteSpanDynamicSpeedDetails),
    FunctionalClassification: S.optional(S.Number),
    GeometryOffset: S.optional(S.Number),
    Incidents: S.optional(IndexList),
    Names: S.optional(LocalizedStringList),
    PedestrianAccess: S.optional(RouteSpanPedestrianAccessAttributeList),
    Region: S.optional(SensitiveString),
    RoadAttributes: S.optional(RouteSpanRoadAttributeList),
    RouteNumbers: S.optional(RouteNumberList),
    SpeedLimit: S.optional(RouteSpanSpeedLimitDetails),
    TypicalDuration: S.optional(S.Number),
  }),
).annotations({
  identifier: "RoutePedestrianSpan",
}) as any as S.Schema<RoutePedestrianSpan>;
export type RoutePedestrianSpanList = RoutePedestrianSpan[];
export const RoutePedestrianSpanList = S.Array(RoutePedestrianSpan);
export interface RoutePedestrianSummary {
  Overview?: RoutePedestrianOverviewSummary;
  TravelOnly?: RoutePedestrianTravelOnlySummary;
}
export const RoutePedestrianSummary = S.suspend(() =>
  S.Struct({
    Overview: S.optional(RoutePedestrianOverviewSummary),
    TravelOnly: S.optional(RoutePedestrianTravelOnlySummary),
  }),
).annotations({
  identifier: "RoutePedestrianSummary",
}) as any as S.Schema<RoutePedestrianSummary>;
export interface RouteVehicleArrival {
  Place: RouteVehiclePlace;
  Time?: string | redacted.Redacted<string>;
}
export const RouteVehicleArrival = S.suspend(() =>
  S.Struct({ Place: RouteVehiclePlace, Time: S.optional(SensitiveString) }),
).annotations({
  identifier: "RouteVehicleArrival",
}) as any as S.Schema<RouteVehicleArrival>;
export interface RouteVehicleSummary {
  Overview?: RouteVehicleOverviewSummary;
  TravelOnly?: RouteVehicleTravelOnlySummary;
}
export const RouteVehicleSummary = S.suspend(() =>
  S.Struct({
    Overview: S.optional(RouteVehicleOverviewSummary),
    TravelOnly: S.optional(RouteVehicleTravelOnlySummary),
  }),
).annotations({
  identifier: "RouteVehicleSummary",
}) as any as S.Schema<RouteVehicleSummary>;
export interface RouteSignpostLabel {
  RouteNumber?: RouteNumber;
  Text?: LocalizedString;
}
export const RouteSignpostLabel = S.suspend(() =>
  S.Struct({
    RouteNumber: S.optional(RouteNumber),
    Text: S.optional(LocalizedString),
  }),
).annotations({
  identifier: "RouteSignpostLabel",
}) as any as S.Schema<RouteSignpostLabel>;
export type RouteSignpostLabelList = RouteSignpostLabel[];
export const RouteSignpostLabelList = S.Array(RouteSignpostLabel);
export interface RouteSignpost {
  Labels: RouteSignpostLabel[];
}
export const RouteSignpost = S.suspend(() =>
  S.Struct({ Labels: RouteSignpostLabelList }),
).annotations({
  identifier: "RouteSignpost",
}) as any as S.Schema<RouteSignpost>;
export interface RouteVehicleTravelStep {
  ContinueHighwayStepDetails?: RouteContinueHighwayStepDetails;
  ContinueStepDetails?: RouteContinueStepDetails;
  CurrentRoad?: RouteRoad;
  Distance?: number;
  Duration: number;
  EnterHighwayStepDetails?: RouteEnterHighwayStepDetails;
  ExitNumber?: LocalizedString[];
  ExitStepDetails?: RouteExitStepDetails;
  GeometryOffset?: number;
  Instruction?: string | redacted.Redacted<string>;
  KeepStepDetails?: RouteKeepStepDetails;
  NextRoad?: RouteRoad;
  RampStepDetails?: RouteRampStepDetails;
  RoundaboutEnterStepDetails?: RouteRoundaboutEnterStepDetails;
  RoundaboutExitStepDetails?: RouteRoundaboutExitStepDetails;
  RoundaboutPassStepDetails?: RouteRoundaboutPassStepDetails;
  Signpost?: RouteSignpost;
  TurnStepDetails?: RouteTurnStepDetails;
  Type: string | redacted.Redacted<string>;
  UTurnStepDetails?: RouteUTurnStepDetails;
}
export const RouteVehicleTravelStep = S.suspend(() =>
  S.Struct({
    ContinueHighwayStepDetails: S.optional(RouteContinueHighwayStepDetails),
    ContinueStepDetails: S.optional(RouteContinueStepDetails),
    CurrentRoad: S.optional(RouteRoad),
    Distance: S.optional(S.Number),
    Duration: S.Number,
    EnterHighwayStepDetails: S.optional(RouteEnterHighwayStepDetails),
    ExitNumber: S.optional(LocalizedStringList),
    ExitStepDetails: S.optional(RouteExitStepDetails),
    GeometryOffset: S.optional(S.Number),
    Instruction: S.optional(SensitiveString),
    KeepStepDetails: S.optional(RouteKeepStepDetails),
    NextRoad: S.optional(RouteRoad),
    RampStepDetails: S.optional(RouteRampStepDetails),
    RoundaboutEnterStepDetails: S.optional(RouteRoundaboutEnterStepDetails),
    RoundaboutExitStepDetails: S.optional(RouteRoundaboutExitStepDetails),
    RoundaboutPassStepDetails: S.optional(RouteRoundaboutPassStepDetails),
    Signpost: S.optional(RouteSignpost),
    TurnStepDetails: S.optional(RouteTurnStepDetails),
    Type: SensitiveString,
    UTurnStepDetails: S.optional(RouteUTurnStepDetails),
  }),
).annotations({
  identifier: "RouteVehicleTravelStep",
}) as any as S.Schema<RouteVehicleTravelStep>;
export type RouteVehicleTravelStepList = RouteVehicleTravelStep[];
export const RouteVehicleTravelStepList = S.Array(RouteVehicleTravelStep);
export interface RouteTollPriceSummary {
  Currency: string;
  Estimate: boolean;
  Range: boolean;
  RangeValue?: RouteTollPriceValueRange;
  Value: number;
}
export const RouteTollPriceSummary = S.suspend(() =>
  S.Struct({
    Currency: S.String,
    Estimate: S.Boolean,
    Range: S.Boolean,
    RangeValue: S.optional(RouteTollPriceValueRange),
    Value: S.Number,
  }),
).annotations({
  identifier: "RouteTollPriceSummary",
}) as any as S.Schema<RouteTollPriceSummary>;
export interface Isoline {
  Connections: IsolineConnection[];
  DistanceThreshold?: number;
  Geometries: IsolineShapeGeometry[];
  TimeThreshold?: number;
}
export const Isoline = S.suspend(() =>
  S.Struct({
    Connections: IsolineConnectionList,
    DistanceThreshold: S.optional(S.Number),
    Geometries: IsolineShapeGeometryList,
    TimeThreshold: S.optional(S.Number),
  }),
).annotations({ identifier: "Isoline" }) as any as S.Schema<Isoline>;
export type IsolineList = Isoline[];
export const IsolineList = S.Array(Isoline);
export interface RouteTollPrice {
  Currency: string;
  Estimate: boolean;
  PerDuration?: number;
  Range: boolean;
  RangeValue?: RouteTollPriceValueRange;
  Value: number;
}
export const RouteTollPrice = S.suspend(() =>
  S.Struct({
    Currency: S.String,
    Estimate: S.Boolean,
    PerDuration: S.optional(S.Number),
    Range: S.Boolean,
    RangeValue: S.optional(RouteTollPriceValueRange),
    Value: S.Number,
  }),
).annotations({
  identifier: "RouteTollPrice",
}) as any as S.Schema<RouteTollPrice>;
export interface RouteTransponder {
  SystemName?: string | redacted.Redacted<string>;
}
export const RouteTransponder = S.suspend(() =>
  S.Struct({ SystemName: S.optional(SensitiveString) }),
).annotations({
  identifier: "RouteTransponder",
}) as any as S.Schema<RouteTransponder>;
export type RouteTransponderList = RouteTransponder[];
export const RouteTransponderList = S.Array(RouteTransponder);
export interface RouteFerryLegDetails {
  AfterTravelSteps: RouteFerryAfterTravelStep[];
  Arrival: RouteFerryArrival;
  BeforeTravelSteps: RouteFerryBeforeTravelStep[];
  Departure: RouteFerryDeparture;
  Notices: RouteFerryNotice[];
  PassThroughWaypoints: RoutePassThroughWaypoint[];
  RouteName?: string | redacted.Redacted<string>;
  Spans: RouteFerrySpan[];
  Summary?: RouteFerrySummary;
  TravelSteps: RouteFerryTravelStep[];
}
export const RouteFerryLegDetails = S.suspend(() =>
  S.Struct({
    AfterTravelSteps: RouteFerryAfterTravelStepList,
    Arrival: RouteFerryArrival,
    BeforeTravelSteps: RouteFerryBeforeTravelStepList,
    Departure: RouteFerryDeparture,
    Notices: RouteFerryNoticeList,
    PassThroughWaypoints: RoutePassThroughWaypointList,
    RouteName: S.optional(SensitiveString),
    Spans: RouteFerrySpanList,
    Summary: S.optional(RouteFerrySummary),
    TravelSteps: RouteFerryTravelStepList,
  }),
).annotations({
  identifier: "RouteFerryLegDetails",
}) as any as S.Schema<RouteFerryLegDetails>;
export interface RouteTollSummary {
  Total?: RouteTollPriceSummary;
}
export const RouteTollSummary = S.suspend(() =>
  S.Struct({ Total: S.optional(RouteTollPriceSummary) }),
).annotations({
  identifier: "RouteTollSummary",
}) as any as S.Schema<RouteTollSummary>;
export interface CalculateIsolinesResponse {
  ArrivalTime?: string | redacted.Redacted<string>;
  DepartureTime?: string | redacted.Redacted<string>;
  IsolineGeometryFormat: string;
  Isolines: Isoline[];
  PricingBucket: string;
  SnappedDestination?: number[];
  SnappedOrigin?: number[];
}
export const CalculateIsolinesResponse = S.suspend(() =>
  S.Struct({
    ArrivalTime: S.optional(SensitiveString),
    DepartureTime: S.optional(SensitiveString),
    IsolineGeometryFormat: S.String,
    Isolines: IsolineList,
    PricingBucket: S.String.pipe(T.HttpHeader("x-amz-geo-pricing-bucket")),
    SnappedDestination: S.optional(Position),
    SnappedOrigin: S.optional(Position),
  }),
).annotations({
  identifier: "CalculateIsolinesResponse",
}) as any as S.Schema<CalculateIsolinesResponse>;
export interface RouteNoticeDetailRange {
  Min?: number;
  Max?: number;
}
export const RouteNoticeDetailRange = S.suspend(() =>
  S.Struct({ Min: S.optional(S.Number), Max: S.optional(S.Number) }),
).annotations({
  identifier: "RouteNoticeDetailRange",
}) as any as S.Schema<RouteNoticeDetailRange>;
export interface RouteWeightConstraint {
  Type: string;
  Value: number;
}
export const RouteWeightConstraint = S.suspend(() =>
  S.Struct({ Type: S.String, Value: S.Number }),
).annotations({
  identifier: "RouteWeightConstraint",
}) as any as S.Schema<RouteWeightConstraint>;
export interface RouteTollPassValidityPeriod {
  Period: string | redacted.Redacted<string>;
  PeriodCount?: number;
}
export const RouteTollPassValidityPeriod = S.suspend(() =>
  S.Struct({ Period: SensitiveString, PeriodCount: S.optional(S.Number) }),
).annotations({
  identifier: "RouteTollPassValidityPeriod",
}) as any as S.Schema<RouteTollPassValidityPeriod>;
export interface RouteSummary {
  Distance?: number;
  Duration?: number;
  Tolls?: RouteTollSummary;
}
export const RouteSummary = S.suspend(() =>
  S.Struct({
    Distance: S.optional(S.Number),
    Duration: S.optional(S.Number),
    Tolls: S.optional(RouteTollSummary),
  }),
).annotations({ identifier: "RouteSummary" }) as any as S.Schema<RouteSummary>;
export interface RoutePedestrianTravelStep {
  ContinueStepDetails?: RouteContinueStepDetails;
  CurrentRoad?: RouteRoad;
  Distance?: number;
  Duration: number;
  ExitNumber?: LocalizedString[];
  GeometryOffset?: number;
  Instruction?: string | redacted.Redacted<string>;
  KeepStepDetails?: RouteKeepStepDetails;
  NextRoad?: RouteRoad;
  RoundaboutEnterStepDetails?: RouteRoundaboutEnterStepDetails;
  RoundaboutExitStepDetails?: RouteRoundaboutExitStepDetails;
  RoundaboutPassStepDetails?: RouteRoundaboutPassStepDetails;
  Signpost?: RouteSignpost;
  TurnStepDetails?: RouteTurnStepDetails;
  Type: string | redacted.Redacted<string>;
}
export const RoutePedestrianTravelStep = S.suspend(() =>
  S.Struct({
    ContinueStepDetails: S.optional(RouteContinueStepDetails),
    CurrentRoad: S.optional(RouteRoad),
    Distance: S.optional(S.Number),
    Duration: S.Number,
    ExitNumber: S.optional(LocalizedStringList),
    GeometryOffset: S.optional(S.Number),
    Instruction: S.optional(SensitiveString),
    KeepStepDetails: S.optional(RouteKeepStepDetails),
    NextRoad: S.optional(RouteRoad),
    RoundaboutEnterStepDetails: S.optional(RouteRoundaboutEnterStepDetails),
    RoundaboutExitStepDetails: S.optional(RouteRoundaboutExitStepDetails),
    RoundaboutPassStepDetails: S.optional(RouteRoundaboutPassStepDetails),
    Signpost: S.optional(RouteSignpost),
    TurnStepDetails: S.optional(RouteTurnStepDetails),
    Type: SensitiveString,
  }),
).annotations({
  identifier: "RoutePedestrianTravelStep",
}) as any as S.Schema<RoutePedestrianTravelStep>;
export type RoutePedestrianTravelStepList = RoutePedestrianTravelStep[];
export const RoutePedestrianTravelStepList = S.Array(RoutePedestrianTravelStep);
export interface RouteViolatedConstraints {
  AllHazardsRestricted?: boolean;
  AxleCount?: RouteNoticeDetailRange;
  HazardousCargos: string | redacted.Redacted<string>[];
  MaxHeight?: number;
  MaxKpraLength?: number;
  MaxLength?: number;
  MaxPayloadCapacity?: number;
  MaxWeight?: RouteWeightConstraint;
  MaxWeightPerAxle?: number;
  MaxWeightPerAxleGroup?: WeightPerAxleGroup;
  MaxWidth?: number;
  Occupancy?: RouteNoticeDetailRange;
  RestrictedTimes?: string;
  TimeDependent?: boolean;
  TrailerCount?: RouteNoticeDetailRange;
  TravelMode?: boolean;
  TruckRoadType?: string;
  TruckType?: string | redacted.Redacted<string>;
  TunnelRestrictionCode?: string | redacted.Redacted<string>;
}
export const RouteViolatedConstraints = S.suspend(() =>
  S.Struct({
    AllHazardsRestricted: S.optional(S.Boolean),
    AxleCount: S.optional(RouteNoticeDetailRange),
    HazardousCargos: RouteHazardousCargoTypeList,
    MaxHeight: S.optional(S.Number),
    MaxKpraLength: S.optional(S.Number),
    MaxLength: S.optional(S.Number),
    MaxPayloadCapacity: S.optional(S.Number),
    MaxWeight: S.optional(RouteWeightConstraint),
    MaxWeightPerAxle: S.optional(S.Number),
    MaxWeightPerAxleGroup: S.optional(WeightPerAxleGroup),
    MaxWidth: S.optional(S.Number),
    Occupancy: S.optional(RouteNoticeDetailRange),
    RestrictedTimes: S.optional(S.String),
    TimeDependent: S.optional(S.Boolean),
    TrailerCount: S.optional(RouteNoticeDetailRange),
    TravelMode: S.optional(S.Boolean),
    TruckRoadType: S.optional(S.String),
    TruckType: S.optional(SensitiveString),
    TunnelRestrictionCode: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "RouteViolatedConstraints",
}) as any as S.Schema<RouteViolatedConstraints>;
export interface RouteTollPass {
  IncludesReturnTrip?: boolean;
  SeniorPass?: boolean;
  TransferCount?: number;
  TripCount?: number;
  ValidityPeriod?: RouteTollPassValidityPeriod;
}
export const RouteTollPass = S.suspend(() =>
  S.Struct({
    IncludesReturnTrip: S.optional(S.Boolean),
    SeniorPass: S.optional(S.Boolean),
    TransferCount: S.optional(S.Number),
    TripCount: S.optional(S.Number),
    ValidityPeriod: S.optional(RouteTollPassValidityPeriod),
  }),
).annotations({
  identifier: "RouteTollPass",
}) as any as S.Schema<RouteTollPass>;
export interface RoutePedestrianLegDetails {
  Arrival: RoutePedestrianArrival;
  Departure: RoutePedestrianDeparture;
  Notices: RoutePedestrianNotice[];
  PassThroughWaypoints: RoutePassThroughWaypoint[];
  Spans: RoutePedestrianSpan[];
  Summary?: RoutePedestrianSummary;
  TravelSteps: RoutePedestrianTravelStep[];
}
export const RoutePedestrianLegDetails = S.suspend(() =>
  S.Struct({
    Arrival: RoutePedestrianArrival,
    Departure: RoutePedestrianDeparture,
    Notices: RoutePedestrianNoticeList,
    PassThroughWaypoints: RoutePassThroughWaypointList,
    Spans: RoutePedestrianSpanList,
    Summary: S.optional(RoutePedestrianSummary),
    TravelSteps: RoutePedestrianTravelStepList,
  }),
).annotations({
  identifier: "RoutePedestrianLegDetails",
}) as any as S.Schema<RoutePedestrianLegDetails>;
export interface RouteVehicleNoticeDetail {
  Title?: string | redacted.Redacted<string>;
  ViolatedConstraints?: RouteViolatedConstraints;
}
export const RouteVehicleNoticeDetail = S.suspend(() =>
  S.Struct({
    Title: S.optional(SensitiveString),
    ViolatedConstraints: S.optional(RouteViolatedConstraints),
  }),
).annotations({
  identifier: "RouteVehicleNoticeDetail",
}) as any as S.Schema<RouteVehicleNoticeDetail>;
export type RouteVehicleNoticeDetailList = RouteVehicleNoticeDetail[];
export const RouteVehicleNoticeDetailList = S.Array(RouteVehicleNoticeDetail);
export interface RouteTollRate {
  ApplicableTimes?: string | redacted.Redacted<string>;
  ConvertedPrice?: RouteTollPrice;
  Id: string | redacted.Redacted<string>;
  LocalPrice: RouteTollPrice;
  Name: string | redacted.Redacted<string>;
  Pass?: RouteTollPass;
  PaymentMethods: string | redacted.Redacted<string>[];
  Transponders: RouteTransponder[];
}
export const RouteTollRate = S.suspend(() =>
  S.Struct({
    ApplicableTimes: S.optional(SensitiveString),
    ConvertedPrice: S.optional(RouteTollPrice),
    Id: SensitiveString,
    LocalPrice: RouteTollPrice,
    Name: SensitiveString,
    Pass: S.optional(RouteTollPass),
    PaymentMethods: RouteTollPaymentMethodList,
    Transponders: RouteTransponderList,
  }),
).annotations({
  identifier: "RouteTollRate",
}) as any as S.Schema<RouteTollRate>;
export type RouteTollRateList = RouteTollRate[];
export const RouteTollRateList = S.Array(RouteTollRate);
export interface RouteVehicleNotice {
  Code: string;
  Details: RouteVehicleNoticeDetail[];
  Impact?: string;
}
export const RouteVehicleNotice = S.suspend(() =>
  S.Struct({
    Code: S.String,
    Details: RouteVehicleNoticeDetailList,
    Impact: S.optional(S.String),
  }),
).annotations({
  identifier: "RouteVehicleNotice",
}) as any as S.Schema<RouteVehicleNotice>;
export type RouteVehicleNoticeList = RouteVehicleNotice[];
export const RouteVehicleNoticeList = S.Array(RouteVehicleNotice);
export interface RouteToll {
  Country?: string | redacted.Redacted<string>;
  PaymentSites: RouteTollPaymentSite[];
  Rates: RouteTollRate[];
  Systems: number[];
}
export const RouteToll = S.suspend(() =>
  S.Struct({
    Country: S.optional(SensitiveString),
    PaymentSites: RouteTollPaymentSiteList,
    Rates: RouteTollRateList,
    Systems: IndexList,
  }),
).annotations({ identifier: "RouteToll" }) as any as S.Schema<RouteToll>;
export type RouteTollList = RouteToll[];
export const RouteTollList = S.Array(RouteToll);
export interface ValidationExceptionField {
  Name: string;
  Message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.JsonName("name")),
    Message: S.String.pipe(T.JsonName("message")),
  }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export interface RouteVehicleLegDetails {
  Arrival: RouteVehicleArrival;
  Departure: RouteVehicleDeparture;
  Incidents: RouteVehicleIncident[];
  Notices: RouteVehicleNotice[];
  PassThroughWaypoints: RoutePassThroughWaypoint[];
  Spans: RouteVehicleSpan[];
  Summary?: RouteVehicleSummary;
  Tolls: RouteToll[];
  TollSystems: RouteTollSystem[];
  TravelSteps: RouteVehicleTravelStep[];
  TruckRoadTypes: string | redacted.Redacted<string>[];
  Zones: RouteZone[];
}
export const RouteVehicleLegDetails = S.suspend(() =>
  S.Struct({
    Arrival: RouteVehicleArrival,
    Departure: RouteVehicleDeparture,
    Incidents: RouteVehicleIncidentList,
    Notices: RouteVehicleNoticeList,
    PassThroughWaypoints: RoutePassThroughWaypointList,
    Spans: RouteVehicleSpanList,
    Summary: S.optional(RouteVehicleSummary),
    Tolls: RouteTollList,
    TollSystems: RouteTollSystemList,
    TravelSteps: RouteVehicleTravelStepList,
    TruckRoadTypes: TruckRoadTypeList,
    Zones: RouteZoneList,
  }),
).annotations({
  identifier: "RouteVehicleLegDetails",
}) as any as S.Schema<RouteVehicleLegDetails>;
export interface RouteLeg {
  FerryLegDetails?: RouteFerryLegDetails;
  Geometry: RouteLegGeometry;
  Language?: string;
  PedestrianLegDetails?: RoutePedestrianLegDetails;
  TravelMode: string | redacted.Redacted<string>;
  Type: string | redacted.Redacted<string>;
  VehicleLegDetails?: RouteVehicleLegDetails;
}
export const RouteLeg = S.suspend(() =>
  S.Struct({
    FerryLegDetails: S.optional(RouteFerryLegDetails),
    Geometry: RouteLegGeometry,
    Language: S.optional(S.String),
    PedestrianLegDetails: S.optional(RoutePedestrianLegDetails),
    TravelMode: SensitiveString,
    Type: SensitiveString,
    VehicleLegDetails: S.optional(RouteVehicleLegDetails),
  }),
).annotations({ identifier: "RouteLeg" }) as any as S.Schema<RouteLeg>;
export type RouteLegList = RouteLeg[];
export const RouteLegList = S.Array(RouteLeg);
export interface Route {
  Legs: RouteLeg[];
  MajorRoadLabels: RouteMajorRoadLabel[];
  Summary?: RouteSummary;
}
export const Route = S.suspend(() =>
  S.Struct({
    Legs: RouteLegList,
    MajorRoadLabels: RouteMajorRoadLabelList,
    Summary: S.optional(RouteSummary),
  }),
).annotations({ identifier: "Route" }) as any as S.Schema<Route>;
export type RouteList = Route[];
export const RouteList = S.Array(Route);
export interface CalculateRoutesResponse {
  LegGeometryFormat: string;
  Notices: RouteResponseNotice[];
  PricingBucket: string;
  Routes: Route[];
}
export const CalculateRoutesResponse = S.suspend(() =>
  S.Struct({
    LegGeometryFormat: S.String,
    Notices: RouteResponseNoticeList,
    PricingBucket: S.String.pipe(T.HttpHeader("x-amz-geo-pricing-bucket")),
    Routes: RouteList,
  }),
).annotations({
  identifier: "CalculateRoutesResponse",
}) as any as S.Schema<CalculateRoutesResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String.pipe(T.JsonName("message")) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String.pipe(T.JsonName("message")) },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String.pipe(T.JsonName("message")) },
  T.Retryable(),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String.pipe(T.JsonName("message")),
    Reason: S.String.pipe(T.JsonName("reason")),
    FieldList: ValidationExceptionFieldList.pipe(T.JsonName("fieldList")),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Use `CalculateRouteMatrix` to compute results for all pairs of Origins to Destinations. Each row corresponds to one entry in Origins. Each entry in the row corresponds to the route from that entry in Origins to an entry in Destinations positions.
 */
export const calculateRouteMatrix: (
  input: CalculateRouteMatrixRequest,
) => effect.Effect<
  CalculateRouteMatrixResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CalculateRouteMatrixRequest,
  output: CalculateRouteMatrixResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * `OptimizeWaypoints` calculates the optimal order to travel between a set of waypoints to minimize either the travel time or the distance travelled during the journey, based on road network restrictions and the traffic pattern data.
 */
export const optimizeWaypoints: (
  input: OptimizeWaypointsRequest,
) => effect.Effect<
  OptimizeWaypointsResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: OptimizeWaypointsRequest,
  output: OptimizeWaypointsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * `SnapToRoads` matches GPS trace to roads most likely traveled on.
 */
export const snapToRoads: (
  input: SnapToRoadsRequest,
) => effect.Effect<
  SnapToRoadsResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SnapToRoadsRequest,
  output: SnapToRoadsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Use the `CalculateIsolines` action to find service areas that can be reached in a given threshold of time, distance.
 */
export const calculateIsolines: (
  input: CalculateIsolinesRequest,
) => effect.Effect<
  CalculateIsolinesResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CalculateIsolinesRequest,
  output: CalculateIsolinesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * `CalculateRoutes` computes routes given the following required parameters: `Origin` and `Destination`.
 */
export const calculateRoutes: (
  input: CalculateRoutesRequest,
) => effect.Effect<
  CalculateRoutesResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CalculateRoutesRequest,
  output: CalculateRoutesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
