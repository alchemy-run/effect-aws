import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({ sdkId: "tnb", serviceShapeName: "TNB" });
const auth = T.AwsAuthSigv4({ name: "tnb" });
const ver = T.ServiceVersion("2008-10-21");
const proto = T.AwsProtocolsRestJson1();
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://tnb-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://tnb-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://tnb.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://tnb.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeys = S.Array(S.String);
export class CancelSolNetworkOperationInput extends S.Class<CancelSolNetworkOperationInput>(
  "CancelSolNetworkOperationInput",
)(
  { nsLcmOpOccId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/sol/nslcm/v1/ns_lcm_op_occs/{nsLcmOpOccId}/cancel",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelSolNetworkOperationResponse extends S.Class<CancelSolNetworkOperationResponse>(
  "CancelSolNetworkOperationResponse",
)({}) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateSolNetworkInstanceInput extends S.Class<CreateSolNetworkInstanceInput>(
  "CreateSolNetworkInstanceInput",
)(
  {
    nsdInfoId: S.String,
    nsName: S.String,
    nsDescription: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/sol/nslcm/v1/ns_instances" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSolNetworkPackageInput extends S.Class<CreateSolNetworkPackageInput>(
  "CreateSolNetworkPackageInput",
)(
  { tags: S.optional(TagMap) },
  T.all(
    T.Http({ method: "POST", uri: "/sol/nsd/v1/ns_descriptors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSolFunctionPackageInput extends S.Class<DeleteSolFunctionPackageInput>(
  "DeleteSolFunctionPackageInput",
)(
  { vnfPkgId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/sol/vnfpkgm/v1/vnf_packages/{vnfPkgId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSolFunctionPackageResponse extends S.Class<DeleteSolFunctionPackageResponse>(
  "DeleteSolFunctionPackageResponse",
)({}) {}
export class DeleteSolNetworkInstanceInput extends S.Class<DeleteSolNetworkInstanceInput>(
  "DeleteSolNetworkInstanceInput",
)(
  { nsInstanceId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/sol/nslcm/v1/ns_instances/{nsInstanceId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSolNetworkInstanceResponse extends S.Class<DeleteSolNetworkInstanceResponse>(
  "DeleteSolNetworkInstanceResponse",
)({}) {}
export class DeleteSolNetworkPackageInput extends S.Class<DeleteSolNetworkPackageInput>(
  "DeleteSolNetworkPackageInput",
)(
  { nsdInfoId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/sol/nsd/v1/ns_descriptors/{nsdInfoId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSolNetworkPackageResponse extends S.Class<DeleteSolNetworkPackageResponse>(
  "DeleteSolNetworkPackageResponse",
)({}) {}
export class GetSolFunctionInstanceInput extends S.Class<GetSolFunctionInstanceInput>(
  "GetSolFunctionInstanceInput",
)(
  { vnfInstanceId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/sol/vnflcm/v1/vnf_instances/{vnfInstanceId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSolFunctionPackageInput extends S.Class<GetSolFunctionPackageInput>(
  "GetSolFunctionPackageInput",
)(
  { vnfPkgId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/sol/vnfpkgm/v1/vnf_packages/{vnfPkgId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSolFunctionPackageContentInput extends S.Class<GetSolFunctionPackageContentInput>(
  "GetSolFunctionPackageContentInput",
)(
  {
    vnfPkgId: S.String.pipe(T.HttpLabel()),
    accept: S.String.pipe(T.HttpHeader("Accept")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/sol/vnfpkgm/v1/vnf_packages/{vnfPkgId}/package_content",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSolFunctionPackageDescriptorInput extends S.Class<GetSolFunctionPackageDescriptorInput>(
  "GetSolFunctionPackageDescriptorInput",
)(
  {
    vnfPkgId: S.String.pipe(T.HttpLabel()),
    accept: S.String.pipe(T.HttpHeader("Accept")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/sol/vnfpkgm/v1/vnf_packages/{vnfPkgId}/vnfd",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSolNetworkInstanceInput extends S.Class<GetSolNetworkInstanceInput>(
  "GetSolNetworkInstanceInput",
)(
  { nsInstanceId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/sol/nslcm/v1/ns_instances/{nsInstanceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSolNetworkOperationInput extends S.Class<GetSolNetworkOperationInput>(
  "GetSolNetworkOperationInput",
)(
  { nsLcmOpOccId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/sol/nslcm/v1/ns_lcm_op_occs/{nsLcmOpOccId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSolNetworkPackageInput extends S.Class<GetSolNetworkPackageInput>(
  "GetSolNetworkPackageInput",
)(
  { nsdInfoId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/sol/nsd/v1/ns_descriptors/{nsdInfoId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSolNetworkPackageContentInput extends S.Class<GetSolNetworkPackageContentInput>(
  "GetSolNetworkPackageContentInput",
)(
  {
    nsdInfoId: S.String.pipe(T.HttpLabel()),
    accept: S.String.pipe(T.HttpHeader("Accept")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/sol/nsd/v1/ns_descriptors/{nsdInfoId}/nsd_content",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSolNetworkPackageDescriptorInput extends S.Class<GetSolNetworkPackageDescriptorInput>(
  "GetSolNetworkPackageDescriptorInput",
)(
  { nsdInfoId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/sol/nsd/v1/ns_descriptors/{nsdInfoId}/nsd",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InstantiateSolNetworkInstanceInput extends S.Class<InstantiateSolNetworkInstanceInput>(
  "InstantiateSolNetworkInstanceInput",
)(
  {
    nsInstanceId: S.String.pipe(T.HttpLabel()),
    dryRun: S.optional(S.Boolean).pipe(T.HttpQuery("dry_run")),
    additionalParamsForNs: S.optional(S.Any),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/sol/nslcm/v1/ns_instances/{nsInstanceId}/instantiate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSolFunctionInstancesInput extends S.Class<ListSolFunctionInstancesInput>(
  "ListSolFunctionInstancesInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextpage_opaque_marker")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/sol/vnflcm/v1/vnf_instances" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSolFunctionPackagesInput extends S.Class<ListSolFunctionPackagesInput>(
  "ListSolFunctionPackagesInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextpage_opaque_marker")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/sol/vnfpkgm/v1/vnf_packages" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSolNetworkInstancesInput extends S.Class<ListSolNetworkInstancesInput>(
  "ListSolNetworkInstancesInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextpage_opaque_marker")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/sol/nslcm/v1/ns_instances" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSolNetworkOperationsInput extends S.Class<ListSolNetworkOperationsInput>(
  "ListSolNetworkOperationsInput",
)(
  {
    nsInstanceId: S.optional(S.String).pipe(T.HttpQuery("nsInstanceId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextpage_opaque_marker")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/sol/nslcm/v1/ns_lcm_op_occs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSolNetworkPackagesInput extends S.Class<ListSolNetworkPackagesInput>(
  "ListSolNetworkPackagesInput",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_results")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextpage_opaque_marker")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/sol/nsd/v1/ns_descriptors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutSolFunctionPackageContentInput extends S.Class<PutSolFunctionPackageContentInput>(
  "PutSolFunctionPackageContentInput",
)(
  {
    vnfPkgId: S.String.pipe(T.HttpLabel()),
    contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    file: T.StreamingInput.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/sol/vnfpkgm/v1/vnf_packages/{vnfPkgId}/package_content",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutSolNetworkPackageContentInput extends S.Class<PutSolNetworkPackageContentInput>(
  "PutSolNetworkPackageContentInput",
)(
  {
    nsdInfoId: S.String.pipe(T.HttpLabel()),
    contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    file: T.StreamingInput.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/sol/nsd/v1/ns_descriptors/{nsdInfoId}/nsd_content",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()), tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({}) {}
export class TerminateSolNetworkInstanceInput extends S.Class<TerminateSolNetworkInstanceInput>(
  "TerminateSolNetworkInstanceInput",
)(
  { nsInstanceId: S.String.pipe(T.HttpLabel()), tags: S.optional(TagMap) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/sol/nslcm/v1/ns_instances/{nsInstanceId}/terminate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel()),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}) {}
export class UpdateSolFunctionPackageInput extends S.Class<UpdateSolFunctionPackageInput>(
  "UpdateSolFunctionPackageInput",
)(
  { vnfPkgId: S.String.pipe(T.HttpLabel()), operationalState: S.String },
  T.all(
    T.Http({ method: "PATCH", uri: "/sol/vnfpkgm/v1/vnf_packages/{vnfPkgId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSolNetworkPackageInput extends S.Class<UpdateSolNetworkPackageInput>(
  "UpdateSolNetworkPackageInput",
)(
  { nsdInfoId: S.String.pipe(T.HttpLabel()), nsdOperationalState: S.String },
  T.all(
    T.Http({ method: "PATCH", uri: "/sol/nsd/v1/ns_descriptors/{nsdInfoId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ValidateSolFunctionPackageContentInput extends S.Class<ValidateSolFunctionPackageContentInput>(
  "ValidateSolFunctionPackageContentInput",
)(
  {
    vnfPkgId: S.String.pipe(T.HttpLabel()),
    contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    file: T.StreamingInput.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/sol/vnfpkgm/v1/vnf_packages/{vnfPkgId}/package_content/validate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ValidateSolNetworkPackageContentInput extends S.Class<ValidateSolNetworkPackageContentInput>(
  "ValidateSolNetworkPackageContentInput",
)(
  {
    nsdInfoId: S.String.pipe(T.HttpLabel()),
    contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    file: T.StreamingInput.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/sol/nsd/v1/ns_descriptors/{nsdInfoId}/nsd_content/validate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const VnfPkgIdList = S.Array(S.String);
export class UpdateSolNetworkModify extends S.Class<UpdateSolNetworkModify>(
  "UpdateSolNetworkModify",
)({ vnfInstanceId: S.String, vnfConfigurableProperties: S.Any }) {}
export class UpdateSolNetworkServiceData extends S.Class<UpdateSolNetworkServiceData>(
  "UpdateSolNetworkServiceData",
)({ nsdInfoId: S.String, additionalParamsForNs: S.optional(S.Any) }) {}
export class CreateSolFunctionPackageInput extends S.Class<CreateSolFunctionPackageInput>(
  "CreateSolFunctionPackageInput",
)(
  { tags: S.optional(TagMap) },
  T.all(
    T.Http({ method: "POST", uri: "/sol/vnfpkgm/v1/vnf_packages" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSolNetworkInstanceOutput extends S.Class<CreateSolNetworkInstanceOutput>(
  "CreateSolNetworkInstanceOutput",
)({
  id: S.String,
  arn: S.String,
  nsdInfoId: S.String,
  nsInstanceName: S.String,
  tags: S.optional(TagMap),
}) {}
export class CreateSolNetworkPackageOutput extends S.Class<CreateSolNetworkPackageOutput>(
  "CreateSolNetworkPackageOutput",
)({
  id: S.String,
  arn: S.String,
  nsdOnboardingState: S.String,
  nsdOperationalState: S.String,
  nsdUsageState: S.String,
  tags: S.optional(TagMap),
}) {}
export class GetSolFunctionPackageContentOutput extends S.Class<GetSolFunctionPackageContentOutput>(
  "GetSolFunctionPackageContentOutput",
)({
  contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  packageContent: S.optional(T.Blob).pipe(T.HttpPayload()),
}) {}
export class GetSolFunctionPackageDescriptorOutput extends S.Class<GetSolFunctionPackageDescriptorOutput>(
  "GetSolFunctionPackageDescriptorOutput",
)({
  contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  vnfd: S.optional(T.Blob).pipe(T.HttpPayload()),
}) {}
export class GetSolNetworkPackageContentOutput extends S.Class<GetSolNetworkPackageContentOutput>(
  "GetSolNetworkPackageContentOutput",
)({
  contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  nsdContent: S.optional(T.Blob).pipe(T.HttpPayload()),
}) {}
export class GetSolNetworkPackageDescriptorOutput extends S.Class<GetSolNetworkPackageDescriptorOutput>(
  "GetSolNetworkPackageDescriptorOutput",
)({
  contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  nsd: S.optional(T.Blob).pipe(T.HttpPayload()),
}) {}
export class InstantiateSolNetworkInstanceOutput extends S.Class<InstantiateSolNetworkInstanceOutput>(
  "InstantiateSolNetworkInstanceOutput",
)({ nsLcmOpOccId: S.String, tags: S.optional(TagMap) }) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ tags: TagMap }) {}
export class TerminateSolNetworkInstanceOutput extends S.Class<TerminateSolNetworkInstanceOutput>(
  "TerminateSolNetworkInstanceOutput",
)({ nsLcmOpOccId: S.optional(S.String), tags: S.optional(TagMap) }) {}
export class UpdateSolFunctionPackageOutput extends S.Class<UpdateSolFunctionPackageOutput>(
  "UpdateSolFunctionPackageOutput",
)({ operationalState: S.String }) {}
export class UpdateSolNetworkInstanceInput extends S.Class<UpdateSolNetworkInstanceInput>(
  "UpdateSolNetworkInstanceInput",
)(
  {
    nsInstanceId: S.String.pipe(T.HttpLabel()),
    updateType: S.String,
    modifyVnfInfoData: S.optional(UpdateSolNetworkModify),
    updateNs: S.optional(UpdateSolNetworkServiceData),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/sol/nslcm/v1/ns_instances/{nsInstanceId}/update",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSolNetworkPackageOutput extends S.Class<UpdateSolNetworkPackageOutput>(
  "UpdateSolNetworkPackageOutput",
)({ nsdOperationalState: S.String }) {}
export class GetSolFunctionInstanceMetadata extends S.Class<GetSolFunctionInstanceMetadata>(
  "GetSolFunctionInstanceMetadata",
)({
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastModified: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class LcmOperationInfo extends S.Class<LcmOperationInfo>(
  "LcmOperationInfo",
)({ nsLcmOpOccId: S.String }) {}
export class GetSolNetworkInstanceMetadata extends S.Class<GetSolNetworkInstanceMetadata>(
  "GetSolNetworkInstanceMetadata",
)({
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastModified: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ProblemDetails extends S.Class<ProblemDetails>("ProblemDetails")({
  detail: S.String,
  title: S.optional(S.String),
}) {}
export class ToscaOverride extends S.Class<ToscaOverride>("ToscaOverride")({
  name: S.optional(S.String),
  defaultValue: S.optional(S.String),
}) {}
export const OverrideList = S.Array(ToscaOverride);
export class FunctionArtifactMeta extends S.Class<FunctionArtifactMeta>(
  "FunctionArtifactMeta",
)({ overrides: S.optional(OverrideList) }) {}
export class PutSolFunctionPackageContentMetadata extends S.Class<PutSolFunctionPackageContentMetadata>(
  "PutSolFunctionPackageContentMetadata",
)({ vnfd: S.optional(FunctionArtifactMeta) }) {}
export class NetworkArtifactMeta extends S.Class<NetworkArtifactMeta>(
  "NetworkArtifactMeta",
)({ overrides: S.optional(OverrideList) }) {}
export class PutSolNetworkPackageContentMetadata extends S.Class<PutSolNetworkPackageContentMetadata>(
  "PutSolNetworkPackageContentMetadata",
)({ nsd: S.optional(NetworkArtifactMeta) }) {}
export class ValidateSolFunctionPackageContentMetadata extends S.Class<ValidateSolFunctionPackageContentMetadata>(
  "ValidateSolFunctionPackageContentMetadata",
)({ vnfd: S.optional(FunctionArtifactMeta) }) {}
export class ValidateSolNetworkPackageContentMetadata extends S.Class<ValidateSolNetworkPackageContentMetadata>(
  "ValidateSolNetworkPackageContentMetadata",
)({ nsd: S.optional(NetworkArtifactMeta) }) {}
export class CreateSolFunctionPackageOutput extends S.Class<CreateSolFunctionPackageOutput>(
  "CreateSolFunctionPackageOutput",
)({
  id: S.String,
  arn: S.String,
  onboardingState: S.String,
  operationalState: S.String,
  usageState: S.String,
  tags: S.optional(TagMap),
}) {}
export class GetSolNetworkInstanceOutput extends S.Class<GetSolNetworkInstanceOutput>(
  "GetSolNetworkInstanceOutput",
)({
  id: S.String,
  arn: S.String,
  nsInstanceName: S.String,
  nsInstanceDescription: S.String,
  nsdId: S.String,
  nsdInfoId: S.String,
  nsState: S.optional(S.String),
  lcmOpInfo: S.optional(LcmOperationInfo),
  metadata: GetSolNetworkInstanceMetadata,
  tags: S.optional(TagMap),
}) {}
export class PutSolFunctionPackageContentOutput extends S.Class<PutSolFunctionPackageContentOutput>(
  "PutSolFunctionPackageContentOutput",
)({
  id: S.String,
  vnfdId: S.String,
  vnfProductName: S.String,
  vnfProvider: S.String,
  vnfdVersion: S.String,
  metadata: PutSolFunctionPackageContentMetadata,
}) {}
export class PutSolNetworkPackageContentOutput extends S.Class<PutSolNetworkPackageContentOutput>(
  "PutSolNetworkPackageContentOutput",
)({
  id: S.String,
  arn: S.String,
  nsdId: S.String,
  nsdName: S.String,
  nsdVersion: S.String,
  vnfPkgIds: VnfPkgIdList,
  metadata: PutSolNetworkPackageContentMetadata,
}) {}
export class UpdateSolNetworkInstanceOutput extends S.Class<UpdateSolNetworkInstanceOutput>(
  "UpdateSolNetworkInstanceOutput",
)({ nsLcmOpOccId: S.optional(S.String), tags: S.optional(TagMap) }) {}
export class ValidateSolFunctionPackageContentOutput extends S.Class<ValidateSolFunctionPackageContentOutput>(
  "ValidateSolFunctionPackageContentOutput",
)({
  id: S.String,
  vnfdId: S.String,
  vnfProductName: S.String,
  vnfProvider: S.String,
  vnfdVersion: S.String,
  metadata: ValidateSolFunctionPackageContentMetadata,
}) {}
export class ValidateSolNetworkPackageContentOutput extends S.Class<ValidateSolNetworkPackageContentOutput>(
  "ValidateSolNetworkPackageContentOutput",
)({
  id: S.String,
  arn: S.String,
  nsdId: S.String,
  nsdName: S.String,
  nsdVersion: S.String,
  vnfPkgIds: VnfPkgIdList,
  metadata: ValidateSolNetworkPackageContentMetadata,
}) {}
export class UpdateNsMetadata extends S.Class<UpdateNsMetadata>(
  "UpdateNsMetadata",
)({ nsdInfoId: S.String, additionalParamsForNs: S.optional(S.Any) }) {}
export class ModifyVnfInfoMetadata extends S.Class<ModifyVnfInfoMetadata>(
  "ModifyVnfInfoMetadata",
)({ vnfInstanceId: S.String, vnfConfigurableProperties: S.Any }) {}
export class InstantiateMetadata extends S.Class<InstantiateMetadata>(
  "InstantiateMetadata",
)({ nsdInfoId: S.String, additionalParamsForNs: S.optional(S.Any) }) {}
export const StringMap = S.Record({ key: S.String, value: S.String });
export class ErrorInfo extends S.Class<ErrorInfo>("ErrorInfo")({
  cause: S.optional(S.String),
  details: S.optional(S.String),
}) {}
export class GetSolInstantiatedVnfInfo extends S.Class<GetSolInstantiatedVnfInfo>(
  "GetSolInstantiatedVnfInfo",
)({ vnfState: S.optional(S.String) }) {}
export class ListSolFunctionInstanceMetadata extends S.Class<ListSolFunctionInstanceMetadata>(
  "ListSolFunctionInstanceMetadata",
)({
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastModified: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ListSolFunctionPackageMetadata extends S.Class<ListSolFunctionPackageMetadata>(
  "ListSolFunctionPackageMetadata",
)({
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastModified: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ListSolNetworkInstanceMetadata extends S.Class<ListSolNetworkInstanceMetadata>(
  "ListSolNetworkInstanceMetadata",
)({
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastModified: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ListSolNetworkOperationsMetadata extends S.Class<ListSolNetworkOperationsMetadata>(
  "ListSolNetworkOperationsMetadata",
)({
  nsdInfoId: S.optional(S.String),
  vnfInstanceId: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastModified: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ListSolNetworkPackageMetadata extends S.Class<ListSolNetworkPackageMetadata>(
  "ListSolNetworkPackageMetadata",
)({
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastModified: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class GetSolNetworkOperationMetadata extends S.Class<GetSolNetworkOperationMetadata>(
  "GetSolNetworkOperationMetadata",
)({
  updateNsMetadata: S.optional(UpdateNsMetadata),
  modifyVnfInfoMetadata: S.optional(ModifyVnfInfoMetadata),
  instantiateMetadata: S.optional(InstantiateMetadata),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastModified: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class GetSolNetworkOperationTaskDetails extends S.Class<GetSolNetworkOperationTaskDetails>(
  "GetSolNetworkOperationTaskDetails",
)({
  taskName: S.optional(S.String),
  taskContext: S.optional(StringMap),
  taskErrorDetails: S.optional(ErrorInfo),
  taskStatus: S.optional(S.String),
  taskStartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  taskEndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const GetSolNetworkOperationTasksList = S.Array(
  GetSolNetworkOperationTaskDetails,
);
export class GetSolNetworkPackageMetadata extends S.Class<GetSolNetworkPackageMetadata>(
  "GetSolNetworkPackageMetadata",
)({
  nsd: S.optional(NetworkArtifactMeta),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastModified: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ListSolFunctionInstanceInfo extends S.Class<ListSolFunctionInstanceInfo>(
  "ListSolFunctionInstanceInfo",
)({
  id: S.String,
  arn: S.String,
  nsInstanceId: S.String,
  vnfPkgId: S.String,
  vnfPkgName: S.optional(S.String),
  instantiationState: S.String,
  instantiatedVnfInfo: S.optional(GetSolInstantiatedVnfInfo),
  metadata: ListSolFunctionInstanceMetadata,
}) {}
export const ListSolFunctionInstanceResources = S.Array(
  ListSolFunctionInstanceInfo,
);
export class ListSolFunctionPackageInfo extends S.Class<ListSolFunctionPackageInfo>(
  "ListSolFunctionPackageInfo",
)({
  id: S.String,
  arn: S.String,
  onboardingState: S.String,
  operationalState: S.String,
  usageState: S.String,
  vnfdId: S.optional(S.String),
  vnfProvider: S.optional(S.String),
  vnfProductName: S.optional(S.String),
  vnfdVersion: S.optional(S.String),
  metadata: S.optional(ListSolFunctionPackageMetadata),
}) {}
export const ListSolFunctionPackageResources = S.Array(
  ListSolFunctionPackageInfo,
);
export class ListSolNetworkInstanceInfo extends S.Class<ListSolNetworkInstanceInfo>(
  "ListSolNetworkInstanceInfo",
)({
  id: S.String,
  arn: S.String,
  nsInstanceName: S.String,
  nsInstanceDescription: S.String,
  nsdId: S.String,
  nsdInfoId: S.String,
  nsState: S.String,
  metadata: ListSolNetworkInstanceMetadata,
}) {}
export const ListSolNetworkInstanceResources = S.Array(
  ListSolNetworkInstanceInfo,
);
export class ListSolNetworkOperationsInfo extends S.Class<ListSolNetworkOperationsInfo>(
  "ListSolNetworkOperationsInfo",
)({
  id: S.String,
  arn: S.String,
  operationState: S.String,
  nsInstanceId: S.String,
  lcmOperationType: S.String,
  updateType: S.optional(S.String),
  error: S.optional(ProblemDetails),
  metadata: S.optional(ListSolNetworkOperationsMetadata),
}) {}
export const ListSolNetworkOperationsResources = S.Array(
  ListSolNetworkOperationsInfo,
);
export class ListSolNetworkPackageInfo extends S.Class<ListSolNetworkPackageInfo>(
  "ListSolNetworkPackageInfo",
)({
  id: S.String,
  arn: S.String,
  nsdOnboardingState: S.String,
  nsdOperationalState: S.String,
  nsdUsageState: S.String,
  nsdId: S.optional(S.String),
  nsdName: S.optional(S.String),
  nsdVersion: S.optional(S.String),
  nsdDesigner: S.optional(S.String),
  nsdInvariantId: S.optional(S.String),
  vnfPkgIds: S.optional(VnfPkgIdList),
  metadata: ListSolNetworkPackageMetadata,
}) {}
export const ListSolNetworkPackageResources = S.Array(
  ListSolNetworkPackageInfo,
);
export class GetSolVnfcResourceInfoMetadata extends S.Class<GetSolVnfcResourceInfoMetadata>(
  "GetSolVnfcResourceInfoMetadata",
)({
  nodeGroup: S.optional(S.String),
  cluster: S.optional(S.String),
  helmChart: S.optional(S.String),
}) {}
export class GetSolNetworkOperationOutput extends S.Class<GetSolNetworkOperationOutput>(
  "GetSolNetworkOperationOutput",
)({
  id: S.optional(S.String),
  arn: S.String,
  operationState: S.optional(S.String),
  nsInstanceId: S.optional(S.String),
  lcmOperationType: S.optional(S.String),
  updateType: S.optional(S.String),
  error: S.optional(ProblemDetails),
  metadata: S.optional(GetSolNetworkOperationMetadata),
  tasks: S.optional(GetSolNetworkOperationTasksList),
  tags: S.optional(TagMap),
}) {}
export class GetSolNetworkPackageOutput extends S.Class<GetSolNetworkPackageOutput>(
  "GetSolNetworkPackageOutput",
)({
  id: S.String,
  arn: S.String,
  nsdOnboardingState: S.String,
  nsdOperationalState: S.String,
  nsdUsageState: S.String,
  nsdId: S.String,
  nsdName: S.String,
  nsdVersion: S.String,
  vnfPkgIds: VnfPkgIdList,
  metadata: GetSolNetworkPackageMetadata,
  tags: S.optional(TagMap),
}) {}
export class ListSolFunctionInstancesOutput extends S.Class<ListSolFunctionInstancesOutput>(
  "ListSolFunctionInstancesOutput",
)({
  nextToken: S.optional(S.String),
  functionInstances: S.optional(ListSolFunctionInstanceResources),
}) {}
export class ListSolFunctionPackagesOutput extends S.Class<ListSolFunctionPackagesOutput>(
  "ListSolFunctionPackagesOutput",
)({
  nextToken: S.optional(S.String),
  functionPackages: ListSolFunctionPackageResources,
}) {}
export class ListSolNetworkInstancesOutput extends S.Class<ListSolNetworkInstancesOutput>(
  "ListSolNetworkInstancesOutput",
)({
  nextToken: S.optional(S.String),
  networkInstances: S.optional(ListSolNetworkInstanceResources),
}) {}
export class ListSolNetworkOperationsOutput extends S.Class<ListSolNetworkOperationsOutput>(
  "ListSolNetworkOperationsOutput",
)({
  nextToken: S.optional(S.String),
  networkOperations: S.optional(ListSolNetworkOperationsResources),
}) {}
export class ListSolNetworkPackagesOutput extends S.Class<ListSolNetworkPackagesOutput>(
  "ListSolNetworkPackagesOutput",
)({
  nextToken: S.optional(S.String),
  networkPackages: ListSolNetworkPackageResources,
}) {}
export class GetSolVnfcResourceInfo extends S.Class<GetSolVnfcResourceInfo>(
  "GetSolVnfcResourceInfo",
)({ metadata: S.optional(GetSolVnfcResourceInfoMetadata) }) {}
export const GetSolVnfcResourceInfoList = S.Array(GetSolVnfcResourceInfo);
export class GetSolVnfInfo extends S.Class<GetSolVnfInfo>("GetSolVnfInfo")({
  vnfState: S.optional(S.String),
  vnfcResourceInfo: S.optional(GetSolVnfcResourceInfoList),
}) {}
export class GetSolFunctionPackageMetadata extends S.Class<GetSolFunctionPackageMetadata>(
  "GetSolFunctionPackageMetadata",
)({
  vnfd: S.optional(FunctionArtifactMeta),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastModified: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class GetSolFunctionInstanceOutput extends S.Class<GetSolFunctionInstanceOutput>(
  "GetSolFunctionInstanceOutput",
)({
  id: S.String,
  arn: S.String,
  nsInstanceId: S.String,
  vnfPkgId: S.String,
  vnfdId: S.String,
  vnfProvider: S.optional(S.String),
  vnfProductName: S.optional(S.String),
  vnfdVersion: S.optional(S.String),
  instantiationState: S.String,
  instantiatedVnfInfo: S.optional(GetSolVnfInfo),
  metadata: GetSolFunctionInstanceMetadata,
  tags: S.optional(TagMap),
}) {}
export class GetSolFunctionPackageOutput extends S.Class<GetSolFunctionPackageOutput>(
  "GetSolFunctionPackageOutput",
)({
  id: S.String,
  arn: S.String,
  onboardingState: S.String,
  operationalState: S.String,
  usageState: S.String,
  vnfdId: S.optional(S.String),
  vnfProvider: S.optional(S.String),
  vnfProductName: S.optional(S.String),
  vnfdVersion: S.optional(S.String),
  metadata: S.optional(GetSolFunctionPackageMetadata),
  tags: S.optional(TagMap),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
) {}

//# Operations
/**
 * Untags an AWS TNB resource.
 *
 * A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your Amazon Web Services costs.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Cancels a network operation.
 *
 * A network operation is any operation that is done to your network, such as network instance instantiation or termination.
 */
export const cancelSolNetworkOperation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelSolNetworkOperationInput,
    output: CancelSolNetworkOperationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a network package.
 *
 * A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on. For more information, see Network instances in the
 * *Amazon Web Services Telco Network Builder User Guide*.
 *
 * A network package consists of a network service descriptor (NSD) file (required) and any
 * additional files (optional), such as scripts specific to your needs. For example, if you
 * have multiple function packages in your network package, you can use the NSD to define
 * which network functions should run in certain VPCs, subnets, or EKS clusters.
 *
 * This request creates an empty network package container with an ID. Once you create a
 * network package, you can upload the network package content using PutSolNetworkPackageContent.
 */
export const createSolNetworkPackage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSolNetworkPackageInput,
    output: CreateSolNetworkPackageOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a function package.
 *
 * A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
 *
 * To delete a function package, the package must be in a disabled state. To disable a
 * function package, see UpdateSolFunctionPackage.
 */
export const deleteSolFunctionPackage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSolFunctionPackageInput,
    output: DeleteSolFunctionPackageResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a network instance.
 *
 * A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed.
 *
 * To delete a network instance, the instance must be in a stopped or terminated state. To
 * terminate a network instance, see TerminateSolNetworkInstance.
 */
export const deleteSolNetworkInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSolNetworkInstanceInput,
    output: DeleteSolNetworkInstanceResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes network package.
 *
 * A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
 *
 * To delete a network package, the package must be in a disable state. To disable a
 * network package, see UpdateSolNetworkPackage.
 */
export const deleteSolNetworkPackage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSolNetworkPackageInput,
    output: DeleteSolNetworkPackageResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets the contents of a function package.
 *
 * A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
 */
export const getSolFunctionPackageContent =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetSolFunctionPackageContentInput,
    output: GetSolFunctionPackageContentOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Gets a function package descriptor in a function package.
 *
 * A function package descriptor is a .yaml file in a function package that uses the TOSCA standard to describe how the network function in the function package should run on your network.
 *
 * A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
 */
export const getSolFunctionPackageDescriptor =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetSolFunctionPackageDescriptorInput,
    output: GetSolFunctionPackageDescriptorOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Gets the contents of a network package.
 *
 * A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
 */
export const getSolNetworkPackageContent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSolNetworkPackageContentInput,
    output: GetSolNetworkPackageContentOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets the content of the network service descriptor.
 *
 * A network service descriptor is a .yaml file in a network package that uses the TOSCA standard to describe the network functions you want to deploy and the Amazon Web Services infrastructure you want to deploy the network functions on.
 */
export const getSolNetworkPackageDescriptor =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetSolNetworkPackageDescriptorInput,
    output: GetSolNetworkPackageDescriptorOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Instantiates a network instance.
 *
 * A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed.
 *
 * Before you can instantiate a network instance, you have to create a network instance.
 * For more information, see CreateSolNetworkInstance.
 */
export const instantiateSolNetworkInstance =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: InstantiateSolNetworkInstanceInput,
    output: InstantiateSolNetworkInstanceOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists tags for AWS TNB resources.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Tags an AWS TNB resource.
 *
 * A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your Amazon Web Services costs.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Terminates a network instance.
 *
 * A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed.
 *
 * You must terminate a network instance before you can delete it.
 */
export const terminateSolNetworkInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: TerminateSolNetworkInstanceInput,
    output: TerminateSolNetworkInstanceOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the operational state of function package.
 *
 * A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
 */
export const updateSolFunctionPackage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSolFunctionPackageInput,
    output: UpdateSolFunctionPackageOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the operational state of a network package.
 *
 * A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
 *
 * A network service descriptor is a .yaml file in a network package that uses the TOSCA standard to describe the network functions you want to deploy and the Amazon Web Services infrastructure you want to deploy the network functions on.
 */
export const updateSolNetworkPackage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSolNetworkPackageInput,
    output: UpdateSolNetworkPackageOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a function package.
 *
 * A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network. For more information, see Function packages in the
 * *Amazon Web Services Telco Network Builder User Guide*.
 *
 * Creating a function package is the first step for creating a network in AWS TNB. This
 * request creates an empty container with an ID. The next step is to upload the actual CSAR
 * zip file into that empty container. To upload function package content, see PutSolFunctionPackageContent.
 */
export const createSolFunctionPackage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSolFunctionPackageInput,
    output: CreateSolFunctionPackageOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a network instance.
 *
 * A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed. Creating a network instance is the third step after creating a network
 * package. For more information about network instances, Network instances in the
 * *Amazon Web Services Telco Network Builder User Guide*.
 *
 * Once you create a network instance, you can instantiate it. To instantiate a network,
 * see InstantiateSolNetworkInstance.
 */
export const createSolNetworkInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSolNetworkInstanceInput,
    output: CreateSolNetworkInstanceOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets the details of the network instance.
 *
 * A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed.
 */
export const getSolNetworkInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSolNetworkInstanceInput,
    output: GetSolNetworkInstanceOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Uploads the contents of a function package.
 *
 * A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
 */
export const putSolFunctionPackageContent =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutSolFunctionPackageContentInput,
    output: PutSolFunctionPackageContentOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Uploads the contents of a network package.
 *
 * A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
 */
export const putSolNetworkPackageContent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutSolNetworkPackageContentInput,
    output: PutSolNetworkPackageContentOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Update a network instance.
 *
 * A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed.
 *
 * Choose the *updateType* parameter to target the necessary update of the network instance.
 */
export const updateSolNetworkInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSolNetworkInstanceInput,
    output: UpdateSolNetworkInstanceOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Validates function package content. This can be used as a dry run before uploading
 * function package content with PutSolFunctionPackageContent.
 *
 * A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
 */
export const validateSolFunctionPackageContent =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ValidateSolFunctionPackageContentInput,
    output: ValidateSolFunctionPackageContentOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Validates network package content. This can be used as a dry run before uploading
 * network package content with PutSolNetworkPackageContent.
 *
 * A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
 */
export const validateSolNetworkPackageContent =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ValidateSolNetworkPackageContentInput,
    output: ValidateSolNetworkPackageContentOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Gets the details of a network operation, including the tasks involved in the network
 * operation and the status of the tasks.
 *
 * A network operation is any operation that is done to your network, such as network instance instantiation or termination.
 */
export const getSolNetworkOperation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSolNetworkOperationInput,
    output: GetSolNetworkOperationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets the details of a network package.
 *
 * A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
 */
export const getSolNetworkPackage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSolNetworkPackageInput,
    output: GetSolNetworkPackageOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists network function instances.
 *
 * A network function instance is a function in a function package .
 */
export const listSolFunctionInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSolFunctionInstancesInput,
    output: ListSolFunctionInstancesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists information about function packages.
 *
 * A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
 */
export const listSolFunctionPackages = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSolFunctionPackagesInput,
    output: ListSolFunctionPackagesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists your network instances.
 *
 * A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed.
 */
export const listSolNetworkInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSolNetworkInstancesInput,
    output: ListSolNetworkInstancesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists details for a network operation, including when the operation started and the
 * status of the operation.
 *
 * A network operation is any operation that is done to your network, such as network instance instantiation or termination.
 */
export const listSolNetworkOperations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSolNetworkOperationsInput,
    output: ListSolNetworkOperationsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists network packages.
 *
 * A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
 */
export const listSolNetworkPackages = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSolNetworkPackagesInput,
    output: ListSolNetworkPackagesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets the details of a network function instance, including the instantiation state and
 * metadata from the function package descriptor in the network function package.
 *
 * A network function instance is a function in a function package .
 */
export const getSolFunctionInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSolFunctionInstanceInput,
    output: GetSolFunctionInstanceOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets the details of an individual function package, such as the operational state and
 * whether the package is in use.
 *
 * A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network..
 */
export const getSolFunctionPackage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSolFunctionPackageInput,
    output: GetSolFunctionPackageOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
