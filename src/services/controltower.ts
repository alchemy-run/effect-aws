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
  sdkId: "ControlTower",
  serviceShapeName: "AWSControlTowerApis",
});
const auth = T.AwsAuthSigv4({ name: "controltower" });
const ver = T.ServiceVersion("2018-05-10");
const proto = T.AwsProtocolsRestJson1();
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
              `https://controltower-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://controltower-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://controltower.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://controltower.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ControlIdentifier = string;
export type TargetIdentifier = string;
export type Arn = string;
export type OperationIdentifier = string;
export type BaselineArn = string;
export type ListBaselinesMaxResults = number;
export type ListControlOperationsNextToken = string;
export type ListControlOperationsMaxResults = number;
export type BaselineVersion = string;
export type ListEnabledBaselinesNextToken = string;
export type ListEnabledBaselinesMaxResults = number;
export type MaxResults = number;
export type ListLandingZoneOperationsMaxResults = number;
export type LandingZoneVersion = string;
export type ListLandingZonesMaxResults = number;
export type TagKey = string;
export type TagValue = string;
export type ParentIdentifier = string;
export type RegionName = string;

//# Schemas
export type RemediationTypes = string[];
export const RemediationTypes = S.Array(S.String);
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export interface DisableControlInput {
  controlIdentifier?: string;
  targetIdentifier?: string;
  enabledControlIdentifier?: string;
}
export const DisableControlInput = S.suspend(() =>
  S.Struct({
    controlIdentifier: S.optional(S.String),
    targetIdentifier: S.optional(S.String),
    enabledControlIdentifier: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/disable-control" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableControlInput",
}) as any as S.Schema<DisableControlInput>;
export interface GetBaselineOperationInput {
  operationIdentifier: string;
}
export const GetBaselineOperationInput = S.suspend(() =>
  S.Struct({ operationIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/get-baseline-operation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBaselineOperationInput",
}) as any as S.Schema<GetBaselineOperationInput>;
export interface GetBaselineInput {
  baselineIdentifier: string;
}
export const GetBaselineInput = S.suspend(() =>
  S.Struct({ baselineIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/get-baseline" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBaselineInput",
}) as any as S.Schema<GetBaselineInput>;
export interface ListBaselinesInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListBaselinesInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-baselines" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBaselinesInput",
}) as any as S.Schema<ListBaselinesInput>;
export interface GetControlOperationInput {
  operationIdentifier: string;
}
export const GetControlOperationInput = S.suspend(() =>
  S.Struct({ operationIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/get-control-operation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetControlOperationInput",
}) as any as S.Schema<GetControlOperationInput>;
export interface GetEnabledBaselineInput {
  enabledBaselineIdentifier: string;
}
export const GetEnabledBaselineInput = S.suspend(() =>
  S.Struct({ enabledBaselineIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/get-enabled-baseline" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEnabledBaselineInput",
}) as any as S.Schema<GetEnabledBaselineInput>;
export interface EnabledBaselineParameter {
  key: string;
  value: any;
}
export const EnabledBaselineParameter = S.suspend(() =>
  S.Struct({ key: S.String, value: S.Any }),
).annotations({
  identifier: "EnabledBaselineParameter",
}) as any as S.Schema<EnabledBaselineParameter>;
export type EnabledBaselineParameters = EnabledBaselineParameter[];
export const EnabledBaselineParameters = S.Array(EnabledBaselineParameter);
export interface UpdateEnabledBaselineInput {
  baselineVersion: string;
  parameters?: EnabledBaselineParameters;
  enabledBaselineIdentifier: string;
}
export const UpdateEnabledBaselineInput = S.suspend(() =>
  S.Struct({
    baselineVersion: S.String,
    parameters: S.optional(EnabledBaselineParameters),
    enabledBaselineIdentifier: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/update-enabled-baseline" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEnabledBaselineInput",
}) as any as S.Schema<UpdateEnabledBaselineInput>;
export interface DisableBaselineInput {
  enabledBaselineIdentifier: string;
}
export const DisableBaselineInput = S.suspend(() =>
  S.Struct({ enabledBaselineIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/disable-baseline" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableBaselineInput",
}) as any as S.Schema<DisableBaselineInput>;
export interface ResetEnabledBaselineInput {
  enabledBaselineIdentifier: string;
}
export const ResetEnabledBaselineInput = S.suspend(() =>
  S.Struct({ enabledBaselineIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/reset-enabled-baseline" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ResetEnabledBaselineInput",
}) as any as S.Schema<ResetEnabledBaselineInput>;
export interface GetEnabledControlInput {
  enabledControlIdentifier: string;
}
export const GetEnabledControlInput = S.suspend(() =>
  S.Struct({ enabledControlIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/get-enabled-control" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEnabledControlInput",
}) as any as S.Schema<GetEnabledControlInput>;
export interface EnabledControlParameter {
  key: string;
  value: any;
}
export const EnabledControlParameter = S.suspend(() =>
  S.Struct({ key: S.String, value: S.Any }),
).annotations({
  identifier: "EnabledControlParameter",
}) as any as S.Schema<EnabledControlParameter>;
export type EnabledControlParameters = EnabledControlParameter[];
export const EnabledControlParameters = S.Array(EnabledControlParameter);
export interface UpdateEnabledControlInput {
  parameters: EnabledControlParameters;
  enabledControlIdentifier: string;
}
export const UpdateEnabledControlInput = S.suspend(() =>
  S.Struct({
    parameters: EnabledControlParameters,
    enabledControlIdentifier: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/update-enabled-control" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEnabledControlInput",
}) as any as S.Schema<UpdateEnabledControlInput>;
export interface ResetEnabledControlInput {
  enabledControlIdentifier: string;
}
export const ResetEnabledControlInput = S.suspend(() =>
  S.Struct({ enabledControlIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/reset-enabled-control" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ResetEnabledControlInput",
}) as any as S.Schema<ResetEnabledControlInput>;
export interface GetLandingZoneOperationInput {
  operationIdentifier: string;
}
export const GetLandingZoneOperationInput = S.suspend(() =>
  S.Struct({ operationIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/get-landingzone-operation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLandingZoneOperationInput",
}) as any as S.Schema<GetLandingZoneOperationInput>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface CreateLandingZoneInput {
  version: string;
  remediationTypes?: RemediationTypes;
  tags?: TagMap;
  manifest?: any;
}
export const CreateLandingZoneInput = S.suspend(() =>
  S.Struct({
    version: S.String,
    remediationTypes: S.optional(RemediationTypes),
    tags: S.optional(TagMap),
    manifest: S.optional(S.Any),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/create-landingzone" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLandingZoneInput",
}) as any as S.Schema<CreateLandingZoneInput>;
export interface GetLandingZoneInput {
  landingZoneIdentifier: string;
}
export const GetLandingZoneInput = S.suspend(() =>
  S.Struct({ landingZoneIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/get-landingzone" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLandingZoneInput",
}) as any as S.Schema<GetLandingZoneInput>;
export interface UpdateLandingZoneInput {
  version: string;
  remediationTypes?: RemediationTypes;
  landingZoneIdentifier: string;
  manifest?: any;
}
export const UpdateLandingZoneInput = S.suspend(() =>
  S.Struct({
    version: S.String,
    remediationTypes: S.optional(RemediationTypes),
    landingZoneIdentifier: S.String,
    manifest: S.optional(S.Any),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/update-landingzone" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLandingZoneInput",
}) as any as S.Schema<UpdateLandingZoneInput>;
export interface DeleteLandingZoneInput {
  landingZoneIdentifier: string;
}
export const DeleteLandingZoneInput = S.suspend(() =>
  S.Struct({ landingZoneIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/delete-landingzone" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLandingZoneInput",
}) as any as S.Schema<DeleteLandingZoneInput>;
export interface ListLandingZonesInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListLandingZonesInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-landingzones" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLandingZonesInput",
}) as any as S.Schema<ListLandingZonesInput>;
export interface ResetLandingZoneInput {
  landingZoneIdentifier: string;
}
export const ResetLandingZoneInput = S.suspend(() =>
  S.Struct({ landingZoneIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/reset-landingzone" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ResetLandingZoneInput",
}) as any as S.Schema<ResetLandingZoneInput>;
export interface ListTagsForResourceInput {
  resourceArn: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
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
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export interface TagResourceInput {
  resourceArn: string;
  tags: TagMap;
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagMap,
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
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface TagResourceOutput {}
export const TagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceOutput",
}) as any as S.Schema<TagResourceOutput>;
export interface UntagResourceInput {
  resourceArn: string;
  tagKeys: TagKeys;
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
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
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UntagResourceOutput {}
export const UntagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceOutput",
}) as any as S.Schema<UntagResourceOutput>;
export type ControlIdentifiers = string[];
export const ControlIdentifiers = S.Array(S.String);
export type TargetIdentifiers = string[];
export const TargetIdentifiers = S.Array(S.String);
export type EnabledControlIdentifiers = string[];
export const EnabledControlIdentifiers = S.Array(S.String);
export type ControlOperationStatuses = string[];
export const ControlOperationStatuses = S.Array(S.String);
export type ControlOperationTypes = string[];
export const ControlOperationTypes = S.Array(S.String);
export type EnabledBaselineTargetIdentifiers = string[];
export const EnabledBaselineTargetIdentifiers = S.Array(S.String);
export type EnabledBaselineBaselineIdentifiers = string[];
export const EnabledBaselineBaselineIdentifiers = S.Array(S.String);
export type EnabledBaselineParentIdentifiers = string[];
export const EnabledBaselineParentIdentifiers = S.Array(S.String);
export type EnabledBaselineEnablementStatuses = string[];
export const EnabledBaselineEnablementStatuses = S.Array(S.String);
export type EnabledBaselineDriftStatuses = string[];
export const EnabledBaselineDriftStatuses = S.Array(S.String);
export type EnablementStatuses = string[];
export const EnablementStatuses = S.Array(S.String);
export type DriftStatuses = string[];
export const DriftStatuses = S.Array(S.String);
export type ParentIdentifiers = string[];
export const ParentIdentifiers = S.Array(S.String);
export type LandingZoneOperationTypes = string[];
export const LandingZoneOperationTypes = S.Array(S.String);
export type LandingZoneOperationStatuses = string[];
export const LandingZoneOperationStatuses = S.Array(S.String);
export interface ControlOperationFilter {
  controlIdentifiers?: ControlIdentifiers;
  targetIdentifiers?: TargetIdentifiers;
  enabledControlIdentifiers?: EnabledControlIdentifiers;
  statuses?: ControlOperationStatuses;
  controlOperationTypes?: ControlOperationTypes;
}
export const ControlOperationFilter = S.suspend(() =>
  S.Struct({
    controlIdentifiers: S.optional(ControlIdentifiers),
    targetIdentifiers: S.optional(TargetIdentifiers),
    enabledControlIdentifiers: S.optional(EnabledControlIdentifiers),
    statuses: S.optional(ControlOperationStatuses),
    controlOperationTypes: S.optional(ControlOperationTypes),
  }),
).annotations({
  identifier: "ControlOperationFilter",
}) as any as S.Schema<ControlOperationFilter>;
export interface EnabledBaselineFilter {
  targetIdentifiers?: EnabledBaselineTargetIdentifiers;
  baselineIdentifiers?: EnabledBaselineBaselineIdentifiers;
  parentIdentifiers?: EnabledBaselineParentIdentifiers;
  statuses?: EnabledBaselineEnablementStatuses;
  inheritanceDriftStatuses?: EnabledBaselineDriftStatuses;
}
export const EnabledBaselineFilter = S.suspend(() =>
  S.Struct({
    targetIdentifiers: S.optional(EnabledBaselineTargetIdentifiers),
    baselineIdentifiers: S.optional(EnabledBaselineBaselineIdentifiers),
    parentIdentifiers: S.optional(EnabledBaselineParentIdentifiers),
    statuses: S.optional(EnabledBaselineEnablementStatuses),
    inheritanceDriftStatuses: S.optional(EnabledBaselineDriftStatuses),
  }),
).annotations({
  identifier: "EnabledBaselineFilter",
}) as any as S.Schema<EnabledBaselineFilter>;
export interface EnabledControlFilter {
  controlIdentifiers?: ControlIdentifiers;
  statuses?: EnablementStatuses;
  driftStatuses?: DriftStatuses;
  parentIdentifiers?: ParentIdentifiers;
  inheritanceDriftStatuses?: DriftStatuses;
  resourceDriftStatuses?: DriftStatuses;
}
export const EnabledControlFilter = S.suspend(() =>
  S.Struct({
    controlIdentifiers: S.optional(ControlIdentifiers),
    statuses: S.optional(EnablementStatuses),
    driftStatuses: S.optional(DriftStatuses),
    parentIdentifiers: S.optional(ParentIdentifiers),
    inheritanceDriftStatuses: S.optional(DriftStatuses),
    resourceDriftStatuses: S.optional(DriftStatuses),
  }),
).annotations({
  identifier: "EnabledControlFilter",
}) as any as S.Schema<EnabledControlFilter>;
export interface LandingZoneOperationFilter {
  types?: LandingZoneOperationTypes;
  statuses?: LandingZoneOperationStatuses;
}
export const LandingZoneOperationFilter = S.suspend(() =>
  S.Struct({
    types: S.optional(LandingZoneOperationTypes),
    statuses: S.optional(LandingZoneOperationStatuses),
  }),
).annotations({
  identifier: "LandingZoneOperationFilter",
}) as any as S.Schema<LandingZoneOperationFilter>;
export interface DisableControlOutput {
  operationIdentifier: string;
}
export const DisableControlOutput = S.suspend(() =>
  S.Struct({ operationIdentifier: S.String }),
).annotations({
  identifier: "DisableControlOutput",
}) as any as S.Schema<DisableControlOutput>;
export interface GetBaselineOutput {
  arn: string;
  name: string;
  description?: string;
}
export const GetBaselineOutput = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.String,
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "GetBaselineOutput",
}) as any as S.Schema<GetBaselineOutput>;
export interface ListControlOperationsInput {
  filter?: ControlOperationFilter;
  nextToken?: string;
  maxResults?: number;
}
export const ListControlOperationsInput = S.suspend(() =>
  S.Struct({
    filter: S.optional(ControlOperationFilter),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-control-operations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListControlOperationsInput",
}) as any as S.Schema<ListControlOperationsInput>;
export interface EnableBaselineInput {
  baselineVersion: string;
  parameters?: EnabledBaselineParameters;
  baselineIdentifier: string;
  targetIdentifier: string;
  tags?: TagMap;
}
export const EnableBaselineInput = S.suspend(() =>
  S.Struct({
    baselineVersion: S.String,
    parameters: S.optional(EnabledBaselineParameters),
    baselineIdentifier: S.String,
    targetIdentifier: S.String,
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/enable-baseline" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableBaselineInput",
}) as any as S.Schema<EnableBaselineInput>;
export interface UpdateEnabledBaselineOutput {
  operationIdentifier: string;
}
export const UpdateEnabledBaselineOutput = S.suspend(() =>
  S.Struct({ operationIdentifier: S.String }),
).annotations({
  identifier: "UpdateEnabledBaselineOutput",
}) as any as S.Schema<UpdateEnabledBaselineOutput>;
export interface DisableBaselineOutput {
  operationIdentifier: string;
}
export const DisableBaselineOutput = S.suspend(() =>
  S.Struct({ operationIdentifier: S.String }),
).annotations({
  identifier: "DisableBaselineOutput",
}) as any as S.Schema<DisableBaselineOutput>;
export interface ListEnabledBaselinesInput {
  filter?: EnabledBaselineFilter;
  nextToken?: string;
  maxResults?: number;
  includeChildren?: boolean;
}
export const ListEnabledBaselinesInput = S.suspend(() =>
  S.Struct({
    filter: S.optional(EnabledBaselineFilter),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    includeChildren: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-enabled-baselines" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEnabledBaselinesInput",
}) as any as S.Schema<ListEnabledBaselinesInput>;
export interface ResetEnabledBaselineOutput {
  operationIdentifier: string;
}
export const ResetEnabledBaselineOutput = S.suspend(() =>
  S.Struct({ operationIdentifier: S.String }),
).annotations({
  identifier: "ResetEnabledBaselineOutput",
}) as any as S.Schema<ResetEnabledBaselineOutput>;
export interface EnableControlInput {
  controlIdentifier: string;
  targetIdentifier: string;
  tags?: TagMap;
  parameters?: EnabledControlParameters;
}
export const EnableControlInput = S.suspend(() =>
  S.Struct({
    controlIdentifier: S.String,
    targetIdentifier: S.String,
    tags: S.optional(TagMap),
    parameters: S.optional(EnabledControlParameters),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/enable-control" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableControlInput",
}) as any as S.Schema<EnableControlInput>;
export interface UpdateEnabledControlOutput {
  operationIdentifier: string;
}
export const UpdateEnabledControlOutput = S.suspend(() =>
  S.Struct({ operationIdentifier: S.String }),
).annotations({
  identifier: "UpdateEnabledControlOutput",
}) as any as S.Schema<UpdateEnabledControlOutput>;
export interface ListEnabledControlsInput {
  targetIdentifier?: string;
  nextToken?: string;
  maxResults?: number;
  filter?: EnabledControlFilter;
  includeChildren?: boolean;
}
export const ListEnabledControlsInput = S.suspend(() =>
  S.Struct({
    targetIdentifier: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filter: S.optional(EnabledControlFilter),
    includeChildren: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-enabled-controls" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEnabledControlsInput",
}) as any as S.Schema<ListEnabledControlsInput>;
export interface ResetEnabledControlOutput {
  operationIdentifier: string;
}
export const ResetEnabledControlOutput = S.suspend(() =>
  S.Struct({ operationIdentifier: S.String }),
).annotations({
  identifier: "ResetEnabledControlOutput",
}) as any as S.Schema<ResetEnabledControlOutput>;
export interface ListLandingZoneOperationsInput {
  filter?: LandingZoneOperationFilter;
  nextToken?: string;
  maxResults?: number;
}
export const ListLandingZoneOperationsInput = S.suspend(() =>
  S.Struct({
    filter: S.optional(LandingZoneOperationFilter),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-landingzone-operations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLandingZoneOperationsInput",
}) as any as S.Schema<ListLandingZoneOperationsInput>;
export interface CreateLandingZoneOutput {
  arn: string;
  operationIdentifier: string;
}
export const CreateLandingZoneOutput = S.suspend(() =>
  S.Struct({ arn: S.String, operationIdentifier: S.String }),
).annotations({
  identifier: "CreateLandingZoneOutput",
}) as any as S.Schema<CreateLandingZoneOutput>;
export interface UpdateLandingZoneOutput {
  operationIdentifier: string;
}
export const UpdateLandingZoneOutput = S.suspend(() =>
  S.Struct({ operationIdentifier: S.String }),
).annotations({
  identifier: "UpdateLandingZoneOutput",
}) as any as S.Schema<UpdateLandingZoneOutput>;
export interface DeleteLandingZoneOutput {
  operationIdentifier: string;
}
export const DeleteLandingZoneOutput = S.suspend(() =>
  S.Struct({ operationIdentifier: S.String }),
).annotations({
  identifier: "DeleteLandingZoneOutput",
}) as any as S.Schema<DeleteLandingZoneOutput>;
export interface ResetLandingZoneOutput {
  operationIdentifier: string;
}
export const ResetLandingZoneOutput = S.suspend(() =>
  S.Struct({ operationIdentifier: S.String }),
).annotations({
  identifier: "ResetLandingZoneOutput",
}) as any as S.Schema<ResetLandingZoneOutput>;
export interface ListTagsForResourceOutput {
  tags: TagMap;
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ tags: TagMap }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface BaselineOperation {
  operationIdentifier?: string;
  operationType?: string;
  status?: string;
  startTime?: Date;
  endTime?: Date;
  statusMessage?: string;
}
export const BaselineOperation = S.suspend(() =>
  S.Struct({
    operationIdentifier: S.optional(S.String),
    operationType: S.optional(S.String),
    status: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    statusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "BaselineOperation",
}) as any as S.Schema<BaselineOperation>;
export interface BaselineSummary {
  arn: string;
  name: string;
  description?: string;
}
export const BaselineSummary = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.String,
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "BaselineSummary",
}) as any as S.Schema<BaselineSummary>;
export type Baselines = BaselineSummary[];
export const Baselines = S.Array(BaselineSummary);
export interface ControlOperation {
  operationType?: string;
  startTime?: Date;
  endTime?: Date;
  status?: string;
  statusMessage?: string;
  operationIdentifier?: string;
  controlIdentifier?: string;
  targetIdentifier?: string;
  enabledControlIdentifier?: string;
}
export const ControlOperation = S.suspend(() =>
  S.Struct({
    operationType: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    status: S.optional(S.String),
    statusMessage: S.optional(S.String),
    operationIdentifier: S.optional(S.String),
    controlIdentifier: S.optional(S.String),
    targetIdentifier: S.optional(S.String),
    enabledControlIdentifier: S.optional(S.String),
  }),
).annotations({
  identifier: "ControlOperation",
}) as any as S.Schema<ControlOperation>;
export interface LandingZoneOperationDetail {
  operationType?: string;
  operationIdentifier?: string;
  status?: string;
  startTime?: Date;
  endTime?: Date;
  statusMessage?: string;
}
export const LandingZoneOperationDetail = S.suspend(() =>
  S.Struct({
    operationType: S.optional(S.String),
    operationIdentifier: S.optional(S.String),
    status: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    statusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "LandingZoneOperationDetail",
}) as any as S.Schema<LandingZoneOperationDetail>;
export interface LandingZoneSummary {
  arn?: string;
}
export const LandingZoneSummary = S.suspend(() =>
  S.Struct({ arn: S.optional(S.String) }),
).annotations({
  identifier: "LandingZoneSummary",
}) as any as S.Schema<LandingZoneSummary>;
export type LandingZoneSummaries = LandingZoneSummary[];
export const LandingZoneSummaries = S.Array(LandingZoneSummary);
export interface GetBaselineOperationOutput {
  baselineOperation: BaselineOperation;
}
export const GetBaselineOperationOutput = S.suspend(() =>
  S.Struct({ baselineOperation: BaselineOperation }),
).annotations({
  identifier: "GetBaselineOperationOutput",
}) as any as S.Schema<GetBaselineOperationOutput>;
export interface ListBaselinesOutput {
  baselines: Baselines;
  nextToken?: string;
}
export const ListBaselinesOutput = S.suspend(() =>
  S.Struct({ baselines: Baselines, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListBaselinesOutput",
}) as any as S.Schema<ListBaselinesOutput>;
export interface GetControlOperationOutput {
  controlOperation: ControlOperation;
}
export const GetControlOperationOutput = S.suspend(() =>
  S.Struct({ controlOperation: ControlOperation }),
).annotations({
  identifier: "GetControlOperationOutput",
}) as any as S.Schema<GetControlOperationOutput>;
export interface EnableBaselineOutput {
  operationIdentifier: string;
  arn: string;
}
export const EnableBaselineOutput = S.suspend(() =>
  S.Struct({ operationIdentifier: S.String, arn: S.String }),
).annotations({
  identifier: "EnableBaselineOutput",
}) as any as S.Schema<EnableBaselineOutput>;
export interface EnableControlOutput {
  operationIdentifier: string;
  arn?: string;
}
export const EnableControlOutput = S.suspend(() =>
  S.Struct({ operationIdentifier: S.String, arn: S.optional(S.String) }),
).annotations({
  identifier: "EnableControlOutput",
}) as any as S.Schema<EnableControlOutput>;
export interface GetLandingZoneOperationOutput {
  operationDetails: LandingZoneOperationDetail;
}
export const GetLandingZoneOperationOutput = S.suspend(() =>
  S.Struct({ operationDetails: LandingZoneOperationDetail }),
).annotations({
  identifier: "GetLandingZoneOperationOutput",
}) as any as S.Schema<GetLandingZoneOperationOutput>;
export interface ListLandingZonesOutput {
  landingZones: LandingZoneSummaries;
  nextToken?: string;
}
export const ListLandingZonesOutput = S.suspend(() =>
  S.Struct({
    landingZones: LandingZoneSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLandingZonesOutput",
}) as any as S.Schema<ListLandingZonesOutput>;
export interface EnablementStatusSummary {
  status?: string;
  lastOperationIdentifier?: string;
}
export const EnablementStatusSummary = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    lastOperationIdentifier: S.optional(S.String),
  }),
).annotations({
  identifier: "EnablementStatusSummary",
}) as any as S.Schema<EnablementStatusSummary>;
export interface EnabledBaselineParameterSummary {
  key: string;
  value: any;
}
export const EnabledBaselineParameterSummary = S.suspend(() =>
  S.Struct({ key: S.String, value: S.Any }),
).annotations({
  identifier: "EnabledBaselineParameterSummary",
}) as any as S.Schema<EnabledBaselineParameterSummary>;
export type EnabledBaselineParameterSummaries =
  EnabledBaselineParameterSummary[];
export const EnabledBaselineParameterSummaries = S.Array(
  EnabledBaselineParameterSummary,
);
export interface Region {
  name?: string;
}
export const Region = S.suspend(() =>
  S.Struct({ name: S.optional(S.String) }),
).annotations({ identifier: "Region" }) as any as S.Schema<Region>;
export type TargetRegions = Region[];
export const TargetRegions = S.Array(Region);
export interface EnabledControlParameterSummary {
  key: string;
  value: any;
}
export const EnabledControlParameterSummary = S.suspend(() =>
  S.Struct({ key: S.String, value: S.Any }),
).annotations({
  identifier: "EnabledControlParameterSummary",
}) as any as S.Schema<EnabledControlParameterSummary>;
export type EnabledControlParameterSummaries = EnabledControlParameterSummary[];
export const EnabledControlParameterSummaries = S.Array(
  EnabledControlParameterSummary,
);
export interface LandingZoneDriftStatusSummary {
  status?: string;
}
export const LandingZoneDriftStatusSummary = S.suspend(() =>
  S.Struct({ status: S.optional(S.String) }),
).annotations({
  identifier: "LandingZoneDriftStatusSummary",
}) as any as S.Schema<LandingZoneDriftStatusSummary>;
export interface ControlOperationSummary {
  operationType?: string;
  startTime?: Date;
  endTime?: Date;
  status?: string;
  statusMessage?: string;
  operationIdentifier?: string;
  controlIdentifier?: string;
  targetIdentifier?: string;
  enabledControlIdentifier?: string;
}
export const ControlOperationSummary = S.suspend(() =>
  S.Struct({
    operationType: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    status: S.optional(S.String),
    statusMessage: S.optional(S.String),
    operationIdentifier: S.optional(S.String),
    controlIdentifier: S.optional(S.String),
    targetIdentifier: S.optional(S.String),
    enabledControlIdentifier: S.optional(S.String),
  }),
).annotations({
  identifier: "ControlOperationSummary",
}) as any as S.Schema<ControlOperationSummary>;
export type ControlOperations = ControlOperationSummary[];
export const ControlOperations = S.Array(ControlOperationSummary);
export interface EnabledBaselineInheritanceDrift {
  status?: string;
}
export const EnabledBaselineInheritanceDrift = S.suspend(() =>
  S.Struct({ status: S.optional(S.String) }),
).annotations({
  identifier: "EnabledBaselineInheritanceDrift",
}) as any as S.Schema<EnabledBaselineInheritanceDrift>;
export interface EnabledBaselineDriftTypes {
  inheritance?: EnabledBaselineInheritanceDrift;
}
export const EnabledBaselineDriftTypes = S.suspend(() =>
  S.Struct({ inheritance: S.optional(EnabledBaselineInheritanceDrift) }),
).annotations({
  identifier: "EnabledBaselineDriftTypes",
}) as any as S.Schema<EnabledBaselineDriftTypes>;
export interface EnabledBaselineDriftStatusSummary {
  types?: EnabledBaselineDriftTypes;
}
export const EnabledBaselineDriftStatusSummary = S.suspend(() =>
  S.Struct({ types: S.optional(EnabledBaselineDriftTypes) }),
).annotations({
  identifier: "EnabledBaselineDriftStatusSummary",
}) as any as S.Schema<EnabledBaselineDriftStatusSummary>;
export interface EnabledBaselineSummary {
  arn: string;
  baselineIdentifier: string;
  baselineVersion?: string;
  driftStatusSummary?: EnabledBaselineDriftStatusSummary;
  targetIdentifier: string;
  parentIdentifier?: string;
  statusSummary: EnablementStatusSummary;
}
export const EnabledBaselineSummary = S.suspend(() =>
  S.Struct({
    arn: S.String,
    baselineIdentifier: S.String,
    baselineVersion: S.optional(S.String),
    driftStatusSummary: S.optional(EnabledBaselineDriftStatusSummary),
    targetIdentifier: S.String,
    parentIdentifier: S.optional(S.String),
    statusSummary: EnablementStatusSummary,
  }),
).annotations({
  identifier: "EnabledBaselineSummary",
}) as any as S.Schema<EnabledBaselineSummary>;
export type EnabledBaselines = EnabledBaselineSummary[];
export const EnabledBaselines = S.Array(EnabledBaselineSummary);
export interface EnabledControlInheritanceDrift {
  status?: string;
}
export const EnabledControlInheritanceDrift = S.suspend(() =>
  S.Struct({ status: S.optional(S.String) }),
).annotations({
  identifier: "EnabledControlInheritanceDrift",
}) as any as S.Schema<EnabledControlInheritanceDrift>;
export interface EnabledControlResourceDrift {
  status?: string;
}
export const EnabledControlResourceDrift = S.suspend(() =>
  S.Struct({ status: S.optional(S.String) }),
).annotations({
  identifier: "EnabledControlResourceDrift",
}) as any as S.Schema<EnabledControlResourceDrift>;
export interface EnabledControlDriftTypes {
  inheritance?: EnabledControlInheritanceDrift;
  resource?: EnabledControlResourceDrift;
}
export const EnabledControlDriftTypes = S.suspend(() =>
  S.Struct({
    inheritance: S.optional(EnabledControlInheritanceDrift),
    resource: S.optional(EnabledControlResourceDrift),
  }),
).annotations({
  identifier: "EnabledControlDriftTypes",
}) as any as S.Schema<EnabledControlDriftTypes>;
export interface DriftStatusSummary {
  driftStatus?: string;
  types?: EnabledControlDriftTypes;
}
export const DriftStatusSummary = S.suspend(() =>
  S.Struct({
    driftStatus: S.optional(S.String),
    types: S.optional(EnabledControlDriftTypes),
  }),
).annotations({
  identifier: "DriftStatusSummary",
}) as any as S.Schema<DriftStatusSummary>;
export interface EnabledControlSummary {
  arn?: string;
  controlIdentifier?: string;
  targetIdentifier?: string;
  statusSummary?: EnablementStatusSummary;
  driftStatusSummary?: DriftStatusSummary;
  parentIdentifier?: string;
}
export const EnabledControlSummary = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    controlIdentifier: S.optional(S.String),
    targetIdentifier: S.optional(S.String),
    statusSummary: S.optional(EnablementStatusSummary),
    driftStatusSummary: S.optional(DriftStatusSummary),
    parentIdentifier: S.optional(S.String),
  }),
).annotations({
  identifier: "EnabledControlSummary",
}) as any as S.Schema<EnabledControlSummary>;
export type EnabledControls = EnabledControlSummary[];
export const EnabledControls = S.Array(EnabledControlSummary);
export interface LandingZoneOperationSummary {
  operationType?: string;
  operationIdentifier?: string;
  status?: string;
}
export const LandingZoneOperationSummary = S.suspend(() =>
  S.Struct({
    operationType: S.optional(S.String),
    operationIdentifier: S.optional(S.String),
    status: S.optional(S.String),
  }),
).annotations({
  identifier: "LandingZoneOperationSummary",
}) as any as S.Schema<LandingZoneOperationSummary>;
export type LandingZoneOperations = LandingZoneOperationSummary[];
export const LandingZoneOperations = S.Array(LandingZoneOperationSummary);
export interface LandingZoneDetail {
  version: string;
  remediationTypes?: RemediationTypes;
  arn?: string;
  status?: string;
  latestAvailableVersion?: string;
  driftStatus?: LandingZoneDriftStatusSummary;
  manifest: any;
}
export const LandingZoneDetail = S.suspend(() =>
  S.Struct({
    version: S.String,
    remediationTypes: S.optional(RemediationTypes),
    arn: S.optional(S.String),
    status: S.optional(S.String),
    latestAvailableVersion: S.optional(S.String),
    driftStatus: S.optional(LandingZoneDriftStatusSummary),
    manifest: S.Any,
  }),
).annotations({
  identifier: "LandingZoneDetail",
}) as any as S.Schema<LandingZoneDetail>;
export interface ListControlOperationsOutput {
  controlOperations: ControlOperations;
  nextToken?: string;
}
export const ListControlOperationsOutput = S.suspend(() =>
  S.Struct({
    controlOperations: ControlOperations,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListControlOperationsOutput",
}) as any as S.Schema<ListControlOperationsOutput>;
export interface ListEnabledBaselinesOutput {
  enabledBaselines: EnabledBaselines;
  nextToken?: string;
}
export const ListEnabledBaselinesOutput = S.suspend(() =>
  S.Struct({
    enabledBaselines: EnabledBaselines,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEnabledBaselinesOutput",
}) as any as S.Schema<ListEnabledBaselinesOutput>;
export interface ListEnabledControlsOutput {
  enabledControls: EnabledControls;
  nextToken?: string;
}
export const ListEnabledControlsOutput = S.suspend(() =>
  S.Struct({
    enabledControls: EnabledControls,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEnabledControlsOutput",
}) as any as S.Schema<ListEnabledControlsOutput>;
export interface ListLandingZoneOperationsOutput {
  landingZoneOperations: LandingZoneOperations;
  nextToken?: string;
}
export const ListLandingZoneOperationsOutput = S.suspend(() =>
  S.Struct({
    landingZoneOperations: LandingZoneOperations,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLandingZoneOperationsOutput",
}) as any as S.Schema<ListLandingZoneOperationsOutput>;
export interface GetLandingZoneOutput {
  landingZone: LandingZoneDetail;
}
export const GetLandingZoneOutput = S.suspend(() =>
  S.Struct({ landingZone: LandingZoneDetail }),
).annotations({
  identifier: "GetLandingZoneOutput",
}) as any as S.Schema<GetLandingZoneOutput>;
export interface EnabledBaselineDetails {
  arn: string;
  baselineIdentifier: string;
  baselineVersion?: string;
  driftStatusSummary?: EnabledBaselineDriftStatusSummary;
  targetIdentifier: string;
  parentIdentifier?: string;
  statusSummary: EnablementStatusSummary;
  parameters?: EnabledBaselineParameterSummaries;
}
export const EnabledBaselineDetails = S.suspend(() =>
  S.Struct({
    arn: S.String,
    baselineIdentifier: S.String,
    baselineVersion: S.optional(S.String),
    driftStatusSummary: S.optional(EnabledBaselineDriftStatusSummary),
    targetIdentifier: S.String,
    parentIdentifier: S.optional(S.String),
    statusSummary: EnablementStatusSummary,
    parameters: S.optional(EnabledBaselineParameterSummaries),
  }),
).annotations({
  identifier: "EnabledBaselineDetails",
}) as any as S.Schema<EnabledBaselineDetails>;
export interface EnabledControlDetails {
  arn?: string;
  controlIdentifier?: string;
  targetIdentifier?: string;
  statusSummary?: EnablementStatusSummary;
  driftStatusSummary?: DriftStatusSummary;
  parentIdentifier?: string;
  targetRegions?: TargetRegions;
  parameters?: EnabledControlParameterSummaries;
}
export const EnabledControlDetails = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    controlIdentifier: S.optional(S.String),
    targetIdentifier: S.optional(S.String),
    statusSummary: S.optional(EnablementStatusSummary),
    driftStatusSummary: S.optional(DriftStatusSummary),
    parentIdentifier: S.optional(S.String),
    targetRegions: S.optional(TargetRegions),
    parameters: S.optional(EnabledControlParameterSummaries),
  }),
).annotations({
  identifier: "EnabledControlDetails",
}) as any as S.Schema<EnabledControlDetails>;
export interface GetEnabledBaselineOutput {
  enabledBaselineDetails?: EnabledBaselineDetails;
}
export const GetEnabledBaselineOutput = S.suspend(() =>
  S.Struct({ enabledBaselineDetails: S.optional(EnabledBaselineDetails) }),
).annotations({
  identifier: "GetEnabledBaselineOutput",
}) as any as S.Schema<GetEnabledBaselineOutput>;
export interface GetEnabledControlOutput {
  enabledControlDetails: EnabledControlDetails;
}
export const GetEnabledControlOutput = S.suspend(() =>
  S.Struct({ enabledControlDetails: EnabledControlDetails }),
).annotations({
  identifier: "GetEnabledControlOutput",
}) as any as S.Schema<GetEnabledControlOutput>;

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
).pipe(C.withConflictError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
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
 * Applies tags to a resource. For usage examples, see the *Controls Reference Guide* .
 */
export const tagResource: (
  input: TagResourceInput,
) => Effect.Effect<
  TagResourceOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a new landing zone. This API call starts an asynchronous operation that creates and configures a landing zone, based on the parameters specified in the manifest JSON file.
 */
export const createLandingZone: (
  input: CreateLandingZoneInput,
) => Effect.Effect<
  CreateLandingZoneOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLandingZoneInput,
  output: CreateLandingZoneOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This API call updates the landing zone. It starts an asynchronous operation that updates the landing zone based on the new landing zone version, or on the changed parameters specified in the updated manifest file.
 */
export const updateLandingZone: (
  input: UpdateLandingZoneInput,
) => Effect.Effect<
  UpdateLandingZoneOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLandingZoneInput,
  output: UpdateLandingZoneOutput,
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
 * Decommissions a landing zone. This API call starts an asynchronous operation that deletes Amazon Web Services Control Tower resources deployed in accounts managed by Amazon Web Services Control Tower.
 *
 * Decommissioning a landing zone is a process with significant consequences, and it cannot be undone. We strongly recommend that you perform this decommissioning process only if you intend to stop using your landing zone.
 */
export const deleteLandingZone: (
  input: DeleteLandingZoneInput,
) => Effect.Effect<
  DeleteLandingZoneOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLandingZoneInput,
  output: DeleteLandingZoneOutput,
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
 * This API call resets a landing zone. It starts an asynchronous operation that resets the landing zone to the parameters specified in the original configuration, which you specified in the manifest file. Nothing in the manifest file's original landing zone configuration is changed during the reset process, by default. This API is not the same as a rollback of a landing zone version, which is not a supported operation.
 */
export const resetLandingZone: (
  input: ResetLandingZoneInput,
) => Effect.Effect<
  ResetLandingZoneOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetLandingZoneInput,
  output: ResetLandingZoneOutput,
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
 * Returns the landing zone ARN for the landing zone deployed in your managed account. This API also creates an ARN for existing accounts that do not yet have a landing zone ARN.
 *
 * Returns one landing zone ARN.
 */
export const listLandingZones: {
  (
    input: ListLandingZonesInput,
  ): Effect.Effect<
    ListLandingZonesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListLandingZonesInput,
  ) => Stream.Stream<
    ListLandingZonesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListLandingZonesInput,
  ) => Stream.Stream<
    LandingZoneSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLandingZonesInput,
  output: ListLandingZonesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "landingZones",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieve details about an existing `Baseline` resource by specifying its identifier. For usage examples, see *the Amazon Web Services Control Tower User Guide* .
 */
export const getBaseline: (
  input: GetBaselineInput,
) => Effect.Effect<
  GetBaselineOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBaselineInput,
  output: GetBaselineOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the details of an asynchronous baseline operation, as initiated by any of these APIs: `EnableBaseline`, `DisableBaseline`, `UpdateEnabledBaseline`, `ResetEnabledBaseline`. A status message is displayed in case of operation failure. For usage examples, see *the Amazon Web Services Control Tower User Guide* .
 */
export const getBaselineOperation: (
  input: GetBaselineOperationInput,
) => Effect.Effect<
  GetBaselineOperationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBaselineOperationInput,
  output: GetBaselineOperationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the status of a particular `EnableControl` or `DisableControl` operation. Displays a message in case of error. Details for an operation are available for 90 days. For usage examples, see the *Controls Reference Guide* .
 */
export const getControlOperation: (
  input: GetControlOperationInput,
) => Effect.Effect<
  GetControlOperationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetControlOperationInput,
  output: GetControlOperationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the status of the specified landing zone operation. Details for an operation are available for 90 days.
 */
export const getLandingZoneOperation: (
  input: GetLandingZoneOperationInput,
) => Effect.Effect<
  GetLandingZoneOperationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLandingZoneOperationInput,
  output: GetLandingZoneOperationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes tags from a resource. For usage examples, see the *Controls Reference Guide* .
 */
export const untagResource: (
  input: UntagResourceInput,
) => Effect.Effect<
  UntagResourceOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a list of tags associated with the resource. For usage examples, see the *Controls Reference Guide* .
 */
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => Effect.Effect<
  ListTagsForResourceOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a summary list of all available baselines. For usage examples, see *the Amazon Web Services Control Tower User Guide* .
 */
export const listBaselines: {
  (
    input: ListBaselinesInput,
  ): Effect.Effect<
    ListBaselinesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListBaselinesInput,
  ) => Stream.Stream<
    ListBaselinesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListBaselinesInput,
  ) => Stream.Stream<
    BaselineSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBaselinesInput,
  output: ListBaselinesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "baselines",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Provides a list of operations in progress or queued. For usage examples, see ListControlOperation examples.
 */
export const listControlOperations: {
  (
    input: ListControlOperationsInput,
  ): Effect.Effect<
    ListControlOperationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListControlOperationsInput,
  ) => Stream.Stream<
    ListControlOperationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListControlOperationsInput,
  ) => Stream.Stream<
    ControlOperationSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListControlOperationsInput,
  output: ListControlOperationsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "controlOperations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of summaries describing `EnabledBaseline` resources. You can filter the list by the corresponding `Baseline` or `Target` of the `EnabledBaseline` resources. For usage examples, see *the Amazon Web Services Control Tower User Guide* .
 */
export const listEnabledBaselines: {
  (
    input: ListEnabledBaselinesInput,
  ): Effect.Effect<
    ListEnabledBaselinesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnabledBaselinesInput,
  ) => Stream.Stream<
    ListEnabledBaselinesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListEnabledBaselinesInput,
  ) => Stream.Stream<
    EnabledBaselineSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnabledBaselinesInput,
  output: ListEnabledBaselinesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "enabledBaselines",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the controls enabled by Amazon Web Services Control Tower on the specified organizational unit and the accounts it contains. For usage examples, see the *Controls Reference Guide* .
 */
export const listEnabledControls: {
  (
    input: ListEnabledControlsInput,
  ): Effect.Effect<
    ListEnabledControlsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnabledControlsInput,
  ) => Stream.Stream<
    ListEnabledControlsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListEnabledControlsInput,
  ) => Stream.Stream<
    EnabledControlSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnabledControlsInput,
  output: ListEnabledControlsOutput,
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
    items: "enabledControls",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all landing zone operations from the past 90 days. Results are sorted by time, with the most recent operation first.
 */
export const listLandingZoneOperations: {
  (
    input: ListLandingZoneOperationsInput,
  ): Effect.Effect<
    ListLandingZoneOperationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListLandingZoneOperationsInput,
  ) => Stream.Stream<
    ListLandingZoneOperationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListLandingZoneOperationsInput,
  ) => Stream.Stream<
    LandingZoneOperationSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLandingZoneOperationsInput,
  output: ListLandingZoneOperationsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "landingZoneOperations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns details about the landing zone. Displays a message in case of error.
 */
export const getLandingZone: (
  input: GetLandingZoneInput,
) => Effect.Effect<
  GetLandingZoneOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLandingZoneInput,
  output: GetLandingZoneOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This API call turns off a control. It starts an asynchronous operation that deletes Amazon Web Services resources on the specified organizational unit and the accounts it contains. The resources will vary according to the control that you specify. For usage examples, see the *Controls Reference Guide* .
 */
export const disableControl: (
  input: DisableControlInput,
) => Effect.Effect<
  DisableControlOutput,
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
  input: DisableControlInput,
  output: DisableControlOutput,
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
 * Enable (apply) a `Baseline` to a Target. This API starts an asynchronous operation to deploy resources specified by the `Baseline` to the specified Target. For usage examples, see *the Amazon Web Services Control Tower User Guide* .
 */
export const enableBaseline: (
  input: EnableBaselineInput,
) => Effect.Effect<
  EnableBaselineOutput,
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
  input: EnableBaselineInput,
  output: EnableBaselineOutput,
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
 * This API call activates a control. It starts an asynchronous operation that creates Amazon Web Services resources on the specified organizational unit and the accounts it contains. The resources created will vary according to the control that you specify. For usage examples, see the *Controls Reference Guide* .
 */
export const enableControl: (
  input: EnableControlInput,
) => Effect.Effect<
  EnableControlOutput,
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
  input: EnableControlInput,
  output: EnableControlOutput,
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
 * Updates an `EnabledBaseline` resource's applied parameters or version. For usage examples, see *the Amazon Web Services Control Tower User Guide* .
 */
export const updateEnabledBaseline: (
  input: UpdateEnabledBaselineInput,
) => Effect.Effect<
  UpdateEnabledBaselineOutput,
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
  input: UpdateEnabledBaselineInput,
  output: UpdateEnabledBaselineOutput,
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
 * Disable an `EnabledBaseline` resource on the specified Target. This API starts an asynchronous operation to remove all resources deployed as part of the baseline enablement. The resource will vary depending on the enabled baseline. For usage examples, see *the Amazon Web Services Control Tower User Guide* .
 */
export const disableBaseline: (
  input: DisableBaselineInput,
) => Effect.Effect<
  DisableBaselineOutput,
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
  input: DisableBaselineInput,
  output: DisableBaselineOutput,
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
 * Re-enables an `EnabledBaseline` resource. For example, this API can re-apply the existing `Baseline` after a new member account is moved to the target OU. For usage examples, see *the Amazon Web Services Control Tower User Guide* .
 */
export const resetEnabledBaseline: (
  input: ResetEnabledBaselineInput,
) => Effect.Effect<
  ResetEnabledBaselineOutput,
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
  input: ResetEnabledBaselineInput,
  output: ResetEnabledBaselineOutput,
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
 * Updates the configuration of an already enabled control.
 *
 * If the enabled control shows an `EnablementStatus` of SUCCEEDED, supply parameters that are different from the currently configured parameters. Otherwise, Amazon Web Services Control Tower will not accept the request.
 *
 * If the enabled control shows an `EnablementStatus` of FAILED, Amazon Web Services Control Tower updates the control to match any valid parameters that you supply.
 *
 * If the `DriftSummary` status for the control shows as `DRIFTED`, you cannot call this API. Instead, you can update the control by calling the `ResetEnabledControl` API. Alternatively, you can call `DisableControl` and then call `EnableControl` again. Also, you can run an extending governance operation to repair drift. For usage examples, see the *Controls Reference Guide* .
 */
export const updateEnabledControl: (
  input: UpdateEnabledControlInput,
) => Effect.Effect<
  UpdateEnabledControlOutput,
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
  input: UpdateEnabledControlInput,
  output: UpdateEnabledControlOutput,
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
 * Resets an enabled control. Does not work for controls implemented with SCPs.
 */
export const resetEnabledControl: (
  input: ResetEnabledControlInput,
) => Effect.Effect<
  ResetEnabledControlOutput,
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
  input: ResetEnabledControlInput,
  output: ResetEnabledControlOutput,
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
 * Retrieve details of an `EnabledBaseline` resource by specifying its identifier.
 */
export const getEnabledBaseline: (
  input: GetEnabledBaselineInput,
) => Effect.Effect<
  GetEnabledBaselineOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnabledBaselineInput,
  output: GetEnabledBaselineOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves details about an enabled control. For usage examples, see the *Controls Reference Guide* .
 */
export const getEnabledControl: (
  input: GetEnabledControlInput,
) => Effect.Effect<
  GetEnabledControlOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnabledControlInput,
  output: GetEnabledControlOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
