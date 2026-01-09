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
const ns = T.XmlNamespace("http://datapipeline.amazonaws.com/doc/2012-10-29/");
const svc = T.AwsApiService({
  sdkId: "Data Pipeline",
  serviceShapeName: "DataPipeline",
});
const auth = T.AwsAuthSigv4({ name: "datapipeline" });
const ver = T.ServiceVersion("2012-10-29");
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
              `https://datapipeline-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://datapipeline-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://datapipeline.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://datapipeline.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Id = string;
export type CancelActive = boolean;
export type LongString = string;
export type Int = number;
export type TaskId = string;
export type ErrorMessage = string;
export type FieldNameString = string;
export type FieldStringValue = string;
export type TagKey = string;
export type TagValue = string;
export type AttributeNameString = string;
export type AttributeValueString = string;
export type ValidationMessage = string;

//# Schemas
export type IdList = string[];
export const IdList = S.Array(S.String);
export type StringList = string[];
export const StringList = S.Array(S.String);
export type TaskStatus = "FINISHED" | "FAILED" | "FALSE" | (string & {});
export const TaskStatus = S.String;
export interface Tag {
  key: string;
  value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreatePipelineInput {
  name: string;
  uniqueId: string;
  description?: string;
  tags?: Tag[];
}
export const CreatePipelineInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    uniqueId: S.String,
    description: S.optional(S.String),
    tags: S.optional(TagList),
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
  identifier: "CreatePipelineInput",
}) as any as S.Schema<CreatePipelineInput>;
export interface DeactivatePipelineInput {
  pipelineId: string;
  cancelActive?: boolean;
}
export const DeactivatePipelineInput = S.suspend(() =>
  S.Struct({ pipelineId: S.String, cancelActive: S.optional(S.Boolean) }).pipe(
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
  identifier: "DeactivatePipelineInput",
}) as any as S.Schema<DeactivatePipelineInput>;
export interface DeactivatePipelineOutput {}
export const DeactivatePipelineOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeactivatePipelineOutput",
}) as any as S.Schema<DeactivatePipelineOutput>;
export interface DeletePipelineInput {
  pipelineId: string;
}
export const DeletePipelineInput = S.suspend(() =>
  S.Struct({ pipelineId: S.String }).pipe(
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
  identifier: "DeletePipelineInput",
}) as any as S.Schema<DeletePipelineInput>;
export interface DeletePipelineResponse {}
export const DeletePipelineResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeletePipelineResponse",
}) as any as S.Schema<DeletePipelineResponse>;
export interface DescribeObjectsInput {
  pipelineId: string;
  objectIds: string[];
  evaluateExpressions?: boolean;
  marker?: string;
}
export const DescribeObjectsInput = S.suspend(() =>
  S.Struct({
    pipelineId: S.String,
    objectIds: IdList,
    evaluateExpressions: S.optional(S.Boolean),
    marker: S.optional(S.String),
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
  identifier: "DescribeObjectsInput",
}) as any as S.Schema<DescribeObjectsInput>;
export interface DescribePipelinesInput {
  pipelineIds: string[];
}
export const DescribePipelinesInput = S.suspend(() =>
  S.Struct({ pipelineIds: IdList }).pipe(
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
  identifier: "DescribePipelinesInput",
}) as any as S.Schema<DescribePipelinesInput>;
export interface EvaluateExpressionInput {
  pipelineId: string;
  objectId: string;
  expression: string;
}
export const EvaluateExpressionInput = S.suspend(() =>
  S.Struct({
    pipelineId: S.String,
    objectId: S.String,
    expression: S.String,
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
  identifier: "EvaluateExpressionInput",
}) as any as S.Schema<EvaluateExpressionInput>;
export interface GetPipelineDefinitionInput {
  pipelineId: string;
  version?: string;
}
export const GetPipelineDefinitionInput = S.suspend(() =>
  S.Struct({ pipelineId: S.String, version: S.optional(S.String) }).pipe(
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
  identifier: "GetPipelineDefinitionInput",
}) as any as S.Schema<GetPipelineDefinitionInput>;
export interface ListPipelinesInput {
  marker?: string;
}
export const ListPipelinesInput = S.suspend(() =>
  S.Struct({ marker: S.optional(S.String) }).pipe(
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
  identifier: "ListPipelinesInput",
}) as any as S.Schema<ListPipelinesInput>;
export interface RemoveTagsInput {
  pipelineId: string;
  tagKeys: string[];
}
export const RemoveTagsInput = S.suspend(() =>
  S.Struct({ pipelineId: S.String, tagKeys: StringList }).pipe(
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
  identifier: "RemoveTagsInput",
}) as any as S.Schema<RemoveTagsInput>;
export interface RemoveTagsOutput {}
export const RemoveTagsOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveTagsOutput",
}) as any as S.Schema<RemoveTagsOutput>;
export interface ReportTaskRunnerHeartbeatInput {
  taskrunnerId: string;
  workerGroup?: string;
  hostname?: string;
}
export const ReportTaskRunnerHeartbeatInput = S.suspend(() =>
  S.Struct({
    taskrunnerId: S.String,
    workerGroup: S.optional(S.String),
    hostname: S.optional(S.String),
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
  identifier: "ReportTaskRunnerHeartbeatInput",
}) as any as S.Schema<ReportTaskRunnerHeartbeatInput>;
export interface SetStatusInput {
  pipelineId: string;
  objectIds: string[];
  status: string;
}
export const SetStatusInput = S.suspend(() =>
  S.Struct({ pipelineId: S.String, objectIds: IdList, status: S.String }).pipe(
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
  identifier: "SetStatusInput",
}) as any as S.Schema<SetStatusInput>;
export interface SetStatusResponse {}
export const SetStatusResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetStatusResponse",
}) as any as S.Schema<SetStatusResponse>;
export interface SetTaskStatusInput {
  taskId: string;
  taskStatus: TaskStatus;
  errorId?: string;
  errorMessage?: string;
  errorStackTrace?: string;
}
export const SetTaskStatusInput = S.suspend(() =>
  S.Struct({
    taskId: S.String,
    taskStatus: TaskStatus,
    errorId: S.optional(S.String),
    errorMessage: S.optional(S.String),
    errorStackTrace: S.optional(S.String),
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
  identifier: "SetTaskStatusInput",
}) as any as S.Schema<SetTaskStatusInput>;
export interface SetTaskStatusOutput {}
export const SetTaskStatusOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetTaskStatusOutput",
}) as any as S.Schema<SetTaskStatusOutput>;
export interface Field {
  key: string;
  stringValue?: string;
  refValue?: string;
}
export const Field = S.suspend(() =>
  S.Struct({
    key: S.String,
    stringValue: S.optional(S.String),
    refValue: S.optional(S.String),
  }),
).annotations({ identifier: "Field" }) as any as S.Schema<Field>;
export type FieldList = Field[];
export const FieldList = S.Array(Field);
export interface PipelineObject {
  id: string;
  name: string;
  fields: Field[];
}
export const PipelineObject = S.suspend(() =>
  S.Struct({ id: S.String, name: S.String, fields: FieldList }),
).annotations({
  identifier: "PipelineObject",
}) as any as S.Schema<PipelineObject>;
export type PipelineObjectList = PipelineObject[];
export const PipelineObjectList = S.Array(PipelineObject);
export interface ParameterAttribute {
  key: string;
  stringValue: string;
}
export const ParameterAttribute = S.suspend(() =>
  S.Struct({ key: S.String, stringValue: S.String }),
).annotations({
  identifier: "ParameterAttribute",
}) as any as S.Schema<ParameterAttribute>;
export type ParameterAttributeList = ParameterAttribute[];
export const ParameterAttributeList = S.Array(ParameterAttribute);
export interface ParameterObject {
  id: string;
  attributes: ParameterAttribute[];
}
export const ParameterObject = S.suspend(() =>
  S.Struct({ id: S.String, attributes: ParameterAttributeList }),
).annotations({
  identifier: "ParameterObject",
}) as any as S.Schema<ParameterObject>;
export type ParameterObjectList = ParameterObject[];
export const ParameterObjectList = S.Array(ParameterObject);
export interface ParameterValue {
  id: string;
  stringValue: string;
}
export const ParameterValue = S.suspend(() =>
  S.Struct({ id: S.String, stringValue: S.String }),
).annotations({
  identifier: "ParameterValue",
}) as any as S.Schema<ParameterValue>;
export type ParameterValueList = ParameterValue[];
export const ParameterValueList = S.Array(ParameterValue);
export interface ValidatePipelineDefinitionInput {
  pipelineId: string;
  pipelineObjects: PipelineObject[];
  parameterObjects?: ParameterObject[];
  parameterValues?: ParameterValue[];
}
export const ValidatePipelineDefinitionInput = S.suspend(() =>
  S.Struct({
    pipelineId: S.String,
    pipelineObjects: PipelineObjectList,
    parameterObjects: S.optional(ParameterObjectList),
    parameterValues: S.optional(ParameterValueList),
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
  identifier: "ValidatePipelineDefinitionInput",
}) as any as S.Schema<ValidatePipelineDefinitionInput>;
export interface InstanceIdentity {
  document?: string;
  signature?: string;
}
export const InstanceIdentity = S.suspend(() =>
  S.Struct({ document: S.optional(S.String), signature: S.optional(S.String) }),
).annotations({
  identifier: "InstanceIdentity",
}) as any as S.Schema<InstanceIdentity>;
export interface ActivatePipelineInput {
  pipelineId: string;
  parameterValues?: ParameterValue[];
  startTimestamp?: Date;
}
export const ActivatePipelineInput = S.suspend(() =>
  S.Struct({
    pipelineId: S.String,
    parameterValues: S.optional(ParameterValueList),
    startTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
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
  identifier: "ActivatePipelineInput",
}) as any as S.Schema<ActivatePipelineInput>;
export interface ActivatePipelineOutput {}
export const ActivatePipelineOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "ActivatePipelineOutput",
}) as any as S.Schema<ActivatePipelineOutput>;
export interface AddTagsInput {
  pipelineId: string;
  tags: Tag[];
}
export const AddTagsInput = S.suspend(() =>
  S.Struct({ pipelineId: S.String, tags: TagList }).pipe(
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
).annotations({ identifier: "AddTagsInput" }) as any as S.Schema<AddTagsInput>;
export interface AddTagsOutput {}
export const AddTagsOutput = S.suspend(() => S.Struct({}).pipe(ns)).annotations(
  { identifier: "AddTagsOutput" },
) as any as S.Schema<AddTagsOutput>;
export interface CreatePipelineOutput {
  pipelineId: string;
}
export const CreatePipelineOutput = S.suspend(() =>
  S.Struct({ pipelineId: S.String }).pipe(ns),
).annotations({
  identifier: "CreatePipelineOutput",
}) as any as S.Schema<CreatePipelineOutput>;
export interface DescribeObjectsOutput {
  pipelineObjects: PipelineObject[];
  marker?: string;
  hasMoreResults?: boolean;
}
export const DescribeObjectsOutput = S.suspend(() =>
  S.Struct({
    pipelineObjects: PipelineObjectList,
    marker: S.optional(S.String),
    hasMoreResults: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "DescribeObjectsOutput",
}) as any as S.Schema<DescribeObjectsOutput>;
export interface EvaluateExpressionOutput {
  evaluatedExpression: string;
}
export const EvaluateExpressionOutput = S.suspend(() =>
  S.Struct({ evaluatedExpression: S.String }).pipe(ns),
).annotations({
  identifier: "EvaluateExpressionOutput",
}) as any as S.Schema<EvaluateExpressionOutput>;
export interface GetPipelineDefinitionOutput {
  pipelineObjects?: PipelineObject[];
  parameterObjects?: ParameterObject[];
  parameterValues?: ParameterValue[];
}
export const GetPipelineDefinitionOutput = S.suspend(() =>
  S.Struct({
    pipelineObjects: S.optional(PipelineObjectList),
    parameterObjects: S.optional(ParameterObjectList),
    parameterValues: S.optional(ParameterValueList),
  }).pipe(ns),
).annotations({
  identifier: "GetPipelineDefinitionOutput",
}) as any as S.Schema<GetPipelineDefinitionOutput>;
export interface PollForTaskInput {
  workerGroup: string;
  hostname?: string;
  instanceIdentity?: InstanceIdentity;
}
export const PollForTaskInput = S.suspend(() =>
  S.Struct({
    workerGroup: S.String,
    hostname: S.optional(S.String),
    instanceIdentity: S.optional(InstanceIdentity),
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
  identifier: "PollForTaskInput",
}) as any as S.Schema<PollForTaskInput>;
export interface ReportTaskProgressInput {
  taskId: string;
  fields?: Field[];
}
export const ReportTaskProgressInput = S.suspend(() =>
  S.Struct({ taskId: S.String, fields: S.optional(FieldList) }).pipe(
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
  identifier: "ReportTaskProgressInput",
}) as any as S.Schema<ReportTaskProgressInput>;
export interface ReportTaskRunnerHeartbeatOutput {
  terminate: boolean;
}
export const ReportTaskRunnerHeartbeatOutput = S.suspend(() =>
  S.Struct({ terminate: S.Boolean }).pipe(ns),
).annotations({
  identifier: "ReportTaskRunnerHeartbeatOutput",
}) as any as S.Schema<ReportTaskRunnerHeartbeatOutput>;
export type ValidationMessages = string[];
export const ValidationMessages = S.Array(S.String);
export type OperatorType =
  | "EQ"
  | "REF_EQ"
  | "LE"
  | "GE"
  | "BETWEEN"
  | (string & {});
export const OperatorType = S.String;
export interface PipelineDescription {
  pipelineId: string;
  name: string;
  fields: Field[];
  description?: string;
  tags?: Tag[];
}
export const PipelineDescription = S.suspend(() =>
  S.Struct({
    pipelineId: S.String,
    name: S.String,
    fields: FieldList,
    description: S.optional(S.String),
    tags: S.optional(TagList),
  }),
).annotations({
  identifier: "PipelineDescription",
}) as any as S.Schema<PipelineDescription>;
export type PipelineDescriptionList = PipelineDescription[];
export const PipelineDescriptionList = S.Array(PipelineDescription);
export interface PipelineIdName {
  id?: string;
  name?: string;
}
export const PipelineIdName = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), name: S.optional(S.String) }),
).annotations({
  identifier: "PipelineIdName",
}) as any as S.Schema<PipelineIdName>;
export type PipelineList = PipelineIdName[];
export const PipelineList = S.Array(PipelineIdName);
export interface ValidationError {
  id?: string;
  errors?: string[];
}
export const ValidationError = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    errors: S.optional(ValidationMessages),
  }),
).annotations({
  identifier: "ValidationError",
}) as any as S.Schema<ValidationError>;
export type ValidationErrors = ValidationError[];
export const ValidationErrors = S.Array(ValidationError);
export interface ValidationWarning {
  id?: string;
  warnings?: string[];
}
export const ValidationWarning = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    warnings: S.optional(ValidationMessages),
  }),
).annotations({
  identifier: "ValidationWarning",
}) as any as S.Schema<ValidationWarning>;
export type ValidationWarnings = ValidationWarning[];
export const ValidationWarnings = S.Array(ValidationWarning);
export interface Operator {
  type?: OperatorType;
  values?: string[];
}
export const Operator = S.suspend(() =>
  S.Struct({ type: S.optional(OperatorType), values: S.optional(StringList) }),
).annotations({ identifier: "Operator" }) as any as S.Schema<Operator>;
export interface DescribePipelinesOutput {
  pipelineDescriptionList: PipelineDescription[];
}
export const DescribePipelinesOutput = S.suspend(() =>
  S.Struct({ pipelineDescriptionList: PipelineDescriptionList }).pipe(ns),
).annotations({
  identifier: "DescribePipelinesOutput",
}) as any as S.Schema<DescribePipelinesOutput>;
export interface ListPipelinesOutput {
  pipelineIdList: PipelineIdName[];
  marker?: string;
  hasMoreResults?: boolean;
}
export const ListPipelinesOutput = S.suspend(() =>
  S.Struct({
    pipelineIdList: PipelineList,
    marker: S.optional(S.String),
    hasMoreResults: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "ListPipelinesOutput",
}) as any as S.Schema<ListPipelinesOutput>;
export interface PutPipelineDefinitionInput {
  pipelineId: string;
  pipelineObjects: PipelineObject[];
  parameterObjects?: ParameterObject[];
  parameterValues?: ParameterValue[];
}
export const PutPipelineDefinitionInput = S.suspend(() =>
  S.Struct({
    pipelineId: S.String,
    pipelineObjects: PipelineObjectList,
    parameterObjects: S.optional(ParameterObjectList),
    parameterValues: S.optional(ParameterValueList),
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
  identifier: "PutPipelineDefinitionInput",
}) as any as S.Schema<PutPipelineDefinitionInput>;
export interface ReportTaskProgressOutput {
  canceled: boolean;
}
export const ReportTaskProgressOutput = S.suspend(() =>
  S.Struct({ canceled: S.Boolean }).pipe(ns),
).annotations({
  identifier: "ReportTaskProgressOutput",
}) as any as S.Schema<ReportTaskProgressOutput>;
export interface ValidatePipelineDefinitionOutput {
  validationErrors?: ValidationError[];
  validationWarnings?: ValidationWarning[];
  errored: boolean;
}
export const ValidatePipelineDefinitionOutput = S.suspend(() =>
  S.Struct({
    validationErrors: S.optional(ValidationErrors),
    validationWarnings: S.optional(ValidationWarnings),
    errored: S.Boolean,
  }).pipe(ns),
).annotations({
  identifier: "ValidatePipelineDefinitionOutput",
}) as any as S.Schema<ValidatePipelineDefinitionOutput>;
export interface Selector {
  fieldName?: string;
  operator?: Operator;
}
export const Selector = S.suspend(() =>
  S.Struct({ fieldName: S.optional(S.String), operator: S.optional(Operator) }),
).annotations({ identifier: "Selector" }) as any as S.Schema<Selector>;
export type SelectorList = Selector[];
export const SelectorList = S.Array(Selector);
export interface Query {
  selectors?: Selector[];
}
export const Query = S.suspend(() =>
  S.Struct({ selectors: S.optional(SelectorList) }),
).annotations({ identifier: "Query" }) as any as S.Schema<Query>;
export interface PutPipelineDefinitionOutput {
  validationErrors?: ValidationError[];
  validationWarnings?: ValidationWarning[];
  errored: boolean;
}
export const PutPipelineDefinitionOutput = S.suspend(() =>
  S.Struct({
    validationErrors: S.optional(ValidationErrors),
    validationWarnings: S.optional(ValidationWarnings),
    errored: S.Boolean,
  }).pipe(ns),
).annotations({
  identifier: "PutPipelineDefinitionOutput",
}) as any as S.Schema<PutPipelineDefinitionOutput>;
export interface QueryObjectsInput {
  pipelineId: string;
  query?: Query;
  sphere: string;
  marker?: string;
  limit?: number;
}
export const QueryObjectsInput = S.suspend(() =>
  S.Struct({
    pipelineId: S.String,
    query: S.optional(Query),
    sphere: S.String,
    marker: S.optional(S.String),
    limit: S.optional(S.Number),
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
  identifier: "QueryObjectsInput",
}) as any as S.Schema<QueryObjectsInput>;
export type PipelineObjectMap = { [key: string]: PipelineObject | undefined };
export const PipelineObjectMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(PipelineObject),
});
export interface TaskObject {
  taskId?: string;
  pipelineId?: string;
  attemptId?: string;
  objects?: { [key: string]: PipelineObject | undefined };
}
export const TaskObject = S.suspend(() =>
  S.Struct({
    taskId: S.optional(S.String),
    pipelineId: S.optional(S.String),
    attemptId: S.optional(S.String),
    objects: S.optional(PipelineObjectMap),
  }),
).annotations({ identifier: "TaskObject" }) as any as S.Schema<TaskObject>;
export interface PollForTaskOutput {
  taskObject?: TaskObject;
}
export const PollForTaskOutput = S.suspend(() =>
  S.Struct({ taskObject: S.optional(TaskObject) }).pipe(ns),
).annotations({
  identifier: "PollForTaskOutput",
}) as any as S.Schema<PollForTaskOutput>;
export interface QueryObjectsOutput {
  ids?: string[];
  marker?: string;
  hasMoreResults?: boolean;
}
export const QueryObjectsOutput = S.suspend(() =>
  S.Struct({
    ids: S.optional(IdList),
    marker: S.optional(S.String),
    hasMoreResults: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "QueryObjectsOutput",
}) as any as S.Schema<QueryObjectsOutput>;

//# Errors
export class InternalServiceError extends S.TaggedError<InternalServiceError>()(
  "InternalServiceError",
  { message: S.optional(S.String) },
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { message: S.optional(S.String) },
) {}
export class PipelineDeletedException extends S.TaggedError<PipelineDeletedException>()(
  "PipelineDeletedException",
  { message: S.optional(S.String) },
) {}
export class PipelineNotFoundException extends S.TaggedError<PipelineNotFoundException>()(
  "PipelineNotFoundException",
  { message: S.optional(S.String) },
) {}
export class TaskNotFoundException extends S.TaggedError<TaskNotFoundException>()(
  "TaskNotFoundException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Lists the pipeline identifiers for all active pipelines that you have permission to access.
 *
 * POST / HTTP/1.1
 * Content-Type: application/x-amz-json-1.1
 * X-Amz-Target: DataPipeline.ListPipelines
 * Content-Length: 14
 * Host: datapipeline.us-east-1.amazonaws.com
 * X-Amz-Date: Mon, 12 Nov 2012 17:49:52 GMT
 * Authorization: AuthParams
 *
 * {}
 *
 * Status:
 * x-amzn-RequestId: b3104dc5-0734-11e2-af6f-6bc7a6be60d9
 * Content-Type: application/x-amz-json-1.1
 * Content-Length: 39
 * Date: Mon, 12 Nov 2012 17:50:53 GMT
 *
 * {"PipelineIdList":
 * [
 * {"id": "df-08785951KAKJEXAMPLE",
 * "name": "MyPipeline"},
 * {"id": "df-08662578ISYEXAMPLE",
 * "name": "MySecondPipeline"}
 * ]
 * }
 */
export const listPipelines: {
  (
    input: ListPipelinesInput,
  ): effect.Effect<
    ListPipelinesOutput,
    InternalServiceError | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPipelinesInput,
  ) => stream.Stream<
    ListPipelinesOutput,
    InternalServiceError | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPipelinesInput,
  ) => stream.Stream<
    PipelineIdName,
    InternalServiceError | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPipelinesInput,
  output: ListPipelinesOutput,
  errors: [InternalServiceError, InvalidRequestException],
  pagination: {
    inputToken: "marker",
    outputToken: "marker",
    items: "pipelineIdList",
  } as const,
}));
/**
 * Task runners call `ReportTaskRunnerHeartbeat` every 15 minutes to indicate that they are operational.
 * If the AWS Data Pipeline Task Runner is launched on a resource managed by AWS Data Pipeline, the web service can use
 * this call to detect when the task runner application has failed and restart a new instance.
 *
 * POST / HTTP/1.1
 * Content-Type: application/x-amz-json-1.1
 * X-Amz-Target: DataPipeline.ReportTaskRunnerHeartbeat
 * Content-Length: 84
 * Host: datapipeline.us-east-1.amazonaws.com
 * X-Amz-Date: Mon, 12 Nov 2012 17:49:52 GMT
 * Authorization: AuthParams
 *
 * {"taskrunnerId": "1234567890",
 * "workerGroup": "wg-12345",
 * "hostname": "example.com"}
 *
 * Status:
 * x-amzn-RequestId: b3104dc5-0734-11e2-af6f-6bc7a6be60d9
 * Content-Type: application/x-amz-json-1.1
 * Content-Length: 20
 * Date: Mon, 12 Nov 2012 17:50:53 GMT
 *
 * {"terminate": false}
 */
export const reportTaskRunnerHeartbeat: (
  input: ReportTaskRunnerHeartbeatInput,
) => effect.Effect<
  ReportTaskRunnerHeartbeatOutput,
  InternalServiceError | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReportTaskRunnerHeartbeatInput,
  output: ReportTaskRunnerHeartbeatOutput,
  errors: [InternalServiceError, InvalidRequestException],
}));
/**
 * Creates a new, empty pipeline. Use PutPipelineDefinition to populate the pipeline.
 *
 * POST / HTTP/1.1
 * Content-Type: application/x-amz-json-1.1
 * X-Amz-Target: DataPipeline.CreatePipeline
 * Content-Length: 91
 * Host: datapipeline.us-east-1.amazonaws.com
 * X-Amz-Date: Mon, 12 Nov 2012 17:49:52 GMT
 * Authorization: AuthParams
 *
 * {"name": "myPipeline",
 * "uniqueId": "123456789",
 * "description": "This is my first pipeline"}
 *
 * HTTP/1.1 200
 * x-amzn-RequestId: b16911ce-0774-11e2-af6f-6bc7a6be60d9
 * Content-Type: application/x-amz-json-1.1
 * Content-Length: 40
 * Date: Mon, 12 Nov 2012 17:50:53 GMT
 *
 * {"pipelineId": "df-06372391ZG65EXAMPLE"}
 */
export const createPipeline: (
  input: CreatePipelineInput,
) => effect.Effect<
  CreatePipelineOutput,
  InternalServiceError | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePipelineInput,
  output: CreatePipelineOutput,
  errors: [InternalServiceError, InvalidRequestException],
}));
/**
 * Deletes a pipeline, its pipeline definition, and its run history.
 * AWS Data Pipeline attempts to cancel instances associated with the pipeline that are currently being processed by task runners.
 *
 * Deleting a pipeline cannot be undone. You cannot query or restore a deleted pipeline.
 * To temporarily pause a pipeline instead of deleting it, call SetStatus with the status set to `PAUSE` on individual components.
 * Components that are paused by SetStatus can be resumed.
 *
 * POST / HTTP/1.1
 * Content-Type: application/x-amz-json-1.1
 * X-Amz-Target: DataPipeline.DeletePipeline
 * Content-Length: 50
 * Host: datapipeline.us-east-1.amazonaws.com
 * X-Amz-Date: Mon, 12 Nov 2012 17:49:52 GMT
 * Authorization: AuthParams
 *
 * {"pipelineId": "df-06372391ZG65EXAMPLE"}
 *
 * x-amzn-RequestId: b7a88c81-0754-11e2-af6f-6bc7a6be60d9
 * Content-Type: application/x-amz-json-1.1
 * Content-Length: 0
 * Date: Mon, 12 Nov 2012 17:50:53 GMT
 *
 * Unexpected response: 200, OK, undefined
 */
export const deletePipeline: (
  input: DeletePipelineInput,
) => effect.Effect<
  DeletePipelineResponse,
  | InternalServiceError
  | InvalidRequestException
  | PipelineNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePipelineInput,
  output: DeletePipelineResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    PipelineNotFoundException,
  ],
}));
/**
 * Retrieves metadata about one or more pipelines. The information retrieved includes the name of the pipeline, the pipeline identifier,
 * its current state, and the user account that owns the pipeline. Using account credentials, you can retrieve metadata about pipelines
 * that you or your IAM users have created. If you are using an IAM user account, you can retrieve metadata about only those pipelines
 * for which you have read permissions.
 *
 * To retrieve the full pipeline definition instead of metadata about the pipeline, call GetPipelineDefinition.
 *
 * POST / HTTP/1.1
 * Content-Type: application/x-amz-json-1.1
 * X-Amz-Target: DataPipeline.DescribePipelines
 * Content-Length: 70
 * Host: datapipeline.us-east-1.amazonaws.com
 * X-Amz-Date: Mon, 12 Nov 2012 17:49:52 GMT
 * Authorization: AuthParams
 *
 * {"pipelineIds":
 * ["df-08785951KAKJEXAMPLE"]
 * }
 *
 * x-amzn-RequestId: 02870eb7-0736-11e2-af6f-6bc7a6be60d9
 * Content-Type: application/x-amz-json-1.1
 * Content-Length: 767
 * Date: Mon, 12 Nov 2012 17:50:53 GMT
 *
 * {"pipelineDescriptionList":
 * [
 * {"description": "This is my first pipeline",
 * "fields":
 * [
 * {"key": "@pipelineState",
 * "stringValue": "SCHEDULED"},
 * {"key": "description",
 * "stringValue": "This is my first pipeline"},
 * {"key": "name",
 * "stringValue": "myPipeline"},
 * {"key": "@creationTime",
 * "stringValue": "2012-12-13T01:24:06"},
 * {"key": "@id",
 * "stringValue": "df-0937003356ZJEXAMPLE"},
 * {"key": "@sphere",
 * "stringValue": "PIPELINE"},
 * {"key": "@version",
 * "stringValue": "1"},
 * {"key": "@userId",
 * "stringValue": "924374875933"},
 * {"key": "@accountId",
 * "stringValue": "924374875933"},
 * {"key": "uniqueId",
 * "stringValue": "1234567890"}
 * ],
 * "name": "myPipeline",
 * "pipelineId": "df-0937003356ZJEXAMPLE"}
 * ]
 * }
 */
export const describePipelines: (
  input: DescribePipelinesInput,
) => effect.Effect<
  DescribePipelinesOutput,
  | InternalServiceError
  | InvalidRequestException
  | PipelineDeletedException
  | PipelineNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePipelinesInput,
  output: DescribePipelinesOutput,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    PipelineDeletedException,
    PipelineNotFoundException,
  ],
}));
/**
 * Validates the specified pipeline definition to ensure that it is well formed and can be run without error.
 *
 * Example 1
 *
 * This example sets an valid pipeline configuration and returns success.
 *
 * POST / HTTP/1.1
 * Content-Type: application/x-amz-json-1.1
 * X-Amz-Target: DataPipeline.ValidatePipelineDefinition
 * Content-Length: 936
 * Host: datapipeline.us-east-1.amazonaws.com
 * X-Amz-Date: Mon, 12 Nov 2012 17:49:52 GMT
 * Authorization: AuthParams
 *
 * {"pipelineId": "df-06372391ZG65EXAMPLE",
 * "pipelineObjects":
 * [
 * {"id": "Default",
 * "name": "Default",
 * "fields":
 * [
 * {"key": "workerGroup",
 * "stringValue": "MyworkerGroup"}
 * ]
 * },
 * {"id": "Schedule",
 * "name": "Schedule",
 * "fields":
 * [
 * {"key": "startDateTime",
 * "stringValue": "2012-09-25T17:00:00"},
 * {"key": "type",
 * "stringValue": "Schedule"},
 * {"key": "period",
 * "stringValue": "1 hour"},
 * {"key": "endDateTime",
 * "stringValue": "2012-09-25T18:00:00"}
 * ]
 * },
 * {"id": "SayHello",
 * "name": "SayHello",
 * "fields":
 * [
 * {"key": "type",
 * "stringValue": "ShellCommandActivity"},
 * {"key": "command",
 * "stringValue": "echo hello"},
 * {"key": "parent",
 * "refValue": "Default"},
 * {"key": "schedule",
 * "refValue": "Schedule"}
 *
 * ]
 * }
 * ]
 * }
 *
 * x-amzn-RequestId: 92c9f347-0776-11e2-8a14-21bb8a1f50ef
 * Content-Type: application/x-amz-json-1.1
 * Content-Length: 18
 * Date: Mon, 12 Nov 2012 17:50:53 GMT
 *
 * {"errored": false}
 *
 * Example 2
 *
 * This example sets an invalid pipeline configuration and returns the associated set of validation errors.
 *
 * POST / HTTP/1.1
 * Content-Type: application/x-amz-json-1.1
 * X-Amz-Target: DataPipeline.ValidatePipelineDefinition
 * Content-Length: 903
 * Host: datapipeline.us-east-1.amazonaws.com
 * X-Amz-Date: Mon, 12 Nov 2012 17:49:52 GMT
 * Authorization: AuthParams
 *
 * {"pipelineId": "df-06372391ZG65EXAMPLE",
 * "pipelineObjects":
 * [
 * {"id": "Default",
 * "name": "Default",
 * "fields":
 * [
 * {"key": "workerGroup",
 * "stringValue": "MyworkerGroup"}
 * ]
 * },
 * {"id": "Schedule",
 * "name": "Schedule",
 * "fields":
 * [
 * {"key": "startDateTime",
 * "stringValue": "bad-time"},
 * {"key": "type",
 * "stringValue": "Schedule"},
 * {"key": "period",
 * "stringValue": "1 hour"},
 * {"key": "endDateTime",
 * "stringValue": "2012-09-25T18:00:00"}
 * ]
 * },
 * {"id": "SayHello",
 * "name": "SayHello",
 * "fields":
 * [
 * {"key": "type",
 * "stringValue": "ShellCommandActivity"},
 * {"key": "command",
 * "stringValue": "echo hello"},
 * {"key": "parent",
 * "refValue": "Default"},
 * {"key": "schedule",
 * "refValue": "Schedule"}
 *
 * ]
 * }
 * ]
 * }
 *
 * x-amzn-RequestId: 496a1f5a-0e6a-11e2-a61c-bd6312c92ddd
 * Content-Type: application/x-amz-json-1.1
 * Content-Length: 278
 * Date: Mon, 12 Nov 2012 17:50:53 GMT
 *
 * {"errored": true,
 * "validationErrors":
 * [
 * {"errors":
 * ["INVALID_FIELD_VALUE: 'startDateTime' value must be a literal datetime value."],
 * "id": "Schedule"}
 * ]
 * }
 */
export const validatePipelineDefinition: (
  input: ValidatePipelineDefinitionInput,
) => effect.Effect<
  ValidatePipelineDefinitionOutput,
  | InternalServiceError
  | InvalidRequestException
  | PipelineDeletedException
  | PipelineNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ValidatePipelineDefinitionInput,
  output: ValidatePipelineDefinitionOutput,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    PipelineDeletedException,
    PipelineNotFoundException,
  ],
}));
/**
 * Gets the object definitions for a set of objects associated with the pipeline. Object definitions are composed of
 * a set of fields that define the properties of the object.
 *
 * POST / HTTP/1.1
 * Content-Type: application/x-amz-json-1.1
 * X-Amz-Target: DataPipeline.DescribeObjects
 * Content-Length: 98
 * Host: datapipeline.us-east-1.amazonaws.com
 * X-Amz-Date: Mon, 12 Nov 2012 17:49:52 GMT
 * Authorization: AuthParams
 *
 * {"pipelineId": "df-06372391ZG65EXAMPLE",
 * "objectIds":
 * ["Schedule"],
 * "evaluateExpressions": true}
 *
 * x-amzn-RequestId: 4c18ea5d-0777-11e2-8a14-21bb8a1f50ef
 * Content-Type: application/x-amz-json-1.1
 * Content-Length: 1488
 * Date: Mon, 12 Nov 2012 17:50:53 GMT
 *
 * {"hasMoreResults": false,
 * "pipelineObjects":
 * [
 * {"fields":
 * [
 * {"key": "startDateTime",
 * "stringValue": "2012-12-12T00:00:00"},
 * {"key": "parent",
 * "refValue": "Default"},
 * {"key": "@sphere",
 * "stringValue": "COMPONENT"},
 * {"key": "type",
 * "stringValue": "Schedule"},
 * {"key": "period",
 * "stringValue": "1 hour"},
 * {"key": "endDateTime",
 * "stringValue": "2012-12-21T18:00:00"},
 * {"key": "@version",
 * "stringValue": "1"},
 * {"key": "@status",
 * "stringValue": "PENDING"},
 * {"key": "@pipelineId",
 * "stringValue": "df-06372391ZG65EXAMPLE"}
 * ],
 * "id": "Schedule",
 * "name": "Schedule"}
 * ]
 * }
 */
export const describeObjects: {
  (
    input: DescribeObjectsInput,
  ): effect.Effect<
    DescribeObjectsOutput,
    | InternalServiceError
    | InvalidRequestException
    | PipelineDeletedException
    | PipelineNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeObjectsInput,
  ) => stream.Stream<
    DescribeObjectsOutput,
    | InternalServiceError
    | InvalidRequestException
    | PipelineDeletedException
    | PipelineNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeObjectsInput,
  ) => stream.Stream<
    PipelineObject,
    | InternalServiceError
    | InvalidRequestException
    | PipelineDeletedException
    | PipelineNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeObjectsInput,
  output: DescribeObjectsOutput,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    PipelineDeletedException,
    PipelineNotFoundException,
  ],
  pagination: {
    inputToken: "marker",
    outputToken: "marker",
    items: "pipelineObjects",
  } as const,
}));
/**
 * Gets the definition of the specified pipeline. You can call `GetPipelineDefinition` to retrieve
 * the pipeline definition that you provided using PutPipelineDefinition.
 *
 * POST / HTTP/1.1
 * Content-Type: application/x-amz-json-1.1
 * X-Amz-Target: DataPipeline.GetPipelineDefinition
 * Content-Length: 40
 * Host: datapipeline.us-east-1.amazonaws.com
 * X-Amz-Date: Mon, 12 Nov 2012 17:49:52 GMT
 * Authorization: AuthParams
 *
 * {"pipelineId": "df-06372391ZG65EXAMPLE"}
 *
 * x-amzn-RequestId: e28309e5-0776-11e2-8a14-21bb8a1f50ef
 * Content-Type: application/x-amz-json-1.1
 * Content-Length: 890
 * Date: Mon, 12 Nov 2012 17:50:53 GMT
 *
 * {"pipelineObjects":
 * [
 * {"fields":
 * [
 * {"key": "workerGroup",
 * "stringValue": "workerGroup"}
 * ],
 * "id": "Default",
 * "name": "Default"},
 * {"fields":
 * [
 * {"key": "startDateTime",
 * "stringValue": "2012-09-25T17:00:00"},
 * {"key": "type",
 * "stringValue": "Schedule"},
 * {"key": "period",
 * "stringValue": "1 hour"},
 * {"key": "endDateTime",
 * "stringValue": "2012-09-25T18:00:00"}
 * ],
 * "id": "Schedule",
 * "name": "Schedule"},
 * {"fields":
 * [
 * {"key": "schedule",
 * "refValue": "Schedule"},
 * {"key": "command",
 * "stringValue": "echo hello"},
 * {"key": "parent",
 * "refValue": "Default"},
 * {"key": "type",
 * "stringValue": "ShellCommandActivity"}
 * ],
 * "id": "SayHello",
 * "name": "SayHello"}
 * ]
 * }
 */
export const getPipelineDefinition: (
  input: GetPipelineDefinitionInput,
) => effect.Effect<
  GetPipelineDefinitionOutput,
  | InternalServiceError
  | InvalidRequestException
  | PipelineDeletedException
  | PipelineNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPipelineDefinitionInput,
  output: GetPipelineDefinitionOutput,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    PipelineDeletedException,
    PipelineNotFoundException,
  ],
}));
/**
 * Removes existing tags from the specified pipeline.
 */
export const removeTags: (
  input: RemoveTagsInput,
) => effect.Effect<
  RemoveTagsOutput,
  | InternalServiceError
  | InvalidRequestException
  | PipelineDeletedException
  | PipelineNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveTagsInput,
  output: RemoveTagsOutput,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    PipelineDeletedException,
    PipelineNotFoundException,
  ],
}));
/**
 * Requests that the status of the specified physical or logical pipeline objects be updated in the specified pipeline.
 * This update might not occur immediately, but is eventually consistent. The status that can be set depends on the type of object (for example, DataNode or Activity).
 * You cannot perform this operation on `FINISHED` pipelines and attempting to do so returns `InvalidRequestException`.
 *
 * POST / HTTP/1.1
 * Content-Type: application/x-amz-json-1.1
 * X-Amz-Target: DataPipeline.SetStatus
 * Content-Length: 100
 * Host: datapipeline.us-east-1.amazonaws.com
 * X-Amz-Date: Mon, 12 Nov 2012 17:49:52 GMT
 * Authorization: AuthParams
 *
 * {"pipelineId": "df-0634701J7KEXAMPLE",
 * "objectIds":
 * ["o-08600941GHJWMBR9E2"],
 * "status": "pause"}
 *
 * x-amzn-RequestId: e83b8ab7-076a-11e2-af6f-6bc7a6be60d9
 * Content-Type: application/x-amz-json-1.1
 * Content-Length: 0
 * Date: Mon, 12 Nov 2012 17:50:53 GMT
 *
 * Unexpected response: 200, OK, undefined
 */
export const setStatus: (
  input: SetStatusInput,
) => effect.Effect<
  SetStatusResponse,
  | InternalServiceError
  | InvalidRequestException
  | PipelineDeletedException
  | PipelineNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetStatusInput,
  output: SetStatusResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    PipelineDeletedException,
    PipelineNotFoundException,
  ],
}));
/**
 * Validates the specified pipeline and starts processing pipeline tasks. If the pipeline does not pass validation,
 * activation fails.
 *
 * If you need to pause the pipeline to investigate an issue with a component, such as a data source or script,
 * call DeactivatePipeline.
 *
 * To activate a finished pipeline, modify the end date for the pipeline and then activate it.
 *
 * POST / HTTP/1.1
 * Content-Type: application/x-amz-json-1.1
 * X-Amz-Target: DataPipeline.ActivatePipeline
 * Content-Length: 39
 * Host: datapipeline.us-east-1.amazonaws.com
 * X-Amz-Date: Mon, 12 Nov 2012 17:49:52 GMT
 * Authorization: AuthParams
 *
 * {"pipelineId": "df-06372391ZG65EXAMPLE"}
 *
 * HTTP/1.1 200
 * x-amzn-RequestId: ee19d5bf-074e-11e2-af6f-6bc7a6be60d9
 * Content-Type: application/x-amz-json-1.1
 * Content-Length: 2
 * Date: Mon, 12 Nov 2012 17:50:53 GMT
 *
 * {}
 */
export const activatePipeline: (
  input: ActivatePipelineInput,
) => effect.Effect<
  ActivatePipelineOutput,
  | InternalServiceError
  | InvalidRequestException
  | PipelineDeletedException
  | PipelineNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ActivatePipelineInput,
  output: ActivatePipelineOutput,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    PipelineDeletedException,
    PipelineNotFoundException,
  ],
}));
/**
 * Adds or modifies tags for the specified pipeline.
 */
export const addTags: (
  input: AddTagsInput,
) => effect.Effect<
  AddTagsOutput,
  | InternalServiceError
  | InvalidRequestException
  | PipelineDeletedException
  | PipelineNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsInput,
  output: AddTagsOutput,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    PipelineDeletedException,
    PipelineNotFoundException,
  ],
}));
/**
 * Deactivates the specified running pipeline. The pipeline is set to the `DEACTIVATING`
 * state until the deactivation process completes.
 *
 * To resume a deactivated pipeline, use ActivatePipeline. By default, the pipeline resumes from the last completed execution.
 * Optionally, you can specify the date and time to resume the pipeline.
 */
export const deactivatePipeline: (
  input: DeactivatePipelineInput,
) => effect.Effect<
  DeactivatePipelineOutput,
  | InternalServiceError
  | InvalidRequestException
  | PipelineDeletedException
  | PipelineNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeactivatePipelineInput,
  output: DeactivatePipelineOutput,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    PipelineDeletedException,
    PipelineNotFoundException,
  ],
}));
/**
 * Adds tasks, schedules, and preconditions to the specified pipeline. You can use `PutPipelineDefinition` to populate a new pipeline.
 *
 * `PutPipelineDefinition` also validates the configuration as it adds it to the pipeline. Changes to the pipeline are saved unless one
 * of the following three validation errors exists in the pipeline.
 *
 * - An object is missing a name or identifier field.
 *
 * - A string or reference field is empty.
 *
 * - The number of objects in the pipeline exceeds the maximum allowed objects.
 *
 * - The pipeline is in a FINISHED state.
 *
 * Pipeline object definitions are passed to the `PutPipelineDefinition` action and returned by the GetPipelineDefinition action.
 *
 * Example 1
 *
 * This example sets an valid pipeline configuration and returns success.
 *
 * POST / HTTP/1.1
 * Content-Type: application/x-amz-json-1.1
 * X-Amz-Target: DataPipeline.PutPipelineDefinition
 * Content-Length: 914
 * Host: datapipeline.us-east-1.amazonaws.com
 * X-Amz-Date: Mon, 12 Nov 2012 17:49:52 GMT
 * Authorization: AuthParams
 *
 * {"pipelineId": "df-0937003356ZJEXAMPLE",
 * "pipelineObjects":
 * [
 * {"id": "Default",
 * "name": "Default",
 * "fields":
 * [
 * {"key": "workerGroup",
 * "stringValue": "workerGroup"}
 * ]
 * },
 * {"id": "Schedule",
 * "name": "Schedule",
 * "fields":
 * [
 * {"key": "startDateTime",
 * "stringValue": "2012-12-12T00:00:00"},
 * {"key": "type",
 * "stringValue": "Schedule"},
 * {"key": "period",
 * "stringValue": "1 hour"},
 * {"key": "endDateTime",
 * "stringValue": "2012-12-21T18:00:00"}
 * ]
 * },
 * {"id": "SayHello",
 * "name": "SayHello",
 * "fields":
 * [
 * {"key": "type",
 * "stringValue": "ShellCommandActivity"},
 * {"key": "command",
 * "stringValue": "echo hello"},
 * {"key": "parent",
 * "refValue": "Default"},
 * {"key": "schedule",
 * "refValue": "Schedule"}
 * ]
 * }
 * ]
 * }
 *
 * HTTP/1.1 200
 * x-amzn-RequestId: f74afc14-0754-11e2-af6f-6bc7a6be60d9
 * Content-Type: application/x-amz-json-1.1
 * Content-Length: 18
 * Date: Mon, 12 Nov 2012 17:50:53 GMT
 *
 * {"errored": false}
 *
 * Example 2
 *
 * This example sets an invalid pipeline configuration (the value for `workerGroup` is an empty string) and returns an error message.
 *
 * POST / HTTP/1.1
 * Content-Type: application/x-amz-json-1.1
 * X-Amz-Target: DataPipeline.PutPipelineDefinition
 * Content-Length: 903
 * Host: datapipeline.us-east-1.amazonaws.com
 * X-Amz-Date: Mon, 12 Nov 2012 17:49:52 GMT
 * Authorization: AuthParams
 *
 * {"pipelineId": "df-06372391ZG65EXAMPLE",
 * "pipelineObjects":
 * [
 * {"id": "Default",
 * "name": "Default",
 * "fields":
 * [
 * {"key": "workerGroup",
 * "stringValue": ""}
 * ]
 * },
 * {"id": "Schedule",
 * "name": "Schedule",
 * "fields":
 * [
 * {"key": "startDateTime",
 * "stringValue": "2012-09-25T17:00:00"},
 * {"key": "type",
 * "stringValue": "Schedule"},
 * {"key": "period",
 * "stringValue": "1 hour"},
 * {"key": "endDateTime",
 * "stringValue": "2012-09-25T18:00:00"}
 * ]
 * },
 * {"id": "SayHello",
 * "name": "SayHello",
 * "fields":
 * [
 * {"key": "type",
 * "stringValue": "ShellCommandActivity"},
 * {"key": "command",
 * "stringValue": "echo hello"},
 * {"key": "parent",
 * "refValue": "Default"},
 * {"key": "schedule",
 * "refValue": "Schedule"}
 *
 * ]
 * }
 * ]
 * }
 *
 * HTTP/1.1 200
 * x-amzn-RequestId: f74afc14-0754-11e2-af6f-6bc7a6be60d9
 * Content-Type: application/x-amz-json-1.1
 * Content-Length: 18
 * Date: Mon, 12 Nov 2012 17:50:53 GMT
 *
 * {"__type": "com.amazon.setl.webservice#InvalidRequestException",
 * "message": "Pipeline definition has errors: Could not save the pipeline definition due to FATAL errors: [com.amazon.setl.webservice.ValidationError@108d7ea9] Please call Validate to validate your pipeline"}
 */
export const putPipelineDefinition: (
  input: PutPipelineDefinitionInput,
) => effect.Effect<
  PutPipelineDefinitionOutput,
  | InternalServiceError
  | InvalidRequestException
  | PipelineDeletedException
  | PipelineNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutPipelineDefinitionInput,
  output: PutPipelineDefinitionOutput,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    PipelineDeletedException,
    PipelineNotFoundException,
  ],
}));
/**
 * Queries the specified pipeline for the names of objects that match the specified set of conditions.
 *
 * POST / HTTP/1.1
 * Content-Type: application/x-amz-json-1.1
 * X-Amz-Target: DataPipeline.QueryObjects
 * Content-Length: 123
 * Host: datapipeline.us-east-1.amazonaws.com
 * X-Amz-Date: Mon, 12 Nov 2012 17:49:52 GMT
 * Authorization: AuthParams
 *
 * {"pipelineId": "df-06372391ZG65EXAMPLE",
 * "query":
 * {"selectors":
 * [
 * ]
 * },
 * "sphere": "INSTANCE",
 * "marker": "",
 * "limit": 10}
 *
 * x-amzn-RequestId: 14d704c1-0775-11e2-af6f-6bc7a6be60d9
 * Content-Type: application/x-amz-json-1.1
 * Content-Length: 72
 * Date: Mon, 12 Nov 2012 17:50:53 GMT
 *
 * {"hasMoreResults": false,
 * "ids":
 * ["@SayHello_1_2012-09-25T17:00:00"]
 * }
 */
export const queryObjects: {
  (
    input: QueryObjectsInput,
  ): effect.Effect<
    QueryObjectsOutput,
    | InternalServiceError
    | InvalidRequestException
    | PipelineDeletedException
    | PipelineNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: QueryObjectsInput,
  ) => stream.Stream<
    QueryObjectsOutput,
    | InternalServiceError
    | InvalidRequestException
    | PipelineDeletedException
    | PipelineNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: QueryObjectsInput,
  ) => stream.Stream<
    Id,
    | InternalServiceError
    | InvalidRequestException
    | PipelineDeletedException
    | PipelineNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: QueryObjectsInput,
  output: QueryObjectsOutput,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    PipelineDeletedException,
    PipelineNotFoundException,
  ],
  pagination: {
    inputToken: "marker",
    outputToken: "marker",
    items: "ids",
    pageSize: "limit",
  } as const,
}));
/**
 * Task runners call `ReportTaskProgress` when assigned a task to acknowledge that it has the task. If the web service does not
 * receive this acknowledgement within 2 minutes, it assigns the task in a subsequent PollForTask call. After this initial acknowledgement,
 * the task runner only needs to report progress every 15 minutes to maintain its ownership of the task. You can change this reporting time
 * from 15 minutes by specifying a `reportProgressTimeout` field in your pipeline.
 *
 * If a task runner does not report its status after 5 minutes, AWS Data Pipeline assumes that the task runner is unable to process the task
 * and reassigns the task in a subsequent response to PollForTask. Task runners should call `ReportTaskProgress` every 60 seconds.
 *
 * POST / HTTP/1.1
 * Content-Type: application/x-amz-json-1.1
 * X-Amz-Target: DataPipeline.ReportTaskProgress
 * Content-Length: 832
 * Host: datapipeline.us-east-1.amazonaws.com
 * X-Amz-Date: Mon, 12 Nov 2012 17:49:52 GMT
 * Authorization: AuthParams
 *
 * {"taskId": "aaGgHT4LuH0T0Y0oLrJRjas5qH0d8cDPADxqq3tn+zCWGELkCdV2JprLreXm1oxeP5EFZHFLJ69kjSsLYE0iYHYBYVGBrB+E/pYq7ANEEeGJFnSBMRiXZVA+8UJ3OzcInvXeinqBmBaKwii7hnnKb/AXjXiNTXyxgydX1KAyg1AxkwBYG4cfPYMZbuEbQJFJvv5C/2+GVXz1w94nKYTeUeepwUOFOuRLS6JVtZoYwpF56E+Yfk1IcGpFOvCZ01B4Bkuu7x3J+MD/j6kJgZLAgbCJQtI3eiW3kdGmX0p0I2BdY1ZsX6b4UiSvM3OMj6NEHJCJL4E0ZfitnhCoe24Kvjo6C2hFbZq+ei/HPgSXBQMSagkr4vS9c0ChzxH2+LNYvec6bY4kymkaZI1dvOzmpa0FcnGf5AjSK4GpsViZ/ujz6zxFv81qBXzjF0/4M1775rjV1VUdyKaixiA/sJiACNezqZqETidp8d24BDPRhGsj6pBCrnelqGFrk/gXEXUsJ+xwMifRC8UVwiKekpAvHUywVk7Ku4jH/n3i2VoLRP6FXwpUbelu34iiZ9czpXyLtyPKwxa87dlrnRVURwkcVjOt2Mcrcaqe+cbWHvNRhyrPkkdfSF3ac8/wfgVbXvLEB2k9mKc67aD9rvdc1PKX09Tk8BKklsMTpZ3TRCd4NzQlJKigMe8Jat9+1tKj4Ole5ZzW6uyTu2s2iFjEV8KXu4MaiRJyNKCdKeGhhZWY37Qk4NBK4Ppgu+C6Y41dpfOh288SLDEVx0/UySlqOEdhba7c6BiPp5r3hKj3mk9lFy5OYp1aoGLeeFmjXveTnPdf2gkWqXXg7AUbJ7jEs1F0lKZQg4szep2gcKyAJXgvXLfJJHcha8Lfb/Ee7wYmyOcAaRpDBoFNSbtoVXar46teIrpho+ZDvynUXvU0grHWGOk=:wn3SgymHZM99bEXAMPLE",
 * "fields":
 * [
 * {"key": "percentComplete",
 * "stringValue": "50"}
 * ]
 * }
 *
 * x-amzn-RequestId: 640bd023-0775-11e2-af6f-6bc7a6be60d9
 * Content-Type: application/x-amz-json-1.1
 * Content-Length: 18
 * Date: Mon, 12 Nov 2012 17:50:53 GMT
 *
 * {"canceled": false}
 */
export const reportTaskProgress: (
  input: ReportTaskProgressInput,
) => effect.Effect<
  ReportTaskProgressOutput,
  | InternalServiceError
  | InvalidRequestException
  | PipelineDeletedException
  | PipelineNotFoundException
  | TaskNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReportTaskProgressInput,
  output: ReportTaskProgressOutput,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    PipelineDeletedException,
    PipelineNotFoundException,
    TaskNotFoundException,
  ],
}));
/**
 * Task runners call `EvaluateExpression` to evaluate a string in the context of the specified object.
 * For example, a task runner can evaluate SQL queries stored in Amazon S3.
 *
 * POST / HTTP/1.1
 * Content-Type: application/x-amz-json-1.1
 * X-Amz-Target: DataPipeline.DescribePipelines
 * Content-Length: 164
 * Host: datapipeline.us-east-1.amazonaws.com
 * X-Amz-Date: Mon, 12 Nov 2012 17:49:52 GMT
 * Authorization: AuthParams
 *
 * {"pipelineId": "df-08785951KAKJEXAMPLE",
 * "objectId": "Schedule",
 * "expression": "Transform started at #{startDateTime} and finished at #{endDateTime}"}
 *
 * x-amzn-RequestId: 02870eb7-0736-11e2-af6f-6bc7a6be60d9
 * Content-Type: application/x-amz-json-1.1
 * Content-Length: 103
 * Date: Mon, 12 Nov 2012 17:50:53 GMT
 *
 * {"evaluatedExpression": "Transform started at 2012-12-12T00:00:00 and finished at 2012-12-21T18:00:00"}
 */
export const evaluateExpression: (
  input: EvaluateExpressionInput,
) => effect.Effect<
  EvaluateExpressionOutput,
  | InternalServiceError
  | InvalidRequestException
  | PipelineDeletedException
  | PipelineNotFoundException
  | TaskNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EvaluateExpressionInput,
  output: EvaluateExpressionOutput,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    PipelineDeletedException,
    PipelineNotFoundException,
    TaskNotFoundException,
  ],
}));
/**
 * Task runners call `SetTaskStatus` to notify AWS Data Pipeline that a task is completed and provide information about the final status.
 * A task runner makes this call regardless of whether the task was sucessful. A task runner does not need to call `SetTaskStatus` for
 * tasks that are canceled by the web service during a call to ReportTaskProgress.
 *
 * POST / HTTP/1.1
 * Content-Type: application/x-amz-json-1.1
 * X-Amz-Target: DataPipeline.SetTaskStatus
 * Content-Length: 847
 * Host: datapipeline.us-east-1.amazonaws.com
 * X-Amz-Date: Mon, 12 Nov 2012 17:49:52 GMT
 * Authorization: AuthParams
 *
 * {"taskId": "aaGgHT4LuH0T0Y0oLrJRjas5qH0d8cDPADxqq3tn+zCWGELkCdV2JprLreXm1oxeP5EFZHFLJ69kjSsLYE0iYHYBYVGBrB+E/pYq7ANEEeGJFnSBMRiXZVA+8UJ3OzcInvXeinqBmBaKwii7hnnKb/AXjXiNTXyxgydX1KAyg1AxkwBYG4cfPYMZbuEbQJFJvv5C/2+GVXz1w94nKYTeUeepwUOFOuRLS6JVtZoYwpF56E+Yfk1IcGpFOvCZ01B4Bkuu7x3J+MD/j6kJgZLAgbCJQtI3eiW3kdGmX0p0I2BdY1ZsX6b4UiSvM3OMj6NEHJCJL4E0ZfitnhCoe24Kvjo6C2hFbZq+ei/HPgSXBQMSagkr4vS9c0ChzxH2+LNYvec6bY4kymkaZI1dvOzmpa0FcnGf5AjSK4GpsViZ/ujz6zxFv81qBXzjF0/4M1775rjV1VUdyKaixiA/sJiACNezqZqETidp8d24BDPRhGsj6pBCrnelqGFrk/gXEXUsJ+xwMifRC8UVwiKekpAvHUywVk7Ku4jH/n3i2VoLRP6FXwpUbelu34iiZ9czpXyLtyPKwxa87dlrnRVURwkcVjOt2Mcrcaqe+cbWHvNRhyrPkkdfSF3ac8/wfgVbXvLEB2k9mKc67aD9rvdc1PKX09Tk8BKklsMTpZ3TRCd4NzQlJKigMe8Jat9+1tKj4Ole5ZzW6uyTu2s2iFjEV8KXu4MaiRJyNKCdKeGhhZWY37Qk4NBK4Ppgu+C6Y41dpfOh288SLDEVx0/UySlqOEdhba7c6BiPp5r3hKj3mk9lFy5OYp1aoGLeeFmjXveTnPdf2gkWqXXg7AUbJ7jEs1F0lKZQg4szep2gcKyAJXgvXLfJJHcha8Lfb/Ee7wYmyOcAaRpDBoFNSbtoVXar46teIrpho+ZDvynUXvU0grHWGOk=:wn3SgymHZM99bEXAMPLE",
 * "taskStatus": "FINISHED"}
 *
 * x-amzn-RequestId: 8c8deb53-0788-11e2-af9c-6bc7a6be6qr8
 * Content-Type: application/x-amz-json-1.1
 * Content-Length: 0
 * Date: Mon, 12 Nov 2012 17:50:53 GMT
 *
 * {}
 */
export const setTaskStatus: (
  input: SetTaskStatusInput,
) => effect.Effect<
  SetTaskStatusOutput,
  | InternalServiceError
  | InvalidRequestException
  | PipelineDeletedException
  | PipelineNotFoundException
  | TaskNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetTaskStatusInput,
  output: SetTaskStatusOutput,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    PipelineDeletedException,
    PipelineNotFoundException,
    TaskNotFoundException,
  ],
}));
/**
 * Task runners call `PollForTask` to receive a task to perform from AWS Data Pipeline. The task runner specifies which tasks it can perform
 * by setting a value for the `workerGroup` parameter. The task returned can come from any of the pipelines that
 * match the `workerGroup` value passed in by the task runner and that was launched using the IAM user credentials
 * specified by the task runner.
 *
 * If tasks are ready in the work queue, `PollForTask` returns a response immediately. If no tasks are available in the queue,
 * `PollForTask` uses long-polling and holds on to a poll connection for up to a 90 seconds, during which time the first newly
 * scheduled task is handed to the task runner. To accomodate this, set the socket timeout in your task runner to 90 seconds. The task
 * runner should not call `PollForTask` again on the same `workerGroup` until it receives a response, and this can take up to 90 seconds.
 *
 * POST / HTTP/1.1
 * Content-Type: application/x-amz-json-1.1
 * X-Amz-Target: DataPipeline.PollForTask
 * Content-Length: 59
 * Host: datapipeline.us-east-1.amazonaws.com
 * X-Amz-Date: Mon, 12 Nov 2012 17:49:52 GMT
 * Authorization: AuthParams
 *
 * {"workerGroup": "MyworkerGroup",
 * "hostname": "example.com"}
 *
 * x-amzn-RequestId: 41c713d2-0775-11e2-af6f-6bc7a6be60d9
 * Content-Type: application/x-amz-json-1.1
 * Content-Length: 39
 * Date: Mon, 12 Nov 2012 17:50:53 GMT
 *
 * {"taskObject":
 * {"attemptId": "@SayHello_2012-12-12T00:00:00_Attempt=1",
 * "objects":
 * {"@SayHello_2012-12-12T00:00:00_Attempt=1":
 * {"fields":
 * [
 * {"key": "@componentParent",
 * "refValue": "SayHello"},
 * {"key": "@scheduledStartTime",
 * "stringValue": "2012-12-12T00:00:00"},
 * {"key": "parent",
 * "refValue": "SayHello"},
 * {"key": "@sphere",
 * "stringValue": "ATTEMPT"},
 * {"key": "workerGroup",
 * "stringValue": "workerGroup"},
 * {"key": "@instanceParent",
 * "refValue": "@SayHello_2012-12-12T00:00:00"},
 * {"key": "type",
 * "stringValue": "ShellCommandActivity"},
 * {"key": "@status",
 * "stringValue": "WAITING_FOR_RUNNER"},
 * {"key": "@version",
 * "stringValue": "1"},
 * {"key": "schedule",
 * "refValue": "Schedule"},
 * {"key": "@actualStartTime",
 * "stringValue": "2012-12-13T01:40:50"},
 * {"key": "command",
 * "stringValue": "echo hello"},
 * {"key": "@scheduledEndTime",
 * "stringValue": "2012-12-12T01:00:00"},
 * {"key": "@activeInstances",
 * "refValue": "@SayHello_2012-12-12T00:00:00"},
 * {"key": "@pipelineId",
 * "stringValue": "df-0937003356ZJEXAMPLE"}
 * ],
 * "id": "@SayHello_2012-12-12T00:00:00_Attempt=1",
 * "name": "@SayHello_2012-12-12T00:00:00_Attempt=1"}
 * },
 * "pipelineId": "df-0937003356ZJEXAMPLE",
 * "taskId": "2xaM4wRs5zOsIH+g9U3oVHfAgAlbSqU6XduncB0HhZ3xMnmvfePZPn4dIbYXHyWyRK+cU15MqDHwdrvftx/4wv+sNS4w34vJfv7QA9aOoOazW28l1GYSb2ZRR0N0paiQp+d1MhSKo10hOTWOsVK5S5Lnx9Qm6omFgXHyIvZRIvTlrQMpr1xuUrflyGOfbFOGpOLpvPE172MYdqpZKnbSS4TcuqgQKSWV2833fEubI57DPOP7ghWa2TcYeSIv4pdLYG53fTuwfbnbdc98g2LNUQzSVhSnt7BoqyNwht2aQ6b/UHg9A80+KVpuXuqmz3m1MXwHFgxjdmuesXNOrrlGpeLCcRWD+aGo0RN1NqhQRzNAig8V4GlaPTQzMsRCljKqvrIyAoP3Tt2XEGsHkkQo12rEX8Z90957XX2qKRwhruwYzqGkSLWjINoLdAxUJdpRXRc5DJTrBd3D5mdzn7kY1l7NEh4kFHJDt3Cx4Z3Mk8MYCACyCk/CEyy9DwuPi66cLz0NBcgbCM5LKjTBOwo1m+am+pvM1kSposE9FPP1+RFGb8k6jQBTJx3TRz1yKilnGXQTZ5xvdOFpJrklIT0OXP1MG3+auM9FlJA+1dX90QoNJE5z7axmK//MOGXUdkqFe2kiDkorqjxwDvc0Js9pVKfKvAmW8YqUbmI9l0ERpWCXXnLVHNmPWz3jaPY+OBAmuJWDmxB/Z8p94aEDg4BVXQ7LvsKQ3DLYhaB7yJ390CJT+i0mm+EBqY60V6YikPSWDFrYQ/NPi2b1DgE19mX8zHqw8qprIl4yh1Ckx2Iige4En/N5ktOoIxnASxAw/TzcE2skxdw5KlHDF+UTj71m16CR/dIaKlXijlfNlNzUBo/bNSadCQn3G5NoO501wPKI:XO50TgDNyo8EXAMPLE/g==:1"}
 * }
 */
export const pollForTask: (
  input: PollForTaskInput,
) => effect.Effect<
  PollForTaskOutput,
  | InternalServiceError
  | InvalidRequestException
  | TaskNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PollForTaskInput,
  output: PollForTaskOutput,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    TaskNotFoundException,
  ],
}));
