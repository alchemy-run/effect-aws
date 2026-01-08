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
  sdkId: "IoT",
  serviceShapeName: "AWSIotService",
});
const auth = T.AwsAuthSigv4({ name: "iot" });
const ver = T.ServiceVersion("2015-05-28");
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
              `https://iot-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://iot-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://iot.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        if ("aws" === _.getAttr(PartitionResult, "name")) {
          return e(`https://iot.${Region}.amazonaws.com`);
        }
        if ("aws-cn" === _.getAttr(PartitionResult, "name")) {
          return e(`https://iot.${Region}.amazonaws.com.cn`);
        }
        if ("aws-us-gov" === _.getAttr(PartitionResult, "name")) {
          return e(`https://iot.${Region}.amazonaws.com`);
        }
        return e(
          `https://iot.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type CertificateId = string;
export type SetAsActive = boolean;
export type BillingGroupName = string;
export type BillingGroupArn = string;
export type ThingName = string;
export type ThingArn = string;
export type ThingGroupName = string;
export type ThingGroupArn = string;
export type OverrideDynamicGroups = boolean;
export type PackageName = string;
export type VersionName = string;
export type ClientToken = string;
export type TargetArn = string;
export type JobId = string;
export type Comment = string;
export type NamespaceId = string;
export type PolicyName = string;
export type PolicyTarget = string;
export type Principal = string;
export type SecurityProfileName = string;
export type SecurityProfileTargetArn = string;
export type MitigationActionsTaskId = string;
export type AuditTaskId = string;
export type ReasonCode = string;
export type ForceFlag = boolean;
export type ExpectedVersion = number;
export type ErrorMessage2 = string;
export type ConfirmationToken = string;
export type AuditCheckName = string;
export type SuppressIndefinitely = boolean;
export type AuditDescription = string;
export type ClientRequestToken = string;
export type AuthorizerName = string;
export type AuthorizerFunctionArn = string;
export type TokenKeyName = string;
export type BooleanKey = boolean;
export type EnableCachingForHttp = boolean;
export type CertificateSigningRequest = string;
export type CertificateProviderName = string;
export type CertificateProviderFunctionArn = string;
export type CommandId = string;
export type DisplayName = string;
export type CommandDescription = string;
export type CommandPayloadTemplateString = string;
export type RoleArn = string;
export type MetricName = string;
export type CustomMetricDisplayName = string;
export type DimensionName = string;
export type DimensionStringValue = string;
export type DomainConfigurationName = string;
export type DomainName = string;
export type AcmCertificateArn = string;
export type IndexName = string;
export type QueryString = string;
export type QueryVersion = string;
export type FleetMetricName = string;
export type FleetMetricPeriod = number;
export type AggregationField = string;
export type FleetMetricDescription = string;
export type JobDocumentSource = string;
export type JobDocument = string;
export type JobDescription = string;
export type JobTemplateArn = string;
export type PackageVersionArn = string;
export type JobTemplateId = string;
export type JobArn = string;
export type MitigationActionName = string;
export type OTAUpdateId = string;
export type OTAUpdateDescription = string;
export type Target = string;
export type ResourceDescription = string | redacted.Redacted<string>;
export type PackageVersionRecipe = string | redacted.Redacted<string>;
export type PolicyDocument = string;
export type SetAsDefault = boolean;
export type TemplateName = string;
export type TemplateDescription = string;
export type TemplateBody = string;
export type Enabled2 = boolean;
export type RoleAlias = string;
export type CredentialDurationSeconds = number;
export type DayOfMonth = string;
export type ScheduledAuditName = string;
export type SecurityProfileDescription = string;
export type BehaviorMetric = string;
export type StreamId = string;
export type StreamDescription = string;
export type ThingTypeName = string;
export type RuleName = string;
export type DeleteScheduledAudits = boolean;
export type OptionalVersion = number;
export type ForceDelete = boolean;
export type CommandExecutionId = string;
export type ExecutionNumber = number;
export type DeleteStream_ = boolean;
export type ForceDeleteAWSJob = boolean;
export type PolicyVersionId = string;
export type TemplateVersionId = number;
export type AwsArn = string;
export type LogTargetName = string;
export type UndoDeprecate = boolean;
export type FindingId = string;
export type ReservedDomainConfigurationName = string;
export type KmsKeyArn = string;
export type KmsAccessRoleArn = string;
export type EndpointType = string;
export type CreationDate = Date;
export type LastModifiedDate = Date;
export type BeforeSubstitutionFlag = boolean;
export type ManagedJobTemplateName = string;
export type ManagedTemplateVersion = string;
export type TaskId = string;
export type TinyMaxResults = number;
export type NextToken = string;
export type BooleanWrapperObject = boolean;
export type CognitoIdentityPoolId = string;
export type Percent = number;
export type RegistrationCode = string;
export type ConnectivityApiThingName = string | redacted.Redacted<string>;
export type VerboseFlag = boolean;
export type DeviceDefenderThingName = string;
export type ListSuppressedAlerts = boolean;
export type MaxResults = number;
export type Recursive = boolean;
export type Marker = string;
export type PageSize = number;
export type ListSuppressedFindings = boolean;
export type AscendingOrder = boolean;
export type RegistryMaxResults = number;
export type CommandMaxResults = number;
export type CommandArn = string;
export type CommandParameterName = string;
export type ViolationId = string;
export type QueryMaxResults = number;
export type LaserMaxResults = number;
export type ThingGroupId = string;
export type PackageCatalogMaxResults = number;
export type ResourceArn = string;
export type RecursiveWithoutDefault = boolean;
export type AttributeName = string;
export type AttributeValue = string;
export type UsePrefixAttributeValue = boolean;
export type TopicRuleDestinationMaxResults = number;
export type Topic = string;
export type TopicRuleMaxResults = number;
export type IsDisabled = boolean;
export type SkyfallMaxResults = number;
export type VerificationStateDescription = string;
export type CertificatePem = string;
export type AllowAutoRegistration = boolean;
export type SetAsActiveFlag = boolean;
export type Message = string;
export type SearchQueryMaxResults = number;
export type DisableAllLogs = boolean;
export type RegistryS3BucketName = string;
export type RegistryS3KeyName = string;
export type ClientId = string;
export type Token = string;
export type TokenSignature = string;
export type AwsAccountId = string;
export type TagKey = string;
export type RemoveAutoRegistration = boolean;
export type DeprecationFlag = boolean;
export type RemoveAuthorizerConfig = boolean;
export type UnsetDefaultVersion = boolean;
export type RemoveHook = boolean;
export type DeleteBehaviors = boolean;
export type DeleteAlertTargets = boolean;
export type DeleteAdditionalMetricsToRetain = boolean;
export type DeleteMetricsExportConfig = boolean;
export type RemoveThingType = boolean;
export type DetailsKey = string;
export type DetailsValue = string;
export type RoleAliasArn = string;
export type CertificateArn = string;
export type KeyName = string;
export type KeyValue = string;
export type TagValue = string;
export type BillingGroupDescription = string;
export type CommandPayloadBlob = Uint8Array;
export type MimeType = string;
export type CommandParameterDescription = string;
export type AllowAuthorizerOverride = boolean;
export type SecurityPolicy = string;
export type EnableOCSPCheck = boolean;
export type OCSPLambdaArn = string;
export type ClientCertificateCallbackArn = string;
export type ThingGroupDescription = string;
export type AggregationTypeValue = string;
export type ExpiresInSec = number;
export type MaxJobExecutionsPerMin = number;
export type InProgressTimeoutInMinutes = number;
export type ParameterKey = string;
export type ParameterValue = string;
export type StringDateTime = string;
export type CronExpression = string;
export type DurationInMinutes = number;
export type MaximumPerMinute = number;
export type ExpiresInSeconds = number;
export type AwsJobTimeoutInProgressTimeoutInMinutes = number;
export type FileName = string;
export type FileType = number;
export type OTAUpdateFileVersion = string;
export type AttributeKey = string;
export type Value = string;
export type ResourceAttributeKey = string;
export type ResourceAttributeValue = string;
export type PayloadVersion = string;
export type BehaviorName = string;
export type SuppressAlerts = boolean;
export type ExportMetric = boolean;
export type MqttTopic = string;
export type FileId = number;
export type Flag = boolean;
export type ThingTypeDescription = string;
export type SQL = string;
export type Description = string;
export type AwsIotSqlVersion = string;
export type AuthorizerArn = string;
export type ErrorCode = string;
export type ErrorMessage = string;
export type EnabledBoolean = boolean;
export type Parameter = string;
export type LogEventType = string;
export type LogDestination = string;
export type Resource = string;
export type HttpQueryString = string;
export type MqttUsername = string;
export type MqttPassword = Uint8Array;
export type MqttClientId = string;
export type ServerName = string;
export type CertificateProviderArn = string;
export type CustomMetricArn = string;
export type DimensionArn = string;
export type PolicyArn = string;
export type IsDefaultVersion = boolean;
export type TemplateArn = string;
export type ScheduledAuditArn = string;
export type StatusCode = number;
export type ResourceId = string;
export type BillingGroupId = string;
export type Version = number;
export type DomainConfigurationArn = string;
export type EndpointAddress = string;
export type FleetMetricArn = string;
export type IndexSchema = string;
export type Environment = string;
export type MitigationActionArn = string;
export type MitigationActionId = string;
export type SecurityProfileArn = string;
export type ThingId = string;
export type Count = number;
export type Percentage = number;
export type ThingTypeId = string;
export type ThingTypeArn = string;
export type CommandExecutionTimeoutInSeconds = number;
export type PackageArn = string;
export type PackageVersionErrorReason = string;
export type GenerationId = string;
export type RuleArn = string;
export type PrincipalArn = string;
export type S3FileUrl = string;
export type StreamArn = string;
export type StreamVersion = number;
export type Valid = boolean;
export type S3Bucket = string;
export type S3Key = string;
export type S3Version = string;
export type IssuerCertificateSubject = string;
export type IssuerId = string;
export type IssuerCertificateSerialNumber = string;
export type StringParameterValue = string;
export type BooleanParameterValue = boolean;
export type IntegerParameterValue = number;
export type LongParameterValue = number;
export type DoubleParameterValue = number;
export type BinaryParameterValue = Uint8Array;
export type UnsignedLongParameterValue = string;
export type RolloutRatePerMinute = number;
export type IncrementFactor = number;
export type AbortThresholdPercentage = number;
export type MinimumNumberOfExecutedThings = number;
export type NumberOfRetries = number;
export type SnsTopicArn = string;
export type AwsJobRolloutRatePerMinute = number;
export type AwsJobRolloutIncrementFactor = number;
export type AwsJobAbortCriteriaAbortThresholdPercentage = number;
export type AwsJobAbortCriteriaMinimumNumberOfExecutedThings = number;
export type SigningJobId = string;
export type DurationSeconds = number;
export type ConsecutiveDatapointsToAlarm = number;
export type ConsecutiveDatapointsToClear = number;
export type AlertTargetArn = string;
export type Url = string;
export type SubnetId = string;
export type SecurityGroupId = string;
export type VpcId = string;
export type Enabled = boolean;
export type MaxBuckets = number;
export type FieldName = string;
export type ShadowName = string;
export type ReasonForNonComplianceCode = string;
export type HttpHeaderName = string;
export type HttpHeaderValue = string;
export type PublicKey = string;
export type PrivateKey = string | redacted.Redacted<string>;
export type ReasonForNonCompliance = string;
export type IsSuppressed = boolean;
export type TotalChecksCount = number;
export type InProgressChecksCount = number;
export type WaitingForDataCollectionChecksCount = number;
export type CompliantChecksCount = number;
export type NonCompliantChecksCount = number;
export type FailedChecksCount = number;
export type CanceledChecksCount = number;
export type CustomerVersion = number;
export type PrimitiveBoolean = boolean;
export type ServerCertificateStatusDetail = string;
export type Forced = boolean;
export type VersionNumber = number;
export type ApproximateSecondsBeforeTimedOut = number;
export type Regex = string;
export type Example = string;
export type Optional = boolean;
export type DeprecationDate = Date;
export type DataCollectionPercentage = number;
export type StatusReasonCode = string;
export type StatusReasonDescription = string;
export type CommandExecutionResultName = string;
export type OTAUpdateArn = string;
export type AwsIotJobId = string;
export type AwsIotJobArn = string;
export type PercentValue = number;
export type Average = number;
export type Sum = number;
export type Minimum = number;
export type Maximum = number;
export type SumOfSquares = number;
export type Variance = number;
export type StdDeviation = number;
export type CreatedAtDate = Date;
export type LastUpdatedAtDate = Date;
export type DetectMitigationActionExecutionErrorCode = string;
export type SbomValidationErrorMessage = string;
export type TopicPattern = string;
export type JsonDocument = string;
export type NumberOfThings = number;
export type AwsJobRateIncreaseCriteriaNumberOfThings = number;
export type SigningProfileName = string;
export type HashAlgorithm = string;
export type SignatureAlgorithm = string;
export type UnsignedLong = number;
export type Cidr = string;
export type Port = number;
export type StringValue = string;
export type EvaluationStatistic = string;
export type UserPropertyKeyName = string;
export type ConnectionAttributeName = string;
export type TableName = string;
export type DynamoOperation = string;
export type HashKeyField = string;
export type HashKeyValue = string;
export type RangeKeyField = string;
export type RangeKeyValue = string;
export type PayloadField = string;
export type FunctionArn = string;
export type QueueUrl = string;
export type UseBase64 = boolean;
export type StreamName = string;
export type PartitionKey = string;
export type Qos = number;
export type BucketName = string;
export type Key = string;
export type DeliveryStreamName = string;
export type FirehoseSeparator = string;
export type BatchMode = boolean;
export type AlarmName = string;
export type StateReason = string;
export type StateValue = string;
export type LogGroupName = string;
export type ElasticsearchEndpoint = string;
export type ElasticsearchIndex = string;
export type ElasticsearchType = string;
export type ElasticsearchId = string;
export type SalesforceToken = string;
export type SalesforceEndpoint = string;
export type ChannelName = string;
export type InputName = string;
export type MessageId = string;
export type ExecutionNamePrefix = string;
export type StateMachineName = string;
export type TimestreamDatabaseName = string;
export type TimestreamTableName = string;
export type EnableBatching = boolean;
export type ConfigValue = string;
export type TargetFieldName = string;
export type TotalFindingsCount = number;
export type FailedFindingsCount = number;
export type SucceededFindingsCount = number;
export type SkippedFindingsCount = number;
export type CanceledFindingsCount = number;
export type CheckCompliant = boolean;
export type TotalResourcesCount = number;
export type NonCompliantResourcesCount = number;
export type SuppressedNonCompliantResourcesCount = number;
export type GenericLongValue = number;
export type ProcessingTargetName = string;
export type CanceledThings = number;
export type SucceededThings = number;
export type FailedThings = number;
export type RejectedThings = number;
export type QueuedThings = number;
export type InProgressThings = number;
export type RemovedThings = number;
export type TimedOutThings = number;
export type StringCommandExecutionResult = string;
export type BooleanCommandExecutionResult = boolean;
export type BinaryCommandExecutionResult = Uint8Array;
export type Code = string;
export type OTAUpdateErrorMessage = string;
export type RetryAttempt = number;
export type ConnectivityTimestamp = number;
export type DisconnectReason = string;
export type Platform = string;
export type CertificatePathOnDevice = string;
export type Signature = Uint8Array;
export type CertificateName = string;
export type InlineDocument = string;
export type PayloadFormatIndicator = string;
export type ContentType = string;
export type ResponseTopic = string;
export type CorrelationData = string;
export type MessageExpiry = string;
export type AssetPropertyEntryId = string;
export type AssetId = string;
export type AssetPropertyId = string;
export type AssetPropertyAlias = string;
export type TimestreamDimensionName = string;
export type TimestreamDimensionValue = string;
export type TimestreamTimestampValue = string;
export type TimestreamTimestampUnit = string;
export type HeaderKey = string;
export type HeaderValue = string;
export type MaxBatchOpenMs = number;
export type MaxBatchSize = number;
export type MaxBatchSizeBytes = number;
export type KafkaHeaderKey = string;
export type KafkaHeaderValue = string;
export type ResourceLogicalId = string;
export type MissingContextValue = string;
export type Prefix = string;
export type UserPropertyKey = string;
export type UserPropertyValue = string;
export type AssetPropertyQuality = string;
export type SigningRegion = string;
export type ServiceName = string;
export type IsAuthenticated = boolean;
export type PrincipalId = string;
export type Seconds = number;
export type AssetPropertyStringValue = string;
export type AssetPropertyIntegerValue = string;
export type AssetPropertyDoubleValue = string;
export type AssetPropertyBooleanValue = string;
export type AssetPropertyTimeInSeconds = string;
export type AssetPropertyOffsetInNanos = string;
export type BucketKeyValue = string;

//# Schemas
export interface ClearDefaultAuthorizerRequest {}
export const ClearDefaultAuthorizerRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/default-authorizer" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ClearDefaultAuthorizerRequest",
}) as any as S.Schema<ClearDefaultAuthorizerRequest>;
export interface ClearDefaultAuthorizerResponse {}
export const ClearDefaultAuthorizerResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ClearDefaultAuthorizerResponse",
}) as any as S.Schema<ClearDefaultAuthorizerResponse>;
export interface DeleteRegistrationCodeRequest {}
export const DeleteRegistrationCodeRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/registrationcode" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRegistrationCodeRequest",
}) as any as S.Schema<DeleteRegistrationCodeRequest>;
export interface DeleteRegistrationCodeResponse {}
export const DeleteRegistrationCodeResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRegistrationCodeResponse",
}) as any as S.Schema<DeleteRegistrationCodeResponse>;
export interface DescribeAccountAuditConfigurationRequest {}
export const DescribeAccountAuditConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/audit/configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAccountAuditConfigurationRequest",
}) as any as S.Schema<DescribeAccountAuditConfigurationRequest>;
export interface DescribeDefaultAuthorizerRequest {}
export const DescribeDefaultAuthorizerRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/default-authorizer" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDefaultAuthorizerRequest",
}) as any as S.Schema<DescribeDefaultAuthorizerRequest>;
export interface DescribeEncryptionConfigurationRequest {}
export const DescribeEncryptionConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/encryption-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeEncryptionConfigurationRequest",
}) as any as S.Schema<DescribeEncryptionConfigurationRequest>;
export interface DescribeEventConfigurationsRequest {}
export const DescribeEventConfigurationsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/event-configurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeEventConfigurationsRequest",
}) as any as S.Schema<DescribeEventConfigurationsRequest>;
export interface GetIndexingConfigurationRequest {}
export const GetIndexingConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/indexing/config" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIndexingConfigurationRequest",
}) as any as S.Schema<GetIndexingConfigurationRequest>;
export interface GetLoggingOptionsRequest {}
export const GetLoggingOptionsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/loggingOptions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLoggingOptionsRequest",
}) as any as S.Schema<GetLoggingOptionsRequest>;
export interface GetPackageConfigurationRequest {}
export const GetPackageConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/package-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPackageConfigurationRequest",
}) as any as S.Schema<GetPackageConfigurationRequest>;
export interface GetRegistrationCodeRequest {}
export const GetRegistrationCodeRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/registrationcode" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRegistrationCodeRequest",
}) as any as S.Schema<GetRegistrationCodeRequest>;
export type JobTargets = string[];
export const JobTargets = S.Array(S.String);
export type ThingPrincipalType = "EXCLUSIVE_THING" | "NON_EXCLUSIVE_THING";
export const ThingPrincipalType = S.Literal(
  "EXCLUSIVE_THING",
  "NON_EXCLUSIVE_THING",
);
export type AuthorizerStatus = "ACTIVE" | "INACTIVE";
export const AuthorizerStatus = S.Literal("ACTIVE", "INACTIVE");
export type CertificateProviderOperation = "CreateCertificateFromCsr";
export const CertificateProviderOperation = S.Literal(
  "CreateCertificateFromCsr",
);
export type CertificateProviderAccountDefaultForOperations =
  CertificateProviderOperation[];
export const CertificateProviderAccountDefaultForOperations = S.Array(
  CertificateProviderOperation,
);
export type CommandNamespace = "AWS-IoT" | "AWS-IoT-FleetWise";
export const CommandNamespace = S.Literal("AWS-IoT", "AWS-IoT-FleetWise");
export type CustomMetricType =
  | "string-list"
  | "ip-address-list"
  | "number-list"
  | "number";
export const CustomMetricType = S.Literal(
  "string-list",
  "ip-address-list",
  "number-list",
  "number",
);
export type DimensionType = "TOPIC_FILTER";
export const DimensionType = S.Literal("TOPIC_FILTER");
export type DimensionStringValues = string[];
export const DimensionStringValues = S.Array(S.String);
export type ServerCertificateArns = string[];
export const ServerCertificateArns = S.Array(S.String);
export type ServiceType = "DATA" | "CREDENTIAL_PROVIDER" | "JOBS";
export const ServiceType = S.Literal("DATA", "CREDENTIAL_PROVIDER", "JOBS");
export type AuthenticationType =
  | "CUSTOM_AUTH_X509"
  | "CUSTOM_AUTH"
  | "AWS_X509"
  | "AWS_SIGV4"
  | "DEFAULT";
export const AuthenticationType = S.Literal(
  "CUSTOM_AUTH_X509",
  "CUSTOM_AUTH",
  "AWS_X509",
  "AWS_SIGV4",
  "DEFAULT",
);
export type ApplicationProtocol =
  | "SECURE_MQTT"
  | "MQTT_WSS"
  | "HTTPS"
  | "DEFAULT";
export const ApplicationProtocol = S.Literal(
  "SECURE_MQTT",
  "MQTT_WSS",
  "HTTPS",
  "DEFAULT",
);
export type FleetMetricUnit =
  | "Seconds"
  | "Microseconds"
  | "Milliseconds"
  | "Bytes"
  | "Kilobytes"
  | "Megabytes"
  | "Gigabytes"
  | "Terabytes"
  | "Bits"
  | "Kilobits"
  | "Megabits"
  | "Gigabits"
  | "Terabits"
  | "Percent"
  | "Count"
  | "Bytes/Second"
  | "Kilobytes/Second"
  | "Megabytes/Second"
  | "Gigabytes/Second"
  | "Terabytes/Second"
  | "Bits/Second"
  | "Kilobits/Second"
  | "Megabits/Second"
  | "Gigabits/Second"
  | "Terabits/Second"
  | "Count/Second"
  | "None";
export const FleetMetricUnit = S.Literal(
  "Seconds",
  "Microseconds",
  "Milliseconds",
  "Bytes",
  "Kilobytes",
  "Megabytes",
  "Gigabytes",
  "Terabytes",
  "Bits",
  "Kilobits",
  "Megabits",
  "Gigabits",
  "Terabits",
  "Percent",
  "Count",
  "Bytes/Second",
  "Kilobytes/Second",
  "Megabytes/Second",
  "Gigabytes/Second",
  "Terabytes/Second",
  "Bits/Second",
  "Kilobits/Second",
  "Megabits/Second",
  "Gigabits/Second",
  "Terabits/Second",
  "Count/Second",
  "None",
);
export type TargetSelection = "CONTINUOUS" | "SNAPSHOT";
export const TargetSelection = S.Literal("CONTINUOUS", "SNAPSHOT");
export type DestinationPackageVersions = string[];
export const DestinationPackageVersions = S.Array(S.String);
export type Targets = string[];
export const Targets = S.Array(S.String);
export type Protocol = "MQTT" | "HTTP";
export const Protocol = S.Literal("MQTT", "HTTP");
export type Protocols = Protocol[];
export const Protocols = S.Array(Protocol);
export type TemplateType = "FLEET_PROVISIONING" | "JITP";
export const TemplateType = S.Literal("FLEET_PROVISIONING", "JITP");
export type AuditFrequency = "DAILY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY";
export const AuditFrequency = S.Literal(
  "DAILY",
  "WEEKLY",
  "BIWEEKLY",
  "MONTHLY",
);
export type DayOfWeek = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";
export const DayOfWeek = S.Literal(
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
);
export type TargetAuditCheckNames = string[];
export const TargetAuditCheckNames = S.Array(S.String);
export type AdditionalMetricsToRetainList = string[];
export const AdditionalMetricsToRetainList = S.Array(S.String);
export type LogTargetType =
  | "DEFAULT"
  | "THING_GROUP"
  | "CLIENT_ID"
  | "SOURCE_IP"
  | "PRINCIPAL_ID";
export const LogTargetType = S.Literal(
  "DEFAULT",
  "THING_GROUP",
  "CLIENT_ID",
  "SOURCE_IP",
  "PRINCIPAL_ID",
);
export type EncryptionType = "CUSTOMER_MANAGED_KMS_KEY" | "AWS_OWNED_KMS_KEY";
export const EncryptionType = S.Literal(
  "CUSTOMER_MANAGED_KMS_KEY",
  "AWS_OWNED_KMS_KEY",
);
export type LogLevel = "DEBUG" | "INFO" | "ERROR" | "WARN" | "DISABLED";
export const LogLevel = S.Literal("DEBUG", "INFO", "ERROR", "WARN", "DISABLED");
export type PercentList = number[];
export const PercentList = S.Array(S.Number);
export type BehaviorCriteriaType =
  | "STATIC"
  | "STATISTICAL"
  | "MACHINE_LEARNING";
export const BehaviorCriteriaType = S.Literal(
  "STATIC",
  "STATISTICAL",
  "MACHINE_LEARNING",
);
export type VerificationState =
  | "FALSE_POSITIVE"
  | "BENIGN_POSITIVE"
  | "TRUE_POSITIVE"
  | "UNKNOWN";
export const VerificationState = S.Literal(
  "FALSE_POSITIVE",
  "BENIGN_POSITIVE",
  "TRUE_POSITIVE",
  "UNKNOWN",
);
export type AuditMitigationActionsExecutionStatus =
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | "CANCELED"
  | "SKIPPED"
  | "PENDING";
export const AuditMitigationActionsExecutionStatus = S.Literal(
  "IN_PROGRESS",
  "COMPLETED",
  "FAILED",
  "CANCELED",
  "SKIPPED",
  "PENDING",
);
export type AuditMitigationActionsTaskStatus =
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | "CANCELED";
export const AuditMitigationActionsTaskStatus = S.Literal(
  "IN_PROGRESS",
  "COMPLETED",
  "FAILED",
  "CANCELED",
);
export type AuditTaskType = "ON_DEMAND_AUDIT_TASK" | "SCHEDULED_AUDIT_TASK";
export const AuditTaskType = S.Literal(
  "ON_DEMAND_AUDIT_TASK",
  "SCHEDULED_AUDIT_TASK",
);
export type AuditTaskStatus =
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | "CANCELED";
export const AuditTaskStatus = S.Literal(
  "IN_PROGRESS",
  "COMPLETED",
  "FAILED",
  "CANCELED",
);
export type CommandExecutionStatus =
  | "CREATED"
  | "IN_PROGRESS"
  | "SUCCEEDED"
  | "FAILED"
  | "REJECTED"
  | "TIMED_OUT";
export const CommandExecutionStatus = S.Literal(
  "CREATED",
  "IN_PROGRESS",
  "SUCCEEDED",
  "FAILED",
  "REJECTED",
  "TIMED_OUT",
);
export type SortOrder = "ASCENDING" | "DESCENDING";
export const SortOrder = S.Literal("ASCENDING", "DESCENDING");
export type JobExecutionStatus =
  | "QUEUED"
  | "IN_PROGRESS"
  | "SUCCEEDED"
  | "FAILED"
  | "TIMED_OUT"
  | "REJECTED"
  | "REMOVED"
  | "CANCELED";
export const JobExecutionStatus = S.Literal(
  "QUEUED",
  "IN_PROGRESS",
  "SUCCEEDED",
  "FAILED",
  "TIMED_OUT",
  "REJECTED",
  "REMOVED",
  "CANCELED",
);
export type JobStatus =
  | "IN_PROGRESS"
  | "CANCELED"
  | "COMPLETED"
  | "DELETION_IN_PROGRESS"
  | "SCHEDULED";
export const JobStatus = S.Literal(
  "IN_PROGRESS",
  "CANCELED",
  "COMPLETED",
  "DELETION_IN_PROGRESS",
  "SCHEDULED",
);
export type DimensionValueOperator = "IN" | "NOT_IN";
export const DimensionValueOperator = S.Literal("IN", "NOT_IN");
export type MitigationActionType =
  | "UPDATE_DEVICE_CERTIFICATE"
  | "UPDATE_CA_CERTIFICATE"
  | "ADD_THINGS_TO_THING_GROUP"
  | "REPLACE_DEFAULT_POLICY_VERSION"
  | "ENABLE_IOT_LOGGING"
  | "PUBLISH_FINDING_TO_SNS";
export const MitigationActionType = S.Literal(
  "UPDATE_DEVICE_CERTIFICATE",
  "UPDATE_CA_CERTIFICATE",
  "ADD_THINGS_TO_THING_GROUP",
  "REPLACE_DEFAULT_POLICY_VERSION",
  "ENABLE_IOT_LOGGING",
  "PUBLISH_FINDING_TO_SNS",
);
export type OTAUpdateStatus =
  | "CREATE_PENDING"
  | "CREATE_IN_PROGRESS"
  | "CREATE_COMPLETE"
  | "CREATE_FAILED"
  | "DELETE_IN_PROGRESS"
  | "DELETE_FAILED";
export const OTAUpdateStatus = S.Literal(
  "CREATE_PENDING",
  "CREATE_IN_PROGRESS",
  "CREATE_COMPLETE",
  "CREATE_FAILED",
  "DELETE_IN_PROGRESS",
  "DELETE_FAILED",
);
export type PackageVersionStatus = "DRAFT" | "PUBLISHED" | "DEPRECATED";
export const PackageVersionStatus = S.Literal(
  "DRAFT",
  "PUBLISHED",
  "DEPRECATED",
);
export type SbomValidationResult = "FAILED" | "SUCCEEDED";
export const SbomValidationResult = S.Literal("FAILED", "SUCCEEDED");
export type ReportType = "ERRORS" | "RESULTS";
export const ReportType = S.Literal("ERRORS", "RESULTS");
export type Status =
  | "InProgress"
  | "Completed"
  | "Failed"
  | "Cancelled"
  | "Cancelling";
export const Status = S.Literal(
  "InProgress",
  "Completed",
  "Failed",
  "Cancelled",
  "Cancelling",
);
export type CertificateMode = "DEFAULT" | "SNI_ONLY";
export const CertificateMode = S.Literal("DEFAULT", "SNI_ONLY");
export type CertificateStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "REVOKED"
  | "PENDING_TRANSFER"
  | "REGISTER_INACTIVE"
  | "PENDING_ACTIVATION";
export const CertificateStatus = S.Literal(
  "ACTIVE",
  "INACTIVE",
  "REVOKED",
  "PENDING_TRANSFER",
  "REGISTER_INACTIVE",
  "PENDING_ACTIVATION",
);
export type DetectMitigationActionsToExecuteList = string[];
export const DetectMitigationActionsToExecuteList = S.Array(S.String);
export type PolicyNames = string[];
export const PolicyNames = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type CACertificateStatus = "ACTIVE" | "INACTIVE";
export const CACertificateStatus = S.Literal("ACTIVE", "INACTIVE");
export type AutoRegistrationStatus = "ENABLE" | "DISABLE";
export const AutoRegistrationStatus = S.Literal("ENABLE", "DISABLE");
export type DomainConfigurationStatus = "ENABLED" | "DISABLED";
export const DomainConfigurationStatus = S.Literal("ENABLED", "DISABLED");
export type PackageVersionAction = "PUBLISH" | "DEPRECATE";
export const PackageVersionAction = S.Literal("PUBLISH", "DEPRECATE");
export type ThingGroupList = string[];
export const ThingGroupList = S.Array(S.String);
export type TopicRuleDestinationStatus =
  | "ENABLED"
  | "IN_PROGRESS"
  | "DISABLED"
  | "ERROR"
  | "DELETING";
export const TopicRuleDestinationStatus = S.Literal(
  "ENABLED",
  "IN_PROGRESS",
  "DISABLED",
  "ERROR",
  "DELETING",
);
export interface AcceptCertificateTransferRequest {
  certificateId: string;
  setAsActive?: boolean;
}
export const AcceptCertificateTransferRequest = S.suspend(() =>
  S.Struct({
    certificateId: S.String.pipe(T.HttpLabel("certificateId")),
    setAsActive: S.optional(S.Boolean).pipe(T.HttpQuery("setAsActive")),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/accept-certificate-transfer/{certificateId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AcceptCertificateTransferRequest",
}) as any as S.Schema<AcceptCertificateTransferRequest>;
export interface AcceptCertificateTransferResponse {}
export const AcceptCertificateTransferResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AcceptCertificateTransferResponse",
}) as any as S.Schema<AcceptCertificateTransferResponse>;
export interface AddThingToBillingGroupRequest {
  billingGroupName?: string;
  billingGroupArn?: string;
  thingName?: string;
  thingArn?: string;
}
export const AddThingToBillingGroupRequest = S.suspend(() =>
  S.Struct({
    billingGroupName: S.optional(S.String),
    billingGroupArn: S.optional(S.String),
    thingName: S.optional(S.String),
    thingArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/billing-groups/addThingToBillingGroup" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddThingToBillingGroupRequest",
}) as any as S.Schema<AddThingToBillingGroupRequest>;
export interface AddThingToBillingGroupResponse {}
export const AddThingToBillingGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AddThingToBillingGroupResponse",
}) as any as S.Schema<AddThingToBillingGroupResponse>;
export interface AddThingToThingGroupRequest {
  thingGroupName?: string;
  thingGroupArn?: string;
  thingName?: string;
  thingArn?: string;
  overrideDynamicGroups?: boolean;
}
export const AddThingToThingGroupRequest = S.suspend(() =>
  S.Struct({
    thingGroupName: S.optional(S.String),
    thingGroupArn: S.optional(S.String),
    thingName: S.optional(S.String),
    thingArn: S.optional(S.String),
    overrideDynamicGroups: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/thing-groups/addThingToThingGroup" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddThingToThingGroupRequest",
}) as any as S.Schema<AddThingToThingGroupRequest>;
export interface AddThingToThingGroupResponse {}
export const AddThingToThingGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AddThingToThingGroupResponse",
}) as any as S.Schema<AddThingToThingGroupResponse>;
export interface AssociateTargetsWithJobRequest {
  targets: string[];
  jobId: string;
  comment?: string;
  namespaceId?: string;
}
export const AssociateTargetsWithJobRequest = S.suspend(() =>
  S.Struct({
    targets: JobTargets,
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    comment: S.optional(S.String),
    namespaceId: S.optional(S.String).pipe(T.HttpQuery("namespaceId")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/jobs/{jobId}/targets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateTargetsWithJobRequest",
}) as any as S.Schema<AssociateTargetsWithJobRequest>;
export interface AttachPolicyRequest {
  policyName: string;
  target: string;
}
export const AttachPolicyRequest = S.suspend(() =>
  S.Struct({
    policyName: S.String.pipe(T.HttpLabel("policyName")),
    target: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/target-policies/{policyName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AttachPolicyRequest",
}) as any as S.Schema<AttachPolicyRequest>;
export interface AttachPolicyResponse {}
export const AttachPolicyResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "AttachPolicyResponse",
}) as any as S.Schema<AttachPolicyResponse>;
export interface AttachPrincipalPolicyRequest {
  policyName: string;
  principal: string;
}
export const AttachPrincipalPolicyRequest = S.suspend(() =>
  S.Struct({
    policyName: S.String.pipe(T.HttpLabel("policyName")),
    principal: S.String.pipe(T.HttpHeader("x-amzn-iot-principal")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/principal-policies/{policyName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AttachPrincipalPolicyRequest",
}) as any as S.Schema<AttachPrincipalPolicyRequest>;
export interface AttachPrincipalPolicyResponse {}
export const AttachPrincipalPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AttachPrincipalPolicyResponse",
}) as any as S.Schema<AttachPrincipalPolicyResponse>;
export interface AttachSecurityProfileRequest {
  securityProfileName: string;
  securityProfileTargetArn: string;
}
export const AttachSecurityProfileRequest = S.suspend(() =>
  S.Struct({
    securityProfileName: S.String.pipe(T.HttpLabel("securityProfileName")),
    securityProfileTargetArn: S.String.pipe(
      T.HttpQuery("securityProfileTargetArn"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/security-profiles/{securityProfileName}/targets",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AttachSecurityProfileRequest",
}) as any as S.Schema<AttachSecurityProfileRequest>;
export interface AttachSecurityProfileResponse {}
export const AttachSecurityProfileResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AttachSecurityProfileResponse",
}) as any as S.Schema<AttachSecurityProfileResponse>;
export interface AttachThingPrincipalRequest {
  thingName: string;
  principal: string;
  thingPrincipalType?: ThingPrincipalType;
}
export const AttachThingPrincipalRequest = S.suspend(() =>
  S.Struct({
    thingName: S.String.pipe(T.HttpLabel("thingName")),
    principal: S.String.pipe(T.HttpHeader("x-amzn-principal")),
    thingPrincipalType: S.optional(ThingPrincipalType).pipe(
      T.HttpQuery("thingPrincipalType"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/things/{thingName}/principals" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AttachThingPrincipalRequest",
}) as any as S.Schema<AttachThingPrincipalRequest>;
export interface AttachThingPrincipalResponse {}
export const AttachThingPrincipalResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AttachThingPrincipalResponse",
}) as any as S.Schema<AttachThingPrincipalResponse>;
export interface CancelAuditMitigationActionsTaskRequest {
  taskId: string;
}
export const CancelAuditMitigationActionsTaskRequest = S.suspend(() =>
  S.Struct({ taskId: S.String.pipe(T.HttpLabel("taskId")) }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/audit/mitigationactions/tasks/{taskId}/cancel",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelAuditMitigationActionsTaskRequest",
}) as any as S.Schema<CancelAuditMitigationActionsTaskRequest>;
export interface CancelAuditMitigationActionsTaskResponse {}
export const CancelAuditMitigationActionsTaskResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelAuditMitigationActionsTaskResponse",
}) as any as S.Schema<CancelAuditMitigationActionsTaskResponse>;
export interface CancelAuditTaskRequest {
  taskId: string;
}
export const CancelAuditTaskRequest = S.suspend(() =>
  S.Struct({ taskId: S.String.pipe(T.HttpLabel("taskId")) }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/audit/tasks/{taskId}/cancel" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelAuditTaskRequest",
}) as any as S.Schema<CancelAuditTaskRequest>;
export interface CancelAuditTaskResponse {}
export const CancelAuditTaskResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelAuditTaskResponse",
}) as any as S.Schema<CancelAuditTaskResponse>;
export interface CancelCertificateTransferRequest {
  certificateId: string;
}
export const CancelCertificateTransferRequest = S.suspend(() =>
  S.Struct({ certificateId: S.String.pipe(T.HttpLabel("certificateId")) }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/cancel-certificate-transfer/{certificateId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelCertificateTransferRequest",
}) as any as S.Schema<CancelCertificateTransferRequest>;
export interface CancelCertificateTransferResponse {}
export const CancelCertificateTransferResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelCertificateTransferResponse",
}) as any as S.Schema<CancelCertificateTransferResponse>;
export interface CancelDetectMitigationActionsTaskRequest {
  taskId: string;
}
export const CancelDetectMitigationActionsTaskRequest = S.suspend(() =>
  S.Struct({ taskId: S.String.pipe(T.HttpLabel("taskId")) }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/detect/mitigationactions/tasks/{taskId}/cancel",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelDetectMitigationActionsTaskRequest",
}) as any as S.Schema<CancelDetectMitigationActionsTaskRequest>;
export interface CancelDetectMitigationActionsTaskResponse {}
export const CancelDetectMitigationActionsTaskResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelDetectMitigationActionsTaskResponse",
}) as any as S.Schema<CancelDetectMitigationActionsTaskResponse>;
export interface CancelJobRequest {
  jobId: string;
  reasonCode?: string;
  comment?: string;
  force?: boolean;
}
export const CancelJobRequest = S.suspend(() =>
  S.Struct({
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    reasonCode: S.optional(S.String),
    comment: S.optional(S.String),
    force: S.optional(S.Boolean).pipe(T.HttpQuery("force")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/jobs/{jobId}/cancel" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelJobRequest",
}) as any as S.Schema<CancelJobRequest>;
export interface ConfirmTopicRuleDestinationRequest {
  confirmationToken: string;
}
export const ConfirmTopicRuleDestinationRequest = S.suspend(() =>
  S.Struct({
    confirmationToken: S.String.pipe(T.HttpLabel("confirmationToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/confirmdestination/{confirmationToken+}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ConfirmTopicRuleDestinationRequest",
}) as any as S.Schema<ConfirmTopicRuleDestinationRequest>;
export interface ConfirmTopicRuleDestinationResponse {}
export const ConfirmTopicRuleDestinationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ConfirmTopicRuleDestinationResponse",
}) as any as S.Schema<ConfirmTopicRuleDestinationResponse>;
export interface CreateCertificateFromCsrRequest {
  certificateSigningRequest: string;
  setAsActive?: boolean;
}
export const CreateCertificateFromCsrRequest = S.suspend(() =>
  S.Struct({
    certificateSigningRequest: S.String,
    setAsActive: S.optional(S.Boolean).pipe(T.HttpQuery("setAsActive")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/certificates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCertificateFromCsrRequest",
}) as any as S.Schema<CreateCertificateFromCsrRequest>;
export interface Tag {
  Key: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateCertificateProviderRequest {
  certificateProviderName: string;
  lambdaFunctionArn: string;
  accountDefaultForOperations: CertificateProviderOperation[];
  clientToken?: string;
  tags?: Tag[];
}
export const CreateCertificateProviderRequest = S.suspend(() =>
  S.Struct({
    certificateProviderName: S.String.pipe(
      T.HttpLabel("certificateProviderName"),
    ),
    lambdaFunctionArn: S.String,
    accountDefaultForOperations: CertificateProviderAccountDefaultForOperations,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/certificate-providers/{certificateProviderName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCertificateProviderRequest",
}) as any as S.Schema<CreateCertificateProviderRequest>;
export interface CreateCustomMetricRequest {
  metricName: string;
  displayName?: string;
  metricType: CustomMetricType;
  tags?: Tag[];
  clientRequestToken: string;
}
export const CreateCustomMetricRequest = S.suspend(() =>
  S.Struct({
    metricName: S.String.pipe(T.HttpLabel("metricName")),
    displayName: S.optional(S.String),
    metricType: CustomMetricType,
    tags: S.optional(TagList),
    clientRequestToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/custom-metric/{metricName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCustomMetricRequest",
}) as any as S.Schema<CreateCustomMetricRequest>;
export interface CreateDimensionRequest {
  name: string;
  type: DimensionType;
  stringValues: string[];
  tags?: Tag[];
  clientRequestToken: string;
}
export const CreateDimensionRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    type: DimensionType,
    stringValues: DimensionStringValues,
    tags: S.optional(TagList),
    clientRequestToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/dimensions/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDimensionRequest",
}) as any as S.Schema<CreateDimensionRequest>;
export interface CreateKeysAndCertificateRequest {
  setAsActive?: boolean;
}
export const CreateKeysAndCertificateRequest = S.suspend(() =>
  S.Struct({
    setAsActive: S.optional(S.Boolean).pipe(T.HttpQuery("setAsActive")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/keys-and-certificate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateKeysAndCertificateRequest",
}) as any as S.Schema<CreateKeysAndCertificateRequest>;
export interface CreatePolicyRequest {
  policyName: string;
  policyDocument: string;
  tags?: Tag[];
}
export const CreatePolicyRequest = S.suspend(() =>
  S.Struct({
    policyName: S.String.pipe(T.HttpLabel("policyName")),
    policyDocument: S.String,
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/policies/{policyName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePolicyRequest",
}) as any as S.Schema<CreatePolicyRequest>;
export interface CreatePolicyVersionRequest {
  policyName: string;
  policyDocument: string;
  setAsDefault?: boolean;
}
export const CreatePolicyVersionRequest = S.suspend(() =>
  S.Struct({
    policyName: S.String.pipe(T.HttpLabel("policyName")),
    policyDocument: S.String,
    setAsDefault: S.optional(S.Boolean).pipe(T.HttpQuery("setAsDefault")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/policies/{policyName}/version" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePolicyVersionRequest",
}) as any as S.Schema<CreatePolicyVersionRequest>;
export interface CreateProvisioningClaimRequest {
  templateName: string;
}
export const CreateProvisioningClaimRequest = S.suspend(() =>
  S.Struct({ templateName: S.String.pipe(T.HttpLabel("templateName")) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/provisioning-templates/{templateName}/provisioning-claim",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProvisioningClaimRequest",
}) as any as S.Schema<CreateProvisioningClaimRequest>;
export interface CreateProvisioningTemplateVersionRequest {
  templateName: string;
  templateBody: string;
  setAsDefault?: boolean;
}
export const CreateProvisioningTemplateVersionRequest = S.suspend(() =>
  S.Struct({
    templateName: S.String.pipe(T.HttpLabel("templateName")),
    templateBody: S.String,
    setAsDefault: S.optional(S.Boolean).pipe(T.HttpQuery("setAsDefault")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/provisioning-templates/{templateName}/versions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProvisioningTemplateVersionRequest",
}) as any as S.Schema<CreateProvisioningTemplateVersionRequest>;
export interface CreateRoleAliasRequest {
  roleAlias: string;
  roleArn: string;
  credentialDurationSeconds?: number;
  tags?: Tag[];
}
export const CreateRoleAliasRequest = S.suspend(() =>
  S.Struct({
    roleAlias: S.String.pipe(T.HttpLabel("roleAlias")),
    roleArn: S.String,
    credentialDurationSeconds: S.optional(S.Number),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/role-aliases/{roleAlias}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRoleAliasRequest",
}) as any as S.Schema<CreateRoleAliasRequest>;
export interface CreateScheduledAuditRequest {
  frequency: AuditFrequency;
  dayOfMonth?: string;
  dayOfWeek?: DayOfWeek;
  targetCheckNames: string[];
  scheduledAuditName: string;
  tags?: Tag[];
}
export const CreateScheduledAuditRequest = S.suspend(() =>
  S.Struct({
    frequency: AuditFrequency,
    dayOfMonth: S.optional(S.String),
    dayOfWeek: S.optional(DayOfWeek),
    targetCheckNames: TargetAuditCheckNames,
    scheduledAuditName: S.String.pipe(T.HttpLabel("scheduledAuditName")),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/audit/scheduledaudits/{scheduledAuditName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateScheduledAuditRequest",
}) as any as S.Schema<CreateScheduledAuditRequest>;
export type Attributes = { [key: string]: string };
export const Attributes = S.Record({ key: S.String, value: S.String });
export interface AttributePayload {
  attributes?: { [key: string]: string };
  merge?: boolean;
}
export const AttributePayload = S.suspend(() =>
  S.Struct({
    attributes: S.optional(Attributes),
    merge: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AttributePayload",
}) as any as S.Schema<AttributePayload>;
export interface ThingGroupProperties {
  thingGroupDescription?: string;
  attributePayload?: AttributePayload;
}
export const ThingGroupProperties = S.suspend(() =>
  S.Struct({
    thingGroupDescription: S.optional(S.String),
    attributePayload: S.optional(AttributePayload),
  }),
).annotations({
  identifier: "ThingGroupProperties",
}) as any as S.Schema<ThingGroupProperties>;
export interface CreateThingGroupRequest {
  thingGroupName: string;
  parentGroupName?: string;
  thingGroupProperties?: ThingGroupProperties;
  tags?: Tag[];
}
export const CreateThingGroupRequest = S.suspend(() =>
  S.Struct({
    thingGroupName: S.String.pipe(T.HttpLabel("thingGroupName")),
    parentGroupName: S.optional(S.String),
    thingGroupProperties: S.optional(ThingGroupProperties),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/thing-groups/{thingGroupName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateThingGroupRequest",
}) as any as S.Schema<CreateThingGroupRequest>;
export interface DeleteAccountAuditConfigurationRequest {
  deleteScheduledAudits?: boolean;
}
export const DeleteAccountAuditConfigurationRequest = S.suspend(() =>
  S.Struct({
    deleteScheduledAudits: S.optional(S.Boolean).pipe(
      T.HttpQuery("deleteScheduledAudits"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/audit/configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAccountAuditConfigurationRequest",
}) as any as S.Schema<DeleteAccountAuditConfigurationRequest>;
export interface DeleteAccountAuditConfigurationResponse {}
export const DeleteAccountAuditConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAccountAuditConfigurationResponse",
}) as any as S.Schema<DeleteAccountAuditConfigurationResponse>;
export interface PolicyVersionIdentifier {
  policyName?: string;
  policyVersionId?: string;
}
export const PolicyVersionIdentifier = S.suspend(() =>
  S.Struct({
    policyName: S.optional(S.String),
    policyVersionId: S.optional(S.String),
  }),
).annotations({
  identifier: "PolicyVersionIdentifier",
}) as any as S.Schema<PolicyVersionIdentifier>;
export interface IssuerCertificateIdentifier {
  issuerCertificateSubject?: string;
  issuerId?: string;
  issuerCertificateSerialNumber?: string;
}
export const IssuerCertificateIdentifier = S.suspend(() =>
  S.Struct({
    issuerCertificateSubject: S.optional(S.String),
    issuerId: S.optional(S.String),
    issuerCertificateSerialNumber: S.optional(S.String),
  }),
).annotations({
  identifier: "IssuerCertificateIdentifier",
}) as any as S.Schema<IssuerCertificateIdentifier>;
export interface ResourceIdentifier {
  deviceCertificateId?: string;
  caCertificateId?: string;
  cognitoIdentityPoolId?: string;
  clientId?: string;
  policyVersionIdentifier?: PolicyVersionIdentifier;
  account?: string;
  iamRoleArn?: string;
  roleAliasArn?: string;
  issuerCertificateIdentifier?: IssuerCertificateIdentifier;
  deviceCertificateArn?: string;
}
export const ResourceIdentifier = S.suspend(() =>
  S.Struct({
    deviceCertificateId: S.optional(S.String),
    caCertificateId: S.optional(S.String),
    cognitoIdentityPoolId: S.optional(S.String),
    clientId: S.optional(S.String),
    policyVersionIdentifier: S.optional(PolicyVersionIdentifier),
    account: S.optional(S.String),
    iamRoleArn: S.optional(S.String),
    roleAliasArn: S.optional(S.String),
    issuerCertificateIdentifier: S.optional(IssuerCertificateIdentifier),
    deviceCertificateArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceIdentifier",
}) as any as S.Schema<ResourceIdentifier>;
export interface DeleteAuditSuppressionRequest {
  checkName: string;
  resourceIdentifier: ResourceIdentifier;
}
export const DeleteAuditSuppressionRequest = S.suspend(() =>
  S.Struct({
    checkName: S.String,
    resourceIdentifier: ResourceIdentifier,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/audit/suppressions/delete" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAuditSuppressionRequest",
}) as any as S.Schema<DeleteAuditSuppressionRequest>;
export interface DeleteAuditSuppressionResponse {}
export const DeleteAuditSuppressionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAuditSuppressionResponse",
}) as any as S.Schema<DeleteAuditSuppressionResponse>;
export interface DeleteAuthorizerRequest {
  authorizerName: string;
}
export const DeleteAuthorizerRequest = S.suspend(() =>
  S.Struct({
    authorizerName: S.String.pipe(T.HttpLabel("authorizerName")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/authorizer/{authorizerName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAuthorizerRequest",
}) as any as S.Schema<DeleteAuthorizerRequest>;
export interface DeleteAuthorizerResponse {}
export const DeleteAuthorizerResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAuthorizerResponse",
}) as any as S.Schema<DeleteAuthorizerResponse>;
export interface DeleteBillingGroupRequest {
  billingGroupName: string;
  expectedVersion?: number;
}
export const DeleteBillingGroupRequest = S.suspend(() =>
  S.Struct({
    billingGroupName: S.String.pipe(T.HttpLabel("billingGroupName")),
    expectedVersion: S.optional(S.Number).pipe(T.HttpQuery("expectedVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/billing-groups/{billingGroupName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBillingGroupRequest",
}) as any as S.Schema<DeleteBillingGroupRequest>;
export interface DeleteBillingGroupResponse {}
export const DeleteBillingGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteBillingGroupResponse",
}) as any as S.Schema<DeleteBillingGroupResponse>;
export interface DeleteCACertificateRequest {
  certificateId: string;
}
export const DeleteCACertificateRequest = S.suspend(() =>
  S.Struct({ certificateId: S.String.pipe(T.HttpLabel("certificateId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/cacertificate/{certificateId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCACertificateRequest",
}) as any as S.Schema<DeleteCACertificateRequest>;
export interface DeleteCACertificateResponse {}
export const DeleteCACertificateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCACertificateResponse",
}) as any as S.Schema<DeleteCACertificateResponse>;
export interface DeleteCertificateRequest {
  certificateId: string;
  forceDelete?: boolean;
}
export const DeleteCertificateRequest = S.suspend(() =>
  S.Struct({
    certificateId: S.String.pipe(T.HttpLabel("certificateId")),
    forceDelete: S.optional(S.Boolean).pipe(T.HttpQuery("forceDelete")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/certificates/{certificateId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCertificateRequest",
}) as any as S.Schema<DeleteCertificateRequest>;
export interface DeleteCertificateResponse {}
export const DeleteCertificateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCertificateResponse",
}) as any as S.Schema<DeleteCertificateResponse>;
export interface DeleteCertificateProviderRequest {
  certificateProviderName: string;
}
export const DeleteCertificateProviderRequest = S.suspend(() =>
  S.Struct({
    certificateProviderName: S.String.pipe(
      T.HttpLabel("certificateProviderName"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/certificate-providers/{certificateProviderName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCertificateProviderRequest",
}) as any as S.Schema<DeleteCertificateProviderRequest>;
export interface DeleteCertificateProviderResponse {}
export const DeleteCertificateProviderResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCertificateProviderResponse",
}) as any as S.Schema<DeleteCertificateProviderResponse>;
export interface DeleteCommandRequest {
  commandId: string;
}
export const DeleteCommandRequest = S.suspend(() =>
  S.Struct({ commandId: S.String.pipe(T.HttpLabel("commandId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/commands/{commandId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCommandRequest",
}) as any as S.Schema<DeleteCommandRequest>;
export interface DeleteCommandExecutionRequest {
  executionId: string;
  targetArn: string;
}
export const DeleteCommandExecutionRequest = S.suspend(() =>
  S.Struct({
    executionId: S.String.pipe(T.HttpLabel("executionId")),
    targetArn: S.String.pipe(T.HttpQuery("targetArn")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/command-executions/{executionId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCommandExecutionRequest",
}) as any as S.Schema<DeleteCommandExecutionRequest>;
export interface DeleteCommandExecutionResponse {}
export const DeleteCommandExecutionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCommandExecutionResponse",
}) as any as S.Schema<DeleteCommandExecutionResponse>;
export interface DeleteCustomMetricRequest {
  metricName: string;
}
export const DeleteCustomMetricRequest = S.suspend(() =>
  S.Struct({ metricName: S.String.pipe(T.HttpLabel("metricName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/custom-metric/{metricName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCustomMetricRequest",
}) as any as S.Schema<DeleteCustomMetricRequest>;
export interface DeleteCustomMetricResponse {}
export const DeleteCustomMetricResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCustomMetricResponse",
}) as any as S.Schema<DeleteCustomMetricResponse>;
export interface DeleteDimensionRequest {
  name: string;
}
export const DeleteDimensionRequest = S.suspend(() =>
  S.Struct({ name: S.String.pipe(T.HttpLabel("name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/dimensions/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDimensionRequest",
}) as any as S.Schema<DeleteDimensionRequest>;
export interface DeleteDimensionResponse {}
export const DeleteDimensionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDimensionResponse",
}) as any as S.Schema<DeleteDimensionResponse>;
export interface DeleteDomainConfigurationRequest {
  domainConfigurationName: string;
}
export const DeleteDomainConfigurationRequest = S.suspend(() =>
  S.Struct({
    domainConfigurationName: S.String.pipe(
      T.HttpLabel("domainConfigurationName"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/domainConfigurations/{domainConfigurationName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDomainConfigurationRequest",
}) as any as S.Schema<DeleteDomainConfigurationRequest>;
export interface DeleteDomainConfigurationResponse {}
export const DeleteDomainConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDomainConfigurationResponse",
}) as any as S.Schema<DeleteDomainConfigurationResponse>;
export interface DeleteDynamicThingGroupRequest {
  thingGroupName: string;
  expectedVersion?: number;
}
export const DeleteDynamicThingGroupRequest = S.suspend(() =>
  S.Struct({
    thingGroupName: S.String.pipe(T.HttpLabel("thingGroupName")),
    expectedVersion: S.optional(S.Number).pipe(T.HttpQuery("expectedVersion")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/dynamic-thing-groups/{thingGroupName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDynamicThingGroupRequest",
}) as any as S.Schema<DeleteDynamicThingGroupRequest>;
export interface DeleteDynamicThingGroupResponse {}
export const DeleteDynamicThingGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDynamicThingGroupResponse",
}) as any as S.Schema<DeleteDynamicThingGroupResponse>;
export interface DeleteFleetMetricRequest {
  metricName: string;
  expectedVersion?: number;
}
export const DeleteFleetMetricRequest = S.suspend(() =>
  S.Struct({
    metricName: S.String.pipe(T.HttpLabel("metricName")),
    expectedVersion: S.optional(S.Number).pipe(T.HttpQuery("expectedVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/fleet-metric/{metricName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFleetMetricRequest",
}) as any as S.Schema<DeleteFleetMetricRequest>;
export interface DeleteFleetMetricResponse {}
export const DeleteFleetMetricResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteFleetMetricResponse",
}) as any as S.Schema<DeleteFleetMetricResponse>;
export interface DeleteJobRequest {
  jobId: string;
  force?: boolean;
  namespaceId?: string;
}
export const DeleteJobRequest = S.suspend(() =>
  S.Struct({
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    force: S.optional(S.Boolean).pipe(T.HttpQuery("force")),
    namespaceId: S.optional(S.String).pipe(T.HttpQuery("namespaceId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/jobs/{jobId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteJobRequest",
}) as any as S.Schema<DeleteJobRequest>;
export interface DeleteJobResponse {}
export const DeleteJobResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteJobResponse",
}) as any as S.Schema<DeleteJobResponse>;
export interface DeleteJobExecutionRequest {
  jobId: string;
  thingName: string;
  executionNumber: number;
  force?: boolean;
  namespaceId?: string;
}
export const DeleteJobExecutionRequest = S.suspend(() =>
  S.Struct({
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    thingName: S.String.pipe(T.HttpLabel("thingName")),
    executionNumber: S.Number.pipe(T.HttpLabel("executionNumber")),
    force: S.optional(S.Boolean).pipe(T.HttpQuery("force")),
    namespaceId: S.optional(S.String).pipe(T.HttpQuery("namespaceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/things/{thingName}/jobs/{jobId}/executionNumber/{executionNumber}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteJobExecutionRequest",
}) as any as S.Schema<DeleteJobExecutionRequest>;
export interface DeleteJobExecutionResponse {}
export const DeleteJobExecutionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteJobExecutionResponse",
}) as any as S.Schema<DeleteJobExecutionResponse>;
export interface DeleteJobTemplateRequest {
  jobTemplateId: string;
}
export const DeleteJobTemplateRequest = S.suspend(() =>
  S.Struct({ jobTemplateId: S.String.pipe(T.HttpLabel("jobTemplateId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/job-templates/{jobTemplateId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteJobTemplateRequest",
}) as any as S.Schema<DeleteJobTemplateRequest>;
export interface DeleteJobTemplateResponse {}
export const DeleteJobTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteJobTemplateResponse",
}) as any as S.Schema<DeleteJobTemplateResponse>;
export interface DeleteMitigationActionRequest {
  actionName: string;
}
export const DeleteMitigationActionRequest = S.suspend(() =>
  S.Struct({ actionName: S.String.pipe(T.HttpLabel("actionName")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/mitigationactions/actions/{actionName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMitigationActionRequest",
}) as any as S.Schema<DeleteMitigationActionRequest>;
export interface DeleteMitigationActionResponse {}
export const DeleteMitigationActionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteMitigationActionResponse",
}) as any as S.Schema<DeleteMitigationActionResponse>;
export interface DeleteOTAUpdateRequest {
  otaUpdateId: string;
  deleteStream?: boolean;
  forceDeleteAWSJob?: boolean;
}
export const DeleteOTAUpdateRequest = S.suspend(() =>
  S.Struct({
    otaUpdateId: S.String.pipe(T.HttpLabel("otaUpdateId")),
    deleteStream: S.optional(S.Boolean).pipe(T.HttpQuery("deleteStream")),
    forceDeleteAWSJob: S.optional(S.Boolean).pipe(
      T.HttpQuery("forceDeleteAWSJob"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/otaUpdates/{otaUpdateId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteOTAUpdateRequest",
}) as any as S.Schema<DeleteOTAUpdateRequest>;
export interface DeleteOTAUpdateResponse {}
export const DeleteOTAUpdateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteOTAUpdateResponse",
}) as any as S.Schema<DeleteOTAUpdateResponse>;
export interface DeletePackageRequest {
  packageName: string;
  clientToken?: string;
}
export const DeletePackageRequest = S.suspend(() =>
  S.Struct({
    packageName: S.String.pipe(T.HttpLabel("packageName")),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/packages/{packageName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePackageRequest",
}) as any as S.Schema<DeletePackageRequest>;
export interface DeletePackageResponse {}
export const DeletePackageResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeletePackageResponse",
}) as any as S.Schema<DeletePackageResponse>;
export interface DeletePackageVersionRequest {
  packageName: string;
  versionName: string;
  clientToken?: string;
}
export const DeletePackageVersionRequest = S.suspend(() =>
  S.Struct({
    packageName: S.String.pipe(T.HttpLabel("packageName")),
    versionName: S.String.pipe(T.HttpLabel("versionName")),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/packages/{packageName}/versions/{versionName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePackageVersionRequest",
}) as any as S.Schema<DeletePackageVersionRequest>;
export interface DeletePackageVersionResponse {}
export const DeletePackageVersionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePackageVersionResponse",
}) as any as S.Schema<DeletePackageVersionResponse>;
export interface DeletePolicyRequest {
  policyName: string;
}
export const DeletePolicyRequest = S.suspend(() =>
  S.Struct({ policyName: S.String.pipe(T.HttpLabel("policyName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/policies/{policyName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePolicyRequest",
}) as any as S.Schema<DeletePolicyRequest>;
export interface DeletePolicyResponse {}
export const DeletePolicyResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeletePolicyResponse",
}) as any as S.Schema<DeletePolicyResponse>;
export interface DeletePolicyVersionRequest {
  policyName: string;
  policyVersionId: string;
}
export const DeletePolicyVersionRequest = S.suspend(() =>
  S.Struct({
    policyName: S.String.pipe(T.HttpLabel("policyName")),
    policyVersionId: S.String.pipe(T.HttpLabel("policyVersionId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/policies/{policyName}/version/{policyVersionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePolicyVersionRequest",
}) as any as S.Schema<DeletePolicyVersionRequest>;
export interface DeletePolicyVersionResponse {}
export const DeletePolicyVersionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePolicyVersionResponse",
}) as any as S.Schema<DeletePolicyVersionResponse>;
export interface DeleteProvisioningTemplateRequest {
  templateName: string;
}
export const DeleteProvisioningTemplateRequest = S.suspend(() =>
  S.Struct({ templateName: S.String.pipe(T.HttpLabel("templateName")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/provisioning-templates/{templateName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProvisioningTemplateRequest",
}) as any as S.Schema<DeleteProvisioningTemplateRequest>;
export interface DeleteProvisioningTemplateResponse {}
export const DeleteProvisioningTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteProvisioningTemplateResponse",
}) as any as S.Schema<DeleteProvisioningTemplateResponse>;
export interface DeleteProvisioningTemplateVersionRequest {
  templateName: string;
  versionId: number;
}
export const DeleteProvisioningTemplateVersionRequest = S.suspend(() =>
  S.Struct({
    templateName: S.String.pipe(T.HttpLabel("templateName")),
    versionId: S.Number.pipe(T.HttpLabel("versionId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/provisioning-templates/{templateName}/versions/{versionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProvisioningTemplateVersionRequest",
}) as any as S.Schema<DeleteProvisioningTemplateVersionRequest>;
export interface DeleteProvisioningTemplateVersionResponse {}
export const DeleteProvisioningTemplateVersionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteProvisioningTemplateVersionResponse",
}) as any as S.Schema<DeleteProvisioningTemplateVersionResponse>;
export interface DeleteRoleAliasRequest {
  roleAlias: string;
}
export const DeleteRoleAliasRequest = S.suspend(() =>
  S.Struct({ roleAlias: S.String.pipe(T.HttpLabel("roleAlias")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/role-aliases/{roleAlias}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRoleAliasRequest",
}) as any as S.Schema<DeleteRoleAliasRequest>;
export interface DeleteRoleAliasResponse {}
export const DeleteRoleAliasResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRoleAliasResponse",
}) as any as S.Schema<DeleteRoleAliasResponse>;
export interface DeleteScheduledAuditRequest {
  scheduledAuditName: string;
}
export const DeleteScheduledAuditRequest = S.suspend(() =>
  S.Struct({
    scheduledAuditName: S.String.pipe(T.HttpLabel("scheduledAuditName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/audit/scheduledaudits/{scheduledAuditName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteScheduledAuditRequest",
}) as any as S.Schema<DeleteScheduledAuditRequest>;
export interface DeleteScheduledAuditResponse {}
export const DeleteScheduledAuditResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteScheduledAuditResponse",
}) as any as S.Schema<DeleteScheduledAuditResponse>;
export interface DeleteSecurityProfileRequest {
  securityProfileName: string;
  expectedVersion?: number;
}
export const DeleteSecurityProfileRequest = S.suspend(() =>
  S.Struct({
    securityProfileName: S.String.pipe(T.HttpLabel("securityProfileName")),
    expectedVersion: S.optional(S.Number).pipe(T.HttpQuery("expectedVersion")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/security-profiles/{securityProfileName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSecurityProfileRequest",
}) as any as S.Schema<DeleteSecurityProfileRequest>;
export interface DeleteSecurityProfileResponse {}
export const DeleteSecurityProfileResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSecurityProfileResponse",
}) as any as S.Schema<DeleteSecurityProfileResponse>;
export interface DeleteStreamRequest {
  streamId: string;
}
export const DeleteStreamRequest = S.suspend(() =>
  S.Struct({ streamId: S.String.pipe(T.HttpLabel("streamId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/streams/{streamId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteStreamRequest",
}) as any as S.Schema<DeleteStreamRequest>;
export interface DeleteStreamResponse {}
export const DeleteStreamResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteStreamResponse",
}) as any as S.Schema<DeleteStreamResponse>;
export interface DeleteThingRequest {
  thingName: string;
  expectedVersion?: number;
}
export const DeleteThingRequest = S.suspend(() =>
  S.Struct({
    thingName: S.String.pipe(T.HttpLabel("thingName")),
    expectedVersion: S.optional(S.Number).pipe(T.HttpQuery("expectedVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/things/{thingName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteThingRequest",
}) as any as S.Schema<DeleteThingRequest>;
export interface DeleteThingResponse {}
export const DeleteThingResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteThingResponse",
}) as any as S.Schema<DeleteThingResponse>;
export interface DeleteThingGroupRequest {
  thingGroupName: string;
  expectedVersion?: number;
}
export const DeleteThingGroupRequest = S.suspend(() =>
  S.Struct({
    thingGroupName: S.String.pipe(T.HttpLabel("thingGroupName")),
    expectedVersion: S.optional(S.Number).pipe(T.HttpQuery("expectedVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/thing-groups/{thingGroupName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteThingGroupRequest",
}) as any as S.Schema<DeleteThingGroupRequest>;
export interface DeleteThingGroupResponse {}
export const DeleteThingGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteThingGroupResponse",
}) as any as S.Schema<DeleteThingGroupResponse>;
export interface DeleteThingTypeRequest {
  thingTypeName: string;
}
export const DeleteThingTypeRequest = S.suspend(() =>
  S.Struct({ thingTypeName: S.String.pipe(T.HttpLabel("thingTypeName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/thing-types/{thingTypeName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteThingTypeRequest",
}) as any as S.Schema<DeleteThingTypeRequest>;
export interface DeleteThingTypeResponse {}
export const DeleteThingTypeResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteThingTypeResponse",
}) as any as S.Schema<DeleteThingTypeResponse>;
export interface DeleteTopicRuleRequest {
  ruleName: string;
}
export const DeleteTopicRuleRequest = S.suspend(() =>
  S.Struct({ ruleName: S.String.pipe(T.HttpLabel("ruleName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/rules/{ruleName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTopicRuleRequest",
}) as any as S.Schema<DeleteTopicRuleRequest>;
export interface DeleteTopicRuleResponse {}
export const DeleteTopicRuleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTopicRuleResponse",
}) as any as S.Schema<DeleteTopicRuleResponse>;
export interface DeleteTopicRuleDestinationRequest {
  arn: string;
}
export const DeleteTopicRuleDestinationRequest = S.suspend(() =>
  S.Struct({ arn: S.String.pipe(T.HttpLabel("arn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/destinations/{arn+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTopicRuleDestinationRequest",
}) as any as S.Schema<DeleteTopicRuleDestinationRequest>;
export interface DeleteTopicRuleDestinationResponse {}
export const DeleteTopicRuleDestinationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTopicRuleDestinationResponse",
}) as any as S.Schema<DeleteTopicRuleDestinationResponse>;
export interface DeleteV2LoggingLevelRequest {
  targetType: LogTargetType;
  targetName: string;
}
export const DeleteV2LoggingLevelRequest = S.suspend(() =>
  S.Struct({
    targetType: LogTargetType.pipe(T.HttpQuery("targetType")),
    targetName: S.String.pipe(T.HttpQuery("targetName")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v2LoggingLevel" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteV2LoggingLevelRequest",
}) as any as S.Schema<DeleteV2LoggingLevelRequest>;
export interface DeleteV2LoggingLevelResponse {}
export const DeleteV2LoggingLevelResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteV2LoggingLevelResponse",
}) as any as S.Schema<DeleteV2LoggingLevelResponse>;
export interface DeprecateThingTypeRequest {
  thingTypeName: string;
  undoDeprecate?: boolean;
}
export const DeprecateThingTypeRequest = S.suspend(() =>
  S.Struct({
    thingTypeName: S.String.pipe(T.HttpLabel("thingTypeName")),
    undoDeprecate: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/thing-types/{thingTypeName}/deprecate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeprecateThingTypeRequest",
}) as any as S.Schema<DeprecateThingTypeRequest>;
export interface DeprecateThingTypeResponse {}
export const DeprecateThingTypeResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeprecateThingTypeResponse",
}) as any as S.Schema<DeprecateThingTypeResponse>;
export interface DescribeAuditFindingRequest {
  findingId: string;
}
export const DescribeAuditFindingRequest = S.suspend(() =>
  S.Struct({ findingId: S.String.pipe(T.HttpLabel("findingId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/audit/findings/{findingId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAuditFindingRequest",
}) as any as S.Schema<DescribeAuditFindingRequest>;
export interface DescribeAuditMitigationActionsTaskRequest {
  taskId: string;
}
export const DescribeAuditMitigationActionsTaskRequest = S.suspend(() =>
  S.Struct({ taskId: S.String.pipe(T.HttpLabel("taskId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/audit/mitigationactions/tasks/{taskId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAuditMitigationActionsTaskRequest",
}) as any as S.Schema<DescribeAuditMitigationActionsTaskRequest>;
export interface DescribeAuditSuppressionRequest {
  checkName: string;
  resourceIdentifier: ResourceIdentifier;
}
export const DescribeAuditSuppressionRequest = S.suspend(() =>
  S.Struct({
    checkName: S.String,
    resourceIdentifier: ResourceIdentifier,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/audit/suppressions/describe" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAuditSuppressionRequest",
}) as any as S.Schema<DescribeAuditSuppressionRequest>;
export interface DescribeAuditTaskRequest {
  taskId: string;
}
export const DescribeAuditTaskRequest = S.suspend(() =>
  S.Struct({ taskId: S.String.pipe(T.HttpLabel("taskId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/audit/tasks/{taskId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAuditTaskRequest",
}) as any as S.Schema<DescribeAuditTaskRequest>;
export interface DescribeAuthorizerRequest {
  authorizerName: string;
}
export const DescribeAuthorizerRequest = S.suspend(() =>
  S.Struct({
    authorizerName: S.String.pipe(T.HttpLabel("authorizerName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/authorizer/{authorizerName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAuthorizerRequest",
}) as any as S.Schema<DescribeAuthorizerRequest>;
export interface DescribeBillingGroupRequest {
  billingGroupName: string;
}
export const DescribeBillingGroupRequest = S.suspend(() =>
  S.Struct({
    billingGroupName: S.String.pipe(T.HttpLabel("billingGroupName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/billing-groups/{billingGroupName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeBillingGroupRequest",
}) as any as S.Schema<DescribeBillingGroupRequest>;
export interface DescribeCACertificateRequest {
  certificateId: string;
}
export const DescribeCACertificateRequest = S.suspend(() =>
  S.Struct({ certificateId: S.String.pipe(T.HttpLabel("certificateId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/cacertificate/{certificateId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeCACertificateRequest",
}) as any as S.Schema<DescribeCACertificateRequest>;
export interface DescribeCertificateRequest {
  certificateId: string;
}
export const DescribeCertificateRequest = S.suspend(() =>
  S.Struct({ certificateId: S.String.pipe(T.HttpLabel("certificateId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/certificates/{certificateId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeCertificateRequest",
}) as any as S.Schema<DescribeCertificateRequest>;
export interface DescribeCertificateProviderRequest {
  certificateProviderName: string;
}
export const DescribeCertificateProviderRequest = S.suspend(() =>
  S.Struct({
    certificateProviderName: S.String.pipe(
      T.HttpLabel("certificateProviderName"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/certificate-providers/{certificateProviderName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeCertificateProviderRequest",
}) as any as S.Schema<DescribeCertificateProviderRequest>;
export interface DescribeCustomMetricRequest {
  metricName: string;
}
export const DescribeCustomMetricRequest = S.suspend(() =>
  S.Struct({ metricName: S.String.pipe(T.HttpLabel("metricName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/custom-metric/{metricName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeCustomMetricRequest",
}) as any as S.Schema<DescribeCustomMetricRequest>;
export interface DescribeDetectMitigationActionsTaskRequest {
  taskId: string;
}
export const DescribeDetectMitigationActionsTaskRequest = S.suspend(() =>
  S.Struct({ taskId: S.String.pipe(T.HttpLabel("taskId")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/detect/mitigationactions/tasks/{taskId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDetectMitigationActionsTaskRequest",
}) as any as S.Schema<DescribeDetectMitigationActionsTaskRequest>;
export interface DescribeDimensionRequest {
  name: string;
}
export const DescribeDimensionRequest = S.suspend(() =>
  S.Struct({ name: S.String.pipe(T.HttpLabel("name")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/dimensions/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDimensionRequest",
}) as any as S.Schema<DescribeDimensionRequest>;
export interface DescribeDomainConfigurationRequest {
  domainConfigurationName: string;
}
export const DescribeDomainConfigurationRequest = S.suspend(() =>
  S.Struct({
    domainConfigurationName: S.String.pipe(
      T.HttpLabel("domainConfigurationName"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domainConfigurations/{domainConfigurationName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDomainConfigurationRequest",
}) as any as S.Schema<DescribeDomainConfigurationRequest>;
export interface DescribeEndpointRequest {
  endpointType?: string;
}
export const DescribeEndpointRequest = S.suspend(() =>
  S.Struct({
    endpointType: S.optional(S.String).pipe(T.HttpQuery("endpointType")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/endpoint" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeEndpointRequest",
}) as any as S.Schema<DescribeEndpointRequest>;
export interface DescribeFleetMetricRequest {
  metricName: string;
}
export const DescribeFleetMetricRequest = S.suspend(() =>
  S.Struct({ metricName: S.String.pipe(T.HttpLabel("metricName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/fleet-metric/{metricName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeFleetMetricRequest",
}) as any as S.Schema<DescribeFleetMetricRequest>;
export interface DescribeIndexRequest {
  indexName: string;
}
export const DescribeIndexRequest = S.suspend(() =>
  S.Struct({ indexName: S.String.pipe(T.HttpLabel("indexName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/indices/{indexName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeIndexRequest",
}) as any as S.Schema<DescribeIndexRequest>;
export interface DescribeJobRequest {
  jobId: string;
  beforeSubstitution?: boolean;
}
export const DescribeJobRequest = S.suspend(() =>
  S.Struct({
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    beforeSubstitution: S.optional(S.Boolean).pipe(
      T.HttpQuery("beforeSubstitution"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/jobs/{jobId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeJobRequest",
}) as any as S.Schema<DescribeJobRequest>;
export interface DescribeJobExecutionRequest {
  jobId: string;
  thingName: string;
  executionNumber?: number;
}
export const DescribeJobExecutionRequest = S.suspend(() =>
  S.Struct({
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    thingName: S.String.pipe(T.HttpLabel("thingName")),
    executionNumber: S.optional(S.Number).pipe(T.HttpQuery("executionNumber")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/things/{thingName}/jobs/{jobId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeJobExecutionRequest",
}) as any as S.Schema<DescribeJobExecutionRequest>;
export interface DescribeJobTemplateRequest {
  jobTemplateId: string;
}
export const DescribeJobTemplateRequest = S.suspend(() =>
  S.Struct({ jobTemplateId: S.String.pipe(T.HttpLabel("jobTemplateId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/job-templates/{jobTemplateId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeJobTemplateRequest",
}) as any as S.Schema<DescribeJobTemplateRequest>;
export interface DescribeManagedJobTemplateRequest {
  templateName: string;
  templateVersion?: string;
}
export const DescribeManagedJobTemplateRequest = S.suspend(() =>
  S.Struct({
    templateName: S.String.pipe(T.HttpLabel("templateName")),
    templateVersion: S.optional(S.String).pipe(T.HttpQuery("templateVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/managed-job-templates/{templateName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeManagedJobTemplateRequest",
}) as any as S.Schema<DescribeManagedJobTemplateRequest>;
export interface DescribeMitigationActionRequest {
  actionName: string;
}
export const DescribeMitigationActionRequest = S.suspend(() =>
  S.Struct({ actionName: S.String.pipe(T.HttpLabel("actionName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/mitigationactions/actions/{actionName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeMitigationActionRequest",
}) as any as S.Schema<DescribeMitigationActionRequest>;
export interface DescribeProvisioningTemplateRequest {
  templateName: string;
}
export const DescribeProvisioningTemplateRequest = S.suspend(() =>
  S.Struct({ templateName: S.String.pipe(T.HttpLabel("templateName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/provisioning-templates/{templateName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeProvisioningTemplateRequest",
}) as any as S.Schema<DescribeProvisioningTemplateRequest>;
export interface DescribeProvisioningTemplateVersionRequest {
  templateName: string;
  versionId: number;
}
export const DescribeProvisioningTemplateVersionRequest = S.suspend(() =>
  S.Struct({
    templateName: S.String.pipe(T.HttpLabel("templateName")),
    versionId: S.Number.pipe(T.HttpLabel("versionId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/provisioning-templates/{templateName}/versions/{versionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeProvisioningTemplateVersionRequest",
}) as any as S.Schema<DescribeProvisioningTemplateVersionRequest>;
export interface DescribeRoleAliasRequest {
  roleAlias: string;
}
export const DescribeRoleAliasRequest = S.suspend(() =>
  S.Struct({ roleAlias: S.String.pipe(T.HttpLabel("roleAlias")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/role-aliases/{roleAlias}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRoleAliasRequest",
}) as any as S.Schema<DescribeRoleAliasRequest>;
export interface DescribeScheduledAuditRequest {
  scheduledAuditName: string;
}
export const DescribeScheduledAuditRequest = S.suspend(() =>
  S.Struct({
    scheduledAuditName: S.String.pipe(T.HttpLabel("scheduledAuditName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/audit/scheduledaudits/{scheduledAuditName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeScheduledAuditRequest",
}) as any as S.Schema<DescribeScheduledAuditRequest>;
export interface DescribeSecurityProfileRequest {
  securityProfileName: string;
}
export const DescribeSecurityProfileRequest = S.suspend(() =>
  S.Struct({
    securityProfileName: S.String.pipe(T.HttpLabel("securityProfileName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/security-profiles/{securityProfileName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSecurityProfileRequest",
}) as any as S.Schema<DescribeSecurityProfileRequest>;
export interface DescribeStreamRequest {
  streamId: string;
}
export const DescribeStreamRequest = S.suspend(() =>
  S.Struct({ streamId: S.String.pipe(T.HttpLabel("streamId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/streams/{streamId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeStreamRequest",
}) as any as S.Schema<DescribeStreamRequest>;
export interface DescribeThingRequest {
  thingName: string;
}
export const DescribeThingRequest = S.suspend(() =>
  S.Struct({ thingName: S.String.pipe(T.HttpLabel("thingName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/things/{thingName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeThingRequest",
}) as any as S.Schema<DescribeThingRequest>;
export interface DescribeThingGroupRequest {
  thingGroupName: string;
}
export const DescribeThingGroupRequest = S.suspend(() =>
  S.Struct({
    thingGroupName: S.String.pipe(T.HttpLabel("thingGroupName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/thing-groups/{thingGroupName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeThingGroupRequest",
}) as any as S.Schema<DescribeThingGroupRequest>;
export interface DescribeThingRegistrationTaskRequest {
  taskId: string;
}
export const DescribeThingRegistrationTaskRequest = S.suspend(() =>
  S.Struct({ taskId: S.String.pipe(T.HttpLabel("taskId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/thing-registration-tasks/{taskId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeThingRegistrationTaskRequest",
}) as any as S.Schema<DescribeThingRegistrationTaskRequest>;
export interface DescribeThingTypeRequest {
  thingTypeName: string;
}
export const DescribeThingTypeRequest = S.suspend(() =>
  S.Struct({ thingTypeName: S.String.pipe(T.HttpLabel("thingTypeName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/thing-types/{thingTypeName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeThingTypeRequest",
}) as any as S.Schema<DescribeThingTypeRequest>;
export interface DetachPolicyRequest {
  policyName: string;
  target: string;
}
export const DetachPolicyRequest = S.suspend(() =>
  S.Struct({
    policyName: S.String.pipe(T.HttpLabel("policyName")),
    target: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/target-policies/{policyName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DetachPolicyRequest",
}) as any as S.Schema<DetachPolicyRequest>;
export interface DetachPolicyResponse {}
export const DetachPolicyResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DetachPolicyResponse",
}) as any as S.Schema<DetachPolicyResponse>;
export interface DetachPrincipalPolicyRequest {
  policyName: string;
  principal: string;
}
export const DetachPrincipalPolicyRequest = S.suspend(() =>
  S.Struct({
    policyName: S.String.pipe(T.HttpLabel("policyName")),
    principal: S.String.pipe(T.HttpHeader("x-amzn-iot-principal")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/principal-policies/{policyName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DetachPrincipalPolicyRequest",
}) as any as S.Schema<DetachPrincipalPolicyRequest>;
export interface DetachPrincipalPolicyResponse {}
export const DetachPrincipalPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DetachPrincipalPolicyResponse",
}) as any as S.Schema<DetachPrincipalPolicyResponse>;
export interface DetachSecurityProfileRequest {
  securityProfileName: string;
  securityProfileTargetArn: string;
}
export const DetachSecurityProfileRequest = S.suspend(() =>
  S.Struct({
    securityProfileName: S.String.pipe(T.HttpLabel("securityProfileName")),
    securityProfileTargetArn: S.String.pipe(
      T.HttpQuery("securityProfileTargetArn"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/security-profiles/{securityProfileName}/targets",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DetachSecurityProfileRequest",
}) as any as S.Schema<DetachSecurityProfileRequest>;
export interface DetachSecurityProfileResponse {}
export const DetachSecurityProfileResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DetachSecurityProfileResponse",
}) as any as S.Schema<DetachSecurityProfileResponse>;
export interface DetachThingPrincipalRequest {
  thingName: string;
  principal: string;
}
export const DetachThingPrincipalRequest = S.suspend(() =>
  S.Struct({
    thingName: S.String.pipe(T.HttpLabel("thingName")),
    principal: S.String.pipe(T.HttpHeader("x-amzn-principal")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/things/{thingName}/principals" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DetachThingPrincipalRequest",
}) as any as S.Schema<DetachThingPrincipalRequest>;
export interface DetachThingPrincipalResponse {}
export const DetachThingPrincipalResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DetachThingPrincipalResponse",
}) as any as S.Schema<DetachThingPrincipalResponse>;
export interface DisableTopicRuleRequest {
  ruleName: string;
}
export const DisableTopicRuleRequest = S.suspend(() =>
  S.Struct({ ruleName: S.String.pipe(T.HttpLabel("ruleName")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/rules/{ruleName}/disable" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableTopicRuleRequest",
}) as any as S.Schema<DisableTopicRuleRequest>;
export interface DisableTopicRuleResponse {}
export const DisableTopicRuleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisableTopicRuleResponse",
}) as any as S.Schema<DisableTopicRuleResponse>;
export interface DisassociateSbomFromPackageVersionRequest {
  packageName: string;
  versionName: string;
  clientToken?: string;
}
export const DisassociateSbomFromPackageVersionRequest = S.suspend(() =>
  S.Struct({
    packageName: S.String.pipe(T.HttpLabel("packageName")),
    versionName: S.String.pipe(T.HttpLabel("versionName")),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/packages/{packageName}/versions/{versionName}/sbom",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateSbomFromPackageVersionRequest",
}) as any as S.Schema<DisassociateSbomFromPackageVersionRequest>;
export interface DisassociateSbomFromPackageVersionResponse {}
export const DisassociateSbomFromPackageVersionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateSbomFromPackageVersionResponse",
}) as any as S.Schema<DisassociateSbomFromPackageVersionResponse>;
export interface EnableTopicRuleRequest {
  ruleName: string;
}
export const EnableTopicRuleRequest = S.suspend(() =>
  S.Struct({ ruleName: S.String.pipe(T.HttpLabel("ruleName")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/rules/{ruleName}/enable" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableTopicRuleRequest",
}) as any as S.Schema<EnableTopicRuleRequest>;
export interface EnableTopicRuleResponse {}
export const EnableTopicRuleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "EnableTopicRuleResponse",
}) as any as S.Schema<EnableTopicRuleResponse>;
export interface GetBehaviorModelTrainingSummariesRequest {
  securityProfileName?: string;
  maxResults?: number;
  nextToken?: string;
}
export const GetBehaviorModelTrainingSummariesRequest = S.suspend(() =>
  S.Struct({
    securityProfileName: S.optional(S.String).pipe(
      T.HttpQuery("securityProfileName"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/behavior-model-training/summaries" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBehaviorModelTrainingSummariesRequest",
}) as any as S.Schema<GetBehaviorModelTrainingSummariesRequest>;
export interface GetCardinalityRequest {
  indexName?: string;
  queryString: string;
  aggregationField?: string;
  queryVersion?: string;
}
export const GetCardinalityRequest = S.suspend(() =>
  S.Struct({
    indexName: S.optional(S.String),
    queryString: S.String,
    aggregationField: S.optional(S.String),
    queryVersion: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/indices/cardinality" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCardinalityRequest",
}) as any as S.Schema<GetCardinalityRequest>;
export interface GetCommandRequest {
  commandId: string;
}
export const GetCommandRequest = S.suspend(() =>
  S.Struct({ commandId: S.String.pipe(T.HttpLabel("commandId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/commands/{commandId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCommandRequest",
}) as any as S.Schema<GetCommandRequest>;
export interface GetCommandExecutionRequest {
  executionId: string;
  targetArn: string;
  includeResult?: boolean;
}
export const GetCommandExecutionRequest = S.suspend(() =>
  S.Struct({
    executionId: S.String.pipe(T.HttpLabel("executionId")),
    targetArn: S.String.pipe(T.HttpQuery("targetArn")),
    includeResult: S.optional(S.Boolean).pipe(T.HttpQuery("includeResult")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/command-executions/{executionId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCommandExecutionRequest",
}) as any as S.Schema<GetCommandExecutionRequest>;
export interface GetEffectivePoliciesRequest {
  principal?: string;
  cognitoIdentityPoolId?: string;
  thingName?: string;
}
export const GetEffectivePoliciesRequest = S.suspend(() =>
  S.Struct({
    principal: S.optional(S.String),
    cognitoIdentityPoolId: S.optional(S.String),
    thingName: S.optional(S.String).pipe(T.HttpQuery("thingName")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/effective-policies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEffectivePoliciesRequest",
}) as any as S.Schema<GetEffectivePoliciesRequest>;
export interface GetJobDocumentRequest {
  jobId: string;
  beforeSubstitution?: boolean;
}
export const GetJobDocumentRequest = S.suspend(() =>
  S.Struct({
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    beforeSubstitution: S.optional(S.Boolean).pipe(
      T.HttpQuery("beforeSubstitution"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/jobs/{jobId}/job-document" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetJobDocumentRequest",
}) as any as S.Schema<GetJobDocumentRequest>;
export interface GetLoggingOptionsResponse {
  roleArn?: string;
  logLevel?: LogLevel;
}
export const GetLoggingOptionsResponse = S.suspend(() =>
  S.Struct({ roleArn: S.optional(S.String), logLevel: S.optional(LogLevel) }),
).annotations({
  identifier: "GetLoggingOptionsResponse",
}) as any as S.Schema<GetLoggingOptionsResponse>;
export interface GetOTAUpdateRequest {
  otaUpdateId: string;
}
export const GetOTAUpdateRequest = S.suspend(() =>
  S.Struct({ otaUpdateId: S.String.pipe(T.HttpLabel("otaUpdateId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/otaUpdates/{otaUpdateId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOTAUpdateRequest",
}) as any as S.Schema<GetOTAUpdateRequest>;
export interface GetPackageRequest {
  packageName: string;
}
export const GetPackageRequest = S.suspend(() =>
  S.Struct({ packageName: S.String.pipe(T.HttpLabel("packageName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/packages/{packageName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPackageRequest",
}) as any as S.Schema<GetPackageRequest>;
export interface GetPackageVersionRequest {
  packageName: string;
  versionName: string;
}
export const GetPackageVersionRequest = S.suspend(() =>
  S.Struct({
    packageName: S.String.pipe(T.HttpLabel("packageName")),
    versionName: S.String.pipe(T.HttpLabel("versionName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/packages/{packageName}/versions/{versionName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPackageVersionRequest",
}) as any as S.Schema<GetPackageVersionRequest>;
export interface GetPercentilesRequest {
  indexName?: string;
  queryString: string;
  aggregationField?: string;
  queryVersion?: string;
  percents?: number[];
}
export const GetPercentilesRequest = S.suspend(() =>
  S.Struct({
    indexName: S.optional(S.String),
    queryString: S.String,
    aggregationField: S.optional(S.String),
    queryVersion: S.optional(S.String),
    percents: S.optional(PercentList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/indices/percentiles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPercentilesRequest",
}) as any as S.Schema<GetPercentilesRequest>;
export interface GetPolicyRequest {
  policyName: string;
}
export const GetPolicyRequest = S.suspend(() =>
  S.Struct({ policyName: S.String.pipe(T.HttpLabel("policyName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/policies/{policyName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPolicyRequest",
}) as any as S.Schema<GetPolicyRequest>;
export interface GetPolicyVersionRequest {
  policyName: string;
  policyVersionId: string;
}
export const GetPolicyVersionRequest = S.suspend(() =>
  S.Struct({
    policyName: S.String.pipe(T.HttpLabel("policyName")),
    policyVersionId: S.String.pipe(T.HttpLabel("policyVersionId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/policies/{policyName}/version/{policyVersionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPolicyVersionRequest",
}) as any as S.Schema<GetPolicyVersionRequest>;
export interface GetRegistrationCodeResponse {
  registrationCode?: string;
}
export const GetRegistrationCodeResponse = S.suspend(() =>
  S.Struct({ registrationCode: S.optional(S.String) }),
).annotations({
  identifier: "GetRegistrationCodeResponse",
}) as any as S.Schema<GetRegistrationCodeResponse>;
export interface GetStatisticsRequest {
  indexName?: string;
  queryString: string;
  aggregationField?: string;
  queryVersion?: string;
}
export const GetStatisticsRequest = S.suspend(() =>
  S.Struct({
    indexName: S.optional(S.String),
    queryString: S.String,
    aggregationField: S.optional(S.String),
    queryVersion: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/indices/statistics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetStatisticsRequest",
}) as any as S.Schema<GetStatisticsRequest>;
export interface GetThingConnectivityDataRequest {
  thingName: string | redacted.Redacted<string>;
}
export const GetThingConnectivityDataRequest = S.suspend(() =>
  S.Struct({ thingName: SensitiveString.pipe(T.HttpLabel("thingName")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/things/{thingName}/connectivity-data" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetThingConnectivityDataRequest",
}) as any as S.Schema<GetThingConnectivityDataRequest>;
export interface GetTopicRuleRequest {
  ruleName: string;
}
export const GetTopicRuleRequest = S.suspend(() =>
  S.Struct({ ruleName: S.String.pipe(T.HttpLabel("ruleName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/rules/{ruleName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTopicRuleRequest",
}) as any as S.Schema<GetTopicRuleRequest>;
export interface GetTopicRuleDestinationRequest {
  arn: string;
}
export const GetTopicRuleDestinationRequest = S.suspend(() =>
  S.Struct({ arn: S.String.pipe(T.HttpLabel("arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/destinations/{arn+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTopicRuleDestinationRequest",
}) as any as S.Schema<GetTopicRuleDestinationRequest>;
export interface GetV2LoggingOptionsRequest {
  verbose?: boolean;
}
export const GetV2LoggingOptionsRequest = S.suspend(() =>
  S.Struct({
    verbose: S.optional(S.Boolean).pipe(T.HttpQuery("verbose")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2LoggingOptions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetV2LoggingOptionsRequest",
}) as any as S.Schema<GetV2LoggingOptionsRequest>;
export interface ListActiveViolationsRequest {
  thingName?: string;
  securityProfileName?: string;
  behaviorCriteriaType?: BehaviorCriteriaType;
  listSuppressedAlerts?: boolean;
  verificationState?: VerificationState;
  nextToken?: string;
  maxResults?: number;
}
export const ListActiveViolationsRequest = S.suspend(() =>
  S.Struct({
    thingName: S.optional(S.String).pipe(T.HttpQuery("thingName")),
    securityProfileName: S.optional(S.String).pipe(
      T.HttpQuery("securityProfileName"),
    ),
    behaviorCriteriaType: S.optional(BehaviorCriteriaType).pipe(
      T.HttpQuery("behaviorCriteriaType"),
    ),
    listSuppressedAlerts: S.optional(S.Boolean).pipe(
      T.HttpQuery("listSuppressedAlerts"),
    ),
    verificationState: S.optional(VerificationState).pipe(
      T.HttpQuery("verificationState"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/active-violations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListActiveViolationsRequest",
}) as any as S.Schema<ListActiveViolationsRequest>;
export interface ListAttachedPoliciesRequest {
  target: string;
  recursive?: boolean;
  marker?: string;
  pageSize?: number;
}
export const ListAttachedPoliciesRequest = S.suspend(() =>
  S.Struct({
    target: S.String.pipe(T.HttpLabel("target")),
    recursive: S.optional(S.Boolean).pipe(T.HttpQuery("recursive")),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/attached-policies/{target}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAttachedPoliciesRequest",
}) as any as S.Schema<ListAttachedPoliciesRequest>;
export interface ListAuditFindingsRequest {
  taskId?: string;
  checkName?: string;
  resourceIdentifier?: ResourceIdentifier;
  maxResults?: number;
  nextToken?: string;
  startTime?: Date;
  endTime?: Date;
  listSuppressedFindings?: boolean;
}
export const ListAuditFindingsRequest = S.suspend(() =>
  S.Struct({
    taskId: S.optional(S.String),
    checkName: S.optional(S.String),
    resourceIdentifier: S.optional(ResourceIdentifier),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    listSuppressedFindings: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/audit/findings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAuditFindingsRequest",
}) as any as S.Schema<ListAuditFindingsRequest>;
export interface ListAuditMitigationActionsExecutionsRequest {
  taskId: string;
  actionStatus?: AuditMitigationActionsExecutionStatus;
  findingId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListAuditMitigationActionsExecutionsRequest = S.suspend(() =>
  S.Struct({
    taskId: S.String.pipe(T.HttpQuery("taskId")),
    actionStatus: S.optional(AuditMitigationActionsExecutionStatus).pipe(
      T.HttpQuery("actionStatus"),
    ),
    findingId: S.String.pipe(T.HttpQuery("findingId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/audit/mitigationactions/executions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAuditMitigationActionsExecutionsRequest",
}) as any as S.Schema<ListAuditMitigationActionsExecutionsRequest>;
export interface ListAuditMitigationActionsTasksRequest {
  auditTaskId?: string;
  findingId?: string;
  taskStatus?: AuditMitigationActionsTaskStatus;
  maxResults?: number;
  nextToken?: string;
  startTime: Date;
  endTime: Date;
}
export const ListAuditMitigationActionsTasksRequest = S.suspend(() =>
  S.Struct({
    auditTaskId: S.optional(S.String).pipe(T.HttpQuery("auditTaskId")),
    findingId: S.optional(S.String).pipe(T.HttpQuery("findingId")),
    taskStatus: S.optional(AuditMitigationActionsTaskStatus).pipe(
      T.HttpQuery("taskStatus"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("endTime"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/audit/mitigationactions/tasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAuditMitigationActionsTasksRequest",
}) as any as S.Schema<ListAuditMitigationActionsTasksRequest>;
export interface ListAuditSuppressionsRequest {
  checkName?: string;
  resourceIdentifier?: ResourceIdentifier;
  ascendingOrder?: boolean;
  nextToken?: string;
  maxResults?: number;
}
export const ListAuditSuppressionsRequest = S.suspend(() =>
  S.Struct({
    checkName: S.optional(S.String),
    resourceIdentifier: S.optional(ResourceIdentifier),
    ascendingOrder: S.optional(S.Boolean),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/audit/suppressions/list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAuditSuppressionsRequest",
}) as any as S.Schema<ListAuditSuppressionsRequest>;
export interface ListAuditTasksRequest {
  startTime: Date;
  endTime: Date;
  taskType?: AuditTaskType;
  taskStatus?: AuditTaskStatus;
  nextToken?: string;
  maxResults?: number;
}
export const ListAuditTasksRequest = S.suspend(() =>
  S.Struct({
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("endTime"),
    ),
    taskType: S.optional(AuditTaskType).pipe(T.HttpQuery("taskType")),
    taskStatus: S.optional(AuditTaskStatus).pipe(T.HttpQuery("taskStatus")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/audit/tasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAuditTasksRequest",
}) as any as S.Schema<ListAuditTasksRequest>;
export interface ListAuthorizersRequest {
  pageSize?: number;
  marker?: string;
  ascendingOrder?: boolean;
  status?: AuthorizerStatus;
}
export const ListAuthorizersRequest = S.suspend(() =>
  S.Struct({
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    ascendingOrder: S.optional(S.Boolean).pipe(T.HttpQuery("isAscendingOrder")),
    status: S.optional(AuthorizerStatus).pipe(T.HttpQuery("status")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/authorizers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAuthorizersRequest",
}) as any as S.Schema<ListAuthorizersRequest>;
export interface ListBillingGroupsRequest {
  nextToken?: string;
  maxResults?: number;
  namePrefixFilter?: string;
}
export const ListBillingGroupsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    namePrefixFilter: S.optional(S.String).pipe(
      T.HttpQuery("namePrefixFilter"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/billing-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBillingGroupsRequest",
}) as any as S.Schema<ListBillingGroupsRequest>;
export interface ListCACertificatesRequest {
  pageSize?: number;
  marker?: string;
  ascendingOrder?: boolean;
  templateName?: string;
}
export const ListCACertificatesRequest = S.suspend(() =>
  S.Struct({
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    ascendingOrder: S.optional(S.Boolean).pipe(T.HttpQuery("isAscendingOrder")),
    templateName: S.optional(S.String).pipe(T.HttpQuery("templateName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/cacertificates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCACertificatesRequest",
}) as any as S.Schema<ListCACertificatesRequest>;
export interface ListCertificateProvidersRequest {
  nextToken?: string;
  ascendingOrder?: boolean;
}
export const ListCertificateProvidersRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    ascendingOrder: S.optional(S.Boolean).pipe(T.HttpQuery("isAscendingOrder")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/certificate-providers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCertificateProvidersRequest",
}) as any as S.Schema<ListCertificateProvidersRequest>;
export interface ListCertificatesRequest {
  pageSize?: number;
  marker?: string;
  ascendingOrder?: boolean;
}
export const ListCertificatesRequest = S.suspend(() =>
  S.Struct({
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    ascendingOrder: S.optional(S.Boolean).pipe(T.HttpQuery("isAscendingOrder")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/certificates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCertificatesRequest",
}) as any as S.Schema<ListCertificatesRequest>;
export interface ListCertificatesByCARequest {
  caCertificateId: string;
  pageSize?: number;
  marker?: string;
  ascendingOrder?: boolean;
}
export const ListCertificatesByCARequest = S.suspend(() =>
  S.Struct({
    caCertificateId: S.String.pipe(T.HttpLabel("caCertificateId")),
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    ascendingOrder: S.optional(S.Boolean).pipe(T.HttpQuery("isAscendingOrder")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/certificates-by-ca/{caCertificateId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCertificatesByCARequest",
}) as any as S.Schema<ListCertificatesByCARequest>;
export interface ListCommandsRequest {
  maxResults?: number;
  nextToken?: string;
  namespace?: CommandNamespace;
  commandParameterName?: string;
  sortOrder?: SortOrder;
}
export const ListCommandsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    namespace: S.optional(CommandNamespace).pipe(T.HttpQuery("namespace")),
    commandParameterName: S.optional(S.String).pipe(
      T.HttpQuery("commandParameterName"),
    ),
    sortOrder: S.optional(SortOrder).pipe(T.HttpQuery("sortOrder")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/commands" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCommandsRequest",
}) as any as S.Schema<ListCommandsRequest>;
export interface ListCustomMetricsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListCustomMetricsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/custom-metrics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCustomMetricsRequest",
}) as any as S.Schema<ListCustomMetricsRequest>;
export interface ListDetectMitigationActionsExecutionsRequest {
  taskId?: string;
  violationId?: string;
  thingName?: string;
  startTime?: Date;
  endTime?: Date;
  maxResults?: number;
  nextToken?: string;
}
export const ListDetectMitigationActionsExecutionsRequest = S.suspend(() =>
  S.Struct({
    taskId: S.optional(S.String).pipe(T.HttpQuery("taskId")),
    violationId: S.optional(S.String).pipe(T.HttpQuery("violationId")),
    thingName: S.optional(S.String).pipe(T.HttpQuery("thingName")),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("endTime"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/detect/mitigationactions/executions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDetectMitigationActionsExecutionsRequest",
}) as any as S.Schema<ListDetectMitigationActionsExecutionsRequest>;
export interface ListDetectMitigationActionsTasksRequest {
  maxResults?: number;
  nextToken?: string;
  startTime: Date;
  endTime: Date;
}
export const ListDetectMitigationActionsTasksRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("endTime"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/detect/mitigationactions/tasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDetectMitigationActionsTasksRequest",
}) as any as S.Schema<ListDetectMitigationActionsTasksRequest>;
export interface ListDimensionsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListDimensionsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/dimensions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDimensionsRequest",
}) as any as S.Schema<ListDimensionsRequest>;
export interface ListDomainConfigurationsRequest {
  marker?: string;
  pageSize?: number;
  serviceType?: ServiceType;
}
export const ListDomainConfigurationsRequest = S.suspend(() =>
  S.Struct({
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
    serviceType: S.optional(ServiceType).pipe(T.HttpQuery("serviceType")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/domainConfigurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDomainConfigurationsRequest",
}) as any as S.Schema<ListDomainConfigurationsRequest>;
export interface ListFleetMetricsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListFleetMetricsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/fleet-metrics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFleetMetricsRequest",
}) as any as S.Schema<ListFleetMetricsRequest>;
export interface ListIndicesRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListIndicesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/indices" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIndicesRequest",
}) as any as S.Schema<ListIndicesRequest>;
export interface ListJobExecutionsForJobRequest {
  jobId: string;
  status?: JobExecutionStatus;
  maxResults?: number;
  nextToken?: string;
}
export const ListJobExecutionsForJobRequest = S.suspend(() =>
  S.Struct({
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    status: S.optional(JobExecutionStatus).pipe(T.HttpQuery("status")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/jobs/{jobId}/things" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListJobExecutionsForJobRequest",
}) as any as S.Schema<ListJobExecutionsForJobRequest>;
export interface ListJobExecutionsForThingRequest {
  thingName: string;
  status?: JobExecutionStatus;
  namespaceId?: string;
  maxResults?: number;
  nextToken?: string;
  jobId?: string;
}
export const ListJobExecutionsForThingRequest = S.suspend(() =>
  S.Struct({
    thingName: S.String.pipe(T.HttpLabel("thingName")),
    status: S.optional(JobExecutionStatus).pipe(T.HttpQuery("status")),
    namespaceId: S.optional(S.String).pipe(T.HttpQuery("namespaceId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    jobId: S.optional(S.String).pipe(T.HttpQuery("jobId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/things/{thingName}/jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListJobExecutionsForThingRequest",
}) as any as S.Schema<ListJobExecutionsForThingRequest>;
export interface ListJobsRequest {
  status?: JobStatus;
  targetSelection?: TargetSelection;
  maxResults?: number;
  nextToken?: string;
  thingGroupName?: string;
  thingGroupId?: string;
  namespaceId?: string;
}
export const ListJobsRequest = S.suspend(() =>
  S.Struct({
    status: S.optional(JobStatus).pipe(T.HttpQuery("status")),
    targetSelection: S.optional(TargetSelection).pipe(
      T.HttpQuery("targetSelection"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    thingGroupName: S.optional(S.String).pipe(T.HttpQuery("thingGroupName")),
    thingGroupId: S.optional(S.String).pipe(T.HttpQuery("thingGroupId")),
    namespaceId: S.optional(S.String).pipe(T.HttpQuery("namespaceId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListJobsRequest",
}) as any as S.Schema<ListJobsRequest>;
export interface ListJobTemplatesRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListJobTemplatesRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/job-templates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListJobTemplatesRequest",
}) as any as S.Schema<ListJobTemplatesRequest>;
export interface ListManagedJobTemplatesRequest {
  templateName?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListManagedJobTemplatesRequest = S.suspend(() =>
  S.Struct({
    templateName: S.optional(S.String).pipe(T.HttpQuery("templateName")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/managed-job-templates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListManagedJobTemplatesRequest",
}) as any as S.Schema<ListManagedJobTemplatesRequest>;
export interface ListMetricValuesRequest {
  thingName: string;
  metricName: string;
  dimensionName?: string;
  dimensionValueOperator?: DimensionValueOperator;
  startTime: Date;
  endTime: Date;
  maxResults?: number;
  nextToken?: string;
}
export const ListMetricValuesRequest = S.suspend(() =>
  S.Struct({
    thingName: S.String.pipe(T.HttpQuery("thingName")),
    metricName: S.String.pipe(T.HttpQuery("metricName")),
    dimensionName: S.optional(S.String).pipe(T.HttpQuery("dimensionName")),
    dimensionValueOperator: S.optional(DimensionValueOperator).pipe(
      T.HttpQuery("dimensionValueOperator"),
    ),
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("endTime"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/metric-values" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMetricValuesRequest",
}) as any as S.Schema<ListMetricValuesRequest>;
export interface ListMitigationActionsRequest {
  actionType?: MitigationActionType;
  maxResults?: number;
  nextToken?: string;
}
export const ListMitigationActionsRequest = S.suspend(() =>
  S.Struct({
    actionType: S.optional(MitigationActionType).pipe(
      T.HttpQuery("actionType"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/mitigationactions/actions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMitigationActionsRequest",
}) as any as S.Schema<ListMitigationActionsRequest>;
export interface ListOTAUpdatesRequest {
  maxResults?: number;
  nextToken?: string;
  otaUpdateStatus?: OTAUpdateStatus;
}
export const ListOTAUpdatesRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    otaUpdateStatus: S.optional(OTAUpdateStatus).pipe(
      T.HttpQuery("otaUpdateStatus"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/otaUpdates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOTAUpdatesRequest",
}) as any as S.Schema<ListOTAUpdatesRequest>;
export interface ListOutgoingCertificatesRequest {
  pageSize?: number;
  marker?: string;
  ascendingOrder?: boolean;
}
export const ListOutgoingCertificatesRequest = S.suspend(() =>
  S.Struct({
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    ascendingOrder: S.optional(S.Boolean).pipe(T.HttpQuery("isAscendingOrder")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/certificates-out-going" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOutgoingCertificatesRequest",
}) as any as S.Schema<ListOutgoingCertificatesRequest>;
export interface ListPackagesRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListPackagesRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/packages" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPackagesRequest",
}) as any as S.Schema<ListPackagesRequest>;
export interface ListPackageVersionsRequest {
  packageName: string;
  status?: PackageVersionStatus;
  maxResults?: number;
  nextToken?: string;
}
export const ListPackageVersionsRequest = S.suspend(() =>
  S.Struct({
    packageName: S.String.pipe(T.HttpLabel("packageName")),
    status: S.optional(PackageVersionStatus).pipe(T.HttpQuery("status")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/packages/{packageName}/versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPackageVersionsRequest",
}) as any as S.Schema<ListPackageVersionsRequest>;
export interface ListPoliciesRequest {
  marker?: string;
  pageSize?: number;
  ascendingOrder?: boolean;
}
export const ListPoliciesRequest = S.suspend(() =>
  S.Struct({
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
    ascendingOrder: S.optional(S.Boolean).pipe(T.HttpQuery("isAscendingOrder")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/policies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPoliciesRequest",
}) as any as S.Schema<ListPoliciesRequest>;
export interface ListPolicyPrincipalsRequest {
  policyName: string;
  marker?: string;
  pageSize?: number;
  ascendingOrder?: boolean;
}
export const ListPolicyPrincipalsRequest = S.suspend(() =>
  S.Struct({
    policyName: S.String.pipe(T.HttpHeader("x-amzn-iot-policy")),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
    ascendingOrder: S.optional(S.Boolean).pipe(T.HttpQuery("isAscendingOrder")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/policy-principals" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPolicyPrincipalsRequest",
}) as any as S.Schema<ListPolicyPrincipalsRequest>;
export interface ListPolicyVersionsRequest {
  policyName: string;
}
export const ListPolicyVersionsRequest = S.suspend(() =>
  S.Struct({ policyName: S.String.pipe(T.HttpLabel("policyName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/policies/{policyName}/version" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPolicyVersionsRequest",
}) as any as S.Schema<ListPolicyVersionsRequest>;
export interface ListPrincipalPoliciesRequest {
  principal: string;
  marker?: string;
  pageSize?: number;
  ascendingOrder?: boolean;
}
export const ListPrincipalPoliciesRequest = S.suspend(() =>
  S.Struct({
    principal: S.String.pipe(T.HttpHeader("x-amzn-iot-principal")),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
    ascendingOrder: S.optional(S.Boolean).pipe(T.HttpQuery("isAscendingOrder")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/principal-policies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPrincipalPoliciesRequest",
}) as any as S.Schema<ListPrincipalPoliciesRequest>;
export interface ListPrincipalThingsRequest {
  nextToken?: string;
  maxResults?: number;
  principal: string;
}
export const ListPrincipalThingsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    principal: S.String.pipe(T.HttpHeader("x-amzn-principal")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/principals/things" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPrincipalThingsRequest",
}) as any as S.Schema<ListPrincipalThingsRequest>;
export interface ListPrincipalThingsV2Request {
  nextToken?: string;
  maxResults?: number;
  principal: string;
  thingPrincipalType?: ThingPrincipalType;
}
export const ListPrincipalThingsV2Request = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    principal: S.String.pipe(T.HttpHeader("x-amzn-principal")),
    thingPrincipalType: S.optional(ThingPrincipalType).pipe(
      T.HttpQuery("thingPrincipalType"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/principals/things-v2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPrincipalThingsV2Request",
}) as any as S.Schema<ListPrincipalThingsV2Request>;
export interface ListProvisioningTemplatesRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListProvisioningTemplatesRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/provisioning-templates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProvisioningTemplatesRequest",
}) as any as S.Schema<ListProvisioningTemplatesRequest>;
export interface ListProvisioningTemplateVersionsRequest {
  templateName: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListProvisioningTemplateVersionsRequest = S.suspend(() =>
  S.Struct({
    templateName: S.String.pipe(T.HttpLabel("templateName")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/provisioning-templates/{templateName}/versions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProvisioningTemplateVersionsRequest",
}) as any as S.Schema<ListProvisioningTemplateVersionsRequest>;
export interface ListRelatedResourcesForAuditFindingRequest {
  findingId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListRelatedResourcesForAuditFindingRequest = S.suspend(() =>
  S.Struct({
    findingId: S.String.pipe(T.HttpQuery("findingId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/audit/relatedResources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRelatedResourcesForAuditFindingRequest",
}) as any as S.Schema<ListRelatedResourcesForAuditFindingRequest>;
export interface ListRoleAliasesRequest {
  pageSize?: number;
  marker?: string;
  ascendingOrder?: boolean;
}
export const ListRoleAliasesRequest = S.suspend(() =>
  S.Struct({
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    ascendingOrder: S.optional(S.Boolean).pipe(T.HttpQuery("isAscendingOrder")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/role-aliases" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRoleAliasesRequest",
}) as any as S.Schema<ListRoleAliasesRequest>;
export interface ListSbomValidationResultsRequest {
  packageName: string;
  versionName: string;
  validationResult?: SbomValidationResult;
  maxResults?: number;
  nextToken?: string;
}
export const ListSbomValidationResultsRequest = S.suspend(() =>
  S.Struct({
    packageName: S.String.pipe(T.HttpLabel("packageName")),
    versionName: S.String.pipe(T.HttpLabel("versionName")),
    validationResult: S.optional(SbomValidationResult).pipe(
      T.HttpQuery("validationResult"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/packages/{packageName}/versions/{versionName}/sbom-validation-results",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSbomValidationResultsRequest",
}) as any as S.Schema<ListSbomValidationResultsRequest>;
export interface ListScheduledAuditsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListScheduledAuditsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/audit/scheduledaudits" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListScheduledAuditsRequest",
}) as any as S.Schema<ListScheduledAuditsRequest>;
export interface ListSecurityProfilesRequest {
  nextToken?: string;
  maxResults?: number;
  dimensionName?: string;
  metricName?: string;
}
export const ListSecurityProfilesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    dimensionName: S.optional(S.String).pipe(T.HttpQuery("dimensionName")),
    metricName: S.optional(S.String).pipe(T.HttpQuery("metricName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/security-profiles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSecurityProfilesRequest",
}) as any as S.Schema<ListSecurityProfilesRequest>;
export interface ListSecurityProfilesForTargetRequest {
  nextToken?: string;
  maxResults?: number;
  recursive?: boolean;
  securityProfileTargetArn: string;
}
export const ListSecurityProfilesForTargetRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    recursive: S.optional(S.Boolean).pipe(T.HttpQuery("recursive")),
    securityProfileTargetArn: S.String.pipe(
      T.HttpQuery("securityProfileTargetArn"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/security-profiles-for-target" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSecurityProfilesForTargetRequest",
}) as any as S.Schema<ListSecurityProfilesForTargetRequest>;
export interface ListStreamsRequest {
  maxResults?: number;
  nextToken?: string;
  ascendingOrder?: boolean;
}
export const ListStreamsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    ascendingOrder: S.optional(S.Boolean).pipe(T.HttpQuery("isAscendingOrder")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/streams" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListStreamsRequest",
}) as any as S.Schema<ListStreamsRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
  nextToken?: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags" }),
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
export interface ListTargetsForPolicyRequest {
  policyName: string;
  marker?: string;
  pageSize?: number;
}
export const ListTargetsForPolicyRequest = S.suspend(() =>
  S.Struct({
    policyName: S.String.pipe(T.HttpLabel("policyName")),
    marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/policy-targets/{policyName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTargetsForPolicyRequest",
}) as any as S.Schema<ListTargetsForPolicyRequest>;
export interface ListTargetsForSecurityProfileRequest {
  securityProfileName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListTargetsForSecurityProfileRequest = S.suspend(() =>
  S.Struct({
    securityProfileName: S.String.pipe(T.HttpLabel("securityProfileName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/security-profiles/{securityProfileName}/targets",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTargetsForSecurityProfileRequest",
}) as any as S.Schema<ListTargetsForSecurityProfileRequest>;
export interface ListThingGroupsRequest {
  nextToken?: string;
  maxResults?: number;
  parentGroup?: string;
  namePrefixFilter?: string;
  recursive?: boolean;
}
export const ListThingGroupsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    parentGroup: S.optional(S.String).pipe(T.HttpQuery("parentGroup")),
    namePrefixFilter: S.optional(S.String).pipe(
      T.HttpQuery("namePrefixFilter"),
    ),
    recursive: S.optional(S.Boolean).pipe(T.HttpQuery("recursive")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/thing-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListThingGroupsRequest",
}) as any as S.Schema<ListThingGroupsRequest>;
export interface ListThingGroupsForThingRequest {
  thingName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListThingGroupsForThingRequest = S.suspend(() =>
  S.Struct({
    thingName: S.String.pipe(T.HttpLabel("thingName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/things/{thingName}/thing-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListThingGroupsForThingRequest",
}) as any as S.Schema<ListThingGroupsForThingRequest>;
export interface ListThingPrincipalsRequest {
  nextToken?: string;
  maxResults?: number;
  thingName: string;
}
export const ListThingPrincipalsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    thingName: S.String.pipe(T.HttpLabel("thingName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/things/{thingName}/principals" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListThingPrincipalsRequest",
}) as any as S.Schema<ListThingPrincipalsRequest>;
export interface ListThingPrincipalsV2Request {
  nextToken?: string;
  maxResults?: number;
  thingName: string;
  thingPrincipalType?: ThingPrincipalType;
}
export const ListThingPrincipalsV2Request = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    thingName: S.String.pipe(T.HttpLabel("thingName")),
    thingPrincipalType: S.optional(ThingPrincipalType).pipe(
      T.HttpQuery("thingPrincipalType"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/things/{thingName}/principals-v2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListThingPrincipalsV2Request",
}) as any as S.Schema<ListThingPrincipalsV2Request>;
export interface ListThingRegistrationTaskReportsRequest {
  taskId: string;
  reportType: ReportType;
  nextToken?: string;
  maxResults?: number;
}
export const ListThingRegistrationTaskReportsRequest = S.suspend(() =>
  S.Struct({
    taskId: S.String.pipe(T.HttpLabel("taskId")),
    reportType: ReportType.pipe(T.HttpQuery("reportType")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/thing-registration-tasks/{taskId}/reports",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListThingRegistrationTaskReportsRequest",
}) as any as S.Schema<ListThingRegistrationTaskReportsRequest>;
export interface ListThingRegistrationTasksRequest {
  nextToken?: string;
  maxResults?: number;
  status?: Status;
}
export const ListThingRegistrationTasksRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    status: S.optional(Status).pipe(T.HttpQuery("status")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/thing-registration-tasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListThingRegistrationTasksRequest",
}) as any as S.Schema<ListThingRegistrationTasksRequest>;
export interface ListThingsRequest {
  nextToken?: string;
  maxResults?: number;
  attributeName?: string;
  attributeValue?: string;
  thingTypeName?: string;
  usePrefixAttributeValue?: boolean;
}
export const ListThingsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    attributeName: S.optional(S.String).pipe(T.HttpQuery("attributeName")),
    attributeValue: S.optional(S.String).pipe(T.HttpQuery("attributeValue")),
    thingTypeName: S.optional(S.String).pipe(T.HttpQuery("thingTypeName")),
    usePrefixAttributeValue: S.optional(S.Boolean).pipe(
      T.HttpQuery("usePrefixAttributeValue"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/things" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListThingsRequest",
}) as any as S.Schema<ListThingsRequest>;
export interface ListThingsInBillingGroupRequest {
  billingGroupName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListThingsInBillingGroupRequest = S.suspend(() =>
  S.Struct({
    billingGroupName: S.String.pipe(T.HttpLabel("billingGroupName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/billing-groups/{billingGroupName}/things",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListThingsInBillingGroupRequest",
}) as any as S.Schema<ListThingsInBillingGroupRequest>;
export interface ListThingsInThingGroupRequest {
  thingGroupName: string;
  recursive?: boolean;
  nextToken?: string;
  maxResults?: number;
}
export const ListThingsInThingGroupRequest = S.suspend(() =>
  S.Struct({
    thingGroupName: S.String.pipe(T.HttpLabel("thingGroupName")),
    recursive: S.optional(S.Boolean).pipe(T.HttpQuery("recursive")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/thing-groups/{thingGroupName}/things" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListThingsInThingGroupRequest",
}) as any as S.Schema<ListThingsInThingGroupRequest>;
export interface ListThingTypesRequest {
  nextToken?: string;
  maxResults?: number;
  thingTypeName?: string;
}
export const ListThingTypesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    thingTypeName: S.optional(S.String).pipe(T.HttpQuery("thingTypeName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/thing-types" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListThingTypesRequest",
}) as any as S.Schema<ListThingTypesRequest>;
export interface ListTopicRuleDestinationsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListTopicRuleDestinationsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/destinations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTopicRuleDestinationsRequest",
}) as any as S.Schema<ListTopicRuleDestinationsRequest>;
export interface ListTopicRulesRequest {
  topic?: string;
  maxResults?: number;
  nextToken?: string;
  ruleDisabled?: boolean;
}
export const ListTopicRulesRequest = S.suspend(() =>
  S.Struct({
    topic: S.optional(S.String).pipe(T.HttpQuery("topic")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    ruleDisabled: S.optional(S.Boolean).pipe(T.HttpQuery("ruleDisabled")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/rules" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTopicRulesRequest",
}) as any as S.Schema<ListTopicRulesRequest>;
export interface ListV2LoggingLevelsRequest {
  targetType?: LogTargetType;
  nextToken?: string;
  maxResults?: number;
}
export const ListV2LoggingLevelsRequest = S.suspend(() =>
  S.Struct({
    targetType: S.optional(LogTargetType).pipe(T.HttpQuery("targetType")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2LoggingLevel" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListV2LoggingLevelsRequest",
}) as any as S.Schema<ListV2LoggingLevelsRequest>;
export interface ListViolationEventsRequest {
  startTime: Date;
  endTime: Date;
  thingName?: string;
  securityProfileName?: string;
  behaviorCriteriaType?: BehaviorCriteriaType;
  listSuppressedAlerts?: boolean;
  verificationState?: VerificationState;
  nextToken?: string;
  maxResults?: number;
}
export const ListViolationEventsRequest = S.suspend(() =>
  S.Struct({
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("endTime"),
    ),
    thingName: S.optional(S.String).pipe(T.HttpQuery("thingName")),
    securityProfileName: S.optional(S.String).pipe(
      T.HttpQuery("securityProfileName"),
    ),
    behaviorCriteriaType: S.optional(BehaviorCriteriaType).pipe(
      T.HttpQuery("behaviorCriteriaType"),
    ),
    listSuppressedAlerts: S.optional(S.Boolean).pipe(
      T.HttpQuery("listSuppressedAlerts"),
    ),
    verificationState: S.optional(VerificationState).pipe(
      T.HttpQuery("verificationState"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/violation-events" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListViolationEventsRequest",
}) as any as S.Schema<ListViolationEventsRequest>;
export interface PutVerificationStateOnViolationRequest {
  violationId: string;
  verificationState: VerificationState;
  verificationStateDescription?: string;
}
export const PutVerificationStateOnViolationRequest = S.suspend(() =>
  S.Struct({
    violationId: S.String.pipe(T.HttpLabel("violationId")),
    verificationState: VerificationState,
    verificationStateDescription: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/violations/verification-state/{violationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutVerificationStateOnViolationRequest",
}) as any as S.Schema<PutVerificationStateOnViolationRequest>;
export interface PutVerificationStateOnViolationResponse {}
export const PutVerificationStateOnViolationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutVerificationStateOnViolationResponse",
}) as any as S.Schema<PutVerificationStateOnViolationResponse>;
export interface RegisterCertificateRequest {
  certificatePem: string;
  caCertificatePem?: string;
  setAsActive?: boolean;
  status?: CertificateStatus;
}
export const RegisterCertificateRequest = S.suspend(() =>
  S.Struct({
    certificatePem: S.String,
    caCertificatePem: S.optional(S.String),
    setAsActive: S.optional(S.Boolean).pipe(T.HttpQuery("setAsActive")),
    status: S.optional(CertificateStatus),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/certificate/register" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterCertificateRequest",
}) as any as S.Schema<RegisterCertificateRequest>;
export interface RegisterCertificateWithoutCARequest {
  certificatePem: string;
  status?: CertificateStatus;
}
export const RegisterCertificateWithoutCARequest = S.suspend(() =>
  S.Struct({
    certificatePem: S.String,
    status: S.optional(CertificateStatus),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/certificate/register-no-ca" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterCertificateWithoutCARequest",
}) as any as S.Schema<RegisterCertificateWithoutCARequest>;
export interface RejectCertificateTransferRequest {
  certificateId: string;
  rejectReason?: string;
}
export const RejectCertificateTransferRequest = S.suspend(() =>
  S.Struct({
    certificateId: S.String.pipe(T.HttpLabel("certificateId")),
    rejectReason: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/reject-certificate-transfer/{certificateId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RejectCertificateTransferRequest",
}) as any as S.Schema<RejectCertificateTransferRequest>;
export interface RejectCertificateTransferResponse {}
export const RejectCertificateTransferResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RejectCertificateTransferResponse",
}) as any as S.Schema<RejectCertificateTransferResponse>;
export interface RemoveThingFromBillingGroupRequest {
  billingGroupName?: string;
  billingGroupArn?: string;
  thingName?: string;
  thingArn?: string;
}
export const RemoveThingFromBillingGroupRequest = S.suspend(() =>
  S.Struct({
    billingGroupName: S.optional(S.String),
    billingGroupArn: S.optional(S.String),
    thingName: S.optional(S.String),
    thingArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/billing-groups/removeThingFromBillingGroup",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveThingFromBillingGroupRequest",
}) as any as S.Schema<RemoveThingFromBillingGroupRequest>;
export interface RemoveThingFromBillingGroupResponse {}
export const RemoveThingFromBillingGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RemoveThingFromBillingGroupResponse",
}) as any as S.Schema<RemoveThingFromBillingGroupResponse>;
export interface RemoveThingFromThingGroupRequest {
  thingGroupName?: string;
  thingGroupArn?: string;
  thingName?: string;
  thingArn?: string;
}
export const RemoveThingFromThingGroupRequest = S.suspend(() =>
  S.Struct({
    thingGroupName: S.optional(S.String),
    thingGroupArn: S.optional(S.String),
    thingName: S.optional(S.String),
    thingArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/thing-groups/removeThingFromThingGroup" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveThingFromThingGroupRequest",
}) as any as S.Schema<RemoveThingFromThingGroupRequest>;
export interface RemoveThingFromThingGroupResponse {}
export const RemoveThingFromThingGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RemoveThingFromThingGroupResponse",
}) as any as S.Schema<RemoveThingFromThingGroupResponse>;
export type DynamoKeyType = "STRING" | "NUMBER";
export const DynamoKeyType = S.Literal("STRING", "NUMBER");
export interface DynamoDBAction {
  tableName: string;
  roleArn: string;
  operation?: string;
  hashKeyField: string;
  hashKeyValue: string;
  hashKeyType?: DynamoKeyType;
  rangeKeyField?: string;
  rangeKeyValue?: string;
  rangeKeyType?: DynamoKeyType;
  payloadField?: string;
}
export const DynamoDBAction = S.suspend(() =>
  S.Struct({
    tableName: S.String,
    roleArn: S.String,
    operation: S.optional(S.String),
    hashKeyField: S.String,
    hashKeyValue: S.String,
    hashKeyType: S.optional(DynamoKeyType),
    rangeKeyField: S.optional(S.String),
    rangeKeyValue: S.optional(S.String),
    rangeKeyType: S.optional(DynamoKeyType),
    payloadField: S.optional(S.String),
  }),
).annotations({
  identifier: "DynamoDBAction",
}) as any as S.Schema<DynamoDBAction>;
export interface PutItemInput {
  tableName: string;
}
export const PutItemInput = S.suspend(() =>
  S.Struct({ tableName: S.String }),
).annotations({ identifier: "PutItemInput" }) as any as S.Schema<PutItemInput>;
export interface DynamoDBv2Action {
  roleArn: string;
  putItem: PutItemInput;
}
export const DynamoDBv2Action = S.suspend(() =>
  S.Struct({ roleArn: S.String, putItem: PutItemInput }),
).annotations({
  identifier: "DynamoDBv2Action",
}) as any as S.Schema<DynamoDBv2Action>;
export interface LambdaAction {
  functionArn: string;
}
export const LambdaAction = S.suspend(() =>
  S.Struct({ functionArn: S.String }),
).annotations({ identifier: "LambdaAction" }) as any as S.Schema<LambdaAction>;
export type MessageFormat = "RAW" | "JSON";
export const MessageFormat = S.Literal("RAW", "JSON");
export interface SnsAction {
  targetArn: string;
  roleArn: string;
  messageFormat?: MessageFormat;
}
export const SnsAction = S.suspend(() =>
  S.Struct({
    targetArn: S.String,
    roleArn: S.String,
    messageFormat: S.optional(MessageFormat),
  }),
).annotations({ identifier: "SnsAction" }) as any as S.Schema<SnsAction>;
export interface SqsAction {
  roleArn: string;
  queueUrl: string;
  useBase64?: boolean;
}
export const SqsAction = S.suspend(() =>
  S.Struct({
    roleArn: S.String,
    queueUrl: S.String,
    useBase64: S.optional(S.Boolean),
  }),
).annotations({ identifier: "SqsAction" }) as any as S.Schema<SqsAction>;
export interface KinesisAction {
  roleArn: string;
  streamName: string;
  partitionKey?: string;
}
export const KinesisAction = S.suspend(() =>
  S.Struct({
    roleArn: S.String,
    streamName: S.String,
    partitionKey: S.optional(S.String),
  }),
).annotations({
  identifier: "KinesisAction",
}) as any as S.Schema<KinesisAction>;
export interface UserProperty {
  key: string;
  value: string;
}
export const UserProperty = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({ identifier: "UserProperty" }) as any as S.Schema<UserProperty>;
export type UserProperties = UserProperty[];
export const UserProperties = S.Array(UserProperty);
export interface MqttHeaders {
  payloadFormatIndicator?: string;
  contentType?: string;
  responseTopic?: string;
  correlationData?: string;
  messageExpiry?: string;
  userProperties?: UserProperty[];
}
export const MqttHeaders = S.suspend(() =>
  S.Struct({
    payloadFormatIndicator: S.optional(S.String),
    contentType: S.optional(S.String),
    responseTopic: S.optional(S.String),
    correlationData: S.optional(S.String),
    messageExpiry: S.optional(S.String),
    userProperties: S.optional(UserProperties),
  }),
).annotations({ identifier: "MqttHeaders" }) as any as S.Schema<MqttHeaders>;
export interface RepublishAction {
  roleArn: string;
  topic: string;
  qos?: number;
  headers?: MqttHeaders;
}
export const RepublishAction = S.suspend(() =>
  S.Struct({
    roleArn: S.String,
    topic: S.String,
    qos: S.optional(S.Number),
    headers: S.optional(MqttHeaders),
  }),
).annotations({
  identifier: "RepublishAction",
}) as any as S.Schema<RepublishAction>;
export type CannedAccessControlList =
  | "private"
  | "public-read"
  | "public-read-write"
  | "aws-exec-read"
  | "authenticated-read"
  | "bucket-owner-read"
  | "bucket-owner-full-control"
  | "log-delivery-write";
export const CannedAccessControlList = S.Literal(
  "private",
  "public-read",
  "public-read-write",
  "aws-exec-read",
  "authenticated-read",
  "bucket-owner-read",
  "bucket-owner-full-control",
  "log-delivery-write",
);
export interface S3Action {
  roleArn: string;
  bucketName: string;
  key: string;
  cannedAcl?: CannedAccessControlList;
}
export const S3Action = S.suspend(() =>
  S.Struct({
    roleArn: S.String,
    bucketName: S.String,
    key: S.String,
    cannedAcl: S.optional(CannedAccessControlList),
  }),
).annotations({ identifier: "S3Action" }) as any as S.Schema<S3Action>;
export interface FirehoseAction {
  roleArn: string;
  deliveryStreamName: string;
  separator?: string;
  batchMode?: boolean;
}
export const FirehoseAction = S.suspend(() =>
  S.Struct({
    roleArn: S.String,
    deliveryStreamName: S.String,
    separator: S.optional(S.String),
    batchMode: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "FirehoseAction",
}) as any as S.Schema<FirehoseAction>;
export interface CloudwatchMetricAction {
  roleArn: string;
  metricNamespace: string;
  metricName: string;
  metricValue: string;
  metricUnit: string;
  metricTimestamp?: string;
}
export const CloudwatchMetricAction = S.suspend(() =>
  S.Struct({
    roleArn: S.String,
    metricNamespace: S.String,
    metricName: S.String,
    metricValue: S.String,
    metricUnit: S.String,
    metricTimestamp: S.optional(S.String),
  }),
).annotations({
  identifier: "CloudwatchMetricAction",
}) as any as S.Schema<CloudwatchMetricAction>;
export interface CloudwatchAlarmAction {
  roleArn: string;
  alarmName: string;
  stateReason: string;
  stateValue: string;
}
export const CloudwatchAlarmAction = S.suspend(() =>
  S.Struct({
    roleArn: S.String,
    alarmName: S.String,
    stateReason: S.String,
    stateValue: S.String,
  }),
).annotations({
  identifier: "CloudwatchAlarmAction",
}) as any as S.Schema<CloudwatchAlarmAction>;
export interface CloudwatchLogsAction {
  roleArn: string;
  logGroupName: string;
  batchMode?: boolean;
}
export const CloudwatchLogsAction = S.suspend(() =>
  S.Struct({
    roleArn: S.String,
    logGroupName: S.String,
    batchMode: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CloudwatchLogsAction",
}) as any as S.Schema<CloudwatchLogsAction>;
export interface ElasticsearchAction {
  roleArn: string;
  endpoint: string;
  index: string;
  type: string;
  id: string;
}
export const ElasticsearchAction = S.suspend(() =>
  S.Struct({
    roleArn: S.String,
    endpoint: S.String,
    index: S.String,
    type: S.String,
    id: S.String,
  }),
).annotations({
  identifier: "ElasticsearchAction",
}) as any as S.Schema<ElasticsearchAction>;
export interface SalesforceAction {
  token: string;
  url: string;
}
export const SalesforceAction = S.suspend(() =>
  S.Struct({ token: S.String, url: S.String }),
).annotations({
  identifier: "SalesforceAction",
}) as any as S.Schema<SalesforceAction>;
export interface IotAnalyticsAction {
  channelArn?: string;
  channelName?: string;
  batchMode?: boolean;
  roleArn?: string;
}
export const IotAnalyticsAction = S.suspend(() =>
  S.Struct({
    channelArn: S.optional(S.String),
    channelName: S.optional(S.String),
    batchMode: S.optional(S.Boolean),
    roleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "IotAnalyticsAction",
}) as any as S.Schema<IotAnalyticsAction>;
export interface IotEventsAction {
  inputName: string;
  messageId?: string;
  batchMode?: boolean;
  roleArn: string;
}
export const IotEventsAction = S.suspend(() =>
  S.Struct({
    inputName: S.String,
    messageId: S.optional(S.String),
    batchMode: S.optional(S.Boolean),
    roleArn: S.String,
  }),
).annotations({
  identifier: "IotEventsAction",
}) as any as S.Schema<IotEventsAction>;
export type AssetPropertyVariant =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: string }
  | { booleanValue: string };
export const AssetPropertyVariant = S.Union(
  S.Struct({ stringValue: S.String }),
  S.Struct({ integerValue: S.String }),
  S.Struct({ doubleValue: S.String }),
  S.Struct({ booleanValue: S.String }),
);
export interface AssetPropertyTimestamp {
  timeInSeconds: string;
  offsetInNanos?: string;
}
export const AssetPropertyTimestamp = S.suspend(() =>
  S.Struct({ timeInSeconds: S.String, offsetInNanos: S.optional(S.String) }),
).annotations({
  identifier: "AssetPropertyTimestamp",
}) as any as S.Schema<AssetPropertyTimestamp>;
export interface AssetPropertyValue {
  value: AssetPropertyVariant;
  timestamp: AssetPropertyTimestamp;
  quality?: string;
}
export const AssetPropertyValue = S.suspend(() =>
  S.Struct({
    value: AssetPropertyVariant,
    timestamp: AssetPropertyTimestamp,
    quality: S.optional(S.String),
  }),
).annotations({
  identifier: "AssetPropertyValue",
}) as any as S.Schema<AssetPropertyValue>;
export type AssetPropertyValueList = AssetPropertyValue[];
export const AssetPropertyValueList = S.Array(AssetPropertyValue);
export interface PutAssetPropertyValueEntry {
  entryId?: string;
  assetId?: string;
  propertyId?: string;
  propertyAlias?: string;
  propertyValues: AssetPropertyValue[];
}
export const PutAssetPropertyValueEntry = S.suspend(() =>
  S.Struct({
    entryId: S.optional(S.String),
    assetId: S.optional(S.String),
    propertyId: S.optional(S.String),
    propertyAlias: S.optional(S.String),
    propertyValues: AssetPropertyValueList,
  }),
).annotations({
  identifier: "PutAssetPropertyValueEntry",
}) as any as S.Schema<PutAssetPropertyValueEntry>;
export type PutAssetPropertyValueEntryList = PutAssetPropertyValueEntry[];
export const PutAssetPropertyValueEntryList = S.Array(
  PutAssetPropertyValueEntry,
);
export interface IotSiteWiseAction {
  putAssetPropertyValueEntries: PutAssetPropertyValueEntry[];
  roleArn: string;
}
export const IotSiteWiseAction = S.suspend(() =>
  S.Struct({
    putAssetPropertyValueEntries: PutAssetPropertyValueEntryList,
    roleArn: S.String,
  }),
).annotations({
  identifier: "IotSiteWiseAction",
}) as any as S.Schema<IotSiteWiseAction>;
export interface StepFunctionsAction {
  executionNamePrefix?: string;
  stateMachineName: string;
  roleArn: string;
}
export const StepFunctionsAction = S.suspend(() =>
  S.Struct({
    executionNamePrefix: S.optional(S.String),
    stateMachineName: S.String,
    roleArn: S.String,
  }),
).annotations({
  identifier: "StepFunctionsAction",
}) as any as S.Schema<StepFunctionsAction>;
export interface TimestreamDimension {
  name: string;
  value: string;
}
export const TimestreamDimension = S.suspend(() =>
  S.Struct({ name: S.String, value: S.String }),
).annotations({
  identifier: "TimestreamDimension",
}) as any as S.Schema<TimestreamDimension>;
export type TimestreamDimensionList = TimestreamDimension[];
export const TimestreamDimensionList = S.Array(TimestreamDimension);
export interface TimestreamTimestamp {
  value: string;
  unit: string;
}
export const TimestreamTimestamp = S.suspend(() =>
  S.Struct({ value: S.String, unit: S.String }),
).annotations({
  identifier: "TimestreamTimestamp",
}) as any as S.Schema<TimestreamTimestamp>;
export interface TimestreamAction {
  roleArn: string;
  databaseName: string;
  tableName: string;
  dimensions: TimestreamDimension[];
  timestamp?: TimestreamTimestamp;
}
export const TimestreamAction = S.suspend(() =>
  S.Struct({
    roleArn: S.String,
    databaseName: S.String,
    tableName: S.String,
    dimensions: TimestreamDimensionList,
    timestamp: S.optional(TimestreamTimestamp),
  }),
).annotations({
  identifier: "TimestreamAction",
}) as any as S.Schema<TimestreamAction>;
export interface HttpActionHeader {
  key: string;
  value: string;
}
export const HttpActionHeader = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({
  identifier: "HttpActionHeader",
}) as any as S.Schema<HttpActionHeader>;
export type HeaderList = HttpActionHeader[];
export const HeaderList = S.Array(HttpActionHeader);
export interface SigV4Authorization {
  signingRegion: string;
  serviceName: string;
  roleArn: string;
}
export const SigV4Authorization = S.suspend(() =>
  S.Struct({
    signingRegion: S.String,
    serviceName: S.String,
    roleArn: S.String,
  }),
).annotations({
  identifier: "SigV4Authorization",
}) as any as S.Schema<SigV4Authorization>;
export interface HttpAuthorization {
  sigv4?: SigV4Authorization;
}
export const HttpAuthorization = S.suspend(() =>
  S.Struct({ sigv4: S.optional(SigV4Authorization) }),
).annotations({
  identifier: "HttpAuthorization",
}) as any as S.Schema<HttpAuthorization>;
export interface BatchConfig {
  maxBatchOpenMs?: number;
  maxBatchSize?: number;
  maxBatchSizeBytes?: number;
}
export const BatchConfig = S.suspend(() =>
  S.Struct({
    maxBatchOpenMs: S.optional(S.Number),
    maxBatchSize: S.optional(S.Number),
    maxBatchSizeBytes: S.optional(S.Number),
  }),
).annotations({ identifier: "BatchConfig" }) as any as S.Schema<BatchConfig>;
export interface HttpAction {
  url: string;
  confirmationUrl?: string;
  headers?: HttpActionHeader[];
  auth?: HttpAuthorization;
  enableBatching?: boolean;
  batchConfig?: BatchConfig;
}
export const HttpAction = S.suspend(() =>
  S.Struct({
    url: S.String,
    confirmationUrl: S.optional(S.String),
    headers: S.optional(HeaderList),
    auth: S.optional(HttpAuthorization),
    enableBatching: S.optional(S.Boolean),
    batchConfig: S.optional(BatchConfig),
  }),
).annotations({ identifier: "HttpAction" }) as any as S.Schema<HttpAction>;
export type ClientProperties = { [key: string]: string };
export const ClientProperties = S.Record({ key: S.String, value: S.String });
export interface KafkaActionHeader {
  key: string;
  value: string;
}
export const KafkaActionHeader = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({
  identifier: "KafkaActionHeader",
}) as any as S.Schema<KafkaActionHeader>;
export type KafkaHeaders = KafkaActionHeader[];
export const KafkaHeaders = S.Array(KafkaActionHeader);
export interface KafkaAction {
  destinationArn: string;
  topic: string;
  key?: string;
  partition?: string;
  clientProperties: { [key: string]: string };
  headers?: KafkaActionHeader[];
}
export const KafkaAction = S.suspend(() =>
  S.Struct({
    destinationArn: S.String,
    topic: S.String,
    key: S.optional(S.String),
    partition: S.optional(S.String),
    clientProperties: ClientProperties,
    headers: S.optional(KafkaHeaders),
  }),
).annotations({ identifier: "KafkaAction" }) as any as S.Schema<KafkaAction>;
export interface OpenSearchAction {
  roleArn: string;
  endpoint: string;
  index: string;
  type: string;
  id: string;
}
export const OpenSearchAction = S.suspend(() =>
  S.Struct({
    roleArn: S.String,
    endpoint: S.String,
    index: S.String,
    type: S.String,
    id: S.String,
  }),
).annotations({
  identifier: "OpenSearchAction",
}) as any as S.Schema<OpenSearchAction>;
export interface LocationTimestamp {
  value: string;
  unit?: string;
}
export const LocationTimestamp = S.suspend(() =>
  S.Struct({ value: S.String, unit: S.optional(S.String) }),
).annotations({
  identifier: "LocationTimestamp",
}) as any as S.Schema<LocationTimestamp>;
export interface LocationAction {
  roleArn: string;
  trackerName: string;
  deviceId: string;
  timestamp?: LocationTimestamp;
  latitude: string;
  longitude: string;
}
export const LocationAction = S.suspend(() =>
  S.Struct({
    roleArn: S.String,
    trackerName: S.String,
    deviceId: S.String,
    timestamp: S.optional(LocationTimestamp),
    latitude: S.String,
    longitude: S.String,
  }),
).annotations({
  identifier: "LocationAction",
}) as any as S.Schema<LocationAction>;
export interface Action {
  dynamoDB?: DynamoDBAction;
  dynamoDBv2?: DynamoDBv2Action;
  lambda?: LambdaAction;
  sns?: SnsAction;
  sqs?: SqsAction;
  kinesis?: KinesisAction;
  republish?: RepublishAction;
  s3?: S3Action;
  firehose?: FirehoseAction;
  cloudwatchMetric?: CloudwatchMetricAction;
  cloudwatchAlarm?: CloudwatchAlarmAction;
  cloudwatchLogs?: CloudwatchLogsAction;
  elasticsearch?: ElasticsearchAction;
  salesforce?: SalesforceAction;
  iotAnalytics?: IotAnalyticsAction;
  iotEvents?: IotEventsAction;
  iotSiteWise?: IotSiteWiseAction;
  stepFunctions?: StepFunctionsAction;
  timestream?: TimestreamAction;
  http?: HttpAction;
  kafka?: KafkaAction;
  openSearch?: OpenSearchAction;
  location?: LocationAction;
}
export const Action = S.suspend(() =>
  S.Struct({
    dynamoDB: S.optional(DynamoDBAction),
    dynamoDBv2: S.optional(DynamoDBv2Action),
    lambda: S.optional(LambdaAction),
    sns: S.optional(SnsAction),
    sqs: S.optional(SqsAction),
    kinesis: S.optional(KinesisAction),
    republish: S.optional(RepublishAction),
    s3: S.optional(S3Action),
    firehose: S.optional(FirehoseAction),
    cloudwatchMetric: S.optional(CloudwatchMetricAction),
    cloudwatchAlarm: S.optional(CloudwatchAlarmAction),
    cloudwatchLogs: S.optional(CloudwatchLogsAction),
    elasticsearch: S.optional(ElasticsearchAction),
    salesforce: S.optional(SalesforceAction),
    iotAnalytics: S.optional(IotAnalyticsAction),
    iotEvents: S.optional(IotEventsAction),
    iotSiteWise: S.optional(IotSiteWiseAction),
    stepFunctions: S.optional(StepFunctionsAction),
    timestream: S.optional(TimestreamAction),
    http: S.optional(HttpAction),
    kafka: S.optional(KafkaAction),
    openSearch: S.optional(OpenSearchAction),
    location: S.optional(LocationAction),
  }),
).annotations({ identifier: "Action" }) as any as S.Schema<Action>;
export type ActionList = Action[];
export const ActionList = S.Array(Action);
export interface TopicRulePayload {
  sql: string;
  description?: string;
  actions: Action[];
  ruleDisabled?: boolean;
  awsIotSqlVersion?: string;
  errorAction?: Action;
}
export const TopicRulePayload = S.suspend(() =>
  S.Struct({
    sql: S.String,
    description: S.optional(S.String),
    actions: ActionList,
    ruleDisabled: S.optional(S.Boolean),
    awsIotSqlVersion: S.optional(S.String),
    errorAction: S.optional(Action),
  }),
).annotations({
  identifier: "TopicRulePayload",
}) as any as S.Schema<TopicRulePayload>;
export interface ReplaceTopicRuleRequest {
  ruleName: string;
  topicRulePayload: TopicRulePayload;
}
export const ReplaceTopicRuleRequest = S.suspend(() =>
  S.Struct({
    ruleName: S.String.pipe(T.HttpLabel("ruleName")),
    topicRulePayload: TopicRulePayload.pipe(T.HttpPayload()).annotations({
      identifier: "TopicRulePayload",
    }),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/rules/{ruleName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ReplaceTopicRuleRequest",
}) as any as S.Schema<ReplaceTopicRuleRequest>;
export interface ReplaceTopicRuleResponse {}
export const ReplaceTopicRuleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ReplaceTopicRuleResponse",
}) as any as S.Schema<ReplaceTopicRuleResponse>;
export interface SearchIndexRequest {
  indexName?: string;
  queryString: string;
  nextToken?: string;
  maxResults?: number;
  queryVersion?: string;
}
export const SearchIndexRequest = S.suspend(() =>
  S.Struct({
    indexName: S.optional(S.String),
    queryString: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    queryVersion: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/indices/search" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchIndexRequest",
}) as any as S.Schema<SearchIndexRequest>;
export interface SetDefaultAuthorizerRequest {
  authorizerName: string;
}
export const SetDefaultAuthorizerRequest = S.suspend(() =>
  S.Struct({ authorizerName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/default-authorizer" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetDefaultAuthorizerRequest",
}) as any as S.Schema<SetDefaultAuthorizerRequest>;
export interface SetDefaultPolicyVersionRequest {
  policyName: string;
  policyVersionId: string;
}
export const SetDefaultPolicyVersionRequest = S.suspend(() =>
  S.Struct({
    policyName: S.String.pipe(T.HttpLabel("policyName")),
    policyVersionId: S.String.pipe(T.HttpLabel("policyVersionId")),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/policies/{policyName}/version/{policyVersionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetDefaultPolicyVersionRequest",
}) as any as S.Schema<SetDefaultPolicyVersionRequest>;
export interface SetDefaultPolicyVersionResponse {}
export const SetDefaultPolicyVersionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "SetDefaultPolicyVersionResponse",
}) as any as S.Schema<SetDefaultPolicyVersionResponse>;
export interface StartOnDemandAuditTaskRequest {
  targetCheckNames: string[];
}
export const StartOnDemandAuditTaskRequest = S.suspend(() =>
  S.Struct({ targetCheckNames: TargetAuditCheckNames }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/audit/tasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartOnDemandAuditTaskRequest",
}) as any as S.Schema<StartOnDemandAuditTaskRequest>;
export interface StartThingRegistrationTaskRequest {
  templateBody: string;
  inputFileBucket: string;
  inputFileKey: string;
  roleArn: string;
}
export const StartThingRegistrationTaskRequest = S.suspend(() =>
  S.Struct({
    templateBody: S.String,
    inputFileBucket: S.String,
    inputFileKey: S.String,
    roleArn: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/thing-registration-tasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartThingRegistrationTaskRequest",
}) as any as S.Schema<StartThingRegistrationTaskRequest>;
export interface StopThingRegistrationTaskRequest {
  taskId: string;
}
export const StopThingRegistrationTaskRequest = S.suspend(() =>
  S.Struct({ taskId: S.String.pipe(T.HttpLabel("taskId")) }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/thing-registration-tasks/{taskId}/cancel",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopThingRegistrationTaskRequest",
}) as any as S.Schema<StopThingRegistrationTaskRequest>;
export interface StopThingRegistrationTaskResponse {}
export const StopThingRegistrationTaskResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopThingRegistrationTaskResponse",
}) as any as S.Schema<StopThingRegistrationTaskResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: TagList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags" }),
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
export interface TransferCertificateRequest {
  certificateId: string;
  targetAwsAccount: string;
  transferMessage?: string;
}
export const TransferCertificateRequest = S.suspend(() =>
  S.Struct({
    certificateId: S.String.pipe(T.HttpLabel("certificateId")),
    targetAwsAccount: S.String.pipe(T.HttpQuery("targetAwsAccount")),
    transferMessage: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/transfer-certificate/{certificateId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TransferCertificateRequest",
}) as any as S.Schema<TransferCertificateRequest>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tagKeys: TagKeyList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/untag" }),
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
export type AuditNotificationType = "SNS";
export const AuditNotificationType = S.Literal("SNS");
export interface AuditNotificationTarget {
  targetArn?: string;
  roleArn?: string;
  enabled?: boolean;
}
export const AuditNotificationTarget = S.suspend(() =>
  S.Struct({
    targetArn: S.optional(S.String),
    roleArn: S.optional(S.String),
    enabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AuditNotificationTarget",
}) as any as S.Schema<AuditNotificationTarget>;
export type AuditNotificationTargetConfigurations = {
  [key in AuditNotificationType]?: AuditNotificationTarget;
};
export const AuditNotificationTargetConfigurations = S.partial(
  S.Record({ key: AuditNotificationType, value: AuditNotificationTarget }),
);
export type ConfigName =
  | "CERT_AGE_THRESHOLD_IN_DAYS"
  | "CERT_EXPIRATION_THRESHOLD_IN_DAYS";
export const ConfigName = S.Literal(
  "CERT_AGE_THRESHOLD_IN_DAYS",
  "CERT_EXPIRATION_THRESHOLD_IN_DAYS",
);
export type CheckCustomConfiguration = { [key in ConfigName]?: string };
export const CheckCustomConfiguration = S.partial(
  S.Record({ key: ConfigName, value: S.String }),
);
export interface AuditCheckConfiguration {
  enabled?: boolean;
  configuration?: { [key: string]: string };
}
export const AuditCheckConfiguration = S.suspend(() =>
  S.Struct({
    enabled: S.optional(S.Boolean),
    configuration: S.optional(CheckCustomConfiguration),
  }),
).annotations({
  identifier: "AuditCheckConfiguration",
}) as any as S.Schema<AuditCheckConfiguration>;
export type AuditCheckConfigurations = {
  [key: string]: AuditCheckConfiguration;
};
export const AuditCheckConfigurations = S.Record({
  key: S.String,
  value: AuditCheckConfiguration,
});
export interface UpdateAccountAuditConfigurationRequest {
  roleArn?: string;
  auditNotificationTargetConfigurations?: {
    [key: string]: AuditNotificationTarget;
  };
  auditCheckConfigurations?: { [key: string]: AuditCheckConfiguration };
}
export const UpdateAccountAuditConfigurationRequest = S.suspend(() =>
  S.Struct({
    roleArn: S.optional(S.String),
    auditNotificationTargetConfigurations: S.optional(
      AuditNotificationTargetConfigurations,
    ),
    auditCheckConfigurations: S.optional(AuditCheckConfigurations),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/audit/configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAccountAuditConfigurationRequest",
}) as any as S.Schema<UpdateAccountAuditConfigurationRequest>;
export interface UpdateAccountAuditConfigurationResponse {}
export const UpdateAccountAuditConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateAccountAuditConfigurationResponse",
}) as any as S.Schema<UpdateAccountAuditConfigurationResponse>;
export interface UpdateAuditSuppressionRequest {
  checkName: string;
  resourceIdentifier: ResourceIdentifier;
  expirationDate?: Date;
  suppressIndefinitely?: boolean;
  description?: string;
}
export const UpdateAuditSuppressionRequest = S.suspend(() =>
  S.Struct({
    checkName: S.String,
    resourceIdentifier: ResourceIdentifier,
    expirationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    suppressIndefinitely: S.optional(S.Boolean),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/audit/suppressions/update" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAuditSuppressionRequest",
}) as any as S.Schema<UpdateAuditSuppressionRequest>;
export interface UpdateAuditSuppressionResponse {}
export const UpdateAuditSuppressionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateAuditSuppressionResponse",
}) as any as S.Schema<UpdateAuditSuppressionResponse>;
export type PublicKeyMap = { [key: string]: string };
export const PublicKeyMap = S.Record({ key: S.String, value: S.String });
export interface UpdateAuthorizerRequest {
  authorizerName: string;
  authorizerFunctionArn?: string;
  tokenKeyName?: string;
  tokenSigningPublicKeys?: { [key: string]: string };
  status?: AuthorizerStatus;
  enableCachingForHttp?: boolean;
}
export const UpdateAuthorizerRequest = S.suspend(() =>
  S.Struct({
    authorizerName: S.String.pipe(T.HttpLabel("authorizerName")),
    authorizerFunctionArn: S.optional(S.String),
    tokenKeyName: S.optional(S.String),
    tokenSigningPublicKeys: S.optional(PublicKeyMap),
    status: S.optional(AuthorizerStatus),
    enableCachingForHttp: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/authorizer/{authorizerName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAuthorizerRequest",
}) as any as S.Schema<UpdateAuthorizerRequest>;
export interface BillingGroupProperties {
  billingGroupDescription?: string;
}
export const BillingGroupProperties = S.suspend(() =>
  S.Struct({ billingGroupDescription: S.optional(S.String) }),
).annotations({
  identifier: "BillingGroupProperties",
}) as any as S.Schema<BillingGroupProperties>;
export interface UpdateBillingGroupRequest {
  billingGroupName: string;
  billingGroupProperties: BillingGroupProperties;
  expectedVersion?: number;
}
export const UpdateBillingGroupRequest = S.suspend(() =>
  S.Struct({
    billingGroupName: S.String.pipe(T.HttpLabel("billingGroupName")),
    billingGroupProperties: BillingGroupProperties,
    expectedVersion: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/billing-groups/{billingGroupName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBillingGroupRequest",
}) as any as S.Schema<UpdateBillingGroupRequest>;
export interface RegistrationConfig {
  templateBody?: string;
  roleArn?: string;
  templateName?: string;
}
export const RegistrationConfig = S.suspend(() =>
  S.Struct({
    templateBody: S.optional(S.String),
    roleArn: S.optional(S.String),
    templateName: S.optional(S.String),
  }),
).annotations({
  identifier: "RegistrationConfig",
}) as any as S.Schema<RegistrationConfig>;
export interface UpdateCACertificateRequest {
  certificateId: string;
  newStatus?: CACertificateStatus;
  newAutoRegistrationStatus?: AutoRegistrationStatus;
  registrationConfig?: RegistrationConfig;
  removeAutoRegistration?: boolean;
}
export const UpdateCACertificateRequest = S.suspend(() =>
  S.Struct({
    certificateId: S.String.pipe(T.HttpLabel("certificateId")),
    newStatus: S.optional(CACertificateStatus).pipe(T.HttpQuery("newStatus")),
    newAutoRegistrationStatus: S.optional(AutoRegistrationStatus).pipe(
      T.HttpQuery("newAutoRegistrationStatus"),
    ),
    registrationConfig: S.optional(RegistrationConfig),
    removeAutoRegistration: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/cacertificate/{certificateId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCACertificateRequest",
}) as any as S.Schema<UpdateCACertificateRequest>;
export interface UpdateCACertificateResponse {}
export const UpdateCACertificateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateCACertificateResponse",
}) as any as S.Schema<UpdateCACertificateResponse>;
export interface UpdateCertificateRequest {
  certificateId: string;
  newStatus: CertificateStatus;
}
export const UpdateCertificateRequest = S.suspend(() =>
  S.Struct({
    certificateId: S.String.pipe(T.HttpLabel("certificateId")),
    newStatus: CertificateStatus.pipe(T.HttpQuery("newStatus")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/certificates/{certificateId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCertificateRequest",
}) as any as S.Schema<UpdateCertificateRequest>;
export interface UpdateCertificateResponse {}
export const UpdateCertificateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateCertificateResponse",
}) as any as S.Schema<UpdateCertificateResponse>;
export interface UpdateCertificateProviderRequest {
  certificateProviderName: string;
  lambdaFunctionArn?: string;
  accountDefaultForOperations?: CertificateProviderOperation[];
}
export const UpdateCertificateProviderRequest = S.suspend(() =>
  S.Struct({
    certificateProviderName: S.String.pipe(
      T.HttpLabel("certificateProviderName"),
    ),
    lambdaFunctionArn: S.optional(S.String),
    accountDefaultForOperations: S.optional(
      CertificateProviderAccountDefaultForOperations,
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/certificate-providers/{certificateProviderName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCertificateProviderRequest",
}) as any as S.Schema<UpdateCertificateProviderRequest>;
export interface UpdateCommandRequest {
  commandId: string;
  displayName?: string;
  description?: string;
  deprecated?: boolean;
}
export const UpdateCommandRequest = S.suspend(() =>
  S.Struct({
    commandId: S.String.pipe(T.HttpLabel("commandId")),
    displayName: S.optional(S.String),
    description: S.optional(S.String),
    deprecated: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/commands/{commandId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCommandRequest",
}) as any as S.Schema<UpdateCommandRequest>;
export interface UpdateCustomMetricRequest {
  metricName: string;
  displayName: string;
}
export const UpdateCustomMetricRequest = S.suspend(() =>
  S.Struct({
    metricName: S.String.pipe(T.HttpLabel("metricName")),
    displayName: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/custom-metric/{metricName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCustomMetricRequest",
}) as any as S.Schema<UpdateCustomMetricRequest>;
export interface UpdateDimensionRequest {
  name: string;
  stringValues: string[];
}
export const UpdateDimensionRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    stringValues: DimensionStringValues,
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/dimensions/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDimensionRequest",
}) as any as S.Schema<UpdateDimensionRequest>;
export interface AuthorizerConfig {
  defaultAuthorizerName?: string;
  allowAuthorizerOverride?: boolean;
}
export const AuthorizerConfig = S.suspend(() =>
  S.Struct({
    defaultAuthorizerName: S.optional(S.String),
    allowAuthorizerOverride: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AuthorizerConfig",
}) as any as S.Schema<AuthorizerConfig>;
export interface TlsConfig {
  securityPolicy?: string;
}
export const TlsConfig = S.suspend(() =>
  S.Struct({ securityPolicy: S.optional(S.String) }),
).annotations({ identifier: "TlsConfig" }) as any as S.Schema<TlsConfig>;
export interface ServerCertificateConfig {
  enableOCSPCheck?: boolean;
  ocspLambdaArn?: string;
  ocspAuthorizedResponderArn?: string;
}
export const ServerCertificateConfig = S.suspend(() =>
  S.Struct({
    enableOCSPCheck: S.optional(S.Boolean),
    ocspLambdaArn: S.optional(S.String),
    ocspAuthorizedResponderArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ServerCertificateConfig",
}) as any as S.Schema<ServerCertificateConfig>;
export interface ClientCertificateConfig {
  clientCertificateCallbackArn?: string;
}
export const ClientCertificateConfig = S.suspend(() =>
  S.Struct({ clientCertificateCallbackArn: S.optional(S.String) }),
).annotations({
  identifier: "ClientCertificateConfig",
}) as any as S.Schema<ClientCertificateConfig>;
export interface UpdateDomainConfigurationRequest {
  domainConfigurationName: string;
  authorizerConfig?: AuthorizerConfig;
  domainConfigurationStatus?: DomainConfigurationStatus;
  removeAuthorizerConfig?: boolean;
  tlsConfig?: TlsConfig;
  serverCertificateConfig?: ServerCertificateConfig;
  authenticationType?: AuthenticationType;
  applicationProtocol?: ApplicationProtocol;
  clientCertificateConfig?: ClientCertificateConfig;
}
export const UpdateDomainConfigurationRequest = S.suspend(() =>
  S.Struct({
    domainConfigurationName: S.String.pipe(
      T.HttpLabel("domainConfigurationName"),
    ),
    authorizerConfig: S.optional(AuthorizerConfig),
    domainConfigurationStatus: S.optional(DomainConfigurationStatus),
    removeAuthorizerConfig: S.optional(S.Boolean),
    tlsConfig: S.optional(TlsConfig),
    serverCertificateConfig: S.optional(ServerCertificateConfig),
    authenticationType: S.optional(AuthenticationType),
    applicationProtocol: S.optional(ApplicationProtocol),
    clientCertificateConfig: S.optional(ClientCertificateConfig),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/domainConfigurations/{domainConfigurationName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDomainConfigurationRequest",
}) as any as S.Schema<UpdateDomainConfigurationRequest>;
export interface UpdateDynamicThingGroupRequest {
  thingGroupName: string;
  thingGroupProperties: ThingGroupProperties;
  expectedVersion?: number;
  indexName?: string;
  queryString?: string;
  queryVersion?: string;
}
export const UpdateDynamicThingGroupRequest = S.suspend(() =>
  S.Struct({
    thingGroupName: S.String.pipe(T.HttpLabel("thingGroupName")),
    thingGroupProperties: ThingGroupProperties,
    expectedVersion: S.optional(S.Number),
    indexName: S.optional(S.String),
    queryString: S.optional(S.String),
    queryVersion: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/dynamic-thing-groups/{thingGroupName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDynamicThingGroupRequest",
}) as any as S.Schema<UpdateDynamicThingGroupRequest>;
export interface UpdateEncryptionConfigurationRequest {
  encryptionType: EncryptionType;
  kmsKeyArn?: string;
  kmsAccessRoleArn?: string;
}
export const UpdateEncryptionConfigurationRequest = S.suspend(() =>
  S.Struct({
    encryptionType: EncryptionType,
    kmsKeyArn: S.optional(S.String),
    kmsAccessRoleArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/encryption-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEncryptionConfigurationRequest",
}) as any as S.Schema<UpdateEncryptionConfigurationRequest>;
export interface UpdateEncryptionConfigurationResponse {}
export const UpdateEncryptionConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateEncryptionConfigurationResponse",
}) as any as S.Schema<UpdateEncryptionConfigurationResponse>;
export type EventType =
  | "THING"
  | "THING_GROUP"
  | "THING_TYPE"
  | "THING_GROUP_MEMBERSHIP"
  | "THING_GROUP_HIERARCHY"
  | "THING_TYPE_ASSOCIATION"
  | "JOB"
  | "JOB_EXECUTION"
  | "POLICY"
  | "CERTIFICATE"
  | "CA_CERTIFICATE";
export const EventType = S.Literal(
  "THING",
  "THING_GROUP",
  "THING_TYPE",
  "THING_GROUP_MEMBERSHIP",
  "THING_GROUP_HIERARCHY",
  "THING_TYPE_ASSOCIATION",
  "JOB",
  "JOB_EXECUTION",
  "POLICY",
  "CERTIFICATE",
  "CA_CERTIFICATE",
);
export interface Configuration {
  Enabled?: boolean;
}
export const Configuration = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "Configuration",
}) as any as S.Schema<Configuration>;
export type EventConfigurations = { [key in EventType]?: Configuration };
export const EventConfigurations = S.partial(
  S.Record({ key: EventType, value: Configuration }),
);
export interface UpdateEventConfigurationsRequest {
  eventConfigurations?: { [key: string]: Configuration };
}
export const UpdateEventConfigurationsRequest = S.suspend(() =>
  S.Struct({ eventConfigurations: S.optional(EventConfigurations) }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/event-configurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEventConfigurationsRequest",
}) as any as S.Schema<UpdateEventConfigurationsRequest>;
export interface UpdateEventConfigurationsResponse {}
export const UpdateEventConfigurationsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateEventConfigurationsResponse",
}) as any as S.Schema<UpdateEventConfigurationsResponse>;
export type AggregationTypeName = "Statistics" | "Percentiles" | "Cardinality";
export const AggregationTypeName = S.Literal(
  "Statistics",
  "Percentiles",
  "Cardinality",
);
export type AggregationTypeValues = string[];
export const AggregationTypeValues = S.Array(S.String);
export interface AggregationType {
  name: AggregationTypeName;
  values?: string[];
}
export const AggregationType = S.suspend(() =>
  S.Struct({
    name: AggregationTypeName,
    values: S.optional(AggregationTypeValues),
  }),
).annotations({
  identifier: "AggregationType",
}) as any as S.Schema<AggregationType>;
export interface UpdateFleetMetricRequest {
  metricName: string;
  queryString?: string;
  aggregationType?: AggregationType;
  period?: number;
  aggregationField?: string;
  description?: string;
  queryVersion?: string;
  indexName: string;
  unit?: FleetMetricUnit;
  expectedVersion?: number;
}
export const UpdateFleetMetricRequest = S.suspend(() =>
  S.Struct({
    metricName: S.String.pipe(T.HttpLabel("metricName")),
    queryString: S.optional(S.String),
    aggregationType: S.optional(AggregationType),
    period: S.optional(S.Number),
    aggregationField: S.optional(S.String),
    description: S.optional(S.String),
    queryVersion: S.optional(S.String),
    indexName: S.String,
    unit: S.optional(FleetMetricUnit),
    expectedVersion: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/fleet-metric/{metricName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFleetMetricRequest",
}) as any as S.Schema<UpdateFleetMetricRequest>;
export interface UpdateFleetMetricResponse {}
export const UpdateFleetMetricResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateFleetMetricResponse",
}) as any as S.Schema<UpdateFleetMetricResponse>;
export type ThingIndexingMode = "OFF" | "REGISTRY" | "REGISTRY_AND_SHADOW";
export const ThingIndexingMode = S.Literal(
  "OFF",
  "REGISTRY",
  "REGISTRY_AND_SHADOW",
);
export type ThingConnectivityIndexingMode = "OFF" | "STATUS";
export const ThingConnectivityIndexingMode = S.Literal("OFF", "STATUS");
export type DeviceDefenderIndexingMode = "OFF" | "VIOLATIONS";
export const DeviceDefenderIndexingMode = S.Literal("OFF", "VIOLATIONS");
export type NamedShadowIndexingMode = "OFF" | "ON";
export const NamedShadowIndexingMode = S.Literal("OFF", "ON");
export type FieldType = "Number" | "String" | "Boolean";
export const FieldType = S.Literal("Number", "String", "Boolean");
export interface Field {
  name?: string;
  type?: FieldType;
}
export const Field = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), type: S.optional(FieldType) }),
).annotations({ identifier: "Field" }) as any as S.Schema<Field>;
export type Fields = Field[];
export const Fields = S.Array(Field);
export type NamedShadowNamesFilter = string[];
export const NamedShadowNamesFilter = S.Array(S.String);
export type TargetFieldOrder = "LatLon" | "LonLat";
export const TargetFieldOrder = S.Literal("LatLon", "LonLat");
export interface GeoLocationTarget {
  name?: string;
  order?: TargetFieldOrder;
}
export const GeoLocationTarget = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), order: S.optional(TargetFieldOrder) }),
).annotations({
  identifier: "GeoLocationTarget",
}) as any as S.Schema<GeoLocationTarget>;
export type GeoLocationsFilter = GeoLocationTarget[];
export const GeoLocationsFilter = S.Array(GeoLocationTarget);
export interface IndexingFilter {
  namedShadowNames?: string[];
  geoLocations?: GeoLocationTarget[];
}
export const IndexingFilter = S.suspend(() =>
  S.Struct({
    namedShadowNames: S.optional(NamedShadowNamesFilter),
    geoLocations: S.optional(GeoLocationsFilter),
  }),
).annotations({
  identifier: "IndexingFilter",
}) as any as S.Schema<IndexingFilter>;
export interface ThingIndexingConfiguration {
  thingIndexingMode: ThingIndexingMode;
  thingConnectivityIndexingMode?: ThingConnectivityIndexingMode;
  deviceDefenderIndexingMode?: DeviceDefenderIndexingMode;
  namedShadowIndexingMode?: NamedShadowIndexingMode;
  managedFields?: Field[];
  customFields?: Field[];
  filter?: IndexingFilter;
}
export const ThingIndexingConfiguration = S.suspend(() =>
  S.Struct({
    thingIndexingMode: ThingIndexingMode,
    thingConnectivityIndexingMode: S.optional(ThingConnectivityIndexingMode),
    deviceDefenderIndexingMode: S.optional(DeviceDefenderIndexingMode),
    namedShadowIndexingMode: S.optional(NamedShadowIndexingMode),
    managedFields: S.optional(Fields),
    customFields: S.optional(Fields),
    filter: S.optional(IndexingFilter),
  }),
).annotations({
  identifier: "ThingIndexingConfiguration",
}) as any as S.Schema<ThingIndexingConfiguration>;
export type ThingGroupIndexingMode = "OFF" | "ON";
export const ThingGroupIndexingMode = S.Literal("OFF", "ON");
export interface ThingGroupIndexingConfiguration {
  thingGroupIndexingMode: ThingGroupIndexingMode;
  managedFields?: Field[];
  customFields?: Field[];
}
export const ThingGroupIndexingConfiguration = S.suspend(() =>
  S.Struct({
    thingGroupIndexingMode: ThingGroupIndexingMode,
    managedFields: S.optional(Fields),
    customFields: S.optional(Fields),
  }),
).annotations({
  identifier: "ThingGroupIndexingConfiguration",
}) as any as S.Schema<ThingGroupIndexingConfiguration>;
export interface UpdateIndexingConfigurationRequest {
  thingIndexingConfiguration?: ThingIndexingConfiguration;
  thingGroupIndexingConfiguration?: ThingGroupIndexingConfiguration;
}
export const UpdateIndexingConfigurationRequest = S.suspend(() =>
  S.Struct({
    thingIndexingConfiguration: S.optional(ThingIndexingConfiguration),
    thingGroupIndexingConfiguration: S.optional(
      ThingGroupIndexingConfiguration,
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/indexing/config" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateIndexingConfigurationRequest",
}) as any as S.Schema<UpdateIndexingConfigurationRequest>;
export interface UpdateIndexingConfigurationResponse {}
export const UpdateIndexingConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateIndexingConfigurationResponse",
}) as any as S.Schema<UpdateIndexingConfigurationResponse>;
export interface PresignedUrlConfig {
  roleArn?: string;
  expiresInSec?: number;
}
export const PresignedUrlConfig = S.suspend(() =>
  S.Struct({
    roleArn: S.optional(S.String),
    expiresInSec: S.optional(S.Number),
  }),
).annotations({
  identifier: "PresignedUrlConfig",
}) as any as S.Schema<PresignedUrlConfig>;
export interface RateIncreaseCriteria {
  numberOfNotifiedThings?: number;
  numberOfSucceededThings?: number;
}
export const RateIncreaseCriteria = S.suspend(() =>
  S.Struct({
    numberOfNotifiedThings: S.optional(S.Number),
    numberOfSucceededThings: S.optional(S.Number),
  }),
).annotations({
  identifier: "RateIncreaseCriteria",
}) as any as S.Schema<RateIncreaseCriteria>;
export interface ExponentialRolloutRate {
  baseRatePerMinute: number;
  incrementFactor: number;
  rateIncreaseCriteria: RateIncreaseCriteria;
}
export const ExponentialRolloutRate = S.suspend(() =>
  S.Struct({
    baseRatePerMinute: S.Number,
    incrementFactor: S.Number,
    rateIncreaseCriteria: RateIncreaseCriteria,
  }),
).annotations({
  identifier: "ExponentialRolloutRate",
}) as any as S.Schema<ExponentialRolloutRate>;
export interface JobExecutionsRolloutConfig {
  maximumPerMinute?: number;
  exponentialRate?: ExponentialRolloutRate;
}
export const JobExecutionsRolloutConfig = S.suspend(() =>
  S.Struct({
    maximumPerMinute: S.optional(S.Number),
    exponentialRate: S.optional(ExponentialRolloutRate),
  }),
).annotations({
  identifier: "JobExecutionsRolloutConfig",
}) as any as S.Schema<JobExecutionsRolloutConfig>;
export type JobExecutionFailureType =
  | "FAILED"
  | "REJECTED"
  | "TIMED_OUT"
  | "ALL";
export const JobExecutionFailureType = S.Literal(
  "FAILED",
  "REJECTED",
  "TIMED_OUT",
  "ALL",
);
export type AbortAction = "CANCEL";
export const AbortAction = S.Literal("CANCEL");
export interface AbortCriteria {
  failureType: JobExecutionFailureType;
  action: AbortAction;
  thresholdPercentage: number;
  minNumberOfExecutedThings: number;
}
export const AbortCriteria = S.suspend(() =>
  S.Struct({
    failureType: JobExecutionFailureType,
    action: AbortAction,
    thresholdPercentage: S.Number,
    minNumberOfExecutedThings: S.Number,
  }),
).annotations({
  identifier: "AbortCriteria",
}) as any as S.Schema<AbortCriteria>;
export type AbortCriteriaList = AbortCriteria[];
export const AbortCriteriaList = S.Array(AbortCriteria);
export interface AbortConfig {
  criteriaList: AbortCriteria[];
}
export const AbortConfig = S.suspend(() =>
  S.Struct({ criteriaList: AbortCriteriaList }),
).annotations({ identifier: "AbortConfig" }) as any as S.Schema<AbortConfig>;
export interface TimeoutConfig {
  inProgressTimeoutInMinutes?: number;
}
export const TimeoutConfig = S.suspend(() =>
  S.Struct({ inProgressTimeoutInMinutes: S.optional(S.Number) }),
).annotations({
  identifier: "TimeoutConfig",
}) as any as S.Schema<TimeoutConfig>;
export type RetryableFailureType = "FAILED" | "TIMED_OUT" | "ALL";
export const RetryableFailureType = S.Literal("FAILED", "TIMED_OUT", "ALL");
export interface RetryCriteria {
  failureType: RetryableFailureType;
  numberOfRetries: number;
}
export const RetryCriteria = S.suspend(() =>
  S.Struct({ failureType: RetryableFailureType, numberOfRetries: S.Number }),
).annotations({
  identifier: "RetryCriteria",
}) as any as S.Schema<RetryCriteria>;
export type RetryCriteriaList = RetryCriteria[];
export const RetryCriteriaList = S.Array(RetryCriteria);
export interface JobExecutionsRetryConfig {
  criteriaList: RetryCriteria[];
}
export const JobExecutionsRetryConfig = S.suspend(() =>
  S.Struct({ criteriaList: RetryCriteriaList }),
).annotations({
  identifier: "JobExecutionsRetryConfig",
}) as any as S.Schema<JobExecutionsRetryConfig>;
export interface UpdateJobRequest {
  jobId: string;
  description?: string;
  presignedUrlConfig?: PresignedUrlConfig;
  jobExecutionsRolloutConfig?: JobExecutionsRolloutConfig;
  abortConfig?: AbortConfig;
  timeoutConfig?: TimeoutConfig;
  namespaceId?: string;
  jobExecutionsRetryConfig?: JobExecutionsRetryConfig;
}
export const UpdateJobRequest = S.suspend(() =>
  S.Struct({
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    description: S.optional(S.String),
    presignedUrlConfig: S.optional(PresignedUrlConfig),
    jobExecutionsRolloutConfig: S.optional(JobExecutionsRolloutConfig),
    abortConfig: S.optional(AbortConfig),
    timeoutConfig: S.optional(TimeoutConfig),
    namespaceId: S.optional(S.String).pipe(T.HttpQuery("namespaceId")),
    jobExecutionsRetryConfig: S.optional(JobExecutionsRetryConfig),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/jobs/{jobId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateJobRequest",
}) as any as S.Schema<UpdateJobRequest>;
export interface UpdateJobResponse {}
export const UpdateJobResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateJobResponse",
}) as any as S.Schema<UpdateJobResponse>;
export type DeviceCertificateUpdateAction = "DEACTIVATE";
export const DeviceCertificateUpdateAction = S.Literal("DEACTIVATE");
export interface UpdateDeviceCertificateParams {
  action: DeviceCertificateUpdateAction;
}
export const UpdateDeviceCertificateParams = S.suspend(() =>
  S.Struct({ action: DeviceCertificateUpdateAction }),
).annotations({
  identifier: "UpdateDeviceCertificateParams",
}) as any as S.Schema<UpdateDeviceCertificateParams>;
export type CACertificateUpdateAction = "DEACTIVATE";
export const CACertificateUpdateAction = S.Literal("DEACTIVATE");
export interface UpdateCACertificateParams {
  action: CACertificateUpdateAction;
}
export const UpdateCACertificateParams = S.suspend(() =>
  S.Struct({ action: CACertificateUpdateAction }),
).annotations({
  identifier: "UpdateCACertificateParams",
}) as any as S.Schema<UpdateCACertificateParams>;
export type ThingGroupNames = string[];
export const ThingGroupNames = S.Array(S.String);
export interface AddThingsToThingGroupParams {
  thingGroupNames: string[];
  overrideDynamicGroups?: boolean;
}
export const AddThingsToThingGroupParams = S.suspend(() =>
  S.Struct({
    thingGroupNames: ThingGroupNames,
    overrideDynamicGroups: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AddThingsToThingGroupParams",
}) as any as S.Schema<AddThingsToThingGroupParams>;
export type PolicyTemplateName = "BLANK_POLICY";
export const PolicyTemplateName = S.Literal("BLANK_POLICY");
export interface ReplaceDefaultPolicyVersionParams {
  templateName: PolicyTemplateName;
}
export const ReplaceDefaultPolicyVersionParams = S.suspend(() =>
  S.Struct({ templateName: PolicyTemplateName }),
).annotations({
  identifier: "ReplaceDefaultPolicyVersionParams",
}) as any as S.Schema<ReplaceDefaultPolicyVersionParams>;
export interface EnableIoTLoggingParams {
  roleArnForLogging: string;
  logLevel: LogLevel;
}
export const EnableIoTLoggingParams = S.suspend(() =>
  S.Struct({ roleArnForLogging: S.String, logLevel: LogLevel }),
).annotations({
  identifier: "EnableIoTLoggingParams",
}) as any as S.Schema<EnableIoTLoggingParams>;
export interface PublishFindingToSnsParams {
  topicArn: string;
}
export const PublishFindingToSnsParams = S.suspend(() =>
  S.Struct({ topicArn: S.String }),
).annotations({
  identifier: "PublishFindingToSnsParams",
}) as any as S.Schema<PublishFindingToSnsParams>;
export interface MitigationActionParams {
  updateDeviceCertificateParams?: UpdateDeviceCertificateParams;
  updateCACertificateParams?: UpdateCACertificateParams;
  addThingsToThingGroupParams?: AddThingsToThingGroupParams;
  replaceDefaultPolicyVersionParams?: ReplaceDefaultPolicyVersionParams;
  enableIoTLoggingParams?: EnableIoTLoggingParams;
  publishFindingToSnsParams?: PublishFindingToSnsParams;
}
export const MitigationActionParams = S.suspend(() =>
  S.Struct({
    updateDeviceCertificateParams: S.optional(UpdateDeviceCertificateParams),
    updateCACertificateParams: S.optional(UpdateCACertificateParams),
    addThingsToThingGroupParams: S.optional(AddThingsToThingGroupParams),
    replaceDefaultPolicyVersionParams: S.optional(
      ReplaceDefaultPolicyVersionParams,
    ),
    enableIoTLoggingParams: S.optional(EnableIoTLoggingParams),
    publishFindingToSnsParams: S.optional(PublishFindingToSnsParams),
  }),
).annotations({
  identifier: "MitigationActionParams",
}) as any as S.Schema<MitigationActionParams>;
export interface UpdateMitigationActionRequest {
  actionName: string;
  roleArn?: string;
  actionParams?: MitigationActionParams;
}
export const UpdateMitigationActionRequest = S.suspend(() =>
  S.Struct({
    actionName: S.String.pipe(T.HttpLabel("actionName")),
    roleArn: S.optional(S.String),
    actionParams: S.optional(MitigationActionParams),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/mitigationactions/actions/{actionName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMitigationActionRequest",
}) as any as S.Schema<UpdateMitigationActionRequest>;
export interface UpdatePackageRequest {
  packageName: string;
  description?: string | redacted.Redacted<string>;
  defaultVersionName?: string;
  unsetDefaultVersion?: boolean;
  clientToken?: string;
}
export const UpdatePackageRequest = S.suspend(() =>
  S.Struct({
    packageName: S.String.pipe(T.HttpLabel("packageName")),
    description: S.optional(SensitiveString),
    defaultVersionName: S.optional(S.String),
    unsetDefaultVersion: S.optional(S.Boolean),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/packages/{packageName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePackageRequest",
}) as any as S.Schema<UpdatePackageRequest>;
export interface UpdatePackageResponse {}
export const UpdatePackageResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdatePackageResponse",
}) as any as S.Schema<UpdatePackageResponse>;
export interface VersionUpdateByJobsConfig {
  enabled?: boolean;
  roleArn?: string;
}
export const VersionUpdateByJobsConfig = S.suspend(() =>
  S.Struct({ enabled: S.optional(S.Boolean), roleArn: S.optional(S.String) }),
).annotations({
  identifier: "VersionUpdateByJobsConfig",
}) as any as S.Schema<VersionUpdateByJobsConfig>;
export interface UpdatePackageConfigurationRequest {
  versionUpdateByJobsConfig?: VersionUpdateByJobsConfig;
  clientToken?: string;
}
export const UpdatePackageConfigurationRequest = S.suspend(() =>
  S.Struct({
    versionUpdateByJobsConfig: S.optional(VersionUpdateByJobsConfig),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/package-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePackageConfigurationRequest",
}) as any as S.Schema<UpdatePackageConfigurationRequest>;
export interface UpdatePackageConfigurationResponse {}
export const UpdatePackageConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdatePackageConfigurationResponse",
}) as any as S.Schema<UpdatePackageConfigurationResponse>;
export type ResourceAttributes = { [key: string]: string };
export const ResourceAttributes = S.Record({ key: S.String, value: S.String });
export interface S3Location {
  bucket?: string;
  key?: string;
  version?: string;
}
export const S3Location = S.suspend(() =>
  S.Struct({
    bucket: S.optional(S.String),
    key: S.optional(S.String),
    version: S.optional(S.String),
  }),
).annotations({ identifier: "S3Location" }) as any as S.Schema<S3Location>;
export interface PackageVersionArtifact {
  s3Location?: S3Location;
}
export const PackageVersionArtifact = S.suspend(() =>
  S.Struct({ s3Location: S.optional(S3Location) }),
).annotations({
  identifier: "PackageVersionArtifact",
}) as any as S.Schema<PackageVersionArtifact>;
export interface UpdatePackageVersionRequest {
  packageName: string;
  versionName: string;
  description?: string | redacted.Redacted<string>;
  attributes?: { [key: string]: string };
  artifact?: PackageVersionArtifact;
  action?: PackageVersionAction;
  recipe?: string | redacted.Redacted<string>;
  clientToken?: string;
}
export const UpdatePackageVersionRequest = S.suspend(() =>
  S.Struct({
    packageName: S.String.pipe(T.HttpLabel("packageName")),
    versionName: S.String.pipe(T.HttpLabel("versionName")),
    description: S.optional(SensitiveString),
    attributes: S.optional(ResourceAttributes),
    artifact: S.optional(PackageVersionArtifact),
    action: S.optional(PackageVersionAction),
    recipe: S.optional(SensitiveString),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/packages/{packageName}/versions/{versionName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePackageVersionRequest",
}) as any as S.Schema<UpdatePackageVersionRequest>;
export interface UpdatePackageVersionResponse {}
export const UpdatePackageVersionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdatePackageVersionResponse",
}) as any as S.Schema<UpdatePackageVersionResponse>;
export interface ProvisioningHook {
  payloadVersion?: string;
  targetArn: string;
}
export const ProvisioningHook = S.suspend(() =>
  S.Struct({ payloadVersion: S.optional(S.String), targetArn: S.String }),
).annotations({
  identifier: "ProvisioningHook",
}) as any as S.Schema<ProvisioningHook>;
export interface UpdateProvisioningTemplateRequest {
  templateName: string;
  description?: string;
  enabled?: boolean;
  defaultVersionId?: number;
  provisioningRoleArn?: string;
  preProvisioningHook?: ProvisioningHook;
  removePreProvisioningHook?: boolean;
}
export const UpdateProvisioningTemplateRequest = S.suspend(() =>
  S.Struct({
    templateName: S.String.pipe(T.HttpLabel("templateName")),
    description: S.optional(S.String),
    enabled: S.optional(S.Boolean),
    defaultVersionId: S.optional(S.Number),
    provisioningRoleArn: S.optional(S.String),
    preProvisioningHook: S.optional(ProvisioningHook),
    removePreProvisioningHook: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/provisioning-templates/{templateName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateProvisioningTemplateRequest",
}) as any as S.Schema<UpdateProvisioningTemplateRequest>;
export interface UpdateProvisioningTemplateResponse {}
export const UpdateProvisioningTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateProvisioningTemplateResponse",
}) as any as S.Schema<UpdateProvisioningTemplateResponse>;
export interface UpdateRoleAliasRequest {
  roleAlias: string;
  roleArn?: string;
  credentialDurationSeconds?: number;
}
export const UpdateRoleAliasRequest = S.suspend(() =>
  S.Struct({
    roleAlias: S.String.pipe(T.HttpLabel("roleAlias")),
    roleArn: S.optional(S.String),
    credentialDurationSeconds: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/role-aliases/{roleAlias}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRoleAliasRequest",
}) as any as S.Schema<UpdateRoleAliasRequest>;
export interface UpdateScheduledAuditRequest {
  frequency?: AuditFrequency;
  dayOfMonth?: string;
  dayOfWeek?: DayOfWeek;
  targetCheckNames?: string[];
  scheduledAuditName: string;
}
export const UpdateScheduledAuditRequest = S.suspend(() =>
  S.Struct({
    frequency: S.optional(AuditFrequency),
    dayOfMonth: S.optional(S.String),
    dayOfWeek: S.optional(DayOfWeek),
    targetCheckNames: S.optional(TargetAuditCheckNames),
    scheduledAuditName: S.String.pipe(T.HttpLabel("scheduledAuditName")),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/audit/scheduledaudits/{scheduledAuditName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateScheduledAuditRequest",
}) as any as S.Schema<UpdateScheduledAuditRequest>;
export interface MetricDimension {
  dimensionName: string;
  operator?: DimensionValueOperator;
}
export const MetricDimension = S.suspend(() =>
  S.Struct({
    dimensionName: S.String,
    operator: S.optional(DimensionValueOperator),
  }),
).annotations({
  identifier: "MetricDimension",
}) as any as S.Schema<MetricDimension>;
export type ComparisonOperator =
  | "less-than"
  | "less-than-equals"
  | "greater-than"
  | "greater-than-equals"
  | "in-cidr-set"
  | "not-in-cidr-set"
  | "in-port-set"
  | "not-in-port-set"
  | "in-set"
  | "not-in-set";
export const ComparisonOperator = S.Literal(
  "less-than",
  "less-than-equals",
  "greater-than",
  "greater-than-equals",
  "in-cidr-set",
  "not-in-cidr-set",
  "in-port-set",
  "not-in-port-set",
  "in-set",
  "not-in-set",
);
export type Cidrs = string[];
export const Cidrs = S.Array(S.String);
export type Ports = number[];
export const Ports = S.Array(S.Number);
export type NumberList = number[];
export const NumberList = S.Array(S.Number);
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface MetricValue {
  count?: number;
  cidrs?: string[];
  ports?: number[];
  number?: number;
  numbers?: number[];
  strings?: string[];
}
export const MetricValue = S.suspend(() =>
  S.Struct({
    count: S.optional(S.Number),
    cidrs: S.optional(Cidrs),
    ports: S.optional(Ports),
    number: S.optional(S.Number),
    numbers: S.optional(NumberList),
    strings: S.optional(StringList),
  }),
).annotations({ identifier: "MetricValue" }) as any as S.Schema<MetricValue>;
export interface StatisticalThreshold {
  statistic?: string;
}
export const StatisticalThreshold = S.suspend(() =>
  S.Struct({ statistic: S.optional(S.String) }),
).annotations({
  identifier: "StatisticalThreshold",
}) as any as S.Schema<StatisticalThreshold>;
export type ConfidenceLevel = "LOW" | "MEDIUM" | "HIGH";
export const ConfidenceLevel = S.Literal("LOW", "MEDIUM", "HIGH");
export interface MachineLearningDetectionConfig {
  confidenceLevel: ConfidenceLevel;
}
export const MachineLearningDetectionConfig = S.suspend(() =>
  S.Struct({ confidenceLevel: ConfidenceLevel }),
).annotations({
  identifier: "MachineLearningDetectionConfig",
}) as any as S.Schema<MachineLearningDetectionConfig>;
export interface BehaviorCriteria {
  comparisonOperator?: ComparisonOperator;
  value?: MetricValue;
  durationSeconds?: number;
  consecutiveDatapointsToAlarm?: number;
  consecutiveDatapointsToClear?: number;
  statisticalThreshold?: StatisticalThreshold;
  mlDetectionConfig?: MachineLearningDetectionConfig;
}
export const BehaviorCriteria = S.suspend(() =>
  S.Struct({
    comparisonOperator: S.optional(ComparisonOperator),
    value: S.optional(MetricValue),
    durationSeconds: S.optional(S.Number),
    consecutiveDatapointsToAlarm: S.optional(S.Number),
    consecutiveDatapointsToClear: S.optional(S.Number),
    statisticalThreshold: S.optional(StatisticalThreshold),
    mlDetectionConfig: S.optional(MachineLearningDetectionConfig),
  }),
).annotations({
  identifier: "BehaviorCriteria",
}) as any as S.Schema<BehaviorCriteria>;
export interface Behavior {
  name: string;
  metric?: string;
  metricDimension?: MetricDimension;
  criteria?: BehaviorCriteria;
  suppressAlerts?: boolean;
  exportMetric?: boolean;
}
export const Behavior = S.suspend(() =>
  S.Struct({
    name: S.String,
    metric: S.optional(S.String),
    metricDimension: S.optional(MetricDimension),
    criteria: S.optional(BehaviorCriteria),
    suppressAlerts: S.optional(S.Boolean),
    exportMetric: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Behavior" }) as any as S.Schema<Behavior>;
export type Behaviors = Behavior[];
export const Behaviors = S.Array(Behavior);
export type AlertTargetType = "SNS";
export const AlertTargetType = S.Literal("SNS");
export interface AlertTarget {
  alertTargetArn: string;
  roleArn: string;
}
export const AlertTarget = S.suspend(() =>
  S.Struct({ alertTargetArn: S.String, roleArn: S.String }),
).annotations({ identifier: "AlertTarget" }) as any as S.Schema<AlertTarget>;
export type AlertTargets = { [key in AlertTargetType]?: AlertTarget };
export const AlertTargets = S.partial(
  S.Record({ key: AlertTargetType, value: AlertTarget }),
);
export interface MetricToRetain {
  metric: string;
  metricDimension?: MetricDimension;
  exportMetric?: boolean;
}
export const MetricToRetain = S.suspend(() =>
  S.Struct({
    metric: S.String,
    metricDimension: S.optional(MetricDimension),
    exportMetric: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "MetricToRetain",
}) as any as S.Schema<MetricToRetain>;
export type AdditionalMetricsToRetainV2List = MetricToRetain[];
export const AdditionalMetricsToRetainV2List = S.Array(MetricToRetain);
export interface MetricsExportConfig {
  mqttTopic: string;
  roleArn: string;
}
export const MetricsExportConfig = S.suspend(() =>
  S.Struct({ mqttTopic: S.String, roleArn: S.String }),
).annotations({
  identifier: "MetricsExportConfig",
}) as any as S.Schema<MetricsExportConfig>;
export interface UpdateSecurityProfileRequest {
  securityProfileName: string;
  securityProfileDescription?: string;
  behaviors?: Behavior[];
  alertTargets?: { [key: string]: AlertTarget };
  additionalMetricsToRetain?: string[];
  additionalMetricsToRetainV2?: MetricToRetain[];
  deleteBehaviors?: boolean;
  deleteAlertTargets?: boolean;
  deleteAdditionalMetricsToRetain?: boolean;
  expectedVersion?: number;
  metricsExportConfig?: MetricsExportConfig;
  deleteMetricsExportConfig?: boolean;
}
export const UpdateSecurityProfileRequest = S.suspend(() =>
  S.Struct({
    securityProfileName: S.String.pipe(T.HttpLabel("securityProfileName")),
    securityProfileDescription: S.optional(S.String),
    behaviors: S.optional(Behaviors),
    alertTargets: S.optional(AlertTargets),
    additionalMetricsToRetain: S.optional(AdditionalMetricsToRetainList),
    additionalMetricsToRetainV2: S.optional(AdditionalMetricsToRetainV2List),
    deleteBehaviors: S.optional(S.Boolean),
    deleteAlertTargets: S.optional(S.Boolean),
    deleteAdditionalMetricsToRetain: S.optional(S.Boolean),
    expectedVersion: S.optional(S.Number).pipe(T.HttpQuery("expectedVersion")),
    metricsExportConfig: S.optional(MetricsExportConfig),
    deleteMetricsExportConfig: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/security-profiles/{securityProfileName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSecurityProfileRequest",
}) as any as S.Schema<UpdateSecurityProfileRequest>;
export interface StreamFile {
  fileId?: number;
  s3Location?: S3Location;
}
export const StreamFile = S.suspend(() =>
  S.Struct({
    fileId: S.optional(S.Number),
    s3Location: S.optional(S3Location),
  }),
).annotations({ identifier: "StreamFile" }) as any as S.Schema<StreamFile>;
export type StreamFiles = StreamFile[];
export const StreamFiles = S.Array(StreamFile);
export interface UpdateStreamRequest {
  streamId: string;
  description?: string;
  files?: StreamFile[];
  roleArn?: string;
}
export const UpdateStreamRequest = S.suspend(() =>
  S.Struct({
    streamId: S.String.pipe(T.HttpLabel("streamId")),
    description: S.optional(S.String),
    files: S.optional(StreamFiles),
    roleArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/streams/{streamId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateStreamRequest",
}) as any as S.Schema<UpdateStreamRequest>;
export interface UpdateThingRequest {
  thingName: string;
  thingTypeName?: string;
  attributePayload?: AttributePayload;
  expectedVersion?: number;
  removeThingType?: boolean;
}
export const UpdateThingRequest = S.suspend(() =>
  S.Struct({
    thingName: S.String.pipe(T.HttpLabel("thingName")),
    thingTypeName: S.optional(S.String),
    attributePayload: S.optional(AttributePayload),
    expectedVersion: S.optional(S.Number),
    removeThingType: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/things/{thingName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateThingRequest",
}) as any as S.Schema<UpdateThingRequest>;
export interface UpdateThingResponse {}
export const UpdateThingResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateThingResponse",
}) as any as S.Schema<UpdateThingResponse>;
export interface UpdateThingGroupRequest {
  thingGroupName: string;
  thingGroupProperties: ThingGroupProperties;
  expectedVersion?: number;
}
export const UpdateThingGroupRequest = S.suspend(() =>
  S.Struct({
    thingGroupName: S.String.pipe(T.HttpLabel("thingGroupName")),
    thingGroupProperties: ThingGroupProperties,
    expectedVersion: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/thing-groups/{thingGroupName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateThingGroupRequest",
}) as any as S.Schema<UpdateThingGroupRequest>;
export interface UpdateThingGroupsForThingRequest {
  thingName?: string;
  thingGroupsToAdd?: string[];
  thingGroupsToRemove?: string[];
  overrideDynamicGroups?: boolean;
}
export const UpdateThingGroupsForThingRequest = S.suspend(() =>
  S.Struct({
    thingName: S.optional(S.String),
    thingGroupsToAdd: S.optional(ThingGroupList),
    thingGroupsToRemove: S.optional(ThingGroupList),
    overrideDynamicGroups: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/thing-groups/updateThingGroupsForThing" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateThingGroupsForThingRequest",
}) as any as S.Schema<UpdateThingGroupsForThingRequest>;
export interface UpdateThingGroupsForThingResponse {}
export const UpdateThingGroupsForThingResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateThingGroupsForThingResponse",
}) as any as S.Schema<UpdateThingGroupsForThingResponse>;
export type SearchableAttributes = string[];
export const SearchableAttributes = S.Array(S.String);
export interface PropagatingAttribute {
  userPropertyKey?: string;
  thingAttribute?: string;
  connectionAttribute?: string;
}
export const PropagatingAttribute = S.suspend(() =>
  S.Struct({
    userPropertyKey: S.optional(S.String),
    thingAttribute: S.optional(S.String),
    connectionAttribute: S.optional(S.String),
  }),
).annotations({
  identifier: "PropagatingAttribute",
}) as any as S.Schema<PropagatingAttribute>;
export type PropagatingAttributeList = PropagatingAttribute[];
export const PropagatingAttributeList = S.Array(PropagatingAttribute);
export interface Mqtt5Configuration {
  propagatingAttributes?: PropagatingAttribute[];
}
export const Mqtt5Configuration = S.suspend(() =>
  S.Struct({ propagatingAttributes: S.optional(PropagatingAttributeList) }),
).annotations({
  identifier: "Mqtt5Configuration",
}) as any as S.Schema<Mqtt5Configuration>;
export interface ThingTypeProperties {
  thingTypeDescription?: string;
  searchableAttributes?: string[];
  mqtt5Configuration?: Mqtt5Configuration;
}
export const ThingTypeProperties = S.suspend(() =>
  S.Struct({
    thingTypeDescription: S.optional(S.String),
    searchableAttributes: S.optional(SearchableAttributes),
    mqtt5Configuration: S.optional(Mqtt5Configuration),
  }),
).annotations({
  identifier: "ThingTypeProperties",
}) as any as S.Schema<ThingTypeProperties>;
export interface UpdateThingTypeRequest {
  thingTypeName: string;
  thingTypeProperties?: ThingTypeProperties;
}
export const UpdateThingTypeRequest = S.suspend(() =>
  S.Struct({
    thingTypeName: S.String.pipe(T.HttpLabel("thingTypeName")),
    thingTypeProperties: S.optional(ThingTypeProperties),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/thing-types/{thingTypeName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateThingTypeRequest",
}) as any as S.Schema<UpdateThingTypeRequest>;
export interface UpdateThingTypeResponse {}
export const UpdateThingTypeResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateThingTypeResponse",
}) as any as S.Schema<UpdateThingTypeResponse>;
export interface UpdateTopicRuleDestinationRequest {
  arn: string;
  status: TopicRuleDestinationStatus;
}
export const UpdateTopicRuleDestinationRequest = S.suspend(() =>
  S.Struct({ arn: S.String, status: TopicRuleDestinationStatus }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/destinations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTopicRuleDestinationRequest",
}) as any as S.Schema<UpdateTopicRuleDestinationRequest>;
export interface UpdateTopicRuleDestinationResponse {}
export const UpdateTopicRuleDestinationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateTopicRuleDestinationResponse",
}) as any as S.Schema<UpdateTopicRuleDestinationResponse>;
export interface ValidateSecurityProfileBehaviorsRequest {
  behaviors: Behavior[];
}
export const ValidateSecurityProfileBehaviorsRequest = S.suspend(() =>
  S.Struct({ behaviors: Behaviors }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/security-profile-behaviors/validate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ValidateSecurityProfileBehaviorsRequest",
}) as any as S.Schema<ValidateSecurityProfileBehaviorsRequest>;
export type CommandParameterType =
  | "STRING"
  | "INTEGER"
  | "DOUBLE"
  | "LONG"
  | "UNSIGNEDLONG"
  | "BOOLEAN"
  | "BINARY";
export const CommandParameterType = S.Literal(
  "STRING",
  "INTEGER",
  "DOUBLE",
  "LONG",
  "UNSIGNEDLONG",
  "BOOLEAN",
  "BINARY",
);
export type JobEndBehavior = "STOP_ROLLOUT" | "CANCEL" | "FORCE_CANCEL";
export const JobEndBehavior = S.Literal(
  "STOP_ROLLOUT",
  "CANCEL",
  "FORCE_CANCEL",
);
export type ConfigurationStatus = "HEALTHY" | "UNHEALTHY";
export const ConfigurationStatus = S.Literal("HEALTHY", "UNHEALTHY");
export type FindingIds = string[];
export const FindingIds = S.Array(S.String);
export type MitigationActionNameList = string[];
export const MitigationActionNameList = S.Array(S.String);
export type TargetViolationIdsForDetectMitigationActions = string[];
export const TargetViolationIdsForDetectMitigationActions = S.Array(S.String);
export type ActionType = "PUBLISH" | "SUBSCRIBE" | "RECEIVE" | "CONNECT";
export const ActionType = S.Literal(
  "PUBLISH",
  "SUBSCRIBE",
  "RECEIVE",
  "CONNECT",
);
export type Resources = string[];
export const Resources = S.Array(S.String);
export type DetailsMap = { [key: string]: string };
export const DetailsMap = S.Record({ key: S.String, value: S.String });
export interface CommandPayload {
  content?: Uint8Array;
  contentType?: string;
}
export const CommandPayload = S.suspend(() =>
  S.Struct({ content: S.optional(T.Blob), contentType: S.optional(S.String) }),
).annotations({
  identifier: "CommandPayload",
}) as any as S.Schema<CommandPayload>;
export type ParameterMap = { [key: string]: string };
export const ParameterMap = S.Record({ key: S.String, value: S.String });
export interface MaintenanceWindow {
  startTime: string;
  durationInMinutes: number;
}
export const MaintenanceWindow = S.suspend(() =>
  S.Struct({ startTime: S.String, durationInMinutes: S.Number }),
).annotations({
  identifier: "MaintenanceWindow",
}) as any as S.Schema<MaintenanceWindow>;
export type MaintenanceWindows = MaintenanceWindow[];
export const MaintenanceWindows = S.Array(MaintenanceWindow);
export interface SchedulingConfig {
  startTime?: string;
  endTime?: string;
  endBehavior?: JobEndBehavior;
  maintenanceWindows?: MaintenanceWindow[];
}
export const SchedulingConfig = S.suspend(() =>
  S.Struct({
    startTime: S.optional(S.String),
    endTime: S.optional(S.String),
    endBehavior: S.optional(JobEndBehavior),
    maintenanceWindows: S.optional(MaintenanceWindows),
  }),
).annotations({
  identifier: "SchedulingConfig",
}) as any as S.Schema<SchedulingConfig>;
export interface AwsJobPresignedUrlConfig {
  expiresInSec?: number;
}
export const AwsJobPresignedUrlConfig = S.suspend(() =>
  S.Struct({ expiresInSec: S.optional(S.Number) }),
).annotations({
  identifier: "AwsJobPresignedUrlConfig",
}) as any as S.Schema<AwsJobPresignedUrlConfig>;
export interface AwsJobTimeoutConfig {
  inProgressTimeoutInMinutes?: number;
}
export const AwsJobTimeoutConfig = S.suspend(() =>
  S.Struct({ inProgressTimeoutInMinutes: S.optional(S.Number) }),
).annotations({
  identifier: "AwsJobTimeoutConfig",
}) as any as S.Schema<AwsJobTimeoutConfig>;
export type AdditionalParameterMap = { [key: string]: string };
export const AdditionalParameterMap = S.Record({
  key: S.String,
  value: S.String,
});
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface AuthorizerDescription {
  authorizerName?: string;
  authorizerArn?: string;
  authorizerFunctionArn?: string;
  tokenKeyName?: string;
  tokenSigningPublicKeys?: { [key: string]: string };
  status?: AuthorizerStatus;
  creationDate?: Date;
  lastModifiedDate?: Date;
  signingDisabled?: boolean;
  enableCachingForHttp?: boolean;
}
export const AuthorizerDescription = S.suspend(() =>
  S.Struct({
    authorizerName: S.optional(S.String),
    authorizerArn: S.optional(S.String),
    authorizerFunctionArn: S.optional(S.String),
    tokenKeyName: S.optional(S.String),
    tokenSigningPublicKeys: S.optional(PublicKeyMap),
    status: S.optional(AuthorizerStatus),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    signingDisabled: S.optional(S.Boolean),
    enableCachingForHttp: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AuthorizerDescription",
}) as any as S.Schema<AuthorizerDescription>;
export type DomainType = "ENDPOINT" | "AWS_MANAGED" | "CUSTOMER_MANAGED";
export const DomainType = S.Literal(
  "ENDPOINT",
  "AWS_MANAGED",
  "CUSTOMER_MANAGED",
);
export interface ConfigurationDetails {
  configurationStatus?: ConfigurationStatus;
  errorCode?: string;
  errorMessage?: string;
}
export const ConfigurationDetails = S.suspend(() =>
  S.Struct({
    configurationStatus: S.optional(ConfigurationStatus),
    errorCode: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "ConfigurationDetails",
}) as any as S.Schema<ConfigurationDetails>;
export type IndexStatus = "ACTIVE" | "BUILDING" | "REBUILDING";
export const IndexStatus = S.Literal("ACTIVE", "BUILDING", "REBUILDING");
export type Environments = string[];
export const Environments = S.Array(S.String);
export type DynamicGroupStatus = "ACTIVE" | "BUILDING" | "REBUILDING";
export const DynamicGroupStatus = S.Literal("ACTIVE", "BUILDING", "REBUILDING");
export type SbomValidationStatus = "IN_PROGRESS" | "FAILED" | "SUCCEEDED";
export const SbomValidationStatus = S.Literal(
  "IN_PROGRESS",
  "FAILED",
  "SUCCEEDED",
);
export type DisconnectReasonValue =
  | "AUTH_ERROR"
  | "CLIENT_INITIATED_DISCONNECT"
  | "CLIENT_ERROR"
  | "CONNECTION_LOST"
  | "DUPLICATE_CLIENTID"
  | "FORBIDDEN_ACCESS"
  | "MQTT_KEEP_ALIVE_TIMEOUT"
  | "SERVER_ERROR"
  | "SERVER_INITIATED_DISCONNECT"
  | "THROTTLED"
  | "WEBSOCKET_TTL_EXPIRATION"
  | "CUSTOMAUTH_TTL_EXPIRATION"
  | "UNKNOWN"
  | "NONE";
export const DisconnectReasonValue = S.Literal(
  "AUTH_ERROR",
  "CLIENT_INITIATED_DISCONNECT",
  "CLIENT_ERROR",
  "CONNECTION_LOST",
  "DUPLICATE_CLIENTID",
  "FORBIDDEN_ACCESS",
  "MQTT_KEEP_ALIVE_TIMEOUT",
  "SERVER_ERROR",
  "SERVER_INITIATED_DISCONNECT",
  "THROTTLED",
  "WEBSOCKET_TTL_EXPIRATION",
  "CUSTOMAUTH_TTL_EXPIRATION",
  "UNKNOWN",
  "NONE",
);
export type AuditFindingSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export const AuditFindingSeverity = S.Literal(
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW",
);
export type ResourceType =
  | "DEVICE_CERTIFICATE"
  | "CA_CERTIFICATE"
  | "IOT_POLICY"
  | "COGNITO_IDENTITY_POOL"
  | "CLIENT_ID"
  | "ACCOUNT_SETTINGS"
  | "ROLE_ALIAS"
  | "IAM_ROLE"
  | "ISSUER_CERTIFICATE";
export const ResourceType = S.Literal(
  "DEVICE_CERTIFICATE",
  "CA_CERTIFICATE",
  "IOT_POLICY",
  "COGNITO_IDENTITY_POOL",
  "CLIENT_ID",
  "ACCOUNT_SETTINGS",
  "ROLE_ALIAS",
  "IAM_ROLE",
  "ISSUER_CERTIFICATE",
);
export type StringMap = { [key: string]: string };
export const StringMap = S.Record({ key: S.String, value: S.String });
export interface NonCompliantResource {
  resourceType?: ResourceType;
  resourceIdentifier?: ResourceIdentifier;
  additionalInfo?: { [key: string]: string };
}
export const NonCompliantResource = S.suspend(() =>
  S.Struct({
    resourceType: S.optional(ResourceType),
    resourceIdentifier: S.optional(ResourceIdentifier),
    additionalInfo: S.optional(StringMap),
  }),
).annotations({
  identifier: "NonCompliantResource",
}) as any as S.Schema<NonCompliantResource>;
export interface RelatedResource {
  resourceType?: ResourceType;
  resourceIdentifier?: ResourceIdentifier;
  additionalInfo?: { [key: string]: string };
}
export const RelatedResource = S.suspend(() =>
  S.Struct({
    resourceType: S.optional(ResourceType),
    resourceIdentifier: S.optional(ResourceIdentifier),
    additionalInfo: S.optional(StringMap),
  }),
).annotations({
  identifier: "RelatedResource",
}) as any as S.Schema<RelatedResource>;
export type RelatedResources = RelatedResource[];
export const RelatedResources = S.Array(RelatedResource);
export interface AuditFinding {
  findingId?: string;
  taskId?: string;
  checkName?: string;
  taskStartTime?: Date;
  findingTime?: Date;
  severity?: AuditFindingSeverity;
  nonCompliantResource?: NonCompliantResource;
  relatedResources?: RelatedResource[];
  reasonForNonCompliance?: string;
  reasonForNonComplianceCode?: string;
  isSuppressed?: boolean;
}
export const AuditFinding = S.suspend(() =>
  S.Struct({
    findingId: S.optional(S.String),
    taskId: S.optional(S.String),
    checkName: S.optional(S.String),
    taskStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    findingTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    severity: S.optional(AuditFindingSeverity),
    nonCompliantResource: S.optional(NonCompliantResource),
    relatedResources: S.optional(RelatedResources),
    reasonForNonCompliance: S.optional(S.String),
    reasonForNonComplianceCode: S.optional(S.String),
    isSuppressed: S.optional(S.Boolean),
  }),
).annotations({ identifier: "AuditFinding" }) as any as S.Schema<AuditFinding>;
export type AuditFindings = AuditFinding[];
export const AuditFindings = S.Array(AuditFinding);
export interface TimeFilter {
  after?: string;
  before?: string;
}
export const TimeFilter = S.suspend(() =>
  S.Struct({ after: S.optional(S.String), before: S.optional(S.String) }),
).annotations({ identifier: "TimeFilter" }) as any as S.Schema<TimeFilter>;
export type MetricNames = string[];
export const MetricNames = S.Array(S.String);
export type DetectMitigationActionsTaskStatus =
  | "IN_PROGRESS"
  | "SUCCESSFUL"
  | "FAILED"
  | "CANCELED";
export const DetectMitigationActionsTaskStatus = S.Literal(
  "IN_PROGRESS",
  "SUCCESSFUL",
  "FAILED",
  "CANCELED",
);
export interface DetectMitigationActionsTaskTarget {
  violationIds?: string[];
  securityProfileName?: string;
  behaviorName?: string;
}
export const DetectMitigationActionsTaskTarget = S.suspend(() =>
  S.Struct({
    violationIds: S.optional(TargetViolationIdsForDetectMitigationActions),
    securityProfileName: S.optional(S.String),
    behaviorName: S.optional(S.String),
  }),
).annotations({
  identifier: "DetectMitigationActionsTaskTarget",
}) as any as S.Schema<DetectMitigationActionsTaskTarget>;
export interface ViolationEventOccurrenceRange {
  startTime: Date;
  endTime: Date;
}
export const ViolationEventOccurrenceRange = S.suspend(() =>
  S.Struct({
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ViolationEventOccurrenceRange",
}) as any as S.Schema<ViolationEventOccurrenceRange>;
export interface MitigationAction {
  name?: string;
  id?: string;
  roleArn?: string;
  actionParams?: MitigationActionParams;
}
export const MitigationAction = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    id: S.optional(S.String),
    roleArn: S.optional(S.String),
    actionParams: S.optional(MitigationActionParams),
  }),
).annotations({
  identifier: "MitigationAction",
}) as any as S.Schema<MitigationAction>;
export type MitigationActionList = MitigationAction[];
export const MitigationActionList = S.Array(MitigationAction);
export interface DetectMitigationActionsTaskStatistics {
  actionsExecuted?: number;
  actionsSkipped?: number;
  actionsFailed?: number;
}
export const DetectMitigationActionsTaskStatistics = S.suspend(() =>
  S.Struct({
    actionsExecuted: S.optional(S.Number),
    actionsSkipped: S.optional(S.Number),
    actionsFailed: S.optional(S.Number),
  }),
).annotations({
  identifier: "DetectMitigationActionsTaskStatistics",
}) as any as S.Schema<DetectMitigationActionsTaskStatistics>;
export interface DetectMitigationActionsTaskSummary {
  taskId?: string;
  taskStatus?: DetectMitigationActionsTaskStatus;
  taskStartTime?: Date;
  taskEndTime?: Date;
  target?: DetectMitigationActionsTaskTarget;
  violationEventOccurrenceRange?: ViolationEventOccurrenceRange;
  onlyActiveViolationsIncluded?: boolean;
  suppressedAlertsIncluded?: boolean;
  actionsDefinition?: MitigationAction[];
  taskStatistics?: DetectMitigationActionsTaskStatistics;
}
export const DetectMitigationActionsTaskSummary = S.suspend(() =>
  S.Struct({
    taskId: S.optional(S.String),
    taskStatus: S.optional(DetectMitigationActionsTaskStatus),
    taskStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    taskEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    target: S.optional(DetectMitigationActionsTaskTarget),
    violationEventOccurrenceRange: S.optional(ViolationEventOccurrenceRange),
    onlyActiveViolationsIncluded: S.optional(S.Boolean),
    suppressedAlertsIncluded: S.optional(S.Boolean),
    actionsDefinition: S.optional(MitigationActionList),
    taskStatistics: S.optional(DetectMitigationActionsTaskStatistics),
  }),
).annotations({
  identifier: "DetectMitigationActionsTaskSummary",
}) as any as S.Schema<DetectMitigationActionsTaskSummary>;
export type DetectMitigationActionsTaskSummaryList =
  DetectMitigationActionsTaskSummary[];
export const DetectMitigationActionsTaskSummaryList = S.Array(
  DetectMitigationActionsTaskSummary,
);
export type DimensionNames = string[];
export const DimensionNames = S.Array(S.String);
export type IndexNamesList = string[];
export const IndexNamesList = S.Array(S.String);
export type Principals = string[];
export const Principals = S.Array(S.String);
export type ThingNameList = string[];
export const ThingNameList = S.Array(S.String);
export type RoleAliases = string[];
export const RoleAliases = S.Array(S.String);
export type PolicyTargets = string[];
export const PolicyTargets = S.Array(S.String);
export interface GroupNameAndArn {
  groupName?: string;
  groupArn?: string;
}
export const GroupNameAndArn = S.suspend(() =>
  S.Struct({ groupName: S.optional(S.String), groupArn: S.optional(S.String) }),
).annotations({
  identifier: "GroupNameAndArn",
}) as any as S.Schema<GroupNameAndArn>;
export type ThingGroupNameAndArnList = GroupNameAndArn[];
export const ThingGroupNameAndArnList = S.Array(GroupNameAndArn);
export type S3FileUrlList = string[];
export const S3FileUrlList = S.Array(S.String);
export type TaskIdList = string[];
export const TaskIdList = S.Array(S.String);
export type Parameters = { [key: string]: string };
export const Parameters = S.Record({ key: S.String, value: S.String });
export interface LoggingOptionsPayload {
  roleArn: string;
  logLevel?: LogLevel;
}
export const LoggingOptionsPayload = S.suspend(() =>
  S.Struct({ roleArn: S.String, logLevel: S.optional(LogLevel) }),
).annotations({
  identifier: "LoggingOptionsPayload",
}) as any as S.Schema<LoggingOptionsPayload>;
export interface LogTarget {
  targetType: LogTargetType;
  targetName?: string;
}
export const LogTarget = S.suspend(() =>
  S.Struct({ targetType: LogTargetType, targetName: S.optional(S.String) }),
).annotations({ identifier: "LogTarget" }) as any as S.Schema<LogTarget>;
export interface LogEventConfiguration {
  eventType: string;
  logLevel?: LogLevel;
  logDestination?: string;
}
export const LogEventConfiguration = S.suspend(() =>
  S.Struct({
    eventType: S.String,
    logLevel: S.optional(LogLevel),
    logDestination: S.optional(S.String),
  }),
).annotations({
  identifier: "LogEventConfiguration",
}) as any as S.Schema<LogEventConfiguration>;
export type LogEventConfigurations = LogEventConfiguration[];
export const LogEventConfigurations = S.Array(LogEventConfiguration);
export type AuditCheckToActionsMapping = { [key: string]: string[] };
export const AuditCheckToActionsMapping = S.Record({
  key: S.String,
  value: MitigationActionNameList,
});
export interface AuthInfo {
  actionType?: ActionType;
  resources: string[];
}
export const AuthInfo = S.suspend(() =>
  S.Struct({ actionType: S.optional(ActionType), resources: Resources }),
).annotations({ identifier: "AuthInfo" }) as any as S.Schema<AuthInfo>;
export type AuthInfos = AuthInfo[];
export const AuthInfos = S.Array(AuthInfo);
export interface MqttContext {
  username?: string;
  password?: Uint8Array;
  clientId?: string;
}
export const MqttContext = S.suspend(() =>
  S.Struct({
    username: S.optional(S.String),
    password: S.optional(T.Blob),
    clientId: S.optional(S.String),
  }),
).annotations({ identifier: "MqttContext" }) as any as S.Schema<MqttContext>;
export interface TlsContext {
  serverName?: string;
}
export const TlsContext = S.suspend(() =>
  S.Struct({ serverName: S.optional(S.String) }),
).annotations({ identifier: "TlsContext" }) as any as S.Schema<TlsContext>;
export type OutputFormat = "JSON" | "CBOR";
export const OutputFormat = S.Literal("JSON", "CBOR");
export type CommandParameterValueComparisonOperator =
  | "EQUALS"
  | "NOT_EQUALS"
  | "LESS_THAN"
  | "LESS_THAN_EQUALS"
  | "GREATER_THAN"
  | "GREATER_THAN_EQUALS"
  | "IN_SET"
  | "NOT_IN_SET"
  | "IN_RANGE"
  | "NOT_IN_RANGE";
export const CommandParameterValueComparisonOperator = S.Literal(
  "EQUALS",
  "NOT_EQUALS",
  "LESS_THAN",
  "LESS_THAN_EQUALS",
  "GREATER_THAN",
  "GREATER_THAN_EQUALS",
  "IN_SET",
  "NOT_IN_SET",
  "IN_RANGE",
  "NOT_IN_RANGE",
);
export type AwsJobAbortCriteriaFailureType =
  | "FAILED"
  | "REJECTED"
  | "TIMED_OUT"
  | "ALL";
export const AwsJobAbortCriteriaFailureType = S.Literal(
  "FAILED",
  "REJECTED",
  "TIMED_OUT",
  "ALL",
);
export type AwsJobAbortCriteriaAbortAction = "CANCEL";
export const AwsJobAbortCriteriaAbortAction = S.Literal("CANCEL");
export type SubnetIdList = string[];
export const SubnetIdList = S.Array(S.String);
export type SecurityGroupList = string[];
export const SecurityGroupList = S.Array(S.String);
export type ReasonForNonComplianceCodes = string[];
export const ReasonForNonComplianceCodes = S.Array(S.String);
export interface AssociateTargetsWithJobResponse {
  jobArn?: string;
  jobId?: string;
  description?: string;
}
export const AssociateTargetsWithJobResponse = S.suspend(() =>
  S.Struct({
    jobArn: S.optional(S.String),
    jobId: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "AssociateTargetsWithJobResponse",
}) as any as S.Schema<AssociateTargetsWithJobResponse>;
export interface CancelJobResponse {
  jobArn?: string;
  jobId?: string;
  description?: string;
}
export const CancelJobResponse = S.suspend(() =>
  S.Struct({
    jobArn: S.optional(S.String),
    jobId: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "CancelJobResponse",
}) as any as S.Schema<CancelJobResponse>;
export interface CancelJobExecutionRequest {
  jobId: string;
  thingName: string;
  force?: boolean;
  expectedVersion?: number;
  statusDetails?: { [key: string]: string };
}
export const CancelJobExecutionRequest = S.suspend(() =>
  S.Struct({
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    thingName: S.String.pipe(T.HttpLabel("thingName")),
    force: S.optional(S.Boolean).pipe(T.HttpQuery("force")),
    expectedVersion: S.optional(S.Number),
    statusDetails: S.optional(DetailsMap),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/things/{thingName}/jobs/{jobId}/cancel" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelJobExecutionRequest",
}) as any as S.Schema<CancelJobExecutionRequest>;
export interface CancelJobExecutionResponse {}
export const CancelJobExecutionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelJobExecutionResponse",
}) as any as S.Schema<CancelJobExecutionResponse>;
export interface CreateAuthorizerRequest {
  authorizerName: string;
  authorizerFunctionArn: string;
  tokenKeyName?: string;
  tokenSigningPublicKeys?: { [key: string]: string };
  status?: AuthorizerStatus;
  tags?: Tag[];
  signingDisabled?: boolean;
  enableCachingForHttp?: boolean;
}
export const CreateAuthorizerRequest = S.suspend(() =>
  S.Struct({
    authorizerName: S.String.pipe(T.HttpLabel("authorizerName")),
    authorizerFunctionArn: S.String,
    tokenKeyName: S.optional(S.String),
    tokenSigningPublicKeys: S.optional(PublicKeyMap),
    status: S.optional(AuthorizerStatus),
    tags: S.optional(TagList),
    signingDisabled: S.optional(S.Boolean),
    enableCachingForHttp: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/authorizer/{authorizerName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAuthorizerRequest",
}) as any as S.Schema<CreateAuthorizerRequest>;
export interface CreateBillingGroupRequest {
  billingGroupName: string;
  billingGroupProperties?: BillingGroupProperties;
  tags?: Tag[];
}
export const CreateBillingGroupRequest = S.suspend(() =>
  S.Struct({
    billingGroupName: S.String.pipe(T.HttpLabel("billingGroupName")),
    billingGroupProperties: S.optional(BillingGroupProperties),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/billing-groups/{billingGroupName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBillingGroupRequest",
}) as any as S.Schema<CreateBillingGroupRequest>;
export interface CreateCertificateFromCsrResponse {
  certificateArn?: string;
  certificateId?: string;
  certificatePem?: string;
}
export const CreateCertificateFromCsrResponse = S.suspend(() =>
  S.Struct({
    certificateArn: S.optional(S.String),
    certificateId: S.optional(S.String),
    certificatePem: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateCertificateFromCsrResponse",
}) as any as S.Schema<CreateCertificateFromCsrResponse>;
export interface CreateCertificateProviderResponse {
  certificateProviderName?: string;
  certificateProviderArn?: string;
}
export const CreateCertificateProviderResponse = S.suspend(() =>
  S.Struct({
    certificateProviderName: S.optional(S.String),
    certificateProviderArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateCertificateProviderResponse",
}) as any as S.Schema<CreateCertificateProviderResponse>;
export interface CreateCustomMetricResponse {
  metricName?: string;
  metricArn?: string;
}
export const CreateCustomMetricResponse = S.suspend(() =>
  S.Struct({
    metricName: S.optional(S.String),
    metricArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateCustomMetricResponse",
}) as any as S.Schema<CreateCustomMetricResponse>;
export interface CreateDimensionResponse {
  name?: string;
  arn?: string;
}
export const CreateDimensionResponse = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), arn: S.optional(S.String) }),
).annotations({
  identifier: "CreateDimensionResponse",
}) as any as S.Schema<CreateDimensionResponse>;
export interface CreateDomainConfigurationRequest {
  domainConfigurationName: string;
  domainName?: string;
  serverCertificateArns?: string[];
  validationCertificateArn?: string;
  authorizerConfig?: AuthorizerConfig;
  serviceType?: ServiceType;
  tags?: Tag[];
  tlsConfig?: TlsConfig;
  serverCertificateConfig?: ServerCertificateConfig;
  authenticationType?: AuthenticationType;
  applicationProtocol?: ApplicationProtocol;
  clientCertificateConfig?: ClientCertificateConfig;
}
export const CreateDomainConfigurationRequest = S.suspend(() =>
  S.Struct({
    domainConfigurationName: S.String.pipe(
      T.HttpLabel("domainConfigurationName"),
    ),
    domainName: S.optional(S.String),
    serverCertificateArns: S.optional(ServerCertificateArns),
    validationCertificateArn: S.optional(S.String),
    authorizerConfig: S.optional(AuthorizerConfig),
    serviceType: S.optional(ServiceType),
    tags: S.optional(TagList),
    tlsConfig: S.optional(TlsConfig),
    serverCertificateConfig: S.optional(ServerCertificateConfig),
    authenticationType: S.optional(AuthenticationType),
    applicationProtocol: S.optional(ApplicationProtocol),
    clientCertificateConfig: S.optional(ClientCertificateConfig),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domainConfigurations/{domainConfigurationName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDomainConfigurationRequest",
}) as any as S.Schema<CreateDomainConfigurationRequest>;
export interface CreateDynamicThingGroupRequest {
  thingGroupName: string;
  thingGroupProperties?: ThingGroupProperties;
  indexName?: string;
  queryString: string;
  queryVersion?: string;
  tags?: Tag[];
}
export const CreateDynamicThingGroupRequest = S.suspend(() =>
  S.Struct({
    thingGroupName: S.String.pipe(T.HttpLabel("thingGroupName")),
    thingGroupProperties: S.optional(ThingGroupProperties),
    indexName: S.optional(S.String),
    queryString: S.String,
    queryVersion: S.optional(S.String),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/dynamic-thing-groups/{thingGroupName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDynamicThingGroupRequest",
}) as any as S.Schema<CreateDynamicThingGroupRequest>;
export interface CreateFleetMetricRequest {
  metricName: string;
  queryString: string;
  aggregationType: AggregationType;
  period: number;
  aggregationField: string;
  description?: string;
  queryVersion?: string;
  indexName?: string;
  unit?: FleetMetricUnit;
  tags?: Tag[];
}
export const CreateFleetMetricRequest = S.suspend(() =>
  S.Struct({
    metricName: S.String.pipe(T.HttpLabel("metricName")),
    queryString: S.String,
    aggregationType: AggregationType,
    period: S.Number,
    aggregationField: S.String,
    description: S.optional(S.String),
    queryVersion: S.optional(S.String),
    indexName: S.optional(S.String),
    unit: S.optional(FleetMetricUnit),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/fleet-metric/{metricName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFleetMetricRequest",
}) as any as S.Schema<CreateFleetMetricRequest>;
export interface CreateJobTemplateRequest {
  jobTemplateId: string;
  jobArn?: string;
  documentSource?: string;
  document?: string;
  description: string;
  presignedUrlConfig?: PresignedUrlConfig;
  jobExecutionsRolloutConfig?: JobExecutionsRolloutConfig;
  abortConfig?: AbortConfig;
  timeoutConfig?: TimeoutConfig;
  tags?: Tag[];
  jobExecutionsRetryConfig?: JobExecutionsRetryConfig;
  maintenanceWindows?: MaintenanceWindow[];
  destinationPackageVersions?: string[];
}
export const CreateJobTemplateRequest = S.suspend(() =>
  S.Struct({
    jobTemplateId: S.String.pipe(T.HttpLabel("jobTemplateId")),
    jobArn: S.optional(S.String),
    documentSource: S.optional(S.String),
    document: S.optional(S.String),
    description: S.String,
    presignedUrlConfig: S.optional(PresignedUrlConfig),
    jobExecutionsRolloutConfig: S.optional(JobExecutionsRolloutConfig),
    abortConfig: S.optional(AbortConfig),
    timeoutConfig: S.optional(TimeoutConfig),
    tags: S.optional(TagList),
    jobExecutionsRetryConfig: S.optional(JobExecutionsRetryConfig),
    maintenanceWindows: S.optional(MaintenanceWindows),
    destinationPackageVersions: S.optional(DestinationPackageVersions),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/job-templates/{jobTemplateId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateJobTemplateRequest",
}) as any as S.Schema<CreateJobTemplateRequest>;
export interface CreatePackageRequest {
  packageName: string;
  description?: string | redacted.Redacted<string>;
  tags?: { [key: string]: string };
  clientToken?: string;
}
export const CreatePackageRequest = S.suspend(() =>
  S.Struct({
    packageName: S.String.pipe(T.HttpLabel("packageName")),
    description: S.optional(SensitiveString),
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/packages/{packageName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePackageRequest",
}) as any as S.Schema<CreatePackageRequest>;
export interface CreatePackageVersionRequest {
  packageName: string;
  versionName: string;
  description?: string | redacted.Redacted<string>;
  attributes?: { [key: string]: string };
  artifact?: PackageVersionArtifact;
  recipe?: string | redacted.Redacted<string>;
  tags?: { [key: string]: string };
  clientToken?: string;
}
export const CreatePackageVersionRequest = S.suspend(() =>
  S.Struct({
    packageName: S.String.pipe(T.HttpLabel("packageName")),
    versionName: S.String.pipe(T.HttpLabel("versionName")),
    description: S.optional(SensitiveString),
    attributes: S.optional(ResourceAttributes),
    artifact: S.optional(PackageVersionArtifact),
    recipe: S.optional(SensitiveString),
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/packages/{packageName}/versions/{versionName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePackageVersionRequest",
}) as any as S.Schema<CreatePackageVersionRequest>;
export interface CreatePolicyResponse {
  policyName?: string;
  policyArn?: string;
  policyDocument?: string;
  policyVersionId?: string;
}
export const CreatePolicyResponse = S.suspend(() =>
  S.Struct({
    policyName: S.optional(S.String),
    policyArn: S.optional(S.String),
    policyDocument: S.optional(S.String),
    policyVersionId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreatePolicyResponse",
}) as any as S.Schema<CreatePolicyResponse>;
export interface CreatePolicyVersionResponse {
  policyArn?: string;
  policyDocument?: string;
  policyVersionId?: string;
  isDefaultVersion?: boolean;
}
export const CreatePolicyVersionResponse = S.suspend(() =>
  S.Struct({
    policyArn: S.optional(S.String),
    policyDocument: S.optional(S.String),
    policyVersionId: S.optional(S.String),
    isDefaultVersion: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CreatePolicyVersionResponse",
}) as any as S.Schema<CreatePolicyVersionResponse>;
export interface KeyPair {
  PublicKey?: string;
  PrivateKey?: string | redacted.Redacted<string>;
}
export const KeyPair = S.suspend(() =>
  S.Struct({
    PublicKey: S.optional(S.String),
    PrivateKey: S.optional(SensitiveString),
  }),
).annotations({ identifier: "KeyPair" }) as any as S.Schema<KeyPair>;
export interface CreateProvisioningClaimResponse {
  certificateId?: string;
  certificatePem?: string;
  keyPair?: KeyPair;
  expiration?: Date;
}
export const CreateProvisioningClaimResponse = S.suspend(() =>
  S.Struct({
    certificateId: S.optional(S.String),
    certificatePem: S.optional(S.String),
    keyPair: S.optional(KeyPair),
    expiration: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "CreateProvisioningClaimResponse",
}) as any as S.Schema<CreateProvisioningClaimResponse>;
export interface CreateProvisioningTemplateRequest {
  templateName: string;
  description?: string;
  templateBody: string;
  enabled?: boolean;
  provisioningRoleArn: string;
  preProvisioningHook?: ProvisioningHook;
  tags?: Tag[];
  type?: TemplateType;
}
export const CreateProvisioningTemplateRequest = S.suspend(() =>
  S.Struct({
    templateName: S.String,
    description: S.optional(S.String),
    templateBody: S.String,
    enabled: S.optional(S.Boolean),
    provisioningRoleArn: S.String,
    preProvisioningHook: S.optional(ProvisioningHook),
    tags: S.optional(TagList),
    type: S.optional(TemplateType),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/provisioning-templates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProvisioningTemplateRequest",
}) as any as S.Schema<CreateProvisioningTemplateRequest>;
export interface CreateProvisioningTemplateVersionResponse {
  templateArn?: string;
  templateName?: string;
  versionId?: number;
  isDefaultVersion?: boolean;
}
export const CreateProvisioningTemplateVersionResponse = S.suspend(() =>
  S.Struct({
    templateArn: S.optional(S.String),
    templateName: S.optional(S.String),
    versionId: S.optional(S.Number),
    isDefaultVersion: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CreateProvisioningTemplateVersionResponse",
}) as any as S.Schema<CreateProvisioningTemplateVersionResponse>;
export interface CreateRoleAliasResponse {
  roleAlias?: string;
  roleAliasArn?: string;
}
export const CreateRoleAliasResponse = S.suspend(() =>
  S.Struct({
    roleAlias: S.optional(S.String),
    roleAliasArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateRoleAliasResponse",
}) as any as S.Schema<CreateRoleAliasResponse>;
export interface CreateScheduledAuditResponse {
  scheduledAuditArn?: string;
}
export const CreateScheduledAuditResponse = S.suspend(() =>
  S.Struct({ scheduledAuditArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateScheduledAuditResponse",
}) as any as S.Schema<CreateScheduledAuditResponse>;
export interface CreateStreamRequest {
  streamId: string;
  description?: string;
  files: StreamFile[];
  roleArn: string;
  tags?: Tag[];
}
export const CreateStreamRequest = S.suspend(() =>
  S.Struct({
    streamId: S.String.pipe(T.HttpLabel("streamId")),
    description: S.optional(S.String),
    files: StreamFiles,
    roleArn: S.String,
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/streams/{streamId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateStreamRequest",
}) as any as S.Schema<CreateStreamRequest>;
export interface CreateThingGroupResponse {
  thingGroupName?: string;
  thingGroupArn?: string;
  thingGroupId?: string;
}
export const CreateThingGroupResponse = S.suspend(() =>
  S.Struct({
    thingGroupName: S.optional(S.String),
    thingGroupArn: S.optional(S.String),
    thingGroupId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateThingGroupResponse",
}) as any as S.Schema<CreateThingGroupResponse>;
export interface DeleteCommandResponse {
  statusCode?: number;
}
export const DeleteCommandResponse = S.suspend(() =>
  S.Struct({ statusCode: S.optional(S.Number).pipe(T.HttpResponseCode()) }),
).annotations({
  identifier: "DeleteCommandResponse",
}) as any as S.Schema<DeleteCommandResponse>;
export interface DescribeAuditSuppressionResponse {
  checkName?: string;
  resourceIdentifier?: ResourceIdentifier;
  expirationDate?: Date;
  suppressIndefinitely?: boolean;
  description?: string;
}
export const DescribeAuditSuppressionResponse = S.suspend(() =>
  S.Struct({
    checkName: S.optional(S.String),
    resourceIdentifier: S.optional(ResourceIdentifier),
    expirationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    suppressIndefinitely: S.optional(S.Boolean),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeAuditSuppressionResponse",
}) as any as S.Schema<DescribeAuditSuppressionResponse>;
export interface DescribeAuthorizerResponse {
  authorizerDescription?: AuthorizerDescription;
}
export const DescribeAuthorizerResponse = S.suspend(() =>
  S.Struct({ authorizerDescription: S.optional(AuthorizerDescription) }),
).annotations({
  identifier: "DescribeAuthorizerResponse",
}) as any as S.Schema<DescribeAuthorizerResponse>;
export interface DescribeCertificateProviderResponse {
  certificateProviderName?: string;
  certificateProviderArn?: string;
  lambdaFunctionArn?: string;
  accountDefaultForOperations?: CertificateProviderOperation[];
  creationDate?: Date;
  lastModifiedDate?: Date;
}
export const DescribeCertificateProviderResponse = S.suspend(() =>
  S.Struct({
    certificateProviderName: S.optional(S.String),
    certificateProviderArn: S.optional(S.String),
    lambdaFunctionArn: S.optional(S.String),
    accountDefaultForOperations: S.optional(
      CertificateProviderAccountDefaultForOperations,
    ),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DescribeCertificateProviderResponse",
}) as any as S.Schema<DescribeCertificateProviderResponse>;
export interface DescribeCustomMetricResponse {
  metricName?: string;
  metricArn?: string;
  metricType?: CustomMetricType;
  displayName?: string;
  creationDate?: Date;
  lastModifiedDate?: Date;
}
export const DescribeCustomMetricResponse = S.suspend(() =>
  S.Struct({
    metricName: S.optional(S.String),
    metricArn: S.optional(S.String),
    metricType: S.optional(CustomMetricType),
    displayName: S.optional(S.String),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DescribeCustomMetricResponse",
}) as any as S.Schema<DescribeCustomMetricResponse>;
export interface DescribeDefaultAuthorizerResponse {
  authorizerDescription?: AuthorizerDescription;
}
export const DescribeDefaultAuthorizerResponse = S.suspend(() =>
  S.Struct({ authorizerDescription: S.optional(AuthorizerDescription) }),
).annotations({
  identifier: "DescribeDefaultAuthorizerResponse",
}) as any as S.Schema<DescribeDefaultAuthorizerResponse>;
export interface DescribeDimensionResponse {
  name?: string;
  arn?: string;
  type?: DimensionType;
  stringValues?: string[];
  creationDate?: Date;
  lastModifiedDate?: Date;
}
export const DescribeDimensionResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    type: S.optional(DimensionType),
    stringValues: S.optional(DimensionStringValues),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DescribeDimensionResponse",
}) as any as S.Schema<DescribeDimensionResponse>;
export interface DescribeEncryptionConfigurationResponse {
  encryptionType?: EncryptionType;
  kmsKeyArn?: string;
  kmsAccessRoleArn?: string;
  configurationDetails?: ConfigurationDetails;
  lastModifiedDate?: Date;
}
export const DescribeEncryptionConfigurationResponse = S.suspend(() =>
  S.Struct({
    encryptionType: S.optional(EncryptionType),
    kmsKeyArn: S.optional(S.String),
    kmsAccessRoleArn: S.optional(S.String),
    configurationDetails: S.optional(ConfigurationDetails),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DescribeEncryptionConfigurationResponse",
}) as any as S.Schema<DescribeEncryptionConfigurationResponse>;
export interface DescribeEndpointResponse {
  endpointAddress?: string;
}
export const DescribeEndpointResponse = S.suspend(() =>
  S.Struct({ endpointAddress: S.optional(S.String) }),
).annotations({
  identifier: "DescribeEndpointResponse",
}) as any as S.Schema<DescribeEndpointResponse>;
export interface DescribeFleetMetricResponse {
  metricName?: string;
  queryString?: string;
  aggregationType?: AggregationType;
  period?: number;
  aggregationField?: string;
  description?: string;
  queryVersion?: string;
  indexName?: string;
  creationDate?: Date;
  lastModifiedDate?: Date;
  unit?: FleetMetricUnit;
  version?: number;
  metricArn?: string;
}
export const DescribeFleetMetricResponse = S.suspend(() =>
  S.Struct({
    metricName: S.optional(S.String),
    queryString: S.optional(S.String),
    aggregationType: S.optional(AggregationType),
    period: S.optional(S.Number),
    aggregationField: S.optional(S.String),
    description: S.optional(S.String),
    queryVersion: S.optional(S.String),
    indexName: S.optional(S.String),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    unit: S.optional(FleetMetricUnit),
    version: S.optional(S.Number),
    metricArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeFleetMetricResponse",
}) as any as S.Schema<DescribeFleetMetricResponse>;
export interface DescribeIndexResponse {
  indexName?: string;
  indexStatus?: IndexStatus;
  schema?: string;
}
export const DescribeIndexResponse = S.suspend(() =>
  S.Struct({
    indexName: S.optional(S.String),
    indexStatus: S.optional(IndexStatus),
    schema: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeIndexResponse",
}) as any as S.Schema<DescribeIndexResponse>;
export interface DescribeJobTemplateResponse {
  jobTemplateArn?: string;
  jobTemplateId?: string;
  description?: string;
  documentSource?: string;
  document?: string;
  createdAt?: Date;
  presignedUrlConfig?: PresignedUrlConfig;
  jobExecutionsRolloutConfig?: JobExecutionsRolloutConfig;
  abortConfig?: AbortConfig;
  timeoutConfig?: TimeoutConfig;
  jobExecutionsRetryConfig?: JobExecutionsRetryConfig;
  maintenanceWindows?: MaintenanceWindow[];
  destinationPackageVersions?: string[];
}
export const DescribeJobTemplateResponse = S.suspend(() =>
  S.Struct({
    jobTemplateArn: S.optional(S.String),
    jobTemplateId: S.optional(S.String),
    description: S.optional(S.String),
    documentSource: S.optional(S.String),
    document: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    presignedUrlConfig: S.optional(PresignedUrlConfig),
    jobExecutionsRolloutConfig: S.optional(JobExecutionsRolloutConfig),
    abortConfig: S.optional(AbortConfig),
    timeoutConfig: S.optional(TimeoutConfig),
    jobExecutionsRetryConfig: S.optional(JobExecutionsRetryConfig),
    maintenanceWindows: S.optional(MaintenanceWindows),
    destinationPackageVersions: S.optional(DestinationPackageVersions),
  }),
).annotations({
  identifier: "DescribeJobTemplateResponse",
}) as any as S.Schema<DescribeJobTemplateResponse>;
export interface DescribeMitigationActionResponse {
  actionName?: string;
  actionType?: MitigationActionType;
  actionArn?: string;
  actionId?: string;
  roleArn?: string;
  actionParams?: MitigationActionParams;
  creationDate?: Date;
  lastModifiedDate?: Date;
}
export const DescribeMitigationActionResponse = S.suspend(() =>
  S.Struct({
    actionName: S.optional(S.String),
    actionType: S.optional(MitigationActionType),
    actionArn: S.optional(S.String),
    actionId: S.optional(S.String),
    roleArn: S.optional(S.String),
    actionParams: S.optional(MitigationActionParams),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DescribeMitigationActionResponse",
}) as any as S.Schema<DescribeMitigationActionResponse>;
export interface DescribeProvisioningTemplateResponse {
  templateArn?: string;
  templateName?: string;
  description?: string;
  creationDate?: Date;
  lastModifiedDate?: Date;
  defaultVersionId?: number;
  templateBody?: string;
  enabled?: boolean;
  provisioningRoleArn?: string;
  preProvisioningHook?: ProvisioningHook;
  type?: TemplateType;
}
export const DescribeProvisioningTemplateResponse = S.suspend(() =>
  S.Struct({
    templateArn: S.optional(S.String),
    templateName: S.optional(S.String),
    description: S.optional(S.String),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    defaultVersionId: S.optional(S.Number),
    templateBody: S.optional(S.String),
    enabled: S.optional(S.Boolean),
    provisioningRoleArn: S.optional(S.String),
    preProvisioningHook: S.optional(ProvisioningHook),
    type: S.optional(TemplateType),
  }),
).annotations({
  identifier: "DescribeProvisioningTemplateResponse",
}) as any as S.Schema<DescribeProvisioningTemplateResponse>;
export interface DescribeProvisioningTemplateVersionResponse {
  versionId?: number;
  creationDate?: Date;
  templateBody?: string;
  isDefaultVersion?: boolean;
}
export const DescribeProvisioningTemplateVersionResponse = S.suspend(() =>
  S.Struct({
    versionId: S.optional(S.Number),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    templateBody: S.optional(S.String),
    isDefaultVersion: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DescribeProvisioningTemplateVersionResponse",
}) as any as S.Schema<DescribeProvisioningTemplateVersionResponse>;
export interface DescribeScheduledAuditResponse {
  frequency?: AuditFrequency;
  dayOfMonth?: string;
  dayOfWeek?: DayOfWeek;
  targetCheckNames?: string[];
  scheduledAuditName?: string;
  scheduledAuditArn?: string;
}
export const DescribeScheduledAuditResponse = S.suspend(() =>
  S.Struct({
    frequency: S.optional(AuditFrequency),
    dayOfMonth: S.optional(S.String),
    dayOfWeek: S.optional(DayOfWeek),
    targetCheckNames: S.optional(TargetAuditCheckNames),
    scheduledAuditName: S.optional(S.String),
    scheduledAuditArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeScheduledAuditResponse",
}) as any as S.Schema<DescribeScheduledAuditResponse>;
export interface DescribeSecurityProfileResponse {
  securityProfileName?: string;
  securityProfileArn?: string;
  securityProfileDescription?: string;
  behaviors?: Behavior[];
  alertTargets?: { [key: string]: AlertTarget };
  additionalMetricsToRetain?: string[];
  additionalMetricsToRetainV2?: MetricToRetain[];
  version?: number;
  creationDate?: Date;
  lastModifiedDate?: Date;
  metricsExportConfig?: MetricsExportConfig;
}
export const DescribeSecurityProfileResponse = S.suspend(() =>
  S.Struct({
    securityProfileName: S.optional(S.String),
    securityProfileArn: S.optional(S.String),
    securityProfileDescription: S.optional(S.String),
    behaviors: S.optional(Behaviors),
    alertTargets: S.optional(AlertTargets),
    additionalMetricsToRetain: S.optional(AdditionalMetricsToRetainList),
    additionalMetricsToRetainV2: S.optional(AdditionalMetricsToRetainV2List),
    version: S.optional(S.Number),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    metricsExportConfig: S.optional(MetricsExportConfig),
  }),
).annotations({
  identifier: "DescribeSecurityProfileResponse",
}) as any as S.Schema<DescribeSecurityProfileResponse>;
export interface DescribeThingResponse {
  defaultClientId?: string;
  thingName?: string;
  thingId?: string;
  thingArn?: string;
  thingTypeName?: string;
  attributes?: { [key: string]: string };
  version?: number;
  billingGroupName?: string;
}
export const DescribeThingResponse = S.suspend(() =>
  S.Struct({
    defaultClientId: S.optional(S.String),
    thingName: S.optional(S.String),
    thingId: S.optional(S.String),
    thingArn: S.optional(S.String),
    thingTypeName: S.optional(S.String),
    attributes: S.optional(Attributes),
    version: S.optional(S.Number),
    billingGroupName: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeThingResponse",
}) as any as S.Schema<DescribeThingResponse>;
export interface DescribeThingRegistrationTaskResponse {
  taskId?: string;
  creationDate?: Date;
  lastModifiedDate?: Date;
  templateBody?: string;
  inputFileBucket?: string;
  inputFileKey?: string;
  roleArn?: string;
  status?: Status;
  message?: string;
  successCount?: number;
  failureCount?: number;
  percentageProgress?: number;
}
export const DescribeThingRegistrationTaskResponse = S.suspend(() =>
  S.Struct({
    taskId: S.optional(S.String),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    templateBody: S.optional(S.String),
    inputFileBucket: S.optional(S.String),
    inputFileKey: S.optional(S.String),
    roleArn: S.optional(S.String),
    status: S.optional(Status),
    message: S.optional(S.String),
    successCount: S.optional(S.Number),
    failureCount: S.optional(S.Number),
    percentageProgress: S.optional(S.Number),
  }),
).annotations({
  identifier: "DescribeThingRegistrationTaskResponse",
}) as any as S.Schema<DescribeThingRegistrationTaskResponse>;
export interface GetCardinalityResponse {
  cardinality?: number;
}
export const GetCardinalityResponse = S.suspend(() =>
  S.Struct({ cardinality: S.optional(S.Number) }),
).annotations({
  identifier: "GetCardinalityResponse",
}) as any as S.Schema<GetCardinalityResponse>;
export interface CommandParameterValue {
  S?: string;
  B?: boolean;
  I?: number;
  L?: number;
  D?: number;
  BIN?: Uint8Array;
  UL?: string;
}
export const CommandParameterValue = S.suspend(() =>
  S.Struct({
    S: S.optional(S.String),
    B: S.optional(S.Boolean),
    I: S.optional(S.Number),
    L: S.optional(S.Number),
    D: S.optional(S.Number),
    BIN: S.optional(T.Blob),
    UL: S.optional(S.String),
  }),
).annotations({
  identifier: "CommandParameterValue",
}) as any as S.Schema<CommandParameterValue>;
export type CommandParameterValueStringList = string[];
export const CommandParameterValueStringList = S.Array(S.String);
export interface CommandParameterValueNumberRange {
  min: string;
  max: string;
}
export const CommandParameterValueNumberRange = S.suspend(() =>
  S.Struct({ min: S.String, max: S.String }),
).annotations({
  identifier: "CommandParameterValueNumberRange",
}) as any as S.Schema<CommandParameterValueNumberRange>;
export interface CommandParameterValueComparisonOperand {
  number?: string;
  numbers?: string[];
  string?: string;
  strings?: string[];
  numberRange?: CommandParameterValueNumberRange;
}
export const CommandParameterValueComparisonOperand = S.suspend(() =>
  S.Struct({
    number: S.optional(S.String),
    numbers: S.optional(CommandParameterValueStringList),
    string: S.optional(S.String),
    strings: S.optional(CommandParameterValueStringList),
    numberRange: S.optional(CommandParameterValueNumberRange),
  }),
).annotations({
  identifier: "CommandParameterValueComparisonOperand",
}) as any as S.Schema<CommandParameterValueComparisonOperand>;
export interface CommandParameterValueCondition {
  comparisonOperator: CommandParameterValueComparisonOperator;
  operand: CommandParameterValueComparisonOperand;
}
export const CommandParameterValueCondition = S.suspend(() =>
  S.Struct({
    comparisonOperator: CommandParameterValueComparisonOperator,
    operand: CommandParameterValueComparisonOperand,
  }),
).annotations({
  identifier: "CommandParameterValueCondition",
}) as any as S.Schema<CommandParameterValueCondition>;
export type CommandParameterValueConditionList =
  CommandParameterValueCondition[];
export const CommandParameterValueConditionList = S.Array(
  CommandParameterValueCondition,
);
export interface CommandParameter {
  name: string;
  type?: CommandParameterType;
  value?: CommandParameterValue;
  defaultValue?: CommandParameterValue;
  valueConditions?: CommandParameterValueCondition[];
  description?: string;
}
export const CommandParameter = S.suspend(() =>
  S.Struct({
    name: S.String,
    type: S.optional(CommandParameterType),
    value: S.optional(CommandParameterValue),
    defaultValue: S.optional(CommandParameterValue),
    valueConditions: S.optional(CommandParameterValueConditionList),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "CommandParameter",
}) as any as S.Schema<CommandParameter>;
export type CommandParameterList = CommandParameter[];
export const CommandParameterList = S.Array(CommandParameter);
export interface AwsJsonSubstitutionCommandPreprocessorConfig {
  outputFormat: OutputFormat;
}
export const AwsJsonSubstitutionCommandPreprocessorConfig = S.suspend(() =>
  S.Struct({ outputFormat: OutputFormat }),
).annotations({
  identifier: "AwsJsonSubstitutionCommandPreprocessorConfig",
}) as any as S.Schema<AwsJsonSubstitutionCommandPreprocessorConfig>;
export interface CommandPreprocessor {
  awsJsonSubstitution?: AwsJsonSubstitutionCommandPreprocessorConfig;
}
export const CommandPreprocessor = S.suspend(() =>
  S.Struct({
    awsJsonSubstitution: S.optional(
      AwsJsonSubstitutionCommandPreprocessorConfig,
    ),
  }),
).annotations({
  identifier: "CommandPreprocessor",
}) as any as S.Schema<CommandPreprocessor>;
export interface GetCommandResponse {
  commandId?: string;
  commandArn?: string;
  namespace?: CommandNamespace;
  displayName?: string;
  description?: string;
  mandatoryParameters?: CommandParameter[];
  payload?: CommandPayload;
  payloadTemplate?: string;
  preprocessor?: CommandPreprocessor;
  roleArn?: string;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  deprecated?: boolean;
  pendingDeletion?: boolean;
}
export const GetCommandResponse = S.suspend(() =>
  S.Struct({
    commandId: S.optional(S.String),
    commandArn: S.optional(S.String),
    namespace: S.optional(CommandNamespace),
    displayName: S.optional(S.String),
    description: S.optional(S.String),
    mandatoryParameters: S.optional(CommandParameterList),
    payload: S.optional(CommandPayload),
    payloadTemplate: S.optional(S.String),
    preprocessor: S.optional(CommandPreprocessor),
    roleArn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    deprecated: S.optional(S.Boolean),
    pendingDeletion: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GetCommandResponse",
}) as any as S.Schema<GetCommandResponse>;
export interface GetJobDocumentResponse {
  document?: string;
}
export const GetJobDocumentResponse = S.suspend(() =>
  S.Struct({ document: S.optional(S.String) }),
).annotations({
  identifier: "GetJobDocumentResponse",
}) as any as S.Schema<GetJobDocumentResponse>;
export interface GetPackageResponse {
  packageName?: string;
  packageArn?: string;
  description?: string | redacted.Redacted<string>;
  defaultVersionName?: string;
  creationDate?: Date;
  lastModifiedDate?: Date;
}
export const GetPackageResponse = S.suspend(() =>
  S.Struct({
    packageName: S.optional(S.String),
    packageArn: S.optional(S.String),
    description: S.optional(SensitiveString),
    defaultVersionName: S.optional(S.String),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "GetPackageResponse",
}) as any as S.Schema<GetPackageResponse>;
export interface GetPackageConfigurationResponse {
  versionUpdateByJobsConfig?: VersionUpdateByJobsConfig;
}
export const GetPackageConfigurationResponse = S.suspend(() =>
  S.Struct({
    versionUpdateByJobsConfig: S.optional(VersionUpdateByJobsConfig),
  }),
).annotations({
  identifier: "GetPackageConfigurationResponse",
}) as any as S.Schema<GetPackageConfigurationResponse>;
export interface Sbom {
  s3Location?: S3Location;
}
export const Sbom = S.suspend(() =>
  S.Struct({ s3Location: S.optional(S3Location) }),
).annotations({ identifier: "Sbom" }) as any as S.Schema<Sbom>;
export interface GetPackageVersionResponse {
  packageVersionArn?: string;
  packageName?: string;
  versionName?: string;
  description?: string | redacted.Redacted<string>;
  attributes?: { [key: string]: string };
  artifact?: PackageVersionArtifact;
  status?: PackageVersionStatus;
  errorReason?: string;
  creationDate?: Date;
  lastModifiedDate?: Date;
  sbom?: Sbom;
  sbomValidationStatus?: SbomValidationStatus;
  recipe?: string | redacted.Redacted<string>;
}
export const GetPackageVersionResponse = S.suspend(() =>
  S.Struct({
    packageVersionArn: S.optional(S.String),
    packageName: S.optional(S.String),
    versionName: S.optional(S.String),
    description: S.optional(SensitiveString),
    attributes: S.optional(ResourceAttributes),
    artifact: S.optional(PackageVersionArtifact),
    status: S.optional(PackageVersionStatus),
    errorReason: S.optional(S.String),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    sbom: S.optional(Sbom),
    sbomValidationStatus: S.optional(SbomValidationStatus),
    recipe: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "GetPackageVersionResponse",
}) as any as S.Schema<GetPackageVersionResponse>;
export interface GetPolicyResponse {
  policyName?: string;
  policyArn?: string;
  policyDocument?: string;
  defaultVersionId?: string;
  creationDate?: Date;
  lastModifiedDate?: Date;
  generationId?: string;
}
export const GetPolicyResponse = S.suspend(() =>
  S.Struct({
    policyName: S.optional(S.String),
    policyArn: S.optional(S.String),
    policyDocument: S.optional(S.String),
    defaultVersionId: S.optional(S.String),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    generationId: S.optional(S.String),
  }),
).annotations({
  identifier: "GetPolicyResponse",
}) as any as S.Schema<GetPolicyResponse>;
export interface GetPolicyVersionResponse {
  policyArn?: string;
  policyName?: string;
  policyDocument?: string;
  policyVersionId?: string;
  isDefaultVersion?: boolean;
  creationDate?: Date;
  lastModifiedDate?: Date;
  generationId?: string;
}
export const GetPolicyVersionResponse = S.suspend(() =>
  S.Struct({
    policyArn: S.optional(S.String),
    policyName: S.optional(S.String),
    policyDocument: S.optional(S.String),
    policyVersionId: S.optional(S.String),
    isDefaultVersion: S.optional(S.Boolean),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    generationId: S.optional(S.String),
  }),
).annotations({
  identifier: "GetPolicyVersionResponse",
}) as any as S.Schema<GetPolicyVersionResponse>;
export interface GetThingConnectivityDataResponse {
  thingName?: string | redacted.Redacted<string>;
  connected?: boolean;
  timestamp?: Date;
  disconnectReason?: DisconnectReasonValue;
}
export const GetThingConnectivityDataResponse = S.suspend(() =>
  S.Struct({
    thingName: S.optional(SensitiveString),
    connected: S.optional(S.Boolean),
    timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    disconnectReason: S.optional(DisconnectReasonValue),
  }),
).annotations({
  identifier: "GetThingConnectivityDataResponse",
}) as any as S.Schema<GetThingConnectivityDataResponse>;
export interface GetV2LoggingOptionsResponse {
  roleArn?: string;
  defaultLogLevel?: LogLevel;
  disableAllLogs?: boolean;
  eventConfigurations?: LogEventConfiguration[];
}
export const GetV2LoggingOptionsResponse = S.suspend(() =>
  S.Struct({
    roleArn: S.optional(S.String),
    defaultLogLevel: S.optional(LogLevel),
    disableAllLogs: S.optional(S.Boolean),
    eventConfigurations: S.optional(LogEventConfigurations),
  }),
).annotations({
  identifier: "GetV2LoggingOptionsResponse",
}) as any as S.Schema<GetV2LoggingOptionsResponse>;
export interface ListAuditFindingsResponse {
  findings?: AuditFinding[];
  nextToken?: string;
}
export const ListAuditFindingsResponse = S.suspend(() =>
  S.Struct({
    findings: S.optional(AuditFindings),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAuditFindingsResponse",
}) as any as S.Schema<ListAuditFindingsResponse>;
export interface Certificate {
  certificateArn?: string;
  certificateId?: string;
  status?: CertificateStatus;
  certificateMode?: CertificateMode;
  creationDate?: Date;
}
export const Certificate = S.suspend(() =>
  S.Struct({
    certificateArn: S.optional(S.String),
    certificateId: S.optional(S.String),
    status: S.optional(CertificateStatus),
    certificateMode: S.optional(CertificateMode),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Certificate" }) as any as S.Schema<Certificate>;
export type Certificates = Certificate[];
export const Certificates = S.Array(Certificate);
export interface ListCertificatesByCAResponse {
  certificates?: Certificate[];
  nextMarker?: string;
}
export const ListCertificatesByCAResponse = S.suspend(() =>
  S.Struct({
    certificates: S.optional(Certificates),
    nextMarker: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCertificatesByCAResponse",
}) as any as S.Schema<ListCertificatesByCAResponse>;
export interface ListCommandExecutionsRequest {
  maxResults?: number;
  nextToken?: string;
  namespace?: CommandNamespace;
  status?: CommandExecutionStatus;
  sortOrder?: SortOrder;
  startedTimeFilter?: TimeFilter;
  completedTimeFilter?: TimeFilter;
  targetArn?: string;
  commandArn?: string;
}
export const ListCommandExecutionsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    namespace: S.optional(CommandNamespace),
    status: S.optional(CommandExecutionStatus),
    sortOrder: S.optional(SortOrder),
    startedTimeFilter: S.optional(TimeFilter),
    completedTimeFilter: S.optional(TimeFilter),
    targetArn: S.optional(S.String),
    commandArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/command-executions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCommandExecutionsRequest",
}) as any as S.Schema<ListCommandExecutionsRequest>;
export interface ListCustomMetricsResponse {
  metricNames?: string[];
  nextToken?: string;
}
export const ListCustomMetricsResponse = S.suspend(() =>
  S.Struct({
    metricNames: S.optional(MetricNames),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCustomMetricsResponse",
}) as any as S.Schema<ListCustomMetricsResponse>;
export interface ListDetectMitigationActionsTasksResponse {
  tasks?: DetectMitigationActionsTaskSummary[];
  nextToken?: string;
}
export const ListDetectMitigationActionsTasksResponse = S.suspend(() =>
  S.Struct({
    tasks: S.optional(DetectMitigationActionsTaskSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDetectMitigationActionsTasksResponse",
}) as any as S.Schema<ListDetectMitigationActionsTasksResponse>;
export interface ListDimensionsResponse {
  dimensionNames?: string[];
  nextToken?: string;
}
export const ListDimensionsResponse = S.suspend(() =>
  S.Struct({
    dimensionNames: S.optional(DimensionNames),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDimensionsResponse",
}) as any as S.Schema<ListDimensionsResponse>;
export interface ListIndicesResponse {
  indexNames?: string[];
  nextToken?: string;
}
export const ListIndicesResponse = S.suspend(() =>
  S.Struct({
    indexNames: S.optional(IndexNamesList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListIndicesResponse",
}) as any as S.Schema<ListIndicesResponse>;
export interface Policy {
  policyName?: string;
  policyArn?: string;
}
export const Policy = S.suspend(() =>
  S.Struct({
    policyName: S.optional(S.String),
    policyArn: S.optional(S.String),
  }),
).annotations({ identifier: "Policy" }) as any as S.Schema<Policy>;
export type Policies = Policy[];
export const Policies = S.Array(Policy);
export interface ListPoliciesResponse {
  policies?: Policy[];
  nextMarker?: string;
}
export const ListPoliciesResponse = S.suspend(() =>
  S.Struct({
    policies: S.optional(Policies),
    nextMarker: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPoliciesResponse",
}) as any as S.Schema<ListPoliciesResponse>;
export interface ListPolicyPrincipalsResponse {
  principals?: string[];
  nextMarker?: string;
}
export const ListPolicyPrincipalsResponse = S.suspend(() =>
  S.Struct({
    principals: S.optional(Principals),
    nextMarker: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPolicyPrincipalsResponse",
}) as any as S.Schema<ListPolicyPrincipalsResponse>;
export interface ListPrincipalPoliciesResponse {
  policies?: Policy[];
  nextMarker?: string;
}
export const ListPrincipalPoliciesResponse = S.suspend(() =>
  S.Struct({
    policies: S.optional(Policies),
    nextMarker: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPrincipalPoliciesResponse",
}) as any as S.Schema<ListPrincipalPoliciesResponse>;
export interface ListPrincipalThingsResponse {
  things?: string[];
  nextToken?: string;
}
export const ListPrincipalThingsResponse = S.suspend(() =>
  S.Struct({
    things: S.optional(ThingNameList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPrincipalThingsResponse",
}) as any as S.Schema<ListPrincipalThingsResponse>;
export interface ListRoleAliasesResponse {
  roleAliases?: string[];
  nextMarker?: string;
}
export const ListRoleAliasesResponse = S.suspend(() =>
  S.Struct({
    roleAliases: S.optional(RoleAliases),
    nextMarker: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRoleAliasesResponse",
}) as any as S.Schema<ListRoleAliasesResponse>;
export interface ListTagsForResourceResponse {
  tags?: Tag[];
  nextToken?: string;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagList), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ListTargetsForPolicyResponse {
  targets?: string[];
  nextMarker?: string;
}
export const ListTargetsForPolicyResponse = S.suspend(() =>
  S.Struct({
    targets: S.optional(PolicyTargets),
    nextMarker: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTargetsForPolicyResponse",
}) as any as S.Schema<ListTargetsForPolicyResponse>;
export interface ListThingGroupsResponse {
  thingGroups?: GroupNameAndArn[];
  nextToken?: string;
}
export const ListThingGroupsResponse = S.suspend(() =>
  S.Struct({
    thingGroups: S.optional(ThingGroupNameAndArnList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListThingGroupsResponse",
}) as any as S.Schema<ListThingGroupsResponse>;
export interface ListThingGroupsForThingResponse {
  thingGroups?: GroupNameAndArn[];
  nextToken?: string;
}
export const ListThingGroupsForThingResponse = S.suspend(() =>
  S.Struct({
    thingGroups: S.optional(ThingGroupNameAndArnList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListThingGroupsForThingResponse",
}) as any as S.Schema<ListThingGroupsForThingResponse>;
export interface ListThingPrincipalsResponse {
  principals?: string[];
  nextToken?: string;
}
export const ListThingPrincipalsResponse = S.suspend(() =>
  S.Struct({
    principals: S.optional(Principals),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListThingPrincipalsResponse",
}) as any as S.Schema<ListThingPrincipalsResponse>;
export interface ListThingRegistrationTaskReportsResponse {
  resourceLinks?: string[];
  reportType?: ReportType;
  nextToken?: string;
}
export const ListThingRegistrationTaskReportsResponse = S.suspend(() =>
  S.Struct({
    resourceLinks: S.optional(S3FileUrlList),
    reportType: S.optional(ReportType),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListThingRegistrationTaskReportsResponse",
}) as any as S.Schema<ListThingRegistrationTaskReportsResponse>;
export interface ListThingRegistrationTasksResponse {
  taskIds?: string[];
  nextToken?: string;
}
export const ListThingRegistrationTasksResponse = S.suspend(() =>
  S.Struct({
    taskIds: S.optional(TaskIdList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListThingRegistrationTasksResponse",
}) as any as S.Schema<ListThingRegistrationTasksResponse>;
export interface ListThingsInBillingGroupResponse {
  things?: string[];
  nextToken?: string;
}
export const ListThingsInBillingGroupResponse = S.suspend(() =>
  S.Struct({
    things: S.optional(ThingNameList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListThingsInBillingGroupResponse",
}) as any as S.Schema<ListThingsInBillingGroupResponse>;
export interface ListThingsInThingGroupResponse {
  things?: string[];
  nextToken?: string;
}
export const ListThingsInThingGroupResponse = S.suspend(() =>
  S.Struct({
    things: S.optional(ThingNameList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListThingsInThingGroupResponse",
}) as any as S.Schema<ListThingsInThingGroupResponse>;
export interface RegisterCACertificateRequest {
  caCertificate: string;
  verificationCertificate?: string;
  setAsActive?: boolean;
  allowAutoRegistration?: boolean;
  registrationConfig?: RegistrationConfig;
  tags?: Tag[];
  certificateMode?: CertificateMode;
}
export const RegisterCACertificateRequest = S.suspend(() =>
  S.Struct({
    caCertificate: S.String,
    verificationCertificate: S.optional(S.String),
    setAsActive: S.optional(S.Boolean).pipe(T.HttpQuery("setAsActive")),
    allowAutoRegistration: S.optional(S.Boolean).pipe(
      T.HttpQuery("allowAutoRegistration"),
    ),
    registrationConfig: S.optional(RegistrationConfig),
    tags: S.optional(TagList),
    certificateMode: S.optional(CertificateMode),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/cacertificate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterCACertificateRequest",
}) as any as S.Schema<RegisterCACertificateRequest>;
export interface RegisterCertificateResponse {
  certificateArn?: string;
  certificateId?: string;
}
export const RegisterCertificateResponse = S.suspend(() =>
  S.Struct({
    certificateArn: S.optional(S.String),
    certificateId: S.optional(S.String),
  }),
).annotations({
  identifier: "RegisterCertificateResponse",
}) as any as S.Schema<RegisterCertificateResponse>;
export interface RegisterCertificateWithoutCAResponse {
  certificateArn?: string;
  certificateId?: string;
}
export const RegisterCertificateWithoutCAResponse = S.suspend(() =>
  S.Struct({
    certificateArn: S.optional(S.String),
    certificateId: S.optional(S.String),
  }),
).annotations({
  identifier: "RegisterCertificateWithoutCAResponse",
}) as any as S.Schema<RegisterCertificateWithoutCAResponse>;
export interface RegisterThingRequest {
  templateBody: string;
  parameters?: { [key: string]: string };
}
export const RegisterThingRequest = S.suspend(() =>
  S.Struct({ templateBody: S.String, parameters: S.optional(Parameters) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/things" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterThingRequest",
}) as any as S.Schema<RegisterThingRequest>;
export interface SetDefaultAuthorizerResponse {
  authorizerName?: string;
  authorizerArn?: string;
}
export const SetDefaultAuthorizerResponse = S.suspend(() =>
  S.Struct({
    authorizerName: S.optional(S.String),
    authorizerArn: S.optional(S.String),
  }),
).annotations({
  identifier: "SetDefaultAuthorizerResponse",
}) as any as S.Schema<SetDefaultAuthorizerResponse>;
export interface SetLoggingOptionsRequest {
  loggingOptionsPayload: LoggingOptionsPayload;
}
export const SetLoggingOptionsRequest = S.suspend(() =>
  S.Struct({
    loggingOptionsPayload: LoggingOptionsPayload.pipe(
      T.HttpPayload(),
    ).annotations({ identifier: "LoggingOptionsPayload" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/loggingOptions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetLoggingOptionsRequest",
}) as any as S.Schema<SetLoggingOptionsRequest>;
export interface SetLoggingOptionsResponse {}
export const SetLoggingOptionsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "SetLoggingOptionsResponse",
}) as any as S.Schema<SetLoggingOptionsResponse>;
export interface SetV2LoggingLevelRequest {
  logTarget: LogTarget;
  logLevel: LogLevel;
}
export const SetV2LoggingLevelRequest = S.suspend(() =>
  S.Struct({ logTarget: LogTarget, logLevel: LogLevel }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2LoggingLevel" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetV2LoggingLevelRequest",
}) as any as S.Schema<SetV2LoggingLevelRequest>;
export interface SetV2LoggingLevelResponse {}
export const SetV2LoggingLevelResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "SetV2LoggingLevelResponse",
}) as any as S.Schema<SetV2LoggingLevelResponse>;
export interface SetV2LoggingOptionsRequest {
  roleArn?: string;
  defaultLogLevel?: LogLevel;
  disableAllLogs?: boolean;
  eventConfigurations?: LogEventConfiguration[];
}
export const SetV2LoggingOptionsRequest = S.suspend(() =>
  S.Struct({
    roleArn: S.optional(S.String),
    defaultLogLevel: S.optional(LogLevel),
    disableAllLogs: S.optional(S.Boolean),
    eventConfigurations: S.optional(LogEventConfigurations),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2LoggingOptions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetV2LoggingOptionsRequest",
}) as any as S.Schema<SetV2LoggingOptionsRequest>;
export interface SetV2LoggingOptionsResponse {}
export const SetV2LoggingOptionsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "SetV2LoggingOptionsResponse",
}) as any as S.Schema<SetV2LoggingOptionsResponse>;
export interface StartDetectMitigationActionsTaskRequest {
  taskId: string;
  target: DetectMitigationActionsTaskTarget;
  actions: string[];
  violationEventOccurrenceRange?: ViolationEventOccurrenceRange;
  includeOnlyActiveViolations?: boolean;
  includeSuppressedAlerts?: boolean;
  clientRequestToken: string;
}
export const StartDetectMitigationActionsTaskRequest = S.suspend(() =>
  S.Struct({
    taskId: S.String.pipe(T.HttpLabel("taskId")),
    target: DetectMitigationActionsTaskTarget,
    actions: DetectMitigationActionsToExecuteList,
    violationEventOccurrenceRange: S.optional(ViolationEventOccurrenceRange),
    includeOnlyActiveViolations: S.optional(S.Boolean),
    includeSuppressedAlerts: S.optional(S.Boolean),
    clientRequestToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/detect/mitigationactions/tasks/{taskId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartDetectMitigationActionsTaskRequest",
}) as any as S.Schema<StartDetectMitigationActionsTaskRequest>;
export interface StartOnDemandAuditTaskResponse {
  taskId?: string;
}
export const StartOnDemandAuditTaskResponse = S.suspend(() =>
  S.Struct({ taskId: S.optional(S.String) }),
).annotations({
  identifier: "StartOnDemandAuditTaskResponse",
}) as any as S.Schema<StartOnDemandAuditTaskResponse>;
export interface StartThingRegistrationTaskResponse {
  taskId?: string;
}
export const StartThingRegistrationTaskResponse = S.suspend(() =>
  S.Struct({ taskId: S.optional(S.String) }),
).annotations({
  identifier: "StartThingRegistrationTaskResponse",
}) as any as S.Schema<StartThingRegistrationTaskResponse>;
export interface TestAuthorizationRequest {
  principal?: string;
  cognitoIdentityPoolId?: string;
  authInfos: AuthInfo[];
  clientId?: string;
  policyNamesToAdd?: string[];
  policyNamesToSkip?: string[];
}
export const TestAuthorizationRequest = S.suspend(() =>
  S.Struct({
    principal: S.optional(S.String),
    cognitoIdentityPoolId: S.optional(S.String),
    authInfos: AuthInfos,
    clientId: S.optional(S.String).pipe(T.HttpQuery("clientId")),
    policyNamesToAdd: S.optional(PolicyNames),
    policyNamesToSkip: S.optional(PolicyNames),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/test-authorization" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TestAuthorizationRequest",
}) as any as S.Schema<TestAuthorizationRequest>;
export interface TransferCertificateResponse {
  transferredCertificateArn?: string;
}
export const TransferCertificateResponse = S.suspend(() =>
  S.Struct({ transferredCertificateArn: S.optional(S.String) }),
).annotations({
  identifier: "TransferCertificateResponse",
}) as any as S.Schema<TransferCertificateResponse>;
export interface UpdateAuthorizerResponse {
  authorizerName?: string;
  authorizerArn?: string;
}
export const UpdateAuthorizerResponse = S.suspend(() =>
  S.Struct({
    authorizerName: S.optional(S.String),
    authorizerArn: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateAuthorizerResponse",
}) as any as S.Schema<UpdateAuthorizerResponse>;
export interface UpdateBillingGroupResponse {
  version?: number;
}
export const UpdateBillingGroupResponse = S.suspend(() =>
  S.Struct({ version: S.optional(S.Number) }),
).annotations({
  identifier: "UpdateBillingGroupResponse",
}) as any as S.Schema<UpdateBillingGroupResponse>;
export interface UpdateCertificateProviderResponse {
  certificateProviderName?: string;
  certificateProviderArn?: string;
}
export const UpdateCertificateProviderResponse = S.suspend(() =>
  S.Struct({
    certificateProviderName: S.optional(S.String),
    certificateProviderArn: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateCertificateProviderResponse",
}) as any as S.Schema<UpdateCertificateProviderResponse>;
export interface UpdateCommandResponse {
  commandId?: string;
  displayName?: string;
  description?: string;
  deprecated?: boolean;
  lastUpdatedAt?: Date;
}
export const UpdateCommandResponse = S.suspend(() =>
  S.Struct({
    commandId: S.optional(S.String),
    displayName: S.optional(S.String),
    description: S.optional(S.String),
    deprecated: S.optional(S.Boolean),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "UpdateCommandResponse",
}) as any as S.Schema<UpdateCommandResponse>;
export interface UpdateCustomMetricResponse {
  metricName?: string;
  metricArn?: string;
  metricType?: CustomMetricType;
  displayName?: string;
  creationDate?: Date;
  lastModifiedDate?: Date;
}
export const UpdateCustomMetricResponse = S.suspend(() =>
  S.Struct({
    metricName: S.optional(S.String),
    metricArn: S.optional(S.String),
    metricType: S.optional(CustomMetricType),
    displayName: S.optional(S.String),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "UpdateCustomMetricResponse",
}) as any as S.Schema<UpdateCustomMetricResponse>;
export interface UpdateDimensionResponse {
  name?: string;
  arn?: string;
  type?: DimensionType;
  stringValues?: string[];
  creationDate?: Date;
  lastModifiedDate?: Date;
}
export const UpdateDimensionResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    type: S.optional(DimensionType),
    stringValues: S.optional(DimensionStringValues),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "UpdateDimensionResponse",
}) as any as S.Schema<UpdateDimensionResponse>;
export interface UpdateDomainConfigurationResponse {
  domainConfigurationName?: string;
  domainConfigurationArn?: string;
}
export const UpdateDomainConfigurationResponse = S.suspend(() =>
  S.Struct({
    domainConfigurationName: S.optional(S.String),
    domainConfigurationArn: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateDomainConfigurationResponse",
}) as any as S.Schema<UpdateDomainConfigurationResponse>;
export interface UpdateDynamicThingGroupResponse {
  version?: number;
}
export const UpdateDynamicThingGroupResponse = S.suspend(() =>
  S.Struct({ version: S.optional(S.Number) }),
).annotations({
  identifier: "UpdateDynamicThingGroupResponse",
}) as any as S.Schema<UpdateDynamicThingGroupResponse>;
export interface UpdateMitigationActionResponse {
  actionArn?: string;
  actionId?: string;
}
export const UpdateMitigationActionResponse = S.suspend(() =>
  S.Struct({ actionArn: S.optional(S.String), actionId: S.optional(S.String) }),
).annotations({
  identifier: "UpdateMitigationActionResponse",
}) as any as S.Schema<UpdateMitigationActionResponse>;
export interface UpdateRoleAliasResponse {
  roleAlias?: string;
  roleAliasArn?: string;
}
export const UpdateRoleAliasResponse = S.suspend(() =>
  S.Struct({
    roleAlias: S.optional(S.String),
    roleAliasArn: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateRoleAliasResponse",
}) as any as S.Schema<UpdateRoleAliasResponse>;
export interface UpdateScheduledAuditResponse {
  scheduledAuditArn?: string;
}
export const UpdateScheduledAuditResponse = S.suspend(() =>
  S.Struct({ scheduledAuditArn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateScheduledAuditResponse",
}) as any as S.Schema<UpdateScheduledAuditResponse>;
export interface UpdateSecurityProfileResponse {
  securityProfileName?: string;
  securityProfileArn?: string;
  securityProfileDescription?: string;
  behaviors?: Behavior[];
  alertTargets?: { [key: string]: AlertTarget };
  additionalMetricsToRetain?: string[];
  additionalMetricsToRetainV2?: MetricToRetain[];
  version?: number;
  creationDate?: Date;
  lastModifiedDate?: Date;
  metricsExportConfig?: MetricsExportConfig;
}
export const UpdateSecurityProfileResponse = S.suspend(() =>
  S.Struct({
    securityProfileName: S.optional(S.String),
    securityProfileArn: S.optional(S.String),
    securityProfileDescription: S.optional(S.String),
    behaviors: S.optional(Behaviors),
    alertTargets: S.optional(AlertTargets),
    additionalMetricsToRetain: S.optional(AdditionalMetricsToRetainList),
    additionalMetricsToRetainV2: S.optional(AdditionalMetricsToRetainV2List),
    version: S.optional(S.Number),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    metricsExportConfig: S.optional(MetricsExportConfig),
  }),
).annotations({
  identifier: "UpdateSecurityProfileResponse",
}) as any as S.Schema<UpdateSecurityProfileResponse>;
export interface UpdateStreamResponse {
  streamId?: string;
  streamArn?: string;
  description?: string;
  streamVersion?: number;
}
export const UpdateStreamResponse = S.suspend(() =>
  S.Struct({
    streamId: S.optional(S.String),
    streamArn: S.optional(S.String),
    description: S.optional(S.String),
    streamVersion: S.optional(S.Number),
  }),
).annotations({
  identifier: "UpdateStreamResponse",
}) as any as S.Schema<UpdateStreamResponse>;
export interface UpdateThingGroupResponse {
  version?: number;
}
export const UpdateThingGroupResponse = S.suspend(() =>
  S.Struct({ version: S.optional(S.Number) }),
).annotations({
  identifier: "UpdateThingGroupResponse",
}) as any as S.Schema<UpdateThingGroupResponse>;
export interface AwsJobAbortCriteria {
  failureType: AwsJobAbortCriteriaFailureType;
  action: AwsJobAbortCriteriaAbortAction;
  thresholdPercentage: number;
  minNumberOfExecutedThings: number;
}
export const AwsJobAbortCriteria = S.suspend(() =>
  S.Struct({
    failureType: AwsJobAbortCriteriaFailureType,
    action: AwsJobAbortCriteriaAbortAction,
    thresholdPercentage: S.Number,
    minNumberOfExecutedThings: S.Number,
  }),
).annotations({
  identifier: "AwsJobAbortCriteria",
}) as any as S.Schema<AwsJobAbortCriteria>;
export type AwsJobAbortCriteriaList = AwsJobAbortCriteria[];
export const AwsJobAbortCriteriaList = S.Array(AwsJobAbortCriteria);
export type AttributesMap = { [key: string]: string };
export const AttributesMap = S.Record({ key: S.String, value: S.String });
export interface HttpUrlDestinationConfiguration {
  confirmationUrl: string;
}
export const HttpUrlDestinationConfiguration = S.suspend(() =>
  S.Struct({ confirmationUrl: S.String }),
).annotations({
  identifier: "HttpUrlDestinationConfiguration",
}) as any as S.Schema<HttpUrlDestinationConfiguration>;
export interface VpcDestinationConfiguration {
  subnetIds: string[];
  securityGroups?: string[];
  vpcId: string;
  roleArn: string;
}
export const VpcDestinationConfiguration = S.suspend(() =>
  S.Struct({
    subnetIds: SubnetIdList,
    securityGroups: S.optional(SecurityGroupList),
    vpcId: S.String,
    roleArn: S.String,
  }),
).annotations({
  identifier: "VpcDestinationConfiguration",
}) as any as S.Schema<VpcDestinationConfiguration>;
export type ServerCertificateStatus = "INVALID" | "VALID";
export const ServerCertificateStatus = S.Literal("INVALID", "VALID");
export type ModelStatus = "PENDING_BUILD" | "ACTIVE" | "EXPIRED";
export const ModelStatus = S.Literal("PENDING_BUILD", "ACTIVE", "EXPIRED");
export interface TermsAggregation {
  maxBuckets?: number;
}
export const TermsAggregation = S.suspend(() =>
  S.Struct({ maxBuckets: S.optional(S.Number) }),
).annotations({
  identifier: "TermsAggregation",
}) as any as S.Schema<TermsAggregation>;
export type DetectMitigationActionExecutionStatus =
  | "IN_PROGRESS"
  | "SUCCESSFUL"
  | "FAILED"
  | "SKIPPED";
export const DetectMitigationActionExecutionStatus = S.Literal(
  "IN_PROGRESS",
  "SUCCESSFUL",
  "FAILED",
  "SKIPPED",
);
export type SbomValidationErrorCode =
  | "INCOMPATIBLE_FORMAT"
  | "FILE_SIZE_LIMIT_EXCEEDED";
export const SbomValidationErrorCode = S.Literal(
  "INCOMPATIBLE_FORMAT",
  "FILE_SIZE_LIMIT_EXCEEDED",
);
export type ViolationEventType =
  | "in-alarm"
  | "alarm-cleared"
  | "alarm-invalidated";
export const ViolationEventType = S.Literal(
  "in-alarm",
  "alarm-cleared",
  "alarm-invalidated",
);
export type ThingGroupNameList = string[];
export const ThingGroupNameList = S.Array(S.String);
export type AuditCheckToReasonCodeFilter = { [key: string]: string[] };
export const AuditCheckToReasonCodeFilter = S.Record({
  key: S.String,
  value: ReasonForNonComplianceCodes,
});
export type HttpHeaders = { [key: string]: string };
export const HttpHeaders = S.Record({ key: S.String, value: S.String });
export interface AwsJobAbortConfig {
  abortCriteriaList: AwsJobAbortCriteria[];
}
export const AwsJobAbortConfig = S.suspend(() =>
  S.Struct({ abortCriteriaList: AwsJobAbortCriteriaList }),
).annotations({
  identifier: "AwsJobAbortConfig",
}) as any as S.Schema<AwsJobAbortConfig>;
export interface TopicRuleDestinationConfiguration {
  httpUrlConfiguration?: HttpUrlDestinationConfiguration;
  vpcConfiguration?: VpcDestinationConfiguration;
}
export const TopicRuleDestinationConfiguration = S.suspend(() =>
  S.Struct({
    httpUrlConfiguration: S.optional(HttpUrlDestinationConfiguration),
    vpcConfiguration: S.optional(VpcDestinationConfiguration),
  }),
).annotations({
  identifier: "TopicRuleDestinationConfiguration",
}) as any as S.Schema<TopicRuleDestinationConfiguration>;
export interface TaskStatistics {
  totalChecks?: number;
  inProgressChecks?: number;
  waitingForDataCollectionChecks?: number;
  compliantChecks?: number;
  nonCompliantChecks?: number;
  failedChecks?: number;
  canceledChecks?: number;
}
export const TaskStatistics = S.suspend(() =>
  S.Struct({
    totalChecks: S.optional(S.Number),
    inProgressChecks: S.optional(S.Number),
    waitingForDataCollectionChecks: S.optional(S.Number),
    compliantChecks: S.optional(S.Number),
    nonCompliantChecks: S.optional(S.Number),
    failedChecks: S.optional(S.Number),
    canceledChecks: S.optional(S.Number),
  }),
).annotations({
  identifier: "TaskStatistics",
}) as any as S.Schema<TaskStatistics>;
export interface BillingGroupMetadata {
  creationDate?: Date;
}
export const BillingGroupMetadata = S.suspend(() =>
  S.Struct({
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "BillingGroupMetadata",
}) as any as S.Schema<BillingGroupMetadata>;
export interface ServerCertificateSummary {
  serverCertificateArn?: string;
  serverCertificateStatus?: ServerCertificateStatus;
  serverCertificateStatusDetail?: string;
}
export const ServerCertificateSummary = S.suspend(() =>
  S.Struct({
    serverCertificateArn: S.optional(S.String),
    serverCertificateStatus: S.optional(ServerCertificateStatus),
    serverCertificateStatusDetail: S.optional(S.String),
  }),
).annotations({
  identifier: "ServerCertificateSummary",
}) as any as S.Schema<ServerCertificateSummary>;
export type ServerCertificates = ServerCertificateSummary[];
export const ServerCertificates = S.Array(ServerCertificateSummary);
export interface DocumentParameter {
  key?: string;
  description?: string;
  regex?: string;
  example?: string;
  optional?: boolean;
}
export const DocumentParameter = S.suspend(() =>
  S.Struct({
    key: S.optional(S.String),
    description: S.optional(S.String),
    regex: S.optional(S.String),
    example: S.optional(S.String),
    optional: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DocumentParameter",
}) as any as S.Schema<DocumentParameter>;
export type DocumentParameters = DocumentParameter[];
export const DocumentParameters = S.Array(DocumentParameter);
export interface RoleAliasDescription {
  roleAlias?: string;
  roleAliasArn?: string;
  roleArn?: string;
  owner?: string;
  credentialDurationSeconds?: number;
  creationDate?: Date;
  lastModifiedDate?: Date;
}
export const RoleAliasDescription = S.suspend(() =>
  S.Struct({
    roleAlias: S.optional(S.String),
    roleAliasArn: S.optional(S.String),
    roleArn: S.optional(S.String),
    owner: S.optional(S.String),
    credentialDurationSeconds: S.optional(S.Number),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "RoleAliasDescription",
}) as any as S.Schema<RoleAliasDescription>;
export interface StreamInfo {
  streamId?: string;
  streamArn?: string;
  streamVersion?: number;
  description?: string;
  files?: StreamFile[];
  createdAt?: Date;
  lastUpdatedAt?: Date;
  roleArn?: string;
}
export const StreamInfo = S.suspend(() =>
  S.Struct({
    streamId: S.optional(S.String),
    streamArn: S.optional(S.String),
    streamVersion: S.optional(S.Number),
    description: S.optional(S.String),
    files: S.optional(StreamFiles),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    roleArn: S.optional(S.String),
  }),
).annotations({ identifier: "StreamInfo" }) as any as S.Schema<StreamInfo>;
export interface ThingGroupMetadata {
  parentGroupName?: string;
  rootToParentThingGroups?: GroupNameAndArn[];
  creationDate?: Date;
}
export const ThingGroupMetadata = S.suspend(() =>
  S.Struct({
    parentGroupName: S.optional(S.String),
    rootToParentThingGroups: S.optional(ThingGroupNameAndArnList),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ThingGroupMetadata",
}) as any as S.Schema<ThingGroupMetadata>;
export interface ThingTypeMetadata {
  deprecated?: boolean;
  deprecationDate?: Date;
  creationDate?: Date;
}
export const ThingTypeMetadata = S.suspend(() =>
  S.Struct({
    deprecated: S.optional(S.Boolean),
    deprecationDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ThingTypeMetadata",
}) as any as S.Schema<ThingTypeMetadata>;
export interface BehaviorModelTrainingSummary {
  securityProfileName?: string;
  behaviorName?: string;
  trainingDataCollectionStartDate?: Date;
  modelStatus?: ModelStatus;
  datapointsCollectionPercentage?: number;
  lastModelRefreshDate?: Date;
}
export const BehaviorModelTrainingSummary = S.suspend(() =>
  S.Struct({
    securityProfileName: S.optional(S.String),
    behaviorName: S.optional(S.String),
    trainingDataCollectionStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    modelStatus: S.optional(ModelStatus),
    datapointsCollectionPercentage: S.optional(S.Number),
    lastModelRefreshDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "BehaviorModelTrainingSummary",
}) as any as S.Schema<BehaviorModelTrainingSummary>;
export type BehaviorModelTrainingSummaries = BehaviorModelTrainingSummary[];
export const BehaviorModelTrainingSummaries = S.Array(
  BehaviorModelTrainingSummary,
);
export interface BucketsAggregationType {
  termsAggregation?: TermsAggregation;
}
export const BucketsAggregationType = S.suspend(() =>
  S.Struct({ termsAggregation: S.optional(TermsAggregation) }),
).annotations({
  identifier: "BucketsAggregationType",
}) as any as S.Schema<BucketsAggregationType>;
export interface StatusReason {
  reasonCode: string;
  reasonDescription?: string;
}
export const StatusReason = S.suspend(() =>
  S.Struct({ reasonCode: S.String, reasonDescription: S.optional(S.String) }),
).annotations({ identifier: "StatusReason" }) as any as S.Schema<StatusReason>;
export type CommandExecutionParameterMap = {
  [key: string]: CommandParameterValue;
};
export const CommandExecutionParameterMap = S.Record({
  key: S.String,
  value: CommandParameterValue,
});
export interface EffectivePolicy {
  policyName?: string;
  policyArn?: string;
  policyDocument?: string;
}
export const EffectivePolicy = S.suspend(() =>
  S.Struct({
    policyName: S.optional(S.String),
    policyArn: S.optional(S.String),
    policyDocument: S.optional(S.String),
  }),
).annotations({
  identifier: "EffectivePolicy",
}) as any as S.Schema<EffectivePolicy>;
export type EffectivePolicies = EffectivePolicy[];
export const EffectivePolicies = S.Array(EffectivePolicy);
export interface PercentPair {
  percent?: number;
  value?: number;
}
export const PercentPair = S.suspend(() =>
  S.Struct({ percent: S.optional(S.Number), value: S.optional(S.Number) }),
).annotations({ identifier: "PercentPair" }) as any as S.Schema<PercentPair>;
export type Percentiles = PercentPair[];
export const Percentiles = S.Array(PercentPair);
export interface Statistics {
  count?: number;
  average?: number;
  sum?: number;
  minimum?: number;
  maximum?: number;
  sumOfSquares?: number;
  variance?: number;
  stdDeviation?: number;
}
export const Statistics = S.suspend(() =>
  S.Struct({
    count: S.optional(S.Number),
    average: S.optional(S.Number),
    sum: S.optional(S.Number),
    minimum: S.optional(S.Number),
    maximum: S.optional(S.Number),
    sumOfSquares: S.optional(S.Number),
    variance: S.optional(S.Number),
    stdDeviation: S.optional(S.Number),
  }),
).annotations({ identifier: "Statistics" }) as any as S.Schema<Statistics>;
export interface TopicRule {
  ruleName?: string;
  sql?: string;
  description?: string;
  createdAt?: Date;
  actions?: Action[];
  ruleDisabled?: boolean;
  awsIotSqlVersion?: string;
  errorAction?: Action;
}
export const TopicRule = S.suspend(() =>
  S.Struct({
    ruleName: S.optional(S.String),
    sql: S.optional(S.String),
    description: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    actions: S.optional(ActionList),
    ruleDisabled: S.optional(S.Boolean),
    awsIotSqlVersion: S.optional(S.String),
    errorAction: S.optional(Action),
  }),
).annotations({ identifier: "TopicRule" }) as any as S.Schema<TopicRule>;
export interface AuditMitigationActionExecutionMetadata {
  taskId?: string;
  findingId?: string;
  actionName?: string;
  actionId?: string;
  status?: AuditMitigationActionsExecutionStatus;
  startTime?: Date;
  endTime?: Date;
  errorCode?: string;
  message?: string;
}
export const AuditMitigationActionExecutionMetadata = S.suspend(() =>
  S.Struct({
    taskId: S.optional(S.String),
    findingId: S.optional(S.String),
    actionName: S.optional(S.String),
    actionId: S.optional(S.String),
    status: S.optional(AuditMitigationActionsExecutionStatus),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    errorCode: S.optional(S.String),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "AuditMitigationActionExecutionMetadata",
}) as any as S.Schema<AuditMitigationActionExecutionMetadata>;
export type AuditMitigationActionExecutionMetadataList =
  AuditMitigationActionExecutionMetadata[];
export const AuditMitigationActionExecutionMetadataList = S.Array(
  AuditMitigationActionExecutionMetadata,
);
export interface AuditMitigationActionsTaskMetadata {
  taskId?: string;
  startTime?: Date;
  taskStatus?: AuditMitigationActionsTaskStatus;
}
export const AuditMitigationActionsTaskMetadata = S.suspend(() =>
  S.Struct({
    taskId: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    taskStatus: S.optional(AuditMitigationActionsTaskStatus),
  }),
).annotations({
  identifier: "AuditMitigationActionsTaskMetadata",
}) as any as S.Schema<AuditMitigationActionsTaskMetadata>;
export type AuditMitigationActionsTaskMetadataList =
  AuditMitigationActionsTaskMetadata[];
export const AuditMitigationActionsTaskMetadataList = S.Array(
  AuditMitigationActionsTaskMetadata,
);
export interface AuditSuppression {
  checkName: string;
  resourceIdentifier: ResourceIdentifier;
  expirationDate?: Date;
  suppressIndefinitely?: boolean;
  description?: string;
}
export const AuditSuppression = S.suspend(() =>
  S.Struct({
    checkName: S.String,
    resourceIdentifier: ResourceIdentifier,
    expirationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    suppressIndefinitely: S.optional(S.Boolean),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "AuditSuppression",
}) as any as S.Schema<AuditSuppression>;
export type AuditSuppressionList = AuditSuppression[];
export const AuditSuppressionList = S.Array(AuditSuppression);
export interface AuditTaskMetadata {
  taskId?: string;
  taskStatus?: AuditTaskStatus;
  taskType?: AuditTaskType;
}
export const AuditTaskMetadata = S.suspend(() =>
  S.Struct({
    taskId: S.optional(S.String),
    taskStatus: S.optional(AuditTaskStatus),
    taskType: S.optional(AuditTaskType),
  }),
).annotations({
  identifier: "AuditTaskMetadata",
}) as any as S.Schema<AuditTaskMetadata>;
export type AuditTaskMetadataList = AuditTaskMetadata[];
export const AuditTaskMetadataList = S.Array(AuditTaskMetadata);
export interface AuthorizerSummary {
  authorizerName?: string;
  authorizerArn?: string;
}
export const AuthorizerSummary = S.suspend(() =>
  S.Struct({
    authorizerName: S.optional(S.String),
    authorizerArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AuthorizerSummary",
}) as any as S.Schema<AuthorizerSummary>;
export type Authorizers = AuthorizerSummary[];
export const Authorizers = S.Array(AuthorizerSummary);
export type BillingGroupNameAndArnList = GroupNameAndArn[];
export const BillingGroupNameAndArnList = S.Array(GroupNameAndArn);
export interface CACertificate {
  certificateArn?: string;
  certificateId?: string;
  status?: CACertificateStatus;
  creationDate?: Date;
}
export const CACertificate = S.suspend(() =>
  S.Struct({
    certificateArn: S.optional(S.String),
    certificateId: S.optional(S.String),
    status: S.optional(CACertificateStatus),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "CACertificate",
}) as any as S.Schema<CACertificate>;
export type CACertificates = CACertificate[];
export const CACertificates = S.Array(CACertificate);
export interface CertificateProviderSummary {
  certificateProviderName?: string;
  certificateProviderArn?: string;
}
export const CertificateProviderSummary = S.suspend(() =>
  S.Struct({
    certificateProviderName: S.optional(S.String),
    certificateProviderArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CertificateProviderSummary",
}) as any as S.Schema<CertificateProviderSummary>;
export type CertificateProviders = CertificateProviderSummary[];
export const CertificateProviders = S.Array(CertificateProviderSummary);
export interface CommandSummary {
  commandArn?: string;
  commandId?: string;
  displayName?: string;
  deprecated?: boolean;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  pendingDeletion?: boolean;
}
export const CommandSummary = S.suspend(() =>
  S.Struct({
    commandArn: S.optional(S.String),
    commandId: S.optional(S.String),
    displayName: S.optional(S.String),
    deprecated: S.optional(S.Boolean),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    pendingDeletion: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CommandSummary",
}) as any as S.Schema<CommandSummary>;
export type CommandSummaryList = CommandSummary[];
export const CommandSummaryList = S.Array(CommandSummary);
export interface DetectMitigationActionExecution {
  taskId?: string;
  violationId?: string;
  actionName?: string;
  thingName?: string;
  executionStartDate?: Date;
  executionEndDate?: Date;
  status?: DetectMitigationActionExecutionStatus;
  errorCode?: string;
  message?: string;
}
export const DetectMitigationActionExecution = S.suspend(() =>
  S.Struct({
    taskId: S.optional(S.String),
    violationId: S.optional(S.String),
    actionName: S.optional(S.String),
    thingName: S.optional(S.String),
    executionStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    executionEndDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    status: S.optional(DetectMitigationActionExecutionStatus),
    errorCode: S.optional(S.String),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "DetectMitigationActionExecution",
}) as any as S.Schema<DetectMitigationActionExecution>;
export type DetectMitigationActionExecutionList =
  DetectMitigationActionExecution[];
export const DetectMitigationActionExecutionList = S.Array(
  DetectMitigationActionExecution,
);
export interface DomainConfigurationSummary {
  domainConfigurationName?: string;
  domainConfigurationArn?: string;
  serviceType?: ServiceType;
}
export const DomainConfigurationSummary = S.suspend(() =>
  S.Struct({
    domainConfigurationName: S.optional(S.String),
    domainConfigurationArn: S.optional(S.String),
    serviceType: S.optional(ServiceType),
  }),
).annotations({
  identifier: "DomainConfigurationSummary",
}) as any as S.Schema<DomainConfigurationSummary>;
export type DomainConfigurations = DomainConfigurationSummary[];
export const DomainConfigurations = S.Array(DomainConfigurationSummary);
export interface FleetMetricNameAndArn {
  metricName?: string;
  metricArn?: string;
}
export const FleetMetricNameAndArn = S.suspend(() =>
  S.Struct({
    metricName: S.optional(S.String),
    metricArn: S.optional(S.String),
  }),
).annotations({
  identifier: "FleetMetricNameAndArn",
}) as any as S.Schema<FleetMetricNameAndArn>;
export type FleetMetricNameAndArnList = FleetMetricNameAndArn[];
export const FleetMetricNameAndArnList = S.Array(FleetMetricNameAndArn);
export interface JobExecutionSummary {
  status?: JobExecutionStatus;
  queuedAt?: Date;
  startedAt?: Date;
  lastUpdatedAt?: Date;
  executionNumber?: number;
  retryAttempt?: number;
}
export const JobExecutionSummary = S.suspend(() =>
  S.Struct({
    status: S.optional(JobExecutionStatus),
    queuedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    executionNumber: S.optional(S.Number),
    retryAttempt: S.optional(S.Number),
  }),
).annotations({
  identifier: "JobExecutionSummary",
}) as any as S.Schema<JobExecutionSummary>;
export interface JobExecutionSummaryForThing {
  jobId?: string;
  jobExecutionSummary?: JobExecutionSummary;
}
export const JobExecutionSummaryForThing = S.suspend(() =>
  S.Struct({
    jobId: S.optional(S.String),
    jobExecutionSummary: S.optional(JobExecutionSummary),
  }),
).annotations({
  identifier: "JobExecutionSummaryForThing",
}) as any as S.Schema<JobExecutionSummaryForThing>;
export type JobExecutionSummaryForThingList = JobExecutionSummaryForThing[];
export const JobExecutionSummaryForThingList = S.Array(
  JobExecutionSummaryForThing,
);
export interface JobSummary {
  jobArn?: string;
  jobId?: string;
  thingGroupId?: string;
  targetSelection?: TargetSelection;
  status?: JobStatus;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  completedAt?: Date;
  isConcurrent?: boolean;
}
export const JobSummary = S.suspend(() =>
  S.Struct({
    jobArn: S.optional(S.String),
    jobId: S.optional(S.String),
    thingGroupId: S.optional(S.String),
    targetSelection: S.optional(TargetSelection),
    status: S.optional(JobStatus),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    completedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    isConcurrent: S.optional(S.Boolean),
  }),
).annotations({ identifier: "JobSummary" }) as any as S.Schema<JobSummary>;
export type JobSummaryList = JobSummary[];
export const JobSummaryList = S.Array(JobSummary);
export interface JobTemplateSummary {
  jobTemplateArn?: string;
  jobTemplateId?: string;
  description?: string;
  createdAt?: Date;
}
export const JobTemplateSummary = S.suspend(() =>
  S.Struct({
    jobTemplateArn: S.optional(S.String),
    jobTemplateId: S.optional(S.String),
    description: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "JobTemplateSummary",
}) as any as S.Schema<JobTemplateSummary>;
export type JobTemplateSummaryList = JobTemplateSummary[];
export const JobTemplateSummaryList = S.Array(JobTemplateSummary);
export interface ManagedJobTemplateSummary {
  templateArn?: string;
  templateName?: string;
  description?: string;
  environments?: string[];
  templateVersion?: string;
}
export const ManagedJobTemplateSummary = S.suspend(() =>
  S.Struct({
    templateArn: S.optional(S.String),
    templateName: S.optional(S.String),
    description: S.optional(S.String),
    environments: S.optional(Environments),
    templateVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "ManagedJobTemplateSummary",
}) as any as S.Schema<ManagedJobTemplateSummary>;
export type ManagedJobTemplatesSummaryList = ManagedJobTemplateSummary[];
export const ManagedJobTemplatesSummaryList = S.Array(
  ManagedJobTemplateSummary,
);
export interface MetricDatum {
  timestamp?: Date;
  value?: MetricValue;
}
export const MetricDatum = S.suspend(() =>
  S.Struct({
    timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    value: S.optional(MetricValue),
  }),
).annotations({ identifier: "MetricDatum" }) as any as S.Schema<MetricDatum>;
export type MetricDatumList = MetricDatum[];
export const MetricDatumList = S.Array(MetricDatum);
export interface MitigationActionIdentifier {
  actionName?: string;
  actionArn?: string;
  creationDate?: Date;
}
export const MitigationActionIdentifier = S.suspend(() =>
  S.Struct({
    actionName: S.optional(S.String),
    actionArn: S.optional(S.String),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "MitigationActionIdentifier",
}) as any as S.Schema<MitigationActionIdentifier>;
export type MitigationActionIdentifierList = MitigationActionIdentifier[];
export const MitigationActionIdentifierList = S.Array(
  MitigationActionIdentifier,
);
export interface OTAUpdateSummary {
  otaUpdateId?: string;
  otaUpdateArn?: string;
  creationDate?: Date;
}
export const OTAUpdateSummary = S.suspend(() =>
  S.Struct({
    otaUpdateId: S.optional(S.String),
    otaUpdateArn: S.optional(S.String),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "OTAUpdateSummary",
}) as any as S.Schema<OTAUpdateSummary>;
export type OTAUpdatesSummary = OTAUpdateSummary[];
export const OTAUpdatesSummary = S.Array(OTAUpdateSummary);
export interface OutgoingCertificate {
  certificateArn?: string;
  certificateId?: string;
  transferredTo?: string;
  transferDate?: Date;
  transferMessage?: string;
  creationDate?: Date;
}
export const OutgoingCertificate = S.suspend(() =>
  S.Struct({
    certificateArn: S.optional(S.String),
    certificateId: S.optional(S.String),
    transferredTo: S.optional(S.String),
    transferDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    transferMessage: S.optional(S.String),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "OutgoingCertificate",
}) as any as S.Schema<OutgoingCertificate>;
export type OutgoingCertificates = OutgoingCertificate[];
export const OutgoingCertificates = S.Array(OutgoingCertificate);
export interface PackageSummary {
  packageName?: string;
  defaultVersionName?: string;
  creationDate?: Date;
  lastModifiedDate?: Date;
}
export const PackageSummary = S.suspend(() =>
  S.Struct({
    packageName: S.optional(S.String),
    defaultVersionName: S.optional(S.String),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "PackageSummary",
}) as any as S.Schema<PackageSummary>;
export type PackageSummaryList = PackageSummary[];
export const PackageSummaryList = S.Array(PackageSummary);
export interface PackageVersionSummary {
  packageName?: string;
  versionName?: string;
  status?: PackageVersionStatus;
  creationDate?: Date;
  lastModifiedDate?: Date;
}
export const PackageVersionSummary = S.suspend(() =>
  S.Struct({
    packageName: S.optional(S.String),
    versionName: S.optional(S.String),
    status: S.optional(PackageVersionStatus),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "PackageVersionSummary",
}) as any as S.Schema<PackageVersionSummary>;
export type PackageVersionSummaryList = PackageVersionSummary[];
export const PackageVersionSummaryList = S.Array(PackageVersionSummary);
export interface PolicyVersion {
  versionId?: string;
  isDefaultVersion?: boolean;
  createDate?: Date;
}
export const PolicyVersion = S.suspend(() =>
  S.Struct({
    versionId: S.optional(S.String),
    isDefaultVersion: S.optional(S.Boolean),
    createDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "PolicyVersion",
}) as any as S.Schema<PolicyVersion>;
export type PolicyVersions = PolicyVersion[];
export const PolicyVersions = S.Array(PolicyVersion);
export interface PrincipalThingObject {
  thingName: string;
  thingPrincipalType?: ThingPrincipalType;
}
export const PrincipalThingObject = S.suspend(() =>
  S.Struct({
    thingName: S.String,
    thingPrincipalType: S.optional(ThingPrincipalType),
  }),
).annotations({
  identifier: "PrincipalThingObject",
}) as any as S.Schema<PrincipalThingObject>;
export type PrincipalThingObjects = PrincipalThingObject[];
export const PrincipalThingObjects = S.Array(PrincipalThingObject);
export interface ProvisioningTemplateSummary {
  templateArn?: string;
  templateName?: string;
  description?: string;
  creationDate?: Date;
  lastModifiedDate?: Date;
  enabled?: boolean;
  type?: TemplateType;
}
export const ProvisioningTemplateSummary = S.suspend(() =>
  S.Struct({
    templateArn: S.optional(S.String),
    templateName: S.optional(S.String),
    description: S.optional(S.String),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    enabled: S.optional(S.Boolean),
    type: S.optional(TemplateType),
  }),
).annotations({
  identifier: "ProvisioningTemplateSummary",
}) as any as S.Schema<ProvisioningTemplateSummary>;
export type ProvisioningTemplateListing = ProvisioningTemplateSummary[];
export const ProvisioningTemplateListing = S.Array(ProvisioningTemplateSummary);
export interface ProvisioningTemplateVersionSummary {
  versionId?: number;
  creationDate?: Date;
  isDefaultVersion?: boolean;
}
export const ProvisioningTemplateVersionSummary = S.suspend(() =>
  S.Struct({
    versionId: S.optional(S.Number),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    isDefaultVersion: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ProvisioningTemplateVersionSummary",
}) as any as S.Schema<ProvisioningTemplateVersionSummary>;
export type ProvisioningTemplateVersionListing =
  ProvisioningTemplateVersionSummary[];
export const ProvisioningTemplateVersionListing = S.Array(
  ProvisioningTemplateVersionSummary,
);
export interface SbomValidationResultSummary {
  fileName?: string;
  validationResult?: SbomValidationResult;
  errorCode?: SbomValidationErrorCode;
  errorMessage?: string;
}
export const SbomValidationResultSummary = S.suspend(() =>
  S.Struct({
    fileName: S.optional(S.String),
    validationResult: S.optional(SbomValidationResult),
    errorCode: S.optional(SbomValidationErrorCode),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "SbomValidationResultSummary",
}) as any as S.Schema<SbomValidationResultSummary>;
export type SbomValidationResultSummaryList = SbomValidationResultSummary[];
export const SbomValidationResultSummaryList = S.Array(
  SbomValidationResultSummary,
);
export interface ScheduledAuditMetadata {
  scheduledAuditName?: string;
  scheduledAuditArn?: string;
  frequency?: AuditFrequency;
  dayOfMonth?: string;
  dayOfWeek?: DayOfWeek;
}
export const ScheduledAuditMetadata = S.suspend(() =>
  S.Struct({
    scheduledAuditName: S.optional(S.String),
    scheduledAuditArn: S.optional(S.String),
    frequency: S.optional(AuditFrequency),
    dayOfMonth: S.optional(S.String),
    dayOfWeek: S.optional(DayOfWeek),
  }),
).annotations({
  identifier: "ScheduledAuditMetadata",
}) as any as S.Schema<ScheduledAuditMetadata>;
export type ScheduledAuditMetadataList = ScheduledAuditMetadata[];
export const ScheduledAuditMetadataList = S.Array(ScheduledAuditMetadata);
export interface SecurityProfileIdentifier {
  name: string;
  arn: string;
}
export const SecurityProfileIdentifier = S.suspend(() =>
  S.Struct({ name: S.String, arn: S.String }),
).annotations({
  identifier: "SecurityProfileIdentifier",
}) as any as S.Schema<SecurityProfileIdentifier>;
export type SecurityProfileIdentifiers = SecurityProfileIdentifier[];
export const SecurityProfileIdentifiers = S.Array(SecurityProfileIdentifier);
export interface SecurityProfileTarget {
  arn: string;
}
export const SecurityProfileTarget = S.suspend(() =>
  S.Struct({ arn: S.String }),
).annotations({
  identifier: "SecurityProfileTarget",
}) as any as S.Schema<SecurityProfileTarget>;
export interface SecurityProfileTargetMapping {
  securityProfileIdentifier?: SecurityProfileIdentifier;
  target?: SecurityProfileTarget;
}
export const SecurityProfileTargetMapping = S.suspend(() =>
  S.Struct({
    securityProfileIdentifier: S.optional(SecurityProfileIdentifier),
    target: S.optional(SecurityProfileTarget),
  }),
).annotations({
  identifier: "SecurityProfileTargetMapping",
}) as any as S.Schema<SecurityProfileTargetMapping>;
export type SecurityProfileTargetMappings = SecurityProfileTargetMapping[];
export const SecurityProfileTargetMappings = S.Array(
  SecurityProfileTargetMapping,
);
export interface StreamSummary {
  streamId?: string;
  streamArn?: string;
  streamVersion?: number;
  description?: string;
}
export const StreamSummary = S.suspend(() =>
  S.Struct({
    streamId: S.optional(S.String),
    streamArn: S.optional(S.String),
    streamVersion: S.optional(S.Number),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "StreamSummary",
}) as any as S.Schema<StreamSummary>;
export type StreamsSummary = StreamSummary[];
export const StreamsSummary = S.Array(StreamSummary);
export type SecurityProfileTargets = SecurityProfileTarget[];
export const SecurityProfileTargets = S.Array(SecurityProfileTarget);
export interface ThingPrincipalObject {
  principal: string;
  thingPrincipalType?: ThingPrincipalType;
}
export const ThingPrincipalObject = S.suspend(() =>
  S.Struct({
    principal: S.String,
    thingPrincipalType: S.optional(ThingPrincipalType),
  }),
).annotations({
  identifier: "ThingPrincipalObject",
}) as any as S.Schema<ThingPrincipalObject>;
export type ThingPrincipalObjects = ThingPrincipalObject[];
export const ThingPrincipalObjects = S.Array(ThingPrincipalObject);
export interface ThingAttribute {
  thingName?: string;
  thingTypeName?: string;
  thingArn?: string;
  attributes?: { [key: string]: string };
  version?: number;
}
export const ThingAttribute = S.suspend(() =>
  S.Struct({
    thingName: S.optional(S.String),
    thingTypeName: S.optional(S.String),
    thingArn: S.optional(S.String),
    attributes: S.optional(Attributes),
    version: S.optional(S.Number),
  }),
).annotations({
  identifier: "ThingAttribute",
}) as any as S.Schema<ThingAttribute>;
export type ThingAttributeList = ThingAttribute[];
export const ThingAttributeList = S.Array(ThingAttribute);
export interface ThingTypeDefinition {
  thingTypeName?: string;
  thingTypeArn?: string;
  thingTypeProperties?: ThingTypeProperties;
  thingTypeMetadata?: ThingTypeMetadata;
}
export const ThingTypeDefinition = S.suspend(() =>
  S.Struct({
    thingTypeName: S.optional(S.String),
    thingTypeArn: S.optional(S.String),
    thingTypeProperties: S.optional(ThingTypeProperties),
    thingTypeMetadata: S.optional(ThingTypeMetadata),
  }),
).annotations({
  identifier: "ThingTypeDefinition",
}) as any as S.Schema<ThingTypeDefinition>;
export type ThingTypeList = ThingTypeDefinition[];
export const ThingTypeList = S.Array(ThingTypeDefinition);
export interface TopicRuleListItem {
  ruleArn?: string;
  ruleName?: string;
  topicPattern?: string;
  createdAt?: Date;
  ruleDisabled?: boolean;
}
export const TopicRuleListItem = S.suspend(() =>
  S.Struct({
    ruleArn: S.optional(S.String),
    ruleName: S.optional(S.String),
    topicPattern: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ruleDisabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "TopicRuleListItem",
}) as any as S.Schema<TopicRuleListItem>;
export type TopicRuleList = TopicRuleListItem[];
export const TopicRuleList = S.Array(TopicRuleListItem);
export interface LogTargetConfiguration {
  logTarget?: LogTarget;
  logLevel?: LogLevel;
}
export const LogTargetConfiguration = S.suspend(() =>
  S.Struct({
    logTarget: S.optional(LogTarget),
    logLevel: S.optional(LogLevel),
  }),
).annotations({
  identifier: "LogTargetConfiguration",
}) as any as S.Schema<LogTargetConfiguration>;
export type LogTargetConfigurations = LogTargetConfiguration[];
export const LogTargetConfigurations = S.Array(LogTargetConfiguration);
export interface ViolationEventAdditionalInfo {
  confidenceLevel?: ConfidenceLevel;
}
export const ViolationEventAdditionalInfo = S.suspend(() =>
  S.Struct({ confidenceLevel: S.optional(ConfidenceLevel) }),
).annotations({
  identifier: "ViolationEventAdditionalInfo",
}) as any as S.Schema<ViolationEventAdditionalInfo>;
export interface ViolationEvent {
  violationId?: string;
  thingName?: string;
  securityProfileName?: string;
  behavior?: Behavior;
  metricValue?: MetricValue;
  violationEventAdditionalInfo?: ViolationEventAdditionalInfo;
  violationEventType?: ViolationEventType;
  verificationState?: VerificationState;
  verificationStateDescription?: string;
  violationEventTime?: Date;
}
export const ViolationEvent = S.suspend(() =>
  S.Struct({
    violationId: S.optional(S.String),
    thingName: S.optional(S.String),
    securityProfileName: S.optional(S.String),
    behavior: S.optional(Behavior),
    metricValue: S.optional(MetricValue),
    violationEventAdditionalInfo: S.optional(ViolationEventAdditionalInfo),
    violationEventType: S.optional(ViolationEventType),
    verificationState: S.optional(VerificationState),
    verificationStateDescription: S.optional(S.String),
    violationEventTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ViolationEvent",
}) as any as S.Schema<ViolationEvent>;
export type ViolationEvents = ViolationEvent[];
export const ViolationEvents = S.Array(ViolationEvent);
export interface ThingGroupDocument {
  thingGroupName?: string;
  thingGroupId?: string;
  thingGroupDescription?: string;
  attributes?: { [key: string]: string };
  parentGroupNames?: string[];
}
export const ThingGroupDocument = S.suspend(() =>
  S.Struct({
    thingGroupName: S.optional(S.String),
    thingGroupId: S.optional(S.String),
    thingGroupDescription: S.optional(S.String),
    attributes: S.optional(Attributes),
    parentGroupNames: S.optional(ThingGroupNameList),
  }),
).annotations({
  identifier: "ThingGroupDocument",
}) as any as S.Schema<ThingGroupDocument>;
export type ThingGroupDocumentList = ThingGroupDocument[];
export const ThingGroupDocumentList = S.Array(ThingGroupDocument);
export interface AuditMitigationActionsTaskTarget {
  auditTaskId?: string;
  findingIds?: string[];
  auditCheckToReasonCodeFilter?: { [key: string]: string[] };
}
export const AuditMitigationActionsTaskTarget = S.suspend(() =>
  S.Struct({
    auditTaskId: S.optional(S.String),
    findingIds: S.optional(FindingIds),
    auditCheckToReasonCodeFilter: S.optional(AuditCheckToReasonCodeFilter),
  }),
).annotations({
  identifier: "AuditMitigationActionsTaskTarget",
}) as any as S.Schema<AuditMitigationActionsTaskTarget>;
export interface HttpContext {
  headers?: { [key: string]: string };
  queryString?: string;
}
export const HttpContext = S.suspend(() =>
  S.Struct({
    headers: S.optional(HttpHeaders),
    queryString: S.optional(S.String),
  }),
).annotations({ identifier: "HttpContext" }) as any as S.Schema<HttpContext>;
export interface ValidationError {
  errorMessage?: string;
}
export const ValidationError = S.suspend(() =>
  S.Struct({ errorMessage: S.optional(S.String) }),
).annotations({
  identifier: "ValidationError",
}) as any as S.Schema<ValidationError>;
export type ValidationErrors = ValidationError[];
export const ValidationErrors = S.Array(ValidationError);
export interface AwsJobRateIncreaseCriteria {
  numberOfNotifiedThings?: number;
  numberOfSucceededThings?: number;
}
export const AwsJobRateIncreaseCriteria = S.suspend(() =>
  S.Struct({
    numberOfNotifiedThings: S.optional(S.Number),
    numberOfSucceededThings: S.optional(S.Number),
  }),
).annotations({
  identifier: "AwsJobRateIncreaseCriteria",
}) as any as S.Schema<AwsJobRateIncreaseCriteria>;
export interface Stream {
  streamId?: string;
  fileId?: number;
}
export const Stream = S.suspend(() =>
  S.Struct({ streamId: S.optional(S.String), fileId: S.optional(S.Number) }),
).annotations({ identifier: "Stream" }) as any as S.Schema<Stream>;
export type AuditCheckRunStatus =
  | "IN_PROGRESS"
  | "WAITING_FOR_DATA_COLLECTION"
  | "CANCELED"
  | "COMPLETED_COMPLIANT"
  | "COMPLETED_NON_COMPLIANT"
  | "FAILED";
export const AuditCheckRunStatus = S.Literal(
  "IN_PROGRESS",
  "WAITING_FOR_DATA_COLLECTION",
  "CANCELED",
  "COMPLETED_COMPLIANT",
  "COMPLETED_NON_COMPLIANT",
  "FAILED",
);
export type ProcessingTargetNameList = string[];
export const ProcessingTargetNameList = S.Array(S.String);
export interface AssociateSbomWithPackageVersionRequest {
  packageName: string;
  versionName: string;
  sbom: Sbom;
  clientToken?: string;
}
export const AssociateSbomWithPackageVersionRequest = S.suspend(() =>
  S.Struct({
    packageName: S.String.pipe(T.HttpLabel("packageName")),
    versionName: S.String.pipe(T.HttpLabel("versionName")),
    sbom: Sbom,
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/packages/{packageName}/versions/{versionName}/sbom",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateSbomWithPackageVersionRequest",
}) as any as S.Schema<AssociateSbomWithPackageVersionRequest>;
export interface CreateAuditSuppressionRequest {
  checkName: string;
  resourceIdentifier: ResourceIdentifier;
  expirationDate?: Date;
  suppressIndefinitely?: boolean;
  description?: string;
  clientRequestToken: string;
}
export const CreateAuditSuppressionRequest = S.suspend(() =>
  S.Struct({
    checkName: S.String,
    resourceIdentifier: ResourceIdentifier,
    expirationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    suppressIndefinitely: S.optional(S.Boolean),
    description: S.optional(S.String),
    clientRequestToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/audit/suppressions/create" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAuditSuppressionRequest",
}) as any as S.Schema<CreateAuditSuppressionRequest>;
export interface CreateAuditSuppressionResponse {}
export const CreateAuditSuppressionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateAuditSuppressionResponse",
}) as any as S.Schema<CreateAuditSuppressionResponse>;
export interface CreateAuthorizerResponse {
  authorizerName?: string;
  authorizerArn?: string;
}
export const CreateAuthorizerResponse = S.suspend(() =>
  S.Struct({
    authorizerName: S.optional(S.String),
    authorizerArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateAuthorizerResponse",
}) as any as S.Schema<CreateAuthorizerResponse>;
export interface CreateBillingGroupResponse {
  billingGroupName?: string;
  billingGroupArn?: string;
  billingGroupId?: string;
}
export const CreateBillingGroupResponse = S.suspend(() =>
  S.Struct({
    billingGroupName: S.optional(S.String),
    billingGroupArn: S.optional(S.String),
    billingGroupId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateBillingGroupResponse",
}) as any as S.Schema<CreateBillingGroupResponse>;
export interface CreateDomainConfigurationResponse {
  domainConfigurationName?: string;
  domainConfigurationArn?: string;
}
export const CreateDomainConfigurationResponse = S.suspend(() =>
  S.Struct({
    domainConfigurationName: S.optional(S.String),
    domainConfigurationArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateDomainConfigurationResponse",
}) as any as S.Schema<CreateDomainConfigurationResponse>;
export interface CreateDynamicThingGroupResponse {
  thingGroupName?: string;
  thingGroupArn?: string;
  thingGroupId?: string;
  indexName?: string;
  queryString?: string;
  queryVersion?: string;
}
export const CreateDynamicThingGroupResponse = S.suspend(() =>
  S.Struct({
    thingGroupName: S.optional(S.String),
    thingGroupArn: S.optional(S.String),
    thingGroupId: S.optional(S.String),
    indexName: S.optional(S.String),
    queryString: S.optional(S.String),
    queryVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateDynamicThingGroupResponse",
}) as any as S.Schema<CreateDynamicThingGroupResponse>;
export interface CreateFleetMetricResponse {
  metricName?: string;
  metricArn?: string;
}
export const CreateFleetMetricResponse = S.suspend(() =>
  S.Struct({
    metricName: S.optional(S.String),
    metricArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateFleetMetricResponse",
}) as any as S.Schema<CreateFleetMetricResponse>;
export interface CreateJobTemplateResponse {
  jobTemplateArn?: string;
  jobTemplateId?: string;
}
export const CreateJobTemplateResponse = S.suspend(() =>
  S.Struct({
    jobTemplateArn: S.optional(S.String),
    jobTemplateId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateJobTemplateResponse",
}) as any as S.Schema<CreateJobTemplateResponse>;
export interface CreateKeysAndCertificateResponse {
  certificateArn?: string;
  certificateId?: string;
  certificatePem?: string;
  keyPair?: KeyPair;
}
export const CreateKeysAndCertificateResponse = S.suspend(() =>
  S.Struct({
    certificateArn: S.optional(S.String),
    certificateId: S.optional(S.String),
    certificatePem: S.optional(S.String),
    keyPair: S.optional(KeyPair),
  }),
).annotations({
  identifier: "CreateKeysAndCertificateResponse",
}) as any as S.Schema<CreateKeysAndCertificateResponse>;
export interface CreateMitigationActionRequest {
  actionName: string;
  roleArn: string;
  actionParams: MitigationActionParams;
  tags?: Tag[];
}
export const CreateMitigationActionRequest = S.suspend(() =>
  S.Struct({
    actionName: S.String.pipe(T.HttpLabel("actionName")),
    roleArn: S.String,
    actionParams: MitigationActionParams,
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/mitigationactions/actions/{actionName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMitigationActionRequest",
}) as any as S.Schema<CreateMitigationActionRequest>;
export interface CreatePackageResponse {
  packageName?: string;
  packageArn?: string;
  description?: string | redacted.Redacted<string>;
}
export const CreatePackageResponse = S.suspend(() =>
  S.Struct({
    packageName: S.optional(S.String),
    packageArn: S.optional(S.String),
    description: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "CreatePackageResponse",
}) as any as S.Schema<CreatePackageResponse>;
export interface CreatePackageVersionResponse {
  packageVersionArn?: string;
  packageName?: string;
  versionName?: string;
  description?: string | redacted.Redacted<string>;
  attributes?: { [key: string]: string };
  status?: PackageVersionStatus;
  errorReason?: string;
}
export const CreatePackageVersionResponse = S.suspend(() =>
  S.Struct({
    packageVersionArn: S.optional(S.String),
    packageName: S.optional(S.String),
    versionName: S.optional(S.String),
    description: S.optional(SensitiveString),
    attributes: S.optional(ResourceAttributes),
    status: S.optional(PackageVersionStatus),
    errorReason: S.optional(S.String),
  }),
).annotations({
  identifier: "CreatePackageVersionResponse",
}) as any as S.Schema<CreatePackageVersionResponse>;
export interface CreateProvisioningTemplateResponse {
  templateArn?: string;
  templateName?: string;
  defaultVersionId?: number;
}
export const CreateProvisioningTemplateResponse = S.suspend(() =>
  S.Struct({
    templateArn: S.optional(S.String),
    templateName: S.optional(S.String),
    defaultVersionId: S.optional(S.Number),
  }),
).annotations({
  identifier: "CreateProvisioningTemplateResponse",
}) as any as S.Schema<CreateProvisioningTemplateResponse>;
export interface CreateStreamResponse {
  streamId?: string;
  streamArn?: string;
  description?: string;
  streamVersion?: number;
}
export const CreateStreamResponse = S.suspend(() =>
  S.Struct({
    streamId: S.optional(S.String),
    streamArn: S.optional(S.String),
    description: S.optional(S.String),
    streamVersion: S.optional(S.Number),
  }),
).annotations({
  identifier: "CreateStreamResponse",
}) as any as S.Schema<CreateStreamResponse>;
export interface CreateThingRequest {
  thingName: string;
  thingTypeName?: string;
  attributePayload?: AttributePayload;
  billingGroupName?: string;
}
export const CreateThingRequest = S.suspend(() =>
  S.Struct({
    thingName: S.String.pipe(T.HttpLabel("thingName")),
    thingTypeName: S.optional(S.String),
    attributePayload: S.optional(AttributePayload),
    billingGroupName: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/things/{thingName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateThingRequest",
}) as any as S.Schema<CreateThingRequest>;
export interface CreateTopicRuleDestinationRequest {
  destinationConfiguration: TopicRuleDestinationConfiguration;
}
export const CreateTopicRuleDestinationRequest = S.suspend(() =>
  S.Struct({
    destinationConfiguration: TopicRuleDestinationConfiguration,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/destinations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTopicRuleDestinationRequest",
}) as any as S.Schema<CreateTopicRuleDestinationRequest>;
export interface DescribeBillingGroupResponse {
  billingGroupName?: string;
  billingGroupId?: string;
  billingGroupArn?: string;
  version?: number;
  billingGroupProperties?: BillingGroupProperties;
  billingGroupMetadata?: BillingGroupMetadata;
}
export const DescribeBillingGroupResponse = S.suspend(() =>
  S.Struct({
    billingGroupName: S.optional(S.String),
    billingGroupId: S.optional(S.String),
    billingGroupArn: S.optional(S.String),
    version: S.optional(S.Number),
    billingGroupProperties: S.optional(BillingGroupProperties),
    billingGroupMetadata: S.optional(BillingGroupMetadata),
  }),
).annotations({
  identifier: "DescribeBillingGroupResponse",
}) as any as S.Schema<DescribeBillingGroupResponse>;
export interface DescribeDomainConfigurationResponse {
  domainConfigurationName?: string;
  domainConfigurationArn?: string;
  domainName?: string;
  serverCertificates?: ServerCertificateSummary[];
  authorizerConfig?: AuthorizerConfig;
  domainConfigurationStatus?: DomainConfigurationStatus;
  serviceType?: ServiceType;
  domainType?: DomainType;
  lastStatusChangeDate?: Date;
  tlsConfig?: TlsConfig;
  serverCertificateConfig?: ServerCertificateConfig;
  authenticationType?: AuthenticationType;
  applicationProtocol?: ApplicationProtocol;
  clientCertificateConfig?: ClientCertificateConfig;
}
export const DescribeDomainConfigurationResponse = S.suspend(() =>
  S.Struct({
    domainConfigurationName: S.optional(S.String),
    domainConfigurationArn: S.optional(S.String),
    domainName: S.optional(S.String),
    serverCertificates: S.optional(ServerCertificates),
    authorizerConfig: S.optional(AuthorizerConfig),
    domainConfigurationStatus: S.optional(DomainConfigurationStatus),
    serviceType: S.optional(ServiceType),
    domainType: S.optional(DomainType),
    lastStatusChangeDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    tlsConfig: S.optional(TlsConfig),
    serverCertificateConfig: S.optional(ServerCertificateConfig),
    authenticationType: S.optional(AuthenticationType),
    applicationProtocol: S.optional(ApplicationProtocol),
    clientCertificateConfig: S.optional(ClientCertificateConfig),
  }),
).annotations({
  identifier: "DescribeDomainConfigurationResponse",
}) as any as S.Schema<DescribeDomainConfigurationResponse>;
export interface DescribeEventConfigurationsResponse {
  eventConfigurations?: { [key: string]: Configuration };
  creationDate?: Date;
  lastModifiedDate?: Date;
}
export const DescribeEventConfigurationsResponse = S.suspend(() =>
  S.Struct({
    eventConfigurations: S.optional(EventConfigurations),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DescribeEventConfigurationsResponse",
}) as any as S.Schema<DescribeEventConfigurationsResponse>;
export interface DescribeManagedJobTemplateResponse {
  templateName?: string;
  templateArn?: string;
  description?: string;
  templateVersion?: string;
  environments?: string[];
  documentParameters?: DocumentParameter[];
  document?: string;
}
export const DescribeManagedJobTemplateResponse = S.suspend(() =>
  S.Struct({
    templateName: S.optional(S.String),
    templateArn: S.optional(S.String),
    description: S.optional(S.String),
    templateVersion: S.optional(S.String),
    environments: S.optional(Environments),
    documentParameters: S.optional(DocumentParameters),
    document: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeManagedJobTemplateResponse",
}) as any as S.Schema<DescribeManagedJobTemplateResponse>;
export interface DescribeRoleAliasResponse {
  roleAliasDescription?: RoleAliasDescription;
}
export const DescribeRoleAliasResponse = S.suspend(() =>
  S.Struct({ roleAliasDescription: S.optional(RoleAliasDescription) }),
).annotations({
  identifier: "DescribeRoleAliasResponse",
}) as any as S.Schema<DescribeRoleAliasResponse>;
export interface DescribeStreamResponse {
  streamInfo?: StreamInfo;
}
export const DescribeStreamResponse = S.suspend(() =>
  S.Struct({ streamInfo: S.optional(StreamInfo) }),
).annotations({
  identifier: "DescribeStreamResponse",
}) as any as S.Schema<DescribeStreamResponse>;
export interface DescribeThingGroupResponse {
  thingGroupName?: string;
  thingGroupId?: string;
  thingGroupArn?: string;
  version?: number;
  thingGroupProperties?: ThingGroupProperties;
  thingGroupMetadata?: ThingGroupMetadata;
  indexName?: string;
  queryString?: string;
  queryVersion?: string;
  status?: DynamicGroupStatus;
}
export const DescribeThingGroupResponse = S.suspend(() =>
  S.Struct({
    thingGroupName: S.optional(S.String),
    thingGroupId: S.optional(S.String),
    thingGroupArn: S.optional(S.String),
    version: S.optional(S.Number),
    thingGroupProperties: S.optional(ThingGroupProperties),
    thingGroupMetadata: S.optional(ThingGroupMetadata),
    indexName: S.optional(S.String),
    queryString: S.optional(S.String),
    queryVersion: S.optional(S.String),
    status: S.optional(DynamicGroupStatus),
  }),
).annotations({
  identifier: "DescribeThingGroupResponse",
}) as any as S.Schema<DescribeThingGroupResponse>;
export interface DescribeThingTypeResponse {
  thingTypeName?: string;
  thingTypeId?: string;
  thingTypeArn?: string;
  thingTypeProperties?: ThingTypeProperties;
  thingTypeMetadata?: ThingTypeMetadata;
}
export const DescribeThingTypeResponse = S.suspend(() =>
  S.Struct({
    thingTypeName: S.optional(S.String),
    thingTypeId: S.optional(S.String),
    thingTypeArn: S.optional(S.String),
    thingTypeProperties: S.optional(ThingTypeProperties),
    thingTypeMetadata: S.optional(ThingTypeMetadata),
  }),
).annotations({
  identifier: "DescribeThingTypeResponse",
}) as any as S.Schema<DescribeThingTypeResponse>;
export interface GetBehaviorModelTrainingSummariesResponse {
  summaries?: BehaviorModelTrainingSummary[];
  nextToken?: string;
}
export const GetBehaviorModelTrainingSummariesResponse = S.suspend(() =>
  S.Struct({
    summaries: S.optional(BehaviorModelTrainingSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetBehaviorModelTrainingSummariesResponse",
}) as any as S.Schema<GetBehaviorModelTrainingSummariesResponse>;
export interface GetBucketsAggregationRequest {
  indexName?: string;
  queryString: string;
  aggregationField: string;
  queryVersion?: string;
  bucketsAggregationType: BucketsAggregationType;
}
export const GetBucketsAggregationRequest = S.suspend(() =>
  S.Struct({
    indexName: S.optional(S.String),
    queryString: S.String,
    aggregationField: S.String,
    queryVersion: S.optional(S.String),
    bucketsAggregationType: BucketsAggregationType,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/indices/buckets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBucketsAggregationRequest",
}) as any as S.Schema<GetBucketsAggregationRequest>;
export interface GetEffectivePoliciesResponse {
  effectivePolicies?: EffectivePolicy[];
}
export const GetEffectivePoliciesResponse = S.suspend(() =>
  S.Struct({ effectivePolicies: S.optional(EffectivePolicies) }),
).annotations({
  identifier: "GetEffectivePoliciesResponse",
}) as any as S.Schema<GetEffectivePoliciesResponse>;
export interface GetPercentilesResponse {
  percentiles?: PercentPair[];
}
export const GetPercentilesResponse = S.suspend(() =>
  S.Struct({ percentiles: S.optional(Percentiles) }),
).annotations({
  identifier: "GetPercentilesResponse",
}) as any as S.Schema<GetPercentilesResponse>;
export interface GetStatisticsResponse {
  statistics?: Statistics;
}
export const GetStatisticsResponse = S.suspend(() =>
  S.Struct({ statistics: S.optional(Statistics) }),
).annotations({
  identifier: "GetStatisticsResponse",
}) as any as S.Schema<GetStatisticsResponse>;
export interface GetTopicRuleResponse {
  ruleArn?: string;
  rule?: TopicRule;
}
export const GetTopicRuleResponse = S.suspend(() =>
  S.Struct({ ruleArn: S.optional(S.String), rule: S.optional(TopicRule) }),
).annotations({
  identifier: "GetTopicRuleResponse",
}) as any as S.Schema<GetTopicRuleResponse>;
export interface ListAttachedPoliciesResponse {
  policies?: Policy[];
  nextMarker?: string;
}
export const ListAttachedPoliciesResponse = S.suspend(() =>
  S.Struct({
    policies: S.optional(Policies),
    nextMarker: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAttachedPoliciesResponse",
}) as any as S.Schema<ListAttachedPoliciesResponse>;
export interface ListAuditMitigationActionsExecutionsResponse {
  actionsExecutions?: AuditMitigationActionExecutionMetadata[];
  nextToken?: string;
}
export const ListAuditMitigationActionsExecutionsResponse = S.suspend(() =>
  S.Struct({
    actionsExecutions: S.optional(AuditMitigationActionExecutionMetadataList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAuditMitigationActionsExecutionsResponse",
}) as any as S.Schema<ListAuditMitigationActionsExecutionsResponse>;
export interface ListAuditMitigationActionsTasksResponse {
  tasks?: AuditMitigationActionsTaskMetadata[];
  nextToken?: string;
}
export const ListAuditMitigationActionsTasksResponse = S.suspend(() =>
  S.Struct({
    tasks: S.optional(AuditMitigationActionsTaskMetadataList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAuditMitigationActionsTasksResponse",
}) as any as S.Schema<ListAuditMitigationActionsTasksResponse>;
export interface ListAuditSuppressionsResponse {
  suppressions?: AuditSuppression[];
  nextToken?: string;
}
export const ListAuditSuppressionsResponse = S.suspend(() =>
  S.Struct({
    suppressions: S.optional(AuditSuppressionList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAuditSuppressionsResponse",
}) as any as S.Schema<ListAuditSuppressionsResponse>;
export interface ListAuditTasksResponse {
  tasks?: AuditTaskMetadata[];
  nextToken?: string;
}
export const ListAuditTasksResponse = S.suspend(() =>
  S.Struct({
    tasks: S.optional(AuditTaskMetadataList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAuditTasksResponse",
}) as any as S.Schema<ListAuditTasksResponse>;
export interface ListAuthorizersResponse {
  authorizers?: AuthorizerSummary[];
  nextMarker?: string;
}
export const ListAuthorizersResponse = S.suspend(() =>
  S.Struct({
    authorizers: S.optional(Authorizers),
    nextMarker: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAuthorizersResponse",
}) as any as S.Schema<ListAuthorizersResponse>;
export interface ListBillingGroupsResponse {
  billingGroups?: GroupNameAndArn[];
  nextToken?: string;
}
export const ListBillingGroupsResponse = S.suspend(() =>
  S.Struct({
    billingGroups: S.optional(BillingGroupNameAndArnList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBillingGroupsResponse",
}) as any as S.Schema<ListBillingGroupsResponse>;
export interface ListCACertificatesResponse {
  certificates?: CACertificate[];
  nextMarker?: string;
}
export const ListCACertificatesResponse = S.suspend(() =>
  S.Struct({
    certificates: S.optional(CACertificates),
    nextMarker: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCACertificatesResponse",
}) as any as S.Schema<ListCACertificatesResponse>;
export interface ListCertificateProvidersResponse {
  certificateProviders?: CertificateProviderSummary[];
  nextToken?: string;
}
export const ListCertificateProvidersResponse = S.suspend(() =>
  S.Struct({
    certificateProviders: S.optional(CertificateProviders),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCertificateProvidersResponse",
}) as any as S.Schema<ListCertificateProvidersResponse>;
export interface ListCertificatesResponse {
  certificates?: Certificate[];
  nextMarker?: string;
}
export const ListCertificatesResponse = S.suspend(() =>
  S.Struct({
    certificates: S.optional(Certificates),
    nextMarker: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCertificatesResponse",
}) as any as S.Schema<ListCertificatesResponse>;
export interface ListCommandsResponse {
  commands?: CommandSummary[];
  nextToken?: string;
}
export const ListCommandsResponse = S.suspend(() =>
  S.Struct({
    commands: S.optional(CommandSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCommandsResponse",
}) as any as S.Schema<ListCommandsResponse>;
export interface ListDetectMitigationActionsExecutionsResponse {
  actionsExecutions?: DetectMitigationActionExecution[];
  nextToken?: string;
}
export const ListDetectMitigationActionsExecutionsResponse = S.suspend(() =>
  S.Struct({
    actionsExecutions: S.optional(DetectMitigationActionExecutionList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDetectMitigationActionsExecutionsResponse",
}) as any as S.Schema<ListDetectMitigationActionsExecutionsResponse>;
export interface ListDomainConfigurationsResponse {
  domainConfigurations?: DomainConfigurationSummary[];
  nextMarker?: string;
}
export const ListDomainConfigurationsResponse = S.suspend(() =>
  S.Struct({
    domainConfigurations: S.optional(DomainConfigurations),
    nextMarker: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDomainConfigurationsResponse",
}) as any as S.Schema<ListDomainConfigurationsResponse>;
export interface ListFleetMetricsResponse {
  fleetMetrics?: FleetMetricNameAndArn[];
  nextToken?: string;
}
export const ListFleetMetricsResponse = S.suspend(() =>
  S.Struct({
    fleetMetrics: S.optional(FleetMetricNameAndArnList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFleetMetricsResponse",
}) as any as S.Schema<ListFleetMetricsResponse>;
export interface ListJobExecutionsForThingResponse {
  executionSummaries?: JobExecutionSummaryForThing[];
  nextToken?: string;
}
export const ListJobExecutionsForThingResponse = S.suspend(() =>
  S.Struct({
    executionSummaries: S.optional(JobExecutionSummaryForThingList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListJobExecutionsForThingResponse",
}) as any as S.Schema<ListJobExecutionsForThingResponse>;
export interface ListJobsResponse {
  jobs?: JobSummary[];
  nextToken?: string;
}
export const ListJobsResponse = S.suspend(() =>
  S.Struct({
    jobs: S.optional(JobSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListJobsResponse",
}) as any as S.Schema<ListJobsResponse>;
export interface ListJobTemplatesResponse {
  jobTemplates?: JobTemplateSummary[];
  nextToken?: string;
}
export const ListJobTemplatesResponse = S.suspend(() =>
  S.Struct({
    jobTemplates: S.optional(JobTemplateSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListJobTemplatesResponse",
}) as any as S.Schema<ListJobTemplatesResponse>;
export interface ListManagedJobTemplatesResponse {
  managedJobTemplates?: ManagedJobTemplateSummary[];
  nextToken?: string;
}
export const ListManagedJobTemplatesResponse = S.suspend(() =>
  S.Struct({
    managedJobTemplates: S.optional(ManagedJobTemplatesSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListManagedJobTemplatesResponse",
}) as any as S.Schema<ListManagedJobTemplatesResponse>;
export interface ListMetricValuesResponse {
  metricDatumList?: MetricDatum[];
  nextToken?: string;
}
export const ListMetricValuesResponse = S.suspend(() =>
  S.Struct({
    metricDatumList: S.optional(MetricDatumList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMetricValuesResponse",
}) as any as S.Schema<ListMetricValuesResponse>;
export interface ListMitigationActionsResponse {
  actionIdentifiers?: MitigationActionIdentifier[];
  nextToken?: string;
}
export const ListMitigationActionsResponse = S.suspend(() =>
  S.Struct({
    actionIdentifiers: S.optional(MitigationActionIdentifierList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMitigationActionsResponse",
}) as any as S.Schema<ListMitigationActionsResponse>;
export interface ListOTAUpdatesResponse {
  otaUpdates?: OTAUpdateSummary[];
  nextToken?: string;
}
export const ListOTAUpdatesResponse = S.suspend(() =>
  S.Struct({
    otaUpdates: S.optional(OTAUpdatesSummary),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListOTAUpdatesResponse",
}) as any as S.Schema<ListOTAUpdatesResponse>;
export interface ListOutgoingCertificatesResponse {
  outgoingCertificates?: OutgoingCertificate[];
  nextMarker?: string;
}
export const ListOutgoingCertificatesResponse = S.suspend(() =>
  S.Struct({
    outgoingCertificates: S.optional(OutgoingCertificates),
    nextMarker: S.optional(S.String),
  }),
).annotations({
  identifier: "ListOutgoingCertificatesResponse",
}) as any as S.Schema<ListOutgoingCertificatesResponse>;
export interface ListPackagesResponse {
  packageSummaries?: PackageSummary[];
  nextToken?: string;
}
export const ListPackagesResponse = S.suspend(() =>
  S.Struct({
    packageSummaries: S.optional(PackageSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPackagesResponse",
}) as any as S.Schema<ListPackagesResponse>;
export interface ListPackageVersionsResponse {
  packageVersionSummaries?: PackageVersionSummary[];
  nextToken?: string;
}
export const ListPackageVersionsResponse = S.suspend(() =>
  S.Struct({
    packageVersionSummaries: S.optional(PackageVersionSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPackageVersionsResponse",
}) as any as S.Schema<ListPackageVersionsResponse>;
export interface ListPolicyVersionsResponse {
  policyVersions?: PolicyVersion[];
}
export const ListPolicyVersionsResponse = S.suspend(() =>
  S.Struct({ policyVersions: S.optional(PolicyVersions) }),
).annotations({
  identifier: "ListPolicyVersionsResponse",
}) as any as S.Schema<ListPolicyVersionsResponse>;
export interface ListPrincipalThingsV2Response {
  principalThingObjects?: PrincipalThingObject[];
  nextToken?: string;
}
export const ListPrincipalThingsV2Response = S.suspend(() =>
  S.Struct({
    principalThingObjects: S.optional(PrincipalThingObjects),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPrincipalThingsV2Response",
}) as any as S.Schema<ListPrincipalThingsV2Response>;
export interface ListProvisioningTemplatesResponse {
  templates?: ProvisioningTemplateSummary[];
  nextToken?: string;
}
export const ListProvisioningTemplatesResponse = S.suspend(() =>
  S.Struct({
    templates: S.optional(ProvisioningTemplateListing),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProvisioningTemplatesResponse",
}) as any as S.Schema<ListProvisioningTemplatesResponse>;
export interface ListProvisioningTemplateVersionsResponse {
  versions?: ProvisioningTemplateVersionSummary[];
  nextToken?: string;
}
export const ListProvisioningTemplateVersionsResponse = S.suspend(() =>
  S.Struct({
    versions: S.optional(ProvisioningTemplateVersionListing),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProvisioningTemplateVersionsResponse",
}) as any as S.Schema<ListProvisioningTemplateVersionsResponse>;
export interface ListSbomValidationResultsResponse {
  validationResultSummaries?: SbomValidationResultSummary[];
  nextToken?: string;
}
export const ListSbomValidationResultsResponse = S.suspend(() =>
  S.Struct({
    validationResultSummaries: S.optional(SbomValidationResultSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSbomValidationResultsResponse",
}) as any as S.Schema<ListSbomValidationResultsResponse>;
export interface ListScheduledAuditsResponse {
  scheduledAudits?: ScheduledAuditMetadata[];
  nextToken?: string;
}
export const ListScheduledAuditsResponse = S.suspend(() =>
  S.Struct({
    scheduledAudits: S.optional(ScheduledAuditMetadataList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListScheduledAuditsResponse",
}) as any as S.Schema<ListScheduledAuditsResponse>;
export interface ListSecurityProfilesResponse {
  securityProfileIdentifiers?: SecurityProfileIdentifier[];
  nextToken?: string;
}
export const ListSecurityProfilesResponse = S.suspend(() =>
  S.Struct({
    securityProfileIdentifiers: S.optional(SecurityProfileIdentifiers),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSecurityProfilesResponse",
}) as any as S.Schema<ListSecurityProfilesResponse>;
export interface ListSecurityProfilesForTargetResponse {
  securityProfileTargetMappings?: SecurityProfileTargetMapping[];
  nextToken?: string;
}
export const ListSecurityProfilesForTargetResponse = S.suspend(() =>
  S.Struct({
    securityProfileTargetMappings: S.optional(SecurityProfileTargetMappings),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSecurityProfilesForTargetResponse",
}) as any as S.Schema<ListSecurityProfilesForTargetResponse>;
export interface ListStreamsResponse {
  streams?: StreamSummary[];
  nextToken?: string;
}
export const ListStreamsResponse = S.suspend(() =>
  S.Struct({
    streams: S.optional(StreamsSummary),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListStreamsResponse",
}) as any as S.Schema<ListStreamsResponse>;
export interface ListTargetsForSecurityProfileResponse {
  securityProfileTargets?: SecurityProfileTarget[];
  nextToken?: string;
}
export const ListTargetsForSecurityProfileResponse = S.suspend(() =>
  S.Struct({
    securityProfileTargets: S.optional(SecurityProfileTargets),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTargetsForSecurityProfileResponse",
}) as any as S.Schema<ListTargetsForSecurityProfileResponse>;
export interface ListThingPrincipalsV2Response {
  thingPrincipalObjects?: ThingPrincipalObject[];
  nextToken?: string;
}
export const ListThingPrincipalsV2Response = S.suspend(() =>
  S.Struct({
    thingPrincipalObjects: S.optional(ThingPrincipalObjects),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListThingPrincipalsV2Response",
}) as any as S.Schema<ListThingPrincipalsV2Response>;
export interface ListThingsResponse {
  things?: ThingAttribute[];
  nextToken?: string;
}
export const ListThingsResponse = S.suspend(() =>
  S.Struct({
    things: S.optional(ThingAttributeList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListThingsResponse",
}) as any as S.Schema<ListThingsResponse>;
export interface ListThingTypesResponse {
  thingTypes?: ThingTypeDefinition[];
  nextToken?: string;
}
export const ListThingTypesResponse = S.suspend(() =>
  S.Struct({
    thingTypes: S.optional(ThingTypeList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListThingTypesResponse",
}) as any as S.Schema<ListThingTypesResponse>;
export interface ListTopicRulesResponse {
  rules?: TopicRuleListItem[];
  nextToken?: string;
}
export const ListTopicRulesResponse = S.suspend(() =>
  S.Struct({
    rules: S.optional(TopicRuleList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTopicRulesResponse",
}) as any as S.Schema<ListTopicRulesResponse>;
export interface ListV2LoggingLevelsResponse {
  logTargetConfigurations?: LogTargetConfiguration[];
  nextToken?: string;
}
export const ListV2LoggingLevelsResponse = S.suspend(() =>
  S.Struct({
    logTargetConfigurations: S.optional(LogTargetConfigurations),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListV2LoggingLevelsResponse",
}) as any as S.Schema<ListV2LoggingLevelsResponse>;
export interface ListViolationEventsResponse {
  violationEvents?: ViolationEvent[];
  nextToken?: string;
}
export const ListViolationEventsResponse = S.suspend(() =>
  S.Struct({
    violationEvents: S.optional(ViolationEvents),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListViolationEventsResponse",
}) as any as S.Schema<ListViolationEventsResponse>;
export interface RegisterCACertificateResponse {
  certificateArn?: string;
  certificateId?: string;
}
export const RegisterCACertificateResponse = S.suspend(() =>
  S.Struct({
    certificateArn: S.optional(S.String),
    certificateId: S.optional(S.String),
  }),
).annotations({
  identifier: "RegisterCACertificateResponse",
}) as any as S.Schema<RegisterCACertificateResponse>;
export interface StartAuditMitigationActionsTaskRequest {
  taskId: string;
  target: AuditMitigationActionsTaskTarget;
  auditCheckToActionsMapping: { [key: string]: string[] };
  clientRequestToken: string;
}
export const StartAuditMitigationActionsTaskRequest = S.suspend(() =>
  S.Struct({
    taskId: S.String.pipe(T.HttpLabel("taskId")),
    target: AuditMitigationActionsTaskTarget,
    auditCheckToActionsMapping: AuditCheckToActionsMapping,
    clientRequestToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/audit/mitigationactions/tasks/{taskId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartAuditMitigationActionsTaskRequest",
}) as any as S.Schema<StartAuditMitigationActionsTaskRequest>;
export interface StartDetectMitigationActionsTaskResponse {
  taskId?: string;
}
export const StartDetectMitigationActionsTaskResponse = S.suspend(() =>
  S.Struct({ taskId: S.optional(S.String) }),
).annotations({
  identifier: "StartDetectMitigationActionsTaskResponse",
}) as any as S.Schema<StartDetectMitigationActionsTaskResponse>;
export interface TestInvokeAuthorizerRequest {
  authorizerName: string;
  token?: string;
  tokenSignature?: string;
  httpContext?: HttpContext;
  mqttContext?: MqttContext;
  tlsContext?: TlsContext;
}
export const TestInvokeAuthorizerRequest = S.suspend(() =>
  S.Struct({
    authorizerName: S.String.pipe(T.HttpLabel("authorizerName")),
    token: S.optional(S.String),
    tokenSignature: S.optional(S.String),
    httpContext: S.optional(HttpContext),
    mqttContext: S.optional(MqttContext),
    tlsContext: S.optional(TlsContext),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/authorizer/{authorizerName}/test" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TestInvokeAuthorizerRequest",
}) as any as S.Schema<TestInvokeAuthorizerRequest>;
export interface ValidateSecurityProfileBehaviorsResponse {
  valid?: boolean;
  validationErrors?: ValidationError[];
}
export const ValidateSecurityProfileBehaviorsResponse = S.suspend(() =>
  S.Struct({
    valid: S.optional(S.Boolean),
    validationErrors: S.optional(ValidationErrors),
  }),
).annotations({
  identifier: "ValidateSecurityProfileBehaviorsResponse",
}) as any as S.Schema<ValidateSecurityProfileBehaviorsResponse>;
export interface AwsJobExponentialRolloutRate {
  baseRatePerMinute: number;
  incrementFactor: number;
  rateIncreaseCriteria: AwsJobRateIncreaseCriteria;
}
export const AwsJobExponentialRolloutRate = S.suspend(() =>
  S.Struct({
    baseRatePerMinute: S.Number,
    incrementFactor: S.Number,
    rateIncreaseCriteria: AwsJobRateIncreaseCriteria,
  }),
).annotations({
  identifier: "AwsJobExponentialRolloutRate",
}) as any as S.Schema<AwsJobExponentialRolloutRate>;
export interface FileLocation {
  stream?: Stream;
  s3Location?: S3Location;
}
export const FileLocation = S.suspend(() =>
  S.Struct({ stream: S.optional(Stream), s3Location: S.optional(S3Location) }),
).annotations({ identifier: "FileLocation" }) as any as S.Schema<FileLocation>;
export interface TaskStatisticsForAuditCheck {
  totalFindingsCount?: number;
  failedFindingsCount?: number;
  succeededFindingsCount?: number;
  skippedFindingsCount?: number;
  canceledFindingsCount?: number;
}
export const TaskStatisticsForAuditCheck = S.suspend(() =>
  S.Struct({
    totalFindingsCount: S.optional(S.Number),
    failedFindingsCount: S.optional(S.Number),
    succeededFindingsCount: S.optional(S.Number),
    skippedFindingsCount: S.optional(S.Number),
    canceledFindingsCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "TaskStatisticsForAuditCheck",
}) as any as S.Schema<TaskStatisticsForAuditCheck>;
export interface AuditCheckDetails {
  checkRunStatus?: AuditCheckRunStatus;
  checkCompliant?: boolean;
  totalResourcesCount?: number;
  nonCompliantResourcesCount?: number;
  suppressedNonCompliantResourcesCount?: number;
  errorCode?: string;
  message?: string;
}
export const AuditCheckDetails = S.suspend(() =>
  S.Struct({
    checkRunStatus: S.optional(AuditCheckRunStatus),
    checkCompliant: S.optional(S.Boolean),
    totalResourcesCount: S.optional(S.Number),
    nonCompliantResourcesCount: S.optional(S.Number),
    suppressedNonCompliantResourcesCount: S.optional(S.Number),
    errorCode: S.optional(S.String),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "AuditCheckDetails",
}) as any as S.Schema<AuditCheckDetails>;
export interface CertificateValidity {
  notBefore?: Date;
  notAfter?: Date;
}
export const CertificateValidity = S.suspend(() =>
  S.Struct({
    notBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    notAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "CertificateValidity",
}) as any as S.Schema<CertificateValidity>;
export interface TransferData {
  transferMessage?: string;
  rejectReason?: string;
  transferDate?: Date;
  acceptDate?: Date;
  rejectDate?: Date;
}
export const TransferData = S.suspend(() =>
  S.Struct({
    transferMessage: S.optional(S.String),
    rejectReason: S.optional(S.String),
    transferDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    acceptDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    rejectDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "TransferData" }) as any as S.Schema<TransferData>;
export interface JobProcessDetails {
  processingTargets?: string[];
  numberOfCanceledThings?: number;
  numberOfSucceededThings?: number;
  numberOfFailedThings?: number;
  numberOfRejectedThings?: number;
  numberOfQueuedThings?: number;
  numberOfInProgressThings?: number;
  numberOfRemovedThings?: number;
  numberOfTimedOutThings?: number;
}
export const JobProcessDetails = S.suspend(() =>
  S.Struct({
    processingTargets: S.optional(ProcessingTargetNameList),
    numberOfCanceledThings: S.optional(S.Number),
    numberOfSucceededThings: S.optional(S.Number),
    numberOfFailedThings: S.optional(S.Number),
    numberOfRejectedThings: S.optional(S.Number),
    numberOfQueuedThings: S.optional(S.Number),
    numberOfInProgressThings: S.optional(S.Number),
    numberOfRemovedThings: S.optional(S.Number),
    numberOfTimedOutThings: S.optional(S.Number),
  }),
).annotations({
  identifier: "JobProcessDetails",
}) as any as S.Schema<JobProcessDetails>;
export interface ScheduledJobRollout {
  startTime?: string;
}
export const ScheduledJobRollout = S.suspend(() =>
  S.Struct({ startTime: S.optional(S.String) }),
).annotations({
  identifier: "ScheduledJobRollout",
}) as any as S.Schema<ScheduledJobRollout>;
export type ScheduledJobRolloutList = ScheduledJobRollout[];
export const ScheduledJobRolloutList = S.Array(ScheduledJobRollout);
export interface JobExecutionStatusDetails {
  detailsMap?: { [key: string]: string };
}
export const JobExecutionStatusDetails = S.suspend(() =>
  S.Struct({ detailsMap: S.optional(DetailsMap) }),
).annotations({
  identifier: "JobExecutionStatusDetails",
}) as any as S.Schema<JobExecutionStatusDetails>;
export interface CommandExecutionResult {
  S?: string;
  B?: boolean;
  BIN?: Uint8Array;
}
export const CommandExecutionResult = S.suspend(() =>
  S.Struct({
    S: S.optional(S.String),
    B: S.optional(S.Boolean),
    BIN: S.optional(T.Blob),
  }),
).annotations({
  identifier: "CommandExecutionResult",
}) as any as S.Schema<CommandExecutionResult>;
export interface ErrorInfo {
  code?: string;
  message?: string;
}
export const ErrorInfo = S.suspend(() =>
  S.Struct({ code: S.optional(S.String), message: S.optional(S.String) }),
).annotations({ identifier: "ErrorInfo" }) as any as S.Schema<ErrorInfo>;
export interface HttpUrlDestinationProperties {
  confirmationUrl?: string;
}
export const HttpUrlDestinationProperties = S.suspend(() =>
  S.Struct({ confirmationUrl: S.optional(S.String) }),
).annotations({
  identifier: "HttpUrlDestinationProperties",
}) as any as S.Schema<HttpUrlDestinationProperties>;
export interface VpcDestinationProperties {
  subnetIds?: string[];
  securityGroups?: string[];
  vpcId?: string;
  roleArn?: string;
}
export const VpcDestinationProperties = S.suspend(() =>
  S.Struct({
    subnetIds: S.optional(SubnetIdList),
    securityGroups: S.optional(SecurityGroupList),
    vpcId: S.optional(S.String),
    roleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "VpcDestinationProperties",
}) as any as S.Schema<VpcDestinationProperties>;
export interface HttpUrlDestinationSummary {
  confirmationUrl?: string;
}
export const HttpUrlDestinationSummary = S.suspend(() =>
  S.Struct({ confirmationUrl: S.optional(S.String) }),
).annotations({
  identifier: "HttpUrlDestinationSummary",
}) as any as S.Schema<HttpUrlDestinationSummary>;
export interface VpcDestinationSummary {
  subnetIds?: string[];
  securityGroups?: string[];
  vpcId?: string;
  roleArn?: string;
}
export const VpcDestinationSummary = S.suspend(() =>
  S.Struct({
    subnetIds: S.optional(SubnetIdList),
    securityGroups: S.optional(SecurityGroupList),
    vpcId: S.optional(S.String),
    roleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "VpcDestinationSummary",
}) as any as S.Schema<VpcDestinationSummary>;
export interface ThingConnectivity {
  connected?: boolean;
  timestamp?: number;
  disconnectReason?: string;
}
export const ThingConnectivity = S.suspend(() =>
  S.Struct({
    connected: S.optional(S.Boolean),
    timestamp: S.optional(S.Number),
    disconnectReason: S.optional(S.String),
  }),
).annotations({
  identifier: "ThingConnectivity",
}) as any as S.Schema<ThingConnectivity>;
export type AuthDecision = "ALLOWED" | "EXPLICIT_DENY" | "IMPLICIT_DENY";
export const AuthDecision = S.Literal(
  "ALLOWED",
  "EXPLICIT_DENY",
  "IMPLICIT_DENY",
);
export type MissingContextValues = string[];
export const MissingContextValues = S.Array(S.String);
export interface SigningProfileParameter {
  certificateArn?: string;
  platform?: string;
  certificatePathOnDevice?: string;
}
export const SigningProfileParameter = S.suspend(() =>
  S.Struct({
    certificateArn: S.optional(S.String),
    platform: S.optional(S.String),
    certificatePathOnDevice: S.optional(S.String),
  }),
).annotations({
  identifier: "SigningProfileParameter",
}) as any as S.Schema<SigningProfileParameter>;
export interface CodeSigningSignature {
  inlineDocument?: Uint8Array;
}
export const CodeSigningSignature = S.suspend(() =>
  S.Struct({ inlineDocument: S.optional(T.Blob) }),
).annotations({
  identifier: "CodeSigningSignature",
}) as any as S.Schema<CodeSigningSignature>;
export interface CodeSigningCertificateChain {
  certificateName?: string;
  inlineDocument?: string;
}
export const CodeSigningCertificateChain = S.suspend(() =>
  S.Struct({
    certificateName: S.optional(S.String),
    inlineDocument: S.optional(S.String),
  }),
).annotations({
  identifier: "CodeSigningCertificateChain",
}) as any as S.Schema<CodeSigningCertificateChain>;
export interface AwsJobExecutionsRolloutConfig {
  maximumPerMinute?: number;
  exponentialRate?: AwsJobExponentialRolloutRate;
}
export const AwsJobExecutionsRolloutConfig = S.suspend(() =>
  S.Struct({
    maximumPerMinute: S.optional(S.Number),
    exponentialRate: S.optional(AwsJobExponentialRolloutRate),
  }),
).annotations({
  identifier: "AwsJobExecutionsRolloutConfig",
}) as any as S.Schema<AwsJobExecutionsRolloutConfig>;
export type AuditMitigationActionsTaskStatistics = {
  [key: string]: TaskStatisticsForAuditCheck;
};
export const AuditMitigationActionsTaskStatistics = S.Record({
  key: S.String,
  value: TaskStatisticsForAuditCheck,
});
export type AuditDetails = { [key: string]: AuditCheckDetails };
export const AuditDetails = S.Record({
  key: S.String,
  value: AuditCheckDetails,
});
export interface CACertificateDescription {
  certificateArn?: string;
  certificateId?: string;
  status?: CACertificateStatus;
  certificatePem?: string;
  ownedBy?: string;
  creationDate?: Date;
  autoRegistrationStatus?: AutoRegistrationStatus;
  lastModifiedDate?: Date;
  customerVersion?: number;
  generationId?: string;
  validity?: CertificateValidity;
  certificateMode?: CertificateMode;
}
export const CACertificateDescription = S.suspend(() =>
  S.Struct({
    certificateArn: S.optional(S.String),
    certificateId: S.optional(S.String),
    status: S.optional(CACertificateStatus),
    certificatePem: S.optional(S.String),
    ownedBy: S.optional(S.String),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    autoRegistrationStatus: S.optional(AutoRegistrationStatus),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    customerVersion: S.optional(S.Number),
    generationId: S.optional(S.String),
    validity: S.optional(CertificateValidity),
    certificateMode: S.optional(CertificateMode),
  }),
).annotations({
  identifier: "CACertificateDescription",
}) as any as S.Schema<CACertificateDescription>;
export interface CertificateDescription {
  certificateArn?: string;
  certificateId?: string;
  caCertificateId?: string;
  status?: CertificateStatus;
  certificatePem?: string;
  ownedBy?: string;
  previousOwnedBy?: string;
  creationDate?: Date;
  lastModifiedDate?: Date;
  customerVersion?: number;
  transferData?: TransferData;
  generationId?: string;
  validity?: CertificateValidity;
  certificateMode?: CertificateMode;
}
export const CertificateDescription = S.suspend(() =>
  S.Struct({
    certificateArn: S.optional(S.String),
    certificateId: S.optional(S.String),
    caCertificateId: S.optional(S.String),
    status: S.optional(CertificateStatus),
    certificatePem: S.optional(S.String),
    ownedBy: S.optional(S.String),
    previousOwnedBy: S.optional(S.String),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    customerVersion: S.optional(S.Number),
    transferData: S.optional(TransferData),
    generationId: S.optional(S.String),
    validity: S.optional(CertificateValidity),
    certificateMode: S.optional(CertificateMode),
  }),
).annotations({
  identifier: "CertificateDescription",
}) as any as S.Schema<CertificateDescription>;
export interface Job {
  jobArn?: string;
  jobId?: string;
  targetSelection?: TargetSelection;
  status?: JobStatus;
  forceCanceled?: boolean;
  reasonCode?: string;
  comment?: string;
  targets?: string[];
  description?: string;
  presignedUrlConfig?: PresignedUrlConfig;
  jobExecutionsRolloutConfig?: JobExecutionsRolloutConfig;
  abortConfig?: AbortConfig;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  completedAt?: Date;
  jobProcessDetails?: JobProcessDetails;
  timeoutConfig?: TimeoutConfig;
  namespaceId?: string;
  jobTemplateArn?: string;
  jobExecutionsRetryConfig?: JobExecutionsRetryConfig;
  documentParameters?: { [key: string]: string };
  isConcurrent?: boolean;
  schedulingConfig?: SchedulingConfig;
  scheduledJobRollouts?: ScheduledJobRollout[];
  destinationPackageVersions?: string[];
}
export const Job = S.suspend(() =>
  S.Struct({
    jobArn: S.optional(S.String),
    jobId: S.optional(S.String),
    targetSelection: S.optional(TargetSelection),
    status: S.optional(JobStatus),
    forceCanceled: S.optional(S.Boolean),
    reasonCode: S.optional(S.String),
    comment: S.optional(S.String),
    targets: S.optional(JobTargets),
    description: S.optional(S.String),
    presignedUrlConfig: S.optional(PresignedUrlConfig),
    jobExecutionsRolloutConfig: S.optional(JobExecutionsRolloutConfig),
    abortConfig: S.optional(AbortConfig),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    completedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    jobProcessDetails: S.optional(JobProcessDetails),
    timeoutConfig: S.optional(TimeoutConfig),
    namespaceId: S.optional(S.String),
    jobTemplateArn: S.optional(S.String),
    jobExecutionsRetryConfig: S.optional(JobExecutionsRetryConfig),
    documentParameters: S.optional(ParameterMap),
    isConcurrent: S.optional(S.Boolean),
    schedulingConfig: S.optional(SchedulingConfig),
    scheduledJobRollouts: S.optional(ScheduledJobRolloutList),
    destinationPackageVersions: S.optional(DestinationPackageVersions),
  }),
).annotations({ identifier: "Job" }) as any as S.Schema<Job>;
export interface JobExecution {
  jobId?: string;
  status?: JobExecutionStatus;
  forceCanceled?: boolean;
  statusDetails?: JobExecutionStatusDetails;
  thingArn?: string;
  queuedAt?: Date;
  startedAt?: Date;
  lastUpdatedAt?: Date;
  executionNumber?: number;
  versionNumber?: number;
  approximateSecondsBeforeTimedOut?: number;
}
export const JobExecution = S.suspend(() =>
  S.Struct({
    jobId: S.optional(S.String),
    status: S.optional(JobExecutionStatus),
    forceCanceled: S.optional(S.Boolean),
    statusDetails: S.optional(JobExecutionStatusDetails),
    thingArn: S.optional(S.String),
    queuedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    executionNumber: S.optional(S.Number),
    versionNumber: S.optional(S.Number),
    approximateSecondsBeforeTimedOut: S.optional(S.Number),
  }),
).annotations({ identifier: "JobExecution" }) as any as S.Schema<JobExecution>;
export type CommandExecutionResultMap = {
  [key: string]: CommandExecutionResult;
};
export const CommandExecutionResultMap = S.Record({
  key: S.String,
  value: CommandExecutionResult,
});
export interface S3Destination {
  bucket?: string;
  prefix?: string;
}
export const S3Destination = S.suspend(() =>
  S.Struct({ bucket: S.optional(S.String), prefix: S.optional(S.String) }),
).annotations({
  identifier: "S3Destination",
}) as any as S.Schema<S3Destination>;
export interface Destination {
  s3Destination?: S3Destination;
}
export const Destination = S.suspend(() =>
  S.Struct({ s3Destination: S.optional(S3Destination) }),
).annotations({ identifier: "Destination" }) as any as S.Schema<Destination>;
export interface StartSigningJobParameter {
  signingProfileParameter?: SigningProfileParameter;
  signingProfileName?: string;
  destination?: Destination;
}
export const StartSigningJobParameter = S.suspend(() =>
  S.Struct({
    signingProfileParameter: S.optional(SigningProfileParameter),
    signingProfileName: S.optional(S.String),
    destination: S.optional(Destination),
  }),
).annotations({
  identifier: "StartSigningJobParameter",
}) as any as S.Schema<StartSigningJobParameter>;
export interface CustomCodeSigning {
  signature?: CodeSigningSignature;
  certificateChain?: CodeSigningCertificateChain;
  hashAlgorithm?: string;
  signatureAlgorithm?: string;
}
export const CustomCodeSigning = S.suspend(() =>
  S.Struct({
    signature: S.optional(CodeSigningSignature),
    certificateChain: S.optional(CodeSigningCertificateChain),
    hashAlgorithm: S.optional(S.String),
    signatureAlgorithm: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomCodeSigning",
}) as any as S.Schema<CustomCodeSigning>;
export interface CodeSigning {
  awsSignerJobId?: string;
  startSigningJobParameter?: StartSigningJobParameter;
  customCodeSigning?: CustomCodeSigning;
}
export const CodeSigning = S.suspend(() =>
  S.Struct({
    awsSignerJobId: S.optional(S.String),
    startSigningJobParameter: S.optional(StartSigningJobParameter),
    customCodeSigning: S.optional(CustomCodeSigning),
  }),
).annotations({ identifier: "CodeSigning" }) as any as S.Schema<CodeSigning>;
export interface OTAUpdateFile {
  fileName?: string;
  fileType?: number;
  fileVersion?: string;
  fileLocation?: FileLocation;
  codeSigning?: CodeSigning;
  attributes?: { [key: string]: string };
}
export const OTAUpdateFile = S.suspend(() =>
  S.Struct({
    fileName: S.optional(S.String),
    fileType: S.optional(S.Number),
    fileVersion: S.optional(S.String),
    fileLocation: S.optional(FileLocation),
    codeSigning: S.optional(CodeSigning),
    attributes: S.optional(AttributesMap),
  }),
).annotations({
  identifier: "OTAUpdateFile",
}) as any as S.Schema<OTAUpdateFile>;
export type OTAUpdateFiles = OTAUpdateFile[];
export const OTAUpdateFiles = S.Array(OTAUpdateFile);
export interface OTAUpdateInfo {
  otaUpdateId?: string;
  otaUpdateArn?: string;
  creationDate?: Date;
  lastModifiedDate?: Date;
  description?: string;
  targets?: string[];
  protocols?: Protocol[];
  awsJobExecutionsRolloutConfig?: AwsJobExecutionsRolloutConfig;
  awsJobPresignedUrlConfig?: AwsJobPresignedUrlConfig;
  targetSelection?: TargetSelection;
  otaUpdateFiles?: OTAUpdateFile[];
  otaUpdateStatus?: OTAUpdateStatus;
  awsIotJobId?: string;
  awsIotJobArn?: string;
  errorInfo?: ErrorInfo;
  additionalParameters?: { [key: string]: string };
}
export const OTAUpdateInfo = S.suspend(() =>
  S.Struct({
    otaUpdateId: S.optional(S.String),
    otaUpdateArn: S.optional(S.String),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    description: S.optional(S.String),
    targets: S.optional(Targets),
    protocols: S.optional(Protocols),
    awsJobExecutionsRolloutConfig: S.optional(AwsJobExecutionsRolloutConfig),
    awsJobPresignedUrlConfig: S.optional(AwsJobPresignedUrlConfig),
    targetSelection: S.optional(TargetSelection),
    otaUpdateFiles: S.optional(OTAUpdateFiles),
    otaUpdateStatus: S.optional(OTAUpdateStatus),
    awsIotJobId: S.optional(S.String),
    awsIotJobArn: S.optional(S.String),
    errorInfo: S.optional(ErrorInfo),
    additionalParameters: S.optional(AdditionalParameterMap),
  }),
).annotations({
  identifier: "OTAUpdateInfo",
}) as any as S.Schema<OTAUpdateInfo>;
export interface TopicRuleDestination {
  arn?: string;
  status?: TopicRuleDestinationStatus;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  statusReason?: string;
  httpUrlProperties?: HttpUrlDestinationProperties;
  vpcProperties?: VpcDestinationProperties;
}
export const TopicRuleDestination = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    status: S.optional(TopicRuleDestinationStatus),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    statusReason: S.optional(S.String),
    httpUrlProperties: S.optional(HttpUrlDestinationProperties),
    vpcProperties: S.optional(VpcDestinationProperties),
  }),
).annotations({
  identifier: "TopicRuleDestination",
}) as any as S.Schema<TopicRuleDestination>;
export interface ActiveViolation {
  violationId?: string;
  thingName?: string;
  securityProfileName?: string;
  behavior?: Behavior;
  lastViolationValue?: MetricValue;
  violationEventAdditionalInfo?: ViolationEventAdditionalInfo;
  verificationState?: VerificationState;
  verificationStateDescription?: string;
  lastViolationTime?: Date;
  violationStartTime?: Date;
}
export const ActiveViolation = S.suspend(() =>
  S.Struct({
    violationId: S.optional(S.String),
    thingName: S.optional(S.String),
    securityProfileName: S.optional(S.String),
    behavior: S.optional(Behavior),
    lastViolationValue: S.optional(MetricValue),
    violationEventAdditionalInfo: S.optional(ViolationEventAdditionalInfo),
    verificationState: S.optional(VerificationState),
    verificationStateDescription: S.optional(S.String),
    lastViolationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    violationStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ActiveViolation",
}) as any as S.Schema<ActiveViolation>;
export type ActiveViolations = ActiveViolation[];
export const ActiveViolations = S.Array(ActiveViolation);
export interface CommandExecutionSummary {
  commandArn?: string;
  executionId?: string;
  targetArn?: string;
  status?: CommandExecutionStatus;
  createdAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
}
export const CommandExecutionSummary = S.suspend(() =>
  S.Struct({
    commandArn: S.optional(S.String),
    executionId: S.optional(S.String),
    targetArn: S.optional(S.String),
    status: S.optional(CommandExecutionStatus),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    completedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "CommandExecutionSummary",
}) as any as S.Schema<CommandExecutionSummary>;
export type CommandExecutionSummaryList = CommandExecutionSummary[];
export const CommandExecutionSummaryList = S.Array(CommandExecutionSummary);
export interface JobExecutionSummaryForJob {
  thingArn?: string;
  jobExecutionSummary?: JobExecutionSummary;
}
export const JobExecutionSummaryForJob = S.suspend(() =>
  S.Struct({
    thingArn: S.optional(S.String),
    jobExecutionSummary: S.optional(JobExecutionSummary),
  }),
).annotations({
  identifier: "JobExecutionSummaryForJob",
}) as any as S.Schema<JobExecutionSummaryForJob>;
export type JobExecutionSummaryForJobList = JobExecutionSummaryForJob[];
export const JobExecutionSummaryForJobList = S.Array(JobExecutionSummaryForJob);
export interface TopicRuleDestinationSummary {
  arn?: string;
  status?: TopicRuleDestinationStatus;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  statusReason?: string;
  httpUrlSummary?: HttpUrlDestinationSummary;
  vpcDestinationSummary?: VpcDestinationSummary;
}
export const TopicRuleDestinationSummary = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    status: S.optional(TopicRuleDestinationStatus),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    statusReason: S.optional(S.String),
    httpUrlSummary: S.optional(HttpUrlDestinationSummary),
    vpcDestinationSummary: S.optional(VpcDestinationSummary),
  }),
).annotations({
  identifier: "TopicRuleDestinationSummary",
}) as any as S.Schema<TopicRuleDestinationSummary>;
export type TopicRuleDestinationSummaries = TopicRuleDestinationSummary[];
export const TopicRuleDestinationSummaries = S.Array(
  TopicRuleDestinationSummary,
);
export type ResourceArns = { [key: string]: string };
export const ResourceArns = S.Record({ key: S.String, value: S.String });
export interface ThingDocument {
  thingName?: string;
  thingId?: string;
  thingTypeName?: string;
  thingGroupNames?: string[];
  attributes?: { [key: string]: string };
  shadow?: string;
  deviceDefender?: string;
  connectivity?: ThingConnectivity;
}
export const ThingDocument = S.suspend(() =>
  S.Struct({
    thingName: S.optional(S.String),
    thingId: S.optional(S.String),
    thingTypeName: S.optional(S.String),
    thingGroupNames: S.optional(ThingGroupNameList),
    attributes: S.optional(Attributes),
    shadow: S.optional(S.String),
    deviceDefender: S.optional(S.String),
    connectivity: S.optional(ThingConnectivity),
  }),
).annotations({
  identifier: "ThingDocument",
}) as any as S.Schema<ThingDocument>;
export type ThingDocumentList = ThingDocument[];
export const ThingDocumentList = S.Array(ThingDocument);
export type PolicyDocuments = string[];
export const PolicyDocuments = S.Array(S.String);
export interface AssociateSbomWithPackageVersionResponse {
  packageName?: string;
  versionName?: string;
  sbom?: Sbom;
  sbomValidationStatus?: SbomValidationStatus;
}
export const AssociateSbomWithPackageVersionResponse = S.suspend(() =>
  S.Struct({
    packageName: S.optional(S.String),
    versionName: S.optional(S.String),
    sbom: S.optional(Sbom),
    sbomValidationStatus: S.optional(SbomValidationStatus),
  }),
).annotations({
  identifier: "AssociateSbomWithPackageVersionResponse",
}) as any as S.Schema<AssociateSbomWithPackageVersionResponse>;
export interface CreateJobRequest {
  jobId: string;
  targets: string[];
  documentSource?: string;
  document?: string;
  description?: string;
  presignedUrlConfig?: PresignedUrlConfig;
  targetSelection?: TargetSelection;
  jobExecutionsRolloutConfig?: JobExecutionsRolloutConfig;
  abortConfig?: AbortConfig;
  timeoutConfig?: TimeoutConfig;
  tags?: Tag[];
  namespaceId?: string;
  jobTemplateArn?: string;
  jobExecutionsRetryConfig?: JobExecutionsRetryConfig;
  documentParameters?: { [key: string]: string };
  schedulingConfig?: SchedulingConfig;
  destinationPackageVersions?: string[];
}
export const CreateJobRequest = S.suspend(() =>
  S.Struct({
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    targets: JobTargets,
    documentSource: S.optional(S.String),
    document: S.optional(S.String),
    description: S.optional(S.String),
    presignedUrlConfig: S.optional(PresignedUrlConfig),
    targetSelection: S.optional(TargetSelection),
    jobExecutionsRolloutConfig: S.optional(JobExecutionsRolloutConfig),
    abortConfig: S.optional(AbortConfig),
    timeoutConfig: S.optional(TimeoutConfig),
    tags: S.optional(TagList),
    namespaceId: S.optional(S.String),
    jobTemplateArn: S.optional(S.String),
    jobExecutionsRetryConfig: S.optional(JobExecutionsRetryConfig),
    documentParameters: S.optional(ParameterMap),
    schedulingConfig: S.optional(SchedulingConfig),
    destinationPackageVersions: S.optional(DestinationPackageVersions),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/jobs/{jobId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateJobRequest",
}) as any as S.Schema<CreateJobRequest>;
export interface CreateMitigationActionResponse {
  actionArn?: string;
  actionId?: string;
}
export const CreateMitigationActionResponse = S.suspend(() =>
  S.Struct({ actionArn: S.optional(S.String), actionId: S.optional(S.String) }),
).annotations({
  identifier: "CreateMitigationActionResponse",
}) as any as S.Schema<CreateMitigationActionResponse>;
export interface CreateSecurityProfileRequest {
  securityProfileName: string;
  securityProfileDescription?: string;
  behaviors?: Behavior[];
  alertTargets?: { [key: string]: AlertTarget };
  additionalMetricsToRetain?: string[];
  additionalMetricsToRetainV2?: MetricToRetain[];
  tags?: Tag[];
  metricsExportConfig?: MetricsExportConfig;
}
export const CreateSecurityProfileRequest = S.suspend(() =>
  S.Struct({
    securityProfileName: S.String.pipe(T.HttpLabel("securityProfileName")),
    securityProfileDescription: S.optional(S.String),
    behaviors: S.optional(Behaviors),
    alertTargets: S.optional(AlertTargets),
    additionalMetricsToRetain: S.optional(AdditionalMetricsToRetainList),
    additionalMetricsToRetainV2: S.optional(AdditionalMetricsToRetainV2List),
    tags: S.optional(TagList),
    metricsExportConfig: S.optional(MetricsExportConfig),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/security-profiles/{securityProfileName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSecurityProfileRequest",
}) as any as S.Schema<CreateSecurityProfileRequest>;
export interface CreateThingResponse {
  thingName?: string;
  thingArn?: string;
  thingId?: string;
}
export const CreateThingResponse = S.suspend(() =>
  S.Struct({
    thingName: S.optional(S.String),
    thingArn: S.optional(S.String),
    thingId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateThingResponse",
}) as any as S.Schema<CreateThingResponse>;
export interface CreateThingTypeRequest {
  thingTypeName: string;
  thingTypeProperties?: ThingTypeProperties;
  tags?: Tag[];
}
export const CreateThingTypeRequest = S.suspend(() =>
  S.Struct({
    thingTypeName: S.String.pipe(T.HttpLabel("thingTypeName")),
    thingTypeProperties: S.optional(ThingTypeProperties),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/thing-types/{thingTypeName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateThingTypeRequest",
}) as any as S.Schema<CreateThingTypeRequest>;
export interface CreateTopicRuleDestinationResponse {
  topicRuleDestination?: TopicRuleDestination;
}
export const CreateTopicRuleDestinationResponse = S.suspend(() =>
  S.Struct({ topicRuleDestination: S.optional(TopicRuleDestination) }),
).annotations({
  identifier: "CreateTopicRuleDestinationResponse",
}) as any as S.Schema<CreateTopicRuleDestinationResponse>;
export interface DescribeAccountAuditConfigurationResponse {
  roleArn?: string;
  auditNotificationTargetConfigurations?: {
    [key: string]: AuditNotificationTarget;
  };
  auditCheckConfigurations?: { [key: string]: AuditCheckConfiguration };
}
export const DescribeAccountAuditConfigurationResponse = S.suspend(() =>
  S.Struct({
    roleArn: S.optional(S.String),
    auditNotificationTargetConfigurations: S.optional(
      AuditNotificationTargetConfigurations,
    ),
    auditCheckConfigurations: S.optional(AuditCheckConfigurations),
  }),
).annotations({
  identifier: "DescribeAccountAuditConfigurationResponse",
}) as any as S.Schema<DescribeAccountAuditConfigurationResponse>;
export interface DescribeAuditFindingResponse {
  finding?: AuditFinding;
}
export const DescribeAuditFindingResponse = S.suspend(() =>
  S.Struct({ finding: S.optional(AuditFinding) }),
).annotations({
  identifier: "DescribeAuditFindingResponse",
}) as any as S.Schema<DescribeAuditFindingResponse>;
export interface DescribeAuditMitigationActionsTaskResponse {
  taskStatus?: AuditMitigationActionsTaskStatus;
  startTime?: Date;
  endTime?: Date;
  taskStatistics?: { [key: string]: TaskStatisticsForAuditCheck };
  target?: AuditMitigationActionsTaskTarget;
  auditCheckToActionsMapping?: { [key: string]: string[] };
  actionsDefinition?: MitigationAction[];
}
export const DescribeAuditMitigationActionsTaskResponse = S.suspend(() =>
  S.Struct({
    taskStatus: S.optional(AuditMitigationActionsTaskStatus),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    taskStatistics: S.optional(AuditMitigationActionsTaskStatistics),
    target: S.optional(AuditMitigationActionsTaskTarget),
    auditCheckToActionsMapping: S.optional(AuditCheckToActionsMapping),
    actionsDefinition: S.optional(MitigationActionList),
  }),
).annotations({
  identifier: "DescribeAuditMitigationActionsTaskResponse",
}) as any as S.Schema<DescribeAuditMitigationActionsTaskResponse>;
export interface DescribeAuditTaskResponse {
  taskStatus?: AuditTaskStatus;
  taskType?: AuditTaskType;
  taskStartTime?: Date;
  taskStatistics?: TaskStatistics;
  scheduledAuditName?: string;
  auditDetails?: { [key: string]: AuditCheckDetails };
}
export const DescribeAuditTaskResponse = S.suspend(() =>
  S.Struct({
    taskStatus: S.optional(AuditTaskStatus),
    taskType: S.optional(AuditTaskType),
    taskStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    taskStatistics: S.optional(TaskStatistics),
    scheduledAuditName: S.optional(S.String),
    auditDetails: S.optional(AuditDetails),
  }),
).annotations({
  identifier: "DescribeAuditTaskResponse",
}) as any as S.Schema<DescribeAuditTaskResponse>;
export interface DescribeCACertificateResponse {
  certificateDescription?: CACertificateDescription;
  registrationConfig?: RegistrationConfig;
}
export const DescribeCACertificateResponse = S.suspend(() =>
  S.Struct({
    certificateDescription: S.optional(CACertificateDescription),
    registrationConfig: S.optional(RegistrationConfig),
  }),
).annotations({
  identifier: "DescribeCACertificateResponse",
}) as any as S.Schema<DescribeCACertificateResponse>;
export interface DescribeCertificateResponse {
  certificateDescription?: CertificateDescription;
}
export const DescribeCertificateResponse = S.suspend(() =>
  S.Struct({ certificateDescription: S.optional(CertificateDescription) }),
).annotations({
  identifier: "DescribeCertificateResponse",
}) as any as S.Schema<DescribeCertificateResponse>;
export interface DescribeDetectMitigationActionsTaskResponse {
  taskSummary?: DetectMitigationActionsTaskSummary;
}
export const DescribeDetectMitigationActionsTaskResponse = S.suspend(() =>
  S.Struct({ taskSummary: S.optional(DetectMitigationActionsTaskSummary) }),
).annotations({
  identifier: "DescribeDetectMitigationActionsTaskResponse",
}) as any as S.Schema<DescribeDetectMitigationActionsTaskResponse>;
export interface DescribeJobResponse {
  documentSource?: string;
  job?: Job;
}
export const DescribeJobResponse = S.suspend(() =>
  S.Struct({ documentSource: S.optional(S.String), job: S.optional(Job) }),
).annotations({
  identifier: "DescribeJobResponse",
}) as any as S.Schema<DescribeJobResponse>;
export interface DescribeJobExecutionResponse {
  execution?: JobExecution;
}
export const DescribeJobExecutionResponse = S.suspend(() =>
  S.Struct({ execution: S.optional(JobExecution) }),
).annotations({
  identifier: "DescribeJobExecutionResponse",
}) as any as S.Schema<DescribeJobExecutionResponse>;
export interface GetCommandExecutionResponse {
  executionId?: string;
  commandArn?: string;
  targetArn?: string;
  status?: CommandExecutionStatus;
  statusReason?: StatusReason;
  result?: { [key: string]: CommandExecutionResult };
  parameters?: { [key: string]: CommandParameterValue };
  executionTimeoutSeconds?: number;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  timeToLive?: Date;
}
export const GetCommandExecutionResponse = S.suspend(() =>
  S.Struct({
    executionId: S.optional(S.String),
    commandArn: S.optional(S.String),
    targetArn: S.optional(S.String),
    status: S.optional(CommandExecutionStatus),
    statusReason: S.optional(StatusReason),
    result: S.optional(CommandExecutionResultMap),
    parameters: S.optional(CommandExecutionParameterMap),
    executionTimeoutSeconds: S.optional(S.Number),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    completedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    timeToLive: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetCommandExecutionResponse",
}) as any as S.Schema<GetCommandExecutionResponse>;
export interface GetIndexingConfigurationResponse {
  thingIndexingConfiguration?: ThingIndexingConfiguration;
  thingGroupIndexingConfiguration?: ThingGroupIndexingConfiguration;
}
export const GetIndexingConfigurationResponse = S.suspend(() =>
  S.Struct({
    thingIndexingConfiguration: S.optional(ThingIndexingConfiguration),
    thingGroupIndexingConfiguration: S.optional(
      ThingGroupIndexingConfiguration,
    ),
  }),
).annotations({
  identifier: "GetIndexingConfigurationResponse",
}) as any as S.Schema<GetIndexingConfigurationResponse>;
export interface GetOTAUpdateResponse {
  otaUpdateInfo?: OTAUpdateInfo;
}
export const GetOTAUpdateResponse = S.suspend(() =>
  S.Struct({ otaUpdateInfo: S.optional(OTAUpdateInfo) }),
).annotations({
  identifier: "GetOTAUpdateResponse",
}) as any as S.Schema<GetOTAUpdateResponse>;
export interface GetTopicRuleDestinationResponse {
  topicRuleDestination?: TopicRuleDestination;
}
export const GetTopicRuleDestinationResponse = S.suspend(() =>
  S.Struct({ topicRuleDestination: S.optional(TopicRuleDestination) }),
).annotations({
  identifier: "GetTopicRuleDestinationResponse",
}) as any as S.Schema<GetTopicRuleDestinationResponse>;
export interface ListActiveViolationsResponse {
  activeViolations?: ActiveViolation[];
  nextToken?: string;
}
export const ListActiveViolationsResponse = S.suspend(() =>
  S.Struct({
    activeViolations: S.optional(ActiveViolations),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListActiveViolationsResponse",
}) as any as S.Schema<ListActiveViolationsResponse>;
export interface ListCommandExecutionsResponse {
  commandExecutions?: CommandExecutionSummary[];
  nextToken?: string;
}
export const ListCommandExecutionsResponse = S.suspend(() =>
  S.Struct({
    commandExecutions: S.optional(CommandExecutionSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCommandExecutionsResponse",
}) as any as S.Schema<ListCommandExecutionsResponse>;
export interface ListJobExecutionsForJobResponse {
  executionSummaries?: JobExecutionSummaryForJob[];
  nextToken?: string;
}
export const ListJobExecutionsForJobResponse = S.suspend(() =>
  S.Struct({
    executionSummaries: S.optional(JobExecutionSummaryForJobList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListJobExecutionsForJobResponse",
}) as any as S.Schema<ListJobExecutionsForJobResponse>;
export interface ListRelatedResourcesForAuditFindingResponse {
  relatedResources?: RelatedResource[];
  nextToken?: string;
}
export const ListRelatedResourcesForAuditFindingResponse = S.suspend(() =>
  S.Struct({
    relatedResources: S.optional(RelatedResources),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRelatedResourcesForAuditFindingResponse",
}) as any as S.Schema<ListRelatedResourcesForAuditFindingResponse>;
export interface ListTopicRuleDestinationsResponse {
  destinationSummaries?: TopicRuleDestinationSummary[];
  nextToken?: string;
}
export const ListTopicRuleDestinationsResponse = S.suspend(() =>
  S.Struct({
    destinationSummaries: S.optional(TopicRuleDestinationSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTopicRuleDestinationsResponse",
}) as any as S.Schema<ListTopicRuleDestinationsResponse>;
export interface RegisterThingResponse {
  certificatePem?: string;
  resourceArns?: { [key: string]: string };
}
export const RegisterThingResponse = S.suspend(() =>
  S.Struct({
    certificatePem: S.optional(S.String),
    resourceArns: S.optional(ResourceArns),
  }),
).annotations({
  identifier: "RegisterThingResponse",
}) as any as S.Schema<RegisterThingResponse>;
export interface SearchIndexResponse {
  nextToken?: string;
  things?: ThingDocument[];
  thingGroups?: ThingGroupDocument[];
}
export const SearchIndexResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    things: S.optional(ThingDocumentList),
    thingGroups: S.optional(ThingGroupDocumentList),
  }),
).annotations({
  identifier: "SearchIndexResponse",
}) as any as S.Schema<SearchIndexResponse>;
export interface StartAuditMitigationActionsTaskResponse {
  taskId?: string;
}
export const StartAuditMitigationActionsTaskResponse = S.suspend(() =>
  S.Struct({ taskId: S.optional(S.String) }),
).annotations({
  identifier: "StartAuditMitigationActionsTaskResponse",
}) as any as S.Schema<StartAuditMitigationActionsTaskResponse>;
export interface TestInvokeAuthorizerResponse {
  isAuthenticated?: boolean;
  principalId?: string;
  policyDocuments?: string[];
  refreshAfterInSeconds?: number;
  disconnectAfterInSeconds?: number;
}
export const TestInvokeAuthorizerResponse = S.suspend(() =>
  S.Struct({
    isAuthenticated: S.optional(S.Boolean),
    principalId: S.optional(S.String),
    policyDocuments: S.optional(PolicyDocuments),
    refreshAfterInSeconds: S.optional(S.Number),
    disconnectAfterInSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "TestInvokeAuthorizerResponse",
}) as any as S.Schema<TestInvokeAuthorizerResponse>;
export interface Allowed {
  policies?: Policy[];
}
export const Allowed = S.suspend(() =>
  S.Struct({ policies: S.optional(Policies) }),
).annotations({ identifier: "Allowed" }) as any as S.Schema<Allowed>;
export interface Bucket {
  keyValue?: string;
  count?: number;
}
export const Bucket = S.suspend(() =>
  S.Struct({ keyValue: S.optional(S.String), count: S.optional(S.Number) }),
).annotations({ identifier: "Bucket" }) as any as S.Schema<Bucket>;
export type Buckets = Bucket[];
export const Buckets = S.Array(Bucket);
export interface ImplicitDeny {
  policies?: Policy[];
}
export const ImplicitDeny = S.suspend(() =>
  S.Struct({ policies: S.optional(Policies) }),
).annotations({ identifier: "ImplicitDeny" }) as any as S.Schema<ImplicitDeny>;
export interface ExplicitDeny {
  policies?: Policy[];
}
export const ExplicitDeny = S.suspend(() =>
  S.Struct({ policies: S.optional(Policies) }),
).annotations({ identifier: "ExplicitDeny" }) as any as S.Schema<ExplicitDeny>;
export interface CreateCommandRequest {
  commandId: string;
  namespace?: CommandNamespace;
  displayName?: string;
  description?: string;
  payload?: CommandPayload;
  payloadTemplate?: string;
  preprocessor?: CommandPreprocessor;
  mandatoryParameters?: CommandParameter[];
  roleArn?: string;
  tags?: Tag[];
}
export const CreateCommandRequest = S.suspend(() =>
  S.Struct({
    commandId: S.String.pipe(T.HttpLabel("commandId")),
    namespace: S.optional(CommandNamespace),
    displayName: S.optional(S.String),
    description: S.optional(S.String),
    payload: S.optional(CommandPayload),
    payloadTemplate: S.optional(S.String),
    preprocessor: S.optional(CommandPreprocessor),
    mandatoryParameters: S.optional(CommandParameterList),
    roleArn: S.optional(S.String),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/commands/{commandId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCommandRequest",
}) as any as S.Schema<CreateCommandRequest>;
export interface CreateJobResponse {
  jobArn?: string;
  jobId?: string;
  description?: string;
}
export const CreateJobResponse = S.suspend(() =>
  S.Struct({
    jobArn: S.optional(S.String),
    jobId: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateJobResponse",
}) as any as S.Schema<CreateJobResponse>;
export interface CreateSecurityProfileResponse {
  securityProfileName?: string;
  securityProfileArn?: string;
}
export const CreateSecurityProfileResponse = S.suspend(() =>
  S.Struct({
    securityProfileName: S.optional(S.String),
    securityProfileArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateSecurityProfileResponse",
}) as any as S.Schema<CreateSecurityProfileResponse>;
export interface CreateThingTypeResponse {
  thingTypeName?: string;
  thingTypeArn?: string;
  thingTypeId?: string;
}
export const CreateThingTypeResponse = S.suspend(() =>
  S.Struct({
    thingTypeName: S.optional(S.String),
    thingTypeArn: S.optional(S.String),
    thingTypeId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateThingTypeResponse",
}) as any as S.Schema<CreateThingTypeResponse>;
export interface GetBucketsAggregationResponse {
  totalCount?: number;
  buckets?: Bucket[];
}
export const GetBucketsAggregationResponse = S.suspend(() =>
  S.Struct({ totalCount: S.optional(S.Number), buckets: S.optional(Buckets) }),
).annotations({
  identifier: "GetBucketsAggregationResponse",
}) as any as S.Schema<GetBucketsAggregationResponse>;
export interface Denied {
  implicitDeny?: ImplicitDeny;
  explicitDeny?: ExplicitDeny;
}
export const Denied = S.suspend(() =>
  S.Struct({
    implicitDeny: S.optional(ImplicitDeny),
    explicitDeny: S.optional(ExplicitDeny),
  }),
).annotations({ identifier: "Denied" }) as any as S.Schema<Denied>;
export interface AuthResult {
  authInfo?: AuthInfo;
  allowed?: Allowed;
  denied?: Denied;
  authDecision?: AuthDecision;
  missingContextValues?: string[];
}
export const AuthResult = S.suspend(() =>
  S.Struct({
    authInfo: S.optional(AuthInfo),
    allowed: S.optional(Allowed),
    denied: S.optional(Denied),
    authDecision: S.optional(AuthDecision),
    missingContextValues: S.optional(MissingContextValues),
  }),
).annotations({ identifier: "AuthResult" }) as any as S.Schema<AuthResult>;
export type AuthResults = AuthResult[];
export const AuthResults = S.Array(AuthResult);
export interface CreateCommandResponse {
  commandId?: string;
  commandArn?: string;
}
export const CreateCommandResponse = S.suspend(() =>
  S.Struct({
    commandId: S.optional(S.String),
    commandArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateCommandResponse",
}) as any as S.Schema<CreateCommandResponse>;
export interface CreateOTAUpdateRequest {
  otaUpdateId: string;
  description?: string;
  targets: string[];
  protocols?: Protocol[];
  targetSelection?: TargetSelection;
  awsJobExecutionsRolloutConfig?: AwsJobExecutionsRolloutConfig;
  awsJobPresignedUrlConfig?: AwsJobPresignedUrlConfig;
  awsJobAbortConfig?: AwsJobAbortConfig;
  awsJobTimeoutConfig?: AwsJobTimeoutConfig;
  files: OTAUpdateFile[];
  roleArn: string;
  additionalParameters?: { [key: string]: string };
  tags?: Tag[];
}
export const CreateOTAUpdateRequest = S.suspend(() =>
  S.Struct({
    otaUpdateId: S.String.pipe(T.HttpLabel("otaUpdateId")),
    description: S.optional(S.String),
    targets: Targets,
    protocols: S.optional(Protocols),
    targetSelection: S.optional(TargetSelection),
    awsJobExecutionsRolloutConfig: S.optional(AwsJobExecutionsRolloutConfig),
    awsJobPresignedUrlConfig: S.optional(AwsJobPresignedUrlConfig),
    awsJobAbortConfig: S.optional(AwsJobAbortConfig),
    awsJobTimeoutConfig: S.optional(AwsJobTimeoutConfig),
    files: OTAUpdateFiles,
    roleArn: S.String,
    additionalParameters: S.optional(AdditionalParameterMap),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/otaUpdates/{otaUpdateId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateOTAUpdateRequest",
}) as any as S.Schema<CreateOTAUpdateRequest>;
export interface TestAuthorizationResponse {
  authResults?: AuthResult[];
}
export const TestAuthorizationResponse = S.suspend(() =>
  S.Struct({ authResults: S.optional(AuthResults) }),
).annotations({
  identifier: "TestAuthorizationResponse",
}) as any as S.Schema<TestAuthorizationResponse>;
export interface CreateOTAUpdateResponse {
  otaUpdateId?: string;
  awsIotJobId?: string;
  otaUpdateArn?: string;
  awsIotJobArn?: string;
  otaUpdateStatus?: OTAUpdateStatus;
}
export const CreateOTAUpdateResponse = S.suspend(() =>
  S.Struct({
    otaUpdateId: S.optional(S.String),
    awsIotJobId: S.optional(S.String),
    otaUpdateArn: S.optional(S.String),
    awsIotJobArn: S.optional(S.String),
    otaUpdateStatus: S.optional(OTAUpdateStatus),
  }),
).annotations({
  identifier: "CreateOTAUpdateResponse",
}) as any as S.Schema<CreateOTAUpdateResponse>;
export interface CreateTopicRuleRequest {
  ruleName: string;
  topicRulePayload: TopicRulePayload;
  tags?: string;
}
export const CreateTopicRuleRequest = S.suspend(() =>
  S.Struct({
    ruleName: S.String.pipe(T.HttpLabel("ruleName")),
    topicRulePayload: TopicRulePayload.pipe(T.HttpPayload()).annotations({
      identifier: "TopicRulePayload",
    }),
    tags: S.optional(S.String).pipe(T.HttpHeader("x-amz-tagging")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/rules/{ruleName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTopicRuleRequest",
}) as any as S.Schema<CreateTopicRuleRequest>;
export interface CreateTopicRuleResponse {}
export const CreateTopicRuleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateTopicRuleResponse",
}) as any as S.Schema<CreateTopicRuleResponse>;

//# Errors
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConflictingResourceUpdateException extends S.TaggedError<ConflictingResourceUpdateException>()(
  "ConflictingResourceUpdateException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class DeleteConflictException extends S.TaggedError<DeleteConflictException>()(
  "DeleteConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class CertificateStateException extends S.TaggedError<CertificateStateException>()(
  "CertificateStateException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String), resourceId: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InternalException extends S.TaggedError<InternalException>()(
  "InternalException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class IndexNotReadyException extends S.TaggedError<IndexNotReadyException>()(
  "IndexNotReadyException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class MalformedPolicyException extends S.TaggedError<MalformedPolicyException>()(
  "MalformedPolicyException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceArn: S.optional(S.String),
  },
).pipe(C.withConflictError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NotConfiguredException extends S.TaggedError<NotConfiguredException>()(
  "NotConfiguredException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class CertificateConflictException extends S.TaggedError<CertificateConflictException>()(
  "CertificateConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class CertificateValidationException extends S.TaggedError<CertificateValidationException>()(
  "CertificateValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidQueryException extends S.TaggedError<InvalidQueryException>()(
  "InvalidQueryException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidAggregationException extends S.TaggedError<InvalidAggregationException>()(
  "InvalidAggregationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidStateTransitionException extends S.TaggedError<InvalidStateTransitionException>()(
  "InvalidStateTransitionException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TaskAlreadyExistsException extends S.TaggedError<TaskAlreadyExistsException>()(
  "TaskAlreadyExistsException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class VersionConflictException extends S.TaggedError<VersionConflictException>()(
  "VersionConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class TransferAlreadyCompletedException extends S.TaggedError<TransferAlreadyCompletedException>()(
  "TransferAlreadyCompletedException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class SqlParseException extends S.TaggedError<SqlParseException>()(
  "SqlParseException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TransferConflictException extends S.TaggedError<TransferConflictException>()(
  "TransferConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class VersionsLimitExceededException extends S.TaggedError<VersionsLimitExceededException>()(
  "VersionsLimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class RegistrationCodeValidationException extends S.TaggedError<RegistrationCodeValidationException>()(
  "RegistrationCodeValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceRegistrationFailureException extends S.TaggedError<ResourceRegistrationFailureException>()(
  "ResourceRegistrationFailureException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidResponseException extends S.TaggedError<InvalidResponseException>()(
  "InvalidResponseException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns information about a billing group.
 *
 * Requires permission to access the DescribeBillingGroup action.
 */
export const describeBillingGroup: (
  input: DescribeBillingGroupRequest,
) => effect.Effect<
  DescribeBillingGroupResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBillingGroupRequest,
  output: DescribeBillingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes event configurations.
 *
 * Requires permission to access the DescribeEventConfigurations action.
 */
export const describeEventConfigurations: (
  input: DescribeEventConfigurationsRequest,
) => effect.Effect<
  DescribeEventConfigurationsResponse,
  InternalFailureException | ThrottlingException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEventConfigurationsRequest,
  output: DescribeEventConfigurationsResponse,
  errors: [InternalFailureException, ThrottlingException],
}));
/**
 * View details of a managed job template.
 */
export const describeManagedJobTemplate: (
  input: DescribeManagedJobTemplateRequest,
) => effect.Effect<
  DescribeManagedJobTemplateResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeManagedJobTemplateRequest,
  output: DescribeManagedJobTemplateResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describe a thing group.
 *
 * Requires permission to access the DescribeThingGroup action.
 */
export const describeThingGroup: (
  input: DescribeThingGroupRequest,
) => effect.Effect<
  DescribeThingGroupResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeThingGroupRequest,
  output: DescribeThingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns a Device Defender's ML Detect Security Profile training model's status.
 *
 * Requires permission to access the GetBehaviorModelTrainingSummaries action.
 */
export const getBehaviorModelTrainingSummaries: {
  (
    input: GetBehaviorModelTrainingSummariesRequest,
  ): effect.Effect<
    GetBehaviorModelTrainingSummariesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetBehaviorModelTrainingSummariesRequest,
  ) => stream.Stream<
    GetBehaviorModelTrainingSummariesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetBehaviorModelTrainingSummariesRequest,
  ) => stream.Stream<
    BehaviorModelTrainingSummary,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetBehaviorModelTrainingSummariesRequest,
  output: GetBehaviorModelTrainingSummariesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "summaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets the fine grained logging options.
 *
 * Requires permission to access the GetV2LoggingOptions action.
 */
export const getV2LoggingOptions: (
  input: GetV2LoggingOptionsRequest,
) => effect.Effect<
  GetV2LoggingOptionsResponse,
  | InternalException
  | NotConfiguredException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetV2LoggingOptionsRequest,
  output: GetV2LoggingOptionsResponse,
  errors: [
    InternalException,
    NotConfiguredException,
    ServiceUnavailableException,
  ],
}));
/**
 * Gets the status of audit mitigation action tasks that were
 * executed.
 *
 * Requires permission to access the ListAuditMitigationActionsExecutions action.
 */
export const listAuditMitigationActionsExecutions: {
  (
    input: ListAuditMitigationActionsExecutionsRequest,
  ): effect.Effect<
    ListAuditMitigationActionsExecutionsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAuditMitigationActionsExecutionsRequest,
  ) => stream.Stream<
    ListAuditMitigationActionsExecutionsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAuditMitigationActionsExecutionsRequest,
  ) => stream.Stream<
    AuditMitigationActionExecutionMetadata,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAuditMitigationActionsExecutionsRequest,
  output: ListAuditMitigationActionsExecutionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "actionsExecutions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a list of audit mitigation action tasks that match the specified filters.
 *
 * Requires permission to access the ListAuditMitigationActionsTasks action.
 */
export const listAuditMitigationActionsTasks: {
  (
    input: ListAuditMitigationActionsTasksRequest,
  ): effect.Effect<
    ListAuditMitigationActionsTasksResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAuditMitigationActionsTasksRequest,
  ) => stream.Stream<
    ListAuditMitigationActionsTasksResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAuditMitigationActionsTasksRequest,
  ) => stream.Stream<
    AuditMitigationActionsTaskMetadata,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAuditMitigationActionsTasksRequest,
  output: ListAuditMitigationActionsTasksResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "tasks",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists your Device Defender audit listings.
 *
 * Requires permission to access the ListAuditSuppressions action.
 */
export const listAuditSuppressions: {
  (
    input: ListAuditSuppressionsRequest,
  ): effect.Effect<
    ListAuditSuppressionsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAuditSuppressionsRequest,
  ) => stream.Stream<
    ListAuditSuppressionsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAuditSuppressionsRequest,
  ) => stream.Stream<
    AuditSuppression,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAuditSuppressionsRequest,
  output: ListAuditSuppressionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "suppressions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the Device Defender audits that have been performed during a given
 * time period.
 *
 * Requires permission to access the ListAuditTasks action.
 */
export const listAuditTasks: {
  (
    input: ListAuditTasksRequest,
  ): effect.Effect<
    ListAuditTasksResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAuditTasksRequest,
  ) => stream.Stream<
    ListAuditTasksResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAuditTasksRequest,
  ) => stream.Stream<
    AuditTaskMetadata,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAuditTasksRequest,
  output: ListAuditTasksResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "tasks",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the billing groups you have created.
 *
 * Requires permission to access the ListBillingGroups action.
 */
export const listBillingGroups: {
  (
    input: ListBillingGroupsRequest,
  ): effect.Effect<
    ListBillingGroupsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBillingGroupsRequest,
  ) => stream.Stream<
    ListBillingGroupsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBillingGroupsRequest,
  ) => stream.Stream<
    GroupNameAndArn,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBillingGroupsRequest,
  output: ListBillingGroupsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "billingGroups",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists mitigation actions executions for a Device Defender ML Detect Security Profile.
 *
 * Requires permission to access the ListDetectMitigationActionsExecutions action.
 */
export const listDetectMitigationActionsExecutions: {
  (
    input: ListDetectMitigationActionsExecutionsRequest,
  ): effect.Effect<
    ListDetectMitigationActionsExecutionsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDetectMitigationActionsExecutionsRequest,
  ) => stream.Stream<
    ListDetectMitigationActionsExecutionsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDetectMitigationActionsExecutionsRequest,
  ) => stream.Stream<
    DetectMitigationActionExecution,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDetectMitigationActionsExecutionsRequest,
  output: ListDetectMitigationActionsExecutionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "actionsExecutions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the job executions for the specified thing.
 *
 * Requires permission to access the ListJobExecutionsForThing action.
 */
export const listJobExecutionsForThing: {
  (
    input: ListJobExecutionsForThingRequest,
  ): effect.Effect<
    ListJobExecutionsForThingResponse,
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobExecutionsForThingRequest,
  ) => stream.Stream<
    ListJobExecutionsForThingResponse,
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobExecutionsForThingRequest,
  ) => stream.Stream<
    JobExecutionSummaryForThing,
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListJobExecutionsForThingRequest,
  output: ListJobExecutionsForThingResponse,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "executionSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists jobs.
 *
 * Requires permission to access the ListJobs action.
 */
export const listJobs: {
  (
    input: ListJobsRequest,
  ): effect.Effect<
    ListJobsResponse,
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobsRequest,
  ) => stream.Stream<
    ListJobsResponse,
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobsRequest,
  ) => stream.Stream<
    JobSummary,
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListJobsRequest,
  output: ListJobsResponse,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "jobs",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of job templates.
 *
 * Requires permission to access the ListJobTemplates action.
 */
export const listJobTemplates: {
  (
    input: ListJobTemplatesRequest,
  ): effect.Effect<
    ListJobTemplatesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobTemplatesRequest,
  ) => stream.Stream<
    ListJobTemplatesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobTemplatesRequest,
  ) => stream.Stream<
    JobTemplateSummary,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListJobTemplatesRequest,
  output: ListJobTemplatesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "jobTemplates",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of managed job templates.
 */
export const listManagedJobTemplates: {
  (
    input: ListManagedJobTemplatesRequest,
  ): effect.Effect<
    ListManagedJobTemplatesResponse,
    | InternalServerException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListManagedJobTemplatesRequest,
  ) => stream.Stream<
    ListManagedJobTemplatesResponse,
    | InternalServerException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListManagedJobTemplatesRequest,
  ) => stream.Stream<
    ManagedJobTemplateSummary,
    | InternalServerException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListManagedJobTemplatesRequest,
  output: ListManagedJobTemplatesResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "managedJobTemplates",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the values reported for an IoT Device Defender metric (device-side metric, cloud-side metric, or custom metric)
 * by the given thing during the specified time period.
 */
export const listMetricValues: {
  (
    input: ListMetricValuesRequest,
  ): effect.Effect<
    ListMetricValuesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMetricValuesRequest,
  ) => stream.Stream<
    ListMetricValuesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMetricValuesRequest,
  ) => stream.Stream<
    MetricDatum,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMetricValuesRequest,
  output: ListMetricValuesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "metricDatumList",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a list of all mitigation actions that match the specified filter criteria.
 *
 * Requires permission to access the ListMitigationActions action.
 */
export const listMitigationActions: {
  (
    input: ListMitigationActionsRequest,
  ): effect.Effect<
    ListMitigationActionsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMitigationActionsRequest,
  ) => stream.Stream<
    ListMitigationActionsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMitigationActionsRequest,
  ) => stream.Stream<
    MitigationActionIdentifier,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMitigationActionsRequest,
  output: ListMitigationActionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "actionIdentifiers",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all of your scheduled audits.
 *
 * Requires permission to access the ListScheduledAudits action.
 */
export const listScheduledAudits: {
  (
    input: ListScheduledAuditsRequest,
  ): effect.Effect<
    ListScheduledAuditsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListScheduledAuditsRequest,
  ) => stream.Stream<
    ListScheduledAuditsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListScheduledAuditsRequest,
  ) => stream.Stream<
    ScheduledAuditMetadata,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListScheduledAuditsRequest,
  output: ListScheduledAuditsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "scheduledAudits",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the Device Defender security profiles
 * you've
 * created. You can filter security profiles by dimension or custom metric.
 *
 * Requires permission to access the ListSecurityProfiles action.
 *
 * `dimensionName` and `metricName` cannot be used in the same request.
 */
export const listSecurityProfiles: {
  (
    input: ListSecurityProfilesRequest,
  ): effect.Effect<
    ListSecurityProfilesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSecurityProfilesRequest,
  ) => stream.Stream<
    ListSecurityProfilesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSecurityProfilesRequest,
  ) => stream.Stream<
    SecurityProfileIdentifier,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSecurityProfilesRequest,
  output: ListSecurityProfilesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "securityProfileIdentifiers",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the Device Defender security profiles attached to a target (thing group).
 *
 * Requires permission to access the ListSecurityProfilesForTarget action.
 */
export const listSecurityProfilesForTarget: {
  (
    input: ListSecurityProfilesForTargetRequest,
  ): effect.Effect<
    ListSecurityProfilesForTargetResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSecurityProfilesForTargetRequest,
  ) => stream.Stream<
    ListSecurityProfilesForTargetResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSecurityProfilesForTargetRequest,
  ) => stream.Stream<
    SecurityProfileTargetMapping,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSecurityProfilesForTargetRequest,
  output: ListSecurityProfilesForTargetResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "securityProfileTargetMappings",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the targets (thing groups) associated with a given Device Defender security profile.
 *
 * Requires permission to access the ListTargetsForSecurityProfile action.
 */
export const listTargetsForSecurityProfile: {
  (
    input: ListTargetsForSecurityProfileRequest,
  ): effect.Effect<
    ListTargetsForSecurityProfileResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTargetsForSecurityProfileRequest,
  ) => stream.Stream<
    ListTargetsForSecurityProfileResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTargetsForSecurityProfileRequest,
  ) => stream.Stream<
    SecurityProfileTarget,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTargetsForSecurityProfileRequest,
  output: ListTargetsForSecurityProfileResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "securityProfileTargets",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists logging levels.
 *
 * Requires permission to access the ListV2LoggingLevels action.
 */
export const listV2LoggingLevels: {
  (
    input: ListV2LoggingLevelsRequest,
  ): effect.Effect<
    ListV2LoggingLevelsResponse,
    | InternalException
    | InvalidRequestException
    | NotConfiguredException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListV2LoggingLevelsRequest,
  ) => stream.Stream<
    ListV2LoggingLevelsResponse,
    | InternalException
    | InvalidRequestException
    | NotConfiguredException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListV2LoggingLevelsRequest,
  ) => stream.Stream<
    LogTargetConfiguration,
    | InternalException
    | InvalidRequestException
    | NotConfiguredException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListV2LoggingLevelsRequest,
  output: ListV2LoggingLevelsResponse,
  errors: [
    InternalException,
    InvalidRequestException,
    NotConfiguredException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "logTargetConfigurations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the Device Defender security profile violations discovered during the given time period.
 * You can use filters to limit the results to those alerts issued for a particular security profile,
 * behavior, or thing (device).
 *
 * Requires permission to access the ListViolationEvents action.
 */
export const listViolationEvents: {
  (
    input: ListViolationEventsRequest,
  ): effect.Effect<
    ListViolationEventsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListViolationEventsRequest,
  ) => stream.Stream<
    ListViolationEventsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListViolationEventsRequest,
  ) => stream.Stream<
    ViolationEvent,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListViolationEventsRequest,
  output: ListViolationEventsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "violationEvents",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Validates a Device Defender security profile behaviors specification.
 *
 * Requires permission to access the ValidateSecurityProfileBehaviors action.
 */
export const validateSecurityProfileBehaviors: (
  input: ValidateSecurityProfileBehaviorsRequest,
) => effect.Effect<
  ValidateSecurityProfileBehaviorsResponse,
  | InternalFailureException
  | InvalidRequestException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ValidateSecurityProfileBehaviorsRequest,
  output: ValidateSecurityProfileBehaviorsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a job and its related job executions.
 *
 * Deleting a job may take time, depending on the number of job executions created for
 * the job and various other factors. While the job is being deleted, the status of the job
 * will be shown as "DELETION_IN_PROGRESS". Attempting to delete or cancel a job whose
 * status is already "DELETION_IN_PROGRESS" will result in an error.
 *
 * Only 10 jobs may have status "DELETION_IN_PROGRESS" at the same time, or a
 * LimitExceededException will occur.
 *
 * Requires permission to access the DeleteJob action.
 */
export const deleteJob: (
  input: DeleteJobRequest,
) => effect.Effect<
  DeleteJobResponse,
  | InvalidRequestException
  | InvalidStateTransitionException
  | LimitExceededException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteJobRequest,
  output: DeleteJobResponse,
  errors: [
    InvalidRequestException,
    InvalidStateTransitionException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Updates a provisioning template.
 *
 * Requires permission to access the UpdateProvisioningTemplate action.
 */
export const updateProvisioningTemplate: (
  input: UpdateProvisioningTemplateRequest,
) => effect.Effect<
  UpdateProvisioningTemplateResponse,
  | ConflictingResourceUpdateException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProvisioningTemplateRequest,
  output: UpdateProvisioningTemplateResponse,
  errors: [
    ConflictingResourceUpdateException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a logging level.
 *
 * Requires permission to access the DeleteV2LoggingLevel action.
 */
export const deleteV2LoggingLevel: (
  input: DeleteV2LoggingLevelRequest,
) => effect.Effect<
  DeleteV2LoggingLevelResponse,
  | InternalException
  | InvalidRequestException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteV2LoggingLevelRequest,
  output: DeleteV2LoggingLevelResponse,
  errors: [
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
  ],
}));
/**
 * Retrieves the encryption configuration for resources and data of your Amazon Web Services account in
 * Amazon Web Services IoT Core. For more information, see Data encryption at rest in
 * the *Amazon Web Services IoT Core Developer Guide*.
 */
export const describeEncryptionConfiguration: (
  input: DescribeEncryptionConfigurationRequest,
) => effect.Effect<
  DescribeEncryptionConfigurationResponse,
  | InternalFailureException
  | InvalidRequestException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEncryptionConfigurationRequest,
  output: DescribeEncryptionConfigurationResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * List the device certificates signed by the specified CA certificate.
 *
 * Requires permission to access the ListCertificatesByCA action.
 */
export const listCertificatesByCA: {
  (
    input: ListCertificatesByCARequest,
  ): effect.Effect<
    ListCertificatesByCAResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCertificatesByCARequest,
  ) => stream.Stream<
    ListCertificatesByCAResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCertificatesByCARequest,
  ) => stream.Stream<
    Certificate,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCertificatesByCARequest,
  output: ListCertificatesByCAResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "marker",
    outputToken: "nextMarker",
    items: "certificates",
    pageSize: "pageSize",
  } as const,
}));
/**
 * Lists the search indices.
 *
 * Requires permission to access the ListIndices action.
 */
export const listIndices: {
  (
    input: ListIndicesRequest,
  ): effect.Effect<
    ListIndicesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIndicesRequest,
  ) => stream.Stream<
    ListIndicesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIndicesRequest,
  ) => stream.Stream<
    IndexName,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIndicesRequest,
  output: ListIndicesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "indexNames",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists your policies.
 *
 * Requires permission to access the ListPolicies action.
 */
export const listPolicies: {
  (
    input: ListPoliciesRequest,
  ): effect.Effect<
    ListPoliciesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPoliciesRequest,
  ) => stream.Stream<
    ListPoliciesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPoliciesRequest,
  ) => stream.Stream<
    Policy,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPoliciesRequest,
  output: ListPoliciesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "marker",
    outputToken: "nextMarker",
    items: "policies",
    pageSize: "pageSize",
  } as const,
}));
/**
 * Lists the role aliases registered in your account.
 *
 * Requires permission to access the ListRoleAliases action.
 */
export const listRoleAliases: {
  (
    input: ListRoleAliasesRequest,
  ): effect.Effect<
    ListRoleAliasesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRoleAliasesRequest,
  ) => stream.Stream<
    ListRoleAliasesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRoleAliasesRequest,
  ) => stream.Stream<
    RoleAlias,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRoleAliasesRequest,
  output: ListRoleAliasesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "marker",
    outputToken: "nextMarker",
    items: "roleAliases",
    pageSize: "pageSize",
  } as const,
}));
/**
 * Sets the logging options.
 *
 * NOTE: use of this command is not recommended. Use `SetV2LoggingOptions`
 * instead.
 *
 * Requires permission to access the SetLoggingOptions action.
 */
export const setLoggingOptions: (
  input: SetLoggingOptionsRequest,
) => effect.Effect<
  SetLoggingOptionsResponse,
  | InternalException
  | InvalidRequestException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetLoggingOptionsRequest,
  output: SetLoggingOptionsResponse,
  errors: [
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
  ],
}));
/**
 * Sets the logging options for the V2 logging service.
 *
 * Requires permission to access the SetV2LoggingOptions action.
 */
export const setV2LoggingOptions: (
  input: SetV2LoggingOptionsRequest,
) => effect.Effect<
  SetV2LoggingOptionsResponse,
  | InternalException
  | InvalidRequestException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetV2LoggingOptionsRequest,
  output: SetV2LoggingOptionsResponse,
  errors: [
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes a CA certificate registration code.
 *
 * Requires permission to access the DeleteRegistrationCode action.
 */
export const deleteRegistrationCode: (
  input: DeleteRegistrationCodeRequest,
) => effect.Effect<
  DeleteRegistrationCodeResponse,
  | InternalFailureException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRegistrationCodeRequest,
  output: DeleteRegistrationCodeResponse,
  errors: [
    InternalFailureException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes the specified domain configuration.
 *
 * Requires permission to access the DeleteDomainConfiguration action.
 */
export const deleteDomainConfiguration: (
  input: DeleteDomainConfigurationRequest,
) => effect.Effect<
  DeleteDomainConfigurationResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainConfigurationRequest,
  output: DeleteDomainConfigurationResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes the specified thing type. You cannot delete a thing type if it has things
 * associated with it. To delete a thing type, first mark it as deprecated by calling DeprecateThingType, then remove any associated things by calling UpdateThing to change the thing type on any associated thing, and
 * finally use DeleteThingType to delete the thing type.
 *
 * Requires permission to access the DeleteThingType action.
 */
export const deleteThingType: (
  input: DeleteThingTypeRequest,
) => effect.Effect<
  DeleteThingTypeResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteThingTypeRequest,
  output: DeleteThingTypeResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Deprecates a thing type. You can not associate new things with deprecated thing
 * type.
 *
 * Requires permission to access the DeprecateThingType action.
 */
export const deprecateThingType: (
  input: DeprecateThingTypeRequest,
) => effect.Effect<
  DeprecateThingTypeResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeprecateThingTypeRequest,
  output: DeprecateThingTypeResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Removes the specified policy from the specified certificate.
 *
 * **Note:** This action is deprecated and works as
 * expected for backward compatibility, but we won't add enhancements. Use DetachPolicy instead.
 *
 * Requires permission to access the DetachPrincipalPolicy action.
 */
export const detachPrincipalPolicy: (
  input: DetachPrincipalPolicyRequest,
) => effect.Effect<
  DetachPrincipalPolicyResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachPrincipalPolicyRequest,
  output: DetachPrincipalPolicyResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Detaches the specified principal from the specified thing. A principal can be X.509
 * certificates, IAM users, groups, and roles, Amazon Cognito identities or federated
 * identities.
 *
 * This call is asynchronous. It might take several seconds for the detachment to
 * propagate.
 *
 * Requires permission to access the DetachThingPrincipal action.
 */
export const detachThingPrincipal: (
  input: DetachThingPrincipalRequest,
) => effect.Effect<
  DetachThingPrincipalResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachThingPrincipalRequest,
  output: DetachThingPrincipalResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets a registration code used to register a CA certificate with IoT.
 *
 * IoT will create a registration code as part of this API call if the registration
 * code doesn't exist or has been deleted. If you already have a registration code, this API
 * call will return the same registration code.
 *
 * Requires permission to access the GetRegistrationCode action.
 */
export const getRegistrationCode: (
  input: GetRegistrationCodeRequest,
) => effect.Effect<
  GetRegistrationCodeResponse,
  | InternalFailureException
  | InvalidRequestException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRegistrationCodeRequest,
  output: GetRegistrationCodeResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Sets the specified version of the specified policy as the policy's default
 * (operative) version. This action affects all certificates to which the policy is attached.
 * To list the principals the policy is attached to, use the ListPrincipalPolicies
 * action.
 *
 * Requires permission to access the SetDefaultPolicyVersion action.
 */
export const setDefaultPolicyVersion: (
  input: SetDefaultPolicyVersionRequest,
) => effect.Effect<
  SetDefaultPolicyVersionResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetDefaultPolicyVersionRequest,
  output: SetDefaultPolicyVersionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Updates a registered CA certificate.
 *
 * Requires permission to access the UpdateCACertificate action.
 */
export const updateCACertificate: (
  input: UpdateCACertificateRequest,
) => effect.Effect<
  UpdateCACertificateResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCACertificateRequest,
  output: UpdateCACertificateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Updates the encryption configuration. By default, Amazon Web Services IoT Core encrypts your data at rest using Amazon Web Services owned keys. Amazon Web Services IoT Core also supports symmetric customer managed keys
 * from Key Management Service (KMS). With customer managed keys, you create, own, and
 * manage the KMS keys in your Amazon Web Services account.
 *
 * Before using this API, you must set up permissions for Amazon Web Services IoT Core to access KMS. For more information, see Data encryption at rest in the *Amazon Web Services IoT Core Developer Guide*.
 */
export const updateEncryptionConfiguration: (
  input: UpdateEncryptionConfigurationRequest,
) => effect.Effect<
  UpdateEncryptionConfigurationResponse,
  | InternalFailureException
  | InvalidRequestException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEncryptionConfigurationRequest,
  output: UpdateEncryptionConfigurationResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Updates the search configuration.
 *
 * Requires permission to access the UpdateIndexingConfiguration action.
 */
export const updateIndexingConfiguration: (
  input: UpdateIndexingConfigurationRequest,
) => effect.Effect<
  UpdateIndexingConfigurationResponse,
  | InternalFailureException
  | InvalidRequestException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIndexingConfigurationRequest,
  output: UpdateIndexingConfigurationResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Updates supported fields of the specified job.
 *
 * Requires permission to access the UpdateJob action.
 */
export const updateJob: (
  input: UpdateJobRequest,
) => effect.Effect<
  UpdateJobResponse,
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateJobRequest,
  output: UpdateJobResponse,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Updates a thing type.
 */
export const updateThingType: (
  input: UpdateThingTypeRequest,
) => effect.Effect<
  UpdateThingTypeResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateThingTypeRequest,
  output: UpdateThingTypeResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Attaches the specified principal to the specified thing. A principal can be X.509
 * certificates, Amazon Cognito identities or federated identities.
 *
 * Requires permission to access the AttachThingPrincipal action.
 */
export const attachThingPrincipal: (
  input: AttachThingPrincipalRequest,
) => effect.Effect<
  AttachThingPrincipalResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachThingPrincipalRequest,
  output: AttachThingPrincipalResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes the rule.
 *
 * Requires permission to access the DeleteTopicRule action.
 */
export const deleteTopicRule: (
  input: DeleteTopicRuleRequest,
) => effect.Effect<
  DeleteTopicRuleResponse,
  | ConflictingResourceUpdateException
  | InternalException
  | InvalidRequestException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTopicRuleRequest,
  output: DeleteTopicRuleResponse,
  errors: [
    ConflictingResourceUpdateException,
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a topic rule destination.
 *
 * Requires permission to access the DeleteTopicRuleDestination action.
 */
export const deleteTopicRuleDestination: (
  input: DeleteTopicRuleDestinationRequest,
) => effect.Effect<
  DeleteTopicRuleDestinationResponse,
  | ConflictingResourceUpdateException
  | InternalException
  | InvalidRequestException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTopicRuleDestinationRequest,
  output: DeleteTopicRuleDestinationResponse,
  errors: [
    ConflictingResourceUpdateException,
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Disables the rule.
 *
 * Requires permission to access the DisableTopicRule action.
 */
export const disableTopicRule: (
  input: DisableTopicRuleRequest,
) => effect.Effect<
  DisableTopicRuleResponse,
  | ConflictingResourceUpdateException
  | InternalException
  | InvalidRequestException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableTopicRuleRequest,
  output: DisableTopicRuleResponse,
  errors: [
    ConflictingResourceUpdateException,
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Enables the rule.
 *
 * Requires permission to access the EnableTopicRule action.
 */
export const enableTopicRule: (
  input: EnableTopicRuleRequest,
) => effect.Effect<
  EnableTopicRuleResponse,
  | ConflictingResourceUpdateException
  | InternalException
  | InvalidRequestException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableTopicRuleRequest,
  output: EnableTopicRuleResponse,
  errors: [
    ConflictingResourceUpdateException,
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Updates a topic rule destination. You use this to change the status, endpoint URL, or
 * confirmation URL of the destination.
 *
 * Requires permission to access the UpdateTopicRuleDestination action.
 */
export const updateTopicRuleDestination: (
  input: UpdateTopicRuleDestinationRequest,
) => effect.Effect<
  UpdateTopicRuleDestinationResponse,
  | ConflictingResourceUpdateException
  | InternalException
  | InvalidRequestException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTopicRuleDestinationRequest,
  output: UpdateTopicRuleDestinationResponse,
  errors: [
    ConflictingResourceUpdateException,
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a certificate provider.
 *
 * Requires permission to access the DeleteCertificateProvider action.
 *
 * If you delete the certificate provider resource, the behavior of
 * `CreateCertificateFromCsr` will resume, and IoT will create
 * certificates signed by IoT from a certificate signing request (CSR).
 */
export const deleteCertificateProvider: (
  input: DeleteCertificateProviderRequest,
) => effect.Effect<
  DeleteCertificateProviderResponse,
  | DeleteConflictException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCertificateProviderRequest,
  output: DeleteCertificateProviderResponse,
  errors: [
    DeleteConflictException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes the specified policy.
 *
 * A policy cannot be deleted if it has non-default versions or it is attached to any
 * certificate.
 *
 * To delete a policy, use the DeletePolicyVersion action to delete all non-default
 * versions of the policy; use the DetachPolicy action to detach the policy from any
 * certificate; and then use the DeletePolicy action to delete the policy.
 *
 * When a policy is deleted using DeletePolicy, its default version is deleted with
 * it.
 *
 * Because of the distributed nature of Amazon Web Services, it can take up to five minutes after
 * a policy is detached before it's ready to be deleted.
 *
 * Requires permission to access the DeletePolicy action.
 */
export const deletePolicy: (
  input: DeletePolicyRequest,
) => effect.Effect<
  DeletePolicyResponse,
  | DeleteConflictException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePolicyRequest,
  output: DeletePolicyResponse,
  errors: [
    DeleteConflictException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes the specified version of the specified policy. You cannot delete the default
 * version of a policy using this action. To delete the default version of a policy, use DeletePolicy. To find out which version of a policy is marked as the default
 * version, use ListPolicyVersions.
 *
 * Requires permission to access the DeletePolicyVersion action.
 */
export const deletePolicyVersion: (
  input: DeletePolicyVersionRequest,
) => effect.Effect<
  DeletePolicyVersionResponse,
  | DeleteConflictException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePolicyVersionRequest,
  output: DeletePolicyVersionResponse,
  errors: [
    DeleteConflictException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a role alias
 *
 * Requires permission to access the DeleteRoleAlias action.
 */
export const deleteRoleAlias: (
  input: DeleteRoleAliasRequest,
) => effect.Effect<
  DeleteRoleAliasResponse,
  | DeleteConflictException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRoleAliasRequest,
  output: DeleteRoleAliasResponse,
  errors: [
    DeleteConflictException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a stream.
 *
 * Requires permission to access the DeleteStream action.
 */
export const deleteStream: (
  input: DeleteStreamRequest,
) => effect.Effect<
  DeleteStreamResponse,
  | DeleteConflictException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStreamRequest,
  output: DeleteStreamResponse,
  errors: [
    DeleteConflictException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes the specified certificate.
 *
 * A certificate cannot be deleted if it has a policy or IoT thing attached to it or if
 * its status is set to ACTIVE. To delete a certificate, first use the DetachPolicy action to detach all policies. Next, use the UpdateCertificate action to set the certificate to the INACTIVE
 * status.
 *
 * Requires permission to access the DeleteCertificate action.
 */
export const deleteCertificate: (
  input: DeleteCertificateRequest,
) => effect.Effect<
  DeleteCertificateResponse,
  | CertificateStateException
  | DeleteConflictException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCertificateRequest,
  output: DeleteCertificateResponse,
  errors: [
    CertificateStateException,
    DeleteConflictException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Updates the status of the specified certificate. This operation is
 * idempotent.
 *
 * Requires permission to access the UpdateCertificate action.
 *
 * Certificates must be in the ACTIVE state to authenticate devices that use
 * a certificate to connect to IoT.
 *
 * Within a few minutes of updating a certificate from the ACTIVE state to any other
 * state, IoT disconnects all devices that used that certificate to connect. Devices cannot
 * use a certificate that is not in the ACTIVE state to reconnect.
 */
export const updateCertificate: (
  input: UpdateCertificateRequest,
) => effect.Effect<
  UpdateCertificateResponse,
  | CertificateStateException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCertificateRequest,
  output: UpdateCertificateResponse,
  errors: [
    CertificateStateException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets the logging options.
 *
 * NOTE: use of this command is not recommended. Use `GetV2LoggingOptions`
 * instead.
 *
 * Requires permission to access the GetLoggingOptions action.
 */
export const getLoggingOptions: (
  input: GetLoggingOptionsRequest,
) => effect.Effect<
  GetLoggingOptionsResponse,
  | InternalException
  | InvalidRequestException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLoggingOptionsRequest,
  output: GetLoggingOptionsResponse,
  errors: [
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
  ],
}));
/**
 * Confirms a topic rule destination. When you create a rule requiring a destination, IoT
 * sends a confirmation message to the endpoint or base address you specify. The message
 * includes a token which you pass back when calling `ConfirmTopicRuleDestination`
 * to confirm that you own or have access to the endpoint.
 *
 * Requires permission to access the ConfirmTopicRuleDestination action.
 */
export const confirmTopicRuleDestination: (
  input: ConfirmTopicRuleDestinationRequest,
) => effect.Effect<
  ConfirmTopicRuleDestinationResponse,
  | ConflictingResourceUpdateException
  | InternalException
  | InvalidRequestException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ConfirmTopicRuleDestinationRequest,
  output: ConfirmTopicRuleDestinationResponse,
  errors: [
    ConflictingResourceUpdateException,
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Retrieves the live connectivity status per device.
 */
export const getThingConnectivityData: (
  input: GetThingConnectivityDataRequest,
) => effect.Effect<
  GetThingConnectivityDataResponse,
  | IndexNotReadyException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetThingConnectivityDataRequest,
  output: GetThingConnectivityDataResponse,
  errors: [
    IndexNotReadyException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Clears the default authorizer.
 *
 * Requires permission to access the ClearDefaultAuthorizer action.
 */
export const clearDefaultAuthorizer: (
  input: ClearDefaultAuthorizerRequest,
) => effect.Effect<
  ClearDefaultAuthorizerResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ClearDefaultAuthorizerRequest,
  output: ClearDefaultAuthorizerResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a provisioning claim.
 *
 * Requires permission to access the CreateProvisioningClaim action.
 */
export const createProvisioningClaim: (
  input: CreateProvisioningClaimRequest,
) => effect.Effect<
  CreateProvisioningClaimResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProvisioningClaimRequest,
  output: CreateProvisioningClaimResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes an authorizer.
 *
 * Requires permission to access the DeleteAuthorizer action.
 */
export const deleteAuthorizer: (
  input: DeleteAuthorizerRequest,
) => effect.Effect<
  DeleteAuthorizerResponse,
  | DeleteConflictException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAuthorizerRequest,
  output: DeleteAuthorizerResponse,
  errors: [
    DeleteConflictException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a registered CA certificate.
 *
 * Requires permission to access the DeleteCACertificate action.
 */
export const deleteCACertificate: (
  input: DeleteCACertificateRequest,
) => effect.Effect<
  DeleteCACertificateResponse,
  | CertificateStateException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCACertificateRequest,
  output: DeleteCACertificateResponse,
  errors: [
    CertificateStateException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Describes an authorizer.
 *
 * Requires permission to access the DescribeAuthorizer action.
 */
export const describeAuthorizer: (
  input: DescribeAuthorizerRequest,
) => effect.Effect<
  DescribeAuthorizerResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAuthorizerRequest,
  output: DescribeAuthorizerResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Describes a certificate provider.
 *
 * Requires permission to access the DescribeCertificateProvider action.
 */
export const describeCertificateProvider: (
  input: DescribeCertificateProviderRequest,
) => effect.Effect<
  DescribeCertificateProviderResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCertificateProviderRequest,
  output: DescribeCertificateProviderResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Describes the default authorizer.
 *
 * Requires permission to access the DescribeDefaultAuthorizer action.
 */
export const describeDefaultAuthorizer: (
  input: DescribeDefaultAuthorizerRequest,
) => effect.Effect<
  DescribeDefaultAuthorizerResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDefaultAuthorizerRequest,
  output: DescribeDefaultAuthorizerResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about the specified fleet metric.
 *
 * Requires permission to access the DescribeFleetMetric action.
 */
export const describeFleetMetric: (
  input: DescribeFleetMetricRequest,
) => effect.Effect<
  DescribeFleetMetricResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFleetMetricRequest,
  output: DescribeFleetMetricResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Describes a search index.
 *
 * Requires permission to access the DescribeIndex action.
 */
export const describeIndex: (
  input: DescribeIndexRequest,
) => effect.Effect<
  DescribeIndexResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeIndexRequest,
  output: DescribeIndexResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about the specified thing.
 *
 * Requires permission to access the DescribeThing action.
 */
export const describeThing: (
  input: DescribeThingRequest,
) => effect.Effect<
  DescribeThingResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeThingRequest,
  output: DescribeThingResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets a job document.
 *
 * Requires permission to access the GetJobDocument action.
 */
export const getJobDocument: (
  input: GetJobDocumentRequest,
) => effect.Effect<
  GetJobDocumentResponse,
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobDocumentRequest,
  output: GetJobDocumentResponse,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Gets information about the specified policy with the policy document of the default
 * version.
 *
 * Requires permission to access the GetPolicy action.
 */
export const getPolicy: (
  input: GetPolicyRequest,
) => effect.Effect<
  GetPolicyResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyRequest,
  output: GetPolicyResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about the specified policy version.
 *
 * Requires permission to access the GetPolicyVersion action.
 */
export const getPolicyVersion: (
  input: GetPolicyVersionRequest,
) => effect.Effect<
  GetPolicyVersionResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyVersionRequest,
  output: GetPolicyVersionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the principals associated with the specified policy.
 *
 * **Note:** This action is deprecated and works as
 * expected for backward compatibility, but we won't add enhancements. Use ListTargetsForPolicy instead.
 *
 * Requires permission to access the ListPolicyPrincipals action.
 */
export const listPolicyPrincipals: {
  (
    input: ListPolicyPrincipalsRequest,
  ): effect.Effect<
    ListPolicyPrincipalsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPolicyPrincipalsRequest,
  ) => stream.Stream<
    ListPolicyPrincipalsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPolicyPrincipalsRequest,
  ) => stream.Stream<
    PrincipalArn,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPolicyPrincipalsRequest,
  output: ListPolicyPrincipalsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "marker",
    outputToken: "nextMarker",
    items: "principals",
    pageSize: "pageSize",
  } as const,
}));
/**
 * Lists the policies attached to the specified principal. If you use an Cognito
 * identity, the ID must be in AmazonCognito Identity format.
 *
 * **Note:** This action is deprecated and works as
 * expected for backward compatibility, but we won't add enhancements. Use ListAttachedPolicies instead.
 *
 * Requires permission to access the ListPrincipalPolicies action.
 */
export const listPrincipalPolicies: {
  (
    input: ListPrincipalPoliciesRequest,
  ): effect.Effect<
    ListPrincipalPoliciesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPrincipalPoliciesRequest,
  ) => stream.Stream<
    ListPrincipalPoliciesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPrincipalPoliciesRequest,
  ) => stream.Stream<
    Policy,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPrincipalPoliciesRequest,
  output: ListPrincipalPoliciesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "marker",
    outputToken: "nextMarker",
    items: "policies",
    pageSize: "pageSize",
  } as const,
}));
/**
 * Lists the things associated with the specified principal. A principal can be X.509
 * certificates, IAM users, groups, and roles, Amazon Cognito identities or federated
 * identities.
 *
 * Requires permission to access the ListPrincipalThings action.
 */
export const listPrincipalThings: {
  (
    input: ListPrincipalThingsRequest,
  ): effect.Effect<
    ListPrincipalThingsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPrincipalThingsRequest,
  ) => stream.Stream<
    ListPrincipalThingsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPrincipalThingsRequest,
  ) => stream.Stream<
    ThingName,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPrincipalThingsRequest,
  output: ListPrincipalThingsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "things",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the principals associated with the specified thing. A principal can be X.509
 * certificates, IAM users, groups, and roles, Amazon Cognito identities or federated
 * identities.
 *
 * Requires permission to access the ListThingPrincipals action.
 */
export const listThingPrincipals: {
  (
    input: ListThingPrincipalsRequest,
  ): effect.Effect<
    ListThingPrincipalsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListThingPrincipalsRequest,
  ) => stream.Stream<
    ListThingPrincipalsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListThingPrincipalsRequest,
  ) => stream.Stream<
    PrincipalArn,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListThingPrincipalsRequest,
  output: ListThingPrincipalsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "principals",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates a certificate provider.
 *
 * Requires permission to access the UpdateCertificateProvider action.
 */
export const updateCertificateProvider: (
  input: UpdateCertificateProviderRequest,
) => effect.Effect<
  UpdateCertificateProviderResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCertificateProviderRequest,
  output: UpdateCertificateProviderResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Updates a role alias.
 *
 * Requires permission to access the UpdateRoleAlias action.
 *
 * The value of
 * `credentialDurationSeconds`
 * must be less than or equal to the
 * maximum session duration of the IAM role that the role alias references. For more
 * information, see Modifying a role maximum session duration (Amazon Web Services API) from the Amazon Web Services
 * Identity and Access Management User Guide.
 */
export const updateRoleAlias: (
  input: UpdateRoleAliasRequest,
) => effect.Effect<
  UpdateRoleAliasResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRoleAliasRequest,
  output: UpdateRoleAliasResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Use this API to define a
 * Custom
 * Metric
 * published by your devices to Device Defender.
 *
 * Requires permission to access the CreateCustomMetric action.
 */
export const createCustomMetric: (
  input: CreateCustomMetricRequest,
) => effect.Effect<
  CreateCustomMetricResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCustomMetricRequest,
  output: CreateCustomMetricResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Create a dimension that you can use to limit the scope of a metric used in a security profile for IoT Device Defender.
 * For example, using a `TOPIC_FILTER` dimension, you can narrow down the scope of the metric only to MQTT topics whose name match the pattern specified in the dimension.
 *
 * Requires permission to access the CreateDimension action.
 */
export const createDimension: (
  input: CreateDimensionRequest,
) => effect.Effect<
  CreateDimensionResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDimensionRequest,
  output: CreateDimensionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Creates a role alias.
 *
 * Requires permission to access the CreateRoleAlias action.
 *
 * The value of
 * `credentialDurationSeconds`
 * must be less than or equal to the maximum session
 * duration of the IAM role that the role alias references. For more information, see
 *
 * Modifying a role maximum session duration (Amazon Web Services API) from the Amazon Web Services Identity and Access Management User Guide.
 */
export const createRoleAlias: (
  input: CreateRoleAliasRequest,
) => effect.Effect<
  CreateRoleAliasResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRoleAliasRequest,
  output: CreateRoleAliasResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a scheduled audit that is run at a specified
 * time interval.
 *
 * Requires permission to access the CreateScheduledAudit action.
 */
export const createScheduledAudit: (
  input: CreateScheduledAuditRequest,
) => effect.Effect<
  CreateScheduledAuditResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateScheduledAuditRequest,
  output: CreateScheduledAuditResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * List targets for the specified policy.
 *
 * Requires permission to access the ListTargetsForPolicy action.
 */
export const listTargetsForPolicy: {
  (
    input: ListTargetsForPolicyRequest,
  ): effect.Effect<
    ListTargetsForPolicyResponse,
    | InternalFailureException
    | InvalidRequestException
    | LimitExceededException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTargetsForPolicyRequest,
  ) => stream.Stream<
    ListTargetsForPolicyResponse,
    | InternalFailureException
    | InvalidRequestException
    | LimitExceededException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTargetsForPolicyRequest,
  ) => stream.Stream<
    PolicyTarget,
    | InternalFailureException
    | InvalidRequestException
    | LimitExceededException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTargetsForPolicyRequest,
  output: ListTargetsForPolicyResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "marker",
    outputToken: "nextMarker",
    items: "targets",
    pageSize: "pageSize",
  } as const,
}));
/**
 * Sets the logging level.
 *
 * Requires permission to access the SetV2LoggingLevel action.
 */
export const setV2LoggingLevel: (
  input: SetV2LoggingLevelRequest,
) => effect.Effect<
  SetV2LoggingLevelResponse,
  | InternalException
  | InvalidRequestException
  | LimitExceededException
  | NotConfiguredException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetV2LoggingLevelRequest,
  output: SetV2LoggingLevelResponse,
  errors: [
    InternalException,
    InvalidRequestException,
    LimitExceededException,
    NotConfiguredException,
    ServiceUnavailableException,
  ],
}));
/**
 * Starts an on-demand Device Defender audit.
 *
 * Requires permission to access the StartOnDemandAuditTask action.
 */
export const startOnDemandAuditTask: (
  input: StartOnDemandAuditTaskRequest,
) => effect.Effect<
  StartOnDemandAuditTaskResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartOnDemandAuditTaskRequest,
  output: StartOnDemandAuditTaskResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ThrottlingException,
  ],
}));
/**
 * Updates an authorizer.
 *
 * Requires permission to access the UpdateAuthorizer action.
 */
export const updateAuthorizer: (
  input: UpdateAuthorizerRequest,
) => effect.Effect<
  UpdateAuthorizerResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAuthorizerRequest,
  output: UpdateAuthorizerResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Updates an existing stream. The stream version will be incremented by one.
 *
 * Requires permission to access the UpdateStream action.
 */
export const updateStream: (
  input: UpdateStreamRequest,
) => effect.Effect<
  UpdateStreamResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStreamRequest,
  output: UpdateStreamResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Detaches a policy from the specified target.
 *
 * Because of the distributed nature of Amazon Web Services, it can take up to five minutes after
 * a policy is detached before it's ready to be deleted.
 *
 * Requires permission to access the DetachPolicy action.
 */
export const detachPolicy: (
  input: DetachPolicyRequest,
) => effect.Effect<
  DetachPolicyResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachPolicyRequest,
  output: DetachPolicyResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Adds to or modifies the tags of the given resource. Tags are metadata which can be
 * used to manage a resource.
 *
 * Requires permission to access the TagResource action.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Attaches the specified policy to the specified principal (certificate or other
 * credential).
 *
 * Requires permission to access the AttachPolicy action.
 */
export const attachPolicy: (
  input: AttachPolicyRequest,
) => effect.Effect<
  AttachPolicyResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachPolicyRequest,
  output: AttachPolicyResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Attaches the specified policy to the specified principal (certificate or other
 * credential).
 *
 * **Note:** This action is deprecated and works as
 * expected for backward compatibility, but we won't add enhancements. Use AttachPolicy instead.
 *
 * Requires permission to access the AttachPrincipalPolicy action.
 */
export const attachPrincipalPolicy: (
  input: AttachPrincipalPolicyRequest,
) => effect.Effect<
  AttachPrincipalPolicyResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachPrincipalPolicyRequest,
  output: AttachPrincipalPolicyResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Associates a group with a continuous job. The following criteria must be met:
 *
 * - The job must have been created with the `targetSelection` field
 * set to "CONTINUOUS".
 *
 * - The job status must currently be "IN_PROGRESS".
 *
 * - The total number of targets associated with a job must not exceed
 * 100.
 *
 * Requires permission to access the AssociateTargetsWithJob action.
 */
export const associateTargetsWithJob: (
  input: AssociateTargetsWithJobRequest,
) => effect.Effect<
  AssociateTargetsWithJobResponse,
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateTargetsWithJobRequest,
  output: AssociateTargetsWithJobResponse,
  errors: [
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Cancels a job.
 *
 * Requires permission to access the CancelJob action.
 */
export const cancelJob: (
  input: CancelJobRequest,
) => effect.Effect<
  CancelJobResponse,
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelJobRequest,
  output: CancelJobResponse,
  errors: [
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Creates a Device Defender audit suppression.
 *
 * Requires permission to access the CreateAuditSuppression action.
 */
export const createAuditSuppression: (
  input: CreateAuditSuppressionRequest,
) => effect.Effect<
  CreateAuditSuppressionResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAuditSuppressionRequest,
  output: CreateAuditSuppressionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Creates an authorizer.
 *
 * Requires permission to access the CreateAuthorizer action.
 */
export const createAuthorizer: (
  input: CreateAuthorizerRequest,
) => effect.Effect<
  CreateAuthorizerResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAuthorizerRequest,
  output: CreateAuthorizerResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Sets the default authorizer. This will be used if a websocket connection is made
 * without specifying an authorizer.
 *
 * Requires permission to access the SetDefaultAuthorizer action.
 */
export const setDefaultAuthorizer: (
  input: SetDefaultAuthorizerRequest,
) => effect.Effect<
  SetDefaultAuthorizerResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetDefaultAuthorizerRequest,
  output: SetDefaultAuthorizerResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a billing group. If this call is made multiple times using
 * the same billing group name and configuration, the call will succeed. If this call is made with
 * the same billing group name but different configuration a `ResourceAlreadyExistsException` is thrown.
 *
 * Requires permission to access the CreateBillingGroup action.
 */
export const createBillingGroup: (
  input: CreateBillingGroupRequest,
) => effect.Effect<
  CreateBillingGroupResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceAlreadyExistsException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBillingGroupRequest,
  output: CreateBillingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Creates an Amazon Web Services IoT Core certificate provider. You can use Amazon Web Services IoT Core certificate provider to
 * customize how to sign a certificate signing request (CSR) in IoT fleet provisioning. For
 * more information, see Customizing certificate
 * signing using Amazon Web Services IoT Core certificate provider from Amazon Web Services IoT Core Developer
 * Guide.
 *
 * Requires permission to access the CreateCertificateProvider action.
 *
 * After you create a certificate provider, the behavior of
 * `CreateCertificateFromCsr` API for fleet provisioning will
 * change and all API calls to `CreateCertificateFromCsr` will invoke the
 * certificate provider to create the certificates. It can take up to a few minutes for
 * this behavior to change after a certificate provider is created.
 */
export const createCertificateProvider: (
  input: CreateCertificateProviderRequest,
) => effect.Effect<
  CreateCertificateProviderResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCertificateProviderRequest,
  output: CreateCertificateProviderResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Creates an IoT policy.
 *
 * The created policy is the default version for the policy. This operation creates a
 * policy version with a version identifier of **1** and sets
 * **1** as the policy's default version.
 *
 * Requires permission to access the CreatePolicy action.
 */
export const createPolicy: (
  input: CreatePolicyRequest,
) => effect.Effect<
  CreatePolicyResponse,
  | InternalFailureException
  | InvalidRequestException
  | MalformedPolicyException
  | ResourceAlreadyExistsException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePolicyRequest,
  output: CreatePolicyResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    MalformedPolicyException,
    ResourceAlreadyExistsException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a provisioning template.
 *
 * Requires permission to access the CreateProvisioningTemplate action.
 */
export const createProvisioningTemplate: (
  input: CreateProvisioningTemplateRequest,
) => effect.Effect<
  CreateProvisioningTemplateResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProvisioningTemplateRequest,
  output: CreateProvisioningTemplateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a stream for delivering one or more large files in chunks over MQTT. A stream transports data
 * bytes in chunks or blocks packaged as MQTT messages from a source like S3. You can have one or more files
 * associated with a stream.
 *
 * Requires permission to access the CreateStream action.
 */
export const createStream: (
  input: CreateStreamRequest,
) => effect.Effect<
  CreateStreamResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStreamRequest,
  output: CreateStreamResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Returns or creates a unique endpoint specific to the Amazon Web Services account making the
 * call.
 *
 * The first time `DescribeEndpoint` is called, an endpoint is created. All subsequent calls to `DescribeEndpoint` return the same endpoint.
 *
 * Requires permission to access the DescribeEndpoint action.
 */
export const describeEndpoint: (
  input: DescribeEndpointRequest,
) => effect.Effect<
  DescribeEndpointResponse,
  | InternalFailureException
  | InvalidRequestException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEndpointRequest,
  output: DescribeEndpointResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about the specified software package's configuration.
 *
 * Requires permission to access the GetPackageConfiguration action.
 */
export const getPackageConfiguration: (
  input: GetPackageConfigurationRequest,
) => effect.Effect<
  GetPackageConfigurationResponse,
  InternalServerException | ThrottlingException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPackageConfigurationRequest,
  output: GetPackageConfigurationResponse,
  errors: [InternalServerException, ThrottlingException],
}));
/**
 * Lists the findings (results) of a Device Defender audit or of the audits
 * performed during a specified time period. (Findings are retained for 90 days.)
 *
 * Requires permission to access the ListAuditFindings action.
 */
export const listAuditFindings: {
  (
    input: ListAuditFindingsRequest,
  ): effect.Effect<
    ListAuditFindingsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAuditFindingsRequest,
  ) => stream.Stream<
    ListAuditFindingsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAuditFindingsRequest,
  ) => stream.Stream<
    AuditFinding,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAuditFindingsRequest,
  output: ListAuditFindingsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "findings",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists your Device Defender detect custom metrics.
 *
 * Requires permission to access the ListCustomMetrics action.
 */
export const listCustomMetrics: {
  (
    input: ListCustomMetricsRequest,
  ): effect.Effect<
    ListCustomMetricsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCustomMetricsRequest,
  ) => stream.Stream<
    ListCustomMetricsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCustomMetricsRequest,
  ) => stream.Stream<
    MetricName,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCustomMetricsRequest,
  output: ListCustomMetricsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "metricNames",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List of Device Defender ML Detect mitigation actions tasks.
 *
 * Requires permission to access the ListDetectMitigationActionsTasks action.
 */
export const listDetectMitigationActionsTasks: {
  (
    input: ListDetectMitigationActionsTasksRequest,
  ): effect.Effect<
    ListDetectMitigationActionsTasksResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDetectMitigationActionsTasksRequest,
  ) => stream.Stream<
    ListDetectMitigationActionsTasksResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDetectMitigationActionsTasksRequest,
  ) => stream.Stream<
    DetectMitigationActionsTaskSummary,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDetectMitigationActionsTasksRequest,
  output: ListDetectMitigationActionsTasksResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "tasks",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List the set of dimensions that are defined for your Amazon Web Services accounts.
 *
 * Requires permission to access the ListDimensions action.
 */
export const listDimensions: {
  (
    input: ListDimensionsRequest,
  ): effect.Effect<
    ListDimensionsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDimensionsRequest,
  ) => stream.Stream<
    ListDimensionsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDimensionsRequest,
  ) => stream.Stream<
    DimensionName,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDimensionsRequest,
  output: ListDimensionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "dimensionNames",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Information about the thing registration tasks.
 */
export const listThingRegistrationTaskReports: {
  (
    input: ListThingRegistrationTaskReportsRequest,
  ): effect.Effect<
    ListThingRegistrationTaskReportsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListThingRegistrationTaskReportsRequest,
  ) => stream.Stream<
    ListThingRegistrationTaskReportsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListThingRegistrationTaskReportsRequest,
  ) => stream.Stream<
    S3FileUrl,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListThingRegistrationTaskReportsRequest,
  output: ListThingRegistrationTaskReportsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "resourceLinks",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List bulk thing provisioning tasks.
 *
 * Requires permission to access the ListThingRegistrationTasks action.
 */
export const listThingRegistrationTasks: {
  (
    input: ListThingRegistrationTasksRequest,
  ): effect.Effect<
    ListThingRegistrationTasksResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListThingRegistrationTasksRequest,
  ) => stream.Stream<
    ListThingRegistrationTasksResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListThingRegistrationTasksRequest,
  ) => stream.Stream<
    TaskId,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListThingRegistrationTasksRequest,
  output: ListThingRegistrationTasksResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "taskIds",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a bulk thing provisioning task.
 *
 * Requires permission to access the StartThingRegistrationTask action.
 */
export const startThingRegistrationTask: (
  input: StartThingRegistrationTaskRequest,
) => effect.Effect<
  StartThingRegistrationTaskResponse,
  | InternalFailureException
  | InvalidRequestException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartThingRegistrationTaskRequest,
  output: StartThingRegistrationTaskResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Restores the default settings for Device Defender audits for this account. Any
 * configuration data you entered is deleted and all audit checks are reset to
 * disabled.
 *
 * Requires permission to access the DeleteAccountAuditConfiguration action.
 */
export const deleteAccountAuditConfiguration: (
  input: DeleteAccountAuditConfigurationRequest,
) => effect.Effect<
  DeleteAccountAuditConfigurationResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccountAuditConfigurationRequest,
  output: DeleteAccountAuditConfigurationResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a Device Defender audit suppression.
 *
 * Requires permission to access the DeleteAuditSuppression action.
 */
export const deleteAuditSuppression: (
  input: DeleteAuditSuppressionRequest,
) => effect.Effect<
  DeleteAuditSuppressionResponse,
  | InternalFailureException
  | InvalidRequestException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAuditSuppressionRequest,
  output: DeleteAuditSuppressionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a Device Defender detect custom metric.
 *
 * Requires permission to access the DeleteCustomMetric action.
 *
 * Before you can delete a custom metric, you must first remove the custom metric from all
 * security profiles it's a part of.
 * The
 * security
 * profile associated with the custom metric can be found using the ListSecurityProfiles
 * API with `metricName` set to your custom metric name.
 */
export const deleteCustomMetric: (
  input: DeleteCustomMetricRequest,
) => effect.Effect<
  DeleteCustomMetricResponse,
  | InternalFailureException
  | InvalidRequestException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCustomMetricRequest,
  output: DeleteCustomMetricResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Removes the specified dimension from your Amazon Web Services accounts.
 *
 * Requires permission to access the DeleteDimension action.
 */
export const deleteDimension: (
  input: DeleteDimensionRequest,
) => effect.Effect<
  DeleteDimensionResponse,
  | InternalFailureException
  | InvalidRequestException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDimensionRequest,
  output: DeleteDimensionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the specified job template.
 */
export const deleteJobTemplate: (
  input: DeleteJobTemplateRequest,
) => effect.Effect<
  DeleteJobTemplateResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteJobTemplateRequest,
  output: DeleteJobTemplateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a defined mitigation action from your Amazon Web Services accounts.
 *
 * Requires permission to access the DeleteMitigationAction action.
 */
export const deleteMitigationAction: (
  input: DeleteMitigationActionRequest,
) => effect.Effect<
  DeleteMitigationActionResponse,
  | InternalFailureException
  | InvalidRequestException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMitigationActionRequest,
  output: DeleteMitigationActionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a scheduled audit.
 *
 * Requires permission to access the DeleteScheduledAudit action.
 */
export const deleteScheduledAudit: (
  input: DeleteScheduledAuditRequest,
) => effect.Effect<
  DeleteScheduledAuditResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteScheduledAuditRequest,
  output: DeleteScheduledAuditResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Disassociates a Device Defender security profile from a thing group or from this account.
 *
 * Requires permission to access the DetachSecurityProfile action.
 */
export const detachSecurityProfile: (
  input: DetachSecurityProfileRequest,
) => effect.Effect<
  DetachSecurityProfileResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachSecurityProfileRequest,
  output: DetachSecurityProfileResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Set a verification state and provide a description of that verification state on a violation (detect alarm).
 */
export const putVerificationStateOnViolation: (
  input: PutVerificationStateOnViolationRequest,
) => effect.Effect<
  PutVerificationStateOnViolationResponse,
  | InternalFailureException
  | InvalidRequestException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutVerificationStateOnViolationRequest,
  output: PutVerificationStateOnViolationResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Removes the given thing from the billing group.
 *
 * Requires permission to access the RemoveThingFromBillingGroup action.
 *
 * This call is asynchronous. It might take several seconds for the detachment to propagate.
 */
export const removeThingFromBillingGroup: (
  input: RemoveThingFromBillingGroupRequest,
) => effect.Effect<
  RemoveThingFromBillingGroupResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveThingFromBillingGroupRequest,
  output: RemoveThingFromBillingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Remove the specified thing from the specified group.
 *
 * You must specify either a `thingGroupArn` or a
 * `thingGroupName` to identify the thing group and
 * either a `thingArn` or a `thingName` to
 * identify the thing to remove from the thing group.
 *
 * Requires permission to access the RemoveThingFromThingGroup action.
 */
export const removeThingFromThingGroup: (
  input: RemoveThingFromThingGroupRequest,
) => effect.Effect<
  RemoveThingFromThingGroupResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveThingFromThingGroupRequest,
  output: RemoveThingFromThingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Cancels a bulk thing provisioning task.
 *
 * Requires permission to access the StopThingRegistrationTask action.
 */
export const stopThingRegistrationTask: (
  input: StopThingRegistrationTaskRequest,
) => effect.Effect<
  StopThingRegistrationTaskResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopThingRegistrationTaskRequest,
  output: StopThingRegistrationTaskResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Removes the given tags (metadata) from the resource.
 *
 * Requires permission to access the UntagResource action.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Configures or reconfigures the Device Defender audit settings for this account.
 * Settings include how audit notifications are sent and which audit checks are
 * enabled or disabled.
 *
 * Requires permission to access the UpdateAccountAuditConfiguration action.
 */
export const updateAccountAuditConfiguration: (
  input: UpdateAccountAuditConfigurationRequest,
) => effect.Effect<
  UpdateAccountAuditConfigurationResponse,
  | InternalFailureException
  | InvalidRequestException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccountAuditConfigurationRequest,
  output: UpdateAccountAuditConfigurationResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Updates a Device Defender audit suppression.
 */
export const updateAuditSuppression: (
  input: UpdateAuditSuppressionRequest,
) => effect.Effect<
  UpdateAuditSuppressionResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAuditSuppressionRequest,
  output: UpdateAuditSuppressionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the event configurations.
 *
 * Requires permission to access the UpdateEventConfigurations action.
 */
export const updateEventConfigurations: (
  input: UpdateEventConfigurationsRequest,
) => effect.Effect<
  UpdateEventConfigurationsResponse,
  | InternalFailureException
  | InvalidRequestException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEventConfigurationsRequest,
  output: UpdateEventConfigurationsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Updates the groups to which the thing belongs.
 *
 * Requires permission to access the UpdateThingGroupsForThing action.
 */
export const updateThingGroupsForThing: (
  input: UpdateThingGroupsForThingRequest,
) => effect.Effect<
  UpdateThingGroupsForThingResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateThingGroupsForThingRequest,
  output: UpdateThingGroupsForThingResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Adds a thing to a billing group.
 *
 * Requires permission to access the AddThingToBillingGroup action.
 */
export const addThingToBillingGroup: (
  input: AddThingToBillingGroupRequest,
) => effect.Effect<
  AddThingToBillingGroupResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddThingToBillingGroupRequest,
  output: AddThingToBillingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Adds a thing to a thing group.
 *
 * Requires permission to access the AddThingToThingGroup action.
 */
export const addThingToThingGroup: (
  input: AddThingToThingGroupRequest,
) => effect.Effect<
  AddThingToThingGroupResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddThingToThingGroupRequest,
  output: AddThingToThingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Cancels a mitigation action task that is in progress. If the task
 * is not
 * in progress, an InvalidRequestException occurs.
 *
 * Requires permission to access the CancelAuditMitigationActionsTask action.
 */
export const cancelAuditMitigationActionsTask: (
  input: CancelAuditMitigationActionsTaskRequest,
) => effect.Effect<
  CancelAuditMitigationActionsTaskResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelAuditMitigationActionsTaskRequest,
  output: CancelAuditMitigationActionsTaskResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Cancels an audit that is in progress. The audit can be either scheduled or on demand. If the audit isn't in progress, an "InvalidRequestException" occurs.
 *
 * Requires permission to access the CancelAuditTask action.
 */
export const cancelAuditTask: (
  input: CancelAuditTaskRequest,
) => effect.Effect<
  CancelAuditTaskResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelAuditTaskRequest,
  output: CancelAuditTaskResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Cancels a Device Defender ML Detect mitigation action.
 *
 * Requires permission to access the CancelDetectMitigationActionsTask action.
 */
export const cancelDetectMitigationActionsTask: (
  input: CancelDetectMitigationActionsTaskRequest,
) => effect.Effect<
  CancelDetectMitigationActionsTaskResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelDetectMitigationActionsTaskRequest,
  output: CancelDetectMitigationActionsTaskResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a provisioning template.
 *
 * Requires permission to access the DeleteProvisioningTemplate action.
 */
export const deleteProvisioningTemplate: (
  input: DeleteProvisioningTemplateRequest,
) => effect.Effect<
  DeleteProvisioningTemplateResponse,
  | ConflictingResourceUpdateException
  | DeleteConflictException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProvisioningTemplateRequest,
  output: DeleteProvisioningTemplateResponse,
  errors: [
    ConflictingResourceUpdateException,
    DeleteConflictException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a provisioning template version.
 *
 * Requires permission to access the DeleteProvisioningTemplateVersion action.
 */
export const deleteProvisioningTemplateVersion: (
  input: DeleteProvisioningTemplateVersionRequest,
) => effect.Effect<
  DeleteProvisioningTemplateVersionResponse,
  | ConflictingResourceUpdateException
  | DeleteConflictException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProvisioningTemplateVersionRequest,
  output: DeleteProvisioningTemplateVersionResponse,
  errors: [
    ConflictingResourceUpdateException,
    DeleteConflictException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about a Device Defender audit suppression.
 */
export const describeAuditSuppression: (
  input: DescribeAuditSuppressionRequest,
) => effect.Effect<
  DescribeAuditSuppressionResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAuditSuppressionRequest,
  output: DescribeAuditSuppressionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets information about a Device Defender detect custom metric.
 *
 * Requires permission to access the DescribeCustomMetric action.
 */
export const describeCustomMetric: (
  input: DescribeCustomMetricRequest,
) => effect.Effect<
  DescribeCustomMetricResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCustomMetricRequest,
  output: DescribeCustomMetricResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Provides details about a dimension that is defined in your Amazon Web Services accounts.
 *
 * Requires permission to access the DescribeDimension action.
 */
export const describeDimension: (
  input: DescribeDimensionRequest,
) => effect.Effect<
  DescribeDimensionResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDimensionRequest,
  output: DescribeDimensionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns information about a job template.
 */
export const describeJobTemplate: (
  input: DescribeJobTemplateRequest,
) => effect.Effect<
  DescribeJobTemplateResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeJobTemplateRequest,
  output: DescribeJobTemplateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets information about a mitigation action.
 *
 * Requires permission to access the DescribeMitigationAction action.
 */
export const describeMitigationAction: (
  input: DescribeMitigationActionRequest,
) => effect.Effect<
  DescribeMitigationActionResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeMitigationActionRequest,
  output: DescribeMitigationActionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns information about a provisioning template.
 *
 * Requires permission to access the DescribeProvisioningTemplate action.
 */
export const describeProvisioningTemplate: (
  input: DescribeProvisioningTemplateRequest,
) => effect.Effect<
  DescribeProvisioningTemplateResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProvisioningTemplateRequest,
  output: DescribeProvisioningTemplateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Returns information about a provisioning template version.
 *
 * Requires permission to access the DescribeProvisioningTemplateVersion action.
 */
export const describeProvisioningTemplateVersion: (
  input: DescribeProvisioningTemplateVersionRequest,
) => effect.Effect<
  DescribeProvisioningTemplateVersionResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProvisioningTemplateVersionRequest,
  output: DescribeProvisioningTemplateVersionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about a scheduled audit.
 *
 * Requires permission to access the DescribeScheduledAudit action.
 */
export const describeScheduledAudit: (
  input: DescribeScheduledAuditRequest,
) => effect.Effect<
  DescribeScheduledAuditResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeScheduledAuditRequest,
  output: DescribeScheduledAuditResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets information about a Device Defender security profile.
 *
 * Requires permission to access the DescribeSecurityProfile action.
 */
export const describeSecurityProfile: (
  input: DescribeSecurityProfileRequest,
) => effect.Effect<
  DescribeSecurityProfileResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSecurityProfileRequest,
  output: DescribeSecurityProfileResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes a bulk thing provisioning task.
 *
 * Requires permission to access the DescribeThingRegistrationTask action.
 */
export const describeThingRegistrationTask: (
  input: DescribeThingRegistrationTaskRequest,
) => effect.Effect<
  DescribeThingRegistrationTaskResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeThingRegistrationTaskRequest,
  output: DescribeThingRegistrationTaskResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the tags (metadata) you have assigned to the resource.
 *
 * Requires permission to access the ListTagsForResource action.
 */
export const listTagsForResource: {
  (
    input: ListTagsForResourceRequest,
  ): effect.Effect<
    ListTagsForResourceResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTagsForResourceRequest,
  ) => stream.Stream<
    ListTagsForResourceResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTagsForResourceRequest,
  ) => stream.Stream<
    Tag,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "tags",
  } as const,
}));
/**
 * List the thing groups in your account.
 *
 * Requires permission to access the ListThingGroups action.
 */
export const listThingGroups: {
  (
    input: ListThingGroupsRequest,
  ): effect.Effect<
    ListThingGroupsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListThingGroupsRequest,
  ) => stream.Stream<
    ListThingGroupsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListThingGroupsRequest,
  ) => stream.Stream<
    GroupNameAndArn,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListThingGroupsRequest,
  output: ListThingGroupsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "thingGroups",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List the thing groups to which the specified thing belongs.
 *
 * Requires permission to access the ListThingGroupsForThing action.
 */
export const listThingGroupsForThing: {
  (
    input: ListThingGroupsForThingRequest,
  ): effect.Effect<
    ListThingGroupsForThingResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListThingGroupsForThingRequest,
  ) => stream.Stream<
    ListThingGroupsForThingResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListThingGroupsForThingRequest,
  ) => stream.Stream<
    GroupNameAndArn,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListThingGroupsForThingRequest,
  output: ListThingGroupsForThingResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "thingGroups",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the things you have added to the given billing group.
 *
 * Requires permission to access the ListThingsInBillingGroup action.
 */
export const listThingsInBillingGroup: {
  (
    input: ListThingsInBillingGroupRequest,
  ): effect.Effect<
    ListThingsInBillingGroupResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListThingsInBillingGroupRequest,
  ) => stream.Stream<
    ListThingsInBillingGroupResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListThingsInBillingGroupRequest,
  ) => stream.Stream<
    ThingName,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListThingsInBillingGroupRequest,
  output: ListThingsInBillingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "things",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the things in the specified group.
 *
 * Requires permission to access the ListThingsInThingGroup action.
 */
export const listThingsInThingGroup: {
  (
    input: ListThingsInThingGroupRequest,
  ): effect.Effect<
    ListThingsInThingGroupResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListThingsInThingGroupRequest,
  ) => stream.Stream<
    ListThingsInThingGroupResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListThingsInThingGroupRequest,
  ) => stream.Stream<
    ThingName,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListThingsInThingGroupRequest,
  output: ListThingsInThingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "things",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates a
 * Device Defender detect custom metric.
 *
 * Requires permission to access the UpdateCustomMetric action.
 */
export const updateCustomMetric: (
  input: UpdateCustomMetricRequest,
) => effect.Effect<
  UpdateCustomMetricResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCustomMetricRequest,
  output: UpdateCustomMetricResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the definition for a dimension. You
 * cannot
 * change the type of a dimension after
 * it is created (you can delete it and
 * recreate
 * it).
 *
 * Requires permission to access the UpdateDimension action.
 */
export const updateDimension: (
  input: UpdateDimensionRequest,
) => effect.Effect<
  UpdateDimensionResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDimensionRequest,
  output: UpdateDimensionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the definition for the specified mitigation action.
 *
 * Requires permission to access the UpdateMitigationAction action.
 */
export const updateMitigationAction: (
  input: UpdateMitigationActionRequest,
) => effect.Effect<
  UpdateMitigationActionResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMitigationActionRequest,
  output: UpdateMitigationActionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates a scheduled audit, including which checks are performed and
 * how often the audit takes place.
 *
 * Requires permission to access the UpdateScheduledAudit action.
 */
export const updateScheduledAudit: (
  input: UpdateScheduledAuditRequest,
) => effect.Effect<
  UpdateScheduledAuditResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateScheduledAuditRequest,
  output: UpdateScheduledAuditResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates an X.509 certificate using the specified certificate signing
 * request.
 *
 * Requires permission to access the CreateCertificateFromCsr action.
 *
 * The CSR must include a public key that is either an RSA key with a length of at least
 * 2048 bits or an ECC key from NIST P-256, NIST P-384, or NIST P-521 curves. For supported
 * certificates, consult Certificate signing algorithms supported by IoT.
 *
 * Reusing the same certificate signing request (CSR)
 * results in a distinct certificate.
 *
 * You can create multiple certificates in a batch by creating a directory, copying
 * multiple `.csr` files into that directory, and then specifying that directory on the command
 * line. The following commands show how to create a batch of certificates given a batch of
 * CSRs. In the following commands, we assume that a set of CSRs are located inside of the
 * directory my-csr-directory:
 *
 * On Linux and OS X, the command is:
 *
 * $ ls my-csr-directory/ | xargs -I {} aws iot create-certificate-from-csr
 * --certificate-signing-request file://my-csr-directory/{}
 *
 * This command lists all of the CSRs in my-csr-directory and pipes each CSR file name
 * to the `aws iot create-certificate-from-csr` Amazon Web Services CLI command to create a certificate for
 * the corresponding CSR.
 *
 * You can also run the `aws iot create-certificate-from-csr` part of the
 * command in parallel to speed up the certificate creation process:
 *
 * $ ls my-csr-directory/ | xargs -P 10 -I {} aws iot create-certificate-from-csr
 * --certificate-signing-request file://my-csr-directory/{}
 *
 * On Windows PowerShell, the command to create certificates for all CSRs in
 * my-csr-directory is:
 *
 * > ls -Name my-csr-directory | %{aws iot create-certificate-from-csr
 * --certificate-signing-request file://my-csr-directory/$_}
 *
 * On a Windows command prompt, the command to create certificates for all CSRs in
 * my-csr-directory is:
 *
 * > forfiles /p my-csr-directory /c "cmd /c aws iot create-certificate-from-csr
 * --certificate-signing-request file://@path"
 */
export const createCertificateFromCsr: (
  input: CreateCertificateFromCsrRequest,
) => effect.Effect<
  CreateCertificateFromCsrResponse,
  | InternalFailureException
  | InvalidRequestException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCertificateFromCsrRequest,
  output: CreateCertificateFromCsrResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a job template.
 *
 * Requires permission to access the CreateJobTemplate action.
 */
export const createJobTemplate: (
  input: CreateJobTemplateRequest,
) => effect.Effect<
  CreateJobTemplateResponse,
  | ConflictException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateJobTemplateRequest,
  output: CreateJobTemplateResponse,
  errors: [
    ConflictException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a 2048-bit RSA key pair and issues an X.509 certificate using the issued
 * public key. You can also call `CreateKeysAndCertificate` over MQTT from a
 * device, for more information, see Provisioning MQTT API.
 *
 * **Note** This is the only time IoT issues the private key
 * for this certificate, so it is important to keep it in a secure location.
 *
 * Requires permission to access the CreateKeysAndCertificate action.
 */
export const createKeysAndCertificate: (
  input: CreateKeysAndCertificateRequest,
) => effect.Effect<
  CreateKeysAndCertificateResponse,
  | InternalFailureException
  | InvalidRequestException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKeysAndCertificateRequest,
  output: CreateKeysAndCertificateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Create a thing group.
 *
 * This is a control plane operation. See Authorization for
 * information about authorizing control plane actions.
 *
 * If the `ThingGroup` that you create has the exact same attributes as an existing
 * `ThingGroup`, you will get a 200 success response.
 *
 * Requires permission to access the CreateThingGroup action.
 */
export const createThingGroup: (
  input: CreateThingGroupRequest,
) => effect.Effect<
  CreateThingGroupResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceAlreadyExistsException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateThingGroupRequest,
  output: CreateThingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Updates values stored in the domain configuration. Domain configurations for default
 * endpoints can't be updated.
 *
 * Requires permission to access the UpdateDomainConfiguration action.
 */
export const updateDomainConfiguration: (
  input: UpdateDomainConfigurationRequest,
) => effect.Effect<
  UpdateDomainConfigurationResponse,
  | CertificateValidationException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDomainConfigurationRequest,
  output: UpdateDomainConfigurationResponse,
  errors: [
    CertificateValidationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a domain configuration.
 *
 * Requires permission to access the CreateDomainConfiguration action.
 */
export const createDomainConfiguration: (
  input: CreateDomainConfigurationRequest,
) => effect.Effect<
  CreateDomainConfigurationResponse,
  | CertificateValidationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDomainConfigurationRequest,
  output: CreateDomainConfigurationResponse,
  errors: [
    CertificateValidationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Registers a device certificate with IoT in the same certificate mode as the signing CA. If you have more than one CA certificate that has the same subject field, you must
 * specify the CA certificate that was used to sign the device certificate being
 * registered.
 *
 * Requires permission to access the RegisterCertificate action.
 */
export const registerCertificate: (
  input: RegisterCertificateRequest,
) => effect.Effect<
  RegisterCertificateResponse,
  | CertificateConflictException
  | CertificateStateException
  | CertificateValidationException
  | InternalFailureException
  | InvalidRequestException
  | ResourceAlreadyExistsException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterCertificateRequest,
  output: RegisterCertificateResponse,
  errors: [
    CertificateConflictException,
    CertificateStateException,
    CertificateValidationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a dynamic thing group.
 *
 * Requires permission to access the CreateDynamicThingGroup action.
 */
export const createDynamicThingGroup: (
  input: CreateDynamicThingGroupRequest,
) => effect.Effect<
  CreateDynamicThingGroupResponse,
  | InternalFailureException
  | InvalidQueryException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDynamicThingGroupRequest,
  output: CreateDynamicThingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidQueryException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns the approximate count of unique values that match the query.
 *
 * Requires permission to access the GetCardinality action.
 */
export const getCardinality: (
  input: GetCardinalityRequest,
) => effect.Effect<
  GetCardinalityResponse,
  | IndexNotReadyException
  | InternalFailureException
  | InvalidAggregationException
  | InvalidQueryException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCardinalityRequest,
  output: GetCardinalityResponse,
  errors: [
    IndexNotReadyException,
    InternalFailureException,
    InvalidAggregationException,
    InvalidQueryException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a fleet metric.
 *
 * Requires permission to access the CreateFleetMetric action.
 */
export const createFleetMetric: (
  input: CreateFleetMetricRequest,
) => effect.Effect<
  CreateFleetMetricResponse,
  | IndexNotReadyException
  | InternalFailureException
  | InvalidAggregationException
  | InvalidQueryException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFleetMetricRequest,
  output: CreateFleetMetricResponse,
  errors: [
    IndexNotReadyException,
    InternalFailureException,
    InvalidAggregationException,
    InvalidQueryException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Groups the aggregated values that match the query into percentile groupings. The default
 * percentile groupings are: 1,5,25,50,75,95,99, although you can specify your own
 * when you call `GetPercentiles`. This function returns a value for each
 * percentile group specified (or the default percentile groupings). The percentile group
 * "1" contains the aggregated field value that occurs in approximately one percent of the
 * values that match the query. The percentile group "5" contains the aggregated field value
 * that occurs in approximately five percent of the values that match the query, and so on.
 * The result is an approximation, the more values that match the query, the more accurate
 * the percentile values.
 *
 * Requires permission to access the GetPercentiles action.
 */
export const getPercentiles: (
  input: GetPercentilesRequest,
) => effect.Effect<
  GetPercentilesResponse,
  | IndexNotReadyException
  | InternalFailureException
  | InvalidAggregationException
  | InvalidQueryException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPercentilesRequest,
  output: GetPercentilesResponse,
  errors: [
    IndexNotReadyException,
    InternalFailureException,
    InvalidAggregationException,
    InvalidQueryException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Returns the count, average, sum, minimum, maximum, sum of squares, variance,
 * and standard deviation for the specified aggregated field. If the aggregation field is of type
 * `String`, only the count statistic is returned.
 *
 * Requires permission to access the GetStatistics action.
 */
export const getStatistics: (
  input: GetStatisticsRequest,
) => effect.Effect<
  GetStatisticsResponse,
  | IndexNotReadyException
  | InternalFailureException
  | InvalidAggregationException
  | InvalidQueryException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStatisticsRequest,
  output: GetStatisticsResponse,
  errors: [
    IndexNotReadyException,
    InternalFailureException,
    InvalidAggregationException,
    InvalidQueryException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a job execution.
 *
 * Requires permission to access the DeleteJobExecution action.
 */
export const deleteJobExecution: (
  input: DeleteJobExecutionRequest,
) => effect.Effect<
  DeleteJobExecutionResponse,
  | InvalidRequestException
  | InvalidStateTransitionException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteJobExecutionRequest,
  output: DeleteJobExecutionResponse,
  errors: [
    InvalidRequestException,
    InvalidStateTransitionException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Gets summary information about a domain configuration.
 *
 * Requires permission to access the DescribeDomainConfiguration action.
 */
export const describeDomainConfiguration: (
  input: DescribeDomainConfigurationRequest,
) => effect.Effect<
  DescribeDomainConfigurationResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDomainConfigurationRequest,
  output: DescribeDomainConfigurationResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Describes a role alias.
 *
 * Requires permission to access the DescribeRoleAlias action.
 */
export const describeRoleAlias: (
  input: DescribeRoleAliasRequest,
) => effect.Effect<
  DescribeRoleAliasResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRoleAliasRequest,
  output: DescribeRoleAliasResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about a stream.
 *
 * Requires permission to access the DescribeStream action.
 */
export const describeStream: (
  input: DescribeStreamRequest,
) => effect.Effect<
  DescribeStreamResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStreamRequest,
  output: DescribeStreamResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about the specified thing type.
 *
 * Requires permission to access the DescribeThingType action.
 */
export const describeThingType: (
  input: DescribeThingTypeRequest,
) => effect.Effect<
  DescribeThingTypeResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeThingTypeRequest,
  output: DescribeThingTypeResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets a list of the policies that have an effect on the authorization behavior of the
 * specified device when it connects to the IoT device gateway.
 *
 * Requires permission to access the GetEffectivePolicies action.
 */
export const getEffectivePolicies: (
  input: GetEffectivePoliciesRequest,
) => effect.Effect<
  GetEffectivePoliciesResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEffectivePoliciesRequest,
  output: GetEffectivePoliciesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about the rule.
 *
 * Requires permission to access the GetTopicRule action.
 */
export const getTopicRule: (
  input: GetTopicRuleRequest,
) => effect.Effect<
  GetTopicRuleResponse,
  | InternalException
  | InvalidRequestException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTopicRuleRequest,
  output: GetTopicRuleResponse,
  errors: [
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the policies attached to the specified thing group.
 *
 * Requires permission to access the ListAttachedPolicies action.
 */
export const listAttachedPolicies: {
  (
    input: ListAttachedPoliciesRequest,
  ): effect.Effect<
    ListAttachedPoliciesResponse,
    | InternalFailureException
    | InvalidRequestException
    | LimitExceededException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAttachedPoliciesRequest,
  ) => stream.Stream<
    ListAttachedPoliciesResponse,
    | InternalFailureException
    | InvalidRequestException
    | LimitExceededException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAttachedPoliciesRequest,
  ) => stream.Stream<
    Policy,
    | InternalFailureException
    | InvalidRequestException
    | LimitExceededException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAttachedPoliciesRequest,
  output: ListAttachedPoliciesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "marker",
    outputToken: "nextMarker",
    items: "policies",
    pageSize: "pageSize",
  } as const,
}));
/**
 * Lists the authorizers registered in your account.
 *
 * Requires permission to access the ListAuthorizers action.
 */
export const listAuthorizers: {
  (
    input: ListAuthorizersRequest,
  ): effect.Effect<
    ListAuthorizersResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAuthorizersRequest,
  ) => stream.Stream<
    ListAuthorizersResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAuthorizersRequest,
  ) => stream.Stream<
    AuthorizerSummary,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAuthorizersRequest,
  output: ListAuthorizersResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "marker",
    outputToken: "nextMarker",
    items: "authorizers",
    pageSize: "pageSize",
  } as const,
}));
/**
 * Lists the CA certificates registered for your Amazon Web Services account.
 *
 * The results are paginated with a default page size of 25. You can use the returned
 * marker to retrieve additional results.
 *
 * Requires permission to access the ListCACertificates action.
 */
export const listCACertificates: {
  (
    input: ListCACertificatesRequest,
  ): effect.Effect<
    ListCACertificatesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCACertificatesRequest,
  ) => stream.Stream<
    ListCACertificatesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCACertificatesRequest,
  ) => stream.Stream<
    CACertificate,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCACertificatesRequest,
  output: ListCACertificatesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "marker",
    outputToken: "nextMarker",
    items: "certificates",
    pageSize: "pageSize",
  } as const,
}));
/**
 * Lists all your certificate providers in your Amazon Web Services account.
 *
 * Requires permission to access the ListCertificateProviders action.
 */
export const listCertificateProviders: (
  input: ListCertificateProvidersRequest,
) => effect.Effect<
  ListCertificateProvidersResponse,
  | InternalFailureException
  | InvalidRequestException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCertificateProvidersRequest,
  output: ListCertificateProvidersResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the certificates registered in your Amazon Web Services account.
 *
 * The results are paginated with a default page size of 25. You can use the returned
 * marker to retrieve additional results.
 *
 * Requires permission to access the ListCertificates action.
 */
export const listCertificates: {
  (
    input: ListCertificatesRequest,
  ): effect.Effect<
    ListCertificatesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCertificatesRequest,
  ) => stream.Stream<
    ListCertificatesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCertificatesRequest,
  ) => stream.Stream<
    Certificate,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCertificatesRequest,
  output: ListCertificatesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "marker",
    outputToken: "nextMarker",
    items: "certificates",
    pageSize: "pageSize",
  } as const,
}));
/**
 * Gets a list of domain configurations for the user. This list is sorted
 * alphabetically by domain configuration name.
 *
 * Requires permission to access the ListDomainConfigurations action.
 */
export const listDomainConfigurations: {
  (
    input: ListDomainConfigurationsRequest,
  ): effect.Effect<
    ListDomainConfigurationsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDomainConfigurationsRequest,
  ) => stream.Stream<
    ListDomainConfigurationsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDomainConfigurationsRequest,
  ) => stream.Stream<
    DomainConfigurationSummary,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDomainConfigurationsRequest,
  output: ListDomainConfigurationsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "marker",
    outputToken: "nextMarker",
    items: "domainConfigurations",
    pageSize: "pageSize",
  } as const,
}));
/**
 * Lists all your fleet metrics.
 *
 * Requires permission to access the ListFleetMetrics action.
 */
export const listFleetMetrics: {
  (
    input: ListFleetMetricsRequest,
  ): effect.Effect<
    ListFleetMetricsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFleetMetricsRequest,
  ) => stream.Stream<
    ListFleetMetricsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFleetMetricsRequest,
  ) => stream.Stream<
    FleetMetricNameAndArn,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFleetMetricsRequest,
  output: ListFleetMetricsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "fleetMetrics",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists OTA updates.
 *
 * Requires permission to access the ListOTAUpdates action.
 */
export const listOTAUpdates: {
  (
    input: ListOTAUpdatesRequest,
  ): effect.Effect<
    ListOTAUpdatesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOTAUpdatesRequest,
  ) => stream.Stream<
    ListOTAUpdatesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOTAUpdatesRequest,
  ) => stream.Stream<
    OTAUpdateSummary,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOTAUpdatesRequest,
  output: ListOTAUpdatesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "otaUpdates",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists certificates that are being transferred but not yet accepted.
 *
 * Requires permission to access the ListOutgoingCertificates action.
 */
export const listOutgoingCertificates: {
  (
    input: ListOutgoingCertificatesRequest,
  ): effect.Effect<
    ListOutgoingCertificatesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOutgoingCertificatesRequest,
  ) => stream.Stream<
    ListOutgoingCertificatesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOutgoingCertificatesRequest,
  ) => stream.Stream<
    OutgoingCertificate,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOutgoingCertificatesRequest,
  output: ListOutgoingCertificatesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "marker",
    outputToken: "nextMarker",
    items: "outgoingCertificates",
    pageSize: "pageSize",
  } as const,
}));
/**
 * Lists the versions of the specified policy and identifies the default
 * version.
 *
 * Requires permission to access the ListPolicyVersions action.
 */
export const listPolicyVersions: (
  input: ListPolicyVersionsRequest,
) => effect.Effect<
  ListPolicyVersionsResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPolicyVersionsRequest,
  output: ListPolicyVersionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the things associated with the specified principal. A principal can be an X.509
 * certificate or an Amazon Cognito ID.
 *
 * Requires permission to access the ListPrincipalThings action.
 */
export const listPrincipalThingsV2: {
  (
    input: ListPrincipalThingsV2Request,
  ): effect.Effect<
    ListPrincipalThingsV2Response,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPrincipalThingsV2Request,
  ) => stream.Stream<
    ListPrincipalThingsV2Response,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPrincipalThingsV2Request,
  ) => stream.Stream<
    PrincipalThingObject,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPrincipalThingsV2Request,
  output: ListPrincipalThingsV2Response,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "principalThingObjects",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the provisioning templates in your Amazon Web Services account.
 *
 * Requires permission to access the ListProvisioningTemplates action.
 */
export const listProvisioningTemplates: {
  (
    input: ListProvisioningTemplatesRequest,
  ): effect.Effect<
    ListProvisioningTemplatesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProvisioningTemplatesRequest,
  ) => stream.Stream<
    ListProvisioningTemplatesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProvisioningTemplatesRequest,
  ) => stream.Stream<
    ProvisioningTemplateSummary,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProvisioningTemplatesRequest,
  output: ListProvisioningTemplatesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "templates",
    pageSize: "maxResults",
  } as const,
}));
/**
 * A list of provisioning template versions.
 *
 * Requires permission to access the ListProvisioningTemplateVersions action.
 */
export const listProvisioningTemplateVersions: {
  (
    input: ListProvisioningTemplateVersionsRequest,
  ): effect.Effect<
    ListProvisioningTemplateVersionsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProvisioningTemplateVersionsRequest,
  ) => stream.Stream<
    ListProvisioningTemplateVersionsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProvisioningTemplateVersionsRequest,
  ) => stream.Stream<
    ProvisioningTemplateVersionSummary,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProvisioningTemplateVersionsRequest,
  output: ListProvisioningTemplateVersionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "versions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all of the streams in your Amazon Web Services account.
 *
 * Requires permission to access the ListStreams action.
 */
export const listStreams: {
  (
    input: ListStreamsRequest,
  ): effect.Effect<
    ListStreamsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStreamsRequest,
  ) => stream.Stream<
    ListStreamsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStreamsRequest,
  ) => stream.Stream<
    StreamSummary,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStreamsRequest,
  output: ListStreamsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "streams",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the principals associated with the specified thing. A principal can be an X.509
 * certificate or an Amazon Cognito ID.
 *
 * Requires permission to access the ListThingPrincipals action.
 */
export const listThingPrincipalsV2: {
  (
    input: ListThingPrincipalsV2Request,
  ): effect.Effect<
    ListThingPrincipalsV2Response,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListThingPrincipalsV2Request,
  ) => stream.Stream<
    ListThingPrincipalsV2Response,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListThingPrincipalsV2Request,
  ) => stream.Stream<
    ThingPrincipalObject,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListThingPrincipalsV2Request,
  output: ListThingPrincipalsV2Response,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "thingPrincipalObjects",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists your things. Use the **attributeName** and **attributeValue** parameters to filter your things. For example,
 * calling `ListThings` with attributeName=Color and attributeValue=Red
 * retrieves all things in the registry that contain an attribute **Color** with the value **Red**. For more
 * information, see List Things from the Amazon Web Services IoT Core Developer
 * Guide.
 *
 * Requires permission to access the ListThings action.
 *
 * You will not be charged for calling this API if an `Access denied` error is returned. You will also not be charged if no attributes or pagination token was provided in request and no pagination token and no results were returned.
 */
export const listThings: {
  (
    input: ListThingsRequest,
  ): effect.Effect<
    ListThingsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListThingsRequest,
  ) => stream.Stream<
    ListThingsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListThingsRequest,
  ) => stream.Stream<
    ThingAttribute,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListThingsRequest,
  output: ListThingsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "things",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the existing thing types.
 *
 * Requires permission to access the ListThingTypes action.
 */
export const listThingTypes: {
  (
    input: ListThingTypesRequest,
  ): effect.Effect<
    ListThingTypesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListThingTypesRequest,
  ) => stream.Stream<
    ListThingTypesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListThingTypesRequest,
  ) => stream.Stream<
    ThingTypeDefinition,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListThingTypesRequest,
  output: ListThingTypesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "thingTypes",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the rules for the specific topic.
 *
 * Requires permission to access the ListTopicRules action.
 */
export const listTopicRules: {
  (
    input: ListTopicRulesRequest,
  ): effect.Effect<
    ListTopicRulesResponse,
    | InternalException
    | InvalidRequestException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTopicRulesRequest,
  ) => stream.Stream<
    ListTopicRulesResponse,
    | InternalException
    | InvalidRequestException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTopicRulesRequest,
  ) => stream.Stream<
    TopicRuleListItem,
    | InternalException
    | InvalidRequestException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTopicRulesRequest,
  output: ListTopicRulesResponse,
  errors: [
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "rules",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Register a certificate that does not have a certificate authority (CA).
 * For supported certificates, consult
 * Certificate signing algorithms supported by IoT.
 */
export const registerCertificateWithoutCA: (
  input: RegisterCertificateWithoutCARequest,
) => effect.Effect<
  RegisterCertificateWithoutCAResponse,
  | CertificateStateException
  | CertificateValidationException
  | InternalFailureException
  | InvalidRequestException
  | ResourceAlreadyExistsException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterCertificateWithoutCARequest,
  output: RegisterCertificateWithoutCAResponse,
  errors: [
    CertificateStateException,
    CertificateValidationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Defines an action that can be applied to audit findings by using StartAuditMitigationActionsTask. Only certain types of mitigation actions can be applied to specific check names.
 * For more information, see Mitigation actions. Each mitigation action can apply only one type of change.
 *
 * Requires permission to access the CreateMitigationAction action.
 */
export const createMitigationAction: (
  input: CreateMitigationActionRequest,
) => effect.Effect<
  CreateMitigationActionResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMitigationActionRequest,
  output: CreateMitigationActionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Creates a thing record in the registry. If this call is made multiple times using
 * the same thing name and configuration, the call will succeed. If this call is made with
 * the same thing name but different configuration a
 * `ResourceAlreadyExistsException` is thrown.
 *
 * This is a control plane operation. See Authorization for
 * information about authorizing control plane actions.
 *
 * Requires permission to access the CreateThing action.
 */
export const createThing: (
  input: CreateThingRequest,
) => effect.Effect<
  CreateThingResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateThingRequest,
  output: CreateThingResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a topic rule destination. The destination must be confirmed prior to use.
 *
 * Requires permission to access the CreateTopicRuleDestination action.
 */
export const createTopicRuleDestination: (
  input: CreateTopicRuleDestinationRequest,
) => effect.Effect<
  CreateTopicRuleDestinationResponse,
  | ConflictingResourceUpdateException
  | InternalException
  | InvalidRequestException
  | ResourceAlreadyExistsException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTopicRuleDestinationRequest,
  output: CreateTopicRuleDestinationResponse,
  errors: [
    ConflictingResourceUpdateException,
    InternalException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a specific version from a software package.
 *
 * **Note:** All package versions must be deleted before deleting the software package.
 *
 * Requires permission to access the DeletePackageVersion action.
 */
export const deletePackage: (
  input: DeletePackageRequest,
) => effect.Effect<
  DeletePackageResponse,
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePackageRequest,
  output: DeletePackageResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
}));
/**
 * Gets information about the Device Defender audit settings for this account.
 * Settings include how audit notifications are sent and which audit checks are
 * enabled or disabled.
 *
 * Requires permission to access the DescribeAccountAuditConfiguration action.
 */
export const describeAccountAuditConfiguration: (
  input: DescribeAccountAuditConfigurationRequest,
) => effect.Effect<
  DescribeAccountAuditConfigurationResponse,
  InternalFailureException | ThrottlingException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAccountAuditConfigurationRequest,
  output: DescribeAccountAuditConfigurationResponse,
  errors: [InternalFailureException, ThrottlingException],
}));
/**
 * Gets information about a single audit finding. Properties include the reason for
 * noncompliance, the severity of the issue,
 * and the start time
 * when the audit that returned the
 * finding.
 *
 * Requires permission to access the DescribeAuditFinding action.
 */
export const describeAuditFinding: (
  input: DescribeAuditFindingRequest,
) => effect.Effect<
  DescribeAuditFindingResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAuditFindingRequest,
  output: DescribeAuditFindingResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets information about an audit mitigation task that is used to apply mitigation actions to a set of audit findings. Properties include the actions being applied, the audit checks to which they're being applied, the task status, and aggregated task statistics.
 */
export const describeAuditMitigationActionsTask: (
  input: DescribeAuditMitigationActionsTaskRequest,
) => effect.Effect<
  DescribeAuditMitigationActionsTaskResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAuditMitigationActionsTaskRequest,
  output: DescribeAuditMitigationActionsTaskResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets information about a Device Defender audit.
 *
 * Requires permission to access the DescribeAuditTask action.
 */
export const describeAuditTask: (
  input: DescribeAuditTaskRequest,
) => effect.Effect<
  DescribeAuditTaskResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAuditTaskRequest,
  output: DescribeAuditTaskResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes a registered CA certificate.
 *
 * Requires permission to access the DescribeCACertificate action.
 */
export const describeCACertificate: (
  input: DescribeCACertificateRequest,
) => effect.Effect<
  DescribeCACertificateResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCACertificateRequest,
  output: DescribeCACertificateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about the specified certificate.
 *
 * Requires permission to access the DescribeCertificate action.
 */
export const describeCertificate: (
  input: DescribeCertificateRequest,
) => effect.Effect<
  DescribeCertificateResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCertificateRequest,
  output: DescribeCertificateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about a Device Defender ML Detect mitigation action.
 *
 * Requires permission to access the DescribeDetectMitigationActionsTask action.
 */
export const describeDetectMitigationActionsTask: (
  input: DescribeDetectMitigationActionsTaskRequest,
) => effect.Effect<
  DescribeDetectMitigationActionsTaskResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDetectMitigationActionsTaskRequest,
  output: DescribeDetectMitigationActionsTaskResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes a job.
 *
 * Requires permission to access the DescribeJob action.
 */
export const describeJob: (
  input: DescribeJobRequest,
) => effect.Effect<
  DescribeJobResponse,
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeJobRequest,
  output: DescribeJobResponse,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Describes a job execution.
 *
 * Requires permission to access the DescribeJobExecution action.
 */
export const describeJobExecution: (
  input: DescribeJobExecutionRequest,
) => effect.Effect<
  DescribeJobExecutionResponse,
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeJobExecutionRequest,
  output: DescribeJobExecutionResponse,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Gets information about the specific command execution on a single device.
 */
export const getCommandExecution: (
  input: GetCommandExecutionRequest,
) => effect.Effect<
  GetCommandExecutionResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCommandExecutionRequest,
  output: GetCommandExecutionResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the indexing configuration.
 *
 * Requires permission to access the GetIndexingConfiguration action.
 */
export const getIndexingConfiguration: (
  input: GetIndexingConfigurationRequest,
) => effect.Effect<
  GetIndexingConfigurationResponse,
  | InternalFailureException
  | InvalidRequestException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIndexingConfigurationRequest,
  output: GetIndexingConfigurationResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets an OTA update.
 *
 * Requires permission to access the GetOTAUpdate action.
 */
export const getOTAUpdate: (
  input: GetOTAUpdateRequest,
) => effect.Effect<
  GetOTAUpdateResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOTAUpdateRequest,
  output: GetOTAUpdateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about a topic rule destination.
 *
 * Requires permission to access the GetTopicRuleDestination action.
 */
export const getTopicRuleDestination: (
  input: GetTopicRuleDestinationRequest,
) => effect.Effect<
  GetTopicRuleDestinationResponse,
  | InternalException
  | InvalidRequestException
  | ServiceUnavailableException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTopicRuleDestinationRequest,
  output: GetTopicRuleDestinationResponse,
  errors: [
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the active violations for a given Device Defender security profile.
 *
 * Requires permission to access the ListActiveViolations action.
 */
export const listActiveViolations: {
  (
    input: ListActiveViolationsRequest,
  ): effect.Effect<
    ListActiveViolationsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListActiveViolationsRequest,
  ) => stream.Stream<
    ListActiveViolationsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListActiveViolationsRequest,
  ) => stream.Stream<
    ActiveViolation,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListActiveViolationsRequest,
  output: ListActiveViolationsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "activeViolations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List all command executions.
 *
 * - You must provide only the `startedTimeFilter` or
 * the `completedTimeFilter` information. If you provide
 * both time filters, the API will generate an error. You can use
 * this information to retrieve a list of command executions
 * within a specific timeframe.
 *
 * - You must provide only the `commandArn` or
 * the `thingArn` information depending on whether you want
 * to list executions for a specific command or an IoT thing. If you provide
 * both fields, the API will generate an error.
 *
 * For more information about considerations for using this API, see
 * List
 * command executions in your account (CLI).
 */
export const listCommandExecutions: {
  (
    input: ListCommandExecutionsRequest,
  ): effect.Effect<
    ListCommandExecutionsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCommandExecutionsRequest,
  ) => stream.Stream<
    ListCommandExecutionsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCommandExecutionsRequest,
  ) => stream.Stream<
    CommandExecutionSummary,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCommandExecutionsRequest,
  output: ListCommandExecutionsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "commandExecutions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the job executions for a job.
 *
 * Requires permission to access the ListJobExecutionsForJob action.
 */
export const listJobExecutionsForJob: {
  (
    input: ListJobExecutionsForJobRequest,
  ): effect.Effect<
    ListJobExecutionsForJobResponse,
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobExecutionsForJobRequest,
  ) => stream.Stream<
    ListJobExecutionsForJobResponse,
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobExecutionsForJobRequest,
  ) => stream.Stream<
    JobExecutionSummaryForJob,
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListJobExecutionsForJobRequest,
  output: ListJobExecutionsForJobResponse,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "executionSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * The related resources of an Audit finding.
 * The following resources can be returned from calling this API:
 *
 * - DEVICE_CERTIFICATE
 *
 * - CA_CERTIFICATE
 *
 * - IOT_POLICY
 *
 * - COGNITO_IDENTITY_POOL
 *
 * - CLIENT_ID
 *
 * - ACCOUNT_SETTINGS
 *
 * - ROLE_ALIAS
 *
 * - IAM_ROLE
 *
 * - ISSUER_CERTIFICATE
 *
 * This API is similar to DescribeAuditFinding's RelatedResources
 * but provides pagination and is not limited to 10 resources.
 * When calling DescribeAuditFinding for the intermediate CA revoked for
 * active device certificates check, RelatedResources will not be populated. You must use this API, ListRelatedResourcesForAuditFinding, to list the certificates.
 */
export const listRelatedResourcesForAuditFinding: {
  (
    input: ListRelatedResourcesForAuditFindingRequest,
  ): effect.Effect<
    ListRelatedResourcesForAuditFindingResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRelatedResourcesForAuditFindingRequest,
  ) => stream.Stream<
    ListRelatedResourcesForAuditFindingResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRelatedResourcesForAuditFindingRequest,
  ) => stream.Stream<
    RelatedResource,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRelatedResourcesForAuditFindingRequest,
  output: ListRelatedResourcesForAuditFindingResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "relatedResources",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all the topic rule destinations in your Amazon Web Services account.
 *
 * Requires permission to access the ListTopicRuleDestinations action.
 */
export const listTopicRuleDestinations: {
  (
    input: ListTopicRuleDestinationsRequest,
  ): effect.Effect<
    ListTopicRuleDestinationsResponse,
    | InternalException
    | InvalidRequestException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTopicRuleDestinationsRequest,
  ) => stream.Stream<
    ListTopicRuleDestinationsResponse,
    | InternalException
    | InvalidRequestException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTopicRuleDestinationsRequest,
  ) => stream.Stream<
    TopicRuleDestinationSummary,
    | InternalException
    | InvalidRequestException
    | ServiceUnavailableException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTopicRuleDestinationsRequest,
  output: ListTopicRuleDestinationsResponse,
  errors: [
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "destinationSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * The query search index.
 *
 * Requires permission to access the SearchIndex action.
 */
export const searchIndex: (
  input: SearchIndexRequest,
) => effect.Effect<
  SearchIndexResponse,
  | IndexNotReadyException
  | InternalFailureException
  | InvalidQueryException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchIndexRequest,
  output: SearchIndexResponse,
  errors: [
    IndexNotReadyException,
    InternalFailureException,
    InvalidQueryException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Starts a Device Defender ML Detect mitigation actions task.
 *
 * Requires permission to access the StartDetectMitigationActionsTask action.
 */
export const startDetectMitigationActionsTask: (
  input: StartDetectMitigationActionsTaskRequest,
) => effect.Effect<
  StartDetectMitigationActionsTaskResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | TaskAlreadyExistsException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDetectMitigationActionsTaskRequest,
  output: StartDetectMitigationActionsTaskResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    TaskAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Updates a dynamic thing group.
 *
 * Requires permission to access the UpdateDynamicThingGroup action.
 */
export const updateDynamicThingGroup: (
  input: UpdateDynamicThingGroupRequest,
) => effect.Effect<
  UpdateDynamicThingGroupResponse,
  | InternalFailureException
  | InvalidQueryException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | VersionConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDynamicThingGroupRequest,
  output: UpdateDynamicThingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidQueryException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
    VersionConflictException,
  ],
}));
/**
 * Rejects a pending certificate transfer. After IoT rejects a certificate transfer,
 * the certificate status changes from **PENDING_TRANSFER** to
 * **INACTIVE**.
 *
 * To check for pending certificate transfers, call ListCertificates
 * to enumerate your certificates.
 *
 * This operation can only be called by the transfer destination. After it is called,
 * the certificate will be returned to the source's account in the INACTIVE state.
 *
 * Requires permission to access the RejectCertificateTransfer action.
 */
export const rejectCertificateTransfer: (
  input: RejectCertificateTransferRequest,
) => effect.Effect<
  RejectCertificateTransferResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | TransferAlreadyCompletedException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectCertificateTransferRequest,
  output: RejectCertificateTransferResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    TransferAlreadyCompletedException,
    UnauthorizedException,
  ],
}));
/**
 * Replaces the rule. You must specify all parameters for the new rule. Creating rules
 * is an administrator-level action. Any user who has permission to create rules will be able
 * to access data processed by the rule.
 *
 * Requires permission to access the ReplaceTopicRule action.
 */
export const replaceTopicRule: (
  input: ReplaceTopicRuleRequest,
) => effect.Effect<
  ReplaceTopicRuleResponse,
  | ConflictingResourceUpdateException
  | InternalException
  | InvalidRequestException
  | ServiceUnavailableException
  | SqlParseException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReplaceTopicRuleRequest,
  output: ReplaceTopicRuleResponse,
  errors: [
    ConflictingResourceUpdateException,
    InternalException,
    InvalidRequestException,
    ServiceUnavailableException,
    SqlParseException,
    UnauthorizedException,
  ],
}));
/**
 * Transfers the specified certificate to the specified Amazon Web Services account.
 *
 * Requires permission to access the TransferCertificate action.
 *
 * You can cancel the transfer until it is accepted by the recipient.
 *
 * No notification is sent to the transfer destination's account. The caller is responsible for notifying the transfer target.
 *
 * The certificate being transferred must not be in the `ACTIVE` state. You can use the
 * UpdateCertificate action to deactivate it.
 *
 * The certificate must not have any policies attached to it. You can use the
 * DetachPolicy action to detach them.
 *
 * **Customer managed key behavior:** When you use a customer managed key to encrypt your data and then transfer
 * the certificate to a customer in a different account using the `TransferCertificate` operation, the certificates will no longer be encrypted by their
 * customer managed key configuration. During the transfer process, certificates are encrypted using Amazon Web Services IoT Core owned keys.
 *
 * While a certificate is in the **PENDING_TRANSFER** state, it's always protected by Amazon Web Services IoT Core owned keys, regardless of the customer managed key configuration of either the source or destination account.
 *
 * Once the transfer is completed through AcceptCertificateTransfer, RejectCertificateTransfer, or
 * CancelCertificateTransfer, the certificate will be protected by the customer managed key configuration of the account that owns
 * the certificate after the transfer operation:
 *
 * - If the transfer is accepted: The certificate is encrypted by the target account's customer managed key configuration.
 *
 * - If the transfer is rejected or cancelled: The certificate is protected by the source account's customer managed key configuration.
 */
export const transferCertificate: (
  input: TransferCertificateRequest,
) => effect.Effect<
  TransferCertificateResponse,
  | CertificateStateException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | TransferConflictException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TransferCertificateRequest,
  output: TransferCertificateResponse,
  errors: [
    CertificateStateException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    TransferConflictException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a new version for an existing IoT software package.
 *
 * Requires permission to access the CreatePackageVersion and GetIndexingConfiguration actions.
 */
export const createPackageVersion: (
  input: CreatePackageVersionRequest,
) => effect.Effect<
  CreatePackageVersionResponse,
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePackageVersionRequest,
  output: CreatePackageVersionResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Associates the selected software bill of materials (SBOM) with a specific software package version.
 *
 * Requires permission to access the AssociateSbomWithPackageVersion action.
 */
export const associateSbomWithPackageVersion: (
  input: AssociateSbomWithPackageVersionRequest,
) => effect.Effect<
  AssociateSbomWithPackageVersionResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateSbomWithPackageVersionRequest,
  output: AssociateSbomWithPackageVersionResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new version of the specified IoT policy. To update a policy, create a
 * new policy version. A managed policy can have up to five versions. If the policy has five
 * versions, you must use DeletePolicyVersion to delete an existing version
 * before you create a new one.
 *
 * Optionally, you can set the new version as the policy's default version. The default
 * version is the operative version (that is, the version that is in effect for the
 * certificates to which the policy is attached).
 *
 * Requires permission to access the CreatePolicyVersion action.
 */
export const createPolicyVersion: (
  input: CreatePolicyVersionRequest,
) => effect.Effect<
  CreatePolicyVersionResponse,
  | InternalFailureException
  | InvalidRequestException
  | MalformedPolicyException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | VersionsLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePolicyVersionRequest,
  output: CreatePolicyVersionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    MalformedPolicyException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    VersionsLimitExceededException,
  ],
}));
/**
 * List all commands in your account.
 */
export const listCommands: {
  (
    input: ListCommandsRequest,
  ): effect.Effect<
    ListCommandsResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCommandsRequest,
  ) => stream.Stream<
    ListCommandsResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCommandsRequest,
  ) => stream.Stream<
    CommandSummary,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCommandsRequest,
  output: ListCommandsResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "commands",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the software packages associated to the account.
 *
 * Requires permission to access the ListPackages action.
 */
export const listPackages: {
  (
    input: ListPackagesRequest,
  ): effect.Effect<
    ListPackagesResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPackagesRequest,
  ) => stream.Stream<
    ListPackagesResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPackagesRequest,
  ) => stream.Stream<
    PackageSummary,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPackagesRequest,
  output: ListPackagesResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "packageSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the software package versions associated to the account.
 *
 * Requires permission to access the ListPackageVersions action.
 */
export const listPackageVersions: {
  (
    input: ListPackageVersionsRequest,
  ): effect.Effect<
    ListPackageVersionsResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPackageVersionsRequest,
  ) => stream.Stream<
    ListPackageVersionsResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPackageVersionsRequest,
  ) => stream.Stream<
    PackageVersionSummary,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPackageVersionsRequest,
  output: ListPackageVersionsResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "packageVersionSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * The validation results for all software bill of materials (SBOM) attached to a specific software package version.
 *
 * Requires permission to access the ListSbomValidationResults action.
 */
export const listSbomValidationResults: {
  (
    input: ListSbomValidationResultsRequest,
  ): effect.Effect<
    ListSbomValidationResultsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSbomValidationResultsRequest,
  ) => stream.Stream<
    ListSbomValidationResultsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSbomValidationResultsRequest,
  ) => stream.Stream<
    SbomValidationResultSummary,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSbomValidationResultsRequest,
  output: ListSbomValidationResultsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "validationResultSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Disassociates the selected software bill of materials (SBOM) from a specific software package version.
 *
 * Requires permission to access the DisassociateSbomWithPackageVersion action.
 */
export const disassociateSbomFromPackageVersion: (
  input: DisassociateSbomFromPackageVersionRequest,
) => effect.Effect<
  DisassociateSbomFromPackageVersionResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateSbomFromPackageVersionRequest,
  output: DisassociateSbomFromPackageVersionResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the supported fields for a specific software package.
 *
 * Requires permission to access the UpdatePackage and GetIndexingConfiguration actions.
 */
export const updatePackage: (
  input: UpdatePackageRequest,
) => effect.Effect<
  UpdatePackageResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePackageRequest,
  output: UpdatePackageResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the software package configuration.
 *
 * Requires permission to access the UpdatePackageConfiguration and iam:PassRole actions.
 */
export const updatePackageConfiguration: (
  input: UpdatePackageConfigurationRequest,
) => effect.Effect<
  UpdatePackageConfigurationResponse,
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePackageConfigurationRequest,
  output: UpdatePackageConfigurationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the supported fields for a specific package version.
 *
 * Requires permission to access the UpdatePackageVersion and GetIndexingConfiguration actions.
 */
export const updatePackageVersion: (
  input: UpdatePackageVersionRequest,
) => effect.Effect<
  UpdatePackageVersionResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePackageVersionRequest,
  output: UpdatePackageVersionResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete a command resource.
 */
export const deleteCommand: (
  input: DeleteCommandRequest,
) => effect.Effect<
  DeleteCommandResponse,
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCommandRequest,
  output: DeleteCommandResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a specific version from a software package.
 *
 * **Note:** If a package version is designated as default, you must remove the designation from the software package using the UpdatePackage action.
 */
export const deletePackageVersion: (
  input: DeletePackageVersionRequest,
) => effect.Effect<
  DeletePackageVersionResponse,
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePackageVersionRequest,
  output: DeletePackageVersionResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
}));
/**
 * Delete a command execution.
 *
 * Only command executions that enter a terminal state can be deleted from
 * your account.
 */
export const deleteCommandExecution: (
  input: DeleteCommandExecutionRequest,
) => effect.Effect<
  DeleteCommandExecutionResponse,
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCommandExecutionRequest,
  output: DeleteCommandExecutionResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about the specified command.
 */
export const getCommand: (
  input: GetCommandRequest,
) => effect.Effect<
  GetCommandResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCommandRequest,
  output: GetCommandResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about the specified software package.
 *
 * Requires permission to access the GetPackage action.
 */
export const getPackage: (
  input: GetPackageRequest,
) => effect.Effect<
  GetPackageResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPackageRequest,
  output: GetPackageResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about the specified package version.
 *
 * Requires permission to access the GetPackageVersion action.
 */
export const getPackageVersion: (
  input: GetPackageVersionRequest,
) => effect.Effect<
  GetPackageVersionResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPackageVersionRequest,
  output: GetPackageVersionResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update information about a command or mark a command for deprecation.
 */
export const updateCommand: (
  input: UpdateCommandRequest,
) => effect.Effect<
  UpdateCommandResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCommandRequest,
  output: UpdateCommandResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an IoT software package that can be deployed to your fleet.
 *
 * Requires permission to access the CreatePackage and GetIndexingConfiguration actions.
 */
export const createPackage: (
  input: CreatePackageRequest,
) => effect.Effect<
  CreatePackageResponse,
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePackageRequest,
  output: CreatePackageResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Registers a CA certificate with Amazon Web Services IoT Core. There is no limit to the number of CA
 * certificates you can register in your Amazon Web Services account. You can register up to 10 CA
 * certificates with the same `CA subject field` per Amazon Web Services account.
 *
 * Requires permission to access the RegisterCACertificate action.
 */
export const registerCACertificate: (
  input: RegisterCACertificateRequest,
) => effect.Effect<
  RegisterCACertificateResponse,
  | CertificateValidationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | RegistrationCodeValidationException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterCACertificateRequest,
  output: RegisterCACertificateResponse,
  errors: [
    CertificateValidationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    RegistrationCodeValidationException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Starts a task that applies a set of mitigation actions to the specified target.
 *
 * Requires permission to access the StartAuditMitigationActionsTask action.
 */
export const startAuditMitigationActionsTask: (
  input: StartAuditMitigationActionsTaskRequest,
) => effect.Effect<
  StartAuditMitigationActionsTaskResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | TaskAlreadyExistsException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartAuditMitigationActionsTaskRequest,
  output: StartAuditMitigationActionsTaskResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    TaskAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the specified fleet metric.
 * Returns successfully with no error if the deletion is successful or you specify a fleet metric that doesn't exist.
 *
 * Requires permission to access the DeleteFleetMetric action.
 */
export const deleteFleetMetric: (
  input: DeleteFleetMetricRequest,
) => effect.Effect<
  DeleteFleetMetricResponse,
  | InternalFailureException
  | InvalidRequestException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | VersionConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFleetMetricRequest,
  output: DeleteFleetMetricResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    VersionConflictException,
  ],
}));
/**
 * Delete an OTA update.
 *
 * Requires permission to access the DeleteOTAUpdate action.
 */
export const deleteOTAUpdate: (
  input: DeleteOTAUpdateRequest,
) => effect.Effect<
  DeleteOTAUpdateResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | VersionConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOTAUpdateRequest,
  output: DeleteOTAUpdateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    VersionConflictException,
  ],
}));
/**
 * Deletes the specified thing. Returns successfully with no error if the deletion is
 * successful or you specify a thing that doesn't exist.
 *
 * Requires permission to access the DeleteThing action.
 */
export const deleteThing: (
  input: DeleteThingRequest,
) => effect.Effect<
  DeleteThingResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | VersionConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteThingRequest,
  output: DeleteThingResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    VersionConflictException,
  ],
}));
/**
 * Updates the data for a thing.
 *
 * Requires permission to access the UpdateThing action.
 */
export const updateThing: (
  input: UpdateThingRequest,
) => effect.Effect<
  UpdateThingResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | VersionConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateThingRequest,
  output: UpdateThingResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    VersionConflictException,
  ],
}));
/**
 * Associates a Device Defender security profile with a thing group or this account. Each
 * thing group or account can have up to five security profiles associated with it.
 *
 * Requires permission to access the AttachSecurityProfile action.
 */
export const attachSecurityProfile: (
  input: AttachSecurityProfileRequest,
) => effect.Effect<
  AttachSecurityProfileResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | VersionConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachSecurityProfileRequest,
  output: AttachSecurityProfileResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    VersionConflictException,
  ],
}));
/**
 * Deletes the billing group.
 *
 * Requires permission to access the DeleteBillingGroup action.
 */
export const deleteBillingGroup: (
  input: DeleteBillingGroupRequest,
) => effect.Effect<
  DeleteBillingGroupResponse,
  | InternalFailureException
  | InvalidRequestException
  | ThrottlingException
  | VersionConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBillingGroupRequest,
  output: DeleteBillingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
    VersionConflictException,
  ],
}));
/**
 * Deletes a dynamic thing group.
 *
 * Requires permission to access the DeleteDynamicThingGroup action.
 */
export const deleteDynamicThingGroup: (
  input: DeleteDynamicThingGroupRequest,
) => effect.Effect<
  DeleteDynamicThingGroupResponse,
  | InternalFailureException
  | InvalidRequestException
  | ThrottlingException
  | VersionConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDynamicThingGroupRequest,
  output: DeleteDynamicThingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
    VersionConflictException,
  ],
}));
/**
 * Deletes a Device Defender security profile.
 *
 * Requires permission to access the DeleteSecurityProfile action.
 */
export const deleteSecurityProfile: (
  input: DeleteSecurityProfileRequest,
) => effect.Effect<
  DeleteSecurityProfileResponse,
  | InternalFailureException
  | InvalidRequestException
  | ThrottlingException
  | VersionConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSecurityProfileRequest,
  output: DeleteSecurityProfileResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
    VersionConflictException,
  ],
}));
/**
 * Deletes a thing group.
 *
 * Requires permission to access the DeleteThingGroup action.
 */
export const deleteThingGroup: (
  input: DeleteThingGroupRequest,
) => effect.Effect<
  DeleteThingGroupResponse,
  | InternalFailureException
  | InvalidRequestException
  | ThrottlingException
  | VersionConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteThingGroupRequest,
  output: DeleteThingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
    VersionConflictException,
  ],
}));
/**
 * Updates information about the billing group.
 *
 * Requires permission to access the UpdateBillingGroup action.
 */
export const updateBillingGroup: (
  input: UpdateBillingGroupRequest,
) => effect.Effect<
  UpdateBillingGroupResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | VersionConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBillingGroupRequest,
  output: UpdateBillingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
    VersionConflictException,
  ],
}));
/**
 * Updates a Device Defender security profile.
 *
 * Requires permission to access the UpdateSecurityProfile action.
 */
export const updateSecurityProfile: (
  input: UpdateSecurityProfileRequest,
) => effect.Effect<
  UpdateSecurityProfileResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | VersionConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSecurityProfileRequest,
  output: UpdateSecurityProfileResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
    VersionConflictException,
  ],
}));
/**
 * Update a thing group.
 *
 * Requires permission to access the UpdateThingGroup action.
 */
export const updateThingGroup: (
  input: UpdateThingGroupRequest,
) => effect.Effect<
  UpdateThingGroupResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | VersionConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateThingGroupRequest,
  output: UpdateThingGroupResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
    VersionConflictException,
  ],
}));
/**
 * Cancels the execution of a job for a given thing.
 *
 * Requires permission to access the CancelJobExecution action.
 */
export const cancelJobExecution: (
  input: CancelJobExecutionRequest,
) => effect.Effect<
  CancelJobExecutionResponse,
  | InvalidRequestException
  | InvalidStateTransitionException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | VersionConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelJobExecutionRequest,
  output: CancelJobExecutionResponse,
  errors: [
    InvalidRequestException,
    InvalidStateTransitionException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    VersionConflictException,
  ],
}));
/**
 * Updates the data for a fleet metric.
 *
 * Requires permission to access the UpdateFleetMetric action.
 */
export const updateFleetMetric: (
  input: UpdateFleetMetricRequest,
) => effect.Effect<
  UpdateFleetMetricResponse,
  | IndexNotReadyException
  | InternalFailureException
  | InvalidAggregationException
  | InvalidQueryException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | VersionConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFleetMetricRequest,
  output: UpdateFleetMetricResponse,
  errors: [
    IndexNotReadyException,
    InternalFailureException,
    InvalidAggregationException,
    InvalidQueryException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    VersionConflictException,
  ],
}));
/**
 * Accepts a pending certificate transfer. The default state of the certificate is
 * INACTIVE.
 *
 * To check for pending certificate transfers, call ListCertificates
 * to enumerate your certificates.
 *
 * Requires permission to access the AcceptCertificateTransfer action.
 */
export const acceptCertificateTransfer: (
  input: AcceptCertificateTransferRequest,
) => effect.Effect<
  AcceptCertificateTransferResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | TransferAlreadyCompletedException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptCertificateTransferRequest,
  output: AcceptCertificateTransferResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    TransferAlreadyCompletedException,
    UnauthorizedException,
  ],
}));
/**
 * Cancels a pending transfer for the specified certificate.
 *
 * **Note** Only the transfer source account can use this
 * operation to cancel a transfer. (Transfer destinations can use RejectCertificateTransfer instead.) After transfer, IoT returns the
 * certificate to the source account in the INACTIVE state. After the destination account has
 * accepted the transfer, the transfer cannot be cancelled.
 *
 * After a certificate transfer is cancelled, the status of the certificate changes from
 * PENDING_TRANSFER to INACTIVE.
 *
 * Requires permission to access the CancelCertificateTransfer action.
 */
export const cancelCertificateTransfer: (
  input: CancelCertificateTransferRequest,
) => effect.Effect<
  CancelCertificateTransferResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | TransferAlreadyCompletedException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelCertificateTransferRequest,
  output: CancelCertificateTransferResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    TransferAlreadyCompletedException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a new version of a provisioning template.
 *
 * Requires permission to access the CreateProvisioningTemplateVersion action.
 */
export const createProvisioningTemplateVersion: (
  input: CreateProvisioningTemplateVersionRequest,
) => effect.Effect<
  CreateProvisioningTemplateVersionResponse,
  | ConflictingResourceUpdateException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | VersionsLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProvisioningTemplateVersionRequest,
  output: CreateProvisioningTemplateVersionResponse,
  errors: [
    ConflictingResourceUpdateException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    VersionsLimitExceededException,
  ],
}));
/**
 * Creates a job.
 *
 * Requires permission to access the CreateJob action.
 */
export const createJob: (
  input: CreateJobRequest,
) => effect.Effect<
  CreateJobResponse,
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateJobRequest,
  output: CreateJobResponse,
  errors: [
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Creates a Device Defender security profile.
 *
 * Requires permission to access the CreateSecurityProfile action.
 */
export const createSecurityProfile: (
  input: CreateSecurityProfileRequest,
) => effect.Effect<
  CreateSecurityProfileResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceAlreadyExistsException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSecurityProfileRequest,
  output: CreateSecurityProfileResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Creates a new thing type. If this call is made multiple times using
 * the same thing type name and configuration, the call will succeed. If this call is made with
 * the same thing type name but different configuration a `ResourceAlreadyExistsException` is thrown.
 *
 * Requires permission to access the CreateThingType action.
 */
export const createThingType: (
  input: CreateThingTypeRequest,
) => effect.Effect<
  CreateThingTypeResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceAlreadyExistsException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateThingTypeRequest,
  output: CreateThingTypeResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Aggregates on indexed data with search queries pertaining to particular fields.
 *
 * Requires permission to access the GetBucketsAggregation action.
 */
export const getBucketsAggregation: (
  input: GetBucketsAggregationRequest,
) => effect.Effect<
  GetBucketsAggregationResponse,
  | IndexNotReadyException
  | InternalFailureException
  | InvalidAggregationException
  | InvalidQueryException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketsAggregationRequest,
  output: GetBucketsAggregationResponse,
  errors: [
    IndexNotReadyException,
    InternalFailureException,
    InvalidAggregationException,
    InvalidQueryException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Provisions a thing in the device registry. RegisterThing calls other IoT control
 * plane APIs. These calls might exceed your account level
 * IoT Throttling Limits and cause throttle errors. Please contact Amazon Web Services Customer Support to raise
 * your throttling limits if necessary.
 *
 * Requires permission to access the RegisterThing action.
 */
export const registerThing: (
  input: RegisterThingRequest,
) => effect.Effect<
  RegisterThingResponse,
  | ConflictingResourceUpdateException
  | InternalFailureException
  | InvalidRequestException
  | ResourceRegistrationFailureException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterThingRequest,
  output: RegisterThingResponse,
  errors: [
    ConflictingResourceUpdateException,
    InternalFailureException,
    InvalidRequestException,
    ResourceRegistrationFailureException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Tests a custom authorization behavior by invoking a specified custom authorizer. Use
 * this to test and debug the custom authorization behavior of devices that connect to the IoT
 * device gateway.
 *
 * Requires permission to access the TestInvokeAuthorizer action.
 */
export const testInvokeAuthorizer: (
  input: TestInvokeAuthorizerRequest,
) => effect.Effect<
  TestInvokeAuthorizerResponse,
  | InternalFailureException
  | InvalidRequestException
  | InvalidResponseException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestInvokeAuthorizerRequest,
  output: TestInvokeAuthorizerResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    InvalidResponseException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a command. A command contains reusable configurations that can be applied
 * before they are sent to the devices.
 */
export const createCommand: (
  input: CreateCommandRequest,
) => effect.Effect<
  CreateCommandResponse,
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCommandRequest,
  output: CreateCommandResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Tests if a specified principal is authorized to perform an IoT action on a
 * specified resource. Use this to test and debug the authorization behavior of devices that
 * connect to the IoT device gateway.
 *
 * Requires permission to access the TestAuthorization action.
 */
export const testAuthorization: (
  input: TestAuthorizationRequest,
) => effect.Effect<
  TestAuthorizationResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestAuthorizationRequest,
  output: TestAuthorizationResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Creates an IoT OTA update on a target group of things or groups.
 *
 * Requires permission to access the CreateOTAUpdate action.
 */
export const createOTAUpdate: (
  input: CreateOTAUpdateRequest,
) => effect.Effect<
  CreateOTAUpdateResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOTAUpdateRequest,
  output: CreateOTAUpdateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a rule. Creating rules is an administrator-level action. Any user who has
 * permission to create rules will be able to access data processed by the rule.
 *
 * Requires permission to access the CreateTopicRule action.
 */
export const createTopicRule: (
  input: CreateTopicRuleRequest,
) => effect.Effect<
  CreateTopicRuleResponse,
  | ConflictingResourceUpdateException
  | InternalException
  | InvalidRequestException
  | ResourceAlreadyExistsException
  | ServiceUnavailableException
  | SqlParseException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTopicRuleRequest,
  output: CreateTopicRuleResponse,
  errors: [
    ConflictingResourceUpdateException,
    InternalException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ServiceUnavailableException,
    SqlParseException,
    UnauthorizedException,
  ],
}));
