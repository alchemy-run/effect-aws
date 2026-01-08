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
const ns = T.XmlNamespace("http://kinesis.amazonaws.com/doc/2013-12-02");
const svc = T.AwsApiService({
  sdkId: "Kinesis",
  serviceShapeName: "Kinesis_20131202",
});
const auth = T.AwsAuthSigv4({ name: "kinesis" });
const ver = T.ServiceVersion("2013-12-02");
const proto = T.AwsProtocolsAwsJson1_1();
const rules = T.EndpointResolver((p, _) => {
  const {
    Region,
    UseDualStack = false,
    UseFIPS = false,
    Endpoint,
    StreamARN,
    OperationType,
    ConsumerARN,
    ResourceARN,
  } = p;
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
      StreamARN != null &&
      !(Endpoint != null) &&
      Region != null &&
      PartitionResult != null &&
      PartitionResult !== false &&
      !(_.getAttr(PartitionResult, "name") === "aws-iso") &&
      !(_.getAttr(PartitionResult, "name") === "aws-iso-b")
    ) {
      {
        const arn = _.parseArn(StreamARN);
        if (arn != null && arn !== false) {
          if (_.isValidHostLabel(_.getAttr(arn, "accountId"), false)) {
            if (_.isValidHostLabel(_.getAttr(arn, "region"), false)) {
              if (_.getAttr(arn, "service") === "kinesis") {
                {
                  const arnType = _.getAttr(arn, "resourceId[0]");
                  if (
                    arnType != null &&
                    arnType !== false &&
                    !(arnType === "")
                  ) {
                    if (arnType === "stream") {
                      if (
                        _.getAttr(PartitionResult, "name") ===
                        `${_.getAttr(arn, "partition")}`
                      ) {
                        if (OperationType != null) {
                          if (UseFIPS === true && UseDualStack === true) {
                            if (
                              _.getAttr(PartitionResult, "supportsFIPS") ===
                              true
                            ) {
                              if (
                                _.getAttr(
                                  PartitionResult,
                                  "supportsDualStack",
                                ) === true
                              ) {
                                return e(
                                  `https://${_.getAttr(arn, "accountId")}.${OperationType}-kinesis-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
                                );
                              }
                              return err(
                                "DualStack is enabled, but this partition does not support DualStack.",
                              );
                            }
                            return err(
                              "FIPS is enabled, but this partition does not support FIPS.",
                            );
                          }
                          if (UseFIPS === true) {
                            if (
                              _.getAttr(PartitionResult, "supportsFIPS") ===
                              true
                            ) {
                              return e(
                                `https://${_.getAttr(arn, "accountId")}.${OperationType}-kinesis-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
                              );
                            }
                            return err(
                              "FIPS is enabled but this partition does not support FIPS",
                            );
                          }
                          if (UseDualStack === true) {
                            if (
                              _.getAttr(
                                PartitionResult,
                                "supportsDualStack",
                              ) === true
                            ) {
                              return e(
                                `https://${_.getAttr(arn, "accountId")}.${OperationType}-kinesis.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
                              );
                            }
                            return err(
                              "DualStack is enabled but this partition does not support DualStack",
                            );
                          }
                          return e(
                            `https://${_.getAttr(arn, "accountId")}.${OperationType}-kinesis.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
                          );
                        }
                        return err(
                          "Operation Type is not set. Please contact service team for resolution.",
                        );
                      }
                      return err(
                        `Partition: ${_.getAttr(arn, "partition")} from ARN doesn't match with partition name: ${_.getAttr(PartitionResult, "name")}.`,
                      );
                    }
                    return err(
                      `Invalid ARN: Kinesis ARNs don't support \`${arnType}\` arn types.`,
                    );
                  }
                }
                return err("Invalid ARN: No ARN type specified");
              }
              return err(
                `Invalid ARN: The ARN was not for the Kinesis service, found: ${_.getAttr(arn, "service")}.`,
              );
            }
            return err("Invalid ARN: Invalid region.");
          }
          return err("Invalid ARN: Invalid account id.");
        }
      }
      return err("Invalid ARN: Failed to parse ARN.");
    }
  }
  {
    const PartitionResult = _.partition(Region);
    if (
      ConsumerARN != null &&
      !(Endpoint != null) &&
      Region != null &&
      PartitionResult != null &&
      PartitionResult !== false &&
      !(_.getAttr(PartitionResult, "name") === "aws-iso") &&
      !(_.getAttr(PartitionResult, "name") === "aws-iso-b")
    ) {
      {
        const arn = _.parseArn(ConsumerARN);
        if (arn != null && arn !== false) {
          if (_.isValidHostLabel(_.getAttr(arn, "accountId"), false)) {
            if (_.isValidHostLabel(_.getAttr(arn, "region"), false)) {
              if (_.getAttr(arn, "service") === "kinesis") {
                {
                  const arnType = _.getAttr(arn, "resourceId[0]");
                  if (
                    arnType != null &&
                    arnType !== false &&
                    !(arnType === "")
                  ) {
                    if (arnType === "stream") {
                      if (
                        _.getAttr(PartitionResult, "name") ===
                        `${_.getAttr(arn, "partition")}`
                      ) {
                        if (OperationType != null) {
                          if (UseFIPS === true && UseDualStack === true) {
                            if (
                              _.getAttr(PartitionResult, "supportsFIPS") ===
                              true
                            ) {
                              if (
                                _.getAttr(
                                  PartitionResult,
                                  "supportsDualStack",
                                ) === true
                              ) {
                                return e(
                                  `https://${_.getAttr(arn, "accountId")}.${OperationType}-kinesis-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
                                );
                              }
                              return err(
                                "DualStack is enabled, but this partition does not support DualStack.",
                              );
                            }
                            return err(
                              "FIPS is enabled, but this partition does not support FIPS.",
                            );
                          }
                          if (UseFIPS === true) {
                            if (
                              _.getAttr(PartitionResult, "supportsFIPS") ===
                              true
                            ) {
                              return e(
                                `https://${_.getAttr(arn, "accountId")}.${OperationType}-kinesis-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
                              );
                            }
                            return err(
                              "FIPS is enabled but this partition does not support FIPS",
                            );
                          }
                          if (UseDualStack === true) {
                            if (
                              _.getAttr(
                                PartitionResult,
                                "supportsDualStack",
                              ) === true
                            ) {
                              return e(
                                `https://${_.getAttr(arn, "accountId")}.${OperationType}-kinesis.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
                              );
                            }
                            return err(
                              "DualStack is enabled but this partition does not support DualStack",
                            );
                          }
                          return e(
                            `https://${_.getAttr(arn, "accountId")}.${OperationType}-kinesis.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
                          );
                        }
                        return err(
                          "Operation Type is not set. Please contact service team for resolution.",
                        );
                      }
                      return err(
                        `Partition: ${_.getAttr(arn, "partition")} from ARN doesn't match with partition name: ${_.getAttr(PartitionResult, "name")}.`,
                      );
                    }
                    return err(
                      `Invalid ARN: Kinesis ARNs don't support \`${arnType}\` arn types.`,
                    );
                  }
                }
                return err("Invalid ARN: No ARN type specified");
              }
              return err(
                `Invalid ARN: The ARN was not for the Kinesis service, found: ${_.getAttr(arn, "service")}.`,
              );
            }
            return err("Invalid ARN: Invalid region.");
          }
          return err("Invalid ARN: Invalid account id.");
        }
      }
      return err("Invalid ARN: Failed to parse ARN.");
    }
  }
  {
    const PartitionResult = _.partition(Region);
    if (
      ResourceARN != null &&
      !(Endpoint != null) &&
      Region != null &&
      PartitionResult != null &&
      PartitionResult !== false &&
      !(_.getAttr(PartitionResult, "name") === "aws-iso") &&
      !(_.getAttr(PartitionResult, "name") === "aws-iso-b")
    ) {
      {
        const arn = _.parseArn(ResourceARN);
        if (arn != null && arn !== false) {
          if (_.isValidHostLabel(_.getAttr(arn, "accountId"), false)) {
            if (_.isValidHostLabel(_.getAttr(arn, "region"), false)) {
              if (_.getAttr(arn, "service") === "kinesis") {
                {
                  const arnType = _.getAttr(arn, "resourceId[0]");
                  if (
                    arnType != null &&
                    arnType !== false &&
                    !(arnType === "")
                  ) {
                    if (arnType === "stream") {
                      if (
                        _.getAttr(PartitionResult, "name") ===
                        `${_.getAttr(arn, "partition")}`
                      ) {
                        if (OperationType != null) {
                          if (UseFIPS === true && UseDualStack === true) {
                            if (
                              _.getAttr(PartitionResult, "supportsFIPS") ===
                              true
                            ) {
                              if (
                                _.getAttr(
                                  PartitionResult,
                                  "supportsDualStack",
                                ) === true
                              ) {
                                return e(
                                  `https://${_.getAttr(arn, "accountId")}.${OperationType}-kinesis-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
                                );
                              }
                              return err(
                                "DualStack is enabled, but this partition does not support DualStack.",
                              );
                            }
                            return err(
                              "FIPS is enabled, but this partition does not support FIPS.",
                            );
                          }
                          if (UseFIPS === true) {
                            if (
                              _.getAttr(PartitionResult, "supportsFIPS") ===
                              true
                            ) {
                              return e(
                                `https://${_.getAttr(arn, "accountId")}.${OperationType}-kinesis-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
                              );
                            }
                            return err(
                              "FIPS is enabled but this partition does not support FIPS",
                            );
                          }
                          if (UseDualStack === true) {
                            if (
                              _.getAttr(
                                PartitionResult,
                                "supportsDualStack",
                              ) === true
                            ) {
                              return e(
                                `https://${_.getAttr(arn, "accountId")}.${OperationType}-kinesis.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
                              );
                            }
                            return err(
                              "DualStack is enabled but this partition does not support DualStack",
                            );
                          }
                          return e(
                            `https://${_.getAttr(arn, "accountId")}.${OperationType}-kinesis.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
                          );
                        }
                        return err(
                          "Operation Type is not set. Please contact service team for resolution.",
                        );
                      }
                      return err(
                        `Partition: ${_.getAttr(arn, "partition")} from ARN doesn't match with partition name: ${_.getAttr(PartitionResult, "name")}.`,
                      );
                    }
                    return err(
                      `Invalid ARN: Kinesis ARNs don't support \`${arnType}\` arn types.`,
                    );
                  }
                }
                return err("Invalid ARN: No ARN type specified");
              }
              return err(
                `Invalid ARN: The ARN was not for the Kinesis service, found: ${_.getAttr(arn, "service")}.`,
              );
            }
            return err("Invalid ARN: Invalid region.");
          }
          return err("Invalid ARN: Invalid account id.");
        }
      }
      return err("Invalid ARN: Failed to parse ARN.");
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
              `https://kinesis-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://kinesis.${Region}.amazonaws.com`);
            }
            return e(
              `https://kinesis-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://kinesis.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://kinesis.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type StreamName = string;
export type StreamARN = string;
export type PositiveIntegerObject = number;
export type NaturalIntegerObject = number;
export type MaxRecordSizeInKiB = number;
export type RetentionPeriodHours = number;
export type ResourceARN = string;
export type ConsumerName = string;
export type ConsumerARN = string;
export type ShardCountObject = number;
export type OnDemandStreamCountObject = number;
export type OnDemandStreamCountLimitObject = number;
export type DescribeStreamInputLimit = number;
export type ShardId = string;
export type ShardIterator = string;
export type GetRecordsInputLimit = number;
export type SequenceNumber = string;
export type NextToken = string;
export type ListShardsInputLimit = number;
export type ListStreamConsumersInputLimit = number;
export type ListStreamsInputLimit = number;
export type TagKey = string;
export type ListTagsForStreamInputLimit = number;
export type Data = Uint8Array;
export type PartitionKey = string;
export type HashKey = string;
export type Policy = string;
export type KeyId = string;
export type TagValue = string;
export type ErrorMessage = string;
export type MillisBehindLatest = number;
export type ConsumerCountObject = number;
export type ErrorCode = string;

//# Schemas
export interface DescribeAccountSettingsInput {}
export const DescribeAccountSettingsInput = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAccountSettingsInput",
}) as any as S.Schema<DescribeAccountSettingsInput>;
export interface DescribeLimitsInput {}
export const DescribeLimitsInput = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeLimitsInput",
}) as any as S.Schema<DescribeLimitsInput>;
export type MetricsName =
  | "IncomingBytes"
  | "IncomingRecords"
  | "OutgoingBytes"
  | "OutgoingRecords"
  | "WriteProvisionedThroughputExceeded"
  | "ReadProvisionedThroughputExceeded"
  | "IteratorAgeMilliseconds"
  | "ALL";
export const MetricsName = S.Literal(
  "IncomingBytes",
  "IncomingRecords",
  "OutgoingBytes",
  "OutgoingRecords",
  "WriteProvisionedThroughputExceeded",
  "ReadProvisionedThroughputExceeded",
  "IteratorAgeMilliseconds",
  "ALL",
);
export type MetricsNameList = MetricsName[];
export const MetricsNameList = S.Array(MetricsName);
export type ShardIteratorType =
  | "AT_SEQUENCE_NUMBER"
  | "AFTER_SEQUENCE_NUMBER"
  | "TRIM_HORIZON"
  | "LATEST"
  | "AT_TIMESTAMP";
export const ShardIteratorType = S.Literal(
  "AT_SEQUENCE_NUMBER",
  "AFTER_SEQUENCE_NUMBER",
  "TRIM_HORIZON",
  "LATEST",
  "AT_TIMESTAMP",
);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type EncryptionType = "NONE" | "KMS";
export const EncryptionType = S.Literal("NONE", "KMS");
export type ScalingType = "UNIFORM_SCALING";
export const ScalingType = S.Literal("UNIFORM_SCALING");
export interface DecreaseStreamRetentionPeriodInput {
  StreamName?: string;
  RetentionPeriodHours: number;
  StreamARN?: string;
}
export const DecreaseStreamRetentionPeriodInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    RetentionPeriodHours: S.Number,
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "DecreaseStreamRetentionPeriodInput",
}) as any as S.Schema<DecreaseStreamRetentionPeriodInput>;
export interface DecreaseStreamRetentionPeriodResponse {}
export const DecreaseStreamRetentionPeriodResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DecreaseStreamRetentionPeriodResponse",
}) as any as S.Schema<DecreaseStreamRetentionPeriodResponse>;
export interface DeleteResourcePolicyInput {
  ResourceARN: string;
}
export const DeleteResourcePolicyInput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String.pipe(T.ContextParam("ResourceARN")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "DeleteResourcePolicyInput",
}) as any as S.Schema<DeleteResourcePolicyInput>;
export interface DeleteResourcePolicyResponse {}
export const DeleteResourcePolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteResourcePolicyResponse",
}) as any as S.Schema<DeleteResourcePolicyResponse>;
export interface DeleteStreamInput {
  StreamName?: string;
  EnforceConsumerDeletion?: boolean;
  StreamARN?: string;
}
export const DeleteStreamInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    EnforceConsumerDeletion: S.optional(S.Boolean),
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "DeleteStreamInput",
}) as any as S.Schema<DeleteStreamInput>;
export interface DeleteStreamResponse {}
export const DeleteStreamResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteStreamResponse",
}) as any as S.Schema<DeleteStreamResponse>;
export interface DeregisterStreamConsumerInput {
  StreamARN?: string;
  ConsumerName?: string;
  ConsumerARN?: string;
}
export const DeregisterStreamConsumerInput = S.suspend(() =>
  S.Struct({
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
    ConsumerName: S.optional(S.String),
    ConsumerARN: S.optional(S.String).pipe(T.ContextParam("ConsumerARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "DeregisterStreamConsumerInput",
}) as any as S.Schema<DeregisterStreamConsumerInput>;
export interface DeregisterStreamConsumerResponse {}
export const DeregisterStreamConsumerResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeregisterStreamConsumerResponse",
}) as any as S.Schema<DeregisterStreamConsumerResponse>;
export interface DescribeLimitsOutput {
  ShardLimit: number;
  OpenShardCount: number;
  OnDemandStreamCount: number;
  OnDemandStreamCountLimit: number;
}
export const DescribeLimitsOutput = S.suspend(() =>
  S.Struct({
    ShardLimit: S.Number,
    OpenShardCount: S.Number,
    OnDemandStreamCount: S.Number,
    OnDemandStreamCountLimit: S.Number,
  }).pipe(ns),
).annotations({
  identifier: "DescribeLimitsOutput",
}) as any as S.Schema<DescribeLimitsOutput>;
export interface DescribeStreamInput {
  StreamName?: string;
  Limit?: number;
  ExclusiveStartShardId?: string;
  StreamARN?: string;
}
export const DescribeStreamInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    Limit: S.optional(S.Number),
    ExclusiveStartShardId: S.optional(S.String),
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "DescribeStreamInput",
}) as any as S.Schema<DescribeStreamInput>;
export interface DescribeStreamConsumerInput {
  StreamARN?: string;
  ConsumerName?: string;
  ConsumerARN?: string;
}
export const DescribeStreamConsumerInput = S.suspend(() =>
  S.Struct({
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
    ConsumerName: S.optional(S.String),
    ConsumerARN: S.optional(S.String).pipe(T.ContextParam("ConsumerARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "DescribeStreamConsumerInput",
}) as any as S.Schema<DescribeStreamConsumerInput>;
export interface DescribeStreamSummaryInput {
  StreamName?: string;
  StreamARN?: string;
}
export const DescribeStreamSummaryInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "DescribeStreamSummaryInput",
}) as any as S.Schema<DescribeStreamSummaryInput>;
export interface DisableEnhancedMonitoringInput {
  StreamName?: string;
  ShardLevelMetrics: MetricsName[];
  StreamARN?: string;
}
export const DisableEnhancedMonitoringInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    ShardLevelMetrics: MetricsNameList,
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "DisableEnhancedMonitoringInput",
}) as any as S.Schema<DisableEnhancedMonitoringInput>;
export interface EnableEnhancedMonitoringInput {
  StreamName?: string;
  ShardLevelMetrics: MetricsName[];
  StreamARN?: string;
}
export const EnableEnhancedMonitoringInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    ShardLevelMetrics: MetricsNameList,
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "EnableEnhancedMonitoringInput",
}) as any as S.Schema<EnableEnhancedMonitoringInput>;
export interface GetRecordsInput {
  ShardIterator: string;
  Limit?: number;
  StreamARN?: string;
}
export const GetRecordsInput = S.suspend(() =>
  S.Struct({
    ShardIterator: S.String,
    Limit: S.optional(S.Number),
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "data" } }),
    ),
  ),
).annotations({
  identifier: "GetRecordsInput",
}) as any as S.Schema<GetRecordsInput>;
export interface GetResourcePolicyInput {
  ResourceARN: string;
}
export const GetResourcePolicyInput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String.pipe(T.ContextParam("ResourceARN")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "GetResourcePolicyInput",
}) as any as S.Schema<GetResourcePolicyInput>;
export interface GetShardIteratorInput {
  StreamName?: string;
  ShardId: string;
  ShardIteratorType: ShardIteratorType;
  StartingSequenceNumber?: string;
  Timestamp?: Date;
  StreamARN?: string;
}
export const GetShardIteratorInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    ShardId: S.String,
    ShardIteratorType: ShardIteratorType,
    StartingSequenceNumber: S.optional(S.String),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "data" } }),
    ),
  ),
).annotations({
  identifier: "GetShardIteratorInput",
}) as any as S.Schema<GetShardIteratorInput>;
export interface IncreaseStreamRetentionPeriodInput {
  StreamName?: string;
  RetentionPeriodHours: number;
  StreamARN?: string;
}
export const IncreaseStreamRetentionPeriodInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    RetentionPeriodHours: S.Number,
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "IncreaseStreamRetentionPeriodInput",
}) as any as S.Schema<IncreaseStreamRetentionPeriodInput>;
export interface IncreaseStreamRetentionPeriodResponse {}
export const IncreaseStreamRetentionPeriodResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "IncreaseStreamRetentionPeriodResponse",
}) as any as S.Schema<IncreaseStreamRetentionPeriodResponse>;
export interface ListStreamConsumersInput {
  StreamARN: string;
  NextToken?: string;
  MaxResults?: number;
  StreamCreationTimestamp?: Date;
}
export const ListStreamConsumersInput = S.suspend(() =>
  S.Struct({
    StreamARN: S.String.pipe(T.ContextParam("StreamARN")),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    StreamCreationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "ListStreamConsumersInput",
}) as any as S.Schema<ListStreamConsumersInput>;
export interface ListStreamsInput {
  Limit?: number;
  ExclusiveStartStreamName?: string;
  NextToken?: string;
}
export const ListStreamsInput = S.suspend(() =>
  S.Struct({
    Limit: S.optional(S.Number),
    ExclusiveStartStreamName: S.optional(S.String),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListStreamsInput",
}) as any as S.Schema<ListStreamsInput>;
export interface ListTagsForResourceInput {
  ResourceARN: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String.pipe(T.ContextParam("ResourceARN")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export interface ListTagsForStreamInput {
  StreamName?: string;
  ExclusiveStartTagKey?: string;
  Limit?: number;
  StreamARN?: string;
}
export const ListTagsForStreamInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    ExclusiveStartTagKey: S.optional(S.String),
    Limit: S.optional(S.Number),
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "ListTagsForStreamInput",
}) as any as S.Schema<ListTagsForStreamInput>;
export interface MergeShardsInput {
  StreamName?: string;
  ShardToMerge: string;
  AdjacentShardToMerge: string;
  StreamARN?: string;
}
export const MergeShardsInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    ShardToMerge: S.String,
    AdjacentShardToMerge: S.String,
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "MergeShardsInput",
}) as any as S.Schema<MergeShardsInput>;
export interface MergeShardsResponse {}
export const MergeShardsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "MergeShardsResponse",
}) as any as S.Schema<MergeShardsResponse>;
export interface PutRecordInput {
  StreamName?: string;
  Data: Uint8Array;
  PartitionKey: string;
  ExplicitHashKey?: string;
  SequenceNumberForOrdering?: string;
  StreamARN?: string;
}
export const PutRecordInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    Data: T.Blob,
    PartitionKey: S.String,
    ExplicitHashKey: S.optional(S.String),
    SequenceNumberForOrdering: S.optional(S.String),
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "data" } }),
    ),
  ),
).annotations({
  identifier: "PutRecordInput",
}) as any as S.Schema<PutRecordInput>;
export interface PutResourcePolicyInput {
  ResourceARN: string;
  Policy: string;
}
export const PutResourcePolicyInput = S.suspend(() =>
  S.Struct({
    ResourceARN: S.String.pipe(T.ContextParam("ResourceARN")),
    Policy: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "PutResourcePolicyInput",
}) as any as S.Schema<PutResourcePolicyInput>;
export interface PutResourcePolicyResponse {}
export const PutResourcePolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutResourcePolicyResponse",
}) as any as S.Schema<PutResourcePolicyResponse>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface RegisterStreamConsumerInput {
  StreamARN: string;
  ConsumerName: string;
  Tags?: { [key: string]: string };
}
export const RegisterStreamConsumerInput = S.suspend(() =>
  S.Struct({
    StreamARN: S.String.pipe(T.ContextParam("StreamARN")),
    ConsumerName: S.String,
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "RegisterStreamConsumerInput",
}) as any as S.Schema<RegisterStreamConsumerInput>;
export interface RemoveTagsFromStreamInput {
  StreamName?: string;
  TagKeys: string[];
  StreamARN?: string;
}
export const RemoveTagsFromStreamInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    TagKeys: TagKeyList,
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "RemoveTagsFromStreamInput",
}) as any as S.Schema<RemoveTagsFromStreamInput>;
export interface RemoveTagsFromStreamResponse {}
export const RemoveTagsFromStreamResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveTagsFromStreamResponse",
}) as any as S.Schema<RemoveTagsFromStreamResponse>;
export interface SplitShardInput {
  StreamName?: string;
  ShardToSplit: string;
  NewStartingHashKey: string;
  StreamARN?: string;
}
export const SplitShardInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    ShardToSplit: S.String,
    NewStartingHashKey: S.String,
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "SplitShardInput",
}) as any as S.Schema<SplitShardInput>;
export interface SplitShardResponse {}
export const SplitShardResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SplitShardResponse",
}) as any as S.Schema<SplitShardResponse>;
export interface StartStreamEncryptionInput {
  StreamName?: string;
  EncryptionType: EncryptionType;
  KeyId: string;
  StreamARN?: string;
}
export const StartStreamEncryptionInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    EncryptionType: EncryptionType,
    KeyId: S.String,
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "StartStreamEncryptionInput",
}) as any as S.Schema<StartStreamEncryptionInput>;
export interface StartStreamEncryptionResponse {}
export const StartStreamEncryptionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "StartStreamEncryptionResponse",
}) as any as S.Schema<StartStreamEncryptionResponse>;
export interface StopStreamEncryptionInput {
  StreamName?: string;
  EncryptionType: EncryptionType;
  KeyId: string;
  StreamARN?: string;
}
export const StopStreamEncryptionInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    EncryptionType: EncryptionType,
    KeyId: S.String,
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "StopStreamEncryptionInput",
}) as any as S.Schema<StopStreamEncryptionInput>;
export interface StopStreamEncryptionResponse {}
export const StopStreamEncryptionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "StopStreamEncryptionResponse",
}) as any as S.Schema<StopStreamEncryptionResponse>;
export interface TagResourceInput {
  Tags: { [key: string]: string };
  ResourceARN: string;
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({
    Tags: TagMap,
    ResourceARN: S.String.pipe(T.ContextParam("ResourceARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceInput {
  TagKeys: string[];
  ResourceARN: string;
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({
    TagKeys: TagKeyList,
    ResourceARN: S.String.pipe(T.ContextParam("ResourceARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateMaxRecordSizeInput {
  StreamARN?: string;
  MaxRecordSizeInKiB: number;
}
export const UpdateMaxRecordSizeInput = S.suspend(() =>
  S.Struct({
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
    MaxRecordSizeInKiB: S.Number,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "UpdateMaxRecordSizeInput",
}) as any as S.Schema<UpdateMaxRecordSizeInput>;
export interface UpdateMaxRecordSizeResponse {}
export const UpdateMaxRecordSizeResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateMaxRecordSizeResponse",
}) as any as S.Schema<UpdateMaxRecordSizeResponse>;
export interface UpdateShardCountInput {
  StreamName?: string;
  TargetShardCount: number;
  ScalingType: ScalingType;
  StreamARN?: string;
}
export const UpdateShardCountInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    TargetShardCount: S.Number,
    ScalingType: ScalingType,
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "UpdateShardCountInput",
}) as any as S.Schema<UpdateShardCountInput>;
export type StreamMode = "PROVISIONED" | "ON_DEMAND";
export const StreamMode = S.Literal("PROVISIONED", "ON_DEMAND");
export interface StreamModeDetails {
  StreamMode: StreamMode;
}
export const StreamModeDetails = S.suspend(() =>
  S.Struct({ StreamMode: StreamMode }),
).annotations({
  identifier: "StreamModeDetails",
}) as any as S.Schema<StreamModeDetails>;
export interface UpdateStreamModeInput {
  StreamARN: string;
  StreamModeDetails: StreamModeDetails;
  WarmThroughputMiBps?: number;
}
export const UpdateStreamModeInput = S.suspend(() =>
  S.Struct({
    StreamARN: S.String.pipe(T.ContextParam("StreamARN")),
    StreamModeDetails: StreamModeDetails,
    WarmThroughputMiBps: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "UpdateStreamModeInput",
}) as any as S.Schema<UpdateStreamModeInput>;
export interface UpdateStreamModeResponse {}
export const UpdateStreamModeResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateStreamModeResponse",
}) as any as S.Schema<UpdateStreamModeResponse>;
export interface UpdateStreamWarmThroughputInput {
  StreamARN?: string;
  StreamName?: string;
  WarmThroughputMiBps: number;
}
export const UpdateStreamWarmThroughputInput = S.suspend(() =>
  S.Struct({
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
    StreamName: S.optional(S.String),
    WarmThroughputMiBps: S.Number,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "UpdateStreamWarmThroughputInput",
}) as any as S.Schema<UpdateStreamWarmThroughputInput>;
export type MinimumThroughputBillingCommitmentOutputStatus =
  | "ENABLED"
  | "DISABLED"
  | "ENABLED_UNTIL_EARLIEST_ALLOWED_END";
export const MinimumThroughputBillingCommitmentOutputStatus = S.Literal(
  "ENABLED",
  "DISABLED",
  "ENABLED_UNTIL_EARLIEST_ALLOWED_END",
);
export type ShardFilterType =
  | "AFTER_SHARD_ID"
  | "AT_TRIM_HORIZON"
  | "FROM_TRIM_HORIZON"
  | "AT_LATEST"
  | "AT_TIMESTAMP"
  | "FROM_TIMESTAMP";
export const ShardFilterType = S.Literal(
  "AFTER_SHARD_ID",
  "AT_TRIM_HORIZON",
  "FROM_TRIM_HORIZON",
  "AT_LATEST",
  "AT_TIMESTAMP",
  "FROM_TIMESTAMP",
);
export type MinimumThroughputBillingCommitmentInputStatus =
  | "ENABLED"
  | "DISABLED";
export const MinimumThroughputBillingCommitmentInputStatus = S.Literal(
  "ENABLED",
  "DISABLED",
);
export interface MinimumThroughputBillingCommitmentOutput {
  Status: MinimumThroughputBillingCommitmentOutputStatus;
  StartedAt?: Date;
  EndedAt?: Date;
  EarliestAllowedEndAt?: Date;
}
export const MinimumThroughputBillingCommitmentOutput = S.suspend(() =>
  S.Struct({
    Status: MinimumThroughputBillingCommitmentOutputStatus,
    StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EarliestAllowedEndAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "MinimumThroughputBillingCommitmentOutput",
}) as any as S.Schema<MinimumThroughputBillingCommitmentOutput>;
export interface ShardFilter {
  Type: ShardFilterType;
  ShardId?: string;
  Timestamp?: Date;
}
export const ShardFilter = S.suspend(() =>
  S.Struct({
    Type: ShardFilterType,
    ShardId: S.optional(S.String),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "ShardFilter" }) as any as S.Schema<ShardFilter>;
export type StreamNameList = string[];
export const StreamNameList = S.Array(S.String);
export interface PutRecordsRequestEntry {
  Data: Uint8Array;
  ExplicitHashKey?: string;
  PartitionKey: string;
}
export const PutRecordsRequestEntry = S.suspend(() =>
  S.Struct({
    Data: T.Blob,
    ExplicitHashKey: S.optional(S.String),
    PartitionKey: S.String,
  }),
).annotations({
  identifier: "PutRecordsRequestEntry",
}) as any as S.Schema<PutRecordsRequestEntry>;
export type PutRecordsRequestEntryList = PutRecordsRequestEntry[];
export const PutRecordsRequestEntryList = S.Array(PutRecordsRequestEntry);
export interface StartingPosition {
  Type: ShardIteratorType;
  SequenceNumber?: string;
  Timestamp?: Date;
}
export const StartingPosition = S.suspend(() =>
  S.Struct({
    Type: ShardIteratorType,
    SequenceNumber: S.optional(S.String),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "StartingPosition",
}) as any as S.Schema<StartingPosition>;
export interface MinimumThroughputBillingCommitmentInput {
  Status: MinimumThroughputBillingCommitmentInputStatus;
}
export const MinimumThroughputBillingCommitmentInput = S.suspend(() =>
  S.Struct({ Status: MinimumThroughputBillingCommitmentInputStatus }),
).annotations({
  identifier: "MinimumThroughputBillingCommitmentInput",
}) as any as S.Schema<MinimumThroughputBillingCommitmentInput>;
export interface AddTagsToStreamInput {
  StreamName?: string;
  Tags: { [key: string]: string };
  StreamARN?: string;
}
export const AddTagsToStreamInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    Tags: TagMap,
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "AddTagsToStreamInput",
}) as any as S.Schema<AddTagsToStreamInput>;
export interface AddTagsToStreamResponse {}
export const AddTagsToStreamResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AddTagsToStreamResponse",
}) as any as S.Schema<AddTagsToStreamResponse>;
export interface CreateStreamInput {
  StreamName: string;
  ShardCount?: number;
  StreamModeDetails?: StreamModeDetails;
  Tags?: { [key: string]: string };
  WarmThroughputMiBps?: number;
  MaxRecordSizeInKiB?: number;
}
export const CreateStreamInput = S.suspend(() =>
  S.Struct({
    StreamName: S.String,
    ShardCount: S.optional(S.Number),
    StreamModeDetails: S.optional(StreamModeDetails),
    Tags: S.optional(TagMap),
    WarmThroughputMiBps: S.optional(S.Number),
    MaxRecordSizeInKiB: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateStreamInput",
}) as any as S.Schema<CreateStreamInput>;
export interface CreateStreamResponse {}
export const CreateStreamResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateStreamResponse",
}) as any as S.Schema<CreateStreamResponse>;
export interface DescribeAccountSettingsOutput {
  MinimumThroughputBillingCommitment?: MinimumThroughputBillingCommitmentOutput;
}
export const DescribeAccountSettingsOutput = S.suspend(() =>
  S.Struct({
    MinimumThroughputBillingCommitment: S.optional(
      MinimumThroughputBillingCommitmentOutput,
    ),
  }).pipe(ns),
).annotations({
  identifier: "DescribeAccountSettingsOutput",
}) as any as S.Schema<DescribeAccountSettingsOutput>;
export interface EnhancedMonitoringOutput {
  StreamName?: string;
  CurrentShardLevelMetrics?: MetricsName[];
  DesiredShardLevelMetrics?: MetricsName[];
  StreamARN?: string;
}
export const EnhancedMonitoringOutput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    CurrentShardLevelMetrics: S.optional(MetricsNameList),
    DesiredShardLevelMetrics: S.optional(MetricsNameList),
    StreamARN: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "EnhancedMonitoringOutput",
}) as any as S.Schema<EnhancedMonitoringOutput>;
export interface GetResourcePolicyOutput {
  Policy: string;
}
export const GetResourcePolicyOutput = S.suspend(() =>
  S.Struct({ Policy: S.String }).pipe(ns),
).annotations({
  identifier: "GetResourcePolicyOutput",
}) as any as S.Schema<GetResourcePolicyOutput>;
export interface GetShardIteratorOutput {
  ShardIterator?: string;
}
export const GetShardIteratorOutput = S.suspend(() =>
  S.Struct({ ShardIterator: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "GetShardIteratorOutput",
}) as any as S.Schema<GetShardIteratorOutput>;
export interface ListShardsInput {
  StreamName?: string;
  NextToken?: string;
  ExclusiveStartShardId?: string;
  MaxResults?: number;
  StreamCreationTimestamp?: Date;
  ShardFilter?: ShardFilter;
  StreamARN?: string;
}
export const ListShardsInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    NextToken: S.optional(S.String),
    ExclusiveStartShardId: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    StreamCreationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ShardFilter: S.optional(ShardFilter),
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "control" } }),
    ),
  ),
).annotations({
  identifier: "ListShardsInput",
}) as any as S.Schema<ListShardsInput>;
export interface Tag {
  Key: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface ListTagsForStreamOutput {
  Tags: Tag[];
  HasMoreTags: boolean;
}
export const ListTagsForStreamOutput = S.suspend(() =>
  S.Struct({ Tags: TagList, HasMoreTags: S.Boolean }).pipe(ns),
).annotations({
  identifier: "ListTagsForStreamOutput",
}) as any as S.Schema<ListTagsForStreamOutput>;
export interface PutRecordOutput {
  ShardId: string;
  SequenceNumber: string;
  EncryptionType?: EncryptionType;
}
export const PutRecordOutput = S.suspend(() =>
  S.Struct({
    ShardId: S.String,
    SequenceNumber: S.String,
    EncryptionType: S.optional(EncryptionType),
  }).pipe(ns),
).annotations({
  identifier: "PutRecordOutput",
}) as any as S.Schema<PutRecordOutput>;
export interface PutRecordsInput {
  Records: PutRecordsRequestEntry[];
  StreamName?: string;
  StreamARN?: string;
}
export const PutRecordsInput = S.suspend(() =>
  S.Struct({
    Records: PutRecordsRequestEntryList,
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "data" } }),
    ),
  ),
).annotations({
  identifier: "PutRecordsInput",
}) as any as S.Schema<PutRecordsInput>;
export type ConsumerStatus = "CREATING" | "DELETING" | "ACTIVE";
export const ConsumerStatus = S.Literal("CREATING", "DELETING", "ACTIVE");
export interface Consumer {
  ConsumerName: string;
  ConsumerARN: string;
  ConsumerStatus: ConsumerStatus;
  ConsumerCreationTimestamp: Date;
}
export const Consumer = S.suspend(() =>
  S.Struct({
    ConsumerName: S.String,
    ConsumerARN: S.String,
    ConsumerStatus: ConsumerStatus,
    ConsumerCreationTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({ identifier: "Consumer" }) as any as S.Schema<Consumer>;
export interface RegisterStreamConsumerOutput {
  Consumer: Consumer;
}
export const RegisterStreamConsumerOutput = S.suspend(() =>
  S.Struct({ Consumer: Consumer }).pipe(ns),
).annotations({
  identifier: "RegisterStreamConsumerOutput",
}) as any as S.Schema<RegisterStreamConsumerOutput>;
export interface SubscribeToShardInput {
  ConsumerARN: string;
  ShardId: string;
  StartingPosition: StartingPosition;
}
export const SubscribeToShardInput = S.suspend(() =>
  S.Struct({
    ConsumerARN: S.String.pipe(T.ContextParam("ConsumerARN")),
    ShardId: S.String,
    StartingPosition: StartingPosition,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ OperationType: { value: "data" } }),
    ),
  ),
).annotations({
  identifier: "SubscribeToShardInput",
}) as any as S.Schema<SubscribeToShardInput>;
export interface UpdateAccountSettingsInput {
  MinimumThroughputBillingCommitment: MinimumThroughputBillingCommitmentInput;
}
export const UpdateAccountSettingsInput = S.suspend(() =>
  S.Struct({
    MinimumThroughputBillingCommitment: MinimumThroughputBillingCommitmentInput,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAccountSettingsInput",
}) as any as S.Schema<UpdateAccountSettingsInput>;
export interface UpdateShardCountOutput {
  StreamName?: string;
  CurrentShardCount?: number;
  TargetShardCount?: number;
  StreamARN?: string;
}
export const UpdateShardCountOutput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    CurrentShardCount: S.optional(S.Number),
    TargetShardCount: S.optional(S.Number),
    StreamARN: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "UpdateShardCountOutput",
}) as any as S.Schema<UpdateShardCountOutput>;
export type StreamStatus = "CREATING" | "DELETING" | "ACTIVE" | "UPDATING";
export const StreamStatus = S.Literal(
  "CREATING",
  "DELETING",
  "ACTIVE",
  "UPDATING",
);
export type ShardIdList = string[];
export const ShardIdList = S.Array(S.String);
export interface ConsumerDescription {
  ConsumerName: string;
  ConsumerARN: string;
  ConsumerStatus: ConsumerStatus;
  ConsumerCreationTimestamp: Date;
  StreamARN: string;
}
export const ConsumerDescription = S.suspend(() =>
  S.Struct({
    ConsumerName: S.String,
    ConsumerARN: S.String,
    ConsumerStatus: ConsumerStatus,
    ConsumerCreationTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    StreamARN: S.String,
  }),
).annotations({
  identifier: "ConsumerDescription",
}) as any as S.Schema<ConsumerDescription>;
export interface EnhancedMetrics {
  ShardLevelMetrics?: MetricsName[];
}
export const EnhancedMetrics = S.suspend(() =>
  S.Struct({ ShardLevelMetrics: S.optional(MetricsNameList) }),
).annotations({
  identifier: "EnhancedMetrics",
}) as any as S.Schema<EnhancedMetrics>;
export type EnhancedMonitoringList = EnhancedMetrics[];
export const EnhancedMonitoringList = S.Array(EnhancedMetrics);
export interface WarmThroughputObject {
  TargetMiBps?: number;
  CurrentMiBps?: number;
}
export const WarmThroughputObject = S.suspend(() =>
  S.Struct({
    TargetMiBps: S.optional(S.Number),
    CurrentMiBps: S.optional(S.Number),
  }),
).annotations({
  identifier: "WarmThroughputObject",
}) as any as S.Schema<WarmThroughputObject>;
export interface StreamDescriptionSummary {
  StreamName: string;
  StreamARN: string;
  StreamStatus: StreamStatus;
  StreamModeDetails?: StreamModeDetails;
  RetentionPeriodHours: number;
  StreamCreationTimestamp: Date;
  EnhancedMonitoring: EnhancedMetrics[];
  EncryptionType?: EncryptionType;
  KeyId?: string;
  OpenShardCount: number;
  ConsumerCount?: number;
  WarmThroughput?: WarmThroughputObject;
  MaxRecordSizeInKiB?: number;
}
export const StreamDescriptionSummary = S.suspend(() =>
  S.Struct({
    StreamName: S.String,
    StreamARN: S.String,
    StreamStatus: StreamStatus,
    StreamModeDetails: S.optional(StreamModeDetails),
    RetentionPeriodHours: S.Number,
    StreamCreationTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EnhancedMonitoring: EnhancedMonitoringList,
    EncryptionType: S.optional(EncryptionType),
    KeyId: S.optional(S.String),
    OpenShardCount: S.Number,
    ConsumerCount: S.optional(S.Number),
    WarmThroughput: S.optional(WarmThroughputObject),
    MaxRecordSizeInKiB: S.optional(S.Number),
  }),
).annotations({
  identifier: "StreamDescriptionSummary",
}) as any as S.Schema<StreamDescriptionSummary>;
export interface Record {
  SequenceNumber: string;
  ApproximateArrivalTimestamp?: Date;
  Data: Uint8Array;
  PartitionKey: string;
  EncryptionType?: EncryptionType;
}
export const Record = S.suspend(() =>
  S.Struct({
    SequenceNumber: S.String,
    ApproximateArrivalTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Data: T.Blob,
    PartitionKey: S.String,
    EncryptionType: S.optional(EncryptionType),
  }),
).annotations({ identifier: "Record" }) as any as S.Schema<Record>;
export type RecordList = Record[];
export const RecordList = S.Array(Record);
export type ConsumerList = Consumer[];
export const ConsumerList = S.Array(Consumer);
export interface StreamSummary {
  StreamName: string;
  StreamARN: string;
  StreamStatus: StreamStatus;
  StreamModeDetails?: StreamModeDetails;
  StreamCreationTimestamp?: Date;
}
export const StreamSummary = S.suspend(() =>
  S.Struct({
    StreamName: S.String,
    StreamARN: S.String,
    StreamStatus: StreamStatus,
    StreamModeDetails: S.optional(StreamModeDetails),
    StreamCreationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "StreamSummary",
}) as any as S.Schema<StreamSummary>;
export type StreamSummaryList = StreamSummary[];
export const StreamSummaryList = S.Array(StreamSummary);
export interface DescribeStreamConsumerOutput {
  ConsumerDescription: ConsumerDescription;
}
export const DescribeStreamConsumerOutput = S.suspend(() =>
  S.Struct({ ConsumerDescription: ConsumerDescription }).pipe(ns),
).annotations({
  identifier: "DescribeStreamConsumerOutput",
}) as any as S.Schema<DescribeStreamConsumerOutput>;
export interface DescribeStreamSummaryOutput {
  StreamDescriptionSummary: StreamDescriptionSummary;
}
export const DescribeStreamSummaryOutput = S.suspend(() =>
  S.Struct({ StreamDescriptionSummary: StreamDescriptionSummary }).pipe(ns),
).annotations({
  identifier: "DescribeStreamSummaryOutput",
}) as any as S.Schema<DescribeStreamSummaryOutput>;
export interface HashKeyRange {
  StartingHashKey: string;
  EndingHashKey: string;
}
export const HashKeyRange = S.suspend(() =>
  S.Struct({ StartingHashKey: S.String, EndingHashKey: S.String }),
).annotations({ identifier: "HashKeyRange" }) as any as S.Schema<HashKeyRange>;
export interface SequenceNumberRange {
  StartingSequenceNumber: string;
  EndingSequenceNumber?: string;
}
export const SequenceNumberRange = S.suspend(() =>
  S.Struct({
    StartingSequenceNumber: S.String,
    EndingSequenceNumber: S.optional(S.String),
  }),
).annotations({
  identifier: "SequenceNumberRange",
}) as any as S.Schema<SequenceNumberRange>;
export interface Shard {
  ShardId: string;
  ParentShardId?: string;
  AdjacentParentShardId?: string;
  HashKeyRange: HashKeyRange;
  SequenceNumberRange: SequenceNumberRange;
}
export const Shard = S.suspend(() =>
  S.Struct({
    ShardId: S.String,
    ParentShardId: S.optional(S.String),
    AdjacentParentShardId: S.optional(S.String),
    HashKeyRange: HashKeyRange,
    SequenceNumberRange: SequenceNumberRange,
  }),
).annotations({ identifier: "Shard" }) as any as S.Schema<Shard>;
export type ShardList = Shard[];
export const ShardList = S.Array(Shard);
export interface ListShardsOutput {
  Shards?: Shard[];
  NextToken?: string;
}
export const ListShardsOutput = S.suspend(() =>
  S.Struct({
    Shards: S.optional(ShardList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListShardsOutput",
}) as any as S.Schema<ListShardsOutput>;
export interface ListStreamConsumersOutput {
  Consumers?: Consumer[];
  NextToken?: string;
}
export const ListStreamConsumersOutput = S.suspend(() =>
  S.Struct({
    Consumers: S.optional(ConsumerList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListStreamConsumersOutput",
}) as any as S.Schema<ListStreamConsumersOutput>;
export interface ListStreamsOutput {
  StreamNames: string[];
  HasMoreStreams: boolean;
  NextToken?: string;
  StreamSummaries?: StreamSummary[];
}
export const ListStreamsOutput = S.suspend(() =>
  S.Struct({
    StreamNames: StreamNameList,
    HasMoreStreams: S.Boolean,
    NextToken: S.optional(S.String),
    StreamSummaries: S.optional(StreamSummaryList),
  }).pipe(ns),
).annotations({
  identifier: "ListStreamsOutput",
}) as any as S.Schema<ListStreamsOutput>;
export interface ListTagsForResourceOutput {
  Tags?: Tag[];
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface UpdateAccountSettingsOutput {
  MinimumThroughputBillingCommitment?: MinimumThroughputBillingCommitmentOutput;
}
export const UpdateAccountSettingsOutput = S.suspend(() =>
  S.Struct({
    MinimumThroughputBillingCommitment: S.optional(
      MinimumThroughputBillingCommitmentOutput,
    ),
  }).pipe(ns),
).annotations({
  identifier: "UpdateAccountSettingsOutput",
}) as any as S.Schema<UpdateAccountSettingsOutput>;
export interface UpdateStreamWarmThroughputOutput {
  StreamARN?: string;
  StreamName?: string;
  WarmThroughput?: WarmThroughputObject;
}
export const UpdateStreamWarmThroughputOutput = S.suspend(() =>
  S.Struct({
    StreamARN: S.optional(S.String),
    StreamName: S.optional(S.String),
    WarmThroughput: S.optional(WarmThroughputObject),
  }).pipe(ns),
).annotations({
  identifier: "UpdateStreamWarmThroughputOutput",
}) as any as S.Schema<UpdateStreamWarmThroughputOutput>;
export interface ChildShard {
  ShardId: string;
  ParentShards: string[];
  HashKeyRange: HashKeyRange;
}
export const ChildShard = S.suspend(() =>
  S.Struct({
    ShardId: S.String,
    ParentShards: ShardIdList,
    HashKeyRange: HashKeyRange,
  }),
).annotations({ identifier: "ChildShard" }) as any as S.Schema<ChildShard>;
export type ChildShardList = ChildShard[];
export const ChildShardList = S.Array(ChildShard);
export interface PutRecordsResultEntry {
  SequenceNumber?: string;
  ShardId?: string;
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const PutRecordsResultEntry = S.suspend(() =>
  S.Struct({
    SequenceNumber: S.optional(S.String),
    ShardId: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "PutRecordsResultEntry",
}) as any as S.Schema<PutRecordsResultEntry>;
export type PutRecordsResultEntryList = PutRecordsResultEntry[];
export const PutRecordsResultEntryList = S.Array(PutRecordsResultEntry);
export interface GetRecordsOutput {
  Records: Record[];
  NextShardIterator?: string;
  MillisBehindLatest?: number;
  ChildShards?: ChildShard[];
}
export const GetRecordsOutput = S.suspend(() =>
  S.Struct({
    Records: RecordList,
    NextShardIterator: S.optional(S.String),
    MillisBehindLatest: S.optional(S.Number),
    ChildShards: S.optional(ChildShardList),
  }).pipe(ns),
).annotations({
  identifier: "GetRecordsOutput",
}) as any as S.Schema<GetRecordsOutput>;
export interface PutRecordsOutput {
  FailedRecordCount?: number;
  Records: PutRecordsResultEntry[];
  EncryptionType?: EncryptionType;
}
export const PutRecordsOutput = S.suspend(() =>
  S.Struct({
    FailedRecordCount: S.optional(S.Number),
    Records: PutRecordsResultEntryList,
    EncryptionType: S.optional(EncryptionType),
  }).pipe(ns),
).annotations({
  identifier: "PutRecordsOutput",
}) as any as S.Schema<PutRecordsOutput>;
export interface SubscribeToShardEvent {
  Records: Record[];
  ContinuationSequenceNumber: string;
  MillisBehindLatest: number;
  ChildShards?: ChildShard[];
}
export const SubscribeToShardEvent = S.suspend(() =>
  S.Struct({
    Records: RecordList,
    ContinuationSequenceNumber: S.String,
    MillisBehindLatest: S.Number,
    ChildShards: S.optional(ChildShardList),
  }),
).annotations({
  identifier: "SubscribeToShardEvent",
}) as any as S.Schema<SubscribeToShardEvent>;
export interface StreamDescription {
  StreamName: string;
  StreamARN: string;
  StreamStatus: StreamStatus;
  StreamModeDetails?: StreamModeDetails;
  Shards: Shard[];
  HasMoreShards: boolean;
  RetentionPeriodHours: number;
  StreamCreationTimestamp: Date;
  EnhancedMonitoring: EnhancedMetrics[];
  EncryptionType?: EncryptionType;
  KeyId?: string;
}
export const StreamDescription = S.suspend(() =>
  S.Struct({
    StreamName: S.String,
    StreamARN: S.String,
    StreamStatus: StreamStatus,
    StreamModeDetails: S.optional(StreamModeDetails),
    Shards: ShardList,
    HasMoreShards: S.Boolean,
    RetentionPeriodHours: S.Number,
    StreamCreationTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EnhancedMonitoring: EnhancedMonitoringList,
    EncryptionType: S.optional(EncryptionType),
    KeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "StreamDescription",
}) as any as S.Schema<StreamDescription>;
export type SubscribeToShardEventStream =
  | { SubscribeToShardEvent: SubscribeToShardEvent }
  | { ResourceNotFoundException: ResourceNotFoundException }
  | { ResourceInUseException: ResourceInUseException }
  | { KMSDisabledException: KMSDisabledException }
  | { KMSInvalidStateException: KMSInvalidStateException }
  | { KMSAccessDeniedException: KMSAccessDeniedException }
  | { KMSNotFoundException: KMSNotFoundException }
  | { KMSOptInRequired: KMSOptInRequired }
  | { KMSThrottlingException: KMSThrottlingException }
  | { InternalFailureException: InternalFailureException };
export const SubscribeToShardEventStream = T.EventStream(
  S.Union(
    S.Struct({ SubscribeToShardEvent: SubscribeToShardEvent }),
    S.Struct({
      ResourceNotFoundException: S.suspend(
        () => ResourceNotFoundException,
      ).annotations({ identifier: "ResourceNotFoundException" }),
    }),
    S.Struct({
      ResourceInUseException: S.suspend(
        () => ResourceInUseException,
      ).annotations({ identifier: "ResourceInUseException" }),
    }),
    S.Struct({
      KMSDisabledException: S.suspend(() => KMSDisabledException).annotations({
        identifier: "KMSDisabledException",
      }),
    }),
    S.Struct({
      KMSInvalidStateException: S.suspend(
        () => KMSInvalidStateException,
      ).annotations({ identifier: "KMSInvalidStateException" }),
    }),
    S.Struct({
      KMSAccessDeniedException: S.suspend(
        () => KMSAccessDeniedException,
      ).annotations({ identifier: "KMSAccessDeniedException" }),
    }),
    S.Struct({
      KMSNotFoundException: S.suspend(() => KMSNotFoundException).annotations({
        identifier: "KMSNotFoundException",
      }),
    }),
    S.Struct({
      KMSOptInRequired: S.suspend(() => KMSOptInRequired).annotations({
        identifier: "KMSOptInRequired",
      }),
    }),
    S.Struct({
      KMSThrottlingException: S.suspend(
        () => KMSThrottlingException,
      ).annotations({ identifier: "KMSThrottlingException" }),
    }),
    S.Struct({
      InternalFailureException: S.suspend(
        () => InternalFailureException,
      ).annotations({ identifier: "InternalFailureException" }),
    }),
  ),
) as any as S.Schema<stream.Stream<SubscribeToShardEventStream, Error, never>>;
export interface DescribeStreamOutput {
  StreamDescription: StreamDescription;
}
export const DescribeStreamOutput = S.suspend(() =>
  S.Struct({ StreamDescription: StreamDescription }).pipe(ns),
).annotations({
  identifier: "DescribeStreamOutput",
}) as any as S.Schema<DescribeStreamOutput>;
export interface SubscribeToShardOutput {
  EventStream: stream.Stream<SubscribeToShardEventStream, Error, never>;
}
export const SubscribeToShardOutput = S.suspend(() =>
  S.Struct({ EventStream: SubscribeToShardEventStream }).pipe(ns),
).annotations({
  identifier: "SubscribeToShardOutput",
}) as any as S.Schema<SubscribeToShardOutput>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class InvalidArgumentException extends S.TaggedError<InvalidArgumentException>()(
  "InvalidArgumentException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { message: S.optional(S.String) },
) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class KMSAccessDeniedException extends S.TaggedError<KMSAccessDeniedException>()(
  "KMSAccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class ProvisionedThroughputExceededException extends S.TaggedError<ProvisionedThroughputExceededException>()(
  "ProvisionedThroughputExceededException",
  { message: S.optional(S.String) },
) {}
export class ExpiredNextTokenException extends S.TaggedError<ExpiredNextTokenException>()(
  "ExpiredNextTokenException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}
export class KMSDisabledException extends S.TaggedError<KMSDisabledException>()(
  "KMSDisabledException",
  { message: S.optional(S.String) },
) {}
export class KMSInvalidStateException extends S.TaggedError<KMSInvalidStateException>()(
  "KMSInvalidStateException",
  { message: S.optional(S.String) },
) {}
export class KMSNotFoundException extends S.TaggedError<KMSNotFoundException>()(
  "KMSNotFoundException",
  { message: S.optional(S.String) },
) {}
export class KMSOptInRequired extends S.TaggedError<KMSOptInRequired>()(
  "KMSOptInRequired",
  { message: S.optional(S.String) },
) {}
export class KMSThrottlingException extends S.TaggedError<KMSThrottlingException>()(
  "KMSThrottlingException",
  { message: S.optional(S.String) },
) {}
export class ExpiredIteratorException extends S.TaggedError<ExpiredIteratorException>()(
  "ExpiredIteratorException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Describes the shard limits and usage for the account.
 *
 * If you update your account limits, the old limits might be returned for a few
 * minutes.
 *
 * This operation has a limit of one transaction per second per account.
 */
export const describeLimits: (
  input: DescribeLimitsInput,
) => effect.Effect<
  DescribeLimitsOutput,
  LimitExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLimitsInput,
  output: DescribeLimitsOutput,
  errors: [LimitExceededException],
}));
/**
 * Describes the account-level settings for Amazon Kinesis Data Streams. This operation returns information about the minimum throughput billing commitments and other account-level configurations.
 *
 * This API has a call limit of 5 transactions per second (TPS) for each Amazon Web Services account. TPS over 5 will initiate the `LimitExceededException`.
 */
export const describeAccountSettings: (
  input: DescribeAccountSettingsInput,
) => effect.Effect<
  DescribeAccountSettingsOutput,
  LimitExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAccountSettingsInput,
  output: DescribeAccountSettingsOutput,
  errors: [LimitExceededException],
}));
/**
 * Lists the tags for the specified Kinesis data stream. This operation has a limit of
 * five transactions per second per account.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 */
export const listTagsForStream: (
  input: ListTagsForStreamInput,
) => effect.Effect<
  ListTagsForStreamOutput,
  | AccessDeniedException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForStreamInput,
  output: ListTagsForStreamOutput,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a policy attached to the specified data stream or consumer. Request patterns can be one of the following:
 *
 * - Data stream pattern: `arn:aws.*:kinesis:.*:\d{12}:.*stream/\S+`
 *
 * - Consumer pattern: `^(arn):aws.*:kinesis:.*:\d{12}:.*stream\/[a-zA-Z0-9_.-]+\/consumer\/[a-zA-Z0-9_.-]+:[0-9]+`
 */
export const getResourcePolicy: (
  input: GetResourcePolicyInput,
) => effect.Effect<
  GetResourcePolicyOutput,
  | AccessDeniedException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyInput,
  output: GetResourcePolicyOutput,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Registers a consumer with a Kinesis data stream. When you use this operation, the
 * consumer you register can then call SubscribeToShard to receive data
 * from the stream using enhanced fan-out, at a rate of up to 2 MiB per second for every
 * shard you subscribe to. This rate is unaffected by the total number of consumers that
 * read from the same stream.
 *
 * You can add tags to the registered consumer when making a `RegisterStreamConsumer` request by setting the `Tags` parameter. If you pass the `Tags` parameter, in addition to having the `kinesis:RegisterStreamConsumer` permission, you must also have the `kinesis:TagResource` permission for the consumer that will be registered. Tags will take effect from the `CREATING` status of the consumer.
 *
 * With On-demand Advantage streams, you can register up to 50 consumers per stream to use Enhanced Fan-out. With On-demand Standard and Provisioned streams, you can register up to 20 consumers per stream to use Enhanced Fan-out. A given consumer can only be
 * registered with one stream at a time.
 *
 * For an example of how to use this operation, see Enhanced Fan-Out
 * Using the Kinesis Data Streams API.
 *
 * The use of this operation has a limit of five transactions per second per account.
 * Also, only 5 consumers can be created simultaneously. In other words, you cannot have
 * more than 5 consumers in a `CREATING` status at the same time. Registering a
 * 6th consumer while there are 5 in a `CREATING` status results in a
 * `LimitExceededException`.
 */
export const registerStreamConsumer: (
  input: RegisterStreamConsumerInput,
) => effect.Effect<
  RegisterStreamConsumerOutput,
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterStreamConsumerInput,
  output: RegisterStreamConsumerOutput,
  errors: [
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Delete a policy for the specified data stream or consumer. Request patterns can be one of the following:
 *
 * - Data stream pattern: `arn:aws.*:kinesis:.*:\d{12}:.*stream/\S+`
 *
 * - Consumer pattern: `^(arn):aws.*:kinesis:.*:\d{12}:.*stream\/[a-zA-Z0-9_.-]+\/consumer\/[a-zA-Z0-9_.-]+:[0-9]+`
 */
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyInput,
) => effect.Effect<
  DeleteResourcePolicyResponse,
  | AccessDeniedException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePolicyInput,
  output: DeleteResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a Kinesis data stream and all its shards and data. You must shut down any
 * applications that are operating on the stream before you delete the stream. If an
 * application attempts to operate on a deleted stream, it receives the exception
 * `ResourceNotFoundException`.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * If the stream is in the `ACTIVE` state, you can delete it. After a
 * `DeleteStream` request, the specified stream is in the
 * `DELETING` state until Kinesis Data Streams completes the
 * deletion.
 *
 * **Note:** Kinesis Data Streams might continue to accept
 * data read and write operations, such as PutRecord, PutRecords, and GetRecords, on a stream in the
 * `DELETING` state until the stream deletion is complete.
 *
 * When you delete a stream, any shards in that stream are also deleted, and any tags are
 * dissociated from the stream.
 *
 * You can use the DescribeStreamSummary operation to check the state
 * of the stream, which is returned in `StreamStatus`.
 *
 * DeleteStream has a limit of five transactions per second per
 * account.
 */
export const deleteStream: (
  input: DeleteStreamInput,
) => effect.Effect<
  DeleteStreamResponse,
  | AccessDeniedException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStreamInput,
  output: DeleteStreamResponse,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Enables enhanced Kinesis data stream monitoring for shard-level metrics.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 */
export const enableEnhancedMonitoring: (
  input: EnableEnhancedMonitoringInput,
) => effect.Effect<
  EnhancedMonitoringOutput,
  | AccessDeniedException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableEnhancedMonitoringInput,
  output: EnhancedMonitoringOutput,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Increases the Kinesis data stream's retention period, which is the length of time data
 * records are accessible after they are added to the stream. The maximum value of a
 * stream's retention period is 8760 hours (365 days).
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * If you choose a longer stream retention period, this operation increases the time
 * period during which records that have not yet expired are accessible. However, it does
 * not make previous, expired data (older than the stream's previous retention period)
 * accessible after the operation has been called. For example, if a stream's retention
 * period is set to 24 hours and is increased to 168 hours, any data that is older than 24
 * hours remains inaccessible to consumer applications.
 */
export const increaseStreamRetentionPeriod: (
  input: IncreaseStreamRetentionPeriodInput,
) => effect.Effect<
  IncreaseStreamRetentionPeriodResponse,
  | AccessDeniedException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: IncreaseStreamRetentionPeriodInput,
  output: IncreaseStreamRetentionPeriodResponse,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Attaches a resource-based policy to a data stream or registered consumer. If you are using an identity other than the root user of
 * the Amazon Web Services account that owns the resource, the calling identity must have the `PutResourcePolicy` permissions on the
 * specified Kinesis Data Streams resource and belong to the owner's account in order to use this operation.
 * If you don't have `PutResourcePolicy` permissions, Amazon Kinesis Data Streams returns a `403 Access Denied error`.
 * If you receive a `ResourceNotFoundException`, check to see if you passed a valid stream or consumer resource.
 *
 * Request patterns can be one of the following:
 *
 * - Data stream pattern: `arn:aws.*:kinesis:.*:\d{12}:.*stream/\S+`
 *
 * - Consumer pattern: `^(arn):aws.*:kinesis:.*:\d{12}:.*stream\/[a-zA-Z0-9_.-]+\/consumer\/[a-zA-Z0-9_.-]+:[0-9]+`
 *
 * For more information, see Controlling Access to Amazon Kinesis Data Streams Resources Using IAM.
 */
export const putResourcePolicy: (
  input: PutResourcePolicyInput,
) => effect.Effect<
  PutResourcePolicyResponse,
  | AccessDeniedException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyInput,
  output: PutResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes tags from the specified Kinesis data stream. Removed tags are deleted and
 * cannot be recovered after this operation successfully completes.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * If you specify a tag that does not exist, it is ignored.
 *
 * RemoveTagsFromStream has a limit of five transactions per second per
 * account.
 */
export const removeTagsFromStream: (
  input: RemoveTagsFromStreamInput,
) => effect.Effect<
  RemoveTagsFromStreamResponse,
  | AccessDeniedException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveTagsFromStreamInput,
  output: RemoveTagsFromStreamResponse,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Disables server-side encryption for a specified stream.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * Stopping encryption is an asynchronous operation. Upon receiving the request, Kinesis
 * Data Streams returns immediately and sets the status of the stream to
 * `UPDATING`. After the update is complete, Kinesis Data Streams sets the
 * status of the stream back to `ACTIVE`. Stopping encryption normally takes a
 * few seconds to complete, but it can take minutes. You can continue to read and write
 * data to your stream while its status is `UPDATING`. Once the status of the
 * stream is `ACTIVE`, records written to the stream are no longer encrypted by
 * Kinesis Data Streams.
 *
 * API Limits: You can successfully disable server-side encryption 25 times in a rolling
 * 24-hour period.
 *
 * Note: It can take up to 5 seconds after the stream is in an `ACTIVE` status
 * before all records written to the stream are no longer subject to encryption. After you
 * disabled encryption, you can verify that encryption is not applied by inspecting the API
 * response from `PutRecord` or `PutRecords`.
 */
export const stopStreamEncryption: (
  input: StopStreamEncryptionInput,
) => effect.Effect<
  StopStreamEncryptionResponse,
  | AccessDeniedException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopStreamEncryptionInput,
  output: StopStreamEncryptionResponse,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Adds or updates tags for the specified Kinesis resource. Each tag is a label consisting of a user-defined key and value. Tags can help you manage, identify, organize, search for, and filter resources. You can assign up to 50 tags to a Kinesis resource.
 */
export const tagResource: (
  input: TagResourceInput,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes tags from the specified Kinesis resource. Removed tags are deleted and can't be recovered after this operation completes successfully.
 */
export const untagResource: (
  input: UntagResourceInput,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Adds or updates tags for the specified Kinesis data stream. You can assign up to 50
 * tags to a data stream.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * If tags have already been assigned to the stream, `AddTagsToStream`
 * overwrites any existing tags that correspond to the specified tag keys.
 *
 * AddTagsToStream has a limit of five transactions per second per
 * account.
 */
export const addTagsToStream: (
  input: AddTagsToStreamInput,
) => effect.Effect<
  AddTagsToStreamResponse,
  | AccessDeniedException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsToStreamInput,
  output: AddTagsToStreamResponse,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Decreases the Kinesis data stream's retention period, which is the length of time data
 * records are accessible after they are added to the stream. The minimum value of a
 * stream's retention period is 24 hours.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * This operation may result in lost data. For example, if the stream's retention period
 * is 48 hours and is decreased to 24 hours, any data already in the stream that is older
 * than 24 hours is inaccessible.
 */
export const decreaseStreamRetentionPeriod: (
  input: DecreaseStreamRetentionPeriodInput,
) => effect.Effect<
  DecreaseStreamRetentionPeriodResponse,
  | AccessDeniedException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DecreaseStreamRetentionPeriodInput,
  output: DecreaseStreamRetentionPeriodResponse,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * To deregister a consumer, provide its ARN. Alternatively, you can provide the ARN of
 * the data stream and the name you gave the consumer when you registered it. You may also
 * provide all three parameters, as long as they don't conflict with each other. If you
 * don't know the name or ARN of the consumer that you want to deregister, you can use the
 * ListStreamConsumers operation to get a list of the descriptions of
 * all the consumers that are currently registered with a given data stream. The
 * description of a consumer contains its name and ARN.
 *
 * This operation has a limit of five transactions per second per stream.
 */
export const deregisterStreamConsumer: (
  input: DeregisterStreamConsumerInput,
) => effect.Effect<
  DeregisterStreamConsumerResponse,
  | InvalidArgumentException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterStreamConsumerInput,
  output: DeregisterStreamConsumerResponse,
  errors: [
    InvalidArgumentException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * To get the description of a registered consumer, provide the ARN of the consumer.
 * Alternatively, you can provide the ARN of the data stream and the name you gave the
 * consumer when you registered it. You may also provide all three parameters, as long as
 * they don't conflict with each other. If you don't know the name or ARN of the consumer
 * that you want to describe, you can use the ListStreamConsumers
 * operation to get a list of the descriptions of all the consumers that are currently
 * registered with a given data stream.
 *
 * This operation has a limit of 20 transactions per second per stream.
 *
 * When making a cross-account call with `DescribeStreamConsumer`, make sure to provide the ARN of the consumer.
 */
export const describeStreamConsumer: (
  input: DescribeStreamConsumerInput,
) => effect.Effect<
  DescribeStreamConsumerOutput,
  | InvalidArgumentException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStreamConsumerInput,
  output: DescribeStreamConsumerOutput,
  errors: [
    InvalidArgumentException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Provides a summarized description of the specified Kinesis data stream without the
 * shard list.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * The information returned includes the stream name, Amazon Resource Name (ARN), status,
 * record retention period, approximate creation time, monitoring, encryption details, and
 * open shard count.
 *
 * DescribeStreamSummary has a limit of 20 transactions per second per
 * account.
 */
export const describeStreamSummary: (
  input: DescribeStreamSummaryInput,
) => effect.Effect<
  DescribeStreamSummaryOutput,
  | AccessDeniedException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStreamSummaryInput,
  output: DescribeStreamSummaryOutput,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Disables enhanced monitoring.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 */
export const disableEnhancedMonitoring: (
  input: DisableEnhancedMonitoringInput,
) => effect.Effect<
  EnhancedMonitoringOutput,
  | AccessDeniedException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableEnhancedMonitoringInput,
  output: EnhancedMonitoringOutput,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * List all tags added to the specified Kinesis resource. Each tag is a label consisting of a user-defined key and value. Tags can help you manage, identify, organize, search for, and filter resources.
 *
 * For more information about tagging Kinesis resources, see Tag your Amazon Kinesis Data Streams resources.
 */
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => effect.Effect<
  ListTagsForResourceOutput,
  | AccessDeniedException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Gets an Amazon Kinesis shard iterator. A shard iterator expires 5 minutes after it is
 * returned to the requester.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * A shard iterator specifies the shard position from which to start reading data records
 * sequentially. The position is specified using the sequence number of a data record in a
 * shard. A sequence number is the identifier associated with every record ingested in the
 * stream, and is assigned when a record is put into the stream. Each stream has one or
 * more shards.
 *
 * You must specify the shard iterator type. For example, you can set the
 * `ShardIteratorType` parameter to read exactly from the position denoted
 * by a specific sequence number by using the `AT_SEQUENCE_NUMBER` shard
 * iterator type. Alternatively, the parameter can read right after the sequence number by
 * using the `AFTER_SEQUENCE_NUMBER` shard iterator type, using sequence numbers
 * returned by earlier calls to PutRecord, PutRecords,
 * GetRecords, or DescribeStream. In the request,
 * you can specify the shard iterator type `AT_TIMESTAMP` to read records from
 * an arbitrary point in time, `TRIM_HORIZON` to cause
 * `ShardIterator` to point to the last untrimmed record in the shard in the
 * system (the oldest data record in the shard), or `LATEST` so that you always
 * read the most recent data in the shard.
 *
 * When you read repeatedly from a stream, use a GetShardIterator
 * request to get the first shard iterator for use in your first GetRecords request and for subsequent reads use the shard iterator returned by the GetRecords request in `NextShardIterator`. A new shard
 * iterator is returned by every GetRecords request in
 * `NextShardIterator`, which you use in the `ShardIterator`
 * parameter of the next GetRecords request.
 *
 * If a GetShardIterator request is made too often, you receive a
 * `ProvisionedThroughputExceededException`. For more information about
 * throughput limits, see GetRecords, and Streams Limits in the
 * *Amazon Kinesis Data Streams Developer Guide*.
 *
 * If the shard is closed, GetShardIterator returns a valid iterator
 * for the last sequence number of the shard. A shard can be closed as a result of using
 * SplitShard or MergeShards.
 *
 * GetShardIterator has a limit of five transactions per second per
 * account per open shard.
 */
export const getShardIterator: (
  input: GetShardIteratorInput,
) => effect.Effect<
  GetShardIteratorOutput,
  | AccessDeniedException
  | InternalFailureException
  | InvalidArgumentException
  | ProvisionedThroughputExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetShardIteratorInput,
  output: GetShardIteratorOutput,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidArgumentException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists the shards in a stream and provides information about each shard. This operation
 * has a limit of 1000 transactions per second per data stream.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * This action does not list expired shards. For information about expired shards, see
 * Data Routing, Data Persistence, and Shard State after a Reshard.
 *
 * This API is a new operation that is used by the Amazon Kinesis Client Library
 * (KCL). If you have a fine-grained IAM policy that only allows specific operations,
 * you must update your policy to allow calls to this API. For more information, see
 * Controlling Access to Amazon Kinesis Data Streams Resources Using
 * IAM.
 */
export const listShards: (
  input: ListShardsInput,
) => effect.Effect<
  ListShardsOutput,
  | AccessDeniedException
  | ExpiredNextTokenException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListShardsInput,
  output: ListShardsOutput,
  errors: [
    AccessDeniedException,
    ExpiredNextTokenException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the account-level settings for Amazon Kinesis Data Streams.
 *
 * Updating account settings is a synchronous operation. Upon receiving the request, Kinesis Data Streams will return immediately with your account’s updated settings.
 *
 * **API limits**
 *
 * - Certain account configurations have minimum commitment windows. Attempting to update your settings prior to the end of the minimum commitment window might have certain restrictions.
 *
 * - This API has a call limit of 5 transactions per second (TPS) for each Amazon Web Services account. TPS over 5 will initiate the `LimitExceededException`.
 */
export const updateAccountSettings: (
  input: UpdateAccountSettingsInput,
) => effect.Effect<
  UpdateAccountSettingsOutput,
  | InvalidArgumentException
  | LimitExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccountSettingsInput,
  output: UpdateAccountSettingsOutput,
  errors: [
    InvalidArgumentException,
    LimitExceededException,
    ValidationException,
  ],
}));
/**
 * Lists the consumers registered to receive data from a stream using enhanced fan-out,
 * and provides information about each consumer.
 *
 * This operation has a limit of 5 transactions per second per stream.
 */
export const listStreamConsumers: {
  (
    input: ListStreamConsumersInput,
  ): effect.Effect<
    ListStreamConsumersOutput,
    | ExpiredNextTokenException
    | InvalidArgumentException
    | LimitExceededException
    | ResourceInUseException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStreamConsumersInput,
  ) => stream.Stream<
    ListStreamConsumersOutput,
    | ExpiredNextTokenException
    | InvalidArgumentException
    | LimitExceededException
    | ResourceInUseException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStreamConsumersInput,
  ) => stream.Stream<
    unknown,
    | ExpiredNextTokenException
    | InvalidArgumentException
    | LimitExceededException
    | ResourceInUseException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStreamConsumersInput,
  output: ListStreamConsumersOutput,
  errors: [
    ExpiredNextTokenException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists your Kinesis data streams.
 *
 * The number of streams may be too large to return from a single call to
 * `ListStreams`. You can limit the number of returned streams using the
 * `Limit` parameter. If you do not specify a value for the
 * `Limit` parameter, Kinesis Data Streams uses the default limit, which is
 * currently 100.
 *
 * You can detect if there are more streams available to list by using the
 * `HasMoreStreams` flag from the returned output. If there are more streams
 * available, you can request more streams by using the name of the last stream returned by
 * the `ListStreams` request in the `ExclusiveStartStreamName`
 * parameter in a subsequent request to `ListStreams`. The group of stream names
 * returned by the subsequent request is then added to the list. You can continue this
 * process until all the stream names have been collected in the list.
 *
 * ListStreams has a limit of five transactions per second per
 * account.
 */
export const listStreams: {
  (
    input: ListStreamsInput,
  ): effect.Effect<
    ListStreamsOutput,
    | ExpiredNextTokenException
    | InvalidArgumentException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStreamsInput,
  ) => stream.Stream<
    ListStreamsOutput,
    | ExpiredNextTokenException
    | InvalidArgumentException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStreamsInput,
  ) => stream.Stream<
    unknown,
    | ExpiredNextTokenException
    | InvalidArgumentException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStreamsInput,
  output: ListStreamsOutput,
  errors: [
    ExpiredNextTokenException,
    InvalidArgumentException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "Limit",
  } as const,
}));
/**
 * Updates the warm throughput configuration for the specified Amazon Kinesis Data Streams on-demand data stream. This operation allows you to proactively scale your on-demand data stream to a specified throughput level, enabling better performance for sudden traffic spikes.
 *
 * When invoking this API, you must use either the `StreamARN` or the `StreamName` parameter, or both. It is recommended that you use the `StreamARN` input parameter when you invoke this API.
 *
 * Updating the warm throughput is an asynchronous operation. Upon receiving the request, Kinesis Data Streams returns immediately and sets the status of the stream to `UPDATING`. After the update is complete, Kinesis Data Streams sets the status of the stream back to `ACTIVE`. Depending on the size of the stream, the scaling action could take a few minutes to complete. You can continue to read and write data to your stream while its status is `UPDATING`.
 *
 * This operation is only supported for data streams with the on-demand capacity mode in accounts that have `MinimumThroughputBillingCommitment` enabled. Provisioned capacity mode streams do not support warm throughput configuration.
 *
 * This operation has the following default limits. By default, you cannot do the following:
 *
 * - Scale to more than 10 GiBps for an on-demand stream.
 *
 * - This API has a call limit of 5 transactions per second (TPS) for each Amazon Web Services account. TPS over 5 will initiate the `LimitExceededException`.
 *
 * For the default limits for an Amazon Web Services account, see Streams Limits in the Amazon Kinesis Data Streams Developer
 * Guide. To request an increase in the call rate limit, the shard limit for this API, or your overall shard limit, use the limits form.
 */
export const updateStreamWarmThroughput: (
  input: UpdateStreamWarmThroughputInput,
) => effect.Effect<
  UpdateStreamWarmThroughputOutput,
  | AccessDeniedException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStreamWarmThroughputInput,
  output: UpdateStreamWarmThroughputOutput,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the shard count of the specified stream to the specified number of shards.
 * This API is only supported for the data streams with the provisioned capacity
 * mode.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * Updating the shard count is an asynchronous operation. Upon receiving the request,
 * Kinesis Data Streams returns immediately and sets the status of the stream to
 * `UPDATING`. After the update is complete, Kinesis Data Streams sets the
 * status of the stream back to `ACTIVE`. Depending on the size of the stream,
 * the scaling action could take a few minutes to complete. You can continue to read and
 * write data to your stream while its status is `UPDATING`.
 *
 * To update the shard count, Kinesis Data Streams performs splits or merges on
 * individual shards. This can cause short-lived shards to be created, in addition to the
 * final shards. These short-lived shards count towards your total shard limit for your
 * account in the Region.
 *
 * When using this operation, we recommend that you specify a target shard count that is
 * a multiple of 25% (25%, 50%, 75%, 100%). You can specify any target value within your
 * shard limit. However, if you specify a target that isn't a multiple of 25%, the scaling
 * action might take longer to complete.
 *
 * This operation has the following default limits. By default, you cannot do the
 * following:
 *
 * - Scale more than ten times per rolling 24-hour period per stream
 *
 * - Scale up to more than double your current shard count for a stream
 *
 * - Scale down below half your current shard count for a stream
 *
 * - Scale up to more than 10000 shards in a stream
 *
 * - Scale a stream with more than 10000 shards down unless the result is less than
 * 10000 shards
 *
 * - Scale up to more than the shard limit for your account
 *
 * - Make over 10 TPS. TPS over 10 will trigger the LimitExceededException
 *
 * For the default limits for an Amazon Web Services account, see Streams
 * Limits in the Amazon Kinesis Data Streams Developer
 * Guide. To request an increase in the call rate limit, the shard limit for
 * this API, or your overall shard limit, use the limits form.
 */
export const updateShardCount: (
  input: UpdateShardCountInput,
) => effect.Effect<
  UpdateShardCountOutput,
  | AccessDeniedException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateShardCountInput,
  output: UpdateShardCountOutput,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Merges two adjacent shards in a Kinesis data stream and combines them into a single
 * shard to reduce the stream's capacity to ingest and transport data. This API is only
 * supported for the data streams with the provisioned capacity mode. Two shards are
 * considered adjacent if the union of the hash key ranges for the two shards form a
 * contiguous set with no gaps. For example, if you have two shards, one with a hash key
 * range of 276...381 and the other with a hash key range of 382...454, then you could
 * merge these two shards into a single shard that would have a hash key range of
 * 276...454. After the merge, the single child shard receives data for all hash key values
 * covered by the two parent shards.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * `MergeShards` is called when there is a need to reduce the overall capacity
 * of a stream because of excess capacity that is not being used. You must specify the
 * shard to be merged and the adjacent shard for a stream. For more information about
 * merging shards, see Merge Two
 * Shards in the Amazon Kinesis Data Streams Developer
 * Guide.
 *
 * If the stream is in the `ACTIVE` state, you can call
 * `MergeShards`. If a stream is in the `CREATING`,
 * `UPDATING`, or `DELETING` state, `MergeShards`
 * returns a `ResourceInUseException`. If the specified stream does not exist,
 * `MergeShards` returns a `ResourceNotFoundException`.
 *
 * You can use DescribeStreamSummary to check the state of the stream,
 * which is returned in `StreamStatus`.
 *
 * `MergeShards` is an asynchronous operation. Upon receiving a
 * `MergeShards` request, Amazon Kinesis Data Streams immediately returns a
 * response and sets the `StreamStatus` to `UPDATING`. After the
 * operation is completed, Kinesis Data Streams sets the `StreamStatus` to
 * `ACTIVE`. Read and write operations continue to work while the stream is
 * in the `UPDATING` state.
 *
 * You use DescribeStreamSummary and the ListShards
 * APIs to determine the shard IDs that are specified in the `MergeShards`
 * request.
 *
 * If you try to operate on too many streams in parallel using CreateStream, DeleteStream, `MergeShards`,
 * or SplitShard, you receive a `LimitExceededException`.
 *
 * `MergeShards` has a limit of five transactions per second per account.
 */
export const mergeShards: (
  input: MergeShardsInput,
) => effect.Effect<
  MergeShardsResponse,
  | AccessDeniedException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: MergeShardsInput,
  output: MergeShardsResponse,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Splits a shard into two new shards in the Kinesis data stream, to increase the
 * stream's capacity to ingest and transport data. `SplitShard` is called when
 * there is a need to increase the overall capacity of a stream because of an expected
 * increase in the volume of data records being ingested. This API is only supported for
 * the data streams with the provisioned capacity mode.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * You can also use `SplitShard` when a shard appears to be approaching its
 * maximum utilization; for example, the producers sending data into the specific shard are
 * suddenly sending more than previously anticipated. You can also call
 * `SplitShard` to increase stream capacity, so that more Kinesis Data
 * Streams applications can simultaneously read data from the stream for real-time
 * processing.
 *
 * You must specify the shard to be split and the new hash key, which is the position in
 * the shard where the shard gets split in two. In many cases, the new hash key might be
 * the average of the beginning and ending hash key, but it can be any hash key value in
 * the range being mapped into the shard. For more information, see Split a
 * Shard in the Amazon Kinesis Data Streams Developer
 * Guide.
 *
 * You can use DescribeStreamSummary and the ListShards APIs to determine the shard ID and hash key values for the `ShardToSplit`
 * and `NewStartingHashKey` parameters that are specified in the
 * `SplitShard` request.
 *
 * `SplitShard` is an asynchronous operation. Upon receiving a
 * `SplitShard` request, Kinesis Data Streams immediately returns a response
 * and sets the stream status to `UPDATING`. After the operation is completed,
 * Kinesis Data Streams sets the stream status to `ACTIVE`. Read and write
 * operations continue to work while the stream is in the `UPDATING` state.
 *
 * You can use DescribeStreamSummary to check the status of the stream,
 * which is returned in `StreamStatus`. If the stream is in the
 * `ACTIVE` state, you can call `SplitShard`.
 *
 * If the specified stream does not exist, DescribeStreamSummary
 * returns a `ResourceNotFoundException`. If you try to create more shards than
 * are authorized for your account, you receive a `LimitExceededException`.
 *
 * For the default shard limit for an Amazon Web Services account, see Kinesis
 * Data Streams Limits in the Amazon Kinesis Data Streams Developer
 * Guide. To increase this limit, contact Amazon Web Services
 * Support.
 *
 * If you try to operate on too many streams simultaneously using CreateStream, DeleteStream, MergeShards, and/or SplitShard, you receive a
 * `LimitExceededException`.
 *
 * `SplitShard` has a limit of five transactions per second per account.
 */
export const splitShard: (
  input: SplitShardInput,
) => effect.Effect<
  SplitShardResponse,
  | AccessDeniedException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SplitShardInput,
  output: SplitShardResponse,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * This allows you to update the `MaxRecordSize` of a single record that you can write to, and read from a stream. You can ingest and digest single records up to 10240 KiB.
 */
export const updateMaxRecordSize: (
  input: UpdateMaxRecordSizeInput,
) => effect.Effect<
  UpdateMaxRecordSizeResponse,
  | AccessDeniedException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMaxRecordSizeInput,
  output: UpdateMaxRecordSizeResponse,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the capacity mode of the data stream. Currently, in Kinesis Data Streams, you
 * can choose between an **on-demand** capacity mode and a
 * **provisioned** capacity mode for your data stream.
 *
 * If you'd still like to proactively scale your on-demand data stream’s capacity, you can unlock the warm throughput feature for on-demand data streams by enabling `MinimumThroughputBillingCommitment` for your account. Once your account has `MinimumThroughputBillingCommitment` enabled, you can specify the warm throughput in MiB per second that your stream can support in writes.
 */
export const updateStreamMode: (
  input: UpdateStreamModeInput,
) => effect.Effect<
  UpdateStreamModeResponse,
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStreamModeInput,
  output: UpdateStreamModeResponse,
  errors: [
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a Kinesis data stream. A stream captures and transports data records that are
 * continuously emitted from different data sources or *producers*.
 * Scale-out within a stream is explicitly supported by means of shards, which are uniquely
 * identified groups of data records in a stream.
 *
 * You can create your data stream using either on-demand or provisioned capacity mode. Data streams with an on-demand mode require no capacity planning and automatically scale to handle gigabytes of write and read throughput per minute. With the on-demand mode, Kinesis Data Streams automatically manages the shards in order to provide the necessary throughput.
 *
 * If you'd still like to proactively scale your on-demand data stream’s capacity, you can unlock the warm throughput feature for on-demand data streams by enabling `MinimumThroughputBillingCommitment` for your account. Once your account has `MinimumThroughputBillingCommitment` enabled, you can specify the warm throughput in MiB per second that your stream can support in writes.
 *
 * For the data streams with a provisioned mode, you must specify the number of shards for the data stream. Each shard can support reads up to five transactions per second, up to a maximum data read total of 2 MiB per second. Each shard can support writes up to 1,000 records per second, up to a maximum data write total of 1 MiB per second. If the amount of data input increases or decreases, you can add or remove shards.
 *
 * The stream name identifies the stream. The name is scoped to the Amazon Web Services
 * account used by the application. It is also scoped by Amazon Web Services Region. That
 * is, two streams in two different accounts can have the same name, and two streams in the
 * same account, but in two different Regions, can have the same name.
 *
 * `CreateStream` is an asynchronous operation. Upon receiving a
 * `CreateStream` request, Kinesis Data Streams immediately returns and sets
 * the stream status to `CREATING`. After the stream is created, Kinesis Data
 * Streams sets the stream status to `ACTIVE`. You should perform read and write
 * operations only on an `ACTIVE` stream.
 *
 * You receive a `LimitExceededException` when making a
 * `CreateStream` request when you try to do one of the following:
 *
 * - Have more than five streams in the `CREATING` state at any point in
 * time.
 *
 * - Create more shards than are authorized for your account.
 *
 * For the default shard or on-demand throughput limits for an Amazon Web Services account, see Amazon Kinesis Data Streams Limits in the *Amazon Kinesis Data Streams Developer Guide*. To increase this limit, contact Amazon Web Services Support.
 *
 * You can use DescribeStreamSummary to check the stream status, which
 * is returned in `StreamStatus`.
 *
 * CreateStream has a limit of five transactions per second per
 * account.
 *
 * You can add tags to the stream when making a `CreateStream` request by setting the `Tags` parameter. If you pass the `Tags` parameter, in addition to having the `kinesis:CreateStream` permission, you must also have the `kinesis:AddTagsToStream` permission for the stream that will be created. The `kinesis:TagResource` permission won’t work to tag streams on creation. Tags will take effect from the `CREATING` status of the stream, but you can't make any updates to the tags until the stream is in `ACTIVE` state.
 */
export const createStream: (
  input: CreateStreamInput,
) => effect.Effect<
  CreateStreamResponse,
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStreamInput,
  output: CreateStreamResponse,
  errors: [
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ValidationException,
  ],
}));
/**
 * Writes a single data record into an Amazon Kinesis data stream. Call
 * `PutRecord` to send data into the stream for real-time ingestion and
 * subsequent processing, one record at a time. Each shard can support writes up to 1,000
 * records per second, up to a maximum data write total of 10 MiB per second.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * You must specify the name of the stream that captures, stores, and transports the
 * data; a partition key; and the data blob itself.
 *
 * The data blob can be any type of data; for example, a segment from a log file,
 * geographic/location data, website clickstream data, and so on.
 *
 * The partition key is used by Kinesis Data Streams to distribute data across shards.
 * Kinesis Data Streams segregates the data records that belong to a stream into multiple
 * shards, using the partition key associated with each data record to determine the shard
 * to which a given data record belongs.
 *
 * Partition keys are Unicode strings, with a maximum length limit of 256 characters for
 * each key. An MD5 hash function is used to map partition keys to 128-bit integer values
 * and to map associated data records to shards using the hash key ranges of the shards.
 * You can override hashing the partition key to determine the shard by explicitly
 * specifying a hash value using the `ExplicitHashKey` parameter. For more
 * information, see Adding Data to a Stream in the Amazon Kinesis Data Streams
 * Developer Guide.
 *
 * `PutRecord` returns the shard ID of where the data record was placed and the
 * sequence number that was assigned to the data record.
 *
 * Sequence numbers increase over time and are specific to a shard within a stream, not
 * across all shards within a stream. To guarantee strictly increasing ordering, write
 * serially to a shard and use the `SequenceNumberForOrdering` parameter. For
 * more information, see Adding Data to a Stream in the Amazon Kinesis Data Streams
 * Developer Guide.
 *
 * After you write a record to a stream, you cannot modify that record or its order
 * within the stream.
 *
 * If a `PutRecord` request cannot be processed because of insufficient
 * provisioned throughput on the shard involved in the request, `PutRecord`
 * throws `ProvisionedThroughputExceededException`.
 *
 * By default, data records are accessible for 24 hours from the time that they are added
 * to a stream. You can use IncreaseStreamRetentionPeriod or DecreaseStreamRetentionPeriod to modify this retention period.
 */
export const putRecord: (
  input: PutRecordInput,
) => effect.Effect<
  PutRecordOutput,
  | AccessDeniedException
  | InternalFailureException
  | InvalidArgumentException
  | KMSAccessDeniedException
  | KMSDisabledException
  | KMSInvalidStateException
  | KMSNotFoundException
  | KMSOptInRequired
  | KMSThrottlingException
  | ProvisionedThroughputExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRecordInput,
  output: PutRecordOutput,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidArgumentException,
    KMSAccessDeniedException,
    KMSDisabledException,
    KMSInvalidStateException,
    KMSNotFoundException,
    KMSOptInRequired,
    KMSThrottlingException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Writes multiple data records into a Kinesis data stream in a single call (also
 * referred to as a `PutRecords` request). Use this operation to send data into
 * the stream for data ingestion and processing.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * Each `PutRecords` request can support up to 500 records. Each record in the
 * request can be as large as 10 MiB, up to a limit of 10 MiB for the entire request,
 * including partition keys. Each shard can support writes up to 1,000 records per second,
 * up to a maximum data write total of 1 MB per second.
 *
 * You must specify the name of the stream that captures, stores, and transports the
 * data; and an array of request `Records`, with each record in the array
 * requiring a partition key and data blob. The record size limit applies to the total size
 * of the partition key and data blob.
 *
 * The data blob can be any type of data; for example, a segment from a log file,
 * geographic/location data, website clickstream data, and so on.
 *
 * The partition key is used by Kinesis Data Streams as input to a hash function that
 * maps the partition key and associated data to a specific shard. An MD5 hash function is
 * used to map partition keys to 128-bit integer values and to map associated data records
 * to shards. As a result of this hashing mechanism, all data records with the same
 * partition key map to the same shard within the stream. For more information, see Adding Data to a Stream in the Amazon Kinesis Data Streams
 * Developer Guide.
 *
 * Each record in the `Records` array may include an optional parameter,
 * `ExplicitHashKey`, which overrides the partition key to shard mapping.
 * This parameter allows a data producer to determine explicitly the shard where the record
 * is stored. For more information, see Adding Multiple Records with PutRecords in the Amazon Kinesis
 * Data Streams Developer Guide.
 *
 * The `PutRecords` response includes an array of response
 * `Records`. Each record in the response array directly correlates with a
 * record in the request array using natural ordering, from the top to the bottom of the
 * request and response. The response `Records` array always includes the same
 * number of records as the request array.
 *
 * The response `Records` array includes both successfully and unsuccessfully
 * processed records. Kinesis Data Streams attempts to process all records in each
 * `PutRecords` request. A single record failure does not stop the
 * processing of subsequent records. As a result, PutRecords doesn't guarantee the ordering
 * of records. If you need to read records in the same order they are written to the
 * stream, use PutRecord instead of `PutRecords`, and write to
 * the same shard.
 *
 * A successfully processed record includes `ShardId` and
 * `SequenceNumber` values. The `ShardId` parameter identifies
 * the shard in the stream where the record is stored. The `SequenceNumber`
 * parameter is an identifier assigned to the put record, unique to all records in the
 * stream.
 *
 * An unsuccessfully processed record includes `ErrorCode` and
 * `ErrorMessage` values. `ErrorCode` reflects the type of error
 * and can be one of the following values:
 * `ProvisionedThroughputExceededException` or `InternalFailure`.
 * `ErrorMessage` provides more detailed information about the
 * `ProvisionedThroughputExceededException` exception including the account
 * ID, stream name, and shard ID of the record that was throttled. For more information
 * about partially successful responses, see Adding Multiple Records with PutRecords in the Amazon Kinesis
 * Data Streams Developer Guide.
 *
 * After you write a record to a stream, you cannot modify that record or its order
 * within the stream.
 *
 * By default, data records are accessible for 24 hours from the time that they are added
 * to a stream. You can use IncreaseStreamRetentionPeriod or DecreaseStreamRetentionPeriod to modify this retention period.
 */
export const putRecords: (
  input: PutRecordsInput,
) => effect.Effect<
  PutRecordsOutput,
  | AccessDeniedException
  | InternalFailureException
  | InvalidArgumentException
  | KMSAccessDeniedException
  | KMSDisabledException
  | KMSInvalidStateException
  | KMSNotFoundException
  | KMSOptInRequired
  | KMSThrottlingException
  | ProvisionedThroughputExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRecordsInput,
  output: PutRecordsOutput,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidArgumentException,
    KMSAccessDeniedException,
    KMSDisabledException,
    KMSInvalidStateException,
    KMSNotFoundException,
    KMSOptInRequired,
    KMSThrottlingException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Enables or updates server-side encryption using an Amazon Web Services KMS key for a
 * specified stream.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * Starting encryption is an asynchronous operation. Upon receiving the request, Kinesis
 * Data Streams returns immediately and sets the status of the stream to
 * `UPDATING`. After the update is complete, Kinesis Data Streams sets the
 * status of the stream back to `ACTIVE`. Updating or applying encryption
 * normally takes a few seconds to complete, but it can take minutes. You can continue to
 * read and write data to your stream while its status is `UPDATING`. Once the
 * status of the stream is `ACTIVE`, encryption begins for records written to
 * the stream.
 *
 * API Limits: You can successfully apply a new Amazon Web Services KMS key for
 * server-side encryption 25 times in a rolling 24-hour period.
 *
 * Note: It can take up to 5 seconds after the stream is in an `ACTIVE` status
 * before all records written to the stream are encrypted. After you enable encryption, you
 * can verify that encryption is applied by inspecting the API response from
 * `PutRecord` or `PutRecords`.
 */
export const startStreamEncryption: (
  input: StartStreamEncryptionInput,
) => effect.Effect<
  StartStreamEncryptionResponse,
  | AccessDeniedException
  | InvalidArgumentException
  | KMSAccessDeniedException
  | KMSDisabledException
  | KMSInvalidStateException
  | KMSNotFoundException
  | KMSOptInRequired
  | KMSThrottlingException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartStreamEncryptionInput,
  output: StartStreamEncryptionResponse,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    KMSAccessDeniedException,
    KMSDisabledException,
    KMSInvalidStateException,
    KMSNotFoundException,
    KMSOptInRequired,
    KMSThrottlingException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Describes the specified Kinesis data stream.
 *
 * This API has been revised. It's highly recommended that you use the DescribeStreamSummary API to get a summarized description of the
 * specified Kinesis data stream and the ListShards API to list the
 * shards in a specified data stream and obtain information about each shard.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * The information returned includes the stream name, Amazon Resource Name (ARN),
 * creation time, enhanced metric configuration, and shard map. The shard map is an array
 * of shard objects. For each shard object, there is the hash key and sequence number
 * ranges that the shard spans, and the IDs of any earlier shards that played in a role in
 * creating the shard. Every record ingested in the stream is identified by a sequence
 * number, which is assigned when the record is put into the stream.
 *
 * You can limit the number of shards returned by each call. For more information, see
 * Retrieving
 * Shards from a Stream in the Amazon Kinesis Data Streams Developer
 * Guide.
 *
 * There are no guarantees about the chronological order shards returned. To process
 * shards in chronological order, use the ID of the parent shard to track the lineage to
 * the oldest shard.
 *
 * This operation has a limit of 10 transactions per second per account.
 */
export const describeStream: (
  input: DescribeStreamInput,
) => effect.Effect<
  DescribeStreamOutput,
  | AccessDeniedException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStreamInput,
  output: DescribeStreamOutput,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Gets data records from a Kinesis data stream's shard.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * Specify a shard iterator using the `ShardIterator` parameter. The shard
 * iterator specifies the position in the shard from which you want to start reading data
 * records sequentially. If there are no records available in the portion of the shard that
 * the iterator points to, GetRecords returns an empty list. It might
 * take multiple calls to get to a portion of the shard that contains records.
 *
 * You can scale by provisioning multiple shards per stream while considering service
 * limits (for more information, see Amazon Kinesis Data Streams
 * Limits in the Amazon Kinesis Data Streams Developer
 * Guide). Your application should have one thread per shard, each reading
 * continuously from its stream. To read from a stream continually, call GetRecords in a loop. Use GetShardIterator to get the
 * shard iterator to specify in the first GetRecords call. GetRecords returns a new shard iterator in
 * `NextShardIterator`. Specify the shard iterator returned in
 * `NextShardIterator` in subsequent calls to GetRecords.
 * If the shard has been closed, the shard iterator can't return more data and GetRecords returns `null` in `NextShardIterator`.
 * You can terminate the loop when the shard is closed, or when the shard iterator reaches
 * the record with the sequence number or other attribute that marks it as the last record
 * to process.
 *
 * Each data record can be up to 1 MiB in size, and each shard can read up to 2 MiB per
 * second. You can ensure that your calls don't exceed the maximum supported size or
 * throughput by using the `Limit` parameter to specify the maximum number of
 * records that GetRecords can return. Consider your average record size
 * when determining this limit. The maximum number of records that can be returned per call
 * is 10,000.
 *
 * The size of the data returned by GetRecords varies depending on the
 * utilization of the shard. It is recommended that consumer applications retrieve records
 * via the `GetRecords` command using the 5 TPS limit to remain caught up.
 * Retrieving records less frequently can lead to consumer applications falling behind. The
 * maximum size of data that GetRecords can return is 10 MiB. If a call
 * returns this amount of data, subsequent calls made within the next 5 seconds throw
 * `ProvisionedThroughputExceededException`. If there is insufficient
 * provisioned throughput on the stream, subsequent calls made within the next 1 second
 * throw `ProvisionedThroughputExceededException`. GetRecords
 * doesn't return any data when it throws an exception. For this reason, we recommend that
 * you wait 1 second between calls to GetRecords. However, it's possible
 * that the application will get exceptions for longer than 1 second.
 *
 * To detect whether the application is falling behind in processing, you can use the
 * `MillisBehindLatest` response attribute. You can also monitor the stream
 * using CloudWatch metrics and other mechanisms (see Monitoring in the Amazon
 * Kinesis Data Streams Developer Guide).
 *
 * Each Amazon Kinesis record includes a value, `ApproximateArrivalTimestamp`,
 * that is set when a stream successfully receives and stores a record. This is commonly
 * referred to as a server-side time stamp, whereas a client-side time stamp is set when a
 * data producer creates or sends the record to a stream (a data producer is any data
 * source putting data records into a stream, for example with PutRecords). The time stamp has millisecond precision. There are no guarantees about the time
 * stamp accuracy, or that the time stamp is always increasing. For example, records in a
 * shard or across a stream might have time stamps that are out of order.
 *
 * This operation has a limit of five transactions per second per shard.
 */
export const getRecords: (
  input: GetRecordsInput,
) => effect.Effect<
  GetRecordsOutput,
  | AccessDeniedException
  | ExpiredIteratorException
  | InternalFailureException
  | InvalidArgumentException
  | KMSAccessDeniedException
  | KMSDisabledException
  | KMSInvalidStateException
  | KMSNotFoundException
  | KMSOptInRequired
  | KMSThrottlingException
  | ProvisionedThroughputExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRecordsInput,
  output: GetRecordsOutput,
  errors: [
    AccessDeniedException,
    ExpiredIteratorException,
    InternalFailureException,
    InvalidArgumentException,
    KMSAccessDeniedException,
    KMSDisabledException,
    KMSInvalidStateException,
    KMSNotFoundException,
    KMSOptInRequired,
    KMSThrottlingException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * This operation establishes an HTTP/2 connection between the consumer you specify in
 * the `ConsumerARN` parameter and the shard you specify in the
 * `ShardId` parameter. After the connection is successfully established,
 * Kinesis Data Streams pushes records from the shard to the consumer over this connection.
 * Before you call this operation, call RegisterStreamConsumer to
 * register the consumer with Kinesis Data Streams.
 *
 * When the `SubscribeToShard` call succeeds, your consumer starts receiving
 * events of type SubscribeToShardEvent over the HTTP/2 connection for up
 * to 5 minutes, after which time you need to call `SubscribeToShard` again to
 * renew the subscription if you want to continue to receive records.
 *
 * You can make one call to `SubscribeToShard` per second per registered
 * consumer per shard. For example, if you have a 4000 shard stream and two registered
 * stream consumers, you can make one `SubscribeToShard` request per second for
 * each combination of shard and registered consumer, allowing you to subscribe both
 * consumers to all 4000 shards in one second.
 *
 * If you call `SubscribeToShard` again with the same `ConsumerARN`
 * and `ShardId` within 5 seconds of a successful call, you'll get a
 * `ResourceInUseException`. If you call `SubscribeToShard` 5
 * seconds or more after a successful call, the second call takes over the subscription and
 * the previous connection expires or fails with a
 * `ResourceInUseException`.
 *
 * For an example of how to use this operation, see Enhanced Fan-Out
 * Using the Kinesis Data Streams API.
 */
export const subscribeToShard: (
  input: SubscribeToShardInput,
) => effect.Effect<
  SubscribeToShardOutput,
  | AccessDeniedException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SubscribeToShardInput,
  output: SubscribeToShardOutput,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
