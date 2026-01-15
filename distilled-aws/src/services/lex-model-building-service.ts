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
  sdkId: "Lex Model Building Service",
  serviceShapeName: "AWSDeepSenseModelBuildingService",
});
const auth = T.AwsAuthSigv4({ name: "lex" });
const ver = T.ServiceVersion("2017-04-19");
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
              `https://models.lex-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws") {
              return e(`https://models-fips.lex.${Region}.amazonaws.com`);
            }
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://models-fips.lex.${Region}.amazonaws.com`);
            }
            return e(
              `https://models.lex-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://models.lex.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        if ("aws" === _.getAttr(PartitionResult, "name")) {
          return e(`https://models.lex.${Region}.amazonaws.com`);
        }
        if ("aws-us-gov" === _.getAttr(PartitionResult, "name")) {
          return e(`https://models.lex.${Region}.amazonaws.com`);
        }
        return e(
          `https://models.lex.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type BotName = string;
export type IntentName = string;
export type SlotTypeName = string;
export type AliasName = string;
export type BotChannelName = string;
export type NumericalVersion = string;
export type UserId = string;
export type NextToken = string;
export type MaxResults = number;
export type AliasNameOrListAll = string;
export type BuiltinIntentSignature = string;
export type Name = string;
export type Version = string;
export type MigrationId = string;
export type AmazonResourceName = string;
export type Description = string;
export type ConfidenceThreshold = number;
export type SessionTTL = number;
export type Utterance = string;
export type CustomOrBuiltinSlotTypeName = string;
export type V2BotName = string;
export type IamRoleArn = string;
export type TagKey = string;
export type PromptMaxAttempts = number;
export type ResponseCard = string;
export type TagValue = string;
export type SlotName = string;
export type Priority = number;
export type LambdaARN = string;
export type MessageVersion = string;
export type KendraIndexArn = string;
export type QueryFilterString = string;
export type RoleArn = string;
export type InputContextName = string;
export type OutputContextName = string;
export type ContextTimeToLiveInSeconds = number;
export type ContextTurnsToLive = number;
export type Value = string;
export type V2BotId = string;
export type ContentString = string;
export type GroupNumber = number;
export type KmsKeyArn = string;
export type ResourceArn = string;
export type RegexPattern = string;
export type BuiltinSlotTypeSignature = string;
export type MigrationAlertMessage = string;
export type MigrationAlertDetail = string;
export type MigrationAlertReferenceURL = string;
export type SlotDefaultValueString = string;
export type ResourcePrefix = string;
export type UtteranceString = string;
export type Count = number;

//# Schemas
export type Locale =
  | "de-DE"
  | "en-AU"
  | "en-GB"
  | "en-IN"
  | "en-US"
  | "es-419"
  | "es-ES"
  | "es-US"
  | "fr-FR"
  | "fr-CA"
  | "it-IT"
  | "ja-JP"
  | "ko-KR"
  | (string & {});
export const Locale = S.String;
export type ResourceType = "BOT" | "INTENT" | "SLOT_TYPE" | (string & {});
export const ResourceType = S.String;
export type ExportType = "ALEXA_SKILLS_KIT" | "LEX" | (string & {});
export const ExportType = S.String;
export type MigrationSortAttribute =
  | "V1_BOT_NAME"
  | "MIGRATION_DATE_TIME"
  | (string & {});
export const MigrationSortAttribute = S.String;
export type SortOrder = "ASCENDING" | "DESCENDING" | (string & {});
export const SortOrder = S.String;
export type MigrationStatus =
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | (string & {});
export const MigrationStatus = S.String;
export type BotVersions = string[];
export const BotVersions = S.Array(S.String);
export type StatusType = "Detected" | "Missed" | (string & {});
export const StatusType = S.String;
export type ProcessBehavior = "SAVE" | "BUILD" | (string & {});
export const ProcessBehavior = S.String;
export type IntentUtteranceList = string[];
export const IntentUtteranceList = S.Array(S.String);
export type SlotValueSelectionStrategy =
  | "ORIGINAL_VALUE"
  | "TOP_RESOLUTION"
  | (string & {});
export const SlotValueSelectionStrategy = S.String;
export type MergeStrategy =
  | "OVERWRITE_LATEST"
  | "FAIL_ON_CONFLICT"
  | (string & {});
export const MergeStrategy = S.String;
export type MigrationStrategy =
  | "CREATE_NEW"
  | "UPDATE_EXISTING"
  | (string & {});
export const MigrationStrategy = S.String;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface CreateBotVersionRequest {
  name: string;
  checksum?: string;
}
export const CreateBotVersionRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    checksum: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/bots/{name}/versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBotVersionRequest",
}) as any as S.Schema<CreateBotVersionRequest>;
export interface CreateIntentVersionRequest {
  name: string;
  checksum?: string;
}
export const CreateIntentVersionRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    checksum: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/intents/{name}/versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateIntentVersionRequest",
}) as any as S.Schema<CreateIntentVersionRequest>;
export interface CreateSlotTypeVersionRequest {
  name: string;
  checksum?: string;
}
export const CreateSlotTypeVersionRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    checksum: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/slottypes/{name}/versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSlotTypeVersionRequest",
}) as any as S.Schema<CreateSlotTypeVersionRequest>;
export interface DeleteBotRequest {
  name: string;
}
export const DeleteBotRequest = S.suspend(() =>
  S.Struct({ name: S.String.pipe(T.HttpLabel("name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/bots/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBotRequest",
}) as any as S.Schema<DeleteBotRequest>;
export interface DeleteBotResponse {}
export const DeleteBotResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteBotResponse",
}) as any as S.Schema<DeleteBotResponse>;
export interface DeleteBotAliasRequest {
  name: string;
  botName: string;
}
export const DeleteBotAliasRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    botName: S.String.pipe(T.HttpLabel("botName")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/bots/{botName}/aliases/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBotAliasRequest",
}) as any as S.Schema<DeleteBotAliasRequest>;
export interface DeleteBotAliasResponse {}
export const DeleteBotAliasResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteBotAliasResponse" },
) as any as S.Schema<DeleteBotAliasResponse>;
export interface DeleteBotChannelAssociationRequest {
  name: string;
  botName: string;
  botAlias: string;
}
export const DeleteBotChannelAssociationRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    botName: S.String.pipe(T.HttpLabel("botName")),
    botAlias: S.String.pipe(T.HttpLabel("botAlias")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/bots/{botName}/aliases/{botAlias}/channels/{name}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBotChannelAssociationRequest",
}) as any as S.Schema<DeleteBotChannelAssociationRequest>;
export interface DeleteBotChannelAssociationResponse {}
export const DeleteBotChannelAssociationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteBotChannelAssociationResponse",
}) as any as S.Schema<DeleteBotChannelAssociationResponse>;
export interface DeleteBotVersionRequest {
  name: string;
  version: string;
}
export const DeleteBotVersionRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    version: S.String.pipe(T.HttpLabel("version")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/bots/{name}/versions/{version}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBotVersionRequest",
}) as any as S.Schema<DeleteBotVersionRequest>;
export interface DeleteBotVersionResponse {}
export const DeleteBotVersionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteBotVersionResponse",
}) as any as S.Schema<DeleteBotVersionResponse>;
export interface DeleteIntentRequest {
  name: string;
}
export const DeleteIntentRequest = S.suspend(() =>
  S.Struct({ name: S.String.pipe(T.HttpLabel("name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/intents/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteIntentRequest",
}) as any as S.Schema<DeleteIntentRequest>;
export interface DeleteIntentResponse {}
export const DeleteIntentResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteIntentResponse",
}) as any as S.Schema<DeleteIntentResponse>;
export interface DeleteIntentVersionRequest {
  name: string;
  version: string;
}
export const DeleteIntentVersionRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    version: S.String.pipe(T.HttpLabel("version")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/intents/{name}/versions/{version}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteIntentVersionRequest",
}) as any as S.Schema<DeleteIntentVersionRequest>;
export interface DeleteIntentVersionResponse {}
export const DeleteIntentVersionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteIntentVersionResponse",
}) as any as S.Schema<DeleteIntentVersionResponse>;
export interface DeleteSlotTypeRequest {
  name: string;
}
export const DeleteSlotTypeRequest = S.suspend(() =>
  S.Struct({ name: S.String.pipe(T.HttpLabel("name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/slottypes/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSlotTypeRequest",
}) as any as S.Schema<DeleteSlotTypeRequest>;
export interface DeleteSlotTypeResponse {}
export const DeleteSlotTypeResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteSlotTypeResponse" },
) as any as S.Schema<DeleteSlotTypeResponse>;
export interface DeleteSlotTypeVersionRequest {
  name: string;
  version: string;
}
export const DeleteSlotTypeVersionRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    version: S.String.pipe(T.HttpLabel("version")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/slottypes/{name}/version/{version}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSlotTypeVersionRequest",
}) as any as S.Schema<DeleteSlotTypeVersionRequest>;
export interface DeleteSlotTypeVersionResponse {}
export const DeleteSlotTypeVersionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSlotTypeVersionResponse",
}) as any as S.Schema<DeleteSlotTypeVersionResponse>;
export interface DeleteUtterancesRequest {
  botName: string;
  userId: string;
}
export const DeleteUtterancesRequest = S.suspend(() =>
  S.Struct({
    botName: S.String.pipe(T.HttpLabel("botName")),
    userId: S.String.pipe(T.HttpLabel("userId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/bots/{botName}/utterances/{userId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteUtterancesRequest",
}) as any as S.Schema<DeleteUtterancesRequest>;
export interface DeleteUtterancesResponse {}
export const DeleteUtterancesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteUtterancesResponse",
}) as any as S.Schema<DeleteUtterancesResponse>;
export interface GetBotRequest {
  name: string;
  versionOrAlias: string;
}
export const GetBotRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    versionOrAlias: S.String.pipe(T.HttpLabel("versionOrAlias")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/bots/{name}/versions/{versionOrAlias}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBotRequest",
}) as any as S.Schema<GetBotRequest>;
export interface GetBotAliasRequest {
  name: string;
  botName: string;
}
export const GetBotAliasRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    botName: S.String.pipe(T.HttpLabel("botName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/bots/{botName}/aliases/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBotAliasRequest",
}) as any as S.Schema<GetBotAliasRequest>;
export interface GetBotAliasesRequest {
  botName: string;
  nextToken?: string;
  maxResults?: number;
  nameContains?: string;
}
export const GetBotAliasesRequest = S.suspend(() =>
  S.Struct({
    botName: S.String.pipe(T.HttpLabel("botName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/bots/{botName}/aliases" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBotAliasesRequest",
}) as any as S.Schema<GetBotAliasesRequest>;
export interface GetBotChannelAssociationRequest {
  name: string;
  botName: string;
  botAlias: string;
}
export const GetBotChannelAssociationRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    botName: S.String.pipe(T.HttpLabel("botName")),
    botAlias: S.String.pipe(T.HttpLabel("botAlias")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/bots/{botName}/aliases/{botAlias}/channels/{name}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBotChannelAssociationRequest",
}) as any as S.Schema<GetBotChannelAssociationRequest>;
export interface GetBotChannelAssociationsRequest {
  botName: string;
  botAlias: string;
  nextToken?: string;
  maxResults?: number;
  nameContains?: string;
}
export const GetBotChannelAssociationsRequest = S.suspend(() =>
  S.Struct({
    botName: S.String.pipe(T.HttpLabel("botName")),
    botAlias: S.String.pipe(T.HttpLabel("botAlias")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/bots/{botName}/aliases/{botAlias}/channels",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBotChannelAssociationsRequest",
}) as any as S.Schema<GetBotChannelAssociationsRequest>;
export interface GetBotsRequest {
  nextToken?: string;
  maxResults?: number;
  nameContains?: string;
}
export const GetBotsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/bots" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBotsRequest",
}) as any as S.Schema<GetBotsRequest>;
export interface GetBotVersionsRequest {
  name: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetBotVersionsRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/bots/{name}/versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBotVersionsRequest",
}) as any as S.Schema<GetBotVersionsRequest>;
export interface GetBuiltinIntentRequest {
  signature: string;
}
export const GetBuiltinIntentRequest = S.suspend(() =>
  S.Struct({ signature: S.String.pipe(T.HttpLabel("signature")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/builtins/intents/{signature}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBuiltinIntentRequest",
}) as any as S.Schema<GetBuiltinIntentRequest>;
export interface GetBuiltinIntentsRequest {
  locale?: Locale;
  signatureContains?: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetBuiltinIntentsRequest = S.suspend(() =>
  S.Struct({
    locale: S.optional(Locale).pipe(T.HttpQuery("locale")),
    signatureContains: S.optional(S.String).pipe(
      T.HttpQuery("signatureContains"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/builtins/intents" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBuiltinIntentsRequest",
}) as any as S.Schema<GetBuiltinIntentsRequest>;
export interface GetBuiltinSlotTypesRequest {
  locale?: Locale;
  signatureContains?: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetBuiltinSlotTypesRequest = S.suspend(() =>
  S.Struct({
    locale: S.optional(Locale).pipe(T.HttpQuery("locale")),
    signatureContains: S.optional(S.String).pipe(
      T.HttpQuery("signatureContains"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/builtins/slottypes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBuiltinSlotTypesRequest",
}) as any as S.Schema<GetBuiltinSlotTypesRequest>;
export interface GetExportRequest {
  name: string;
  version: string;
  resourceType: ResourceType;
  exportType: ExportType;
}
export const GetExportRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpQuery("name")),
    version: S.String.pipe(T.HttpQuery("version")),
    resourceType: ResourceType.pipe(T.HttpQuery("resourceType")),
    exportType: ExportType.pipe(T.HttpQuery("exportType")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/exports" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetExportRequest",
}) as any as S.Schema<GetExportRequest>;
export interface GetImportRequest {
  importId: string;
}
export const GetImportRequest = S.suspend(() =>
  S.Struct({ importId: S.String.pipe(T.HttpLabel("importId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/imports/{importId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetImportRequest",
}) as any as S.Schema<GetImportRequest>;
export interface GetIntentRequest {
  name: string;
  version: string;
}
export const GetIntentRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    version: S.String.pipe(T.HttpLabel("version")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/intents/{name}/versions/{version}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIntentRequest",
}) as any as S.Schema<GetIntentRequest>;
export interface GetIntentsRequest {
  nextToken?: string;
  maxResults?: number;
  nameContains?: string;
}
export const GetIntentsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/intents" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIntentsRequest",
}) as any as S.Schema<GetIntentsRequest>;
export interface GetIntentVersionsRequest {
  name: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetIntentVersionsRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/intents/{name}/versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIntentVersionsRequest",
}) as any as S.Schema<GetIntentVersionsRequest>;
export interface GetMigrationRequest {
  migrationId: string;
}
export const GetMigrationRequest = S.suspend(() =>
  S.Struct({ migrationId: S.String.pipe(T.HttpLabel("migrationId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/migrations/{migrationId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMigrationRequest",
}) as any as S.Schema<GetMigrationRequest>;
export interface GetMigrationsRequest {
  sortByAttribute?: MigrationSortAttribute;
  sortByOrder?: SortOrder;
  v1BotNameContains?: string;
  migrationStatusEquals?: MigrationStatus;
  maxResults?: number;
  nextToken?: string;
}
export const GetMigrationsRequest = S.suspend(() =>
  S.Struct({
    sortByAttribute: S.optional(MigrationSortAttribute).pipe(
      T.HttpQuery("sortByAttribute"),
    ),
    sortByOrder: S.optional(SortOrder).pipe(T.HttpQuery("sortByOrder")),
    v1BotNameContains: S.optional(S.String).pipe(
      T.HttpQuery("v1BotNameContains"),
    ),
    migrationStatusEquals: S.optional(MigrationStatus).pipe(
      T.HttpQuery("migrationStatusEquals"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/migrations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMigrationsRequest",
}) as any as S.Schema<GetMigrationsRequest>;
export interface GetSlotTypeRequest {
  name: string;
  version: string;
}
export const GetSlotTypeRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    version: S.String.pipe(T.HttpLabel("version")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/slottypes/{name}/versions/{version}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSlotTypeRequest",
}) as any as S.Schema<GetSlotTypeRequest>;
export interface GetSlotTypesRequest {
  nextToken?: string;
  maxResults?: number;
  nameContains?: string;
}
export const GetSlotTypesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/slottypes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSlotTypesRequest",
}) as any as S.Schema<GetSlotTypesRequest>;
export interface GetSlotTypeVersionsRequest {
  name: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetSlotTypeVersionsRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/slottypes/{name}/versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSlotTypeVersionsRequest",
}) as any as S.Schema<GetSlotTypeVersionsRequest>;
export interface GetUtterancesViewRequest {
  botName: string;
  botVersions: string[];
  statusType: StatusType;
}
export const GetUtterancesViewRequest = S.suspend(() =>
  S.Struct({
    botName: S.String.pipe(T.HttpLabel("botName")),
    botVersions: BotVersions.pipe(T.HttpQuery("bot_versions")),
    statusType: StatusType.pipe(T.HttpQuery("status_type")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/bots/{botName}/utterances?view=aggregation",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUtterancesViewRequest",
}) as any as S.Schema<GetUtterancesViewRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
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
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface Tag {
  key: string;
  value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface StartImportRequest {
  payload: Uint8Array;
  resourceType: ResourceType;
  mergeStrategy: MergeStrategy;
  tags?: Tag[];
}
export const StartImportRequest = S.suspend(() =>
  S.Struct({
    payload: T.Blob,
    resourceType: ResourceType,
    mergeStrategy: MergeStrategy,
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/imports" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartImportRequest",
}) as any as S.Schema<StartImportRequest>;
export interface StartMigrationRequest {
  v1BotName: string;
  v1BotVersion: string;
  v2BotName: string;
  v2BotRole: string;
  migrationStrategy: MigrationStrategy;
}
export const StartMigrationRequest = S.suspend(() =>
  S.Struct({
    v1BotName: S.String,
    v1BotVersion: S.String,
    v2BotName: S.String,
    v2BotRole: S.String,
    migrationStrategy: MigrationStrategy,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/migrations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartMigrationRequest",
}) as any as S.Schema<StartMigrationRequest>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagList,
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
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
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
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type SlotConstraint = "Required" | "Optional" | (string & {});
export const SlotConstraint = S.String;
export type SlotUtteranceList = string[];
export const SlotUtteranceList = S.Array(S.String);
export type ObfuscationSetting = "NONE" | "DEFAULT_OBFUSCATION" | (string & {});
export const ObfuscationSetting = S.String;
export type FulfillmentActivityType =
  | "ReturnIntent"
  | "CodeHook"
  | (string & {});
export const FulfillmentActivityType = S.String;
export type SynonymList = string[];
export const SynonymList = S.Array(S.String);
export type Status =
  | "BUILDING"
  | "READY"
  | "READY_BASIC_TESTING"
  | "FAILED"
  | "NOT_BUILT"
  | (string & {});
export const Status = S.String;
export type ChannelType =
  | "Facebook"
  | "Slack"
  | "Twilio-Sms"
  | "Kik"
  | (string & {});
export const ChannelType = S.String;
export type ChannelStatus =
  | "IN_PROGRESS"
  | "CREATED"
  | "FAILED"
  | (string & {});
export const ChannelStatus = S.String;
export type LocaleList = Locale[];
export const LocaleList = S.Array(Locale);
export type ExportStatus = "IN_PROGRESS" | "READY" | "FAILED" | (string & {});
export const ExportStatus = S.String;
export type ImportStatus =
  | "IN_PROGRESS"
  | "COMPLETE"
  | "FAILED"
  | (string & {});
export const ImportStatus = S.String;
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface Intent {
  intentName: string;
  intentVersion: string;
}
export const Intent = S.suspend(() =>
  S.Struct({ intentName: S.String, intentVersion: S.String }),
).annotations({ identifier: "Intent" }) as any as S.Schema<Intent>;
export type IntentList = Intent[];
export const IntentList = S.Array(Intent);
export type ContentType =
  | "PlainText"
  | "SSML"
  | "CustomPayload"
  | (string & {});
export const ContentType = S.String;
export interface Message {
  contentType: ContentType;
  content: string;
  groupNumber?: number;
}
export const Message = S.suspend(() =>
  S.Struct({
    contentType: ContentType,
    content: S.String,
    groupNumber: S.optional(S.Number),
  }),
).annotations({ identifier: "Message" }) as any as S.Schema<Message>;
export type MessageList = Message[];
export const MessageList = S.Array(Message);
export interface Statement {
  messages: Message[];
  responseCard?: string;
}
export const Statement = S.suspend(() =>
  S.Struct({ messages: MessageList, responseCard: S.optional(S.String) }),
).annotations({ identifier: "Statement" }) as any as S.Schema<Statement>;
export interface Prompt {
  messages: Message[];
  maxAttempts: number;
  responseCard?: string;
}
export const Prompt = S.suspend(() =>
  S.Struct({
    messages: MessageList,
    maxAttempts: S.Number,
    responseCard: S.optional(S.String),
  }),
).annotations({ identifier: "Prompt" }) as any as S.Schema<Prompt>;
export interface FollowUpPrompt {
  prompt: Prompt;
  rejectionStatement: Statement;
}
export const FollowUpPrompt = S.suspend(() =>
  S.Struct({ prompt: Prompt, rejectionStatement: Statement }),
).annotations({
  identifier: "FollowUpPrompt",
}) as any as S.Schema<FollowUpPrompt>;
export interface CodeHook {
  uri: string;
  messageVersion: string;
}
export const CodeHook = S.suspend(() =>
  S.Struct({ uri: S.String, messageVersion: S.String }),
).annotations({ identifier: "CodeHook" }) as any as S.Schema<CodeHook>;
export interface FulfillmentActivity {
  type: FulfillmentActivityType;
  codeHook?: CodeHook;
}
export const FulfillmentActivity = S.suspend(() =>
  S.Struct({ type: FulfillmentActivityType, codeHook: S.optional(CodeHook) }),
).annotations({
  identifier: "FulfillmentActivity",
}) as any as S.Schema<FulfillmentActivity>;
export interface KendraConfiguration {
  kendraIndex: string;
  queryFilterString?: string;
  role: string;
}
export const KendraConfiguration = S.suspend(() =>
  S.Struct({
    kendraIndex: S.String,
    queryFilterString: S.optional(S.String),
    role: S.String,
  }),
).annotations({
  identifier: "KendraConfiguration",
}) as any as S.Schema<KendraConfiguration>;
export interface InputContext {
  name: string;
}
export const InputContext = S.suspend(() =>
  S.Struct({ name: S.String }),
).annotations({ identifier: "InputContext" }) as any as S.Schema<InputContext>;
export type InputContextList = InputContext[];
export const InputContextList = S.Array(InputContext);
export interface OutputContext {
  name: string;
  timeToLiveInSeconds: number;
  turnsToLive: number;
}
export const OutputContext = S.suspend(() =>
  S.Struct({
    name: S.String,
    timeToLiveInSeconds: S.Number,
    turnsToLive: S.Number,
  }),
).annotations({
  identifier: "OutputContext",
}) as any as S.Schema<OutputContext>;
export type OutputContextList = OutputContext[];
export const OutputContextList = S.Array(OutputContext);
export interface EnumerationValue {
  value: string;
  synonyms?: string[];
}
export const EnumerationValue = S.suspend(() =>
  S.Struct({ value: S.String, synonyms: S.optional(SynonymList) }),
).annotations({
  identifier: "EnumerationValue",
}) as any as S.Schema<EnumerationValue>;
export type EnumerationValues = EnumerationValue[];
export const EnumerationValues = S.Array(EnumerationValue);
export type LogType = "AUDIO" | "TEXT" | (string & {});
export const LogType = S.String;
export type Destination = "CLOUDWATCH_LOGS" | "S3" | (string & {});
export const Destination = S.String;
export interface CreateBotVersionResponse {
  name?: string;
  description?: string;
  intents?: Intent[];
  clarificationPrompt?: Prompt;
  abortStatement?: Statement;
  status?: Status;
  failureReason?: string;
  lastUpdatedDate?: Date;
  createdDate?: Date;
  idleSessionTTLInSeconds?: number;
  voiceId?: string;
  checksum?: string;
  version?: string;
  locale?: Locale;
  childDirected?: boolean;
  enableModelImprovements?: boolean;
  detectSentiment?: boolean;
}
export const CreateBotVersionResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    intents: S.optional(IntentList),
    clarificationPrompt: S.optional(Prompt),
    abortStatement: S.optional(Statement),
    status: S.optional(Status),
    failureReason: S.optional(S.String),
    lastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    idleSessionTTLInSeconds: S.optional(S.Number),
    voiceId: S.optional(S.String),
    checksum: S.optional(S.String),
    version: S.optional(S.String),
    locale: S.optional(Locale),
    childDirected: S.optional(S.Boolean),
    enableModelImprovements: S.optional(S.Boolean),
    detectSentiment: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CreateBotVersionResponse",
}) as any as S.Schema<CreateBotVersionResponse>;
export interface SlotDefaultValue {
  defaultValue: string;
}
export const SlotDefaultValue = S.suspend(() =>
  S.Struct({ defaultValue: S.String }),
).annotations({
  identifier: "SlotDefaultValue",
}) as any as S.Schema<SlotDefaultValue>;
export type SlotDefaultValueList = SlotDefaultValue[];
export const SlotDefaultValueList = S.Array(SlotDefaultValue);
export interface SlotDefaultValueSpec {
  defaultValueList: SlotDefaultValue[];
}
export const SlotDefaultValueSpec = S.suspend(() =>
  S.Struct({ defaultValueList: SlotDefaultValueList }),
).annotations({
  identifier: "SlotDefaultValueSpec",
}) as any as S.Schema<SlotDefaultValueSpec>;
export interface Slot {
  name: string;
  description?: string;
  slotConstraint: SlotConstraint;
  slotType?: string;
  slotTypeVersion?: string;
  valueElicitationPrompt?: Prompt;
  priority?: number;
  sampleUtterances?: string[];
  responseCard?: string;
  obfuscationSetting?: ObfuscationSetting;
  defaultValueSpec?: SlotDefaultValueSpec;
}
export const Slot = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    slotConstraint: SlotConstraint,
    slotType: S.optional(S.String),
    slotTypeVersion: S.optional(S.String),
    valueElicitationPrompt: S.optional(Prompt),
    priority: S.optional(S.Number),
    sampleUtterances: S.optional(SlotUtteranceList),
    responseCard: S.optional(S.String),
    obfuscationSetting: S.optional(ObfuscationSetting),
    defaultValueSpec: S.optional(SlotDefaultValueSpec),
  }),
).annotations({ identifier: "Slot" }) as any as S.Schema<Slot>;
export type SlotList = Slot[];
export const SlotList = S.Array(Slot);
export interface CreateIntentVersionResponse {
  name?: string;
  description?: string;
  slots?: Slot[];
  sampleUtterances?: string[];
  confirmationPrompt?: Prompt;
  rejectionStatement?: Statement;
  followUpPrompt?: FollowUpPrompt;
  conclusionStatement?: Statement;
  dialogCodeHook?: CodeHook;
  fulfillmentActivity?: FulfillmentActivity;
  parentIntentSignature?: string;
  lastUpdatedDate?: Date;
  createdDate?: Date;
  version?: string;
  checksum?: string;
  kendraConfiguration?: KendraConfiguration;
  inputContexts?: InputContext[];
  outputContexts?: OutputContext[];
}
export const CreateIntentVersionResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    slots: S.optional(SlotList),
    sampleUtterances: S.optional(IntentUtteranceList),
    confirmationPrompt: S.optional(Prompt),
    rejectionStatement: S.optional(Statement),
    followUpPrompt: S.optional(FollowUpPrompt),
    conclusionStatement: S.optional(Statement),
    dialogCodeHook: S.optional(CodeHook),
    fulfillmentActivity: S.optional(FulfillmentActivity),
    parentIntentSignature: S.optional(S.String),
    lastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    version: S.optional(S.String),
    checksum: S.optional(S.String),
    kendraConfiguration: S.optional(KendraConfiguration),
    inputContexts: S.optional(InputContextList),
    outputContexts: S.optional(OutputContextList),
  }),
).annotations({
  identifier: "CreateIntentVersionResponse",
}) as any as S.Schema<CreateIntentVersionResponse>;
export interface SlotTypeRegexConfiguration {
  pattern: string;
}
export const SlotTypeRegexConfiguration = S.suspend(() =>
  S.Struct({ pattern: S.String }),
).annotations({
  identifier: "SlotTypeRegexConfiguration",
}) as any as S.Schema<SlotTypeRegexConfiguration>;
export interface SlotTypeConfiguration {
  regexConfiguration?: SlotTypeRegexConfiguration;
}
export const SlotTypeConfiguration = S.suspend(() =>
  S.Struct({ regexConfiguration: S.optional(SlotTypeRegexConfiguration) }),
).annotations({
  identifier: "SlotTypeConfiguration",
}) as any as S.Schema<SlotTypeConfiguration>;
export type SlotTypeConfigurations = SlotTypeConfiguration[];
export const SlotTypeConfigurations = S.Array(SlotTypeConfiguration);
export interface CreateSlotTypeVersionResponse {
  name?: string;
  description?: string;
  enumerationValues?: EnumerationValue[];
  lastUpdatedDate?: Date;
  createdDate?: Date;
  version?: string;
  checksum?: string;
  valueSelectionStrategy?: SlotValueSelectionStrategy;
  parentSlotTypeSignature?: string;
  slotTypeConfigurations?: SlotTypeConfiguration[];
}
export const CreateSlotTypeVersionResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    enumerationValues: S.optional(EnumerationValues),
    lastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    version: S.optional(S.String),
    checksum: S.optional(S.String),
    valueSelectionStrategy: S.optional(SlotValueSelectionStrategy),
    parentSlotTypeSignature: S.optional(S.String),
    slotTypeConfigurations: S.optional(SlotTypeConfigurations),
  }),
).annotations({
  identifier: "CreateSlotTypeVersionResponse",
}) as any as S.Schema<CreateSlotTypeVersionResponse>;
export interface GetBotResponse {
  name?: string;
  description?: string;
  intents?: Intent[];
  enableModelImprovements?: boolean;
  nluIntentConfidenceThreshold?: number;
  clarificationPrompt?: Prompt;
  abortStatement?: Statement;
  status?: Status;
  failureReason?: string;
  lastUpdatedDate?: Date;
  createdDate?: Date;
  idleSessionTTLInSeconds?: number;
  voiceId?: string;
  checksum?: string;
  version?: string;
  locale?: Locale;
  childDirected?: boolean;
  detectSentiment?: boolean;
}
export const GetBotResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    intents: S.optional(IntentList),
    enableModelImprovements: S.optional(S.Boolean),
    nluIntentConfidenceThreshold: S.optional(S.Number),
    clarificationPrompt: S.optional(Prompt),
    abortStatement: S.optional(Statement),
    status: S.optional(Status),
    failureReason: S.optional(S.String),
    lastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    idleSessionTTLInSeconds: S.optional(S.Number),
    voiceId: S.optional(S.String),
    checksum: S.optional(S.String),
    version: S.optional(S.String),
    locale: S.optional(Locale),
    childDirected: S.optional(S.Boolean),
    detectSentiment: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GetBotResponse",
}) as any as S.Schema<GetBotResponse>;
export interface BotMetadata {
  name?: string;
  description?: string;
  status?: Status;
  lastUpdatedDate?: Date;
  createdDate?: Date;
  version?: string;
}
export const BotMetadata = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    status: S.optional(Status),
    lastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    version: S.optional(S.String),
  }),
).annotations({ identifier: "BotMetadata" }) as any as S.Schema<BotMetadata>;
export type BotMetadataList = BotMetadata[];
export const BotMetadataList = S.Array(BotMetadata);
export interface GetBotVersionsResponse {
  bots?: BotMetadata[];
  nextToken?: string;
}
export const GetBotVersionsResponse = S.suspend(() =>
  S.Struct({
    bots: S.optional(BotMetadataList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetBotVersionsResponse",
}) as any as S.Schema<GetBotVersionsResponse>;
export interface GetExportResponse {
  name?: string;
  version?: string;
  resourceType?: ResourceType;
  exportType?: ExportType;
  exportStatus?: ExportStatus;
  failureReason?: string;
  url?: string;
}
export const GetExportResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    version: S.optional(S.String),
    resourceType: S.optional(ResourceType),
    exportType: S.optional(ExportType),
    exportStatus: S.optional(ExportStatus),
    failureReason: S.optional(S.String),
    url: S.optional(S.String),
  }),
).annotations({
  identifier: "GetExportResponse",
}) as any as S.Schema<GetExportResponse>;
export interface GetImportResponse {
  name?: string;
  resourceType?: ResourceType;
  mergeStrategy?: MergeStrategy;
  importId?: string;
  importStatus?: ImportStatus;
  failureReason?: string[];
  createdDate?: Date;
}
export const GetImportResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    resourceType: S.optional(ResourceType),
    mergeStrategy: S.optional(MergeStrategy),
    importId: S.optional(S.String),
    importStatus: S.optional(ImportStatus),
    failureReason: S.optional(StringList),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetImportResponse",
}) as any as S.Schema<GetImportResponse>;
export interface GetIntentResponse {
  name?: string;
  description?: string;
  slots?: Slot[];
  sampleUtterances?: string[];
  confirmationPrompt?: Prompt;
  rejectionStatement?: Statement;
  followUpPrompt?: FollowUpPrompt;
  conclusionStatement?: Statement;
  dialogCodeHook?: CodeHook;
  fulfillmentActivity?: FulfillmentActivity;
  parentIntentSignature?: string;
  lastUpdatedDate?: Date;
  createdDate?: Date;
  version?: string;
  checksum?: string;
  kendraConfiguration?: KendraConfiguration;
  inputContexts?: InputContext[];
  outputContexts?: OutputContext[];
}
export const GetIntentResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    slots: S.optional(SlotList),
    sampleUtterances: S.optional(IntentUtteranceList),
    confirmationPrompt: S.optional(Prompt),
    rejectionStatement: S.optional(Statement),
    followUpPrompt: S.optional(FollowUpPrompt),
    conclusionStatement: S.optional(Statement),
    dialogCodeHook: S.optional(CodeHook),
    fulfillmentActivity: S.optional(FulfillmentActivity),
    parentIntentSignature: S.optional(S.String),
    lastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    version: S.optional(S.String),
    checksum: S.optional(S.String),
    kendraConfiguration: S.optional(KendraConfiguration),
    inputContexts: S.optional(InputContextList),
    outputContexts: S.optional(OutputContextList),
  }),
).annotations({
  identifier: "GetIntentResponse",
}) as any as S.Schema<GetIntentResponse>;
export interface IntentMetadata {
  name?: string;
  description?: string;
  lastUpdatedDate?: Date;
  createdDate?: Date;
  version?: string;
}
export const IntentMetadata = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    lastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    version: S.optional(S.String),
  }),
).annotations({
  identifier: "IntentMetadata",
}) as any as S.Schema<IntentMetadata>;
export type IntentMetadataList = IntentMetadata[];
export const IntentMetadataList = S.Array(IntentMetadata);
export interface GetIntentVersionsResponse {
  intents?: IntentMetadata[];
  nextToken?: string;
}
export const GetIntentVersionsResponse = S.suspend(() =>
  S.Struct({
    intents: S.optional(IntentMetadataList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetIntentVersionsResponse",
}) as any as S.Schema<GetIntentVersionsResponse>;
export interface GetSlotTypeResponse {
  name?: string;
  description?: string;
  enumerationValues?: EnumerationValue[];
  lastUpdatedDate?: Date;
  createdDate?: Date;
  version?: string;
  checksum?: string;
  valueSelectionStrategy?: SlotValueSelectionStrategy;
  parentSlotTypeSignature?: string;
  slotTypeConfigurations?: SlotTypeConfiguration[];
}
export const GetSlotTypeResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    enumerationValues: S.optional(EnumerationValues),
    lastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    version: S.optional(S.String),
    checksum: S.optional(S.String),
    valueSelectionStrategy: S.optional(SlotValueSelectionStrategy),
    parentSlotTypeSignature: S.optional(S.String),
    slotTypeConfigurations: S.optional(SlotTypeConfigurations),
  }),
).annotations({
  identifier: "GetSlotTypeResponse",
}) as any as S.Schema<GetSlotTypeResponse>;
export interface SlotTypeMetadata {
  name?: string;
  description?: string;
  lastUpdatedDate?: Date;
  createdDate?: Date;
  version?: string;
}
export const SlotTypeMetadata = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    lastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    version: S.optional(S.String),
  }),
).annotations({
  identifier: "SlotTypeMetadata",
}) as any as S.Schema<SlotTypeMetadata>;
export type SlotTypeMetadataList = SlotTypeMetadata[];
export const SlotTypeMetadataList = S.Array(SlotTypeMetadata);
export interface GetSlotTypeVersionsResponse {
  slotTypes?: SlotTypeMetadata[];
  nextToken?: string;
}
export const GetSlotTypeVersionsResponse = S.suspend(() =>
  S.Struct({
    slotTypes: S.optional(SlotTypeMetadataList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSlotTypeVersionsResponse",
}) as any as S.Schema<GetSlotTypeVersionsResponse>;
export interface ListTagsForResourceResponse {
  tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface StartImportResponse {
  name?: string;
  resourceType?: ResourceType;
  mergeStrategy?: MergeStrategy;
  importId?: string;
  importStatus?: ImportStatus;
  tags?: Tag[];
  createdDate?: Date;
}
export const StartImportResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    resourceType: S.optional(ResourceType),
    mergeStrategy: S.optional(MergeStrategy),
    importId: S.optional(S.String),
    importStatus: S.optional(ImportStatus),
    tags: S.optional(TagList),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "StartImportResponse",
}) as any as S.Schema<StartImportResponse>;
export interface StartMigrationResponse {
  v1BotName?: string;
  v1BotVersion?: string;
  v1BotLocale?: Locale;
  v2BotId?: string;
  v2BotRole?: string;
  migrationId?: string;
  migrationStrategy?: MigrationStrategy;
  migrationTimestamp?: Date;
}
export const StartMigrationResponse = S.suspend(() =>
  S.Struct({
    v1BotName: S.optional(S.String),
    v1BotVersion: S.optional(S.String),
    v1BotLocale: S.optional(Locale),
    v2BotId: S.optional(S.String),
    v2BotRole: S.optional(S.String),
    migrationId: S.optional(S.String),
    migrationStrategy: S.optional(MigrationStrategy),
    migrationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "StartMigrationResponse",
}) as any as S.Schema<StartMigrationResponse>;
export type MigrationAlertType = "ERROR" | "WARN" | (string & {});
export const MigrationAlertType = S.String;
export type MigrationAlertDetails = string[];
export const MigrationAlertDetails = S.Array(S.String);
export type MigrationAlertReferenceURLs = string[];
export const MigrationAlertReferenceURLs = S.Array(S.String);
export interface LogSettingsRequest {
  logType: LogType;
  destination: Destination;
  kmsKeyArn?: string;
  resourceArn: string;
}
export const LogSettingsRequest = S.suspend(() =>
  S.Struct({
    logType: LogType,
    destination: Destination,
    kmsKeyArn: S.optional(S.String),
    resourceArn: S.String,
  }),
).annotations({
  identifier: "LogSettingsRequest",
}) as any as S.Schema<LogSettingsRequest>;
export type LogSettingsRequestList = LogSettingsRequest[];
export const LogSettingsRequestList = S.Array(LogSettingsRequest);
export interface LogSettingsResponse {
  logType?: LogType;
  destination?: Destination;
  kmsKeyArn?: string;
  resourceArn?: string;
  resourcePrefix?: string;
}
export const LogSettingsResponse = S.suspend(() =>
  S.Struct({
    logType: S.optional(LogType),
    destination: S.optional(Destination),
    kmsKeyArn: S.optional(S.String),
    resourceArn: S.optional(S.String),
    resourcePrefix: S.optional(S.String),
  }),
).annotations({
  identifier: "LogSettingsResponse",
}) as any as S.Schema<LogSettingsResponse>;
export type LogSettingsResponseList = LogSettingsResponse[];
export const LogSettingsResponseList = S.Array(LogSettingsResponse);
export interface ConversationLogsResponse {
  logSettings?: LogSettingsResponse[];
  iamRoleArn?: string;
}
export const ConversationLogsResponse = S.suspend(() =>
  S.Struct({
    logSettings: S.optional(LogSettingsResponseList),
    iamRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ConversationLogsResponse",
}) as any as S.Schema<ConversationLogsResponse>;
export interface BotAliasMetadata {
  name?: string;
  description?: string;
  botVersion?: string;
  botName?: string;
  lastUpdatedDate?: Date;
  createdDate?: Date;
  checksum?: string;
  conversationLogs?: ConversationLogsResponse;
}
export const BotAliasMetadata = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    botVersion: S.optional(S.String),
    botName: S.optional(S.String),
    lastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    checksum: S.optional(S.String),
    conversationLogs: S.optional(ConversationLogsResponse),
  }),
).annotations({
  identifier: "BotAliasMetadata",
}) as any as S.Schema<BotAliasMetadata>;
export type BotAliasMetadataList = BotAliasMetadata[];
export const BotAliasMetadataList = S.Array(BotAliasMetadata);
export type ChannelConfigurationMap = { [key: string]: string | undefined };
export const ChannelConfigurationMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface BotChannelAssociation {
  name?: string;
  description?: string;
  botAlias?: string;
  botName?: string;
  createdDate?: Date;
  type?: ChannelType;
  botConfiguration?: { [key: string]: string | undefined };
  status?: ChannelStatus;
  failureReason?: string;
}
export const BotChannelAssociation = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    botAlias: S.optional(S.String),
    botName: S.optional(S.String),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    type: S.optional(ChannelType),
    botConfiguration: S.optional(ChannelConfigurationMap),
    status: S.optional(ChannelStatus),
    failureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "BotChannelAssociation",
}) as any as S.Schema<BotChannelAssociation>;
export type BotChannelAssociationList = BotChannelAssociation[];
export const BotChannelAssociationList = S.Array(BotChannelAssociation);
export interface BuiltinIntentSlot {
  name?: string;
}
export const BuiltinIntentSlot = S.suspend(() =>
  S.Struct({ name: S.optional(S.String) }),
).annotations({
  identifier: "BuiltinIntentSlot",
}) as any as S.Schema<BuiltinIntentSlot>;
export type BuiltinIntentSlotList = BuiltinIntentSlot[];
export const BuiltinIntentSlotList = S.Array(BuiltinIntentSlot);
export interface BuiltinIntentMetadata {
  signature?: string;
  supportedLocales?: Locale[];
}
export const BuiltinIntentMetadata = S.suspend(() =>
  S.Struct({
    signature: S.optional(S.String),
    supportedLocales: S.optional(LocaleList),
  }),
).annotations({
  identifier: "BuiltinIntentMetadata",
}) as any as S.Schema<BuiltinIntentMetadata>;
export type BuiltinIntentMetadataList = BuiltinIntentMetadata[];
export const BuiltinIntentMetadataList = S.Array(BuiltinIntentMetadata);
export interface BuiltinSlotTypeMetadata {
  signature?: string;
  supportedLocales?: Locale[];
}
export const BuiltinSlotTypeMetadata = S.suspend(() =>
  S.Struct({
    signature: S.optional(S.String),
    supportedLocales: S.optional(LocaleList),
  }),
).annotations({
  identifier: "BuiltinSlotTypeMetadata",
}) as any as S.Schema<BuiltinSlotTypeMetadata>;
export type BuiltinSlotTypeMetadataList = BuiltinSlotTypeMetadata[];
export const BuiltinSlotTypeMetadataList = S.Array(BuiltinSlotTypeMetadata);
export interface MigrationAlert {
  type?: MigrationAlertType;
  message?: string;
  details?: string[];
  referenceURLs?: string[];
}
export const MigrationAlert = S.suspend(() =>
  S.Struct({
    type: S.optional(MigrationAlertType),
    message: S.optional(S.String),
    details: S.optional(MigrationAlertDetails),
    referenceURLs: S.optional(MigrationAlertReferenceURLs),
  }),
).annotations({
  identifier: "MigrationAlert",
}) as any as S.Schema<MigrationAlert>;
export type MigrationAlerts = MigrationAlert[];
export const MigrationAlerts = S.Array(MigrationAlert);
export interface MigrationSummary {
  migrationId?: string;
  v1BotName?: string;
  v1BotVersion?: string;
  v1BotLocale?: Locale;
  v2BotId?: string;
  v2BotRole?: string;
  migrationStatus?: MigrationStatus;
  migrationStrategy?: MigrationStrategy;
  migrationTimestamp?: Date;
}
export const MigrationSummary = S.suspend(() =>
  S.Struct({
    migrationId: S.optional(S.String),
    v1BotName: S.optional(S.String),
    v1BotVersion: S.optional(S.String),
    v1BotLocale: S.optional(Locale),
    v2BotId: S.optional(S.String),
    v2BotRole: S.optional(S.String),
    migrationStatus: S.optional(MigrationStatus),
    migrationStrategy: S.optional(MigrationStrategy),
    migrationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "MigrationSummary",
}) as any as S.Schema<MigrationSummary>;
export type MigrationSummaryList = MigrationSummary[];
export const MigrationSummaryList = S.Array(MigrationSummary);
export interface ConversationLogsRequest {
  logSettings: LogSettingsRequest[];
  iamRoleArn: string;
}
export const ConversationLogsRequest = S.suspend(() =>
  S.Struct({ logSettings: LogSettingsRequestList, iamRoleArn: S.String }),
).annotations({
  identifier: "ConversationLogsRequest",
}) as any as S.Schema<ConversationLogsRequest>;
export interface GetBotAliasesResponse {
  BotAliases?: BotAliasMetadata[];
  nextToken?: string;
}
export const GetBotAliasesResponse = S.suspend(() =>
  S.Struct({
    BotAliases: S.optional(BotAliasMetadataList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetBotAliasesResponse",
}) as any as S.Schema<GetBotAliasesResponse>;
export interface GetBotChannelAssociationResponse {
  name?: string;
  description?: string;
  botAlias?: string;
  botName?: string;
  createdDate?: Date;
  type?: ChannelType;
  botConfiguration?: { [key: string]: string | undefined };
  status?: ChannelStatus;
  failureReason?: string;
}
export const GetBotChannelAssociationResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    botAlias: S.optional(S.String),
    botName: S.optional(S.String),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    type: S.optional(ChannelType),
    botConfiguration: S.optional(ChannelConfigurationMap),
    status: S.optional(ChannelStatus),
    failureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "GetBotChannelAssociationResponse",
}) as any as S.Schema<GetBotChannelAssociationResponse>;
export interface GetBotChannelAssociationsResponse {
  botChannelAssociations?: BotChannelAssociation[];
  nextToken?: string;
}
export const GetBotChannelAssociationsResponse = S.suspend(() =>
  S.Struct({
    botChannelAssociations: S.optional(BotChannelAssociationList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetBotChannelAssociationsResponse",
}) as any as S.Schema<GetBotChannelAssociationsResponse>;
export interface GetBotsResponse {
  bots?: BotMetadata[];
  nextToken?: string;
}
export const GetBotsResponse = S.suspend(() =>
  S.Struct({
    bots: S.optional(BotMetadataList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetBotsResponse",
}) as any as S.Schema<GetBotsResponse>;
export interface GetBuiltinIntentResponse {
  signature?: string;
  supportedLocales?: Locale[];
  slots?: BuiltinIntentSlot[];
}
export const GetBuiltinIntentResponse = S.suspend(() =>
  S.Struct({
    signature: S.optional(S.String),
    supportedLocales: S.optional(LocaleList),
    slots: S.optional(BuiltinIntentSlotList),
  }),
).annotations({
  identifier: "GetBuiltinIntentResponse",
}) as any as S.Schema<GetBuiltinIntentResponse>;
export interface GetBuiltinIntentsResponse {
  intents?: BuiltinIntentMetadata[];
  nextToken?: string;
}
export const GetBuiltinIntentsResponse = S.suspend(() =>
  S.Struct({
    intents: S.optional(BuiltinIntentMetadataList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetBuiltinIntentsResponse",
}) as any as S.Schema<GetBuiltinIntentsResponse>;
export interface GetBuiltinSlotTypesResponse {
  slotTypes?: BuiltinSlotTypeMetadata[];
  nextToken?: string;
}
export const GetBuiltinSlotTypesResponse = S.suspend(() =>
  S.Struct({
    slotTypes: S.optional(BuiltinSlotTypeMetadataList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetBuiltinSlotTypesResponse",
}) as any as S.Schema<GetBuiltinSlotTypesResponse>;
export interface GetIntentsResponse {
  intents?: IntentMetadata[];
  nextToken?: string;
}
export const GetIntentsResponse = S.suspend(() =>
  S.Struct({
    intents: S.optional(IntentMetadataList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetIntentsResponse",
}) as any as S.Schema<GetIntentsResponse>;
export interface GetMigrationResponse {
  migrationId?: string;
  v1BotName?: string;
  v1BotVersion?: string;
  v1BotLocale?: Locale;
  v2BotId?: string;
  v2BotRole?: string;
  migrationStatus?: MigrationStatus;
  migrationStrategy?: MigrationStrategy;
  migrationTimestamp?: Date;
  alerts?: MigrationAlert[];
}
export const GetMigrationResponse = S.suspend(() =>
  S.Struct({
    migrationId: S.optional(S.String),
    v1BotName: S.optional(S.String),
    v1BotVersion: S.optional(S.String),
    v1BotLocale: S.optional(Locale),
    v2BotId: S.optional(S.String),
    v2BotRole: S.optional(S.String),
    migrationStatus: S.optional(MigrationStatus),
    migrationStrategy: S.optional(MigrationStrategy),
    migrationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    alerts: S.optional(MigrationAlerts),
  }),
).annotations({
  identifier: "GetMigrationResponse",
}) as any as S.Schema<GetMigrationResponse>;
export interface GetMigrationsResponse {
  migrationSummaries?: MigrationSummary[];
  nextToken?: string;
}
export const GetMigrationsResponse = S.suspend(() =>
  S.Struct({
    migrationSummaries: S.optional(MigrationSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetMigrationsResponse",
}) as any as S.Schema<GetMigrationsResponse>;
export interface GetSlotTypesResponse {
  slotTypes?: SlotTypeMetadata[];
  nextToken?: string;
}
export const GetSlotTypesResponse = S.suspend(() =>
  S.Struct({
    slotTypes: S.optional(SlotTypeMetadataList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSlotTypesResponse",
}) as any as S.Schema<GetSlotTypesResponse>;
export interface PutBotRequest {
  name: string;
  description?: string;
  intents?: Intent[];
  enableModelImprovements?: boolean;
  nluIntentConfidenceThreshold?: number;
  clarificationPrompt?: Prompt;
  abortStatement?: Statement;
  idleSessionTTLInSeconds?: number;
  voiceId?: string;
  checksum?: string;
  processBehavior?: ProcessBehavior;
  locale: Locale;
  childDirected: boolean;
  detectSentiment?: boolean;
  createVersion?: boolean;
  tags?: Tag[];
}
export const PutBotRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    intents: S.optional(IntentList),
    enableModelImprovements: S.optional(S.Boolean),
    nluIntentConfidenceThreshold: S.optional(S.Number),
    clarificationPrompt: S.optional(Prompt),
    abortStatement: S.optional(Statement),
    idleSessionTTLInSeconds: S.optional(S.Number),
    voiceId: S.optional(S.String),
    checksum: S.optional(S.String),
    processBehavior: S.optional(ProcessBehavior),
    locale: Locale,
    childDirected: S.Boolean,
    detectSentiment: S.optional(S.Boolean),
    createVersion: S.optional(S.Boolean),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/bots/{name}/versions/$LATEST" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutBotRequest",
}) as any as S.Schema<PutBotRequest>;
export interface PutBotAliasRequest {
  name: string;
  description?: string;
  botVersion: string;
  botName: string;
  checksum?: string;
  conversationLogs?: ConversationLogsRequest;
  tags?: Tag[];
}
export const PutBotAliasRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    botVersion: S.String,
    botName: S.String.pipe(T.HttpLabel("botName")),
    checksum: S.optional(S.String),
    conversationLogs: S.optional(ConversationLogsRequest),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/bots/{botName}/aliases/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutBotAliasRequest",
}) as any as S.Schema<PutBotAliasRequest>;
export interface PutSlotTypeRequest {
  name: string;
  description?: string;
  enumerationValues?: EnumerationValue[];
  checksum?: string;
  valueSelectionStrategy?: SlotValueSelectionStrategy;
  createVersion?: boolean;
  parentSlotTypeSignature?: string;
  slotTypeConfigurations?: SlotTypeConfiguration[];
}
export const PutSlotTypeRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    enumerationValues: S.optional(EnumerationValues),
    checksum: S.optional(S.String),
    valueSelectionStrategy: S.optional(SlotValueSelectionStrategy),
    createVersion: S.optional(S.Boolean),
    parentSlotTypeSignature: S.optional(S.String),
    slotTypeConfigurations: S.optional(SlotTypeConfigurations),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/slottypes/{name}/versions/$LATEST" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutSlotTypeRequest",
}) as any as S.Schema<PutSlotTypeRequest>;
export interface UtteranceData {
  utteranceString?: string;
  count?: number;
  distinctUsers?: number;
  firstUtteredDate?: Date;
  lastUtteredDate?: Date;
}
export const UtteranceData = S.suspend(() =>
  S.Struct({
    utteranceString: S.optional(S.String),
    count: S.optional(S.Number),
    distinctUsers: S.optional(S.Number),
    firstUtteredDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUtteredDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "UtteranceData",
}) as any as S.Schema<UtteranceData>;
export type ListOfUtterance = UtteranceData[];
export const ListOfUtterance = S.Array(UtteranceData);
export interface UtteranceList {
  botVersion?: string;
  utterances?: UtteranceData[];
}
export const UtteranceList = S.suspend(() =>
  S.Struct({
    botVersion: S.optional(S.String),
    utterances: S.optional(ListOfUtterance),
  }),
).annotations({
  identifier: "UtteranceList",
}) as any as S.Schema<UtteranceList>;
export type ListsOfUtterances = UtteranceList[];
export const ListsOfUtterances = S.Array(UtteranceList);
export interface GetBotAliasResponse {
  name?: string;
  description?: string;
  botVersion?: string;
  botName?: string;
  lastUpdatedDate?: Date;
  createdDate?: Date;
  checksum?: string;
  conversationLogs?: ConversationLogsResponse;
}
export const GetBotAliasResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    botVersion: S.optional(S.String),
    botName: S.optional(S.String),
    lastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    checksum: S.optional(S.String),
    conversationLogs: S.optional(ConversationLogsResponse),
  }),
).annotations({
  identifier: "GetBotAliasResponse",
}) as any as S.Schema<GetBotAliasResponse>;
export interface GetUtterancesViewResponse {
  botName?: string;
  utterances?: UtteranceList[];
}
export const GetUtterancesViewResponse = S.suspend(() =>
  S.Struct({
    botName: S.optional(S.String),
    utterances: S.optional(ListsOfUtterances),
  }),
).annotations({
  identifier: "GetUtterancesViewResponse",
}) as any as S.Schema<GetUtterancesViewResponse>;
export interface PutBotResponse {
  name?: string;
  description?: string;
  intents?: Intent[];
  enableModelImprovements?: boolean;
  nluIntentConfidenceThreshold?: number;
  clarificationPrompt?: Prompt;
  abortStatement?: Statement;
  status?: Status;
  failureReason?: string;
  lastUpdatedDate?: Date;
  createdDate?: Date;
  idleSessionTTLInSeconds?: number;
  voiceId?: string;
  checksum?: string;
  version?: string;
  locale?: Locale;
  childDirected?: boolean;
  createVersion?: boolean;
  detectSentiment?: boolean;
  tags?: Tag[];
}
export const PutBotResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    intents: S.optional(IntentList),
    enableModelImprovements: S.optional(S.Boolean),
    nluIntentConfidenceThreshold: S.optional(S.Number),
    clarificationPrompt: S.optional(Prompt),
    abortStatement: S.optional(Statement),
    status: S.optional(Status),
    failureReason: S.optional(S.String),
    lastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    idleSessionTTLInSeconds: S.optional(S.Number),
    voiceId: S.optional(S.String),
    checksum: S.optional(S.String),
    version: S.optional(S.String),
    locale: S.optional(Locale),
    childDirected: S.optional(S.Boolean),
    createVersion: S.optional(S.Boolean),
    detectSentiment: S.optional(S.Boolean),
    tags: S.optional(TagList),
  }),
).annotations({
  identifier: "PutBotResponse",
}) as any as S.Schema<PutBotResponse>;
export interface PutBotAliasResponse {
  name?: string;
  description?: string;
  botVersion?: string;
  botName?: string;
  lastUpdatedDate?: Date;
  createdDate?: Date;
  checksum?: string;
  conversationLogs?: ConversationLogsResponse;
  tags?: Tag[];
}
export const PutBotAliasResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    botVersion: S.optional(S.String),
    botName: S.optional(S.String),
    lastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    checksum: S.optional(S.String),
    conversationLogs: S.optional(ConversationLogsResponse),
    tags: S.optional(TagList),
  }),
).annotations({
  identifier: "PutBotAliasResponse",
}) as any as S.Schema<PutBotAliasResponse>;
export interface PutIntentRequest {
  name: string;
  description?: string;
  slots?: Slot[];
  sampleUtterances?: string[];
  confirmationPrompt?: Prompt;
  rejectionStatement?: Statement;
  followUpPrompt?: FollowUpPrompt;
  conclusionStatement?: Statement;
  dialogCodeHook?: CodeHook;
  fulfillmentActivity?: FulfillmentActivity;
  parentIntentSignature?: string;
  checksum?: string;
  createVersion?: boolean;
  kendraConfiguration?: KendraConfiguration;
  inputContexts?: InputContext[];
  outputContexts?: OutputContext[];
}
export const PutIntentRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
    slots: S.optional(SlotList),
    sampleUtterances: S.optional(IntentUtteranceList),
    confirmationPrompt: S.optional(Prompt),
    rejectionStatement: S.optional(Statement),
    followUpPrompt: S.optional(FollowUpPrompt),
    conclusionStatement: S.optional(Statement),
    dialogCodeHook: S.optional(CodeHook),
    fulfillmentActivity: S.optional(FulfillmentActivity),
    parentIntentSignature: S.optional(S.String),
    checksum: S.optional(S.String),
    createVersion: S.optional(S.Boolean),
    kendraConfiguration: S.optional(KendraConfiguration),
    inputContexts: S.optional(InputContextList),
    outputContexts: S.optional(OutputContextList),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/intents/{name}/versions/$LATEST" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutIntentRequest",
}) as any as S.Schema<PutIntentRequest>;
export interface PutSlotTypeResponse {
  name?: string;
  description?: string;
  enumerationValues?: EnumerationValue[];
  lastUpdatedDate?: Date;
  createdDate?: Date;
  version?: string;
  checksum?: string;
  valueSelectionStrategy?: SlotValueSelectionStrategy;
  createVersion?: boolean;
  parentSlotTypeSignature?: string;
  slotTypeConfigurations?: SlotTypeConfiguration[];
}
export const PutSlotTypeResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    enumerationValues: S.optional(EnumerationValues),
    lastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    version: S.optional(S.String),
    checksum: S.optional(S.String),
    valueSelectionStrategy: S.optional(SlotValueSelectionStrategy),
    createVersion: S.optional(S.Boolean),
    parentSlotTypeSignature: S.optional(S.String),
    slotTypeConfigurations: S.optional(SlotTypeConfigurations),
  }),
).annotations({
  identifier: "PutSlotTypeResponse",
}) as any as S.Schema<PutSlotTypeResponse>;
export interface PutIntentResponse {
  name?: string;
  description?: string;
  slots?: Slot[];
  sampleUtterances?: string[];
  confirmationPrompt?: Prompt;
  rejectionStatement?: Statement;
  followUpPrompt?: FollowUpPrompt;
  conclusionStatement?: Statement;
  dialogCodeHook?: CodeHook;
  fulfillmentActivity?: FulfillmentActivity;
  parentIntentSignature?: string;
  lastUpdatedDate?: Date;
  createdDate?: Date;
  version?: string;
  checksum?: string;
  createVersion?: boolean;
  kendraConfiguration?: KendraConfiguration;
  inputContexts?: InputContext[];
  outputContexts?: OutputContext[];
}
export const PutIntentResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    slots: S.optional(SlotList),
    sampleUtterances: S.optional(IntentUtteranceList),
    confirmationPrompt: S.optional(Prompt),
    rejectionStatement: S.optional(Statement),
    followUpPrompt: S.optional(FollowUpPrompt),
    conclusionStatement: S.optional(Statement),
    dialogCodeHook: S.optional(CodeHook),
    fulfillmentActivity: S.optional(FulfillmentActivity),
    parentIntentSignature: S.optional(S.String),
    lastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    version: S.optional(S.String),
    checksum: S.optional(S.String),
    createVersion: S.optional(S.Boolean),
    kendraConfiguration: S.optional(KendraConfiguration),
    inputContexts: S.optional(InputContextList),
    outputContexts: S.optional(OutputContextList),
  }),
).annotations({
  identifier: "PutIntentResponse",
}) as any as S.Schema<PutIntentResponse>;
export type ReferenceType =
  | "Intent"
  | "Bot"
  | "BotAlias"
  | "BotChannel"
  | (string & {});
export const ReferenceType = S.String;
export interface ResourceReference {
  name?: string;
  version?: string;
}
export const ResourceReference = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), version: S.optional(S.String) }),
).annotations({
  identifier: "ResourceReference",
}) as any as S.Schema<ResourceReference>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {
    retryAfterSeconds: S.optional(S.String).pipe(T.HttpHeader("Retry-After")),
    message: S.optional(S.String),
  },
).pipe(C.withThrottlingError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class PreconditionFailedException extends S.TaggedError<PreconditionFailedException>()(
  "PreconditionFailedException",
  { message: S.optional(S.String) },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  {
    referenceType: S.optional(ReferenceType),
    exampleReference: S.optional(ResourceReference),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Use the `GetUtterancesView` operation to get information
 * about the utterances that your users have made to your bot. You can use
 * this list to tune the utterances that your bot responds to.
 *
 * For example, say that you have created a bot to order flowers.
 * After your users have used your bot for a while, use the
 * `GetUtterancesView` operation to see the requests that they
 * have made and whether they have been successful. You might find that the
 * utterance "I want flowers" is not being recognized. You could add this
 * utterance to the `OrderFlowers` intent so that your bot
 * recognizes that utterance.
 *
 * After you publish a new version of a bot, you can get information
 * about the old version and the new so that you can compare the performance
 * across the two versions.
 *
 * Utterance statistics are generated once a day. Data is available
 * for the last 15 days. You can request information for up to 5 versions of
 * your bot in each request. Amazon Lex returns the most frequent utterances
 * received by the bot in the last 15 days. The response contains information
 * about a maximum of 100 utterances for each version.
 *
 * If you set `childDirected` field to true when you
 * created your bot, if you are using slot obfuscation with one or more
 * slots, or if you opted out of participating in improving Amazon Lex, utterances
 * are not available.
 *
 * This operation requires permissions for the
 * `lex:GetUtterancesView` action.
 */
export const getUtterancesView: (
  input: GetUtterancesViewRequest,
) => effect.Effect<
  GetUtterancesViewResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUtterancesViewRequest,
  output: GetUtterancesViewResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
}));
/**
 * Returns a list of aliases for a specified Amazon Lex bot.
 *
 * This operation requires permissions for the
 * `lex:GetBotAliases` action.
 */
export const getBotAliases: {
  (
    input: GetBotAliasesRequest,
  ): effect.Effect<
    GetBotAliasesResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetBotAliasesRequest,
  ) => stream.Stream<
    GetBotAliasesResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetBotAliasesRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetBotAliasesRequest,
  output: GetBotAliasesResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of all of the channels associated with the
 * specified bot.
 *
 * The `GetBotChannelAssociations` operation requires
 * permissions for the `lex:GetBotChannelAssociations`
 * action.
 */
export const getBotChannelAssociations: {
  (
    input: GetBotChannelAssociationsRequest,
  ): effect.Effect<
    GetBotChannelAssociationsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetBotChannelAssociationsRequest,
  ) => stream.Stream<
    GetBotChannelAssociationsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetBotChannelAssociationsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetBotChannelAssociationsRequest,
  output: GetBotChannelAssociationsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a list of built-in intents that meet the specified
 * criteria.
 *
 * This operation requires permission for the
 * `lex:GetBuiltinIntents` action.
 */
export const getBuiltinIntents: {
  (
    input: GetBuiltinIntentsRequest,
  ): effect.Effect<
    GetBuiltinIntentsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetBuiltinIntentsRequest,
  ) => stream.Stream<
    GetBuiltinIntentsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetBuiltinIntentsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetBuiltinIntentsRequest,
  output: GetBuiltinIntentsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a list of built-in slot types that meet the specified
 * criteria.
 *
 * For a list of built-in slot types, see Slot Type Reference in the Alexa Skills
 * Kit.
 *
 * This operation requires permission for the
 * `lex:GetBuiltInSlotTypes` action.
 */
export const getBuiltinSlotTypes: {
  (
    input: GetBuiltinSlotTypesRequest,
  ): effect.Effect<
    GetBuiltinSlotTypesResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetBuiltinSlotTypesRequest,
  ) => stream.Stream<
    GetBuiltinSlotTypesResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetBuiltinSlotTypesRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetBuiltinSlotTypesRequest,
  output: GetBuiltinSlotTypesResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a list of migrations between Amazon Lex V1 and Amazon Lex V2.
 */
export const getMigrations: {
  (
    input: GetMigrationsRequest,
  ): effect.Effect<
    GetMigrationsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetMigrationsRequest,
  ) => stream.Stream<
    GetMigrationsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetMigrationsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetMigrationsRequest,
  output: GetMigrationsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Starts a job to import a resource to Amazon Lex.
 */
export const startImport: (
  input: StartImportRequest,
) => effect.Effect<
  StartImportResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartImportRequest,
  output: StartImportResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
  ],
}));
/**
 * Returns metadata information for a specific bot. You must provide
 * the bot name and the bot version or alias.
 *
 * This operation requires permissions for the
 * `lex:GetBot` action.
 */
export const getBot: (
  input: GetBotRequest,
) => effect.Effect<
  GetBotResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBotRequest,
  output: GetBotResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Creates an Amazon Lex conversational bot or replaces an existing bot.
 * When you create or update a bot you are only required to specify a name, a
 * locale, and whether the bot is directed toward children under age 13. You
 * can use this to add intents later, or to remove intents from an existing
 * bot. When you create a bot with the minimum information, the bot is
 * created or updated but Amazon Lex returns the `` response
 * `FAILED`. You can build the bot after you add one or more
 * intents. For more information about Amazon Lex bots, see how-it-works.
 *
 * If you specify the name of an existing bot, the fields in the
 * request replace the existing values in the `$LATEST` version of
 * the bot. Amazon Lex removes any fields that you don't provide values for in the
 * request, except for the `idleTTLInSeconds` and
 * `privacySettings` fields, which are set to their default
 * values. If you don't specify values for required fields, Amazon Lex throws an
 * exception.
 *
 * This operation requires permissions for the `lex:PutBot`
 * action. For more information, see security-iam.
 */
export const putBot: (
  input: PutBotRequest,
) => effect.Effect<
  PutBotResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | PreconditionFailedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBotRequest,
  output: PutBotResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    PreconditionFailedException,
  ],
}));
/**
 * Creates an intent or replaces an existing intent.
 *
 * To define the interaction between the user and your bot, you use
 * one or more intents. For a pizza ordering bot, for example, you would
 * create an `OrderPizza` intent.
 *
 * To create an intent or replace an existing intent, you must provide
 * the following:
 *
 * - Intent name. For example, `OrderPizza`.
 *
 * - Sample utterances. For example, "Can I order a pizza, please."
 * and "I want to order a pizza."
 *
 * - Information to be gathered. You specify slot types for the
 * information that your bot will request from the user. You can specify
 * standard slot types, such as a date or a time, or custom slot types
 * such as the size and crust of a pizza.
 *
 * - How the intent will be fulfilled. You can provide a Lambda
 * function or configure the intent to return the intent information to
 * the client application. If you use a Lambda function, when all of the
 * intent information is available, Amazon Lex invokes your Lambda function.
 * If you configure your intent to return the intent information to the
 * client application.
 *
 * You can specify other optional information in the request, such
 * as:
 *
 * - A confirmation prompt to ask the user to confirm an intent. For
 * example, "Shall I order your pizza?"
 *
 * - A conclusion statement to send to the user after the intent has
 * been fulfilled. For example, "I placed your pizza order."
 *
 * - A follow-up prompt that asks the user for additional activity.
 * For example, asking "Do you want to order a drink with your
 * pizza?"
 *
 * If you specify an existing intent name to update the intent, Amazon Lex
 * replaces the values in the `$LATEST` version of the intent with
 * the values in the request. Amazon Lex removes fields that you don't provide in
 * the request. If you don't specify the required fields, Amazon Lex throws an
 * exception. When you update the `$LATEST` version of an intent,
 * the `status` field of any bot that uses the
 * `$LATEST` version of the intent is set to
 * `NOT_BUILT`.
 *
 * For more information, see how-it-works.
 *
 * This operation requires permissions for the
 * `lex:PutIntent` action.
 */
export const putIntent: (
  input: PutIntentRequest,
) => effect.Effect<
  PutIntentResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | PreconditionFailedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutIntentRequest,
  output: PutIntentResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    PreconditionFailedException,
  ],
}));
/**
 * Returns information about an Amazon Lex bot alias. For more information
 * about aliases, see versioning-aliases.
 *
 * This operation requires permissions for the
 * `lex:GetBotAlias` action.
 */
export const getBotAlias: (
  input: GetBotAliasRequest,
) => effect.Effect<
  GetBotAliasResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBotAliasRequest,
  output: GetBotAliasResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Returns information about the association between an Amazon Lex bot and
 * a messaging platform.
 *
 * This operation requires permissions for the
 * `lex:GetBotChannelAssociation` action.
 */
export const getBotChannelAssociation: (
  input: GetBotChannelAssociationRequest,
) => effect.Effect<
  GetBotChannelAssociationResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBotChannelAssociationRequest,
  output: GetBotChannelAssociationResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Returns bot information as follows:
 *
 * - If you provide the `nameContains` field, the
 * response includes information for the `$LATEST` version of
 * all bots whose name contains the specified string.
 *
 * - If you don't specify the `nameContains` field, the
 * operation returns information about the `$LATEST` version
 * of all of your bots.
 *
 * This operation requires permission for the `lex:GetBots`
 * action.
 */
export const getBots: {
  (
    input: GetBotsRequest,
  ): effect.Effect<
    GetBotsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetBotsRequest,
  ) => stream.Stream<
    GetBotsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetBotsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetBotsRequest,
  output: GetBotsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns information about a built-in intent.
 *
 * This operation requires permission for the
 * `lex:GetBuiltinIntent` action.
 */
export const getBuiltinIntent: (
  input: GetBuiltinIntentRequest,
) => effect.Effect<
  GetBuiltinIntentResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBuiltinIntentRequest,
  output: GetBuiltinIntentResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Returns intent information as follows:
 *
 * - If you specify the `nameContains` field, returns the
 * `$LATEST` version of all intents that contain the
 * specified string.
 *
 * - If you don't specify the `nameContains` field,
 * returns information about the `$LATEST` version of all
 * intents.
 *
 * The operation requires permission for the
 * `lex:GetIntents` action.
 */
export const getIntents: {
  (
    input: GetIntentsRequest,
  ): effect.Effect<
    GetIntentsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetIntentsRequest,
  ) => stream.Stream<
    GetIntentsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetIntentsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetIntentsRequest,
  output: GetIntentsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Provides details about an ongoing or complete migration from an
 * Amazon Lex V1 bot to an Amazon Lex V2 bot. Use this operation to view the migration
 * alerts and warnings related to the migration.
 */
export const getMigration: (
  input: GetMigrationRequest,
) => effect.Effect<
  GetMigrationResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMigrationRequest,
  output: GetMigrationResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Returns slot type information as follows:
 *
 * - If you specify the `nameContains` field, returns the
 * `$LATEST` version of all slot types that contain the
 * specified string.
 *
 * - If you don't specify the `nameContains` field,
 * returns information about the `$LATEST` version of all slot
 * types.
 *
 * The operation requires permission for the
 * `lex:GetSlotTypes` action.
 */
export const getSlotTypes: {
  (
    input: GetSlotTypesRequest,
  ): effect.Effect<
    GetSlotTypesResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetSlotTypesRequest,
  ) => stream.Stream<
    GetSlotTypesResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetSlotTypesRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetSlotTypesRequest,
  output: GetSlotTypesResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Starts migrating a bot from Amazon Lex V1 to Amazon Lex V2. Migrate your bot when
 * you want to take advantage of the new features of Amazon Lex V2.
 *
 * For more information, see Migrating a bot in the Amazon Lex
 * developer guide.
 */
export const startMigration: (
  input: StartMigrationRequest,
) => effect.Effect<
  StartMigrationResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMigrationRequest,
  output: StartMigrationResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Deletes the association between an Amazon Lex bot and a messaging
 * platform.
 *
 * This operation requires permission for the
 * `lex:DeleteBotChannelAssociation` action.
 */
export const deleteBotChannelAssociation: (
  input: DeleteBotChannelAssociationRequest,
) => effect.Effect<
  DeleteBotChannelAssociationResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBotChannelAssociationRequest,
  output: DeleteBotChannelAssociationResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Adds the specified tags to the specified resource. If a tag key
 * already exists, the existing value is replaced with the new value.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Removes tags from a bot, bot alias or bot channel.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Creates a new version of the bot based on the `$LATEST`
 * version. If the `$LATEST` version of this resource hasn't
 * changed since you created the last version, Amazon Lex doesn't create a new
 * version. It returns the last created version.
 *
 * You can update only the `$LATEST` version of the bot.
 * You can't update the numbered versions that you create with the
 * `CreateBotVersion` operation.
 *
 * When you create the first version of a bot, Amazon Lex sets the version
 * to 1. Subsequent versions increment by 1. For more information, see versioning-intro.
 *
 * This operation requires permission for the
 * `lex:CreateBotVersion` action.
 */
export const createBotVersion: (
  input: CreateBotVersionRequest,
) => effect.Effect<
  CreateBotVersionResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | PreconditionFailedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBotVersionRequest,
  output: CreateBotVersionResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    PreconditionFailedException,
  ],
}));
/**
 * Creates a new version of an intent based on the
 * `$LATEST` version of the intent. If the `$LATEST`
 * version of this intent hasn't changed since you last updated it, Amazon Lex
 * doesn't create a new version. It returns the last version you
 * created.
 *
 * You can update only the `$LATEST` version of the
 * intent. You can't update the numbered versions that you create with the
 * `CreateIntentVersion` operation.
 *
 * When you create a version of an intent, Amazon Lex sets the version to
 * 1. Subsequent versions increment by 1. For more information, see versioning-intro.
 *
 * This operation requires permissions to perform the
 * `lex:CreateIntentVersion` action.
 */
export const createIntentVersion: (
  input: CreateIntentVersionRequest,
) => effect.Effect<
  CreateIntentVersionResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | PreconditionFailedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIntentVersionRequest,
  output: CreateIntentVersionResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    PreconditionFailedException,
  ],
}));
/**
 * Creates a new version of a slot type based on the
 * `$LATEST` version of the specified slot type. If the
 * `$LATEST` version of this resource has not changed since the
 * last version that you created, Amazon Lex doesn't create a new version. It
 * returns the last version that you created.
 *
 * You can update only the `$LATEST` version of a slot
 * type. You can't update the numbered versions that you create with the
 * `CreateSlotTypeVersion` operation.
 *
 * When you create a version of a slot type, Amazon Lex sets the version to
 * 1. Subsequent versions increment by 1. For more information, see versioning-intro.
 *
 * This operation requires permissions for the
 * `lex:CreateSlotTypeVersion` action.
 */
export const createSlotTypeVersion: (
  input: CreateSlotTypeVersionRequest,
) => effect.Effect<
  CreateSlotTypeVersionResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | PreconditionFailedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSlotTypeVersionRequest,
  output: CreateSlotTypeVersionResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    PreconditionFailedException,
  ],
}));
/**
 * Gets information about all of the versions of a bot.
 *
 * The `GetBotVersions` operation returns a
 * `BotMetadata` object for each version of a bot. For example,
 * if a bot has three numbered versions, the `GetBotVersions`
 * operation returns four `BotMetadata` objects in the response,
 * one for each numbered version and one for the `$LATEST`
 * version.
 *
 * The `GetBotVersions` operation always returns at least
 * one version, the `$LATEST` version.
 *
 * This operation requires permissions for the
 * `lex:GetBotVersions` action.
 */
export const getBotVersions: {
  (
    input: GetBotVersionsRequest,
  ): effect.Effect<
    GetBotVersionsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetBotVersionsRequest,
  ) => stream.Stream<
    GetBotVersionsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetBotVersionsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetBotVersionsRequest,
  output: GetBotVersionsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Exports the contents of a Amazon Lex resource in a specified format.
 */
export const getExport: (
  input: GetExportRequest,
) => effect.Effect<
  GetExportResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExportRequest,
  output: GetExportResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Gets information about an import job started with the
 * `StartImport` operation.
 */
export const getImport: (
  input: GetImportRequest,
) => effect.Effect<
  GetImportResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetImportRequest,
  output: GetImportResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Returns information about an intent. In addition to the intent
 * name, you must specify the intent version.
 *
 * This operation requires permissions to perform the
 * `lex:GetIntent` action.
 */
export const getIntent: (
  input: GetIntentRequest,
) => effect.Effect<
  GetIntentResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIntentRequest,
  output: GetIntentResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Gets information about all of the versions of an intent.
 *
 * The `GetIntentVersions` operation returns an
 * `IntentMetadata` object for each version of an intent. For
 * example, if an intent has three numbered versions, the
 * `GetIntentVersions` operation returns four
 * `IntentMetadata` objects in the response, one for each
 * numbered version and one for the `$LATEST` version.
 *
 * The `GetIntentVersions` operation always returns at
 * least one version, the `$LATEST` version.
 *
 * This operation requires permissions for the
 * `lex:GetIntentVersions` action.
 */
export const getIntentVersions: {
  (
    input: GetIntentVersionsRequest,
  ): effect.Effect<
    GetIntentVersionsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetIntentVersionsRequest,
  ) => stream.Stream<
    GetIntentVersionsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetIntentVersionsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetIntentVersionsRequest,
  output: GetIntentVersionsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns information about a specific version of a slot type. In
 * addition to specifying the slot type name, you must specify the slot type
 * version.
 *
 * This operation requires permissions for the
 * `lex:GetSlotType` action.
 */
export const getSlotType: (
  input: GetSlotTypeRequest,
) => effect.Effect<
  GetSlotTypeResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSlotTypeRequest,
  output: GetSlotTypeResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Gets information about all versions of a slot type.
 *
 * The `GetSlotTypeVersions` operation returns a
 * `SlotTypeMetadata` object for each version of a slot type.
 * For example, if a slot type has three numbered versions, the
 * `GetSlotTypeVersions` operation returns four
 * `SlotTypeMetadata` objects in the response, one for each
 * numbered version and one for the `$LATEST` version.
 *
 * The `GetSlotTypeVersions` operation always returns at
 * least one version, the `$LATEST` version.
 *
 * This operation requires permissions for the
 * `lex:GetSlotTypeVersions` action.
 */
export const getSlotTypeVersions: {
  (
    input: GetSlotTypeVersionsRequest,
  ): effect.Effect<
    GetSlotTypeVersionsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetSlotTypeVersionsRequest,
  ) => stream.Stream<
    GetSlotTypeVersionsResponse,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetSlotTypeVersionsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | NotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetSlotTypeVersionsRequest,
  output: GetSlotTypeVersionsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a list of tags associated with the specified resource. Only bots,
 * bot aliases, and bot channels can have tags associated with them.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Deletes stored utterances.
 *
 * Amazon Lex stores the utterances that users send to your bot. Utterances
 * are stored for 15 days for use with the GetUtterancesView operation, and then stored indefinitely for use in improving the
 * ability of your bot to respond to user input.
 *
 * Use the `DeleteUtterances` operation to manually delete
 * stored utterances for a specific user. When you use the
 * `DeleteUtterances` operation, utterances stored for improving
 * your bot's ability to respond to user input are deleted immediately.
 * Utterances stored for use with the `GetUtterancesView`
 * operation are deleted after 15 days.
 *
 * This operation requires permissions for the
 * `lex:DeleteUtterances` action.
 */
export const deleteUtterances: (
  input: DeleteUtterancesRequest,
) => effect.Effect<
  DeleteUtterancesResponse,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUtterancesRequest,
  output: DeleteUtterancesResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
  ],
}));
/**
 * Creates an alias for the specified version of the bot or replaces
 * an alias for the specified bot. To change the version of the bot that the
 * alias points to, replace the alias. For more information about aliases,
 * see versioning-aliases.
 *
 * This operation requires permissions for the
 * `lex:PutBotAlias` action.
 */
export const putBotAlias: (
  input: PutBotAliasRequest,
) => effect.Effect<
  PutBotAliasResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | PreconditionFailedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBotAliasRequest,
  output: PutBotAliasResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    PreconditionFailedException,
  ],
}));
/**
 * Creates a custom slot type or replaces an existing custom slot
 * type.
 *
 * To create a custom slot type, specify a name for the slot type and
 * a set of enumeration values, which are the values that a slot of this type
 * can assume. For more information, see how-it-works.
 *
 * If you specify the name of an existing slot type, the fields in the
 * request replace the existing values in the `$LATEST` version of
 * the slot type. Amazon Lex removes the fields that you don't provide in the
 * request. If you don't specify required fields, Amazon Lex throws an exception.
 * When you update the `$LATEST` version of a slot type, if a bot
 * uses the `$LATEST` version of an intent that contains the slot
 * type, the bot's `status` field is set to
 * `NOT_BUILT`.
 *
 * This operation requires permissions for the
 * `lex:PutSlotType` action.
 */
export const putSlotType: (
  input: PutSlotTypeRequest,
) => effect.Effect<
  PutSlotTypeResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | PreconditionFailedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutSlotTypeRequest,
  output: PutSlotTypeResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    PreconditionFailedException,
  ],
}));
/**
 * Deletes an alias for the specified bot.
 *
 * You can't delete an alias that is used in the association between a
 * bot and a messaging channel. If an alias is used in a channel association,
 * the `DeleteBot` operation returns a
 * `ResourceInUseException` exception that includes a reference
 * to the channel association that refers to the bot. You can remove the
 * reference to the alias by deleting the channel association. If you get the
 * same exception again, delete the referring association until the
 * `DeleteBotAlias` operation is successful.
 */
export const deleteBotAlias: (
  input: DeleteBotAliasRequest,
) => effect.Effect<
  DeleteBotAliasResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | ResourceInUseException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBotAliasRequest,
  output: DeleteBotAliasResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    ResourceInUseException,
  ],
}));
/**
 * Deletes a specific version of a bot. To delete all versions of a
 * bot, use the DeleteBot operation.
 *
 * This operation requires permissions for the
 * `lex:DeleteBotVersion` action.
 */
export const deleteBotVersion: (
  input: DeleteBotVersionRequest,
) => effect.Effect<
  DeleteBotVersionResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | ResourceInUseException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBotVersionRequest,
  output: DeleteBotVersionResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    ResourceInUseException,
  ],
}));
/**
 * Deletes all versions of the intent, including the
 * `$LATEST` version. To delete a specific version of the
 * intent, use the DeleteIntentVersion operation.
 *
 * You can delete a version of an intent only if it is not
 * referenced. To delete an intent that is referred to in one or more bots
 * (see how-it-works), you must remove those references
 * first.
 *
 * If you get the `ResourceInUseException` exception, it
 * provides an example reference that shows where the intent is referenced.
 * To remove the reference to the intent, either update the bot or delete
 * it. If you get the same exception when you attempt to delete the intent
 * again, repeat until the intent has no references and the call to
 * `DeleteIntent` is successful.
 *
 * This operation requires permission for the
 * `lex:DeleteIntent` action.
 */
export const deleteIntent: (
  input: DeleteIntentRequest,
) => effect.Effect<
  DeleteIntentResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | ResourceInUseException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIntentRequest,
  output: DeleteIntentResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    ResourceInUseException,
  ],
}));
/**
 * Deletes a specific version of an intent. To delete all versions of
 * a intent, use the DeleteIntent operation.
 *
 * This operation requires permissions for the
 * `lex:DeleteIntentVersion` action.
 */
export const deleteIntentVersion: (
  input: DeleteIntentVersionRequest,
) => effect.Effect<
  DeleteIntentVersionResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | ResourceInUseException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIntentVersionRequest,
  output: DeleteIntentVersionResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    ResourceInUseException,
  ],
}));
/**
 * Deletes all versions of the slot type, including the
 * `$LATEST` version. To delete a specific version of the slot
 * type, use the DeleteSlotTypeVersion operation.
 *
 * You can delete a version of a slot type only if it is not
 * referenced. To delete a slot type that is referred to in one or more
 * intents, you must remove those references first.
 *
 * If you get the `ResourceInUseException` exception,
 * the exception provides an example reference that shows the intent where
 * the slot type is referenced. To remove the reference to the slot type,
 * either update the intent or delete it. If you get the same exception
 * when you attempt to delete the slot type again, repeat until the slot
 * type has no references and the `DeleteSlotType` call is
 * successful.
 *
 * This operation requires permission for the
 * `lex:DeleteSlotType` action.
 */
export const deleteSlotType: (
  input: DeleteSlotTypeRequest,
) => effect.Effect<
  DeleteSlotTypeResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | ResourceInUseException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSlotTypeRequest,
  output: DeleteSlotTypeResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    ResourceInUseException,
  ],
}));
/**
 * Deletes a specific version of a slot type. To delete all versions
 * of a slot type, use the DeleteSlotType operation.
 *
 * This operation requires permissions for the
 * `lex:DeleteSlotTypeVersion` action.
 */
export const deleteSlotTypeVersion: (
  input: DeleteSlotTypeVersionRequest,
) => effect.Effect<
  DeleteSlotTypeVersionResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | ResourceInUseException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSlotTypeVersionRequest,
  output: DeleteSlotTypeVersionResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    ResourceInUseException,
  ],
}));
/**
 * Deletes all versions of the bot, including the `$LATEST`
 * version. To delete a specific version of the bot, use the DeleteBotVersion operation. The `DeleteBot`
 * operation doesn't immediately remove the bot schema. Instead, it is marked
 * for deletion and removed later.
 *
 * Amazon Lex stores utterances indefinitely for improving the ability of
 * your bot to respond to user inputs. These utterances are not removed when
 * the bot is deleted. To remove the utterances, use the DeleteUtterances operation.
 *
 * If a bot has an alias, you can't delete it. Instead, the
 * `DeleteBot` operation returns a
 * `ResourceInUseException` exception that includes a reference
 * to the alias that refers to the bot. To remove the reference to the bot,
 * delete the alias. If you get the same exception again, delete the
 * referring alias until the `DeleteBot` operation is
 * successful.
 *
 * This operation requires permissions for the
 * `lex:DeleteBot` action.
 */
export const deleteBot: (
  input: DeleteBotRequest,
) => effect.Effect<
  DeleteBotResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | ResourceInUseException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBotRequest,
  output: DeleteBotResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    ResourceInUseException,
  ],
}));
